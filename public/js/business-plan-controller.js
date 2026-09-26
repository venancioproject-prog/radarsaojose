// =========================================================================
// RADAR SÃO JOSÉ - CONTROLADOR DO PLANO DE NEGÓCIOS SEBRAE / SAAS
// Documento Executivo Contínuo, Edição Inline & Motor Financeiro Reativo
// =========================================================================

const PLAN_STORAGE_KEY_V2 = 'radarsaojose_business_plan_doc_v2';

// -------------------------------------------------------------------------
// ESTADO PADRÃO OFICIAL (Plano_de_Negócios_Radar_São_José.md - Set/2026)
// -------------------------------------------------------------------------
const DEFAULT_PLAN_STATE = {
  tickets: {
    essencial: 197,
    pro: 397,
    intelligence: 990
  },
  fixedCosts: {
    supabase: 110,
    vercel: 110,
    dominio: 5,
    email: 20
  },
  proLabore: {
    leonardo: 5000,
    mayumi: 5000
  },
  taxRate: 9.2, // % Simples Nacional
  initialDebt: 86000, // R$ 80.000 sócios + R$ 6.000 fornecedores
  supplierDebt: 6000, // André R$ 4.000 + Samuel R$ 2.000
  mix: {
    essencial: 0.45,
    pro: 0.40,
    intelligence: 0.15
  },
  annualPaymentMix: 0.10, // 10% optam pelo anual
  annualDiscount: 0.20, // 20% desconto no anual (equiv. fator 0.98)
  
  // 15 meses de projeção de clientes por cenário
  scenarios: {
    probable: [
      { m: "Out/26", ess: 2, pro: 1, int: 0 },
      { m: "Nov/26", ess: 3, pro: 2, int: 0 },
      { m: "Dez/26", ess: 4, pro: 3, int: 0 },
      { m: "Jan/27", ess: 5, pro: 3, int: 1 },
      { m: "Fev/27", ess: 6, pro: 4, int: 1 },
      { m: "Mar/27", ess: 7, pro: 5, int: 1 },
      { m: "Abr/27", ess: 7, pro: 6, int: 2 },
      { m: "Mai/27", ess: 8, pro: 7, int: 2 },
      { m: "Jun/27", ess: 8, pro: 8, int: 2 },
      { m: "Jul/27", ess: 9, pro: 9, int: 2 },
      { m: "Ago/27", ess: 9, pro: 10, int: 3 },
      { m: "Set/27", ess: 10, pro: 11, int: 3 },
      { m: "Out/27", ess: 10, pro: 12, int: 4 },
      { m: "Nov/27", ess: 11, pro: 13, int: 4 },
      { m: "Dez/27", ess: 11, pro: 14, int: 5 }
    ],
    pessimistic: [
      { m: "Out/26", ess: 2, pro: 0, int: 0 },
      { m: "Nov/26", ess: 3, pro: 0, int: 0 },
      { m: "Dez/26", ess: 4, pro: 1, int: 0 },
      { m: "Jan/27", ess: 5, pro: 1, int: 0 },
      { m: "Fev/27", ess: 6, pro: 1, int: 0 },
      { m: "Mar/27", ess: 7, pro: 2, int: 0 },
      { m: "Abr/27", ess: 8, pro: 2, int: 0 },
      { m: "Mai/27", ess: 9, pro: 3, int: 0 },
      { m: "Jun/27", ess: 10, pro: 3, int: 0 },
      { m: "Jul/27", ess: 11, pro: 4, int: 0 },
      { m: "Ago/27", ess: 12, pro: 4, int: 0 },
      { m: "Set/27", ess: 13, pro: 5, int: 0 },
      { m: "Out/27", ess: 14, pro: 5, int: 0 },
      { m: "Nov/27", ess: 15, pro: 6, int: 0 },
      { m: "Dez/27", ess: 16, pro: 7, int: 0 }
    ],
    optimistic: [
      { m: "Out/26", ess: 3, pro: 1, int: 0 },
      { m: "Nov/26", ess: 4, pro: 2, int: 1 },
      { m: "Dez/26", ess: 5, pro: 3, int: 1 },
      { m: "Jan/27", ess: 6, pro: 4, int: 2 },
      { m: "Fev/27", ess: 7, pro: 5, int: 2 },
      { m: "Mar/27", ess: 8, pro: 6, int: 3 },
      { m: "Abr/27", ess: 9, pro: 8, int: 3 },
      { m: "Mai/27", ess: 10, pro: 9, int: 4 },
      { m: "Jun/27", ess: 11, pro: 10, int: 4 },
      { m: "Jul/27", ess: 12, pro: 11, int: 5 },
      { m: "Ago/27", ess: 13, pro: 12, int: 5 },
      { m: "Set/27", ess: 14, pro: 13, int: 6 },
      { m: "Out/27", ess: 15, pro: 14, int: 6 },
      { m: "Nov/27", ess: 16, pro: 15, int: 7 },
      { m: "Dez/27", ess: 17, pro: 16, int: 8 }
    ]
  },

  // Monday.com: Divisão de Tarefas entre Leonardo Venâncio & Mayumi Nagano (15 Tarefas Estratégicas do Doc-Base)
  mondayTasks: [
    { id: "task-1", title: "Formalizar CNPJ independente do Radar São José (LTDA) e regime tributário", responsible: "leonardo", phase: "Fundação & Governança", status: "done", priority: "critical", due_date: "2026-10-05", notes: "Separar ativo empresarial do Studio 8 conforme diretriz do SEBRAE e definir CNAEs." },
    { id: "task-2", title: "Formalizar aporte de capital social de R$ 101.050 por sócio", responsible: "ambos", phase: "Finanças & Capital", status: "done", priority: "critical", due_date: "2026-10-10", notes: "Reconhecimento das cotas iguais (50%/50%) e integralização documental." },
    { id: "task-3", title: "Consolidar base primária das 722 entrevistas de SJC e dados demográficos", responsible: "mayumi", phase: "Inteligência de Dados", status: "done", priority: "high", due_date: "2026-10-15", notes: "Base oficial de São José dos Campos dividida por 6 macrorregiões e 19 bairros." },
    { id: "task-4", title: "Parametrizar Consultor IA com contexto unificado das 10 personas e regiões", responsible: "leonardo", phase: "Plataforma SaaS", status: "in_progress", priority: "critical", due_date: "2026-11-05", notes: "IA respondendo dúvidas de mercado com dados reais da pesquisa e microdados locais." },
    { id: "task-5", title: "Estruturar roteiro metodológico da Ativação Consultiva de 2h para clientes", responsible: "mayumi", phase: "Operação & Ativação", status: "in_progress", priority: "high", due_date: "2026-11-12", notes: "Ensinar cliente a transformar sua dor em perguntas dentro do Radar e gerar valor em 14 dias." },
    { id: "task-6", title: "Conduzir 30 entrevistas qualitativas de validação com potenciais compradores", responsible: "mayumi", phase: "Pesquisa & Mercado", status: "in_progress", priority: "high", due_date: "2026-11-18", notes: "Testar disposição a pagar nas faixas R$ 197 e R$ 397 com comércio e serviços locais." },
    { id: "task-7", title: "Implementar Portal do Vendedor / Afiliados com comissão de 20%", responsible: "leonardo", phase: "Comercial & Vendas", status: "done", priority: "high", due_date: "2026-11-25", notes: "Atrair corretores de imóveis e consultores de SJC para venda ativa e prospecção local." },
    { id: "task-8", title: "Auditar e higienizar base territorial de 126 mil empresas sob LGPD", responsible: "leonardo", phase: "Compliance & LGPD", status: "in_progress", priority: "critical", due_date: "2026-12-08", notes: "Garantir opt-out claro, segurança e governança para dados corporativos públicos e privados." },
    { id: "task-9", title: "Lançar pauta com 10 matérias estratégicas no Blog e inteligência de SEO local", responsible: "mayumi", phase: "Marketing & Mídia", status: "in_progress", priority: "medium", due_date: "2026-12-15", notes: "Atração orgânica via Google SEO de empresários que buscam dados demográficos da cidade." },
    { id: "task-10", title: "Validar conversão inicial dos planos Essencial (R$ 197) e Pro (R$ 397) em SJC", responsible: "leonardo", phase: "Comercial & Vendas", status: "in_progress", priority: "critical", due_date: "2026-12-22", notes: "Acelerar conversão PLG e pipeline ativo para atingir receita necessária ao break-even." },
    { id: "task-11", title: "Estabelecer parcerias institucionais com ACI, SEBRAE e Universidades de SJC", responsible: "mayumi", phase: "Parcerias Institucionais", status: "todo", priority: "high", due_date: "2027-01-15", notes: "Licenças educacionais e integração em programas de fomento ao empreendedorismo local." },
    { id: "task-12", title: "Fechar primeiros contratos do Plano Institucional (R$ 1.197/mês) com poder público ou redes", responsible: "ambos", phase: "Comercial & Vendas", status: "todo", priority: "high", due_date: "2027-02-10", notes: "Contas consultivas com maior LTV para acelerar o equilíbrio financeiro do negócio." },
    { id: "task-13", title: "Revisão do ponto de equilíbrio e fechamento trimestral dos 3 cenários operacionais", responsible: "leonardo", phase: "Finanças & Controladoria", status: "todo", priority: "critical", due_date: "2027-03-20", notes: "Comparativo realizado vs. orçado nos cenários pessimista, provável e otimista." },
    { id: "task-14", title: "Executar rodada semestral de atualização de dados e pesquisa de satisfação/churn", responsible: "mayumi", phase: "Pesquisa & Produto", status: "todo", priority: "medium", due_date: "2027-05-15", notes: "Manter dados territoriais frescos e monitorar churn trimestral abaixo de 5%." },
    { id: "task-15", title: "Estudo de viabilidade de expansão territorial para Jacareí, Taubaté e Vale do Paraíba", responsible: "ambos", phase: "Expansão & Escala", status: "todo", priority: "medium", due_date: "2027-07-20", notes: "Modelar replicação do SaaS territorial para outras cidades do cluster RMVale." }
  ],

  // Textos editados pelo usuário (se houver modificações inline salvas)
  editedTexts: {},

  // Tabelas descritivas customizadas (Segmentos, Fornecedores, Produtos, Pessoal, DRE)
  tableContents: {},

  // Blocos customizados inseridos dinamicamente (Callouts, Riscos, Mini-Planilhas)
  customBlocks: [],

  // Planilha financeira colaborativa (Excel-style)
  financialSheet: [],

  // Canvas SWOT (Miro-style) - 48 itens oficiais do Doc-Base SEBRAE
  swotCards: [
    // Forças (12)
    { id: "swot-f-1", quadrant: "forcas", text: "Pesquisa própria e contextualizada de SJC (722 entrevistas)", color: "#059669" },
    { id: "swot-f-2", quadrant: "forcas", text: "Produto digital recorrente com custo marginal de distribuição nulo", color: "#059669" },
    { id: "swot-f-3", quadrant: "forcas", text: "Dados acessíveis para múltiplos públicos (empresas, estudantes, instituições)", color: "#059669" },
    { id: "swot-f-4", quadrant: "forcas", text: "PLG reduz barreira inicial de entrada e gera experimentação direta", color: "#059669" },
    { id: "swot-f-5", quadrant: "forcas", text: "Atendimento próximo, ágil e consultivo dos fundadores", color: "#059669" },
    { id: "swot-f-6", quadrant: "forcas", text: "Equipe multidisciplinar com competências complementares (pesquisa, tecnologia e growth)", color: "#059669" },
    { id: "swot-f-7", quadrant: "forcas", text: "Conteúdo local cria autoridade territorial contínua", color: "#059669" },
    { id: "swot-f-8", quadrant: "forcas", text: "Possibilidade de combinar assinatura SaaS e projetos customizados", color: "#059669" },
    { id: "swot-f-9", quadrant: "forcas", text: "Dados públicos e próprios atualizados continuamente", color: "#059669" },
    { id: "swot-f-10", quadrant: "forcas", text: "Dashboard interativo facilita comunicação executiva de achados", color: "#059669" },
    { id: "swot-f-11", quadrant: "forcas", text: "Cobertura granular por macrorregiões e bairros de São José dos Campos", color: "#059669" },
    { id: "swot-f-12", quadrant: "forcas", text: "Capacidade de atender clientes e empresas nacionais que entram em SJC", color: "#059669" },
    // Fraquezas (12)
    { id: "swot-w-1", quadrant: "fraquezas", text: "Marca ainda em fase inicial de pré-lançamento e tração comercial", color: "#d97706" },
    { id: "swot-w-2", quadrant: "fraquezas", text: "Base pagante inicial pequena ou em validação", color: "#d97706" },
    { id: "swot-w-3", quadrant: "fraquezas", text: "Dependência direta da dedicação e tempo dos dois fundadores", color: "#d97706" },
    { id: "swot-w-4", quadrant: "fraquezas", text: "Orçamento de mídia e marketing inicial enxuto", color: "#d97706" },
    { id: "swot-w-5", quadrant: "fraquezas", text: "Necessidade de comprovar disposição a pagar em escala", color: "#d97706" },
    { id: "swot-w-6", quadrant: "fraquezas", text: "Custos de APIs de inteligência artificial podem variar com o uso", color: "#d97706" },
    { id: "swot-w-7", quadrant: "fraquezas", text: "Dados de pesquisa primária precisam de atualização periódica contínua", color: "#d97706" },
    { id: "swot-w-8", quadrant: "fraquezas", text: "Baixa capacidade simultânea para grandes projetos consultivos customizados", color: "#d97706" },
    { id: "swot-w-9", quadrant: "fraquezas", text: "Processo comercial ativo ainda em ciclo de estruturação e aprendizado", color: "#d97706" },
    { id: "swot-w-10", quadrant: "fraquezas", text: "Risco de confusão de posicionamento (produto SaaS vs. consultoria vs. instituto)", color: "#d97706" },
    { id: "swot-w-11", quadrant: "fraquezas", text: "Necessidade de governança estrita para dados sensíveis e LGPD", color: "#d97706" },
    { id: "swot-w-12", quadrant: "fraquezas", text: "Capital de giro relevante necessário até atingir o ponto de equilíbrio", color: "#d97706" },
    // Oportunidades (12)
    { id: "swot-o-1", quadrant: "oportunidades", text: "Expansão de empresas e franquias nacionais para SJC", color: "#0891b2" },
    { id: "swot-o-2", quadrant: "oportunidades", text: "Demanda contínua de redes, franquias e incorporadoras imobiliárias", color: "#0891b2" },
    { id: "swot-o-3", quadrant: "oportunidades", text: "Uso educacional e licenças acadêmicas para estudantes e universidades", color: "#0891b2" },
    { id: "swot-o-4", quadrant: "oportunidades", text: "Contratos institucionais com poder público e conselhos setoriais", color: "#0891b2" },
    { id: "swot-o-5", quadrant: "oportunidades", text: "Produtos e inteligência para mandatos e comunicação institucional", color: "#0891b2" },
    { id: "swot-o-6", quadrant: "oportunidades", text: "Parcerias estratégicas com universidades locais (UNIFESP, ITA, Univap, Fatec)", color: "#0891b2" },
    { id: "swot-o-7", quadrant: "oportunidades", text: "Parcerias com associações comerciais e empresariais (ACI, Ciesp, Sebrae)", color: "#0891b2" },
    { id: "swot-o-8", quadrant: "oportunidades", text: "Licenciamento para agências de publicidade e consultorias locais", color: "#0891b2" },
    { id: "swot-o-9", quadrant: "oportunidades", text: "Clipping territorial e monitoramento temático automatizado", color: "#0891b2" },
    { id: "swot-o-10", quadrant: "oportunidades", text: "Pesquisas de campo personalizadas com tickets elevados (R$ 20k-50k)", color: "#0891b2" },
    { id: "swot-o-11", quadrant: "oportunidades", text: "Replicação futura do modelo para outras cidades do Vale do Paraíba", color: "#0891b2" },
    { id: "swot-o-12", quadrant: "oportunidades", text: "Conteúdo e inteligência de SEO local como canal orgânico de aquisição", color: "#0891b2" },
    // Ameaças (12)
    { id: "swot-t-1", quadrant: "ameacas", text: "Concorrentes nacionais de geomarketing com grande capital e presença corporativa", color: "#e11d48" },
    { id: "swot-t-2", quadrant: "ameacas", text: "Institutos locais tradicionais com relacionamento comercial consolidado", color: "#e11d48" },
    { id: "swot-t-3", quadrant: "ameacas", text: "Ferramentas públicas e gratuitas de dados abertos que reduzam percepção de valor", color: "#e11d48" },
    { id: "swot-t-4", quadrant: "ameacas", text: "Cópias superficiais do produto por agentes ou consultorias locais", color: "#e11d48" },
    { id: "swot-t-5", quadrant: "ameacas", text: "Mudanças tributárias ou regulatórias no Simples Nacional", color: "#e11d48" },
    { id: "swot-t-6", quadrant: "ameacas", text: "Oscilação econômica e adiamento de decisões de investimento por empresas", color: "#e11d48" },
    { id: "swot-t-7", quadrant: "ameacas", text: "Baixa taxa de resposta em novas ondas amostrais de pesquisa primária", color: "#e11d48" },
    { id: "swot-t-8", quadrant: "ameacas", text: "Dependência de plataformas e infraestrutura de terceiros (Cloud, Vercel, Supabase, APIs de IA)", color: "#e11d48" },
    { id: "swot-t-9", quadrant: "ameacas", text: "Incidentes de segurança cibernética ou questionamentos relativos à LGPD", color: "#e11d48" },
    { id: "swot-t-10", quadrant: "ameacas", text: "Custo crescente de aquisição de clientes (CAC) em canais de mídia paga", color: "#e11d48" },
    { id: "swot-t-11", quadrant: "ameacas", text: "Concessão excessiva de descontos na largada comprometendo margem de contribuição", color: "#e11d48" },
    { id: "swot-t-12", quadrant: "ameacas", text: "Decisões públicas ou demandas com viés político que exijam extremo cuidado reputacional", color: "#e11d48" }
  ],
};

// Estado ativo em memória
let currentPlanState = JSON.parse(JSON.stringify(DEFAULT_PLAN_STATE));
if (typeof window !== 'undefined') {
  window.currentPlanState = currentPlanState;
}
let activeEditableElement = null;
let mondayFilterResp = 'all';
let mondayFilterStat = 'all';
let autoSaveDebounceTimer = null;
let supabaseSyncDebounceTimer = null;
// =========================================================================
// ESTADO GLOBAL DO PLANO DE NEGÓCIOS (PlanState) - PROBLEMA 1
// Conecta todas as tabelas financeiras das Seções 5 e 6
// =========================================================================
const PlanState = {
  ticketEssencial: 197,
  ticketPro: 397,
  ticketIntelligence: 990,
  custoFixo: 245,
  proLabore: 10000,
  aliquota: 0.092,
  dividaInicial: 86000
};

if (typeof window !== 'undefined') {
  window.PlanState = PlanState;
}

// =========================================================================
// UTILITÁRIOS DE FORMATAÇÃO (usados em blocos dinâmicos e mini-planilhas)
// =========================================================================
function escapePlanHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatMarkdownBasic(text) {
  if (!text) return '';
  let out = escapePlanHtml(text);
  out = out.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/\*(.*?)\*/g, '<em>$1</em>');
  out = out.replace(/\n/g, '<br/>');
  return out;
}

