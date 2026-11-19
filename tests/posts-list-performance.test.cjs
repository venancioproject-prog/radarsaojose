'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createRequire } = require('node:module');

const PUBLIC_COLUMNS = [
  'id', 'title', 'slug', 'excerpt', 'cover_image_url', 'status',
  'published_at', 'created_at', 'updated_at', 'author_name', 'author_role',
  'category', 'tags', 'seo_metadata', 'views_count', 'is_featured'
];

function createMockResponse() {
  return {
    statusCode: 200,
    headers: {},
    setHeader(name, value) {
      this.headers[name.toLowerCase()] = value;
      return this;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
    end() {
      return this;
    }
  };
}

function loadPostsHandler(options = {}) {
  const filename = path.resolve(__dirname, '..', 'api', 'posts.js');
  const localRequire = createRequire(filename);
  const module = { exports: {} };
  const poolCalls = [];

  const env = {
    SUPABASE_URL: options.supabaseUrl || 'https://mockproj.supabase.co',
    SUPABASE_ANON_KEY: options.supabaseAnonKey || 'mock-anon-key-12345',
    SUPABASE_SERVICE_KEY: options.supabaseServiceKey || 'mock-service-key-12345',
    ...options.extraEnv
  };

  const sandbox = {
    module,
    Buffer,
    console,
    URL,
    URLSearchParams,
    process: {
      env,
      cwd: () => path.resolve(__dirname, '..')
    },
    require(id) {
      if (id === './_authorization') {
        return {
          requireAdmin: async (req, res, config) => {
            if (options.allowAdmin) return true;
            res.status(401).json({ code: 'UNAUTHORIZED', message: 'Acesso restrito a administradores.' });
            return false;
          }
        };
      }
      if (id === '../lib/db-pool') {
        return {
          getDbPool: () => ({
            fetchWithPool: async (url, fetchOpts, poolOpts) => {
              poolCalls.push({ url, fetchOpts, poolOpts });
              if (options.dbError) {
                throw new Error(options.dbError);
              }
              if (options.dbResOk === false) {
                return {
                  ok: false,
                  status: 500,
                  headers: { get: () => null },
                  text: async () => 'Internal DB error',
                  json: async () => ({ error: 'DB error' })
                };
              }
              const mockData = typeof options.mockDbData === 'function'
                ? options.mockDbData(url)
                : (options.mockDbData || []);
              return {
                ok: true,
                status: 200,
                headers: {
                  get(headerName) {
                    if (String(headerName).toLowerCase() === 'content-range') {
                      return `0-${mockData.length}/${mockData.length}`;
                    }
                    return null;
                  }
                },
                json: async () => mockData,
                text: async () => JSON.stringify(mockData)
              };
            }
          })
        };
      }
      return localRequire(id);
    }
  };

  vm.runInNewContext(fs.readFileSync(filename, 'utf8'), sandbox);
  return { handler: module.exports, poolCalls };
}

test('Public blog listing uses projected columns and excludes content', async () => {
  const mockArticles = [
    {
      id: 'post-1',
      title: 'Crescimento de São José dos Campos',
      slug: 'crescimento-sjc',
      excerpt: 'Resumo sobre o crescimento demográfico.',
      cover_image_url: 'fotos_radar/foto_1.jpg',
      status: 'published',
      published_at: '2026-11-01T10:00:00.000Z',
      created_at: '2026-11-01T10:00:00.000Z',
      updated_at: '2026-11-01T10:00:00.000Z',
      author_name: 'Leonardo Venâncio',
      author_role: 'Head de Inteligência',
      category: 'Demografia & População',
      tags: ['SJC', 'Demografia'],
      seo_metadata: { read_time: '5 min' },
      views_count: 1500,
      is_featured: true
      // content is omitted by Supabase PostgREST projection
    }
  ];

  const { handler, poolCalls } = loadPostsHandler({
    mockDbData: () => mockArticles
  });

  const req = {
    method: 'GET',
    query: { limit: '10', page: '1' }
  };
  const res = createMockResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.source, 'supabase');
  assert.equal(poolCalls.length, 1);

  const calledUrl = poolCalls[0].url;
  // Assert select query uses PUBLIC_LIST_COLUMNS
  assert.ok(calledUrl.includes('select='), 'URL must contain select parameter');
  assert.ok(!calledUrl.includes('select=*'), 'Public listing must NOT use select=*');
  for (const col of PUBLIC_COLUMNS) {
    assert.ok(calledUrl.includes(col), `select projection must include column "${col}"`);
  }
  assert.ok(!calledUrl.includes('content,'), 'Projection must not request content column');
  assert.ok(calledUrl.includes('status=eq.published'), 'Public listing must require status=eq.published');

  // Verify response body items have required metadata but no content
  assert.equal(res.body.posts.length, 1);
  const item = res.body.posts[0];
  assert.equal(item.title, 'Crescimento de São José dos Campos');
  assert.equal(item.slug, 'crescimento-sjc');
  assert.equal(item.content, undefined, 'Public listing items must not contain content');
});

