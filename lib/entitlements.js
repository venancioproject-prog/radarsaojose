'use strict';
const store = require('./billing-store');
const {PLAN_PRICES_CENTS} = require('./pricing');
function permits(s, minimum, now = Date.now()) {
  return Boolean(s && s.status === 'active' && Date.parse(s.period_start) <= now &&
    Date.parse(s.period_end) > now && PLAN_PRICES_CENTS[s.plan_type] >= PLAN_PRICES_CENTS[minimum]);
}
function selectEffectiveAccess(ownSub, invitedSubscriptions, now = Date.now()) {
  const ownActive = permits(ownSub, ownSub?.plan_type, now);
  // A personal lower plan must not hide a valid Media team invitation.
  // On a Media tie prefer ownership so the owner keeps team management.
  if (ownActive && ownSub.plan_type === 'midia') return { subscription: ownSub, isLicenseGuest: false };
  const invited = invitedSubscriptions.find(s => s?.plan_type === 'midia' && permits(s, 'midia', now));
  if (invited) return { subscription: invited, isLicenseGuest: true };
  return ownActive ? { subscription: ownSub, isLicenseGuest: false } : null;
}
async function getEffectiveEntitlement(userId, now = Date.now()) {
  const ownSub = await store.subscription(userId);
  let access = selectEffectiveAccess(ownSub, [], now);
  if (access?.subscription.plan_type !== 'midia') {
    const licenses = await store.db('billing_licenses?user_id=eq.' + encodeURIComponent(userId) + '&select=subscription_id');
    for (const license of licenses || []) {
      const rows = await store.db('billing_subscriptions?id=eq.' + encodeURIComponent(license.subscription_id) + '&select=*');
      access = selectEffectiveAccess(ownSub, rows || [], now);
      if (access?.isLicenseGuest) break;
    }
  }
  if (access) {
    const active = access.subscription;
    return {
      planType: active.plan_type,
      status: 'active',
      source: access.isLicenseGuest ? 'midia_license' : 'subscription',
      subscriptionId: active.id,
      periodStart: active.period_start,
      periodEnd: active.period_end,
      isLicenseGuest: access.isLicenseGuest
    };
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
module.exports = {permits, selectEffectiveAccess, getEffectiveEntitlement, requirePlan};
