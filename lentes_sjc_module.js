/**
 * Radar São José — Módulo Lentes SJC (Acervo Visual Aberto)
 * Fotografias autorais de São José dos Campos (André Paixão Studio 8)
 * 
 * Funcionalidades:
 * - Fotos curadas com destaques do Anel Viário no topo e temas balanceados
 * - Filtros por categoria em ordem alfabética rigorosa
 * - Índice completo de fotos A-Z na barra lateral com acesso direto
 * - Busca com normalização de acentos (diacríticos) e suporte a nome de arquivo/ID
 * - Lightbox modal com zoom, detalhes, download em alta resolução e acessibilidade (A11y)
 * - Cópia de crédito com feedback protegido contra cliques repetidos
 * - Download em lote compactado (.ZIP) com JSZip & FileSaver e prevenção de concorrência
 * - Empty state visual acolhedor
 */

(function () {
  "use strict";

  // 1. Acervo com 34 fotos únicas (duplicatas e descartes removidos), Anel Viário no topo e temas balanceados
  const IMAGE_BANK_ITEMS = [
    // --- Linha 1 & 2: Destaques Visuais do Anel Viário e Ícones de SJC ---
    ["mais_fotos_radar/IMG_2905.jpg", "Panorama do Anel Viário & Aquarius", "Cidade"],
    ["mais_fotos_radar/IMG_2883.jpg", "Arco da Inovação", "Infraestrutura"],
    ["mais_fotos_radar/IMG_2912.jpg", "Circulação no Anel Viário", "Mobilidade"],
    ["mais_fotos_radar/IMG_2857.jpg", "Parque Vicentina Aranha", "Lazer"],
    ["mais_fotos_radar/IMG_2777.jpg", "Rodoviária Velha (Terminal Central)", "Mobilidade"],
    ["mais_fotos_radar/IMG_2810.jpg", "Eu amo SJC", "Cultura"],

    // --- Linha 3 & 4: Mobilidade, Comércio e Patrimônio Histórico ---
    ["mais_fotos_radar/IMG_2915.jpg", "Eixo Viário Metropolitano", "Mobilidade"],
    ["mais_fotos_radar/IMG_2838.jpg", "Calçadão", "Comércio"],
    ["mais_fotos_radar/IMG_2841.jpg", "Igreja Matriz", "Patrimônio"],
    ["mais_fotos_radar/IMG_2916.jpg", "Entardecer no Anel Viário", "Cidade"],
    ["mais_fotos_radar/IMG_2809.jpg", "Bicicleta no Banhado", "Mobilidade"],
    ["mais_fotos_radar/IMG_2815.jpg", "Biblioteca Cassiano Ricardo", "Cultura"],

    // --- Linha 5 & 6: Infraestrutura, Natureza e Vida Urbana ---
    ["mais_fotos_radar/IMG_2914.jpg", "Alça de Acesso & Malha Viária", "Infraestrutura"],
    ["mais_fotos_radar/IMG_2863.jpg", "Parque Vicentina Aranha - Alamedas", "Lazer"],
    ["mais_fotos_radar/IMG_2808.jpg", "Ônibus na Avenida São José", "Mobilidade"],
    ["mais_fotos_radar/IMG_2896.jpg", "Ônibus Elétrico", "Mobilidade"],
    ["mais_fotos_radar/IMG_2822.jpg", "Comércio", "Comércio"],
    ["mais_fotos_radar/IMG_2840.jpg", "Polícia Militar", "Serviços"],

    // --- Linha 7 & 8: Horizontes e Paisagens Urbanas ---
    ["mais_fotos_radar/IMG_2906.jpg", "Skyline e Horizontes Urbanos", "Cidade"],
    ["mais_fotos_radar/IMG_2858.jpg", "Parque Vicentina Aranha - Bosque", "Lazer"],
    ["mais_fotos_radar/IMG_2874.jpg", "Construção", "Infraestrutura"],
    ["mais_fotos_radar/IMG_2890.jpg", "Jardim das Colinas", "Cidade"],
    ["mais_fotos_radar/IMG_2780.jpg", "Placa na Rodoviária Velha (Terminal Central)", "Mobilidade"],
    ["mais_fotos_radar/IMG_2865.jpg", "Áreas verdes", "Lazer"],

    // --- Linha 9 & 10: Cotidiano e Território ---
    ["mais_fotos_radar/IMG_2875.jpg", "Aconchego caseiro", "Cidade"],
    ["mais_fotos_radar/IMG_2893.jpg", "Trânsito", "Mobilidade"],
    ["mais_fotos_radar/IMG_2868.jpg", "Vegetação", "Lazer"],
    ["mais_fotos_radar/IMG_2904.jpg", "Vista", "Cidade"],
    ["mais_fotos_radar/IMG_2902.jpg", "Trânsito - Cruzamento Urbano", "Mobilidade"],
    ["mais_fotos_radar/IMG_2911.jpg", "Edifícios Residenciais & Expansão Urbana", "Infraestrutura"],

    // --- Linha 11 & 12: Panoramas Finais e Cartões Postais ---
    ["mais_fotos_radar/IMG_2919.jpg", "Skyline do Jardim das Colinas", "Cidade"],
    ["fotos_radar/foto_cultura.jpg", "Calçadão da Rua 7 de Setembro", "Comércio"],
    ["fotos_radar/foto_onibus_viaduto.jpg", "Ponto de Ônibus sob o Arco", "Mobilidade"],
    ["fotos_radar/sjc_ponte_estaiada.jpg", "Arco da Inovação (Ponte Estaiada)", "Infraestrutura"]
  ];

  // 2. Estado Interno do Módulo
  let imageBankInitialized = false;
  let imageBankCategory = "Todos";
  let currentLightboxImage = null;
  let currentFilteredImageBank = [...IMAGE_BANK_ITEMS];
  let searchDebounceTimeout = null;
  let isZippingActive = false;

  // 3. Utilitários de Segurança e Normalização
  function escapeHtml(str) {
    if (str === null || str === undefined) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function normalizeText(str) {
    if (!str) return "";
    return String(str)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  // 4. Filtragem do Acervo
  function filterImages() {
    const search = document.getElementById("image-bank-search");
    const rawQuery = search ? search.value : "";
    const query = normalizeText(rawQuery);

    return IMAGE_BANK_ITEMS.filter(([src, title, category]) => {
      const matchesCategory = imageBankCategory === "Todos" || category === imageBankCategory;
      if (!matchesCategory) return false;
      if (!query) return true;

      const normTitle = normalizeText(title);
      const normCategory = normalizeText(category);
      const filename = src.split("/").pop().replace(/\.[^/.]+$/, "");
      const normFilename = normalizeText(filename);

      return (
        normTitle.includes(query) ||
        normCategory.includes(query) ||
        normFilename.includes(query)
      );
    });
  }

  // 5. Renderização dos Filtros por Categoria em Ordem Alfabética
  function initFiltersAndListeners(filters, search) {
    // Categorias ordenadas alfabeticamente
    const distinctCategories = [...new Set(IMAGE_BANK_ITEMS.map(([, , category]) => category))]
      .sort((a, b) => a.localeCompare(b, "pt-BR"));
    const categories = ["Todos", ...distinctCategories];

    filters.innerHTML = categories.map(category => {
      const isSelected = category === imageBankCategory;
      const safeCat = escapeHtml(category);
      return `
        <button 
          type="button" 
          data-image-category="${safeCat}" 
          aria-pressed="${isSelected ? 'true' : 'false'}"
          class="rounded-full border px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
            isSelected 
              ? "border-brand-900 bg-brand-900 text-white shadow-xs" 
              : "border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:text-brand-900"
          }"
        >${safeCat}</button>
      `;
    }).join("");

    filters.addEventListener("click", event => {
      const button = event.target.closest("[data-image-category]");
      if (!button) return;
      imageBankCategory = button.dataset.imageCategory;
      filters.querySelectorAll("[data-image-category]").forEach(item => {
        const active = item === button;
        item.setAttribute("aria-pressed", active ? "true" : "false");
        item.className = `rounded-full border px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
          active 
            ? "border-brand-900 bg-brand-900 text-white shadow-xs" 
            : "border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:text-brand-900"
        }`;
      });
      renderImageBank();
    });

    // Busca com debounce de 180ms para performance
    search.addEventListener("input", () => {
      clearTimeout(searchDebounceTimeout);
      searchDebounceTimeout = setTimeout(() => {
        renderImageBank();
      }, 180);
    });
  }

  // 6. Renderização do Índice Alfabético de Fotos A-Z na Barra Lateral
  function renderSidebarPhotoIndex(filteredImages) {
    const listContainer = document.getElementById("sidebar-image-bank-photo-list");
    const countEl = document.getElementById("sidebar-photo-list-count");
    if (!listContainer) return;

    if (countEl) {
      countEl.textContent = String(filteredImages.length);
    }

    // Ordenar as fotos visíveis em estrita ordem alfabética de A a Z
    const sortedImages = [...filteredImages].sort((a, b) => a[1].localeCompare(b[1], "pt-BR"));

    if (sortedImages.length === 0) {
      listContainer.innerHTML = `
        <p class="text-[11px] text-slate-400 italic py-2 text-center">Nenhuma foto no filtro</p>
      `;
      return;
    }

    listContainer.innerHTML = sortedImages.map(([src, title, category]) => {
      const safeTitle = escapeHtml(title);
      const safeCategory = escapeHtml(category);
      const safeSrc = escapeHtml(src);

      return `
        <button
          type="button"
          onclick="window.openImageLightboxBySrc('${safeSrc}')"
          title="Ver ${safeTitle}"
          class="w-full text-left p-2 rounded-xl border border-slate-100 hover:border-brand-300 hover:bg-slate-50 transition-all flex items-center justify-between gap-2 text-xs group cursor-pointer"
        >
          <div class="min-w-0 flex-1 flex items-center gap-2">
            <i class="fa-solid fa-camera text-[10px] text-slate-400 group-hover:text-brand-600 transition-colors shrink-0"></i>
            <span class="truncate font-semibold text-slate-700 group-hover:text-brand-950">${safeTitle}</span>
          </div>
          <span class="shrink-0 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 group-hover:bg-brand-100 group-hover:text-brand-900 transition-colors">
            ${safeCategory}
          </span>
        </button>
      `;
    }).join("");
  }

  // 7. Inicialização do Modal Lightbox
  function initLightboxModalListeners() {
    const modal = document.getElementById("image-lightbox-modal");
    if (!modal || modal.dataset.listenersBound === "true") return;

    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeImageLightbox();
      }
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeImageLightbox();
      }
    });

    modal.dataset.listenersBound = "true";
  }

  // 8. Renderização Principal do Módulo
  function renderImageBank() {
    const grid = document.getElementById("image-bank-grid");
    const filters = document.getElementById("image-bank-filters");
    const search = document.getElementById("image-bank-search");
    const count = document.getElementById("image-bank-count");

    if (!grid || !filters || !search || !count) return;

    if (!imageBankInitialized) {
      initFiltersAndListeners(filters, search);
      initLightboxModalListeners();
      imageBankInitialized = true;
    }

    // Ocultar botão Limpar no topo da sidebar no módulo Lentes SJC
    const btnResetSidebar = document.getElementById("btn-reset-filters");
    if (btnResetSidebar) {
      btnResetSidebar.classList.add("hidden");
    }

    const filtered = filterImages();
    currentFilteredImageBank = filtered;
    window.currentFilteredImageBank = filtered;

    // Atualiza texto de contagem conforme solicitado: "... imagens disponíveis para uso gratuito"
    const countText = `${filtered.length} ${filtered.length === 1 ? "imagem disponível" : "imagens disponíveis"} para uso gratuito`;
    count.textContent = countText;

    // Atualiza o Índice Alfabético na Sidebar
    renderSidebarPhotoIndex(filtered);

    // Estado Vazio (Empty State)
    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full py-12 px-6 text-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/70">
          <div class="w-12 h-12 mx-auto rounded-full bg-slate-200/80 flex items-center justify-center text-slate-500 mb-3">
            <i class="fa-solid fa-camera-slash text-xl"></i>
          </div>
          <h4 class="text-sm font-bold text-slate-800">Nenhuma fotografia encontrada</h4>
          <p class="text-xs text-slate-500 mt-1 max-w-sm mx-auto">Não encontramos imagens para o termo ou categoria selecionada. Tente buscar por outro tema ou redefinir os filtros.</p>
          <button 
            type="button" 
            onclick="window.resetLentesFilters()" 
            class="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-900 hover:bg-brand-800 text-white text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
          >
            <i class="fa-solid fa-rotate-left text-[10px]"></i>
            <span>Limpar Busca e Filtros</span>
          </button>
        </div>
      `;
      return;
    }

    // Cards do Acervo
    grid.innerHTML = filtered.map(([src, title, category], index) => {
      const filename = src.split("/").pop().replace(/\.[^/.]+$/, "");
      const thumbSrc = `thumbnails/${filename}_thumb.webp`;
      const safeTitle = escapeHtml(title);
      const safeCategory = escapeHtml(category);
      const safeSrc = escapeHtml(src);

      return `
      <article id="photo-card-${index}" class="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover flex flex-col justify-between">
        <div 
          role="button"
          tabindex="0"
          aria-label="Ampliar fotografia: ${safeTitle}"
          class="relative aspect-[4/3] overflow-hidden bg-slate-100 cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-brand-500"
          onclick="window.openImageLightbox(${index})"
          onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();window.openImageLightbox(${index});}"
          title="Clique para ampliar a foto"
        >
          <img 
            src="${thumbSrc}" 
            onerror="this.onerror=null;this.src='${safeSrc}'" 
            alt="${safeTitle} em São José dos Campos" 
            loading="lazy" 
            class="h-full w-full object-cover transition duration-500 group-hover:scale-105" 
          />
          <span class="absolute left-3 top-3 rounded-full bg-brand-950/85 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-accent-cyan shadow-sm">${safeCategory}</span>
          <div class="absolute inset-0 bg-brand-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <span class="px-3 py-1.5 rounded-full bg-white/95 text-brand-950 text-xs font-bold shadow-md flex items-center gap-1.5 backdrop-blur-xs">
              <i class="fa-solid fa-magnifying-glass-plus text-sky-600"></i> Ampliar
            </span>
          </div>
        </div>
        <div class="p-4 flex-1 flex flex-col justify-between">
          <div>
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0 flex-1">
                <h3 class="truncate text-sm font-black text-brand-950" title="${safeTitle}">${safeTitle}</h3>
                <p class="mt-0.5 truncate text-[11px] font-medium text-slate-500">
                  <i class="fa-solid fa-camera text-[10px] text-brand-500 mr-1"></i>Foto: André Paixão Studio 8
                </p>
              </div>
              <a 
                href="${safeSrc}" 
                download="${filename}.jpg" 
                title="Baixar foto original em alta resolução" 
                class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-900 transition hover:bg-brand-900 hover:text-white active:scale-95 shadow-2xs cursor-pointer"
              >
                <i class="fa-solid fa-download"></i>
              </a>
            </div>
          </div>
          <div class="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            <button 
              type="button" 
              data-copy-title="${safeTitle}"
              onclick="window.copyImageAttribution(this)"
              class="text-[11px] font-bold text-slate-500 hover:text-brand-900 flex items-center gap-1.5 transition-colors cursor-pointer py-1"
              title="Copiar créditos da imagem"
            >
              <i class="fa-solid fa-copy text-[10px]"></i>
              <span>Copiar Crédito</span>
            </button>
            <button 
              type="button" 
              onclick="window.openImageLightbox(${index})"
              class="text-[11px] font-bold text-slate-900 hover:text-cyan-700 flex items-center gap-1 transition-colors cursor-pointer py-1"
            >
              <span>Ver Detalhes</span>
              <i class="fa-solid fa-arrow-right text-[9px]"></i>
            </button>
          </div>
        </div>
      </article>
    `;
    }).join("");
  }

  // 9. Controle do Modal Lightbox
  function openImageLightbox(index) {
    const images = window.currentFilteredImageBank || IMAGE_BANK_ITEMS;
    const item = images[index];
    if (!item) return;

    const [src, title, category] = item;
    currentLightboxImage = { src, title, category };

    const modal = document.getElementById("image-lightbox-modal");
    const modalImg = document.getElementById("modal-image-src");
    const modalTitle = document.getElementById("modal-image-title");
    const modalCategory = document.getElementById("modal-image-category");
    const modalDownload = document.getElementById("modal-download-link");

    if (!modal || !modalImg || !modalTitle || !modalCategory || !modalDownload) return;

    modalImg.src = src;
    modalImg.alt = `${title} — Radar São José`;
    modalTitle.textContent = title;
    modalCategory.textContent = category;
    modalDownload.href = src;
    modalDownload.setAttribute("download", src.split("/").pop());

    modal.classList.remove("hidden");
    modal.classList.add("flex");
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
  }

  function openImageLightboxBySrc(targetSrc) {
    const images = window.currentFilteredImageBank || IMAGE_BANK_ITEMS;
    const idx = images.findIndex(([src]) => src === targetSrc);
    if (idx !== -1) {
      openImageLightbox(idx);
    } else {
      const fallbackItem = IMAGE_BANK_ITEMS.find(([src]) => src === targetSrc);
      if (fallbackItem) {
        const [src, title, category] = fallbackItem;
        currentLightboxImage = { src, title, category };
        const modal = document.getElementById("image-lightbox-modal");
        const modalImg = document.getElementById("modal-image-src");
        const modalTitle = document.getElementById("modal-image-title");
        const modalCategory = document.getElementById("modal-image-category");
        const modalDownload = document.getElementById("modal-download-link");
        if (modal && modalImg && modalTitle && modalCategory && modalDownload) {
          modalImg.src = src;
          modalImg.alt = `${title} — Radar São José`;
          modalTitle.textContent = title;
          modalCategory.textContent = category;
          modalDownload.href = src;
          modalDownload.setAttribute("download", src.split("/").pop());
          modal.classList.remove("hidden");
          modal.classList.add("flex");
          modal.style.display = "flex";
          document.body.style.overflow = "hidden";
        }
      }
    }
  }

  function closeImageLightbox() {
    const modal = document.getElementById("image-lightbox-modal");
    if (modal) {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
      modal.style.display = "none";
    }
    document.body.style.overflow = "";
  }

  // 10. Cópia Segura de Atribuição com Trava contra Cliques Concorrentes
  function copyTextWithFeedback(buttonEl, textToCopy, successHtml, duration) {
    duration = duration || 2000;
    if (!buttonEl || buttonEl.dataset.isCopying === "true") return;
    buttonEl.dataset.isCopying = "true";

    const originalHtml = buttonEl.innerHTML;

    const restore = () => {
      buttonEl.innerHTML = originalHtml;
      delete buttonEl.dataset.isCopying;
    };

    const onSuccess = () => {
      buttonEl.innerHTML = successHtml;
      setTimeout(restore, duration);
    };

    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy).then(onSuccess).catch(() => {
        prompt("Copie a atribuição abaixo:", textToCopy);
        restore();
      });
    } else {
      prompt("Copie a atribuição abaixo:", textToCopy);
      restore();
    }
  }

  function copyGlobalAttribution() {
    const btn = document.querySelector("#hero-wrapper-image-bank button") || document.getElementById("btn-copy-attribution-text");
    const targetBtn = btn ? (btn.tagName === "BUTTON" ? btn : btn.closest("button")) : null;
    const text = "Foto: André Paixão Studio 8 / Radar São José";
    if (targetBtn) {
      copyTextWithFeedback(
        targetBtn,
        text,
        '<i class="fa-solid fa-check text-emerald-400"></i> <span>Crédito Copiado!</span>'
      );
    }
  }

  function copyModalAttribution() {
    const btn = document.getElementById("modal-copy-btn");
    const text = currentLightboxImage 
      ? `Foto: André Paixão Studio 8 (${currentLightboxImage.title} - Radar São José)` 
      : "Foto: André Paixão Studio 8 / Radar São José";

    copyTextWithFeedback(
      btn,
      text,
      '<i class="fa-solid fa-check text-emerald-600"></i> <span class="text-emerald-700">Copiado!</span>'
    );
  }

  function copyImageAttribution(buttonEl) {
    if (!buttonEl) return;
    const title = buttonEl.getAttribute("data-copy-title") || (currentLightboxImage ? currentLightboxImage.title : "São José dos Campos");
    const text = `Foto: André Paixão Studio 8 (${title} - Radar São José)`;

    copyTextWithFeedback(
      buttonEl,
      text,
      '<i class="fa-solid fa-check text-emerald-600 text-[10px]"></i> <span class="text-emerald-700">Copiado!</span>'
    );
  }

  // 11. Limpeza / Reset Completo dos Filtros
  function resetLentesFilters() {
    imageBankCategory = "Todos";
    const search = document.getElementById("image-bank-search");
    if (search) search.value = "";

    const filters = document.getElementById("image-bank-filters");
    if (filters) {
      filters.querySelectorAll("[data-image-category]").forEach(btn => {
        const isTodos = btn.dataset.imageCategory === "Todos";
        btn.setAttribute("aria-pressed", isTodos ? "true" : "false");
        btn.className = `rounded-full border px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
          isTodos 
            ? "border-brand-900 bg-brand-900 text-white shadow-xs" 
            : "border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:text-brand-900"
        }`;
      });
    }

    renderImageBank();
  }

  // 12. Download em Lote (.ZIP) Seguro e Concorrente-Safe
  async function downloadImageBankZip() {
    if (isZippingActive) return;

    const images = window.currentFilteredImageBank || IMAGE_BANK_ITEMS;
    if (!images || !images.length) {
      alert("Nenhuma imagem selecionada para download.");
      return;
    }

    if (typeof JSZip === "undefined" || typeof saveAs === "undefined") {
      alert("Biblioteca de compactação ZIP indisponível no momento.");
      return;
    }

    const btnZip = document.getElementById("btn-download-all-zip");
    const btnZipText = document.getElementById("btn-zip-text");
    const originalText = btnZipText ? btnZipText.textContent : "Baixar Seleção (.ZIP)";

    isZippingActive = true;
    if (btnZip) {
      btnZip.disabled = true;
      btnZip.classList.add("opacity-75", "cursor-wait");
    }

    try {
      if (btnZipText) {
        btnZipText.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Compactando 0/${images.length}...`;
      }

      const zip = new JSZip();
      const folder = zip.folder("Radar_Sao_Jose_Acervo_Visual");

      folder.file("LEIAME_ATRIBUICAO.txt", 
        "ACERVO VISUAL - RADAR SÃO JOSÉ DOS CAMPOS\n" +
        "=========================================\n\n" +
        "Créditos e Atribuição Obrigatória:\n" +
        "Fotografias por: André Paixão Studio 8\n" +
        "Projeto: Radar São José\n\n" +
        "Uso autorizado para projetos, apresentações, redes sociais e mídias com a devida citação do autor.\n"
      );

      let completed = 0;
      let failed = 0;

      const fetchPromises = images.map(async ([src]) => {
        try {
          const response = await fetch(src);
          if (!response.ok) throw new Error(`Falha ${response.status} ao carregar ${src}`);
          const blob = await response.blob();
          const filename = src.split("/").pop();
          folder.file(filename, blob);
          completed++;
          if (btnZipText) {
            btnZipText.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Compactando ${completed}/${images.length}...`;
          }
        } catch (err) {
          failed++;
          console.warn("Erro ao incluir imagem no ZIP:", src, err);
        }
      });

      await Promise.all(fetchPromises);

      if (completed === 0) {
        alert("Não foi possível carregar as imagens selecionadas para compactação.");
        return;
      }

      if (btnZipText) {
        btnZipText.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Gerando arquivo ZIP...`;
      }

      const content = await zip.generateAsync({ type: "blob" });
      const categoryName = imageBankCategory === "Todos" ? "Completo" : imageBankCategory.replace(/\s+/g, "_");
      saveAs(content, `Radar_SJC_Fotos_${categoryName}.zip`);

      if (btnZipText) {
        btnZipText.innerHTML = `<i class="fa-solid fa-check text-emerald-400"></i> ${completed} fotos prontas!`;
        setTimeout(() => { 
          if (btnZipText) btnZipText.textContent = originalText; 
        }, 3000);
      }
    } catch (error) {
      console.error("Erro ao gerar ZIP:", error);
      alert("Ocorreu um erro ao gerar o arquivo ZIP. Tente baixar individualmente.");
      if (btnZipText) btnZipText.textContent = originalText;
    } finally {
      isZippingActive = false;
      if (btnZip) {
        btnZip.disabled = false;
        btnZip.classList.remove("opacity-75", "cursor-wait");
      }
    }
  }

  // 13. Exportação Global para Compatibilidade com app.js e Eventos
  window.IMAGE_BANK_ITEMS = IMAGE_BANK_ITEMS;
  window.renderImageBank = renderImageBank;
  window.openImageLightbox = openImageLightbox;
  window.openImageLightboxBySrc = openImageLightboxBySrc;
  window.closeImageLightbox = closeImageLightbox;
  window.copyGlobalAttribution = copyGlobalAttribution;
  window.copyModalAttribution = copyModalAttribution;
  window.copyImageAttribution = copyImageAttribution;
  window.resetLentesFilters = resetLentesFilters;
  window.downloadImageBankZip = downloadImageBankZip;

})();