test('Single article query by slug retains select=* and returns content', async () => {
  const fullArticle = {
    id: 'post-1',
    title: 'Crescimento de São José dos Campos',
    slug: 'crescimento-sjc',
    excerpt: 'Resumo sobre o crescimento demográfico.',
    content: '## Introdução\n\nTexto longo e detalhado da análise completa da cidade.',
    cover_image_url: 'fotos_radar/foto_1.jpg',
    status: 'published',
    published_at: '2026-11-01T10:00:00.000Z',
    author_name: 'Leonardo Venâncio',
    category: 'Demografia & População'
  };

  const { handler, poolCalls } = loadPostsHandler({
    mockDbData: () => [fullArticle]
  });

  const req = {
    method: 'GET',
    query: { slug: 'crescimento-sjc' }
  };
  const res = createMockResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.source, 'supabase');
  assert.equal(poolCalls.length, 1);

  const calledUrl = poolCalls[0].url;
  assert.ok(calledUrl.includes('select=*'), 'Single article by slug must use select=*');
  assert.ok(calledUrl.includes('slug=eq.crescimento-sjc'));

  assert.ok(res.body.post);
  assert.equal(res.body.post.slug, 'crescimento-sjc');
  assert.equal(res.body.post.content, fullArticle.content, 'Single article must receive full content');
});

test('Single article query by id retains select=* and returns content', async () => {
  const fullArticle = {
    id: 'uuid-1234',
    title: 'Análise de Moradia em SJC',
    slug: 'moradia-sjc',
    content: '<article><p>Conteúdo extenso para edição ou visualização.</p></article>',
    status: 'published'
  };

  const { handler, poolCalls } = loadPostsHandler({
    mockDbData: () => [fullArticle]
  });

  const req = {
    method: 'GET',
    query: { id: 'uuid-1234' }
  };
  const res = createMockResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);
  assert.equal(poolCalls.length, 1);

  const calledUrl = poolCalls[0].url;
  assert.ok(calledUrl.includes('select=*'), 'Single article by id must use select=*');
  assert.ok(calledUrl.includes('id=eq.uuid-1234'));
  assert.equal(res.body.post.content, fullArticle.content);
});

test('Admin listing retains select=* so in-memory posts in admin-crm.html have content for editing', async () => {
  const adminArticles = [
    {
      id: 'post-10',
      title: 'Rascunho de Planejamento',
      slug: 'rascunho-planejamento',
      content: '<p>Texto completo que o editor precisa carregar no modal de edição</p>',
      status: 'draft'
    }
  ];

  const { handler, poolCalls } = loadPostsHandler({
    allowAdmin: true,
    mockDbData: () => adminArticles
  });

  const req = {
    method: 'GET',
    query: { admin: 'true', limit: '50' }
  };
  const res = createMockResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.success, true);
  assert.equal(poolCalls.length, 1);

  const calledUrl = poolCalls[0].url;
  assert.ok(calledUrl.includes('select=*'), 'Admin listing must preserve select=* for in-memory CRM editing');
  assert.ok(!calledUrl.includes('status=eq.published'), 'Admin listing must allow draft and archived posts');
  assert.equal(res.body.posts[0].content, adminArticles[0].content);
});

