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
    const contextString = typeof context === 'object' ? JSON.stringify(context) : (context || 'Pesquisa Municipal Radar São José 2026 - Studio 8');

    const systemPrompt = `Você é o Consultor Executivo de Inteligência de Mercado Sênior do 'Radar São José' (Studio 8).
O usuário fornecerá uma ideia de negócio ou nicho. Sua tarefa é gerar um relatório estratégico executivo e rigoroso, baseado ESTRITAMENTE nos dados de São José dos Campos (SJC) fornecidos no contexto e no estudo: ${contextString}.

Gere a sua resposta OBRIGATORIAMENTE formatada em Markdown, seguindo EXATAMENTE a estrutura abaixo:

### 1. VISÃO ESTRATÉGICA E VEREDICTO
- Escreva um parágrafo executivo resumindo o mercado, o potencial de crescimento da ideia e as barreiras de entrada invisíveis em SJC.

### 2. MATRIZ SWOT
- **FORÇAS:** Liste as principais forças.
- **FRAQUEZAS:** Liste as principais fraquezas.
- **OPORTUNIDADES:** Liste as principais oportunidades.
- **AMEAÇAS:** Liste as principais ameaças.

### 3. AUDITORIA DE AMBIENTE (PESTEL)
- Breve análise dos impactos em SJC: POLÍTICO, ECONÔMICO, SOCIAL, TECNOLÓGICO, AMBIENTAL e LEGAL.

### 4. 5 FORÇAS DE PORTER
- Classifique como Alta, Média ou Baixa e justifique rapidamente: RIVALIDADE, NOVOS ENTRANTES, SUBSTITUTOS, FORNECEDORES e COMPRADORES.

### 5. OS 4 MOVIMENTOS CULTURAIS (SJC)
- **Conexão Geral:** Explique de forma prática como a ideia de negócio pode se ancorar ou interagir com cada um dos 4 movimentos culturais mapeados em SJC:
  1. Geografia do Silêncio (busca por refúgio, calmaria e introspecção)
  2. A Cidade Prometida (famílias consolidadas buscando segurança, estabilidade e serviços de ponta)
  3. A Tribo Global (jovens e profissionais de tech conectados com tendências mundiais e gastronomia autoral)
  4. O Empreendedorismo Intuitivo (autônomos, prestadores e novos negócios locais)
- **O Movimento Vencedor:** Destaque qual é o MELHOR movimento cultural para a ideia do usuário e explique o porquê com base nos dados.

### 6. 5 PS DO MARKETING
- Defina: PRODUTO, PRAÇA, PESSOAS, PREÇO e PROMOÇÃO.

### 7. POSICIONAMENTO FINAL (OCEANO AZUL E VRIO)
- **VRIO:** Avalie Valor, Raridade, Imitabilidade e Organização.
- **Estratégia Oceano Azul:** O que a empresa deve ELIMINAR, ELEVAR, REDUZIR e CRIAR.

---
**REGRA DOS GRÁFICOS (CRÍTICO):** 
Para que o relatório seja visual e dinâmico, você DEVE inserir EXATAMENTE 2 tags de gráficos no meio da sua análise (distribua-as onde fizer mais sentido, como na Visão Estratégica, SWOT ou Movimentos). Use o formato exato: [GRAFICO: NOME_DO_DADO]. Você só pode escolher entre as seguintes tags: [GRAFICO: IDADE], [GRAFICO: RENDA], [GRAFICO: REGIAO].`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 3000, 
        temperature: 0.5,
        messages: [
          {
            role: 'system',
            content: systemPrompt
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

    res.status(200).json({ 
      result: replyContent,
      reply: replyContent
    });

  } catch (error) {
    console.error("Erro interno no servidor:", error);
    res.status(500).json({ error: 'Erro interno na Serverless Function: ' + error.message });
  }
}
