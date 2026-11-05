// =========================================================================
// API Serverless: Plano de Negócios SEBRAE & Gestão Ágil (Monday.com)
// Radar São José - Inteligência Territorial
// =========================================================================

const fs = require('fs');
const path = require('path');
const { getDbPool } = require('../lib/db-pool');

// Carregador autônomo de variáveis de ambiente (.env / .env.local)
function loadEnv() {
  const envCandidates = [
    path.join(process.cwd(), '.env'),
    path.join(process.cwd(), '.env.local'),
    path.join(__dirname, '..', '.env'),
    path.join(__dirname, '.env')
  ];
  for (const p of envCandidates) {
    if (fs.existsSync(p)) {
      try {
        const text = fs.readFileSync(p, 'utf8');
        text.split('\n').forEach(line => {
          const trimmed = line.trim();
          if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
            const idx = trimmed.indexOf('=');
            const k = trimmed.slice(0, idx).trim();
            const v = trimmed.slice(idx + 1).replace(/^['"]|['"\r]$/g, '').trim();
            if (k && !process.env[k]) {
              process.env[k] = v;
            }
          }
        });
      } catch (e) {}
    }
  }
}
loadEnv();

const SUPABASE_URL = process.env.SUPABASE_URL || "https://tocyvysucpslayzglixq.supabase.co";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "sb_publishable_8mKUf28dbMM8EOSPrgjRUA_19taJmrT";
// Credencial privilegiada para operações administrativas de backend (fail-closed: nunca substitui por anon key)
function getSupabaseServiceKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || null;
}

// =========================================================================
// MOTOR FINANCEIRO CIRÚRGICO SEBRAE + SAAS
// =========================================================================

/**
 * Calcula DRE, Margem de Contribuição, Ponto de Equilíbrio, Lucratividade,
 * Rentabilidade, Payback e Métricas SaaS com precisão centesimal.
 */
