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

    // BASE SINTÉTICA SJC (STUDIO 8 | N=476):
    const marketBriefSJC = `DADOS SJC: População 737k hab (99% urbana). Renda familiar: <R$2.8k (18%), R$2.8k-7k (32%), R$7k-15k (24%), R$15k-26k (14%), >R$26k (12%). Idade: 18-24 (12%), 25-34 (27%), 35-44 (28%), 45-54 (22%), 55+ (11%). Comportamento: 72% orgulho, mas 65% evadem lazer/gastronomia para SP/Litoral/Campos. 58.5% sentem que as opções de SJC não combinam com seu estilo. Barreiras: 32% acham caro pelo que oferece, 23% falta de opções autorais/experiência, 19% mesmice. Regiões de consumo: Centro-Oeste 40.7%, Zona Sul 27.6%, Leste 13.9%, Norte 11.2%, Sudeste 6.6%. Saídas: 38% 2-3x/mês, 28% 1x/mês. 68% têm pets.
4 Movimentos Culturais: 1. Geografia do Silêncio (privacidade/refúgio) | 2. A Cidade Prometida (família/segurança/educação) | 3. A Tribo Global (tech/aeroespacial/inovação/autoral) | 4. Empreendedorismo Intuitivo (serviços/bairro).`;

    const systemPrompt = `Você é o Consultor Sênior de Inteligência de Mercado e Estratégia de Negócios do 'Radar São José' (Padrão Studio 8 / McKinsey & Company).
${marketBriefSJC}

DIRETRIZES:
- NUNCA escreva introduções, meta-comentários ou raciocínio. Comece DIRETO em "### VISÃO ESTRATÉGICA E VEREDICTO".
- Seja denso, executivo e direto ao ponto.
- Toda estatística deve conter: (Fonte: Radar SJC 2026 | Recorte: ...).
- Estruture rigorosamente nos blocos Markdown abaixo:

### VISÃO ESTRATÉGICA E VEREDICTO
Análise executiva concisa do nicho, barreiras e oportunidade em SJC.

### MATRIZ SWOT
- **FORÇAS:** Diferenciais internos chave.
- **FRAQUEZAS:** Gargalos operacionais.
- **OPORTUNIDADES:** Janelas de mercado em SJC.
- **AMEAÇAS:** Riscos e concorrência local.

### AUDITORIA DE AMBIENTE E CAUSALIDADE
- **ANÁLISE PESTEL:** Impactos Político, Econômico, Social, Tecnológico, Ambiental e Legal em SJC.
- **DIAGRAMA DE ISHIKAWA:** Causas-raiz por Mercado, Operação, Tecnologia e Financeiro.

### MATRIZES ESTRATÉGICAS E POSICIONAMENTO
- **ANÁLISE VRIO:** Valor (V), Raridade (R), Imitabilidade (I), Organização (O).
- **5 FORÇAS DE PORTER:** Níveis (Alto/Médio/Baixo) e motivos: Rivalidade, Novos Entrantes, Substitutos, Fornecedores, Compradores.
- **5 PS DO MARKETING:** Produto, Preço, Praça, Promoção, Pessoas.
- **ESTRATÉGIA OCEANO AZUL:** Eliminar, Reduzir, Elevar, Criar.

### O FIT ESTRATÉGICO COM OS 4 MOVIMENTOS CULTURAIS DE SJC
- **Análise Cruzada:** Conexão com Silêncio, Cidade Prometida, Tribo Global e Empreendedorismo Intuitivo.
- **O Veredicto do Movimento:** Qual movimento priorizar e justificativa.

[CHART: {"type": "bar", "title": "Distribuição de Consumo por Região SJC", "labels": ["Centro-Oeste", "Zona Sul", "Leste", "Norte", "Sudeste"], "data": [40.7, 27.6, 13.9, 11.2, 6.6]}]
[CHART: {"type": "doughnut", "title": "Paradoxo Evasão vs Orgulho SJC", "labels": ["Evadem Consumo", "Consomem Local"], "data": [64.7, 35.3]}]
[CHART: {"type": "pie", "title": "Principais Queixas no Consumo", "labels": ["Caro/Pouca Exp.", "Falta Autoral", "Mesmice", "Outros"], "data": [32.3, 22.9, 18.6, 26.2]}]`;

    // Obter lista dinâmica de modelos ativos na conta Groq
    let activeModels = [];
    try {
      const modelsResp = await fetch('https://api.groq.com/openai/v1/models', {
        headers: { 'Authorization': `Bearer ${apiKey}` }
      });
      if (modelsResp.ok) {
        const modelsData = await modelsResp.json();
        activeModels = (modelsData.data || []).map(m => m.id);
      }
    } catch (eList) {
      console.warn('[Consultor IA] Falha ao listar /models:', eList.message);
    }

    // Lista de modelos preferenciais na Groq (atuais e suportados)
    const preferredOrder = [
      'llama-3.3-70b-versatile',
      'llama-3.1-8b-instant',
      'llama3-70b-8192',
      'llama3-8b-8192'
    ];

    // Montar a lista de candidatos filtrando apenas o que existe na conta (ou fallback seguro)
    let candidateModels = [];
    if (activeModels.length > 0) {
      for (const pref of preferredOrder) {
        if (activeModels.includes(pref)) candidateModels.push(pref);
      }
      // Adicionar outros modelos llama disponíveis que não estejam na lista
      activeModels.filter(m => m.includes('llama') && !candidateModels.includes(m)).forEach(m => candidateModels.push(m));
    }

    if (candidateModels.length === 0) {
      candidateModels = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'];
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
            max_tokens: 1000,
            temperature: 0.3,
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

    // HIGIENIZAÇÃO RIGOROSA: Cortar tudo que vier antes da primeira seção real
    const firstH3 = replyContent.search(/###\s*(VISÃO|VISAO|MATRIZ|AUDITORIA)/i);
    if (firstH3 !== -1) {
      replyContent = replyContent.substring(firstH3).trim();
    }

    res.status(200).json({ 
      result: replyContent,
      reply: replyContent,
      modelUsed: selectedModel
    });

  } catch (error) {
    console.error("Erro interno no servidor:", error);
    res.status(500).json({ error: 'Erro interno na Serverless Function: ' + error.message });
  }
}
