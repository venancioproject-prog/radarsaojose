-- ============================================================================
-- MIGRATION 012: HARDENING DE SEGURANÇA RLS & PROTEÇÃO DE POOL SERVERLESS
-- Radar São José dos Campos (Vercel + Supabase / Supavisor Transaction Pooler)
-- ============================================================================

begin;

-- ----------------------------------------------------------------------------
-- 1. PROTEÇÃO DE CONEXÕES NO POSTGRESQL (ANTI-LOCK / ANTI-IDLE TRANSACTION)
-- Garante que conexões do Supavisor/PgBouncer nunca fiquem presas em transações
-- ociosas ("idle in transaction") ou queries lentas sob carga de 30+ usuários.
-- ----------------------------------------------------------------------------
alter role anon set statement_timeout = '8s';
alter role anon set idle_in_transaction_session_timeout = '10s';
alter role anon set lock_timeout = '4s';

alter role authenticated set statement_timeout = '10s';
alter role authenticated set idle_in_transaction_session_timeout = '15s';
alter role authenticated set lock_timeout = '5s';

-- Garante que a função autoritativa public.is_admin() exista
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false)
      or coalesce((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false);
$$;

-- ----------------------------------------------------------------------------
-- 2. HARDENING DE RLS: public.vagas_sjc
-- Remove política vulnerável "USING (true) WITH CHECK (true)" que permitia
-- escrita/deleção anônima de vagas.
-- ----------------------------------------------------------------------------
do $$
begin
  if to_regclass('public.vagas_sjc') is not null then
    alter table public.vagas_sjc enable row level security;

    drop policy if exists "Permitir leitura pública de vagas" on public.vagas_sjc;
    drop policy if exists "Permitir sincronização de vagas" on public.vagas_sjc;
    drop policy if exists "vagas_sjc_public_select" on public.vagas_sjc;
    drop policy if exists "vagas_sjc_admin_write" on public.vagas_sjc;

    create policy "vagas_sjc_public_select"
      on public.vagas_sjc
      for select
      to anon, authenticated
      using (true);

    create policy "vagas_sjc_admin_write"
      on public.vagas_sjc
      for all
      to authenticated
      using (public.is_admin())
      with check (public.is_admin());

    revoke insert, update, delete, truncate on table public.vagas_sjc from anon, authenticated;
    grant select on table public.vagas_sjc to anon, authenticated;
  end if;
end
$$;

-- ----------------------------------------------------------------------------
-- 3. HARDENING DE RLS: public.blog_posts & storage.objects (blog-images)
-- Bloqueia acesso público a rascunhos e ao registro interno
-- 'system-business-plan-blocks-v2', e impede escrita/deleção por não-admins.
-- ----------------------------------------------------------------------------
do $$
begin
  if to_regclass('public.blog_posts') is not null then
    alter table public.blog_posts enable row level security;

    drop policy if exists "Public can view published posts" on public.blog_posts;
    drop policy if exists "Full management of posts" on public.blog_posts;
    drop policy if exists "blog_posts_public_published_select" on public.blog_posts;
    drop policy if exists "blog_posts_admin_all" on public.blog_posts;

    create policy "blog_posts_public_published_select"
      on public.blog_posts
      for select
      to anon, authenticated
      using (
        status = 'published'
        and slug <> 'system-business-plan-blocks-v2'
      );

    create policy "blog_posts_admin_all"
      on public.blog_posts
      for all
      to authenticated
      using (public.is_admin())
      with check (public.is_admin());

    revoke insert, update, delete, truncate on table public.blog_posts from anon;
    grant select on table public.blog_posts to anon, authenticated;
  end if;
end
$$;

do $$
begin
  if to_regclass('storage.objects') is not null then
    drop policy if exists "Public Upload to blog-images" on storage.objects;
    drop policy if exists "Public Update blog-images" on storage.objects;
    drop policy if exists "Public Delete blog-images" on storage.objects;
    drop policy if exists "Admin Upload to blog-images" on storage.objects;
    drop policy if exists "Admin Update blog-images" on storage.objects;
    drop policy if exists "Admin Delete blog-images" on storage.objects;

    create policy "Admin Upload to blog-images"
      on storage.objects for insert
      to authenticated
      with check (bucket_id = 'blog-images' and public.is_admin());

    create policy "Admin Update blog-images"
      on storage.objects for update
      to authenticated
      using (bucket_id = 'blog-images' and public.is_admin())
      with check (bucket_id = 'blog-images' and public.is_admin());

    create policy "Admin Delete blog-images"
      on storage.objects for delete
      to authenticated
      using (bucket_id = 'blog-images' and public.is_admin());
  end if;
end
$$;

-- ----------------------------------------------------------------------------
-- 4. HARDENING DE RLS: Plano de Negócios Confidencial (business_plans e plan_*)
-- Restringe leitura e escrita exclusivamente a administradores verificados.
-- ----------------------------------------------------------------------------
do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'business_plans',
    'plan_tasks',
    'plan_partners',
    'plan_financial_projections',
    'plan_swot_items'
  ]
  loop
    if to_regclass('public.' || tbl) is not null then
      execute format('alter table public.%I enable row level security', tbl);
      execute format('revoke all on table public.%I from anon', tbl);
      execute format('drop policy if exists "Permitir leitura autenticada do plano" on public.%I', tbl);
      execute format('drop policy if exists "Permitir atualizacao autenticada do plano" on public.%I', tbl);
      execute format('drop policy if exists "Permitir insercao autenticada do plano" on public.%I', tbl);
      execute format('drop policy if exists "Leitura pública para usuários autenticados (%s)" on public.%I', tbl, tbl);
      execute format('drop policy if exists "Edição para usuários autenticados (%s)" on public.%I', tbl, tbl);
      execute format('drop policy if exists "%s_admin_only" on public.%I', tbl, tbl);
      execute format(
        'create policy %I on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())',
        tbl || '_admin_only',
        tbl
      );
    end if;
  end loop;
