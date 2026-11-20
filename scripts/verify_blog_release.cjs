'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const vm = require('node:vm');
const { chromium } = require('playwright');
const root = path.resolve(process.argv[2]);
const articles = JSON.parse(fs.readFileSync(path.join(root, 'radar-sao-jose-30-artigos.json'), 'utf8')).articles;
const output = path.resolve(__dirname, '../tmp/blog-release');
fs.mkdirSync(output, { recursive: true });
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.ico': 'image/x-icon', '.xml': 'application/xml', '.txt': 'text/plain' };
const server = http.createServer((req, res) => {
  const parsed = new URL(req.url, 'http://localhost');
  let requestPath = decodeURIComponent(parsed.pathname);
  if (requestPath === '/artigo.html' && articles.some(a => a.slug === parsed.searchParams.get('slug'))) {
    res.writeHead(308, { Location: '/artigos/' + parsed.searchParams.get('slug') + '.html' }); return res.end();
  }
  if (/^\/(artigo|artigos)\/[^/]+$/.test(requestPath) && !requestPath.endsWith('.html')) {
    res.writeHead(308, { Location: requestPath.replace('/artigo/', '/artigos/') + '.html' }); return res.end();
  }
  const filename = path.resolve(root, '.' + (requestPath === '/' ? '/index.html' : requestPath));
  if (!filename.startsWith(root + path.sep) || !types[path.extname(filename)] || !fs.existsSync(filename) || !fs.statSync(filename).isFile()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': types[path.extname(filename)] });
  fs.createReadStream(filename).pipe(res);
});
(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = 'http://127.0.0.1:' + server.address().port;
  let browser;
  try {
    const config = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
    assert.equal(config.redirects.filter(r => r.source === '/artigo.html').length, 30);
    assert.ok(!config.rewrites.some(r => r.source.startsWith('/artigos/')));
    for (const a of articles) {
      const response = await fetch(base + '/artigos/' + a.slug + '.html');
      assert.equal(response.status, 200);
      const html = await response.text();
      assert.equal((html.match(/<h1>/g) || []).length, 1);
      assert.ok(html.includes(a.title.replace(/&/g, '&amp;')));
      assert.ok(!html.includes('Ficha interna'));
      const schema = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
      assert.equal(schema['@graph'][0]['@type'], 'BlogPosting');
      assert.equal(schema['@graph'][0].headline, a.title);
      assert.ok(schema['@graph'][0].image.url.startsWith('https://radarsaojose.vercel.app/web-media/blog/'));
      assert.equal(schema['@graph'][1].itemListElement.length, 3);
      assert.equal(new Set(a.internal_links).size, 3);
      for (const link of a.internal_links) assert.ok(fs.existsSync(path.join(root, link)));
      assert.ok(fs.existsSync(path.join(root, a.cover_image_url)));
    }
    assert.equal((await fetch(base + '/artigos/nao-existe.html')).status, 404);
    const ctx = { window: {} };
    vm.runInNewContext(fs.readFileSync(path.join(root, 'blog-editorial.js'), 'utf8'), ctx);
    assert.equal(ctx.window.RADAR_EDITORIAL_POSTS.length, 30);
    assert.ok(ctx.window.RADAR_EDITORIAL_POSTS.every(p => !p.content));
    console.log('HTTP e SEO: 30 artigos, imagens, relações, JSON-LD, aliases e 404 conferidos.');
    browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
    const context = await browser.newContext({ viewport: { width: 1366, height: 900 } });
    await context.route('**/*', route => {
      const request = route.request();
      const host = new URL(request.url()).hostname;
      if (host !== '127.0.0.1' && ['fetch','xhr'].includes(request.resourceType())) return route.abort();
      return route.continue();
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(base + '/blog.html', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForFunction(() => document.querySelectorAll('#articlesGrid .article-card').length === 30);
    assert.equal(await page.locator('#articleCount').textContent(), '30');
    assert.equal(await page.locator('#heroTitleLink').textContent(), articles[0].title);
    await page.screenshot({ path: path.join(output, 'blog-desktop.png'), fullPage: false });
    await page.locator('#searchInput').fill('aluguel');
    await page.locator('#searchInput').press('Enter');
    await page.waitForTimeout(300);
    assert.ok(await page.locator('#articlesGrid .article-card:visible').count() > 0);
    assert.ok(await page.locator('#articlesGrid .article-card:visible').count() < 30);
    await page.goto(base + '/editoria.html?cat=moradia', { waitUntil: 'domcontentloaded', timeout: 60000 });
    assert.ok(await page.locator('#articlesGrid .article-card').count() > 0);
    const samples = ['quanto-custa-morar-sao-jose-dos-campos', 'onde-estao-hospitais-unidades-sjc', 'inovacao-empregos-empresas'];
    for (const slug of samples) {
      await page.goto(base + '/artigos/' + slug + '.html', { waitUntil: 'load' });
      assert.equal(await page.locator('h1').count(), 1);
      assert.ok(await page.locator('figure img').evaluate(img => img.complete && img.naturalWidth > 0));
      assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://radarsaojose.vercel.app/artigos/' + slug + '.html');
      const before = new URL(page.url()).pathname;
      await page.locator('.toc summary').click();
      await page.locator('.toc a').first().click();
      assert.equal(new URL(page.url()).pathname, before);
    }
    await page.goto(base + '/artigos/quanto-custa-morar-sao-jose-dos-campos.html', { waitUntil: 'load' });
    await page.screenshot({ path: path.join(output, 'artigo-desktop.png'), fullPage: false });
    assert.equal(await page.locator('.report-callout').count(), 1);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(base + '/blog.html', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(800);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.screenshot({ path: path.join(output, 'blog-mobile.png') });
    await page.goto(base + '/artigos/quanto-custa-morar-sao-jose-dos-campos.html', { waitUntil: 'load' });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.screenshot({ path: path.join(output, 'artigo-mobile.png') });
    assert.deepEqual(errors, []);
    console.log('Navegador: blog, busca, editoria, artigos, sumário e telas móveis passaram; nenhum erro JavaScript.');
  } finally {
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(e => { console.error(e); process.exitCode = 1; });
