// API Consultor Estratégico - Radar São José dos Campos (Microdados N=477)
// Otimizado para eficiência de tokens e validação matemática estrita no backend

// 1. SNAPSHOT COMPACTO DE MÉTRICAS OFICIAIS (N=477)
const DATASET_SNAPSHOT = {
  n: 477,
  metrics: {
    renda_familiar: {
      pergunta: "Qual a renda total da sua casa por mês?",
      categorias: [
        { nome: "Até R$ 2.800", n: 73, percentual: 15.3 },
        { nome: "R$ 2.801 a R$ 5.600", n: 161, percentual: 33.8 },
        { nome: "R$ 5.601 a R$ 12.000", n: 155, percentual: 32.5 },
        { nome: "R$ 12.001 a R$ 26.000", n: 67, percentual: 14.0 },
        { nome: "Acima de R$ 26.000", n: 21, percentual: 4.4 }
      ],
      alta_renda_acima_12k: { n: 88, percentual: 18.4 }
    },
    evasao_consumo: {
      pergunta: "Você costuma ir para outras cidades para passear ou comer fora?",
      categorias: [
        { nome: "Às vezes", n: 238, percentual: 49.9 },
        { nome: "Quase nunca", n: 129, percentual: 27.0 },
        { nome: "Sim, sempre", n: 78, percentual: 16.4 },
        { nome: "Nunca", n: 32, percentual: 6.7 }
      ],
      total_evadem: { nome: "Sempre ou às vezes", n: 316, percentual: 66.2 }
    },
    frequencia_saida: {
      pergunta: "Com que frequência você costuma sair para comer fora ou lazer?",
      categorias: [
        { nome: "2 ou 3 vezes por mês", n: 184, percentual: 38.6 },
        { nome: "1 vez ao mês", n: 115, percentual: 24.1 },
        { nome: "Toda semana", n: 105, percentual: 22.0 },
        { nome: "Quase nunca", n: 68, percentual: 14.3 },
        { nome: "Nunca", n: 5, percentual: 1.0 }
      ],
      regular: { nome: "Toda semana ou 2-3x mês", n: 289, percentual: 60.6 }
    },
    demanda_reprimida: {
      pergunta: "Gastaria mais dinheiro se a cidade tivesse melhores opções?",
      categorias: [
        { nome: "Sim", n: 332, percentual: 69.6 },
        { nome: "Não", n: 145, percentual: 30.4 }
      ]
    },
    regiao_frequentada: {
      pergunta: "Qual região da cidade você mais frequenta quando sai?",
      categorias: [
        { nome: "Centro / Oeste", n: 199, percentual: 41.7 },
        { nome: "Zona Sul", n: 135, percentual: 28.3 },
        { nome: "Todas as regiões", n: 57, percentual: 11.9 },
        { nome: "Zona Leste", n: 55, percentual: 11.5 },
        { nome: "Zona Norte", n: 31, percentual: 6.5 }
      ]
    },
    barreiras_noite: {
      pergunta: "Maior dificuldade quando decide sair à noite?",
      categorias: [
        { nome: "É tudo muito caro", n: 158, percentual: 33.1 },
        { nome: "Não tem lugar legal", n: 112, percentual: 23.5 },
        { nome: "Falta de segurança", n: 98, percentual: 20.5 },
        { nome: "Não vejo dificuldade", n: 65, percentual: 13.6 },
        { nome: "Transporte/ônibus", n: 34, percentual: 7.1 },
        { nome: "Trânsito", n: 10, percentual: 2.1 }
      ]
    },
    criterios_escolha: {
      pergunta: "O que mais leva em conta para escolher restaurante/bar?",
      categorias: [
        { nome: "Preço", n: 133, percentual: 27.9 },
        { nome: "Lugar bonito e agradável", n: 131, percentual: 27.5 },
        { nome: "Indicação de amigos/família", n: 98, percentual: 20.5 },
        { nome: "Notas no Google", n: 45, percentual: 9.4 },
        { nome: "Instagram ou TikTok", n: 42, percentual: 8.8 },
        { nome: "Perto de casa", n: 28, percentual: 5.9 }
      ]
    },
    estetica_instagramavel: {
      pergunta: "Escolheu lugar só porque é bonito para fotos e postar?",
      categorias: [
        { nome: "Não, não ligo", n: 308, percentual: 64.6 },
        { nome: "Um pouco", n: 131, percentual: 27.5 },
        { nome: "Sim, muito", n: 38, percentual: 8.0 }
      ]
    },
    redes_sociais: {
      pergunta: "Rede social mais usada para encontrar lugares?",
      categorias: [
        { nome: "Instagram", n: 295, percentual: 61.8 },
        { nome: "TikTok", n: 78, percentual: 16.4 },
        { nome: "YouTube", n: 66, percentual: 13.8 }
      ]
    },
    influenciadores: {
      pergunta: "Já foi a algum lugar por recomendação de influenciador?",
      categorias: [
        { nome: "Não", n: 332, percentual: 69.6 },
        { nome: "Sim", n: 145, percentual: 30.4 }
      ]
    },
    pets: {
      pergunta: "Tem animais de estimação? (N=475 válidos)",
      categorias: [
        { nome: "Sim", n: 251, percentual: 52.8 },
        { nome: "Não", n: 224, percentual: 47.2 }
      ]
    },
    orgulho_morar: {
      pergunta: "Sente orgulho de morar em SJC?",
      categorias: [
        { nome: "Sim", n: 354, percentual: 74.2 },
        { nome: "Não", n: 123, percentual: 25.8 }
      ]
    }
  }
};

