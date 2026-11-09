// ============================================================================
// RADAR SÃO JOSÉ - COMPONENTE OFICIAL DE CHECKOUT ASAAS (SANDBOX & PRODUÇÃO)
// Planos Comerciais:
// - Plano Dash (Explorer): 12x de R$ 269,90 (R$ 3.238,80 anual)
// - Plano Report (Executive - Recomendado): 12x de R$ 489,90 (R$ 5.878,80 anual)
// - Plano Mídia (Authority / Cotas): 12x de R$ 1.190,00 (R$ 14.280,00 anual)
// Meios de pagamento: Pix dinâmico e cartão de crédito em até 12 parcelas.
// ============================================================================

(function() {
  'use strict';

  const planNames = Object.freeze({ dash: 'Plano Dash', report: 'Plano Report', midia: 'Plano Mídia' });

  // Estilos CSS auto-contidos e modernos do Modal de Checkout
  const checkoutStyles = `
    <style id="asaasCheckoutGlobalStyles">
      #asaasCheckoutModal {
        display: none;
        position: fixed;
        inset: 0;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100dvh;
        z-index: 999999;
        background: rgba(6, 22, 42, 0.85);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        align-items: center;
        justify-content: center;
        padding: 16px;
        box-sizing: border-box;
        opacity: 0;
        visibility: hidden;
        overflow-y: auto;
        overscroll-behavior: contain;
        -webkit-overflow-scrolling: touch;
        transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.25s ease;
      }

      #asaasCheckoutModal.show {
        display: flex !important;
        opacity: 1;
        visibility: visible;
      }

      .asaas-modal-dialog {
        background: #0B2545;
        color: #ffffff;
        width: 100%;
        max-width: 580px;
        max-height: 94vh;
        overflow-y: auto;
        overscroll-behavior: contain;
        margin: auto;
        border-radius: 28px;
        border: 1px solid rgba(255, 255, 255, 0.18);
        box-shadow: 0 35px 80px -20px rgba(0, 0, 0, 0.8), 0 0 50px rgba(0, 180, 216, 0.25);
        padding: 28px 24px;
        position: relative;
        box-sizing: border-box;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        transform: translateY(20px) scale(0.97);
        transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      }

      #asaasCheckoutModal.show .asaas-modal-dialog {
        transform: translateY(0) scale(1);
      }

      .asaas-modal-dialog::-webkit-scrollbar {
        width: 6px;
      }
      .asaas-modal-dialog::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 10px;
      }

      .asaas-top-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 16px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.12);
        margin-bottom: 20px;
      }

      .asaas-brand-badge {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .asaas-icon-badge {
        width: 44px;
        height: 44px;
        border-radius: 14px;
        background: linear-gradient(135deg, rgba(0, 180, 216, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%);
        color: #00B4D8;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 19px;
        border: 1px solid rgba(0, 180, 216, 0.4);
        flex-shrink: 0;
      }

      .asaas-modal-title {
        font-size: 18px;
        font-weight: 800;
        color: #ffffff;
        margin: 0 0 3px 0;
        letter-spacing: -0.02em;
      }

      .asaas-trust-panel {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 12px;
        margin: 0 0 16px;
        padding: 12px 14px;
        background: #f0f7ff;
        color: #102948;
        border-radius: 12px;
      }
      .asaas-trust-panel img { display: block; width: 84px; height: auto; }
      .asaas-trust-copy { flex: 1 1 210px; font-size: 12px; line-height: 1.45; }
      .asaas-trust-copy strong { display: block; font-size: 13px; }

      .asaas-modal-sub {
        font-size: 11.5px;
        font-weight: 500;
        color: #94a3b8;
        margin: 0;
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .asaas-close-button {
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: rgba(255, 255, 255, 0.65);
        cursor: pointer;
        width: 36px;
        height: 36px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        transition: all 0.2s ease;
      }

      .asaas-close-button:hover {
        background: rgba(255, 255, 255, 0.15);
        color: #ffffff;
      }

      .asaas-modal-dialog:has(#asaasPlanGrid:not([hidden])) {
        max-width: 1120px;
        max-height: none;
        overflow: visible;
        padding: 20px 10px 10px;
        border-radius: 20px;
        background: #0a0a0a;
      }

      .asaas-modal-dialog:has(#asaasPlanGrid:not([hidden])) .asaas-top-header {
        display: contents;
      }

      .asaas-modal-dialog:has(#asaasPlanGrid:not([hidden])) .asaas-brand-badge {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip-path: inset(50%);
      }

      .asaas-modal-dialog:has(#asaasPlanGrid:not([hidden])) .asaas-close-button {
        position: absolute;
        top: 4px;
        right: 8px;
        z-index: 1;
        width: 32px;
        height: 32px;
        background: #242424;
        color: #fff;
      }

      #asaasPlanGrid .plans-grid { margin-top: 0; gap: 4px; }
      #asaasPlanGrid .plan-card { min-width: 0; padding: 16px 14px; }
      #asaasPlanGrid .plan-name { margin-bottom: 8px; }
      #asaasPlanGrid .plan-price { font-size: clamp(1.4rem, 2.2vw, 1.85rem); white-space: nowrap; }
      #asaasPlanGrid .plan-price span { display: block; font-size: 0.75rem; margin-bottom: 4px; }
      #asaasPlanGrid .plan-tagline { margin-bottom: 12px; line-height: 1.4; }
      #asaasPlanGrid .plan-features { margin-bottom: 12px; }
      #asaasPlanGrid .plan-features li { padding: 5px 0; gap: 7px; line-height: 1.35; }
      #asaasPlanGrid .btn-plan { padding: 10px 8px; }
      #asaasPlanGrid .plans-note { margin-top: 12px; }

      @media (min-width: 900px) {
        #asaasPlanGrid .plans-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
      }
      @media (min-width: 900px) and (max-height: 760px) {
        #asaasPlanGrid .plan-card { padding: 13px 10px 10px; }
        #asaasPlanGrid .plan-tagline { margin-bottom: 7px; line-height: 1.3; }
        #asaasPlanGrid .plan-features { margin-bottom: 8px; }
        #asaasPlanGrid .plan-features li { padding: 3px 0; line-height: 1.25; }
        #asaasPlanGrid .plans-note { margin-top: 7px; }
      }
      @media (max-width: 899px) {
        .asaas-modal-dialog:has(#asaasPlanGrid:not([hidden])) { padding-top: 42px; }
      }
      @media (min-width: 560px) and (max-width: 899px) {
        #asaasPlanGrid .plans-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px 6px; }
      }
      @media (max-width: 559px) {
        #asaasPlanGrid .plans-grid { grid-template-columns: minmax(0, 1fr); gap: 14px; }
      }
      #asaasPlanGrid .btn-plan[data-suggested] { outline: 2px solid #19afea; }
      #asaasPaymentStep > button { margin-bottom: 16px; }
      #asaasCheckoutModal [hidden] { display: none !important; }

      /* BANNER DE UPGRADE DE PLANO */
      .asaas-upgrade-callout {
        background: linear-gradient(135deg, rgba(6, 182, 212, 0.16) 0%, rgba(99, 102, 241, 0.16) 100%);
        border: 1px solid rgba(6, 182, 212, 0.45);
        border-radius: 14px;
        padding: 10px 14px;
        margin-bottom: 14px;
        display: flex;
        flex-direction: column;
        gap: 4px;
        box-shadow: 0 0 15px rgba(6, 182, 212, 0.15);
      }

      .asaas-upgrade-pill {
        font-size: 9.5px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #38bdf8;
        display: flex;
        align-items: center;
        gap: 5px;
      }

      .asaas-upgrade-desc {
        font-size: 11.5px;
        font-weight: 600;
        color: #e2e8f0;
        line-height: 1.4;
      }

      /* TABS DE PAGAMENTO */
      .asaas-methods-nav {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
        margin-bottom: 18px;
        background: rgba(255, 255, 255, 0.05);
        padding: 5px;
        border-radius: 14px;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }

      .asaas-method-tab {
        padding: 10px 8px;
        border-radius: 10px;
        border: none;
        background: transparent;
        color: #94a3b8;
        font-size: 11.5px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        font-family: inherit;
      }

      .asaas-method-tab:hover {
        color: #ffffff;
      }

      .asaas-method-tab.active {
        background: #00B4D8;
        color: #06162a;
        font-weight: 800;
        box-shadow: 0 4px 12px rgba(0, 180, 216, 0.3);
      }

      /* FORMULÁRIO */
      .asaas-form-container {
        display: flex;
        flex-direction: column;
        gap: 13px;
      }

      .asaas-field-group {
        display: flex;
        flex-direction: column;
      }

      .asaas-field-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
      }

      @media (max-width: 480px) {
        .asaas-field-row {
          grid-template-columns: 1fr;
        }
      }

      .asaas-field-label {
        font-size: 10.5px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #cbd5e1;
        margin-bottom: 5px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .asaas-text-input, .asaas-select-input {
        width: 100%;
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.18);
        border-radius: 12px;
        padding: 10px 14px;
        font-size: 13px;
        color: #ffffff;
        font-family: inherit;
        box-sizing: border-box;
        transition: all 0.2s ease;
      }

      .asaas-select-input option {
        background: #0B2545;
        color: #ffffff;
      }

      .asaas-text-input::placeholder {
        color: rgba(255, 255, 255, 0.35);
      }

      .asaas-text-input:focus, .asaas-select-input:focus {
        outline: none;
        border-color: #00B4D8;
        background: rgba(255, 255, 255, 0.12);
        box-shadow: 0 0 0 3px rgba(0, 180, 216, 0.25);
      }

      /* ALERT BOX PARA ERROS AMIGÁVEIS */
      .asaas-alert-box {
        display: none;
        padding: 11px 14px;
        border-radius: 12px;
        font-size: 11.5px;
        font-weight: 600;
        line-height: 1.4;
        margin-bottom: 4px;
        align-items: flex-start;
        gap: 10px;
        box-sizing: border-box;
      }

      .asaas-alert-error {
        background: rgba(244, 63, 94, 0.16);
        border: 1px solid rgba(244, 63, 94, 0.4);
        color: #fca5a5;
      }

      .asaas-alert-error.show {
        display: flex !important;
      }

      /* BOTÃO DE SUBMIT */
      .asaas-submit-btn {
        width: 100%;
        padding: 14px 18px;
        border-radius: 14px;
        border: none;
        background: linear-gradient(135deg, #10B981 0%, #059669 100%);
        color: #ffffff;
        font-size: 13px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        margin-top: 6px;
        box-shadow: 0 4px 18px rgba(16, 185, 129, 0.4);
        font-family: inherit;
      }

      .asaas-submit-btn:hover:not(:disabled) {
        filter: brightness(1.1);
        transform: translateY(-1px);
        box-shadow: 0 6px 22px rgba(16, 185, 129, 0.5);
      }

      .asaas-submit-btn:disabled {
        opacity: 0.65;
        cursor: not-allowed;
      }

      @media (max-width: 480px) {
        #asaasCheckoutModal {
          padding: 8px;
        }
        .asaas-modal-dialog {
          padding: 20px 14px;
          border-radius: 20px;
          max-height: 96vh;
        }
        .asaas-top-header {
          margin-bottom: 14px;
          padding-bottom: 12px;
        }
        .asaas-modal-title {
          font-size: 16px;
        }
        .asaas-modal-sub {
          font-size: 10.5px;
        }
        .asaas-methods-nav {
          gap: 4px;
          padding: 4px;
        }
        .asaas-method-tab {
          padding: 8px 4px;
          font-size: 11px;
          gap: 4px;
        }
        .asaas-opt-price-big {
          font-size: 15px;
        }
        .asaas-opt-price-sub {
          font-size: 9.5px;
        }
      }

      @media (max-width: 380px) {
        #asaasCheckoutModal {
          padding: 4px;
        }
        .asaas-modal-dialog {
          padding: 16px 10px;
          border-radius: 16px;
        }
        .asaas-method-tab {
          font-size: 10px;
          padding: 6px 2px;
        }
        .asaas-submit-btn {
          font-size: 11.5px;
          padding: 12px 10px;
        }
      }

      @media (max-width: 360px) {
        .asaas-copy-input-row {
          flex-direction: column;
        }
        .asaas-btn-copy-code {
          width: 100%;
          padding: 10px;
          justify-content: center;
        }
      }

      /* RESULTADO & SUCESSO PÓS-COMPRA */
      .asaas-checkout-result {
        display: none;
        flex-direction: column;
        gap: 16px;
        padding-top: 10px;
      }

      .asaas-checkout-result.show {
        display: flex !important;
      }

      .asaas-success-card {
        background: linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.15) 100%);
        border: 1px solid rgba(16, 185, 129, 0.35);
        border-radius: 18px;
        padding: 18px;
        text-align: center;
      }

      .asaas-success-icon {
        width: 52px;
        height: 52px;
        border-radius: 50%;
        background: #10B981;
        color: #ffffff;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        margin-bottom: 10px;
        box-shadow: 0 0 20px rgba(16, 185, 129, 0.5);
      }

      .asaas-success-title {
        font-size: 16px;
        font-weight: 800;
        color: #34d399;
        margin: 0 0 4px 0;
      }

      .asaas-success-text {
        font-size: 12px;
        color: #e2e8f0;
        margin: 0;
        line-height: 1.5;
      }

      /* PIX QR CODE RENDER */
      .asaas-pix-display {
        background: #ffffff;
        border-radius: 20px;
        padding: 16px;
        max-width: 220px;
        margin: 0 auto;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
        text-align: center;
      }

      .asaas-pix-img {
        width: 100%;
        height: auto;
        display: block;
        border-radius: 8px;
      }

      .asaas-pix-instruction {
        font-size: 11px;
        font-weight: 700;
        color: #0f172a;
        margin: 8px 0 0 0;
      }

      /* COPIA E COLA */
      .asaas-copy-container {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .asaas-copy-input-row {
        display: flex;
        gap: 8px;
      }

      .asaas-copy-text {
        width: 100%;
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 12px;
        padding: 10px 12px;
        font-size: 11px;
        font-family: monospace;
        color: #ffffff;
        box-sizing: border-box;
      }

      .asaas-btn-copy-code {
        background: #00B4D8;
        color: #06162a;
        border: none;
        border-radius: 12px;
        padding: 0 16px;
        font-size: 11.5px;
        font-weight: 800;
        cursor: pointer;
        transition: all 0.2s ease;
        flex-shrink: 0;
        font-family: inherit;
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .asaas-btn-copy-code:hover {
        background: #38bdf8;
      }

      /* BOLETO BAR */
      .asaas-boleto-box {
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 16px;
        padding: 14px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .asaas-btn-slip {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        width: 100%;
        padding: 13px 18px;
        background: #2563eb;
        color: #ffffff;
        font-size: 12.5px;
        font-weight: 800;
        border-radius: 12px;
        text-decoration: none;
        box-sizing: border-box;
        transition: all 0.2s ease;
      }

      .asaas-btn-slip:hover {
        background: #3b82f6;
      }

      .asaas-btn-unlock-view {
        width: 100%;
        padding: 14px;
        border-radius: 14px;
        background: #10B981;
        color: #ffffff;
        font-size: 12.5px;
        font-weight: 800;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        font-family: inherit;
        transition: all 0.2s ease;
      }

      .asaas-btn-unlock-view:hover {
        background: #059669;
      }
    </style>
  `;

  // Markup HTML do Modal de Checkout
  const checkoutModalMarkup = `
    <div id="asaasCheckoutModal" role="dialog" aria-modal="true" aria-labelledby="asaasModalTitle" aria-hidden="true">
      <div class="asaas-modal-dialog">

        <!-- Header -->
        <div class="asaas-top-header">
          <div class="asaas-brand-badge">
            <div class="asaas-icon-badge">
              <i class="fa-solid fa-shield-halved"></i>
            </div>
            <div>
              <h3 id="asaasModalTitle" class="asaas-modal-title" tabindex="-1">Escolha seu plano</h3>
              <p class="asaas-modal-sub">
                <span>Radar São José • Contratação Oficial</span>
              </p>
            </div>
          </div>
          <button type="button" onclick="window.closeAsaasModal()" class="asaas-close-button" aria-label="Fechar Modal">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div id="asaasPlanGrid" class="radar-plan-catalog">${window.radarPlanCatalog || ''}</div>
        <div id="asaasPaymentStep" hidden>
          <div class="asaas-trust-panel">
            <i class="fa-solid fa-lock" aria-hidden="true"></i>
            <img src="web-media/asaas-logo.svg" alt="Asaas" width="84" height="15">
            <div class="asaas-trust-copy">
              <strong>Pagamento processado pelo Asaas</strong>
              Os dados do cartão são informados na página do Asaas. O Radar libera o plano após a confirmação.
            </div>
          </div>
          <p id="asaasActivePlanNotice" hidden>Você já tem um plano ativo. Escolha um plano superior para consultar o upgrade.</p>
          <button type="button" class="asaas-method-tab" id="asaasBackToPlans">
            <i class="fa-solid fa-arrow-left" aria-hidden="true"></i> Ver planos
          </button>

          <!-- Banner Dinâmico de Upgrade In-App & Diferença -->
          <div id="asaasUpgradeBanner" class="asaas-upgrade-callout" style="display: none;">
            <div class="asaas-upgrade-pill"><i class="fa-solid fa-arrow-trend-up"></i> COMO O CRÉDITO É CALCULADO</div>
            <p class="asaas-upgrade-desc">O crédito corresponde ao tempo restante do seu plano atual e é abatido do preço anual do novo plano. O preço inclui 10% de desconto quando você escolhe Pix.</p>
            <dl id="asaasUpgradeBreakdown" hidden style="display:grid;grid-template-columns:1fr auto;gap:6px 12px;margin:12px 0;font-size:13px">
              <dt>Novo plano anual</dt><dd id="asaasUpgradeAnnual" style="margin:0;text-align:right"></dd>
              <dt>Crédito pelo tempo restante</dt><dd id="asaasUpgradeCredit" style="margin:0;text-align:right"></dd>
              <dt><strong>Total a pagar</strong></dt><dd id="asaasUpgradeTotal" style="margin:0;text-align:right;font-weight:800"></dd>
            </dl>
            <p id="asaasUpgradeBannerText" class="asaas-upgrade-desc" role="status"></p>
            <button type="button" id="asaasRetryUpgrade" class="asaas-method-tab" hidden>Tentar novamente</button>
          </div>

          <!-- FORMULÁRIO PRINCIPAL -->
          <div id="asaasPaymentChoices" style="margin-bottom:16px">
            <p class="asaas-field-label" id="asaasPaymentChoicesLabel">Escolha a forma de pagamento</p>
            <div class="asaas-methods-nav" role="group" aria-labelledby="asaasPaymentChoicesLabel">
              <button type="button" aria-pressed="true" id="tabPayPix" onclick="window.setAsaasPaymentMethod('PIX')" class="asaas-method-tab active">Pix</button>
              <button type="button" aria-pressed="false" id="tabPayCard" onclick="window.setAsaasPaymentMethod('CREDIT_CARD')" class="asaas-method-tab">Cartão</button>
              <button type="button" aria-pressed="false" id="tabPayBoleto" onclick="window.setAsaasPaymentMethod('BOLETO')" class="asaas-method-tab">Boleto</button>
            </div>
          </div>
          <form id="asaasCheckoutForm" onsubmit="window.handleAsaasCheckoutSubmit(event)" class="asaas-form-container">

            <!-- Alerta de Erro Amigável -->
            <div id="asaasErrorBox" class="asaas-alert-box asaas-alert-error">
              <i class="fa-solid fa-circle-exclamation mt-0.5"></i>
              <div>
                <span id="asaasErrorText">Por favor, verifique os campos informados.</span>
                <button type="button" id="asaasCheckPending" class="asaas-method-tab" onclick="window.completeCheckoutAndUnlock()" hidden>Já paguei · Verificar pagamento</button>
              </div>
            </div>

            <!-- Dados do Pagador -->
            <div class="asaas-field-group">
              <label class="asaas-field-label" for="asaasPayerName">Nome Completo ou Razão Social *</label>
              <input type="text" id="asaasPayerName" required placeholder="Ex: Maria Silva ou Empresa SJC Ltda" class="asaas-text-input" />
            </div>

            <div class="asaas-field-row">
              <div class="asaas-field-group">
                <label class="asaas-field-label" for="asaasPayerEmail">E-mail para Acesso & Nota *</label>
                <input type="email" id="asaasPayerEmail" required placeholder="seu@email.com" class="asaas-text-input" />
              </div>
              <div class="asaas-field-group">
                <label class="asaas-field-label" for="asaasPayerPhone">WhatsApp / Telefone *</label>
                <input type="tel" id="asaasPayerPhone" required placeholder="(12) 99999-9999" class="asaas-text-input" />
              </div>
            </div>

            <div class="asaas-field-group">
              <label class="asaas-field-label" for="asaasPayerCpf">CPF ou CNPJ (obrigatório para nota) *</label>
              <input type="text" id="asaasPayerCpf" required placeholder="000.000.000-00 ou 00.000.000/0000-00" class="asaas-text-input" />
            </div>

            <!-- CONTEÚDO ESPECÍFICO: CARTÃO DE CRÉDITO -->
            <div id="asaasCardFields" style="display: none;" class="asaas-form-container">
              <div class="asaas-field-group">
                <label class="asaas-field-label" for="asaasCardInstallments">Número de Parcelas</label>
                <select id="asaasCardInstallments" class="asaas-select-input">
                  <!-- Preenchido dinamicamente via JS -->
                </select>
              </div>

              <p class="asaas-field-label">Compra única para 12 meses, sem renovação automática. Se preferir parcelar, escolha em quantas vezes. Você informa os dados do cartão na página do Asaas.</p>
            </div>

            <p class="asaas-field-label">
              Consulte os <a href="juridico.html#termos" target="_blank" rel="noopener">Termos de Uso</a>,
              as <a href="juridico.html#condicoes" target="_blank" rel="noopener">Condições Comerciais</a>,
              a <a href="juridico.html#privacidade" target="_blank" rel="noopener">Política de Privacidade</a>
              e o <a href="juridico.html#sla" target="_blank" rel="noopener">SLA e Suporte</a>.
            </p>
            <!-- BOTÃO PRINCIPAL DE SUBMISSÃO -->
            <button type="submit" id="asaasBtnSubmit" class="asaas-submit-btn">
              <i class="fa-solid fa-lock"></i>
              <span id="asaasBtnSubmitText">Contratar Plano Report (12x de R$ 489,90)</span>
            </button>
          </form>

          <!-- RESULTADO & SUCESSO PÓS-COMPRA -->
          <div id="asaasCheckoutResult" class="asaas-checkout-result">

            <!-- Sucesso Cartão de Crédito -->
            <div id="resultCardSuccess" style="display:none;" class="asaas-success-card">
              <div class="asaas-success-icon">
                <i class="fa-solid fa-check"></i>
              </div>
              <h4 class="asaas-success-title">Solicitação de pagamento registrada</h4>
              <p class="asaas-success-text">
                Finalize o pagamento no Asaas. Depois, volte para verificar a liberação do acesso.
              </p>
              <a id="asaasCardInvoiceLink" class="asaas-submit-btn" target="_blank" rel="noopener noreferrer" style="display:none">Pagar com cartão no Asaas</a>
              <p id="asaasCardInvoiceUnavailable" class="asaas-field-label" hidden>O link de pagamento está indisponível. Consulte o suporte antes de tentar novamente.</p>
            </div>

            <!-- Sucesso PIX -->
            <div id="resultPixBox" style="display:none;" class="asaas-form-container">
              <div class="asaas-success-card">
                <h4 class="asaas-success-title"><i class="fa-brands fa-pix"></i> PIX Gerado com Sucesso!</h4>
                <p class="asaas-success-text">Escaneie o QR Code abaixo com o aplicativo do seu banco ou utilize o código Copia e Cola:</p>
              </div>

              <div class="asaas-pix-display">
                <img id="asaasPixQrImage" src="" alt="PIX QR Code" class="asaas-pix-img" />
                <p class="asaas-pix-instruction">Aponte a câmera do seu banco</p>
              </div>

              <div class="asaas-copy-container">
                <label class="asaas-field-label">Código PIX Copia e Cola:</label>
                <div class="asaas-copy-input-row">
                  <input type="text" id="asaasPixCopyInput" readonly class="asaas-copy-text" />
                  <button type="button" id="btnCopyPix" onclick="window.copyAsaasPixCode(this)" class="asaas-btn-copy-code">
                    <i class="fa-solid fa-copy"></i> Copiar
                  </button>
                </div>
              </div>
            </div>

            <div id="resultPixInvoiceBox" style="display:none;" class="asaas-success-card">
              <h4 class="asaas-success-title">Cobrança Pix registrada</h4>
              <p class="asaas-success-text">O QR Code ficou indisponível nesta tela.</p>
              <a id="asaasPixInvoiceLink" target="_blank" rel="noopener noreferrer">Abrir cobrança no Asaas</a>
            </div>

            <!-- Sucesso Boleto -->
            <div id="resultBoletoBox" style="display:none;" class="asaas-boleto-box">
              <div class="asaas-success-card">
                <h4 class="asaas-success-title"><i class="fa-solid fa-barcode"></i> Boleto Emitido com Sucesso!</h4>
                <p class="asaas-success-text">Confira a data de vencimento e a linha digitável na fatura do Asaas. O plano é liberado após a confirmação do pagamento.</p>
              </div>

              <div>
                <a id="asaasBoletoDownloadLink" href="#" target="_blank" rel="noopener noreferrer" class="asaas-btn-slip">
                  <i class="fa-solid fa-file-pdf"></i>
                  <span>Abrir boleto no Asaas</span>
                  <i class="fa-solid fa-arrow-up-right-from-square text-xs"></i>
                </a>
                <p id="asaasBoletoUnavailable" class="asaas-success-text" hidden>O link do boleto está indisponível. Consulte o suporte com o ID da cobrança abaixo.</p>
              </div>
            </div>

            <!-- Resumo dos Dados Contratados -->
            <div id="asaasOrderSummary" class="asaas-boleto-box" style="font-size: 11.5px; line-height: 1.6;">
              <div style="font-weight: 800; color: #00B4D8; text-transform: uppercase; letter-spacing: 0.05em;">Resumo do Pedido</div>
              <div style="color: #cbd5e1;">Plano: <strong id="summaryPlanName" style="color:#ffffff;">-</strong></div>
              <div style="color: #cbd5e1;">Valor Total: <strong id="summaryPlanValue" style="color:#ffffff;">-</strong></div>
              <div style="color: #cbd5e1;">Forma de Pagamento: <strong id="summaryPaymentMethod" style="color:#ffffff;">-</strong></div>
              <div style="color: #cbd5e1;">ID da Cobrança Asaas: <strong id="summaryPaymentId" style="font-family:monospace; color:#38bdf8;">-</strong></div>
            </div>

            <!-- Botão Acessar Plataforma / Desbloquear -->
            <div>
              <button type="button" onclick="window.completeCheckoutAndUnlock()" class="asaas-btn-unlock-view">
                <i class="fa-solid fa-circle-check"></i>
                <span>Verificar pagamento e acessar o plano</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  `;

  // Estado global do componente
  let currentPlanId = 'report';
  let currentPaymentMethod = 'PIX';
  let isSubmitting = false;
  let previouslyFocusedElement = null;
  let isUpgradeMode = false;
  let upgradeFromPlan = null;
  let upgradeQuoteRequest = 0;

  function updateUpgradeBanner() {
    const banner = document.getElementById('asaasUpgradeBanner');
    banner.style.display = isUpgradeMode ? 'block' : 'none';
  }

  async function loadUpgradeQuote(plan) {
    const request = ++upgradeQuoteRequest;
    const userId = window.appState?.user?.id;
    const message = document.getElementById('asaasUpgradeBannerText');
    const breakdown = document.getElementById('asaasUpgradeBreakdown');
    const retry = document.getElementById('asaasRetryUpgrade');
    const form = document.getElementById('asaasCheckoutForm');
    form.hidden = breakdown.hidden = retry.hidden = true;
    message.textContent = 'Calculando seu crédito…';
    let quote;
    try {
      if (userId) quote = await window.getRadarPaywallQuote?.(plan, userId, currentPaymentMethod);
    } catch (_) {}
    if (request !== upgradeQuoteRequest || window.appState?.user?.id !== userId) return;
    if (quote?.kind !== 'upgrade' || ![quote.annualPriceCents, quote.creditCents, quote.amountCents].every(Number.isSafeInteger)) {
      message.textContent = 'Não foi possível consultar seu crédito. Tente novamente em instantes.';
      retry.hidden = false;
      return;
    }
    const money = cents => (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    document.getElementById('asaasUpgradeAnnual').textContent = money(quote.annualPriceCents);
    document.getElementById('asaasUpgradeCredit').textContent = '− ' + money(quote.creditCents);
    document.getElementById('asaasUpgradeTotal').textContent = money(quote.amountCents);
    breakdown.hidden = false;
    form.hidden = !quote.payable;
    retry.hidden = quote.payable || quote.unavailableReason === 'INSTALLMENTS_PENDING' || quote.unavailableReason === 'ZERO_BALANCE';
    message.textContent = quote.payable ? 'Os 12 meses do novo plano começam após a confirmação do pagamento.' :
      quote.unavailableReason === 'INSTALLMENTS_PENDING' ? 'O plano atual tem parcelas pendentes. O upgrade fica disponível após a quitação.' :
      quote.unavailableReason === 'ZERO_BALANCE' ? 'Seu crédito cobre o valor do novo plano. Fale com o suporte para concluir a troca.' :
      'O pagamento do upgrade está indisponível no momento. Tente novamente em instantes.';
  }

  // Inicialização e injeção do componente no DOM
  function initAsaasCheckoutComponent() {
    if (!document.getElementById('asaasCheckoutGlobalStyles')) {
      document.head.insertAdjacentHTML('beforeend', checkoutStyles);
    }
    if (!document.getElementById('asaasCheckoutModal')) {
      document.body.insertAdjacentHTML('beforeend', checkoutModalMarkup);
      document.getElementById('asaasRetryUpgrade').addEventListener('click', () => loadUpgradeQuote(currentPlanId));
      document.getElementById('asaasBackToPlans').addEventListener('click', () => {
        if (!isSubmitting) showPlanCatalog();
      });

      // Fecha ao clicar fora
      const modal = document.getElementById('asaasCheckoutModal');
      if (modal) {
        modal.addEventListener('click', function(e) {
          if (e.target === modal) {
            window.closeAsaasModal();
          }
        });

        // Acessibilidade: Focus trap com tecla Tab dentro do modal
        modal.addEventListener('keydown', function(e) {
          if (e.key === 'Tab') {
            const allFocusable = Array.from(modal.querySelectorAll('button:not([disabled]), a[href]:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), [tabindex="0"]'));
            const focusable = allFocusable.filter(el => {
              return el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0;
            });
            if (!focusable || focusable.length === 0) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) {
              e.preventDefault();
              last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        });
      }

      // Máscaras de entrada
      attachInputMasks();
    }
  }

  // Máscaras de CPF/CNPJ, Telefone, Cartão e Validade
  function attachInputMasks() {
    const cpfInput = document.getElementById('asaasPayerCpf');
    if (cpfInput) {
      cpfInput.addEventListener('input', function() {
        let v = this.value.replace(/\D/g, '');
        if (v.length <= 11) {
          // CPF: 000.000.000-00
          v = v.replace(/(\d{3})(\d)/, '$1.$2');
          v = v.replace(/(\d{3})(\d)/, '$1.$2');
          v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        } else {
          // CNPJ: 00.000.000/0000-00
          v = v.slice(0, 14);
          v = v.replace(/^(\d{2})(\d)/, '$1.$2');
          v = v.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
          v = v.replace(/\.(\d{3})(\d)/, '.$1/$2');
          v = v.replace(/(\d{4})(\d)/, '$1-$2');
        }
        this.value = v;
      });
    }

    const phoneInput = document.getElementById('asaasPayerPhone');
    if (phoneInput) {
      phoneInput.addEventListener('input', function() {
        let v = this.value.replace(/\D/g, '').slice(0, 11);
        if (v.length > 10) {
          v = v.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
        } else if (v.length > 5) {
          v = v.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
        } else if (v.length > 2) {
          v = v.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
        }
        this.value = v;
      });
    }

    const installmentsSelect = document.getElementById('asaasCardInstallments');
    if (installmentsSelect) {
      installmentsSelect.addEventListener('change', function() {
        updateSubmitButtonLabel();
      });
    }

    // Acessibilidade: Seleção de planos via teclado (Enter / Espaço / Setas)
  }

  function updateInstallmentOptions() {
    const sel = document.getElementById('asaasCardInstallments');
    if (!sel) return;
    sel.innerHTML = '';

    for (let i = 1; i <= 12; i++) {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = i === 1 ? '1x (à vista)' : `${i}x sem juros`;
      if (i === 1) opt.selected = true;
      sel.appendChild(opt);
    }
  }

  // Atualiza botão de submit com suporte visual a pagamento da diferença
  function updateSubmitButtonLabel() {
    const btnText = document.getElementById('asaasBtnSubmitText');
    if (!btnText) return;
    const planName = planNames[currentPlanId];

    if (currentPaymentMethod === 'PIX') {
      btnText.textContent = `Conferir valor no Pix • ${planName}`;
    } else if (currentPaymentMethod === 'CREDIT_CARD') {
      const sel = document.getElementById('asaasCardInstallments');
      const count = parseInt(sel?.value || '1', 10);
      btnText.textContent = `Conferir valor em ${count}x no cartão`;
    } else {
      btnText.textContent = `Conferir valor no boleto • ${planName}`;
    }
  }

  // ==========================================
  // FUNÇÕES GLOBAIS DE INTERAÇÃO
  // ==========================================

  window.openAsaasCheckout = function(planKey = 'report', options = {}) {
    if (isSubmitting) return;
    previouslyFocusedElement = document.activeElement;
    initAsaasCheckoutComponent();
    const modal = document.getElementById('asaasCheckoutModal');
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    currentPlanId = normalizePlan(planKey);
    upgradeFromPlan = options.fromPlan || window.appState?.plan_type;
    showPlanCatalog();
    document.getElementById('asaasBackToPlans').hidden = false;

    // Reseta visualização do form e esconde resultado
    const form = document.getElementById('asaasCheckoutForm');
    const result = document.getElementById('asaasCheckoutResult');
    const errBox = document.getElementById('asaasErrorBox');
    const btnSubmit = document.getElementById('asaasBtnSubmit');
    if (form) {
      form.reset();
      form.style.display = 'flex';
    }
    window.setAsaasPaymentMethod('PIX');
    if (result) result.classList.remove('show');
    if (errBox) errBox.classList.remove('show');
    if (btnSubmit) btnSubmit.disabled = false;

    // Auto-preenchimento inteligente de dados salvos
    try {
      const savedEmail = localStorage.getItem('userEmail') || '';
      const savedName = localStorage.getItem('userName') || '';
      const savedPhone = localStorage.getItem('userWhatsapp') || localStorage.getItem('userPhone') || '';
      localStorage.removeItem('userCpf');

      const nameEl = document.getElementById('asaasPayerName');
      const emailEl = document.getElementById('asaasPayerEmail');
      const phoneEl = document.getElementById('asaasPayerPhone');

      if (nameEl && !nameEl.value && savedName) nameEl.value = savedName;
      if (emailEl && !emailEl.value && savedEmail) emailEl.value = savedEmail;
      if (phoneEl && !phoneEl.value && savedPhone) phoneEl.value = savedPhone;
    } catch (e) {}

  };

  window.closeAsaasModal = function() {
    if (isSubmitting) return;
    const modal = document.getElementById('asaasCheckoutModal');
    if (!modal?.classList.contains('show')) return;
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    // Acessibilidade: Restaura o foco para o elemento original
    if (previouslyFocusedElement && typeof previouslyFocusedElement.focus === 'function') {
      try { previouslyFocusedElement.focus(); } catch (e) {}
    }
  };

  // Alias para integração suave com chamadas existentes no app
  window.openPlanUpgradeModal = function(planKey = 'report', options = {}) {
    window.openAsaasCheckout(planKey, options);
  };

  function normalizePlan(planKey) {
    const key = String(planKey).normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .toLowerCase().trim().replace(/^plano[_\s-]*/, '');
    if (['10', 'explorer', 'dash'].includes(key)) return 'dash';
    if (['authority', 'cotas', 'cota', 'enterprise', 'empresarial', 'midia'].includes(key)) return 'midia';
    return 'report';
  }

  function showPlanCatalog() {
    ++upgradeQuoteRequest;
    const grid = document.getElementById('asaasPlanGrid');
    document.getElementById('asaasPaymentStep').hidden = true;
    grid.hidden = false;
    grid.querySelectorAll('[data-checkout-plan]').forEach(link => {
      link.toggleAttribute('data-suggested', link.dataset.checkoutPlan === currentPlanId);
    });
    const title = document.getElementById('asaasModalTitle');
    title.textContent = 'Escolha seu plano';
    title.focus({ preventScroll: true });
    document.getElementById('asaasCheckoutModal').scrollTop = 0;
  }

  function showPaymentStep(plan) {
    ++upgradeQuoteRequest;
    currentPlanId = plan;
    isUpgradeMode = (upgradeFromPlan === 'dash' && plan !== 'dash')
      || (upgradeFromPlan === 'report' && plan === 'midia');
    const activePlan = window.appState?.entitlement?.status === 'active' && ['dash', 'report', 'midia'].includes(upgradeFromPlan);
    document.getElementById('asaasCheckoutForm').hidden = isUpgradeMode || activePlan;
    if (isUpgradeMode) {
      window.setAsaasPaymentMethod('PIX');
    }
    document.getElementById('asaasPaymentChoices').hidden = activePlan && !isUpgradeMode;
    const activeNotice = document.getElementById('asaasActivePlanNotice');
    activeNotice.hidden = !activePlan || isUpgradeMode;
    updateUpgradeBanner();
    updateInstallmentOptions();
    updateSubmitButtonLabel();

    document.getElementById('asaasPlanGrid').hidden = true;
    document.getElementById('asaasPaymentStep').hidden = false;
    if (isUpgradeMode) loadUpgradeQuote(plan);
    const title = document.getElementById('asaasModalTitle');
    title.textContent = isUpgradeMode ? `${planNames[plan]} · Upgrade` : planNames[plan] + ' · Pagamento via Asaas';
    title.focus();
    title.closest('.asaas-modal-dialog').scrollTop = 0;
  }

  window.setAsaasPaymentMethod = function(method) {
    if (isSubmitting || !['PIX', 'CREDIT_CARD', 'BOLETO'].includes(method)) return;
    const changed = currentPaymentMethod !== method;
    currentPaymentMethod = method;
    hideCheckoutError();

    const cardFields = document.getElementById('asaasCardFields');
    for (const [id, option] of [['tabPayPix', 'PIX'], ['tabPayCard', 'CREDIT_CARD'], ['tabPayBoleto', 'BOLETO']]) {
      const button = document.getElementById(id);
      button?.classList.toggle('active', method === option);
      button?.setAttribute('aria-pressed', String(method === option));
    }

    if (cardFields) {
      cardFields.style.display = method === 'CREDIT_CARD' ? 'flex' : 'none';
    }

    updateSubmitButtonLabel();
    if (changed && isUpgradeMode && !document.getElementById('asaasPaymentStep').hidden &&
        document.getElementById('asaasPlanGrid').hidden) loadUpgradeQuote(currentPlanId);
  };

  const FRIENDLY_CHECKOUT_ERRORS = {
    'ORDER_PENDING_RECONCILIATION': 'Já existe um pedido em andamento. Se você já pagou, verifique o pagamento abaixo.',
    'SUBSCRIPTION_REQUIRES_RECONCILIATION': 'Sua assinatura anterior possui pendências de conciliação. Fale com nossa equipe de suporte.',
    'PRICE_CHANGED': 'O valor da cotação foi atualizado. Por favor, revise o valor antes de confirmar.',
    'HOSTED_CARD_ONLY': 'O pagamento com cartão é concluído com segurança na fatura oficial do Asaas.',
    'ASAAS_NOT_CONFIGURED': 'O serviço de pagamentos está em manutenção momentânea. Tente novamente em instantes.',
    'TOO_MANY_REQUESTS': 'Muitas tentativas em pouco tempo. Aguarde um minuto e tente novamente.',
    'INVALID_DOCUMENT': 'O CPF ou CNPJ informado possui dígitos inválidos.',
    'INVALID_NAME': 'Por favor, informe seu nome completo ou razão social.'
  };

  function showCheckoutError(msg, code) {
    const message = Object.hasOwn(FRIENDLY_CHECKOUT_ERRORS, code) ? FRIENDLY_CHECKOUT_ERRORS[code] : msg;
    const errBox = document.getElementById('asaasErrorBox');
    const errText = document.getElementById('asaasErrorText');
    if (errBox && errText) {
      errText.textContent = message || 'Ocorreu um erro na validação dos dados.';
      document.getElementById('asaasCheckPending').hidden = code !== 'ORDER_PENDING_RECONCILIATION';
      errBox.classList.add('show');
      errBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      alert(message);
    }
  }

  function hideCheckoutError() {
    const errBox = document.getElementById('asaasErrorBox');
    if (errBox) errBox.classList.remove('show');
  }

  function redirectToCheckoutLogin(plan) {
    try { sessionStorage.setItem('radarCheckoutPlan', plan); } catch (_) {}
    window.location.href = 'login.html';
  }

  window.resumeCheckoutAfterLogin = function() {
    try {
      const plan = sessionStorage.getItem('radarCheckoutPlan');
      if (!Object.hasOwn(planNames, plan)) return;
      window.openAsaasCheckout(plan);
      showPaymentStep(plan);
      sessionStorage.removeItem('radarCheckoutPlan');
    } catch (_) {}
  };

  document.addEventListener('click', event => {
    const link = event.target.closest?.('[data-checkout-plan]');
    if (!link || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const plan = link.dataset.checkoutPlan;
    if (!Object.hasOwn(planNames, plan)) return;
    event.preventDefault();
    if (!link.closest('#asaasPlanGrid')) {
      window.openAsaasCheckout(plan);
    } else if (!window.appState?.user) {
      redirectToCheckoutLogin(plan);
    } else {
      showPaymentStep(plan);
    }
  });

  // Submissão do Formulário de Checkout
  window.handleAsaasCheckoutSubmit = async function(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (isSubmitting || document.getElementById('asaasCheckoutForm').hidden) return;
    hideCheckoutError();

    const nameInput = document.getElementById('asaasPayerName');
    const emailInput = document.getElementById('asaasPayerEmail');
    const phoneInput = document.getElementById('asaasPayerPhone');
    const cpfInput = document.getElementById('asaasPayerCpf');
    const btnSubmit = document.getElementById('asaasBtnSubmit');
    const btnText = document.getElementById('asaasBtnSubmitText');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const phone = phoneInput ? phoneInput.value.trim() : '';
    const cpfCnpj = cpfInput ? cpfInput.value.trim() : '';

    if (!name || name.length < 3) {
      return showCheckoutError('Por favor, informe seu Nome Completo ou Razão Social.');
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return showCheckoutError('Por favor, informe um endereço de e-mail válido.');
    }
    if (!cpfCnpj) {
      return showCheckoutError('Por favor, informe um CPF ou CNPJ válido para emissão da nota.');
    }

    const payload = {
      name,
      email,
      phone,
      cpfCnpj,
      plan: currentPlanId,
      billingType: currentPaymentMethod,
      isUpgrade: isUpgradeMode,
      fromPlan: isUpgradeMode ? upgradeFromPlan : undefined
    };

    if (currentPaymentMethod === 'CREDIT_CARD') {
      const installmentsSel = document.getElementById('asaasCardInstallments');
      payload.installmentCount = parseInt(installmentsSel?.value || '1', 10);
    }

    // Loading State & In-Flight Lock
    isSubmitting = true;
    if (btnSubmit) btnSubmit.disabled = true;
    if (btnText) btnText.textContent = 'Conferindo cotação…';

    try {
      const session = typeof supabaseClient !== 'undefined' && supabaseClient
        ? (await supabaseClient.auth.getSession()).data?.session : null;
      if (!session?.access_token) return redirectToCheckoutLogin(payload.plan);
      const headers = { 'Content-Type': 'application/json', Authorization: 'Bearer ' + session.access_token };
      const quoteResponse = await fetch('/api/asaas-checkout', {
        method: 'POST', headers, signal: AbortSignal.timeout(20000),
        body: JSON.stringify({ action: 'quote', plan: payload.plan, billingType: payload.billingType, installmentCount: payload.installmentCount })
      });
      const quoted = await quoteResponse.json();
      if (!quoteResponse.ok || !quoted.success || !Number.isSafeInteger(quoted.quote?.amountCents)) {
        return showCheckoutError(quoted.message || 'Não foi possível conferir o valor da contratação.', quoted.code);
      }
      const total = (quoted.quote.amountCents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      const count = quoted.quote.installments.length;
      const environmentNote = quoted.sandbox ? 'Ambiente de testes do Asaas. Nenhuma cobrança real será feita.\n\n' : '';
      const upgradeDetails = quoted.quote.kind === 'upgrade'
        ? `Crédito aplicado: ${(quoted.quote.creditCents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}. Nova vigência de 12 meses após a confirmação.\n\n` : '';
      if (!window.confirm(`${environmentNote}${upgradeDetails}Confirmar ${planNames[payload.plan]} por ${total} no total${count > 1 ? ` em ${count} parcelas` : ''}?`)) return;
      payload.expectedAmountCents = quoted.quote.amountCents;
      if (btnText) btnText.textContent = 'Processando pagamento…';
      const response = await fetch('/api/asaas-checkout', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(payload.billingType === 'CREDIT_CARD' ? 85000 : 35000)
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return showCheckoutError(data.message || 'Não foi possível concluir o pagamento.', data.code);
      }

      renderCheckoutSuccessScreen(data);
    } catch (err) {
      if (err?.name === 'AbortError' || err?.name === 'TimeoutError') {
        showCheckoutError('O processamento demorou mais que o esperado. Consulte a confirmação antes de tentar novamente.');
      } else {
        showCheckoutError('Falha na comunicação com o servidor de pagamento.');
      }
    } finally {
      isSubmitting = false;
      if (btnSubmit) btnSubmit.disabled = false;
      updateSubmitButtonLabel();
    }
  };

  // Renderiza a Tela de Sucesso Pós-Compra contextualizada
  function renderCheckoutSuccessScreen(data) {
    const form = document.getElementById('asaasCheckoutForm');
    const resultBox = document.getElementById('asaasCheckoutResult');
    const resultCardSuccess = document.getElementById('resultCardSuccess');
    const resultPixBox = document.getElementById('resultPixBox');
    const resultPixInvoiceBox = document.getElementById('resultPixInvoiceBox');
    const resultBoletoBox = document.getElementById('resultBoletoBox');

    if (form) form.style.display = 'none';
    const choices = document.getElementById('asaasPaymentChoices');
    if (choices) choices.hidden = true;
    document.getElementById('asaasBackToPlans').hidden = true;
    if (resultBox) resultBox.classList.add('show');

    // Esconde todos inicialmente
    if (resultCardSuccess) resultCardSuccess.style.display = 'none';
    if (resultPixBox) resultPixBox.style.display = 'none';
    if (resultPixInvoiceBox) resultPixInvoiceBox.style.display = 'none';
    if (resultBoletoBox) resultBoletoBox.style.display = 'none';

    const payment = data.payment || {};
    const plan = data.plan || {};

    // 1. Cartão de Crédito
    if (payment.billingType === 'CREDIT_CARD') {
      if (resultCardSuccess) resultCardSuccess.style.display = 'block';
      const link = document.getElementById('asaasCardInvoiceLink');
      const unavailable = document.getElementById('asaasCardInvoiceUnavailable');
      link.removeAttribute('href');
      link.style.display = 'none';
      try {
        const url = new URL(payment.invoiceUrl);
        if (url.protocol === 'https:' && !url.username && !url.password &&
            (url.hostname === 'asaas.com' || url.hostname.endsWith('.asaas.com'))) {
          link.href = url.href;
          link.style.display = '';
        }
      } catch (_) {}
      unavailable.hidden = Boolean(link.getAttribute('href'));
    }
    // 2. PIX
    else if (payment.billingType === 'PIX' && payment.pix) {
      if (resultPixBox) resultPixBox.style.display = 'flex';
      const pixImg = document.getElementById('asaasPixQrImage');
      const pixInput = document.getElementById('asaasPixCopyInput');
      if (pixImg && payment.pix.qrCodeImage) pixImg.src = payment.pix.qrCodeImage;
      if (pixInput && payment.pix.copyPasteKey) pixInput.value = payment.pix.copyPasteKey;
    } else if (payment.billingType === 'PIX' && resultPixInvoiceBox) {
      resultPixInvoiceBox.style.display = 'block';
      const link = document.getElementById('asaasPixInvoiceLink');
      if (link) {
        link.removeAttribute('href');
        link.hidden = true;
        try {
          const url = new URL(payment.invoiceUrl);
          if (url.protocol === 'https:' && (url.hostname === 'asaas.com' || url.hostname.endsWith('.asaas.com'))) {
            link.href = url.href;
            link.hidden = false;
          }
        } catch (_) {}
      }
    }
    // 3. Boleto
    else if (payment.billingType === 'BOLETO') {
      if (resultBoletoBox) resultBoletoBox.style.display = 'flex';
      const slipLink = document.getElementById('asaasBoletoDownloadLink');
      slipLink.removeAttribute('href');
      slipLink.hidden = true;
      try {
        const url = new URL(payment.invoiceUrl);
        if (url.protocol === 'https:' && !url.username && !url.password &&
            (url.hostname === 'asaas.com' || url.hostname.endsWith('.asaas.com'))) {
          slipLink.href = url.href;
          slipLink.hidden = false;
        }
      } catch (_) {}
      document.getElementById('asaasBoletoUnavailable').hidden = !slipLink.hidden;
    }

    // Preenche resumo
    const sumPlanName = document.getElementById('summaryPlanName');
    const sumPlanValue = document.getElementById('summaryPlanValue');
    const sumPaymentMethod = document.getElementById('summaryPaymentMethod');
    const sumPaymentId = document.getElementById('summaryPaymentId');

    if (sumPlanName) sumPlanName.textContent = plan.name || 'Plano Radar São José';
    if (sumPlanValue) {
      const total = (plan.value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      sumPlanValue.textContent = payment.installmentCount > 1 ? `${total} em ${payment.installmentCount} parcelas` : total;
    }
    if (sumPaymentMethod) {
      sumPaymentMethod.textContent = payment.billingType === 'CREDIT_CARD' ? 'Cartão de crédito' : payment.billingType === 'PIX' ? 'Pix' : 'Boleto bancário';
    }
    if (sumPaymentId) sumPaymentId.textContent = payment.id || '—';


  }

  // Função ultra-robusta de cópia para a área de transferência com fallback síncrono e feedback visual
  function copyTextWithFallback(text, inputEl, btnEl, successMsg) {
    if (!text && inputEl) text = inputEl.value;
    if (!text) return;

    let copiedSynchronously = false;

    // 1. Fallback Síncrono Imediato (durante o evento de clique do usuário)
    // Permite contornar restrições de permissão e bloqueios em navegadores restritivos
    if (inputEl) {
      try {
        const wasReadOnly = inputEl.readOnly;
        // iOS Safari workaround: readonly impede seleção de texto
        if (wasReadOnly) inputEl.readOnly = false;
        inputEl.focus();
        inputEl.select();
        if (typeof inputEl.setSelectionRange === 'function') {
          inputEl.setSelectionRange(0, 99999);
        }
        copiedSynchronously = document.execCommand('copy');
        if (wasReadOnly) inputEl.readOnly = true;
      } catch (errExec) {
        copiedSynchronously = false;
      }
    }

    // Se o input original não funcionou ou não existe, cria um textarea temporário síncrono
    if (!copiedSynchronously) {
      try {
        const temp = document.createElement('textarea');
        temp.value = text;
        temp.style.position = 'fixed';
        temp.style.left = '-9999px';
        temp.style.top = '0';
        temp.style.opacity = '0';
        temp.setAttribute('readonly', '');
        document.body.appendChild(temp);
        temp.focus();
        temp.select();
        if (typeof temp.setSelectionRange === 'function') {
          temp.setSelectionRange(0, 99999);
        }
        copiedSynchronously = document.execCommand('copy');
        document.body.removeChild(temp);
      } catch (errTemp) {
        copiedSynchronously = false;
      }
    }

    // Função de feedback visual de sucesso no botão e notificação
    const applyFeedback = (msg) => {
      if (btnEl) {
        const origHtml = btnEl.dataset.originalHtml || btnEl.innerHTML;
        btnEl.dataset.originalHtml = origHtml;
        btnEl.innerHTML = '<i class="fa-solid fa-check text-emerald-300"></i> Copiado!';
        btnEl.style.backgroundColor = '#10B981';
        btnEl.style.color = '#ffffff';
        setTimeout(() => {
          btnEl.innerHTML = origHtml;
          btnEl.style.backgroundColor = '';
          btnEl.style.color = '';
        }, 2500);
      }
      // Notificação ao usuário
      if (typeof window.showAsaasToast === 'function') {
        window.showAsaasToast(msg);
      } else if (typeof alert === 'function' && !window._suppressAlerts) {
        try { alert(msg); } catch (e) {}
      }
    };

    // 2. Tenta a API moderna navigator.clipboard se disponível em contexto seguro
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard.writeText(text).then(() => {
        applyFeedback(successMsg);
      }).catch(() => {
        // Se a Promise rejeitou (ex: permissão negada), mas o fallback síncrono já funcionou
        if (copiedSynchronously) {
          applyFeedback(successMsg);
        } else {
          applyFeedback('Código selecionado. Utilize Ctrl+C para copiar.');
        }
      });
      return;
    }

    // 3. Contextos sem navigator.clipboard (ex: HTTP inseguro, navegadores legados)
    if (copiedSynchronously) {
      applyFeedback(successMsg);
    } else {
      applyFeedback('Código selecionado. Utilize Ctrl+C para copiar.');
    }
  }

  // Cópia do código PIX
  window.copyAsaasPixCode = function(buttonElement) {
    const input = document.getElementById('asaasPixCopyInput');
    const btn = buttonElement || document.getElementById('btnCopyPix') || document.querySelector('.asaas-btn-copy-code');
    const val = input ? input.value : '';
    copyTextWithFallback(val, input, btn, 'Chave PIX Copia e Cola copiada com sucesso!');
  };

  // Finalização e Desbloqueio da Plataforma
  window.completeCheckoutAndUnlock = async function() {
    try {
      if (typeof window.refreshConfirmedPlan !== 'function') {
        throw new Error('Entre na sua conta para verificar a confirmação do pagamento.');
      }
      const confirmedPlan = await window.refreshConfirmedPlan();
      if (confirmedPlan !== currentPlanId) {
        alert('Pagamento ainda não confirmado para este plano. Aguarde e verifique novamente.');
        return;
      }
      window.closeAsaasModal();
      alert('Plano confirmado pelo servidor. Seu acesso foi atualizado.');
    } catch (error) {
      alert(error.message || 'Não foi possível confirmar o pagamento. Tente novamente.');
    }
  };

  // Listener para fechamento por tecla ESC
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      window.closeAsaasModal();
    }
  });

  // Auto-inicialização na carga do DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAsaasCheckoutComponent);
  } else {
    initAsaasCheckoutComponent();
  }

})();
