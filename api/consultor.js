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
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.error('ERRO CRÍTICO: GROQ_API_KEY não configurada no ambiente da Vercel.');
      return res.status(500).json({ 
        error: 'Chave de API da Groq (GROQ_API_KEY) não configurada nas variáveis de ambiente da Vercel.' 
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
      // Se o frontend enviou histórico completo de mensagens
      const hasSystem = messages.some(m => m.role === 'system');
      if (!hasSystem) {
        chatMessages.push({ role: 'system', content: systemPrompt });
      }
      chatMessages = chatMessages.concat(messages);
    } else if (question) {
      // Se enviou apenas pergunta individual
      chatMessages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: question }
      ];
    } else {
      return res.status(400).json({ error: 'Parâmetro question ou messages é obrigatório no corpo da requisição.' });
    }

    // Endpoint oficial da Groq
    const groqEndpoint = 'https://api.groq.com/openai/v1/chat/completions';
    
    // Modelo oficial Groq
    const modelName = 'llama3-70b-8192';

    console.log(`[Consultor IA] Enviando requisição para ${groqEndpoint} com modelo ${modelName}...`);

    // Chamada oficial segura para a API da Groq
    const groqResponse = await fetch(groqEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: modelName,
        messages: chatMessages,
        temperature: 0.6,
        max_tokens: 1500
      })
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error(`[Consultor IA] Erro retornado pela API da Groq (Status ${groqResponse.status} ${groqResponse.statusText}):`, errorText);
      return res.status(groqResponse.status).json({ 
        error: `Erro na API da Groq: ${groqResponse.statusText}`, 
        status: groqResponse.status,
        details: errorText 
      });
    }

    const data = await groqResponse.json();
    console.log('[Consultor IA] Resposta recebida com sucesso da Groq.');
    
    const replyText = data.choices?.[0]?.message?.content || 'Não foi possível gerar uma resposta no momento.';

    return res.status(200).json({
      success: true,
      reply: replyText,
      model: data.model || modelName,
      usage: data.usage || null
    });

  } catch (err) {
    console.error('[Consultor IA] Erro interno na Serverless Function /api/consultor:', err);
    return res.status(500).json({ 
      error: 'Erro interno no servidor ao processar requisição do Consultor IA.',
      message: err.message 
    });
  }
}
