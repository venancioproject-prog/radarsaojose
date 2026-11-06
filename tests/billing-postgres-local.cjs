'use strict';

// Banco PostgreSQL descartável em memória. Auth é uma fixture; não usa Supabase/Asaas remotos.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const { PGlite } = require(path.join(process.env.LOCALAPPDATA, 'RadarSaoJose', 'tools', 'pglite-0.5.15', 'node_modules', '@electric-sql', 'pglite'));
const migration = file => fs.readFileSync(path.join(__dirname, '..', 'data', 'migrations', file), 'utf8');
const owner = '00000000-0000-4000-8000-000000000001';
const other = '00000000-0000-4000-8000-000000000002';

async function checkSandbox(db, evidence) {
  const base = 'https://api-sandbox.asaas.com/v3';
  const key = process.env.ASAAS_SANDBOX_API_KEY;
  assert.ok(key, 'Chave Sandbox necessária');
  const token = crypto.randomBytes(32).toString('hex');
  const user = { id: other, email: 'radar-test@example.invalid' };
  const responses = [];
  let installmentGroup;
  const sandboxFetch = async (url, options) => {
    assert.ok(url.startsWith(base + '/'), 'Somente a API Sandbox é permitida');
    const response = await fetch(url, {
      ...options, redirect: 'error', headers: { ...options.headers, 'User-Agent': 'RadarSaoJose-Test/1.0' }
    });
    const body = await response.json();
    const resource = new URL(url).pathname.replace(/\/pay_[^/]+/g, '/:id');
    responses.push({ method: options.method, resource, http: response.status,
      errors: Array.isArray(body.errors) ? body.errors.map(error => ({ code: error.code,
        description: String(error.description || '').replace(/\d{5,}|\$aact_\S+/g, '[redacted]') })) : undefined });
    if (resource === '/v3/payments' && options.method === 'POST') installmentGroup = body.installment;
    return { ok: response.ok, json: async () => body };
  };
  const billing = {
    ...require('../lib/billing-store'),
    authenticate: async () => user,
    subscription: async () => null,
    async db(route, options = {}) {
      const url = new URL(route, 'https://fixture.invalid/');
      const data = options.body && JSON.parse(options.body);
      const eq = field => url.searchParams.get(field)?.slice(3);
      switch (url.pathname) {
        case '/billing_orders':
          if (options.method === 'POST') {
            const columns = ['user_id','subscription_id','target_plan','kind','amount_cents','credit_cents','expected_version','period_start','period_end','payment_method','installment_count','quote'];
            return (await db.query(`INSERT INTO public.billing_orders (${columns.join(',')}) VALUES (${columns.map((_, i) => '$' + (i + 1)).join(',')}) RETURNING *`,
              columns.map(column => data[column] ?? null))).rows;
          }
          if (options.method === 'PATCH') {
            await db.query('UPDATE public.billing_orders SET asaas_payment_id=$1,quote=COALESCE($2::jsonb,quote) WHERE id=$3',
              [data.asaas_payment_id, data.quote ? JSON.stringify(data.quote) : null, eq('id')]);
            return [];
          }
          if (eq('asaas_payment_id')) return (await db.query('SELECT * FROM public.billing_orders WHERE asaas_payment_id=$1', [eq('asaas_payment_id')])).rows;
          if (eq('id')) return (await db.query('SELECT * FROM public.billing_orders WHERE id=$1', [eq('id')])).rows;
          return (await db.query("SELECT * FROM public.billing_orders WHERE user_id=$1 AND status='pending'", [user.id])).rows;
        case '/billing_gateway_events':
          if (options.method === 'POST') {
            await db.query(`INSERT INTO public.billing_gateway_events(event_id,payment_id,event_type,occurred_at,payload)
              VALUES ($1,$2,$3,$4,$5) ON CONFLICT DO NOTHING`, [data.event_id,data.payment_id,data.event_type,data.occurred_at,data.payload]);
            return [];
          }
          return (await db.query('SELECT * FROM public.billing_gateway_events WHERE event_id=$1', [eq('event_id')])).rows;
        case '/rpc/billing_process_event':
          await db.exec(`SELECT set_config('request.jwt.claims','{"role":"service_role"}',false); SET ROLE service_role;`);
          try { return (await db.query('SELECT public.billing_process_event($1) AS result', [data.p_event_id])).rows[0].result; }
          finally { await db.exec('RESET ROLE'); }
        case '/crm_pessoas':
        case '/crm_vendas': return [];
        default: throw new Error('Rota local não esperada: ' + url.pathname);
      }
    }
  };
  function loadHandler(name) {
    const module = { exports: {} };
    vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'api', name), 'utf8'), {
      module, Buffer, AbortSignal, console, fetch: sandboxFetch, __dirname,
      process: { cwd: () => __dirname, env: { ASAAS_ENVIRONMENT: 'sandbox', ASAAS_SANDBOX_API_KEY: key, ASAAS_WEBHOOK_SECRET: token } },
      require(id) {
        if (id === 'fs' || id === 'node:fs') return { existsSync: () => false };
        if (id === '../lib/billing-store') return billing;
        if (id === '../lib/billing-email') return { sendConfirmationEmail: async () => ({ status: 'local_test' }) };
        return require(id);
      }
    }, { filename: name });
    return module.exports;
  }
  async function request(handler, body, headers = {}) {
    const res = { code: 200, setHeader() {}, status(code) { this.code = code; return this; }, json(data) { this.body = data; } };
    await handler({ method: 'POST', body, headers, socket: { remoteAddress: '127.0.0.1' } }, res);
    return res;
  }
  const checkout = loadHandler('asaas-checkout.js');
  const webhook = loadHandler('asaas-webhook.js');
  const method = process.argv.includes('--card') ? 'CREDIT_CARD' : 'PIX';
  evidence.sandbox = { method, requests: responses, webhookDelivery: 'evento injetado localmente, com consulta autenticada ao Asaas' };
  const purchase = await request(checkout, {
    plan: 'dash', billingType: method, name: 'Teste Radar Sao Jose', cpfCnpj: '52998224725',
    ...(method === 'CREDIT_CARD' ? {phone:'11900000000'} : {}),
    ...(method === 'CREDIT_CARD' ? { installmentCount: 2, creditCard: {
      holderName: 'TESTE RADAR', number: '4111111111111111', ccv: '123', expiryMonth: '12', expiryYear: '2031'
    }, creditCardHolderInfo: { postalCode: '01001000', addressNumber: '10' } } : {})
  });
  evidence.sandbox.checkoutHttp = purchase.code;
  if (purchase.code !== 200) { evidence.pending.push({ sandboxCheckout: purchase.body?.code }); return; }
  const order = purchase.body;
  const paymentId = order.payment.id;
  if (method === 'PIX') {
    evidence.sandbox.pixQrAvailable = Boolean(order.payment.pix?.copyPasteKey);
    evidence.sandbox.invoiceHost = new URL(order.payment.invoiceUrl).hostname;
    const confirmation = await sandboxFetch(`${base}/sandbox/payment/${encodeURIComponent(paymentId)}/confirm`, {
      method: 'POST', headers: { access_token: key, 'Content-Type': 'application/json' }
    });
    if (!confirmation.ok) { evidence.pending.push({ sandboxConfirmation: 'API recusou a confirmação' }); return; }
  }
  const live = await (await sandboxFetch(`${base}/payments/${encodeURIComponent(paymentId)}`, { method: 'GET', headers: { access_token: key } })).json();
  evidence.sandbox.paymentStatus = live.status;
  if (!['CONFIRMED', 'RECEIVED', 'RECEIVED_IN_CASH'].includes(live.status)) {
    evidence.pending.push({ sandboxConfirmation: live.status }); return;
  }
  const event = { id: 'evt_local_sandbox_' + crypto.randomUUID(), event: live.status === 'CONFIRMED' ? 'PAYMENT_CONFIRMED' : 'PAYMENT_RECEIVED', payment: live };
  const confirmed = await request(webhook, event, { 'asaas-access-token': token });
  assert.equal(confirmed.code, 200, confirmed.body?.code);
  const replay = await request(webhook, event, { 'asaas-access-token': token });
  assert.equal(replay.body?.duplicate, true);
  const state = (await db.query('SELECT status,plan_type,installments_paid FROM public.billing_subscriptions WHERE user_id=$1', [user.id])).rows[0];
  assert.deepEqual(state, { status: 'active', plan_type: 'dash', installments_paid: 1 });
  evidence.checks.push(`Checkout ${method}, verificação do Asaas, ativação e reenvio no PostgreSQL local`);
  if (installmentGroup) {
    const list = await sandboxFetch(`${base}/installments/${encodeURIComponent(installmentGroup)}/payments`, {method:'GET',headers:{access_token:key}});
    const {data = []} = await list.json();
    evidence.sandbox.installments = data.map(item => ({ number: item.installmentNumber, value: item.value, status: item.status, matchingOrder: item.externalReference === order.orderId }));
    for (const installment of data.filter(item => item.id !== paymentId)) {
      const nextEvent = { id: 'evt_local_sandbox_' + crypto.randomUUID(), event: 'PAYMENT_CONFIRMED', payment: installment };
      const next = await request(webhook, nextEvent, { 'asaas-access-token': token });
      assert.equal(next.code, 200, next.body?.code);
      assert.equal((await request(webhook, nextEvent, { 'asaas-access-token': token })).body.duplicate, true);
    }
    const progress = (await db.query('SELECT installments_paid FROM public.billing_subscriptions WHERE user_id=$1', [user.id])).rows[0];
    assert.equal(progress.installments_paid, order.payment.installmentCount);
    evidence.checks.push('Todas as parcelas do Asaas vinculadas e contadas uma vez');
  }
}