function calculateFinancialIndicators(financialData, capexTotal = 50000, preOpTotal = 25000) {
  const data = financialData || {};

  // 1. Receitas
  const annualSubscribers = Number(data.annualSubscribers || 20); // clientes pagando licença anual de R$ 12k
  const annualPrice = Number(data.annualPrice || 12000); // R$ 12.000 / 12 meses
  const annualSaaSSales = annualSubscribers * annualPrice;
  const mrrEquivalent = annualSaaSSales / 12;

  const appliedIntelProjects = Number(data.appliedIntelProjects || 6); // R$ 8.000 / projeto
  const appliedIntelAvgPrice = Number(data.appliedIntelAvgPrice || 8000);
  const appliedIntelTotal = appliedIntelProjects * appliedIntelAvgPrice;

  const customResearchProjects = Number(data.customResearchProjects || 2); // R$ 18.000 / pesquisa
  const customResearchAvgPrice = Number(data.customResearchAvgPrice || 18000);
  const customResearchTotal = customResearchProjects * customResearchAvgPrice;

  const blogSponsorships = Number(data.blogSponsorships || 8); // R$ 2.500 / matéria patrocinada
  const blogSponsorshipAvgPrice = Number(data.blogSponsorshipAvgPrice || 2500);
  const blogSponsorshipTotal = blogSponsorships * blogSponsorshipAvgPrice;

  const grossRevenue = annualSaaSSales + appliedIntelTotal + customResearchTotal + blogSponsorshipTotal;
  const monthlyGrossRevenue = grossRevenue / 12;

  // 2. Tributos e Deduções
  const taxRatePct = Number(data.taxRatePct || 6.0); // Simples Nacional Serviços
  const taxesValue = grossRevenue * (taxRatePct / 100);
  const netRevenue = grossRevenue - taxesValue;

  // 3. Custos Variáveis & COGS SaaS
  const cogsPerUserYear = Number(data.cogsPerUserYear || 380); // Servidores + APIs IA + Armazenamento
  const totalCogsSaaS = annualSubscribers * cogsPerUserYear;

  const affiliateCommissionPct = Number(data.affiliateCommissionPct || 20.0); // 20% média
  const affiliateCommissionValue = annualSaaSSales * (affiliateCommissionPct / 100);

  const gatewayRatePct = Number(data.gatewayRatePct || 3.2); // Asaas / Cartão
  const gatewayFeeValue = grossRevenue * (gatewayRatePct / 100);

  const directServiceCosts = Number(data.directServiceCosts || 12000); // Custo direto de pesquisadores avulsos

  const totalVariableCosts = totalCogsSaaS + affiliateCommissionValue + gatewayFeeValue + directServiceCosts;
  const monthlyVariableCosts = totalVariableCosts / 12;

  // 4. Margem de Contribuição
  const contributionMargin = netRevenue - totalVariableCosts;
  const contributionMarginPct = netRevenue > 0 ? (contributionMargin / netRevenue) * 100 : 0;
  const unitContributionMargin = annualPrice * (1 - (taxRatePct + affiliateCommissionPct + gatewayRatePct) / 100) - cogsPerUserYear;

  // 5. Custos Fixos Operacionais Anuais (Opex)
  const proLaboreLeonardoMonthly = Number(data.proLaboreLeonardo || 6000);
  const proLaboreMayumiMonthly = Number(data.proLaboreMayumi || 5000);
  const staffPayrollMonthly = Number(data.staffPayroll || 3500); // Assistente / Suporte
  const cloudToolsMonthly = Number(data.cloudTools || 1200); // GitHub, Vercel, Supabase, Figma
  const accountingMonthly = Number(data.accounting || 800);
  const officeInternetMonthly = Number(data.officeInternet || 600); // Espaço / Studio 8 / Fibra
  const otherFixedMonthly = Number(data.otherFixed || 900);

  const totalFixedCostsMonthly = proLaboreLeonardoMonthly + proLaboreMayumiMonthly +
    staffPayrollMonthly + cloudToolsMonthly + accountingMonthly + officeInternetMonthly + otherFixedMonthly;
  const totalFixedCostsAnnual = totalFixedCostsMonthly * 12;

  // 6. Depreciação Anual
  const annualDepreciation = Number(data.annualDepreciation || 4500);

  // 7. DRE & EBITDA
  const ebitda = contributionMargin - totalFixedCostsAnnual;
  const netProfit = ebitda - annualDepreciation;
  const netProfitMonthly = netProfit / 12;
  const netMarginPct = grossRevenue > 0 ? (netProfit / grossRevenue) * 100 : 0;

  // 8. Capital de Giro & Caixa Mínimo
  const avgSalesReceiptDays = Number(data.avgSalesReceiptDays || 15); // Recebimento cartão/pix
  const avgPaymentDays = Number(data.avgPaymentDays || 25); // Pagamento de fornecedores/ferramentas
  const financialCycleDays = Math.max(1, avgSalesReceiptDays - avgPaymentDays + 30);
  const dailyOperatingCost = (totalFixedCostsAnnual + totalVariableCosts) / 365;
  const workingCapitalNeeded = dailyOperatingCost * financialCycleDays;
  const contingencyReserve = totalFixedCostsMonthly * 3; // 3 meses de custos fixos
  const totalWorkingCapital = workingCapitalNeeded + contingencyReserve;

  // 9. Investimento Total
  const totalInvestment = capexTotal + preOpTotal + totalWorkingCapital;

  // 10. Indicadores Oficiais de Viabilidade SEBRAE
  // Ponto de Equilíbrio em R$ = Custos Fixos / (% Margem de Contribuição)
  const breakEvenReaisAnnual = contributionMarginPct > 0 ? (totalFixedCostsAnnual / (contributionMarginPct / 100)) : 0;
  const breakEvenReaisMonthly = breakEvenReaisAnnual / 12;

  // Ponto de Equilíbrio em Unidades de Assinaturas Anuais
  const breakEvenSubscribers = unitContributionMargin > 0 ? Math.ceil(totalFixedCostsAnnual / unitContributionMargin) : 0;

  // Lucratividade (%) = (Lucro Líquido / Receita Bruta) * 100
  const profitabilityPct = grossRevenue > 0 ? (netProfit / grossRevenue) * 100 : 0;

  // Rentabilidade (%) = (Lucro Líquido Anual / Investimento Total) * 100
  const returnOnInvestmentPct = totalInvestment > 0 ? (netProfit / totalInvestment) * 100 : 0;

  // Prazo de Retorno (Payback em Meses)
  const paybackMonths = netProfitMonthly > 0 ? Number((totalInvestment / netProfitMonthly).toFixed(1)) : 999;

  // Métricas SaaS adicionais
  const cacEstimate = Number(data.cacEstimate || 850); // Custo para fechar 1 cliente anual
  const ltvEstimate = annualPrice * 2.5; // Estimativa de retenção média de 2,5 anos (30 meses)
  const ltvCacRatio = cacEstimate > 0 ? Number((ltvEstimate / cacEstimate).toFixed(1)) : 0;

  return {
    grossRevenue,
    monthlyGrossRevenue,
    taxesValue,
    netRevenue,
    totalVariableCosts,
    monthlyVariableCosts,
    contributionMargin,
    contributionMarginPct: Number(contributionMarginPct.toFixed(2)),
    totalFixedCostsMonthly,
    totalFixedCostsAnnual,
    annualDepreciation,
    ebitda,
    netProfit,
    netProfitMonthly,
    netMarginPct: Number(netMarginPct.toFixed(2)),
    workingCapitalNeeded: Math.round(workingCapitalNeeded),
    contingencyReserve: Math.round(contingencyReserve),
    totalWorkingCapital: Math.round(totalWorkingCapital),
    totalInvestment: Math.round(totalInvestment),
    breakEvenReaisAnnual: Math.round(breakEvenReaisAnnual),
    breakEvenReaisMonthly: Math.round(breakEvenReaisMonthly),
    breakEvenSubscribers,
    profitabilityPct: Number(profitabilityPct.toFixed(2)),
    returnOnInvestmentPct: Number(returnOnInvestmentPct.toFixed(2)),
    paybackMonths,
    cacEstimate,
    ltvEstimate,
    ltvCacRatio,
    mrrEquivalent: Math.round(mrrEquivalent)
  };
}

/**
 * Simulador de Cenários: Pessimista vs Provável vs Otimista
 */
function simulateScenarios(basePlan) {
  const p = basePlan || {};

  // Provável (Base)
  const probableInputs = {
    annualSubscribers: Number(p.annualSubscribers || 20),
    annualPrice: Number(p.annualPrice || 12000),
    appliedIntelProjects: Number(p.appliedIntelProjects || 6),
    customResearchProjects: Number(p.customResearchProjects || 2),
    blogSponsorships: Number(p.blogSponsorships || 8),
    taxRatePct: 6.0,
    affiliateCommissionPct: 20.0,
    gatewayRatePct: 3.2,
    cogsPerUserYear: 380
  };
  const probableResult = calculateFinancialIndicators(probableInputs);

  // Pessimista (Vendas mais lentas, menor ticket médio, sem projetos avulsos de pesquisa)
  const pessimisticInputs = {
    ...probableInputs,
    annualSubscribers: Math.max(5, Math.floor(probableInputs.annualSubscribers * 0.45)), // ~9 assinantes
    annualPrice: 10000,
    appliedIntelProjects: 2,
    customResearchProjects: 0,
    blogSponsorships: 3,
    affiliateCommissionPct: 22.0
  };
  const pessimisticResult = calculateFinancialIndicators(pessimisticInputs);

  // Otimista (Alta demanda de construtoras, forte captação com parceiros e grandes contas)
  const optimisticInputs = {
    ...probableInputs,
    annualSubscribers: Math.floor(probableInputs.annualSubscribers * 1.8), // ~36 assinantes
    annualPrice: 14000,
    appliedIntelProjects: 12,
    customResearchProjects: 4,
    blogSponsorships: 16,
    affiliateCommissionPct: 18.0
  };
  const optimisticResult = calculateFinancialIndicators(optimisticInputs);

  return {
    pessimistic: pessimisticResult,
    probable: probableResult,
    optimistic: optimisticResult
  };
}

