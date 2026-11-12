'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createRequire } = require('node:module');

function response() {
  return { statusCode: 200, setHeader() {}, status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; } };
}
function fixture() {
  const filename = path.join(__dirname, '../api/asaas-webhook.js');
  const localRequire = createRequire(filename);
  const secret = 'local-test-webhook-secret-not-a-real-key';
  const order = { id: '00000000-0000-4000-8000-000000000001', asaas_payment_id: 'pay_fixture',
    amount_cents: 12345, payment_method: 'PIX', installment_count: 1, status: 'pending', quote: {} };
  const live = { id: 'pay_fixture', externalReference: order.id, billingType: 'PIX', value: 123.45, status: 'RECEIVED' };
  const state = { dbCalls: 0, fetches: 0, processed: 0, emails: 0, result: { success: true },
    events: new Map(), offline: false, unknown: false };
  const module = { exports: {} };
  vm.runInNewContext(fs.readFileSync(filename, 'utf8'), {
    module, Buffer, AbortSignal, console, process: { env: { ASAAS_WEBHOOK_SECRET: secret } },
    require(id) {
      if (id === '../lib/asaas-config') return { asaasConfig: () => ({ key: 'fixture-only', url: 'https://fixture.invalid/v3' }) };
      if (id === '../lib/billing-email') return { sendConfirmationEmail: async () => { state.emails += 1; return { status: 'local_test' }; } };
      if (id === '../lib/billing-store') return { ...localRequire(id), db: async (route, options = {}) => {
        state.dbCalls += 1;
        if (route.startsWith('billing_orders?')) return state.unknown ? [] : [order];
        if (route.startsWith('billing_gateway_events?')) {
          if (options.method === 'POST') {
            const row = JSON.parse(options.body);
            if (!state.events.has(row.event_id)) state.events.set(row.event_id, row);
            return null;
          }
          const id = new URLSearchParams(route.split('?')[1]).get('event_id').slice(3);
          return state.events.has(id) ? [state.events.get(id)] : [];
        }
        if (route === 'rpc/billing_process_event') { state.processed += 1; return state.result; }
        throw new Error('Unexpected database request');
      } };
      return localRequire(id);
    },
    fetch: async (url, options) => {
      assert.equal(url, 'https://fixture.invalid/v3/payments/pay_fixture');
      assert.equal(options.method, 'GET');
      assert.equal(options.redirect, 'error');
      state.fetches += 1;
      if (state.offline) throw new Error('private provider failure');
      return { ok: true, json: async () => ({ ...live }) };
    }
  });
  const event = () => ({ id: 'event_fixture', event: 'PAYMENT_RECEIVED', payment: { ...live } });
  const request = async (body = event(), token = secret) => {
    const res = response();
    await module.exports({ method: 'POST', headers: { 'asaas-access-token': token }, body }, res);
    return res;
  };
  return { state, order, live, event, request };
}

test('Webhook authenticates before touching its body and bounds UTF-8 payloads', async () => {
  const f = fixture();
  const dangerous = { get id() { throw new Error('Body accessed before authentication'); } };
  assert.equal((await f.request(dangerous, 'wrong-token')).statusCode, 401);
  assert.equal((await f.request('á'.repeat(140000))).statusCode, 413);
  assert.equal(f.state.dbCalls, 0);
  assert.equal(f.state.fetches, 0);
});

test('Only a gateway-verified payment reaches activation and confirmation email', async () => {
  const f = fixture();
  const res = await f.request();
  assert.equal(res.statusCode, 200);
  assert.equal(f.state.fetches, 1);
  assert.equal(f.state.processed, 1);
  assert.equal(f.state.emails, 1);
  const duplicate = fixture();
  duplicate.state.result = { success: true, duplicate: true };
  assert.equal((await duplicate.request()).body.emailStatus, 'duplicate_ignored');
  assert.equal(duplicate.state.emails, 0);
});

test('Unconfirmed, wrong-value, wrong-order and unavailable gateway responses cannot activate access', async () => {
  for (const change of [{ status: 'PENDING' }, { value: 1 }, { externalReference: 'another-order' },
    { billingType: 'CREDIT_CARD' }, { deleted: true }, { offline: true }]) {
    const f = fixture();
    if (change.offline) f.state.offline = true;
    else Object.assign(f.live, change);
    const original = f.event();
    original.payment = { ...original.payment, value: 123.45, billingType: 'PIX', externalReference: f.order.id };
    const res = await f.request(original);
    assert.ok([409, 502].includes(res.statusCode));
    assert.equal(f.state.processed, 0);
    assert.equal(f.state.emails, 0);
    assert.doesNotMatch(JSON.stringify(res.body), /private provider failure|fixture-only/);
  }
});

