'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const {db, BillingError, fail} = require('../lib/billing-store');
const {sendConfirmationEmail} = require('../lib/billing-email');
const {validateInstallments} = require('../lib/asaas-installments');

const MAX_WEBHOOK_BODY_BYTES = 256 * 1024; // 256 KB

function loadEnvIfNeeded() {
  if (process.env.ASAAS_WEBHOOK_SECRET !== undefined || process.env.ASAAS_WEBHOOK_TOKEN !== undefined) return;
  if (!fs || typeof fs.existsSync !== 'function' || typeof fs.readFileSync !== 'function') return;
  const cwd = typeof process.cwd === 'function' ? process.cwd() : '.';
  const envFiles = [
    path.join(cwd, '.env.local'),
    path.join(cwd, '.env')
  ];
  for (const p of envFiles) {
    try {
      if (fs.existsSync(p)) {
        const text = fs.readFileSync(p, 'utf8');
        for (const line of text.split('\n')) {
          const trimmed = line.trim();
          if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
            const idx = trimmed.indexOf('=');
            const k = trimmed.slice(0, idx).trim();
            const v = trimmed.slice(idx + 1).replace(/^['"]|['"\r]$/g, '').trim();
            if (k && process.env[k] === undefined) process.env[k] = v;
          }
        }
      }
    } catch (_) {}
  }
}

const KNOWN_ASAAS_EVENTS = new Set([
  'PAYMENT_RECEIVED',
  'PAYMENT_CONFIRMED',
  'PAYMENT_OVERDUE',
  'PAYMENT_DELETED',
  'PAYMENT_REFUNDED',
  'PAYMENT_CHARGEBACK_REQUESTED'
]);

function getHeader(req, name) {
  const headers = req?.headers;
  if (!headers || typeof headers !== 'object') return undefined;
  const lower = name.toLowerCase();
  if (headers[lower] !== undefined) return headers[lower];
  for (const [k, v] of Object.entries(headers)) {
    if (k.toLowerCase() === lower) return v;
  }
  return undefined;
}

function verifyAsaasWebhookToken(received, expected) {
  if (typeof received !== 'string' || typeof expected !== 'string' || !received || !expected) return false;
  const a = Buffer.from(received, 'utf8');
  const b = Buffer.from(expected, 'utf8');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

async function readRawBody(req) {
  function boundedBuffer(value) {
    // Check strings before allocating their UTF-8 buffer; characters are not bytes.
    const size = Buffer.isBuffer(value) ? value.length : Buffer.byteLength(value, 'utf8');
    if (size > MAX_WEBHOOK_BODY_BYTES) throw new BillingError(413, 'WEBHOOK_PAYLOAD_TOO_LARGE');
    return Buffer.isBuffer(value) ? value : Buffer.from(value, 'utf8');
  }
  if (Buffer.isBuffer(req.rawBody) || typeof req.rawBody === 'string') return boundedBuffer(req.rawBody);
  if (Buffer.isBuffer(req.body) || typeof req.body === 'string') return boundedBuffer(req.body);
  // Some runtimes provide a parsed body as well as an async iterable request.
  // Validate the representation that the handler will actually process.
  if (req.body && typeof req.body === 'object') {
    let serialized;
    try { serialized = JSON.stringify(req.body); }
    catch (_) { throw new BillingError(400, 'INVALID_JSON'); }
    if (typeof serialized !== 'string') throw new BillingError(400, 'INVALID_JSON');
    return boundedBuffer(serialized);
  }
  if (req && typeof req[Symbol.asyncIterator] === 'function') {
    const chunks = [];
    let total = 0;
    for await (const chunk of req) {
      const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk), 'utf8');
      total += buf.length;
      if (total > MAX_WEBHOOK_BODY_BYTES) throw new BillingError(413, 'WEBHOOK_PAYLOAD_TOO_LARGE');
      chunks.push(buf);
    }
    return Buffer.concat(chunks);
  }
  return Buffer.alloc(0);
}

function cents(value) {
  const text = String(value);
  if (!/^\d+(\.\d{1,2})?$/.test(text)) throw new BillingError(400, 'INVALID_PAYMENT_VALUE');
  const [whole, fractional = ''] = text.split('.');
  const result = Number(whole) * 100 + Number(fractional.padEnd(2, '0'));
  if (!Number.isSafeInteger(result)) throw new BillingError(400, 'INVALID_PAYMENT_VALUE');
  return result;
}

