-- Apply in test first. Disabled by default; never backfills old purchases.
BEGIN;
SET LOCAL lock_timeout = '5s';

CREATE TABLE IF NOT EXISTS public.billing_email_queue_settings (
 id integer PRIMARY KEY CHECK (id = 1),
 enabled boolean NOT NULL DEFAULT false
);
INSERT INTO public.billing_email_queue_settings(id, enabled) VALUES (1, false)
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.billing_email_outbox (
 order_id uuid PRIMARY KEY REFERENCES public.billing_orders(id),
 state text NOT NULL DEFAULT 'pending' CHECK (state IN ('pending','sending','sent','needs_review','canceled')),
 attempts integer NOT NULL DEFAULT 0 CHECK (attempts BETWEEN 0 AND 6),
 next_attempt_at timestamptz NOT NULL DEFAULT now(),
 first_attempt_at timestamptz,
 lease_token uuid,
 lease_until timestamptz,
 sent_at timestamptz,
 provider_id text,
 last_error_code text,
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS billing_email_due ON public.billing_email_outbox(next_attempt_at)
WHERE state IN ('pending','sending');

ALTER TABLE public.billing_email_queue_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_email_outbox ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.billing_email_queue_settings, public.billing_email_outbox FROM PUBLIC, anon, authenticated;
GRANT SELECT, UPDATE ON public.billing_email_queue_settings TO service_role;
GRANT SELECT ON public.billing_email_outbox TO service_role;

CREATE OR REPLACE FUNCTION public.billing_queue_confirmation_email()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog AS $$
BEGIN
 IF NEW.status = 'paid' AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM 'paid')
   AND EXISTS (SELECT 1 FROM public.billing_email_queue_settings WHERE id=1 AND enabled) THEN
   INSERT INTO public.billing_email_outbox(order_id) VALUES (NEW.id) ON CONFLICT (order_id) DO NOTHING;
 END IF;
 RETURN NEW;
END $$;
REVOKE ALL ON FUNCTION public.billing_queue_confirmation_email() FROM PUBLIC, anon, authenticated, service_role;
DROP TRIGGER IF EXISTS billing_confirmation_email ON public.billing_orders;
CREATE TRIGGER billing_confirmation_email AFTER INSERT OR UPDATE OF status ON public.billing_orders
FOR EACH ROW EXECUTE FUNCTION public.billing_queue_confirmation_email();

CREATE OR REPLACE FUNCTION public.billing_claim_confirmation_email()
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog AS $$
DECLARE job public.billing_email_outbox;
BEGIN
 IF auth.role() IS DISTINCT FROM 'service_role' THEN RAISE EXCEPTION 'service_role required' USING ERRCODE='42501'; END IF;
 IF NOT EXISTS (SELECT 1 FROM public.billing_email_queue_settings WHERE id=1 AND enabled) THEN RETURN NULL; END IF;
 -- Never retry an uncertain delivery beyond the provider deduplication window.
 UPDATE public.billing_email_outbox SET state='needs_review', last_error_code='RETRY_WINDOW_EXPIRED',
   lease_token=NULL, lease_until=NULL, updated_at=now()
 WHERE order_id IN (SELECT order_id FROM public.billing_email_outbox
   WHERE state IN ('pending','sending') AND (lease_until IS NULL OR lease_until<=now())
     AND (attempts>=6 OR first_attempt_at<=now()-interval '20 hours')
   ORDER BY created_at FOR UPDATE SKIP LOCKED LIMIT 100);
 SELECT * INTO job FROM public.billing_email_outbox
 WHERE ((state='pending' AND next_attempt_at<=now()) OR (state='sending' AND lease_until<=now()))
   AND attempts<6 AND (first_attempt_at IS NULL OR first_attempt_at>now()-interval '20 hours')
 ORDER BY next_attempt_at, created_at FOR UPDATE SKIP LOCKED LIMIT 1;
 IF NOT FOUND THEN RETURN NULL; END IF;
 UPDATE public.billing_email_outbox SET state='sending', attempts=attempts+1,
   first_attempt_at=coalesce(first_attempt_at,now()), lease_token=gen_random_uuid(),
   lease_until=now()+interval '2 minutes', updated_at=now()
 WHERE order_id=job.order_id RETURNING * INTO job;
 RETURN to_jsonb(job);
END $$;

CREATE OR REPLACE FUNCTION public.billing_finish_confirmation_email(
 p_order_id uuid, p_lease_token uuid, p_outcome text, p_error_code text DEFAULT NULL, p_provider_id text DEFAULT NULL)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog AS $$
DECLARE job public.billing_email_outbox;
BEGIN
 IF auth.role() IS DISTINCT FROM 'service_role' THEN RAISE EXCEPTION 'service_role required' USING ERRCODE='42501'; END IF;
 IF p_outcome NOT IN ('sent','retry','needs_review','canceled') OR p_outcome IS NULL
   OR (p_error_code IS NOT NULL AND p_error_code !~ '^[A-Z0-9_]{1,80}$')
   OR (p_provider_id IS NOT NULL AND length(p_provider_id)>200) THEN RAISE EXCEPTION 'invalid delivery outcome'; END IF;
 SELECT * INTO job FROM public.billing_email_outbox
 WHERE order_id=p_order_id AND state='sending' AND lease_token=p_lease_token AND lease_until>now() FOR UPDATE;
 IF NOT FOUND THEN RETURN false; END IF;
 UPDATE public.billing_email_outbox SET
   state=CASE WHEN p_outcome='retry' AND (attempts>=6 OR first_attempt_at<=now()-interval '20 hours')
     THEN 'needs_review' WHEN p_outcome='retry' THEN 'pending' ELSE p_outcome END,
   next_attempt_at=now()+make_interval(secs => (300*power(2,attempts-1))::integer),
   last_error_code=p_error_code, provider_id=p_provider_id,
   sent_at=CASE WHEN p_outcome='sent' THEN now() ELSE sent_at END,
   lease_token=NULL, lease_until=NULL, updated_at=now()
 WHERE order_id=job.order_id;
 RETURN true;
END $$;

REVOKE ALL ON FUNCTION public.billing_claim_confirmation_email() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.billing_finish_confirmation_email(uuid,uuid,text,text,text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.billing_claim_confirmation_email() TO service_role;
GRANT EXECUTE ON FUNCTION public.billing_finish_confirmation_email(uuid,uuid,text,text,text) TO service_role;
COMMIT;
