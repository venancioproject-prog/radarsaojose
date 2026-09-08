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

    // BASE REAL CONSOLIDADA COMPLETA (CSV MUNICIPAL + ESTUDO STUDIO 8 SJC 2026):
    const realMarketDataSJC = `
DADOS COMPLETOS E REALISTAS DA PESQUISA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS (RADAR SJC - STUDIO 8 | N=476, IC=95%, Margem de Erro ±4.5%):
1. MACRODEMOGRAFIA & URBANISMO (IBGE & PESQUISA SJC):
   - População: 737.310 hab | 99% Urbanizada | Domicílios: 2,8 moradores/casa | Idade mediana: 36 anos.
   - Distribuição de Renda Familiar SJC:
     * Até R$ 2.800 (18.1%)
     * R$ 2.801 a R$ 7.000 (32.3%) -> Maior classe média produtiva
     * R$ 7.001 a R$ 15.000 (23.6%) -> Classe B em ascensão tecnológica
     * R$ 15.001 a R$ 26.000 (14.2%) -> Alta renda consolidada (Aquarius, Urbanova, Colinas)
     * Acima de R$ 26.000 (11.8%) -> Elite corporativa / aeroespacial
   - Distribuição Etária SJC:
     * 18 a 24 anos: 12.2%
     * 25 a 34 anos: 26.8% (Pilar de inovação, bares e consumo rápido)
     * 35 a 44 anos: 27.6% (Maior volume de decisão e gasto familiar)
     * 45 a 54 anos: 22.0% (Poder aquisitivo alto e estabilidade)
     * 55+ anos: 11.4% (Consumo de saúde, bem-estar e calmaria)

2. COMPORTAMENTO, FLUXOS E PARADOXOS LOCAIS:
   - Paradoxo do Orgulho vs Evasão: 72.4% têm ORGULHO de morar em SJC, mas 64.7% EVADEM seu consumo de lazer, gastronomia e cultura para outras cidades (SP, Campos do Jordão, Litoral).
   - O "Match" de Eventos e Identidade: 58.5% afirmam categoricamente que os lugares e opções da cidade NÃO combinam com seu estilo de vida.
   - As Barreiras da Noite e Serviços: 32.3% "É tudo muito caro para o que oferece (pouca experiência)" | 22.9% "Falta de lugares legais/autoriais" | 18.6% "Sensação de mesmice".
   - Região mais frequentada para consumo:
     * Centro-Oeste (Aquarius, Vila Adyana, Jardim das Colinas): 40.7%
     * Zona Sul (Jardim Satélite, Bosque dos Eucaliptos, Oriente): 27.6% (Polo autossuficiente)
     * Zona Leste: 13.9% | Zona Norte: 11.2% | Sudeste: 6.6%.
   - Frequência de Saída: 37.6% saem 2 a 3 vezes/mês (conservador e seletivo) | 28.4% 1 vez/mês | 19.5% toda semana.
   - Influenciadores e Redes: 61.2% usam Instagram para descobrir novidades, mas exigem curadoria estética real.
   - Mercado Pet: 68.2% possuem pets (alta demanda por pets bem-vindos em locais gastronômicos).
   - Moradia: 58.7% casa própria | 33.2% aluguel buscando comprar.

3. OS 4 MOVIMENTOS CULTURAIS MAPEADOS NO ESTUDO:
   1. A GEOGRAFIA DO SILÊNCIO: Busca por privacidade, sossego, refúgio verde, ar puro e desaceleração do estresse da indústria.
   2. A CIDADE PROMETIDA: Famílias que migraram ou vivem pela promessa de segurança, estabilidade, boa educação e infraestrutura de ponta.
   3. A TRIBO GLOBAL: Engenheiros, profissionais de tech (Embraer, INPE, startups), criativos e jovens cosmopolitas que exigem gastronomia autoral, tendências e estética contemporânea.
   4. O EMPREENDEDORISMO INTUITIVO: A pujança dos prestadores de serviço, microempresários e negócios de bairro que sustentam a economia real da Zona Sul, Leste e Norte.
${context ? `
Recorte em tempo real da sessão do usuário: ${JSON.stringify(context)}` : ''}`;

    const systemPrompt = `Você é o Consultor Sênior de Inteligência de Mercado e Estratégia de Negócios do 'Radar São José' (Padrão Studio 8 / McKinsey & Company).

DIRETRIZES DE FORMATAÇÃO E ESTRUTURA:
- NUNCA escreva textos de planejamento, raciocínio em inglês, análise prévia ou "Here's a thinking process".
- COMECE DIRETAMENTE na primeira linha com "### VISÃO ESTRATÉGICA E VEREDICTO".
- Siga rigorosamente os blocos analíticos abaixo em Markdown:

### VISÃO ESTRATÉGICA E VEREDICTO
Elabore um parágrafo executivo profundo analisando o nicho, o potencial real de crescimento na cidade, as barreiras invisíveis de entrada e a psicologia do consumo local em São José dos Campos.

### MATRIZ SWOT
- **FORÇAS:** Destaque os diferenciais competitivos internos essenciais do negócio.
- **FRAQUEZAS:** Aponte os gargalos operacionais, dependências e vulnerabilidades.
- **OPORTUNIDADES:** Mapeie janelas de mercado baseadas no comportamento do público joseense.
- **AMEAÇAS:** Liste fatores externos, pressões competitivas e riscos macro locais.

### AUDITORIA DE AMBIENTE E CAUSALIDADE
- **ANÁLISE PESTEL:** Leitura sintética dos impactos **Político, Econômico, Social, Tecnológico, Ambiental e Legal** aplicados ao negócio em SJC.
- **DIAGRAMA DE ISHIKAWA:** Sintetize o principal gargalo/problema mapeado cruzando: **Mercado**, **Operação**, **Tecnologia** e **Financeiro**.

### MATRIZES ESTRATÉGICAS E POSICIONAMENTO
- **ANÁLISE VRIO:** Avalie **Valor (V)**, **Raridade (R)**, **Imitabilidade (I)** e **Organização (O)** do negócio.
- **5 FORÇAS DE PORTER:** Classifique (Alta, Média ou Baixa) com a justificativa técnica para:
  * **Rivalidade entre Concorrentes:** [Nível] - Justificativa.
  * **Novos Entrantes:** [Nível] - Justificativa.
  * **Ameaça de Substitutos:** [Nível] - Justificativa.
  * **Poder dos Fornecedores:** [Nível] - Justificativa.
  * **Poder dos Compradores:** [Nível] - Justificativa.
- **5 PS DO MARKETING:** Defina de forma pragmática: **Produto, Preço, Praça, Promoção e Pessoas**.
- **ESTRATÉGIA OCEANO AZUL:** Matriz de 4 Ações:
  * **Eliminar:** O que deve ser eliminado.
  * **Reduzir:** O que deve ser reduzido.
  * **Elevar:** O que deve ser elevado acima do padrão da cidade.
  * **Criar:** O que deve ser criado como diferencial inédito em SJC.

### O FIT ESTRATÉGICO COM OS 4 MOVIMENTOS CULTURAIS DE SJC
- **Análise Cruzada:** Demonstre de forma prática como o negócio interage com cada um dos 4 movimentos:
  1. **Geografia do Silêncio:** Conexão e abordagem.
  2. **A Cidade Prometida:** Conexão e abordagem.
  3. **A Tribo Global:** Conexão e abordagem.
  4. **Empreendedorismo Intuitivo:** Conexão e abordagem.
- **O Veredicto do Movimento:** Identifique e justifique categoricamente qual é **o melhor movimento cultural** para o empresário surfar prioritariamente.

---
**OS 3 GRÁFICOS DINÂMICOS DE VALIDAÇÃO (OBRIGATÓRIO):**
Insira exatamente 3 tags no formato JSON ao longo do texto:
[CHART: {"type": "bar|doughnut|pie", "title": "Título do Indicador", "labels": ["A", "B", "C"], "data": [40.7, 27.6, 31.7]}]

**DIRETRIZ DE CITAÇÃO DE DADOS:**
Toda estatística deve conter entre parênteses: (Fonte: Radar SJC 2026 | Recorte: ...)`;

    // 1. Priorização de modelos Llama estáveis da Groq (não geram rascunho de pensamento)
    let selectedModel = 'llama-3.3-70b-versatile';
    try {
      const modelsResp = await fetch('https://api.groq.com/openai/v1/models', {
        headers: { 'Authorization': `Bearer ${apiKey}` }
      });
      if (modelsResp.ok) {
        const modelsData = await modelsResp.json();
        const available = (modelsData.data || []).map(m => m.id);
        
        if (available.includes('llama-3.3-70b-versatile')) {
          selectedModel = 'llama-3.3-70b-versatile';
        } else if (available.includes('llama-3.1-8b-instant')) {
          selectedModel = 'llama-3.1-8b-instant';
        } else if (available.find(id => id.includes('llama'))) {
          selectedModel = available.find(id => id.includes('llama'));
        }
      }
    } catch (eList) {
      console.warn('[Consultor IA] Falha ao listar /models:', eList.message);
    }

    // 2. Chamada de Chat Completions com limite seguro de 500 tokens
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: selectedModel,
        max_tokens: 500, 
        temperature: 0.4,
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
      return res.status(response.status).json({ 
        error: data.error?.message || 'Erro de comunicação com a Groq',
        modelUsed: selectedModel,
        details: JSON.stringify(data)
      });
    }

    let replyContent = data.choices?.[0]?.message?.content || 'Não foi possível obter resposta no momento.';

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