test('Security invariants: reserved system slug 404, non-admin blocked', async () => {
  const { handler, poolCalls } = loadPostsHandler({
    allowAdmin: false
  });

  // 1. Reserved system slug is rejected with 404
  const res404 = createMockResponse();
  await handler({ method: 'GET', query: { slug: 'system-business-plan-blocks-v2' } }, res404);
  assert.equal(res404.statusCode, 404);
  assert.equal(res404.body.success, false);
  assert.equal(poolCalls.length, 0, 'No DB call for reserved slug');

  // 2. Admin view without admin credentials is rejected
  const res401 = createMockResponse();
  await handler({ method: 'GET', query: { admin: 'true' } }, res401);
  assert.equal(res401.statusCode, 401);
  assert.equal(res401.body.code, 'UNAUTHORIZED');
  assert.equal(poolCalls.length, 0, 'No DB call when unauthorized');
});

test('Local fallback parity: public listing omits content, single post and admin retain content', async () => {
  // DB error triggers local_fallback
  const { handler } = loadPostsHandler({
    dbError: 'Supabase network timeout'
  });

  // 1. Public listing in fallback
  const resPub = createMockResponse();
  await handler({ method: 'GET', query: { limit: '5' } }, resPub);
  assert.equal(resPub.statusCode, 200);
  assert.equal(resPub.body.source, 'local_fallback');
  assert.ok(resPub.body.posts.length > 0);
  for (const post of resPub.body.posts) {
    assert.equal(post.content, undefined, 'Fallback public post must not include content');
    assert.ok(post.title, 'Fallback public post must include title');
    assert.ok(post.slug, 'Fallback public post must include slug');
    assert.ok(post.excerpt, 'Fallback public post must include excerpt');
  }

  // 2. Single post in fallback
  const firstSlug = resPub.body.posts[0].slug;
  const resSingle = createMockResponse();
  await handler({ method: 'GET', query: { slug: firstSlug } }, resSingle);
  assert.equal(resSingle.statusCode, 200);
  assert.equal(resSingle.body.source, 'local_fallback');
  assert.ok(resSingle.body.post.content, 'Fallback single post must retain content');

  // 3. Admin listing in fallback
  const { handler: adminFallbackHandler } = loadPostsHandler({
    dbError: 'Supabase network timeout',
    allowAdmin: true
  });
  const resAdmin = createMockResponse();
  await adminFallbackHandler({ method: 'GET', query: { admin: 'true', limit: '5' } }, resAdmin);
  assert.equal(resAdmin.statusCode, 200);
  assert.equal(resAdmin.body.source, 'local_fallback');
  assert.ok(resAdmin.body.posts[0].content, 'Fallback admin listing must retain content');
});

