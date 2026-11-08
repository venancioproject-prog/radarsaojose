// ============================================================================
// API Serverless: Checkout & Geração de Pagamento Asaas (PIX / Cartão / Boleto)
// Radar São José • Planos: Dash (R$ 269,90/mês), Report (R$ 489,90/mês), Mídia (R$ 1.190,00/mês)
// Suporte nativo ao Asaas Sandbox com fallback robusto e tratamento amigável de erros
// ============================================================================

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const zlib = require('zlib');

// Carregador de variáveis de ambiente
function loadEnv() {
  const envFiles = [
    path.join(process.cwd(), '.env.local'),
    path.join(process.cwd(), '.env'),
    path.join(__dirname, '..', '.env')
  ];
  for (const p of envFiles) {
    if (fs.existsSync(p)) {
      try {
        const text = fs.readFileSync(p, 'utf8');
        text.split('\n').forEach(line => {
          const trimmed = line.trim();
          if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
            const idx = trimmed.indexOf('=');
            const k = trimmed.slice(0, idx).trim();
            const v = trimmed.slice(idx + 1).replace(/^['"]|['"\r]$/g, '').trim();
            if (k && !process.env[k]) {
              process.env[k] = v;
            }
          }
        });
      } catch (e) {}
    }
  }
}
loadEnv();

const { asaasConfig } = require('../lib/asaas-config');
const { environment: ASAAS_ENVIRONMENT, url: ASAAS_API_URL, key: apiKey } = asaasConfig(process.env);

const RATE_LIMIT_BUCKETS = new Map();
function checkRateLimit(key, maxRequests, windowMs = 60000) {
  const now = Date.now();
  const bucket = (RATE_LIMIT_BUCKETS.get(key) || []).filter(ts => now - ts < windowMs);
  if (bucket.length >= maxRequests) return false;
  bucket.push(now);
  RATE_LIMIT_BUCKETS.set(key, bucket);
  return true;
}

function resolveClientIp(req) {
  const ipRegex = /^[0-9a-fA-F.:]{3,45}$/;
  if (process.env.VERCEL === '1') {
    const vercelIp = String(req.headers?.['x-vercel-forwarded-for'] || '').split(',')[0].trim();
    if (ipRegex.test(vercelIp)) return vercelIp;
  }
  if (process.env.TRUST_PROXY === 'true') {
    const forwardedIp = String(req.headers?.['x-forwarded-for'] || '').split(',')[0].trim();
    if (ipRegex.test(forwardedIp)) return forwardedIp;
  }
  const socketIp = String(req.socket?.remoteAddress || '').trim();
  return ipRegex.test(socketIp) ? socketIp : '127.0.0.1';
}

// Definição Oficial dos Planos Comerciais Radar São José (12x anual)
const PLANS_CONFIG = {
  dash: {
    id: 'dash',
    name: 'Plano Dash (Explorer)',
    subtitle: 'Explorer',
    installmentCount: 12,
    installmentValue: 269.90,
    value: 3238.80, // 12 * 269.90
    description: 'Radar São José - Assinatura Anual Plano Dash (Explorer)'
  },
  report: {
    id: 'report',
    name: 'Plano Report (Executive - Recomendado)',
    subtitle: 'Executive',
    installmentCount: 12,
    installmentValue: 489.90,
    value: 5878.80, // 12 * 489.90
    description: 'Radar São José - Assinatura Anual Plano Report (Executive)'
  },
  midia: {
    id: 'midia',
    name: 'Plano Mídia (Authority / Cotas)',
    subtitle: 'Authority',
    installmentCount: 12,
    installmentValue: 1190.00,
    value: 14280.00, // 12 * 1190.00
    description: 'Radar São José - Assinatura Anual Plano Mídia (Authority / Cotas)'
  }
};

// Configurações de Upgrade com Cobrança de Diferença Proporcional Anual
const UPGRADE_CONFIGS = {
  'dash->report': {
    value: 2640.00, // 5878.80 - 3238.80
    installmentValue: 220.00,
    installmentCount: 12,
    description: 'Radar São José - Upgrade Plano Dash para Plano Report (Executive)'
  },
  'dash->midia': {
    value: 11041.20, // 14280.00 - 3238.80
    installmentValue: 920.10,
    installmentCount: 12,
    description: 'Radar São José - Upgrade Plano Dash para Plano Mídia (Authority)'
  },
  'report->midia': {
    value: 8401.20, // 14280.00 - 5878.80
    installmentValue: 700.10,
    installmentCount: 12,
    description: 'Radar São José - Upgrade Plano Report para Plano Mídia (Authority)'
  }
};

function resolvePlan(planKey) {
  if (!planKey) return PLANS_CONFIG.report;
  const raw = String(planKey).trim();
  let key = raw.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  key = key.replace(/^(plano|plano_)[_\s\-]*/, '').trim();

  if (key === 'dash' || key === 'explorer' || key === 'pro' || key === 'plano_10' || key.includes('dash')) return PLANS_CONFIG.dash;
  if (key === 'report' || key === 'executive' || key === 'plano_15' || key.includes('report')) return PLANS_CONFIG.report;
  if (key === 'midia' || key === 'authority' || key === 'cotas' || key === 'cota' || key === 'enterprise' || key === 'empresarial' || key.includes('midia')) return PLANS_CONFIG.midia;
  if (Object.prototype.hasOwnProperty.call(PLANS_CONFIG, key)) {
    return PLANS_CONFIG[key];
  }
  return PLANS_CONFIG.report;
}

// Validação de CPF
function validateCpf(cpf) {
  const clean = String(cpf || '').replace(/\D/g, '');
  if (clean.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(clean)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(clean.charAt(i), 10) * (10 - i);
  let rem = (sum * 10) % 11;
  if (rem === 10 || rem === 11) rem = 0;
  if (rem !== parseInt(clean.charAt(9), 10)) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(clean.charAt(i), 10) * (11 - i);
  rem = (sum * 10) % 11;
  if (rem === 10 || rem === 11) rem = 0;
  if (rem !== parseInt(clean.charAt(10), 10)) return false;

  return true;
}

// Validação de CNPJ
function validateCnpj(cnpj) {
  const clean = String(cnpj || '').replace(/\D/g, '');
  if (clean.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(clean)) return false;

  let length = 12;
  let numbers = clean.substring(0, length);
  let digits = clean.substring(length);
  let sum = 0;
  let pos = length - 7;
  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i), 10) * pos--;
    if (pos < 2) pos = 9;
  }
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0), 10)) return false;

  length = 13;
  numbers = clean.substring(0, length);
  sum = 0;
  pos = length - 7;
  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i), 10) * pos--;
    if (pos < 2) pos = 9;
  }
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(1), 10)) return false;

  return true;
}