// =========================================================================
// 1. MOTOR DE CÁLCULO FINANCEIRO REATIVO (PlanFinancialEngine)
// =========================================================================
const PlanFinancialEngine = {
  // Formata moeda BRL: R$ 1.234
  formatCurrency(val, decimals = 0) {
    if (isNaN(val)) return 'R$ 0';
    const num = Math.round(val);
    const prefix = num < 0 ? '-R$ ' : 'R$ ';
    const absVal = Math.abs(num);
    const formatted = absVal.toLocaleString('pt-BR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
    return prefix + formatted;
  },

  // Formata percentual: 21,7%
  formatPct(val) {
    if (isNaN(val)) return '0,0%';
    return val.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + '%';
  },

  // Fator de conversão anual (90% mensal / 10% anual com 20% desconto = 0.98)
  getAnnualFactor() {
    const pMix = currentPlanState.annualPaymentMix || 0.10;
    const pDisc = currentPlanState.annualDiscount || 0.20;
    return (1 - pMix) + (pMix * (1 - pDisc));
  },

  // Custos fixos totais do mês (PlanState.custoFixo)
  getTotalFixedCosts() {
    return Number(PlanState.custoFixo) || 245;
  },

  // Pró-labore mensal reconhecido (PlanState.proLabore)
  getTotalProLabore() {
    return Number(PlanState.proLabore) || 10000;
  },

  // Ticket médio ponderado baseado no PlanState
  getWeightedTicket() {
    const t = {
      essencial: PlanState.ticketEssencial,
      pro: PlanState.ticketPro,
      intelligence: PlanState.ticketIntelligence
    };
    const m = currentPlanState.mix;
    return (m.essencial * t.essencial) + (m.pro * t.pro) + (m.intelligence * t.intelligence);
  },

  // Ponto de equilíbrio mensal em receita bruta (Fórmula: (custoFixo + proLabore) / (1 - aliquota))
  getBreakEvenRevenue() {
    const divisor = 1 - PlanState.aliquota;
    if (divisor <= 0) return 0;
    return Math.round((PlanState.custoFixo + PlanState.proLabore) / divisor);
  },

  // Ponto de equilíbrio em clientes
  getBreakEvenClients() {
    const beRev = this.getBreakEvenRevenue();
    const ticket = this.getWeightedTicket();
    if (ticket <= 0) return 0;
    return Math.ceil(beRev / ticket);
  },

  // Cálculos de uma linha de cenário (Fórmulas obrigatórias do PROBLEMA 2)
  calcScenarioRow(scenarioKey, idx) {
    const row = currentPlanState.scenarios[scenarioKey][idx];
    const ess = Number(row.ess) || 0;
    const pro = Number(row.pro) || 0;
    const int = Number(row.int) || 0;
    const totalClients = ess + pro + int;
    
    // receitaBruta = (clientesEssencial × PlanState.ticketEssencial) + (clientesPro × PlanState.ticketPro) + (clientesIntelligence × PlanState.ticketIntelligence)
    const grossRev = Math.round((ess * PlanState.ticketEssencial) + (pro * PlanState.ticketPro) + (int * PlanState.ticketIntelligence));
    
    // impostos = receitaBruta × PlanState.aliquota
    const tax = Math.round(grossRev * PlanState.aliquota);
    
    // receitaLiquida = receitaBruta − impostos
    const netRev = grossRev - tax;
    
    // resultadoEconomico = receitaLiquida − PlanState.custoFixo − PlanState.proLabore
    const fixed = PlanState.custoFixo;
    const proLaboreVal = PlanState.proLabore;
    const econResult = Math.round(netRev - fixed - proLaboreVal);

    return {
      month: row.m,
      ess,
      pro,
      int,
      totalClients,
      grossRev,
      tax,
      netRev,
      fixed,
      proLabore: proLaboreVal,
      econResult
    };
  },

  // Executa recálculo geral e sincroniza todos os nós visuais
  recalculateAll() {
    const fixedTotal = this.getTotalFixedCosts();
    const proTotal = this.getTotalProLabore();
    const beRev = this.getBreakEvenRevenue();
    const weightedTicket = this.getWeightedTicket();
    const beClients = this.getBreakEvenClients();

    // 1. Atualiza Seção 5.3 (Custos Fixos)
    this.safeSetText('dispTotalFixedCosts', this.formatCurrency(fixedTotal) + '/mês');
    this.safeSetText('dispTotalFixedCostsAnnual', this.formatCurrency(fixedTotal * 12) + '/ano');

    // 2. Atualiza Seção 5.4 (Pró-labore)
    this.safeSetText('dispTotalProLabore', this.formatCurrency(proTotal) + '/mês');
    this.safeSetText('dispProLaboreLeo', this.formatCurrency(currentPlanState.proLabore.leonardo));
    this.safeSetText('dispProLaboreMay', this.formatCurrency(currentPlanState.proLabore.mayumi));

    // 3. Atualiza Seção 5.5 (Ponto de Equilíbrio)
    this.safeSetText('dispBreakEvenFormulaText', 
      `(Custos fixos ${this.formatCurrency(fixedTotal)} + pró-labore ${this.formatCurrency(proTotal)}) ÷ (1 − ${((currentPlanState.taxRate || 9.2)/100).toLocaleString('pt-BR', {minimumFractionDigits: 3})}) = ${this.formatCurrency(beRev)}/mês brutos`
    );
    this.safeSetText('dispBreakEvenClientsText', `~ ${beClients} clientes`);

    // 4. Atualiza Seção 5.7 (Tabela de Preços e Mix)
    const t = currentPlanState.tickets;
    this.safeSetText('dispTicketEssAnual', this.formatCurrency(Math.round(t.essencial * 12 * 0.8)));
    this.safeSetText('dispTicketEssEquiv', this.formatCurrency(Math.round(t.essencial * 0.8)) + '/mês');
    this.safeSetText('dispTicketProAnual', this.formatCurrency(Math.round(t.pro * 12 * 0.8)));
    this.safeSetText('dispTicketProEquiv', this.formatCurrency(Math.round(t.pro * 0.8)) + '/mês');
    this.safeSetText('dispTicketIntAnual', this.formatCurrency(Math.round(t.intelligence * 12 * 0.8)));
    this.safeSetText('dispTicketIntEquiv', this.formatCurrency(Math.round(t.intelligence * 0.8)) + '/mês');
    
    // Contribuições ao ticket médio
    const contribEss = Math.round(currentPlanState.mix.essencial * t.essencial);
    const contribPro = Math.round(currentPlanState.mix.pro * t.pro);
    const contribInt = Math.round(currentPlanState.mix.intelligence * t.intelligence);
    this.safeSetText('dispContribEss', this.formatCurrency(contribEss));
    this.safeSetText('dispContribPro', this.formatCurrency(contribPro));
    this.safeSetText('dispContribInt', this.formatCurrency(contribInt));
    this.safeSetText('dispWeightedTicket', this.formatCurrency(weightedTicket) + '/cliente');

    // 5. Calcula e renderiza os três cenários (6.1, 6.2, 6.3)
    const probableResults = this.renderScenarioTable('probable', 'tableCenarioProvavelBody');
    const pessimisticResults = this.renderScenarioTable('pessimistic', 'tableCenarioPessimistaBody');
    const optimisticResults = this.renderScenarioTable('optimistic', 'tableCenarioOtimistaBody');

    // 6. Atualiza Fluxo de Caixa (5.8) e DRE (5.9) baseados no Cenário Provável
    const flowRes = this.renderCashFlowAndDRE(probableResults);
    const finalCash = (flowRes && typeof flowRes.finalCash === 'number') ? flowRes.finalCash : 0;
    const finalDebt = (flowRes && typeof flowRes.finalDebt === 'number') ? flowRes.finalDebt : (PlanState.dividaInicial || 86000);

    // 7. Renderiza Painel de Indicadores Dinâmicos (#plan-indicators) - PROBLEMA 4
    this.renderPlanIndicators(probableResults, finalCash, finalDebt);

    // 8. Atualiza Tabela Comparativa (6.4)
    this.renderScenarioComparison(pessimisticResults, probableResults, optimisticResults);

    // 9. Atualiza Tabela 6.5 (Ponto de Equilíbrio por Mix)
    this.renderBreakEvenMixTable(beRev);

    // 10. Atualiza Indicadores SEBRAE (5.12)
    this.renderSebraeViabilityIndicators(probableResults, beRev, beClients, weightedTicket);

    // 11. Atualiza os 6 Cards de Destaque no Topo da Seção 5
    this.renderTopKpiCards(probableResults, weightedTicket);
  },

  // Renderiza tabela de um cenário
  renderScenarioTable(scenarioKey, tbodyId) {
    const tbody = typeof document !== 'undefined' ? document.getElementById(tbodyId) : null;

    let totalGross = 0;
    let totalTax = 0;
    let totalNet = 0;
    let totalEcon = 0;
    const rowsData = [];
    let html = '';

    const list = currentPlanState.scenarios[scenarioKey];
    for (let i = 0; i < list.length; i++) {
      const calc = this.calcScenarioRow(scenarioKey, i);
      rowsData.push(calc);
      totalGross += calc.grossRev;
      totalTax += calc.tax;
      totalNet += calc.netRev;
      totalEcon += calc.econResult;

      const isPositive = calc.econResult >= 0;
      const resultBadgeClass = isPositive ? 'text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded' : 'text-slate-700 font-medium';

      html += `
        <tr class="hover:bg-slate-50/80 border-b border-slate-100 transition-colors group">
          <td class="px-3.5 py-2.5 text-xs font-bold text-slate-900 whitespace-nowrap sticky left-0 bg-white group-hover:bg-slate-50/90 z-10 border-r border-slate-200 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.06)]">${calc.month}</td>
          <td class="px-2 py-1.5 text-center">
            <span class="cell-input plan-calc-input" data-scenario="${scenarioKey}" data-idx="${i}" data-field="ess" contenteditable="true">${calc.ess}</span>
          </td>
          <td class="px-2 py-1.5 text-center">
            <span class="cell-input plan-calc-input" data-scenario="${scenarioKey}" data-idx="${i}" data-field="pro" contenteditable="true">${calc.pro}</span>
          </td>
          <td class="px-2 py-1.5 text-center">
            <span class="cell-input plan-calc-input" data-scenario="${scenarioKey}" data-idx="${i}" data-field="int" contenteditable="true">${calc.int}</span>
          </td>
          <td class="cell-calculated px-3 py-2 text-center text-xs font-mono font-bold text-slate-900 bg-slate-50/50" readonly>${calc.totalClients}</td>
          <td class="cell-calculated px-3 py-2 text-right text-xs font-mono font-semibold text-slate-900" readonly>${this.formatCurrency(calc.grossRev)}</td>
          <td class="cell-calculated px-3 py-2 text-right text-xs font-mono text-slate-500" readonly>${this.formatCurrency(calc.tax)}</td>
          <td class="cell-calculated px-3 py-2 text-right text-xs font-mono font-semibold text-slate-900" readonly>${this.formatCurrency(calc.netRev)}</td>
          <td class="cell-calculated px-3 py-2 text-right text-xs font-mono text-slate-600" readonly>${this.formatCurrency(calc.fixed)}</td>
          <td class="cell-calculated px-3 py-2 text-right text-xs font-mono text-slate-600" readonly>${this.formatCurrency(calc.proLabore)}</td>
          <td class="cell-calculated px-3 py-2 text-right text-xs font-mono ${resultBadgeClass}" readonly>${this.formatCurrency(calc.econResult)}</td>
        </tr>
      `;
    }

    // Linha de Totais
    const totalResultBadge = totalEcon >= 0 ? 'text-emerald-700 font-black' : 'text-rose-700 font-black';
    html += `
      <tr class="bg-slate-100 font-black border-t-2 border-slate-300">
        <td class="cell-calculated px-3.5 py-2.5 text-xs text-slate-900 uppercase tracking-wider sticky left-0 bg-slate-100 z-10 border-r border-slate-300 font-black" readonly>Total 15m</td>
        <td class="cell-calculated px-2 py-2 text-center text-xs text-slate-400 bg-slate-100" readonly>-</td>
        <td class="cell-calculated px-2 py-2 text-center text-xs text-slate-400 bg-slate-100" readonly>-</td>
        <td class="cell-calculated px-2 py-2 text-center text-xs text-slate-400 bg-slate-100" readonly>-</td>
        <td class="cell-calculated px-3 py-2.5 text-center text-xs text-slate-900 bg-slate-100" readonly>-</td>
        <td class="cell-calculated px-3 py-2.5 text-right text-xs font-mono text-slate-900" readonly>${this.formatCurrency(totalGross)}</td>
        <td class="cell-calculated px-3 py-2.5 text-right text-xs font-mono text-slate-600" readonly>${this.formatCurrency(totalTax)}</td>
        <td class="cell-calculated px-3 py-2.5 text-right text-xs font-mono text-slate-900" readonly>${this.formatCurrency(totalNet)}</td>
        <td class="cell-calculated px-3 py-2.5 text-right text-xs font-mono text-slate-900" readonly>${this.formatCurrency(PlanState.custoFixo * 15)}</td>
        <td class="cell-calculated px-3 py-2.5 text-right text-xs font-mono text-slate-900" readonly>${this.formatCurrency(PlanState.proLabore * 15)}</td>
        <td class="cell-calculated px-3 py-2.5 text-right text-xs font-mono ${totalResultBadge}" readonly>${this.formatCurrency(totalEcon)}</td>
      </tr>
    `;

    if (tbody) tbody.innerHTML = html;
    return rowsData;
  },

  // Atualiza Fluxo de Caixa (5.8) e DRE (5.9)
  renderCashFlowAndDRE(probableRows) {
    const tbodyFlow = typeof document !== 'undefined' ? document.getElementById('tableFluxoCaixaBody') : null;
    const tbodyDre = typeof document !== 'undefined' ? document.getElementById('tableDreBody') : null;
    if (!probableRows || probableRows.length === 0) return { finalCash: 0, finalDebt: Number(PlanState.dividaInicial) || 86000 };

    let debt = Number(PlanState.dividaInicial) || 86000;
    let supplierRemaining = currentPlanState.supplierDebt || 6000;
    let cashBalance = 0;
    let totalSupplierPaid = 0;
    let totalProLaborePaid = 0;

    let flowHtml = '';
    let dreHtml = '';

    for (let i = 0; i < probableRows.length; i++) {
      const r = probableRows[i];
      
      // Fluxo de caixa com ordem de prioridade estrita:
      // 1. Custos fixos
      // 2. Fornecedores André (4k) e Samuel (2k)
      // 3. Pró-labore corrente
      // 4. Sobra acumula em caixa
      const cashAfterFixed = Math.max(0, r.netRev - r.fixed);
      let supplierPaidThisMonth = 0;
      if (supplierRemaining > 0) {
        supplierPaidThisMonth = Math.min(cashAfterFixed, supplierRemaining);
        supplierRemaining -= supplierPaidThisMonth;
      }
      totalSupplierPaid += supplierPaidThisMonth;

      const cashAfterSupplier = cashAfterFixed - supplierPaidThisMonth;
      const proLaborePaidThisMonth = Math.min(cashAfterSupplier, r.proLabore);
      totalProLaborePaid += proLaborePaidThisMonth;

      const unpaidProLabore = r.proLabore - proLaborePaidThisMonth;
      const monthSurplus = cashAfterSupplier - proLaborePaidThisMonth;
      cashBalance += monthSurplus;

      // Evolução da dívida:
      // Dívida reduz com fornecedores pagos, mas aumenta com pró-labore corrente não pago
      debt = debt - supplierPaidThisMonth + unpaidProLabore;

      // Linha do Fluxo de Caixa
      flowHtml += `
        <tr class="hover:bg-slate-50 border-b border-slate-100 transition-colors group">
          <td class="px-3.5 py-2 text-xs font-bold text-slate-900 whitespace-nowrap sticky left-0 bg-white group-hover:bg-slate-50 z-10 border-r border-slate-200 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.06)]">${r.month}</td>
          <td class="cell-calculated px-3 py-2 text-center text-xs font-mono font-bold text-slate-700" readonly>${r.totalClients}</td>
          <td class="cell-calculated px-3 py-2 text-right text-xs font-mono font-semibold text-slate-900" readonly>${this.formatCurrency(r.grossRev)}</td>
          <td class="cell-calculated px-3 py-2 text-right text-xs font-mono text-slate-500" readonly>${this.formatCurrency(r.tax)}</td>
          <td class="cell-calculated px-3 py-2 text-right text-xs font-mono font-semibold text-slate-900" readonly>${this.formatCurrency(r.netRev)}</td>
          <td class="cell-calculated px-3 py-2 text-right text-xs font-mono text-slate-600" readonly>${this.formatCurrency(r.fixed)}</td>
          <td class="cell-calculated px-3 py-2 text-right text-xs font-mono text-amber-700 font-medium" readonly>${this.formatCurrency(supplierPaidThisMonth)}</td>
          <td class="cell-calculated px-3 py-2 text-right text-xs font-mono text-purple-700 font-semibold" readonly>${this.formatCurrency(proLaborePaidThisMonth)}</td>
          <td class="cell-calculated px-3 py-2 text-right text-xs font-mono font-bold ${cashBalance > 0 ? 'text-emerald-700' : 'text-slate-600'}" readonly>${this.formatCurrency(cashBalance)}</td>
          <td class="cell-calculated px-3 py-2 text-right text-xs font-mono font-bold text-rose-700" readonly>${this.formatCurrency(debt)}</td>
        </tr>
      `;

      // Linha do DRE
      const isPositive = r.econResult >= 0;
      dreHtml += `
        <tr class="hover:bg-slate-50 border-b border-slate-100 transition-colors group">
          <td class="px-3.5 py-2 text-xs font-bold text-slate-900 whitespace-nowrap sticky left-0 bg-white group-hover:bg-slate-50 z-10 border-r border-slate-200 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.06)]">${r.month}</td>
          <td class="cell-calculated px-3 py-2 text-right text-xs font-mono font-semibold text-slate-900" readonly>${this.formatCurrency(r.grossRev)}</td>
          <td class="cell-calculated px-3 py-2 text-right text-xs font-mono text-slate-500" readonly>${this.formatCurrency(r.tax)}</td>
          <td class="cell-calculated px-3 py-2 text-right text-xs font-mono font-semibold text-slate-900" readonly>${this.formatCurrency(r.netRev)}</td>
          <td class="cell-calculated px-3 py-2 text-right text-xs font-mono text-slate-600" readonly>${this.formatCurrency(r.fixed)}</td>
          <td class="cell-calculated px-3 py-2 text-right text-xs font-mono text-slate-600" readonly>${this.formatCurrency(r.proLabore)}</td>
          <td class="cell-calculated px-3 py-2 text-right text-xs font-mono font-bold ${isPositive ? 'text-emerald-700 bg-emerald-50/50' : 'text-rose-700'}" readonly>${this.formatCurrency(r.econResult)}</td>
        </tr>
      `;
    }

    if (tbodyFlow) tbodyFlow.innerHTML = flowHtml;
    if (tbodyDre) {
      const totGross = probableRows.reduce((a, b) => a + b.grossRev, 0);
      const totTax = probableRows.reduce((a, b) => a + b.tax, 0);
      const totNet = probableRows.reduce((a, b) => a + b.netRev, 0);
      const totFixed = this.getTotalFixedCosts() * 15;
      const totPro = this.getTotalProLabore() * 15;
      const totEcon = totNet - totFixed - totPro;
      const totBadge = totEcon >= 0 ? 'text-emerald-700 font-black' : 'text-rose-700 font-black';

      dreHtml += `
        <tr class="bg-slate-100 font-black border-t-2 border-slate-300">
          <td class="cell-calculated px-3.5 py-2.5 text-xs text-slate-900 uppercase tracking-wider sticky left-0 bg-slate-100 z-10 border-r border-slate-300 font-black" readonly>Total 15m</td>
          <td class="cell-calculated px-3 py-2.5 text-right text-xs font-mono text-slate-900" readonly>${this.formatCurrency(totGross)}</td>
          <td class="cell-calculated px-3 py-2.5 text-right text-xs font-mono text-slate-600" readonly>${this.formatCurrency(totTax)}</td>
          <td class="cell-calculated px-3 py-2.5 text-right text-xs font-mono text-slate-900" readonly>${this.formatCurrency(totNet)}</td>
          <td class="cell-calculated px-3 py-2.5 text-right text-xs font-mono text-slate-900" readonly>${this.formatCurrency(totFixed)}</td>
          <td class="cell-calculated px-3 py-2.5 text-right text-xs font-mono text-slate-900" readonly>${this.formatCurrency(totPro)}</td>
          <td class="cell-calculated px-3 py-2.5 text-right text-xs font-mono ${totBadge}" readonly>${this.formatCurrency(totEcon)}</td>
        </tr>
      `;
      tbodyDre.innerHTML = dreHtml;
    }

    return {
      finalCash: cashBalance,
      finalDebt: debt
    };
  },

  // Painel de 5 Indicadores Dinâmicos (PROBLEMA 4)
  renderPlanIndicators(probableRows, cashBalanceFinal, debtFinal) {
    if (typeof document === 'undefined') return;
    const container = document.getElementById('plan-indicators');
    if (!container) return;

    let totalGross = 0;
    let totalEcon = 0;
    let breakEvenMonth = 'Não alcançado';
    let foundBE = false;

    if (probableRows && probableRows.length > 0) {
      for (const r of probableRows) {
        totalGross += r.grossRev;
        totalEcon += r.econResult;
        if (!foundBE && r.econResult >= 0) {
          breakEvenMonth = r.month;
          foundBE = true;
        }
      }
    }

    const beRevenue = this.getBreakEvenRevenue();

    container.innerHTML = `
      <!-- Card 1: Ponto de Equilíbrio -->
      <div class="bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950 text-white rounded-2xl p-4 shadow-sm border border-cyan-500/30 flex flex-col justify-between relative overflow-hidden group">
        <div class="flex items-center justify-between mb-1">
          <span class="text-[10px] font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
            <i class="fa-solid fa-bullseye text-xs"></i> Ponto de Equilíbrio
          </span>
          <span class="w-2 h-2 rounded-full ${foundBE ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-amber-400'}"></span>
        </div>
        <div class="my-1.5">
          <span class="text-xl sm:text-2xl font-mono font-black text-white tracking-tight truncate block">${breakEvenMonth}</span>
        </div>
        <div class="text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-1.5 mt-0.5">
          <span>Meta Mensal</span>
          <span class="font-mono text-cyan-300 font-bold">${this.formatCurrency(beRevenue)}/mês</span>
        </div>
      </div>

      <!-- Card 2: Receita Acumulada 15 Meses -->
      <div class="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/90 flex flex-col justify-between group hover:border-slate-300 transition-all">
        <div class="flex items-center justify-between mb-1">
          <span class="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <i class="fa-solid fa-arrow-trend-up text-xs text-blue-600"></i> Receita Acum. 15m
          </span>
          <span class="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">Provável</span>
        </div>
        <div class="my-1.5">
          <span class="text-xl sm:text-2xl font-mono font-black text-slate-900 tracking-tight truncate block">${this.formatCurrency(totalGross)}</span>
        </div>
        <div class="text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-100 pt-1.5 mt-0.5">
          <span>Total 15 meses</span>
          <span class="font-mono text-slate-600 font-semibold">100% faturamento</span>
        </div>
      </div>

      <!-- Card 3: Resultado Acumulado -->
      <div class="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/90 flex flex-col justify-between group hover:border-slate-300 transition-all">
        <div class="flex items-center justify-between mb-1">
          <span class="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <i class="fa-solid fa-chart-line text-xs ${totalEcon >= 0 ? 'text-emerald-600' : 'text-rose-600'}"></i> Resultado Acumulado
          </span>
          <span class="text-[10px] font-bold ${totalEcon >= 0 ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'} px-1.5 py-0.5 rounded">
            ${totalEcon >= 0 ? 'Superávit' : 'Déficit'}
          </span>
        </div>
        <div class="my-1.5">
          <span class="text-xl sm:text-2xl font-mono font-black ${totalEcon >= 0 ? 'text-emerald-700' : 'text-rose-700'} tracking-tight truncate block">${this.formatCurrency(totalEcon)}</span>
        </div>
        <div class="text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-100 pt-1.5 mt-0.5">
          <span>EBITDA 15m</span>
          <span class="font-mono font-semibold ${totalEcon >= 0 ? 'text-emerald-600' : 'text-rose-600'}">${this.formatCurrency(totalEcon)}</span>
        </div>
      </div>

      <!-- Card 4: Caixa Final Dez/27 -->
      <div class="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/90 flex flex-col justify-between group hover:border-slate-300 transition-all">
        <div class="flex items-center justify-between mb-1">
          <span class="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <i class="fa-solid fa-wallet text-xs text-emerald-600"></i> Caixa Final Dez/27
          </span>
          <span class="text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">Fluxo Caixa</span>
        </div>
        <div class="my-1.5">
          <span class="text-xl sm:text-2xl font-mono font-black ${cashBalanceFinal > 0 ? 'text-emerald-700' : 'text-slate-900'} tracking-tight truncate block">${this.formatCurrency(cashBalanceFinal)}</span>
        </div>
        <div class="text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-100 pt-1.5 mt-0.5">
          <span>Saldo Disponível</span>
          <span class="font-mono text-slate-600 font-semibold">Após pró-labore</span>
        </div>
      </div>

      <!-- Card 5: Dívida Total Dez/27 -->
      <div class="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/90 flex flex-col justify-between group hover:border-slate-300 transition-all">
        <div class="flex items-center justify-between mb-1">
          <span class="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <i class="fa-solid fa-scale-unbalanced text-xs text-rose-600"></i> Dívida Total Dez/27
          </span>
          <span class="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">Passivo</span>
        </div>
        <div class="my-1.5">
          <span class="text-xl sm:text-2xl font-mono font-black text-rose-700 tracking-tight truncate block">${this.formatCurrency(debtFinal)}</span>
        </div>
        <div class="text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-100 pt-1.5 mt-0.5">
          <span>Passivo Remanescente</span>
          <span class="font-mono text-rose-600 font-semibold">${this.formatCurrency(debtFinal)}</span>
        </div>
      </div>
    `;
  },

  // Atualiza Comparativo dos Três Cenários em Dez/27 (6.4)
  renderScenarioComparison(pessimistic, probable, optimistic) {
    if (!pessimistic.length || !probable.length || !optimistic.length) return;
    const lastPess = pessimistic[14];
    const lastProb = probable[14];
    const lastOpt = optimistic[14];

    // Totais acumulados
    const accPess = pessimistic.reduce((a, b) => a + b.grossRev, 0);
    const accProb = probable.reduce((a, b) => a + b.grossRev, 0);
    const accOpt = optimistic.reduce((a, b) => a + b.grossRev, 0);

    // Mês de Ponto de Equilíbrio
    const bePess = pessimistic.find(r => r.econResult >= 0);
    const beProb = probable.find(r => r.econResult >= 0);
    const beOpt = optimistic.find(r => r.econResult >= 0);

    // Tickets médios finais
    const avgTicketPess = lastPess.totalClients > 0 ? Math.round(lastPess.grossRev / lastPess.totalClients) : 0;
    const avgTicketProb = lastProb.totalClients > 0 ? Math.round(lastProb.grossRev / lastProb.totalClients) : 0;
    const avgTicketOpt = lastOpt.totalClients > 0 ? Math.round(lastOpt.grossRev / lastOpt.totalClients) : 0;

    this.safeSetText('cmpClientsPess', lastPess.totalClients);
    this.safeSetText('cmpClientsProb', lastProb.totalClients);
    this.safeSetText('cmpClientsOpt', lastOpt.totalClients);

    this.safeSetText('cmpMixIntPess', lastPess.int);
    this.safeSetText('cmpMixIntProb', lastProb.int);
    this.safeSetText('cmpMixIntOpt', lastOpt.int);

    this.safeSetText('cmpTicketPess', this.formatCurrency(avgTicketPess));
    this.safeSetText('cmpTicketProb', this.formatCurrency(avgTicketProb));
    this.safeSetText('cmpTicketOpt', this.formatCurrency(avgTicketOpt));

    this.safeSetText('cmpGrossPess', this.formatCurrency(lastPess.grossRev));
    this.safeSetText('cmpGrossProb', this.formatCurrency(lastProb.grossRev));
    this.safeSetText('cmpGrossOpt', this.formatCurrency(lastOpt.grossRev));

    this.safeSetText('cmpResultPess', this.formatCurrency(lastPess.econResult));
    this.safeSetText('cmpResultProb', this.formatCurrency(lastProb.econResult));
    this.safeSetText('cmpResultOpt', this.formatCurrency(lastOpt.econResult));

    this.safeSetText('cmpBePess', bePess ? bePess.month : 'Não');
    this.safeSetText('cmpBeProb', beProb ? beProb.month : 'Out/27');
    this.safeSetText('cmpBeOpt', beOpt ? beOpt.month : 'Jun/27');

    this.safeSetText('cmpAccGrossPess', this.formatCurrency(accPess));
    this.safeSetText('cmpAccGrossProb', this.formatCurrency(accProb));
    this.safeSetText('cmpAccGrossOpt', this.formatCurrency(accOpt));
  },

  // Tabela 6.5: Ponto de equilíbrio por mix
  renderBreakEvenMixTable(beRev) {
    const t = currentPlanState.tickets;
    const clients100Ess = t.essencial > 0 ? Math.ceil(beRev / t.essencial) : 0;
    const clients100Pro = t.pro > 0 ? Math.ceil(beRev / t.pro) : 0;
    const clients100Int = t.intelligence > 0 ? Math.ceil(beRev / t.intelligence) : 0;

    const weightedProb = this.getWeightedTicket();
    const clientsProb = weightedProb > 0 ? Math.ceil(beRev / weightedProb) : 0;

    // Mix otimista: 41% Ess / 39% Pro / 20% Int
    const weightedOpt = (0.41 * t.essencial) + (0.39 * t.pro) + (0.20 * t.intelligence);
    const clientsOpt = weightedOpt > 0 ? Math.ceil(beRev / weightedOpt) : 0;

    this.safeSetText('mixBeEss', clients100Ess + ' clientes');
    this.safeSetText('mixBePro', clients100Pro + ' clientes');
    this.safeSetText('mixBeInt', clients100Int + ' clientes');
    this.safeSetText('mixBeProb', clientsProb + ' clientes');
    this.safeSetText('mixBeOpt', clientsOpt + ' clientes');
  },

  // Tabela 5.12: Indicadores de viabilidade SEBRAE
  renderSebraeViabilityIndicators(probable, beRev, beClients, weightedTicket) {
    if (!probable || !probable.length) return;
    const totGross = probable.reduce((a, b) => a + b.grossRev, 0);
    const totTax = probable.reduce((a, b) => a + b.tax, 0);
    const totFixed = this.getTotalFixedCosts() * 15;
    const totPro = this.getTotalProLabore() * 15;
    const totCosts = totTax + totFixed + totPro;
    const totNet = probable.reduce((a, b) => a + b.netRev, 0);
    const totResult = totNet - totFixed - totPro;

    const firstPos = probable.find(r => r.econResult >= 0);
    const lastRow = probable[14];
    
    // Lucratividade mensal dez/27
    const profitMarginDec = lastRow.grossRev > 0 ? (lastRow.econResult / lastRow.grossRev) * 100 : 0;
    // Lucratividade acumulada 15 meses
    const profitMarginAcc = totGross > 0 ? (totResult / totGross) * 100 : 0;

    // Simula caixa e dívida dez/27
    let simDebt = currentPlanState.initialDebt || 86000;
    let simSupp = currentPlanState.supplierDebt || 6000;
    let simCash = 0;
    for (const r of probable) {
      const cAfterFix = Math.max(0, r.netRev - r.fixed);
      let sPaid = 0;
      if (simSupp > 0) {
        sPaid = Math.min(cAfterFix, simSupp);
        simSupp -= sPaid;
      }
      const cAfterSupp = cAfterFix - sPaid;
      const pPaid = Math.min(cAfterSupp, r.proLabore);
      const unp = r.proLabore - pPaid;
      simCash += (cAfterSupp - pPaid);
      simDebt = simDebt - sPaid + unp;
    }

    this.safeSetText('viabGrossAcc', this.formatCurrency(totGross));
    this.safeSetText('viabCostsAcc', this.formatCurrency(totCosts));
    this.safeSetText('viabResultAcc', this.formatCurrency(totResult));
    this.safeSetText('viabBeRev', this.formatCurrency(beRev));
    this.safeSetText('viabBeClients', beClients + ' clientes');
    this.safeSetText('viabFirstPosMonth', firstPos ? `${firstPos.month} (${this.formatCurrency(firstPos.econResult)})` : 'Não alcançado');
    this.safeSetText('viabCashFinal', this.formatCurrency(simCash));
    this.safeSetText('viabDebtFinal', this.formatCurrency(simDebt));
    this.safeSetText('viabMarginDec', this.formatPct(profitMarginDec));
    this.safeSetText('viabMarginAcc', this.formatPct(profitMarginAcc));
    this.safeSetText('viabPaybackOp', firstPos ? firstPos.month : 'Não alcançado');
  },

  // 6 Cards de Indicadores Dinâmicos no Topo da Seção 5
  renderTopKpiCards(probable, weightedTicket) {
    if (!probable || !probable.length) return;
    const totGross = probable.reduce((a, b) => a + b.grossRev, 0);
    const totNet = probable.reduce((a, b) => a + b.netRev, 0);
    const totFixed = this.getTotalFixedCosts() * 15;
    const totPro = this.getTotalProLabore() * 15;
    const totResult = totNet - totFixed - totPro;
    const firstPos = probable.find(r => r.econResult >= 0);

    // Caixa final e dívida final
    let simDebt = currentPlanState.initialDebt || 86000;
    let simSupp = currentPlanState.supplierDebt || 6000;
    let simCash = 0;
    for (const r of probable) {
      const cAfterFix = Math.max(0, r.netRev - r.fixed);
      let sPaid = 0;
      if (simSupp > 0) {
        sPaid = Math.min(cAfterFix, simSupp);
        simSupp -= sPaid;
      }
      const cAfterSupp = cAfterFix - sPaid;
      const pPaid = Math.min(cAfterSupp, r.proLabore);
      const unp = r.proLabore - pPaid;
      simCash += (cAfterSupp - pPaid);
      simDebt = simDebt - sPaid + unp;
    }

    this.safeSetText('kpiCardBreakEvenMonth', firstPos ? firstPos.month : 'Não alcançado');
    this.safeSetText('kpiCardGrossRevenue', this.formatCurrency(totGross));
    this.safeSetText('kpiCardEconomicResult', this.formatCurrency(totResult));
    this.safeSetText('kpiCardFinalCash', this.formatCurrency(simCash));
    this.safeSetText('kpiCardFinalDebt', this.formatCurrency(simDebt));
    this.safeSetText('kpiCardAvgTicket', this.formatCurrency(weightedTicket));
  },

  safeSetText(id, text) {
    if (typeof document === 'undefined') return;
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }
};

// =========================================================================
// 2. SISTEMA DE EDIÇÃO ESTILO WORD: RIBBON SUPERIOR & TOOLBAR FLUTUANTE
// =========================================================================
let isPlanEditModeActive = false;

function togglePlanEditMode(forceState) {
  if (typeof forceState === 'boolean') {
    isPlanEditModeActive = forceState;
  } else {
    isPlanEditModeActive = !isPlanEditModeActive;
  }

  const btnToggle = document.getElementById('btnTogglePlanEditMode');
  const btnIcon = document.getElementById('btnTogglePlanEditIcon');
  const btnText = document.getElementById('btnTogglePlanEditText');
  const ribbonEl = document.getElementById('planWordRibbon');
  const docContainer = document.getElementById('businessPlanDocContainer');

  if (isPlanEditModeActive) {
    // Ativa modo edição estilo Word
    if (btnToggle) {
      btnToggle.className = 'inline-flex items-center gap-2 px-4 h-[38px] rounded-[10px] bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer ring-2 ring-emerald-400';
    }
    if (btnIcon) btnIcon.className = 'fa-solid fa-check text-white text-xs';
    if (btnText) btnText.textContent = 'Concluir Edição';
    if (ribbonEl) ribbonEl.classList.remove('hidden');
    if (docContainer) docContainer.classList.add('plan-edit-mode-active');

    // Torna todos os blocos de texto editáveis
    document.querySelectorAll('.plan-editable-text').forEach(el => {
      el.setAttribute('contenteditable', 'true');
    });

    if (typeof showToast === 'function') {
      showToast('Modo de Edição ativado. Você pode formatar e editar qualquer texto do plano.', 'info');
    }
  } else {
    // Desativa modo edição
    if (btnToggle) {
      btnToggle.className = 'inline-flex items-center gap-2 px-4 h-[38px] rounded-[10px] bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer';
    }
    if (btnIcon) btnIcon.className = 'fa-solid fa-pen-to-square text-cyan-400 text-xs';
    if (btnText) btnText.textContent = 'Editar Plano';
    if (ribbonEl) ribbonEl.classList.add('hidden');
    if (docContainer) docContainer.classList.remove('plan-edit-mode-active');

    const ribbonColorDd = document.getElementById('ribbonColorDropdown');
    if (ribbonColorDd) ribbonColorDd.classList.add('hidden');

    // Salva todos os textos editados e remove contenteditable
    if (!currentPlanState.editedTexts) currentPlanState.editedTexts = {};
    document.querySelectorAll('.plan-editable-text').forEach(el => {
      const textId = el.getAttribute('data-text-id');
      if (textId) {
        currentPlanState.editedTexts[textId] = el.innerHTML;
      }
      el.removeAttribute('contenteditable');
      el.classList.remove('plan-editing-active');
    });

    if (PlanInlineEditor.toolbarEl) PlanInlineEditor.toolbarEl.classList.add('hidden');
    if (PlanInlineEditor.colorDropdownEl) PlanInlineEditor.colorDropdownEl.classList.add('hidden');
    activeEditableElement = null;
    PlanInlineEditor.isEditing = false;

    triggerAutoSave();
    if (typeof showToast === 'function') {
      showToast('Edição concluída. Todas as alterações foram salvas com sucesso!', 'success');
    }
  }
}

// Funções de formatação executadas pelo Ribbon estilo Word
function execPlanFormat(command, value = null) {
  document.execCommand(command, false, value);
  triggerAutoSave();
}

function execPlanBlockFormat(tag) {
  if (tag === 'p') {
    document.execCommand('formatBlock', false, '<p>');
  } else if (tag === 'blockquote') {
    document.execCommand('formatBlock', false, '<blockquote>');
  } else {
    document.execCommand('formatBlock', false, `<${tag}>`);
  }
  triggerAutoSave();
}

function execPlanFontSize(size) {
  document.execCommand('fontSize', false, size);
  triggerAutoSave();
}

function execPlanTextColor(color) {
  document.execCommand('foreColor', false, color);
  const dd = document.getElementById('ribbonColorDropdown');
  if (dd) dd.classList.add('hidden');
  triggerAutoSave();
}

function toggleRibbonColorMenu() {
  const dd = document.getElementById('ribbonColorDropdown');
  if (dd) dd.classList.toggle('hidden');
}

const PlanInlineEditor = {
  toolbarEl: null,
  colorDropdownEl: null,
  isEditing: false,

  init() {
    this.toolbarEl = document.getElementById('planFloatingToolbar');
    this.colorDropdownEl = document.getElementById('planColorDropdown');
    if (!this.toolbarEl) return;

    // Delegar cliques para blocos de texto editáveis dentro do documento
    const docContainer = document.getElementById('businessPlanDocContainer');
    if (!docContainer) return;

    if (this._initialized) return;
    this._initialized = true;

    // Clique em bloco de texto entra em edição
    docContainer.addEventListener('click', (e) => {
      // Ignora cliques dentro da toolbar, ribbon ou células de entrada de tabela
      if (this.toolbarEl.contains(e.target)) return;
      const ribbon = document.getElementById('planWordRibbon');
      if (ribbon && ribbon.contains(e.target)) return;
      if (e.target.classList.contains('plan-calc-input')) return;

      const editableTarget = e.target.closest('.plan-editable-text');
      if (editableTarget) {
        this.startEditing(editableTarget);
      } else {
        if (!isPlanEditModeActive) {
          this.stopEditing();
        }
      }
    });

    // Tecla Escape encerra edição
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (isPlanEditModeActive) {
          togglePlanEditMode(false);
        } else if (this.isEditing) {
          this.stopEditing();
        }
      }
    });

    // Atualiza a posição da toolbar flutuante durante o scroll
    const handleScroll = () => {
      if (this.isEditing && activeEditableElement) {
        this.positionToolbar(activeEditableElement);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    const mainEl = document.querySelector('main');
    if (mainEl) {
      mainEl.addEventListener('scroll', handleScroll, { passive: true });
    }

    // Ações dos botões da toolbar
    this.setupToolbarButtons();
  },

  startEditing(el) {
    if (activeEditableElement === el) return;
    if (activeEditableElement && !isPlanEditModeActive) {
      this.stopEditing();
    }

    activeEditableElement = el;
    this.isEditing = true;
    el.setAttribute('contenteditable', 'true');
    el.classList.add('plan-editing-active');
    el.focus();

    this.positionToolbar(el);
  },

  stopEditing() {
    if (!activeEditableElement) return;

    // Se houve edição de texto, salva no state
    const textId = activeEditableElement.getAttribute('data-text-id');
    if (textId) {
      if (!currentPlanState.editedTexts) currentPlanState.editedTexts = {};
      currentPlanState.editedTexts[textId] = activeEditableElement.innerHTML;
    }

    if (!isPlanEditModeActive) {
      activeEditableElement.removeAttribute('contenteditable');
    }
    activeEditableElement.classList.remove('plan-editing-active');
    activeEditableElement = null;
    this.isEditing = false;

    if (this.toolbarEl) {
      this.toolbarEl.classList.add('hidden');
    }
    if (this.colorDropdownEl) {
      this.colorDropdownEl.classList.add('hidden');
    }

    // Auto-save persistente
    triggerAutoSave();
  },

  positionToolbar(targetEl) {
    if (!this.toolbarEl || !targetEl) return;

    // Se houver seleção ativa dentro do elemento, ancora acima da seleção
    const sel = typeof window !== 'undefined' ? window.getSelection() : null;
    let rect;
    if (sel && sel.rangeCount > 0 && !sel.isCollapsed && targetEl.contains(sel.anchorNode)) {
      rect = sel.getRangeAt(0).getBoundingClientRect();
    } else {
      rect = targetEl.getBoundingClientRect();
    }
    const toolbarHeight = this.toolbarEl.offsetHeight || 42;
    const toolbarWidth = this.toolbarEl.offsetWidth || 380;

    // Altura do cabeçalho sticky superior
    const stickyHeader = document.getElementById('planStickyHeader');
    const topBar = document.getElementById('planTopActionBar');
    const navBar = document.getElementById('planNavBar');
    const topOffset = stickyHeader ? stickyHeader.offsetHeight + 8 : (topBar ? topBar.offsetHeight : 52) + (navBar ? navBar.offsetHeight : 54) + 8;

    // Se o elemento ativo foi rolado para fora da área visível, oculta a toolbar temporariamente
    if (rect.bottom < topOffset || rect.top > window.innerHeight) {
      this.toolbarEl.classList.add('hidden');
      return;
    }

    // Toolbar possui position: fixed, portanto as coordenadas são relativas à viewport
    let top = rect.top - toolbarHeight - 8;
    // Se colidir com o cabeçalho fixo no topo, posiciona logo abaixo do elemento
    if (top < topOffset) {
      top = rect.bottom + 8;
    }

    // Alinhamento horizontal com clamp na tela
    let left = rect.left;
    if (left < 16) left = 16;
    if (left + toolbarWidth > window.innerWidth - 16) {
      left = Math.max(16, window.innerWidth - toolbarWidth - 16);
    }

    this.toolbarEl.style.top = `${Math.round(top)}px`;
    this.toolbarEl.style.left = `${Math.round(left)}px`;
    this.toolbarEl.classList.remove('hidden');
  },

  setupToolbarButtons() {
    // Previne perda de seleção no mousedown de todos os botões da toolbar
    if (this.toolbarEl) {
      this.toolbarEl.querySelectorAll('button, select, .color-swatch').forEach(el => {
        el.addEventListener('mousedown', (e) => {
          if (el.tagName !== 'SELECT') e.preventDefault();
        });
      });
    }
    const ribbon = document.getElementById('planWordRibbon');
    if (ribbon) {
      ribbon.querySelectorAll('button, .color-swatch').forEach(el => {
        el.addEventListener('mousedown', (e) => { e.preventDefault(); });
      });
    }

    const btnBold = document.getElementById('tbBtnBold');
    const btnItalic = document.getElementById('tbBtnItalic');
    const btnUnderline = document.getElementById('tbBtnUnderline');
    const btnColor = document.getElementById('tbBtnColor');
    const selFontSize = document.getElementById('tbSelFontSize');
    const btnAlignLeft = document.getElementById('tbBtnAlignLeft');
    const btnAlignCenter = document.getElementById('tbBtnAlignCenter');
    const btnAlignRight = document.getElementById('tbBtnAlignRight');
    const btnDone = document.getElementById('tbBtnDone');

    if (btnBold) btnBold.onclick = () => { document.execCommand('bold', false, null); };
    if (btnItalic) btnItalic.onclick = () => { document.execCommand('italic', false, null); };
    if (btnUnderline) btnUnderline.onclick = () => { document.execCommand('underline', false, null); };

    if (btnColor && this.colorDropdownEl) {
      btnColor.onclick = (e) => {
        e.stopPropagation();
        this.colorDropdownEl.classList.toggle('hidden');
      };

      // Listener para as bolinhas de cor
      const colorSwatches = this.colorDropdownEl.querySelectorAll('.color-swatch');
      colorSwatches.forEach(swatch => {
        swatch.onclick = (e) => {
          e.stopPropagation();
          const color = swatch.getAttribute('data-color');
          document.execCommand('foreColor', false, color);
          this.colorDropdownEl.classList.add('hidden');
        };
      });
    }

    if (selFontSize) {
      selFontSize.onchange = () => {
        const val = selFontSize.value;
        if (!activeEditableElement) return;
        if (val === 'small') document.execCommand('fontSize', false, '2');
        else if (val === 'normal') document.execCommand('fontSize', false, '3');
        else if (val === 'large') document.execCommand('fontSize', false, '5');
        else if (val === 'title') document.execCommand('fontSize', false, '6');
      };
    }

    if (btnAlignLeft) btnAlignLeft.onclick = () => { document.execCommand('justifyLeft', false, null); };
    if (btnAlignCenter) btnAlignCenter.onclick = () => { document.execCommand('justifyCenter', false, null); };
    if (btnAlignRight) btnAlignRight.onclick = () => { document.execCommand('justifyRight', false, null); };
    if (btnDone) btnDone.onclick = () => { this.stopEditing(); };
  }
};

