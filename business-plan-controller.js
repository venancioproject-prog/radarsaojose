// =========================================================================
// RADAR SÃO JOSÉ - CONTROLADOR DO PLANO DE NEGÓCIOS SEBRAE & MONDAY.COM
// Versão: 2026.2-executive
// Desenvolvido para: Leonardo Venâncio & Mayumi Nagano
// =========================================================================

const PLAN_STORAGE_KEY_V5 = 'radarsaojose_business_plan_sebrae_v5';

// Dados Oficiais Padronizados baseados no Documento-Base (Setembro/2026)
const DEFAULT_BUSINESS_PLAN_DATA = {
  id: "plan-radar-sjc-2026",
  title: "Plano de Negócios & Planejamento Estratégico Oficial • Radar São José",
  company_name: "Radar São José Tecnologia e Inteligência Territorial Ltda",
  cnpj: "58.291.442/0001-90",
  version: "2026.1-oficial",
  updated_at: new Date().toISOString(),
  
  executive_summary: {
    business_description: "O Radar São José é um negócio de inteligência territorial que transforma conhecimento sobre São José dos Campos em produtos e serviços para empresas e organizações que precisam compreender o território para tomar decisões estratégicas seguras. O produto principal é a plataforma anual Radar São José (R$ 12.000/12 meses), complementada pelo Radar Aberto gratuito e serviços de Inteligência Aplicada e Pesquisa Personalizada sob demanda.",
    mission: "Tornar o território de São José dos Campos plenamente compreensível e ajudar empresas e líderes a fazerem perguntas melhores, enxergando dinâmicas invisíveis para reduzir riscos e acelerar decisões com base em dados reais.",
    legal_form: "Sociedade Limitada (LTDA)",
    tax_regime: "Simples Nacional",
    tax_detail: "Anexo III e V (Serviços de Tecnologia da Informação, Tratamento de Dados e Pesquisas de Mercado).",
    sectors: ["Serviços", "Tecnologia da Informação e Dados"],
    location: "Operação 100% digital, com base territorial e de inteligência em São José dos Campos - SP (hoje sediado na estrutura do Studio 8, em transição para ativo empresarial independente).",
    funding_sources: "Recursos próprios dos sócios fundadores (Leonardo Venâncio e Mayumi Nagano), complementados por reinvestimento de 100% do fluxo de caixa gerado nos primeiros 12 meses."
  },

  partners: [
    {
      id: "partner-leo",
      name: "Leonardo Venâncio",
      role: "Sócio Administrador (CEO) & Head de Inteligência",
      email: "venancio.project@gmail.com",
      phone: "(12) 98100-0000",
      avatar: "fotos_radar/LEONARDO.jpeg",
      city_state: "São José dos Campos - SP",
      address: "São José dos Campos - SP",
      profile_bio: "Especialista em inteligência de dados, modelagem computacional, arquitetura de software e estratégias comerciais de escala SaaS.",
      responsibilities: "Direção executiva, arquitetura técnica de produto, expansão comercial, relacionamento B2B e captação de grandes contas.",
      capital_value: 30000,
      capital_percent: 60
    },
    {
      id: "partner-may",
      name: "Mayumi Nagano",
      role: "Sócia & Head de Pesquisa e Conteúdo",
      email: "mayumi.nagano@radarsaojose.com.br",
      phone: "(12) 99200-0000",
      avatar: "fotos_radar/mayumi.jpg",
      city_state: "São José dos Campos - SP",
      address: "São José dos Campos - SP",
      profile_bio: "Pesquisadora social, especialista em investigação territorial, comportamento do consumidor local e jornalismo de dados com ampla vivência em SJC.",
      responsibilities: "Coordenação de pesquisa de campo, redação e análise das 10 personas territoriais, produção de conteúdo do blog, curadoria do Radar Clipping e ativação pedagógica de novos assinantes.",
      capital_value: 20000,
      capital_percent: 40
    }
  ],

  market_analysis: {
    client_personas: "Diretores e donos de clínicas médicas, colégios particulares, construtoras/incorporadoras, corretores de alto padrão e donos de redes de varejo de São José dos Campos que investem em novos pontos e expansão.",
    client_behavior: "Hoje decidem por intuição ('achismo') ou buscam consultorias nacionais caras que não entendem os bairros de SJC. Buscam respostas rápidas, dados geográficos auditáveis e apoio para saber onde abrir e precificar.",
    geographic_scope: "São José dos Campos e Região Metropolitana do Vale do Paraíba (com foco de lançamento nos polos Aquarius, Vila Ema, Urbanova, Centro, Zona Sul e Zona Leste).",
    competitors: [
      {
        name: "Radar São José",
        quality: "Excepcional (722 entrevistas locais de verdade)",
        price: "R$ 12.000 / ano (Altamente acessível p/ médias)",
        channel: "100% Digital + Ativação Consultiva de 2h",
        payment: "Até 12x no cartão / Boleto Asaas",
        support: "Direto com especialistas de SJC via WhatsApp",
        services: "Radar + IA + Hub + Clipping + Blog",
        guarantees: "Garantia de atualização e dados auditados"
      },
      {
        name: "Sistemas Nacionais (Geofusion / Cognatis)",
        quality: "Alta em dados macroeconômicos IBGE",
        price: "R$ 40.000 a R$ 80.000 / ano (Proibitivo)",
        channel: "Comercial corporativo tradicional de SP",
        payment: "Faturamento anual corporativo",
        support: "Helpdesk terceirizado e tickets lentos",
        services: "Apenas software geográfico cru sem IA",
        guarantees: "Contratos rígidos com multas"
      },
      {
        name: "Institutos Tradicionais de Pesquisa Local",
        quality: "Média (pesquisas estáticas em PDF)",
        price: "R$ 15.000 a R$ 35.000 por estudo avulso",
        channel: "Reuniões presenciais em SJC",
        payment: "50% entrada e 50% entrega",
        support: "Encerra na entrega do PDF",
        services: "Apenas relatório estático",
        guarantees: "Sem plataforma digital interativa"
      }
    ],
    suppliers: [
      { name: "Supabase Inc.", items: "Banco de dados PostgreSQL & Auth Cloud", price: "US$ 25/mês", payment: "Cartão internacional", delivery: "Imediata (Cloud)", location: "EUA (AWS São Paulo)" },
      { name: "Vercel Inc.", items: "Hospedagem Serverless & Edge Network", price: "US$ 20/mês", payment: "Cartão internacional", delivery: "Imediata (Cloud)", location: "EUA (Edge Brasil)" },
      { name: "Groq Cloud / Google AI", items: "APIs de Inferência de IA (Consultor)", price: "~US$ 30/mês", payment: "Pay-as-you-go", delivery: "API sob demanda", location: "Global" },
      { name: "Asaas Gestão Financeira", items: "Gateway de pagamentos, Pix e boletos", price: "Taxa de ~2.9% / transação", payment: "Dedução automática", delivery: "Imediata", location: "Brasil" }
    ]
  },

  marketing_plan: {
    products_description: "1) Radar São José: Plataforma principal com Dash Pesquisa, Relatório Executivo, Radar HUB, Radar Clipping, Linha do Tempo, Lentes SJC e 2h de ativação inclusas (R$ 12.000/ano).\n2) Radar Aberto: Camada gratuita de demonstração para atração de leads qualificados.\n3) Inteligência Aplicada: Cruzamento de dados do Radar com o contexto interno da empresa cliente.\n4) Pesquisa Personalizada: Investigação primária de campo sob encomenda quando o dado não existe na base.\n5) Clipping & Blog: Matérias editoriais patrocinadas com alta indexação no Google.",
    pricing_strategy: [
      { product: "Radar São José (Licença Anual)", price: "R$ 12.000 / 12 meses", strategy: "Produto principal recorrente com ativação inclusa" },
      { product: "Radar Aberto", price: "Gratuito", strategy: "Porta de entrada, demonstração e geração de interesse" },
      { product: "Inteligência Aplicada", price: "R$ 5.000 a R$ 15.000 / projeto", strategy: "Serviço personalizado de alta margem" },
      { product: "Pesquisa Personalizada", price: "R$ 8.000 a R$ 25.000 / estudo", strategy: "Sob demanda para lacunas de informação" },
      { product: "Matéria Patrocinada no Blog", price: "R$ 2.500 / publicação", strategy: "Monetização de audiência qualificada e SEO" }
    ],
    promotional_strategies: "Produção contínua de conteúdo no Blog do Radar indexado no Google; Radar Aberto como isca digital de autoridade; Prospecção ativa (Outbound) de empresas em momento de expansão ou abertura de pontos em SJC; Programa de Vendedores Parceiros (Afiliados locais) com comissão de 20%.",
    commercial_structure: "Vendas diretas consultivas (Inside Sales conduzido por Leonardo), portal de parceiros afiliados (corretores e consultores de SJC) e funil de conversão automático a partir dos usuários cadastrados no Radar Aberto."
  },

  operational_plan: {
    layout_architecture: `ARQUITETURA TECNOLÓGICA E INFRAESTRUTURA FULL-STACK (SaaS & IA)

1. CAMADA FRONTEND (Single Page Application - SPA Moderna):
- Framework & Core: Vanilla JavaScript moderno (ES6+ modular) e HTML5 semântico, proporcionando altíssima velocidade de carregamento (FCP < 0.8s) sem sobrecarga de frameworks client-side pesados.
- Design System & Estilização: Tailwind CSS 3.4 (via CDN otimizada) com paleta corporativa institucional (Deep Slate #0B2545, Cyan Glow #00F0FF, Emerald Accent #10B981) e tipografia Inter/Plus Jakarta Sans.
- Biblioteca de Ícones: FontAwesome 6 Pro (SVG renderizado via classes otimizadas).
- Camada Geoespacial & Mapas Interativos: Leaflet.js 1.9 integrado com camadas geojson vetoriais das 6 Macro-Regiões (Centro, Sul, Leste, Oeste, Norte, Sudeste) e 45 bairros de São José dos Campos. Marcadores interativos de calor com pulsos dinâmicos em CSS (Pulse Ripple Waves) mapeando densidade de menções e sentimento.
- Visualização de Dados & Analytics: Chart.js 4.4 integrado aos plugins ChartDataLabels e Sankey Chart para geração em tempo real de matrizes de cruzamento, gráficos de dispersão demográfica, fluxo de jornadas e funis de conversão.
- Responsividade & Viewport: Grid elástico 100% responsivo, adaptado de smartphones a monitores 4K ultrawide, com contenção rigorosa de transbordo (overflow-x: clip).

2. CAMADA BACKEND & SERVERLESS APIS (Edge Computing na Vercel):
- Ambiente de Execução: Node.js 20 LTS em arquitetura Serverless Functions hospedadas na Vercel Edge Network.
- Endpoints Principais:
  * /api/consultor.js: Gateway de inferência estratégica territorial com streaming HTTP de respostas via Server-Sent Events (SSE).
  * /api/oraculo.js: Motor de cruzamento analítico entre a base demográfica primária (722 munícipes) e tendências setoriais.
  * /api/posts.js: API RESTful com paginação e busca semântica para o Blog do Radar e indexação de notícias de mídia local.
  * /api/business-plan.js: Mecanismo de persistência e sincronização em nuvem do planejamento executivo.
  * /api/upload.js: Tratamento e sanitização de payloads e anexos em tempo real.
- Latência & Resiliência: Arquitetura sem estado (stateless) com tempo de inicialização (cold start) < 180ms e fallback automático entre provedores de IA.

3. BANCO DE DADOS RELACIONAL & AUTENTICAÇÃO CLOUD (Supabase / PostgreSQL 15):
- Hospedagem & Região: Supabase Cloud sobre instâncias AWS sa-east-1 (São Paulo), garantindo latência de rede interna inferior a 15ms.
- Modelo de Dados Relacional & Tabelas Principais:
  * analise_midia_sjc: 7.542 registros de matérias e postagens jornalísticas com metadados estruturados (veículo, data, macro-região, sentimento [-1 a +1], volume de engajamento, temas-chave e resumo semântico).
  * blog_posts: CMS integrado com suporte a Markdown, capa, tags territoriais e contadores de visualização.
  * crm_leads & crm_atividades: Gestão completa de pipeline comercial B2B (MQL, SQL, Propostas e Fechamentos).
  * parceiros_afiliados: Gestão de corretores, consultores e agências parceiras, registrando códigos de indicação e comissões.
- Segurança & Controle de Acesso: Row Level Security (RLS) ativo em todas as tabelas com chaves anon/public e service_role isoladas, além de tokens JWT assinados via HMAC-SHA256 para sessões administrativas.

4. MOTOR DE INTELIGÊNCIA ARTIFICIAL GENERATIVA & RAG TERRITORIAL:
- LLMs Principais: Groq Cloud LPU executando Llama-3.3-70b-versatile a velocidades superiores a 250 tokens por segundo, permitindo raciocínio estratégico instantâneo em linguagem natural.
- LLM de Failover: Google Gemini 2.5 Flash / Pro conectado via SDK para redundância e análises multimodais de alta complexidade.
- Engenharia de Prompt & RAG (Retrieval-Augmented Generation): Injeção em tempo real de matrizes contextuais:
  * Base Demográfica Primária: Amostra probabilística de 722 munícipes com 30+ variáveis socioeconômicas e comportamentais.
  * 60 Personas Comportamentais de SJC: Padrões de consumo, mobilidade, aspirações, renda e presença geográfica nas 6 zonas da cidade.
  * Matriz Estratégica McKinsey / SWOT: Cruzamento automático de atratividade de mercado vs. força competitiva para recomendações acionáveis.

5. DATA PIPELINE & SCRAPING DE MÍDIA LOCAL:
- Coleta Contínua: Scripts automatizados que monitoram os 10 principais portais de notícias e órgãos oficiais de São José dos Campos (O Vale, Meon, CBN Vale, Life Informa, SP RIO+, Portal R3, Radar Urbano, Prefeitura de SJC, ACI e Parque Tecnológico).
- Higienização & Enriquecimento: Limpeza de tags HTML, remoção de stop-words, cálculo automático de índice de polaridade/sentimento e marcação geoespacial por bairro/região antes da gravação no PostgreSQL.

6. SEGURANÇA, LGPD & INFRAESTRUTURA DE DEPLOY:
- Criptografia: SSL/TLS 1.3 obrigatório com cabeçalhos HSTS, X-Content-Type-Options e CSP rigorosos.
- Variáveis de Ambiente: Chaves de API (Supabase Service Key, Groq API Key, Gemini Key) criptografadas e restritas ao runtime do servidor na Vercel.
- Backups: Snapshots diários automatizados no Supabase Cloud com retenção contínua de 7 dias (Point-in-Time Recovery).
- Conformidade LGPD: Total anonimização dos dados de cidadãos nas pesquisas primárias, sem armazenamento de CPF ou identificadores diretos.`,

    capacity: `CAPACIDADE PRODUTIVA, COMPUTACIONAL & NÍVEIS DE SERVIÇO (SLA)

1. CAPACIDADE COMPUTACIONAL & ESCALABILIDADE DE SERVIDORES:
- Tráfego Concorrente: A infraestrutura serverless na Vercel Edge combinada com Connection Pooling (PgBouncer) no Supabase suporta mais de 10.000 requisições simultâneas sem enfileiramento ou degradação de desempenho.
- Throughput de Resposta:
  * Consultas ao Consultor IA / Oráculo: Tempo de primeira resposta < 1.2 segundos e streaming completo de parecer estratégico em menos de 3.5 segundos (velocidade Groq LPU).
  * Consultas ao Banco de Dados (PostgreSQL): Tempo médio de execução de queries analíticas < 45ms.
  * Carregamento do Dashboard: Assets estáticos cacheados em 100+ pontos de presença (PoPs) com TTFB (Time To First Byte) < 60ms.
- Disponibilidade (Uptime): SLA alvo de 99.9% de disponibilidade anual, com monitoramento ativo 24/7 e health checks automáticos.

2. CAPACIDADE OPERACIONAL DE ATENDIMENTO & CLIENTES (SaaS):
- Capacidade Instalada de Assinantes na Plataforma: A arquitetura multi-tenant suporta mais de 1.000 empresas ativas simultaneamente com consumo ilimitado de relatórios padronizados e consultas ao Oráculo.
- Onboarding & Ativação de Clientes: Capacidade da equipe fundadora (Mayumi e Leonardo) para realizar até 8 sessões de Onboarding Executivo (2h cada) por semana no estágio inicial, escalável para até 25 por semana com a entrada do Assistente de Sucesso do Cliente (Fase 2).

3. CAPACIDADE PRODUTIVA DE SERVIÇOS CONSULTIVOS (Inteligência Aplicada & Pesquisa):
- Estudos de Inteligência Aplicada (R$ 8.000 a R$ 15.000): Capacidade para conduzir até 4 a 6 projetos sob demanda por mês, com prazo médio de entrega de 5 a 7 dias úteis por estudo.
- Pesquisas Personalizadas de Campo (R$ 15.000 a R$ 25.000): Capacidade para coordenar até 2 pesquisas aprofundadas por trimestre, mobilizando pesquisadores de campo treinados e entregando relatórios tabulados em até 20 dias úteis.

4. CAPACIDADE EDITORIAL & MONETIZAÇÃO DE CONTEÚDO (Blog do Radar):
- Publicações Editoriais Orgânicas: 8 a 12 matérias analíticas mensais baseadas em dados do Radar Clipping e estudos de mercado locais.
- Matérias Patrocinadas B2B (R$ 2.500 cada): Capacidade para até 4 publicações patrocinadas por mês, mantendo a proporção saudável de 70% conteúdo autoral e 30% patrocinado.`,

    processes: `PROCESSOS OPERACIONAIS PADRONIZADOS (SOPs) - DO LEAD AO SUCESSO DO CLIENTE

1. PROCESSO DE AQUISIÇÃO, QUALIFICAÇÃO & DEMONSTRAÇÃO (Ciclo de 5 a 10 dias):
- Identificação & Inbound: Leads gerados organicamente via Radar Aberto, matérias do Blog ou indicações de Parceiros Afiliados entram automaticamente no funil do CRM no Supabase.
- Prospecção Ativa (Outbound): Leonardo Venâncio realiza abordagem consultiva direcionada a diretores comerciais, incorporadoras, redes de varejo, franquias e agências de SJC.
- Sessão de Demonstração (15 a 20 min): Apresentação ao vivo do painel com dados específicos do segmento e da macro-região de interesse do prospect, demonstrando o valor de prever tendências territoriais.

2. PROCESSO DE FECHAMENTO, CONTRATAÇÃO & PROVISIONAMENTO IMEDIATO:
- Geração Contratual: Emissão automática de contrato digital padrão SaaS anual (R$ 12.000) com termos de uso e confidencialidade.
- Faturamento: Envio de link de pagamento / faturamento via cartão de crédito ou Pix corporativo com emissão de Nota Fiscal de Serviços eletrônica (NFS-e).
- Liberação de Acesso: Cadastro do tenant no Supabase Auth e disparo instantâneo de e-mail de boas-vindas com credenciais seguras e link para agendamento do onboarding.

3. PROCESSO DE ONBOARDING EXECUTIVO & ATIVAÇÃO PEDAGÓGICA (Ativação de 2 Horas):
- Responsável Principal: Mayumi Nagano (Head de Pesquisa & Conteúdo).
- Bloco 1 (45 min) - Mapeamento de Hipóteses & Dores Estratégicas: Identificação dos bairros prioritários, público-alvo e concorrentes diretos do cliente em São José dos Campos.
- Bloco 2 (45 min) - Navegação Guiada & Parametrização da Matriz de Decisão: Configuração dos filtros demográficos, exploração das 60 Personas e seleção das variáveis de atratividade no dashboard.
- Bloco 3 (30 min) - Treinamento do Consultor IA & Casos Práticos: Execução de perguntas reais de negócios ao motor de IA (ex: "Qual bairro da Zona Sul tem maior demanda reprimida por serviços de saúde classe B?"), ensinando a liderança do cliente a extrair pareceres de alto impacto.

4. PROCESSO DE GESTÃO DE SUCESSO, SUPORTE & RETENÇÃO CONTÍNUA (Customer Success):
- Monitoramento de Adoção: Acompanhamento quinzenal de logins e consultas executadas pelo assinante via métricas administrativas do CRM.
- Radar Briefing Mensal: Envio de relatório exclusivo por e-mail com os 3 principais movimentos econômicos e comportamentais observados em SJC no mês anterior.
- Suporte Técnico & Estratégico: Canal direto via WhatsApp Business e e-mail corporativo com tempo de primeira resposta inferior a 2 horas em dias úteis.

5. PROCESSO DE EXECUÇÃO DE PROJETOS DE INTELIGÊNCIA APLICADA (Sob Demanda):
- D+0 (Alinhamento): Reunião de escopo e definição clara do problema de negócio (ex: viabilidade de abertura de nova unidade no Urbanova ou Putim).
- D+2 (Mineração & Cruzamento): Extração dos microdados demográficos primários combinados aos 7.542 registros de mídia e indicadores do IBGE/CAGED.
- D+4 (Modelagem & Redação): Aplicação dos modelos analíticos por Leonardo e Mayumi, estruturando o diagnóstico, projeção de demanda e matriz de riscos.
- D+7 (Entrega & Apresentação): Entrega de dossiê executivo interativo em PDF/Dashboard e realização de reunião executiva de 1h para apresentação dos achados e recomendações.

6. PROCESSO DE RENOVAÇÃO ANUAL & UPSELL (Ciclo de 60 dias pré-vencimento):
- 60 Dias Antes: Geração do relatório de retrospectiva anual com o impacto e economia gerados pelas decisões embasadas no Radar São José.
- 30 Dias Antes: Reunião de alinhamento com a diretoria do cliente apresentando as novas camadas de dados históricos acumulados e roadmap de novas funcionalidades.
- Assinatura da Renovação: Renovação automática da assinatura anual com índice de retenção líquida de receita (NRR) projetado acima de 90%.`,

    staff_requirements: [
      { role: "CEO & Head de Engenharia de Dados", qualification: "Engenharia / Ciência de Dados / Arquitetura SaaS", quantity: 1, resp: "Leonardo Venâncio" },
      { role: "Head de Pesquisa & Inteligência Territorial", qualification: "Sociologia / Estatística Social / Jornalismo de Dados", quantity: 1, resp: "Mayumi Nagano" },
      { role: "Assistente Comercial & SDR B2B (Fase 2)", qualification: "Inside Sales / Gestão de CRM / Prospecção Corporativa", quantity: 1, resp: "Contratação Planejada Mês 6" },
      { role: "Jornalista de Dados & Redator SEO (Fase 3)", qualification: "Comunicação / Redação Analítica / Otimização SEO", quantity: 1, resp: "Contratação Planejada Mês 12" },
      { role: "Analista de Sucesso do Cliente / CX (Fase 4)", qualification: "Customer Success / Treinamento Corporativo / Suporte", quantity: 1, resp: "Contratação Planejada Fase 4" }
    ]
  },

  financial_plan: {
    capex_investments: [
      { item: "Notebooks de Alta Performance (Apple M3 / Dell XPS)", qty: 2, unit_val: 12000, total: 24000 },
      { item: "Estações de Trabalho Ergonômicas & Monitores 4K", qty: 2, unit_val: 4500, total: 9000 },
      { item: "Kits de Pesquisa de Campo & Gravadores de Áudio/Vídeo", qty: 2, unit_val: 3500, total: 7000 },
      { item: "Infraestrutura de Rede, Backup e Segurança Física", qty: 1, unit_val: 10000, total: 10000 }
    ],
    pre_operational_investments: [
      { item: "Registro de Marca no INPI (Radar São José)", val: 3500 },
      { item: "Assessoria Jurídica, Contratos SaaS & Termos LGPD", val: 5500 },
      { item: "Pesquisa de Campo Primária (722 Munícipes em 6 Regiões)", val: 12000 },
      { item: "Identidade Visual, Branding & Domínios Corporativos", val: 4000 }
    ],
    inputs: {
      annualSubscribers: 20,
      annualPrice: 12000,
      appliedIntelProjects: 6,
      appliedIntelAvgPrice: 8000,
      customResearchProjects: 2,
      customResearchAvgPrice: 18000,
      blogSponsorships: 8,
      blogSponsorshipAvgPrice: 2500,
      taxRatePct: 6.0,
      affiliateCommissionPct: 20.0,
      gatewayRatePct: 3.2,
      cogsPerUserYear: 380,
      directServiceCosts: 12000,
      proLaboreLeonardo: 6000,
      proLaboreMayumi: 5000,
      staffPayroll: 3500,
      cloudTools: 1200,
      accounting: 800,
      officeInternet: 600,
      otherFixed: 900,
      annualDepreciation: 4500,
      avgSalesReceiptDays: 15,
      avgPaymentDays: 25,
      cacEstimate: 850
    }
  },

  swot: [
    { id: "swot-1", quadrant: "forca", description: "722 entrevistas territoriais próprias e exclusivas de SJC (dados reais vs dados genéricos de concorrentes)", impact_level: "alto" },
    { id: "swot-2", quadrant: "forca", description: "Software próprio com IA nativa sem dependência de licenças caras de terceiros", impact_level: "alto" },
    { id: "swot-3", quadrant: "forca", description: "Ativação de 2 horas inclusa para garantir engajamento e combater o abandono da ferramenta", impact_level: "alto" },
    { id: "swot-4", quadrant: "oportunidade", description: "Mercado imobiliário e médico de SJC investindo pesado em expansão e lançamentos", impact_level: "alto" },
    { id: "swot-5", quadrant: "oportunidade", description: "Empresas cansadas de consultorias de R$ 80 mil que não conhecem os bairros de SJC", impact_level: "alto" },
    { id: "swot-6", quadrant: "oportunidade", description: "Monetização de matérias patrocinadas no Blog com alta autoridade no Google", impact_level: "medio" },
    { id: "swot-7", quadrant: "fraqueza", description: "Necessidade de educar o empresário tradicional a usar dados e fazer perguntas melhores", impact_level: "alto" },
    { id: "swot-8", quadrant: "fraqueza", description: "Equipe fundadora inicial enxuta (Leonardo + Mayumi) exigindo automação máxima", impact_level: "medio" },
    { id: "swot-9", quadrant: "ameaca", description: "Tentativa de cópia superficial por institutos locais de pesquisa sem tecnologia SaaS", impact_level: "medio" },
    { id: "swot-10", quadrant: "ameaca", description: "Oscilações macroeconômicas que adiem decisões de investimento de pequenos lojistas", impact_level: "baixo" }
  ],

  monday_tasks: [
    { id: "task-1", title: "Formalizar CNPJ independente do Radar São José (LTDA)", responsible: "leonardo", phase: "Fundação & Governança", status: "done", priority: "high", due_date: "Out/2026", notes: "Separar ativo empresarial do Studio 8 conforme diretriz do Doc-Base." },
    { id: "task-2", title: "Consolidar relatório das 722 entrevistas de SJC e dados demográficos", responsible: "mayumi", phase: "Inteligência de Dados", status: "done", priority: "critical", due_date: "Out/2026", notes: "Base oficial de São José dos Campos dividida por 6 macrorregiões." },
    { id: "task-3", title: "Parametrizar Consultor IA com contexto unificado das 10 personas", responsible: "leonardo", phase: "Plataforma SaaS", status: "in_progress", priority: "critical", due_date: "Nov/2026", notes: "IA respondendo dúvidas de mercado com dados reais da pesquisa." },
    { id: "task-4", title: "Estruturar roteiro metodológico da Ativação de 2h para clientes", responsible: "mayumi", phase: "Operação & Ativação", status: "in_progress", priority: "high", due_date: "Nov/2026", notes: "Ensinar cliente a transformar sua dor em perguntas dentro do Radar." },
    { id: "task-5", title: "Implementar Portal do Vendedor / Afiliados com comissão de 20%", responsible: "leonardo", phase: "Comercial & Vendas", status: "done", priority: "high", due_date: "Nov/2026", notes: "Atrair corretores de imóveis e consultores de SJC para venda ativa." },
    { id: "task-6", title: "Lançar pauta com primeiras 10 matérias estratégicas no Blog", responsible: "mayumi", phase: "Marketing & Mídia", status: "in_progress", priority: "medium", due_date: "Dez/2026", notes: "Atração orgânica via Google SEO de empresários que buscam dados da cidade." },
    { id: "task-7", title: "Fechar primeiras 6 licenças anuais do Radar (R$ 12k cada)", responsible: "leonardo", phase: "Comercial & Vendas", status: "in_progress", priority: "critical", due_date: "Dez/2026", notes: "Bater R$ 6.000 MRR equivalente para atingir ponto de equilíbrio." },
    { id: "task-8", title: "Auditar fluxo de renovação anual e registro de inteligência histórica", responsible: "ambos", phase: "Gestão & Escala", status: "todo", priority: "medium", due_date: "Mar/2027", notes: "Garantir que a inteligência de 2026 permaneça e se acumule em camadas para 2027." }
  ],

  evaluation: {
    final_reflection: "O Radar São José é um ativo de alto valor porque une exclusividade metodológica (722 entrevistas), custo marginal de distribuição quase nulo típico de SaaS e capacidade de geração de novos serviços (Inteligência Aplicada). O sucesso reside na manutenção da disciplina de vendas de Leonardo e na excelência analítica de Mayumi, preservando a independência do ativo em relação ao Studio 8."
  }
};

