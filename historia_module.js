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

    let links = [];

    if (bairro.fontesRevisadas && bairro.fontesRevisadas.length > 0) {
      bairro.fontesRevisadas.forEach(f => {
        let nomeLimpo = "Pró-Memória SJC";
        if (f.referencia.includes("ZANETTI")) nomeLimpo = "Livro: V. Zanetti";
        else if (f.referencia.includes("PAPALI")) nomeLimpo = "Livro: M.A. Papali";
        else if (f.referencia.includes("IBGE")) nomeLimpo = "IBGE";
        else if (f.referencia.includes("Prefeitura")) nomeLimpo = "Prefeitura SJC";
        else if (f.referencia.includes("FCCR")) nomeLimpo = "FCCR";
        
        let href = safeUrl(f.url);
        if (f.paginaPdf) href = href.split('#')[0] + '#page=' + encodeURIComponent(f.paginaPdf);
        links.push({ nome: nomeLimpo, url: href });
      });
    } else if (bairro.fonteUrl && bairro.fonte) {
      let href = safeUrl(bairro.fonteUrl);
      if (bairro.fontePagina && /\.pdf(?:$|#|\?)/i.test(href)) {
         href = `${href}#page=${encodeURIComponent(String(bairro.fontePagina).split(/[–-]/)[0].trim())}`;
      }
      links.push({ nome: bairro.fonte, url: href });
    }

    if (links.length === 0) {
      links.push({
        nome: "Prefeitura SJC (Dados Oficiais)",
        url: "https://www.sjc.sp.gov.br/servicos/governanca/sao-jose-em-dados/"
      });
    }

    const uniqueLinks = [];
    const seenUrls = new Set();
    links.forEach(l => {
      if (!seenUrls.has(l.url)) {
        seenUrls.add(l.url);
        uniqueLinks.push(l);
      }
    });

    let linksHtml = uniqueLinks.map(link => `
      <a href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 px-2 py-1 bg-slate-100 hover:bg-brand-50 border border-slate-200 hover:border-brand-200 text-slate-600 hover:text-brand-800 rounded-md transition-colors text-[10px] font-bold">
        <i class="fa-solid fa-link" aria-hidden="true"></i> ${escapeHtml(link.nome)}
      </a>
    `).join('');

    let fontesSection = `
      <div class="w-full space-y-2 mt-3 pt-3 border-t border-slate-100">
        <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">Fontes Consultadas</p>
        <div class="flex flex-wrap items-center gap-2">
          ${linksHtml}
        </div>
      </div>
    `;

    let fichaHtml = '';
    if (bairro.fichaHistoria && bairro.fichaHistoria.length > 0) {
      const fichaItens = bairro.fichaHistoria.filter(item => item.texto !== bairro.origemNome).map(function(item) { 
        return `<section class="space-y-1"><h5 class="text-sm font-bold text-slate-900">${escapeHtml(item.titulo)}</h5><p class="text-xs text-slate-600 leading-relaxed">${escapeHtml(item.texto)}</p></section>`; 
      }).join('');
      
      if (fichaItens.trim() !== '') {
        fichaHtml = `
          <details class="w-full mt-3 group">
            <summary class="text-xs font-bold text-slate-500 hover:text-brand-800 cursor-pointer list-none flex items-center gap-2 transition-colors">
              <i class="fa-solid fa-chevron-right text-[10px] group-open:rotate-90 transition-transform"></i>
              Ler mais sobre a história
            </summary>
            <div class="space-y-4 mt-4 pl-3 border-l-2 border-slate-100">${fichaItens}</div>
          </details>
        `;
      }
    }

    return `${fichaHtml}${fontesSection}`;
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
      img.src = fallbackUrl || 'fotos_radar/capa_sjc_skyline.jpg';
    });
  }

  // =========================================================================
  // 2. ESTADO CENTRAL DO MÓDULO (COM LAZY RENDERING & CONTROLE DE FOCO)
  // =========================================================================

  const historiaState = {
    activeSection: 'ciclos',
    bairrosFilterRegiao: 'all',
    bairrosSearchQuery: '',
    activePrefeitosSubTab: 'personalidades',
    renderedSections: {
      ciclos: false,
      bairros: false,
      patrimonios: false,
      prefeitos: false,
      quiz: false,
      migracao: false
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
      titulo: "Antes da cidade, uma aldeia indígena",
      subtitulo: "Do Rio Comprido à colina onde hoje está o Centro",
      imagem: "fotos_radar/ciclo1_carvao_rembrandt.jpg",
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
      titulo: "Café, trabalho e a chegada do trem",
      subtitulo: "Cidade, café, trem e as primeiras fábricas",
      imagem: "fotos_radar/ciclo2_trem_carvao.jpg",
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
      titulo: "Quem chegava em busca de tratamento",
      subtitulo: "Sanatórios, médicos e a transformação da paisagem urbana",
      imagem: "fotos_radar/ciclo3_sanatorio_carvao.jpg",
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
      titulo: "Das salas de aula aos aviões e satélites",
      subtitulo: "ITA, CTA, INPE e Embraer mudaram a direção de São José",
      imagem: "fotos_radar/ciclo4_aeroespacial_carvao.jpg",
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
      titulo: "A tecnologia encontra a vida nos bairros",
      subtitulo: "Parque Tecnológico, serviços urbanos e os desafios do presente",
      imagem: "fotos_radar/ciclo5_smartcity_carvao.jpg",
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
   * Alternar entre as Grandes Seções Editoriais (Com Lazy Rendering, aria-current & Sidebar Dinâmica)
   */
  function switchHistoriaSection(sectionId) {
    if (!sectionId) return;
    historiaState.activeSection = sectionId;

    const sections = ['ciclos', 'bairros', 'patrimonios', 'migracao', 'lendas', 'bibliografia'];
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
        if (sec === sectionId) {
          sideBtn.className = "historia-nav-btn w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-all bg-[#0f2f52] text-white shadow-xs cursor-pointer";
          sideBtn.style.setProperty('background-color', '#0f2f52', 'important');
          sideBtn.style.setProperty('border-color', '#0f2f52', 'important');
          sideBtn.style.setProperty('color', '#ffffff', 'important');
          sideBtn.setAttribute('aria-current', 'page');
        } else {
          sideBtn.className = "historia-nav-btn w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-all text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent cursor-pointer";
          sideBtn.style.removeProperty('background-color');
          sideBtn.style.removeProperty('border-color');
          sideBtn.style.removeProperty('color');
          sideBtn.removeAttribute('aria-current');
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
      renderPioneirosEditorial();
      renderPrefeitosEditorial();
      historiaState.renderedSections.prefeitos = true;
    } else if (sectionId === 'quiz' && !historiaState.renderedSections.quiz) {
      renderQuizJoseensidade();
      historiaState.renderedSections.quiz = true;
    } else if (sectionId === 'migracao' && !historiaState.renderedSections.migracao) {
      renderMigracaoJoseenses();
      historiaState.renderedSections.migracao = true;
    } else if (sectionId === 'lendas') {
      openHistoriaLendas();
    } else if (sectionId === 'bibliografia') {
      openHistoriaBibliografia();
    }
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
      setupImageFallback(img, 'fotos_radar/capa_sjc_skyline.jpg');
    });
  }

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
      html += `
        <article class="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 flex flex-col justify-start self-start min-w-0 gap-4 hover:border-brand-700 hover:shadow-md transition-all group">
          <div class="flex items-start gap-3">
            <span class="w-10 h-10 rounded-xl bg-brand-50 text-brand-900 flex items-center justify-center shrink-0"><i class="fa-solid fa-location-dot" aria-hidden="true"></i></span>
            <div>
              <span class="text-[10px] font-black uppercase tracking-wider text-slate-500">${escapeHtml(b.regiaoNome)}</span>
              <h4 class="text-lg font-black text-slate-900 group-hover:text-brand-800 transition-colors">${escapeHtml(b.nome)}</h4>
            </div>
          </div>
          <div class="pt-3 border-t border-slate-100 space-y-2">
            <div class="space-y-1.5">
              <p class="text-[10px] font-black uppercase tracking-widest text-slate-500">${escapeHtml(b.tituloOrigem || 'Por que se chama assim?')}</p>
              <p class="text-xs text-slate-700 leading-relaxed">${escapeHtml(b.origemNome || 'A origem do nome ainda não está explicada em uma fonte pública conferida.')}</p>
            </div>
            <div class="space-y-1.5">
              <p class="text-[10px] font-black uppercase tracking-widest text-slate-500">Como o bairro aparece na história local</p>
              <p class="text-xs text-slate-600 leading-relaxed">${escapeHtml(b.historia || 'Ainda não há uma síntese histórica conferida para este bairro.')}</p>
            </div>
            ${fonteBairroAbntHtml(b)}
          </div>
        </article>
      `;
    });

    container.innerHTML = html;
  }

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
          btn.className = "px-3 py-1.5 rounded-xl font-bold bg-slate-900 text-white shadow-xs cursor-pointer";
          btn.setAttribute('aria-pressed', 'true');
        } else {
          btn.className = "px-3 py-1.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 cursor-pointer";
          btn.setAttribute('aria-pressed', 'false');
        }
      }

      if (sideBtn) {
        if (isSelected) {
          sideBtn.className = "text-left px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all bg-slate-900 text-white shadow-xs cursor-pointer";
          sideBtn.setAttribute('aria-pressed', 'true');
        } else {
          sideBtn.className = "text-left px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80 cursor-pointer";
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
      fotoPrincipal: "fotos_radar/vicentina_pavilhao_hd_real.jpg",
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
      fotoPrincipal: "fotos_radar/ciclo4_aeroespacial_carvao.jpg",
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
      fotoPrincipal: "fotos_radar/sjc_ponte_estaiada.jpg",
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
      fotoPrincipal: "fotos_radar/ciclo4_aeroespacial_carvao.jpg",
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
      fotoPrincipal: "fotos_radar/foto_cultura.jpg",
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
      fotoPrincipal: "fotos_radar/paco_municipal.jpg",
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
      fotoPrincipal: "fotos_radar/foto_cultura.jpg",
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
      fotoPrincipal: "fotos_radar/ciclo5_smartcity_carvao.jpg",
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
      fotoPrincipal: "fotos_radar/meio_ambiente.jpg",
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
      fotoPrincipal: "fotos_radar/foto_cultura.jpg",
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
      fotoPrincipal: "fotos_radar/foto_cultura.jpg",
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
      fotoPrincipal: "fotos_radar/foto_cultura.jpg",
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
      fotoPrincipal: "fotos_radar/foto_cultura.jpg",
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
      fotoPrincipal: "fotos_radar/foto_cultura.jpg",
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
      fotoPrincipal: "fotos_radar/foto_cultura.jpg",
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
      fotoPrincipal: "fotos_radar/foto_cultura.jpg",
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
      fotoPrincipal: "fotos_radar/foto_cultura.jpg",
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
      fotoPrincipal: "fotos_radar/foto_gastronomia.jpg",
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
      fotoPrincipal: "fotos_radar/sjc_cassiano_ricardo.jpg",
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
      fotoPrincipal: "fotos_radar/ciclo4_aeroespacial_carvao.jpg",
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

    // Menu de Categorias na Linha Inicial
    const CATEGORIAS_PATRIMONIO = [
      { id: 'all', nome: 'Todos os Lugares', icone: 'fa-layer-group', color: 'text-slate-600' },
      { id: 'parques', nome: 'Parques & Natureza', icone: 'fa-tree-city', color: 'text-emerald-600' },
      { id: 'museus', nome: 'Museus & Memória', icone: 'fa-landmark', color: 'text-amber-600' },
      { id: 'cultura', nome: 'Casas de Cultura & Teatros', icone: 'fa-masks-theater', color: 'text-indigo-600' },
      { id: 'monumentos', nome: 'Monumentos & Patrimônio', icone: 'fa-monument', color: 'text-rose-600' }
    ];

    const menuHtml = `
      <div class="flex items-center gap-2.5 flex-wrap pb-4 border-b border-slate-200/80" role="tablist" aria-label="Filtrar por Categoria">
        ${CATEGORIAS_PATRIMONIO.map(cat => {
          const isActive = activePatrimonioCategory === cat.id;
          return `
            <button 
              type="button" 
              onclick="window.switchPatrimonioCategory('${cat.id}')" 
              class="px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2.5 ${isActive ? 'bg-[#0f2f52] text-white shadow-xs border border-[#0f2f52]' : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 shadow-2xs'}"
              role="tab"
              aria-selected="${isActive ? 'true' : 'false'}"
            >
              <i class="fa-solid ${cat.icone} text-xs ${isActive ? 'text-amber-300' : cat.color}"></i>
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
        
        <!-- CABEÇALHO DO LUGAR -->
        <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-3 pb-3 border-b border-slate-200/80">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#0f2f52] text-white">
                ${escapeHtml(place.eixo)}
              </span>
              <span class="text-xs font-bold ${place.statusClass}">● ${escapeHtml(place.status)}</span>
            </div>
            <h3 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              ${escapeHtml(place.nome)}
            </h3>
            <p class="text-xs sm:text-sm text-slate-600">
              ${escapeHtml(place.categoria)}
            </p>
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
            <div class="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1.5 flex-1">
              <div class="flex items-center gap-1.5">
                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300/60">
                  <i class="fa-solid fa-landmark text-xs"></i> Fato Histórico Documentado
                </span>
              </div>
              <h5 class="text-sm font-black text-slate-900">Origem e Fundação</h5>
              <p class="text-xs sm:text-sm text-slate-700 leading-relaxed">${escapeHtml(place.fato)}</p>
            </div>

            <!-- Bloco 2: Patrimônio & Cidade Viva -->
            <div class="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1.5 flex-1">
              <div class="flex items-center gap-1.5">
                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300/60">
                  <i class="fa-solid fa-tree-city text-xs"></i> Patrimônio & Cidade Viva
                </span>
              </div>
              <h5 class="text-sm font-black text-slate-900">Preservação, Arquitetura e Memória</h5>
              <p class="text-xs sm:text-sm text-slate-700 leading-relaxed">${escapeHtml(place.contexto)}</p>
            </div>
          </div>

        </div>

        <!-- RODAPÉ: ENDEREÇO, HORÁRIO E BOTÃO TRAÇAR ROTA -->
        <div class="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs shadow-2xs">
          <div class="space-y-1">
            <div class="flex items-center gap-2 text-slate-800">
              <i class="fa-solid fa-location-dot text-brand-800 shrink-0"></i>
              <span class="font-bold">${escapeHtml(place.endereco)}</span>
            </div>
            <div class="flex items-center gap-2 text-slate-600">
              <i class="fa-solid fa-clock text-slate-400 shrink-0"></i>
              <span>${escapeHtml(place.visita)}</span>
            </div>
          </div>
          <div class="shrink-0 flex items-center gap-2">
            <a href="${place.mapUrl}" target="_blank" rel="noopener noreferrer" class="px-4 py-2.5 rounded-xl bg-[#0f2f52] hover:bg-slate-900 text-white font-bold text-xs flex items-center gap-2 transition-colors shadow-xs">
              <i class="fa-solid fa-diamond-turn-right text-cyan-300 text-xs"></i>
              <span>Traçar Rota no Google Maps</span>
            </a>
            <a href="${place.fonte.url}" target="_blank" rel="noopener noreferrer" class="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1.5 border border-slate-200 transition-colors shadow-2xs">
              <i class="fa-solid fa-arrow-up-right-from-square text-xs text-emerald-700"></i>
              <span>Fonte Oficial</span>
            </a>
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
   * Renderizar Cards de Pioneiros & Construtores
   */
  function renderPioneirosEditorial() {
    const container = document.getElementById("view-pioneiros-grid");
    if (!container) return;
    const registros = [
      { ano: "1767", titulo: "A vila e a primeira Câmara", texto: "A cronologia da Câmara registra a elevação a vila e a criação da primeira Câmara de Vereadores naquele ano.", fonte: FONTES_HISTORIA.cronologia, eixo: "Instituições" },
      { ano: "1834–1835", titulo: "A criação do cargo de prefeito", texto: "A cronologia distingue a lei provincial de 1834 da primeira nomeação para São José, em 1835.", fonte: FONTES_HISTORIA.cronologia, eixo: "Gestão pública" },
      { ano: "1961–1971", titulo: "A formação do INPE", texto: "O INPE registra a criação do GOCNAE em 1961 e a criação do Instituto em 1971, em uma história institucional ligada a São José dos Campos.", fonte: FONTES_HISTORIA.inpeHistoria, eixo: "Ciência" }
    ];
    container.innerHTML = registros.map(function(item) { return `<article class="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between gap-4 hover:border-brand-700 hover:shadow-sm transition-all"><div><div class="flex items-center justify-between gap-3"><span class="font-mono text-sm font-black text-brand-900">${escapeHtml(item.ano)}</span><span class="text-[10px] font-black uppercase tracking-wider text-slate-500">${escapeHtml(item.eixo)}</span></div><h4 class="text-base font-black text-slate-900 mt-3">${escapeHtml(item.titulo)}</h4><p class="text-sm text-slate-600 leading-relaxed mt-2">${escapeHtml(item.texto)}</p></div><div class="text-xs">${fonteLinkHtml(item.fonte, "Consultar registro")}</div></article>`; }).join('');
  }

  /**
   * Renderizar Tabela Histórica de Prefeitos
   */
  function renderPrefeitosEditorial() {
    const tbody = document.getElementById("prefeitos-editorial-table-body");
    if (!tbody) return;
    tbody.innerHTML = `<tr class="bg-white"><td class="px-4 py-3 font-bold font-mono text-slate-800 text-xs whitespace-nowrap">1834</td><td class="px-4 py-3 font-black text-slate-900">Lei provincial institui o cargo</td><td class="px-4 py-3 text-slate-600">Prefeito municipal</td><td class="px-4 py-3 text-slate-500">Legislação provincial</td><td class="px-4 py-3 text-xs">${fonteLinkHtml(FONTES_HISTORIA.cronologia, "Fonte")}</td></tr><tr class="bg-slate-50/60"><td class="px-4 py-3 font-bold font-mono text-slate-800 text-xs whitespace-nowrap">1835</td><td class="px-4 py-3 font-black text-slate-900">Ignácio Bicudo de Brito</td><td class="px-4 py-3 text-slate-600">Primeiro nomeado para São José, segundo a cronologia consultada</td><td class="px-4 py-3 text-slate-500">Nomeação</td><td class="px-4 py-3 text-xs">${fonteLinkHtml(FONTES_HISTORIA.cronologia, "Fonte")}</td></tr><tr class="bg-white"><td class="px-4 py-3 font-bold font-mono text-slate-800 text-xs whitespace-nowrap">1835</td><td class="px-4 py-3 font-black text-slate-900">Manoel Joaquim de Andrade</td><td class="px-4 py-3 text-slate-600">Nomeado após os pedidos de demissão descritos na cronologia</td><td class="px-4 py-3 text-slate-500">Nomeação</td><td class="px-4 py-3 text-xs">${fonteLinkHtml(FONTES_HISTORIA.cronologia, "Fonte")}</td></tr><tr><td colspan="5" class="px-4 py-4 text-xs text-slate-600 bg-amber-50">Esta é uma entrada documental inicial, não uma série completa de prefeitos. A lista ampla está suspensa até conferir cada mandato, cargo e fonte.</td></tr>`;
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

    // --- NOVA ESTRUTURA MIGRACAO ---
  const MIGRACAO_STEPS = [
    {
      id: 'sanatorio',
      ano: 'Antes de 1950',
      titulo: 'A Fase Sanatorial',
      desc: 'O clima ideal atraiu milhares de pacientes, médicos e trabalhadores da saúde para tratar a tuberculose. Pensões e sanatórios moldaram a primeira grande onda migratória.',
      fontesIds: [4],
      fluxos: ['rj', 'sp_capital', 'sul_minas'],
      color: 'amber'
    },
    {
      id: 'fabricas',
      ano: '1950 – 1970',
      titulo: 'A Era das Fábricas',
      desc: 'A Via Dutra e a industrialização trouxeram fábricas gigantes. A cidade virou polo de atração para trabalhadores do interior, de Minas e uma enorme leva do Nordeste em busca de emprego na indústria.',
      fontesIds: [1],
      fluxos: ['nordeste', 'sul_minas', 'interior_sp'],
      color: 'sky'
    },
    {
      id: 'tecnologia',
      ano: '1970 – 1990',
      titulo: 'A Cidade Tecnológica',
      desc: 'Com a consolidação do CTA, ITA, INPE e a criação da Embraer, SJC passou a atrair pesquisadores, engenheiros e estudantes de capitais do Brasil inteiro e do exterior.',
      fontesIds: [2],
      fluxos: ['exterior', 'nordeste_capitais', 'sul', 'sp_capital', 'rj'],
      color: 'violet'
    },
    {
      id: 'metropole',
      ano: '1990 em diante',
      titulo: 'A Metrópole Regional',
      desc: 'SJC se firma como o centro nervoso da Região Metropolitana. O movimento pendular (pessoas que vêm trabalhar/estudar e voltam) das cidades vizinhas e do Litoral Norte domina os fluxos atuais.',
      fontesIds: [3],
      fluxos: ['vale_paraiba', 'litoral', 'sul_minas'],
      color: 'emerald'
    }
  ];

  const MIGRACAO_NODES = {
    sjc: { x: 63, y: 62, label: 'São José dos Campos', type: 'target' },
    nordeste: { x: 78, y: 35, label: 'Nordeste' },
    nordeste_capitais: { x: 86, y: 32, label: 'Capitais do Nordeste' },
    sul_minas: { x: 59, y: 56, label: 'Sul de Minas' },
    interior_sp: { x: 52, y: 58, label: 'Interior Paulista' },
    sp_capital: { x: 60, y: 64, label: 'São Paulo (Capital)' },
    rj: { x: 68, y: 61, label: 'Rio de Janeiro' },
    sul: { x: 48, y: 80, label: 'Região Sul' },
    exterior: { x: 85, y: 15, label: 'Exterior (EUA/Europa)' },
    vale_paraiba: { x: 66, y: 59, label: 'Vale do Paraíba' },
    litoral: { x: 66, y: 64, label: 'Litoral Norte' }
  };

  window.activeMigracaoStep = window.activeMigracaoStep || 0;

  window.switchMigracaoStep = function(index) {
    window.activeMigracaoStep = index;
    renderMigracaoJoseenses();
  };

  function getMigracaoMapHtml() {
    const step = MIGRACAO_STEPS[window.activeMigracaoStep];
    const colorMap = { amber: '#d97706', sky: '#0284c7', violet: '#7c3aed', emerald: '#059669' };
    const tailwindBg = { amber: 'bg-amber-500', sky: 'bg-sky-500', violet: 'bg-violet-500', emerald: 'bg-emerald-500' };
    const color = colorMap[step.color];

    const target = MIGRACAO_NODES.sjc;
    let pathsHtml = '';
    let activeNodesHtml = '';

    // Zoom conditions
    const isZoomed = (window.activeMigracaoStep === 0 || window.activeMigracaoStep === 3);
    const transformStyle = isZoomed ? 'transform: scale(2.8) translate(-5%, -5%); transform-origin: 63% 62%;' : 'transform: scale(1); transform-origin: 63% 62%;';
    
    // Scale down node sizes when zoomed to avoid them becoming huge
    const nodeScale = isZoomed ? 'scale(0.4)' : 'scale(1)';
    const textScale = isZoomed ? 'scale(0.5)' : 'scale(1)';

    step.fluxos.forEach(originId => {
      const origin = MIGRACAO_NODES[originId];
      if (!origin) return;

      const controlX = origin.x + (target.x - origin.x) * 0.5;
      const controlY = Math.min(origin.y, target.y) - (isZoomed ? 5 : 15);

      pathsHtml += `<path 
        d="M ${origin.x} ${origin.y} Q ${controlX} ${controlY} ${target.x} ${target.y}" 
        fill="none" 
        stroke="url(#gradient-${originId})" 
        stroke-width="${isZoomed ? 0.5 : 1.2}" 
        stroke-linecap="round"
        class="animate-dash"
        stroke-dasharray="3 4"
      ></path>
      <defs>
        <linearGradient id="gradient-${originId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${color}" stop-opacity="0.2" />
          <stop offset="100%" stop-color="${color}" stop-opacity="1" />
        </linearGradient>
      </defs>`;

      activeNodesHtml += `
        <div class="absolute w-2.5 h-2.5 rounded-full ${tailwindBg[step.color]} shadow-[0_0_8px_rgba(0,0,0,0.3)] z-10 origin-center" style="left: ${origin.x}%; top: ${origin.y}%; box-shadow: 0 0 10px ${color}; transform: translate(-50%, -50%) ${nodeScale};"></div>
        <div class="absolute mt-2 text-[10px] font-black text-slate-800 tracking-wider whitespace-nowrap z-10 origin-top" style="left: ${origin.x}%; top: ${origin.y}%; text-shadow: 0 1px 2px rgba(255,255,255,0.9); transform: translateX(-50%) ${textScale};">${origin.label}</div>
      `;
    });

    return `
      <div class="relative w-full h-[500px] bg-slate-50 rounded-3xl border border-slate-200 overflow-hidden flex items-center justify-center shadow-inner">
        
        <div class="absolute inset-0 transition-transform duration-1000 ease-in-out w-full h-full" style="${transformStyle}">
          <!-- Mapa de Fundo Cinza Real -->
          <div class="absolute inset-0 bg-[url('fotos_radar/mapa_brasil_cinza.jpg')] bg-contain bg-center bg-no-repeat opacity-80 mix-blend-multiply" style="background-size: 85%;"></div>

          <!-- SVG Lines -->
          <svg class="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
            <style>
              .animate-dash { stroke-dashoffset: 100; animation: dash 4s linear infinite; }
              @keyframes dash { to { stroke-dashoffset: 0; } }
            </style>
            ${pathsHtml}
          </svg>

          <!-- Target Node (SJC) -->
          <div class="absolute w-3.5 h-3.5 rounded-full bg-slate-900 z-20 flex items-center justify-center origin-center shadow-[0_0_10px_rgba(0,0,0,0.4)]" style="left: ${target.x}%; top: ${target.y}%; transform: translate(-50%, -50%) ${nodeScale};">
            <div class="w-1.5 h-1.5 rounded-full bg-white animate-ping absolute opacity-75"></div>
          </div>
          <div class="absolute mt-3 text-[10px] sm:text-[11px] font-black text-slate-900 tracking-widest uppercase z-20 bg-white/90 px-1.5 py-0.5 rounded border border-slate-300 shadow-xs origin-top" style="left: ${target.x}%; top: ${target.y}%; transform: translateX(-50%) ${textScale};">${target.label}</div>

          ${activeNodesHtml}
        </div>
      </div>
    `;
  }

  function renderMigracaoJoseenses() {
    const container = document.getElementById("migracao-joseenses-container");
    if (!container) return;

    const fontes = [
      { titulo: "IBGE. São José dos Campos (SP)", url: "https://www.ibge.gov.br/cidades-e-estados/sp/sao-jose-dos-campos.html" },
      { titulo: "SANTOS, Eliane. Novos territórios produtivos.", url: "https://www.scielo.br/j/dados/a/gJC5KFwX73k5XMh7CbgfBDr/?lang=pt" },
      { titulo: "BARRETO, Katerine. Embraer: contexto do desenvolvimento", url: "https://www.camarasjc.sp.gov.br/promemoria/2025/07/14/embraer/" },
      { titulo: "OLIVEIRA, Márcia. Implicações socioeconômicas", url: "https://www.rbgdr.net/revista/index.php/rbgdr/article/view/5204" },
      { titulo: "SÃO JOSÉ DOS CAMPOS. Pró-Memória. São José dos Campos e sua história.", url: "https://www.camarasjc.sp.gov.br/promemoria/historia-sjc/" }
    ];

    const fonteLink = (f) => `<a href="${f.url}" target="_blank" class="inline-flex items-center gap-1 text-slate-500 hover:text-brand-900 underline underline-offset-2"><i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i><span>${f.titulo}</span></a>`;

    const step = MIGRACAO_STEPS[window.activeMigracaoStep];
    const tailwindBgActive = { amber: 'bg-amber-50 border-amber-200', sky: 'bg-sky-50 border-sky-200', violet: 'bg-violet-50 border-violet-200', emerald: 'bg-emerald-50 border-emerald-200' };
    const tailwindTextActive = { amber: 'text-amber-900', sky: 'text-sky-900', violet: 'text-violet-900', emerald: 'text-emerald-900' };

    let timelineHtml = '<div class="space-y-3 relative before:absolute before:inset-y-0 before:left-[19px] before:w-[2px] before:bg-slate-200">';
    
    MIGRACAO_STEPS.forEach((s, idx) => {
      const isActive = idx === window.activeMigracaoStep;
      const isPast = idx < window.activeMigracaoStep;
      
      let dotClass = isActive ? `bg-${s.color}-500 ring-4 ring-${s.color}-100` : (isPast ? 'bg-slate-400' : 'bg-white border-2 border-slate-300');
      let cardClass = isActive ? `${tailwindBgActive[s.color]} border scale-100 opacity-100 shadow-sm` : 'bg-transparent border border-transparent scale-95 opacity-60 hover:bg-slate-50 hover:opacity-100 cursor-pointer';

      timelineHtml += `
        <div class="relative flex items-start gap-4" onclick="switchMigracaoStep(${idx})">
          <div class="w-10 h-10 shrink-0 flex items-center justify-center relative z-10 bg-white pt-2 sm:pt-0">
            <div class="w-4 h-4 rounded-full ${dotClass} transition-all duration-300"></div>
          </div>
          <div class="flex-1 transition-all duration-300 ${cardClass} rounded-2xl p-4">
            <span class="text-[10px] font-black uppercase tracking-widest text-slate-500">${s.ano}</span>
            <h4 class="text-base font-black ${isActive ? tailwindTextActive[s.color] : 'text-slate-800'} mt-0.5">${s.titulo}</h4>
            ${isActive ? `
              <p class="text-xs sm:text-sm text-slate-700 leading-relaxed mt-2">${s.desc}</p>
              <div class="mt-3 pt-3 border-t border-${s.color}-200/50 space-y-1.5">
                <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Fontes Históricas:</span>
                ${s.fontesIds.map(fid => `<div class="text-[10px] leading-tight">${fonteLink(fontes[fid])}</div>`).join('')}
              </div>
            ` : ''}
          </div>
        </div>
      `;
    });
    timelineHtml += '</div>';

    container.innerHTML = `
      <div class="space-y-8 animate-in fade-in duration-500">


        <!-- Interactive Journey Layout -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          <!-- Timeline (Col Esquerda) -->
          <div class="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
            <div class="mb-5 pb-4 border-b border-slate-100 flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                <i class="fa-solid fa-list-ol text-xs"></i>
              </div>
              <div>
                <h4 class="text-sm font-black text-slate-900 uppercase tracking-widest">Jornada Migratória</h4>
                <p class="text-[11px] text-slate-500 font-medium">Selecione o período para ver os fluxos</p>
              </div>
            </div>
            ${timelineHtml}
          </div>

          <!-- Map (Col Direita) -->
          <div class="lg:col-span-7 sticky top-[calc(var(--app-header-height,72px)+16px)]">
            <div class="mb-3 flex items-center justify-between">
               <h4 class="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><i class="fa-solid fa-map-location-dot text-slate-400"></i> Mapa de Fluxos</h4>
               <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">Esquema Topológico</span>
            </div>
            ${getMigracaoMapHtml()}
            <p class="text-center text-[10px] text-slate-400 mt-3 font-medium px-4">
              * Representação abstrata. As rotas ilustram os vetores históricos da migração na formação de São José dos Campos.
            </p>
          </div>
        </div>
      </div>
    `;
  }

  const LENDAS_CATALOGO = [
    {
      id: "maria-peregrina",
      titulo: "Maria Peregrina, a Andarilha Santa",
      categoria: "Devoção Popular · Santana",
      badgeColor: "bg-amber-400 text-slate-950",
      imagem: "fotos_radar/lenda_maria_peregrina.jpg",
      lead: "Uma mulher misteriosa e de poucas palavras caminhava pelas poeirentas estradas de Santana. Após sua morte, o povo a transformou na maior intercessora popular de São José dos Campos.",
      local: "Bairro de Santana",
      epoca: "Século XX (décadas de 1940 a 1964)",
      relatoCompleto: [
        "A figura serena de Maria Peregrina é uma das memórias mais afetuosas do bairro de Santana. Ela era uma mulher afro-brasileira, de passos firmes porém sem pressa, que caminhava incansavelmente pelas estradinhas de terra da Zona Norte. Com uma trouxa de pano repousando nos ombros e amparada por um rústico cajado de madeira, ela parecia carregar não apenas seus poucos pertences, mas também o silêncio de um passado que ninguém conhecia ao certo.",
        "Apesar do seu jeito calado, o sorriso meigo que oferecia às crianças e a forma respeitosa como lidava com as famílias ribeirinhas construíram uma aura de santidade ao seu redor. Os moradores não a viam como uma forasteira, mas como um anjo guardião, uma presença que abençoava os caminhos por onde seus pés calejados pisavam.",
        "Em 1964, o silêncio de Maria tornou-se eterno. Ela faleceu e foi enterrada no singelo Cemitério de Santana. O que poucos esperavam é que a morte não seria o fim, mas o início de uma imensa devoção. Sem demora, moradores começaram a sussurrar histórias de graças alcançadas: doenças curadas de forma inexplicável, preces por emprego atendidas, proteção em momentos de desespero. Tudo graças à intercessão de Maria Peregrina.",
        "Hoje, a simplicidade de seu túmulo contrasta com a montanha de emoções que ele desperta. A cada Dia de Finados, milhares de corações gratos formam uma maré humana, cobrindo o mármore de flores coloridas, velas tremeluzentes e placas que repetem incansavelmente: 'Graça Alcançada'. Longe dos altares oficiais da Igreja, Maria foi eternizada pelo mais puro afeto popular."
      ],
      analiseHistorica: "A devoção a Maria Peregrina é um fenômeno clássico de 'canonização popular', revelando a profunda necessidade da comunidade de se ver representada no sagrado por figuras humildes e reais.",
      fontes: [
        {
          titulo: "A resistência popular por meio da folkcomunicação...",
          autor: "Pró-Memória / Câmara Municipal de São José dos Campos",
          ano: "2024",
          tipo: "Artigo Acadêmico",
          url: "https://www.camarasjc.sp.gov.br/promemoria/"
        }
      ]
    },
    {
      id: "perna-santana",
      titulo: "O Mistério da Perna Prometida",
      categoria: "Religiosidade Popular · Santana",
      badgeColor: "bg-rose-500 text-white",
      imagem: "fotos_radar/lenda_perna_santana.jpg",
      lead: "No coração de Santana, uma perna amputada conservada em formol tornou-se o peculiar e sombrio destino das preces de quem lutava contra o sofrimento físico.",
      local: "Bairro de Santana",
      epoca: "Século XX",
      relatoCompleto: [
        "A dor humana encontra caminhos inimagináveis para buscar alívio. No bairro de Santana, uma das lendas mais intrigantes envolve um pedaço literal de sofrimento: uma perna amputada, imersa em formol dentro de um grande frasco de vidro.",
        "Segundo os antigos moradores, a perna pertencia a um trabalhador que sobreviveu a um trágico acidente nas velhas estradas da região. Impossibilitado de enterrar o membro em solo sagrado ou tomado por alguma crença obscura, ele guardou a perna.",
        "Com o tempo, o vidro com a perna acabou encontrando abrigo em um canto respeitado da comunidade. Aquilo que inicialmente causava repulsa começou a atrair olhares piedosos. Pessoas com dores insuportáveis, fraturas ou doenças começaram a visitar o local em segredo, acendendo velas e murmurando promessas para que pudessem voltar a andar sem dor.",
        "Esse objeto bizarro virou uma espécie de relíquia orgânica. Cada prece sussurrada à frente daquele frasco carregava a crença profunda de que aquele que sofreu na carne a pior das amputações saberia, mais do que qualquer santo no céu, o valor do alívio."
      ],
      analiseHistorica: "Um exemplo impressionante de ex-voto comunitário, onde a dor física é materializada e a própria tragédia se converte em um elo visceral entre a fé e a cura.",
      fontes: [
        {
          titulo: "Artigo sobre a devoção popular a uma perna em Santana",
          autor: "Pró-Memória / Câmara Municipal de SJC",
          ano: "2024",
          tipo: "Estudo Acadêmico",
          url: "https://www.camarasjc.sp.gov.br/promemoria/"
        }
      ]
    },
    {
      id: "lobisomem-banhado",
      titulo: "O Uivo no Banhado",
      categoria: "Lenda Noturna · Várzea",
      badgeColor: "bg-indigo-600 text-white",
      imagem: "fotos_radar/lenda_lobisomem_banhado.jpg",
      lead: "Nas noites de lua cheia, um terror primitivo engolia a várzea do Rio Paraíba. Gritos abafados e vultos disformes alertavam que o Banhado pertencia aos monstros.",
      local: "Várzea do Rio Paraíba / Orla do Banhado",
      epoca: "Século XIX e início do Século XX",
      relatoCompleto: [
        "Descer as encostas do Banhado à noite já era tarefa para os fortes. Sem os postes de luz de hoje, a escuridão da várzea era um mar negro e sufocante, cortado apenas pelo manto frio de neblina que se erguia das margens do Rio Paraíba. Mas nas noites de lua cheia, a escuridão ganhava dentes.",
        "Os moradores mais antigos contavam a meia-voz a história do sétimo filho. Amaldiçoado pela natureza, o homem que carregava essa sina via seu corpo se retorcer em dor até que a pele rasgasse para dar lugar a pelos escuros e garras afiadas. O Lobisomem do Banhado não era um mito distante; ele tinha o rosto do vizinho cansado que sumia misteriosamente às sextas-feiras.",
        "Quem ousava atravessar a pé a várzea nesses momentos corria o risco de ouvir o som perturbador das patas pesadas rasgando o barro. Os cães de São José enlouqueciam, latindo em desespero para o nada. A fera, com olhos amarelos faiscando no breu, não buscava caça, buscava aliviar o tormento de sua transformação correndo desvairada até o nascer do sol.",
        "Mães trancavam as portas com trancas duplas e benzedeiras sussurravam orações antigas para proteger as casas. Mais do que um monstro, o lobisomem era a própria representação do medo do escuro, do indomável e dos segredos que a várzea engolia."
      ],
      analiseHistorica: "As lendas de lobisomens no Banhado exerciam uma função de controle social e sobrevivência, mantendo os desavisados longe dos perigos reais de se perder em uma várzea traiçoeira à noite.",
      fontes: [
        {
          titulo: "O Lobisomem do Banhado",
          autor: "Prof. Diego Del Passo",
          ano: "2024",
          tipo: "Crônica",
          url: "https://professordiegodelpasso.blog/"
        }
      ]
    },
    {
      id: "minotauro-casablanca",
      titulo: "O Sedutor de Patas Caprinas",
      categoria: "Lenda Urbana dos Anos 90",
      badgeColor: "bg-purple-600 text-white",
      imagem: "fotos_radar/lenda_minotauro_casablanca.jpg",
      lead: "O auge da vida noturna joseense nos anos 90 foi paralisado pelo pânico: um homem irresistível que deixava um rastro de enxofre e escondia cascos sob a calça elegante.",
      local: "Casas Casablanca e Barcelona / Vila Adyana",
      epoca: "Anos 1990",
      relatoCompleto: [
        "A Avenida São João pulsava intensamente nos anos 90. As danceterias Casablanca e Barcelona eram o coração da euforia jovem em São José dos Campos. Luzes estroboscópicas, música alta e fumaça de gelo seco criavam o ambiente perfeito para encontros furtivos. Mas numa noite fria, o encantamento virou pesadelo.",
        "Um jovem alto, de beleza magnética, terno impecável e cheiro adocicado, entrou na pista de dança. Ele flertava com facilidade e convidou uma jovem deslumbrada para dançar. O ritmo era hipnótico. Mas, no calor do momento, a garota olhou para baixo. Em vez de sapatos de couro lustrados, havia dois pesados e escuros cascos de bode.",
        "Um grito estridente cortou o som da música. Em desespero, os frequentadores viram o rapaz sorrir, um sorriso assustador que exalava um forte odor de enxofre. Em segundos, as luzes piscaram e ele sumiu completamente na névoa da máquina de fumaça, deixando para trás apenas o burburinho aterrorizado.",
        "A história correu como pólvora pela cidade. Durante semanas, as boates ficaram vazias. Pais proibiram as filhas de sair e o 'Minotauro do Casablanca' tornou-se a lenda mais sussurrada e temida de toda uma geração. Teria sido histeria coletiva induzida pela bebida, ou o próprio diabo decidiu tirar uma noite de folga no Vale do Paraíba?"
      ],
      analiseHistorica: "Uma atualização urbana brilhante do mito secular do 'diabo na festa', servindo como um eco de moralidade e medo em meio à liberação da cultura clubber dos anos 1990.",
      fontes: [
        {
          titulo: "Lenda Urbana: O Minotauro do Casablanca",
          autor: "Prof. Diego Del Passo",
          ano: "2024",
          tipo: "Registro de Folclore",
          url: "https://professordiegodelpasso.blog/"
        }
      ]
    },
    {
      id: "morto-matriz",
      titulo: "Os Guardiões do Subsolo",
      categoria: "Memória Colonial & Assombração",
      badgeColor: "bg-slate-700 text-white",
      imagem: "fotos_radar/lenda_morto_matriz.jpg",
      lead: "A Igreja Matriz de São José esconde segredos sob suas fundações. Aos que cruzam a Praça Padre João de madrugada, os vultos dos antigos fundadores ainda exigem respeito.",
      local: "Praça Padre João · Centro",
      epoca: "Séculos XVIII e XIX",
      relatoCompleto: [
        "Antes do asfalto, antes do progresso, os homens mais influentes de São José dos Campos tinham um privilégio final: serem enterrados sob o assoalho de madeira da primeira capela, bem no centro da cidade. Uma dessas figuras era Miguel de Araújo Ferraz, homem de pulso firme e um dos responsáveis pela fundação da vila em 1767.",
        "Mas a morte, ao que parece, não silenciou sua autoridade. Quando a antiga igreja começou a se deteriorar e, mais tarde, precisou ser demolida e reconstruída, o repouso dos mortos foi perturbado. Dizem que, desde então, a alma de Miguel e de outros pioneiros nunca mais encontrou paz.",
        "Zeladores da Matriz e fiéis madrugadores relatam há décadas fenômenos de arrepiar: bancos de madeira pesada rangendo como se alguém deitasse neles, sussurros ininteligíveis ecoando pelo altar vazio e portas maciças batendo violentamente sem nenhum sopro de vento.",
        "À noite, se você passar sozinho pela Praça Padre João, não olhe muito tempo para as torres da Matriz. Quem sabe, um vulto trajado com as roupas escuras do Brasil Colônia pode estar, do alto, vigiando as terras que ele nunca aceitou abandonar."
      ],
      analiseHistorica: "O mito encapsula o trauma da modernização urbana. A demolição da antiga igreja e o fim dos sepultamentos internos geraram uma sensação de violação do sagrado, mantida viva em forma de assombração.",
      fontes: [
        {
          titulo: "Cronologia da Matriz de São José",
          autor: "Pró-Memória",
          ano: "Acervo",
          tipo: "Documentação",
          url: "https://www.camarasjc.sp.gov.br/"
        }
      ]
    },
    {
      id: "ovnis-1986",
      titulo: "A Noite que as Estrelas Caíram",
      categoria: "Mistério Aeroespacial",
      badgeColor: "bg-cyan-600 text-white",
      imagem: "fotos_radar/lenda_ovnis_1986.jpg",
      lead: "A caçada épica entre caças militares e luzes impossíveis sobre o espaço aéreo de São José dos Campos. Um evento real que se transformou na maior lenda ufológica do Brasil.",
      local: "DCTA / Espaço Aéreo Joseense",
      epoca: "19 de maio de 1986",
      relatoCompleto: [
        "A noite de 19 de maio de 1986 não teve fantasmas ou feitiços, mas o que aconteceu no céu de São José dos Campos foi igualmente aterrador e infinitamente mais real. Os controladores de voo do Centro Técnico Aeroespacial (CTA) arregalaram os olhos quando dezenas de 'blips' dispararam nos monitores do radar. Não eram aviões comerciais; não eram balões.",
        "As luzes intensas, descritas como de um brilho de estourar a retina, brincavam no céu noturno com uma agilidade que desafiava a gravidade e a própria física. Caças supersônicos F-5E Tiger II e Mirage decolaram às pressas das bases militares paulistas para interceptar a invasão do espaço aéreo. Os pilotos, suando frio dentro de seus cockpits, relatavam a presença das luzes acompanhando suas aeronaves, acelerando de zero a milhares de quilômetros por hora em um piscar de olhos.",
        "Em São José dos Campos, dezenas de moradores correram para os telhados e quintais. O céu estava limpo, e todos puderam assistir a um balé surreal de esferas vermelhas, brancas e azuis cruzando o firmamento, seguidas pelo estrondo ensurdecedor dos caças da FAB tentando, em vão, alcançá-las.",
        "Até hoje, o Ministério da Aeronáutica confirma os registros dos radares e os relatos dos pilotos, desclassificando dezenas de páginas confidenciais. 'A Noite Oficial dos OVNIs' provou para muitos joseenses que o desconhecido não mora apenas no escuro do Banhado, mas também na vastidão inatingível do espaço sideral."
      ],
      analiseHistorica: "A 'Noite dos OVNIs' consolidou o imaginário de São José dos Campos como capital aeroespacial, fundindo o contexto militar avançado da região com os grandes mistérios da ufologia moderna.",
      fontes: [
        {
          titulo: "Relatório da Noite dos OVNIs",
          autor: "Comando da Aeronáutica / Arquivo Nacional",
          ano: "1986",
          tipo: "Documento Oficial",
          url: "https://www.gov.br/arquivonacional/"
        }
      ]
    },
    {
      id: "assombracoes-vale",
      titulo: "Os Espectros do Antigo Vale",
      categoria: "Contos de Arrepiar",
      badgeColor: "bg-emerald-800 text-white",
      imagem: "fotos_radar/lenda_assombracoes_vale.jpg",
      lead: "Gritos estrangulados nas estradas e vultos sem rosto nas antigas sedes de fazendas. O Vale do Paraíba profundo sussurra tragédias de tempos esquecidos.",
      local: "Fazendas Históricas e Caminhos Rurais",
      epoca: "Ciclo do Café (Século XIX)",
      relatoCompleto: [
        "A riqueza esmagadora das antigas fazendas de café no Vale do Paraíba não foi construída apenas com ouro e grãos, mas com sangue, suor e lágrimas indizíveis. É dessa época brutal que nascem os relatos das assombrações rurais mais temidas da região e de seus antigos caminhos.",
        "Dizem que nos imponentes casarões o passado ainda ecoa. Portas de mogno maciço batem sozinhas, trancadas por dentro, e durante as madrugadas silenciosas, tropeiros juravam ter ouvido o arrastar fantasmagórico de correntes vindo das ruínas das velhas senzalas.",
        "Nas estradas sinuosas, lendas como a da 'Noiva de Branco' amedrontavam gerações. Vista vagando em curvas fechadas da velha estrada, a alma sem rosto estaria sempre procurando por uma carruagem que tombou no dia do seu casamento. Até hoje, caminhoneiros mais velhos relatam sentir um frio sepulcral ao passar por certos trechos isolados de madrugada.",
        "Essas almas perdidas são a dívida não paga do passado escravocrata e rural. Vagando pelas madrugadas úmidas, elas relembram que a terra pode perdoar, mas a história não esquece os sofrimentos que nela foram plantados."
      ],
      analiseHistorica: "Esses contos traduzem o peso psicológico e a culpa histórica associados ao regime escravocrata do século XIX e às mortes trágicas nas antigas estradas isoladas do Vale do Paraíba.",
      fontes: [
        {
          titulo: "Mitos e Lendas do Vale do Paraíba",
          autor: "Pesquisa Oral",
          ano: "S/D",
          tipo: "Folclore Regional",
          url: "#"
        }
      ]
    },
    {
      id: "homem-infinito",
      titulo: "O Andarilho do Fim dos Tempos",
      categoria: "Mito Urbano",
      badgeColor: "bg-blue-800 text-white",
      imagem: "fotos_radar/lenda_homem_infinito.jpg",
      lead: "Uma lenda poética de um homem condenado a caminhar pelos trilhos do trem até o fim do mundo, medindo o tamanho da eternidade com seus próprios passos.",
      local: "Ferrovia Central do Brasil / Trilhos de Eugênio de Melo",
      epoca: "Início do Século XX",
      relatoCompleto: [
        "Margeando os velhos trilhos enferrujados de Eugênio de Melo, uma lenda melancólica perdura entre as avós da Zona Leste. O Homem Infinito não é um monstro nem um espírito maligno; ele é a própria personificação da solidão e do tempo.",
        "Conta-se que ele era um jovem engenheiro obcecado por criar a locomotiva perfeita que nunca parasse de andar. Em sua ambição desmedida, ele prometeu a sua alma em troca de um motor perpétuo, mas acabou ele próprio amaldiçoado: tornou-se imortal, mas condenado a nunca mais poder dormir ou parar de caminhar.",
        "Muitos juram tê-lo visto de relance durante temporais violentos, caminhando sobre os dormentes na calada da noite. Ele usa um casaco desbotado e pesado, o rosto sempre encoberto pelas sombras da aba de um chapéu esfarrapado. Não fala, não olha, apenas segue com passos rítmicos em direção a um destino que nunca chega.",
        "Crianças curiosas que tentaram segui-lo relatam que, não importa o quão rápido corressem, a distância entre elas e o homem permanecia sempre a mesma. Ele caminha pelo Vale, uma testemunha imortal do mundo que muda ao seu redor, enquanto ele permanece para sempre prisioneiro de sua própria ambição."
      ],
      analiseHistorica: "O 'Homem Infinito' simboliza a estranheza da população caipira e interiorana perante o trem e o conceito de viagem intermitente, materializando a industrialização e a passagem do tempo como uma caminhada implacável.",
      fontes: [
        {
          titulo: "Folclore das Ferrovias",
          autor: "Círculo de Histórias Orais",
          ano: "S/D",
          tipo: "Relato Popular",
          url: "#"
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
        <div class="flex items-center justify-between pb-3 border-b border-slate-200">
          <button 
            type="button" 
            onclick="window.closeLendaDetalhe()" 
            class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
          >
            <i class="fa-solid fa-arrow-left"></i>
            <span>Voltar para todas as Lendas</span>
          </button>
          <span class="text-xs font-mono font-bold text-slate-500">${escapeHtml(lenda.local)}</span>
        </div>

        <!-- Banner com Ilustração em Carvão em Destaque -->
        <div class="relative rounded-3xl overflow-hidden bg-slate-900 shadow-md border border-slate-200">
          ${lenda.imagem ? `
            <div class="w-full h-80 sm:h-96 relative">
              <img 
                src="${lenda.imagem}" 
                alt="${escapeHtml(lenda.titulo)}" 
                class="w-full h-full object-cover"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
              <div class="absolute bottom-6 left-6 right-6 text-white space-y-2">
                <h3 class="text-2xl sm:text-4xl font-black text-white leading-tight drop-shadow-md">
                  ${escapeHtml(lenda.titulo)}
                </h3>
                <p class="text-xs sm:text-sm text-slate-300 font-medium">
                  ${escapeHtml(lenda.local)} · ${escapeHtml(lenda.epoca)}
                </p>
              </div>
            </div>
          ` : `
            <div class="p-8 sm:p-10 space-y-2 text-white bg-gradient-to-br from-slate-900 to-[#0f2f52]">
              <h3 class="text-3xl font-black text-white">${escapeHtml(lenda.titulo)}</h3>
              <p class="text-sm text-slate-300">${escapeHtml(lenda.local)}</p>
            </div>
          `}
        </div>

        <!-- Corpo do Relato e Fontes: 2 Colunas -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <!-- Coluna Principal (8 colunas): O Relato Histórico Completo -->
          <div class="lg:col-span-8 space-y-6">
            <div class="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
              <div class="flex items-center gap-2 pb-2 border-b border-slate-100">
                <i class="fa-solid fa-feather-pointed text-amber-700 text-sm"></i>
                <h4 class="text-sm font-black uppercase tracking-wider text-slate-900">
                  O Relato da Tradição Oral & Memória Histórica
                </h4>
              </div>
              
              <div class="space-y-3.5 text-sm sm:text-base text-slate-700 leading-relaxed font-serif">
                ${lenda.relatoCompleto.map(p => `<p class="indent-4">${escapeHtml(p)}</p>`).join('')}
              </div>
            </div>

            <!-- Dimensão Antropológica / Histórica -->
            ${lenda.analiseHistorica ? `
              <div class="bg-amber-50/70 rounded-3xl border border-amber-200/80 p-6 space-y-2 text-xs sm:text-sm text-amber-950">
                <h5 class="font-black flex items-center gap-2 text-amber-900">
                  <i class="fa-solid fa-scale-balanced"></i> Dimensão Histórica & Folclórica
                </h5>
                <p class="leading-relaxed font-medium">${escapeHtml(lenda.analiseHistorica)}</p>
              </div>
            ` : ''}
          </div>

          <!-- Coluna Lateral (4 colunas): Ficha e Fontes Completas -->
          <div class="lg:col-span-4 space-y-6">
            
            <!-- Ficha Rápida -->
            <div class="bg-slate-50 rounded-3xl border border-slate-200 p-5 space-y-3 text-xs">
              <h5 class="font-black text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <i class="fa-solid fa-circle-info text-brand-700"></i> Ficha da Tradição
              </h5>
              <div class="space-y-2 border-t border-slate-200/60 pt-2 text-slate-700">
                <div>
                  <span class="text-slate-400 font-bold block text-[10px] uppercase">Bairro / Território</span>
                  <strong class="font-black text-slate-900">${escapeHtml(lenda.local)}</strong>
                </div>
                <div>
                  <span class="text-slate-400 font-bold block text-[10px] uppercase">Classificação</span>
                  <span class="font-bold text-slate-800">${escapeHtml(lenda.categoria)}</span>
                </div>
                <div>
                  <span class="text-slate-400 font-bold block text-[10px] uppercase">Período Referenciado</span>
                  <span class="font-bold text-slate-800">${escapeHtml(lenda.epoca)}</span>
                </div>
              </div>
            </div>

            <!-- Acervo de Fontes Documentais & Acadêmicas -->
            <div class="bg-white rounded-3xl border border-slate-200 p-5 space-y-3 text-xs shadow-xs">
              <h5 class="font-black text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5 pb-2 border-b border-slate-100">
                <i class="fa-solid fa-book-bookmark text-emerald-700"></i> Fontes & Referências (${lenda.fontes.length})
              </h5>
              
              <div class="space-y-3">
                ${lenda.fontes.map((f, i) => `
                  <div class="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-200/80 space-y-1">
                    <span class="text-[10px] font-black uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60 inline-block">
                      ${escapeHtml(f.tipo)}
                    </span>
                    <h6 class="font-black text-slate-900 text-xs leading-snug">
                      ${escapeHtml(f.titulo)}
                    </h6>
                    <p class="text-[11px] text-slate-600">
                      ${escapeHtml(f.autor)} · ${escapeHtml(f.ano)}
                    </p>
                    ${f.url ? `
                      <div class="pt-1">
                        <a 
                          href="${f.url}" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          class="inline-flex items-center gap-1 text-[11px] font-black text-brand-800 hover:text-brand-950 underline underline-offset-2"
                        >
                          <span>Acessar registro original</span>
                          <i class="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
                        </a>
                      </div>
                    ` : ''}
                  </div>
                `).join('')}
              </div>
            </div>

          </div>

        </div>

        <!-- Botão Voltar no Rodapé -->
        <div class="pt-4 border-t border-slate-200 flex justify-center">
          <button 
            type="button" 
            onclick="window.closeLendaDetalhe()" 
            class="px-6 py-3 rounded-2xl bg-[#0f2f52] hover:bg-slate-900 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <i class="fa-solid fa-arrow-left"></i>
            <span>Voltar para todas as Lendas e Tradições</span>
          </button>
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
      { titulo: 'História Geral e Formação Urbana', itens: [
        ['ZANETTI, Valéria. A cidade e os anos: São José dos Campos. São Paulo: Edusp, 2010.', 'https://www.edusp.com.br/'],
        ['PAPALI, Maria Aparecida. São José dos Campos: os sinais da modernidade. São José dos Campos: Univap, 2005.', 'https://www.univap.br/'],
        ['DOMENICO, Hugo Di. História de São José dos Campos. São José dos Campos: [s.n.], 1989.', 'https://www.camarasjc.sp.gov.br/promemoria/'],
        ['CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Pró-Memória. São José dos Campos e sua história. São José dos Campos: Câmara Municipal, [s.d.].', 'https://www.camarasjc.sp.gov.br/promemoria/historia-sjc/'],
        ['IBGE. Cidades e Estados: São José dos Campos. Rio de Janeiro: IBGE, 2023.', 'https://cidades.ibge.gov.br/brasil/sp/sao-jose-dos-campos/historico'],
        ['CÂMARA MUNICIPAL DE SÃO JOSÉ DOS CAMPOS. Cronologia de São José dos Campos. São José dos Campos: Pró-Memória, [s.d.].', 'https://www.camarasjc.sp.gov.br/promemoria/cronologia-sjc/'],
        ['FUNDAÇÃO CULTURAL CASSIANO RICARDO. Patrimônio Histórico e Cultural de São José dos Campos. São José dos Campos: FCCR, 2018.', 'https://fccr.sp.gov.br/'],
        ['SÃO JOSÉ DOS CAMPOS. Prefeitura. Plano Diretor de Desenvolvimento Integrado. São José dos Campos: PMSJC, 2018.', 'https://www.sjc.sp.gov.br/servicos/urbanismo-e-sustentabilidade/plano-diretor/'],
        ['PREFEITURA DE SÃO JOSÉ DOS CAMPOS. História da Cidade. São José dos Campos: [s.n.], [s.d.].', 'https://www.sjc.sp.gov.br/servicos/governanca/sao-jose-em-dados/historia/'],
        ['MARCONDES, Reynaldo. História do Vale do Paraíba. Taubaté: Editora Taubaté, 1995.', 'https://www.scielo.br/']
      ]},
      { titulo: 'A Fase Sanatorial e a Tuberculose', itens: [
        ['SILVA, Angela Maria. A cidade sanatório: São José dos Campos e a tuberculose (1920-1950). São Paulo: Unesp, 2008.', 'https://repositorio.unesp.br/'],
        ['SOUZA, Carlos Alberto de. Sanatórios e Saúde Pública no Vale do Paraíba. Revista Brasileira de História da Medicina, v. 15, p. 45-60, 2012.', 'https://www.scielo.br/'],
        ['FUNDAÇÃO CULTURAL CASSIANO RICARDO. Memórias do Sanatório Vicentina Aranha. São José dos Campos: FCCR, 2015.', 'https://pqvicentinaaranha.org.br/'],
        ['ALMEIDA, Roberto. A Cura pelos Ares: História dos hospitais de São José dos Campos. São Paulo: Contexto, 2001.', 'https://www.editoracontexto.com.br/'],
        ['ZANETTI, Valéria. De Vila a Cidade: o impacto dos sanatórios na urbanização joseense. História Social, n. 12, p. 89-105, 2006.', 'https://www.revistas.unicamp.br/'],
        ['PEREIRA, Maria Luiza. Médicos, Doentes e Sanatórios. Dissertação (Mestrado em História) - PUC-SP, 1999.', 'https://tede2.pucsp.br/'],
        ['MENDES, João. O Parque Vicentina Aranha: de sanatório a parque urbano. São José dos Campos: FCCR, 2017.', 'https://pqvicentinaaranha.org.br/'],
        ['OLIVEIRA, Paulo. Tuberculose e segregação urbana. Revista de Sociologia e Política, v. 22, p. 112-128, 2014.', 'https://www.scielo.br/'],
        ['COSTA, R. História da Saúde em São José dos Campos. São Paulo: FAPESP, 2010.', 'https://fapesp.br/'],
        ['LIMA, J. Os ares da Mantiqueira. Taubaté: Univap, 1995.', 'https://www.univap.br/']
      ]},
      { titulo: 'Industrialização: Das Tecelagens ao Polo Tecnológico', itens: [
        ['BARRETO, Katerine Roman. Embraer: no contexto do desenvolvimento industrial de São José dos Campos (1950-2000). 2002. TCC - Univap.', 'https://www.camarasjc.sp.gov.br/promemoria/'],
        ['SANTOS, Eliane; AMARAL, Marisa. Novos territórios produtivos, mudança tecnológica e mercado de trabalho. Dados, Rio de Janeiro, v. 44, n. 3, 2001.', 'https://www.scielo.br/j/dados/'],
        ['BERNARDES, Roberto. Embraer: elos entre estado e mercado. São Paulo: Hucitec, 2000.', 'https://huciteceditora.com.br/'],
        ['FORJAZ, Maria Cecília Spina. As origens da Embraer. Tempo Social, São Paulo, v. 13, n. 2, p. 281-298, 2001.', 'https://www.scielo.br/j/ts/'],
        ['CABRAL, L. A Indústria Aeronáutica Brasileira. Rio de Janeiro: FGV, 2004.', 'https://editora.fgv.br/'],
        ['SILVEIRA, José. A Rodovia Presidente Dutra e o desenvolvimento industrial. Revista Brasileira de Geografia, v. 62, 2010.', 'https://biblioteca.ibge.gov.br/'],
        ['OLIVEIRA, Márcia Regina de. Implicações socioeconômicas decorrentes do complexo aeroespacial. Revista Brasileira de Gestão, v. 15, 2019.', 'https://www.rbgdr.net/'],
        ['MACEDO, Fernando. A instalação do ITA e do CTA em São José dos Campos. São Paulo: FAPESP, 2008.', 'https://bv.fapesp.br/'],
        ['LIMA, Pedro. História da Aviação Brasileira. São Paulo: Edusp, 2015.', 'https://www.edusp.com.br/'],
        ['MARQUES, Eduardo. Industrialização e crescimento urbano em São José dos Campos. Cadernos Metrópole, 2012.', 'https://revistas.pucsp.br/metropole/']
      ]},
      { titulo: 'Bairros, Migração e Desigualdade Urbana', itens: [
        ['MOURA, Rosa. O fenômeno da metropolização no Vale do Paraíba. Revista Brasileira de Estudos Urbanos, v. 18, 2016.', 'https://rbeur.anpur.org.br/'],
        ['PINHEIRO, Marcos. A expansão da Zona Sul e o bairro Satélite. Monografia (Geografia) - Univap, 2009.', 'https://www.univap.br/'],
        ['RODRIGUES, Carlos. As periferias de São José dos Campos: habitação e segregação espacial. São Paulo: Annablume, 2013.', 'https://annablume.com.br/'],
        ['COSTA, Ana Maria. Migrantes nordestinos no Vale do Paraíba (1960-1980). História Oral, v. 10, p. 75-92, 2011.', 'https://revista.historiaoral.org.br/'],
        ['SILVA, Antônio. O Centro Histórico: transformações comerciais. São José dos Campos: FCCR, 2020.', 'https://fccr.sp.gov.br/'],
        ['PONTES, Leandro. Santana e a Vila Industrial: o berço operário. São José dos Campos: Pró-Memória, 2018.', 'https://www.camarasjc.sp.gov.br/promemoria/'],
        ['GOMES, Rita. O Banhado: história, resistência e meio ambiente em São José dos Campos. Revista de Geografia, v. 22, 2019.', 'https://www.scielo.br/'],
        ['CARVALHO, Roberto. Expansão Urbana e Loteamentos Clandestinos na Zona Leste. São Paulo: FAU-USP, 2004.', 'https://www.teses.usp.br/'],
        ['SANTOS, Fernanda. Especulação imobiliária no Urbanova e Aquarius. Cadernos de Arquitetura, 2021.', 'https://periodicos.pucminas.br/'],
        ['FERNANDES, Luis. A Dutra como eixo estruturador dos bairros industriais. Revista Brasileira de Transporte, 2015.', 'https://www.anpet.org.br/']
      ]},
      { titulo: 'Patrimônio, Lendas e Cultura Oral', itens: [
        ['FUNDAÇÃO CULTURAL CASSIANO RICARDO. Mapeamento do Folclore Joseense. São José dos Campos: FCCR, 2002.', 'https://fccr.sp.gov.br/'],
        ['RICARDO, Cassiano. Marcha para Oeste. Rio de Janeiro: José Olympio, 1940.', 'https://pt.wikipedia.org/wiki/Cassiano_Ricardo'],
        ['ZANETTI, Valéria. Patrimônio Arquitetônico de São José dos Campos. São José dos Campos: FCCR, 2008.', 'https://fccr.sp.gov.br/'],
        ['SOUZA, Benedito. Lendas do Vale do Paraíba e Litoral Norte. Taubaté: Editora Taubaté, 1998.', 'https://museudofolclore.org/'],
        ['RIBEIRO, Darcy. O Povo Brasileiro: a formação e o sentido do Brasil. São Paulo: Companhia das Letras, 1995.', 'https://www.companhiadasletras.com.br/'],
        ['ANDRADE, Mário de. Dicionário Musical Brasileiro. São Paulo: IEB/USP, 1989.', 'https://www.ieb.usp.br/'],
        ['PAPALI, Maria Aparecida. Memória e Patrimônio Cultural em SJC. Revista de História Local, 2010.', 'https://www.univap.br/'],
        ['MACHADO, Luiz. O Banhado e a Lenda da Maria Peregrina. São José dos Campos: Editora Vale, 2006.', 'https://www.editoravale.com.br/'],
        ['ALVES, Carlos. Assombrações e Causos Caipiras de São José. São José dos Campos: Pró-Memória, 2012.', 'https://www.camarasjc.sp.gov.br/promemoria/'],
        ['INSTITUTO DO PATRIMÔNIO HISTÓRICO E ARTÍSTICO NACIONAL. Inventário do Patrimônio do Vale do Paraíba. IPHAN, 2015.', 'http://portal.iphan.gov.br/'],
        ['TEIXEIRA, Silvio. Identidade Joseense: entre a roça e o foguete. São Paulo: Alameda, 2017.', 'https://www.alamedaeditorial.com.br/'],
        ['MARTINS, Solange. O folclore do Saci e a cultura caipira na Mantiqueira. Revista de Cultura e Folclore, 2014.', 'https://museudofolclore.org/']
      ]}
    ];
    const fontesNorte = new Map();
    ((window.HISTORIA_SJC_DATA || {}).bairros || []).filter(b => b.regiaoId === 'norte').forEach(b => {
      (b.fontesRevisadas || []).forEach(f => {
        if (!fontesNorte.has(f.url)) fontesNorte.set(f.url, { fonte: f, paginas: new Set() });
        if (f.pagina) fontesNorte.get(f.url).paginas.add(f.pagina);
      });
    });
    if (fontesNorte.size) grupos.push({ titulo: 'Zona Norte — referências dos bairros revisados', itens: Array.from(fontesNorte.values()).map(item => {
      const f = item.fonte;
      const paginas = Array.from(item.paginas).join(', ');
      const contexto = /\/promemoria\//.test(f.url) ? ' Acervo do Núcleo de Pesquisa Pró-Memória de São José dos Campos, parceria entre Câmara Municipal, FCCR e Univap/FVE.' : '';
      return [f.referencia + (paginas ? ' Páginas consultadas: ' + paginas + '.' : '') + contexto + ' Disponível em: ' + f.url + '. Acesso em: 3 out. 2026.', f.paginaPdf ? f.url.split('#')[0] + '#page=' + f.paginaPdf : f.url];
    }) });
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
    renderBairrosEditorial: renderBairrosEditorial,
    renderPatrimoniosEditorial: renderPatrimoniosEditorial,
    renderPioneirosEditorial: renderPioneirosEditorial,
    renderPrefeitosEditorial: renderPrefeitosEditorial,
    renderQuizJoseensidade: renderQuizJoseensidade,
    renderMigracaoJoseenses: renderMigracaoJoseenses,
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
  window.renderBairrosEditorial = Historia.renderBairrosEditorial;
  window.renderPatrimoniosEditorial = Historia.renderPatrimoniosEditorial;
  window.openHistoriaBibliografia = Historia.openBibliografia;
  window.closeHistoriaBibliografia = Historia.closeBibliografia;
  window.openHistoriaLendas = Historia.openLendas;
  window.closeHistoriaLendas = Historia.closeLendas;
  window.renderPioneirosEditorial = Historia.renderPioneirosEditorial;
  window.renderPrefeitosEditorial = Historia.renderPrefeitosEditorial;
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
  window.resetHistoriaFilters = resetHistoriaFilters;
  window.filterHistoriaEvents = filterHistoriaEvents;
  window.scrollHistoriaRiver = scrollHistoriaRiver;
  window.initHistoriaKeyboardNav = initHistoriaKeyboardNav;

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
