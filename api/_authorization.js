// Authorization uses only verified Supabase Auth claims protected from user edits.
'use strict';
const { getDbPool } = require('../lib/db-pool');
async function requireAdmin(req, res, config) {
  const header = req.headers?.authorization || req.headers?.Authorization || '';
  const match = typeof header === 'string' && /^Bearer\s+(\S+)$/i.exec(header);
  if (!match) { res.status(401).json({success:false,code:'UNAUTHORIZED',message:'Autenticação necessária.'}); return false; }
  try {
    const response = await getDbPool().fetchWithPool(config.url + '/auth/v1/user', {
      method: 'GET',
      headers: { apikey: config.anonKey, Authorization: 'Bearer ' + match[1] }
    }, { timeoutMs: 10000, coalesce: true, cacheTtlMs: 3000 });
    if (!response.ok) { res.status(401).json({success:false,code:'UNAUTHORIZED',message:'Sessão inválida.'}); return false; }
    const user = await response.json();
    if (!user?.id) { res.status(401).json({success:false,code:'UNAUTHORIZED',message:'Sessão inválida.'}); return false; }
    if (user.app_metadata?.role !== 'admin' && user.app_metadata?.is_admin !== true) {
      res.status(403).json({success:false,code:'FORBIDDEN',message:'Permissão administrativa necessária.'}); return false;
    }
    return true;
  } catch (_) { res.status(503).json({success:false,code:'AUTH_UNAVAILABLE',message:'Validação de permissão indisponível.'}); return false; }
}
module.exports = {requireAdmin};
