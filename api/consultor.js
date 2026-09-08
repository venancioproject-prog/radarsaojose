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
5. BANCO DE VERBATIMS E CITAÇÕES REAIS DE RESPONDENTES (PESQUISA QUALITATIVA RADAR SJC):
   - "Custo de vida de capital, com opções, salário e oportunidades de um interior... Coisas caras e sem qualidade." (Mulher Cis, 25-34 anos, Parque Industrial, PJ)
   - "Falta aconchego humano, vida nas ruas. Fora centro comercial, shopping, supermercados e corredores, não há vida nas ruas de São José." (Mulher Cis, 65+ anos, Oeste, Classe A/B)
   - "Eu entendo que São José tem muitas opções pra quem pode pagar e poucas pra quem não pode pagar. Em vários aspectos com relação a cultura, ao transporte." (Mulher Cis, 25-34 anos, Norte, Classe C)
   - "Cidade com direção política conservadora, falta arte, eventos públicos, os parques e feiras são bons. Mas poderíamos ter muito mais com o número de habitantes que temos." (Outros, 35-44 anos, Oeste, Classe C)
   - "Para lazer e cultura prefiro ir a São Paulo pois as opções aqui são limitadas e muitas vezes os eventos não são bem divulgados ou organizados." (Mulher Cis, 35-44 anos, Oeste, Classe B)
   - "Sinto falta de uma vida cultural mais pulsante fora do eixo comercial. Mais eventos de rua e ocupação dos espaços públicos." (Homem Cis, 25-34 anos, Centro, Classe B)
   - "SJC tem potencial para ter eventos de grande porte, como festivais de música e gastronomia que atraiam pessoas de fora e segurem quem mora aqui." (Mulher Cis, 25-34 anos, Sul, Classe B)
   - "Uma cidade com poucos recursos para jovens." (Mulher Cis, 35-44 anos, Jd. Colonial, PJ)
   - "Lazer só pra quem tem dinheiro." (Mulher Cis, 35-44 anos, Jd. Santa Inês III, CLT)`;

    const systemPrompt = `Você é o Sócio-Diretor de Estratégia da McKinsey & Company. O usuário fornecerá uma ideia de negócio. Sua missão é gerar uma Auditoria Estratégica IMPLACÁVEL, DE ELEVADA DENSIDADE CONCEITUAL E RIGOR ANALÍTICO baseada nos microdados do CSV municipal de São José dos Campos (N=477, IC=95%).

${marketBriefSJC}