/**
 * Validação rigorosa do Capital Social (deve somar 100%)
 */

// =========================================================================
// CRONOGRAMA FINANCEIRO MÊS A MÊS (15 MESES: OUT/2026 A DEZ/2027)
// =========================================================================

const DEFAULT_MONTHLY_TIMELINE = [
  { month: "Out/2026", newSubs: 2, totalSubs: 2, mrr: 2000, servicesRev: 2500, grossRev: 4500, varCosts: 950, fixedCosts: 13500, netProfit: -9950, cumulativeCash: -9950, milestone: "🚀 Lançamento Oficial (Operação Enxuta Leo + Mayumi)" },
  { month: "Nov/2026", newSubs: 2, totalSubs: 4, mrr: 4000, servicesRev: 8000, grossRev: 12000, varCosts: 2400, fixedCosts: 13500, netProfit: -3900, cumulativeCash: -13850, milestone: "Ativação dos primeiros corretores parceiros em SJC" },
  { month: "Dez/2026", newSubs: 2, totalSubs: 6, mrr: 6000, servicesRev: 15000, grossRev: 21000, varCosts: 4200, fixedCosts: 13500, netProfit: 3300, cumulativeCash: -10550, milestone: "🎯 Ponto de Equilíbrio Atingido (Empresa já dá lucro no 3º mês!)" },
  { month: "Jan/2027", newSubs: 3, totalSubs: 9, mrr: 9000, servicesRev: 10500, grossRev: 19500, varCosts: 3900, fixedCosts: 15500, netProfit: 100, cumulativeCash: -10450, milestone: "👤 Contratação 1: Assistente de Suporte e Vendas (+R$ 2.000)" },
  { month: "Fev/2027", newSubs: 3, totalSubs: 12, mrr: 12000, servicesRev: 10500, grossRev: 22500, varCosts: 4500, fixedCosts: 15500, netProfit: 2500, cumulativeCash: -7950, milestone: "Aceleração de prospecção nas Zonas Oeste e Sul" },
  { month: "Mar/2027", newSubs: 3, totalSubs: 15, mrr: 15000, servicesRev: 16000, grossRev: 31000, varCosts: 6200, fixedCosts: 15500, netProfit: 9300, milestone: "Projetos de Inteligência Aplicada com construtoras de SJC" },
  { month: "Abr/2027", newSubs: 3, totalSubs: 18, mrr: 18000, servicesRev: 13000, grossRev: 31000, varCosts: 6200, fixedCosts: 15500, netProfit: 9300, cumulativeCash: 10650, milestone: "Receita recorrente supera R$ 18.000 / mês e caixa vira positivo!" },
  { month: "Mai/2027", newSubs: 4, totalSubs: 22, mrr: 22000, servicesRev: 18000, grossRev: 40000, varCosts: 8000, fixedCosts: 15500, netProfit: 16500, cumulativeCash: 27150, milestone: "Forte penetração em clínicas do Aquarius e Vila Ema" },
  { month: "Jun/2027", newSubs: 4, totalSubs: 26, mrr: 26000, servicesRev: 20500, grossRev: 46500, varCosts: 9300, fixedCosts: 18000, netProfit: 19200, cumulativeCash: 46350, milestone: "✍️ Contratação 2: Redator / Jornalista de Dados (+R$ 2.500)" },
  { month: "Jul/2027", newSubs: 4, totalSubs: 30, mrr: 30000, servicesRev: 18000, grossRev: 48000, varCosts: 9600, fixedCosts: 18000, netProfit: 20400, cumulativeCash: 66750, milestone: "🎯 Marca de 30 Assinantes Anuais superada!" },
  { month: "Ago/2027", newSubs: 4, totalSubs: 34, mrr: 34000, servicesRev: 22000, grossRev: 56000, varCosts: 11200, fixedCosts: 18000, netProfit: 26800, cumulativeCash: 93550, milestone: "Lucro líquido mensal supera R$ 26.000 no bolso" },
  { month: "Set/2027", newSubs: 4, totalSubs: 38, mrr: 38000, servicesRev: 18000, grossRev: 56000, varCosts: 11200, fixedCosts: 18000, netProfit: 26800, cumulativeCash: 120350, milestone: "1 Ano Completo: Primeiras renovações da edição 2026/2027" },
  { month: "Out/2027", newSubs: 4, totalSubs: 42, mrr: 42000, servicesRev: 24000, grossRev: 66000, varCosts: 13200, fixedCosts: 20000, netProfit: 32800, cumulativeCash: 153150, milestone: "Início da transição física de espaço próprio independente do Studio 8" },
  { month: "Nov/2027", newSubs: 4, totalSubs: 46, mrr: 46000, servicesRev: 20000, grossRev: 66000, varCosts: 13200, fixedCosts: 20000, netProfit: 32800, cumulativeCash: 185950, milestone: "Campanha especial corporativa para planejamento 2028" },
  { month: "Dez/2027", newSubs: 4, totalSubs: 50, mrr: 50000, servicesRev: 28000, grossRev: 78000, varCosts: 15600, fixedCosts: 20000, netProfit: 42400, cumulativeCash: 228350, milestone: "🏆 Fechamento 2027: 50 Clientes Anuais | R$ 50k MRR | R$ 42k Lucro Mensal" }
];