function validateCpfCnpj(val) {
  if (!val) return { valid: false, error: 'CPF ou CNPJ é obrigatório para emissão de nota e cobrança.' };
  const clean = String(val).replace(/\D/g, '');
  if (clean.length === 11) {
    if (!validateCpf(clean)) return { valid: false, error: 'O CPF informado possui dígitos verificadores inválidos.' };
    return { valid: true, clean, type: 'CPF' };
  } else if (clean.length === 14) {
    if (!validateCnpj(clean)) return { valid: false, error: 'O CNPJ informado possui dígitos verificadores inválidos.' };
    return { valid: true, clean, type: 'CNPJ' };
  }
  return { valid: false, error: 'Documento deve conter 11 dígitos (CPF) ou 14 dígitos (CNPJ).' };
}

// Validação de Luhn para Cartão de Crédito
function luhnCheck(num) {
  let sum = 0;
  let alternate = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let n = parseInt(num[i], 10);
    if (isNaN(n)) return false;
    if (alternate) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alternate = !alternate;
  }
  return sum % 10 === 0;
}

const pricing = require('../lib/pricing');
const billing = require('../lib/billing-store');

function isPublicSupabaseKey(key) {
  if (/^sb_publishable_[A-Za-z0-9_-]+$/.test(key || '')) return true;
  if (!/^eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(key || '')) return false;
  try {
    return JSON.parse(Buffer.from(key.split('.')[1], 'base64url').toString('utf8')).role === 'anon';
  } catch (_) {
    return false;
  }
}

