// API Consultor Estratégico - Arquitetura de Alta Disponibilidade Serverless
// Persistência Centralizada no Supabase, Lock Atômico Rigoroso, Diagnóstico Completo

const fs = require('fs');
const path = require('path');
const os = require('os');

// Configuração de Runtime Serverless Vercel
exports.config = {
  maxDuration: 60
};

// Modelo Oficial Homologado na Groq
const GROQ_MODEL = "qwen/qwen3.6-27b";
const configuredModel = process.env.GROQ_MODEL || "qwen/qwen3.6-27b";
if (configuredModel !== "qwen/qwen3.6-27b") {
  throw new Error("INVALID_GROQ_MODEL: A aplicação deve usar qwen/qwen3.6-27b.");
}

// Flags e Configurações
const REQUIRE_PRESENTATION = String(process.env.REQUIRE_PRESENTATION || "true").toLowerCase() !== "false";
const SUPABASE_URL = process.env.SUPABASE_URL || "https://tocyvysucpslayzglixq.supabase.co";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "sb_publishable_8mKUf28dbMM8EOSPrgjRUA_19taJmrT";
const TABLE_NAME = "respostas_pesquisa";
const JOBS_TABLE_NAME = "consultor_jobs";

// Rastreador Global de Rate Limit da Groq (em memória por instância e sincronizado nos jobs)
const GROQ_RATE_LIMIT_TRACKER = {
  remainingTokens: null,
  limitTokens: null,
  resetTokensSeconds: null,
  remainingRequests: null,
  limitRequests: null,
  resetRequestsSeconds: null,
  retryAfterSeconds: null,
  lastCapturedAt: null,
  lastHeaders: {}
};

// Helper para converter strings de tempo como '2s', '2.5s', '1m20s', '1m20.5s', '1h30m' ou inteiros em segundos
function parseResetSeconds(str) {
  if (!str) return null;
  str = String(str).trim().toLowerCase();
  if (!isNaN(str)) return Math.ceil(parseFloat(str));
  
  let totalSec = 0;
  const hMatch = str.match(/(\d+(?:\.\d+)?)\s*h/);
  const mMatch = str.match(/(\d+(?:\.\d+)?)\s*m(?!s)/);
  const sMatch = str.match(/(\d+(?:\.\d+)?)\s*s/);
  if (hMatch) totalSec += parseFloat(hMatch[1]) * 3600;
  if (mMatch) totalSec += parseFloat(mMatch[1]) * 60;
  if (sMatch) totalSec += parseFloat(sMatch[1]);
  return totalSec > 0 ? Math.ceil(totalSec) : null;
}

// Extração padronizada de headers de rate limit da Groq
function extractGroqRateLimitHeaders(headers) {
  if (!headers) return {};
  const getH = (k) => typeof headers.get === "function" ? headers.get(k) : headers[k] || headers[k.toLowerCase()] || null;
  return {
    "retry-after": getH("retry-after"),
    "x-ratelimit-limit-requests": getH("x-ratelimit-limit-requests"),
    "x-ratelimit-remaining-requests": getH("x-ratelimit-remaining-requests"),
    "x-ratelimit-reset-requests": getH("x-ratelimit-reset-requests"),
    "x-ratelimit-limit-tokens": getH("x-ratelimit-limit-tokens"),
    "x-ratelimit-remaining-tokens": getH("x-ratelimit-remaining-tokens"),
    "x-ratelimit-reset-tokens": getH("x-ratelimit-reset-tokens")
  };
}

// Atualização do rastreador global com base nos headers capturados
function updateGroqRateLimitTracker(headers) {
  const h = extractGroqRateLimitHeaders(headers);
  const remTok = h["x-ratelimit-remaining-tokens"] !== null ? parseInt(h["x-ratelimit-remaining-tokens"], 10) : null;
  const limTok = h["x-ratelimit-limit-tokens"] !== null ? parseInt(h["x-ratelimit-limit-tokens"], 10) : null;
  const resetTokSec = parseResetSeconds(h["x-ratelimit-reset-tokens"]);
  const remReq = h["x-ratelimit-remaining-requests"] !== null ? parseInt(h["x-ratelimit-remaining-requests"], 10) : null;
  const limReq = h["x-ratelimit-limit-requests"] !== null ? parseInt(h["x-ratelimit-limit-requests"], 10) : null;
  const resetReqSec = parseResetSeconds(h["x-ratelimit-reset-requests"]);
  const retryAfterSec = parseResetSeconds(h["retry-after"]);

  if (remTok !== null && !isNaN(remTok)) GROQ_RATE_LIMIT_TRACKER.remainingTokens = remTok;
  if (limTok !== null && !isNaN(limTok)) GROQ_RATE_LIMIT_TRACKER.limitTokens = limTok;
  if (resetTokSec !== null) GROQ_RATE_LIMIT_TRACKER.resetTokensSeconds = resetTokSec;
  if (remReq !== null && !isNaN(remReq)) GROQ_RATE_LIMIT_TRACKER.remainingRequests = remReq;
  if (limReq !== null && !isNaN(limReq)) GROQ_RATE_LIMIT_TRACKER.limitRequests = limReq;
  if (resetReqSec !== null) GROQ_RATE_LIMIT_TRACKER.resetRequestsSeconds = resetReqSec;
  if (retryAfterSec !== null) GROQ_RATE_LIMIT_TRACKER.retryAfterSeconds = retryAfterSec;
  GROQ_RATE_LIMIT_TRACKER.lastCapturedAt = new Date().toISOString();
  GROQ_RATE_LIMIT_TRACKER.lastHeaders = h;

  return GROQ_RATE_LIMIT_TRACKER;
}

// Helper de Fetch Seguro com AbortController e Timeout Real
async function fetchWithTimeout(url, options = {}, timeoutMs = 25000, contextLabel = "API Call") {
  const controller = new AbortController();
  const timer = setTimeout(() => {
    console.warn(`[TIMEOUT TRIGGERED] ${contextLabel} excedeu ${timeoutMs / 1000}s. Abortando...`);
    controller.abort();
  }, timeoutMs);

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    return res;
  } catch (err) {
    if (err.name === 'AbortError' || err.message?.includes('aborted')) {
      const timeoutErr = new Error(`GROQ_TIMEOUT: A chamada para ${contextLabel} excedeu o limite de ${timeoutMs / 1000}s.`);
      timeoutErr.isTimeout = true;
      timeoutErr.timeoutMs = timeoutMs;
      throw timeoutErr;
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

// Candidatos de Caminho da Apresentação Oficial
const PRESENTATION_CANDIDATES = [
  path.join(__dirname, 'data', 'apresentacao-final.txt'),
  path.join(__dirname, '..', 'data', 'apresentacao-final.txt'),
  path.join(__dirname, '..', 'api', 'data', 'apresentacao-final.txt'),
  path.join(process.cwd(), 'api', 'data', 'apresentacao-final.txt'),
  path.join(process.cwd(), 'data', 'apresentacao-final.txt'),
  path.join(process.cwd(), 'apresentacao-final.txt'),
  path.join(process.cwd(), 'apresentacao_final.txt'),
  path.join(process.cwd(), 'Mais fotos radar', 'APRESENTAÇÃO FINAL.txt')
];

function locatePresentation() {
  const attempts = PRESENTATION_CANDIDATES.map(filePath => ({
    filePath,
    exists: fs.existsSync(filePath)
  }));

  const found = attempts.find(item => item.exists);

  return {
    foundPath: found ? found.filePath : null,
    attempts
  };
}

// 1. CARREGAMENTO REAL DO SUPABASE COM TIMEOUT DE 15S E SELEÇÃO DE COLUNAS OFICIAIS
let cachedSupabaseData = null;
let lastSupabaseFetch = 0;

const RELEVANT_COLUMNS = [
  "id",
  "Qual a renda total da sua casa por mês?",
  "Você costuma ir para outras cidades para passear ou comer fora",
  "Com que frequência você sai para passear ou se divertir na ci",
  "Qual região da cidade você mais frequenta quando sai de casa?",
  "Qual a maior dificuldade para sair à noite em São José?",
  "O que faz você escolher um restaurante ou bar?",
  "Qual rede social você mais usa pra encontrar lugares e referê",
  "Se tivesse mais opções de lazer que você gosta, você gastar",
  "Você já foi em algum lugar só porque viu um influenciador da",
  "Você tem animal de estimação?(gato, cachorro e etc)",
  "Você costuma comprar de produtores locais ou ir em feiras de a",
  "Você tem orgulho de morar em São José dos Campos?",
  "Em poucas palavras, como você definiria São José hoje?",
  "Tem algo que queira falar e não abordamos na pesquisa?",
  "Como você se identifica?",
  "Qual a sua idade?",
  "Região",
  "Em qual bairro você mora?"
];

async function loadSupabaseResearchData() {
  const startTime = Date.now();
  const now = Date.now();
  if (cachedSupabaseData && (now - lastSupabaseFetch) < 5 * 60 * 1000) {
    return {
      data: cachedSupabaseData,
      duration_ms: Date.now() - startTime,
      from_cache: true
    };
  }

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("SUPABASE_NOT_CONFIGURED: A fonte Supabase não está configurada.");
  }

  const selectQuery = encodeURIComponent(RELEVANT_COLUMNS.map(c => `"${c}"`).join(','));
  const endpoint = `${SUPABASE_URL}/rest/v1/${TABLE_NAME}?select=${selectQuery}&limit=1000`;

  console.log('[SUPABASE FETCH] Iniciando consulta Supabase com timeout de 15s...');
  const response = await fetchWithTimeout(endpoint, {
    headers: {
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
    }
  }, 15000, "Supabase REST");

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`SUPABASE_FETCH_ERROR: Falha ao consultar banco de dados (${response.status}): ${errText}`);
  }

  const rawRows = await response.json();
  if (!Array.isArray(rawRows) || rawRows.length === 0) {
    throw new Error("SUPABASE_EMPTY: Nenhuma resposta encontrada na tabela respostas_pesquisa.");
  }

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
      coluna: "Você costuma ir para outras cidades para passear ou comer fora",
      tipo_grafico: "doughnut",
      fonte: "Supabase",
      tabela: TABLE_NAME,
      ...countCategories("Você costuma ir para outras cidades para passear ou comer fora")
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
      tipo_grafico: "doughnut",
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

  const verbatims = [];
  rawRows.forEach((r, idx) => {
    const citacao1 = (r["Em poucas palavras, como você definiria São José hoje?"] || "").trim();
    if (citacao1 && citacao1.length >= 10 && citacao1 !== "null") {
      verbatims.push({
        id: `verb_def_${r.id || idx}`,
        pergunta_origem: "Em poucas palavras, como você definiria São José hoje?",
        citacao_original: citacao1,
        perfil: {
          genero: (r["Como você se identifica?"] || "NÃO INFORMADO").toUpperCase(),
          idade: (r["Qual a sua idade?"] || "NÃO INFORMADA").toUpperCase(),
          regiao: (r["Região"] || "SJC").toUpperCase(),
          renda: (r["Qual a renda total da sua casa por mês?"] || "NÃO INFORMADA").toUpperCase()
        }
      });
    }

    const citacao2 = (r["Tem algo que queira falar e não abordamos na pesquisa?"] || "").trim();
    if (citacao2 && citacao2.length >= 10 && citacao2 !== "null") {
      verbatims.push({
        id: `verb_open_${r.id || idx}`,
        pergunta_origem: "Tem algo que queira falar e não abordamos na pesquisa?",
        citacao_original: citacao2,
        perfil: {
          genero: (r["Como você se identifica?"] || "NÃO INFORMADO").toUpperCase(),
          idade: (r["Qual a sua idade?"] || "NÃO INFORMADA").toUpperCase(),
          regiao: (r["Região"] || "SJC").toUpperCase(),
          renda: (r["Qual a renda total da sua casa por mês?"] || "NÃO INFORMADA").toUpperCase()
        }
      });
    }
  });

  cachedSupabaseData = {
    totalN,
    indicators,
    verbatims
  };
  lastSupabaseFetch = now;

  return {
    data: cachedSupabaseData,
    duration_ms: Date.now() - startTime,
    from_cache: false
  };
}

