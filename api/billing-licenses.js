'use strict';
const store = require('../lib/billing-store');
const { getEffectiveEntitlement } = require('../lib/entitlements');

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!['GET', 'POST', 'DELETE'].includes(req.method)) {
    res.setHeader('Allow', 'GET, POST, DELETE');
    return res.status(405).json({ code: 'METHOD_NOT_ALLOWED' });
  }

  try {
    const user = await store.authenticate(req);

    // Endpoint de entitlement efetivo (assinatura própria ou licença de convidado Mídia ativa)
    const isEntitlementQuery =
      req.method === 'GET' &&
      (req.query?.action === 'entitlement' || (typeof req.url === 'string' && req.url.includes('action=entitlement')));
    if (isEntitlementQuery) {
      const entitlement = await getEffectiveEntitlement(user.id);
      return res.status(200).json({
        success: true,
        userId: user.id,
        email: user.email,
        entitlement
      });
    }

    const s = await store.subscription(user.id);
    if (!s || s.plan_type !== 'midia' || s.status !== 'active' ||
        Date.parse(s.period_start) > Date.now() || Date.parse(s.period_end) <= Date.now()) {
      throw new store.BillingError(403, 'ACTIVE_MIDIA_OWNER_REQUIRED');
    }

    // 1. GET: Listar Licenças e Vagas Disponíveis
    if (req.method === 'GET') {
      const rawLicenses = await store.db('billing_licenses?subscription_id=eq.' + encodeURIComponent(s.id) + '&select=id,user_id,created_at');
      const licensesList = Array.isArray(rawLicenses) ? rawLicenses : [];

      // Enriquece em lote único (evita N+1 queries sequenciais no Serverless)
      const profileMap = new Map();
      const guestIds = licensesList.map(l => l.user_id).filter(Boolean);
      if (guestIds.length > 0) {
        try {
          const inList = guestIds.map(id => encodeURIComponent(id)).join(',');
          const profRows = await store.db('profiles?id=in.(' + inList + ')&select=id,email,nome');
          if (Array.isArray(profRows)) {
            for (const p of profRows) {
              if (p && p.id) profileMap.set(p.id, p);
            }
          }
        } catch (_) {}
      }

      const enriched = licensesList.map(lic => {
        const profile = profileMap.get(lic.user_id) || null;
        return {
          id: lic.id,
          userId: lic.user_id,
          email: profile?.email || null,
          nome: profile?.nome || 'Convidado Mídia',
          createdAt: lic.created_at
        };
      });

      return res.status(200).json({
        success: true,
        owner: { id: user.id, email: user.email },
        licenses: enriched,
        limitTotal: 3,
        guestsCount: enriched.length,
        slotsAvailable: Math.max(0, 2 - enriched.length),
        periodEnd: s.period_end
      });
    }

    // Parse do Body
    let body;
    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    } catch (_) {
      throw new store.BillingError(400, 'INVALID_JSON');
    }

    // 2. DELETE: Remover Licença de Convidado
    if (req.method === 'DELETE') {
      const targetUserId = body?.userId;
      if (!UUID_REGEX.test(targetUserId || '')) {
        throw new store.BillingError(400, 'INVALID_USER_ID');
      }
      if (targetUserId === user.id) {
        throw new store.BillingError(400, 'CANNOT_REMOVE_OWNER');
      }
      await store.db(`billing_licenses?subscription_id=eq.${encodeURIComponent(s.id)}&user_id=eq.${encodeURIComponent(targetUserId)}`, {
        method: 'DELETE'
      });
      return res.status(200).json({ success: true, removedUserId: targetUserId });
    }

    // 3. POST: Adicionar Convidado (por UUID ou por E-mail)
    let targetUserId = body?.userId;
    const targetEmail = String(body?.email || '').trim().toLowerCase();

    if (!targetUserId && targetEmail) {
      if (!EMAIL_REGEX.test(targetEmail)) {
        throw new store.BillingError(400, 'INVALID_EMAIL');
      }
      // Busca usuário correspondente na tabela profiles
      const profRows = await store.db('profiles?email=eq.' + encodeURIComponent(targetEmail) + '&select=id,email,nome');
      if (profRows?.[0]?.id) {
        targetUserId = profRows[0].id;
      } else {
        // Fallback: busca por auth_user_id em crm_pessoas
        const crmRows = await store.db('crm_pessoas?email=eq.' + encodeURIComponent(targetEmail) + '&auth_user_id=not.is.null&select=auth_user_id');
        if (crmRows?.[0]?.auth_user_id) {
          targetUserId = crmRows[0].auth_user_id;
        }
      }

      if (!targetUserId) {
        return res.status(404).json({
          success: false,
          code: 'USER_NOT_REGISTERED',
          message: 'O usuário convidado precisa criar uma conta gratuita no Radar São José antes de ser adicionado à sua licença Mídia.'
        });
      }
    }

    if (!UUID_REGEX.test(targetUserId || '')) {
      throw new store.BillingError(400, 'REGISTERED_USER_ID_OR_EMAIL_REQUIRED');
    }

    if (targetUserId === user.id) {
      return res.status(200).json({ success: true, owner: true, message: 'O titular já é o proprietário desta assinatura.' });
    }

    const result = await store.db('rpc/billing_add_license', {
      method: 'POST',
      body: JSON.stringify({ p_owner_id: user.id, p_user_id: targetUserId })
    });

    return res.status(200).json({ success: true, targetUserId, result });
  } catch (error) {
    return store.fail(res, error);
  }
};
