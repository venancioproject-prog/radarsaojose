// API Consultor Estratégico - High-Intelligence Analytics & Human Strategy Engine
// Fontes Oficiais: Supabase (Radar SJC N=477), IBGE Censo 2022 SJC, Estudo Conceitual dos 4 Movimentos Culturais (Studio 8)

const fs = require('fs');
const path = require('path');
const os = require('os');

// 1. BASE DE CONHECIMENTO INTEGRADA (SUPABASE N=477 + IBGE CENSO + MOVIMENTOS CULTURAIS)
const KNOWLEDGE_BASE = {
  n_total: 477,
  fonte: "Supabase / Radar SJC 2026",
  ibge_sjc_2022: {
    populacao_total: 697428,
    domicilios_particulares: 257482,
    media_moradores_domicilio: 2.7,
    idade_mediana: 36,
    taxa_urbanizacao: 99.2,
    regioes_ibge: {
      centro_oeste: { nome: "Centro-Oeste (Aquarius, Vila Ema, Vila Adyana, Esplanada, Urbanova)", perfil: "Polo de maior concentração de serviços, alta renda, verticalização recente e tráfego cosmopolita." },
      zona_sul: { nome: "Zona Sul (Jd. Satélite, Pq. Industrial, Bosque dos Eucaliptos, Campo dos Alemães)", perfil: "Região mais populosa da cidade (~35% da população), autossuficiente comercialmente, predominância de classes B e C consolidadas." },
      zona_leste: { nome: "Zona Leste (Vista Verde, Eugênio de Melo, Novo Horizonte)", perfil: "Vetor industrial e residencial com forte expansão habitacional e carência de lazer qualificado." },
      zona_norte: { nome: "Zona Norte (Santana, Alto da Ponte)", perfil: "Ocupação tradicional histórica, menor renda média relativa e alta demanda por transporte e conexão." }
    }
  },
  movimentos_culturais_studio8: [
    {
      id: "geografia_silencio",
      nome: "A Geografia do Silêncio",
      essencia: "Refúgio, sossego, áreas verdes, condomínios fechados, busca por calmaria e fuga do estresse corporativo.",
      publico_alvo: "Famílias estabelecidas, aposentados, executivos que buscam desaceleração e privacidade.",
      territorio_ancora: "Urbanova, Vila Adyana e condomínios da Zona Oeste.",
      drivers_consumo: "Atendimento calmo, discrição, segurança, espaços pet-friendly, conveniência sem aglomeração."
    },
    {
      id: "cidade_prometida",
      nome: "A Cidade Prometida",
      essencia: "Nostalgia do polo de inovação (Vale do Silício brasileiro), orgulho institucional, ordem, segurança e valores familiares.",
      publico_alvo: "Engenheiros do DCTA/ITA/Embraer, servidores públicos e famílias tradicionais de classe média/alta.",
      territorio_ancora: "Zona Sul (Satélite/Colinas), DCTA, Vila Betânia e Parque Tecnológico.",
      drivers_consumo: "Credibilidade técnica, custo-benefício comprovado, marcas consolidadas, conformidade e ambiente seguro para filhos."
    },
    {
      id: "tribo_global",
      nome: "A Tribo Global",
      essencia: "Publico cosmopolita, early adopters, repertório cultural internacional, gastronomia autoral, design contemporâneo e vida urbana vibrante.",
      publico_alvo: "Jovens profissionais de tecnologia, designers, profissionais liberais e criativos que ganham em SJC mas consomem em SP.",
      territorio_ancora: "Jardim Aquarius, Vila Ema, Av. Nove de Julho e Vicentina Aranha.",
      drivers_consumo: "Exclusividade simbólica, curadoria de especialistas, estética minimalista/clean, marcas autorais e inovação."
    },
    {
      id: "empreendedorismo_intuitivo",
      nome: "Empreendedorismo Intuitivo",
      essencia: "A economia real dos bairros, prestadores de serviço, pequenos comerciantes e pragmatismo econômico focado no sustento e giro rápido.",
      publico_alvo: "Autônomos, prestadores de serviço, lojistas de rua e comerciantes locais que trabalham pelo instinto e necessidade.",
      territorio_ancora: "Zona Sul (Av. Andrômeda/Bacabal), Zona Leste, Centro Popular e Zona Norte.",
      drivers_consumo: "Pragmatismo, agilidade, atendimento via WhatsApp, preço justo, flexibilidade e retorno tangível."
    }
  ],
  indicadores_quantitativos: {
    renda_familiar: {
      id: "renda_familiar",
      pergunta: "Qual a renda total da sua casa por mês?",
      tipo_grafico_recomendado: "bar",
      denominador: 477,
      categorias: [
        { nome: "Até R$ 2.800 (Classe D/E)", n: 73, percentual: 15.3 },
        { nome: "R$ 2.801 a R$ 5.600 (Classe C)", n: 161, percentual: 33.8 },
        { nome: "R$ 5.601 a R$ 12.000 (Classe B)", n: 155, percentual: 32.5 },
        { nome: "R$ 12.001 a R$ 26.000 (Classe A/B)", n: 67, percentual: 14.0 },
        { nome: "Acima de R$ 26.000 (Elite)", n: 21, percentual: 4.4 }
      ],
      sumario: "66.3% da população pertence à classe média (R$ 2.8k a 12k) e 18.4% possui alta renda (> R$ 12k)."
    },
    evasao_consumo: {
      id: "evasao_consumo",
      pergunta: "Você costuma ir para outras cidades para passear ou comer fora?",
      tipo_grafico_recomendado: "doughnut",
      denominador: 477,
      categorias: [
        { nome: "Às vezes (Evasão Ocasional)", n: 238, percentual: 49.9 },
        { nome: "Quase nunca (Consumo Local)", n: 129, percentual: 27.0 },
        { nome: "Sim, sempre (Evasão Crônica)", n: 78, percentual: 16.4 },
        { nome: "Nunca (100% Local)", n: 32, percentual: 6.7 }
      ],
      sumario: "66.2% dos moradores evadem consumo de lazer/gastronomia para fora da cidade (SP/Litoral)."
    },
    frequencia_saida: {
      id: "frequencia_saida",
      pergunta: "Com que frequência você costuma sair para comer fora ou lazer?",
      tipo_grafico_recomendado: "bar",
      denominador: 477,
      categorias: [
        { nome: "2 ou 3 vezes por mês", n: 184, percentual: 38.6 },
        { nome: "1 vez ao mês", n: 115, percentual: 24.1 },
        { nome: "Toda semana", n: 105, percentual: 22.0 },
        { nome: "Quase nunca", n: 68, percentual: 14.3 },
        { nome: "Nunca", n: 5, percentual: 1.0 }
      ],
      saida_regular: {
        nome: "Toda semana ou 2 a 3 vezes por mês",
        n: 289,
        percentual: 60.6,
        detalhe: "22.0% toda semana (105/477) + 38.6% 2-3 vezes por mês (184/477)",
        formula: "(105 + 184) / 477 * 100"
      },
      sumario: "60.6% saem regularmente (22.0% toda semana e 38.6% 2-3 vezes por mês)."
    },
    regioes_frequentadas: {
      id: "regioes_frequentadas",
      pergunta: "Qual região da cidade você mais frequenta quando sai de casa?",
      tipo_grafico_recomendado: "horizontalBar",
      denominador: 477,
      categorias: [
        { nome: "Centro-Oeste (Aquarius / Vila Ema / Adyana)", n: 199, percentual: 41.7 },
        { nome: "Zona Sul (Satélite / Eucaliptos)", n: 135, percentual: 28.3 },
        { nome: "Todas as Regiões Igualmente", n: 57, percentual: 11.9 },
        { nome: "Zona Leste", n: 55, percentual: 11.5 },
        { nome: "Zona Norte", n: 31, percentual: 6.5 }
      ],
      sumario: "Centro-Oeste (41.7%) e Zona Sul (28.3%) concentram 70% do fluxo urbano ativo."
    },
    barreiras_saida: {
      id: "barreiras_saida",
      pergunta: "O que mais te desanima de sair à noite em São José dos Campos?",
      tipo_grafico_recomendado: "bar",
      denominador: 477,
      categorias: [
        { nome: "Preços altos / Pouco custo-benefício", n: 158, percentual: 33.1 },
        { nome: "Falta de opções legais / Mesmice", n: 112, percentual: 23.5 },
        { nome: "Sensação de insegurança", n: 98, percentual: 20.5 },
        { nome: "Não vejo dificuldade", n: 65, percentual: 13.6 },
        { nome: "Trânsito e transporte", n: 34, percentual: 7.1 },
        { nome: "Outros", n: 10, percentual: 2.1 }
      ],
      sumario: "Preço alto (33.1%) e falta de opções legais/mesmice (23.5%) são as maiores barreiras de consumo."
    },
    criterios_escolha: {
      id: "criterios_escolha",
      pergunta: "O que faz você escolher um restaurante ou bar?",
      tipo_grafico_recomendado: "bar",
      denominador: 477,
      categorias: [
        { nome: "Indicação de amigos ou família", n: 196, percentual: 41.1 },
        { nome: "Preço e custo-benefício", n: 124, percentual: 26.0 },
        { nome: "Lugar bonito e agradável", n: 89, percentual: 18.7 },
        { nome: "O que vejo no Instagram/TikTok", n: 52, percentual: 10.9 },
        { nome: "Outros fatores", n: 16, percentual: 3.3 }
      ],
      sumario: "Boca a boca (41.1%) e preço (26.0%) lideram como gatilhos primários de decisão."
    },
    redes_descoberta: {
      id: "redes_descoberta",
      pergunta: "Qual rede social você mais usa para descobrir novos lugares ou eventos?",
      tipo_grafico_recomendado: "bar",
      denominador: 477,
      categorias: [
        { nome: "Instagram", n: 295, percentual: 61.8 },
        { nome: "TikTok", n: 78, percentual: 16.4 },
        { nome: "YouTube", n: 66, percentual: 13.8 },
        { nome: "Google / Maps / Buscadores", n: 11, percentual: 2.3 },
        { nome: "Facebook", n: 10, percentual: 2.1 },
        { nome: "Não usa / Amigos", n: 17, percentual: 3.6 }
      ],
      sumario: "Instagram (61.8%) é o canal hegemônico para descoberta e validação visual."
    },
    demanda_reprimida: {
      id: "demanda_reprimida",
      pergunta: "Você gastaria mais dinheiro se a cidade tivesse melhores opções?",
      tipo_grafico_recomendado: "doughnut",
      denominador: 477,
      categorias: [
        { nome: "Sim (Gastaria Mais)", n: 332, percentual: 69.6 },
        { nome: "Não (Manteria Gasto)", n: 145, percentual: 30.4 }
      ],
      sumario: "69.6% dos cidadãos afirmam disposição explícita de gastar mais se houvesse opções superiores."
    },
    influenciadores: {
      id: "influenciadores",
      pergunta: "Já foi a algum lugar por recomendação de influenciador?",
      tipo_grafico_recomendado: "doughnut",
      denominador: 477,
      categorias: [
        { nome: "Não (Ceticismo com Influencers)", n: 332, percentual: 69.6 },
        { nome: "Sim (Conversão por Influencer)", n: 145, percentual: 30.4 }
      ],
      sumario: "69.6% não seguem cegamente influenciadores locais, valorizando autenticidade sobre publi-posts."
    },
    pets_posse: {
      id: "pets_posse",
      pergunta: "Você tem animal de estimação em casa? (N=475 válidos)",
      tipo_grafico_recomendado: "doughnut",
      denominador: 475,
      categorias: [
        { nome: "Sim (Possui Pets)", n: 251, percentual: 52.8 },
        { nome: "Não (Sem Pets)", n: 224, percentual: 47.2 }
      ],
      sumario: "52.8% dos domicílios possuem pets, gerando alta demanda por conveniência pet-friendly."
    },
    produtores_locais: {
      id: "produtores_locais",
      pergunta: "Você costuma comprar de produtores locais ou ir em feiras de artesanato da cidade?",
      tipo_grafico_recomendado: "bar",
      denominador: 477,
      categorias: [
        { nome: "Às vezes", n: 215, percentual: 45.1 },
        { nome: "Tenho vontade, mas não vou", n: 120, percentual: 25.2 },
        { nome: "Não tenho interesse", n: 73, percentual: 15.3 },
        { nome: "Sim, sempre", n: 69, percentual: 14.5 }
      ],
      sumario: "1 em cada 4 joseenses quer apoiar a produção local mas esbarra em falta de acesso e divulgação."
    }
  },
  banco_verbalizacoes: [
    { citacao: "Custo de vida de capital com opções de interior... Coisas caras e sem qualidade.", genero: "Mulher", idade: "25-34 anos", regiao: "Zona Sul", renda: "R$ 5.6k - 12k", tags: ["preco", "qualidade", "gastronomia", "geral"] },
    { citacao: "Falta aconchego humano e vida nas ruas fora dos shoppings e corredores.", genero: "Mulher", idade: "65+ anos", regiao: "Centro-Oeste", renda: "R$ 5.6k - 12k", tags: ["experiencia", "espaco", "atendimento", "cultura"] },
    { citacao: "Para lazer e cultura prefiro ir a São Paulo pois as opções aqui são limitadas e caras.", genero: "Mulher", idade: "35-44 anos", regiao: "Centro-Oeste", renda: "R$ 12k - 26k", tags: ["evasao", "cultura", "moda", "alto_padrao"] },
    { citacao: "Não faz sentido pagar o mesmo que em Pinheiros aqui em São José sem a mesma entrega.", genero: "Mulher", idade: "18-24 anos", regiao: "Zona Sul", renda: "R$ 2.8k - 5.6k", tags: ["preco", "gastronomia", "juventude", "evasao"] },
    { citacao: "Tem opções legais mas pra quem pode pagar mais. Se você não quer desembolsar tanto o que resta é shopping.", genero: "Mulher", idade: "35-44 anos", regiao: "Zona Leste", renda: "R$ 2.8k - 5.6k", tags: ["acesso", "shopping", "familia", "preco"] },
    { citacao: "Falta espontaneidade na cidade: um lugar autoral com boa música, atendimento direto e preço justo.", genero: "Homem", idade: "25-34 anos", regiao: "Centro-Oeste", renda: "R$ 5.6k - 12k", tags: ["autoral", "experiencia", "design", "inovacao"] },
    { citacao: "A gente vive com medo de circular a pé à noite; tudo precisa de estacionamento e carro.", genero: "Homem", idade: "45-54 anos", regiao: "Zona Sul", renda: "R$ 5.6k - 12k", tags: ["seguranca", "transporte", "acessibilidade", "ponto"] },
    { citacao: "Os eventos gastronômicos e feiras deveriam ser para experimentar, mas cobram preços abusivos.", genero: "Mulher", idade: "45-54 anos", regiao: "Zona Norte", renda: "R$ 2.8k - 5.6k", tags: ["gastronomia", "preco", "feiras", "acesso"] },
    { citacao: "Queria ver coisas autorais e marcas que conversem com a identidade de SJC, não apenas franquias repetidas.", genero: "Homem", idade: "25-34 anos", regiao: "Centro-Oeste", renda: "R$ 12k - 26k", tags: ["autoral", "moda", "marcas", "tribo_global"] },
    { citacao: "O joseense é exigente e repara em cada detalhe do atendimento; se for mal tratado uma vez, não volta nunca mais.", genero: "Mulher", idade: "35-44 anos", regiao: "Centro-Oeste", renda: "R$ 5.6k - 12k", tags: ["atendimento", "fidelidade", "servico", "vrio"] }
  ]
};