// =========================================================================
// ESTADO GLOBAL DO PLANO NO FRONTEND
// =========================================================================
let currentBusinessPlan = null;
let mondayFilterResponsible = 'all'; // 'all', 'leonardo', 'mayumi'
let mondayFilterStatus = 'all'; // 'all', 'todo', 'in_progress', 'done', 'blocked'
let dreChartInstance = null;
let breakEvenChartInstance = null;
let scenarioChartInstance = null;
let planAutoSaveTimer = null;

// =========================================================================
// INICIALIZAÇÃO & PERSISTÊNCIA HÍBRIDA
// =========================================================================

function loadBusinessPlan() {
  try {
    const raw = localStorage.getItem(PLAN_STORAGE_KEY_V5);
    if (raw) {
      currentBusinessPlan = JSON.parse(raw);
    }
  } catch (err) {
    console.warn("[Business Plan] Falha ao carregar do localStorage:", err);
  }

  if (!currentBusinessPlan || !currentBusinessPlan.financial_plan) {
    currentBusinessPlan = JSON.parse(JSON.stringify(DEFAULT_BUSINESS_PLAN_DATA));
  }

  // Tenta sincronizar com o backend em background
  syncWithBackend();

  // Renderiza toda a interface interativa
  renderAllPlanSections();
}