function calculateMonthlyTimeline(customTimeline = []) {
  const rows = (customTimeline && customTimeline.length > 0) ? customTimeline : DEFAULT_MONTHLY_TIMELINE;
  let runningCash = 0;
  return rows.map((r, i) => {
    const grossRev = Number(r.grossRev || ((Number(r.mrr) || 0) + (Number(r.servicesRev) || 0)));
    const varCosts = Number(r.varCosts || Math.round(grossRev * 0.20));
    const fixedCosts = Number(r.fixedCosts || 15000);
    const netProfit = Number(r.netProfit !== undefined ? r.netProfit : (grossRev - varCosts - fixedCosts));
    runningCash += netProfit;
    return {
      ...r,
      grossRev,
      varCosts,
      fixedCosts,
      netProfit,
      cumulativeCash: runningCash
    };
  });
}

function validateCapitalDistribution(partners = []) {
  if (!Array.isArray(partners) || partners.length === 0) {
    return { valid: false, sum: 0, message: "Pelo menos um sócio deve ser cadastrado." };
  }
  const sum = partners.reduce((acc, p) => acc + Number(p.capital_percent || 0), 0);
  const roundedSum = Math.round(sum * 100) / 100;
  const valid = Math.abs(roundedSum - 100) < 0.01;
  return {
    valid,
    sum: roundedSum,
    message: valid ? "Distribuição perfeita de 100% das cotas." : `A soma das cotas é de ${roundedSum}%. O total deve somar exatamente 100%.`
  };
}

// =========================================================================
// BANCO DE DADOS & PERSISTÊNCIA (SUPABASE REST / JSON FALLBACK)
// =========================================================================

// Mock de dados completo do Documento-Base para fallback imediato
const SEED_FALLBACK_PLAN = {
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
    layout_architecture: "Arquitetura Moderna e Escalável: Frontend em HTML5 responsivo com Tailwind CSS e FontAwesome; Backend Serverless em Node.js (Vercel); Banco de dados relacional e autenticação com Supabase Cloud; Motor de IA com Groq e Gemini Flash contextualizado na base territorial de SJC.",
    capacity: "Capacidade computacional de servidores para atender mais de 5.000 usuários simultâneos com 99.9% de uptime e tempo de resposta inferior a 2 segundos.",
    processes: "1) Aquisição & Demonstração (10 min)\n2) Contratação & Emissão automática de acesso\n3) Onboarding & Ativação de até 2 horas conduzida por Mayumi\n4) Exploração autônoma da inteligência e do Consultor IA\n5) Levantamento de novas perguntas e passagem para Inteligência Aplicada\n6) Ciclo de renovação anual com novas camadas históricas.",
    staff_requirements: [
      { role: "CEO & Head de Dados", qualification: "Engenharia / Dados / Gestão SaaS", quantity: 1, resp: "Leonardo Venâncio" },
      { role: "Head de Pesquisa & Conteúdo", qualification: "Sociologia / Jornalismo / Comunicação", quantity: 1, resp: "Mayumi Nagano" },
      { role: "Assistente Comercial & Suporte", qualification: "Atendimento B2B e Inside Sales", quantity: 1, resp: "Contratação planejada Fase 2" },
      { role: "Redator de Dados & Mídia", qualification: "Jornalismo de Dados / Redação SEO", quantity: 1, resp: "Contratação planejada Fase 3" }
    ]
  },
  financial_plan: {
    monthly_timeline: DEFAULT_MONTHLY_TIMELINE,
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
    { quadrant: "forca", description: "722 entrevistas territoriais próprias e exclusivas de SJC (dados reais vs dados genéricos de concorrentes)", impact_level: "alto" },
    { quadrant: "forca", description: "Software próprio com IA nativa sem dependência de licenças caras de terceiros", impact_level: "alto" },
    { quadrant: "forca", description: "Ativação de 2 horas inclusa para garantir engajamento e combater o abandono da ferramenta", impact_level: "alto" },
    { quadrant: "oportunidade", description: "Mercado imobiliário e médico de SJC investindo pesado em expansão e lançamentos", impact_level: "alto" },
    { quadrant: "oportunidade", description: "Empresas cansadas de consultorias de R$ 80 mil que não conhecem os bairros de SJC", impact_level: "alto" },
    { quadrant: "oportunidade", description: "Monetização de matérias patrocinadas no Blog com alta autoridade no Google", impact_level: "medio" },
    { quadrant: "fraqueza", description: "Necessidade de educar o empresário tradicional a usar dados e fazer perguntas melhores", impact_level: "alto" },
    { quadrant: "fraqueza", description: "Equipe fundadora inicial enxuta (Leonardo + Mayumi) exigindo automação máxima", impact_level: "medio" },
    { quadrant: "ameaca", description: "Tentativa de cópia superficial por institutos locais de pesquisa sem tecnologia SaaS", impact_level: "medio" },
    { quadrant: "ameaca", description: "Oscilações macroeconômicas que adiem decisões de investimento de pequenos lojistas", impact_level: "baixo" }
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
// SEGURANÇA & CONTROLE DE ACESSO (SUPABASE AUTH & RBAC SERVER-SIDE)
// =========================================================================

const SUPER_ADMIN_EMAILS = [
  'venancio.project@gmail.com',
  'gamersilvaesilva@gmail.com',
  'leonardo@radarsaojose.com.br',
  'leoserven@gmail.com'
];

/**
 * Extrai e valida o token Bearer via Supabase Auth (/auth/v1/user)
 * Retorna { ok: true, user } ou { ok: false, status, error, code }
 */
async function authenticateSupabaseRequest(req) {
  const headers = req.headers || {};
  const authHeader = headers.authorization || headers.Authorization || '';

  if (!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) {
    return {
      ok: false,
      status: 401,
      error: 'Não autorizado. Token de autenticação Bearer ausente ou formato inválido.',
      code: 'UNAUTHORIZED'
    };
  }

  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  if (!token) {
    return {
      ok: false,
      status: 401,
      error: 'Token de autenticação vazio.',
      code: 'UNAUTHORIZED'
    };
  }

  try {
    const authRes = await getDbPool().fetchWithPool(`${SUPABASE_URL}/auth/v1/user`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'apikey': SUPABASE_ANON_KEY
      }
    }, { timeoutMs: 8000, coalesce: true });

    if (!authRes.ok) {
      const errBody = await authRes.json().catch(() => ({}));
      return {
        ok: false,
        status: 401,
        error: 'Token de autenticação inválido, expirado ou revogado.',
        code: 'UNAUTHORIZED',
        details: errBody.message || errBody.msg || errBody.error_description
      };
    }

    const user = await authRes.json();
    if (!user || !user.id) {
      return {
        ok: false,
        status: 401,
        error: 'Usuário não identificado a partir do token fornecido.',
        code: 'UNAUTHORIZED'
      };
    }

    return { ok: true, user };
  } catch (err) {
    console.error('[Auth Error Business Plan]:', err.message);
    return {
      ok: false,
      status: 500,
      error: 'Erro interno ao validar autenticação com o provedor.',
      code: 'AUTH_SERVER_ERROR'
    };
  }
}

