// API Consultor Estratégico - Arquitetura Step-Driven Execution (State Machine Serverless)
// Base Oficial de Microdados: Radar São José dos Campos (N=477, IC=95%, Erro ±4.49%)

const fs = require('fs');
const path = require('path');
const os = require('os');

// 1. DATASET SNAPSHOT OFICIAL E DEFINIÇÕES QUANTITATIVAS AUDITADAS (N=477)
const DATASET_SNAPSHOT = {
  n: 477,
  metrics: {
    renda_familiar: {
      pergunta: "Qual a renda total da sua casa por mês?",
      denominador: 477,
      categorias: [
        { nome: "Até R$ 2.800", n: 73, percentual: 15.3, formula: "73 / 477 * 100" },
        { nome: "R$ 2.801 a R$ 5.600", n: 161, percentual: 33.8, formula: "161 / 477 * 100" },
        { nome: "R$ 5.601 a R$ 12.000", n: 155, percentual: 32.5, formula: "155 / 477 * 100" },
        { nome: "R$ 12.001 a R$ 26.000", n: 67, percentual: 14.0, formula: "67 / 477 * 100" },
        { nome: "Acima de R$ 26.000", n: 21, percentual: 4.4, formula: "21 / 477 * 100" }
      ],
      alta_renda_acima_12k: { n: 88, percentual: 18.4, formula: "88 / 477 * 100" }
    },
    evasao_consumo: {
      pergunta: "Você costuma ir para outras cidades para passear ou comer fora?",
      denominador: 477,
      categorias: [
        { nome: "Às vezes", n: 238, percentual: 49.9, formula: "238 / 477 * 100" },
        { nome: "Quase nunca", n: 129, percentual: 27.0, formula: "129 / 477 * 100" },
        { nome: "Sim, sempre", n: 78, percentual: 16.4, formula: "78 / 477 * 100" },
        { nome: "Nunca", n: 32, percentual: 6.7, formula: "32 / 477 * 100" }
      ],
      total_evadem: { nome: "Sempre ou às vezes", n: 316, percentual: 66.2, formula: "(238 + 78) / 477 * 100" }
    },
    frequencia_saida: {
      pergunta: "Com que frequência você costuma sair para comer fora ou lazer?",
      denominador: 477,
      categorias: [
        { nome: "2 ou 3 vezes por mês", n: 184, percentual: 38.6, formula: "184 / 477 * 100" },
        { nome: "1 vez ao mês", n: 115, percentual: 24.1, formula: "115 / 477 * 100" },
        { nome: "Toda semana", n: 105, percentual: 22.0, formula: "105 / 477 * 100" },
        { nome: "Quase nunca", n: 68, percentual: 14.3, formula: "68 / 477 * 100" },
        { nome: "Nunca", n: 5, percentual: 1.0, formula: "5 / 477 * 100" }
      ],
      saida_regular: {
        nome: "Toda semana ou 2 a 3 vezes por mês",
        n: 289,
        percentual: 60.6,
        detalhe: "22.0% toda semana (105/477) + 38.6% 2-3 vezes por mês (184/477)",
        formula: "(105 + 184) / 477 * 100"
      }
    },
    demanda_reprimida: {
      pergunta: "Você gastaria mais dinheiro se a cidade tivesse melhores opções?",
      denominador: 477,
      categorias: [
        { nome: "Sim", n: 332, percentual: 69.6, formula: "332 / 477 * 100" },
        { nome: "Não", n: 145, percentual: 30.4, formula: "145 / 477 * 100" }
      ]
    },
    regiao_frequentada: {
      pergunta: "Qual região da cidade você mais frequenta quando sai de casa?",
      denominador: 477,
      categorias: [
        { nome: "Centro / Oeste", n: 199, percentual: 41.7, formula: "199 / 477 * 100" },
        { nome: "Zona Sul", n: 135, percentual: 28.3, formula: "135 / 477 * 100" },
        { nome: "Todas as regiões", n: 57, percentual: 11.9, formula: "57 / 477 * 100" },
        { nome: "Zona Leste", n: 55, percentual: 11.5, formula: "55 / 477 * 100" },
        { nome: "Zona Norte", n: 31, percentual: 6.5, formula: "31 / 477 * 100" }
      ]
    },
    barreiras_noite: {
      pergunta: "Qual a sua maior dificuldade quando decide sair à noite em SJC?",
      denominador: 477,
      categorias: [
        { nome: "É tudo muito caro", n: 158, percentual: 33.1, formula: "158 / 477 * 100" },
        { nome: "Não tem lugar legal para ir", n: 112, percentual: 23.5, formula: "112 / 477 * 100" },
        { nome: "Falta de segurança", n: 98, percentual: 20.5, formula: "98 / 477 * 100" },
        { nome: "Não vejo dificuldade", n: 65, percentual: 13.6, formula: "65 / 477 * 100" },
        { nome: "Ônibus ou transporte", n: 34, percentual: 7.1, formula: "34 / 477 * 100" },
        { nome: "Trânsito", n: 10, percentual: 2.1, formula: "10 / 477 * 100" }
      ]
    },
    criterios_escolha: {
      pergunta: "O que você mais leva em conta para escolher um restaurante ou bar?",
      denominador: 477,
      categorias: [
        { nome: "O preço", n: 133, percentual: 27.9, formula: "133 / 477 * 100" },
        { nome: "Lugar bonito e agradável", n: 131, percentual: 27.5, formula: "131 / 477 * 100" },
        { nome: "Indicação de amigos/família", n: 98, percentual: 20.5, formula: "98 / 477 * 100" },
        { nome: "Notas no Google", n: 45, percentual: 9.4, formula: "45 / 477 * 100" },
        { nome: "Instagram ou TikTok", n: 42, percentual: 8.8, formula: "42 / 477 * 100" },
        { nome: "Perto de casa", n: 28, percentual: 5.9, formula: "28 / 477 * 100" }
      ]
    },
    estetica_instagramavel: {
      pergunta: "Você já escolheu um lugar só porque ele é bonito para fotos e postar?",
      denominador: 477,
      categorias: [
        { nome: "Não, não ligo para isso", n: 308, percentual: 64.6, formula: "308 / 477 * 100" },
        { nome: "Um pouco", n: 131, percentual: 27.5, formula: "131 / 477 * 100" },
        { nome: "Sim, muito", n: 38, percentual: 8.0, formula: "38 / 477 * 100" }
      ]
    },
    // DISTRIBUIÇÃO COMPLETA EXTRAÍDA DIRETAMENTE DO SUPABASE (SOMA = 477)
    redes_busca: {
      pergunta: "Qual rede social você mais usa pra encontrar lugares e referências na cidade",
      denominador: 477,
      categorias: [
        { nome: "Instagram", n: 295, percentual: 61.8, formula: "295 / 477 * 100" },
        { nome: "TikTok", n: 78, percentual: 16.4, formula: "78 / 477 * 100" },
        { nome: "YouTube", n: 66, percentual: 13.8, formula: "66 / 477 * 100" },
        { nome: "Google", n: 10, percentual: 2.1, formula: "10 / 477 * 100" },
        { nome: "Facebook", n: 10, percentual: 2.1, formula: "10 / 477 * 100" },
        { nome: "Não uso", n: 3, percentual: 0.6, formula: "3 / 477 * 100" },
        { nome: "Nenhuma", n: 2, percentual: 0.4, formula: "2 / 477 * 100" },
        { nome: "Não usa", n: 1, percentual: 0.2, formula: "1 / 477 * 100" },
        { nome: "Nenhum, eu vou nos que eu conheço", n: 1, percentual: 0.2, formula: "1 / 477 * 100" },
        { nome: "Não utilizo", n: 1, percentual: 0.2, formula: "1 / 477 * 100" },
        { nome: "Não usa muito", n: 1, percentual: 0.2, formula: "1 / 477 * 100" },
        { nome: "Facebook  e gloogle", n: 1, percentual: 0.2, formula: "1 / 477 * 100" },
        { nome: "Internet em geral / buscadores", n: 1, percentual: 0.2, formula: "1 / 477 * 100" },
        { nome: "Nenhuma - consulto amigos", n: 1, percentual: 0.2, formula: "1 / 477 * 100" },
        { nome: "Boca a noca", n: 1, percentual: 0.2, formula: "1 / 477 * 100" },
        { nome: "Um pouco de cada e passando nos lugares", n: 1, percentual: 0.2, formula: "1 / 477 * 100" },
        { nome: "ChatGPT para pedir referências", n: 1, percentual: 0.2, formula: "1 / 477 * 100" },
        { nome: "google maps", n: 1, percentual: 0.2, formula: "1 / 477 * 100" },
        { nome: "Não tenho rede social", n: 1, percentual: 0.2, formula: "1 / 477 * 100" },
        { nome: "Google Maps", n: 1, percentual: 0.2, formula: "1 / 477 * 100" }
      ],
      soma_n: 477,
      fonte: "Supabase"
    },
    influenciadores: {
      pergunta: "Já foi a algum lugar por recomendação de influenciador?",
      denominador: 477,
      categorias: [
        { nome: "Não", n: 332, percentual: 69.6, formula: "332 / 477 * 100" },
        { nome: "Sim", n: 145, percentual: 30.4, formula: "145 / 477 * 100" }
      ]
    },
    pets: {
      pergunta: "Você tem animais de estimação em casa? (N=475 válidos)",
      denominador: 475,
      categorias: [
        { nome: "Sim", n: 251, percentual: 52.8, formula: "251 / 475 * 100" },
        { nome: "Não", n: 224, percentual: 47.2, formula: "224 / 475 * 100" }
      ]
    },
    orgulho_morar: {
      pergunta: "Sente orgulho de morar em SJC?",
      denominador: 477,
      categorias: [
        { nome: "Sim", n: 354, percentual: 74.2, formula: "354 / 477 * 100" },
        { nome: "Não", n: 123, percentual: 25.8, formula: "123 / 477 * 100" }
      ]
    }
  }
};

