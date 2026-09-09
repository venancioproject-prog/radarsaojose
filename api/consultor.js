// API Consultor Estratégico - Radar São José dos Campos
// Base Oficial de Microdados (N=477, IC=95%, Erro Amostral ±4.49%)

// 1. DATASET SNAPSHOT OFICIAL E AUDITADO (CALCULADO DIRETAMENTE DA BASE N=477)
const DATASET_SNAPSHOT = {
  source: "Pesquisa Municipal Radar SJC (Microdados Oficiais)",
  n: 477,
  valid_rows: 477,
  confidence_interval: "95%",
  margin_of_error: "±4.49%",
  metrics: {
    renda_familiar: {
      question: "Qual a renda total da sua casa por mês?",
      denominator: 477,
      categories: [
        { label: "Até R$ 2.800", count: 73, percentage: 15.3, formula: "73 / 477 * 100" },
        { label: "R$ 2.801 a R$ 5.600", count: 161, percentage: 33.8, formula: "161 / 477 * 100" },
        { label: "R$ 5.601 a R$ 12.000", count: 155, percentage: 32.5, formula: "155 / 477 * 100" },
        { label: "R$ 12.001 a R$ 26.000", count: 67, percentage: 14.0, formula: "67 / 477 * 100" },
        { label: "Mais de R$ 26.000", count: 21, percentage: 4.4, formula: "21 / 477 * 100" }
      ],
      alta_renda_acima_12k: { count: 88, percentage: 18.4, formula: "88 / 477 * 100" }
    },
    evasao_consumo: {
      question: "Você costuma ir para outras cidades para passear ou comer fora?",
      denominator: 477,
      categories: [
        { label: "Às vezes", count: 238, percentage: 49.9, formula: "238 / 477 * 100" },
        { label: "Quase nunca", count: 129, percentage: 27.0, formula: "129 / 477 * 100" },
        { label: "Sim, sempre", count: 78, percentage: 16.4, formula: "78 / 477 * 100" },
        { label: "Nunca", count: 32, percentage: 6.7, formula: "32 / 477 * 100" }
      ],
      total_evadem: { count: 316, percentage: 66.2, formula: "(238 + 78) / 477 * 100" }
    },
    demanda_reprimida_lazer: {
      question: "Você gastaria mais dinheiro se a cidade tivesse melhores opções de lazer ou lugares para frequentar?",
      denominator: 477,
      categories: [
        { label: "Sim", count: 332, percentage: 69.6, formula: "332 / 477 * 100" },
        { label: "Não", count: 145, percentage: 30.4, formula: "145 / 477 * 100" }
      ]
    },
    regiao_frequentada: {
      question: "Qual região da cidade você mais frequenta quando sai de casa?",
      denominator: 477,
      categories: [
        { label: "Centro / Oeste (ex: Aquarius, Vila Adyana)", count: 199, percentage: 41.7, formula: "199 / 477 * 100" },
        { label: "Zona Sul", count: 135, percentage: 28.3, formula: "135 / 477 * 100" },
        { label: "Vou em todas as regiões", count: 57, percentage: 11.9, formula: "57 / 477 * 100" },
        { label: "Zona Leste", count: 55, percentage: 11.5, formula: "55 / 477 * 100" },
        { label: "Zona Norte", count: 31, percentage: 6.5, formula: "31 / 477 * 100" }
      ]
    },
    dificuldade_noite_barreiras: {
      question: "Qual a sua maior dificuldade quando decide sair à noite em São José dos Campos?",
      denominator: 477,
      categories: [
        { label: "É tudo muito caro", count: 158, percentage: 33.1, formula: "158 / 477 * 100" },
        { label: "Não tem lugar legal para ir", count: 112, percentage: 23.5, formula: "112 / 477 * 100" },
        { label: "Falta de segurança", count: 98, percentage: 20.5, formula: "98 / 477 * 100" },
        { label: "Não vejo dificuldade", count: 65, percentage: 13.6, formula: "65 / 477 * 100" },
        { label: "Ônibus ou falta de transporte", count: 34, percentage: 7.1, formula: "34 / 477 * 100" },
        { label: "O trânsito", count: 10, percentage: 2.1, formula: "10 / 477 * 100" }
      ]
    },
    criterio_escolha_restaurante: {
      question: "O que você mais leva em conta para escolher um restaurante ou bar?",
      denominator: 477,
      categories: [
        { label: "O preço", count: 133, percentage: 27.9, formula: "133 / 477 * 100" },
        { label: "Se o lugar é bonito e agradável", count: 131, percentage: 27.5, formula: "131 / 477 * 100" },
        { label: "Indicação de amigos ou família", count: 98, percentage: 20.5, formula: "98 / 477 * 100" },
        { label: "As notas no Google", count: 45, percentage: 9.4, formula: "45 / 477 * 100" },
        { label: "O que vejo no Instagram ou TikTok", count: 42, percentage: 8.8, formula: "42 / 477 * 100" },
        { label: "Se é perto de casa", count: 28, percentage: 5.9, formula: "28 / 477 * 100" }
      ]
    },
    estetica_instagramavel: {
      question: "Você já escolheu um lugar só porque ele é bonito para tirar fotos e postar?",
      denominator: 477,
      categories: [
        { label: "Não, não ligo para isso", count: 308, percentage: 64.6, formula: "308 / 477 * 100" },
        { label: "Um pouco", count: 131, percentage: 27.5, formula: "131 / 477 * 100" },
        { label: "Sim, muito", count: 38, percentage: 8.0, formula: "38 / 477 * 100" }
      ],
      alguma_influencia: { count: 169, percentage: 35.4, formula: "(131 + 38) / 477 * 100" }
    },
    redes_sociais_busca: {
      question: "Qual rede social você mais usa pra encontrar lugares e referências na cidade",
      denominator: 477,
      categories: [
        { label: "Instagram", count: 295, percentage: 61.8, formula: "295 / 477 * 100" },
        { label: "TikTok", count: 78, percentage: 16.4, formula: "78 / 477 * 100" },
        { label: "YouTube", count: 66, percentage: 13.8, formula: "66 / 477 * 100" },
        { label: "Google", count: 10, percentage: 2.1, formula: "10 / 477 * 100" },
        { label: "Facebook", count: 10, percentage: 2.1, formula: "10 / 477 * 100" }
      ]
    },
    influenciadores_visita: {
      question: "Você já foi a algum lugar na cidade por recomendação de um influenciador local?",
      denominator: 477,
      categories: [
        { label: "Não", count: 332, percentage: 69.6, formula: "332 / 477 * 100" },
        { label: "Sim", count: 145, percentage: 30.4, formula: "145 / 477 * 100" }
      ]
    },
    pet_friendly: {
      question: "Você tem animais de estimação em casa?",
      denominator: 475,
      categories: [
        { label: "Sim", count: 251, percentage: 52.8, formula: "251 / 475 * 100" },
        { label: "Não", count: 224, percentage: 47.2, formula: "224 / 475 * 100" }
      ]
    },
    orgulho_morar: {
      question: "Você sente orgulho de morar em São José dos Campos?",
      denominator: 477,
      categories: [
        { label: "Sim", count: 354, percentage: 74.2, formula: "354 / 477 * 100" },
        { label: "Não", count: 123, percentage: 25.8, formula: "123 / 477 * 100" }
      ]
    },
    boas_opcoes_cultura_lazer: {
      question: "Você acha que São José dos Campos tem boas opções de lazer, cultura e vida noturna?",
      denominator: 477,
      categories: [
        { label: "Sim", count: 242, percentage: 50.7, formula: "242 / 477 * 100" },
        { label: "Não", count: 235, percentage: 49.3, formula: "235 / 477 * 100" }
      ]
    },
    frequencia_saida_lazer: {
      question: "Com que frequência você costuma sair para comer fora ou lazer?",
      denominator: 477,
      categories: [
        { label: "Toda semana", count: 239, percentage: 50.1, formula: "239 / 477 * 100" },
        { label: "1 vez ao mês", count: 115, percentage: 24.1, formula: "115 / 477 * 100" },
        { label: "Quase nunca", count: 68, percentage: 14.3, formula: "68 / 477 * 100" },
        { label: "2 ou 3 vezes por mês", count: 50, percentage: 10.5, formula: "50 / 477 * 100" },
        { label: "Nunca", count: 5, percentage: 1.0, formula: "5 / 477 * 100" }
      ],
      saem_regularmente: {
        descricao: "Definição estrita: Toda semana (50.1%) + 2-3 vezes por mês (10.5%)",
        count: 289,
        percentage: 60.6,
        formula: "(239 + 50) / 477 * 100"
      },
      saem_ao_menos_mensalmente: {
        descricao: "Definição ampla: Incluindo 1 vez ao mês (24.1%)",
        count: 404,
        percentage: 84.7,
        formula: "(239 + 50 + 115) / 477 * 100"
      }
    }
  },
  verbatims: [
    {
      citacao: "Custo de vida de capital, com opções, salário e oportunidades de um interior... Coisas caras e sem qualidade.",
      genero: "Mulher",
      idade: "25-34 anos",
      regiao: "Zona Sul",
      renda: "R$ 5.6k - 12k"
    },
    {
      citacao: "Falta aconchego humano, vida nas ruas. Fora centro comercial, shopping, supermercados e corredores, não há vida nas ruas de São José.",
      genero: "Mulher",
      idade: "65+ anos",
      regiao: "Centro-Oeste",
      renda: "R$ 5.6k - 12k"
    },
    {
      citacao: "Eu entendo que São José tem muitas opções pra quem pode pagar e poucas pra quem não pode pagar. Em vários aspectos com relação a cultura, ao transporte.",
      genero: "Mulher",
      idade: "25-34 anos",
      regiao: "Zona Norte",
      renda: "R$ 2.8k - 5.6k"
    },
    {
      citacao: "Cidade com direção política conservadora, falta arte, eventos públicos, os parques e feiras são bons. Mas poderíamos ter muito mais com o número de habitantes que temos.",
      genero: "Homem",
      idade: "35-44 anos",
      regiao: "Centro-Oeste",
      renda: "R$ 2.8k - 5.6k"
    },
    {
      citacao: "Para lazer e cultura prefiro ir a São Paulo pois as opções aqui são limitadas e muitas vezes os eventos não são bem divulgados ou organizados.",
      genero: "Mulher",
      idade: "35-44 anos",
      regiao: "Centro-Oeste",
      renda: "R$ 12k - 26k"
    },
    {
      citacao: "Sinto falta de uma vida cultural mais pulsante fora do eixo comercial. Mais eventos de rua e ocupação dos espaços públicos.",
      genero: "Homem",
      idade: "25-34 anos",
      regiao: "Centro-Oeste",
      renda: "R$ 5.6k - 12k"
    },
    {
      citacao: "SJC tem potencial para ter eventos de grande porte, como festivais de música e gastronomia que atraiam pessoas de fora e segurem quem mora aqui.",
      genero: "Mulher",
      idade: "25-34 anos",
      regiao: "Zona Sul",
      renda: "R$ 5.6k - 12k"
    },
    {
      citacao: "Uma cidade com poucos recursos para jovens.",
      genero: "Mulher",
      idade: "35-44 anos",
      regiao: "Zona Sul",
      renda: "R$ 2.8k - 5.6k"
    },
    {
      citacao: "Lazer só pra quem tem dinheiro.",
      genero: "Mulher",
      idade: "35-44 anos",
      regiao: "Zona Leste",
      renda: "R$ 2.8k - 5.6k"
    }
  ]
};