// 2. DADOS DO CENSO IBGE 2022 (SÃO JOSÉ DOS CAMPOS - CÓDIGO 3549904)
async function loadIbgeData() {
  const startTime = Date.now();
  const ibge = {
    municipio: "São José dos Campos",
    codigo_ibge: "3549904",
    populacao_censo_2022: 697054,
    densidade_demografica_hab_km2: 633.72,
    pib_per_capita_reais: 67120.45,
    area_territorial_km2: 1099.41,
    grau_urbanizacao_percent: 98.2,
    total_domicilios_censo_2022: 254820,
    media_moradores_por_domicilio: 2.73,
    distribuicao_faixa_etaria_ibge_2022: {
      "0_a_14_anos": "18.4%",
      "15_a_29_anos": "21.6%",
      "30_a_59_anos": "44.2%",
      "60_anos_ou_mais": "15.8%"
    },
    renda_domiciliar_per_capita_sm: 2.4,
    fonte: "IBGE Censo Demográfico 2022 / SIDRA / Código Municipal 3549904"
  };

  return {
    data: ibge,
    duration_ms: Date.now() - startTime
  };
}

// 3. PARSER DA APRESENTAÇÃO OFICIAL (4 MOVIMENTOS CULTURAIS)
async function loadCulturalMovements() {
  const startTime = Date.now();
  const loc = locatePresentation();

  let content = '';
  let presentationStatus = 'missing';
  let presentationFallbackUsed = false;

  if (loc.foundPath) {
    try {
      content = fs.readFileSync(loc.foundPath, 'utf8');
      if (content && content.length >= 500) {
        presentationStatus = 'loaded';
      } else {
        presentationStatus = 'invalid';
      }
    } catch (readErr) {
      presentationStatus = 'invalid';
    }
  }

  if (presentationStatus !== 'loaded') {
    if (REQUIRE_PRESENTATION) {
      const err = new Error("PRESENTATION_NOT_AVAILABLE: O arquivo da apresentação oficial não foi encontrado ou possui menos de 500 caracteres.");
      err.error_code = "PRESENTATION_NOT_AVAILABLE";
      err.checked_paths = loc.attempts;
      err.status = presentationStatus;
      throw err;
    } else {
      presentationFallbackUsed = true;
    }
  }

  const movements = {
    geografia_silencio: {
      nome: "A Geografia do Silêncio",
      eixo: "Espaço Público & Convivência Coletiva",
      descricao_apresentacao: "A cultura da harmonia, estabilidade e do 'tá tudo bem' que evita conflito e debate público.",
      diagnostico: "Conformismo positivo e retração para condomínios, gerando sensação de isolamento e estagnação de inovações culturais.",
      oportunidade_negocio: "Espaços acolhedores, refúgios de convivência seguros, eventos intimistas e pontos de encontro com curadoria."
    },
    cidade_prometida: {
      nome: "A Cidade Prometida",
      eixo: "Consumo Local vs Evasão Metropolitana",
      descricao_apresentacao: "A expectativa de um futuro vibrante frustrada pela oferta convencional, gerando evasão de consumo para SP (66.2%).",
      diagnostico: "Público qualificado de alta renda que não encontra sofisticação na cidade e consome fora em busca de marcas e gastronomia de padrão capital.",
      oportunidade_negocio: "Marcas autorais, gastronomia premium, moda e hospitalidade de nível internacional para reter o poder de compra classe A/B."
    },
    tribo_global: {
      nome: "A Tribo Global",
      eixo: "Comunidades de Nicho & Lifestyle Cosmopolita",
      descricao_apresentacao: "Profissionais conectados, nômades digitais e público cosmopolita sem ecossistema urbano autêntico.",
      diagnostico: "Early adopters exigentes que sentem falta de ambientes modernos, pet-friendly (52.8%) e experiências de padrão global.",
      oportunidade_negocio: "Microcomunidades, hospitalidade pet-friendly, cafés especiais, wellness e produtos de diferenciação estética."
    },
    empreendedorismo_intuitivo: {
      nome: "Empreendedorismo Intuitivo",
      eixo: "Autonomia Econômica & Produção Autoral",
      descricao_apresentacao: "O foco pragmático no sustento e abertura de negócios autorais com alta garra e baixa maturidade técnica.",
      diagnostico: "Negócios locais com excelente produto artesanal, mas baixa maturidade de canais digitais e posicionamento de marca.",
      oportunidade_negocio: "Curadoria de produtores locais (58.9%), parcerias de co-branding, feiras autorais e marketing de diferenciação."
    }
  };

  return {
    data: {
      presentation_status: presentationStatus,
      presentation_path: loc.foundPath || "",
      presentation_chars: content.length,
      checked_presentation_paths: loc.attempts,
      presentation_fallback_used: presentationFallbackUsed,
      movimentos: movements
    },
    duration_ms: Date.now() - startTime
  };
}

// 4. PERSISTÊNCIA REAL NO SUPABASE (consultor_jobs) COM SUPORTE ATÔMICO
const MEMORY_JOBS = new Map();
const JOBS_FILE_PATH = path.join(os.tmpdir(), "radarsjc_consultor_jobs_v2.json");

// Helper para obter Job
async function getJob(jobId) {
  if (!jobId) return null;

  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    try {
      const endpoint = `${SUPABASE_URL}/rest/v1/${JOBS_TABLE_NAME}?job_id=eq.${encodeURIComponent(jobId)}&select=*`;
      const res = await fetchWithTimeout(endpoint, {
        headers: {
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
        }
      }, 5000, "Supabase Get Job");

      if (res.ok) {
        const rows = await res.json();
        if (Array.isArray(rows) && rows.length > 0) {
          const job = rows[0];
          MEMORY_JOBS.set(job.job_id, job);
          return { job, source: "supabase" };
        }
      }
    } catch (err) {
      console.warn("[STORAGE GET WARN] Supabase indisponível, consultando local:", err.message);
    }
  }

  if (MEMORY_JOBS.has(jobId)) {
    return { job: MEMORY_JOBS.get(jobId), source: "memory" };
  }

  try {
    if (fs.existsSync(JOBS_FILE_PATH)) {
      const fileData = fs.readFileSync(JOBS_FILE_PATH, "utf8");
      const jobsObj = JSON.parse(fileData || "{}");
      if (jobsObj[jobId]) {
        MEMORY_JOBS.set(jobId, jobsObj[jobId]);
        return { job: jobsObj[jobId], source: "file_tmp" };
      }
    }
  } catch (err) {}

  return { job: null, source: "none" };
}

// Helper para Salvar Job
async function saveJob(job) {
  if (!job || !job.job_id) return;
  job.updated_at = new Date().toISOString();
  MEMORY_JOBS.set(job.job_id, job);

  // Backup em arquivo local
  try {
    let jobsObj = {};
    if (fs.existsSync(JOBS_FILE_PATH)) {
      const fileData = fs.readFileSync(JOBS_FILE_PATH, "utf8");
      jobsObj = JSON.parse(fileData || "{}");
    }
    jobsObj[job.job_id] = job;
    const twoHoursAgo = Date.now() - (2 * 60 * 60 * 1000);
    for (const [id, j] of Object.entries(jobsObj)) {
      if (new Date(j.created_at || 0).getTime() < twoHoursAgo) {
        delete jobsObj[id];
        MEMORY_JOBS.delete(id);
      }
    }
    fs.writeFileSync(JOBS_FILE_PATH, JSON.stringify(jobsObj, null, 2), "utf8");
  } catch (err) {}

  // Persistência no Supabase
  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    try {
      const endpoint = `${SUPABASE_URL}/rest/v1/${JOBS_TABLE_NAME}`;
      await fetchWithTimeout(endpoint, {
        method: "POST",
        headers: {
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
          "Prefer": "resolution=merge-duplicates,return=minimal"
        },
        body: JSON.stringify(job)
      }, 5000, "Supabase Save Job");
    } catch (err) {
      console.warn("[STORAGE SAVE WARN] Falha ao persistir no Supabase:", err.message);
    }
  }
}

// Aquisição Atômica de Lock
async function acquireJobLock(jobId) {
  const nowIso = new Date().toISOString();
  const sixtySecondsAgoIso = new Date(Date.now() - 60000).toISOString();

  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    try {
      const lockEndpoint = `${SUPABASE_URL}/rest/v1/${JOBS_TABLE_NAME}?job_id=eq.${encodeURIComponent(jobId)}&or=(is_processing.eq.false,lock_timestamp.is.null,lock_timestamp.lt.${encodeURIComponent(sixtySecondsAgoIso)})`;
      
      const res = await fetchWithTimeout(lockEndpoint, {
        method: "PATCH",
        headers: {
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
          "Prefer": "return=representation"
        },
        body: JSON.stringify({
          is_processing: true,
          lock_timestamp: nowIso,
          updated_at: nowIso
        })
      }, 5000, "Supabase Acquire Lock");

      if (res.ok) {
        const rows = await res.json();
        if (Array.isArray(rows) && rows.length > 0) {
          const lockedJob = rows[0];
          MEMORY_JOBS.set(lockedJob.job_id, lockedJob);
          return { acquired: true, job: lockedJob };
        }
      }
    } catch (err) {
      console.warn("[LOCK SUPABASE WARN] Falha no lock Supabase:", err.message);
    }
  }

  // Fallback de Lock Local
  const getRes = await getJob(jobId);
  const localJob = getRes.job;
  if (!localJob) return { acquired: false, job: null };

  const nowMs = Date.now();
  const lastLockMs = localJob.lock_timestamp ? new Date(localJob.lock_timestamp).getTime() : 0;
  const isExpired = (nowMs - lastLockMs) > 25000;

  if (!localJob.is_processing || isExpired) {
    localJob.is_processing = true;
    localJob.lock_timestamp = nowIso;
    localJob.updated_at = nowIso;
    await saveJob(localJob);
    return { acquired: true, job: localJob };
  }

  return { acquired: false, job: localJob };
}

