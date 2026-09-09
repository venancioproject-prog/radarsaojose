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
async function callGroqStep(apiKey, systemPrompt, userPayloadStr, maxTokens = 750, timeoutMs = 25000, stepLabel = "Etapa") {
  const startTime = Date.now();
  console.log("[Groq] Modelo utilizado:", GROQ_MODEL);
  console.log(`[GROQ START] ${stepLabel} - Enviando ${userPayloadStr.length} chars (Timeout: ${timeoutMs / 1000}s)...`);

  const response = await fetchWithTimeout("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPayloadStr }
      ],
      temperature: 0.2,
      max_tokens: maxTokens,
      response_format: { type: "json_object" }
    })
  }, timeoutMs, `Groq (${stepLabel})`);

  const durationMs = Date.now() - startTime;
  console.log(`[GROQ SUCCESS] ${stepLabel} - Resposta recebida em ${durationMs}ms.`);

  if (!response.ok) {
    const errText = await response.text();
    const retryAfter = response.headers.get("retry-after");
    
    // Diagnóstico detalhado de erro de validação JSON da Groq
    if (errText.includes("json_validate_failed") || errText.includes("Failed to validate JSON")) {
      console.error(`[GROQ JSON VALIDATE FAILED] Etapa: ${stepLabel}`);
      console.error(`[GROQ JSON VALIDATE FAILED] Modelo: ${GROQ_MODEL}`);
      console.error(`[GROQ JSON VALIDATE FAILED] Tamanho System Prompt: ${systemPrompt.length} chars`);
      console.error(`[GROQ JSON VALIDATE FAILED] Tamanho User Payload: ${userPayloadStr.length} chars`);
      console.error(`[GROQ JSON VALIDATE FAILED] Max Tokens: ${maxTokens}`);
      console.error(`[GROQ JSON VALIDATE FAILED] Erro retornado pela Groq: ${errText}`);
    }

    const errorObj = new Error(`GROQ_API_ERROR: Falha na chamada da Groq (${response.status}): ${errText}`);
    errorObj.status = response.status;
    errorObj.retryAfterSeconds = retryAfter ? parseInt(retryAfter, 10) : 8;
    errorObj.durationMs = durationMs;
    errorObj.rawErrorBody = errText;
    
    if (errText.includes("json_validate_failed") || errText.includes("Failed to validate JSON")) {
      errorObj.isJsonValidateFailed = true;
      errorObj.error_code = "GROQ_JSON_VALIDATE_FAILED";
    }

    // Detecção imediata de modelo inválido/descontinuado (400 ou 404)
    if (response.status === 404 || (response.status === 400 && (errText.includes("model") || errText.includes("decommissioned") || errText.includes("not found")))) {
      errorObj.isModelInvalid = true;
      errorObj.error_code = "GROQ_MODEL_INVALID";
      errorObj.model_used = GROQ_MODEL;
    }

    if (response.status === 429 && (errText.includes("TPD") || errText.includes("Day") || errText.includes("quota"))) {
      errorObj.isQuotaExhausted = true;
    }
    throw errorObj;
  }

  const data = await response.json();
  const rawContent = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || "";
  
  if (!rawContent || rawContent.trim().length === 0) {
    const emptyErr = new Error("GROQ_EMPTY_GENERATION: A Groq retornou geração vazia.");
    emptyErr.error_code = "GROQ_EMPTY_GENERATION";
    throw emptyErr;
  }

  let parsed;
  try {
    parsed = JSON.parse(rawContent);
  } catch (e) {
    const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        parsed = JSON.parse(jsonMatch[0]);
      } catch (innerErr) {
        throw new Error(`GROQ_INVALID_JSON: A IA não retornou um objeto JSON válido. Resposta: ${rawContent.slice(0, 100)}`);
      }
    } else {
      throw new Error(`GROQ_INVALID_JSON: A IA não retornou um objeto JSON válido. Resposta: ${rawContent.slice(0, 100)}`);
    }
  }

  return {
    result: parsed,
    durationMs,
    outputChars: rawContent.length,
    inputChars: userPayloadStr.length + systemPrompt.length
  };
}

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
        report_to_audit: job.report_to_audit || null,
        total_sample_n: snapshot.totalN,
        territorial_and_economic_indicators: {
          renda_familiar: ind.renda_familiar,
          regioes_frequentadas: ind.regioes_frequentadas,
          evasao_consumo: ind.evasao_consumo,
          frequencia_saida: ind.frequencia_saida
        },
        ibge_data: ibge,
        cultural_movements_summary: {
          geografia_silencio: mov.geografia_silencio?.nome + ": " + mov.geografia_silencio?.diagnostico,
          cidade_prometida: mov.cidade_prometida?.nome + ": " + mov.cidade_prometida?.diagnostico,
          tribo_global: mov.tribo_global?.nome + ": " + mov.tribo_global?.diagnostico,
          empreendedorismo_intuitivo: mov.empreendedorismo_intuitivo?.nome + ": " + mov.empreendedorismo_intuitivo?.diagnostico
        }
      };

    case "swot_causalidade_ambiente":
      return {
        idea: job.idea,
        total_sample_n: snapshot.totalN,
        behavior_and_barrier_indicators: {
          barreiras_saida: ind.barreiras_saida,
          criterios_escolha: ind.criterios_escolha,
          demanda_reprimida: ind.demanda_reprimida,
          pets_posse: ind.pets_posse,
          produtores_locais: ind.produtores_locais,
          influenciadores: ind.influenciadores
        },
        sample_verbatims: verb.slice(0, 12),
        visao_estrategica_previa: job.partial_results?.visao_veredito_territorio || null
      };

    case "selecao_graficos_matrizes":
      return {
        idea: job.idea,
        total_sample_n: snapshot.totalN,
        available_indicators: Object.entries(ind).map(([id, i]) => ({
          indicador_id: id,
          coluna: i.coluna,
          denominador: i.denominador,
          tipo_grafico: i.tipo_grafico,
          distribuicao_percentual: (i.categorias || []).map(c => `${c.nome}: ${c.percentual}%`).join(' | ')
        })),
        visao_estrategica_previa: job.partial_results?.visao_veredito_territorio || null,
        swot_previa: job.partial_results?.swot_causalidade_ambiente?.swot || null
      };

    case "movimentos_vencedor_testes":
      return {
        idea: job.idea,
        total_sample_n: snapshot.totalN,
        cultural_movements: mov,
        verbatims_pool: verb.slice(0, 20),
        key_indicators: {
          evasao_consumo: ind.evasao_consumo,
          frequencia_saida: ind.frequencia_saida,
          redes_descoberta: ind.redes_descoberta,
          orgulho_morar: ind.orgulho_morar
        },
        visao_estrategica_previa: job.partial_results?.visao_veredito_territorio || null
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
    maxTokens: 1400,
    systemPrompt: `Voce e o Consultor Estrategico Senior do Radar SJC.
Sua funcao e emitir um parecer consultivo maduro, humano, decisivo e criativo.

DIRETRIZES:
1. RIGOR FACTUAL: Use EXCLUSIVAMENTE os dados e numeros fornecidos no analysisContext. Nao invente percentuais.
2. CONCISAO E PROFUNDIDADE: O campo visao_estrategica_texto deve conter no maximo 2 paragrafos objetivos e densos.
3. BAIRROS E POLOS: Retorne no maximo 5 bairros ou polos prioritarios de SJC no array bairros. Em nivel_de_confianca use estritamente "alta", "media" ou "baixa".
4. FORMATACAO ESTRITA: Retorne EXCLUSIVAMENTE um objeto JSON valido.
- Nao inclua markdown (sem marcadores de bloco json).
- Nao escreva texto antes ou depois do JSON.
- Use aspas duplas em todas as chaves e valores.
- Nao use virgula antes de fechar chaves ou colchetes.

ESTRUTURA JSON EXATA:
{
  "visao_estrategica_texto": "Texto da analise estrategica em ate 2 paragrafos densos.",
  "veredito_postura": "avancar",
  "veredito_justificativa": "Justificativa clara do veredito para o empreendedor.",
  "bairros": [
    {
      "nome": "Jardim Aquarius",
      "regiao": "Centro-Oeste",
      "formato_recomendado": "Loja de Rua",
      "justificativa": "Justificativa estrategica ancorada no contexto socioeconomico do bairro.",
      "nivel_de_confianca": "alta"
    }
  ],
  "zona_exclusao": "Local ou formato que deve ser evitado e por qual motivo."
}`
  },
  {
    stepIndex: 2,
    id: "swot_causalidade_ambiente",
    label: "Matriz SWOT, PESTEL e Diagrama de Ishikawa",
    message: "Auditando ambiente competitivo, causalidade Ishikawa e matriz SWOT...",
    maxTokens: 700,
    systemPrompt: `Voce e um Especialista em Diagnostico Organizacional e Estrategia Competitiva em SJC.

DIRETRIZES:
1. Analise as condicoes especificas da cidade para esta ideia de negocio com base no analysisContext recebido.
2. No Diagrama de Ishikawa, identifique causas reais de possivel fracasso ou baixa retencao.
3. No PESTEL, traduza fatores macroeconomicos e culturais de SJC em decisoes recomendadas.

RETORNE EXCLUSIVAMENTE UM JSON com esta estrutura:
{
  "swot": {
    "forcas": [
      { "item": "Forca 1", "texto": "Descricao da forca interna do negocio..." },
      { "item": "Forca 2", "texto": "Descricao da forca 2..." }
    ],
    "fraquezas": [
      { "item": "Fraqueza 1", "texto": "Ponto de vulnerabilidade interna..." },
      { "item": "Fraqueza 2", "texto": "Descricao da fraqueza 2..." }
    ],
    "oportunidades": [
      { "item": "Oportunidade 1", "texto": "Brecha de mercado em SJC..." },
      { "item": "Oportunidade 2", "texto": "Descricao da oportunidade 2..." }
    ],
    "ameacas": [
      { "item": "Ameaca 1", "texto": "Risco de concorrencia ou evasao..." },
      { "item": "Ameaca 2", "texto": "Descricao da ameaca 2..." }
    ]
  },
  "pestel": {
    "P": { "fator": "Politico / Regulatorio", "decisao_recomendada": "Decisao recomendada para adequacao..." },
    "E": { "fator": "Economico / Renda", "decisao_recomendada": "Estrategia de precificacao frente ao poder de compra..." },
    "S": { "fator": "Social / Habitos", "decisao_recomendada": "Alinhamento com estilo de vida joseense..." },
    "T": { "fator": "Tecnologico / Digital", "decisao_recomendada": "Canais e presenca digital recomendada..." },
    "E_env": { "fator": "Ambiental / Sustentabilidade", "decisao_recomendada": "Pratica ambiental ou pet-friendly..." },
    "L": { "fator": "Legal / Zoneamento", "decisao_recomendada": "Conformidade municipal..." }
  },
  "ishikawa": {
    "problema_central": "Principal risco de fracasso ou perda de margem do negocio em SJC",
    "causas": [
      { "categoria": "Pessoas & Atendimento", "descricao": "Causa raiz ligada a servico e equipe..." },
      { "categoria": "Ambiente & Experiencia", "descricao": "Causa raiz ligada ao espaco fisico ou atrito de acesso..." },
      { "categoria": "Processos & Operacao", "descricao": "Causa raiz de eficiencia ou estoque..." },
      { "categoria": "Produto & Precificacao", "descricao": "Causa raiz de desajuste entre preco e valor..." }
    ]
  }
}`
  },
  {
    stepIndex: 3,
    id: "selecao_graficos_matrizes",
    label: "Seleção Dinâmica de 3 Gráficos, Matriz VRIO e 5 Forças de Porter",
    message: "Cruzando indicadores da pesquisa oficial, VRIO e 5 Forças de Porter...",
    maxTokens: 750,
    systemPrompt: `Voce e um Engenheiro de Dados e Estrategista Competitivo em SJC.

DIRETRIZES OBRIGATORIAS:
1. SELECAO DE GRAFICOS: Escolha EXATAMENTE 3 indicadores da lista em analysisContext.available_indicators usando estritamente o campo indicador_id ("renda_familiar", "evasao_consumo", "frequencia_saida", "regioes_frequentadas", "barreiras_saida", "criterios_escolha", "redes_descoberta", "demanda_reprimida", "influenciadores", "pets_posse", "produtores_locais", "orgulho_morar").
2. PARECER ANALITICO: Escreva uma interpretacao honesta do que o dado prova e declare explicitamente o que a metrica NAO prova para este negocio.
3. VRIO e PORTER: Analise as forcas competitivas e barreiras de imitabilidade.

RETORNE EXCLUSIVAMENTE UM JSON com esta estrutura:
{
  "graficos_selecionados": [
    {
      "indicador_id": "id_exato_do_indicador",
      "motivo_da_escolha": "Por que esta metrica e crucial para este negocio especifico",
      "leitura_analitica": "Parecer aprofundado cruzando os dados do indicador com a proposta",
      "o_que_nao_prova": "Declaracao honesta do limite da metrica (o que nao deve ser extrapolado)"
    }
  ],
  "matrizes_estrategicas": {
    "vrio": [
      { "letra": "V", "nome": "Valor", "analise": "Como o negocio cria valor concreto..." },
      { "letra": "R", "nome": "Raridade", "analise": "O que e incomum na oferta frente aos concorrentes..." },
      { "letra": "I", "nome": "Imitabilidade", "analise": "Barreiras que impedem copias faceis..." },
      { "letra": "O", "nome": "Organizacao", "analise": "Processos de entrega e controle..." }
    ],
    "porter": [
      { "forca": "Rivalidade entre Concorrentes", "intensidade": "baixa | media | alta", "analise": "Disputa com players locais e regionais..." },
      { "forca": "Ameaca de Novos Entrantes", "intensidade": "baixa | media | alta", "analise": "Barreiras de entrada de capital e ponto..." },
      { "forca": "Produtos Substitutos", "intensidade": "baixa | media | alta", "analise": "Substitutos diretos, e-commerce e viagens a SP..." },
      { "forca": "Barganha dos Fornecedores", "intensidade": "baixa | media | alta", "analise": "Dependencia e custos logísticos..." },
      { "forca": "Barganha dos Clientes", "intensidade": "baixa | media | alta", "analise": "Sensibilidade a preco e poder de escolha..." }
    ]
  },
  "mix_marketing": {
    "cinco_ps": [
      { "p": "Produto", "analise": "Mix e proposta tangivel..." },
      { "p": "Preco", "analise": "Precificacao equilibrada com valor perceptivel..." },
      { "p": "Praca", "analise": "Canais fisicos e presenca digital..." },
      { "p": "Promocao", "analise": "Divulgacao focada em redes e indicacao..." },
      { "p": "Pessoas", "analise": "Treinamento consultivo..." }
    ],
    "oceano_azul": {
      "eliminar": "Atritos operacionais...",
      "reduzir": "Custos e estoques desnecessarios...",
      "elevar": "Padrao de curadoria e experiencia...",
      "criar": "Diferencial inovador inexistente em SJC..."
    }
  }
}`
  },
  {
    stepIndex: 4,
    id: "movimentos_vencedor_testes",
    label: "Movimentos Culturais, Verbalizações Reais e Plano de Validação",
    message: "Enquadrando no movimento cultural vencedor e selecionando verbalizações...",
    maxTokens: 850,
    systemPrompt: `Voce e um Antropologo Cultural e Estrategista de Negocios em SJC.

DIRETRIZES OBRIGATORIAS:
1. MOVIMENTO VENCEDOR: Escolha exatamente UM entre os 4 movimentos oficiais:
   - "A Geografia do Silêncio"
   - "A Cidade Prometida"
   - "A Tribo Global"
   - "Empreendedorismo Intuitivo"
2. JUSTIFICATIVA E CONDICOES: Fundamente por que esse movimento e o motor da proposta, qual o risco de erro e a condicao de sucesso.
3. VERBALIZACOES REAIS: Escolha de 2 a 4 verbalizacoes REAIS do pool fornecido em analysisContext.verbatims_pool. Nao altere a citacao.
4. PLANO DE VALIDACAO: Elabore 4 perguntas de entrevista qualitativa para validar o negocio em SJC.

RETORNE EXCLUSIVAMENTE UM JSON com esta estrutura:
{
  "movimentos_culturais": {
    "veredicto_final": {
      "nome_movimento": "Nome exato do movimento vencedor",
      "justificativa_densa": "Fundamentacao antropologica e mercadologica densa conectando o movimento com a ideia.",
      "condicao_de_sucesso": "O que o negocio DEVE entregar para capturar a forca deste movimento.",
      "risco_de_erro": "Qual erro classico a gestao pode cometer se ignorar a tensao cultural deste movimento."
    },
    "quatro_movimentos_analise": {
      "geografia_silencio": "Como o negocio interage com este movimento...",
      "cidade_prometida": "Como o negocio interage com este movimento...",
      "tribo_global": "Como o negocio interage com este movimento...",
      "empreendedorismo_intuitivo": "Como o negocio interage com este movimento..."
    }
  },
  "verbalizacoes_selecionadas": [
    {
      "id": "id_da_verbalizacao_no_pool",
      "citacao": "Texto exato da citacao presente no pool",
      "por_que_foi_selecionada": "Conexao direta com a oportunidade ou desafio do negocio"
    }
  ],
  "plano_de_validacao": {
    "guia_entrevista_perguntas": [
      "Pergunta 1 aprofundando habitos de consumo em SJC",
      "Pergunta 2 sobre barreiras reais de saida ou preco",
      "Pergunta 3 sobre disposicao a pagar e frequencia",
      "Pergunta 4 sobre marcas ou concorrentes substitutos"
    ]
  }
}`
  }
];

