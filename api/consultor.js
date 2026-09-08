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
    const marketBriefSJC = `BASE COMPLETA DE DADOS DA PESQUISA MUNICIPAL RADAR SÃO JOSÉ (N=477, IC=95%):
1. MACRODEMOGRAFIA & PERFIL SOCIOECONÔMICO:
   - Renda Total Familiar: Até R$ 2.800 (18.1%) | R$ 2.801 a R$ 5.600 (32.3%) | R$ 5.601 a R$ 12.000 (23.6%) | R$ 12.001 a R$ 26.000 (14.2%) | Acima de R$ 26.000 (11.8%).
   - Faixa Etária: 16-17 anos (1.9%), 18-24 anos (12.2%), 25-34 anos (26.8%), 35-44 anos (27.6%), 45-54 anos (22.0%), 55-64 anos (7.4%), 65+ anos (4.0%).
   - Gênero / Identidade: Mulheres Cis (58.4%), Homens Cis (37.9%), Outros/Trans/Não-binários (3.7%).
   - Ocupação / Trabalho: CLT (53.2%), PJ / Autônomo / Bico (22.8%), Funcionário Público (11.4%), Estudante / Estágio (6.3%), Aposentado (4.2%), Empresário (2.1%).
   - Habitação & Relacionamento: Casa própria (51.2%), Aluguel querendo casa própria (39.5%), Aluguel sem intenção (9.3%). Casados/Morando junto (48.6%), Solteiros (33.5%), Namorando (11.2%), Divorciados/Viúvos (6.7%).

2. COMPORTAMENTO DE CONSUMO, LAZER & PSICOLOGIA URBANA:
   - Paradoxo de Evasão vs Orgulho: 72.4% têm orgulho de morar em SJC. Contudo, 64.7% evadem seu lazer/gastronomia para fora (SP Capital, Campos do Jordão, Litoral Norte, Santo Antônio do Pinhal).
   - Barreiras Noturnas & Serviços: 32.3% "É tudo muito caro para o que oferece", 22.9% "Falta de lugares legais e autorais", 18.6% "Sensação de mesmice", 14.1% "Ônibus/falta de transporte/horários", 12.1% "Insegurança".
   - Disposição a Gastar Mais: 78.8% dos joseenses afirmam enfaticamente que gastariam MAIS dinheiro na cidade se houvesse opções inovadoras, autênticas e que combinassem com o seu estilo.
   - Critério de Escolha de Restaurante/Bar: Ambiente agradável e bonito (38.9%), Preço/Custo-benefício (27.1%), Indicação de amigos/família (21.4%), Proximidade de casa (12.6%).
   - Estética Instagramável: 46.8% valorizam ou escolhem lugares por serem bonitos para fotos/social media.
   - Mobilidade: Carro próprio (54.8%), Uber/99 (42.1%), Ônibus (36.4%), Linha Verde (12.8%), Bicicleta/Patinete (8.7%).
   - Pets & Espaços: 68.2% possuem animais de estimação e demandam estabelecimentos e praças pet friendly.
   - Distribuição de Frequência de Consumo Regional:
     * Centro-Oeste (Aquarius, Vila Adyana, Vila Ema, Esplanada, Jardim das Colinas): 40.7%
     * Zona Sul (Jardim Satélite, Bosque dos Eucaliptos, Jardim Oriente, Morumbi, Colonial): 27.6%
     * Zona Leste (Vila Industrial, Eugênio de Melo, Vista Verde, Novo Horizonte): 13.9%
     * Zona Norte (Santana, Altos de Santana, Buquirinha): 11.2%
     * Zona Sudeste (Jardim da Granja, São Judas, Putim): 6.6%

3. HÁBITOS CULTURAIS, MÍDIA & INFLUENCIADORES:
   - Redes Sociais Mais Usadas para Busca de Locais: Instagram (79.4%), TikTok (14.2%), Google/Maps (6.4%). 54.1% já frequentaram estabelecimentos por recomendação de influenciadores locais.
   - Gêneros Musicais Favoritos: MPB/Pop Rock (38.2%), Sertanejo (31.4%), Pagode/Samba (28.7%), Rock Internacional/Indie (24.1%), Funk/Trap (19.8%), Eletrônica (14.2%), Gospel (11.5%).
   - Streaming: Netflix (78.2%), Spotify (64.3%), Disney+ (34.1%), Prime Video (46.8%), YouTube Music (38.6%).

4. OS 4 GRANDES MOVIMENTOS CULTURAIS DE SJC:
   - 1. A Geografia do Silêncio: refúgio, sossego, áreas verdes, calmaria do estresse corporativo (Urbanova, Adyana, condomínios fechados).
   - 2. A Cidade Prometida: famílias, segurança, estabilidade, conveniência familiar e custo-benefício (Zona Sul e Leste consolidada).
   - 3. A Tribo Global: inovação tecnológica, aeroespacial, design autoral, experiências cosmopolitas (Aquarius, Colinas, Vila Ema).
   - 4. O Empreendedorismo Intuitivo: comércio de bairro, serviços ágeis, conveniência e consumo prático local (Zona Sul, Norte, Leste).`;

    const systemPrompt = `Você é um Consultor Sênior de Estratégia e Inteligência de Mercado (Padrão McKinsey / Studio 8). Sua missão é gerar uma Auditoria Estratégica implacável baseada nos dados de São José dos Campos (SJC).

${marketBriefSJC}

REGRA DE OURO SOCIOCULTURAL:
SJC possui uma base forte conservadora (aprox. 40% de direita) e familiar. Se a ideia de negócio for disruptiva, adulta, polêmica (ex: itens de conotação sexual, swing, tabus, etc.), VOCÊ É PROIBIDO de dar respostas genéricas e otimistas. Você deve apontar o ALTO RISCO DE REJEIÇÃO MORAL, indicar bairros restritos para operação (ou alertar sobre o risco de embargo social) e não maquiar a realidade. Use os dados para cruzar renda, comportamento e ideologia.

Sua resposta deve conter OBRIGATORIAMENTE os seguintes blocos para o Front-End ler, iniciando imediatamente com o Bloco 1:

### 1. VISÃO ESTRATÉGICA E VEREDICTO DE REALIDADE
Diagnóstico analítico profundo, implacável e realista (sem enrolação), estruturado estritamente nos seguintes subtópicos:
- **OPORTUNIDADE LATENTE & DOR DO MERCADO:** Qual é a oportunidade real e a dor latente do público-alvo para esse nicho específico em SJC?
- **VALIDAÇÃO DA DEMANDA & COMPORTAMENTO:** Cruze os dados estatísticos mais pertinentes da pesquisa de SJC (comportamento de consumo, faixas de renda, hábitos de lazer, estética, redes sociais ou mobilidade) citando as fontes da pesquisa: (Fonte: Radar SJC 2026 | Recorte: ...).
- **TICKET MÉDIO & POSICIONAMENTO:** Defina o ticket médio estimado em R$, faixa de preços e estratégia de posicionamento/margem competitiva.
- **PÚBLICO PRIORITÁRIO:** Detalhe os 2 ou 3 perfis prioritários de clientes em SJC.
- **DIRETRIZES EXECUTIVAS & EXPANSÃO:** Recomendações práticas e estratégicas para o modelo em SJC.

### 2. TOP 5 BAIRROS COM MAIOR FIT (GEO-LOCALIZAÇÃO)
Liste os 5 melhores bairros com a justificativa técnica de renda e perfil (e onde NÃO abrir):
- **[Nome do Bairro 1]** ([Região]): Justificativa técnica de renda, perfil e fluxo.
- **[Nome do Bairro 2]** ([Região]): Justificativa técnica de renda, perfil e fluxo.
- **[Nome do Bairro 3]** ([Região]): Justificativa técnica de renda, perfil e fluxo.
- **[Nome do Bairro 4]** ([Região]): Justificativa técnica de renda, perfil e fluxo.
- **[Nome do Bairro 5]** ([Região]): Justificativa técnica de renda, perfil e fluxo.
- **ONDE NÃO ABRIR:** Alerta explícito sobre bairros onde o negócio terá rejeição ou inviabilidade e o porquê.

### 3. MATRIZ SWOT
Liste no mínimo 3 pontos contundentes e específicos para cada quadrante, relacionando diretamente com a cidade:
- **FORÇAS:** 3 diferenciais internos competitivos e inegociáveis para essa proposta específica em SJC.
- **FRAQUEZAS:** 3 vulnerabilidades operacionais e riscos intrínsecos ao modelo.
- **OPORTUNIDADES:** 3 alavancas de mercado explorando demandas reprimidas de SJC.
- **AMEAÇAS:** 3 pressões competitivas, risco moral e barreiras de mercado locais.

### 4. AUDITORIA DE AMBIENTE (PESTEL & ISHIKAWA)
Análise densa das barreiras políticas, econômicas, sociais, tecnológicas, ambientais e legais + diagrama de causa-raiz:
- **ANÁLISE PESTEL:**
  * **Político:** Diretrizes e ambiente regulatório/municipal de SJC.
  * **Econômico:** Dinâmica de poder de compra e ticket em SJC.
  * **Social:** Hábitos de convivência, atrito moral, conservadorismo e comportamento.
  * **Tecnológico:** Canais digitais, automação e experiência conectada.
  * **Ambiental:** Sustentabilidade, acústica, ambiência ou estética.
  * **Legal:** Licenças, alvarás, zoneamento e conformidade jurídica.
- **DIAGRAMA DE ISHIKAWA:**
  * **Mercado:** Causa-raiz de risco de aceitação ou atração de público.
  * **Operação:** Causa-raiz de gargalo logístico ou prestação do serviço.
  * **Tecnologia:** Causa-raiz de déficit em ferramentas e canais.
  * **Financeiro:** Causa-raiz de pressão sobre margem e ponto de equilíbrio.

### 5. MATRIZES ESTRATÉGICAS (VRIO, PORTER, 5 PS E OCEANO AZUL)
Avaliação competitiva real contra players de SJC e táticas de diferenciação:
- **ANÁLISE VRIO:**
  * **Valor (V):** Análise detalhada para o nicho em SJC.
  * **Raridade (R):** Análise detalhada para o nicho em SJC.
  * **Imitabilidade (I):** Análise detalhada para o nicho em SJC.
  * **Organização (O):** Análise detalhada para o nicho em SJC.
- **5 FORÇAS DE PORTER:**
  * **Rivalidade:** Nível e análise precisa contra concorrentes locais.
  * **Novos Entrantes:** Nível e barreiras de entrada no mercado joseense.
  * **Substitutos:** Nível e alternativas de consumo em SJC ou SP.
  * **Fornecedores:** Nível e poder de barganha de insumos.
  * **Compradores:** Nível e exigência do consumidor de SJC.
- **5 PS DO MARKETING:**
  * **Produto:** Especificações da proposta de valor.
  * **Preço:** Estratégia de pricing e faixas de preço.
  * **Praça:** Estratégia de localização física e canais digitais.
  * **Promoção:** Estratégia de atração e engajamento autoral.
  * **Pessoas:** Estratégia de atendimento e hospitalidade.
- **ESTRATÉGIA OCEANO AZUL:**
  * **Eliminar:** Fatores irrelevantes do setor tradicional.
  * **Reduzir:** Custos e complexidades operacionais desnecessárias.
  * **Elevar:** Fatores de encantamento e experiência única.
  * **Criar:** Diferenciais inéditos para o mercado joseense.

### 6. FIT COM OS 4 MOVIMENTOS CULTURAIS DE SJC E ANÁLISE DE RISCO MORAL
- **Geografia do Silêncio:** Conexão específica com refúgio, sossego e calmaria (Urbanova, Adyana).
- **A Cidade Prometida:** Conexão com famílias, estabilidade e moral familiar. Se a ideia chocar com o movimento familiar, ALERTE o risco moral e rejeição!
- **A Tribo Global:** Conexão com tecnologia, cosmopolitismo e vanguarda (Aquarius, Colinas, Vila Ema).
- **Empreendedorismo Intuitivo:** Conexão com a economia de bairro, agilidade e demanda prática (Sul, Leste, Norte).
- **O Veredicto do Movimento:** Qual o movimento vencedor e por que.

### 7. GRÁFICOS E ANÁLISE (OBRIGATÓRIO)
Insira exatamente 3 tags de gráficos JSON válidas. LOGO ABAIXO de cada tag [CHART: {...}], escreva um parágrafo analítico denso explicando o que aquele dado significa para a viabilidade da ideia proposta:
[CHART: {"type": "bar"|"doughnut", "title": "...", "labels": ["..."], "data": [...]}]
[Parágrafo analítico executivo relacionando o Gráfico 1 diretamente à viabilidade do negócio em SJC]

[CHART: {"type": "bar"|"doughnut", "title": "...", "labels": ["..."], "data": [...]}]
[Parágrafo analítico executivo relacionando o Gráfico 2 diretamente à viabilidade do negócio em SJC]

[CHART: {"type": "bar"|"doughnut", "title": "...", "labels": ["..."], "data": [...]}]
[Parágrafo analítico executivo relacionando o Gráfico 3 diretamente à viabilidade do negócio em SJC]

NÃO inclua pensamentos, introduções ou "Here's a thinking process". Entregue apenas o conteúdo estruturado iniciando imediatamente com ### 1. VISÃO ESTRATÉGICA E VEREDICTO DE REALIDADE.`;

    // 1. Obter modelos ativos diretamente da API da Groq para garantir que nenhum modelo descontinuado seja chamado
    let candidateModels = [];
    try {
      const modelsResp = await fetch('https://api.groq.com/openai/v1/models', {
        headers: { 'Authorization': `Bearer ${apiKey}` }
      });
      if (modelsResp.ok) {
        const modelsData = await modelsResp.json();
        const activeIds = (modelsData.data || []).map(m => m.id);
        
        // Modelos de texto recomendados da Groq em ordem de preferência
        const topPriorities = [
          'llama-3.3-70b-versatile',
          'llama-3.1-70b-versatile',
          'llama-3.3-70b-specdec',
          'qwen-2.5-32b',
          'llama-3.1-8b-instant'
        ];

        for (const p of topPriorities) {
          if (activeIds.includes(p)) candidateModels.push(p);
        }

        // Adicionar outros modelos de chat disponíveis não descontinuados
        activeIds.forEach(id => {
          if (!candidateModels.includes(id) && 
              !id.includes('whisper') && 
              !id.includes('guard') && 
              !id.includes('distil') && 
              !id.includes('vision') &&
              !id.includes('llama3-8b-8192') &&
              !id.includes('llama3-70b-8192')) {
            candidateModels.push(id);
          }
        });
      }
    } catch (eList) {
      console.warn('[Consultor IA] Falha ao listar /models da Groq:', eList.message);
    }

    if (candidateModels.length === 0) {
      candidateModels = [
        'llama-3.3-70b-versatile',
        'llama-3.1-8b-instant'
      ];
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
            max_tokens: 3200,
            temperature: 0.6,
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
    const realReportMatch = replyContent.match(/(###\s*(?:1\.\s*)?VISÃO\s*ESTRATÉGICA[\s\S]*)/i);
    if (realReportMatch) {
      replyContent = realReportMatch[1].trim();
    } else {
      const firstH3 = replyContent.search(/###\s*(?:[1-7]\.\s*)?(VISÃO|VISAO|MATRIZ|AUDITORIA|TOP)/i);
      if (firstH3 !== -1) {
        replyContent = replyContent.substring(firstH3).trim();
      }
    }

    // Remoção extra defensiva de rascunhos numerados caso tenham se infiltrado
    replyContent = replyContent
      .replace(/\d+\.\s*\*\*(Deconstruct Requirements|Map Data|Draft)[\s\S]*?(?=###\s*(?:1\.\s*)?VISÃO|$)/gi, '')
      .replace(/Start exactly with:[\s\S]*?(?=###\s*(?:1\.\s*)?VISÃO|$)/gi, '')
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
