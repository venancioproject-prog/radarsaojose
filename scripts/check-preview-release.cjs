'use strict';
// Read-only checks against the named integration Preview. No credentials or forms.
const crypto = require('node:crypto');
const { buildPolicy } = require('./build-browser-csp.cjs');
const defaultBase = 'https://radarsaojose-git-codex-radar-integracao-tagma.vercel.app';
function previewBase(args = []) {
  if (!args.length) return defaultBase;
  if (args.length !== 2 || args[0] !== '--base-url') throw Error('Usage: --base-url https://PREVIEW.vercel.app');
  const url = new URL(args[1]);
  if (url.protocol !== 'https:' || !url.hostname.endsWith('.vercel.app') || url.username || url.password ||
      url.port || url.pathname !== '/' || url.search || url.hash) throw Error('Expected a Vercel Preview origin');
  return url.origin;
}
let base;
const manifest = require('../data/browser-dependencies.json');
async function get(route) {
  return fetch(base + route, { redirect: 'error', signal: AbortSignal.timeout(20000) });
}
async function main(args = []) {
  base = previewBase(args);
  const checks = [];
  const configuration = await get('/api/asaas-checkout?browserConfig=1');
  const script = await configuration.text();
  const declared = script.match(/window\.radarSupabaseConfig\s*=\s*({[\s\S]*?});/);
  if (configuration.status !== 200 || !declared) throw Error('Missing browser configuration');
  const config = JSON.parse(declared[1]);
  if (config.preview !== true || new URL(config.url).hostname !== 'zidlawqyqlysecsweggn.supabase.co') {
    throw Error('Preview is not configured for the isolated test database');
  }
  checks.push({ route: '/api/asaas-checkout?browserConfig=1', status: 200, testDatabase: 'verified' });
  const pages = ['/login.html?cadastro=1', '/recuperar-senha.html', '/app.html', '/artigo.html', '/admin-crm.html'];
  for (const route of pages) {
    const response = await get(route);
    if (response.status !== 200) throw Error('Page unavailable: ' + route);
    if (response.headers.get('content-security-policy') !== buildPolicy()) throw Error('Unexpected CSP: ' + route);
    if (!/max-age=31536000/.test(response.headers.get('strict-transport-security') || '')) throw Error('Missing HSTS');
    if (response.headers.get('x-content-type-options') !== 'nosniff') throw Error('Missing nosniff');
    const html = await response.text();
    for (const tag of html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"[^>]*>/gi)) {
      if (!/^https:\/\//.test(tag[1]) && !tag[1].startsWith('/vendor/')) continue;
      // The hosting toolbar is injected independently of application HTML.
      if (tag[1].startsWith('https://vercel.live/_next-live/')) continue;
      const entry = manifest.entries.find(e => e.src === tag[1]);
      if (!entry || !tag[0].includes(entry.integrity)) throw Error('Unexpected library on ' + route);
    }
    checks.push({ route, status: response.status, headers: 'verified', scriptIntegrity: 'declared' });
  }
  for (const entry of manifest.entries.filter(e => e.src.startsWith('/vendor/'))) {
    const response = await get(entry.src);
    const bytes = Buffer.from(await response.arrayBuffer());
    if (response.status !== 200 || 'sha384-' + crypto.createHash('sha384').update(bytes).digest('base64') !== entry.integrity) throw Error('Published library bytes mismatch: ' + entry.src);
    checks.push({ route: entry.src, status: 200, bytes: bytes.length, integrity: 'verified' });
  }
  for (const route of ['/.git/HEAD', '/.env', '/.env.local', '/dados_pesquisa_477.json', '/SECURITY_REVIEW.md', '/data/migrations/024_private_survey_responses.sql', '/Landing%20page.html', '/scripts/benchmark-survey-local.cjs']) {
    const response = await get(route);
    if (response.status !== 404) throw Error('Restricted file is not absent: ' + route);
    checks.push({ route, status: 404 });
    await response.body?.cancel();
  }
  for (const route of ['/api/crm-accounts', '/api/media', '/api/asaas-webhook?emailQueue=1']) {
    const response = await get(route);
    const expected = route.includes('emailQueue') ? 405 : 401;
    if (response.status !== expected) throw Error('Unexpected anonymous response: ' + route + ': ' + response.status);
    checks.push({ route, status: response.status });
    await response.body?.cancel();
  }
  console.log(JSON.stringify({ checkedAt: new Date().toISOString(), base, environment: 'isolated Preview only', mutations: false, checks }, null, 2));
}
if (require.main === module) main(process.argv.slice(2)).catch(error => { console.error(error.message); process.exitCode = 1; });
module.exports = { main, previewBase };
