'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { gunzipSync } = require('node:zlib');
const { extractReportArticles, prepareReport, buildImportSql } = require('../scripts/prepare-private-report.cjs');
const shell = '<article id="rep-a" data-report-placeholder></article><article id="rep-b" data-report-placeholder></article>';
const first = '<article id="rep-a" data-report-block="1"><h2>São José</h2><article class="card">Comparação</article><p>Fim do capítulo</p></article>';
const second = '<article id="rep-b" data-report-section="sources" class="[&>p]:text-sm"><p>Referências</p></article>';

test('Private Report packaging preserves nested cards, source HTML and destination order', () => {
  const source = '<article id="public-cover">Capa pública</article>' + second + first;
  const report = extractReportArticles(source, shell);
  assert.deepEqual(report.ids, ['rep-a', 'rep-b']);
  assert.equal(report.html, first + '\n' + second);
  assert.doesNotMatch(report.html, /Capa pública/);
  assert.equal(report.bytes, Buffer.byteLength(report.html, 'utf8'));
  assert.match(report.sha256, /^[a-f0-9]{64}$/);
});

test('Incomplete, duplicated, nested pages and oversized Report packages are rejected', () => {
  assert.throws(() => extractReportArticles(first, shell), /Missing/);
  assert.throws(() => extractReportArticles(first + first + second, shell), /Duplicate/);
  assert.throws(() => extractReportArticles('<article id="rep-a" data-report-block="1">' + second + '</article>', shell), /nested/);
  assert.throws(() => extractReportArticles(first + second.slice(0, -10), shell), /Unclosed/);
  assert.throws(() => extractReportArticles(first.replace('São José', 'á'.repeat(1600000)) + second, shell), /limit/);
  assert.throws(() => prepareReport(first + second, shell), /map script/);
  assert.throws(() => prepareReport(first.replace('</h2>', '</h2><script>unapproved()</script>') + second, shell), /map script/);
});

test('Private SQL import round-trips Unicode and quote characters without embedding raw HTML', () => {
  const html = first.replace('São José', "São José — d'água; $$ DROP TABLE public.profiles;") + second;
  const report = extractReportArticles(html, shell);
  const sql = buildImportSql(report, 'a'.repeat(40));
  assert.doesNotMatch(sql, /DROP TABLE|<article/);
  const packed = sql.match(/'gzip:([A-Za-z0-9+/=]+)'/)[1];
  assert.equal(gunzipSync(Buffer.from(packed, 'base64')).toString('utf8'), report.html);
  assert.match(sql, /BEGIN;[\s\S]*ON CONFLICT \(slug\) DO UPDATE[\s\S]*COMMIT;/);
  assert.throws(() => buildImportSql(report, 'not-a-commit'), /Invalid source commit/);
});

test('The release tool refuses to write paid content into a repository', () => {
  const { spawnSync } = require('node:child_process');
  const path = require('node:path');
  const result = spawnSync(process.execPath, [path.join(__dirname, '../scripts/prepare-private-report.cjs'),
    '--source-ref', 'HEAD', '--output-dir', path.join(__dirname, '../private-release-test')], { encoding: 'utf8' });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /outside the repository/);
});
