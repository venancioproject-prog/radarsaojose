'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const store = require('../lib/billing-store');
const handler = require('../api/survey-preview');
const report = require('../api/survey-report');

function request(method = 'GET', query = {}, headers = {}, route = handler, body) {
  const result = { headers: {} };
  const response = {
    setHeader(name, value) { result.headers[name] = value; },
    status(status) { result.status = status; return this; },
    json(body) { result.body = body; }
  };
  return route({ method, query, headers, body }, response).then(() => result);
}

function encodeRows(path, rows) {
  const select = new URLSearchParams(path.split('?')[1]).get('select');
  const aliases = [...select.matchAll(/(q\d+):"([^"]+)"/g)];
  return rows.map(row => ({ id: row.id, ...Object.fromEntries(aliases.map(([, alias, field]) => [alias, row[field]])) }));
}

test('survey preview delivers only the public chart distributions and suppresses small cells', async t => {
  const row = {
    id: 123,
    'Como você se identifica?': 'Homem Cis',
    'Qual a sua idade?': '30 a 39 anos',
    'Na política, você se sente mais próximo de qual lado?': 'private marker',
    'Carimbo de data/hora': 'private timestamp'
  };
  const db = t.mock.method(store, 'db', async path => encodeRows(path, [
    ...Array.from({ length: 10 }, () => row),
    { ...row, 'Como você se identifica?': 'Mulher', 'Qual a sua idade?': '18 a 24 anos' }
  ]));
  const result = await request();
  assert.equal(result.status, 200);
  assert.equal(result.headers['Cache-Control'], 'no-store');
  assert.deepEqual(result.body.charts['Como você se identifica?'], [{ label: 'Homem', count: 10 }]);
  assert.deepEqual(result.body.charts['Qual a sua idade?'], [{ label: '30 a 39 anos', count: 10 }]);
  assert.equal(result.body.charts['Na política, você se sente mais próximo de qual lado?'], undefined);
  assert.equal(result.body.questions.length, 9);
  assert.deepEqual(result.body.questions.slice(-3), [
    'De 1 a 5, que nota você dá para a qualidade de vida em São José?',
    'Para você, São José é:',
    'Para você, a cidade de São José está:'
  ]);
  assert.deepEqual(Object.keys(result.body.options), ['age']);
  assert.equal(result.body.kpis, undefined);
  assert.equal(result.body.flowPairs, undefined);
  assert.equal(result.body.reference, undefined);
  assert.doesNotMatch(decodeURIComponent(db.mock.calls[0].arguments[0]), /mais falta|política|orgulho/);
  assert.doesNotMatch(JSON.stringify(result.body), /private|123|18 a 24/);
  assert.doesNotMatch(decodeURIComponent(db.mock.calls[0].arguments[0]), /Carimbo|select=\*/);
  const narrow = await request('GET', { age: '18 a 24 anos' });
  assert.equal(narrow.body.count, 0);
  assert.deepEqual(narrow.body.charts['Qual a sua idade?'], []);
});

test('survey preview rejects caller-controlled columns and filters before accessing storage', async t => {
  const db = t.mock.method(store, 'db', async () => []);
  assert.equal((await request('GET', { select: '*' })).status, 400);
  assert.equal((await request('GET', { id: '123' })).status, 400);
  assert.equal((await request('GET', { age: '18 a 24 anos', politics: 'Centro' })).status, 400);
  assert.equal((await request('POST')).status, 405);
  assert.equal(db.mock.callCount(), 0);
});

test('survey preview keeps storage errors private', async t => {
  t.mock.method(store, 'db', async () => { throw new Error('private connection details'); });
  const result = await request();
  assert.equal(result.status, 503);
  assert.deepEqual(result.body, { code: 'SURVEY_PREVIEW_UNAVAILABLE' });
});

test('paid research is gated by the verified account, and Report requires Report or above', async t => {
  let plan = 'dash';
  let status = 'active';
  const politicalQuestion = 'Na política, você se sente mais próximo de qual lado?';
  const rows = Array.from({ length: 24 }, (_, index) => ({
    id: index + 1, [politicalQuestion]: 'Centro',
    'Você tem orgulho de morar em São José dos Campos?': 'Sim',
    'Tem algo que queira falar e não abordamos na pesquisa?': 'private marker, trânsito'
  }));
  t.mock.method(store, 'authenticate', async () => ({ id: 'test-user', app_metadata: {} }));
  t.mock.method(store, 'subscription', async () => ({
    status, plan_type: plan, period_start: '2020-01-01', period_end: '2099-01-01'
  }));
  t.mock.method(store, 'db', async path => path.startsWith('respostas_pesquisa?') ? encodeRows(path, rows) : []);
  const headers = { authorization: 'Bearer test' };
  const dash = await request('GET', {}, headers);
  assert.equal(dash.body.full, true);
  assert.deepEqual(dash.body.charts[politicalQuestion], [{ label: 'Centro', count: 24 }]);
  assert.doesNotMatch(JSON.stringify(dash.body), /private marker/);
  assert.equal((await request('POST', {}, headers, report)).status, 403);
  plan = 'report';
  const aggregate = await request('POST', {}, headers, report, { specs: [{ name: 'pride' }, { field: 'openExtra' }] });
  assert.equal(aggregate.status, 200);
  assert.equal(aggregate.body.metrics[0].value, 100);
  assert.equal(aggregate.body.metrics[1], null);
  assert.equal(aggregate.body.distributions.openExtra, undefined);
  status = 'expired';
  assert.equal((await request('GET', {}, headers)).body.full, false);
});

