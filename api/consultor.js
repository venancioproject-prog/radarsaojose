// API Consultor Estratégico - Radar SJC (Modelo: Qwen 3.6 27B)
// Dados estritamente agregados (N=477) - Payload ultra-enxuto (< 2.000 tokens)

const DATA_SUMMARY = {
  n: 477,
  renda: "Até 2.8k (15.3%), 2.8k-5.6k (33.8%), 5.6k-12k (32.5%), 12k-26k (14.0%), >26k (4.4%). Alta renda >12k: 18.4%",
  evasao: "Evadem p/ SP/Litoral: 66.2% (Às vezes 49.9%, Sempre 16.4%, Quase nunca 27.0%, Nunca 6.7%)",
  frequencia: "Saída regular: 60.6% (2-3x/mês 38.6%, Semanal 22.0%, Mensal 24.1%, Quase nunca 15.3%)",
  demanda_reprimida: "Gastariam mais se houvesse opções melhores: 69.6% Sim, 30.4% Não",
  regioes: "Centro-Oeste 41.7%, Zona Sul 28.3%, Todas 11.9%, Leste 11.5%, Norte 6.5%",
  barreiras_noite: "Tudo muito caro 33.1%, Falta lugar legal 23.5%, Insegurança 20.5%, Sem dificuldade 13.6%, Transporte 7.1%",
  criterios: "Preço 27.9%, Lugar bonito/agradável 27.5%, Indicação 20.5%, Google 9.4%, Redes 8.8%, Proximidade 5.9%",
  instagramavel: "Não liga 64.6%, Um pouco 27.5%, Muito 8.0%",
  redes_busca: "Instagram 61.8%, TikTok 16.4%, YouTube 13.8%",
  influenciadores: "Já foi por indicação: Não 69.6%, Sim 30.4%",
  pets: "Possui pet: 52.8% (N=475)",
  orgulho: "Orgulho de SJC: 74.2% Sim"
};

const OFFICIAL_VERBATIMS = [
  { citacao: "Custo de vida de capital com opções de interior... Coisas caras e sem qualidade.", genero: "Mulher", idade: "25-34 anos", regiao: "Zona Sul", renda: "R$ 5.6k - 12k" },
  { citacao: "Falta aconchego humano e vida nas ruas fora dos shoppings e corredores.", genero: "Mulher", idade: "65+ anos", regiao: "Centro-Oeste", renda: "R$ 5.6k - 12k" },
  { citacao: "Para lazer e cultura prefiro ir a São Paulo pois as opções aqui são limitadas.", genero: "Mulher", idade: "35-44 anos", regiao: "Centro-Oeste", renda: "R$ 12k - 26k" }
];

