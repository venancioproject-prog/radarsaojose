// API Serverless: Gerenciamento de Blog & Posts (CRUD Completo)
// Supabase REST Engine + Fallback Seguro para Vercel Serverless
const fs = require('fs');
const path = require('path');

// Carregador de variáveis de ambiente (.env / .env.local)
function loadEnv() {
  const envFiles = ['.env.local', '.env'];
  for (const file of envFiles) {
    const p = path.join(process.cwd(), file);
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
loadEnv();

const SUPABASE_URL = process.env.SUPABASE_URL || "https://tocyvysucpslayzglixq.supabase.co";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "sb_publishable_8mKUf28dbMM8EOSPrgjRUA_19taJmrT";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY;

// Cache em memória para desenvolvimento / fallback offline
let localPostsCache = null;

function getFallbackArticles() {
  if (localPostsCache) return localPostsCache;
  const jsonPath = path.join(process.cwd(), 'radar-sao-jose-30-artigos.json');
  if (fs.existsSync(jsonPath)) {
    try {
      const raw = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      const arts = raw.articles || [];
      localPostsCache = arts.map((art, idx) => ({
        id: 'post-' + (idx + 1),
        title: art.title,
        slug: art.slug,
        excerpt: art.meta_description || art.answer_first,
        content: art.article_markdown || '',
        cover_image_url: 'fotos_radar/foto_' + ((idx % 6) + 1) + '.jpg',
        status: 'published',
        published_at: new Date(Date.now() - idx * 86400000).toISOString(),
        created_at: new Date(Date.now() - idx * 86400000).toISOString(),
        updated_at: new Date(Date.now() - idx * 86400000).toISOString(),
        author_name: 'Leonardo Venâncio',
        author_role: 'Head de Inteligência & Dados',
        category: getCategoryName(art.cluster),
        tags: [art.cluster, 'São José dos Campos', 'Inteligência'],
        seo_metadata: {
          seo_title: art.seo_title || art.title,
          meta_description: art.meta_description,
          bluf_summary: art.answer_first,
          primary_keyword: art.primary_keyword,
          geo_summary: art.geo_summary,
          read_time: '6 min de leitura',
          faq: art.faq || []
        },
        views_count: 1200 + (30 - idx) * 95,
        is_featured: idx === 0
      }));
      return localPostsCache;
    } catch (e) {
      console.error('Erro ao ler fallback JSON:', e);
    }
  }
  return [];
}

function getCategoryName(cluster) {
  const c = (cluster || '').toLowerCase();
  if (c.includes('popula') || c.includes('demogra') || c.includes('migra') || c.includes('habit')) return 'Demografia & População';
  if (c.includes('econom') || c.includes('empreg') || c.includes('trabalh') || c.includes('indús')) return 'Economia & Empregos';
  if (c.includes('morad') || c.includes('urban') || c.includes('aluguel') || c.includes('imobil')) return 'Imobiliário & Moradia';
  if (c.includes('ciênc') || c.includes('inov') || c.includes('tecnol') || c.includes('ita')) return 'Inovação & Tecnologia';
  if (c.includes('mobil') || c.includes('transp') || c.includes('dutra')) return 'Mobilidade & Infraestrutura';
  return 'Saúde, Ambiente & Cidade';
}

function slugify(text) {
  return String(text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

module.exports = async function handler(req, res) {
  // Configuração de CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const method = req.method;
  const query = req.query || {};

  try {
    // -------------------------------------------------------------
    // 1. GET: Listar ou Buscar Artigo
    // -------------------------------------------------------------
    if (method === 'GET') {
      const { slug, id, q, category, status, page = 1, limit = 10, sortBy = 'published_at', order = 'desc' } = query;

      // Buscar no Supabase REST
      let supabaseOk = false;
      let supabaseData = null;

      try {
        let endpoint = `${SUPABASE_URL}/rest/v1/blog_posts?select=*`;
        if (slug) {
          endpoint += `&slug=eq.${encodeURIComponent(slug)}`;
        } else if (id) {
          endpoint += `&id=eq.${encodeURIComponent(id)}`;
        } else {
          if (category && category !== 'all') endpoint += `&category=eq.${encodeURIComponent(category)}`;
          if (status && status !== 'all') endpoint += `&status=eq.${encodeURIComponent(status)}`;
          if (q) {
            endpoint += `&or=(title.ilike.*${encodeURIComponent(q)}*,slug.ilike.*${encodeURIComponent(q)}*,category.ilike.*${encodeURIComponent(q)}*)`;
          }
          endpoint += `&order=${sortBy}.${order}`;
        }

        const supRes = await fetch(endpoint, {
          headers: {
            'apikey': SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
            'Range-Unit': 'items',
            'Prefer': 'count=exact'
          }
        });

        if (supRes.ok) {
          supabaseData = await supRes.json();
          const contentRange = supRes.headers.get('content-range');
          let total = supabaseData.length;
          if (contentRange && contentRange.includes('/')) {
            total = parseInt(contentRange.split('/')[1], 10) || total;
          }
          supabaseOk = true;

          // Se pediu um único post
          if (slug || id) {
            if (supabaseData.length > 0) {
              return res.status(200).json({ success: true, post: supabaseData[0], source: 'supabase' });
            }
          } else {
            // Paginação no array recebido ou paginado
            const p = Math.max(1, parseInt(page, 10));
            const l = Math.max(1, parseInt(limit, 10));
            const startIndex = (p - 1) * l;
            const pagedPosts = supabaseData.slice(startIndex, startIndex + l);

            return res.status(200).json({
              success: true,
              posts: pagedPosts,
              pagination: {
                page: p,
                limit: l,
                total: total,
                totalPages: Math.ceil(total / l)
              },
              source: 'supabase'
            });
          }
        }
      } catch (err) {
        console.warn('[API Posts] Supabase fetch fallback:', err.message);
      }

      // Fallback para cache local/artigos locais se Supabase indisponível ou tabela vazia
      const fallbackList = getFallbackArticles();

      if (slug) {
        const found = fallbackList.find(p => p.slug === slug);
        if (found) return res.status(200).json({ success: true, post: found, source: 'local_fallback' });
        return res.status(404).json({ success: false, message: 'Artigo não encontrado.' });
      }

      if (id) {
        const found = fallbackList.find(p => p.id === id);
        if (found) return res.status(200).json({ success: true, post: found, source: 'local_fallback' });
        return res.status(404).json({ success: false, message: 'Artigo não encontrado.' });
      }

      // Filtrar lista fallback
      let filtered = [...fallbackList];
      if (category && category !== 'all') {
        filtered = filtered.filter(p => p.category === category);
      }
      if (status && status !== 'all') {
        filtered = filtered.filter(p => p.status === status);
      }
      if (q) {
        const queryLower = q.toLowerCase();
        filtered = filtered.filter(p =>
          (p.title || '').toLowerCase().includes(queryLower) ||
          (p.slug || '').toLowerCase().includes(queryLower) ||
          (p.category || '').toLowerCase().includes(queryLower)
        );
      }

      // Ordenar por published_at descendente (mais recente primeiro)
      filtered.sort((a, b) => new Date(b.published_at || 0) - new Date(a.published_at || 0));

      const pg = Math.max(1, parseInt(page, 10));
      const lm = Math.max(1, parseInt(limit, 10));
      const startIndex = (pg - 1) * lm;
      const pagedPosts = filtered.slice(startIndex, startIndex + lm);

      return res.status(200).json({
        success: true,
        posts: pagedPosts,
        pagination: {
          page: pg,
          limit: lm,
          total: filtered.length,
          totalPages: Math.ceil(filtered.length / lm)
        },
        source: 'local_fallback'
      });
    }

    // -------------------------------------------------------------
    // 2. POST: Criar Novo Artigo
    // -------------------------------------------------------------
    if (method === 'POST') {
      const body = req.body || {};
      const {
        title,
        slug,
        excerpt,
        content,
        cover_image_url,
        status = 'published',
        published_at,
        category = 'Demografia & População',
        author_name = 'Leonardo Venâncio',
        author_role = 'Head de Inteligência & Dados',
        tags = [],
        seo_metadata = {},
        is_featured = false
      } = body;

      if (!title || !title.trim()) {
        return res.status(400).json({ success: false, message: 'O título do artigo é obrigatório.' });
      }

      const postSlug = slugify(slug || title);
      const newPost = {
        title: title.trim(),
        slug: postSlug,
        excerpt: (excerpt || '').trim() || title.trim(),
        content: content || '<p>Conteúdo em elaboração.</p>',
        cover_image_url: cover_image_url || 'fotos_radar/foto_1.jpg',
        status: status || 'published',
        published_at: published_at || new Date().toISOString(),
        category: category || 'Demografia & População',
        author_name: author_name || 'Leonardo Venâncio',
        author_role: author_role || 'Head de Inteligência & Dados',
        tags: Array.isArray(tags) ? tags : [tags].filter(Boolean),
        seo_metadata: seo_metadata || {},
        is_featured: !!is_featured
      };

      // Incorporar campos de imagem em seo_metadata caso existam
      let mergedSeo = newPost.seo_metadata || {};
      if (typeof mergedSeo === 'string') {
        try { mergedSeo = JSON.parse(mergedSeo); } catch (e) { mergedSeo = {}; }
      }
      if (body.cover_image_alt !== undefined) mergedSeo.cover_image_alt = body.cover_image_alt;
      if (body.cover_image_caption !== undefined) mergedSeo.cover_image_caption = body.cover_image_caption;
      if (body.cover_image_credit !== undefined) mergedSeo.cover_image_credit = body.cover_image_credit;
      newPost.seo_metadata = mergedSeo;

      // Tentar salvar no Supabase
      try {
        const supRes = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts`, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify(newPost)
        });

        if (supRes.ok) {
          const inserted = await supRes.json();
          return res.status(201).json({ success: true, post: inserted[0] || newPost, message: 'Artigo publicado com sucesso no Supabase!' });
        } else {
          const errBody = await supRes.text();
          console.warn('[Supabase Insert Error]:', errBody);
        }
      } catch (err) {
        console.warn('[Supabase Insert Fallback]:', err.message);
      }

      // Fallback em memória para POST
      const localList = getFallbackArticles();
      const localCreated = {
        id: 'post-' + Date.now(),
        ...newPost,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      localList.unshift(localCreated);
      return res.status(201).json({ success: true, post: localCreated, source: 'local_fallback' });
    }

    // -------------------------------------------------------------
    // 3. PUT / PATCH: Atualizar Artigo Existente
    // -------------------------------------------------------------
    if (method === 'PUT' || method === 'PATCH') {
      const body = req.body || {};
      const targetId = body.id || query.id;
      const targetSlug = body.original_slug || body.slug || query.slug;

      if (!targetId && !targetSlug) {
        return res.status(400).json({ success: false, message: 'Identificador (id ou slug) é obrigatório para atualização.' });
      }

      const isUuid = (str) => typeof str === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

      // Colunas estritamente permitidas na tabela blog_posts do Supabase
      const VALID_SUPABASE_COLUMNS = [
        'title', 'slug', 'excerpt', 'content', 'cover_image_url', 
        'status', 'published_at', 'updated_at', 
        'author_name', 'author_role', 'category', 'tags', 
        'seo_metadata', 'views_count', 'is_featured'
      ];

      // Preparar seo_metadata incorporando campos de imagem caso existam
      let mergedSeo = body.seo_metadata || {};
      if (typeof mergedSeo === 'string') {
        try { mergedSeo = JSON.parse(mergedSeo); } catch (e) { mergedSeo = {}; }
      }
      if (body.cover_image_alt !== undefined) mergedSeo.cover_image_alt = body.cover_image_alt;
      if (body.cover_image_caption !== undefined) mergedSeo.cover_image_caption = body.cover_image_caption;
      if (body.cover_image_credit !== undefined) mergedSeo.cover_image_credit = body.cover_image_credit;

      const updatePayload = {};
      VALID_SUPABASE_COLUMNS.forEach(col => {
        if (body[col] !== undefined) {
          updatePayload[col] = body[col];
        }
      });
      updatePayload.seo_metadata = mergedSeo;
      updatePayload.updated_at = new Date().toISOString();

      if (body.slug) {
        updatePayload.slug = slugify(body.slug);
      }

      // Tentar atualizar no Supabase
      try {
        let updateUrl = `${SUPABASE_URL}/rest/v1/blog_posts?`;
        if (targetId && isUuid(targetId)) {
          updateUrl += `id=eq.${encodeURIComponent(targetId)}`;
        } else if (targetSlug) {
          updateUrl += `slug=eq.${encodeURIComponent(targetSlug)}`;
        } else if (targetId) {
          updateUrl += `slug=eq.${encodeURIComponent(targetId)}`;
        }

        const supRes = await fetch(updateUrl, {
          method: 'PATCH',
          headers: {
            'apikey': SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify(updatePayload)
        });

        if (supRes.ok) {
          const updated = await supRes.json();
          return res.status(200).json({ 
            success: true, 
            post: updated[0] || { ...body, ...updatePayload }, 
            message: 'Artigo atualizado com sucesso no Supabase!' 
          });
        } else {
          const errBody = await supRes.text();
          console.warn('[Supabase Patch Error]:', errBody);
        }
      } catch (err) {
        console.warn('[Supabase Patch Exception]:', err.message);
      }

      // Fallback em memória
      const localList = getFallbackArticles();
      const idx = localList.findIndex(p => p.id === targetId || p.slug === targetSlug || (body.slug && p.slug === body.slug));
      if (idx !== -1) {
        localList[idx] = {
          ...localList[idx],
          ...updatePayload,
          ...body
        };
        return res.status(200).json({ 
          success: true, 
          post: localList[idx], 
          message: 'Artigo atualizado localmente!' 
        });
      }

      return res.status(200).json({ 
        success: true, 
        post: { id: targetId, ...updatePayload }, 
        message: 'Artigo atualizado.' 
      });
    }

    // -------------------------------------------------------------
    // 4. DELETE: Excluir Artigo
    // -------------------------------------------------------------
    if (method === 'DELETE') {
      const targetId = query.id || (req.body && req.body.id);
      const targetSlug = query.slug || (req.body && req.body.slug);

      if (!targetId && !targetSlug) {
        return res.status(400).json({ success: false, message: 'ID ou Slug é obrigatório para exclusão.' });
      }

      const isUuid = (str) => typeof str === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

      // Deletar no Supabase
      try {
        let deleteUrl = `${SUPABASE_URL}/rest/v1/blog_posts?`;
        if (targetId && isUuid(targetId)) {
          deleteUrl += `id=eq.${encodeURIComponent(targetId)}`;
        } else if (targetSlug) {
          deleteUrl += `slug=eq.${encodeURIComponent(targetSlug)}`;
        } else if (targetId) {
          deleteUrl += `slug=eq.${encodeURIComponent(targetId)}`;
        }

        const supRes = await fetch(deleteUrl, {
          method: 'DELETE',
          headers: {
            'apikey': SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
          }
        });

        if (supRes.ok) {
          return res.status(200).json({ success: true, message: 'Artigo removido com sucesso do Supabase!' });
        }
      } catch (err) {
        console.warn('[Supabase Delete Exception]:', err.message);
      }

      // Fallback em memória
      const localList = getFallbackArticles();
      const idx = localList.findIndex(p => p.id === targetId || p.slug === targetSlug);
      if (idx !== -1) {
        localList.splice(idx, 1);
        return res.status(200).json({ success: true, message: 'Artigo excluído com sucesso!' });
      }

      return res.status(404).json({ success: false, message: 'Artigo não encontrado para exclusão.' });
    }

    return res.status(405).json({ success: false, message: `Método ${method} não suportado.` });
  } catch (globalErr) {
    console.error('[API Blog Posts Global Error]:', globalErr);
    return res.status(500).json({ success: false, message: 'Erro interno no servidor.', error: globalErr.message });
  }
};
