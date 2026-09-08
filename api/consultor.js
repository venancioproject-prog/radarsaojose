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
    
    // BASE REAL CONSOLIDADA DO RADAR SÃO JOSÉ (DADOS DO CSV & APRESENTAÇÃO EXECUTIVA TXT)
    const realMarketDataSJC = `
DADOS REAIS CONSOLIDADOS DO MERCADO DE SÃO JOSÉ DOS CAMPOS (RADAR SJC 2026 - STUDIO 8 | N=476, IC=95%, Erro ±4.5%):
- População SJC: 737.310 habitantes, 99% taxa de urbanização, 2,8 moradores por domicílio, idade mediana 36 anos.
- Paradoxo Central: 72.4% têm ORGULHO de morar em SJC, mas 64.7% EVADEM consumo de lazer/gastronomia para outras cidades (São Paulo, Campos do Jordão, Litoral).
- Identidade e Conexão: 58.5% NÃO sentem que os eventos/lugares combinam com seu estilo.
- Barreira Financeira vs Experiência: 32.3% apontam "Preço alto para pouca entrega/experiência" como maior gargalo. 23.4% reclamam de falta de opções e mesmice.
- Concentração Geográfica de Consumo:
  * Centro-Oeste (Aquarius, Vila Adyana, Jd. Colinas): 40.7% da frequência de consumo.
  * Zona Sul (Satélite, Bosque, Oriente): 27.6% (Polo autossuficiente e vibrante, mas carente de sofisticação).
  * Zona Leste: 13.9% | Zona Norte: 11.2% | Sudeste: 6.6%.
- Demografia & Renda:
  * Idade: 35 a 44 anos (27.6%), 25 a 34 anos (26.8%), 45 a 54 anos (22.0%), 18 a 24 anos (12.2%), 55+ anos (11.4%).
  * Renda Familiar: Até R$ 2.800 (18.1%), R$ 2.800 a R$ 7.000 (32.3%), R$ 7.000 a R$ 15.000 (23.6%), R$ 15.000 a R$ 26.000 (14.2%), Acima de R$ 26.000 (11.8%).
  * Moradia: 58.7% possuem casa própria; 33.2% aluguel querendo casa própria.
- Mobilidade: 56.4% usam Carro Próprio, 22.8% Apps de Transporte (Uber/99), 16.5% Ônibus.
- Mercado Pet: 68.2% possuem pets e demandam espaços pet-friendly reais (não apenas tolerância).
- OS 4 MOVIMENTOS CULTURAIS MAPEADOS EM SJC:
  1. A GEOGRAFIA DO SILÊNCIO: Moradores que buscam refúgio, calmaria, privacidade, contato com a natureza e desaceleração do ritmo industrial.
  2. A CIDADE PROMETIDA: Famílias consolidadas e migrantes que vieram pela promessa de segurança, infraestrutura de ponta e qualidade de vida familiar.
  3. A TRIBO GLOBAL: Jovens, profissionais de tech, engenheiros e criativos hiperconectados com tendências globais, que exigem gastronomia autoral, design e vida noturna contemporânea.
  4. O EMPREENDEDORISMO INTUITIVO: A força autônoma local, prestadores de serviço e pequenos negócios que movimentam os bairros fora do eixo tradicional.
${context ? `\nRecorte Adicional da Sessão: ${JSON.stringify(context)}` : ''}`;

    const systemPrompt = `Você é o Consultor Executivo Sênior de Inteligência de Mercado e Estratégia de Negócios do 'Radar São José' (Padrão McKinsey / Bain & Company).

O usuário fornecerá uma ideia de negócio, produto ou serviço. Com base ESTRITAMENTE nos dados quantitativos e qualitativos do mercado de São José dos Campos (SJC) fornecidos no contexto:
${realMarketDataSJC}

Sua missão é gerar uma Auditoria Estratégica impecável, densa, executiva e analítica.

Gere o relatório completo formatado em Markdown, seguindo RIGOROSAMENTE a estrutura abaixo:

### 1. VISÃO ESTRATÉGICA E VEREDICTO
- Elabore um parágrafo executivo profundo avaliando o nicho de mercado, o potencial real de crescimento na cidade, barreiras invisíveis de entrada e os riscos macro em SJC.

### 2. MATRIZ SWOT
- **FORÇAS:** Apresente os diferenciais competitivos internos essenciais.
- **FRAQUEZAS:** Destaque os gargalos operacionais e dependências críticas.
- **OPORTUNIDADES:** Aponte janelas de mercado baseadas no comportamento do público local.
- **AMEAÇAS:** Liste fatores externos, regulatórios e pressões competitivas.

### 3. AUDITORIA DE AMBIENTE (PESTEL)
- Faça uma leitura sintética dos impactos: **Político, Econômico, Social, Tecnológico, Ambiental e Legal** aplicados diretamente ao negócio na região.

### 4. AS 5 FORÇAS DE PORTER
- Classifique o nível (Alta, Média ou Baixa) e traga a justificativa analítica para: **Rivalidade entre Concorrentes, Novos Entrantes, Ameaça de Substitutos, Poder de Barganha dos Fornecedores e Poder de Barganha dos Compradores**.

### 5. CONEXÃO ESTRATÉGICA COM OS 4 MOVIMENTOS CULTURAIS DE SJC
- **Análise Cruzada:** Demonstre de forma prática como a ideia de negócio se conecta, dialoga ou pode tracionar com cada um dos 4 movimentos culturais mapeados no ecossistema de São José dos Campos:
  1. Geografia do Silêncio
  2. A Cidade Prometida
  3. A Tribo Global
  4. O Empreendedorismo Intuitivo
- **O Veredicto do Movimento:** Identifique e justifique qual é **o melhor movimento cultural** para o empresário surfar prioritariamente, detalhando o fit de público e a alavanca de receita esperada.

### 6. OS 5 PS DO MARKETING
- Defina estrategicamente: **Produto, Praça, Pessoas, Preço e Promoção**.

### 7. POSICIONAMENTO FINAL (VRIO E OCEANO AZUL)
- **Matriz VRIO:** Avalie Valor, Raridade, Imitabilidade e Organização do negócio.
- **Estratégia Oceano Azul:** O que a empresa deve **Eliminar, Elevar, Reduzir e Criar** para se distanciar da concorrência tradicional.

---
**DIRETRIZ OBRIGATÓRIA DE VISUALIZAÇÃO DE DADOS (GRÁFICOS):**
Para garantir o dinamismo do painel executivo, você DEVE inserir obrigatoriamente **2 tags de gráficos** em locais estratégicos do texto (como na Visão Geral ou na SWOT). Utilize rigorosamente o formato de tag limpo: [GRAFICO: NOME_DO_DADO]. Escolha apenas entre as opções suportadas pelo sistema: [GRAFICO: IDADE], [GRAFICO: RENDA] ou [GRAFICO: REGIAO]. Não invente outros nomes de tags.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 3500, 
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