module.exports = async function handler(req, res) {
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

    let inputContent = String(body.idea || body.user_input || body.question || body.prompt || '').trim();
    if (!inputContent && Array.isArray(body.messages) && body.messages.length > 0) {
      const lastUserMsg = [...body.messages].reverse().find(m => m && m.role === 'user' && m.content);
      inputContent = lastUserMsg ? lastUserMsg.content : body.messages[body.messages.length - 1].content;
    }
    inputContent = String(inputContent || 'Consultoria de novos negócios em SJC').trim().slice(0, 4000);

    const apiKey = (process.env.GROQ_API_KEY || '').trim();
    if (!apiKey) {
      return res.status(500).json({ error: 'GROQ_API_KEY nao configurada na Vercel.' });
    }

    const systemPrompt = `Você é um consultor e estrategista sênior de negócios em São José dos Campos.

Analise a ideia do usuário usando estritamente o resumo estatístico oficial (N=477):
${JSON.stringify(DATA_SUMMARY)}

REGRAS CRÍTICAS:
1. Fonte única de dados é o DATA_SUMMARY acima.
2. Trate os movimentos culturais (Tribo Global, Cidade Prometida, Geografia do Silêncio, Empreendedorismo Intuitivo) e personas estritamente como HIPÓTESES ESTRATÉGICAS.
3. Não altere front-end, layout ou elementos visuais.
4. Retorne a resposta estritamente em formato JSON válido. Não inclua nenhum texto adicional fora do JSON.

JSON ESPERADO:
{
  "visao_estrategica_texto": "Texto denso e fluido com a tese central em **negrito**, abordando a dor real do consumidor de SJC.",
  "bairros": [
    { "nome": "Jardim Aquarius", "regiao": "Centro-Oeste", "justificativa": "Fit com Centro-Oeste (41.7%) e alta renda (18.4%)..." },
    { "nome": "Vila Ema", "regiao": "Centro-Oeste", "justificativa": "Fit com polo gastronômico e cultural..." },
    { "nome": "Jardim Satélite", "regiao": "Zona Sul", "justificativa": "Fit com Zona Sul (28.3%)..." },
    { "nome": "Vila Adyana", "regiao": "Centro-Oeste", "justificativa": "Fit com público maduro e serviços..." },
    { "nome": "Urbanova", "regiao": "Centro-Oeste", "justificativa": "Fit com público familiar de alta renda..." }
  ],
  "zona_exclusao": "REGIÃO - Análise dos riscos de ticket ou formato sem validação prévia.",
  "swot": {
    "forcas": ["Força 1", "Força 2", "Força 3"],
    "fraquezas": ["Gargalo 1", "Gargalo 2", "Gargalo 3"],
    "oportunidades": ["Demanda reprimida (69.6%)", "Oportunidade 2", "Oportunidade 3"],
    "ameacas": ["Evasão (66.2%)", "Sensibilidade a preço (33.1%)", "Ameaça 3"]
  },
  "auditoria_ambiente": {
    "pestel": {
      "P": "Político...", "E": "Econômico (Rendas médias e alta renda)...", "S": "Social (Comportamento e evasão)...", "T": "Tecnológico (Instagram 61.8%)...", "E_env": "Ambiental (Pet 52.8%)...", "L": "Legal e zoneamento..."
    },
    "ishikawa": {
      "problema_central": "Risco de Baixa Retenção do Consumidor Local em SJC",
      "causas": [
        { "categoria": "Pessoas", "descricao": "Falta de hospitalidade e treinamento." },
        { "categoria": "Ambiente", "descricao": "Sensação de mesmice noturna." },
        { "categoria": "Processos", "descricao": "Atritos de conveniência e mobilidade." },
        { "categoria": "Produto", "descricao": "Preço alto sem valor percebido correspondente." }
      ]
    }
  },
  "matrizes_estrategicas": {
    "vrio": [
      { "letra": "V", "nome": "Valor", "analise": "Como cria valor..." },
      { "letra": "R", "nome": "Raridade", "analise": "Diferenciação local..." },
      { "letra": "I", "nome": "Imitabilidade", "analise": "Barreiras contra cópia..." },
      { "letra": "O", "nome": "Organização", "analise": "Capacidade de entrega..." }
    ],
    "porter": [
      { "forca": "Rivalidade entre Concorrentes", "analise": "Concorrência no território..." },
      { "forca": "Ameaça de Novos Entrantes", "analise": "Barreiras de entrada..." },
      { "forca": "Produtos Substitutos", "analise": "Evasão para SP/Litoral (66.2%)..." },
      { "forca": "Barganha dos Fornecedores", "analise": "Custos e prazos..." },
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
      "tribo_global": "Hipótese sobre público cosmopolita (Aquarius/Vila Ema).",
      "empreendedorismo_intuitivo": "Hipótese sobre economia real de bairro."
    },
    "veredicto_final": {
      "nome_movimento": "A Tribo Global",
      "justificativa_densa": "[HIPÓTESE ESTRATÉGICA A VALIDAR] Explicação analítica do fit da proposta com o público de SJC."
    }
  }
}`;

    const userPromptText = JSON.stringify({
      ideia_negocio: inputContent,
      instrucao: "Retorne a resposta estritamente em formato JSON válido."
    });

    // TRAVADO EXCLUSIVAMENTE NA LINHA QWEN (SEM LLAMA LEGADO)
    const qwenModels = [
      'qwen/qwen3.6-27b',
      'qwen/qwen3.8-27b'
    ];

    let replyContent = null;
    let modelUsed = null;
    let lastError = null;

    for (const model of qwenModels) {
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
          lastError = 'Groq Status ' + response.status + ' (' + model + '): ' + errText;
          console.warn('[Consultor IA]', lastError);
          if (response.status === 413 || response.status === 429) {
            break;
          }
        }
      } catch (err) {
        lastError = 'Exceção (' + model + '): ' + err.message;
        console.warn('[Consultor IA]', lastError);
      }
    }

    if (!replyContent) {
      return res.status(500).json({
        error: 'Erro na API da Groq: ' + (lastError || 'Falha ao conectar com o modelo Qwen.'),
        details: lastError
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

    // Validação e Injeção dos Gráficos Oficiais no Backend
    if (jsonResult && typeof jsonResult === 'object') {
      jsonResult.grafico_validacao = {
        titulo: "BARREIRAS DE CONSUMO E ATRITOS LOCAIS (SJC N=477)",
        type: "bar",
        labels: ["Preço Alto", "Falta Lugar Legal", "Insegurança", "Sem Dificuldade", "Transporte"],
        data: [33.1, 23.5, 20.5, 13.6, 7.1]
      };

      jsonResult.graficos_analiticos = [
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
      ];

      jsonResult.verbalizacoes_reais = OFFICIAL_VERBATIMS;

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
      datasetN: DATA_SUMMARY.n
    });

  } catch (error) {
    return res.status(500).json({ 
      error: 'Erro interno no Servidor: ' + error.message,
      details: error.stack || error.message
    });
  }
};
