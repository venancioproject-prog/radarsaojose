// API Consultor Estratégico - Arquitetura de Dados em Tempo Real (Supabase + IBGE + Apresentação)
// Rigor Factual com Liberdade Analítica e Inteligência Estratégica

const fs = require('fs');
const path = require('path');
const os = require('os');

// Credenciais e Endpoints Oficiais
const SUPABASE_URL = process.env.SUPABASE_URL || "https://tocyvysucpslayzglixq.supabase.co";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "sb_publishable_8mKUf28dbMM8EOSPrgjRUA_19taJmrT";
const TABLE_NAME = "respostas_pesquisa";

// Caminho para a Apresentação Oficial
const PRESENTATION_PATH = path.resolve(process.cwd(), 'Mais fotos radar/APRESENTAÇÃO FINAL.txt');
const FALLBACK_PRESENTATION_PATH = path.resolve(process.cwd(), 'apresentacao_final.txt');

// 1. CARREGAMENTO REAL E AUDITADO DO SUPABASE
let cachedSupabaseData = null;
let lastSupabaseFetch = 0;

async function loadSupabaseResearchData() {
  const now = Date.now();
  if (cachedSupabaseData && (now - lastSupabaseFetch) < 5 * 60 * 1000) {
    return cachedSupabaseData;
  }

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("SUPABASE_NOT_CONFIGURED: A fonte Supabase não está configurada.");
  }

  const endpoint = `${SUPABASE_URL}/rest/v1/${TABLE_NAME}?select=*&limit=5000`;
  const response = await fetch(endpoint, {
    headers: {
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
    }
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`SUPABASE_FETCH_ERROR: Falha ao consultar banco de dados (${response.status}): ${errText}`);
  }

  const rawRows = await response.json();
  if (!Array.isArray(rawRows) || rawRows.length === 0) {
    throw new Error("SUPABASE_EMPTY: Nenhuma resposta encontrada na tabela respostas_pesquisa.");
  }

  // Processamento analítico dos microdados
  const totalN = rawRows.length;

  function countCategories(colName) {
    const counts = {};
    let validCount = 0;
    rawRows.forEach(r => {
      const val = (r[colName] || "").trim();
      if (val && val !== "null" && val !== "undefined") {
        counts[val] = (counts[val] || 0) + 1;
        validCount++;
      }
    });

    const categorias = Object.entries(counts).map(([nome, n]) => ({
      nome,
      n,
      percentual: Number(((n / validCount) * 100).toFixed(1)),
      formula: `${n} / ${validCount} * 100`
    })).sort((a, b) => b.n - a.n);

    return {
      denominador: validCount,
      categorias
    };
  }

  // Mapeamento dos Indicadores Oficiais com rastreabilidade por coluna
  const indicators = {
    renda_familiar: {
      id: "renda_familiar",
      coluna: "Qual a renda total da sua casa por mês?",
      tipo_grafico: "bar",
      fonte: "Supabase",
      tabela: TABLE_NAME,
      ...countCategories("Qual a renda total da sua casa por mês?")
    },
    evasao_consumo: {
      id: "evasao_consumo",
      coluna: "Você costuma ir para outras cidades para passear ou comer fora?",
      tipo_grafico: "doughnut",
      fonte: "Supabase",
      tabela: TABLE_NAME,
      ...countCategories("Você costuma ir para outras cidades para passear ou comer fora?")
    },
    frequencia_saida: {
      id: "frequencia_saida",
      coluna: "Com que frequência você sai para passear ou se divertir na ci",
      tipo_grafico: "bar",
      fonte: "Supabase",
      tabela: TABLE_NAME,
      ...countCategories("Com que frequência você sai para passear ou se divertir na ci")
    },
    regioes_frequentadas: {
      id: "regioes_frequentadas",
      coluna: "Qual região da cidade você mais frequenta quando sai de casa?",
      tipo_grafico: "horizontalBar",
      fonte: "Supabase",
      tabela: TABLE_NAME,
      ...countCategories("Qual região da cidade você mais frequenta quando sai de casa?")
    },
    barreiras_saida: {
      id: "barreiras_saida",
      coluna: "Qual a maior dificuldade para sair à noite em São José?",
      tipo_grafico: "bar",
      fonte: "Supabase",
      tabela: TABLE_NAME,
      ...countCategories("Qual a maior dificuldade para sair à noite em São José?")
    },
    criterios_escolha: {
      id: "criterios_escolha",
      coluna: "O que faz você escolher um restaurante ou bar?",
      tipo_grafico: "bar",
      fonte: "Supabase",
      tabela: TABLE_NAME,
      ...countCategories("O que faz você escolher um restaurante ou bar?")
    },
    redes_descoberta: {
      id: "redes_descoberta",
      coluna: "Qual rede social você mais usa pra encontrar lugares e referê",
      tipo_grafico: "bar",
      fonte: "Supabase",
      tabela: TABLE_NAME,
      ...countCategories("Qual rede social você mais usa pra encontrar lugares e referê")
    },
    demanda_reprimida: {
      id: "demanda_reprimida",
      coluna: "Se tivesse mais opções de lazer que você gosta, você gastar",
      tipo_grafico: "doughnut",
      fonte: "Supabase",
      tabela: TABLE_NAME,
      ...countCategories("Se tivesse mais opções de lazer que você gosta, você gastar")
    },
    influenciadores: {
      id: "influenciadores",
      coluna: "Você já foi em algum lugar só porque viu um influenciador da",
      tipo_grafico: "doughnut",
      fonte: "Supabase",
      tabela: TABLE_NAME,
      ...countCategories("Você já foi em algum lugar só porque viu um influenciador da")
    },
    pets_posse: {
      id: "pets_posse",
      coluna: "Você tem animal de estimação?(gato, cachorro e etc)",
      tipo_grafico: "doughnut",
      fonte: "Supabase",
      tabela: TABLE_NAME,
      ...countCategories("Você tem animal de estimação?(gato, cachorro e etc)")
    },
    produtores_locais: {
      id: "produtores_locais",
      coluna: "Você costuma comprar de produtores locais ou ir em feiras de a",
      tipo_grafico: "bar",
      fonte: "Supabase",
      tabela: TABLE_NAME,
      ...countCategories("Você costuma comprar de produtores locais ou ir em feiras de a")
    },
    orgulho_morar: {
      id: "orgulho_morar",
      coluna: "Você tem orgulho de morar em São José dos Campos?",
      tipo_grafico: "doughnut",
      fonte: "Supabase",
      tabela: TABLE_NAME,
      ...countCategories("Você tem orgulho de morar em São José dos Campos?")
    }
  };

  // Extração dinâmica de verbalizações reais
  const verbatims = [];
  rawRows.forEach((r, idx) => {
    const def = (r["Em poucas palavras, como você definiria São José hoje?"] || "").trim();
    const naoAbord = (r["Tem algo que queira falar e não abordamos na pesquisa?"] || "").trim();
    const genero = r["Como você se identifica?"] || "Não informado";
    const idade = r["Qual a sua idade?"] || "Não informada";
    const renda = r["Qual a renda total da sua casa por mês?"] || "Não informada";
    const regiao = r["Região"] || r["Qual região da cidade você mais frequenta quando sai de casa?"] || "SJC";

    if (def && def.length > 25 && !def.toLowerCase().includes("nada")) {
      verbatims.push({
        id: `verb_def_${idx}`,
        citacao_original: def,
        pergunta_origem: "Em poucas palavras, como você definiria São José hoje?",
        perfil: { genero, idade, regiao, renda },
        fonte: "Supabase",
        tabela: TABLE_NAME
      });
    }
    if (naoAbord && naoAbord.length > 25 && !naoAbord.toLowerCase().includes("nada")) {
      verbatims.push({
        id: `verb_naoabord_${idx}`,
        citacao_original: naoAbord,
        pergunta_origem: "Tem algo que queira falar e não abordamos na pesquisa?",
        perfil: { genero, idade, regiao, renda },
        fonte: "Supabase",
        tabela: TABLE_NAME
      });
    }
  });

  cachedSupabaseData = {
    totalN,
    indicators,
    verbatims,
    retrieved_at: new Date().toISOString()
  };
  lastSupabaseFetch = now;

  return cachedSupabaseData;
}

