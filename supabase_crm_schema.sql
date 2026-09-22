-- ============================================================================
-- RADAR SÃO JOSÉ DOS CAMPOS - SCHEMA DO CRM COMERCIAL & QUALIFICAÇÃO (MVP)
-- Banco de Dados: PostgreSQL / Supabase
-- Especificação Técnica: CRM Radar São José v1.1
-- ============================================================================

-- 1. Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- ----------------------------------------------------------------------------
-- 2. TABELA: crm_empresas (Organizações / Pessoas Jurídicas)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.crm_empresas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    cnpj TEXT UNIQUE,
    segmento TEXT, -- Imobiliário, Varejo, Tecnologia, Indústria, Saúde, Serviços, etc.
    tamanho TEXT, -- 1 a 5, 6 a 20, 21 a 50, 51 a 200, 200+
    relacao_sjc TEXT, -- Já atua em SJC, Está entrando, Expandindo, Estudando, Já atuou, Outro
    cidade TEXT DEFAULT 'São José dos Campos',
    estado TEXT DEFAULT 'SP',
    site TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ----------------------------------------------------------------------------
-- 3. TABELA: crm_pessoas (Indivíduos / Contatos / Usuários do Radar)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.crm_pessoas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID, -- Referência opcional para auth.users do Supabase
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE, -- Chave mestra de deduplicação
    whatsapp TEXT,
    perfil TEXT NOT NULL DEFAULT 'Profissional de empresa', -- Empresário, Empreendedor, Estudante, etc.
    cidade_mora TEXT,
    cidade_trabalha TEXT,
    relacao_sjc JSONB DEFAULT '[]'::jsonb NOT NULL, -- Array: ["Moro na cidade", "Trabalho na cidade", ...]
    motivo_entrada TEXT, -- Conhecer melhor, Pesquisar mercado, Apoiar decisão, etc.
    motivo_entrada_detalhe TEXT, -- Texto livre adicional
    tem_decisao BOOLEAN DEFAULT FALSE NOT NULL, -- Flag divisora (Sim vs Não)
    potencial_respondente BOOLEAN DEFAULT FALSE NOT NULL, -- Fluxo de Pesquisa
    perfil_respondente TEXT,
    origem TEXT DEFAULT 'Site' NOT NULL, -- Site, Formulário, Instagram, LinkedIn, Prospecção, etc.
    campanha TEXT, -- Ex: Lançamento Radar 2026
    auth_provider TEXT DEFAULT 'email', -- email, google, manual
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ----------------------------------------------------------------------------
-- 4. TABELA: crm_empresa_pessoas (Vínculo N:N Pessoa <-> Empresa com Papel)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.crm_empresa_pessoas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID NOT NULL REFERENCES public.crm_empresas(id) ON DELETE CASCADE,
    pessoa_id UUID NOT NULL REFERENCES public.crm_pessoas(id) ON DELETE CASCADE,
    cargo TEXT, -- Sócio, CEO, Diretor, Gerente, Coordenador, etc.
    papel_decisao TEXT DEFAULT 'Participa da decisão', -- Tomador, Participa, Influencia, Usuário, Pesquisador
    is_principal BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(empresa_id, pessoa_id)
);

