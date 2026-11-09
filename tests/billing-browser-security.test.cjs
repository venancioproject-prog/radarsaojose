const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { quotePurchase } = require('../lib/pricing');
const vm = require('node:vm');
const modal = fs.readFileSync('asaas-checkout-modal.js', 'utf8');
const app = fs.readFileSync('app.js', 'utf8');
function completion(refresh, verify) {
  const status = { focus() {} };
  const window = { refreshConfirmedPlan: refresh, closeAsaasModal() { this.closed = true; } };
  const context = { window, currentPlanId: 'report', isCheckingPayment: false, isSubmitting: false,
    document: { getElementById: () => status }, AbortSignal,
    supabaseClient: verify && { auth: { getSession: async () => ({ data: { session: { access_token: 'fixture' } } }) } },
    fetch: verify };
  vm.runInNewContext(modal.slice(modal.indexOf('  window.completeCheckoutAndUnlock ='), modal.indexOf('  // Listener para fechamento')), context);
  return { window, status };
}
test('card checkout sends customers to Asaas and rejects legacy card fields', async () => {
  const path = require('node:path');
  const filename = path.resolve('api/asaas-checkout.js');
  const localRequire = require('node:module').createRequire(filename);
  const billing = localRequire('../lib/billing-store');
  const gatewayCalls = [];
  const module = { exports: {} };
  vm.runInNewContext(fs.readFileSync(filename, 'utf8'), {
    module, AbortSignal, console, __dirname: path.dirname(filename),
    process: { cwd: () => path.dirname(filename), env: { ASAAS_SANDBOX_API_KEY: 'fixture' } },
    require(id) {
      if (id === 'fs') return { existsSync: () => false };
      if (id !== '../lib/billing-store') return localRequire(id);
      return {
        ...billing,
        authenticate: async () => ({ id: 'buyer', email: 'buyer@example.invalid' }),
        subscription: async () => null,
        db: async (route, options) => route === 'billing_orders' && options?.method === 'POST'
          ? [{ id: 'order' }] : []
      };
    },
    async fetch(url, options) {
      const route = new URL(url).pathname;
      const payload = options.body ? JSON.parse(options.body) : null;
      gatewayCalls.push({ route, payload });
      let body;
      if (route === '/v3/customers') body = { id: 'customer' };
      else if (route === '/v3/payments') {
        body = {
          id: 'payment', status: 'PENDING', invoiceUrl: 'https://sandbox.asaas.com/i/example',
          installment: payload.installmentCount > 1 ? 'group' : undefined
        };
      } else {
        assert.equal(route, '/v3/installments/group/payments');
        const count = Number(new URL(url).searchParams.get('limit'));
        const quote = quotePurchase({ plan: 'dash', paymentMethod: 'CREDIT_CARD', installments: count });
        const base = Math.floor(quote.amountCents / count);
        body = { data: quote.installments.map((_, index) => ({
          id: index === 0 ? 'payment' : 'payment-' + (index + 1),
          value: (index === count - 1 ? quote.amountCents - base * (count - 1) : base) / 100,
          installmentNumber: index + 1, installment: 'group',
          billingType: 'CREDIT_CARD', externalReference: 'order'
        })) };
      }
      return { ok: true, json: async () => body };
    }
  });
  async function request(fields) {
    const res = {
      setHeader() {},
      status(code) { this.code = code; return this; },
      json(body) { this.body = body; }
    };
    await module.exports({
      method: 'POST', body: {
        plan: 'dash', billingType: 'CREDIT_CARD',
        name: 'Cliente Teste', cpfCnpj: '52998224725', ...fields
      }
    }, res);
    return res;
  }
  assert.equal((await request({ creditCard: { number: 'fixture' } })).body.code, 'HOSTED_CARD_ONLY');
  assert.equal(gatewayCalls.length, 0);
  const hosted = await request({});
  assert.equal(hosted.code, 200);
  assert.equal(hosted.body.payment.status, 'PENDING');
  assert.equal(hosted.body.payment.invoiceUrl, 'https://sandbox.asaas.com/i/example');
  assert.equal(gatewayCalls[1].route, '/v3/payments');
  assert.equal(gatewayCalls[1].payload.billingType, 'CREDIT_CARD');
  assert.equal(gatewayCalls[1].payload.value, 3238.80);
  assert.equal(gatewayCalls[1].payload.installmentCount, undefined);
  const installments = await request({ installmentCount: 2 });
  assert.equal(installments.code, 200);
  assert.equal(installments.body.payment.installmentCount, 2);
  assert.equal(gatewayCalls[3].payload.installmentCount, 2);
  assert.equal(gatewayCalls[4].route, '/v3/installments/group/payments');
  const rounded = await request({ installmentCount: 7 });
  assert.equal(rounded.code, 200);
  assert.equal(rounded.body.payment.installmentCount, 7);
  assert.doesNotMatch(JSON.stringify(gatewayCalls), /creditCard|ccv/i);
  assert.doesNotMatch(modal, /asaasCard(?:Number|Cvv|Expiry)|payload\.creditCard/);
});

test('pending confirmation never completes checkout', async () => {
  const state = completion(async () => 'gratis');
  await state.window.completeCheckoutAndUnlock();
  assert.equal(state.window.closed, undefined);
  assert.match(state.status.textContent, /pendente/);
});
test('manual verification checks the existing payment and re-reads the confirmed plan', async () => {
  let active = 'dash';
  const state = completion(async () => active, async (url, request) => {
    assert.equal(url, '/api/asaas-checkout');
    assert.deepEqual(JSON.parse(request.body), { action: 'verifyPayment', plan: 'report' });
    active = 'report';
    return { ok: true };
  });
  await state.window.completeCheckoutAndUnlock();
  assert.equal(state.window.closed, true);
});
test('server confirmed plan completes checkout', async () => {
  const state = completion(async () => 'report');
  await state.window.completeCheckoutAndUnlock();
  assert.equal(state.window.closed, true);
});
test('failed confirmation never completes checkout', async () => {
  const state = completion(async () => { throw new Error('offline'); });
  await state.window.completeCheckoutAndUnlock();
  assert.equal(state.window.closed, undefined);
});
test('a paid profile cannot confirm checkout when the entitlement API fails', async () => {
  const window = { appState: {}, applyPlanRestrictions() {} };
  const supabaseClient = {
    auth: {
      getUser: async () => ({ data: { user: { id: 'buyer' } } }),
      getSession: async () => ({ data: { session: { access_token: 'test-session' } } })
    },
    from: () => ({ select: () => ({ eq: () => ({
      single: async () => ({ data: { id: 'buyer', plan_type: 'report' } })
    }) }) })
  };
  const start = app.indexOf('window.refreshConfirmedPlan =');
  const end = app.indexOf('\n};', start) + 3;
  vm.runInNewContext(app.slice(start, end), {
    window, supabaseClient, fetch: async () => ({ ok: false })
  });
  await assert.rejects(window.refreshConfirmedPlan(), /Não foi possível confirmar seu plano/);
  assert.equal(window.appState.plan_type, 'gratis');
  assert.equal(window.appState.entitlement, null);
});
test('checkout cannot write commercial rights', () => {
  assert.doesNotMatch(modal, /localStorage\.setItem\(['"]userPlan/);
  assert.doesNotMatch(modal, /\.update\(\{\s*plan_type/);
  const simulation = app.slice(app.indexOf('window.simulatePlanChange ='), app.indexOf('window.refreshConfirmedPlan ='));
  assert.doesNotMatch(simulation, /plan_type\s*=|setItem/);
});