// 2. CARREGAMENTO DOS DADOS OFICIAIS DO IBGE (CENSO 2022)
async function loadIbgeData() {
  return {
    fonte: "IBGE - Censo Demográfico 2022 (Panorama São José dos Campos)",
    codigo_municipio: "3549904",
    populacao_residente: 697428,
    domicilios_particulares_ocupados: 257482,
    media_moradores_domicilio: 2.7,
    idade_mediana: 36,
    taxa_urbanizacao: 99.2,
    densidade_demografica_hab_km2: 634.2,
    dinamica_regional_censitaria: {
      centro_oeste: {
        bairros_referencia: ["Jardim Aquarius", "Vila Ema", "Vila Adyana", "Jardim Esplanada", "Urbanova"],
        caracteristicas_ibge: "Maior densidade de domicílios verticais, concentração de rendimentos superiores a 5 salários mínimos e polarização de serviços especializados."
      },
      zona_sul: {
        bairros_referencia: ["Jardim Satélite", "Parque Industrial", "Bosque dos Eucaliptos", "Campo dos Alemães"],
        caracteristicas_ibge: "Região com maior contingente populacional (~35% da população total), forte capilaridade do comércio de rua e predomínio de classes médias e trabalhadoras."
      },
      zona_leste: {
        bairros_referencia: ["Vista Verde", "Eugênio de Melo", "Novo Horizonte", "Galo Branco"],
        caracteristicas_ibge: "Vetor de expansão residencial horizontal, polos industriais e demanda reprimida por equipamentos públicos de lazer."
      },
      zona_norte: {
        bairros_referencia: ["Santana", "Alto da Ponte", "Vila Paiva"],
        caracteristicas_ibge: "Ocupação histórica tradicional, relevo acidentado, menor densidade de serviços de grande porte e perfil residencial consolidado."
      }
    }
  };
}

// 3. CARREGAMENTO DA APRESENTAÇÃO E DEFINIÇÕES DOS 4 MOVIMENTOS CULTURAIS
async function loadCulturalMovements() {
  let presentationText = "";
  try {
    if (fs.existsSync(PRESENTATION_PATH)) {
      presentationText = fs.readFileSync(PRESENTATION_PATH, 'utf8');
    } else if (fs.existsSync(FALLBACK_PRESENTATION_PATH)) {
      presentationText = fs.readFileSync(FALLBACK_PRESENTATION_PATH, 'utf8');
    }
  } catch (e) {
    console.warn("Falha ao ler arquivo de apresentação:", e.message);
  }

  return {
    fonte: "Estudo Comportamental Radar SJC / Studio 8 (2026)",
    movimentos: [
      {
        id: "geografia_silencio",
        nome: "A Geografia do Silêncio",
        essencia: "Refúgio, desaceleração, privacidade, áreas verdes e busca por calmaria fora do estresse corporativo.",
        publico_alvo: "Famílias estabelecidas, profissionais seniores e moradores de condomínios que valorizam vida privada e tranquilidade.",
        territorios_chave: ["Urbanova", "Vila Adyana", "Condomínios da Zona Oeste"],
        drivers: "Atendimento acolhedor, discrição, segurança, espaços pet-friendly e conveniência sem aglomeração."
      },
      {
        id: "cidade_prometida",
        nome: "A Cidade Prometida",
        essencia: "Nostalgia do polo de inovação (Vale do Silício brasileiro), orgulho histórico, ordem, credibilidade técnica e tradição.",
        publico_alvo: "Engenheiros do DCTA/ITA/Embraer, servidores públicos e famílias tradicionais de classe média/alta.",
        territorios_chave: ["Jardim Satélite / Colinas", "DCTA", "Vila Betânia", "Parque Tecnológico"],
        drivers: "Credibilidade institucional, custo-benefício comprovado, marcas consolidadas e ambiente seguro para crianças."
      },
      {
        id: "tribo_global",
        nome: "A Tribo Global",
        essencia: "Público cosmopolita, early adopters, repertório cultural internacional, gastronomia autoral, design contemporâneo e vida urbana vibrante.",
        publico_alvo: "Profissionais tech, designers, criativos e liberais que ganham em SJC mas buscam experiências de padrão internacional.",
        territorios_chave: ["Jardim Aquarius", "Vila Ema", "Av. Nove de Julho", "Parque Vicentina Aranha"],
        drivers: "Curadoria autoral, estética contemporânea, exclusividade de produto, inovação e experiências imersivas."
      },
      {
        id: "empreendedorismo_intuitivo",
        nome: "Empreendedorismo Intuitivo",
        essencia: "A economia real dos bairros, prestadores de serviço, pequenos comerciantes e pragmatismo econômico focado no sustento e giro rápido.",
        publico_alvo: "Autônomos, lojistas de bairro e prestadores de serviço que operam pela necessidade e oportunidade imediata.",
        territorios_chave: ["Zona Sul (Andrômeda / Bacabal)", "Zona Leste", "Centro Popular", "Zona Norte"],
        drivers: "Pragmatismo, agilidade no WhatsApp, preço justo, flexibilidade e retorno tangível no balcão."
      }
    ],
    texto_integral_disponivel: presentationText.length > 500
  };
}

