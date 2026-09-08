export default async function handler(req, res) {
  // Configuração de CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido. Use POST.' });
  }

  try {
    const { user_input, question, messages, context } = req.body || {};
    const inputContent = user_input || question || (Array.isArray(messages) && messages.length > 0 ? messages[messages.length - 1].content : 'Apresente um plano de negócios para São José dos Campos.');
    const apiKey = (process.env.GROQ_API_KEY || '').trim();

    if (!apiKey) {
      return res.status(500).json({ error: 'Chave GROQ_API_KEY não configurada nas variáveis de ambiente da Vercel.' });
    }

    // BASE CONSOLIDADA DIRETA DO CSV MUNICIPAL REAL (N=477) COM RECORTES PSICOGRÁFICOS E COMPORTAMENTAIS:
    const marketBriefSJC = `BASE COMPLETA DE DADOS DA PESQUISA MUNICIPAL RADAR SÃO JOSÉ (N=477, IC=95%):
1. MACRODEMOGRAFIA & PERFIL SOCIOECONÔMICO:
   - Renda Total Familiar: Até R$ 2.800 (18.1%) | R$ 2.801 a R$ 5.600 (32.3%) | R$ 5.601 a R$ 12.000 (23.6%) | R$ 12.001 a R$ 26.000 (14.2%) | Acima de R$ 26.000 (11.8%).
   - Faixa Etária: 16-17 anos (1.9%), 18-24 anos (12.2%), 25-34 anos (26.8%), 35-44 anos (27.6%), 45-54 anos (22.0%), 55-64 anos (7.4%), 65+ anos (4.0%).
   - Gênero / Identidade: Mulheres Cis (58.4%), Homens Cis (37.9%), Outros/Trans/Não-binários (3.7%).
   - Ocupação / Trabalho: CLT (53.2%), PJ / Autônomo / Bico (22.8%), Funcionário Público (11.4%), Estudante / Estágio (6.3%), Aposentado (4.2%), Empresário (2.1%).
   - Habitação & Relacionamento: Casa própria (51.2%), Aluguel querendo casa própria (39.5%), Aluguel sem intenção (9.3%). Casados/Morando junto (48.6%), Solteiros (33.5%), Namorando (11.2%), Divorciados/Viúvos (6.7%).

2. PSICOGRAFIA, DORES REAIS & PSICOLOGIA DO CONSUMIDOR JOSEENSE:
   - Paradoxo de Evasão vs Orgulho: 72.4% têm orgulho de morar em SJC. Contudo, 64.7% EVADEM seu lazer/gastronomia para fora (SP Capital, Campos do Jordão, Litoral Norte, Santo Antônio do Pinhal). Motivo: busca por autenticidade e status cosmopolita que a cidade não entrega.
   - Barreiras Noturnas & Atritos Invisíveis: 32.3% "É tudo muito caro para o que oferece (falta de valor percebido)", 22.9% "Falta de lugares legais e autorais (mesmice)", 18.6% "Sensação de mesmice e repetição de formato", 14.1% "Ônibus e mobilidade truncada", 12.1% "Insegurança percebida".
   - Demanda Reprimida & Disposição a Gastar: 78.8% dos joseenses afirmam enfaticamente que gastariam MAIS dinheiro na cidade se houvesse opções inovadoras, autênticas e que combinassem com o seu estilo de vida.
   - Critérios Reais de Escolha: Ambiente agradável, acolhedor e bonito (38.9%), Preço/Custo-benefício (27.1%), Indicação orgânica de amigos/família (21.4%), Proximidade geográfica de casa (12.6%).
   - Estética Instagramável & Validação Social: 46.8% valorizam ou escolhem ativamente estabelecimentos por serem bonitos para fotos/redes sociais.
   - Cultura Pet-Friendly: 68.2% possuem animais de estimação e demandam estabelecimentos e praças abertas que acolham pets.
   - Aversão a Risco & Conservadorismo Social: Forte apego a valores familiares tradicionais e cautela com conceitos excessivamente disruptivos ou eróticos na Zona Sul e Leste, com maior abertura cosmopolita concentrada no eixo Aquarius/Vila Ema/Adyana.
   - Distribuição de Frequência de Consumo Regional:
     * Centro-Oeste (Aquarius, Vila Adyana, Vila Ema, Esplanada, Colinas): 40.7%
     * Zona Sul (Jardim Satélite, Bosque, Jardim Oriente, Morumbi, Colonial): 27.6%
     * Zona Leste (Vila Industrial, Eugênio de Melo, Vista Verde, Novo Horizonte): 13.9%
     * Zona Norte (Santana, Altos de Santana, Buquirinha): 11.2%
     * Zona Sudeste (Jardim da Granja, São Judas, Putim): 6.6%

3. HÁBITOS CULTURAIS, MÍDIA & INFLUENCIADORES:
   - Redes Sociais Mais Usadas para Busca de Locais: Instagram (79.4%), TikTok (14.2%), Google/Maps (6.4%). 54.1% já frequentaram estabelecimentos por recomendação de influenciadores locais.
   - Gêneros Musicais Favoritos: MPB/Pop Rock (38.2%), Sertanejo (31.4%), Pagode/Samba (28.7%), Rock Internacional/Indie (24.1%), Funk/Trap (19.8%), Eletrônica (14.2%), Gospel (11.5%).
   - Streaming: Netflix (78.2%), Spotify (64.3%), Prime Video (46.8%), YouTube Music (38.6%), Disney+ (34.1%).

4. OS 4 GRANDES MOVIMENTOS CULTURAIS DE SJC:
   - 1. A Geografia do Silêncio: refúgio, sossego, áreas verdes, calmaria do estresse corporativo (Urbanova, Adyana, condomínios fechados).
   - 2. A Cidade Prometida: famílias, segurança, estabilidade, conveniência familiar e custo-benefício (Zona Sul e Leste consolidada).
   - 3. A Tribo Global: inovação tecnológica, aeroespacial, design autoral, experiências cosmopolitas (Aquarius, Colinas, Vila Ema).
   - 4. O Empreendedorismo Intuitivo: comércio de bairro, serviços ágeis, conveniência e consumo prático local (Zona Sul, Norte, Leste).`;

    const systemPrompt = `Você é o Lead Data Scientist e Consultor Sênior de Estratégia de Mercado (Padrão Bain & Company / McKinsey). O usuário fornecerá uma ideia de negócio. Sua missão é gerar uma Auditoria Estratégica de ALTO RIGOR ANALÍTICO baseada no CSV municipal de São José dos Campos (N=477, IC=95%).

${marketBriefSJC}

REGRAS DE OURO E TRAVAS ANALÍTICAS OBRIGATÓRIAS (FOCO NOS BLOCOS 1 E 2):
1. FIM DA MULETA DO PARADOXO: É TERMINANTEMENTE PROIBIDO usar o argumento clichê de 'tem orgulho, mas foge para a capital', a menos que a ideia seja EXCLUSIVAMENTE de lazer/vida noturna. Para qualquer outro negócio (lojas, clínicas, alimentação rápida, serviços, academia, moda, pet, etc.), você DEVE garimpar o CSV em busca de ângulos inovadores, dores reais e carências não óbvias (ex: falta de locais pet-friendly 68.2%, valorização de estética 46.8%, demanda por ambiente acolhedor 38.9%, disposição a gastar mais 78.8%, canais de influência, mobilidade, etc.).
2. RASTREABILIDADE TOTAL DE DADOS: Toda vez que você citar qualquer porcentagem no texto da 'visao_estrategica_texto', você DEVE OBRIGATORIAMENTE citar a pergunta de origem usando ASPAS SIMPLES no formato exato: (Pergunta: 'Texto da pergunta no CSV' - Radar SJC). NUNCA use barras invertidas ou aspas duplas aninhadas.
3. FORMATAÇÃO DA VISÃO ESTRATÉGICA: Na chave 'visao_estrategica_texto', envie APENAS o texto corrido. É PROIBIDO escrever o nome da chave ('visao_estrategica_texto :') dentro do valor. Inclua uma frase principal em formato Markdown Negrito (**frase**) no meio do texto, resumindo a tese executiva.
4. VERBALIZAÇÃO QUALITATIVA (VERBATIM): No campo 'verbalizacao_pesquisa', envie uma citação direta entre aspas simulando a voz real de um respondente da pesquisa que expresse a dor ou a demanda que este negócio vem suprir em SJC.
5. FIT GEOGRÁFICO E ARRAY DE BAIRROS: No campo 'bairros', retorne OBRIGATORIAMENTE um ARRAY DE OBJETOS com 5 bairros no formato: [{"nome": "Nome do Bairro", "regiao": "Zona X", "justificativa": "Análise técnica baseada no CSV..."}]. Zero inferências sem base.
6. TÍTULO DO GRÁFICO DE VALIDAÇÃO: O título de 'grafico_validacao' DEVE conter a pergunta exata da pesquisa que valida a tese.
7. RESPOSTA EXCLUSIVAMENTE EM JSON VÁLIDO: Você DEVE retornar APENAS o objeto JSON abaixo, sem NENHUM texto antes ou depois, sem blocos de markdown (\`\`\`json).

ESTRUTURA JSON EXATA E OBRIGATÓRIA:
{
  "visao_estrategica_texto": "Texto corrido analítico profundo (aprox. 150 palavras) explorando o CSV. Proibido escrever o nome da chave aqui dentro. Toda porcentagem DEVE citar a pergunta com aspas simples: (Pergunta: 'Texto da pergunta' - Radar SJC). Deve conter uma frase principal em **negrito**. No final, faça referência aos dados do gráfico abaixo.",
  "grafico_validacao": {
    "titulo": "TÍTULO DO GRÁFICO (Obrigatório: Incluir a Pergunta Exata da Pesquisa)",
    "type": "bar",
    "labels": ["Dado 1", "Dado 2", "Dado 3"],
    "data": [10, 20, 30]
  },
  "verbalizacao_pesquisa": "\"Citação direta entre aspas simulando a resposta aberta de um respondente que justifique a necessidade deste negócio em SJC.\"",
  "bairros": [
    { "nome": "Nome do Bairro 1", "regiao": "Região (ex: Centro-Oeste)", "justificativa": "Análise estritamente focada em dados geográficos, demográficos (renda/idade) do CSV e o fit com os Movimentos Culturais. Zero inferências sem base." },
    { "nome": "Nome do Bairro 2", "regiao": "Região (ex: Zona Sul)", "justificativa": "Análise focada em dados do CSV..." },
    { "nome": "Nome do Bairro 3", "regiao": "Região", "justificativa": "Análise focada em dados do CSV..." },
    { "nome": "Nome do Bairro 4", "regiao": "Região", "justificativa": "Análise focada em dados do CSV..." },
    { "nome": "Nome do Bairro 5", "regiao": "Região", "justificativa": "Análise focada em dados do CSV..." }
  ],
  "zona_exclusao": "Bairro/Região onde NUNCA abrir este negócio em SJC e o porquê detalhado com base no atrito cultural.",
  "swot": {
    "forcas": ["Diferencial psicográfico interno 1", "Diferencial 2", "Diferencial 3"],
    "fraquezas": ["Gargalo de percepção/operação 1", "Vulnerabilidade 2", "Gargalo 3"],
    "oportunidades": ["Demanda reprimida comportamental em SJC 1", "Alavanca de mercado 2", "Oportunidade 3"],
    "ameacas": ["Risco competitivo local 1", "Atrito moral/cultural em SJC 2", "Ameaça 3"]
  },
  "pestel_ishikawa": "Análise densa de fatores Políticos, Econômicos, Sociais (risco moral), Tecnológicos, Ambientais e Legais, mais causa-raiz de gargalos.",
  "matrizes_vrio_porter": "Avaliação competitiva real (VRIO) e nível de rivalidade contra concorrentes locais, poder do cliente joseense e barreiras (Porter).",
  "mix_marketing_oceano_azul": "Estratégia de precificação (Preço), canais (Praça), atração (Promoção) e curva de valor (Eliminar, Reduzir, Elevar, Criar diferenciais).",
  "movimento_cultural": {
    "vencedor": "Nome do Movimento (A Geografia do Silêncio | A Cidade Prometida | A Tribo Global | O Empreendedorismo Intuitivo)",
    "analise": "Justificativa de ancoragem estratégica neste movimento e alerta de risco moral se chocar com a moral familiar da Cidade Prometida."
  },
  "graficos_analiticos": [
    {
      "chart_data": {
        "type": "bar",
        "title": "Barreiras e Atritos de Consumo em SJC",
        "labels": ["Preço s/ Valor", "Falta Autoral", "Mesmice", "Transporte", "Insegurança"],
        "data": [32.3, 22.9, 18.6, 14.1, 12.1]
      },
      "analise_texto": "Parecer analítico explicando como a proposta quebra as barreiras de mesmice e entrega percepção real de valor."
    },
    {
      "chart_data": {
        "type": "doughnut",
        "title": "Paradoxo de Evasão vs Consumo em SJC",
        "labels": ["Evadem para SP/Litoral", "Consomem em SJC"],
        "data": [64.7, 35.3]
      },
      "analise_texto": "Parecer analítico relacionando a retenção de consumo com o apelo de novidade e sofisticação."
    },
    {
      "chart_data": {
        "type": "bar",
        "title": "Frequência de Consumo por Macro-Região",
        "labels": ["Centro-Oeste", "Zona Sul", "Zona Leste", "Zona Norte", "Sudeste"],
        "data": [40.7, 27.6, 13.9, 11.2, 6.6]
      },
      "analise_texto": "Parecer analítico sobre a penetração geográfica e adaptação ao comportamento de fluxo local."
    }
  ]
}`;

    // 1. Obter modelos ativos diretamente da API da Groq para garantir que nenhum modelo descontinuado seja chamado
    let candidateModels = [];
    try {
      const modelsResp = await fetch('https://api.groq.com/openai/v1/models', {
        headers: { 'Authorization': `Bearer ${apiKey}` }
      });
      if (modelsResp.ok) {
        const modelsData = await modelsResp.json();
        const activeIds = (modelsData.data || []).map(m => m.id);
        
        // Modelos de texto recomendados da Groq em ordem de preferência
        const topPriorities = [
          'llama-3.3-70b-versatile',
          'llama-3.1-70b-versatile',
          'llama-3.3-70b-specdec',
          'qwen-2.5-32b',
          'llama-3.1-8b-instant'
        ];

        for (const p of topPriorities) {
          if (activeIds.includes(p)) candidateModels.push(p);
        }

        activeIds.forEach(id => {
          if (!candidateModels.includes(id) && 
              !id.includes('whisper') && 
              !id.includes('guard') && 
              !id.includes('distil') && 
              !id.includes('vision') &&
              !id.includes('llama3-8b-8192') &&
              !id.includes('llama3-70b-8192')) {
            candidateModels.push(id);
          }
        });
      }
    } catch (eList) {
      console.warn('[Consultor IA] Falha ao listar /models da Groq:', eList.message);
    }

    if (candidateModels.length === 0) {
      candidateModels = [
        'llama-3.3-70b-versatile',
        'llama-3.1-8b-instant'
      ];
    }

    let replyContent = null;
    let modelUsed = null;
    let lastError = null;

    for (const model of candidateModels) {
      try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: model,
            response_format: { type: "json_object" },
            max_tokens: 3500,
            temperature: 0.5,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: inputContent }
            ]
          })
        });

        const data = await response.json();
        if (response.ok && data.choices?.[0]?.message?.content) {
          replyContent = data.choices[0].message.content;
          modelUsed = model;
          break;
        } else {
          lastError = data.error?.message || JSON.stringify(data);
          console.warn(`[Consultor IA] Falha no modelo ${model}:`, lastError);
        }
      } catch (err) {
        lastError = err.message;
        console.warn(`[Consultor IA] Exceção no modelo ${model}:`, err.message);
      }
    }

    if (!replyContent) {
      return res.status(500).json({
        error: lastError || 'Não foi possível gerar a resposta com os modelos disponíveis.',
        modelUsed: candidateModels
      });
    }

    // Sanitização e Extração Segura de JSON
    let jsonResult = null;
    let cleanReply = replyContent.trim();

    // Remover blocos ```json ... ``` ou ``` ... ``` se existirem
    cleanReply = cleanReply.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

    // Extrair estritamente entre a primeira { e a última }
    const firstBrace = cleanReply.indexOf('{');
    const lastBrace = cleanReply.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      cleanReply = cleanReply.substring(firstBrace, lastBrace + 1).trim();
    }

    try {
      jsonResult = JSON.parse(cleanReply);
    } catch (eJson) {
      console.warn("[Consultor IA] Falha no primeiro JSON.parse, tentando regex:", eJson.message);
      const matchJson = replyContent.match(/\{[\s\S]*\}/);
      if (matchJson) {
        try {
          jsonResult = JSON.parse(matchJson[0]);
        } catch (eSub) {
          console.warn("[Consultor IA] Falha no regex parse:", eSub.message);
        }
      }
    }

    res.status(200).json({ 
      result: jsonResult || replyContent,
      reply: cleanReply,
      modelUsed: modelUsed
    });

  } catch (error) {
    console.error("Erro interno no servidor:", error);
    res.status(500).json({ error: 'Erro interno na Serverless Function: ' + error.message });
  }
}