-- ----------------------------------------------------------------------------
-- 5. TABELA: crm_oportunidades (Decisões Comerciais Concretas)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.crm_oportunidades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pessoa_id UUID NOT NULL REFERENCES public.crm_pessoas(id) ON DELETE RESTRICT,
    empresa_id UUID REFERENCES public.crm_empresas(id) ON DELETE SET NULL,
    titulo TEXT NOT NULL,
    
    -- Bloco de Decisão & Projeto
    tipo_decisao TEXT, -- Abrir unidade, Expandir, Escolher bairro, Novo empreendimento, etc.
    outra_decisao TEXT,
    projeto_nome TEXT,
    regiao_bairro TEXT,
    estagio_projeto TEXT, -- Ideia, Estudo, Planejamento, Aprovação, Execução, Operação, Expansão, Revisão
    prazo_decisao TEXT, -- Já estou decidindo, Próximos 30 dias, 31-90 dias, 3-6 meses, 6-12 meses, +12 meses, Sem prazo
    faixa_valor TEXT, -- Até 100k, 100k-500k, 500k-1M, 1M-5M, 5M-20M, +20M, Não sei, Não informar
    
    -- Perguntas do Cliente (A pergunta principal é sagrada e nunca sobrescrita)
    problema_declarado TEXT,
    pergunta_principal TEXT NOT NULL, -- O que você precisa descobrir para tomar essa decisão?
    perguntas_secundarias TEXT,
    o_que_ja_sabe TEXT,
    o_que_precisa_descobrir TEXT,
    o_que_radar_respondeu TEXT, -- Registro de fit de produto
    
    -- Pipeline Comercial & SLA
    etapa_pipeline TEXT NOT NULL DEFAULT 'Lead novo' CHECK (etapa_pipeline IN (
        'Lead novo', 'Qualificação', 'Oportunidade', 'Diagnóstico', 
        'Proposta', 'Negociação', 'Ganho', 'Perdido'
    )),
    destino_qualificacao TEXT, -- Radar faz sentido, Compra direta, Pesquisa personalizada, Consultoria, Sem fit, etc.
    produto_servico TEXT DEFAULT 'Radar São José',
    responsavel TEXT DEFAULT 'Leonardo Venâncio',
    prioridade_sla TEXT DEFAULT 'Normal' CHECK (prioridade_sla IN ('Alta', 'Média', 'Normal', 'Nutrição')),
    proximo_passo TEXT DEFAULT 'Realizar contato inicial e qualificação',
    data_proximo_passo TIMESTAMPTZ DEFAULT (timezone('utc'::text, now()) + INTERVAL '1 day'),
    
    -- Perda & Reativação
    motivo_perda TEXT, -- Preço, Sem orçamento, Sem prioridade, Adiado, Cancelado, Outro concorrente, Sem fit, Sem retorno, Outro
    motivo_perda_obs TEXT,
    data_reativacao TIMESTAMPTZ,
    
    status TEXT NOT NULL DEFAULT 'Ativa' CHECK (status IN ('Ativa', 'Ganha', 'Perdida', 'Não avançou', 'Reativação')),
    origem TEXT DEFAULT 'Formulário Radar' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ----------------------------------------------------------------------------
-- 6. TABELA: crm_atividades (Histórico / Timeline de Interações)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.crm_atividades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    oportunidade_id UUID NOT NULL REFERENCES public.crm_oportunidades(id) ON DELETE CASCADE,
    tipo TEXT NOT NULL CHECK (tipo IN (
        'Ligação', 'WhatsApp', 'E-mail', 'Reunião', 
        'Apresentação', 'Proposta enviada', 'Pagamento', 'Observação'
    )),
    observacao TEXT NOT NULL,
    responsavel TEXT NOT NULL,
    resultado TEXT, -- Sem resposta, Reunião agendada, Proposta aceita, etc.
    data_atividade TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ----------------------------------------------------------------------------
