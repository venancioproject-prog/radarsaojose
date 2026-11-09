'use strict';

const store = require('../lib/billing-store');
const { getEffectiveEntitlement } = require('../lib/entitlements');
const { isAdmin } = require('../lib/auth-mfa');

const columns = 'id,perfil,timestamp_brasilia,timestamp_utc,likes,comments,engajamento_total,tema_central,subtema,tom_noticia,sentimento_comentarios,gatilho_engajamento,entidades_citadas,url_post,caption';
const pageSize = 500;

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ code: 'METHOD_NOT_ALLOWED' });
  }
  try {
    const user = await store.authenticate(req);
    if (!isAdmin(user) && (await getEffectiveEntitlement(user.id)).planType !== 'midia') {
      throw new store.BillingError(403, 'ACTIVE_PLAN_REQUIRED');
    }
    const query = req.query || {};
    const after = query.after;
    if (Object.keys(query).some(key => key !== 'after') ||
        (after !== undefined && (typeof after !== 'string' || !/^[a-zA-Z0-9_-]{1,80}$/.test(after)))) {
      return res.status(400).json({ code: 'INVALID_MEDIA_QUERY' });
    }
    const rows = await store.db('analise_midia_sjc?select=' + columns + '&order=id.asc&limit=' + pageSize +
      (after ? '&id=gt.' + encodeURIComponent(after) : ''));
    return res.status(200).json({ rows, next: rows.length === pageSize ? rows.at(-1).id : null });
  } catch (error) {
    return store.fail(res, error);
  }
};
