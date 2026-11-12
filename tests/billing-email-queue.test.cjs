'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createRequire } = require('node:module');

function pglite() {
  const roots = [process.env.LOCALAPPDATA,
    path.join(process.env.USERPROFILE || '', 'AppData/Local/Packages/OpenAI.Codex_2p2nqsd0c76g0/LocalCache/Local')];
  for (const root of roots.filter(Boolean)) {
    const target = path.join(root, 'RadarSaoJose/tools/pglite-0.5.15/node_modules/@electric-sql/pglite');
    if (fs.existsSync(target)) return require(target).PGlite;
  }
  throw new Error('PGlite is required');
}

test('Outbox is atomic with payment, private, disabled initially and uses bounded recoverable leases', async () => {
  const PGlite = pglite();
  const db = new PGlite();
  const migration = name => fs.readFileSync(path.join(__dirname, '../data/migrations', name), 'utf8');
  const value = async (sql, args = []) => (await db.query(sql, args)).rows[0];
  const user = '00000000-0000-4000-8000-000000000001';
  const order = async (status = 'paid', payment = null) => (await value(`INSERT INTO public.billing_orders
    (user_id,target_plan,kind,amount_cents,period_start,period_end,payment_method,installment_count,status,asaas_payment_id)
    VALUES ($1,'dash','purchase',100,now()-interval '1 minute',now()+interval '1 year','PIX',1,$2,$3) RETURNING id`, [user,status,payment])).id;
  const service = async (sql, args = []) => {
    await db.exec(`SELECT set_config('request.jwt.claims','{"role":"service_role"}',false); SET ROLE service_role;`);
    try { return await value(sql, args); } finally { await db.exec('RESET ROLE'); }
  };
  const claim = async () => (await service('SELECT public.billing_claim_confirmation_email() AS job')).job;
  const finish = async (job, outcome) => (await service('SELECT public.billing_finish_confirmation_email($1,$2,$3) AS saved',
    [job.order_id,job.lease_token,outcome])).saved;
  try {
    await db.exec(`CREATE ROLE anon NOLOGIN; CREATE ROLE authenticated NOLOGIN; CREATE ROLE service_role NOLOGIN BYPASSRLS;
      CREATE SCHEMA auth; CREATE TABLE auth.users(id uuid PRIMARY KEY,email text,raw_user_meta_data jsonb);
      CREATE FUNCTION auth.jwt() RETURNS jsonb LANGUAGE sql STABLE AS $$ SELECT coalesce(nullif(current_setting('request.jwt.claims',true),''),'{}')::jsonb $$;
      CREATE FUNCTION auth.role() RETURNS text LANGUAGE sql STABLE AS $$ SELECT auth.jwt()->>'role' $$;
      CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$ SELECT (auth.jwt()->>'sub')::uuid $$;
      GRANT USAGE ON SCHEMA auth TO anon,authenticated,service_role;`);
    await db.exec(migration('010_admin_authority.sql'));
    await db.exec(migration('011_billing_state.sql'));
    await db.query("INSERT INTO auth.users VALUES ($1,'fixture@example.invalid','{}')", [user]);
    await order(); // Historical paid purchase must not be emailed retroactively.
    await db.exec(migration('023_billing_email_outbox.sql'));
    await db.exec(migration('023_billing_email_outbox.sql'));
    assert.equal((await value('SELECT enabled FROM public.billing_email_queue_settings')).enabled, false);
    await order();
    assert.equal((await value('SELECT count(*)::int AS n FROM public.billing_email_outbox')).n, 0);
    for (const role of ['anon','authenticated']) {
      await db.exec('SET ROLE ' + role);
      try {
        await assert.rejects(db.query('SELECT * FROM public.billing_email_outbox'), { code: '42501' });
        await assert.rejects(db.query('UPDATE public.billing_email_queue_settings SET enabled=true'), { code: '42501' });
        await assert.rejects(db.query('SELECT public.billing_claim_confirmation_email()'), { code: '42501' });
      } finally { await db.exec('RESET ROLE'); }
    }
    await db.exec('UPDATE public.billing_email_queue_settings SET enabled=true');
    await db.exec('BEGIN');
    const rolledBack = await order();
    assert.equal((await value('SELECT count(*)::int AS n FROM public.billing_email_outbox')).n, 1);
    await db.exec('ROLLBACK');
    assert.equal((await value('SELECT count(*)::int AS n FROM public.billing_email_outbox')).n, 0);
    assert.equal((await value('SELECT count(*)::int AS n FROM public.billing_orders WHERE id=$1',[rolledBack])).n, 0);
    const paid = await order('pending','pay_queue_fixture');
    await db.exec("INSERT INTO public.billing_gateway_events VALUES ('queue_event','pay_queue_fixture','PAYMENT_RECEIVED',now(),'{}','pending',now(),NULL)");
    assert.equal((await service("SELECT public.billing_process_event('queue_event') AS r")).r.success, true);
    assert.equal((await value('SELECT order_id FROM public.billing_email_outbox')).order_id, paid);
    await db.query("UPDATE public.billing_orders SET status='paid' WHERE id=$1",[paid]);
    assert.equal((await value('SELECT count(*)::int AS n FROM public.billing_email_outbox')).n, 1);
    const first = await claim();
    assert.equal(first.attempts, 1);
    assert.equal(await claim(), null);
    assert.equal(await finish({ ...first, lease_token: '00000000-0000-4000-8000-000000000099' }, 'sent'), false);
    assert.equal(await finish(first,'retry'), true);
    assert.equal(await claim(), null, 'retry waits for backoff');
    await db.query("UPDATE public.billing_email_outbox SET next_attempt_at=now()-interval '1 second' WHERE order_id=$1",[paid]);
    const second = await claim();
    assert.equal(second.attempts, 2);
    assert.equal(await finish(first,'sent'), false, 'stale reservation cannot complete a newer attempt');
    assert.equal(await finish(second,'sent'), true);
    assert.equal(await claim(), null);
    const uncertain = await order();
    const lostWorker = await claim();
    assert.equal(lostWorker.order_id, uncertain);
    await db.query("UPDATE public.billing_email_outbox SET lease_until=now()-interval '1 second' WHERE order_id=$1",[uncertain]);
    const recovered = await claim();
    assert.notEqual(recovered.lease_token, lostWorker.lease_token);
    assert.equal(await finish(lostWorker,'sent'), false);
    await db.query("UPDATE public.billing_email_outbox SET lease_until=now()-interval '1 second',first_attempt_at=now()-interval '21 hours' WHERE order_id=$1",[uncertain]);
    assert.equal(await claim(), null);
    assert.equal((await value('SELECT state FROM public.billing_email_outbox WHERE order_id=$1',[uncertain])).state,'needs_review');
    const capped = await order();
    for (let attempt=1;attempt<=6;attempt+=1) {
      const job = await claim();
      assert.equal(job.order_id,capped);
      assert.equal(job.attempts,attempt);
      await finish(job,'retry');
      await db.query("UPDATE public.billing_email_outbox SET next_attempt_at=now()-interval '1 second' WHERE order_id=$1",[capped]);
    }
    assert.equal(await claim(),null);
    assert.equal((await value('SELECT state FROM public.billing_email_outbox WHERE order_id=$1',[capped])).state,'needs_review');
    assert.equal((await value('SELECT status FROM public.billing_orders WHERE id=$1',[paid])).status,'paid');
  } finally { await db.close(); }
});

