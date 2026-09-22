// ============================================================================
// RADAR SÃO JOSÉ - COMPONENTE DE CHECKOUT ASAAS (PIX / CARTÃO / BOLETO)
// Planos: Pro (R$ 10,00) e Empresarial (R$ 15,00)
// ============================================================================

(function() {
  // Injeta o HTML do Modal de Checkout no DOM
  const modalHTML = `
  <div id="asaasCheckoutModal" class="fixed inset-0 z-50 hidden items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md transition-all duration-300">
    <div class="relative w-full max-w-lg bg-[#0B2545] text-white rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8 overflow-hidden">
      
      <!-- Glow Decorativo -->
      <div class="absolute -top-10 -right-10 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Header do Modal -->
      <div class="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-lg font-black border border-cyan-500/30">
            <i class="fa-solid fa-shield-halved"></i>
          </div>
          <div>
            <h3 class="text-base sm:text-lg font-black text-white tracking-tight">Checkout Seguro</h3>
            <p class="text-[11px] text-slate-300 font-semibold">Pagamento processado via Asaas Pagamentos</p>
          </div>
        </div>
        <button onclick="closeAsaasModal()" class="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors">
          <i class="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>

      <!-- SELEÇÃO DO PLANO -->
      <div class="grid grid-cols-2 gap-3 mb-5">
        <label id="planOptPro" class="p-3.5 rounded-2xl border-2 border-cyan-400 bg-cyan-950/50 cursor-pointer transition-all flex flex-col justify-between">
          <input type="radio" name="checkoutPlan" value="pro" checked onchange="updateSelectedPlanUI('pro')" class="sr-only">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-cyan-300">Plano Pro</span>
            <span class="w-3.5 h-3.5 rounded-full bg-cyan-400"></span>
          </div>
          <div class="mt-2">
            <span class="text-xl font-black text-white">R$ 10,00</span>
            <span class="text-[10px] text-slate-300 block">/mês • Acesso Completo</span>
          </div>
        </label>

        <label id="planOptEnterprise" class="p-3.5 rounded-2xl border-2 border-white/10 bg-white/5 hover:border-white/30 cursor-pointer transition-all flex flex-col justify-between">
          <input type="radio" name="checkoutPlan" value="enterprise" onchange="updateSelectedPlanUI('enterprise')" class="sr-only">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-300">Empresarial</span>
            <span class="w-3.5 h-3.5 rounded-full border border-white/40"></span>
          </div>
          <div class="mt-2">
            <span class="text-xl font-black text-white">R$ 15,00</span>
            <span class="text-[10px] text-slate-300 block">/mês • Tudo + Oráculo IA</span>
          </div>
        </label>
      </div>

      <!-- FORMULÁRIO DE DADOS DO COMPRADOR -->
      <form id="asaasPayForm" onsubmit="handleAsaasPaySubmit(event)" class="space-y-4">
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Nome Completo *</label>
          <input type="text" id="payName" required placeholder="Seu nome ou Razão Social" class="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">E-mail de Acesso *</label>
            <input type="email" id="payEmail" required placeholder="seu@email.com" class="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">WhatsApp / Telefone *</label>
            <input type="tel" id="payPhone" required placeholder="(12) 99999-9999" class="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">CPF ou CNPJ (para Nota & Asaas)</label>
          <input type="text" id="payCpf" placeholder="000.000.000-00" class="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400" />
        </div>

        <button type="submit" id="btnSubmitAsaas" class="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 mt-2">
          <i class="fa-solid fa-lock text-sm"></i>
          <span id="btnSubmitAsaasText">Gerar Pagamento Seguro</span>
        </button>
      </form>

      <!-- RESULTADO DO PAGAMENTO (PIX QR CODE & FATURA) -->
      <div id="asaasResultBox" class="hidden space-y-4 pt-4 border-t border-white/10 text-center">
        <div class="p-3 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
          <i class="fa-solid fa-circle-check text-base"></i>
          <span>Cobrança gerada com sucesso no Asaas!</span>
        </div>

        <!-- PIX QR Code -->
        <div id="pixContainer" class="hidden p-4 bg-white rounded-2xl max-w-[220px] mx-auto shadow-md">
          <img id="pixQrImg" src="" alt="PIX QR Code" class="w-full h-auto object-contain mx-auto" />
          <p class="text-[10px] text-slate-700 font-bold mt-2">Escaneie com o app do seu Banco</p>
        </div>

        <!-- PIX Copia e Cola -->
        <div id="pixCopyBox" class="hidden space-y-2 text-left">
          <label class="block text-[11px] font-bold text-slate-300 uppercase tracking-wider">Chave PIX Copia e Cola:</label>
          <div class="flex gap-2">
            <input type="text" id="pixCopyInput" readonly class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-xs font-mono text-slate-200 select-all" />
            <button type="button" onclick="copyPixCode()" class="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase rounded-xl shrink-0 transition-colors">
              Copiar
            </button>
          </div>
        </div>

        <!-- Botão Abrir Fatura Completa Asaas (Cartão / Boleto) -->
        <div class="pt-2">
          <a id="btnInvoiceLink" href="#" target="_blank" class="inline-flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md">
            <i class="fa-regular fa-credit-card"></i>
            <span>Pagar com Cartão ou Boleto no Asaas</span>
            <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
          </a>
        </div>
      </div>

    </div>
  </div>
  `;

  // Anexa ao body quando o documento carregar
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => document.body.insertAdjacentHTML('beforeend', modalHTML));
  } else {
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }

  window.currentCheckoutPlan = 'pro';

  window.openAsaasCheckout = function(planName = 'pro') {
    window.currentCheckoutPlan = planName;
    const modal = document.getElementById('asaasCheckoutModal');
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }
    updateSelectedPlanUI(planName);

    // Auto-preenche com dados salvos se houver
    const savedEmail = localStorage.getItem('userEmail');
    const savedName = localStorage.getItem('userName');
    const savedPhone = localStorage.getItem('userWhatsapp');
    if (savedEmail && document.getElementById('payEmail')) document.getElementById('payEmail').value = savedEmail;
    if (savedName && document.getElementById('payName')) document.getElementById('payName').value = savedName;
    if (savedPhone && document.getElementById('payPhone')) document.getElementById('payPhone').value = savedPhone;
  };

  window.closeAsaasModal = function() {
    const modal = document.getElementById('asaasCheckoutModal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  };

  window.updateSelectedPlanUI = function(plan) {
    window.currentCheckoutPlan = plan;
    const optPro = document.getElementById('planOptPro');
    const optEnterprise = document.getElementById('planOptEnterprise');
    const btnText = document.getElementById('btnSubmitAsaasText');

    if (plan === 'pro') {
      if (optPro) optPro.className = "p-3.5 rounded-2xl border-2 border-cyan-400 bg-cyan-950/50 cursor-pointer transition-all flex flex-col justify-between";
      if (optEnterprise) optEnterprise.className = "p-3.5 rounded-2xl border-2 border-white/10 bg-white/5 hover:border-white/30 cursor-pointer transition-all flex flex-col justify-between";
      if (btnText) btnText.innerText = "Assinar Plano Pro (R$ 10,00)";
    } else {
      if (optEnterprise) optEnterprise.className = "p-3.5 rounded-2xl border-2 border-cyan-400 bg-cyan-950/50 cursor-pointer transition-all flex flex-col justify-between";
      if (optPro) optPro.className = "p-3.5 rounded-2xl border-2 border-white/10 bg-white/5 hover:border-white/30 cursor-pointer transition-all flex flex-col justify-between";
      if (btnText) btnText.innerText = "Assinar Empresarial (R$ 15,00)";
    }
  };

  window.handleAsaasPaySubmit = async function(e) {
    e.preventDefault();
    const btn = document.getElementById('btnSubmitAsaas');
    const btnText = document.getElementById('btnSubmitAsaasText');
    btn.disabled = true;
    btnText.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processando no Asaas...';

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
        btn.disabled = false;
        btnText.innerText = 'Tentar Novamente';
        return;
      }

      // Exibe resultado
      const resultBox = document.getElementById('asaasResultBox');
      const pixContainer = document.getElementById('pixContainer');
      const pixQrImg = document.getElementById('pixQrImg');
      const pixCopyBox = document.getElementById('pixCopyBox');
      const pixCopyInput = document.getElementById('pixCopyInput');
      const btnInvoiceLink = document.getElementById('btnInvoiceLink');

      resultBox.classList.remove('hidden');

      if (data.payment.pix && data.payment.pix.qrCodeImage) {
        pixQrImg.src = data.payment.pix.qrCodeImage;
        pixCopyInput.value = data.payment.pix.copyPasteKey;
        pixContainer.classList.remove('hidden');
        pixCopyBox.classList.remove('hidden');
      }

      if (data.payment.invoiceUrl) {
        btnInvoiceLink.href = data.payment.invoiceUrl;
      }

      btn.classList.add('hidden');

    } catch (err) {
      console.error('Checkout error:', err);
      alert('Erro de conexão ao processar pagamento. Tente novamente.');
      btn.disabled = false;
      btnText.innerText = 'Tentar Novamente';
    }
  };

  window.copyPixCode = function() {
    const input = document.getElementById('pixCopyInput');
    input.select();
    document.execCommand('copy');
    alert('Código PIX Copiado para a Área de Transferência!');
  };

})();
