'use strict';

function asaasConfig(env) {
  const environment = (env.ASAAS_ENVIRONMENT || 'sandbox').trim().toLowerCase();
  const sandbox = environment === 'sandbox';
  const expectedUrl = sandbox ? 'https://api-sandbox.asaas.com/v3' : 'https://api.asaas.com/v3';
  const url = (env.ASAAS_API_URL || expectedUrl).trim().replace(/\/$/, '');
  const valid = (sandbox || environment === 'production') && url === expectedUrl &&
    (env.VERCEL_ENV !== 'preview' || sandbox) &&
    (env.VERCEL_ENV !== 'production' || !sandbox);
  const key = sandbox ? env.ASAAS_SANDBOX_API_KEY : env.ASAAS_API_KEY;
  return { environment, url, key: valid ? key : undefined };
}

module.exports = { asaasConfig };