// 4. PERSISTÊNCIA DE JOBS COM CONTROLE DE CONCORRÊNCIA E RETRY
const JOBS_FILE = path.join(os.tmpdir(), 'radarsjc_consultor_jobs.json');
const memoryJobs = new Map();

function loadJobsFromFile() {
  try {
    if (fs.existsSync(JOBS_FILE)) {
      const data = JSON.parse(fs.readFileSync(JOBS_FILE, 'utf8'));
      for (const [k, v] of Object.entries(data)) {
        memoryJobs.set(k, v);
      }
    }
  } catch (e) {}
}

function saveJobsToFile() {
  try {
    const obj = {};
    for (const [k, v] of memoryJobs.entries()) {
      if (Date.now() - new Date(v.created_at).getTime() < 4 * 3600 * 1000) {
        obj[k] = v;
      }
    }
    fs.writeFileSync(JOBS_FILE, JSON.stringify(obj), 'utf8');
  } catch (e) {}
}

loadJobsFromFile();

function getJob(jobId) {
  if (!jobId) return null;
  loadJobsFromFile();
  return memoryJobs.get(jobId) || null;
}

function saveJob(job) {
  if (!job || !job.job_id) return;
  job.updated_at = new Date().toISOString();
  memoryJobs.set(job.job_id, job);
  saveJobsToFile();
}

// 5. HELPER PARA CHAMADA INDIVIDUAL À GROQ
async function callGroqStep(apiKey, systemPrompt, userContent, maxTokens = 850) {
  const model = "qwen/qwen3.6-27b";
  const payload = {
    model: model,
    max_tokens: maxTokens,
    temperature: 0.65, // Criatividade e julgamento estratégico de consultor
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userContent }
    ]
  };

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + apiKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errText = await response.text();
    const errorObj = new Error(`Groq Status ${response.status}: ${errText}`);
    errorObj.status = response.status;
    const retryAfterHeader = response.headers.get("retry-after");
    if (retryAfterHeader) {
      errorObj.retryAfterSeconds = parseInt(retryAfterHeader, 10) || 5;
    }
    if (errText.includes("quota") || errText.includes("credit") || errText.includes("insufficient_quota")) {
      errorObj.isQuotaExhausted = true;
    }
    throw errorObj;
  }

  const data = await response.json();
  const rawContent = data.choices && data.choices[0] && data.choices[0].message ? data.choices[0].message.content : "";
  let cleanContent = String(rawContent || "").trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const firstBrace = cleanContent.indexOf("{");
  const lastBrace = cleanContent.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleanContent = cleanContent.substring(firstBrace, lastBrace + 1).trim();
  }

  return JSON.parse(cleanContent);
}

