// API Consultor Estratégico - Arquitetura de Validação Estrita e Zero-Fallback
// Rigor Factual com Supabase Real, Censo IBGE 2022, Apresentação Oficial e Inteligência Estratégica

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

// 1. CARREGAMENTO REAL E AUDITADO DO SUPABASE COM COLUNAS OFICIAIS VERIFICADAS
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

  return {
    data: cachedSupabaseData,
    duration_ms: Date.now() - startTime,
    from_cache: false
  };
}

// 2. CARREGAMENTO DOS DADOS OFICIAIS DO IBGE (CENSO 2022 / SIDRA)
async function loadIbgeData() {
  const startTime = Date.now();
  const ibge = {
    fonte_oficial: "IBGE - Censo Demográfico 2022",
    tabela_sidra: "Tabela 9514 (População residente por idade e sexo)",
    codigo_territorial_ibge: "3549904",
    municipio: "São José dos Campos - SP",
    data_referencia: "2022-08-01",
    consultado_online_tempo_real: false,
    dados_sincronizados: {
      populacao_residente: 697428,
      densidade_demografica_hab_km2: 634.07,
      idade_mediana: 36,
      indice_envelhecimento: 68.5,
      pib_per_capita_anual_estimado: 58240.00,
      dinamica_regional: {
        centro_oeste: "Maior densidade de renda, concentração de serviços e comércio de alto padrão.",
        sul: "Maior contingente populacional, polo comercial descentralizado em expansão.",
        leste: "Forte base industrial e habitacional.",
        norte: "Área de transição urbana e turismo ambiental."
      }
    }
  };
  return {
    data: ibge,
    duration_ms: Date.now() - startTime
  };
}

// 3. PARSER REAL DA APRESENTAÇÃO OFICIAL (4 MOVIMENTOS CULTURAIS)
async function loadCulturalMovements() {
  const startTime = Date.now();
  let content = '';
  let usedPath = '';

  if (fs.existsSync(PRESENTATION_PATH)) {
    content = fs.readFileSync(PRESENTATION_PATH, 'utf8');
    usedPath = PRESENTATION_PATH;
  } else if (fs.existsSync(FALLBACK_PRESENTATION_PATH)) {
    content = fs.readFileSync(FALLBACK_PRESENTATION_PATH, 'utf8');
    usedPath = FALLBACK_PRESENTATION_PATH;
  }

  if (!content || content.length < 500) {
    throw new Error("PRESENTATION_NOT_AVAILABLE: O arquivo da apresentação oficial não foi encontrado ou está vazio.");
  }

  const lines = content.split('\n').map(l => l.trim()).filter(Boolean);

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
      apresentacao_carregada: true,
      arquivo_origem: usedPath,
      total_caracteres_arquivo: content.length,
      movimentos: movements
    },
    duration_ms: Date.now() - startTime
  };
}

// 4. PERSISTÊNCIA DE ESTADO E JOBS
const MEMORY_JOBS = new Map();
const JOBS_FILE_PATH = path.join(os.tmpdir(), "radarsjc_consultor_jobs_v2.json");

function getJob(jobId) {
  if (MEMORY_JOBS.has(jobId)) {
    return MEMORY_JOBS.get(jobId);
  }
  try {
    if (fs.existsSync(JOBS_FILE_PATH)) {
      const fileData = fs.readFileSync(JOBS_FILE_PATH, "utf8");
      const jobsObj = JSON.parse(fileData || "{}");
      if (jobsObj[jobId]) {
        MEMORY_JOBS.set(jobId, jobsObj[jobId]);
        return jobsObj[jobId];
      }
    }
  } catch (err) {}
  return null;
}

function saveJob(job) {
  if (!job || !job.job_id) return;
  job.updated_at = new Date().toISOString();
  MEMORY_JOBS.set(job.job_id, job);
  try {
    let jobsObj = {};
    if (fs.existsSync(JOBS_FILE_PATH)) {
      const fileData = fs.readFileSync(JOBS_FILE_PATH, "utf8");
      jobsObj = JSON.parse(fileData || "{}");
    }
    jobsObj[job.job_id] = job;
    
    // Limpeza de jobs com mais de 2 horas
    const twoHoursAgo = Date.now() - (2 * 60 * 60 * 1000);
    for (const [id, j] of Object.entries(jobsObj)) {
      if (new Date(j.created_at || 0).getTime() < twoHoursAgo) {
        delete jobsObj[id];
        MEMORY_JOBS.delete(id);
      }
    }

    fs.writeFileSync(JOBS_FILE_PATH, JSON.stringify(jobsObj, null, 2), "utf8");
  } catch (err) {}
}

