// =========================================================================
// API Serverless: Persistência de Blocos, Mini-Planilhas e Chat no Supabase
// Radar São José - Plano de Negócios Colaborativo (Leonardo & Mayumi)
// =========================================================================

const fs = require('fs');
const path = require('path');

// Carregador de variáveis de ambiente (.env)
function loadEnv() {
  const envCandidates = [
    path.join(process.cwd(), '.env'),
    path.join(process.cwd(), '.env.local'),
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
loadEnv();

const SUPABASE_URL = process.env.SUPABASE_URL || "https://tocyvysucpslayzglixq.supabase.co";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "sb_publishable_8mKUf28dbMM8EOSPrgjRUA_19taJmrT";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY;

// Chave/Slug única para armazenamento do estado do Plano e Blocos no Supabase
const SYNC_SLUG = "system-business-plan-blocks-v2";

/**
 * Busca estado completo do Supabase
 */
async function fetchPlanStateFromSupabase() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return null;
  }

  // 1. Tenta buscar em business_plans se a tabela existir
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/business_plans?is_active=eq.true&select=*&limit=1`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });
    if (res.ok) {
      const rows = await res.json();
      if (Array.isArray(rows) && rows.length > 0 && rows[0].data) {
        return rows[0].data;
      }
    }
  } catch (e) {}

  // 2. Fallback de persistência universal em blog_posts (tabela ativa no Supabase)
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts?slug=eq.${SYNC_SLUG}&select=*`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });
    if (res.ok) {
      const rows = await res.json();
      if (Array.isArray(rows) && rows.length > 0) {
        const item = rows[0];
        let parsed = {};
        if (item.content) {
          try { parsed = JSON.parse(item.content); } catch (e) {}
        }
        return {
          ...parsed,
          PlanState: parsed.PlanState || parsed.planState?.PlanState || null,
          blocks: item.seo_metadata?.blocks || parsed.blocks || [],
          miniSpreadsheets: item.seo_metadata?.mini_spreadsheets || parsed.miniSpreadsheets || [],
          chatHistory: [],
          editedTexts: item.seo_metadata?.edited_texts || parsed.editedTexts || {},
          financialSheet: item.seo_metadata?.financial_sheet || parsed.financialSheet || [],
          swotCards: item.seo_metadata?.swot_cards || parsed.swotCards || [],
          updated_at: item.updated_at
        };
      }
    }
  } catch (e) {
    console.warn("[Plan Blocks API] Erro ao buscar do Supabase:", e.message);
  }

  return null;
}

/**
 * Salva estado completo no Supabase
 */
async function savePlanStateToSupabase(statePayload) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return false;
  }

  const payload = statePayload || {};
  const meta = {
    blocks: payload.blocks || [],
    mini_spreadsheets: payload.miniSpreadsheets || [],
    chat_history: [],
    edited_texts: payload.editedTexts || {},
    financial_sheet: payload.financialSheet || [],
    swot_cards: payload.swotCards || []
  };

  // 1. Tenta atualizar business_plans se existir
  try {
    const patchRes = await fetch(`${SUPABASE_URL}/rest/v1/business_plans?is_active=eq.true`, {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: payload,
        updated_at: new Date().toISOString()
      })
    });
    if (patchRes.ok) return true;
  } catch (e) {}

  // 2. Persiste em blog_posts com slug único dedicado
  try {
    const checkRes = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts?slug=eq.${SYNC_SLUG}&select=id`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });

    const exists = checkRes.ok && (await checkRes.json()).length > 0;
    const bodyContent = JSON.stringify({
      ...payload,
      updated_at: new Date().toISOString()
    });

    if (exists) {
      const updateRes = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts?slug=eq.${SYNC_SLUG}`, {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: bodyContent,
          seo_metadata: meta,
          updated_at: new Date().toISOString()
        })
      });
      return updateRes.ok;
    } else {
      const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: 'Estado Oficial do Plano de Negócios Radar São José',
          slug: SYNC_SLUG,
          status: 'draft',
          category: 'System Internal',
          content: bodyContent,
          seo_metadata: meta,
          author_name: 'Radar São José Admin',
          author_role: 'Sistema Central'
        })
      });
      return insertRes.ok;
    }
  } catch (e) {
    console.warn("[Plan Blocks API] Erro ao salvar no Supabase:", e.message);
    return false;
  }
}

// Handler HTTP Serverless
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const state = await fetchPlanStateFromSupabase();
      return res.status(200).json({
        success: true,
        data: state || {
          blocks: [],
          miniSpreadsheets: [],
          chatHistory: [],
          editedTexts: {},
          financialSheet: [],
          swotCards: []
        }
      });
    }

    if (req.method === 'POST' || req.method === 'PUT') {
      const payload = req.body || {};
      const saved = await savePlanStateToSupabase(payload);
      return res.status(200).json({
        success: saved,
        message: saved ? "Estado sincronizado com o Supabase com sucesso." : "Falha ao sincronizar com o Supabase.",
        data: payload
      });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("[Plan Blocks API Error]:", err);
    return res.status(500).json({ error: err.message });
  }
};

module.exports.fetchPlanStateFromSupabase = fetchPlanStateFromSupabase;
module.exports.savePlanStateToSupabase = savePlanStateToSupabase;
