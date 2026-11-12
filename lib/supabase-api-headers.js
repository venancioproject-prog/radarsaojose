'use strict';

// Modern Supabase API keys are not user JWTs. Keep them in apikey only.
function apiKeyHeaders(key) {
  return { apikey: key, ...(key.startsWith('sb_') ? {} : { Authorization: 'Bearer ' + key }) };
}

module.exports = { apiKeyHeaders };
