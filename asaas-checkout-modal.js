// ============================================================================
// RADAR SÃO JOSÉ - COMPONENTE OFICIAL DE CHECKOUT ASAAS (SANDBOX & PRODUÇÃO)
// Planos Comerciais:
// - Plano Dash (Explorer): 12x de R$ 269,90 (R$ 3.238,80 anual)
// - Plano Report (Executive - Recomendado): 12x de R$ 489,90 (R$ 5.878,80 anual)
// - Plano Mídia (Authority / Cotas): 12x de R$ 1.190,00 (R$ 14.280,00 anual)
// Multi-Método: PIX dinâmico, Cartão de Crédito parcelado até 12x e Boleto Bancário
// ============================================================================

(function() {
  'use strict';

  // Definição dos Planos Comerciais do Radar São José
  const PLANS_DATA = {
    dash: {
      id: 'dash',
      name: 'Plano Dash (Explorer)',
      badge: 'Explorer',
      installmentCount: 12,
      installmentValue: 269.90,
      totalValue: 3238.80,
      tagline: 'Acesso completo aos 30 gráficos e cruzamentos quantitativos',
      features: [
        '30 Gráficos interativos da Pesquisa Quantitativa',
        'Filtros por gênero, faixa etária, renda e região',
        'Base completa de 477 moradores respondentes',
        'Exportação de dados e recortes estatísticos'
      ]
    },
    report: {
      id: 'report',
      name: 'Plano Report (Executive - Recomendado)',
      badge: 'Executive • Recomendado',
      recommended: true,
      installmentCount: 12,
      installmentValue: 489.90,
      totalValue: 5878.80,
      tagline: 'Inteligência analítica aprofundada com o Dossiê Executivo completo',
      features: [
        'Tudo do Plano Dash (Explorer)',
        'Dossiê Executivo Completo com 8 capítulos',
        '10 Entrevistas em Profundidade na íntegra',
        'Invasão de Cenários & Comportamento Urbano',
        'Consultor IA Estratégico integrado'
      ]
    },
    midia: {
      id: 'midia',
      name: 'Plano Mídia (Authority / Cotas)',
      badge: 'Authority / Cotas',
      installmentCount: 12,
      installmentValue: 1190.00,
      totalValue: 14280.00,
      tagline: 'Inteligência de mídia, notícias, influenciadores e ativação de equipe',
      features: [
        'Tudo do Plano Report (Executive)',
        'Painel de Inteligência de Mídia & Notícias SJC',
        'Métricas e Mapeamento de Influenciadores Locais',
        'Personas Comportamentais estruturadas',
        '3 Licenças simultâneas para sua equipe corporativa'
      ]
    }
  };

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
        height: 100vh;
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

      .asaas-modal-sub {
        font-size: 11.5px;
        font-weight: 500;
        color: #94a3b8;
        margin: 0;
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .asaas-sandbox-pill {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 2px 7px;
        border-radius: 6px;
        background: rgba(245, 158, 11, 0.18);
        border: 1px solid rgba(245, 158, 11, 0.4);
        color: #fbbf24;
        font-size: 9.5px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.05em;
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

      /* 3 PLANOS EM GRID */
      .asaas-plan-selector {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
        margin-bottom: 20px;
      }

      @media (max-width: 520px) {
        .asaas-plan-selector {
          grid-template-columns: 1fr;
          gap: 8px;
        }
      }

      .asaas-plan-card-opt {
        padding: 12px;
        border-radius: 16px;
        border: 2px solid rgba(255, 255, 255, 0.12);
        background: rgba(255, 255, 255, 0.04);
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        user-select: none;
        position: relative;
      }

      .asaas-plan-card-opt:hover {
        border-color: rgba(0, 180, 216, 0.4);
        background: rgba(255, 255, 255, 0.07);
      }

      .asaas-plan-card-opt.active {
        border-color: #00B4D8;
        background: rgba(0, 180, 216, 0.14);
        box-shadow: 0 0 20px rgba(0, 180, 216, 0.25);
      }

      .asaas-plan-card-opt.recommended-plan {
        border-color: rgba(16, 185, 129, 0.4);
      }

      .asaas-plan-card-opt.recommended-plan.active {
        border-color: #10B981;
        background: rgba(16, 185, 129, 0.15);
        box-shadow: 0 0 20px rgba(16, 185, 129, 0.25);
      }

      .asaas-opt-badge {
        font-size: 9px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #94a3b8;
        margin-bottom: 4px;
        display: block;
      }

      .asaas-plan-card-opt.active .asaas-opt-badge {
        color: #38bdf8;
      }

      .asaas-plan-card-opt.recommended-plan.active .asaas-opt-badge {
        color: #34d399;
      }

      .asaas-opt-title {
        font-size: 13px;
        font-weight: 800;
        color: #ffffff;
        margin-bottom: 6px;
      }

      .asaas-opt-price-big {
        font-size: 16px;
        font-weight: 900;
        color: #ffffff;
        line-height: 1.1;
      }

      .asaas-opt-price-sub {
        font-size: 10px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.6);
        margin-top: 2px;
      }

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
              <h3 id="asaasModalTitle" class="asaas-modal-title">Checkout Seguro • Asaas</h3>
              <p class="asaas-modal-sub">
                <span class="asaas-sandbox-pill"><i class="fa-solid fa-flask"></i> Sandbox</span>
                <span>Radar São José • Contratação Oficial</span>
              </p>
            </div>
          </div>
          <button type="button" onclick="window.closeAsaasModal()" class="asaas-close-button" aria-label="Fechar Modal">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <!-- SELEÇÃO DOS 3 PLANOS COMERCIAIS -->
        <div class="asaas-plan-selector" id="asaasPlanGrid" role="radiogroup" aria-label="Selecione um Plano">
          <!-- 1. Dash -->
          <div id="planCardDash" role="radio" aria-checked="false" tabindex="0" class="asaas-plan-card-opt" onclick="window.selectAsaasPlan('dash')">
            <div>
              <span class="asaas-opt-badge">Explorer</span>
              <div class="asaas-opt-title">Plano Dash</div>
            </div>
            <div>
              <div class="asaas-opt-price-big">12x R$ 269,90</div>
              <div class="asaas-opt-price-sub">ou R$ 3.238,80 anual</div>
            </div>
          </div>

          <!-- 2. Report (Recomendado) -->
          <div id="planCardReport" role="radio" aria-checked="true" tabindex="0" class="asaas-plan-card-opt recommended-plan active" onclick="window.selectAsaasPlan('report')">
            <div>
              <span class="asaas-opt-badge">Recomendado</span>
              <div class="asaas-opt-title">Plano Report</div>
            </div>
            <div>
              <div class="asaas-opt-price-big">12x R$ 489,90</div>
              <div class="asaas-opt-price-sub">ou R$ 5.878,80 anual</div>
            </div>
          </div>

          <!-- 3. Mídia -->
          <div id="planCardMidia" role="radio" aria-checked="false" tabindex="0" class="asaas-plan-card-opt" onclick="window.selectAsaasPlan('midia')">
            <div>
              <span class="asaas-opt-badge">Authority / Cotas</span>
              <div class="asaas-opt-title">Plano Mídia</div>
            </div>
            <div>
              <div class="asaas-opt-price-big">12x R$ 1.190,00</div>
              <div class="asaas-opt-price-sub">ou R$ 14.280,00 anual</div>
            </div>
          </div>
        </div>

        <!-- Banner Dinâmico de Upgrade In-App & Diferença -->
        <div id="asaasUpgradeBanner" class="asaas-upgrade-callout" style="display: none;">
          <div class="asaas-upgrade-pill"><i class="fa-solid fa-arrow-trend-up"></i> UPGRADE COM CRÉDITO DO SEU PLANO ATUAL</div>
          <div id="asaasUpgradeBannerText" class="asaas-upgrade-desc">
            Pague apenas a diferença para evoluir de plano.
          </div>
        </div>

        <!-- FORMULÁRIO PRINCIPAL -->
        <form id="asaasCheckoutForm" onsubmit="window.handleAsaasCheckoutSubmit(event)" class="asaas-form-container">
          
          <!-- Alerta de Erro Amigável -->
          <div id="asaasErrorBox" class="asaas-alert-box asaas-alert-error">
            <i class="fa-solid fa-circle-exclamation mt-0.5"></i>
            <span id="asaasErrorText">Por favor, verifique os campos informados.</span>
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

          <!-- MÉTODOS DE PAGAMENTO -->
          <div>
            <label class="asaas-field-label">Escolha a Forma de Pagamento</label>
            <div class="asaas-methods-nav" role="tablist">
              <button type="button" role="tab" aria-selected="true" id="tabPayPix" onclick="window.setAsaasPaymentMethod('PIX')" class="asaas-method-tab active">
                <i class="fa-brands fa-pix text-emerald-400"></i> PIX
              </button>
              <button type="button" role="tab" aria-selected="false" id="tabPayCard" onclick="window.setAsaasPaymentMethod('CREDIT_CARD')" class="asaas-method-tab">
                <i class="fa-regular fa-credit-card text-sky-400"></i> Cartão (12x)
              </button>
              <button type="button" role="tab" aria-selected="false" id="tabPayBoleto" onclick="window.setAsaasPaymentMethod('BOLETO')" class="asaas-method-tab">
                <i class="fa-solid fa-barcode text-amber-400"></i> Boleto
              </button>
            </div>
          </div>

          <!-- CONTEÚDO ESPECÍFICO: CARTÃO DE CRÉDITO -->
          <div id="asaasCardFields" style="display: none;" class="asaas-form-container">
            <div class="asaas-field-group">
              <label class="asaas-field-label" for="asaasCardInstallments">Número de Parcelas</label>
              <select id="asaasCardInstallments" class="asaas-select-input">
                <!-- Preenchido dinamicamente via JS -->
              </select>
            </div>

            <div class="asaas-field-group">
              <label class="asaas-field-label" for="asaasCardNumber">Número do Cartão de Crédito</label>
              <input type="text" id="asaasCardNumber" placeholder="0000 0000 0000 0000" maxlength="19" class="asaas-text-input" />
            </div>

            <div class="asaas-field-group">
              <label class="asaas-field-label" for="asaasCardHolder">Nome Impresso no Cartão</label>
              <input type="text" id="asaasCardHolder" placeholder="Como gravado no cartão" class="asaas-text-input" />
            </div>

            <div class="asaas-field-row">
              <div class="asaas-field-group">
                <label class="asaas-field-label" for="asaasCardExpiry">Validade (MM/AA)</label>
                <input type="text" id="asaasCardExpiry" placeholder="12/28" maxlength="5" class="asaas-text-input" />
              </div>
              <div class="asaas-field-group">
                <label class="asaas-field-label" for="asaasCardCvv">CVV</label>
                <input type="text" id="asaasCardCvv" placeholder="123" maxlength="4" class="asaas-text-input" />
              </div>
            </div>
          </div>

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
            <h4 class="asaas-success-title">Assinatura Aprovada com Sucesso!</h4>
            <p class="asaas-success-text">
              Sua contratação no Asaas Sandbox foi processada e confirmada. Seu acesso completo já está ativo.
            </p>
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

          <!-- Sucesso Boleto -->
          <div id="resultBoletoBox" style="display:none;" class="asaas-boleto-box">
            <div class="asaas-success-card">
              <h4 class="asaas-success-title"><i class="fa-solid fa-barcode"></i> Boleto Emitido com Sucesso!</h4>
              <p class="asaas-success-text">Vencimento em 3 dias úteis. Acesso liberado automaticamente após a compensação.</p>
            </div>

            <div class="asaas-copy-container">
              <label class="asaas-field-label">Linha Digitável:</label>
              <div class="asaas-copy-input-row">
                <input type="text" id="asaasBoletoLinhaInput" readonly class="asaas-copy-text" />
                <button type="button" id="btnCopyBoleto" onclick="window.copyAsaasBoletoCode(this)" class="asaas-btn-copy-code">
                  <i class="fa-solid fa-copy"></i> Copiar
                </button>
              </div>
            </div>

            <div>
              <a id="asaasBoletoDownloadLink" href="#" target="_blank" rel="noopener noreferrer" class="asaas-btn-slip">
                <i class="fa-solid fa-file-pdf"></i>
                <span>Visualizar / Baixar Boleto Asaas (PDF)</span>
                <i class="fa-solid fa-arrow-up-right-from-square text-xs"></i>
              </a>
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
              <span>Acessar Pesquisa Completa Liberada</span>
            </button>
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

  // Precificação diferencial para Upgrades In-App
  const UPGRADE_PRICING = {
    'dash->report': {
      fromName: 'Plano Dash (Explorer)',
      toName: 'Plano Report (Executive)',
      totalValue: 2640.00,
      installmentValue: 220.00,
      installmentCount: 12,
      badgeText: 'Upgrade: Dash → Report (12x R$ 220,00)'
    },
    'dash->midia': {
      fromName: 'Plano Dash (Explorer)',
      toName: 'Plano Mídia (Authority)',
      totalValue: 11041.20,
      installmentValue: 920.10,
      installmentCount: 12,
      badgeText: 'Upgrade: Dash → Mídia (12x R$ 920,10)'
    },
    'report->midia': {
      fromName: 'Plano Report (Executive)',
      toName: 'Plano Mídia (Authority)',
      totalValue: 8401.20,
      installmentValue: 700.10,
      installmentCount: 12,
      badgeText: 'Upgrade: Report → Mídia (12x R$ 700,10)'
    }
  };

  function updateUpgradeBanner() {
    const banner = document.getElementById('asaasUpgradeBanner');
    const bannerText = document.getElementById('asaasUpgradeBannerText');
    if (!banner || !bannerText) return;

    if (isUpgradeMode && upgradeFromPlan) {
      const key = `${upgradeFromPlan}->${currentPlanId}`;
      const up = UPGRADE_PRICING[key];
      if (up) {
        banner.style.display = 'flex';
        bannerText.innerHTML = `Você já possui o <strong>${up.fromName}</strong>. Pague apenas a <strong>diferença de R$ ${up.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (12x de R$ ${up.installmentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})</strong> para desbloquear o ${up.toName}.`;
        return;
      }
    }
    banner.style.display = 'none';
  }

  // Inicialização e injeção do componente no DOM
  function initAsaasCheckoutComponent() {
    if (!document.getElementById('asaasCheckoutGlobalStyles')) {
      document.head.insertAdjacentHTML('beforeend', checkoutStyles);
    }
    if (!document.getElementById('asaasCheckoutModal')) {
      document.body.insertAdjacentHTML('beforeend', checkoutModalMarkup);

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

    const cardNumInput = document.getElementById('asaasCardNumber');
    if (cardNumInput) {
      cardNumInput.addEventListener('input', function() {
        let v = this.value.replace(/\D/g, '').slice(0, 16);
        v = v.replace(/(\d{4})(?=\d)/g, '$1 ');
        this.value = v;
      });
    }

    const cardExpiryInput = document.getElementById('asaasCardExpiry');
    if (cardExpiryInput) {
      cardExpiryInput.addEventListener('input', function() {
        const raw = this.value.replace(/\D/g, '');
        let v = raw;
        if (raw.length >= 6) {
          // Usuário digitou ou colou no formato MMYYYY (ex: 122028)
          v = raw.slice(0, 2) + raw.slice(-2);
        } else {
          v = raw.slice(0, 4);
        }
        if (v.length >= 2) {
          v = v.slice(0, 2) + '/' + v.slice(2);
        }
        this.value = v;
      });
    }

    const cardCvvInput = document.getElementById('asaasCardCvv');
    if (cardCvvInput) {
      cardCvvInput.addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, '').slice(0, 4);
      });
    }

    const installmentsSelect = document.getElementById('asaasCardInstallments');
    if (installmentsSelect) {
      installmentsSelect.addEventListener('change', function() {
        updateSubmitButtonLabel();
      });
    }

    // Acessibilidade: Seleção de planos via teclado (Enter / Espaço / Setas)
    const planKeys = ['dash', 'report', 'midia'];
    planKeys.forEach((k, idx) => {
      const card = document.getElementById('planCard' + k.charAt(0).toUpperCase() + k.slice(1));
      if (card) {
        card.addEventListener('keydown', function(ev) {
          if (ev.key === 'Enter' || ev.key === ' ') {
            ev.preventDefault();
            window.selectAsaasPlan(k);
          } else if (ev.key === 'ArrowRight' || ev.key === 'ArrowDown') {
            ev.preventDefault();
            const nextKey = planKeys[(idx + 1) % planKeys.length];
            window.selectAsaasPlan(nextKey);
            const nextEl = document.getElementById('planCard' + nextKey.charAt(0).toUpperCase() + nextKey.slice(1));
            if (nextEl) nextEl.focus();
          } else if (ev.key === 'ArrowLeft' || ev.key === 'ArrowUp') {
            ev.preventDefault();
            const prevKey = planKeys[(idx - 1 + planKeys.length) % planKeys.length];
            window.selectAsaasPlan(prevKey);
            const prevEl = document.getElementById('planCard' + prevKey.charAt(0).toUpperCase() + prevKey.slice(1));
            if (prevEl) prevEl.focus();
          }
        });
      }
    });
  }

  // Preenche opções de parcelas do Cartão de Crédito com suporte a diferença de Upgrade
  function updateInstallmentOptions(plan) {
    const sel = document.getElementById('asaasCardInstallments');
    if (!sel) return;
    sel.innerHTML = '';

    let totalVal = plan.totalValue;
    if (isUpgradeMode && upgradeFromPlan) {
      const upKey = `${upgradeFromPlan}->${plan.id}`;
      if (UPGRADE_PRICING[upKey]) {
        totalVal = UPGRADE_PRICING[upKey].totalValue;
      }
    }

    for (let i = 1; i <= 12; i++) {
      const opt = document.createElement('option');
      opt.value = i;
      const partVal = (totalVal / i).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      if (i === 1) {
        opt.textContent = `1x de R$ ${partVal} (à vista)`;
      } else {
        opt.textContent = `${i}x de R$ ${partVal} sem juros`;
      }
      if (i === 12) opt.selected = true;
      sel.appendChild(opt);
    }
  }

  // Atualiza botão de submit com suporte visual a pagamento da diferença
  function updateSubmitButtonLabel() {
    const btnText = document.getElementById('asaasBtnSubmitText');
    if (!btnText) return;
    const plan = PLANS_DATA[currentPlanId] || PLANS_DATA.report;

    let totalVal = plan.totalValue;
    let isUp = false;
    if (isUpgradeMode && upgradeFromPlan) {
      const upKey = `${upgradeFromPlan}->${plan.id}`;
      if (UPGRADE_PRICING[upKey]) {
        totalVal = UPGRADE_PRICING[upKey].totalValue;
        isUp = true;
      }
    }

    const prefix = isUp ? 'Pagar Diferença' : 'Pagar';

    if (currentPaymentMethod === 'PIX') {
      btnText.textContent = `${isUp ? 'Gerar PIX da Diferença' : 'Gerar PIX'} • ${plan.name} (R$ ${totalVal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})`;
    } else if (currentPaymentMethod === 'CREDIT_CARD') {
      const sel = document.getElementById('asaasCardInstallments');
      const count = sel ? parseInt(sel.value || 12, 10) : 12;
      const part = (totalVal / count).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
      btnText.textContent = `${prefix} em ${count}x de R$ ${part} no Cartão`;
    } else if (currentPaymentMethod === 'BOLETO') {
      btnText.textContent = `${isUp ? 'Emitir Boleto da Diferença' : 'Emitir Boleto'} • ${plan.name} (R$ ${totalVal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})`;
    }
  }

  // ==========================================
  // FUNÇÕES GLOBAIS DE INTERAÇÃO
  // ==========================================

  window.openAsaasCheckout = function(planKey = 'report', options = {}) {
    previouslyFocusedElement = document.activeElement;
    initAsaasCheckoutComponent();
    const modal = document.getElementById('asaasCheckoutModal');
    if (modal) {
      modal.classList.add('show');
      modal.setAttribute('aria-hidden', 'false');
    }

    // Identificação inteligente de upgrade in-app
    const currentSavedPlan = (window.appState?.plan_type || window.appState?.profile?.plan_type || '').toLowerCase().trim();
    if (options && options.isUpgrade) {
      isUpgradeMode = true;
      upgradeFromPlan = options.fromPlan || (currentSavedPlan === 'dash' ? 'dash' : currentSavedPlan === 'report' ? 'report' : null);
    } else if ((currentSavedPlan === 'dash' && (planKey === 'report' || planKey === 'midia')) ||
               (currentSavedPlan === 'report' && planKey === 'midia')) {
      isUpgradeMode = true;
      upgradeFromPlan = currentSavedPlan;
    } else {
      isUpgradeMode = false;
      upgradeFromPlan = null;
    }

    // Reseta visualização do form e esconde resultado
    const form = document.getElementById('asaasCheckoutForm');
    const result = document.getElementById('asaasCheckoutResult');
    const errBox = document.getElementById('asaasErrorBox');
    const btnSubmit = document.getElementById('asaasBtnSubmit');
    if (form) form.style.display = 'flex';
    if (result) result.classList.remove('show');
    if (errBox) errBox.classList.remove('show');
    if (btnSubmit) btnSubmit.disabled = false;
    isSubmitting = false;

    window.selectAsaasPlan(planKey);
    updateUpgradeBanner();
    updateSubmitButtonLabel();

    // Auto-preenchimento inteligente de dados salvos
    try {
      const savedEmail = localStorage.getItem('userEmail') || '';
      const savedName = localStorage.getItem('userName') || '';
      const savedPhone = localStorage.getItem('userWhatsapp') || localStorage.getItem('userPhone') || '';
      const savedDoc = localStorage.getItem('userCpf') || '';

      const nameEl = document.getElementById('asaasPayerName');
      const emailEl = document.getElementById('asaasPayerEmail');
      const phoneEl = document.getElementById('asaasPayerPhone');
      const docEl = document.getElementById('asaasPayerCpf');

      if (nameEl && !nameEl.value && savedName) nameEl.value = savedName;
      if (emailEl && !emailEl.value && savedEmail) emailEl.value = savedEmail;
      if (phoneEl && !phoneEl.value && savedPhone) phoneEl.value = savedPhone;
      if (docEl && !docEl.value && savedDoc) docEl.value = savedDoc;
    } catch (e) {}

    // Acessibilidade: move foco para o primeiro input do modal
    setTimeout(() => {
      const nameInput = document.getElementById('asaasPayerName');
      if (nameInput) nameInput.focus();
    }, 60);
  };

  window.closeAsaasModal = function() {
    const modal = document.getElementById('asaasCheckoutModal');
    if (modal) {
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
    }
    // Acessibilidade: Restaura o foco para o elemento original
    if (previouslyFocusedElement && typeof previouslyFocusedElement.focus === 'function') {
      try { previouslyFocusedElement.focus(); } catch (e) {}
    }
  };

  // Alias para integração suave com chamadas existentes no app
  window.openPlanUpgradeModal = function(planKey = 'report', options = {}) {
    window.openAsaasCheckout(planKey, options);
  };

  window.selectAsaasPlan = function(planKey) {
    const raw = String(planKey || 'report').trim();
    let key = raw.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    key = key.replace(/^(plano|plano_)[_\s\-]*/, '').trim();

    if (key === 'explorer' || key === 'plano_10' || key.includes('dash')) key = 'dash';
    else if (key === 'executive' || key === 'plano_15' || key.includes('report')) key = 'report';
    else if (key === 'authority' || key === 'cotas' || key === 'cota' || key === 'enterprise' || key === 'empresarial' || key.includes('midia')) key = 'midia';
    
    if (!Object.prototype.hasOwnProperty.call(PLANS_DATA, key)) key = 'report';

    currentPlanId = key;
    hideCheckoutError();

    // Atualiza bordas dos cards e atributos aria-checked
    ['dash', 'report', 'midia'].forEach(k => {
      const card = document.getElementById('planCard' + k.charAt(0).toUpperCase() + k.slice(1));
      if (card) {
        const isCur = (k === currentPlanId);
        if (isCur) card.classList.add('active');
        else card.classList.remove('active');
        card.setAttribute('aria-checked', isCur ? 'true' : 'false');
      }
    });

    const plan = PLANS_DATA[currentPlanId];
    updateUpgradeBanner();
    updateInstallmentOptions(plan);
    updateSubmitButtonLabel();
  };

  window.setAsaasPaymentMethod = function(method) {
    currentPaymentMethod = method;
    hideCheckoutError();

    const tabPix = document.getElementById('tabPayPix');
    const tabCard = document.getElementById('tabPayCard');
    const tabBoleto = document.getElementById('tabPayBoleto');
    const cardFields = document.getElementById('asaasCardFields');

    if (tabPix) {
      tabPix.classList.toggle('active', method === 'PIX');
      tabPix.setAttribute('aria-selected', method === 'PIX' ? 'true' : 'false');
    }
    if (tabCard) {
      tabCard.classList.toggle('active', method === 'CREDIT_CARD');
      tabCard.setAttribute('aria-selected', method === 'CREDIT_CARD' ? 'true' : 'false');
    }
    if (tabBoleto) {
      tabBoleto.classList.toggle('active', method === 'BOLETO');
      tabBoleto.setAttribute('aria-selected', method === 'BOLETO' ? 'true' : 'false');
    }

    if (cardFields) {
      cardFields.style.display = method === 'CREDIT_CARD' ? 'flex' : 'none';
    }

    updateSubmitButtonLabel();
  };

  function showCheckoutError(msg) {
    const errBox = document.getElementById('asaasErrorBox');
    const errText = document.getElementById('asaasErrorText');
    if (errBox && errText) {
      errText.textContent = msg || 'Ocorreu um erro na validação dos dados.';
      errBox.classList.add('show');
      errBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      alert(msg);
    }
  }

  function hideCheckoutError() {
    const errBox = document.getElementById('asaasErrorBox');
    if (errBox) errBox.classList.remove('show');
  }

  // Submissão do Formulário de Checkout
  window.handleAsaasCheckoutSubmit = async function(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (isSubmitting) return;
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
      const cardNum = document.getElementById('asaasCardNumber')?.value.trim();
      const cardHolder = document.getElementById('asaasCardHolder')?.value.trim();
      const cardExpiry = document.getElementById('asaasCardExpiry')?.value.trim();
      const cardCvv = document.getElementById('asaasCardCvv')?.value.trim();

      if (!cardNum || cardNum.replace(/\D/g, '').length < 13) {
        return showCheckoutError('Por favor, informe o número completo do Cartão de Crédito.');
      }
      if (!cardHolder || cardHolder.length < 3) {
        return showCheckoutError('Por favor, informe o Nome impresso no Cartão.');
      }
      if (!cardExpiry || !cardExpiry.includes('/')) {
        return showCheckoutError('Por favor, informe a data de validade no formato MM/AA.');
      }

      const parts = cardExpiry.split('/');
      const m = parseInt(parts[0], 10);
      let y = parseInt(parts[1], 10);
      if (isNaN(m) || m < 1 || m > 12) {
        return showCheckoutError('Mês de validade do cartão inválido (utilize 01 a 12).');
      }
      if (!parts[1] || parts[1].trim().length < 2) {
        return showCheckoutError('Por favor, informe a validade completa do cartão (mês e ano, ex: 12/28).');
      }
      if (y < 100) y += 2000;
      const now = new Date();
      const curYear = now.getFullYear();
      const curMonth = now.getMonth() + 1;
      if (isNaN(y) || y < curYear || y > curYear + 25 || (y === curYear && m < curMonth)) {
        return showCheckoutError('Cartão de crédito com validade expirada. Verifique o mês e o ano informados.');
      }

      if (!cardCvv || cardCvv.length < 3) {
        return showCheckoutError('Por favor, informe o código de segurança (CVV).');
      }

      payload.installmentCount = parseInt(installmentsSel?.value || 12, 10);
      payload.creditCard = {
        holderName: cardHolder,
        number: cardNum,
        expiryMonth: parts[0],
        expiryYear: parts[1],
        ccv: cardCvv
      };
    }

    // Salva preferências no localStorage
    try {
      localStorage.setItem('userName', name);
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userWhatsapp', phone);
      localStorage.setItem('userCpf', cpfCnpj);
    } catch (e) {}

    // Loading State & In-Flight Lock
    isSubmitting = true;
    if (btnSubmit) btnSubmit.disabled = true;
    if (btnText) btnText.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Processando no Asaas Sandbox...';

    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timeoutId = controller ? setTimeout(() => controller.abort(), 15000) : null;

    try {
      const response = await fetch('/api/asaas-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller ? controller.signal : undefined
      });
      if (timeoutId) clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok || !data.success) {
        isSubmitting = false;
        showCheckoutError(data.message || 'Erro ao processar transação no Asaas.');
        if (btnSubmit) btnSubmit.disabled = false;
        updateSubmitButtonLabel();
        return;
      }

      // Sucesso! Limpa dados sensíveis do cartão do DOM para segurança (zero retenção)
      const cardNumEl = document.getElementById('asaasCardNumber');
      const cardCvvEl = document.getElementById('asaasCardCvv');
      if (cardNumEl) cardNumEl.value = '';
      if (cardCvvEl) cardCvvEl.value = '';

      // Transição para Tela de Sucesso
      isSubmitting = false;
      renderCheckoutSuccessScreen(data);

    } catch (err) {
      if (timeoutId) clearTimeout(timeoutId);
      isSubmitting = false;
      console.error('[Checkout Client Error]:', err);
      if (err && err.name === 'AbortError') {
        showCheckoutError('A requisição excedeu o tempo limite (15s). Verifique sua conexão e tente novamente.');
      } else {
        showCheckoutError('Falha na comunicação com o servidor de pagamento. Verifique sua conexão e tente novamente.');
      }
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
    const resultBoletoBox = document.getElementById('resultBoletoBox');

    if (form) form.style.display = 'none';
    if (resultBox) resultBox.classList.add('show');

    // Esconde todos inicialmente
    if (resultCardSuccess) resultCardSuccess.style.display = 'none';
    if (resultPixBox) resultPixBox.style.display = 'none';
    if (resultBoletoBox) resultBoletoBox.style.display = 'none';

    const payment = data.payment || {};
    const plan = data.plan || {};

    // 1. Cartão de Crédito
    if (payment.billingType === 'CREDIT_CARD') {
      if (resultCardSuccess) resultCardSuccess.style.display = 'block';
    }
    // 2. PIX
    else if (payment.billingType === 'PIX' && payment.pix) {
      if (resultPixBox) resultPixBox.style.display = 'flex';
      const pixImg = document.getElementById('asaasPixQrImage');
      const pixInput = document.getElementById('asaasPixCopyInput');
      if (pixImg && payment.pix.qrCodeImage) pixImg.src = payment.pix.qrCodeImage;
      if (pixInput && payment.pix.copyPasteKey) pixInput.value = payment.pix.copyPasteKey;
    }
    // 3. Boleto
    else if (payment.billingType === 'BOLETO') {
      if (resultBoletoBox) resultBoletoBox.style.display = 'flex';
      const boletoInput = document.getElementById('asaasBoletoLinhaInput');
      const slipLink = document.getElementById('asaasBoletoDownloadLink');
      if (boletoInput && payment.boleto) boletoInput.value = payment.boleto.identificationField || '';
      if (slipLink && payment.bankSlipUrl) {
        const url = String(payment.bankSlipUrl).trim();
        if (/^https?:\/\//i.test(url)) {
          slipLink.href = url;
        }
      }
    }

    // Preenche resumo
    const sumPlanName = document.getElementById('summaryPlanName');
    const sumPlanValue = document.getElementById('summaryPlanValue');
    const sumPaymentMethod = document.getElementById('summaryPaymentMethod');
    const sumPaymentId = document.getElementById('summaryPaymentId');

    if (sumPlanName) sumPlanName.textContent = plan.name || 'Plano Radar São José';
    if (sumPlanValue) {
      sumPlanValue.textContent = `R$ ${(plan.value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (${payment.installmentCount || 12}x de R$ ${(payment.installmentValue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })})`;
    }
    if (sumPaymentMethod) {
      sumPaymentMethod.textContent = payment.billingType === 'CREDIT_CARD' ? 'Cartão de Crédito (Aprovado)' : payment.billingType === 'PIX' ? 'PIX Dinâmico (Aguardando)' : 'Boleto Bancário (Aguardando)';
    }
    if (sumPaymentId) sumPaymentId.textContent = payment.id || 'pay_sb_confirmed';


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

  // Cópia da Linha Digitável do Boleto
  window.copyAsaasBoletoCode = function(buttonElement) {
    const input = document.getElementById('asaasBoletoLinhaInput');
    const btn = buttonElement || document.getElementById('btnCopyBoleto') || document.querySelectorAll('.asaas-btn-copy-code')[1];
    const val = input ? input.value : '';
    copyTextWithFallback(val, input, btn, 'Linha digitável do boleto copiada com sucesso!');
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