function fixture() {
  const filename = path.join(__dirname,'../lib/billing-email-queue.js');
  const localRequire = createRequire(filename);
  const module = { exports: {} };
  const env = { BILLING_EMAIL_QUEUE_ENABLED: 'true', BILLING_EMAIL_DELIVERY_ENABLED: 'true' };
  const state = { ready:true, enabled:true, claimed:0, sends:0, finishes:[], leaseSaved:true,
    order:{ id:'order',status:'paid',period_end:'2099-01-01',quote:{customerEmail:'fixture@example.invalid'} },
    result:{sent:true,status:'sent',id:'email_fixture'} };
  vm.runInNewContext(fs.readFileSync(filename,'utf8'), { module, process:{env}, require(id) {
    if (id==='./billing-email') return {
      deliveryConfigured:()=>state.ready,
      sendConfirmationEmail:async ({order})=>{ assert.equal(order,state.order); state.sends+=1; return state.result; }
    };
    if (id==='./billing-store') return { db:async (route,options={})=>{
      if(route.startsWith('billing_email_queue_settings?'))return [{enabled:state.enabled}];
      if(route==='rpc/billing_claim_confirmation_email'){state.claimed+=1;return {order_id:'order',lease_token:'lease'};}
      if(route.startsWith('billing_orders?'))return state.order?[state.order]:[];
      if(route==='rpc/billing_finish_confirmation_email'){state.finishes.push(JSON.parse(options.body));return state.leaseSaved;}
      throw new Error('Unexpected storage request');
    } };
    return localRequire(id);
  } });
  return { queue:module.exports,state,env };
}

test('Queue stays inactive without feature switches, provider or database activation', async () => {
  for(const mode of ['flag','provider','database']) {
    const f=fixture();
    if(mode==='flag')f.env.BILLING_EMAIL_DELIVERY_ENABLED='false';
    if(mode==='provider')f.state.ready=false;
    if(mode==='database')f.state.enabled=false;
    await f.queue.processOne();
    assert.equal(f.state.claimed,0);
    assert.equal(f.state.sends,0);
  }
});

test('Queue cancels refunded orders and refuses expired periods without sending', async () => {
  for(const mode of ['canceled','missing','expired']) {
    const f=fixture();
    if(mode==='canceled')f.state.order.status='canceled';
    if(mode==='missing')f.state.order=null;
    if(mode==='expired')f.state.order.period_end='2020-01-01';
    await f.queue.processOne();
    assert.equal(f.state.sends,0);
    assert.equal(f.state.finishes[0].p_outcome,mode==='expired'?'needs_review':'canceled');
  }
});

test('Queue retries temporary failures and keeps permanent errors out of automatic retry', async () => {
  for(const [result,outcome] of [
    [{sent:true,status:'sent',id:'email_fixture'},'sent'],
    [{sent:true,status:'sent',id:''},'needs_review'],
    [{sent:false,status:'network_error',error:'private provider details'},'retry'],
    [{sent:false,status:'provider_error',httpStatus:429},'retry'],
    [{sent:false,status:'provider_error',httpStatus:503},'retry'],
    [{sent:false,status:'provider_error',httpStatus:401},'needs_review'],
    [{sent:false,status:'invalid_request'},'needs_review']
  ]) {
    const f=fixture(); f.state.result=result;
    assert.equal((await f.queue.processOne()).status,outcome);
    assert.equal(f.state.finishes[0].p_outcome,outcome);
    assert.doesNotMatch(JSON.stringify(f.state.finishes),/private provider details|customerEmail/);
  }
  const f=fixture();f.state.leaseSaved=false;
  assert.equal((await f.queue.processOne()).status,'lease_lost');
});
