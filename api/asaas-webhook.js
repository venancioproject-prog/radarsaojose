// =========================================================================
// API Serverless: Webhook Asaas para Liberação Automática de Acessos & CRM
// Radar São José - Gateway de Pagamento Seguro (Asaas)
// =========================================================================

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Carregador autônomo de variáveis de ambiente (.env / .env.local)
function loadEnv() {
  const envCandidates = [
    path.join(process.cwd(), '.env'),
    path.join(process.cwd(), '.env.local'),
    path.join(__dirname, '..', '.env'),
    path.join(__dirname, '.env')
  ];
  for (const p of envCandidates) {
    if (fs.existsSync(p)) {
      try {
        const text = fs.readFileSync(p, 'utf8');
        text.split('\n').forEach(line => {
          const trimmed = line.trim();
          if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
            const idx = trimmed.indexOf('=');
            const k = trimmed.slice(0, idx).trim();
            const v = trimmed.slice(idx + 1).replace(/^['"]|['"\r]$/g, '').trim();
            if (k && !process.env[k]) {
              process.env[k] = v;
            }
          }
        });
      } catch (e) {}
    }
  }
}
loadEnv();

const SUPABASE_URL = process.env.SUPABASE_URL || "https://tocyvysucpslayzglixq.supabase.co";

function getWebhookSecret() {
  return process.env.ASAAS_WEBHOOK_SECRET || process.env.ASAAS_WEBHOOK_TOKEN || null;
}

function getSupabaseServiceKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || null;
}

const KNOWN_ASAAS_EVENTS = [
  'PAYMENT_CREATED',
  'PAYMENT_UPDATED',
  'PAYMENT_CONFIRMED',
  'PAYMENT_RECEIVED',
  'PAYMENT_OVERDUE',
  'PAYMENT_DELETED',
  'PAYMENT_RESTORED',
  'PAYMENT_REFUNDED',
  'PAYMENT_RECEIVED_IN_CASH_UNDONE',
  'PAYMENT_CHARGEBACK_REQUESTED',
  'PAYMENT_CHARGEBACK_DISPUTE',
  'PAYMENT_AWAITING_CHARGEBACK_REVERSAL',
  'PAYMENT_DUNNING_RECEIVED',
  'PAYMENT_DUNNING_REQUESTED',
  'PAYMENT_BANK_SLIP_VIEWED',
  'PAYMENT_CHECKOUT_VIEWED'
];

/**
 * Validação Criptográfica de Autenticidade do Webhook Asaas
 * O Asaas envia o token de autenticação no header 'asaas-access-token'.
 * Utiliza crypto.timingSafeEqual para prevenir timing attacks (CWE-208).
 * Comportamento fail-closed se o secret não estiver configurado no servidor.
 */
function verifyAsaasWebhookToken(req) {
  const configuredSecret = getWebhookSecret();
  if (!configuredSecret) {
    console.error('[Asaas Webhook Security] Falha de configuração: segredo do webhook ausente no servidor (fail-closed).');
    return {
      valid: false,
      status: 500,
      error: 'Erro de configuração interna: autenticação de webhook não configurada no servidor.',
      code: 'WEBHOOK_SECRET_NOT_CONFIGURED'
    };
  }

  const headers = req.headers || {};
  const incomingToken = headers['asaas-access-token'] || headers['Asaas-Access-Token'] || '';

  if (!incomingToken || typeof incomingToken !== 'string') {
    return {
      valid: false,
      status: 401,
      error: 'Não autorizado. Cabeçalho asaas-access-token ausente.',
      code: 'UNAUTHORIZED'
    };
  }

  const bufIncoming = Buffer.from(incomingToken.trim());
  const bufExpected = Buffer.from(configuredSecret.trim());

  if (bufIncoming.length !== bufExpected.length) {
    return {
      valid: false,
      status: 401,
      error: 'Não autorizado. Token de webhook inválido.',
      code: 'UNAUTHORIZED'
    };
  }

  if (!crypto.timingSafeEqual(bufIncoming, bufExpected)) {
    return {
      valid: false,
      status: 401,
      error: 'Não autorizado. Token de webhook inválido.',
      code: 'UNAUTHORIZED'
    };
  }

  return { valid: true };
}

/**
 * Validação Estrutural e Semântica do Payload do Webhook Asaas
 */