-- 7. TABELA: crm_propostas (Ofertas Comerciais)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.crm_propostas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    oportunidade_id UUID NOT NULL REFERENCES public.crm_oportunidades(id) ON DELETE CASCADE,
    produto_servico TEXT NOT NULL DEFAULT 'Radar São José - Licença Anual',
    valor_proposto NUMERIC(12,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'Em elaboração' CHECK (status IN (
        'Em elaboração', 'Enviada', 'Em avaliação', 'Negociação', 'Aceita', 'Recusada', 'Expirada'
    )),
    responsavel TEXT NOT NULL,
    observacoes TEXT,
    data_envio TIMESTAMPTZ,
    data_validade TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ----------------------------------------------------------------------------
-- 8. TABELA: crm_vendas (Conversões & Fechamento)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.crm_vendas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    oportunidade_id UUID NOT NULL REFERENCES public.crm_oportunidades(id) ON DELETE RESTRICT,
    empresa_id UUID REFERENCES public.crm_empresas(id),
    pessoa_id UUID NOT NULL REFERENCES public.crm_pessoas(id),
    produto_servico TEXT NOT NULL,
    valor_proposto NUMERIC(12,2) NOT NULL,
    valor_fechado NUMERIC(12,2) NOT NULL,
    diferenca NUMERIC(12,2) GENERATED ALWAYS AS (valor_proposto - valor_fechado) STORED,
    forma_pagamento TEXT DEFAULT 'Asaas PIX/Cartão',
    asaas_payment_id TEXT,
    asaas_customer_id TEXT,
    status_pagamento TEXT DEFAULT 'Pendente' CHECK (status_pagamento IN ('Pendente', 'Aprovado', 'Cancelado', 'Reembolsado')),
    responsavel TEXT NOT NULL,
    aprovador TEXT,
    data_venda TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    data_pagamento TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ----------------------------------------------------------------------------
-- 9. TABELA: crm_clientes (Contratos Ativos & Assinantes)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.crm_clientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id UUID REFERENCES public.crm_empresas(id) ON DELETE SET NULL,
    pessoa_id UUID NOT NULL REFERENCES public.crm_pessoas(id) ON DELETE RESTRICT,
    venda_id UUID REFERENCES public.crm_vendas(id) ON DELETE SET NULL,
    produto TEXT NOT NULL DEFAULT 'Radar São José',
    valor_total NUMERIC(12,2) NOT NULL,
    quantidade_acessos INTEGER NOT NULL DEFAULT 1,
    inicio_acesso DATE NOT NULL DEFAULT CURRENT_DATE,
    fim_acesso DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '1 year'),
    status TEXT NOT NULL DEFAULT 'Ativo' CHECK (status IN ('Ativo', 'Expirado', 'Suspenso', 'Cancelado')),
    onboarding_status TEXT DEFAULT 'Pendente' CHECK (onboarding_status IN ('Pendente', 'Agendado', 'Realizado', 'Dispensado')),
    onboarding_data TIMESTAMPTZ,
    onboarding_responsavel TEXT,
    onboarding_notas TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ----------------------------------------------------------------------------
-- 10. TABELA: crm_acessos (Licenças Individuais de Usuários)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.crm_acessos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id UUID NOT NULL REFERENCES public.crm_clientes(id) ON DELETE CASCADE,
    pessoa_id UUID NOT NULL REFERENCES public.crm_pessoas(id) ON DELETE CASCADE,
    produto TEXT NOT NULL DEFAULT 'Radar São José',
    inicio_acesso DATE NOT NULL DEFAULT CURRENT_DATE,
    fim_acesso DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '1 year'),
    status TEXT NOT NULL DEFAULT 'Ativo' CHECK (status IN ('Ativo', 'Expirado', 'Suspenso')),
    primeiro_acesso TIMESTAMPTZ,
    ultimo_acesso TIMESTAMPTZ,
    total_logins INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ----------------------------------------------------------------------------
-- 11. TABELA: crm_audit_logs (Trilha de Auditoria & Alterações Críticas)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.crm_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tabela TEXT NOT NULL,
    registro_id UUID NOT NULL,
    campo_alterado TEXT NOT NULL,
    valor_anterior TEXT,
    valor_novo TEXT,
    alterado_por TEXT NOT NULL DEFAULT 'Sistema',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ----------------------------------------------------------------------------
-- 12. ÍNDICES DE PERFORMANCE E BUSCA
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_crm_pessoas_email ON public.crm_pessoas(email);
CREATE INDEX IF NOT EXISTS idx_crm_pessoas_tem_decisao ON public.crm_pessoas(tem_decisao);
CREATE INDEX IF NOT EXISTS idx_crm_empresas_nome ON public.crm_empresas(nome);
CREATE INDEX IF NOT EXISTS idx_crm_oportunidades_etapa ON public.crm_oportunidades(etapa_pipeline);
CREATE INDEX IF NOT EXISTS idx_crm_oportunidades_status ON public.crm_oportunidades(status);
CREATE INDEX IF NOT EXISTS idx_crm_oportunidades_responsavel ON public.crm_oportunidades(responsavel);
CREATE INDEX IF NOT EXISTS idx_crm_oportunidades_data_prox ON public.crm_oportunidades(data_proximo_passo);
CREATE INDEX IF NOT EXISTS idx_crm_clientes_status ON public.crm_clientes(status);
CREATE INDEX IF NOT EXISTS idx_crm_acessos_pessoa_id ON public.crm_acessos(pessoa_id);