test('preview serves synthetic aggregates and chapters only to the required plan', async t => {
  const previous = process.env.VERCEL_ENV;
  process.env.VERCEL_ENV = 'preview';
  t.after(() => {
    if (previous === undefined) delete process.env.VERCEL_ENV;
    else process.env.VERCEL_ENV = previous;
  });
  let plan = 'dash';
  t.mock.method(store, 'authenticate', async () => ({ id: 'test-user' }));
  t.mock.method(store, 'subscription', async () => ({
    status: 'active', plan_type: plan, period_start: '2020-01-01', period_end: '2099-01-01'
  }));
  const db = t.mock.method(store, 'db', async path => {
    assert.doesNotMatch(path, /^respostas_pesquisa\?/);
    return [];
  });
  const headers = { authorization: 'Bearer test' };
  const chapters = { action: 'chapters' };
  assert.equal((await request('POST', {}, {}, report, chapters)).status, 403);
  assert.equal((await request('POST', {}, headers, report, chapters)).status, 403);
  const survey = await request();
  assert.equal(survey.body.total, 96);
  assert.equal(survey.body.synthetic, true);
  plan = 'report';
  const content = await request('POST', {}, headers, report, chapters);
  assert.equal(content.status, 200);
  assert.equal(content.headers['Cache-Control'], 'no-store');
  assert.equal(content.body.synthetic, true);
  const page = require('node:fs').readFileSync(require('node:path').join(__dirname, '..', 'app.html'), 'utf8');
  const ids = (html, attribute) => [...html.matchAll(new RegExp('<article id="(rep-[^"]+)" ' + attribute, 'g'))].map(match => match[1]);
  assert.deepEqual(ids(content.body.html, 'data-report-block'), ids(page, 'data-report-placeholder'));
  const section = page.slice(page.indexOf('<section id="executive-report-view"'), page.indexOf('<section id="image-bank-view"'));
  const articleIds = [...section.matchAll(/<article[^>]+id="(rep-[^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(articleIds, ['rep-tela-001', 'rep-tela-002', 'rep-tela-003', 'rep-tela-006', 'rep-tela-012', 'rep-tela-013', 'rep-tela-014', ...ids(page, 'data-report-placeholder')]);
  assert.equal(ids(page, 'data-report-placeholder')[0], 'rep-tela-015');
  const placeholders = [...section.matchAll(/<article id="([^"]+)" data-report-placeholder[^>]*>([\s\S]*?)<\/article>/g)];
  assert.equal(placeholders.length, ids(page, 'data-report-placeholder').length);
  for (const [, id, content] of placeholders) {
    const image = content.trim().match(/^<img src="(\/web-media\/report-preview\/[^"]+\.webp)" width="420" height="\d+" loading="lazy" decoding="async" alt="">$/);
    assert.equal(image?.[1], '/web-media/report-preview/' + id + '.webp');
    assert.ok(require('node:fs').existsSync(require('node:path').join(__dirname, '..', image[1])));
  }
  assert.equal((await request('POST', {}, headers, report, { specs: [{ type: 'sample' }] })).body.N, 96);
  assert.equal(db.mock.callCount(), 0);
});

test('production chapters are read from private storage only for an eligible account', async t => {
  t.mock.method(store, 'authenticate', async () => ({ id: 'test-user' }));
  let plan = 'dash';
  t.mock.method(store, 'subscription', async () => ({
    status: 'active', plan_type: plan, period_start: '2020-01-01', period_end: '2099-01-01'
  }));
  const html = '<article id="rep-tela-003">Conteúdo protegido</article>';
  let rows = [{ chapters_html: html }];
  const db = t.mock.method(store, 'db', async path => {
    assert.equal(path, 'report_private_documents?slug=eq.radar-2026&select=chapters_html&limit=1');
    return rows;
  });
  const chapters = { action: 'chapters' };
  const headers = { authorization: 'Bearer test' };
  assert.equal((await request('POST', {}, {}, report, chapters)).status, 403);
  assert.equal((await request('POST', {}, headers, report, chapters)).status, 403);
  assert.equal(db.mock.callCount(), 0);
  plan = 'report';
  const authorized = await request('POST', {}, headers, report, chapters);
  assert.equal(authorized.status, 200);
  assert.equal(authorized.headers['Cache-Control'], 'no-store');
  assert.deepEqual(authorized.body, { html, synthetic: false });
  rows = [{ chapters_html: 'gzip:' + require('node:zlib').gzipSync(html).toString('base64') }];
  assert.deepEqual((await request('POST', {}, headers, report, chapters)).body, { html, synthetic: false });
  rows = [];
  assert.equal((await request('POST', {}, headers, report, chapters)).status, 503);
});
