// ============================================================================
// RADAR SÃO JOSÉ - SISTEMA UNIFICADO DE PREVIEW, BLUR & CAIXINHA DE VENDA STICKY
// Proteção e Teaser com card flutuante sticky para:
// 1. Pesquisa Quantitativa (dynamic-charts-grid) -> Requer plano 'dash', 'report', 'midia' ou admin
// 2. Report Exclusivo (executive-report-view) -> Requer plano 'report', 'midia' ou admin
// 3. Inteligência de Mídia (midia-dashboard-content) -> Requer plano 'midia' ou admin
// ============================================================================

(() => {
  'use strict';

  function getUserPlanInfo() {
    const state = window.appState;
    const claims = state?.user?.app_metadata;
    return {
      plan: state?.entitlement?.planType || state?.plan_type || state?.profile?.plan_type || 'gratis',
      isAdminMaster: claims?.role === 'admin' || claims?.is_admin === true
    };
  }

  function isModuleUnlocked(moduleName) {
    if (window.radarSupabaseConfig?.preview === true &&
        new URLSearchParams(window.location.search).get(moduleName + 'Preview') === 'locked') return false;
    const { plan, isAdminMaster } = getUserPlanInfo();
    if (isAdminMaster) return true;
    if (moduleName === 'dashboard') {
      return ['dash', 'report', 'midia', 'plano_10', 'plano_15', 'enterprise', 'admin'].includes(plan);
    }
    if (moduleName === 'report') {
      return ['report', 'midia', 'plano_15', 'enterprise', 'admin'].includes(plan);
    }
    if (moduleName === 'midia') {
      return ['midia', 'enterprise', 'admin'].includes(plan);
    }
    return false;
  }

  function openCheckoutModal(targetPlan) {
    if (typeof window.openPlanUpgradeModal === 'function') {
      window.openPlanUpgradeModal(targetPlan);
    } else if (typeof window.openAsaasCheckout === 'function') {
      window.openAsaasCheckout(targetPlan);
    }
  }

  function createStickyNoticeHtml({ badge, title, description, bullets, priceText, targetPlan, buttonLabel }) {
    const listItems = bullets.map(b => `<li>${b}</li>`).join('');
    return `
      <div class="pesquisa-preview-sticky-wrap">
        <div class="pesquisa-preview-notice" onclick="event.stopPropagation()">
          <div class="pesquisa-preview-badge">${badge}</div>
          <div class="pesquisa-preview-lock" aria-hidden="true">&#128274;</div>
          <h2>${title}</h2>
          <p>${description}</p>
          <ul>${listItems}</ul>
          <div class="pesquisa-preview-actions">
            <div class="pesquisa-preview-guarantee" aria-live="polite">${priceText}</div>
            <button type="button" class="btn-open-plans-checkout" data-target-plan="${targetPlan}">
              <span>${buttonLabel}</span>
              <span aria-hidden="true">&rarr;</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  const planLabels = { dash: 'Dash', report: 'Report', midia: 'Mídia' };
  const priceRequests = new WeakMap();

  function updatePaywallPrice(container, targetPlan, unlocked) {
    const price = container.querySelector('.pesquisa-preview-guarantee');
    if (!price) return;
    if (unlocked) {
      priceRequests.delete(price);
      return;
    }
    if (container.closest('.hidden')) return;
    const userId = window.appState?.user?.id;
    const currentPlan = getUserPlanInfo().plan;
    const key = `${userId || 'guest'}:${currentPlan}:${targetPlan}`;
    const existing = priceRequests.get(price);
    if (existing?.key === key && Date.now() - existing.at < 60_000) return;
    const request = { key, at: Date.now() };
    priceRequests.set(price, request);

    const fullPrice = window.RadarPricing?.quotePurchase({ plan: targetPlan });
    const annualText = fullPrice
      ? `Plano ${planLabels[targetPlan]} · ${money.format(fullPrice.amountCents / 100)} à vista no Pix · acesso anual`
      : `Confira o valor do plano ${planLabels[targetPlan]}.`;
    const hasCurrentPlan = currentPlan !== 'gratis';
    price.textContent = hasCurrentPlan ? 'Consultando o crédito do seu plano…' : annualText;
    if (!userId || !window.getRadarPaywallQuote) {
      if (hasCurrentPlan) price.textContent = 'A equipe do Radar precisa conferir o crédito do seu plano.';
      return;
    }

    window.getRadarPaywallQuote(targetPlan, userId).then(quote => {
      if (priceRequests.get(price) !== request || window.appState?.user?.id !== userId) return;
      if (quote?.kind === 'upgrade') {
        price.textContent = `Estimativa no Pix: ${money.format(quote.amountCents / 100)}. Inclui ${money.format(quote.creditCents / 100)} de crédito. Nova vigência de 12 meses após confirmação.${quote.payable ? '' : ' Pagamento após conciliação.'}`;
      } else if (quote?.kind === 'purchase') {
        price.textContent = `Plano ${planLabels[targetPlan]} · ${money.format(quote.amountCents / 100)} à vista no Pix · acesso anual`;
      } else {
        price.textContent = hasCurrentPlan ? 'A equipe do Radar precisa conferir o crédito do seu plano.' : annualText;
      }
    }).catch(() => {
      if (priceRequests.get(price) !== request) return;
      price.textContent = hasCurrentPlan ? 'A equipe do Radar precisa conferir o crédito do seu plano.' : annualText;
    });
  }

  function applyRasterPaywall({ rootId, moduleName, plan, sampleHeight, pages, offer }) {
    const root = document.getElementById(rootId);
    if (!root) return;

    const unlocked = isModuleUnlocked(moduleName);
    const id = moduleName + '-raster-preview';
    root.classList.toggle('raster-dashboard-restricted', !unlocked);
    let preview = document.getElementById(id);
    if (unlocked) {
      preview?.remove();
      return;
    }

    if (!preview) {
      const image = (name, width, height, alt = '') =>
        `<img src="/web-media/dashboard-preview/${name}.webp" width="${width}" height="${height}" loading="lazy" decoding="async" alt="${alt}">`;
      const article = (name, height, index) =>
        `<div class="raster-dashboard-page"${moduleName === 'dashboard' ? ` data-preview-section="secao-bloco-${index + 2}"` : ''}>${image(name, 460, height)}</div>`;
      preview = document.createElement('div');
      preview.id = id;
      preview.className = 'raster-dashboard-preview';
      preview.innerHTML = `
        <p class="raster-dashboard-sample-label">Prévia do painel com dados simulados</p>
        <div class="raster-dashboard-page" data-preview-section="secao-bloco-1">
          ${image(plan + '-amostra', 900, sampleHeight, 'Exemplo de visualização do painel com dados simulados')}
        </div>
        ${createStickyNoticeHtml({ ...offer, targetPlan: plan })}
        <div class="raster-dashboard-pages" aria-hidden="true" inert>
          ${pages.map(([name, height], index) => article(name, height, index)).join('')}
        </div>`;
      root.after(preview);
      preview.querySelector('.btn-open-plans-checkout').onclick = () => openCheckoutModal(plan);
    }
    updatePaywallPrice(preview, plan, false);
  }

  function applyPesquisaPreview() {
    applyRasterPaywall({
      rootId: 'dynamic-charts-grid', moduleName: 'dashboard', plan: 'dash', sampleHeight: 807,
      pages: [
        ['dash-01', 235], ['dash-02', 791], ['dash-03', 754], ['dash-04', 417], ['dash-05', 263],
        ['dash-06', 247], ['dash-07', 297], ['dash-08', 238], ['dash-09', 191]
      ],
      offer: {
        badge: 'PESQUISA QUANTITATIVA',
        title: 'Explore a pesquisa completa de São José',
        description: 'Descubra como as respostas variam por renda, idade e região da cidade.',
        bullets: ['10 blocos temáticos e 30 gráficos', 'Filtros para cruzar perfis e recortes'],
        priceText: 'Acesso anual ao Plano Dash',
        buttonLabel: 'Ver Plano Dash'
      }
    });
  }

  // ==========================================
  // 2. REPORT EXCLUSIVO (EXECUTIVE REPORT)
  // ==========================================
  function applyReportPreview() {
    const root = document.getElementById('executive-report-view');
    if (!root) return;
    const lastFreePage = root.querySelector(':scope > #rep-tela-014');
    if (!lastFreePage) return;

    const unlocked = isModuleUnlocked('report');
    if (!unlocked) window.clearPaidReport?.();
    root.classList.toggle('report-preview-unlocked', unlocked);
    root.querySelectorAll(':scope > #rep-tela-014 ~ article').forEach(article => {
      const show = unlocked && !article.hasAttribute('data-report-placeholder');
      article.inert = !show;
      if (show) article.removeAttribute('aria-hidden');
      else article.setAttribute('aria-hidden', 'true');
    });
    const existingNotice = document.getElementById('report-paywall-overlay');
    if (existingNotice) {
      updatePaywallPrice(existingNotice, 'report', unlocked);
      return;
    }

    const template = document.createElement('template');
    template.innerHTML = createStickyNoticeHtml({
      badge: 'RELATÓRIO EXECUTIVO · CONTEÚDO EXCLUSIVO',
      title: 'Relatório Executivo Completo',
      description: 'Explore o comportamento dos moradores de São José dos Campos e descubra oportunidades para o seu negócio.',
      bullets: [
        '8 capítulos com análises aprofundadas',
        'Pesquisa com 477 moradores de São José dos Campos',
        'Consultor de IA para explorar os resultados'
      ],
      priceText: 'Confira o valor para a sua conta no checkout',
      targetPlan: 'report',
      buttonLabel: 'Ver Plano Report'
    }).trim();
    const notice = template.content.firstElementChild;
    notice.id = 'report-paywall-overlay';
    lastFreePage.after(notice);
    updatePaywallPrice(notice, 'report', unlocked);
    notice.querySelector('.btn-open-plans-checkout').onclick = () => {
      const currentPlan = window.appState?.entitlement?.planType || window.appState?.plan_type;
      if (['dash', 'plano_10'].includes(currentPlan) && typeof window.openPlanUpgradeModal === 'function') {
        window.openPlanUpgradeModal('report', { isUpgrade: true, fromPlan: 'dash' });
      } else {
        openCheckoutModal('report');
      }
    };
  }

  // ==========================================
  // 3. INTELIGÊNCIA DE MÍDIA (MIDIA DASHBOARD)
  // ==========================================
  function applyMidiaPreview() {
    applyRasterPaywall({
      rootId: 'midia-dashboard-content', moduleName: 'midia', plan: 'midia', sampleHeight: 116,
      pages: [
        ['midia-02', 192], ['midia-03', 322], ['midia-04', 178], ['midia-05', 215],
        ['midia-06', 262], ['midia-07', 229], ['midia-09', 192], ['midia-10', 453]
      ],
      offer: {
        badge: 'INTELIGÊNCIA DE MÍDIA',
        title: 'Veja o que movimenta a conversa na cidade',
        description: 'Acompanhe veículos locais, temas dominantes e a reação do público.',
        bullets: ['Análise por canal, tema e sentimento', '3 licenças para sua equipe'],
        priceText: 'Acesso anual ao Plano Mídia',
        buttonLabel: 'Ver Plano Mídia'
      }
    });
  }

  function updateAllRadarPreviews() {
    applyPesquisaPreview();
    applyReportPreview();
    applyMidiaPreview();
  }

  window.updateRadarPreviews = updateAllRadarPreviews;
  window.radarCanLoadModule = isModuleUnlocked;

  function init() {
    // 1. Observer no dynamic-charts-grid (re-render dos filtros)
    const dashRoot = document.getElementById('dynamic-charts-grid');
    if (dashRoot) {
      new MutationObserver(() => applyPesquisaPreview()).observe(dashRoot, { childList: true });
    }

    // 2. Observer no executive-report-view
    const reportRoot = document.getElementById('executive-report-view');
    if (reportRoot) {
      new MutationObserver(() => applyReportPreview()).observe(reportRoot, { childList: true });
    }

    // 3. Observer no midia-dashboard-content
    const midiaRoot = document.getElementById('midia-dashboard-content');
    if (midiaRoot) {
      new MutationObserver(() => applyMidiaPreview()).observe(midiaRoot, { childList: true });
    }

    // Navegação suave pelo menu
    document.addEventListener('click', event => {
      const link = event.target.closest('button[onclick*="scrollToSection"], a[href*="#secao-bloco-"]');
      if (!link) return;
      const match = (link.getAttribute('onclick') || link.getAttribute('href') || '').match(/secao-bloco-\d+/);
      const target = match && document.querySelector('#dashboard-raster-preview [data-preview-section="' + match[0] + '"]');
      if (!target) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, true);

    updateAllRadarPreviews();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
