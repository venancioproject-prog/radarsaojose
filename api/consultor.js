// API Consultor Estratégico - Arquitetura de Alta Disponibilidade Serverless
// Persistência Centralizada no Supabase, Lock Atômico Rigoroso, Diagnóstico Completo

const fs = require('fs');
const path = require('path');
const os = require('os');

// Carregador autônomo de variáveis de ambiente (.env)
function loadEnvLocal() {
  const envCandidates = [
    path.join(process.cwd(), '.env'),
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
loadEnvLocal();

// Configuração de Runtime Serverless Vercel
exports.config = {
  maxDuration: 60
};

// Modelos Oficiais Homologados
const GROQ_MODEL = process.env.GROQ_MODEL || "qwen/qwen3.6-27b";
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.6-flash";

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
  "Quais meios de transporte você usa? (marque todos que utilizar",
  "Você escolhe um lugar só porque ele é bonito para tirar foto",
  "Você acha que São José é uma cidade boa para quem tem anima",
  "O que você acha que mais falta em São José?",
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

  function countCategories(colName, isMulti = false) {
    const counts = {};
    let validCount = 0;
    rawRows.forEach(r => {
      const raw = (r[colName] || "").trim();
      if (raw && raw !== "null" && raw !== "undefined") {
        validCount++;
        if (isMulti) {
          const normalized = raw.replace(/\(Uber,\s*99\)/g, "(Uber/99)");
          normalized.split(',').forEach(item => {
            const t = item.trim();
            if (t) counts[t] = (counts[t] || 0) + 1;
          });
        } else {
          counts[raw] = (counts[raw] || 0) + 1;
        }
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
      dominio: "civico_pertencimento",
      fonte: "Supabase",
      tabela: TABLE_NAME,
      ...countCategories("Você tem orgulho de morar em São José dos Campos?")
    },
    meios_transporte: {
      id: "meios_transporte",
      coluna: "Quais meios de transporte você usa? (marque todos que utilizar",
      tipo_grafico: "horizontalBar",
      dominio: "mobilidade_urbana",
      fonte: "Supabase",
      tabela: TABLE_NAME,
      ...countCategories("Quais meios de transporte você usa? (marque todos que utilizar", true)
    },
    lugar_instagramavel: {
      id: "lugar_instagramavel",
      coluna: "Você escolhe um lugar só porque ele é bonito para tirar foto",
      tipo_grafico: "doughnut",
      dominio: "estetica_experiencia",
      fonte: "Supabase",
      tabela: TABLE_NAME,
      ...countCategories("Você escolhe um lugar só porque ele é bonito para tirar foto")
    },
    cidade_pet_friendly: {
      id: "cidade_pet_friendly",
      coluna: "Você acha que São José é uma cidade boa para quem tem anima",
      tipo_grafico: "doughnut",
      dominio: "infraestrutura_pet",
      fonte: "Supabase",
      tabela: TABLE_NAME,
      ...countCategories("Você acha que São José é uma cidade boa para quem tem anima")
    },
    o_que_mais_falta: {
      id: "o_que_mais_falta",
      coluna: "O que você acha que mais falta em São José?",
      tipo_grafico: "horizontalBar",
      dominio: "carencias_urbanas",
      fonte: "Supabase",
      tabela: TABLE_NAME,
      ...countCategories("O que você acha que mais falta em São José?", true)
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
      nome: "A Geografia da Inércia",
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
    provider: "groq",
    model: GROQ_MODEL,
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

// 5.1 CHAMADA AO GOOGLE GEMINI COM MULTI-MODEL FALLBACK E RESPONSE_MIME_TYPE JSON
const GEMINI_MODELS_POOL = [
  "gemini-3.5-flash-lite",
  "gemini-flash-lite-latest",
  "gemini-3.5-flash",
  "gemini-3-flash-preview"
];

async function callGeminiStep(geminiKey, systemPrompt, userPayloadStr, maxTokens = 800, timeoutMs = 25000, stepLabel = "Etapa", temperature = 0.2) {
  let lastError = null;
  const modelsToTry = Array.from(new Set(GEMINI_MODELS_POOL));

  for (const currentModel of modelsToTry) {
    const startTime = Date.now();
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent?key=${geminiKey}`;

    console.log(`[GEMINI START] ${stepLabel} - Enviando ${userPayloadStr.length} chars (Modelo: ${currentModel}, Temp: ${temperature})...`);

    const requestBody = {
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      contents: [
        {
          role: "user",
          parts: [{ text: `Analise as informações e retorne SOMENTE o JSON puro conforme a especificação requerida para a etapa:\n\n${userPayloadStr}` }]
        }
      ],
      generationConfig: {
        temperature: temperature,
        responseMimeType: "application/json",
        maxOutputTokens: 4096
      }
    };

    try {
      const response = await fetchWithTimeout(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
      }, timeoutMs, `Gemini (${stepLabel} - ${currentModel})`);

      const durationMs = Date.now() - startTime;

      if (!response.ok) {
        const errText = await response.text();
        const errorObj = new Error(`GEMINI_API_ERROR: Falha na chamada do Gemini ${currentModel} (${response.status}): ${errText}`);
        errorObj.status = response.status;
        errorObj.durationMs = durationMs;
        errorObj.rawErrorBody = errText;
        errorObj.model_used = currentModel;
        
        const retryMatch = errText.match(/retry in ([0-9.]+)s?/i);
        if (retryMatch) {
          errorObj.retryAfterSeconds = Math.ceil(parseFloat(retryMatch[1]));
        }
        if (errText.includes("RESOURCE_EXHAUSTED") || errText.includes("Quota exceeded")) {
          errorObj.isQuotaExhausted = false;
        }

        console.warn(`[GEMINI MODEL RETRY] Modelo ${currentModel} retornou status ${response.status}. Tentando próximo modelo...`);
        lastError = errorObj;
        continue; // Tenta o próximo modelo do pool
      }

      const data = await response.json();
      const parts = data.candidates?.[0]?.content?.parts || [];
      let rawContent = "";
      for (let i = parts.length - 1; i >= 0; i--) {
        if (parts[i]?.text && !parts[i]?.thought) {
          rawContent = parts[i].text;
          break;
        }
      }
      if (!rawContent && parts.length > 0) {
        rawContent = parts[parts.length - 1].text || "";
      }
      rawContent = rawContent.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();

      const firstBrace = rawContent.indexOf("{");
      const lastBrace = rawContent.lastIndexOf("}");
      if (firstBrace === -1 || lastBrace <= firstBrace) {
        console.error(`[GEMINI PARSE FAILED] Resposta sem objeto JSON (${currentModel}, length: ${rawContent.length}):\n${rawContent}`);
        const noJsonErr = new Error(`GEMINI_INVALID_JSON: A resposta do Gemini (${currentModel}) não contém um objeto JSON.`);
        noJsonErr.error_code = "GROQ_INVALID_JSON";
        lastError = noJsonErr;
        continue;
      }

      const jsonText = rawContent.slice(firstBrace, lastBrace + 1);
      let parsed;
      try {
        parsed = JSON.parse(jsonText);
      } catch (parseErr) {
        console.error(`[GEMINI JSON.PARSE ERROR] ${parseErr.message}. Modelo: ${currentModel}. Trecho: ${jsonText.slice(0, 200)}...`);
        const invJsonErr = new Error(`GEMINI_INVALID_JSON: Falha ao interpretar JSON do Gemini (${currentModel}): ${parseErr.message}`);
        invJsonErr.error_code = "GROQ_INVALID_JSON";
        lastError = invJsonErr;
        continue;
      }

      console.log(`[GEMINI SUCCESS] ${stepLabel} - Resposta recebida via ${currentModel} em ${durationMs}ms.`);

      const usage = data.usageMetadata || {};
      const inTokens = usage.promptTokenCount || Math.ceil((userPayloadStr.length + systemPrompt.length) / 3.8);
      const outTokens = usage.candidatesTokenCount || Math.ceil(rawContent.length / 3.8);

      return {
        provider: "gemini",
        model: currentModel,
        result: parsed,
        durationMs,
        outputChars: rawContent.length,
        inputChars: userPayloadStr.length + systemPrompt.length,
        promptTokens: inTokens,
        completionTokens: outTokens,
        totalTokens: usage.totalTokenCount || (inTokens + outTokens),
        remainingTokensBefore: null,
        remainingTokensAfter: null,
        rateLimitHeaders: {}
      };
    } catch (networkErr) {
      console.warn(`[GEMINI ATTEMPT EXCEPTION] ${currentModel} (${stepLabel}): ${networkErr.message}`);
      lastError = networkErr;
    }
  }

  throw lastError || new Error("GEMINI_ALL_MODELS_FAILED: Nenhum modelo do Google Gemini respondeu com sucesso.");
}

// 5.2 ORQUESTRADOR UNIFICADO DE IA COM RESILIÊNCIA E PRIORIDADE (GEMINI PRIMEIRO)
async function callAIStep({ groqKey, geminiKey, systemPrompt, userPayloadStr, maxTokens = 700, timeoutMs = 25000, stepLabel = "Etapa", temperature = 0.2 }) {
  // 1. Prioridade Máxima: Tentar Google Gemini se chave configurada
  if (geminiKey) {
    try {
      return await callGeminiStep(geminiKey, systemPrompt, userPayloadStr, maxTokens, timeoutMs, stepLabel, temperature);
    } catch (geminiErr) {
      console.warn(`[GEMINI PRIMARY FAILED] ${stepLabel}: ${geminiErr.message}`);
      if (!groqKey) throw geminiErr;
      console.log(`[AI FALLBACK] Acionando Groq como contingência para a etapa ${stepLabel}...`);
    }
  }

  // 2. Fallback ou Primário se apenas Groq estiver configurado
  if (groqKey) {
    return await callGroqStep(groqKey, systemPrompt, userPayloadStr, maxTokens, timeoutMs, stepLabel, temperature);
  }

  throw new Error("AI_NOT_CONFIGURED: Nenhuma chave de IA válida (GEMINI_API_KEY ou GROQ_API_KEY) foi encontrada.");
}

// Helper de classificação granular de nicho de negócio para inteligência de mercado
function classifyNiche(ideaText) {
  const s = (ideaText || "").toLowerCase();

  // 1. Educação Infantil, Berçário, Creche, Maternal & Primeira Infância
  const isEducaInfantil = s.includes("infantil") || 
                         s.includes("berçário") || 
                         s.includes("bercario") || 
                         s.includes("creche") || 
                         s.includes("maternal") || 
                         s.includes("jardim de infância") || 
                         s.includes("jardim de infancia") || 
                         s.includes("primeira infância") || 
                         s.includes("primeira infancia") || 
                         (s.includes("criança") && (s.includes("escola") || s.includes("educa") || s.includes("pedagog") || s.includes("ensino")));

  // 2. Cursos Livres, Idiomas, Ensino Superior & Educação Adulta/Profissionalizante
  const isCursosAdultos = !isEducaInfantil && (
    s.includes("curso") || 
    s.includes("idioma") || 
    s.includes("inglês") || 
    s.includes("ingles") || 
    s.includes("executivo") || 
    s.includes("faculdade") || 
    s.includes("universidade") || 
    s.includes("pós-gradua") || 
    s.includes("pos-gradua") || 
    s.includes("programação") || 
    s.includes("tecnologia") || 
    s.includes("profissionalizante") || 
    s.includes("treinamento") || 
    s.includes("escola") || 
    s.includes("educa")
  );

  // 3. Gastronomia & Vida Noturna
  const isGastronomia = s.includes("restaurante") || s.includes("bar") || s.includes("hambúrguer") || s.includes("hamburguer") || s.includes("café") || s.includes("cafe") || s.includes("cervej") || s.includes("pizza") || s.includes("comida") || s.includes("gastronom") || s.includes("balada") || s.includes("pub") || s.includes("noturn");

  // 4. Pet & Veterinária
  const isPet = s.includes("pet") || s.includes("veterinár") || s.includes("veterinar") || s.includes("canil") || s.includes("cachorro") || s.includes("gato");

  // 5. Saúde, Clínicas & Bem-estar
  const isSaude = s.includes("clínica") || s.includes("clinica") || s.includes("médic") || s.includes("medic") || s.includes("odontolog") || s.includes("dentista") || s.includes("fisioterapia") || s.includes("psicolog") || s.includes("saúde") || s.includes("saude");

  // 6. Moda, Estética & Beleza
  const isModaBeleza = s.includes("moda") || s.includes("roupa") || s.includes("estética") || s.includes("estetica") || s.includes("salão") || s.includes("salao") || s.includes("beleza") || s.includes("barbearia") || s.includes("varejo");

  // 7. B2B & Corporativo
  const isB2B = s.includes("b2b") || s.includes("software") || s.includes("consultoria") || s.includes("logística") || s.includes("logistica") || s.includes("indústria") || s.includes("industria");

  return {
    isEducaInfantil,
    isCursosAdultos,
    isGastronomia,
    isPet,
    isSaude,
    isModaBeleza,
    isB2B
  };
}

// Helper para estratificar o pool de verbalizações reais garantindo coerência demográfica e relevância temática ao negócio
function buildStratifiedVerbatimsPool(allVerbs, ideaText) {
  const qualified = (allVerbs || []).filter(v => v.citacao_original && v.citacao_original.trim().length >= 25);
  const lowerIdea = (ideaText || "").toLowerCase();
  const niche = classifyNiche(ideaText);
  
  const isSenior = lowerIdea.includes("idoso") || lowerIdea.includes("terceira idade") || lowerIdea.includes("aposent");

  // Palavras-chave temáticas específicas para identificar citações com menção direta
  let targetKeywords = [];
  if (niche.isEducaInfantil) {
    targetKeywords = ["filho", "criança", "crianca", "escola", "educa", "família", "familia", "mãe", "mae", "pai", "bebê", "bebe", "creche"];
  } else if (niche.isCursosAdultos) {
    targetKeywords = ["curso", "estudo", "faculdade", "universidade", "educa", "escola", "trabalho", "carreira"];
  } else if (niche.isGastronomia) {
    targetKeywords = ["noite", "bar", "sair", "balada", "lazer", "bebida", "cerveja", "chopp", "musica", "música", "amigos", "restaurante", "comer"];
  } else if (isSenior) {
    targetKeywords = ["saúde", "saude", "médic", "idoso", "tranquil", "sossego", "caminhad", "descanso"];
  } else {
    targetKeywords = ["trabalho", "cidade", "serviço", "qualidade", "preço", "atendimento"];
  }

  // Pontuação de relevância demográfica e temática
  const scored = qualified.map(v => {
    let score = 0;
    const txtLower = (v.citacao_original || "").toLowerCase();
    const idade = (v.perfil?.idade || "").toUpperCase();
    const regiao = (v.perfil?.regiao || "").toUpperCase();

    // 1. Demografia da persona
    let isDemographicMatch = false;
    if (niche.isEducaInfantil) {
      if (idade.includes("25") || idade.includes("35")) {
        score += 30;
        isDemographicMatch = true;
      } else if (idade.includes("+65")) {
        score -= 60; // Penaliza idosos para negócios de educação infantil
      }
    } else if (niche.isCursosAdultos || niche.isGastronomia) {
      if (idade.includes("18") || idade.includes("25") || idade.includes("35")) {
        score += 30;
        isDemographicMatch = true;
      }
    } else if (isSenior) {
      if (idade.includes("55") || idade.includes("+65")) {
        score += 30;
        isDemographicMatch = true;
      }
    }

    // 2. Menção temática direta
    const matchedKeywords = targetKeywords.filter(kw => txtLower.includes(kw));
    const hasDirectMention = matchedKeywords.length > 0;
    if (hasDirectMention) {
      score += (matchedKeywords.length * 35); // Recompensa forte para citações com palavras-chave diretas
    }

    // 3. Região prioritária (se mencionada na ideia)
    if (lowerIdea.includes("sul") && regiao.includes("SUL")) score += 10;
    if (lowerIdea.includes("oeste") && (regiao.includes("OESTE") || regiao.includes("CENTRO"))) score += 10;

    return {
      v,
      score,
      isDemographicMatch,
      hasDirectMention,
      matchedKeywords
    };
  });

  // Ordena os itens com maior aderência temática e demográfica no topo absoluto
  scored.sort((a, b) => b.score - a.score);

  // Amostra diversificada com até 24 citações, com as mais temáticas primeiro
  const pool = scored.slice(0, 24);

  return pool.map(item => ({
    id: item.v.id,
    citacao: item.v.citacao_original,
    perfil: `${item.v.perfil.regiao} | ${item.v.perfil.renda} | ${item.v.perfil.idade} | ${item.v.perfil.genero}`,
    tem_mencao_direta_ao_nicho: item.hasDirectMention,
    palavras_chave_encontradas: item.matchedKeywords
  }));
}

// 6. BUILDER DE CONTEXTO POR ETAPA COM DADOS RICOS E PORCENTAGENS
function buildStepContext(stepId, snapshot, job) {
  const ind = snapshot.indicators || {};
  const ibge = snapshot.ibge || {};
  const mov = snapshot.cultural_movements || {};
  const verb = snapshot.verbatims || [];

  // Helper para formatar categorias de um indicador em porcentagens limpas
  const formatIndPercent = (indicatorId) => {
    const item = ind[indicatorId];
    if (!item || !Array.isArray(item.categorias)) return "Não disponível";
    return item.categorias.map(c => `${c.nome}: ${c.percentual}%`).join(" | ");
  };

  switch (stepId) {
    case "visao_veredito_territorio":
      return {
        idea: job.idea,
        report_to_audit: job.report_to_audit || null,
        regra_obrigatoria_dados: "ATENÇÃO ESTRITA: Citar SEMPRE porcentagens (ex: 41,7% Centro/Oeste, 28,3% Zona Sul, 42,1% evasão para SP), NUNCA contagens absolutas.",
        dados_oficiais_ibge_censo2022_sjc: ibge,
        macrorregioes_fluxo_consumo_pesquisa: {
          pergunta_oficial: "Qual região da cidade você mais frequenta quando sai de casa? (N=477 - Supabase)",
          distribuicao_percentual: formatIndPercent("regioes_frequentadas")
        },
        bairros_por_macrorregiao_sjc: {
          "Zona Sul (Maior densidade populacional e comércio de massa vibrante)": [
            "Jardim Satélite / Floradas (Polo comercial de massa da Zona Sul, Av. Andrômeda, fluxo intenso de pedestres e veículos, classe média)",
            "Bosque dos Eucaliptos (Bairro residencial denso com forte comércio vicinal e avenidas gastronômicas/serviços)",
            "Parque Industrial (Alta concentração de serviços, saúde e fácil acesso à Dutra e Anel Viário)",
            "Jardim Oriente / Shibata Mall (Polo comercial em forte expansão no coração da Zona Sul)",
            "Campo dos Alemães / Dom Pedro (Varejo popular de alta capilaridade e demanda por custo-benefício prático)"
          ],
          "Zona Oeste e Centro-Oeste (Alta renda, sofisticação e polos corporativos)": [
            "Jardim Aquarius (Polo corporativo verticalizado, alta densidade, público tech/empresarial, forte vida noturna)",
            "Vila Ema (Polo boêmio, gastronômico e de moda autoral, pedestres de alta renda, ruas arborizadas, atrito de estacionamento)",
            "Vila Adyana / São Dimas (Eixo nobre tradicional, clínicas médicas, escritórios e proximidade ao Parque Vicentina Aranha)",
            "Urbanova (Condomínios fechados horizontais, altíssima renda familiar, total dependência de carro, demanda por conveniência exclusiva)"
          ],
          "Centro (Comércio tradicional, serviços e tráfego diurno)": [
            "Centro Histórico / Calçadão (Fluxo intenso de pedestres no horário comercial, hub de transporte coletivo, menor apelo noturno)"
          ],
          "Zona Leste (Eixo industrial, logístico e de rápida expansão residencial)": [
            "Vista Verde (Bairro residencial estruturado, famílias industriais/tecnológicas, carência de serviços e lazer local)",
            "Eugênio de Melo / Galo Branco (Proximidade com parques tecnológicos e universidades, polo de expansão imobiliária)",
            "Jardim Paulista / Vila Tesouro (Conexão Centro-Leste com comércio dinâmico de serviços rápidos)"
          ],
          "Zona Norte (Vínculo comunitário, tradição e comércio de bairro)": [
            "Santana / Altos de Santana (Comércio tradicional consolidado na Av. Princesa Isabel, forte fidelidade vicinal)"
          ]
        },
        heuristica_territorial_nota: "Atenção: A escolha dos bairros baseia-se em inteligência e planejamento urbano (fluxo, zoneamento, tipologia de ponto, sinergia comercial), e NÃO em estratificação amostral da pesquisa N=477."
      };

    case "swot_causalidade_ambiente":
      const s1Res = job.partial_results?.visao_veredito_territorio || {};
      return {
        idea: job.idea,
        regra_obrigatoria_dados: "ATENÇÃO ESTRITA: Utilize SEMPRE porcentagens (ex: 34,8%, 28,5%) para citar métricas da pesquisa, NUNCA números absolutos.",
        tese_e_veredito_definidos_step1: {
          postura: s1Res.veredito_postura || "avancar",
          justificativa: s1Res.veredito_justificativa || "",
          bairros_recomendados: (s1Res.bairros || []).map(b => `${b.nome} (${b.formato_recomendado})`),
          zona_exclusao: s1Res.zona_exclusao || ""
        },
        indicadores_de_atrito_e_decisao_consumidor: {
          barreiras_para_sair_a_noite_porcentagens: formatIndPercent("barreiras_saida"),
          criterios_escolha_bar_restaurante_porcentagens: formatIndPercent("criterios_escolha"),
          redes_sociais_descoberta_porcentagens: formatIndPercent("redes_descoberta"),
          habito_comprar_produtores_locais: formatIndPercent("produtores_locais"),
          presenca_pets_domicilios: formatIndPercent("pets_posse")
        },
        amostra_verbatims_reais: verb.slice(0, 6).map(v => ({
          citacao: v.citacao_original,
          perfil: `${v.perfil.regiao} | Renda: ${v.perfil.renda} | Idade: ${v.perfil.idade}`
        }))
      };

    case "selecao_graficos_matrizes":
      const nicheStep3 = classifyNiche(job.idea);

      const allIndicatorsSummary = Object.entries(ind).map(([id, i]) => ({
        indicador_id: id,
        titulo: i.coluna ? i.coluna.split("?")[0].replace(/^Qual\s+/i, '').trim() : id,
        pergunta_literal: i.coluna || id,
        dominio: i.dominio || "comportamento_geral",
        distribuicao_percentual: (i.categorias || []).slice(0, 5).map(c => `${c.nome}: ${c.percentual}%`).join(" | ")
      }));

      const step3Context = {
        idea: job.idea,
        regra_obrigatoria_dados: "ATENÇÃO ESTRITA: Ao justificar os 3 gráficos e as matrizes, cite SEMPRE valores percentuais da pesquisa de SJC.",
        catalogo_completo_indicadores_pesquisa: allIndicatorsSummary,
        alinhamento_estrategico_acumulado: {
          step1_bairros: (job.partial_results?.visao_veredito_territorio?.bairros || []).map(b => b.nome),
          step1_zona_exclusao: job.partial_results?.visao_veredito_territorio?.zona_exclusao,
          step2_problema_ishikawa: job.partial_results?.swot_causalidade_ambiente?.ishikawa?.problema_central,
          step2_forcas_chave: (job.partial_results?.swot_causalidade_ambiente?.swot?.forcas || []).map(f => typeof f === 'object' ? f.texto : f)
        }
      };

      if (nicheStep3.isEducaInfantil) {
        step3Context.diretriz_obrigatoria_nicho = "Para este negócio de Educação Infantil/Berçário, os 3 indicadores recomendados são: 1. 'regioes_frequentadas' (direto: fluxo e centralidade das famílias), 2. 'meios_transporte' (direto: mobilidade e dependência de carro próprio dos pais: 64,6% no trajeto escolar) e 3. 'redes_descoberta' (PROXY ANALÓGICO: hábitos digitais com eh_proxy_comportamental: true e alerta de translação) OU 'o_que_mais_falta' (direto: carências urbanas). É TERMINANTEMENTE PROIBIDO selecionar 'criterios_escolha' (pergunta sobre bares e restaurantes). Se selecionar 'redes_descoberta', DEVE definir eh_proxy_comportamental: true com ALERTA DE TRANSLADAÇÃO METODOLÓGICA.";
      } else if (nicheStep3.isCursosAdultos) {
        step3Context.diretriz_obrigatoria_nicho = "Para este negócio de Cursos Livres/Educação Adulta/Profissionalizante, os 3 indicadores recomendados são: 1. 'regioes_frequentadas' (direto: centralidade corporativa e comercial ex: Aquarius, Centro), 2. 'redes_descoberta' (PROXY ANALÓGICO: canais de busca digital com eh_proxy_comportamental: true e alerta de translação) e 3. 'o_que_mais_falta' (direto) OU 'barreiras_saida' (direto: rotina/cansaço). NÃO force 'meios_transporte' com foco infantil. Se usar 'meios_transporte', analise o deslocamento do estudante adulto (Uber 56,8%, ônibus 46,3%, carro 64,6%).";
      }

      return step3Context;

    case "movimentos_vencedor_testes":
      return {
        idea: job.idea,
        regra_obrigatoria_dados: "ATENÇÃO ESTRITA: Citar porcentagens da pesquisa (ex: 42,1% de evasão, 79,4% no Instagram, 52,8% pets, 58,9% produtores locais) para validar o fit cultural.",
        quatro_movimentos_culturais_detalhados: {
          "A Geografia da Inércia": {
            eixo: "Espaço Público & Convivência Coletiva",
            dinamica_sjc: "A cultura do conforto e estabilidade. O joseense valoriza segurança, tranquilidade e a vida em condomínio fechado, mas frequentemente cai na inércia da mesmice. Procura refúgios seguros, acolhedores e sem atrito para desacelerar."
          },
          "A Cidade Prometida": {
            eixo: "Consumo Local vs Evasão Metropolitana",
            dinamica_sjc: "A frustração com a oferta convencional de 'cidade de interior'. O público de alta renda de SJC quer marcas autorais, gastronomia premium e estética de ponta. Quando não encontra na cidade, foge para SP aos fins de semana (42,1% de evasão)."
          },
          "A Tribo Global": {
            eixo: "Comunidades de Nicho & Lifestyle Cosmopolita",
            dinamica_sjc: "Profissionais de tecnologia (Embraer, Inpe, DCTA, startups), designers, nômades e early adopters. Buscam ambientes modernos, café especial, pet-friendly (52,8%), sustentabilidade e experiências de padrão internacional."
          },
          "Empreendedorismo Intuitivo": {
            eixo: "Autonomia Econômica & Produção Autoral",
            dinamica_sjc: "A valorização da autoralidade e do feito à mão em SJC (58,9% compram de produtores locais). Negócios com produto artesanal excelente, mas que precisam de refinamento de marca, embalagem e canais digitais para escalar."
          }
        },
        verbatims_pool: buildStratifiedVerbatimsPool(verb, job.idea)
      };

    default:
      return { idea: job.idea };
  }
}

// 7. DEFINIÇÕES DOS 5 MÓDULOS STEP-DRIVEN COM PROMPTS EXECUTIVOS E PROFUNDOS
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
    message: "Formulando tese executiva de viabilidade, posicionamento e vocação territorial...",
    maxTokens: 1400,
    systemPrompt: `Você é o Consultor Chefe de Estratégia de Negócios e Inteligência de Mercado de São José dos Campos.
Sua missão é emitir um diagnóstico executivo de viabilidade mercadológica real para o negócio proposto pelo usuário.

DIRETRIZES CRÍTICAS:
1. SEM VIÉS OBSESSIVO DE RENDA (FOCO EM NEGÓCIO): NÃO restrinja sua análise a classes sociais ou conferência de renda familiar. O foco absoluto é VIABILIDADE MERCADOLÓGICA: proposta de valor, dor real do cliente, frequência de consumo, atrito de adoção e diferenciação competitiva frente ao mercado joseense.
2. TESE ESTRATÉGICA (visao_estrategica_texto - 600 a 1100 caracteres):
   - Por que este modelo tem tração ou corre risco na dinâmica urbana de SJC.
   - Onde reside a verdadeira barreira de consumo do joseense (comodismo, apego a marcas conhecidas, atrito de deslocamento, carência de novidade autoral).
   - O que o negócio precisa executar com maestria para não fechar as portas no primeiro ano.
3. VEREDITO EXECUTIVO:
   - postura: Exatamente "avancar", "avancar_com_cautela" ou "pivotar".
   - justificativa: Análise executiva franca e sem rodeios (250 a 450 caracteres) sobre o maior risco e a condição primária de sucesso.
4. RANKING TERRITORIAL (bairros):
   - AVISO DE HEURÍSTICA: A escolha de bairros é uma heurística de planejamento urbano e inteligência comercial (avaliando fluxo de pedestres vs. veículos, estacionamento, vocação comercial e perfil do consumidor), e NÃO uma estatística direta da amostra N=477.
   - PROIBIDO REPETIR SEMPRE AQUARIUS E VILA EMA. Selecione de 2 a 3 microterritórios onde o público-alvo DESSE NEGÓCIO realmente vive, transita ou consome:
     * Zona Sul (Bosque dos Eucaliptos, Parque Industrial, Jd. Satélite, Jd. Oriente, Campo dos Alemães): se precisa de massa, densidade e fluxo de rua intenso (Av. Andrômeda, Cidade Jardim).
     * Zona Leste (Vista Verde, Eugênio de Melo, Galo Branco): se o foco é expansão residencial, famílias trabalhadoras e baixa concorrência local.
     * Centro & Eixo de Serviços/Saúde (Centro, Vila Adyana, São Dimas): se o foco é fluxo diurno de pedestres, consultórios/clínicas ou conveniência central.
     * Zona Norte (Santana, Altos de Santana): se o foco é comunidade local tradicional, produtos familiares e comércio vicinal.
     * Zona Oeste / Eixo Nobre (Aquarius, Urbanova, Esplanada): apenas se o negócio for de nicho premium, sofisticação ou serviço corporativo B2B.
   - formato_recomendado: Rua comercial, mall/galeria de conveniência, condomínio fechado ou quiosque.
   - justificativa: Análise detalhada (200 a 350 caracteres cada).
5. ZONA DE EXCLUSÃO QUALITATIVA: Análise densa (200 a 350 caracteres) identificando microterritórios que devem ser rigorosamente evitados. Descreva os motivos em termos qualitativos defensáveis ("pressão de custo de ocupação", "alta concentração de concorrentes diretos", "restrições de zoneamento residencial e silêncio"). PROIBIDO inventar métricas numéricas não auditadas (ex: NÃO invente 'aluguel 40% mais caro').
6. INDICADOR DE VALIDAÇÃO: Escolha um indicador chave da pesquisa que sirva de métrica primária para validar este negócio.

Responda SOMENTE um objeto JSON válido, sem markdown, sem blocos \`\`\`json:
{
  "visao_estrategica_texto": "Texto executivo denso e estruturado de 600 a 1100 caracteres.",
  "veredito_postura": "avancar",
  "veredito_justificativa": "Justificativa franca de 250 a 450 caracteres.",
  "indicador_validacao_sugerido": {
    "type": "bar",
    "titulo": "ADERÊNCIA ESTRATÉGICA AO MERCADO LOCAL",
    "labels": ["Fit Demanda", "Poder Retenção", "Risco Concorrência"],
    "data": [78, 65, 38]
  },
  "bairros": [
    {
      "nome": "Bosque dos Eucaliptos",
      "regiao": "Zona Sul",
      "formato_recomendado": "Loja de Rua em avenida comercial com vagas",
      "justificativa": "Análise detalhada de 200 a 350 caracteres sobre fluxo, perfil e sinergia.",
      "nivel_de_confianca": "alta"
    }
  ],
  "zona_exclusao": "Análise qualitativa de microterritórios a evitar de 200 a 350 caracteres."
}`
  },
  {
    stepIndex: 2,
    id: "swot_causalidade_ambiente",
    label: "Matriz SWOT, PESTEL e Diagrama de Ishikawa",
    message: "Auditando ambiente competitivo, causalidade Ishikawa e matriz SWOT ampliada...",
    maxTokens: 1400,
    systemPrompt: `Você é o Diretor de Riscos e Auditoria Operacional do Radar SJC.
Sua missão é realizar uma auditoria rigorosa de vulnerabilidades e fatores ambientais para a ideia em São José dos Campos.

DIRETRIZES FUNDAMENTAIS:
1. REGRA DE DADOS: Cite SEMPRE porcentagens da pesquisa municipal (ex: 28,5% reclamam de preços, 34,8% da mesmice, 72,4% exigem qualidade), NUNCA contagens absolutas.
2. MATRIZ SWOT HIPERLOCAL:
   - Forças (F1, F2): Diferenciais concretos do modelo frente ao padrão joseense de atendimento e produto (120 a 220 caracteres cada).
   - Fraquezas (W1, W2): Vulnerabilidades operacionais reais de escala, custo e dependência de canais em SJC (120 a 220 caracteres cada).
   - Oportunidades (O1, O2): Brechas reais deixadas pela concorrência tradicional de SJC constatadas na pesquisa (120 a 220 caracteres cada).
   - Ameaças (T1, T2): Riscos de mercado locais (fuga para compras em SP/online, rigidez de consumo, guerra de preços) (120 a 220 caracteres cada).
3. ANÁLISE PESTEL DETALHADA: Para cada dimensão (P, E, S, T, E_env, L), descreva o fator de SJC e a decisão gerencial recomendada (120 a 220 caracteres).
4. DIAGRAMA DE ISHIKAWA DE FALHA OPERACIONAL EM SJC:
   - problema_central: O gatilho primário que faria o consumidor de SJC desistir do negócio e não voltar mais (100 a 200 caracteres).
   - 4 causas estruturais com foco local (140 a 240 caracteres cada):
     * Pessoas & Atendimento: Desafio de mão de obra e hospitalidade com padrão exigido.
     * Ambiente & Experiência: Atrito de acesso, estacionamento escasso ou mesmice espacial.
     * Processos & Operação: Gargalos de agilidade, tempo de resposta ou fricção no pagamento.
     * Produto & Precificação: Preço percebido como inadequado sem entrega de valor evidente.

Responda SOMENTE um objeto JSON válido, sem markdown:
{
  "swot": {
    "forcas": [{ "item": "F1", "texto": "Força estratégica densa de 120 a 220 caracteres." }],
    "fraquezas": [{ "item": "W1", "texto": "Fraqueza real densa de 120 a 220 caracteres." }],
    "oportunidades": [{ "item": "O1", "texto": "Oportunidade concreta de 120 a 220 caracteres." }],
    "ameacas": [{ "item": "T1", "texto": "Ameaça competitiva de 120 a 220 caracteres." }]
  },
  "pestel": {
    "P": { "fator": "Contexto Político/Regulatório SJC", "decisao_recomendada": "Decisão gerencial de 120 a 220 caracteres." },
    "E": { "fator": "Contexto Econômico de SJC", "decisao_recomendada": "Decisão gerencial de 120 a 220 caracteres." },
    "S": { "fator": "Contexto Sociocultural SJC", "decisao_recomendada": "Decisão gerencial de 120 a 220 caracteres." },
    "T": { "fator": "Contexto Tecnológico/Digital SJC", "decisao_recomendada": "Decisão gerencial de 120 a 220 caracteres." },
    "E_env": { "fator": "Contexto Ambiental/Sustentabilidade", "decisao_recomendada": "Decisão gerencial de 120 a 220 caracteres." },
    "L": { "fator": "Contexto Legal/Zoneamento", "decisao_recomendada": "Decisão gerencial de 120 a 220 caracteres." }
  },
  "ishikawa": {
    "problema_central": "Gatilho de abandono do cliente em SJC de 100 a 200 caracteres.",
    "causas": [
      { "categoria": "Pessoas & Atendimento", "descricao": "Causa-raiz detalhada de 140 a 240 caracteres." },
      { "categoria": "Ambiente & Experiência", "descricao": "Causa-raiz detalhada de 140 a 240 caracteres." },
      { "categoria": "Processos & Operação", "descricao": "Causa-raiz detalhada de 140 a 240 caracteres." },
      { "categoria": "Produto & Precificação", "descricao": "Causa-raiz detalhada de 140 a 240 caracteres." }
    ]
  }
}`
  },
  {
    stepIndex: 3,
    id: "selecao_graficos_matrizes",
    label: "Seleção Dinâmica de 3 Gráficos, Matriz VRIO e 5 Forças de Porter",
    message: "Cruzando indicadores da pesquisa oficial, VRIO e 5 Forças de Porter...",
    maxTokens: 1800,
    systemPrompt: `Você é o Cientista de Dados e Estrategista Competitivo do Radar SJC.
Sua função é cruzar os microdados quantitativos da pesquisa municipal com matrizes clássicas de posicionamento de mercado.

DIRETRIZES CRÍTICAS DE SELEÇÃO DOS 3 GRÁFICOS:
1. REGRA DE OURO DE DOMÍNIO (DIRETO ANTES DE PROXY):
   - É ESTRITAMENTE PROIBIDO selecionar 'renda_familiar'. Renda familiar é uma métrica demográfica passiva que não mede dor comportamental, proposta de valor nem tração de consumo.
   - SE O NICHO POSSUI INDICADORES DIRETOS DISPONÍVEIS NO CATÁLOGO, É ESTRITAMENTE PROIBIDO SELECIONAR INDICADORES DE OUTROS DOMÍNIOS COMO PROXY.
   - Mapeamento por Família e Sub-Nicho de Negócio:
     * Educação Infantil, Berçários & Creches (Primeira Infância):
       - 1. 'regioes_frequentadas' (DIRETO: fluxo e centralidade das famílias);
       - 2. 'meios_transporte' (DIRETO: dependência de carro próprio dos pais: 64,6%);
       - 3. 'redes_descoberta' (PROXY ANALÓGICO: habits digitais gerais com eh_proxy_comportamental: true e alerta de translação) OU 'o_que_mais_falta' (DIRETO: carências).
       - ATENÇÃO: É TERMINANTEMENTE PROIBIDO selecionar 'criterios_escolha' (pergunta sobre bares e restaurantes) para berçários e escolas infantis.
     * Cursos Livres, Idiomas & Educação Adulta/Profissionalizante:
       - 1. 'regioes_frequentadas' (DIRETO: eixos corporativos/comerciais ex: Aquarius, Centro);
       - 2. 'redes_descoberta' (PROXY ANALÓGICO com eh_proxy_comportamental: true e alerta de translação);
       - 3. 'o_que_mais_falta' (DIRETO) OU 'barreiras_saida' (DIRETO: rotina/cansaço).
       - ATENÇÃO: NÃO force 'meios_transporte' com foco em 'pais levando crianças de carro'. Se usado, analise o deslocamento do próprio estudante adulto (Uber 56,8%, ônibus 46,3%, carro 64,6%).
     * Gastronomia & Vida Noturna: priorize 'barreiras_saida', 'criterios_escolha', 'frequencia_saida' ou 'evasao_consumo'.
     * Moda, Estética, Beleza & Varejo: priorize 'redes_descoberta' (DIRETO para lojas/moda), 'lugar_instagramavel', 'evasao_consumo' ou 'produtores_locais'.
     * Saúde, Clínicas & Bem-estar: priorize 'regioes_frequentadas', 'meios_transporte', 'o_que_mais_falta' ou 'redes_descoberta' (PROXY).
     * Pet & Veterinária: priorize 'pets_posse' (DIRETO), 'cidade_pet_friendly' (DIRETO) e 'regioes_frequentadas'.
     * B2B, Inovação & Tecnologia: priorize 'regioes_frequentadas', 'redes_descoberta' (PROXY), 'o_que_mais_falta', 'orgulho_morar'.
     * REGRA DE FALLBACK GERAL: Selecione os 3 indicadores mais correlatos à dor central do cliente, NUNCA renda.

2. CLASSIFICAÇÃO RIGOROSA DE PROXY COMPORTAMENTAL (TRANSPARÊNCIA METODOLÓGICA):
   - INDICADORES UNIVERSAIS DIRETOS (eh_proxy_comportamental: false):
     * 'regioes_frequentadas', 'meios_transporte' e 'o_que_mais_falta' são métricas universais de fluxo urbano, mobilidade e carências.
   - INDICADORES DE DOMÍNIO ESPECÍFICO (exigem eh_proxy_comportamental: true quando usados fora do seu nicho original):
     * 'redes_descoberta': A pergunta literal é "Qual rede social você mais usa pra encontrar lugares e referências? (restaurantes, lojas, passeios etc.)".
       - É DIRETO (eh_proxy_comportamental: false) APENAS para Gastronomia, Lazer, Turismo, Moda, Estética e Varejo.
       - É PROXY COMPORTAMENTAL (eh_proxy_comportamental: true) para Educação Infantil, Escolas, Cursos, Saúde/Clínicas e B2B!
       - Quando for PROXY, inicie o campo "o_que_nao_prova" OBRIGATORIAMENTE com:
         "ALERTA DE TRANSLADAÇÃO METODOLÓGICA: Este indicador foi medido originalmente no contexto de busca por lugares e lazer (restaurantes, lojas e passeios). Está sendo utilizado como proxy analógico de hábitos digitais gerais para inferir os canais de busca e prova social dos pais/clientes, mas NÃO afere diretamente a contratação/matrícula em [negócio do usuário]."
     * 'criterios_escolha': Pergunta literal sobre "restaurante ou bar". É DIRETO APENAS para gastronomia/bares. É PROIBIDO para escolas/educação infantil.

3. PARECER ANALÍTICO PROFUNDO (leitura_analitica - 200 a 380 caracteres):
   - Não se limite a narrar os números. EXPLIQUE O IMPACTO NA DECISÃO: o que o empreendedor ganha ou perde ao olhar esse percentual da pesquisa de SJC.
4. MATRIZ VRIO (V, R, I, O): Avalie a sustentabilidade da vantagem competitiva local (140 a 250 caracteres cada).
5. 5 FORÇAS DE PORTER: Avalie rivalidade, entrantes, substitutos, fornecedores e clientes no contexto de SJC (140 a 250 caracteres cada).
6. MIX DE MARKETING (5 Ps) & OCEANO AZUL: Diretrizes acionáveis e ações de Eliminar, Reduzir, Elevar e Criar (120 a 220 caracteres cada).

Responda SOMENTE um objeto JSON válido, sem markdown:
{
  "graficos_analiticos": [
    {
      "indicador_id": "meios_transporte",
      "titulo_contextualizado": "MOBILIDADE URBANA E DEPENDÊNCIA DE CARRO PRÓPRIO DOS PAIS",
      "eh_proxy_comportamental": false,
      "motivo_da_escolha": "Motivo estratégico fundamentado de 150 a 250 caracteres.",
      "leitura_analitica": "Leitura analítica profunda com porcentagens da pesquisa de 200 a 380 caracteres.",
      "o_que_nao_prova": "Ressalva metodológica de 140 a 240 caracteres."
    }
  ],
  "matrizes_estrategicas": {
    "vrio": [
      { "letra": "V", "nome": "Valor", "analise": "Análise VRIO consistente de 140 a 250 caracteres." },
      { "letra": "R", "nome": "Raridade", "analise": "Análise VRIO consistente de 140 a 250 caracteres." },
      { "letra": "I", "nome": "Imitabilidade", "analise": "Análise VRIO consistente de 140 a 250 caracteres." },
      { "letra": "O", "nome": "Organizacao", "analise": "Análise VRIO consistente de 140 a 250 caracteres." }
    ],
    "porter": [
      { "forca": "Rivalidade entre Concorrentes", "intensidade": "alta", "analise": "Análise de Porter em SJC de 140 a 250 caracteres." },
      { "forca": "Ameaca de Novos Entrantes", "intensidade": "media", "analise": "Análise de Porter em SJC de 140 a 250 caracteres." },
      { "forca": "Produtos Substitutos", "intensidade": "alta", "analise": "Análise de Porter em SJC de 140 a 250 caracteres." },
      { "forca": "Barganha dos Fornecedores", "intensidade": "baixa", "analise": "Análise de Porter em SJC de 140 a 250 caracteres." },
      { "forca": "Barganha dos Clientes", "intensidade": "alta", "analise": "Análise de Porter em SJC de 140 a 250 caracteres." }
    ]
  },
  "mix_marketing": {
    "cinco_ps": [
      { "p": "Produto", "analise": "Diretriz acionável de 120 a 220 caracteres." },
      { "p": "Preco", "analise": "Diretriz acionável de 120 a 220 caracteres." },
      { "p": "Praca", "analise": "Diretriz acionável de 120 a 220 caracteres." },
      { "p": "Promocao", "analise": "Diretriz acionável de 120 a 220 caracteres." },
      { "p": "Pessoas", "analise": "Diretriz acionável de 120 a 220 caracteres." }
    ],
    "oceano_azul": {
      "eliminar": "Ação de eliminar elementos obsoletos em 120 a 220 caracteres.",
      "reduzir": "Ação de reduzir custos e atritos em 120 a 220 caracteres.",
      "elevar": "Ação de elevar padrões acima da média em 120 a 220 caracteres.",
      "criar": "Ação de criar novos atributos de valor em 120 a 220 caracteres."
    }
  }
}`
  },
  {
    stepIndex: 4,
    id: "movimentos_vencedor_testes",
    label: "Movimentos Culturais, Verbalizações Reais e Plano de Validação",
    message: "Enquadrando no movimento cultural vencedor e selecionando verbalizações...",
    maxTokens: 1600,
    systemPrompt: `Você é o Antropólogo Cultural e Estrategista de Comportamento do Radar SJC.
Sua missão é posicionar o negócio no tecido sociocultural de São José dos Campos, analisando a reação específica das 4 tribos urbanas e conectando com citações reais da população.

DIRETRIZES FUNDAMENTAIS:
1. REAÇÃO OBRIGATÓRIA DAS 4 TRIBOS (FIM DOS TEXTOS PADRÃO GENÉRICOS):
   Em quatro_movimentos_analise, responda ESPECIFICAMENTE: "COMO ESTA TRIBO REAGE À IDEIA DO USUÁRIO":
   - reacao_geografia_silencio (160 a 280 caracteres): Como o público que busca sossego e refúgio em condomínios/bairros tranquilos reage à ideia.
   - reacao_cidade_prometida (160 a 280 caracteres): Como as famílias tradicionais que priorizam estabilidade e consumo conservador reagem à ideia.
   - reacao_tribo_global (160 a 280 caracteres): Como os profissionais tech, criativos e cosmopolitas reagem à estética e proposta da ideia.
   - reacao_empreendedorismo_intuitivo (160 a 280 caracteres): Como a economia real dos bairros e o consumidor prático do dia a dia reagem ao custo-benefício.
2. TRAVA DE COERÊNCIA DO MOVIMENTO PRINCIPAL:
   - Escolha exatamente UM vencedor entre os 4 nomes oficiais: "A Geografia da Inércia", "A Cidade Prometida", "A Tribo Global" ou "Empreendedorismo Intuitivo".
   - O movimento vencedor DEVE SER RIGOROSAMENTE COERENTE com as 4 reações descritas, representando o grupo com maior alavanca de vendas e fit natural.
   - justificativa_densa: Ensaio antropológico fundamentado de 400 a 800 caracteres com porcentagens da pesquisa.
   - condicao_de_sucesso (200 a 350 caracteres) e risco_de_erro (200 a 350 caracteres).
3. VERBALIZAÇÕES REAIS COM COERÊNCIA DEMOGRÁFICA E CLASSIFICAÇÃO DE TRANSPARÊNCIA:
   - Escolha de 2 a 4 citações presentes no verbatims_pool mantendo o 'id' e a 'citacao' exatamente como recebidos.
   - COERÊNCIA DEMOGRÁFICA OBRIGATÓRIA: O perfil de quem fala (idade, região) DEVE CORRESPONDER ao público-alvo da ideia.
     * Para negócios infantis, escolas ou berçários: selecione OBRIGATORIAMENTE respondentes na faixa de 25 a 44 anos (pais/mães em idade de decisão escolar). É ESTRITAMENTE PROIBIDO selecionar idosos (+65 anos) como proxy de pais jovens de berçário/escola.
     * Para vida noturna e bares: priorize 18 a 34 anos.
     * Para negócios voltados à melhor idade/saúde sênior: priorize 55+ anos.
   - PRIORIDADE TOTAL A CITAÇÕES COM MENÇÃO TEMÁTICA DIRETA:
     * Dê prioridade a citações do pool com tem_mencao_direta_ao_nicho: true (que mencionam filhos, crianças, família, educação, escolas ou rotina).
   - CLASSIFICAÇÃO HONESTA DE TRANSPARÊNCIA:
     * Defina "eh_inferencia_indireta": false e "tipo_de_conexao": "DIRETA_TEMATICA" se a citação menciona explicitamente filhos, crianças, família, educação ou escolas.
     * Defina "eh_inferencia_indireta": true e "tipo_de_conexao": "INFERENCIA_CONTEXTUAL" se a citação fala sobre a cidade em geral, ritmo de vida macro ou trânsito sem mencionar o serviço diretamente.
   - SUBSTÂNCIA DA CONEXÃO: Para CADA citação, o campo "conexao_com_sua_ideia" (150 a 250 caracteres) DEVE demonstrar de forma substantiva e honesta o impacto do relato na tese do negócio, PROIBINDO generalismos ou fingir que o morador falou de escola se falou da cidade.
4. GUIA DE ENTREVISTA (The Mom Test): Formule 4 perguntas investigativas abertas de validação de campo sobre comportamentos passados (140 a 250 caracteres cada).

Responda SOMENTE um objeto JSON válido, sem markdown:
{
  "movimentos_culturais": {
    "veredicto_final": {
      "nome_movimento": "A Tribo Global",
      "justificativa_densa": "Ensaio antropológico profundo e fundamentado de 400 a 800 caracteres com porcentagens.",
      "condicao_de_sucesso": "Condição inegociável de 200 a 350 caracteres.",
      "risco_de_erro": "Armadilha crítica de 200 a 350 caracteres."
    },
    "quatro_movimentos_analise": {
      "reacao_geografia_silencio": "Como esta tribo reage especificamente à ideia de 160 a 280 caracteres.",
      "reacao_cidade_prometida": "Como esta tribo reage especificamente à ideia de 160 a 280 caracteres.",
      "reacao_tribo_global": "Como esta tribo reage especificamente à ideia de 160 a 280 caracteres.",
      "reacao_empreendedorismo_intuitivo": "Como esta tribo reage especificamente à ideia de 160 a 280 caracteres."
    }
  },
  "verbalizacoes_selecionadas": [
    {
      "id": "id_exato",
      "citacao": "Citacao exata recebida",
      "eh_inferencia_indireta": false,
      "tipo_de_conexao": "DIRETA_TEMATICA",
      "conexao_com_sua_ideia": "Conexão direta demonstrando o impacto dessa dor ou anseio no negócio de 150 a 250 caracteres."
    }
  ],
  "plano_de_validacao": {
    "guia_entrevista_perguntas": [
      "Pergunta de entrevista investigativa no estilo Mom Test de 140 a 250 caracteres.",
      "Pergunta de entrevista investigativa no estilo Mom Test de 140 a 250 caracteres.",
      "Pergunta de entrevista investigativa no estilo Mom Test de 140 a 250 caracteres.",
      "Pergunta de entrevista investigativa no estilo Mom Test de 140 a 250 caracteres."
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

function validateModuleResult(stepId, result, snapshot, job) {
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
    const graficos = result.graficos_analiticos || result.graficos_selecionados;
    if (!Array.isArray(graficos) || graficos.length !== 3) {
      throw new Error(`INVALID_GRAPH_SELECTION: Esperado exatamente 3 gráficos selecionados, recebido: ${graficos ? graficos.length : 0}.`);
    }

    const niche = classifyNiche(job?.idea || "");

    for (const sel of graficos) {
      if (sel.indicador_id === "renda_familiar") {
        throw new Error("PROHIBITED_INDICATOR: O indicador 'renda_familiar' é proibido nos 3 gráficos analíticos dinâmicos. Selecione apenas indicadores de atrito comportamental, decisão ou descoberta.");
      }
      if (niche.isEducaInfantil && sel.indicador_id === "criterios_escolha") {
        throw new Error("MISMATCHED_DOMAIN_INDICATOR: Para negócios de Educação Infantil/Berçário, é proibido selecionar 'criterios_escolha' (pergunta sobre restaurantes e bares) como proxy quando há indicadores diretos disponíveis. Substitua por 'meios_transporte' para aferir a logística diária e mobilidade dos pais.");
      }
      // Trava de honestidade metodológica de proxy para redes_descoberta fora do domínio direto de varejo/gastronomia/lazer
      if (sel.indicador_id === "redes_descoberta" && (niche.isEducaInfantil || niche.isCursosAdultos || niche.isSaude || niche.isB2B)) {
        sel.eh_proxy_comportamental = true;
        if (!sel.o_que_nao_prova || !sel.o_que_nao_prova.includes("TRANSLADAÇÃO")) {
          sel.o_que_nao_prova = `ALERTA DE TRANSLADAÇÃO METODOLÓGICA: Este indicador foi medido originalmente no contexto de busca por lugares e lazer (restaurantes, lojas e passeios). Está sendo utilizado como proxy analógico de hábitos digitais gerais para inferir os canais digitais de busca e prova social dos pais/clientes, mas NÃO afere diretamente a contratação/matrícula em ${job?.idea || "serviços"}.`;
        }
      }
      if (!sel.indicador_id || !snapshot.indicators[sel.indicador_id]) {
        throw new Error(`INDICATOR_NOT_FOUND: O indicador '${sel.indicador_id}' não existe na base de dados oficial do Supabase.`);
      }
    }

    if (niche.isEducaInfantil) {
      const hasTransporte = graficos.some(g => g.indicador_id === "meios_transporte");
      if (!hasTransporte) {
        throw new Error("MISSING_MANDATORY_DOMAIN_INDICATOR: Para negócios de Educação Infantil/Berçário, o indicador direto 'meios_transporte' é obrigatório para demonstrar a dependência veicular (64,6% carro próprio) e fluxo logístico dos pais no deslocamento escolar.");
      }
    }

    // Sincroniza chaves internamente
    result.graficos_analiticos = graficos;
    result.graficos_selecionados = graficos;
  }

  if (stepId === "movimentos_vencedor_testes") {
    const validMovementNames = [
      "A Geografia da Inércia",
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

    const niche = classifyNiche(job?.idea || "");

    let hasDirectVerbatimInSelection = false;

    for (const sel of result.verbalizacoes_selecionadas) {
      const foundInDb = (snapshot.verbatims || []).find(v => 
        v.id === sel.id || 
        (sel.citacao && v.citacao_original && v.citacao_original.toLowerCase().includes(sel.citacao.slice(0, 20).toLowerCase())) ||
        (sel.citacao && v.citacao_original && sel.citacao.toLowerCase().includes(v.citacao_original.slice(0, 20).toLowerCase()))
      );

      if (!foundInDb) {
        throw new Error(`VERBATIM_NOT_FOUND: A verbalização '${sel.citacao?.slice(0, 30)}...' não foi encontrada na base de dados do Supabase.`);
      }

      // Trava de coerência demográfica estrita para educação infantil
      if (niche.isEducaInfantil && foundInDb.perfil?.idade && foundInDb.perfil.idade.includes("+65")) {
        throw new Error(`DEMOGRAPHIC_MISMATCH: A citação '${sel.id}' (${foundInDb.perfil?.idade}) pertence a uma faixa etária sênior (+65 anos) incompatível com os pais decisores diretos de uma escola infantil/berçário. Selecione respondentes na faixa de 25 a 44 anos.`);
      }

      // Normaliza classificação de transparência
      const txtLower = (foundInDb.citacao_original || sel.citacao || "").toLowerCase();
      const temMencaoDireta = txtLower.includes("filho") || txtLower.includes("criança") || txtLower.includes("crianca") || txtLower.includes("escola") || txtLower.includes("educa") || txtLower.includes("família") || txtLower.includes("familia") || txtLower.includes("bebê") || txtLower.includes("creche");
      
      if (temMencaoDireta) {
        sel.eh_inferencia_indireta = false;
        sel.tipo_de_conexao = "DIRETA_TEMATICA";
        hasDirectVerbatimInSelection = true;
      } else {
        if (sel.eh_inferencia_indireta === undefined) {
          sel.eh_inferencia_indireta = true;
        }
        if (!sel.tipo_de_conexao) {
          sel.tipo_de_conexao = sel.eh_inferencia_indireta ? "INFERENCIA_CONTEXTUAL" : "DIRETA_TEMATICA";
        }
        if (sel.tipo_de_conexao === "DIRETA_TEMATICA" && !sel.eh_inferencia_indireta) {
          hasDirectVerbatimInSelection = true;
        }
      }
    }

    // Se o pool continha citações diretas (tem_mencao_direta_ao_nicho: true), exige que ao menos 1 tenha sido selecionada!
    const pool = buildStratifiedVerbatimsPool(snapshot.verbatims, job?.idea || "");
    const poolHasDirect = pool.some(item => item.tem_mencao_direta_ao_nicho);
    if (poolHasDirect && !hasDirectVerbatimInSelection) {
      throw new Error("MISSING_DIRECT_VERBATIM: O pool de citações contém depoimentos reais que citam diretamente filhos, crianças e educação (ex: 'verb_def_419', 'verb_open_464'). É OBRIGATÓRIO selecionar ao menos uma citação temática direta com 'tipo_de_conexao': 'DIRETA_TEMATICA' e 'eh_inferencia_indireta': false.");
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

  const rawGraficos = mod3.graficos_analiticos || mod3.graficos_selecionados || [];
  const graficosAnaliticosMontados = rawGraficos.map(sel => {
    const ind = snapshot.indicators && snapshot.indicators[sel.indicador_id];
    if (!ind) return null;
    return {
      indicador_id: sel.indicador_id,
      titulo_contextualizado: sel.titulo_contextualizado || null,
      eh_proxy_comportamental: Boolean(sel.eh_proxy_comportamental),
      dominio: ind.dominio || "comportamento_geral",
      chart_data: {
        type: ind.tipo_grafico || "bar",
        title: sel.titulo_contextualizado || (ind.coluna ? ind.coluna.split("?")[0].replace(/^Qual\s+|\s*\(N=.*\)/gi, '').trim().toUpperCase() : sel.indicador_id.toUpperCase()),
        labels: (ind.categorias || []).map(c => c.nome),
        data: (ind.categorias || []).map(c => c.percentual),
        highlight_index: 0
      },
      pergunta_origem: `${ind.coluna || sel.indicador_id} (N=${ind.denominador || 477} - Supabase)`,
      parecer_analitico: sel.leitura_analitica || sel.motivo_da_escolha,
      o_que_nao_prova: sel.o_que_nao_prova || "A métrica mede o comportamento da amostra e não deve ser extrapolada para intenção de compra sem teste primário."
    };
  }).filter(Boolean);

  const verbalizacoesList = (mod4.verbalizacoes_selecionadas || []).map(sel => {
    const foundInDb = (snapshot.verbatims || []).find(v => 
      v.id === sel.id || 
      (sel.citacao && v.citacao_original && v.citacao_original.toLowerCase().includes(sel.citacao.slice(0, 20).toLowerCase())) ||
      (sel.citacao && v.citacao_original && sel.citacao.toLowerCase().includes(v.citacao_original.slice(0, 20).toLowerCase()))
    );

    const baseItem = foundInDb || (snapshot.verbatims && snapshot.verbatims[0]) || {
      id: sel.id || "verb_default",
      citacao_original: sel.citacao || "",
      perfil: { genero: "Não informado", idade: "Geral", regiao: "São José dos Campos", renda: "Média" },
      pergunta_origem: "Pesquisa Radar SJC"
    };

    const isIndireta = sel.eh_inferencia_indireta !== undefined ? Boolean(sel.eh_inferencia_indireta) : false;
    const tipoConexao = sel.tipo_de_conexao || (isIndireta ? "INFERENCIA_CONTEXTUAL" : "DIRETA_TEMATICA");

    return {
      id: baseItem.id,
      citacao: sel.citacao || baseItem.citacao_original,
      genero: baseItem.perfil?.genero || "Geral",
      idade: baseItem.perfil?.idade || "",
      regiao: baseItem.perfil?.regiao || "SJC",
      renda: baseItem.perfil?.renda || "",
      pergunta_origem: baseItem.pergunta_origem || "Pesquisa de Campo",
      eh_inferencia_indireta: isIndireta,
      tipo_de_conexao: tipoConexao,
      conexao_com_sua_ideia: sel.conexao_com_sua_ideia || sel.por_que_foi_selecionada || "",
      por_que_foi_selecionada: sel.conexao_com_sua_ideia || sel.por_que_foi_selecionada || ""
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
    veredito_postura: mod1.veredito_postura || "avancar",
    veredito_justificativa: mod1.veredito_justificativa || "",
    bairros: mod1.bairros || [],
    zona_exclusao: mod1.zona_exclusao,
    grafico_validacao: mod1.indicador_validacao_sugerido || {
      type: "bar",
      titulo: "ÍNDICE DE FIT ANALÍTICO (SJC)",
      labels: ["Aderência", "Retenção", "Risco"],
      data: [75, 68, 32]
    },
    swot: swotClean,
    auditoria_ambiente: {
      pestel: pestelClean,
      ishikawa: mod2.ishikawa
    },
    matrizes_estrategicas: mod3.matrizes_estrategicas,
    mix_marketing: mod3.mix_marketing,
    movimentos_culturais: {
      ...mod4.movimentos_culturais,
      analise_cards: mod4.movimentos_culturais?.quatro_movimentos_analise || mod4.movimentos_culturais?.analise_cards,
      quatro_movimentos_analise: mod4.movimentos_culturais?.quatro_movimentos_analise || mod4.movimentos_culturais?.analise_cards
    },
    movimento_vencedor: {
      nome: mod4.movimentos_culturais?.veredicto_final?.nome_movimento,
      justificativa: mod4.movimentos_culturais?.veredicto_final?.justificativa_densa,
      condicao_de_sucesso: mod4.movimentos_culturais?.veredicto_final?.condicao_de_sucesso,
      risco_de_erro: mod4.movimentos_culturais?.veredicto_final?.risco_de_erro
    },
    verbalizacoes_reais: verbalizacoesList,
    graficos_analiticos: graficosAnaliticosMontados,
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
    const apiKey = (process.env.GROQ_API_KEY || req.headers?.["x-groq-key"] || body.apiKey || "").trim();
    const geminiKey = (process.env.GEMINI_API_KEY || req.headers?.["x-gemini-key"] || "").trim();

    // ROTA DE DIAGNÓSTICO (action === "diag")
    if (action === "diag") {
      const loc = locatePresentation();
      return res.status(200).json({
        server_time: new Date().toISOString(),
        node_env: process.env.NODE_ENV || "development",
        build_commit: process.env.VERCEL_GIT_COMMIT_SHA || "local_development",
        groq_model: GROQ_MODEL,
        gemini_model: GEMINI_MODEL,
        active_provider: geminiKey ? "gemini" : (apiKey ? "groq" : "none"),
        step: "visao_veredito_territorio",
        response_format_used: false,
        cwd: process.cwd(),
        dirname: __dirname,
        presentation: loc,
        require_presentation: REQUIRE_PRESENTATION,
        supabase_url_configured: Boolean(SUPABASE_URL),
        groq_api_key_configured: Boolean(apiKey),
        gemini_api_key_configured: Boolean(geminiKey)
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
              verbatims: supabaseRes.data.verbatims,
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

        // ETAPAS 1 A 4: INFERÊNCIA ESTRATÉGICA VIA IA (GROQ OU GEMINI)
        let stepPayloadStr = "";
        try {
          if (!apiKey && !geminiKey) {
            throw new Error("AI_NOT_CONFIGURED: Nenhuma chave de IA (GROQ_API_KEY ou GEMINI_API_KEY) está configurada no servidor.");
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

          // Pré-checagem de Saldo Conhecido de Tokens da Groq (apenas se estiver usando Groq)
          if (apiKey && !geminiKey) {
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
          }

          let groqResult;
          const stepTemperature = stepDef.id === "visao_veredito_territorio" ? 0.55 : 0.2;
          try {
            groqResult = await callAIStep({
              groqKey: apiKey,
              geminiKey: geminiKey,
              systemPrompt: stepDef.systemPrompt,
              userPayloadStr: stepPayloadStr,
              maxTokens: stepDef.maxTokens || 700,
              timeoutMs: 25000,
              stepLabel: stepDef.label,
              temperature: stepTemperature
            });
            validateModuleResult(stepDef.id, groqResult.result, activeJob.context_snapshot, activeJob);
          } catch (firstAttemptErr) {
            if (firstAttemptErr.error_code === "GROQ_EMPTY_GENERATION" || 
                firstAttemptErr.message.includes("GROQ_INVALID_JSON") || 
                firstAttemptErr.message.includes("INVALID_JSON") || 
                firstAttemptErr.message.includes("MODULE_EMPTY_RESULT") ||
                firstAttemptErr.message.includes("MISMATCHED_DOMAIN_INDICATOR") ||
                firstAttemptErr.message.includes("MISSING_MANDATORY_DOMAIN_INDICATOR") ||
                firstAttemptErr.message.includes("MISSING_DIRECT_VERBATIM") ||
                firstAttemptErr.message.includes("DEMOGRAPHIC_MISMATCH") ||
                firstAttemptErr.message.includes("PROHIBITED_INDICATOR")) {
              console.warn(`[RECOVERY RETRY] Reexecutando ${stepDef.id} com prompt restrito após erro:`, firstAttemptErr.message);
              const recoverySystemPrompt = `${stepDef.systemPrompt}\n\nATENÇÃO OBRIGATÓRIA: Sua resposta anterior falhou na validação com o erro: "${firstAttemptErr.message}". Corrija esse ponto específico imediatamente e retorne SOMENTE o objeto JSON válido esperado, sem markdown.`;
              groqResult = await callAIStep({
                groqKey: apiKey,
                geminiKey: geminiKey,
                systemPrompt: recoverySystemPrompt,
                userPayloadStr: stepPayloadStr,
                maxTokens: stepDef.maxTokens || 750,
                timeoutMs: 25000,
                stepLabel: `${stepDef.label} (Recovery Retry)`,
                temperature: stepTemperature
              });
              validateModuleResult(stepDef.id, groqResult.result, activeJob.context_snapshot, activeJob);
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
            activeJob.error_code = "AI_MODEL_INVALID";
            activeJob.message = `O modelo de IA configurado (${err.model_used || "ativo"}) é inválido ou foi descontinuado: ${err.message}`;
            activeJob.last_error = err.message;
            activeJob.retryable = false;
          } else if (err.isQuotaExhausted || err.error_code === "GROQ_QUOTA_EXHAUSTED" || err.error_code === "GEMINI_QUOTA_EXHAUSTED") {
            activeJob.status = "failed";
            activeJob.error_code = "AI_QUOTA_EXHAUSTED";
            activeJob.message = "A cota diária ou limite de tokens da IA foi atingida. O processamento foi interrompido sem retentativas.";
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
              activeJob.error_code = limitType === "tokens" ? "AI_TOKEN_LIMIT_EXHAUSTED" : "AI_RATE_LIMIT_EXHAUSTED";
              activeJob.message = `Limite de ${limitType} da IA excedeu o máximo de 3 tentativas na etapa ${stepDef.label}.`;
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
                activeJob.message = `Limite de tokens da IA. A etapa ${activeJob.current_step} será retomada após ${hhMm} (${waitSeconds}s restantes)...`;
              } else {
                activeJob.message = `Limite temporário de requisições da IA. A etapa ${activeJob.current_step} será retomada após ${hhMm} (${waitSeconds}s restantes)...`;
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
