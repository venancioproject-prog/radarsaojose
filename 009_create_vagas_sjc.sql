-- ============================================================================
-- RADAR SÃO JOSÉ DOS CAMPOS - TABELA DE VAGAS EM SÃO JOSÉ DOS CAMPOS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.vagas_sjc (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    titulo TEXT NOT NULL,
    empresa TEXT NOT NULL,
    localizacao TEXT DEFAULT 'São José dos Campos - SP',
    modalidade TEXT DEFAULT 'Presencial',
    tipo_contrato TEXT DEFAULT 'CLT',
    nivel TEXT DEFAULT 'Geral',
    descricao TEXT,
    link_candidatura TEXT NOT NULL,
    fonte TEXT DEFAULT 'Radar SJC',
    fonte_icone TEXT DEFAULT 'fa-briefcase',
    publicado_em TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    atualizado_em TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    destaque BOOLEAN DEFAULT FALSE,
    ativo BOOLEAN DEFAULT TRUE
);

-- Índices para buscas rápidas por cargo, empresa e status
CREATE INDEX IF NOT EXISTS idx_vagas_sjc_titulo ON public.vagas_sjc (titulo);
CREATE INDEX IF NOT EXISTS idx_vagas_sjc_empresa ON public.vagas_sjc (empresa);
CREATE INDEX IF NOT EXISTS idx_vagas_sjc_destaque ON public.vagas_sjc (destaque);
CREATE INDEX IF NOT EXISTS idx_vagas_sjc_publicado_em ON public.vagas_sjc (publicado_em DESC);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.vagas_sjc ENABLE ROW LEVEL SECURITY;

-- Política 1: Leitura pública e anônima permitida para todos os visitantes do portal
DROP POLICY IF EXISTS "Permitir leitura pública de vagas" ON public.vagas_sjc;
CREATE POLICY "Permitir leitura pública de vagas"
ON public.vagas_sjc FOR SELECT
USING (true);

-- Política 2: Inserção/Atualização via API pública (anônimo ou autenticado)
DROP POLICY IF EXISTS "Permitir sincronização de vagas" ON public.vagas_sjc;
CREATE POLICY "Permitir sincronização de vagas"
ON public.vagas_sjc FOR ALL
USING (true)
WITH CHECK (true);