end
$$;

-- ----------------------------------------------------------------------------
-- 5. BLINDAGEM TOTAL DO MARKET INTELLIGENCE (126K EMPRESAS SJC, CONTATOS & RPCs)
-- Acesso ESTRITAMENTE restrito ao perfil Admin Master (public.is_admin()).
-- Nenhum visitante (anon) ou usuário autenticado comum pode ler empresas_sjc,
-- vw_empresas_sjc_analytics ou executar qualquer função rpc_*.
-- ----------------------------------------------------------------------------
do $$
declare
  pol record;
  fn record;
  fn_def text;
  patched_def text;
begin
  -- 5.1 Tabela base public.empresas_sjc (126k empresas + contatos)
  if to_regclass('public.empresas_sjc') is not null then
    alter table public.empresas_sjc enable row level security;
    alter table public.empresas_sjc force row level security;

    revoke all on table public.empresas_sjc from public, anon, authenticated;
    grant select on table public.empresas_sjc to authenticated, service_role;

    for pol in
      select policyname
      from pg_policies
      where schemaname = 'public' and tablename = 'empresas_sjc'
    loop
      execute format('drop policy if exists %I on public.empresas_sjc', pol.policyname);
    end loop;

    create policy "empresas_sjc_admin_master_only"
      on public.empresas_sjc
      for all
      to authenticated
      using (public.is_admin())
      with check (public.is_admin());
  end if;

  -- 5.2 View analítica public.vw_empresas_sjc_analytics
  if to_regclass('public.vw_empresas_sjc_analytics') is not null then
    revoke all on table public.vw_empresas_sjc_analytics from public, anon, authenticated;
    grant select on table public.vw_empresas_sjc_analytics to authenticated, service_role;
    begin
      execute 'alter view public.vw_empresas_sjc_analytics set (security_invoker = true)';
    exception when others then
      null;
    end;
  end if;

  -- 5.3 Todas as RPCs de Inteligência de Mercado (public.rpc_*)
  -- Revoga execução de PUBLIC e anon, converte para SECURITY INVOKER (respeitando RLS de empresas_sjc)
  -- e injeta trava explícita de Admin Master (ERC 42501) no corpo PL/pgSQL.
  for fn in
    select
      p.oid,
      p.proname,
      pg_get_function_identity_arguments(p.oid) as ident_args,
      l.lanname
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    join pg_language l on l.oid = p.prolang
    where n.nspname = 'public'
      and p.proname like 'rpc_%'
  loop
    execute format('revoke all on function public.%I(%s) from public, anon', fn.proname, fn.ident_args);
    execute format('grant execute on function public.%I(%s) to authenticated, service_role', fn.proname, fn.ident_args);
    execute format('alter function public.%I(%s) security invoker', fn.proname, fn.ident_args);

    if fn.lanname = 'plpgsql' then
      fn_def := pg_get_functiondef(fn.oid);
      if position('public.is_admin()' in fn_def) = 0 then
        patched_def := regexp_replace(
          fn_def,
          E'\\mBEGIN\\M',
          E'BEGIN\n  IF NOT public.is_admin() AND current_setting(''role'', true) <> ''service_role'' THEN\n    RAISE EXCEPTION ''PERMISSION_DENIED: Acesso exclusivo para Admin Master.'' USING ERRCODE = ''42501'';\n  END IF;',
          'i'
        );
        if patched_def <> fn_def then
          execute patched_def;
          execute format('revoke all on function public.%I(%s) from public, anon', fn.proname, fn.ident_args);
          execute format('grant execute on function public.%I(%s) to authenticated, service_role', fn.proname, fn.ident_args);
          execute format('alter function public.%I(%s) security invoker', fn.proname, fn.ident_args);
        end if;
      end if;
    end if;
  end loop;
end
$$;

-- ----------------------------------------------------------------------------
-- 6. ÍNDICES DE ALTA CONCORRÊNCIA (OTIMIZAÇÃO DE POOL & LATÊNCIA DE QUERIES)
-- Evita Sequential Scans sob carga simultânea.
-- ----------------------------------------------------------------------------
do $$
begin
  if to_regclass('public.blog_posts') is not null then
    create index if not exists idx_blog_posts_published_feed
      on public.blog_posts (status, published_at desc)
      where slug <> 'system-business-plan-blocks-v2';
  end if;

  if to_regclass('public.business_plans') is not null then
    create index if not exists idx_business_plans_active_updated
      on public.business_plans (is_active, updated_at desc);
  end if;

  if to_regclass('public.billing_licenses') is not null then
    create index if not exists idx_billing_licenses_sub_user
      on public.billing_licenses (subscription_id, user_id);
  end if;
end
$$;

commit;