TRAVAS DRACONIANAS E PADRÃO MCKINSEY DEFINITIVO (REGRAS DE OURO):
0. REGRA DE SANIDADE LÓGICA & FIT REALISTA: Adeque o seu tom e estratégia à REALIDADE da ideia e do local. Se o usuário sugerir um negócio popular (ex: Loja de Salgados, Marmitex, Barbearia de bairro, Oficina) em uma área popular (ex: Zona Norte, Zona Leste, bairros periféricos da Zona Sul), PARE de forçar narrativas de 'estética instagramável premium' ou focar na 'Tribo Global'. Use a estratégia correta: foco em giro rápido, custo-benefício, delivery, movimento 'Cidade Prometida' ou 'Empreendedorismo Intuitivo'. Respeite a classe social e a geografia real da ideia proposta.
1. TRAVA DE NARRATIVA (PROIBIDO DATA-DUMP): É TERMINANTEMENTE PROIBIDO listar porcentagens como uma lista de compras (ex: "tem 40%, além de 20%, somando 15%"). O foco central do texto deve ser a PSICOLOGIA DO CONSUMIDOR, AS DORES OCULTAS, O COMPORTAMENTO E A CULTURA LOCAL. Os números do Radar SJC devem aparecer de forma elegante e comedida, servindo unicamente para PROVAR a tese analítica.
2. TESE DE VIABILIDADE EM NEGRITO OBRIGATÓRIA: No meio do parágrafo de 'visao_estrategica_texto', você DEVE OBRIGATORIAMENTE escrever uma frase de impacto definitiva em formato Markdown Negrito (**frase**). Exemplo de padrão: "**O sucesso deste negócio em SJC não depende de preço, mas da capacidade de quebrar a barreira da mesmice e reter o consumidor que hoje foge para São Paulo.**"
3. REGRA DE TITÂNIO (3 VERBALIZAÇÕES REAIS COM DEMOGRAFIA DO CSV): Na chave 'verbalizacoes_reais', você é ESTONTEANTEMENTE PROIBIDO de inventar, criar ou simular frases falsas. Você DEVE ler o contexto da pesquisa/CSV e EXTRAIR EXATAMENTE 3 objetos com citações reais (verbatims) do banco que tenham o MAIOR FIT com o nicho de mercado da ideia sugerida, atrelando a faixa etária, região e renda de cada respondente extraídos estritamente do perfil do CSV.
4. TRAVA GEOGRÁFICA (ZONA DE EXCLUSÃO OBRIGATÓRIA E DENSA): A chave 'zona_exclusao' NÃO PODE ser apenas o nome de um bairro. Ela DEVE conter o nome da região seguido de um PARÁGRAFO EXPLICATIVO E DURO (40-60 palavras) detalhando por que a ideia fracassaria e queimaria caixa naquele local (choque com a cultura tradicional familiar da Cidade Prometida, falta de lastro de renda, dispersão de fluxo, etc.).
5. BAIRROS ESTRUTURADOS: O array 'bairros' deve conter exatamente 5 bairros com justificativas fluidas e contextualizadas cruzando renda, idade e o movimento cultural correspondente.
6. RESPOSTA EXCLUSIVAMENTE EM JSON VÁLIDO: Retorne APENAS o objeto JSON abaixo, sem texto antes ou depois, sem blocos de markdown (```json).

ESTRUTURA JSON EXATA E OBRIGATÓRIA:
{
  "visao_estrategica_texto": "Texto fluido, focado em dor e comportamento, sem parecer uma planilha. Contém OBRIGATORIAMENTE uma tese central em **negrito**. Termina fazendo menção ao gráfico abaixo.",
  "grafico_validacao": {
    "titulo": "TÍTULO ELEGANTE DO INDICADOR (Ex: Critérios Decisivos de Escolha de Estabelecimentos em SJC)",
    "type": "bar",
    "labels": ["Indicador A", "Indicador B", "Indicador C"],
    "data": [45, 30, 25]
  },
  "verbalizacao_pesquisa": "\"Citação autêntica da pesquisa que seja PERFEITAMENTE alinhada ao nicho da ideia proposta.\"",
  "verbalizacoes_reais": [
    {
      "citacao": "Texto exato da citação real extraída da pesquisa...",
      "idade": "25-34 anos",
      "regiao": "Zona Sul",
      "renda": "R$ 5.6k - 12k"
    },
    {
      "citacao": "Texto exato da citação real extraída da pesquisa...",
      "idade": "35-44 anos",
      "regiao": "Centro-Oeste",
      "renda": "R$ 12k - 25k"
    },
    {
      "citacao": "Texto exato da citação real extraída da pesquisa...",
      "idade": "18-24 anos",
      "regiao": "Zona Leste",
      "renda": "R$ 2.8k - 5.6k"
    }
  ],
  "bairros": [
    { "nome": "Nome do Bairro 1", "regiao": "Região (ex: Centro-Oeste)", "justificativa": "Análise fluida e executiva conectando o perfil de renda, comportamento do CSV e o movimento cultural ao negócio." },
    { "nome": "Nome do Bairro 2", "regiao": "Região (ex: Zona Sul)", "justificativa": "Análise fluida conectando os dados demográficos e fluxo de consumo..." },
    { "nome": "Nome do Bairro 3", "regiao": "Região", "justificativa": "Análise fluida..." },
    { "nome": "Nome do Bairro 4", "regiao": "Região", "justificativa": "Análise fluida..." },
    { "nome": "Nome do Bairro 5", "regiao": "Região", "justificativa": "Análise fluida..." }
  ],
  "zona_exclusao": "NOME DA REGIÃO / BAIRRO - Explicação densa e impiedosa de por que a ideia fracassaria neste local específico por choque cultural ou inadequação de ticket/público.",
  "swot": {
    "forcas": ["Diferencial psicográfico interno 1", "Diferencial 2", "Diferencial 3"],
    "fraquezas": ["Gargalo de percepção/operação 1", "Vulnerabilidade 2", "Gargalo 3"],
    "oportunidades": ["Demanda reprimida comportamental em SJC 1", "Alavanca de mercado 2", "Oportunidade 3"],
    "ameacas": ["Risco competitivo local 1", "Atrito moral/cultural em SJC 2", "Ameaça 3"]
  },
  "auditoria_ambiente": {
    "pestel": {
      "P": "Análise Política e Regulatória em SJC...",
      "E": "Análise Econômica, Renda e Poder de Compra...",
      "S": "Análise Social, Comportamento e Risco Moral Conservador...",
      "T": "Análise Tecnológica, Aeroespacial e Canais Digitais...",
      "E_env": "Análise Ambiental, Sustentabilidade e Espaços Urbanos...",
      "L": "Análise Legal, Alvarás, Zoneamento e Compliance Local..."
    },
    "ishikawa": {
      "problema_central": "Fracasso na Retenção de Consumo Local e Queima de Caixa",
      "causas": [
        { "categoria": "Pessoas & Atendimento", "descricao": "Falta de hospitalidade autêntica e mão de obra alinhada ao padrão cosmopolita" },
        { "categoria": "Ambiente & Experiência", "descricao": "Sensação de mesmice noturna e espaços sem aconchego ou apelo instagramável" },
        { "categoria": "Processos & Mobilidade", "descricao": "Atritos de trânsito, estacionamento escasso e transporte público desconectado" },
        { "categoria": "Produto & Percepção", "descricao": "Preços altos sem entrega de valor percebido gerando sensação de 'caro e sem qualidade'" }
      ]
    }
  },
  "matrizes_estrategicas": {
    "vrio": [
      { "letra": "V", "nome": "Valor", "analise": "Avaliação se os recursos geram valor percebido real para o cliente joseense." },
      { "letra": "R", "nome": "Raridade", "analise": "Avaliação se a solução é rara e escassa na micro-região de SJC." },
      { "letra": "I", "nome": "Imitabilidade", "analise": "Dificuldade ou facilidade de competidores copiarem a operação local." },
      { "letra": "O", "nome": "Organização", "analise": "Capacidade da estrutura interna e processos capturarem esse potencial." }
    ],
    "porter": [
      { "forca": "Rivalidade entre Concorrentes", "analise": "Intensidade competitiva direta nos bairros selecionados de SJC." },
      { "forca": "Ameaça de Novos Entrantes", "analise": "Barreiras de entrada de capital, ponto comercial e fidelidade local." },
      { "forca": "Produtos Substitutos", "analise": "Alternativas de consumo ou evasão para outras praças." },
      { "forca": "Barganha dos Fornecedores", "analise": "Poder de negociação de insumos e logística no Vale do Paraíba." },
      { "forca": "Barganha dos Clientes", "analise": "Sensibilidade a preço e exigência de padrão de qualidade do público joseense." }
    ]
  },
  "mix_marketing": {
    "cinco_ps": [
      { "p": "Produto", "analise": "Portfólio, curva de qualidade e diferenciação tangível." },
      { "p": "Preço", "analise": "Estratégia de precificação (penetração, margem ou custo-benefício) compatível com a renda do local." },
      { "p": "Praça", "analise": "Canais físicos, microterritório de ponto, delivery e capilaridade." },
      { "p": "Promoção", "analise": "Comunicação, tráfego local, boca a boca orgânico e ativações." },
      { "p": "Pessoas", "analise": "Padrão de atendimento, treinamento de equipe e hospitalidade." }
    ],
    "oceano_azul": {
      "eliminar": "Fatores de atrito e custos desnecessários a eliminar na operação...",
      "reduzir": "Fatores tradicionais que encarecem a operação e devem ser reduzidos...",
      "elevar": "Padrões de entrega e agilidade que devem ficar muito acima do mercado de SJC...",
      "criar": "Diferenciais autênticos nunca antes ofertados no microterritório..."
    }
  },
  "movimentos_culturais": {
    "analise_cards": {
      "geografia_silencio": "Escreva 2 linhas analisando como o público que busca sossego, refúgio e áreas verdes em SJC recebe esta ideia com base no CSV.",
      "cidade_prometida": "Escreva 2 linhas analisando como o público familiar conservador da Zona Sul/Colinas recebe a ideia, apontando fit ou riscos morais.",
      "tribo_global": "Escreva 2 linhas analisando a recepção pelo público cosmopolita, engenheiros, tech e que busca estética diferenciada em SJC.",
      "empreendedorismo_intuitivo": "Escreva 2 linhas analisando o fit com a economia real dos bairros, conveniência rápida e consumo prático local."
    },
    "veredicto_final": {
      "nome_movimento": "A Tribo Global",
      "justificativa_densa": "Um parágrafo forte explicando por que este movimento é o porto seguro do negócio e como capturar esse público específico com base no CSV de SJC."
    }
  },
  "graficos_analiticos": [
    {
      "chart_data": {
        "type": "bar",
        "title": "Barreiras e Atritos de Consumo em SJC",
        "labels": ["Preço s/ Valor", "Falta Autoral", "Mesmice", "Transporte", "Insegurança"],
        "data": [32.3, 22.9, 18.6, 14.1, 12.1]
      },
      "pergunta_origem": "O que mais te desanima a sair de casa em São José dos Campos? (Atritos & Barreiras)",
      "parecer_analitico": "Parecer analítico explicando como a proposta quebra as barreiras de mesmice e entrega percepção real de valor."
    },
    {
      "chart_data": {
        "type": "doughnut",
        "title": "Paradoxo de Evasão vs Consumo em SJC",
        "labels": ["Evadem para SP/Litoral", "Consomem em SJC"],
        "data": [64.7, 35.3]
      },
      "pergunta_origem": "Você costuma consumir serviços gastronômicos e culturais fora de São José dos Campos? (Evasão)",
      "parecer_analitico": "Parecer analítico relacionando a retenção de consumo com o apelo de novidade e sofisticação."
    },
    {
      "chart_data": {
        "type": "bar",
        "title": "Frequência de Consumo por Macro-Região",
        "labels": ["Centro-Oeste", "Zona Sul", "Zona Leste", "Zona Norte", "Sudeste"],
        "data": [40.7, 27.6, 13.9, 11.2, 6.6]
      },
      "pergunta_origem": "Em qual região de São José dos Campos você mais costuma frequentar para consumo e lazer?",
      "parecer_analitico": "Parecer analítico sobre a penetração geográfica e adaptação ao comportamento de fluxo local."
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
