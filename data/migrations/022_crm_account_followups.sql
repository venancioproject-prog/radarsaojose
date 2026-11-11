BEGIN;
SET LOCAL lock_timeout = '5s';

CREATE TABLE IF NOT EXISTS public.crm_account_followups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  stage text NOT NULL DEFAULT 'novo' CHECK (stage IN ('novo', 'contato', 'interesse', 'acompanhamento', 'sem_interesse')),
  notes text NOT NULL DEFAULT '' CHECK (char_length(notes) <= 5000),
  next_contact_date date,
  revision integer NOT NULL DEFAULT 1 CHECK (revision > 0),
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.crm_account_followup_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stage text NOT NULL,
  notes text NOT NULL,
  next_contact_date date,
  revision integer NOT NULL,
  changed_at timestamptz NOT NULL DEFAULT now(),
  changed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

ALTER TABLE public.crm_account_followups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_account_followup_history ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.crm_account_followups, public.crm_account_followup_history FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.crm_account_followups, public.crm_account_followup_history TO service_role;
GRANT SELECT ON public.crm_account_followups, public.crm_account_followup_history TO authenticated;

DROP POLICY IF EXISTS admin_mfa_read ON public.crm_account_followups;
CREATE POLICY admin_mfa_read ON public.crm_account_followups FOR SELECT TO authenticated
  USING (auth.jwt()->>'aal' = 'aal2' AND public.is_crm_admin());
DROP POLICY IF EXISTS admin_mfa_read ON public.crm_account_followup_history;
CREATE POLICY admin_mfa_read ON public.crm_account_followup_history FOR SELECT TO authenticated
  USING (auth.jwt()->>'aal' = 'aal2' AND public.is_crm_admin());

CREATE OR REPLACE FUNCTION public.track_crm_account_followup()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, public AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    NEW.revision := OLD.revision + 1;
  ELSE
    NEW.revision := 1;
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.track_crm_account_followup() FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.audit_crm_account_followup()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, public AS $$
BEGIN
  INSERT INTO public.crm_account_followup_history
    (user_id, stage, notes, next_contact_date, revision, changed_by)
  VALUES
    (NEW.user_id, NEW.stage, NEW.notes, NEW.next_contact_date, NEW.revision, NEW.updated_by);
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.audit_crm_account_followup() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS track_crm_account_followup ON public.crm_account_followups;
CREATE TRIGGER track_crm_account_followup BEFORE INSERT OR UPDATE ON public.crm_account_followups
  FOR EACH ROW EXECUTE FUNCTION public.track_crm_account_followup();
DROP TRIGGER IF EXISTS audit_crm_account_followup ON public.crm_account_followups;
CREATE TRIGGER audit_crm_account_followup AFTER INSERT OR UPDATE ON public.crm_account_followups
  FOR EACH ROW EXECUTE FUNCTION public.audit_crm_account_followup();

CREATE INDEX IF NOT EXISTS crm_account_followup_history_user_date
  ON public.crm_account_followup_history (user_id, changed_at DESC);

COMMIT;