module.exports = async function handler(req, res) {
  if (req.method === 'GET' && req.query?.surveyDemo === '1') {
    res.setHeader('Cache-Control', 'no-store');
    if (process.env.VERCEL_ENV !== 'preview') return res.status(404).json({success:false});
    return res.status(200).json({ rows: require('../lib/survey-data').demoSurveyRows() });
  }
  if (req.method === 'GET' && req.query?.browserConfig === '1') {
    const preview = process.env.VERCEL_ENV === 'preview';
    const url = process.env.SUPABASE_URL?.trim();
    const key = process.env.SUPABASE_PUBLISHABLE_KEY?.trim() || (!preview && process.env.SUPABASE_ANON_KEY?.trim());
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    if (!/^https:\/\/[a-z0-9]+\.supabase\.co$/.test(url || '')) {
      return res.status(503).json({success:false, code:'BROWSER_DATABASE_URL_INVALID'});
    }
    if (!isPublicSupabaseKey(key)) {
      return res.status(503).json({success:false, code:'BROWSER_DATABASE_KEY_INVALID'});
    }
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    return res.status(200).send('window.radarSupabaseConfig = ' + JSON.stringify({url, key, preview}) + ';');
  }
  if (req.method === 'GET') return res.status(200).json({success:true, plans:PLANS_CONFIG});
  if (req.method !== 'POST') return res.status(405).json({success:false, code:'METHOD_NOT_ALLOWED'});
  try {
    const user = await billing.authenticate(req);
    let body;
    try { body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body; }
    catch (_) { throw new billing.BillingError(400, 'INVALID_JSON'); }
    if (!body || typeof body !== 'object') throw new billing.BillingError(400, 'INVALID_BODY');
    if (Object.hasOwn(body, 'creditCard') || Object.hasOwn(body, 'creditCardHolderInfo') || Object.hasOwn(body, 'creditCardToken')) {
      throw new billing.BillingError(400, 'HOSTED_CARD_ONLY');
    }
    const target = body.plan;
    if (!Object.hasOwn(pricing.PLAN_PRICES_CENTS, target)) throw new billing.BillingError(400, 'INVALID_PLAN');
    const paymentMethod = body.billingType || 'PIX';
    if (!['PIX', 'CREDIT_CARD', 'BOLETO'].includes(paymentMethod)) {
      throw new billing.BillingError(400, 'INVALID_PAYMENT_METHOD');
    }
    const count = paymentMethod === 'CREDIT_CARD' ? Number(body.installmentCount || 12) : 1;
    const now = new Date();
    const current = await billing.subscription(user.id);
    const active = current && current.status === 'active' && Date.parse(current.period_end) > now.getTime();
    if (current && !active) throw new billing.BillingError(409, 'SUBSCRIPTION_REQUIRES_RECONCILIATION');
    const paywall = body.action === 'paywallQuote';
    const quoting = paywall || body.action === 'quote';
    if (quoting && !checkRateLimit('quote:' + user.id, 40, 60000)) {
      throw new billing.BillingError(429, 'TOO_MANY_REQUESTS');
    }
    let quote;
    if (active) {
      if (pricing.PLAN_PRICES_CENTS[target] <= pricing.PLAN_PRICES_CENTS[current.plan_type]) {
        throw new billing.BillingError(409, 'UPGRADE_REQUIRED');
      }
      const orders = current.source_order_id ? await billing.db(
        'billing_orders?id=eq.' + encodeURIComponent(current.source_order_id) +
        '&user_id=eq.' + encodeURIComponent(user.id) + '&status=eq.paid&select=kind,amount_cents,target_plan,quote'
      ) : [];
      const previous = orders?.[0];
      const previousAmount = previous?.kind === 'purchase' ? previous.amount_cents :
        previous?.quote?.termPolicy === 'annual_upgrade_v1' ? previous.quote.annualPriceCents : null;
      if (previous?.target_plan !== current.plan_type ||
          !Number.isSafeInteger(previousAmount) || previousAmount <= 0) {
        throw new billing.BillingError(409, 'UPGRADE_REQUIRES_REVIEW');
      }
      const annual = pricing.quotePurchase({ plan: target, paymentMethod, installments: count });
      const credit = pricing.quoteAnnualUpgradeCredit({
        previousAmountCents: previousAmount,
        periodStart: current.period_start, periodEnd: current.period_end, now: now.toISOString()
      });
      const amount = Math.max(0, annual.amountCents - credit);
      let unavailableReason = current.installments_paid !== current.installment_count ? 'INSTALLMENTS_PENDING' :
        amount <= 0 ? 'ZERO_BALANCE' : null;
      if (!unavailableReason) {
        try {
          const readiness = paymentMethod === 'PIX' ? 'billing_annual_upgrade_ready' : 'billing_annual_upgrade_methods_ready';
          if (await billing.db('rpc/' + readiness) !== true) unavailableReason = 'UPGRADE_UNAVAILABLE';
        } catch (_) { unavailableReason = 'UPGRADE_UNAVAILABLE'; }
      }
      const payable = !unavailableReason;
      quote = {
        kind:'upgrade', termPolicy:'annual_upgrade_v1', annualPriceCents:annual.amountCents,
        creditCents:credit, amountCents:amount,
        installments:amount > 0 ? pricing.splitInstallments(amount, count) : [0], payable, unavailableReason,
        periodStart:current.period_start, periodEnd:current.period_end
      };
      if (!paywall && !payable) {
        return res.status(409).json({ success:false, code:'UPGRADE_REQUIRES_REVIEW',
          message:'O upgrade precisa de conciliação antes do pagamento. Nenhuma cobrança foi gerada.' });
      }
    } else {
      try {
        quote = pricing.quotePurchase({plan:target, paymentMethod:paywall ? 'PIX' : paymentMethod, installments:paywall ? 1 : count});
      } catch (error) { throw new billing.BillingError(409, error.message); }
      if (!paywall && paymentMethod === 'BOLETO' &&
          await billing.db('rpc/billing_annual_upgrade_methods_ready') !== true) {
        throw new billing.BillingError(503, 'BILLING_UNAVAILABLE');
      }
      const end = new Date(now); end.setUTCFullYear(end.getUTCFullYear()+1);
      quote = {...quote, kind:'purchase', periodStart:now.toISOString(), periodEnd:end.toISOString()};
    }
    const plan = {...PLANS_CONFIG[target], value:quote.amountCents/100,
      installmentCount:quote.installments.length, installmentValue:quote.installments[0]/100};
    if (quoting) {
      return res.status(200).json({success:true, quote, plan, sandbox:ASAAS_ENVIRONMENT === 'sandbox'});
    }
    if ((active || body.expectedAmountCents !== undefined) && body.expectedAmountCents !== quote.amountCents) {
      throw new billing.BillingError(409, 'PRICE_CHANGED');
    }
    if (!checkRateLimit('pay:' + user.id, 8, 60000)) throw new billing.BillingError(429, 'TOO_MANY_REQUESTS');
    if (quote.amountCents <= 0) throw new billing.BillingError(409, 'ZERO_AMOUNT_REQUIRES_RECONCILIATION');
    if (!apiKey) throw new billing.BillingError(503, 'ASAAS_NOT_CONFIGURED');
    const document = validateCpfCnpj(body.cpfCnpj);
    if (!document.valid) throw new billing.BillingError(400, 'INVALID_DOCUMENT');
    const name = String(body.name || '').replace(/<[^>]*>/g, '').replace(/[<>]/g, '').trim().slice(0,120);
    if (name.length < 3) throw new billing.BillingError(400, 'INVALID_NAME');
    const cleanPhone = String(body.phone || '').replace(/\D/g, '');
    async function asaas(path, payload, methodOverride) {
      const m = methodOverride || (payload ? 'POST' : 'GET');
      const response = await fetch(ASAAS_API_URL+path,{method:m,
        headers:{access_token:apiKey,'Content-Type':'application/json','User-Agent':'RadarSaoJose/1.0'},
        ...(payload ? {body:JSON.stringify(payload)} : {}),
        redirect:'error', signal:AbortSignal.timeout(m === 'POST' && path === '/payments' && paymentMethod === 'CREDIT_CARD' ? 60000 : 10000)});
      if (!response.ok) throw new billing.BillingError(502, 'ASAAS_REQUEST_FAILED');
      return response.json();
    }
    const existing = await billing.db('billing_orders?user_id=eq.'+encodeURIComponent(user.id)+'&status=eq.pending&select=id,asaas_payment_id,installment_count,expires_at');
    if (existing?.length) {
      for (const pendingOrd of existing) {
        const expMs = pendingOrd.expires_at ? Date.parse(pendingOrd.expires_at) : NaN;
        if (!Number.isFinite(expMs) || expMs > now.getTime()) {
          throw new billing.BillingError(409, 'ORDER_PENDING_RECONCILIATION');
        }
        // Pending order past expires_at: never unlock by clock alone; verify with Asaas and guard against mid-flight state changes.
        try {
          if (pendingOrd.asaas_payment_id) {
            if (pendingOrd.installment_count > 1) throw new billing.BillingError(409, 'ORDER_PENDING_RECONCILIATION');
            const payId = pendingOrd.asaas_payment_id;
            const gatewayEvents = await billing.db('billing_gateway_events?payment_id=eq.' + encodeURIComponent(payId) + '&select=event_id,event_type,status');
            if (Array.isArray(gatewayEvents) && gatewayEvents.some(ev => ['PAYMENT_RECEIVED', 'PAYMENT_CONFIRMED'].includes(ev.event_type))) {
              throw new billing.BillingError(409, 'ORDER_PENDING_RECONCILIATION');
            }
            const live = await asaas('/payments/' + encodeURIComponent(payId));
            const paidStates = ['RECEIVED', 'CONFIRMED', 'RECEIVED_IN_CASH', 'DUNNING_RECEIVED'];
            if (live?.id !== payId || paidStates.includes(live.status)) {
              throw new billing.BillingError(409, 'ORDER_PENDING_RECONCILIATION');
            }
            if (live.status === 'PENDING' && !live.deleted) {
              const delRes = await asaas('/payments/' + encodeURIComponent(payId), null, 'DELETE');
              if (delRes?.deleted !== true) {
                throw new billing.BillingError(409, 'ORDER_PENDING_RECONCILIATION');
              }
              const recheck = await asaas('/payments/' + encodeURIComponent(payId));
              if (recheck?.id !== payId || paidStates.includes(recheck?.status) || recheck?.deleted !== true) {
                throw new billing.BillingError(409, 'ORDER_PENDING_RECONCILIATION');
              }
            } else if (live.deleted !== true) {
              // Overdue/refund status alone does not establish that the old charge
              // is safely closed. Keep the order pending for reconciliation;
              // do not silently replace it or decide a refund policy here.
              throw new billing.BillingError(409, 'ORDER_PENDING_RECONCILIATION');
            }
            const canceledRows = await billing.db(
              'billing_orders?id=eq.' + encodeURIComponent(pendingOrd.id) + '&status=eq.pending&asaas_payment_id=eq.' + encodeURIComponent(payId),
              {
                method: 'PATCH',
                headers: { Prefer: 'return=representation' },
                body: JSON.stringify({ status: 'canceled' })
              }
            );
            if (!Array.isArray(canceledRows) || canceledRows.length !== 1) {
              throw new billing.BillingError(409, 'ORDER_PENDING_RECONCILIATION');
            }
          } else {
            const found = await asaas('/payments?externalReference=' + encodeURIComponent(pendingOrd.id));
            const items = Array.isArray(found?.data) ? found.data : null;
            if (!items || found.hasMore) throw new billing.BillingError(409, 'ORDER_PENDING_RECONCILIATION');
            if (items.length > 0) {
              const first = items[0];
              if (items.length === 1 && first?.id && pendingOrd.installment_count <= 1) {
                await billing.db('billing_orders?id=eq.' + encodeURIComponent(pendingOrd.id) + '&status=eq.pending', {
                  method: 'PATCH',
                  body: JSON.stringify({ asaas_payment_id: first.id })
                });
              }
              throw new billing.BillingError(409, 'ORDER_PENDING_RECONCILIATION');
            }
            const canceledRows = await billing.db(
              'billing_orders?id=eq.' + encodeURIComponent(pendingOrd.id) + '&status=eq.pending&asaas_payment_id=is.null',
              {
                method: 'PATCH',
                headers: { Prefer: 'return=representation' },
                body: JSON.stringify({ status: 'canceled' })
              }
            );
            if (!Array.isArray(canceledRows) || canceledRows.length !== 1) {
              throw new billing.BillingError(409, 'ORDER_PENDING_RECONCILIATION');
            }
          }
        } catch (_) {
          throw new billing.BillingError(409, 'ORDER_PENDING_RECONCILIATION');
        }
      }
    }
    const dueDate = new Date(now.getTime() + (paymentMethod === 'BOLETO' ? 2 * 86400000 : 0));
    const orders = await billing.db('billing_orders', {method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify({
      user_id:user.id, subscription_id:active ? current.id : null, target_plan:target, kind:quote.kind,
      amount_cents:quote.amountCents, credit_cents:quote.creditCents || 0, expected_version:active ? current.version : null,
      period_start:quote.periodStart, period_end:quote.periodEnd, payment_method:paymentMethod,
      ...(paymentMethod === 'BOLETO' ? {expires_at:new Date(dueDate.getTime() + 2 * 86400000).toISOString()} : {}),
      installment_count:quote.installments.length, quote:{...quote, customerEmail:user.email, customerName:name}})});
    const order = orders?.[0];
    if (!order?.id) throw new billing.BillingError(503, 'ORDER_NOT_PERSISTED');
    const customer = await asaas('/customers',{name,email:user.email,cpfCnpj:document.clean,
      mobilePhone:cleanPhone,notificationDisabled:ASAAS_ENVIRONMENT === 'sandbox'});
    if (!customer.id) throw new billing.BillingError(502, 'ASAAS_CUSTOMER_MISSING');
    const payload = {customer:customer.id,billingType:paymentMethod,dueDate:dueDate.toISOString().slice(0,10),
      description:plan.description,externalReference:order.id};
    if (paymentMethod === 'CREDIT_CARD' && quote.installments.length > 1) {
      payload.totalValue = quote.amountCents/100;
      payload.installmentCount = quote.installments.length;
    } else payload.value = quote.amountCents/100;
    const payment = await asaas('/payments',payload);
    if (!payment.id) throw new billing.BillingError(502, 'ASAAS_PAYMENT_MISSING');
    const binding = { asaas_payment_id: payment.id };
    if (quote.installments.length > 1) {
      if (!payment.installment) throw new billing.BillingError(409, 'ORDER_PENDING_RECONCILIATION');
      const schedule = await asaas('/installments/' + encodeURIComponent(payment.installment) + '/payments?limit=' + quote.installments.length);
      if (!Array.isArray(schedule.data) || schedule.hasMore || schedule.data.length !== quote.installments.length) {
        throw new billing.BillingError(409, 'ORDER_PENDING_RECONCILIATION');
      }
      const paymentIds = new Set();
      const numbers = new Set();
      const gatewayPayments = Object.create(null);
      let total = 0;
      for (const entry of schedule.data) {
        const number = entry.installmentNumber;
        const amount = Math.round(Number(entry.value) * 100);
        if (typeof entry.id !== 'string' || !entry.id || paymentIds.has(entry.id) ||
            !Number.isInteger(number) || number < 1 || number > quote.installments.length || numbers.has(number) ||
            entry.externalReference !== order.id || entry.installment !== payment.installment ||
            entry.billingType !== paymentMethod || !Number.isSafeInteger(amount) || amount <= 0 ||
            Math.abs(amount - quote.installments[number - 1]) > 1) {
          throw new billing.BillingError(409, 'ORDER_PENDING_RECONCILIATION');
        }
        paymentIds.add(entry.id);
        numbers.add(number);
        gatewayPayments[entry.id] = amount;
        total += amount;
      }
      if (total !== quote.amountCents || !paymentIds.has(payment.id)) {
        throw new billing.BillingError(409, 'ORDER_PENDING_RECONCILIATION');
      }
      binding.quote = { ...order.quote, ...quote, customerEmail:user.email, customerName:name, gatewayPayments };
    }
    await billing.db('billing_orders?id=eq.'+encodeURIComponent(order.id), {method:'PATCH',body:JSON.stringify(binding)});
    // CRM sync is non-blocking after the order and Asaas payment are bound, preventing 503 after card authorization.
    try {
      const people = await billing.db('crm_pessoas?email=eq.'+encodeURIComponent(user.email)+'&select=id');
      let personId = people?.[0]?.id;
      if (!personId) {
        const created = await billing.db('crm_pessoas',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify({nome:name,email:user.email,auth_user_id:user.id,origem:'Checkout Asaas'})});
        personId = created?.[0]?.id;
      }
      if (personId) {
        await billing.db('crm_vendas',{method:'POST',body:JSON.stringify({pessoa_id:personId,
          produto_servico:plan.description,valor_proposto:quote.amountCents/100,valor_fechado:quote.amountCents/100,
          forma_pagamento:'Asaas '+paymentMethod,asaas_payment_id:payment.id,asaas_customer_id:customer.id,status_pagamento:'Pendente'})});
      }
    } catch (crmErr) {
      console.warn('[Asaas Checkout] Aviso não-bloqueante ao registrar CRM:', crmErr?.code || crmErr?.message);
    }
    let pix = null;
    if (paymentMethod === 'PIX') {
      try {
        const qr = await asaas('/payments/'+encodeURIComponent(payment.id)+'/pixQrCode');
        if (qr.encodedImage && qr.payload) {
          pix = {qrCodeImage:'data:image/png;base64,'+qr.encodedImage,copyPasteKey:qr.payload,expirationDate:qr.expirationDate};
        }
      } catch (_) {
        // O pedido já está vinculado a uma cobrança. O checkout oferece a fatura
        // do Asaas quando a geração do QR não está disponível.
      }
    }
    return res.status(200).json({success:true,environment:ASAAS_ENVIRONMENT,sandbox:ASAAS_ENVIRONMENT==='sandbox',
      orderId:order.id,quote,plan,
      customer:{id:customer.id,name,email:user.email,cpfCnpj:document.clean},
      payment:{id:payment.id,status:payment.status,value:quote.amountCents/100,
      billingType:paymentMethod,installmentCount:quote.installments.length,installmentValue:quote.installments[0]/100,
      invoiceUrl:payment.invoiceUrl,pix}});
  } catch (error) { return billing.fail(res,error); }
};

module.exports.PLANS_CONFIG = PLANS_CONFIG;
module.exports.UPGRADE_CONFIGS = UPGRADE_CONFIGS;
module.exports.resolvePlan = resolvePlan;
module.exports.validateCpfCnpj = validateCpfCnpj;
module.exports.luhnCheck = luhnCheck;
module.exports.resolveClientIp = resolveClientIp;