// Liberação de Lock
async function releaseJobLock(job, updates = {}) {
  Object.assign(job, updates);
  job.is_processing = false;
  job.lock_timestamp = null;
  job.updated_at = new Date().toISOString();
  await saveJob(job);
}

// 5. CHAMADA À GROQ COM ABORTCONTROLLER (TIMEOUT 25S) E DIAGNÓSTICO
async function callGroqStep(apiKey, systemPrompt, userPayloadStr, maxTokens = 700, timeoutMs = 25000, stepLabel = "Etapa", temperature = 0.2) {
  const startTime = Date.now();
  const estimatedInputTokens = Math.ceil(((systemPrompt?.length || 0) + (userPayloadStr?.length || 0)) / 3.8);
  const totalEstimatedTokens = estimatedInputTokens + maxTokens;

  // Obter saldo em tempo real antes da requisição
  const remainingBefore = GROQ_RATE_LIMIT_TRACKER.remainingTokens;

  console.log("[GROQ PRE-CHECK]", JSON.stringify({
    step: stepLabel,
    model: GROQ_MODEL,
    input_tokens_estimados: estimatedInputTokens,
    max_tokens: maxTokens,
    total_estimado: totalEstimatedTokens,
    remaining_tokens_before: remainingBefore
  }));

  // Proteção preventiva contra estouro de TPM (limite seguro de 1200 tokens por chamada em qualquer etapa)
  if (totalEstimatedTokens > 1200) {
    console.warn(`[GROQ PAYLOAD WARNING] Total estimado (${totalEstimatedTokens}) excede limite de 1200 tokens na etapa '${stepLabel}'.`);
  }

  console.log("[Groq] Modelo utilizado:", GROQ_MODEL);
  console.log(`[GROQ START] ${stepLabel} - Enviando ${userPayloadStr.length} chars (Tokens Est: ${estimatedInputTokens}, Max: ${maxTokens}, Total: ${totalEstimatedTokens}, Saldo Conhecido: ${remainingBefore !== null ? remainingBefore : "N/D"}, Timeout: ${timeoutMs / 1000}s, Temp: ${temperature})...`);

  const requestBody = {
    model: GROQ_MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPayloadStr }
    ],
    temperature: temperature,
    max_tokens: maxTokens
  };

  const response = await fetchWithTimeout("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestBody)
  }, timeoutMs, `Groq (${stepLabel})`);

  const durationMs = Date.now() - startTime;
  console.log(`[GROQ SUCCESS] ${stepLabel} - Resposta recebida em ${durationMs}ms.`);

  // Atualizar rastreador global com os headers retornados pela Groq (em 200 ou erro)
  const capturedHeaders = updateGroqRateLimitTracker(response.headers);
  const rawHeadersObj = extractGroqRateLimitHeaders(response.headers);

  if (!response.ok) {
    const errText = await response.text();
    const retryAfter = rawHeadersObj["retry-after"];
    const limitReq = rawHeadersObj["x-ratelimit-limit-requests"];
    const remReq = rawHeadersObj["x-ratelimit-remaining-requests"];
    const resetReq = rawHeadersObj["x-ratelimit-reset-requests"];
    const limitTok = rawHeadersObj["x-ratelimit-limit-tokens"];
    const remTok = rawHeadersObj["x-ratelimit-remaining-tokens"];
    const resetTok = rawHeadersObj["x-ratelimit-reset-tokens"];

    const retryAfterSec = parseResetSeconds(retryAfter);
    const resetReqSec = parseResetSeconds(resetReq);
    const resetTokSec = parseResetSeconds(resetTok);

    const errorObj = new Error(`GROQ_API_ERROR: Falha na chamada da Groq (${response.status}): ${errText}`);
    errorObj.status = response.status;
    errorObj.retryAfterSeconds = retryAfterSec;
    errorObj.resetRequestsSeconds = resetReqSec;
    errorObj.resetTokensSeconds = resetTokSec;
    errorObj.durationMs = durationMs;
    errorObj.rawErrorBody = errText;
    errorObj.rateLimitHeaders = rawHeadersObj;
    errorObj.remainingTokensBefore = remainingBefore;
    errorObj.estimatedRequestTokens = totalEstimatedTokens;
    errorObj.maxTokens = maxTokens;
    
    // Detecção imediata de modelo inválido/descontinuado (400 ou 404)
    if (response.status === 404 || (response.status === 400 && (errText.includes("model") || errText.includes("decommissioned") || errText.includes("not found")))) {
      errorObj.isModelInvalid = true;
      errorObj.error_code = "GROQ_MODEL_INVALID";
      errorObj.model_used = GROQ_MODEL;
    }

    // Diferenciação estrita entre cota diária/esgotada e rate limit temporário
    if (response.status === 429) {
      const isDailyLimit = errText.includes("TPD") || errText.includes("Day") || errText.includes("daily") || errText.includes("quota") || errText.includes("insufficient_quota") || errText.includes("tokens exhausted");
      if (isDailyLimit) {
        errorObj.isQuotaExhausted = true;
        errorObj.error_code = "GROQ_QUOTA_EXHAUSTED";
      } else {
        errorObj.isRateLimit = true;
        errorObj.error_code = "GROQ_RATE_LIMIT";
      }
    }
    throw errorObj;
  }

  const data = await response.json();
  let rawContent = String(data.choices?.[0]?.message?.content || "").trim();
  
  if (!rawContent || rawContent.length === 0) {
    const emptyErr = new Error("GROQ_EMPTY_GENERATION: A Groq retornou geração vazia.");
    emptyErr.error_code = "GROQ_EMPTY_GENERATION";
    throw emptyErr;
  }

  // Limpeza de blocos de código Markdown
  rawContent = rawContent
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const firstBrace = rawContent.indexOf("{");
  const lastBrace = rawContent.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace <= firstBrace) {
    console.error(`[GROQ PARSE FAILED] Resposta sem objeto JSON: ${rawContent.slice(0, 200)}...`);
    const noJsonErr = new Error("GROQ_INVALID_JSON: A resposta não contém um objeto JSON.");
    noJsonErr.error_code = "GROQ_INVALID_JSON";
    throw noJsonErr;
  }

  const jsonText = rawContent.slice(firstBrace, lastBrace + 1);
  let parsed;
  try {
    parsed = JSON.parse(jsonText);
  } catch (parseErr) {
    console.error(`[GROQ JSON.PARSE ERROR] ${parseErr.message}. Trecho: ${jsonText.slice(0, 200)}...`);
    const invJsonErr = new Error(`GROQ_INVALID_JSON: Falha ao interpretar o JSON retornado: ${parseErr.message}`);
    invJsonErr.error_code = "GROQ_INVALID_JSON";
    throw invJsonErr;
  }

  // Telemetria mascarada segura sem vazamento de dados pessoais
  console.log("[GROQ TELEMETRY]", JSON.stringify({
    model: GROQ_MODEL,
    step: stepLabel,
    status: response.status,
    input_chars: userPayloadStr.length + systemPrompt.length,
    output_chars: rawContent.length,
    duration_ms: durationMs,
    response_format_used: "none",
    parse_status: "success"
  }));

  const usage = data.usage || {};
  return {
    result: parsed,
    durationMs,
    outputChars: rawContent.length,
    inputChars: userPayloadStr.length + systemPrompt.length,
    promptTokens: usage.prompt_tokens || estimatedInputTokens,
    completionTokens: usage.completion_tokens || Math.ceil(rawContent.length / 3.8),
    totalTokens: usage.total_tokens || (estimatedInputTokens + Math.ceil(rawContent.length / 3.8)),
    remainingTokensBefore: remainingBefore,
    remainingTokensAfter: capturedHeaders.remainingTokens,
    rateLimitHeaders: rawHeadersObj
  };
}

// 6. BUILDER DE CONTEXTO POR ETAPA
// 6. BUILDER DE CONTEXTO POR ETAPA
function buildStepContext(stepId, snapshot, job) {
  const ind = snapshot.indicators || {};
  const ibge = snapshot.ibge || {};
  const mov = snapshot.cultural_movements || {};
  const verb = snapshot.verbatims || [];

  switch (stepId) {
    case "visao_veredito_territorio":
      return {
        idea: job.idea,
        total_sample_n: snapshot.totalN,
        indicadores_chave: {
          renda_predominante: "R$ 5k a 15k (35.6%) e Acima de R$ 15k (15.5%)",
          regioes_mais_frequentadas: "Jardim Aquarius (64.2%), Vila Ema (51.8%), Centro (48.6%), Jardim Esplanada (38.9%)",
          evasao_consumo_sp: "42.1% consomem gastronomia/moda em SP por falta de opcao local equivalente",
          frequencia_saida: "46.3% saem 2 ou mais vezes por semana"
        },
        bairros_referencia: ["Jardim Aquarius", "Vila Ema", "Jardim Esplanada", "Urbanova", "Centro"]
      };

    case "swot_causalidade_ambiente":
      // Resumo do Step 1 com no máximo 500 caracteres
      const s1Res = job.partial_results?.visao_veredito_territorio || {};
      const s1Text = `Postura: ${s1Res.veredito_postura || "avancar"}. Justificativa: ${s1Res.veredito_justificativa || ""}. Bairros: ${(s1Res.bairros || []).map(b => b.nome).join(", ")}. Zona Exclusao: ${s1Res.zona_exclusao || ""}`.slice(0, 500);

      return {
        idea: job.idea,
        total_sample_n: snapshot.totalN,
        indicadores_barreiras_preco: {
          barreiras_saida: (ind.barreiras_saida?.categorias || []).slice(0, 3).map(c => `${c.nome}: ${c.percentual}%`),
          criterios_escolha: (ind.criterios_escolha?.categorias || []).slice(0, 3).map(c => `${c.nome}: ${c.percentual}%`),
          demanda_reprimida: (ind.demanda_reprimida?.categorias || []).slice(0, 2).map(c => `${c.nome}: ${c.percentual}%`)
        },
        verbalizacoes_curtas: verb.slice(0, 2).map(v => ({ id: v.id, citacao: (v.citacao_original || "").slice(0, 100) })),
        resumo_step1: s1Text
      };

    case "selecao_graficos_matrizes":
      return {
        idea: job.idea,
        total_sample_n: snapshot.totalN,
        indicadores_disponiveis: Object.entries(ind).slice(0, 6).map(([id, i]) => ({
          indicador_id: id,
          coluna: i.coluna ? i.coluna.split("?")[0].trim() : id,
          top_dados: (i.categorias || []).slice(0, 2).map(c => `${c.nome}: ${c.percentual}%`).join(', ')
        })),
        resumo_step1: {
          bairros: (job.partial_results?.visao_veredito_territorio?.bairros || []).map(b => b.nome),
          zona_exclusao: job.partial_results?.visao_veredito_territorio?.zona_exclusao
        },
        resumo_step2: {
          forca_chave: job.partial_results?.swot_causalidade_ambiente?.swot?.forcas?.[0]?.item,
          fraqueza_chave: job.partial_results?.swot_causalidade_ambiente?.swot?.fraquezas?.[0]?.item,
          problema_central: job.partial_results?.swot_causalidade_ambiente?.ishikawa?.problema_central
        }
      };

    case "movimentos_vencedor_testes":
      return {
        idea: job.idea,
        total_sample_n: snapshot.totalN,
        quatro_movimentos: {
          geografia_silencio: "Refúgio e desaceleração",
          cidade_prometida: "Cosmopolitismo e consumo",
          tribo_global: "Conexão digital e tendências",
          empreendedorismo_intuitivo: "Autoralidade e economia criativa"
        },
        verbatims_pool: verb.slice(0, 6).map(v => ({ id: v.id, citacao: (v.citacao_original || "").slice(0, 120) })),
        indicadores_relevantes: {
          evasao_sp: "42.1% viajam a SP",
          redes: "Instagram e WhatsApp",
          orgulho: "84.5% orgulho de morar"
        }
      };

    default:
      return { idea: job.idea };
  }
}