const OFFICIAL_VERBATIMS = [
  {
    citacao: "Custo de vida de capital, com opções, salário e oportunidades de um interior... Coisas caras e sem qualidade.",
    genero: "Mulher", idade: "25-34 anos", regiao: "Zona Sul", renda: "R$ 5.6k - 12k"
  },
  {
    citacao: "Falta aconchego humano, vida nas ruas. Fora centro comercial, shopping e corredores, não há vida nas ruas de São José.",
    genero: "Mulher", idade: "65+ anos", regiao: "Centro-Oeste", renda: "R$ 5.6k - 12k"
  },
  {
    citacao: "Para lazer e cultura prefiro ir a São Paulo pois as opções aqui são limitadas e os eventos não são bem organizados.",
    genero: "Mulher", idade: "35-44 anos", regiao: "Centro-Oeste", renda: "R$ 12k - 26k"
  }
];

// 2. MONTAGEM E VALIDAÇÃO DOS GRÁFICOS NO BACKEND
function buildValidatedCharts() {
  const m = DATASET_SNAPSHOT.metrics;
  return {
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
        parecer_analitico: "Concentração no eixo Centro-Oeste (41.7%) e Zona Sul (28.3%), totalizando 70% da dinâmica urbana."
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
        parecer_analitico: "Evasão de 66.2% que sai frequentemente ou ocasionalmente para fora, sinalizando carência de opções locais."
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
    ]
  };
}