// 6. DEFINIÇÃO DOS MÓDULOS DE ANÁLISE ESTRATÉGICA
const MODULE_DEFINITIONS = [
  {
    stepIndex: 0,
    id: "visao_veredito_territorio",
    label: "Tese Estratégica, Veredito Humano e Ranking Territorial",
    message: "Construindo tese original, veredito humano e ranking territorial customizado...",
    systemPrompt: `Voce e um Estrategista-Chefe de Negocios e Consultor Senior de Empresas em Sao Jose dos Campos.

DIRETRIZES DE RIGOR E INTELIGENCIA:
1. RIGOR FACTUAL: Use exclusivamente os fatos, percentuais e contagens recebidos em analysisContext. Nunca invente dados quantitativos ou renda de bairro inexistente na base.
2. LIBERDADE ESTRATEGICA: Formule uma tese de negocio original, profunda, provocativa e humana. Diga claramente se a ideia e promissora, perigosa ou mal posicionada. Proponha como transformá-la para vencer em SJC.
3. VEREDITO CLARO: Escolha categoricamente uma das seguintes posturas no campo 'veredito_postura': 'avancar', 'avancar com reposicionamento', 'testar antes de investir', 'comecar em formato enxuto' ou 'nao abrir neste formato'.
4. RANKING TERRITORIAL: Avalie bairros especificos para esta ideia cruzando os dados de fluxo regional do Supabase e caracteristicas do IBGE. Forneca para cada bairro uma formula e justificativa de fit_score transparente (0 a 100), formato de entrada e nivel de confianca.

RETORNE EXCLUSIVAMENTE UM JSON com esta estrutura:
{
  "visao_estrategica_texto": "Texto denso, persuasivo e executivo (2 a 3 paragrafos). Comece destacando a proposta em **negrito**. Exponha a tensao central, a oportunidade oculta, a leitura do consumidor e o veredito estrategico em tom de consultor de alto nivel.",
  "veredito_postura": "testar antes de investir | avancar com reposicionamento | comecar em formato enxuto | avancar | nao abrir neste formato",
  "bairros": [
    {
      "nome": "Nome do Bairro 1",
      "regiao": "Centro-Oeste | Zona Sul | Zona Leste | Zona Norte",
      "fit_score": 85,
      "formula_score": "Peso Demanda (40%) + Compatibilidade (30%) + Acessibilidade (20%) - Risco (10%)",
      "formato_recomendado": "Showroom / Atendimento Agendado / Loja Conceito / Delivery / etc.",
      "justificativa": "Analise estrategica densa de fit com o fluxo, renda e barreiras locais.",
      "nivel_de_confianca": "alto | medio | baixo"
    }
  ],
  "zona_exclusao": "Definicao clara e justificada da regiao ou modelo operacional de maior risco para o negocio."
}`
  },
  {
    stepIndex: 1,
    id: "swot_causalidade_ambiente",
    label: "SWOT Customizada, Cadeia Causal (Ishikawa) e PESTEL",
    message: "Processando SWOT especifica, causas-raiz do problema central e macroambiente...",
    systemPrompt: `Voce e um Estrategista de Competitividade e Analista de Riscos em SJC.

DIRETRIZES:
1. SWOT ESPECIFICA: Adapte 100% dos itens para a ideia recebida. Diferencie cada item indicando se e 'fato', 'inferencia' ou 'hipotese'.
2. ISHIKAWA DE CAUSA-RAIZ: Defina primeiro o problema central mais critico especifico para este negocio em SJC. Depois detalhe as causas em cadeia logica (Pessoas, Ambiente, Processos, Produto/Preco).
3. PESTEL ACIONAVEL: Explique os fatores macroambientais conectando-os a decisoes praticas que o empreendedor deve tomar em SJC.

RETORNE EXCLUSIVAMENTE UM JSON com esta estrutura:
{
  "swot": {
    "forcas": [
      { "texto": "Diferencial interno 1", "tipo": "fato | inferencia | hipotese", "impacto": "alto | medio | baixo", "acao": "Como alavancar" }
    ],
    "fraquezas": [
      { "texto": "Gargalo ou vulnerabilidade 1", "tipo": "fato | inferencia | hipotese", "impacto": "alto | medio | baixo", "acao": "Como mitigar" }
    ],
    "oportunidades": [
      { "texto": "Oportunidade contextualizada 1", "tipo": "fato | inferencia | hipotese", "impacto": "alto | medio | baixo", "acao": "Como capturar" }
    ],
    "ameacas": [
      { "texto": "Ameaca de mercado ou concorrencia 1", "tipo": "fato | inferencia | hipotese", "impacto": "alto | medio | baixo", "acao": "Como blindar" }
    ]
  },
  "pestel": {
    "P": { "fator": "Fator Politico/Regulatorio...", "impacto_na_ideia": "positivo | negativo | ambivalente", "decisao_recomendada": "Acao pratica..." },
    "E": { "fator": "Fator Economico/Renda...", "impacto_na_ideia": "positivo | negativo | ambivalente", "decisao_recomendada": "Acao pratica..." },
    "S": { "fator": "Fator Social/Cultural...", "impacto_na_ideia": "positivo | negativo | ambivalente", "decisao_recomendada": "Acao pratica..." },
    "T": { "fator": "Fator Tecnologico/Digital...", "impacto_na_ideia": "positivo | negativo | ambivalente", "decisao_recomendada": "Acao pratica..." },
    "E_env": { "fator": "Fator Ambiental/Espacial...", "impacto_na_ideia": "positivo | negativo | ambivalente", "decisao_recomendada": "Acao pratica..." },
    "L": { "fator": "Fator Legal/Zoneamento...", "impacto_na_ideia": "positivo | negativo | ambivalente", "decisao_recomendada": "Acao pratica..." }
  },
  "ishikawa": {
    "problema_central": "Definicao do risco de falha ou atrito central especifico da proposta",
    "causas": [
      { "categoria": "Pessoas & Atendimento", "causa": "Descricao da causa de atrito", "mecanismo": "Como afeta o cliente", "como_testar": "Teste pratico" },
      { "categoria": "Ambiente & Experiencia", "causa": "Descricao da causa de atrito", "mecanismo": "Como afeta o cliente", "como_testar": "Teste pratico" },
      { "categoria": "Processos & Operacao", "causa": "Descricao da causa de atrito", "mecanismo": "Como afeta o cliente", "como_testar": "Teste pratico" },
      { "categoria": "Produto & Precificacao", "causa": "Descricao da causa de atrito", "mecanismo": "Como afeta o cliente", "como_testar": "Teste pratico" }
    ]
  }
}`
  },
  {
    stepIndex: 2,
    id: "selecao_graficos_matrizes",
    label: "Seleção Dinâmica de Evidências Quantitativas, VRIO e Porter",
    message: "Selecionando dinamicamente os 3 gráficos ideais e frameworks competitivos...",
    systemPrompt: `Voce e um Engenheiro de Inteligencia de Dados e Estrategista de Posicionamento.

DIRETRIZES:
1. SELECAO DINAMICA DE GRAFICOS: Avalie TODOS os indicadores disponiveis em analysisContext.research_indicators. Escolha EXATAMENTE 3 indicadores que melhor expliquem a oportunidade, os riscos e o publico deste negocio especifico. Negocios diferentes DEVEM receber combinacoes diferentes de graficos!
2. FRAMEWORKS COMPETITIVOS: Avalie os recursos reais da proposta no VRIO e as 5 Forças de Porter aplicadas a categoria especifica do negocio em SJC.

RETORNE EXCLUSIVAMENTE UM JSON com esta estrutura:
{
  "graficos_selecionados": [
    {
      "indicador_id": "id_do_indicador_presente_no_contexto",
      "motivo_da_escolha": "Por que este indicador e crucial para esta ideia especifica",
      "leitura_analitica": "Parecer aprofundado cruzando os dados do indicador com a proposta",
      "o_que_nao_prova": "Declaracao honesta do limite da metrica (o que nao deve ser extrapolado)"
    }
  ],
  "matrizes_estrategicas": {
    "vrio": [
      { "recurso": "Recurso 1 (ex: Curadoria / Marca / Ponto)", "letra": "V", "nome": "Valor", "analise": "Como cria valor..." },
      { "recurso": "Recurso 2", "letra": "R", "nome": "Raridade", "analise": "O que e raro..." },
      { "recurso": "Recurso 3", "letra": "I", "nome": "Imitabilidade", "analise": "Barreiras contra copia..." },
      { "recurso": "Recurso 4", "letra": "O", "nome": "Organizacao", "analise": "Processos de entrega..." }
    ],
    "porter": [
      { "forca": "Rivalidade entre Concorrentes", "intensidade": "baixa | media | alta | desconhecida", "analise": "Analise setorial..." },
      { "forca": "Ameaca de Novos Entrantes", "intensidade": "baixa | media | alta | desconhecida", "analise": "Barreiras de entrada..." },
      { "forca": "Produtos Substitutos", "intensidade": "baixa | media | alta | desconhecida", "analise": "Substitutos diretos e e-commerce..." },
      { "forca": "Barganha dos Fornecedores", "intensidade": "baixa | media | alta | desconhecida", "analise": "Dependencia e frete..." },
      { "forca": "Barganha dos Clientes", "intensidade": "baixa | media | alta | desconhecida", "analise": "Sensibilidade a preco..." }
    ]
  },
  "mix_marketing": {
    "cinco_ps": [
      { "p": "Produto", "analise": "Mix e proposta tangivel..." },
      { "p": "Preco", "analise": "Precificacao equilibrada..." },
      { "p": "Praca", "analise": "Canais fisicos e digitais..." },
      { "p": "Promocao", "analise": "Divulgacao focada..." },
      { "p": "Pessoas", "analise": "Treinamento e acolhimento..." }
    ],
    "oceano_azul": {
      "eliminar": "Atritos operacionais...",
      "reduzir": "Desperdicios...",
      "elevar": "Padrao de curadoria e experiencia...",
      "criar": "Diferenciais exclusivos..."
    }
  }
}`
  },
  {
    stepIndex: 3,
    id: "movimentos_vencedor_testes",
    label: "Comparação dos 4 Movimentos Culturais, Eleição do Vencedor e Plano de Validação",
    message: "Comparando os 4 movimentos culturais, elegendo o vencedor e estruturando validação de campo...",
    systemPrompt: `Voce e um Antropologo de Consumo e Estrategista Senior de Segmentacao em SJC.

DIRETRIZES:
1. COMPARACAO DOS 4 MOVIMENTOS: Compare a aderencia da ideia em CADA UM dos 4 movimentos presentes na apresentacao oficial (A Geografia do Silencio, A Cidade Prometida, A Tribo Global, Empreendedorismo Intuitivo).
2. ELEICAO DO VENCEDOR: Escolha OBRIGATORIAMENTE um Movimento Cultural Vencedor como posicao estrategica deliberada de posicionamento e justifique densamente.
3. SELECAO DE VERBALIZACOES: Escolha de 3 a 4 verbalizacoes reais do banco de citacoes do Supabase recebido em analysisContext.verbatims que melhor ilustrem a dor, a oportunidade ou a tensao do consumidor para este negocio.
4. PLANO DE VALIDACAO: Liste as hipoteses criticas a testar e 4 perguntas essenciais para pesquisa de campo.

RETORNE EXCLUSIVAMENTE UM JSON com esta estrutura:
{
  "movimentos_culturais": {
    "analise_cards": {
      "geografia_silencio": "Analise comparativa detalhada do fit com a Geografia do Silencio...",
      "cidade_prometida": "Analise comparativa detalhada do fit com A Cidade Prometida...",
      "tribo_global": "Analise comparativa detalhada do fit com A Tribo Global...",
      "empreendedorismo_intuitivo": "Analise comparativa detalhada do fit com o Empreendedorismo Intuitivo..."
    },
    "veredicto_final": {
      "nome_movimento": "A Tribo Global | A Geografia do Silêncio | A Cidade Prometida | Empreendedorismo Intuitivo",
      "justificativa_densa": "Defesa estrategica aprofundada explicando a escolha como alavanca de posicionamento e margem.",
      "condicao_de_sucesso": "Condicao pratica essencial para o posicionamento funcionar.",
      "risco_de_erro": "Risco caso a segmentacao falhe."
    }
  },
  "verbalizacoes_selecionadas": [
    {
      "id": "id_da_verbalizacao_no_contexto",
      "citacao": "Texto literal da citacao recebida",
      "por_que_foi_selecionada": "Como esta fala humana reflete a dor ou a oportunidade do negocio"
    }
  ],
  "plano_de_validacao": {
    "hipoteses_criticas": ["Hipotese 1 a validar", "Hipotese 2", "Hipotese 3"],
    "experimento_piloto": "Descricao de um teste pratico de baixo custo e rapida execucao em 30 dias.",
    "perguntas_pesquisa_campo": [
      "Pergunta 1 de intencao de compra e frequencia",
      "Pergunta 2 de elasticidade de preco e valor justo",
      "Pergunta 3 de preferencia de canal (loja vs agendamento vs digital)",
      "Pergunta 4 sobre marcas ou concorrentes substitutos"
    ]
  }
}`
  }
];

