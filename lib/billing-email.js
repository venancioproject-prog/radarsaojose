'use strict';

/**
 * Módulo de E-mails Transacionais de Faturamento (Radar São José)
 *
 * Responsabilidade:
 * - Gerar templates de confirmação de pagamento (Compra e Upgrade).
 * - Despacho após confirmação; deduplicação pelo provedor por pedido.
 * - Segurança fail-safe: se nenhum provedor estiver configurado,
 *   retorna o status 'pending_configuration' e NUNCA declara
 *   falsamente que o e-mail foi enviado.
 * - Falhas de e-mail nunca abortam nem desfazem a liberação do plano no banco.
 */

const { createHash } = require('node:crypto');
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
}

const PLAN_NAMES = Object.freeze({
  dash: 'Plano Dash (Explorer)',
  report: 'Plano Report (Executive)',
  midia: 'Plano Mídia (Authority)'
});

function formatCurrency(cents) {
  const value = Number(cents || 0) / 100;
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatDate(isoString) {
  if (!isoString) return 'Data a confirmar';
  try {
    return new Date(isoString).toLocaleDateString('pt-BR', {
      timeZone: 'UTC',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (_) {
    return String(isoString);
  }
}

/**
 * Gera os dados e o conteúdo formatado do e-mail de confirmação.
 */
function buildConfirmationTemplate({ order = {}, recipientEmail = '', recipientName = '' }) {
  const quote = order.quote || {};
  const isUpgrade = order.kind === 'upgrade';
  const planKey = order.target_plan || quote.plan || 'report';
  const planName = Object.hasOwn(PLAN_NAMES, planKey) ? PLAN_NAMES[planKey] : 'Plano contratado';
  const isPix = order.payment_method === 'PIX';
  const installmentsCount = order.installment_count || quote.installments?.length || 1;
  const amountCents = Number(order.amount_cents || quote.amountCents || 0);
  const creditCents = Number(order.credit_cents || quote.creditCents || 0);
  const periodEndFormatted = formatDate(order.period_end || quote.periodEnd);

  const subject = isUpgrade
    ? `Radar São José • Confirmação de Upgrade para ${planName}`
    : `Radar São José • Confirmação de Assinatura ${planName}`;

  let paymentSummary = '';
  if (isPix) {
    paymentSummary = `PIX à vista: ${formatCurrency(amountCents)} (desconto de 10% aplicado)`;
  } else if (order.payment_method === 'BOLETO') {
    paymentSummary = `Boleto bancário à vista: ${formatCurrency(amountCents)}`;
  } else if (order.payment_method === 'CREDIT_CARD' && installmentsCount > 1) {
    const firstInstallment = quote.installments?.[0] || Math.round(amountCents / installmentsCount);
    paymentSummary = `Cartão de Crédito em ${installmentsCount}x de ${formatCurrency(firstInstallment)} (Total: ${formatCurrency(amountCents)})`;
  } else if (order.payment_method === 'CREDIT_CARD') {
    paymentSummary = `Cartão de Crédito à vista: ${formatCurrency(amountCents)}`;
  } else {
    paymentSummary = `Pagamento confirmado: ${formatCurrency(amountCents)}`;
  }

  let upgradeDetailsText = '';
  let upgradeDetailsHtml = '';
  if (isUpgrade && creditCents > 0) {
    upgradeDetailsText = `\nCrédito aproveitado do plano anterior: ${formatCurrency(creditCents)}\nDiferença proporcional paga: ${formatCurrency(amountCents)}`;
    upgradeDetailsHtml = `
      <p style="margin: 4px 0; color: #64748b;">
        <strong>Crédito aproveitado:</strong> ${formatCurrency(creditCents)}<br>
        <strong>Diferença proporcional:</strong> ${formatCurrency(amountCents)}
      </p>`;
  }

  let midiaNoticeText = '';
  let midiaNoticeHtml = '';
  if (planKey === 'midia') {
    midiaNoticeText = `\n\n[Plano Mídia]: Você tem direito a 3 acessos independentes (o seu e mais 2 convidados). Acesse seu painel para gerenciar os convidados.`;
    midiaNoticeHtml = `
      <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 12px; margin-top: 16px;">
        <strong style="color: #166534;">🎉 Plano Mídia com 3 Licenças Ativas</strong>
        <p style="margin: 6px 0 0 0; color: #15803d; font-size: 14px;">
          Sua assinatura permite cadastrar até <strong>2 convidados independentes</strong> sem custo adicional. Gerencie suas licenças na plataforma.
        </p>
      </div>`;
  }

  const textBody = `Olá, ${recipientName || 'Assinante'}!

Seu pagamento foi confirmado com sucesso no Radar São José.

Detalhes da Assinatura:
- Plano: ${planName}
- Modalidade: ${isUpgrade ? 'Upgrade de Plano' : 'Nova Assinatura Anual'}
- Vencimento da Anuidade: ${periodEndFormatted} (UTC)
- Pagamento: ${paymentSummary}${upgradeDetailsText}${midiaNoticeText}

Para acessar todos os recursos exclusivos do seu plano, faça login na plataforma:
https://radarsaojose.com.br/app.html

Atenciosamente,
Equipe Radar São José`;

  const htmlBody = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.5; color: #1e293b; background-color: #f8fafc; padding: 24px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; padding: 32px;">
    <h2 style="color: #0f172a; margin-top: 0;">Radar São José</h2>
    <p style="font-size: 16px;">Olá, <strong>${escapeHtml(recipientName || 'Assinante')}</strong>!</p>
    <p style="color: #10b981; font-weight: 600; font-size: 16px;">✓ Seu pagamento foi confirmado com sucesso.</p>
    
    <div style="background-color: #f1f5f9; border-radius: 6px; padding: 16px; margin: 20px 0;">
      <h3 style="margin-top: 0; font-size: 15px; color: #334155;">Resumo da Assinatura</h3>
      <p style="margin: 4px 0;"><strong>Plano:</strong> ${planName}</p>
      <p style="margin: 4px 0;"><strong>Tipo:</strong> ${isUpgrade ? 'Upgrade de Plano' : 'Nova Assinatura'}</p>
      <p style="margin: 4px 0;"><strong>Vigência:</strong> Válido até ${periodEndFormatted}</p>
      <p style="margin: 4px 0;"><strong>Pagamento:</strong> ${paymentSummary}</p>
      ${upgradeDetailsHtml}
    </div>

    ${midiaNoticeHtml}

    <p style="margin-top: 24px; font-size: 14px; color: #64748b;">
      Seu acesso já está liberado. Se já estiver com o sistema aberto, seu perfil será sincronizado automaticamente no próximo acesso.
    </p>

    <div style="margin-top: 32px; border-top: 1px solid #e2e8f0; padding-top: 16px; font-size: 12px; color: #94a3b8;">
      Radar São José • Inteligência Urbana e Territorial<br>
      Este é um e-mail automático de confirmação de transação.
    </div>
  </div>
</body>
</html>`.trim();

  return { subject, textBody, htmlBody, planName, periodEndFormatted, recipientEmail };
}

/**
 * Envia o e-mail de confirmação ou informa configuração pendente.
 * A fila opt-in é processada separadamente por billing-email-queue.js.
 * NUNCA inventa credenciais nem declara falsamente que o e-mail foi enviado.
 */
async function sendConfirmationEmail({ order = {}, event = {}, recipientEmail = '', recipientName = '' }) {
  const targetEmail = recipientEmail || order.quote?.customerEmail || order.user_email || '';
  const template = buildConfirmationTemplate({ order, recipientEmail: targetEmail, recipientName });

  // Detecta provedores configurados no ambiente
  const resendKey = process.env.RESEND_API_KEY;
  const sendgridKey = process.env.SENDGRID_API_KEY;
  const smtpHost = process.env.SMTP_HOST;

  // Sem provedor configurado: comportamento explícito e seguro
  if (!resendKey && !sendgridKey && !smtpHost) {
    return {
      sent: false,
      status: 'pending_configuration',
      reason: 'EMAIL_PROVIDER_NOT_CONFIGURED',
      recipientEmail: targetEmail,
      subject: template.subject,
      template
    };
  }

  // Se houver provedor configurado, despacha de forma segura
  if (resendKey) {
    const sender = process.env.BILLING_EMAIL_FROM?.trim();
    if (!sender || /[\r\n]/.test(sender)) {
      return { sent: false, status: 'pending_configuration', reason: 'EMAIL_SENDER_NOT_CONFIGURED' };
    }
    if (typeof order.id !== 'string' || !order.id ||
        !/^[^\s@<>,]+@[^\s@<>,]+\.[^\s@<>,]+$/.test(targetEmail)) {
      return { sent: false, status: 'invalid_request', reason: 'EMAIL_ORDER_OR_RECIPIENT_INVALID' };
    }
    const idempotencyKey = 'radar-payment/' + createHash('sha256').update(order.id + '\n' + targetEmail).digest('hex');
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + resendKey,
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey
        },
        body: JSON.stringify({
          from: sender,
          to: [targetEmail],
          subject: template.subject,
          text: template.textBody,
          html: template.htmlBody
        }),
        signal: AbortSignal.timeout(8000),
        redirect: 'error'
      });
      if (!response.ok) {
        const errText = await response.text();
        return { sent: false, status: 'provider_error', httpStatus: response.status, error: errText };
      }
      const data = await response.json();
      if (typeof data?.id !== 'string' || !data.id || data.id.length > 200) {
        return { sent: false, status: 'provider_error', httpStatus: 502 };
      }
      return { sent: true, status: 'sent', provider: 'resend', id: data.id };
    } catch (err) {
      return { sent: false, status: 'network_error', error: err.message };
    }
  }

  return {
    sent: false,
    status: 'pending_configuration',
    reason: 'EMAIL_PROVIDER_NOT_IMPLEMENTED',
    template
  };
}

function deliveryConfigured() {
  const sender = process.env.BILLING_EMAIL_FROM?.trim();
  return Boolean(process.env.RESEND_API_KEY && sender && !/[\r\n]/.test(sender));
}

module.exports = {
  PLAN_NAMES,
  formatCurrency,
  formatDate,
  buildConfirmationTemplate,
  sendConfirmationEmail,
  deliveryConfigured
};
