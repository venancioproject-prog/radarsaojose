'use strict';
const store = require('./billing-store');
const {PLAN_PRICES_CENTS} = require('./pricing');
function permits(s, minimum, now = Date.now()) {
  return Boolean(s && s.status === 'active' && Date.parse(s.period_start) <= now &&
    Date.parse(s.period_end) > now && PLAN_PRICES_CENTS[s.plan_type] >= PLAN_PRICES_CENTS[minimum]);
}
async function getEffectiveEntitlement(userId, now = Date.now()) {
  const ownSub = await store.subscription(userId);
  if (ownSub && permits(ownSub, ownSub.plan_type, now)) {
    return {
      planType: ownSub.plan_type,
      status: 'active',
      source: 'subscription',
      subscriptionId: ownSub.id,
      periodStart: ownSub.period_start,
      periodEnd: ownSub.period_end,
      isLicenseGuest: false
    };
  }
  const licenses = await store.db('billing_licenses?user_id=eq.' + encodeURIComponent(userId) + '&select=subscription_id');
  for (const license of licenses || []) {
    const rows = await store.db('billing_subscriptions?id=eq.' + encodeURIComponent(license.subscription_id) + '&select=*');
    if (rows?.[0]?.plan_type === 'midia' && permits(rows[0], 'midia', now)) {
      return {
        planType: 'midia',
        status: 'active',
        source: 'midia_license',
        subscriptionId: rows[0].id,
        periodStart: rows[0].period_start,
        periodEnd: rows[0].period_end,
        isLicenseGuest: true
      };
    }
  }
  return {
    planType: 'gratis',
    status: ownSub?.status || 'none',
    source: 'none',
    subscriptionId: ownSub?.id || null,
    periodStart: ownSub?.period_start || null,
    periodEnd: ownSub?.period_end || null,
    isLicenseGuest: false
  };
}
async function requirePlan(req, res, minimum) {
  try {
    const user = await store.authenticate(req);
    let active = await store.subscription(user.id);
    if (!permits(active, minimum)) {
      const licenses = await store.db('billing_licenses?user_id=eq.' + encodeURIComponent(user.id) + '&select=subscription_id');
      for (const license of licenses || []) {
        const rows = await store.db('billing_subscriptions?id=eq.' + encodeURIComponent(license.subscription_id) + '&select=*');
        if (rows?.[0]?.plan_type === 'midia' && permits(rows[0], minimum)) { active = rows[0]; break; }
      }
    }
    if (!permits(active, minimum)) throw new store.BillingError(403, 'ACTIVE_PLAN_REQUIRED');
    return {user, subscription:active};
  } catch (error) { store.fail(res, error); return null; }
}
module.exports = {permits, getEffectiveEntitlement, requirePlan};
