(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.RadarPricing = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const PLAN_PRICES_CENTS = Object.freeze({ dash: 323880, report: 587880, midia: 1428000 });
  const PIX_DISCOUNT_PERCENT = 10;
  const MAX_INSTALLMENTS = 12;
  function price(plan) {
    if (!Object.prototype.hasOwnProperty.call(PLAN_PRICES_CENTS, plan)) throw new Error('INVALID_PLAN');
    return PLAN_PRICES_CENTS[plan];
  }
  function integer(value, min, max) {
    if (!Number.isSafeInteger(value) || value < min || value > max) throw new Error('INVALID_INTEGER');
    return value;
  }
  function method(value) {
    if (!['PIX', 'CREDIT_CARD'].includes(value)) throw new Error('INVALID_PAYMENT_METHOD');
    return value;
  }
  function timestamp(value) {
    // Require explicit timezone: never interpret dates in the machine's local timezone.
    if (typeof value !== 'string' || !/(Z|[+-]\d{2}:\d{2})$/.test(value)) throw new Error('UTC_TIMESTAMP_REQUIRED');
    const result = Date.parse(value);
    if (!Number.isSafeInteger(result)) throw new Error('INVALID_DATE');
    return result;
  }
  function roundRatio(numerator, denominator) {
    return Number((numerator + denominator / 2n) / denominator);
  }
  function split(total, count) {
    integer(total, 0, Number.MAX_SAFE_INTEGER);
    integer(count, 1, MAX_INSTALLMENTS);
    const base = Math.floor(total / count);
    return Array.from({ length: count }, (_, index) => base + (index < total % count ? 1 : 0));
  }
  function quotePurchase({ plan, paymentMethod = 'PIX', installments = 1 }) {
    const listPriceCents = price(plan);
    method(paymentMethod);
    integer(installments, 1, MAX_INSTALLMENTS);
    if (paymentMethod === 'PIX' && installments !== 1) throw new Error('PIX_IS_UPFRONT');
    const amountCents = paymentMethod === 'PIX'
      ? roundRatio(BigInt(listPriceCents) * BigInt(100 - PIX_DISCOUNT_PERCENT), 100n) : listPriceCents;
    return { plan, paymentMethod, listPriceCents, amountCents,
      discountCents: listPriceCents - amountCents, installments: split(amountCents, installments) };
  }
  function quoteUpgrade({ subscription, targetPlan, paymentMethod, now, expectedVersion, creditAlreadyUsed = false }) {
    if (!subscription || !subscription.id || subscription.status !== 'active') throw new Error('ACTIVE_SUBSCRIPTION_REQUIRED');
    integer(subscription.version, 0, Number.MAX_SAFE_INTEGER);
    if (expectedVersion !== subscription.version || creditAlreadyUsed) throw new Error('STALE_OR_CONSUMED_CREDIT');
    const oldPrice = price(subscription.plan), newPrice = price(targetPlan);
    if (newPrice <= oldPrice) throw new Error('UPGRADE_REQUIRED');
    method(paymentMethod);
    const start = timestamp(subscription.periodStart), end = timestamp(subscription.periodEnd), at = timestamp(now);
    if (end <= start || at < start || at >= end) throw new Error('OUTSIDE_ACTIVE_PERIOD');
    const remaining = BigInt(end - at), duration = BigInt(end - start);
    const base = { plan: targetPlan, fromPlan: subscription.plan, paymentMethod,
      subscriptionId: subscription.id, sourceVersion: subscription.version,
      periodEnd: new Date(end).toISOString(), quotedAt: new Date(at).toISOString() };
    // Switching financing modes requires reconciling existing obligations first.
    if (subscription.paymentMethod !== paymentMethod) throw new Error('PAYMENT_MODE_CHANGE_REQUIRES_RECONCILIATION');
    if (paymentMethod === 'PIX') {
      const factor = BigInt(100 - PIX_DISCOUNT_PERCENT);
      const amountCents = roundRatio(BigInt(newPrice - oldPrice) * remaining * factor, duration * 100n);
      return { ...base, amountCents,
        creditCents: roundRatio(BigInt(oldPrice) * remaining * factor, duration * 100n),
        debitCents: roundRatio(BigInt(newPrice) * remaining * factor, duration * 100n),
        // Components are display amounts; amountCents is rounded only after subtraction.
        replacementSchedule: false, installments: [amountCents] };
    }
    const count = integer(subscription.installments, 1, MAX_INSTALLMENTS);
    const paid = integer(subscription.paidInstallments, 0, count);
    if (paid === count) throw new Error('PAID_SCHEDULE_REQUIRES_RECONCILIATION');
    const oldSchedule = split(oldPrice, count).slice(paid);
    const newSchedule = split(newPrice, count).slice(paid);
    const creditCents = oldSchedule.reduce((a, b) => a + b, 0);
    const debitCents = newSchedule.reduce((a, b) => a + b, 0);
    return { ...base, amountCents: debitCents - creditCents, creditCents, debitCents,
      replacementSchedule: true, installments: newSchedule, replacedInstallments: oldSchedule,
      remainingInstallments: count - paid,
      requiresGatewayScheduleReplacement: true };
  }
  return Object.freeze({ PLAN_PRICES_CENTS, PIX_DISCOUNT_PERCENT, MAX_INSTALLMENTS, quotePurchase, quoteUpgrade });
});