// =========================================================================
// 3. GERENCIADOR DE CÉLULAS NUMÉRICAS EDITÁVEIS (.cell-input / .plan-calc-input)
// =========================================================================
function recalcularTudo() {
  // Mantém currentPlanState em sincronia com o PlanState
  currentPlanState.tickets.essencial = PlanState.ticketEssencial;
  currentPlanState.tickets.pro = PlanState.ticketPro;
  currentPlanState.tickets.intelligence = PlanState.ticketIntelligence;
  currentPlanState.taxRate = PlanState.aliquota * 100;
  currentPlanState.initialDebt = PlanState.dividaInicial;

  // Executa o recálculo completo de todas as seções e tabelas
  PlanFinancialEngine.recalculateAll();
}

if (typeof window !== 'undefined') {
  window.recalcularTudo = recalcularTudo;
  window.currentPlanState = currentPlanState;
  window.syncInputCellsFromState = syncInputCellsFromState;
}

function initTableInputs() {
  const container = document.getElementById('businessPlanDocContainer');
  if (!container) return;

  // Intercepta digitação em tempo real e blur nas células interativas
  container.addEventListener('input', (e) => {
    if (!e.target.classList.contains('plan-calc-input') && !e.target.classList.contains('cell-input')) return;
    handleCellInput(e.target);
    triggerAutoSave();
  });

  container.addEventListener('blur', (e) => {
    if (!e.target.classList.contains('plan-calc-input') && !e.target.classList.contains('cell-input')) return;
    handleCellInput(e.target, true);
    triggerAutoSave();
  }, true);

  // Evita quebra de linha com Enter e navega ou fecha
  container.addEventListener('keydown', (e) => {
    if ((e.target.classList.contains('plan-calc-input') || e.target.classList.contains('cell-input')) && e.key === 'Enter') {
      e.preventDefault();
      e.target.blur();
    }
  });
}

