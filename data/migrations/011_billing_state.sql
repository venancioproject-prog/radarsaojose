-- PROPOSTA NOVA: modelo explicitamente solicitado. Nenhuma tabela abaixo e alegada preexistente.
-- Revisar com 010 e testar num banco isolado. Nao migra/apaga registros existentes.
BEGIN;
CREATE TABLE public.billing_subscriptions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id),
 plan_type text NOT NULL CHECK (plan_type IN ('dash','report','midia')),
 status text NOT NULL CHECK (status IN ('active','past_due','canceled')),
 period_start timestamptz NOT NULL, period_end timestamptz NOT NULL,
 payment_method text NOT NULL CHECK (payment_method IN ('PIX','CREDIT_CARD')),
 installment_count integer NOT NULL DEFAULT 1 CHECK (installment_count BETWEEN 1 AND 12),
 installments_paid integer NOT NULL DEFAULT 0 CHECK (installments_paid BETWEEN 0 AND 12),
 version integer NOT NULL DEFAULT 1,
 source_order_id uuid,
 CHECK (period_end > period_start), CHECK (installments_paid <= installment_count)
);
CREATE TABLE public.billing_orders (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id uuid NOT NULL REFERENCES auth.users(id),
 subscription_id uuid REFERENCES public.billing_subscriptions(id),
 target_plan text NOT NULL CHECK (target_plan IN ('dash','report','midia')),
 kind text NOT NULL CHECK (kind IN ('purchase','upgrade')),
 amount_cents bigint NOT NULL CHECK (amount_cents >= 0),
 credit_cents bigint NOT NULL DEFAULT 0 CHECK (credit_cents >= 0),
 expected_version integer,
 period_start timestamptz NOT NULL, period_end timestamptz NOT NULL,
 payment_method text NOT NULL CHECK (payment_method IN ('PIX','CREDIT_CARD')),
 installment_count integer NOT NULL CHECK (installment_count BETWEEN 1 AND 12),
 status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','canceled')),
 asaas_payment_id text UNIQUE,
 quote jsonb NOT NULL DEFAULT '{}'::jsonb,
 created_at timestamptz NOT NULL DEFAULT now(),
 expires_at timestamptz NOT NULL DEFAULT (now() + interval '15 minutes'),
 CHECK (period_end > period_start),
 CHECK (kind <> 'upgrade' OR (subscription_id IS NOT NULL AND expected_version IS NOT NULL))
);
ALTER TABLE public.billing_subscriptions ADD CONSTRAINT billing_source_order_fk
 FOREIGN KEY (source_order_id) REFERENCES public.billing_orders(id);
CREATE UNIQUE INDEX billing_one_pending_upgrade ON public.billing_orders(subscription_id)
 WHERE kind='upgrade' AND status='pending';
CREATE UNIQUE INDEX billing_one_pending_order_per_user ON public.billing_orders(user_id)
 WHERE status='pending';
