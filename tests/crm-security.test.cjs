'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createRequire } = require('node:module');
const { normalizePhone } = require('../radar-contact');

function loadHandler(file, overrides) {
  const filename = path.resolve(__dirname, '..', file);
  const localRequire = createRequire(filename);
  const module = { exports: {} };
  vm.runInNewContext(fs.readFileSync(filename, 'utf8'), {
    module, AbortSignal, URLSearchParams, Buffer,
    process: { env: {} },
    require(id) { return Object.hasOwn(overrides, id) ? overrides[id] : localRequire(id); },
    fetch: overrides.fetch
  });
  return module.exports;
}

function response() {
  return {
    statusCode: 200,
    setHeader() {},
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; }
  };
}

function bearer(aal, id = 'admin') {
  return 'header.' + Buffer.from(JSON.stringify({ sub: id, aal })).toString('base64url') + '.signature';
}

test('Admin API rejects password-only sessions, forged subjects and ordinary accounts', async () => {
  const admin = { id: 'admin', app_metadata: { role: 'admin' } };
  const handler = loadHandler('api/_authorization.js', {
    '../lib/db-pool': { getDbPool: () => ({
      fetchWithPool: async () => ({ ok: true, json: async () => admin })
    }) }
  }).requireAdmin;
  for (const [token, allowed] of [
    [bearer('aal1'), false], [bearer('aal2'), true], [bearer('aal2', 'other'), false]
  ]) {
    const req = { headers: { authorization: 'Bearer ' + token } };
    const res = response();
    assert.equal(await handler(req, res, { url: 'https://fixture.invalid', anonKey: 'test' }), allowed);
    if (allowed) assert.equal(req.adminUser.id, 'admin');
    else assert.equal(res.body.code, 'MFA_REQUIRED');
  }
  admin.app_metadata.role = 'usuario';
  const res = response();
  assert.equal(await handler({ headers: { authorization: 'Bearer ' + bearer('aal2') } }, res, {}), false);
  assert.equal(res.body.code, 'FORBIDDEN');
});

test('Contact accepts optional and international numbers and rejects malformed input', () => {
  assert.equal(normalizePhone(''), '');
  assert.equal(normalizePhone('(12) 98765-4321'), '+5512987654321');
  assert.equal(normalizePhone('+1 202 555 0123'), '+12025550123');
  assert.equal(normalizePhone('5512987654321'), '+5512987654321');
  assert.equal(normalizePhone('123'), null);
  assert.equal(normalizePhone('11999999999<script>'), null);
});

test('Normal signup submits the optional phone without undefined variables', async () => {
  const html = fs.readFileSync(path.join(__dirname, '../login.html'), 'utf8');
  assert.match(html, /id="telefone"/);
  assert.match(html, /src="radar-contact.js"/);
  const start = html.indexOf('    async function handleAuthSubmit(e)');
  const end = html.indexOf("    document.getElementById('year-current')", start);
  let submitted;
  const fields = {
    email: { value: 'customer@example.invalid' }, password: { value: 'ValidPassword123!' },
    nome: { value: 'Cliente Teste' }, telefone: { value: '(12) 98765-4321' },
    'register-profile': { value: 'gestor' }, 'register-terms': { checked: true },
    'password-confirm': { value: 'ValidPassword123!' }
  };
  const context = {
    authMode: 'register',
    document: { getElementById: id => fields[id] || null },
    window: { location: {}, radarContact: { normalizePhone }, radarLegal: { version: '0.2' } },
    supabaseClient: { auth: { signUp: async value => {
      submitted = value;
      return { data: { session: null } };
    } } },
    localStorage: { setItem() {} },
    showLoginMessage() {}, registrationPasswordError: () => '',
    confirmationRedirectUrl: () => 'https://fixture.invalid',
    console
  };
  vm.createContext(context);
  vm.runInContext(html.slice(start, end), context);
  await context.handleAuthSubmit();
  assert.equal(submitted.options.data.radar_phone, '+5512987654321');
  assert.equal(context.window.location.href, 'app.html?primeiraVisita=1#historia');
});