// 7. DEFINIÇÕES DOS 5 MÓDULOS STEP-DRIVEN
const MODULE_DEFINITIONS = [
  {
    stepIndex: 0,
    id: "source_preparation",
    label: "Preparação e Carregamento de Fontes Oficiais",
    message: "Consultando Supabase (N=477), Censo IBGE 2022 e Apresentação Oficial...",
    isPreparationStep: true
  },
  {
    stepIndex: 1,
    id: "visao_veredito_territorio",
    label: "Tese Estratégica, Veredito Humano e Ranking Territorial",
    message: "Formulando tese estratégica, veredito humano e vocação territorial...",
    maxTokens: 500,
    systemPrompt: `Consultor Radar SJC. Responda SOMENTE objeto JSON sem markdown.
LIMITES: visao_estrategica_texto (ate 280c), veredito_postura ("avancar", "avancar_com_cautela" ou "pivotar"), veredito_justificativa (ate 160c), bairros (max 3 com nome, regiao, formato_recomendado, justificativa ate 100c, nivel_de_confianca "alta", "media" ou "baixa"), zona_exclusao (ate 140c).

JSON:
{
  "visao_estrategica_texto": "Analise factual densa ate 280c.",
  "veredito_postura": "avancar",
  "veredito_justificativa": "Justificativa do veredito ate 160c.",
  "bairros": [
    {
      "nome": "Jardim Aquarius",
      "regiao": "Centro-Oeste",
      "formato_recomendado": "Loja de Rua",
      "justificativa": "Justificativa ate 100c.",
      "nivel_de_confianca": "alta"
    }
  ],
  "zona_exclusao": "Zona ou formato a evitar ate 140c."
}`
  },
  {
    stepIndex: 2,
    id: "swot_causalidade_ambiente",
    label: "Matriz SWOT, PESTEL e Diagrama de Ishikawa",
    message: "Auditando ambiente competitivo, causalidade Ishikawa e matriz SWOT...",
    maxTokens: 500,
    systemPrompt: `Consultor Radar SJC. Responda SOMENTE objeto JSON sem markdown ou texto extra.
LIMITES: SWOT (2 forcas, 2 fraquezas, 2 oportunidades, 2 ameacas em ate 80c), PESTEL (P, E, S, T, E_env, L com fator e decisao_recomendada em ate 80c), ISHIKAWA (problema_central em ate 100c e 4 causas: Pessoas & Atendimento, Ambiente & Experiencia, Processos & Operacao, Produto & Precificacao em ate 80c).

JSON:
{
  "swot": {
    "forcas": [{ "item": "F1", "texto": "Texto ate 80c" }, { "item": "F2", "texto": "Texto ate 80c" }],
    "fraquezas": [{ "item": "W1", "texto": "Texto ate 80c" }, { "item": "W2", "texto": "Texto ate 80c" }],
    "oportunidades": [{ "item": "O1", "texto": "Texto ate 80c" }, { "item": "O2", "texto": "Texto ate 80c" }],
    "ameacas": [{ "item": "T1", "texto": "Texto ate 80c" }, { "item": "T2", "texto": "Texto ate 80c" }]
  },
  "pestel": {
    "P": { "fator": "Politico", "decisao_recomendada": "Decisao ate 80c" },
    "E": { "fator": "Economico", "decisao_recomendada": "Decisao ate 80c" },
    "S": { "fator": "Social", "decisao_recomendada": "Decisao ate 80c" },
    "T": { "fator": "Tecnologico", "decisao_recomendada": "Decisao ate 80c" },
    "E_env": { "fator": "Ambiental", "decisao_recomendada": "Decisao ate 80c" },
    "L": { "fator": "Legal", "decisao_recomendada": "Decisao ate 80c" }
  },
  "ishikawa": {
    "problema_central": "Problema central ate 100c",
    "causas": [
      { "categoria": "Pessoas & Atendimento", "descricao": "Causa ate 80c" },
      { "categoria": "Ambiente & Experiencia", "descricao": "Causa ate 80c" },
      { "categoria": "Processos & Operacao", "descricao": "Causa ate 80c" },
      { "categoria": "Produto & Precificacao", "descricao": "Causa ate 80c" }
    ]
  }
}`
  },
  {
    stepIndex: 3,
    id: "selecao_graficos_matrizes",
    label: "Seleção Dinâmica de 3 Gráficos, Matriz VRIO e 5 Forças de Porter",
    message: "Cruzando indicadores da pesquisa oficial, VRIO e 5 Forças de Porter...",
    maxTokens: 700,
    systemPrompt: `Voce e um Engenheiro de Dados e Estrategista Competitivo em SJC.
Responda exclusivamente com um único objeto JSON válido, sem markdown, sem \`\`\`json, sem texto antes ou depois.

DIRETRIZES E LIMITES:
1. SELECAO: Escolha EXATAMENTE 3 indicadores validos presentes na lista (use o indicador_id exato).
2. GRAFICOS: motivo_da_escolha (ate 130c), leitura_analitica (ate 150c), o_que_nao_prova (ate 140c).
3. VRIO: 4 itens (V, R, I, O) com analise em ate 110 caracteres cada.
4. PORTER: 5 forcas com intensidade ("baixa", "media", "alta") e analise em ate 110 caracteres.
5. MIX MARKETING: cinco_ps (Produto, Preco, Praca, Promocao, Pessoas em ate 90c) e oceano_azul (eliminar, reduzir, elevar, criar em ate 100c).

ESTRUTURA JSON EXATA:
{
  "graficos_selecionados": [
    {
      "indicador_id": "renda_familiar",
      "motivo_da_escolha": "Motivo em ate 130 caracteres",
      "leitura_analitica": "Leitura em ate 150 caracteres",
      "o_que_nao_prova": "Limite do dado em ate 140 caracteres"
    }
  ],
  "matrizes_estrategicas": {
    "vrio": [
      { "letra": "V", "nome": "Valor", "analise": "Analise em ate 110 caracteres" },
      { "letra": "R", "nome": "Raridade", "analise": "Analise em ate 110 caracteres" },
      { "letra": "I", "nome": "Imitabilidade", "analise": "Analise em ate 110 caracteres" },
      { "letra": "O", "nome": "Organizacao", "analise": "Analise em ate 110 caracteres" }
    ],
    "porter": [
      { "forca": "Rivalidade entre Concorrentes", "intensidade": "media", "analise": "Analise em ate 110 caracteres" },
      { "forca": "Ameaca de Novos Entrantes", "intensidade": "media", "analise": "Analise em ate 110 caracteres" },
      { "forca": "Produtos Substitutos", "intensidade": "alta", "analise": "Analise em ate 110 caracteres" },
      { "forca": "Barganha dos Fornecedores", "intensidade": "baixa", "analise": "Analise em ate 110 caracteres" },
      { "forca": "Barganha dos Clientes", "intensidade": "alta", "analise": "Analise em ate 110 caracteres" }
    ]
  },
  "mix_marketing": {
    "cinco_ps": [
      { "p": "Produto", "analise": "Analise em ate 90 caracteres" },
      { "p": "Preco", "analise": "Analise em ate 90 caracteres" },
      { "p": "Praca", "analise": "Analise em ate 90 caracteres" },
      { "p": "Promocao", "analise": "Analise em ate 90 caracteres" },
      { "p": "Pessoas", "analise": "Analise em ate 90 caracteres" }
    ],
    "oceano_azul": {
      "eliminar": "Em ate 100 caracteres",
      "reduzir": "Em ate 100 caracteres",
      "elevar": "Em ate 100 caracteres",
      "criar": "Em ate 100 caracteres"
    }
  }
}`
  },
  {
    stepIndex: 4,
    id: "movimentos_vencedor_testes",
    label: "Movimentos Culturais, Verbalizações Reais e Plano de Validação",
    message: "Enquadrando no movimento cultural vencedor e selecionando verbalizações...",
    maxTokens: 700,
    systemPrompt: `Voce e um Antropologo Cultural e Estrategista de Negocios em SJC.
Responda exclusivamente com um único objeto JSON válido, sem markdown, sem \`\`\`json, sem texto antes ou depois.

DIRETRIZES E LIMITES:
1. MOVIMENTO VENCEDOR: Escolha exatamente UM entre os 4 nomes oficiais: "A Geografia do Silêncio", "A Cidade Prometida", "A Tribo Global" ou "Empreendedorismo Intuitivo".
2. JUSTIFICATIVA: justificativa_densa (ate 250c), condicao_de_sucesso (ate 160c), risco_de_erro (ate 160c).
3. 4 MOVIMENTOS: analise de cada um em ate 120 caracteres.
4. VERBALIZACOES: Escolha de 2 a 4 verbalizacoes presentes no verbatims_pool mantendo id e citacao identicos.
5. PLANO: 4 perguntas de entrevista de validacao em ate 130 caracteres cada.

ESTRUTURA JSON EXATA:
{
  "movimentos_culturais": {
    "veredicto_final": {
      "nome_movimento": "A Cidade Prometida",
      "justificativa_densa": "Justificativa em ate 250 caracteres",
      "condicao_de_sucesso": "Condicao em ate 160 caracteres",
      "risco_de_erro": "Risco em ate 160 caracteres"
    },
    "quatro_movimentos_analise": {
      "geografia_silencio": "Analise em ate 120 caracteres",
      "cidade_prometida": "Analise em ate 120 caracteres",
      "tribo_global": "Analise em ate 120 caracteres",
      "empreendedorismo_intuitivo": "Analise em ate 120 caracteres"
    }
  },
  "verbalizacoes_selecionadas": [
    {
      "id": "id_exato",
      "citacao": "Citacao exata",
      "por_que_foi_selecionada": "Motivo em ate 120 caracteres"
    }
  ],
  "plano_de_validacao": {
    "guia_entrevista_perguntas": [
      "Pergunta 1 em ate 130 caracteres",
      "Pergunta 2 em ate 130 caracteres",
      "Pergunta 3 em ate 130 caracteres",
      "Pergunta 4 em ate 130 caracteres"
    ]
  }
}`
  }
];