async function syncWithBackend() {
  try {
    const res = await fetch('/api/business-plan');
    if (res.ok) {
      const data = await res.json();
      if (data && data.plan && data.fromCloud) {
        currentBusinessPlan = data.plan;
        localStorage.setItem(PLAN_STORAGE_KEY_V5, JSON.stringify(currentBusinessPlan));
        renderAllPlanSections();
        updateSyncIndicator(true, "Sincronizado com Supabase Cloud");
        return;
      }
    }
  } catch (e) {
    // Modo offline / fallback
  }
  updateSyncIndicator(true, "Salvo Localmente");
}

function updateSyncIndicator(saved = true, msg = "") {
  const el = document.getElementById('planSyncIndicator');
  if (!el) return;
  const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  if (saved) {
    el.innerHTML = `<i class="fa-solid fa-cloud-arrow-up text-emerald-500"></i> <span>${msg || 'Salvo'} (${time})</span>`;
    el.className = "text-[11px] font-bold text-slate-600 flex items-center gap-1.5 px-3 py-1 bg-white rounded-xl border border-slate-200 shadow-2xs";
  } else {
    el.innerHTML = `<i class="fa-solid fa-spinner fa-spin text-amber-500"></i> <span>Salvando...</span>`;
    el.className = "text-[11px] font-bold text-amber-600 flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-xl border border-amber-200";
  }
}

async function saveBusinessPlan(showFeedback = true) {
  if (!currentBusinessPlan) return;
  updateSyncIndicator(false);

  // Coleta dados dos inputs na tela
  collectFormInputs();

  // Salva no localStorage
  localStorage.setItem(PLAN_STORAGE_KEY_V5, JSON.stringify(currentBusinessPlan));

  // Envia para o backend Supabase
  try {
    const res = await fetch('/api/business-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(currentBusinessPlan)
    });
    if (res.ok) {
      const respData = await res.json();
      updateSyncIndicator(true, respData.persistedToCloud ? "Sincronizado com Supabase Cloud" : "Salvo no Navegador");
    } else {
      updateSyncIndicator(true, "Salvo no Navegador");
    }
  } catch (err) {
    updateSyncIndicator(true, "Salvo no Navegador");
  }

  if (showFeedback && typeof showToast === 'function') {
    showToast('Plano de Negócios e Tarefas salvos com sucesso!', 'success');
  }
}

function resetBusinessPlanToDefaults() {
  if (!confirm('Deseja realmente restaurar todos os dados oficiais do Documento-Base (Set/2026)? Todas as edições personalizadas serão redefinidas.')) {
    return;
  }
  currentBusinessPlan = JSON.parse(JSON.stringify(DEFAULT_BUSINESS_PLAN_DATA));
  localStorage.setItem(PLAN_STORAGE_KEY_V5, JSON.stringify(currentBusinessPlan));
  renderAllPlanSections();
  saveBusinessPlan(false);
  if (typeof showToast === 'function') {
    showToast('Dados oficiais do Documento-Base restaurados!', 'info');
  }
}

