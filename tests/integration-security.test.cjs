'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

function resolvePglite() {
  const candidates = [
    path.join(process.env.LOCALAPPDATA || '', 'RadarSaoJose', 'tools', 'pglite-0.5.15', 'node_modules', '@electric-sql', 'pglite'),
    path.join(process.env.USERPROFILE || '', 'AppData', 'Local', 'Packages', 'OpenAI.Codex_2p2nqsd0c76g0', 'LocalCache', 'Local', 'RadarSaoJose', 'tools', 'pglite-0.5.15', 'node_modules', '@electric-sql', 'pglite')
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return require(candidate).PGlite;
  }
  throw new Error('PGlite não encontrado no ambiente local');
}

const PGlite = resolvePglite();
const rootDir = path.join(__dirname, '..');
const readMigration = name => fs.readFileSync(path.join(rootDir, 'data', 'migrations', name), 'utf8');

test('Sequência ordenada de migrações 010..021 aplica sem conflito no PostgreSQL local (PGlite) e protege dados pagos e CRM', async () => {
  const db = new PGlite();
  const userFree = '00000000-0000-4000-8000-000000000010';
  const userDash = '00000000-0000-4000-8000-000000000011';
  const userReport = '00000000-0000-4000-8000-000000000012';
  const userMidia = '00000000-0000-4000-8000-000000000013';
  const userAdmin = '00000000-0000-4000-8000-000000000099';

  await db.exec(`
    CREATE ROLE anon NOLOGIN;
    CREATE ROLE authenticated NOLOGIN;
    CREATE ROLE service_role NOLOGIN BYPASSRLS;
    CREATE SCHEMA auth;
    CREATE TABLE auth.users(id uuid PRIMARY KEY, email text, raw_user_meta_data jsonb);
    CREATE TABLE auth.mfa_factors(id uuid DEFAULT gen_random_uuid() PRIMARY KEY, user_id uuid, status text);
    CREATE FUNCTION auth.jwt() RETURNS jsonb LANGUAGE sql STABLE AS $$
      SELECT COALESCE(NULLIF(current_setting('request.jwt.claims', true), ''), '{}')::jsonb
    $$;
    CREATE FUNCTION auth.role() RETURNS text LANGUAGE sql STABLE AS $$ SELECT auth.jwt()->>'role' $$;
    CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$ SELECT (auth.jwt()->>'sub')::uuid $$;
    GRANT USAGE ON SCHEMA auth TO anon, authenticated, service_role;

    CREATE TABLE public.respostas_pesquisa (
      id bigint PRIMARY KEY,
      "Como você se identifica?" text,
      "Qual a sua idade?" text,
      "Região" text
    );
    INSERT INTO public.respostas_pesquisa VALUES (1, 'Mulher', '25 a 34 anos', 'Centro');

    CREATE TABLE public.analise_midia_sjc (
      id bigint PRIMARY KEY,
      perfil text,
      tema_central text,
      likes integer,
      comments integer
    );
    INSERT INTO public.analise_midia_sjc VALUES (101, 'lifeinforma', 'Cultura & Entretenimento', 120, 15);

    CREATE TABLE public.empresas_sjc (
      cnpj text PRIMARY KEY,
      razao_social text,
      status_funil text DEFAULT 'Disponivel_Pool',
      assigned_to text,
      assigned_at timestamptz,
      updated_at timestamptz
    );
    CREATE TABLE public.blog_posts (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      slug text,
      title text,
      status text DEFAULT 'published',
      published_at timestamptz DEFAULT now()
    );
    CREATE TABLE public.affiliate_leads (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      company_name text
    );
    GRANT SELECT ON public.respostas_pesquisa, public.analise_midia_sjc, public.empresas_sjc, public.blog_posts, public.affiliate_leads TO anon, authenticated;
  `);

  const orderedMigrations = [
    '010_admin_authority.sql',
    '011_billing_state.sql',
    '012_security_and_pool_hardening.sql',
    '013_restrict_survey_responses.sql',
    '014_account_mfa.sql',
    '015_billing_annual_upgrade.sql',
    '016_report_private_documents.sql',
    '017_paid_data_rls.sql',
    '018_billing_upgrade_payment_methods.sql',
    '019_billing_installment_progress_version.sql',
    '020_immutable_terms_acceptance.sql'
  ];

  for (const file of orderedMigrations) {
    await db.exec(readMigration(file));
  }

  await db.query(
    `INSERT INTO auth.users VALUES
      ($1, 'free@example.invalid', '{}'),
      ($2, 'dash@example.invalid', '{}'),
      ($3, 'report@example.invalid', '{}'),
      ($4, 'midia@example.invalid', '{}'),
      ($5, 'admin@example.invalid', '{}')`,
    [userFree, userDash, userReport, userMidia, userAdmin]
  );

  for (const [uid, plan] of [[userDash, 'dash'], [userReport, 'report'], [userMidia, 'midia']]) {
    await db.query(
      `INSERT INTO public.billing_subscriptions (
        user_id, plan_type, status, payment_method, installment_count, installments_paid,
        period_start, period_end
      ) VALUES ($1, $2, 'active', 'PIX', 1, 1, now() - interval '1 day', now() + interval '364 days')`,
      [uid, plan]
    );
  }

  async function asRole(role, claims, fn) {
    await db.query(`SELECT set_config('request.jwt.claims', $1, false)`, [JSON.stringify(claims)]);
    await db.exec(`SET ROLE ${role}`);
    try {
      return await fn();
    } finally {
      await db.exec('RESET ROLE');
    }
  }

  // 1. Anon bloqueado em respostas_pesquisa, analise_midia_sjc, report_private_documents e empresas_sjc
  await asRole('anon', { role: 'anon' }, async () => {
    await assert.rejects(db.query('SELECT * FROM public.respostas_pesquisa'), { code: '42501' });
    await assert.rejects(db.query('SELECT * FROM public.analise_midia_sjc'), { code: '42501' });
    await assert.rejects(db.query('SELECT * FROM public.report_private_documents'), { code: '42501' });
    await assert.rejects(db.query('SELECT * FROM public.empresas_sjc'), { code: '42501' });
  });

  // 2. Conta Grátis: bloqueada nas bases pagas (0 linhas em respostas_pesquisa e analise_midia_sjc)
  await asRole('authenticated', { role: 'authenticated', sub: userFree }, async () => {
    assert.equal((await db.query('SELECT * FROM public.respostas_pesquisa')).rows.length, 0);
    assert.equal((await db.query('SELECT * FROM public.analise_midia_sjc')).rows.length, 0);
    await assert.rejects(db.query('SELECT * FROM public.report_private_documents'), { code: '42501' });

    // Pode registrar aceite imutável dos termos para si mesmo, mas não atualizar nem apagar
    await db.query(
      `INSERT INTO public.terms_acceptances (user_id, terms_version, profile_type) VALUES ($1, '2026-11-05', 'empresario')`,
      [userFree]
    );
    assert.equal((await db.query('SELECT terms_version FROM public.terms_acceptances')).rows.length, 1);
    await assert.rejects(
      db.query(`DELETE FROM public.terms_acceptances WHERE user_id = $1`, [userFree]),
      { code: '42501' }
    );
  });

  // 3. Conta Report: lê respostas_pesquisa sob 017, mas NÃO consegue obter dados de analise_midia_sjc nem report_private_documents direto do banco
  await asRole('authenticated', { role: 'authenticated', sub: userReport }, async () => {
    assert.equal((await db.query('SELECT * FROM public.respostas_pesquisa')).rows.length, 1);
    assert.equal((await db.query('SELECT * FROM public.analise_midia_sjc')).rows.length, 0);
    await assert.rejects(db.query('SELECT * FROM public.report_private_documents'), { code: '42501' });
  });

  // 4. Conta Mídia: lê analise_midia_sjc sob 017; após 021, analise_midia_sjc fica restrita ao service_role (/api/media) e admin exige MFA aal2
  await asRole('authenticated', { role: 'authenticated', sub: userMidia }, async () => {
    assert.equal((await db.query('SELECT * FROM public.analise_midia_sjc')).rows.length, 1);
  });

  await db.exec(readMigration('021_private_media_and_admin_mfa.sql'));

  await asRole('authenticated', { role: 'authenticated', sub: userMidia }, async () => {
    await assert.rejects(db.query('SELECT * FROM public.analise_midia_sjc'), { code: '42501' });
  });

  await asRole('authenticated', { role: 'authenticated', sub: userAdmin, aal: 'aal1', app_metadata: { role: 'admin' } }, async () => {
    assert.equal((await db.query('SELECT public.is_admin() AS ok')).rows[0].ok, false);
  });

  await asRole('authenticated', { role: 'authenticated', sub: userAdmin, aal: 'aal2', app_metadata: { role: 'admin' } }, async () => {
    assert.equal((await db.query('SELECT public.is_admin() AS ok')).rows[0].ok, true);
  });
});

