/**
 * RADAR SÃO JOSÉ DOS CAMPOS - MÓDULO DE VAGAS EM TEMPO REAL
 * Agregador automatizado: Google Jobs, LinkedIn, PAT SJC e Empresas da Região
 * Atualização: 2x ao dia (08:00 e 18:00)
 */

(function () {
  let vagasData = {
    metadata: {
      total: 0,
      atualizado_em_formatado: 'Hoje',
      proxima_atualizacao: '18h00'
    },
    vagas: []
  };

  let currentFilter = 'todas';
  let searchQuery = '';

  // 1. Carrega dados de vagas (Resiliente: Supabase -> vagas_sjc.json local)
  async function loadVagas() {
    try {
      // 1º Tenta Supabase se a tabela estiver criada
      if (window.SUPABASE_BLOG_URL || window.SUPABASE_URL) {
        const sUrl = window.SUPABASE_BLOG_URL || window.SUPABASE_URL;
        const sKey = window.SUPABASE_BLOG_KEY || window.SUPABASE_ANON_KEY || "sb_publishable_8mKUf28dbMM8EOSPrgjRUA_19taJmrT";
        try {
          const res = await fetch(`${sUrl}/rest/v1/vagas_sjc?order=destaque.desc,publicado_em.desc&limit=50`, {
            headers: { 'apikey': sKey, 'Authorization': `Bearer ${sKey}` }
          });
          if (res.ok) {
            const data = await res.json();
            if (data && data.length > 0) {
              vagasData.vagas = data;
              vagasData.metadata.total = data.length;
              onVagasLoaded();
              return;
            }
          }
        } catch (supErr) {
          console.debug('Supabase vagas_sjc fallback to JSON:', supErr);
        }
      }

      // 2º Fallback rápido e estático: vagas_sjc.json gerado pelo robô
      const res = await fetch('vagas_sjc.json?t=' + Date.now());
      if (res.ok) {
        const json = await res.json();
        vagasData = json;
        onVagasLoaded();
      }
    } catch (e) {
      console.warn('Erro ao carregar vagas:', e);
    }
  }

  function onVagasLoaded() {
    // Atualiza badges no cabeçalho/menu
    document.querySelectorAll('.vagas-count-badge').forEach(el => {
      el.textContent = vagasData.metadata.total || vagasData.vagas.length;
    });

    document.querySelectorAll('.vagas-sync-time').forEach(el => {
      el.textContent = vagasData.metadata.atualizado_em_formatado || 'Hoje';
    });

    // Se estiver em editoria com container de vagas, renderiza inline
    const inlineContainer = document.getElementById('painelVagasInline');
    if (inlineContainer) {
      renderVagasInline();
    }
  }

  // 2. Filtra as vagas
  function getFilteredVagas() {
    let list = vagasData.vagas || [];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(v =>
        (v.titulo && v.titulo.toLowerCase().includes(q)) ||
        (v.empresa && v.empresa.toLowerCase().includes(q)) ||
        (v.descricao && v.descricao.toLowerCase().includes(q)) ||
        (v.localizacao && v.localizacao.toLowerCase().includes(q))
      );
    }

    if (currentFilter === 'clt') {
      list = list.filter(v => v.tipo_contrato === 'CLT');
    } else if (currentFilter === 'estagio') {
      list = list.filter(v => v.tipo_contrato === 'Estágio' || (v.nivel && v.nivel.toLowerCase().includes('estágio')));
    } else if (currentFilter === 'pj') {
      list = list.filter(v => v.tipo_contrato === 'PJ');
    } else if (currentFilter === 'remoto') {
      list = list.filter(v => v.modalidade === 'Híbrido' || v.modalidade === 'Home Office');
    } else if (currentFilter === 'polos') {
      const anchors = ['embraer', 'johnson', 'ericsson', 'parque tecnológico', 'hospital', 'vivalle', 'vale sul'];
      list = list.filter(v => anchors.some(a => (v.empresa && v.empresa.toLowerCase().includes(a)) || (v.fonte && v.fonte.toLowerCase().includes(a))));
    }

    return list;
  }

  // 3. Renderiza o HTML de um Card de Vaga
  function renderCard(v) {
    const isAnchor = v.destaque;
    const badgeColor = isAnchor
      ? 'bg-amber-100 text-amber-900 border-amber-300'
      : 'bg-emerald-50 text-emerald-800 border-emerald-200';

    const modalidadeClass = v.modalidade === 'Home Office'
      ? 'bg-purple-50 text-purple-700 border-purple-200'
      : v.modalidade === 'Híbrido'
      ? 'bg-sky-50 text-sky-700 border-sky-200'
      : 'bg-slate-100 text-slate-700 border-slate-200';

    const icon = v.fonte_icone || 'fa-briefcase';

    return `
      <div class="bg-white rounded-xl border ${isAnchor ? 'border-amber-300 ring-1 ring-amber-300/50 shadow-sm' : 'border-slate-200 shadow-2xs'} p-5 hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between group">
        <div>
          <!-- Topo do Card: Origem + Tags -->
          <div class="flex items-center justify-between gap-2 mb-2.5">
            <span class="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-md border ${badgeColor}">
              <i class="fa-solid ${icon} text-[10px]"></i>
              ${v.fonte || 'Vagas SJC'}
            </span>
            <div class="flex items-center gap-1.5 text-[10px]">
              <span class="px-2 py-0.5 rounded border font-medium ${modalidadeClass}">${v.modalidade || 'Presencial'}</span>
              <span class="px-2 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase">${v.tipo_contrato || 'CLT'}</span>
            </div>
          </div>

          <!-- Título da Vaga -->
          <h4 class="text-[15px] sm:text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug mb-1.5">
            ${v.titulo}
          </h4>

          <!-- Empresa e Localização -->
          <div class="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-600 mb-3">
            <span class="font-semibold text-slate-800 flex items-center gap-1">
              <i class="fa-regular fa-building text-slate-400"></i> ${v.empresa}
            </span>
            <span class="text-slate-300">•</span>
            <span class="flex items-center gap-1 text-slate-500">
              <i class="fa-solid fa-location-dot text-rose-500 text-[11px]"></i> ${v.localizacao || 'São José dos Campos - SP'}
            </span>
          </div>

          <!-- Descrição / Resumo -->
          <p class="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
            ${v.descricao || 'Oportunidade aberta em São José dos Campos. Clique em candidatar-se para ver requisitos e envio de currículo.'}
          </p>
        </div>

        <!-- Rodapé do Card: Ação Direta -->
        <div class="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
          <span class="text-[11px] text-slate-400 font-medium">
            ${v.nivel ? `Nível: <strong class="text-slate-600">${v.nivel}</strong>` : 'Ver requisitos'}
          </span>
          <a href="${v.link_candidatura}" target="_blank" rel="noopener noreferrer"
             class="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs hover:shadow transition-all group-hover:scale-[1.02]">
            <span>Candidatar-se</span>
            <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
          </a>
        </div>
      </div>
    `;
  }

  // 4. Constrói o Modal Interativo de Vagas
  function createModal() {
    if (document.getElementById('modalVagasSJC')) return;

    const modalHTML = `
      <div id="modalVagasSJC" class="fixed inset-0 z-50 hidden" role="dialog" aria-modal="true">
        <!-- Backdrop escuro com blur -->
        <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" onclick="window.closeVagasModal()"></div>

        <!-- Caixa do Modal -->
        <div class="fixed inset-0 z-10 overflow-y-auto p-3 sm:p-6 lg:p-10 flex items-center justify-center">
          <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <!-- Cabeçalho do Modal -->
            <div class="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white border-b border-slate-700 shrink-0">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      ATUALIZADO 2X AO DIA (08H E 18H)
                    </span>
                    <span class="text-xs text-slate-400 hidden sm:inline">• SJC & Vale</span>
                  </div>
                  <h3 class="text-xl sm:text-2xl font-black font-serif text-white tracking-tight flex items-center gap-2">
                    <i class="fa-solid fa-briefcase text-emerald-400 text-lg"></i>
                    Vagas de Emprego em São José dos Campos
                  </h3>
                  <p class="text-xs sm:text-sm text-slate-300 mt-1">
                    Agregador unificado: Google Jobs, LinkedIn, PAT SJC e Carreiras de Polos Industriais & Tecnológicos.
                  </p>
                </div>
                <button onclick="window.closeVagasModal()" class="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all shrink-0" title="Fechar">
                  <i class="fa-solid fa-xmark text-lg"></i>
                </button>
              </div>

              <!-- Barra de Busca Rápida + Filtros dentro do Modal -->
              <div class="mt-4 pt-4 border-t border-slate-700/80 flex flex-col sm:flex-row gap-2.5">
                <div class="relative flex-1">
                  <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                  <input type="text" id="vagasModalSearch" placeholder="Buscar cargo (ex: Engenheiro, Vendas, TI, Técnico...)"
                         oninput="window.filterVagasSearch(this.value)"
                         class="w-full pl-9 pr-3 py-2 bg-slate-800/90 border border-slate-600 rounded-lg text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400">
                </div>
                <!-- Filtros em Pills -->
                <div class="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
                  <button onclick="window.setVagasFilter('todas')" class="vagas-btn-filter px-3 py-2 rounded-lg font-bold transition-all bg-emerald-500 text-slate-950" data-filter="todas">Todas</button>
                  <button onclick="window.setVagasFilter('polos')" class="vagas-btn-filter px-3 py-2 rounded-lg font-medium transition-all bg-slate-800 text-slate-300 hover:text-white border border-slate-700" data-filter="polos">Polos SJC</button>
                  <button onclick="window.setVagasFilter('clt')" class="vagas-btn-filter px-3 py-2 rounded-lg font-medium transition-all bg-slate-800 text-slate-300 hover:text-white border border-slate-700" data-filter="clt">CLT</button>
                  <button onclick="window.setVagasFilter('estagio')" class="vagas-btn-filter px-3 py-2 rounded-lg font-medium transition-all bg-slate-800 text-slate-300 hover:text-white border border-slate-700" data-filter="estagio">Estágio</button>
                  <button onclick="window.setVagasFilter('remoto')" class="vagas-btn-filter px-3 py-2 rounded-lg font-medium transition-all bg-slate-800 text-slate-300 hover:text-white border border-slate-700" data-filter="remoto">Híbrido/Remoto</button>
                </div>
              </div>
            </div>

            <!-- Corpo com Lista de Vagas -->
            <div class="p-5 sm:p-6 overflow-y-auto flex-1 bg-slate-50/60" id="vagasModalGrid">
              <!-- Cards inseridos via JS -->
            </div>

            <!-- Rodapé do Modal -->
            <div class="px-5 py-3.5 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 shrink-0">
              <div class="flex items-center gap-2 text-slate-600">
                <i class="fa-solid fa-shield-halved text-emerald-600 text-sm"></i>
                <span>Candidatura 100% gratuita nos sites oficiais das empresas.</span>
              </div>
              <div class="flex items-center gap-3">
                <span class="text-slate-400">Total: <strong id="vagasModalTotalCount" class="text-slate-900">0</strong> vagas</span>
                <button onclick="window.closeVagasModal()" class="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-all">
                  Fechar
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Evento Esc para fechar
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') window.closeVagasModal();
    });
  }

  // 5. Renderiza Vagas no Modal
  function renderModalGrid() {
    const grid = document.getElementById('vagasModalGrid');
    const totalCountEl = document.getElementById('vagasModalTotalCount');
    if (!grid) return;

    const list = getFilteredVagas();
    if (totalCountEl) totalCountEl.textContent = list.length;

    if (list.length === 0) {
      grid.innerHTML = `
        <div class="py-12 text-center">
          <div class="w-12 h-12 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center mx-auto mb-3 text-xl">
            <i class="fa-solid fa-magnifying-glass"></i>
          </div>
          <h4 class="text-base font-bold text-slate-800">Nenhuma vaga encontrada com esse filtro</h4>
          <p class="text-xs text-slate-500 mt-1 max-w-sm mx-auto">Tente buscar por termos mais genéricos (como "analista", "técnico", "são josé") ou clique em "Todas".</p>
          <button onclick="window.setVagasFilter('todas'); document.getElementById('vagasModalSearch').value = ''; window.filterVagasSearch('');"
                  class="mt-4 px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-all">
            Limpar Filtros
          </button>
        </div>
      `;
      return;
    }

    grid.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${list.map(renderCard).join('')}
      </div>
    `;
  }

  // 6. Renderiza Bloco Inline (para páginas que possuem o container, como editoria.html?cat=emprego)
  function renderVagasInline() {
    const container = document.getElementById('painelVagasInline');
    if (!container) return;

    const list = getFilteredVagas();

    container.innerHTML = `
      <div class="bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-emerald-900/60 mb-10">
        
        <!-- Header da Seção Inline -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-slate-950">
                <span class="w-2 h-2 rounded-full bg-emerald-900 animate-ping"></span>
                PAINEL DE EMPREGOS SJC
              </span>
              <span class="text-xs text-emerald-400 font-medium">
                <i class="fa-solid fa-arrows-rotate text-[10px] mr-1"></i> Revisado 2x ao dia (08h e 18h)
              </span>
            </div>
            <h3 class="text-2xl sm:text-3xl font-black font-serif text-white tracking-tight">
              Oportunidades em São José dos Campos
            </h3>
            <p class="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Agregação inteligente de vagas do LinkedIn, Google Jobs, PAT SJC e carreiras dos polos industriais e tecnológicos da cidade.
            </p>
          </div>

          <!-- Totalizador -->
          <div class="flex items-center gap-3 bg-slate-800/80 border border-slate-700 px-4 py-3 rounded-xl shrink-0">
            <div class="w-10 h-10 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center text-xl font-bold">
              <i class="fa-solid fa-briefcase"></i>
            </div>
            <div>
              <div class="text-xl sm:text-2xl font-black text-white leading-none">${vagasData.metadata.total || list.length}</div>
              <div class="text-[11px] text-slate-400 uppercase font-semibold">Vagas Abertas</div>
            </div>
          </div>
        </div>

        <!-- Barra de Filtros Inline -->
        <div class="mt-6 flex flex-col sm:flex-row gap-3">
          <div class="relative flex-1">
            <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
            <input type="text" id="vagasInlineSearch" placeholder="Buscar por cargo, empresa ou especialidade..."
                   oninput="window.filterVagasSearch(this.value)"
                   class="w-full pl-9 pr-3 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400">
          </div>
          <div class="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
            <button onclick="window.setVagasFilter('todas')" class="vagas-btn-filter px-3.5 py-2.5 rounded-xl font-bold transition-all ${currentFilter === 'todas' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'}" data-filter="todas">Todas</button>
            <button onclick="window.setVagasFilter('polos')" class="vagas-btn-filter px-3.5 py-2.5 rounded-xl font-medium transition-all ${currentFilter === 'polos' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'}" data-filter="polos">Polos SJC</button>
            <button onclick="window.setVagasFilter('clt')" class="vagas-btn-filter px-3.5 py-2.5 rounded-xl font-medium transition-all ${currentFilter === 'clt' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'}" data-filter="clt">CLT</button>
            <button onclick="window.setVagasFilter('estagio')" class="vagas-btn-filter px-3.5 py-2.5 rounded-xl font-medium transition-all ${currentFilter === 'estagio' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'}" data-filter="estagio">Estágio</button>
            <button onclick="window.setVagasFilter('remoto')" class="vagas-btn-filter px-3.5 py-2.5 rounded-xl font-medium transition-all ${currentFilter === 'remoto' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'}" data-filter="remoto">Híbrido/Remoto</button>
          </div>
        </div>

        <!-- Grade de Cards Inline -->
        <div class="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          ${list.map(renderCard).join('')}
        </div>

        <!-- Rodapé Informativo -->
        <div class="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <span>Última checagem: <strong class="text-slate-200">${vagasData.metadata.atualizado_em_formatado || 'Hoje'}</strong> • Próxima atualização: ${vagasData.metadata.proxima_atualizacao}</span>
          <span class="text-emerald-400 font-semibold"><i class="fa-solid fa-check-circle mr-1"></i> Vagas verificadas diretamente nas fontes abertas</span>
        </div>

      </div>
    `;
  }

  // 7. Funções Globais expostas para a interface
  window.openVagasModal = function () {
    createModal();
    const modal = document.getElementById('modalVagasSJC');
    if (modal) {
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      renderModalGrid();
    }
  };

  window.closeVagasModal = function () {
    const modal = document.getElementById('modalVagasSJC');
    if (modal) {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  };

  window.filterVagasSearch = function (val) {
    searchQuery = val;
    renderModalGrid();
    renderVagasInline();
  };

  window.setVagasFilter = function (filterKey) {
    currentFilter = filterKey;
    document.querySelectorAll('.vagas-btn-filter').forEach(btn => {
      const f = btn.getAttribute('data-filter');
      if (f === filterKey) {
        btn.className = 'vagas-btn-filter px-3.5 py-2 rounded-lg font-bold transition-all bg-emerald-500 text-slate-950';
      } else {
        btn.className = 'vagas-btn-filter px-3.5 py-2 rounded-lg font-medium transition-all bg-slate-800 text-slate-300 hover:text-white border border-slate-700';
      }
    });
    renderModalGrid();
    renderVagasInline();
  };

  // Inicialização automática ao carregar o DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      createModal();
      loadVagas();
    });
  } else {
    createModal();
    loadVagas();
  }

})();
