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

    const marketBriefSJC = `BASE COMPLETA DE DADOS DA PESQUISA MUNICIPAL RADAR SAO JOSE (N=477, IC=95%):
1. MACRODEMOGRAFIA & PERFIL SOCIOECONOMICO OFICIAL:
   - Renda Total Familiar: Ate R$ 2.800 (18.1%) | R$ 2.801 a R$ 5.600 (32.3%) | R$ 5.601 a R$ 12.000 (23.6%) | R$ 12.001 a R$ 26.000 (14.2%) | Acima de R$ 26.000 (11.8%).
   - Faixa Etaria: 16-17 anos (1.9%), 18-24 anos (12.2%), 25-34 anos (26.8%), 35-44 anos (27.6%), 45-54 anos (22.0%), 55-64 anos (7.4%), 65+ anos (4.0%).
   - Genero / Identidade: Mulheres Cis (58.4%), Homens Cis (37.9%), Outros/Trans/Nao-binarios (3.7%).
   - Ocupacao / Trabalho: CLT (53.2%), PJ / Autonomo / Bico (22.8%), Funcionario Publico (11.4%), Estudante / Estagio (6.3%), Aposentado (4.2%), Empresario (2.1%).
   - Habitacao & Relacionamento: Casa propria (51.2%), Aluguel querendo casa propria (39.5%), Aluguel sem intencao (9.3%). Casados/Morando junto (48.6%), Solteiros (33.5%), Namorando (11.2%), Divorciados/Viuvos (6.7%).

2. PSICOGRAFIA, DORES REAIS & PSICOLOGIA DO CONSUMIDOR JOSEENSE (METRICAS OFICIAIS):
   - Paradoxo de Evasao vs Orgulho: 72.4% tem orgulho de morar em SJC. Contudo, 66.2% EVADEM seu consumo de lazer/gastronomia para fora (SP Capital, Campos do Jordao, Litoral Norte, Santo Antonio do Pinhal). Motivo: busca por autenticidade, novidade e status que a cidade nao entrega.
   - Frequencia de Saida: 84.7% dos moradores saem regularmente para lazer e consumo gastronomico.
   - Demanda Reprimida & Disposicao a Gastar: 75.8% dos joseenses afirmam categoricamente que gastariam MAIS dinheiro na cidade se houvesse opcoes inovadoras, autenticas e alinhadas ao seu estilo de vida.
   - Barreiras Noturnas & Atritos Invisiveis: 32.3% "E tudo muito caro para o que oferece (falta de valor percebido)", 22.9% "Falta de lugares legais e autorais (mesmice)", 18.6% "Sensacao de mesmice e repeticao de formato", 14.1% "Onibus e mobilidade truncada", 12.1% "Inseguranca percebida".
   - Criterios Reais de Escolha: Ambiente agradavel, acolhedor e bonito (38.9%), Preco/Custo-beneficio (27.1%), Indicacao organica de amigos/familia (21.4%), Proximidade geografica de casa (12.6%).
   - Estetica Instagramavel & Validacao Social: 46.8% valorizam ou escolhem ativamente estabelecimentos por serem bonitos para fotos/redes sociais.
   - Cultura Pet-Friendly: 68.2% possuem animais de estimacao e demandam estabelecimentos e pracas abertas que acolham pets.
   - Distribuicao de Frequencia de Consumo Regional:
     * Centro-Oeste (Aquarius, Vila Adyana, Vila Ema, Esplanada, Colinas): 40.7%
     * Zona Sul (Jardim Satelite, Bosque, Jardim Oriente, Morumbi, Colonial): 27.6%
     * Zona Leste (Vila Industrial, Eugenio de Melo, Vista Verde, Novo Horizonte): 13.9%
     * Zona Norte (Santana, Altos de Santana, Buquirinha): 11.2%
     * Zona Sudeste (Jardim da Granja, Sao Judas, Putim): 6.6%

3. HABITOS CULTURAIS, MIDIA & INFLUENCIADORES:
   - Redes Sociais Mais Usadas para Busca de Locais: Instagram (79.4%), TikTok (14.2%), Google/Maps (6.4%). 54.1% ja frequentaram estabelecimentos por recomendacao de influenciadores locais.
   - Generos Musicais Favoritos: MPB/Pop Rock (38.2%), Sertanejo (31.4%), Pagode/Samba (28.7%), Rock Internacional/Indie (24.1%), Funk/Trap (19.8%), Eletronica (14.2%), Gospel (11.5%).

4. A BIBLIA DOS 4 MOVIMENTOS CULTURAIS DE SJC (DEFINICOES OFICIAIS OBRIGATORIAS):
   - 01. Geografia do Silencio: Cultura da harmonia, estabilidade e conformismo ('ta tudo bem'). Publico conservador, avesso a debates criticos. Focam em familia, tranquilidade, seguranca, shoppings e franquias seguras. Fogem de agito.
   - 02. Cidade Prometida: Nostalgicos do potencial tecnologico (ITA, Embraer). Querem que SJC volte a ser protagonista e inovadora globalmente. Cobram excelencia e performance (estetica Apple, ROI), mas mantem matrizes conservadoras.
   - 03. Tribo Global: A elite tecnica e cosmopolita. Early adopters super exigentes que demandam padrao internacional de gastronomia, design e etica. Trabalham e moram no eixo Aquarius/Vila Ema, mas gastam dinheiro em Sao Paulo porque acham a oferta de SJC basica e sem vibracao.
   - 04. Empreendedorismo Intuitivo: A economia real, de bairro e pragmatica. Foco no sustento, na velocidade e na resolucao imediata (WhatsApp, conveniencia, delivery agil). Pessoas da classe trabalhadora que valorizam o custo-beneficio e o relacionamento humano direto (sem frescuras).

5. BANCO DE VERBATIMS E CITACOES REAIS DE RESPONDENTES (PESQUISA QUALITATIVA RADAR SJC):
   - "Custo de vida de capital, com opcoes, salario e oportunidades de um interior... Coisas caras e sem qualidade." (Mulher Cis, 25-34 anos, Parque Industrial, PJ)
   - "Falta aconchego humano, vida nas ruas. Fora centro comercial, shopping, supermercados e corredores, nao ha vida nas ruas de Sao Jose." (Mulher Cis, 65+ anos, Oeste, Classe A/B)
   - "Eu entendo que Sao Jose tem muitas opcoes pra quem pode pagar e poucas pra quem nao pode pagar. Em varios aspectos com relacao a cultura, ao transporte." (Mulher Cis, 25-34 anos, Norte, Classe C)
   - "Cidade com direcao politica conservadora, falta arte, eventos publicos, os parques e feiras sao bons. Mas poderiamos ter muito mais com o numero de habitantes que temos." (Outros, 35-44 anos, Oeste, Classe C)
   - "Para lazer e cultura prefiro ir a Sao Paulo pois as opcoes aqui sao limitadas e muitas vezes os eventos nao sao bem divulgados ou organizados." (Mulher Cis, 35-44 anos, Oeste, Classe B)
   - "Sinto falta de uma vida cultural mais pulsante fora do eixo comercial. Mais eventos de rua e ocupacao dos espacos publicos." (Homem Cis, 25-34 anos, Centro, Classe B)
   - "SJC tem potencial para ter eventos de grande porte, como festivais de musica e gastronomia que atraiam pessoas de fora e segurem quem mora aqui." (Mulher Cis, 25-34 anos, Sul, Classe B)
   - "Uma cidade com poucos recursos para jovens." (Mulher Cis, 35-44 anos, Jd. Colonial, PJ)
   - "Lazer so pra quem tem dinheiro." (Mulher Cis, 35-44 anos, Jd. Santa Ines III, CLT)`;

    const systemPrompt = `Voce e o Socio-Diretor de Estrategia da McKinsey & Company. O usuario fornecera uma ideia de negocio. Sua missao e gerar uma Auditoria Estrategica IMPLACAVEL, DE ELEVADA DENSIDADE CONCEITUAL E RIGOR ANALITICO baseada estritamente nos dados oficiais do estudo municipal de Sao Jose dos Campos (N=477, IC=95%).

PROPOSTA AUDITADA: O usuario enviara o negocio a ser analisado no prompt do usuario. Voce DEVE contextualizar 100% da auditoria em torno desta ideia especifica.

${marketBriefSJC}

TRAVAS DRACONIANAS E PADRAO MCKINSEY DEFINITIVO (REGRAS DE OURO):
0. REGRA DE INTEGRIDADE QUANTITATIVA (ANTI-ALUCINACAO ESTATISTICA): Voce e EXPRESSAMENTE PROIBIDO de inventar porcentagens ou calcular estatisticas do zero. Use ESTRITAMENTE as metricas oficiais ja calculadas no relatorio (66.2% de Evasao; 75.8% gastariam mais; 84.7% saem regularmente; 32.3% barreira de preco/valor; 79.4% busca no Instagram).
1. REGRA DE SANIDADE LOGICA & FIT REALISTA: Adeque a estrategia a REALIDADE da ideia e do local. Negocios populares em bairros populares focam em giro rapido, custo-beneficio, delivery e Empreendedorismo Intuitivo.
2. TRAVA DE NARRATIVA (PROIBIDO DATA-DUMP): E terminantemente proibido listar porcentagens como lista de compras. Foco na psicologia do consumidor e cultura local.
3. TESE DE VIABILIDADE EM NEGRITO OBRIGATORIA: No meio do paragrafo de 'visao_estrategica_texto', escreva OBRIGATORIAMENTE uma tese central em formato Markdown Negrito (**frase de impacto definitiva**).
4. REGRA DE TITANIO (3 VERBALIZACOES REAIS COM DEMOGRAFIA DO CSV): Na chave 'verbalizacoes_reais', extraia 3 objetos com citacoes reais e metadados demograficos (genero, idade, regiao, renda). REGRA ESTRITA DE GENERO: A chave 'genero' deve conter estritamente 'Homem' ou 'Mulher'. E terminantemente proibido utilizar termos como 'Cis' ou outros qualificadores.
5. TRAVA GEOGRAFICA (ZONA DE EXCLUSAO OBRIGATORIA E DENSA): A chave 'zona_exclusao' deve conter a regiao seguida de um paragrafo explicativo duro (40-60 palavras).
6. BAIRROS ESTRUTURADOS: O array 'bairros' deve conter exatamente 5 bairros com justificativas fluidas.
7. REGRA DESTRUIDORA DE VIES & BIBLIA DOS 4 MOVIMENTOS CULTURAIS (ANALISE PROFUNDA & VEREDICTO EXATO):
   - Você DEVE cruzar o negócio proposto com CADA um dos 4 movimentos de São José dos Campos nas chaves de 'analise_cards' (geografia_silencio, cidade_prometida, tribo_global, empreendedorismo_intuitivo), explicando a adesão ou atrito de consumo de cada público.
   - Na chave 'veredicto_final.nome_movimento', você É ESTRITAMENTE PROIBIDO de retornar termos genéricos como 'Fit Cultural' ou 'Vencedor'. Você DEVE cravar EXATAMENTE um dos 4 nomes oficiais:
     * "A Geografia do Silêncio" (para negócios de refúgio, sossego, calmaria, família e baixa fricção).
     * "A Cidade Prometida" (para negócios focados em famílias tradicionais, segurança, alta performance e matrizes conservadoras).
     * "A Tribo Global" (para negócios de padrão internacional, tecnologia, gastronomia cosmopolita, design e alta sofisticação).
     * "Empreendedorismo Intuitivo" (para economia real de bairro, velocidade, praticidade, delivery e custo-benefício).
   - Na chave 'veredicto_final.justificativa_densa', E ESTRITAMENTE PROIBIDO usar frases prontas ou genericas como 'Posicionamento estrategico prioritario com base nas dinamicas de evasao'. Voce DEVE comecar a frase citando explicitamente a ideia do usuario e explicando, em um paragrafo denso e analitico de consultoria de alto padrao (60-90 palavras), como este negocio especifico interage com as caracteristicas demograficas, o ticket medio, a barreira de valor e os habitos da regiao de SJC correspondente ao movimento vencedor.
8. REGRA DO FRAMEWORK VRIO (4 PILARES OBRIGATORIOS V-R-I-O): O array 'matrizes_estrategicas.vrio' DEVE conter EXATAMENTE 4 objetos correspondentes as 4 dimensoes: 'V' (Valor), 'R' (Raridade), 'I' (Imitabilidade) e 'O' (Organizacao). NUNCA omita 'I' ou 'O'.
9. RESPOSTA EXCLUSIVAMENTE EM JSON VALIDO: Retorne APENAS o objeto JSON abaixo, sem texto antes ou depois.

ESTRUTURA JSON EXATA E OBRIGATORIA:
{
  "visao_estrategica_texto": "Texto fluido, focado em dor e comportamento. Contem OBRIGATORIAMENTE uma tese central em **negrito**. Termina fazendo mencao ao grafico abaixo.",
  "grafico_validacao": {
    "titulo": "TITULO ELEGANTE DO INDICADOR",
    "type": "bar",
    "labels": ["Indicador A", "Indicador B", "Indicador C"],
    "data": [45, 30, 25]
  },
  "verbalizacao_pesquisa": "\"Citacao autentica da pesquisa com fit na proposta.\"",
  "verbalizacoes_reais": [
    {
      "citacao": "Texto exato da citacao real extraida da pesquisa...",
      "genero": "Mulher",
      "idade": "25-34 anos",
      "regiao": "Zona Sul",
      "renda": "R$ 5.6k - 12k"
    },
    {
      "citacao": "Texto exato da citacao real extraida da pesquisa...",
      "genero": "Homem",
      "idade": "35-44 anos",
      "regiao": "Centro-Oeste",
      "renda": "R$ 12k - 25k"
    },
    {
      "citacao": "Texto exato da citacao real extraida da pesquisa...",
      "genero": "Mulher",
      "idade": "18-24 anos",
      "regiao": "Zona Leste",
      "renda": "R$ 2.8k - 5.6k"
    }
  ],
  "bairros": [
    { "nome": "Nome do Bairro 1", "regiao": "Regiao (ex: Centro-Oeste)", "justificativa": "Analise fluida..." },
    { "nome": "Nome do Bairro 2", "regiao": "Regiao (ex: Zona Sul)", "justificativa": "Analise fluida..." },
    { "nome": "Nome do Bairro 3", "regiao": "Regiao", "justificativa": "Analise fluida..." },
    { "nome": "Nome do Bairro 4", "regiao": "Regiao", "justificativa": "Analise fluida..." },
    { "nome": "Nome do Bairro 5", "regiao": "Regiao", "justificativa": "Analise..." }
  ],
  "zona_exclusao": "NOME DA REGIAO - Explicacao densa de por que fracassaria neste local.",
  "swot": {
    "forcas": ["Diferencial psicografico 1", "Diferencial 2", "Diferencial 3"],
    "fraquezas": ["Gargalo de percepcao 1", "Vulnerabilidade 2", "Gargalo 3"],
    "oportunidades": ["Demanda reprimida 1", "Alavanca 2", "Oportunidade 3"],
    "ameacas": ["Risco competitivo 1", "Atrito moral 2", "Ameaca 3"]
  },
  "auditoria_ambiente": {
    "pestel": {
      "P": "Analise Politica...",
      "E": "Analise Economica...",
      "S": "Analise Social...",
      "T": "Analise Tecnologica...",
      "E_env": "Analise Ambiental...",
      "L": "Analise Legal..."
    },
    "ishikawa": {
      "problema_central": "Inviabilidade de Retencao do Consumidor Local",
      "causas": [
        { "categoria": "Pessoas & Atendimento", "descricao": "Falta de hospitalidade autentica..." },
        { "categoria": "Ambiente & Experiencia", "descricao": "Sensacao de mesmice noturna..." },
        { "categoria": "Processos & Mobilidade", "descricao": "Atritos de transito e mobilidade..." },
        { "categoria": "Produto & Percepcao", "descricao": "Preco elevado sem entrega de valor..." }
      ]
    }
  },
  "matrizes_estrategicas": {
    "vrio": [
      { "letra": "V", "nome": "Valor", "analise": "Gera valor perceptivel resolvendo dores locais." },
      { "letra": "R", "nome": "Raridade", "analise": "Proposta diferenciada na micro-regiao." },
      { "letra": "I", "nome": "Imitabilidade", "analise": "Barreira de entrada sustentada por relacionamento ou custo." },
      { "letra": "O", "nome": "Organizacao", "analise": "Capacidade operacional de sustentar o padrao." }
    ],
    "porter": [
      { "forca": "Rivalidade entre Concorrentes", "analise": "Intensidade competitiva direta nos bairros." },
      { "forca": "Ameaca de Novos Entrantes", "analise": "Barreiras de entrada de capital e ponto." },
      { "forca": "Produtos Substitutos", "analise": "Alternativas de consumo ou evasao para SP." },
      { "forca": "Barganha dos Fornecedores", "analise": "Pressao de insumos no Vale do Paraiba." },
      { "forca": "Barganha dos Clientes", "analise": "Sensibilidade a preco e exigencia de qualidade." }
    ]
  },
  "mix_marketing": {
    "cinco_ps": [
      { "p": "Produto", "analise": "Portfolio e curva de qualidade." },
      { "p": "Preco", "analise": "Estrategia de precificacao compativel com a renda." },
      { "p": "Praca", "analise": "Canais fisicos, ponto e capilaridade." },
      { "p": "Promocao", "analise": "Comunicacao local e trafego organico." },
      { "p": "Pessoas", "analise": "Padrao de atendimento e hospitalidade." }
    ],
    "oceano_azul": {
      "eliminar": "Atritos e custos desnecessarios...",
      "reduzir": "Fatores tradicionais que encarecem...",
      "elevar": "Padroes de entrega e agilidade...",
      "criar": "Diferenciais autenticos..."
    }
  },
  "movimentos_culturais": {
    "analise_cards": {
      "geografia_silencio": "Escreva exatamente 2 frases curtas e diretas sobre como este publico especifico recebe a ideia do usuario, citando zonas como Urbanova ou Vila Adyana se houver fit.",
      "cidade_prometida": "Escreva exatamente 2 frases curtas e diretas avaliando o fit com as familias da Zona Sul ou Colinas, apontando se ha barreiras morais ou de preco.",
      "tribo_global": "Escreva exatamente 2 frases curtas e diretas avaliando o comportamento do publico do Aquarius/Vila Ema frente a proposta.",
      "empreendedorismo_intuitivo": "Escreva exatamente 2 frases curtas e diretas avaliando a recepcao na economia real de bairro e zonas perifericas ou satelites."
    },
    "veredicto_final": {
      "nome_movimento": "A Tribo Global OU Empreendedorismo Intuitivo OU A Cidade Prometida OU A Geografia do Silencio",
      "justificativa_densa": "É ESTRITAMENTE PROIBIDO usar frases prontas como 'Posicionamento estratégico prioritário com base nas dinâmicas de evasão'. Você DEVE começar a frase citando explicitamente a ideia do usuário e explicando, em um parágrafo denso e analítico de consultoria de alto padrão, como este negócio específico interage com as características demográficas, o ticket médio e os hábitos da região de SJC correspondente ao movimento vencedor."
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
      "pergunta_origem": "Em qual região de São José dos Campos você mais costuma frequentar para consumo e lazer?",
      "parecer_analitico": "Parecer analítico denso evidenciando o peso das regiões centrais vs periferias e onde o público-alvo da tese circula."
    },
    {
      "chart_data": {
        "type": "doughnut",
        "title": "O Paradoxo de Evasão (Oportunidade Latente)",
        "labels": ["Evadem para SP/Litoral", "Consomem em SJC"],
        "data": [66.2, 33.8],
        "highlight_color": "#D97706"
      },
      "pergunta_origem": "Você costuma consumir serviços gastronômicos e culturais fora de São José dos Campos? (Evasão)",
      "parecer_analitico": "Parecer analítico cirúrgico explicando por que o negócio proposto captura a evasão de 66.2% que busca novidade fora."
    },
    {
      "chart_data": {
        "type": "bar",
        "title": "Distribuição de Renda Familiar por Fit",
        "labels": ["Até R$ 2.8k", "R$ 2.8k-5.6k", "R$ 5.6k-12k", "R$ 12k-26k", "Acima R$ 26k"],
        "data": [18.1, 32.3, 23.6, 14.2, 11.8],
        "highlight_label": "R$ 5.6k-12k"
      },
      "pergunta_origem": "Qual é a faixa de renda familiar total mensal da sua residência? (IBGE / Radar SJC)",
      "parecer_analitico": "Parecer analítico profundo provando visualmente e com dados em qual faixa de renda está o poder de compra prioritário para esta tese."
    }
  ]
}`;

    const candidateModels = [
      'openai/gpt-oss-20b',
      'gpt-oss-20b',
      'openai/gpt-oss-120b',
      'gpt-oss-120b',
      'qwen/qwen-3.6-27b',
      'qwen-3.6-27b'
    ];

    let replyContent = null;
    let modelUsed = null;
    let lastError = null;

    for (const model of candidateModels) {
      try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + apiKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: model,
            response_format: { type: "json_object" },
            max_tokens: 2800,
            temperature: 0.2,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: String(inputContent) }
            ]
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
            replyContent = data.choices[0].message.content;
            modelUsed = model;
            break;
          }
        } else {
          const errText = await response.text();
          lastError = 'Groq Status ' + response.status + ' (' + model + '): ' + errText;
          console.warn('[Consultor IA] Falha no modelo ' + model + ':', lastError);
        }
      } catch (err) {
        lastError = err.message;
        console.warn('[Consultor IA] Excecao no modelo ' + model + ':', lastError);
      }
    }

    if (!replyContent) {
      return res.status(500).json({
        error: 'Erro na API da Groq: ' + (lastError || 'Nenhum modelo respondeu com sucesso.'),
        details: lastError
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