function checkAmount(order, payment) {
  if (order.quote?.requiresGatewayScheduleReplacement) throw new BillingError(409, 'SCHEDULE_RECONCILIATION_REQUIRED');
  if (payment.currency !== undefined && payment.currency !== 'BRL') throw new BillingError(409, 'PAYMENT_CURRENCY_MISMATCH');
  const count = order.installment_count;
  const gatewayPayments = order.quote?.gatewayPayments;
  const expected = count === 1 ? Number(order.amount_cents) : gatewayPayments
    ? (Object.hasOwn(gatewayPayments, payment.id) ? gatewayPayments[payment.id] : undefined)
    : order.quote?.installments?.[0];
  if (!Number.isSafeInteger(expected) || cents(payment.value) !== expected) throw new BillingError(409, 'PAYMENT_AMOUNT_MISMATCH');
  if (payment.billingType !== order.payment_method) throw new BillingError(409, 'PAYMENT_METHOD_MISMATCH');
}

async function verifyPaymentWithAsaas(paymentId, order, eventType) {
  const { key: apiKey, url: apiUrl } = require('../lib/asaas-config').asaasConfig(process.env);

  if (!apiKey) throw new BillingError(503, 'ASAAS_NOT_CONFIGURED');
  if (typeof fetch !== 'function') throw new BillingError(503, 'ASAAS_VERIFICATION_FAILED');

  let response;
  try {
    response = await fetch(apiUrl + '/payments/' + encodeURIComponent(paymentId), {
      method: 'GET',
      headers: { access_token: apiKey, 'Content-Type': 'application/json', 'User-Agent': 'RadarSaoJose/1.0' },
      redirect: 'error',
      signal: typeof AbortSignal !== 'undefined' && AbortSignal.timeout ? AbortSignal.timeout(10000) : undefined
    });
  } catch (_) {
    throw new BillingError(502, 'ASAAS_VERIFICATION_FAILED');
  }
  if (!response || !response.ok) throw new BillingError(502, 'ASAAS_VERIFICATION_FAILED');

  const live = await response.json();
  if (!live || live.id !== paymentId) throw new BillingError(409, 'ASAAS_PAYMENT_STATE_MISMATCH');
  if ((order.quote?.gatewayPayments || live.externalReference != null) && live.externalReference !== order.id) {
    throw new BillingError(409, 'PAYMENT_ORDER_MISMATCH');
  }
  if (live.billingType && live.billingType !== order.payment_method) {
    throw new BillingError(409, 'PAYMENT_METHOD_MISMATCH');
  }

  if (['PAYMENT_RECEIVED', 'PAYMENT_CONFIRMED'].includes(eventType)) {
    if (!['RECEIVED', 'CONFIRMED', 'RECEIVED_IN_CASH'].includes(live.status) || live.deleted === true) {
      throw new BillingError(409, 'ASAAS_PAYMENT_STATE_MISMATCH');
    }
    checkAmount(order, live);
  } else if (eventType === 'PAYMENT_REFUNDED') {
    if (!['REFUNDED', 'REFUND_REQUESTED', 'REFUND_IN_PROGRESS'].includes(live.status)) {
      throw new BillingError(409, 'ASAAS_PAYMENT_STATE_MISMATCH');
    }
  } else if (eventType === 'PAYMENT_CHARGEBACK_REQUESTED') {
    if (!['CHARGEBACK_REQUESTED', 'CHARGEBACK_DISPUTE', 'AWAITING_CHARGEBACK_REVERSAL', 'REFUNDED'].includes(live.status)) {
      throw new BillingError(409, 'ASAAS_PAYMENT_STATE_MISMATCH');
    }
  } else if (eventType === 'PAYMENT_DELETED') {
    if (live.deleted !== true && !['DELETED', 'REFUNDED'].includes(live.status)) {
      throw new BillingError(409, 'ASAAS_PAYMENT_STATE_MISMATCH');
    }
  } else if (eventType === 'PAYMENT_OVERDUE') {
    if (live.status !== 'OVERDUE') {
      throw new BillingError(409, 'ASAAS_PAYMENT_STATE_MISMATCH');
    }
  }
  return live;
}

