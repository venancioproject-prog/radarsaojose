-- Browser clients receive approved aggregates from the API, never raw answers.
-- Preserve collection INSERT permissions: the original collection service is not yet identified.
BEGIN;
SET LOCAL lock_timeout = '5s';
DO $migration$
DECLARE target text; relation regclass; columns text;
BEGIN
  FOREACH target IN ARRAY ARRAY['respostas_pesquisa', 'respostas radar'] LOOP
    relation := to_regclass(format('public.%I', target));
    IF relation IS NULL THEN CONTINUE; END IF;
    EXECUTE format('REVOKE SELECT ON TABLE %s FROM PUBLIC, anon, authenticated', relation);
    SELECT string_agg(quote_ident(attname), ', ' ORDER BY attnum) INTO columns
    FROM pg_attribute WHERE attrelid = relation AND attnum > 0 AND NOT attisdropped;
    IF columns IS NOT NULL THEN
      EXECUTE format('REVOKE SELECT (%s) ON TABLE %s FROM PUBLIC, anon, authenticated', columns, relation);
    END IF;
    EXECUTE format('GRANT SELECT ON TABLE %s TO service_role', relation);
    IF has_any_column_privilege('anon', relation, 'SELECT') OR
       has_any_column_privilege('authenticated', relation, 'SELECT') THEN
      RAISE EXCEPTION 'Inherited survey read access remains on %', relation;
    END IF;
  END LOOP;
END
$migration$;
COMMIT;
