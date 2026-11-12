'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createRequire } = require('node:module');

function load(file, env, options = {}) {
  const filename = path.resolve(__dirname, '..', file);
  const localRequire = createRequire(filename);
  const module = { exports: {} };
  const calls = [];
  vm.runInNewContext(fs.readFileSync(filename, 'utf8'), {
    module, Buffer, console, URL, URLSearchParams,
    process: { env, cwd: () => path.dirname(filename) },
    require(id) {
      if (id === 'fs') return { ...fs, existsSync: () => false };
      if (id === './_authorization') return { requireAdmin: async (req, res, config) => {
        calls.push({ url: config.url, key: config.anonKey });
        if (options.allowAdmin) return true;
        res.status(401).json({ code: 'UNAUTHORIZED' });
        return false;
      } };
      if (id === '../lib/db-pool') return { getDbPool: () => ({ fetchWithPool: async (url, options) => {
        calls.push({ url, key: options.headers.apikey, headers: options.headers });
        return { ok: true, json: async () => [] };
      } }) };
      return localRequire(id);
    }
  });
  return { handler: module.exports, calls };
}
function response() {
  return { statusCode: 200, setHeader() {}, status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; }, end() {} };
}
const routes = [
  ['api/posts.js', { method: 'GET', query: { admin: 'true' } }],
  ['api/upload.js', { method: 'POST', body: {} }],
  ['api/business-plan.js', { method: 'GET', headers: { authorization: 'Bearer fixture' } }]
];

test('Missing or malformed database configuration never falls back to production', async () => {
  for (const [file, request] of routes) {
    for (const env of [{}, { SUPABASE_URL: 'https://test.supabase.co' },
      { SUPABASE_ANON_KEY: 'fixture' },
      { SUPABASE_URL: 'http://test.supabase.co', SUPABASE_PUBLISHABLE_KEY: 'fixture' }]) {
      const fixture = load(file, env);
      const res = response();
      await fixture.handler(request, res);
      assert.equal(res.statusCode, 503, file);
      assert.equal(res.body.code, 'DATABASE_NOT_CONFIGURED', file);
      assert.equal(fixture.calls.length, 0, file);
    }
  }
});

test('Configured routes use only their explicit project and publishable or legacy anonymous key', async () => {
  for (const [file, request] of routes) {
    for (const keyField of ['SUPABASE_PUBLISHABLE_KEY', 'SUPABASE_ANON_KEY']) {
      const fixture = load(file, { SUPABASE_URL: 'https://test.supabase.co/', [keyField]: 'fixture-public-key' });
      const res = response();
      await fixture.handler(request, res);
      assert.equal(res.statusCode, 401, file);
      assert.equal(fixture.calls.length, 1, file);
      assert.ok(fixture.calls[0].url.startsWith('https://test.supabase.co'));
      assert.equal(fixture.calls[0].key, 'fixture-public-key');
    }
  }
});

test('The stateless business calculator remains independent of database configuration', async () => {
  const fixture = load('api/business-plan.js', {});
  const res = response();
  await fixture.handler({ method: 'POST', query: { action: 'calculate' }, body: { inputs: {} } }, res);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);
  assert.equal(fixture.calls.length, 0);
});

test('Uploads support modern server keys without using them as a user bearer token', async () => {
  for (const [field, key] of [['SUPABASE_SECRET_KEY', 'sb_secret_fixture'], ['SUPABASE_SERVICE_ROLE_KEY', 'legacy-jwt-fixture']]) {
    const fixture = load('api/upload.js', { SUPABASE_URL: 'https://test.supabase.co',
      SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_fixture', [field]: key }, { allowAdmin: true });
    const res = response();
    await fixture.handler({ method: 'POST', body: { contentType: 'image/png',
      fileData: Buffer.from([137,80,78,71,13,10,26,10]).toString('base64') } }, res);
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.storage, 'supabase');
    assert.equal(fixture.calls.length, 2);
    assert.equal(fixture.calls[1].key, key);
    assert.equal(fixture.calls[1].headers.Authorization, field === 'SUPABASE_SECRET_KEY' ? undefined : 'Bearer ' + key);
  }
});

test('Public article reads with a publishable key do not forge a bearer session', async () => {
  const fixture = load('api/posts.js', { SUPABASE_URL: 'https://test.supabase.co',
    SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_fixture' });
  const res = response();
  await fixture.handler({ method: 'GET', query: {} }, res);
  assert.equal(res.statusCode, 200);
  assert.equal(fixture.calls.length, 1);
  assert.equal(fixture.calls[0].key, 'sb_publishable_fixture');
  assert.equal(fixture.calls[0].headers.Authorization, undefined);
});
