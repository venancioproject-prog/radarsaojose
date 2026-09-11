/**
 * ScrollRevealModule - Animação de revelação "Card por Card" ao rolar a página
 * Radar São José dos Campos
 */

(function () {
  const CSS_STYLES = `
    .reveal-card {
      opacity: 0 !important;
      transform: translateY(32px) scale(0.97) !important;
      transition: opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1), transform 0.65s cubic-bezier(0.16, 1, 0.3, 1) !important;
      will-change: opacity, transform;
    }
    .reveal-card.revealed {
      opacity: 1 !important;
      transform: translateY(0) scale(1) !important;
    }
  `;

  function injectCSS() {
    if (document.getElementById("scroll-reveal-styles")) return;
    const styleEl = document.createElement("style");
    styleEl.id = "scroll-reveal-styles";
    styleEl.innerHTML = CSS_STYLES;
    document.head.appendChild(styleEl);
  }

  function setupObserver() {
    const observerOptions = {
      threshold: 0.08,
      rootMargin: "0px 0px -20px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const parent = el.parentElement;
          if (parent) {
            const siblings = Array.from(parent.children).filter(c => c.classList.contains("reveal-card"));
            const idx = siblings.indexOf(el);
            const delay = Math.min((idx % 4) * 110, 440);
            el.style.transitionDelay = `${delay}ms`;
          }
          el.classList.add("revealed");

          // Trigger canvas re-calculation if needed
          if (window.VetoresSinergiaModule && (el.querySelector("#canvas-4-vetores") || el.id === "canvas-4-vetores")) {
            setTimeout(() => {
              window.VetoresSinergiaModule.setupBalls(true);
            }, 100);
          }

          observer.unobserve(el);
        }
      });
    }, observerOptions);

    function attach() {
      const selectors = [
        ".reveal-card",
        "#rep-insights-futuro .grid > div",
        "#top-10-influenciadores-grid > a",
        "#stakeholders-influenciadores-grid > a",
        "article .grid > div"
      ];

      const targets = document.querySelectorAll(selectors.join(", "));
      targets.forEach((card) => {
        if (!card.classList.contains("reveal-card")) {
          card.classList.add("reveal-card");
        }
        observer.observe(card);
      });
    }

    attach();

    // Re-attach for dynamic items (e.g. search filters)
    let timer = null;
    const mutationObserver = new MutationObserver(() => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(attach, 100);
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      injectCSS();
      setupObserver();
    });
  } else {
    injectCSS();
    setupObserver();
  }
})();