module.exports = async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Metodo nao permitido. Use POST.' });

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) { body = {}; }
    }
    body = body || {};

    const ideaInput = String(body.idea || body.user_input || body.question || body.prompt || '').trim();
    const reportToAudit = String(body.report_to_audit || body.presentation || '').trim();
    
    let combinedInput = ideaInput;
    if (!combinedInput && Array.isArray(body.messages) && body.messages.length > 0) {
      const lastUserMsg = [...body.messages].reverse().find(m => m && m.role === 'user' && m.content);
      combinedInput = lastUserMsg ? lastUserMsg.content : body.messages[body.messages.length - 1].content;
    }
    combinedInput = String(combinedInput || 'Consultoria de novos negócios em SJC').trim();

    // Limite de segurança no tamanho de entrada para evitar erro 413
    const MAX_INPUT_CHARS = 12000;
    if (combinedInput.length > MAX_INPUT_CHARS || reportToAudit.length > MAX_INPUT_CHARS) {
      return res.status(413).json({
        error: 'O texto enviado excede o limite seguro de caracteres para análise.',
        details: 'Limite: ' + MAX_INPUT_CHARS + ' caracteres.'
      });
    }

    const apiKey = (process.env.GROQ_API_KEY || '').trim();
    if (!apiKey) {
      return res.status(500).json({ 
        error: 'Chave GROQ_API_KEY nao configurada nas variaveis de ambiente da Vercel.'
      });
    }

    // Prompt de Sistema Enxuto e Rigoroso (baixo consumo de tokens)
    const systemPrompt = `Você é um analista sênior de dados e estratégia de negócios.

Analise a ideia de negócio do usuário e audite eventuais relatórios usando EXCLUSIVAMENTE o dataset_snapshot oficial (N=477).

ESCOPO:
Trabalhe somente na lógica analítica, validação dos dados e texto retornado. Não altere front-end, layout ou gráficos.

SNAPSHOT OFICIAL (FONTE ÚNICA DE NÚMEROS):
${JSON.stringify(DATASET_SNAPSHOT)}

REGRAS:
1. O dataset_snapshot é a única fonte de verdade para métricas.
2. Nunca copie porcentagens sem conferir no snapshot.
3. Se uma informação não existir no snapshot, trate como não verificável.
4. Trate movimentos culturais (Tribo Global, Cidade Prometida, Geografia do Silêncio, Empreendedorismo Intuitivo) e personas estritamente como HIPÓTESES ESTRATÉGICAS, nunca como fatos censitários.
5. Retorne EXCLUSIVAMENTE o JSON estruturado abaixo.

JSON ESPERADO:
{
  "visao_estrategica_texto": "Texto fluido e denso com a tese central em **negrito**, contextualizado na dor real do consumidor de SJC.",
  "bairros": [
    { "nome": "Jardim Aquarius", "regiao": "Centro-Oeste", "justificativa": "Fit com o polo Centro-Oeste (41.7%) e alta renda (18.4%)..." },
    { "nome": "Vila Ema", "regiao": "Centro-Oeste", "justificativa": "Análise analítica..." },
    { "nome": "Jardim Satélite", "regiao": "Zona Sul", "justificativa": "Fit com a Zona Sul (28.3%)..." },
    { "nome": "Vila Adyana", "regiao": "Centro-Oeste", "justificativa": "Análise analítica..." },
    { "nome": "Urbanova", "regiao": "Centro-Oeste", "justificativa": "Análise analítica..." }
  ],
  "zona_exclusao": "REGIÃO - Justificativa analítica dos riscos de formato ou ticket.",
  "swot": {
    "forcas": ["Força 1", "Força 2", "Força 3"],
    "fraquezas": ["Gargalo 1", "Gargalo 2", "Gargalo 3"],
    "oportunidades": ["Demanda reprimida (69.6%)", "Oportunidade 2", "Oportunidade 3"],
    "ameacas": ["Evasão (66.2%)", "Sensibilidade a preço (33.1%)", "Ameaça 3"]
  },
  "auditoria_ambiente": {
    "pestel": {
      "P": "Político...", "E": "Econômico...", "S": "Social...", "T": "Tecnológico...", "E_env": "Ambiental...", "L": "Legal..."
    },
    "ishikawa": {
      "problema_central": "Risco de Baixa Retenção do Consumidor Local em SJC",
      "causas": [
        { "categoria": "Pessoas", "descricao": "Falta de atendimento qualificado." },
        { "categoria": "Ambiente", "descricao": "Sensação de mesmice." },
        { "categoria": "Processos", "descricao": "Atritos de mobilidade e conveniência." },
        { "categoria": "Produto", "descricao": "Preço elevado sem valor percebido." }
      ]
    }
  },
  "matrizes_estrategicas": {
    "vrio": [
      { "letra": "V", "nome": "Valor", "analise": "Análise de valor..." },
      { "letra": "R", "nome": "Raridade", "analise": "Diferenciação local..." },
      { "letra": "I", "nome": "Imitabilidade", "analise": "Barreiras contra cópia..." },
      { "letra": "O", "nome": "Organização", "analise": "Capacidade operacional..." }
    ],
    "porter": [
      { "forca": "Rivalidade entre Concorrentes", "analise": "Concorrência no território..." },
      { "forca": "Ameaça de Novos Entrantes", "analise": "Barreiras de entrada..." },
      { "forca": "Produtos Substitutos", "analise": "Evasão para SP/Litoral (66.2%)..." },
      { "forca": "Barganha dos Fornecedores", "analise": "Prazos e custos..." },
      { "forca": "Barganha dos Clientes", "analise": "Sensibilidade a preço (33.1%)..." }
    ]
  },
  "mix_marketing": {
    "cinco_ps": [
      { "p": "Produto", "analise": "Mix e qualidade..." },
      { "p": "Preço", "analise": "Precificação..." },
      { "p": "Praça", "analise": "Canais e localização..." },
      { "p": "Promoção", "analise": "Instagram (61.8%)..." },
      { "p": "Pessoas", "analise": "Atendimento e hospitalidade..." }
    ],
    "oceano_azul": {
      "eliminar": "Custos supérfluos...", "reduzir": "Desperdícios...", "elevar": "Padrão de serviço...", "criar": "Diferenciais exclusivos..."
    }
  },
  "movimentos_culturais": {
    "analise_cards": {
      "geografia_silencio": "Hipótese sobre o público de refúgio (Urbanova/Adyana).",
      "cidade_prometida": "Hipótese sobre famílias tradicionais (Zona Sul/Colinas).",
      "tribo_global": "Hipótese sobre público tech (Aquarius/Vila Ema).",
      "empreendedorismo_intuitivo": "Hipótese sobre economia real de bairro."
    },
    "veredicto_final": {
      "nome_movimento": "A Tribo Global",
      "justificativa_densa": "[HIPÓTESE ESTRATÉGICA A VALIDAR] Explicação analítica do fit da proposta com o público de SJC."
    }
  }
}`;

    const userPromptText = JSON.stringify({
      ideia: combinedInput,
      relatorio_auditar: reportToAudit || "Nenhum relatório externo. Auditar a ideia com o snapshot.",
      instrucao: "Retorne EXCLUSIVAMENTE o JSON estruturado válido."
    });

    // Modelos prioritários leves e de alta taxa de tokens (ITPM)
    const candidateModels = [
      'llama-3.1-8b-instant',
      'qwen/qwen3.6-27b',
      'llama3-70b-8192',
      'mixtral-8x7b-32768'
    ];

    let replyContent = null;
    let modelUsed = null;
    const errorsList = [];

    for (const model of candidateModels) {
      try {
        const payload = {
          model: model,
          max_tokens: 3000,
          temperature: 0.2,
          response_format: { type: "json_object" },
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPromptText }
          ]
        };

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
            break;
          }
        } else {
          const errText = await response.text();
          const errorMsg = 'Groq Status ' + response.status + ' (' + model + '): ' + errText;
          errorsList.push(errorMsg);
          console.warn('[Consultor IA] Falha:', errorMsg);

          // Se for erro de tamanho (413) ou rate-limit de tokens (429), não dispara loop agressivo
          if (response.status === 413 || response.status === 429) {
            break;
          }
        }
      } catch (err) {
        const errorMsg = 'Exceção (' + model + '): ' + err.message;
        errorsList.push(errorMsg);
        console.warn('[Consultor IA] Exceção:', errorMsg);
      }
    }

    if (!replyContent) {
      return res.status(500).json({
        error: 'Erro na API da Groq: ' + (errorsList[0] || 'Nenhum modelo respondeu com sucesso.'),
        details: errorsList.join(' | ')
      });
    }

    // Parse Seguro do JSON
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

    // Injeção e Garantia Matemática das Métricas Auditadas no Backend
    const validatedCharts = buildValidatedCharts();
    if (jsonResult && typeof jsonResult === 'object') {
      jsonResult.grafico_validacao = validatedCharts.grafico_validacao;
      jsonResult.graficos_analiticos = validatedCharts.graficos_analiticos;
      jsonResult.verbalizacoes_reais = OFFICIAL_VERBATIMS;

      // Garantir rótulo de hipótese no veredicto
      if (jsonResult.movimentos_culturais && jsonResult.movimentos_culturais.veredicto_final) {
        let just = jsonResult.movimentos_culturais.veredicto_final.justificativa_densa || '';
        if (!just.toLowerCase().includes("hipótese") && !just.toLowerCase().includes("hipotese")) {
          jsonResult.movimentos_culturais.veredicto_final.justificativa_densa = "[HIPÓTESE ESTRATÉGICA A VALIDAR] " + just;
        }
      }
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
