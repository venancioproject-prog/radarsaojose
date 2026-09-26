/**
 * swotCanvas.js
 * Interactive SWOT Canvas component for Radar São José.
 * Miro-style drag-and-drop cards across 4 quadrants.
 * Pure vanilla JS — zero dependencies.
 */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────
   * Constants
   * ───────────────────────────────────────────── */

  const QUADRANTS = [
    {
      key: 'forcas',
      label: 'Forças',
      icon: '💪',
      colorClass: 'swot-q--green',
      headerBg: '#16a34a',
      badgeBg: '#bbf7d0',
      badgeText: '#14532d',
    },
    {
      key: 'fraquezas',
      label: 'Fraquezas',
      icon: '⚠️',
      colorClass: 'swot-q--amber',
      headerBg: '#d97706',
      badgeBg: '#fef3c7',
      badgeText: '#78350f',
    },
    {
      key: 'oportunidades',
      label: 'Oportunidades',
      icon: '🚀',
      colorClass: 'swot-q--cyan',
      headerBg: '#0891b2',
      badgeBg: '#cffafe',
      badgeText: '#164e63',
    },
    {
      key: 'ameacas',
      label: 'Ameaças',
      icon: '🔥',
      colorClass: 'swot-q--rose',
      headerBg: '#e11d48',
      badgeBg: '#ffe4e6',
      badgeText: '#881337',
    },
  ];

  const DEFAULT_CARDS = {
    forcas: [
      'Pesquisa própria de SJC (722 entrevistas)',
      'Produto digital com custo marginal de distribuição nulo',
      'Dados acessíveis para múltiplos públicos (empresas, estudantes, instituições)',
      'PLG reduz barreira inicial de entrada e gera experimentação',
      'Atendimento próximo, ágil e consultivo dos fundadores',
      'Equipe multidisciplinar complementar (pesquisa, tecnologia e growth)',
      'Conteúdo local cria autoridade territorial contínua',
      'Possibilidade de combinar assinatura SaaS e projetos customizados',
      'Dados públicos e próprios atualizados continuamente',
      'Dashboard interativo facilita comunicação executiva de achados',
      'Cobertura granular por macrorregiões e 19 bairros de SJC',
      'Capacidade de atender empresas nacionais que entram em SJC',
    ],
    fraquezas: [
      'Marca em fase inicial de pré-lançamento e tração comercial',
      'Base pagante inicial pequena em processo de validação',
      'Dependência direta da dedicação e tempo dos dois fundadores',
      'Orçamento de mídia e marketing inicial enxuto',
      'Necessidade de comprovar disposição a pagar em escala',
      'Custos de APIs de inteligência artificial podem variar com o uso',
      'Dados de pesquisa primária precisam de atualização periódica',
      'Baixa capacidade simultânea para grandes projetos consultivos',
      'Processo comercial ativo ainda em ciclo de aprendizado',
      'Risco de confusão de posicionamento (SaaS vs. consultoria vs. instituto)',
      'Necessidade de governança estrita para dados sensíveis e LGPD',
      'Capital de giro relevante necessário até o ponto de equilíbrio',
    ],
    oportunidades: [
      'Expansão de empresas e franquias nacionais para SJC',
      'Demanda contínua do mercado imobiliário e incorporadoras',
      'Licenças acadêmicas para estudantes e universidades locais',
      'Contratos institucionais com poder público e secretarias',
      'Produtos de inteligência para mandatos e comunicação regional',
      'Parcerias com universidades locais (UNIFESP, ITA, Univap, Fatec)',
      'Parcerias com associações comerciais e empresariais (ACI, Ciesp, Sebrae)',
      'Licenciamento para agências de publicidade e consultorias',
      'Clipping territorial e monitoramento temático automatizado',
      'Pesquisas de campo personalizadas com tickets elevados (R$ 20k-50k)',
      'Replicação do modelo para outras cidades do Vale do Paraíba',
      'Estratégia de SEO local e conteúdo territorial como canal de aquisição',
    ],
    ameacas: [
      'Concorrentes nacionais de grande porte e capital intensivo',
      'Institutos locais tradicionais com relacionamento comercial histórico',
      'Ferramentas públicas e gratuitas de dados abertos (IBGE, SIDRA, Google)',
      'Cópias superficiais do produto por agentes locais',
      'Mudanças tributárias ou regulatórias no Simples Nacional',
      'Oscilação econômica e adiamento de investimentos corporativos',
      'Baixa taxa de resposta em novas ondas de pesquisa amostral',
      'Dependência de plataformas e infraestrutura de terceiros (Cloud/APIs)',
      'Incidentes de segurança cibernética ou questionamentos de LGPD',
      'Custo crescente de aquisição de clientes (CAC) em canais digitais',
      'Concessão excessiva de descontos na largada comprometendo margem',
      'Demandas com viés político que exijam extremo cuidado reputacional',
    ],
  };

  /* ─────────────────────────────────────────────
   * UUID helper
   * ───────────────────────────────────────────── */

  function generateId() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    // Fallback for older environments
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0;
      var v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  /* ─────────────────────────────────────────────
   * State helpers
   * ───────────────────────────────────────────── */

  function ensureState() {
    if (typeof window.currentPlanState === 'undefined') {
      window.currentPlanState = {};
    }
    if (!Array.isArray(window.currentPlanState.swotCards)) {
      window.currentPlanState.swotCards = [];
    }
  }

  function getQuadrantMeta(key) {
    return QUADRANTS.find(function (q) { return q.key === key; }) || QUADRANTS[0];
  }

  /* ─────────────────────────────────────────────
   * Broadcast / Auto-save
   * ───────────────────────────────────────────── */

  function broadcastSwot() {
    if (window.PlanRealtimeCollab && typeof PlanRealtimeCollab.broadcastUpdate === 'function') {
      PlanRealtimeCollab.broadcastUpdate({
        type: 'swot',
        payload: window.currentPlanState.swotCards,
      });
    }
    if (typeof window.triggerAutoSave === 'function') {
      window.triggerAutoSave();
    }
  }

  /* ─────────────────────────────────────────────
   * Styles injection
   * ───────────────────────────────────────────── */

  function injectStyles() {
    const STYLE_ID = 'swot-canvas-styles';
    if (document.getElementById(STYLE_ID)) return;

    const css = `
/* ── SWOT Canvas ── */
.swot-canvas {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 12px;
  width: 100%;
  min-height: 520px;
  box-sizing: border-box;
  font-family: inherit;
}

/* Quadrant panel */
.swot-quadrant {
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  overflow: hidden;
  border: 1.5px solid rgba(0,0,0,0.10);
  background: #fafafa;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  transition: box-shadow 0.2s;
}
.swot-quadrant.drag-over {
  box-shadow: 0 0 0 3px rgba(99,102,241,0.5), 0 4px 16px rgba(0,0,0,0.10);
}

/* Quadrant header */
.swot-q-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  color: #fff;
  font-weight: 700;
  font-size: 0.92rem;
  letter-spacing: 0.02em;
  user-select: none;
  flex-shrink: 0;
}
.swot-q-header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}
.swot-q-label-icon {
  font-size: 1.1em;
}
.swot-q-count-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  border-radius: 99px;
  font-size: 0.78rem;
  font-weight: 700;
  padding: 0 6px;
}
.swot-add-btn {
  background: rgba(255,255,255,0.22);
  border: 1.5px solid rgba(255,255,255,0.55);
  color: #fff;
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 0.80rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: background 0.15s, border-color 0.15s;
  white-space: nowrap;
}
.swot-add-btn:hover {
  background: rgba(255,255,255,0.36);
  border-color: rgba(255,255,255,0.80);
}

/* Cards container */
.swot-cards-container {
  flex: 1;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  min-height: 60px;
}
.swot-cards-container::-webkit-scrollbar {
  width: 5px;
}
.swot-cards-container::-webkit-scrollbar-track {
  background: transparent;
}
.swot-cards-container::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,0.15);
  border-radius: 99px;
}

/* Card */
.swot-card {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  background: #fff;
  border: 1px solid rgba(0,0,0,0.10);
  border-radius: 7px;
  padding: 8px 8px 8px 4px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  transition: box-shadow 0.15s, opacity 0.15s, transform 0.15s;
  cursor: default;
  position: relative;
}
.swot-card:hover {
  box-shadow: 0 3px 10px rgba(0,0,0,0.11);
}
.swot-card.dragging {
  opacity: 0.45;
  transform: scale(0.97);
}

/* Drag handle */
.swot-drag-handle {
  flex-shrink: 0;
  color: #aaa;
  font-size: 1.1rem;
  cursor: grab;
  line-height: 1;
  padding: 2px 2px 0 2px;
  user-select: none;
  touch-action: none;
}
.swot-drag-handle:active {
  cursor: grabbing;
}

/* Card text */
.swot-card-text {
  flex: 1;
  min-width: 0;
  font-size: 0.85rem;
  line-height: 1.45;
  color: #1e293b;
  outline: none;
  word-break: break-word;
  white-space: pre-wrap;
  border-radius: 3px;
  padding: 1px 2px;
  transition: background 0.15s;
}
.swot-card-text:focus {
  background: #f1f5f9;
  box-shadow: 0 0 0 2px rgba(99,102,241,0.25);
}
.swot-card-text:empty:before {
  content: attr(data-placeholder);
  color: #94a3b8;
  pointer-events: none;
}

/* Delete button */
.swot-delete-btn {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: #94a3b8;
  font-size: 1rem;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, color 0.15s;
  padding: 0;
  margin-top: 1px;
  opacity: 0;
}
.swot-card:hover .swot-delete-btn {
  opacity: 1;
}
.swot-delete-btn:hover {
  background: #fee2e2;
  color: #dc2626;
}

/* Empty state */
.swot-empty-hint {
  text-align: center;
  color: #c0c8d4;
  font-size: 0.80rem;
  padding: 14px 8px;
  pointer-events: none;
  user-select: none;
  display: none;
}
.swot-cards-container:empty + .swot-empty-hint,
.swot-cards-container.is-empty + .swot-empty-hint {
  display: block;
}

/* Responsive: stack on small screens */
@media (max-width: 600px) {
  .swot-canvas {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(4, auto);
  }
}
    `;

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = css;
    document.head.appendChild(style);
  }

  /* ─────────────────────────────────────────────
   * Drag state (module-level)
   * ───────────────────────────────────────────── */

  var _dragCardId = null;

  /* ─────────────────────────────────────────────
   * Card DOM factory
   * ───────────────────────────────────────────── */

  /**
   * Build and return a card DOM element.
   * @param {{ id: string, quadrant: string, text: string }} card
   * @returns {HTMLElement}
   */
  function buildCardElement(card) {
    const article = document.createElement('article');
    article.className = 'swot-card';
    article.setAttribute('draggable', 'true');
    article.dataset.cardId = card.id;

    // Drag handle
    const handle = document.createElement('span');
    handle.className = 'swot-drag-handle';
    handle.textContent = '⠿';
    handle.setAttribute('aria-label', 'Arrastar card');
    handle.title = 'Arrastar';

    // Text content
    const textEl = document.createElement('div');
    textEl.className = 'swot-card-text';
    textEl.setAttribute('contenteditable', 'true');
    textEl.setAttribute('role', 'textbox');
    textEl.setAttribute('aria-multiline', 'true');
    textEl.setAttribute('data-placeholder', 'Digite aqui…');
    textEl.textContent = card.text || '';

    // Delete button
    const delBtn = document.createElement('button');
    delBtn.className = 'swot-delete-btn';
    delBtn.type = 'button';
    delBtn.title = 'Remover card';
    delBtn.setAttribute('aria-label', 'Remover card');
    delBtn.textContent = '×';

    article.appendChild(handle);
    article.appendChild(textEl);
    article.appendChild(delBtn);

    /* ── Events ── */

    // Drag start
    article.addEventListener('dragstart', function (e) {
      _dragCardId = card.id;
      article.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', card.id);
    });

    article.addEventListener('dragend', function () {
      article.classList.remove('dragging');
      _dragCardId = null;
    });

    // Inline edit — save on blur / Enter
    textEl.addEventListener('blur', function () {
      var newText = textEl.textContent.trim();
      _updateCardText(card.id, newText);
    });

    textEl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        textEl.blur();
      }
    });

    // Delete
    delBtn.addEventListener('click', function () {
      window.removeSwotCard(card.id);
    });

    return article;
  }

  /**
   * Update card text in state without re-rendering the whole canvas.
   */
  function _updateCardText(id, newText) {
    ensureState();
    var idx = window.currentPlanState.swotCards.findIndex(function (c) { return c.id === id; });
    if (idx !== -1) {
      window.currentPlanState.swotCards[idx].text = newText;
      broadcastSwot();
    }
  }

  /* ─────────────────────────────────────────────
   * Quadrant DOM factory
   * ───────────────────────────────────────────── */

  function buildQuadrantElement(meta, cards) {
    const section = document.createElement('section');
    section.className = 'swot-quadrant ' + meta.colorClass;
    section.dataset.quadrant = meta.key;

    /* Header */
    const header = document.createElement('div');
    header.className = 'swot-q-header';
    header.style.backgroundColor = meta.headerBg;

    const headerLeft = document.createElement('div');
    headerLeft.className = 'swot-q-header-left';

    const iconSpan = document.createElement('span');
    iconSpan.className = 'swot-q-label-icon';
    iconSpan.textContent = meta.icon;

    const labelSpan = document.createElement('span');
    labelSpan.textContent = meta.label;

    const badge = document.createElement('span');
    badge.className = 'swot-q-count-badge';
    badge.style.backgroundColor = meta.badgeBg;
    badge.style.color = meta.badgeText;
    badge.textContent = cards.length;
    badge.dataset.badgeFor = meta.key;

    headerLeft.appendChild(iconSpan);
    headerLeft.appendChild(labelSpan);
    headerLeft.appendChild(badge);

    const addBtn = document.createElement('button');
    addBtn.className = 'swot-add-btn';
    addBtn.type = 'button';
    addBtn.setAttribute('aria-label', 'Adicionar card em ' + meta.label);
    addBtn.innerHTML = '<span aria-hidden="true">+</span> Adicionar';
    addBtn.addEventListener('click', function () {
      window.addSwotCard(meta.key);
    });

    header.appendChild(headerLeft);
    header.appendChild(addBtn);

    /* Cards container */
    const container = document.createElement('div');
    container.className = 'swot-cards-container' + (cards.length === 0 ? ' is-empty' : '');
    container.dataset.quadrantContainer = meta.key;

    cards.forEach(function (card) {
      container.appendChild(buildCardElement(card));
    });

    /* Empty hint */
    const emptyHint = document.createElement('p');
    emptyHint.className = 'swot-empty-hint';
    emptyHint.textContent = 'Nenhum item ainda. Clique em "+ Adicionar".';

    /* Drag-and-drop on container */
    container.addEventListener('dragover', function (e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      section.classList.add('drag-over');
    });

    container.addEventListener('dragleave', function (e) {
      // Only remove if leaving the section entirely
      if (!section.contains(e.relatedTarget)) {
        section.classList.remove('drag-over');
      }
    });

    container.addEventListener('drop', function (e) {
      e.preventDefault();
      section.classList.remove('drag-over');

      var droppedId = e.dataTransfer.getData('text/plain') || _dragCardId;
      if (!droppedId) return;

      _moveCardToQuadrant(droppedId, meta.key, container);
    });

    section.appendChild(header);
    section.appendChild(container);
    section.appendChild(emptyHint);

    return section;
  }

  /* ─────────────────────────────────────────────
   * Move card between quadrants
   * ───────────────────────────────────────────── */

  function _moveCardToQuadrant(cardId, targetQuadrant, targetContainer) {
    ensureState();
    var cards = window.currentPlanState.swotCards;
    var idx = cards.findIndex(function (c) { return c.id === cardId; });
    if (idx === -1) return;

    var card = cards[idx];
    if (card.quadrant === targetQuadrant) return; // same quadrant, no-op

    var previousQuadrant = card.quadrant;

    // Update state
    card.quadrant = targetQuadrant;

    // Move DOM element
    var cardEl = document.querySelector('.swot-card[data-card-id="' + cardId + '"]');
    if (cardEl) {
      cardEl.classList.remove('dragging');
      targetContainer.appendChild(cardEl);
      _updateEmptyState(targetQuadrant);
      _updateEmptyState(previousQuadrant);
      _updateBadge(targetQuadrant);
      _updateBadge(previousQuadrant);
    }

    broadcastSwot();
  }

  /* ─────────────────────────────────────────────
   * UI helpers
   * ───────────────────────────────────────────── */

  function _getContainer(quadrant) {
    return document.querySelector('.swot-cards-container[data-quadrant-container="' + quadrant + '"]');
  }

  function _updateEmptyState(quadrant) {
    var container = _getContainer(quadrant);
    if (!container) return;
    if (container.querySelectorAll('.swot-card').length === 0) {
      container.classList.add('is-empty');
    } else {
      container.classList.remove('is-empty');
    }
  }

  function _updateBadge(quadrant) {
    var badge = document.querySelector('[data-badge-for="' + quadrant + '"]');
    if (!badge) return;
    ensureState();
    var count = window.currentPlanState.swotCards.filter(function (c) { return c.quadrant === quadrant; }).length;
    badge.textContent = count;
  }

  /* ─────────────────────────────────────────────
   * Public API
   * ───────────────────────────────────────────── */

  /**
   * Initialize the SWOT canvas inside the given container element.
   * @param {string} containerId - The id of the host element.
   */
  function initSwotCanvas(containerId) {
    injectStyles();
    ensureState();

    var host = document.getElementById(containerId);
    if (!host) {
      console.warn('[swotCanvas] Container not found: #' + containerId);
      return;
    }

    // Seed defaults if swotCards is empty
    if (window.currentPlanState.swotCards.length === 0) {
      QUADRANTS.forEach(function (meta) {
        var defaults = DEFAULT_CARDS[meta.key] || [];
        defaults.forEach(function (text) {
          window.currentPlanState.swotCards.push({
            id: generateId(),
            quadrant: meta.key,
            text: text,
            color: meta.headerBg,
          });
        });
      });
    }

    // Clear host
    host.innerHTML = '';

    // Build canvas grid
    var canvas = document.createElement('div');
    canvas.className = 'swot-canvas';
    canvas.setAttribute('role', 'region');
    canvas.setAttribute('aria-label', 'Canvas SWOT');

    QUADRANTS.forEach(function (meta) {
      var cards = window.currentPlanState.swotCards.filter(function (c) { return c.quadrant === meta.key; });
      canvas.appendChild(buildQuadrantElement(meta, cards));
    });

    host.appendChild(canvas);

    // Listen for remote SWOT updates
    if (window.PlanRealtimeCollab && typeof PlanRealtimeCollab.on === 'function') {
      PlanRealtimeCollab.on('swot', window.applySwotRemoteUpdate);
    }
  }

  /**
   * Add a new card to a quadrant.
   * @param {string} quadrant - One of 'forcas' | 'fraquezas' | 'oportunidades' | 'ameacas'
   */
  function addSwotCard(quadrant) {
    ensureState();
    var meta = getQuadrantMeta(quadrant);

    var card = {
      id: generateId(),
      quadrant: quadrant,
      text: '',
      color: meta.headerBg,
    };

    window.currentPlanState.swotCards.push(card);

    var container = _getContainer(quadrant);
    if (container) {
      var cardEl = buildCardElement(card);
      container.appendChild(cardEl);
      container.classList.remove('is-empty');

      // Focus the editable area
      var textEl = cardEl.querySelector('.swot-card-text');
      if (textEl) {
        textEl.focus();
        // Place cursor at end
        if (typeof window.getSelection !== 'undefined') {
          var sel = window.getSelection();
          var range = document.createRange();
          range.selectNodeContents(textEl);
          range.collapse(false);
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }

      _updateBadge(quadrant);
    }

    broadcastSwot();
  }

  /**
   * Remove a card by ID from state and DOM.
   * @param {string} id
   */
  function removeSwotCard(id) {
    ensureState();
    var idx = window.currentPlanState.swotCards.findIndex(function (c) { return c.id === id; });
    if (idx === -1) return;

    var quadrant = window.currentPlanState.swotCards[idx].quadrant;
    window.currentPlanState.swotCards.splice(idx, 1);

    var cardEl = document.querySelector('.swot-card[data-card-id="' + id + '"]');
    if (cardEl) {
      cardEl.remove();
    }

    _updateEmptyState(quadrant);
    _updateBadge(quadrant);
    broadcastSwot();
  }

  /**
   * Apply a remote SWOT update received via realtime collab.
   * @param {Array} remoteCards - Full swotCards array from remote peer.
   */
  function applySwotRemoteUpdate(remoteCards) {
    if (!Array.isArray(remoteCards)) return;
    ensureState();
    window.currentPlanState.swotCards = remoteCards;

    // Re-render all containers
    QUADRANTS.forEach(function (meta) {
      var container = _getContainer(meta.key);
      if (!container) return;

      // Clear existing cards
      container.querySelectorAll('.swot-card').forEach(function (el) { el.remove(); });

      // Repopulate
      var cards = window.currentPlanState.swotCards.filter(function (c) { return c.quadrant === meta.key; });
      cards.forEach(function (card) {
        container.appendChild(buildCardElement(card));
      });

      _updateEmptyState(meta.key);
      _updateBadge(meta.key);
    });
  }

  /* ─────────────────────────────────────────────
   * Exports
   * ───────────────────────────────────────────── */

  window.initSwotCanvas = initSwotCanvas;
  window.addSwotCard = addSwotCard;
  window.removeSwotCard = removeSwotCard;
  window.applySwotRemoteUpdate = applySwotRemoteUpdate;

})();
