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

    const systemPrompt = `Você é o Consultor Sênior de Inteligência de Mercado e Estratégia de Negócios do 'Radar São José' (Padrão Studio 8 / McKinsey & Company).
${marketBriefSJC}

DIRETRIZES DE ESTILO E QUALIDADE:
- Comece DIRETO na primeira linha com "### VISÃO ESTRATÉGICA E VEREDICTO".
- NUNCA use asteriscos isolados, rascunhos ou introduções em inglês.
- OBRIGATÓRIO: Toda estatística ou dado deve conter a citação exata entre parênteses: (Fonte: Radar SJC 2026 | Recorte: ...).
- Nunca troque as regiões dos bairros (Aquarius, Adyana, Vila Ema = Centro/Oeste; Satélite, Bosque = Zona Sul; Vila Industrial, Vista Verde = Zona Leste; Santana = Zona Norte).
- Entregue rigorosamente a estrutura abaixo:

### VISÃO ESTRATÉGICA E VEREDICTO
Análise profunda e executiva do negócio em São José dos Campos, mapeando a oportunidade real, o público-alvo prioritário e o ticket médio recomendado.

### TOP BAIRROS COM MAIOR FIT (GEO-LOCALIZAÇÃO)
Aponte exatamente 5 bairros com o maior alinhamento para este negócio, indicando a região correta e o motivo do fit demográfico:
- **[Nome do Bairro 1]** ([Região]): Motivo do fit e público predominante.
- **[Nome do Bairro 2]** ([Região]): Motivo do fit e público predominante.
- **[Nome do Bairro 3]** ([Região]): Motivo do fit e público predominante.
- **[Nome do Bairro 4]** ([Região]): Motivo do fit e público predominante.
- **[Nome do Bairro 5]** ([Região]): Motivo do fit e público predominante.

### MATRIZ SWOT
- **FORÇAS:** Liste os diferenciais internos essenciais.
- **FRAQUEZAS:** Aponte vulnerabilidades e gargalos operacionais.
- **OPORTUNIDADES:** Mapeie janelas de mercado baseadas nos 64.7% de evasão e demandas de SJC.
- **AMEAÇAS:** Riscos e concorrência local.

### AUDITORIA DE AMBIENTE E CAUSALIDADE
- **ANÁLISE PESTEL:** Impactos Político, Econômico, Social, Tecnológico, Ambiental e Legal em SJC.
- **DIAGRAMA DE ISHIKAWA:** Causas-raiz por Mercado, Operação, Tecnologia e Financeiro.

### MATRIZES ESTRATÉGICAS E POSICIONAMENTO
- **ANÁLISE VRIO:** Valor (V), Raridade (R), Imitabilidade (I), Organização (O).
- **5 FORÇAS DE PORTER:** Níveis (Alto/Médio/Baixo) e justificativas técnicas para: Rivalidade, Novos Entrantes, Substitutos, Fornecedores, Compradores.
- **5 PS DO MARKETING:** Produto, Preço, Praça, Promoção, Pessoas.
- **ESTRATÉGIA OCEANO AZUL:** Eliminar, Reduzir, Elevar, Criar.

### O FIT ESTRATÉGICO COM OS 4 MOVIMENTOS CULTURAIS DE SJC
- **Análise Cruzada:** Demonstre a conexão com Geografia do Silêncio, A Cidade Prometida, A Tribo Global e Empreendedorismo Intuitivo.
- **O Veredicto do Movimento:** Identifique o movimento cultural dominante para posicionamento.

[CHART: {"type": "bar", "title": "Distribuição de Consumo por Região SJC", "labels": ["Centro-Oeste", "Zona Sul", "Zona Leste", "Zona Norte", "Sudeste"], "data": [40.7, 27.6, 13.9, 11.2, 6.6]}]
[CHART: {"type": "doughnut", "title": "Paradoxo de Evasão vs Orgulho em SJC", "labels": ["Evadem para SP/Litoral", "Consomem Localmente"], "data": [64.7, 35.3]}]
[CHART: {"type": "pie", "title": "Principais Barreiras Noturnas e de Serviços", "labels": ["Preço Alto / Pouca Experiência", "Falta de Lugares Autorais", "Sensação de Mesmice", "Outros Fatores"], "data": [32.3, 22.9, 18.6, 26.2]}]`;

    // 1. Obter modelos ativos diretamente da chave de API da Groq
    let candidateModels = [];
    try {
      const modelsResp = await fetch('https://api.groq.com/openai/v1/models', {
        headers: { 'Authorization': `Bearer ${apiKey}` }
      });
      if (modelsResp.ok) {
        const modelsData = await modelsResp.json();
        const availableIds = (modelsData.data || []).map(m => m.id);
        
        // Priorizar modelos de texto completos e excluir modelos de áudio/whisper/guard
        const chatModels = availableIds.filter(id => 
          !id.includes('whisper') && 
          !id.includes('guard') && 
          !id.includes('distil') &&
          !id.includes('vision')
        );

        // Ordenação inteligente: maiores/melhores primeiro
        const preferred = ['llama-3.3-70b-versatile', 'llama3-70b-8192', 'llama3-8b-8192', 'qwen/qwen3.8-27b', 'mixtral-8x7b-32768'];
        for (const p of preferred) {
          if (chatModels.includes(p)) candidateModels.push(p);
        }
        // Incluir os demais modelos disponíveis
        chatModels.forEach(m => {
          if (!candidateModels.includes(m)) candidateModels.push(m);
        });
      }
    } catch (eList) {
      console.warn('[Consultor IA] Falha ao listar /models:', eList.message);
    }

    if (candidateModels.length === 0) {
      candidateModels = ['llama-3.3-70b-versatile', 'llama3-70b-8192', 'llama3-8b-8192'];
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
            max_tokens: 2000,
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