async function recoverUnboundCardOrder(order, paymentId) {
  const { key, url } = require('../lib/asaas-config').asaasConfig(process.env);
  if (!key) throw new BillingError(503, 'ASAAS_NOT_CONFIGURED');
  const options = {
    headers: { access_token: key, 'User-Agent': 'RadarSaoJose/1.0' },
    redirect: 'error', signal: AbortSignal.timeout(10000)
  };
  const response = await fetch(url + '/payments/' + encodeURIComponent(paymentId), options);
  if (!response.ok) throw new BillingError(502, 'ASAAS_VERIFICATION_FAILED');
  const live = await response.json();
  if (live.id !== paymentId || live.externalReference !== order.id ||
      live.billingType !== 'CREDIT_CARD' || live.deleted ||
      !['CONFIRMED', 'RECEIVED', 'RECEIVED_IN_CASH'].includes(live.status) || !live.installment) {
    throw new BillingError(409, 'PAYMENT_ORDER_NOT_BOUND');
  }
  const scheduleResponse = await fetch(url + '/installments/' + encodeURIComponent(live.installment) +
    '/payments?limit=' + order.installment_count, options);
  if (!scheduleResponse.ok) throw new BillingError(502, 'ASAAS_VERIFICATION_FAILED');
  const schedule = await scheduleResponse.json();
  const gatewayPayments = validateInstallments(order, live, schedule);
  const firstPayment = schedule.data.find(entry => entry.installmentNumber === 1);
  const quote = { ...order.quote, gatewayPayments };
  checkAmount({ ...order, quote }, live);
  const rows = await db('billing_orders?id=eq.' + encodeURIComponent(order.id) +
    '&status=eq.pending&asaas_payment_id=is.null', {
    method: 'PATCH', headers: { Prefer: 'return=representation' },
    body: JSON.stringify({ asaas_payment_id: firstPayment.id, quote })
  });
  if (rows?.length !== 1) throw new BillingError(409, 'PAYMENT_ORDER_NOT_BOUND');
  return rows[0];
}

async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'GET' && req.query?.emailQueue === '1') {
    const secret = process.env.CRON_SECRET;
    const authorization = getHeader(req, 'authorization');
    if (typeof secret !== 'string' || secret.trim().length < 32 ||
        !verifyAsaasWebhookToken(authorization, 'Bearer ' + secret)) {
      return res.status(401).json({ success: false, code: 'UNAUTHORIZED' });
    }
    try {
      const result = await require('../lib/billing-email-queue').processOne();
      return res.status(200).json({ success: true, ...result });
    } catch (_) {
      return res.status(503).json({ success: false, code: 'EMAIL_QUEUE_UNAVAILABLE' });
    }
  }
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, code: 'METHOD_NOT_ALLOWED' });
  }

  try {
    loadEnvIfNeeded();
    const secret = process.env.ASAAS_WEBHOOK_SECRET || process.env.ASAAS_WEBHOOK_TOKEN;
    if (!secret || secret === 'sandbox_webhook_token' || secret.trim().length < 16) {
      throw new BillingError(503, 'WEBHOOK_SECRET_NOT_CONFIGURED');
    }

    // 1. Validação em tempo constante do header oficial asaas-access-token antes de ler/parsear o corpo no handler
    const accessToken = getHeader(req, 'asaas-access-token');
    if (!verifyAsaasWebhookToken(accessToken, secret)) {
      throw new BillingError(401, 'INVALID_WEBHOOK_TOKEN');
    }

    // 2. Leitura controlada do raw body (limite de 256 KB) após autenticação do header
    const rawBuffer = await readRawBody(req);

    let body;
    if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body) && req.rawBody === undefined) {
      body = req.body;
    } else {
      const rawText = rawBuffer.toString('utf8');
      if (!rawText) throw new BillingError(400, 'INVALID_JSON');
      try { body = JSON.parse(rawText); } catch (_) { throw new BillingError(400, 'INVALID_JSON'); }
    }
    return await processPaymentEvent(body, res);
  } catch (error) {
    return fail(res, error);
  }
}

