BEGIN;

ALTER TABLE public.billing_subscriptions DROP CONSTRAINT billing_subscriptions_payment_method_check,
  ADD CONSTRAINT billing_subscriptions_payment_method_check CHECK (payment_method IN ('PIX','CREDIT_CARD','BOLETO'));
ALTER TABLE public.billing_orders DROP CONSTRAINT billing_orders_payment_method_check,
  ADD CONSTRAINT billing_orders_payment_method_check CHECK (payment_method IN ('PIX','CREDIT_CARD','BOLETO'));

CREATE OR REPLACE FUNCTION public.billing_apply_annual_upgrade_term()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,public AS $$
DECLARE next_order public.billing_orders; prior_state jsonb;
BEGIN
 IF NEW.source_order_id IS NOT DISTINCT FROM OLD.source_order_id THEN RETURN NEW; END IF;

 SELECT h.previous_state INTO prior_state
 FROM public.billing_plan_history h
 JOIN public.billing_orders o ON o.id=h.order_id
 WHERE h.order_id=OLD.source_order_id AND o.status='canceled'
   AND o.quote->>'termPolicy'='annual_upgrade_v1'
   AND h.previous_state->>'source_order_id'=NEW.source_order_id::text;

 IF FOUND THEN
   NEW.period_start := (prior_state->>'period_start')::timestamptz;
   NEW.period_end := (prior_state->>'period_end')::timestamptz;
   NEW.payment_method := prior_state->>'payment_method';
   NEW.installment_count := (prior_state->>'installment_count')::integer;
   NEW.installments_paid := (prior_state->>'installments_paid')::integer;
   RETURN NEW;
 END IF;

 SELECT * INTO next_order FROM public.billing_orders WHERE id=NEW.source_order_id;
 IF next_order.kind='upgrade' AND next_order.quote->>'termPolicy'='annual_upgrade_v1' THEN
   IF next_order.user_id IS DISTINCT FROM NEW.user_id
     OR next_order.subscription_id IS DISTINCT FROM NEW.id
     OR next_order.status <> 'pending' OR next_order.payment_method NOT IN ('PIX','CREDIT_CARD','BOLETO')
     OR (next_order.payment_method <> 'CREDIT_CARD' AND next_order.installment_count <> 1) THEN
     RAISE EXCEPTION 'invalid annual upgrade order';
   END IF;

   NEW.period_start := now();
   NEW.period_end := ((NEW.period_start AT TIME ZONE 'UTC') + interval '12 months') AT TIME ZONE 'UTC';
   NEW.payment_method := next_order.payment_method;
   NEW.installment_count := next_order.installment_count;
   NEW.installments_paid := 1;
   UPDATE public.billing_orders SET period_start=NEW.period_start, period_end=NEW.period_end
   WHERE id=next_order.id;
 END IF;
 RETURN NEW;
END $$;

CREATE FUNCTION public.billing_annual_upgrade_methods_ready()
RETURNS boolean LANGUAGE sql STABLE SECURITY INVOKER SET search_path=pg_catalog,public AS $$
 SELECT public.billing_annual_upgrade_ready();
$$;
REVOKE ALL ON FUNCTION public.billing_annual_upgrade_methods_ready() FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.billing_annual_upgrade_methods_ready() TO service_role;

COMMIT;