-- ----------------------------------------------------------------------------
-- 13. TRIGGERS AUTOMÁTICOS (Updated At & Logs)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_crm_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_crm_pessoas_updated_at ON public.crm_pessoas;
CREATE TRIGGER tr_crm_pessoas_updated_at
    BEFORE UPDATE ON public.crm_pessoas
    FOR EACH ROW EXECUTE FUNCTION public.handle_crm_updated_at();

DROP TRIGGER IF EXISTS tr_crm_empresas_updated_at ON public.crm_empresas;
CREATE TRIGGER tr_crm_empresas_updated_at
    BEFORE UPDATE ON public.crm_empresas
    FOR EACH ROW EXECUTE FUNCTION public.handle_crm_updated_at();

DROP TRIGGER IF EXISTS tr_crm_oportunidades_updated_at ON public.crm_oportunidades;
CREATE TRIGGER tr_crm_oportunidades_updated_at
    BEFORE UPDATE ON public.crm_oportunidades
    FOR EACH ROW EXECUTE FUNCTION public.handle_crm_updated_at();

DROP TRIGGER IF EXISTS tr_crm_clientes_updated_at ON public.crm_clientes;
CREATE TRIGGER tr_crm_clientes_updated_at
    BEFORE UPDATE ON public.crm_clientes
    FOR EACH ROW EXECUTE FUNCTION public.handle_crm_updated_at();

-- ----------------------------------------------------------------------------
-- 14. FUNÇÃO DE INTAKE / ENTRADA DETERMINÍSTICA DO FORMULÁRIO (UPSERT)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.crm_submit_intake_form(
    p_nome TEXT,
    p_email TEXT,
    p_whatsapp TEXT,
    p_perfil TEXT,
    p_cidade_mora TEXT,
    p_cidade_trabalha TEXT,
    p_relacao_sjc JSONB,
    p_motivo_entrada TEXT,
    p_motivo_entrada_detalhe TEXT,
    p_empresa_nome TEXT,
    p_cargo TEXT,
    p_segmento TEXT,
    p_tamanho TEXT,
    p_empresa_relacao_sjc TEXT,
    p_tem_decisao BOOLEAN,
    p_tipo_decisao TEXT,
    p_outra_decisao TEXT,
    p_projeto_nome TEXT,
    p_regiao_bairro TEXT,
    p_estagio_projeto TEXT,
    p_prazo_decisao TEXT,
    p_faixa_valor TEXT,
    p_pergunta_principal TEXT,
    p_perguntas_secundarias TEXT,
    p_origem TEXT DEFAULT 'Formulário Radar'
)
RETURNS JSONB AS $$
DECLARE
    v_pessoa_id UUID;
    v_empresa_id UUID := NULL;
    v_oportunidade_id UUID := NULL;
    v_prioridade TEXT := 'Normal';
