/**
 * VetoresSinergiaModule - Canvas interativo em Fundo Branco sem cortes de bordas
 * Radar São José dos Campos (SJC)
 */

window.VetoresSinergiaModule = (function () {
  let canvas = null;
  let ctx = null;
  let animId = null;
  let isInitialized = false;

  const VETORES = [
    {
      id: 0,
      code: "01",
      title: "GEOGRAFIA DA INÉRCIA",
      shortTitle: "Geografia da Inércia",
      desc: "A cultura da harmonia, estabilidade e do 'tá tudo bem'.",
      color: "#4F46E5",
      borderColor: "#6366F1",
      glowColor: "rgba(99, 102, 241, 0.25)",
      gradient: ["rgba(99, 102, 241, 0.16)", "rgba(79, 70, 229, 0.06)"],
      targetOffset: { x: -0.13, y: -0.12 }
    },
    {
      id: 1,
      code: "02",
      title: "CIDADE PROMETIDA",
      shortTitle: "Cidade Prometida",
      desc: "A expectativa de um futuro mais vibrante e desenvolvido.",
      color: "#DB2777",
      borderColor: "#EC4899",
      glowColor: "rgba(236, 72, 153, 0.25)",
      gradient: ["rgba(236, 72, 153, 0.16)", "rgba(219, 39, 119, 0.06)"],
      targetOffset: { x: 0.13, y: -0.12 }
    },
    {
      id: 2,
      code: "03",
      title: "TRIBO GLOBAL",
      shortTitle: "Tribo Global",
      desc: "O grupo vocal que exige padrão e sofisticação internacional.",
      color: "#0284C7",
      borderColor: "#00B4D8",
      glowColor: "rgba(0, 180, 216, 0.25)",
      gradient: ["rgba(0, 180, 216, 0.16)", "rgba(2, 132, 199, 0.06)"],
      targetOffset: { x: -0.13, y: 0.12 }
    },
    {
      id: 3,
      code: "04",
      title: "EMPREENDEDORISMO INTUITIVO",
      shortTitle: "Empreendedorismo Intuitivo",
      desc: "O foco pragmático no sustento e estabilidade econômica.",
      color: "#D97706",
      borderColor: "#F59E0B",
      glowColor: "rgba(245, 158, 11, 0.25)",
      gradient: ["rgba(245, 158, 11, 0.16)", "rgba(217, 119, 6, 0.06)"],
      targetOffset: { x: 0.13, y: 0.12 }
    }
  ];

  let balls = [];
  let isDragging = false;
  let draggedBallIndex = -1;
  let dragOffset = { x: 0, y: 0 };
  let hoveredBallIndex = -1;
  let pulseAngle = 0;
  let isBounceMode = true;

  function init() {
    canvas = document.getElementById("canvas-4-vetores");
    if (!canvas) return;

    ctx = canvas.getContext("2d");

    if (window.ResizeObserver && canvas.parentElement) {
      const ro = new ResizeObserver(() => {
        resizeCanvas();
        setupBalls(true);
      });
      ro.observe(canvas.parentElement);
    }

    resizeCanvas();
    setupBalls();
    bindEvents();

    if (animId) cancelAnimationFrame(animId);
    loop();
  }

  function getCanvasDims() {
    if (!canvas) return { width: 600, height: 500 };
    const rect = canvas.getBoundingClientRect();
    const width = rect.width || canvas.clientWidth || canvas.offsetWidth || 600;
    const height = rect.height || canvas.clientHeight || canvas.offsetHeight || 500;
    return { width, height };
  }

  function resizeCanvas() {
    if (!canvas || !ctx) return;
    const { width, height } = getCanvasDims();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
  }

  function setupBalls(force = false) {
    if (!canvas) return;
    const { width, height } = getCanvasDims();

    if (width <= 20 || height <= 20) return;

    if (isInitialized && !force && balls.length === 4) {
      const centerX = width / 2;
      const centerY = height / 2;
      balls.forEach((b) => {
        b.targetX = centerX + b.targetOffset.x * width * 0.75;
        b.targetY = centerY + b.targetOffset.y * height * 0.75;
      });
      return;
    }

    const centerX = width / 2;
    const centerY = height / 2;
    const minDim = Math.min(width, height);
    // Adjusted radius to fit perfectly without clipping top/bottom edges
    const radius = Math.max(65, Math.min(102, minDim * 0.21));

    balls = VETORES.map((v) => {
      const tx = centerX + v.targetOffset.x * width * 0.75;
      const ty = centerY + v.targetOffset.y * height * 0.75;

      return {
        ...v,
        x: tx + (Math.random() - 0.5) * 20,
        y: ty + (Math.random() - 0.5) * 20,
        targetX: tx,
        targetY: ty,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        radius: radius,
        mass: 1,
        phase: Math.random() * Math.PI * 2
      };
    });

    isInitialized = true;
  }

  function bindEvents() {
    window.addEventListener("resize", () => {
      resizeCanvas();
      setupBalls(true);
    });

    if (!canvas) return;

    function getCoords(e) {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    }

    canvas.addEventListener("mousedown", (e) => {
      const { x, y } = getCoords(e);
      for (let i = balls.length - 1; i >= 0; i--) {
        const b = balls[i];
        const dx = x - b.x;
        const dy = y - b.y;
        if (Math.sqrt(dx * dx + dy * dy) <= b.radius) {
          isDragging = true;
          draggedBallIndex = i;
          dragOffset.x = dx;
          dragOffset.y = dy;
          break;
        }
      }
    });

    canvas.addEventListener("mousemove", (e) => {
      const { x, y } = getCoords(e);
      let foundHover = -1;

      for (let i = balls.length - 1; i >= 0; i--) {
        const b = balls[i];
        const dx = x - b.x;
        const dy = y - b.y;
        if (Math.sqrt(dx * dx + dy * dy) <= b.radius) {
          foundHover = i;
          break;
        }
      }
      hoveredBallIndex = foundHover;
      canvas.style.cursor = foundHover !== -1 ? "grab" : "default";

      if (isDragging && draggedBallIndex !== -1) {
        canvas.style.cursor = "grabbing";
        balls[draggedBallIndex].x = x - dragOffset.x;
        balls[draggedBallIndex].y = y - dragOffset.y;
        balls[draggedBallIndex].vx = 0;
        balls[draggedBallIndex].vy = 0;
      }
    });

    const stopDrag = () => {
      isDragging = false;
      draggedBallIndex = -1;
      if (canvas) canvas.style.cursor = "default";
    };

    window.addEventListener("mouseup", stopDrag);
    canvas.addEventListener("mouseleave", stopDrag);

    // Touch support
    canvas.addEventListener("touchstart", (e) => {
      const { x, y } = getCoords(e);
      for (let i = balls.length - 1; i >= 0; i--) {
        const b = balls[i];
        const dx = x - b.x;
        const dy = y - b.y;
        if (Math.sqrt(dx * dx + dy * dy) <= b.radius) {
          isDragging = true;
          draggedBallIndex = i;
          dragOffset.x = dx;
          dragOffset.y = dy;
          break;
        }
      }
    }, { passive: true });

    canvas.addEventListener("touchmove", (e) => {
      if (isDragging && draggedBallIndex !== -1) {
        const { x, y } = getCoords(e);
        balls[draggedBallIndex].x = x - dragOffset.x;
        balls[draggedBallIndex].y = y - dragOffset.y;
      }
    }, { passive: true });

    canvas.addEventListener("touchend", stopDrag);
  }

  function updatePhysics() {
    if (!canvas) return;
    const { width, height } = getCanvasDims();
    if (width <= 20 || height <= 20) return;

    if (!isInitialized || balls.length < 4) {
      setupBalls(true);
      return;
    }

    const centerX = width / 2;
    const centerY = height / 2;
    pulseAngle += 0.04;

    for (let i = 0; i < balls.length; i++) {
      const b = balls[i];

      b.targetX = centerX + b.targetOffset.x * width * 0.75;
      b.targetY = centerY + b.targetOffset.y * height * 0.75;

      if (i === draggedBallIndex && isDragging) continue;

      if (isBounceMode) {
        b.phase += 0.02;
        const driftX = Math.sin(b.phase) * 0.4;
        const driftY = Math.cos(b.phase * 0.8) * 0.4;

        const k = 0.0035;
        const damp = 0.94;
        const ax = (b.targetX - b.x) * k + driftX * 0.05;
        const ay = (b.targetY - b.y) * k + driftY * 0.05;

        b.vx = (b.vx + ax) * damp;
        b.vy = (b.vy + ay) * damp;

        b.x += b.vx;
        b.y += b.vy;
      } else {
        b.x += (b.targetX - b.x) * 0.1;
        b.y += (b.targetY - b.y) * 0.1;
        b.vx = 0;
        b.vy = 0;
      }

      // Strict Canvas Edge Boundary - Never clip outer circle border
      const pad = b.radius + 8;
      if (b.x < pad) { b.x = pad; b.vx *= -0.6; }
      if (b.x > width - pad) { b.x = width - pad; b.vx *= -0.6; }
      if (b.y < pad) { b.y = pad; b.vy *= -0.6; }
      if (b.y > height - pad) { b.y = height - pad; b.vy *= -0.6; }
    }

    // Elastic Collision detection between balls
    if (isBounceMode) {
      for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
          const b1 = balls[i];
          const b2 = balls[j];
          const dx = b2.x - b1.x;
          const dy = b2.y - b1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = (b1.radius + b2.radius) * 0.78;

          if (dist < minDist && dist > 0) {
            const overlap = minDist - dist;
            const nx = dx / dist;
            const ny = dy / dist;

            if (i !== draggedBallIndex) {
              b1.x -= nx * overlap * 0.5;
              b1.y -= ny * overlap * 0.5;
            }
            if (j !== draggedBallIndex) {
              b2.x += nx * overlap * 0.5;
              b2.y += ny * overlap * 0.5;
            }

            const kx = b1.vx - b2.vx;
            const ky = b1.vy - b2.vy;
            const p = 2 * (nx * kx + ny * ky) / (b1.mass + b2.mass);

            if (i !== draggedBallIndex) {
              b1.vx -= p * b2.mass * nx * 0.7;
              b1.vy -= p * b2.mass * ny * 0.7;
            }
            if (j !== draggedBallIndex) {
              b2.vx += p * b1.mass * nx * 0.7;
              b2.vy += p * b1.mass * ny * 0.7;
            }
          }
        }
      }
    }
  }

  function draw() {
    if (!ctx || !canvas) return;

    const { width, height } = getCanvasDims();
    const dpr = window.devicePixelRatio || 1;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    
    // Fill Background with Pure White
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, width, height);

    if (!isInitialized || balls.length < 4) return;

    // 1. Connecting dashed lines between ball centers
    ctx.lineWidth = 1.5;
    for (let i = 0; i < balls.length; i++) {
      for (let j = i + 1; j < balls.length; j++) {
        const b1 = balls[i];
        const b2 = balls[j];
        ctx.strokeStyle = "rgba(148, 163, 184, 0.4)";
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(b1.x, b1.y);
        ctx.lineTo(b2.x, b2.y);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // 2. Translucent Circles (Venn Spheres) on White Background
    balls.forEach((b, idx) => {
      const isHovered = idx === hoveredBallIndex || idx === draggedBallIndex;
      const r = isHovered ? b.radius * 1.04 : b.radius;

      // Circle Fill Gradient
      const circleGrad = ctx.createRadialGradient(b.x - r * 0.2, b.y - r * 0.2, r * 0.1, b.x, b.y, r);
      circleGrad.addColorStop(0, b.gradient[0]);
      circleGrad.addColorStop(1, b.gradient[1]);

      ctx.fillStyle = circleGrad;
      ctx.beginPath();
      ctx.arc(b.x, b.y, r, 0, Math.PI * 2);
      ctx.fill();

      // Border Ring Stroke
      ctx.lineWidth = isHovered ? 3.5 : 2.5;
      ctx.strokeStyle = b.borderColor;
      ctx.stroke();

      // Code (#01, #02, etc.)
      ctx.font = "900 13px Montserrat, system-ui, sans-serif";
      ctx.fillStyle = b.color;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(b.code, b.x, b.y - r * 0.42);

      // Title Text inside Sphere - Dark Navy for 100% legibility on white
      ctx.font = "800 12px Montserrat, system-ui, sans-serif";
      ctx.fillStyle = "#0B2545";

      const words = b.shortTitle.split(" ");
      if (words.length > 1) {
        ctx.fillText(words[0], b.x, b.y - 4);
        ctx.fillText(words.slice(1).join(" "), b.x, b.y + 12);
      } else {
        ctx.fillText(b.shortTitle, b.x, b.y + 4);
      }
    });

    // 3. Central Intersection Zone (Branding Territorial Core)
    const avgX = balls.reduce((sum, b) => sum + b.x, 0) / balls.length;
    const avgY = balls.reduce((sum, b) => sum + b.y, 0) / balls.length;

    const pulseScale = 1 + Math.sin(pulseAngle) * 0.08;
    const pulseOpacity = 0.5 + Math.sin(pulseAngle) * 0.3;

    ctx.save();
    ctx.translate(avgX, avgY);

    // Pulse Ring 1
    ctx.strokeStyle = `rgba(0, 180, 216, ${pulseOpacity * 0.8})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 48 * pulseScale, 0, Math.PI * 2);
    ctx.stroke();

    // Core White Badge Box with Shadow & Border
    const badgeW = 124;
    const badgeH = 46;
    const rx = -badgeW / 2;
    const ry = -badgeH / 2;

    ctx.shadowColor = "rgba(11, 37, 69, 0.25)";
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 4;

    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.roundRect(rx, ry, badgeW, badgeH, 14);
    ctx.fill();

    ctx.shadowColor = "transparent";
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = "#0B2545";
    ctx.stroke();

    // Crisp Dark Navy Text: BRANDING TERRITORIAL
    ctx.font = "900 11px Montserrat, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    ctx.fillStyle = "#0B2545";
    ctx.fillText("BRANDING", 0, -8);
    
    ctx.fillStyle = "#0083B0";
    ctx.fillText("TERRITORIAL", 0, 7);

    ctx.restore();
  }

  function loop() {
    updatePhysics();
    draw();
    animId = requestAnimationFrame(loop);
  }

  function toggleMode() {
    isBounceMode = !isBounceMode;
    const btnText = document.getElementById("btn-vetores-mode-text");
    if (btnText) {
      btnText.textContent = isBounceMode ? "Modo: Flutuante & Bate-Bate" : "Modo: Diagrama Alinhado";
    }
  }

  function impulseSinergia() {
    balls.forEach((b) => {
      b.vx = (Math.random() - 0.5) * 8;
      b.vy = (Math.random() - 0.5) * 8;
    });
  }

  return {
    init,
    toggleMode,
    impulseSinergia,
    setupBalls
  };
})();

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", window.VetoresSinergiaModule.init);
} else {
  setTimeout(window.VetoresSinergiaModule.init, 100);
}