function handleCellInput(cell, isBlur = false) {
  const textVal = cell.textContent.trim().replace(/[^0-9.,]/g, '').replace(',', '.');
  const numVal = parseFloat(textVal) || 0;

  // 0. Células de Crédito de Sócios (1.8)
  const partnerCredit = cell.getAttribute('data-partner-credit');
  if (partnerCredit) {
    currentPlanState.partnerCredits = currentPlanState.partnerCredits || { leonardo: 40000, mayumi: 40000 };
    currentPlanState.partnerCredits[partnerCredit] = numVal;
    const totCredit = (Number(currentPlanState.partnerCredits.leonardo) || 0) + (Number(currentPlanState.partnerCredits.mayumi) || 0);
    const dispTot = document.getElementById('dispTotalPartnerCredit');
    if (dispTot) dispTot.textContent = 'R$ ' + totCredit.toLocaleString('pt-BR');
    const pctLeo = document.getElementById('pctCreditLeo');
    if (pctLeo) pctLeo.textContent = (totCredit > 0 ? ((currentPlanState.partnerCredits.leonardo / totCredit) * 100).toFixed(1) : '50.0') + '%';
    const pctMay = document.getElementById('pctCreditMay');
    if (pctMay) pctMay.textContent = (totCredit > 0 ? ((currentPlanState.partnerCredits.mayumi / totCredit) * 100).toFixed(1) : '50.0') + '%';
    triggerAutoSave();
    return;
  }

  // 1. Células de Custos Fixos (5.3)
  const fixedField = cell.getAttribute('data-fixed-field');
  if (fixedField && currentPlanState.fixedCosts[fixedField] !== undefined) {
    currentPlanState.fixedCosts[fixedField] = numVal;
    PlanState.custoFixo = (Number(currentPlanState.fixedCosts.supabase) || 0) +
                          (Number(currentPlanState.fixedCosts.vercel) || 0) +
                          (Number(currentPlanState.fixedCosts.dominio) || 0) +
                          (Number(currentPlanState.fixedCosts.email) || 0);
    recalcularTudo();
    return;
  }

  // 2. Células de Pró-labore (5.4)
  const proField = cell.getAttribute('data-pro-field');
  if (proField && currentPlanState.proLabore[proField] !== undefined) {
    currentPlanState.proLabore[proField] = numVal;
    PlanState.proLabore = (Number(currentPlanState.proLabore.leonardo) || 0) +
                          (Number(currentPlanState.proLabore.mayumi) || 0);
    recalcularTudo();
    return;
  }

  // 3. Células de Preço de Planos (5.7)
  const ticketField = cell.getAttribute('data-ticket-field');
  if (ticketField) {
    if (ticketField === 'essencial') PlanState.ticketEssencial = numVal;
    if (ticketField === 'pro') PlanState.ticketPro = numVal;
    if (ticketField === 'intelligence') PlanState.ticketIntelligence = numVal;
    currentPlanState.tickets[ticketField] = numVal;
    recalcularTudo();
    return;
  }

  // 4. Célula de Alíquota de Tributos (5.5)
  if (cell.id === 'inputTaxRate') {
    PlanState.aliquota = numVal > 1 ? (numVal / 100) : numVal;
    currentPlanState.taxRate = PlanState.aliquota * 100;
    recalcularTudo();
    return;
  }

  // 5. Células de Cenários (Clientes Essencial, Pro, Intelligence de cada mês) - Seção 6
  const scenarioKey = cell.getAttribute('data-scenario');
  const rowIdx = parseInt(cell.getAttribute('data-idx'), 10);
  const colField = cell.getAttribute('data-field');

  if (scenarioKey && !isNaN(rowIdx) && colField) {
    if (currentPlanState.scenarios[scenarioKey] && currentPlanState.scenarios[scenarioKey][rowIdx]) {
      currentPlanState.scenarios[scenarioKey][rowIdx][colField] = Math.max(0, Math.round(numVal));
      recalcularTudo();
    }
  }
}

// =========================================================================
// 4. MÓDULO MONDAY.COM: DIVISÃO DE TAREFAS DOS SÓCIOS (Seção 8.4)
// =========================================================================

// Helpers para conversão e formatação de datas
function parseTaskDateForInput(raw) {
  if (!raw) return '';
  const str = String(raw).trim();
  // Se já for YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    return str;
  }
  // Se for DD/MM/YYYY
  const brMatch = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (brMatch) {
    const day = brMatch[1].padStart(2, '0');
    const month = brMatch[2].padStart(2, '0');
    const year = brMatch[3];
    return `${year}-${month}-${day}`;
  }
  // Se for Mês/Ano (ex: Out/2026, Nov/2026)
  const monthMap = {
    'jan': '01', 'fev': '02', 'mar': '03', 'abr': '04',
    'mai': '05', 'jun': '06', 'jul': '07', 'ago': '08',
    'set': '09', 'out': '10', 'nov': '11', 'dez': '12'
  };
  const mMatch = str.match(/^([a-zA-Z]{3})\/(\d{4})$/i);
  if (mMatch) {
    const mKey = mMatch[1].toLowerCase();
    const mm = monthMap[mKey] || '10';
    return `${mMatch[2]}-${mm}-15`;
  }
  return '';
}

function formatTaskDueDateDisplay(raw) {
  if (!raw || raw === 'A definir') return '<span class="text-slate-400 italic">A definir</span>';
  const str = String(raw).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    const parts = str.split('-');
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return escapePlanHtml(str);
}