CREATE TABLE public.billing_gateway_events (
 event_id text PRIMARY KEY,
 payment_id text NOT NULL, event_type text NOT NULL,
 occurred_at timestamptz NOT NULL, payload jsonb NOT NULL,
 status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','processed','ignored')),
 received_at timestamptz NOT NULL DEFAULT now(), processed_at timestamptz
);
CREATE INDEX billing_events_payment ON public.billing_gateway_events(payment_id);
CREATE TABLE public.billing_plan_history (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 subscription_id uuid NOT NULL REFERENCES public.billing_subscriptions(id),
 order_id uuid NOT NULL UNIQUE REFERENCES public.billing_orders(id),
 previous_state jsonb,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.billing_credit_uses (
 order_id uuid PRIMARY KEY REFERENCES public.billing_orders(id),
 subscription_id uuid NOT NULL REFERENCES public.billing_subscriptions(id),
 subscription_version integer NOT NULL,
 amount_cents bigint NOT NULL CHECK (amount_cents >= 0),
 UNIQUE(subscription_id, subscription_version)
);
CREATE TABLE public.billing_licenses (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 subscription_id uuid NOT NULL REFERENCES public.billing_subscriptions(id),
 user_id uuid NOT NULL REFERENCES auth.users(id),
 created_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(subscription_id,user_id)
);
-- Zero acesso direto pelo navegador: endpoints autorizados fazem as operacoes.
ALTER TABLE public.billing_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_gateway_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_plan_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_credit_uses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_licenses ENABLE ROW LEVEL SECURITY;
DO $$ DECLARE t text; BEGIN
 FOREACH t IN ARRAY ARRAY['billing_subscriptions','billing_orders','billing_gateway_events',
 'billing_plan_history','billing_credit_uses','billing_licenses'] LOOP
 EXECUTE format('REVOKE ALL ON public.%I FROM PUBLIC, anon, authenticated',t);
 EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO service_role',t);
 END LOOP;
END $$;

-- Evento deve ser inserido antes por chamada REST separada; falha no processamento preserva-o pending.
CREATE FUNCTION public.billing_process_event(p_event_id text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,public AS $$
DECLARE e public.billing_gateway_events; o public.billing_orders; s public.billing_subscriptions;
 prev jsonb; sid uuid; canceled boolean; paid_count integer; still_overdue boolean; next_status text;
BEGIN
 IF auth.role() IS DISTINCT FROM 'service_role' THEN RAISE EXCEPTION 'service_role required'; END IF;
 SELECT * INTO e FROM public.billing_gateway_events WHERE event_id=p_event_id FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'event missing'; END IF;
 IF e.status <> 'pending' THEN RETURN jsonb_build_object('success',true,'duplicate',true); END IF;
 SELECT * INTO o FROM public.billing_orders WHERE asaas_payment_id=e.payment_id FOR UPDATE;
 IF NOT FOUND AND e.payload->'payment'->>'externalReference' ~* '^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$' THEN
   SELECT * INTO o FROM public.billing_orders
   WHERE id=(e.payload->'payment'->>'externalReference')::uuid
     AND quote->'gatewayPayments' ? e.payment_id FOR UPDATE;
 END IF;
 IF o.id IS NULL THEN RAISE EXCEPTION 'order missing'; END IF;
 -- Serializa inclusive compras concorrentes do mesmo usuario.
 PERFORM pg_advisory_xact_lock(hashtextextended(o.user_id::text,0));
 SELECT * INTO s FROM public.billing_subscriptions WHERE user_id=o.user_id FOR UPDATE;
 canceled := e.event_type IN ('PAYMENT_REFUNDED','PAYMENT_DELETED','PAYMENT_CHARGEBACK_REQUESTED');
 IF e.event_type IN ('PAYMENT_CONFIRMED','PAYMENT_RECEIVED') THEN
   -- O pagamento atual resolve o próprio atraso. Outra parcela vencida ainda
   -- bloqueia o acesso se o último evento aceito dela foi de atraso.
   SELECT EXISTS (
     SELECT 1 FROM (
       SELECT DISTINCT ON (p.payment_id) p.event_type
       FROM public.billing_gateway_events p
       WHERE p.status='processed' AND p.payment_id<>e.payment_id
         AND p.payment_id IN (SELECT jsonb_object_keys(o.quote->'gatewayPayments'))
       ORDER BY p.payment_id,p.processed_at DESC,p.received_at DESC,p.event_id DESC
     ) latest WHERE latest.event_type='PAYMENT_OVERDUE'
   ) INTO still_overdue;
   next_status := CASE WHEN still_overdue THEN 'past_due' ELSE 'active' END;
   IF o.status = 'paid' THEN
     -- A confirmação pode chegar depois que o mesmo pedido entrou em atraso.
     -- Restaurar a vigência existente sem contar a parcela outra vez.
     IF s.source_order_id=o.id AND s.status IN ('active','past_due') AND s.period_start<=now() AND s.period_end>now() THEN
       paid_count := s.installments_paid;
       IF o.quote ? 'gatewayPayments' THEN
         SELECT count(DISTINCT p.payment_id)::integer INTO paid_count FROM public.billing_gateway_events p
         WHERE p.payment_id IN (SELECT jsonb_object_keys(o.quote->'gatewayPayments'))
           AND p.event_type IN ('PAYMENT_CONFIRMED','PAYMENT_RECEIVED')
           AND (p.status='processed' OR p.event_id=e.event_id);
       END IF;
       IF paid_count<>s.installments_paid OR next_status<>s.status THEN
         UPDATE public.billing_subscriptions SET status=next_status,
           installments_paid=paid_count,version=version+1 WHERE id=s.id;
         UPDATE public.profiles SET plan_type=s.plan_type,updated_at=now() WHERE id=o.user_id;
         IF NOT FOUND THEN RAISE EXCEPTION 'profile missing'; END IF;
         UPDATE public.billing_gateway_events SET status='processed',processed_at=now() WHERE event_id=p_event_id;
         RETURN jsonb_build_object('success',true,'recovered',s.status='past_due' AND NOT still_overdue,
           'installmentUpdated',true,'orderId',o.id,'subscriptionId',s.id);
       END IF;
       -- Uma parcela quitada pode resolver seu próprio atraso enquanto outra
       -- continua vencida. Guardar a confirmação mesmo sem mudança no acesso.
       UPDATE public.billing_gateway_events SET status='processed',processed_at=now() WHERE event_id=p_event_id;
       RETURN jsonb_build_object('success',true,'ignored',true);
     END IF;
     UPDATE public.billing_gateway_events SET status='ignored',processed_at=now() WHERE event_id=p_event_id;
     RETURN jsonb_build_object('success',true,'ignored',true);
   END IF;
   IF o.status = 'canceled' THEN
     RAISE EXCEPTION 'payment received for canceled order requires reconciliation';
   END IF;
   IF o.kind='upgrade' THEN
     IF s.id IS DISTINCT FROM o.subscription_id OR s.version IS DISTINCT FROM o.expected_version
       OR s.status <> 'active' OR s.period_start > now() OR s.period_end <= now() OR s.period_end <> o.period_end THEN
       RAISE EXCEPTION 'stale upgrade requires reconciliation';
     END IF;
     IF array_position(ARRAY['dash','report','midia'],o.target_plan) <= array_position(ARRAY['dash','report','midia'],s.plan_type)
       THEN RAISE EXCEPTION 'not an upgrade'; END IF;
     prev := to_jsonb(s);
     INSERT INTO public.billing_credit_uses VALUES(o.id,s.id,s.version,o.credit_cents);
     UPDATE public.billing_subscriptions SET plan_type=o.target_plan,version=version+1,
       source_order_id=o.id WHERE id=s.id RETURNING id INTO sid;
   ELSE
     IF s.id IS NOT NULL AND s.status='active' AND s.period_end>now() THEN
       RAISE EXCEPTION 'active subscription already exists';
     END IF;
     IF o.period_end <= now() THEN RAISE EXCEPTION 'purchase expired'; END IF;
     prev := CASE WHEN s.id IS NULL THEN NULL ELSE to_jsonb(s) END;
     INSERT INTO public.billing_subscriptions(user_id,plan_type,status,period_start,period_end,
       payment_method,installment_count,installments_paid,source_order_id)
     VALUES(o.user_id,o.target_plan,next_status,
       o.period_start,o.period_end,o.payment_method,o.installment_count,1,o.id)
     ON CONFLICT(user_id) DO UPDATE SET plan_type=excluded.plan_type,status=excluded.status,
       period_start=excluded.period_start,period_end=excluded.period_end,payment_method=excluded.payment_method,
       installment_count=excluded.installment_count,installments_paid=1,
       source_order_id=excluded.source_order_id,version=billing_subscriptions.version+1
     RETURNING id INTO sid;
   END IF;
   INSERT INTO public.billing_plan_history(subscription_id,order_id,previous_state) VALUES(sid,o.id,prev);
   UPDATE public.billing_orders SET status='paid',subscription_id=sid WHERE id=o.id;
   UPDATE public.profiles SET plan_type=o.target_plan,updated_at=now() WHERE id=o.user_id;
   IF NOT FOUND THEN RAISE EXCEPTION 'profile missing; provision account before retry'; END IF;
 ELSIF canceled OR e.event_type='PAYMENT_OVERDUE' THEN
   IF canceled THEN UPDATE public.billing_orders SET status='canceled' WHERE id=o.id; END IF;
   -- Nunca um evento de pedido antigo altera a assinatura mais recente.
   IF s.source_order_id=o.id THEN
     IF canceled AND o.kind='upgrade' THEN
       SELECT previous_state INTO prev FROM public.billing_plan_history WHERE order_id=o.id;
       IF prev IS NOT NULL AND (prev->>'period_end')::timestamptz>now() AND EXISTS (
         SELECT 1 FROM public.billing_orders prior
         WHERE prior.id=(prev->>'source_order_id')::uuid AND prior.user_id=o.user_id AND prior.status='paid'
       ) THEN
         UPDATE public.billing_subscriptions SET plan_type=prev->>'plan_type',status=prev->>'status',
           source_order_id=(prev->>'source_order_id')::uuid,version=version+1 WHERE id=s.id;
         UPDATE public.profiles SET plan_type=prev->>'plan_type',updated_at=now() WHERE id=o.user_id;
         IF NOT FOUND THEN RAISE EXCEPTION 'profile missing'; END IF;
       ELSE
         UPDATE public.billing_subscriptions SET status='canceled',version=version+1 WHERE id=s.id;
         IF canceled THEN UPDATE public.profiles SET plan_type='gratis',updated_at=now() WHERE id=o.user_id; END IF;
       END IF;
     ELSE
       UPDATE public.billing_subscriptions SET status=CASE WHEN canceled THEN 'canceled' ELSE 'past_due' END,
         version=version+1 WHERE id=s.id;
       IF canceled THEN UPDATE public.profiles SET plan_type='gratis',updated_at=now() WHERE id=o.user_id; END IF;
     END IF;
   END IF;
 ELSE
   UPDATE public.billing_gateway_events SET status='ignored',processed_at=now() WHERE event_id=p_event_id;
   RETURN jsonb_build_object('success',true,'ignored',true);
 END IF;
 UPDATE public.billing_gateway_events SET status='processed',processed_at=now() WHERE event_id=p_event_id;
 RETURN jsonb_build_object('success',true,'orderId',o.id,'subscriptionId',coalesce(sid,s.id));
END $$;
REVOKE ALL ON FUNCTION public.billing_process_event(text) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.billing_process_event(text) TO service_role;

-- Limite concorrente: dono conta como primeira licenca; admite ate dois convidados.
CREATE FUNCTION public.billing_add_license(p_owner_id uuid,p_user_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,public AS $$
DECLARE s public.billing_subscriptions; n integer;
BEGIN
 IF auth.role() IS DISTINCT FROM 'service_role' THEN RAISE EXCEPTION 'service_role required'; END IF;
 SELECT * INTO s FROM public.billing_subscriptions WHERE user_id=p_owner_id FOR UPDATE;
 IF NOT FOUND OR s.plan_type<>'midia' OR s.status<>'active' OR s.period_start>now() OR s.period_end<=now()
 THEN RAISE EXCEPTION 'active midia subscription required'; END IF;
 IF p_user_id=p_owner_id THEN RETURN jsonb_build_object('success',true,'owner',true); END IF;
 IF EXISTS(SELECT 1 FROM public.billing_licenses WHERE subscription_id=s.id AND user_id=p_user_id)
 THEN RETURN jsonb_build_object('success',true,'duplicate',true); END IF;
 SELECT count(*) INTO n FROM public.billing_licenses WHERE subscription_id=s.id AND user_id<>p_owner_id;
 IF n>=2 THEN RAISE EXCEPTION 'three user limit reached'; END IF;
 INSERT INTO public.billing_licenses(subscription_id,user_id) VALUES(s.id,p_user_id);
 RETURN jsonb_build_object('success',true);
END $$;
REVOKE ALL ON FUNCTION public.billing_add_license(uuid,uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.billing_add_license(uuid,uuid) TO service_role;
COMMIT;

-- Preflight somente leitura: executar separadamente antes de aprovar indices legados.
-- SELECT asaas_payment_id,count(*) FROM public.crm_vendas WHERE asaas_payment_id IS NOT NULL
-- GROUP BY asaas_payment_id HAVING count(*)>1;
-- SELECT venda_id,count(*) FROM public.crm_clientes WHERE venda_id IS NOT NULL GROUP BY venda_id HAVING count(*)>1;
-- CREATE UNIQUE INDEX crm_vendas_asaas_payment_id_unique ON public.crm_vendas(asaas_payment_id) WHERE asaas_payment_id IS NOT NULL;
-- CREATE UNIQUE INDEX crm_clientes_venda_id_unique ON public.crm_clientes(venda_id) WHERE venda_id IS NOT NULL;