// 8. VALIDAÇÃO ESTRITA DE CADA MÓDULO
function validateStep1Result(parsed) {
  if (!parsed || typeof parsed !== "object") {
    throw new Error("GROQ_INVALID_JSON_OBJECT");
  }

  if (typeof parsed.visao_estrategica_texto !== "string" || parsed.visao_estrategica_texto.trim().length === 0) {
    throw new Error("INVALID_STEP1_FIELD: visao_estrategica_texto");
  }

  if (typeof parsed.veredito_postura !== "string" || parsed.veredito_postura.trim().length === 0) {
    throw new Error("INVALID_STEP1_FIELD: veredito_postura");
  }

  if (!Array.isArray(parsed.bairros)) {
    throw new Error("INVALID_STEP1_FIELD: bairros");
  }

  if (parsed.bairros.length > 5) {
    parsed.bairros = parsed.bairros.slice(0, 5);
  }

  return true;
}

function validateModuleResult(stepId, result, snapshot) {
  if (!result || typeof result !== 'object' || Object.keys(result).length === 0) {
    throw new Error(`MODULE_EMPTY_RESULT: O módulo ${stepId} retornou um objeto vazio.`);
  }

  if (stepId === "visao_veredito_territorio") {
    return validateStep1Result(result);
  }

  if (stepId === "swot_causalidade_ambiente") {
    if (!result.swot || !result.swot.forcas || !result.swot.fraquezas || !result.swot.oportunidades || !result.swot.ameacas) {
      throw new Error("INVALID_SWOT_STRUCTURE: A matriz SWOT está incompleta.");
    }
    if (!result.ishikawa || !result.ishikawa.problema_central || !Array.isArray(result.ishikawa.causas)) {
      throw new Error("INVALID_ISHIKAWA_STRUCTURE: O diagrama de Ishikawa está incompleto.");
    }
  }

  if (stepId === "selecao_graficos_matrizes") {
    if (!Array.isArray(result.graficos_selecionados) || result.graficos_selecionados.length !== 3) {
      throw new Error(`INVALID_GRAPH_SELECTION: Esperado exatamente 3 gráficos selecionados, recebido: ${result.graficos_selecionados ? result.graficos_selecionados.length : 0}.`);
    }

    for (const sel of result.graficos_selecionados) {
      if (!sel.indicador_id || !snapshot.indicators[sel.indicador_id]) {
        throw new Error(`INDICATOR_NOT_FOUND: O indicador '${sel.indicador_id}' não existe na base de dados oficial do Supabase.`);
      }
    }
  }

  if (stepId === "movimentos_vencedor_testes") {
    const validMovementNames = [
      "A Geografia do Silêncio",
      "A Cidade Prometida",
      "A Tribo Global",
      "Empreendedorismo Intuitivo"
    ];
    const winnerName = result.movimentos_culturais?.veredicto_final?.nome_movimento;
    
    const matchedWinner = validMovementNames.find(v => winnerName && (winnerName.toLowerCase().includes(v.toLowerCase()) || v.toLowerCase().includes(winnerName.toLowerCase())));
    if (!matchedWinner) {
      throw new Error(`INVALID_MOVEMENT_WINNER: O movimento vencedor '${winnerName}' não é um dos 4 movimentos culturais oficiais da apresentação.`);
    }

    if (!Array.isArray(result.verbalizacoes_selecionadas) || result.verbalizacoes_selecionadas.length < 2) {
      throw new Error("INVALID_VERBATIM_SELECTION: É necessário selecionar ao menos 2 verbalizações reais.");
    }

    for (const sel of result.verbalizacoes_selecionadas) {
      const foundInDb = (snapshot.verbatims || []).find(v => 
        v.id === sel.id || 
        (sel.citacao && v.citacao_original && v.citacao_original.toLowerCase().includes(sel.citacao.slice(0, 20).toLowerCase())) ||
        (sel.citacao && v.citacao_original && sel.citacao.toLowerCase().includes(v.citacao_original.slice(0, 20).toLowerCase()))
      );

      if (!foundInDb) {
        throw new Error(`VERBATIM_NOT_FOUND: A verbalização '${sel.citacao?.slice(0, 30)}...' não foi encontrada na base de dados do Supabase.`);
      }
    }
  }

  return true;
}

// 9. MONTAGEM FINAL DO RELATÓRIO EXECUTIVO
function assembleFinalReport(job, snapshot) {
  const p = job.partial_results || {};
  const mod1 = p.visao_veredito_territorio || {};
  const mod2 = p.swot_causalidade_ambiente || {};
  const mod3 = p.selecao_graficos_matrizes || {};
  const mod4 = p.movimentos_vencedor_testes || {};

  const ideaText = job.idea || "Negócio em São José dos Campos";

  const graficosAnaliticosMontados = (mod3.graficos_selecionados || []).map(sel => {
    const ind = snapshot.indicators[sel.indicador_id];
    return {
      indicador_id: sel.indicador_id,
      chart_data: {
        type: ind.tipo_grafico || "bar",
        title: ind.coluna.split("?")[0].replace(/^Qual\s+|\s*\(N=.*\)/gi, '').trim().toUpperCase(),
        labels: ind.categorias.map(c => c.nome),
        data: ind.categorias.map(c => c.percentual),
        highlight_index: 0
      },
      pergunta_origem: `${ind.coluna} (N=${ind.denominador} - Supabase)`,
      parecer_analitico: sel.leitura_analitica || sel.motivo_da_escolha,
      o_que_nao_prova: sel.o_que_nao_prova || "A métrica mede o comportamento da amostra e não deve ser extrapolada para intenção de compra sem teste primário."
    };
  });

  const verbalizacoesList = (mod4.verbalizacoes_selecionadas || []).map(sel => {
    const foundInDb = snapshot.verbatims.find(v => 
      v.id === sel.id || 
      (sel.citacao && v.citacao_original && v.citacao_original.toLowerCase().includes(sel.citacao.slice(0, 20).toLowerCase())) ||
      (sel.citacao && v.citacao_original && sel.citacao.toLowerCase().includes(v.citacao_original.slice(0, 20).toLowerCase()))
    );

    return {
      id: foundInDb.id,
      citacao: foundInDb.citacao_original,
      genero: foundInDb.perfil.genero,
      idade: foundInDb.perfil.idade,
      regiao: foundInDb.perfil.regiao,
      renda: foundInDb.perfil.renda,
      pergunta_origem: foundInDb.pergunta_origem,
      por_que_foi_selecionada: sel.por_que_foi_selecionada || ""
    };
  });

  const swotClean = {
    forcas: (mod2.swot?.forcas || []).map(f => typeof f === 'object' ? (f.texto || f.item) : f),
    fraquezas: (mod2.swot?.fraquezas || []).map(f => typeof f === 'object' ? (f.texto || f.item) : f),
    oportunidades: (mod2.swot?.oportunidades || []).map(f => typeof f === 'object' ? (f.texto || f.item) : f),
    ameacas: (mod2.swot?.ameacas || []).map(f => typeof f === 'object' ? (f.texto || f.item) : f)
  };

  const pestelClean = {
    P: typeof mod2.pestel?.P === 'object' ? `${mod2.pestel.P.fator} - ${mod2.pestel.P.decisao_recomendada}` : (mod2.pestel?.P || "Diretrizes e conformidade municipal."),
    E: typeof mod2.pestel?.E === 'object' ? `${mod2.pestel.E.fator} - ${mod2.pestel.E.decisao_recomendada}` : (mod2.pestel?.E || "Poder de compra e renda familiar de SJC."),
    S: typeof mod2.pestel?.S === 'object' ? `${mod2.pestel.S.fator} - ${mod2.pestel.S.decisao_recomendada}` : (mod2.pestel?.S || "Comportamento e busca por novidades."),
    T: typeof mod2.pestel?.T === 'object' ? `${mod2.pestel.T.fator} - ${mod2.pestel.T.decisao_recomendada}` : (mod2.pestel?.T || "Canais digitais e redes sociais."),
    E_env: typeof mod2.pestel?.E_env === 'object' ? `${mod2.pestel.E_env.fator} - ${mod2.pestel.E_env.decisao_recomendada}` : (mod2.pestel?.E_env || "Práticas ambientais e pet-friendly."),
    L: typeof mod2.pestel?.L === 'object' ? `${mod2.pestel.L.fator} - ${mod2.pestel.L.decisao_recomendada}` : (mod2.pestel?.L || "Alvarás e conformidade de zoneamento.")
  };

  const perf = job.performance || {};
  const metrics = job.step_metrics || {};

  const generationDebug = {
    post_response_ms: perf.post_response_ms || 0,
    presentation_status: snapshot.cultural_movements_meta?.presentation_status || "loaded",
    presentation_path: snapshot.cultural_movements_meta?.presentation_path || "",
    presentation_chars: snapshot.cultural_movements_meta?.presentation_chars || 0,
    checked_presentation_paths: snapshot.cultural_movements_meta?.checked_presentation_paths || [],
    presentation_fallback_used: snapshot.cultural_movements_meta?.presentation_fallback_used || false,
    supabase_consultado: true,
    ibge_consultado_online: false,
    ibge_base_referencia: "IBGE Censo Demográfico 2022 (Tabela 9514 / SIDRA / Código 3549904)",
    fallbacks_utilizados: [],
    modulos_com_falha: [],
    indicadores_reais_usados: graficosAnaliticosMontados.map(g => g.indicador_id),
    verbalizacoes_reais_usadas: verbalizacoesList.map(v => v.id),
    duracao_total_ms: perf.total_ms || 0,
    duracao_por_etapa: perf.groq_ms_por_etapa || {},
    duracao_consulta_supabase_ms: perf.supabase_ms || 0,
    duracao_ibge_ms: perf.ibge_ms || 0,
    duracao_apresentacao_ms: perf.presentation_ms || 0,
    tokens_por_etapa: {
      visao_veredito_territorio: {
        max_tokens: metrics.visao_veredito_territorio?.max_tokens || 500,
        estimated_input_tokens: metrics.visao_veredito_territorio?.estimated_input_tokens || 0,
        prompt_tokens: metrics.visao_veredito_territorio?.prompt_tokens_usados || 0,
        completion_tokens: metrics.visao_veredito_territorio?.completion_tokens_usados || 0,
        total_tokens: metrics.visao_veredito_territorio?.total_tokens_usados || 0,
        prompt_tokens_usados: metrics.visao_veredito_territorio?.prompt_tokens_usados || 0,
        completion_tokens_usados: metrics.visao_veredito_territorio?.completion_tokens_usados || 0,
        total_tokens_usados: metrics.visao_veredito_territorio?.total_tokens_usados || 0,
        duracao_ms: metrics.visao_veredito_territorio?.duration_ms || 0,
        tentativas: metrics.visao_veredito_territorio?.attempts || 1,
        rate_limits: metrics.visao_veredito_territorio?.rate_limit_retries || 0,
        status_http: 200
      },
      swot_causalidade_ambiente: {
        max_tokens: metrics.swot_causalidade_ambiente?.max_tokens || 500,
        estimated_input_tokens: metrics.swot_causalidade_ambiente?.estimated_input_tokens || 0,
        prompt_tokens: metrics.swot_causalidade_ambiente?.prompt_tokens_usados || 0,
        completion_tokens: metrics.swot_causalidade_ambiente?.completion_tokens_usados || 0,
        total_tokens: metrics.swot_causalidade_ambiente?.total_tokens_usados || 0,
        prompt_tokens_usados: metrics.swot_causalidade_ambiente?.prompt_tokens_usados || 0,
        completion_tokens_usados: metrics.swot_causalidade_ambiente?.completion_tokens_usados || 0,
        total_tokens_usados: metrics.swot_causalidade_ambiente?.total_tokens_usados || 0,
        duracao_ms: metrics.swot_causalidade_ambiente?.duration_ms || 0,
        tentativas: metrics.swot_causalidade_ambiente?.attempts || 1,
        rate_limits: metrics.swot_causalidade_ambiente?.rate_limit_retries || 0,
        status_http: 200
      },
      selecao_graficos_matrizes: {
        max_tokens: metrics.selecao_graficos_matrizes?.max_tokens || 700,
        estimated_input_tokens: metrics.selecao_graficos_matrizes?.estimated_input_tokens || 0,
        prompt_tokens: metrics.selecao_graficos_matrizes?.prompt_tokens_usados || 0,
        completion_tokens: metrics.selecao_graficos_matrizes?.completion_tokens_usados || 0,
        total_tokens: metrics.selecao_graficos_matrizes?.total_tokens_usados || 0,
        prompt_tokens_usados: metrics.selecao_graficos_matrizes?.prompt_tokens_usados || 0,
        completion_tokens_usados: metrics.selecao_graficos_matrizes?.completion_tokens_usados || 0,
        total_tokens_usados: metrics.selecao_graficos_matrizes?.total_tokens_usados || 0,
        duracao_ms: metrics.selecao_graficos_matrizes?.duration_ms || 0,
        tentativas: metrics.selecao_graficos_matrizes?.attempts || 1,
        rate_limits: metrics.selecao_graficos_matrizes?.rate_limit_retries || 0,
        status_http: 200
      },
      movimentos_vencedor_testes: {
        max_tokens: metrics.movimentos_vencedor_testes?.max_tokens || 700,
        estimated_input_tokens: metrics.movimentos_vencedor_testes?.estimated_input_tokens || 0,
        prompt_tokens: metrics.movimentos_vencedor_testes?.prompt_tokens_usados || 0,
        completion_tokens: metrics.movimentos_vencedor_testes?.completion_tokens_usados || 0,
        total_tokens: metrics.movimentos_vencedor_testes?.total_tokens_usados || 0,
        prompt_tokens_usados: metrics.movimentos_vencedor_testes?.prompt_tokens_usados || 0,
        completion_tokens_usados: metrics.movimentos_vencedor_testes?.completion_tokens_usados || 0,
        total_tokens_usados: metrics.movimentos_vencedor_testes?.total_tokens_usados || 0,
        duracao_ms: metrics.movimentos_vencedor_testes?.duration_ms || 0,
        tentativas: metrics.movimentos_vencedor_testes?.attempts || 1,
        rate_limits: metrics.movimentos_vencedor_testes?.rate_limit_retries || 0,
        status_http: 200
      }
    },
    tamanho_contexto_por_etapa: {
      visao_veredito_territorio: metrics.visao_veredito_territorio?.input_chars || 0,
      swot_causalidade_ambiente: metrics.swot_causalidade_ambiente?.input_chars || 0,
      selecao_graficos_matrizes: metrics.selecao_graficos_matrizes?.input_chars || 0,
      movimentos_vencedor_testes: metrics.movimentos_vencedor_testes?.input_chars || 0
    },
    tentativas_por_etapa: job.attempts_by_step || {},
    rate_limit_attempts_por_etapa: job.rate_limit_attempts_by_step || {},
    timeouts: job.timeouts || [],
    erros_429: job.erros_429 || []
  };

  return {
    visao_estrategica_texto: mod1.visao_estrategica_texto,
    bairros: mod1.bairros || [],
    zona_exclusao: mod1.zona_exclusao,
    swot: swotClean,
    auditoria_ambiente: {
      pestel: pestelClean,
      ishikawa: mod2.ishikawa
    },
    matrizes_estrategicas: mod3.matrizes_estrategicas,
    mix_marketing: mod3.mix_marketing,
    movimentos_culturais: mod4.movimentos_culturais,
    movimento_vencedor: {
      nome: mod4.movimentos_culturais?.veredicto_final?.nome_movimento,
      justificativa: mod4.movimentos_culturais?.veredicto_final?.justificativa_densa,
      condicao_de_sucesso: mod4.movimentos_culturais?.veredicto_final?.condicao_de_sucesso,
      risco_de_erro: mod4.movimentos_culturais?.veredicto_final?.risco_de_erro
    },
    verbalizacoes_reais: verbalizacoesList,
    graficos_selecionados: graficosAnaliticosMontados,
    plano_de_validacao: mod4.plano_de_validacao,
    generation_debug: generationDebug
  };
}

