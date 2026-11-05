/**
 * Módulo Linha do Tempo, Geografia & História Municipal
 * Radar São José — Plataforma de Inteligência Municipal
 * Layout: Revista Digital & Atlas Visual Ilustrado (Editorial em Blocos)
 * Versão: 4.0.0 — Refatoração de Segurança, Acessibilidade, Performance e UX
 */

(function() {
  'use strict';

  // =========================================================================
  // 1. HELPERS DE SEGURANÇA & SANITIZAÇÃO (XSS PREVENTION)
  // =========================================================================

  /**
   * Garante retorno em string segura com fallback.
   */
  function safeText(value, fallback) {
    if (fallback === undefined) fallback = '';
    if (value === null || value === undefined) {
      return fallback;
    }
    return String(value);
  }

  /**
   * Escapa caracteres HTML perigosos para interpolação segura.
   */
  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Valida estritamente URLs externas, permitindo apenas http: e https:.
   * Rejeita protocolos perigosos como javascript:, data:, vbscript:.
   */
  function safeUrl(value) {
    if (!value || typeof value !== 'string') return null;
    try {
      const trimmed = value.trim();
      const url = new URL(trimmed, window.location.origin);
      if (!['http:', 'https:'].includes(url.protocol)) {
        return null;
      }
      return url.href;
    } catch (e) {
      return null;
    }
  }

  const FONTES_HISTORIA = {
    cronologia: {
      nome: "Cronologia — Pró-Memória / Câmara Municipal de São José dos Campos",
      url: "https://www.camarasjc.sp.gov.br/promemoria/cronologia-sjc/"
    },
    historiaPromemoria: {
      nome: "São José dos Campos e sua história — Pró-Memória / Câmara Municipal",
      url: "https://www.camarasjc.sp.gov.br/promemoria/historia-sjc/"
    },
    inpeHistoria: {
      nome: "História do INPE — Instituto Nacional de Pesquisas Espaciais",
      url: "https://www.gov.br/inpe/pt-br/acesso-a-informacao/institucional/historia"
    },
    inpeScd1: {
      nome: "30 anos do satélite SCD-1 — INPE",
      url: "https://www.gov.br/inpe/pt-br/assuntos/ultimas-noticias/30-anos-do-satelite-scd-1"
    },
    parqueCidade: {
      nome: "Parque da Cidade — Prefeitura de São José dos Campos",
      url: "https://sjc.sp.gov.br/servicos/esporte-e-qualidade-de-vida/parques/parque-da-cidade"
    },
    vicentina: {
      nome: "Parque Vicentina Aranha — Prefeitura de São José dos Campos",
      url: "https://www.sjc.sp.gov.br/servicos/esporte-e-qualidade-de-vida/parques/vicentina-aranha/"
    },
    eugenioMelo: {
      nome: "Eugênio de Melo — Prefeitura de São José dos Campos",
      url: "https://www.sjc.sp.gov.br/servicos/inovacao-e-desenvolvimento-economico/turismo/eugenio-de-melo/"
    },
    parqueTecnologico: {
      nome: "Parque Tecnológico: criação em 2006 — Prefeitura de São José dos Campos",
      url: "https://www.sjc.sp.gov.br/noticias/2021/novembro/29/parque-tecnologico-de-sao-jose-dos-campos-comemora-15-anos/"
    },
    cidadeInteligente: {
      nome: "Certificação da cidade — Prefeitura de São José dos Campos",
      url: "https://www.sjc.sp.gov.br/noticias/2022/marco/16/sao-jose-e-certificada-a-primeira-cidade-inteligente-do-brasil/"
    },
    ibge: {
      nome: "São José dos Campos: Censo e estimativa — IBGE",
      url: "https://www.ibge.gov.br/cidades-e-estados/sp/sao-jose-dos-campos.html"
    },
    mapaMunicipal: {
      nome: "Mapa e organização territorial — Prefeitura de São José dos Campos",
      url: "https://www.sjc.sp.gov.br/servicos/governanca/sao-jose-em-dados/mapa/"
    }
  };

  function fonteLinkHtml(fonte, rotulo) {
    if (!fonte) return '';
    const url = safeUrl(fonte.url);
    if (!url) return '';
    return `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 text-brand-800 hover:text-brand-950 underline underline-offset-2 font-bold">${escapeHtml(rotulo || fonte.nome)} <i class="fa-solid fa-arrow-up-right-from-square text-[9px]" aria-hidden="true"></i></a>`;
  }

  function fonteBairroAbntHtml(bairro) {
    if (!bairro) return '';
    if (bairro.loteRevisao === 'centro-2026-10-04' || bairro.layoutHistoria === 'editorial-v1') {
      return `<section class="border-t border-slate-200 pt-4 space-y-3" aria-label="Referências de ${escapeHtml(bairro.nome)}">
        <h5 class="text-[11px] font-black uppercase tracking-wider text-slate-500">Fontes para esta história</h5>
        <ol class="space-y-4">${(bairro.fontesRevisadas || []).map((f, index) => {
          const endereco = safeUrl(f.url);
          const href = f.paginaPdf ? endereco.split('#')[0] + '#page=' + encodeURIComponent(f.paginaPdf) : endereco;
          return `<li class="text-xs leading-relaxed min-w-0">
            <a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer" class="block text-brand-800 hover:text-brand-950 underline underline-offset-2 break-words [overflow-wrap:anywhere]">${index + 1}. ${escapeHtml(f.referencia)} Disponível em: ${escapeHtml(endereco)}. Acesso em: ${escapeHtml(f.acesso || '4 out. 2026.')}</a>
            ${f.pagina ? `<p class="mt-1 font-bold text-slate-700">Localização: página ${escapeHtml(f.pagina)}.</p>` : ''}
            ${f.nota ? `<p class="mt-1 text-slate-600">${escapeHtml(f.nota)}</p>` : ''}
          </li>`;
        }).join('')}</ol>
      </section>`;
    }
    let html = '';

    if (bairro.fontesRevisadas && bairro.fontesRevisadas.length > 0) {
      const refs = bairro.fontesRevisadas.map(function(f) {
        const endereco = safeUrl(f.url);
        const href = f.paginaPdf ? endereco.split('#')[0] + '#page=' + encodeURIComponent(f.paginaPdf) : endereco;
        const localizacao = f.pagina ? `Página${String(f.pagina).includes('–') ? 's' : ''} ${f.pagina} do documento.` : 'Sem paginação.';
        return `
          <div class="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
            <a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer" class="block text-xs sm:text-sm text-brand-800 hover:text-brand-900 underline underline-offset-2 break-words leading-relaxed font-medium">
              ${escapeHtml(f.referencia)} ${f.pagina ? escapeHtml('p. ' + f.pagina + '.') : ''} Disponível em: ${escapeHtml(f.url)}. Acesso em: 3 out. 2026.
            </a>
            <p class="text-xs text-slate-600 leading-relaxed italic border-l-2 border-brand-200 pl-3 mt-2">
              <span class="font-bold not-italic block mb-1">${escapeHtml(localizacao)}</span>
              "${escapeHtml(f.trecho || '')}"
            </p>
          </div>
        `;
      }).join('');
      
      const contexto = bairro.contextoFonte ? `
        <p class="text-xs text-slate-600 leading-relaxed mb-4 p-3 bg-indigo-50 text-indigo-900 rounded-lg border border-indigo-100">
          <i class="fa-solid fa-circle-info mr-1"></i> ${escapeHtml(bairro.contextoFonte)}
        </p>
      ` : '';

      html += `
        <div class="space-y-3">
          <h5 class="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
            <i class="fa-solid fa-book-bookmark text-slate-400"></i> Referências Documentadas
          </h5>
          ${contexto}
          <div class="space-y-3">
            ${refs}
          </div>
        </div>
      `;
    } else if (bairro.fonteUrl && bairro.fonte) {
      let href = safeUrl(bairro.fonteUrl);
      if (bairro.fontePagina && /\.pdf(?:$|#|\?)/i.test(href)) {
         href = `${href}#page=${encodeURIComponent(String(bairro.fontePagina).split(/[–-]/)[0].trim())}`;
      }
      
      html += `
        <div class="space-y-3">
          <h5 class="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
            <i class="fa-solid fa-link text-slate-400"></i> Fonte
          </h5>
          <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer" class="block text-xs sm:text-sm text-brand-800 hover:text-brand-900 underline underline-offset-2 break-words leading-relaxed font-medium">
              ${escapeHtml(bairro.fonte)}. São José dos Campos. ${bairro.fontePagina ? 'p. ' + escapeHtml(bairro.fontePagina) + '.' : ''}
            </a>
          </div>
        </div>
      `;
    } else {
      html += `
        <div class="p-4 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-3">
          <i class="fa-solid fa-triangle-exclamation text-amber-500 mt-0.5"></i>
          <div>
            <h5 class="text-xs font-black text-amber-800 mb-1">A verificar</h5>
            <p class="text-xs text-amber-700/80 leading-relaxed">As afirmações sobre este bairro ainda não foram cruzadas com fontes documentais específicas.</p>
          </div>
        </div>
      `;
    }

    return html;
  }

  const REGISTROS_HISTORICOS_CONFIRMADOS = [
    { id: "ev-1767", ano: 1767, eraId: "colonial", dataExata: "27 de julho de 1767", titulo: "Elevação à Vila de São José do Paraíba", resumo: "A cronologia da Câmara registra a ereção da vila e a criação da primeira Câmara de Vereadores em 1767.", fonte: FONTES_HISTORIA.cronologia },
    { id: "ev-1864", ano: 1864, eraId: "sanatorial", dataExata: "1864", titulo: "Elevação à categoria de Cidade", resumo: "A cronologia da Câmara registra que São José do Paraíba foi elevada à categoria de cidade pela Lei nº 27.", fonte: FONTES_HISTORIA.cronologia },
    { id: "ev-1877", ano: 1877, eraId: "sanatorial", dataExata: "1876–1877", titulo: "Conclusão da ferrovia e chegada do comboio inaugural", resumo: "A cronologia distingue a ferrovia pronta em 1876 da chegada do primeiro comboio de passageiros em 1877.", fonte: FONTES_HISTORIA.cronologia },
    { id: "ev-1924", ano: 1924, eraId: "sanatorial", dataExata: "27 de abril de 1924", titulo: "Inauguração do Sanatório Vicentina Aranha", resumo: "A Prefeitura registra a inauguração nessa data e identifica o Vicentina Aranha como o primeiro sanatório construído na cidade.", fonte: FONTES_HISTORIA.vicentina },
    { id: "ev-1961", ano: 1961, eraId: "tecnologica", dataExata: "1961", titulo: "Criação do GOCNAE", resumo: "O INPE registra que o decreto presidencial criou o GOCNAE, embrião do Instituto.", fonte: FONTES_HISTORIA.inpeHistoria },
    { id: "ev-1971", ano: 1971, eraId: "tecnologica", dataExata: "1971", titulo: "Criação do INPE", resumo: "A cronologia institucional do INPE registra a criação do Instituto em 1971.", fonte: FONTES_HISTORIA.inpeHistoria },
    { id: "ev-1993", ano: 1993, eraId: "tecnologica", dataExata: "9 de fevereiro de 1993", titulo: "Lançamento do satélite SCD-1", resumo: "O INPE registra o lançamento do SCD-1 na Flórida, após desenvolvimento e testes ligados ao Instituto em São José dos Campos.", fonte: FONTES_HISTORIA.inpeScd1 },
    { id: "ev-2006", ano: 2006, eraId: "contemporanea", dataExata: "4 de dezembro de 2006", titulo: "Criação do Parque Tecnológico", resumo: "A Prefeitura registra a criação do Parque Tecnológico por meio do Decreto Municipal nº 12.367/2006.", fonte: FONTES_HISTORIA.parqueTecnologico },
    { id: "ev-2022", ano: 2022, eraId: "contemporanea", dataExata: "2022", titulo: "Certificação municipal de Cidade Inteligente", resumo: "A Prefeitura publicou o anúncio da certificação de São José dos Campos como a primeira cidade inteligente certificada do Brasil.", fonte: FONTES_HISTORIA.cidadeInteligente }
  ];

  const REGISTRO_CONFIRMADO_POR_ID = REGISTROS_HISTORICOS_CONFIRMADOS.reduce(function(index, registro) { index[registro.id] = registro; return index; }, {});

  /**
   * Configura fallback de imagem seguro e centralizado em JS,
   * evitando loops infinitos de erro e inline onerrors.
   */
  function setupImageFallback(img, fallbackUrl) {
    if (!img) return;
    img.addEventListener('error', function() {
      if (img.dataset.fallbackApplied === 'true') return;
      img.dataset.fallbackApplied = 'true';
      img.src = fallbackUrl || 'web-media/capa_sjc_skyline-e75d8e49a056.webp';
    });
  }

  // =========================================================================
  // 2. ESTADO CENTRAL DO MÓDULO (COM LAZY RENDERING & CONTROLE DE FOCO)
  // =========================================================================

  const historiaState = {
    activeSection: 'ciclos',
    activeCicloIndex: 0,
    bairrosFilterRegiao: 'all',
    bairrosSearchQuery: '',
    activePrefeitosSubTab: 'personalidades',
    renderedSections: {
      ciclos: false,
      bairros: false,
      patrimonios: false,
      prefeitos: false,
      pioneiros: false,
      quiz: false,
      migracao: false
    },
    scrollPositions: {
      ciclos: 0,
      bairros: null,
      patrimonios: null,
      migracao: null,
      prefeitos: null,
      pioneiros: null,
      lendas: null,
      bibliografia: null
    },
    lastModalTrigger: null
  };

  // Exposição de referência de estado para compatibilidade
  window.historiaState = historiaState;

  // =========================================================================
  // 3. GERENCIADOR DE MODAIS ACESSÍVEIS (FOCUS TRAP, ESC, BACKDROP & RETORNO)
  // =========================================================================

  const ModalManager = {
    activeModals: [],
    focusableSelector: 'button:not([disabled]), [href]:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',

    open: function(modalId, triggerElement) {
      const modal = document.getElementById(modalId);
      if (!modal) return;

      // Salva elemento disparador para retorno de foco
      if (triggerElement && typeof triggerElement.focus === 'function') {
        historiaState.lastModalTrigger = triggerElement;
        modal._triggerEl = triggerElement;
      } else if (document.activeElement && document.activeElement !== document.body) {
        historiaState.lastModalTrigger = document.activeElement;
        modal._triggerEl = document.activeElement;
      }

      modal.classList.remove('hidden');

      if (!this.activeModals.includes(modalId)) {
        this.activeModals.push(modalId);
      }

      // Foco inicial no primeiro elemento interativo
      requestAnimationFrame(function() {
        const focusable = modal.querySelectorAll(ModalManager.focusableSelector);
        if (focusable.length > 0) {
          focusable[0].focus();
        } else {
          modal.focus();
        }
      });
    },

    close: function(modalId) {
      const modal = document.getElementById(modalId);
      if (!modal) return;

      modal.classList.add('hidden');
      this.activeModals = this.activeModals.filter(function(id) { return id !== modalId; });

      // Retorno do foco para o elemento original
      const trigger = modal._triggerEl || historiaState.lastModalTrigger;
      if (trigger && typeof trigger.focus === 'function') {
        try {
          trigger.focus();
        } catch (e) {}
      }
      modal._triggerEl = null;
    },

    closeTopmost: function() {
      if (this.activeModals.length > 0) {
        const topId = this.activeModals[this.activeModals.length - 1];
        this.close(topId);
        return true;
      }
      return false;
    },

    handleKeyDown: function(e) {
      if (ModalManager.activeModals.length === 0) return;

      const topId = ModalManager.activeModals[ModalManager.activeModals.length - 1];
      const modal = document.getElementById(topId);
      if (!modal || modal.classList.contains('hidden')) return;

      // ESC: fecha estritamente o modal de topo ativo
      if (e.key === 'Escape' || e.key === 'Esc') {
        e.preventDefault();
        e.stopPropagation();
        ModalManager.close(topId);
        return;
      }

      // Focus Trap acessível (Tab / Shift + Tab)
      if (e.key === 'Tab') {
        const focusables = Array.from(modal.querySelectorAll(ModalManager.focusableSelector));
        if (focusables.length === 0) {
          e.preventDefault();
          return;
        }

        const firstEl = focusables[0];
        const lastEl = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstEl || !modal.contains(document.activeElement)) {
            e.preventDefault();
            lastEl.focus();
          }
        } else {
          if (document.activeElement === lastEl || !modal.contains(document.activeElement)) {
            e.preventDefault();
            firstEl.focus();
          }
        }
      }
    },

    setupBackdropListeners: function() {
      const modalIds = ['historia-dossie-modal', 'modal-marcos-era', 'modal-porque-1767', 'historia-bibliografia-modal', 'historia-lendas-modal'];
      modalIds.forEach(function(id) {
        const modal = document.getElementById(id);
        if (!modal) return;
        modal.addEventListener('click', function(e) {
          // Fecha somente se o clique foi no fundo translúcido, nunca dentro da caixa de diálogo
          if (e.target === modal) {
            ModalManager.close(id);
          }
        });
      });
    }
  };

  // =========================================================================
  // 4. CONFIGURAÇÃO DE EVIDÊNCIAS & DADOS HISTÓRICOS ESTRUTURADOS
  // =========================================================================

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

  // Os 5 Grandes Ciclos Históricos com Storytelling & Ilustrações em Carvão
  const FONTES_CICLOS_REVISAO = {
  "cronologia": {
    "nome": "Cronologia — Pró-Memória",
    "url": "https://www.camarasjc.sp.gov.br/promemoria/cronologia-sjc/",
    "referencia": "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Cronologia. Pró-Memória, [s.d.].",
    "trecho": "Entradas de 1864 a 1951."
  },
  "historia": {
    "nome": "Papali, Zanetti e Olmo — história de São José",
    "url": "https://www.camarasjc.sp.gov.br/promemoria/historia-sjc/",
    "referencia": "PAPALI, Maria Aparecida; ZANETTI, Valéria; OLMO, Maria José Acedo del. São José dos Campos e sua história. Pró-Memória, [s.d.].",
    "trecho": "Parágrafos sobre café, fase sanatorial e industrialização."
  },
  "vicentina": {
    "nome": "Prefeitura — Vicentina Aranha",
    "url": "https://www.sjc.sp.gov.br/servicos/esporte-e-qualidade-de-vida/parques/vicentina-aranha/",
    "referencia": "SÃO JOSÉ DOS CAMPOS. Prefeitura. Vicentina Aranha. [s.d.].",
    "trecho": "Histórico do sanatório e do parque."
  },
  "embraer": {
    "nome": "Embraer — EMB 100 Bandeirante",
    "url": "https://embraer.com/centro-historico-aeronaves-historicas-emb-100-bandeirante/pt/",
    "referencia": "EMBRAER. EMB 100 Bandeirante. Centro Histórico, [s.d.].",
    "trecho": "Seções Desbravando caminhos e O nascimento da Embraer."
  },
  "inpe": {
    "nome": "INPE — História",
    "url": "https://www.gov.br/inpe/pt-br/acesso-a-informacao/institucional/historia",
    "referencia": "INSTITUTO NACIONAL DE PESQUISAS ESPACIAIS. História. [s.d.].",
    "trecho": "Cronologia: 1961, 1971 e 1993."
  },
  "scd": {
    "nome": "INPE — testes do SCD-1",
    "url": "https://www.gov.br/inpe/pt-br/acesso-a-informacao/perguntas-frequentes/principais-produtos-e-servicos-do-inpe/integracao-e-testes/qual-foi-o-primeiro-satelite",
    "referencia": "INSTITUTO NACIONAL DE PESQUISAS ESPACIAIS. Qual foi o primeiro satélite que o LIT testou? 23 set. 2024. Atualizado em: 24 set. 2024.",
    "trecho": "Resposta sobre o SCD-1."
  },
  "parque": {
    "nome": "Prefeitura — criação do Parque Tecnológico",
    "url": "https://www.sjc.sp.gov.br/noticias/2021/novembro/29/parque-tecnologico-de-sao-jose-dos-campos-comemora-15-anos/",
    "referencia": "AMARAL, José Roberto. Parque Tecnológico de São José dos Campos comemora 15 anos. Prefeitura de São José dos Campos, 29 nov. 2021. Atualizado em: 16 ago. 2024.",
    "trecho": "Criação em 2006 e seção Missão."
  },
  "certificacao": {
    "nome": "Prefeitura — anúncio da certificação de 2022",
    "url": "https://www.sjc.sp.gov.br/noticias/2022/marco/16/sao-jose-e-certificada-a-primeira-cidade-inteligente-do-brasil/",
    "referencia": "AMARAL, José Roberto. São José é certificada a primeira Cidade Inteligente do Brasil. Prefeitura de São José dos Campos, 16 mar. 2022. Atualizado em: 20 ago. 2024.",
    "trecho": "Parágrafos iniciais sobre normas e indicadores."
  }
};

  const CICLOS_EDITORIAIS = [
    {
      id: "ciclo-1",
      eraId: "colonial",
      numero: "01",
      epoca: "Século XVII – 1863",
      resumoFase: "Aldeamento & Vila",
      titulo: "Antes da cidade, uma aldeia indígena",
      subtitulo: "Do Rio Comprido à colina onde hoje está o Centro",
      imagem: "web-media/ciclo1_carvao_rembrandt-190a1639748d.webp",
      badgeColor: "bg-amber-500 text-amber-950",
      accentBorder: "border-amber-500/40",
      citacao: "O aniversário marca a criação da vila. A história começa antes.",
      narrativa: "Antes de existir São José dos Campos, indígenas já viviam na região. O núcleo que deu origem à cidade se formou perto do Rio Comprido, junto de uma fazenda de gado administrada por jesuítas. Era um aldeamento: um lugar onde a colonização reunia indígenas, impunha a religião cristã e organizava seu trabalho. Esse começo também foi marcado por disputas e perda de autonomia.\n\nMais tarde, o aldeamento mudou para a região onde hoje está a Igreja Matriz. O estudo do Pró-Memória situa essa transferência por volta de 1680. Assim, o começo da cidade passa por dois lugares: o Rio Comprido e o atual Centro.\n\nEm 27 de julho de 1767, a aldeia tornou-se a Vila de São José do Paraíba, com sua primeira Câmara. É esse marco que dá a data do aniversário municipal. A categoria de cidade viria em 1864; o nome São José dos Campos, em 1871.",
      marcosChave: [
        { ano: "1600–1650", desc: "Cronologia do Pró-Memória para a formação do aldeamento" },
        { ano: "c. 1680", desc: "Transferência do aldeamento segundo o estudo do Pró-Memória" },
        { ano: "1767", desc: "A aldeia é elevada à condição de vila" }
      ],
      curiosidade: "Ao visitar a Matriz, observe o lugar ocupado pela igreja: ele se liga à antiga aldeia, mas o prédio passou por reconstruções. A cronologia municipal registra obras iniciadas em 1933."
    },
    {
      id: "ciclo-2",
      eraId: "sanatorial-cafe",
      numero: "02",
      epoca: "1864 – 1923",
      resumoFase: "Café, Trem & Indústria",
      titulo: "Café, trabalho e a chegada do trem",
      subtitulo: "Cidade, café, trem e as primeiras fábricas",
      imagem: "web-media/ciclo2_trem_carvao-1b88e15a5a25.webp",
      badgeColor: "bg-orange-500 text-orange-950",
      accentBorder: "border-orange-500/40",
      citacao: "O trem mudou o tamanho do mundo de quem vivia aqui.",
      narrativa: "São José recebeu o título de cidade em 1864 e adotou o nome São José dos Campos em 1871. O café fazia parte de sua economia, mas o município não teve a riqueza das grandes cidades cafeeiras do Vale. O estudo de Papali, Zanetti e Olmo destaca pequenas e médias propriedades e o trabalho de pessoas escravizadas.\n\nA ferrovia acrescentou uma nova ligação a essa cidade agrícola. A cronologia do Pró-Memória distingue dois momentos: a linha ficou pronta em 1876 e o comboio inaugural de passageiros chegou em 1877, vindo de Jacareí.\n\nNo começo dos anos 1920, a cerâmica passou a fazer parte da produção local. Em 1923, foi inaugurado o Mercado Municipal. A São José deste período pode ser lida por esses lugares de trabalho: a lavoura, a estação, a fábrica e o mercado.",
      marcosChave: [
        { ano: "1864", desc: "São José é elevada à categoria de cidade" },
        { ano: "1876–1877", desc: "A ferrovia fica pronta e recebe o primeiro comboio" },
        { ano: "1923", desc: "Inauguração do Mercado Municipal" }
      ],
      curiosidade: "O Mercado Municipal liga este ciclo ao cotidiano atual: a cronologia registra sua inauguração em 1923, na Rua Sebastião Hummel."
    },
    {
      id: "ciclo-3",
      eraId: "sanatorial",
      numero: "03",
      epoca: "1924 – 1945",
      resumoFase: "Fase Sanatorial",
      titulo: "Quem chegava em busca de tratamento",
      subtitulo: "Sanatórios, médicos e a transformação da paisagem urbana",
      imagem: "web-media/ciclo3_sanatorio_carvao-f61d9348b9cf.webp",
      badgeColor: "bg-rose-500 text-rose-950",
      accentBorder: "border-rose-500/40",
      citacao: "Durante décadas, muita gente veio para São José em busca de ar e tratamento.",
      narrativa: "Antes de 1924, São José já recebia pessoas com tuberculose. Quem chegava precisava de atendimento e de um lugar para ficar. Pensões e serviços faziam parte dessa economia, movimentada pelos pacientes e por quem trabalhava para atendê-los.\n\nA inauguração do Sanatório Vicentina Aranha, em 27 de abril de 1924, deu outra dimensão a essa história. O conjunto foi projetado por Ramos de Azevedo. Em 1935, São José tornou-se estância climática; em 1938, o zoneamento separou áreas sanatoriais, industriais, residenciais e comerciais. O cuidado com a doença também organizava onde as pessoas podiam viver e trabalhar.\n\nEssa fase não terminou em 1945: as datas dos ciclos são recortes de leitura. O Vicentina teve outros usos de saúde antes de se tornar parque, em 2007. Seus pavilhões permitem acompanhar essas mudanças.",
      marcosChave: [
        { ano: "1924", desc: "Inauguração do Sanatório Vicentina Aranha" },
        { ano: "1938", desc: "Zoneamento separa os usos do espaço urbano" },
        { ano: "1935", desc: "São José é reconhecida como Estância Climatérica" }
      ],
      curiosidade: "O parque onde funcionou o Vicentina continua aberto. É possível visitar o espaço sem transformar a antiga doença em atração: a memória está nos prédios, nas histórias e no cuidado com o lugar."
    },
    {
      id: "ciclo-4",
      eraId: "tecnologica",
      numero: "04",
      epoca: "1946 – 1999",
      resumoFase: "Aeroespacial & ITA",
      titulo: "Das salas de aula aos aviões e satélites",
      subtitulo: "ITA, CTA, INPE e Embraer mudaram a direção de São José",
      imagem: "web-media/ciclo4_aeroespacial_carvao-fd6a5afc3a74.webp",
      badgeColor: "bg-cyan-400 text-cyan-950",
      accentBorder: "border-cyan-500/40",
      citacao: "Antes de fabricar aviões, São José criou um lugar para formar engenheiros.",
      narrativa: "A instalação do ITA em São José, em 1950, e a inauguração da Via Dutra, em 1951, fazem parte da mudança deste período. A cidade passou a reunir formação de engenheiros, pesquisa e novas atividades industriais.\n\nEm 22 de outubro de 1968, a equipe do CTA realizou o primeiro voo de teste do Bandeirante. Fazer um protótipo voar era uma etapa; fabricar e vender aviões exigia outra estrutura. A Embraer foi criada em 1969 e começou suas operações em 1970, assumindo a produção.\n\nA pesquisa espacial abriu outro caminho. O GOCNAE, criado em 1961, antecedeu o INPE, instituído em 1971. Em 1993, o SCD-1 chegou à órbita. Desenvolvido pelo Instituto e testado no seu Laboratório de Integração e Testes, foi lançado nos Estados Unidos. Por trás desses marcos estavam equipes de formação, projeto, fabricação e testes.",
      marcosChave: [
        { ano: "1950", desc: "O ITA começa a funcionar em São José" },
        { ano: "1968–1969", desc: "Bandeirante voa e a Embraer é criada" },
        { ano: "1993", desc: "O INPE lança o satélite SCD-1" }
      ],
      curiosidade: "O SCD-1 foi lançado nos Estados Unidos, mas foi desenvolvido e testado por brasileiros. São José participou dessa história mesmo quando o foguete decolou longe daqui."
    },
    {
      id: "ciclo-5",
      eraId: "contemporanea",
      numero: "05",
      epoca: "2000 – 2026",
      resumoFase: "Cidade Tecnológica",
      titulo: "A tecnologia encontra a vida nos bairros",
      subtitulo: "Parque Tecnológico, serviços urbanos e os desafios do presente",
      imagem: "web-media/ciclo5_smartcity_carvao-080158ec038f.webp",
      badgeColor: "bg-emerald-400 text-emerald-950",
      accentBorder: "border-emerald-500/40",
      citacao: "A tecnologia virou parte da paisagem, mas a cidade ainda precisa resolver problemas bem concretos.",
      narrativa: "Em 4 de dezembro de 2006, um decreto municipal criou o Parque Tecnológico. Seu núcleo ocupou uma fábrica desativada adquirida pela Prefeitura. A proposta era aproximar empresas, instituições de ensino e pesquisa, governo e financiamento para desenvolver novos projetos.\n\nEm março de 2022, a Prefeitura anunciou uma certificação concedida pela ABNT com base em três normas: ISO 37120, 37122 e 37123. Elas tratam de serviços urbanos e qualidade de vida, cidades inteligentes e resiliência. O anúncio descreve uma avaliação de 276 indicadores.\n\nPara quem vive na cidade, isso abre perguntas concretas: o deslocamento ficou mais fácil? O serviço público chega a quem precisa? Os bairros se beneficiam da mesma forma? São perguntas para acompanhar este período, e não resultados que a certificação, sozinha, permita afirmar.",
      marcosChave: [
        { ano: "2006", desc: "Criação do Parque Tecnológico" },
        { ano: "2022", desc: "Certificação pelas normas ISO 37120, 37122 e 37123" },
        { ano: "Hoje", desc: "A cidade testa soluções e ainda enfrenta escolhas" }
      ],
      curiosidade: "O mais interessante neste ciclo é acompanhar o que acontece depois do anúncio: se a tecnologia chega de fato à rotina de quem vive nos bairros."
    }
  ];

  // Patrimônios & Lugares Históricos para Visitação
  const PATRIMONIOS_EDITORIAIS = [
    {
      id: "pat-vicentina",
      nome: "Parque Vicentina Aranha",
      ano: "1924",
      categoria: "Fase Sanatorial",
      badgeClass: "bg-rose-100 text-rose-900 border-rose-200",
      imagem: "fotos_radar/vicentina_aranha_fachada.jpg",
      descricao: "Antigo sanatório para tratamento de tuberculose fundado pela Santa Casa de Misericórdia de SP. Possui capela neogótica assinada por Ramos de Azevedo e pavilhões históricos em meio a 445 mil m² de área verde.",
      destaque: "Patrimônio tombado pelo COMPHAC e CONDEPHAAT. Hoje é o principal polo cultural a céu aberto da cidade, com concertos, cinema e feiras literárias.",
      comoVisitar: "Rua Prudente M. Moraes, 301 - Vila Adyana • Aberto diariamente das 5h às 21h (Entrada Gratuita)"
    },
    {
      id: "pat-parque-cidade",
      nome: "Parque da Cidade (Residência Olivo Gomes / Tecelagem Parahyba)",
      ano: "1925 / 1951",
      categoria: "Industrial & Modernista",
      badgeClass: "bg-amber-100 text-amber-900 border-amber-200",
      imagem: "fotos_radar/parque_da_cidade_burle_marx.jpg",
      descricao: "Antiga Fazenda da Tecelagem Parahyba. Abriga a histórica Residência Olivo Gomes, projetada pelo arquiteto Rino Levi e circundada por jardins originais de Roberto Burle Marx.",
      destaque: "Conjunto modernista de relevância nacional tombado pelo IPHAN. Integra lago, trilhas na mata ciliar e o Museu do Folclore de SJC.",
      comoVisitar: "Av. Olivo Gomes, 100 - Santana (Zona Norte) • Aberto diariamente das 6h às 18h (Entrada Gratuita)"
    },
    {
      id: "pat-matriz",
      nome: "Igreja Matriz de São José",
      ano: "1680 / 1934",
      categoria: "Colonial & Religioso",
      badgeClass: "bg-emerald-100 text-emerald-900 border-emerald-200",
      imagem: "fotos_radar/igreja_matriz_sjc.jpg",
      descricao: "Marco de fundação do núcleo urbano joseense após a transferência do aldeamento do Rio Comprido para a colina do Banhado. Reconstruída em 1934 após o desabamento da antiga matriz de taipa de pilão.",
      destaque: "Localizada na Praça do Padre João, é o epicentro da memória sacra municipal e ponto inicial da tradicional Festa do Padroeiro (19 de março).",
      comoVisitar: "Praça Padre João, s/n - Centro Histórico • Aberta para visitação e celebrações religiosas"
    },
    {
      id: "pat-cta-ita",
      nome: "Campus DCTA / ITA (Complexo Niemeyer)",
      ano: "1950",
      categoria: "Aeroespacial & Arquitetura",
      badgeClass: "bg-cyan-100 text-cyan-900 border-cyan-200",
      imagem: "fotos_radar/campus_ita_niemeyer.jpg",
      descricao: "O campus do ITA é o único conjunto institucional completo desenhado por Oscar Niemeyer no Estado de São Paulo. Linhas modernistas arrojadas abrigam os alojamentos H-8, refeitório e salas de aula dos futuros engenheiros do país.",
      destaque: "Tombado pelo IPHAN pelo valor arquitetônico e histórico da fundação do polo aeroespacial sob idealização do Marechal Casimiro Montenegro.",
      comoVisitar: "Praça Marechal Eduardo Gomes, 50 - Vila das Acácias • Acesso sob autorização institucional ou eventos abertos"
    },
    {
      id: "pat-banhado",
      nome: "Orla do Banhado (Mirante e APA Histórica)",
      ano: "Geografia Ancestral",
      categoria: "Paisagem & Patrimônio Natural",
      badgeClass: "bg-blue-100 text-blue-900 border-blue-200",
      imagem: "fotos_radar/banhado_por_do_sol.jpg",
      descricao: "A famosa 'depressão verde' que abraça o Centro de São José. Antigo leito de meandros do Rio Paraíba do Sul e barreira topográfica de defesa nos tempos coloniais.",
      destaque: "Oferece o pôr do sol mais icônico do Vale do Paraíba a partir da Avenida São José, com vista privilegiada para o maciço da Serra da Mantiqueira.",
      comoVisitar: "Av. São José / Orla do Banhado - Centro • Acesso livre 24h a pé ou de bicicleta pela ciclovia"
    },
    {
      id: "pat-estacao-eugenio",
      nome: "Estação Ferroviária de Eugênio de Melo",
      ano: "1877 / 1898",
      categoria: "Ferroviário & Café",
      badgeClass: "bg-orange-100 text-orange-900 border-orange-200",
      imagem: "fotos_radar/estacao_eugenio_de_melo.jpg",
      descricao: "Construída pela Estrada de Ferro do Norte (posterior Central do Brasil), a estação foi o coração do escoamento do café e do algodão do leste paulista.",
      destaque: "Restaurada pela Fundação Cultural Cassiano Ricardo, funciona hoje como espaço cultural, biblioteca e centro de memória distrital.",
      comoVisitar: "Praça Emília Molina, 77 - Distrito de Eugênio de Melo • Aberto de terça a sábado para atividades e exposições"
    }
  ];

  // 10 Questões Estruturadas do Quiz de Joseensidade
  const QUIZ_QUESTIONS = [
    {
      id: 1,
      pergunta: "Em 27 de julho de 1767, São José dos Campos foi oficialmente elevada a qual categoria?",
      opcoes: [
        { id: "a", texto: "Capital da Província de São Paulo", correta: false },
        { id: "b", texto: "Vila de São José do Paraíba (com ereção do Pelourinho)", correta: true },
        { id: "c", texto: "Estância Hidromineral do Estado", correta: false },
        { id: "d", texto: "Distrito Militar de Proteção do Vale", correta: false }
      ],
      explicacao: "Em 27 de julho de 1767, o Ouvidor Afonso Botelho ergueu solenemente o Pelourinho e oficializou a Vila de São José do Paraíba, marco oficial dos 259 anos da cidade."
    },
    {
      id: 2,
      pergunta: "Qual parque histórico da Zona Norte possui residência projetada por Rino Levi e jardins de Roberto Burle Marx?",
      opcoes: [
        { id: "a", texto: "Parque Santos Dumont", correta: false },
        { id: "b", texto: "Parque da Cidade (antiga Tecelagem Parahyba / Residência Olivo Gomes)", correta: true },
        { id: "c", texto: "Parque Ribeirão Vermelho", correta: false },
        { id: "d", texto: "Parque Vicentina Aranha", correta: false }
      ],
      explicacao: "O Parque da Cidade era a antiga fazenda de Olivo Gomes (Tecelagem Parahyba), com conjunto modernista assinado por Rino Levi e Burle Marx."
    },
    {
      id: 3,
      pergunta: "Por qual motivo o bairro 'Jardim Satélite' tem suas principais avenidas batizadas de Andrômeda, Cassiopeia e Perseu?",
      opcoes: [
        { id: "a", texto: "Em homenagem a uma visita de astrônomos franceses em 1930", correta: false },
        { id: "b", texto: "Inspirado na corrida espacial e na vocação aeroespacial/CTA da cidade", correta: true },
        { id: "c", texto: "Nomes de antigos fazendeiros e tropeiros da região sul", correta: false },
        { id: "d", texto: "Exigência da Lei de Zoneamento da Rodovia Presidente Dutra", correta: false }
      ],
      explicacao: "Loteado nos anos 1960/70, o Jardim Satélite adotou a toponímia astronômica em celebração à instalação do ITA, CTA e INPE na cidade."
    },
    {
      id: 4,
      pergunta: "Quem foi o estudante e comerciário joseense que perdeu a vida em 1932 e formou a letra 'M' do movimento paulista M.M.D.C.?",
      opcoes: [
        { id: "a", texto: "Manoel Joaquim de Andrade", correta: false },
        { id: "b", texto: "Euclides Miragaia", correta: true },
        { id: "c", texto: "Marechal Casimiro Montenegro", correta: false },
        { id: "d", texto: "Mestre Zé Mira", correta: false }
      ],
      explicacao: "Euclides Miragaia tombou em combate na capital paulista em 23 de maio de 1932 na Revolução Constitucionalista, eternizando o 'M' do MMDC."
    },
    {
      id: 5,
      pergunta: "O Parque Vicentina Aranha foi inaugurado em 1924 com qual finalidade primordial?",
      opcoes: [
        { id: "a", texto: "Hangar e oficina de montagem dos primeiros aviões Bandeirante", correta: false },
        { id: "b", texto: "Sanatório para tratamento de doentes com tuberculose (Fase Sanatorial)", correta: true },
        { id: "c", texto: "Campus universitário da Faculdade de Odontologia", correta: false },
        { id: "d", texto: "Sede administrativa da Câmara e Prefeitura Municipal", correta: false }
      ],
      explicacao: "O Vicentina Aranha foi o maior sanatório da América Latina, atraindo pacientes e médicos sanitaristas pelo ar puro das montanhas."
    },
    {
      id: 6,
      pergunta: "Qual arquiteto de renome mundial projetou o campus residencial e acadêmico do CTA e do ITA na década de 1950?",
      opcoes: [
        { id: "a", texto: "Lúcio Costa", correta: false },
        { id: "b", texto: "Oscar Niemeyer", correta: true },
        { id: "c", texto: "Rino Levi", correta: false },
        { id: "d", texto: "Paulo Mendes da Rocha", correta: false }
      ],
      explicacao: "Oscar Niemeyer desenhou o complexo modernista do DCTA/ITA a convite do Marechal Casimiro Montenegro Filho, conjunto hoje tombado pelo IPHAN."
    },
    {
      id: 7,
      pergunta: "O bairro operário 'Parque Novo Horizonte' foi inaugurado em 1978 com uma característica toponímica única. Qual é?",
      opcoes: [
        { id: "a", texto: "Todas as ruas levam nomes de aves da Mata Atlântica", correta: false },
        { id: "b", texto: "Todas as ruas foram batizadas com nomes de profissões de trabalhadores", correta: true },
        { id: "c", texto: "As ruas são numeradas como na cidade de Nova York", correta: false },
        { id: "d", texto: "As ruas homenageiam capitais dos países da América Latina", correta: false }
      ],
      explicacao: "Criado pelo líder sindical Pedro Rocha para os operários, o bairro tem ruas como 'Rua dos Pedreiros', 'Rua dos Marceneiros' e 'Rua dos Eletricistas'."
    },
    {
      id: 8,
      pergunta: "Por que o bairro 'Campo dos Alemães' na Zona Sul recebeu esse nome histórico?",
      opcoes: [
        { id: "a", texto: "Uma colônia de imigrantes alemães fundou cervejarias no local em 1950", correta: false },
        { id: "b", texto: "Em 1906, a Companhia Tanífera Alemã estocava materiais e árvores de acácia na área da ferrovia", correta: true },
        { id: "c", texto: "Foi palco de treinamento do exército alemão na Primeira Guerra", correta: false },
        { id: "d", texto: "Homenagem aos engenheiros alemães que projetaram a Via Dutra", correta: false }
      ],
      explicacao: "Em 1906 a Companhia de Extração Tanífera Alemã arrendou a gleba férrea para estoque de madeira tanante, ficando conhecida pelos moradores como o 'campo dos alemães'."
    },
    {
      id: 9,
      pergunta: "Qual marco ambiental e paisagístico histórico debruça-se como uma grande 'muralha natural' sobre a colina do Centro Histórico?",
      opcoes: [
        { id: "a", texto: "O Parque dos Eucaliptos", correta: false },
        { id: "b", texto: "O Banhado (APA do Banhado)", correta: true },
        { id: "c", texto: "A Represa do Jaguari", correta: false },
        { id: "d", texto: "O Pico do Roncador", correta: false }
      ],
      explicacao: "O Banhado é a várzea protegida do Rio Paraíba do Sul que confere a São José o pôr do sol mais famoso da orla central da cidade."
    },
    {
      id: 10,
      pergunta: "Em 2022, São José dos Campos conquistou qual certificação internacional inédita no Brasil pela ABNT/ISO?",
      opcoes: [
        { id: "a", texto: "Capital Nacional da Gastronomia Caipira", correta: false },
        { id: "b", texto: "Primeira Cidade Inteligente, Sustentável e Resiliente do Brasil (ISO 37120)", correta: true },
        { id: "c", texto: "Maior Exportadora de Café do Vale do Paraíba", correta: false },
        { id: "d", texto: "Primeiro Município com Energia 100% Nuclear", correta: false }
      ],
      explicacao: "São José atingiu a pontuação máxima auditada em 276 indicadores internacionais de sustentabilidade, IA e serviços digitais integrados."
    }
  ];

  // Quiz de leitura crítica: somente perguntas sustentadas por fontes específicas abertas ao visitante.
  const QUIZ_VERIFICADO = [
    {
      id: 1,
      pergunta: "O que a cronologia da Câmara registra para 27 de julho de 1767?",
      opcoes: [{ id: "a", texto: "Elevação da aldeia à categoria de Vila de São José do Paraíba", correta: true }, { id: "b", texto: "Criação do Parque da Cidade", correta: false }, { id: "c", texto: "Chegada do primeiro trem de passageiros", correta: false }],
      explicacao: "A cronologia registra a ereção da vila nessa data e também a criação da primeira Câmara de Vereadores.",
      fonte: FONTES_HISTORIA.cronologia
    },
    {
      id: 2,
      pergunta: "Como a cronologia distingue os marcos da ferrovia?",
      opcoes: [{ id: "a", texto: "A ferrovia ficou pronta em 1877 e o trem chegou em 1876", correta: false }, { id: "b", texto: "A ferrovia ficou pronta em 1876 e o comboio inaugural chegou em 1877", correta: true }, { id: "c", texto: "Os dois marcos ocorreram em 1871", correta: false }],
      explicacao: "A distinção entre conclusão da linha e chegada do comboio inaugural evita reduzir etapas diferentes a uma única data.",
      fonte: FONTES_HISTORIA.cronologia
    },
    {
      id: 3,
      pergunta: "Em que ano o INPE registra o lançamento do satélite SCD-1?",
      opcoes: [{ id: "a", texto: "1971", correta: false }, { id: "b", texto: "1988", correta: false }, { id: "c", texto: "1993", correta: true }],
      explicacao: "O INPE registra o lançamento em 1993 e identifica o Kennedy Space Center, na Flórida, como local do lançamento.",
      fonte: FONTES_HISTORIA.inpeScd1
    },
    {
      id: 4,
      pergunta: "Qual comparação usa corretamente os dados do IBGE?",
      opcoes: [{ id: "a", texto: "697.054 é o Censo 2022; 729.153 é a estimativa 2026", correta: true }, { id: "b", texto: "Os dois números são censos realizados em 2022", correta: false }, { id: "c", texto: "729.153 é o total do Censo 2022", correta: false }],
      explicacao: "O perfil municipal do IBGE separa o resultado censitário de 2022 da estimativa populacional de 2026.",
      fonte: FONTES_HISTORIA.ibge
    },
    {
      id: 5,
      pergunta: "Quando foi inaugurado o Sanatório Vicentina Aranha, segundo a Prefeitura?",
      opcoes: [{ id: "a", texto: "27 de abril de 1924", correta: true }, { id: "b", texto: "27 de julho de 1767", correta: false }, { id: "c", texto: "4 de dezembro de 2006", correta: false }],
      explicacao: "A página municipal registra essa data e caracteriza o Vicentina como o primeiro sanatório construído em São José.",
      fonte: FONTES_HISTORIA.vicentina
    }
  ];

  const quizState = {
    answers: {},
    submitted: false
  };
  window.quizState = quizState;

  // Série antiga preservada apenas no inventário histórico; sua mistura de estimativas e censos não é publicada.
  const DEMOGRAFIA_SJC_DATA = {
    crescimento: [
      { ano: "1767", pop: 2150, evento: "Elevação a Vila Colonial (Censo Paroquial)", era: "Colonial" },
      { ano: "1872", pop: 12430, evento: "1º Censo Oficial do Império do Brasil", era: "Imperial / Café" },
      { ano: "1920", pop: 24700, evento: "Inauguração da Tecelagem Parahyba e Ferrovia", era: "Industrial Inicial" },
      { ano: "1940", pop: 36800, evento: "Auge da Estância Climatérica e Sanatórios", era: "Sanatorial" },
      { ano: "1960", pop: 78500, evento: "Implantação do ITA/CTA e Via Presidente Dutra", era: "Aeroespacial" },
      { ano: "1980", pop: 288000, evento: "Criação da EMBRAER, GM, Johnson e Johnson", era: "Explosão Industrial" },
      { ano: "2000", pop: 539300, evento: "Consolidação Tecnológica e Expansão Sul/Leste", era: "Metropolitana" },
      { ano: "2026", pop: 750000, evento: "1ª Smart City Certificada da América Latina", era: "Cidade Inteligente" }
    ],
    fluxosMigratorios: [
      {
        origem: "Minas Gerais (Sul de Minas & Mantiqueira)",
        participacao: "~28% da matriz migratória",
        periodo: "Século XVIII até Anos 1980",
        motivo: "Rotas históricas de tropeirismo pela Serra da Mantiqueira (SP-50 e SFX) e busca de empregos nas indústrias têxtil e metalmecânica.",
        marcasCulturais: "Culinária tropeira, Folia de Reis, Orquestra de Viola Caipira, sotaque acolhedor e bairros da Zona Norte (Santana, Freitas, SFX).",
        icone: "fa-mountain"
      },
      {
        origem: "Nordeste Brasileiro (Bahia, Pernambuco, Ceará, Paraíba)",
        participacao: "~25% da matriz migratória",
        periodo: "Anos 1960 até 1990",
        motivo: "Expansão da construção civil (construção do campus do ITA, Via Dutra, refinaria Revap) e grandes linhas de montagem automotiva.",
        marcasCulturais: "Fundação do Parque Novo Horizonte (bairro operário), feiras livres dominicais (Feira do Colonial), forró tradicional e forte vida comunitária.",
        icone: "fa-sun"
      },
      {
        origem: "Capital Paulista & Interior de São Paulo",
        participacao: "~22% da matriz migratória",
        periodo: "Anos 1930 até os dias atuais",
        motivo: "Fase dos sanatórios de tuberculose, migração de engenheiros do ITA, executivos da Embraer e famílias em busca de qualidade de vida e segurança.",
        marcasCulturais: "Urbanização verticalizada do Jardim Aquarius, Jardim Esplanada, Vila Ema e Vila Adyana.",
        icone: "fa-city"
      },
      {
        origem: "Imigração Internacional (Japoneses, Árabes, Alemães, Italianos)",
        participacao: "~10% da matriz histórica",
        periodo: "1900 até 1960",
        motivo: "Instalação da fábrica japonesa Kanebo do Brasil (1958), extração de madeira (Companhia Tanífera Alemã) e comércio tradicional da Rua 15.",
        marcasCulturais: "Bairros Jardim Oriente, Campo dos Alemães, comércio do Mercado Municipal e gastronomia árabe/italiana no Centro.",
        icone: "fa-earth-americas"
      },
      {
        origem: "Cientistas & Engenheiros Globais (EUA, Europa, Ásia)",
        participacao: "~5% de alta densidade técnica",
        periodo: "1950 até o presente",
        motivo: "Fundação do ITA com professores do MIT (EUA), criação do INPE e missões espaciais internacionais da EMBRAER.",
        marcasCulturais: "Cultura de inovação aeroespacial, patentes científicas, parques tecnológicos e condomínios do Urbanova.",
        icone: "fa-rocket"
      }
    ]
  };

  // =========================================================================
  // 5. RENDERIZADORES DE INTERFACE (LAZY RENDERING & DOM SEGURO)
  // =========================================================================

  /**
   * Inicialização e Renderização Inicial do Painel Histórico (Carregamento Otimizado)
   */
  function renderHistoriaDashboard() {
    // Garante visibilidade e preenchimento dos containers da Sidebar Lateral
    const parentContainer = document.getElementById("sidebar-historia-filters-container");
    const navContainer = document.getElementById("sidebar-historia-navigation-container");
    const eventFiltersContainer = document.getElementById("sidebar-historia-event-filters-container");
    if (parentContainer) parentContainer.classList.remove("hidden");
    if (navContainer) navContainer.classList.remove("hidden");
    if (eventFiltersContainer) eventFiltersContainer.classList.remove("hidden");

    // Sincroniza a sub-aba de filtros da sidebar com a seção ativa
    switchHistoriaSection(historiaState.activeSection || 'ciclos');

    // Renderiza a seção ativa padrão (ciclos) sob demanda
    if (!historiaState.renderedSections.ciclos) {
      renderCiclosCards();
      historiaState.renderedSections.ciclos = true;
    }
    initHistoriaKeyboardNav();
  }

  /**
   * Alternar entre as Grandes Seções Editoriais (Com Memória de Scroll Independente, Lazy Rendering, aria-current & Sidebar Dinâmica)
   */
  function switchHistoriaSection(sectionId) {
    if (!sectionId) return;
    if (sectionId === historiaState.activeSection) return;

    const HEADER_OFFSET = 80;

    function getHistoriaContentTop() {
      const hv = document.getElementById('historia-view');
      if (!hv) return 0;
      return Math.max(0, hv.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET);
    }

    // 1. Salvar deslocamento do usuário na seção atual relativo ao topo do conteúdo
    const currentSection = historiaState.activeSection;
    if (currentSection && historiaState.scrollPositions) {
      const contentTop = getHistoriaContentTop();
      // Quanto o usuário desceu abaixo do topo do conteúdo
      historiaState.scrollPositions[currentSection] = Math.max(0, window.scrollY - contentTop);
    }

    historiaState.activeSection = sectionId;

    const sections = ['ciclos', 'bairros', 'patrimonios', 'migracao', 'prefeitos', 'pioneiros', 'lendas', 'bibliografia'];
    sections.forEach(function(sec) {
      const el = document.getElementById('section-view-' + sec);
      const sideBtn = document.getElementById('side-btn-section-' + sec);
      const topBtn = document.getElementById('btn-section-' + sec);
      const sideFiltersBlock = document.getElementById('historia-sidebar-filters-' + sec);

      if (el) {
        if (sec === sectionId) {
          el.classList.remove('hidden');
        } else {
          el.classList.add('hidden');
        }
      }

      // Estilo do Botão da Sidebar Lateral e Atributo aria-current
      if (sideBtn) {
        const icon = sideBtn.querySelector('.historia-icon');
        if (sec === sectionId) {
          sideBtn.className = "historia-nav-btn w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold text-left transition-all bg-[#a45b16] text-white shadow-xs cursor-pointer";
          sideBtn.style.setProperty('background-color', '#a45b16', 'important');
          sideBtn.style.setProperty('border-color', '#a45b16', 'important');
          sideBtn.style.setProperty('color', '#ffffff', 'important');
          sideBtn.setAttribute('aria-current', 'page');
          if (icon) {
            icon.style.setProperty('color', '#ffffff', 'important');
          }
        } else {
          sideBtn.className = "historia-nav-btn w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-left transition-all text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent cursor-pointer";
          sideBtn.style.removeProperty('background-color');
          sideBtn.style.removeProperty('border-color');
          sideBtn.style.removeProperty('color');
          sideBtn.removeAttribute('aria-current');
          if (icon) {
            icon.style.setProperty('color', '#a45b16', 'important');
          }
        }
      }

      // Alternar Sub-blocos de Filtros Contextuais na Sidebar Lateral
      if (sideFiltersBlock) {
        if (sec === sectionId) {
          sideFiltersBlock.classList.remove('hidden');
        } else {
          sideFiltersBlock.classList.add('hidden');
        }
      }

      // Fallback caso exista topBtn
      if (topBtn) {
        if (sec === sectionId) {
          topBtn.className = "px-4 py-2.5 rounded-xl font-bold text-xs transition-all bg-brand-900 text-white shadow-xs flex items-center gap-2 cursor-pointer";
          topBtn.setAttribute('aria-current', 'page');
        } else {
          topBtn.className = "px-4 py-2.5 rounded-xl font-bold text-xs transition-all text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center gap-2 cursor-pointer";
          topBtn.removeAttribute('aria-current');
        }
      }
    });

    // Lazy Rendering sob Demanda: só renderiza a seção se ainda não estiver pronta no DOM
    if (sectionId === 'bairros' && !historiaState.renderedSections.bairros) {
      renderBairrosEditorial();
      historiaState.renderedSections.bairros = true;
    } else if (sectionId === 'patrimonios' && !historiaState.renderedSections.patrimonios) {
      renderPatrimoniosEditorial();
      historiaState.renderedSections.patrimonios = true;
    } else if (sectionId === 'prefeitos' && !historiaState.renderedSections.prefeitos) {
      renderPrefeitosEditorial();
      historiaState.renderedSections.prefeitos = true;
    } else if (sectionId === 'pioneiros' && !historiaState.renderedSections.pioneiros) {
      renderPioneirosEditorial();
      historiaState.renderedSections.pioneiros = true;
    } else if (sectionId === 'quiz' && !historiaState.renderedSections.quiz) {
      renderQuizJoseensidade();
      historiaState.renderedSections.quiz = true;
    } else if (sectionId === 'migracao') {
      if (!historiaState.renderedSections.migracao) {
        renderMigracaoJoseenses();
        historiaState.renderedSections.migracao = true;
      } else if (typeof _migracaoLeafletMap !== 'undefined' && _migracaoLeafletMap) {
        setTimeout(function() {
          try {
            _migracaoLeafletMap.invalidateSize();
          } catch (e) {}
        }, 150);
      }
    } else if (sectionId === 'lendas') {
      openHistoriaLendas();
    } else if (sectionId === 'bibliografia') {
      openHistoriaBibliografia();
    }

    // 2. Restaurar a posição memorizada de scroll relativa ao topo do conteúdo
    const performScrollRestore = function() {
      const contentTop = getHistoriaContentTop();
      const savedOffset = (historiaState.scrollPositions && historiaState.scrollPositions[sectionId] !== null && historiaState.scrollPositions[sectionId] !== undefined)
        ? historiaState.scrollPositions[sectionId]
        : 0; // Se nunca visitou, offset é 0 -> abre exatamente no topo do conteúdo!

      const targetY = contentTop + savedOffset;

      const docEl = document.documentElement;
      const bodyEl = document.body;

      // Desativa scroll-behavior: smooth (definido no CSS em html, body) para salto instantâneo preciso
      docEl.style.setProperty('scroll-behavior', 'auto', 'important');
      bodyEl.style.setProperty('scroll-behavior', 'auto', 'important');

      window.scrollTo(0, targetY);

      // Restaura o comportamento suave após o salto
      requestAnimationFrame(function() {
        docEl.style.removeProperty('scroll-behavior');
        bodyEl.style.removeProperty('scroll-behavior');
      });
    };

    requestAnimationFrame(function() {
      requestAnimationFrame(performScrollRestore);
    });
  }

  /**
   * Renderizar Grade dos 5 Ciclos Históricos (Preservando Design Visual e Rembrandt Chiaroscuro)
   */
  function renderCiclosCards() {
    const container = document.getElementById("ciclos-cards-container");
    if (!container) return;

    const fontesPorCiclo = [
      [FONTES_HISTORIA.cronologia, FONTES_HISTORIA.historiaPromemoria],
      [FONTES_CICLOS_REVISAO.cronologia, FONTES_CICLOS_REVISAO.historia],
      [FONTES_CICLOS_REVISAO.vicentina, FONTES_CICLOS_REVISAO.historia, FONTES_CICLOS_REVISAO.cronologia],
      [FONTES_CICLOS_REVISAO.cronologia, FONTES_CICLOS_REVISAO.embraer, FONTES_CICLOS_REVISAO.inpe, FONTES_CICLOS_REVISAO.scd],
      [FONTES_CICLOS_REVISAO.parque, FONTES_CICLOS_REVISAO.certificacao]
    ];
    const resumoPorCiclo = CICLOS_EDITORIAIS.map(function(ciclo) {
      return ciclo.narrativa;
    });
    const navega = `<div class="flex gap-2 overflow-x-auto pb-2" role="group" aria-label="Escolha um período histórico">${CICLOS_EDITORIAIS.map(function(c, i) { return `<button type="button" data-scroll-ciclo="${escapeHtml(c.eraId)}" class="shrink-0 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:border-brand-700 hover:bg-slate-50 text-left transition-colors"><span class="block text-[10px] font-black uppercase tracking-wider text-slate-500">Etapa ${i + 1}</span><span class="block text-xs font-bold text-slate-900">${escapeHtml(c.epoca)}</span></button>`; }).join('')}</div>`;
    let html = navega;
    CICLOS_EDITORIAIS.forEach(function(ciclo, idx) {
      const reverse = idx % 2 === 1 ? 'lg:flex-row-reverse' : '';
      const fontesHtml = fontesPorCiclo[idx].map(function(f) { return fonteLinkHtml(f); }).join('<span class="text-slate-300">·</span>');
      const narrativaHtml = escapeHtml(resumoPorCiclo[idx]).split(/\n\n+/).map(function(paragrafo) {
        return `<p>${paragrafo}</p>`;
      }).join('');

      html += `
        <article id="historia-ciclo-${escapeHtml(ciclo.eraId)}" style="scroll-margin-top: 24px" class="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden hover:shadow-md transition-all flex flex-col lg:flex-row ${reverse} group">
          <!-- Bloco de Imagem Ilustrada em Carvão (Estilo Rembrandt) -->
          <div class="lg:w-5/12 relative min-h-[280px] sm:min-h-[320px] overflow-hidden bg-[#1c1815]">
            <img 
              src="${escapeHtml(ciclo.imagem)}" 
              alt="${escapeHtml(ciclo.titulo)}" 
              loading="lazy" 
              decoding="async" 
              class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ciclo-img-lazy"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-between p-6">
              <div class="flex items-center justify-between">
                <span class="px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase shadow-sm ${ciclo.badgeColor}">
                  Ciclo ${escapeHtml(ciclo.numero)}
                </span>
                <span class="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-amber-200 text-[11px] font-mono font-black border border-amber-500/30 shadow-xs">
                  ${escapeHtml(ciclo.epoca)}
                </span>
              </div>

            </div>
          </div>

          <!-- Bloco Narrativo Editorial -->
          <div class="lg:w-7/12 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div class="space-y-3">
              <div>
                <span class="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Linha Temporal Histórica</span>
                <h3 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                  ${escapeHtml(ciclo.titulo)}
                </h3>
              <p class="text-xs font-bold text-brand-800 mt-0.5">${escapeHtml(ciclo.epoca)} · síntese com referências abertas</p>
              </div>

              <div class="space-y-3 text-sm text-slate-700 leading-relaxed font-normal">
                ${narrativaHtml}
              </div>

              <div class="flex flex-wrap items-center gap-x-3 gap-y-1 pt-2 text-[11px]">
                <span class="font-black uppercase tracking-wider text-slate-500">Fontes:</span>
                ${fontesHtml}
              </div>
            </div>

            <!-- Rodapé do Card com Curiosidade & Botão Dossiê da Era -->
            <div class="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 -mx-6 sm:-mx-8 -mb-6 sm:-mb-8 p-4 sm:px-8">
              <div class="flex items-center gap-2 text-xs text-slate-600">
                <i class="fa-solid fa-book-open text-brand-800 shrink-0"></i>
                <span class="text-[11px] leading-tight text-slate-600">Abra a documentação e compare o que cada instituição registra.</span>
              </div>
              <button 
                type="button" 
                onclick="window.Historia ? window.Historia.openCicloMarcosModal('${ciclo.eraId}') : window.openCicloDossieModal('${ciclo.eraId}')" 
                data-era-id="${ciclo.eraId}"
                class="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shrink-0 flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <span>Explorar registros</span>
                <i class="fa-solid fa-arrow-right text-[10px]"></i>
              </button>
            </div>
          </div>
        </article>
      `;
    });

    container.innerHTML = html;

    // Configuração de fallback seguro nas imagens dos ciclos
    container.querySelectorAll('.ciclo-img-lazy').forEach(function(img) {
      setupImageFallback(img, 'web-media/capa_sjc_skyline-e75d8e49a056.webp');
    });
  }

  function selectCiclo(index) {
    if (typeof index === 'number' && CICLOS_EDITORIAIS[index]) {
      const el = document.getElementById('historia-ciclo-' + CICLOS_EDITORIAIS[index].eraId);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function navigateCiclo() {}

  /**
   * Ficha editorial do ciclo, com contexto e referências bibliográficas.
   */
  function openCicloMarcosModal(eraId) {
    const data = window.HISTORIA_SJC_DATA;
    if (!data || !data.eventos) return;

    const modal = document.getElementById("modal-marcos-era");
    if (!modal) return;

    const eraObj = eraId === "sanatorial-cafe"
      ? { nome: "Cidade, ferrovia e indústria", periodo: "1864 – 1923" }
      : (data.eras || []).find(function(e) { return e.id === eraId; }) || { nome: "Era Histórica", periodo: "São José dos Campos" };

    const badgeEl = document.getElementById("modal-marcos-era-badge");
    const periodoEl = document.getElementById("modal-marcos-era-periodo");
    const listEl = document.getElementById("modal-marcos-era-list");

    if (badgeEl) badgeEl.textContent = safeText(eraObj.nome, 'Era Histórica');
    if (periodoEl) periodoEl.textContent = safeText(eraObj.periodo, 'São José dos Campos');

    if (listEl) {
      if (eraId === 'colonial') {
        const fontesCiclo1 = [
          { nome: "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Cronologia. Pró-Memória, [s.d.]. Ver entradas 1600–1650, 1653–1680, 1759, 1766, 1767 e 1933. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/cronologia-sjc/. Acesso em: 3 out. 2026.", url: FONTES_HISTORIA.cronologia.url },
          { nome: "PAPALI, Maria Aparecida; ZANETTI, Valéria; OLMO, Maria José Acedo del. São José dos Campos e sua história. Pró-Memória, [s.d.]. Ver os parágrafos iniciais, sobre aldeamento e vila. Disponível em: https://www.camarasjc.sp.gov.br/promemoria/historia-sjc/. Acesso em: 3 out. 2026.", url: FONTES_HISTORIA.historiaPromemoria.url }
        ];
        listEl.innerHTML = `
          <div class="space-y-4">
            <section class="p-4 rounded-2xl bg-brand-50 border border-brand-100">
              <h4 class="text-sm font-bold text-slate-900 mb-2">Quem vivia ali?</h4>
              <p class="text-sm leading-relaxed text-slate-700">Os indígenas eram os primeiros habitantes. O estudo de Papali, Zanetti e Olmo descreve o aldeamento como parte da disputa entre colonos e jesuítas pelo controle de seu trabalho. A formação de São José ocorreu dentro dessas relações de poder.</p>
            </section>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <section class="p-4 rounded-2xl border border-slate-200 bg-white">
                <h4 class="text-sm font-bold text-slate-900 mb-2">Quando a aldeia mudou de lugar?</h4>
                <p class="text-sm leading-relaxed text-slate-700">A cronologia situa o aldeamento entre 1600 e 1650 e sua provável transferência entre 1653 e 1680. O estudo histórico aponta aproximadamente 1680. São estimativas, não datas exatas de fundação.</p>
              </section>
              <section class="p-4 rounded-2xl border border-slate-200 bg-white">
                <h4 class="text-sm font-bold text-slate-900 mb-2">O que mudou em 1767?</h4>
                <p class="text-sm leading-relaxed text-slate-700">A criação da vila trouxe a primeira Câmara. Segundo o estudo, a decisão também atendia à política do governador Morgado de Mateus de vigiar a população indígena e evitar sua dispersão.</p>
              </section>
            </div>
            <section class="p-4 rounded-2xl border border-slate-200 bg-slate-50/70">
              <h4 class="text-sm font-bold text-slate-900 mb-2">Um retrato às vésperas da vila</h4>
              <p class="text-sm leading-relaxed text-slate-700">Para 1766, a cronologia registra 94 casas, 205 mulheres e 159 homens. É um registro daquele núcleo: não deve ser comparado diretamente à população do município atual.</p>
            </section>
            <section class="p-4 rounded-2xl border border-slate-200 bg-white">
              <h4 class="text-sm font-bold text-slate-900 mb-3">Leia as fontes deste ciclo</h4>
              <p class="text-xs text-slate-500 mb-3">Referências em páginas da web, sem paginação. Os trechos indicados ajudam a localizar cada informação.</p>
              <div class="space-y-3">${fontesCiclo1.map(function(f) { return `<a href="${safeUrl(f.url)}" target="_blank" rel="noopener noreferrer" class="block p-3 rounded-xl bg-slate-50 hover:bg-cyan-50 border border-slate-100 text-xs leading-relaxed text-slate-700 underline underline-offset-2 break-words">${escapeHtml(f.nome)}</a>`; }).join('')}</div>
            </section>
          </div>
        `;
        ModalManager.open("modal-marcos-era");
        return;
      }
      const contextoPorEra = {
        'sanatorial-cafe': {
          rotulo: 'O acontecimento central',
          central: 'A ferrovia aproximou São José dos Campos de outras cidades e ajudou a criar as condições para uma economia mais industrial. O trem trouxe passageiros, mercadorias e novas possibilidades de trabalho; as primeiras cerâmicas se instalaram no começo dos anos 1920.',
          registros: ['A cidade foi elevada à categoria de cidade em 1864.', 'A ferrovia foi concluída em 1876 e recebeu seu primeiro comboio de passageiros em 1877.', 'A cronologia registra a inauguração do Mercado Municipal em 1923.'],
          cuidado: 'A chegada do trem foi decisiva, mas não explica sozinha a industrialização. Ela faz parte de um processo que envolve circulação, trabalho, investimentos e novas instituições.',
          hoje: 'A Estação de Eugênio de Melo, o Parque da Cidade e os antigos espaços industriais ajudam a localizar essa transformação na paisagem atual.',
          fontes: [FONTES_CICLOS_REVISAO.cronologia, FONTES_CICLOS_REVISAO.historia]
        },
        sanatorial: {
          rotulo: 'O acontecimento central',
          central: 'No começo do século XX, São José dos Campos ficou conhecida como destino de tratamento para pessoas com tuberculose. Sanatórios, pensões e serviços de saúde mudaram a economia e a paisagem urbana.',
          registros: ['O Sanatório Vicentina Aranha foi inaugurado em 27 de abril de 1924.', 'Em 1935, São José foi reconhecida como Estância Climática.', 'O Vicentina passou a hospital geriátrico em 1980 e abriu como parque em 2007, segundo a Prefeitura.'],
          cuidado: 'O recorte 1924–1945 não indica o fim de todos os sanatórios. A atividade de saúde do Vicentina continuou por décadas. O estudo histórico também descreve como o planejamento sanitário separava os espaços de pacientes e trabalhadores.',
          hoje: 'O Parque Vicentina Aranha preserva edifícios, jardins e memórias dessa fase, agora como espaço público de cultura, lazer e convivência.',
          fontes: [FONTES_CICLOS_REVISAO.vicentina, FONTES_CICLOS_REVISAO.historia, FONTES_CICLOS_REVISAO.cronologia]
        },
        tecnologica: {
          rotulo: 'O acontecimento central',
          central: 'A cidade passou a formar engenheiros e concentrar pesquisa tecnológica. A criação do CTA, do ITA, do INPE e da Embraer mudou o perfil econômico de São José dos Campos e conectou o município a projetos nacionais de aviação e espaço.',
          registros: ['O GOCNAE foi criado em 1961; o INPE foi instituído em 1971.', 'O CTA e o ITA formaram a base científica e tecnológica do setor aeronáutico.', 'O primeiro teste do Bandeirante foi em 22 de outubro de 1968; a Embraer foi criada em 1969 e iniciou operações em 1970.', 'O SCD-1 foi lançado em 9 de fevereiro de 1993, após desenvolvimento pelo INPE e testes no seu Laboratório de Integração e Testes.'],
          cuidado: 'São José participou do desenvolvimento tecnológico do SCD-1, mas o lançamento ocorreu na Flórida. Separar essas etapas evita atribuir à cidade um fato que aconteceu em outro lugar.',
          hoje: 'DCTA, ITA, INPE e empresas aeroespaciais continuam presentes na cidade, embora parte de suas instalações tenha acesso controlado.',
          fontes: [FONTES_CICLOS_REVISAO.cronologia, FONTES_CICLOS_REVISAO.embraer, FONTES_CICLOS_REVISAO.inpe, FONTES_CICLOS_REVISAO.scd]
        },
        contemporanea: {
          rotulo: 'O acontecimento central',
          central: 'São José dos Campos passou a apresentar inovação como parte da política urbana. O Parque Tecnológico ocupa uma área industrial histórica e reúne pesquisa, empresas e formação profissional.',
          registros: ['O Parque Tecnológico foi criado em 4 de dezembro de 2006, pelo Decreto Municipal nº 12.367/2006.', 'O anúncio de 2022 registra 276 indicadores nas normas ISO 37120, 37122 e 37123.', 'A ideia de cidade inteligente envolve serviços e indicadores; ela não encerra os desafios cotidianos dos bairros.'],
          cuidado: 'Receber uma certificação não significa que todos os problemas urbanos foram resolvidos. É preciso consultar os indicadores e observar como as políticas chegam à vida das pessoas.',
          hoje: 'O período continua aberto: dados públicos, mobilidade, acesso a serviços e participação dos moradores ajudam a acompanhar o próximo capítulo da cidade.',
          fontes: [FONTES_CICLOS_REVISAO.parque, FONTES_CICLOS_REVISAO.certificacao]
        }
      };
      const contexto = contextoPorEra[eraId];
      if (contexto) {
        const fontesContexto = contexto.fontes.map(function(f) { return `<a href="${safeUrl(f.url)}" target="_blank" rel="noopener noreferrer" class="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 hover:bg-cyan-50 border border-slate-100 hover:border-cyan-200 transition-colors"><span class="text-xs leading-relaxed text-slate-700 break-words">${escapeHtml(f.referencia)} Disponível em: ${escapeHtml(f.url)}. Acesso em: 3 out. 2026. ${escapeHtml(f.trecho)} Sem paginação.</span><i class="fa-solid fa-arrow-up-right-from-square text-[10px] text-cyan-700"></i></a>`; }).join('');
        const registrosContexto = contexto.registros.map(function(item) { return `<li>${escapeHtml(item)}</li>`; }).join('');
        listEl.innerHTML = `<div class="space-y-4 mb-4"><section class="p-4 rounded-2xl bg-brand-50 border border-brand-100"><p class="text-[10px] font-black uppercase tracking-widest text-brand-800 mb-2">${contexto.rotulo}</p><p class="text-sm leading-relaxed text-slate-700">${escapeHtml(contexto.central)}</p></section><div class="grid grid-cols-1 sm:grid-cols-2 gap-3"><section class="p-4 rounded-2xl border border-slate-200 bg-white"><p class="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">O que os registros indicam</p><ul class="space-y-2 text-xs leading-relaxed text-slate-700 list-disc pl-4">${registrosContexto}</ul></section><section class="p-4 rounded-2xl border border-amber-200 bg-amber-50/60"><p class="text-[10px] font-black uppercase tracking-widest text-amber-900 mb-2">O que pede cuidado</p><p class="text-xs leading-relaxed text-amber-950">${escapeHtml(contexto.cuidado)}</p></section></div><section class="p-4 rounded-2xl border border-slate-200 bg-slate-50/70"><p class="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Onde perceber isso hoje</p><p class="text-xs leading-relaxed text-slate-700">${escapeHtml(contexto.hoje)}</p></section><section class="p-4 rounded-2xl border border-slate-200 bg-white"><p class="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Fontes que sustentam esta leitura</p><div class="space-y-2">${fontesContexto}</div></section></div>`;
      }
      if (!contexto) {
        listEl.innerHTML = '<p class="p-4 text-sm text-slate-600">Ficha não disponível para este período.</p>';
      }
    }

    ModalManager.open("modal-marcos-era");
  }

  function closeCicloMarcosModal() {
    ModalManager.close("modal-marcos-era");
  }

  /**
   * Renderizar Cards da Máquina do Tempo dos Bairros
   * Preserva rigorosamente os 80 bairros com sanitização e links verificados.
   */
  function bairroLoteEditorialHtml(bairro) {
    const paragrafos = safeText(bairro.historia).split(/\n\s*\n/).filter(Boolean);
    const rColors = { norte: 'bg-rose-500', sul: 'bg-sky-500', leste: 'bg-emerald-500', sudeste: 'bg-amber-500', oeste: 'bg-orange-500', centro: 'bg-indigo-500', sfx: 'bg-teal-500' };
    const faixaRegiao = rColors[bairro.regiaoId] || (bairro.regiaoId === 'norte' ? 'bg-rose-500' : 'bg-indigo-500');

    // Query de busca do Google Maps para o bairro em São José dos Campos
    const queryBusca = encodeURIComponent(`${bairro.nome}, São José dos Campos - SP`);
    const embedMapUrl = `https://maps.google.com/maps?q=${queryBusca}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    const openMapUrl = `https://www.google.com/maps/search/?api=1&query=${queryBusca}`;

    return `<article data-bairro-revisado="${escapeHtml(bairro.id)}" class="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden w-full flex flex-col hover:border-slate-300 hover:shadow-md transition-all">
      <div class="p-6 sm:p-7 lg:p-8 space-y-6">
        <!-- Topo: Título do Bairro, Região e Período -->
        <header class="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <span class="text-[10px] font-black uppercase tracking-wider text-slate-400">${escapeHtml(bairro.regiaoNome)}</span>
            <h4 class="mt-0.5 text-2xl lg:text-3xl font-black text-slate-900 tracking-tight leading-tight">${escapeHtml(bairro.nome)}</h4>
          </div>
          <span class="text-xs font-semibold text-slate-500 shrink-0">${escapeHtml(bairro.periodo)}</span>
        </header>

        <!-- CORPO PRINCIPAL 50/50 (ESTILO ATLAS): MAPA NA ESQUERDA + TEXTOS NA DIREITA -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          <!-- Metade da Esquerda (6 colunas): Mapa Interativo do Bairro -->
          <div class="lg:col-span-6 min-h-[300px] sm:min-h-[360px] rounded-2xl overflow-hidden relative border border-slate-200/90 bg-slate-100 shadow-2xs flex flex-col">
            <iframe 
              src="${bairro.id === 'bairro-centro-historico' 
                ? 'https://maps.google.com/maps?q=Pra%C3%A7a+Afonso+Pena,+Centro,+S%C3%A3o+Jos%C3%A9+dos+Campos+-+SP&t=&z=16&ie=UTF8&iwloc=&output=embed' 
                : embedMapUrl}" 
              width="100%" 
              height="100%" 
              style="border:0;" 
              allowfullscreen="" 
              loading="lazy" 
              referrerpolicy="no-referrer-when-downgrade" 
              class="w-full flex-1 min-h-[300px]" 
              title="Google Maps - Bairro ${escapeHtml(bairro.nome)}"
            ></iframe>
            <!-- Botão Expandir no Google Maps -->
            <a href="${bairro.id === 'bairro-centro-historico' 
                ? 'https://www.google.com/maps/search/?api=1&query=Pra%C3%A7a+Afonso+Pena,+S%C3%A3o+Jos%C3%A9+dos+Campos+-+SP' 
                : openMapUrl}" target="_blank" rel="noopener noreferrer" class="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-black/80 hover:bg-black text-white flex items-center gap-1.5 text-[11px] font-bold transition-colors shadow-md" title="Abrir no Google Maps em nova aba">
              <i class="fa-brands fa-google text-amber-400"></i>
              <span>Maps</span>
              <i class="fa-solid fa-up-right-from-square text-[9px]"></i>
            </a>
          </div>

          <!-- Metade da Direita (6 colunas): História (em cima) e Sobre o Nome (embaixo) -->
          <div class="lg:col-span-6 flex flex-col justify-between gap-4">
            <!-- Bloco 1: A História do Bairro -->
            <div class="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3 flex-1">
              <h5 class="text-base font-black text-slate-900">${escapeHtml(bairro.tituloHistoria || 'A história do bairro')}</h5>
              <div class="space-y-3 text-sm text-slate-700 leading-relaxed">
                ${paragrafos.map(p => `<p class="leading-relaxed">${escapeHtml(p)}</p>`).join('')}
                ${(bairro.fichaHistoria || []).map(item => `<div class="space-y-1.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-100"><h6 class="font-bold text-slate-900">${escapeHtml(item.titulo)}</h6><p>${escapeHtml(item.texto)}</p></div>`).join('')}
              </div>
            </div>

            <!-- Bloco 2: Sobre o Nome -->
            <div class="p-4 sm:p-5 rounded-2xl bg-slate-50/90 border border-slate-200/80 shadow-2xs space-y-2">
              <div class="flex items-center gap-2 text-slate-500">
                <i class="fa-solid fa-tag text-xs"></i>
                <h5 class="text-[10px] font-black uppercase tracking-widest text-slate-500">Sobre o nome</h5>
              </div>
              <p class="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">${escapeHtml(bairro.origemNome)}</p>
            </div>
          </div>

        </div>

        <!-- Rodapé do Card: Fontes Documentais embaixo dos dois -->
        <div class="pt-2">
          ${fonteBairroAbntHtml(bairro)}
        </div>
      </div>
    </article>`;
  }

  function renderBairrosEditorial() {
    const container = document.getElementById("bairros-editorial-grid");
    if (!container) return;

    const data = window.HISTORIA_SJC_DATA;
    if (!data || !data.bairros) return;

    let list = data.bairros;

    // Filtro por Região
    if (historiaState.bairrosFilterRegiao !== 'all') {
      list = list.filter(function(b) { return b.regiaoId === historiaState.bairrosFilterRegiao; });
    }

    // Filtro por Busca
    if (historiaState.bairrosSearchQuery) {
      const q = historiaState.bairrosSearchQuery.toLowerCase();
      list = list.filter(function(b) {
        return (
          safeText(b.nome).toLowerCase().includes(q) ||
          safeText(b.regiaoNome).toLowerCase().includes(q)
        );
      });
    }

    // Ordenação Alfabética Rigorosa (em todas as visualizações e filtros)
    list = list.slice().sort(function(a, b) {
      return safeText(a.nome).localeCompare(safeText(b.nome), 'pt-BR');
    });

    // Atualizar contador de bairros na Sidebar Lateral
    const sideCount = document.getElementById('sidebar-bairros-count');
    if (sideCount) sideCount.textContent = list.length;

    if (list.length === 0) {
      container.innerHTML = `
        <div class="col-span-full p-12 bg-white rounded-3xl border border-slate-200 text-center space-y-3">
          <div class="w-14 h-14 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 text-2xl">
            <i class="fa-solid fa-map-location-dot"></i>
          </div>
          <h4 class="text-base font-black text-slate-800">Nenhum bairro encontrado</h4>
          <p class="text-xs text-slate-500">Tente buscar por termos como Santana, Aquarius, Satélite, Eugênio de Melo ou selecione outra região.</p>
        </div>
      `;
      return;
    }

    let html = '';
    list.forEach(function(b) {
      if (b.loteRevisao === 'centro-2026-10-04' || b.layoutHistoria === 'editorial-v1') {
        html += bairroLoteEditorialHtml(b);
        return;
      }
      // Regiao Color
      const rColors = { norte: 'bg-rose-500', sul: 'bg-sky-500', leste: 'bg-emerald-500', sudeste: 'bg-amber-500', oeste: 'bg-orange-500', centro: 'bg-indigo-500', sfx: 'bg-teal-500' };
      const rColor = rColors[b.regiaoId] || 'bg-slate-500';
      
      // Evidencia Status (Simulado temporariamente até a fase 2)
      let statusIcon = '⚪';
      let statusText = 'A verificar';
      let statusColor = 'text-slate-500 bg-slate-100';
      if (b.fontesRevisadas && b.fontesRevisadas.length > 0) {
        statusIcon = '🟢';
        statusText = 'Documentado';
        statusColor = 'text-emerald-700 bg-emerald-50';
      }

      // Truncar historia
      let histCurta = safeText(b.historia || 'Ainda não há uma síntese histórica conferida para este bairro.');
      if (histCurta.length > 120) histCurta = histCurta.substring(0, 117) + '...';

      // Fontes count
      let fontesCount = 0;
      if (b.fontesRevisadas) fontesCount = b.fontesRevisadas.length;
      else if (b.fonteUrl) fontesCount = 1;

      html += `
        <article class="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col overflow-hidden hover:border-brand-500 hover:shadow-md transition-all group h-[280px]">
          <!-- Faixa superior -->
          <div class="h-2 w-full ${rColor}"></div>
          
          <div class="p-5 flex flex-col h-full">
            <div class="flex justify-between items-start mb-3">
              <div>
                <span class="text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1 block">${escapeHtml(b.regiaoNome)}</span>
                <h4 class="text-lg font-black text-slate-900 group-hover:text-brand-800 transition-colors leading-tight">${escapeHtml(b.nome)}</h4>
              </div>
              <div class="flex items-center gap-1 px-2 py-1 rounded-full ${statusColor} text-[9px] font-bold whitespace-nowrap">
                <span>${statusIcon}</span> ${statusText}
              </div>
            </div>

            <div class="flex items-center gap-3 text-[10px] font-bold text-slate-500 mb-4 bg-slate-50 px-3 py-2 rounded-lg">
              <div class="flex items-center gap-1.5"><i class="fa-regular fa-clock"></i> ${escapeHtml(b.periodo || 'S.d.')}</div>
            </div>

            <div class="flex-1 overflow-hidden relative">
              <p class="text-xs text-slate-600 leading-relaxed italic">"${escapeHtml(histCurta)}"</p>
              <div class="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-white to-transparent"></div>
            </div>

            <div class="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
              <div class="text-[10px] font-bold text-slate-500">
                📚 ${fontesCount} fonte${fontesCount !== 1 ? 's' : ''}
              </div>
              <button onclick="openBairroDetails('${b.id}')" class="text-[11px] font-black text-brand-700 hover:text-brand-900 flex items-center gap-1 transition-colors">
                Abrir História <i class="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </article>
      `;
    });

    container.innerHTML = html;
  }

  window.openBairroDetails = function(bairroId) {
    const data = window.HISTORIA_SJC_DATA;
    if (!data || !data.bairros) return;
    const bairro = data.bairros.find(b => b.id === bairroId);
    if (!bairro) return;

    // We will inject the details in a modal
    let modal = document.getElementById('bairro-details-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'bairro-details-modal';
      modal.className = 'fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm hidden';
      modal.innerHTML = `
        <div class="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
          <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <div>
              <span id="bdm-regiao" class="text-[10px] font-black uppercase tracking-wider text-slate-400"></span>
              <h3 id="bdm-nome" class="text-xl font-black text-slate-900"></h3>
            </div>
            <button onclick="document.getElementById('bairro-details-modal').classList.add('hidden')" class="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-300 transition-colors">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div class="p-6 overflow-y-auto flex-1 space-y-6" id="bdm-content">
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    document.getElementById('bdm-regiao').textContent = bairro.regiaoNome || '';
    document.getElementById('bdm-nome').textContent = bairro.nome || '';
    
    // Build content
    const content = document.getElementById('bdm-content');
    
    let fichaHtml = '';
    if (bairro.fichaHistoria && bairro.fichaHistoria.length > 0) {
      fichaHtml = bairro.fichaHistoria.filter(item => item.texto !== bairro.origemNome).map(function(item) { 
        return `<section class="space-y-1.5"><h5 class="text-sm font-black text-slate-900">${escapeHtml(item.titulo)}</h5><p class="text-xs sm:text-sm text-slate-700 leading-relaxed">${escapeHtml(item.texto)}</p></section>`; 
      }).join('');
    }

    content.innerHTML = `
      <div class="flex items-center gap-4 text-xs font-bold text-slate-500 bg-slate-50 p-3 rounded-xl">
        <div class="flex items-center gap-1.5"><i class="fa-regular fa-clock"></i> ${escapeHtml(bairro.periodo || 'S.d.')}</div>
      </div>
      
      <div class="space-y-4">
        <section class="space-y-1.5">
          <h5 class="text-[10px] font-black uppercase tracking-widest text-slate-400">${escapeHtml(bairro.tituloOrigem || 'Por que se chama assim?')}</h5>
          <p class="text-xs sm:text-sm text-slate-700 leading-relaxed">${escapeHtml(bairro.origemNome || 'A origem do nome ainda não está explicada em uma fonte pública conferida.')}</p>
        </section>
        <section class="space-y-1.5">
          <h5 class="text-[10px] font-black uppercase tracking-widest text-slate-400">Como o bairro aparece na história local</h5>
          <p class="text-xs sm:text-sm text-slate-700 leading-relaxed">${escapeHtml(bairro.historia || 'Ainda não há uma síntese histórica conferida para este bairro.')}</p>
        </section>
        ${fichaHtml}
      </div>
      
      <div class="pt-6 border-t border-slate-100">
        ${fonteBairroAbntHtml(bairro)}
      </div>
    `;

    modal.classList.remove('hidden');
  };

  /**
   * Filtro de Busca de Bairros com Debounce de 180ms e Sincronização Sidebar <-> Principal
   */
  let bairrosSearchTimer = null;
  function filterBairros(query) {
    clearTimeout(bairrosSearchTimer);
    bairrosSearchTimer = setTimeout(function() {
      const q = safeText(query);
      historiaState.bairrosSearchQuery = q;

      // Sincronizar inputs da tela principal e da sidebar
      const mainInput = document.getElementById('bairros-search-input');
      const sideInput = document.getElementById('sidebar-bairros-search-input');
      if (mainInput && mainInput.value !== q) mainInput.value = q;
      if (sideInput && sideInput.value !== q) sideInput.value = q;

      renderBairrosEditorial();
    }, 180);
  }

  /**
   * Filtro de Região dos Bairros com aria-pressed e Sincronização Sidebar <-> Principal
   */
  function filterBairrosByRegiao(regiao) {
    historiaState.bairrosFilterRegiao = regiao || 'all';

    const regioes = ['all', 'sul', 'oeste', 'leste', 'sudeste', 'norte', 'centro', 'sfx'];
    regioes.forEach(function(r) {
      const btn = document.getElementById('bairros-pill-' + r);
      const sideBtn = document.getElementById('sidebar-bairros-pill-' + r);
      const isSelected = r === historiaState.bairrosFilterRegiao;

      if (btn) {
        if (isSelected) {
          btn.className = "px-3 py-1.5 rounded-lg font-bold bg-[#a45b16] text-white shadow-xs cursor-pointer";
          btn.setAttribute('aria-pressed', 'true');
        } else {
          btn.className = "px-3 py-1.5 rounded-lg font-bold text-slate-600 hover:bg-amber-50/60 hover:text-[#a45b16] cursor-pointer";
          btn.setAttribute('aria-pressed', 'false');
        }
      }

      if (sideBtn) {
        if (isSelected) {
          sideBtn.className = "text-left px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all bg-[#a45b16] text-white shadow-xs cursor-pointer";
          sideBtn.setAttribute('aria-pressed', 'true');
        } else {
          sideBtn.className = "text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all bg-white hover:bg-amber-50/60 text-slate-700 hover:text-[#a45b16] border border-slate-200/80 cursor-pointer";
          sideBtn.setAttribute('aria-pressed', 'false');
        }
      }
    });

    renderBairrosEditorial();
  }

  // =========================================================================
  // 5. PATRIMÔNIOS, LUGARES & GOOGLE KNOWLEDGE PANEL OFICIAL
  // =========================================================================

  const GOOGLE_PLACES_DATA = {
    vicentina: {
      id: "vicentina",
      nome: "Parque Vicentina Aranha",
      tipo: "parques",
      icone: "fa-tree",
      eixo: "Parques · Vila Adyana",
      categoria: "Parque municipal e patrimônio sanatorial em São José dos Campos",
      status: "Aberto",
      statusClass: "text-emerald-700 font-bold",
      endereco: "R. Eng. Prudente Meireles de Morais, 302 - Vila Adyana, São José dos Campos - SP",
      coords: "-23.2001, -45.8950",
      mapUrl: "https://maps.google.com/?q=Parque+Vicentina+Aranha+Sao+Jose+dos+Campos",
      embedMapUrl: "https://maps.google.com/maps?q=Parque%20Vicentina%20Aranha,%20Sao%20Jose%20dos%20Campos&t=&z=16&ie=UTF8&iwloc=&output=embed",
      fotoPrincipal: "web-media/vicentina_pavilhao_hd_real-8aecd220d02e.webp",
      fato: "Inaugurado em 1924 como sanatório pela Santa Casa de Misericórdia de São Paulo, o complexo de 400 mil m² foi um dos maiores centros de tratamento da tuberculose da América Latina.",
      contexto: "Projetado pelo renomado escritório Ramos de Azevedo com pavilhões isolados para cura ao ar livre. Tombado pelo COMPHAC e CONDEPHAAT, hoje é parque público, centro cultural, espaço de leitura, cinema, música e convivência comunitária.",
      visita: "Entrada Franca · Diariamente das 06h às 21h · Alamedas arborizadas, capela histórica e programação cultural permanente.",
      fonte: { nome: "Prefeitura de SJC & AFAC — Parque Vicentina Aranha", url: "https://www.sjc.sp.gov.br/servicos/esporte-e-qualidade-de-vida/parques/vicentina-aranha/" },
      linkLabel: "Consultar página oficial e programação"
    },
    parquecidade: {
      id: "parquecidade",
      nome: "Parque da Cidade Roberto Burle Marx",
      tipo: "parques",
      icone: "fa-tree-city",
      eixo: "Parques · Santana",
      categoria: "Parque municipal e patrimônio industrial em Santana, São José dos Campos",
      status: "Aberto",
      statusClass: "text-emerald-700 font-bold",
      endereco: "Av. Olivo Gomes, 100 - Santana, São José dos Campos - SP, 12211-115",
      coords: "-23.1678, -45.8935",
      mapUrl: "https://maps.google.com/?q=Parque+da+Cidade+Roberto+Burle+Marx+Sao+Jose+dos+Campos",
      embedMapUrl: "https://maps.google.com/maps?q=Parque%20da%20Cidade%20Roberto%20Burle%20Marx,%20Sao%20Jose%20dos%20Campos&t=&z=16&ie=UTF8&iwloc=&output=embed",
      fotoPrincipal: "fotos_radar/foto_cidade.jpg",
      fato: "O parque ocupa a antiga fazenda da Tecelagem Parahyba e reúne a monumental Residência Olivo Gomes projetada pelo arquiteto Rino Levi com paisagismo de Roberto Burle Marx (1950–1966).",
      contexto: "A área conecta a história da industrialização têxtil joseense, patrimônio da arquitetura moderna, jardins com espécies nativas, além de abrigar a sede da FCCR e o Museu do Folclore Angela Savastano.",
      visita: "Entrada Franca · Diariamente das 06h às 18h · Abriga trilhas ecológicas, lago das palmeiras e Museu do Folclore.",
      fonte: { nome: "Prefeitura de SJC — Parque da Cidade", url: "https://sjc.sp.gov.br/servicos/esporte-e-qualidade-de-vida/parques/parque-da-cidade" },
      linkLabel: "Consultar página oficial da Prefeitura"
    },
    santosdumont: {
      id: "santosdumont",
      nome: "Parque Santos Dumont",
      tipo: "parques",
      icone: "fa-plane",
      eixo: "Parques · Vila Adyana / São Dimas",
      categoria: "Parque temático aeronáutico e área de lazer em São José dos Campos",
      status: "Aberto",
      statusClass: "text-emerald-700 font-bold",
      endereco: "R. Prudente Meireles de Morais, 1000 - Vila Adyana / São Dimas, São José dos Campos - SP",
      coords: "-23.1970, -45.8890",
      mapUrl: "https://maps.google.com/?q=Parque+Santos+Dumont+Sao+Jose+dos+Campos",
      embedMapUrl: "https://maps.google.com/maps?q=Parque%20Santos%20Dumont,%20Sao%20Jose%20dos%20Campos&t=&z=16&ie=UTF8&iwloc=&output=embed",
      fotoPrincipal: "web-media/ciclo4_aeroespacial_carvao-fd6a5afc3a74.webp",
      fato: "Inaugurado em 23 de outubro de 1971 no terreno onde funcionou o antigo Sanatório Ezra, o parque transformou uma área da fase sanatorial em espaço público de lazer e memória aeronáutica.",
      contexto: "Abriga réplica em tamanho real do 14-Bis de Santos Dumont, o segundo protótipo do avião Bandeirante (EMB-110), maquetes dos foguetes Sonda do CTA, jardim japonês, lago com peixes e a réplica da casa A Encantada.",
      visita: "Entrada Franca · Diariamente das 07h às 20h · Pistas de cooper, academia ao ar livre e quiosques.",
      fonte: { nome: "Prefeitura de SJC — Parque Santos Dumont", url: "https://www.sjc.sp.gov.br/noticias/2019/dezembro/26/patrimonio-santos-dumont-e-parque-de-geracoes-de-familias/" },
      linkLabel: "Ler notícia e história do parque"
    },
    banhado: {
      id: "banhado",
      nome: "Banhado & Mirante da Orla",
      tipo: "parques",
      icone: "fa-water",
      eixo: "Paisagem · Centro Histórico",
      categoria: "Patrimônio ambiental e paisagem de várzea do Rio Paraíba do Sul",
      status: "Acesso Livre",
      statusClass: "text-emerald-700 font-bold",
      endereco: "Av. São José (Orla do Banhado) - Centro, São José dos Campos - SP",
      coords: "-23.1833, -45.8872",
      mapUrl: "https://maps.google.com/?q=Mirante+do+Banhado+Sao+Jose+dos+Campos",
      embedMapUrl: "https://maps.google.com/maps?q=Mirante%20do%20Banhado,%20Sao%20Jose%20dos%20Campos&t=&z=15&ie=UTF8&iwloc=&output=embed",
      fotoPrincipal: "web-media/sjc_ponte_estaiada-f7c2c9c2e898.webp",
      fato: "O Banhado é a grande várzea natural do Rio Paraíba do Sul diante da colina histórica da cidade, constituindo a principal identidade paisagística e visual de São José dos Campos.",
      contexto: "Área de Proteção Ambiental (APA) que reúne rica biodiversidade de aves e vegetação nativa. O mirante ao longo da Avenida São José é ponto de contemplação do pôr do sol e da Serra da Mantiqueira.",
      visita: "Aberto 24h · Deck panorâmico e calçadão para caminhada e ciclismo ao entardecer.",
      fonte: { nome: "SciELO — Paisagem, Banhado e Urbanização", url: "https://www.scielo.br/j/cm/a/vDS7X6V3tmV7b5s5gLy9ycC/?lang=pt" },
      linkLabel: "Ler estudo sobre a paisagem do Banhado"
    },
    mab: {
      id: "mab",
      nome: "Memorial Aeroespacial Brasileiro (MAB)",
      tipo: "museus",
      icone: "fa-rocket",
      eixo: "Museus · DCTA / Putim",
      categoria: "Museu aeroespacial e memorial tecnológico no DCTA / Putim",
      status: "Aberto",
      statusClass: "text-emerald-700 font-bold",
      endereco: "Av. Brig. Faria Lima, s/n - Putim / DCTA, São José dos Campos - SP, 12227-000",
      coords: "-23.2325, -45.8640",
      mapUrl: "https://maps.google.com/?q=Memorial+Aeroespacial+Brasileiro+MAB",
      embedMapUrl: "https://maps.google.com/maps?q=Memorial%20Aeroespacial%20Brasileiro%20MAB,%20Sao%20Jose%20dos%20Campos&t=&z=16&ie=UTF8&iwloc=&output=embed",
      fotoPrincipal: "web-media/ciclo4_aeroespacial_carvao-fd6a5afc3a74.webp",
      fato: "Criado em parceria entre a Associação Brasileira de Cultura Aeroespacial e o DCTA/ITA, o MAB reúne aeronaves pioneiras, foguetes do programa espacial brasileiro e o acervo histórico da fundação do CTA.",
      contexto: "O conjunto também abriga o memorial aos 21 pesquisadores e técnicos falecidos no acidente do Centro de Lançamento de Alcântara. É o maior centro de preservação aeroespacial da região.",
      visita: "Entrada Franca · Estacionamento gratuito · Terça a domingo das 9h às 17h.",
      fonte: { nome: "Prefeitura de SJC — Museus e Prédios Históricos", url: "https://sjc.sp.gov.br/servicos/inovacao-e-desenvolvimento-economico/turismo/museus-e-predios-historicos/" },
      linkLabel: "Consultar informações de visitação"
    },
    folclore: {
      id: "folclore",
      nome: "Museu do Folclore Angela Savastano",
      tipo: "museus",
      icone: "fa-drum",
      eixo: "Museus · Santana",
      categoria: "Museu de cultura popular e tradição oral do Vale do Paraíba",
      status: "Aberto",
      statusClass: "text-emerald-700 font-bold",
      endereco: "Av. Olivo Gomes, 100 - Santana (Parque da Cidade), São José dos Campos - SP",
      coords: "-23.1669, -45.8942",
      mapUrl: "https://maps.google.com/?q=Museu+do+Folclore+Angela+Savastano+Sao+Jose+dos+Campos",
      embedMapUrl: "https://maps.google.com/maps?q=Museu%20do%20Folclore%20Angela%20Savastano,%20Sao%20Jose%20dos%20Campos&t=&z=16&ie=UTF8&iwloc=&output=embed",
      fotoPrincipal: "web-media/foto_cultura-95d0cf78551c.webp",
      fato: "Idealizado em 1987 e gerido pela Fundação Cultural Cassiano Ricardo, é o museu mais antigo da cidade dedicado integralmente ao patrimônio imaterial e à cultura popular.",
      contexto: "Mantém exposição de longa duração 'O Fazer Popular', brinquedoteca, biblioteca especializada e promove eventos tradicionais como o Mês do Folclore e a Chegada dos Reis Magos.",
      visita: "Entrada Franca · Terça a sexta das 9h às 17h; sábados e domingos das 14h às 17h.",
      fonte: { nome: "FCCR — Museu do Folclore", url: "https://www.fccr.sp.gov.br/fccr/museus/museu-do-folclore-de-sao-jose-dos-campos" },
      linkLabel: "Ler acervo e programação do Museu do Folclore"
    },
    museu_municipal: {
      id: "museu_municipal",
      nome: "Museu Municipal de São José dos Campos",
      tipo: "museus",
      icone: "fa-landmark",
      eixo: "Museus · Centro Histórico",
      categoria: "Museu de história e memória urbana no Centro Histórico",
      status: "Aberto",
      statusClass: "text-emerald-700 font-bold",
      endereco: "Praça Afonso Pena, 29 - Centro, São José dos Campos - SP, 12210-090",
      coords: "-23.1865, -45.8856",
      mapUrl: "https://maps.google.com/?q=Museu+Municipal+de+Sao+Jose+dos+Campos",
      embedMapUrl: "https://maps.google.com/maps?q=Museu%20Municipal%20de%20Sao%20Jose%20dos%20Campos&t=&z=16&ie=UTF8&iwloc=&output=embed",
      fotoPrincipal: "web-media/paco_municipal-094163464df3.webp",
      fato: "Criado em 1993, o museu ocupa desde 2013 o imponente prédio histórico construído em 1926 para abrigar a antiga Câmara Municipal e o Fórum da Comarca.",
      contexto: "Acervo com mais de 10 mil itens documentando a transformação da cidade: peças da Cerâmica Weiss, maquinários da Tecelagem Parahyba, acervo do Observatório Remo Cesaroni e artes visuais.",
      visita: "Entrada Franca · Terça a sexta das 9h às 18h; sábados das 9h às 13h.",
      fonte: { nome: "FCCR — Museu Municipal", url: "https://fccr.sp.gov.br/fccr/museus/museu-municipal-de-sao-jose-dos-campos" },
      linkLabel: "Consultar histórico e acervo oficial"
    },
    arte_sacra: {
      id: "arte_sacra",
      nome: "Museu de Arte Sacra",
      tipo: "museus",
      icone: "fa-cross",
      eixo: "Museus · Centro Histórico",
      categoria: "Museu de arte sacra, prataria e imaginária religiosa colonial",
      status: "Aberto",
      statusClass: "text-emerald-700 font-bold",
      endereco: "Travessa Chico Luiz, 67 - Centro, São José dos Campos - SP",
      coords: "-23.1820, -45.8860",
      mapUrl: "https://maps.google.com/?q=Museu+de+Arte+Sacra+Sao+Jose+dos+Campos",
      embedMapUrl: "https://maps.google.com/maps?q=Museu%20de%20Arte%20Sacra,%20Sao%20Jose%20dos%20Campos&t=&z=16&ie=UTF8&iwloc=&output=embed",
      fotoPrincipal: "web-media/foto_cultura-95d0cf78551c.webp",
      fato: "Inaugurado em 17 de dezembro de 2007 na antiga Capela Nossa Senhora Aparecida, reúne peças dos séculos XVIII a XX ligadas às paróquias do Vale do Paraíba.",
      contexto: "Exibe imagens esculpidas em madeira e terracota, paramentos litúrgicos bordados em fios de ouro, livros confessionais raros e estandartes processionais coloniais.",
      visita: "Entrada Franca · Terça a sexta das 9h às 17h; sábados das 9h às 14h.",
      fonte: { nome: "Prefeitura de SJC — Museu de Arte Sacra", url: "https://sjc.sp.gov.br/servicos/inovacao-e-desenvolvimento-economico/turismo/museus-e-predios-historicos/" },
      linkLabel: "Ler detalhes de acervo e visitação"
    },
    esportes: {
      id: "esportes",
      nome: "Museu de Esportes de São José dos Campos",
      tipo: "museus",
      icone: "fa-medal",
      eixo: "Museus · Centro Histórico",
      categoria: "Memória esportiva municipal e galeria de campeões joseenses",
      status: "Aberto",
      statusClass: "text-emerald-700 font-bold",
      endereco: "Praça Afonso Pena, 29 (Anexo ao Museu Municipal) - Centro, São José dos Campos - SP",
      coords: "-23.1866, -45.8858",
      mapUrl: "https://maps.google.com/?q=Museu+de+Esportes+Sao+Jose+dos+Campos",
      embedMapUrl: "https://maps.google.com/maps?q=Museu%20de%20Esportes%20Sao%20Jose%20dos%20Campos&t=&z=16&ie=UTF8&iwloc=&output=embed",
      fotoPrincipal: "fotos_radar/foto_cidade.jpg",
      fato: "Inaugurado em 30 de julho de 1999, preserva mais de 29 mil itens que documentam a trajetória do esporte joseense e os Jogos Abertos do Interior.",
      contexto: "Reúne medalhas, troféus históricos, uniformes de seleções e clubes locais, fotos raras e registros das conquistas olímpicas e pan-americanas de atletas da cidade.",
      visita: "Entrada Franca · Segunda a sexta das 9h às 16h.",
      fonte: { nome: "Prefeitura de SJC — Museu de Esportes", url: "https://sjc.sp.gov.br/servicos/inovacao-e-desenvolvimento-economico/turismo/museus-e-predios-historicos/" },
      linkLabel: "Consultar página do Museu de Esportes"
    },
    ciencia: {
      id: "ciencia",
      nome: "Museu Interativo de Ciências (Casa do Saber)",
      tipo: "museus",
      icone: "fa-atom",
      eixo: "Museus · Vila Industrial",
      categoria: "Museu de ciências, tecnologia e planetário digital",
      status: "Aberto",
      statusClass: "text-emerald-700 font-bold",
      endereco: "Rua Felício Savastano, 200 - Vila Industrial, São José dos Campos - SP",
      coords: "-23.1780, -45.8650",
      mapUrl: "https://maps.google.com/?q=Museu+Interativo+de+Ciencias+Sao+Jose+dos+Campos",
      embedMapUrl: "https://maps.google.com/maps?q=Museu%20Interativo%20de%20Ciencias,%20Sao%20Jose%20dos%20Campos&t=&z=16&ie=UTF8&iwloc=&output=embed",
      fotoPrincipal: "web-media/ciclo5_smartcity_carvao-080158ec038f.webp",
      fato: "Inaugurado em 2018 para aproximar a juventude da ciência e inovação, reúne mais de 50 experimentos interativos em física, química, biologia e astronomia.",
      contexto: "Conta com planetário digital fulldome de alta resolução, Sala da Vida com biomas brasileiros e exposições sobre o ecossistema tecnológico do Vale do Paraíba.",
      visita: "Entrada Franca (agendamento escolar e público geral) · Terça a sexta das 8h às 17h.",
      fonte: { nome: "Prefeitura de SJC — Museu Interativo de Ciências", url: "https://sjc.sp.gov.br/servicos/inovacao-e-desenvolvimento-economico/turismo/museus-e-predios-historicos/" },
      linkLabel: "Consultar horários e agendamento de sessões"
    },
    lixo: {
      id: "lixo",
      nome: "Museu do Lixo (Sustentabilidade & Memória)",
      tipo: "museus",
      icone: "fa-recycle",
      eixo: "Museus · Jardim Santa Inês",
      categoria: "Educação ambiental, reciclagem e história do consumo",
      status: "Aberto",
      statusClass: "text-emerald-700 font-bold",
      endereco: "Estrada Municipal Martins Guimarães, 1000 - Jardim Santa Inês, São José dos Campos - SP",
      coords: "-23.1610, -45.8230",
      mapUrl: "https://maps.google.com/?q=Urbam+Sao+Jose+dos+Campos",
      embedMapUrl: "https://maps.google.com/maps?q=Urbam%20Sao%20Jose%20dos%20Campos&t=&z=15&ie=UTF8&iwloc=&output=embed",
      fotoPrincipal: "web-media/meio_ambiente-1447a302cce3.webp",
      fato: "Mantido pela Urbam (Urbanizadora Municipal), reúne centenas de objetos descartados ao longo de décadas recolhidos na coleta seletiva da cidade.",
      contexto: "Máquinas de escrever, vitrolas, câmeras analógicas, telefones e brinquedos antigos contam a evolução do consumo e conscientizam sobre reciclagem e preservação ambiental.",
      visita: "Visitação agendada · Entrada gratuita voltada a escolas e grupos comunitários.",
      fonte: { nome: "Prefeitura de SJC — Museu do Lixo / Urbam", url: "https://sjc.sp.gov.br/servicos/inovacao-e-desenvolvimento-economico/turismo/museus-e-predios-historicos/" },
      linkLabel: "Agendar visitação educativa"
    },
    benedito_alves: {
      id: "benedito_alves",
      nome: "Cine Teatro Benedito Alves da Silva",
      tipo: "cultura",
      icone: "fa-video",
      eixo: "Teatro & Cinema · Centro",
      categoria: "Teatro histórico, cinema e formação cultural no Centro",
      status: "Aberto",
      statusClass: "text-emerald-700 font-bold",
      endereco: "R. Rui Dória, 34 - Centro, São José dos Campos - SP, 12210-010",
      coords: "-23.1819, -45.8872",
      mapUrl: "https://maps.google.com/?q=Cine+Teatro+Benedito+Alves+Sao+Jose+dos+Campos",
      embedMapUrl: "https://maps.google.com/maps?q=Cine%20Teatro%20Benedito%20Alves,%20Sao%20Jose%20dos%20Campos&t=&z=16&ie=UTF8&iwloc=&output=embed",
      fotoPrincipal: "web-media/foto_cultura-95d0cf78551c.webp",
      fato: "Construído entre 1946 e 1950 por iniciativa da Paróquia São José, nasceu como salão paroquial e tornou-se o grande palco de espetáculos teatrais e cinema da cidade.",
      contexto: "Tombado pela Lei Municipal 8.571/2012 e revitalizado em 2019 pela FCCR com preservação da fachada original, conta com plateia de 250 lugares para música e artes cênicas.",
      visita: "Programação cultural semanal gratuita · Aberto conforme eventos da FCCR.",
      fonte: { nome: "FCCR — Cine Teatro Benedito Alves", url: "https://www.fccr.sp.gov.br/fccr/casas-de-cultura/casa-de-cultura-cine-teatro-benedito-alves" },
      linkLabel: "Ver programação cultural e ingressos gratuitos"
    },
    teatro_municipal: {
      id: "teatro_municipal",
      nome: "Teatro Municipal de São José dos Campos",
      tipo: "cultura",
      icone: "fa-masks-theater",
      eixo: "Teatro · Centro",
      categoria: "Principal casa de espetáculos e temporadas teatrais do município",
      status: "Aberto",
      statusClass: "text-emerald-700 font-bold",
      endereco: "R. Rubião Júnior, 84 - 3º Piso (Shopping Centro) - Centro, São José dos Campos - SP",
      coords: "-23.1845, -45.8868",
      mapUrl: "https://maps.google.com/?q=Teatro+Municipal+de+Sao+Jose+dos+Campos",
      embedMapUrl: "https://maps.google.com/maps?q=Teatro%20Municipal%20de%20Sao%20Jose%20dos%20Campos&t=&z=16&ie=UTF8&iwloc=&output=embed",
      fotoPrincipal: "web-media/foto_cultura-95d0cf78551c.webp",
      fato: "É o palco central das grandes produções teatrais, musicais, festivais nacionais de dança e apresentações da Orquestra Sinfônica de São José dos Campos.",
      contexto: "Equipado com acústica moderna, urupemas cênicas e capacidade para cerca de 500 espectadores, integra o circuito estadual e municipal de artes.",
      visita: "Aberto nos horários de espetáculos · Bilheteria online e presencial.",
      fonte: { nome: "FCCR — Teatro Municipal", url: "https://fccr.sp.gov.br/fccr/usuario/Login.php" },
      linkLabel: "Consultar catálogo de espetáculos da FCCR"
    },
    clemente_gomes: {
      id: "clemente_gomes",
      nome: "Centro Cultural Clemente Gomes",
      tipo: "cultura",
      icone: "fa-building-columns",
      eixo: "Centro Cultural · Parque da Cidade",
      categoria: "Complexo de formação artística e sede da Fundação Cultural no Parque da Cidade",
      status: "Aberto",
      statusClass: "text-emerald-700 font-bold",
      endereco: "Av. Olivo Gomes, 100 - Santana, São José dos Campos - SP",
      coords: "-23.1672, -45.8938",
      mapUrl: "https://maps.google.com/?q=Centro+Cultural+Clemente+Gomes+Sao+Jose+dos+Campos",
      embedMapUrl: "https://maps.google.com/maps?q=Centro%20Cultural%20Clemente%20Gomes,%20Sao%20Jose%20dos%20Campos&t=&z=16&ie=UTF8&iwloc=&output=embed",
      fotoPrincipal: "web-media/foto_cultura-95d0cf78551c.webp",
      fato: "Instalado nos antigos galpões industriais da Tecelagem Parahyba, presta homenagem ao empresário Clemente Gomes, pioneiro da indústria têxtil na cidade.",
      contexto: "Abriga os ateliês centrais de dança, circo, teatro e música da FCCR, além de galerias de exposições e auditório multifuncional.",
      visita: "Entrada Franca · Segunda a sexta das 8h às 21h; sábados das 8h às 17h.",
      fonte: { nome: "FCCR — Clemente Gomes", url: "https://www.fccr.sp.gov.br/fccr/conteudo/impressos/1421-Anexo_I_-_Programa_Arte_nos_Bairros.pdf" },
      linkLabel: "Consultar oficinas e atividades"
    },
    cine_santana: {
      id: "cine_santana",
      nome: "Casa de Cultura Cine Santana",
      tipo: "cultura",
      icone: "fa-film",
      eixo: "Casas de Cultura · Santana",
      categoria: "Cinema de rua histórico e casa de cultura da Zona Norte",
      status: "Aberto",
      statusClass: "text-emerald-700 font-bold",
      endereco: "Av. Rui Barbosa, 2005 - Santana, São José dos Campos - SP",
      coords: "-23.1650, -45.8970",
      mapUrl: "https://maps.google.com/?q=Casa+de+Cultura+Cine+Santana+Sao+Jose+dos+Campos",
      embedMapUrl: "https://maps.google.com/maps?q=Casa%20de%20Cultura%20Cine%20Santana,%20Sao%20Jose%20dos%20Campos&t=&z=16&ie=UTF8&iwloc=&output=embed",
      fotoPrincipal: "web-media/foto_cultura-95d0cf78551c.webp",
      fato: "Inaugurado na década de 1950 como cinema de bairro para os operários da Tecelagem Parahyba, foi preservado pelo município como polo cinematográfico e cultural.",
      contexto: "Promove mostras gratuitas de cinema clássico e independente, cineclubes, oficinas de roteiro audiovisual e apresentações teatrais comunitárias.",
      visita: "Entrada Franca · Terça a domingo conforme programação de sessões.",
      fonte: { nome: "FCCR — Cine Santana", url: "https://www.fccr.sp.gov.br/fccr/conteudo/impressos/1421-Anexo_I_-_Programa_Arte_nos_Bairros.pdf" },
      linkLabel: "Consultar sessões gratuitas de cinema"
    },
    chico_triste: {
      id: "chico_triste",
      nome: "Casa de Cultura Chico Triste",
      tipo: "cultura",
      icone: "fa-palette",
      eixo: "Casas de Cultura · Vila Tesouro",
      categoria: "Casa de cultura, biblioteca comunitária e ateliês na Vila Tesouro",
      status: "Aberto",
      statusClass: "text-emerald-700 font-bold",
      endereco: "Rua Valparaíso, s/n - Vila Tesouro, São José dos Campos - SP",
      coords: "-23.1750, -45.8450",
      mapUrl: "https://maps.google.com/?q=Casa+de+Cultura+Chico+Triste+Sao+Jose+dos+Campos",
      embedMapUrl: "https://maps.google.com/maps?q=Casa%20de%20Cultura%20Chico%20Triste,%20Sao%20Jose%20dos%20Campos&t=&z=16&ie=UTF8&iwloc=&output=embed",
      fotoPrincipal: "web-media/foto_cultura-95d0cf78551c.webp",
      fato: "Criada em 1998, homenageia o cronista, folclorista e jornalista Francisco da Silva (Chico Triste), pioneiro nos estudos do folclore valeparaibano.",
      contexto: "Oferece ateliês de artes visuais, capoeira, viola caipira, biblioteca comunitária e auditório para espetáculos na Zona Leste.",
      visita: "Entrada Franca · Segunda a sexta das 8h às 18h.",
      fonte: { nome: "FCCR — Chico Triste", url: "https://fccr.sp.gov.br/fccr/casas-de-cultura/casa-de-cultura-chico-triste" },
      linkLabel: "Consultar histórico e oficinas"
    },
    eugenia_silva: {
      id: "eugenia_silva",
      nome: "Casa de Cultura Eugênia da Silva",
      tipo: "cultura",
      icone: "fa-people-roof",
      eixo: "Casas de Cultura · Novo Horizonte",
      categoria: "Arte caipira e tradição dos figureiros no Novo Horizonte",
      status: "Aberto",
      statusClass: "text-emerald-700 font-bold",
      endereco: "Av. Júlio de Paula Ribeiro, s/n - Novo Horizonte, São José dos Campos - SP",
      coords: "-23.1790, -45.7950",
      mapUrl: "https://maps.google.com/?q=Casa+de+Cultura+Eugenia+da+Silva+Sao+Jose+dos+Campos",
      embedMapUrl: "https://maps.google.com/maps?q=Casa%20de%20Cultura%20Eugenia%20da%20Silva,%20Sao%20Jose%20dos%20Campos&t=&z=16&ie=UTF8&iwloc=&output=embed",
      fotoPrincipal: "fotos_radar/foto_pessoas.jpg",
      fato: "Homenageia Mestra Eugênia da Silva, renomada figureira joseense que perpetuou a modelagem do barro com figuras populares e animais do folclore.",
      contexto: "Polo de valorização da identidade caipira, cerâmica artesanal, música sertaneja de raiz, teatro e saraus comunitários no extremo leste.",
      visita: "Entrada Franca · Segunda a sexta das 8h às 18h.",
      fonte: { nome: "FCCR — Eugênia da Silva", url: "https://fccr.sp.gov.br/fccr/casas-de-cultura/casa-de-cultura-eugenia-da-silva" },
      linkLabel: "Conhecer a tradição das figureiras"
    },
    flavio_craveiro: {
      id: "flavio_craveiro",
      nome: "Casa de Cultura Flávio Craveiro",
      tipo: "cultura",
      icone: "fa-masks-theater",
      eixo: "Casas de Cultura · Dom Pedro I",
      categoria: "Equipamento cultural de formação artística na Zona Sul",
      status: "Aberto",
      statusClass: "text-emerald-700 font-bold",
      endereco: "Av. Lênin, 200 - Dom Pedro I, São José dos Campos - SP",
      coords: "-23.2450, -45.8900",
      mapUrl: "https://maps.google.com/?q=Casa+de+Cultura+Flavio+Craveiro+Sao+Jose+dos+Campos",
      embedMapUrl: "https://maps.google.com/maps?q=Casa%20de%20Cultura%20Flavio%20Craveiro,%20Sao%20Jose%20dos%20Campos&t=&z=16&ie=UTF8&iwloc=&output=embed",
      fotoPrincipal: "web-media/foto_cultura-95d0cf78551c.webp",
      fato: "É um dos principais equipamentos culturais descentralizados da Zona Sul, com salas multiuso e auditório para a comunidade.",
      contexto: "Oferece oficinas de dança, teatro, música, capoeira e eventos culturais gratuitos que movimentam o bairro Dom Pedro I.",
      visita: "Entrada Franca · Segunda a sexta das 8h às 18h.",
      fonte: { nome: "Prefeitura de SJC — Reforma das Casas de Cultura", url: "https://www.sjc.sp.gov.br/noticias/2022/julho/14/fundacao-cultural-vai-reformar-tres-casas-de-cultura/" },
      linkLabel: "Ler notícia e informações da unidade"
    },
    julio_neme: {
      id: "julio_neme",
      nome: "Casa de Cultura Júlio Neme",
      tipo: "cultura",
      icone: "fa-mountain-sun",
      eixo: "Casas de Cultura · São Francisco Xavier",
      categoria: "Cultura serrana, artesanato e tradição em São Francisco Xavier",
      status: "Aberto",
      statusClass: "text-emerald-700 font-bold",
      endereco: "Praça Cônego Antônio Manzi, s/n - São Francisco Xavier, SP",
      coords: "-22.9030, -45.9550",
      mapUrl: "https://maps.google.com/?q=Casa+de+Cultura+Julio+Neme+Sao+Francisco+Xavier",
      embedMapUrl: "https://maps.google.com/maps?q=Casa%20de%20Cultura%20Julio%20Neme,%20Sao%20Francisco%20Xavier&t=&z=16&ie=UTF8&iwloc=&output=embed",
      fotoPrincipal: "fotos_radar/foto_cidade.jpg",
      fato: "Leva a formação artística da FCCR ao distrito de São Francisco Xavier, integrando a cultura caipira e a preservação ambiental da Mantiqueira.",
      contexto: "Promove oficinas de costura, literatura, artesanato sustentável, música caipira e mostras de artistas locais.",
      visita: "Entrada Franca · Terça a sábado das 9h às 17h.",
      fonte: { nome: "FCCR — Programa Arte nos Bairros", url: "https://www.fccr.sp.gov.br/fccr/conteudo/impressos/1421-Anexo_I_-_Programa_Arte_nos_Bairros.pdf" },
      linkLabel: "Consultar programação em SFX"
    },
    lili_figureira: {
      id: "lili_figureira",
      nome: "Casa de Cultura Lili Figureira",
      tipo: "cultura",
      icone: "fa-shapes",
      eixo: "Casas de Cultura · Putim",
      categoria: "Patrimônio imaterial e modelagem de figureiras na Zona Sudeste",
      status: "Aberto",
      statusClass: "text-emerald-700 font-bold",
      endereco: "Rua Maria de Lourdes Ferreira, 40 - Jardim Santo Onofre / Putim, São José dos Campos - SP",
      coords: "-23.2380, -45.8550",
      mapUrl: "https://maps.google.com/?q=Casa+de+Cultura+Lili+Figureira+Sao+Jose+dos+Campos",
      embedMapUrl: "https://maps.google.com/maps?q=Casa%20de%20Cultura%20Lili%20Figureira,%20Sao%20Jose%20dos%20Campos&t=&z=16&ie=UTF8&iwloc=&output=embed",
      fotoPrincipal: "web-media/foto_cultura-95d0cf78551c.webp",
      fato: "Homenageia a tradição viva dos mestres figureiros joseenses, patrimônio cultural imaterial reconhecido em todo o estado.",
      contexto: "Espaço dedicado à formação em cerâmica, artes plásticas, dança contemporânea e oficinas para crianças e jovens do Putim.",
      visita: "Entrada Franca · Segunda a sexta das 8h às 18h.",
      fonte: { nome: "FCCR — Programa Arte nos Bairros", url: "https://www.fccr.sp.gov.br/fccr/conteudo/impressos/1421-Anexo_I_-_Programa_Arte_nos_Bairros.pdf" },
      linkLabel: "Conhecer atividades e cursos"
    },
    rancho_tropeiro: {
      id: "rancho_tropeiro",
      nome: "Casa de Cultura Rancho do Tropeiro",
      tipo: "cultura",
      icone: "fa-horse",
      eixo: "Casas de Cultura · Eugênio de Melo",
      categoria: "Tradição tropeira e memória histórica em Eugênio de Melo",
      status: "Aberto",
      statusClass: "text-emerald-700 font-bold",
      endereco: "Rua Ambrósio Molina, 184 - Eugênio de Melo, São José dos Campos - SP",
      coords: "-23.1420, -45.7800",
      mapUrl: "https://maps.google.com/?q=Casa+de+Cultura+Rancho+do+Tropeiro+Sao+Jose+dos+Campos",
      embedMapUrl: "https://maps.google.com/maps?q=Casa%20de%20Cultura%20Rancho%20do%20Tropeiro,%20Sao%20Jose%20dos%20Campos&t=&z=16&ie=UTF8&iwloc=&output=embed",
      fotoPrincipal: "web-media/foto_cultura-95d0cf78551c.webp",
      fato: "Localizada no distrito de Eugênio de Melo, resgata as rotas tropeiras que ligavam Minas Gerais e o litoral paulista através do Vale do Paraíba.",
      contexto: "Oferece aulas de viola, rodas de prosa caipira, culinária tradicional tropeira e exposições de arreatas e ferramentas históricas.",
      visita: "Entrada Franca · Segunda a sexta das 8h às 18h.",
      fonte: { nome: "FCCR — Programa Arte nos Bairros", url: "https://www.fccr.sp.gov.br/fccr/conteudo/impressos/1421-Anexo_I_-_Programa_Arte_nos_Bairros.pdf" },
      linkLabel: "Consultar acervo e eventos tropeiros"
    },
    tim_lopes: {
      id: "tim_lopes",
      nome: "Casa de Cultura Tim Lopes",
      tipo: "cultura",
      icone: "fa-book-open",
      eixo: "Casas de Cultura · Bosque dos Eucaliptos",
      categoria: "Formação cultural descentralizada na Zona Sul",
      status: "Aberto",
      statusClass: "text-emerald-700 font-bold",
      endereco: "Av. Ouro Fino, 2520 - Bosque dos Eucaliptos, São José dos Campos - SP",
      coords: "-23.2350, -45.8820",
      mapUrl: "https://maps.google.com/?q=Casa+de+Cultura+Tim+Lopes+Sao+Jose+dos+Campos",
      embedMapUrl: "https://maps.google.com/maps?q=Casa%20de%20Cultura%20Tim%20Lopes,%20Sao%20Jose%20dos%20Campos&t=&z=16&ie=UTF8&iwloc=&output=embed",
      fotoPrincipal: "fotos_radar/foto_cidade.jpg",
      fato: "Polo cultural que atende o Bosque dos Eucaliptos e bairros vizinhos com programação contínua de formação artística.",
      contexto: "Abriga oficinas de teatro, violão clássico, dança de salão, artes plásticas e biblioteca comunitária com clube de leitura.",
      visita: "Entrada Franca · Segunda a sexta das 8h às 18h.",
      fonte: { nome: "FCCR — Programa Arte nos Bairros", url: "https://www.fccr.sp.gov.br/fccr/conteudo/impressos/1421-Anexo_I_-_Programa_Arte_nos_Bairros.pdf" },
      linkLabel: "Consultar cursos e atividades"
    },
    matriz: {
      id: "matriz",
      nome: "Igreja Matriz de São José",
      tipo: "monumentos",
      icone: "fa-church",
      eixo: "Patrimônio Religioso · Centro Histórico",
      categoria: "Marco zero e patrimônio religioso histórico da fundação da cidade",
      status: "Aberto",
      statusClass: "text-emerald-700 font-bold",
      endereco: "Praça Padre João Guimarães - Centro, São José dos Campos - SP",
      coords: "-23.1812, -45.8875",
      mapUrl: "https://maps.google.com/?q=Igreja+Matriz+de+Sao+Jose+dos+Campos",
      embedMapUrl: "https://maps.google.com/maps?q=Igreja%20Matriz%20de%20Sao%20Jose,%20Sao%20Jose%20dos%20Campos&t=&z=16&ie=UTF8&iwloc=&output=embed",
      fotoPrincipal: "fotos_radar/ciclo1_aldeia_1767.jpg",
      fato: "Marca a colina para onde a Aldeia de São José de Guaiapó foi transferida no século XVII pelos jesuítas, tornando-se o coração da vila elevada a município em 1767.",
      contexto: "O templo atual em taipa e alvenaria preserva altares em estilo neoclássico, vitrais coloridos e sinos históricos que marcam as celebrações tradicionais da cidade.",
      visita: "Aberta diariamente para visitação e missas das 7h às 19h.",
      fonte: { nome: "Pró-Memória — Cronologia da Matriz de São José", url: "https://www.camarasjc.sp.gov.br/promemoria/cronologia-sjc/" },
      linkLabel: "Ler cronologia e fundação histórica"
    },
    sao_benedito: {
      id: "sao_benedito",
      nome: "Igreja São Benedito",
      tipo: "monumentos",
      icone: "fa-church",
      eixo: "Patrimônio Religioso · Centro Histórico",
      categoria: "Patrimônio sacro e devoção popular afro-brasileira na Praça Afonso Pena",
      status: "Aberto",
      statusClass: "text-emerald-700 font-bold",
      endereco: "Praça Afonso Pena, s/n - Centro, São José dos Campos - SP",
      coords: "-23.1860, -45.8850",
      mapUrl: "https://maps.google.com/?q=Igreja+Sao+Benedito+Praca+Afonso+Pena+Sao+Jose+dos+Campos",
      embedMapUrl: "https://maps.google.com/maps?q=Igreja%20Sao%20Benedito%20Praca%20Afonso%20Pena,%20Sao%20Jose%20dos%20Campos&t=&z=16&ie=UTF8&iwloc=&output=embed",
      fotoPrincipal: "fotos_radar/ciclo1_aldeia_1767.jpg",
      fato: "Erguida pela Irmandade de São Benedito no final do século XIX, é um símbolo da presença e devoção da comunidade negra na consolidação do centro urbano.",
      contexto: "Serviu como sede provisória do Museu Municipal nos anos 1990 e acolhe anualmente a tradicional Festa de São Benedito e cortejos de congadas e moçambiques.",
      visita: "Aberta para visitação religiosa e cultural de terça a domingo.",
      fonte: { nome: "Prefeitura de SJC — Prédios Históricos", url: "https://sjc.sp.gov.br/servicos/inovacao-e-desenvolvimento-economico/turismo/museus-e-predios-historicos/" },
      linkLabel: "Consultar registro histórico oficial"
    },
    obelisco: {
      id: "obelisco",
      nome: "Obelisco MMDC (Revolução de 1932)",
      tipo: "monumentos",
      icone: "fa-monument",
      eixo: "Memória Cívica · Centro",
      categoria: "Monumento cívico e tributo a Euclides Bueno Miragaia",
      status: "Acesso Livre",
      statusClass: "text-emerald-700 font-bold",
      endereco: "Praça Afonso Pena - Centro, São José dos Campos - SP",
      coords: "-23.1858, -45.8852",
      mapUrl: "https://maps.google.com/?q=Praca+Afonso+Pena+Sao+Jose+dos+Campos",
      embedMapUrl: "https://maps.google.com/maps?q=Praca%20Afonso%20Pena,%20Sao%20Jose%20dos%20Campos&t=&z=16&ie=UTF8&iwloc=&output=embed",
      fotoPrincipal: "fotos_radar/foto_cidade.jpg",
      fato: "Monumento cívico dedicado aos quatro mártires constitucionalistas de 1932 (Martins, Miragaia, Dráusio e Camargo), com destaque para o herói joseense Euclides Bueno Miragaia.",
      contexto: "Erguido no centro da Praça Afonso Pena, é local das homenagens oficiais do 9 de Julho e marco da memória cívica do estado de São Paulo.",
      visita: "Acesso livre 24h na Praça Afonso Pena.",
      fonte: { nome: "Prefeitura de SJC — Monumentos e Praças Históricas", url: "https://sjc.sp.gov.br/servicos/inovacao-e-desenvolvimento-economico/turismo/museus-e-predios-historicos/" },
      linkLabel: "Ler história da Revolução de 32 em SJC"
    },
    mercado: {
      id: "mercado",
      nome: "Mercado Municipal de São José dos Campos",
      tipo: "monumentos",
      icone: "fa-store",
      eixo: "Comércio & Tradição · Centro",
      categoria: "Patrimônio gastronômico, comércio tradicional e ponto de encontro",
      status: "Aberto",
      statusClass: "text-emerald-700 font-bold",
      endereco: "Rua Siqueira Campos - Centro, São José dos Campos - SP",
      coords: "-23.1824, -45.8854",
      mapUrl: "https://maps.google.com/?q=Mercado+Municipal+de+Sao+Jose+dos+Campos",
      embedMapUrl: "https://maps.google.com/maps?q=Mercado%20Municipal%20de%20Sao%20Jose%20dos%20Campos&t=&z=16&ie=UTF8&iwloc=&output=embed",
      fotoPrincipal: "web-media/foto_gastronomia-2e195d219775.webp",
      fato: "Inaugurado em 1923, o 'Mercadão' ocupa o quarteirão central e abasteceu gerações de famílias com produtos agrícolas do Vale do Paraíba e da Serra da Mantiqueira.",
      contexto: "Ponto icônico da gastronomia popular joseense, famoso pelo pastel de feira, queijos artesanais, ervas medicinais, farinhas caipiras e artesanato regional.",
      visita: "Segunda a sábado das 7h às 17h; domingos das 7h às 12h.",
      fonte: { nome: "Prefeitura de SJC — Mercado Municipal", url: "https://sjc.sp.gov.br/servicos/inovacao-e-desenvolvimento-economico/turismo/museus-e-predios-historicos/" },
      linkLabel: "Consultar serviços do Mercado Municipal"
    },
    biblioteca: {
      id: "biblioteca",
      nome: "Biblioteca Pública Municipal Cassiano Ricardo",
      tipo: "monumentos",
      icone: "fa-book",
      eixo: "Memória Literária · Centro",
      categoria: "Patrimônio literário, acervo raro e centro de documentação",
      status: "Aberto",
      statusClass: "text-emerald-700 font-bold",
      endereco: "Rua XV de Novembro, 99 - Centro, São José dos Campos - SP",
      coords: "-23.1840, -45.8860",
      mapUrl: "https://maps.google.com/?q=Biblioteca+Cassiano+Ricardo+Sao+Jose+dos+Campos",
      embedMapUrl: "https://maps.google.com/maps?q=Biblioteca%20Cassiano%20Ricardo,%20Sao%20Jose%20dos%20Campos&t=&z=16&ie=UTF8&iwloc=&output=embed",
      fotoPrincipal: "web-media/sjc_cassiano_ricardo-30fc264e57b0.webp",
      fato: "Homenageia o grande poeta modernista, jornalista e ensaísta joseense Cassiano Ricardo (1895–1974), membro da Academia Brasileira de Letras.",
      contexto: "Preserva mais de 60 mil volumes, jornais históricos digitalizados, obras raras sobre o Vale do Paraíba e salas de estudo e leitura públicas.",
      visita: "Entrada Franca · Segunda a sexta das 8h15 às 17h45.",
      fonte: { nome: "FCCR — Biblioteca Cassiano Ricardo", url: "https://fccr.sp.gov.br/fccr/usuario/Login.php" },
      linkLabel: "Consultar catálogo da biblioteca"
    },
    cta_ita: {
      id: "cta_ita",
      nome: "Complexo Aeroespacial CTA & ITA",
      tipo: "monumentos",
      icone: "fa-satellite",
      eixo: "Ciência & Tecnologia · DCTA",
      categoria: "Patrimônio científico, tecnológico e arquitetura de Oscar Niemeyer",
      status: "Acesso Controlado",
      statusClass: "text-amber-700 font-bold",
      endereco: "Praça Marechal Eduardo Gomes, 50 - Vila das Acácias, São José dos Campos - SP",
      coords: "-23.2100, -45.8750",
      mapUrl: "https://maps.google.com/?q=CTA+ITA+Sao+Jose+dos+Campos",
      embedMapUrl: "https://maps.google.com/maps?q=CTA%20ITA,%20Sao%20Jose%20dos%20Campos&t=&z=15&ie=UTF8&iwloc=&output=embed",
      fotoPrincipal: "web-media/ciclo4_aeroespacial_carvao-fd6a5afc3a74.webp",
      fato: "Criado em 1950 sob a liderança do Marechal Casimiro Montenegro Filho, o CTA/ITA transformou São José dos Campos na Capital Aeroespacial do Brasil.",
      contexto: "O campus reúne edifícios históricos projetados pelo arquiteto Oscar Niemeyer tombados pelo IPHAN, além de laboratórios pioneiros que deram origem à Embraer e ao INPE.",
      visita: "Acesso ao campus militar mediante autorização prévia · Acervo aberto para visitação no vizinho MAB.",
      fonte: { nome: "INPE & DCTA — História Institucional", url: "https://www.gov.br/inpe/pt-br/acesso-a-informacao/institucional/historia" },
      linkLabel: "Ler histórico aeroespacial brasileiro"
    }
  };

  let activeGooglePlaceKey = 'vicentina';
  let activePatrimonioCategory = 'all';

  function switchPatrimonioCategory(catKey) {
    activePatrimonioCategory = catKey || 'all';
    
    // Se o lugar ativo não pertencer à categoria selecionada, escolhe o primeiro da categoria
    const allPlaces = Object.values(GOOGLE_PLACES_DATA);
    const filteredPlaces = activePatrimonioCategory === 'all' 
      ? allPlaces 
      : allPlaces.filter(p => p.tipo === activePatrimonioCategory);
    
    if (filteredPlaces.length > 0 && !filteredPlaces.some(p => p.id === activeGooglePlaceKey)) {
      activeGooglePlaceKey = filteredPlaces[0].id;
    }
    
    renderPatrimoniosEditorial();
  }
  window.switchPatrimonioCategory = switchPatrimonioCategory;

  function switchPatrimonioGoogleCard(placeKey) {
    if (GOOGLE_PLACES_DATA[placeKey]) {
      activeGooglePlaceKey = placeKey;
      renderPatrimoniosEditorial();
      
      // Rola suavemente até o container do showcase para ótima experiência no mobile
      const el = document.getElementById("patrimonios-editorial-showcase");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }
  window.switchPatrimonioGoogleCard = switchPatrimonioGoogleCard;

  function navigatePatrimonio(direction) {
    const allPlaces = Object.values(GOOGLE_PLACES_DATA);
    const filteredPlaces = activePatrimonioCategory === 'all'
      ? allPlaces
      : allPlaces.filter(p => p.tipo === activePatrimonioCategory);

    if (filteredPlaces.length === 0) return;
    const currentIndex = filteredPlaces.findIndex(p => p.id === activeGooglePlaceKey);
    let newIndex = currentIndex !== -1 ? currentIndex + direction : 0;
    if (newIndex < 0) newIndex = filteredPlaces.length - 1;
    if (newIndex >= filteredPlaces.length) newIndex = 0;
    switchPatrimonioGoogleCard(filteredPlaces[newIndex].id);
  }
  window.navigatePatrimonio = navigatePatrimonio;

  /**
   * Renderizar Seção de Patrimônios & Lugares Históricos (Menu na Linha Inicial + Lista Completa em Ordem Alfabética)
   */
  function renderPatrimoniosEditorial() {
    const container = document.getElementById("patrimonios-editorial-grid");
    if (!container) return;

    const allPlaces = Object.values(GOOGLE_PLACES_DATA);

    // Menu de Categorias na Linha Inicial com o marrom oficial do módulo de história (#a45b16)
    const CATEGORIAS_PATRIMONIO = [
      { id: 'all', nome: 'Todos os Lugares', icone: 'fa-layer-group' },
      { id: 'parques', nome: 'Parques & Natureza', icone: 'fa-tree-city' },
      { id: 'museus', nome: 'Museus & Memória', icone: 'fa-landmark' },
      { id: 'cultura', nome: 'Casas de Cultura & Teatros', icone: 'fa-masks-theater' },
      { id: 'monumentos', nome: 'Monumentos & Patrimônio', icone: 'fa-monument' }
    ];

    const menuHtml = `
      <div class="flex items-center gap-1.5 overflow-x-auto text-xs pb-3 border-b border-slate-200 no-scrollbar" role="tablist" aria-label="Filtrar por Categoria">
        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1 shrink-0">Categoria:</span>
        ${CATEGORIAS_PATRIMONIO.map(cat => {
          const isActive = activePatrimonioCategory === cat.id;
          return `
            <button 
              type="button" 
              onclick="window.switchPatrimonioCategory('${cat.id}')" 
              class="px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer flex items-center gap-2 shrink-0 ${isActive ? 'bg-[#a45b16] text-white shadow-xs' : 'text-slate-600 hover:bg-amber-50/60 hover:text-[#a45b16]'}"
              role="tab"
              aria-selected="${isActive ? 'true' : 'false'}"
            >
              <i class="fa-solid ${cat.icone} text-xs ${isActive ? 'text-white' : 'text-[#a45b16]'}"></i>
              <span>${cat.nome}</span>
            </button>
          `;
        }).join('')}
      </div>
    `;

    // Itens filtrados pela categoria selecionada
    const filteredPlaces = activePatrimonioCategory === 'all'
      ? allPlaces
      : allPlaces.filter(p => p.tipo === activePatrimonioCategory);

    // Ordenação Alfabética Rigorosa
    const sortedPlaces = filteredPlaces.slice().sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));

    // Cards Replicados um por um em Ordem Alfabética
    const cardsHtml = sortedPlaces.map(place => `
      <article class="bg-slate-100/70 text-slate-800 rounded-3xl p-5 sm:p-7 shadow-xs border border-slate-200/90 transition-all space-y-5">
        
        <!-- CABEÇALHO DO LUGAR (TÍTULO À ESQUERDA + ENDEREÇO E AÇÕES À DIREITA) -->
        <div class="flex flex-col 2xl:flex-row 2xl:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 min-w-0">
          <div class="space-y-1 min-w-0 flex-1">
            <h3 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              ${escapeHtml(place.nome)}
            </h3>
            <p class="text-xs sm:text-sm text-slate-600">
              ${escapeHtml(place.categoria)}
            </p>
          </div>

          <!-- Barra com Endereço, Horário e Botões de Rota/Fonte -->
          <div class="p-3 sm:p-3.5 rounded-2xl bg-white border border-slate-200/90 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs shadow-2xs min-w-0 max-w-full">
            <div class="space-y-0.5 min-w-0 flex-1 pr-2">
              <div class="flex items-center gap-1.5 text-slate-800 min-w-0">
                <i class="fa-solid fa-location-dot text-brand-800 shrink-0 text-xs"></i>
                <span class="font-bold truncate">${escapeHtml(place.endereco)}</span>
              </div>
              <div class="flex items-center gap-1.5 text-slate-500 text-[11px] min-w-0">
                <i class="fa-solid fa-clock text-slate-400 shrink-0 text-[10px]"></i>
                <span class="truncate">${escapeHtml(place.visita)}</span>
              </div>
            </div>
            <div class="shrink-0 flex items-center gap-2 pt-1 md:pt-0">
              <a href="${place.mapUrl}" target="_blank" rel="noopener noreferrer" class="px-3.5 py-2 rounded-xl bg-[#0f2f52] hover:bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs whitespace-nowrap">
                <i class="fa-solid fa-diamond-turn-right text-cyan-300 text-xs"></i>
                <span>Traçar Rota no Google Maps</span>
              </a>
            </div>
          </div>
        </div>

        <!-- CORPO PRINCIPAL 50/50: MAPA NA ESQUERDA + TEXTOS NA DIREITA -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          <!-- Metade da Esquerda (6 colunas): Google Maps -->
          <div class="lg:col-span-6 min-h-[280px] sm:min-h-[320px] rounded-2xl overflow-hidden relative border border-slate-200/90 bg-white shadow-2xs">
            <iframe 
              src="${place.embedMapUrl}" 
              width="100%" 
              height="100%" 
              style="border:0;" 
              allowfullscreen="" 
              loading="lazy" 
              referrerpolicy="no-referrer-when-downgrade" 
              class="w-full h-full min-h-[280px]" 
              title="Google Maps - ${escapeHtml(place.nome)}"
            ></iframe>
            <!-- Botão Expandir no Google Maps -->
            <a href="${place.mapUrl}" target="_blank" rel="noopener noreferrer" class="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-black/80 hover:bg-black text-white flex items-center gap-1.5 text-[11px] font-bold transition-colors shadow-md" title="Abrir no Google Maps em nova aba">
              <i class="fa-brands fa-google text-amber-400"></i>
              <span>Maps</span>
              <i class="fa-solid fa-up-right-from-square text-[9px]"></i>
            </a>
          </div>

          <!-- Metade da Direita (6 colunas): Fato Histórico Documentado (em cima) e Patrimônio & Cidade Viva (embaixo) -->
          <div class="lg:col-span-6 flex flex-col justify-between gap-3.5">
            <!-- Bloco 1: Fato Histórico Documentado -->
            <div class="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2 flex-1">
              <div>
                <span class="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-0.5">Origem e Fundação</span>
                <h5 class="text-sm font-black text-slate-900">Fato Histórico Documentado</h5>
              </div>
              <p class="text-xs sm:text-sm text-slate-700 leading-relaxed">${escapeHtml(place.fato)}</p>
            </div>

            <!-- Bloco 2: Patrimônio & Cidade Viva -->
            <div class="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2 flex-1">
              <div>
                <span class="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-0.5">Preservação, Arquitetura e Memória</span>
                <h5 class="text-sm font-black text-slate-900">Patrimônio & Cidade Viva</h5>
              </div>
              <p class="text-xs sm:text-sm text-slate-700 leading-relaxed">${escapeHtml(place.contexto)}</p>
            </div>
          </div>

        </div>

      </article>
    `).join('');

    container.innerHTML = `
      <div class="space-y-6">
        ${menuHtml}
        <div class="space-y-6">
          ${cardsHtml}
        </div>
      </div>
    `;
  }

  /**
   * Alternar Sub-aba de Pioneiros e Tabela de Prefeitos
   */
  function switchPrefeitosSubTab(subTab) {
    historiaState.activePrefeitosSubTab = subTab;

    const pioneirosGrid = document.getElementById("view-pioneiros-grid");
    const prefeitosTable = document.getElementById("view-prefeitos-table-container");
    const btnPers = document.getElementById("btn-sub-pers");
    const btnTab = document.getElementById("btn-sub-tab");

    const sideBtnPers = document.getElementById("sidebar-btn-sub-pers");
    const sideBtnTab = document.getElementById("sidebar-btn-sub-tab");

    if (subTab === 'personalidades') {
      if (pioneirosGrid) pioneirosGrid.classList.remove("hidden");
      if (prefeitosTable) prefeitosTable.classList.add("hidden");
      if (btnPers) {
        btnPers.className = "px-3.5 py-1.5 rounded-xl font-bold text-xs bg-brand-900 text-white cursor-pointer shadow-xs";
        btnPers.setAttribute('aria-pressed', 'true');
      }
      if (btnTab) {
        btnTab.className = "px-3.5 py-1.5 rounded-xl font-bold text-xs text-slate-600 hover:bg-slate-100 cursor-pointer";
        btnTab.setAttribute('aria-pressed', 'false');
      }
      if (sideBtnPers) {
        sideBtnPers.className = "p-2.5 rounded-xl font-bold text-xs bg-brand-900 text-white shadow-xs cursor-pointer text-center";
      }
      if (sideBtnTab) {
        sideBtnTab.className = "p-2.5 rounded-xl font-bold text-xs bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80 cursor-pointer text-center";
      }
    } else {
      if (pioneirosGrid) pioneirosGrid.classList.add("hidden");
      if (prefeitosTable) prefeitosTable.classList.remove("hidden");
      if (btnPers) {
        btnPers.className = "px-3.5 py-1.5 rounded-xl font-bold text-xs text-slate-600 hover:bg-slate-100 cursor-pointer";
        btnPers.setAttribute('aria-pressed', 'false');
      }
      if (btnTab) {
        btnTab.className = "px-3.5 py-1.5 rounded-xl font-bold text-xs bg-brand-900 text-white cursor-pointer shadow-xs";
        btnTab.setAttribute('aria-pressed', 'true');
      }
      if (sideBtnPers) {
        sideBtnPers.className = "p-2.5 rounded-xl font-bold text-xs bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80 cursor-pointer text-center";
      }
      if (sideBtnTab) {
        sideBtnTab.className = "p-2.5 rounded-xl font-bold text-xs bg-brand-900 text-white shadow-xs cursor-pointer text-center";
      }
    }
  }

  /**
   * Renderizar Cards de Pioneiros & Personalidades
   */
  const NOTAVEIS_PHOTO_MAP = {
    'P01': 'web-media/01_ozires_silva-2ab6785eff9b.webp',
    'P02': 'web-media/02_casimiro_montenegro_filho-a32e879e0ac3.webp',
    'P03': 'web-media/03_fernando_de_mendonca-ee99dbe12189.webp',
    'P04': 'web-media/04_cassiano_ricardo-cd2b17e4c311.webp',
    'P05': 'web-media/05_dona_vicentina_de_queiroz_aranha-b461c3f299f0.webp',
    'P06': 'web-media/ze_mira_rembrandt-962e0c34d1b5.webp',
    'P07': 'web-media/06_euclides_bueno_miragaia-85f23377c996.webp',
    'P08': 'web-media/07_affonso_berardinelli_tarantino-8cd48e8b6649.webp',
    'P09': 'web-media/09_jose_de_araujo_coimbra-c2481adfa444.webp',
    'P10': 'web-media/10_francisco_dos_anjos_gaia-6ce643394fb3.webp',
    'P11': 'web-media/08_henrique_jorge_guedes-c8891881384d.webp',
    'P12': 'web-media/11_mario_guimaraes_ferri-e01863ec3198.webp',
    'P13': 'web-media/12_paulo_setubal-f191e2372172.webp',
    'P14': 'web-media/13_padre_rodolfo_komorek-026620f4b37a.webp',
    'P15': 'web-media/14_nilton_renno-cdf33a61a9fa.webp',
    'P16': 'web-media/15_jose_maria_fidelis-7a3727b51a63.webp',
    'P17': 'web-media/16_casemiro-d330fd9e75d2.webp',
    'P18': 'web-media/17_richard_harbert_smith-61b4b13a8178.webp',
    'P19': 'web-media/18_aldo_weber_vieira_da_rosa-0dd7c3856758.webp',
    'P20': 'web-media/19_joseph_kovacs-bc9b1e1b6f63.webp',
    'P21': 'web-media/20_nelson_silveira_davila-3a1380606c31.webp',
    'P22': 'web-media/21_madre_maria_teresa_de_jesus_eucaristico-96e44ec2e294.webp',
    'P23': 'web-media/22_jose_edvar_simoes-ece8ce3b09b3.webp',
    'P24': 'web-media/23_jean_galvao-baf51432dc23.webp',
    'P25': 'web-media/24_coronel_jose_monteiro-2c4fee3e9daa.webp',
    'P26': 'web-media/25_francisco_rafael-067097968307.webp',
    'P27': 'web-media/26_luiz_jacinto_de_medeiros-a435e1691740.webp',
    'P28': 'web-media/27_dolzani_ricardo-813f45701cd1.webp',
    'P29': 'web-media/28_aristides_friggi-5a3e3265bed3.webp',
    'P30': 'web-media/29_joao_batista_peneluppi-ff8b0654f954.webp',
    'P31': 'web-media/30_genesia_berardinelli_tarantino-cd4c38c223bf.webp',
    'P32': 'web-media/p32_jeni_davi_bacha-238f83a00bb0.webp',
    'P33': 'web-media/31_sebastiao_humel-e02d44289a17.webp',
    'P34': 'web-media/32_conego_francisco_de_oliveira_lima-9b66009c7eeb.webp',
    'P35': 'web-media/33_joao_guilhermino-f3b4cc63ea14.webp',
    'P36': 'web-media/34_geraldo_queiroz-3ad14eab8e82.webp',
    'P37': 'web-media/35_benedito_matarazzo-db013d06dc8f.webp',
    'P38': 'web-media/36_felicio_savastano-ab4e1fc29324.webp',
    'P39': 'web-media/37_juvenal_machado_de_araujo-c7568247c56e.webp',
    'P40': 'web-media/38_pedro_mascarenhas-9957dda29db5.webp',
    'P41': 'web-media/39_suely_antunes_de_mello-c240bc5a40ed.webp',
    'P42': 'web-media/40_amintas_rocha_brito-d799fd1f3dd7.webp',
    'P43': 'web-media/p43_maria_gomide_santos_de_souza-0093ca8049ea.webp',
    'P44': 'web-media/p44_joao_alves_da_silva_cursino-999a583c08d9.webp',
    'P45': 'web-media/p45_elmano_ferreira_veloso-5c5bcd2b7c89.webp',
    'P46': 'web-media/p46_dr_ruy_rodrigues_doria-cce5451143eb.webp',
    'P47': 'web-media/p47_dr_mario_nunes_galvao-4041a83c69bd.webp',
    'P48': 'web-media/41_francisco_pereira_da_silva_chico_triste-f5d7fd30b1d2.webp',
    'P49': 'web-media/42_domingos_de_macedo_custodio-7d24108cd89c.webp',
    'P50': 'web-media/43_major_jose_mariotto_ferreira-6fb40a4c550b.webp',
    'P51': 'web-media/44_olimpio_catao-11ed3448763f.webp'
  };

  function renderPioneirosEditorial() {
    const container = document.getElementById("view-pioneiros-grid");
    if (!container) return;
    const data = window.HISTORIA_SJC_DATA;
    if (!data || !data.personalidades) return;

    container.innerHTML = data.personalidades.map(function(p) {
      const tagColors = {
        cyan: "bg-cyan-50 text-cyan-800 border-cyan-200",
        indigo: "bg-indigo-50 text-indigo-800 border-indigo-200",
        blue: "bg-blue-50 text-blue-800 border-blue-200",
        rose: "bg-rose-50 text-rose-800 border-rose-200",
        purple: "bg-purple-50 text-purple-800 border-purple-200",
        amber: "bg-amber-50 text-amber-800 border-amber-200",
        emerald: "bg-emerald-50 text-emerald-800 border-emerald-200"
      };
      const badgeClass = tagColors[p.cor] || "bg-slate-50 text-slate-800 border-slate-200";

      const refsHtml = (p.referencias && p.referencias.length) ? `
        <div class="mt-4 pt-3 border-t border-slate-100">
          <details class="text-[11px] text-slate-500 group/ref">
            <summary class="cursor-pointer font-semibold text-slate-600 hover:text-slate-900 transition-colors flex items-center justify-between py-1">
              <span class="flex items-center gap-1.5">
                <i class="fa-solid fa-book-bookmark text-slate-400 text-[10px]"></i>
                Fontes ABNT (${p.referencias.length})
              </span>
              <i class="fa-solid fa-chevron-down text-[9px] text-slate-400 transition-transform group-open/ref:rotate-180"></i>
            </summary>
            <div class="mt-2 space-y-2 pl-2 border-l-2 border-slate-200 text-[10px] text-slate-600 leading-relaxed font-mono">
              ${p.referencias.map(r => `<p class="select-text">${escapeHtml(r)}</p>`).join('')}
            </div>
          </details>
        </div>
      ` : '';

      const photoFile = p.foto || p.imagem;
      const photoSrc = NOTAVEIS_PHOTO_MAP[p.id] || (photoFile ? `fotos_radar/notaveis/${photoFile}` : "");
      const photoHtml = photoSrc ? `
        <div class="w-full h-56 rounded-2xl overflow-hidden mb-3 bg-slate-900/10 border border-slate-200/80 shadow-2xs relative">
          <img src="${escapeHtml(photoSrc)}" alt="${escapeHtml(p.nome)}" class="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300" loading="lazy" onerror="this.parentElement.style.display='none';" />
        </div>
      ` : '';

      return `<article class="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between gap-4 hover:border-slate-300 hover:shadow-md transition-all group">
        <div class="space-y-3">
          ${photoHtml}
          <div class="flex items-center justify-between gap-2 flex-wrap text-xs text-slate-500 font-semibold">
            <span class="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-2 py-0.5 rounded-full ${badgeClass}">
              ${escapeHtml(p.categoria || p.tag || "Pioneiro")}
            </span>
            <span class="font-mono text-xs text-slate-400">${escapeHtml(p.periodo || "")}</span>
          </div>
          <div>
            <h4 class="text-lg font-black text-slate-900 group-hover:text-blue-900 transition-colors">${escapeHtml(p.nome)}</h4>
            <p class="text-xs font-semibold text-slate-500 mt-0.5">${escapeHtml(p.subtitulo || p.cargo || "")}</p>
          </div>
          <p class="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">${escapeHtml(p.texto || p.descricao || "")}</p>
        </div>
        ${refsHtml}
      </article>`;
    }).join('');
  }

  /**
   * =========================================================================
   * GOVERNANTES DE SÃO JOSÉ DOS CAMPOS — ACERVO HISTÓRICO & DOCUMENTAL
   * =========================================================================
   */
  let prefeitosViewMode = 'tabela'; // 'catalogo' | 'cronologia' | 'tabela'
  let prefeitosEraFiltro = 'todas';
  let prefeitosFiltroAtual = 'todos';
  let prefeitosStatusFiltro = 'todos';
  let prefeitosBuscaAtual = '';
  let prefeitosFilteredCache = [];
  let prefeitoAtivoId = null;

  /**
   * Extrair Iniciais para Monograma Institucional Histórico
   */
  function getPrefeitoIniciais(nome) {
    if (!nome) return 'SJ';
    const limpo = nome.replace(/\(.*?\)/g, '').replace(/[^a-zA-ZÀ-ÿ\s]/g, '').trim();
    const partes = limpo.split(/\s+/).filter(function(p) {
      const w = p.toLowerCase();
      return w.length > 1 && !['de', 'da', 'do', 'dos', 'das', 'e'].includes(w);
    });
    if (partes.length === 0) return 'SJ';
    if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase();
    return (partes[0].charAt(0) + partes[partes.length - 1].charAt(0)).toUpperCase();
  }

  /**
   * Markup do Monograma Institucional Clássico (Acervo Histórico Oficial)
   */
  function getPrefeitoMonogramaMarkup(iniciais, size) {
    const isDrawer = size === 'drawer';
    const containerClass = isDrawer
      ? 'w-24 h-28 shrink-0 rounded-2xl bg-gradient-to-br from-slate-100 via-stone-50 to-amber-50/40 border border-slate-200/90 shadow-xs flex flex-col items-center justify-center relative select-none'
      : 'w-20 h-24 shrink-0 rounded-xl bg-gradient-to-br from-slate-100 via-stone-50 to-amber-50/40 border border-slate-200/90 shadow-2xs flex flex-col items-center justify-center relative select-none group-hover:border-[#a45b16]/30 transition-colors';
    const textClass = isDrawer
      ? 'font-serif font-black text-2xl text-slate-800 tracking-wider'
      : 'font-serif font-bold text-xl text-slate-700 tracking-wider';

    return `<div class="${containerClass}">
      <span class="${textClass}">${escapeHtml(iniciais)}</span>
      <span class="text-[8px] font-mono uppercase font-black text-slate-400 mt-1 tracking-widest flex items-center gap-0.5">
        <i class="fa-solid fa-landmark text-[7px] text-[#a45b16]/70"></i> ACERVO
      </span>
    </div>`;
  }
  window.getPrefeitoMonogramaMarkup = getPrefeitoMonogramaMarkup;

  /**
   * Renderizar Imagem Autêntica ou Monograma Institucional
   */
  function renderPrefeitoAvatar(pref, size) {
    size = size || 'card';
    const foto = pref.foto || pref.imagem;
    const iniciais = getPrefeitoIniciais(pref.nome);
    const isDrawer = size === 'drawer';

    if (foto) {
      return `<div class="${isDrawer ? 'w-24 h-28' : 'w-20 h-24'} shrink-0 relative rounded-xl overflow-hidden border border-slate-200/90 shadow-2xs bg-slate-100">
        <img src="${escapeHtml(foto)}" alt="${escapeHtml(pref.nome)}" class="w-full h-full object-cover" onerror="this.parentElement.outerHTML=window.getPrefeitoMonogramaMarkup('${escapeHtml(iniciais)}', '${size}');" />
      </div>`;
    }

    return getPrefeitoMonogramaMarkup(iniciais, size);
  }

  /**
   * Badge de Categoria de Acesso Político
   */
  function renderPrefeitoBadge(categoria) {
    switch (categoria) {
      case 'Eleito':
        return `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300/80 whitespace-nowrap"><i class="fa-solid fa-check-to-slot text-[8px]"></i> Eleito Direto</span>`;
      case 'Nomeado':
        return `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-100 text-blue-800 border border-blue-300/80 whitespace-nowrap"><i class="fa-solid fa-stamp text-[8px]"></i> Nomeado</span>`;
      case 'Sucessão / Interino':
        return `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-purple-100 text-purple-800 border border-purple-300/80 whitespace-nowrap"><i class="fa-solid fa-arrows-split-up-and-left text-[8px]"></i> Sucessão</span>`;
      case 'Conselho / Junta':
        return `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-300/80 whitespace-nowrap"><i class="fa-solid fa-users-rectangle text-[8px]"></i> Conselho</span>`;
      case 'Alegação / Não Confirmado':
      default:
        return `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-100 text-rose-800 border border-rose-300/80 whitespace-nowrap"><i class="fa-solid fa-triangle-exclamation text-[8px]"></i> Sem Ato Primário</span>`;
    }
  }

  /**
   * Verificar se governante possui ressalva historiográfica documentada
   */
  function isPrefeitoComRessalva(pref) {
    if (pref.categoria === 'Alegação / Não Confirmado') return true;
    const s = (pref.situacaoDocumental || '').toLowerCase();
    return s.includes('ressalva') || s.includes('não confirmado') || s.includes('sem ato primário') || s.includes('divergência') || s.includes('lacuna') || s.includes('interregno');
  }

  /**
   * Badge de Status Documental
   */
  function renderPrefeitoStatusBadge(pref) {
    if (isPrefeitoComRessalva(pref)) {
      return `<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-900 border border-amber-200/90 whitespace-nowrap"><i class="fa-solid fa-triangle-exclamation text-[8px] text-amber-600"></i> Com Ressalvas</span>`;
    }
    return `<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-900 border border-emerald-200/90 whitespace-nowrap"><i class="fa-solid fa-circle-check text-[8px] text-emerald-600"></i> Mandato Comprovado</span>`;
  }

  /**
   * Formatar Citações Historiográficas no formato [X] ou [X–Y] em botões interativos
   */
  function formatarCitacoesDossie(texto) {
    if (!texto) return '';
    const safe = escapeHtml(texto);
    return safe.replace(/\[([0-9,\s–-]+)\]/g, function(match, group) {
      const cleanGroup = group.replace(/\s+/g, ' ');
      const firstNumMatch = cleanGroup.match(/\d+/);
      const firstNum = firstNumMatch ? firstNumMatch[0] : '';
      return `<button type="button" onclick="window.abrirRefPrefeitos('${firstNum}', event)" class="inline-flex items-center px-1 py-0.2 mx-0.5 text-[10px] font-bold font-mono rounded bg-amber-100 text-amber-950 hover:bg-amber-200 border border-amber-300/80 transition-all cursor-pointer shadow-2xs" title="Localizar referência [${cleanGroup}]">[${cleanGroup}]</button>`;
    });
  }

  /**
   * Utilitário de Cópia para a Área de Transferência (Clipboard)
   */
  function fallbackCopyText(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
  }

  function copiarReferenciaAbnt(refId, btnEl) {
    const data = window.HISTORIA_SJC_DATA;
    if (!data || !data.prefeitosDossie || !data.prefeitosDossie.referencias) return;
    const ref = data.prefeitosDossie.referencias.find(function(r) {
      return String(r.id) === String(refId);
    });
    if (!ref || !ref.fullText) return;

    const originalHtml = btnEl ? btnEl.innerHTML : '';
    function feedback() {
      if (btnEl) {
        btnEl.innerHTML = '<i class="fa-solid fa-check text-emerald-600"></i> <span class="text-emerald-700 font-bold">Copiado!</span>';
        setTimeout(function() { btnEl.innerHTML = originalHtml; }, 2200);
      }
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(ref.fullText).then(feedback).catch(function() {
        fallbackCopyText(ref.fullText);
        feedback();
      });
    } else {
      fallbackCopyText(ref.fullText);
      feedback();
    }
  }

  /**
   * Alternar Modo de Visualização Principal: Catálogo | Cronologia | Tabela
   */
  function switchPrefeitosViewMode(mode) {
    if (mode !== 'catalogo' && mode !== 'cronologia' && mode !== 'tabela') {
      mode = 'catalogo';
    }
    prefeitosViewMode = mode;

    const catView = document.getElementById("prefeitos-view-catalogo");
    const cronView = document.getElementById("prefeitos-view-cronologia");
    const tabView = document.getElementById("prefeitos-view-tabela");

    const btnCat = document.getElementById("btn-view-mode-catalogo");
    const btnCron = document.getElementById("btn-view-mode-cronologia");
    const btnTab = document.getElementById("btn-view-mode-tabela");

    const activeClass = "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 bg-[#a45b16] text-white shadow-2xs cursor-pointer";
    const inactiveClass = "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 cursor-pointer";

    if (catView) catView.classList.toggle("hidden", mode !== 'catalogo');
    if (cronView) cronView.classList.toggle("hidden", mode !== 'cronologia');
    if (tabView) tabView.classList.toggle("hidden", mode !== 'tabela');

    if (btnCat) {
      btnCat.className = mode === 'catalogo' ? activeClass : inactiveClass;
      btnCat.setAttribute("aria-selected", mode === 'catalogo' ? "true" : "false");
    }
    if (btnCron) {
      btnCron.className = mode === 'cronologia' ? activeClass : inactiveClass;
      btnCron.setAttribute("aria-selected", mode === 'cronologia' ? "true" : "false");
    }
    if (btnTab) {
      btnTab.className = mode === 'tabela' ? activeClass : inactiveClass;
      btnTab.setAttribute("aria-selected", mode === 'tabela' ? "true" : "false");
    }

    renderPrefeitosEditorial();
  }

  /**
   * Renderizador Central do Módulo de Governantes
   */
  function renderPrefeitosEditorial() {
    const data = window.HISTORIA_SJC_DATA;
    if (!data || !data.prefeitos) return;

    // Atualizar Indicadores Museológicos no Cabeçalho
    const indTotal = document.getElementById("indicador-total-autoridades");
    const indRefs = document.getElementById("indicador-total-referencias");
    if (indTotal) indTotal.textContent = data.prefeitos.length;
    if (indRefs && data.prefeitosDossie && data.prefeitosDossie.referencias) {
      indRefs.textContent = data.prefeitosDossie.referencias.length;
    }

    // Filtragem Multi-critério
    const query = prefeitosBuscaAtual.trim().toLowerCase();
    const filtrados = data.prefeitos.filter(function(pref) {
      // 1. Filtro de Época
      if (prefeitosEraFiltro !== 'todas' && pref.eraId !== prefeitosEraFiltro) {
        return false;
      }
      // 2. Filtro de Acesso / Categoria
      if (prefeitosFiltroAtual !== 'todos' && pref.categoria !== prefeitosFiltroAtual) {
        return false;
      }
      // 3. Filtro de Status
      if (prefeitosStatusFiltro === 'confirmados' && isPrefeitoComRessalva(pref)) {
        return false;
      }
      if (prefeitosStatusFiltro === 'ressalvas' && !isPrefeitoComRessalva(pref)) {
        return false;
      }
      // 4. Busca Textual
      if (query) {
        const haystack = (
          (pref.nome || '') + ' ' +
          (pref.periodo || '') + ' ' +
          (pref.cargo || '') + ' ' +
          (pref.marcos || '') + ' ' +
          (pref.situacaoDocumental || '') + ' ' +
          (pref.eraNome || '')
        ).toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });

    prefeitosFilteredCache = filtrados;

    const countDisplay = document.getElementById("prefeitos-count-display");
    if (countDisplay) {
      countDisplay.textContent = filtrados.length;
    }

    // Renderizar tabela documental técnica e complementos
    renderPrefeitosTabela(filtrados);
    renderPrefeitosComplementos();
  }

  /**
   * MODO 1: Catálogo Biográfico Editorial (Grade de Cartões)
   */
  function renderPrefeitosCatalogo(filtrados) {
    const container = document.getElementById("prefeitos-view-catalogo");
    if (!container) return;

    if (filtrados.length === 0) {
      container.innerHTML = `
        <div class="col-span-full py-12 px-6 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 space-y-3">
          <i class="fa-solid fa-magnifying-glass text-3xl text-slate-300 block mb-1"></i>
          <p class="font-bold text-slate-700 text-sm">Nenhum governante encontrado para os filtros selecionados.</p>
          <p class="text-xs text-slate-400">Tente buscar por outro termo ou limpe os filtros para restaurar a série completa.</p>
          <button type="button" onclick="window.resetarPrefeitosFiltros()" class="mt-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#a45b16] text-white hover:bg-[#8c4d12] transition-colors cursor-pointer shadow-2xs">
            Restaurar todos os 53 registros
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = filtrados.map(function(pref) {
      const refs = pref.referenciasDetalhadas || [];
      const eraRotulo = pref.eraNome ? pref.eraNome.split('(')[0].trim() : 'Histórico';

      return `
        <article class="group bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#a45b16]/40 transition-all flex flex-col justify-between overflow-hidden relative">
          <!-- Topo do Cartão: Header, Avatar e Identificação -->
          <div class="p-4 sm:p-5 flex-1 flex flex-col">
            <!-- Linha Superior: Época & Período -->
            <div class="flex items-center justify-between gap-2 mb-3">
              <span class="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-[#a45b16] bg-[#a45b16]/8 px-2 py-0.5 rounded-md border border-[#a45b16]/15 truncate max-w-[55%]">
                ${escapeHtml(eraRotulo)}
              </span>
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-100 text-slate-800 border border-slate-200 shrink-0">
                <i class="fa-regular fa-calendar text-[9px] text-slate-500"></i> ${escapeHtml(pref.periodo)}
              </span>
            </div>

            <!-- Identidade: Monograma/Avatar e Dados Históricos -->
            <div class="flex items-start gap-3.5 mb-3">
              ${renderPrefeitoAvatar(pref, 'card')}
              <div class="flex-1 min-w-0">
                <h3 class="text-sm sm:text-base font-black text-slate-900 tracking-tight leading-snug group-hover:text-[#a45b16] transition-colors line-clamp-2">
                  ${escapeHtml(pref.nome)}
                </h3>
                <p class="text-[11px] text-slate-500 font-medium mt-1 line-clamp-2 leading-tight">
                  ${escapeHtml(pref.cargo || 'Autoridade Municipal')}
                </p>
                <div class="flex flex-wrap items-center gap-1.5 mt-2">
                  ${renderPrefeitoBadge(pref.categoria)}
                  ${renderPrefeitoStatusBadge(pref)}
                </div>
              </div>
            </div>

            <!-- Síntese Documental (Marcos) -->
            <div class="mt-2 pt-3 border-t border-slate-100 flex-1">
              <div class="text-[11px] text-slate-700 leading-relaxed font-normal line-clamp-3">
                ${formatarCitacoesDossie(pref.marcos)}
              </div>
            </div>
          </div>

          <!-- Rodapé do Cartão: Contagem de Fontes & Ação do Dossiê -->
          <div class="px-4 sm:px-5 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
            <div class="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold">
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-200">
                <i class="fa-solid fa-scroll text-blue-700 text-[9px]"></i>
                ${refs.length} ${refs.length === 1 ? 'fonte' : 'fontes'}
              </span>
            </div>

            <button 
              type="button" 
              onclick="window.abrirPrefeitosDrawer('${pref.id}')" 
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#a45b16] bg-white hover:bg-[#a45b16] hover:text-white border border-[#a45b16]/30 shadow-2xs hover:shadow-xs transition-all cursor-pointer group/btn"
            >
              <span>Explorar dossiê</span>
              <i class="fa-solid fa-arrow-right text-[10px] group-hover/btn:translate-x-0.5 transition-transform"></i>
            </button>
          </div>
        </article>
      `;
    }).join('');
  }

  /**
   * MODO 2: Cronologia Documental Navegável (Linha do Tempo Vertical)
   */
  function renderPrefeitosCronologia(filtrados) {
    const container = document.getElementById("prefeitos-view-cronologia");
    if (!container) return;

    if (filtrados.length === 0) {
      container.innerHTML = `
        <div class="py-12 px-6 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 space-y-3">
          <i class="fa-solid fa-magnifying-glass text-3xl text-slate-300 block mb-1"></i>
          <p class="font-bold text-slate-700 text-sm">Nenhum governante encontrado para a cronologia.</p>
          <button type="button" onclick="window.resetarPrefeitosFiltros()" class="mt-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#a45b16] text-white hover:bg-[#8c4d12] transition-colors cursor-pointer shadow-2xs">
            Restaurar todos os 53 registros
          </button>
        </div>
      `;
      return;
    }

    // Agrupamento por Eras Históricas preservando a ordem cronológica
    const erasMap = new Map();
    filtrados.forEach(function(pref) {
      const eraKey = pref.eraId || 'outros';
      if (!erasMap.has(eraKey)) {
        erasMap.set(eraKey, {
          nome: pref.eraNome || 'Período Histórico',
          cor: pref.eraCor || 'amber',
          itens: []
        });
      }
      erasMap.get(eraKey).itens.push(pref);
    });

    let html = '<div class="space-y-8">';
    erasMap.forEach(function(eraGroup) {
      html += `
        <div class="space-y-4">
          <!-- Cabeçalho da Era na Cronologia -->
          <div class="sticky top-2 z-20 bg-slate-900/90 backdrop-blur-md text-white px-4 py-2.5 rounded-xl border border-slate-800 shadow-md flex items-center justify-between">
            <div class="flex items-center gap-2">
              <i class="fa-solid fa-calendar-days text-amber-400 text-xs"></i>
              <h4 class="text-xs sm:text-sm font-black tracking-tight">${escapeHtml(eraGroup.nome)}</h4>
            </div>
            <span class="text-[10px] font-mono font-bold text-slate-300 bg-white/10 px-2 py-0.5 rounded-full">
              ${eraGroup.itens.length} ${eraGroup.itens.length === 1 ? 'autoridade' : 'autoridades'}
            </span>
          </div>

          <!-- Trilha Vertical Conectada -->
          <div class="relative border-l-2 border-amber-300/80 ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-4">
            ${eraGroup.itens.map(function(pref) {
              const refs = pref.referenciasDetalhadas || [];
              return `
                <div class="relative group">
                  <!-- Ponto Conector na Régua -->
                  <div class="absolute -left-[31px] sm:-left-[39px] top-4 w-4 h-4 rounded-full bg-white border-4 border-[#a45b16] shadow-2xs group-hover:scale-125 transition-transform"></div>

                  <!-- Cartão Cronológico -->
                  <div class="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs hover:shadow-md hover:border-[#a45b16]/40 transition-all space-y-3">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                      <div class="flex items-center gap-2">
                        <span class="px-2 py-0.5 rounded-md text-[11px] font-mono font-black bg-amber-50 text-amber-900 border border-amber-200">
                          ${escapeHtml(pref.periodo)}
                        </span>
                        <h4 class="text-sm sm:text-base font-black text-slate-900 group-hover:text-[#a45b16] transition-colors">
                          ${escapeHtml(pref.nome)}
                        </h4>
                      </div>
                      <div class="flex flex-wrap items-center gap-1.5">
                        ${renderPrefeitoBadge(pref.categoria)}
                        ${renderPrefeitoStatusBadge(pref)}
                      </div>
                    </div>

                    <p class="text-xs text-slate-600 font-medium">
                      ${escapeHtml(pref.cargo || 'Autoridade Municipal')}
                    </p>

                    <div class="text-xs text-slate-700 leading-relaxed font-normal">
                      ${formatarCitacoesDossie(pref.marcos)}
                    </div>

                    <div class="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      <span class="text-[10px] text-slate-500 font-bold flex items-center gap-1">
                        <i class="fa-solid fa-scroll text-blue-700 text-[9px]"></i> ${refs.length} fontes documentais
                      </span>
                      <button 
                        type="button" 
                        onclick="window.abrirPrefeitosDrawer('${pref.id}')" 
                        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#a45b16] bg-amber-50 hover:bg-[#a45b16] hover:text-white border border-[#a45b16]/30 transition-all cursor-pointer shadow-2xs"
                      >
                        <span>Ver dossiê completo</span>
                        <i class="fa-solid fa-arrow-right text-[10px]"></i>
                      </button>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    });
    html += '</div>';

    container.innerHTML = html;
  }

  /**
   * Helper para formatar período com anotações em itálico
   */
  function formatarPeriodoEditorial(periodo) {
    if (!periodo) return '';
    return escapeHtml(periodo).replace(/\(([^)]+)\)/g, function(_, match) {
      return '<span class="gov-periodo-nota">(' + match + ')</span>';
    });
  }

  /**
   * Alternar expansão de fontes no card da tabela editorial
   */
  function toggleGovFonte(rowId, refId) {
    const item = document.getElementById('gov-ref-' + rowId + '-' + refId);
    const btn = document.getElementById('gov-btn-ref-' + rowId + '-' + refId);
    if (!item) return;
    const isHidden = item.classList.contains('hidden');
    if (isHidden) {
      item.classList.remove('hidden');
      if (btn) btn.setAttribute('aria-expanded', 'true');
    } else {
      item.classList.add('hidden');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    }
  }
  window.toggleGovFonte = toggleGovFonte;

  /**
   * MODO 3: Tabela Documental Técnica com Estilo Editorial Arquivístico (Fonte Serifada Grande 23px)
   */
  function renderPrefeitosTabela(filtrados) {
    const tbody = document.getElementById("prefeitos-editorial-table-body");
    if (!tbody) return;

    if (filtrados.length === 0) {
      tbody.innerHTML = `
        <div class="py-12 px-6 text-center text-slate-500 space-y-3">
          <i class="fa-solid fa-magnifying-glass text-3xl text-slate-300 block mb-1"></i>
          <p class="font-bold text-slate-700 text-sm">Nenhum governante encontrado para os filtros selecionados.</p>
          <p class="text-xs text-slate-400">Tente buscar por outro termo ou limpe os filtros para restaurar a série completa.</p>
          <button type="button" onclick="window.resetarPrefeitosFiltros()" class="mt-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#a45b16] text-white hover:bg-[#8c4d12] transition-colors cursor-pointer shadow-2xs">
            Restaurar todos os 53 registros
          </button>
        </div>
      `;
      return;
    }

    tbody.innerHTML = filtrados.map(function(pref, idx) {
      const isSemAto = pref.categoria === 'Alegação / Não Confirmado';
      const bordaClasse = isSemAto ? 'sem-ato' : 'mandato-comprovado';
      const bullet = isSemAto ? '○' : '●';
      const ressalvaAsterisco = isPrefeitoComRessalva(pref) ? '<span class="gov-asterisco">*</span>' : '';
      const refs = pref.referenciasDetalhadas || [];
      const rowId = pref.id || idx;

      const periodoHtml = formatarPeriodoEditorial(pref.periodo);

      let acessoTexto = '';
      if (!isSemAto) {
        if (pref.categoria === 'Eleito') {
          acessoTexto = 'Eleito direto';
        } else if (pref.categoria && pref.categoria !== 'Outros') {
          acessoTexto = pref.categoria;
        }
      }

      // Coluna 2: Feitos e Situação Documental
      const marcosTrim = (pref.marcos || '').trim();
      const isSemFeitos = !marcosTrim || marcosTrim === 'Nenhum feito localizado.';
      const feitosHtml = isSemFeitos
        ? '<p class="gov-feitos-vazio">Nenhum feito localizado na documentação primária consultada.</p>'
        : '<p>' + formatarCitacoesDossie(pref.marcos) + '</p>';

      const situacaoRaw = (pref.situacaoDocumental || '').trim();
      let situacaoHtml = '';
      if (situacaoRaw) {
        situacaoHtml = `
          <div class="gov-nota-editorial">
            <strong>Situação Documental:</strong> ${formatarCitacoesDossie(situacaoRaw)}
          </div>
        `;
      }

      // Coluna 3: Fontes
      const botoesFontes = refs.map(function(r) {
        const itemDomId = 'gov-ref-' + rowId + '-' + r.id;
        const btnDomId = 'gov-btn-ref-' + rowId + '-' + r.id;
        return `
          <button 
            type="button" 
            class="gov-fonte-btn" 
            id="${btnDomId}"
            aria-expanded="false" 
            aria-controls="${itemDomId}"
            onclick="window.toggleGovFonte('${rowId}', '${r.id}')"
            title="Ver referência [${r.id}]"
          >
            [${r.id}]
          </button>
        `;
      }).join(' ');

      const cardsFontes = refs.map(function(r, rIdx) {
        const itemDomId = 'gov-ref-' + rowId + '-' + r.id;
        const isHidden = rIdx === 0 ? '' : 'hidden';
        return `
          <div id="${itemDomId}" class="gov-fonte-detalhe ${isHidden}">
            <div>
              <span style="color: var(--acento); font-weight: 600; margin-right: 4px;">[${r.id}]</span>${escapeHtml(r.fullText)}
            </div>
            <div class="gov-fonte-links">
              <button type="button" onclick="window.copiarReferenciaAbnt('${r.id}', this)" class="gov-fonte-link-btn">
                <i class="fa-regular fa-copy"></i> Copiar
              </button>
              ${r.url ? `
                <a href="${escapeHtml(safeUrl(r.url))}" target="_blank" rel="noopener noreferrer" class="gov-fonte-link-a">
                  Ato primário ↗
                </a>
              ` : `
                <span style="color: var(--suave); font-style: italic; font-size: 12px;">Arquivo primário</span>
              `}
            </div>
          </div>
        `;
      }).join('');

      return `
        <div class="gov-row" id="pref-row-${rowId}" role="row">
          <!-- Coluna 1: Governante e Período (Fonte Serifada Grande 23px) -->
          <div class="gov-col-autoridade ${bordaClasse}">
            <div class="gov-nome">${escapeHtml(pref.nome)}</div>
            <div class="gov-periodo">${periodoHtml}</div>
            <div class="gov-status-line">
              <span class="gov-status-bullet">${bullet}</span>
              <span>${isSemAto ? 'Sem Ato Primário' : 'Mandato Comprovado'}</span>
              ${ressalvaAsterisco}
            </div>
            ${acessoTexto ? '<div class="gov-acesso-line">' + escapeHtml(acessoTexto) + '</div>' : ''}
            <div class="mt-3">
              <button 
                type="button" 
                onclick="window.abrirPrefeitosDrawer('${pref.id}')" 
                class="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--acento)] hover:underline cursor-pointer"
                title="Abrir dossiê completo de ${escapeHtml(pref.nome)}"
              >
                <span>Dossiê documental ↗</span>
              </button>
            </div>
          </div>

          <!-- Coluna 2: Feitos e Situação Documental -->
          <div class="gov-col-feitos">
            ${feitosHtml}
            ${situacaoHtml}
          </div>

          <!-- Coluna 3: Fontes e Citações ABNT -->
          <div class="gov-col-fontes">
            <div class="gov-fontes-nav">
              ${botoesFontes}
            </div>
            <div class="gov-fontes-expansivel">
              ${cardsFontes}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * Renderizar os Cards de Correções, Lacunas e Referências [1–93] no Rodapé
   */
  function renderPrefeitosComplementos() {
    const data = window.HISTORIA_SJC_DATA;
    if (!data || !data.prefeitosDossie) return;
    const dossie = data.prefeitosDossie;

    // 1. Correções da Tabela Inicial (Bloco 1)
    const corrContainer = document.getElementById("prefeitos-correcoes-content");
    if (corrContainer && !corrContainer.dataset.rendered && dossie.correcoesTabelaInicial) {
      corrContainer.innerHTML = dossie.correcoesTabelaInicial.map(function(item) {
        return `<div class="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80 flex items-start gap-2">
          <i class="fa-solid fa-circle-check text-emerald-600 text-xs mt-0.5 shrink-0"></i>
          <div class="text-[11px] text-slate-700 leading-snug font-medium">${formatarCitacoesDossie(item)}</div>
        </div>`;
      }).join('');
      corrContainer.dataset.rendered = "true";
    }

    // 2. Lacunas e Critérios Historiográficos
    const lacContainer = document.getElementById("prefeitos-lacunas-content");
    if (lacContainer && !lacContainer.dataset.rendered) {
      let html = '';
      if (dossie.lacunasBloco1 && dossie.lacunasBloco1.length) {
        html += `<div class="p-2.5 bg-amber-50/60 rounded-lg border border-amber-200/60 space-y-1">
          <span class="font-bold text-amber-950 text-xs flex items-center gap-1.5"><i class="fa-solid fa-circle-info text-amber-600"></i> Lacunas do Bloco até 1941:</span>
          <p class="text-[11px] text-slate-700 leading-snug">${escapeHtml(dossie.lacunasBloco1.join(' '))}</p>
        </div>`;
      }
      if (dossie.lacunasBloco2 && dossie.lacunasBloco2.length) {
        html += dossie.lacunasBloco2.map(function(item) {
          return `<div class="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80 flex items-start gap-2">
            <i class="fa-solid fa-triangle-exclamation text-amber-600 text-xs mt-0.5 shrink-0"></i>
            <div class="text-[11px] text-slate-700 leading-snug font-medium">${formatarCitacoesDossie(item)}</div>
          </div>`;
        }).join('');
      }
      lacContainer.innerHTML = html;
      lacContainer.dataset.rendered = "true";
    }

    // 3. Referências Documentais [1–93]
    const refContainer = document.getElementById("prefeitos-referencias-content");
    if (refContainer && !refContainer.dataset.rendered && dossie.referencias) {
      refContainer.innerHTML = dossie.referencias.map(function(r) {
        const linkHtml = r.url 
          ? `<a href="${escapeHtml(safeUrl(r.url))}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 ml-1 text-brand-800 hover:text-brand-900 underline font-semibold"><i class="fa-solid fa-arrow-up-right-from-square text-[9px]"></i> Acessar fonte</a>` 
          : '';

        return `<li id="ref-dossie-${r.id}" class="p-2 rounded-lg border border-transparent hover:border-slate-200 hover:bg-slate-50/80 transition-all flex items-start gap-2">
          <span class="w-7 h-5 rounded bg-slate-100 text-slate-800 font-mono font-bold text-[10px] flex items-center justify-center shrink-0 border border-slate-200">[${r.id}]</span>
          <div class="text-[11px] text-slate-700 leading-snug font-normal">
            ${escapeHtml(r.fullText)} ${linkHtml}
          </div>
        </li>`;
      }).join('');
      refContainer.dataset.rendered = "true";
    }
  }

  /**
   * Filtrar por Época Política
   */
  function filtrarPrefeitosEra(eraId) {
    prefeitosEraFiltro = eraId;
    document.querySelectorAll('.prefeitos-era-btn').forEach(function(btn) {
      const e = btn.getAttribute('data-pref-era');
      if (e === eraId) {
        btn.classList.add('is-active');
      } else {
        btn.classList.remove('is-active');
      }
    });
    renderPrefeitosEditorial();
  }

  /**
   * Filtrar por Categoria / Forma de Acesso Político
   */
  function filtrarPrefeitosCategoria(categoria) {
    prefeitosFiltroAtual = categoria;
    document.querySelectorAll('.prefeitos-filter-btn').forEach(function(btn) {
      const filter = btn.getAttribute('data-pref-filter');
      if (filter === categoria) {
        btn.classList.add('is-active');
      } else {
        btn.classList.remove('is-active');
      }
    });
    renderPrefeitosEditorial();
  }

  /**
   * Filtrar por Status Documental (Comprovados vs Com Ressalvas)
   */
  function filtrarPrefeitosStatus(status) {
    prefeitosStatusFiltro = status;
    document.querySelectorAll('.prefeitos-status-btn').forEach(function(btn) {
      const s = btn.getAttribute('data-pref-status');
      if (s === status) {
        btn.classList.add('is-active');
      } else {
        btn.classList.remove('is-active');
      }
    });
    renderPrefeitosEditorial();
  }

  /**
   * Resetar Todos os Filtros
   */
  function resetarPrefeitosFiltros() {
    prefeitosEraFiltro = 'todas';
    prefeitosFiltroAtual = 'todos';
    prefeitosStatusFiltro = 'todos';
    prefeitosBuscaAtual = '';

    const searchInput = document.getElementById("prefeitos-search-input");
    if (searchInput) searchInput.value = '';
    const clearBtn = document.getElementById("btn-prefeitos-clear-search");
    if (clearBtn) clearBtn.classList.add("hidden");

    filtrarPrefeitosEra('todas');
    filtrarPrefeitosCategoria('todos');
    filtrarPrefeitosStatus('todos');
  }

  /**
   * Busca em tempo real com indicador de limpar
   */
  function handlePrefeitosSearch(termo) {
    prefeitosBuscaAtual = termo;
    const clearBtn = document.getElementById("btn-prefeitos-clear-search");
    if (clearBtn) {
      if (termo && termo.trim().length > 0) {
        clearBtn.classList.remove("hidden");
      } else {
        clearBtn.classList.add("hidden");
      }
    }
    renderPrefeitosEditorial();
  }

  /**
   * Alternar Acordeões de Prefeitos
   */
  function togglePrefeitosAccordion(accordionId) {
    const el = document.getElementById(accordionId);
    const icon = document.getElementById(accordionId + "-icon");
    if (!el) return;
    const isHidden = el.classList.contains("hidden");
    if (isHidden) {
      el.classList.remove("hidden");
      if (icon) icon.classList.add("rotate-180");
    } else {
      el.classList.add("hidden");
      if (icon) icon.classList.remove("rotate-180");
    }
  }

  /**
   * Destacar e Rolar para Referência [N] (No Drawer, na Tabela ou no Rodapé)
   */
  function abrirRefPrefeitos(refNum, event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (!refNum) return;

    // 1. Se estiver com o drawer aberto e o card da referência estiver no drawer
    const drawerItem = document.getElementById("drawer-ref-item-" + refNum);
    if (drawerItem) {
      drawerItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      drawerItem.classList.add("bg-amber-100", "ring-2", "ring-amber-500", "shadow-sm");
      setTimeout(function() {
        drawerItem.classList.remove("bg-amber-100", "ring-2", "ring-amber-500", "shadow-sm");
      }, 3500);
      return;
    }

    // 2. Se estiver na tabela técnica
    const tableItem = document.getElementById("table-ref-item-" + refNum);
    if (tableItem) {
      tableItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      tableItem.classList.add("bg-amber-100", "ring-2", "ring-amber-500", "shadow-sm");
      setTimeout(function() {
        tableItem.classList.remove("bg-amber-100", "ring-2", "ring-amber-500", "shadow-sm");
      }, 3500);
      return;
    }

    // 3. Caso contrário, abre o catálogo geral no rodapé
    const acc = document.getElementById("accordion-referencias");
    const icon = document.getElementById("accordion-referencias-icon");
    if (acc && acc.classList.contains("hidden")) {
      acc.classList.remove("hidden");
      if (icon) icon.classList.add("rotate-180");
    }

    const refItem = document.getElementById("ref-dossie-" + refNum);
    if (refItem) {
      refItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      refItem.classList.add("bg-amber-100", "ring-2", "ring-amber-500", "shadow-sm");
      setTimeout(function() {
        refItem.classList.remove("bg-amber-100", "ring-2", "ring-amber-500", "shadow-sm");
      }, 3500);
    }
  }

  function abrirCatalogoGeralDossie() {
    const acc = document.getElementById("accordion-referencias");
    const icon = document.getElementById("accordion-referencias-icon");
    if (acc) {
      acc.classList.remove("hidden");
      if (icon) icon.classList.add("rotate-180");
      acc.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /**
   * ABRIR PAINEL LATERAL DO DOSSIÊ INDIVIDUAL (DRAWER SEÇÕES A–E)
   */
  function abrirPrefeitosDrawer(prefeitoId) {
    const data = window.HISTORIA_SJC_DATA;
    if (!data || !data.prefeitos) return;

    let pref = data.prefeitos.find(function(p) {
      return String(p.id) === String(prefeitoId);
    });

    if (!pref) {
      const idx = parseInt(prefeitoId, 10);
      if (!isNaN(idx) && data.prefeitos[idx]) {
        pref = data.prefeitos[idx];
      }
    }

    if (!pref) return;

    prefeitoAtivoId = pref.id;

    // Localizar índice na lista filtrada ativa para navegação sequencial
    const list = (prefeitosFilteredCache && prefeitosFilteredCache.length > 0) ? prefeitosFilteredCache : data.prefeitos;
    let currentIndex = list.findIndex(function(p) { return String(p.id) === String(pref.id); });
    if (currentIndex === -1) currentIndex = 0;
    const totalFiltrados = list.length;
    const hasPrev = currentIndex > 0;
    const hasNext = currentIndex < totalFiltrados - 1;

    const drawer = document.getElementById("prefeitos-abnt-drawer");
    const backdrop = document.getElementById("prefeitos-abnt-drawer-backdrop");
    const content = document.getElementById("prefeitos-drawer-content");

    if (!content) return;

    const isNaoConfirmado = pref.categoria === 'Alegação / Não Confirmado';
    const refs = pref.referenciasDetalhadas || [];

    content.innerHTML = `
      <!-- Cabeçalho Fixo do Drawer -->
      <div class="p-4 sm:p-5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between shrink-0">
        <div class="flex items-center gap-2.5 min-w-0">
          <div class="w-8 h-8 rounded-lg bg-[#a45b16] text-white flex items-center justify-center text-sm shrink-0 shadow-2xs">
            <i class="fa-solid fa-landmark"></i>
          </div>
          <div class="min-w-0">
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-black uppercase tracking-wider text-amber-300">Dossiê Documental</span>
              <span class="text-slate-500">•</span>
              <span class="text-[10px] font-mono font-bold text-slate-300">${escapeHtml(pref.periodo)}</span>
            </div>
            <h3 id="dossie-drawer-nome" class="text-sm sm:text-base font-black truncate text-white">
              ${escapeHtml(pref.nome)}
            </h3>
          </div>
        </div>
        <button 
          type="button" 
          onclick="window.fecharPrefeitosDrawer()" 
          class="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0" 
          aria-label="Fechar dossiê"
        >
          <i class="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>

      <!-- Corpo Rolável do Dossiê com Seções A, B, C, D -->
      <div class="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 scrollbar-thin bg-slate-50/60">

        <!-- SEÇÃO A: Identificação Histórica -->
        <section class="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-4">
          <div class="flex items-start gap-4">
            ${renderPrefeitoAvatar(pref, 'drawer')}
            <div class="flex-1 min-w-0 space-y-1.5">
              <div class="flex flex-wrap items-center gap-2">
                <span class="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-[#a45b16] bg-[#a45b16]/10 px-2 py-0.5 rounded-md border border-[#a45b16]/20">
                  ${escapeHtml(pref.eraNome || 'Acervo Histórico')}
                </span>
                <span class="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                  ${escapeHtml(pref.periodo)}
                </span>
              </div>
              <h2 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                ${escapeHtml(pref.nome)}
              </h2>
              <p class="text-xs sm:text-sm text-slate-600 font-medium">
                ${escapeHtml(pref.cargo || 'Autoridade Municipal')}
              </p>
              <div class="flex flex-wrap items-center gap-2 pt-1">
                ${renderPrefeitoBadge(pref.categoria)}
                ${renderPrefeitoStatusBadge(pref)}
              </div>
            </div>
          </div>
        </section>

        <!-- SEÇÃO B: Trajetória & Marcos Documentados -->
        <section class="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-3">
          <div class="flex items-center gap-2 pb-2 border-b border-slate-100">
            <i class="fa-solid fa-feather text-[#a45b16] text-sm"></i>
            <h3 class="text-xs font-black uppercase tracking-wider text-slate-900">Trajetória & Marcos Históricos Documentados</h3>
          </div>
          <div class="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2 font-normal">
            ${formatarCitacoesDossie(pref.marcos)}
          </div>
        </section>

        <!-- SEÇÃO C: Auditoria Documental & Ressalvas Historiográficas -->
        <section class="rounded-2xl p-5 border shadow-2xs space-y-3 ${isNaoConfirmado ? 'bg-rose-50/70 border-rose-200 text-rose-950' : 'bg-amber-50/60 border-amber-200/80 text-amber-950'}">
          <div class="flex items-center gap-2 pb-2 border-b ${isNaoConfirmado ? 'border-rose-200/80' : 'border-amber-200/80'}">
            <i class="fa-solid fa-shield-halved text-sm ${isNaoConfirmado ? 'text-rose-700' : 'text-amber-700'}"></i>
            <h3 class="text-xs font-black uppercase tracking-wider ${isNaoConfirmado ? 'text-rose-900' : 'text-amber-900'}">Auditoria Documental & Ressalvas Historiográficas</h3>
          </div>
          <div class="text-xs sm:text-sm leading-relaxed space-y-2 font-normal">
            ${formatarCitacoesDossie(pref.situacaoDocumental)}
          </div>
        </section>

        <!-- SEÇÃO D: Biblioteca de Fontes & Citações ABNT -->
        <section class="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-slate-100">
            <div class="flex items-center gap-2">
              <i class="fa-solid fa-book-bookmark text-blue-700 text-sm"></i>
              <h3 class="text-xs font-black uppercase tracking-wider text-slate-900">Fontes & Citações Documentais (${refs.length})</h3>
            </div>
            <span class="text-[10px] font-mono text-slate-500">Normas ABNT NBR 6023:2018</span>
          </div>

          <div class="space-y-3">
            ${refs.map(function(r) {
              return `
                <div id="drawer-ref-item-${r.id}" class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 transition-colors">
                  <div class="flex items-start gap-2">
                    <span class="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-mono font-black text-[10px] border border-blue-200 shrink-0">
                      [${r.id}]
                    </span>
                    <p class="text-xs text-slate-800 leading-relaxed font-normal flex-1">
                      ${escapeHtml(r.fullText)}
                    </p>
                  </div>
                  
                  <div class="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200/60 justify-end">
                    <button 
                      type="button" 
                      onclick="window.copiarReferenciaAbnt('${r.id}', this)" 
                      class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer shadow-2xs"
                    >
                      <i class="fa-regular fa-copy text-[10px]"></i>
                      <span>Copiar ABNT</span>
                    </button>
                    ${r.url ? `
                      <a 
                        href="${escapeHtml(safeUrl(r.url))}" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold text-blue-700 hover:text-blue-900 bg-blue-50/80 hover:bg-blue-100 border border-blue-200 transition-all"
                      >
                        <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                        <span>Acessar documento oficial ↗</span>
                      </a>
                    ` : `
                      <span class="text-[10px] text-slate-400 italic px-2 py-1">Arquivo documental primário</span>
                    `}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </section>

      </div>

      <!-- SEÇÃO E: Navegação Sequencial no Rodapé -->
      <div class="p-3.5 sm:p-4 bg-white border-t border-slate-200 shrink-0 flex items-center justify-between gap-3 shadow-lg">
        <button 
          type="button" 
          onclick="window.navigatePrefeito(-1)" 
          ${hasPrev ? '' : 'disabled'} 
          class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${hasPrev ? 'bg-slate-100 text-slate-800 hover:bg-slate-200 cursor-pointer' : 'bg-slate-50 text-slate-300 cursor-not-allowed'}"
        >
          <i class="fa-solid fa-arrow-left text-[11px]"></i>
          <span class="hidden sm:inline">Anterior</span>
        </button>

        <div class="text-center">
          <span class="text-xs font-black text-slate-800 font-mono">${currentIndex + 1} de ${totalFiltrados}</span>
          <span class="block text-[10px] text-slate-400">autoridades no filtro</span>
        </div>

        <div class="flex items-center gap-2">
          <button 
            type="button" 
            onclick="window.navigatePrefeito(1)" 
            ${hasNext ? '' : 'disabled'} 
            class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${hasNext ? 'bg-slate-100 text-slate-800 hover:bg-slate-200 cursor-pointer' : 'bg-slate-50 text-slate-300 cursor-not-allowed'}"
          >
            <span class="hidden sm:inline">Próximo</span>
            <i class="fa-solid fa-arrow-right text-[11px]"></i>
          </button>
          <button 
            type="button" 
            onclick="window.fecharPrefeitosDrawer()" 
            class="px-3 py-2 rounded-xl text-xs font-bold bg-[#a45b16] text-white hover:bg-[#8c4d12] transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    `;

    // Revelar Gaveta com Animação Suave
    if (backdrop) {
      backdrop.classList.remove("invisible", "opacity-0");
      backdrop.classList.add("opacity-100");
    }
    if (drawer) {
      drawer.classList.remove("invisible", "translate-x-full");
      drawer.classList.add("translate-x-0");
    }
    document.body.classList.add("overflow-hidden");
  }

  /**
   * FECHAR PAINEL LATERAL DO DOSSIÊ
   */
  function fecharPrefeitosDrawer() {
    const drawer = document.getElementById("prefeitos-abnt-drawer");
    const backdrop = document.getElementById("prefeitos-abnt-drawer-backdrop");

    if (backdrop) {
      backdrop.classList.remove("opacity-100");
      backdrop.classList.add("opacity-0");
      setTimeout(function() {
        backdrop.classList.add("invisible");
      }, 300);
    }
    if (drawer) {
      drawer.classList.remove("translate-x-0");
      drawer.classList.add("translate-x-full");
      setTimeout(function() {
        drawer.classList.add("invisible");
      }, 300);
    }
    document.body.classList.remove("overflow-hidden");
  }

  /**
   * Navegar Sequencialmente Entre Governantes no Dossiê
   */
  function navigatePrefeito(step) {
    const data = window.HISTORIA_SJC_DATA;
    if (!data || !data.prefeitos) return;

    const list = (prefeitosFilteredCache && prefeitosFilteredCache.length > 0) ? prefeitosFilteredCache : data.prefeitos;
    if (list.length === 0) return;

    let currentIndex = list.findIndex(function(p) { return String(p.id) === String(prefeitoAtivoId); });
    if (currentIndex === -1) currentIndex = 0;

    const nextIndex = currentIndex + step;
    if (nextIndex >= 0 && nextIndex < list.length) {
      abrirPrefeitosDrawer(list[nextIndex].id);
    }
  }

  /**
   * Selecionar por Índice (Compatibilidade)
   */
  function selectPrefeitoByIndex(idx) {
    const data = window.HISTORIA_SJC_DATA;
    if (!data || !data.prefeitos) return;
    if (data.prefeitos[idx]) {
      abrirPrefeitosDrawer(data.prefeitos[idx].id);
    }
  }

  /**
   * Abrir Dossiê Primário do Marco Histórico (Acessível, Seguro e com Fontes Auditadas)
   */
  function openHistoriaEventoModal(eventId) {
    const data = window.HISTORIA_SJC_DATA;
    const registro = REGISTRO_CONFIRMADO_POR_ID[eventId];
    if (!data || !registro) return;
    const ev = Object.assign({}, registro, {
      evidencia: "corroborado",
      resumo: registro.resumo,
      detalhes: registro.resumo,
      citacao: "Síntese editorial baseada na fonte indicada abaixo.",
      local: "São José dos Campos / referência indicada pela fonte",
      fontes: [{ nome: registro.fonte.nome, tipo: "Fonte institucional", url: registro.fonte.url }]
    });

    const modal = document.getElementById("historia-dossie-modal");
    if (!modal) return;

    const badge = EVIDENCIA_CONFIG[ev.evidencia] || EVIDENCIA_CONFIG.em_investigacao;
    const eraObj = (data.eras || []).find(function(era) { return era.id === ev.eraId; }) || { nome: "História de SJC" };

    const titleEl = document.getElementById("dossie-modal-titulo");
    const dateEl = document.getElementById("dossie-modal-data");
    const eraEl = document.getElementById("dossie-modal-era");
    const badgeEl = document.getElementById("dossie-modal-evidencia-badge");
    const citacaoEl = document.getElementById("dossie-modal-citacao");
    const resumoEl = document.getElementById("dossie-modal-resumo");
    const detalhesEl = document.getElementById("dossie-modal-detalhes");
    const localEl = document.getElementById("dossie-modal-local");
    const ontemEl = document.getElementById("dossie-modal-ontem");
    const hojeEl = document.getElementById("dossie-modal-hoje");
    const pessoasEl = document.getElementById("dossie-modal-pessoas");
    const instituicoesEl = document.getElementById("dossie-modal-instituicoes");
    const fontesTbody = document.getElementById("dossie-modal-fontes-tbody");
    const disputaAlert = document.getElementById("dossie-modal-disputa-alert");

    // Preenchimento textual seguro com textContent
    if (titleEl) titleEl.textContent = safeText(ev.titulo);
    if (dateEl) dateEl.textContent = safeText(ev.dataExata || String(ev.ano));
    if (eraEl) eraEl.textContent = safeText(eraObj.nome);

    if (badgeEl) {
      badgeEl.className = "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border " + badge.badgeClass;
      badgeEl.innerHTML = '<span class="w-2 h-2 rounded-full ' + badge.dotClass + '"></span> ' + escapeHtml(badge.text);
    }

    if (citacaoEl) citacaoEl.textContent = safeText(ev.citacao, "Registro oficial catalogado no acervo histórico do município.");
    if (resumoEl) resumoEl.textContent = safeText(ev.resumo);
    if (detalhesEl) detalhesEl.textContent = safeText(ev.detalhes || ev.resumo);
    if (localEl) localEl.textContent = safeText(ev.local, "São José dos Campos - SP");
    if (ontemEl) ontemEl.textContent = safeText(ev.ontem, "Contexto e dinâmica do período correspondente.");
    if (hojeEl) hojeEl.textContent = safeText(ev.hoje, "Legado urbano e memória preservada no presente.");

    // Alerta de disputa historiográfica
    if (disputaAlert) {
      if (ev.evidencia === "em_disputa") {
        disputaAlert.classList.remove("hidden");
      } else {
        disputaAlert.classList.add("hidden");
      }
    }

    // Pessoas envolvidas montadas via DOM
    if (pessoasEl) {
      pessoasEl.innerHTML = '';
      const pessoas = (ev.pessoasEnvolvidas && ev.pessoasEnvolvidas.length) ? ev.pessoasEnvolvidas : ["Não discriminadas na referência consultada"];
      pessoas.forEach(function(p) {
        const span = document.createElement('span');
        span.className = "px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200/60";
        span.textContent = safeText(p);
        pessoasEl.appendChild(span);
      });
    }

    // Instituições envolvidas montadas via DOM
    if (instituicoesEl) {
      instituicoesEl.innerHTML = '';
      const insts = (ev.instituicoesEnvolvidas && ev.instituicoesEnvolvidas.length) ? ev.instituicoesEnvolvidas : [ev.fonte.nome];
      insts.forEach(function(i) {
        const span = document.createElement('span');
        span.className = "px-2.5 py-1 rounded-xl bg-amber-50 text-amber-900 text-xs font-semibold border border-amber-200/60";
        span.textContent = safeText(i);
        instituicoesEl.appendChild(span);
      });
    }

    // Tabela de Fontes Primárias Auditadas (Construção DOM Segura com safeUrl)
    if (fontesTbody) {
      fontesTbody.innerHTML = '';
      const fontes = (ev.fontes && ev.fontes.length) ? ev.fontes : [];
      if (fontes.length === 0) {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.colSpan = 3;
        td.className = "px-3.5 py-2.5 text-xs text-slate-400 italic";
        td.textContent = "Fontes primárias arquivadas no Pró-Memória e acervos municipais.";
        tr.appendChild(td);
        fontesTbody.appendChild(tr);
      } else {
        fontes.forEach(function(f) {
          const tr = document.createElement('tr');
          const validUrl = safeUrl(f.url);

          const tdDoc = document.createElement('td');
          tdDoc.className = "px-3.5 py-2.5 font-bold text-slate-800 flex items-center gap-2";
          const icon = document.createElement('i');
          icon.className = "fa-solid fa-file-shield text-slate-400";
          tdDoc.appendChild(icon);
          const spanName = document.createElement('span');
          spanName.textContent = safeText(f.nome);
          tdDoc.appendChild(spanName);

          const tdTipo = document.createElement('td');
          tdTipo.className = "px-3.5 py-2.5 text-slate-500 font-medium";
          tdTipo.textContent = safeText(f.tipo, 'Acervo Primário');

          const tdAcesso = document.createElement('td');
          tdAcesso.className = "px-3.5 py-2.5 text-right";

          if (validUrl) {
            const a = document.createElement('a');
            a.href = validUrl;
            a.target = "_blank";
            a.rel = "noopener noreferrer";
            a.className = "text-cyan-700 hover:text-cyan-800 font-bold inline-flex items-center gap-1 underline underline-offset-2";
            a.textContent = "Acessar ";
            const extIcon = document.createElement('i');
            extIcon.className = "fa-solid fa-arrow-up-right-from-square text-[9px]";
            a.appendChild(extIcon);
            tdAcesso.appendChild(a);
          } else {
            const spanNoLink = document.createElement('span');
            spanNoLink.className = "text-slate-400 text-[11px] italic";
            spanNoLink.textContent = "Consulta local";
            tdAcesso.appendChild(spanNoLink);
          }

          tr.appendChild(tdDoc);
          tr.appendChild(tdTipo);
          tr.appendChild(tdAcesso);
          fontesTbody.appendChild(tr);
        });
      }
    }

    ModalManager.open("historia-dossie-modal");
  }

  function closeHistoriaEventoModal() {
    ModalManager.close("historia-dossie-modal");
  }

  function openPorQue1767Modal() {
    ModalManager.open("modal-porque-1767");
  }

  function closePorQue1767Modal() {
    ModalManager.close("modal-porque-1767");
  }

  // =========================================================================
  // 6. QUIZ DE JOSEENSIDADE (SEMÂNTICA ACESSÍVEL: FIELDSET/LEGEND/RADIO)
  // =========================================================================

  function renderQuizJoseensidade() {
    const container = document.getElementById("quiz-joseensidade-container");
    if (!container) return;

    if (quizState.submitted) {
      renderQuizResult(container);
      return;
    }

    let html = `
      <div class="space-y-6">
        <div class="p-4 rounded-2xl bg-brand-50/80 border border-brand-200 text-brand-950 text-xs flex items-center justify-between">
          <span class="font-bold"><i class="fa-solid fa-book-open text-brand-800 mr-1.5"></i> Leia a fonte, escolha uma interpretação e confira o registro.</span>
          <span class="font-mono font-black text-brand-900">${Object.keys(quizState.answers).length} / ${QUIZ_VERIFICADO.length} respondidas</span>
        </div>

        <form id="quiz-joseensidade-form" class="space-y-6" onsubmit="event.preventDefault(); window.Historia.submitQuizJoseensidade();">
    `;

    QUIZ_VERIFICADO.forEach(function(q, idx) {
      const selected = quizState.answers[q.id];

      html += `
        <fieldset class="p-5 rounded-2xl border ${selected ? 'border-brand-300 bg-brand-50/20' : 'border-slate-200 bg-white'} shadow-2xs space-y-3">
          <legend class="sr-only">${idx + 1}. ${escapeHtml(q.pergunta)}</legend>
          <div class="flex items-start gap-3" aria-hidden="true">
            <span class="w-7 h-7 rounded-xl font-mono font-black text-xs bg-slate-900 text-white flex items-center justify-center shrink-0">
              ${idx + 1}
            </span>
            <h4 class="text-sm font-black text-slate-900 leading-snug pt-0.5">
              ${escapeHtml(q.pergunta)}
            </h4>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 pl-0 sm:pl-10" role="radiogroup" aria-label="Opções para a pergunta ${idx + 1}">
            ${q.opcoes.map(function(op) {
              const isChecked = selected === op.id;
              return `
                <label 
                  class="p-3 rounded-xl border text-xs font-semibold text-left transition-all flex items-center gap-2.5 cursor-pointer focus-within:ring-2 focus-within:ring-brand-500 ${isChecked ? 'bg-brand-900 text-white border-brand-900 shadow-xs' : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'}"
                >
                  <input 
                    type="radio" 
                    name="quiz-q-${q.id}" 
                    value="${op.id}" 
                    ${isChecked ? 'checked' : ''} 
                    class="sr-only"
                    data-historia-action="select-quiz"
                    data-question-id="${q.id}"
                    data-option-id="${op.id}"
                    onchange="window.Historia.selectQuizAnswer(${q.id}, '${op.id}')"
                  />
                  <span class="w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-black uppercase font-mono shrink-0 ${isChecked ? 'bg-white/20 text-white' : 'bg-white border border-slate-300 text-slate-600'}">
                    ${op.id}
                  </span>
                  <span class="leading-tight">${escapeHtml(op.texto)}</span>
                </label>
              `;
            }).join('')}
          </div>
        </fieldset>
      `;
    });

    const totalAnswered = Object.keys(quizState.answers).length;
    const canSubmit = totalAnswered === QUIZ_VERIFICADO.length;

    html += `
          <!-- Botão de Finalizar -->
          <div class="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
            <p class="text-xs text-slate-500 italic">
              ${canSubmit ? 'Todas as questões respondidas. Confira o que as fontes permitem afirmar.' : `Faltam ${QUIZ_VERIFICADO.length - totalAnswered} questões para finalizar.`}
            </p>

            <button 
              type="button" 
              onclick="window.Historia ? window.Historia.submitQuizJoseensidade() : window.submitQuizJoseensidade()" 
              data-historia-action="submit-quiz"
              ${!canSubmit ? 'disabled' : ''}
              class="px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md ${canSubmit ? 'bg-brand-900 text-white hover:bg-brand-800 cursor-pointer' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}"
            >
              <span>Ver respostas e fontes</span>
              <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </form>
      </div>
    `;

    container.innerHTML = html;
  }

  function selectQuizAnswer(questionId, optionId) {
    quizState.answers[questionId] = optionId;
    renderQuizJoseensidade();
  }

  function submitQuizJoseensidade() {
    quizState.submitted = true;
    renderQuizJoseensidade();
  }

  function restartQuizJoseensidade() {
    quizState.answers = {};
    quizState.submitted = false;
    renderQuizJoseensidade();
  }

  function renderQuizResult(container) {
    let score = 0;
    QUIZ_VERIFICADO.forEach(function(q) {
      const selected = quizState.answers[q.id];
      const correctOption = q.opcoes.find(function(op) { return op.correta; });
      if (selected === correctOption.id) {
        score += 100 / QUIZ_VERIFICADO.length;
      }
    });

    let perfil = {
      titulo: "Leitor crítico",
      nivel: "A fonte em primeiro lugar",
      badgeClass: "bg-white text-brand-900",
      icone: "fa-book-open",
      desc: "Você comparou interpretações com registros consultáveis. O próximo passo é seguir as fontes e formular novas perguntas sobre a cidade."
    };

    if (score <= 40) {
      perfil = {
        titulo: "Investigador em formação",
        nivel: "Continue explorando",
        badgeClass: "bg-blue-100 text-blue-900",
        icone: "fa-compass",
        desc: "Uma data ou número pode mudar de sentido quando se abre a fonte. Consulte o gabarito e continue a investigação."
      };
    } else if (score <= 70) {
      perfil = {
        titulo: "Leitor atento",
        nivel: "Boa leitura das evidências",
        badgeClass: "bg-slate-100 text-slate-900",
        icone: "fa-circle-check",
        desc: "Você identificou diferenças entre tipos de fonte e marcos históricos. Confira as referências para aprofundar cada resposta."
      };
    }

    let html = `
      <div class="space-y-8 animate-in zoom-in-95 duration-500">
        <!-- Card de Resultado & Certificado -->
        <div class="p-8 rounded-3xl bg-gradient-to-br from-brand-950 via-slate-900 to-brand-900 text-white border border-brand-700/40 shadow-2xl text-center space-y-6 relative overflow-hidden">
          <div class="space-y-2">
            <span class="px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${perfil.badgeClass} shadow-sm inline-flex items-center gap-1.5">
              <i class="fa-solid ${perfil.icone}"></i> ${escapeHtml(perfil.nivel)}
            </span>
            <h3 class="text-3xl sm:text-4xl font-black text-white tracking-tight pt-2">
              ${Math.round(score)} / 100 Pontos
            </h3>
            <h4 class="text-lg font-bold text-amber-300">
              «${escapeHtml(perfil.titulo)}»
            </h4>
            <p class="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed pt-1">
              ${escapeHtml(perfil.desc)}
            </p>
          </div>

          <!-- Botões de Ação -->
          <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button 
              type="button" 
              onclick="window.Historia ? window.Historia.shareQuizResult(${score}, '${escapeHtml(perfil.titulo)}') : window.shareQuizResult(${score}, '${escapeHtml(perfil.titulo)}')" 
              data-historia-action="share-quiz"
              class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <i class="fa-brands fa-whatsapp text-sm"></i>
              <span>Compartilhar Resultado</span>
            </button>
            <button 
              type="button" 
              onclick="window.Historia ? window.Historia.restartQuizJoseensidade() : window.restartQuizJoseensidade()" 
              data-historia-action="restart-quiz"
              class="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-2 border border-white/20 transition-all cursor-pointer"
            >
              <i class="fa-solid fa-rotate-left text-xs"></i>
              <span>Tentar Novamente</span>
            </button>
          </div>
        </div>

        <!-- Gabarito Historiográfico com Explicações -->
        <div class="space-y-4">
          <h4 class="text-base font-black text-slate-900 flex items-center gap-2">
            <i class="fa-solid fa-list-check text-brand-800"></i> Respostas comentadas e fontes
          </h4>

          <div class="space-y-4">
            ${QUIZ_VERIFICADO.map(function(q, idx) {
              const selected = quizState.answers[q.id];
              const correct = q.opcoes.find(function(op) { return op.correta; });
              const isCorrect = selected === correct.id;

              return `
                <div class="p-5 rounded-2xl border ${isCorrect ? 'border-emerald-200 bg-emerald-50/30' : 'border-rose-200 bg-rose-50/30'} space-y-2 text-xs">
                  <div class="flex items-start justify-between gap-2">
                    <span class="font-bold text-slate-900">${idx + 1}. ${escapeHtml(q.pergunta)}</span>
                    <span class="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase ${isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}">
                      ${isCorrect ? 'Acertou (+10)' : 'Errou (0)'}
                    </span>
                  </div>
                  <p class="text-slate-600 font-medium">
                    <strong class="text-slate-800">Resposta Correta:</strong> (${correct.id.toUpperCase()}) ${escapeHtml(correct.texto)}
                  </p>
                  <p class="text-[11px] text-slate-500 italic bg-white/80 p-2.5 rounded-xl border border-slate-200/60">
                    <i class="fa-solid fa-circle-info text-brand-800 mr-1"></i> ${escapeHtml(q.explicacao)}<span class="block pt-2 not-italic">${fonteLinkHtml(q.fonte, "Abrir fonte consultada")}</span>
                  </p>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;
  }

  function shareQuizResult(score, titulo) {
    const text = `Fiz o Quiz de Joseensidade no Radar São José e tirei ${score}/100 pontos: «${titulo}»! Descubra seu nível de história da cidade em: https://radarsaojose.com.br/app.html#historia`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  // =========================================================================
  // 7. DEMOGRAFIA & MIGRAÇÃO (DE 2.000 PARA 750.000 HABITANTES)
  // =========================================================================

  const MIGRACAO_STEPS = [
    {
      id: 'sanatorio',
      ano: 'Antes de 1950',
      titulo: 'A Fase Sanatorial',
      shortTitle: 'Sanatorial',
      desc: 'Entre 1920 e 1950, São José dos Campos consolidou-se como a principal estância climatérica e antituberculosa do Brasil. Atraídos pela pureza do ar, topografia e amenidade térmica recomendadas pela medicina tisiológica da época, milhares de doentes afluíram da capital paulista, do Rio de Janeiro e de Minas Gerais. O fluxo transformou o tecido urbano com a construção de grandes complexos sanatoriais (como o Sanatório Vicentina Aranha, inaugurado em 1924 pela Santa Casa de Misericórdia de São Paulo, e o Sanatório Vila Samaritana), além de dezenas de pensões e consultórios especializados. O contingente de médicos sanitaristas, religiosos, enfermeiros e pacientes curados formou a base demográfica e profissional que preparou a cidade para receber os projetos federais das décadas seguintes.',
      fluxos: ['rj', 'sp_capital', 'sul_minas'],
      color: '#d97706',
      bounds: [[-24.5, -47.5], [-21.5, -43.0]], // SP capital, RJ e Sul de Minas
      fontes: [
        {
          autores: "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS",
          titulo: "História da Tuberculose e a Fase Sanatorial em São José dos Campos",
          veiculo: "Pró-Memória: História de São José dos Campos",
          local: "São José dos Campos",
          ano: "2024",
          pagina: "Seção Temática 'A Tuberculose e a Fase Sanatorial'",
          url: "https://www.camarasjc.sp.gov.br/promemoria/historia-sjc/"
        },
        {
          autores: "FERREIRA, Gabriel Henrique dos Santos",
          titulo: "A industrialização e a formação urbana de São José dos Campos",
          subtitulo: "Trabalho de Conclusão de Curso (Licenciatura em História)",
          veiculo: "Universidade do Vale do Paraíba (UNIVAP) / Acervo Pró-Memória CMSJC",
          local: "São José dos Campos",
          ano: "2024",
          pagina: "p. 18–25",
          url: "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/01/tcc-gabriel-finalizado-1.pdf#page=18"
        }
      ]
    },
    {
      id: 'fabricas',
      ano: '1950 – 1970',
      titulo: 'A Era das Fábricas',
      shortTitle: 'Fábricas',
      desc: 'Com a inauguração da Rodovia Presidente Dutra em 1951 e incentivos fiscais estratégicos, São José dos Campos passou por uma industrialização acelerada e atraiu corporações multinacionais de ponta, como Johnson & Johnson, General Motors, Rhodia, Ericsson e Eaton. Essa dinâmica converteu a cidade em um poderoso polo de atração migratória, mobilizando grandes contingentes de trabalhadores operários vindos do Nordeste brasileiro (especialmente dos sertões e agrestes da Bahia, Pernambuco e Ceará), do Sul de Minas Gerais e do Vale histórico. O influxo populacional redefiniu o mapa habitacional joseense, estimulando a abertura de loteamentos populares nas regiões Leste, Norte e Sul e alavancando as primeiras grandes mobilizações sindicais do setor metalúrgico.',
      fluxos: ['nordeste', 'sul_minas', 'interior_sp'],
      color: '#0284c7',
      bounds: [[-24.5, -48.0], [-7.5, -34.8]], // Brasil amplo até o Nordeste
      fontes: [
        {
          autores: "SANTOS, Eliane; AMARAL, Marisa",
          titulo: "Novos territórios produtivos, mudança tecnológica e mercado de trabalho: o caso de São José dos Campos",
          veiculo: "DADOS – Revista de Ciências Sociais",
          local: "Rio de Janeiro",
          volume: "v. 44, n. 3",
          ano: "2001",
          pagina: "p. 605–632",
          url: "https://www.scielo.br/j/dados/a/gJC5KFwX73k5XMh7CbgfBDr/?lang=pt"
        },
        {
          autores: "FERREIRA, Gabriel Henrique dos Santos",
          titulo: "A industrialização e a formação urbana de São José dos Campos",
          subtitulo: "Trabalho de Conclusão de Curso (Licenciatura em História)",
          veiculo: "Universidade do Vale do Paraíba (UNIVAP) / Acervo Pró-Memória CMSJC",
          local: "São José dos Campos",
          ano: "2024",
          pagina: "p. 31–44",
          url: "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2025/01/tcc-gabriel-finalizado-1.pdf#page=31"
        }
      ]
    },
    {
      id: 'tecnologia',
      ano: '1970 – 1990',
      titulo: 'A Cidade Tecnológica',
      shortTitle: 'Tecnológica',
      desc: 'A consolidação do Centro Técnico de Aeronáutica (CTA/DCTA, fundado em 1950), do Instituto Tecnológico de Aeronáutica (ITA), do Instituto Nacional de Pesquisas Espaciais (INPE, 1961) e a fundação da EMBRAER (1969) inauguraram uma onda migratória qualificada sem precedentes no país. Atraídos pela vanguarda científica, engenheiros aeronáuticos, cientistas da computação, físicos e pesquisadores de todas as capitais brasileiras (com expressivo destaque para São Paulo, Rio de Janeiro, Brasília, Porto Alegre e Recife) e especialistas estrangeiros fixaram residência no município. Esse ecossistema gerou fornecedores especializados em defesa e telecomunicações, elevando os padrões de renda, a qualificação da força de trabalho e remodelando os bairros centrais e oeste com bairros-jardins e infraestrutura moderna.',
      fluxos: ['nordeste_capitais', 'sul', 'sp_capital', 'rj', 'brasilia'],
      color: '#7c3aed',
      bounds: [[-30.5, -52.0], [-8.0, -38.0]], // Capitais brasileiras
      fontes: [
        {
          autores: "BARRETO, Katerine Roman",
          titulo: "Embraer: no contexto do desenvolvimento industrial de São José dos Campos (1950-2000)",
          veiculo: "Trabalho de Conclusão de Curso (História) – Faculdade de Educação e Artes, Universidade do Vale do Paraíba",
          local: "São José dos Campos",
          ano: "2002",
          pagina: "p. 42–68",
          url: "https://www.camarasjc.sp.gov.br/promemoria/2025/07/14/embraer-no-contexto-do-desenvolvimento-industrial-de-sao-jose-dos-campos-1950-2000/"
        },
        {
          autores: "OLIVEIRA, Márcia Regina de; SOUZA, Adriane Aparecida Moreira de; RIBEIRO, Anabela",
          titulo: "Implicações socioeconômicas e territoriais decorrentes do complexo aeroespacial",
          veiculo: "Revista Brasileira de Gestão e Desenvolvimento Regional (G&DR)",
          local: "Taubaté",
          volume: "v. 15, n. 6",
          ano: "2019",
          pagina: "p. 77–90",
          url: "https://www.rbgdr.net/revista/index.php/rbgdr/article/view/5204"
        }
      ]
    },
    {
      id: 'metropole',
      ano: '1990 em diante',
      titulo: 'A Metrópole Regional',
      shortTitle: 'Metrópole',
      desc: 'Com a ultrapassagem da marca de 700 mil habitantes, São José dos Campos consagrou-se como a sede oficial e metrópole polarizadora da Região Metropolitana do Vale do Paraíba e Litoral Norte (RMVale). A matriz migratória contemporânea transicionou da migração inter-regional de longa distância para uma densa dinâmica de mobilidade pendular e serviços avançados: acolhimento diário de estudantes e profissionais do Vale e do Sul de Minas, fortalecimento do polo médico-hospitalar e universitário, expansão dos centros de tecnologia da informação e logística (Parque Tecnológico de SJC) e centralização administrativa e financeira regional.',
      fluxos: ['vale_paraiba', 'litoral', 'sul_minas'],
      color: '#059669',
      bounds: [[-24.2, -46.5], [-22.2, -44.8]], // RMVale e Litoral Norte
      fontes: [
        {
          autores: "INSTITUTO BRASILEIRO DE GEOGRAFIA E ESTATÍSTICA (IBGE)",
          titulo: "Censo Demográfico 2022: População residente e características dos domicílios – São José dos Campos (SP)",
          veiculo: "Portal Cidades e Estados",
          local: "Rio de Janeiro: IBGE",
          ano: "2023",
          pagina: "Tabelas Demográficas e Sinopse Censitária",
          url: "https://www.ibge.gov.br/cidades-e-estados/sp/sao-jose-dos-campos.html"
        },
        {
          autores: "SÃO JOSÉ DOS CAMPOS. Secretaria de Governança",
          titulo: "São José em Dados: Mobilidade urbana, dinâmica regional e RMVale",
          veiculo: "Prefeitura Municipal de São José dos Campos",
          local: "São José dos Campos",
          ano: "2024",
          pagina: "Caderno Temático 'Demografia e Região'",
          url: "https://www.sjc.sp.gov.br/servicos/governanca/sao-jose-em-dados/"
        }
      ]
    }
  ];

  // Coordenadas Geográficas Reais [Latitude, Longitude]
  const MIGRACAO_GEO_NODES = {
    sjc: { lat: -23.1896, lng: -45.8841, label: 'São José dos Campos', type: 'target' },
    nordeste: { lat: -10.5000, lng: -38.5000, label: 'Região Nordeste (Sertão e Agreste)' },
    nordeste_capitais: { lat: -8.0500, lng: -34.9000, label: 'Capitais do Nordeste (Recife/Salvador)' },
    sul_minas: { lat: -22.2300, lng: -45.9300, label: 'Sul de Minas Gerais' },
    interior_sp: { lat: -21.7900, lng: -48.1700, label: 'Interior Paulista' },
    sp_capital: { lat: -23.5505, lng: -46.6333, label: 'São Paulo (Capital)' },
    rj: { lat: -22.9068, lng: -43.1729, label: 'Rio de Janeiro' },
    sul: { lat: -25.4284, lng: -49.2733, label: 'Região Sul (Curitiba/Porto Alegre)' },
    brasilia: { lat: -15.7975, lng: -47.8919, label: 'Brasília (DF)' },
    vale_paraiba: { lat: -22.8100, lng: -45.1900, label: 'Eixo Dutra / Vale do Paraíba' },
    litoral: { lat: -23.7600, lng: -45.4100, label: 'Litoral Norte (Caraguá/S. Sebastião)' }
  };

  window.MIGRACAO_STEPS = MIGRACAO_STEPS;
  window.MIGRACAO_GEO_NODES = MIGRACAO_GEO_NODES;

  let _migracaoLeafletMap = null;
  let _migracaoLayerGroup = null;

  window.activeMigracaoStep = window.activeMigracaoStep || 0;

  /**
   * Reposiciona o scroll de forma suave e previsível no início da narrativa do período migratório
   * respeitando o cabeçalho global fixo, a barra sticky contextual e a preferência por redução de movimento (WCAG 2.2).
   */
  function scrollMigracaoToStart() {
    const panel = document.getElementById('migracao-narrative-panel') || document.getElementById('migracao-joseenses-container');
    const stickyNav = document.getElementById('migracao-nav-sticky-container');
    if (!panel) return;

    const header = document.getElementById('main-app-header');
    const headerHeight = header ? header.getBoundingClientRect().height : 72;
    const stickyNavHeight = stickyNav ? stickyNav.getBoundingClientRect().height : 56;
    const breathingMargin = 16;
    const topOffset = headerHeight + stickyNavHeight + breathingMargin;

    const panelRect = panel.getBoundingClientRect();
    const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
    const targetTop = Math.max(0, panelRect.top + currentScrollY - topOffset);

    // Reposiciona de forma controlada uma única vez
    const currentOffset = panelRect.top - topOffset;
    if (Math.abs(currentOffset) > 8) {
      window.scrollTo({
        top: targetTop,
        behavior: 'auto'
      });
      checkMigracaoStickyState();
    }

    // Foco acessível no cabeçalho da narrativa para leitores de tela sem disparo de rolagem
    const title = document.getElementById('migracao-narrative-title');
    if (title) {
      title.setAttribute('tabindex', '-1');
      try {
        title.focus({ preventScroll: true });
      } catch (e) {}
    }
  }

  /**
   * Monitora a posição de rolagem para alternar dinamicamente entre estado normal e compacto da barra sticky
   */
  function checkMigracaoStickyState() {
    const nav = document.getElementById('migracao-nav-sticky-container');
    const sentinel = document.getElementById('migracao-sticky-sentinel');
    if (!nav || !sentinel) return;

    const sec = document.getElementById('section-view-migracao');
    if (!sec || sec.classList.contains('hidden')) return;

    const header = document.getElementById('main-app-header');
    const headerHeight = header ? header.getBoundingClientRect().height : 72;
    const sentinelRect = sentinel.getBoundingClientRect();

    // Histerese estável: entra em modo compacto ao passar do header, volta ao normal acima
    const isSticking = sentinelRect.top <= (headerHeight + 2);
    if (isSticking !== nav.classList.contains('is-stuck')) {
      nav.classList.toggle('is-stuck', isSticking);
      const h = nav.getBoundingClientRect().height;
      document.documentElement.style.setProperty('--migracao-sticky-height', h + 'px');
    }
  }

  // Listener passivo e leve de rolagem
  window.addEventListener('scroll', checkMigracaoStickyState, { passive: true });

  /**
   * Navegação acessível por teclado no Stepper (WAI-ARIA Tabs pattern)
   */
  function handleMigracaoTabKeydown(e, index) {
    let targetIndex = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      targetIndex = (index + 1) % MIGRACAO_STEPS.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      targetIndex = (index - 1 + MIGRACAO_STEPS.length) % MIGRACAO_STEPS.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      targetIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      targetIndex = MIGRACAO_STEPS.length - 1;
    }

    if (targetIndex !== null) {
      window.switchMigracaoStep(targetIndex, true);
      const newTab = document.getElementById(`migracao-tab-${targetIndex}`);
      if (newTab && typeof newTab.focus === 'function') {
        newTab.focus();
      }
    }
  }
  window.handleMigracaoTabKeydown = handleMigracaoTabKeydown;

  /**
   * Navegação sequencial programática entre períodos
   */
  window.navigateMigracaoStep = function(dir) {
    const nextIdx = (window.activeMigracaoStep || 0) + dir;
    if (nextIdx >= 0 && nextIdx < MIGRACAO_STEPS.length) {
      window.switchMigracaoStep(nextIdx, true);
    }
  };

  /**
   * Alterna o período ativo da narrativa de migração e sincroniza cartografia
   * @param {number} index - Índice do período migratório (0 a 3)
   * @param {boolean} [shouldScroll=true] - Se deve rolar a tela até o início da narrativa
   */
  window.switchMigracaoStep = function(index, shouldScroll) {
    if (typeof index !== 'number' || index < 0 || index >= MIGRACAO_STEPS.length) return;
    if (typeof shouldScroll === 'undefined') {
      shouldScroll = true;
    }

    window.activeMigracaoStep = index;
    const step = MIGRACAO_STEPS[index];

    // 1. Atualizar Abas do Stepper Cronológico
    const stepperContainer = document.getElementById('migracao-stepper-tabs');
    if (stepperContainer) {
      const tabs = stepperContainer.querySelectorAll('.migracao-tab-btn');
      tabs.forEach((tab, idx) => {
        const isCurrent = idx === index;
        const s = MIGRACAO_STEPS[idx];
        tab.setAttribute('aria-selected', isCurrent ? 'true' : 'false');
        tab.setAttribute('tabindex', isCurrent ? '0' : '-1');

        const badge = tab.querySelector('.migracao-tab-badge');
        const indicator = tab.querySelector('.migracao-tab-indicator');
        const titleEl = tab.querySelector('.migracao-tab-title');
        const compactNum = tab.querySelector('.migracao-compact-num');
        const compactName = tab.querySelector('.migracao-compact-name');

        if (isCurrent) {
          tab.className = "migracao-tab-btn is-active group relative p-3 sm:p-4 rounded-2xl bg-white border-2 text-left shadow-sm transition-all cursor-pointer ring-2 ring-amber-500/20 flex-1 min-w-[140px] sm:min-w-0";
          tab.style.borderColor = s.color;
          if (badge) {
            badge.style.backgroundColor = s.color;
            badge.style.color = '#ffffff';
          }
          if (indicator) {
            indicator.style.backgroundColor = s.color;
            indicator.classList.remove('opacity-0');
            indicator.classList.add('opacity-100');
          }
          if (titleEl) {
            titleEl.className = "migracao-tab-title text-xs sm:text-sm font-black text-slate-900 leading-snug";
          }
          if (compactNum) {
            compactNum.style.backgroundColor = s.color;
            compactNum.className = "migracao-compact-num font-mono font-black text-xs px-1.5 py-0.5 rounded-md text-white";
          }
          if (compactName) {
            compactName.className = "migracao-compact-name font-black text-xs truncate text-slate-900";
          }
        } else {
          tab.className = "migracao-tab-btn group relative p-3 sm:p-4 rounded-2xl bg-slate-50/70 hover:bg-white border border-slate-200/80 hover:border-slate-300 text-left transition-all cursor-pointer opacity-80 hover:opacity-100 flex-1 min-w-[140px] sm:min-w-0";
          tab.style.borderColor = '';
          if (badge) {
            badge.style.backgroundColor = '#e2e8f0';
            badge.style.color = '#475569';
          }
          if (indicator) {
            indicator.classList.remove('opacity-100');
            indicator.classList.add('opacity-0');
          }
          if (titleEl) {
            titleEl.className = "migracao-tab-title text-xs sm:text-sm font-bold text-slate-700 leading-snug";
          }
          if (compactNum) {
            compactNum.style.backgroundColor = '';
            compactNum.className = "migracao-compact-num font-mono font-black text-xs px-1.5 py-0.5 rounded-md text-slate-600 bg-slate-200";
          }
          if (compactName) {
            compactName.className = "migracao-compact-name font-bold text-xs truncate text-slate-700";
          }
        }
      });

      // Em mobile, assegura que a aba ativa esteja no viewport horizontal sem interferir na rolagem vertical da página
      const activeTab = document.getElementById(`migracao-tab-${index}`);
      if (activeTab && stepperContainer && stepperContainer.scrollWidth > stepperContainer.clientWidth) {
        const tabOffset = activeTab.offsetLeft - stepperContainer.offsetLeft;
        const targetLeft = tabOffset - (stepperContainer.clientWidth / 2) + (activeTab.clientWidth / 2);
        stepperContainer.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
      }
    }

    // 2. Atualizar aria-labelledby no painel narrativo
    const panel = document.getElementById('migracao-narrative-panel');
    if (panel) {
      panel.setAttribute('aria-labelledby', `migracao-tab-${index}`);
    }

    // 3. Atualizar o Painel Narrativo Editorial
    renderMigracaoNarrativeContent(index);

    // 4. Atualizar Badge do Cabeçalho do Mapa
    const badgeEl = document.getElementById('migracao-map-phase-badge');
    if (badgeEl) {
      badgeEl.innerHTML = `
        <span class="w-2.5 h-2.5 rounded-full animate-pulse" style="background-color: ${step.color}"></span>
        ${escapeHtml(step.titulo)}
      `;
    }

    // 5. Atualizar Card Flutuante de Rota no Mapa
    const overlayCard = document.getElementById('migracao-route-overlay-card');
    if (overlayCard) {
      overlayCard.innerHTML = `
        <div class="space-y-0.5 min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="w-2.5 h-2.5 rounded-full shrink-0" style="background-color: ${step.color}"></span>
            <span class="text-[11px] font-black uppercase tracking-wider text-slate-800">${escapeHtml(step.titulo)}</span>
            <span class="text-[11px] text-slate-500 font-mono">• ${escapeHtml(step.ano)}</span>
          </div>
          <p class="text-[11px] text-slate-600 truncate font-medium">Principais vetores: ${step.fluxos.map(f => MIGRACAO_GEO_NODES[f]?.label).filter(Boolean).join(', ')}.</p>
        </div>
        <div class="shrink-0 text-right">
          <span class="text-[10px] font-bold text-[#a45b16] bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/80 inline-flex items-center gap-1">
            <i class="fa-solid fa-location-dot text-[9px]"></i> Destino: São José dos Campos
          </span>
        </div>
      `;
    }

    // 6. Atualizar Camadas e Animações no Mapa Leaflet
    updateMigracaoLeafletMap();

    // 7. Atualizar variável CSS de altura da barra sticky
    const stickyNav = document.getElementById('migracao-nav-sticky-container');
    if (stickyNav) {
      const h = stickyNav.getBoundingClientRect().height;
      document.documentElement.style.setProperty('--migracao-sticky-height', h + 'px');
    }

    // 8. Reposicionar no início da narrativa (somente se disparado explicitamente pelo usuário)
    if (shouldScroll) {
      scrollMigracaoToStart();
    }
  };

  /**
   * Renderiza a narrativa do período migratório ativo com tipografia editorial e referências ABNT
   */
  function renderMigracaoNarrativeContent(index) {
    const container = document.getElementById('migracao-narrative-content');
    if (!container) return;

    const step = MIGRACAO_STEPS[index];

    // Formata o texto em parágrafos equilibrados para excelente legibilidade
    let descHtml = '';
    const rawDesc = step.desc || '';
    const sentences = rawDesc.match(/[^.!?]+[.!?]+(\s|$)/g) || [rawDesc];
    if (sentences.length >= 3) {
      const mid = Math.ceil(sentences.length / 2);
      const p1 = sentences.slice(0, mid).join('').trim();
      const p2 = sentences.slice(mid).join('').trim();
      descHtml = `
        <p class="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">${escapeHtml(p1)}</p>
        <p class="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">${escapeHtml(p2)}</p>
      `;
    } else {
      descHtml = `<p class="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">${escapeHtml(rawDesc)}</p>`;
    }

    // Pills com vetores de origem geográfica
    const originPills = (step.fluxos || []).map(originId => {
      const node = MIGRACAO_GEO_NODES[originId];
      if (!node) return '';
      return `
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          <span class="w-1.5 h-1.5 rounded-full" style="background-color: ${step.color}"></span>
          ${escapeHtml(node.label)}
        </span>
      `;
    }).join('');

    // Formatação de referências ABNT
    const fontesHtml = (step.fontes || []).map(f => formatMigracaoFonteAbnt(f)).join('');

    container.innerHTML = `
      <div class="space-y-6 animate-in fade-in duration-300">
        <!-- Top Metadata & Período Tag -->
        <div class="space-y-3 pb-5 border-b border-slate-100">
          <div class="flex flex-wrap items-center gap-2">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-white shadow-xs" style="background-color: ${step.color}">
              <i class="fa-solid fa-timeline text-[10px]"></i> Período 0${index + 1}
            </span>
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 font-mono">
              <i class="fa-regular fa-calendar text-[11px] text-slate-500"></i> ${escapeHtml(step.ano)}
            </span>
          </div>

          <h3 id="migracao-narrative-title" class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight outline-none">
            ${escapeHtml(step.titulo)}
          </h3>

          <!-- Origens Geográficas -->
          <div class="flex flex-wrap items-center gap-1.5 pt-1">
            <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1">
              <i class="fa-solid fa-route text-[#a45b16]"></i> Vetores:
            </span>
            ${originPills}
          </div>
        </div>

        <!-- Narrative Editorial Body -->
        <div class="space-y-4 text-justify sm:text-left">
          ${descHtml}
        </div>

        <!-- Seção de Fontes Históricas & Referências ABNT -->
        <div class="pt-5 border-t border-slate-100 space-y-3">
          <div class="flex items-center justify-between">
            <h4 class="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
              <i class="fa-solid fa-graduation-cap text-[#a45b16]"></i> Fontes Históricas & Referências (ABNT)
            </h4>
            <span class="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
              ${(step.fontes || []).length} ${(step.fontes || []).length === 1 ? 'fonte' : 'fontes'}
            </span>
          </div>
          <div class="space-y-2.5">
            ${fontesHtml}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Inicializa ou atualiza o Mapa Leaflet com Camada Oficial OpenStreetMap PB e Arcos Suaves
   */
  function updateMigracaoLeafletMap() {
    const mapContainer = document.getElementById('migracao-leaflet-map');
    if (!mapContainer || typeof L === 'undefined') return;

    const step = MIGRACAO_STEPS[window.activeMigracaoStep || 0];
    const target = MIGRACAO_GEO_NODES.sjc;

    if (!_migracaoLeafletMap) {
      _migracaoLeafletMap = L.map('migracao-leaflet-map', {
        zoomControl: true,
        scrollWheelZoom: false,
        attributionControl: false
      }).setView([target.lat, target.lng], 6);

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        className: 'sjc-bw-tiles'
      }).addTo(_migracaoLeafletMap);

      _migracaoLayerGroup = L.layerGroup().addTo(_migracaoLeafletMap);
    } else {
      _migracaoLayerGroup.clearLayers();
    }

    // Atualiza dimensões do mapa e ajusta visualização suavemente para enquadrar as rotas
    try {
      _migracaoLeafletMap.invalidateSize({ pan: false });
    } catch (e) {}

    const mapSize = _migracaoLeafletMap.getSize();
    if (step.bounds && mapSize.x > 0 && mapSize.y > 0) {
      try {
        _migracaoLeafletMap.fitBounds(step.bounds, {
          padding: [35, 35],
          maxZoom: 8,
          animate: true,
          duration: 0.8
        });
      } catch (err) {
        try {
          _migracaoLeafletMap.fitBounds(step.bounds, { padding: [15, 15] });
        } catch (e2) {}
      }
    }

    // 1. Marcador Alvo: Epicentro São José dos Campos
    const sjcIcon = L.divIcon({
      className: 'migracao-sjc-pin',
      html: `
        <div class="relative flex items-center justify-center">
          <div class="absolute w-12 h-12 rounded-full border border-[#a45b16]/40 animate-ping"></div>
          <div class="absolute w-7 h-7 rounded-full bg-[#a45b16]/20"></div>
          <div class="relative w-4 h-4 rounded-full bg-[#a45b16] border-2 border-white shadow-lg flex items-center justify-center">
            <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
          </div>
          <div class="absolute -top-7 whitespace-nowrap bg-slate-900 text-white px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md border border-slate-700">
            São José dos Campos
          </div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    L.marker([target.lat, target.lng], { icon: sjcIcon, zIndexOffset: 2000 }).addTo(_migracaoLayerGroup);

    // 2. Traçar Arcos Geodésicos Suaves com Brilho e Partículas de Fluxo
    (step.fluxos || []).forEach(originId => {
      const origin = MIGRACAO_GEO_NODES[originId];
      if (!origin) return;

      const numPoints = 80;
      const arcPoints = [];
      
      const midLat = (origin.lat + target.lat) / 2;
      const midLng = (origin.lng + target.lng) / 2;
      const dist = Math.sqrt(Math.pow(target.lat - origin.lat, 2) + Math.pow(target.lng - origin.lng, 2));
      
      const curveFactor = Math.min(dist * 0.16, 3.2);
      const angle = Math.atan2(target.lng - origin.lng, target.lat - origin.lat) + (Math.PI / 2);
      const controlLat = midLat + Math.sin(angle) * curveFactor;
      const controlLng = midLng + Math.cos(angle) * curveFactor;

      for (let i = 0; i <= numPoints; i++) {
        const t = i / numPoints;
        const pLat = Math.pow(1 - t, 2) * origin.lat + 2 * (1 - t) * t * controlLat + Math.pow(t, 2) * target.lat;
        const pLng = Math.pow(1 - t, 2) * origin.lng + 2 * (1 - t) * t * controlLng + Math.pow(t, 2) * target.lng;
        arcPoints.push([pLat, pLng]);
      }

      L.polyline(arcPoints, {
        color: step.color,
        weight: 2,
        opacity: 0.25,
        smoothFactor: 1
      }).addTo(_migracaoLayerGroup);

      L.polyline(arcPoints, {
        color: step.color,
        weight: 3.5,
        opacity: 0.85,
        dashArray: '10, 16',
        className: 'migracao-flow-dash'
      }).addTo(_migracaoLayerGroup);

      const originIcon = L.divIcon({
        className: 'migracao-origin-pin',
        html: `
          <div class="relative flex items-center justify-center">
            <div class="w-3.5 h-3.5 rounded-full bg-white border-2 border-slate-700 shadow-md" style="box-shadow: 0 0 10px ${step.color};"></div>
            <div class="absolute -top-7 whitespace-nowrap bg-white/95 text-slate-800 border border-slate-200/90 px-2 py-0.5 rounded-lg text-[9px] font-bold shadow-xs flex items-center gap-1 backdrop-blur-xs">
              <span class="w-1.5 h-1.5 rounded-full" style="background-color: ${step.color}"></span>
              ${escapeHtml(origin.label)}
            </div>
          </div>
        `,
        iconSize: [18, 18],
        iconAnchor: [9, 9]
      });

      L.marker([origin.lat, origin.lng], { icon: originIcon, zIndexOffset: 1000 }).addTo(_migracaoLayerGroup);
    });
  }

  function formatMigracaoFonteAbnt(f) {
    const url = escapeHtml(safeUrl(f.url));
    const autor = escapeHtml(f.autores || '');
    const titulo = escapeHtml(f.titulo || '');
    const subtitulo = f.subtitulo ? `: ${escapeHtml(f.subtitulo)}` : '';
    const veiculo = f.veiculo ? ` <em>${escapeHtml(f.veiculo)}</em>.` : '';
    const local = f.local ? ` ${escapeHtml(f.local)},` : '';
    const volume = f.volume ? ` ${escapeHtml(f.volume)},` : '';
    const ano = f.ano ? ` ${escapeHtml(f.ano)}.` : '';
    const pagina = f.pagina ? `<span class="inline-flex items-center gap-1 font-bold text-amber-900 bg-amber-100/90 px-1.5 py-0.5 rounded text-[10px] ml-1"><i class="fa-regular fa-file-lines text-[9px]"></i>${escapeHtml(f.pagina)}</span>` : '';

    return `
      <div class="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5 hover:bg-slate-100/70 transition-colors">
        <p class="text-[11px] leading-relaxed text-slate-800">
          <strong>${autor}</strong>. ${titulo}${subtitulo}.${veiculo}${local}${volume}${ano} ${pagina}
        </p>
        <div class="pt-0.5">
          <a href="${url}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#a45b16] hover:text-[#83450e] hover:underline underline-offset-2 break-all">
            <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
            <span>Acessar documento original</span>
          </a>
        </div>
      </div>
    `;
  }

  function renderMigracaoJoseenses() {
    const container = document.getElementById("migracao-joseenses-container");
    if (!container) return;

    // Se o mapa já existir no DOM, só atualiza o passo sem recriar
    if (document.getElementById('migracao-leaflet-map') && _migracaoLeafletMap) {
      window.switchMigracaoStep(window.activeMigracaoStep || 0, false);
      return;
    }

    // Injeta estilos da barra sticky e estado compacto se não existirem
    if (!document.getElementById('migracao-nav-sticky-styles')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'migracao-nav-sticky-styles';
      styleEl.textContent = `
        #migracao-nav-sticky-container {
          position: sticky;
          top: var(--app-header-height, 72px);
          z-index: 35;
          background-color: var(--surface-bg, #f8fafc);
          transition: padding 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
        }
        @supports (backdrop-filter: blur(8px)) {
          #migracao-nav-sticky-container {
            background-color: rgba(248, 250, 252, 0.94);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
          }
          html.dark #migracao-nav-sticky-container {
            background-color: rgba(15, 23, 42, 0.94);
          }
        }
        #migracao-nav-sticky-container.is-stuck {
          border-bottom: 1px solid rgba(226, 232, 240, 0.9);
          box-shadow: 0 4px 14px -3px rgba(15, 23, 42, 0.05);
          padding-top: 0.35rem;
          padding-bottom: 0.5rem;
        }
        html.dark #migracao-nav-sticky-container.is-stuck {
          border-bottom-color: rgba(51, 65, 85, 0.8);
          box-shadow: 0 4px 14px -3px rgba(0, 0, 0, 0.3);
        }
        #migracao-nav-sticky-container.is-stuck #migracao-nav-header-row {
          display: none;
        }
        #migracao-nav-sticky-container.is-stuck .migracao-tab-full {
          display: none;
        }
        #migracao-nav-sticky-container.is-stuck .migracao-tab-compact {
          display: flex;
        }
        #migracao-nav-sticky-container.is-stuck .migracao-tab-btn {
          padding: 0.5rem 0.65rem;
          border-radius: 0.875rem;
        }
      `;
      document.head.appendChild(styleEl);
    }

    const currentStepIdx = window.activeMigracaoStep || 0;
    const step = MIGRACAO_STEPS[currentStepIdx];

    // Construção das Abas do Stepper Cronológico
    let tabsHtml = '';
    MIGRACAO_STEPS.forEach((s, idx) => {
      const isCurrent = idx === currentStepIdx;
      const borderClass = isCurrent ? 'border-2 ring-2 ring-amber-500/20' : 'border border-slate-200/80 hover:border-slate-300';
      const bgClass = isCurrent ? 'bg-white shadow-sm' : 'bg-slate-50/70 hover:bg-white opacity-80 hover:opacity-100';

      tabsHtml += `
        <button 
          type="button" 
          role="tab"
          id="migracao-tab-${idx}"
          data-index="${idx}"
          aria-selected="${isCurrent ? 'true' : 'false'}"
          aria-controls="migracao-narrative-panel"
          tabindex="${isCurrent ? '0' : '-1'}"
          onclick="window.switchMigracaoStep(${idx}, true)"
          onkeydown="window.handleMigracaoTabKeydown(event, ${idx})"
          class="migracao-tab-btn group relative p-3 sm:p-4 rounded-2xl text-left transition-all cursor-pointer flex-1 min-w-[140px] sm:min-w-0 ${isCurrent ? 'is-active' : ''} ${bgClass} ${borderClass}"
          style="${isCurrent ? `border-color: ${s.color};` : ''}"
        >
          <!-- Layout Completo (Normal) -->
          <div class="migracao-tab-full flex flex-col justify-between h-full">
            <div class="flex items-center justify-between gap-1.5 mb-1.5">
              <span class="migracao-tab-badge inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-colors" style="${isCurrent ? `background-color: ${s.color}; color: #ffffff;` : 'background-color: #e2e8f0; color: #475569;'}">
                Período 0${idx + 1}
              </span>
              <span class="migracao-tab-year text-[10px] font-mono text-slate-500 font-bold">
                ${escapeHtml(s.ano)}
              </span>
            </div>
            <h4 class="migracao-tab-title text-xs sm:text-sm ${isCurrent ? 'font-black text-slate-900' : 'font-bold text-slate-700'} leading-snug">
              ${escapeHtml(s.titulo)}
            </h4>
          </div>

          <!-- Layout Compacto (Sticky durante rolagem) -->
          <div class="migracao-tab-compact hidden items-center justify-center gap-1.5 py-0.5 text-center">
            <span class="migracao-compact-num font-mono font-black text-xs px-1.5 py-0.5 rounded-md ${isCurrent ? 'text-white' : 'text-slate-600 bg-slate-200'}" style="${isCurrent ? `background-color: ${s.color};` : ''}">0${idx + 1}</span>
            <span class="migracao-compact-name font-bold text-xs truncate ${isCurrent ? 'text-slate-900 font-black' : 'text-slate-700'}">${escapeHtml(s.shortTitle || s.titulo.replace(/^A\s+/, ''))}</span>
          </div>

          <div class="migracao-tab-indicator absolute bottom-0 left-4 right-4 h-0.5 rounded-full transition-all ${isCurrent ? 'opacity-100' : 'opacity-0'}" style="background-color: ${s.color}"></div>
        </button>
      `;
    });

    container.innerHTML = `
      <div id="migracao-timeline-wrapper" class="space-y-5 sm:space-y-6 animate-in fade-in duration-500 relative">
        <!-- Sentinel de rolagem para alternância de estado Normal / Compacto -->
        <div id="migracao-sticky-sentinel" class="w-full h-px pointer-events-none -mt-2"></div>

        <!-- Barra Única de Navegação Contextual Sticky Inteligente -->
        <nav 
          id="migracao-nav-sticky-container" 
          class="sticky top-[var(--app-header-height,72px)] z-30 pt-1 pb-2.5 px-2 -mx-2 transition-all duration-200"
          aria-label="Períodos Migratórios de São José dos Campos"
        >
          <!-- Cabeçalho descritivo (visível no estado normal, recolhido no estado compacto durante a rolagem) -->
          <div id="migracao-nav-header-row" class="flex items-center justify-between px-1 mb-2.5 transition-all duration-200">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-[#a45b16]"></span>
              <span class="text-xs font-black uppercase tracking-wider text-slate-700">Períodos Migratórios</span>
            </div>
            <span class="text-[11px] font-medium text-slate-400 hidden sm:inline">
              Selecione um período para explorar a narrativa e a cartografia
            </span>
          </div>

          <!-- Abas dos 4 Períodos com Suporte a Estado Normal e Compacto -->
          <div 
            id="migracao-stepper-tabs" 
            role="tablist" 
            aria-label="Seleção de períodos históricos" 
            class="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5 overflow-x-auto no-scrollbar scroll-smooth"
          >
            ${tabsHtml}
          </div>
        </nav>

        <!-- 2. Grid de Conteúdo: Narrativa Editorial (Col 7) + Mapa Georreferenciado (Col 5) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          <!-- Narrativa Histórica Editorial (Esquerda) -->
          <div class="lg:col-span-7">
            <article 
              id="migracao-narrative-panel" 
              role="tabpanel" 
              tabindex="-1" 
              aria-labelledby="migracao-tab-${currentStepIdx}" 
              class="bg-white rounded-3xl border border-slate-200 p-5 sm:p-8 shadow-xs focus:outline-none"
            >
              <div id="migracao-narrative-content">
                <!-- Preenchido via renderMigracaoNarrativeContent -->
              </div>
            </article>
          </div>

          <!-- Mapa Georreferenciado Sticky (Direita) -->
          <div id="migracao-map-col" class="lg:col-span-5 sticky top-[calc(var(--app-header-height,72px)+var(--migracao-sticky-height,68px)+16px)]">
            <div class="mb-3 flex items-center justify-between gap-2">
              <h4 class="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <i class="fa-solid fa-map-location-dot text-[#a45b16]"></i> Mapa de Fluxos
              </h4>
              <span id="migracao-map-phase-badge" class="text-[10px] text-slate-700 font-bold uppercase tracking-wider bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200 flex items-center gap-1.5 shrink-0">
                <span class="w-2 h-2 rounded-full animate-pulse" style="background-color: ${step.color}"></span>
                ${escapeHtml(step.titulo)}
              </span>
            </div>

            <!-- Container do Mapa Real Leaflet com Estilo Preto & Branco Executivo -->
            <div class="relative w-full h-[500px] bg-slate-100 rounded-3xl border border-slate-200 overflow-hidden shadow-inner sjc-bw-map">
              <style>
                .migracao-flow-dash {
                  animation: migracaoFlowDash 8s linear infinite;
                }
                @keyframes migracaoFlowDash {
                  from { stroke-dashoffset: 260; }
                  to { stroke-dashoffset: 0; }
                }
              </style>
              <div id="migracao-leaflet-map" class="w-full h-full"></div>

              <!-- Card Flutuante de Contexto da Rota -->
              <div id="migracao-route-overlay-card" class="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/90 shadow-lg z-[1000] flex items-center justify-between gap-3 pointer-events-auto">
                <div class="space-y-0.5 min-w-0">
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="w-2.5 h-2.5 rounded-full shrink-0" style="background-color: ${step.color}"></span>
                    <span class="text-[11px] font-black uppercase tracking-wider text-slate-800">${escapeHtml(step.titulo)}</span>
                    <span class="text-[11px] text-slate-500 font-mono">• ${escapeHtml(step.ano)}</span>
                  </div>
                  <p class="text-[11px] text-slate-600 truncate font-medium">Principais vetores: ${step.fluxos.map(f => MIGRACAO_GEO_NODES[f]?.label).filter(Boolean).join(', ')}.</p>
                </div>
                <div class="shrink-0 text-right">
                  <span class="text-[10px] font-bold text-[#a45b16] bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/80 inline-flex items-center gap-1">
                    <i class="fa-solid fa-location-dot text-[9px]"></i> Destino: São José dos Campos
                  </span>
                </div>
              </div>
            </div>

            <p class="text-center text-[10px] text-slate-500 mt-2.5 font-medium px-2">
              * Cartografia georreferenciada centrada em São José dos Campos. As trajetórias representam a direção e origem comprovada dos fluxos migratórios.
            </p>
          </div>

        </div>
      </div>
    `;

    // Renderiza a narrativa do período migratório ativo
    renderMigracaoNarrativeContent(currentStepIdx);

    // Atualiza o Leaflet após a injeção do container no DOM
    requestAnimationFrame(function() {
      const stickyNav = document.getElementById('migracao-nav-sticky-container');
      if (stickyNav) {
        const h = stickyNav.getBoundingClientRect().height;
        document.documentElement.style.setProperty('--migracao-sticky-height', h + 'px');
      }
      checkMigracaoStickyState();
      updateMigracaoLeafletMap();
      if (_migracaoLeafletMap) {
        setTimeout(function() {
          _migracaoLeafletMap.invalidateSize();
        }, 150);
      }
    });
  }

  const LENDAS_CATALOGO = [
    {
        "id": "maria-peregrina",
        "titulo": "Maria Peregrina: da vida nas ruas à devoção em Santana",
        "categoria": "Devoção popular",
        "badgeColor": "bg-amber-400 text-slate-950",
        "imagem": "web-media/lenda_maria_peregrina-428a2d368dc5.webp",
        "lead": "Ela caminhava pela Zona Norte carregando seus pertences. Depois de sua morte, moradores passaram a visitar o túmulo e a pedir sua intercessão.",
        "local": "Santana e bairros vizinhos",
        "epoca": "Século XX; falecimento em 1964",
        "relatoCompleto": [
            "Quem morava no bairro de <strong>Santana</strong> ou nas redondezas da antiga Vila Cristina entre os anos 1940 e o início da década de 1960 se acostumou a cruzar com a mesma figura quase todos os dias. Uma mulher franzina, de passos curtos e compassados, que percorria as ruas de terra e os caminhos de beira de cerca carregando uma trouxa enorme sobre a cabeça. O embrulho, amarrado com retalhos e pedaços de arame, continha tudo o que ela possuía no mundo: roupas velhas, pedaços de lata, garrafas vazias e pequenos objetos que ela recolhia pelo chão da cidade.",
            "No bairro, a maioria das pessoas a chamava de <em>Nhá Maria</em>. O apelido de <em>Peregrina</em> veio com o tempo, justamente pelo hábito de nunca parar em lugar nenhum. Ninguém conhecia ao certo a sua origem, de onde tinha chegado ou se ainda tinha parentes vivos no Vale do Paraíba ou em Minas Gerais. Quando alguém tentava puxar conversa para saber sobre sua família ou sobre o seu passado, Maria desconversava com calma, dava um sorriso curto e seguia adiante, ajeitando a trouxa no cocuruto da cabeça para não perder o equilíbrio.",
            "O dia a dia de Maria seguia uma rotina própria. Pela manhã, passava na porta das vendas e das casas pedindo um bocado de comida ou um gole de café com leite. Aceitava o que lhe davam sem reclamar e sem pedir dinheiro. Quando o sol apertava ao meio-dia, sentava-se à sombra de alguma mangueira na beira do caminho para descansar as pernas e mexer nas latas que guardava na trouxa. À noite, procurava o abrigo de uma marquise de armazém, o alpendre de uma olaria desativada ou mesmo o vão de um barranco seco para dormir enrolada em sacos de estopa.",
            "Essa presença constante no bairro gerava reações diversas entre os moradores. Em entrevistas de história oral preservadas no acervo do <strong>Núcleo Pró-Memória</strong> e analisadas em estudos da <strong>Universidade do Vale do Paraíba (Univap)</strong>, antigos vizinhos relataram que nem todos a tratavam com paciência. Crianças e rapazes da rua costumavam rir de suas roupas e chegaram a jogar pedras em sua direção. O detalhe que marcou quem presenciou esses episódios foi a postura de Maria: ela não gritava, não xingava e não atirava pedras de volta. Apenas continuava andando no mesmo passo, esperando a provocação passar.",
            {
                "tipo": "quote",
                "texto": "As crianças jogavam pedras nela e ela não falava nada, continuava andando... ela carregava um saco de estopa na cabeça com as coisas dela, roupas velhas e latinhas.",
                "fonte": "Depoimento oral de morador de Santana registrado na pesquisa da Univap (2018, acervo Pró-Memória da Câmara Municipal)"
            },
            "A andarilha adoeceu e faleceu em <strong>1964</strong>. Como não portava documentos oficiais e nenhum familiar apareceu para reclamar o corpo, foi sepultada como indigente em uma cova rasa e sem identificação no cemitério do bairro de Santana. O caso parecia encerrado ali, como o de tantos outros anônimos que passavam pelas ruas da cidade na época. No entanto, o costume popular de rezar pelas almas esquecidas mudou o destino daquela sepultura.",
            "A primeira graça atribuída a Maria tem nome e data na memória local. Conforme documentaram os pesquisadores <strong>Robson Alves dos Santos</strong>, <strong>Jorge Luis da Hora de Jesus</strong> e <strong>Luís Fernando Ferreira de Araújo</strong> em artigo apresentado no congresso <strong>ComCult de 2023</strong>, uma moradora chamada <em>Benedita Maria das Dores</em> passava por grandes aflições por causa do alcoolismo do filho. Sabendo do túmulo humilde daquela mulher que tanto caminhara por Santana, Benedita foi até lá, acendeu uma vela sobre a terra e prometeu que cuidaria da sepultura caso o rapaz abandonasse a bebida. Pouco tempo depois, o filho parou de beber.",
            "A notícia da promessa de Benedita correu rápido pelas conversas de portão em Santana. Outros moradores passaram a ir até o cemitério para pedir ajuda em momentos de doença, desemprego e dificuldades em família. Com o passar dos anos, o túmulo de chão batido recebeu uma lápide de alvenaria e passou a acumular velas, flores de plástico, terços e cartas com pedidos de intercessão. A devoção cresceu tanto que a Prefeitura acabou oficializando o nome do local como <strong>Cemitério Maria Peregrina</strong>, fato destacado inclusive pela <strong>TV Vanguarda</strong> em reportagem especial sobre as seis décadas de sua morte. Uma história que começou com uma mulher solitária caminhando pelas margens da cidade e que acabou gravada na geografia e na memória coletiva de São José dos Campos."
        ],
        "analiseHistorica": "Maria Peregrina foi uma mulher real que viveu e morreu em situação de rua em São José dos Campos. Sua conversão em santa popular ilustra o fenômeno da folkcomunicação religiosa no Vale do Paraíba, no qual o sofrimento terreno e a marginalidade são ressignificados pela comunidade como marcas de santidade e proximidade com o sagrado.",
        "fontes": [
            {
                "titulo": "A resistência popular por meio da folkcomunicação: a devoção a uma perna e a Maria Peregrina na zona norte no bairro de Santana de São José dos Campos, SP",
                "autor": "Cristiane Aparecida Braga Alvim; Denise Aparecida Massa Giacomin; Franciele Busico Lima; Robson Alves dos Santos",
                "ano": "2018",
                "tipo": "Pesquisa acadêmica",
                "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2024/02/0600_0701_01.pdf#page=2",
                "nota": "Inclui entrevistas com pessoas que conheceram Maria e registros das devoções. Disponível no Pró-Memória de São José dos Campos, acervo da parceria entre Câmara Municipal, FCCR e Univap/FVE.",
                "localizador": "p. 2-4; páginas 2-4 do PDF.",
                "referencia": "ALVIM, Cristiane Aparecida Braga et al. A resistência popular por meio da folkcomunicação: a devoção a uma perna e a Maria Peregrina na zona norte no bairro de Santana de São José dos Campos, SP. In: ENCONTRO LATINO AMERICANO DE INICIAÇÃO CIENTÍFICA, 22., 2018, São José dos Campos. Anais [...]. São José dos Campos: Univap, 2018."
            },
            {
                "titulo": "Santa Perna e Maria Peregrina: aspectos folkcomunicacionais da religiosidade popular em São José dos Campos",
                "autor": "Robson Alves dos Santos; Jorge Luis da Hora de Jesus; Luís Fernando Ferreira de Araújo",
                "ano": "2023",
                "tipo": "Pesquisa acadêmica",
                "url": "https://www.comcult.cisc.org.br/wp-content/uploads/anais-comcult8/santa_perna_e_maria_peregrina_aspec.pdf#page=9",
                "nota": "Reúne relatos sobre a devoção a Maria Peregrina, incluindo a promessa atribuída a Benedita Maria das Dores.",
                "localizador": "Folhas 9-11 do PDF, sem numeração impressa.",
                "referencia": "SANTOS, Robson Alves dos; JESUS, Jorge Luis da Hora de; ARAÚJO, Luís Fernando Ferreira de. Santa Perna e Maria Peregrina: aspectos folkcomunicacionais da religiosidade popular em São José dos Campos. In: CONGRESSO INTERNACIONAL DE COMUNICAÇÃO E CULTURA, 8., 2023, São Paulo. Anais [...]. São Paulo: ComCult, 2023."
            },
            {
                "titulo": "60 anos da morte da santa popular Maria Peregrina",
                "autor": "TV Vanguarda. Link Vanguarda",
                "ano": "[s.d.]",
                "tipo": "Reportagem em vídeo",
                "url": "https://globoplay.globo.com/v/13037621/",
                "nota": "Reportagem de quatro minutos sobre a santa popular.",
                "localizador": "Sem paginação.",
                "referencia": "TV VANGUARDA. 60 anos da morte da santa popular Maria Peregrina. Link Vanguarda. [S. l.]: TV Vanguarda, [s.d.]. 1 vídeo (4 min). Disponibilizado no Globoplay."
            }
        ]
    },
    {
        "id": "perna-santana",
        "titulo": "Santa Perna: a promessa que ergueu o altar no Jaguari",
        "categoria": "Devoção popular",
        "badgeColor": "bg-rose-500 text-white",
        "imagem": "web-media/lenda_perna_santana-bb23b0094f39.webp",
        "lead": "Um pescador encontrou uma perna em sua rede. A história da cura de sua mulher se espalhou e deu origem a uma devoção no Jaguari.",
        "local": "Capela de Santa Perna, Jaguari",
        "epoca": "Tradição de origem não datada",
        "relatoCompleto": [
            "A vida nas margens do Rio Paraíba do Sul sempre foi regida pelos caprichos das águas e pelo ritmo paciente de quem dependia da pesca para garantir o sustento da panela. Em uma manhã cinzenta de neblina baixa, na primeira metade do século passado, um pescador do bairro rural do <strong>Jaguari</strong> entrou na sua canoa de madeira e lançou o lance de rede habitual nas curvas mais profundas do rio. Ao puxar a malha contra a força da correnteza, sentiu um peso desmedido enroscado no fundo, como se houvesse fisgado um tronco de árvore.",
            "Quando a rede alcançou a borda da canoa, o pescador deparou-se com uma visão desconcertante: entre o limo verde e os mandis espantados, havia o contorno nítido de uma perna humana decepada, feita de madeira rústica e desgastada pelas pedras do fundo do leito. Em vez de atirar a peça de volta às águas por temor ou superstição, o caboclo recolheu o objeto com cuidado, limpou a lama com as próprias mãos e levou o achado para sua casa de sapê, pressentindo que aquilo não havia chegado às suas mãos por acaso.",
            "Naquela mesma época, sua mulher enfrentava um sofrimento contínuo. Ela padecia de feridas crônicas e chagas abertas em uma das pernas, padecimento que nenhum ungüento de farmácia nem as rezas das benzedeiras mais antigas da várzea conseguiam cicatrizar. Diante da misteriosa perna de madeira, o casal ajoelhou-se no chão de terra batida, acendeu uma lamparina de azeite e fez uma promessa cheia de fé: se aquela perna trazida pelo rio operasse a cura das feridas, eles cuidariam dela como relíquia sagrada.",
            "Segundo os causos preservados pela tradição oral do bairro e recolhidos em pesquisas do folclore regional, as dores da mulher começaram a ceder de forma repentina poucos dias depois, até que a pele se fechou por completo. A notícia do prodígio correu rápido pelas colônias agrícolas e olarias da região norte de São José dos Campos. Outros moradores que sofriam de varizes, reumatismos severos e acidentes com enxadas e foices passaram a bater na porteira do pescador para rezar em frente à relíquia e pedir o mesmo alívio.",
            {
                "tipo": "quote",
                "texto": "O pescador puxou a rede no Paraíba e veio a perna. A mulher dele sarou da ferida e depois o povo foi juntando até levantar a capela com os agradecimentos.",
                "fonte": "Depoimento oral do devoto Hipólito da Costa Andrade, registrado por Cáscia Frade e citado nos anais do ComCult (2023)"
            },
            "O fluxo constante de peregrinos vindos a pé pelas estradas de terra motivou os vizinhos a construir um abrigo definitivo para a peça. Com o esforço coletivo dos moradores, foi erguida uma capela simples no bairro do <strong>Jaguari</strong>, dedicada carinhosamente àquilo que o povo batizou de <em>Santa Perna</em>. Como registraram os pesquisadores <strong>Robson Alves dos Santos</strong>, <strong>Cristiane Aparecida Braga Alvim</strong> e colegas em levantamentos da <strong>Univap (2018)</strong> e no congresso <strong>ComCult (2023)</strong>, a peça original de madeira acabou se perdendo com o tempo, sendo substituída por uma escultura moldada em cera que repousa sobre o altar.",
            "Quem visita o templo rural encontra uma das manifestações de religiosidade mais autênticas do Vale do Paraíba. O espaço ao redor do altar é repleto de ex-votos: sapatos velhos, meias, fotografias em preto e branco, bengalas aposentadas e centenas de cartas manuscritas relatando cirurgias que deram certo e fraturas que soldaram. Conforme documentado pelo <strong>Museu do Folclore de São José dos Campos</strong> na série <em>Folclore em Movimento</em>, a capela do Jaguari permanece como testemunho vivo de como a comunidade soube criar seu próprio refúgio de cura e conforto espiritual nas margens do Paraíba."
        ],
        "fontes": [
            {
                "titulo": "Santa Perna e Maria Peregrina: aspectos folkcomunicacionais da religiosidade popular em São José dos Campos",
                "autor": "Robson Alves dos Santos; Jorge Luis da Hora de Jesus; Luís Fernando Ferreira de Araújo",
                "ano": "2023",
                "tipo": "Pesquisa acadêmica",
                "url": "https://www.comcult.cisc.org.br/wp-content/uploads/anais-comcult8/santa_perna_e_maria_peregrina_aspec.pdf#page=7",
                "nota": "Traz relato atribuído ao devoto Hipólito da Costa Andrade e fotografias da capela e dos objetos de devoção.",
                "localizador": "Folhas 7-11 do PDF, sem numeração impressa.",
                "referencia": "SANTOS, Robson Alves dos; JESUS, Jorge Luis da Hora de; ARAÚJO, Luís Fernando Ferreira de. Santa Perna e Maria Peregrina: aspectos folkcomunicacionais da religiosidade popular em São José dos Campos. In: CONGRESSO INTERNACIONAL DE COMUNICAÇÃO E CULTURA, 8., 2023, São Paulo. Anais [...]. São Paulo: ComCult, 2023."
            },
            {
                "titulo": "A resistência popular por meio da folkcomunicação: a devoção a uma perna e a Maria Peregrina na zona norte no bairro de Santana de São José dos Campos, SP",
                "autor": "Cristiane Aparecida Braga Alvim; Denise Aparecida Massa Giacomin; Franciele Busico Lima; Robson Alves dos Santos",
                "ano": "2018",
                "tipo": "Pesquisa acadêmica",
                "url": "https://www.camarasjc.sp.gov.br/promemoria/wp-content/uploads/2024/02/0600_0701_01.pdf#page=2",
                "nota": "Inclui entrevistas com pessoas que conheceram Maria e registros das devoções. Disponível no Pró-Memória de São José dos Campos, acervo da parceria entre Câmara Municipal, FCCR e Univap/FVE.",
                "localizador": "p. 2-4; páginas 2-4 do PDF.",
                "referencia": "ALVIM, Cristiane Aparecida Braga et al. A resistência popular por meio da folkcomunicação: a devoção a uma perna e a Maria Peregrina na zona norte no bairro de Santana de São José dos Campos, SP. In: ENCONTRO LATINO AMERICANO DE INICIAÇÃO CIENTÍFICA, 22., 2018, São José dos Campos. Anais [...]. São José dos Campos: Univap, 2018."
            },
            {
                "titulo": "Santa Perna: série Folclore em Movimento",
                "autor": "Museu do Folclore de São José dos Campos",
                "ano": "[s.d.]",
                "tipo": "Vídeo no YouTube",
                "url": "https://www.youtube.com/watch?v=QY4z9OA9nqA",
                "nota": "Vídeo do canal do Museu do Folclore, citado na bibliografia do estudo de 2023.",
                "localizador": "Vídeo completo.",
                "referencia": "MUSEU DO FOLCLORE DE SÃO JOSÉ DOS CAMPOS. Santa Perna: série Folclore em Movimento. São José dos Campos: Museu do Folclore, [s.d.]. 1 vídeo. Publicado no YouTube."
            }
        ]
    },
    {
        "id": "lobisomem-banhado",
        "titulo": "O lobisomem no quintal do Banhado",
        "categoria": "Causo de família",
        "badgeColor": "bg-indigo-600 text-white",
        "imagem": "web-media/lenda_lobisomem_banhado-11e891c0c2bb.webp",
        "lead": "Os cachorros latiam para o pé de ameixa. Na história contada pela avó de Diego Del Passo, havia alguma coisa rondando o quintal.",
        "local": "Região do Banhado",
        "epoca": "Relato familiar situado em 1972",
        "relatoCompleto": [
            "No início dos anos 1970, a baixada do <strong>Banhado</strong> era um mundo à parte do restante de São José dos Campos. Enquanto as avenidas centrais começavam a receber postes modernos e tráfego de automóveis, a encosta da várzea mantinha uma rotina quase exclusivamente rural. As famílias cultivavam roças de mandioca, cuidavam de hortas de couve, mantinham galinheiros nos fundos dos quintais e dependiam da luz fraca de lamparinas para clarear os cômodos de suas casas de madeira.",
            "Foi nesse cenário, em uma noite especialmente fria do ano de <strong>1972</strong>, que um acontecimento tirou o sono da família do historiador e professor <strong>Diego Del Passo</strong>. Na casa onde seu pai passava a infância, o silêncio da madrugada foi subitamente rasgado por um coro violento de latidos. A cachorrada da casa, que costumava dormir tranquila sob o assoalho, corria de um lado para o outro no terreiro com os dentes arreganhados, rosnando na direção da copa densa de um velho pé de ameixa.",
            "Um dos meninos da casa levantou da cama descalço e correu até a cozinha, querendo espiar pelas frestas da janela para descobrir se era ladrão roubando galinha ou cachorro do vizinho brigando. Antes de alcançar o caixilho, a mão firme de sua avó puxou-o de volta pelo braço. A mulher, criada na tradição das rezas sertanejas, reconheceu de imediato a natureza daquele alvoroço e murmurou que aquilo não era gente comum: tratava-se do <em>lobisomem</em>, a criatura que ela afirmava rondar as beiradas da serra nas noites de lua cheia.",
            "Sem titubear, o avô pegou a espingarda carregada de chumbo grosso que ficava atrás da porta da sala e destrancou o ferrolho com cautela. A avó seguiu logo atrás, segurando um lampião de querosene fumegante com uma mão e desfiando as contas de um terço com a outra. Ao clarearem o terreiro de terra batida, o facho amarelado de luz revelou uma silhueta corpulenta, escura e encurvada junto ao tronco da árvore. A criatura respirava pesado, agitando os galhos baixos com um ruído seco de folha quebrada.",
            {
                "tipo": "quote",
                "texto": "Minha avó puxou meu pai pela camisa e garantiu que aquilo não era bicho do mato nem ladrão. Ela conhecia o barulho e sabia que o lobisomem andava rondando a várzea.",
                "fonte": "Crônica de memórias familiares de Diego Del Passo publicada no blog Nas Trilhas do Vale (2024)"
            },
            "A avó ergueu a voz em oração, fazendo o sinal da cruz no ar com o crucifixo de metal. Diante da ladainha e do clarão da lamparina, a figura escura soltou um resfolego abafado, saltou a cerca de arame farpado com agilidade surpreendente e sumiu mata adentro na escuridão da baixada, deixando para trás apenas os ganidos assustados dos cachorros e pegadas fundas na terra molhada.",
            "Nas manhãs seguintes, o causo virou o assunto principal entre as comadres e os trabalhadores da encosta. As suspeitas do bairro logo recaíram sobre um morador que trabalhava no porto de areia do rio. Corria a conversa de que o homem era o sétimo filho homem de uma família sem os devidos sacramentos e que, em certas manhãs de sábado, aparecia nas vendas com arranhões recentes nas mãos e os olhos fundos de quem passou a noite sem pregar o olho. Um relato que <strong>Diego Del Passo</strong> registrou em sua crônica no projeto <em>Nas Trilhas do Vale</em>, mostrando como a geografia acidentada do Banhado foi terreno fértil para os mitos noturnos da cidade."
        ],
        "analiseHistorica": "O causo do lobisomem do Banhado preserva a oralidade dos antigos moradores que ocupavam a várzea antes da intensificação da urbanização. A crença no sétimo filho varão e o medo de criaturas noturnas misturam elementos do folclore ibérico tradicional com a vida de subsistência nas beiras de rios paulistas.",
        "fontes": [
            {
                "titulo": "Lenda urbana: o lobisomem de S. José dos Campos",
                "autor": "Diego Del Passo",
                "ano": "26 jul. 2024",
                "tipo": "Registro de lenda",
                "url": "https://professordiegodelpasso.blog/2024/07/26/o-lobisomem-do-banhado/",
                "nota": "O autor identifica a avó como narradora do causo e situa a lembrança de seu pai no Banhado.",
                "localizador": "Sem paginação.",
                "referencia": "DEL PASSO, Diego. Lenda urbana: o lobisomem de S. José dos Campos. Nas Trilhas do Vale, 26 jul. 2024."
            }
        ]
    },
    {
        "id": "minotauro-casablanca",
        "titulo": "O pé de bode na pista do Casablanca",
        "categoria": "Lenda urbana",
        "badgeColor": "bg-purple-600 text-white",
        "imagem": "web-media/lenda_minotauro_casablanca-ce46c0e5d8e2.webp",
        "lead": "O rapaz dançava como qualquer outro frequentador. O susto veio quando sua parceira olhou para os pés dele.",
        "local": "Antigas casas noturnas Casablanca e Barcelona",
        "epoca": "Anos 1990, segundo as versões publicadas",
        "relatoCompleto": [
            "A noite de São José dos Campos nos anos 1990 fervilhava ao ritmo das grandes casas noturnas. Entre os pontos de encontro mais disputados da juventude estavam o <strong>Casablanca</strong> e a boate <strong>Barcelona</strong>, templos da diversão noturna onde centenas de rapazes e moças se espremiam todo fim de semana sob globos espelhados, canhões de luz colorida e cortinas de fumaça de gelo seco.",
            "Em uma dessas noites de casa cheia, chamou a atenção dos frequentadores a presença de um forasteiro impecavelmente vestido. O rapaz, alto, de cabelos escuros e sorriso galanteador, usava uma camisa social alinhada e calça de alfaiataria bem passada, cujo corte cobria com elegância a parte superior dos sapatos. Ele transitava pelo mezanino com desenvoltura e logo desceu para a pista, tirando para dançar algumas das jovens mais cortejadas do salão.",
            "O rapaz dominava os passos com habilidade impressionante, girando no compasso das músicas sem demonstrar qualquer cansaço. No meio de uma virada mais rápida, contudo, ele pisou sem querer no pé de sua companheira de dança. A moça soltou um gemido de dor, perdeu o equilíbrio e abaixou-se na penumbra para verificar se havia quebrado o salto do sapato. Ao afastar a barra da calça do rapaz com a mão, deparou-se com uma imagem assustadora: por debaixo do tecido não havia pés nem sapatos, mas cascos negros, fendidos e peludos, idênticos aos de um bode.",
            "O grito agudo da jovem cortou o som ensurdecedor dos alto-falantes e paralisou a pista. As pessoas mais próximas recuaram em pânico, abrindo uma clareira apressada ao redor do casal. Em questão de instantes, um cheiro acre e sufocante de enxofre começou a se espalhar pelo ambiente, provocando tosse e empurrões desesperados em direção às portas de emergência.",
            {
                "tipo": "quote",
                "texto": "O rapaz dançava muito bem e era elegante, mas quando a moça olhou pro chão viu os cascos de bode por baixo da calça. Deu um estalo e ele sumiu no meio de uma fumaça com cheiro de enxofre.",
                "fonte": "Registro da lenda urbana joseense recolhido pelo historiador Diego Del Passo (2024)"
            },
            "Antes que a equipe de seguranças pudesse intervir ou fechar os acessos da casa, as luzes da boate piscaram de forma descompassada, ouviu-se um estrondo seco na pista e o rapaz simplesmente desapareceu no ar. No local exato onde ele dançava, restou apenas uma névoa espessa e o cheiro queimado impregnado nas paredes e no carpete.",
            "A história correu colégios, universidades e rodas de esquina da cidade, ganhando variações que oscilavam entre o <em>Casablanca</em> e o <em>Barcelona</em> e apelidos como <em>Minotauro</em> ou homem com <em>pé de bode</em>. Como ressaltou a jornalista <strong>Paola Domingues</strong> em reportagem cultural para a revista <strong>Entrementes</strong>, o episódio virou um clássico do anedotário joseense, celebrado em letras bem-humoradas pela banda musical <strong>Folclore Joseense Desbocado</strong>, demonstrando como uma narrativa ancestral sobre o diabo no baile foi assimilada pela noite urbana moderna."
        ],
        "fontes": [
            {
                "titulo": "Lenda urbana: o Minotauro de São José dos Campos",
                "autor": "Diego Del Passo",
                "ano": "24 jul. 2024",
                "tipo": "Registro de lenda",
                "url": "https://professordiegodelpasso.blog/2024/07/24/lenda-urbana-o-minotauro-do-casablanca/",
                "nota": "Versão do encontro na pista e das variações Casablanca/Barcelona.",
                "localizador": "Sem paginação.",
                "referencia": "DEL PASSO, Diego. Lenda urbana: o Minotauro de São José dos Campos. Nas Trilhas do Vale, 24 jul. 2024."
            },
            {
                "titulo": "Os excêntricos causos de São José dos Campos",
                "autor": "Paola Domingues",
                "ano": "19 jan. 2023",
                "tipo": "Reportagem cultural",
                "url": "https://entrementes.com.br/os-excentricos-causos-de-sao-jose-dos-campos/",
                "nota": "Relaciona os causos locais ao trabalho da banda Folclore Joseense Desbocado.",
                "localizador": "Sem paginação.",
                "referencia": "DOMINGUES, Paola. Os excêntricos causos de São José dos Campos. Entrementes, 19 jan. 2023."
            }
        ]
    },
    {
        "id": "morto-matriz",
        "titulo": "O morto que marcou a parede da igreja",
        "categoria": "Lenda de sepultamento",
        "badgeColor": "bg-slate-700 text-white",
        "imagem": "fotos_radar/lenda_morto_matriz.jpg",
        "lead": "Depois da transferência de uma sepultura, uma mancha teria desenhado o corpo do morto na parede da igreja.",
        "local": "Antiga Capela do Rosário e Igreja de São Benedito, Centro",
        "epoca": "Narrativa situada no século XIX",
        "relatoCompleto": [
            "Durante grande parte do século XIX, antes que as posturas municipais e as regras de higiene pública determinassem a criação de cemitérios a céu aberto longe do perímetro urbano, o costume colonial no Vale do Paraíba mandava que as pessoas fossem sepultadas dentro das próprias igrejas. Cidadãos de famílias abastadas, militares de patente e membros das irmandades religiosas garantiam o descanso eterno sob as tábuas do piso ou encaixados nas espessas paredes de taipa de pilão dos templos centrais de São José dos Campos.",
            "Quando as reformas urbanísticas e as ordens eclesiásticas exigiram a desocupação desses espaços sagrados, equipes de pedreiros e coveiros foram encarregadas de realizar a trasladação solene das ossadas que repousavam na antiga <strong>Capela do Rosário</strong> para o novo carneiro construído na <strong>Igreja de São Benedito</strong>.",
            "Ao removerem a laje que cobria o túmulo do capitão <strong>Miguel de Araújo Ferraz</strong>, figura de prestígio na vila provincial, os operários deram um passo atrás, tomados de espanto. Em vez do esqueleto desarticulado e dos tecidos consumidos pelos anos de enterro, encontraram o corpo do militar completamente preservado. A pele mantinha a textura intacta, as feições do rosto pareciam as de quem acabara de adormecer e as vestes funerárias conservavam as costuras originais, sem qualquer sinal visível de putrefação.",
            "A notícia do corpo incorrupto correu veloz pelas ruas de chão batido do Centro, atraindo dezenas de curiosos e devotos que viram no acontecimento uma prova irrefutável de santidade. O caixão foi transladado com orações fervorosas para o interior da Igreja de São Benedito. Semanas após o novo sepultamento, porém, um mistério ainda maior começou a inquietar os fiéis que assistiam às missas matinais.",
            {
                "tipo": "quote",
                "texto": "Quando desenterraram o capitão Araújo Ferraz, o corpo estava perfeito como se estivesse vivo. Meses depois, apareceu na parede da igreja uma mancha com o formato exato do defunto deitado.",
                "fonte": "Registro da tradição oral recolhido pelo historiador Diego Del Passo na série Lendas de São José dos Campos (2026)"
            },
            "Uma mancha escura de umidade começou a se desenhar em uma das paredes de taipa do templo, reproduzindo com fidelidade espantosa a silhueta horizontal de um cadáver estendido. Moradores das imediações passaram a acender velas em frente ao reboco manchado, ajoelhando-se em romaria espontânea para pedir favores e orar pela alma do capitão. A movimentação diária provocou tanto incômodo à influente família Araújo Ferraz que seus herdeiros exigiram a raspagem profunda da massa e a repintura imediata da parede para conter as vigílias.",
            "O cenário material dessas primeiras capelas e o contexto arqueológico dos sepultamentos coloniais foram explorados no documentário <em>Igrejas históricas</em>, produzido pela <strong>TV Câmara de São José dos Campos</strong>. Na produção, historiadores locais e o arqueólogo <strong>Wagner Bornal</strong> explicam como a estrutura de taipa de pilão e os antigos ritos funerários alimentavam o imaginário popular joseense, transformando infiltrações e fenômenos biológicos de conservação cadavérica em causos que atravessaram gerações."
        ],
        "fontes": [
            {
                "titulo": "Lendas de São José dos Campos",
                "autor": "Diego Del Passo",
                "ano": "28 set. 2026",
                "tipo": "Registro de lenda",
                "url": "https://professordiegodelpasso.blog/2026/09/28/lendas-de-sao-jose-dos-campos/",
                "nota": "Seção “Lendas antigas de defuntos”, que conta a transferência da sepultura e a marca na parede.",
                "localizador": "Sem paginação.",
                "referencia": "DEL PASSO, Diego. Lendas de São José dos Campos. Nas Trilhas do Vale, 28 set. 2026."
            },
            {
                "titulo": "Igrejas históricas | câmara.doc",
                "autor": "TV Câmara São José dos Campos",
                "ano": "[s.d.]",
                "tipo": "Vídeo no YouTube",
                "url": "https://www.youtube.com/watch?v=nsZxRIo4V6s",
                "nota": "O documentário reúne historiadores e um arqueólogo. A apresentação oficial informa que ele aborda a lenda do túnel.",
                "localizador": "Vídeo completo.",
                "referencia": "TV CÂMARA SÃO JOSÉ DOS CAMPOS. Igrejas históricas | câmara.doc. São José dos Campos: TV Câmara, [s.d.]. 1 vídeo. Publicado no YouTube."
            },
            {
                "titulo": "Documentários da TV Câmara mostram patrimônio, arquitetura, visitas ilustres e futebol amador",
                "autor": "Câmara Municipal de São José dos Campos",
                "ano": "12 jan. 2024",
                "tipo": "Apresentação do documentário",
                "url": "https://www.camarasjc.sp.gov.br/noticias/8423/documentarios-da-tv-camara-mostram-patrimonio-arquitetura-visitas-ilustres-e-futebol-amador",
                "nota": "Identifica os participantes de Igrejas históricas e o comentário do arqueólogo Wagner Bornal sobre o túnel.",
                "localizador": "Sem paginação.",
                "referencia": "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Documentários da TV Câmara mostram patrimônio, arquitetura, visitas ilustres e futebol amador. [S. l.], 12 jan. 2024."
            }
        ]
    },
    {
        "id": "ovnis-1986",
        "titulo": "19 de maio de 1986: a noite dos OVNIs sobre São José",
        "categoria": "Ocorrência documentada e imaginário ufológico",
        "badgeColor": "bg-cyan-600 text-white",
        "imagem": "web-media/lenda_ovnis_1986-bc887ea49f5e.webp",
        "lead": "Luzes não identificadas mobilizaram controladores e pilotos. Os registros daquela noite chegaram ao Arquivo Nacional.",
        "local": "São José dos Campos e outras cidades do Sudeste",
        "epoca": "19 de maio de 1986",
        "relatoCompleto": [
            "A noite de <strong>19 de maio de 1986</strong> transcorria em clima de rotina no Centro Técnico Aeroespacial e na torre de controle do aeroporto de São José dos Campos. O céu de outono estava límpido e estrelado sobre o Vale do Paraíba, sem previsão de chuvas ou turbulências na rota das aeronaves civis. Pouco depois das oito da noite, contudo, os operadores de radar do controle aéreo começaram a registrar pontos luminosos e ecos anômalos que se deslocavam em padrões completamente desconhecidos.",
            "Não eram aviões comerciais nem helicópteros de patrulha. As telas de radar acusavam a presença de múltiplos objetos que permaneciam pairando estáticos sobre a serra e, no instante seguinte, aceleravam em linha reta atingindo velocidades calculadas em mais de quinze vezes a velocidade do som, sem emitir o estrondo sônico característico da quebra da barreira da velocidade.",
            "Diante do risco direto à segurança da navegação e ao espaço aéreo sobre o polo tecnológico e bélico da cidade, o Comando de Defesa Aérea da Força Aérea Brasileira declarou estado de prontidão máxima. Caças supersônicos Mirage III e caças F-5 decolaram em disparada das bases aéreas de Santa Cruz, no Rio de Janeiro, e de Anápolis, em Goiás, com a missão de fazer contato visual e interceptar os invasores.",
            "No céu de São José dos Campos, os pilotos militares perseguiram esferas intensamente brilhantes que alternavam entre tonalidades de vermelho, verde e branco fosforescente. Conforme os jatos tentavam aproximação para travar os radares de bordo, os objetos realizavam curvas em ângulo reto impossíveis para qualquer aeronave terrestre, contornando os caças e passando a segui-los pela retaguarda.",
            {
                "tipo": "quote",
                "texto": "Os radares acusavam 21 objetos luminosos sobre o espaço aéreo brasileiro. A FAB deslocou caças para interceptar os alvos, que realizavam manobras a velocidades hipersônicas que desafiam o conhecimento aeroespacial.",
                "fonte": "Declaração oficial do brigadeiro Moreira Lima, ministro da Aeronáutica, noticiada pelo Correio Braziliense em 22 de maio de 1986"
            },
            "O episódio ganhou proporções históricas tão incontestáveis que o próprio ministro da Aeronáutica, <strong>brigadeiro Moreira Lima</strong>, convocou os jornalistas para uma entrevista coletiva histórica transmitida em rede nacional, confirmando a detecção e perseguição militar de vinte e um objetos voadores não identificados.",
            "Três décadas mais tarde, os relatórios sigilosos da operação foram desclassificados e transferidos para a guarda pública do <strong>Arquivo Nacional</strong>, sob o título oficial da <em>Noite Oficial dos OVNIs</em>. Nos depoimentos gravados dos pilotos de caça, preservados no acervo federal, ecoam a frieza técnica e o espanto incontido de militares profissionais que perseguiram o desconhecido nos céus de São José dos Campos."
        ],
        "fontes": [
            {
                "titulo": "Série Relatos Extraterrestres: Noite Oficial dos OVNIs no Brasil",
                "autor": "Arquivo Nacional",
                "ano": "15 ago. 2017",
                "tipo": "Acervo oficial",
                "url": "https://www.gov.br/arquivonacional/pt-br/canais_atendimento/imprensa/noticias/serie-relatos-extraterrestres/",
                "nota": "Apresenta o episódio e identifica o documento BR_DFANBSB_ARX_256_p0005_0005.",
                "localizador": "Sem paginação.",
                "referencia": "ARQUIVO NACIONAL. Série Relatos Extraterrestres: Noite Oficial dos OVNIs no Brasil. [S. l.], 15 ago. 2017."
            },
            {
                "titulo": "Aviões da FAB caçam OVNIs e acabam caçados",
                "autor": "Correio Braziliense",
                "ano": "22 maio 1986",
                "tipo": "Jornal preservado em acervo",
                "url": "https://imagem.sian.an.gov.br/acervo/derivadas/BR_DFANBSB_ARX/0/0/0257/BR_DFANBSB_ARX_0_0_0257_d0002de0003.pdf#page=7",
                "nota": "Notícia da época que cita São José dos Campos.",
                "localizador": "p. 9 do jornal; página 7 do PDF.",
                "referencia": "AVIÕES da FAB caçam OVNIs e acabam caçados. Correio Braziliense, Brasília, 22 maio 1986, p. 9. Reprodução preservada pelo Arquivo Nacional."
            }
        ]
    },
    {
        "id": "assombracoes-vale",
        "titulo": "O túnel secreto sob as igrejas do Centro",
        "categoria": "Lenda urbana",
        "badgeColor": "bg-emerald-800 text-white",
        "imagem": "fotos_radar/lenda_tunel_centro.jpg",
        "lead": "Uma passagem escondida ligaria as igrejas ao Banhado. A história atravessou gerações e chegou a um documentário sobre o patrimônio da cidade.",
        "local": "Centro e Banhado",
        "epoca": "Tradição sem data de origem confirmada",
        "relatoCompleto": [
            "Entre os moradores que viram a vila de São José dos Campos transformar-se na maior cidade do Vale do Paraíba, poucas narrativas despertam tanta curiosidade e imaginação quanto a certeza de que uma cidade subterrânea e secreta corre sob os paralelepípedos do centro histórico.",
            "De acordo com o causo transmitido por gerações de boca em boca, existiria um longo túnel colonial escavado à mão em taipa e arcos de alvenaria. Essa passagem subterrânea ligaria em linha reta o subsolo da <strong>Igreja Matriz de São José</strong> à <strong>Igreja de São Benedito</strong>, estendendo-se por centenas de metros até encontrar uma saída oculta entre as bananeiras e valas da várzea do <strong>Banhado</strong>.",
            "As explicações populares sobre quem cavou a galeria e por que razão ela foi construída variam conforme as lembranças dos mais velhos. Uns afirmavam que o caminho subterrâneo servira de rota secreta de fuga para padres jesuítas e autoridades civis durante levantes políticos e rebeliões imperiais; outros garantiam que a passagem fora criada para permitir o trânsito discreto de freiras e membros do clero sem que precisassem ser vistos pela multidão que frequentava a praça.",
            "O causo ganhou tanta força ao longo das décadas que qualquer obra de saneamento na Rua XV de Novembro ou na Praça Afonso Pena que expusesse um arco de tijolos antigos ou uma fossa desmoronada atraía imediatamente vizinhos convictos de que a boca do túnel havia sido finalmente encontrada.",
            {
                "tipo": "quote",
                "texto": "Antigos moradores e pedreiros juravam que existia uma galeria ligando a Matriz até o Banhado. A lenda popular fala em rota de fuga, mas as escavações e a arqueologia mostram que eram antigos poços e porões de taipa.",
                "fonte": "Análise do documentário Igrejas históricas com o arqueólogo Wagner Bornal (TV Câmara São José dos Campos)"
            },
            "O tema tornou-se objeto de apuração aprofundada no documentário especial <em>Igrejas históricas</em>, produzido pela <strong>TV Câmara de São José dos Campos</strong>. Na produção, historiadores do Núcleo Pró-Memória e o arqueólogo <strong>Wagner Bornal</strong> analisam a procedência da lenda, explicando que vistorias estruturais e prospecções arqueológicas no quadrilátero central nunca detectaram uma galeria subterrânea contínua com tal extensão.",
            "Segundo os especialistas, o que o povo encontrava no passado eram na verdade antigos poços de captação de água pluvial, porões de ventilação para casas coloniais de taipa de pilão ou valas rudimentares de drenagem. Ainda assim, como constatou o historiador <strong>Diego Del Passo</strong> em seus registros orais, a crença na passagem secreta teima em permanecer viva nas conversas do Centro, provando que o fascínio pelo mistério quase sempre fala mais alto que as plantas arquitetônicas."
        ],
        "fontes": [
            {
                "titulo": "Igrejas históricas | câmara.doc",
                "autor": "TV Câmara São José dos Campos",
                "ano": "[s.d.]",
                "tipo": "Vídeo no YouTube",
                "url": "https://www.youtube.com/watch?v=nsZxRIo4V6s",
                "nota": "O documentário reúne historiadores e um arqueólogo. A apresentação oficial informa que ele aborda a lenda do túnel.",
                "localizador": "Vídeo completo.",
                "referencia": "TV CÂMARA SÃO JOSÉ DOS CAMPOS. Igrejas históricas | câmara.doc. São José dos Campos: TV Câmara, [s.d.]. 1 vídeo. Publicado no YouTube."
            },
            {
                "titulo": "Documentários da TV Câmara mostram patrimônio, arquitetura, visitas ilustres e futebol amador",
                "autor": "Câmara Municipal de São José dos Campos",
                "ano": "12 jan. 2024",
                "tipo": "Apresentação do documentário",
                "url": "https://www.camarasjc.sp.gov.br/noticias/8423/documentarios-da-tv-camara-mostram-patrimonio-arquitetura-visitas-ilustres-e-futebol-amador",
                "nota": "Identifica os participantes de Igrejas históricas e o comentário do arqueólogo Wagner Bornal sobre o túnel.",
                "localizador": "Sem paginação.",
                "referencia": "CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Documentários da TV Câmara mostram patrimônio, arquitetura, visitas ilustres e futebol amador. [S. l.], 12 jan. 2024."
            },
            {
                "titulo": "Lendas de São José dos Campos",
                "autor": "Diego Del Passo",
                "ano": "28 set. 2026",
                "tipo": "Registro de lenda",
                "url": "https://professordiegodelpasso.blog/2026/09/28/lendas-de-sao-jose-dos-campos/",
                "nota": "Seção “O túnel secreto”: versão popular do percurso.",
                "localizador": "Sem paginação.",
                "referencia": "DEL PASSO, Diego. Lendas de São José dos Campos. Nas Trilhas do Vale, 28 set. 2026."
            }
        ]
    },
    {
        "id": "homem-infinito",
        "titulo": "O Homem Infinito e as esquinas da cidade",
        "categoria": "Personagem do imaginário local",
        "badgeColor": "bg-blue-800 text-white",
        "imagem": "web-media/lenda_homem_infinito-eff2138f9692.webp",
        "lead": "O mesmo andarilho seria visto em lugares diferentes ao mesmo tempo. Dessa impossibilidade nasceu o apelido.",
        "local": "Ruas de São José dos Campos",
        "epoca": "Lenda urbana contemporânea",
        "relatoCompleto": [
            "Em uma metrópole que se expandiu em ritmo acelerado como São José dos Campos, cercada por pontilhões, anéis viários e trânsito intenso de operários e engenheiros, a presença de andarilhos solitários costuma ser ignorada pelos motoristas através dos vidros fechados dos carros.",
            "Entre as figuras que cruzavam as calçadas da cidade nos últimos anos, no entanto, uma começou a despertar conversas curiosas e desconcertantes. Tratava-se de um senhor franzino, de óculos de armação grossa, roupas invariavelmente gastas pelo sol e uma pochete surrada presa à cintura, que caminhava com passos decididos e cabeça erguida pelas ruas de maior movimento.",
            "O mistério não estava no seu figurino, mas na sua pontualidade inexplicável. Comerciantes do calçadão juravam que ele havia passado a pé pela <strong>Praça Afonso Pena</strong> exatamente às duas horas da tarde. No mesmo instante, moradores do longínquo <strong>Jardim Satélite</strong> ou trabalhadores na Avenida Cassiopeia afirmavam com certeza idêntica que o mesmo homem cruzara o canteiro central do bairro, a quilômetros de distância e sem que houvesse tomado qualquer ônibus ou transporte motorizado.",
            "Dessa aparente impossibilidade física nasceu a alcunha de <em>Homem Infinito</em>, chamado também por outros de <em>Peregrino</em> ou <em>Ventania</em>. A lenda logo ganhou desdobramentos no imaginário dos bairros: os mais místicos falavam em dons raros de bilocação, fenômeno espiritual atribuído a santos franciscanos que permite a presença simultânea em dois locais distintos; os mais temerosos temiam cruzar seu olhar, acreditando que a figura seria um duplo fantasmagórico que pressagiava acidentes.",
            {
                "tipo": "quote",
                "texto": "Alguém jura que viu o homem no Centro e outro garante que ele estava no Satélite no mesmo minuto. O Homem Infinito virou uma lenda urbana contemporânea que os moradores adoram recontar.",
                "fonte": "Registro de causos urbanos publicado pelo professor Diego Del Passo no blog Nas Trilhas do Vale (2020)"
            },
            "A figura acabou adotada como ícone da cultura alternativa e poética joseense. Conforme reportou a jornalista <strong>Paola Domingues</strong> na revista cultural <strong>Entrementes</strong>, causos em torno do personagem ganharam status de patrimônio afetivo da cidade, inspirando composições bem-humoradas da banda <strong>Folclore Joseense Desbocado</strong>.",
            "Mais do que um enigma físico ou científico, a história do <em>Homem Infinito</em> reflete o sentimento de estranhamento da vida moderna: numa cidade onde todo mundo corre apressado dentro de veículos de metal, quem insiste em andar a pé pelas esquinas acaba ganhando a aura mágica de quem desafia as fronteiras do tempo e do espaço."
        ],
        "fontes": [
            {
                "titulo": "Mistérios de São José dos Campos (Parte 2)",
                "autor": "Diego Del Passo",
                "ano": "7 jul. 2020",
                "tipo": "Registro de lenda",
                "url": "https://professordiegodelpasso.blog/2020/07/07/os-maiores-misterios-de-sao-jose-dos-campos-parte-2-2/",
                "nota": "Seção “O Homem Infinito”, com os apelidos e as versões sobre as aparições.",
                "localizador": "Sem paginação.",
                "referencia": "DEL PASSO, Diego. Mistérios de São José dos Campos (Parte 2). Nas Trilhas do Vale, 7 jul. 2020."
            },
            {
                "titulo": "Os excêntricos causos de São José dos Campos",
                "autor": "Paola Domingues",
                "ano": "19 jan. 2023",
                "tipo": "Reportagem cultural",
                "url": "https://entrementes.com.br/os-excentricos-causos-de-sao-jose-dos-campos/",
                "nota": "Contexto sobre a banda e sua relação com o folclore local; não comprova os poderes atribuídos ao personagem.",
                "localizador": "Sem paginação.",
                "referencia": "DOMINGUES, Paola. Os excêntricos causos de São José dos Campos. Entrementes, 19 jan. 2023."
            }
        ]
    }
];

  function renderLendasGrid() {
    const page = document.getElementById('historia-lendas-page-content');
    const modalContent = document.getElementById('historia-lendas-content');
    if (!page && !modalContent) return;

    const cardsHtml = `
      <div class="space-y-6">


        <!-- Grade de Cards das Lendas -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${LENDAS_CATALOGO.map(lenda => {
            const hasCustomImage = lenda.imagem && lenda.imagem.length > 0;
            return `
              <article 
                onclick="window.openLendaDetalhe('${lenda.id}')"
                class="group relative h-96 rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-200 hover:-translate-y-1.5 flex flex-col justify-between p-6 ${hasCustomImage ? '' : 'bg-gradient-to-br from-slate-900 via-slate-800 to-[#0f2f52]'}"
              >
                ${hasCustomImage ? `
                  <!-- Imagem de Fundo Artística em Carvão -->
                  <img 
                    src="${lenda.imagem}" 
                    alt="${escapeHtml(lenda.titulo)}" 
                    class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <!-- Overlay de Gradiente Chiaroscuro Escuro -->
                  <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/20 group-hover:via-black/45 transition-colors"></div>
                ` : `
                  <!-- Fundo de Espera para os próximos cards em aprovação -->
                  <div class="absolute inset-0 bg-radial from-slate-800 to-slate-950 opacity-90"></div>
                  <div class="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
                `}

                <!-- Topo do Card: Badge de Categoria e Indicador -->
                <div class="relative z-10 flex items-center justify-between">
                  <span class="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center text-xs group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors shadow-xs">
                    <i class="fa-solid fa-arrow-right"></i>
                  </span>
                </div>

                <!-- Base do Card: Título, Lead e Chamada -->
                <div class="relative z-10 space-y-2 text-white">
                  <h4 class="text-xl sm:text-2xl font-black text-white leading-tight drop-shadow-sm group-hover:text-amber-300 transition-colors">
                    ${escapeHtml(lenda.titulo)}
                  </h4>
                  <p class="text-xs text-slate-300 font-medium leading-relaxed line-clamp-3">
                    ${escapeHtml(lenda.lead)}
                  </p>
                  <div class="pt-2 flex items-center gap-1.5 text-[11px] font-bold text-amber-300">
                    <i class="fa-solid fa-book-open text-xs"></i>
                    <span>Ler relato completo & fontes</span>
                  </div>
                </div>
              </article>
            `;
          }).join('')}
        </div>
      </div>
    `;

    if (page) page.innerHTML = cardsHtml;
    if (modalContent) modalContent.innerHTML = cardsHtml;
  }

  function fonteLendaHtml(f) {
    const url = escapeHtml(safeUrl(f.url));
    const video = /vídeo/i.test(f.tipo);
    return `<div class="min-w-0 pt-4 pb-2 space-y-1.5">
      <div class="flex items-center gap-2">
        <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">${escapeHtml(f.tipo)}</span>
        ${f.localizador ? `<span class="text-[11px] font-mono text-slate-400">${escapeHtml(f.localizador)}</span>` : ''}
      </div>
      <p class="text-xs sm:text-sm font-medium leading-relaxed text-slate-800">${escapeHtml(f.referencia)}</p>
      ${f.nota ? `<p class="text-xs text-slate-600 leading-relaxed">${escapeHtml(f.nota)}</p>` : ''}
      <p class="text-xs text-slate-500 leading-relaxed">Disponível em: <a href="${url}" target="_blank" rel="noopener noreferrer" class="underline underline-offset-2 text-brand-800 break-all font-mono">${escapeHtml(f.url)}</a></p>
      ${video ? `<a href="${url}" target="_blank" rel="noopener noreferrer" class="inline-block pt-1 text-xs font-bold underline text-brand-800">${/youtube/i.test(f.tipo) ? 'Assistir no YouTube' : 'Assistir à reportagem'}</a>` : ''}
    </div>`;
  }

  function openLendaDetalhe(lendaId) {
    const lenda = LENDAS_CATALOGO.find(l => l.id === lendaId);
    if (!lenda) return;

    const page = document.getElementById('historia-lendas-page-content');
    const modalContent = document.getElementById('historia-lendas-content');
    const target = page || modalContent;
    if (!target) return;

    const detailHtml = `
      <div class="space-y-6 animate-in fade-in duration-300">
        
        <!-- Botão Voltar -->
        <div class="flex items-center justify-start pb-3 border-b border-slate-200">
          <button 
            type="button" 
            onclick="window.closeLendaDetalhe()" 
            class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
          >
            <i class="fa-solid fa-arrow-left"></i>
            <span>Voltar para todas as Lendas</span>
          </button>
        </div>

        <!-- Container Editorial Alinhado com Respiro Lateral (Afastado da Sidebar) -->
        <div class="max-w-4xl px-4 sm:px-8 space-y-8">
          
          <!-- Cabeçalho Editorial Estilo Reportagem/Blog Cultural -->
          <header class="pb-6 border-b border-slate-200 space-y-3">
            <h2 class="text-2xl sm:text-4xl font-serif font-black text-slate-900 tracking-tight leading-tight">
              ${escapeHtml(lenda.titulo)}
            </h2>

            ${lenda.lead ? `
              <p class="text-base sm:text-lg text-slate-600 font-serif italic leading-relaxed">
                ${escapeHtml(lenda.lead)}
              </p>
            ` : ''}
          </header>

          <!-- Corpo da História (Alinhado à esquerda junto à linha do título e botão voltar) -->
          <article class="space-y-6 text-slate-800 font-serif leading-relaxed text-base sm:text-lg">
            ${lenda.relatoCompleto.map(p => {
              if (typeof p === 'object' && p.tipo === 'quote') {
                return `
                  <figure class="my-8 py-4 border-y border-slate-200">
                    <blockquote class="text-lg sm:text-xl text-slate-800 font-serif italic leading-relaxed text-justify">
                      “${p.texto}”
                    </blockquote>
                    ${p.fonte ? `
                      <figcaption class="mt-2 text-right text-xs font-mono font-medium text-slate-500">
                        ${p.fonte}
                      </figcaption>
                    ` : ''}
                  </figure>
                `;
              }
              return `<p class="text-justify leading-relaxed">${p}</p>`;
            }).join('')}
          </article>

          <!-- Acervo de Fontes Documentais & Acadêmicas (Soltas, uma abaixo da outra, sem caixa) -->
          <section class="pt-8 border-t border-slate-200 space-y-6">
            <div class="pb-2">
              <h5 class="font-serif font-black text-slate-900 text-lg sm:text-xl">
                Fontes e referências documentais
              </h5>
            </div>
            
            <div class="divide-y divide-slate-100 space-y-4">
              ${lenda.fontes.map(fonteLendaHtml).join('')}
            </div>
          </section>

          <!-- Botão Voltar no Rodapé (Mesmo estilo do topo, alinhado com o texto) -->
          <div class="pt-6 border-t border-slate-200 flex justify-start">
            <button 
              type="button" 
              onclick="window.closeLendaDetalhe()" 
              class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
            >
              <i class="fa-solid fa-arrow-left"></i>
              <span>Voltar para todas as Lendas</span>
            </button>
          </div>

        </div>

      </div>
    `;

    target.innerHTML = detailHtml;
    // Rola suavemente até o topo da seção de lendas
    const sectionEl = document.getElementById('section-view-lendas');
    if (sectionEl) sectionEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function closeLendaDetalhe() {
    renderLendasGrid();
  }

  window.openLendaDetalhe = openLendaDetalhe;
  window.closeLendaDetalhe = closeLendaDetalhe;

  function openHistoriaLendas() {
    renderLendasGrid();
  }

  function closeHistoriaLendas() {
    ModalManager.close('historia-lendas-modal');
  }

  function openHistoriaBibliografia() {
    const content = document.getElementById('historia-bibliografia-content');
    if (!content) return;
    const grupos = [
      { titulo: 'História geral e formação urbana', itens: [
        ['CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Pró-Memória. São José dos Campos e sua história. São José dos Campos: Câmara Municipal, [s.d.].', 'https://www.camarasjc.sp.gov.br/promemoria/historia-sjc/'],
        ['CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Cronologia de São José dos Campos. São José dos Campos: Pró-Memória, [s.d.].', 'https://www.camarasjc.sp.gov.br/promemoria/cronologia-sjc/'],
        ['SÃO JOSÉ DOS CAMPOS. Prefeitura. História de São José dos Campos. São José dos Campos, [s.d.].', 'https://www.sjc.sp.gov.br/servicos/governanca/sao-jose-em-dados/historia/']
      ]},
      { titulo: 'Industrialização, trabalho e tecnologia', itens: [
        ['BARRETO, Katerine Roman. Embraer: no contexto do desenvolvimento industrial de São José dos Campos (1950-2000). 2002. TCC - Universidade do Vale do Paraíba.', 'https://www.camarasjc.sp.gov.br/promemoria/2025/07/14/embraer-no-contexto-do-desenvolvimento-industrial-de-sao-jose-dos-campos-1950-2000/'],
        ['SANTOS, Eliane; AMARAL, Marisa. Novos territórios produtivos, mudança tecnológica e mercado de trabalho: o caso de São José dos Campos. Dados, Rio de Janeiro, v. 44, n. 3, 2001.', 'https://www.scielo.br/j/dados/a/gJC5KFwX73k5XMh7CbgfBDr/?lang=pt'],
        ['OLIVEIRA, Márcia Regina de; SOUZA, Adriane Aparecida Moreira de; RIBEIRO, Anabela. Implicações socioeconômicas e territoriais decorrentes do complexo aeroespacial. Revista Brasileira de Gestão e Desenvolvimento Regional, v. 15, n. 6, 2019.', 'https://www.rbgdr.net/revista/index.php/rbgdr/article/view/5204'],
        ['INSTITUTO NACIONAL DE PESQUISAS ESPACIAIS. História institucional. Brasília, DF: INPE, [s.d.].', 'https://www.gov.br/inpe/pt-br/acesso-a-informacao/institucional/historia']
      ]},
      { titulo: 'População e migração', itens: [
        ['INSTITUTO BRASILEIRO DE GEOGRAFIA E ESTATÍSTICA. São José dos Campos (SP): Cidades e Estados. Rio de Janeiro: IBGE, 2026.', 'https://www.ibge.gov.br/cidades-e-estados/sp/sao-jose-dos-campos.html'],
        ['INSTITUTO BRASILEIRO DE GEOGRAFIA E ESTATÍSTICA. Censo Demográfico 2022. Rio de Janeiro: IBGE, 2023.', 'https://www.ibge.gov.br/estatisticas/sociais/populacao/22827-censo-demografico-2022.html'],
        ['SÃO JOSÉ DOS CAMPOS. Prefeitura. População. São José dos Campos, [s.d.].', 'https://www.sjc.sp.gov.br/servicos/governanca/populacao/']
      ]},
      { titulo: 'Patrimônio, cultura e lugares de memória', itens: [
        ['FUNDAÇÃO CULTURAL CASSIANO RICARDO. Casas de Cultura, museus e equipamentos culturais. São José dos Campos: FCCR, [s.d.].', 'https://fccr.sp.gov.br/fccr/usuario/Login.php'],
        ['SÃO JOSÉ DOS CAMPOS. Prefeitura. Museus e prédios históricos. São José dos Campos, [s.d.].', 'https://sjc.sp.gov.br/servicos/inovacao-e-desenvolvimento-economico/turismo/museus-e-predios-historicos/'],
        ['SÃO JOSÉ DOS CAMPOS. Prefeitura. Parque Santos Dumont: patrimônio e parque de gerações. São José dos Campos, 2019.', 'https://www.sjc.sp.gov.br/noticias/2019/dezembro/26/patrimonio-santos-dumont-e-parque-de-geracoes-de-familias/'],
        ['SÃO JOSÉ DOS CAMPOS. Prefeitura. Praça Heróis de Alcântara ganha monumento. São José dos Campos, 2023.', 'https://www.sjc.sp.gov.br/noticias/2023/agosto/22/praca-herois-de-alcantara-ganha-monumento-na-regiao-sudeste/'],
        ['SÃO JOSÉ DOS CAMPOS. Prefeitura. Parques municipais. São José dos Campos, [s.d.].', 'https://www.sjc.sp.gov.br/servicos/esporte-e-qualidade-de-vida/parques/']
      ]},
      { titulo: 'Bairros e território', itens: [
        ['CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Pró-Memória. Estudos e documentos sobre bairros e crescimento urbano. São José dos Campos, [s.d.].', 'https://www.camarasjc.sp.gov.br/promemoria/'],
        ['SÃO JOSÉ DOS CAMPOS. Prefeitura. Mapa e divisões territoriais do município. São José dos Campos, [s.d.].', 'https://www.sjc.sp.gov.br/servicos/governanca/sao-jose-em-dados/mapa/']
      ]}
    ];
    const fontesLendas = new Map();
    LENDAS_CATALOGO.forEach(lenda => lenda.fontes.forEach(f => {
      const chave = f.url.split('#')[0];
      if (!fontesLendas.has(chave)) fontesLendas.set(chave, { fonte: f, localizadores: new Set() });
      fontesLendas.get(chave).localizadores.add(f.localizador);
    }));
    grupos.push({ titulo: 'Lendas, devoções populares e memória oral', itens: Array.from(fontesLendas.values()).map(({fonte: f, localizadores}) => [
      f.referencia + ' ' + Array.from(localizadores).join(' ') + ' Disponível em: ' + f.url + '. Acesso em: 4 out. 2026.', f.url
    ]) });
    const fontesNorte = new Map();
    ((window.HISTORIA_SJC_DATA || {}).bairros || []).filter(b => b.regiaoId === 'norte' || b.loteRevisao === 'centro-2026-10-04' || b.layoutHistoria === 'editorial-v1').forEach(b => {
      (b.fontesRevisadas || []).forEach(f => {
        if (!fontesNorte.has(f.url)) fontesNorte.set(f.url, { fonte: f, paginas: new Set() });
        if (f.pagina) fontesNorte.get(f.url).paginas.add(f.pagina);
      });
    });
    if (fontesNorte.size) grupos.push({ titulo: 'Bairros — referências dos lotes revisados', itens: Array.from(fontesNorte.values()).map(item => {
      const f = item.fonte;
      const paginas = Array.from(item.paginas).join(', ');
      return [f.referencia + (paginas ? ' Páginas consultadas: ' + paginas + '.' : '') + ' Disponível em: ' + f.url + '. Acesso em: ' + (f.acesso || '3 out. 2026.'), f.paginaPdf ? f.url.split('#')[0] + '#page=' + f.paginaPdf : f.url];
    }) });
    const dataHist = window.HISTORIA_SJC_DATA || {};
    if (dataHist.prefeitosDossie && dataHist.prefeitosDossie.referencias && dataHist.prefeitosDossie.referencias.length) {
      grupos.push({
        titulo: 'Autoridades Municipais, Legislação e Governança (1798–2026)',
        itens: dataHist.prefeitosDossie.referencias.map(function(r) {
          return [r.fullText, r.url || '#'];
        })
      });
    }
    content.innerHTML = grupos.map(g => `<section class="space-y-3"><h3 class="text-sm font-black uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-2">${escapeHtml(g.titulo)}</h3><ol class="space-y-3 list-decimal list-inside">${g.itens.map(i => `<li class="text-xs sm:text-sm text-slate-700 leading-relaxed pl-1"><a href="${escapeHtml(safeUrl(i[1]))}" target="_blank" rel="noopener noreferrer" class="underline decoration-slate-300 underline-offset-2 hover:text-brand-800">${escapeHtml(i[0])}</a></li>`).join('')}</ol></section>`).join('');
    const page = document.getElementById('historia-bibliografia-page-content');
    if (page) { page.innerHTML = content.innerHTML; return; }
    ModalManager.open('historia-bibliografia-modal');
  }

  function closeHistoriaBibliografia() {
    ModalManager.close('historia-bibliografia-modal');
  }

  // 8. DELEGAÇÃO DE EVENTOS & NAVEGAÇÃO POR TECLADO
  // =========================================================================

  function initHistoriaKeyboardNav() {
    if (window._historiaKeyboardActive) return;

    window.addEventListener("keydown", function(e) {
      ModalManager.handleKeyDown(e);
    });

    ModalManager.setupBackdropListeners();
    initEventDelegation();

    window._historiaKeyboardActive = true;
  }

  /**
   * Delegação de eventos globais para atributos data-*
   * Elimina a dependência obrigatória de inline onclicks.
   */
  function initEventDelegation() {
    if (window._historiaDelegationActive) return;

    document.addEventListener('click', function(e) {
      // 1. Alternância de Seções Editoriais
      const secBtn = e.target.closest('[data-historia-section]');
      if (secBtn) {
        const sec = secBtn.getAttribute('data-historia-section');
        if (sec && Historia) {
          Historia.switchSection(sec);
          return;
        }
      }

      // 2. Filtros de Região dos Bairros
      const regionBtn = e.target.closest('[data-region]');
      if (regionBtn) {
        const reg = regionBtn.getAttribute('data-region');
        if (reg && Historia) {
          Historia.filterBairrosByRegiao(reg);
          return;
        }
      }

      // 3. Sub-abas de Prefeitos / Pioneiros
      const prefTabBtn = e.target.closest('[data-prefeito-tab]');
      if (prefTabBtn) {
        const tab = prefTabBtn.getAttribute('data-prefeito-tab');
        if (tab && Historia) {
          Historia.switchPrefeitosSubTab(tab);
          return;
        }
      }

      // 4. Disparador de Dossiê de Evento
      const eventBtn = e.target.closest('[data-event-id]');
      if (eventBtn) {
        const evId = eventBtn.getAttribute('data-event-id');
        if (evId && Historia) {
          Historia.openEventoModal(evId);
          return;
        }
      }

      // Navegação pelas etapas leva ao card, sem abrir sua ficha.
      const etapaBtn = e.target.closest('[data-scroll-ciclo]');
      if (etapaBtn) {
        const bloco = document.getElementById('historia-ciclo-' + etapaBtn.getAttribute('data-scroll-ciclo'));
        if (bloco) bloco.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      // 5. Disparador de Marcos da Era
      const eraBtn = e.target.closest('[data-era-id]');
      if (eraBtn) {
        const eraId = eraBtn.getAttribute('data-era-id');
        if (eraId && Historia) {
          Historia.openCicloMarcosModal(eraId);
          return;
        }
      }

      // 6. Ações específicas
      const actionBtn = e.target.closest('[data-historia-action]');
      if (actionBtn) {
        const action = actionBtn.getAttribute('data-historia-action');
        if (action === 'open-porque-1767') {
          Historia.openPorQue1767Modal();
        } else if (action === 'close-porque-1767') {
          Historia.closePorQue1767Modal();
        } else if (action === 'close-dossie') {
          Historia.closeEventoModal();
        } else if (action === 'close-marcos-era') {
          Historia.closeCicloMarcosModal();
        } else if (action === 'restart-quiz') {
          Historia.restartQuizJoseensidade();
        } else if (action === 'submit-quiz') {
          Historia.submitQuizJoseensidade();
        } else if (action === 'open-lendas') {
          Historia.openLendas();
        } else if (action === 'close-lendas') {
          Historia.closeLendas();
        } else if (action === 'open-bibliografia') {
          Historia.openBibliografia();
        } else if (action === 'close-bibliografia') {
          Historia.closeBibliografia();
        }
      }
    });

    window._historiaDelegationActive = true;
  }

  // =========================================================================
  // 9. FUNÇÕES DE SUPORTE AOS FILTROS DO ACERVO DA SIDEBAR (LEGADO SEGURO)
  // =========================================================================

  function selectHistoriaEra(eraId) {
    historiaState.selectedEra = eraId || 'all';
    const eras = ['all', 'colonial', 'sanatorial', 'tecnologica', 'contemporanea'];
    eras.forEach(function(e) {
      const pill = document.getElementById('pill-era-' + e);
      if (pill) {
        if (e === historiaState.selectedEra) {
          pill.className = "w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all bg-[#0f2f52] text-white shadow-xs flex items-center justify-between cursor-pointer";
        } else {
          pill.className = "w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80 flex items-center justify-between cursor-pointer";
        }
      }
    });

    if (eraId && eraId !== 'all') {
      openCicloMarcosModal(eraId);
    }
  }

  function resetHistoriaFilters() {
    const searchInput = document.getElementById("historia-search-input");
    const evidenceSelect = document.getElementById("historia-evidence-select");
    if (searchInput) searchInput.value = "";
    if (evidenceSelect) evidenceSelect.value = "all";
    selectHistoriaEra('all');
    filterHistoriaEvents('');
  }

  function filterHistoriaEvents(query) {
    const searchInput = document.getElementById("historia-search-input");
    const q = (typeof query === 'string' ? query : (searchInput ? searchInput.value : '')).toLowerCase().trim();

    const cards = document.querySelectorAll('#ciclos-cards-container article');
    let matchedCards = 0;
    cards.forEach(function(card) {
      const text = card.textContent.toLowerCase();
      const matchesText = !q || text.includes(q);
      if (matchesText) {
        card.style.display = '';
        matchedCards++;
      } else {
        card.style.display = 'none';
      }
    });

    const countEl = document.getElementById('historia-filtered-records-count');
    if (countEl) {
      countEl.textContent = q ? String(matchedCards) : '5';
    }
  }

  function scrollHistoriaRiver(offset) {
    const river = document.getElementById('ciclos-cards-container') || document.getElementById('historia-horizontal-river');
    if (river) {
      river.scrollBy({ top: offset, left: offset, behavior: 'smooth' });
    } else {
      window.scrollBy({ top: offset, behavior: 'smooth' });
    }
  }

  // =========================================================================
  // 10. API PÚBLICA MODERNA (window.Historia) & ALIASES DE RETROCOMPATIBILIDADE
  // =========================================================================

  const Historia = {
    init: renderHistoriaDashboard,
    switchSection: switchHistoriaSection,
    selectEra: selectHistoriaEra,
    filterBairros: filterBairros,
    filterBairrosByRegiao: filterBairrosByRegiao,
    openEventoModal: openHistoriaEventoModal,
    closeEventoModal: closeHistoriaEventoModal,
    openCicloMarcosModal: openCicloMarcosModal,
    closeCicloMarcosModal: closeCicloMarcosModal,
    openPorQue1767Modal: openPorQue1767Modal,
    closePorQue1767Modal: closePorQue1767Modal,
    switchPrefeitosSubTab: switchPrefeitosSubTab,
    selectQuizAnswer: selectQuizAnswer,
    submitQuizJoseensidade: submitQuizJoseensidade,
    restartQuizJoseensidade: restartQuizJoseensidade,
    shareQuizResult: shareQuizResult,
    renderCiclosCards: renderCiclosCards,
    selectCiclo: selectCiclo,
    navigateCiclo: navigateCiclo,
    renderBairrosEditorial: renderBairrosEditorial,
    renderPatrimoniosEditorial: renderPatrimoniosEditorial,
    renderPioneirosEditorial: renderPioneirosEditorial,
    renderPrefeitosEditorial: renderPrefeitosEditorial,
    switchPrefeitosViewMode: switchPrefeitosViewMode,
    abrirCatalogoGeralDossie: abrirCatalogoGeralDossie,
    fecharPrefeitosDrawer: fecharPrefeitosDrawer,
    abrirPrefeitosDrawer: abrirPrefeitosDrawer,
    navigatePrefeito: navigatePrefeito,
    selectPrefeitoByIndex: selectPrefeitoByIndex,
    filtrarPrefeitosEra: filtrarPrefeitosEra,
    resetarPrefeitosFiltros: resetarPrefeitosFiltros,
    filtrarPrefeitosCategoria: filtrarPrefeitosCategoria,
    filtrarPrefeitosStatus: filtrarPrefeitosStatus,
    handlePrefeitosSearch: handlePrefeitosSearch,
    togglePrefeitosAccordion: togglePrefeitosAccordion,
    abrirRefPrefeitos: abrirRefPrefeitos,
    copiarReferenciaAbnt: copiarReferenciaAbnt,
    renderQuizJoseensidade: renderQuizJoseensidade,
    renderMigracaoJoseenses: renderMigracaoJoseenses,
    switchMigracaoStep: window.switchMigracaoStep,
    navigateMigracaoStep: window.navigateMigracaoStep,
    openBibliografia: openHistoriaBibliografia,
    closeBibliografia: closeHistoriaBibliografia,
    openLendas: openHistoriaLendas,
    closeLendas: closeHistoriaLendas,
    state: historiaState
  };

  // Exposição da API Canônica
  window.Historia = Historia;

  // =========================================================================
  // LEGACY API — manter temporariamente para 100% de compatibilidade retroativa
  // =========================================================================
  window.renderHistoriaDashboard = Historia.init;
  window.switchHistoriaSection = Historia.switchSection;
  window.selectHistoriaEra = Historia.selectEra;
  window.filterBairros = Historia.filterBairros;
  window.filterBairrosByRegiao = Historia.filterBairrosByRegiao;
  window.renderCiclosCards = Historia.renderCiclosCards;
  window.selectCiclo = Historia.selectCiclo;
  window.navigateCiclo = Historia.navigateCiclo;
  window.renderBairrosEditorial = Historia.renderBairrosEditorial;
  window.renderPatrimoniosEditorial = Historia.renderPatrimoniosEditorial;
  window.openHistoriaBibliografia = Historia.openBibliografia;
  window.closeHistoriaBibliografia = Historia.closeBibliografia;
  window.openHistoriaLendas = Historia.openLendas;
  window.closeHistoriaLendas = Historia.closeLendas;
  window.renderPioneirosEditorial = Historia.renderPioneirosEditorial;
  window.renderPrefeitosEditorial = Historia.renderPrefeitosEditorial;
  window.switchPrefeitosViewMode = Historia.switchPrefeitosViewMode;
  window.abrirCatalogoGeralDossie = Historia.abrirCatalogoGeralDossie;
  window.fecharPrefeitosDrawer = Historia.fecharPrefeitosDrawer;
  window.abrirPrefeitosDrawer = Historia.abrirPrefeitosDrawer;
  window.navigatePrefeito = Historia.navigatePrefeito;
  window.selectPrefeitoByIndex = Historia.selectPrefeitoByIndex;
  window.filtrarPrefeitosEra = Historia.filtrarPrefeitosEra;
  window.resetarPrefeitosFiltros = Historia.resetarPrefeitosFiltros;
  window.filtrarPrefeitosCategoria = Historia.filtrarPrefeitosCategoria;
  window.filtrarPrefeitosStatus = Historia.filtrarPrefeitosStatus;
  window.handlePrefeitosSearch = Historia.handlePrefeitosSearch;
  window.togglePrefeitosAccordion = Historia.togglePrefeitosAccordion;
  window.abrirRefPrefeitos = Historia.abrirRefPrefeitos;
  window.copiarReferenciaAbnt = Historia.copiarReferenciaAbnt;
  window.openCicloDossieModal = Historia.openCicloMarcosModal;
  window.openHistoriaEventoModal = Historia.openEventoModal;
  window.closeHistoriaEventoModal = Historia.closeEventoModal;
  window.openCicloMarcosModal = Historia.openCicloMarcosModal;
  window.closeCicloMarcosModal = Historia.closeCicloMarcosModal;
  window.openPorQue1767Modal = Historia.openPorQue1767Modal;
  window.closePorQue1767Modal = Historia.closePorQue1767Modal;
  window.switchPrefeitosSubTab = Historia.switchPrefeitosSubTab;
  window.selectQuizAnswer = Historia.selectQuizAnswer;
  window.submitQuizJoseensidade = Historia.submitQuizJoseensidade;
  window.restartQuizJoseensidade = Historia.restartQuizJoseensidade;
  window.renderQuizResult = renderQuizResult;
  window.shareQuizResult = Historia.shareQuizResult;
  window.renderQuizJoseensidade = Historia.renderQuizJoseensidade;
  window.renderMigracaoJoseenses = Historia.renderMigracaoJoseenses;
  window.switchMigracaoStep = Historia.switchMigracaoStep;
  window.navigateMigracaoStep = Historia.navigateMigracaoStep;
  window.resetHistoriaFilters = resetHistoriaFilters;
  window.filterHistoriaEvents = filterHistoriaEvents;
  window.scrollHistoriaRiver = scrollHistoriaRiver;
  window.initHistoriaKeyboardNav = initHistoriaKeyboardNav;

  // Navegação pelo teclado no Módulo de Prefeitos
  document.addEventListener('keydown', function(e) {
    const sec = document.getElementById("section-view-prefeitos");
    if (!sec || sec.classList.contains("hidden")) return;

    const drawer = document.getElementById("prefeitos-abnt-drawer");
    const isDrawerOpen = drawer && !drawer.classList.contains("invisible");

    if (e.key === 'Escape' && isDrawerOpen) {
      fecharPrefeitosDrawer();
      return;
    }

    if (isDrawerOpen) {
      if (e.key === 'ArrowLeft') {
        navigatePrefeito(-1);
      } else if (e.key === 'ArrowRight') {
        navigatePrefeito(1);
      }
      return;
    }

    // Se a gaveta estiver fechada e não estiver digitando em campo de texto
    const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
    if (activeTag === 'input' || activeTag === 'textarea') return;

    if (e.key === 'ArrowLeft') {
      navigatePrefeito(-1);
    } else if (e.key === 'ArrowRight') {
      navigatePrefeito(1);
    }
  });


  // =========================================================================
  // 11. INICIALIZAÇÃO AUTOMÁTICA SEGURA
  // =========================================================================

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      Historia.init();
    });
  } else {
    Historia.init();
  }

})();