test('POST /api/survey-report bloqueia anônimo, Grátis e Dash (403) e libera capítulos e métricas para Report, Mídia e Admin (200)', async () => {
  const sampleRows = require('../lib/survey-data').demoSurveyRows();
  let currentPlan = 'gratis';

  function loadSurveyReportHandler(previewEnv = true) {
    const mod = { exports: {} };
    const surveyData = require('../lib/survey-data');
    vm.runInNewContext(fs.readFileSync(path.join(rootDir, 'api', 'survey-report.js'), 'utf8'), {
      module: mod,
      exports: mod.exports,
      Buffer,
      process: { env: previewEnv ? { VERCEL_ENV: 'preview' } : {} },
      require(id) {
        if (id === '../lib/survey-data') {
          return {
            ...surveyData,
            surveyPlan: async () => currentPlan,
            readSurveyRows: async () => sampleRows
          };
        }
        if (id === '../lib/billing-store') {
          return {
            ...require('../lib/billing-store'),
            db: async () => [{ chapters_html: '<article id="rep-tela-015">Capítulo Real</article>' }]
          };
        }
        if (id === './_report-chapters') return require('../api/_report-chapters');
        if (id === '../report-metrics') return require('../report-metrics');
        return require(id);
      }
    });
    return mod.exports;
  }

  async function callReport(handler, body, method = 'POST') {
    const res = {
      statusCode: 200,
      headers: {},
      setHeader(k, v) { this.headers[k] = v; },
      status(c) { this.statusCode = c; return this; },
      json(payload) { this.body = payload; return this; }
    };
    await handler({ method, body }, res);
    return res;
  }

  const handler = loadSurveyReportHandler(true);

  for (const blockedPlan of ['gratis', 'dash']) {
    currentPlan = blockedPlan;
    const chaptersRes = await callReport(handler, { action: 'chapters' });
    assert.equal(chaptersRes.statusCode, 403);
    assert.equal(chaptersRes.body.code, 'REPORT_REQUIRED');

    const metricsRes = await callReport(handler, { filters: {}, specs: [{ type: 'sample' }] });
    assert.equal(metricsRes.statusCode, 403);
    assert.equal(metricsRes.body.code, 'REPORT_REQUIRED');
  }

  for (const allowedPlan of ['report', 'midia', 'admin']) {
    currentPlan = allowedPlan;
    const chaptersRes = await callReport(handler, { action: 'chapters' });
    assert.equal(chaptersRes.statusCode, 200);
    assert.equal(chaptersRes.body.synthetic, true);
    assert.match(chaptersRes.body.html, /rep-tela-015/);

    const metricsRes = await callReport(handler, {
      filters: {},
      specs: [{ type: 'sample' }, { field: 'quality', type: 'mean', decimals: 1 }]
    });
    assert.equal(metricsRes.statusCode, 200);
    assert.equal(metricsRes.body.N, 96);
    assert.equal(metricsRes.body.metrics[0].formatted, '96');
  }
});