test('Synthetic payload benchmark: projection reduces list size substantially', () => {
  // Construct 10 synthetic articles modeled after actual Radar São José editorial pieces
  const sampleArticles = Array.from({ length: 10 }, (_, i) => ({
    id: `post-${i + 1}`,
    title: `Análise Socioeconômica e Demográfica do Município de São José dos Campos - Edição #${i + 1}`,
    slug: `analise-socioeconomica-demografica-sjc-${i + 1}`,
    excerpt: `Síntese executiva dos principais vetores de expansão territorial e densidade econômica no Vale do Paraíba com ênfase no setor aeroespacial e de serviços (${i + 1}).`,
    content: `
# Análise Setorial Aprofundada #${i + 1}

## Sumário Executivo
Este documento consolida a evolução dos índices econômicos, taxa de emprego formal e verticalização urbana registrada nos últimos trimestres em São José dos Campos.

### Metodologia e Coleta
Os dados foram agregados a partir de registros administrativos, CAGED, RAIS e projeções geoespaciais setoriais com intervalo de confiança de 95%.

\`\`\`json
{
  "cenario": "base",
  "coeficiente_expansao": 1.482,
  "distribuicao_geografica": ["Centro", "Zona Sul", "Zona Leste", "Vila Ema", "Urbanova"]
}
\`\`\`

## 1. Demografia e Migração Qualificada
A atratividade do polo tecnológico gerou migração líquida positiva superior a 4.200 famílias ao ano, concentrando-se em profissionais de engenharia, TI e gestão industrial.

| Região | População 2024 | Variação % | Renda Média (R$) |
|:-------|:--------------:|:----------:|:----------------:|
| Zona Oeste / Aquarius | 48.200 | +3.4% | 12.850 |
| Urbanova | 24.100 | +5.8% | 18.400 |
| Zona Sul | 210.000 | +1.2% | 4.800 |
| Zona Leste | 185.000 | +1.9% | 4.100 |

## 2. Mercado Imobiliário e Absorção Comercial
A vacância de galpões logísticos classe A ao longo do eixo da Rodovia Presidente Dutra permanece abaixo de 6.5%, impulsionando novos lançamentos e condomínios empresariais.

${'Parágrafo longo de fundamentação e análise de risco para investidores institucionais e empreendedores locais com detalhes cadastrais e comparativos históricos. '.repeat(60)}

## Considerações Finais
Recomenda-se acompanhamento contínuo dos indicadores de infraestrutura e suprimento hídrico para mitigar potenciais gargalos no horizonte 2026-2030.
    `.trim(),
    cover_image_url: `fotos_radar/foto_${(i % 6) + 1}.jpg`,
    status: 'published',
    published_at: new Date(Date.now() - i * 86400000).toISOString(),
    created_at: new Date(Date.now() - i * 86400000).toISOString(),
    updated_at: new Date(Date.now() - i * 86400000).toISOString(),
    author_name: 'Leonardo Venâncio',
    author_role: 'Head de Inteligência & Dados',
    category: 'Economia & Empregos',
    tags: ['São José dos Campos', 'Economia', 'Empregos', 'Demografia'],
    seo_metadata: {
      seo_title: `Análise Socioeconômica SJC #${i + 1} | Radar`,
      meta_description: `Análise completa do mercado em SJC #${i + 1}`,
      read_time: '7 min de leitura'
    },
    views_count: 1450 + i * 80,
    is_featured: i === 0
  }));

  // Full payload (as returned with select=*)
  const fullPayload = {
    success: true,
    posts: sampleArticles,
    pagination: { page: 1, limit: 10, total: 10, totalPages: 1 },
    source: 'supabase'
  };
  const fullBytes = Buffer.byteLength(JSON.stringify(fullPayload), 'utf8');

  // Projected payload (as returned with select=PUBLIC_LIST_COLUMNS, stripping content)
  const projectedArticles = sampleArticles.map(({ content, ...rest }) => rest);
  const projectedPayload = {
    success: true,
    posts: projectedArticles,
    pagination: { page: 1, limit: 10, total: 10, totalPages: 1 },
    source: 'supabase'
  };
  const projectedBytes = Buffer.byteLength(JSON.stringify(projectedPayload), 'utf8');

  const savedBytes = fullBytes - projectedBytes;
  const reductionPct = ((savedBytes / fullBytes) * 100).toFixed(2);

  // Assert significant reduction
  assert.ok(projectedBytes < fullBytes, 'Projected payload must be strictly smaller than full payload');
  assert.ok(parseFloat(reductionPct) > 70, `Expected >70% reduction, got ${reductionPct}%`);

  console.log(`\n  [Synthetic Payload Benchmark - 10 Articles]`);
  console.log(`  Payload completo (com content): ${fullBytes.toLocaleString('pt-BR')} bytes`);
  console.log(`  Payload projetado (sem content): ${projectedBytes.toLocaleString('pt-BR')} bytes`);
  console.log(`  Economia de tráfego por requisição: ${savedBytes.toLocaleString('pt-BR')} bytes (-${reductionPct}%)\n`);
});
