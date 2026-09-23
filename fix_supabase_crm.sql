-- ============================================================================
-- RADAR SÃO JOSÉ DOS CAMPOS - CORREÇÃO DEFINITIVA DO CRM & POLÍTICAS RLS SUPABASE
-- ============================================================================
-- Execute todo o conteúdo deste arquivo no SQL Editor do Dashboard do Supabase.
-- Isso irá:
-- 1. Criar as tabelas crm_empresas, crm_pessoas, crm_oportunidades (se não existirem)
-- 2. Corrigir as políticas de Row Level Security (RLS) que causavam o erro 42501 (bloqueio de INSERT/SELECT)
-- 3. Habilitar inserção, leitura, atualização e exclusão para a aplicação pública e autenticada
-- 4. Criar a RPC crm_submit_intake_form para gravação atômica via Supabase
-- ============================================================================

-- 1. Habilitar extensão de UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabela: crm_empresas
CREATE TABLE IF NOT EXISTS public.crm_empresas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    cnpj TEXT,
    segmento TEXT,
    tamanho TEXT,
    relacao_sjc TEXT,
    cidade TEXT DEFAULT 'São José dos Campos',
    estado TEXT DEFAULT 'SP',
    site TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabela: crm_pessoas
CREATE TABLE IF NOT EXISTS public.crm_pessoas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    whatsapp TEXT,
    perfil TEXT NOT NULL DEFAULT 'Profissional de empresa',
    cidade_mora TEXT,
    cidade_trabalha TEXT,
    relacao_sjc JSONB DEFAULT '[]'::jsonb NOT NULL,
    motivo_entrada TEXT,
    motivo_entrada_detalhe TEXT,
    tem_decisao BOOLEAN DEFAULT FALSE NOT NULL,
    potencial_respondente BOOLEAN DEFAULT FALSE NOT NULL,
    perfil_respondente TEXT,
    origem TEXT DEFAULT 'Site' NOT NULL,
    campanha TEXT,
    auth_provider TEXT DEFAULT 'email',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tabela: crm_oportunidades (Pipeline Comercial & Decisões)
CREATE TABLE IF NOT EXISTS public.crm_oportunidades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pessoa_id UUID REFERENCES public.crm_pessoas(id) ON DELETE CASCADE,
    empresa_id UUID REFERENCES public.crm_empresas(id) ON DELETE SET NULL,
    titulo TEXT NOT NULL,
    tipo_decisao TEXT,
    outra_decisao TEXT,
    projeto_nome TEXT,
    regiao_bairro TEXT,
    estagio_projeto TEXT,
    prazo_decisao TEXT,
    faixa_valor TEXT,
    pergunta_principal TEXT,
    perguntas_secundarias TEXT,
    etapa_pipeline TEXT NOT NULL DEFAULT 'Lead novo',
    prioridade_sla TEXT DEFAULT 'Normal',
    responsavel TEXT DEFAULT 'Leonardo Venâncio',
    proximo_passo TEXT DEFAULT 'Realizar primeiro contato e validar contexto',
    data_proximo_passo TIMESTAMPTZ DEFAULT (timezone('utc'::text, now()) + INTERVAL '1 day'),
    status TEXT NOT NULL DEFAULT 'Ativa',
    origem TEXT DEFAULT 'Formulário Radar Inbound' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Tabela: crm_empresa_pessoas (Vínculo)
CREATE TABLE IF NOT EXISTS public.crm_empresa_pessoas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.crm_empresas(id) ON DELETE CASCADE,
    pessoa_id UUID NOT NULL REFERENCES public.crm_pessoas(id) ON DELETE CASCADE,
    cargo TEXT,
    papel_decisao TEXT DEFAULT 'Participa da decisão',
    is_principal BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(empresa_id, pessoa_id)
);

-- 6. Tabela: crm_atividades (Histórico de Interações)
CREATE TABLE IF NOT EXISTS public.crm_atividades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    oportunidade_id UUID NOT NULL REFERENCES public.crm_oportunidades(id) ON DELETE CASCADE,
    tipo TEXT NOT NULL DEFAULT 'Observação',
    observacao TEXT NOT NULL,
    responsavel TEXT NOT NULL DEFAULT 'Sistema',
    resultado TEXT,
    data_atividade TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================================
-- DESBLOQUEIO DE SEGURANÇA (RLS POLICIES) - RESOLVE O ERRO 42501
-- ============================================================================

-- Desabilitar ou configurar políticas permissivas para o funcionamento do CRM e Onboarding
ALTER TABLE public.crm_empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_pessoas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_oportunidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_empresa_pessoas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_atividades ENABLE ROW LEVEL SECURITY;