// 2. FUNÇÕES DE VALIDAÇÃO PROGRAMÁTICA NO BACKEND
function validateAndEnforceOfficialCharts(result) {
  if (!result || typeof result !== 'object') return result;

  // 1. Gráfico de Validação Principal (Barreiras Noturnas Oficiais)
  const snapBarreiras = DATASET_SNAPSHOT.metrics.dificuldade_noite_barreiras.categories;
  result.grafico_validacao = {
    titulo: "BARREIRAS DE CONSUMO E ATRITOS LOCAIS (SJC N=477)",
    type: "bar",
    labels: ["Preço Alto", "Falta Lugar Legal", "Insegurança", "Sem Dificuldade", "Transporte"],
    data: [
      snapBarreiras[0].percentage,
      snapBarreiras[1].percentage,
      snapBarreiras[2].percentage,
      snapBarreiras[3].percentage,
      snapBarreiras[4].percentage
    ]
  };

  // 2. Gráficos Analíticos Auditados (Garantia Matemática Absoluta)
  const snapRegiao = DATASET_SNAPSHOT.metrics.regiao_frequentada.categories;
  const snapRenda = DATASET_SNAPSHOT.metrics.renda_familiar.categories;
  const snapEvasao = DATASET_SNAPSHOT.metrics.evasao_consumo;

  result.graficos_analiticos = [
    {
      chart_data: {
        type: "horizontalBar",
        title: "Concentração e Frequência por Região (Geometria Urbana)",
        labels: ["Centro-Oeste", "Zona Sul", "Todas as Regiões", "Zona Leste", "Zona Norte"],
        data: [
          snapRegiao[0].percentage,
          snapRegiao[1].percentage,
          snapRegiao[2].percentage,
          snapRegiao[3].percentage,
          snapRegiao[4].percentage
        ],
        highlight_index: 0
      },
      pergunta_origem: "Qual região da cidade você mais frequenta quando sai de casa? (N=477)",
      parecer_analitico: "Concentração consolidada no eixo Centro-Oeste (41.7%) e Zona Sul (28.3%), polarizando mais de 70% da dinâmica de consumo da cidade."
    },
    {
      chart_data: {
        type: "doughnut",
        title: "O Paradoxo de Evasão (Oportunidade Latente)",
        labels: ["Evadem para SP/Litoral", "Consomem em SJC"],
        data: [
          snapEvasao.total_evadem.percentage,
          Number((100 - snapEvasao.total_evadem.percentage).toFixed(1))
        ],
        highlight_color: "#D97706"
      },
      pergunta_origem: "Você costuma ir para outras cidades para passear ou comer fora? (N=477)",
      parecer_analitico: "Evasão de 66.2% que sai frequentemente ou ocasionalmente para lazer fora da cidade, sinalizando oportunidade de retenção local."
    },
    {
      chart_data: {
        type: "bar",
        title: "Distribuição de Renda Familiar por Faixa",
        labels: ["Até R$ 2.8k", "R$ 2.8k-5.6k", "R$ 5.6k-12k", "R$ 12k-26k", "Acima R$ 26k"],
        data: [
          snapRenda[0].percentage,
          snapRenda[1].percentage,
          snapRenda[2].percentage,
          snapRenda[3].percentage,
          snapRenda[4].percentage
        ],
        highlight_label: "R$ 5.6k-12k"
      },
      pergunta_origem: "Qual a renda total da sua casa por mês? (N=477)",
      parecer_analitico: "Predomínio das classes médias consolidadas (66.3% entre R$ 2.8k e R$ 12k) e 18.4% de alta renda (> R$ 12k)."
    }
  ];

  // 3. Garantir 3 Verbalizações Reais Autênticas do Banco Oficial
  if (!Array.isArray(result.verbalizacoes_reais) || result.verbalizacoes_reais.length < 3) {
    result.verbalizacoes_reais = DATASET_SNAPSHOT.verbatims.slice(0, 3);
  } else {
    result.verbalizacoes_reais = result.verbalizacoes_reais.slice(0, 3).map((v, i) => {
      const matchOfficial = DATASET_SNAPSHOT.verbatims.find(off => 
        off.citacao.toLowerCase().includes((v.citacao || '').substring(0, 15).toLowerCase())
      ) || DATASET_SNAPSHOT.verbatims[i % DATASET_SNAPSHOT.verbatims.length];

      return {
        citacao: matchOfficial.citacao,
        genero: matchOfficial.genero,
        idade: matchOfficial.idade,
        regiao: matchOfficial.regiao,
        renda: matchOfficial.renda
      };
    });
  }

  // 4. Garantir que o movimento cultural seja rotulado como hipótese
  if (result.movimentos_culturais && result.movimentos_culturais.veredicto_final) {
    let just = result.movimentos_culturais.veredicto_final.justificativa_densa || '';
    if (!just.toLowerCase().includes("hipótese") && !just.toLowerCase().includes("hipotese")) {
      result.movimentos_culturais.veredicto_final.justificativa_densa = "[HIPÓTESE ESTRATÉGICA A VALIDAR] " + just;
    }
  }

  return result;
}

