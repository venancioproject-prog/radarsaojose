const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const modal = fs.readFileSync('asaas-checkout-modal.js', 'utf8');
const app = fs.readFileSync('app.js', 'utf8');
function completion(refresh) {
  const messages = [];
  const window = { refreshConfirmedPlan: refresh, closeAsaasModal() { this.closed = true; } };
  const context = { window, currentPlanId: 'report', alert: value => messages.push(value) };
  vm.runInNewContext(modal.slice(modal.indexOf('  window.completeCheckoutAndUnlock ='), modal.indexOf('  // Listener para fechamento')), context);
  return { window, messages };
}
test('pending confirmation never completes checkout', async () => {
  const state = completion(async () => 'gratis');
  await state.window.completeCheckoutAndUnlock();
  assert.equal(state.window.closed, undefined);
  assert.equal(state.messages.length, 1);
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
test('checkout cannot write commercial rights', () => {
  assert.doesNotMatch(modal, /localStorage\.setItem\(['"]userPlan/);
  assert.doesNotMatch(modal, /\.update\(\{\s*plan_type/);
  const simulation = app.slice(app.indexOf('window.simulatePlanChange ='), app.indexOf('window.refreshConfirmedPlan ='));
  assert.doesNotMatch(simulation, /plan_type\s*=|setItem/);
});
