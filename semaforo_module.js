/**
 * SemaforoModule - Semáforo Ultra-Realista Interativo com Sinalizador LED
 * Radar São José dos Campos
 */

window.SemaforoModule = (function () {
  let activeState = 'verde'; // 'verde' | 'amarelo' | 'vermelho'
  let autoTimer = null;

  const CSS_STYLES = `
    .semaforo-lens {
      background-color: #0a0d14;
      background-image: radial-gradient(rgba(255, 255, 255, 0.18) 1.5px, transparent 1.5px);
      background-size: 7px 7px;
      box-shadow: inset 0 6px 14px rgba(0,0,0,0.95), inset 0 -3px 6px rgba(255,255,255,0.08);
      cursor: pointer;
      position: relative;
    }

    .semaforo-lens::after {
      content: '';
      position: absolute;
      top: 8%;
      left: 15%;
      width: 70%;
      height: 35%;
      background: linear-gradient(to bottom, rgba(255,255,255,0.35), rgba(255,255,255,0));
      border-radius: 50% 50% 0 0;
      pointer-events: none;
    }

    #semaforo-light-verde.active-glow {
      background-color: #10B981 !important;
      background-image: radial-gradient(rgba(255, 255, 255, 0.4) 2px, transparent 2px) !important;
      box-shadow: 0 0 30px #10B981, 0 0 65px rgba(16, 185, 129, 0.7), inset 0 3px 6px rgba(255,255,255,0.9) !important;
    }

    #semaforo-light-amarelo.active-glow {
      background-color: #F59E0B !important;
      background-image: radial-gradient(rgba(255, 255, 255, 0.4) 2px, transparent 2px) !important;
      box-shadow: 0 0 30px #F59E0B, 0 0 65px rgba(245, 158, 11, 0.7), inset 0 3px 6px rgba(255,255,255,0.9) !important;
    }

    #semaforo-light-vermelho.active-glow {
      background-color: #EF4444 !important;
      background-image: radial-gradient(rgba(255, 255, 255, 0.4) 2px, transparent 2px) !important;
      box-shadow: 0 0 30px #EF4444, 0 0 65px rgba(239, 68, 68, 0.7), inset 0 3px 6px rgba(255,255,255,0.9) !important;
    }

    @keyframes semaforoStrobe {
      0%, 100% { opacity: 1; filter: brightness(1.3); transform: scale(1.03); }
      25%, 75% { opacity: 0.2; filter: brightness(0.4); transform: scale(0.98); }
      50% { opacity: 1; filter: brightness(1.5); transform: scale(1.05); }
    }

    .blink-animation {
      animation: semaforoStrobe 0.3s ease-in-out 3 !important;
    }
  `;

  function injectCSS() {
    if (document.getElementById("semaforo-custom-styles")) return;
    const styleEl = document.createElement("style");
    styleEl.id = "semaforo-custom-styles";
    styleEl.innerHTML = CSS_STYLES;
    document.head.appendChild(styleEl);
  }

  function setSignal(state, triggerBlink = true) {
    activeState = state;

    const lights = {
      verde: document.getElementById("semaforo-light-verde"),
      amarelo: document.getElementById("semaforo-light-amarelo"),
      vermelho: document.getElementById("semaforo-light-vermelho")
    };

    const cards = {
      verde: document.getElementById("semaforo-card-verde"),
      amarelo: document.getElementById("semaforo-card-amarelo"),
      vermelho: document.getElementById("semaforo-card-vermelho")
    };

    Object.keys(lights).forEach((key) => {
      if (lights[key]) {
        lights[key].classList.remove("active-glow", "blink-animation");
      }
      if (cards[key]) {
        cards[key].classList.remove("ring-4", "ring-emerald-500", "ring-amber-500", "ring-rose-500", "scale-[1.015]");
        cards[key].classList.add("opacity-80");
      }
    });

    if (lights[state]) {
      lights[state].classList.add("active-glow");
      if (triggerBlink) {
        lights[state].classList.add("blink-animation");
        setTimeout(() => {
          if (lights[state]) lights[state].classList.remove("blink-animation");
        }, 1000);
      }
    }

    if (cards[state]) {
      cards[state].classList.remove("opacity-80");
      cards[state].classList.add("scale-[1.015]");

      if (state === 'verde') cards[state].classList.add("ring-4", "ring-emerald-500");
      if (state === 'amarelo') cards[state].classList.add("ring-4", "ring-amber-500");
      if (state === 'vermelho') cards[state].classList.add("ring-4", "ring-rose-500");
    }

    const badgeEl = document.getElementById("semaforo-status-badge");
    if (badgeEl) {
      if (state === 'verde') {
        badgeEl.textContent = "● SINAL VERDE: ONDE ENTRAR (SIGA)";
        badgeEl.className = "px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-lg animate-pulse";
      } else if (state === 'amarelo') {
        badgeEl.textContent = "● SINAL AMARELO: CAUTELA (ATENÇÃO)";
        badgeEl.className = "px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-lg animate-pulse";
      } else if (state === 'vermelho') {
        badgeEl.textContent = "● SINAL VERMELHO: EVITAR (PARE)";
        badgeEl.className = "px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-lg animate-pulse";
      }
    }
  }

  function startAutoCycle() {
    stopAutoCycle();
    const btnText = document.getElementById("btn-semaforo-auto-text");
    if (btnText) btnText.textContent = "Parar Trânsito Auto";

    const order = ['verde', 'amarelo', 'vermelho'];
    let idx = order.indexOf(activeState);

    autoTimer = setInterval(() => {
      idx = (idx + 1) % order.length;
      setSignal(order[idx], true);
    }, 2800);
  }

  function stopAutoCycle() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
    const btnText = document.getElementById("btn-semaforo-auto-text");
    if (btnText) btnText.textContent = "Modo Trânsito Auto";
  }

  function toggleAuto() {
    if (autoTimer) {
      stopAutoCycle();
    } else {
      startAutoCycle();
    }
  }

  function flashAll() {
    stopAutoCycle();
    const lights = document.querySelectorAll(".semaforo-lens");
    lights.forEach((l) => l.classList.add("blink-animation", "active-glow"));
    setTimeout(() => {
      lights.forEach((l) => l.classList.remove("blink-animation"));
      setSignal(activeState, false);
    }, 1200);
  }

  function init() {
    injectCSS();
    setSignal('verde', false);
  }

  return {
    init,
    setSignal,
    toggleAuto,
    flashAll
  };
})();

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", window.SemaforoModule.init);
} else {
  setTimeout(window.SemaforoModule.init, 100);
}
