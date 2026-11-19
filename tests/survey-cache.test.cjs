'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createSurveyRowCache } = require('../lib/survey-row-cache');

test('Survey snapshots coalesce concurrent loads, isolate mutable results and expire without stale fallback', async () => {
  let clock = 0, calls = 0, finish;
  const cache = createSurveyRowCache({ now: () => clock, ttlMs: 100 });
  const loader = () => { calls += 1; return new Promise(resolve => { finish = resolve; }); };
  const first = cache('project-a', 'full', loader);
  const second = cache('project-a', 'full', loader);
  await Promise.resolve();
  assert.equal(calls, 1);
  finish([{ id: 1, answer: { text: 'original' } }]);
  const [a, b] = await Promise.all([first, second]);
  a[0].answer.text = 'changed';
  assert.equal(b[0].answer.text, 'original');
  assert.equal((await cache('project-a', 'full', loader))[0].answer.text, 'original');
  clock = 100;
  await assert.rejects(cache('project-a', 'full', async () => { throw Error('Unavailable'); }));
  assert.deepEqual(await cache('project-a', 'full', async () => [{ id: 2 }]), [{ id: 2 }]);
});

test('Cache isolates projections and configuration scopes, including old loads completing after invalidation', async () => {
  const cache = createSurveyRowCache();
  let finish;
  const old = cache('project-a', 'full', () => new Promise(resolve => { finish = resolve; }));
  await Promise.resolve();
  assert.deepEqual(await cache('project-b', 'full', async () => [{ id: 'b' }]), [{ id: 'b' }]);
  finish([{ id: 'a' }]);
  await old;
  assert.deepEqual(await cache('project-b', 'full', () => { throw Error('Must stay cached'); }), [{ id: 'b' }]);
  assert.deepEqual(await cache('project-b', 'preview', async () => [{ id: 'partial' }]), [{ id: 'partial' }]);
  cache.clear();
  assert.deepEqual(await cache('project-b', 'full', async () => [{ id: 'new' }]), [{ id: 'new' }]);
  await assert.rejects(cache('project-b', 'unknown', async () => []), /Invalid survey projection/);
});

test('Oversized, empty and failed loads are not retained; pagination failures cannot poison the snapshot', async () => {
  const cache = createSurveyRowCache({ maxBytes: 10 });
  let reads = 0;
  const large = async () => { reads += 1; return [{ text: 'larger than ten bytes' }]; };
  await cache('a', 'full', large);
  await cache('a', 'full', large);
  assert.equal(reads, 2);
  const empty = async () => { reads += 1; return []; };
  await cache('a', 'full', empty);
  await cache('a', 'full', empty);
  assert.equal(reads, 4);
  await assert.rejects(cache('a', 'full', async () => { throw Error('Page two failed'); }));
  assert.deepEqual(await cache('a', 'full', async () => [1]), [1]);
});

function fixture() {
  const env = { SUPABASE_URL: 'https://fixture.invalid', SUPABASE_SERVICE_ROLE_KEY: 'fake-service-key' };
  let plan = 'report', reads = 0, authCalls = 0, entitlementCalls = 0;
  let failAuth = false, failRows = false;
  let rowCount = 24, failedOffset = null;
  const store = {
    BillingError: class extends Error {},
    async authenticate() {
      authCalls += 1;
      if (failAuth) throw new Error('Fixture session revoked');
      return { id: 'fixture-user', app_metadata: {} };
    },
    async db(route) {
      assert.ok(route.startsWith('respostas_pesquisa?'), 'No other remote queries allowed');
      reads += 1;
      const params = new URLSearchParams(route.split('?')[1]);
      const aliases = [...params.get('select').matchAll(/(q\d+):"([^"]+)"/g)];
      const offset = Number(params.get('offset'));
      if (failRows || offset === failedOffset) throw new Error('Fixture storage unavailable');
      return Array.from({ length: Math.max(0, Math.min(500, rowCount - offset)) }, (_, index) => ({ id: index + offset,
        ...Object.fromEntries(aliases.map(([, alias, field]) => [alias,
          field.includes('orgulho') ? 'Sim' : field.includes('não abordamos') ? 'PRIVATE_FIXTURE' : 'Centro']))
      }));
    }
  };
  const mod = { exports: {} };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../lib/survey-data.js'), 'utf8'), {
    module: mod, process: { env }, require(id) {
      if (id === './billing-store') return store;
      if (id === './entitlements') return { async getEffectiveEntitlement() {
        entitlementCalls += 1; return { planType: plan };
      } };
      if (id === './survey-row-cache') return { createSurveyRowCache };
      return require(id);
    }
  });
  function route(name) {
    const loaded = { exports: {} };
    vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../api', name), 'utf8'), {
      module: loaded, process: { env }, Buffer, require(id) {
        if (id === '../lib/billing-store') return store;
        if (id === '../lib/survey-data') return mod.exports;
        if (id === '../report-metrics') return require('../report-metrics');
        if (id === '../lib/survey-public-2026.json') return require('../lib/survey-public-2026.json');
        if (id === './_report-chapters') return require('../api/_report-chapters');
        return require(id);
      }
    });
    return loaded.exports;
  }
  return { env, survey: mod.exports, preview: route('survey-preview.js'), report: route('survey-report.js'),
    setPlan: value => { plan = value; }, revoke: () => { failAuth = true; },
    failRows: value => { failRows = value; },
    pages: (count, failure = null) => { rowCount = count; failedOffset = failure; },
    stats: () => ({ reads, authCalls, entitlementCalls }) };
}

