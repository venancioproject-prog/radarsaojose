const test = require('node:test');
const assert = require('node:assert/strict');
const p = require('../lib/pricing');
const sub = { id:'s1', plan:'dash', status:'active', periodStart:'2026-01-01T00:00:00Z', periodEnd:'2027-01-01T00:00:00Z', version:0, paymentMethod:'PIX' };
const quote = (changes = {}) => p.quoteUpgrade({ subscription:sub, targetPlan:'report', paymentMethod:'PIX', now:sub.periodStart, expectedVersion:0, ...changes });
test('annual catalog and single Pix discount', () => {
  assert.equal(p.quotePurchase({plan:'dash'}).amountCents,291492);
  assert.equal(p.quotePurchase({plan:'midia'}).amountCents,1285200);
  assert.deepEqual(p.quotePurchase({plan:'report',paymentMethod:'CREDIT_CARD',installments:12}).installments, Array(12).fill(48990));
});
test('first day and final day prorated Pix upgrade', () => {
  assert.equal(quote().amountCents,237600);
  assert.equal(quote({now:'2026-12-31T00:00:00Z'}).amountCents,651);
  assert.throws(()=>quote({now:sub.periodEnd}),/OUTSIDE/);
});
test('sequential upgrades telescope at same instant and reject stale credit', () => {
  const first = quote();
  const second = quote({subscription:{...sub,plan:'report',version:1},targetPlan:'midia',expectedVersion:1});
  assert.equal(first.amountCents + second.amountCents,quote({targetPlan:'midia'}).amountCents);
  assert.throws(()=>quote({subscription:{...sub,version:1}}),/STALE/);
  assert.throws(()=>quote({creditAlreadyUsed:true}),/CONSUMED/);
});
test('month four replaces eight remaining installments, never adds new twelve', () => {
  const q=quote({subscription:{...sub,paymentMethod:'CREDIT_CARD',installments:12,paidInstallments:4},paymentMethod:'CREDIT_CARD',now:'2026-05-01T00:00:00Z'});
  assert.deepEqual(q.installments,Array(8).fill(48990));
  assert.equal(q.amountCents,176000);
  assert.equal(q.replacementSchedule,true);
  assert.equal(q.debitCents,391920);
});
test('reject invalid input, downgrade and unsupported financing conversion', () => {
  assert.throws(()=>quote({now:'2026-06-01'}),/UTC/);
  assert.throws(()=>quote({targetPlan:'dash'}),/UPGRADE/);
  assert.throws(()=>quote({paymentMethod:'CREDIT_CARD'}),/RECONCILIATION/);
  assert.throws(()=>p.quotePurchase({plan:'report',installments:2}),/UPFRONT/);
  assert.throws(()=>p.quotePurchase({plan:'report',paymentMethod:'CREDIT_CARD',installments:13}),/INTEGER/);
});
test('installment remainder preserves exact cents', () => {
  const q=p.quotePurchase({plan:'dash',paymentMethod:'CREDIT_CARD',installments:7});
  assert.equal(q.installments.reduce((a,b)=>a+b,0),323880);
  assert.ok(Math.max(...q.installments)-Math.min(...q.installments)<=1);
});
