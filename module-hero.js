// Shared presentation only. Images are configured on each instance in app.html.
(() => {
  const modules = {
    report: {
      label: 'Report Exclusivo',
      title: 'Report Exclusivo 2026',
      description: 'Estudo comportamental sobre quem vive, consome e decide na cidade.'
    },
    lentes: {
      label: 'Banco de Imagens',
      title: 'Acervo Visual de São José',
      description: 'Fotografias autorais e registros urbanos de São José dos Campos. Organizados para apresentações e pesquisas.'
    },
    historia: {
      label: 'História',
      title: 'História Municipal',
      description: 'Uma leitura da história municipal com referências abertas, contexto e lacunas identificadas.'
    },
    pesquisa: {
      label: 'Pesquisa Quantitativa',
      title: 'Pesquisa Municipal 2026',
      description: 'Explore os resultados da pesquisa, perfis, percepções e desafios da população de São José dos Campos.'
    },
    hub: {
      label: 'Radar Hub',
      title: 'Dados Públicos de São José',
      description: 'Indicadores oficiais integrados da cidade em um só lugar.'
    },
    clipping: {
      label: 'Inteligência de Mídia',
      title: 'Inteligência de Mídia',
      description: 'Acompanhe o que a imprensa e as redes sociais estão falando sobre São José dos Campos.'
    }
  };

  class RadarModuleHero extends HTMLElement {
    static get observedAttributes() { return ['module', 'image', 'image-position']; }
    connectedCallback() { this.render(); }
    attributeChangedCallback() { if (this.isConnected) this.render(); }

    render() {
      const key = this.getAttribute('module');
      const config = modules[key];
      if (!config) return;
      this.innerHTML = `
        <header class="module-hero module-hero--${key}">
          <div class="module-hero__visual" aria-hidden="true"></div>
          <div class="module-hero__content">
            <div class="module-hero__copy">
              <p class="module-hero__eyebrow">${config.label}</p>
              <h1 class="module-hero__title">${config.title}</h1>
              <p class="module-hero__description">${config.description}</p>
            </div>
          </div>
        </header>`;
      const source = this.getAttribute('image');
      if (source) {
        const img = document.createElement('img');
        img.alt = '';
        img.decoding = 'async';
        img.style.objectPosition = this.getAttribute('image-position') || 'center';
        img.addEventListener('error', () => img.remove(), { once: true });
        img.src = source;
        this.querySelector('.module-hero__visual').append(img);
      }
    }
  }
  if (!customElements.get('radar-module-hero')) {
    customElements.define('radar-module-hero', RadarModuleHero);
  }
})();
