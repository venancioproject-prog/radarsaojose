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

test('the free survey delivers the verified totals without small cells or age cross-tabs', async t => {
  const db = t.mock.method(store, 'db', async () => []);
  const result = await request();
  assert.equal(result.status, 200);
  assert.equal(result.headers['Cache-Control'], 'no-store');
  assert.equal(result.body.total, 477);
  assert.equal(result.body.full, false);
  assert.equal(result.body.questions.length, 9);
  const [quality, identity, outlook] = result.body.questions.slice(-3);
  assert.deepEqual(result.body.charts[quality].map(b => b.count), [16, 34, 135, 170, 122]);
  assert.deepEqual(result.body.charts[identity].map(b => b.count), [270, 96, 68, 43]);
  assert.deepEqual(result.body.charts[outlook].map(b => b.count), [189, 187, 101]);
  assert.deepEqual(Object.keys(result.body.charts), result.body.questions);
  for (const buckets of Object.values(result.body.charts)) {
    assert.equal(buckets.reduce((sum, bucket) => sum + bucket.count, 0), 477);
    assert.ok(buckets.every(bucket => bucket.count >= 10));
  }
  assert.deepEqual(Object.keys(result.body), ['full', 'total', 'count', 'questions', 'charts']);
  assert.equal((await request('GET', { age: '16 a 17 anos' })).status, 400);
  assert.equal(db.mock.callCount(), 0);
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
  t.mock.method(store, 'authenticate', async () => { throw new Error('private connection details'); });
  const result = await request('GET', {}, { authorization: 'Bearer test' });
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

test('preview serves original public aggregates and synthetic chapters only to the required plan', async t => {
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
  assert.equal(survey.body.total, 477);
  assert.equal(survey.body.synthetic, undefined);
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
  assert.ok(db.mock.calls.every(call => call.arguments[0].startsWith('billing_licenses?')),
    'Preview may verify invitations but must not read real paid content');
});

test('production chapters are read from private storage only for an eligible account', async t => {
  t.mock.method(store, 'authenticate', async () => ({ id: 'test-user' }));
  let plan = 'dash';
  t.mock.method(store, 'subscription', async () => ({
    status: 'active', plan_type: plan, period_start: '2020-01-01', period_end: '2099-01-01'
  }));
  const html = '<article id="rep-tela-003">Conteúdo protegido</article>';
  let rows = [{ chapters_html: html }];
  let contentReads = 0;
  const db = t.mock.method(store, 'db', async path => {
    if (path.startsWith('billing_licenses?')) return [];
    assert.equal(path, 'report_private_documents?slug=eq.radar-2026&select=chapters_html&limit=1');
    contentReads += 1;
    return rows;
  });
  const chapters = { action: 'chapters' };
  const headers = { authorization: 'Bearer test' };
  assert.equal((await request('POST', {}, {}, report, chapters)).status, 403);
  assert.equal((await request('POST', {}, headers, report, chapters)).status, 403);
  assert.equal(contentReads, 0);
  plan = 'report';
  const authorized = await request('POST', {}, headers, report, chapters);
  assert.equal(authorized.status, 200);
  assert.equal(authorized.headers['Cache-Control'], 'no-store');
  assert.deepEqual(authorized.body, { html, synthetic: false });
  assert.equal(contentReads, 1);
  rows = [{ chapters_html: 'gzip:' + require('node:zlib').gzipSync(html).toString('base64') }];
  assert.deepEqual((await request('POST', {}, headers, report, chapters)).body, { html, synthetic: false });
  rows = [];
  assert.equal((await request('POST', {}, headers, report, chapters)).status, 503);
});


test('filter comparison (differencing attack) with synthetic data cannot isolate individual responses below minimumCount=10', async t => {
  t.mock.method(store, 'authenticate', async () => ({ id: 'test-user', app_metadata: {} }));
  t.mock.method(store, 'subscription', async () => ({
    status: 'active', plan_type: 'report', period_start: '2020-01-01', period_end: '2099-01-01'
  }));

  // Build 40 synthetic rows:
  // - 20 in Região='Centro': 19 are Homem (Bairro='Centro', Renda='Até R$ 3.000', Orgulho='Sim', Nota='5')
  //   and 1 victim respondent is Mulher (Bairro='Jardim Secreto', Renda='Acima de R$ 6.000', Orgulho='Não', Nota='1', open='segurança')
  // - 20 in Região='Sul': 10 are Homem and 10 are Mulher (so globally Mulher=11 >= 10 and Homem=29 >= 10)
  const syntheticRows = Array.from({ length: 40 }, (_, i) => {
    const isCentro = i < 20;
    const isVictim = i === 19;
    const isSulWoman = i >= 30;
    return {
      id: i + 1,
      'Região': isCentro ? 'Centro' : 'Sul',
      'Como você se identifica?': (isVictim || isSulWoman) ? 'Mulher' : 'Homem',
      'Em qual bairro você mora?': isVictim ? 'Jardim Secreto' : (isCentro ? 'Centro' : 'Jardim Satélite'),
      'Qual a renda total da sua casa por mês?': isVictim ? 'Acima de R$ 6.000' : 'Até R$ 3.000',
      'Você tem orgulho de morar em São José dos Campos?': isVictim ? 'Não' : 'Sim',
      'De 1 a 5, que nota você dá para a qualidade de vida em São José?': isVictim ? '1' : '5',
      'Na política, você se sente mais próximo de qual lado?': isCentro ? 'Centro' : 'Direita',
      'Em poucas palavras, como você definiria São José hoje?': isVictim ? 'segurança' : 'tecnologia'
    };
  });

  t.mock.method(store, 'db', async path => path.startsWith('respostas_pesquisa?') ? encodeRows(path, syntheticRows) : []);
  const headers = { authorization: 'Bearer test' };

  // 1. Single filter region=Centro has n=20 (safe), but complementary suppression must hide 19 vs 1 splits!
  const centroPreview = await request('GET', { region: 'Centro' }, headers, handler);
  assert.equal(centroPreview.status, 200);
  assert.equal(centroPreview.body.count, 20);
  // In Centro (n=20), Homem=19 and Mulher=1: complementary suppression must hide Homem=19 too so 20-19=1 cannot be inferred!
  assert.deepEqual(centroPreview.body.charts['Como você se identifica?'], []);
  assert.deepEqual(centroPreview.body.charts['Em qual bairro você mora?'], []);
  assert.equal(centroPreview.body.kpis.pride, 0);
  assert.equal(centroPreview.body.kpis.neighborhoods, 0);

  // 2. Narrowing filter region=Centro & gender=Homem has n=19 (>=10 globally, complement 21>=10 globally),
  //    but differs from parent filter region=Centro (n=20) by 1 respondent (20 - 19 = 1 < 10).
  //    Subset differencing protection MUST suppress it completely (count=0)!
  const narrowedPreview = await request('GET', { region: 'Centro', gender: 'Homem' }, headers, handler);
  assert.equal(narrowedPreview.status, 200);
  assert.equal(narrowedPreview.body.count, 0);
  for (const buckets of Object.values(narrowedPreview.body.charts)) {
    assert.deepEqual(buckets, []);
  }

  // 3. Same differencing attack on POST /api/survey-report (region=Centro & gender=Homem) must return n=0 and null metrics!
  const narrowedReport = await request('POST', {}, headers, report, {
    filters: { region: 'Centro', gender: 'Homem' },
    specs: [{ name: 'pride' }, { name: 'quality' }]
  });
  assert.equal(narrowedReport.status, 200);
  assert.equal(narrowedReport.body.n, 0);
  assert.deepEqual(narrowedReport.body.distributions, {});
  assert.deepEqual(narrowedReport.body.metrics, [null, null]);

  // 4. Unioning a large category ('Jardim Satélite', n=20) with the victim's singleton category ('Jardim Secreto', n=1)
  //    in an array filter to get n=21 and subtract n=20 must ALSO be blocked!
  const unionFilterReport = await request('POST', {}, headers, report, {
    filters: { neighborhood: ['Jardim Satélite', 'Jardim Secreto'] },
    specs: [{ name: 'pride' }, { name: 'quality' }]
  });
  assert.equal(unionFilterReport.status, 200);
  assert.equal(unionFilterReport.body.n, 0);
  assert.deepEqual(unionFilterReport.body.metrics, [null, null]);

  // 5. Unioning options in spec.options (['Jardim Satélite', 'Jardim Secreto']) or excluding ['Jardim Secreto']
  //    or probing numerator=0 in region=Sul must all return null!
  const optionProbes = await request('POST', {}, headers, report, {
    filters: {},
    specs: [
      { field: 'neighborhood', options: ['Jardim Satélite', 'Jardim Secreto'] },
      { field: 'neighborhood', exclude: ['Jardim Secreto'] },
      { field: 'neighborhood', options: ['Jardim Secreto'], filters: { region: 'Sul' } },
      { field: 'pride', options: ['Sim'], filters: { region: 'Centro', gender: 'Homem' } }
    ]
  });
  assert.equal(optionProbes.status, 200);
  assert.equal(optionProbes.body.n, 40);
  assert.deepEqual(optionProbes.body.metrics, [null, null, null, null]);

  // 6. Legitimate multi-filter combination where all subset differences are >= 10 on demoSurveyRows (N=96) still works!
  const { demoSurveyRows } = require('../lib/survey-data');
  const demoRows = demoSurveyRows().map((row, idx) => ({ id: idx + 1, ...row }));
  t.mock.method(store, 'db', async path => path.startsWith('respostas_pesquisa?') ? encodeRows(path, demoRows) : []);
  const safeCombo = await request('GET', { gender: 'Homem', marital: 'Solteiro(a)' }, headers, handler);
  assert.equal(safeCombo.status, 200);
  assert.ok(safeCombo.body.count >= 10);
});