test('CRM search and metrics cover multiple auth pages, use subscriptions and immutable terms', async () => {
  const users = Array.from({ length: 501 }, (_, index) => ({
    id: 'user-' + index, email: 'user' + index + '@example.invalid',
    created_at: new Date().toISOString(),
    user_metadata: {
      radar_full_name: index === 500 ? 'Contato Único' : 'Cliente ' + index,
      radar_profile_type: 'gestor',
      radar_terms_acceptance: { version: '0.2', accepted_at: new Date().toISOString() }
    },
    app_metadata: index === 0 ? { role: 'admin' } : {}
  }));
  const now = Date.now();
  const subscriptions = [
    { id: 'subscription-1', user_id: 'user-1', plan_type: 'report', status: 'active',
      period_start: new Date(now - 10000).toISOString(), period_end: new Date(now + 86400000).toISOString() },
    { id: 'subscription-2', user_id: 'user-2', plan_type: 'midia', status: 'active',
      period_start: new Date(now - 10000).toISOString(), period_end: new Date(now + 86400000).toISOString() },
    { id: 'subscription-3', user_id: 'user-3', plan_type: 'midia', status: 'active',
      period_start: new Date(now - 86400000).toISOString(), period_end: new Date(now - 1000).toISOString() }
  ];
  const tables = {
    billing_subscriptions: subscriptions,
    billing_licenses: [{ id: 'license-4', user_id: 'user-4', subscription_id: 'subscription-2' }],
    terms_acceptances: [{ id: 'terms-500', user_id: 'user-500', profile_type: 'gestor',
      terms_version: '0.2', accepted_at: new Date().toISOString() }],
    crm_account_followups: []
  };
  let storageFailure = false;
  const handler = loadHandler('api/crm-accounts.js', {
    './_authorization': { requireAdmin: async () => true },
    '../lib/billing-store': {
      configuration: () => ({ url: 'https://fixture.invalid', key: 'fake' }),
      db: async route => {
        if (storageFailure) throw new Error('Storage unavailable');
        const url = new URL(route, 'https://fixture.invalid/');
        const rows = tables[url.pathname.slice(1)];
        assert.ok(rows, route);
        const key = url.searchParams.has('user_id') ? 'user_id' : 'id';
        const ids = url.searchParams.get(key).slice(4, -1).split(',');
        return rows.filter(row => ids.includes(row[key]));
      }
    },
    fetch: async url => {
      const page = Number(new URL(url).searchParams.get('page'));
      return { ok: true, json: async () => ({ users: users.slice((page - 1) * 500, page * 500) }) };
    }
  });
  let res = response();
  await handler({ method: 'GET', query: { search: 'unico' } }, res);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.total, 1);
  assert.equal(res.body.accounts[0].id, 'user-500');
  assert.equal(res.body.accounts[0].firstAccessComplete, true);
  assert.equal(res.body.metrics.total, 499);
  assert.equal(res.body.metrics.paid, 2);
  assert.equal(res.body.metrics.guestAccesses, 1);
  res = response();
  await handler({ method: 'GET', query: { search: 'user1@example.invalid' } }, res);
  assert.equal(res.body.accounts[0].plan, 'report');
  assert.equal(res.body.accounts[0].firstAccessComplete, false);
  res = response();
  await handler({ method: 'GET', query: { search: 'user3@example.invalid' } }, res);
  assert.equal(res.body.accounts[0].plan, 'gratis');
  res = response();
  await handler({ method: 'GET', query: { search: 'user4@example.invalid' } }, res);
  assert.equal(res.body.accounts[0].plan, 'midia');
  assert.equal(res.body.accounts[0].isGuest, true);
  storageFailure = true;
  res = response();
  await handler({ method: 'GET', query: {} }, res);
  assert.equal(res.statusCode, 503);
  assert.equal(res.body.accounts, undefined);
});

test('CRM followup rejects commercial fields and handles concurrent saves', async () => {
  let calls = 0;
  const handler = loadHandler('lib/crm-followups.js', {
    '../api/_authorization': { requireAdmin: async req => {
      req.adminUser = { id: 'admin' };
      return true;
    } },
    './billing-store': {
      configuration: () => ({ url: 'https://fixture.invalid' }),
      db: async () => { calls += 1; return []; }
    }
  });
  const base = {
    userId: '00000000-0000-4000-8000-000000000001',
    stage: 'contato', notes: 'Teste', nextContactDate: null, revision: 1
  };
  let res = response();
  await handler({ method: 'PUT', body: { ...base, plan: 'midia' } }, res);
  assert.equal(res.statusCode, 400);
  assert.equal(calls, 0);
  res = response();
  await handler({ method: 'PUT', body: { ...base, nextContactDate: '2026-02-31' } }, res);
  assert.equal(res.statusCode, 400);
  res = response();
  await handler({ method: 'PUT', body: base }, res);
  assert.equal(res.statusCode, 409);
  assert.equal(res.body.code, 'FOLLOWUP_CHANGED');
});

