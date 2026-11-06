BEGIN;

CREATE SCHEMA IF NOT EXISTS radar_private;
REVOKE ALL ON SCHEMA radar_private FROM PUBLIC, anon;
GRANT USAGE ON SCHEMA radar_private TO authenticated;

CREATE OR REPLACE FUNCTION radar_private.can_read_paid_data(minimum_plan text)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = pg_catalog
AS $$
  SELECT auth.uid() IS NOT NULL AND minimum_plan IN ('dash', 'midia') AND (
    auth.jwt()->'app_metadata'->>'role' = 'admin'
    OR auth.jwt()->'app_metadata'->'is_admin' = 'true'::jsonb
    OR EXISTS (
      SELECT 1
      FROM public.billing_subscriptions s
      WHERE s.status = 'active'
        AND s.period_start <= now() AND s.period_end > now()
        AND (s.plan_type = 'midia' OR (minimum_plan = 'dash' AND s.plan_type IN ('dash', 'report')))
        AND (
          s.user_id = auth.uid()
          OR (s.plan_type = 'midia' AND EXISTS (
            SELECT 1 FROM public.billing_licenses l
            WHERE l.subscription_id = s.id AND l.user_id = auth.uid()
          ))
        )
    )
  );
$$;

REVOKE ALL ON FUNCTION radar_private.can_read_paid_data(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION radar_private.can_read_paid_data(text) TO authenticated;

DO $migration$
DECLARE
  target record;
  relation_kind "char";
  column_name text;
BEGIN
  FOR target IN SELECT * FROM (VALUES
    ('respostas_pesquisa', 'dash'),
    ('respostas radar', 'dash'),
    ('analise_midia_sjc', 'midia')
  ) AS targets(table_name, minimum_plan)
  LOOP
    SELECT c.relkind INTO relation_kind
    FROM pg_catalog.pg_class c JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relname = target.table_name;

    CONTINUE WHEN NOT FOUND;
    IF relation_kind NOT IN ('r', 'p', 'v', 'm') THEN
      RAISE EXCEPTION 'Tipo de relação não tratado para %: %', target.table_name, relation_kind;
    END IF;

    EXECUTE format('REVOKE SELECT ON public.%I FROM PUBLIC, anon, authenticated', target.table_name);
    FOR column_name IN
      SELECT a.attname FROM pg_catalog.pg_attribute a
      WHERE a.attrelid = to_regclass(format('public.%I', target.table_name))
        AND a.attnum > 0 AND NOT a.attisdropped
    LOOP
      EXECUTE format('REVOKE SELECT (%I) ON public.%I FROM PUBLIC, anon, authenticated', column_name, target.table_name);
    END LOOP;
    EXECUTE format('GRANT SELECT ON public.%I TO service_role', target.table_name);

    -- Views podem usar os privilégios do proprietário. A leitura delas fica restrita ao servidor.
    IF relation_kind IN ('r', 'p') THEN
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', target.table_name);
      EXECUTE format('GRANT SELECT ON public.%I TO authenticated', target.table_name);
      EXECUTE format('DROP POLICY IF EXISTS radar_paid_read_guard ON public.%I', target.table_name);
      EXECUTE format('DROP POLICY IF EXISTS radar_paid_read_allow ON public.%I', target.table_name);
      EXECUTE format(
        'CREATE POLICY radar_paid_read_guard ON public.%I AS RESTRICTIVE FOR SELECT TO authenticated USING ((SELECT radar_private.can_read_paid_data(%L)))',
        target.table_name, target.minimum_plan
      );
      EXECUTE format(
        'CREATE POLICY radar_paid_read_allow ON public.%I FOR SELECT TO authenticated USING (true)',
        target.table_name
      );
    END IF;
  END LOOP;
END
$migration$;

COMMIT;

SELECT c.relname AS relation, c.relkind AS kind, c.relrowsecurity AS rls,
       has_table_privilege('anon', c.oid, 'SELECT') AS anonymous_select
FROM pg_catalog.pg_class c JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND c.relname IN ('respostas_pesquisa', 'respostas radar', 'analise_midia_sjc')
ORDER BY c.relname;
