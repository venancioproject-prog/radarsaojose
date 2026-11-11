'use strict';

const { requireAdmin } = require('./_authorization');
const { configuration, db } = require('../lib/billing-store');
const { permits } = require('../lib/entitlements');
const { normalizePhone, profiles } = require('../radar-contact');
const handleFollowup = require('../lib/crm-followups');

const pageSize = 50;
const authPageSize = 500;
const termsVersion = '0.2';
const profileTypes = new Set(Object.keys(profiles));

function searchableText(value) {
  return String(value).normalize('NFD').replace(/\p{M}/gu, '').toLocaleLowerCase('pt-BR');
}

function shortText(value, limit) {
  return typeof value === 'string' ? value.trim().slice(0, limit) : '';
}

async function listUsers(config) {
  const users = [];
  for (let page = 1; page <= 20; page += 1) {
    const response = await fetch(config.url + '/auth/v1/admin/users?page=' + page + '&per_page=' + authPageSize, {
      headers: { apikey: config.key, ...(config.secret ? {} : { Authorization: 'Bearer ' + config.key }) },
      redirect: 'error',
      signal: AbortSignal.timeout(10000)
    });
    if (!response.ok) throw new Error('Account lookup failed');
    const body = await response.json();
    if (!Array.isArray(body.users)) throw new Error('Invalid account list');
    users.push(...body.users);
    if (body.users.length < authPageSize) return users;
  }
  // A partial base must never be presented as a complete customer total.
  throw new Error('Account scan limit reached');
}

async function relatedRows(table, columns, field, ids, extra = '') {
  const result = [];
  const uniqueIds = [...new Set(ids.filter(Boolean))];
  for (let start = 0; start < uniqueIds.length; start += 100) {
    const filter = encodeURIComponent('in.(' + uniqueIds.slice(start, start + 100).join(',') + ')');
    for (let offset = 0; ; offset += 1000) {
      const rows = await db(table + '?select=' + columns + '&' + field + '=' + filter +
        extra + '&limit=1000&offset=' + offset + '&order=id.asc');
      if (!Array.isArray(rows)) throw new Error('Invalid related account data');
      result.push(...rows);
      if (rows.length < 1000) break;
    }
  }
  return result;
}

