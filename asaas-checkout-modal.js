// ============================================================================
// RADAR SÃO JOSÉ - COMPONENTE DE CHECKOUT ASAAS (PIX / CARTÃO / BOLETO)
// Planos: Pro (R$ 10,00) e Empresarial (R$ 15,00)
// ============================================================================

(function() {
  // 1. Injeta os estilos CSS dedicados e auto-contidos do modal
  const modalStyles = `
    <style id="asaasCheckoutStyles">
      #asaasCheckoutModal {
        display: none;
        position: fixed;
        inset: 0;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 99999;
        background: rgba(5, 15, 30, 0.85);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        align-items: center;
        justify-content: center;
        padding: 16px;
        box-sizing: border-box;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.25s ease, visibility 0.25s ease;
      }

      #asaasCheckoutModal.show {
        display: flex !important;
        opacity: 1;
        visibility: visible;
      }

      .asaas-modal-card {
        background: #0B2545;
        color: #ffffff;
        width: 100%;
        max-width: 480px;
        border-radius: 24px;
        border: 1px solid rgba(255, 255, 255, 0.18);
        box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 40px rgba(25, 175, 234, 0.15);
        padding: 28px 24px;
        position: relative;
        overflow: hidden;
        box-sizing: border-box;
        font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif;
        transform: translateY(15px) scale(0.98);
        transition: transform 0.25s ease;
      }

      #asaasCheckoutModal.show .asaas-modal-card {
        transform: translateY(0) scale(1);
      }

      .asaas-glow {
        position: absolute;
        top: -40px;
        right: -40px;
        width: 180px;
        height: 180px;
        background: radial-gradient(circle, rgba(25, 175, 234, 0.25) 0%, rgba(25, 175, 234, 0) 70%);
        pointer-events: none;
      }

      .asaas-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 16px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        margin-bottom: 20px;
      }

      .asaas-header-left {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .asaas-badge-icon {
        width: 42px;
        height: 42px;
        border-radius: 12px;
        background: rgba(25, 175, 234, 0.15);
        color: #19afea;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        border: 1px solid rgba(25, 175, 234, 0.3);
        flex-shrink: 0;
      }

      .asaas-title {
        font-size: 17px;
        font-weight: 800;
        color: #ffffff;
        margin: 0 0 2px 0;
        line-height: 1.2;
        letter-spacing: -0.01em;
      }

      .asaas-subtitle {
        font-size: 11px;
        font-weight: 500;
        color: rgba(255, 255, 255, 0.7);
        margin: 0;
        line-height: 1.3;
      }

      .asaas-close-btn {
        background: transparent;
        border: none;
        color: rgba(255, 255, 255, 0.5);
        cursor: pointer;
        width: 36px;
        height: 36px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        transition: all 0.2s ease;
      }

      .asaas-close-btn:hover {
        background: rgba(255, 255, 255, 0.1);
        color: #ffffff;
      }

      .asaas-plan-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        margin-bottom: 20px;
      }

      .asaas-plan-opt {
        padding: 14px;
        border-radius: 16px;
        border: 2px solid rgba(255, 255, 255, 0.12);
        background: rgba(255, 255, 255, 0.04);
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        user-select: none;
      }

      .asaas-plan-opt:hover {
        border-color: rgba(255, 255, 255, 0.3);
        background: rgba(255, 255, 255, 0.07);
      }

      .asaas-plan-opt.active {
        border-color: #19afea;
        background: rgba(25, 175, 234, 0.12);
        box-shadow: 0 0 15px rgba(25, 175, 234, 0.2);
      }

      .asaas-plan-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;
      }

      .asaas-plan-name {
        font-size: 11px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: rgba(255, 255, 255, 0.7);
      }

      .asaas-plan-opt.active .asaas-plan-name {
        color: #19afea;
      }

      .asaas-plan-dot {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        border: 2px solid rgba(255, 255, 255, 0.3);
        display: inline-block;
        transition: all 0.2s ease;
        box-sizing: border-box;
      }

      .asaas-plan-opt.active .asaas-plan-dot {
        border-color: #19afea;
        background: #19afea;
        box-shadow: 0 0 8px #19afea;
      }

      .asaas-plan-price {
        font-size: 19px;
        font-weight: 900;
        color: #ffffff;
        line-height: 1;
        margin-bottom: 3px;
      }

      .asaas-plan-desc {
        font-size: 10px;
        font-weight: 500;
        color: rgba(255, 255, 255, 0.65);
        line-height: 1.3;
      }

      .asaas-form {
        display: flex;
        flex-direction: column;
        gap: 14px;
      }

      .asaas-form-group {
        display: flex;
        flex-direction: column;
      }

      .asaas-form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }

      @media (max-width: 480px) {
        .asaas-form-row {
          grid-template-columns: 1fr;
        }
      }

      .asaas-label {
        font-size: 10.5px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: rgba(255, 255, 255, 0.75);
        margin-bottom: 6px;
        display: block;
      }

      .asaas-input {
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

      .asaas-input::placeholder {
        color: rgba(255, 255, 255, 0.35);
      }

      .asaas-input:focus {
        outline: none;
        border-color: #19afea;
        background: rgba(255, 255, 255, 0.12);
        box-shadow: 0 0 0 3px rgba(25, 175, 234, 0.2);
      }

      .asaas-btn-submit {
        width: 100%;
        padding: 14px 18px;
        border-radius: 14px;
        border: none;
        background: linear-gradient(135deg, #10b981 0%, #0d9488 100%);
        color: #ffffff;
        font-size: 12.5px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        margin-top: 4px;
        box-shadow: 0 4px 15px rgba(16, 185, 129, 0.35);
        font-family: inherit;
      }

      .asaas-btn-submit:hover:not(:disabled) {
        filter: brightness(1.1);
        transform: translateY(-1px);
        box-shadow: 0 6px 20px rgba(16, 185, 129, 0.45);
      }

      .asaas-btn-submit:active:not(:disabled) {
        transform: translateY(0);
      }

      .asaas-btn-submit:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }

      .asaas-result-box {
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        flex-direction: column;
        gap: 14px;
        text-align: center;
      }

      .asaas-success-pill {
        background: rgba(16, 185, 129, 0.2);
        border: 1px solid rgba(16, 185, 129, 0.4);
        color: #34d399;
        padding: 10px 14px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }

      .asaas-pix-card {
        background: #ffffff;
        border-radius: 16px;
        padding: 14px;
        max-width: 200px;
        margin: 0 auto;
        box-shadow: 0 10px 25px rgba(0,0,0,0.25);
      }

      .asaas-pix-img {
        width: 100%;
        height: auto;
        display: block;
        border-radius: 8px;
      }

      .asaas-pix-card-sub {
        font-size: 10px;
        font-weight: 700;
        color: #1e293b;
        margin: 8px 0 0 0;
      }

      .asaas-copy-box {
        display: flex;
        flex-direction: column;
        gap: 6px;
        text-align: left;
      }

      .asaas-copy-row {
        display: flex;
        gap: 8px;
      }

      .asaas-input-copy {
        width: 100%;
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.18);
        border-radius: 10px;
        padding: 9px 12px;
        font-size: 11px;
        font-family: monospace;
        color: rgba(255, 255, 255, 0.85);
        box-sizing: border-box;
      }

      .asaas-btn-copy {
        background: #19afea;
        color: #05192d;
        border: none;
        border-radius: 10px;
        padding: 0 16px;
        font-size: 11.5px;
        font-weight: 800;
        text-transform: uppercase;
        cursor: pointer;
        transition: all 0.2s ease;
        flex-shrink: 0;
        font-family: inherit;
      }

      .asaas-btn-copy:hover {
        background: #38bdf8;
      }

      .asaas-btn-invoice {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        width: 100%;
        padding: 12px 16px;
        background: #2563eb;
        color: #ffffff;
        font-size: 12px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        border-radius: 12px;
        text-decoration: none;
        box-sizing: border-box;
        transition: all 0.2s ease;
      }

      .asaas-btn-invoice:hover {
        background: #3b82f6;
      }

      .asaas-hidden {
        display: none !important;
      }
    </style>
  `;

  // 2. Injeta o HTML do Modal de Checkout no DOM
  const modalHTML = `
  <div id="asaasCheckoutModal" role="dialog" aria-modal="true" aria-labelledby="asaasModalTitle">
    <div class="asaas-modal-card">
      
      <!-- Glow Decorativo -->
      <div class="asaas-glow"></div>

      <!-- Header do Modal -->
      <div class="asaas-header">
        <div class="asaas-header-left">
          <div class="asaas-badge-icon">
            <i class="fa-solid fa-shield-halved"></i>
          </div>
          <div>
            <h3 id="asaasModalTitle" class="asaas-title">Checkout Seguro</h3>
            <p class="asaas-subtitle">Pagamento processado via Asaas Pagamentos</p>
          </div>
        </div>
        <button type="button" onclick="closeAsaasModal()" class="asaas-close-btn" aria-label="Fechar Modal">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <!-- SELEÇÃO DO PLANO -->
      <div class="asaas-plan-grid">
        <label id="planOptPro" class="asaas-plan-opt active">
          <input type="radio" name="checkoutPlan" value="pro" checked onchange="updateSelectedPlanUI('pro')" style="display:none;">
          <div class="asaas-plan-top">
            <span class="asaas-plan-name">Plano Pro</span>
            <span class="asaas-plan-dot"></span>
          </div>
          <div>
            <div class="asaas-plan-price">R$ 10,00</div>
            <div class="asaas-plan-desc">/mês • Acesso Completo</div>
          </div>
        </label>

        <label id="planOptEnterprise" class="asaas-plan-opt">
          <input type="radio" name="checkoutPlan" value="enterprise" onchange="updateSelectedPlanUI('enterprise')" style="display:none;">
          <div class="asaas-plan-top">
            <span class="asaas-plan-name">Empresarial</span>
            <span class="asaas-plan-dot"></span>
          </div>
          <div>
            <div class="asaas-plan-price">R$ 15,00</div>
            <div class="asaas-plan-desc">/mês • Tudo + Oráculo IA</div>
          </div>
        </label>
      </div>

      <!-- FORMULÁRIO DE DADOS DO COMPRADOR -->
      <form id="asaasPayForm" onsubmit="handleAsaasPaySubmit(event)" class="asaas-form">
        <div class="asaas-form-group">
          <label class="asaas-label" for="payName">Nome Completo *</label>
          <input type="text" id="payName" required placeholder="Seu nome ou Razão Social" class="asaas-input" />
        </div>

        <div class="asaas-form-row">
          <div class="asaas-form-group">
            <label class="asaas-label" for="payEmail">E-mail de Acesso *</label>
            <input type="email" id="payEmail" required placeholder="seu@email.com" class="asaas-input" />
          </div>
          <div class="asaas-form-group">
            <label class="asaas-label" for="payPhone">WhatsApp / Telefone *</label>
            <input type="tel" id="payPhone" required placeholder="(12) 99999-9999" class="asaas-input" />
          </div>
        </div>

        <div class="asaas-form-group">
          <label class="asaas-label" for="payCpf">CPF ou CNPJ (para Nota & Asaas)</label>
          <input type="text" id="payCpf" placeholder="000.000.000-00" class="asaas-input" />
        </div>

        <button type="submit" id="btnSubmitAsaas" class="asaas-btn-submit">
          <i class="fa-solid fa-lock"></i>
          <span id="btnSubmitAsaasText">Assinar Plano Pro (R$ 10,00)</span>
        </button>
      </form>

      <!-- RESULTADO DO PAGAMENTO (PIX QR CODE & FATURA) -->
      <div id="asaasResultBox" class="asaas-result-box asaas-hidden">
        <div class="asaas-success-pill">
          <i class="fa-solid fa-circle-check"></i>
          <span>Cobrança gerada com sucesso no Asaas!</span>
        </div>

        <!-- PIX QR Code -->
        <div id="pixContainer" class="asaas-pix-card asaas-hidden">
          <img id="pixQrImg" src="" alt="PIX QR Code" class="asaas-pix-img" />
          <p class="asaas-pix-card-sub">Escaneie com o app do seu Banco</p>
        </div>

        <!-- PIX Copia e Cola -->
        <div id="pixCopyBox" class="asaas-copy-box asaas-hidden">
          <label class="asaas-label">Chave PIX Copia e Cola:</label>
          <div class="asaas-copy-row">
            <input type="text" id="pixCopyInput" readonly class="asaas-input-copy" />
            <button type="button" onclick="copyPixCode()" class="asaas-btn-copy">
              Copiar
            </button>
          </div>
        </div>

        <!-- Botão Abrir Fatura Completa Asaas (Cartão / Boleto) -->
        <div>
          <a id="btnInvoiceLink" href="#" target="_blank" rel="noopener noreferrer" class="asaas-btn-invoice">
            <i class="fa-regular fa-credit-card"></i>
            <span>Pagar com Cartão ou Boleto no Asaas</span>
            <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 10px;"></i>
          </a>
        </div>
      </div>

    </div>
  </div>
  `;

  // Anexa os estilos e o modal ao DOM
  function initAsaasCheckout() {
    if (!document.getElementById('asaasCheckoutStyles')) {
      document.head.insertAdjacentHTML('beforeend', modalStyles);
    }
    if (!document.getElementById('asaasCheckoutModal')) {
      document.body.insertAdjacentHTML('beforeend', modalHTML);

      // Fecha ao clicar fora do card
      const modal = document.getElementById('asaasCheckoutModal');
      if (modal) {
        modal.addEventListener('click', function(e) {
          if (e.target === modal) {
            closeAsaasModal();
          }
        });
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAsaasCheckout);
  } else {
    initAsaasCheckout();
  }

  // Fecha modal com a tecla ESC
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeAsaasModal();
    }
  });

  window.currentCheckoutPlan = 'pro';

  window.openAsaasCheckout = function(planName = 'pro') {
    window.currentCheckoutPlan = planName;
    const modal = document.getElementById('asaasCheckoutModal');
    if (modal) {
      modal.classList.add('show');
    }
    updateSelectedPlanUI(planName);

    // Auto-preenche com dados salvos se houver
    try {
      const savedEmail = localStorage.getItem('userEmail');
      const savedName = localStorage.getItem('userName');
      const savedPhone = localStorage.getItem('userWhatsapp');
      if (savedEmail && document.getElementById('payEmail')) document.getElementById('payEmail').value = savedEmail;
      if (savedName && document.getElementById('payName')) document.getElementById('payName').value = savedName;
      if (savedPhone && document.getElementById('payPhone')) document.getElementById('payPhone').value = savedPhone;
    } catch (e) {}
  };

  window.closeAsaasModal = function() {
    const modal = document.getElementById('asaasCheckoutModal');
    if (modal) {
      modal.classList.remove('show');
    }
  };

  window.updateSelectedPlanUI = function(plan) {
    window.currentCheckoutPlan = plan;
    const optPro = document.getElementById('planOptPro');
    const optEnterprise = document.getElementById('planOptEnterprise');
    const btnText = document.getElementById('btnSubmitAsaasText');

    if (plan === 'pro') {
      if (optPro) optPro.classList.add('active');
      if (optEnterprise) optEnterprise.classList.remove('active');
      const radio = optPro ? optPro.querySelector('input[type="radio"]') : null;
      if (radio) radio.checked = true;
      if (btnText) btnText.innerText = "Assinar Plano Pro (R$ 10,00)";
    } else {
      if (optEnterprise) optEnterprise.classList.add('active');
      if (optPro) optPro.classList.remove('active');
      const radio = optEnterprise ? optEnterprise.querySelector('input[type="radio"]') : null;
      if (radio) radio.checked = true;
      if (btnText) btnText.innerText = "Assinar Empresarial (R$ 15,00)";
    }
  };

  window.handleAsaasPaySubmit = async function(e) {
    e.preventDefault();
    const btn = document.getElementById('btnSubmitAsaas');
    const btnText = document.getElementById('btnSubmitAsaasText');
    if (btn) btn.disabled = true;
    if (btnText) btnText.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processando no Asaas...';

    const payload = {
      name: document.getElementById('payName').value.trim(),
      email: document.getElementById('payEmail').value.trim().toLowerCase(),
      phone: document.getElementById('payPhone').value.trim(),
      cpfCnpj: document.getElementById('payCpf').value.trim(),
      plan: window.currentCheckoutPlan,
      billingType: 'UNDEFINED'
    };

    try {
      const res = await fetch('/api/asaas-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!data.success) {
        alert(data.message || 'Erro ao processar checkout no Asaas.');
        if (btn) btn.disabled = false;
        if (btnText) btnText.innerText = window.currentCheckoutPlan === 'enterprise' ? 'Assinar Empresarial (R$ 15,00)' : 'Assinar Plano Pro (R$ 10,00)';
        return;
      }

      // Exibe resultado
      const resultBox = document.getElementById('asaasResultBox');
      const pixContainer = document.getElementById('pixContainer');
      const pixQrImg = document.getElementById('pixQrImg');
      const pixCopyBox = document.getElementById('pixCopyBox');
      const pixCopyInput = document.getElementById('pixCopyInput');
      const btnInvoiceLink = document.getElementById('btnInvoiceLink');

      if (resultBox) resultBox.classList.remove('asaas-hidden');

      if (data.payment && data.payment.pix && data.payment.pix.qrCodeImage) {
        if (pixQrImg) pixQrImg.src = data.payment.pix.qrCodeImage;
        if (pixCopyInput) pixCopyInput.value = data.payment.pix.copyPasteKey;
        if (pixContainer) pixContainer.classList.remove('asaas-hidden');
        if (pixCopyBox) pixCopyBox.classList.remove('asaas-hidden');
      }

      if (data.payment && data.payment.invoiceUrl) {
        if (btnInvoiceLink) btnInvoiceLink.href = data.payment.invoiceUrl;
      }

      if (btn) btn.classList.add('asaas-hidden');

    } catch (err) {
      console.error('Checkout error:', err);
      alert('Erro de conexão ao processar pagamento. Tente novamente.');
      if (btn) btn.disabled = false;
      if (btnText) btnText.innerText = window.currentCheckoutPlan === 'enterprise' ? 'Assinar Empresarial (R$ 15,00)' : 'Assinar Plano Pro (R$ 10,00)';
    }
  };

  window.copyPixCode = function() {
    const input = document.getElementById('pixCopyInput');
    if (input) {
      input.select();
      input.setSelectionRange(0, 99999);
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(input.value).then(() => {
          alert('Código PIX Copiado para a Área de Transferência!');
        }).catch(() => {
          document.execCommand('copy');
          alert('Código PIX Copiado!');
        });
      } else {
        document.execCommand('copy');
        alert('Código PIX Copiado!');
      }
    }
  };

})();
