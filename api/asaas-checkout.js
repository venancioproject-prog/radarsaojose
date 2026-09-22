// API Serverless: Checkout & Geração de Pagamento no Asaas (PIX / Cartão / Boleto)
// Planos: Pro (R$ 10,00) e Empresarial (R$ 15,00)
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

const ASAAS_API_KEY = process.env.ASAAS_API_KEY;
const ASAAS_API_URL = process.env.ASAAS_API_URL || "https://api.asaas.com/v3";
const SUPABASE_URL = process.env.SUPABASE_URL || "https://tocyvysucpslayzglixq.supabase.co";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "sb_publishable_8mKUf28dbMM8EOSPrgjRUA_19taJmrT";

module.exports = async function handler(req, res) {
  // Configuração CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Método não permitido. Utilize POST.' });
  }

  try {
    const body = req.body || {};
    const {
      name,
      email,
      cpfCnpj,
      phone,
      plan = 'pro', // 'pro' (R$ 10) ou 'enterprise' (R$ 15)
      billingType = 'UNDEFINED' // 'PIX', 'CREDIT_CARD', 'BOLETO' ou 'UNDEFINED' (permite todos)
    } = body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Nome e E-mail são obrigatórios para checkout.' });
    }

    // Define valores e dados dos planos
    let planValue = 10.00;
    let planDescription = "Radar São José - Assinatura Plano Pro";
    let planName = "Plano Pro";

    if (plan === 'enterprise' || plan === 'empresarial') {
      planValue = 15.00;
      planDescription = "Radar São José - Assinatura Plano Empresarial (Enterprise)";
      planName = "Plano Empresarial";
    }

    // 1. Criar ou Buscar Cliente no Asaas
    let asaasCustomerId = null;
    try {
      // Busca cliente por e-mail no Asaas
      const searchRes = await fetch(`${ASAAS_API_URL}/customers?email=${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
          'access_token': ASAAS_API_KEY,
          'Content-Type': 'application/json'
        }
      });
      const searchData = await searchRes.json();
      
      if (searchData.data && searchData.data.length > 0) {
        asaasCustomerId = searchData.data[0].id;
      } else {
        // Cria novo cliente no Asaas
        const cleanCpf = (cpfCnpj || '').replace(/\D/g, '');
        const cleanPhone = (phone || '').replace(/\D/g, '');

        const createCustRes = await fetch(`${ASAAS_API_URL}/customers`, {
          method: 'POST',
          headers: {
            'access_token': ASAAS_API_KEY,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            cpfCnpj: cleanCpf || undefined,
            mobilePhone: cleanPhone || undefined,
            notificationDisabled: false
          })
        });
        const newCustData = await createCustRes.json();
        if (newCustData.id) {
          asaasCustomerId = newCustData.id;
        } else {
          console.warn('[Asaas Customer Warning]:', newCustData);
        }
      }
    } catch (errCust) {
      console.warn('[Asaas Customer Error]:', errCust.message);
    }

    if (!asaasCustomerId) {
      // Fallback: criar cliente simplificado
      const createCustFallback = await fetch(`${ASAAS_API_URL}/customers`, {
        method: 'POST',
        headers: {
          'access_token': ASAAS_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase()
        })
      });
      const custFallbackData = await createCustFallback.json();
      asaasCustomerId = custFallbackData.id;
    }

    // 2. Criar Cobrança no Asaas
    // Data de vencimento = hoje + 3 dias
    const dueDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const paymentPayload = {
      customer: asaasCustomerId,
      billingType: billingType, // 'PIX', 'CREDIT_CARD', 'BOLETO' ou 'UNDEFINED'
      value: planValue,
      dueDate: dueDate,
      description: planDescription,
      postalService: false
    };

    const paymentRes = await fetch(`${ASAAS_API_URL}/payments`, {
      method: 'POST',
      headers: {
        'access_token': ASAAS_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentPayload)
    });
    const paymentData = await paymentRes.json();

    if (!paymentData.id) {
      return res.status(400).json({
        success: false,
        message: 'Erro ao gerar cobrança no Asaas.',
        error: paymentData.errors || paymentData
      });
    }

    // 3. Se for PIX ou UNDEFINED, obter QR Code e Chave Copia e Cola
    let pixInfo = null;
    try {
      const pixRes = await fetch(`${ASAAS_API_URL}/payments/${paymentData.id}/pixQrCode`, {
        method: 'GET',
        headers: {
          'access_token': ASAAS_API_KEY,
          'Content-Type': 'application/json'
        }
      });
      const pixData = await pixRes.json();
      if (pixData.encodedImage && pixData.payload) {
        pixInfo = {
          qrCodeImage: `data:image/png;base64,${pixData.encodedImage}`,
          copyPasteKey: pixData.payload,
          expirationDate: pixData.expirationDate
        };
      }
    } catch (pixErr) {
      console.warn('[PIX QRCode Warning]:', pixErr.message);
    }

    // 4. Registrar Oportunidade e Venda no Supabase CRM (Status Pendente)
    try {
      // Registra/atualiza Pessoa no Supabase
      const personRes = await fetch(`${SUPABASE_URL}/rest/v1/crm_pessoas`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates,return=representation'
        },
        body: JSON.stringify([{
          nome: name.trim(),
          email: email.trim().toLowerCase(),
          whatsapp: phone || null,
          perfil: 'Profissional de empresa',
          origem: 'Checkout Asaas ' + planName,
          tem_decisao: true
        }])
      });
      const personData = await personRes.json();
      const personId = Array.isArray(personData) && personData.length > 0 ? personData[0].id : null;

      // Registra Venda no Supabase
      if (personId) {
        await fetch(`${SUPABASE_URL}/rest/v1/crm_vendas`, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify([{
            pessoa_id: personId,
            produto_servico: planDescription,
            valor_proposto: planValue,
            valor_fechado: planValue,
            forma_pagamento: billingType === 'PIX' ? 'Asaas PIX' : 'Asaas Checkout',
            asaas_payment_id: paymentData.id,
            asaas_customer_id: asaasCustomerId,
            status_pagamento: 'Pendente',
            responsavel: 'Sistema Asaas'
          }])
        });
      }
    } catch (crmErr) {
      console.warn('[CRM Supabase Sync Warning]:', crmErr.message);
    }

    return res.status(200).json({
      success: true,
      message: 'Cobrança gerada com sucesso no Asaas!',
      plan: {
        name: planName,
        value: planValue,
        description: planDescription
      },
      payment: {
        id: paymentData.id,
        status: paymentData.status,
        invoiceUrl: paymentData.invoiceUrl, // Página oficial de pagamento Asaas (Cartão, Boleto, PIX)
        bankSlipUrl: paymentData.bankSlipUrl,
        value: paymentData.value,
        dueDate: paymentData.dueDate,
        pix: pixInfo
      }
    });

  } catch (err) {
    console.error('[Checkout API Error]:', err);
    return res.status(500).json({
      success: false,
      message: 'Erro interno no checkout Asaas.',
      error: err.message
    });
  }
};