async function main() {
  const db = new PGlite();
  const evidence = { engine: 'PGlite / PostgreSQL local', productionTraffic: false, checks: [], pending: [] };
  const value = async (sql, args = []) => (await db.query(sql, args)).rows[0];
  const check = async (name, action) => {
    await action();
    evidence.checks.push(name);
  };
  const event = async (id, type) => {
    await db.query(`INSERT INTO public.billing_gateway_events(event_id,payment_id,event_type,occurred_at,payload)
      VALUES ($1,'pay_fake_local',$2,now(),'{}'::jsonb)`, [id, type]);
    await db.exec(`SELECT set_config('request.jwt.claims','{"role":"service_role"}',false); SET ROLE service_role;`);
    try { return (await value('SELECT public.billing_process_event($1) AS result', [id])).result; }
    finally { await db.exec('RESET ROLE'); }
  };
  try {
    await db.exec(`CREATE ROLE anon NOLOGIN;
      CREATE ROLE authenticated NOLOGIN;
      CREATE ROLE service_role NOLOGIN BYPASSRLS;
      CREATE SCHEMA auth;
      CREATE TABLE auth.users(id uuid PRIMARY KEY, email text, raw_user_meta_data jsonb);
      CREATE FUNCTION auth.jwt() RETURNS jsonb LANGUAGE sql STABLE AS $$
        SELECT COALESCE(NULLIF(current_setting('request.jwt.claims',true),''),'{}')::jsonb $$;
      CREATE FUNCTION auth.role() RETURNS text LANGUAGE sql STABLE AS $$ SELECT auth.jwt()->>'role' $$;
      CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$ SELECT (auth.jwt()->>'sub')::uuid $$;
      GRANT USAGE ON SCHEMA auth TO anon, authenticated, service_role;`);
    await check('010 e 011 aplicadas no PostgreSQL local com Auth fictício', async () => {
      await db.exec(migration('010_admin_authority.sql'));
      await db.exec(migration('011_billing_state.sql'));
      const tables = await value("SELECT count(*)::int AS n FROM pg_tables WHERE schemaname='public' AND tablename LIKE 'billing_%'");
      assert.equal(tables.n, 6);
    });
    await db.query("INSERT INTO auth.users VALUES ($1,'owner@example.invalid','{}'),($2,'other@example.invalid','{}')", [owner, other]);
    await check('Cadastro cria perfil grátis, sem privilégios', async () => {
      const profile = await value('SELECT plan_type,role FROM public.profiles WHERE id=$1', [owner]);
      assert.deepEqual(profile, { plan_type: 'gratis', role: 'usuario' });
    });
    await check('Usuário comum não lê faturamento, não eleva o plano nem executa a função financeira', async () => {
      await db.query("SELECT set_config('request.jwt.claims',$1,false)", [JSON.stringify({ role: 'authenticated', sub: owner })]);
      await db.exec('SET ROLE authenticated');
      try {
        await assert.rejects(db.query('SELECT id FROM public.billing_orders'), { code: '42501' });
        await assert.rejects(db.query("UPDATE public.profiles SET plan_type='midia' WHERE id=$1", [owner]), { code: '42501' });
        await assert.rejects(db.query("SELECT public.billing_process_event('fake')"), { code: '42501' });
        assert.equal((await db.query('SELECT id FROM public.profiles WHERE id=$1', [other])).rows.length, 0);
      } finally { await db.exec('RESET ROLE'); }
    });
    await db.query(`INSERT INTO public.billing_orders(user_id,target_plan,kind,amount_cents,period_start,period_end,payment_method,installment_count,asaas_payment_id)
      VALUES ($1,'dash','purchase',100,now() - interval '1 minute',now() + interval '1 year','PIX',1,'pay_fake_local')`, [owner]);
    await check('Confirmação fictícia ativa o plano e marca o pedido como pago', async () => {
      assert.equal((await event('evt_local_paid', 'PAYMENT_RECEIVED')).success, true);
      assert.deepEqual(await value(`SELECT o.status AS order_status,s.status AS subscription_status,p.plan_type
        FROM public.billing_orders o JOIN public.billing_subscriptions s ON s.id=o.subscription_id
        JOIN public.profiles p ON p.id=o.user_id WHERE o.user_id=$1`, [owner]),
      { order_status: 'paid', subscription_status: 'active', plan_type: 'dash' });
    });
    await check('Outra confirmação da mesma cobrança não conta um segundo pagamento', async () => {
      assert.equal((await event('evt_local_repeat', 'PAYMENT_CONFIRMED')).ignored, true);
      assert.equal((await value('SELECT installments_paid FROM public.billing_subscriptions WHERE user_id=$1', [owner])).installments_paid, 1);
    });
    await check('Pagamento em atraso restaura acesso vigente sem mudar parcelas ou vencimento', async () => {
      const sql = 'SELECT status,period_end,installments_paid FROM public.billing_subscriptions WHERE user_id=$1';
      const original = await value(sql, [owner]);
      await event('evt_local_late', 'PAYMENT_OVERDUE');
      assert.equal((await value(sql, [owner])).status, 'past_due');
      assert.equal((await event('evt_local_recovered', 'PAYMENT_RECEIVED')).recovered, true);
      assert.deepEqual(await value(sql, [owner]), original);
      assert.equal((await event('evt_local_recovered_again', 'PAYMENT_CONFIRMED')).ignored, true);
    });
    await check('Estorno fictício cancela acesso e volta o perfil a grátis', async () => {
      await event('evt_local_refund', 'PAYMENT_REFUNDED');
      assert.deepEqual(await value(`SELECT s.status,p.plan_type FROM public.billing_subscriptions s
        JOIN public.profiles p ON p.id=s.user_id WHERE s.user_id=$1`, [owner]), { status: 'canceled', plan_type: 'gratis' });
    });
    await check('Upgrade Pix abre 12 meses, reenvios preservam a vigência e estorno restaura o plano anterior', async () => {
      await db.exec(migration('015_billing_annual_upgrade.sql'));
      const user = '00000000-0000-4000-8000-000000000015';
      await db.query("INSERT INTO auth.users VALUES ($1,'annual@example.invalid','{}')", [user]);
      await db.query(`INSERT INTO public.billing_orders(user_id,target_plan,kind,amount_cents,period_start,period_end,payment_method,installment_count,asaas_payment_id)
        VALUES ($1,'dash','purchase',291492,now() - interval '6 months',now() + interval '6 months','PIX',1,'pay_annual_original')`, [user]);
      const processEvent = async (id, payment, type) => {
        await db.query(`INSERT INTO public.billing_gateway_events(event_id,payment_id,event_type,occurred_at,payload)
          VALUES ($1,$2,$3,now(),'{}') ON CONFLICT DO NOTHING`, [id, payment, type]);
        await db.exec(`SELECT set_config('request.jwt.claims','{"role":"service_role"}',false); SET ROLE service_role;`);
        try {
          assert.equal((await value('SELECT public.billing_annual_upgrade_ready() AS ready')).ready, true);
          return (await value('SELECT public.billing_process_event($1) AS result', [id])).result;
        } finally { await db.exec('RESET ROLE'); }
      };
      const current = () => value('SELECT * FROM public.billing_subscriptions WHERE user_id=$1', [user]);
      await processEvent('annual_original', 'pay_annual_original', 'PAYMENT_CONFIRMED');
      const before = await current();
      await db.query(`INSERT INTO public.billing_orders(user_id,subscription_id,target_plan,kind,amount_cents,expected_version,
        period_start,period_end,payment_method,installment_count,asaas_payment_id,quote)
        VALUES ($1,$2,'report','upgrade',383346,$3,$4,$5,'PIX',1,'pay_annual_upgrade','{"termPolicy":"annual_upgrade_v1"}')`,
      [user,before.id,before.version,before.period_start,before.period_end]);
      await processEvent('annual_upgrade', 'pay_annual_upgrade', 'PAYMENT_CONFIRMED');
      const after = await current();
      assert.equal(after.plan_type, 'report');
      assert.ok(after.period_end > before.period_end);
      assert.equal((await value(`SELECT period_end = ((period_start AT TIME ZONE 'UTC') + interval '12 months') AT TIME ZONE 'UTC'
        AS exact FROM public.billing_subscriptions WHERE id=$1`, [after.id])).exact, true);
      const order = await value('SELECT period_start,period_end FROM public.billing_orders WHERE id=$1', [after.source_order_id]);
      assert.deepEqual(order, { period_start:after.period_start, period_end:after.period_end });
      assert.equal((await processEvent('annual_upgrade', 'pay_annual_upgrade', 'PAYMENT_CONFIRMED')).duplicate, true);
      await processEvent('annual_upgrade_received', 'pay_annual_upgrade', 'PAYMENT_RECEIVED');
      assert.deepEqual(await current(), after);
      await processEvent('annual_refund', 'pay_annual_upgrade', 'PAYMENT_REFUNDED');
      const restored = await current();
      for (const field of ['plan_type','status','period_start','period_end','payment_method','installment_count','installments_paid','source_order_id']) {
        assert.deepEqual(restored[field], before[field]);
      }
    });
    if (process.argv.includes('--sandbox')) await checkSandbox(db, evidence);
    console.log(JSON.stringify(evidence, null, 2));
    if (evidence.pending.length) process.exitCode = 1;
  } finally { await db.close(); }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