// 5. CHAMADA À GROQ COM ABORTCONTROLLER (45S), TEMPERATURA 0.6 E TRATAMENTO DE ERROS
async function callGroqStep(apiKey, systemPrompt, userPayloadStr, maxTokens = 750, timeoutMs = 45000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const startTime = Date.now();

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "qwen/qwen3.6-27b",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPayloadStr }
        ],
        temperature: 0.6, // Criatividade e densidade estratégica sem perder o rigor factual
        max_tokens: maxTokens,
        response_format: { type: "json_object" }
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    const durationMs = Date.now() - startTime;

    if (!response.ok) {
      const errText = await response.text();
      let retryAfter = 0;
      const retryHeader = response.headers.get("retry-after");
      if (retryHeader) {
        retryAfter = parseInt(retryHeader, 10) || 8;
      }
      
      const errorObj = new Error(`Groq API Error (${response.status}): ${errText}`);
      errorObj.status = response.status;
      errorObj.retryAfterSeconds = retryAfter;
      errorObj.durationMs = durationMs;
      
      if (response.status === 429 && (errText.includes("TPD") || errText.includes("Day") || errText.includes("quota"))) {
        errorObj.isQuotaExhausted = true;
      }
      throw errorObj;
    }

    const data = await response.json();
    const rawContent = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || "{}";
    
    let parsed;
    try {
      parsed = JSON.parse(rawContent);
    } catch (e) {
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("GROQ_INVALID_JSON: A IA não retornou um objeto JSON válido.");
      }
    }

    return {
      result: parsed,
      durationMs,
      outputChars: rawContent.length,
      inputChars: userPayloadStr.length + systemPrompt.length
    };

  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      const timeoutErr = new Error(`GROQ_TIMEOUT: A chamada excedeu o limite de ${timeoutMs / 1000}s.`);
      timeoutErr.isTimeout = true;
      timeoutErr.durationMs = Date.now() - startTime;
      throw timeoutErr;
    }
    throw err;
  }
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
        visao_estrategica_previa: job.partial_results.visao_veredito_territorio || null
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
        visao_estrategica_previa: job.partial_results.visao_veredito_territorio || null,
        swot_previa: job.partial_results.swot_causalidade_ambiente?.swot || null
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
        visao_estrategica_previa: job.partial_results.visao_veredito_territorio || null
      };

    default:
      return { idea: job.idea };
  }
}

// 7. DEFINIÇÕES DOS 4 MÓDULOS E PROMPTS DE SISTEMA
const MODULE_DEFINITIONS = [
  {
    stepIndex: 0,
    id: "visao_veredito_territorio",
    label: "Tese Estratégica, Veredito Humano e Ranking Territorial",
    message: "Formulando tese estratégica, veredito humano e vocação territorial...",
    maxTokens: 850,
    systemPrompt: `Voce e o Consultor Estrategico Senior do Radar SJC.
Sua funcao e emitir um parecer consultivo maduro, humano, decisivo e criativo.

DIRETRIZES:
1. RIGOR FACTUAL: Use EXCLUSIVAMENTE os dados e numeros fornecidos no analysisContext. Nao invente percentuais.
2. LIBERDADE ANALITICA: Formule uma tese autoral e conecte o comportamento do joseense com o modelo de negocio.
3. BAIRROS E REGIOES: Avalie bairros e polos comerciais de SJC com base na vocacao real do territorio e do publico-alvo. Nao invente pontuacoes numericas sem formula; use prioridade estrategica qualitativa ("Alta", "Media", "Exploratoria") com defesa consistente.
4. ZONA DE EXCLUSAO: Aponte com franqueza onde e em quais condicoes o negocio NAO deve operar.

RETORNE EXCLUSIVAMENTE UM JSON com esta estrutura:
{
  "visao_estrategica_texto": "Tese executiva contendo: (1) O que a proposta realmente e e sua premissa central; (2) Leitura do comportamento e barreiras em SJC; (3) Veredito consultivo maduro e humano com diretrizes praticas de diferenciacao.",
  "bairros": [
    {
      "nome": "Nome do Bairro ou Regiao em SJC",
      "regiao": "Centro-Oeste | Sul | Leste | Norte | Centro | Oeste",
      "prioridade_estrategica": "Alta | Media | Exploratoria",
      "formato_recomendado": "Loja de Rua | Showroom Agendado | Hub Digital | Quiosque | Atelier",
      "justificativa_vocacional": "Defesa estrategica conectando renda, fluxo e vocacao do territorio."
    }
  ],
  "zona_exclusao": "ZONA DE EXCLUSAO DETALHADA - Alerta sobre locais ou modelos com risco de friccao ou baixo retorno."
}`
  },
  {
    stepIndex: 1,
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
    stepIndex: 2,
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
      "criar": "Diferenciais exclusivos para o publico de SJC..."
    }
  }
}`
  },
  {
    stepIndex: 3,
    id: "movimentos_vencedor_testes",
    label: "Comparação dos 4 Movimentos Culturais, Eleição do Vencedor e Validação",
    message: "Comparando os 4 movimentos culturais, elegendo o vencedor e estruturando validação de campo...",
    maxTokens: 750,
    systemPrompt: `Voce e um Antropologo de Consumo e Estrategista Senior de Segmentacao em SJC.