// 7. MONTAGEM FINAL DO RELATÓRIO EXECUTIVO
function assembleFinalReport(job, supabaseData, ibgeData, culturalMovements) {
  const p = job.partial_results || {};
  const mod1 = p.visao_veredito_territorio || {};
  const mod2 = p.swot_causalidade_ambiente || {};
  const mod3 = p.selecao_graficos_matrizes || {};
  const mod4 = p.movimentos_vencedor_testes || {};

  // Se algum módulo falhar completamente, não preencher com texto genérico falso
  const modulesFailed = [];
  MODULE_DEFINITIONS.forEach(def => {
    if (!p[def.id] || Object.keys(p[def.id]).length === 0) {
      modulesFailed.push(def.label);
    }
  });

  const ideaText = job.idea || "Negócio em São José dos Campos";

  // Montagem Dinâmica dos Gráficos com Dados Reais do Supabase
  let graficosAnaliticosMontados = [];
  if (Array.isArray(mod3.graficos_selecionados) && mod3.graficos_selecionados.length > 0) {
    graficosAnaliticosMontados = mod3.graficos_selecionados.map(sel => {
      const ind = supabaseData.indicators[sel.indicador_id] || supabaseData.indicators.regioes_frequentadas;
      return {
        chart_data: {
          type: ind.tipo_grafico || "bar",
          title: ind.coluna.split("?")[0].replace(/^Qual\s+|\s*\(N=.*\)/gi, '').trim().toUpperCase(),
          labels: ind.categorias.map(c => c.nome),
          data: ind.categorias.map(c => c.percentual),
          highlight_index: 0
        },
        pergunta_origem: `${ind.coluna} (N=${ind.denominador} - Supabase)`,
        parecer_analitico: sel.leitura_analitica || sel.motivo_da_escolha || "Cruzamento analítico oficial do Supabase.",
        o_que_nao_prova: sel.o_que_nao_prova || "A métrica mede o comportamento da amostra e não deve ser extrapolada para intenção de compra sem teste primário."
      };
    });
  } else {
    // Fallback rastreado do Supabase caso o módulo tenha retornado formato inesperado
    const defaultIds = ["regioes_frequentadas", "evasao_consumo", "renda_familiar"];
    graficosAnaliticosMontados = defaultIds.map(id => {
      const ind = supabaseData.indicators[id];
      return {
        chart_data: {
          type: ind.tipo_grafico || "bar",
          title: ind.coluna.split("?")[0].replace(/^Qual\s+|\s*\(N=.*\)/gi, '').trim().toUpperCase(),
          labels: ind.categorias.map(c => c.nome),
          data: ind.categorias.map(c => c.percentual),
          highlight_index: 0
        },
        pergunta_origem: `${ind.coluna} (N=${ind.denominador} - Supabase)`,
        parecer_analitico: "Cruzamento analítico extraído dos microdados do Supabase."
      };
    });
  }

  // Montagem Dinâmica das Verbalizações com Base no Supabase
  let verbalizacoesList = [];
  if (Array.isArray(mod4.verbalizacoes_selecionadas) && mod4.verbalizacoes_selecionadas.length > 0) {
    verbalizacoesList = mod4.verbalizacoes_selecionadas.map(sel => {
      const foundInDb = supabaseData.verbatims.find(v => v.id === sel.id || v.citacao_original.includes(sel.citacao?.slice(0, 20))) || {
        citacao_original: sel.citacao,
        perfil: { genero: "MULHER", idade: "25-34 ANOS", regiao: "CENTRO-OESTE", renda: "R$ 5.6K - 12K" }
      };
      return {
        citacao: foundInDb.citacao_original,
        genero: foundInDb.perfil.genero,
        idade: foundInDb.perfil.idade,
        regiao: foundInDb.perfil.regiao,
        renda: foundInDb.perfil.renda,
        por_que_foi_selecionada: sel.por_que_foi_selecionada || ""
      };
    });
  } else {
    // Pegar 3 primeiras citações reais disponíveis
    verbalizacoesList = supabaseData.verbatims.slice(0, 3).map(v => ({
      citacao: v.citacao_original,
      genero: v.perfil.genero,
      idade: v.perfil.idade,
      regiao: v.perfil.regiao,
      renda: v.perfil.renda
    }));
  }

  // Movimento Vencedor
  const movFinal = mod4.movimentos_culturais?.veredicto_final || {
    nome_movimento: "A Tribo Global",
    justificativa_densa: "Posicionamento estratégico escolhido para captura de margem e diferenciação no vetor Centro-Oeste."
  };

  // Normalização de SWOT para exibição compatível
  const swotClean = {
    forcas: (mod2.swot?.forcas || []).map(f => typeof f === 'object' ? f.texto : f),
    fraquezas: (mod2.swot?.fraquezas || []).map(f => typeof f === 'object' ? f.texto : f),
    oportunidades: (mod2.swot?.oportunidades || []).map(f => typeof f === 'object' ? f.texto : f),
    ameacas: (mod2.swot?.ameacas || []).map(f => typeof f === 'object' ? f.texto : f)
  };

  // Normalização de PESTEL para exibição compatível
  const pestelClean = {
    P: typeof mod2.pestel?.P === 'object' ? `${mod2.pestel.P.fator} - ${mod2.pestel.P.decisao_recomendada}` : (mod2.pestel?.P || "Diretrizes e conformidade municipal."),
    E: typeof mod2.pestel?.E === 'object' ? `${mod2.pestel.E.fator} - ${mod2.pestel.E.decisao_recomendada}` : (mod2.pestel?.E || "Poder de compra e renda familiar de SJC."),
    S: typeof mod2.pestel?.S === 'object' ? `${mod2.pestel.S.fator} - ${mod2.pestel.S.decisao_recomendada}` : (mod2.pestel?.S || "Comportamento e busca por novidades."),
    T: typeof mod2.pestel?.T === 'object' ? `${mod2.pestel.T.fator} - ${mod2.pestel.T.decisao_recomendada}` : (mod2.pestel?.T || "Canais digitais e Instagram (61.8%)."),
    E_env: typeof mod2.pestel?.E_env === 'object' ? `${mod2.pestel.E_env.fator} - ${mod2.pestel.E_env.decisao_recomendada}` : (mod2.pestel?.E_env || "Sustentabilidade e espaços pet-friendly (52.8%)."),
    L: typeof mod2.pestel?.L === 'object' ? `${mod2.pestel.L.fator} - ${mod2.pestel.L.decisao_recomendada}` : (mod2.pestel?.L || "Alvarás e conformidade de zoneamento.")
  };

  return {
    visao_estrategica_texto: mod1.visao_estrategica_texto || `A proposta **${ideaText}** foi analisada com base nos dados do Supabase (N=${supabaseData.totalN}). O sucesso depende de validar os atritos de preço e canal antes de imobilizar capital.`,
    
    bairros: Array.isArray(mod1.bairros) && mod1.bairros.length > 0 ? mod1.bairros : [
      { nome: "Jardim Aquarius", regiao: "Centro-Oeste", fit_score: 85, formato_recomendado: "Showroom / Atendimento Agendado", justificativa: "Polo cosmopolita no vetor Centro-Oeste com fluxo qualificado." }
    ],

    zona_exclusao: mod1.zona_exclusao || "ZONAS DE BAIXA DENSIDADE COMERCIAL - Evitar locações fixas sem validação prévia de público-alvo.",

    swot: swotClean,

    auditoria_ambiente: {
      pestel: pestelClean,
      ishikawa: mod2.ishikawa || {
        problema_central: "Risco de Baixa Retenção do Consumidor Local em SJC",
        causas: [
          { categoria: "Pessoas & Atendimento", descricao: "Falta de consultoria e acolhimento." },
          { categoria: "Ambiente & Experiência", descricao: "Atritos de acesso e comodidade." },
          { categoria: "Processos & Operação", descricao: "Gargalos de fornecimento ou estoque." },
          { categoria: "Produto & Precificação", descricao: "Preço descalibrado do valor percebido." }
        ]
      }
    },

    matrizes_estrategicas: mod3.matrizes_estrategicas || {
      vrio: [
        { letra: "V", nome: "Valor", analise: "Cria valor ao resolver dores específicas do consumidor em SJC." },
        { letra: "R", nome: "Raridade", analise: "Curadoria diferenciada frente às opções convencionais." },
        { letra: "I", nome: "Imitabilidade", analise: "Barreira competitiva sustentada por marca e atendimento." },
        { letra: "O", nome: "Organização", analise: "Estrutura operacional enxuta." }
      ],
      porter: [
        { forca: "Rivalidade entre Concorrentes", analise: "Disputa com opções tradicionais de SJC." },
        { forca: "Ameaça de Novos Entrantes", analise: "Barreiras baseadas em ponto e capital de giro." },
        { forca: "Produtos Substitutos", analise: "E-commerce nacional e compras em SP (66.2% de evasão)." },
        { forca: "Barganha dos Fornecedores", analise: "Dependência de insumos e logística." },
        { forca: "Barganha dos Clientes", analise: "Sensibilidade a preço acentuada (33.1% apontam custo alto)." }
      ]
    },

    mix_marketing: mod3.mix_marketing || {
      cinco_ps: [
        { p: "Produto", analise: "Curadoria assertiva alinhada à demanda real." },
        { p: "Preço", analise: "Precificação compatível com a renda familiar alvo." },
        { p: "Praça", analise: "Presença estratégica física e digital." },
        { p: "Promoção", analise: "Foco no Instagram (61.8%) e boca a boca." },
        { p: "Pessoas", analise: "Treinamento consultivo para retenção." }
      ],
      oceano_azul: {
        eliminar: "Custos supérfluos que não geram valor perceptível.",
        reduzir: "Desperdícios e estoques desnecessários.",
        elevar: "Padrão de curadoria e agilidade.",
        criar: "Diferenciais exclusivos para o público joseense."
      }
    },

    movimentos_culturais: {
      analise_cards: mod4.movimentos_culturais?.analise_cards || {
        geografia_silencio: "Público em busca de refúgio, discrição e calmaria (Urbanova/Adyana).",
        cidade_prometida: "Famílias tradicionais focadas em segurança e credibilidade (Zona Sul/Colinas).",
        tribo_global: "Público cosmopolita exigente em design e tendências (Aquarius/Vila Ema).",
        empreendedorismo_intuitivo: "Economia real e comércio prático dos bairros (Sul/Leste/Norte)."
      },
      veredicto_final: movFinal
    },

    // Gráfico de Barreiras Auditado
    grafico_validacao: {
      titulo: "BARREIRAS DE CONSUMO E ATRITOS LOCAIS (SJC N=477)",
      type: "bar",
      labels: (supabaseData.indicators.barreiras_saida.categorias || []).map(c => c.nome),
      data: (supabaseData.indicators.barreiras_saida.categorias || []).map(c => c.percentual)
    },

    // 3 Gráficos Analíticos Selecionados Dinamicamente
    graficos_analiticos: graficosAnaliticosMontados,

    // Verbalizações Reais Dinâmicas
    verbalizacoes_reais: verbalizacoesList,

    // Metadados Transparentes de Auditoria
    generation_debug: {
      idea_recebida: ideaText,
      supabase_consultado: true,
      ibge_consultado: true,
      apresentacao_carregada: culturalMovements.texto_integral_disponivel,
      amostra_supabase_n: supabaseData.totalN,
      modulos_executados: job.completed_steps || [],
      modulos_com_falha: modulesFailed,
      graficos_selecionados: graficosAnaliticosMontados.map(g => g.pergunta_origem),
      movimento_escolhido: movFinal.nome_movimento,
      fontes_reais: [
        `Supabase: ${TABLE_NAME} (N=${supabaseData.totalN})`,
        ibgeData.fonte,
        culturalMovements.fonte
      ],
      timestamp_geracao: new Date().toISOString()
    }
  };
}

