// API Serverless: Webhook Asaas para Liberação Automática de Acessos & CRM
// Eventos: PAYMENT_RECEIVED, PAYMENT_CONFIRMED, PAYMENT_OVERDUE, PAYMENT_DELETED
const fs = require('fs');
const path = require('path');

function loadEnv() {
  const envFiles = ['.env.local', '.env'];
  for (const file of envFiles) {
    const p = path.join(process.cwd(), file);
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
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "sb_publishable_8mKUf28dbMM8EOSPrgjRUA_19taJmrT";

module.exports = async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, asaas-access-token');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Método não permitido. Utilize POST.' });
  }

  try {
    const eventData = req.body || {};
    const { event, payment } = eventData;

    console.log(`[Asaas Webhook] Evento recebido: ${event} para cobrança: ${payment?.id}`);

    if (!payment || !payment.id) {
      return res.status(200).json({ received: true, note: 'Evento sem dados de pagamento' });
    }

    // Processamento de Pagamento Confirmado / Recebido
    if (event === 'PAYMENT_RECEIVED' || event === 'PAYMENT_CONFIRMED') {
      const asaasPaymentId = payment.id;
      const paymentValue = payment.value || 10.00;

      // 1. Atualiza tabela crm_vendas no Supabase
      try {
        const updateVendaRes = await fetch(`${SUPABASE_URL}/rest/v1/crm_vendas?asaas_payment_id=eq.${asaasPaymentId}`, {
          method: 'PATCH',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({
            status_pagamento: 'Aprovado',
            data_pagamento: new Date().toISOString()
          })
        });
        const updatedVendas = await updateVendaRes.json();
        
        let pessoaId = null;
        let empresaId = null;
        let vendaId = null;

        if (Array.isArray(updatedVendas) && updatedVendas.length > 0) {
          pessoaId = updatedVendas[0].pessoa_id;
          empresaId = updatedVendas[0].empresa_id;
          vendaId = updatedVendas[0].id;
        }

        // 2. Se encontrou a pessoa vinculada, atualiza Oportunidade -> Ganho e cria Cliente
        if (pessoaId) {
          // Atualiza Oportunidade para Ganho
          await fetch(`${SUPABASE_URL}/rest/v1/crm_oportunidades?pessoa_id=eq.${pessoaId}`, {
            method: 'PATCH',
            headers: {
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              etapa_pipeline: 'Ganho',
              status: 'Ganha'
            })
          });

          // Cria/Atualiza Cliente
          const clientRes = await fetch(`${SUPABASE_URL}/rest/v1/crm_clientes`, {
            method: 'POST',
            headers: {
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=representation'
            },
            body: JSON.stringify([{
              pessoa_id: pessoaId,
              empresa_id: empresaId,
              venda_id: vendaId,
              produto: paymentValue >= 15.00 ? 'Radar São José - Plano Empresarial' : 'Radar São José - Plano Pro',
              valor_total: paymentValue,
              quantidade_acessos: paymentValue >= 15.00 ? 3 : 1,
              status: 'Ativo',
              onboarding_status: 'Pendente'
            }])
          });
          const clientData = await clientRes.json();
          const clienteId = Array.isArray(clientData) && clientData.length > 0 ? clientData[0].id : null;

          // Cria Licença de Acesso Individual
          if (clienteId) {
            await fetch(`${SUPABASE_URL}/rest/v1/crm_acessos`, {
              method: 'POST',
              headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify([{
                cliente_id: clienteId,
                pessoa_id: pessoaId,
                produto: paymentValue >= 15.00 ? 'Plano Empresarial' : 'Plano Pro',
                status: 'Ativo'
              }])
            });
          }
        }

      } catch (dbErr) {
        console.warn('[Webhook DB Sync Error]:', dbErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      event: event,
      paymentId: payment.id,
      processedAt: new Date().toISOString()
    });

  } catch (err) {
    console.error('[Webhook Exception]:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