-- Limpar políticas antigas
DROP POLICY IF EXISTS "Permitir_Select_Empresas" ON public.crm_empresas;
DROP POLICY IF EXISTS "Permitir_Insert_Empresas" ON public.crm_empresas;
DROP POLICY IF EXISTS "Permitir_Update_Empresas" ON public.crm_empresas;
DROP POLICY IF EXISTS "Permitir_Delete_Empresas" ON public.crm_empresas;
DROP POLICY IF EXISTS "Permitir_Tudo_Empresas" ON public.crm_empresas;

DROP POLICY IF EXISTS "Permitir_Select_Pessoas" ON public.crm_pessoas;
DROP POLICY IF EXISTS "Permitir_Insert_Pessoas" ON public.crm_pessoas;
DROP POLICY IF EXISTS "Permitir_Update_Pessoas" ON public.crm_pessoas;
DROP POLICY IF EXISTS "Permitir_Delete_Pessoas" ON public.crm_pessoas;
DROP POLICY IF EXISTS "Permitir_Tudo_Pessoas" ON public.crm_pessoas;

DROP POLICY IF EXISTS "Permitir_Select_Oportunidades" ON public.crm_oportunidades;
DROP POLICY IF EXISTS "Permitir_Insert_Oportunidades" ON public.crm_oportunidades;
DROP POLICY IF EXISTS "Permitir_Update_Oportunidades" ON public.crm_oportunidades;
DROP POLICY IF EXISTS "Permitir_Delete_Oportunidades" ON public.crm_oportunidades;
DROP POLICY IF EXISTS "Permitir_Tudo_Oportunidades" ON public.crm_oportunidades;

-- Criar políticas globais que autorizam anon e authenticated
CREATE POLICY "Permitir_Tudo_Empresas" ON public.crm_empresas FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);
CREATE POLICY "Permitir_Tudo_Pessoas" ON public.crm_pessoas FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);
CREATE POLICY "Permitir_Tudo_Oportunidades" ON public.crm_oportunidades FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);
CREATE POLICY "Permitir_Tudo_EmpresaPessoas" ON public.crm_empresa_pessoas FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);
CREATE POLICY "Permitir_Tudo_Atividades" ON public.crm_atividades FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);

-- Conceder permissões explícitas aos papéis de conexão
GRANT ALL ON public.crm_empresas TO anon, authenticated, service_role;
GRANT ALL ON public.crm_pessoas TO anon, authenticated, service_role;
GRANT ALL ON public.crm_oportunidades TO anon, authenticated, service_role;
GRANT ALL ON public.crm_empresa_pessoas TO anon, authenticated, service_role;
GRANT ALL ON public.crm_atividades TO anon, authenticated, service_role;

-- 7. Função RPC atômica crm_submit_intake_form com SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.crm_submit_intake_form(
    p_nome TEXT,
    p_email TEXT,
    p_whatsapp TEXT DEFAULT NULL,
    p_perfil TEXT DEFAULT 'Profissional de empresa',
    p_cidade_mora TEXT DEFAULT 'São José dos Campos',
    p_cidade_trabalha TEXT DEFAULT NULL,
    p_relacao_sjc JSONB DEFAULT '[]'::jsonb,
    p_motivo_entrada TEXT DEFAULT NULL,
    p_motivo_entrada_detalhe TEXT DEFAULT NULL,
    p_empresa_nome TEXT DEFAULT NULL,
    p_cargo TEXT DEFAULT NULL,
    p_segmento TEXT DEFAULT NULL,
    p_tamanho TEXT DEFAULT NULL,
    p_empresa_relacao_sjc TEXT DEFAULT NULL,
    p_tem_decisao BOOLEAN DEFAULT FALSE,
    p_tipo_decisao TEXT DEFAULT NULL,
    p_outra_decisao TEXT DEFAULT NULL,
    p_projeto_nome TEXT DEFAULT NULL,
    p_regiao_bairro TEXT DEFAULT NULL,
    p_estagio_projeto TEXT DEFAULT NULL,
    p_prazo_decisao TEXT DEFAULT NULL,
    p_faixa_valor TEXT DEFAULT NULL,
    p_pergunta_principal TEXT DEFAULT NULL,
    p_perguntas_secundarias TEXT DEFAULT NULL,
    p_origem TEXT DEFAULT 'Formulário Radar Inbound'
)
RETURNS JSONB AS $$
DECLARE
    v_pessoa_id UUID;
    v_empresa_id UUID := NULL;
    v_oportunidade_id UUID := NULL;
    v_prioridade TEXT := 'Normal';