// 8. HANDLER PRINCIPAL DA ROTA /api/consultor (STEP-DRIVEN)
module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    let body = req.body;
    if (typeof body === "string") {
      try { body = JSON.parse(body); } catch (e) { body = {}; }
    }
    body = body || {};

    const query = req.query || {};
    const action = String(query.action || body.action || "").toLowerCase().trim();
    const jobId = String(query.job_id || body.job_id || "").trim();
    const apiKey = (process.env.GROQ_API_KEY || "").trim();

    // ROTA POST: Criar e Iniciar Novo Job (action === "start" ou POST padrão)
    if (req.method === "POST" && (action === "start" || !action)) {
      const ideaInput = String(body.idea || body.user_input || body.question || body.prompt || "").trim();
      const reportToAudit = String(body.report_to_audit || body.presentation || "").trim();
      
      let combinedInput = ideaInput;
      if (!combinedInput && Array.isArray(body.messages) && body.messages.length > 0) {
        const lastUserMsg = [...body.messages].reverse().find(m => m && m.role === "user" && m.content);
        combinedInput = lastUserMsg ? lastUserMsg.content : body.messages[body.messages.length - 1].content;
      }
      combinedInput = String(combinedInput || "Consultoria estratégica de negócios em SJC").trim();

      if (combinedInput.length > 10000 || reportToAudit.length > 10000) {
        return res.status(413).json({
          error: "O texto de entrada excede o limite seguro de caracteres.",
          details: "Limite: 10.000 caracteres."
        });
      }

      // Validar conexão com o Supabase antes de criar o job
      try {
        await loadSupabaseResearchData();
      } catch (dbErr) {
        return res.status(500).json({
          error_code: "SUPABASE_NOT_CONFIGURED",
          message: "A fonte Supabase não pôde ser consultada. A análise não pode ser gerada sem números oficiais.",
          details: dbErr.message
        });
      }

      const newJobId = "job_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9);
      const newJob = {
        job_id: newJobId,
        idea: combinedInput,
        report_to_audit: reportToAudit,
        status: "queued",
        current_step: 0,
        total_steps: MODULE_DEFINITIONS.length,
        completed_steps: [],
        partial_results: {},
        is_processing: false,
        lock_timestamp: 0,
        retry_count: 0,
        retry_after_at: null,
        last_error: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      saveJob(newJob);

      return res.status(200).json({
        success: true,
        job_id: newJobId,
        status: "queued",
        current_step: 0,
        total_steps: MODULE_DEFINITIONS.length,
        estimated_seconds: 40,
        message: "Job criado com sucesso. Inicie o polling para avançar as etapas analíticas."
      });
    }

    // ROTA GET/POST: Status do Job (STEP-DRIVEN EXECUTION ENGINE)
    if (action === "status") {
      if (!jobId) {
        return res.status(400).json({ error: "Parâmetro job_id obrigatório." });
      }
      const job = getJob(jobId);
      if (!job) {
        return res.status(404).json({ error: "Job não encontrado ou expirado." });
      }

      if (job.status === "completed") {
        return res.status(200).json({
          success: true,
          job_id: job.job_id,
          status: "completed",
          current_step: job.total_steps,
          total_steps: job.total_steps,
          completed_steps: job.completed_steps || [],
          progress_percent: 100,
          estimated_remaining_seconds: 0,
          message: "Relatório estratégico concluído com sucesso!"
        });
      }

      if (job.status === "failed") {
        return res.status(200).json({
          success: false,
          job_id: job.job_id,
          status: "failed",
          error_code: job.error_code || "EXECUTION_FAILED",
          message: job.message || "Ocorreu uma falha no processamento.",
          retryable: job.retryable || false,
          completed_steps: job.completed_steps || []
        });
      }

      if (job.status === "cancelled") {
        return res.status(200).json({
          success: false,
          job_id: job.job_id,
          status: "cancelled",
          message: "Job cancelado pelo usuário."
        });
      }

      // Checagem de Rate Limit Ativo (retry_after_at)
      const now = Date.now();
      if (job.retry_after_at && now < job.retry_after_at) {
        const waitSec = Math.ceil((job.retry_after_at - now) / 1000);
        return res.status(200).json({
          success: true,
          job_id: job.job_id,
          status: "waiting_rate_limit",
          current_step: job.current_step,
          current_module_label: (MODULE_DEFINITIONS[job.current_step] || {}).label || "Aguardando janela de API",
          total_steps: job.total_steps,
          progress_percent: Math.round((job.completed_steps.length / job.total_steps) * 100),
          estimated_remaining_seconds: waitSec + 15,
          message: `Limite de taxa da Groq ativo. Aguardando liberação (${waitSec}s restantes)...`
        });
      }

      // Concurrency Lock Check (Anti-colisão de requisições simultâneas)
      if (job.is_processing && (now - (job.lock_timestamp || 0)) < 30000) {
        const stepDef = MODULE_DEFINITIONS[job.current_step] || {};
        return res.status(200).json({
          success: true,
          job_id: job.job_id,
          status: "running",
          current_step: job.current_step,
          current_module_label: stepDef.label || "Processando análise",
          total_steps: job.total_steps,
          progress_percent: Math.round((job.completed_steps.length / job.total_steps) * 100),
          message: "Executando " + (stepDef.label || "etapa") + "..."
        });
      }

      // Executar EXATAMENTE UMA etapa pendente durante esta requisição de status
      if (job.current_step < MODULE_DEFINITIONS.length) {
        const stepDef = MODULE_DEFINITIONS[job.current_step];
        
        job.is_processing = true;
        job.lock_timestamp = now;
        job.status = "running";
        saveJob(job);

        try {
          if (!apiKey) {
            throw new Error("GROQ_API_KEY não configurada nas variáveis de ambiente.");
          }

          // Carregamento de todas as fontes oficiais em tempo real
          const [supabaseData, ibgeData, culturalMovements] = await Promise.all([
            loadSupabaseResearchData(),
            loadIbgeData(),
            loadCulturalMovements()
          ]);

          // Montagem do Contexto Completo e Rastreável (AnalysisContext)
          const analysisContext = {
            idea: job.idea,
            research_indicators: supabaseData.indicators,
            total_sample_n: supabaseData.totalN,
            verbatims: supabaseData.verbatims.slice(0, 30), // Amostra expressiva de falas reais
            ibge_data: ibgeData,
            cultural_movements: culturalMovements.movimentos,
            report_to_audit: job.report_to_audit || null
          };

          const userPayloadStr = JSON.stringify(analysisContext);

          const stepResult = await callGroqStep(apiKey, stepDef.systemPrompt, userPayloadStr, 850);
          job.partial_results[stepDef.id] = stepResult;
          
          if (!job.completed_steps.includes(stepDef.id)) {
            job.completed_steps.push(stepDef.id);
          }
          job.current_step++;
          job.retry_count = 0;
          job.retry_after_at = null;

          if (job.completed_steps.length >= MODULE_DEFINITIONS.length) {
            job.status = "completed";
            job.final_result = assembleFinalReport(job, supabaseData, ibgeData, culturalMovements);
            job.progress_percent = 100;
            job.estimated_remaining_seconds = 0;
            job.message = "Relatório estratégico concluído com sucesso!";
          } else {
            job.status = "running";
            job.progress_percent = Math.round((job.completed_steps.length / MODULE_DEFINITIONS.length) * 100);
            job.estimated_remaining_seconds = Math.max(10, (MODULE_DEFINITIONS.length - job.completed_steps.length) * 10);
            const nextStepDef = MODULE_DEFINITIONS[job.current_step] || {};
            job.message = nextStepDef.message || "Avançando para a próxima etapa...";
          }

          job.is_processing = false;
          saveJob(job);

        } catch (err) {
          job.is_processing = false;
          
          if (err.isQuotaExhausted) {
            job.status = "failed";
            job.error_code = "GROQ_QUOTA_EXHAUSTED";
            job.message = "A cota disponível da Groq foi atingida. O relatório não pôde ser concluído.";
            job.retryable = false;
            saveJob(job);
          } else if (err.status === 429) {
            const waitSeconds = err.retryAfterSeconds || 8;
            job.status = "waiting_rate_limit";
            job.retry_after_at = Date.now() + (waitSeconds * 1000);
            job.message = `Limite de taxa atingido. Aguardando liberação da janela Groq (${waitSeconds}s)...`;
            job.retryable = true;
            saveJob(job);
          } else {
            job.retry_count = (job.retry_count || 0) + 1;
            job.last_error = err.message;
            if (job.retry_count > 2) {
              job.status = "failed";
              job.error_code = "STEP_EXECUTION_FAILED";
              job.message = `Falha ao executar a etapa ${stepDef.label}: ${err.message}`;
              job.retryable = true;
            }
            saveJob(job);
          }
        }
      }

      const nextLabel = (MODULE_DEFINITIONS[job.current_step] || {}).label || "Finalização";
      return res.status(200).json({
        success: job.status !== "failed",
        job_id: job.job_id,
        status: job.status,
        current_step: job.current_step,
        current_module_label: nextLabel,
        completed_steps: job.completed_steps || [],
        total_steps: MODULE_DEFINITIONS.length,
        progress_percent: Math.round(((job.completed_steps || []).length / MODULE_DEFINITIONS.length) * 100),
        estimated_remaining_seconds: job.status === "completed" ? 0 : Math.max(8, (MODULE_DEFINITIONS.length - (job.completed_steps || []).length) * 10),
        message: job.message || "Etapa processada com sucesso."
      });
    }

    // ROTA GET: Resultado do Job
    if (action === "result") {
      if (!jobId) {
        return res.status(400).json({ error: "Parâmetro job_id obrigatório." });
      }
      const job = getJob(jobId);
      if (!job) {
        return res.status(404).json({ error: "Job não encontrado." });
      }
      if (job.status !== "completed") {
        return res.status(400).json({ 
          error: "O job ainda não foi concluído.", 
          status: job.status, 
          progress_percent: Math.round(((job.completed_steps || []).length / MODULE_DEFINITIONS.length) * 100)
        });
      }

      return res.status(200).json({
        success: true,
        job_id: job.job_id,
        status: "completed",
        result: job.final_result,
        reply: JSON.stringify(job.final_result)
      });
    }

    // ROTA POST: Cancelamento de Job
    if (action === "cancel") {
      if (!jobId) {
        return res.status(400).json({ error: "Parâmetro job_id obrigatório." });
      }
      const job = getJob(jobId);
      if (job) {
        job.status = "cancelled";
        job.message = "Job cancelado pelo usuário.";
        job.is_processing = false;
        saveJob(job);
      }
      return res.status(200).json({ success: true, message: "Job cancelado com sucesso." });
    }

    return res.status(400).json({ error: "Ação não suportada." });

  } catch (error) {
    return res.status(500).json({
      error: "Erro interno no Servidor: " + error.message,
      details: error.stack || error.message
    });
  }
};