function validateWebhookPayload(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { valid: false, error: 'Corpo da requisição deve ser um objeto JSON válido.' };
  }

  const { event, payment } = body;

  if (!event || typeof event !== 'string' || !event.trim()) {
    return { valid: false, error: 'Campo "event" é obrigatório e deve ser uma string.' };
  }

  const normalizedEvent = event.trim().toUpperCase();
  if (!KNOWN_ASAAS_EVENTS.includes(normalizedEvent)) {
    return { valid: false, error: `Tipo de evento desconhecido: "${event}".` };
  }

  if (!payment || typeof payment !== 'object' || Array.isArray(payment)) {
    return { valid: false, error: 'Campo "payment" é obrigatório e deve ser um objeto JSON.' };
  }

  if (!payment.id || typeof payment.id !== 'string' || !payment.id.trim()) {
    return { valid: false, error: 'Campo "payment.id" é obrigatório e deve ser uma string.' };
  }

  if (payment.value !== undefined && payment.value !== null) {
    const val = Number(payment.value);
    if (isNaN(val) || val <= 0) {
      return { valid: false, error: 'Campo "payment.value" deve ser um número positivo.' };
    }
  }

  return { valid: true, normalizedEvent };
}

module.exports = async function handler(req, res) {
  // Configuração CORS (Mantém compatibilidade existente)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, asaas-access-token');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // 1. Verificação Estrita do Método HTTP (Apenas POST permitido)
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(405).json({
      success: false,
      error: `Método ${req.method} não permitido. Utilize POST.`,
      code: 'METHOD_NOT_ALLOWED'
    });
  }

  try {
    // 2. Validação Obrigatória de Autenticidade (Origin Auth / Secret) ANTES do Processamento
    const authCheck = verifyAsaasWebhookToken(req);
    if (!authCheck.valid) {
      return res.status(authCheck.status).json({
        success: false,
        error: authCheck.error,
        code: authCheck.code
      });
    }

    // 3. Validação Estrutural e Semântica do Payload
    const payloadCheck = validateWebhookPayload(req.body);
    if (!payloadCheck.valid) {
      return res.status(400).json({
        success: false,
        error: payloadCheck.error,
        code: 'BAD_REQUEST'
      });
    }

    const { payment } = req.body;
    const event = payloadCheck.normalizedEvent;
    const asaasPaymentId = payment.id.trim();
    const paymentValue = Number(payment.value) || 10.00;

    // 4. Verificação de Service Role Key para operações administrativas no banco (Fail-Closed)
    const serviceKey = getSupabaseServiceKey();
    if (!serviceKey) {
      console.error('[Asaas Webhook Security] SUPABASE_SERVICE_ROLE_KEY ausente para persistência administrativa (fail-closed).');
      return res.status(500).json({
        success: false,
        error: 'Erro de configuração interna do servidor para operações de persistência.',
        code: 'CONFIG_SERVICE_ROLE_KEY_MISSING'
      });
    }

    // 5. Processamento Idempotente e Confiável de Pagamento Confirmado / Recebido
    if (event === 'PAYMENT_RECEIVED' || event === 'PAYMENT_CONFIRMED') {
      // 5.1 Busca venda vinculada ao pagamento Asaas no CRM
      const searchVendaRes = await fetch(`${SUPABASE_URL}/rest/v1/crm_vendas?asaas_payment_id=eq.${encodeURIComponent(asaasPaymentId)}&select=id,status_pagamento,pessoa_id,empresa_id,valor_fechado`, {
        method: 'GET',
        headers: {
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!searchVendaRes.ok) {
        const errText = await searchVendaRes.text().catch(() => '');
        console.error('[Asaas Webhook] Erro ao consultar venda no Supabase:', searchVendaRes.status, errText);
        return res.status(500).json({
          success: false,
          error: 'Falha ao consultar registro de venda no banco de dados.',
          code: 'SUPABASE_QUERY_VENDA_FAILED'
        });
      }

      const vendas = await searchVendaRes.json();
      if (!Array.isArray(vendas) || vendas.length === 0) {
        return res.status(200).json({
          success: true,
          message: 'Nenhuma venda vinculada encontrada para este pagamento.',
          paymentId: asaasPaymentId,
          event
        });
      }

      const venda = vendas[0];
      let clienteAlreadyExisted = false;
      let accessAlreadyExisted = false;
      let clienteId = null;

      // 5.2 Se há pessoa vinculada à venda, inspeciona o estado atual do provisionamento
      if (venda.pessoa_id) {
        // Verifica se cliente já foi registrado para esta venda
        const checkClientRes = await fetch(`${SUPABASE_URL}/rest/v1/crm_clientes?venda_id=eq.${encodeURIComponent(venda.id)}&select=id`, {
          method: 'GET',
          headers: {
            'apikey': serviceKey,
            'Authorization': `Bearer ${serviceKey}`,
            'Content-Type': 'application/json'
          }
        });

        if (!checkClientRes.ok) {
          const errText = await checkClientRes.text().catch(() => '');
          console.error('[Asaas Webhook] Erro ao consultar cliente no Supabase:', checkClientRes.status, errText);
          return res.status(500).json({
            success: false,
            error: 'Falha ao consultar cliente no banco de dados.',
            code: 'SUPABASE_QUERY_CLIENTE_FAILED'
          });
        }

        const existingClients = await checkClientRes.json();
        if (Array.isArray(existingClients) && existingClients.length > 0) {
          clienteAlreadyExisted = true;
          clienteId = existingClients[0].id;
        }

        // Se o cliente já existe, verifica se a licença de acesso já foi registrada
        if (clienteId) {
          const checkAccessRes = await fetch(`${SUPABASE_URL}/rest/v1/crm_acessos?cliente_id=eq.${encodeURIComponent(clienteId)}&select=id`, {
            method: 'GET',
            headers: {
              'apikey': serviceKey,
              'Authorization': `Bearer ${serviceKey}`,
              'Content-Type': 'application/json'
            }
          });

          if (!checkAccessRes.ok) {
            const errText = await checkAccessRes.text().catch(() => '');
            console.error('[Asaas Webhook] Erro ao consultar licença de acesso no Supabase:', checkAccessRes.status, errText);
            return res.status(500).json({
              success: false,
              error: 'Falha ao consultar licença de acesso no banco de dados.',
              code: 'SUPABASE_QUERY_ACESSO_FAILED'
            });
          }

          const existingAccess = await checkAccessRes.json();
          if (Array.isArray(existingAccess) && existingAccess.length > 0) {
            accessAlreadyExisted = true;
          }
        }
      }

      // 5.3 IDEMPOTÊNCIA: Se a venda já foi aprovada E todo o provisionamento (cliente + acesso) já foi concluído:
      const isFullyProvisioned = venda.status_pagamento === 'Aprovado' &&
        (!venda.pessoa_id || (clienteAlreadyExisted && accessAlreadyExisted));

      if (isFullyProvisioned) {
        return res.status(200).json({
          success: true,
          message: 'Evento já processado anteriormente. Idempotência preservada.',
          alreadyProcessed: true,
          paymentId: asaasPaymentId,
          event
        });
      }

      // 5.4 Se o provisionamento está incompleto ou a venda ainda não foi aprovada:
      // (a) Atualiza status da venda para 'Aprovado' caso ainda esteja pendente
      if (venda.status_pagamento !== 'Aprovado') {
        const updateVendaRes = await fetch(`${SUPABASE_URL}/rest/v1/crm_vendas?id=eq.${encodeURIComponent(venda.id)}`, {
          method: 'PATCH',
          headers: {
            'apikey': serviceKey,
            'Authorization': `Bearer ${serviceKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            status_pagamento: 'Aprovado',
            data_pagamento: new Date().toISOString()
          })
        });

        if (!updateVendaRes.ok) {
          const errText = await updateVendaRes.text().catch(() => '');
          console.error('[Asaas Webhook] Erro ao atualizar status da venda:', updateVendaRes.status, errText);
          return res.status(500).json({
            success: false,
            error: 'Falha ao atualizar status da venda no banco de dados.',
            code: 'SUPABASE_UPDATE_VENDA_FAILED'
          });
        }
      }

      // (b) Se há pessoa vinculada, atualiza oportunidade e provisiona pendências
      if (venda.pessoa_id) {
        // Atualiza oportunidade para Ganha
        const updateOportunidadeRes = await fetch(`${SUPABASE_URL}/rest/v1/crm_oportunidades?pessoa_id=eq.${encodeURIComponent(venda.pessoa_id)}`, {
          method: 'PATCH',
          headers: {
            'apikey': serviceKey,
            'Authorization': `Bearer ${serviceKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            etapa_pipeline: 'Ganho',
            status: 'Ganha'
          })
        });

        if (!updateOportunidadeRes.ok) {
          const errText = await updateOportunidadeRes.text().catch(() => '');
          console.error('[Asaas Webhook] Erro ao atualizar oportunidade:', updateOportunidadeRes.status, errText);
          return res.status(500).json({
            success: false,
            error: 'Falha ao atualizar status da oportunidade no banco de dados.',
            code: 'SUPABASE_UPDATE_OPORTUNIDADE_FAILED'
          });
        }

        // Provisiona registro de cliente apenas se ainda não existir (evita duplicação)
        if (!clienteId) {
          const clientRes = await fetch(`${SUPABASE_URL}/rest/v1/crm_clientes`, {
            method: 'POST',
            headers: {
              'apikey': serviceKey,
              'Authorization': `Bearer ${serviceKey}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=representation'
            },
            body: JSON.stringify([{
              pessoa_id: venda.pessoa_id,
              empresa_id: venda.empresa_id || null,
              venda_id: venda.id,
              produto: paymentValue >= 15.00 ? 'Radar São José - Plano Empresarial' : 'Radar São José - Plano Pro',
              valor_total: paymentValue,
              quantidade_acessos: paymentValue >= 15.00 ? 3 : 1,
              status: 'Ativo',
              onboarding_status: 'Pendente'
            }])
          });

          if (!clientRes.ok) {
            const errText = await clientRes.text().catch(() => '');
            console.error('[Asaas Webhook] Erro ao criar cliente:', clientRes.status, errText);
            return res.status(500).json({
              success: false,
              error: 'Falha ao registrar cliente no banco de dados.',
              code: 'SUPABASE_CREATE_CLIENTE_FAILED'
            });
          }

          const clientData = await clientRes.json();
          if (Array.isArray(clientData) && clientData.length > 0) {
            clienteId = clientData[0].id;
          } else {
            return res.status(500).json({
              success: false,
              error: 'Retorno inesperado ao registrar cliente no banco de dados.',
              code: 'SUPABASE_CREATE_CLIENTE_EMPTY'
            });
          }
        }

        // Provisiona licença de acesso individual apenas se ainda não existir (evita duplicação)
        if (!accessAlreadyExisted && clienteId) {
          const accessRes = await fetch(`${SUPABASE_URL}/rest/v1/crm_acessos`, {
            method: 'POST',
            headers: {
              'apikey': serviceKey,
              'Authorization': `Bearer ${serviceKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify([{
              cliente_id: clienteId,
              pessoa_id: venda.pessoa_id,
              produto: paymentValue >= 15.00 ? 'Plano Empresarial' : 'Plano Pro',
              status: 'Ativo'
            }])
          });

          if (!accessRes.ok) {
            const errText = await accessRes.text().catch(() => '');
            console.error('[Asaas Webhook] Erro ao provisionar licença de acesso:', accessRes.status, errText);
            return res.status(500).json({
              success: false,
              error: 'Falha ao registrar licença de acesso no banco de dados.',
              code: 'SUPABASE_CREATE_ACESSO_FAILED'
            });
          }
        }
      }
    }

    // 6. Processamento de Pagamento Vencido / Cancelado
    if (event === 'PAYMENT_OVERDUE' || event === 'PAYMENT_DELETED') {
      const cancelRes = await fetch(`${SUPABASE_URL}/rest/v1/crm_vendas?asaas_payment_id=eq.${encodeURIComponent(asaasPaymentId)}`, {
        method: 'PATCH',
        headers: {
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status_pagamento: 'Cancelado'
        })
      });

      if (!cancelRes.ok) {
        const errText = await cancelRes.text().catch(() => '');
        console.error('[Asaas Webhook Status Sync Error]:', cancelRes.status, errText);
        return res.status(500).json({
          success: false,
          error: 'Falha ao atualizar status de cancelamento no banco de dados.',
          code: 'SUPABASE_UPDATE_CANCELADO_FAILED'
        });
      }
    }

    return res.status(200).json({
      success: true,
      event,
      paymentId: asaasPaymentId,
      processedAt: new Date().toISOString()
    });

  } catch (err) {
    console.error('[Asaas Webhook Exception]:', err.message);
    return res.status(500).json({
      success: false,
      error: 'Erro interno ao processar webhook.'
    });
  }
};

module.exports.verifyAsaasWebhookToken = verifyAsaasWebhookToken;
module.exports.validateWebhookPayload = validateWebhookPayload;
module.exports.getWebhookSecret = getWebhookSecret;
module.exports.getSupabaseServiceKey = getSupabaseServiceKey;
module.exports.KNOWN_ASAAS_EVENTS = KNOWN_ASAAS_EVENTS;
