'use strict';

function isAdmin(user) {
  return user?.app_metadata?.role === 'admin' || user?.app_metadata?.is_admin === true;
}

// Call only after Supabase /auth/v1/user has validated this exact bearer token.
function hasRequiredMfa(user, token) {
  if (!isAdmin(user) && !user.factors?.some(factor => factor.status === 'verified')) return true;
  try {
    const claims = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString('utf8'));
    return claims.sub === user.id && claims.aal === 'aal2';
  } catch {
    return false;
  }
}

module.exports = { isAdmin, hasRequiredMfa };