test('All inline application scripts remain parseable after CRM cleanup', () => {
  for (const file of ['admin-crm.html', 'login.html', 'primeiro-acesso.html', 'recuperar-senha.html']) {
    const html = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
    if (file === 'admin-crm.html') assert.doesNotMatch(html, /renderCrm\(\)|DEFAULT_SUBSCRIBERS/);
    for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
      if (match[1].includes('application/ld+json')) continue;
      assert.doesNotThrow(() => new vm.Script(match[2]), file);
    }
  }
});

test('Migration 022 keeps notes on the server with history, concurrency and MFA', async () => {
  const candidates = [
    path.join(process.env.LOCALAPPDATA || '', 'RadarSaoJose/tools/pglite-0.5.15/node_modules/@electric-sql/pglite'),
    path.join(process.env.USERPROFILE || '', 'AppData/Local/Packages/OpenAI.Codex_2p2nqsd0c76g0/LocalCache/Local/RadarSaoJose/tools/pglite-0.5.15/node_modules/@electric-sql/pglite')
  ];
  const dependency = candidates.find(candidate => fs.existsSync(candidate));
  assert.ok(dependency, 'PGlite existente necessário para conferir a migração');
  const { PGlite } = require(dependency);
  const db = new PGlite();
  const user = '00000000-0000-4000-8000-000000000001';
  const admin = '00000000-0000-4000-8000-000000000002';
  try {
    await db.exec(`
      CREATE ROLE anon NOLOGIN;
      CREATE ROLE authenticated NOLOGIN;
      CREATE ROLE service_role NOLOGIN BYPASSRLS;
      CREATE SCHEMA auth;
      CREATE TABLE auth.users(id uuid PRIMARY KEY);
      CREATE FUNCTION auth.jwt() RETURNS jsonb LANGUAGE sql STABLE AS $$
        SELECT COALESCE(NULLIF(current_setting('request.jwt.claims', true), ''), '{}')::jsonb
      $$;
      CREATE FUNCTION public.is_crm_admin() RETURNS boolean LANGUAGE sql STABLE AS $$
        SELECT COALESCE(auth.jwt()->'app_metadata'->>'role' = 'admin', false)
      $$;
      GRANT USAGE ON SCHEMA auth TO anon, authenticated, service_role;
    `);
    await db.query('INSERT INTO auth.users VALUES ($1),($2)', [user, admin]);
    const migration = fs.readFileSync(path.join(__dirname, '../data/migrations/022_crm_account_followups.sql'), 'utf8');
    await db.exec(migration);
    await db.exec(migration);
    await db.query('INSERT INTO public.crm_account_followups(user_id,notes,updated_by) VALUES ($1,$2,$3)', [user, 'Primeira nota', admin]);
    await db.query('UPDATE public.crm_account_followups SET notes=$1 WHERE user_id=$2 AND revision=1', ['Segunda nota', user]);
    const stale = await db.query('UPDATE public.crm_account_followups SET notes=$1 WHERE user_id=$2 AND revision=1 RETURNING *', ['Nota antiga', user]);
    assert.equal(stale.rows.length, 0);
    assert.equal((await db.query('SELECT revision FROM public.crm_account_followups')).rows[0].revision, 2);
    assert.equal((await db.query('SELECT * FROM public.crm_account_followup_history')).rows.length, 2);
    for (const [role, aal, expected] of [['admin', 'aal1', 0], ['usuario', 'aal2', 0], ['admin', 'aal2', 1]]) {
      await db.query("SELECT set_config('request.jwt.claims', $1, false)", [JSON.stringify({ aal, app_metadata: { role } })]);
      await db.exec('SET ROLE authenticated');
      try {
        assert.equal((await db.query('SELECT * FROM public.crm_account_followups')).rows.length, expected);
        await assert.rejects(db.query("UPDATE public.crm_account_followups SET notes='Forjado'"), { code: '42501' });
      } finally {
        await db.exec('RESET ROLE');
      }
    }
  } finally {
    await db.close();
  }
});
test('Google first access collects phone while preserving the recorded acceptance', async () => {
  const html = fs.readFileSync(path.join(__dirname, '../primeiro-acesso.html'), 'utf8');
  const script = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(match => match[1])
    .find(value => value.includes('legal-acceptance-form'));
  let ready, submit, saved;
  const user = { id: 'google-user', user_metadata: { full_name: 'Pessoa Google' } };
  const form = {
    elements: { accepted: { checked: false }, profile: { value: '', options: [{ value: 'gestor' }] },
      fullName: { value: '' }, phone: { value: '' } },
    querySelector: () => ({ disabled: false }),
    addEventListener: (event, callback) => { if (event === 'submit') submit = callback; }
  };
  const nodes = { 'legal-acceptance-form': form, 'legal-acceptance-status': {}, 'terms-fields': {} };
  let replaced;
  const client = { auth: {
    getSession: async () => ({ data: { session: { user } } }),
    updateUser: async value => { saved = value; return { data: { user } }; }
  } };
  let checks = 0;
  vm.runInNewContext(script, {
    URLSearchParams, location: { search: '' },
    document: {
      querySelectorAll: () => [],
      getElementById: id => nodes[id],
      addEventListener: (event, callback) => { if (event === 'DOMContentLoaded') ready = callback; }
    },
    window: {
      location: { replace: value => { replaced = value; } },
      matchMedia: () => ({ matches: true }),
      radarContact: { normalizePhone },
      radarSupabaseConfig: { url: 'fixture', key: 'fixture' },
      supabase: { createClient: () => client },
      radarLegal: {
        checkFirstAccess: async () => (++checks === 1
          ? { needsFirstAccess: true, accepted: false, fullName: 'Pessoa Google', profileType: '' }
          : { needsFirstAccess: false }),
        recordAcceptance: async () => ({ terms_version: '0.2', accepted_at: '2026-11-11T12:00:00Z' })
      }
    }
  });
  await ready();
  form.elements.accepted.checked = true;
  form.elements.profile.value = 'gestor';
  form.elements.phone.value = '(12) 98765-4321';
  await submit({ preventDefault() {} });
  assert.equal(saved.data.radar_phone, '+5512987654321');
  assert.equal(saved.data.radar_terms_acceptance.version, '0.2');
  assert.equal(replaced, 'app.html');
});
test('Recovery email rate limiting is reported without claiming another message was sent', async () => {
  const html = fs.readFileSync(path.join(__dirname, '../recuperar-senha.html'), 'utf8');
  const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  let ready, submit;
  const button = { disabled: false };
  const form = {
    elements: { email: { value: 'example@example.invalid' } },
    querySelector: () => button,
    addEventListener: (event, callback) => { submit = callback; }
  };
  const status = {};
  const nodes = { request: form, update: {}, status };
  const location = { search: '', hash: '', href: 'https://fixture.invalid/recuperar-senha.html' };
  vm.runInNewContext(script, {
    URLSearchParams, URL, location,
    document: { getElementById: id => nodes[id], addEventListener: (event, callback) => { ready = callback; } },
    window: {
      location,
      radarSupabaseConfig: { url: 'fixture', key: 'fixture' },
      supabase: { createClient: () => ({ auth: { resetPasswordForEmail: async () => ({ error: { status: 429 } }) } }) }
    }
  });
  await ready();
  await submit({ preventDefault() {} });
  assert.match(status.textContent, /limite de envios/);
  assert.equal(button.disabled, false);
});
test('CRM followup shares the existing route and keeps the deployment within twelve functions', async () => {
  const files = fs.readdirSync(path.join(__dirname, '../api')).filter(name => name.endsWith('.js') && !name.startsWith('_'));
  assert.ok(files.length <= 12, 'The current hosting configuration permits twelve functions');
  const seen = [];
  const handler = loadHandler('api/crm-accounts.js', {
    '../lib/crm-followups': async (req, res) => { seen.push(req.method); return res.status(200).json({ routed: true }); }
  });
  for (const req of [{ method: 'GET', query: { userId: 'fixture' } }, { method: 'PUT', body: {} }]) {
    const res = response();
    await handler(req, res);
    assert.equal(res.body.routed, true);
  }
  assert.deepEqual(seen, ['GET', 'PUT']);
});
