'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { publicPages } = require('./audit-browser-dependencies.cjs');
const root = path.resolve(__dirname, '..');
const scriptHash = body => "'sha256-" + crypto.createHash('sha256').update(body.replace(/\r\n?/g, '\n')).digest('base64') + "'";

function buildPolicy() {
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'data/browser-dependencies.json'), 'utf8'));
  const sources = new Set(["'self'"]);
  for (const entry of manifest.entries) if (entry.src.startsWith('https://')) sources.add(entry.src);
  // Preview toolbar provided by the hosting platform; not an application CDN.
  sources.add('https://vercel.live/_next-live/');
  const hashes = new Set();
  for (const file of publicPages()) {
    for (const script of fs.readFileSync(path.join(root, file), 'utf8').matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
      if (/\bsrc\s*=/.test(script[1]) || /\btype=["']application\/(?:ld\+)?json/i.test(script[1]) || !script[2].trim()) continue;
      hashes.add(scriptHash(script[2]));
    }
  }
  const loader = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
  const reportHash = loader.match(/if \(hash !== '([a-f0-9]{64})'/)?.[1];
  if (!reportHash) throw new Error('Approved private Report script hash is missing');
  hashes.add("'sha256-" + Buffer.from(reportHash, 'hex').toString('base64') + "'");
  const policy = "object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'; script-src " +
    [...sources, ...[...hashes].sort()].join(' ') + "; script-src-attr 'unsafe-inline'";
  if (Buffer.byteLength(policy) > 7000) throw new Error('CSP header needs per-page splitting before publication');
  return policy;
}

if (require.main === module) {
  const filename = path.join(root, 'vercel.json');
  const config = JSON.parse(fs.readFileSync(filename, 'utf8'));
  const header = config.headers.find(rule => rule.source === '/(.*)').headers
    .find(header => header.key === 'Content-Security-Policy');
  header.value = buildPolicy();
  fs.writeFileSync(filename, JSON.stringify(config, null, 2) + '\n');
  console.log(JSON.stringify({ cspBytes: Buffer.byteLength(header.value), unsafeEvalAllowed: false,
    inlineScriptElements: 'approved hashes only', inlineAttributes: 'legacy handlers retained' }));
}
module.exports = { buildPolicy, scriptHash };
