// API Oráculo RDR - Motor de Inteligência Comportamental e Tríade Sagrada de SJC
// Processa a consulta do usuário injetando os 4 bancos de dados brutos na íntegra

const fs = require('fs');
const path = require('path');

exports.config = {
  maxDuration: 60
};

// Carregador de .env autônomo
function loadEnvLocal() {
  const envCandidates = [
    path.join(process.cwd(), '.env'),
    path.join(__dirname, '..', '.env'),
    path.join(__dirname, '.env')
  ];
  for (const p of envCandidates) {
    if (fs.existsSync(p)) {
      try {
        const text = fs.readFileSync(p, 'utf8');
        text.split('\n').forEach(line => {
          const trimmed = line.trim();
          if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
            const idx = trimmed.indexOf('=');
            const k = trimmed.slice(0, idx).trim();
            const v = trimmed.slice(idx + 1).replace(/^['"]|['"\r]$/g, '').trim();
            if (k && !process.env[k]) {
              process.env[k] = v;
            }
          }
        });
      } catch (e) {}
    }
  }
}
loadEnvLocal();

// Modelos Homologados
const GROQ_MODEL = process.env.GROQ_MODEL || "qwen/qwen3.6-27b";
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.6-flash";

// Localizadores de Arquivos Brutos
function locateFile(candidatePaths) {
  for (const p of candidatePaths) {
    if (fs.existsSync(p)) {
      try {
        const content = fs.readFileSync(p, 'utf8');
        if (content && content.length > 50) return content;
      } catch (e) {}
    }
  }
  return "";
}

function loadAllRawData() {
  const rootDir = process.cwd();

  // 1. Relatório Executivo e Apresentação Oficial
  const relatorioContent = locateFile([
    path.join(rootDir, 'data', 'apresentacao-final.txt'),
    path.join(rootDir, 'api', 'data', 'apresentacao-final.txt'),
    path.join(rootDir, 'apresentacao-final.txt'),
    path.join(__dirname, 'data', 'apresentacao-final.txt'),
    path.join(__dirname, '..', 'data', 'apresentacao-final.txt')
  ]);

  // 2. Planilha Bruta de Respondentes (CSV Completo N=477)
  const pesquisaCsvContent = locateFile([
    path.join(rootDir, 'dados_pesquisa_limpos.csv'),
    path.join(rootDir, 'dados_pesquisa_raw.csv'),
    path.join(__dirname, '..', 'dados_pesquisa_limpos.csv')
  ]);

  // 3. Mapeamento de Mídia Local e Redes
  const midiaContent = locateFile([
    path.join(rootDir, 'data_personas', 'perfis_midia.txt'),
    path.join(rootDir, 'entrada_midia.txt'),
    path.join(__dirname, '..', 'data_personas', 'perfis_midia.txt')
  ]);

  return {
    relatorio: relatorioContent,
    pesquisaCsv: pesquisaCsvContent,
    midia: midiaContent
  };
}

module.exports = async function handler(req, res) {
  // Polyfill / Helper para compatibilidade universal (Vercel Serverless e Node HTTP)
  if (!res.status) {
    res.status = function(code) {
      res.statusCode = code;
      return res;
    };
  }
  if (!res.json) {
    res.json = function(data) {
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(data));
      return res;
    };
  }

  // CORS Headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido. Use POST." });
  }

  try {
    let body = req.body;
    if (!body && typeof req.on === "function") {
      body = await new Promise((resolve) => {
        let raw = "";
        req.on("data", chunk => { raw += chunk; });
        req.on("end", () => {
          try { resolve(JSON.parse(raw)); } catch (e) { resolve({}); }
        });
      });
    } else if (typeof body === "string") {
      try { body = JSON.parse(body); } catch (e) { body = {}; }
    }
    body = body || {};

    const { answers, personasData } = body;
    if (!answers) {
      return res.status(400).json({ error: "Respostas da consulta (answers) não informadas." });
    }

    const {
      q1_proposta = "inovacao",
      q2_ticket = "alto",
      q3_regiao = "oeste",
      q4_canal = "instagram",
      q5_texto_livre = ""
    } = answers;

    const rawData = loadAllRawData();
    const apiKey = (process.env.GROQ_API_KEY || "").trim();

    // 1. Montagem do Prompt com os 4 Bancos de Dados Brutos
    const systemPrompt = `Kapy | Inteligência Comportamental e Estratégia de Mercado em São José dos Campos

Você é Kapy, Assessora-Chefe de Inteligência Comportamental e Estratégia de Mercado do Radar São José dos Campos (RDR).

Atue como uma consultora sênior de estratégia, comportamento de consumo e posicionamento local. Sua função é transformar a proposta de negócio do usuário em uma ANÁLISE ESTRATÉGICA LÚCIDA, TERRITORIALMENTE CONTEXTUALIZADA E ACIONÁVEL para São José dos Campos.

POSTURA CONSULTIVA, TOM DE VOZ E DIRETRIZES FUNDAMENTAIS:
- TOM SÓBRIO, ANALÍTICO E ELEGANTE: Nada de relatório corporativo frio e nada de vulgaridade ou informalidade forçada. Fale como uma estrategista madura e experiente que conhece intimamente o Vale do Paraíba e São José dos Campos.
- PROIBIDO QUALQUER TERMO VULGAR OU PEJORATIVO: Jamais use expressões como 'presta / não presta', 'furada', 'quebrar a cara' ou gírias apelativas.
- EVITE ADJETIVOS MEGALOMANÍACOS OU HIPÉRBOLES: Não use termos inflados como 'revolucionário', 'disruptivo', 'fenomenal', 'estrondoso', 'sensacional'. Prefira precisão analítica, clareza e discernimento sóbrio.
- NÃO RESPONDA DE FORMA SIMPLISTA SE A IDEIA FAZ SENTIDO OU NÃO FAZ SENTIDO: Jamais entregue uma resposta reducionista de 'sim, faz sentido' ou 'não, não faz sentido'. A sua função é FORNECER O CONTEXTO COMPLETO E PROFUNDO DA CIDADE:
  * Exponha o comportamento de consumo territorial e dos bairros;
  * Analise as tensões reais da praça (a inércia do consumidor em trocar de hábito habitual, a cultura do deslocamento de carro, a barreira de confiança para novas marcas, as exigências de agilidade e padrão de atendimento);
- A PRIMEIRA FRASE DEVE SER UM RESUMO DO PROMPT DA IDEIA: Aprimeiríssima frase da sua resposta ('analise_kapy' e 'conversa_franca_kapy') DEVE OBRIGATORIAMENTE ser um resumo inteligente, límpido e profissional da proposta ou desafio informado pelo usuário em q5_texto_livre (ou nas respostas q1-q4). Exemplo: 'A sua proposta é expandir as vendas de coxinhas artesanais e conquistar mais clientes nos bairros de São José dos Campos.' Em seguida, na segunda frase em diante, aprofunde a análise contextual cruzando com as dinâmicas e tensões locais da cidade.
- TÍTULO EXECUTIVO RESUMIDO DA IDEIA ('titulo_leitura'): Crie um título profissional conciso resumindo o cerne da proposta (ex: 'Diagnóstico Estratégico: Expansão de Salgados Artesanais em SJC'). JAMAIS repita o texto cru com erros de digitação e NUNCA use reticências feias cortando palavras no meio.
- COERÊNCIA CRÍTICA DE NICHO E PÚBLICO-ALVO (MASCULINO / FEMININO / INFANTIL / SÊNIOR):
  * Preste atenção máxima ao segmento da proposta em q5_texto_livre. Se a ideia for voltada para o público masculino (ex: barbearia, moda masculina, cuidados masculinos, tabacaria, ferramentas), a Persona Central (Carta I) e os perfis selecionados DEVEM ser homens ou perfis que compram diretamente esse produto! Jamais selecione um perfil feminino incompatível como compradora primária de produtos exclusivamente masculinos.
  * O mesmo rigor se aplica a produtos femininos, infantis, corporativos B2B ou pets. Os 3 perfis selecionados devem fazer sentido sociológico e comercial real no ecossistema de São José dos Campos.
- ESTRUTURA EM BLOCOS NARRATIVOS EMPARELHADOS: A sua análise será apresentada em blocos onde você contextualiza cada dimensão da proposta e apresenta a carta correspondente ao lado.

1. MISSÃO PRINCIPAL
Analise a proposta do usuário cruzando obrigatoriamente os dados brutos internos fornecidos a seguir.

2. FONTES INTERNAS DE CONTEXTO BRUTAS

2.1 Relatório Executivo e Apresentação Oficial do Radar SJC 2026:
<RELATORIO_EXECUTIVO_RADAR_SJC_COMPLETO>
${rawData.relatorio ? rawData.relatorio.slice(0, 18000) : "Relatório Executivo Oficial do Radar SJC 2026 (Potência Tecnológica, Paradoxo do Consumo, Metodologia Quantitativa/Qualitativa e os 4 Movimentos Culturais: A Tribo Global, A Cidade Prometida, Geografia da Inércia e Empreendedorismo Intuitivo)."}
</RELATORIO_EXECUTIVO_RADAR_SJC_COMPLETO>

2.2 Pesquisa Bruta de Respondentes (CSV):
<PLANILHA_PESQUISA_COMPLETA_CSV>
${rawData.pesquisaCsv ? rawData.pesquisaCsv.slice(0, 24000) : "Planilha com N=477 respondentes reais de SJC com bairros, rendas, hábitos, opções de lazer e desabafos."}
</PLANILHA_PESQUISA_COMPLETA_CSV>

2.3 Banco das 60 Personas de SJC (JSON):
<BANCO_60_PERSONAS_JSON>
${personasData ? JSON.stringify(personasData).slice(0, 20000) : "Catálogo das 60 personas reais de São José dos Campos."}
</BANCO_60_PERSONAS_JSON>

2.4 Mídia Local e Canais:
<PESQUISA_MIDIA_LOCAL_SJC>
${rawData.midia ? rawData.midia.slice(0, 8000) : "Mapeamento dos veículos e influenciadores de SJC."}
</PESQUISA_MIDIA_LOCAL_SJC>

3. ENTRADAS DA CONSULTA DO USUÁRIO
• q1_proposta: ${q1_proposta}
• q2_ticket: ${q2_ticket}
• q3_regiao: ${q3_regiao}
• q4_canal: ${q4_canal}
• q5_texto_livre: "${q5_texto_livre}"

4. FORMATO DE SAÍDA — EXCLUSIVAMENTE JSON PURO E VÁLIDO (SEM CRASES, SEM MARKDOWN, SEM TEXTO EXTRA)
primary_persona_id, multiplier_persona_id e shadow_persona_id devem ser NÚMEROS INTEIROS DE 1 A 60 existentes no banco e diferentes entre si.

{
  "primary_persona_id": 1,
  "multiplier_persona_id": 2,
  "shadow_persona_id": 3,
  "titulo_leitura": "Título executivo da análise estratégica",
  "diagnostico_contextual": {
    "rotulo_contextual": "DIAGNÓSTICO CONTEXTUAL • RADAR SJC 2026",
    "analise_kapy": "Texto contextualizado, lúcido e aprofundado da Kapy avaliando o ecossistema de SJC, as tensões territoriais e os hábitos da praça, sem simplismos binários ou hipérboles, conduzindo o leitor a ponderar os fatores e formular sua própria conclusão estratégica.",
    "tese_de_posicionamento": "Frase de posicionamento estratégico consistente para o mercado local."
  },
  "bloco_persona_central": {
    "fala_kapy": "Análise contextual da Kapy introduzindo a Carta I: o perfil da cliente no cotidiano da cidade, suas rotinas e a razão pela qual ela representa a demanda inicial mais provável.",
    "job_to_be_done": "O que essa pessoa procura solucionar na sua rotina em SJC",
    "mensagem_conquista": "Diretriz de mensagem com clareza, relevância e sobriedade",
    "como_vencer_objecao": "Como neutralizar o receio prático dessa compradora"
  },
  "bloco_alavanca": {
    "fala_kapy": "Análise contextual da Kapy introduzindo a Carta II: o mecanismo de recomendação e validação social entre pares na cultura joseense.",
    "mecanismo_influencia": "Como a credibilidade se propaga na prática local",
    "estrategia_parceria": "Proposta de valor e aproximação colaborativa",
    "risco_ativacao": "O que evitar para preservar a autenticidade"
  },
  "bloco_ponto_cego": {
    "fala_kapy": "Análise crítica da Kapy introduzindo a Carta III: as forças de inércia e resistência cultural que exigem atenção cuidadosa na operação.",
    "armadilha_local": "A barreira de hábito ou conveniência na cidade",
    "o_que_nunca_fazer": "Atitude contraproducente a ser evitada na praça",
    "acao_blindagem": "Medida preventiva para mitigar a resistência"
  },
  "bloco_plano_ataque": {
    "fala_kapy": "Roteiro pragmático de validação: 'Sob a ótica de alocação de tempo e recursos em São José dos Campos, a trajetória mais prudente de validação compreende os seguintes passos:'",
    "primeiro_passo_7_dias": "Experimento prático de validação inicial com baixo custo operacional.",
    "passos_taticos": [
      {
        "prioridade": 1,
        "acao": "Ação de validação inicial",
        "publico": "Público prioritário",
        "canal_ou_territorio": "Região ou canal em SJC",
        "mensagem_ou_oferta": "Oferta de validação",
        "objetivo": "Resultado prático esperado",
        "indicador_inicial": "Indicador verificável"
      },
      {
        "prioridade": 2,
        "acao": "Ação de conexão e recomendação",
        "publico": "Multiplicadores e parceiros",
        "canal_ou_territorio": "Região ou canal",
        "mensagem_ou_oferta": "Proposta de valor",
        "objetivo": "Validação de indicação",
        "indicador_inicial": "Métrica de recomendação"
      },
      {
        "prioridade": 3,
        "acao": "Consolidação e proteção de reputação",
        "publico": "Mercado mais amplo",
        "canal_ou_territorio": "Canais comerciais",
        "mensagem_ou_oferta": "Garantia e consistência",
        "objetivo": "Sustentabilidade da operação",
        "indicador_inicial": "Métrica de retenção"
      }
    ]
  },
  "veredito_ideia": {
    "status": "analise_contextual",
    "rotulo": "DIAGNÓSTICO CONTEXTUAL • RADAR SJC 2026",
    "conversa_franca_kapy": "Texto contextualizado da Kapy...",
    "tese_de_posicionamento": "Tese de posicionamento"
  },
  "diagnostico_executivo": "Diagnóstico executivo contextual",
  "tese_de_posicionamento": "Tese de posicionamento",
  "analise_persona_central": {
    "nome_persona": "Nome da Persona Central",
    "motivo_aderencia": "Motivo",
    "job_to_be_done": "Job",
    "mensagem_de_conquista": "Mensagem",
    "estrategia_abordagem": "Abordagem",
    "objecao_provavel": "Objeção",
    "resposta_a_objecao": "Resposta"
  },
  "analise_alavanca": {
    "nome_persona": "Nome da Alavanca",
    "papel_multiplicador": "Papel",
    "mecanismo_de_influencia": "Mecanismo",
    "mensagem_de_ativacao": "Mensagem",
    "acao_parceria": "Parceria",
    "risco_da_ativacao": "Risco"
  },
  "alerta_ponto_cego": {
    "nome_persona": "Nome do Ponto Cego",
    "armadilha_local": "Armadilha",
    "sinal_de_alerta": "Sinal",
    "acao_blindagem": "Blindagem",
    "o_que_nao_fazer": "O que evitar"
  },
  "plano_de_ataque_sjc": [
    {
      "prioridade": 1,
      "acao": "Ação 1",
      "publico": "Público 1",
      "canal_ou_territorio": "Canal 1",
      "mensagem_ou_oferta": "Mensagem 1",
      "objetivo": "Objetivo 1",
      "indicador_inicial": "Indicador 1"
    },
    {
      "prioridade": 2,
      "acao": "Ação 2",
      "publico": "Público 2",
      "canal_ou_territorio": "Canal 2",
      "mensagem_ou_oferta": "Mensagem 2",
      "objetivo": "Objetivo 2",
      "indicador_inicial": "Indicador 2"
    },
    {
      "prioridade": 3,
      "acao": "Ação 3",
      "publico": "Público 3",
      "canal_ou_territorio": "Canal 3",
      "mensagem_ou_oferta": "Mensagem 3",
      "objetivo": "Objetivo 3",
      "indicador_inicial": "Indicador 3"
    }
  ],
  "veredito_final": {
    "recomendacao": "avancar | testar_antes | reformular | nao_recomendar",
    "justificativa": "Parecer fundamentado",
    "primeiro_experimento": "Experimento pragmático"
  }
}`;

    // 2. Execução da IA Generativa (Gemini AI Studio ou Groq)
    const geminiKey = (process.env.GEMINI_API_KEY || "").trim();
    const groqKey = (process.env.GROQ_API_KEY || "").trim();

    // 2.1 Tentativa com Google Gemini
    if (geminiKey) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${geminiKey}`;
        const geminiRes = await fetch(geminiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: systemPrompt }]
            },
            contents: [
              {
                role: "user",
                parts: [{ text: `Analise a proposta do usuário com base nas 60 personas e nos dados de SJC. Gere rigorosamente apenas o JSON puro conforme a especificação.` }]
              }
            ],
            generationConfig: {
              temperature: 0.3,
              responseMimeType: "application/json"
            }
          })
        });

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          let rawJson = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "";
          rawJson = rawJson.replace(/^```json\s*/i, '').replace(/```$/g, '').trim();

          const parsed = JSON.parse(rawJson);
          if (parsed && parsed.primary_persona_id && parsed.diagnostico_contextual) {
            console.log(" Leitura gerada via Google Gemini com sucesso!");
            return res.status(200).json(parsed);
          }
        } else {
          console.warn("Gemini API retornou status:", geminiRes.status, await geminiRes.text());
        }
      } catch (errGemini) {
        console.warn("Falha na chamada do Gemini, tentando alternativas:", errGemini.message);
      }
    }

    // 2.2 Tentativa com Groq (se chave configurada)
    if (groqKey) {
      try {
        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${groqKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: GROQ_MODEL,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: `Analise minha proposta e gere a leitura oficial do Oráculo RDR para SJC. Responda APENAS o JSON puro.` }
            ],
            temperature: 0.35,
            response_format: { type: "json_object" }
          })
        });

        if (groqRes.ok) {
          const groqData = await groqRes.json();
          let rawJson = groqData.choices?.[0]?.message?.content || "";
          rawJson = rawJson.replace(/^```json\s*/i, '').replace(/```$/g, '').trim();

          const parsed = JSON.parse(rawJson);
          if (parsed && parsed.primary_persona_id && parsed.analise_persona_central) {
            console.log(" Leitura gerada via Groq com sucesso!");
            return res.status(200).json(parsed);
          }
        } else {
          console.warn("Groq retornou status:", groqRes.status, await groqRes.text());
        }
      } catch (errGroq) {
        console.warn("Falha na chamada da Groq:", errGroq.message);
      }
    }

    // 3. Motor Analítico Determinístico Resiliente (Garante 100% de resposta estruturada)
    const fallbackResult = generateDeterministicOracleReading(answers, personasData || []);
    return res.status(200).json(fallbackResult);

  } catch (error) {
    console.error("Erro no handler do Oráculo:", error);
    return res.status(500).json({ error: "Erro interno no processamento do Oráculo RDR: " + error.message });
  }
};

let cachedLocalPersonas = null;
function getFallbackPersonas() {
  if (cachedLocalPersonas && cachedLocalPersonas.length > 0) return cachedLocalPersonas;
  try {
    const jsPath = path.join(process.cwd(), 'personas_sjc_module.js');
    if (fs.existsSync(jsPath)) {
      const content = fs.readFileSync(jsPath, 'utf8');
      const startIdx = content.indexOf('const PERSONAS_SJC_DATA = [');
      const endIdx = content.indexOf('];', startIdx);
      if (startIdx !== -1 && endIdx !== -1) {
        const jsonPart = content.slice(startIdx + 'const PERSONAS_SJC_DATA ='.length, endIdx + 1).trim();
        cachedLocalPersonas = JSON.parse(jsonPart);
      }
    }
  } catch (e) {}
  return cachedLocalPersonas || [];
}

function summarizeIdeaPrompt(rawText, answers = {}, regiaoNomes = {}) {
  const targetReg = (answers.q3_regiao || '').toLowerCase();
  const regiao = regiaoNomes[targetReg] || "São José dos Campos";

  if (!rawText || !rawText.trim()) {
    const propMap = {
      inovacao: "desenvolver uma solução tecnológica ou inovadora",
      luxo: "estruturar um serviço exclusivo de alto padrão",
      tradicao: "consolidar um negócio tradicional com atendimento de confiança",
      agilidade: "lançar um serviço rápido e descomplicado do dia a dia"
    };
    const prop = propMap[answers.q1_proposta] || "desenvolver um novo projeto comercial";
    return {
      title: `Diagnóstico Estratégico: Posicionamento na ${regiao.split('(')[0].trim()}`,
      leadSentence: `O seu objetivo é ${prop} com foco na ${regiao}.`
    };
  }

  // Normalização e limpeza
  let clean = rawText.trim().replace(/\s+/g, ' ');
  let intent = clean.replace(/^(eu\s+)?(quro|quero|gostaria de|pretendo|desejo|estou querendo|minha ideia é|planejo)\s+/i, '');
  intent = intent.replace(/\bminhas\b/gi, 'suas')
                 .replace(/\bmeus\b/gi, 'seus')
                 .replace(/\bminha\b/gi, 'sua')
                 .replace(/\bmeu\b/gi, 'seu');
  intent = intent.charAt(0).toUpperCase() + intent.slice(1);
  intent = intent.replace(/[.!?]+$/, '');

  // Título executivo limpo
  let titleSubject = intent.length > 52 ? intent.slice(0, 50).replace(/\s+\S*$/, '') + '...' : intent;
  let title = `Diagnóstico Estratégico: ${titleSubject}`;

  // Primeira frase: resumo conciso e profissional do prompt da ideia
  let leadSentence = `A sua proposta é ${intent.charAt(0).toLowerCase() + intent.slice(1)} com atuação na ${regiao}.`;

  return { title, leadSentence };
}

// Gerador Determinístico Resiliente (Sempre entrega a estrutura 100% preenchida)
function generateDeterministicOracleReading(answers, personasList) {
  if (!personasList || personasList.length === 0) {
    personasList = getFallbackPersonas();
  }

  const movMap = {
    'inovacao': 'Tribo Global',
    'luxo': 'Cidade Prometida',
    'tradicao': 'Geografia da Inércia',
    'agilidade': 'Empreendedorismo Intuitivo'
  };

  const targetMov = movMap[answers.q1_proposta] || 'Tribo Global';
  const targetReg = (answers.q3_regiao || 'oeste').toLowerCase();
  const targetTicket = answers.q2_ticket || 'experiencia';

  const fullText = (answers.q5_texto_livre || '').toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const isMaleNiche = /\b(masculin[oa]s?|homem|homens|barbearia|cueca|barba|terno|cavalheiro|pai|pais)\b/.test(fullText);
  const isFemaleNiche = /\b(feminin[oa]s?|mulher|mulheres|maquiagem|unha|unhas|manicure|estetica facial|depilacao|lingerie|vestido|mae|maes|gravida|gestante)\b/.test(fullText);

  const scoredPersonas = personasList.map(p => {
    let score = 50;
    const reg = (p.regiao || '').toLowerCase();
    const mov = (p.movimento || '').toLowerCase();
    const renda = (p.faixa_renda || '').toLowerCase();
    const genero = (p.genero_etnia || '').toLowerCase();
    const isM = genero.startsWith('homem');
    const isF = genero.startsWith('mulher');

    if (reg.includes(targetReg)) score += 20;
    if (mov.includes(targetMov.toLowerCase())) score += 20;

    if (targetTicket === 'alto' && (renda.includes('classe a') || renda.includes('classe b'))) score += 10;
    else if (targetTicket === 'economico' && (renda.includes('classe c') || renda.includes('classe d'))) score += 10;

    // Correspondência de Nicho e Gênero
    if (isMaleNiche) {
      if (isM) score += 40;
      else if (isF) score -= 40;
    } else if (isFemaleNiche) {
      if (isF) score += 40;
      else if (isM) score -= 40;
    }

    return { persona: p, score };
  }).sort((a, b) => b.score - a.score);

  let primary = scoredPersonas[0]?.persona || personasList[0] || { id: 1, nome_completo: "Maria do Carmo Paes", bairro: "Vila Ema" };
  let multiplier = scoredPersonas.slice(1).find(x => x.persona.influenciadores_seguidos?.length > 0 || (x.persona.faixa_renda || '').includes('Classe A'))?.persona || scoredPersonas[1]?.persona || personasList[1];
  let shadow = scoredPersonas.slice().reverse().find(x => x.persona.id !== primary.id && x.persona.id !== multiplier.id && ((x.persona.movimento || '').includes('Geografia da Inércia') || x.persona.idade > 45))?.persona || scoredPersonas[scoredPersonas.length - 1]?.persona || personasList[personasList.length - 1];

  const regiaoNomes = {
    centro: "Região Centro (Vila Ema, Adyana e São Dimas)",
    sul: "Região Sul (Jardim Satélite, Floradas e Bosque)",
    leste: "Região Leste (Vista Verde, Eugênio de Melo e Novo Horizonte)",
    oeste: "Região Oeste (Aquarius, Urbanova e Colinas)",
    norte: "Região Norte (Santana e Altos de Santana)",
    sudeste: "Região Sudeste (Região do Putim e São Judas Tadeu)"
  };

  const canalNomes = {
    instagram: "Instagram e Reels Autorais",
    whatsapp: "WhatsApp Direto e Rápido",
    google: "Google Maps e SEO Local",
    eventos: "Parcerias, Eventos e Boca a Boca"
  };

  // Resumo inteligente do prompt da ideia do usuário
  const summary = summarizeIdeaPrompt(answers.q5_texto_livre, answers, regiaoNomes);

  const isPrimaryM = (primary.genero_etnia || '').toLowerCase().startsWith('homem');
  const pronPrimary = isPrimaryM ? 'Ele' : 'Ela';
  const moradorPrimary = isPrimaryM ? 'Morador' : 'Moradora';
  const delePrimary = isPrimaryM ? 'dele' : 'dela';

  const isMultM = (multiplier.genero_etnia || '').toLowerCase().startsWith('homem');
  const pronMult = isMultM ? 'Ele' : 'Ela';
  const deleMult = isMultM ? 'dele' : 'dela';

  return {
    primary_persona_id: primary.id,
    multiplier_persona_id: multiplier.id,
    shadow_persona_id: shadow.id,
    titulo_leitura: summary.title,
    nivel_confianca: "alto",
    hipoteses_criticas: [
      `Aderência observada no perfil qualificado de ${primary.bairro}, onde há busca recorrente por soluções locais com alto padrão de entrega.`,
      `Validação orgânica viabilizada pelo ecossistema de relacionamento e chancela profissional de ${multiplier.nome_completo}.`
    ],
    diagnostico_contextual: {
      rotulo_contextual: "DIAGNÓSTICO CONTEXTUAL • SÃO JOSÉ DOS CAMPOS 2026",
      analise_kapy: `${summary.leadSentence} Ao analisar essa proposta sob a ótica de mercado de São José dos Campos, é essencial observar as dinâmicas de consumo que caracterizam a ${regiaoNomes[targetReg] || 'região prioritária'}. O público desta praça possui capacidade financeira consistente, contudo apresenta um padrão de decisão marcado pela busca de conveniência viária e valorização da confiança. O consumidor local não muda de hábito por impulso: ele pondera a proximidade, a reputação consolidada e o padrão de atendimento. Em vez de impor uma mudança abrupta, a inserção bem-sucedida nesta cidade depende de ancoragem territorial sólida, agilidade no canal ${canalNomes[answers.q4_canal] || 'escolhido'} e validação gradual por quem já possui trânsito na comunidade. As cartas a seguir detalham essas forças:`,
      tese_de_posicionamento: `Posicionar como a referência autoral e confiável da cidade que entrega padrão superior com a conveniência e o acolhimento que o morador de SJC valoriza.`
    },
    veredito_ideia: {
      status: "analise_contextual",
      rotulo: "DIAGNÓSTICO CONTEXTUAL • SÃO JOSÉ DOS CAMPOS 2026",
      conversa_franca_kapy: `${summary.leadSentence} Ao analisar essa proposta sob a ótica de mercado de São José dos Campos, é essencial observar as dinâmicas de consumo que caracterizam a ${regiaoNomes[targetReg] || 'região prioritária'}. O público desta praça possui capacidade financeira consistente, contudo apresenta um padrão de decisão marcado pela busca de conveniência viária e valorização da confiança. O consumidor local não muda de hábito por impulso: ele pondera a proximidade, a reputação consolidada e o padrão de atendimento. Em vez de impor uma mudança abrupta, a inserção bem-sucedida nesta cidade depende de ancoragem territorial sólida, agilidade no canal ${canalNomes[answers.q4_canal] || 'escolhido'} e validação gradual por quem já possui trânsito na comunidade. As cartas a seguir detalham essas forças:`,
      tese_de_posicionamento: `Posicionar como a referência autoral e confiável da cidade que entrega padrão superior com a conveniência e o acolhimento que o morador de SJC valoriza.`
    },
    bloco_persona_central: {
      fala_kapy: `Na primeira carta, observamos o perfil de **${primary.nome_completo}**. ${moradorPrimary} de ${primary.bairro}, sua rotina é pautada pela conciliação entre exigências profissionais e gestão do tempo, enfrentando diariamente os nós viários e pontes da cidade. Sua busca não se resume ao produto em si, mas à eliminação de atritos rotineiros sem a necessidade de recorrer à capital. A adesão deste perfil se concretiza quando a comunicação demonstra respeito ao tempo ${delePrimary}, com informações objetivas e canais diretos de suporte.`,
      job_to_be_done: "Solucionar sua necessidade com previsibilidade técnica e conveniência, otimizando o tempo e evitando deslocamentos externos desnecessários.",
      mensagem_conquista: `Criado para a realidade de ${primary.bairro}: excelência técnica, previsibilidade e conveniência direta.`,
      como_vencer_objecao: "Apresentar referências verificáveis na cidade, clareza rigorosa nos prazos e contato humanizado direto com quem decide."
    },
    bloco_alavanca: {
      fala_kapy: `A segunda carta evidencia o papel estratégico de **${multiplier.nome_completo}**. No tecido social de São José dos Campos, a recomendação informal entre pares opera como o principal catalisador de autoridade. Com circulação ativa em ${multiplier.bairro}, ${pronMult.toLowerCase()} atua como um polo natural de referência. A aproximação estratégica não deve ser de venda direta, mas de experiência compartilhada e acesso antecipado, permitindo que a validação técnica espontânea ${deleMult} reduza a barreira de desconfiança do mercado local.`,
      mecanismo_influencia: "Recomendação pessoal em círculos profissionais e grupos comunitários locais, onde sua opinião técnica possui peso comprovado.",
      estrategia_parceria: `Desenvolver uma ação piloto de relacionamento ou co-branding no circuito de ${multiplier.bairro}, concedendo condição diferenciada para sua rede de contatos.`,
      risco_ativacao: "Evitar abordagens estritamente transacionais; a credibilidade da parceria exige que a persona realmente vivencie e valide a entrega."
    },
    bloco_ponto_cego: {
      fala_kapy: `A terceira carta convida a uma reflexão atenta sobre a **Geografia da Inércia** em São José dos Campos. O consumidor local frequentemente reconhece a qualidade de uma novidade, porém prefere permanecer em suas escolhas consagradas devido ao receio de decepção ou atrito operacional. Campanhas com promessas infladas ou tom forasteiro tendem a gerar distanciamento silencioso. A mitigação eficaz dessa barreira requer ancoragem local, transparência nas condições e respeito ao ritmo de maturação de confiança da cidade.`,
      armadilha_local: "A tradicional cautela joseense diante de novidades apressadas ou abordagens que desconsiderem os hábitos dos bairros e o trânsito viário.",
      o_que_nunca_fazer: "Adotar postura de superioridade metropolitana ou restringir o suporte a fluxos automatizados sem opção de acolhimento humano.",
      acao_blindagem: "Demonstrar ancoragem e raízes na praça de SJC, explicitar garantias e preservar um canal de atendimento acessível e consultivo."
    },
    bloco_plano_ataque: {
      fala_kapy: "Em termos de alocação de esforço e recursos em São José dos Campos, a trajetória mais prudente de validação progressiva compreende os seguintes passos:",
      primeiro_passo_7_dias: `Implementar um teste piloto de 7 dias com oferta direcionada a residentes de ${primary.bairro}, mensurando a resposta espontânea e a taxa de retorno.`,
      passos_taticos: [
        {
          prioridade: 1,
          acao: "Comunicação de posicionamento orientada à dor de " + primary.nome_completo,
          publico: primary.nome_completo + " e residentes de perfil similar em " + primary.bairro,
          canal_ou_territorio: canalNomes[answers.q4_canal] || "Canal Prioritário",
          mensagem_ou_oferta: "Condição inaugural com atendimento consultivo e acompanhamento próximo",
          objetivo: "Conquistar os primeiros clientes promotores de forma consistente",
          indicador_inicial: "Taxa de resposta e conversão qualificada no primeiro contato"
        },
        {
          prioridade: 2,
          acao: "Ativação da alavanca multiplicadora via " + multiplier.nome_completo,
          publico: "Rede profissional e comunidade de influência de " + multiplier.bairro,
          canal_ou_territorio: "Networking regional e eventos locais",
          mensagem_ou_oferta: "Apresentação da solução com foco em valor mútuo para o segmento",
          objetivo: "Ativar o ciclo de recomendação espontânea e qualificada",
          indicador_inicial: "Novos contatos provenientes de indicação direta"
        },
        {
          prioridade: 3,
          acao: "Blindagem operacional contra os fatores de inércia identificados",
          publico: "Clientes em fase de consideração com perfil mais tradicional",
          canal_ou_territorio: "Pontos de contato comerciais e suporte em SJC",
          mensagem_ou_oferta: "Garantias explícitas de entrega e suporte ágil",
          objetivo: "Reduzir a fricção de desconfiança e encurtar o ciclo de decisão",
          indicador_inicial: "Redução no tempo médio de fechamento e aumento da retenção"
        }
      ]
    },
    diagnostico_executivo: `A proposta possui alta aderência com as tensões reprimidas de São José dos Campos, em especial na ${regiaoNomes[targetReg] || 'região central'}. O joseense deste estrato valoriza conveniência sem atrito, padrão de acabamento superior e atendimento que transmita segurança imediata. Ao utilizar ${canalNomes[answers.q4_canal] || 'o canal prioritário'}, o negócio quebra a inércia dos condomínios fechados e ativa a decisão por recomendação.`,
    tese_de_posicionamento: `Posicionar como a referência autoral e confiável da cidade que entrega padrão de capital com o acolhimento e a agilidade que o morador de SJC exige.`,
    analise_persona_central: {
      nome_persona: primary.nome_completo,
      motivo_aderencia: `${primary.nome_completo} vive a rotina de ${primary.bairro} e sente diretamente a dor de ${primary.dor_principal || 'falta de soluções sob medida em SJC'}, sendo a compradora natural para validar a proposta nos primeiros 30 dias.`,
      job_to_be_done: "Resolver sua necessidade com excelência comprovada, economizando tempo e evitando a frustração de deslocamentos para fora da cidade.",
      mensagem_de_conquista: `Criado para quem vive ${primary.bairro}: excelência técnica, conveniência absoluta e respeito ao seu tempo.`,
      estrategia_abordagem: `Abordagem focada em transparência e demonstração de valor prático no canal ${canalNomes[answers.q4_canal] || 'escolhido'}, com resposta rápida e sem automações robóticas.`,
      objecao_provavel: "Receio de pagar por uma promessa que não se sustente na prática ou que gere atrito no atendimento.",
      resposta_a_objecao: "Apresentar prova social consistente, clareza cirúrgica nos prazos e contato humanizado direto com quem decide."
    },
    analise_alavanca: {
      nome_persona: multiplier.nome_completo,
      papel_multiplicador: `${multiplier.nome_completo} possui circulação ativa e alto capital relacional em SJC, funcionando como o vetor ideal para expandir a recomendação do negócio.`,
      mecanismo_de_influencia: "Indicação pessoal em círculos profissionais e grupos comunitários locais, onde sua palavra possui alto peso de validação.",
      mensagem_de_ativacao: "Convite para acesso exclusivo ou degustação em primeira mão da solução desenhada para a cidade.",
      acao_parceria: `Propor uma ação piloto de relacionamento ou co-branding no circuito de ${multiplier.bairro}, oferecendo uma condição especial para sua rede de contatos.`,
      risco_da_ativacao: "Tornar a parceria meramente transacional; é fundamental que a persona realmente experimente e aprove a entrega."
    },
    alerta_ponto_cego: {
      nome_persona: shadow.nome_completo,
      armadilha_local: "A tradicional desconfiança joseense com novidades apressadas ou marcas que ignoram as particularidades culturais dos bairros e o tráfego viário.",
      sinal_de_alerta: "Muitos cliques ou visualizações no canal digital, mas baixa conversão em visitas e fechamentos reais.",
      acao_blindagem: "Reforçar a presença de ancoragem física em SJC, destacar garantias claras e respeitar o ritmo de maturação de confiança da praça.",
      o_que_nao_fazer: "Usar tom arrogante de fora da cidade ou impor atendimento 100% automatizado sem opção de suporte humano caloroso."
    },
    plano_de_ataque_sjc: [
      {
        prioridade: 1,
        acao: "Lançamento da mensagem de conquista com foco na dor de " + primary.nome_completo,
        publico: primary.nome_completo + " e moradores de perfil similar em " + primary.bairro,
        canal_ou_territorio: canalNomes[answers.q4_canal] || "Canal Prioritário",
        mensagem_ou_oferta: "Condição inaugural com atendimento personalizado e validação assistida",
        objetivo: "Conquistar os primeiros clientes promotores orgânicos",
        indicador_inicial: "Taxa de resposta e conversão no primeiro contato"
      },
      {
        prioridade: 2,
        acao: "Ativação da Alavanca Multiplicadora através de " + multiplier.nome_completo,
        publico: "Rede profissional e comunidade de influência de " + multiplier.bairro,
        canal_ou_territorio: "Networking regional e eventos locais",
        mensagem_ou_oferta: "Apresentação da solução com foco em valor compartilhado para a comunidade",
        objetivo: "Gerar o efeito de recomendação boca a boca qualificada",
        indicador_inicial: "Novos contatos que chegam citando a indicação"
      },
      {
        prioridade: 3,
        acao: "Blindagem operacional contra o ponto cego identificado",
        publico: "Clientes em fase de consideração com perfil conservador",
        canal_ou_territorio: "Pontos de contato comerciais e suporte em SJC",
        mensagem_ou_oferta: "Garantias explícitas de entrega e atendimento consultivo direto",
        objetivo: "Eliminar a barreira de desconfiança e acelerar a decisão",
        indicador_inicial: "Redução do tempo médio entre o primeiro contato e o fechamento"
      }
    ],
    veredito_final: {
      recomendacao: "avancar",
      justificativa: "A proposta preenche uma lacuna viva de valor na cidade e possui público com poder de compra e disposição reprimida para consumir.",
      primeiro_experimento: `Rodar um teste tático de 7 dias com uma oferta piloto focada nos moradores de ${primary.bairro}, mensurando a taxa de retorno imediato.`
    }
  };
}