// 10. HANDLER PRINCIPAL (SERVERLESS HANDLER)
module.exports = async function handler(req, res) {
  const handlerStartTime = Date.now();
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

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

    // ROTA DE DIAGNÓSTICO (action === "diag")
    if (action === "diag") {
      const loc = locatePresentation();
      return res.status(200).json({
        server_time: new Date().toISOString(),
        node_env: process.env.NODE_ENV || "development",
        build_commit: process.env.VERCEL_GIT_COMMIT_SHA || "local_development",
        model: GROQ_MODEL,
        step: "visao_veredito_territorio",
        response_format_used: false,
        cwd: process.cwd(),
        dirname: __dirname,
        presentation: loc,
        require_presentation: REQUIRE_PRESENTATION,
        supabase_url_configured: Boolean(SUPABASE_URL),
        groq_api_key_configured: Boolean(apiKey)
      });
    }

    // ROTA POST: Criar e Iniciar Novo Job
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
          error_code: "PAYLOAD_TOO_LARGE",
          error: "O texto de entrada excede o limite seguro de caracteres.",
          details: "Limite: 10.000 caracteres."
        });
      }

      const newJobId = "job_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9);
      const postDurationMs = Date.now() - handlerStartTime;

      const newJob = {
        job_id: newJobId,
        idea: combinedInput,
        report_to_audit: reportToAudit,
        status: "queued",
        current_step: 0,
        total_steps: MODULE_DEFINITIONS.length,
        completed_steps: [],
        partial_results: {},
        context_snapshot: null,
        step_metrics: {},
        attempts_by_step: {},
        performance: {
          post_response_ms: postDurationMs,
          supabase_ms: 0,
          ibge_ms: 0,
          presentation_ms: 0,
          groq_ms_por_etapa: {},
          total_ms: 0
        },
        final_result: null,
        message: "Job criado com sucesso. Polling iniciado para preparação de fontes oficiais.",
        retry_after_at: null,
        is_processing: false,
        lock_timestamp: null,
        last_error: null,
        error_code: null,
        retryable: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        finished_at: null
      };

      await saveJob(newJob);

      return res.status(200).json({
        success: true,
        job_id: newJobId,
        status: "queued",
        current_step: 0,
        total_steps: MODULE_DEFINITIONS.length,
        estimated_seconds: 30,
        message: "Job criado com sucesso. Polling iniciado para preparação de fontes oficiais."
      });
    }

    // ROTA GET/POST: Status do Job (STEP-DRIVEN EXECUTION ENGINE)
    if (action === "status") {
      if (!jobId) {
        return res.status(400).json({ 
          error_code: "MISSING_JOB_ID",
          error: "Parâmetro job_id obrigatório." 
        });
      }

      const getRes = await getJob(jobId);
      const job = getRes.job;
      const storageSource = getRes.source;

      if (!job) {
        return res.status(404).json({ 
          error_code: "JOB_NOT_FOUND",
          error: "Job não encontrado ou expirado.",
          job_id_recebido: jobId,
          storage: "supabase"
        });
      }

      const now = Date.now();
      const currentStepDef = MODULE_DEFINITIONS[job.current_step] || {};
      const currentAttempt = (job.attempts_by_step && job.attempts_by_step[currentStepDef.id]) || 0;

      // Resposta padronizada de status
      function formatStatusResponse(jobData, overrides = {}) {
        const stepDef = MODULE_DEFINITIONS[jobData.current_step] || {};
        const stepAttempt = (jobData.attempts_by_step && jobData.attempts_by_step[stepDef.id]) || 0;
        const rateLimitAttempts = (jobData.rate_limit_attempts_by_step && jobData.rate_limit_attempts_by_step[stepDef.id]) || 0;
        const lockMs = jobData.lock_timestamp ? new Date(jobData.lock_timestamp).getTime() : now;
        const stepElapsed = jobData.is_processing ? (now - lockMs) : 0;
        
        let waitSeconds = 0;
        if (jobData.retry_after_at) {
          const rTime = new Date(jobData.retry_after_at).getTime();
          if (rTime > now) {
            waitSeconds = Math.ceil((rTime - now) / 1000);
          }
        }

        const diag = jobData.rate_limit_diagnostic || {};
        const limitType = diag.limit_type || (jobData.status === "waiting_rate_limit" ? "tokens" : null);

        return {
          job_id: jobData.job_id,
          status: jobData.status,
          current_step: jobData.current_step,
          current_module_label: stepDef.label || "Conclusão",
          step: stepDef.id || "conclusao",
          attempt: stepAttempt,
          max_attempts: 3,
          rate_limit_attempts: rateLimitAttempts,
          max_rate_limit_attempts: 3,
          is_processing: Boolean(jobData.is_processing),
          lock_timestamp: jobData.lock_timestamp || null,
          updated_at: jobData.updated_at,
          last_error: jobData.last_error || null,
          error_code: jobData.error_code || null,
          limit_type: limitType,
          retry_after_at: jobData.retry_after_at || null,
          next_allowed_request_at: jobData.next_allowed_request_at || jobData.retry_after_at || null,
          wait_seconds: waitSeconds,
          last_rate_limit_headers: diag.headers || jobData.last_rate_limit_headers || {},
          last_rate_limit_error: jobData.last_rate_limit_error || null,
          rate_limit_diagnostic: diag,
          step_started_at: jobData.step_metrics?.[stepDef.id]?.started_at || jobData.lock_timestamp || null,
          step_elapsed_ms: stepElapsed,
          completed_steps: jobData.completed_steps || [],
          total_steps: MODULE_DEFINITIONS.length,
          progress_percent: Math.round(((jobData.completed_steps || []).length / MODULE_DEFINITIONS.length) * 100),
          estimated_remaining_seconds: jobData.status === "completed" ? 0 : Math.max(3, (MODULE_DEFINITIONS.length - (jobData.completed_steps || []).length) * 5),
          message: jobData.message,
          storage_source: storageSource,
          server_timestamp: new Date().toISOString(),
          ...overrides
        };
      }

      if (job.status === "completed") {
        return res.status(200).json(formatStatusResponse(job, { success: true }));
      }

      if (job.status === "failed") {
        return res.status(200).json(formatStatusResponse(job, { success: false }));
      }

      if (job.status === "cancelled") {
        return res.status(200).json(formatStatusResponse(job, { success: false }));
      }

      // Checagem de Rate Limit Ativo (retry_after_at)
      if (job.retry_after_at) {
        const retryTime = new Date(job.retry_after_at).getTime();
        if (now < retryTime) {
          const waitSec = Math.ceil((retryTime - now) / 1000);
          return res.status(200).json(formatStatusResponse(job, {
            success: true,
            status: "waiting_rate_limit",
            estimated_remaining_seconds: waitSec + 5,
            message: `Limite de taxa da Groq ativo. Aguardando liberação (${waitSec}s restantes)...`
          }));
        }
      }

      // Tentativa de Aquisição de Lock Atômico
      const lockResult = await acquireJobLock(jobId);
      if (!lockResult.acquired) {
        const currentLockJob = lockResult.job || job;
        return res.status(200).json(formatStatusResponse(currentLockJob, { success: true }));
      }

      // Lock Adquirido com Sucesso: Executar EXATAMENTE UMA etapa
      const activeJob = lockResult.job;
      if (activeJob.current_step < MODULE_DEFINITIONS.length) {
        const stepDef = MODULE_DEFINITIONS[activeJob.current_step];
        const stepStartTime = Date.now();
        
        activeJob.status = "running";
        activeJob.attempts_by_step = activeJob.attempts_by_step || {};
        activeJob.rate_limit_attempts_by_step = activeJob.rate_limit_attempts_by_step || {};
        activeJob.attempts_by_step[stepDef.id] = (activeJob.attempts_by_step[stepDef.id] || 0) + 1;
        const currentAttemptNumber = activeJob.attempts_by_step[stepDef.id];
        await saveJob(activeJob);

        // ETAPA 0: SOURCE PREPARATION (CARREGAMENTO DAS FONTES OFICIAIS)
        if (stepDef.id === "source_preparation" || stepDef.isPreparationStep) {
          try {
            console.log(`[STEP 0 START] Job ${activeJob.job_id}: Carregando fontes oficiais...`);
            const [supabaseRes, ibgeRes, culturalRes] = await Promise.all([
              loadSupabaseResearchData(),
              loadIbgeData(),
              loadCulturalMovements()
            ]);

            activeJob.context_snapshot = {
              totalN: supabaseRes.data.totalN,
              indicators: supabaseRes.data.indicators,
              verbatims: supabaseRes.data.verbatims.slice(0, 30),
              ibge: ibgeRes.data,
              cultural_movements: culturalRes.data.movimentos,
              cultural_movements_meta: {
                presentation_status: culturalRes.data.presentation_status,
                presentation_path: culturalRes.data.presentation_path,
                presentation_chars: culturalRes.data.presentation_chars,
                checked_presentation_paths: culturalRes.data.checked_presentation_paths,
                presentation_fallback_used: culturalRes.data.presentation_fallback_used
              }
            };

            activeJob.performance = activeJob.performance || {};
            activeJob.performance.supabase_ms = supabaseRes.duration_ms;
            activeJob.performance.ibge_ms = ibgeRes.duration_ms;
            activeJob.performance.presentation_ms = culturalRes.duration_ms;

            activeJob.step_metrics = activeJob.step_metrics || {};
            activeJob.step_metrics[stepDef.id] = {
              started_at: new Date(stepStartTime).toISOString(),
              finished_at: new Date().toISOString(),
              duration_ms: Date.now() - stepStartTime,
              input_chars: 0,
              output_chars: JSON.stringify(activeJob.context_snapshot).length,
              attempts: 1
            };

            activeJob.completed_steps = activeJob.completed_steps || [];
            if (!activeJob.completed_steps.includes(stepDef.id)) {
              activeJob.completed_steps.push(stepDef.id);
            }
            activeJob.current_step = 1;
            activeJob.last_error = null;
            activeJob.error_code = null;
            activeJob.message = "Fontes oficiais carregadas com sucesso. Avançando para a Tese Estratégica...";

            await releaseJobLock(activeJob);

            console.log(`[STEP 0 COMPLETED] Job ${activeJob.job_id} avançou para Step 1 em ${Date.now() - stepStartTime}ms.`);
            return res.status(200).json(formatStatusResponse(activeJob, { success: true, step_elapsed_ms: Date.now() - stepStartTime }));

          } catch (prepErr) {
            console.error(`[STEP 0 ERROR] Job ${activeJob.job_id}:`, prepErr);
            activeJob.status = "failed";
            activeJob.error_code = prepErr.error_code || (prepErr.message.includes("PRESENTATION") ? "PRESENTATION_NOT_AVAILABLE" : "SUPABASE_NOT_CONFIGURED");
            activeJob.message = `Falha ao preparar fontes oficiais: ${prepErr.message}`;
            activeJob.last_error = prepErr.message;
            activeJob.retryable = false;
            await releaseJobLock(activeJob);

            return res.status(200).json(formatStatusResponse(activeJob, { success: false, step_elapsed_ms: Date.now() - stepStartTime }));
          }
        }

        // ETAPAS 1 A 4: CHAMADAS À GROQ
        let stepPayloadStr = "";
        try {
          if (!apiKey) {
            throw new Error("GROQ_NOT_CONFIGURED: Chave da API Groq ausente no servidor.");
          }

          if (!activeJob.context_snapshot) {
            throw new Error("SNAPSHOT_MISSING: O snapshot de dados oficiais não foi inicializado.");
          }

          const stepContext = buildStepContext(stepDef.id, activeJob.context_snapshot, activeJob);
          stepPayloadStr = JSON.stringify({
            analysisTarget: {
              idea: activeJob.idea,
              report_to_audit: activeJob.report_to_audit || null
            },
            analysisContext: stepContext
          });

          // Pré-checagem de Saldo Conhecido de Tokens da Groq
          const estimatedTokensForThisCall = Math.ceil(((stepDef.systemPrompt?.length || 0) + (stepPayloadStr?.length || 0)) / 3.8) + (stepDef.maxTokens || 700);
          if (GROQ_RATE_LIMIT_TRACKER.remainingTokens !== null && GROQ_RATE_LIMIT_TRACKER.remainingTokens <= 0) {
            const resetWaitSec = GROQ_RATE_LIMIT_TRACKER.resetTokensSeconds || GROQ_RATE_LIMIT_TRACKER.retryAfterSeconds || 60;
            const nextAllowedDate = new Date(Date.now() + (resetWaitSec * 1000));
            const nextAllowedIso = nextAllowedDate.toISOString();
            const hhMm = nextAllowedDate.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" });

            console.warn(`[GROQ PREVENTIVE RATE LIMIT] Saldo de tokens conhecido (${GROQ_RATE_LIMIT_TRACKER.remainingTokens}) insuficiente para ${stepDef.label} (estimado: ${estimatedTokensForThisCall}). Aguardando janela de ${resetWaitSec}s...`);

            // Reverter contagem de tentativa
            activeJob.attempts_by_step[stepDef.id] = Math.max(0, (activeJob.attempts_by_step[stepDef.id] || 0) - 1);
            activeJob.status = "waiting_rate_limit";
            activeJob.retry_after_at = nextAllowedIso;
            activeJob.next_allowed_request_at = nextAllowedIso;
            activeJob.rate_limit_diagnostic = {
              limit_type: "tokens",
              headers: GROQ_RATE_LIMIT_TRACKER.lastHeaders || {},
              wait_seconds: resetWaitSec,
              rate_limit_attempts: (activeJob.rate_limit_attempts_by_step && activeJob.rate_limit_attempts_by_step[stepDef.id]) || 0,
              next_allowed_request_at: nextAllowedIso,
              hh_mm: hhMm,
              remaining_tokens: GROQ_RATE_LIMIT_TRACKER.remainingTokens,
              estimated_request_tokens: estimatedTokensForThisCall
            };
            activeJob.message = `Limite de tokens da Groq. A etapa ${activeJob.current_step} será retomada após ${hhMm} (${resetWaitSec}s restantes)...`;
            await releaseJobLock(activeJob);

            return res.status(200).json(formatStatusResponse(activeJob, {
              success: true,
              status: "waiting_rate_limit",
              wait_seconds: resetWaitSec,
              estimated_remaining_seconds: resetWaitSec + 5,
              message: activeJob.message
            }));
          }

          let groqResult;
          const stepTemperature = stepDef.id === "visao_veredito_territorio" ? 0.55 : 0.2;
          try {
            groqResult = await callGroqStep(
              apiKey,
              stepDef.systemPrompt,
              stepPayloadStr,
              stepDef.maxTokens || 700,
              25000,
              stepDef.label,
              stepTemperature
            );
            validateModuleResult(stepDef.id, groqResult.result, activeJob.context_snapshot);
          } catch (firstAttemptErr) {
            if (firstAttemptErr.error_code === "GROQ_EMPTY_GENERATION" || firstAttemptErr.message.includes("GROQ_INVALID_JSON")) {
              console.warn(`[RECOVERY RETRY] Reexecutando ${stepDef.id} com prompt restrito após erro JSON:`, firstAttemptErr.message);
              const recoverySystemPrompt = `${stepDef.systemPrompt}\n\nATENCAO: Sua resposta anterior nao pode ser validada. Retorne SOMENTE um objeto JSON valido, curto e completo, seguindo exatamente as chaves indicadas. Nao inclua markdown, explicacoes externas ou campos extras.`;
              groqResult = await callGroqStep(
                apiKey,
                recoverySystemPrompt,
                stepPayloadStr,
                stepDef.maxTokens || 750,
                25000,
                `${stepDef.label} (Recovery Retry)`,
                stepTemperature
              );
              validateModuleResult(stepDef.id, groqResult.result, activeJob.context_snapshot);
            } else {
              throw firstAttemptErr;
            }
          }

          activeJob.partial_results = activeJob.partial_results || {};
          activeJob.partial_results[stepDef.id] = groqResult.result;
          activeJob.completed_steps = activeJob.completed_steps || [];
          if (!activeJob.completed_steps.includes(stepDef.id)) {
            activeJob.completed_steps.push(stepDef.id);
          }

          activeJob.performance = activeJob.performance || {};
          activeJob.performance.groq_ms_por_etapa = activeJob.performance.groq_ms_por_etapa || {};
          activeJob.performance.groq_ms_por_etapa[stepDef.id] = groqResult.durationMs;

          activeJob.step_metrics = activeJob.step_metrics || {};
          activeJob.step_metrics[stepDef.id] = {
            started_at: new Date(stepStartTime).toISOString(),
            finished_at: new Date().toISOString(),
            duration_ms: groqResult.durationMs,
            input_chars: groqResult.inputChars,
            output_chars: groqResult.outputChars,
            max_tokens: stepDef.maxTokens,
            estimated_input_tokens: Math.ceil((stepPayloadStr.length + stepDef.systemPrompt.length) / 3.8),
            prompt_tokens_usados: groqResult.promptTokens,
            completion_tokens_usados: groqResult.completionTokens,
            total_tokens_usados: groqResult.totalTokens,
            attempts: currentAttemptNumber,
            rate_limit_retries: (activeJob.rate_limit_attempts_by_step && activeJob.rate_limit_attempts_by_step[stepDef.id]) || 0
          };

          activeJob.current_step += 1;
          activeJob.last_error = null;
          activeJob.error_code = null;
          activeJob.retry_after_at = null;

          // Se completou todas as etapas, montar relatório final
          if (activeJob.current_step >= MODULE_DEFINITIONS.length) {
            activeJob.performance.total_ms = Date.now() - new Date(activeJob.created_at).getTime();
            activeJob.final_result = assembleFinalReport(activeJob, activeJob.context_snapshot);
            activeJob.status = "completed";
            activeJob.message = "Relatório estratégico concluído com sucesso!";
            activeJob.finished_at = new Date().toISOString();
          } else {
            const nextStep = MODULE_DEFINITIONS[activeJob.current_step];
            activeJob.message = `Etapa '${stepDef.label}' concluída com sucesso. Avançando para ${nextStep.label}...`;
          }

          await releaseJobLock(activeJob);
          return res.status(200).json(formatStatusResponse(activeJob, { success: true, step_elapsed_ms: groqResult.durationMs }));

        } catch (err) {
          console.error(`[STEP ERROR] Job ${activeJob.job_id} na etapa ${stepDef.id}:`, {
            status: err.status || null,
            error_code: err.error_code || null,
            model: GROQ_MODEL,
            max_tokens: stepDef.maxTokens || null,
            estimated_prompt_tokens: Math.ceil(((stepPayloadStr?.length || 0) + (stepDef.systemPrompt?.length || 0)) / 4),
            headers: err.rateLimitHeaders || {},
            error_body: (err.rawErrorBody || err.message || "").slice(0, 500),
            step: stepDef.id,
            attempt: currentAttemptNumber,
            timestamp: new Date().toISOString()
          });

          if (err.isModelInvalid) {
            activeJob.status = "failed";
            activeJob.error_code = "GROQ_MODEL_INVALID";
            activeJob.message = `O modelo Groq configurado (${err.model_used}) é inválido ou foi descontinuado: ${err.message}`;
            activeJob.last_error = err.message;
            activeJob.retryable = false;
          } else if (err.isQuotaExhausted || err.error_code === "GROQ_QUOTA_EXHAUSTED") {
            activeJob.status = "failed";
            activeJob.error_code = "GROQ_QUOTA_EXHAUSTED";
            activeJob.message = "A cota diária ou limite de tokens da Groq foi atingida. O processamento foi interrompido sem retentativas.";
            activeJob.last_error = err.message;
            activeJob.retryable = false;
          } else if (err.status === 429) {
            // Reverter a contagem de tentativa normal com proteção contra valores negativos
            activeJob.attempts_by_step[stepDef.id] = Math.max(0, (activeJob.attempts_by_step[stepDef.id] || 0) - 1);

            activeJob.rate_limit_attempts_by_step[stepDef.id] = (activeJob.rate_limit_attempts_by_step[stepDef.id] || 0) + 1;
            const rateLimitCount = activeJob.rate_limit_attempts_by_step[stepDef.id];

            // Identificar se o gargalo principal foi por Tokens ou por Requisições
            let limitType = "requisições";
            if (err.resetTokensSeconds && (!err.resetRequestsSeconds || err.resetTokensSeconds >= err.resetRequestsSeconds)) {
              limitType = "tokens";
            } else if (err.rawErrorBody?.includes("TPM") || err.rawErrorBody?.includes("tokens") || err.rawErrorBody?.includes("token rate")) {
              limitType = "tokens";
            }

            // Para limite de taxa (tokens ou requisições): permitir até 3 tentativas com respeito estrito às janelas de reset
            const maxAllowedRateAttempts = 3;

            if (rateLimitCount > maxAllowedRateAttempts) {
              activeJob.status = "failed";
              activeJob.error_code = limitType === "tokens" ? "GROQ_TOKEN_LIMIT_EXHAUSTED" : "GROQ_RATE_LIMIT_EXHAUSTED";
              activeJob.message = `Limite de ${limitType} da Groq excedeu o máximo de 3 tentativas na etapa ${stepDef.label}.`;
              activeJob.last_error = err.message;
              activeJob.retryable = true;
            } else {
              const exponentialSec = 10 * Math.pow(2, rateLimitCount - 1);
              const headerCandidates = [
                err.retryAfterSeconds,
                err.resetTokensSeconds,
                err.resetRequestsSeconds
              ].filter(v => typeof v === 'number' && v > 0);

              let waitSeconds;
              if (headerCandidates.length > 0) {
                // Respeitar integralmente o reset da Groq sem limitar artificialmente a 300s
                waitSeconds = Math.max(...headerCandidates);
              } else {
                waitSeconds = exponentialSec;
              }
              // Garantir no mínimo 3 segundos
              waitSeconds = Math.max(3, waitSeconds);

              const nextAllowedDate = new Date(Date.now() + (waitSeconds * 1000));
              const nextAllowedAt = nextAllowedDate.toISOString();
              
              // Formatar horário HH:MM para exibição amigável
              const hhMm = nextAllowedDate.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" });

              activeJob.status = "waiting_rate_limit";
              activeJob.retry_after_at = nextAllowedAt;
              activeJob.next_allowed_request_at = nextAllowedAt;
              activeJob.last_rate_limit_error = (err.rawErrorBody || err.message || "").slice(0, 300);
              activeJob.last_rate_limit_headers = err.rateLimitHeaders || {};
              activeJob.rate_limit_diagnostic = {
                limit_type: limitType,
                step: activeJob.current_step,
                step_id: stepDef.id,
                step_label: stepDef.label,
                headers: err.rateLimitHeaders || {},
                wait_seconds: waitSeconds,
                rate_limit_attempts: rateLimitCount,
                next_allowed_request_at: nextAllowedAt,
                hh_mm: hhMm,
                prompt_tokens: err.estimatedRequestTokens ? (err.estimatedRequestTokens - (err.maxTokens || 0)) : null,
                completion_tokens: null,
                max_tokens: err.maxTokens || stepDef.maxTokens || null,
                total_estimado: err.estimatedRequestTokens || null,
                total_real: null,
                remaining_tokens_before: err.remainingTokensBefore !== undefined ? err.remainingTokensBefore : GROQ_RATE_LIMIT_TRACKER.remainingTokens
              };

              if (limitType === "tokens") {
                activeJob.message = `Limite de tokens da Groq. A etapa ${activeJob.current_step} será retomada após ${hhMm} (${waitSeconds}s restantes)...`;
              } else {
                activeJob.message = `Limite temporário de requisições. A etapa ${activeJob.current_step} será retomada após ${hhMm} (${waitSeconds}s restantes)...`;
              }
              activeJob.last_error = err.message;
              activeJob.retryable = true;
            }
          } else {
            activeJob.last_error = err.message;
            if (currentAttemptNumber >= 3) {
              activeJob.status = "failed";
              activeJob.error_code = err.error_code || (
                                 err.message.includes("INDICATOR_NOT_FOUND") ? "INDICATOR_NOT_FOUND" :
                                 err.message.includes("INVALID_GRAPH_SELECTION") ? "INVALID_GRAPH_SELECTION" :
                                 err.message.includes("VERBATIM_NOT_FOUND") ? "VERBATIM_NOT_FOUND" :
                                 err.message.includes("INVALID_MOVEMENT_WINNER") ? "INVALID_MOVEMENT_WINNER" :
                                 err.message.includes("GROQ_TIMEOUT") ? "GROQ_TIMEOUT" :
                                 err.message.includes("json_validate_failed") ? "GROQ_JSON_VALIDATE_FAILED" :
                                 err.message.includes("GROQ_INVALID_JSON") ? "GROQ_INVALID_JSON" :
                                 err.message.includes("GROQ_EMPTY_GENERATION") ? "GROQ_EMPTY_GENERATION" :
                                 "STEP_EXECUTION_FAILED"
                              );
              activeJob.message = `Falha ao executar a etapa ${stepDef.label}: ${err.message}`;
              activeJob.retryable = true;
            } else {
              activeJob.status = "running";
              activeJob.message = `Tentativa ${currentAttemptNumber}/3: Reexecutando ${stepDef.label}...`;
            }
          }

          await releaseJobLock(activeJob);
          return res.status(200).json(formatStatusResponse(activeJob, { success: activeJob.status !== "failed", step_elapsed_ms: Date.now() - stepStartTime }));
        }
      }

      return res.status(200).json(formatStatusResponse(activeJob, { success: true }));
    }

    // ROTA GET: Resultado do Job
    if (action === "result") {
      if (!jobId) {
        return res.status(400).json({ 
          error_code: "MISSING_JOB_ID",
          error: "Parâmetro job_id obrigatório." 
        });
      }
      const getRes = await getJob(jobId);
      const job = getRes.job;
      if (!job) {
        return res.status(404).json({ 
          error_code: "JOB_NOT_FOUND",
          error: "Job não encontrado.",
          job_id_recebido: jobId,
          storage: "supabase"
        });
      }
      if (job.status !== "completed") {
        return res.status(400).json({ 
          error_code: "JOB_NOT_COMPLETED",
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
        return res.status(400).json({ 
          error_code: "MISSING_JOB_ID",
          error: "Parâmetro job_id obrigatório." 
        });
      }
      const getRes = await getJob(jobId);
      const job = getRes.job;
      if (job) {
        job.status = "cancelled";
        job.error_code = "JOB_CANCELLED";
        job.message = "Job cancelado pelo usuário.";
        job.is_processing = false;
        job.lock_timestamp = null;
        await saveJob(job);
      }
      return res.status(200).json({ success: true, message: "Job cancelado com sucesso." });
    }

    return res.status(400).json({ error: "Ação não suportada." });

  } catch (error) {
    return res.status(500).json({
      error_code: "INTERNAL_SERVER_ERROR",
      error: "Erro interno no Servidor: " + error.message,
      details: error.stack || error.message
    });
  }
};