function renderMondayBoard() {
  const tbody = document.getElementById('mondayTasksTableBody');
  if (!tbody) return;

  const tasks = currentPlanState.mondayTasks || [];
  let doneCount = 0;
  let leoDone = 0, leoTotal = 0;
  let mayDone = 0, mayTotal = 0;

  tasks.forEach(t => {
    const isDone = t.status === 'done';
    if (isDone) doneCount++;

    if (t.responsible === 'leonardo' || t.responsible === 'ambos') {
      leoTotal++;
      if (isDone) leoDone++;
    }
    if (t.responsible === 'mayumi' || t.responsible === 'ambos') {
      mayTotal++;
      if (isDone) mayDone++;
    }
  });

  // Atualiza barras de progresso
  const overallPct = tasks.length > 0 ? Math.round((doneCount / tasks.length) * 100) : 0;
  const leoPct = leoTotal > 0 ? Math.round((leoDone / leoTotal) * 100) : 0;
  const mayPct = mayTotal > 0 ? Math.round((mayDone / mayTotal) * 100) : 0;

  PlanFinancialEngine.safeSetText('mondayOverallPct', overallPct + '%');
  const barOverall = document.getElementById('mondayOverallBar');
  if (barOverall) barOverall.style.width = overallPct + '%';

  PlanFinancialEngine.safeSetText('mondayLeoPct', leoPct + '%');
  const barLeo = document.getElementById('mondayLeoBar');
  if (barLeo) barLeo.style.width = leoPct + '%';

  PlanFinancialEngine.safeSetText('mondayMayPct', mayPct + '%');
  const barMay = document.getElementById('mondayMayBar');
  if (barMay) barMay.style.width = mayPct + '%';

  // Filtra e renderiza linhas da Tabela
  let html = '';
  tasks.forEach((t, i) => {
    const taskId = t.id || `task-${i}`;
    if (mondayFilterResp === 'leonardo' && t.responsible !== 'leonardo' && t.responsible !== 'ambos') return;
    if (mondayFilterResp === 'mayumi' && t.responsible !== 'mayumi' && t.responsible !== 'ambos') return;
    if (mondayFilterStat !== 'all' && t.status !== mondayFilterStat) return;

    const respBadge = t.responsible === 'leonardo' 
      ? '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 text-cyan-800">Leonardo</span>'
      : t.responsible === 'mayumi'
      ? '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">Mayumi</span>'
      : '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">Ambos</span>';

    const statusBadge = t.status === 'done'
      ? `<span class="cursor-pointer px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 hover:brightness-95 transition-all inline-flex items-center gap-1" onclick="event.stopPropagation(); cycleTaskStatus('${taskId}')">Concluído <i class="fa-solid fa-check ml-0.5"></i></span>`
      : t.status === 'in_progress'
      ? `<span class="cursor-pointer px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300 hover:brightness-95 transition-all inline-flex items-center gap-1" onclick="event.stopPropagation(); cycleTaskStatus('${taskId}')">Em Andamento <i class="fa-solid fa-spinner fa-spin ml-0.5 text-[10px]"></i></span>`
      : `<span class="cursor-pointer px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-300 hover:brightness-95 transition-all inline-flex items-center gap-1" onclick="event.stopPropagation(); cycleTaskStatus('${taskId}')">A Fazer <i class="fa-regular fa-clock ml-0.5"></i></span>`;

    const priorityBadge = t.priority === 'critical'
      ? `<span class="cursor-pointer px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-800 hover:brightness-95 transition-all" onclick="event.stopPropagation(); cycleTaskPriority('${taskId}')">Crítica</span>`
      : t.priority === 'high'
      ? `<span class="cursor-pointer px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 hover:brightness-95 transition-all" onclick="event.stopPropagation(); cycleTaskPriority('${taskId}')">Alta</span>`
      : `<span class="cursor-pointer px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 hover:brightness-95 transition-all" onclick="event.stopPropagation(); cycleTaskPriority('${taskId}')">Média</span>`;

    const formattedDate = formatTaskDueDateDisplay(t.due_date);
    const strikeClass = t.status === 'done' ? 'line-through text-slate-400' : 'text-slate-900';

    html += `
      <tr class="group hover:bg-cyan-50/40 border-b border-slate-100 transition-colors cursor-pointer" onclick="openEditTaskModal('${taskId}')" title="Clique para abrir e editar esta tarefa">
        <td class="px-3 py-2.5 text-xs font-semibold ${strikeClass}">
          <div class="flex items-center gap-2 group-hover:text-cyan-700 transition-colors">
            <span>${escapePlanHtml(t.title)}</span>
            <i class="fa-solid fa-pen text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity"></i>
          </div>
        </td>
        <td class="px-3 py-2.5 text-center text-xs whitespace-nowrap">${respBadge}</td>
        <td class="px-3 py-2.5 text-xs text-slate-500 whitespace-nowrap">${escapePlanHtml(t.phase || 'Geral')}</td>
        <td class="px-3 py-2.5 text-center whitespace-nowrap">${statusBadge}</td>
        <td class="px-3 py-2.5 text-center whitespace-nowrap">${priorityBadge}</td>
        <td class="px-3 py-2.5 text-xs text-slate-600 whitespace-nowrap font-medium">
          <div class="flex items-center gap-1.5">
            <i class="fa-regular fa-calendar text-slate-400 text-[11px]"></i>
            <span>${formattedDate}</span>
          </div>
        </td>
        <td class="px-3 py-2.5 text-center whitespace-nowrap">
          <div class="flex items-center justify-center gap-1">
            <button type="button" onclick="event.stopPropagation(); openEditTaskModal('${taskId}')" class="text-slate-400 hover:text-cyan-600 text-xs transition-colors p-1.5 rounded hover:bg-cyan-50 cursor-pointer" title="Rever / Editar Tarefa">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button type="button" onclick="event.stopPropagation(); deleteMondayTask('${taskId}')" class="text-slate-400 hover:text-rose-600 text-xs transition-colors p-1.5 rounded hover:bg-rose-50 cursor-pointer" title="Excluir tarefa">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html || '<tr><td colspan="7" class="text-center py-6 text-xs text-slate-400">Nenhuma tarefa correspondente aos filtros.</td></tr>';
}

function setMondayFilter(resp) {
  mondayFilterResp = resp;
  ['all', 'leonardo', 'mayumi'].forEach(r => {
    const btn = document.getElementById('btnMondayFilter_' + r);
    if (btn) {
      if (r === resp) {
        btn.classList.add('bg-slate-900', 'text-white');
        btn.classList.remove('bg-white', 'text-slate-700');
      } else {
        btn.classList.remove('bg-slate-900', 'text-white');
        btn.classList.add('bg-white', 'text-slate-700');
      }
    }
  });
  renderMondayBoard();
  renderMondayCalendar();
}

function setMondayStatusFilter(stat) {
  mondayFilterStat = stat;
  renderMondayBoard();
  renderMondayCalendar();
}

function _findPlanTask(idOrIdx) {
  const tasks = currentPlanState.mondayTasks || [];
  if (typeof idOrIdx === 'number' || (!isNaN(idOrIdx) && !String(idOrIdx).startsWith('task-'))) {
    const idx = Number(idOrIdx);
    if (tasks[idx]) return { task: tasks[idx], index: idx };
  }
  const idx = tasks.findIndex(t => String(t.id) === String(idOrIdx));
  if (idx !== -1) return { task: tasks[idx], index: idx };
  return { task: null, index: -1 };
}

function cycleTaskStatus(idOrIdx) {
  const { task } = _findPlanTask(idOrIdx);
  if (!task) return;
  const flow = ['todo', 'in_progress', 'done'];
  const cur = flow.indexOf(task.status);
  task.status = flow[(cur + 1) % flow.length];
  renderMondayBoard();
  renderMondayCalendar();
  if (window._mondayBoardInitialized && typeof window.initMondayBoard === 'function') {
    window.initMondayBoard('mondayBoardContainer');
  }
  if (window.PlanRealtimeCollab && typeof PlanRealtimeCollab.broadcastUpdate === 'function') {
    PlanRealtimeCollab.broadcastUpdate({ type: 'monday', payload: currentPlanState.mondayTasks });
  }
  triggerAutoSave();
}

function cycleTaskPriority(idOrIdx) {
  const { task } = _findPlanTask(idOrIdx);
  if (!task) return;
  const flow = ['medium', 'high', 'critical'];
  const cur = flow.indexOf(task.priority);
  task.priority = flow[(cur + 1) % flow.length];
  renderMondayBoard();
  renderMondayCalendar();
  if (window._mondayBoardInitialized && typeof window.initMondayBoard === 'function') {
    window.initMondayBoard('mondayBoardContainer');
  }
  if (window.PlanRealtimeCollab && typeof PlanRealtimeCollab.broadcastUpdate === 'function') {
    PlanRealtimeCollab.broadcastUpdate({ type: 'monday', payload: currentPlanState.mondayTasks });
  }
  triggerAutoSave();
}

function deleteMondayTask(idOrIdx) {
  const { task, index } = _findPlanTask(idOrIdx);
  if (index === -1) return;
  if (!confirm('Deseja realmente excluir esta tarefa?')) return;
  currentPlanState.mondayTasks.splice(index, 1);
  renderMondayBoard();
  renderMondayCalendar();
  if (window._mondayBoardInitialized && typeof window.initMondayBoard === 'function') {
    window.initMondayBoard('mondayBoardContainer');
  }
  if (window.PlanRealtimeCollab && typeof PlanRealtimeCollab.broadcastUpdate === 'function') {
    PlanRealtimeCollab.broadcastUpdate({ type: 'monday', payload: currentPlanState.mondayTasks });
  }
  triggerAutoSave();
}

function openNewTaskModal(defaultDate) {
  const modal = document.getElementById('modalNewMondayTask');
  if (!modal) {
    const title = prompt('Título da nova tarefa do plano de negócios:');
    if (!title || !title.trim()) return;
    addNewMondayTask({ title: title.trim(), responsible: 'ambos', priority: 'high', status: 'todo' });
    return;
  }

  // Reseta campos para criação de nova tarefa
  const editIdInput = document.getElementById('taskModalEditingId');
  if (editIdInput) editIdInput.value = '';

  const modalTitle = document.getElementById('taskModalTitle');
  if (modalTitle) modalTitle.textContent = 'Nova Tarefa do Plano de Negócios';

  const btnSaveText = document.getElementById('btnModalSaveText');
  if (btnSaveText) btnSaveText.textContent = 'Salvar Tarefa';

  const btnDelete = document.getElementById('btnModalDeleteTask');
  if (btnDelete) btnDelete.classList.add('hidden');

  const inputTitle = document.getElementById('newTaskInputTitle');
  const selectResp = document.getElementById('newTaskSelectResp');
  const inputPhase = document.getElementById('newTaskInputPhase');
  const selectStat = document.getElementById('newTaskSelectStat');
  const selectPrio = document.getElementById('newTaskSelectPrio');
  const inputDueDate = document.getElementById('newTaskInputDueDate');
  const inputNotes = document.getElementById('newTaskInputNotes');

  if (inputTitle) inputTitle.value = '';
  if (selectResp) selectResp.value = 'ambos';
  if (inputPhase) inputPhase.value = 'Estratégia & Execução';
  if (selectStat) selectStat.value = 'todo';
  if (selectPrio) selectPrio.value = 'high';
  if (inputDueDate) {
    inputDueDate.value = defaultDate ? parseTaskDateForInput(defaultDate) : new Date().toISOString().split('T')[0];
  }
  if (inputNotes) inputNotes.value = '';

  modal.classList.remove('hidden');
  if (inputTitle) setTimeout(() => inputTitle.focus(), 50);
}

function openEditTaskModal(idOrIdx) {
  const { task, index } = _findPlanTask(idOrIdx);
  if (!task) return;

  const modal = document.getElementById('modalNewMondayTask');
  if (!modal) return;

  const editIdInput = document.getElementById('taskModalEditingId');
  if (editIdInput) editIdInput.value = task.id || String(index);

  const modalTitle = document.getElementById('taskModalTitle');
  if (modalTitle) modalTitle.textContent = 'Ficha da Tarefa: Rever & Editar';

  const btnSaveText = document.getElementById('btnModalSaveText');
  if (btnSaveText) btnSaveText.textContent = 'Salvar Alterações';

  const btnDelete = document.getElementById('btnModalDeleteTask');
  if (btnDelete) btnDelete.classList.remove('hidden');

  const inputTitle = document.getElementById('newTaskInputTitle');
  const selectResp = document.getElementById('newTaskSelectResp');
  const inputPhase = document.getElementById('newTaskInputPhase');
  const selectStat = document.getElementById('newTaskSelectStat');
  const selectPrio = document.getElementById('newTaskSelectPrio');
  const inputDueDate = document.getElementById('newTaskInputDueDate');
  const inputNotes = document.getElementById('newTaskInputNotes');

  if (inputTitle) inputTitle.value = task.title || '';
  if (selectResp) selectResp.value = task.responsible || 'ambos';
  if (inputPhase) inputPhase.value = task.phase || '';
  if (selectStat) selectStat.value = task.status || 'todo';
  if (selectPrio) selectPrio.value = task.priority || 'high';
  if (inputDueDate) inputDueDate.value = parseTaskDateForInput(task.due_date);
  if (inputNotes) inputNotes.value = task.notes || '';

  modal.classList.remove('hidden');
  if (inputTitle) setTimeout(() => inputTitle.focus(), 50);
}

function closeNewTaskModal() {
  const modal = document.getElementById('modalNewMondayTask');
  if (modal) modal.classList.add('hidden');
}

function deleteCurrentModalTask() {
  const editIdInput = document.getElementById('taskModalEditingId');
  const editId = editIdInput ? editIdInput.value : '';
  if (!editId) return;

  const { task, index } = _findPlanTask(editId);
  if (index === -1) return;

  if (!confirm('Deseja realmente excluir esta tarefa?')) return;
  currentPlanState.mondayTasks.splice(index, 1);
  renderMondayBoard();
  renderMondayCalendar();
  if (window._mondayBoardInitialized && typeof window.initMondayBoard === 'function') {
    window.initMondayBoard('mondayBoardContainer');
  }
  if (window.PlanRealtimeCollab && typeof PlanRealtimeCollab.broadcastUpdate === 'function') {
    PlanRealtimeCollab.broadcastUpdate({ type: 'monday', payload: currentPlanState.mondayTasks });
  }
  triggerAutoSave();
  closeNewTaskModal();
}

function saveNewTaskFromModal() {
  const editIdInput = document.getElementById('taskModalEditingId');
  const inputTitle = document.getElementById('newTaskInputTitle');
  const selectResp = document.getElementById('newTaskSelectResp');
  const inputPhase = document.getElementById('newTaskInputPhase');
  const selectStat = document.getElementById('newTaskSelectStat');
  const selectPrio = document.getElementById('newTaskSelectPrio');
  const inputDueDate = document.getElementById('newTaskInputDueDate');
  const inputNotes = document.getElementById('newTaskInputNotes');

  const title = inputTitle ? inputTitle.value.trim() : '';
  if (!title) {
    alert('Por favor, informe o título da tarefa.');
    if (inputTitle) inputTitle.focus();
    return;
  }

  const editId = editIdInput ? editIdInput.value.trim() : '';
  const taskPayload = {
    title: title,
    responsible: selectResp ? selectResp.value : 'ambos',
    phase: (inputPhase && inputPhase.value.trim()) ? inputPhase.value.trim() : 'Estratégia & Execução',
    status: selectStat ? selectStat.value : 'todo',
    priority: selectPrio ? selectPrio.value : 'high',
    due_date: (inputDueDate && inputDueDate.value) ? inputDueDate.value : 'A definir',
    notes: inputNotes ? inputNotes.value.trim() : ''
  };

  if (editId) {
    // Editando tarefa existente
    const { task } = _findPlanTask(editId);
    if (task) {
      task.title = taskPayload.title;
      task.responsible = taskPayload.responsible;
      task.phase = taskPayload.phase;
      task.status = taskPayload.status;
      task.priority = taskPayload.priority;
      task.due_date = taskPayload.due_date;
      task.notes = taskPayload.notes;
    }
  } else {
    // Criando nova tarefa
    currentPlanState.mondayTasks.push({
      id: 'task-' + Date.now(),
      ...taskPayload
    });
  }

  renderMondayBoard();
  renderMondayCalendar();
  if (window._mondayBoardInitialized && typeof window.initMondayBoard === 'function') {
    window.initMondayBoard('mondayBoardContainer');
  }
  if (window.PlanRealtimeCollab && typeof PlanRealtimeCollab.broadcastUpdate === 'function') {
    PlanRealtimeCollab.broadcastUpdate({ type: 'monday', payload: currentPlanState.mondayTasks });
  }
  triggerAutoSave();
  closeNewTaskModal();
}

function addNewMondayTask(taskData) {
  if (taskData && typeof taskData === 'object' && taskData.title) {
    currentPlanState.mondayTasks.push({
      id: 'task-' + Date.now(),
      title: String(taskData.title).trim(),
      responsible: taskData.responsible || 'ambos',
      phase: taskData.phase || 'Estratégia & Execução',
      status: taskData.status || 'todo',
      priority: taskData.priority || 'high',
      due_date: taskData.due_date || 'A definir',
      notes: taskData.notes || ''
    });
    renderMondayBoard();
    renderMondayCalendar();
    if (window._mondayBoardInitialized && typeof window.initMondayBoard === 'function') {
      window.initMondayBoard('mondayBoardContainer');
    }
    if (window.PlanRealtimeCollab && typeof PlanRealtimeCollab.broadcastUpdate === 'function') {
      PlanRealtimeCollab.broadcastUpdate({ type: 'monday', payload: currentPlanState.mondayTasks });
    }
    triggerAutoSave();
    return;
  }

  openNewTaskModal();
}

// =========================================================================
// CALENDÁRIO VISUAL DO QUADRO DE TAREFAS (Visão Mensal de Entregas)
// =========================================================================
let mondayCalendarYear = 2026;
let mondayCalendarMonth = 9; // 0 = Janeiro, 9 = Outubro de 2026 (Início do Plano)

const CALENDAR_MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

function changeMondayCalendarMonth(delta) {
  mondayCalendarMonth += delta;
  if (mondayCalendarMonth < 0) {
    mondayCalendarMonth = 11;
    mondayCalendarYear--;
  } else if (mondayCalendarMonth > 11) {
    mondayCalendarMonth = 0;
    mondayCalendarYear++;
  }
  renderMondayCalendar();
}

function setMondayCalendarToday() {
  const now = new Date();
  mondayCalendarYear = now.getFullYear();
  mondayCalendarMonth = now.getMonth();
  renderMondayCalendar();
}

function renderMondayCalendar() {
  const gridEl = document.getElementById('mondayCalendarGrid');
  const titleEl = document.getElementById('mondayCalendarMonthTitle');
  const undatedContainer = document.getElementById('mondayCalendarUndatedContainer');
  if (!gridEl) return;

  if (titleEl) {
    titleEl.textContent = `${CALENDAR_MONTH_NAMES[mondayCalendarMonth]} de ${mondayCalendarYear}`;
  }

  const tasks = currentPlanState.mondayTasks || [];
  const tasksByDate = {};
  const undatedOrOther = [];

  tasks.forEach((t, idx) => {
    // Respeita filtros ativos de responsável e status
    if (mondayFilterResp === 'leonardo' && t.responsible !== 'leonardo' && t.responsible !== 'ambos') return;
    if (mondayFilterResp === 'mayumi' && t.responsible !== 'mayumi' && t.responsible !== 'ambos') return;
    if (mondayFilterStat !== 'all' && t.status !== mondayFilterStat) return;

    const dateIso = parseTaskDateForInput(t.due_date);
    if (dateIso) {
      if (!tasksByDate[dateIso]) tasksByDate[dateIso] = [];
      tasksByDate[dateIso].push({ ...t, _index: idx });
    } else {
      undatedOrOther.push({ ...t, _index: idx });
    }
  });

  // Dias do mês
  const firstDayWeekIndex = new Date(mondayCalendarYear, mondayCalendarMonth, 1).getDay(); // 0 = Domingo
  const daysInCurrentMonth = new Date(mondayCalendarYear, mondayCalendarMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(mondayCalendarYear, mondayCalendarMonth, 0).getDate();

  const totalCells = (firstDayWeekIndex + daysInCurrentMonth) > 35 ? 42 : 35;
  const now = new Date();
  const todayIso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  let cellsHtml = '';

  // 1. Células do mês anterior
  for (let p = firstDayWeekIndex - 1; p >= 0; p--) {
    const dayNum = daysInPrevMonth - p;
    cellsHtml += `
      <div class="p-2 min-h-[110px] bg-slate-50/40 text-slate-300 text-xs font-mono select-none">
        <span class="opacity-40 font-bold">${dayNum}</span>
      </div>
    `;
  }

  // 2. Células do mês corrente
  for (let d = 1; d <= daysInCurrentMonth; d++) {
    const dStr = String(d).padStart(2, '0');
    const mStr = String(mondayCalendarMonth + 1).padStart(2, '0');
    const cellDateKey = `${mondayCalendarYear}-${mStr}-${dStr}`;
    const dayTasks = tasksByDate[cellDateKey] || [];
    const isToday = (cellDateKey === todayIso);

    let tasksInDayHtml = '';
    dayTasks.forEach(t => {
      const taskId = t.id || `task-${t._index}`;
      const isDone = t.status === 'done';

      const respTheme = t.responsible === 'leonardo'
        ? 'border-l-cyan-500 bg-cyan-50/70 hover:bg-cyan-100/90 text-cyan-950'
        : t.responsible === 'mayumi'
        ? 'border-l-purple-500 bg-purple-50/70 hover:bg-purple-100/90 text-purple-950'
        : 'border-l-amber-500 bg-amber-50/70 hover:bg-amber-100/90 text-amber-950';

      const statusIcon = isDone
        ? '<i class="fa-solid fa-check text-emerald-600 text-[10px] shrink-0"></i>'
        : t.status === 'in_progress'
        ? '<i class="fa-solid fa-spinner fa-spin text-amber-600 text-[9px] shrink-0"></i>'
        : '<i class="fa-regular fa-clock text-slate-400 text-[9px] shrink-0"></i>';

      const strikeStyle = isDone ? 'line-through text-slate-400' : 'font-semibold';

      tasksInDayHtml += `
        <div
          onclick="event.stopPropagation(); openEditTaskModal('${taskId}')"
          class="group/task p-1.5 rounded-lg text-[11px] leading-tight border border-slate-200/90 border-l-[3px] ${respTheme} shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-center justify-between gap-1"
          title="Clique para rever / editar: ${escapePlanHtml(t.title)}"
        >
          <div class="flex items-center gap-1.5 min-w-0 flex-1">
            ${statusIcon}
            <span class="truncate ${strikeStyle}">${escapePlanHtml(t.title)}</span>
          </div>
          <i class="fa-solid fa-pen text-[9px] text-slate-400 opacity-0 group-hover/task:opacity-100 shrink-0 transition-opacity"></i>
        </div>
      `;
    });

    cellsHtml += `
      <div
        onclick="openNewTaskModal('${cellDateKey}')"
        class="group p-2 min-h-[110px] bg-white hover:bg-cyan-50/20 transition-colors relative flex flex-col justify-between cursor-pointer border-t border-slate-100"
      >
        <div>
          <div class="flex items-center justify-between mb-1.5">
            <span class="${isToday ? 'w-6 h-6 rounded-full bg-cyan-600 text-white flex items-center justify-center font-black text-xs shadow-xs' : 'text-xs font-bold text-slate-800'}">
              ${d}
            </span>
            <button
              type="button"
              onclick="event.stopPropagation(); openNewTaskModal('${cellDateKey}')"
              class="opacity-0 group-hover:opacity-100 w-5 h-5 rounded-md hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-all text-[10px] cursor-pointer"
              title="Nova tarefa neste dia"
            >
              <i class="fa-solid fa-plus"></i>
            </button>
          </div>
          <div class="space-y-1">
            ${tasksInDayHtml}
          </div>
        </div>
      </div>
    `;
  }

  // 3. Células do próximo mês
  const filledCells = firstDayWeekIndex + daysInCurrentMonth;
  const nextMonthTrailing = totalCells - filledCells;
  for (let n = 1; n <= nextMonthTrailing; n++) {
    cellsHtml += `
      <div class="p-2 min-h-[110px] bg-slate-50/40 text-slate-300 text-xs font-mono select-none">
        <span class="opacity-40 font-bold">${n}</span>
      </div>
    `;
  }

  gridEl.innerHTML = cellsHtml;

  // Renderiza gaveta inferior de tarefas pendentes ou sem data
  if (undatedContainer) {
    if (undatedOrOther.length > 0) {
      let undatedChips = '';
      undatedOrOther.forEach(t => {
        const taskId = t.id || `task-${t._index}`;
        undatedChips += `
          <button
            type="button"
            onclick="openEditTaskModal('${taskId}')"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-cyan-400 text-slate-700 text-xs font-semibold shadow-2xs hover:shadow-xs transition-all cursor-pointer"
          >
            <i class="fa-regular fa-calendar-xmark text-amber-500 text-xs"></i>
            <span class="truncate max-w-[220px]">${escapePlanHtml(t.title)}</span>
            <span class="text-[10px] text-cyan-600 font-bold ml-1">Definir data</span>
          </button>
        `;
      });

      undatedContainer.innerHTML = `
        <div class="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
          <div class="flex items-center gap-2 mb-2 text-xs font-bold text-slate-700">
            <i class="fa-solid fa-calendar-week text-amber-600"></i>
            <span>Tarefas sem data ou com prazo a definir (${undatedOrOther.length}):</span>
          </div>
          <div class="flex flex-wrap gap-2">
            ${undatedChips}
          </div>
        </div>
      `;
    } else {
      undatedContainer.innerHTML = '';
    }
  }
}

function toggleMondayView(view) {
  const tableView = document.getElementById('mondayTableView');
  const kanbanView = document.getElementById('mondayKanbanView');
  const calendarView = document.getElementById('mondayCalendarView');
  const btnTable = document.getElementById('btnMondayViewTable');
  const btnKanban = document.getElementById('btnMondayViewKanban');
  const btnCalendar = document.getElementById('btnMondayViewCalendar');

  if (tableView) tableView.classList.add('hidden');
  if (kanbanView) kanbanView.classList.add('hidden');
  if (calendarView) calendarView.classList.add('hidden');

  [btnTable, btnKanban, btnCalendar].forEach(btn => {
    if (btn) {
      btn.classList.remove('bg-slate-900', 'text-white');
      btn.classList.add('bg-white', 'text-slate-700');
    }
  });

  if (view === 'kanban') {
    if (kanbanView) kanbanView.classList.remove('hidden');
    if (btnKanban) {
      btnKanban.classList.add('bg-slate-900', 'text-white');
      btnKanban.classList.remove('bg-white', 'text-slate-700');
    }
    if (typeof window.initMondayBoard === 'function') {
      window.initMondayBoard('mondayBoardContainer');
      window._mondayBoardInitialized = true;
    }
  } else if (view === 'calendar') {
    if (calendarView) calendarView.classList.remove('hidden');
    if (btnCalendar) {
      btnCalendar.classList.add('bg-slate-900', 'text-white');
      btnCalendar.classList.remove('bg-white', 'text-slate-700');
    }
    renderMondayCalendar();
  } else {
    if (tableView) tableView.classList.remove('hidden');
    if (btnTable) {
      btnTable.classList.add('bg-slate-900', 'text-white');
      btnTable.classList.remove('bg-white', 'text-slate-700');
    }
    renderMondayBoard();
  }
}

function toggleSwotView(view) {
  const staticGrid = document.getElementById('swotStaticGrid');
  const canvasContainer = document.getElementById('swotCanvasContainer');
  const btnGrid = document.getElementById('btnSwotViewGrid');
  const btnCanvas = document.getElementById('btnSwotViewCanvas');

  if (view === 'canvas') {
    if (staticGrid) staticGrid.classList.add('hidden');
    if (canvasContainer) canvasContainer.classList.remove('hidden');
    if (btnCanvas) {
      btnCanvas.classList.add('bg-cyan-700', 'text-white');
      btnCanvas.classList.remove('bg-white', 'text-slate-700');
    }
    if (btnGrid) {
      btnGrid.classList.remove('bg-cyan-700', 'text-white');
      btnGrid.classList.add('bg-white', 'text-slate-700');
    }
    if (typeof window.initSwotCanvas === 'function') {
      window.initSwotCanvas('swotCanvasContainer');
      window._swotCanvasInitialized = true;
    }
  } else {
    if (staticGrid) staticGrid.classList.remove('hidden');
    if (canvasContainer) canvasContainer.classList.add('hidden');
    if (btnGrid) {
      btnGrid.classList.add('bg-cyan-700', 'text-white');
      btnGrid.classList.remove('bg-white', 'text-slate-700');
    }
    if (btnCanvas) {
      btnCanvas.classList.remove('bg-cyan-700', 'text-white');
      btnCanvas.classList.add('bg-white', 'text-slate-700');
    }
  }
}

if (typeof window !== 'undefined') {
  window.cycleTaskStatus = cycleTaskStatus;
  window.cycleTaskPriority = cycleTaskPriority;
  window.deleteMondayTask = deleteMondayTask;
  window.addNewMondayTask = addNewMondayTask;
  window.openNewTaskModal = openNewTaskModal;
  window.openEditTaskModal = openEditTaskModal;
  window.closeNewTaskModal = closeNewTaskModal;
  window.deleteCurrentModalTask = deleteCurrentModalTask;
  window.saveNewTaskFromModal = saveNewTaskFromModal;
  window.toggleMondayView = toggleMondayView;
  window.toggleSwotView = toggleSwotView;
  window.renderMondayCalendar = renderMondayCalendar;
  window.changeMondayCalendarMonth = changeMondayCalendarMonth;
  window.setMondayCalendarToday = setMondayCalendarToday;
  window.parseTaskDateForInput = parseTaskDateForInput;
  window.formatTaskDueDateDisplay = formatTaskDueDateDisplay;
}

// =========================================================================
// 5. NAVEGAÇÃO RÁPIDA (JUMP TO SECTION) & SCROLL SPY
// =========================================================================
function scrollNavTabIntoView(btn) {
  const navBar = document.getElementById('planNavBar');
  if (!navBar || !btn || typeof navBar.getBoundingClientRect !== 'function' || typeof btn.getBoundingClientRect !== 'function') return;
  const navRect = navBar.getBoundingClientRect();
  const btnRect = btn.getBoundingClientRect();
  if (btnRect && navRect && (btnRect.left < navRect.left || btnRect.right > navRect.right)) {
    const scrollTarget = (btn.offsetLeft || 0) - ((navBar.clientWidth || 0) / 2) + ((btn.clientWidth || 0) / 2);
    if (typeof navBar.scrollTo === 'function') {
      navBar.scrollTo({ left: Math.max(0, scrollTarget), behavior: 'smooth' });
    }
  }
}

function jumpToPlanSection(sectionId) {
  const el = document.getElementById(sectionId);
  if (!el) {
    console.warn('[Business Plan] Seção não encontrada:', sectionId);
    return;
  }

  const mainEl = document.querySelector('main.overflow-y-auto') || document.querySelector('main');
  const stickyHeader = document.getElementById('planStickyHeader');
  const topBar = document.getElementById('planTopActionBar');
  const navBar = document.getElementById('planNavBar');
  const headerOffset = stickyHeader ? stickyHeader.offsetHeight + 16 : ((topBar ? topBar.offsetHeight : 52) + (navBar ? navBar.offsetHeight : 54) + 16);

  if (mainEl && mainEl.scrollHeight > mainEl.clientHeight && typeof mainEl.getBoundingClientRect === 'function' && typeof el.getBoundingClientRect === 'function') {
    const mainRect = mainEl.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const targetScrollTop = mainEl.scrollTop + (elRect.top - mainRect.top) - headerOffset;
    if (typeof mainEl.scrollTo === 'function') {
      mainEl.scrollTo({ top: Math.max(0, targetScrollTop), behavior: 'smooth' });
    }
  } else if (typeof el.scrollIntoView === 'function') {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Realce sutil do botão ativo
  document.querySelectorAll('.plan-jump-btn').forEach(btn => {
    btn.classList.remove('plan-jump-active');
  });
  const activeBtn = document.getElementById('btn-jump-' + sectionId) || (sectionId === 'sec-cenarios' ? document.getElementById('btn-jump-sec-financeiro') : null);
  if (activeBtn) {
    activeBtn.classList.add('plan-jump-active');
    scrollNavTabIntoView(activeBtn);
  }
  if (typeof PlanRealtimeCollab !== 'undefined' && PlanRealtimeCollab.trackLocalPresence) {
    PlanRealtimeCollab.trackLocalPresence(sectionId);
  }
}

function switchPlanWorkspaceView(viewId) {
  if (typeof document === 'undefined') return;
  const tabs = document.querySelectorAll('.plan-ws-tab');
  tabs.forEach(t => t.classList.remove('active'));
  const activeBtn = document.getElementById('btn-ws-' + viewId);
  if (activeBtn) activeBtn.classList.add('active');

  const sections = document.querySelectorAll('.plan-doc-section');
  if (viewId === 'all') {
    sections.forEach(s => s.classList.remove('hidden'));
    jumpToPlanSection('sec-executivo');
    _initWorkspaceComponents('excel');
    _initWorkspaceComponents('miro');
    _initWorkspaceComponents('monday');
  } else if (viewId === 'doc') {
    sections.forEach(s => {
      const isDoc = ['sec-executivo', 'sec-mercado', 'sec-marketing', 'sec-operacional', 'sec-governanca', 'sec-tarefas', 'sec-anexos'].includes(s.id);
      s.classList.toggle('hidden', !isDoc);
    });
    jumpToPlanSection('sec-executivo');
  } else if (viewId === 'excel') {
    sections.forEach(s => {
      const isExcel = ['sec-financeiro', 'sec-cenarios'].includes(s.id);
      s.classList.toggle('hidden', !isExcel);
    });
    jumpToPlanSection('sec-financeiro');
    _initWorkspaceComponents('excel');
  } else if (viewId === 'miro') {
    sections.forEach(s => {
      const isMiro = ['sec-swot'].includes(s.id);
      s.classList.toggle('hidden', !isMiro);
    });
    jumpToPlanSection('sec-swot');
    _initWorkspaceComponents('miro');
  } else if (viewId === 'monday') {
    sections.forEach(s => {
      const isMonday = ['sec-governanca', 'sec-tarefas'].includes(s.id);
      s.classList.toggle('hidden', !isMonday);
    });
    jumpToPlanSection('sec-tarefas');
    _initWorkspaceComponents('monday');
    setTimeout(() => {
      const mb = document.getElementById('mondayBoardContainer');
      if (mb && typeof mb.scrollIntoView === 'function') {
        mb.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }
}

// Inicializa componentes de workspace sob demanda (lazy init)
function _initWorkspaceComponents(view) {
  if (typeof window === 'undefined') return;
  if (view === 'excel' && !window._spreadsheetInitialized) {
    if (typeof window.initSpreadsheet === 'function') {
      window.initSpreadsheet('spreadsheetContainer');
      window._spreadsheetInitialized = true;
    }
  }
  if (view === 'miro' && !window._swotCanvasInitialized) {
    if (typeof window.initSwotCanvas === 'function') {
      window.initSwotCanvas('swotCanvasContainer');
      window._swotCanvasInitialized = true;
      // Hide the static grid once the canvas is active
      const staticGrid = document.getElementById('swotStaticGrid');
      if (staticGrid) staticGrid.style.display = 'none';
    }
  }
  if (view === 'monday' && !window._mondayBoardInitialized) {
    if (typeof window.initMondayBoard === 'function') {
      window.initMondayBoard('mondayBoardContainer');
      window._mondayBoardInitialized = true;
    }
  }
}

if (typeof window !== 'undefined') {
  window.switchPlanWorkspaceView = switchPlanWorkspaceView;
}

function initPlanScrollSpy() {
  const mainEl = document.querySelector('main.overflow-y-auto') || document.querySelector('main');
  if (!mainEl || window._planScrollSpyAttached) return;
  window._planScrollSpyAttached = true;

  const sectionIds = [
    'sec-executivo', 'sec-mercado', 'sec-marketing', 'sec-operacional',
    'sec-financeiro', 'sec-cenarios', 'sec-swot', 'sec-governanca', 'sec-tarefas', 'sec-anexos'
  ];

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    const safeRaf = typeof requestAnimationFrame === 'function' ? requestAnimationFrame : (cb => setTimeout(cb, 16));
    safeRaf(() => {
      ticking = false;
      const stickyHeader = document.getElementById('planStickyHeader');
      const headerOffset = stickyHeader ? stickyHeader.offsetHeight : 110;
      const mainRect = mainEl.getBoundingClientRect();

      let currentSecId = null;
      for (const secId of sectionIds) {
        const secEl = document.getElementById(secId);
        if (secEl) {
          const secRect = secEl.getBoundingClientRect();
          if (secRect.top - mainRect.top <= headerOffset + 60) {
            currentSecId = secId;
          }
        }
      }

      if (currentSecId) {
        document.querySelectorAll('.plan-jump-btn').forEach(btn => {
          btn.classList.remove('plan-jump-active');
        });
        const activeBtn = document.getElementById('btn-jump-' + currentSecId);
        if (activeBtn) {
          activeBtn.classList.add('plan-jump-active');
          scrollNavTabIntoView(activeBtn);
        }
        if (typeof PlanRealtimeCollab !== 'undefined' && PlanRealtimeCollab.trackLocalPresence) {
          PlanRealtimeCollab.trackLocalPresence(currentSecId);
        }
      }
    });
  };

  mainEl.addEventListener('scroll', onScroll, { passive: true });
}

// =========================================================================
// 6. PERSISTÊNCIA & RESTAURAÇÃO (localStorage + Supabase Cloud)
// =========================================================================

// Resolve URLs de API com tolerância a servidores estáticos locais (Python na porta 8000, LiveServer 5500, etc.)
function resolvePlanApiUrl(path) {
  if (typeof window !== 'undefined') {
    const loc = window.location;
    if (loc.protocol === 'file:' || ['8000', '5500', '8080', '5173'].includes(loc.port)) {
      return `http://localhost:3000${path}`;
    }
  }
  return path;
}


