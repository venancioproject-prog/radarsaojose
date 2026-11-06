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
  assert.deepEqual(articleIds, ['rep-tela-001', 'rep-tela-002', ...ids(page, 'data-report-placeholder')]);
  assert.equal((await request('POST', {}, headers, report, { specs: [{ type: 'sample' }] })).body.N, 96);
  assert.equal(db.mock.callCount(), 0);
});