module.exports = async function handler(req, res) {
  // 1. Configuração de Cabeçalhos CORS (Sem credentials quando origin for *)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  // 2. Interceptação do Preflight (OPTIONS)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 3. Bloqueio de métodos não-POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo nao permitido. Use POST.' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        body = {};
      }
    }
    body = body || {};

    // 4. Extração e Separação Estrita de Entradas
    const ideaInput = String(body.idea || body.user_input || body.question || body.prompt || '').trim();
    const reportToAudit = String(body.report_to_audit || body.presentation || '').trim();
    
    let combinedInput = ideaInput;
    if (!combinedInput && Array.isArray(body.messages) && body.messages.length > 0) {
      const lastUserMsg = [...body.messages].reverse().find(m => m && m.role === 'user' && m.content);
      combinedInput = lastUserMsg ? lastUserMsg.content : body.messages[body.messages.length - 1].content;
    }
    combinedInput = String(combinedInput || 'Consultoria estratégica de novos negócios para São José dos Campos').trim();

    const apiKey = (process.env.GROQ_API_KEY || '').trim();
    if (!apiKey) {
      return res.status(500).json({ 
        error: 'Chave GROQ_API_KEY nao configurada nas variaveis de ambiente da Vercel.',
        details: 'Adicione GROQ_API_KEY no painel da Vercel (Settings -> Environment Variables).'
      });
    }

    // 5. System Prompt Rigoroso e Científico
    const systemPrompt = `Você é um analista sênior de mercado e estrategista de negócios. Sua função é auditar uma ideia de negócio e/ou relatório fornecido pelo usuário usando exclusivamente o SNAPSHOT OFICIAL DE MICRODADOS DE SÃO JOSÉ DOS CAMPOS (N=477, IC=95%, Erro ±4.49%).

ESCOPO TÉCNICO:
Trabalhe somente na lógica de análise, validação de dados e conteúdo textual retornado. Não altere front-end, layout ou gráficos.

SNAPSHOT OFICIAL DE DADOS (ÚNICA FONTE DE VERDADE PARA NÚMEROS):
${JSON.stringify(DATASET_SNAPSHOT, null, 2)}

PRINCÍPIOS METODOLÓGICOS E REGRAS QUANTITATIVAS:
1. O dataset_snapshot é a ÚNICA fonte de verdade para qualquer porcentagem, N ou contagem.
2. O texto a ser auditado (report_to_audit) é objeto de auditoria e NUNCA fonte estatística.
3. Não invente números, faturamentos, percentuais ou correlações sem suporte no snapshot.
4. Renda familiar oficial: Até R$ 2.8k (15.3%) | R$ 2.8k-5.6k (33.8%) | R$ 5.6k-12k (32.5%) | R$ 12k-26k (14.0%) | Acima R$ 26k (4.4%).
5. Evasão: 66.2% evadem para lazer/gastronomia (49.9% às vezes, 16.4% sempre).
6. Demanda reprimida geral: 69.6% gastariam mais na cidade se houvesse opções qualificadas.
7. Influenciadores: apenas 30.4% já foram a locais por recomendação (69.6% disseram não).
8. Estética "Instagramável": 64.6% NÃO ligam para apelo de fotos; apenas 8.0% acham decisivo.
9. Regiões mais frequentadas: Centro-Oeste (41.7%), Zona Sul (28.3%), Leste (11.5%), Norte (6.5%).
10. Dores noturnas: 33.1% "É tudo muito caro", 23.5% "Não tem lugar legal", 20.5% "Insegurança".
11. Bairros e Regiões são "shortlist de áreas a validar", nunca ranking comprovado.
12. Os 4 Movimentos Culturais (A Tribo Global, A Cidade Prometida, A Geografia do Silêncio, Empreendedorismo Intuitivo) são HIPÓTESES ESTRATÉGICAS e lentes analíticas, JAMAIS fatos demográficos ou dados censitários do CSV.

ESTRUTURA JSON EXATA E OBRIGATÓRIA A RETORNAR:
{
  "visao_estrategica_texto": "Texto fluido e denso contextualizado na ideia do usuário. Contém OBRIGATORIAMENTE a tese central em **negrito**, identifica as dores locais reais do snapshot e conclui recomendando teste de validação prático.",
  "bairros": [
    { "nome": "Jardim Aquarius", "regiao": "Centro-Oeste", "justificativa": "Análise analítica de fit com a região Centro-Oeste (41.7%) e alta renda (18.4%), destacando a necessidade de validação de campo..." },
    { "nome": "Vila Ema", "regiao": "Centro-Oeste", "justificativa": "Análise analítica de fluxo gastronômico e perfil..." },
    { "nome": "Jardim Satélite", "regiao": "Zona Sul", "justificativa": "Análise analítica para a Zona Sul (28.3% de frequência)..." },
    { "nome": "Vila Adyana", "regiao": "Centro-Oeste", "justificativa": "Análise analítica..." },
    { "nome": "Urbanova", "regiao": "Centro-Oeste", "justificativa": "Análise analítica..." }
  ],
  "zona_exclusao": "NOME DA REGIÃO - Explicação fundamentada dos atritos estruturais, ticket ou formato que geram alto risco sem validação prévia.",
  "swot": {
    "forcas": ["Força 1 baseada no snapshot", "Força 2", "Força 3"],
    "fraquezas": ["Gargalo operacional 1", "Gargalo 2", "Gargalo 3"],
    "oportunidades": ["Demanda reprimida (69.6%) 1", "Alavanca de mercado 2", "Oportunidade 3"],
    "ameacas": ["Evasão (66.2%) 1", "Sensibilidade a preço (33.1%) 2", "Ameaça 3"]
  },
  "auditoria_ambiente": {
    "pestel": {
      "P": "Análise Política...",
      "E": "Análise Econômica conectada às rendas de R$ 2.8k-12k (66.3%) e alta renda de 18.4%...",
      "S": "Análise Social conectada ao comportamento, evasão de 66.2% e busca por qualidade...",
      "T": "Análise Tecnológica (Instagram 61.8%, WhatsApp, canais digitais)...",
      "E_env": "Análise Ambiental (sazonalidade, cultura pet-friendly 52.8%)...",
      "L": "Análise Legal e Regulatória (alvarás, zoneamento)..."
    },
    "ishikawa": {
      "problema_central": "Risco de Baixa Conversão e Evasão do Consumidor Local em SJC",
      "causas": [
        { "categoria": "Pessoas & Atendimento", "descricao": "Falta de treinamento qualificado e hospitalidade." },
        { "categoria": "Ambiente & Experiência", "descricao": "Sensação de mesmice noturna e espaços sem aconchego." },
        { "categoria": "Processos & Mobilidade", "descricao": "Atritos de trânsito e estacionamento escasso." },
        { "categoria": "Produto & Percepção", "descricao": "Preço elevado sem entrega de valor percebido ('coisas caras e sem qualidade')." }
      ]
    }
  },
  "matrizes_estrategicas": {
    "vrio": [
      { "letra": "V", "nome": "Valor", "analise": "Como este negócio cria valor real e reduz dores de consumo em SJC..." },
      { "letra": "R", "nome": "Raridade", "analise": "Diferenciação e raridade da oferta frente à concorrência..." },
      { "letra": "I", "nome": "Imitabilidade", "analise": "Barreiras contra cópia (marca, curadoria, rede, know-how)..." },
      { "letra": "O", "nome": "Organização", "analise": "Capacidade operacional interna para sustentar entrega..." }
    ],
    "porter": [
      { "forca": "Rivalidade entre Concorrentes", "analise": "Intensidade competitiva no território..." },
      { "forca": "Ameaça de Novos Entrantes", "analise": "Barreiras de entrada e capital de giro..." },
      { "forca": "Produtos Substitutos", "analise": "Impacto da evasão para SP/Litoral (66.2%) e e-commerce..." },
      { "forca": "Barganha dos Fornecedores", "analise": "Dependência de fornecedores e prazos..." },
      { "forca": "Barganha dos Clientes", "analise": "Sensibilidade a preço (33.1% reclamam de custo excessivo)..." }
    ]
  },
  "mix_marketing": {
    "cinco_ps": [
      { "p": "Produto", "analise": "Mix de produtos, qualidade e itens de entrada..." },
      { "p": "Preço", "analise": "Estratégia de precificação alinhada à renda familiar..." },
      { "p": "Praça", "analise": "Canais físicos e digitais no território..." },
      { "p": "Promoção", "analise": "Instagram (61.8%) e ativação comunitária..." },
      { "p": "Pessoas", "analise": "Treinamento de atendimento e hospitalidade..." }
    ],
    "oceano_azul": {
      "eliminar": "Custos supérfluos e atritos operacionais sem valor...",
      "reduzir": "Desperdícios e dependência de modelos genéricos...",
      "elevar": "Padrão de atendimento, consistência e curadoria...",
      "criar": "Diferenciais exclusivos conectados à cultura local de SJC..."
    }
  },
  "movimentos_culturais": {
    "analise_cards": {
      "geografia_silencio": "Hipótese de fit com o público de refúgio e sossego (Urbanova/Adyana).",
      "cidade_prometida": "Hipótese de fit com famílias tradicionais (Zona Sul/Colinas).",
      "tribo_global": "Hipótese de fit com o público tech e cosmopolita (Aquarius/Vila Ema).",
      "empreendedorismo_intuitivo": "Hipótese de fit com a economia real de bairro e conveniência (Zona Sul/Leste/Norte)."
    },
    "veredicto_final": {
      "nome_movimento": "A Tribo Global OU Empreendedorismo Intuitivo OU A Cidade Prometida OU A Geografia do Silêncio",
      "justificativa_densa": "Contextualize a proposta explicitamente em um parágrafo denso (60-90 palavras), rotulando a análise como [HIPÓTESE ESTRATÉGICA A VALIDAR]."
    }
  }
}

Você deve retornar a sua resposta EXCLUSIVAMENTE em formato JSON válido. Não inclua nenhum texto adicional.`;

    // 6. Montagem do Payload do Usuário com Separação Estruturada
    const userPayload = {
      idea: combinedInput,
      report_to_audit: reportToAudit || "Nenhum relatório externo fornecido. Audite a ideia diretamente com o dataset_snapshot.",
      instruction: "Audite a proposta usando exclusivamente o dataset_snapshot oficial. Retorne EXCLUSIVAMENTE o JSON estruturado."
    };

    const userPromptText = JSON.stringify(userPayload) + '\n\nVocê deve retornar a sua resposta EXCLUSIVAMENTE em formato JSON válido. Não inclua nenhum texto adicional.';

    // 7. Cascata de Modelos Suportados na Groq
    const candidateModels = [
      'qwen/qwen3.6-27b',
      'qwen/qwen3.8-27b',
      'qwen-2.5-32b',
      'mixtral-8x7b-32768',
      'gemma2-9b-it',
      'llama-3.1-8b-instant',
      'llama3-70b-8192',
      'llama3-8b-8192'
    ];

    let replyContent = null;
    let modelUsed = null;
    const errorsList = [];

    for (const model of candidateModels) {
      const attempts = [
        { response_format: { type: "json_object" } },
        { response_format: undefined }
      ];

      let modelSuccess = false;

      for (const formatOpt of attempts) {
        try {
          const payload = {
            model: model,
            max_tokens: 4000,
            temperature: 0.2,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPromptText }
            ]
          };
          if (formatOpt.response_format) {
            payload.response_format = formatOpt.response_format;
          }

          const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer ' + apiKey,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          });

          if (response.ok) {
            const data = await response.json();
            if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
              replyContent = data.choices[0].message.content;
              modelUsed = model;
              modelSuccess = true;
              break;
            }
          } else {
            const errText = await response.text();
            const errorMsg = 'Groq Status ' + response.status + ' (' + model + '): ' + errText;
            errorsList.push(errorMsg);
            console.warn('[Consultor IA] Tentativa falhou:', errorMsg);
          }
        } catch (err) {
          const errorMsg = 'Exceção (' + model + '): ' + err.message;
          errorsList.push(errorMsg);
          console.warn('[Consultor IA] Exceção:', errorMsg);
        }
      }

      if (modelSuccess) break;
    }

    if (!replyContent) {
      return res.status(500).json({
        error: 'Erro na API da Groq: ' + (errorsList[0] || 'Nenhum modelo respondeu com sucesso.'),
        details: errorsList.join(' | ')
      });
    }

    // 8. Extração e Parse Seguro de JSON
    let jsonResult = null;
    let cleanReply = String(replyContent || '').trim()
      .replace(/^\`\`\`(?:json)?\s*/i, '')
      .replace(/\s*\`\`\`$/i, '')
      .trim();

    const firstBrace = cleanReply.indexOf('{');
    const lastBrace = cleanReply.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      cleanReply = cleanReply.substring(firstBrace, lastBrace + 1).trim();
    }

    try {
      jsonResult = JSON.parse(cleanReply);
    } catch (eJson) {
      const matchJson = String(replyContent).match(/\{[\s\S]*\}/);
      if (matchJson) {
        try { jsonResult = JSON.parse(matchJson[0]); } catch (eSub) {}
      }
    }

    // 9. Validação Programática e Injeção de Dados Garantidos no Backend
    if (jsonResult && typeof jsonResult === 'object') {
      jsonResult = validateAndEnforceOfficialCharts(jsonResult);
    }

    return res.status(200).json({ 
      result: jsonResult || replyContent,
      reply: jsonResult ? JSON.stringify(jsonResult) : cleanReply,
      modelUsed: modelUsed,
      datasetN: DATASET_SNAPSHOT.n
    });

  } catch (error) {
    return res.status(500).json({ 
      error: 'Erro interno no Servidor: ' + error.message,
      details: error.stack || error.message
    });
  }
};