async function request(handler, { method = 'GET', query = {}, body, authenticated = true } = {}) {
  const res = { code: 200, headers: {}, setHeader(k, v) { this.headers[k] = v; },
    status(code) { this.code = code; return this; }, json(body) { this.body = body; } };
  await handler({ method, query, body, headers: authenticated ? { authorization: 'Bearer fixture' } : {} }, res);
  return res;
}

test('Warm research cache saves storage reads but rechecks plans and sessions before every paid result', async () => {
  const f = fixture();
  const first = await request(f.preview);
  const filtered = await request(f.preview, { query: { region: 'Centro' } });
  const report = await request(f.report, { method: 'POST', body: { specs: [{ name: 'pride' }] } });
  assert.equal(first.code, 200);
  assert.equal(filtered.code, 200);
  assert.equal(report.code, 200);
  assert.equal(report.body.metrics[0].value, 100);
  assert.equal(first.headers['Cache-Control'], 'no-store');
  assert.doesNotMatch(JSON.stringify([first.body, filtered.body, report.body]), /PRIVATE_FIXTURE/);
  assert.deepEqual(f.stats(), { reads: 1, authCalls: 3, entitlementCalls: 3 });
  f.setPlan('dash');
  assert.equal((await request(f.report, { method: 'POST', body: { specs: [] } })).code, 403);
  f.setPlan('gratis');
  assert.equal((await request(f.preview)).body.full, false);
  assert.equal((await request(f.preview, { authenticated: false })).body.full, false);
  f.revoke();
  assert.equal((await request(f.preview)).code, 503);
  assert.equal(f.stats().reads, 1, 'Blocked callers never read the cached private base');
});

test('Research scope includes destination, credential and data version; maintenance and Preview bypass cached real rows', async () => {
  const f = fixture();
  await f.survey.readSurveyRows();
  await f.survey.readSurveyRows();
  assert.equal(f.stats().reads, 1);
  for (const [name, value] of [['RADAR_SURVEY_DATA_VERSION', 'v2'],
    ['SUPABASE_URL', 'https://second.invalid'], ['SUPABASE_SERVICE_ROLE_KEY', 'second-fake']]) {
    f.env[name] = value;
    await f.survey.readSurveyRows();
  }
  assert.equal(f.stats().reads, 4);
  f.env.RADAR_SURVEY_CACHE_ENABLED = 'false';
  await f.survey.readSurveyRows();
  await f.survey.readSurveyRows();
  assert.equal(f.stats().reads, 6);
  delete f.env.RADAR_SURVEY_CACHE_ENABLED;
  await f.survey.readSurveyRows();
  assert.equal(f.stats().reads, 7, 'Disabling clears previous cached data');
  f.env.VERCEL_ENV = 'preview';
  assert.equal((await f.survey.readSurveyRows()).length, 96);
  assert.equal(f.stats().reads, 7, 'Preview must not access real storage');
  delete f.env.VERCEL_ENV;
  f.failRows(true);
  await assert.rejects(f.survey.readSurveyRows(), /storage unavailable/);
  f.failRows(false);
  await f.survey.readSurveyRows();
  assert.equal(f.stats().reads, 9, 'Failures do not revive an earlier real snapshot');
});

test('A failed second research page never becomes a partial cached dataset', async () => {
  const f = fixture();
  f.pages(501, 500);
  await assert.rejects(f.survey.readSurveyRows(), /storage unavailable/);
  assert.equal(f.stats().reads, 2);
  f.pages(501);
  const complete = await f.survey.readSurveyRows();
  assert.equal(complete.length, 501);
  assert.equal(new Set(complete.map(row => row.id)).size, 501);
  assert.equal(f.stats().reads, 4, 'Recovery restarts the complete paginated load');
  assert.equal((await f.survey.readSurveyRows()).length, 501);
  assert.equal(f.stats().reads, 4);
});