/**
 * Validação de Autorização Administrativa (RBAC) no Servidor
 * Aceita EXCLUSIVAMENTE fontes controladas pelo servidor:
 * 1) Lista explícita de superadministradores no backend (SUPER_ADMIN_EMAILS)
 * 2) app_metadata.role === 'admin' (definido apenas por service_role no Supabase)
 * 3) app_metadata.is_admin === true (definido apenas por service_role no Supabase)
 * 4) profiles.role === 'admin' (consultado server-side com SUPABASE_SERVICE_ROLE_KEY)
 * 
 * NUNCA utiliza user_metadata, body.role, query.role ou header.role para concessão de privilégios.
 */
async function isUserAdmin(user) {
  if (!user || typeof user !== 'object') return false;

  // 1. Verificação autoritativa por e-mail na lista de superadministradores do backend
  const email = (user.email || '').toLowerCase().trim();
  if (email && SUPER_ADMIN_EMAILS.includes(email)) {
    return true;
  }

  // 2. Verificação de claims administrativas em app_metadata (protegido contra edição pelo usuário)
  const appRole = (user.app_metadata?.role || '').toLowerCase().trim();
  if (appRole === 'admin') {
    return true;
  }
  if (user.app_metadata?.is_admin === true) {
    return true;
  }

  // 3. Consulta autoritativa da tabela profiles no Supabase via SUPABASE_SERVICE_KEY
  // (Requer chave de serviço; se não configurada, opera em fail-closed)
  const serviceKey = getSupabaseServiceKey();
  if (SUPABASE_URL && serviceKey && user.id) {
    try {
      const profileRes = await getDbPool().fetchWithPool(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${encodeURIComponent(user.id)}&select=role`, {
        method: 'GET',
        headers: {
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`
        }
      }, { timeoutMs: 8000, maxRetries: 0, coalesce: false });
      if (profileRes.ok) {
        const rows = await profileRes.json();
        if (Array.isArray(rows) && rows.length > 0 && rows[0].role === 'admin') {
          return true;
        }
      }
    } catch (profileErr) {
      console.warn('[Admin Check] Aviso ao consultar profile no Supabase:', profileErr.message);
    }
  }

  return false;
}

/**
 * Whitelist rígida de campos permitidos no Plano de Negócios.
 * Remove quaisquer injeções de campos administrativos (ex: role, is_admin, created_by, owner_id)
 * ou propriedades arbitrárias que possam causar poluição de protótipo ou vulnerabilidades.
 */
function sanitizeBusinessPlanPayload(rawPayload) {
  if (!rawPayload || typeof rawPayload !== 'object' || Array.isArray(rawPayload)) {
    return null;
  }

  const clean = {};

  if (typeof rawPayload.title === 'string') clean.title = rawPayload.title.trim().slice(0, 300);
  if (typeof rawPayload.company_name === 'string') clean.company_name = rawPayload.company_name.trim().slice(0, 200);
  if (typeof rawPayload.cnpj === 'string') clean.cnpj = rawPayload.cnpj.trim().slice(0, 30);
  if (typeof rawPayload.version === 'string') clean.version = rawPayload.version.trim().slice(0, 50);

  if (rawPayload.executive_summary && typeof rawPayload.executive_summary === 'object' && !Array.isArray(rawPayload.executive_summary)) {
    clean.executive_summary = {
      business_description: String(rawPayload.executive_summary.business_description || ''),
      mission: String(rawPayload.executive_summary.mission || ''),
      legal_form: String(rawPayload.executive_summary.legal_form || ''),
      tax_regime: String(rawPayload.executive_summary.tax_regime || ''),
      tax_detail: String(rawPayload.executive_summary.tax_detail || ''),
      sectors: Array.isArray(rawPayload.executive_summary.sectors) ? rawPayload.executive_summary.sectors.map(String) : [],
      location: String(rawPayload.executive_summary.location || ''),
      funding_sources: String(rawPayload.executive_summary.funding_sources || '')
    };
  }

  if (Array.isArray(rawPayload.partners)) {
    clean.partners = rawPayload.partners.map(p => ({
      id: String(p.id || ''),
      name: String(p.name || ''),
      role: String(p.role || ''),
      email: String(p.email || ''),
      phone: String(p.phone || ''),
      city_state: String(p.city_state || ''),
      address: String(p.address || ''),
      profile_bio: String(p.profile_bio || ''),
      responsibilities: String(p.responsibilities || ''),
      capital_value: Number(p.capital_value) || 0,
      capital_percent: Number(p.capital_percent) || 0
    }));
  }

  if (rawPayload.market_analysis && typeof rawPayload.market_analysis === 'object' && !Array.isArray(rawPayload.market_analysis)) {
    clean.market_analysis = rawPayload.market_analysis;
  }
  if (rawPayload.marketing_plan && typeof rawPayload.marketing_plan === 'object' && !Array.isArray(rawPayload.marketing_plan)) {
    clean.marketing_plan = rawPayload.marketing_plan;
  }
  if (rawPayload.operational_plan && typeof rawPayload.operational_plan === 'object' && !Array.isArray(rawPayload.operational_plan)) {
    clean.operational_plan = rawPayload.operational_plan;
  }

  if (rawPayload.financial_plan && typeof rawPayload.financial_plan === 'object' && !Array.isArray(rawPayload.financial_plan)) {
    clean.financial_plan = {
      inputs: (rawPayload.financial_plan.inputs && typeof rawPayload.financial_plan.inputs === 'object')
        ? rawPayload.financial_plan.inputs
        : {},
      capex_investments: Array.isArray(rawPayload.financial_plan.capex_investments)
        ? rawPayload.financial_plan.capex_investments
        : [],
      pre_operational_investments: Array.isArray(rawPayload.financial_plan.pre_operational_investments)
        ? rawPayload.financial_plan.pre_operational_investments
        : [],
      monthly_timeline: Array.isArray(rawPayload.financial_plan.monthly_timeline)
        ? rawPayload.financial_plan.monthly_timeline
        : []
    };
  }

  if (Array.isArray(rawPayload.swot)) clean.swot = rawPayload.swot;
  if (Array.isArray(rawPayload.monday_tasks)) clean.monday_tasks = rawPayload.monday_tasks;
  if (rawPayload.evaluation && typeof rawPayload.evaluation === 'object' && !Array.isArray(rawPayload.evaluation)) {
    clean.evaluation = {
      final_reflection: String(rawPayload.evaluation.final_reflection || '')
    };
  }

  return clean;
}

