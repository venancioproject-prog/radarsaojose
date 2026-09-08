export default async function handler(req, res) {
  // CORS Headers
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
    const inputContent = user_input || question || (Array.isArray(messages) && messages.length > 0 ? messages[messages.length - 1].content : 'Apresente um resumo executivo dos dados do Radar São José.');
    const contextString = typeof context === 'object' ? JSON.stringify(context) : (context || 'Pesquisa Municipal Radar São José 2026 - Studio 8');

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'qwen/qwen3.8-27b',
        max_tokens: 4096, 
        messages: [
          {
            role: 'system',
            content: `Você é o Consultor Executivo de Inteligência de Mercado do 'Radar São José'. Seu conhecimento é baseado ESTRITAMENTE nos dados fornecidos neste contexto: ${contextString}. Responda às perguntas sobre viabilidade de negócios e comportamento em São José dos Campos. Seja analítico, use os dados para embasar seus conselhos e adote um tom executivo de alto nível (estilo McKinsey).`
          },
          {
            role: 'user',
            content: inputContent
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Erro retornado pela Groq:", data);
      return res.status(response.status).json({ error: data.error?.message || 'Erro de comunicação com a Groq' });
    }

    const replyContent = data.choices?.[0]?.message?.content || 'Não foi possível obter resposta no momento.';

    // Retorna tanto `result` quanto `reply` para compatibilidade total
    res.status(200).json({ 
      result: replyContent,
      reply: replyContent
    });

  } catch (error) {
    console.error("Erro interno no servidor:", error);
    res.status(500).json({ error: 'Erro interno na Serverless Function' });
  }
}
