// neurons.js — Fond neuronal vivant (v1 finale)
(function () {
  const config = {
    totalDuration: 150000,
    nodeCount: 120,
    minRadius: 0.4,
    maxRadius: 0.9,
    colors: ['#61a8da', '#83e0f2', '#b3f3f9', '#9fd1e0'],
    maxConnections: 4,
    performanceThreshold: 25,
    particlesPerConnection: 2
  };

  let canvas, ctx, width, height, centerX, centerY;
  let nodes = [], connections = [], particles = [];
  let startTime = null;

  function initCanvas() {
    canvas = document.getElementById("neurons-bg");
    if (!canvas) return;
    ctx = canvas.getContext("2d");
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    requestAnimationFrame(animate);
  }

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    centerX = width / 2;
    centerY = height / 2;
  }

  function createNodes() {
    for (let i = 0; i < config.nodeCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * Math.min(width, height) * 0.45;
      const targetX = centerX + r * Math.cos(angle);
      const targetY = centerY + r * Math.sin(angle);
      const delay = i * (config.totalDuration / config.nodeCount);
      nodes.push({
        targetX,
        targetY,
        x: centerX,
        y: centerY,
        angle,
        r,
        delay,
        freq: 0.5 + Math.random(),
        amp: 1 + Math.random() * 2,
        phase: Math.random() * Math.PI * 2,
        arrived: false,
        depth: r / (Math.min(width, height) * 0.45)
      });
    }
  }

  function connectNodes() {
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      let connectionsLeft = config.maxConnections;
      for (let j = 0; j < nodes.length && connectionsLeft > 0; j++) {
        if (i === j) continue;
        const b = nodes[j];
        const dist = Math.hypot(a.targetX - b.targetX, a.targetY - b.targetY);
        if (dist < 150 && !connections.find(c =>
            (c.a === a && c.b === b) || (c.a === b && c.b === a))) {
          connections.push({ a, b });
          connectionsLeft--;
        }
      }
    }
  }

  function createParticles() {
    for (let conn of connections) {
      for (let i = 0; i < config.particlesPerConnection; i++) {
        particles.push({
          conn,
          t: Math.random(),
          speed: 0.001 + Math.random() * 0.001
        });
      }
    }
  }

  function animate(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);

    for (let n of nodes) {
      if (elapsed > n.delay) {
        const progress = Math.min(1, (elapsed - n.delay) / 3000);
        n.x = centerX + (n.targetX - centerX) * progress;
        n.y = centerY + (n.targetY - centerY) * progress;
        if (progress === 1) n.arrived = true;

        const t = (timestamp / 1000) * n.freq + n.phase;
        const offset = Math.sin(t) * n.amp;
        n.x += Math.cos(n.angle) * offset * 0.2;
        n.y += Math.sin(n.angle) * offset * 0.2;
      }
    }

    ctx.lineWidth = 1;
    for (let c of connections) {
      if (!c.a.arrived || !c.b.arrived) continue;
      const gradient = ctx.createLinearGradient(c.a.x, c.a.y, c.b.x, c.b.y);
      gradient.addColorStop(0, "rgba(97,168,218,0.08)");
      gradient.addColorStop(1, "rgba(97,168,218,0.08)");
      ctx.strokeStyle = gradient;

      ctx.beginPath();
      const cx = (c.a.x + c.b.x) / 2 + (Math.random() - 0.5) * 10;
      const cy = (c.a.y + c.b.y) / 2 + (Math.random() - 0.5) * 10;
      ctx.moveTo(c.a.x, c.a.y);
      ctx.quadraticCurveTo(cx, cy, c.b.x, c.b.y);
      ctx.stroke();
    }

    for (let p of particles) {
      if (!p.conn.a.arrived || !p.conn.b.arrived) continue;
      p.t += p.speed;
      if (p.t > 1) p.t = 0;

      const x = p.conn.a.x * (1 - p.t) + p.conn.b.x * p.t;
      const y = p.conn.a.y * (1 - p.t) + p.conn.b.y * p.t;

      ctx.beginPath();
      ctx.arc(x, y, 1.2, 0, Math.PI * 2);
      ctx.fillStyle = config.colors[Math.floor(Math.random() * config.colors.length)];
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    for (let n of nodes) {
      if (!n.arrived) continue;
      ctx.beginPath();
      ctx.arc(n.x, n.y, 2 + (1 - n.depth) * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(97,168,218,0.85)";
      ctx.shadowColor = "rgba(97,168,218,0.4)";
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    requestAnimationFrame(animate);
  }

  window.addEventListener("load", () => {
    initCanvas();
    createNodes();
    connectNodes();
    createParticles();
    console.log("✅ Fond neuronal animé initialisé");
  });
})();