/**
 * Localiza e atualiza de forma estrita e unívoca o registro oficial do Plano de Negócios.
 * Garante que:
 * - Se SUPABASE_SERVICE_ROLE_KEY não estiver configurada: erro fail-closed (500).
 * - Se 0 registros ativos: insere o plano oficial ativo deterministamente.
 * - Se 1 registro ativo: atualiza estritamente pela chave primária (id = targetId), NUNCA por is_active em massa.
 * - Se > 1 registros ativos: bloqueia com erro 409 (Conflict) para impedir corrupção acidental em lote.
 */
async function saveBusinessPlanToSupabase(sanitizedPayload, calculatedKpis, userEmail) {
  const serviceKey = getSupabaseServiceKey();
  if (!SUPABASE_URL || !serviceKey) {
    return {
      persisted: false,
      statusCode: 500,
      error: 'Erro de configuração: SUPABASE_SERVICE_ROLE_KEY ausente para persistência administrativa.',
      code: 'CONFIG_SERVICE_ROLE_KEY_MISSING'
    };
  }

  // 1. Busca planos ativos existentes ordenados por data
  let queryRes;
  try {
    queryRes = await getDbPool().fetchWithPool(`${SUPABASE_URL}/rest/v1/business_plans?is_active=eq.true&select=id,version,updated_at&order=updated_at.desc`, {
      method: 'GET',
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Content-Type': 'application/json'
      }
    }, { timeoutMs: 8000, maxRetries: 0, coalesce: false });
  } catch (err) {
    return {
      persisted: false,
      statusCode: 502,
      error: 'Falha de comunicação com o banco de dados Supabase.',
      code: 'DATABASE_CONNECTION_ERROR'
    };
  }

  if (!queryRes.ok) {
    const errText = await queryRes.text().catch(() => '');
    return {
      persisted: false,
      statusCode: queryRes.status === 404 ? 404 : 500,
      error: `Erro retornado pelo banco de dados (${queryRes.status}): ${errText.slice(0, 150)}`,
      code: queryRes.status === 404 ? 'TABLE_NOT_FOUND' : 'DATABASE_ERROR'
    };
  }

  const activeRows = await queryRes.json();

  // CENÁRIO A: Mais de 1 plano ativo detectado (Conflito de Integridade) -> Bloqueio Preventivo
  if (Array.isArray(activeRows) && activeRows.length > 1) {
    console.error(`[Business Plan] Conflito de integridade: ${activeRows.length} planos ativos detectados no banco.`);
    return {
      persisted: false,
      statusCode: 409,
      error: `Conflito de integridade: múltiplos planos (${activeRows.length}) marcados como ativos. A operação foi abortada para evitar sobrescrita acidental em lote.`,
      code: 'MULTIPLE_ACTIVE_PLANS_CONFLICT'
    };
  }

  // CENÁRIO B: Exatamente 1 plano ativo encontrado -> Atualização DETERMINÍSTICA por ID único
  if (Array.isArray(activeRows) && activeRows.length === 1) {
    const targetId = activeRows[0].id;
    try {
      const patchRes = await getDbPool().fetchWithPool(`${SUPABASE_URL}/rest/v1/business_plans?id=eq.${encodeURIComponent(targetId)}`, {
        method: 'PATCH',
        headers: {
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          data: sanitizedPayload,
          financial_kpis: calculatedKpis,
          updated_at: new Date().toISOString(),
          updated_by: userEmail || 'admin'
        })
      }, { timeoutMs: 8000, maxRetries: 0 });

      if (!patchRes.ok) {
        return {
          persisted: false,
          statusCode: patchRes.status,
          error: 'Falha ao atualizar o plano de negócios no banco de dados.',
          code: 'DATABASE_UPDATE_ERROR'
        };
      }

      const updatedRows = await patchRes.json().catch(() => []);
      return {
        persisted: true,
        statusCode: 200,
        targetId,
        updatedCount: Array.isArray(updatedRows) ? updatedRows.length : 1
      };
    } catch (dbErr) {
      return {
        persisted: false,
        statusCode: 500,
        error: dbErr.message,
        code: 'DATABASE_EXCEPTION'
      };
    }
  }

  // CENÁRIO C: 0 planos ativos encontrados -> Inserção determinística do plano oficial ativo
  try {
    const insertRes = await getDbPool().fetchWithPool(`${SUPABASE_URL}/rest/v1/business_plans`, {
      method: 'POST',
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        title: sanitizedPayload.title || SEED_FALLBACK_PLAN.title,
        company_name: sanitizedPayload.company_name || SEED_FALLBACK_PLAN.company_name,
        cnpj: sanitizedPayload.cnpj || SEED_FALLBACK_PLAN.cnpj,
        version: sanitizedPayload.version || SEED_FALLBACK_PLAN.version,
        is_active: true,
        data: sanitizedPayload,
        financial_kpis: calculatedKpis,
        updated_at: new Date().toISOString(),
        updated_by: userEmail || 'admin'
      })
    }, { timeoutMs: 8000, maxRetries: 0 });

    if (!insertRes.ok) {
      return {
        persisted: false,
        statusCode: insertRes.status,
        error: 'Falha ao inicializar novo plano de negócios no banco de dados.',
        code: 'DATABASE_INSERT_ERROR'
      };
    }

    const insertedRows = await insertRes.json().catch(() => []);
    const newId = Array.isArray(insertedRows) && insertedRows[0] ? insertedRows[0].id : null;
    return {
      persisted: true,
      statusCode: 200,
      targetId: newId,
      inserted: true
    };
  } catch (err) {
    return {
      persisted: false,
      statusCode: 500,
      error: err.message,
      code: 'DATABASE_EXCEPTION'
    };
  }
}

