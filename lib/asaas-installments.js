'use strict';

const { BillingError } = require('./billing-store');

function validateInstallments(order, payment, schedule) {
  const count = order.installment_count;
  const expected = order.quote?.installments;
  const reject = () => { throw new BillingError(409, 'ORDER_PENDING_RECONCILIATION'); };
  if (!payment.installment || !Array.isArray(expected) || expected.length !== count ||
      !Array.isArray(schedule?.data) || schedule.hasMore || schedule.data.length !== count) reject();

  const payments = Object.create(null);
  const numbers = new Set();
  let total = 0;
  for (const entry of schedule.data) {
    const number = entry.installmentNumber;
    const amount = Math.round(Number(entry.value) * 100);
    if (typeof entry.id !== 'string' || !entry.id || Object.hasOwn(payments, entry.id) ||
        !Number.isInteger(number) || number < 1 || number > count || numbers.has(number) ||
        entry.externalReference !== order.id || entry.installment !== payment.installment ||
        entry.billingType !== order.payment_method || !Number.isSafeInteger(amount) || amount <= 0 ||
        (number < count && Math.abs(amount - expected[number - 1]) > 1)) reject();
    numbers.add(number);
    payments[entry.id] = amount;
    total += amount;
  }
  if (total !== Number(order.amount_cents) || !Object.hasOwn(payments, payment.id)) reject();
  return payments;
}

module.exports = { validateInstallments };