async function callPlanBlocksApi(method = 'GET', payload = null) {
  const primaryUrl = resolvePlanApiUrl('/api/plan-blocks');
  const candidateUrls = [
    primaryUrl,
    'http://localhost:3000/api/plan-blocks',
    '/api/plan-blocks'
  ].filter((v, i, a) => a.indexOf(v) === i);

  for (const url of candidateUrls) {
    try {
      const opts = {
        method: method,
        headers: { 'Content-Type': 'application/json' }
      };
      if (payload) opts.body = JSON.stringify(payload);
      const res = await fetch(url, opts);
      if (res.status === 501 || res.status === 404) continue;
      return res;
    } catch (e) {}
  }
  return null;
}

// =========================================================================
// 6.5 COLABORAÇÃO EM TEMPO REAL MULTI-USUÁRIO (Leonardo & Mayumi)
// =========================================================================
const PlanRealtimeCollab = {
  activeUser: 'leonardo', // 'leonardo' | 'mayumi'
  channel: null,
  isSubscribed: false,
  peerPresence: {},
  pollTimer: null,
  lastRemoteSyncTs: 0,
  _toastTimeout: null,

  init() {
    this.detectActiveUser();
    this.updateUserAvatarsUI();
    this.setupRealtimeChannel();
    this.startPollingFallback();
  },

  detectActiveUser() {
    try {
      const savedUser = localStorage.getItem('business_plan_collab_user');
      if (savedUser === 'leonardo' || savedUser === 'mayumi') {
        this.activeUser = savedUser;
        return;
      }
      if (typeof window !== 'undefined' && window.currentAdminUser) {
        const email = (window.currentAdminUser.email || '').toLowerCase();
        const nome = (window.currentAdminUser.nome || '').toLowerCase();
        if (email.includes('mayumi') || nome.includes('mayumi')) {
          this.activeUser = 'mayumi';
          return;
        }
      }
    } catch (e) {}
    this.activeUser = 'leonardo';
  },

  setActiveUser(userId) {
    if (userId !== 'leonardo' && userId !== 'mayumi') return;
    this.activeUser = userId;
    try { localStorage.setItem('business_plan_collab_user', userId); } catch (e) {}
    this.updateUserAvatarsUI();
    this.trackLocalPresence();
    this.showCollabToast(
      userId === 'leonardo' ? 'LV' : 'MN',
      'Editor Ativo Alterado',
      `Você está editando como ${this.getUserDisplayName(userId)}`
    );
  },

  getUserDisplayName(userId) {
    return userId === 'leonardo' ? 'Leonardo Venâncio' : 'Mayumi Nagano';
  },

  getUserInitials(userId) {
    return userId === 'leonardo' ? 'LV' : 'MN';
  },

  updateUserAvatarsUI() {
    if (typeof document === 'undefined') return;
    const isLeo = this.activeUser === 'leonardo';

    const leoBadge = document.getElementById('avatarBadge-leonardo');
    const mayBadge = document.getElementById('avatarBadge-mayumi');
    const leoDot = document.getElementById('dot-status-leonardo');
    const mayDot = document.getElementById('dot-status-mayumi');
    const leoTooltip = document.getElementById('tooltip-status-leonardo');
    const mayTooltip = document.getElementById('tooltip-status-mayumi');

    if (leoBadge) {
      leoBadge.className = isLeo
        ? 'w-6 h-6 rounded-full bg-gradient-to-tr from-blue-700 to-indigo-600 text-white flex items-center justify-center text-[9px] font-black shadow-xs ring-2 ring-indigo-500 scale-105 transition-all'
        : 'w-6 h-6 rounded-full bg-gradient-to-tr from-blue-700 to-indigo-600 text-white flex items-center justify-center text-[9px] font-black shadow-xs opacity-75 ring-1 ring-transparent hover:opacity-100 transition-all';
    }
    if (mayBadge) {
      mayBadge.className = !isLeo
        ? 'w-6 h-6 rounded-full bg-gradient-to-tr from-purple-700 to-pink-600 text-white flex items-center justify-center text-[9px] font-black shadow-xs ring-2 ring-purple-500 scale-105 transition-all'
        : 'w-6 h-6 rounded-full bg-gradient-to-tr from-purple-700 to-pink-600 text-white flex items-center justify-center text-[9px] font-black shadow-xs opacity-75 ring-1 ring-transparent hover:opacity-100 transition-all';
    }

    if (isLeo) {
      if (leoDot) leoDot.className = 'absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-1.5 ring-white';
      if (leoTooltip) leoTooltip.innerHTML = '<span class="text-emerald-400 font-bold">(Você • Online)</span>';
      const mayPresent = this.peerPresence['mayumi'];
      if (mayDot) mayDot.className = mayPresent
        ? 'absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-1.5 ring-white'
        : 'absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-slate-300 ring-1.5 ring-white';
      if (mayTooltip) mayTooltip.innerHTML = mayPresent
        ? `<span class="text-emerald-400 font-bold">(Online • ${mayPresent.sectionName || 'Conectada'})</span>`
        : '<span class="text-slate-400 font-bold">(Offline)</span>';
    } else {
      if (mayDot) mayDot.className = 'absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-1.5 ring-white';
      if (mayTooltip) mayTooltip.innerHTML = '<span class="text-emerald-400 font-bold">(Você • Online)</span>';
      const leoPresent = this.peerPresence['leonardo'];
      if (leoDot) leoDot.className = leoPresent
        ? 'absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-1.5 ring-white'
        : 'absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-slate-300 ring-1.5 ring-white';
      if (leoTooltip) leoTooltip.innerHTML = leoPresent
        ? `<span class="text-emerald-400 font-bold">(Online • ${leoPresent.sectionName || 'Conectado'})</span>`
        : '<span class="text-slate-400 font-bold">(Offline)</span>';
    }
  },

  updateSectionPresenceIndicators() {
    if (typeof document === 'undefined') return;
    const sectionIds = [
      'sec-executivo', 'sec-mercado', 'sec-marketing', 'sec-operacional',
      'sec-financeiro', 'sec-cenarios', 'sec-swot', 'sec-governanca', 'sec-tarefas', 'sec-anexos'
    ];
    sectionIds.forEach(id => {
      const dot = document.getElementById('nav-peer-' + id);
      if (dot) dot.classList.add('hidden');
    });

    const peerId = this.activeUser === 'leonardo' ? 'mayumi' : 'leonardo';
    const peer = this.peerPresence[peerId];
    if (peer && peer.sectionId) {
      const dot = document.getElementById('nav-peer-' + peer.sectionId);
      if (dot) {
        dot.classList.remove('hidden');
        dot.className = peerId === 'mayumi'
          ? 'inline-block w-2 h-2 rounded-full bg-purple-500 ring-2 ring-white ml-0.5 animate-pulse'
          : 'inline-block w-2 h-2 rounded-full bg-cyan-500 ring-2 ring-white ml-0.5 animate-pulse';
        dot.title = `${this.getUserDisplayName(peerId)} está visualizando esta seção`;
      }
    }
  },

  setupRealtimeChannel() {
    if (typeof window === 'undefined' || !window.supabaseClient || typeof window.supabaseClient.channel !== 'function') {
      return;
    }

    try {
      this.channel = window.supabaseClient.channel('business_plan_collab_live', {
        config: {
          presence: { key: this.activeUser },
          broadcast: { self: false }
        }
      });

      this.channel
        .on('presence', { event: 'sync' }, () => {
          const state = this.channel.presenceState ? this.channel.presenceState() : {};
          this.peerPresence = {};
          Object.keys(state).forEach(k => {
            if (k !== this.activeUser && Array.isArray(state[k]) && state[k].length > 0) {
              this.peerPresence[k] = state[k][0];
            }
          });
          this.updateUserAvatarsUI();
          this.updateSectionPresenceIndicators();
        })
        .on('presence', { event: 'join' }, ({ key, newPresences }) => {
          if (key !== this.activeUser && newPresences && newPresences[0]) {
            this.peerPresence[key] = newPresences[0];
            this.updateUserAvatarsUI();
            this.updateSectionPresenceIndicators();
            this.showCollabToast(
              this.getUserInitials(key),
              `${this.getUserDisplayName(key)} conectou`,
              'Online no Plano de Negócios'
            );
          }
        })
        .on('presence', { event: 'leave' }, ({ key }) => {
          if (key !== this.activeUser) {
            delete this.peerPresence[key];
            this.updateUserAvatarsUI();
            this.updateSectionPresenceIndicators();
          }
        })
        .on('broadcast', { event: 'plan_change' }, ({ payload }) => {
          this.handleRemoteChange(payload);
        })
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            this.isSubscribed = true;
            this.trackLocalPresence();
          }
        });
    } catch (e) {
      console.warn('[Collab Realtime] Falha ao inicializar websocket:', e.message);
    }
  },

  trackLocalPresence(sectionId) {
    if (!this.channel || !this.isSubscribed) return;
    const currentSecId = sectionId || (typeof getActivePlanSectionId === 'function' ? getActivePlanSectionId() : 'sec-executivo');
    let secName = currentSecId;
    if (typeof document !== 'undefined') {
      const secBtn = document.getElementById('btn-jump-' + currentSecId);
      if (secBtn) secName = secBtn.innerText.replace(/[0-9]/g, '').trim();
    }

    try {
      this.channel.track({
        user: this.activeUser,
        name: this.getUserDisplayName(this.activeUser),
        sectionId: currentSecId,
        sectionName: secName,
        updatedAt: Date.now()
      });
    } catch (e) {}
  },

  broadcastChange(type, data) {
    if (this.channel && this.isSubscribed) {
      try {
        this.channel.send({
          type: 'broadcast',
          event: 'plan_change',
          payload: {
            sender: this.activeUser,
            senderName: this.getUserDisplayName(this.activeUser),
            type: type,
            data: data,
            timestamp: Date.now()
          }
        });
      } catch (e) {}
    }
  },

  handleRemoteChange(payload) {
    if (!payload || payload.sender === this.activeUser) return;

    const senderName = payload.senderName || 'Colega';
    const initials = payload.sender === 'mayumi' ? 'MN' : 'LV';

    if (payload.type === 'text_edited' && payload.data) {
      const { textId, html } = payload.data;
      if (textId) {
        currentPlanState.editedTexts = currentPlanState.editedTexts || {};
        currentPlanState.editedTexts[textId] = html;
        if (typeof document !== 'undefined') {
          const targetEl = document.querySelector(`[data-text-id="${textId}"]`);
          if (targetEl && document.activeElement !== targetEl) {
            targetEl.innerHTML = html;
          }
        }
      }
      this.showCollabToast(initials, `${senderName} editou o plano`, 'Texto atualizado ao vivo');
    } else if ((payload.type === 'plan_state_changed' || payload.type === 'financial_changed') && payload.data) {
      const st = payload.data;
      if (st.tickets) currentPlanState.tickets = st.tickets;
      if (st.fixedCosts) currentPlanState.fixedCosts = st.fixedCosts;
      if (st.proLabore) currentPlanState.proLabore = st.proLabore;
      if (st.taxRate) currentPlanState.taxRate = st.taxRate;
      if (st.customBlocks) {
        currentPlanState.customBlocks = st.customBlocks;
        if (typeof renderCustomBlocks === 'function') renderCustomBlocks();
      }
      if (st.mondayTasks) {
        currentPlanState.mondayTasks = st.mondayTasks;
        if (typeof renderMondayBoard === 'function') renderMondayBoard();
      }
      if (typeof syncInputCellsFromState === 'function') syncInputCellsFromState();
      if (PlanFinancialEngine && PlanFinancialEngine.recalculateAll) {
        PlanFinancialEngine.recalculateAll();
      }
      this.showCollabToast(initials, `${senderName} atualizou dados`, 'Cálculos e tabelas sincronizados');
    } else if (payload.type === 'block_inserted' || payload.type === 'block_deleted') {
      if (payload.data && Array.isArray(payload.data.blocks)) {
        currentPlanState.customBlocks = payload.data.blocks;
        if (typeof renderCustomBlocks === 'function') renderCustomBlocks();
      } else if (payload.data && payload.data.block) {
        currentPlanState.customBlocks = currentPlanState.customBlocks || [];
        if (!currentPlanState.customBlocks.find(b => b.id === payload.data.block.id)) {
          currentPlanState.customBlocks.push(payload.data.block);
          if (typeof renderCustomBlocks === 'function') renderCustomBlocks();
        }
      }
      this.showCollabToast(initials, `${senderName} alterou blocos`, 'Nova nota ou mini-planilha inserida');
    } else if (payload.type === 'task_changed' && payload.data) {
      if (payload.data.mondayTasks) {
        currentPlanState.mondayTasks = payload.data.mondayTasks;
        if (typeof renderMondayBoard === 'function') renderMondayBoard();
      }
      this.showCollabToast(initials, `${senderName} alterou tarefas`, 'Quadro de Tarefas atualizado');
    }
  },

  showCollabToast(initials, title, msg) {
    if (typeof document === 'undefined') return;
    const toast = document.getElementById('planCollabToast');
    const avatar = document.getElementById('planCollabToastAvatar');
    const titleEl = document.getElementById('planCollabToastTitle');
    const msgEl = document.getElementById('planCollabToastMsg');
    if (!toast) return;

    if (avatar) avatar.textContent = initials || 'Colab';
    if (titleEl) {
      titleEl.innerHTML = `<span>${escapePlanHtml(title)}</span><span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>`;
    }
    if (msgEl) msgEl.textContent = msg || '';

    toast.classList.remove('hidden');
    const safeRaf = typeof requestAnimationFrame === 'function' ? requestAnimationFrame : (cb => setTimeout(cb, 16));
    safeRaf(() => {
      toast.classList.remove('opacity-0', 'translate-y-2');
      toast.classList.add('opacity-100', 'translate-y-0');
    });

    clearTimeout(this._toastTimeout);
    this._toastTimeout = setTimeout(() => {
      toast.classList.remove('opacity-100', 'translate-y-0');
      toast.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => {
        toast.classList.add('hidden');
      }, 300);
    }, 3500);
  },

  startPollingFallback() {
    if (typeof setInterval === 'undefined') return;
    clearInterval(this.pollTimer);
    this.pollTimer = setInterval(async () => {
      try {
        const res = await callPlanBlocksApi('GET');
        if (res && res.ok) {
          const json = await res.json();
          if (json && json.success && json.data) {
            const remote = json.data;
            const remoteTs = new Date(remote.updated_at || 0).getTime();
            if (remoteTs > this.lastRemoteSyncTs && this.lastRemoteSyncTs > 0) {
              let changed = false;
              if (remote.blocks && JSON.stringify(remote.blocks) !== JSON.stringify(currentPlanState.customBlocks)) {
                currentPlanState.customBlocks = remote.blocks;
                if (typeof renderCustomBlocks === 'function') renderCustomBlocks();
                changed = true;
              }
              if (remote.planState) {
                if (remote.planState.tickets) currentPlanState.tickets = remote.planState.tickets;
                if (remote.planState.fixedCosts) currentPlanState.fixedCosts = remote.planState.fixedCosts;
                if (remote.planState.proLabore) currentPlanState.proLabore = remote.planState.proLabore;
                if (remote.planState.mondayTasks) currentPlanState.mondayTasks = remote.planState.mondayTasks;
                if (typeof syncInputCellsFromState === 'function') syncInputCellsFromState();
                if (PlanFinancialEngine && PlanFinancialEngine.recalculateAll) {
                  PlanFinancialEngine.recalculateAll();
                }
                if (typeof renderMondayBoard === 'function') renderMondayBoard();
                changed = true;
              }
              if (remote.editedTexts && typeof document !== 'undefined') {
                Object.keys(remote.editedTexts).forEach(k => {
                  if (document.activeElement?.getAttribute('data-text-id') !== k) {
                    const el = document.querySelector(`[data-text-id="${k}"]`);
                    if (el) el.innerHTML = remote.editedTexts[k];
                  }
                });
                currentPlanState.editedTexts = Object.assign({}, currentPlanState.editedTexts, remote.editedTexts);
              }
              if (changed) {
                const other = this.activeUser === 'leonardo' ? 'Mayumi' : 'Leonardo';
                this.showCollabToast(
                  this.activeUser === 'leonardo' ? 'MN' : 'LV',
                  `Sincronizado com ${other}`,
                  'Alterações remotas aplicadas com sucesso'
                );
              }
            }
            this.lastRemoteSyncTs = Math.max(this.lastRemoteSyncTs, remoteTs || Date.now());
          }
        }
      } catch (e) {}
    }, 7000);
  }
};

function toggleActiveCollaborator(userId) {
  if (PlanRealtimeCollab) {
    if (userId) {
      PlanRealtimeCollab.setActiveUser(userId);
    } else {
      const nextUser = PlanRealtimeCollab.activeUser === 'leonardo' ? 'mayumi' : 'leonardo';
      PlanRealtimeCollab.setActiveUser(nextUser);
    }
  }
}