test('Mídia: conta Report recebe 403 em GET /api/media e na tela vê apenas a prévia desfocada sem carregar linhas', async () => {
  const BillingStore = require('../lib/billing-store');
  let activePlan = 'report';

  function loadMediaHandler() {
    const mod = { exports: {} };
    vm.runInNewContext(fs.readFileSync(path.join(rootDir, 'api', 'media.js'), 'utf8'), {
      module: mod,
      exports: mod.exports,
      require(id) {
        if (id === '../lib/billing-store') {
          return {
            ...BillingStore,
            async authenticate() {
              return { id: 'u1', app_metadata: activePlan === 'admin' ? { role: 'admin' } : {} };
            },
            async db() {
              return [{ id: 1, perfil: 'lifeinforma', tema_central: 'Cultura', likes: 50, comments: 4 }];
            }
          };
        }
        if (id === '../lib/entitlements') {
          return {
            async getEffectiveEntitlement() {
              return { planType: activePlan };
            }
          };
        }
        return require(id);
      }
    });
    return mod.exports;
  }

  async function callMedia(handler) {
    const res = {
      statusCode: 200,
      headers: {},
      setHeader(k, v) { this.headers[k] = v; },
      status(c) { this.statusCode = c; return this; },
      json(payload) { this.body = payload; return this; }
    };
    await handler({ method: 'GET', query: {} }, res);
    return res;
  }

  const mediaHandler = loadMediaHandler();

  for (const deniedPlan of ['gratis', 'dash', 'report']) {
    activePlan = deniedPlan;
    const denied = await callMedia(mediaHandler);
    assert.equal(denied.statusCode, 403, `Plano ${deniedPlan} deveria receber 403 em /api/media`);
    assert.equal(denied.body.code, 'ACTIVE_PLAN_REQUIRED');
  }

  activePlan = 'midia';
  const allowed = await callMedia(mediaHandler);
  assert.equal(allowed.statusCode, 200);
  assert.equal(allowed.body.rows.length, 1);

  // Verifica também os endpoints de IA desativados neste lançamento
  for (const endpointFile of ['consultor.js', '_oraculo.js']) {
    const handler = require(path.join(rootDir, 'api', endpointFile));
    const res = {
      statusCode: 200,
      setHeader() {},
      status(c) { this.statusCode = c; return this; },
      json(payload) { this.body = payload; return this; }
    };
    await handler({ method: 'POST', headers: {} }, res);
    assert.equal(res.statusCode, 404);
    assert.equal(res.body.code, 'NOT_FOUND');
  }
});


