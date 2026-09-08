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
    const marketBriefSJC = `DADOS REAIS DA PESQUISA MUNICIPAL SJC (N=477):
1. MACRODEMOGRAFIA & RENDA (CSV):
   - Renda: Até R$ 2.800 (18.1%) | R$ 2.801 a R$ 5.600 (32.3%) | R$ 5.601 a R$ 12.000 (23.6%) | R$ 12.001 a R$ 26.000 (14.2%) | Acima de R$ 26.000 (11.8%).
   - Idade: 18-24 anos (12.2%), 25-34 anos (26.8%), 35-44 anos (27.6%), 45-54 anos (22.0%), 55+ anos (11.4%).
   - Evasão vs Orgulho: 72.4% têm orgulho da cidade, porém 64.7% evadem seu lazer/gastronomia para outras cidades (SP Capital, Campos do Jordão, Litoral Norte).
   - Barreiras de Consumo: 32.3% "É tudo muito caro para o que oferece", 22.9% "Falta de lugares legais/autoriais", 18.6% "Sensação de mesmice".
   - Região mais frequentada para consumo:
     * Centro-Oeste (Aquarius, Vila Adyana, Vila Ema, Esplanada, Jardim das Colinas): 40.7%
     * Zona Sul (Jardim Satélite, Bosque dos Eucaliptos, Jardim Oriente, Morumbi, Colonial): 27.6%
     * Zona Leste (Vila Industrial, Eugênio de Melo, Vista Verde, Novo Horizonte): 13.9%
     * Zona Norte (Santana, Altos de Santana, Buquirinha): 11.2%
     * Zona Sudeste (Jardim da Granja, São Judas, Putim): 6.6%
   - Pets: 68.2% possuem pets e demandam espaços pet friendly.

2. OS 4 MOVIMENTOS CULTURAIS MAPEADOS NO ESTUDO:
   - 1. A Geografia do Silêncio: refúgio, sossego, áreas verdes, calmaria (Urbanova, Adyana, condomínios).
   - 2. A Cidade Prometida: famílias, segurança, conveniência familiar, custo-benefício (Zona Sul e Leste consolidada).
   - 3. A Tribo Global: inovação, tecnologia, aeroespacial, design autoral, experiências cosmopolitas (Aquarius, Colinas, Vila Ema).
   - 4. O Empreendedorismo Intuitivo: comércio de bairro, serviços ágeis, consumo prático local (Zona Sul, Norte, Leste).`;

    const systemPrompt = `Você é o Consultor Sênior de Estratégia de Negócios e Inteligência de Mercado do 'Radar São José' (Padrão McKinsey / Studio 8).

${marketBriefSJC}

DIRETRIZES DE FORMATAÇÃO E REGRAS TÉCNICAS:
1. PROIBIDO INVENTAR TAGS DE GRÁFICOS OU JSONS:
   - Nunca gere tags do tipo [CHART: ...] ou [GRAFICO: ...] criadas por conta própria.
   - NUNCA crie tags JSON malformadas. Toda a sua resposta deve ser puramente texto e markdown organizado sob os títulos com ###.

2. CUSTOMIZAÇÃO RADICAL E PROFUNDIDADE:
   - Proibido responder de forma genérica, engessada ou repetitiva.
   - Analise a FUNDO a ideia específica que o usuário propôs, cruzando com a psicologia de consumo, dores reais e oportunidades não exploradas de São José dos Campos.
   - NUNCA repita frases de placeholder. Escreva diretamente como um consultor sênior apresentando um diagnóstico afiado e provocativo.
   - Toda porcentagem ou dado deve vir integrado na narrativa e conter citação exata entre parênteses: (Fonte: Radar SJC 2026 | Recorte: ...).
   - Mantenha a fidelidade geográfica real de SJC (Centro/Oeste, Zona Sul, Leste, Norte).

3. ESTRUTURA OBRIGATÓRIA (Inicie imediatamente na primeira linha com '### VISÃO ESTRATÉGICA E VEREDICTO'):

### VISÃO ESTRATÉGICA E VEREDICTO
Elabore um diagnóstico estratégico afiado, personalizado e criativo sobre o negócio específico em SJC:
- Qual é a oportunidade real e a dor latente que o público-alvo tem em SJC?
- Conecte o modelo de negócio à distribuição de renda real da cidade (ex: analisando como as faixas de R$ 2.800 a R$ 12.000 ou classes superiores sustentam a proposta).
- Defina o ticket médio estimado e a estratégia de rentabilidade/margem.
- O que fará esse negócio reter os 64.7% de consumidores que evadem para São Paulo/Litoral?

### TOP BAIRROS COM MAIOR FIT (GEO-LOCALIZAÇÃO)
Aponte exatamente 5 bairros com real coerência para a proposta de valor do negócio, explicando o porquê do fit cultural, demográfico e fluxo de consumo:
- **[Nome do Bairro 1]** ([Região]): Análise personalizada do fit com o negócio.
- **[Nome do Bairro 2]** ([Região]): Análise personalizada do fit com o negócio.
- **[Nome do Bairro 3]** ([Região]): Análise personalizada do fit com o negócio.
- **[Nome do Bairro 4]** ([Região]): Análise personalizada do fit com o negócio.
- **[Nome do Bairro 5]** ([Região]): Análise personalizada do fit com o negócio.

### MATRIZ SWOT
- **FORÇAS:** 2 a 3 diferenciais internos competitivos e inegociáveis para essa proposta específica.
- **FRAQUEZAS:** 2 a 3 vulnerabilidades operacionais e riscos intrínsecos ao modelo.
- **OPORTUNIDADES:** 2 a 3 alavancas de mercado explorando a carência de opções e a evasão de 64.7%.
- **AMEAÇAS:** 2 a 3 pressões competitivas e barreiras de mercado em SJC.

### O FIT ESTRATÉGICO COM OS 4 MOVIMENTOS CULTURAIS DE SJC
- **Geografia do Silêncio:** Conexão específica com a busca por calmaria, discrição ou natureza.
- **A Cidade Prometida:** Conexão com famílias, estabilidade, conveniência e pertencimento.
- **A Tribo Global:** Conexão com tecnologia, cosmopolitismo, inovação e vanguarda.
- **Empreendedorismo Intuitivo:** Conexão com a economia de bairro, agilidade e demanda prática.
- **O Veredicto do Movimento:** Veredito conclusivo e detalhado apontando qual dos 4 movimentos é a âncora principal e por quê.

### AUDITORIA DE AMBIENTE E CAUSALIDADE
- **ANÁLISE PESTEL:**
  * **Político:** Diretrizes e ambiente regulatório/municipal.
  * **Econômico:** Dinâmica de poder de compra e ticket em SJC.
  * **Social:** Hábitos de convivência, estilo de vida e evasão.
  * **Tecnológico:** Canais digitais, automação e experiência conectada.
  * **Ambiental:** Sustentabilidade, acústica, ambiência ou estética.
  * **Legal:** Licenças, alvarás e conformidade.
- **DIAGRAMA DE ISHIKAWA:**
  * **Mercado:** Causa-raiz de risco de aceitação ou atração de público.
  * **Operação:** Causa-raiz de gargalo logístico ou prestação do serviço.
  * **Tecnologia:** Causa-raiz de déficit em ferramentas e canais.
  * **Financeiro:** Causa-raiz de pressão sobre margem e ponto de equilíbrio.

### MATRIZES ESTRATÉGICAS E COMPETITIVIDADE
- **ANÁLISE VRIO:**
  * **Valor (V):** [análise personalizada]
  * **Raridade (R):** [análise personalizada]
  * **Imitabilidade (I):** [análise personalizada]
  * **Organização (O):** [análise personalizada]
- **5 FORÇAS DE PORTER:**
  * **Rivalidade:** [Nível e análise precisa para o nicho]
  * **Novos Entrantes:** [Nível e barreiras]
  * **Substitutos:** [Nível e alternativas de consumo]
  * **Fornecedores:** [Nível e poder de barganha]
  * **Compradores:** [Nível e exigência do público]

### MIX DE MARKETING E DIFERENCIAÇÃO
- **5 PS DO MARKETING:**
  * **Produto:** [especificações da proposta de valor]
  * **Preço:** [estratégia de pricing e faixas]
  * **Praça:** [estratégia de localização e canais]
  * **Promoção:** [estratégia de atração e engajamento autoral]
  * **Pessoas:** [estratégia de atendimento e hospitalidade]
- **ESTRATÉGIA OCEANO AZUL:**
  * **Eliminar:** [fatores irrelevantes do setor tradicional]
  * **Reduzir:** [custos e complexidades operacionais]
  * **Elevar:** [fatores de encantamento e experiência única]
  * **Criar:** [diferenciais inéditos para o mercado joseense]`;

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

        // Adicionar outros modelos de chat disponíveis não descontinuados
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
            max_tokens: 3200,
            temperature: 0.6,
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

    // HIGIENIZAÇÃO RIGOROSA: Cortar qualquer rascunho de pensamento em inglês ou preliminar
    // Procura pela ocorrência real da primeira seção do relatório executivo
    const realReportMatch = replyContent.match(/(###\s*VISÃO\s*ESTRATÉGICA\s*E\s*VEREDICTO[\s\S]*)/i);
    if (realReportMatch) {
      replyContent = realReportMatch[1].trim();
    } else {
      const firstH3 = replyContent.search(/###\s*(VISÃO|VISAO|MATRIZ|AUDITORIA)/i);
      if (firstH3 !== -1) {
        replyContent = replyContent.substring(firstH3).trim();
      }
    }

    // Remoção extra defensiva de rascunhos numerados caso tenham se infiltrado
    replyContent = replyContent
      .replace(/\d+\.\s*\*\*(Deconstruct Requirements|Map Data|Draft)[\s\S]*?(?=###\s*VISÃO|$)/gi, '')
      .replace(/Start exactly with:[\s\S]*?(?=###\s*VISÃO|$)/gi, '')
      .trim();

    res.status(200).json({ 
      result: replyContent,
      reply: replyContent,
      modelUsed: modelUsed
    });

  } catch (error) {
    console.error("Erro interno no servidor:", error);
    res.status(500).json({ error: 'Erro interno na Serverless Function: ' + error.message });
  }
}