const OFFICIAL_VERBATIMS = [
  { citacao: "Custo de vida de capital com opções de interior... Coisas caras e sem qualidade.", genero: "Mulher", idade: "25-34 anos", regiao: "Zona Sul", renda: "R$ 5.6k - 12k" },
  { citacao: "Falta aconchego humano e vida nas ruas fora dos shoppings e corredores.", genero: "Mulher", idade: "65+ anos", regiao: "Centro-Oeste", renda: "R$ 5.6k - 12k" },
  { citacao: "Para lazer e cultura prefiro ir a São Paulo pois as opções aqui são limitadas.", genero: "Mulher", idade: "35-44 anos", regiao: "Centro-Oeste", renda: "R$ 12k - 26k" }
];

// 2. SISTEMA DE PERSISTÊNCIA DE ESTADOS DO JOB (MEMÓRIA + /tmp)
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

// Helper para chamada individual à Groq
async function callGroqStep(apiKey, systemPrompt, userContent, maxTokens = 650) {
  const model = "qwen/qwen3.6-27b";
  const payload = {
    model: model,
    max_tokens: maxTokens,
    temperature: 0.2,
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
    const errorObj = new Error("Groq Status " + response.status + ": " + errText);
    errorObj.status = response.status;
    errorObj.retryAfter = response.headers.get("retry-after");

    if (errText.includes("quota") || errText.includes("credit") || errText.includes("insufficient_quota")) {
      errorObj.isQuotaExhausted = true;
    }
    throw errorObj;
  }

  const data = await response.json();
  const rawContent = data.choices && data.choices[0] && data.choices[0].message ? data.choices[0].message.content : "";
  
  let cleanContent = String(rawContent || "").trim()
    .replace(/^\`\`\`(?:json)?\s*/i, "")
    .replace(/\s*\`\`\`$/i, "")
    .trim();

  const firstBrace = cleanContent.indexOf("{");
  const lastBrace = cleanContent.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleanContent = cleanContent.substring(firstBrace, lastBrace + 1).trim();
  }

  return JSON.parse(cleanContent);
}

// 3. MÁQUINA DE ESTADOS MODULAR (EXECUTA EXATAMENTE 1 ETAPA POR POLLING)
const MODULE_DEFINITIONS = [
  {
    stepIndex: 0,
    id: "visao_bairros",
    label: "Visão Estratégica e Território",
    message: "Analisando tese de mercado e polos Centro-Oeste / Zona Sul...",
    systemPrompt: "Voce e um consultor senior de negocios em SJC.\nContexto: N=477, Evasao 66.2% (316/477), Demanda reprimida 69.6% (332/477), Frequencia regular 60.6%, Centro-Oeste 41.7%, Zona Sul 28.3%, Alta renda 18.4%, Barreira preco 33.1%, Instagram 61.8%, Pet 52.8%.\nRetorne EXCLUSIVAMENTE um JSON com esta estrutura:\n{\n  \"visao_estrategica_texto\": \"Texto aprofundado com a tese central em **negrito**, analisando comportamento e dor de consumo em SJC.\",\n  \"bairros\": [\n    { \"nome\": \"Jardim Aquarius\", \"regiao\": \"Centro-Oeste\", \"justificativa\": \"Fit e validacao necessaria.\" },\n    { \"nome\": \"Vila Ema\", \"regiao\": \"Centro-Oeste\", \"justificativa\": \"Polo de consumo.\" },\n    { \"nome\": \"Jardim Satelite\", \"regiao\": \"Zona Sul\", \"justificativa\": \"Densidade e ticket.\" },\n    { \"nome\": \"Vila Adyana\", \"regiao\": \"Centro-Oeste\", \"justificativa\": \"Conveniencia e servicos.\" },\n    { \"nome\": \"Urbanova\", \"regiao\": \"Centro-Oeste\", \"justificativa\": \"Publico de alta renda.\" }\n  ],\n  \"zona_exclusao\": \"REGIAO - Justificativa analitica dos riscos de formato ou ticket.\"\n}"
  },
  {
    stepIndex: 1,
    id: "swot_ambiente",
    label: "Matriz SWOT e Auditoria de Ambiente",
    message: "Processando Matriz SWOT, PESTEL e Diagrama de Ishikawa...",
    systemPrompt: "Voce e um estrategista de negocios em SJC.\nContexto: N=477, Evasao 66.2%, Demanda 69.6%, Preco 33.1%, Instagram 61.8%, Pet 52.8%.\nRetorne EXCLUSIVAMENTE um JSON com esta estrutura:\n{\n  \"swot\": {\n    \"forcas\": [\"Forca 1\", \"Forca 2\", \"Forca 3\"],\n    \"fraquezas\": [\"Gargalo 1\", \"Gargalo 2\", \"Gargalo 3\"],\n    \"oportunidades\": [\"Demanda reprimida (69.6%)\", \"Oportunidade 2\", \"Oportunidade 3\"],\n    \"ameacas\": [\"Evasao (66.2%)\", \"Sensibilidade a preco (33.1%)\", \"Ameaca 3\"]\n  },\n  \"pestel\": {\n    \"P\": \"Politico...\", \"E\": \"Economico...\", \"S\": \"Social...\", \"T\": \"Tecnologico...\", \"E_env\": \"Ambiental...\", \"L\": \"Legal...\"\n  },\n  \"ishikawa\": {\n    \"problema_central\": \"Risco de Baixa Retencao do Consumidor Local em SJC\",\n    \"causas\": [\n      { \"categoria\": \"Pessoas\", \"descricao\": \"Atendimento e qualificacao.\" },\n      { \"categoria\": \"Ambiente\", \"descricao\": \"Sensacao de mesmice noturna.\" },\n      { \"categoria\": \"Processos\", \"descricao\": \"Atritos de mobilidade.\" },\n      { \"categoria\": \"Produto\", \"descricao\": \"Preco sem valor percebido.\" }\n    ]\n  }\n}"
  },
  {
    stepIndex: 2,
    id: "matrizes_mix",
    label: "Matrizes VRIO, Porter e Mix de Marketing",
    message: "Calculando diferenciais VRIO, 5 Forças de Porter e Mix de 5 Ps...",
    systemPrompt: "Voce e um estrategista de posicionamento em SJC.\nContexto: N=477, Evasao 66.2%, Preco 33.1%, Instagram 61.8%.\nRetorne EXCLUSIVAMENTE um JSON com esta estrutura:\n{\n  \"matrizes_estrategicas\": {\n    \"vrio\": [\n      { \"letra\": \"V\", \"nome\": \"Valor\", \"analise\": \"Como cria valor...\" },\n      { \"letra\": \"R\", \"nome\": \"Raridade\", \"analise\": \"Diferenciacao...\" },\n      { \"letra\": \"I\", \"nome\": \"Imitabilidade\", \"analise\": \"Barreiras...\" },\n      { \"letra\": \"O\", \"nome\": \"Organizacao\", \"analise\": \"Capacidade de entrega...\" }\n    ],\n    \"porter\": [\n      { \"forca\": \"Rivalidade entre Concorrentes\", \"analise\": \"Concorrencia...\" },\n      { \"forca\": \"Ameaca de Novos Entrantes\", \"analise\": \"Barreiras...\" },\n      { \"forca\": \"Produtos Substitutos\", \"analise\": \"Evasao para SP/Litoral (66.2%)...\" },\n      { \"forca\": \"Barganha dos Fornecedores\", \"analise\": \"Custos e prazos...\" },\n      { \"forca\": \"Barganha dos Clientes\", \"analise\": \"Sensibilidade a preco (33.1%)...\" }\n    ]\n  },\n  \"mix_marketing\": {\n    \"cinco_ps\": [\n      { \"p\": \"Produto\", \"analise\": \"Mix e qualidade...\" },\n      { \"p\": \"Preco\", \"analise\": \"Precificacao...\" },\n      { \"p\": \"Praca\", \"analise\": \"Canais e localizacao...\" },\n      { \"p\": \"Promocao\", \"analise\": \"Instagram (61.8%)...\" },\n      { \"p\": \"Pessoas\", \"analise\": \"Atendimento e hospitalidade...\" }\n    ],\n    \"oceano_azul\": {\n      \"eliminar\": \"Custos superfluos...\", \"reduzir\": \"Desperdicios...\", \"elevar\": \"Padrao de servico...\", \"criar\": \"Diferenciais exclusivos...\"\n    }\n  }\n}"
  },
  {
    stepIndex: 3,
    id: "movimentos_culturais",
    label: "Movimentos Culturais e Veredicto",
    message: "Mapeando lentes comportamentais de SJC e formulando veredicto...",
    systemPrompt: "Voce e um antropologo de consumo em SJC.\nContexto: N=477, 4 Movimentos Culturais como Hipoteses.\nRetorne EXCLUSIVAMENTE um JSON com esta estrutura:\n{\n  \"movimentos_culturais\": {\n    \"analise_cards\": {\n      \"geografia_silencio\": \"Hipotese sobre publico de refugio (Urbanova/Adyana).\",\n      \"cidade_prometida\": \"Hipotese sobre familias tradicionais (Zona Sul/Colinas).\",\n      \"tribo_global\": \"Hipotese sobre publico cosmopolita (Aquarius/Vila Ema).\",\n      \"empreendedorismo_intuitivo\": \"Hipotese sobre economia real de bairro.\"\n    },\n    \"veredicto_final\": {\n      \"nome_movimento\": \"A Tribo Global\",\n      \"justificativa_densa\": \"[HIPOTESE ESTRATEGICA A VALIDAR] Explicacao analitica do fit da proposta com SJC.\"\n    }\n  }\n}"
  }
];

function assembleFinalReport(job) {
  const p = job.partial_results || {};
  const mod1 = p.visao_bairros || {};
  const mod2 = p.swot_ambiente || {};
  const mod3 = p.matrizes_mix || {};
  const mod4 = p.movimentos_culturais || {};

  return {
    visao_estrategica_texto: mod1.visao_estrategica_texto || ("A proposta **" + job.idea + "** ataca uma oportunidade latente em Sao Jose dos Campos. Com 66,2% de evasao de consumo para Sao Paulo e Litoral e 69,6% declarando disposicao a gastar mais se houvesse opcoes qualificadas, o sucesso depende de validar a proposta de valor e a elasticidade de preco antes de imobilizar capital."),
    
    bairros: (Array.isArray(mod1.bairros) && mod1.bairros.length > 0) ? mod1.bairros : [
      { nome: "Jardim Aquarius", regiao: "Centro-Oeste", justificativa: "Polo com 41,7% de frequencia e concentracao de alta renda (18,4%)." },
      { nome: "Vila Ema", regiao: "Centro-Oeste", justificativa: "Corredor gastronomico consolidado e alta visibilidade." },
      { nome: "Jardim Satelite", regiao: "Zona Sul", justificativa: "Maior densidade populacional e 28,3% de fluxo na Zona Sul." },
      { nome: "Vila Adyana", regiao: "Centro-Oeste", justificativa: "Publico maduro com perfil de consumo de servicos especializados." },
      { nome: "Urbanova", regiao: "Centro-Oeste", justificativa: "Vetor residencial nobre com demanda por conveniencia exclusiva." }
    ],

    zona_exclusao: mod1.zona_exclusao || "ZONA NORTE / PERIFERICA - Exige cuidado operacional devido a menor concentracao de fluxo para operacoes de alto ticket sem validacao previa de formato e escala.",

    swot: mod2.swot || {
      forcas: ["Aderencia ao perfil Centro-Oeste", "Demanda por exclusividade", "Canal digital agil"],
      fraquezas: ["Custos fixos de locacao", "Sazonalidade", "Dependencia de fornecedores"],
      oportunidades: ["Demanda reprimida (69.6%)", "Retencao de consumo local", "Eventos e ativacoes"],
      ameacas: ["Evasao para SP/Litoral (66.2%)", "Sensibilidade a preco (33.1%)", "Concorrencia online"]
    },

    auditoria_ambiente: {
      pestel: mod2.pestel || {
        P: "Politicas de incentivo a inovacao urbana e desburocratizacao.",
        E: "Classes medias consolidadas (66.3%) e 18.4% de alta renda sustentando tiquetes qualificados.",
        S: "Busca por experiencias autorais frente a percepcao de mesmice na cidade.",
        T: "Instagram como principal canal de descoberta de locais (61.8%).",
        E_env: "Espacos ao ar livre e alta penetracao de cultura pet-friendly (52.8%).",
        L: "Conformidade rigorosa com leis de zoneamento e alvaras municipais."
      },
      ishikawa: mod2.ishikawa || {
        problema_central: "Risco de Baixa Retencao do Consumidor Local em SJC",
        causas: [
          { categoria: "Pessoas & Atendimento", descricao: "Falta de hospitalidade autentica e treinamento qualificado." },
          { categoria: "Ambiente & Experiencia", descricao: "Sensacao de mesmice e falta de aconchego nos espacos." },
          { categoria: "Processos & Mobilidade", descricao: "Atritos de transito e estacionamento escasso." },
          { categoria: "Produto & Percepcao", descricao: "Preco elevado sem entrega de valor percebido ('coisas caras e sem qualidade')." }
        ]
      }
    },

    matrizes_estrategicas: mod3.matrizes_estrategicas || {
      vrio: [
        { letra: "V", nome: "Valor", analise: "Cria valor ao reduzir o atrito de mesmice e oferecer conveniencia qualificada em SJC." },
        { letra: "R", nome: "Raridade", analise: "Diferenciacao consistente frente as opcoes convencionais do mercado local." },
        { letra: "I", nome: "Imitabilidade", analise: "Barreira de defesa ancorada em marca, experiencia e relacionamento comunitario." },
        { letra: "O", nome: "Organizacao", analise: "Estrutura operacional enxuta para manter margem saudavel." }
      ],
      porter: [
        { forca: "Rivalidade entre Concorrentes", analise: "Disputa moderada com negocios tradicionais nos polos Centro e Sul." },
        { forca: "Ameaca de Novos Entrantes", analise: "Barreiras baseadas em ponto comercial, capital de giro e fidelizacao." },
        { forca: "Produtos Substitutos", analise: "Pressao de e-commerces e evasao frequente para Sao Paulo (66.2%)." },
        { forca: "Barganha dos Fornecedores", analise: "Dependencia de prazos e custos logisticos do Vale do Paraiba." },
        { forca: "Barganha dos Clientes", analise: "Sensibilidade a preco elevada (33.1% apontam custo alto como barreira)." }
      ]
    },

    mix_marketing: mod3.mix_marketing || {
      cinco_ps: [
        { p: "Produto", analise: "Mix equilibrado com itens de entrada e itens ancora de alta margem." },
        { p: "Preco", analise: "Precificacao compatível com a renda familiar alvo sem sacrificar percepcao de valor." },
        { p: "Praca", analise: "Presenca fisica estrategica com apoio de canais digitais ageis." },
        { p: "Promocao", analise: "Foco no Instagram (61.8%) e ativacoes comunitarias locais." },
        { p: "Pessoas", analise: "Hospitalidade, treinamento consultivo e foco na retencao do cliente." }
      ],
      oceano_azul: {
        eliminar: "Custos operacionais superfluos que nao geram valor perceptivel.",
        reduzir: "Desperdicios e dependencia de modelos genericos nao adaptados a SJC.",
        elevar: "Consistencia de atendimento, curadoria e agilidade de entrega.",
        criar: "Experiencias exclusivas e conexoes autenticas com a identidade da cidade."
      }
    },

    movimentos_culturais: mod4.movimentos_culturais || {
      analise_cards: {
        geografia_silencio: "Hipotese: publico focado em familia, calmaria e marcas consolidadas (Urbanova/Adyana).",
        cidade_prometida: "Hipotese: familias tradicionais com foco em tecnologia e seguranca (Zona Sul/Colinas).",
        tribo_global: "Hipotese: publico tech e cosmopolita exigente em design e padrao internacional (Aquarius/Vila Ema).",
        empreendedorismo_intuitivo: "Hipotese: economia real de bairro com foco em velocidade e custo-beneficio."
      },
      veredicto_final: {
        nome_movimento: "A Tribo Global",
        justificativa_densa: "[HIPOTESE ESTRATEGICA A VALIDAR] A proposta encontra maior fit comportamental e ticket no movimento A Tribo Global, demandando validacao pratica com o publico do vetor Centro-Oeste."
      }
    },

    // INJEÇÃO DETERMINÍSTICA DOS GRÁFICOS AUDITADOS (100% EXATOS DA BASE N=477)
    grafico_validacao: {
      titulo: "BARREIRAS DE CONSUMO E ATRITOS LOCAIS (SJC N=477)",
      type: "bar",
      labels: ["Preço Alto", "Falta Lugar Legal", "Insegurança", "Sem Dificuldade", "Transporte"],
      data: [33.1, 23.5, 20.5, 13.6, 7.1]
    },

    graficos_analiticos: [
      {
        chart_data: {
          type: "horizontalBar",
          title: "Concentração e Frequência por Região (Geometria Urbana)",
          labels: ["Centro-Oeste", "Zona Sul", "Todas as Regiões", "Zona Leste", "Zona Norte"],
          data: [41.7, 28.3, 11.9, 11.5, 6.5],
          highlight_index: 0
        },
        pergunta_origem: "Qual região da cidade você mais frequenta quando sai de casa? (N=477)",
        parecer_analitico: "Concentração consolidada no eixo Centro-Oeste (41.7%) e Zona Sul (28.3%), polarizando mais de 70% da dinâmica urbana."
      },
      {
        chart_data: {
          type: "doughnut",
          title: "O Paradoxo de Evasão (Oportunidade Latente)",
          labels: ["Evadem para SP/Litoral", "Consomem em SJC"],
          data: [66.2, 33.8],
          highlight_color: "#D97706"
        },
        pergunta_origem: "Você costuma ir para outras cidades para passear ou comer fora? (N=477)",
        parecer_analitico: "Evasão de 66.2% que sai frequentemente ou ocasionalmente para fora, sinalizando oportunidade de retenção local."
      },
      {
        chart_data: {
          type: "bar",
          title: "Distribuição de Renda Familiar por Faixa",
          labels: ["Até R$ 2.8k", "R$ 2.8k-5.6k", "R$ 5.6k-12k", "R$ 12k-26k", "Acima R$ 26k"],
          data: [15.3, 33.8, 32.5, 14.0, 4.4],
          highlight_label: "R$ 5.6k-12k"
        },
        pergunta_origem: "Qual a renda total da sua casa por mês? (N=477)",
        parecer_analitico: "Predomínio de classes médias (66.3% entre R$ 2.8k e R$ 12k) e 18.4% de alta renda (> R$ 12k)."
      }
    ],

    verbalizacoes_reais: OFFICIAL_VERBATIMS
  };
}

// 4. HANDLER PRINCIPAL DA ROTA /api/consultor (STEP-DRIVEN)
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
        estimated_seconds: 45,
        message: "Job criado com sucesso. Inicie o polling para avançar as etapas."
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
          message: "Relatório concluído com sucesso!"
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

      // Concurrency Lock Check (Anti-colisão de requisições simultâneas)
      const now = Date.now();
      if (job.is_processing && (now - (job.lock_timestamp || 0)) < 30000) {
        const stepDef = MODULE_DEFINITIONS[job.current_step] || {};
        return res.status(200).json({
          success: true,
          job_id: job.job_id,
          status: "running",
          current_step: job.current_step,
          current_module_label: stepDef.label || "Processando etapa",
          total_steps: job.total_steps,
          progress_percent: Math.round((job.completed_steps.length / job.total_steps) * 100),
          message: "Executando " + (stepDef.label || "etapa") + "..."
        });
      }

      // Executar EXATAMENTE UMA etapa pendente durante esta requisição de status
      if (job.current_step < MODULE_DEFINITIONS.length) {
        const stepDef = MODULE_DEFINITIONS[job.current_step];
        
        // Bloquear concorrência
        job.is_processing = true;
        job.lock_timestamp = now;
        job.status = "running";
        saveJob(job);

        const userPayloadStr = JSON.stringify({
          proposta_negocio: job.idea,
          relatorio_auditar: job.report_to_audit ? job.report_to_audit.slice(0, 1500) : "Nenhum relatorio externo."
        });

        try {
          if (!apiKey) {
            throw new Error("GROQ_API_KEY não configurada nas variáveis de ambiente.");
          }

          const stepResult = await callGroqStep(apiKey, stepDef.systemPrompt, userPayloadStr, 650);
          job.partial_results[stepDef.id] = stepResult;
          
          if (!job.completed_steps.includes(stepDef.id)) {
            job.completed_steps.push(stepDef.id);
          }
          job.current_step++;

          // Se concluiu todas as etapas
          if (job.completed_steps.length >= MODULE_DEFINITIONS.length) {
            job.status = "completed";
            job.final_result = assembleFinalReport(job);
            job.progress_percent = 100;
            job.estimated_remaining_seconds = 0;
            job.message = "Relatório concluído com sucesso!";
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
            job.status = "waiting_rate_limit";
            job.message = "Limite de taxa atingido. Aguardando liberação da janela Groq...";
            job.retryable = true;
            saveJob(job);
          } else {
            job.retry_count = (job.retry_count || 0) + 1;
            if (job.retry_count > 2) {
              // Injeta fallback determinístico para este módulo para não travar o cliente
              job.partial_results[stepDef.id] = {};
              if (!job.completed_steps.includes(stepDef.id)) {
                job.completed_steps.push(stepDef.id);
              }
              job.current_step++;
              job.retry_count = 0;

              if (job.completed_steps.length >= MODULE_DEFINITIONS.length) {
                job.status = "completed";
                job.final_result = assembleFinalReport(job);
              }
            } else {
              job.last_error = err.message;
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
        reply: JSON.stringify(job.final_result),
        datasetN: DATASET_SNAPSHOT.n
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
