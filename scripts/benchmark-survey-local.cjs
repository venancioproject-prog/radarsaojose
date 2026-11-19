'use strict';
// Synthetic application benchmark only: never reads .env or contacts providers.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { performance } = require('node:perf_hooks');
const { createRequire } = require('node:module');
const root = path.resolve(__dirname, '..');
function parameter(name, fallback, maximum) {
  const index = process.argv.indexOf('--' + name);
  const value = index < 0 ? fallback : Number(process.argv[index + 1]);
  if (!Number.isInteger(value) || value < 1 || value > maximum) throw Error('Invalid ' + name);
  return value;
}
const records = parameter('records', 477, 5000);
const requests = parameter('requests', 60, 500);
const concurrency = parameter('concurrency', 6, 50);

async function benchmark(enabled) {
  const stats = { surveyQueries: 0, syntheticStorageBytes: 0, authChecks: 0, planChecks: 0 };
  const env = { SUPABASE_URL: 'https://fixture.invalid', SUPABASE_SERVICE_ROLE_KEY: 'synthetic-only',
    RADAR_SURVEY_CACHE_ENABLED: String(enabled) };
  let rows;
  const store = {
    BillingError: class extends Error {},
    authenticate: async () => { stats.authChecks += 1; return { id: 'synthetic-only', app_metadata: {} }; },
    async db(route) {
      if (!route.startsWith('respostas_pesquisa?')) throw Error('Unexpected fixture query');
      const params = new URLSearchParams(route.split('?')[1]);
      const aliases = [...params.get('select').matchAll(/(q\d+):"([^"]+)"/g)];
      const offset = Number(params.get('offset')), limit = Number(params.get('limit'));
      const data = rows.slice(offset, offset + limit).map(row => ({ id: row.id,
        ...Object.fromEntries(aliases.map(([, alias, field]) => [alias, row[field]])) }));
      stats.surveyQueries += 1;
      stats.syntheticStorageBytes += Buffer.byteLength(JSON.stringify(data));
      // Yield one turn so concurrent requests exercise shared in-flight loading.
      await new Promise(resolve => setImmediate(resolve));
      return data;
    }
  };
  function load(relative, overrides) {
    const filename = path.join(root, relative), module = { exports: {} };
    const localRequire = createRequire(filename);
    vm.runInNewContext(fs.readFileSync(filename, 'utf8'), {
      module, process: { env }, Buffer,
      require(id) { return Object.hasOwn(overrides, id) ? overrides[id] : localRequire(id); },
      fetch() { throw Error('Remote traffic is forbidden in this benchmark'); }
    }, { filename });
    return module.exports;
  }
  const survey = load('lib/survey-data.js', {
    './billing-store': store,
    './entitlements': { getEffectiveEntitlement: async () => { stats.planChecks += 1; return { planType: 'report' }; } }
  });
  const demo = survey.demoSurveyRows();
  rows = Array.from({ length: records }, (_, index) => ({ ...demo[index % demo.length], id: index + 1 }));
  const handler = load('api/survey-preview.js', { '../lib/billing-store': store, '../lib/survey-data': survey });
  let next = 0;
  const durations = [], failures = [];
  const started = performance.now();
  await Promise.all(Array.from({ length: Math.min(requests, concurrency) }, async () => {
    while (next < requests) {
      next += 1;
      const before = performance.now();
      let status = 200, body;
      const res = { setHeader() {}, status(code) { status = code; return this; }, json(value) { body = value; } };
      await handler({ method: 'GET', query: {}, headers: { authorization: 'Bearer synthetic-only' } }, res);
      durations.push(performance.now() - before);
      if (status !== 200 || body.total !== records || body.full !== true) failures.push({ status });
    }
  }));
  durations.sort((a, b) => a - b);
  const percentile = value => Number(durations[Math.ceil(durations.length * value) - 1].toFixed(2));
  return { cacheEnabled: enabled, records, requests, concurrency, ...stats, failures: failures.length,
    elapsedMs: Number((performance.now() - started).toFixed(2)), p50Ms: percentile(.5), p95Ms: percentile(.95) };
}
(async () => {
  const baseline = await benchmark(false), cached = await benchmark(true);
  console.log(JSON.stringify({ scope: 'Synthetic in-process API benchmark. No real database/network latency, hosting limits, cold starts or provider capacity measured.',
    remoteTraffic: false, baseline, cached }, null, 2));
  if (baseline.failures || cached.failures || baseline.authChecks !== requests || cached.authChecks !== requests ||
    cached.planChecks !== requests || cached.surveyQueries > baseline.surveyQueries) process.exitCode = 1;
})().catch(error => { console.error(error.message); process.exitCode = 1; });
