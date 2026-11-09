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
REVOKE UPDATE, DELETE ON public.terms_acceptances FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT ON public.terms_acceptances TO authenticated;
GRANT ALL ON public.terms_acceptances TO service_role;

CREATE UNIQUE INDEX IF NOT EXISTS terms_acceptances_user_version_uidx
  ON public.terms_acceptances(user_id, terms_version);

CREATE INDEX IF NOT EXISTS terms_acceptances_user_idx
  ON public.terms_acceptances(user_id, accepted_at DESC);

COMMIT;
