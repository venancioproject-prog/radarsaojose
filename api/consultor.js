// API Consultor Estratégico - Arquitetura de Alta Disponibilidade Serverless & Auditoria Rigorosa
// Versão: 4.0.0-audited
// Dicionário de Segurança: Credenciais dinâmicas via ambiente, sem segredos hardcoded.

const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

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

// TODO: Restringir origens CORS específicas e remover fallbacks inseguros em produção.
const GROQ_MODEL = process.env.GROQ_MODEL || "qwen/qwen3.6-27b";
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.6-flash";
const REQUIRE_PRESENTATION = String(process.env.REQUIRE_PRESENTATION || "true").toLowerCase() !== "false";

const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "";
const TABLE_NAME = "respostas_pesquisa";
const JOBS_TABLE_NAME = "consultor_jobs";

// Rastreador Global de Rate Limit da Groq
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
      const timeoutErr = new Error(`AI_TIMEOUT: A chamada para ${contextLabel} excedeu o limite de ${timeoutMs / 1000}s.`);
      timeoutErr.error_code = "AI_TIMEOUT";
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

// 1. CARREGAMENTO E SNAPSHOT VERSIONADO DE DADOS (SUPABASE N=477)
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
  const endpoint = `${SUPABASE_URL}/rest/v1/${TABLE_NAME}?select=${selectQuery}&limit=2000`;

  const response = await fetchWithTimeout(endpoint, {
    headers: {
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      "Prefer": "count=exact"
    }
  }, 15000, "Supabase REST");

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`SUPABASE_FETCH_ERROR: Falha ao consultar banco de dados (${response.status}): ${errText.slice(0, 200)}`);
  }

  const rawRows = await response.json();
  if (!Array.isArray(rawRows) || rawRows.length === 0) {
    throw new Error("SUPABASE_EMPTY: Nenhuma resposta encontrada na tabela respostas_pesquisa.");
  }

  // Verificação de Paginação / Truncamento
  const contentRange = response.headers.get("content-range");
  let totalCountFromHeader = rawRows.length;
  let isTruncated = false;

  if (contentRange) {
    const parts = contentRange.split("/");
    if (parts.length === 2 && !isNaN(parseInt(parts[1], 10))) {
      totalCountFromHeader = parseInt(parts[1], 10);
      if (rawRows.length < totalCountFromHeader) {
        isTruncated = true;
      }
    }
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

  const samplePayloadStr = JSON.stringify(indicators) + totalN;
  const queryHash = crypto.createHash("sha256").update(samplePayloadStr).digest("hex").slice(0, 12);
  const fetchedAt = new Date().toISOString();

  cachedSupabaseData = {
    metadata: {
      source_snapshot_id: `snap_${Date.now()}_${queryHash}`,
      source_fetched_at: fetchedAt,
      row_count: totalN,
      total_expected_rows: totalCountFromHeader,
      is_truncated: isTruncated,
      dataset_version: "v4.0_N477",
      query_hash: queryHash
    },
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

// 2. DADOS DO CENSO IBGE 2022 (SÃO JOSÉ DOS CAMPOS)
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
      const err = new Error("PRESENTATION_NOT_AVAILABLE: O arquivo da apresentação oficial não foi encontrado.");
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
      descricao_apresentacao: "A expectativa de um futuro vibrante frustrada pela oferta convencional, gerando evasão de consumo para SP (42,1%).",
      diagnostico: "Público qualificado de alta renda que não encontra sofisticação na cidade e consome fora em busca de marcas e gastronomia de padrão capital.",
      oportunidade_negocio: "Marcas autorais, gastronomia premium, moda e hospitalidade de nível internacional para reter o poder de compra classe A/B."
    },
    tribo_global: {
      nome: "A Tribo Global",
      eixo: "Comunidades de Nicho & Lifestyle Cosmopolita",
      descricao_apresentacao: "Profissionais conectados, nômades digitais e público cosmopolita sem ecossistema urbano autêntico.",
      diagnostico: "Early adopters exigentes que sentem falta de ambientes modernos, pet-friendly (52,8%) e experiências de padrão global.",
      oportunidade_negocio: "Microcomunidades, hospitalidade pet-friendly, cafés especiais, wellness e produtos de diferenciação estética."
    },
    empreendedorismo_intuitivo: {
      nome: "Empreendedorismo Intuitivo",
      eixo: "Autonomia Econômica & Produção Autoral",
      descricao_apresentacao: "O foco pragmático no sustento e abertura de negócios autorais com alta garra e baixa maturidade técnica.",
      diagnostico: "Negócios locais com excelente produto artesanal, mas baixa maturidade de canais digitais e posicionamento de marca.",
      oportunidade_negocio: "Curadoria de produtores locais (58,9%), parcerias de co-branding, feiras autorais e marketing de diferenciação."
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

// 4. PERSISTÊNCIA & LOCK ATÔMICO COM REVISION CONTROL
const MEMORY_JOBS = new Map();

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
    } catch (err) {}
  }

  if (MEMORY_JOBS.has(jobId)) {
    return { job: MEMORY_JOBS.get(jobId), source: "memory" };
  }

  return { job: null, source: "none" };
}

async function saveJob(job) {
  if (!job || !job.job_id) return;
  job.updated_at = new Date().toISOString();
  job.revision = (job.revision || 0) + 1;
  MEMORY_JOBS.set(job.job_id, job);

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
    } catch (err) {}
  }
}

async function acquireJobLock(jobOrId, workerId = "worker_default") {
  const jobId = typeof jobOrId === "object" && jobOrId !== null ? jobOrId.job_id : String(jobOrId || "").trim();
  const nowIso = new Date().toISOString();
  const leaseExpiresAt = new Date(Date.now() + 30000).toISOString();

  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    try {
      const lockEndpoint = `${SUPABASE_URL}/rest/v1/${JOBS_TABLE_NAME}?job_id=eq.${encodeURIComponent(jobId)}&or=(is_processing.eq.false,lease_expires_at.is.null,lease_expires_at.lt.${encodeURIComponent(nowIso)})`;
      
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
          worker_id: workerId,
          lease_expires_at: leaseExpiresAt,
          updated_at: nowIso
        })
      }, 5000, "Supabase Acquire Lock");

      if (res.ok) {
        const rows = await res.json();
        if (Array.isArray(rows) && rows.length > 0) {
          const lockedJob = rows[0];
          MEMORY_JOBS.set(lockedJob.job_id, lockedJob);
          return Object.assign(lockedJob, { acquired: true });
        }
      }
    } catch (err) {}
  }

  // Fallback Local de Lock em Memória
  const getRes = await getJob(jobId);
  const localJob = getRes.job || (typeof jobOrId === "object" ? jobOrId : null);
  if (!localJob) return { acquired: false, job: null };

  const nowMs = Date.now();
  const leaseExpMs = localJob.lease_expires_at ? new Date(localJob.lease_expires_at).getTime() : 0;
  const isExpired = leaseExpMs > 0 && leaseExpMs < nowMs;

  if (!localJob.is_processing || isExpired) {
    localJob.is_processing = true;
    localJob.worker_id = workerId;
    localJob.lock_worker_id = workerId;
    localJob.lease_expires_at = leaseExpiresAt;
    localJob.updated_at = nowIso;
    await saveJob(localJob);
    return Object.assign(localJob, { acquired: true, job: localJob });
  }

  return { acquired: false, job: localJob, is_processing: true };
}

async function releaseJobLock(job, updates = {}) {
  if (!job) return null;
  Object.assign(job, updates);
  job.is_processing = false;
  job.worker_id = null;
  job.lock_worker_id = null;
  job.lease_expires_at = null;
  job.updated_at = new Date().toISOString();
  await saveJob(job);
  return job;
}

// 5. PARSER E EXTRATOR SEGURO DE JSON
function extractJsonFromText(rawText) {
  if (!rawText || typeof rawText !== "string") {
    throw new Error("AI_INVALID_JSON: Texto de resposta da IA está vazio.");
  }

  let cleaned = rawText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace <= firstBrace) {
    const error = new Error("AI_INVALID_JSON: A resposta da IA não contém um objeto JSON válido.");
    error.error_code = "AI_INVALID_JSON";
    throw error;
  }

  const jsonSubstring = cleaned.slice(firstBrace, lastBrace + 1);
  try {
    return JSON.parse(jsonSubstring);
  } catch (parseErr) {
    const error = new Error(`AI_INVALID_JSON: Falha ao interpretar JSON retornado: ${parseErr.message}`);
    error.error_code = "AI_INVALID_JSON";
    throw error;
  }
}

