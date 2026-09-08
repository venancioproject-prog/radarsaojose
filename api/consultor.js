/**
 * Serverless Function - Consultor Estratégico IA Radar São José
 * Backend seguro na infraestrutura Vercel que protege a GROQ_API_KEY.
 * Auto-descoberta dinâmica de modelos para garantir zero erros de depreciação/404.
 */

export default async function handler(req, res) {
  // Configuração de cabeçalhos CORS
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
    return res.status(405).json({ error: 'Método não permitido. Utilize POST.' });
  }

  try {
    const rawApiKey = process.env.GROQ_API_KEY || '';
    const apiKey = rawApiKey.trim();

    if (!apiKey) {
      console.error('[Consultor IA] ERRO CRÍTICO: GROQ_API_KEY não configurada em process.env.');
      return res.status(500).json({ 
        error: 'Chave de API da Groq (GROQ_API_KEY) não está configurada nas variáveis de ambiente da Vercel. Adicione em Project Settings > Environment Variables e faça um Redeploy.' 
      });
    }

    const { messages, question, context } = req.body || {};

    let chatMessages = [];

    const systemPrompt = `Você é o Consultor Estratégico Oficial do Radar São José 2026 (desenvolvido pelo Studio 8).
Sua missão é responder perguntas executivas e estratégicas sobre a pesquisa comportamental e municipal de São José dos Campos (SJC), seus dados quantitativos, qualitativos, os 10 personagens/personas, os 4 movimentos culturais (Geografia do Silêncio, A Cidade Prometida, A Tribo Global, O Empreendedorismo Intuitivo), e oportunidades de investimento e negócios.

Diretrizes:
- Seja executivo, analítico, persuasivo e empático com a realidade urbana e comercial de SJC.
- Baseie suas análises nos dados reais da pesquisa (ex: 64.7% de evasão para lazer fora de SJC, 72.4% de orgulho de morar, concentração Centro-Oeste vs polo Sul autossuficiente).
- Utilize formatação Markdown limpa (tópicos, negrito, números com 1 casa decimal).
${context ? `\nContexto específico de dados do usuário/filtro:\n${JSON.stringify(context)}` : ''}`;

    if (Array.isArray(messages) && messages.length > 0) {
      const hasSystem = messages.some(m => m.role === 'system');
      if (!hasSystem) {
        chatMessages.push({ role: 'system', content: systemPrompt });
      }
      chatMessages = chatMessages.concat(messages);
    } else if (question) {
      chatMessages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: question }
      ];
    } else {
      return res.status(400).json({ error: 'Parâmetro question ou messages é obrigatório no corpo da requisição.' });
    }

    // 1. AUTO-DESCOBERTA DINÂMICA: Consulta a lista oficial de modelos ativos na conta Groq
    let selectedModel = 'llama-3.3-70b-versatile';
    try {
      const modelsResp = await fetch('https://api.groq.com/openai/v1/models', {
        headers: { 'Authorization': `Bearer ${apiKey}` }
      });
      if (modelsResp.ok) {
        const modelsData = await modelsResp.json();
        const availableIds = (modelsData.data || []).map(m => m.id);
        console.log('[Consultor IA] Modelos ativos na Groq:', availableIds);

        // Prioridade de seleção automática
        const preferred = [
          availableIds.find(id => id.includes('llama-3.3-70b')),
          availableIds.find(id => id.includes('llama-3.1-70b')),
          availableIds.find(id => id.includes('llama-3.1-8b')),
          availableIds.find(id => id.includes('llama3-70b')),
          availableIds.find(id => id.includes('llama3-8b')),
          availableIds.find(id => id.includes('llama')),
          availableIds[0]
        ].filter(Boolean);

        if (preferred.length > 0) {
          selectedModel = preferred[0];
          console.log('[Consultor IA] Modelo auto-selecionado:', selectedModel);
        }
      } else {
        console.warn('[Consultor IA] Não foi possível listar modelos:', modelsResp.status);
      }
    } catch (eList) {
      console.warn('[Consultor IA] Exceção ao listar modelos:', eList.message);
    }

    // 2. Chamada de Chat Completions com o modelo validado
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: chatMessages,
        temperature: 0.6,
        max_tokens: 1500
      })
    });

    const respText = await groqResponse.text();

    if (!groqResponse.ok) {
      console.error('[Consultor IA] Erro na API da Groq:', groqResponse.status, respText);
      return res.status(groqResponse.status).json({
        error: `Erro retornado pela API da Groq (${groqResponse.status})`,
        modelUsed: selectedModel,
        details: respText
      });
    }

    const data = JSON.parse(respText);
    const replyText = data.choices?.[0]?.message?.content || 'Não foi possível gerar uma resposta no momento.';

    return res.status(200).json({
      success: true,
      reply: replyText,
      model: selectedModel,
      usage: data.usage || null
    });

  } catch (err) {
    console.error('[Consultor IA] Erro interno no servidor:', err);
    return res.status(500).json({ 
      error: 'Erro interno no servidor ao processar requisição do Consultor IA.',
      message: err.message 
    });
  }
}