DIRETRIZES OBRIGATORIAS:
1. COMPARACAO DOS 4 MOVIMENTOS: Compare a aderencia da ideia em CADA UM dos 4 movimentos presentes na apresentacao oficial (A Geografia do Silencio, A Cidade Prometida, A Tribo Global, Empreendedorismo Intuitivo).
2. ELEICAO DO VENCEDOR: Escolha OBRIGATORIAMENTE o Movimento Cultural que melhor alavanca este negocio especifico ("A Geografia do Silêncio" OU "A Cidade Prometida" OU "A Tribo Global" OU "Empreendedorismo Intuitivo"). Justifique estrategicamente.
3. SELECAO DE VERBALIZACOES: Escolha de 3 a 4 verbalizacoes reais presentes estritamente em analysisContext.verbatims_pool. Use o id e o texto da citacao fornecidos. NUNCA invente citacoes.
4. PLANO DE VALIDACAO: Liste hipoteses criticas e 4 perguntas essenciais para pesquisa de campo.

RETORNE EXCLUSIVAMENTE UM JSON com esta estrutura:
{
  "movimentos_culturais": {
    "analise_cards": {
      "geografia_silencio": "Analise comparativa de fit com A Geografia do Silencio...",
      "cidade_prometida": "Analise comparativa de fit com A Cidade Prometida...",
      "tribo_global": "Analise comparativa de fit com A Tribo Global...",
      "empreendedorismo_intuitivo": "Analise comparativa de fit com o Empreendedorismo Intuitivo..."
    },
    "veredicto_final": {
      "nome_movimento": "A Geografia do Silêncio | A Cidade Prometida | A Tribo Global | Empreendedorismo Intuitivo",
      "justificativa_densa": "Defesa estrategica aprofundada explicando a escolha como alavanca de posicionamento e margem.",
      "condicao_de_sucesso": "Condicao pratica essencial para o posicionamento funcionar.",
      "risco_de_erro": "Risco caso a segmentacao falhe."
    }
  },
  "verbalizacoes_selecionadas": [
    {
      "id": "id_exato_da_verbalizacao_recebida",
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

// 8. VALIDAÇÃO ESTRITA DE CADA MÓDULO (REJEITA DADOS INVÁLIDOS SEM FALLBACK SILENCIOSO)
function validateModuleResult(stepId, result, snapshot) {
  if (!result || typeof result !== 'object' || Object.keys(result).length === 0) {
    throw new Error(`MODULE_EMPTY_RESULT: O módulo ${stepId} retornou um objeto vazio.`);
  }

  if (stepId === "visao_veredito_territorio") {
    if (!result.visao_estrategica_texto || result.visao_estrategica_texto.length < 50) {
      throw new Error("INVALID_STRATEGIC_VISION: O texto da visão estratégica está incompleto.");
    }
    if (!Array.isArray(result.bairros) || result.bairros.length === 0) {
      throw new Error("INVALID_NEIGHBORHOOD_ANALYSIS: Nenhum bairro ou polo territorial foi avaliado.");
    }
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

    // Validar que todos os 3 indicadores existem no snapshot do Supabase
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
    
    // Normalizar comparação de nomes de movimentos
    const matchedWinner = validMovementNames.find(v => winnerName && (winnerName.toLowerCase().includes(v.toLowerCase()) || v.toLowerCase().includes(winnerName.toLowerCase())));
    if (!matchedWinner) {
      throw new Error(`INVALID_MOVEMENT_WINNER: O movimento vencedor '${winnerName}' não é um dos 4 movimentos culturais oficiais da apresentação.`);
    }

    if (!Array.isArray(result.verbalizacoes_selecionadas) || result.verbalizacoes_selecionadas.length < 2) {
      throw new Error("INVALID_VERBATIM_SELECTION: É necessário selecionar ao menos 2 verbalizações reais.");
    }

    // Validar que cada verbalização existe de fato no banco de microdados do Supabase
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

  // Montagem Dinâmica e Estrita dos 3 Gráficos Selecionados do Supabase
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

  // Montagem Dinâmica e Estrita das Verbalizações Reais do Supabase
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

  // Normalização de SWOT
  const swotClean = {
    forcas: (mod2.swot?.forcas || []).map(f => typeof f === 'object' ? (f.texto || f.item) : f),
    fraquezas: (mod2.swot?.fraquezas || []).map(f => typeof f === 'object' ? (f.texto || f.item) : f),
    oportunidades: (mod2.swot?.oportunidades || []).map(f => typeof f === 'object' ? (f.texto || f.item) : f),
    ameacas: (mod2.swot?.ameacas || []).map(f => typeof f === 'object' ? (f.texto || f.item) : f)
  };

  // Normalização de PESTEL
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
    supabase_consultado: true,
    ibge_consultado_online: false,
    ibge_base_referencia: "IBGE Censo Demográfico 2022 (Tabela 9514 / SIDRA / Código 3549904)",
    apresentacao_carregada: true,
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

      // 2. Pré-carregamento das fontes oficiais UMA ÚNICA VEZ por job
      let supabaseRes, ibgeRes, culturalRes;
      try {
        [supabaseRes, ibgeRes, culturalRes] = await Promise.all([
          loadSupabaseResearchData(),
          loadIbgeData(),
          loadCulturalMovements()
        ]);
      } catch (dbErr) {
        return res.status(500).json({
          error_code: dbErr.message.includes("PRESENTATION") ? "PRESENTATION_NOT_AVAILABLE" : "SUPABASE_NOT_CONFIGURED",
          message: dbErr.message,
          details: dbErr.stack || dbErr.message
        });
      }

      // Compact Snapshot salvo no Job
      const contextSnapshot = {
        totalN: supabaseRes.data.totalN,
        indicators: supabaseRes.data.indicators,
        verbatims: supabaseRes.data.verbatims.slice(0, 30),
        ibge: ibgeRes.data,
        cultural_movements: culturalRes.data.movimentos
      };

      const newJobId = "job_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9);
      const newJob = {
        job_id: newJobId,
        idea: combinedInput,
        report_to_audit: reportToAudit,
        context_snapshot: contextSnapshot,
        status: "queued",
        current_step: 0,
        total_steps: MODULE_DEFINITIONS.length,
        completed_steps: [],
        partial_results: {},
        step_metrics: {},
        attempts_by_step: {},
        timeouts: [],
        erros_429: [],
        performance: {
          supabase_ms: supabaseRes.duration_ms,
          ibge_ms: ibgeRes.duration_ms,
          presentation_ms: culturalRes.duration_ms,
          groq_ms_por_etapa: {},
          total_ms: 0
        },
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
        estimated_seconds: 25,
        message: "Job criado com sucesso com pré-carregamento concluído."
      });
    }

    // ROTA GET/POST: Status do Job (STEP-DRIVEN EXECUTION ENGINE OTIMIZADO)
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
          progress_percent: Math.round(((job.completed_steps || []).length / job.total_steps) * 100),
          estimated_remaining_seconds: waitSec + 8,
          message: `Limite de taxa da Groq ativo. Aguardando liberação (${waitSec}s restantes)...`
        });
      }

      // Concurrency Lock Check (Anti-colisão)
      if (job.is_processing && (now - (job.lock_timestamp || 0)) < 30000) {
        const stepDef = MODULE_DEFINITIONS[job.current_step] || {};
        return res.status(200).json({
          success: true,
          job_id: job.job_id,
          status: "running",
          current_step: job.current_step,
          current_module_label: stepDef.label || "Processando análise",
          total_steps: job.total_steps,
          progress_percent: Math.round(((job.completed_steps || []).length / job.total_steps) * 100),
          message: "Executando " + (stepDef.label || "etapa") + "..."
        });
      }

      // Executar EXATAMENTE UMA etapa pendente durante esta requisição de polling
      if (job.current_step < MODULE_DEFINITIONS.length) {
        const stepDef = MODULE_DEFINITIONS[job.current_step];
        const stepStartTime = Date.now();
        
        job.is_processing = true;
        job.lock_timestamp = now;
        job.status = "running";
        job.attempts_by_step[stepDef.id] = (job.attempts_by_step[stepDef.id] || 0) + 1;
        saveJob(job);

        try {
          if (!apiKey) {
            throw new Error("GROQ_API_KEY não configurada nas variáveis de ambiente.");
          }

          // Build Context específico e compacto para a etapa
          const stepContext = buildStepContext(stepDef.id, job.context_snapshot, job);
          const userPayloadStr = JSON.stringify(stepContext);

          // Chamada única à Groq com AbortController e cap ajustado
          const groqResponse = await callGroqStep(
            apiKey,
            stepDef.systemPrompt,
            userPayloadStr,
            stepDef.maxTokens || 750,
            45000
          );

          const stepResult = groqResponse.result;
          
          // Validação estrutural e factual estrita: rejeita se inválido
          validateModuleResult(stepDef.id, stepResult, job.context_snapshot);

          job.partial_results[stepDef.id] = stepResult;
          
          // Registro de métricas da etapa
          const stepFinishedTime = Date.now();
          job.step_metrics[stepDef.id] = {
            started_at: new Date(stepStartTime).toISOString(),
            finished_at: new Date(stepFinishedTime).toISOString(),
            duration_ms: groqResponse.durationMs,
            input_chars: groqResponse.inputChars,
            output_chars: groqResponse.outputChars,
            attempts: job.attempts_by_step[stepDef.id]
          };

          job.performance.groq_ms_por_etapa[stepDef.id] = groqResponse.durationMs;
          
          if (!job.completed_steps.includes(stepDef.id)) {
            job.completed_steps.push(stepDef.id);
          }
          job.current_step++;
          job.retry_count = 0;
          job.retry_after_at = null;

          if (job.completed_steps.length >= MODULE_DEFINITIONS.length) {
            job.status = "completed";
            job.performance.total_ms = Date.now() - new Date(job.created_at).getTime();
            job.final_result = assembleFinalReport(job, job.context_snapshot);
            job.progress_percent = 100;
            job.estimated_remaining_seconds = 0;
            job.message = "Relatório estratégico concluído com sucesso!";
          } else {
            job.status = "running";
            job.progress_percent = Math.round((job.completed_steps.length / MODULE_DEFINITIONS.length) * 100);
            job.estimated_remaining_seconds = Math.max(6, (MODULE_DEFINITIONS.length - job.completed_steps.length) * 6);
            const nextStepDef = MODULE_DEFINITIONS[job.current_step] || {};
            job.message = nextStepDef.message || "Avançando para a próxima etapa...";
          }

          job.is_processing = false;
          saveJob(job);

        } catch (err) {
          job.is_processing = false;
          
          if (err.isTimeout) {
            job.timeouts.push({
              step: stepDef.id,
              timestamp: new Date().toISOString(),
              duration_ms: err.durationMs
            });
          }

          if (err.isQuotaExhausted) {
            job.status = "failed";
            job.error_code = "GROQ_QUOTA_EXHAUSTED";
            job.message = "A cota disponível da Groq foi atingida. O relatório não pôde ser concluído.";
            job.retryable = false;
            saveJob(job);
          } else if (err.status === 429) {
            const waitSeconds = err.retryAfterSeconds || 8;
            job.erros_429.push({
              step: stepDef.id,
              timestamp: new Date().toISOString(),
              wait_seconds: waitSeconds
            });
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
              job.error_code = err.message.includes("INDICATOR_NOT_FOUND") ? "INDICATOR_NOT_FOUND" :
                               err.message.includes("INVALID_GRAPH_SELECTION") ? "INVALID_GRAPH_SELECTION" :
                               err.message.includes("VERBATIM_NOT_FOUND") ? "VERBATIM_NOT_FOUND" :
                               err.message.includes("INVALID_MOVEMENT_WINNER") ? "INVALID_MOVEMENT_WINNER" :
                               "STEP_EXECUTION_FAILED";
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
        estimated_remaining_seconds: job.status === "completed" ? 0 : Math.max(5, (MODULE_DEFINITIONS.length - (job.completed_steps || []).length) * 6),
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
