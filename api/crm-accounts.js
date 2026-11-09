'use strict';

const { requireAdmin } = require('./_authorization');
const { configuration, db } = require('../lib/billing-store');

const pageSize = 50;

function shortText(value, limit) {
  return typeof value === 'string' ? value.trim().slice(0, limit) : '';
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ code: 'METHOD_NOT_ALLOWED' });
  }

  const page = Number(req.query?.page ?? 1);
  if (!Number.isSafeInteger(page) || page < 1) {
    return res.status(400).json({ code: 'INVALID_PAGE' });
  }

  try {
    const { url, key, secret } = configuration();
    const anonKey = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;
    if (!await requireAdmin(req, res, { url, anonKey })) return;

    // Busca usuários reais com paginação no Auth Admin
    const response = await fetch(url + '/auth/v1/admin/users?page=' + page + '&per_page=' + pageSize, {
      headers: { apikey: key, ...(secret ? {} : { Authorization: 'Bearer ' + key }) },
      redirect: 'error',
      signal: AbortSignal.timeout(10000)
    });
    if (!response.ok) throw new Error('Account lookup failed');
    const { users } = await response.json();
    if (!Array.isArray(users)) throw new Error('Invalid account list');

    // Busca perfis comerciais para cruzar planos e telefones atualizados
    const userIds = users.map(u => u.id).filter(Boolean);
    let profilesMap = {};
    if (userIds.length > 0) {
      try {
        const idFilter = `in.(${userIds.join(',')})`;
        const profilesData = await db(`profiles?select=id,nome,email,role,plan_type,telefone,updated_at&id=${encodeURIComponent(idFilter)}`);
        if (Array.isArray(profilesData)) {
          for (const p of profilesData) {
            profilesMap[p.id] = p;
          }
        }
      } catch (_) {}
    }

    const accounts = users.map(user => {
      const meta = user.user_metadata || {};
      const prof = profilesMap[user.id] || {};
      const confirmedName = prof.nome || shortText(meta.radar_full_name, 120);
      const profileType = shortText(meta.radar_profile_type, 40) || prof.role || 'outros';
      const phone = prof.telefone || shortText(meta.telefone, 30) || shortText(meta.phone, 30) || shortText(user.phone, 30);
      const plan = prof.plan_type || 'gratis';

      return {
        id: user.id,
        name: confirmedName || shortText(meta.full_name, 120) || shortText(meta.name, 120) || 'Sem nome',
        email: shortText(user.email, 254),
        phone: phone || '',
        profile: profileType,
        plan: plan,
        createdAt: user.created_at || prof.updated_at || '',
        firstAccessComplete: Boolean(confirmedName && profileType && (
          meta.radar_terms_acceptance?.version === '0.2' ||
          Number.isFinite(Date.parse(meta.radar_terms_acceptance?.accepted_at))
        ))
      };
    });

    return res.status(200).json({ accounts, hasNextPage: users.length === pageSize });
  } catch {
    return res.status(503).json({ code: 'CRM_ACCOUNTS_UNAVAILABLE' });
  }
};
