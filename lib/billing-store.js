'use strict';
const { getDbPool } = require('./db-pool');
class BillingError extends Error {
  constructor(status, code) { super(code); this.status = status; this.code = code; }
}
function configuration() {
  const url = process.env.SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY;
  const key = secret || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new BillingError(503, 'BILLING_NOT_CONFIGURED');
  return {url, key, secret};
}
async function db(path, options = {}) {
  const {url, key, secret} = configuration();
  const pool = getDbPool();
  let response;
  try {
    response = await pool.fetchWithPool(url + '/rest/v1/' + path, {
      ...options,
      headers: {
        apikey: key,
        ...(secret ? {} : { Authorization: 'Bearer ' + key }),
        'Content-Type': 'application/json',
        ...options.headers
      }
    }, {
      timeoutMs: 10000,
      coalesce: !options.method || String(options.method).toUpperCase() === 'GET'
    });
  } catch (_) {
    throw new BillingError(503, 'BILLING_STORAGE_FAILED');
  }
  if (!response.ok) throw new BillingError(503, 'BILLING_STORAGE_FAILED');
  const raw = await response.text();
  return raw ? JSON.parse(raw) : null;
}
async function authenticate(req) {
  const header = req.headers?.authorization || req.headers?.Authorization || '';
  if (!/^Bearer\s+\S+$/i.test(header)) throw new BillingError(401, 'AUTH_REQUIRED');
  const {url, key} = configuration();
  const pool = getDbPool();
  let response;
  try {
    response = await pool.fetchWithPool(url + '/auth/v1/user', {
      headers: { apikey: key, Authorization: header }
    }, {
      timeoutMs: 10000,
      coalesce: true,
      cacheTtlMs: 3000
    });
  } catch (_) {
    throw new BillingError(401, 'INVALID_SESSION');
  }
  if (!response.ok) throw new BillingError(401, 'INVALID_SESSION');
  const user = await response.json();
  if (!user.id || !user.email) throw new BillingError(401, 'INVALID_SESSION');
  return user;
}
async function subscription(userId) {
  const rows = await db('billing_subscriptions?user_id=eq.' + encodeURIComponent(userId) + '&select=*');
  return rows?.[0] || null;
}
const BILLING_ERROR_MESSAGES = Object.freeze({
  AUTH_REQUIRED: 'Autenticação obrigatória. Entre na sua conta para continuar.',
  INVALID_SESSION: 'Sua sessão expirou ou é inválida. Faça login novamente.',
  INVALID_JSON: 'Formato de requisição inválido.',
  INVALID_BODY: 'Dados da requisição ausentes ou inválidos.',
  INVALID_PLAN: 'Plano comercial selecionado é inválido.',
  PRICE_CHANGED: 'O valor mudou. Confira a nova cotação antes de continuar.',
  INVALID_DOCUMENT: 'CPF ou CNPJ inválido. Verifique os dígitos informados.',
  INVALID_NAME: 'Informe seu nome completo ou razão social (mínimo 3 caracteres).',
  INVALID_CARD: 'Dados do cartão de crédito inválidos. Verifique número, validade e CVV.',
  CARD_EXPIRED: 'Cartão de crédito com validade expirada.',
  CARD_ADDRESS_REQUIRED: 'Informe o CEP e o número do endereço do titular do cartão.',
  HOSTED_CARD_ONLY: 'Informe os dados do cartão diretamente no Asaas.',
  ORDER_PENDING_RECONCILIATION: 'Você já possui um pedido pendente em processamento. Aguarde a confirmação ou conciliação.',
  INSTALLMENT_REPLACEMENT_REQUIRES_RECONCILIATION: 'Upgrade de assinatura parcelada requer conciliação prévia das parcelas atuais.',
  SUBSCRIPTION_REQUIRES_RECONCILIATION: 'Sua assinatura atual requer conciliação antes de uma nova operação.',
  PAYMENT_MODE_CHANGE_REQUIRES_RECONCILIATION: 'Troca de modalidade de pagamento em upgrade requer conciliação.',
  UPGRADE_REQUIRED: 'O plano selecionado deve ser superior ao seu plano ativo atual.',
  ACTIVE_PLAN_REQUIRED: 'Esta funcionalidade requer uma assinatura ativa compatível.',
  ACTIVE_MIDIA_OWNER_REQUIRED: 'Apenas o titular de um Plano Mídia ativo pode gerenciar licenças da equipe.',
  INVALID_WEBHOOK_TOKEN: 'Token de autenticação do webhook inválido ou ausente.',
  WEBHOOK_SECRET_NOT_CONFIGURED: 'Segredo de autenticação do webhook não configurado no servidor.',
  EVENT_ID_CONFLICT: 'Conflito de integridade no identificador do evento de pagamento.',
  PAYMENT_AMOUNT_MISMATCH: 'Valor do pagamento diverge do pedido registrado.',
  PAYMENT_METHOD_MISMATCH: 'Forma de pagamento diverge do pedido registrado.',
  PAYMENT_ORDER_NOT_BOUND: 'Cobrança não vinculada a nenhum pedido válido.',
  PAYMENT_ORDER_MISMATCH: 'Referência externa da cobrança diverge do pedido vinculado.',
  PAYMENT_CURRENCY_MISMATCH: 'Moeda do pagamento inválida. Apenas BRL é suportado.',
  ASAAS_VERIFICATION_FAILED: 'Não foi possível verificar o estado da cobrança na API do Asaas.',
  ASAAS_PAYMENT_STATE_MISMATCH: 'O estado da cobrança no Asaas diverge do evento recebido no webhook.',
  TOO_MANY_REQUESTS: 'Muitas tentativas em sequência. Aguarde um minuto antes de tentar novamente.',
  ASAAS_NOT_CONFIGURED: 'Gateway de pagamento não configurado no ambiente.',
  ASAAS_REQUEST_FAILED: 'Falha temporária na comunicação com o gateway Asaas.',
  BILLING_NOT_CONFIGURED: 'Serviço de faturamento não configurado.',
  BILLING_STORAGE_FAILED: 'Erro de comunicação com o banco de faturamento.',
  BILLING_UNAVAILABLE: 'Serviço de faturamento temporariamente indisponível.'
});
function fail(res, error) {
  const status = error instanceof BillingError ? error.status : 503;
  const code = error instanceof BillingError ? error.code : 'BILLING_UNAVAILABLE';
  const message = BILLING_ERROR_MESSAGES[code] || 'Não foi possível concluir a operação de faturamento.';
  return res.status(status).json({success:false, code, message});
}
module.exports = {BillingError, BILLING_ERROR_MESSAGES, configuration, db, authenticate, subscription, fail};