function triggerAutoSave() {
  updateSyncIndicator(false, 'Salvando...');
  
  // 1. Salvamento rápido e síncrono no localStorage do navegador
  clearTimeout(autoSaveDebounceTimer);
  autoSaveDebounceTimer = setTimeout(() => {
    try {
      localStorage.setItem(PLAN_STORAGE_KEY_V2, JSON.stringify(currentPlanState));
      updateSyncIndicator(true, 'Salvo no navegador');
    } catch (e) {
      console.warn('[Business Plan] Erro ao salvar localmente:', e);
      updateSyncIndicator(false, 'Erro ao salvar localmente');
    }
  }, 300);

  // 2. Sincronização em nuvem com Supabase (compartilhada entre Leonardo e Mayumi)
  clearTimeout(supabaseSyncDebounceTimer);
  supabaseSyncDebounceTimer = setTimeout(async () => {
    try {
      const payload = {
        planState: {
          tickets: currentPlanState.tickets,
          fixedCosts: currentPlanState.fixedCosts,
          proLabore: currentPlanState.proLabore,
          taxRate: currentPlanState.taxRate,
          mondayTasks: currentPlanState.mondayTasks,
          scenarios: currentPlanState.scenarios,
          PlanState: PlanState
        },
        PlanState: PlanState,
        blocks: currentPlanState.customBlocks || [],
        miniSpreadsheets: (currentPlanState.customBlocks || []).filter(b => b.type === 'mini_spreadsheet'),
        chatHistory: [],
        editedTexts: currentPlanState.editedTexts || {},
        financialSheet: currentPlanState.financialSheet || [],
        swotCards: currentPlanState.swotCards || []
      };
      const res = await callPlanBlocksApi('POST', payload);
      if (res && res.ok) {
        updateSyncIndicator(true, 'Sincronizado Supabase');
      }
    } catch (err) {
      console.warn('[Business Plan] Falha na sincronização Supabase:', err.message);
    }
  }, 1000);
}

function updateSyncIndicator(saved = true, msg = 'Salvo') {
  const el = document.getElementById('planSaveStatusText');
  const icon = document.getElementById('planSaveStatusIcon');
  const badge = document.getElementById('planSaveStatusBadge');
  if (el) {
    if (msg === 'Todas as alterações salvas' || msg === 'Salvo') {
      el.textContent = 'Salvo';
    } else if (msg === 'Salvando alterações...' || msg === 'Salvando...') {
      el.textContent = 'Salvando...';
    } else {
      el.textContent = msg;
    }
  }
  if (icon) {
    if (saved) {
      icon.className = 'fa-solid fa-check text-emerald-500 text-[10px]';
    } else {
      icon.className = 'fa-solid fa-arrows-rotate fa-spin text-amber-500 text-[10px]';
    }
  }
  if (badge) {
    badge.title = saved ? 'Todas as alterações foram salvas automaticamente.' : 'Salvando alterações...';
  }
}

function resetBusinessPlanToDefaults() {
  const confirmed = confirm(
    'Tem certeza de que deseja restaurar a versão original do Plano de Negócios?\n\n' +
    'Todas as edições de texto e alterações de valores serão resetadas para os dados oficiais de Plano_de_Negócios_Radar_São_José.md.'
  );
  if (!confirmed) return;

  localStorage.removeItem(PLAN_STORAGE_KEY_V2);
  currentPlanState = JSON.parse(JSON.stringify(DEFAULT_PLAN_STATE));
  
  // Recarrega o plano na tela
  loadBusinessPlan(true);
  alert('Plano de Negócios restaurado com sucesso para a versão oficial!');
}

function exportBusinessPlanPDF() {
  // Fecha qualquer edição inline aberta antes de imprimir
  if (PlanInlineEditor && PlanInlineEditor.isEditing) {
    PlanInlineEditor.stopEditing();
  }
  window.print();
}

// =========================================================================

// =========================================================================
// GERENCIADOR DE TABELAS DESCRITIVAS INTERATIVAS (Segmentos, Fornecedores, etc.)
// =========================================================================
function setupDescriptiveTables() {
  const tableIds = ['tbodyCustomerSegments', 'tbodyCriticalSuppliers', 'tbodyProductsPricing', 'tbodyStaffingRoles', 'tbodyDreFiveViews', 'tbodyCompetitorsMatrix'];
  
  function persistTable(tblId) {
    const tbody = document.getElementById(tblId);
    if (!tbody) return;
    if (!currentPlanState.tableContents) currentPlanState.tableContents = {};
    currentPlanState.tableContents[tblId] = tbody.innerHTML;
    if (typeof triggerAutoSave === 'function') triggerAutoSave();
    if (window.PlanRealtimeCollab && PlanRealtimeCollab.broadcastUpdate) {
      PlanRealtimeCollab.broadcastUpdate({
        type: 'tableContents',
        payload: { tableId: tblId, html: tbody.innerHTML }
      });
    }
  }

  // Restaura tabelas salvas se existirem
  if (currentPlanState.tableContents) {
    Object.keys(currentPlanState.tableContents).forEach(tblId => {
      const tbody = document.getElementById(tblId);
      if (tbody && currentPlanState.tableContents[tblId]) {
        tbody.innerHTML = currentPlanState.tableContents[tblId];
      }
    });
  }

  // Botões de Adicionar Linha
  document.querySelectorAll('.plan-add-row-btn').forEach(btn => {
    if (btn._hasAddListener) return;
    btn._hasAddListener = true;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-target');
      const tbody = document.getElementById(targetId);
      if (!tbody) return;
      
      const newTr = document.createElement('tr');
      if (targetId === 'tbodyCustomerSegments') {
        newTr.innerHTML = `
          <td class="px-3 py-2 font-bold text-slate-900 plan-table-cell" contenteditable="true">Novo Segmento</td>
          <td class="px-3 py-2 plan-table-cell" contenteditable="true">Perfil de Comprador</td>
          <td class="px-3 py-2 plan-table-cell" contenteditable="true">Problema a resolver</td>
          <td class="px-3 py-2 plan-table-cell" contenteditable="true">Oferta recomendada</td>
          <td class="w-10 px-2 py-2 text-center"><button type="button" class="plan-del-row-btn text-slate-300 hover:text-rose-500 transition-colors" title="Excluir linha"><i class="fa-solid fa-trash-can text-[11px]"></i></button></td>
        `;
      } else if (targetId === 'tbodyCriticalSuppliers') {
        newTr.innerHTML = `
          <td class="px-4 py-2.5 font-bold text-slate-900 plan-table-cell" contenteditable="true">Novo Fornecedor</td>
          <td class="px-4 py-2.5 plan-table-cell" contenteditable="true">Finalidade do serviço</td>
          <td class="px-4 py-2.5 text-right font-mono plan-table-cell" contenteditable="true">R$ 0/mês</td>
          <td class="w-10 px-2 py-2 text-center"><button type="button" class="plan-del-row-btn text-slate-300 hover:text-rose-500 transition-colors" title="Excluir linha"><i class="fa-solid fa-trash-can text-[11px]"></i></button></td>
        `;
      } else if (targetId === 'tbodyProductsPricing') {
        newTr.innerHTML = `
          <td class="px-3.5 py-2 font-bold text-slate-900 plan-table-cell" contenteditable="true">Novo Produto</td>
          <td class="px-3.5 py-2 text-right font-bold text-slate-900 plan-table-cell" contenteditable="true">R$ 0/mês</td>
          <td class="px-3.5 py-2 plan-table-cell" contenteditable="true">Itens inclusos</td>
          <td class="px-3.5 py-2 plan-table-cell" contenteditable="true">Público-alvo</td>
          <td class="w-10 px-2 py-2 text-center"><button type="button" class="plan-del-row-btn text-slate-300 hover:text-rose-500 transition-colors" title="Excluir linha"><i class="fa-solid fa-trash-can text-[11px]"></i></button></td>
        `;
      } else if (targetId === 'tbodyStaffingRoles') {
        newTr.innerHTML = `
          <td class="px-4 py-2 font-bold text-slate-900 plan-table-cell" contenteditable="true">Nova Função</td>
          <td class="px-4 py-2 text-center font-bold plan-table-cell" contenteditable="true">1</td>
          <td class="px-4 py-2 text-slate-600 plan-table-cell" contenteditable="true">Responsável planejado</td>
          <td class="w-10 px-2 py-2 text-center"><button type="button" class="plan-del-row-btn text-slate-300 hover:text-rose-500 transition-colors" title="Excluir linha"><i class="fa-solid fa-trash-can text-[11px]"></i></button></td>
        `;
      } else if (targetId === 'tbodyCompetitorsMatrix') {
        newTr.innerHTML = `
          <td class="px-3.5 py-2 font-bold text-slate-900 plan-table-cell" contenteditable="true">Novo Concorrente</td>
          <td class="px-3.5 py-2 text-slate-500 plan-table-cell" contenteditable="true">Categoria da Solução</td>
          <td class="px-3.5 py-2 plan-table-cell" contenteditable="true">Como o cliente substitui o Radar</td>
          <td class="w-10 px-2 py-2 text-center"><button type="button" class="plan-del-row-btn text-slate-300 hover:text-rose-500 transition-colors" title="Excluir linha"><i class="fa-solid fa-trash-can text-[11px]"></i></button></td>
        `;
      }
      tbody.appendChild(newTr);
      const firstCell = newTr.querySelector('.plan-table-cell');
      if (firstCell) firstCell.focus();
      persistTable(targetId);
    });
  });

  // Delegação de eventos para exclusão de linhas e persistência ao editar células
  if (!window._descriptiveTableDelegationSet) {
    window._descriptiveTableDelegationSet = true;
    document.addEventListener('click', (e) => {
      const delBtn = e.target.closest('.plan-del-row-btn');
      if (delBtn) {
        const tr = delBtn.closest('tr');
        const tbody = tr ? tr.closest('tbody') : null;
        if (tr && tbody && tableIds.includes(tbody.id)) {
          tr.remove();
          persistTable(tbody.id);
        }
      }
    });

    document.addEventListener('blur', (e) => {
      const cell = e.target.closest('.plan-table-cell');
      if (cell) {
        const tbody = cell.closest('tbody');
        if (tbody && tableIds.includes(tbody.id)) {
          persistTable(tbody.id);
        }
      }
    }, true);
  }
}

// 7. INICIALIZAÇÃO PRINCIPAL DO DOCUMENTO (loadBusinessPlan)
// =========================================================================
async function loadBusinessPlan(forceDefaults = false) {
  try {
    if (!forceDefaults) {
      const saved = localStorage.getItem(PLAN_STORAGE_KEY_V2);
      if (saved) {
        const parsed = JSON.parse(saved);
        currentPlanState = Object.assign({}, DEFAULT_PLAN_STATE, parsed);
        if (!currentPlanState.swotCards || currentPlanState.swotCards.length === 0) {
          currentPlanState.swotCards = JSON.parse(JSON.stringify(DEFAULT_PLAN_STATE.swotCards));
        }
        if (!currentPlanState.mondayTasks || currentPlanState.mondayTasks.length === 0) {
          currentPlanState.mondayTasks = JSON.parse(JSON.stringify(DEFAULT_PLAN_STATE.mondayTasks));
        } else {
          // Normaliza datas que possam ter vindo do formato legado (ex: 'Out/2026')
          currentPlanState.mondayTasks.forEach(t => {
            if (t.due_date && !/^\d{4}-\d{2}-\d{2}$/.test(t.due_date)) {
              const converted = parseTaskDateForInput(t.due_date);
              if (converted) t.due_date = converted;
            }
          });
        }
      }
    }

    // Mantém window.currentPlanState rigorosamente sincronizado
    if (typeof window !== 'undefined') {
      window.currentPlanState = currentPlanState;
    }

    // Aplica textos editados anteriormente, se houver
    if (currentPlanState.editedTexts) {
      Object.keys(currentPlanState.editedTexts).forEach(textId => {
        const el = document.querySelector(`[data-text-id="${textId}"]`);
        if (el && currentPlanState.editedTexts[textId]) {
          el.innerHTML = currentPlanState.editedTexts[textId];
        }
      });
    }

    // Aplica valores nas células numéricas de entrada (.plan-calc-input)
    syncInputCellsFromState();

    // Inicializa edição inline e toolbar
    PlanInlineEditor.init();

    // Inicializa tabelas descritivas interativas
    setupDescriptiveTables();

    // Inicializa listeners de inputs numéricos
    initTableInputs();

    // Inicializa quadro Monday.com (Tabela Executiva)
    renderMondayBoard();

    // Renderiza blocos customizados e mini-planilhas
    renderCustomBlocks();

    // Executa recálculo financeiro completo em cascata
    PlanFinancialEngine.recalculateAll();

    // Inicializa Planilha Financeira Interativa (Excel-style)
    if (typeof window !== 'undefined' && typeof window.initSpreadsheet === 'function') {
      window.initSpreadsheet('spreadsheetContainer');
      window._spreadsheetInitialized = true;
    }

    // Inicializa Canvas SWOT Interativo (Miro-style) mantendo a grade editorial visível
    if (typeof window !== 'undefined' && typeof window.initSwotCanvas === 'function') {
      window.initSwotCanvas('swotCanvasContainer');
      window._swotCanvasInitialized = true;
      // Garante que a visão padrão selecionada seja a Matriz Editorial
      if (typeof toggleSwotView === 'function') {
        toggleSwotView('grid');
      }
    }

    // Inicializa Quadro Kanban Interativo (Monday-style)
    if (typeof window !== 'undefined' && typeof window.initMondayBoard === 'function') {
      window.initMondayBoard('mondayBoardContainer');
      window._mondayBoardInitialized = true;
      // Garante que a visão padrão selecionada seja a Tabela Executiva
      if (typeof toggleMondayView === 'function') {
        toggleMondayView('table');
      }
    }

    // Ativa scroll spy para manter a navegação "IR PARA" sincronizada com a rolagem
    initPlanScrollSpy();

    updateSyncIndicator(true, 'Todas as alterações salvas');

    // Inicializa motor colaborativo em tempo real (Leonardo & Mayumi)
    if (typeof PlanRealtimeCollab !== 'undefined' && PlanRealtimeCollab.init) {
      PlanRealtimeCollab.init();
    }

    // Sincronização em segundo plano via Supabase (Leonardo & Mayumi)
    if (!forceDefaults) {
      try {
        const res = await callPlanBlocksApi('GET');
        if (res && res.ok) {
          const json = await res.json();
          if (json && json.success && json.data) {
            const remoteData = json.data;
            let needsRerender = false;

            if (remoteData.blocks && Array.isArray(remoteData.blocks) && remoteData.blocks.length > 0) {
              currentPlanState.customBlocks = remoteData.blocks;
              needsRerender = true;
            }
            // (chatHistory removido – agente IA desativado)
            if (remoteData.tableContents && Object.keys(remoteData.tableContents).length > 0) {
      currentPlanState.tableContents = Object.assign({}, currentPlanState.tableContents, remoteData.tableContents);
      Object.keys(remoteData.tableContents).forEach(tblId => {
        const tbody = document.getElementById(tblId);
        if (tbody && remoteData.tableContents[tblId]) {
          tbody.innerHTML = remoteData.tableContents[tblId];
        }
      });
    }

    if (remoteData.editedTexts && Object.keys(remoteData.editedTexts).length > 0) {
              currentPlanState.editedTexts = Object.assign({}, currentPlanState.editedTexts, remoteData.editedTexts);
              Object.keys(currentPlanState.editedTexts).forEach(textId => {
                const el = document.querySelector(`[data-text-id="${textId}"]`);
                if (el && currentPlanState.editedTexts[textId]) {
                  el.innerHTML = currentPlanState.editedTexts[textId];
                }
              });
            }
            // Restaura PlanState do Supabase se existir (PROBLEMA 5)
            if (remoteData.PlanState || (remoteData.planState && remoteData.planState.PlanState)) {
              const loadedPlanState = remoteData.PlanState || remoteData.planState.PlanState;
              Object.assign(PlanState, loadedPlanState);
            }

            if (remoteData.planState) {
              if (remoteData.planState.tickets) currentPlanState.tickets = remoteData.planState.tickets;
              if (remoteData.planState.fixedCosts) currentPlanState.fixedCosts = remoteData.planState.fixedCosts;
              if (remoteData.planState.proLabore) currentPlanState.proLabore = remoteData.planState.proLabore;
              if (remoteData.planState.mondayTasks) currentPlanState.mondayTasks = remoteData.planState.mondayTasks;
              if (remoteData.planState.scenarios) currentPlanState.scenarios = remoteData.planState.scenarios;
              syncInputCellsFromState();
              recalcularTudo();
              renderMondayBoard();
            } else {
              syncInputCellsFromState();
              recalcularTudo();
            }

            if (needsRerender) {
              renderCustomBlocks();
            }

            // Carrega planilha financeira colaborativa
            if (remoteData.financialSheet && Array.isArray(remoteData.financialSheet) && remoteData.financialSheet.length > 0) {
              currentPlanState.financialSheet = remoteData.financialSheet;
              if (window._spreadsheetInitialized && typeof window.initSpreadsheet === 'function') {
                window._spreadsheetInitialized = false;
                window.initSpreadsheet('spreadsheetContainer');
                window._spreadsheetInitialized = true;
              }
            }

            // Carrega cards SWOT colaborativos
            if (remoteData.swotCards && Array.isArray(remoteData.swotCards) && remoteData.swotCards.length > 0) {
              currentPlanState.swotCards = remoteData.swotCards;
              if (window._swotCanvasInitialized && typeof window.applySwotRemoteUpdate === 'function') {
                window.applySwotRemoteUpdate(remoteData.swotCards);
              }
            }

            updateSyncIndicator(true, 'Sincronizado Supabase');
          }
        }
      } catch (cloudErr) {
        console.warn('[Business Plan] Erro ao sincronizar com Supabase:', cloudErr.message);
      }
    }
  } catch (err) {
    console.error('[Business Plan] Erro ao carregar plano:', err);
  }
}

function syncInputCellsFromState() {
  // Sincronização Bidirecional Robusta: Reconstrói PlanState a partir de currentPlanState
  if (currentPlanState.tickets) {
    if (currentPlanState.tickets.essencial !== undefined) PlanState.ticketEssencial = currentPlanState.tickets.essencial;
    if (currentPlanState.tickets.pro !== undefined) PlanState.ticketPro = currentPlanState.tickets.pro;
    if (currentPlanState.tickets.intelligence !== undefined) PlanState.ticketIntelligence = currentPlanState.tickets.intelligence;
  }
  if (currentPlanState.fixedCosts) {
    PlanState.custoFixo = (Number(currentPlanState.fixedCosts.supabase) || 0) +
                          (Number(currentPlanState.fixedCosts.vercel) || 0) +
                          (Number(currentPlanState.fixedCosts.dominio) || 0) +
                          (Number(currentPlanState.fixedCosts.email) || 0);
  }
  if (currentPlanState.proLabore) {
    PlanState.proLabore = (Number(currentPlanState.proLabore.leonardo) || 0) +
                          (Number(currentPlanState.proLabore.mayumi) || 0);
  }
  if (currentPlanState.taxRate !== undefined) {
    PlanState.aliquota = currentPlanState.taxRate / 100;
  }
  if (currentPlanState.initialDebt !== undefined) {
    PlanState.dividaInicial = currentPlanState.initialDebt;
  }

  // Garante que currentPlanState reflita os tickets do PlanState
  if (!currentPlanState.tickets) currentPlanState.tickets = {};
  currentPlanState.tickets.essencial = PlanState.ticketEssencial;
  currentPlanState.tickets.pro = PlanState.ticketPro;
  currentPlanState.tickets.intelligence = PlanState.ticketIntelligence;

  // Atualiza células DOM se presentes na tela
  if (currentPlanState.fixedCosts) {
    setCellVal('fixed_supabase', currentPlanState.fixedCosts.supabase);
    setCellVal('fixed_vercel', currentPlanState.fixedCosts.vercel);
    setCellVal('fixed_dominio', currentPlanState.fixedCosts.dominio);
    setCellVal('fixed_email', currentPlanState.fixedCosts.email);
  }

  if (currentPlanState.proLabore) {
    setCellVal('pro_leonardo', currentPlanState.proLabore.leonardo);
    setCellVal('pro_mayumi', currentPlanState.proLabore.mayumi);
  }

  setCellVal('ticket_essencial', PlanState.ticketEssencial);
  setCellVal('ticket_pro', PlanState.ticketPro);
  setCellVal('ticket_intelligence', PlanState.ticketIntelligence);

  const elTax = document.getElementById('inputTaxRate');
  if (elTax) elTax.textContent = (PlanState.aliquota * 100).toFixed(1);

  // Executa recálculo para sincronizar tabelas e cards em tempo real
  if (typeof recalcularTudo === 'function') {
    recalcularTudo();
  }
}

function setCellVal(dataAttr, val) {
  const cleanAttr = dataAttr.replace(/^(fixed_|pro_|ticket_)/, '');
  const el = document.querySelector(`[data-fixed-field="${dataAttr}"], [data-fixed-field="${cleanAttr}"], [data-pro-field="${dataAttr}"], [data-pro-field="${cleanAttr}"], [data-ticket-field="${dataAttr}"], [data-ticket-field="${cleanAttr}"]`);
  if (el) el.textContent = val;
}



// =========================================================================
// 9. BLOCOS DINÂMICOS & MINI-PLANILHAS (PlanDynamicBlocks)
// =========================================================================
function toggleInsertMenu(forceOpen) {
  const menu = document.getElementById('planInsertMenu');
  if (!menu) return;
  if (forceOpen !== undefined) {
    menu.classList.toggle('hidden', !forceOpen);
  } else {
    menu.classList.toggle('hidden');
  }
}

function getActivePlanSectionId() {
  const activeBtn = document.querySelector('.plan-jump-btn.plan-jump-active');
  if (activeBtn && activeBtn.id) {
    const secId = activeBtn.id.replace('btn-jump-', '');
    if (document.getElementById(secId)) return secId;
  }
  return 'sec-executivo';
}

