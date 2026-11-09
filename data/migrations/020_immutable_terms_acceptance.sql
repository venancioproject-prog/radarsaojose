-- Migration 020: Immutable Terms Acceptance Audit Log
-- Provides an append-only, legally auditable log of terms of use and privacy policy acceptances under LGPD.
BEGIN;
SET LOCAL lock_timeout = '5s';

CREATE TABLE IF NOT EXISTS public.terms_acceptances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  terms_version text NOT NULL,
  profile_type text,
  accepted_at timestamptz NOT NULL DEFAULT now(),
  user_agent text
);

ALTER TABLE public.terms_acceptances ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS insert_own_acceptance ON public.terms_acceptances;
CREATE POLICY insert_own_acceptance ON public.terms_acceptances
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS select_own_acceptance ON public.terms_acceptances;
CREATE POLICY select_own_acceptance ON public.terms_acceptances
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Enforce append-only immutability for clients: no UPDATE or DELETE allowed for public/anon/authenticated
REVOKE ALL ON public.terms_acceptances FROM PUBLIC, anon;
REVOKE UPDATE, DELETE ON public.terms_acceptances FROM authenticated;
GRANT SELECT, INSERT (user_id, terms_version, profile_type, user_agent) ON public.terms_acceptances TO authenticated;
GRANT ALL ON public.terms_acceptances TO service_role;

CREATE UNIQUE INDEX IF NOT EXISTS terms_acceptances_user_version_uidx
  ON public.terms_acceptances(user_id, terms_version);

CREATE INDEX IF NOT EXISTS terms_acceptances_user_idx
  ON public.terms_acceptances(user_id, accepted_at DESC);

-- Server-side trigger to record initial signup acceptance with database timestamp now()
CREATE OR REPLACE FUNCTION public.handle_new_user_terms_acceptance()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, public AS $$
DECLARE
  v_version text;
  v_profile text;
BEGIN
  IF jsonb_typeof(new.raw_user_meta_data) = 'object' THEN
    IF jsonb_typeof(new.raw_user_meta_data->'radar_terms_acceptance') = 'object' THEN
      v_version := nullif(trim(coalesce(new.raw_user_meta_data->'radar_terms_acceptance'->>'version', '')), '');
    END IF;
    v_profile := nullif(trim(coalesce(new.raw_user_meta_data->>'radar_profile_type', '')), '');
  END IF;
  IF v_version IS NOT NULL THEN
    INSERT INTO public.terms_acceptances (user_id, terms_version, profile_type, accepted_at)
    VALUES (new.id, v_version, v_profile, now())
    ON CONFLICT (user_id, terms_version) DO NOTHING;
  END IF;
  RETURN new;
END;
$$;

REVOKE ALL ON FUNCTION public.handle_new_user_terms_acceptance() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS on_auth_user_created_terms ON auth.users;
CREATE TRIGGER on_auth_user_created_terms
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_terms_acceptance();

COMMIT;
