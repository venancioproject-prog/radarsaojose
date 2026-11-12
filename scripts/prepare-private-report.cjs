'use strict';
// Offline preparation only: never connects to a database or publishes content.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync, spawnSync } = require('node:child_process');
const { gzipSync } = require('node:zlib');
const approvedMapHash = '6b59fd243f900b89516247c946a26bb5e216daf13e2b51f91917783022a3efa9';
const maxBytes = 3 * 1024 * 1024;
const hash = text => crypto.createHash('sha256').update(text).digest('hex');

function extractReportArticles(source, shell) {
  const expected = [...shell.matchAll(/<article\b[^>]*\bid="([^"]+)"[^>]*\bdata-report-placeholder(?:\s|>)/g)].map(m => m[1]);
  if (!expected.length || new Set(expected).size !== expected.length) throw new Error('Invalid destination placeholders');
  const selected = new Map();
  const stack = [];
  // Respect nested editorial cards, quoted > characters, comments and script text.
  const tokens = /<!--[\s\S]*?-->|<script\b(?:[^>"']|"[^"]*"|'[^']*')*>[\s\S]*?<\/script\s*>|<article\b(?:[^>"']|"[^"]*"|'[^']*')*>|<\/article\s*>/gi;
  for (const token of source.matchAll(tokens)) {
    if (/^<!--|^<script\b/i.test(token[0])) continue;
    if (/^<article\b/i.test(token[0])) {
      const id = token[0].match(/\bid=["']([^"']+)["']/i)?.[1];
      const wanted = expected.includes(id);
      if (wanted && (selected.has(id) || stack.some(parent => parent.wanted))) {
        throw new Error('Duplicate or nested Report page: ' + id);
      }
      if (wanted && !/\bdata-report-(?:block|section)=/.test(token[0])) {
        throw new Error('Invalid Report article: ' + id);
      }
      stack.push({ id, wanted, start: token.index });
    } else {
      const article = stack.pop();
      if (!article) throw new Error('Unbalanced article closing tag');
      if (article.wanted) selected.set(article.id, source.slice(article.start, token.index + token[0].length));
    }
  }
  if (stack.length) throw new Error('Unclosed Report article');
  const missing = expected.filter(id => !selected.has(id));
  if (missing.length) throw new Error('Missing Report articles: ' + missing.join(', '));
  const html = expected.map(id => selected.get(id)).join('\n');
  if (Buffer.byteLength(html, 'utf8') > maxBytes) throw new Error('Report exceeds the API decompression limit');
  return { html, ids: expected, sha256: hash(html), bytes: Buffer.byteLength(html, 'utf8') };
}

function prepareReport(source, shell) {
  const result = extractReportArticles(source, shell);
  const { html } = result;
  const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)];
  if (scripts.length !== 1 || scripts[0][1].trim() || hash(scripts[0][2]) !== approvedMapHash ||
      !extractReportArticles(html, '<article id="rep-tela-037" data-report-placeholder>')?.html.includes(scripts[0][0])) {
    throw new Error('Report map script differs from the approved loader');
  }
  return result;
}

function buildImportSql(report, commit) {
  if (!/^[a-f0-9]{40}$/.test(commit)) throw new Error('Invalid source commit');
  const packed = 'gzip:' + gzipSync(report.html).toString('base64');
  return '-- PRIVATE REPORT: review and back up the existing record before applying.\n' +
    '-- Source commit: ' + commit + '\n-- HTML SHA-256: ' + report.sha256 + '\n' +
    "BEGIN;\nSET LOCAL lock_timeout = '5s';\n" +
    "INSERT INTO public.report_private_documents(slug, chapters_html)\nVALUES ('radar-2026', '" + packed + "')\n" +
    'ON CONFLICT (slug) DO UPDATE SET chapters_html = EXCLUDED.chapters_html;\nCOMMIT;\n';
}

function run(args) {
  if (args.length !== 4 || args[0] !== '--source-ref' || args[2] !== '--output-dir') {
    throw new Error('Usage: node scripts/prepare-private-report.cjs --source-ref COMMIT --output-dir ABSOLUTE_PRIVATE_DIRECTORY');
  }
  const repo = path.resolve(__dirname, '..');
  const outputDir = path.resolve(args[3]);
  const relative = path.relative(repo, outputDir);
  if (!path.isAbsolute(args[3]) || !relative || (!relative.startsWith('..' + path.sep) && !path.isAbsolute(relative))) {
    throw new Error('Output must be an absolute private directory outside the repository');
  }
  let existingParent = outputDir;
  while (!fs.existsSync(existingParent)) existingParent = path.dirname(existingParent);
  const gitParent = spawnSync('git', ['-C', existingParent, 'rev-parse', '--is-inside-work-tree'], { encoding: 'utf8' });
  if (gitParent.status === 0 && gitParent.stdout.trim() === 'true') {
    throw new Error('Private output cannot be inside any Git working tree');
  }
  if (!/^[a-zA-Z0-9][a-zA-Z0-9._/-]{0,180}$/.test(args[1])) throw new Error('Invalid Git reference');
  const commit = execFileSync('git', ['rev-parse', '--verify', args[1] + '^{commit}'], { cwd: repo, encoding: 'utf8' }).trim();
  const source = execFileSync('git', ['show', commit + ':app.html'], { cwd: repo, encoding: 'utf8', maxBuffer: 12 * 1024 * 1024 });
  const shell = fs.readFileSync(path.join(repo, 'app.html'), 'utf8');
  const report = prepareReport(source, shell);
  const sql = buildImportSql(report, commit);
  fs.mkdirSync(path.dirname(outputDir), { recursive: true });
  // Exclusive directory creation prevents overwriting any previous release package.
  fs.mkdirSync(outputDir);
  fs.writeFileSync(path.join(outputDir, 'report-chapters.html'), report.html, { flag: 'wx' });
  fs.writeFileSync(path.join(outputDir, 'report-import.sql'), sql, { flag: 'wx' });
  const manifest = { sourceCommit: commit, createdAt: new Date().toISOString(),
    articleCount: report.ids.length, articleIds: report.ids, htmlBytes: report.bytes,
    htmlSha256: report.sha256, sourceSha256: hash(source), sqlSha256: hash(sql),
    databaseModified: false, publicationPerformed: false, editorialApprovalRequired: true };
  fs.writeFileSync(path.join(outputDir, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n', { flag: 'wx' });
  console.log(JSON.stringify({ outputDir, sourceCommit: commit, articleCount: report.ids.length,
    htmlSha256: report.sha256, databaseModified: false }));
}

if (require.main === module) {
  try { run(process.argv.slice(2)); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
module.exports = { prepareReport, extractReportArticles, buildImportSql };
