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

    // BASE CONSOLIDADA DIRETA DO CSV MUNICIPAL REAL (N=477):
    const marketBriefSJC = `BASE COMPLETA DE DADOS DA PESQUISA MUNICIPAL RADAR SÃO JOSÉ (N=477, IC=95%):
1. MACRODEMOGRAFIA & PERFIL SOCIOECONÔMICO:
   - Renda Total Familiar: Até R$ 2.800 (18.1%) | R$ 2.801 a R$ 5.600 (32.3%) | R$ 5.601 a R$ 12.000 (23.6%) | R$ 12.001 a R$ 26.000 (14.2%) | Acima de R$ 26.000 (11.8%).
   - Faixa Etária: 16-17 anos (1.9%), 18-24 anos (12.2%), 25-34 anos (26.8%), 35-44 anos (27.6%), 45-54 anos (22.0%), 55-64 anos (7.4%), 65+ anos (4.0%).
   - Gênero / Identidade: Mulheres Cis (58.4%), Homens Cis (37.9%), Outros/Trans/Não-binários (3.7%).
   - Ocupação / Trabalho: CLT (53.2%), PJ / Autônomo / Bico (22.8%), Funcionário Público (11.4%), Estudante / Estágio (6.3%), Aposentado (4.2%), Empresário (2.1%).
   - Habitação & Relacionamento: Casa própria (51.2%), Aluguel querendo casa própria (39.5%), Aluguel sem intenção (9.3%). Casados/Morando junto (48.6%), Solteiros (33.5%), Namorando (11.2%), Divorciados/Viúvos (6.7%).

2. COMPORTAMENTO DE CONSUMO, LAZER & PSICOLOGIA URBANA:
   - Paradoxo de Evasão vs Orgulho: 72.4% têm orgulho de morar em SJC. Contudo, 64.7% evadem seu lazer/gastronomia para fora (SP Capital, Campos do Jordão, Litoral Norte, Santo Antônio do Pinhal).
   - Barreiras Noturnas & Serviços: 32.3% "É tudo muito caro para o que oferece", 22.9% "Falta de lugares legais e autorais", 18.6% "Sensação de mesmice", 14.1% "Ônibus/falta de transporte/horários", 12.1% "Insegurança".
   - Disposição a Gastar Mais: 78.8% dos joseenses afirmam enfaticamente que gastariam MAIS dinheiro na cidade se houvesse opções inovadoras, autênticas e que combinassem com o seu estilo.
   - Critério de Escolha de Restaurante/Bar: Ambiente agradável e bonito (38.9%), Preço/Custo-benefício (27.1%), Indicação de amigos/família (21.4%), Proximidade de casa (12.6%).
   - Estética Instagramável: 46.8% valorizam ou escolhem lugares por serem bonitos para fotos/social media.
   - Mobilidade: Carro próprio (54.8%), Uber/99 (42.1%), Ônibus (36.4%), Linha Verde (12.8%), Bicicleta/Patinete (8.7%).
   - Pets & Espaços: 68.2% possuem animais de estimação e demandam estabelecimentos e praças pet friendly.
   - Distribuição de Frequência de Consumo Regional:
     * Centro-Oeste (Aquarius, Vila Adyana, Vila Ema, Esplanada, Jardim das Colinas): 40.7%
     * Zona Sul (Jardim Satélite, Bosque dos Eucaliptos, Jardim Oriente, Morumbi, Colonial): 27.6%
     * Zona Leste (Vila Industrial, Eugênio de Melo, Vista Verde, Novo Horizonte): 13.9%
     * Zona Norte (Santana, Altos de Santana, Buquirinha): 11.2%
     * Zona Sudeste (Jardim da Granja, São Judas, Putim): 6.6%

3. HÁBITOS CULTURAIS, MÍDIA & INFLUENCIADORES:
   - Redes Sociais Mais Usadas para Busca de Locais: Instagram (79.4%), TikTok (14.2%), Google/Maps (6.4%). 54.1% já frequentaram estabelecimentos por recomendação de influenciadores locais.
   - Gêneros Musicais Favoritos: MPB/Pop Rock (38.2%), Sertanejo (31.4%), Pagode/Samba (28.7%), Rock Internacional/Indie (24.1%), Funk/Trap (19.8%), Eletrônica (14.2%), Gospel (11.5%).
   - Streaming: Netflix (78.2%), Spotify (64.3%), Disney+ (34.1%), Prime Video (46.8%), YouTube Music (38.6%).

4. OS 4 GRANDES MOVIMENTOS CULTURAIS DE SJC:
   - 1. A Geografia do Silêncio: refúgio, sossego, áreas verdes, calmaria do estresse corporativo (Urbanova, Adyana, condomínios fechados).
   - 2. A Cidade Prometida: famílias, segurança, estabilidade, conveniência familiar e custo-benefício (Zona Sul e Leste consolidada).
   - 3. A Tribo Global: inovação tecnológica, aeroespacial, design autoral, experiências cosmopolitas (Aquarius, Colinas, Vila Ema).
   - 4. O Empreendedorismo Intuitivo: comércio de bairro, serviços ágeis, conveniência e consumo prático local (Zona Sul, Norte, Leste).`;

    const systemPrompt = `Você é o Diretor de Inteligência de SJC (Padrão McKinsey / Data Science). O usuário fornecerá uma ideia de negócio. Sua missão é gerar uma Auditoria Estratégica implacável baseada estritamente no cruzamento de dados do CSV municipal de São José dos Campos (N=477, IC=95%).

${marketBriefSJC}

REGRAS DE OURO:
1. FIM DA PREGUIÇA GEOGRÁFICA: PROIBIDO listar automaticamente bairros de elite (Aquarius, Colinas) se a renda e o público da ideia não baterem. Se for popular, mande para Zona Sul, Leste ou Norte. Justifique com dados do CSV.
2. VEREDICTO IMPLACÁVEL: Diagnóstico denso, citando métricas reais de SJC (evasão de 64.7%, orgulho 72.4%, barreiras noturnas 32.3%, faixas de renda e perfil conservador de aprox. 40% de direita para negócios adultos/polêmicos).
3. RESPOSTA EXCLUSIVAMENTE EM JSON VÁLIDO: Você DEVE retornar APENAS o objeto JSON abaixo, sem NENHUM texto antes ou depois, sem blocos de markdown (\`\`\`json).

ESTRUTURA JSON EXATA E OBRIGATÓRIA:
{
  "visao_estrategica": "Seu diagnóstico analítico profundo cruzando a ideia com os microdados de SJC, ticket médio, oportunidade latente e público...",
  "bairros": [
    { "nome": "Nome do Bairro 1", "regiao": "Região (ex: Centro-Oeste)", "justificativa": "Motivo técnico baseado no perfil de renda e fluxo do CSV..." },
    { "nome": "Nome do Bairro 2", "regiao": "Região (ex: Zona Sul)", "justificativa": "Motivo técnico baseado no CSV..." },
    { "nome": "Nome do Bairro 3", "regiao": "Região", "justificativa": "Motivo técnico..." },
    { "nome": "Nome do Bairro 4", "regiao": "Região", "justificativa": "Motivo técnico..." },
    { "nome": "Nome do Bairro 5", "regiao": "Região", "justificativa": "Motivo técnico..." }
  ],
  "zona_exclusao": "Bairro/Região onde NUNCA abrir este negócio em SJC e o porquê detalhado.",
  "swot": {
    "forcas": ["Diferencial interno competitivo 1", "Diferencial interno 2", "Diferencial 3"],
    "fraquezas": ["Gargalo operacional 1", "Vulnerabilidade 2", "Gargalo 3"],
    "oportunidades": ["Demanda reprimida em SJC 1", "Alavanca de mercado 2", "Oportunidade 3"],
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
        "title": "Distribuição de Renda Alvo em SJC",
        "labels": ["Até 2.8k", "2.8k-5.6k", "5.6k-12k", "12k-26k", ">26k"],
        "data": [18.1, 32.3, 23.6, 14.2, 11.8]
      },
      "analise_texto": "Parecer analítico explicando como este dado estatístico valida a precificação e a escolha do ponto comercial."
    },
    {
      "chart_data": {
        "type": "doughnut",
        "title": "Paradoxo de Evasão vs Consumo em SJC",
        "labels": ["Evadem para SP/Litoral", "Consomem em SJC"],
        "data": [64.7, 35.3]
      },
      "analise_texto": "Parecer analítico relacionando a retenção de consumo com o apelo da proposta de valor."
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

    // Validação ou Extração de JSON Seguro
    let jsonResult = null;
    try {
      jsonResult = JSON.parse(replyContent);
    } catch (eJson) {
      const matchJson = replyContent.match(/\{[\s\S]*\}/);
      if (matchJson) {
        try {
          jsonResult = JSON.parse(matchJson[0]);
        } catch (eSub) {
          console.warn("Falha no segundo parse JSON:", eSub);
        }
      }
    }

    res.status(200).json({ 
      result: jsonResult || replyContent,
      reply: replyContent,
      modelUsed: modelUsed
    });

  } catch (error) {
    console.error("Erro interno no servidor:", error);
    res.status(500).json({ error: 'Erro interno na Serverless Function: ' + error.message });
  }
}
