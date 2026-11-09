-- Aplicar em homologação após configurar o autenticador nas contas administrativas.
-- Complementa, sem substituir, as políticas existentes de titularidade e plano.
BEGIN;

CREATE OR REPLACE FUNCTION public.radar_mfa_satisfied()
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = pg_catalog
AS $$
  SELECT coalesce(auth.jwt()->>'aal' = 'aal2', false)
      OR (
        auth.uid() IS NOT NULL
        AND NOT coalesce(
          auth.jwt()->'app_metadata'->>'role' = 'admin'
          OR auth.jwt()->'app_metadata'->>'is_admin' = 'true', false
        )
        AND NOT EXISTS (
          SELECT 1 FROM auth.mfa_factors
          WHERE user_id = auth.uid() AND status = 'verified'
        )
      );
$$;
REVOKE ALL ON FUNCTION public.radar_mfa_satisfied() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.radar_mfa_satisfied() TO authenticated;

CREATE OR REPLACE FUNCTION public.is_crm_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = pg_catalog
AS $$
  SELECT coalesce(auth.role() = 'service_role' OR
    (auth.uid() IS NOT NULL AND auth.jwt()->>'aal' = 'aal2' AND
     (auth.jwt()->'app_metadata'->>'role' = 'admin'
      OR auth.jwt()->'app_metadata'->>'is_admin' = 'true')), false);
$$;
REVOKE ALL ON FUNCTION public.is_crm_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_crm_admin() TO authenticated, service_role;

DO $$
DECLARE
  name text;
BEGIN
  FOREACH name IN ARRAY ARRAY[
    'profiles', 'billing_subscriptions', 'billing_orders', 'billing_gateway_events',
    'billing_plan_history', 'billing_credit_uses', 'billing_licenses',
    'respostas_pesquisa', 'respostas radar'
  ] LOOP
    IF to_regclass(format('public.%I', name)) IS NULL THEN CONTINUE; END IF;
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', name);
    EXECUTE format('DROP POLICY IF EXISTS radar_mfa_guard ON public.%I', name);
    EXECUTE format(
      'CREATE POLICY radar_mfa_guard ON public.%I AS RESTRICTIVE FOR ALL TO authenticated USING (public.radar_mfa_satisfied()) WITH CHECK (public.radar_mfa_satisfied())',
      name
    );
  END LOOP;

  FOREACH name IN ARRAY ARRAY[
    'crm_empresas', 'crm_pessoas', 'crm_empresa_pessoas', 'crm_oportunidades',
    'crm_atividades', 'crm_propostas', 'crm_vendas', 'crm_clientes', 'crm_acessos',
    'crm_audit_logs', 'business_plans'
  ] LOOP
    IF to_regclass(format('public.%I', name)) IS NULL THEN CONTINUE; END IF;
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', name);
    EXECUTE format('REVOKE ALL ON TABLE public.%I FROM PUBLIC, anon', name);
    EXECUTE format('DROP POLICY IF EXISTS radar_admin_mfa_guard ON public.%I', name);
    EXECUTE format(
      'CREATE POLICY radar_admin_mfa_guard ON public.%I AS RESTRICTIVE FOR ALL TO authenticated USING (public.is_crm_admin()) WITH CHECK (public.is_crm_admin())',
      name
    );
  END LOOP;
END $$;

COMMIT;