// 2. SISTEMA DE PERSISTÊNCIA DE JOBS
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

// 3. SELEÇÃO DINÂMICA DE VERBATIMS RELEVANTES POR CONCEITO
function selectContextualVerbatims(ideaText) {
  const t = String(ideaText || "").toLowerCase();
  let scored = KNOWLEDGE_BASE.banco_verbalizacoes.map(v => {
    let score = 0;
    if (t.includes("biquíni") || t.includes("biquini") || t.includes("praia") || t.includes("moda") || t.includes("roupa")) {
      if (v.tags.includes("moda") || v.tags.includes("alto_padrao") || v.tags.includes("autoral")) score += 4;
    }
    if (t.includes("doce") || t.includes("bolo") || t.includes("café") || t.includes("restaurante") || t.includes("bar") || t.includes("comida")) {
      if (v.tags.includes("gastronomia") || v.tags.includes("preco") || v.tags.includes("experiencia")) score += 4;
    }
    if (t.includes("pet") || t.includes("veterinário") || t.includes("animal")) {
      if (v.tags.includes("espaco") || v.tags.includes("servico")) score += 3;
    }
    if (v.tags.includes("geral") || v.tags.includes("atendimento")) score += 1;
    return { ...v, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 3).map(v => ({
    citacao: v.citacao,
    genero: v.genero,
    idade: v.idade,
    regiao: v.regiao,
    renda: v.renda
  }));
}

// 4. CHAMADA ROBUSTA À GROQ
async function callGroqStep(apiKey, systemPrompt, userContent, maxTokens = 850) {
  const model = "qwen/qwen3.6-27b";
  const payload = {
    model: model,
    max_tokens: maxTokens,
    temperature: 0.25, // Criatividade controlada com ancoragem factual
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
    .replace(/^``(?:json)?\s*/i, "")
    .replace(/\s*``$/i, "")
    .trim();

  const firstBrace = cleanContent.indexOf("{");
  const lastBrace = cleanContent.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleanContent = cleanContent.substring(firstBrace, lastBrace + 1).trim();
  }

  return JSON.parse(cleanContent);
}

// 5. ETAPAS ESTRATÉGICAS MODULARES DE ANÁLISE PROFUNDA
const MODULE_DEFINITIONS = [
  {
    stepIndex: 0,
    id: "visao_veredito_territorio",
    label: "Tese Estratégica, Veredito Humano e Fit Territorial",
    message: "Construindo tese original, veredito decisivo e ranking territorial...",
    systemPrompt: "Voce e um Estrategista-Chefe de Negocios e Consultor Senior em Sao Jose dos Campos.\n\nFONTES INTEGRADAS:\n1. Microdados Supabase N=477: Frequencia Centro-Oeste 41.7%, Zona Sul 28.3%, Leste 11.5%, Norte 6.5%. Evasao lazer/restaurantes 66.2%. Disposicao a gastar mais 69.6%. Renda >12k: 18.4% (amostra total). Preco como barreira: 33.1%, Mesmice: 23.5%. Instagram para busca: 61.8%.\n2. IBGE Censo 2022 SJC: 697.428 hab, idade mediana 36 anos, 99.2% urbanizacao, Centro-Oeste polo de servicos/verticalizacao, Zona Sul polo populacional autossuficiente.\n\nDIRETRIZES DE INTELIGENCIA E LIBERDADE ESTRATEGICA:\n- RIGOR FACTUAL: Nunca invente numeros, contagens ou renda isolada de bairro.\n- LIBERDADE DE RACIOCINIO: Formule uma tese provocativa, original e humana. Diga claramente se a ideia e promissora, perigosa ou mal posicionada. Proponha como transformar a ideia para vencer em SJC.\n- VEREDITO CLARO: Escolha uma postura categorica: 'avancar', 'avancar com reposicionamento', 'testar antes de investir', 'comecar em formato enxuto' ou 'nao abrir neste formato'.\n- TERRITORIO: Avalie 5 microterritorios (Jardim Aquarius, Vila Ema, Jardim Satelite, Vila Adyana, Urbanova) com formatos customizados (ex: showroom agendado, loja de rua, quiosque, delivery ou digital com retirada).\n\nRETORNE EXCLUSIVAMENTE UM JSON com esta estrutura exata:\n{\n  \"visao_estrategica_texto\": \"Texto executivo, denso e persuasivo (2 a 3 paragrafos). Comece destacando a proposta em **negrito**. Revele a tensao central entre a dor do consumidor e a oferta local, exponha a oportunidade oculta e dite o veredito estrategico em tom de consultor de alto nivel.\",\n  \"veredito_postura\": \"testar antes de investir | avancar com reposicionamento | comecar em formato enxuto | avancar | nao abrir neste formato\",\n  \"bairros\": [\n    { \"nome\": \"Jardim Aquarius\", \"regiao\": \"Centro-Oeste\", \"fit_score\": 88, \"formato_recomendado\": \"Showroom / Atendimento Agendado\", \"justificativa\": \"Analise estrategica de fit com o fluxo cosmopolita e riscos do ponto comercial.\" },\n    { \"nome\": \"Vila Ema\", \"regiao\": \"Centro-Oeste\", \"fit_score\": 84, \"formato_recomendado\": \"Loja Conceito / Vitrine Autoral\", \"justificativa\": \"Aproveitamento da tradicao de moda, gastronomia de rua e visibilidade qualificada.\" },\n    { \"nome\": \"Jardim Satelite\", \"regiao\": \"Zona Sul\", \"fit_score\": 76, \"formato_recomendado\": \"Operacao com foco em Escala / Custo-Beneficio\", \"justificativa\": \"Densidade populacional e teste de elasticidade de ticket na regiao mais populosa.\" },\n    { \"nome\": \"Vila Adyana\", \"regiao\": \"Centro-Oeste\", \"fit_score\": 79, \"formato_recomendado\": \"Boutique / Espaco Integrado a Servicos\", \"justificativa\": \"Fluxo qualificado de saude e bem-estar em microterritorio tradicional.\" },\n    { \"nome\": \"Urbanova\", \"regiao\": \"Centro-Oeste\", \"fit_score\": 72, \"formato_recomendado\": \"Atendimento Delivery Premium / Pop-up\", \"justificativa\": \"Aderencia a comodidade residencial evitando o atrito de trafego da ponte.\" }\n  ],\n  \"zona_exclusao\": \"Definicao analitica do local ou modelo de operacao que deve ser EVITADO para nao drenar capital de giro.\"\n}"
  },
  {
    stepIndex: 1,
    id: "swot_causalidade_ambiente",
    label: "SWOT Específica, Cadeia Causal (Ishikawa) e PESTEL",
    message: "Construindo análise SWOT sem clichês, diagrama causal e macroambiente...",
    systemPrompt: "Voce e um Estrategista de Riscos e Competitividade em SJC.\n\nDIRETRIZES:\n- SWOT 100% CUSTOMIZADA: Crie forcas internas reais, fraquezas operacionais especificas do nicho, oportunidades conectadas a tensoes e ameacas de mercado plausiveis (sensibilidade a preco 33.1%, e-commerce e retencao local).\n- ISHIKAWA DE CAUSA-RAIZ: Defina o problema central mais critico para este modelo de negocio em SJC e detalhe as 4 causas em cadeia logica (Pessoas, Ambiente, Processos, Produto/Preco).\n- PESTEL ACIONAVEL: Explique os fatores macroambientais conectando-os a decisoes praticas que o empreendedor deve tomar em SJC.\n\nRETORNE EXCLUSIVAMENTE UM JSON com esta estrutura:\n{\n  \"swot\": {\n    \"forcas\": [\"Diferencial interno especifico 1\", \"Diferencial 2\", \"Diferencial 3\"],\n    \"fraquezas\": [\"Gargalo operacional/estoque/sazonalidade 1\", \"Gargalo 2\", \"Gargalo 3\"],\n    \"oportunidades\": [\"Alavanca de mercado contextualizada com SJC 1\", \"Alavanca 2\", \"Alavanca 3\"],\n    \"ameacas\": [\"Ameaca competitiva ou de elasticidade de ticket 1\", \"Ameaca 2\", \"Ameaca 3\"]\n  },\n  \"pestel\": {\n    \"P\": \"Diretriz politica/regulatoria municipal aplicavel...\",\n    \"E\": \"Dinamica de renda familiar (classes medias 66.3% e alta renda 18.4%) e sensibilidade de ticket...\",\n    \"S\": \"Comportamento e busca por experiencias qualificadas frente a percepcao de mesmice...\",\n    \"T\": \"Adesao macica ao Instagram (61.8%) e canais digitais ageis de conversao...\",\n    \"E_env\": \"Sustentabilidade, espacos abertos, bem-estar ou cultura pet (52.8%)...\",\n    \"L\": \"Conformidade de zoneamento, alvaras e legislacao do consumidor em SJC...\"\n  },\n  \"ishikawa\": {\n    \"problema_central\": \"Defina o risco de falha ou atrito central especifico da proposta em SJC\",\n    \"causas\": [\n      { \"categoria\": \"Pessoas & Atendimento\", \"descricao\": \"Causa especifica de atrito no atendimento ou consultoria do produto.\" },\n      { \"categoria\": \"Ambiente & Experiencia\", \"descricao\": \"Causa relacionada ao ponto, comodidade, espaco ou atrito de acesso.\" },\n      { \"categoria\": \"Processos & Operacao\", \"descricao\": \"Causa operacional, gestao de estoque, fornecedores ou escala.\" },\n      { \"categoria\": \"Produto & Precificacao\", \"descricao\": \"Causa ligada a percepcao de preco ('coisas caras e sem qualidade') vs valor real.\" }\n    ]\n  }\n}"
  },
  {
    stepIndex: 2,
    id: "selecao_graficos_matrizes",
    label: "Seleção Dinâmica de Gráficos e Matrizes VRIO / Porter",
    message: "Selecionando dinamicamente os 3 gráficos ideais e frameworks competitivos...",
    systemPrompt: "Voce e um Engenheiro de Inteligencia de Dados e Estrategista de Posicionamento.\n\nINDICADORES QUANTITATIVOS DISPONIVEIS NO SUPABASE N=477:\n1. renda_familiar: Até 2.8k (15.3%), 2.8k-5.6k (33.8%), 5.6k-12k (32.5%), 12k-26k (14.0%), >26k (4.4%)\n2. evasao_consumo: Sempre/Às vezes evadem para fora (66.2%), Consomem em SJC (33.8%)\n3. regioes_frequentadas: Centro-Oeste (41.7%), Sul (28.3%), Todas (11.9%), Leste (11.5%), Norte (6.5%)\n4. barreiras_saida: Preço alto (33.1%), Mesmice (23.5%), Insegurança (20.5%), Sem dificuldade (13.6%), Trânsito (7.1%)\n5. criterios_escolha: Indicação/Amigos (41.1%), Preço (26.0%), Lugar bonito (18.7%), Instagram/TikTok (10.9%)\n6. redes_descoberta: Instagram (61.8%), TikTok (16.4%), YouTube (13.8%), Google/Maps (2.3%), Facebook (2.1%)\n7. demanda_reprimida: Gastaria mais se houvesse opções (69.6%), Não (30.4%)\n8. influenciadores: Não segue indicação (69.6%), Segue indicação (30.4%)\n9. pets_posse: Possui pets (52.8%), Não possui (47.2%)\n10. produtores_locais: Compram/Vontade de comprar (70.3%), Sem interesse (15.3%)\n\nSELECAO DINAMICA DE GRAFICOS:\nEscolha EXATAMENTE 3 indicadores que melhor expliquem a oportunidade, os riscos e o publico deste negocio especifico. Negocios diferentes DEVEM receber combinacoes diferentes de graficos!\n- Exemplo Moda Praia/Biquinis: [regioes_frequentadas, evasao_consumo, renda_familiar] ou [redes_descoberta, renda_familiar, barreiras_saida]\n- Exemplo Doces/Gastronomia: [barreiras_saida, demanda_reprimida, criterios_escolha]\n- Exemplo Pet/Servicos: [pets_posse, regioes_frequentadas, renda_familiar]\n\nRETORNE EXCLUSIVAMENTE UM JSON com esta estrutura:\n{\n  \"graficos_selecionados_ids\": [\"id_indicador_1\", \"id_indicador_2\", \"id_indicador_3\"],\n  \"pareceres_graficos\": [\n    \"Parecer analitico conectando os dados do grafico 1 a oportunidade do negocio.\",\n    \"Parecer analitico conectando os dados do grafico 2 as barreiras ou habitos do consumidor.\",\n    \"Parecer analitico conectando os dados do grafico 3 a elasticidade de ticket e renda.\"\n  ],\n  \"matrizes_estrategicas\": {\n    \"vrio\": [\n      { \"letra\": \"V\", \"nome\": \"Valor\", \"analise\": \"Como este negocio cria valor autentico para o joseense.\" },\n      { \"letra\": \"R\", \"nome\": \"Raridade\", \"analise\": \"O que e raro ou escasso na proposta frente aos concorrentes locais.\" },\n      { \"letra\": \"I\", \"nome\": \"Imitabilidade\", \"analise\": \"Barreiras reais contra copia (marca, curadoria, acolhimento).\" },\n      { \"letra\": \"O\", \"nome\": \"Organizacao\", \"analise\": \"Capacidade de processos para sustentar a entrega sem queimar margem.\" }\n    ],\n    \"porter\": [\n      { \"forca\": \"Rivalidade entre Concorrentes\", \"analise\": \"Pressao competitiva no nicho especifico em SJC.\" },\n      { \"forca\": \"Ameaca de Novos Entrantes\", \"analise\": \"Barreiras de entrada do setor (capital, ponto, fidelizacao).\" },\n      { \"forca\": \"Produtos Substitutos\", \"analise\": \"Substitutos diretos (e-commerce nacional, compras em SP).\" },\n      { \"forca\": \"Barganha dos Fornecedores\", \"analise\": \"Dependencia de fornecedores e custos de frete.\" },\n      { \"forca\": \"Barganha dos Clientes\", \"analise\": \"Sensibilidade a preco da clientela (33.1% apontam custo alto).\" }\n    ]\n  },\n  \"mix_marketing\": {\n    \"cinco_ps\": [\n      { \"p\": \"Produto\", \"analise\": \"Definicao do mix, curadoria e proposta tangivel.\" },\n      { \"p\": \"Preco\", \"analise\": \"Estrategia de precificacao equilibrada com o ticket medio de SJC.\" },\n      { \"p\": \"Praca\", \"analise\": \"Presenca fisica estrategica combinada com canal digital.\" },\n      { \"p\": \"Promocao\", \"analise\": \"Divulgacao focada em canais aderentes (Instagram 61.8%).\" },\n      { \"p\": \"Pessoas\", \"analise\": \"Treinamento consultivo para atendimento acolhedor e resolutivo.\" }\n    ],\n    \"oceano_azul\": {\n      \"eliminar\": \"Atritos e custos superfluos da operacao.\",\n      \"reduzir\": \"Complexidade de estoque e desperdicios.\",\n      \"elevar\": \"Padrao de curadoria, agilidade e experiencia.\",\n      \"criar\": \"Diferenciais exclusivos para o publico local.\"\n    }\n  }\n}"
  },
  {
    stepIndex: 3,
    id: "movimentos_vencedor_testes",
    label: "Análise dos 4 Movimentos Culturais, Eleição do Vencedor e Testes de Validação",
    message: "Comparando individualmente os 4 movimentos e elegendo o vencedor estratégico...",
    systemPrompt: "Voce e um Antropologo de Consumo e Estrategista de Segmentacao em SJC.\n\nOS 4 MOVIMENTOS CULTURAIS DE SJC (ESTUDO STUDIO 8):\n1. A Geografia do Silêncio: Refúgio, privacidade, calmaria, áreas verdes (Urbanova/Adyana/Oeste).\n2. A Cidade Prometida: Orgulho histórico, inovação, segurança, famílias tradicionais e credibilidade (Satélite/Colinas/DCTA).\n3. A Tribo Global: Cosmopolita, design, gastronomia autoral, tendências globais e exigência de padrão internacional (Aquarius/Vila Ema).\n4. Empreendedorismo Intuitivo: Economia real, pragmatismo de sustento, agilidade e comércio de bairro (Sul/Leste/Centro).\n\nDIRETRIZES OBRIGATORIAS:\n- ANALISE INDIVIDUAL: Compare a aderencia da ideia em CADA UM dos 4 movimentos, explicando o que funciona e o que falha em cada lente.\n- ELEICAO OBRIGATORIA DO MOVIMENTO VENCEDOR: Escolha o movimento que oferece o melhor posicionamento estrategico e maior fit para a ideia. Justifique densamente a escolha em termos estrategicos (nao como verdade estatistica fechada, mas como escolha estrategica deliberada).\n- TESTES DE VALIDACAO CONCRETOS: Forneca um plano de acao e perguntas de pesquisa de campo indispensaveis para validar o negocio antes de investir.\n\nRETORNE EXCLUSIVAMENTE UM JSON com esta estrutura:\n{\n  \"movimentos_culturais\": {\n    \"analise_cards\": {\n      \"geografia_silencio\": \"Analise aprofundada da compatibilidade com o publico de refúgio e bem-estar.\",\n      \"cidade_prometida\": \"Analise aprofundada da compatibilidade com familias e o orgulho institucional.\",\n      \"tribo_global\": \"Analise aprofundada da compatibilidade com o publico cosmopolita e exigente em design.\",\n      \"empreendedorismo_intuitivo\": \"Analise aprofundada da compatibilidade com a economia real de bairro.\"\n    },\n    \"veredicto_final\": {\n      \"nome_movimento\": \"A Tribo Global | A Geografia do Silêncio | A Cidade Prometida | Empreendedorismo Intuitivo\",\n      \"justificativa_densa\": \"Defesa estrategica detalhada explicando por que este movimento especifico e a melhor alavanca de posicionamento e captura de margem para o negocio em SJC.\"\n    }\n  },\n  \"plano_de_validacao\": {\n    \"hipoteses_criticas\": [\"Hipotese 1 a validar\", \"Hipotese 2\", \"Hipotese 3\"],\n    \"experimento_piloto\": \"Descricao de um teste pratico de baixo custo e rapida execucao em 30 dias.\",\n    \"perguntas_pesquisa_campo\": [\n      \"Pergunta 1 de intencao de compra e frequencia\",\n      \"Pergunta 2 de elasticidade de preco / ticket medio justo\",\n      \"Pergunta 3 sobre canais de preferencia (loja fisica vs digital vs agendamento)\",\n      \"Pergunta 4 sobre marcas ou concorrentes substitutos\"\n    ]\n  }\n}"
  }
];

// 6. MONTAGEM DETERMINÍSTICA E RICA DO RELATÓRIO FINAL
function assembleFinalReport(job) {
  const p = job.partial_results || {};
  const mod1 = p.visao_veredito_territorio || {};
  const mod2 = p.swot_causalidade_ambiente || {};
  const mod3 = p.selecao_graficos_matrizes || {};
  const mod4 = p.movimentos_vencedor_testes || {};

  const ideaText = job.idea || "Negócio em São José dos Campos";

  // Montagem Dinâmica dos 3 Gráficos a partir da seleção inteligente da IA
  const selectedIds = Array.isArray(mod3.graficos_selecionados_ids) && mod3.graficos_selecionados_ids.length >= 3
    ? mod3.graficos_selecionados_ids.slice(0, 3)
    : ["regioes_frequentadas", "evasao_consumo", "renda_familiar"];

  const pareceres = Array.isArray(mod3.pareceres_graficos) && mod3.pareceres_graficos.length >= 3
    ? mod3.pareceres_graficos
    : [
        "Concentração expressiva no eixo Centro-Oeste (41.7%) e Zona Sul (28.3%), orientando o posicionamento geográfico.",
        "A evasão de 66.2% para lazer/gastronomia sinaliza retenção de valor para experiências qualificadas.",
        "Predomínio de classes médias (66.3%) e 18.4% de alta renda sustentando a elasticidade de ticket."
      ];

  const graficosAnaliticosMontados = selectedIds.map((id, idx) => {
    const rawInd = KNOWLEDGE_BASE.indicadores_quantitativos[id] || KNOWLEDGE_BASE.indicadores_quantitativos.regioes_frequentadas;
    return {
      chart_data: {
        type: rawInd.tipo_grafico_recomendado || "bar",
        title: rawInd.pergunta.split("?")[0].replace(/^Qual\s+|\s*\(N=.*\)/gi, '').trim().toUpperCase(),
        labels: rawInd.categorias.map(c => c.nome),
        data: rawInd.categorias.map(c => c.percentual),
        highlight_index: 0
      },
      pergunta_origem: rawInd.pergunta + " (N=" + rawInd.denominador + " - Supabase)",
      parecer_analitico: pareceres[idx] || rawInd.sumario
    };
  });

  // Verbalizações Dinâmicas Relevantes
  const dynamicVerbatims = selectContextualVerbatims(ideaText);

  // Movimento Vencedor Escolhido com Clareza Estratégica
  const movFinal = mod4.movimentos_culturais?.veredicto_final || {
    nome_movimento: "A Tribo Global",
    justificativa_densa: "A proposta encontra seu ponto de ancoragem estratégico prioritário na Tribo Global, combinando busca por inovação, repertório cosmopolita e demanda reprimida no vetor Centro-Oeste."
  };

  return {
    visao_estrategica_texto: mod1.visao_estrategica_texto || ("A proposta **" + ideaText + "** posiciona-se em um mercado com dinâmica de consumo sofisticada. O eixo Centro-Oeste polariza 41,7% das saídas da cidade e 66,2% dos moradores evadem para consumir lazer e compras fora. O diferencial competitivo residirá na consistência da curadoria e na capacidade de criar uma experiência proprietária que justifique a retenção do cliente."),
    
    bairros: (Array.isArray(mod1.bairros) && mod1.bairros.length > 0) ? mod1.bairros : [
      { nome: "Jardim Aquarius", regiao: "Centro-Oeste", fit_score: 88, formato_recomendado: "Showroom / Atendimento Agendado", justificativa: "Polo cosmopolita no vetor Centro-Oeste (41,7% de fluxo), ideal para teste de proposta de valor e ticket qualificado." },
      { nome: "Vila Ema", regiao: "Centro-Oeste", fit_score: 84, formato_recomendado: "Loja Conceito / Vitrine Autoral", justificativa: "Corredor comercial tradicional com alta circulação a pé e visibilidade qualificada." },
      { nome: "Jardim Satélite", regiao: "Zona Sul", fit_score: 76, formato_recomendado: "Operação com foco em Escala", justificativa: "Maior densidade populacional de SJC (28,3% de fluxo na Zona Sul) com alto potencial de volume." },
      { nome: "Vila Adyana", regiao: "Centro-Oeste", fit_score: 79, formato_recomendado: "Boutique / Espaço Integrado", justificativa: "Microterritório com forte apelo a serviços, saúde e bem-estar." },
      { nome: "Urbanova", regiao: "Centro-Oeste", fit_score: 72, formato_recomendado: "Atendimento por Delivery / Pop-up", justificativa: "Vetor residencial nobre com demanda por comodidade e serviços sem atrito de tráfego." }
    ],

    zona_exclusao: mod1.zona_exclusao || "ZONA NORTE / PERIFÉRICA - Evitar locações fixas de alto custo em pontos de baixo fluxo comercial qualificado antes de validar tração de marca e volume de clientes.",

    swot: mod2.swot || {
      forcas: ["Proposta direcionada a um público qualificado em SJC", "Modelo operacional ágil no início", "Curadoria diferenciada"],
      fraquezas: ["Custos fixos de locação em pontos nobres", "Sensibilidade a sazonalidade", "Dependência de validação de giro"],
      oportunidades: ["Demanda reprimida em SJC (69,6% gastariam mais com melhores opções)", "Uso inteligente do Instagram (61,8% para busca)", "Criação de comunidade de clientes fiéis"],
      ameacas: ["Sensibilidade a preço da população (33,1% apontam custo alto como barreira)", "Concorrência com grandes redes e e-commerce", "Evasão para capitais"]
    },

    auditoria_ambiente: {
      pestel: mod2.pestel || {
        P: "Incentivo ao empreendedorismo local e agilidade no licenciamento municipal.",
        E: "Predomínio de classes médias (66,3% entre R$ 2.8k e R$ 12k) e 18,4% de alta renda sustentando tickets qualificados.",
        S: "Busca crescente por opções autorais e personalizadas frente à percepção de mesmice na cidade.",
        T: "Instagram como principal canal de descoberta (61,8%) e fortalecimento do atendimento via WhatsApp.",
        E_env: "Valorização de espaços agradáveis, sustentabilidade e alta adesão à cultura pet-friendly (52,8%).",
        L: "Conformidade rigorosa com normas de zoneamento urbano, código de posturas e alvarás em SJC."
      },
      ishikawa: mod2.ishikawa || {
        problema_central: "Risco de Inviabilidade Operacional ou Baixa Retenção do Consumidor Local em SJC",
        causas: [
          { categoria: "Pessoas & Atendimento", descricao: "Falta de consultoria qualificada e acolhimento autêntico no atendimento." },
          { categoria: "Ambiente & Experiência", descricao: "Ponto comercial com atrito de estacionamento ou falta de conforto." },
          { categoria: "Processos & Operação", descricao: "Gargalos de fornecimento, controle de estoque ou prazos de entrega." },
          { categoria: "Produto & Precificação", descricao: "Preço elevado sem percepção correspondente de entrega de valor." }
        ]
      }
    },

    matrizes_estrategicas: mod3.matrizes_estrategicas || {
      vrio: [
        { letra: "V", nome: "Valor", analise: "Criação de valor tangível ao resolver dores de conveniência e diferenciação em SJC." },
        { letra: "R", nome: "Raridade", analise: "Curadoria e posicionamento escassos no mercado convencional da cidade." },
        { letra: "I", nome: "Imitabilidade", analise: "Barreira de defesa sustentada por marca autoral, relacionamento e experiência." },
        { letra: "O", nome: "Organização", analise: "Estrutura operacional enxuta para manter margem saudável durante o crescimento." }
      ],
      porter: [
        { forca: "Rivalidade entre Concorrentes", analise: "Disputa moderada com negócios tradicionais estabelecidos nos polos de SJC." },
        { forca: "Ameaça de Novos Entrantes", analise: "Barreiras baseadas em ponto comercial, capital de giro e fidelização de marca." },
        { forca: "Produtos Substitutos", analise: "Pressão de e-commerces consolidados e evasão frequente para São Paulo (66.2%)." },
        { forca: "Barganha dos Fornecedores", analise: "Dependência de fornecedores de qualidade com prazos e custos logísticos viáveis." },
        { forca: "Barganha dos Clientes", analise: "Sensibilidade a preço acentuada (33.1% apontam custo alto como barreira)." }
      ]
    },

    mix_marketing: mod3.mix_marketing || {
      cinco_ps: [
        { p: "Produto", analise: "Mix assertivo focado em itens de entrada com giro e itens de alta margem." },
        { p: "Preço", analise: "Precificação compatível com a renda familiar alvo sem perder percepção de valor." },
        { p: "Praça", analise: "Localização estratégica no vetor Centro-Oeste ou canal digital ágil." },
        { p: "Promoção", analise: "Foco no Instagram (61.8%) e ativações comunitárias locais." },
        { p: "Pessoas", analise: "Treinamento consultivo para atendimento acolhedor e resolutivo." }
      ],
      oceano_azul: {
        eliminar: "Custos fixos supérfluos e atritos burocráticos que não geram valor percebido.",
        reduzir: "Desperdícios e dependência de modelos genéricos não adaptados a SJC.",
        elevar: "Consistência no atendimento, curadoria de produtos e agilidade de entrega.",
        criar: "Experiências exclusivas e conexão autêntica com o estilo de vida de SJC."
      }
    },

    movimentos_culturais: {
      analise_cards: mod4.movimentos_culturais?.analise_cards || {
        geografia_silencio: "Público em busca de refúgio, discrição, áreas verdes e calmaria do estresse corporativo (Urbanova/Adyana).",
        cidade_prometida: "Famílias tradicionais e engenheiros que valorizam estabilidade, tecnologia e credibilidade institucional (Zona Sul/Colinas).",
        tribo_global: "Público cosmopolita, criativos e early adopters exigentes em design e gastronomia autoral (Aquarius/Vila Ema).",
        empreendedorismo_intuitivo: "Economia real dos bairros, prestadores de serviço e pragmatismo econômico (Zona Sul/Leste/Norte)."
      },
      veredicto_final: movFinal
    },

    // Gráfico de Barreiras Auditado
    grafico_validacao: {
      titulo: "BARREIRAS DE CONSUMO E ATRITOS LOCAIS (SJC N=477)",
      type: "bar",
      labels: ["Preço Alto", "Falta Lugar Legal", "Insegurança", "Sem Dificuldade", "Transporte"],
      data: [33.1, 23.5, 20.5, 13.6, 7.1]
    },

    // 3 Gráficos Analíticos Selecionados Dinamicamente
    graficos_analiticos: graficosAnaliticosMontados,

    // 3 Verbalizações Selecionadas Dinamicamente
    verbalizacoes_reais: dynamicVerbatims,

    // Metadados Transparentes de Auditoria
    generation_debug: {
      idea_recebida: ideaText,
      modulos_executados: job.completed_steps || [],
      graficos_selecionados: selectedIds,
      movimento_escolhido: movFinal.nome_movimento,
      fonte_quantitativa: "Supabase (N=477) + IBGE Censo 2022",
      timestamp_geracao: new Date().toISOString()
    }
  };
}

// 7. HANDLER PRINCIPAL DA ROTA /api/consultor (STEP-DRIVEN)
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

      // Concurrency Lock Check (Anti-colisão de requisições simultâneas)
      const now = Date.now();
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

        const userPayloadStr = JSON.stringify({
          proposta_negocio: job.idea,
          contexto_pesquisa: {
            amostra_supabase: KNOWLEDGE_BASE.n_total,
            ibge_sjc: KNOWLEDGE_BASE.ibge_sjc_2022,
            quatro_movimentos: KNOWLEDGE_BASE.movimentos_culturais_studio8.map(m => ({ id: m.id, nome: m.nome, essencia: m.essencia }))
          },
          relatorio_auditar: job.report_to_audit ? job.report_to_audit.slice(0, 1500) : "Nenhum relatório externo informado."
        });

        try {
          if (!apiKey) {
            throw new Error("GROQ_API_KEY não configurada nas variáveis de ambiente.");
          }

          const stepResult = await callGroqStep(apiKey, stepDef.systemPrompt, userPayloadStr, 850);
          job.partial_results[stepDef.id] = stepResult;
          
          if (!job.completed_steps.includes(stepDef.id)) {
            job.completed_steps.push(stepDef.id);
          }
          job.current_step++;

          if (job.completed_steps.length >= MODULE_DEFINITIONS.length) {
            job.status = "completed";
            job.final_result = assembleFinalReport(job);
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
            job.status = "waiting_rate_limit";
            job.message = "Limite de taxa atingido. Aguardando liberação da janela Groq...";
            job.retryable = true;
            saveJob(job);
          } else {
            job.retry_count = (job.retry_count || 0) + 1;
            if (job.retry_count > 2) {
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
        datasetN: KNOWLEDGE_BASE.n_total
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
