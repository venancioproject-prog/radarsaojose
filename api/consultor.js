export default async function handler(req, res) {
  // CORS
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
    const apiKey = (process.env.GROQ_API_KEY || '').trim();

    if (!apiKey) {
      return res.status(500).json({ error: 'Chave GROQ_API_KEY não configurada na Vercel.' });
    }

    // =================================================================
    // PASSO 1: AUTO-DESCOBERTA (O FIM DA ROLETA RUSSA DE MODELOS)
    // =================================================================
    const modelsResponse = await fetch('https://api.groq.com/openai/v1/models', {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
    
    const modelsData = await modelsResponse.json();

    if (!modelsResponse.ok || !modelsData.data || modelsData.data.length === 0) {
      return res.status(500).json({ error: 'Sua chave não tem acesso a nenhum modelo ativo na Groq no momento.' });
    }

    // Procura o primeiro modelo Llama liberado para você (excluindo guard / prompt-guard). Se não achar, pega o 1º da lista.
    const availableModel = modelsData.data.find(m => m.id.includes('llama') && !m.id.includes('guard'))?.id || modelsData.data[0].id;
    console.log("Modelo selecionado automaticamente pela Vercel:", availableModel);

    // Montar payload de mensagens suportando tanto user_input quanto messages
    let formattedMessages = [];
    const systemPrompt = `Você é o Consultor Executivo de Inteligência de Mercado do 'Radar São José'. Seu conhecimento é baseado ESTRITAMENTE nos dados fornecidos neste contexto: ${typeof context === 'object' ? JSON.stringify(context) : (context || 'Pesquisa Municipal Radar São José 2026 - Studio 8')}. Responda às perguntas sobre viabilidade de negócios e comportamento em São José dos Campos. Seja analítico, use os dados para embasar seus conselhos e adote um tom executivo de alto nível (estilo McKinsey).`;

    if (Array.isArray(messages) && messages.length > 0) {
      const hasSystem = messages.some(m => m.role === 'system');
      if (!hasSystem) {
        formattedMessages.push({ role: 'system', content: systemPrompt });
      }
      formattedMessages = formattedMessages.concat(messages);
    } else {
      formattedMessages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: user_input || question || 'Apresente os principais insights do Radar São José 2026.' }
      ];
    }

    // =================================================================
    // PASSO 2: A CONSULTORIA COM O MODELO QUE FUNCIONA
    // =================================================================
    const chatResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: availableModel,
        max_tokens: 4096, 
        messages: formattedMessages
      })
    });

    const chatData = await chatResponse.json();

    if (!chatResponse.ok) {
      console.error("Erro retornado pela Groq:", chatData);
      return res.status(chatResponse.status).json({ error: chatData.error?.message || 'Erro de comunicação com a Groq' });
    }

    const replyContent = chatData.choices?.[0]?.message?.content || 'Não foi possível gerar uma resposta no momento.';

    // Retorna tanto `reply` quanto `result` para compatibilidade total com o front-end
    res.status(200).json({ 
      result: replyContent,
      reply: replyContent,
      modelUsed: availableModel
    });

  } catch (error) {
    console.error("Erro interno no servidor:", error);
    res.status(500).json({ error: 'Erro interno na Serverless Function: ' + error.message });
  }
}