function activeAccess(userId, ownSubscriptions, licenses, subscriptionsById, now) {
  const own = ownSubscriptions.get(userId);
  if (permits(own, own?.plan_type, now)) {
    return { plan: own.plan_type, planStatus: 'active', periodEnd: own.period_end, isGuest: false };
  }
  const guestSubscription = (licenses.get(userId) || [])
    .map(id => subscriptionsById.get(id))
    .find(subscription => subscription?.plan_type === 'midia' && permits(subscription, 'midia', now));
  if (guestSubscription) {
    return { plan: 'midia', planStatus: 'active', periodEnd: guestSubscription.period_end, isGuest: true };
  }
  return { plan: 'gratis', planStatus: own?.status || 'none', periodEnd: own?.period_end || null, isGuest: false };
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'PUT' || (req.method === 'GET' && req.query?.userId !== undefined)) {
    return handleFollowup(req, res);
  }
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET, PUT');
    return res.status(405).json({ code: 'METHOD_NOT_ALLOWED' });
  }
  const page = Number(req.query?.page ?? 1);
  const search = searchableText(shortText(req.query?.search, 120));
  const planFilter = shortText(req.query?.plan, 20);
  const profileFilter = shortText(req.query?.profile, 40);
  if (!Number.isSafeInteger(page) || page < 1 ||
      (planFilter && !['gratis', 'dash', 'report', 'midia', 'admin'].includes(planFilter)) ||
      (profileFilter && !profileTypes.has(profileFilter))) {
    return res.status(400).json({ code: 'INVALID_FILTER' });
  }

  try {
    const config = configuration();
    const anonKey = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;
    if (!await requireAdmin(req, res, { url: config.url, anonKey })) return;

    const users = await listUsers(config);
    const userIds = users.map(user => user.id);
    const [subscriptions, licenseRows, acceptances] = await Promise.all([
      relatedRows('billing_subscriptions', 'id,user_id,plan_type,status,period_start,period_end', 'user_id', userIds),
      relatedRows('billing_licenses', 'id,user_id,subscription_id', 'user_id', userIds),
      relatedRows('terms_acceptances', 'id,user_id,profile_type,terms_version,accepted_at', 'user_id', userIds,
        '&terms_version=eq.' + encodeURIComponent(termsVersion))
    ]);
    const ownSubscriptions = new Map(subscriptions.map(subscription => [subscription.user_id, subscription]));
    const subscriptionsById = new Map(subscriptions.map(subscription => [subscription.id, subscription]));
    const missingIds = licenseRows.map(license => license.subscription_id).filter(id => !subscriptionsById.has(id));
    if (missingIds.length) {
      const additional = await relatedRows('billing_subscriptions',
        'id,user_id,plan_type,status,period_start,period_end', 'id', missingIds);
      additional.forEach(subscription => subscriptionsById.set(subscription.id, subscription));
    }
    const licenses = new Map();
    licenseRows.forEach(license => {
      if (!licenses.has(license.user_id)) licenses.set(license.user_id, []);
      licenses.get(license.user_id).push(license.subscription_id);
    });
    const terms = new Map(acceptances.map(acceptance => [acceptance.user_id, acceptance]));
    const now = Date.now();
    let accounts = users.map(user => {
      const meta = user.user_metadata || {};
      const record = terms.get(user.id);
      const rawProfile = record?.profile_type || meta.radar_profile_type;
      const profile = profileTypes.has(rawProfile) ? rawProfile : '';
      const name = shortText(meta.radar_full_name, 120) || shortText(meta.full_name, 120) ||
        shortText(meta.name, 120) || shortText(meta.nome, 120);
      const isAdmin = user.app_metadata?.role === 'admin' || user.app_metadata?.is_admin === true;
      return {
        id: user.id,
        name,
        email: shortText(user.email, 254),
        phone: normalizePhone(meta.radar_phone || meta.telefone || meta.phone || user.phone) || '',
        profile,
        ...activeAccess(user.id, ownSubscriptions, licenses, subscriptionsById, now),
        isAdmin,
        emailConfirmed: Boolean(user.email_confirmed_at),
        createdAt: user.created_at || null,
        lastSignInAt: user.last_sign_in_at || null,
        firstAccessComplete: Boolean(name.length >= 2 && profile && record?.terms_version === termsVersion &&
          Number.isFinite(Date.parse(record.accepted_at))),
        termsAcceptedAt: record?.accepted_at || null
      };
    });

    const customers = accounts.filter(account => !account.isAdmin && !account.isGuest);
    const paid = customers.filter(account => account.plan !== 'gratis').length;
    const metrics = {
      total: customers.length,
      guestAccesses: accounts.filter(account => !account.isAdmin && account.isGuest).length,
      free: customers.length - paid,
      paid,
      newLast30Days: customers.filter(account => Date.parse(account.createdAt) >= now - 30 * 86400000).length,
      paidShare: customers.length ? Math.round(paid / customers.length * 1000) / 10 : 0
    };
    accounts = accounts.filter(account => {
      const matchesPlan = !planFilter || (planFilter === 'admin' ? account.isAdmin : !account.isAdmin && account.plan === planFilter);
      const matchesProfile = !profileFilter || account.profile === profileFilter;
      const searchable = searchableText([account.name, account.email, profiles[account.profile], account.phone].join(' '));
      const phoneSearch = normalizePhone(search);
      return matchesPlan && matchesProfile && (!search || searchable.includes(search) || (phoneSearch && account.phone === phoneSearch));
    });
    accounts.sort((a, b) => (Date.parse(b.createdAt) || 0) - (Date.parse(a.createdAt) || 0) || a.id.localeCompare(b.id));
    const total = accounts.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const currentPage = Math.min(page, totalPages);
    const visible = accounts.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    let followupsAvailable = true;
    let followups = [];
    try {
      // Followups are separate from commercial rights and can be deployed before migration 022.
      followups = await relatedRows('crm_account_followups',
        'id,user_id,stage,notes,next_contact_date,revision,updated_at', 'user_id', visible.map(account => account.id));
    } catch {
      followupsAvailable = false;
    }
    const followupsByUser = new Map(followups.map(row => [row.user_id, row]));
    return res.status(200).json({
      accounts: visible.map(account => ({ ...account, followup: followupsByUser.get(account.id) || null })),
      page: currentPage,
      total,
      totalPages,
      hasNextPage: currentPage < totalPages,
      metrics,
      followupsAvailable
    });
  } catch {
    return res.status(503).json({ code: 'CRM_ACCOUNTS_UNAVAILABLE' });
  }
};