async function processPaymentEvent(body, res) {
  if (!body || typeof body.id !== 'string' || !body.id || typeof body.event !== 'string') throw new BillingError(400, 'INVALID_EVENT');
  if (!KNOWN_ASAAS_EVENTS.has(body.event)) return res.status(200).json({ success: true, ignored: true });

  const payment = body.payment;
  if (!payment || typeof payment.id !== 'string' || !payment.id || payment.id.startsWith('pay_sb_')) throw new BillingError(400, 'INVALID_PAYMENT');
  if (payment.currency !== undefined && payment.currency !== 'BRL') throw new BillingError(409, 'PAYMENT_CURRENCY_MISMATCH');

  const orders = await db('billing_orders?asaas_payment_id=eq.' + encodeURIComponent(payment.id) + '&select=*');
  let order = orders?.[0];
  if (!order && typeof payment.externalReference === 'string' && /^[\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12}$/i.test(payment.externalReference)) {
    const candidates = await db('billing_orders?id=eq.' + encodeURIComponent(payment.externalReference) + '&select=*');
    const candidate = candidates?.[0];
    if (candidate?.status === 'pending' && !candidate.asaas_payment_id &&
        candidate.payment_method === 'CREDIT_CARD' && candidate.installment_count > 1 &&
        ['PAYMENT_CONFIRMED', 'PAYMENT_RECEIVED'].includes(body.event)) {
      order = await recoverUnboundCardOrder(candidate, payment.id);
    } else if (candidate && !candidate.asaas_payment_id) {
      throw new BillingError(409, 'PAYMENT_ORDER_NOT_BOUND');
    }
    if (candidate?.quote?.gatewayPayments && Object.hasOwn(candidate.quote.gatewayPayments, payment.id)) order = candidate;
  }
  // This webhook can receive other charges from the same Asaas account.
  // Acknowledge them without persisting or applying them to a Radar order.
  if (!order) return res.status(200).json({ success: true, ignored: true });
  if (order.quote?.gatewayPayments && !Object.hasOwn(order.quote.gatewayPayments, payment.id)) {
    throw new BillingError(409, 'PAYMENT_ORDER_NOT_BOUND');
  }
  if (payment.externalReference !== undefined && payment.externalReference !== null && payment.externalReference !== order.id) {
    throw new BillingError(409, 'PAYMENT_ORDER_MISMATCH');
  }

  // Persist in a separate transaction before processing. No email/description is authority.
  await db('billing_gateway_events?on_conflict=event_id', {
    method: 'POST',
    headers: { Prefer: 'resolution=ignore-duplicates' },
    body: JSON.stringify({
      event_id: body.id,
      payment_id: payment.id,
      event_type: body.event,
      occurred_at: new Date().toISOString(),
      payload: body,
      status: 'pending'
    })
  });

  const events = await db('billing_gateway_events?event_id=eq.' + encodeURIComponent(body.id) + '&select=*');
  const stored = events?.[0];
  if (
    !stored ||
    stored.payment_id !== payment.id ||
    stored.event_type !== body.event ||
    (stored.payload?.payment?.value !== undefined && payment.value !== undefined && cents(stored.payload.payment.value) !== cents(payment.value)) ||
    (stored.payload?.payment?.billingType !== undefined && payment.billingType !== undefined && stored.payload.payment.billingType !== payment.billingType)
  ) {
    throw new BillingError(409, 'EVENT_ID_CONFLICT');
  }

  if (['PAYMENT_RECEIVED', 'PAYMENT_CONFIRMED'].includes(body.event)) {
    checkAmount(order, stored.payload.payment);
  }

  // 3. Confirmação ativa server-to-server na API v3 do Asaas (GET /v3/payments/{id})
  await verifyPaymentWithAsaas(payment.id, order, body.event);

  const result = await db('rpc/billing_process_event', {
    method: 'POST',
    body: JSON.stringify({ p_event_id: body.id })
  });
  if (!result?.success) throw new BillingError(503, 'BILLING_EVENT_PROCESSING_FAILED');

  // Migration 023 schedules new paid orders in the SAME database transaction.
  // The disabled-by-default flags preserve the existing deployment until rollout.
  if (process.env.BILLING_EMAIL_QUEUE_ENABLED === 'true' &&
      ['PAYMENT_RECEIVED', 'PAYMENT_CONFIRMED'].includes(body.event)) {
    try {
      const queue = require('../lib/billing-email-queue');
      if (await queue.queueEnabled()) {
        return res.status(200).json({ ...result, emailStatus: await queue.orderStatus(order.id) });
      }
    } catch (_) {
      // Never fall back to direct delivery after an uncertain queue read.
      return res.status(200).json({ ...result, emailStatus: 'queue_unavailable' });
    }
  }

  // Despacho de e-mail seguro e desacoplado após confirmação persistida
  let emailStatus = 'ignored';
  if (!result.duplicate && !result.ignored && !result.installmentUpdated && ['PAYMENT_RECEIVED', 'PAYMENT_CONFIRMED'].includes(body.event)) {
    try {
      const confirmationOrder = order.quote?.termPolicy === 'annual_upgrade_v1'
        ? (await db('billing_orders?id=eq.' + encodeURIComponent(order.id) + '&select=*'))?.[0]
        : order;
      if (!confirmationOrder) throw new Error('Order unavailable for confirmation email');
      const emailRes = await sendConfirmationEmail({ order: confirmationOrder, event: stored.payload });
      emailStatus = emailRes.status;
    } catch (emailErr) {
      console.error('[Asaas Webhook] Erro não-bloqueante no envio de e-mail:', emailErr);
      emailStatus = 'failed_non_blocking';
    }
  } else if (result.duplicate) {
    emailStatus = 'duplicate_ignored';
  }

  return res.status(200).json({ ...result, emailStatus });
}

module.exports = handler;
module.exports.processPaymentEvent = processPaymentEvent;
module.exports.config = { api: { bodyParser: false } };
module.exports.verifyAsaasWebhookToken = verifyAsaasWebhookToken;
module.exports.verifyPaymentWithAsaas = verifyPaymentWithAsaas;
module.exports.checkAmount = checkAmount;
module.exports.KNOWN_ASAAS_EVENTS = KNOWN_ASAAS_EVENTS;