// =========================================================================
// HANDLER PRINCIPAL VERCEL SERVERLESS
// =========================================================================

module.exports = async function handler(req, res) {
  // Cabeçalhos de Segurança e CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // Verificação de Métodos HTTP Permitidos (Rejeita DELETE, PATCH, etc.)
  const allowedMethods = ['GET', 'POST', 'PUT', 'OPTIONS'];
  if (!allowedMethods.includes(req.method)) {
    res.setHeader('Allow', 'GET, POST, PUT, OPTIONS');
    return res.status(405).json({
      success: false,
      error: `Método ${req.method} não permitido neste endpoint.`,
      code: 'METHOD_NOT_ALLOWED'
    });
  }

  try {
    const query = req.query || {};
    const { action } = query;

    // Ação: Calcular Indicadores isolados (Simulação puramente em memória, stateless)
    if (action === 'calculate' && req.method === 'POST') {
      const { inputs, capexTotal, preOpTotal } = req.body || {};
      const calculated = calculateFinancialIndicators(inputs, capexTotal, preOpTotal);
      const scenarios = simulateScenarios(inputs);
      return res.status(200).json({
        success: true,
        indicators: calculated,
        scenarios
      });
    }

    // Ação: Restaurar Padrão do Documento-Base (Operação administrativa crítica: Exige Admin)
    if (action === 'reset' && req.method === 'POST') {
      const auth = await authenticateSupabaseRequest(req);
      if (!auth.ok) {
        return res.status(auth.status).json({
          success: false,
          error: auth.error,
          code: auth.code
        });
      }

      const isAdmin = await isUserAdmin(auth.user);
      if (!isAdmin) {
        return res.status(403).json({
          success: false,
          error: 'Acesso negado. Apenas administradores podem restaurar ou resetar o Plano de Negócios.',
          code: 'FORBIDDEN'
        });
      }

      // Fail-closed se SUPABASE_SERVICE_KEY não estiver configurada no servidor
      const serviceKey = getSupabaseServiceKey();
      if (!serviceKey) {
        return res.status(500).json({
          success: false,
          error: 'Erro de configuração interna do servidor para operações de persistência administrativa.',
          code: 'CONFIG_SERVICE_ROLE_KEY_MISSING'
        });
      }

      const calculated = calculateFinancialIndicators(SEED_FALLBACK_PLAN.financial_plan.inputs, 50000, 25000);
      const scenarios = simulateScenarios(SEED_FALLBACK_PLAN.financial_plan.inputs);
      const capitalValidation = validateCapitalDistribution(SEED_FALLBACK_PLAN.partners);

      const saveResult = await saveBusinessPlanToSupabase(SEED_FALLBACK_PLAN, calculated, auth.user?.email);
      if (!saveResult.persisted) {
        return res.status(saveResult.statusCode || 500).json({
          success: false,
          error: saveResult.error,
          code: saveResult.code
        });
      }

      return res.status(200).json({
        success: true,
        persistedToCloud: true,
        targetId: saveResult.targetId,
        message: "Plano de Negócios restaurado com sucesso para os dados oficiais do Documento-Base por administrador.",
        plan: {
          ...SEED_FALLBACK_PLAN,
          calculated_kpis: calculated,
          scenarios,
          capital_validation: capitalValidation
        }
      });
    }

    // POST / PUT: Salvar Plano de Negócios & Recalcular no Servidor (Exige Admin)
    if (req.method === 'POST' || req.method === 'PUT') {
      // 1. Autenticação JWT no Supabase Auth
      const auth = await authenticateSupabaseRequest(req);
      if (!auth.ok) {
        return res.status(auth.status).json({
          success: false,
          error: auth.error,
          code: auth.code
        });
      }

      // 2. Autorização RBAC no Servidor
      const isAdmin = await isUserAdmin(auth.user);
      if (!isAdmin) {
        return res.status(403).json({
          success: false,
          error: 'Acesso negado. Apenas administradores autenticados têm permissão para modificar o Plano de Negócios.',
          code: 'FORBIDDEN'
        });
      }

      // 3. Sanitização e Whitelisting do Payload
      const sanitizedPayload = sanitizeBusinessPlanPayload(req.body);
      if (!sanitizedPayload || Object.keys(sanitizedPayload).length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Corpo da requisição inválido ou vazio.',
          code: 'BAD_REQUEST'
        });
      }

      // 4. Fail-closed se SUPABASE_SERVICE_KEY não estiver configurada no servidor
      const serviceKey = getSupabaseServiceKey();
      if (!serviceKey) {
        return res.status(500).json({
          success: false,
          error: 'Erro de configuração interna do servidor para operações de persistência administrativa.',
          code: 'CONFIG_SERVICE_ROLE_KEY_MISSING'
        });
      }

      const finInputs = sanitizedPayload.financial_plan?.inputs || SEED_FALLBACK_PLAN.financial_plan.inputs;
      const capexTotal = (sanitizedPayload.financial_plan?.capex_investments || []).reduce(
        (acc, i) => acc + (Number(i.total) || (Number(i.qty) * Number(i.unit_val)) || 0),
        0
      ) || 50000;
      const preOpTotal = (sanitizedPayload.financial_plan?.pre_operational_investments || []).reduce(
        (acc, i) => acc + (Number(i.val) || 0),
        0
      ) || 25000;

      const calculated = calculateFinancialIndicators(finInputs, capexTotal, preOpTotal);
      const scenarios = simulateScenarios(finInputs);
      const capitalValidation = validateCapitalDistribution(sanitizedPayload.partners || SEED_FALLBACK_PLAN.partners);

      // 5. Persistência Protegida e Determinística no Supabase Cloud (Single Target ID)
      const saveResult = await saveBusinessPlanToSupabase(sanitizedPayload, calculated, auth.user?.email);
      if (!saveResult.persisted) {
        return res.status(saveResult.statusCode || 500).json({
          success: false,
          error: saveResult.error,
          code: saveResult.code
        });
      }

      return res.status(200).json({
        success: true,
        persistedToCloud: true,
        targetId: saveResult.targetId,
        message: "Plano de Negócios salvo e recalculado com sucesso por administrador.",
        calculated_kpis: calculated,
        scenarios,
        capital_validation: capitalValidation
      });
    }

    // GET: Buscar Plano Ativo (Dado Estratégico Sensível: Exige Autenticação e Perfil de Admin)
    if (req.method === 'GET') {
      const auth = await authenticateSupabaseRequest(req);
      if (!auth.ok) {
        return res.status(auth.status).json({
          success: false,
          error: 'Acesso restrito. Autenticação de administrador necessária para consultar o Plano de Negócios estratégico.',
          code: auth.code
        });
      }

      const isAdmin = await isUserAdmin(auth.user);
      if (!isAdmin) {
        return res.status(403).json({
          success: false,
          error: 'Acesso negado. Apenas administradores podem visualizar o Plano de Negócios confidencial.',
          code: 'FORBIDDEN'
        });
      }

      let activePlan = JSON.parse(JSON.stringify(SEED_FALLBACK_PLAN));
      let fromCloud = false;

      // Se a service key estiver configurada, busca do Supabase com identificação unívoca
      const serviceKey = getSupabaseServiceKey();
      if (SUPABASE_URL && serviceKey) {
        try {
          const fetchRes = await getDbPool().fetchWithPool(`${SUPABASE_URL}/rest/v1/business_plans?is_active=eq.true&select=*&order=updated_at.desc&limit=1`, {
            method: 'GET',
            headers: {
              'apikey': serviceKey,
              'Authorization': `Bearer ${serviceKey}`,
              'Content-Type': 'application/json'
            }
          }, { timeoutMs: 8000, maxRetries: 0, coalesce: false });
          if (fetchRes.ok) {
            const rows = await fetchRes.json();
            if (Array.isArray(rows) && rows.length > 0 && rows[0].data && Object.keys(rows[0].data).length > 0) {
              activePlan = { ...activePlan, ...rows[0].data, id: rows[0].id };
              fromCloud = true;
            }
          }
        } catch (dbErr) {
          console.warn("[Backend] Falha na consulta remota Supabase, usando seed local:", dbErr.message);
        }
      }

      const calculated = calculateFinancialIndicators(activePlan.financial_plan?.inputs || SEED_FALLBACK_PLAN.financial_plan.inputs);
      const scenarios = simulateScenarios(activePlan.financial_plan?.inputs || SEED_FALLBACK_PLAN.financial_plan.inputs);
      const capitalValidation = validateCapitalDistribution(activePlan.partners || SEED_FALLBACK_PLAN.partners);

      return res.status(200).json({
        success: true,
        fromCloud,
        plan: activePlan,
        calculated_kpis: calculated,
        scenarios,
        capital_validation: capitalValidation
      });
    }

  } catch (error) {
    console.error("[Backend Error Business Plan]:", error);
    return res.status(500).json({
      success: false,
      error: "Erro interno no servidor de Plano de Negócios"
    });
  }
};

// Exportações para testes unitários automatizados
module.exports.calculateFinancialIndicators = calculateFinancialIndicators;
module.exports.simulateScenarios = simulateScenarios;
module.exports.validateCapitalDistribution = validateCapitalDistribution;
module.exports.SEED_FALLBACK_PLAN = SEED_FALLBACK_PLAN;
module.exports.DEFAULT_MONTHLY_TIMELINE = DEFAULT_MONTHLY_TIMELINE;
module.exports.calculateMonthlyTimeline = calculateMonthlyTimeline;

// Exportações de funções de segurança para auditoria e suíte de testes
module.exports.authenticateSupabaseRequest = authenticateSupabaseRequest;
module.exports.isUserAdmin = isUserAdmin;
module.exports.sanitizeBusinessPlanPayload = sanitizeBusinessPlanPayload;
module.exports.saveBusinessPlanToSupabase = saveBusinessPlanToSupabase;
module.exports.getSupabaseServiceKey = getSupabaseServiceKey;
module.exports.SUPER_ADMIN_EMAILS = SUPER_ADMIN_EMAILS;



