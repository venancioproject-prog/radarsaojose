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

  function attachEvents(container, targetPlan) {
    const btn = container.querySelector('.btn-open-plans-checkout');
    if (btn) {
      btn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        openCheckoutModal(targetPlan);
      };
    }
    container.onclick = (e) => {
      if (container.classList.contains('is-unlocked')) return;
      if (e.target.closest('button, a, input, select, textarea')) return;
      openCheckoutModal(targetPlan);
    };
  }

  function setContainerUnlocked(container, unlocked) {
    if (!container) return;
    container.classList.toggle('is-unlocked', unlocked);
    const targetPlan = container.querySelector('[data-target-plan]')?.dataset.targetPlan;
    if (targetPlan) updatePaywallPrice(container, targetPlan, unlocked);
    const content = container.querySelector('.pesquisa-preview-content');
    if (content) {
      content.inert = !unlocked;
      if (unlocked) {
        content.removeAttribute('aria-hidden');
      } else {
        content.setAttribute('aria-hidden', 'true');
      }
    }
  }

  // ==========================================
  // 1. PESQUISA QUANTITATIVA (DASHBOARD)
  // ==========================================
  function applyPesquisaPreview() {
    const root = document.getElementById('dynamic-charts-grid');
    if (!root) return;
    const existing = root.querySelector('.pesquisa-preview-container');
    const unlocked = isModuleUnlocked('dashboard');
    const block = document.getElementById('secao-bloco-2');

    if (existing) {
      setContainerUnlocked(existing, unlocked);
      return;
    }

    if (!block) return;
    const grid = block.lastElementChild;
    if (!grid || grid.children.length < 3) return;

    const region = document.createElement('div');
    region.className = 'pesquisa-preview-container pesquisa-preview';

    const content = document.createElement('div');
    content.className = 'pesquisa-preview-content';

    // Mantém os primeiros 3 cards abertos como teaser gratuito
    const remaining = grid.cloneNode(false);
    remaining.removeAttribute('id');
    while (grid.children.length > 3) {
      remaining.appendChild(grid.children[3]);
    }
    if (remaining.children.length) {
      content.appendChild(remaining);
    }

    let sibling = block.nextElementSibling;
    while (sibling) {
      const next = sibling.nextElementSibling;
      content.appendChild(sibling);
      sibling = next;
    }

    region.innerHTML = createStickyNoticeHtml({
      badge: 'CONTEÚDO EXCLUSIVO · PESQUISA QUANTITATIVA',
      title: 'Você já viu o cenário.<br>Agora descubra as oportunidades.',
      description: 'O que falta na cidade? Onde estão as demandas? Como os públicos se diferenciam? Continue a pesquisa e transforme essas respostas em decisões para o seu negócio.',
      bullets: [
        'Explore todos os 10 blocos e 30 gráficos da pesquisa quantitativa',
        'Cruze perfis e descubra demandas por renda, idade e região de SJC',
        'Amostra completa e auditada com 477 respondentes reais de SJC'
      ],
      priceText: 'Acesso anual ao Plano Dash',
      targetPlan: 'dash',
      buttonLabel: 'Ver Planos & Desbloquear Acesso'
    });

    region.appendChild(content);
    root.appendChild(region);

    attachEvents(region, 'dash');
    setContainerUnlocked(region, unlocked);
  }

  // ==========================================
  // 2. REPORT EXCLUSIVO (EXECUTIVE REPORT)
  // ==========================================
  function applyReportPreview() {
    const root = document.getElementById('executive-report-view');
    if (!root) return;
    const articles = Array.from(root.querySelectorAll(':scope > article'));
    if (articles.length < 3) return;

    const unlocked = isModuleUnlocked('report');
    if (!unlocked) window.clearPaidReport?.();
    root.classList.toggle('report-preview-unlocked', unlocked);
    articles.slice(2).forEach(article => {
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
    articles[1].after(notice);
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
    const root = document.getElementById('midia-dashboard-content');
    if (!root) return;
    const existing = root.querySelector('.midia-preview-container');
    const unlocked = isModuleUnlocked('midia');
    const restricted = !unlocked && window.radarSupabaseConfig?.preview !== true;
    root.classList.toggle('midia-preview-restricted', restricted);
    if (restricted) return;

    if (existing) {
      setContainerUnlocked(existing, unlocked);
      return;
    }

    const children = Array.from(root.children);
    if (children.length < 3) return;

    const region = document.createElement('div');
    region.className = 'pesquisa-preview-container midia-preview-container';

    const content = document.createElement('div');
    content.className = 'pesquisa-preview-content';

    // Mantém os 2 primeiros blocos abertos (Mini-cards veículos + 6 KPIs)
    const lockedElements = children.slice(2);
    lockedElements.forEach(el => content.appendChild(el));

    region.innerHTML = createStickyNoticeHtml({
      badge: 'INTELIGÊNCIA DE MÍDIA · CONTEÚDO EXCLUSIVO',
      title: 'Monitore a Opinião Pública & Notícias.<br>Acesse a Inteligência de Mídia.',
      description: 'Análise profunda de 7.542 postagens dos 10 veículos de comunicação de São José dos Campos, sentimento da população, temas dominantes e influenciadores.',
      bullets: [
        '7.542 postagens monitoradas e categorizadas por tema e tom',
        'Mapeamento detalhado de influenciadores locais e engajamento',
        '3 licenças corporativas para compartilhamento em equipe'
      ],
      priceText: 'Acesso anual ao Plano Mídia',
      targetPlan: 'midia',
      buttonLabel: 'Desbloquear Inteligência de Mídia'
    });

    region.appendChild(content);
    root.appendChild(region);

    attachEvents(region, 'midia');
    setContainerUnlocked(region, unlocked);
  }

  // ==========================================
  // ATUALIZAÇÃO GLOBAL & CONTROLES PÚBLICOS
  // ==========================================
  function updateAllRadarPreviews() {
    applyPesquisaPreview();
    applyReportPreview();
    applyMidiaPreview();

    const dashEl = document.querySelector('#dynamic-charts-grid .pesquisa-preview-container');
    if (dashEl) setContainerUnlocked(dashEl, isModuleUnlocked('dashboard'));

    const midiaEl = document.querySelector('#midia-dashboard-content .midia-preview-container');
    if (midiaEl) setContainerUnlocked(midiaEl, isModuleUnlocked('midia'));
  }

  window.updateRadarPreviews = updateAllRadarPreviews;
  window.radarCanLoadModule = isModuleUnlocked;

  window.unlockPesquisaPreview = function() {
    const preview = document.querySelector('#dynamic-charts-grid .pesquisa-preview-container');
    if (preview) setContainerUnlocked(preview, true);
  };
  window.lockPesquisaPreview = function() {
    const preview = document.querySelector('#dynamic-charts-grid .pesquisa-preview-container');
    if (preview) setContainerUnlocked(preview, false);
  };

  window.unlockMidiaPreview = function() {
    const preview = document.querySelector('#midia-dashboard-content .midia-preview-container');
    if (preview) setContainerUnlocked(preview, true);
  };
  window.lockMidiaPreview = function() {
    const preview = document.querySelector('#midia-dashboard-content .midia-preview-container');
    if (preview) setContainerUnlocked(preview, false);
  };

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
      const target = match && document.getElementById(match[0]);
      const region = dashRoot?.querySelector('.pesquisa-preview-container:not(.is-unlocked)');
      if (!target || !region || !region.querySelector('.pesquisa-preview-content')?.contains(target)) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      region.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, true);

    updateAllRadarPreviews();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