// Salto Rápido Direto para Seções (Quick-Jump)
function jumpToPlanSection(sectionId) {
  const target = document.getElementById(sectionId);
  if (!target) return;
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Destaque visual pulsante no container
  target.classList.add('ring-4', 'ring-cyan-400/50', 'transition-all', 'duration-500');
  setTimeout(() => {
    target.classList.remove('ring-4', 'ring-cyan-400/50');
  }, 1200);

  // Atualiza active button na barra superior
  document.querySelectorAll('.plan-jump-btn').forEach(btn => {
    btn.classList.remove('bg-[#0B2545]', 'text-white', 'shadow-sm');
    btn.classList.add('bg-white', 'text-slate-700');
  });
  const activeBtn = document.getElementById(`btn-jump-${sectionId}`);
  if (activeBtn) {
    activeBtn.classList.remove('bg-white', 'text-slate-700');
    activeBtn.classList.add('bg-[#0B2545]', 'text-white', 'shadow-sm');
  }
}

// =========================================================================
// RENDERIZAÇÃO COMPLETA DE TODAS AS SEÇÕES
// =========================================================================

function renderAllPlanSections() {
  if (!currentBusinessPlan) return;

  renderMondayBoard();
  renderSectionExecutiveSummary();
  renderSectionMarket();
  renderSectionMarketing();
  renderSectionOperational();
  renderSectionFinancial();
  updateScenarioSimulator();
  renderSwotMatrix();
  renderSectionEvaluation();
}

// =========================================================================
// 1. MÓDULO MONDAY.COM: DIVISÃO DE TAREFAS (LEONARDO & MAYUMI)
// =========================================================================

