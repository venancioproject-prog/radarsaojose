'use strict';

const { requireAdmin } = require('./_authorization');
const { configuration } = require('../lib/billing-store');

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

    const response = await fetch(url + '/auth/v1/admin/users?page=' + page + '&per_page=' + pageSize, {
      headers: { apikey: key, ...(secret ? {} : { Authorization: 'Bearer ' + key }) },
      redirect: 'error',
      signal: AbortSignal.timeout(10000)
    });
    if (!response.ok) throw new Error('Account lookup failed');
    const { users } = await response.json();
    if (!Array.isArray(users)) throw new Error('Invalid account list');

    const accounts = users.map(user => {
      const meta = user.user_metadata || {};
      const confirmedName = shortText(meta.radar_full_name, 120);
      const profile = shortText(meta.radar_profile_type, 40);
      return {
        name: confirmedName || shortText(meta.full_name, 120) || shortText(meta.name, 120),
        email: shortText(user.email, 254),
        profile,
        firstAccessComplete: Boolean(confirmedName && profile && meta.radar_terms_acceptance?.version === '0.2' &&
          Number.isFinite(Date.parse(meta.radar_terms_acceptance?.accepted_at)))
      };
    });

    return res.status(200).json({ accounts, hasNextPage: users.length === pageSize });
  } catch {
    return res.status(503).json({ code: 'CRM_ACCOUNTS_UNAVAILABLE' });
  }
};
