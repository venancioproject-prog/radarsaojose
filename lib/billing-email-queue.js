'use strict';
const store = require('./billing-store');
const email = require('./billing-email');

async function queueEnabled() {
  const rows = await store.db('billing_email_queue_settings?id=eq.1&select=enabled');
  if (rows?.length !== 1 || typeof rows[0].enabled !== 'boolean') throw new Error('Queue configuration unavailable');
  return rows[0].enabled;
}

async function orderStatus(orderId) {
  const rows = await store.db('billing_email_outbox?order_id=eq.' + encodeURIComponent(orderId) + '&select=state');
  if (!rows?.length) return 'not_scheduled';
  const states = { pending: 'queued', sending: 'processing', sent: 'sent', needs_review: 'needs_review', canceled: 'canceled' };
  if (!Object.hasOwn(states, rows[0].state)) throw new Error('Invalid queue state');
  return states[rows[0].state];
}

async function processOne() {
  if (process.env.BILLING_EMAIL_QUEUE_ENABLED !== 'true' || process.env.BILLING_EMAIL_DELIVERY_ENABLED !== 'true') {
    return { status: 'disabled' };
  }
  if (!email.deliveryConfigured()) return { status: 'pending_configuration' };
  if (!await queueEnabled()) return { status: 'disabled' };
  const job = await store.db('rpc/billing_claim_confirmation_email', { method: 'POST', body: '{}' });
  if (!job) return { status: 'empty' };
  const finish = async (outcome, code = null, providerId = null) => {
    const saved = await store.db('rpc/billing_finish_confirmation_email', { method: 'POST', body: JSON.stringify({
      p_order_id: job.order_id, p_lease_token: job.lease_token,
      p_outcome: outcome, p_error_code: code, p_provider_id: providerId
    }) });
    return { status: saved === true ? outcome : 'lease_lost' };
  };
  const rows = await store.db('billing_orders?id=eq.' + encodeURIComponent(job.order_id) + '&select=*');
  const order = rows?.[0];
  if (!order || order.status !== 'paid') return finish('canceled', 'ORDER_NOT_PAID');
  if (!(Date.parse(order.period_end) > Date.now())) return finish('needs_review', 'ORDER_PERIOD_EXPIRED');
  // The recipient comes only from the confirmed stored order, never from a cron request.
  const result = await email.sendConfirmationEmail({ order });
  if (result.sent && typeof result.id === 'string' && result.id && result.id.length <= 200) return finish('sent', null, result.id);
  if (result.status === 'network_error' || (result.status === 'provider_error' &&
      (result.httpStatus === 429 || result.httpStatus >= 500))) {
    return finish('retry', result.status === 'network_error' ? 'PROVIDER_NETWORK_ERROR' : 'PROVIDER_TEMPORARY_ERROR');
  }
  return finish('needs_review', 'DELIVERY_REQUIRES_REVIEW');
}

module.exports = { queueEnabled, orderStatus, processOne };