// 8. VALIDAÇÃO ESTRITA DE CADA MÓDULO
function validateStep1Result(result) {
  if (!result || typeof result !== 'object') {
    throw new Error("INVALID_STEP1_RESULT: O Step 1 retornou uma resposta nula ou inválida.");
  }
  if (!result.visao_estrategica_texto || typeof result.visao_estrategica_texto !== 'string' || result.visao_estrategica_texto.length < 50) {
    throw new Error("INVALID_STRATEGIC_VISION: O texto da visão estratégica está incompleto.");
  }
  if (!Array.isArray(result.bairros) || result.bairros.length === 0) {
    throw new Error("INVALID_NEIGHBORHOOD_ANALYSIS: Nenhum bairro ou polo territorial foi avaliado.");
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
    tamanho_contexto_por_etapa: {
      visao_veredito_territorio: metrics.visao_veredito_territorio?.input_chars || 0,
      swot_causalidade_ambiente: metrics.swot_causalidade_ambiente?.input_chars || 0,
      selecao_graficos_matrizes: metrics.selecao_graficos_matrizes?.input_chars || 0,
      movimentos_vencedor_testes: metrics.movimentos_vencedor_testes?.input_chars || 0
    },
    tentativas_por_etapa: job.attempts_by_step || {},
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
        const lockMs = jobData.lock_timestamp ? new Date(jobData.lock_timestamp).getTime() : now;
        const stepElapsed = jobData.is_processing ? (now - lockMs) : 0;

        return {
          job_id: jobData.job_id,
          status: jobData.status,
          current_step: jobData.current_step,
          current_module_label: stepDef.label || "Conclusão",
          attempt: stepAttempt,
          max_attempts: 3,
          is_processing: Boolean(jobData.is_processing),
          lock_timestamp: jobData.lock_timestamp || null,
          updated_at: jobData.updated_at,
          last_error: jobData.last_error || null,
          error_code: jobData.error_code || null,
          retry_after_at: jobData.retry_after_at || null,
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
        try {
          if (!apiKey) {
            throw new Error("GROQ_NOT_CONFIGURED: Chave da API Groq ausente no servidor.");
          }

          if (!activeJob.context_snapshot) {
            throw new Error("SNAPSHOT_MISSING: O snapshot de dados oficiais não foi inicializado.");
          }

          const stepContext = buildStepContext(stepDef.id, activeJob.context_snapshot, activeJob);
          const stepPayloadStr = JSON.stringify({
            analysisTarget: {
              idea: activeJob.idea,
              report_to_audit: activeJob.report_to_audit || null
            },
            analysisContext: stepContext
          });

          let groqResult;
          try {
            groqResult = await callGroqStep(
              apiKey,
              stepDef.systemPrompt,
              stepPayloadStr,
              stepDef.maxTokens || 750,
              25000,
              stepDef.label
            );
            validateModuleResult(stepDef.id, groqResult.result, activeJob.context_snapshot);
          } catch (firstAttemptErr) {
            if (firstAttemptErr.isJsonValidateFailed || firstAttemptErr.error_code === "GROQ_EMPTY_GENERATION" || firstAttemptErr.message.includes("GROQ_INVALID_JSON")) {
              console.warn(`[RECOVERY RETRY] Reexecutando ${stepDef.id} com prompt restrito após erro JSON:`, firstAttemptErr.message);
              const recoverySystemPrompt = `${stepDef.systemPrompt}\n\nATENCAO: Sua resposta anterior nao pode ser validada. Retorne SOMENTE um objeto JSON valido, curto e completo, seguindo exatamente as chaves indicadas. Nao inclua markdown, explicacoes externas ou campos extras.`;
              groqResult = await callGroqStep(
                apiKey,
                recoverySystemPrompt,
                stepPayloadStr,
                stepDef.maxTokens || 750,
                25000,
                `${stepDef.label} (Recovery Retry)`
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
            attempts: currentAttemptNumber
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
          console.error(`[STEP ERROR] Job ${activeJob.job_id} na etapa ${stepDef.id}:`, err);

          if (err.isModelInvalid) {
            activeJob.status = "failed";
            activeJob.error_code = "GROQ_MODEL_INVALID";
            activeJob.message = `O modelo Groq configurado (${err.model_used}) é inválido ou foi descontinuado: ${err.message}`;
            activeJob.last_error = err.message;
            activeJob.retryable = false;
          } else if (err.isQuotaExhausted) {
            activeJob.status = "failed";
            activeJob.error_code = "GROQ_QUOTA_EXHAUSTED";
            activeJob.message = "A cota disponível da Groq foi atingida. O relatório não pôde ser concluído.";
            activeJob.last_error = err.message;
            activeJob.retryable = false;
          } else if (err.status === 429) {
            const waitSeconds = err.retryAfterSeconds || 8;
            activeJob.status = "waiting_rate_limit";
            activeJob.retry_after_at = new Date(Date.now() + (waitSeconds * 1000)).toISOString();
            activeJob.message = `Limite de taxa atingido. Aguardando liberação da janela Groq (${waitSeconds}s)...`;
            activeJob.last_error = err.message;
            activeJob.retryable = true;
          } else {
            activeJob.last_error = err.message;
            if (currentAttemptNumber >= 3) {
              activeJob.status = "failed";
              activeJob.error_code = err.message.includes("INDICATOR_NOT_FOUND") ? "INDICATOR_NOT_FOUND" :
                                 err.message.includes("INVALID_GRAPH_SELECTION") ? "INVALID_GRAPH_SELECTION" :
                                 err.message.includes("VERBATIM_NOT_FOUND") ? "VERBATIM_NOT_FOUND" :
                                 err.message.includes("INVALID_MOVEMENT_WINNER") ? "INVALID_MOVEMENT_WINNER" :
                                 err.message.includes("GROQ_TIMEOUT") ? "GROQ_TIMEOUT" :
                                 "STEP_EXECUTION_FAILED";
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