test('A conflicting event ID and unrelated charges cannot apply a Radar payment', async () => {
  const f = fixture();
  f.state.events.set('event_fixture', { payment_id: 'different-payment', event_type: 'PAYMENT_RECEIVED', payload: f.event() });
  assert.equal((await f.request()).body.code, 'EVENT_ID_CONFLICT');
  assert.equal(f.state.processed, 0);
  const unrelated = fixture();
  unrelated.state.unknown = true;
  assert.equal((await unrelated.request()).body.ignored, true);
  assert.equal(unrelated.state.events.size, 0);
  assert.equal(unrelated.state.fetches, 0);
});

test('Refund and chargeback must match the live gateway state and never send purchase email', async () => {
  for (const [event, status] of [['PAYMENT_REFUNDED', 'REFUNDED'], ['PAYMENT_CHARGEBACK_REQUESTED', 'CHARGEBACK_REQUESTED']]) {
    const f = fixture();
    const body = f.event();
    body.event = event;
    assert.equal((await f.request(body)).statusCode, 409);
    assert.equal(f.state.processed, 0);
    f.live.status = status;
    assert.equal((await f.request(body)).statusCode, 200);
    assert.equal(f.state.processed, 1);
    assert.equal(f.state.emails, 0);
  }
});

test('Financial emails identify boleto correctly and render customer text without injected HTML', () => {
  const { buildConfirmationTemplate } = require('../lib/billing-email');
  const email = buildConfirmationTemplate({
    order: { target_plan: 'report', payment_method: 'BOLETO', amount_cents: 12345 },
    recipientName: '<a href="https://attacker.invalid">Pague aqui</a>'
  });
  assert.match(email.textBody, /Boleto bancário/);
  assert.doesNotMatch(email.textBody, /Cartão de Crédito/);
  assert.doesNotMatch(email.htmlBody, /<a href="https:\/\/attacker/);
  assert.match(email.htmlBody, /&lt;a href=/);
  const unknown = buildConfirmationTemplate({ order: { target_plan: '<img src=x>' } });
  assert.doesNotMatch(unknown.htmlBody, /<img src=x>/);
  assert.doesNotMatch(unknown.subject, /<img/);
});

test('Financial sending requires explicit configuration and uses a stable per-order deduplication key', async () => {
  const filename = path.join(__dirname, '../lib/billing-email.js');
  const calls = [];
  const env = { RESEND_API_KEY: 'fixture-only' };
  const module = { exports: {} };
  vm.runInNewContext(fs.readFileSync(filename, 'utf8'), {
    module, require: createRequire(filename), process: { env }, AbortSignal,
    fetch: async (url, options) => { calls.push({ url, options }); return { ok: true, json: async () => ({ id: 'email_fixture' }) }; }
  });
  const input = { order: { id: '00000000-0000-4000-8000-000000000001', target_plan: 'report',
    payment_method: 'BOLETO', quote: { customerEmail: 'customer@example.invalid' } } };
  assert.equal((await module.exports.sendConfirmationEmail(input)).sent, false);
  assert.equal(calls.length, 0, 'never invent an unconfigured sender');
  env.BILLING_EMAIL_FROM = 'Radar São José <financeiro@example.invalid>';
  assert.equal((await module.exports.sendConfirmationEmail(input)).sent, true);
  await module.exports.sendConfirmationEmail(input);
  assert.equal(calls[0].options.headers['Idempotency-Key'], calls[1].options.headers['Idempotency-Key']);
  input.order.id = '00000000-0000-4000-8000-000000000002';
  await module.exports.sendConfirmationEmail(input);
  assert.notEqual(calls[0].options.headers['Idempotency-Key'], calls[2].options.headers['Idempotency-Key']);
  assert.equal(calls[0].options.redirect, 'error');
});

test('Git excludes environment variants while retaining credential-free sample files', () => {
  const { execFileSync } = require('node:child_process');
  const files = ['.env', '.env.local', '.env.production', '.env.preview', '.env.test',
    '.env.development', '.env.production.local', '.env.example', '.env.personas.example'];
  const ignored = new Set(execFileSync('git', ['check-ignore', '--no-index', '--stdin'], {
    cwd: path.join(__dirname, '..'), input: files.join('\n') + '\n', encoding: 'utf8'
  }).trim().split(/\r?\n/));
  for (const file of files.slice(0, -2)) assert.ok(ignored.has(file), file);
  for (const sample of files.slice(-2)) assert.ok(!ignored.has(sample), sample);
});
