module.exports = async function handler(req, res) {
  // 1. Configuração de Cabeçalhos CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  // 2. Interceptação do Preflight (OPTIONS)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 3. Bloqueio de métodos não-POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo nao permitido. Use POST.' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        body = {};
      }
    }
    body = body || {};

    const { user_input, question, prompt, idea, messages } = body;
    let inputContent = user_input || question || prompt || idea;
    if (!inputContent && Array.isArray(messages) && messages.length > 0) {
      const lastUserMsg = [...messages].reverse().find(m => m && m.role === 'user' && m.content);
      inputContent = lastUserMsg ? lastUserMsg.content : messages[messages.length - 1].content;
    }
    inputContent = String(inputContent || 'Consultoria estratégica de novos negócios para São José dos Campos').trim();
    const apiKey = (process.env.GROQ_API_KEY || '').trim();

    if (!apiKey) {
      return res.status(500).json({ 
        error: 'Chave GROQ_API_KEY nao configurada nas variaveis de ambiente da Vercel.',
        details: 'Adicione GROQ_API_KEY no painel da Vercel (Settings -> Environment Variables).'
      });
    }

    // BASE OFICIAL DE MICRODADOS DA PESQUISA MUNICIPAL RADAR SÃO JOSÉ (SUPABASE N=477, IC=95%, MARGEM DE ERRO ±4.5%)
    const marketBriefSJC = `BASE OFICIAL DE MICRODADOS DA PESQUISA MUNICIPAL RADAR SÃO JOSÉ (SUPABASE N=477, IC=95%, MARGEM DE ERRO ±4.5%):
1. MACRODEMOGRAFIA & PERFIL SOCIOECONÔMICO OFICIAL (FONTE: SUPABASE N=477):
   - Renda Total Familiar Mensal: Até R$ 2.800 (18.1%) | R$ 2.801 a R$ 5.600 (32.3%) | R$ 5.601 a R$ 12.000 (23.6%) | R$ 12.001 a R$ 26.000 (14.2%) | Acima de R$ 26.000 (11.8%).
   - Faixa Etária: 16-17 anos (1.9%), 18-24 anos (12.2%), 25-34 anos (26.8%), 35-44 anos (27.6%), 45-54 anos (22.0%), 55-64 anos (7.4%), 65+ anos (4.0%).
   - Identidade de Gênero: Mulheres (58.4%), Homens (37.9%), Outros (3.7%).
   - Ocupação / Trabalho: Carteira assinada / CLT (53.2%), PJ / Autônomo / Bico (22.8%), Funcionário Público (11.4%), Estudante / Estágio (6.3%), Aposentado (4.2%), Empresário (2.1%).
   - Habitação & Relacionamento: Casa própria (51.2%), Aluguel querendo casa própria (39.5%), Aluguel sem intenção (9.3%). Casados/Morando junto (48.6%), Solteiros (33.5%), Namorando (11.2%), Divorciados/Viúvos (6.7%).

2. PSICOGRAFIA, COMPORTAMENTO, DORES REAIS & PSICOLOGIA DO CONSUMIDOR JOSEENSE:
   - Paradoxo de Evasão vs Orgulho: 72.4% têm orgulho de morar em SJC. Contudo, 66.2% EVADEM seu consumo de lazer/gastronomia para fora (São Paulo Capital, Litoral Norte, Campos do Jordão, Santo Antônio do Pinhal). Motivo: busca por autenticidade, novidade e status que a cidade não entrega.
   - Frequência de Saída: 84.7% dos moradores saem regularmente para lazer e consumo gastronômico.
   - Demanda Reprimida & Disposição a Gastar: 75.8% dos joseenses afirmam categoricamente que gastariam MAIS dinheiro na cidade se houvesse opções inovadoras, autênticas e alinhadas ao seu estilo de vida (Nota de Auditoria: sinaliza demanda reprimida geral por experiências e lazer; a aderência à categoria específica do negócio deve ser validada por testes).
   - Barreiras Noturnas & Atritos de Consumo: 32.3% "É tudo muito caro para o que oferece (falta de valor percebido)", 22.9% "Falta de lugares legais e autorais (mesmice)", 18.6% "Sensação de mesmice e repetição de formato", 14.1% "Ônibus e mobilidade truncada", 12.1% "Insegurança percebida".
   - Critérios Reais de Escolha: Ambiente agradável, acolhedor e bonito (38.9%), Preço/Custo-benefício (27.1%), Indicação de amigos/família (21.4%), Proximidade geográfica (12.6%).
   - Estética Instagramável: 46.8% valorizam ou escolhem estabelecimentos por serem atraentes para fotos e redes sociais.
   - Cultura Pet-Friendly: 68.2% possuem animais de estimação e demandam estabelecimentos e praças que acolham pets.
   - Distribuição de Frequência de Consumo Regional:
     * Centro-Oeste (Aquarius, Vila Adyana, Vila Ema, Esplanada, Colinas): 40.7%
     * Zona Sul (Jardim Satélite, Bosque, Jardim Oriente, Morumbi, Colonial): 27.6%
     * Zona Leste (Vila Industrial, Eugênio de Melo, Vista Verde, Novo Horizonte): 13.9%
     * Zona Norte (Santana, Altos de Santana, Buquirinha): 11.2%
     * Zona Sudeste (Jardim da Granja, São Judas, Putim): 6.6%

3. HÁBITOS DIGITAIS, MÍDIA & INFLUENCIADORES:
   - Redes Sociais Mais Usadas para Busca de Locais e Referências: Instagram (79.4%), TikTok (14.2%), Google/Maps (6.4%). 54.1% já frequentaram estabelecimentos por recomendação de influenciadores locais.
   - Gêneros Musicais Favoritos: MPB/Pop Rock (38.2%), Sertanejo (31.4%), Pagode/Samba (28.7%), Rock Internacional/Indie (24.1%), Funk/Trap (19.8%), Eletrônica (14.2%), Gospel (11.5%).

4. A BÍBLIA DOS 4 MOVIMENTOS CULTURAIS DE SJC (LENTES COMPORTAMENTAIS OFICIAIS):
   - 01. A Geografia do Silêncio: Cultura da harmonia, sossego, refúgio e conformismo. Público focado em família, calmaria, segurança, shoppings e marcas consolidadas. Foge de atrito e agito excessivo (Foco: Urbanova, Vila Adyana).
   - 02. A Cidade Prometida: Matrizes conservadoras com alta expectativa de tecnologia, segurança e performance (estética Apple, ROI). Famílias tradicionais que valorizam estabilidade e conformidade moral (Foco: Zona Sul, Colinas).
   - 03. A Tribo Global: Elite técnica, engenheiros aeroespaciais e criativos cosmopolitas. Early adopters super exigentes que demandam padrão internacional de design, atendimento e gastronomia. Moram no eixo Aquarius/Vila Ema e evadem para SP por carência de oferta autoral em SJC (Foco: Aquarius, Vila Ema).
   - 04. Empreendedorismo Intuitivo: A economia real, de bairro e pragmática. Foco no sustento, velocidade, conveniência, WhatsApp, delivery ágil e custo-benefício (Foco: Zona Sul, Leste, Norte).

5. BANCO OFICIAL DE VERBATIMS E CITAÇÕES REAIS DE RESPONDENTES (PESQUISA QUALITATIVA RADAR SJC):
   - "Custo de vida de capital, com opções, salário e oportunidades de um interior... Coisas caras e sem qualidade." (Mulher, 25-34 anos, Zona Sul, R$ 5.6k - 12k)
   - "Falta aconchego humano, vida nas ruas. Fora centro comercial, shopping, supermercados e corredores, não há vida nas ruas de São José." (Mulher, 65+ anos, Centro-Oeste, R$ 5.6k - 12k)
   - "Eu entendo que São José tem muitas opções pra quem pode pagar e poucas pra quem não pode pagar. Em vários aspectos com relação a cultura, ao transporte." (Mulher, 25-34 anos, Zona Norte, R$ 2.8k - 5.6k)
   - "Cidade com direção política conservadora, falta arte, eventos públicos, os parques e feiras são bons. Mas poderíamos ter muito mais com o número de habitantes que temos." (Homem, 35-44 anos, Centro-Oeste, R$ 2.8k - 5.6k)
   - "Para lazer e cultura prefiro ir a São Paulo pois as opções aqui são limitadas e muitas vezes os eventos não são bem divulgados ou organizados." (Mulher, 35-44 anos, Centro-Oeste, R$ 12k - 25k)
   - "Sinto falta de uma vida cultural mais pulsante fora do eixo comercial. Mais eventos de rua e ocupação dos espaços públicos." (Homem, 25-34 anos, Centro-Oeste, R$ 5.6k - 12k)
   - "SJC tem potencial para ter eventos de grande porte, como festivais de música e gastronomia que atraiam pessoas de fora e segurem quem mora aqui." (Mulher, 25-34 anos, Zona Sul, R$ 5.6k - 12k)
   - "Uma cidade com poucos recursos para jovens." (Mulher, 35-44 anos, Zona Sul, R$ 2.8k - 5.6k)
   - "Lazer só pra quem tem dinheiro." (Mulher, 35-44 anos, Zona Leste, R$ 2.8k - 5.6k)`;

    const systemPrompt = `Você é um estrategista sênior de mercado, comportamento do consumidor e posicionamento territorial, especializado em São José dos Campos. Sua tarefa é auditar o negócio descrito pelo usuário usando exclusivamente a base oficial do Radar SJC e do Supabase (N=477, IC=95%, Erro ±4.5%) e produzir uma auditoria de elevada densidade analítica, rastreável, profunda e honesta sobre suas limitações e condições de validação.

PROPOSTA AUDITADA: O usuário fornecerá a ideia de negócio. Você DEVE contextualizar 100% da auditoria em torno desta ideia específica.

${marketBriefSJC}

HIERARQUIA DE CONFIANÇA & CONTROLE DE QUALIDADE:
- Evidência quantitativa: Dado oficial do Supabase N=477.
- Evidência qualitativa: Verbatim real com metadados demográficos.
- Inferência estratégica: Leitura lógica conectada ao negócio (deve ser nomeada como inferência / hipótese a validar).
- Hipótese a validar: Suposição que exige teste de baixo custo antes de investimento irreversível.
- Informação ausente: Dado não fornecido pelo usuário ou não coberto pela pesquisa.

PRINCÍPIO DE CAUSALIDADE & REGRAS METODOLÓGICAS OBRIGATÓRIAS:
1. NÃO CONFUNDA CORRELAÇÃO COM CAUSALIDADE: O fato de 75.8% dos joseenses afirmarem que gastariam mais com lazer/gastronomia indica demanda reprimida geral por experiências melhores, mas NÃO comprova demanda automática pela categoria de negócio específica. Apresente como sinal de oportunidade urbana de retenção e explicite a necessidade de validar a categoria e a disposição a pagar.
2. FONTE OFICIAL ESTATÍSTICA: Toda métrica quantitativa deriva estritamente da base oficial Supabase N=477 (IC=95%, Erro ±4.5%). A apresentação serve como contexto qualitativo e hipóteses.
3. BAIRROS SÃO SHORTLIST A INVESTIGAR: Apresente bairros como "Shortlist de áreas candidatas para validação de campo" (avaliando fluxo, aluguel, concorrência e público real), nunca como ranking comprovado.
4. ZONA DE EXCLUSÃO COM RIGOR: Não rotule regiões automaticamente como inviáveis e NUNCA invente "risco de inadimplência" sem dados. Aponte apenas atritos operacionais de ticket/formato e recomende teste antes de ponto fixo.
5. RIGOR NOS MOVIMENTOS CULTURAIS: Trate os 4 movimentos como lentes comportamentais, não como categorias demográficas censitárias ou garantias de compra. Aderência é uma hipótese que exige teste de oferta, preço e conversão.
6. ISHIKAWA COM EFEITO OBSERVÁVEL: O problema central deve ser um efeito observável mensurável (ex: "Risco de baixa conversão da intenção de consumo em compra recorrente com margem suficiente").
7. SEM JARGÃO DE VENDA: É proibido usar "mercado bilionário", "demanda comprovada", "garante viabilidade" ou "rejeição moral" sem dados específicos.
8. REGRA DE TITÂNIO DAS VERBALIZAÇÕES: Na chave 'verbalizacoes_reais', extraia 3 objetos com citações autênticas do banco fornecido. A chave 'genero' deve conter ESTRITAMENTE 'Homem' ou 'Mulher'.

7. RESPOSTA EXCLUSIVAMENTE EM JSON VÁLIDO: Retorne APENAS o objeto JSON abaixo, sem texto antes ou depois.

ESTRUTURA JSON EXATA E OBRIGATÓRIA:
{
  "visao_estrategica_texto": "Texto fluido e denso, focado em dor e comportamento do consumidor em SJC. Contém OBRIGATORIAMENTE uma tese central em **negrito**. Termina conectando a oportunidade à necessidade de validação prática e fazendo menção ao gráfico abaixo.",
  "grafico_validacao": {
    "titulo": "TÍTULO DO INDICADOR (EX: BARREIRAS DE CONSUMO E ATRITOS LOCAIS)",
    "type": "bar",
    "labels": ["Preço s/ Valor", "Falta Autoral", "Sensação Mesmice", "Transporte", "Insegurança"],
    "data": [32.3, 22.9, 18.6, 14.1, 12.1]
  },
  "verbalizacao_pesquisa": "\"Citação autêntica da pesquisa com fit na proposta.\"",
  "verbalizacoes_reais": [
    {
      "citacao": "Texto exato da citação real extraída do banco oficial...",
      "genero": "Mulher",
      "idade": "25-34 anos",
      "regiao": "Zona Sul",
      "renda": "R$ 5.6k - 12k"
    },
    {
      "citacao": "Texto exato da citação real extraída do banco oficial...",
      "genero": "Homem",
      "idade": "35-44 anos",
      "regiao": "Centro-Oeste",
      "renda": "R$ 12k - 25k"
    },
    {
      "citacao": "Texto exato da citação real extraída do banco oficial...",
      "genero": "Mulher",
      "idade": "25-34 anos",
      "regiao": "Zona Norte",
      "renda": "R$ 2.8k - 5.6k"
    }
  ],
  "bairros": [
    { "nome": "Nome do Bairro 1", "regiao": "Centro-Oeste", "justificativa": "Análise analítica de fit de público, ticket e validação de campo recomendada..." },
    { "nome": "Nome do Bairro 2", "regiao": "Zona Sul", "justificativa": "Análise analítica..." },
    { "nome": "Nome do Bairro 3", "regiao": "Região", "justificativa": "Análise analítica..." },
    { "nome": "Nome do Bairro 4", "regiao": "Região", "justificativa": "Análise analítica..." },
    { "nome": "Nome do Bairro 5", "regiao": "Região", "justificativa": "Análise analítica..." }
  ],
  "zona_exclusao": "NOME DA REGIÃO - Explicação densa e fundamentada (40-60 palavras) dos atritos estruturais, perfil de público, ticket ou formato que geram alto risco neste local.",
  "swot": {
    "forcas": ["Diferencial psicográfico 1", "Diferencial 2", "Diferencial 3"],
    "fraquezas": ["Gargalo operacional 1", "Vulnerabilidade de canal 2", "Gargalo 3"],
    "oportunidades": ["Demanda reprimida de retenção 1", "Alavanca de mercado 2", "Oportunidade 3"],
    "ameacas": ["Risco competitivo e substitutos 1", "Sensibilidade a preço 2", "Ameaça 3"]
  },
  "auditoria_ambiente": {
    "pestel": {
      "P": "Análise Política conectada à regulação, incentivos e diretrizes municipais em SJC...",
      "E": "Análise Econômica conectada à renda, inflação, custo de aluguel e poder de compra...",
      "S": "Análise Social & Cultural conectada ao comportamento, família, diversidade e adesão local...",
      "T": "Análise Tecnológica conectada à descoberta por Instagram (79.4%), WhatsApp e canais digitais...",
      "E_env": "Análise Ambiental conectada ao clima, sazonalidade, cultura pet-friendly (68.2%) e espaço urbano...",
      "L": "Análise Legal & Regulatória conectada a zoneamento, alvarás, proteção ao consumidor e compliance..."
    },
    "ishikawa": {
      "problema_central": "Inviabilidade de Retenção do Consumidor Local em SJC",
      "causas": [
        { "categoria": "Pessoas & Atendimento", "descricao": "Falta de treinamento, hospitalidade autêntica e agilidade resolutiva." },
        { "categoria": "Ambiente & Experiência", "descricao": "Sensação de mesmice, falta de aconchego autoral e apelo instagramável (46.8%)." },
        { "categoria": "Processos & Mobilidade", "descricao": "Atritos de trânsito, estacionamento escasso e logística de atendimento truncada." },
        { "categoria": "Produto & Percepção", "descricao": "Preço elevado sem entrega de valor percebido compatível ('coisas caras e sem qualidade')." }
      ]
    }
  },
  "matrizes_estrategicas": {
    "vrio": [
      { "letra": "V", "nome": "Valor", "analise": "Análise aprofundada específica de como este negócio cria valor real e reduz dores de consumo em SJC..." },
      { "letra": "R", "nome": "Raridade", "analise": "Análise aprofundada de diferenciação e raridade da oferta frente à concorrência no território..." },
      { "letra": "I", "nome": "Imitabilidade", "analise": "Análise das barreiras contra cópia (marca, curadoria, rede, ponto, know-how)..." },
      { "letra": "O", "nome": "Organização", "analise": "Análise da capacidade operacional e financeira interna para sustentar a entrega com margem..." }
    ],
    "porter": [
      { "forca": "Rivalidade entre Concorrentes", "analise": "Análise detalhada dos concorrentes diretos e indiretos no território escolhido em SJC..." },
      { "forca": "Ameaça de Novos Entrantes", "analise": "Análise das barreiras de capital, ponto comercial e fidelidade para novos concorrentes..." },
      { "forca": "Produtos Substitutos", "analise": "Análise do impacto da evasão para SP/Litoral (66.2%) e marketplaces digitais..." },
      { "forca": "Barganha dos Fornecedores", "analise": "Análise de dependência de fornecedores, prazos, exclusividade e custos de reposição..." },
      { "forca": "Barganha dos Clientes", "analise": "Análise da sensibilidade a preço e expectativa de custo-benefício do consumidor joseense..." }
    ]
  },
  "mix_marketing": {
    "cinco_ps": [
      { "p": "Produto", "analise": "Diretriz detalhada de mix de produtos, curva de qualidade, itens de entrada vs âncora para esta proposta..." },
      { "p": "Preço", "analise": "Estratégia precisa de precificação, posicionamento de valor e compatibilidade com a renda familiar alvo..." },
      { "p": "Praça", "analise": "Estratégia de canais físicos e digitais, ponto de venda e capilaridade no território..." },
      { "p": "Promoção", "analise": "Plano tático de comunicação local, Instagram (79.4%), criadores locais e ativação de comunidade..." },
      { "p": "Pessoas", "analise": "Padrão de treinamento, consultoria técnica, hospitalidade autêntica e retenção pós-venda..." }
    ],
    "oceano_azul": {
      "eliminar": "Fatores tradicionais que encarecem a operação ou geram atrito sem agregar valor ao cliente local...",
      "reduzir": "Elementos superdimensionados ou custos fixos que devem ser enxugados na operação...",
      "elevar": "Atributos de experiência, velocidade, atendimento e curadoria que devem superar a média da cidade...",
      "criar": "Diferenciais exclusivos inéditos que resolvam tensões culturais e capturem a demanda reprimida em SJC..."
    }
  },
  "movimentos_culturais": {
    "analise_cards": {
      "geografia_silencio": "Análise aprofundada de 2 frases avaliando como o público de refúgio, sossego e família (Urbanova/Adyana) reage especificamente a esta proposta.",
      "cidade_prometida": "Análise aprofundada de 2 frases avaliando o fit com famílias tradicionais e conservadoras (Zona Sul/Colinas) e possíveis barreiras morais ou de preço.",
      "tribo_global": "Análise aprofundada de 2 frases avaliando a receptividade do público cosmopolita, tech e early adopters (Aquarius/Vila Ema) frente ao negócio.",
      "empreendedorismo_intuitivo": "Análise aprofundada de 2 frases avaliando a aderência na economia real de bairro, velocidade e foco em custo-benefício."
    },
    "veredicto_final": {
      "nome_movimento": "A Tribo Global OU Empreendedorismo Intuitivo OU A Cidade Prometida OU A Geografia do Silêncio",
      "justificativa_densa": "Comece citando explicitamente a proposta do usuário e explicando, em um parágrafo denso e analítico (60-90 palavras), como este negócio específico interage com as características demográficas, o ticket médio e os hábitos da região de SJC correspondente ao movimento vencedor."
    }
  },
  "graficos_analiticos": [
    {
      "chart_data": {
        "type": "horizontalBar",
        "title": "Concentração e Frequência por Região (Geometria Urbana)",
        "labels": ["Centro-Oeste", "Zona Sul", "Zona Leste", "Zona Norte", "Zona Sudeste"],
        "data": [40.7, 27.6, 13.9, 11.2, 6.6],
        "highlight_index": 0
      },
      "pergunta_origem": "Qual região da cidade você mais frequenta quando sai de casa? (Supabase N=477)",
      "parecer_analitico": "Parecer analítico denso evidenciando a concentração no eixo Centro-Oeste (40.7%) e Zona Sul (27.6%) e a aderência territorial para o negócio."
    },
    {
      "chart_data": {
        "type": "doughnut",
        "title": "O Paradoxo de Evasão (Oportunidade Latente)",
        "labels": ["Evadem para SP/Litoral", "Consomem em SJC"],
        "data": [66.2, 33.8],
        "highlight_color": "#D97706"
      },
      "pergunta_origem": "Você costuma ir para outras cidades para passear ou comer fora? (Supabase N=477)",
      "parecer_analitico": "Parecer analítico cirúrgico explicando por que o negócio proposto atua na retenção do consumo de 66.2% que busca inovação fora de SJC."
    },
    {
      "chart_data": {
        "type": "bar",
        "title": "Distribuição de Renda Familiar por Fit",
        "labels": ["Até R$ 2.8k", "R$ 2.8k-5.6k", "R$ 5.6k-12k", "R$ 12k-26k", "Acima R$ 26k"],
        "data": [18.1, 32.3, 23.6, 14.2, 11.8],
        "highlight_label": "R$ 5.6k-12k"
      },
      "pergunta_origem": "Qual a renda total da sua casa por mês? (Supabase N=477)",
      "parecer_analitico": "Parecer analítico profundo comprovando a distribuição do poder de compra e a aderência do ticket médio do negócio."
    }
  ]
}`;

    // Lista de modelos oficiais e estáveis com fallbacks automáticos
    const configuredModel = (process.env.GROQ_MODEL || '').trim();
    const defaultModels = [
      'llama-3.3-70b-versatile',
      'llama-3.1-8b-instant',
      'mixtral-8x7b-32768',
      'gemma2-9b-it',
      'qwen/qwen3.6-27b',
      'llama3-70b-8192',
      'llama3-8b-8192'
    ];
    const candidateModels = configuredModel 
      ? [configuredModel, ...defaultModels.filter(m => m !== configuredModel)]
      : defaultModels;

    let replyContent = null;
    let modelUsed = null;
    const errorsList = [];

    const userPromptText = String(inputContent) + '\n\nIMPORTANTE: Responda ESTRITAMENTE com o objeto JSON válido começando imediatamente com `{` e terminando com `}`. Não inclua texto antes ou depois.';

    for (const model of candidateModels) {
      // Tentativa 1: Com json_object
      // Tentativa 2: Sem json_object (caso o modelo gere erro de validação)
      const attempts = [
        { response_format: { type: "json_object" } },
        { response_format: undefined }
      ];

      let modelSuccess = false;

      for (const formatOpt of attempts) {
        try {
          const payload = {
            model: model,
            max_tokens: 3000,
            temperature: 0.2,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPromptText }
            ]
          };
          if (formatOpt.response_format) {
            payload.response_format = formatOpt.response_format;
          }

          const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer ' + apiKey,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          });

          if (response.ok) {
            const data = await response.json();
            if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
              replyContent = data.choices[0].message.content;
              modelUsed = model;
              modelSuccess = true;
              break;
            }
          } else {
            const errText = await response.text();
            const errorMsg = 'Groq Status ' + response.status + ' (' + model + '): ' + errText;
            errorsList.push(errorMsg);
            console.warn('[Consultor IA] Tentativa falhou:', errorMsg);
          }
        } catch (err) {
          const errorMsg = 'Exceção (' + model + '): ' + err.message;
          errorsList.push(errorMsg);
          console.warn('[Consultor IA] Exceção:', errorMsg);
        }
      }

      if (modelSuccess) break;
    }

    if (!replyContent) {
      return res.status(500).json({
        error: 'Erro na API da Groq: ' + (errorsList[0] || 'Nenhum modelo respondeu com sucesso.'),
        details: errorsList.join(' | ')
      });
    }

    // Extracao segura de JSON
    let jsonResult = null;
    let cleanReply = replyContent.trim().replace(/^`(?:json)?\s*/i, '').replace(/\s*`$/i, '').trim();
    const firstBrace = cleanReply.indexOf('{');
    const lastBrace = cleanReply.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      cleanReply = cleanReply.substring(firstBrace, lastBrace + 1).trim();
    }

    try {
      jsonResult = JSON.parse(cleanReply);
    } catch (eJson) {
      const matchJson = replyContent.match(/\{[\s\S]*\}/);
      if (matchJson) {
        try { jsonResult = JSON.parse(matchJson[0]); } catch (eSub) {}
      }
    }

    return res.status(200).json({ 
      result: jsonResult || replyContent,
      reply: cleanReply,
      modelUsed: modelUsed
    });

  } catch (error) {
    return res.status(500).json({ 
      error: 'Erro interno no Servidor: ' + error.message,
      details: error.stack || error.message
    });
  }
};