BEGIN
    -- 1. Deduplicação e Criação/Atualização de Pessoa
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

    -- 2. Deduplicação e Criação/Atualização de Empresa (quando fornecida)
    IF p_empresa_nome IS NOT NULL AND TRIM(p_empresa_nome) <> '' THEN
        SELECT id INTO v_empresa_id FROM public.crm_empresas 
        WHERE LOWER(TRIM(nome)) = LOWER(TRIM(p_empresa_nome)) LIMIT 1;

        IF v_empresa_id IS NULL THEN
            INSERT INTO public.crm_empresas (nome, segmento, tamanho, relacao_sjc)
            VALUES (TRIM(p_empresa_nome), p_segmento, p_tamanho, p_empresa_relacao_sjc)
            RETURNING id INTO v_empresa_id;
        END IF;

        -- Vincula Pessoa <-> Empresa
        INSERT INTO public.crm_empresa_pessoas (empresa_id, pessoa_id, cargo, is_principal)
        VALUES (v_empresa_id, v_pessoa_id, p_cargo, TRUE)
        ON CONFLICT (empresa_id, pessoa_id) DO UPDATE SET
            cargo = COALESCE(EXCLUDED.cargo, public.crm_empresa_pessoas.cargo);
    END IF;

    -- 3. Criação de Oportunidade / Lead Comercial (Apenas se houver decisão)
    IF p_tem_decisao = TRUE AND p_pergunta_principal IS NOT NULL AND TRIM(p_pergunta_principal) <> '' THEN
        -- Determina SLA determinístico
        IF p_prazo_decisao = 'Já estou decidindo' OR p_faixa_valor IN ('R$ 1 milhão a R$ 5 milhões', 'R$ 5 milhões a R$ 20 milhões', 'Acima de R$ 20 milhões') THEN
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
            data_proximo_passo, status, origem
        ) VALUES (
            v_pessoa_id, v_empresa_id, 
            COALESCE(p_projeto_nome, p_tipo_decisao, 'Decisão Comercial - ' || p_nome),
            p_tipo_decisao, p_outra_decisao, p_projeto_nome, p_regiao_bairro,
            p_estagio_projeto, p_prazo_decisao, p_faixa_valor,
            TRIM(p_pergunta_principal), p_perguntas_secundarias,
            'Lead novo', v_prioridade, 'Leonardo Venâncio',
            'Realizar primeiro contato e validar contexto',
            (timezone('utc'::text, now()) + CASE WHEN v_prioridade = 'Alta' THEN INTERVAL '15 minutes' ELSE INTERVAL '4 hours' END),
            'Ativa', p_origem
        )
        RETURNING id INTO v_oportunidade_id;

        -- Registra primeira atividade no histórico
        INSERT INTO public.crm_atividades (
            oportunidade_id, tipo, observacao, responsavel, resultado
        ) VALUES (
            v_oportunidade_id, 'Observação', 
            'Cadastro Inbound recebido com sinal comercial. Pergunta declarada: "' || TRIM(p_pergunta_principal) || '"',
            'Sistema', 'Aguardando primeiro contato'
        );
    END IF;

    RETURN jsonb_build_object(
        'success', TRUE,
        'pessoa_id', v_pessoa_id,
        'empresa_id', v_empresa_id,
        'oportunidade_id', v_oportunidade_id,
        'tem_decisao', p_tem_decisao
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ----------------------------------------------------------------------------
-- 15. DADOS DE TESTE INICIAIS (SEEDS PARA O MVP)
-- ----------------------------------------------------------------------------
INSERT INTO public.crm_empresas (nome, segmento, tamanho, relacao_sjc) VALUES
('Construvale Engenharia', 'Imobiliário', '51 a 200', 'Já atua em São José'),
('TechnoPark Ventures', 'Tecnologia', '21 a 50', 'Está expandindo em São José')
ON CONFLICT DO NOTHING;

INSERT INTO public.crm_pessoas (nome, email, whatsapp, perfil, cidade_mora, cidade_trabalha, relacao_sjc, motivo_entrada, tem_decisao, origem) VALUES
('Camila Rodrigues', 'camila.imob@construvale.com.br', '(12) 98123-4567', 'Empresário', 'São José dos Campos', 'São José dos Campos', '["Moro na cidade", "Tenho empresa na cidade"]'::jsonb, 'Apoiar uma decisão profissional', TRUE, 'Formulário Radar'),
('Ricardo Santos', 'ricardo@technopark.io', '(11) 97654-3210', 'Profissional de empresa', 'São Paulo', 'São José dos Campos', '["Trabalho na cidade", "Pretendo investir na cidade"]'::jsonb, 'Avaliar um projeto', TRUE, 'LinkedIn')
ON CONFLICT (email) DO NOTHING;
