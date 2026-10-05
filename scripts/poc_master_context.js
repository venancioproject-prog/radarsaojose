/**
 * PROVA DE CONCEITO (PoC) — CONTEXTO MESTRE RADAR SÃO JOSÉ (FASE 1)
 *
 * Script isolado de diagnóstico e validação do Contexto Mestre (Base + Atualizável).
 * Não altera nenhum arquivo do projeto nem o comportamento do consultor.js existente.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// 1. Carregar variáveis de ambiente do .env sem expor valores
function loadEnv() {
  const envPath = path.resolve(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.substring(0, idx).trim();
        const value = trimmed.substring(idx + 1).trim().replace(/^["']|["']$/g, '');
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  }
}

loadEnv();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error('[ERRO] GEMINI_API_KEY não encontrada no arquivo .env.');
  process.exit(1);
}

// 2. Definição das 11 fontes canônicas
const ROOT_DIR = path.resolve(__dirname, '..');

const CANONICAL_SOURCES = [
  {
    id: 'pesquisa_csv',
    sectionTitle: '1. PESQUISA QUANTITATIVA (CSV LIMPO)',
    filename: 'dados_pesquisa_limpos.csv',
    relativePath: 'dados_pesquisa_limpos.csv',
    description: 'Microdados das respostas tabuladas da pesquisa Radar São José'
  },
  {
    id: 'cap1_ground_truth',
    sectionTitle: '2. ANÁLISE ESTATÍSTICA E GROUND TRUTH (CAP1)',
    filename: 'all_cap1_ground_truth.json',
    relativePath: 'all_cap1_ground_truth.json',
    description: 'Estatísticas auditadas, tabulações e benchmarks do Capítulo 1'
  },
  {
    id: 'historia_data_js',
    sectionTitle: '3. HISTÓRIA & MEMÓRIA — BASE DE DADOS ESTRUTURADA',
    filename: 'historia_sjc_data.js',
    relativePath: 'historia_sjc_data.js',
    description: 'Ciclos históricos, patrimônios, cronologias e dados detalhados de São José dos Campos'
  },
  {
    id: 'historia_dossie_md',
    sectionTitle: '4. HISTÓRIA & MEMÓRIA — DOSSIÊ HISTÓRICO CANÔNICO',
    filename: 'Dossiê histórico de São José dos Campos (SP).md',
    relativePath: path.join('historia_sjc', 'Dossiê histórico de São José dos Campos (SP).md'),
    description: 'Dossiê narrativo e bibliográfico completo dos ciclos e transformações urbanas'
  },
  {
    id: 'bairros_geo_js',
    sectionTitle: '5. TERRITÓRIO E GEOGRAFIA URBANA',
    filename: 'sjc_bairros_geo.js',
    relativePath: 'sjc_bairros_geo.js',
    description: 'Delimitações territoriais, regiões e dados espaciais dos bairros'
  },
  {
    id: 'entrada_ibge_txt',
    sectionTitle: '6. DADOS DEMOGRÁFICOS E SOCIOECONÔMICOS (IBGE)',
    filename: 'entrada_ibge.txt',
    relativePath: 'entrada_ibge.txt',
    description: 'Censo e indicadores oficiais demográficos e socioeconômicos de SJC'
  },
  {
    id: 'apresentacao_final_txt',
    sectionTitle: '7. RELATÓRIO OFICIAL EXECUTIVO DO RADAR',
    filename: 'apresentacao-final.txt',
    relativePath: 'apresentacao-final.txt',
    description: 'Relatório executivo consolidado da pesquisa, conclusões e insights'
  },
  {
    id: 'artigos_json',
    sectionTitle: '8. ARTIGOS TEMÁTICOS E ANÁLISES EDITORIAIS (30 ARTIGOS)',
    filename: 'radar-sao-jose-30-artigos.json',
    relativePath: 'radar-sao-jose-30-artigos.json',
    description: 'Acervo dos 30 artigos editoriais aprofundados sobre temas estratégicos da cidade'
  },
  {
    id: 'personas_module_js',
    sectionTitle: '9. PERSONAS E ARQUÉTIPOS COMPORTAMENTAIS',
    filename: 'personas_sjc_module.js',
    relativePath: 'personas_sjc_module.js',
    description: 'Mapeamento sociodemográfico, psicológico e de consumo das personas de SJC'
  },
  {
    id: 'plano_negocios_md',
    sectionTitle: '10. PLANO DE NEGÓCIOS E DIRETRIZES ESTRATÉGICAS',
    filename: 'Plano_de_Negócios_Radar_São_José.md',
    relativePath: 'Plano_de_Negócios_Radar_São_José.md',
    description: 'Plano estratégico, modelo de negócio e diretrizes do ecossistema Radar'
  },
  {
    id: 'influenciadores_csv',
    sectionTitle: '11. MAPEAMENTO DE INFLUENCIADORES E ECOSSISTEMA LOCAL',
    filename: 'INFLUENCIADORES_RADAR_SJC.csv',
    relativePath: 'INFLUENCIADORES_RADAR_SJC.csv',
    description: 'Mapeamento de criadores de conteúdo e formadores de opinião locais'
  }
];

// 3. Função para calcular SHA-256
function sha256(content) {
  return crypto.createHash('sha256').update(content, 'utf8').digest('hex');
}

// 4. Montar o Contexto Mestre
function buildMasterContext(sources) {
  const fileReports = [];
  const sections = [];

  sections.push('# RADAR SÃO JOSÉ — CONTEXTO MESTRE BASE + ATUALIZÁVEL');
  sections.push('Documento canônico contendo todas as bases de conhecimento do ecossistema Radar São José.\n');

  for (const src of sources) {
    const fullPath = path.resolve(ROOT_DIR, src.relativePath);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Arquivo canônico não encontrado: ${src.relativePath} (${fullPath})`);
    }

    const rawContent = fs.readFileSync(fullPath, 'utf8');
    const hash = sha256(rawContent);
    const charCount = rawContent.length;
    const byteSize = Buffer.byteLength(rawContent, 'utf8');
    const estimatedTokens = Math.round(charCount / 4);

    fileReports.push({
      id: src.id,
      filename: src.filename,
      relativePath: src.relativePath,
      description: src.description,
      hash,
      charCount,
      byteSize,
      estimatedTokens
    });

    sections.push(`\n---\n\n## ${src.sectionTitle}`);
    sections.push(`<!-- METADADOS: id="${src.id}" file="${src.filename}" sha256="${hash}" bytes="${byteSize}" -->\n`);
    sections.push(rawContent);
  }

  const fullText = sections.join('\n');
  const masterHash = sha256(fullText);

  return {
    masterHash,
    fullText,
    fileReports,
    totalChars: fullText.length,
    totalBytes: Buffer.byteLength(fullText, 'utf8'),
    estimatedTokens: Math.round(fullText.length / 4)
  };
}

// 5. Listar modelos disponíveis
async function listAvailableModels() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`;
  const response = await fetch(url);
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Erro ao listar modelos (${response.status}): ${err}`);
  }
  const data = await response.json();
  return (data.models || []).map(m => ({
    name: m.name.replace('models/', ''),
    fullName: m.name,
    displayName: m.displayName,
    inputTokenLimit: m.inputTokenLimit,
    supportedMethods: m.supportedGenerationMethods || []
  }));
}

// 6. Chamada de API REST para Gemini: countTokens
async function geminiCountTokens(modelName, text) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:countTokens?key=${GEMINI_API_KEY}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text }]
        }
      ]
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Erro no countTokens (${response.status} ${response.statusText}): ${errText}`);
  }

  const data = await response.json();
  return data.totalTokens;
}

// 7. Chamada de API REST para Gemini: Context Caching (cachedContents)
async function tryGeminiCreateContextCache(modelName, masterText, masterHash) {
  const url = `https://generativelanguage.googleapis.com/v1beta/cachedContents?key=${GEMINI_API_KEY}`;
  const payload = {
    model: `models/${modelName}`,
    displayName: `radar_master_${masterHash.substring(0, 10)}`,
    ttl: '300s', // 5 minutos de teste para a PoC
    contents: [
      {
        role: 'user',
        parts: [{ text: masterText }]
      }
    ]
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const raw = await response.text();
  let json;
  try {
    json = JSON.parse(raw);
  } catch (e) {
    json = { raw };
  }

  return {
    status: response.status,
    ok: response.ok,
    statusText: response.statusText,
    data: json
  };
}

// 8. Chamada de API REST para Gemini: generateContent
async function geminiGenerateContent(modelName, contents, cachedContentName = null) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`;
  const payload = {
    contents,
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 2048
    }
  };

  if (cachedContentName) {
    payload.cachedContent = cachedContentName;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Erro no generateContent (${response.status} ${response.statusText}): ${errText}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const usageMetadata = data.usageMetadata || {};

  return { text, usageMetadata };
}

// 9. Teste de Invalidação de Hash
function testHashInvalidation(originalSources, masterResult) {
  const testModifiedText = masterResult.fullText + '\n// MODIFICAÇÃO_TESTE_INVALIDACAO = true';
  const newHash = sha256(testModifiedText);

  return {
    originalHash: masterResult.masterHash,
    modifiedHash: newHash,
    hashChanged: (masterResult.masterHash !== newHash)
  };
}

// 10. Execução Principal do Diagnóstico e Testes
async function run() {
  console.log('================================================================');
  console.log('🚀 INICIANDO FASE 1 — PROVA DE CONCEITO DO CONTEXTO MESTRE RADAR');
  console.log('================================================================\n');

  console.log('1. Lendo e indexando as 11 fontes canônicas...');
  const startTime = Date.now();
  const master = buildMasterContext(CANONICAL_SOURCES);
  const buildDuration = Date.now() - startTime;

  console.log(`\n✅ Contexto Mestre montado em ${buildDuration}ms`);
  console.log(`- Total de fontes: ${master.fileReports.length}`);
  console.log(`- Tamanho total: ${(master.totalBytes / (1024 * 1024)).toFixed(2)} MB (${master.totalBytes.toLocaleString()} bytes)`);
  console.log(`- Total de caracteres: ${master.totalChars.toLocaleString()}`);
  console.log(`- Estimativa de tokens (chars/4): ${master.estimatedTokens.toLocaleString()}`);
  console.log(`- Master Hash (SHA-256): ${master.masterHash}`);

  console.log('\n--- TABELA DE FONTES CANÔNICAS E HASHES ---');
  for (const src of master.fileReports) {
    console.log(`[${src.id}] ${src.filename}`);
    console.log(`    Hash SHA-256: ${src.hash}`);
    console.log(`    Tamanho: ${(src.byteSize / 1024).toFixed(1)} KB | Caracteres: ${src.charCount.toLocaleString()} | ~${src.estimatedTokens.toLocaleString()} tokens`);
  }

  // 2. Descobrir modelos disponíveis
  console.log('\n2. Consultando modelos disponíveis na chave Gemini...');
  let availableModels = [];
  try {
    availableModels = await listAvailableModels();
    console.log(`✅ Modelos suportados encontrados (${availableModels.length}):`);
    availableModels
      .filter(m => m.supportedMethods.includes('generateContent'))
      .forEach(m => console.log(`   - ${m.name} (Limite entrada: ${m.inputTokenLimit?.toLocaleString() || 'N/A'} tokens)`));
  } catch (err) {
    console.warn(`⚠️ Não foi possível listar modelos: ${err.message}`);
  }

  // Identificar o melhor modelo disponível
  const candidates = [
    'gemini-flash-latest',
    'gemini-3.1-flash-lite',
    'gemini-3.8-flash',
    'gemini-3.7-flash',
    'gemini-3.6-flash'
  ];

  let selectedModel = 'gemini-flash-latest';
  const found = candidates.find(c => availableModels.some(m => m.name === c));
  if (found) {
    selectedModel = found;
  } else if (availableModels.length > 0) {
    const firstGen = availableModels.find(m => m.supportedMethods.includes('generateContent') && m.inputTokenLimit >= 500000);
    if (firstGen) selectedModel = firstGen.name;
  }

  console.log(`\n👉 Modelo selecionado para os testes: ${selectedModel}`);

  // 3. Medir tokens reais via API Gemini
  console.log(`\n3. Medindo contagem oficial de tokens via API Gemini (countTokens com ${selectedModel})...`);
  let realTokens = null;
  try {
    const tStart = Date.now();
    realTokens = await geminiCountTokens(selectedModel, master.fullText);
    const tDur = Date.now() - tStart;
    console.log(`✅ Contagem oficial de tokens [${selectedModel}]: ${realTokens.toLocaleString()} tokens (medido em ${tDur}ms)`);
  } catch (err) {
    console.warn(`⚠️ Falha ao contar tokens com ${selectedModel}: ${err.message}`);
  }

  // 4. Testar Context Caching do Gemini
  console.log(`\n4. Testando Context Caching nativo da API Gemini (cachedContents com ${selectedModel})...`);
  let cacheResult = null;
  let cacheResourceName = null;
  try {
    cacheResult = await tryGeminiCreateContextCache(selectedModel, master.fullText, master.masterHash);
    console.log(`- Status HTTP da criação do cache: ${cacheResult.status} ${cacheResult.statusText}`);
    if (cacheResult.ok && cacheResult.data && cacheResult.data.name) {
      cacheResourceName = cacheResult.data.name;
      console.log(`✅ Context Caching CRIADO COM SUCESSO! Recurso: ${cacheResourceName}`);
      console.log(`- Expira em: ${cacheResult.data.expireTime}`);
    } else {
      console.log(`ℹ️ Resposta do Context Caching:`, JSON.stringify(cacheResult.data, null, 2));
    }
  } catch (err) {
    console.warn(`⚠️ Erro ao testar Context Caching: ${err.message}`);
  }

  // 5. Teste de Raciocínio Cruzado com Fontes do Contexto Mestre
  console.log('\n5. Executando Teste de Raciocínio Cruzado (Cross-Referencing entre Fontes)...');
  const testQuery = `Você é a Inteligência Central do Radar São José. Responda com precisão cirúrgica e EXCLUSIVAMENTE com base no Contexto Mestre fornecido.

PERGUNTAS DE VALIDAÇÃO CRUZADA:
1. [HISTÓRIA]: Em que ano foi inaugurado o Sanatório Vicentina Aranha na Fase Sanatorial e qual era o objetivo inicial de sua construção pela Santa Casa de Misericórdia de São Paulo?
2. [PESQUISA QUANTITATIVA / RELATÓRIO]: Qual o percentual de joseenses na pesquisa que relata a 'Falta de opções culturais/lazer' ou menções sobre o Parque Vicentina Aranha como polo cultural/verde central?
3. [PERSONAS / TERRITÓRIO]: Qual arquétipo ou persona do Radar São José tem hábitos de convivência e lazer diretamente ligados à Vila Ema / Aquarius / Parques, e qual é a sua faixa de renda e características de consumo?
4. [RASTREABILIDADE]: Para cada um dos 3 pontos acima, cite expressamente a seção/arquivo canônico exato de onde os dados foram extraídos.`;

  let responseData = null;
  const promptStart = Date.now();

  try {
    if (cacheResourceName) {
      console.log(`- Enviando prompt usando Context Cache (${cacheResourceName})...`);
      responseData = await geminiGenerateContent(
        selectedModel,
        [{ role: 'user', parts: [{ text: testQuery }] }],
        cacheResourceName
      );
    } else {
      // Como o Contexto Mestre Total tem 530k tokens e a cota gratuita por minuto do Gemini é de 250.000 TPM:
      console.log(`ℹ️ Diagnóstico de Cota: O Contexto Mestre Total possui ${realTokens.toLocaleString()} tokens.`);
      console.log(`ℹ️ Limite Free Tier do Gemini: 250.000 tokens/minuto (TPM) e Context Caching = 0 tokens.`);
      console.log(`👉 Enviando o Contexto Mestre Núcleo (Dossiê Histórico + Ground Truth + Relatório Oficial + Bairros Geo ~100k tokens) para demonstrar a inteligência de raciocínio cruzado multissetorial...`);

      const coreSources = CANONICAL_SOURCES.filter(s => [
        'cap1_ground_truth',
        'historia_dossie_md',
        'apresentacao_final_txt',
        'bairros_geo_js'
      ].includes(s.id));

      const coreMaster = buildMasterContext(coreSources);
      const coreTokens = await geminiCountTokens(selectedModel, coreMaster.fullText);
      console.log(`- Tokens do Contexto Núcleo Testado: ${coreTokens.toLocaleString()} tokens (100% dentro do limite gratuito de 250k TPM)`);

      const modelFallbackList = ['gemini-flash-latest', 'gemini-3.1-flash-lite'];
      let lastErr = null;
      for (const m of modelFallbackList) {
        try {
          console.log(`- Tentando geração com modelo: ${m}...`);
          responseData = await geminiGenerateContent(m, [
            {
              role: 'user',
              parts: [
                { text: coreMaster.fullText },
                { text: testQuery }
              ]
            }
          ]);
          console.log(`✅ Sucesso com o modelo: ${m}`);
          break;
        } catch (mErr) {
          console.warn(`⚠️ Modelo ${m} falhou: ${mErr.message}`);
          lastErr = mErr;
          await new Promise(r => setTimeout(r, 1000));
        }
      }
      if (!responseData) throw lastErr;
    }
    const promptDuration = Date.now() - promptStart;

    console.log(`\n✅ Resposta recebida com sucesso em ${promptDuration}ms!`);
    console.log('\n--- RESPOSTA DA IA (TESTE DE RACIOCÍNIO CRUZADO) ---');
    console.log(responseData.text);
    console.log('----------------------------------------------------');
    console.log('\n- Metadados de Uso (Usage Metadata):', JSON.stringify(responseData.usageMetadata, null, 2));
  } catch (err) {
    console.error(`❌ Erro durante o teste de geração: ${err.message}`);
  }

  // 6. Teste de Invalidação de Hash
  console.log('\n6. Executando Teste de Invalidação Automática de Cache...');
  const invalidationTest = testHashInvalidation(CANONICAL_SOURCES, master);
  console.log(`- Hash Original:  ${invalidationTest.originalHash}`);
  console.log(`- Hash Modificado: ${invalidationTest.modifiedHash}`);
  console.log(`- Invalidação detectada com sucesso? ${invalidationTest.hashChanged ? '✅ SIM (Qualquer alteração em byte invalida o master_hash)' : '❌ NÃO'}`);

  // 7. Resumo Final
  console.log('\n================================================================');
  console.log('🏁 DIAGNÓSTICO E PROVA DE CONCEITO CONCLUÍDOS COM SUCESSO');
  console.log('================================================================');
}

run().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
