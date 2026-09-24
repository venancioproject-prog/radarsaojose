/**
 * Módulo Linha do Tempo, Geografia & História Municipal
 * Radar São José — Plataforma de Inteligência Municipal
 * Arquitetura de Hub de Aplicações e Modais Imersivos Fullscreen
 */

(function() {
  'use strict';

  // Estado Central do Módulo
  window.historiaState = {
    selectedEra: 'all',
    selectedEvidence: 'all',
    searchQuery: '',
    activeEventId: null,
    activeRegiaoId: 'sul',
    bairrosFilterRegiao: 'all',
    bairrosSearchQuery: '',
    activeAppModal: null
  };

  // Configuração dos Níveis de Evidência com Padrão SaaS Radar SJC
  const EVIDENCIA_CONFIG = {
    documentado: {
      text: "Documentado",
      badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-300",
      dotClass: "bg-emerald-500",
      icon: "fa-circle-check"
    },
    corroborado: {
      text: "Corroborado",
      badgeClass: "bg-blue-50 text-blue-800 border-blue-300",
      dotClass: "bg-blue-500",
      icon: "fa-circle-dot"
    },
    em_investigacao: {
      text: "Em Investigação",
      badgeClass: "bg-amber-50 text-amber-800 border-amber-300",
      dotClass: "bg-amber-500",
      icon: "fa-magnifying-glass"
    },
    em_disputa: {
      text: "Em Disputa",
      badgeClass: "bg-rose-50 text-rose-800 border-rose-300",
      dotClass: "bg-rose-500",
      icon: "fa-scale-unbalanced"
    }
  };

  // Marcos Fluviais
  const GEO_LANDMARKS = [
    { x: 260, name: "Várzea do Rio Comprido (Origens)", icon: "fa-seedling" },
    { x: 1000, name: "Ponte dos Jesuítas (Travessia Colonial)", icon: "fa-bridge" },
    { x: 1800, name: "Curva do Banhado (Colina Histórica SJC)", icon: "fa-mountain-sun" },
    { x: 2800, name: "Santana & Meandro da Tecelagem", icon: "fa-industry" },
    { x: 4000, name: "Planície Fluvial do DCTA / ITA", icon: "fa-plane-departure" },
    { x: 5500, name: "Eixo Metropolitano & Parque Tecnológico", icon: "fa-city" }
  ];

  /**
   * Cálculo do Meandro Central do Rio (Ondulação Suave Contínua)
   */
  function getRiverCenterY(x) {
    const baseline = 300;
    return baseline + 
      Math.sin((x - 100) * 0.0032) * 26 + 
      Math.sin((x - 100) * 0.0016 + 0.8) * 14;
  }

  /**
   * Gerador de Curva Spline Cúbica (Bézier)
   */
  function buildRiverSplineD(totalWidth, yOffset = 0, amplitude = 1.0) {
    const points = [];
    const step = 16;
    for (let x = -80; x <= totalWidth + 300; x += step) {
      const y = (getRiverCenterY(x) - 300) * amplitude + 300 + yOffset;
      points.push({ x, y });
    }
    if (points.length < 2) return '';

    let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? 0 : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    return d;
  }

  /**
   * Inicialização e Renderização do Painel Histórico
   */
  window.renderHistoriaDashboard = function() {
    // Atualizar Contadores da Sidebar
    window.updateHistoriaSidebarCounts();
    // Inicializar Atalhos de Teclado
    window.initRiverKeyboardNav();
  };

  /**
   * Atualização de Contadores da Sidebar
   */
  window.updateHistoriaSidebarCounts = function() {
    const data = window.HISTORIA_SJC_DATA;
    if (!data || !data.eventos) return;

    const total = data.eventos.length;
    const totalEl = document.getElementById("historia-total-base-count");
    if (totalEl) totalEl.textContent = total;

    const eraCounts = {
      all: total,
      colonial: data.eventos.filter(e => e.eraId === 'colonial').length,
      sanatorial: data.eventos.filter(e => e.eraId === 'sanatorial').length,
      tecnologica: data.eventos.filter(e => e.eraId === 'tecnologica').length,
      contemporanea: data.eventos.filter(e => e.eraId === 'contemporanea').length
    };

    Object.keys(eraCounts).forEach(eraId => {
      const pillCount = document.getElementById(`side-count-era-${eraId}`);
      if (pillCount) pillCount.textContent = eraCounts[eraId];
    });
  };

  /**
   * Controle de Abertura / Fechamento dos Modais de Aplicação
   */
  window.openAppModal = function(appId) {
    window.historiaState.activeAppModal = appId;
    const modal = document.getElementById(`modal-app-${appId}`);
    if (!modal) return;

    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";

    // Inicialização específica de cada aplicação
    if (appId === 'timeline') {
      window.filterHistoriaEvents();
    } else if (appId === 'regioes') {
      window.renderRegioesMap();
      window.selectRegiao(window.historiaState.activeRegiaoId || 'sul');
    } else if (appId === 'bairros') {
      window.renderBairrosCatalog();
    } else if (appId === 'prefeitos') {
      window.renderModalPersonalidades();
      window.renderModalPrefeitos();
    }
  };

  window.closeAppModal = function(appId) {
    const modal = document.getElementById(`modal-app-${appId}`);
    if (modal) modal.classList.add("hidden");
    window.historiaState.activeAppModal = null;
    document.body.style.overflow = "";
  };

  // =========================================================================
  // APP 1: LINHA DO TEMPO (O RIO DA MEMÓRIA COM SVG FLUVIAL)
  // =========================================================================

  window.filterHistoriaEvents = function() {
    const data = window.HISTORIA_SJC_DATA;
    if (!data || !data.eventos) return;

    const searchInput = document.getElementById("modal-historia-search");
    const query = (searchInput ? searchInput.value : "").trim().toLowerCase();
    const era = window.historiaState.selectedEra || 'all';

    const filtered = data.eventos.filter(ev => {
      if (era !== 'all' && ev.eraId !== era) return false;
      if (query) {
        const titleMatch = (ev.titulo || "").toLowerCase().includes(query);
        const resumoMatch = (ev.resumo || "").toLowerCase().includes(query);
        const anoMatch = String(ev.ano).includes(query);
        const localMatch = (ev.local || "").toLowerCase().includes(query);
        if (!titleMatch && !resumoMatch && !anoMatch && !localMatch) return false;
      }
      return true;
    });

    window.renderRiverTrack(filtered);
  };

  window.filterHistoriaEventsFromModal = function(val) {
    window.filterHistoriaEvents();
  };

  window.selectHistoriaEra = function(eraId) {
    window.historiaState.selectedEra = eraId;

    const eras = ['all', 'colonial', 'sanatorial', 'tecnologica', 'contemporanea'];
    eras.forEach(e => {
      const btn = document.getElementById(`modal-tab-era-${e}`);
      if (btn) {
        if (e === eraId) {
          btn.className = "px-3 py-1 rounded-lg font-bold bg-cyan-600 text-white shadow-xs";
        } else {
          btn.className = "px-3 py-1 rounded-lg font-bold bg-slate-900 text-slate-400 hover:text-white border border-slate-800";
        }
      }
    });

    window.filterHistoriaEvents();

    const viewport = document.getElementById("historia-river-viewport");
    if (viewport) viewport.scrollTo({ left: 0, behavior: 'smooth' });
  };

  window.renderRiverTrack = function(events) {
    const track = document.getElementById("historia-river-track");
    const svgSand = document.getElementById("river-sand-path");
    const svgMain = document.getElementById("river-main-path");
    const svgStream = document.getElementById("river-inner-stream");
    const svgSecStream = document.getElementById("river-secondary-stream");
    const connectorsSvg = document.getElementById("historia-connectors-svg");
    const landmarksContainer = document.getElementById("historia-geo-landmarks-container");
    const stonesContainer = document.getElementById("historia-stones-container");
    const cardsContainer = document.getElementById("historia-cards-container");
    const emptyState = document.getElementById("historia-empty-state");

    if (!track || !svgMain || !stonesContainer || !cardsContainer) return;

    if (events.length === 0) {
      if (emptyState) emptyState.classList.remove("hidden");
      stonesContainer.innerHTML = "";
      cardsContainer.innerHTML = "";
      if (connectorsSvg) connectorsSvg.innerHTML = "";
      if (landmarksContainer) landmarksContainer.innerHTML = "";
      return;
    } else {
      if (emptyState) emptyState.classList.add("hidden");
    }

    const SLOT_WIDTH = 360;
    const START_X = 240;
    const totalWidth = Math.max(1400, START_X + events.length * SLOT_WIDTH + 300);

    track.style.width = `${totalWidth}px`;
    track.style.minWidth = `${totalWidth}px`;

    const sandPathD = buildRiverSplineD(totalWidth, 0, 1.0);
    const riverPathD = buildRiverSplineD(totalWidth, 0, 1.0);
    const streamPathD = buildRiverSplineD(totalWidth, -6, 0.95);
    const secStreamPathD = buildRiverSplineD(totalWidth, 6, 1.05);

    if (svgSand) svgSand.setAttribute("d", sandPathD);
    if (svgMain) svgMain.setAttribute("d", riverPathD);
    if (svgStream) svgStream.setAttribute("d", streamPathD);
    if (svgSecStream) svgSecStream.setAttribute("d", secStreamPathD);

    let stonesHtml = '';
    let cardsHtml = '';
    let connectorsSvgHtml = '';

    // Marcos Fluviais
    let landmarksHtml = '';
    GEO_LANDMARKS.forEach(geo => {
      if (geo.x < totalWidth - 100) {
        const geoY = getRiverCenterY(geo.x);
        landmarksHtml += `
          <div 
            class="absolute px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-900/90 text-cyan-300 border border-cyan-500/40 shadow-md backdrop-blur-md flex items-center gap-1.5 pointer-events-auto transition-transform hover:scale-105 select-none"
            style="left: ${geo.x - 90}px; top: ${geoY + 46}px; z-index: 12;"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            <i class="fa-solid ${geo.icon} text-cyan-300 text-[10px]"></i>
            <span class="truncate max-w-[210px]">${geo.name}</span>
          </div>
        `;
      }
    });
    if (landmarksContainer) landmarksContainer.innerHTML = landmarksHtml;

    // Cards Alternados
    events.forEach((ev, i) => {
      const stoneX = START_X + i * SLOT_WIDTH;
      const riverY = getRiverCenterY(stoneX);
      const isTop = (i % 2 === 0);

      const cardWidth = 320;
      const cardHeight = 205;
      const cardLeft = stoneX - (cardWidth / 2);
      const cardTop = isTop ? 18 : 380;

      const badge = EVIDENCIA_CONFIG[ev.evidencia] || EVIDENCIA_CONFIG.documentado;
      const numFontes = (ev.fontes || []).length;

      // Conectores
      if (isTop) {
        const connectorStartY = cardTop + cardHeight;
        const connectorEndY = riverY - 14;
        connectorsSvgHtml += `
          <path d="M ${stoneX} ${connectorStartY} C ${stoneX} ${connectorStartY + (connectorEndY - connectorStartY) * 0.5}, ${stoneX} ${connectorEndY - 8}, ${stoneX} ${connectorEndY}" fill="none" stroke="#38bdf8" stroke-width="2" stroke-dasharray="3 3" opacity="0.6" />
        `;
      } else {
        const connectorStartY = cardTop;
        const connectorEndY = riverY + 14;
        connectorsSvgHtml += `
          <path d="M ${stoneX} ${connectorStartY} C ${stoneX} ${connectorStartY - (connectorStartY - connectorEndY) * 0.5}, ${stoneX} ${connectorEndY + 8}, ${stoneX} ${connectorEndY}" fill="none" stroke="#38bdf8" stroke-width="2" stroke-dasharray="3 3" opacity="0.6" />
        `;
      }

      // Nó de Ano
      stonesHtml += `
        <div 
          class="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer pointer-events-auto transition-transform duration-200 hover:scale-110 select-none"
          style="left: ${stoneX}px; top: ${riverY}px; z-index: 25;"
          onclick="window.openHistoriaEventoModal('${ev.id}')"
          title="Clique para abrir detalhes de ${ev.ano}"
        >
          <div class="absolute -inset-2 rounded-full bg-cyan-400/25 blur-[3px] group-hover:bg-cyan-400/50 transition-colors animate-pulse"></div>
          <div class="relative flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 text-white border-2 border-cyan-400 shadow-md">
            <span class="w-2 h-2 rounded-full ${badge.dotClass}"></span>
            <span class="text-xs font-black tracking-tight">${ev.ano}</span>
          </div>
        </div>
      `;

      // Card Branco
      cardsHtml += `
        <div 
          id="historia-card-${ev.id}"
          onclick="window.openHistoriaEventoModal('${ev.id}')"
          class="absolute w-[320px] h-[205px] rounded-2xl bg-white border border-slate-200 shadow-md hover:shadow-xl hover:border-cyan-400 transition-all duration-200 pointer-events-auto flex flex-col justify-between p-4 cursor-pointer select-none group text-slate-900"
          style="left: ${cardLeft}px; top: ${cardTop}px; z-index: 20;"
        >
          <div class="space-y-1.5">
            <div class="flex items-center justify-between gap-2">
              <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${badge.badgeClass} border">
                <span class="w-1.5 h-1.5 rounded-full ${badge.dotClass}"></span>
                ${badge.text}
              </span>
              <span class="text-[11px] font-mono font-extrabold text-slate-400">
                ${ev.dataExata ? (ev.dataExata.length > 15 ? ev.ano : ev.dataExata) : ev.ano}
              </span>
            </div>

            <h4 class="text-xs sm:text-[13px] font-black text-slate-900 leading-snug line-clamp-2 group-hover:text-cyan-800 transition-colors">
              ${ev.titulo}
            </h4>

            <p class="text-[11px] text-slate-600 leading-relaxed line-clamp-2 font-medium">
              ${ev.resumo}
            </p>
          </div>

          <div class="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto text-[11px]">
            <div class="flex items-center gap-1 text-slate-500 font-semibold truncate">
              <i class="fa-solid fa-location-dot text-cyan-600 text-xs shrink-0"></i>
              <span class="truncate">${ev.local ? ev.local.split('/')[0].trim() : "São José dos Campos"}</span>
            </div>

            <div class="flex items-center gap-2 shrink-0">
              <span class="inline-flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
                <i class="fa-solid fa-file-shield text-cyan-600"></i> ${numFontes} ${numFontes === 1 ? 'fonte' : 'fontes'}
              </span>
              <i class="fa-solid fa-arrow-right text-[10px] text-slate-400 group-hover:text-cyan-700 transition-all"></i>
            </div>
          </div>
        </div>
      `;
    });

    if (connectorsSvg) connectorsSvg.innerHTML = connectorsSvgHtml;
    if (stonesContainer) stonesContainer.innerHTML = stonesHtml;
    if (cardsContainer) cardsContainer.innerHTML = cardsHtml;
  };

  window.scrollHistoriaRiver = function(amount) {
    const viewport = document.getElementById("historia-river-viewport");
    if (viewport) viewport.scrollBy({ left: amount, behavior: 'smooth' });
  };

  // =========================================================================
  // APP 2: MAPA DAS 7 REGIÕES MUNICIPAIS
  // =========================================================================

  window.renderRegioesMap = function() {
    const svg = document.getElementById("modal-regioes-map-svg");
    if (!svg) return;
    const data = window.HISTORIA_SJC_DATA;
    if (!data || !data.regioes) return;

    let html = `
      <defs>
        <filter id="regiaoGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="5" flood-color="#38bdf8" flood-opacity="0.4" />
        </filter>
      </defs>
      <!-- Contorno de Fundo Municipal -->
      <path d="M 60 40 Q 140 20 280 30 T 450 80 Q 480 180 450 280 T 360 370 Q 200 390 120 330 T 50 200 Q 40 100 60 40 Z" fill="#030b14" stroke="#0e2a4a" stroke-width="1.5" />
      
      <!-- Rio Paraíba do Sul Vetorial -->
      <path d="M 40 180 C 120 190, 180 140, 240 170 C 300 200, 360 130, 460 150" fill="none" stroke="#0284c7" stroke-width="4.5" stroke-linecap="round" opacity="0.8" />
    `;

    // Polígonos das 7 Regiões
    data.regioes.forEach(reg => {
      const isSelected = (reg.id === window.historiaState.activeRegiaoId);
      html += `
        <g 
          class="cursor-pointer group select-none transition-all duration-200" 
          onclick="window.selectRegiao('${reg.id}')"
        >
          <path 
            id="regiao-svg-path-${reg.id}" 
            d="${reg.svgPath}" 
            fill="${isSelected ? '#0284c7' : '#082542'}" 
            fill-opacity="${isSelected ? '0.75' : '0.45'}" 
            stroke="${isSelected ? '#38bdf8' : '#1e4b7a'}" 
            stroke-width="${isSelected ? '2.5' : '1.5'}"
            class="group-hover:fill-opacity-80 transition-all"
            filter="${isSelected ? 'url(#regiaoGlow)' : 'none'}"
          />
          <circle cx="${reg.center.x}" cy="${reg.center.y}" r="${isSelected ? '6' : '4'}" fill="${isSelected ? '#ffffff' : '#38bdf8'}" />
          <text 
            x="${reg.center.x}" 
            y="${reg.center.y - 10}" 
            text-anchor="middle" 
            fill="${isSelected ? '#ffffff' : '#94a3b8'}" 
            font-size="10" 
            font-weight="black"
            class="group-hover:fill-white"
          >${reg.nome}</text>
        </g>
      `;
    });

    svg.innerHTML = html;
  };

  window.selectRegiao = function(regiaoId) {
    window.historiaState.activeRegiaoId = regiaoId;
    const data = window.HISTORIA_SJC_DATA;
    if (!data || !data.regioes) return;

    const reg = data.regioes.find(r => r.id === regiaoId) || data.regioes[0];
    const detailsPanel = document.getElementById("modal-regiao-details-panel");
    const activeTag = document.getElementById("map-active-region-tag");

    if (activeTag) activeTag.textContent = `${reg.nome} Selecionada`;

    // Atualizar visual dos polígonos
    window.renderRegioesMap();

    if (detailsPanel) {
      detailsPanel.innerHTML = `
        <div class="space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-cyan-900/60">
            <div>
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${reg.badgeCor} text-slate-950 font-mono">
                Região Municipal
              </span>
              <h3 class="text-xl font-black text-white mt-1">${reg.nome}</h3>
            </div>
            <div class="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 text-lg">
              <i class="fa-solid ${reg.icone}"></i>
            </div>
          </div>

          <div class="p-3.5 rounded-2xl bg-slate-950/60 border border-cyan-950 text-xs space-y-1.5">
            <h4 class="text-[11px] font-black text-cyan-300 uppercase tracking-wider">Perfil Geográfico & Urbano</h4>
            <p class="text-slate-300 leading-relaxed font-medium">${reg.resumo}</p>
          </div>

          <div class="space-y-2 text-xs">
            <h4 class="text-[11px] font-black text-slate-300 uppercase tracking-wider">História & Formação Territorial</h4>
            <p class="text-slate-400 leading-relaxed">${reg.historia}</p>
          </div>

          <div class="space-y-2 pt-2 border-t border-cyan-900/60 text-xs">
            <h4 class="text-[11px] font-black text-slate-300 uppercase tracking-wider">Principais Bairros</h4>
            <div class="flex flex-wrap gap-1.5">
              ${(reg.principaisBairros || []).map(b => `
                <span class="px-2.5 py-1 rounded-lg bg-slate-800 text-cyan-200 border border-cyan-900/50 text-[11px] font-bold">${b}</span>
              `).join('')}
            </div>
          </div>

          <div class="space-y-2 pt-2 border-t border-cyan-900/60 text-xs">
            <h4 class="text-[11px] font-black text-slate-300 uppercase tracking-wider">Marcos & Pontos Notáveis</h4>
            <div class="space-y-1.5">
              ${(reg.marcos || []).map(m => `
                <div class="flex items-center gap-2 text-slate-300 text-[11px]">
                  <i class="fa-solid fa-location-dot text-cyan-400 text-xs"></i>
                  <span>${m}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    }
  };

  // =========================================================================
  // APP 3: DICIONÁRIO DOS BAIRROS (ORIGEM DOS NOMES)
  // =========================================================================

  window.renderBairrosCatalog = function() {
    const container = document.getElementById("bairros-cards-grid");
    if (!container) return;
    const data = window.HISTORIA_SJC_DATA;
    if (!data || !data.bairros) return;

    const query = (window.historiaState.bairrosSearchQuery || "").toLowerCase();
    const regiao = window.historiaState.bairrosFilterRegiao || 'all';

    const filtered = data.bairros.filter(b => {
      if (regiao !== 'all' && b.regiaoId !== regiao) return false;
      if (query) {
        const nomeMatch = (b.nome || "").toLowerCase().includes(query);
        const origemMatch = (b.origemNome || "").toLowerCase().includes(query);
        const histMatch = (b.historia || "").toLowerCase().includes(query);
        if (!nomeMatch && !origemMatch && !histMatch) return false;
      }
      return true;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="col-span-full p-12 text-center text-slate-400">
          <i class="fa-solid fa-magnifying-glass text-3xl mb-2 text-slate-300"></i>
          <p class="font-bold text-slate-600">Nenhum bairro encontrado para esta busca.</p>
        </div>
      `;
      return;
    }

    let html = '';
    filtered.forEach(b => {
      html += `
        <div class="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-card-hover transition-all flex flex-col justify-between space-y-3 group">
          <div class="space-y-2.5">
            <div class="flex items-center justify-between">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                ${b.regiaoNome}
              </span>
              <span class="text-[11px] font-mono font-bold text-slate-400">${b.periodo}</span>
            </div>

            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-emerald-700 text-sm shrink-0 group-hover:bg-emerald-100 transition-colors">
                <i class="fa-solid ${b.icone}"></i>
              </div>
              <h4 class="text-sm font-black text-slate-900">${b.nome}</h4>
            </div>

            <div class="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1 text-xs">
              <p class="text-[10px] font-black uppercase tracking-wider text-emerald-900">Origem do Nome:</p>
              <p class="text-slate-700 leading-relaxed font-medium">${b.origemNome}</p>
            </div>

            <p class="text-xs text-slate-600 leading-relaxed">${b.historia}</p>
          </div>

          ${b.curiosidade ? `
            <div class="pt-2.5 border-t border-slate-100 text-[11px] text-slate-500">
              <strong class="text-slate-700"><i class="fa-solid fa-lightbulb text-amber-500 mr-1"></i> Curiosidade:</strong> ${b.curiosidade}
            </div>
          ` : ''}
        </div>
      `;
    });

    container.innerHTML = html;
  };

  window.filterBairros = function(val) {
    window.historiaState.bairrosSearchQuery = val;
    window.renderBairrosCatalog();
  };

  window.filterBairrosByRegiao = function(regiaoId) {
    window.historiaState.bairrosFilterRegiao = regiaoId;

    const regioes = ['all', 'sul', 'oeste', 'leste', 'norte', 'centro'];
    regioes.forEach(r => {
      const btn = document.getElementById(`bairros-tab-${r}`);
      if (btn) {
        if (r === regiaoId) {
          btn.className = "px-3 py-1.5 rounded-xl font-bold bg-emerald-800 text-white shadow-xs";
        } else {
          btn.className = "px-3 py-1.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100";
        }
      }
    });

    window.renderBairrosCatalog();
  };

  // =========================================================================
  // APP 4: PERSONAGENS & PREFEITOS
  // =========================================================================

  window.switchModalPrefeitosTab = function(tabName) {
    const btnPers = document.getElementById("btn-tab-modal-personalidades");
    const btnPref = document.getElementById("btn-tab-modal-prefeitos");
    const viewPers = document.getElementById("modal-view-personalidades");
    const viewPref = document.getElementById("modal-view-prefeitos");

    if (tabName === 'personalidades') {
      if (btnPers) btnPers.className = "px-4 py-2 rounded-xl font-bold bg-white text-slate-900 border border-slate-200 shadow-xs cursor-pointer";
      if (btnPref) btnPref.className = "px-4 py-2 rounded-xl font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer";
      if (viewPers) viewPers.classList.remove("hidden");
      if (viewPref) viewPref.classList.add("hidden");
    } else {
      if (btnPers) btnPers.className = "px-4 py-2 rounded-xl font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer";
      if (btnPref) btnPref.className = "px-4 py-2 rounded-xl font-bold bg-white text-slate-900 border border-slate-200 shadow-xs cursor-pointer";
      if (viewPers) viewPers.classList.add("hidden");
      if (viewPref) viewPref.classList.remove("hidden");
    }
  };

  window.renderModalPersonalidades = function() {
    const container = document.getElementById("modal-view-personalidades");
    if (!container) return;
    const data = window.HISTORIA_SJC_DATA;
    if (!data || !data.personalidades) return;

    let html = '';
    data.personalidades.forEach(p => {
      html += `
        <div class="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-card-hover transition-all space-y-2 flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-2.5 mb-2">
              <div class="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center font-black text-xs shrink-0">
                <i class="fa-solid fa-user-astronaut"></i>
              </div>
              <div class="min-w-0">
                <h5 class="font-black text-xs text-slate-900 leading-tight truncate">${p.nome}</h5>
                <span class="text-[10px] font-bold text-amber-800 font-mono">${p.periodo}</span>
              </div>
            </div>
            <p class="text-[11px] font-bold text-slate-800 mb-1 leading-snug">${p.papel || p.cargo}</p>
            <p class="text-[11px] text-slate-600 leading-relaxed line-clamp-3">${p.contribuicao || p.descricao}</p>
          </div>
        </div>
      `;
    });
    container.innerHTML = html;
  };

  window.renderModalPrefeitos = function() {
    const tbody = document.getElementById("modal-prefeitos-table-body");
    if (!tbody) return;
    const data = window.HISTORIA_SJC_DATA;
    if (!data || !data.prefeitos) return;

    let html = '';
    data.prefeitos.forEach((pref, idx) => {
      html += `
        <tr class="${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'} hover:bg-amber-50/30 transition-colors">
          <td class="px-4 py-2.5 font-bold font-mono text-slate-800 text-[11px] whitespace-nowrap">${pref.periodo}</td>
          <td class="px-4 py-2.5 font-black text-slate-900">${pref.nome}</td>
          <td class="px-4 py-2.5 text-slate-600 font-medium">${pref.cargo || "Prefeito Municipal"}</td>
          <td class="px-4 py-2.5 text-slate-500">${pref.formaAcesso || pref.acesso || "Eleito / Nomeado"}</td>
          <td class="px-4 py-2.5">
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <i class="fa-solid fa-check text-emerald-600 text-[9px]"></i> ${pref.situacaoDocumental || pref.situacao || "Homologado"}
            </span>
          </td>
        </tr>
      `;
    });
    tbody.innerHTML = html;
  };

  // =========================================================================
  // MODAL DE DOSSIÊ PRIMÁRIO & MODAL "POR QUE 1767?"
  // =========================================================================

  window.openHistoriaEventoModal = function(eventId) {
    const data = window.HISTORIA_SJC_DATA;
    if (!data || !data.eventos) return;

    const ev = data.eventos.find(e => e.id === eventId);
    if (!ev) return;

    const modal = document.getElementById("historia-dossie-modal");
    if (!modal) return;

    const badge = EVIDENCIA_CONFIG[ev.evidencia] || EVIDENCIA_CONFIG.documentado;
    const eraObj = (data.eras || []).find(era => era.id === ev.eraId) || { nome: "História de SJC" };

    const titleEl = document.getElementById("dossie-modal-titulo");
    const dateEl = document.getElementById("dossie-modal-data");
    const eraEl = document.getElementById("dossie-modal-era");
    const badgeEl = document.getElementById("dossie-modal-evidencia-badge");

    if (titleEl) titleEl.textContent = ev.titulo;
    if (dateEl) dateEl.textContent = ev.dataExata || String(ev.ano);
    if (eraEl) eraEl.textContent = eraObj.nome;
    if (badgeEl) {
      badgeEl.className = `inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${badge.badgeClass}`;
      badgeEl.innerHTML = `<span class="w-2 h-2 rounded-full ${badge.dotClass}"></span> ${badge.text}`;
    }

    const resumoEl = document.getElementById("dossie-modal-resumo");
    if (resumoEl) resumoEl.textContent = ev.resumo;

    const detalhesEl = document.getElementById("dossie-modal-detalhes");
    if (detalhesEl) detalhesEl.textContent = ev.detalhes || ev.resumo;

    const localEl = document.getElementById("dossie-modal-local");
    if (localEl) localEl.textContent = ev.local || "São José dos Campos - SP";

    modal.classList.remove("hidden");
  };

  window.closeHistoriaEventoModal = function() {
    const modal = document.getElementById("historia-dossie-modal");
    if (modal) modal.classList.add("hidden");
  };

  window.openPorQue1767Modal = function() {
    const modal = document.getElementById("modal-porque-1767");
    if (modal) modal.classList.remove("hidden");
  };

  window.closePorQue1767Modal = function() {
    const modal = document.getElementById("modal-porque-1767");
    if (modal) modal.classList.add("hidden");
  };

  // Suporte a ESC para fechar qualquer modal
  window.initRiverKeyboardNav = function() {
    if (window._hubKeyboardListenerActive) return;

    window.addEventListener("keydown", function(e) {
      if (e.key === "Escape") {
        if (window.historiaState.activeAppModal) {
          window.closeAppModal(window.historiaState.activeAppModal);
        }
        window.closeHistoriaEventoModal();
        window.closePorQue1767Modal();
      }
    });

    window._hubKeyboardListenerActive = true;
  };

})();