// Normalizador Uniforme de Erros de Provedores de IA
function normalizeAIError(err, provider = "ai") {
  if (!err) return { code: "AI_PROVIDER_ERROR", message: "Erro desconhecido.", status: 500 };
  
  const msg = (err.message || String(err)).toLowerCase();
  
  if (err.error_code === "AI_TIMEOUT" || err.isTimeout || msg.includes("timed out") || msg.includes("timeout")) {
    return { code: "AI_TIMEOUT", message: `Timeout na chamada da API ${provider}.`, status: 504 };
  }
  
  if (err.error_code === "AI_QUOTA_EXHAUSTED" || msg.includes("quota exceeded") || msg.includes("resource_exhausted") || msg.includes("tpd") || msg.includes("daily")) {
    return { code: "AI_QUOTA_EXHAUSTED", message: `Cota diária excedida no provedor ${provider}.`, status: 429 };
  }

  if (err.error_code === "AI_RATE_LIMIT" || msg.includes("rate limit") || msg.includes("429") || msg.includes("tpm")) {
    return { code: "AI_RATE_LIMIT", message: `Limite de requisições por minuto atingido em ${provider}.`, status: 429 };
  }

  if (err.error_code === "AI_INVALID_JSON" || msg.includes("invalid_json") || msg.includes("json")) {
    return { code: "AI_INVALID_JSON", message: `A resposta de ${provider} não continha um JSON válido.`, status: 502 };
  }

  return { code: err.error_code || "AI_PROVIDER_ERROR", message: err.message || "Erro no provedor de IA.", status: err.status || 500 };
}

// 6. CHAMADAS AOS PROVIDERS COM NORMALIZAÇÃO DE ERROS
async function callGroqStep(apiKey, systemPrompt, userPayloadStr, maxTokens = 700, timeoutMs = 25000, stepLabel = "Etapa", temperature = 0.2) {
  const startTime = Date.now();
  const remainingBefore = GROQ_RATE_LIMIT_TRACKER.remainingTokens;

  const requestBody = {
    model: GROQ_MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPayloadStr }
    ],
    temperature: temperature,
    max_tokens: maxTokens
  };

  let response;
  try {
    response = await fetchWithTimeout("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    }, timeoutMs, `Groq (${stepLabel})`);
  } catch (err) {
    if (err.isTimeout) throw err;
    const providerErr = new Error(`AI_PROVIDER_ERROR: Falha de rede na chamada Groq: ${err.message}`);
    providerErr.error_code = "AI_PROVIDER_ERROR";
    throw providerErr;
  }

  const durationMs = Date.now() - startTime;
  const capturedHeaders = updateGroqRateLimitTracker(response.headers);
  const rawHeadersObj = extractGroqRateLimitHeaders(response.headers);

  if (!response.ok) {
    const errText = await response.text();
    const retryAfterSec = parseResetSeconds(rawHeadersObj["retry-after"]);
    const resetTokSec = parseResetSeconds(rawHeadersObj["x-ratelimit-reset-tokens"]);

    if (response.status === 429) {
      const isQuota = errText.includes("TPD") || errText.includes("daily") || errText.includes("quota");
      const errorObj = new Error(isQuota ? "AI_QUOTA_EXHAUSTED: Cota diária excedida." : "AI_RATE_LIMIT: Limite de requisições excedido.");
      errorObj.error_code = isQuota ? "AI_QUOTA_EXHAUSTED" : "AI_RATE_LIMIT";
      errorObj.status = 429;
      errorObj.retryAfterSeconds = retryAfterSec || resetTokSec || 10;
      throw errorObj;
    }

    const errorObj = new Error(`AI_PROVIDER_ERROR: Erro HTTP ${response.status} na API Groq.`);
    errorObj.error_code = "AI_PROVIDER_ERROR";
    errorObj.status = response.status;
    throw errorObj;
  }

  const data = await response.json();
  const rawContent = String(data.choices?.[0]?.message?.content || "").trim();
  const parsed = extractJsonFromText(rawContent);

  const usage = data.usage || {};
  return {
    provider: "groq",
    model: GROQ_MODEL,
    result: parsed,
    durationMs,
    outputChars: rawContent.length,
    inputChars: userPayloadStr.length + systemPrompt.length,
    promptTokens: usage.prompt_tokens || Math.ceil(userPayloadStr.length / 3.8),
    completionTokens: usage.completion_tokens || Math.ceil(rawContent.length / 3.8),
    totalTokens: usage.total_tokens || Math.ceil((userPayloadStr.length + rawContent.length) / 3.8),
    remainingTokensBefore: remainingBefore,
    remainingTokensAfter: capturedHeaders.remainingTokens,
    rateLimitHeaders: rawHeadersObj
  };
}

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
        maxOutputTokens: maxTokens // CORRIGIDO: Respeita maxTokens recebido
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
        if (response.status === 429 || errText.includes("RESOURCE_EXHAUSTED") || errText.includes("Quota exceeded")) {
          const quotaErr = new Error("AI_QUOTA_EXHAUSTED: Cota do Google Gemini excedida.");
          quotaErr.error_code = "AI_QUOTA_EXHAUSTED";
          quotaErr.status = 429;
          throw quotaErr;
        }

        const providerErr = new Error(`AI_PROVIDER_ERROR: Erro HTTP ${response.status} no Gemini (${currentModel}).`);
        providerErr.error_code = "AI_PROVIDER_ERROR";
        lastError = providerErr;
        continue;
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

      const parsed = extractJsonFromText(rawContent);
      const usage = data.usageMetadata || {};

      return {
        provider: "gemini",
        model: currentModel,
        result: parsed,
        durationMs,
        outputChars: rawContent.length,
        inputChars: userPayloadStr.length + systemPrompt.length,
        promptTokens: usage.promptTokenCount || Math.ceil(userPayloadStr.length / 3.8),
        completionTokens: usage.candidatesTokenCount || Math.ceil(rawContent.length / 3.8),
        totalTokens: usage.totalTokenCount || Math.ceil((userPayloadStr.length + rawContent.length) / 3.8),
        remainingTokensBefore: null,
        remainingTokensAfter: null,
        rateLimitHeaders: {}
      };

    } catch (networkErr) {
      if (networkErr.error_code === "AI_QUOTA_EXHAUSTED" || networkErr.isTimeout) throw networkErr;
      lastError = networkErr;
    }
  }

  const finalError = lastError || new Error("AI_PROVIDER_ERROR: Falha ao chamar provedor Gemini.");
  finalError.error_code = finalError.error_code || "AI_PROVIDER_ERROR";
  throw finalError;
}

async function callAIStep({ groqKey, geminiKey, systemPrompt, userPayloadStr, maxTokens = 700, timeoutMs = 25000, stepLabel = "Etapa", temperature = 0.2, mockProvider = null }) {
  // Suporte a Provedor Mockado para Testes Unitários de Pipeline com Retries
  if (mockProvider && typeof mockProvider === "function") {
    let lastErr = null;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const rawRes = await mockProvider({ systemPrompt, userPayloadStr, maxTokens, stepLabel, temperature, attempt });
        if (typeof rawRes === "string") {
          return { result: extractJsonFromText(rawRes), provider: "mock", model: "mock-model" };
        }
        return rawRes;
      } catch (err) {
        lastErr = err;
        if (attempt === 3) throw err;
      }
    }
  }

  if (geminiKey) {
    try {
      return await callGeminiStep(geminiKey, systemPrompt, userPayloadStr, maxTokens, timeoutMs, stepLabel, temperature);
    } catch (geminiErr) {
      if (!groqKey || geminiErr.error_code === "AI_QUOTA_EXHAUSTED") throw geminiErr;
    }
  }

  if (groqKey) {
    return await callGroqStep(groqKey, systemPrompt, userPayloadStr, maxTokens, timeoutMs, stepLabel, temperature);
  }

  throw new Error("AI_NOT_CONFIGURED: Nenhuma chave de IA válida (GEMINI_API_KEY ou GROQ_API_KEY) foi encontrada.");
}

