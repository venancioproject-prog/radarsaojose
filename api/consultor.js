// API Consultor Estratégico - Arquitetura Step-Driven Execution & Rigor Estatístico
// Base Oficial de Microdados: Radar São José dos Campos (N=477, IC=95%, Erro ±4.49%)

const fs = require('fs');
const path = require('path');
const os = require('os');

// 1. DATASET SNAPSHOT OFICIAL E DEFINIÇÕES QUANTITATIVAS AUDITADAS (N=477)
const DATASET_SNAPSHOT = {
  n: 477,
  fonte: "Supabase",
  metrics: {
    renda_familiar: {
      pergunta: "Qual a renda total da sua casa por mês?",
      denominador: 477,
      fonte: "Supabase",
      categorias: [
        { nome: "Até R$ 2.800", n: 73, percentual: 15.3, formula: "73 / 477 * 100" },
        { nome: "R$ 2.801 a R$ 5.600", n: 161, percentual: 33.8, formula: "161 / 477 * 100" },
        { nome: "R$ 5.601 a R$ 12.000", n: 155, percentual: 32.5, formula: "155 / 477 * 100" },
        { nome: "R$ 12.001 a R$ 26.000", n: 67, percentual: 14.0, formula: "67 / 477 * 100" },
        { nome: "Acima de R$ 26.000", n: 21, percentual: 4.4, formula: "21 / 477 * 100" }
      ],
      alta_renda_acima_12k: { n: 88, percentual: 18.4, formula: "88 / 477 * 100", nota: "Refere-se à amostra total do município, não a bairros específicos isolados." }
    },
    evasao_consumo: {
      pergunta: "Você costuma ir para outras cidades para passear ou comer fora?",
      denominador: 477,
      fonte: "Supabase",
      categorias: [
        { nome: "Às vezes", n: 238, percentual: 49.9, formula: "238 / 477 * 100" },
        { nome: "Quase nunca", n: 129, percentual: 27.0, formula: "129 / 477 * 100" },
        { nome: "Sim, sempre", n: 78, percentual: 16.4, formula: "78 / 477 * 100" },
        { nome: "Nunca", n: 32, percentual: 6.7, formula: "32 / 477 * 100" }
      ],
      total_evadem: { nome: "Sempre ou às vezes", n: 316, percentual: 66.2, formula: "(238 + 78) / 477 * 100", escopo: "Mede evasão geral de lazer e gastronomia; não mede vestuário, moda praia ou outros produtos específicos." }
    },
    frequencia_saida: {
      pergunta: "Com que frequência você costuma sair para comer fora ou lazer?",
      denominador: 477,
      fonte: "Supabase",
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
      fonte: "Supabase",
      categorias: [
        { nome: "Sim", n: 332, percentual: 69.6, formula: "332 / 477 * 100" },
        { nome: "Não", n: 145, percentual: 30.4, formula: "145 / 477 * 100" }
      ]
    },
    regiao_frequentada: {
      pergunta: "Qual região da cidade você mais frequenta quando sai de casa?",
      denominador: 477,
      fonte: "Supabase",
      categorias: [
        { nome: "Centro / Oeste", n: 199, percentual: 41.7, formula: "199 / 477 * 100" },
        { nome: "Zona Sul", n: 135, percentual: 28.3, formula: "135 / 477 * 100" },
        { nome: "Todas as regiões igualmente", n: 57, percentual: 11.9, formula: "57 / 477 * 100" },
        { nome: "Zona Leste", n: 55, percentual: 11.5, formula: "55 / 477 * 100" },
        { nome: "Zona Norte", n: 31, percentual: 6.5, formula: "31 / 477 * 100" }
      ],
      nota: "Informa macrorregião mais frequentada. Não permite inferir diretamente dados de bairros individuais ou isolados."
    },
    barreiras_saida: {
      pergunta: "O que mais te desanima de sair à noite em São José dos Campos?",
      denominador: 477,
      fonte: "Supabase",
      categorias: [
        { nome: "Preços altos / Pouco custo-benefício", n: 158, percentual: 33.1, formula: "158 / 477 * 100" },
        { nome: "Falta de opções legais / Lugares parecidos", n: 112, percentual: 23.5, formula: "112 / 477 * 100" },
        { nome: "Sensação de insegurança", n: 98, percentual: 20.5, formula: "98 / 477 * 100" },
        { nome: "Não vejo dificuldade", n: 65, percentual: 13.6, formula: "65 / 477 * 100" },
        { nome: "Trânsito e transporte", n: 34, percentual: 7.1, formula: "34 / 477 * 100" },
        { nome: "Outros", n: 10, percentual: 2.1, formula: "10 / 477 * 100" }
      ]
    },
    redes_busca: {
      pergunta: "Qual rede social você mais usa para descobrir novos lugares ou eventos?",
      denominador: 477,
      fonte: "Supabase",
      categorias: [
        { nome: "Instagram", n: 295, percentual: 61.8, formula: "295 / 477 * 100" },
        { nome: "TikTok", n: 78, percentual: 16.4, formula: "78 / 477 * 100" },
        { nome: "YouTube", n: 66, percentual: 13.8, formula: "66 / 477 * 100" },
        { nome: "Google / Maps / Buscadores", n: 11, percentual: 2.3, formula: "11 / 477 * 100" },
        { nome: "Facebook", n: 10, percentual: 2.1, formula: "10 / 477 * 100" },
        { nome: "Não usa redes / Outros / Amigos", n: 17, percentual: 3.6, formula: "17 / 477 * 100" }
      ],
      soma_n: 477,
      escopo: "Mede rede para descoberta de locais/eventos; não mede compras de produtos específicos ou e-commerce."
    },
    influenciadores: {
      pergunta: "Já foi a algum lugar por recomendação de influenciador?",
      denominador: 477,
      fonte: "Supabase",
      categorias: [
        { nome: "Não", n: 332, percentual: 69.6, formula: "332 / 477 * 100" },
        { nome: "Sim", n: 145, percentual: 30.4, formula: "145 / 477 * 100" }
      ]
    },
    pets: {
      pergunta: "Você tem animais de estimação em casa? (N=475 válidos)",
      denominador: 475,
      fonte: "Supabase",
      categorias: [
        { nome: "Sim", n: 251, percentual: 52.8, formula: "251 / 475 * 100" },
        { nome: "Não", n: 224, percentual: 47.2, formula: "224 / 475 * 100" }
      ]
    },
    orgulho_morar: {
      pergunta: "Sente orgulho de morar em SJC?",
      denominador: 477,
      fonte: "Supabase",
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
async function callGroqStep(apiKey, systemPrompt, userContent, maxTokens = 750) {
  const model = "qwen/qwen3.6-27b";
  const payload = {
    model: model,
    max_tokens: maxTokens,
    temperature: 0.15,
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

// 3. DEFINIÇÃO RIGOROSA DOS MÓDULOS DE ANÁLISE POR NEGÓCIO
const MODULE_DEFINITIONS = [
  {
    stepIndex: 0,
    id: "visao_bairros",
    label: "Visão Estratégica, Limites da Base e Hipóteses Territoriais",
    message: "Analisando tese específica do negócio, dados disponíveis e lacunas da pesquisa...",
    systemPrompt: "Voce e um Analista de Dados e Estrategista Senior em Sao Jose dos Campos (SJC).\nBASE QUANTITATIVA OFICIAL (Supabase N=477):\n- Renda familiar total da amostra: 15.3% ate R$2.8k, 33.8% R$2.8k-5.6k, 32.5% R$5.6k-12k, 14.0% R$12k-26k, 4.4% >R$26k. Alta renda (>R$12k) = 18.4% na amostra geral.\n- Regiao mais frequentada: Centro-Oeste 41.7% (199/477), Zona Sul 28.3% (135/477), Leste 11.5%, Norte 6.5%, Todas igualmente 11.9%. (A base mede REGIOES, nao bairros isolados).\n- Evasao de lazer/gastronomia para fora de SJC: 66.2% (316/477 evadem sempre ou as vezes). (A base mede LAZER/COMER FORA, NAO mede roupas, biquinis, doces ou compras especificas).\n- Demanda reprimida geral: 69.6% (332/477 gastariam mais se houvesse melhores opcoes).\n- Barreira noturna: 33.1% preco/custo-beneficio, 23.5% falta de opcoes legais/mesmice.\n\nREGRAS ESTRITAS DE AUDITORIA:\n1. ANALISE ESPECIFICA DO NEGOCIO: Adapte 100% ao produto/servico recebido. Se for moda praia/biquinis, declare que a base NAO mede provador, modelagem, recorrencia, ticket de biquini ou intencao de compra de vestuario. Se for doces/gastronomia, analise a aplicabilidade direta com alimentacao fora do lar.\n2. LIMITES DA BASE: Declare explicitamente o que a pesquisa NAO mede para esse negocio especifico.\n3. BAIRROS E TERRITORIO: O Centro-Oeste teve 41.7% de frequencia na amostra total. Trate qualquer mencao a Jardim Aquarius, Vila Ema, Vila Adyana ou Urbanova como HIPOTESE de microterritorio a ser testada, SEM inventar renda isolada de bairro.\n4. RETORNE EXCLUSIVAMENTE UM JSON com esta estrutura:\n{\n  \"visao_estrategica_texto\": \"Texto denso e honesto para o negocio recebido. Comece destacando a proposta em **negrito**. Declare o que os dados mostram (contexto macro de SJC) e o que a pesquisa NAO mede para este nicho. Exponha a tese central e a necessidade de validacao primaria.\",\n  \"bairros\": [\n    { \"nome\": \"Jardim Aquarius\", \"regiao\": \"Centro-Oeste\", \"justificativa\": \"Hipotese territorial no vetor Centro-Oeste (41.7% de frequencia na amostra geral). Exige teste especifico para verificar fluxo e aderencia ao nicho.\" },\n    { \"nome\": \"Vila Ema\", \"regiao\": \"Centro-Oeste\", \"justificativa\": \"Polo comercial consolidado na regiao Centro-Oeste. Hipotese de visibilidade e compras de conveniencia a validar.\" },\n    { \"nome\": \"Jardim Satelite\", \"regiao\": \"Zona Sul\", \"justificativa\": \"Hipotese de insercao na Zona Sul (28.3% de frequencia), testando formato e elasticidade de preco.\" },\n    { \"nome\": \"Vila Adyana\", \"regiao\": \"Centro-Oeste\", \"justificativa\": \"Microterritorio com densidade de servicos e saude na regiao Centro-Oeste, demandando pesquisa de transito local.\" },\n    { \"nome\": \"Urbanova\", \"regiao\": \"Centro-Oeste\", \"justificativa\": \"Vetor residencial de expansao no Centro-Oeste, exigindo analise de conveniencia e atrito de deslocamento.\" }\n  ],\n  \"zona_exclusao\": \"Identificacao de regiao/formato de maior risco para o modelo operacional analisado (ex: locais de baixo fluxo sem validacao previa de ticket).\"\n}"
  },
  {
    stepIndex: 1,
    id: "swot_ambiente",
    label: "SWOT Específica, PESTEL e Causa-Raiz (Ishikawa)",
    message: "Construindo SWOT customizada, PESTEL e diagrama de causas para o negócio...",
    systemPrompt: "Voce e um Estrategista de Negocios em Sao Jose dos Campos.\nBASE QUANTITATIVA: N=477, Preco alto como barreira: 33.1%, Falta de opcoes/mesmice: 23.5%, Inseguranca: 20.5%, Demanda reprimida: 69.6%, Evasao de lazer: 66.2%, Instagram para descobrir locais: 61.8%, Posse de pets: 52.8% (N=475).\n\nREGRAS:\n1. Adapte TODAS as forcas, fraquezas, ameacas, PESTEL e Ishikawa ESPECIFICAMENTE para a ideia de negocio do usuario. NUNCA use itens genericos de template.\n2. Diferencie claramente: Fatos observados na pesquisa (lazer/renda macro) vs Hipoteses especificas da categoria analisada.\n3. RETORNE EXCLUSIVAMENTE UM JSON com esta estrutura:\n{\n  \"swot\": {\n    \"forcas\": [\"Forca interna especifica 1 para este negocio\", \"Forca 2\", \"Forca 3\"],\n    \"fraquezas\": [\"Gargalo/vulnerabilidade especifica 1 (ex: sazonalidade, custos, provador, escala)\", \"Gargalo 2\", \"Gargalo 3\"],\n    \"oportunidades\": [\"Oportunidade especifica contextualizada com dados de SJC\", \"Oportunidade 2\", \"Oportunidade 3\"],\n    \"ameacas\": [\"Ameaca competitiva/macro (ex: sensibilidade a preco 33.1%, e-commerce)\", \"Ameaca 2\", \"Ameaca 3\"]\n  },\n  \"pestel\": {\n    \"P\": \"Fator Politico/Regulatorio relevante para o tipo de negocio em SJC...\",\n    \"E\": \"Fator Economico (faixas de renda macro e sensibilidade de ticket do setor)...\",\n    \"S\": \"Fator Social/Cultural (habitos de consumo e estilo de vida joseense relacionados ao produto)...\",\n    \"T\": \"Fator Tecnologico (canais de divulgacao como Instagram 61.8% e ferramentas de venda)...\",\n    \"E_env\": \"Fator Ambiental (espacos, sustentabilidade, clima ou pets 52.8% se aplicavel)...\",\n    \"L\": \"Fator Legal (alvaras, compliance e zoneamento de SJC)...\"\n  },\n  \"ishikawa\": {\n    \"problema_central\": \"Defina o principal risco de fracasso ou atrito de mercado especifico para este negocio em SJC\",\n    \"causas\": [\n      { \"categoria\": \"Pessoas & Atendimento\", \"descricao\": \"Causa de atrito no atendimento especifico do nicho.\" },\n      { \"categoria\": \"Ambiente & Experiencia\", \"descricao\": \"Causa relacionada ao ponto, ambientacao ou provador/espaco.\" },\n      { \"categoria\": \"Processos & Operacao\", \"descricao\": \"Causa operacional, gestao de estoque, fornecedores ou logistica.\" },\n      { \"categoria\": \"Produto & Precificacao\", \"descricao\": \"Causa relacionada a percepcao de preco ('coisas caras e sem qualidade') ou mix.\" }\n    ]\n  }\n}"
  },
  {
    stepIndex: 2,
    id: "matrizes_mix",
    label: "Matrizes VRIO, Porter, 5 Ps e Oceano Azul Customizados",
    message: "Calculando diferenciais competitivos, forças de mercado e testes de validação...",
    systemPrompt: "Voce e um Estrategista de Posicionamento e Marketing em SJC.\nCONTEXTO: N=477. Evasao geral 66.2%, Sensibilidade a preco 33.1%, Instagram para descoberta 61.8%.\n\nREGRAS:\n1. Adapte o framework VRIO, 5 Forcas de Porter, 5 Ps e Matriz Oceano Azul estritamente para o negocio do usuario.\n2. Inclua analises concretas de produto, canais e barreiras de entrada reais do setor.\n3. RETORNE EXCLUSIVAMENTE UM JSON com esta estrutura:\n{\n  \"matrizes_estrategicas\": {\n    \"vrio\": [\n      { \"letra\": \"V\", \"nome\": \"Valor\", \"analise\": \"Como este negocio especifico cria valor percebido para o publico de SJC.\" },\n      { \"letra\": \"R\", \"nome\": \"Raridade\", \"analise\": \"O que e realmente escasso ou diferenciado na proposta frente aos concorrentes locais.\" },\n      { \"letra\": \"I\", \"nome\": \"Imitabilidade\", \"analise\": \"Barreiras reais contra copia de concorrentes (marca, curadoria, servico autoral).\" },\n      { \"letra\": \"O\", \"nome\": \"Organizacao\", \"analise\": \"Capacidade de processos e gestao para sustentar a entrega sem queimar margem.\" }\n    ],\n    \"porter\": [\n      { \"forca\": \"Rivalidade entre Concorrentes\", \"analise\": \"Intensidade da concorrencia direta e indireta no segmento em SJC.\" },\n      { \"forca\": \"Ameaca de Novos Entrantes\", \"analise\": \"Barreiras de entrada do nicho (ponto, capital inicial, fidelizacao).\" },\n      { \"forca\": \"Produtos Substitutos\", \"analise\": \"Alternativas de compra (compras em SP/Litoral ou grandes e-commerces/fast fashion).\" },\n      { \"forca\": \"Barganha dos Fornecedores\", \"analise\": \"Dependencia de confeccoes/marcas ou fabricantes e custos de frete.\" },\n      { \"forca\": \"Barganha dos Clientes\", \"analise\": \"Sensibilidade do consumidor joseense a preco (33.1% citam custo alto como barreira).\" }\n    ]\n  },\n  \"mix_marketing\": {\n    \"cinco_ps\": [\n      { \"p\": \"Produto\", \"analise\": \"Definicao do mix, curadoria e proposta de valor tangivel do negocio.\" },\n      { \"p\": \"Preco\", \"analise\": \"Estrategia de precificacao e elasticidade de margem frente a renda familiar de SJC.\" },\n      { \"p\": \"Praca\", \"analise\": \"Canais fisicos e digitais para distribuicao e alcance no municipio.\" },\n      { \"p\": \"Promocao\", \"analise\": \"Estrategia de comunicacao priorizando canais aderentes (Instagram 61.8% para descoberta de marcas).\" },\n      { \"p\": \"Pessoas\", \"analise\": \"Perfil e treinamento da equipe para consultoria, acolhimento e retencao.\" }\n    ],\n    \"oceano_azul\": {\n      \"eliminar\": \"Atritos ou praticas tradicionais do setor que elevam custos sem gerar valor.\",\n      \"reduzir\": \"Complexidades de estoque ou dependencias nao essenciais no modelo inicial.\",\n      \"elevar\": \"Nivel de personalizacao, curadoria, transparencia ou experiencia do cliente.\",\n      \"criar\": \"Diferenciais exclusivos nao encontrados nas opcoes padronizadas de SJC.\"\n    }\n  }\n}"
  },
  {
    stepIndex: 3,
    id: "movimentos_testes",
    label: "Lentes Culturais Hipotéticas e Testes de Validação Obrigatórios",
    message: "Mapeando lentes comportamentais como hipóteses e estruturando testes de mercado...",
    systemPrompt: "Voce e um Especialista em Validacao de Mercado e Antropologia de Consumo em SJC.\nCONTEXTO: N=477. A pesquisa NÃO contem variaveis psicograficas para comprovar movimentos culturais de forma definitiva.\n\nREGRAS OBRIGATORIAS:\n1. MOVIMENTO VENCEDOR: Declare explicitamente que NAO e possivel eleger um movimento cultural vencedor com base nos dados disponiveis, pois a base mede mobilidade, frequencia e renda geral, nao estilos de vida fechados. Apresente as conexoes apenas como HIPOTESES conceituais.\n2. Nomeie o movimento mais compativel como Hipotese Conceitual sugerida para teste.\n3. TESTES DE VALIDACAO ESPECIFICOS: Liste perguntas e testes praticos indispensaveis para o empreendedor validar o produto especifico antes de investir.\n4. RETORNE EXCLUSIVAMENTE UM JSON com esta estrutura:\n{\n  \"movimentos_culturais\": {\n    \"analise_cards\": {\n      \"geografia_silencio\": \"Hipotese conceitual: Publico focado em calma, desconexao e servicos de bem-estar (Urbanova/Adyana).\",\n      \"cidade_prometida\": \"Hipotese conceitual: Familias tradicionais com foco em seguranca e conveniencia (Zona Sul/Colinas).\",\n      \"tribo_global\": \"Hipotese conceitual: Publico cosmopolita e conectado a tendencias (Aquarius/Vila Ema).\",\n      \"empreendedorismo_intuitivo\": \"Hipotese conceitual: Demanda por utilidade pratica e economia real dos bairros.\"\n    },\n    \"veredicto_final\": {\n      \"nome_movimento\": \"Hipótese Conceitual de Segmentação (Exige Validação)\",\n      \"justificativa_densa\": \"A base quantitativa disponivel nao possui variaveis suficientes para eleger um movimento vencedor comprovado. Como hipotese estrategica para teste, a proposta pode dialogar com o perfil cosmopolita ou familiar de SJC, mas requer validacao primaria de intencao de compra e elasticidade de preco antes de qualquer aporte relevante de capital.\"\n    }\n  },\n  \"validacao_obrigatoria\": {\n    \"dados_ausentes_na_pesquisa\": [\n      \"Intencao direta de compra do produto ou servico especifico\",\n      \"Frequencia e ticket medio habitual da categoria analisada\",\n      \"Preferencia de canal de compra (loja fisica de rua, shopping, e-commerce, WhatsApp)\",\n      \"Atributos determinantes de escolha (marca, sustentabilidade, provador, atendimento, preco)\"\n    ],\n    \"perguntas_pesquisa_primaria\": [\n      \"Com que frequencia voce consome ou compra produtos desta categoria?\",\n      \"Onde voce costuma comprar atualmente (em SJC, em SP/Litoral ou online)?\",\n      \"Qual faixa de preco media voce considera justa para este produto?\",\n      \"Quais atributos sao eliminatorios na sua decisao de compra?\",\n      \"Qual a probabilidade de voce visitar uma nova operacao desta no vetor Centro-Oeste nos proximos 90 dias?\"\n    ]\n  }\n}"
  }
];

function assembleFinalReport(job) {
  const p = job.partial_results || {};
  const mod1 = p.visao_bairros || {};
  const mod2 = p.swot_ambiente || {};
  const mod3 = p.matrizes_mix || {};
  const mod4 = p.movimentos_testes || {};

  const ideaText = job.idea || "Negócio em São José dos Campos";

  return {
    visao_estrategica_texto: mod1.visao_estrategica_texto || ("A proposta **" + ideaText + "** precisa ser avaliada sob a ótica dos microdados do Radar SJC (N=477). A base aponta 41,7% de frequência na região Centro-Oeste e 66,2% de evasão em lazer/gastronomia para fora da cidade. Contudo, a pesquisa não mede diretamente a intenção de compra ou ticket específico para esta categoria, tornando mandatório o teste de hipóteses de público e precificação antes da imobilização de capital."),
    
    bairros: (Array.isArray(mod1.bairros) && mod1.bairros.length > 0) ? mod1.bairros : [
      { nome: "Jardim Aquarius", regiao: "Centro-Oeste", justificativa: "Hipótese territorial no vetor Centro-Oeste (41,7% de frequência na amostra geral). Requer validação primária de fluxo e público-alvo." },
      { nome: "Vila Ema", regiao: "Centro-Oeste", justificativa: "Polo de compras e serviços na região Centro-Oeste. Hipótese de visibilidade e conveniência a testar." },
      { nome: "Jardim Satélite", regiao: "Zona Sul", justificativa: "Hipótese de aderência na Zona Sul (28,3% de frequência na amostra), avaliando sensibilidade a preço." },
      { nome: "Vila Adyana", regiao: "Centro-Oeste", justificativa: "Microterritório com fluxo de serviços no Centro-Oeste, demandando pesquisa de tráfego local." },
      { nome: "Urbanova", regiao: "Centro-Oeste", justificativa: "Vetor residencial de expansão no Centro-Oeste, demandando análise de atrito de deslocamento." }
    ],

    zona_exclusao: mod1.zona_exclusao || "ZONAS DE BAIXA DENSIDADE COMERCIAL / PONTOS SEM FLUXO QUALIFICADO - Evitar locações sem validação prévia de público-alvo ou onde o custo de aquisição de clientes (CAC) exceda a margem do produto.",

    swot: mod2.swot || {
      forcas: ["Proposta direcionada a uma dor de nicho identificada", "Flexibilidade operacional no modelo inicial", "Canal de relacionamento direto"],
      fraquezas: ["Falta de dados primários sobre intenção de compra do produto", "Custos fixos de ocupação", "Vulnerabilidade a sazonalidade e gestão de estoque"],
      oportunidades: ["Demanda reprimida geral em SJC (69,6% gastariam mais com melhores opções)", "Construção de marca autoral com apelo local", "Uso estratégico de canais digitais"],
      ameacas: ["Sensibilidade a preço da população (33,1% apontam custo alto como barreira)", "Concorrência com grandes redes consolidadas e e-commerce", "Evasão de consumo para capitais"]
    },

    auditoria_ambiente: {
      pestel: mod2.pestel || {
        P: "Ambiente municipal favorável ao empreendedorismo, exigindo conformidade de licenciamento e alvarás.",
        E: "Predomínio de classes médias (66,3% entre R$ 2.8k e R$ 12k) e 18,4% de alta renda (> R$ 12k) na amostra total.",
        S: "Busca por experiências qualificadas e atendimento personalizado frente à percepção de mesmice na cidade.",
        T: "Instagram como canal preponderante de descoberta de novos locais e marcas (61,8% dos respondentes).",
        E_env: "Valorização de práticas sustentáveis e conformidade com o perfil urbano da cidade.",
        L: "Atenção estrita às leis de zoneamento urbano, código de posturas e direitos do consumidor."
      },
      ishikawa: mod2.ishikawa || {
        problema_central: "Risco de Inviabilidade Operacional ou Baixa Retenção do Consumidor para a Proposta em SJC",
        causas: [
          { categoria: "Pessoas & Atendimento", descricao: "Falta de consultoria especializada e atendimento com baixa resolução." },
          { categoria: "Ambiente & Experiência", descricao: "Ponto comercial inadequado, atrito de acesso ou falta de comodidade." },
          { categoria: "Processos & Operação", descricao: "Gargalos de fornecimento, controle de estoque ou prazos de entrega." },
          { categoria: "Produto & Precificação", descricao: "Preço descalibrado em relação ao valor percebido ('coisas caras e sem qualidade')." }
        ]
      }
    },

    matrizes_estrategicas: mod3.matrizes_estrategicas || {
      vrio: [
        { letra: "V", nome: "Valor", analise: "Criação de valor através de curadoria e resolução de atritos específicos do consumidor em SJC." },
        { letra: "R", nome: "Raridade", analise: "Diferenciação real frente a opções padronizadas ou genéricas do mercado." },
        { letra: "I", nome: "Imitabilidade", analise: "Barreira competitiva sustentada por curadoria autoral, marca e relacionamento comunitário." },
        { letra: "O", nome: "Organização", analise: "Estrutura operacional enxuta para manter margem saudável durante a fase de validação." }
      ],
      porter: [
        { forca: "Rivalidade entre Concorrentes", analise: "Concorrência com lojas tradicionais e redes estabelecidas nos polos comerciais de SJC." },
        { forca: "Ameaça de Novos Entrantes", analise: "Barreiras moderadas baseadas em capital de giro, ponto e fidelização de clientes." },
        { forca: "Produtos Substitutos", analise: "Pressão de e-commerces nacionais e viagens para compras em grandes centros (SP/Litoral)." },
        { forca: "Barganha dos Fornecedores", analise: "Dependência de fornecedores de qualidade com prazos e custos logísticos equilibrados." },
        { forca: "Barganha dos Clientes", analise: "Sensibilidade a preço acentuada (33,1% citam preço alto como barreira de consumo)." }
      ]
    },

    mix_marketing: mod3.mix_marketing || {
      cinco_ps: [
        { p: "Produto", analise: "Curadoria assertiva alinhada às necessidades específicas do público-alvo testado." },
        { p: "Preço", analise: "Precificação transparente e calibrada com a percepção de custo-benefício." },
        { p: "Praça", analise: "Localização estratégica no vetor Centro-Oeste ou canal digital com atendimento ágil." },
        { p: "Promoção", analise: "Comunicação focada no Instagram (61,8% de preferência para descoberta) e prova social." },
        { p: "Pessoas", analise: "Equipe com atendimento consultivo e foco em retenção e recompra." }
      ],
      oceano_azul: {
        eliminar: "Custos fixos desnecessários e atritos de atendimento no processo de compra.",
        reduzir: "Dependência de estoques excessivos antes de validar giro e demanda.",
        elevar: "Padrão de curadoria, agilidade de resposta e conveniência do cliente.",
        criar: "Experiência de compra consultiva e conexão autêntica com o consumidor local."
      }
    },

    movimentos_culturais: mod4.movimentos_culturais || {
      analise_cards: {
        geografia_silencio: "Hipótese: público que valoriza calmaria, discrição e atendimento acolhedor (Urbanova/Adyana).",
        cidade_prometida: "Hipótese: famílias que buscam segurança, conveniência e marcas consolidadas (Zona Sul/Colinas).",
        tribo_global: "Hipótese: público cosmopolita exigente em design e tendências atuais (Aquarius/Vila Ema).",
        empreendedorismo_intuitivo: "Hipótese: economia prática e serviços de conveniência no cotidiano do bairro."
      },
      veredicto_final: {
        nome_movimento: "Hipótese Conceitual de Segmentação (Exige Validação)",
        justificativa_densa: "Não é possível eleger um movimento cultural vencedor comprovado com os microdados da pesquisa, pois a base mede mobilidade e comportamento geral, não estilos de vida fechados. Qualquer classificação deve ser tratada como hipótese conceitual e validada por meio de pesquisa primária de intenção de compra."
      }
    },

    // INJEÇÃO DETERMINÍSTICA DOS GRÁFICOS AUDITADOS (100% EXATOS DA BASE SUPABASE N=477)
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
        pergunta_origem: "Qual região da cidade você mais frequenta quando sai de casa? (N=477 - Supabase)",
        parecer_analitico: "O Centro-Oeste foi a região mais frequentada na amostra (199 de 477 respostas, ou 41,7%), seguido pela Zona Sul (28,3%). Esse resultado apoia a priorização de testes na região, mas não permite concluir isoladamente a demanda de cada bairro sem pesquisa primária."
      },
      {
        chart_data: {
          type: "doughnut",
          title: "Evasão de Consumo de Lazer e Gastronomia",
          labels: ["Evadem para SP/Litoral", "Consomem em SJC"],
          data: [66.2, 33.8],
          highlight_color: "#D97706"
        },
        pergunta_origem: "Você costuma ir para outras cidades para passear ou comer fora? (N=477 - Supabase)",
        parecer_analitico: "66,2% dos respondentes (316/477) declararam sair sempre ou às vezes para outras cidades para passear ou comer fora. Este dado indica mobilidade geral de lazer, mas não mede demanda específica por compras ou produtos de nicho, devendo ser tratado como contexto geral."
      },
      {
        chart_data: {
          type: "bar",
          title: "Distribuição de Renda Familiar por Faixa",
          labels: ["Até R$ 2.8k", "R$ 2.8k-5.6k", "R$ 5.6k-12k", "R$ 12k-26k", "Acima R$ 26k"],
          data: [15.3, 33.8, 32.5, 14.0, 4.4],
          highlight_label: "R$ 5.6k-12k"
        },
        pergunta_origem: "Qual a renda total da sua casa por mês? (N=477 - Supabase)",
        parecer_analitico: "Classes médias totalizam 66,3% da amostra municipal (R$ 2.8k a 12k) e alta renda (> R$ 12k) representa 18,4% no total de SJC. Este percentual é da amostra global e não pode ser atribuído a um bairro isolado sem cruzamento estatístico específico."
      }
    ],

    verbalizacoes_reais: OFFICIAL_VERBATIMS,

    // METADADOS DE AUDITORIA E DEBUG DA GERAÇÃO
    generation_debug: {
      idea_recebida: ideaText,
      modulos_executados: job.completed_steps || [],
      modulos_com_fallback: (job.completed_steps || []).filter(s => !job.partial_results[s] || Object.keys(job.partial_results[s]).length === 0),
      metricas_consultadas: [
        { indicador: "renda_familiar", n: 477, percentual: 18.4, aplicabilidade: "contextual", explicacao: "Renda da amostra total municipal; não isola renda por bairro." },
        { indicador: "regiao_frequentada", n: 477, percentual: 41.7, aplicabilidade: "contextual", explicacao: "Frequência no Centro-Oeste; não comprova demanda de bairro." },
        { indicador: "evasao_consumo", n: 477, percentual: 66.2, aplicabilidade: "indireta", explicacao: "Mede evasão em passeios e comer fora; não mede compras de produtos específicos." },
        { indicador: "redes_busca", n: 477, percentual: 61.8, aplicabilidade: "indireta", explicacao: "Mede descoberta de locais/eventos via Instagram." }
      ],
      fonte_quantitativa: "Supabase",
      timestamp_geracao: new Date().toISOString()
    }
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

          const stepResult = await callGroqStep(apiKey, stepDef.systemPrompt, userPayloadStr, 750);
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
              // Injeta objeto vazio para não quebrar o fluxo
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
