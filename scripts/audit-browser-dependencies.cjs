'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'data/browser-dependencies.json'), 'utf8'));

function publicPages() {
  return execFileSync('git', ['ls-files', '-z', '--', '*.html'], { cwd: root, encoding: 'utf8' })
    .split('\0').filter(file => file && file !== 'Landing page.html' && (!file.includes('/') || file.startsWith('artigos/')));
}
function validate() {
  const known = new Map();
  for (const entry of manifest.entries) {
    if (known.has(entry.src) || !/^\d+\.\d+\.\d+$/.test(entry.version) ||
        !/^sha384-[A-Za-z0-9+/]{64}$/.test(entry.integrity)) throw new Error('Invalid browser dependency manifest');
    known.set(entry.src, entry);
    if (entry.src.startsWith('/')) {
      const bytes = fs.readFileSync(path.join(root, entry.src));
      const actual = 'sha384-' + crypto.createHash('sha384').update(bytes).digest('base64');
      if (actual !== entry.integrity || bytes.length !== entry.bytes) throw new Error('Local library bytes changed: ' + entry.src);
    }
  }
  let scripts = 0;
  const pages = publicPages();
  for (const file of pages) {
    const html = fs.readFileSync(path.join(root, file), 'utf8');
    for (const match of html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"[^>]*>/gi)) {
      const src = match[1];
      if (!/^https?:\/\//i.test(src) && !src.startsWith('/vendor/')) continue;
      const entry = known.get(src);
      if (!entry || !match[0].includes('integrity="' + entry.integrity + '"') ||
          !match[0].includes('crossorigin="anonymous"')) throw new Error('Unpinned or unsigned library in ' + file);
      scripts += 1;
    }
  }
  return { pages: pages.length, uniqueLibraries: known.size, scriptReferences: scripts };
}

async function auditOnline(fetchImpl = fetch) {
  const packages = [...new Map(manifest.entries.map(e => [e.package + '@' + e.version, e])).values()];
  const response = await fetchImpl('https://api.osv.dev/v1/querybatch', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, redirect: 'error',
    signal: AbortSignal.timeout(20000),
    body: JSON.stringify({ queries: packages.map(e => ({ package: { ecosystem: 'npm', name: e.package }, version: e.version })) })
  });
  if (!response.ok) throw new Error('Dependency advisory service unavailable');
  const body = await response.json();
  if (!Array.isArray(body.results) || body.results.length !== packages.length) throw new Error('Incomplete advisory response');
  const findings = body.results.flatMap((result, index) => {
    if (result.next_page_token) throw new Error('Advisory pagination requires review');
    return (result.vulns || []).map(v => ({ package: packages[index].package, version: packages[index].version, advisory: v.id }));
  });
  if (findings.length) throw new Error('Browser dependencies require review: ' + JSON.stringify(findings));
  return { checkedPackages: packages.length, advisoriesFound: 0,
    scope: 'Direct browser packages only; embedded transitive versions and new/unknown vulnerabilities are not certified.' };
}

if (require.main === module) {
  (async () => {
    console.log(JSON.stringify(validate()));
    if (process.argv.includes('--online')) console.log(JSON.stringify(await auditOnline()));
  })().catch(error => { console.error(error.message); process.exitCode = 1; });
}
module.exports = { validate, auditOnline, publicPages };
