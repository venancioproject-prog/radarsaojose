-- Run after 010–014. Verify the API and the database together in homologation.
BEGIN;
SET LOCAL lock_timeout = '5s';

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = pg_catalog
AS $$ SELECT public.is_crm_admin() $$;
REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
-- Some legacy public read policies reference this function. Anon must be able
-- to evaluate it to false so those policies can still serve published records.
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated, service_role;

DO $$
DECLARE
  relation regclass := to_regclass('public.analise_midia_sjc');
  columns text;
BEGIN
  IF relation IS NULL THEN RETURN; END IF;

  ALTER TABLE public.analise_midia_sjc ENABLE ROW LEVEL SECURITY;
  DROP POLICY IF EXISTS "Allow public read on analise_midia_sjc" ON public.analise_midia_sjc;
  REVOKE ALL ON TABLE public.analise_midia_sjc FROM PUBLIC, anon, authenticated;
  SELECT string_agg(quote_ident(attname), ', ' ORDER BY attnum) INTO columns
  FROM pg_attribute WHERE attrelid = relation AND attnum > 0 AND NOT attisdropped;
  IF columns IS NOT NULL THEN
    EXECUTE format('REVOKE ALL (%s) ON TABLE %s FROM PUBLIC, anon, authenticated', columns, relation);
  END IF;
  GRANT SELECT ON TABLE public.analise_midia_sjc TO service_role;
  IF has_any_column_privilege('anon', relation, 'SELECT') OR
     has_any_column_privilege('authenticated', relation, 'SELECT') THEN
    RAISE EXCEPTION 'Inherited read access remains on %', relation;
  END IF;
END
$$;

COMMIT;