test('Dash pago calcula gráficos no servidor (/api/survey-preview) e nunca baixa as 477 linhas brutas no navegador', async () => {
  const appJs = fs.readFileSync(path.join(rootDir, 'app.js'), 'utf8');
  assert.doesNotMatch(appJs, /from\(["']respostas_pesquisa["']\)/, 'app.js não deve ler respostas_pesquisa direto no navegador');
  assert.doesNotMatch(appJs, /surveyDemo=1/, 'app.js não deve buscar linhas brutas de demonstração em /api/asaas-checkout?surveyDemo=1');
  assert.match(appJs, /fetch\(['"]\/api\/survey-preview['"]\s*\+/, 'app.js deve buscar agregados do servidor em /api/survey-preview');

  const surveyData = require('../lib/survey-data');
  const rows = surveyData.demoSurveyRows();
  const payload = surveyData.surveyPreview(rows, {}, true);

  assert.equal(payload.full, true);
  assert.equal(payload.total, 96);
  assert.ok(payload.kpis && typeof payload.kpis.pride === 'number', 'Servidor deve entregar KPIs calculados');
  assert.ok(Array.isArray(payload.flowPairs), 'Servidor deve entregar pares de fluxo Sankey agregados');
  assert.ok(payload.reference && typeof payload.reference === 'object', 'Servidor deve entregar agregado de referência por pergunta');

  // Perguntas de múltipla escolha devem ser separadas por vírgula e sem parênteses no servidor
  const transportQuestion = payload.questions.find(q => /transporte/i.test(q));
  assert.ok(transportQuestion, 'Pergunta de transporte presente');
  const multiRows = rows.map(r => ({ ...r, [transportQuestion]: 'Carro (próprio), Ônibus (municipal)' }));
  const multiPayload = surveyData.surveyPreview(multiRows, {}, true);
  const transportBuckets = multiPayload.charts[transportQuestion] || [];
  assert.deepEqual(
    transportBuckets,
    [
      { label: 'Carro', count: 96 },
      { label: 'Ônibus', count: 96 }
    ],
    'Buckets de múltipla escolha devem ser separados por vírgula e sem parênteses no servidor'
  );
});

test('Termos de uso e privacidade: sistema usa exclusivamente o registro imutável em terms_acceptances e ignora user_metadata forjado', async () => {
  const loginHtml = fs.readFileSync(path.join(rootDir, 'login.html'), 'utf8');
  const primeiroAcessoHtml = fs.readFileSync(path.join(rootDir, 'primeiro-acesso.html'), 'utf8');
  const appJs = fs.readFileSync(path.join(rootDir, 'app.js'), 'utf8');

  assert.match(loginHtml, /window\.radarLegal\.checkFirstAccess\(/, 'login.html deve consultar o registro protegido em terms_acceptances');
  assert.match(primeiroAcessoHtml, /window\.radarLegal\.checkFirstAccess\(/, 'primeiro-acesso.html deve consultar o registro protegido em terms_acceptances');
  assert.match(appJs, /window\.radarLegal\.checkFirstAccess\(/, 'app.js deve validar o acesso pelo registro protegido em terms_acceptances');

  const db = new PGlite();
  const newUserId = '00000000-0000-4000-8000-000000000777';
  const signupUserId = '00000000-0000-4000-8000-000000000888';
  await db.exec(`
    CREATE ROLE anon NOLOGIN;
    CREATE ROLE authenticated NOLOGIN;
    CREATE ROLE service_role NOLOGIN BYPASSRLS;
    CREATE SCHEMA auth;
    CREATE TABLE auth.users(id uuid PRIMARY KEY, email text, raw_user_meta_data jsonb);
    CREATE FUNCTION auth.jwt() RETURNS jsonb LANGUAGE sql STABLE AS $$
      SELECT COALESCE(NULLIF(current_setting('request.jwt.claims', true), ''), '{}')::jsonb
    $$;
    CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$ SELECT (auth.jwt()->>'sub')::uuid $$;
    GRANT USAGE ON SCHEMA auth TO anon, authenticated, service_role;
  `);
  await db.exec(readMigration('020_immutable_terms_acceptance.sql'));

  // 1. Conta criada sem trigger (ex.: Google OAuth ou conta antiga) mas com user_metadata forjado
  await db.query(`INSERT INTO auth.users VALUES ($1, 'nova-conta@example.invalid', '{}')`, [newUserId]);

  // 2. Conta criada no cadastro do login.html com raw_user_meta_data aciona a trigger no banco com now()
  await db.query(
    `INSERT INTO auth.users VALUES ($1, 'cadastro-login@example.invalid', $2::jsonb)`,
    [signupUserId, JSON.stringify({ radar_profile_type: 'morador', radar_terms_acceptance: { version: '0.2' } })]
  );
  const triggerRows = (await db.query(`SELECT terms_version, profile_type, accepted_at FROM public.terms_acceptances WHERE user_id = $1`, [signupUserId])).rows;
  assert.equal(triggerRows.length, 1, 'Trigger de cadastro deve criar registro imutável em terms_acceptances no banco');
  assert.equal(triggerRows[0].terms_version, '0.2');
  assert.equal(triggerRows[0].profile_type, 'morador');

  const sandbox = { window: {}, navigator: { userAgent: 'RadarTestBrowser/1.0' }, console };
  vm.runInNewContext(fs.readFileSync(path.join(rootDir, 'aceite-termos.js'), 'utf8'), sandbox);
  const radarLegal = sandbox.window.radarLegal;
  assert.equal(typeof radarLegal.checkFirstAccess, 'function');

  // Cliente Supabase ligado ao banco PostgreSQL (PGlite) autenticado como newUserId
  await db.query(`SELECT set_config('request.jwt.claims', $1, false)`, [JSON.stringify({ role: 'authenticated', sub: newUserId })]);
  await db.exec('SET ROLE authenticated');

  const client = {
    from(table) {
      assert.equal(table, 'terms_acceptances');
      return {
        select() {
          const filters = {};
          return {
            eq(col, val) { filters[col] = val; return this; },
            async limit() {
              const r = await db.query(
                `SELECT id, user_id, terms_version, profile_type, accepted_at FROM public.terms_acceptances WHERE user_id = $1 AND terms_version = $2 LIMIT 1`,
                [filters.user_id, filters.terms_version]
              );
              return { data: r.rows, error: null };
            }
          };
        },
        async insert(payload) {
          try {
            await db.query(
              `INSERT INTO public.terms_acceptances (user_id, terms_version, profile_type, user_agent)
               VALUES ($1, $2, $3, $4)`,
              [payload.user_id, payload.terms_version, payload.profile_type, payload.user_agent]
            );
            return { error: null };
          } catch (err) {
            return { error: err };
          }
        }
      };
    }
  };

  const newUserWithForgedMeta = {
    id: newUserId,
    user_metadata: {
      radar_full_name: 'Maria Teste',
      radar_profile_type: 'empresario',
      radar_terms_acceptance: {
        version: radarLegal.version,
        accepted_at: '2020-01-01T00:00:00.000Z'
      }
    }
  };

  // ANTES de gravar no banco: mesmo com user_metadata preenchido/forjado, checkFirstAccess recusa porque não existe linha em terms_acceptances!
  const beforeDb = await radarLegal.checkFirstAccess(client, newUserWithForgedMeta);
  assert.equal(beforeDb.accepted, false, 'Não deve confiar em user_metadata sem linha no banco');
  assert.equal(beforeDb.needsFirstAccess, true, 'Deve exigir primeiro acesso enquanto não houver registro em terms_acceptances');
  assert.equal(beforeDb.record, null);

  // Cliente não consegue forjar accepted_at via INSERT direto
  await assert.rejects(
    db.query(`INSERT INTO public.terms_acceptances (user_id, terms_version, accepted_at) VALUES ($1, '0.2', '2020-01-01T00:00:00Z')`, [newUserId]),
    { code: '42501' }
  );

  // Ao gravar pelo fluxo oficial (recordAcceptance), o banco preenche accepted_at = now() e retorna o registro oficial
  const firstSave = await radarLegal.recordAcceptance(client, newUserWithForgedMeta);
  assert.ok(firstSave && firstSave.id, 'recordAcceptance deve retornar o registro lido do banco');
  assert.equal(firstSave.terms_version, '0.2');

  const afterDb = await radarLegal.checkFirstAccess(client, newUserWithForgedMeta);
  assert.equal(afterDb.accepted, true, 'Após gravar em terms_acceptances, checkFirstAccess confirma pelo banco');
  assert.equal(afterDb.needsFirstAccess, false);
  assert.equal(afterDb.record.id, firstSave.id);

  // Chamada repetida é idempotente e não duplica
  const secondSave = await radarLegal.recordAcceptance(client, newUserWithForgedMeta);
  assert.equal(secondSave.id, firstSave.id);

  const rows = (await db.query(`SELECT user_id, terms_version, profile_type, user_agent FROM public.terms_acceptances WHERE user_id = $1`, [newUserId])).rows;
  assert.equal(rows.length, 1);
  assert.equal(rows[0].terms_version, '0.2');
  assert.equal(rows[0].profile_type, 'empresario');
  assert.equal(rows[0].user_agent, 'RadarTestBrowser/1.0');

  // Imutabilidade: a própria conta nova não consegue alterar nem apagar o registro
  await assert.rejects(
    db.query(`UPDATE public.terms_acceptances SET profile_type = 'outro' WHERE user_id = $1`, [newUserId]),
    { code: '42501' }
  );
  await assert.rejects(
    db.query(`DELETE FROM public.terms_acceptances WHERE user_id = $1`, [newUserId]),
    { code: '42501' }
  );
  await db.exec('RESET ROLE');
});
