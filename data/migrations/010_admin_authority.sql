-- PROPOSTA: revisar e aplicar somente em ambiente de teste inicialmente.
-- Nenhuma dependencia de profiles.role ou metadados editaveis para administracao.
BEGIN;
CREATE OR REPLACE FUNCTION public.is_crm_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = pg_catalog
AS $$ SELECT coalesce(auth.role() = 'service_role' OR
  (auth.uid() IS NOT NULL AND (auth.jwt()->'app_metadata'->>'role' = 'admin'
   OR auth.jwt()->'app_metadata'->>'is_admin' = 'true')), false) $$;
REVOKE ALL ON FUNCTION public.is_crm_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_crm_admin() TO authenticated, service_role;

-- DDL de seguranca para public.profiles caso tabela nao exista previamente
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  nome text,
  role text DEFAULT 'usuario',
  plan_type text DEFAULT 'gratis',
  onboarding_completed boolean DEFAULT false,
  updated_at timestamptz DEFAULT now()
);

-- Garantir coluna updated_at para sincronizacao confiavel com RPC011
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Autoridade comercial sera escrita exclusivamente pelo backend/service_role.
DO $$
DECLARE cols text; col record;
BEGIN
 REVOKE INSERT, UPDATE, DELETE ON public.profiles FROM PUBLIC, anon, authenticated;
 -- Remover tambem grants antigos em nivel de coluna; revogar tabela nao os remove.
 FOR col IN SELECT column_name FROM information_schema.columns
   WHERE table_schema='public' AND table_name='profiles' LOOP
   EXECUTE format('REVOKE INSERT (%I), UPDATE (%I) ON public.profiles FROM PUBLIC, anon, authenticated', col.column_name, col.column_name);
 END LOOP;
 -- Lista positiva: nenhum campo futuro recebe permissao automaticamente.
 SELECT string_agg(quote_ident(column_name), ',') INTO cols
 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles'
 AND column_name IN ('nome','onboarding_completed','updated_at');
 IF cols IS NOT NULL THEN EXECUTE format('GRANT UPDATE (%s) ON public.profiles TO authenticated', cols); END IF;
 ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
 -- Restritiva combina com policies preexistentes: impede UPDATE de outro usuario.
 DROP POLICY IF EXISTS profiles_update_owner_guard ON public.profiles;
 CREATE POLICY profiles_update_owner_guard ON public.profiles AS RESTRICTIVE FOR UPDATE
 TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());
 DROP POLICY IF EXISTS profiles_update_owner ON public.profiles;
 CREATE POLICY profiles_update_owner ON public.profiles FOR UPDATE
 TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());
 GRANT SELECT ON public.profiles TO authenticated;
 DROP POLICY IF EXISTS profiles_select_owner_guard ON public.profiles;
 CREATE POLICY profiles_select_owner_guard ON public.profiles AS RESTRICTIVE FOR SELECT
 TO authenticated USING (id = auth.uid() OR public.is_crm_admin());
 DROP POLICY IF EXISTS profiles_select_owner ON public.profiles;
 CREATE POLICY profiles_select_owner ON public.profiles FOR SELECT
 TO authenticated USING (id = auth.uid() OR public.is_crm_admin());
 GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO service_role;
END $$;

-- Caminho seguro de onboarding por backend/trigger:
-- Quando novo usuario e cadastrado em auth.users, cria perfil inicial seguro
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nome, role, plan_type, onboarding_completed, updated_at)
  VALUES (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'nome', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    'usuario',
    'gratis',
    false,
    now()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Procedimento seguro para backend provisionar perfil sob demanda se ausente
CREATE OR REPLACE FUNCTION public.ensure_user_profile(p_user_id uuid, p_email text, p_nome text DEFAULT NULL)
RETURNS public.profiles LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, public AS $$
DECLARE prof public.profiles;
BEGIN
  IF auth.role() IS DISTINCT FROM 'service_role' THEN RAISE EXCEPTION 'service_role required'; END IF;
  INSERT INTO public.profiles (id, email, nome, role, plan_type, onboarding_completed, updated_at)
  VALUES (p_user_id, p_email, coalesce(p_nome, split_part(p_email, '@', 1)), 'usuario', 'gratis', false, now())
  ON CONFLICT (id) DO UPDATE SET email=excluded.email, updated_at=now()
  RETURNING * INTO prof;
  RETURN prof;
END;
$$;
REVOKE ALL ON FUNCTION public.ensure_user_profile(uuid, text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.ensure_user_profile(uuid, text, text) TO service_role;

COMMIT;