BEGIN
    -- 1. Deduplicação e Gravação de Pessoa
    INSERT INTO public.crm_pessoas (
        nome, email, whatsapp, perfil, cidade_mora, cidade_trabalha, 
        relacao_sjc, motivo_entrada, motivo_entrada_detalhe, tem_decisao, 
        potencial_respondente, perfil_respondente, origem
    ) VALUES (
        p_nome, LOWER(TRIM(p_email)), p_whatsapp, p_perfil, p_cidade_mora, p_cidade_trabalha,
        p_relacao_sjc, p_motivo_entrada, p_motivo_entrada_detalhe, p_tem_decisao,
        (NOT p_tem_decisao), p_perfil, p_origem
    )
    ON CONFLICT (email) DO UPDATE SET
        nome = EXCLUDED.nome,
        whatsapp = COALESCE(EXCLUDED.whatsapp, public.crm_pessoas.whatsapp),
        perfil = EXCLUDED.perfil,
        cidade_mora = COALESCE(EXCLUDED.cidade_mora, public.crm_pessoas.cidade_mora),
        cidade_trabalha = COALESCE(EXCLUDED.cidade_trabalha, public.crm_pessoas.cidade_trabalha),
        relacao_sjc = EXCLUDED.relacao_sjc,
        motivo_entrada = EXCLUDED.motivo_entrada,
        motivo_entrada_detalhe = EXCLUDED.motivo_entrada_detalhe,
        tem_decisao = (public.crm_pessoas.tem_decisao OR EXCLUDED.tem_decisao),
        updated_at = timezone('utc'::text, now())
    RETURNING id INTO v_pessoa_id;

    -- 2. Deduplicação e Gravação de Empresa (se fornecida)
    IF p_empresa_nome IS NOT NULL AND TRIM(p_empresa_nome) <> '' THEN
        SELECT id INTO v_empresa_id FROM public.crm_empresas 
        WHERE LOWER(TRIM(nome)) = LOWER(TRIM(p_empresa_nome)) LIMIT 1;

        IF v_empresa_id IS NULL THEN
            INSERT INTO public.crm_empresas (nome, segmento, tamanho, relacao_sjc)
            VALUES (TRIM(p_empresa_nome), p_segmento, p_tamanho, p_empresa_relacao_sjc)
            RETURNING id INTO v_empresa_id;
        END IF;

        INSERT INTO public.crm_empresa_pessoas (empresa_id, pessoa_id, cargo, is_principal)
        VALUES (v_empresa_id, v_pessoa_id, p_cargo, TRUE)
        ON CONFLICT (empresa_id, pessoa_id) DO UPDATE SET
            cargo = COALESCE(EXCLUDED.cargo, public.crm_empresa_pessoas.cargo);
    END IF;

    -- 3. Gravação da Oportunidade Comercial
    IF p_tem_decisao = TRUE OR (p_pergunta_principal IS NOT NULL AND TRIM(p_pergunta_principal) <> '') THEN
        IF p_prazo_decisao = 'Já estou decidindo' THEN
            v_prioridade := 'Alta';
        ELSIF p_prazo_decisao = 'Próximos 30 dias' THEN
            v_prioridade := 'Média';
        ELSE
            v_prioridade := 'Normal';
        END IF;

        INSERT INTO public.crm_oportunidades (
            pessoa_id, empresa_id, titulo, tipo_decisao, outra_decisao, 
            projeto_nome, regiao_bairro, estagio_projeto, prazo_decisao, 
            faixa_valor, pergunta_principal, perguntas_secundarias, 
            etapa_pipeline, prioridade_sla, responsavel, proximo_passo, 
            status, origem
        ) VALUES (
            v_pessoa_id, v_empresa_id, 
            COALESCE(p_projeto_nome, p_tipo_decisao, 'Decisão Comercial - ' || p_nome),
            p_tipo_decisao, p_outra_decisao, p_projeto_nome, p_regiao_bairro,
            p_estagio_projeto, p_prazo_decisao, p_faixa_valor,
            COALESCE(TRIM(p_pergunta_principal), 'Decisão em andamento'), p_perguntas_secundarias,
            'Lead novo', v_prioridade, 'Leonardo Venâncio',
            'Realizar primeiro contato e validar contexto',
            'Ativa', p_origem
        )
        RETURNING id INTO v_oportunidade_id;

        INSERT INTO public.crm_atividades (
            oportunidade_id, tipo, observacao, responsavel, resultado
        ) VALUES (
            v_oportunidade_id, 'Observação', 
            'Cadastro Inbound recebido com sinal comercial.',
            'Sistema', 'Aguardando primeiro contato'
        );
    END IF;

    RETURN jsonb_build_object(
        'success', TRUE,
        'pessoa_id', v_pessoa_id,
        'empresa_id', v_empresa_id,
        'oportunidade_id', v_oportunidade_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