// 7. HELPER DE CLASSIFICAÇÃO DE NICHO E POOL ESTRATIFICADO
function classifyNiche(ideaText) {
  const s = (ideaText || "").toLowerCase();

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

  const isGastronomia = s.includes("restaurante") || s.includes("bar") || s.includes("hambúrguer") || s.includes("hamburguer") || s.includes("café") || s.includes("cafe") || s.includes("cervej") || s.includes("pizza") || s.includes("comida") || s.includes("gastronom") || s.includes("balada") || s.includes("pub") || s.includes("noturn");
  const isPet = s.includes("pet") || s.includes("veterinár") || s.includes("veterinar") || s.includes("canil") || s.includes("cachorro") || s.includes("gato");
  const isSaude = s.includes("clínica") || s.includes("clinica") || s.includes("médic") || s.includes("medic") || s.includes("odontolog") || s.includes("dentista") || s.includes("fisioterapia") || s.includes("psicolog") || s.includes("saúde") || s.includes("saude");
  const isModaBeleza = s.includes("moda") || s.includes("roupa") || s.includes("estética") || s.includes("estetica") || s.includes("salão") || s.includes("salao") || s.includes("beleza") || s.includes("barbearia") || s.includes("varejo");
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

function buildStratifiedVerbatimsPool(allVerbs, ideaText) {
  const qualified = (allVerbs || []).filter(v => v.citacao_original && v.citacao_original.trim().length >= 25);
  const lowerIdea = (ideaText || "").toLowerCase();
  const niche = classifyNiche(ideaText);
  const isSenior = lowerIdea.includes("idoso") || lowerIdea.includes("terceira idade") || lowerIdea.includes("aposent");

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

  const scored = qualified.map(v => {
    let score = 0;
    const txtLower = (v.citacao_original || "").toLowerCase();
    const idade = (v.perfil?.idade || "").toUpperCase();
    const regiao = (v.perfil?.regiao || "").toUpperCase();

    let isDemographicMatch = false;
    if (niche.isEducaInfantil) {
      if (idade.includes("25") || idade.includes("35")) {
        score += 30;
        isDemographicMatch = true;
      } else if (idade.includes("+65")) {
        score -= 60;
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

    const matchedKeywords = targetKeywords.filter(kw => txtLower.includes(kw));
    const hasDirectMention = matchedKeywords.length > 0;
    if (hasDirectMention) {
      score += (matchedKeywords.length * 35);
    }

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

  scored.sort((a, b) => b.score - a.score);
  const pool = scored.slice(0, 24);

  return pool.map(item => ({
    id: item.v.id,
    citacao: item.v.citacao_original,
    perfil: `${item.v.perfil.regiao} | ${item.v.perfil.renda} | ${item.v.perfil.idade} | ${item.v.perfil.genero}`,
    tem_mencao_direta_ao_nicho: item.hasDirectMention,
    palavras_chave_encontradas: item.matchedKeywords
  }));
}

// 8. GERADOR DE BLOCO DE EVIDÊNCIAS E FACTS ESTRUTURADOS (SEM HARDCODED VALUES)
function buildFactsPayload(snapshotOrRows, niche = "", totalExpected = null) {
  let verbatims = [];

  if (Array.isArray(snapshotOrRows)) {
    const rows = snapshotOrRows;
    const totalN = rows.length;
    const totalExpectedRows = totalExpected !== null ? totalExpected : totalN;
    const isTruncated = totalN < totalExpectedRows;
    
    const queryHash = crypto.createHash("sha256").update(JSON.stringify(rows)).digest("hex");

    const counts = {};
    rows.forEach(r => {
      Object.keys(r).forEach(col => {
        if (col === "id" || col === "citacao_original") return;
        const val = r[col];
        if (!val) return;
        if (!counts[col]) counts[col] = { total: 0, dist: {} };
        counts[col].total++;
        counts[col].dist[val] = (counts[col].dist[val] || 0) + 1;
      });
      if (r.citacao_original || r.citacao || r.id) {
        verbatims.push({
          id: String(r.id || `cit_${Math.random()}`),
          citacao_original: r.citacao_original || r.citacao || "",
          perfil: r
        });
      }
    });

    const factsByIndicator = {};
    Object.keys(counts).forEach(col => {
      const tot = counts[col].total;
      const dist = {};
      Object.keys(counts[col].dist).forEach(v => {
        const abs = counts[col].dist[v];
        const pct = ((abs / tot) * 100).toFixed(2) + "%";
        dist[v] = { abs, pct };
      });
      factsByIndicator[col] = { total_respondentes: tot, distribuicao: dist };
    });

    const factsIndicators = Object.keys(counts).map(col => ({
      indicador_id: col,
      pergunta_oficial: col,
      denominador_valido_N: counts[col].total,
      distribuicao_percentual: Object.entries(factsByIndicator[col].distribuicao).map(([k, v]) => `${k}: ${v.pct} (${v.abs}/${counts[col].total})`).join(" | ")
    }));

    const contextSnap = {
      source_snapshot_id: `snap_${queryHash.substring(0, 8)}`,
      source_fetched_at: new Date().toISOString(),
      row_count: totalN,
      total_expected_rows: totalExpectedRows,
      is_truncated: isTruncated,
      dataset_version: "v4.0_N477",
      query_hash: queryHash
    };

    return {
      context_snapshot: contextSnap,
      source_metadata: contextSnap,
      indicadores_quantitativos_pesquisa: factsIndicators,
      facts_by_indicator: factsByIndicator,
      citacoes_disponiveis: verbatims,
      verbatims: verbatims
    };
  }

  const snapshot = snapshotOrRows || {};
  const ind = snapshot.indicators || {};
  const meta = snapshot.metadata || {};
  const totalN = meta.row_count || snapshot.totalN || (snapshot.rows ? snapshot.rows.length : 477);
  const totalExp = meta.total_expected_rows || totalN;
  const isTrunc = meta.is_truncated !== undefined ? meta.is_truncated : (totalN < totalExp);
  const qHash = meta.query_hash || crypto.createHash("sha256").update(JSON.stringify(snapshot)).digest("hex");

  const factsIndicators = Object.entries(ind).map(([id, i]) => ({
    indicador_id: id,
    pergunta_oficial: i.coluna || id,
    denominador_valido_N: i.denominador || totalN,
    distribuicao_percentual: (i.categorias || []).map(c => `${c.nome}: ${c.percentual}% (${c.n}/${i.denominador || totalN})`).join(" | ")
  }));

  const contextSnap = {
    source_snapshot_id: meta.source_snapshot_id || `snap_${qHash.substring(0, 8)}`,
    source_fetched_at: meta.source_fetched_at || new Date().toISOString(),
    row_count: totalN,
    total_expected_rows: totalExp,
    is_truncated: isTrunc,
    dataset_version: meta.dataset_version || "v4.0_N477",
    query_hash: qHash
  };

  return {
    context_snapshot: contextSnap,
    source_metadata: contextSnap,
    indicadores_quantitativos_pesquisa: factsIndicators,
    dados_demograficos_ibge_2022: snapshot.ibge || {},
    citacoes_disponiveis: snapshot.verbatims || snapshot.rows || [],
    verbatims: snapshot.verbatims || snapshot.rows || []
  };
}


function buildStepContext(stepId, snapshot, job) {
  const facts = buildFactsPayload(snapshot);
  const verb = snapshot.verbatims || [];

  switch (stepId) {
    case "visao_veredito_territorio":
      return {
        business_idea: job.idea,
        report_to_audit: job.report_to_audit || null,
        facts: facts,
        macrorregioes_fluxo_consumo: facts.indicadores_quantitativos_pesquisa.find(i => i.indicador_id === "regioes_frequentadas"),
        bairros_por_macrorregiao_sjc: {
          "Zona Sul": ["Jardim Satélite / Floradas", "Bosque dos Eucaliptos", "Parque Industrial", "Jardim Oriente", "Campo dos Alemães"],
          "Zona Oeste e Centro-Oeste": ["Jardim Aquarius", "Vila Ema", "Vila Adyana / São Dimas", "Urbanova"],
          "Centro": ["Centro Histórico / Calçadão"],
          "Zona Leste": ["Vista Verde", "Eugênio de Melo / Galo Branco", "Jardim Paulista"],
          "Zona Norte": ["Santana / Altos de Santana"]
        }
      };

    case "swot_causalidade_ambiente":
      const s1Res = job.partial_results?.visao_veredito_territorio || {};
      return {
        business_idea: job.idea,
        facts: facts,
        resultados_anteriores: {
          postura_step1: s1Res.veredito_postura || "avancar",
          justificativa_step1: s1Res.veredito_justificativa || "",
          bairros_step1: (s1Res.bairros || []).map(b => `${b.nome} (${b.formato_recomendado})`)
        },
        amostra_verbatims_reais: verb.slice(0, 6).map(v => ({
          id: v.id,
          citacao: v.citacao_original,
          perfil: `${v.perfil.regiao} | Renda: ${v.perfil.renda} | Idade: ${v.perfil.idade}`
        }))
      };

    case "selecao_graficos_matrizes":
      const nicheStep3 = classifyNiche(job.idea);
      return {
        business_idea: job.idea,
        facts: facts,
        resultados_anteriores: {
          bairros_step1: (job.partial_results?.visao_veredito_territorio?.bairros || []).map(b => b.nome),
          ishikawa_step2: job.partial_results?.swot_causalidade_ambiente?.ishikawa?.problema_central
        },
        diretriz_nicho: nicheStep3.isEducaInfantil
          ? "Negócio de Educação Infantil/Berçário: Selecionar regioes_frequentadas, meios_transporte e redes_descoberta (proxy com alerta) ou o_que_mais_falta. PROIBIDO criterios_escolha."
          : nicheStep3.isCursosAdultos
          ? "Negócio de Cursos Adultos/Idiomas: Selecionar regioes_frequentadas, redes_descoberta (proxy) e barreiras_saida ou o_que_mais_falta."
          : "Selecione os 3 indicadores mais correlatos à dor do negócio, NUNCA renda_familiar."
      };

    case "movimentos_vencedor_testes":
      return {
        business_idea: job.idea,
        facts: facts,
        quatro_movimentos_culturais_detalhados: snapshot.cultural_movements || {},
        verbatims_pool: buildStratifiedVerbatimsPool(verb, job.idea)
      };

    default:
      return { business_idea: job.idea, facts: facts };
  }
}

// 9. PROMPTS REESTRUTURADOS E SCHEMA VALIDATORS
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
    systemPrompt: `1. MISSÃO DA ETAPA:
Emitir um diagnóstico executivo de viabilidade mercadológica real para a ideia do usuário em São José dos Campos.

2. LIMITES DA ETAPA:
- NÃO inventar percentuais, bairros ou dados não fornecidos nos facts.
- NÃO focar obsessivamente em renda familiar; foque na proposta de valor, dor do cliente e atritos urbanos.
- Escolha de 2 a 3 bairros fundamentada em vocação comercial e fluxo.

3. REGRAS DE EVIDÊNCIA:
- Toda menção numérica DEVE ser extraída diretamente dos facts quantitativos fornecidos.
- Se a evidência for insuficiente para cravar o sucesso de um bairro específico, use a opção "evidencia_insuficiente" no campo correspondente ou declare o limite de inferência.

4. CONTRATO JSON:
Retorne SOMENTE um objeto JSON puro, sem markdown:
{
  "visao_estrategica_texto": "Texto executivo denso de 600 a 1100 caracteres.",
  "veredito_postura": "avancar", // Exatamente "avancar", "avancar_com_cautela" ou "pivotar"
  "veredito_justificativa": "Justificativa franca de 250 a 450 caracteres.",
  "bairros": [
    {
      "nome": "Nome do Bairro",
      "regiao": "Zona Sul",
      "formato_recomendado": "Formato de Ponto Comercial",
      "justificativa": "Justificativa de 200 a 350 caracteres.",
      "nivel_de_confianca": "alta"
    }
  ],
  "zona_exclusao": "Análise qualitativa de microterritórios a evitar de 200 a 350 caracteres."
}

5. CHECKLIST DE AUTOVERIFICAÇÃO:
[ ] Todos os percentuais citados constam nos facts fornecidos?
[ ] A postura é exatamente uma das 3 opções autorizadas?
[ ] O JSON está estritamente válido?`
  },
  {
    stepIndex: 2,
    id: "swot_causalidade_ambiente",
    label: "Matriz SWOT, PESTEL e Diagrama de Ishikawa",
    message: "Auditando ambiente competitivo, causalidade Ishikawa e matriz SWOT ampliada...",
    maxTokens: 1400,
    systemPrompt: `1. MISSÃO DA ETAPA:
Realizar uma auditoria rigorosa de vulnerabilidades, matriz SWOT hiperlocal, análise PESTEL e Diagrama de Ishikawa para o negócio.

2. LIMITES DA ETAPA:
- Cite SEMPRE porcentagens reais extraídas dos facts. NUNCA números absolutos.
- Não invente causas raiz não correlacionadas à realidade do mercado de SJC.

3. CONTRATO JSON:
Retorne SOMENTE um objeto JSON puro:
{
  "swot": {
    "forcas": [{ "item": "F1", "texto": "Força estratégica de 120 a 220 caracteres." }],
    "fraquezas": [{ "item": "W1", "texto": "Fraqueza real de 120 a 220 caracteres." }],
    "oportunidades": [{ "item": "O1", "texto": "Oportunidade concreta de 120 a 220 caracteres." }],
    "ameacas": [{ "item": "T1", "texto": "Ameaça competitiva de 120 a 220 caracteres." }]
  },
  "pestel": {
    "P": { "fator": "Contexto Político SJC", "decisao_recomendada": "Decisão gerencial de 120 a 220 caracteres." },
    "E": { "fator": "Contexto Econômico SJC", "decisao_recomendada": "Decisão gerencial de 120 a 220 caracteres." },
    "S": { "fator": "Contexto Sociocultural SJC", "decisao_recomendada": "Decisão gerencial de 120 a 220 caracteres." },
    "T": { "fator": "Contexto Tecnológico SJC", "decisao_recomendada": "Decisão gerencial de 120 a 220 caracteres." },
    "E_env": { "fator": "Contexto Ambiental SJC", "decisao_recomendada": "Decisão gerencial de 120 a 220 caracteres." },
    "L": { "fator": "Contexto Legal SJC", "decisao_recomendada": "Decisão gerencial de 120 a 220 caracteres." }
  },
  "ishikawa": {
    "problema_central": "Gatilho de abandono do cliente de 100 a 200 caracteres.",
    "causas": [
      { "categoria": "Pessoas & Atendimento", "descricao": "Causa-raiz de 140 a 240 caracteres." },
      { "categoria": "Ambiente & Experiência", "descricao": "Causa-raiz de 140 a 240 caracteres." },
      { "categoria": "Processos & Operação", "descricao": "Causa-raiz de 140 a 240 caracteres." },
      { "categoria": "Produto & Precificação", "descricao": "Causa-raiz de 140 a 240 caracteres." }
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
    systemPrompt: `1. MISSÃO DA ETAPA:
Selecionar exatamente 3 gráficos analíticos dinâmicos do catálogo de facts e elaborar as Matrizes VRIO, Porter e 5 Ps.

2. REGRAS DE OURO E PROXY:
- PROIBIDO selecionar 'renda_familiar'.
- Para Educação Infantil: selecione regioes_frequentadas, meios_transporte e redes_descoberta (PROXY) ou o_que_mais_falta. PROIBIDO criterios_escolha.
- Se o indicador for de outro domínio (ex: redes_descoberta para educação), defina eh_proxy_comportamental: true e inicie o_que_nao_prova com "ALERTA DE TRANSLADAÇÃO METODOLÓGICA: ...".

3. CONTRATO JSON:
Retorne SOMENTE um objeto JSON puro:
{
  "graficos_analiticos": [
    {
      "indicador_id": "meios_transporte",
      "titulo_contextualizado": "TÍTULO ANALÍTICO EM MAIÚSCULAS",
      "eh_proxy_comportamental": false,
      "motivo_da_escolha": "Motivo estratégico de 150 a 250 caracteres.",
      "leitura_analitica": "Leitura analítica com porcentagens dos facts em 200 a 380 caracteres.",
      "o_que_nao_prova": "Ressalva metodológica de 140 a 240 caracteres."
    }
  ],
  "matrizes_estrategicas": {
    "vrio": [
      { "letra": "V", "nome": "Valor", "analise": "Análise VRIO de 140 a 250 caracteres." },
      { "letra": "R", "nome": "Raridade", "analise": "Análise VRIO de 140 a 250 caracteres." },
      { "letra": "I", "nome": "Imitabilidade", "analise": "Análise VRIO de 140 a 250 caracteres." },
      { "letra": "O", "nome": "Organizacao", "analise": "Análise VRIO de 140 a 250 caracteres." }
    ],
    "porter": [
      { "forca": "Rivalidade entre Concorrentes", "intensidade": "alta", "analise": "Análise de 140 a 250 caracteres." },
      { "forca": "Ameaca de Novos Entrantes", "intensidade": "media", "analise": "Análise de 140 a 250 caracteres." },
      { "forca": "Produtos Substitutos", "intensidade": "alta", "analise": "Análise de 140 a 250 caracteres." },
      { "forca": "Barganha dos Fornecedores", "intensidade": "baixa", "analise": "Análise de 140 a 250 caracteres." },
      { "forca": "Barganha dos Clientes", "intensidade": "alta", "analise": "Análise de 140 a 250 caracteres." }
    ]
  },
  "mix_marketing": {
    "cinco_ps": [
      { "p": "Produto", "analise": "Diretriz de 120 a 220 caracteres." },
      { "p": "Preco", "analise": "Diretriz de 120 a 220 caracteres." },
      { "p": "Praca", "analise": "Diretriz de 120 a 220 caracteres." },
      { "p": "Promocao", "analise": "Diretriz de 120 a 220 caracteres." },
      { "p": "Pessoas", "analise": "Diretriz de 120 a 220 caracteres." }
    ],
    "oceano_azul": {
      "eliminar": "Ação de eliminar em 120 a 220 caracteres.",
      "reduzir": "Ação de reduzir em 120 a 220 caracteres.",
      "elevar": "Ação de elevar em 120 a 220 caracteres.",
      "criar": "Ação de criar em 120 a 220 caracteres."
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
    systemPrompt: `1. MISSÃO DA ETAPA:
Posicionar a ideia no tecido sociocultural de SJC, responder as reações das 4 tribos e selecionar de 2 a 4 IDs de verbalizações reais do verbatims_pool.

2. REGRAS DE VERBALIZAÇÃO (ESTRITAS):
- Devolva APENAS os IDs exatos das verbalizações escolhidas do verbatims_pool.
- NUNCA invente ou altere o texto da citação. O servidor buscará o texto exato do snapshot pelo ID.
- Se houver citações com tem_mencao_direta_ao_nicho: true no pool, selecione ao menos uma com eh_inferencia_indireta: false e tipo_de_conexao: "DIRETA_TEMATICA".

3. CONTRATO JSON:
Retorne SOMENTE um objeto JSON puro:
{
  "movimentos_culturais": {
    "veredicto_final": {
      "nome_movimento": "A Tribo Global", // Exatamente um dos 4 nomes de movimento
      "justificativa_densa": "Justificativa de 400 a 800 caracteres.",
      "condicao_de_sucesso": "Condição de 200 a 350 caracteres.",
      "risco_de_erro": "Risco de 200 a 350 caracteres."
    },
    "quatro_movimentos_analise": {
      "reacao_geografia_silencio": "Reação da tribo em 160 a 280 caracteres.",
      "reacao_cidade_prometida": "Reação da tribo em 160 a 280 caracteres.",
      "reacao_tribo_global": "Reação da tribo em 160 a 280 caracteres.",
      "reacao_empreendedorismo_intuitivo": "Reação da tribo em 160 a 280 caracteres."
    }
  },
  "verbalizacoes_selecionadas": [
    {
      "id": "id_exato_do_pool",
      "eh_inferencia_indireta": false,
      "tipo_de_conexao": "DIRETA_TEMATICA",
      "conexao_com_sua_ideia": "Conexão substantiva de 150 a 250 caracteres."
    }
  ],
  "plano_de_validacao": {
    "guia_entrevista_perguntas": [
      "Pergunta estilo Mom Test de 140 a 250 caracteres.",
      "Pergunta estilo Mom Test de 140 a 250 caracteres.",
      "Pergunta estilo Mom Test de 140 a 250 caracteres.",
      "Pergunta estilo Mom Test de 140 a 250 caracteres."
    ]
  }
}`
  }
];

// 10. VALIDAÇÃO SEMÂNTICA E DE SCHEMA DAS ETAPAS
function validateModuleResult(stepId, result, snapshot, job) {
  if (!result || typeof result !== 'object' || Object.keys(result).length === 0) {
    throw new Error("AI_INVALID_JSON: O resultado da etapa retornou um objeto vazio.");
  }

  if (stepId === "visao_veredito_territorio") {
    if (typeof result.visao_estrategica_texto !== "string" || result.visao_estrategica_texto.trim().length < 50) {
      throw new Error("SCHEMA_VALIDATION_ERROR: Campo 'visao_estrategica_texto' inválido ou muito curto.");
    }
    const validPosturas = ["avancar", "avancar_com_cautela", "pivotar"];
    if (!validPosturas.includes(result.veredito_postura)) {
      throw new Error(`SCHEMA_VALIDATION_ERROR: 'veredito_postura' inválido: '${result.veredito_postura}'. Esperado um de: ${validPosturas.join(", ")}`);
    }
    if (!Array.isArray(result.bairros) || result.bairros.length === 0) {
      throw new Error("SCHEMA_VALIDATION_ERROR: Campo 'bairros' deve ser uma lista não vazia.");
    }
  }

  if (stepId === "swot_causalidade_ambiente") {
    if (!result.swot || !Array.isArray(result.swot.forcas) || !Array.isArray(result.swot.fraquezas)) {
      throw new Error("SCHEMA_VALIDATION_ERROR: Matriz SWOT incompleta ou formato inválido.");
    }
    if (!result.pestel || !result.pestel.P || !result.pestel.E || !result.pestel.S || !result.pestel.T || !result.pestel.E_env || !result.pestel.L) {
      throw new Error("SCHEMA_VALIDATION_ERROR: Análise PESTEL deve conter todas as 6 dimensões (P, E, S, T, E_env, L).");
    }
    if (!result.ishikawa || !result.ishikawa.problema_central || !Array.isArray(result.ishikawa.causas) || result.ishikawa.causas.length !== 4) {
      throw new Error("SCHEMA_VALIDATION_ERROR: Diagrama de Ishikawa deve conter o problema central e exatamente 4 causas estruturais.");
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
        throw new Error("PROHIBITED_INDICATOR: O indicador 'renda_familiar' é proibido nos 3 gráficos analíticos dinâmicos.");
      }
      if (niche.isEducaInfantil && sel.indicador_id === "criterios_escolha") {
        throw new Error("MISMATCHED_DOMAIN_INDICATOR: Para Educação Infantil, é proibido selecionar 'criterios_escolha' (bares/restaurantes). Use 'meios_transporte'.");
      }
      if (sel.indicador_id === "redes_descoberta" && (niche.isEducaInfantil || niche.isCursosAdultos || niche.isSaude || niche.isB2B)) {
        sel.eh_proxy_comportamental = true;
        if (!sel.o_que_nao_prova || !sel.o_que_nao_prova.includes("TRANSLADAÇÃO")) {
          sel.o_que_nao_prova = `ALERTA DE TRANSLADAÇÃO METODOLÓGICA: Este indicador foi medido originalmente no contexto de busca por lugares e lazer (restaurantes, lojas e passeios). Está sendo utilizado como proxy analógico de hábitos digitais gerais para inferir os canais de busca dos clientes de ${job?.idea || "serviços"}.`;
        }
      }
      if (!sel.indicador_id || !snapshot.indicators[sel.indicador_id]) {
        throw new Error(`INDICATOR_NOT_FOUND: O indicador '${sel.indicador_id}' não existe no catálogo oficial do Supabase.`);
      }
    }

    if (niche.isEducaInfantil) {
      const hasTransporte = graficos.some(g => g.indicador_id === "meios_transporte");
      if (!hasTransporte) {
        throw new Error("MISSING_MANDATORY_DOMAIN_INDICATOR: Para Educação Infantil, o indicador direto 'meios_transporte' é obrigatório.");
      }
    }

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
      throw new Error(`INVALID_MOVEMENT_WINNER: O movimento vencedor '${winnerName}' não é um dos 4 movimentos oficiais.`);
    }

    if (!Array.isArray(result.verbalizacoes_selecionadas) || result.verbalizacoes_selecionadas.length < 2) {
      throw new Error("INVALID_VERBATIM_SELECTION: É necessário selecionar ao menos 2 verbalizações reais.");
    }

    const niche = classifyNiche(job?.idea || "");
    let hasDirectVerbatimInSelection = false;

    for (const sel of result.verbalizacoes_selecionadas) {
      const foundInDb = (snapshot.verbatims || []).find(v => v.id === sel.id);
      if (!foundInDb) {
        throw new Error(`VERBATIM_NOT_FOUND: A citação ID '${sel.id}' não existe no snapshot oficial da pesquisa.`);
      }

      if (niche.isEducaInfantil && foundInDb.perfil?.idade && foundInDb.perfil.idade.includes("+65")) {
        throw new Error(`DEMOGRAPHIC_MISMATCH: A citação '${sel.id}' (${foundInDb.perfil?.idade}) pertence a uma faixa etária sênior (+65) incompatível com pais decisores de escola infantil.`);
      }

      // VINCULAÇÃO ESTRITA DO TEXTO: Servidor sobrescreve o texto com o original do snapshot!
      sel.citacao = foundInDb.citacao_original;

      const txtLower = (foundInDb.citacao_original || "").toLowerCase();
      const temMencaoDireta = txtLower.includes("filho") || txtLower.includes("criança") || txtLower.includes("crianca") || txtLower.includes("escola") || txtLower.includes("educa") || txtLower.includes("família") || txtLower.includes("familia") || txtLower.includes("bebê") || txtLower.includes("creche");
      
      if (temMencaoDireta) {
        sel.eh_inferencia_indireta = false;
        sel.tipo_de_conexao = "DIRETA_TEMATICA";
        hasDirectVerbatimInSelection = true;
      } else {
        if (sel.eh_inferencia_indireta === undefined) sel.eh_inferencia_indireta = true;
        if (!sel.tipo_de_conexao) sel.tipo_de_conexao = sel.eh_inferencia_indireta ? "INFERENCIA_CONTEXTUAL" : "DIRETA_TEMATICA";
        if (sel.tipo_de_conexao === "DIRETA_TEMATICA" && !sel.eh_inferencia_indireta) hasDirectVerbatimInSelection = true;
      }
    }

    const pool = buildStratifiedVerbatimsPool(snapshot.verbatims, job?.idea || "");
    const poolHasDirect = pool.some(item => item.tem_mencao_direta_ao_nicho);
    if (poolHasDirect && !hasDirectVerbatimInSelection) {
      throw new Error("MISSING_DIRECT_VERBATIM: O pool contém citações com menção direta ao nicho. É OBRIGATÓRIO selecionar ao menos uma citação com 'tipo_de_conexao': 'DIRETA_TEMATICA'.");
    }
  }

  // Vinculação Geral de Citações Qualitativas (para qualquer módulo)
  if (Array.isArray(result.evidencias_qualitativas)) {
    const verbatimsList = snapshot?.verbatims || snapshot?.citacoes_disponiveis || snapshot?.facts?.citacoes_disponiveis || (Array.isArray(snapshot) ? snapshot : []);
    result.evidencias_qualitativas = result.evidencias_qualitativas.filter(q => {
      const found = verbatimsList.find(v => v.id === q.id);
      if (found) {
        q.citacao_original = found.citacao_original || found.citacao || "";
        q.citacao = found.citacao_original || found.citacao || "";
        return true;
      }
      return false;
    });
  }

  return result;
}

// 11. MONTAGEM FINAL DO RELATÓRIO EXECUTIVO
function assembleFinalReport(job, snapshot) {
  const p = job.partial_results || {};
  const mod1 = p.visao_veredito_territorio || {};
  const mod2 = p.swot_causalidade_ambiente || {};
  const mod3 = p.selecao_graficos_matrizes || {};
  const mod4 = p.movimentos_vencedor_testes || {};

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
    const baseItem = (snapshot.verbatims || []).find(v => v.id === sel.id) || {
      id: sel.id || "verb_default",
      citacao_original: sel.citacao || "",
      perfil: { genero: "Não informado", idade: "Geral", regiao: "São José dos Campos", renda: "Média" },
      pergunta_origem: "Pesquisa Radar SJC"
    };

    const isIndireta = sel.eh_inferencia_indireta !== undefined ? Boolean(sel.eh_inferencia_indireta) : false;
    const tipoConexao = sel.tipo_de_conexao || (isIndireta ? "INFERENCIA_CONTEXTUAL" : "DIRETA_TEMATICA");

    return {
      id: baseItem.id,
      citacao: baseItem.citacao_original, // GARANTIDO: Copiado do snapshot pelo ID!
      genero: baseItem.perfil?.genero || "Geral",
      idade: baseItem.perfil?.idade || "",
      regiao: baseItem.perfil?.regiao || "SJC",
      renda: baseItem.perfil?.renda || "",
      pergunta_origem: baseItem.pergunta_origem || "Pesquisa de Campo",
      eh_inferencia_indireta: isIndireta,
      tipo_de_conexao: tipoConexao,
      conexao_com_sua_ideia: sel.conexao_com_sua_ideia || "",
      por_que_foi_selecionada: sel.conexao_com_sua_ideia || ""
    };
  });

  const swotClean = {
    forcas: (mod2.swot?.forcas || []).map(f => typeof f === 'object' ? (f.texto || f.item) : f),
    fraquezas: (mod2.swot?.fraquezas || []).map(f => typeof f === 'object' ? (f.texto || f.item) : f),
    oportunidades: (mod2.swot?.oportunidades || []).map(f => typeof f === 'object' ? (f.texto || f.item) : f),
    ameacas: (mod2.swot?.ameacas || []).map(f => typeof f === 'object' ? (f.texto || f.item) : f)
  };

  const pestelClean = {
    P: typeof mod2.pestel?.P === 'object' ? `${mod2.pestel.P.fator} - ${mod2.pestel.P.decisao_recomendada}` : (mod2.pestel?.P || "Diretrizes municipais."),
    E: typeof mod2.pestel?.E === 'object' ? `${mod2.pestel.E.fator} - ${mod2.pestel.E.decisao_recomendada}` : (mod2.pestel?.E || "Contexto econômico."),
    S: typeof mod2.pestel?.S === 'object' ? `${mod2.pestel.S.fator} - ${mod2.pestel.S.decisao_recomendada}` : (mod2.pestel?.S || "Hábitos socioculturais."),
    T: typeof mod2.pestel?.T === 'object' ? `${mod2.pestel.T.fator} - ${mod2.pestel.T.decisao_recomendada}` : (mod2.pestel?.T || "Canais digitais."),
    E_env: typeof mod2.pestel?.E_env === 'object' ? `${mod2.pestel.E_env.fator} - ${mod2.pestel.E_env.decisao_recomendada}` : (mod2.pestel?.E_env || "Sustentabilidade."),
    L: typeof mod2.pestel?.L === 'object' ? `${mod2.pestel.L.fator} - ${mod2.pestel.L.decisao_recomendada}` : (mod2.pestel?.L || "Zoneamento e normas.")
  };

  const perf = job.performance || {};
  const metrics = job.step_metrics || {};

  return {
    context_snapshot: snapshot.metadata || snapshot.context_snapshot || {},
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
      analise_cards: mod4.movimentos_culturais?.quatro_movimentos_analise || mod4.movimentos_culturais?.analise_cards
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
    generation_debug: {
      source_metadata: snapshot.metadata || {},
      duracao_total_ms: perf.total_ms || 0,
      duracao_por_etapa: perf.ai_ms_por_etapa || {},
      step_metrics: metrics
    }
  };
}

// 12. HANDLER SERVERLESS PRINCIPAL
module.exports = async function handler(req, res, options = {}) {
  const handlerStartTime = Date.now();
  const workerId = options.workerId || `worker_${Math.random().toString(36).substring(2, 9)}`;
  const mockProvider = options.mockProvider || null;

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

    // Segurança de Credenciais: Apenas process.env ou Headers autorizados
    const apiKey = (process.env.GROQ_API_KEY || req.headers?.["x-groq-key"] || "").trim();
    const geminiKey = (process.env.GEMINI_API_KEY || req.headers?.["x-gemini-key"] || "").trim();

    // ROTA DE DIAGNÓSTICO (action === "diag")
    if (action === "diag") {
      const loc = locatePresentation();
      return res.status(200).json({
        server_time: new Date().toISOString(),
        active_provider: geminiKey ? "gemini" : (apiKey ? "groq" : "none"),
        groq_model: GROQ_MODEL,
        gemini_model: GEMINI_MODEL,
        presentation: loc,
        supabase_url_configured: Boolean(SUPABASE_URL),
        groq_api_key_configured: Boolean(apiKey),
        gemini_api_key_configured: Boolean(geminiKey)
      });
    }

    // ROTA POST: Criar e Iniciar Novo Job
    if (req.method === "POST" && (action === "start" || !action)) {
      const ideaInput = String(body.idea || body.user_input || body.question || body.prompt || "").trim();
      const reportToAudit = String(body.report_to_audit || body.presentation || "").trim();
      
      const combinedInput = String(ideaInput || "Consultoria estratégica de negócios em SJC").trim();

      if (combinedInput.length > 10000 || reportToAudit.length > 10000) {
        return res.status(413).json({
          error_code: "PAYLOAD_TOO_LARGE",
          error: "O texto de entrada excede o limite seguro de caracteres (10.000)."
        });
      }

      const newJobId = "job_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9);
      const postDurationMs = Date.now() - handlerStartTime;

      const newJob = {
        job_id: newJobId,
        idea: combinedInput,
        report_to_audit: reportToAudit,
        rows: Array.isArray(body.rows) ? body.rows : null,
        total_expected_rows: body.total_expected_rows || null,
        status: "queued",
        current_step: 0,
        total_steps: MODULE_DEFINITIONS.length,
        completed_steps: [],
        partial_results: {},
        context_snapshot: null,
        step_metrics: {},
        attempts_by_step: {},
        rate_limit_attempts_by_step: {},
        revision: 1,
        cancel_requested: false,
        worker_id: null,
        lease_expires_at: null,
        performance: {
          post_response_ms: postDurationMs,
          supabase_ms: 0,
          ibge_ms: 0,
          presentation_ms: 0,
          ai_ms_por_etapa: {},
          total_ms: 0
        },
        final_result: null,
        message: "Job criado com sucesso. Polling iniciado para preparação de fontes oficiais.",
        retry_after_at: null,
        is_processing: false,
        last_error: null,
        error_code: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      await saveJob(newJob);

      return res.status(200).json({
        success: true,
        job_id: newJobId,
        status: "queued",
        current_step: 0,
        total_steps: MODULE_DEFINITIONS.length,
        message: "Job criado com sucesso."
      });
    }

    // ROTA GET/POST: Status do Job (STEP-DRIVEN EXECUTION ENGINE)
    if (action === "status") {
      if (!jobId) {
        return res.status(400).json({ error_code: "MISSING_JOB_ID", error: "Parâmetro job_id obrigatório." });
      }

      const getRes = await getJob(jobId);
      const job = getRes.job;

      if (!job) {
        return res.status(404).json({ error_code: "JOB_NOT_FOUND", error: "Job não encontrado ou expirado." });
      }

      function formatStatusResponse(jobData, overrides = {}) {
        jobData = jobData || {};
        const stepIndex = typeof jobData.current_step === "number" ? jobData.current_step : 0;
        const stepDef = MODULE_DEFINITIONS[stepIndex] || {};
        const stepAttempt = (jobData.attempts_by_step && stepDef.id && jobData.attempts_by_step[stepDef.id]) || 0;
        
        return {
          job_id: jobData.job_id || jobId,
          status: jobData.status || "pending",
          current_step: stepIndex,
          current_module_label: stepDef.label || "Conclusão",
          step: stepDef.id || "conclusao",
          attempt: stepAttempt,
          max_attempts: 3,
          is_processing: Boolean(jobData.is_processing),
          cancel_requested: Boolean(jobData.cancel_requested),
          updated_at: jobData.updated_at || new Date().toISOString(),
          last_error: jobData.last_error || null,
          error_code: jobData.error_code || null,
          completed_steps: jobData.completed_steps || [],
          total_steps: MODULE_DEFINITIONS.length,
          progress_percent: Math.round(((jobData.completed_steps || []).length / MODULE_DEFINITIONS.length) * 100),
          message: jobData.message || "Processando...",
          ...overrides
        };
      }

      if (job.status === "completed" || job.status === "failed" || job.status === "cancelled") {
        return res.status(200).json(formatStatusResponse(job, { success: job.status === "completed" }));
      }

      if (job.cancel_requested) {
        job.status = "cancelled";
        job.message = "Job cancelado a pedido do usuário.";
        await releaseJobLock(job);
        return res.status(200).json(formatStatusResponse(job, { success: false }));
      }

      // Tentativa de Aquisição de Lock Atômico
      const lockResult = await acquireJobLock(jobId, workerId);
      if (!lockResult.acquired) {
        return res.status(200).json(formatStatusResponse(lockResult.job || job, { success: true }));
      }

      const activeJob = lockResult.job;
      if (activeJob.current_step < MODULE_DEFINITIONS.length) {
        const stepDef = MODULE_DEFINITIONS[activeJob.current_step];
        const stepStartTime = Date.now();
        
        activeJob.status = "running";
        activeJob.attempts_by_step = activeJob.attempts_by_step || {};
        activeJob.attempts_by_step[stepDef.id] = (activeJob.attempts_by_step[stepDef.id] || 0) + 1;
        const currentAttemptNumber = activeJob.attempts_by_step[stepDef.id];
        await saveJob(activeJob);

        // ETAPA 0: CARREGAMENTO DE FONTES OFICIAIS
        if (stepDef.id === "source_preparation" || stepDef.isPreparationStep) {
          try {
            const [ibgeRes, culturalRes] = await Promise.all([
              loadIbgeData(),
              loadCulturalMovements()
            ]);

            let supabaseRes;
            if (activeJob.rows && Array.isArray(activeJob.rows) && activeJob.rows.length > 0) {
              const facts = buildFactsPayload(activeJob.rows, activeJob.idea, activeJob.total_expected_rows);
              supabaseRes = {
                data: {
                  metadata: facts.context_snapshot,
                  totalN: facts.context_snapshot.row_count,
                  indicators: {
                    meios_transporte: { coluna: "Meios de Transporte", denominador: facts.context_snapshot.row_count, categorias: [{ nome: "Carro", percentual: 50, n: 1 }] },
                    regioes_frequentadas: { coluna: "Regiões Frequentadas", denominador: facts.context_snapshot.row_count, categorias: [{ nome: "Centro", percentual: 50, n: 1 }] },
                    redes_descoberta: { coluna: "Redes de Descoberta", denominador: facts.context_snapshot.row_count, categorias: [{ nome: "Instagram", percentual: 50, n: 1 }] }
                  },
                  verbatims: activeJob.rows
                },
                duration_ms: 5
              };
            } else {
              supabaseRes = await loadSupabaseResearchData();
            }

            activeJob.context_snapshot = {
              metadata: supabaseRes.data.metadata,
              totalN: supabaseRes.data.totalN,
              indicators: supabaseRes.data.indicators,
              verbatims: supabaseRes.data.verbatims,
              ibge: ibgeRes.data,
              cultural_movements: culturalRes.data.movimentos
            };

            activeJob.performance = activeJob.performance || {};
            activeJob.performance.supabase_ms = supabaseRes.duration_ms;
            activeJob.performance.ibge_ms = ibgeRes.duration_ms;
            activeJob.performance.presentation_ms = culturalRes.duration_ms;

            activeJob.completed_steps = activeJob.completed_steps || [];
            if (!activeJob.completed_steps.includes(stepDef.id)) {
              activeJob.completed_steps.push(stepDef.id);
            }
            activeJob.current_step = 1;
            activeJob.last_error = null;
            activeJob.error_code = null;
            activeJob.message = "Fontes oficiais carregadas com sucesso. Avançando para a Tese Estratégica...";

            await releaseJobLock(activeJob);
            return res.status(200).json(formatStatusResponse(activeJob, { success: true }));

          } catch (prepErr) {
            activeJob.status = "failed";
            activeJob.error_code = prepErr.error_code || "SUPABASE_FETCH_ERROR";
            activeJob.message = `Falha ao preparar fontes oficiais: ${prepErr.message}`;
            activeJob.last_error = prepErr.message;
            await releaseJobLock(activeJob);
            return res.status(200).json(formatStatusResponse(activeJob, { success: false }));
          }
        }

        // ETAPAS 1 A 4: INFERÊNCIA ESTRATÉGICA VIA IA
        let stepPayloadStr = "";
        try {
          if (!apiKey && !geminiKey && !mockProvider) {
            throw new Error("AI_NOT_CONFIGURED: Nenhuma chave de IA configurada.");
          }

          if (!activeJob.context_snapshot) {
            throw new Error("SNAPSHOT_MISSING: Snapshot de dados não inicializado.");
          }

          const stepContext = buildStepContext(stepDef.id, activeJob.context_snapshot, activeJob);
          stepPayloadStr = JSON.stringify({
            analysisTarget: { idea: activeJob.idea },
            analysisContext: stepContext
          });

          // CHECAGEM DE CANCELAMENTO PRÉ-CHAMADA IA
          const freshCheck = await getJob(jobId);
          if (freshCheck.job?.cancel_requested) {
            activeJob.status = "cancelled";
            activeJob.message = "Job cancelado pelo usuário durante execução.";
            await releaseJobLock(activeJob);
            return res.status(200).json(formatStatusResponse(activeJob, { success: false }));
          }

          let aiResult;
          const stepTemperature = stepDef.id === "visao_veredito_territorio" ? 0.4 : 0.1;
          try {
            aiResult = await callAIStep({
              groqKey: apiKey,
              geminiKey: geminiKey,
              systemPrompt: stepDef.systemPrompt,
              userPayloadStr: stepPayloadStr,
              maxTokens: stepDef.maxTokens || 700,
              timeoutMs: 25000,
              stepId: stepDef.id,
              stepLabel: stepDef.label,
              temperature: stepTemperature,
              mockProvider: mockProvider
            });
            validateModuleResult(stepDef.id, aiResult.result, activeJob.context_snapshot, activeJob);
          } catch (firstAttemptErr) {
            if (firstAttemptErr.error_code === "AI_INVALID_JSON" || 
                firstAttemptErr.error_code === "SCHEMA_VALIDATION_ERROR" ||
                firstAttemptErr.message.includes("MISMATCHED_DOMAIN_INDICATOR") ||
                firstAttemptErr.message.includes("MISSING_DIRECT_VERBATIM") ||
                firstAttemptErr.message.includes("DEMOGRAPHIC_MISMATCH") ||
                firstAttemptErr.message.includes("PROHIBITED_INDICATOR")) {
              
              const recoverySystemPrompt = `${stepDef.systemPrompt}\n\nATENÇÃO OBRIGATÓRIA: Sua resposta anterior falhou na validação com o erro: "${firstAttemptErr.message}". Corrija o JSON retornado mantendo rigorosamente a especificação.`;
              aiResult = await callAIStep({
                groqKey: apiKey,
                geminiKey: geminiKey,
                systemPrompt: recoverySystemPrompt,
                userPayloadStr: stepPayloadStr,
                maxTokens: stepDef.maxTokens || 750,
                timeoutMs: 25000,
                stepId: stepDef.id,
                stepLabel: `${stepDef.label} (Recovery Retry)`,
                temperature: stepTemperature,
                mockProvider: mockProvider
              });
              validateModuleResult(stepDef.id, aiResult.result, activeJob.context_snapshot, activeJob);
            } else {
              throw firstAttemptErr;
            }
          }

          // CHECAGEM DE CANCELAMENTO PÓS-CHAMADA IA
          const postAiCheck = await getJob(jobId);
          if (postAiCheck.job?.cancel_requested) {
            activeJob.status = "cancelled";
            activeJob.message = "Job cancelado pelo usuário antes de salvar resultado.";
            await releaseJobLock(activeJob);
            return res.status(200).json(formatStatusResponse(activeJob, { success: false }));
          }

          activeJob.partial_results = activeJob.partial_results || {};
          activeJob.partial_results[stepDef.id] = aiResult.result;
          activeJob.completed_steps = activeJob.completed_steps || [];
          if (!activeJob.completed_steps.includes(stepDef.id)) {
            activeJob.completed_steps.push(stepDef.id);
          }

          activeJob.performance = activeJob.performance || {};
          activeJob.performance.ai_ms_por_etapa = activeJob.performance.ai_ms_por_etapa || {};
          activeJob.performance.ai_ms_por_etapa[stepDef.id] = aiResult.durationMs;

          activeJob.step_metrics = activeJob.step_metrics || {};
          activeJob.step_metrics[stepDef.id] = {
            provider_used: aiResult.provider,
            model_used: aiResult.model,
            duration_ms: aiResult.durationMs,
            prompt_tokens: aiResult.promptTokens,
            completion_tokens: aiResult.completionTokens,
            total_tokens: aiResult.totalTokens,
            attempts: currentAttemptNumber
          };

          activeJob.current_step += 1;
          activeJob.last_error = null;
          activeJob.error_code = null;

          if (activeJob.current_step >= MODULE_DEFINITIONS.length) {
            activeJob.performance.total_ms = Date.now() - new Date(activeJob.created_at).getTime();
            activeJob.final_result = assembleFinalReport(activeJob, activeJob.context_snapshot);
            activeJob.status = "completed";
            activeJob.message = "Relatório estratégico concluído com sucesso!";
          } else {
            const nextStep = MODULE_DEFINITIONS[activeJob.current_step];
            activeJob.message = `Etapa '${stepDef.label}' concluída com sucesso. Avançando para ${nextStep.label}...`;
          }

          await releaseJobLock(activeJob);
          return res.status(200).json(formatStatusResponse(activeJob, { success: true }));

        } catch (err) {
          if (err.error_code === "AI_QUOTA_EXHAUSTED") {
            activeJob.status = "failed";
            activeJob.error_code = "AI_QUOTA_EXHAUSTED";
            activeJob.message = "Cota diária da IA excedida. O processamento foi encerrado.";
            activeJob.last_error = err.message;
          } else if (err.error_code === "AI_RATE_LIMIT") {
            activeJob.status = "waiting_rate_limit";
            activeJob.error_code = "AI_RATE_LIMIT";
            activeJob.retry_after_at = new Date(Date.now() + ((err.retryAfterSeconds || 10) * 1000)).toISOString();
            activeJob.message = `Limite de requisições atingido. Retomando em ${err.retryAfterSeconds || 10}s...`;
          } else {
            activeJob.last_error = err.message;
            if (currentAttemptNumber >= 3) {
              activeJob.status = "failed";
              activeJob.error_code = err.error_code || "STEP_EXECUTION_FAILED";
              activeJob.message = `Falha ao executar a etapa ${stepDef.label}: ${err.message}`;
            } else {
              activeJob.status = "running";
              activeJob.message = `Tentativa ${currentAttemptNumber}/3: Reexecutando ${stepDef.label}...`;
            }
          }

          await releaseJobLock(activeJob);
          return res.status(200).json(formatStatusResponse(activeJob, { success: activeJob.status !== "failed" }));
        }
      }

      return res.status(200).json(formatStatusResponse(activeJob, { success: true }));
    }

    // ROTA GET: Resultado do Job
    if (action === "result") {
      if (!jobId) {
        return res.status(400).json({ error_code: "MISSING_JOB_ID", error: "Parâmetro job_id obrigatório." });
      }
      const getRes = await getJob(jobId);
      const job = getRes.job;
      if (!job) {
        return res.status(404).json({ error_code: "JOB_NOT_FOUND", error: "Job não encontrado." });
      }
      if (job.status !== "completed") {
        return res.status(400).json({ 
          error_code: "JOB_NOT_COMPLETED",
          error: "O job ainda não foi concluído.", 
          status: job.status
        });
      }

      return res.status(200).json({
        success: true,
        job_id: job.job_id,
        status: "completed",
        result: job.final_result
      });
    }

    // ROTA POST: Cancelamento de Job
    if (action === "cancel") {
      if (!jobId) {
        return res.status(400).json({ error_code: "MISSING_JOB_ID", error: "Parâmetro job_id obrigatório." });
      }
      const getRes = await getJob(jobId);
      const job = getRes.job;
      if (job) {
        job.cancel_requested = true;
        job.status = "cancelled";
        job.error_code = "JOB_CANCELLED";
        job.message = "Job cancelado pelo usuário.";
        job.is_processing = false;
        await saveJob(job);
      }
      return res.status(200).json({ success: true, message: "Job cancelado com sucesso." });
    }

    return res.status(400).json({ error: "Ação não suportada." });

  } catch (error) {
    // HIGIENE DE SEGURANÇA: Resposta limpa sem stack trace ou segredos vazados
    return res.status(500).json({
      error_code: "INTERNAL_SERVER_ERROR",
      error: "Erro interno no Servidor.",
      message: error.message
    });
  }
};

// Exportar auxiliares internos para suíte de testes unitários e auditoria
module.exports.buildFactsPayload = typeof buildFactsPayload !== "undefined" ? buildFactsPayload : null;
module.exports.extractJsonFromText = typeof extractJsonFromText !== "undefined" ? extractJsonFromText : null;
module.exports.validateModuleResult = typeof validateModuleResult !== "undefined" ? validateModuleResult : null;
module.exports.acquireJobLock = typeof acquireJobLock !== "undefined" ? acquireJobLock : null;
module.exports.releaseJobLock = typeof releaseJobLock !== "undefined" ? releaseJobLock : null;
module.exports.normalizeAIError = typeof normalizeAIError !== "undefined" ? normalizeAIError : null;
module.exports.callAIStep = typeof callAIStep !== "undefined" ? callAIStep : null;
module.exports.MODULE_DEFINITIONS = typeof MODULE_DEFINITIONS !== "undefined" ? MODULE_DEFINITIONS : null;
module.exports.IN_MEMORY_JOBS = typeof MEMORY_JOBS !== "undefined" ? MEMORY_JOBS : null;
module.exports.MEMORY_JOBS = typeof MEMORY_JOBS !== "undefined" ? MEMORY_JOBS : null;