function insertDirectCustomBlock(type) {
  toggleInsertMenu(false);
  const targetSecId = getActivePlanSectionId();

  const isRisk = (type === 'risk');
  const defaultTitle = isRisk ? '⚠️ Ponto Crítico & Gestão de Risco' : '💡 Premissa & Destaque Estratégico';
  const defaultContent = isRisk 
    ? 'Identificação de potencial gargalo operacional e contramedidas recomendadas para preservar o fluxo de caixa.' 
    : 'Destaque de diferencial competitivo exclusivo para os primeiros clientes de São José dos Campos.';

  const block = {
    id: 'block-' + Date.now(),
    type: type || 'callout',
    sectionId: targetSecId,
    title: defaultTitle,
    content: defaultContent,
    createdAt: new Date().toISOString()
  };

  currentPlanState.customBlocks = currentPlanState.customBlocks || [];
  currentPlanState.customBlocks.push(block);

  renderCustomBlocks();
  triggerAutoSave();
  jumpToPlanSection(targetSecId);

  if (typeof PlanRealtimeCollab !== 'undefined' && PlanRealtimeCollab.broadcastChange) {
    PlanRealtimeCollab.broadcastChange('block_inserted', { block, blocks: currentPlanState.customBlocks });
  }

  setTimeout(() => {
    const el = document.getElementById(block.id);
    if (el) {
      if (typeof el.scrollIntoView === 'function') {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      if (el.classList && typeof el.classList.add === 'function') {
        el.classList.add('ring-2', 'ring-cyan-500', 'ring-offset-2', 'transition-all');
        setTimeout(() => {
          if (el.classList && typeof el.classList.remove === 'function') {
            el.classList.remove('ring-2', 'ring-cyan-500', 'ring-offset-2');
          }
        }, 2500);
      }
      const titleEl = el.querySelector('[contenteditable="true"]');
      if (titleEl && typeof titleEl.focus === 'function') {
        titleEl.focus();
      }
    }
  }, 100);

  return block;
}

function insertDirectMiniSpreadsheet() {
  toggleInsertMenu(false);
  const targetSecId = getActivePlanSectionId();

  const block = {
    id: 'sheet-' + Date.now(),
    type: 'mini_spreadsheet',
    sectionId: targetSecId,
    title: '📊 Nova Composição de Custos / Investimento',
    rows: [
      { item: 'Licença de Infraestrutura Cloud', qtd: 1, unit: 250 },
      { item: 'Campanhas de Aquisição Digital', qtd: 1, unit: 500 }
    ],
    createdAt: new Date().toISOString()
  };

  currentPlanState.customBlocks = currentPlanState.customBlocks || [];
  currentPlanState.customBlocks.push(block);

  renderCustomBlocks();
  triggerAutoSave();
  jumpToPlanSection(targetSecId);

  if (typeof PlanRealtimeCollab !== 'undefined' && PlanRealtimeCollab.broadcastChange) {
    PlanRealtimeCollab.broadcastChange('block_inserted', { block, blocks: currentPlanState.customBlocks });
  }

  setTimeout(() => {
    const el = document.getElementById(block.id);
    if (el) {
      if (typeof el.scrollIntoView === 'function') {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      if (el.classList && typeof el.classList.add === 'function') {
        el.classList.add('ring-2', 'ring-emerald-500', 'ring-offset-2', 'transition-all');
        setTimeout(() => {
          if (el.classList && typeof el.classList.remove === 'function') {
            el.classList.remove('ring-2', 'ring-emerald-500', 'ring-offset-2');
          }
        }, 2500);
      }
      const titleEl = el.querySelector('[contenteditable="true"]');
      if (titleEl && typeof titleEl.focus === 'function') {
        titleEl.focus();
      }
    }
  }, 100);

  return block;
}

function insertCustomBlockPrompt(type) {
  return insertDirectCustomBlock(type);
}

function insertMiniSpreadsheetPrompt() {
  return insertDirectMiniSpreadsheet();
}

function deleteCustomBlock(blockId) {
  if (!confirm('Deseja realmente excluir este bloco do documento?')) return;
  currentPlanState.customBlocks = (currentPlanState.customBlocks || []).filter(b => b.id !== blockId);
  renderCustomBlocks();
  triggerAutoSave();
  if (typeof PlanRealtimeCollab !== 'undefined' && PlanRealtimeCollab.broadcastChange) {
    PlanRealtimeCollab.broadcastChange('block_deleted', { blockId, blocks: currentPlanState.customBlocks });
  }
}

function updateCustomBlockTitle(blockId, newTitle) {
  const block = (currentPlanState.customBlocks || []).find(b => b.id === blockId);
  if (block) {
    block.title = newTitle;
    triggerAutoSave();
    if (typeof PlanRealtimeCollab !== 'undefined' && PlanRealtimeCollab.broadcastChange) {
      PlanRealtimeCollab.broadcastChange('block_updated', { blockId, blocks: currentPlanState.customBlocks });
    }
  }
}

function updateCustomBlockContent(blockId, newContent) {
  const block = (currentPlanState.customBlocks || []).find(b => b.id === blockId);
  if (block) {
    block.content = newContent;
    triggerAutoSave();
    if (typeof PlanRealtimeCollab !== 'undefined' && PlanRealtimeCollab.broadcastChange) {
      PlanRealtimeCollab.broadcastChange('block_updated', { blockId, blocks: currentPlanState.customBlocks });
    }
  }
}

function addMiniSpreadsheetRow(blockId) {
  const block = (currentPlanState.customBlocks || []).find(b => b.id === blockId);
  if (block && Array.isArray(block.rows)) {
    block.rows.push({
      item: 'Novo Item',
      qtd: 1,
      unit: 100
    });
    renderCustomBlocks();
    triggerAutoSave();
    if (typeof PlanRealtimeCollab !== 'undefined' && PlanRealtimeCollab.broadcastChange) {
      PlanRealtimeCollab.broadcastChange('block_updated', { blockId, blocks: currentPlanState.customBlocks });
    }
  }
}

function deleteMiniSpreadsheetRow(blockId, rowIndex) {
  const block = (currentPlanState.customBlocks || []).find(b => b.id === blockId);
  if (block && Array.isArray(block.rows)) {
    block.rows.splice(rowIndex, 1);
    renderCustomBlocks();
    triggerAutoSave();
    if (typeof PlanRealtimeCollab !== 'undefined' && PlanRealtimeCollab.broadcastChange) {
      PlanRealtimeCollab.broadcastChange('block_updated', { blockId, blocks: currentPlanState.customBlocks });
    }
  }
}

function updateMiniSpreadsheetCell(blockId, rowIndex, field, val) {
  const block = (currentPlanState.customBlocks || []).find(b => b.id === blockId);
  if (block && Array.isArray(block.rows) && block.rows[rowIndex]) {
    if (field === 'item') {
      block.rows[rowIndex].item = val;
    } else {
      const num = parseFloat(String(val).replace(',', '.')) || 0;
      block.rows[rowIndex][field] = num;
    }
    recalcMiniSpreadsheetDOM(blockId);
    triggerAutoSave();
    if (typeof PlanRealtimeCollab !== 'undefined' && PlanRealtimeCollab.broadcastChange) {
      PlanRealtimeCollab.broadcastChange('block_updated', { blockId, blocks: currentPlanState.customBlocks });
    }
  }
}

function recalcMiniSpreadsheetDOM(blockId) {
  const block = (currentPlanState.customBlocks || []).find(b => b.id === blockId);
  if (!block || !Array.isArray(block.rows)) return;

  let grandTotal = 0;
  block.rows.forEach((r, idx) => {
    const rowSubtotal = (r.qtd || 0) * (r.unit || 0);
    grandTotal += rowSubtotal;
    const subEl = document.getElementById(`subtotal-${blockId}-${idx}`);
    if (subEl) {
      subEl.textContent = PlanFinancialEngine.formatCurrency(rowSubtotal);
    }
  });

  const totalEl = document.getElementById(`total-${blockId}`);
  if (totalEl) {
    totalEl.textContent = PlanFinancialEngine.formatCurrency(grandTotal);
  }
}

function renderCustomBlocks() {
  const validSecIds = [
    'sec-executivo', 'sec-mercado', 'sec-marketing', 'sec-operacional',
    'sec-financeiro', 'sec-cenarios', 'sec-swot', 'sec-governanca', 'sec-tarefas', 'sec-anexos'
  ];

  validSecIds.forEach(secId => {
    const secEl = document.getElementById(secId);
    if (!secEl) return;

    let container = document.getElementById('custom-blocks-' + secId);
    if (!container) {
      container = document.createElement('div');
      container.id = 'custom-blocks-' + secId;
      container.className = 'plan-custom-blocks-container space-y-4 my-6 select-none';
      secEl.appendChild(container);
    }

    const blocks = (currentPlanState.customBlocks || []).filter(b => b.sectionId === secId);
    if (blocks.length === 0) {
      container.innerHTML = '';
      return;
    }

    let html = '';
    blocks.forEach(b => {
      if (b.type === 'callout') {
        html += `
          <div id="${b.id}" class="p-4 rounded-xl bg-gradient-to-r from-cyan-50/60 to-white border border-cyan-200 border-l-4 border-l-cyan-600 shadow-xs relative group transition-all my-4">
            <div class="flex items-center justify-between gap-2 mb-2">
              <div class="flex items-center gap-2">
                <i class="fa-solid fa-lightbulb text-cyan-600 text-sm"></i>
                <div contenteditable="true" onblur="updateCustomBlockTitle('${b.id}', this.textContent)" class="font-bold text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-1 focus:ring-cyan-500 rounded px-1">
                  ${escapePlanHtml(b.title)}
                </div>
              </div>
              <button type="button" onclick="deleteCustomBlock('${b.id}')" class="text-slate-400 hover:text-rose-600 text-xs p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" title="Excluir bloco">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
            <div contenteditable="true" onblur="updateCustomBlockContent('${b.id}', this.innerHTML)" class="text-xs text-slate-600 leading-relaxed focus:outline-none focus:bg-white focus:ring-1 focus:ring-cyan-500 rounded p-1">
              ${b.content}
            </div>
          </div>
        `;
      } else if (b.type === 'risk') {
        html += `
          <div id="${b.id}" class="p-4 rounded-xl bg-gradient-to-r from-amber-50/60 to-white border border-amber-200 border-l-4 border-l-amber-500 shadow-xs relative group transition-all my-4">
            <div class="flex items-center justify-between gap-2 mb-2">
              <div class="flex items-center gap-2">
                <i class="fa-solid fa-triangle-exclamation text-amber-500 text-sm"></i>
                <div contenteditable="true" onblur="updateCustomBlockTitle('${b.id}', this.textContent)" class="font-bold text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-1 focus:ring-amber-500 rounded px-1">
                  ${escapePlanHtml(b.title)}
                </div>
              </div>
              <button type="button" onclick="deleteCustomBlock('${b.id}')" class="text-slate-400 hover:text-rose-600 text-xs p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" title="Excluir bloco">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
            <div contenteditable="true" onblur="updateCustomBlockContent('${b.id}', this.innerHTML)" class="text-xs text-slate-600 leading-relaxed focus:outline-none focus:bg-white focus:ring-1 focus:ring-amber-500 rounded p-1">
              ${b.content}
            </div>
          </div>
        `;
      } else if (b.type === 'mini_spreadsheet') {
        let total = 0;
        let rowsHtml = '';
        (b.rows || []).forEach((r, idx) => {
          const sub = (r.qtd || 0) * (r.unit || 0);
          total += sub;
          rowsHtml += `
            <tr class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td class="px-3 py-2 text-xs">
                <input type="text" value="${escapePlanHtml(r.item || '')}" onchange="updateMiniSpreadsheetCell('${b.id}', ${idx}, 'item', this.value)" class="w-full bg-transparent border-0 focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded px-1 text-slate-800 font-medium" />
              </td>
              <td class="px-2 py-2 text-center text-xs w-20">
                <input type="number" min="0" step="1" value="${r.qtd || 0}" oninput="updateMiniSpreadsheetCell('${b.id}', ${idx}, 'qtd', this.value)" class="w-16 text-center bg-slate-50 border border-slate-200 rounded px-1 py-0.5 focus:outline-none focus:border-emerald-500 text-slate-800 font-semibold" />
              </td>
              <td class="px-2 py-2 text-right text-xs w-28">
                <input type="number" min="0" step="10" value="${r.unit || 0}" oninput="updateMiniSpreadsheetCell('${b.id}', ${idx}, 'unit', this.value)" class="w-24 text-right bg-slate-50 border border-slate-200 rounded px-1 py-0.5 focus:outline-none focus:border-emerald-500 text-slate-800 font-semibold" />
              </td>
              <td id="subtotal-${b.id}-${idx}" class="px-3 py-2 text-right text-xs font-mono font-bold text-slate-900 w-28">
                ${PlanFinancialEngine.formatCurrency(sub)}
              </td>
              <td class="px-2 py-2 text-center w-10">
                <button type="button" onclick="deleteMiniSpreadsheetRow('${b.id}', ${idx})" class="text-slate-300 hover:text-rose-600 text-xs transition-colors p-1 cursor-pointer" title="Excluir linha">
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </td>
            </tr>
          `;
        });

        html += `
          <div id="${b.id}" class="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden my-4 group">
            <div class="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <i class="fa-solid fa-table-cells text-emerald-600 text-sm"></i>
                <div contenteditable="true" onblur="updateCustomBlockTitle('${b.id}', this.textContent)" class="font-bold text-xs text-slate-800 focus:outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500 rounded px-1">
                  ${escapePlanHtml(b.title)}
                </div>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Excel / Auto-soma</span>
              </div>
              <button type="button" onclick="deleteCustomBlock('${b.id}')" class="text-slate-400 hover:text-rose-600 text-xs p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" title="Excluir planilha">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="bg-slate-50/50 border-b border-slate-100 text-[11px] font-bold text-slate-600 uppercase">
                    <th class="px-3 py-2">Item / Descrição</th>
                    <th class="px-2 py-2 text-center w-20">Qtd</th>
                    <th class="px-2 py-2 text-right w-28">Valor Unit. (R$)</th>
                    <th class="px-3 py-2 text-right w-28">Subtotal</th>
                    <th class="px-2 py-2 text-center w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  ${rowsHtml}
                </tbody>
                <tfoot>
                  <tr class="bg-slate-50 border-t-2 border-slate-200 font-bold">
                    <td colspan="2" class="px-3 py-2.5">
                      <button type="button" onclick="addMiniSpreadsheetRow('${b.id}')" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white hover:bg-slate-100 text-emerald-700 text-xs font-semibold border border-slate-200 transition-colors shadow-2xs cursor-pointer">
                        <i class="fa-solid fa-plus text-[10px]"></i> Linha
                      </button>
                    </td>
                    <td class="px-2 py-2.5 text-right text-xs uppercase tracking-wider text-slate-600">Total (Σ):</td>
                    <td id="total-${b.id}" class="px-3 py-2.5 text-right text-sm font-mono font-black text-emerald-700">
                      ${PlanFinancialEngine.formatCurrency(total)}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        `;
      }
    });

    container.innerHTML = html;
  });
}

// Fechamento automático do menu Inserir ao clicar fora
if (typeof document !== 'undefined') {
  document.addEventListener('click', (e) => {
    const menu = document.getElementById('planInsertMenu');
    const btnWrapper = e.target.closest('#planInsertDropdownWrapper');
    if (menu && !menu.classList.contains('hidden') && !btnWrapper) {
      menu.classList.add('hidden');
    }
  });
}


// =========================================================================
// CONTROLES DA MOLDURA EXECUTIVA GOOGLE SHEETS
// =========================================================================
function reloadGoogleSheetsIframe() {
  const frame = document.getElementById('googleSheetsIframe');
  if (frame) {
    const src = frame.src;
    frame.src = '';
    setTimeout(() => { frame.src = src; }, 100);
  }
}

function toggleGoogleSheetsFullscreen() {
  const container = document.getElementById('googleSheetsExecutiveFrame');
  const btn = document.getElementById('btnFullscreenSheets');
  if (!container) return;
  const isFull = container.classList.toggle('sheets-fullscreen');
  if (isFull) {
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100vw';
    container.style.height = '100vh';
    container.style.zIndex = '99999';
    container.style.borderRadius = '0';
    if (btn) btn.innerHTML = '<i class="fa-solid fa-compress text-[10px]"></i> <span class="hidden sm:inline">Reduzir</span>';
  } else {
    container.style.position = '';
    container.style.top = '';
    container.style.left = '';
    container.style.width = '';
    container.style.height = '820px';
    container.style.zIndex = '';
    container.style.borderRadius = '';
    if (btn) btn.innerHTML = '<i class="fa-solid fa-expand text-[10px]"></i> <span class="hidden sm:inline">Expandir</span>';
  }
}

// =========================================================================
// CONTROLES DA MOLDURA EXECUTIVA GOOGLE DOCS (SEÇÃO 10: ANEXOS)
// =========================================================================
function reloadGoogleDocsIframe() {
  const frame = document.getElementById('googleDocsPlanIframe');
  if (frame) {
    const src = frame.src;
    frame.src = '';
    setTimeout(() => { frame.src = src; }, 100);
  }
}

function toggleGoogleDocsFullscreen() {
  const container = document.getElementById('googleDocsExecutiveFrame');
  const icon = document.getElementById('btnDocsFullscreenIcon');
  const text = document.getElementById('btnDocsFullscreenText');
  if (!container) return;
  const isFull = container.classList.toggle('docs-fullscreen');
  if (isFull) {
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100vw';
    container.style.height = '100vh';
    container.style.zIndex = '99999';
    container.style.borderRadius = '0';
    if (icon) icon.className = 'fa-solid fa-compress text-[10px]';
    if (text) text.textContent = 'Reduzir';
  } else {
    container.style.position = '';
    container.style.top = '';
    container.style.left = '';
    container.style.width = '';
    container.style.height = '820px';
    container.style.zIndex = '';
    container.style.borderRadius = '';
    if (icon) icon.className = 'fa-solid fa-expand text-[10px]';
    if (text) text.textContent = 'Tela Cheia';
  }
}

// Expõe funções no escopo global para acionamentos do admin-crm.html
if (typeof window !== 'undefined') {
  window.loadBusinessPlan = loadBusinessPlan;
  window.resetBusinessPlanToDefaults = resetBusinessPlanToDefaults;
  window.exportBusinessPlanPDF = exportBusinessPlanPDF;
  window.jumpToPlanSection = jumpToPlanSection;
  window.reloadGoogleSheetsIframe = reloadGoogleSheetsIframe;
  window.toggleGoogleSheetsFullscreen = toggleGoogleSheetsFullscreen;
  window.reloadGoogleDocsIframe = reloadGoogleDocsIframe;
  window.toggleGoogleDocsFullscreen = toggleGoogleDocsFullscreen;
  window.togglePlanEditMode = togglePlanEditMode;
  window.execPlanFormat = execPlanFormat;
  window.execPlanBlockFormat = execPlanBlockFormat;
  window.execPlanFontSize = execPlanFontSize;
  window.toggleRibbonColorMenu = toggleRibbonColorMenu;
  window.execPlanTextColor = execPlanTextColor;
  window.triggerAutoSave = triggerAutoSave;
  window.updateSyncIndicator = updateSyncIndicator;
  window.setMondayFilter = setMondayFilter;
  window.setMondayStatusFilter = setMondayStatusFilter;
  window.cycleTaskStatus = cycleTaskStatus;
  window.cycleTaskPriority = cycleTaskPriority;
  window.deleteMondayTask = deleteMondayTask;
  window.addNewMondayTask = addNewMondayTask;
  window.openNewTaskModal = openNewTaskModal;
  window.openEditTaskModal = openEditTaskModal;
  window.closeNewTaskModal = closeNewTaskModal;
  window.deleteCurrentModalTask = deleteCurrentModalTask;
  window.saveNewTaskFromModal = saveNewTaskFromModal;
  window.toggleMondayView = toggleMondayView;
  window.renderMondayCalendar = renderMondayCalendar;
  window.changeMondayCalendarMonth = changeMondayCalendarMonth;
  window.setMondayCalendarToday = setMondayCalendarToday;
  window.parseTaskDateForInput = parseTaskDateForInput;
  window.formatTaskDueDateDisplay = formatTaskDueDateDisplay;
  window.PlanFinancialEngine = PlanFinancialEngine;
  window.PlanInlineEditor = PlanInlineEditor;

  // Blocos Dinâmicos & Mini-Planilhas
  window.toggleInsertMenu = toggleInsertMenu;
  window.insertDirectCustomBlock = insertDirectCustomBlock;
  window.insertDirectMiniSpreadsheet = insertDirectMiniSpreadsheet;
  window.insertCustomBlockPrompt = insertCustomBlockPrompt;
  window.insertMiniSpreadsheetPrompt = insertMiniSpreadsheetPrompt;
  window.deleteCustomBlock = deleteCustomBlock;
  window.updateCustomBlockTitle = updateCustomBlockTitle;
  window.updateCustomBlockContent = updateCustomBlockContent;
  window.addMiniSpreadsheetRow = addMiniSpreadsheetRow;
  window.deleteMiniSpreadsheetRow = deleteMiniSpreadsheetRow;
  window.updateMiniSpreadsheetCell = updateMiniSpreadsheetCell;
  window.renderCustomBlocks = renderCustomBlocks;

  // Multi-User Realtime Collaboration (Leonardo & Mayumi)
  window.PlanRealtimeCollab = PlanRealtimeCollab;
  window.toggleActiveCollaborator = toggleActiveCollaborator;
  window.switchPlanWorkspaceView = switchPlanWorkspaceView;
  window.PlanState = PlanState;
  window.recalcularTudo = recalcularTudo;

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => { loadBusinessPlan(); });
    } else {
      setTimeout(() => { loadBusinessPlan(); }, 100);
    }
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    DEFAULT_PLAN_STATE,
    PlanFinancialEngine,
    currentPlanState,
    PlanState,
    recalcularTudo,
    escapePlanHtml,
    formatMarkdownBasic,
    PlanRealtimeCollab,
    toggleActiveCollaborator,
    insertDirectCustomBlock,
    insertDirectMiniSpreadsheet,
    switchPlanWorkspaceView
  };
}
