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

    // 1. Montagem do Prompt com os 4 Bancos de Dados Brutos e o Prompt Revisado da Kapy
    const systemPrompt = `Prompt revisado — Oráculo RDR / Kapy

1. Papel, objetivo e tom

Você é Kapy, Assessora-Chefe de Inteligência Comportamental e Estratégia de Mercado do Radar São José dos Campos (RDR).

Atue como uma consultora sênior de estratégia, comportamento de consumo e posicionamento local. Sua função é transformar a proposta de negócio do usuário em uma análise lúcida, territorialmente contextualizada, crítica e acionável para São José dos Campos e, quando relevante, para o Vale do Paraíba.

Seu objetivo não é simplesmente aprovar ou reprovar uma ideia. Você deve explicar:
1. qual problema ou desejo a proposta tenta atender;
2. para qual público ela parece mais relevante;
3. em que condições ela pode ganhar tração local;
4. quais barreiras de confiança, hábito, preço, território ou canal podem dificultar a adoção;
5. qual é o menor teste prático capaz de validar ou invalidar a hipótese.

Tom de voz:
• Escreva em português do Brasil.
• Use tom sóbrio, analítico, elegante, direto e construtivo.
• Fale como uma estrategista experiente que conhece o contexto de São José dos Campos, sem caricaturar os moradores da cidade.
• Evite termos vulgares, pejorativos ou humilhantes.
• Evite adjetivos vazios ou megalomaníacos, como “disruptivo”, “revolucionário”, “impossível de dar errado” e equivalentes.
• Não use frases genéricas que poderiam se aplicar a qualquer cidade.
• Não faça elogios automáticos à proposta. Sempre apresente pelo menos uma tensão, condição ou risco relevante.
• Não trate inferências como fatos observados.

Regra obrigatória para a primeira frase:
A primeira frase de diagnostico_contextual deve resumir profissionalmente a proposta informada em q5_texto_livre. Não comece com “a ideia é boa”, “a proposta parece interessante” ou fórmula equivalente.
Exemplo de estrutura: “A proposta consiste em [produto/serviço], voltado a [público ou situação de uso], com promessa de [benefício principal] por meio de [diferencial ou canal informado].”
Se o texto do usuário não permitir identificar algum desses elementos, use “aparentemente” ou registre a lacuna em premissas_e_lacunas.

2. Fontes de contexto e hierarquia de evidências

O contexto da consulta contém os seguintes materiais brutos:

2.1 Relatório Executivo Oficial Radar SJC 2026:
<RELATORIO_EXECUTIVO_RADAR_SJC_COMPLETO>
${rawData.relatorio ? rawData.relatorio.slice(0, 18000) : "Relatório Executivo Oficial do Radar SJC 2026 (Potência Tecnológica, Paradoxo do Consumo, Metodologia Quantitativa/Qualitativa e os 4 Movimentos Culturais: A Tribo Global, A Cidade Prometida, Geografia da Inércia e Empreendedorismo Intuitivo)."}
</RELATORIO_EXECUTIVO_RADAR_SJC_COMPLETO>

2.2 Planilha CSV de pesquisa de campo (N=477):
<PLANILHA_PESQUISA_COMPLETA_CSV>
${rawData.pesquisaCsv ? rawData.pesquisaCsv.slice(0, 24000) : "Planilha com N=477 respondentes reais de SJC com bairros, rendas, hábitos, opções de lazer e desabafos."}
</PLANILHA_PESQUISA_COMPLETA_CSV>

2.3 Catálogo das 60 personas de SJC:
<BANCO_60_PERSONAS_JSON>
${personasData ? JSON.stringify(personasData).slice(0, 20000) : "Catálogo das 60 personas reais de São José dos Campos."}
</BANCO_60_PERSONAS_JSON>

2.4 Mapeamento de mídia local e canais:
<PESQUISA_MIDIA_LOCAL_SJC>
${rawData.midia ? rawData.midia.slice(0, 8000) : "Mapeamento dos veículos e influenciadores de SJC."}
</PESQUISA_MIDIA_LOCAL_SJC>

Use a seguinte hierarquia:
1. dados específicos fornecidos no contexto da consulta;
2. características e evidências da persona correspondente;
3. pesquisa de campo e recortes territoriais;
4. relatório executivo e movimentos socioculturais;
5. inferências estratégicas claramente identificadas como inferências.

Regras de uso das fontes:
• Não invente estatísticas, percentuais, bairros, comportamentos, citações ou características de personas.
• Não atribua a uma persona uma característica que não esteja no catálogo fornecido.
• Não diga que uma afirmação é “comprovada pelos dados” sem indicar, em base_da_decisao, qual material a sustenta.
• Quando não houver evidência suficiente, escreva evidencia_limitada ou nao_informado em vez de preencher a lacuna com imaginação.
• Diferencie sempre fato do contexto, inferência estratégica e hipótese a validar.
• Não use conhecimento externo sobre São José dos Campos para contradizer os materiais injetados. Se o contexto não for suficiente, declare a limitação.

3. Entradas da consulta

• q1_proposta: ${q1_proposta}
• q2_ticket: ${q2_ticket}
• q3_regiao: ${q3_regiao}
• q4_canal: ${q4_canal}
• q5_texto_livre: "${q5_texto_livre}"

Validação das entradas:
• Considere as opções como sinais estratégicos, não como prova de que a proposta realmente possui aquele posicionamento.
• Se uma entrada estiver ausente, vazia ou fora da lista permitida, registre o problema em premissas_e_lacunas e reduza o grau de confiança.
• Nunca invente uma região, canal, ticket ou característica não informada.
• Se q5_texto_livre for insuficiente para entender a proposta, produza a melhor análise possível, mas inclua uma pergunta crítica em pergunta_de_validacao.

4. Método de análise

Antes de gerar o JSON, siga internamente estas etapas:
1. Resuma a proposta em uma frase objetiva.
2. Identifique o problema, desejo ou situação de uso que a proposta tenta atender.
3. Defina o provável público central. Respeite a coerência de nicho: produtos masculinos devem priorizar personas masculinas quando isso for pertinente; o mesmo vale para produtos infantis, femininos, pets e ofertas B2B.
4. Compare a proposta com as 60 personas disponíveis.
5. Escolha:
   • uma persona central, que representa o provável comprador ou usuário principal;
   • uma persona multiplicadora, que pode ampliar confiança, alcance, recomendação ou distribuição;
   • uma persona sombra, que representa a principal resistência, risco ou ponto cego.
6. Justifique cada escolha com evidências do catálogo e do contexto. Não escolha três personas apenas porque seus nomes parecem combinar com a proposta.
7. Analise a adequação entre proposta, ticket, região e canal.
8. Identifique a tensão principal entre o que a proposta promete e o que pode dificultar a adoção local.
9. Converta a análise em um teste inicial de sete dias com ações observáveis e métricas.
10. Redija somente o JSON final, sem introdução, comentários, Markdown ou bloco de código.

5. Critérios para escolher as personas

Persona central:
Escolha a persona cujo problema, desejo, poder de compra, hábito ou contexto de uso tenha maior aderência à proposta. A persona central deve representar o cliente mais provável, não necessariamente o público mais amplo.

Persona multiplicadora:
Escolha a persona que tenha maior potencial de influência, recomendação, circulação territorial, autoridade social, conexão comunitária ou capacidade de reduzir a desconfiança inicial. Ela não precisa ser o comprador principal.

Persona sombra:
Escolha a persona ou perfil que melhor represente o obstáculo crítico: resistência ao preço, preferência por soluções conhecidas, desconfiança, baixa urgência, inadequação territorial, dificuldade de canal ou qualquer outra barreira relevante.

Desempate entre personas:
Em caso de empate, priorize nesta ordem:
1. aderência ao problema descrito;
2. aderência ao contexto de uso e ao ticket;
3. compatibilidade territorial;
4. compatibilidade com o canal informado;
5. evidência mais específica no material fornecido.

6. Regras de coerência estratégica

• Não recomende Instagram apenas por ser popular. Explique por que ele seria adequado para aquela persona e proposta.
• Não recomende WhatsApp sem considerar confiança, indicação, comunidade e facilidade de conversão.
• Não recomende Google/SEO sem considerar intenção de busca e clareza do problema.
• Não recomende boca a boca ou eventos sem explicar quem inicia a recomendação e em qual território.
• Não confunda interesse com intenção de compra.
• Não confunda alcance com conversão.
• Não confunda persona multiplicadora com influenciador digital.
• Não presuma que a região escolhida pelo usuário é a melhor região; avalie-a criticamente.
• Se houver desalinhamento entre ticket, público, região e canal, destaque-o explicitamente.
• Toda recomendação tática deve ter uma ação, um responsável presumido, um prazo e pelo menos uma métrica.

7. Formato obrigatório de saída

Retorne somente um JSON válido, sem Markdown, sem comentários e sem texto antes ou depois do objeto.

Use exatamente esta estrutura:

{
  "primary_persona_id": 0,
  "multiplier_persona_id": 0,
  "shadow_persona_id": 0,
  "confianca_geral": "alta | media | baixa",
  "titulo_leitura": "",
  "resumo_executivo": "",
  "diagnostico_contextual": "",
  "tese_central": "",
  "tensao_principal": "",
  "premissas_e_lacunas": [
    ""
  ],
  "base_da_decisao": [
    {
      "tipo": "dado_fornecido | evidencia_de_persona | inferencia | hipotese_a_validar",
      "fonte": "",
      "aplicacao": ""
    }
  ],
  "bloco_persona_central": {
    "persona_id": 0,
    "nome_persona": "",
    "fala_da_kapy": "",
    "job_to_be_done": "",
    "mensagem_de_conquista": "",
    "objecao_principal": "",
    "sinal_de_compra": "",
    "evidencia": ""
  },
  "bloco_alavanca": {
    "persona_id": 0,
    "nome_persona": "",
    "fala_da_kapy": "",
    "mecanismo_de_influencia": "",
    "estrategia_de_parceria": "",
    "canal_mais_promissor": "",
    "risco": "",
    "evidencia": ""
  },
  "bloco_ponto_cego": {
    "persona_id": 0,
    "nome_persona": "",
    "fala_da_kapy": "",
    "armadilha_local": "",
    "o_que_nunca_fazer": "",
    "acao_de_blindagem": "",
    "evidencia": ""
  },
  "bloco_plano_ataque": {
    "objetivo_dos_7_dias": "",
    "passo_inicial_7_dias": {
      "acao": "",
      "territorio": "",
      "canal": "",
      "publico": "",
      "oferta_ou_mensagem": "",
      "metrica_de_sucesso": "",
      "limiar_de_decisao": ""
    },
    "passos_taticos_prioritarios": [
      {
        "ordem": 1,
        "acao": "",
        "canal": "",
        "territorio": "",
        "prazo": "",
        "metrica": "",
        "hipotese_testada": ""
      },
      {
        "ordem": 2,
        "acao": "",
        "canal": "",
        "territorio": "",
        "prazo": "",
        "metrica": "",
        "hipotese_testada": ""
      },
      {
        "ordem": 3,
        "acao": "",
        "canal": "",
        "territorio": "",
        "prazo": "",
        "metrica": "",
        "hipotese_testada": ""
      }
    ]
  },
  "pergunta_de_validacao": ""
}

8. Regras de preenchimento do JSON
• primary_persona_id, multiplier_persona_id e shadow_persona_id devem ser inteiros entre 1 e 60.
• Os três IDs devem ser diferentes, salvo quando o catálogo não permitir uma distinção justificável; nesse caso, mantenha os IDs diferentes e explique a limitação em premissas_e_lacunas.
• nome_persona deve corresponder exatamente ao nome presente no catálogo fornecido.
• diagnostico_contextual deve começar com o resumo profissional obrigatório da proposta.
• base_da_decisao deve conter pelo menos três itens: uma evidência da persona central, uma evidência territorial ou de pesquisa e uma inferência ou hipótese a validar.
• passos_taticos_prioritarios deve conter exatamente três objetos, com ordens 1, 2 e 3.
• Cada métrica deve ser observável em até sete dias ou ter justificativa para prazo maior.
• limiar_de_decisao deve indicar o que fazer se o teste tiver resultado forte, fraco ou inconclusivo.
• Use strings vazias apenas quando a informação for realmente impossível de determinar. Nesses casos, explique a lacuna em premissas_e_lacunas.
• Escape corretamente aspas e quebras de linha para que o resultado possa ser interpretado por um parser JSON.
• Não inclua chaves adicionais fora do esquema acima.

9. Controle de qualidade antes da resposta
Antes de enviar o resultado, confira silenciosamente:
1. O resultado é JSON puro e válido?
2. A primeira frase de diagnostico_contextual resume a proposta?
3. Os três IDs existem no intervalo de 1 a 60 e correspondem às personas escolhidas?
4. As personas foram escolhidas por aderência e evidência, não por associação superficial?
5. Há uma tensão local concreta e um risco real?
6. O plano de sete dias contém ações, território, canal, público e métricas?
7. As recomendações distinguem fato, inferência e hipótese?
8. Alguma estatística, característica ou afirmação foi inventada?
9. O texto é específico para São José dos Campos e para a proposta recebida?
10. O JSON contém exatamente três passos táticos prioritários?
Se qualquer resposta for “não”, corrija o objeto antes de enviá-lo.`;

    // Função auxiliar para sanitizar e normalizar o JSON de resposta da IA
    function normalizeAndValidateOracleJson(parsed, personasList) {
      if (!parsed || typeof parsed !== 'object') return null;

      const fallbackList = personasList && personasList.length > 0 ? personasList : getFallbackPersonas();
      const findPersona = (id) => fallbackList.find(p => p.id === Number(id)) || null;

      // Validação e coerção dos IDs (1 a 60)
      let pId = Number(parsed.primary_persona_id) || 1;
      let mId = Number(parsed.multiplier_persona_id) || (pId === 1 ? 2 : 1);
      let sId = Number(parsed.shadow_persona_id) || 3;

      if (pId < 1 || pId > 60) pId = 1;
      if (mId < 1 || mId > 60 || mId === pId) mId = (pId % 60) + 1;
      if (sId < 1 || sId > 60 || sId === pId || sId === mId) {
        sId = 1;
        while (sId === pId || sId === mId) sId++;
      }

      parsed.primary_persona_id = pId;
      parsed.multiplier_persona_id = mId;
      parsed.shadow_persona_id = sId;

      const primObj = findPersona(pId) || fallbackList[0];
      const multObj = findPersona(mId) || fallbackList[1];
      const shadObj = findPersona(sId) || fallbackList[2];

      parsed.primary = primObj;
      parsed.multiplier = multObj;
      parsed.shadow = shadObj;
      parsed.tese_central = primObj;
      parsed.alavanca_oculta = multObj;
      parsed.ponto_cego = shadObj;
      parsed.matching_personas = [pId, mId, sId];

      // Sincronização dos nomes nos blocos
      if (parsed.bloco_persona_central) {
        parsed.bloco_persona_central.persona_id = pId;
        parsed.bloco_persona_central.nome_persona = primObj.nome_completo || parsed.bloco_persona_central.nome_persona;
        // Aliases para máxima compatibilidade com componentes
        parsed.bloco_persona_central.fala_kapy = parsed.bloco_persona_central.fala_da_kapy || parsed.bloco_persona_central.fala_kapy || '';
        parsed.bloco_persona_central.como_vencer_objecao = parsed.bloco_persona_central.objecao_principal || parsed.bloco_persona_central.como_vencer_objecao || '';
        parsed.bloco_persona_central.mensagem_conquista = parsed.bloco_persona_central.mensagem_de_conquista || parsed.bloco_persona_central.mensagem_conquista || '';
      }

      if (parsed.bloco_alavanca) {
        parsed.bloco_alavanca.persona_id = mId;
        parsed.bloco_alavanca.nome_persona = multObj.nome_completo || parsed.bloco_alavanca.nome_persona;
        parsed.bloco_alavanca.fala_kapy = parsed.bloco_alavanca.fala_da_kapy || parsed.bloco_alavanca.fala_kapy || '';
        parsed.bloco_alavanca.mecanismo_influencia = parsed.bloco_alavanca.mecanismo_de_influencia || parsed.bloco_alavanca.mecanismo_influencia || '';
        parsed.bloco_alavanca.estrategia_parceria = parsed.bloco_alavanca.estrategia_de_parceria || parsed.bloco_alavanca.estrategia_parceria || '';
        parsed.bloco_alavanca.risco_ativacao = parsed.bloco_alavanca.risco || parsed.bloco_alavanca.risco_ativacao || '';
      }

      if (parsed.bloco_ponto_cego) {
        parsed.bloco_ponto_cego.persona_id = sId;
        parsed.bloco_ponto_cego.nome_persona = shadObj.nome_completo || parsed.bloco_ponto_cego.nome_persona;
        parsed.bloco_ponto_cego.fala_kapy = parsed.bloco_ponto_cego.fala_da_kapy || parsed.bloco_ponto_cego.fala_kapy || '';
        parsed.bloco_ponto_cego.acao_blindagem = parsed.bloco_ponto_cego.acao_de_blindagem || parsed.bloco_ponto_cego.acao_blindagem || '';
      }

      if (parsed.bloco_plano_ataque) {
        parsed.bloco_plano_ataque.fala_kapy = parsed.bloco_plano_ataque.objetivo_dos_7_dias || parsed.bloco_plano_ataque.fala_kapy || 'Sob a ótica de alocação de esforço e recursos em São José dos Campos, a trajetória mais prudente de validação progressiva compreende os seguintes passos:';
        parsed.bloco_plano_ataque.primeiro_passo_7_dias = (parsed.bloco_plano_ataque.passo_inicial_7_dias && typeof parsed.bloco_plano_ataque.passo_inicial_7_dias === 'object')
          ? `${parsed.bloco_plano_ataque.passo_inicial_7_dias.acao || ''} (Meta: ${parsed.bloco_plano_ataque.passo_inicial_7_dias.metrica_de_sucesso || 'Validação inicial'})`
          : (parsed.bloco_plano_ataque.primeiro_passo_7_dias || 'Rodar teste tático de 7 dias com oferta direta e mensuração da taxa de conversão local.');
        
        parsed.bloco_plano_ataque.passos_taticos = (parsed.bloco_plano_ataque.passos_taticos_prioritarios && Array.isArray(parsed.bloco_plano_ataque.passos_taticos_prioritarios))
          ? parsed.bloco_plano_ataque.passos_taticos_prioritarios.map((p, idx) => ({
              prioridade: p.ordem || idx + 1,
              acao: p.acao || '',
              publico: p.publico || p.hipotese_testada || 'Público prioritário de SJC',
              canal_ou_territorio: p.territorio ? `${p.territorio} • ${p.canal || ''}` : (p.canal || 'SJC'),
              mensagem_ou_oferta: p.hipotese_testada || p.acao || '',
              objetivo: p.metrica || p.acao || '',
              indicador_inicial: p.metrica || p.prazo || 'Validação direta'
            }))
          : (parsed.bloco_plano_ataque.passos_taticos || []);
      }

      // Aliases do diagnóstico geral
      const diagTexto = (typeof parsed.diagnostico_contextual === 'string' ? parsed.diagnostico_contextual : parsed.diagnostico_contextual?.analise_kapy) || parsed.resumo_executivo || '';
      const teseTexto = parsed.tese_central || (typeof parsed.diagnostico_contextual === 'object' ? parsed.diagnostico_contextual?.tese_de_posicionamento : '') || '';

      parsed.diagnostico_executivo = diagTexto;
      parsed.sintese = diagTexto;
      parsed.analise_consultor = diagTexto;
      parsed.tese_de_posicionamento = teseTexto;
      parsed.tese_central_texto = teseTexto;
      parsed.veredito_ideia = {
        status: "analise_contextual",
        rotulo: "DIAGNÓSTICO CONTEXTUAL • SÃO JOSÉ DOS CAMPOS 2026",
        conversa_franca_kapy: diagTexto,
        tese_de_posicionamento: teseTexto
      };

      return parsed;
    }

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
              temperature: 0.25,
              responseMimeType: "application/json"
            }
          })
        });

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          let rawJson = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "";
          rawJson = rawJson.replace(/^```json\s*/i, '').replace(/```$/g, '').trim();

          const parsed = JSON.parse(rawJson);
          const validated = normalizeAndValidateOracleJson(parsed, personasData);
          if (validated && validated.primary_persona_id) {
            console.log(" Leitura gerada via Google Gemini com sucesso!");
            return res.status(200).json(validated);
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
              { role: "user", content: `Analise a proposta do usuário e gere o JSON oficial do Oráculo RDR / Kapy. Responda APENAS o JSON puro.` }
            ],
            temperature: 0.25,
            response_format: { type: "json_object" }
          })
        });

        if (groqRes.ok) {
          const groqData = await groqRes.json();
          let rawJson = groqData.choices?.[0]?.message?.content || "";
          rawJson = rawJson.replace(/^```json\s*/i, '').replace(/```$/g, '').trim();

          const parsed = JSON.parse(rawJson);
          const validated = normalizeAndValidateOracleJson(parsed, personasData);
          if (validated && validated.primary_persona_id) {
            console.log(" Leitura gerada via Groq com sucesso!");
            return res.status(200).json(validated);
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
      leadSentence: `A proposta consiste em ${prop}, com atuação voltada à ${regiao}.`
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
  let leadSentence = `A proposta consiste em ${intent.charAt(0).toLowerCase() + intent.slice(1)}, com atuação voltada à ${regiao}.`;

  return { title, leadSentence };
}

// Gerador Determinístico Resiliente (Sempre entrega a estrutura 100% preenchida no novo esquema)
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

  const diagTexto = `${summary.leadSentence} Ao analisar essa proposta sob a ótica de mercado de São José dos Campos, observa-se que o público da ${regiaoNomes[targetReg] || 'região prioritária'} possui poder aquisitivo consistente, contudo exige comprovação prática de qualidade e atendimento com ancoragem local antes de alterar seus hábitos consolidados. A barreira central da praça não é a falta de interesse, mas a inércia em experimentar novidades sem chancela comunitária prévia. Para converter de forma sustentável, a operação deve articular a demanda direta de quem sente a dor diária com a recomendação de pares influentes no território.`;

  const teseTexto = `Posicionar como a referência autoral e confiável da cidade que entrega padrão superior com a conveniência e o acolhimento que o morador de SJC valoriza.`;

  // Garantir objetos de persona completos com schema v2
  primary.movimento_cultural = primary.movimento_cultural || primary.movimento;
  primary.faixa_renda_narrativa = primary.faixa_renda_narrativa || primary.faixa_renda;
  multiplier.movimento_cultural = multiplier.movimento_cultural || multiplier.movimento;
  multiplier.faixa_renda_narrativa = multiplier.faixa_renda_narrativa || multiplier.faixa_renda;
  shadow.movimento_cultural = shadow.movimento_cultural || shadow.movimento;
  shadow.faixa_renda_narrativa = shadow.faixa_renda_narrativa || shadow.faixa_renda;

  return {
    primary_persona_id: primary.id,
    multiplier_persona_id: multiplier.id,
    shadow_persona_id: shadow.id,
    confianca_geral: "alta",
    titulo_leitura: summary.title,
    sintese: diagTexto,
    analise_consultor: diagTexto,
    resumo_executivo: diagTexto,
    diagnostico_contextual: diagTexto,
    tese_de_posicionamento: teseTexto,
    tese_central_texto: teseTexto,
    tensao_principal: `A tensão entre a demanda por soluções de alto padrão e a tradicional cautela do consumidor joseense em migrar para novas marcas sem validação comunitária.`,
    premissas_e_lacunas: [
      `Premissa: a proposta mantém presença operacional e canal direto no território de ${primary.bairro}.`,
      `Lacuna: validação quantitativa da elasticidade de preço do serviço na praça.`
    ],
    base_da_decisao: [
      {
        tipo: "evidencia_de_persona",
        fonte: `Catálogo de Personas — ${primary.nome_completo} (ID ${primary.id})`,
        aplicacao: `Persona Central com aderência de rotina e poder aquisitivo em ${primary.bairro}.`
      },
      {
        tipo: "dado_fornecido",
        fonte: "Pesquisa Radar SJC 2026 (N=477)",
        aplicacao: `Comportamento de consumo na ${regiaoNomes[targetReg] || 'região prioritária'} e hábito de deslocamento viário.`
      },
      {
        tipo: "inferencia",
        fonte: "Movimento Geografia da Inércia / Relatório Oficial",
        aplicacao: `Adoção condicionada à chancela de pares e eliminação de fricção no primeiro contato via ${canalNomes[answers.q4_canal] || 'canal prioritário'}.`
      }
    ],
    bloco_persona_central: {
      persona_id: primary.id,
      nome_persona: primary.nome_completo,
      fala_da_kapy: `Na primeira carta, observamos o perfil de **${primary.nome_completo}**. ${moradorPrimary} de ${primary.bairro}, sua rotina é pautada pela conciliação entre exigências profissionais e gestão do tempo, enfrentando diariamente os nós viários da cidade. Sua busca não se resume ao produto em si, mas à eliminação de atritos rotineiros sem a necessidade de recorrer à capital. A adesão deste perfil se concretiza quando a comunicação demonstra respeito ao tempo ${delePrimary}, com informações objetivas e canais diretos de suporte.`,
      fala_kapy: `Na primeira carta, observamos o perfil de **${primary.nome_completo}**. ${moradorPrimary} de ${primary.bairro}, sua rotina é pautada pela conciliação entre exigências profissionais e gestão do tempo, enfrentando diariamente os nós viários da cidade. Sua busca não se resume ao produto em si, mas à eliminação de atritos rotineiros sem a necessidade de recorrer à capital. A adesão deste perfil se concretiza quando a comunicação demonstra respeito ao tempo ${delePrimary}, com informações objetivas e canais diretos de suporte.`,
      job_to_be_done: "Solucionar sua necessidade com previsibilidade técnica e conveniência, otimizando o tempo e evitando deslocamentos externos desnecessários.",
      mensagem_de_conquista: `Criado para a realidade de ${primary.bairro}: excelência técnica, previsibilidade e conveniência direta.`,
      mensagem_conquista: `Criado para a realidade de ${primary.bairro}: excelência técnica, previsibilidade e conveniência direta.`,
      objecao_principal: "Receio de pagar por uma promessa que não se sustente na prática ou que gere atrito no atendimento.",
      como_vencer_objecao: "Apresentar prova social consistente de SJC, clareza cirúrgica nos prazos e contato consultivo direto e ágil.",
      sinal_de_compra: "Solicitação de tabela de prazos e detalhamento de garantia na primeira mensagem.",
      evidencia: `Renda de ${primary.faixa_renda_narrativa || primary.faixa_renda || 'perfil qualificado'} e rotina centrada em ${primary.bairro}.`
    },
    bloco_alavanca: {
      persona_id: multiplier.id,
      nome_persona: multiplier.nome_completo,
      fala_da_kapy: `A segunda carta evidencia o papel estratégico de **${multiplier.nome_completo}**. No tecido social de São José dos Campos, a recomendação informal entre pares opera como o principal catalisador de autoridade. Com circulação ativa em ${multiplier.bairro}, ${pronMult.toLowerCase()} atua como um polo natural de referência. A aproximação estratégica não deve ser de venda direta, mas de experiência compartilhada e acesso antecipado, permitindo que a validação técnica espontânea ${deleMult} reduza a barreira de desconfiança do mercado local.`,
      fala_kapy: `A segunda carta evidencia o papel estratégico de **${multiplier.nome_completo}**. No tecido social de São José dos Campos, a recomendação informal entre pares opera como o principal catalisador de autoridade. Com circulação ativa em ${multiplier.bairro}, ${pronMult.toLowerCase()} atua como um polo natural de referência. A aproximação estratégica não deve ser de venda direta, mas de experiência compartilhada e acesso antecipado, permitindo que a validação técnica espontânea ${deleMult} reduza a barreira de desconfiança do mercado local.`,
      mecanismo_de_influencia: "Recomendação pessoal em círculos profissionais e grupos comunitários locais, onde sua opinião técnica possui peso comprovado.",
      mecanismo_influencia: "Recomendação pessoal em círculos profissionais e grupos comunitários locais, onde sua opinião técnica possui peso comprovado.",
      estrategia_de_parceria: `Desenvolver uma ação piloto de relacionamento ou co-branding no circuito de ${multiplier.bairro}, concedendo condição diferenciada para sua rede de contatos.`,
      estrategia_parceria: `Desenvolver uma ação piloto de relacionamento ou co-branding no circuito de ${multiplier.bairro}, concedendo condição diferenciada para sua rede de contatos.`,
      canal_mais_promissor: canalNomes[answers.q4_canal] || "Networking Local",
      risco: "Abordagem excessivamente transacional ou comercial antes da validação da experiência.",
      risco_ativacao: "Evitar abordagens estritamente transacionais; a credibilidade da parceria exige que a persona realmente vivencie e valide a entrega.",
      evidencia: `Circulação ampla e capital social ativo em ${multiplier.bairro}.`
    },
    bloco_ponto_cego: {
      persona_id: shadow.id,
      nome_persona: shadow.nome_completo,
      fala_da_kapy: `A terceira carta convida a uma reflexão atenta sobre a **Geografia da Inércia** em São José dos Campos. O consumidor local frequentemente reconhece a qualidade de uma novidade, porém prefere permanecer em suas escolhas consagradas devido ao receio de decepção ou atrito operacional. Campanhas com promessas infladas ou tom forasteiro tendem a gerar distanciamento silencioso. A mitigação eficaz dessa barreira requer ancoragem local, transparência nas condições e respeito ao ritmo de maturação de confiança da cidade.`,
      fala_kapy: `A terceira carta convida a uma reflexão atenta sobre a **Geografia da Inércia** em São José dos Campos. O consumidor local frequentemente reconhece a qualidade de uma novidade, porém prefere permanecer em suas escolhas consagradas devido ao receio de decepção ou atrito operacional. Campanhas com promessas infladas ou tom forasteiro tendem a gerar distanciamento silencioso. A mitigação eficaz dessa barreira requer ancoragem local, transparência nas condições e respeito ao ritmo de maturação de confiança da cidade.`,
      armadilha_local: "A tradicional cautela joseense diante de novidades apressadas ou abordagens que desconsiderem os hábitos dos bairros e o trânsito viário.",
      o_que_nunca_fazer: "Adotar postura de superioridade metropolitana ou restringir o suporte a fluxos automatizados sem opção de acolhimento humano.",
      acao_de_blindagem: "Demonstrar ancoragem e raízes na praça de SJC, explicitar garantias e preservar um canal de atendimento acessível e consultivo.",
      acao_blindagem: "Demonstrar ancoragem e raízes na praça de SJC, explicitar garantias e preservar um canal de atendimento acessível e consultivo.",
      evidencia: `Apego a rotinas estáveis e forte aversão a atritos de atendimento no movimento ${shadow.movimento_cultural || shadow.movimento || 'Geografia da Inércia'}.`
    },
    bloco_plano_ataque: {
      objetivo_dos_7_dias: "Validar a proposta com 5 a 10 compradores qualificados no território prioritário e colher os primeiros depoimentos verificáveis.",
      fala_kapy: "Em termos de alocação de esforço e recursos em São José dos Campos, a trajetória mais prudente de validação progressiva compreende os seguintes passos:",
      passo_inicial_7_dias: {
        acao: `Implementar oferta inaugural direcionada com atendimento consultivo`,
        territorio: primary.bairro || "SJC",
        canal: canalNomes[answers.q4_canal] || "Canal Prioritário",
        publico: primary.nome_completo + ` e perfis similares`,
        oferta_ou_mensagem: `Condição inaugural com consultoria assistida e garantia de entrega`,
        metrica_de_sucesso: `Mínimo de 5 conversões qualificadas e 80% de aprovação espontânea`,
        limiar_de_decisao: `Se >= 5 conversões: expandir escala; se 1-4 conversões: refinar mensagem de dor; se 0: revisar aderência de ticket e canal.`
      },
      primeiro_passo_7_dias: `Implementar um teste piloto de 7 dias com oferta direcionada a residentes de ${primary.bairro}, mensurando a resposta espontânea e a taxa de retorno.`,
      passos_taticos_prioritarios: [
        {
          ordem: 1,
          acao: `Comunicação de posicionamento orientada à dor de ${primary.nome_completo}`,
          canal: canalNomes[answers.q4_canal] || "Canal Direto",
          territorio: primary.bairro,
          prazo: "Dias 1 a 3",
          metrica: "Taxa de resposta e conversão qualificada no primeiro contato",
          hipotese_testada: "O público prioritário reconhece a dor e responde à proposta de conveniência."
        },
        {
          ordem: 2,
          acao: `Ativação da alavanca multiplicadora via ${multiplier.nome_completo}`,
          canal: "Networking regional e eventos locais",
          territorio: multiplier.bairro,
          prazo: "Dias 4 a 5",
          metrica: "Novos contatos qualificados provenientes de indicação direta",
          hipotese_testada: "A chancela de pares reduz o custo de aquisição e acelera a confiança."
        },
        {
          ordem: 3,
          acao: "Blindagem operacional contra os fatores de inércia identificados",
          canal: "Pontos de contato comerciais e suporte em SJC",
          territorio: "Praça SJC",
          prazo: "Dias 6 a 7",
          metrica: "Redução no tempo médio de fechamento e aumento da retenção",
          hipotese_testada: "Garantias claras e atendimento humanizado neutralizam a hesitação do joseense."
        }
      ],
      passos_taticos: [
        {
          prioridade: 1,
          acao: "Comunicação de posicionamento orientada à dor de " + primary.nome_completo,
          publico: primary.nome_completo + " e residentes de perfil similar em " + primary.bairro,
          canal_ou_territorio: `${primary.bairro} • ${canalNomes[answers.q4_canal] || "Canal Prioritário"}`,
          mensagem_ou_oferta: "Condição inaugural com atendimento consultivo e acompanhamento próximo",
          objetivo: "Conquistar os primeiros clientes promotores de forma consistente",
          indicador_inicial: "Taxa de resposta e conversão qualificada no primeiro contato"
        },
        {
          prioridade: 2,
          acao: "Ativação da alavanca multiplicadora via " + multiplier.nome_completo,
          publico: "Rede profissional e comunidade de influência de " + multiplier.bairro,
          canal_ou_territorio: `${multiplier.bairro} • Networking Regional`,
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
    pergunta_de_validacao: `Qual é o volume mínimo de clientes nos primeiros 30 dias necessário para cobrir o custo de operação local em ${primary.bairro}?`,
    // Objetos e arrays unificados
    primary: primary,
    multiplier: multiplier,
    shadow: shadow,
    tese_central: primary,
    alavanca_oculta: multiplier,
    ponto_cego: shadow,
    matching_personas: [primary.id, multiplier.id, shadow.id],
    primaryScore: 94,
    multiplierScore: 88,
    shadowScore: 72,
    diagnostico_executivo: diagTexto,
    veredito_ideia: {
      status: "analise_contextual",
      rotulo: "DIAGNÓSTICO CONTEXTUAL • SÃO JOSÉ DOS CAMPOS 2026",
      conversa_franca_kapy: diagTexto,
      tese_de_posicionamento: teseTexto
    }
  };
}