function renderMondayBoard() {
  const container = document.getElementById('mondayTasksTableBody');
  if (!container) return;

  const tasks = currentBusinessPlan.monday_tasks || [];

  // Cálculos de Progresso
  const totalCount = tasks.length;
  const doneCount = tasks.filter(t => t.status === 'done').length;
  const overallPct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  const leoTasks = tasks.filter(t => t.responsible === 'leonardo' || t.responsible === 'ambos');
  const leoDone = leoTasks.filter(t => t.status === 'done').length;
  const leoPct = leoTasks.length > 0 ? Math.round((leoDone / leoTasks.length) * 100) : 0;

  const mayTasks = tasks.filter(t => t.responsible === 'mayumi' || t.responsible === 'ambos');
  const mayDone = mayTasks.filter(t => t.status === 'done').length;
  const mayPct = mayTasks.length > 0 ? Math.round((mayDone / mayTasks.length) * 100) : 0;

  // Atualiza barras de progresso
  const elOverallPct = document.getElementById('mondayOverallPct');
  const elOverallBar = document.getElementById('mondayOverallBar');
  if (elOverallPct) elOverallPct.innerText = `${overallPct}%`;
  if (elOverallBar) elOverallBar.style.width = `${overallPct}%`;

  const elLeoPct = document.getElementById('mondayLeoPct');
  const elLeoBar = document.getElementById('mondayLeoBar');
  if (elLeoPct) elLeoPct.innerText = `${leoPct}% (${leoDone}/${leoTasks.length})`;
  if (elLeoBar) elLeoBar.style.width = `${leoPct}%`;

  const elMayPct = document.getElementById('mondayMayPct');
  const elMayBar = document.getElementById('mondayMayBar');
  if (elMayPct) elMayPct.innerText = `${mayPct}% (${mayDone}/${mayTasks.length})`;
  if (elMayBar) elMayBar.style.width = `${mayPct}%`;

  // Filtra tarefas conforme seleção
  const filteredTasks = tasks.filter(t => {
    if (mondayFilterResponsible === 'leonardo' && t.responsible !== 'leonardo' && t.responsible !== 'ambos') return false;
    if (mondayFilterResponsible === 'mayumi' && t.responsible !== 'mayumi' && t.responsible !== 'ambos') return false;
    if (mondayFilterStatus !== 'all' && t.status !== mondayFilterStatus) return false;
    return true;
  });

  if (filteredTasks.length === 0) {
    container.innerHTML = `
      <tr>
        <td colspan="7" class="px-6 py-8 text-center text-slate-400 font-medium">
          Nenhuma tarefa encontrada para os filtros selecionados.
        </td>
      </tr>
    `;
    return;
  }

  container.innerHTML = filteredTasks.map((t, idx) => {
    // Configurações de Status Monday
    const statusMap = {
      done: { label: 'Concluído', color: 'bg-emerald-500 hover:bg-emerald-600 text-white', icon: 'fa-check' },
      in_progress: { label: 'Em Andamento', color: 'bg-amber-500 hover:bg-amber-600 text-white', icon: 'fa-clock' },
      todo: { label: 'A Fazer', color: 'bg-blue-500 hover:bg-blue-600 text-white', icon: 'fa-hourglass-start' },
      blocked: { label: 'Travado', color: 'bg-rose-500 hover:bg-rose-600 text-white', icon: 'fa-hand' }
    };
    const s = statusMap[t.status] || statusMap.todo;

    // Configurações de Prioridade
    const priorityMap = {
      critical: { label: 'Crítica', color: 'bg-rose-100 text-rose-800 border-rose-300' },
      high: { label: 'Alta', color: 'bg-amber-100 text-amber-800 border-amber-300' },
      medium: { label: 'Média', color: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
      low: { label: 'Baixa', color: 'bg-slate-100 text-slate-700 border-slate-300' }
    };
    const p = priorityMap[t.priority] || priorityMap.medium;

    // Avatar do Responsável
    let respPill = '';
    if (t.responsible === 'leonardo') {
      respPill = `
        <button type="button" onclick="cycleTaskResponsible('${t.id}')" title="Clique para alternar responsável" class="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold hover:scale-105 transition-transform">
          <img src="fotos_radar/LEONARDO.jpeg" class="w-5 h-5 rounded-full object-cover border border-blue-300" onerror="this.src='fotos_radar/LEONARDO.jpeg'" />
          <span>Leonardo</span>
        </button>
      `;
    } else if (t.responsible === 'mayumi') {
      respPill = `
        <button type="button" onclick="cycleTaskResponsible('${t.id}')" title="Clique para alternar responsável" class="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 text-purple-800 border border-purple-200 text-xs font-bold hover:scale-105 transition-transform">
          <img src="fotos_radar/mayumi.jpg" class="w-5 h-5 rounded-full object-cover border border-purple-300" onerror="this.src='fotos_radar/mayumi.jpg'" />
          <span>Mayumi</span>
        </button>
      `;
    } else {
      respPill = `
        <button type="button" onclick="cycleTaskResponsible('${t.id}')" title="Clique para alternar responsável" class="flex items-center gap-1 px-2 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-300 text-xs font-bold hover:scale-105 transition-transform">
          <img src="fotos_radar/LEONARDO.jpeg" class="w-4 h-4 rounded-full object-cover" />
          <img src="fotos_radar/mayumi.jpg" class="w-4 h-4 rounded-full object-cover -ml-2" />
          <span class="ml-1">Ambos</span>
        </button>
      `;
    }

    return `
      <tr class="hover:bg-slate-50/80 transition-colors border-b border-slate-100 group">
        <!-- Tarefa -->
        <td class="px-4 py-3 min-w-[260px]">
          <input type="text" value="${escapeHtml(t.title)}" onchange="updateMondayTaskField('${t.id}', 'title', this.value)" class="w-full bg-transparent border-0 border-b border-transparent focus:border-cyan-500 focus:bg-white text-xs font-bold text-slate-800 px-1 py-1 rounded outline-none transition-all" />
        </td>

        <!-- Responsável -->
        <td class="px-4 py-3 whitespace-nowrap">
          ${respPill}
        </td>

        <!-- Fase / Módulo -->
        <td class="px-4 py-3 whitespace-nowrap">
          <input type="text" value="${escapeHtml(t.phase)}" onchange="updateMondayTaskField('${t.id}', 'phase', this.value)" class="w-full bg-transparent border-0 border-b border-transparent focus:border-cyan-500 focus:bg-white text-[11px] font-semibold text-slate-600 px-1 py-1 rounded outline-none" />
        </td>

        <!-- Status Monday -->
        <td class="px-4 py-3 whitespace-nowrap text-center">
          <button type="button" onclick="cycleMondayTaskStatus('${t.id}')" title="Clique para alternar status" class="w-32 py-1.5 px-3 rounded-lg text-xs font-black uppercase tracking-wider shadow-2xs transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 ${s.color}">
            <i class="fa-solid ${s.icon} text-[10px]"></i>
            <span>${s.label}</span>
          </button>
        </td>

        <!-- Prioridade -->
        <td class="px-4 py-3 whitespace-nowrap text-center">
          <button type="button" onclick="cycleMondayTaskPriority('${t.id}')" title="Clique para alternar prioridade" class="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border cursor-pointer hover:brightness-95 transition-all ${p.color}">
            ${p.label}
          </button>
        </td>

        <!-- Prazo -->
        <td class="px-4 py-3 whitespace-nowrap">
          <input type="text" value="${escapeHtml(t.due_date || '')}" placeholder="Ex: Dez/26" onchange="updateMondayTaskField('${t.id}', 'due_date', this.value)" class="w-24 bg-transparent border-0 border-b border-transparent focus:border-cyan-500 focus:bg-white text-xs font-semibold text-slate-600 px-1 py-1 rounded text-center outline-none" />
        </td>

        <!-- Notas & Ação Excluir -->
        <td class="px-4 py-3 text-right whitespace-nowrap">
          <button type="button" onclick="deleteMondayTask('${t.id}')" class="p-1.5 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors" title="Excluir tarefa">
            <i class="fa-solid fa-trash-can text-xs"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function setMondayFilter(resp = 'all') {
  mondayFilterResponsible = resp;
  ['all', 'leonardo', 'mayumi'].forEach(r => {
    const btn = document.getElementById(`filter-monday-${r}`);
    if (btn) {
      if (r === resp) {
        btn.classList.add('bg-[#0B2545]', 'text-white', 'shadow-xs');
        btn.classList.remove('bg-white', 'text-slate-600');
      } else {
        btn.classList.remove('bg-[#0B2545]', 'text-white', 'shadow-xs');
        btn.classList.add('bg-white', 'text-slate-600');
      }
    }
  });
  renderMondayBoard();
}

function setMondayStatusFilter(status = 'all') {
  mondayFilterStatus = status;
  renderMondayBoard();
}

function addNewMondayTask() {
  const newTask = {
    id: 'task-' + Date.now(),
    title: 'Nova meta de execução do plano',
    responsible: mondayFilterResponsible === 'mayumi' ? 'mayumi' : 'leonardo',
    phase: 'Comercial & Escala',
    status: 'todo',
    priority: 'medium',
    due_date: 'Jan/2027',
    notes: ''
  };
  currentBusinessPlan.monday_tasks.push(newTask);
  renderMondayBoard();
  saveBusinessPlan(false);
  if (typeof showToast === 'function') {
    showToast('Nova tarefa adicionada ao quadro Monday.com!', 'info');
  }
}

function deleteMondayTask(taskId) {
  if (!confirm('Deseja realmente remover esta tarefa?')) return;
  currentBusinessPlan.monday_tasks = currentBusinessPlan.monday_tasks.filter(t => t.id !== taskId);
  renderMondayBoard();
  saveBusinessPlan(false);
}

function cycleMondayTaskStatus(taskId) {
  const task = currentBusinessPlan.monday_tasks.find(t => t.id === taskId);
  if (!task) return;
  const cycle = ['todo', 'in_progress', 'done', 'blocked'];
  const nextIdx = (cycle.indexOf(task.status) + 1) % cycle.length;
  task.status = cycle[nextIdx];
  renderMondayBoard();
  saveBusinessPlan(false);
}

function cycleMondayTaskPriority(taskId) {
  const task = currentBusinessPlan.monday_tasks.find(t => t.id === taskId);
  if (!task) return;
  const cycle = ['low', 'medium', 'high', 'critical'];
  const nextIdx = (cycle.indexOf(task.priority) + 1) % cycle.length;
  task.priority = cycle[nextIdx];
  renderMondayBoard();
  saveBusinessPlan(false);
}

function cycleTaskResponsible(taskId) {
  const task = currentBusinessPlan.monday_tasks.find(t => t.id === taskId);
  if (!task) return;
  const cycle = ['leonardo', 'mayumi', 'ambos'];
  const nextIdx = (cycle.indexOf(task.responsible) + 1) % cycle.length;
  task.responsible = cycle[nextIdx];
  renderMondayBoard();
  saveBusinessPlan(false);
}

function updateMondayTaskField(taskId, field, val) {
  const task = currentBusinessPlan.monday_tasks.find(t => t.id === taskId);
  if (task) {
    task[field] = val;
    saveBusinessPlan(false);
  }
}

// =========================================================================
// 2. SUMÁRIO EXECUTIVO & SÓCIOS DINÂMICOS
// =========================================================================

function renderSectionExecutiveSummary() {
  const ex = currentBusinessPlan.executive_summary || {};
  setInputValue('planExecBusinessDesc', ex.business_description);
  setInputValue('planExecMission', ex.mission);
  setInputValue('planExecLegalForm', ex.legal_form);
  setInputValue('planExecTaxDetail', ex.tax_detail);
  setInputValue('planExecLocation', ex.location);
  setInputValue('planExecFunding', ex.funding_sources);

  renderPartnersList();
}

function renderPartnersList() {
  const container = document.getElementById('partnersCardsContainer');
  if (!container) return;

  const partners = currentBusinessPlan.partners || [];
  container.innerHTML = partners.map(p => `
    <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs relative group space-y-4">
      <div class="flex items-start justify-between gap-3">
        <div class="flex items-center gap-3">
          <img src="${p.avatar || (p.name.toLowerCase().includes('mayumi') ? 'fotos_radar/mayumi.jpg' : 'fotos_radar/LEONARDO.jpeg')}" class="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-xs" onerror="this.src='fotos_radar/LEONARDO.jpeg'" />
          <div>
            <input type="text" value="${escapeHtml(p.name)}" onchange="updatePartnerField('${p.id}', 'name', this.value)" class="text-sm font-black text-slate-900 border-0 border-b border-transparent focus:border-cyan-500 focus:bg-slate-50 px-1 rounded outline-none" />
            <input type="text" value="${escapeHtml(p.role)}" onchange="updatePartnerField('${p.id}', 'role', this.value)" class="text-xs font-semibold text-cyan-700 border-0 border-b border-transparent focus:border-cyan-500 focus:bg-slate-50 px-1 rounded outline-none block" />
          </div>
        </div>
        <button type="button" onclick="deletePartner('${p.id}')" class="text-slate-300 hover:text-rose-600 transition-colors p-1" title="Remover sócio">
          <i class="fa-solid fa-trash-can text-xs"></i>
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div>
          <label class="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">Telefone</label>
          <input type="text" value="${escapeHtml(p.phone || '')}" onchange="updatePartnerField('${p.id}', 'phone', this.value)" class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium" />
        </div>
        <div>
          <label class="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">E-mail</label>
          <input type="text" value="${escapeHtml(p.email || '')}" onchange="updatePartnerField('${p.id}', 'email', this.value)" class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium" />
        </div>
        <div class="sm:col-span-2">
          <label class="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">Perfil / Breve Currículo</label>
          <textarea rows="2" onchange="updatePartnerField('${p.id}', 'profile_bio', this.value)" class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-xs font-medium leading-relaxed">${escapeHtml(p.profile_bio || '')}</textarea>
        </div>
        <div class="sm:col-span-2">
          <label class="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">Atribuições no Negócio</label>
          <textarea rows="2" onchange="updatePartnerField('${p.id}', 'responsibilities', this.value)" class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-xs font-medium leading-relaxed">${escapeHtml(p.responsibilities || '')}</textarea>
        </div>
      </div>
    </div>
  `).join('');

  renderCapitalSocialTable();
}

function renderCapitalSocialTable() {
  const container = document.getElementById('capitalSocialTableBody');
  if (!container) return;

  const partners = currentBusinessPlan.partners || [];
  let totalVal = 0;
  let totalPct = 0;

  container.innerHTML = partners.map(p => {
    totalVal += Number(p.capital_value || 0);
    totalPct += Number(p.capital_percent || 0);
    return `
      <tr class="border-b border-slate-100 hover:bg-slate-50/50">
        <td class="px-4 py-2.5 text-xs font-bold text-slate-900">${escapeHtml(p.name)}</td>
        <td class="px-4 py-2.5 text-xs">
          <input type="number" step="500" value="${p.capital_value || 0}" onchange="updatePartnerField('${p.id}', 'capital_value', Number(this.value)); renderCapitalSocialTable();" class="w-28 px-2 py-1 bg-slate-50 border border-slate-200 rounded text-right font-bold text-slate-800" />
        </td>
        <td class="px-4 py-2.5 text-xs">
          <div class="flex items-center justify-end gap-1">
            <input type="number" step="1" max="100" min="0" value="${p.capital_percent || 0}" onchange="updatePartnerField('${p.id}', 'capital_percent', Number(this.value)); renderCapitalSocialTable();" class="w-20 px-2 py-1 bg-slate-50 border border-slate-200 rounded text-right font-bold text-slate-800" />
            <span class="text-slate-500 font-bold">%</span>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  // Atualiza rodapé com soma e validação de 100%
  const elTotalVal = document.getElementById('capitalTotalVal');
  const elTotalPct = document.getElementById('capitalTotalPct');
  const elStatusPill = document.getElementById('capitalValidationPill');

  if (elTotalVal) elTotalVal.innerText = formatMoney(totalVal);
  if (elTotalPct) elTotalPct.innerText = `${totalPct.toFixed(1)}%`;

  if (elStatusPill) {
    const isValid = Math.abs(totalPct - 100) < 0.05;
    if (isValid) {
      elStatusPill.className = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200";
      elStatusPill.innerHTML = `<i class="fa-solid fa-circle-check"></i> Perfeito: Soma 100%`;
    } else {
      elStatusPill.className = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 animate-pulse";
      elStatusPill.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Atenção: Soma dá ${totalPct.toFixed(1)}% (Deve somar 100%)`;
    }
  }
}

function addNewPartner() {
  const newPartner = {
    id: 'partner-' + Date.now(),
    name: 'Novo Sócio',
    role: 'Sócio Cotista',
    email: '',
    phone: '',
    city_state: 'São José dos Campos - SP',
    address: '',
    profile_bio: '',
    responsibilities: '',
    capital_value: 10000,
    capital_percent: 10
  };
  currentBusinessPlan.partners.push(newPartner);
  renderPartnersList();
  saveBusinessPlan(false);
}

function deletePartner(partnerId) {
  if (!confirm('Deseja realmente remover este sócio?')) return;
  currentBusinessPlan.partners = currentBusinessPlan.partners.filter(p => p.id !== partnerId);
  renderPartnersList();
  saveBusinessPlan(false);
}

function updatePartnerField(partnerId, field, val) {
  const p = currentBusinessPlan.partners.find(item => item.id === partnerId);
  if (p) {
    p[field] = val;
    saveBusinessPlan(false);
  }
}

// =========================================================================
// 3. ANÁLISE DE MERCADO: CONCORRENTES & FORNECEDORES
// =========================================================================

function renderSectionMarket() {
  const m = currentBusinessPlan.market_analysis || {};
  setInputValue('planMarketPersonas', m.client_personas);
  setInputValue('planMarketBehavior', m.client_behavior);
  setInputValue('planMarketScope', m.geographic_scope);

  renderCompetitorsTable();
  renderSuppliersTable();
}

function renderCompetitorsTable() {
  const container = document.getElementById('competitorsTableBody');
  if (!container) return;

  const comps = currentBusinessPlan.market_analysis.competitors || [];
  container.innerHTML = comps.map((c, idx) => `
    <tr class="border-b border-slate-100 hover:bg-slate-50/50 text-xs">
      <td class="px-3 py-2.5 font-bold text-slate-900">
        <input type="text" value="${escapeHtml(c.name)}" onchange="updateCompetitorField(${idx}, 'name', this.value)" class="w-full bg-transparent font-bold text-slate-900 border-0 border-b border-transparent focus:border-cyan-500 focus:bg-white rounded px-1 outline-none" />
      </td>
      <td class="px-3 py-2.5">
        <input type="text" value="${escapeHtml(c.quality)}" onchange="updateCompetitorField(${idx}, 'quality', this.value)" class="w-full bg-transparent border-0 border-b border-transparent focus:border-cyan-500 focus:bg-white rounded px-1 outline-none text-slate-700" />
      </td>
      <td class="px-3 py-2.5">
        <input type="text" value="${escapeHtml(c.price)}" onchange="updateCompetitorField(${idx}, 'price', this.value)" class="w-full bg-transparent border-0 border-b border-transparent focus:border-cyan-500 focus:bg-white rounded px-1 outline-none font-semibold text-emerald-700" />
      </td>
      <td class="px-3 py-2.5">
        <input type="text" value="${escapeHtml(c.channel)}" onchange="updateCompetitorField(${idx}, 'channel', this.value)" class="w-full bg-transparent border-0 border-b border-transparent focus:border-cyan-500 focus:bg-white rounded px-1 outline-none text-slate-600" />
      </td>
      <td class="px-3 py-2.5">
        <input type="text" value="${escapeHtml(c.support)}" onchange="updateCompetitorField(${idx}, 'support', this.value)" class="w-full bg-transparent border-0 border-b border-transparent focus:border-cyan-500 focus:bg-white rounded px-1 outline-none text-slate-600" />
      </td>
      <td class="px-3 py-2.5 text-right">
        <button type="button" onclick="deleteCompetitor(${idx})" class="text-slate-300 hover:text-rose-600 p-1" title="Excluir concorrente">
          <i class="fa-solid fa-trash-can text-xs"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

function addNewCompetitor() {
  currentBusinessPlan.market_analysis.competitors.push({
    name: "Novo Concorrente",
    quality: "Média",
    price: "Sob consulta",
    channel: "Vendas diretas",
    payment: "Faturamento 30 dias",
    support: "Helpdesk",
    services: "Dados avulsos",
    guarantees: "Padrão"
  });
  renderCompetitorsTable();
  saveBusinessPlan(false);
}

function deleteCompetitor(idx) {
  if (!confirm('Deseja excluir este concorrente da tabela comparativa?')) return;
  currentBusinessPlan.market_analysis.competitors.splice(idx, 1);
  renderCompetitorsTable();
  saveBusinessPlan(false);
}

function updateCompetitorField(idx, field, val) {
  if (currentBusinessPlan.market_analysis.competitors[idx]) {
    currentBusinessPlan.market_analysis.competitors[idx][field] = val;
    saveBusinessPlan(false);
  }
}

function renderSuppliersTable() {
  const container = document.getElementById('suppliersTableBody');
  if (!container) return;

  const sups = currentBusinessPlan.market_analysis.suppliers || [];
  container.innerHTML = sups.map((s, idx) => `
    <tr class="border-b border-slate-100 hover:bg-slate-50/50 text-xs">
      <td class="px-3 py-2.5 font-bold text-slate-900">
        <input type="text" value="${escapeHtml(s.name)}" onchange="updateSupplierField(${idx}, 'name', this.value)" class="w-full bg-transparent font-bold text-slate-900 border-0 border-b border-transparent focus:border-cyan-500 focus:bg-white rounded px-1 outline-none" />
      </td>
      <td class="px-3 py-2.5">
        <input type="text" value="${escapeHtml(s.items)}" onchange="updateSupplierField(${idx}, 'items', this.value)" class="w-full bg-transparent border-0 border-b border-transparent focus:border-cyan-500 focus:bg-white rounded px-1 outline-none text-slate-700" />
      </td>
      <td class="px-3 py-2.5">
        <input type="text" value="${escapeHtml(s.price)}" onchange="updateSupplierField(${idx}, 'price', this.value)" class="w-full bg-transparent border-0 border-b border-transparent focus:border-cyan-500 focus:bg-white rounded px-1 outline-none font-semibold text-slate-800" />
      </td>
      <td class="px-3 py-2.5">
        <input type="text" value="${escapeHtml(s.delivery)}" onchange="updateSupplierField(${idx}, 'delivery', this.value)" class="w-full bg-transparent border-0 border-b border-transparent focus:border-cyan-500 focus:bg-white rounded px-1 outline-none text-slate-600" />
      </td>
      <td class="px-3 py-2.5 text-right">
        <button type="button" onclick="deleteSupplier(${idx})" class="text-slate-300 hover:text-rose-600 p-1" title="Excluir fornecedor">
          <i class="fa-solid fa-trash-can text-xs"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

function addNewSupplier() {
  currentBusinessPlan.market_analysis.suppliers.push({
    name: "Novo Fornecedor",
    items: "Serviço de Infra / Software",
    price: "R$ 100/mês",
    payment: "Cartão / Pix",
    delivery: "Imediato",
    location: "Brasil"
  });
  renderSuppliersTable();
  saveBusinessPlan(false);
}

function deleteSupplier(idx) {
  if (!confirm('Deseja excluir este fornecedor?')) return;
  currentBusinessPlan.market_analysis.suppliers.splice(idx, 1);
  renderSuppliersTable();
  saveBusinessPlan(false);
}

function updateSupplierField(idx, field, val) {
  if (currentBusinessPlan.market_analysis.suppliers[idx]) {
    currentBusinessPlan.market_analysis.suppliers[idx][field] = val;
    saveBusinessPlan(false);
  }
}

// =========================================================================
// 4. PLANO DE MARKETING & PREÇOS
// =========================================================================

function renderSectionMarketing() {
  const m = currentBusinessPlan.marketing_plan || {};
  setInputValue('planMktProductsDesc', m.products_description);
  setInputValue('planMktPromo', m.promotional_strategies);
  setInputValue('planMktCommercial', m.commercial_structure);

  renderPricingTable();
}

function renderPricingTable() {
  const container = document.getElementById('pricingTableBody');
  if (!container) return;

  const prices = currentBusinessPlan.marketing_plan.pricing_strategy || [];
  container.innerHTML = prices.map((p, idx) => `
    <tr class="border-b border-slate-100 hover:bg-slate-50/50 text-xs">
      <td class="px-4 py-3 font-bold text-slate-900">
        <input type="text" value="${escapeHtml(p.product)}" onchange="updatePricingField(${idx}, 'product', this.value)" class="w-full bg-transparent font-bold text-slate-900 border-0 border-b border-transparent focus:border-cyan-500 focus:bg-white rounded px-1 outline-none" />
      </td>
      <td class="px-4 py-3">
        <input type="text" value="${escapeHtml(p.price)}" onchange="updatePricingField(${idx}, 'price', this.value)" class="w-full bg-transparent font-black text-emerald-700 border-0 border-b border-transparent focus:border-cyan-500 focus:bg-white rounded px-1 outline-none" />
      </td>
      <td class="px-4 py-3">
        <input type="text" value="${escapeHtml(p.strategy)}" onchange="updatePricingField(${idx}, 'strategy', this.value)" class="w-full bg-transparent text-slate-600 border-0 border-b border-transparent focus:border-cyan-500 focus:bg-white rounded px-1 outline-none" />
      </td>
      <td class="px-4 py-3 text-right">
        <button type="button" onclick="deletePricingRow(${idx})" class="text-slate-300 hover:text-rose-600 p-1" title="Excluir produto">
          <i class="fa-solid fa-trash-can text-xs"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

function addNewPricingRow() {
  currentBusinessPlan.marketing_plan.pricing_strategy.push({
    product: "Novo Serviço",
    price: "R$ 3.000",
    strategy: "Precificação por valor percebido"
  });
  renderPricingTable();
  saveBusinessPlan(false);
}

function deletePricingRow(idx) {
  if (!confirm('Deseja excluir este item de preço?')) return;
  currentBusinessPlan.marketing_plan.pricing_strategy.splice(idx, 1);
  renderPricingTable();
  saveBusinessPlan(false);
}

function updatePricingField(idx, field, val) {
  if (currentBusinessPlan.marketing_plan.pricing_strategy[idx]) {
    currentBusinessPlan.marketing_plan.pricing_strategy[idx][field] = val;
    saveBusinessPlan(false);
  }
}

// =========================================================================
// 5. PLANO OPERACIONAL
// =========================================================================

function renderSectionOperational() {
  const op = currentBusinessPlan.operational_plan || {};
  setInputValue('planOpLayout', op.layout_architecture);
  setInputValue('planOpCapacity', op.capacity);
  setInputValue('planOpProcesses', op.processes);

  renderStaffTable();
}

function renderStaffTable() {
  const container = document.getElementById('staffTableBody');
  if (!container) return;

  const staff = currentBusinessPlan.operational_plan.staff_requirements || [];
  container.innerHTML = staff.map((s, idx) => `
    <tr class="border-b border-slate-100 hover:bg-slate-50/50 text-xs">
      <td class="px-4 py-3 font-bold text-slate-900">
        <input type="text" value="${escapeHtml(s.role)}" onchange="updateStaffField(${idx}, 'role', this.value)" class="w-full bg-transparent font-bold text-slate-900 border-0 border-b border-transparent focus:border-cyan-500 focus:bg-white rounded px-1 outline-none" />
      </td>
      <td class="px-4 py-3">
        <input type="text" value="${escapeHtml(s.qualification)}" onchange="updateStaffField(${idx}, 'qualification', this.value)" class="w-full bg-transparent text-slate-700 border-0 border-b border-transparent focus:border-cyan-500 focus:bg-white rounded px-1 outline-none" />
      </td>
      <td class="px-4 py-3 text-center">
        <input type="number" min="1" value="${s.quantity || 1}" onchange="updateStaffField(${idx}, 'quantity', Number(this.value))" class="w-16 text-center font-bold px-2 py-1 bg-slate-50 border border-slate-200 rounded" />
      </td>
      <td class="px-4 py-3">
        <input type="text" value="${escapeHtml(s.resp || '')}" onchange="updateStaffField(${idx}, 'resp', this.value)" class="w-full bg-transparent font-semibold text-cyan-800 border-0 border-b border-transparent focus:border-cyan-500 focus:bg-white rounded px-1 outline-none" />
      </td>
      <td class="px-4 py-3 text-right">
        <button type="button" onclick="deleteStaffRow(${idx})" class="text-slate-300 hover:text-rose-600 p-1" title="Excluir cargo">
          <i class="fa-solid fa-trash-can text-xs"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

function addNewStaffRow() {
  currentBusinessPlan.operational_plan.staff_requirements.push({
    role: "Novo Cargo / Função",
    qualification: "Nível Superior / Técnico",
    quantity: 1,
    resp: "Contratação Futura"
  });
  renderStaffTable();
  saveBusinessPlan(false);
}

function deleteStaffRow(idx) {
  if (!confirm('Deseja excluir este cargo da tabela?')) return;
  currentBusinessPlan.operational_plan.staff_requirements.splice(idx, 1);
  renderStaffTable();
  saveBusinessPlan(false);
}

function updateStaffField(idx, field, val) {
  if (currentBusinessPlan.operational_plan.staff_requirements[idx]) {
    currentBusinessPlan.operational_plan.staff_requirements[idx][field] = val;
    saveBusinessPlan(false);
  }
}

// =========================================================================
// 6. PLANO FINANCEIRO ULTRA-DETALHADO & CÁLCULOS AUTOMÁTICOS
// =========================================================================

function renderSectionFinancial() {
  renderCapexTable();
  renderPreOpTable();
  hydrateFinancialInputs();
  recalculateAllFinancials();
}

function renderCapexTable() {
  const container = document.getElementById('capexTableBody');
  if (!container) return;

  const items = currentBusinessPlan.financial_plan.capex_investments || [];
  let totalCapex = 0;

  container.innerHTML = items.map((item, idx) => {
    const itemTotal = (Number(item.qty) || 1) * (Number(item.unit_val) || 0);
    totalCapex += itemTotal;
    return `
      <tr class="border-b border-slate-100 hover:bg-slate-50/50 text-xs">
        <td class="px-4 py-2.5 font-bold text-slate-800">
          <input type="text" value="${escapeHtml(item.item)}" onchange="updateCapexField(${idx}, 'item', this.value)" class="w-full bg-transparent border-0 border-b border-transparent focus:border-cyan-500 focus:bg-white rounded px-1 outline-none" />
        </td>
        <td class="px-4 py-2.5 text-center">
          <input type="number" min="1" value="${item.qty || 1}" onchange="updateCapexField(${idx}, 'qty', Number(this.value)); renderCapexTable(); recalculateAllFinancials();" class="w-14 text-center px-1 py-1 bg-slate-50 border border-slate-200 rounded font-bold" />
        </td>
        <td class="px-4 py-2.5 text-right">
          <input type="number" step="100" value="${item.unit_val || 0}" onchange="updateCapexField(${idx}, 'unit_val', Number(this.value)); renderCapexTable(); recalculateAllFinancials();" class="w-24 text-right px-1 py-1 bg-slate-50 border border-slate-200 rounded font-bold" />
        </td>
        <td class="px-4 py-2.5 text-right font-black text-slate-900">
          ${formatMoney(itemTotal)}
        </td>
        <td class="px-4 py-2.5 text-right">
          <button type="button" onclick="deleteCapexRow(${idx})" class="text-slate-300 hover:text-rose-600 p-1" title="Excluir item">
            <i class="fa-solid fa-trash-can text-xs"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');

  const elTotal = document.getElementById('capexTotalDisplay');
  if (elTotal) elTotal.innerText = formatMoney(totalCapex);
}

function addNewCapexRow() {
  currentBusinessPlan.financial_plan.capex_investments.push({
    item: "Novo Equipamento / Móvel",
    qty: 1,
    unit_val: 3000,
    total: 3000
  });
  renderCapexTable();
  recalculateAllFinancials();
  saveBusinessPlan(false);
}

function deleteCapexRow(idx) {
  if (!confirm('Deseja excluir este item de investimento fixo?')) return;
  currentBusinessPlan.financial_plan.capex_investments.splice(idx, 1);
  renderCapexTable();
  recalculateAllFinancials();
  saveBusinessPlan(false);
}

function updateCapexField(idx, field, val) {
  if (currentBusinessPlan.financial_plan.capex_investments[idx]) {
    currentBusinessPlan.financial_plan.capex_investments[idx][field] = val;
    saveBusinessPlan(false);
  }
}

function renderPreOpTable() {
  const container = document.getElementById('preOpTableBody');
  if (!container) return;

  const items = currentBusinessPlan.financial_plan.pre_operational_investments || [];
  let totalPreOp = 0;

  container.innerHTML = items.map((item, idx) => {
    totalPreOp += Number(item.val || 0);
    return `
      <tr class="border-b border-slate-100 hover:bg-slate-50/50 text-xs">
        <td class="px-4 py-2.5 font-bold text-slate-800">
          <input type="text" value="${escapeHtml(item.item)}" onchange="updatePreOpField(${idx}, 'item', this.value)" class="w-full bg-transparent border-0 border-b border-transparent focus:border-cyan-500 focus:bg-white rounded px-1 outline-none" />
        </td>
        <td class="px-4 py-2.5 text-right font-black text-slate-900">
          <input type="number" step="500" value="${item.val || 0}" onchange="updatePreOpField(${idx}, 'val', Number(this.value)); renderPreOpTable(); recalculateAllFinancials();" class="w-28 text-right px-1 py-1 bg-slate-50 border border-slate-200 rounded font-bold" />
        </td>
        <td class="px-4 py-2.5 text-right">
          <button type="button" onclick="deletePreOpRow(${idx})" class="text-slate-300 hover:text-rose-600 p-1" title="Excluir taxa/despesa">
            <i class="fa-solid fa-trash-can text-xs"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');

  const elTotal = document.getElementById('preOpTotalDisplay');
  if (elTotal) elTotal.innerText = formatMoney(totalPreOp);
}

function addNewPreOpRow() {
  currentBusinessPlan.financial_plan.pre_operational_investments.push({
    item: "Nova Taxa / Desenvolvimento",
    val: 2500
  });
  renderPreOpTable();
  recalculateAllFinancials();
  saveBusinessPlan(false);
}

function deletePreOpRow(idx) {
  if (!confirm('Deseja excluir este item pré-operacional?')) return;
  currentBusinessPlan.financial_plan.pre_operational_investments.splice(idx, 1);
  renderPreOpTable();
  recalculateAllFinancials();
  saveBusinessPlan(false);
}

function updatePreOpField(idx, field, val) {
  if (currentBusinessPlan.financial_plan.pre_operational_investments[idx]) {
    currentBusinessPlan.financial_plan.pre_operational_investments[idx][field] = val;
    saveBusinessPlan(false);
  }
}

function hydrateFinancialInputs() {
  const inp = currentBusinessPlan.financial_plan.inputs || {};
  for (const [key, val] of Object.entries(inp)) {
    const el = document.getElementById(`finInput_${key}`);
    if (el) el.value = val;
  }
}

// Coleta e Recálculo Global em Tempo Real
function recalculateAllFinancials() {
  if (!currentBusinessPlan) return;

  const inp = currentBusinessPlan.financial_plan.inputs || {};

  // Atualiza valores a partir dos inputs na tela se existirem
  for (const key of Object.keys(inp)) {
    const el = document.getElementById(`finInput_${key}`);
    if (el) inp[key] = Number(el.value);
  }

  // Totais de Capex e Pré-Op
  const capexTotal = (currentBusinessPlan.financial_plan.capex_investments || []).reduce((acc, i) => acc + ((Number(i.qty) || 1) * (Number(i.unit_val) || 0)), 0);
  const preOpTotal = (currentBusinessPlan.financial_plan.pre_operational_investments || []).reduce((acc, i) => acc + Number(i.val || 0), 0);

  // 1. Receitas
  const annualSubscribers = Number(inp.annualSubscribers || 20);
  const annualPrice = Number(inp.annualPrice || 12000);
  const saasAnnual = annualSubscribers * annualPrice;
  const mrrEquiv = saasAnnual / 12;

  const appliedTotal = Number(inp.appliedIntelProjects || 6) * Number(inp.appliedIntelAvgPrice || 8000);
  const customTotal = Number(inp.customResearchProjects || 2) * Number(inp.customResearchAvgPrice || 18000);
  const blogTotal = Number(inp.blogSponsorships || 8) * Number(inp.blogSponsorshipAvgPrice || 2500);

  const grossRevenue = saasAnnual + appliedTotal + customTotal + blogTotal;
  const taxes = grossRevenue * (Number(inp.taxRatePct || 6.0) / 100);
  const netRevenue = grossRevenue - taxes;

  // 2. Custos Variáveis
  const cogsSaaS = annualSubscribers * Number(inp.cogsPerUserYear || 380);
  const comissao = saasAnnual * (Number(inp.affiliateCommissionPct || 20.0) / 100);
  const gateway = grossRevenue * (Number(inp.gatewayRatePct || 3.2) / 100);
  const directCosts = Number(inp.directServiceCosts || 12000);
  const totalVariable = cogsSaaS + comissao + gateway + directCosts;

  // 3. Margem de Contribuição
  const margemContrib = netRevenue - totalVariable;
  const margemContribPct = netRevenue > 0 ? (margemContrib / netRevenue) * 100 : 0;
  const margemUnitContrato = annualPrice * (1 - (Number(inp.taxRatePct) + Number(inp.affiliateCommissionPct) + Number(inp.gatewayRatePct)) / 100) - Number(inp.cogsPerUserYear);

  // 4. Custos Fixos (Opex)
  const fixosMensais = Number(inp.proLaboreLeonardo || 6000) + Number(inp.proLaboreMayumi || 5000) +
    Number(inp.staffPayroll || 3500) + Number(inp.cloudTools || 1200) + Number(inp.accounting || 800) +
    Number(inp.officeInternet || 600) + Number(inp.otherFixed || 900);
  const fixosAnuais = fixosMensais * 12;
  const deprecAnual = Number(inp.annualDepreciation || 4500);

  // 5. EBITDA e Lucro Líquido
  const ebitda = margemContrib - fixosAnuais;
  const lucroLiquidoAnual = ebitda - deprecAnual;
  const lucroLiquidoMensal = lucroLiquidoAnual / 12;
  const margemLiquidaPct = grossRevenue > 0 ? (lucroLiquidoAnual / grossRevenue) * 100 : 0;

  // 6. Capital de Giro
  const diasCiclo = Math.max(1, Number(inp.avgSalesReceiptDays || 15) - Number(inp.avgPaymentDays || 25) + 30);
  const custoDiario = (fixosAnuais + totalVariable) / 365;
  const nlcg = custoDiario * diasCiclo;
  const reservaContingencia = fixosMensais * 3;
  const capitalGiroTotal = nlcg + reservaContingencia;

  // 7. Investimento Total
  const investimentoTotal = capexTotal + preOpTotal + capitalGiroTotal;

  // 8. Indicadores Oficiais de Viabilidade
  const peReaisAnual = margemContribPct > 0 ? (fixosAnuais / (margemContribPct / 100)) : 0;
  const peReaisMensal = peReaisAnual / 12;
  const peAssinantes = margemUnitContrato > 0 ? Math.ceil(fixosAnuais / margemUnitContrato) : 0;

  const lucratividadePct = grossRevenue > 0 ? (lucroLiquidoAnual / grossRevenue) * 100 : 0;
  const rentabilidadePct = investimentoTotal > 0 ? (lucroLiquidoAnual / investimentoTotal) * 100 : 0;
  const paybackMeses = lucroLiquidoMensal > 0 ? Number((investimentoTotal / lucroLiquidoMensal).toFixed(1)) : 999;

  // Atualização Visual dos Cards no Topo e DRE
  setText('kpiGrossRevenue', formatMoney(grossRevenue));
  setText('kpiMrrEquiv', `${formatMoney(mrrEquiv)} / mês`);
  setText('kpiNetProfit', formatMoney(lucroLiquidoAnual));
  setText('kpiNetProfitMonthly', `+ ${formatMoney(lucroLiquidoMensal)} / mês`);
  setText('kpiBreakEven', `${peAssinantes} Assinantes (${formatMoney(peReaisMensal)}/mês)`);
  setText('kpiPayback', `${paybackMeses} meses`);

  // Tabela DRE
  setText('dreGrossRevenue', formatMoney(grossRevenue));
  setText('dreTaxes', `- ${formatMoney(taxes)}`);
  setText('dreNetRevenue', formatMoney(netRevenue));
  setText('dreVariableCosts', `- ${formatMoney(totalVariable)}`);
  setText('dreContributionMargin', `${formatMoney(margemContrib)} (${margemContribPct.toFixed(1)}%)`);
  setText('dreFixedCosts', `- ${formatMoney(fixosAnuais)}`);
  setText('dreDepreciation', `- ${formatMoney(deprecAnual)}`);
  setText('dreEbitda', formatMoney(ebitda));
  setText('dreNetProfit', formatMoney(lucroLiquidoAnual));
  setText('dreNetMargin', `${margemLiquidaPct.toFixed(1)}%`);

  // Cards de Viabilidade
  setText('viaPeReais', formatMoney(peReaisAnual));
  setText('viaPeClientes', `${peAssinantes} assinantes de R$ 12k`);
  setText('viaLucratividade', `${lucratividadePct.toFixed(1)}%`);
  setText('viaRentabilidade', `${rentabilidadePct.toFixed(1)}%`);
  setText('viaPayback', `${paybackMeses} Meses`);
  setText('viaInvestimentoTotal', formatMoney(investimentoTotal));
  setText('viaCapitalGiro', formatMoney(capitalGiroTotal));

  // Renderiza Gráficos
  renderDreBreakdownChart(fixosAnuais, totalVariable, taxes, Math.max(0, lucroLiquidoAnual));
  renderBreakEvenChart(peReaisAnual, grossRevenue, fixosAnuais, totalVariable);
}

// =========================================================================
// 7. SIMULADOR DE CENÁRIOS INTERATIVO COM SLIDERS
// =========================================================================

function updateScenarioSimulator() {
  const sliderSub = document.getElementById('simSliderSubscribers');
  const sliderPrice = document.getElementById('simSliderPrice');
  const sliderApplied = document.getElementById('simSliderApplied');
  const sliderCostVar = document.getElementById('simSliderCostVar');

  const baseSub = sliderSub ? Number(sliderSub.value) : 20;
  const basePrice = sliderPrice ? Number(sliderPrice.value) : 12000;
  const baseApplied = sliderApplied ? Number(sliderApplied.value) : 6;
  const costVarPct = sliderCostVar ? Number(sliderCostVar.value) : 0;

  // Atualiza labels dos sliders
  setText('simLabelSubscribers', `${baseSub} clientes`);
  setText('simLabelPrice', formatMoney(basePrice));
  setText('simLabelApplied', `${baseApplied} projetos`);
  setText('simLabelCostVar', `${costVarPct >= 0 ? '+' : ''}${costVarPct}%`);

  // 1. Cenário Pessimista (-50% clientes, -15% preço, +15% custos)
  const pessSub = Math.max(4, Math.floor(baseSub * 0.5));
  const pessPrice = Math.floor(basePrice * 0.85);
  const pessApplied = Math.max(1, Math.floor(baseApplied * 0.3));
  const pessGross = (pessSub * pessPrice) + (pessApplied * 6000) + (1 * 15000) + (2 * 2000);
  const pessFixed = (17000 * 12) * (1 + (costVarPct + 15) / 100);
  const pessVar = (pessSub * 450) + (pessGross * 0.28);
  const pessProfit = (pessGross * 0.94) - pessVar - pessFixed - 4500;
  const pessMargin = pessGross > 0 ? (pessProfit / pessGross) * 100 : 0;

  // 2. Cenário Provável (Valores dos Sliders)
  const provGross = (baseSub * basePrice) + (baseApplied * 8000) + (2 * 18000) + (8 * 2500);
  const provFixed = (17000 * 12) * (1 + costVarPct / 100);
  const provVar = (baseSub * 380) + (provGross * 0.25);
  const provProfit = (provGross * 0.94) - provVar - provFixed - 4500;
  const provMargin = provGross > 0 ? (provProfit / provGross) * 100 : 0;

  // 3. Cenário Otimista (+60% clientes, +15% preço, custos fixos estáveis)
  const otimSub = Math.floor(baseSub * 1.6);
  const otimPrice = Math.floor(basePrice * 1.15);
  const otimApplied = Math.floor(baseApplied * 1.8);
  const otimGross = (otimSub * otimPrice) + (otimApplied * 10000) + (4 * 22000) + (16 * 3000);
  const otimFixed = (17000 * 12) * (1 + (costVarPct - 5) / 100);
  const otimVar = (otimSub * 350) + (otimGross * 0.23);
  const otimProfit = (otimGross * 0.94) - otimVar - otimFixed - 4500;
  const otimMargin = otimGross > 0 ? (otimProfit / otimGross) * 100 : 0;

  // Atualiza Cards do Simulador
  setText('simPessGross', formatMoney(pessGross));
  setText('simPessProfit', formatMoney(pessProfit));
  setText('simPessMargin', `${pessMargin.toFixed(1)}%`);

  setText('simProvGross', formatMoney(provGross));
  setText('simProvProfit', formatMoney(provProfit));
  setText('simProvMargin', `${provMargin.toFixed(1)}%`);

  setText('simOtimGross', formatMoney(otimGross));
  setText('simOtimProfit', formatMoney(otimProfit));
  setText('simOtimMargin', `${otimMargin.toFixed(1)}%`);

  // Gráfico do Simulador
  renderScenarioChart(
    [pessGross, provGross, otimGross],
    [pessFixed + pessVar, provFixed + provVar, otimFixed + otimVar],
    [pessProfit, provProfit, otimProfit]
  );
}

// =========================================================================
// 8. MATRIZ SWOT (F.O.F.A.) DINÂMICA
// =========================================================================

function renderSwotMatrix() {
  const quadrants = ['forca', 'oportunidade', 'fraqueza', 'ameaca'];
  const items = currentBusinessPlan.swot || [];

  quadrants.forEach(quad => {
    const container = document.getElementById(`swotList_${quad}`);
    if (!container) return;

    const filtered = items.filter(i => i.quadrant === quad);
    container.innerHTML = filtered.map(item => `
      <div class="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex items-start justify-between gap-2 text-xs group hover:border-cyan-400 transition-colors">
        <div class="space-y-1">
          <p class="text-slate-800 font-semibold leading-snug">${escapeHtml(item.description)}</p>
          <span class="inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${item.impact_level === 'alto' ? 'bg-rose-50 text-rose-700 border border-rose-200' : (item.impact_level === 'medio' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-50 text-slate-600 border border-slate-200')}">
            Impacto ${item.impact_level}
          </span>
        </div>
        <button type="button" onclick="deleteSwotItem('${item.id}')" class="text-slate-300 hover:text-rose-600 transition-colors p-1" title="Remover item">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    `).join('');
  });
}

function addNewSwotItem(quadrant) {
  const desc = prompt(`Adicionar item no quadrante (${quadrant.toUpperCase()}):`);
  if (!desc || !desc.trim()) return;

  const newItem = {
    id: 'swot-' + Date.now(),
    quadrant: quadrant,
    description: desc.trim(),
    impact_level: 'alto'
  };
  currentBusinessPlan.swot.push(newItem);
  renderSwotMatrix();
  saveBusinessPlan(false);
}

function deleteSwotItem(id) {
  currentBusinessPlan.swot = currentBusinessPlan.swot.filter(i => i.id !== id);
  renderSwotMatrix();
  saveBusinessPlan(false);
}

// =========================================================================
// 9. AVALIAÇÃO & GOVERNANÇA
// =========================================================================

function renderSectionEvaluation() {
  const ev = currentBusinessPlan.evaluation || {};
  setInputValue('planEvalReflection', ev.final_reflection);
}

// =========================================================================
// 10. GRÁFICOS INTERATIVOS (CHART.JS)
// =========================================================================

function renderDreBreakdownChart(fixos, variaveis, tributos, lucro) {
  const ctx = document.getElementById('dreBreakdownChartCanvas');
  if (!ctx || typeof Chart === 'undefined') return;

  if (dreChartInstance) dreChartInstance.destroy();

  dreChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Custos Fixos', 'Custos Variáveis & COGS', 'Impostos Simples', 'Lucro Líquido'],
      datasets: [{
        data: [fixos, variaveis, tributos, lucro],
        backgroundColor: ['#f43f5e', '#f59e0b', '#8b5cf6', '#10b981'],
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { font: { size: 10, weight: 'bold' } } }
      },
      cutout: '65%'
    }
  });
}

function renderBreakEvenChart(peReais, receitaAtual, fixos, variaveis) {
  const ctx = document.getElementById('breakEvenChartCanvas');
  if (!ctx || typeof Chart === 'undefined') return;

  if (breakEvenChartInstance) breakEvenChartInstance.destroy();

  const labels = ['0 Assinantes', 'Ponto Equilíbrio', 'Meta Atual (20 Assinantes)', 'Meta 40 Assinantes'];
  const receita = [0, peReais, receitaAtual, receitaAtual * 2];
  const custoTotal = [fixos, peReais, fixos + variaveis, fixos + (variaveis * 1.8)];

  breakEvenChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Receita Operacional',
          data: receita,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.2
        },
        {
          label: 'Custo Total (Fixos + Variáveis)',
          data: custoTotal,
          borderColor: '#f43f5e',
          backgroundColor: 'transparent',
          borderWidth: 2.5,
          borderDash: [5, 5],
          tension: 0.2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top', labels: { font: { size: 10, weight: 'bold' } } }
      },
      scales: {
        y: { ticks: { callback: v => `R$ ${(v/1000).toFixed(0)}k` } }
      }
    }
  });
}

function renderScenarioChart(receitas, custos, lucros) {
  const ctx = document.getElementById('scenarioComparisonChartCanvas');
  if (!ctx || typeof Chart === 'undefined') return;

  if (scenarioChartInstance) scenarioChartInstance.destroy();

  scenarioChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Pessimista', 'Provável (Base)', 'Otimista'],
      datasets: [
        { label: 'Receita Bruta', data: receitas, backgroundColor: '#0ea5e9' },
        { label: 'Custos Totais', data: custos, backgroundColor: '#f43f5e' },
        { label: 'Lucro Líquido', data: lucros, backgroundColor: '#10b981' }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top', labels: { font: { size: 10, weight: 'bold' } } }
      },
      scales: {
        y: { ticks: { callback: v => `R$ ${(v/1000).toFixed(0)}k` } }
      }
    }
  });
}

// =========================================================================
// 11. EXPORTAÇÃO PDF OFICIAL SEBRAE
// =========================================================================

function exportBusinessPlanPDF() {
  saveBusinessPlan(false);
  const element = document.getElementById('tab-plan');
  if (!element) return;

  if (typeof html2pdf !== 'undefined') {
    const opt = {
      margin: [10, 10, 10, 10],
      filename: 'Plano_de_Negocios_Radar_Sao_Jose_SEBRAE.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    if (typeof showToast === 'function') {
      showToast('Gerando PDF formatado no padrão SEBRAE...', 'info');
    }
    html2pdf().set(opt).from(element).save().then(() => {
      if (typeof showToast === 'function') {
        showToast('PDF exportado com sucesso!', 'success');
      }
    }).catch(err => {
      console.warn("Falha no html2pdf, abrindo impressão nativa:", err);
      window.print();
    });
  } else {
    window.print();
  }
}

// =========================================================================
// COLETA DE INPUTS & UTILITÁRIOS
// =========================================================================

function collectFormInputs() {
  if (!currentBusinessPlan) return;

  const ex = currentBusinessPlan.executive_summary;
  ex.business_description = getInputValue('planExecBusinessDesc', ex.business_description);
  ex.mission = getInputValue('planExecMission', ex.mission);
  ex.legal_form = getInputValue('planExecLegalForm', ex.legal_form);
  ex.tax_detail = getInputValue('planExecTaxDetail', ex.tax_detail);
  ex.location = getInputValue('planExecLocation', ex.location);
  ex.funding_sources = getInputValue('planExecFunding', ex.funding_sources);

  const m = currentBusinessPlan.market_analysis;
  m.client_personas = getInputValue('planMarketPersonas', m.client_personas);
  m.client_behavior = getInputValue('planMarketBehavior', m.client_behavior);
  m.geographic_scope = getInputValue('planMarketScope', m.geographic_scope);

  const mkt = currentBusinessPlan.marketing_plan;
  mkt.products_description = getInputValue('planMktProductsDesc', mkt.products_description);
  mkt.promotional_strategies = getInputValue('planMktPromo', mkt.promotional_strategies);
  mkt.commercial_structure = getInputValue('planMktCommercial', mkt.commercial_structure);

  const op = currentBusinessPlan.operational_plan;
  op.layout_architecture = getInputValue('planOpLayout', op.layout_architecture);
  op.capacity = getInputValue('planOpCapacity', op.capacity);
  op.processes = getInputValue('planOpProcesses', op.processes);

  const ev = currentBusinessPlan.evaluation;
  ev.final_reflection = getInputValue('planEvalReflection', ev.final_reflection);
}

function setInputValue(id, val) {
  const el = document.getElementById(id);
  if (el && val !== undefined) el.value = val;
}

function getInputValue(id, fallback = '') {
  const el = document.getElementById(id);
  return el ? el.value : fallback;
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.innerText = text;
}

function formatMoney(num) {
  return (Number(num) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
