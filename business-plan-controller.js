// =========================================================================
// RADAR SÃO JOSÉ - CONTROLADOR DO PLANO DE NEGÓCIOS SEBRAE & MONDAY.COM
// Versão: 2026.2-executive
// Desenvolvido para: Leonardo Venâncio & Mayumi Nagano
// =========================================================================

const PLAN_STORAGE_KEY_V6 = 'radarsaojose_business_plan_sebrae_v6';

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
    // 5.1 Investimentos Fixos (Tabelas A, B, C)
    investimentos_fixos_a_maquinas: [
      { item: "Notebooks de Alta Performance (Apple M3 / Dell XPS)", qty: 2, unit_val: 12000 },
      { item: "Monitores 4K & Hubs Thunderbolt de Alta Resolução", qty: 2, unit_val: 2500 },
      { item: "Kits de Pesquisa de Campo & Gravadores Digitais de Áudio/Vídeo", qty: 2, unit_val: 1500 },
      { item: "Infraestrutura de Rede, Servidor de Backup Local & Segurança", qty: 1, unit_val: 5000 }
    ],
    investimentos_fixos_b_moveis: [
      { item: "Estações de Trabalho Ergonômicas & Cadeiras NR-17", qty: 2, unit_val: 2000 },
      { item: "Mobiliário Auxiliar, Arquivos e Suportes", qty: 1, unit_val: 1500 }
    ],
    investimentos_fixos_c_veiculos: [],

    // 5.2 Capital de Giro (Tabela A Estoque Inicial + Tabela B Prazos & Caixa Mínimo)
    estoque_inicial: [
      { item: "Kits de Boas-Vindas & Dossiês Impressos Executivos", qty: 50, unit_val: 40 },
      { item: "Material Gráfico de Apoio a Pesquisadores de Campo", qty: 100, unit_val: 15 }
    ],
    prazos_vendas: [
      { prazo: "À vista (Pix / Cartão 1x)", pct_vendas: 40, dias: 0 },
      { prazo: "30 dias (Boleto / Faturamento)", pct_vendas: 45, dias: 30 },
      { prazo: "60 dias (Parcelamento Corporativo)", pct_vendas: 15, dias: 60 }
    ],
    prazos_compras: [
      { prazo: "À vista (Pix / Débito)", pct_compras: 30, dias: 0 },
      { prazo: "30 dias (Faturamento Fornecedores)", pct_compras: 70, dias: 30 }
    ],
    necessidade_dias_estoque: 5,

    // 5.3 Investimentos Pré-Operacionais
    pre_operational_investments: [
      { item: "Registro de Marca no INPI (Radar São José)", val: 3500 },
      { item: "Assessoria Jurídica, Contratos SaaS & Termos LGPD", val: 5500 },
      { item: "Pesquisa de Campo Primária (722 Munícipes em 6 Regiões)", val: 12000 },
      { item: "Identidade Visual, Branding & Domínios Corporativos", val: 4000 }
    ],

    // 5.4 Fontes de Recursos
    fontes_recursos: [
      { fonte: "Recursos Próprios - Leonardo Venâncio (Sócio Administrador)", val: 48000 },
      { fonte: "Recursos Próprios - Mayumi Nagano (Sócia Pesquisadora)", val: 32000 },
      { fonte: "Reinvestimento de Fluxo de Caixa Inicial do Negócio", val: 15000 }
    ],

    // 5.5 Estimativa de Faturamento Mensal (e 5.6 Insumos Unitários)
    faturamento_produtos: [
      {
        name: "Assinatura Anual Radar São José (SaaS B2B)",
        qty: 20,
        price: 12000,
        is_subscription: true,
        unit_cogs: 380,
        insumos: [
          { name: "Hospedagem Vercel Edge & Supabase Pro", qty: 1, unit_cost: 150 },
          { name: "Tokens de IA Groq LPU & Gemini Flash", qty: 1, unit_cost: 130 },
          { name: "Suporte e Ativação por Usuário", qty: 1, unit_cost: 100 }
        ]
      },
      {
        name: "Estudos de Inteligência Aplicada (Sob Demanda)",
        qty: 6,
        price: 8000,
        is_subscription: false,
        unit_cogs: 800,
        insumos: [
          { name: "Mineração de Microdados & Diagramação de Dossiê", qty: 1, unit_cost: 800 }
        ]
      },
      {
        name: "Pesquisa Personalizada de Campo (SJC)",
        qty: 2,
        price: 18000,
        is_subscription: false,
        unit_cogs: 3000,
        insumos: [
          { name: "Diárias de Pesquisadores de Campo & Tabulação", qty: 1, unit_cost: 3000 }
        ]
      },
      {
        name: "Matéria Patrocinada no Blog do Radar",
        qty: 8,
        price: 2500,
        is_subscription: false,
        unit_cogs: 200,
        insumos: [
          { name: "Revisão Editorial de Dados & Otimização SEO", qty: 1, unit_cost: 200 }
        ]
      }
    ],

    // 5.7 Custos de Comercialização (Impostos & Gastos com Vendas)
    custos_comercializacao_impostos: [
      { name: "Simples Nacional (Serviços TI e Pesquisa - Anexo III/V)", pct: 6.0 }
    ],
    custos_comercializacao_vendas: [
      { name: "Comissão Programa Parceiros Afiliados", pct: 10.0 },
      { name: "Taxas Gateway de Pagamento (Cartão / Pix Asaas)", pct: 3.2 }
    ],

    // 5.9 Custos com Mão de Obra
    mao_de_obra: [
      { role: "Assistente Comercial & SDR B2B (Fase 2)", num_empregados: 1, salario: 2500, encargos_pct: 40.0 }
    ],

    // 5.10 Depreciação
    depreciacao_ativos: [
      { item: "Equipamentos de Informática e Hardware", valor_bem: 34000, vida_util_anos: 5 },
      { item: "Móveis e Utensílios de Escritório", valor_bem: 5500, vida_util_anos: 10 }
    ],

    // 5.11 Custos Fixos Operacionais Mensais
    custos_fixos_operacionais: [
      { name: "Pró-Labore Leonardo Venâncio (CEO & Head Dados)", custo_mensal: 6000 },
      { name: "Pró-Labore Mayumi Nagano (Head Pesquisa & Conteúdo)", custo_mensal: 5000 },
      { name: "Infraestrutura Cloud, Supabase & OpenAI/Groq APIs", custo_mensal: 1200 },
      { name: "Serviços Contábeis Especializados SaaS", custo_mensal: 800 },
      { name: "Internet Fibra Óptica Dedicada & Telefonia", custo_mensal: 600 },
      { name: "Softwares, Ferramentas de Produtividade & Licenças", custo_mensal: 900 }
    ]
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
    const raw = localStorage.getItem(PLAN_STORAGE_KEY_V6);
    if (raw) {
      currentBusinessPlan = JSON.parse(raw);
    }
  } catch (err) {
    console.warn("[Business Plan] Falha ao carregar do localStorage:", err);
  }

  if (!currentBusinessPlan || !currentBusinessPlan.financial_plan || !currentBusinessPlan.financial_plan.faturamento_produtos) {
    currentBusinessPlan = JSON.parse(JSON.stringify(DEFAULT_BUSINESS_PLAN_DATA));
  } else {
    // Garante que o Plano Operacional e Arquitetura completa estejam sempre preenchidos se o cache local estiver vazio
    if (!currentBusinessPlan.operational_plan || 
        !currentBusinessPlan.operational_plan.layout_architecture || 
        currentBusinessPlan.operational_plan.layout_architecture.length < 100) {
      currentBusinessPlan.operational_plan = JSON.parse(JSON.stringify(DEFAULT_BUSINESS_PLAN_DATA.operational_plan));
    }
    // Garante que o quadro de tarefas Monday.com esteja sempre preenchido
    if (!currentBusinessPlan.monday_tasks || !Array.isArray(currentBusinessPlan.monday_tasks) || currentBusinessPlan.monday_tasks.length === 0) {
      currentBusinessPlan.monday_tasks = JSON.parse(JSON.stringify(DEFAULT_BUSINESS_PLAN_DATA.monday_tasks));
    }
    // Garante que a estrutura oficial financeira SEBRAE esteja completa
    if (!currentBusinessPlan.financial_plan.investimentos_fixos_a_maquinas || !currentBusinessPlan.financial_plan.faturamento_produtos) {
      currentBusinessPlan.financial_plan = JSON.parse(JSON.stringify(DEFAULT_BUSINESS_PLAN_DATA.financial_plan));
    }
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
        localStorage.setItem(PLAN_STORAGE_KEY_V6, JSON.stringify(currentBusinessPlan));
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
  localStorage.setItem(PLAN_STORAGE_KEY_V6, JSON.stringify(currentBusinessPlan));

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
  localStorage.setItem(PLAN_STORAGE_KEY_V6, JSON.stringify(currentBusinessPlan));
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
  if (!currentBusinessPlan) {
    currentBusinessPlan = JSON.parse(JSON.stringify(DEFAULT_BUSINESS_PLAN_DATA));
  }
  if (!Array.isArray(currentBusinessPlan.monday_tasks)) {
    currentBusinessPlan.monday_tasks = [];
  }
  const newTask = {
    id: 'task-' + Date.now(),
    title: 'Nova meta de execução do plano',
    responsible: mondayFilterResponsible === 'mayumi' ? 'mayumi' : (mondayFilterResponsible === 'leonardo' ? 'leonardo' : 'ambos'),
    phase: 'Estratégia & Escala',
    status: 'todo',
    priority: 'medium',
    due_date: 'Dez/2026',
    notes: ''
  };
  currentBusinessPlan.monday_tasks.unshift(newTask);
  renderMondayBoard();
  saveBusinessPlan(false);
  if (typeof showToast === 'function') {
    showToast('Nova tarefa adicionada ao quadro!', 'info');
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
  if (!currentBusinessPlan) currentBusinessPlan = JSON.parse(JSON.stringify(DEFAULT_BUSINESS_PLAN_DATA));
  if (!Array.isArray(currentBusinessPlan.partners)) currentBusinessPlan.partners = [];
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
  if (!currentBusinessPlan) currentBusinessPlan = JSON.parse(JSON.stringify(DEFAULT_BUSINESS_PLAN_DATA));
  if (!currentBusinessPlan.market_analysis) currentBusinessPlan.market_analysis = {};
  if (!Array.isArray(currentBusinessPlan.market_analysis.competitors)) currentBusinessPlan.market_analysis.competitors = [];
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
  if (!currentBusinessPlan) currentBusinessPlan = JSON.parse(JSON.stringify(DEFAULT_BUSINESS_PLAN_DATA));
  if (!currentBusinessPlan.market_analysis) currentBusinessPlan.market_analysis = {};
  if (!Array.isArray(currentBusinessPlan.market_analysis.suppliers)) currentBusinessPlan.market_analysis.suppliers = [];
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
  if (!currentBusinessPlan) currentBusinessPlan = JSON.parse(JSON.stringify(DEFAULT_BUSINESS_PLAN_DATA));
  if (!currentBusinessPlan.marketing_plan) currentBusinessPlan.marketing_plan = {};
  if (!Array.isArray(currentBusinessPlan.marketing_plan.pricing_strategy)) currentBusinessPlan.marketing_plan.pricing_strategy = [];
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
  if (!currentBusinessPlan) currentBusinessPlan = JSON.parse(JSON.stringify(DEFAULT_BUSINESS_PLAN_DATA));
  if (!currentBusinessPlan.operational_plan) currentBusinessPlan.operational_plan = {};
  if (!Array.isArray(currentBusinessPlan.operational_plan.staff_requirements)) currentBusinessPlan.operational_plan.staff_requirements = [];
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
// 6. PLANO FINANCEIRO SEBRAE OFICIAL (5.1 A 5.13) & CÁLCULOS AUTOMATIZADOS
// =========================================================================

function renderSectionFinancial() {
  renderSection51InvestimentosFixos();
  renderSection52CapitalDeGiro();
  renderSection53PreOperacional();
  renderSection54FontesRecursos();
  renderSection55Faturamento();
  renderSection56CustosUnitarios();
  renderSection57CustosComercializacao();
  renderSection59MaoDeObra();
  renderSection510Depreciacao();
  renderSection511CustosFixos();
  recalculateAllFinancials();
}

// -------------------------------------------------------------------------
// 5.1 ESTIMATIVA DOS INVESTIMENTOS FIXOS (TABELAS A, B, C)
// -------------------------------------------------------------------------

function renderSection51InvestimentosFixos() {
  renderFixosTable('A', 'fixosTableA_Body', currentBusinessPlan.financial_plan.investimentos_fixos_a_maquinas || []);
  renderFixosTable('B', 'fixosTableB_Body', currentBusinessPlan.financial_plan.investimentos_fixos_b_moveis || []);
  renderFixosTable('C', 'fixosTableC_Body', currentBusinessPlan.financial_plan.investimentos_fixos_c_veiculos || []);
}

function renderFixosTable(tableType, containerId, items) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let subtotal = 0;
  container.innerHTML = items.map((item, idx) => {
    const total = (Number(item.qty) || 0) * (Number(item.unit_val) || 0);
    subtotal += total;
    return `
      <tr class="border-b border-slate-100 hover:bg-slate-50/50 text-xs">
        <td class="px-3 py-2.5 font-bold text-slate-800">
          <input type="text" value="${escapeHtml(item.item)}" onchange="updateFixosField('${tableType}', ${idx}, 'item', this.value)" class="w-full bg-transparent border-0 border-b border-transparent focus:border-cyan-500 focus:bg-white rounded px-1 outline-none" />
        </td>
        <td class="px-3 py-2.5 text-center">
          <input type="number" min="1" value="${item.qty || 1}" onchange="updateFixosField('${tableType}', ${idx}, 'qty', Number(this.value))" class="w-16 text-center px-1.5 py-1 bg-slate-50 border border-slate-200 rounded font-bold" />
        </td>
        <td class="px-3 py-2.5 text-right">
          <input type="number" step="100" value="${item.unit_val || 0}" onchange="updateFixosField('${tableType}', ${idx}, 'unit_val', Number(this.value))" class="w-28 text-right px-1.5 py-1 bg-slate-50 border border-slate-200 rounded font-bold" />
        </td>
        <td class="px-3 py-2.5 text-right font-black text-slate-900">
          ${formatMoney(total)}
        </td>
        <td class="px-3 py-2.5 text-right">
          <button type="button" onclick="deleteFixosRow('${tableType}', ${idx})" class="text-slate-300 hover:text-rose-600 p-1" title="Excluir item">
            <i class="fa-solid fa-trash-can text-xs"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');

  setText(`subtotalFixos${tableType}`, formatMoney(subtotal));
}

function addNewFixosRow(tableType) {
  const f = currentBusinessPlan.financial_plan;
  const key = tableType === 'A' ? 'investimentos_fixos_a_maquinas' : (tableType === 'B' ? 'investimentos_fixos_b_moveis' : 'investimentos_fixos_c_veiculos');
  if (!Array.isArray(f[key])) f[key] = [];
  f[key].push({
    item: tableType === 'A' ? 'Novo Equipamento / Máquina' : (tableType === 'B' ? 'Novo Móvel / Utensílio' : 'Novo Veículo / Ativo'),
    qty: 1,
    unit_val: 2000
  });
  renderSection51InvestimentosFixos();
  recalculateAllFinancials();
  saveBusinessPlan(false);
}

function deleteFixosRow(tableType, idx) {
  const f = currentBusinessPlan.financial_plan;
  const key = tableType === 'A' ? 'investimentos_fixos_a_maquinas' : (tableType === 'B' ? 'investimentos_fixos_b_moveis' : 'investimentos_fixos_c_veiculos');
  if (!confirm('Deseja excluir este item dos investimentos fixos?')) return;
  f[key].splice(idx, 1);
  renderSection51InvestimentosFixos();
  recalculateAllFinancials();
  saveBusinessPlan(false);
}

function updateFixosField(tableType, idx, field, val) {
  const f = currentBusinessPlan.financial_plan;
  const key = tableType === 'A' ? 'investimentos_fixos_a_maquinas' : (tableType === 'B' ? 'investimentos_fixos_b_moveis' : 'investimentos_fixos_c_veiculos');
  if (f[key] && f[key][idx]) {
    f[key][idx][field] = val;
    renderSection51InvestimentosFixos();
    recalculateAllFinancials();
    saveBusinessPlan(false);
  }
}

// -------------------------------------------------------------------------
// 5.2 CAPITAL DE GIRO (ESTOQUE INICIAL + CAIXA MÍNIMO EM 5 PASSOS)
// -------------------------------------------------------------------------

function renderSection52CapitalDeGiro() {
  // Tabela A: Estoque Inicial
  const containerEst = document.getElementById('estoqueTableBody');
  if (containerEst) {
    const items = currentBusinessPlan.financial_plan.estoque_inicial || [];
    let totalEst = 0;
    containerEst.innerHTML = items.map((item, idx) => {
      const total = (Number(item.qty) || 0) * (Number(item.unit_val) || 0);
      totalEst += total;
      return `
        <tr class="border-b border-slate-100 hover:bg-slate-50/50 text-xs">
          <td class="px-3 py-2 font-bold text-slate-800">
            <input type="text" value="${escapeHtml(item.item)}" onchange="updateEstoqueField(${idx}, 'item', this.value)" class="w-full bg-transparent border-0 border-b border-transparent focus:border-cyan-500 focus:bg-white rounded px-1 outline-none" />
          </td>
          <td class="px-3 py-2 text-center">
            <input type="number" min="1" value="${item.qty || 1}" onchange="updateEstoqueField(${idx}, 'qty', Number(this.value))" class="w-16 text-center px-1.5 py-1 bg-slate-50 border border-slate-200 rounded font-bold" />
          </td>
          <td class="px-3 py-2 text-right">
            <input type="number" step="5" value="${item.unit_val || 0}" onchange="updateEstoqueField(${idx}, 'unit_val', Number(this.value))" class="w-24 text-right px-1.5 py-1 bg-slate-50 border border-slate-200 rounded font-bold" />
          </td>
          <td class="px-3 py-2 text-right font-black text-slate-900">${formatMoney(total)}</td>
          <td class="px-3 py-2 text-right">
            <button type="button" onclick="deleteEstoqueRow(${idx})" class="text-slate-300 hover:text-rose-600 p-1"><i class="fa-solid fa-trash-can text-xs"></i></button>
          </td>
        </tr>
      `;
    }).join('');
    setText('totalEstoqueInicialDisplay', formatMoney(totalEst));
  }

  // Passo 1: Contas a Receber
  const containerPV = document.getElementById('prazosVendasTableBody');
  if (containerPV) {
    const prazos = currentBusinessPlan.financial_plan.prazos_vendas || [];
    let pmv = 0;
    containerPV.innerHTML = prazos.map((pv, idx) => {
      const medPond = ((Number(pv.pct_vendas) || 0) / 100) * (Number(pv.dias) || 0);
      pmv += medPond;
      return `
        <tr class="border-b border-slate-100 text-xs">
          <td class="px-3 py-2 font-semibold text-slate-800">
            <input type="text" value="${escapeHtml(pv.prazo)}" onchange="updatePrazoVendaField(${idx}, 'prazo', this.value)" class="w-full bg-transparent border-0 border-b border-transparent focus:border-cyan-500 rounded px-1 outline-none" />
          </td>
          <td class="px-3 py-2 text-center">
            <input type="number" step="5" max="100" min="0" value="${pv.pct_vendas || 0}" onchange="updatePrazoVendaField(${idx}, 'pct_vendas', Number(this.value))" class="w-16 text-center font-bold bg-slate-50 border border-slate-200 rounded px-1 py-0.5" /> %
          </td>
          <td class="px-3 py-2 text-center">
            <input type="number" min="0" value="${pv.dias || 0}" onchange="updatePrazoVendaField(${idx}, 'dias', Number(this.value))" class="w-16 text-center font-bold bg-slate-50 border border-slate-200 rounded px-1 py-0.5" />
          </td>
          <td class="px-3 py-2 text-right font-black text-cyan-800">${medPond.toFixed(1)} dias</td>
          <td class="px-3 py-2 text-right">
            <button type="button" onclick="deletePrazoVendaRow(${idx})" class="text-slate-300 hover:text-rose-600 p-1"><i class="fa-solid fa-trash-can text-xs"></i></button>
          </td>
        </tr>
      `;
    }).join('');
    setText('pmvTotalDisplay', `${pmv.toFixed(1)} dias`);
  }

  // Passo 2: Fornecedores
  const containerPC = document.getElementById('prazosComprasTableBody');
  if (containerPC) {
    const prazos = currentBusinessPlan.financial_plan.prazos_compras || [];
    let pmc = 0;
    containerPC.innerHTML = prazos.map((pc, idx) => {
      const medPond = ((Number(pc.pct_compras) || 0) / 100) * (Number(pc.dias) || 0);
      pmc += medPond;
      return `
        <tr class="border-b border-slate-100 text-xs">
          <td class="px-3 py-2 font-semibold text-slate-800">
            <input type="text" value="${escapeHtml(pc.prazo)}" onchange="updatePrazoCompraField(${idx}, 'prazo', this.value)" class="w-full bg-transparent border-0 border-b border-transparent focus:border-cyan-500 rounded px-1 outline-none" />
          </td>
          <td class="px-3 py-2 text-center">
            <input type="number" step="5" max="100" min="0" value="${pc.pct_compras || 0}" onchange="updatePrazoCompraField(${idx}, 'pct_compras', Number(this.value))" class="w-16 text-center font-bold bg-slate-50 border border-slate-200 rounded px-1 py-0.5" /> %
          </td>
          <td class="px-3 py-2 text-center">
            <input type="number" min="0" value="${pc.dias || 0}" onchange="updatePrazoCompraField(${idx}, 'dias', Number(this.value))" class="w-16 text-center font-bold bg-slate-50 border border-slate-200 rounded px-1 py-0.5" />
          </td>
          <td class="px-3 py-2 text-right font-black text-cyan-800">${medPond.toFixed(1)} dias</td>
          <td class="px-3 py-2 text-right">
            <button type="button" onclick="deletePrazoCompraRow(${idx})" class="text-slate-300 hover:text-rose-600 p-1"><i class="fa-solid fa-trash-can text-xs"></i></button>
          </td>
        </tr>
      `;
    }).join('');
    setText('pmcTotalDisplay', `${pmc.toFixed(1)} dias`);
  }

  // Passo 3: Estoques (dias)
  setInputValue('finInput_diasEstoque', currentBusinessPlan.financial_plan.necessidade_dias_estoque || 5);
}

function addNewEstoqueRow() {
  const f = currentBusinessPlan.financial_plan;
  if (!Array.isArray(f.estoque_inicial)) f.estoque_inicial = [];
  f.estoque_inicial.push({ item: "Novo Item de Estoque", qty: 10, unit_val: 50 });
  renderSection52CapitalDeGiro();
  recalculateAllFinancials();
  saveBusinessPlan(false);
}

function deleteEstoqueRow(idx) {
  const f = currentBusinessPlan.financial_plan;
  if (!confirm('Deseja excluir este item de estoque?')) return;
  f.estoque_inicial.splice(idx, 1);
  renderSection52CapitalDeGiro();
  recalculateAllFinancials();
  saveBusinessPlan(false);
}

function updateEstoqueField(idx, field, val) {
  const f = currentBusinessPlan.financial_plan;
  if (f.estoque_inicial && f.estoque_inicial[idx]) {
    f.estoque_inicial[idx][field] = val;
    renderSection52CapitalDeGiro();
    recalculateAllFinancials();
    saveBusinessPlan(false);
  }
}

function addNewPrazoVendaRow() {
  const f = currentBusinessPlan.financial_plan;
  if (!Array.isArray(f.prazos_vendas)) f.prazos_vendas = [];
  f.prazos_vendas.push({ prazo: "Novo Prazo", pct_vendas: 10, dias: 45 });
  renderSection52CapitalDeGiro();
  recalculateAllFinancials();
  saveBusinessPlan(false);
}

function deletePrazoVendaRow(idx) {
  const f = currentBusinessPlan.financial_plan;
  f.prazos_vendas.splice(idx, 1);
  renderSection52CapitalDeGiro();
  recalculateAllFinancials();
  saveBusinessPlan(false);
}

function updatePrazoVendaField(idx, field, val) {
  const f = currentBusinessPlan.financial_plan;
  if (f.prazos_vendas && f.prazos_vendas[idx]) {
    f.prazos_vendas[idx][field] = val;
    renderSection52CapitalDeGiro();
    recalculateAllFinancials();
    saveBusinessPlan(false);
  }
}

function addNewPrazoCompraRow() {
  const f = currentBusinessPlan.financial_plan;
  if (!Array.isArray(f.prazos_compras)) f.prazos_compras = [];
  f.prazos_compras.push({ prazo: "Novo Prazo Fornecedor", pct_compras: 10, dias: 45 });
  renderSection52CapitalDeGiro();
  recalculateAllFinancials();
  saveBusinessPlan(false);
}

function deletePrazoCompraRow(idx) {
  const f = currentBusinessPlan.financial_plan;
  f.prazos_compras.splice(idx, 1);
  renderSection52CapitalDeGiro();
  recalculateAllFinancials();
  saveBusinessPlan(false);
}

function updatePrazoCompraField(idx, field, val) {
  const f = currentBusinessPlan.financial_plan;
  if (f.prazos_compras && f.prazos_compras[idx]) {
    f.prazos_compras[idx][field] = val;
    renderSection52CapitalDeGiro();
    recalculateAllFinancials();
    saveBusinessPlan(false);
  }
}

// -------------------------------------------------------------------------
// 5.3 INVESTIMENTOS PRÉ-OPERACIONAIS
// -------------------------------------------------------------------------

function renderSection53PreOperacional() {
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
          <input type="number" step="500" value="${item.val || 0}" onchange="updatePreOpField(${idx}, 'val', Number(this.value))" class="w-28 text-right px-1 py-1 bg-slate-50 border border-slate-200 rounded font-bold" />
        </td>
        <td class="px-4 py-2.5 text-right">
          <button type="button" onclick="deletePreOpRow(${idx})" class="text-slate-300 hover:text-rose-600 p-1" title="Excluir despesa">
            <i class="fa-solid fa-trash-can text-xs"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');

  setText('preOpTotalDisplay', formatMoney(totalPreOp));
}

function addNewPreOpRow() {
  const f = currentBusinessPlan.financial_plan;
  if (!Array.isArray(f.pre_operational_investments)) f.pre_operational_investments = [];
  f.pre_operational_investments.push({ item: "Nova Taxa / Desenvolvimento", val: 2500 });
  renderSection53PreOperacional();
  recalculateAllFinancials();
  saveBusinessPlan(false);
}

function deletePreOpRow(idx) {
  const f = currentBusinessPlan.financial_plan;
  if (!confirm('Deseja excluir este item pré-operacional?')) return;
  f.pre_operational_investments.splice(idx, 1);
  renderSection53PreOperacional();
  recalculateAllFinancials();
  saveBusinessPlan(false);
}

function updatePreOpField(idx, field, val) {
  const f = currentBusinessPlan.financial_plan;
  if (f.pre_operational_investments && f.pre_operational_investments[idx]) {
    f.pre_operational_investments[idx][field] = val;
    renderSection53PreOperacional();
    recalculateAllFinancials();
    saveBusinessPlan(false);
  }
}

// -------------------------------------------------------------------------
// 5.4 FONTES DE RECURSOS (TABELA 2)
// -------------------------------------------------------------------------

function renderSection54FontesRecursos() {
  const container = document.getElementById('fontesRecursosTableBody');
  if (!container) return;

  const fontes = currentBusinessPlan.financial_plan.fontes_recursos || [];
  let totalFontes = 0;

  container.innerHTML = fontes.map((f, idx) => {
    totalFontes += Number(f.val || 0);
    return `
      <tr class="border-b border-slate-100 text-xs">
        <td class="px-3 py-2 font-bold text-slate-800">
          <input type="text" value="${escapeHtml(f.fonte)}" onchange="updateFonteField(${idx}, 'fonte', this.value)" class="w-full bg-transparent border-0 border-b border-transparent focus:border-cyan-500 rounded px-1 outline-none" />
        </td>
        <td class="px-3 py-2 text-right">
          <input type="number" step="1000" value="${f.val || 0}" onchange="updateFonteField(${idx}, 'val', Number(this.value))" class="w-28 text-right font-bold bg-slate-50 border border-slate-200 rounded px-1 py-1" />
        </td>
        <td id="fontePct_${idx}" class="px-3 py-2 text-right font-black text-cyan-800">0%</td>
        <td class="px-3 py-2 text-right">
          <button type="button" onclick="deleteFonteRow(${idx})" class="text-slate-300 hover:text-rose-600 p-1"><i class="fa-solid fa-trash-can text-xs"></i></button>
        </td>
      </tr>
    `;
  }).join('');

  setText('totalFontesDisplay', formatMoney(totalFontes));
}

function addNewFonteRow() {
  const f = currentBusinessPlan.financial_plan;
  if (!Array.isArray(f.fontes_recursos)) f.fontes_recursos = [];
  f.fontes_recursos.push({ fonte: "Nova Fonte de Recursos", val: 10000 });
  renderSection54FontesRecursos();
  recalculateAllFinancials();
  saveBusinessPlan(false);
}

function deleteFonteRow(idx) {
  const f = currentBusinessPlan.financial_plan;
  if (!confirm('Deseja excluir esta fonte de recursos?')) return;
  f.fontes_recursos.splice(idx, 1);
  renderSection54FontesRecursos();
  recalculateAllFinancials();
  saveBusinessPlan(false);
}

function updateFonteField(idx, field, val) {
  const f = currentBusinessPlan.financial_plan;
  if (f.fontes_recursos && f.fontes_recursos[idx]) {
    f.fontes_recursos[idx][field] = val;
    renderSection54FontesRecursos();
    recalculateAllFinancials();
    saveBusinessPlan(false);
  }
}

// -------------------------------------------------------------------------
// 5.5 ESTIMATIVA DO FATURAMENTO MENSAL & INDICADORES SAAS
// -------------------------------------------------------------------------

function renderSection55Faturamento() {
  const container = document.getElementById('faturamentoTableBody');
  if (!container) return;

  const prods = currentBusinessPlan.financial_plan.faturamento_produtos || [];
  let totalFat = 0;

  container.innerHTML = prods.map((p, idx) => {
    const total = (Number(p.qty) || 0) * (Number(p.price) || 0);
    totalFat += total;
    return `
      <tr class="border-b border-slate-100 text-xs">
        <td class="px-3 py-2 font-bold text-slate-800">
          <input type="text" value="${escapeHtml(p.name)}" onchange="updateProdutoField(${idx}, 'name', this.value)" class="w-full bg-transparent border-0 border-b border-transparent focus:border-cyan-500 rounded px-1 outline-none" />
        </td>
        <td class="px-3 py-2 text-center">
          <input type="number" min="0" value="${p.qty || 0}" onchange="updateProdutoField(${idx}, 'qty', Number(this.value))" class="w-16 text-center font-bold bg-slate-50 border border-slate-200 rounded px-1 py-1" />
        </td>
        <td class="px-3 py-2 text-right">
          <input type="number" step="500" value="${p.price || 0}" onchange="updateProdutoField(${idx}, 'price', Number(this.value))" class="w-28 text-right font-black text-emerald-700 bg-slate-50 border border-slate-200 rounded px-1 py-1" />
        </td>
        <td class="px-3 py-2 text-right font-black text-slate-900">${formatMoney(total)}</td>
        <td class="px-3 py-2 text-center">
          <input type="checkbox" ${p.is_subscription ? 'checked' : ''} onchange="updateProdutoField(${idx}, 'is_subscription', this.checked)" title="Marcar se for receita recorrente (SaaS)" class="rounded text-cyan-600 focus:ring-cyan-500" />
        </td>
        <td class="px-3 py-2 text-right">
          <button type="button" onclick="deleteProdutoRow(${idx})" class="text-slate-300 hover:text-rose-600 p-1"><i class="fa-solid fa-trash-can text-xs"></i></button>
        </td>
      </tr>
    `;
  }).join('');

  setText('totalFaturamentoDisplay', formatMoney(totalFat));
}

function addNewProdutoRow() {
  const f = currentBusinessPlan.financial_plan;
  if (!Array.isArray(f.faturamento_produtos)) f.faturamento_produtos = [];
  f.faturamento_produtos.push({
    name: "Novo Produto / Serviço",
    qty: 1,
    price: 5000,
    is_subscription: false,
    unit_cogs: 500,
    insumos: [{ name: "Insumo Inicial", qty: 1, unit_cost: 500 }]
  });
  renderSection55Faturamento();
  renderSection56CustosUnitarios();
  recalculateAllFinancials();
  saveBusinessPlan(false);
}

function deleteProdutoRow(idx) {
  const f = currentBusinessPlan.financial_plan;
  if (!confirm('Deseja excluir este produto/serviço da estimativa de vendas?')) return;
  f.faturamento_produtos.splice(idx, 1);
  renderSection55Faturamento();
  renderSection56CustosUnitarios();
  recalculateAllFinancials();
  saveBusinessPlan(false);
}

function updateProdutoField(idx, field, val) {
  const f = currentBusinessPlan.financial_plan;
  if (f.faturamento_produtos && f.faturamento_produtos[idx]) {
    f.faturamento_produtos[idx][field] = val;
    renderSection55Faturamento();
    renderSection56CustosUnitarios();
    recalculateAllFinancials();
    saveBusinessPlan(false);
  }
}

// -------------------------------------------------------------------------
// 5.6 CUSTOS UNITÁRIOS DE MATERIAIS / INSUMOS POR PRODUTO & 5.8 CMV
// -------------------------------------------------------------------------

function renderSection56CustosUnitarios() {
  const container = document.getElementById('custosUnitariosContainer');
  if (!container) return;

  const prods = currentBusinessPlan.financial_plan.faturamento_produtos || [];
  container.innerHTML = prods.map((p, pIdx) => {
    const insumos = p.insumos || [];
    let subtotalInsumos = 0;
    const insumosRows = insumos.map((ins, insIdx) => {
      const total = (Number(ins.qty) || 0) * (Number(ins.unit_cost) || 0);
      subtotalInsumos += total;
      return `
        <tr class="border-b border-slate-100 text-xs">
          <td class="px-3 py-1.5 font-medium text-slate-800">
            <input type="text" value="${escapeHtml(ins.name)}" onchange="updateInsumoField(${pIdx}, ${insIdx}, 'name', this.value)" class="w-full bg-transparent border-0 border-b border-transparent focus:border-cyan-500 rounded px-1 outline-none" />
          </td>
          <td class="px-3 py-1.5 text-center">
            <input type="number" min="1" value="${ins.qty || 1}" onchange="updateInsumoField(${pIdx}, ${insIdx}, 'qty', Number(this.value))" class="w-14 text-center font-bold bg-slate-50 border border-slate-200 rounded px-1 py-0.5" />
          </td>
          <td class="px-3 py-1.5 text-right">
            <input type="number" step="10" value="${ins.unit_cost || 0}" onchange="updateInsumoField(${pIdx}, ${insIdx}, 'unit_cost', Number(this.value))" class="w-24 text-right font-bold bg-slate-50 border border-slate-200 rounded px-1 py-0.5" />
          </td>
          <td class="px-3 py-1.5 text-right font-black text-slate-900">${formatMoney(total)}</td>
          <td class="px-3 py-1.5 text-right">
            <button type="button" onclick="deleteInsumoRow(${pIdx}, ${insIdx})" class="text-slate-300 hover:text-rose-600 p-1"><i class="fa-solid fa-trash-can text-xs"></i></button>
          </td>
        </tr>
      `;
    }).join('');

    p.unit_cogs = subtotalInsumos;

    return `
      <div class="bg-slate-50/70 p-4 rounded-2xl border border-slate-200 space-y-3">
        <div class="flex items-center justify-between">
          <h5 class="text-xs font-black text-slate-900 flex items-center gap-2">
            <i class="fa-solid fa-layer-group text-cyan-600"></i>
            <span>${escapeHtml(p.name)}</span>
          </h5>
          <button type="button" onclick="addNewInsumoRow(${pIdx})" class="px-2.5 py-1 rounded-lg bg-cyan-50 text-cyan-800 border border-cyan-200 text-[11px] font-bold hover:bg-cyan-100">+ Insumo/API</button>
        </div>
        <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <th class="px-3 py-2">Material / Insumo / API</th>
                <th class="px-3 py-2 text-center">Quantidade</th>
                <th class="px-3 py-2 text-right">Custo Unitário</th>
                <th class="px-3 py-2 text-right">Total</th>
                <th class="px-3 py-2 text-right">Ação</th>
              </tr>
            </thead>
            <tbody>${insumosRows}</tbody>
            <tfoot>
              <tr class="bg-slate-50 font-black text-xs border-t border-slate-200">
                <td colspan="3" class="px-3 py-2 text-slate-700">Custo Unitário Total do Produto:</td>
                <td class="px-3 py-2 text-right text-emerald-800">${formatMoney(subtotalInsumos)}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    `;
  }).join('');
}

function addNewInsumoRow(pIdx) {
  const f = currentBusinessPlan.financial_plan;
  if (f.faturamento_produtos && f.faturamento_produtos[pIdx]) {
    if (!Array.isArray(f.faturamento_produtos[pIdx].insumos)) f.faturamento_produtos[pIdx].insumos = [];
    f.faturamento_produtos[pIdx].insumos.push({ name: "Novo Insumo / Serviço Cloud", qty: 1, unit_cost: 100 });
    renderSection56CustosUnitarios();
    recalculateAllFinancials();
    saveBusinessPlan(false);
  }
}

function deleteInsumoRow(pIdx, insIdx) {
  const f = currentBusinessPlan.financial_plan;
  if (f.faturamento_produtos && f.faturamento_produtos[pIdx] && f.faturamento_produtos[pIdx].insumos) {
    f.faturamento_produtos[pIdx].insumos.splice(insIdx, 1);
    renderSection56CustosUnitarios();
    recalculateAllFinancials();
    saveBusinessPlan(false);
  }
}

function updateInsumoField(pIdx, insIdx, field, val) {
  const f = currentBusinessPlan.financial_plan;
  if (f.faturamento_produtos && f.faturamento_produtos[pIdx] && f.faturamento_produtos[pIdx].insumos && f.faturamento_produtos[pIdx].insumos[insIdx]) {
    f.faturamento_produtos[pIdx].insumos[insIdx][field] = val;
    renderSection56CustosUnitarios();
    recalculateAllFinancials();
    saveBusinessPlan(false);
  }
}

// -------------------------------------------------------------------------
// 5.7 CUSTOS DE COMERCIALIZAÇÃO (IMPOSTOS & GASTOS COM VENDAS)
// -------------------------------------------------------------------------

function renderSection57CustosComercializacao() {
  const containerImp = document.getElementById('comercializacaoImpostosTableBody');
  if (containerImp) {
    const impostos = currentBusinessPlan.financial_plan.custos_comercializacao_impostos || [];
    containerImp.innerHTML = impostos.map((imp, idx) => `
      <tr class="border-b border-slate-100 text-xs">
        <td class="px-3 py-2 font-bold text-slate-800">
          <input type="text" value="${escapeHtml(imp.name)}" onchange="updateImpostoField(${idx}, 'name', this.value)" class="w-full bg-transparent border-0 border-b border-transparent focus:border-cyan-500 rounded px-1 outline-none" />
        </td>
        <td class="px-3 py-2 text-center">
          <input type="number" step="0.5" max="100" min="0" value="${imp.pct || 0}" onchange="updateImpostoField(${idx}, 'pct', Number(this.value))" class="w-16 text-center font-bold bg-slate-50 border border-slate-200 rounded px-1 py-0.5" /> %
        </td>
        <td class="px-3 py-2 text-right font-medium text-slate-500" id="impFat_${idx}">R$ 0</td>
        <td class="px-3 py-2 text-right font-black text-rose-600" id="impTotal_${idx}">R$ 0</td>
        <td class="px-3 py-2 text-right">
          <button type="button" onclick="deleteImpostoRow(${idx})" class="text-slate-300 hover:text-rose-600 p-1"><i class="fa-solid fa-trash-can text-xs"></i></button>
        </td>
      </tr>
    `).join('');
  }

  const containerGV = document.getElementById('comercializacaoVendasTableBody');
  if (containerGV) {
    const gastos = currentBusinessPlan.financial_plan.custos_comercializacao_vendas || [];
    containerGV.innerHTML = gastos.map((gv, idx) => `
      <tr class="border-b border-slate-100 text-xs">
        <td class="px-3 py-2 font-bold text-slate-800">
          <input type="text" value="${escapeHtml(gv.name)}" onchange="updateGastoVendaField(${idx}, 'name', this.value)" class="w-full bg-transparent border-0 border-b border-transparent focus:border-cyan-500 rounded px-1 outline-none" />
        </td>
        <td class="px-3 py-2 text-center">
          <input type="number" step="0.5" max="100" min="0" value="${gv.pct || 0}" onchange="updateGastoVendaField(${idx}, 'pct', Number(this.value))" class="w-16 text-center font-bold bg-slate-50 border border-slate-200 rounded px-1 py-0.5" /> %
        </td>
        <td class="px-3 py-2 text-right font-medium text-slate-500" id="gvFat_${idx}">R$ 0</td>
        <td class="px-3 py-2 text-right font-black text-amber-700" id="gvTotal_${idx}">R$ 0</td>
        <td class="px-3 py-2 text-right">
          <button type="button" onclick="deleteGastoVendaRow(${idx})" class="text-slate-300 hover:text-rose-600 p-1"><i class="fa-solid fa-trash-can text-xs"></i></button>
        </td>
      </tr>
    `).join('');
  }
}

function addNewImpostoRow() {
  const f = currentBusinessPlan.financial_plan;
  if (!Array.isArray(f.custos_comercializacao_impostos)) f.custos_comercializacao_impostos = [];
  f.custos_comercializacao_impostos.push({ name: "Novo Tributo / Taxa", pct: 2.0 });
  renderSection57CustosComercializacao();
  recalculateAllFinancials();
  saveBusinessPlan(false);
}

function deleteImpostoRow(idx) {
  const f = currentBusinessPlan.financial_plan;
  f.custos_comercializacao_impostos.splice(idx, 1);
  renderSection57CustosComercializacao();
  recalculateAllFinancials();
  saveBusinessPlan(false);
}

function updateImpostoField(idx, field, val) {
  const f = currentBusinessPlan.financial_plan;
  if (f.custos_comercializacao_impostos && f.custos_comercializacao_impostos[idx]) {
    f.custos_comercializacao_impostos[idx][field] = val;
    renderSection57CustosComercializacao();
    recalculateAllFinancials();
    saveBusinessPlan(false);
  }
}

function addNewGastoVendaRow() {
  const f = currentBusinessPlan.financial_plan;
  if (!Array.isArray(f.custos_comercializacao_vendas)) f.custos_comercializacao_vendas = [];
  f.custos_comercializacao_vendas.push({ name: "Novo Gasto com Vendas / Comissão", pct: 5.0 });
  renderSection57CustosComercializacao();
  recalculateAllFinancials();
  saveBusinessPlan(false);
}

function deleteGastoVendaRow(idx) {
  const f = currentBusinessPlan.financial_plan;
  f.custos_comercializacao_vendas.splice(idx, 1);
  renderSection57CustosComercializacao();
  recalculateAllFinancials();
  saveBusinessPlan(false);
}

function updateGastoVendaField(idx, field, val) {
  const f = currentBusinessPlan.financial_plan;
  if (f.custos_comercializacao_vendas && f.custos_comercializacao_vendas[idx]) {
    f.custos_comercializacao_vendas[idx][field] = val;
    renderSection57CustosComercializacao();
    recalculateAllFinancials();
    saveBusinessPlan(false);
  }
}

// -------------------------------------------------------------------------
// 5.9 CUSTOS COM MÃO DE OBRA
// -------------------------------------------------------------------------

function renderSection59MaoDeObra() {
  const container = document.getElementById('maoDeObraTableBody');
  if (!container) return;

  const staff = currentBusinessPlan.financial_plan.mao_de_obra || [];
  let totalMO = 0;

  container.innerHTML = staff.map((mo, idx) => {
    const encVal = ((Number(mo.encargos_pct) || 0) / 100) * (Number(mo.salario) || 0);
    const totalFuncao = ((Number(mo.salario) || 0) + encVal) * (Number(mo.num_empregados) || 0);
    totalMO += totalFuncao;
    return `
      <tr class="border-b border-slate-100 text-xs">
        <td class="px-3 py-2 font-bold text-slate-800">
          <input type="text" value="${escapeHtml(mo.role)}" onchange="updateMaoDeObraField(${idx}, 'role', this.value)" class="w-full bg-transparent border-0 border-b border-transparent focus:border-cyan-500 rounded px-1 outline-none" />
        </td>
        <td class="px-3 py-2 text-center">
          <input type="number" min="1" value="${mo.num_empregados || 1}" onchange="updateMaoDeObraField(${idx}, 'num_empregados', Number(this.value))" class="w-14 text-center font-bold bg-slate-50 border border-slate-200 rounded px-1 py-0.5" />
        </td>
        <td class="px-3 py-2 text-right">
          <input type="number" step="100" value="${mo.salario || 0}" onchange="updateMaoDeObraField(${idx}, 'salario', Number(this.value))" class="w-24 text-right font-bold bg-slate-50 border border-slate-200 rounded px-1 py-0.5" />
        </td>
        <td class="px-3 py-2 text-center">
          <input type="number" step="5" max="150" min="0" value="${mo.encargos_pct || 0}" onchange="updateMaoDeObraField(${idx}, 'encargos_pct', Number(this.value))" class="w-16 text-center font-bold bg-slate-50 border border-slate-200 rounded px-1 py-0.5" /> %
        </td>
        <td class="px-3 py-2 text-right text-slate-600">${formatMoney(encVal)}</td>
        <td class="px-3 py-2 text-right font-black text-slate-900">${formatMoney(totalFuncao)}</td>
        <td class="px-3 py-2 text-right">
          <button type="button" onclick="deleteMaoDeObraRow(${idx})" class="text-slate-300 hover:text-rose-600 p-1"><i class="fa-solid fa-trash-can text-xs"></i></button>
        </td>
      </tr>
    `;
  }).join('');

  setText('totalMaoDeObraDisplay', formatMoney(totalMO));
}

function addNewMaoDeObraRow() {
  const f = currentBusinessPlan.financial_plan;
  if (!Array.isArray(f.mao_de_obra)) f.mao_de_obra = [];
  f.mao_de_obra.push({ role: "Nova Função / Colaborador", num_empregados: 1, salario: 2000, encargos_pct: 40.0 });
  renderSection59MaoDeObra();
  recalculateAllFinancials();
  saveBusinessPlan(false);
}

function deleteMaoDeObraRow(idx) {
  const f = currentBusinessPlan.financial_plan;
  if (!confirm('Deseja excluir esta função da mão de obra?')) return;
  f.mao_de_obra.splice(idx, 1);
  renderSection59MaoDeObra();
  recalculateAllFinancials();
  saveBusinessPlan(false);
}

function updateMaoDeObraField(idx, field, val) {
  const f = currentBusinessPlan.financial_plan;
  if (f.mao_de_obra && f.mao_de_obra[idx]) {
    f.mao_de_obra[idx][field] = val;
    renderSection59MaoDeObra();
    recalculateAllFinancials();
    saveBusinessPlan(false);
  }
}

// -------------------------------------------------------------------------
// 5.10 DEPRECIAÇÃO DOS ATIVOS
// -------------------------------------------------------------------------

function renderSection510Depreciacao() {
  const container = document.getElementById('depreciacaoTableBody');
  if (!container) return;

  const deps = currentBusinessPlan.financial_plan.depreciacao_ativos || [];
  let totalDeprecMensal = 0;

  container.innerHTML = deps.map((dep, idx) => {
    const vidaUtil = Number(dep.vida_util_anos) || 5;
    const anual = (Number(dep.valor_bem) || 0) / vidaUtil;
    const mensal = anual / 12;
    totalDeprecMensal += mensal;
    return `
      <tr class="border-b border-slate-100 text-xs">
        <td class="px-3 py-2 font-bold text-slate-800">
          <input type="text" value="${escapeHtml(dep.item)}" onchange="updateDepreciacaoField(${idx}, 'item', this.value)" class="w-full bg-transparent border-0 border-b border-transparent focus:border-cyan-500 rounded px-1 outline-none" />
        </td>
        <td class="px-3 py-2 text-right">
          <input type="number" step="500" value="${dep.valor_bem || 0}" onchange="updateDepreciacaoField(${idx}, 'valor_bem', Number(this.value))" class="w-24 text-right font-bold bg-slate-50 border border-slate-200 rounded px-1 py-0.5" />
        </td>
        <td class="px-3 py-2 text-center">
          <input type="number" min="1" max="50" value="${dep.vida_util_anos || 5}" onchange="updateDepreciacaoField(${idx}, 'vida_util_anos', Number(this.value))" class="w-14 text-center font-bold bg-slate-50 border border-slate-200 rounded px-1 py-0.5" /> anos
        </td>
        <td class="px-3 py-2 text-right text-slate-600">${formatMoney(anual)}</td>
        <td class="px-3 py-2 text-right font-black text-rose-700">${formatMoney(mensal)}</td>
        <td class="px-3 py-2 text-right">
          <button type="button" onclick="deleteDepreciacaoRow(${idx})" class="text-slate-300 hover:text-rose-600 p-1"><i class="fa-solid fa-trash-can text-xs"></i></button>
        </td>
      </tr>
    `;
  }).join('');

  setText('totalDepreciacaoMensalDisplay', formatMoney(totalDeprecMensal));
}

function addNewDepreciacaoRow() {
  const f = currentBusinessPlan.financial_plan;
  if (!Array.isArray(f.depreciacao_ativos)) f.depreciacao_ativos = [];
  f.depreciacao_ativos.push({ item: "Novo Bem Depreciável", valor_bem: 5000, vida_util_anos: 5 });
  renderSection510Depreciacao();
  recalculateAllFinancials();
  saveBusinessPlan(false);
}

function deleteDepreciacaoRow(idx) {
  const f = currentBusinessPlan.financial_plan;
  f.depreciacao_ativos.splice(idx, 1);
  renderSection510Depreciacao();
  recalculateAllFinancials();
  saveBusinessPlan(false);
}

function updateDepreciacaoField(idx, field, val) {
  const f = currentBusinessPlan.financial_plan;
  if (f.depreciacao_ativos && f.depreciacao_ativos[idx]) {
    f.depreciacao_ativos[idx][field] = val;
    renderSection510Depreciacao();
    recalculateAllFinancials();
    saveBusinessPlan(false);
  }
}

// -------------------------------------------------------------------------
// 5.11 CUSTOS FIXOS OPERACIONAIS MENSAIS
// -------------------------------------------------------------------------

function renderSection511CustosFixos() {
  const container = document.getElementById('custosFixosTableBody');
  if (!container) return;

  const fixos = currentBusinessPlan.financial_plan.custos_fixos_operacionais || [];
  let totalFixosGerais = 0;

  container.innerHTML = fixos.map((cf, idx) => {
    totalFixosGerais += Number(cf.custo_mensal || 0);
    return `
      <tr class="border-b border-slate-100 text-xs">
        <td class="px-3 py-2 font-bold text-slate-800">
          <input type="text" value="${escapeHtml(cf.name)}" onchange="updateCustoFixoField(${idx}, 'name', this.value)" class="w-full bg-transparent border-0 border-b border-transparent focus:border-cyan-500 rounded px-1 outline-none" />
        </td>
        <td class="px-3 py-2 text-right">
          <input type="number" step="100" value="${cf.custo_mensal || 0}" onchange="updateCustoFixoField(${idx}, 'custo_mensal', Number(this.value))" class="w-28 text-right font-black text-slate-900 bg-slate-50 border border-slate-200 rounded px-1.5 py-1" />
        </td>
        <td class="px-3 py-2 text-right">
          <button type="button" onclick="deleteCustoFixoRow(${idx})" class="text-slate-300 hover:text-rose-600 p-1"><i class="fa-solid fa-trash-can text-xs"></i></button>
        </td>
      </tr>
    `;
  }).join('');

  setText('subtotalCustosFixosOperacionaisDisplay', formatMoney(totalFixosGerais));
}

function addNewCustoFixoRow() {
  const f = currentBusinessPlan.financial_plan;
  if (!Array.isArray(f.custos_fixos_operacionais)) f.custos_fixos_operacionais = [];
  f.custos_fixos_operacionais.push({ name: "Nova Despesa Fixa Mensal", custo_mensal: 500 });
  renderSection511CustosFixos();
  recalculateAllFinancials();
  saveBusinessPlan(false);
}

function deleteCustoFixoRow(idx) {
  const f = currentBusinessPlan.financial_plan;
  if (!confirm('Deseja excluir este custo fixo?')) return;
  f.custos_fixos_operacionais.splice(idx, 1);
  renderSection511CustosFixos();
  recalculateAllFinancials();
  saveBusinessPlan(false);
}

function updateCustoFixoField(idx, field, val) {
  const f = currentBusinessPlan.financial_plan;
  if (f.custos_fixos_operacionais && f.custos_fixos_operacionais[idx]) {
    f.custos_fixos_operacionais[idx][field] = val;
    renderSection511CustosFixos();
    recalculateAllFinancials();
    saveBusinessPlan(false);
  }
}

// -------------------------------------------------------------------------
// RECALCULO COMPLETO E ENCADEADO DO MOTOR FINANCEIRO SEBRAE
// -------------------------------------------------------------------------

function recalculateAllFinancials() {
  if (!currentBusinessPlan || !currentBusinessPlan.financial_plan) return;

  const f = currentBusinessPlan.financial_plan;

  // 1. Investimentos Fixos (5.1)
  const totA = (f.investimentos_fixos_a_maquinas || []).reduce((acc, i) => acc + ((Number(i.qty) || 0) * (Number(i.unit_val) || 0)), 0);
  const totB = (f.investimentos_fixos_b_moveis || []).reduce((acc, i) => acc + ((Number(i.qty) || 0) * (Number(i.unit_val) || 0)), 0);
  const totC = (f.investimentos_fixos_c_veiculos || []).reduce((acc, i) => acc + ((Number(i.qty) || 0) * (Number(i.unit_val) || 0)), 0);
  const totalInvestimentosFixos = totA + totB + totC;

  setText('subtotalFixosA', formatMoney(totA));
  setText('subtotalFixosB', formatMoney(totB));
  setText('subtotalFixosC', formatMoney(totC));
  setText('totalInvestimentosFixosDisplay', formatMoney(totalInvestimentosFixos));

  // 2. Pré-Operacionais (5.3)
  const totalPreOperacional = (f.pre_operational_investments || []).reduce((acc, i) => acc + (Number(i.val) || 0), 0);
  setText('preOpTotalDisplay', formatMoney(totalPreOperacional));

  // 3. Faturamento Mensal (5.5) & Indicadores SaaS
  let faturamentoMensalTotal = 0;
  let totalAssinantes = 0;
  (f.faturamento_produtos || []).forEach(p => {
    const tot = (Number(p.qty) || 0) * (Number(p.price) || 0);
    faturamentoMensalTotal += tot;
    if (p.is_subscription) {
      totalAssinantes += Number(p.qty) || 0;
    }
  });
  const mrr = faturamentoMensalTotal;
  const arr = mrr * 12;

  setText('totalFaturamentoDisplay', formatMoney(faturamentoMensalTotal));
  setText('saasMrrDisplay', formatMoney(mrr));
  setText('saasArrDisplay', formatMoney(arr));
  setText('saasSubscribersDisplay', `${totalAssinantes} clientes`);

  // 4. CMV / Materiais Diretos (5.8)
  let cmvTotal = 0;
  const cmvContainer = document.getElementById('cmvTableBody');
  if (cmvContainer) {
    cmvContainer.innerHTML = (f.faturamento_produtos || []).map(p => {
      const unitCogs = Number(p.unit_cogs) || 0;
      const cmdTot = (Number(p.qty) || 0) * unitCogs;
      cmvTotal += cmdTot;
      return `
        <tr class="border-b border-slate-100 text-xs">
          <td class="px-3 py-2 font-bold text-slate-800">${escapeHtml(p.name)}</td>
          <td class="px-3 py-2 text-center font-bold text-slate-700">${p.qty || 0}</td>
          <td class="px-3 py-2 text-right font-medium text-slate-600">${formatMoney(unitCogs)}</td>
          <td class="px-3 py-2 text-right font-black text-rose-700">${formatMoney(cmdTot)}</td>
        </tr>
      `;
    }).join('');
    setText('totalCmvDisplay', formatMoney(cmvTotal));
  } else {
    (f.faturamento_produtos || []).forEach(p => {
      cmvTotal += (Number(p.qty) || 0) * (Number(p.unit_cogs) || 0);
    });
  }

  // 5. Custos de Comercialização (5.7)
  let subtotal1Impostos = 0;
  (f.custos_comercializacao_impostos || []).forEach((imp, idx) => {
    const val = ((Number(imp.pct) || 0) / 100) * faturamentoMensalTotal;
    subtotal1Impostos += val;
    setText(`impFat_${idx}`, formatMoney(faturamentoMensalTotal));
    setText(`impTotal_${idx}`, formatMoney(val));
  });

  let subtotal2GastosVendas = 0;
  (f.custos_comercializacao_vendas || []).forEach((gv, idx) => {
    const val = ((Number(gv.pct) || 0) / 100) * faturamentoMensalTotal;
    subtotal2GastosVendas += val;
    setText(`gvFat_${idx}`, formatMoney(faturamentoMensalTotal));
    setText(`gvTotal_${idx}`, formatMoney(val));
  });

  const totalComercializacao = subtotal1Impostos + subtotal2GastosVendas;
  setText('subtotal1ImpostosDisplay', formatMoney(subtotal1Impostos));
  setText('subtotal2GastosVendasDisplay', formatMoney(subtotal2GastosVendas));
  setText('totalComercializacaoDisplay', formatMoney(totalComercializacao));

  // Custos Variáveis Totais
  const custosVariaveisTotais = cmvTotal + totalComercializacao;

  // 6. Mão de Obra (5.9)
  let totalMaoDeObra = (f.mao_de_obra || []).reduce((acc, mo) => {
    const encVal = ((Number(mo.encargos_pct) || 0) / 100) * (Number(mo.salario) || 0);
    return acc + (((Number(mo.salario) || 0) + encVal) * (Number(mo.num_empregados) || 0));
  }, 0);
  setText('totalMaoDeObraDisplay', formatMoney(totalMaoDeObra));

  // 7. Depreciação (5.10)
  let totalDepreciacaoMensal = (f.depreciacao_ativos || []).reduce((acc, dep) => {
    const vidaUtil = Number(dep.vida_util_anos) || 5;
    return acc + (((Number(dep.valor_bem) || 0) / vidaUtil) / 12);
  }, 0);
  setText('totalDepreciacaoMensalDisplay', formatMoney(totalDepreciacaoMensal));

  // 8. Custos Fixos Operacionais (5.11)
  let totalFixosGerais = (f.custos_fixos_operacionais || []).reduce((acc, cf) => acc + (Number(cf.custo_mensal) || 0), 0);
  setText('subtotalCustosFixosOperacionaisDisplay', formatMoney(totalFixosGerais));
  const totalCustosFixosMensais = totalFixosGerais + totalMaoDeObra + totalDepreciacaoMensal;
  setText('totalCustosFixosGeraisDisplay', formatMoney(totalCustosFixosMensais));

  // 9. Capital de Giro & Caixa Mínimo em 5 Passos (5.2)
  const totalEstoqueInicial = (f.estoque_inicial || []).reduce((acc, i) => acc + ((Number(i.qty) || 0) * (Number(i.unit_val) || 0)), 0);
  setText('totalEstoqueInicialDisplay', formatMoney(totalEstoqueInicial));

  let pmv = (f.prazos_vendas || []).reduce((acc, pv) => acc + (((Number(pv.pct_vendas) || 0) / 100) * (Number(pv.dias) || 0)), 0);
  let pmc = (f.prazos_compras || []).reduce((acc, pc) => acc + (((Number(pc.pct_compras) || 0) / 100) * (Number(pc.dias) || 0)), 0);
  const nme = Number(getInputValue('finInput_diasEstoque', f.necessidade_dias_estoque || 5));
  f.necessidade_dias_estoque = nme;

  const subtotal1Prazos = pmv + nme;
  const subtotal2Prazos = pmc;
  const necessidadeLiquidaDias = subtotal1Prazos - subtotal2Prazos;

  // Passo 5: Caixa Mínimo
  const custoTotalEmpresaMensal = totalCustosFixosMensais + custosVariaveisTotais;
  const custoTotalDiario = custoTotalEmpresaMensal / 30;
  const caixaMinimo = Math.max(0, custoTotalDiario * necessidadeLiquidaDias);
  const totalCapitalDeGiro = totalEstoqueInicial + caixaMinimo;

  // Atualiza Passo 4 e 5 no HTML
  setText('passo4_pmv', `${pmv.toFixed(1)} dias`);
  setText('passo4_nme', `${nme.toFixed(1)} dias`);
  setText('passo4_sub1', `${subtotal1Prazos.toFixed(1)} dias`);
  setText('passo4_pmc', `${pmc.toFixed(1)} dias`);
  setText('passo4_sub2', `${subtotal2Prazos.toFixed(1)} dias`);
  setText('passo4_liq', `${necessidadeLiquidaDias.toFixed(1)} dias`);

  setText('passo5_fixo', formatMoney(totalCustosFixosMensais));
  setText('passo5_var', formatMoney(custosVariaveisTotais));
  setText('passo5_tot', formatMoney(custoTotalEmpresaMensal));
  setText('passo5_diario', formatMoney(custoTotalDiario));
  setText('passo5_dias', `${necessidadeLiquidaDias.toFixed(1)} dias`);
  setText('passo5_caixaMinimo', formatMoney(caixaMinimo));

  setText('resumoEstoqueInicial', formatMoney(totalEstoqueInicial));
  setText('resumoCaixaMinimo', formatMoney(caixaMinimo));
  setText('resumoCapitalGiroTotal', formatMoney(totalCapitalDeGiro));

  // 10. Investimento Total (5.4)
  const investimentoTotal = totalInvestimentosFixos + totalCapitalDeGiro + totalPreOperacional;
  setText('invTot_fixos', formatMoney(totalInvestimentosFixos));
  setText('invTot_giro', formatMoney(totalCapitalDeGiro));
  setText('invTot_preop', formatMoney(totalPreOperacional));
  setText('invTot_geral', formatMoney(investimentoTotal));

  if (investimentoTotal > 0) {
    setText('invTot_fixos_pct', `${((totalInvestimentosFixos / investimentoTotal) * 100).toFixed(1)}%`);
    setText('invTot_giro_pct', `${((totalCapitalDeGiro / investimentoTotal) * 100).toFixed(1)}%`);
    setText('invTot_preop_pct', `${((totalPreOperacional / investimentoTotal) * 100).toFixed(1)}%`);
  }

  // Atualiza % Fontes de Recursos
  let totalFontes = 0;
  (f.fontes_recursos || []).forEach((fr, idx) => {
    totalFontes += Number(fr.val || 0);
    const pct = investimentoTotal > 0 ? ((Number(fr.val || 0) / investimentoTotal) * 100) : 0;
    setText(`fontePct_${idx}`, `${pct.toFixed(1)}%`);
  });
  setText('totalFontesDisplay', formatMoney(totalFontes));

  // Validador de Fontes
  const elValidaFontes = document.getElementById('validaFontesPill');
  if (elValidaFontes) {
    const diff = Math.abs(totalFontes - investimentoTotal);
    if (diff < 100) {
      elValidaFontes.className = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200";
      elValidaFontes.innerHTML = `<i class="fa-solid fa-circle-check"></i> 100% Coberto: Fontes (R$ ${formatMoney(totalFontes)}) = Total (R$ ${formatMoney(investimentoTotal)})`;
    } else {
      elValidaFontes.className = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse";
      elValidaFontes.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Atenção: Fontes (R$ ${formatMoney(totalFontes)}) ≠ Investimento Total (R$ ${formatMoney(investimentoTotal)})`;
    }
  }

  // 11. Demonstrativo de Resultados / DRE (5.12)
  const receitaTotal = faturamentoMensalTotal;
  const margemContribuicao = receitaTotal - custosVariaveisTotais;
  const margemContribuicaoPct = receitaTotal > 0 ? ((margemContribuicao / receitaTotal) * 100) : 0;
  const indiceMargemContribuicao = receitaTotal > 0 ? (margemContribuicao / receitaTotal) : 0;
  const lucroLiquidoMensal = margemContribuicao - totalCustosFixosMensais;
  const lucroLiquidoAnual = lucroLiquidoMensal * 12;
  const margemLiquidaPct = receitaTotal > 0 ? ((lucroLiquidoMensal / receitaTotal) * 100) : 0;

  setText('dre_receita', formatMoney(receitaTotal));
  setText('dre_cmv', `- ${formatMoney(cmvTotal)}`);
  setText('dre_cmv_pct', receitaTotal > 0 ? `${((cmvTotal / receitaTotal) * 100).toFixed(1)}%` : '0%');
  setText('dre_impostos', `- ${formatMoney(subtotal1Impostos)}`);
  setText('dre_impostos_pct', receitaTotal > 0 ? `${((subtotal1Impostos / receitaTotal) * 100).toFixed(1)}%` : '0%');
  setText('dre_vendas', `- ${formatMoney(subtotal2GastosVendas)}`);
  setText('dre_vendas_pct', receitaTotal > 0 ? `${((subtotal2GastosVendas / receitaTotal) * 100).toFixed(1)}%` : '0%');
  setText('dre_custosVarTotais', `- ${formatMoney(custosVariaveisTotais)}`);
  setText('dre_custosVarTotais_pct', receitaTotal > 0 ? `${((custosVariaveisTotais / receitaTotal) * 100).toFixed(1)}%` : '0%');
  setText('dre_margemContribuicao', formatMoney(margemContribuicao));
  setText('dre_margemContribuicao_pct', `${margemContribuicaoPct.toFixed(1)}%`);
  setText('dre_custosFixosTotais', `- ${formatMoney(totalCustosFixosMensais)}`);
  setText('dre_custosFixosTotais_pct', receitaTotal > 0 ? `${((totalCustosFixosMensais / receitaTotal) * 100).toFixed(1)}%` : '0%');
  setText('dre_lucroLiquido', formatMoney(lucroLiquidoMensal));
  setText('dre_lucroLiquido_pct', `${margemLiquidaPct.toFixed(1)}%`);
  setText('dre_lucroLiquidoAnual', formatMoney(lucroLiquidoAnual));

  // 12. Indicadores de Viabilidade (5.13)
  const peReaisMensal = indiceMargemContribuicao > 0 ? (totalCustosFixosMensais / indiceMargemContribuicao) : 0;
  const peReaisAnual = peReaisMensal * 12;

  // PE em unidades
  const precoMedioUnitario = totalAssinantes > 0 ? (receitaTotal / totalAssinantes) : 12000;
  const custoVarUnitarioMedio = totalAssinantes > 0 ? (custosVariaveisTotais / totalAssinantes) : 0;
  const margemUnit = precoMedioUnitario - custoVarUnitarioMedio;
  const peUnidades = margemUnit > 0 ? Math.ceil(totalCustosFixosMensais / margemUnit) : 0;

  const lucratividadePct = receitaTotal > 0 ? ((lucroLiquidoMensal / receitaTotal) * 100) : 0;
  const rentabilidadePct = investimentoTotal > 0 ? ((lucroLiquidoAnual / investimentoTotal) * 100) : 0;
  const paybackAnos = lucroLiquidoAnual > 0 ? (investimentoTotal / lucroLiquidoAnual) : 999;
  const paybackMeses = paybackAnos * 12;

  setText('ind_pe_rs', `${formatMoney(peReaisMensal)} / mês (${formatMoney(peReaisAnual)}/ano)`);
  setText('ind_pe_unidades', `${peUnidades} contratos / mês`);
  setText('ind_lucratividade', `${lucratividadePct.toFixed(1)}%`);
  setText('ind_rentabilidade', `${rentabilidadePct.toFixed(1)}% a.a.`);
  setText('ind_payback', paybackMeses < 120 ? `${paybackMeses.toFixed(1)} meses (${paybackAnos.toFixed(1)} anos)` : 'Inviável no ritmo atual');

  // Atualiza Cards no Topo da Seção
  setText('kpiGrossRevenue', formatMoney(receitaTotal * 12));
  setText('kpiMrrEquiv', `${formatMoney(mrr)} / mês`);
  setText('kpiNetProfit', formatMoney(lucroLiquidoAnual));
  setText('kpiNetProfitMonthly', `+ ${formatMoney(lucroLiquidoMensal)} / mês`);
  setText('kpiBreakEven', `${peUnidades} Clientes (${formatMoney(peReaisMensal)}/mês)`);
  setText('kpiPayback', paybackMeses < 120 ? `${paybackMeses.toFixed(1)} meses` : '> 10 anos');

  // 13. Construção de Cenários (6)
  renderSection6Cenarios(receitaTotal, custosVariaveisTotais, totalCustosFixosMensais);

  // Gráficos Chart.js
  renderDreBreakdownChart(totalCustosFixosMensais, custosVariaveisTotais, subtotal1Impostos, Math.max(0, lucroLiquidoMensal));
  renderBreakEvenChart(peReaisMensal, receitaTotal, totalCustosFixosMensais, custosVariaveisTotais);
}

// -------------------------------------------------------------------------
// 6. CONSTRUÇÃO DE CENÁRIOS (PESSIMISTA, PROVÁVEL, OTIMISTA)
// -------------------------------------------------------------------------

function renderSection6Cenarios(recProv, varProv, fixProv) {
  const propVar = recProv > 0 ? (varProv / recProv) : 0;

  // Pessimista (-25%)
  const recPess = recProv * 0.75;
  const varPess = recPess * propVar;
  const fixPess = fixProv;
  const margemPess = recPess - varPess;
  const lucroPess = margemPess - fixPess;
  const margemPessPct = recPess > 0 ? (lucroPess / recPess) * 100 : 0;

  // Provável (100%)
  const margemProv = recProv - varProv;
  const lucroProv = margemProv - fixProv;
  const margemProvPct = recProv > 0 ? (lucroProv / recProv) * 100 : 0;

  // Otimista (+35%)
  const recOtim = recProv * 1.35;
  const varOtim = recOtim * propVar;
  const fixOtim = fixProv;
  const margemOtim = recOtim - varOtim;
  const lucroOtim = margemOtim - fixOtim;
  const margemOtimPct = recOtim > 0 ? (lucroOtim / recOtim) * 100 : 0;

  setText('cen_pess_rec', formatMoney(recPess));
  setText('cen_pess_var', `- ${formatMoney(varPess)}`);
  setText('cen_pess_fix', `- ${formatMoney(fixPess)}`);
  setText('cen_pess_lucro', formatMoney(lucroPess));
  setText('cen_pess_margem', `${margemPessPct.toFixed(1)}%`);

  setText('cen_prov_rec', formatMoney(recProv));
  setText('cen_prov_var', `- ${formatMoney(varProv)}`);
  setText('cen_prov_fix', `- ${formatMoney(fixProv)}`);
  setText('cen_prov_lucro', formatMoney(lucroProv));
  setText('cen_prov_margem', `${margemProvPct.toFixed(1)}%`);

  setText('cen_otim_rec', formatMoney(recOtim));
  setText('cen_otim_var', `- ${formatMoney(varOtim)}`);
  setText('cen_otim_fix', `- ${formatMoney(fixOtim)}`);
  setText('cen_otim_lucro', formatMoney(lucroOtim));
  setText('cen_otim_margem', `${margemOtimPct.toFixed(1)}%`);

  renderScenarioChart(
    [recPess, recProv, recOtim],
    [varPess + fixPess, varProv + fixProv, varOtim + fixOtim],
    [lucroPess, lucroProv, lucroOtim]
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

  if (!currentBusinessPlan) currentBusinessPlan = JSON.parse(JSON.stringify(DEFAULT_BUSINESS_PLAN_DATA));
  if (!Array.isArray(currentBusinessPlan.swot)) currentBusinessPlan.swot = [];

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

// Auto-inicialização quando o DOM estiver pronto
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      loadBusinessPlan();
    });
  } else {
    // DOM já está carregado
    setTimeout(() => {
      loadBusinessPlan();
    }, 50);
  }
}
