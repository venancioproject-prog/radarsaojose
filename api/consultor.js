/**
 * Serverless Function - Consultor Estratégico IA Radar São José
 * Backend seguro na infraestrutura Vercel que protege a GROQ_API_KEY.
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
      console.error('[Consultor IA] ERRO CRÍTICO: GROQ_API_KEY não encontrada em process.env.');
      return res.status(500).json({ 
        error: 'Chave de API da Groq (GROQ_API_KEY) não está configurada ou está vazia nas variáveis de ambiente da Vercel. Adicione em Project Settings > Environment Variables e faça um Redeploy.' 
      });
    }

    const { messages, question, context, model: userModel } = req.body || {};

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

    // Lista de modelos suportados pela Groq em ordem de prioridade
    const candidateModels = [
      userModel,
      'llama-3.3-70b-versatile',
      'llama-3.1-8b-instant',
      'llama3-70b-8192',
      'llama3-8b-8192',
      'mixtral-8x7b-32768'
    ].filter(Boolean);

    let groqResponse = null;
    let lastErrorDetails = '';
    let lastStatus = 500;
    let successfulModel = null;

    for (const model of candidateModels) {
      try {
        console.log(`[Consultor IA] Tentando chamada Groq com modelo: ${model}`);
        
        const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: model,
            messages: chatMessages,
            temperature: 0.6,
            max_tokens: 1500
          })
        });

        if (resp.ok) {
          groqResponse = await resp.json();
          successfulModel = model;
          console.log(`[Consultor IA] Sucesso com o modelo: ${model}`);
          break;
        } else {
          lastStatus = resp.status;
          lastErrorDetails = await resp.text();
          console.warn(`[Consultor IA] Falha no modelo ${model} (Status ${resp.status}): ${lastErrorDetails}`);
        }
      } catch (errLoop) {
        console.warn(`[Consultor IA] Erro ao tentar modelo ${model}:`, errLoop.message);
        lastErrorDetails = errLoop.message;
      }
    }

    if (!groqResponse) {
      console.error('[Consultor IA] Todos os modelos candidatos falharam na Groq.');
      return res.status(lastStatus).json({ 
        error: `Erro na API da Groq (Status ${lastStatus})`, 
        details: lastErrorDetails 
      });
    }

    const replyText = groqResponse.choices?.[0]?.message?.content || 'Não foi possível gerar uma resposta no momento.';

    return res.status(200).json({
      success: true,
      reply: replyText,
      model: successfulModel,
      usage: groqResponse.usage || null
    });

  } catch (err) {
    console.error('[Consultor IA] Erro interno na Serverless Function /api/consultor:', err);
    return res.status(500).json({ 
      error: 'Erro interno no servidor ao processar requisição do Consultor IA.',
      message: err.message 
    });
  }
}
