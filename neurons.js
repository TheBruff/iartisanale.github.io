// neurons.js — Version 3.1 : expansion étendue à tout l’écran, splines organiques, particules visibles
(function () {
  const canvas = document.getElementById("neurons-bg");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width, height, centerX, centerY;
  let nodes = [], links = [], particles = [];
  let startTime = null;

  const config = {
    duration: 90000,
    spawnDelay: 300,
    maxBranches: 3,
    maxDepth: 10,
    nodeBaseSize: 2,
    colors: ['#61a8da', '#83e0f2', '#c080f7', '#ff80cc'],
    maxParticlesPerLink: 2
  };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    centerX = width / 2;
    centerY = height / 2;
    resetNetwork();
  }

  function resetNetwork() {
    nodes = [];
    links = [];
    particles = [];
    startTime = null;
    const root = createNode(centerX, centerY, 0);
    growNetwork(root);
    createParticles();
  }

  function createNode(x, y, depth) {
    const node = {
      x, y, depth,
      visibleAt: performance.now() + depth * config.spawnDelay,
      size: config.nodeBaseSize + (1 - depth / config.maxDepth) * 4,
      links: [],
      angle: Math.random() * Math.PI * 2,
      freq: 0.3 + Math.random() * 0.3,
      amp: 0.5 + Math.random(),
      phase: Math.random() * Math.PI * 2
    };
    nodes.push(node);
    return node;
  }

  function growNetwork(root, depth = 0) {
    if (depth >= config.maxDepth) return;
    const branches = 1 + Math.floor(Math.random() * config.maxBranches);
    for (let i = 0; i < branches; i++) {
      const angle = root.angle + (Math.random() - 0.5);
      const length = (Math.min(width, height) / 10) + Math.random() * (Math.min(width, height) / 6);
      const x = root.x + Math.cos(angle) * length;
      const y = root.y + Math.sin(angle) * length;
      const newNode = createNode(x, y, depth + 1);
      links.push({ from: root, to: newNode });
      root.links.push(newNode);
      growNetwork(newNode, depth + 1);
    }
  }

  function createParticles() {
    for (let link of links) {
      const color = config.colors[Math.floor(Math.random() * config.colors.length)];
      for (let i = 0; i < config.maxParticlesPerLink; i++) {
        particles.push({
          link,
          t: Math.random(),
          speed: 0.0008 + Math.random() * 0.001,
          color
        });
      }
    }
  }

  function drawSpline(ctx, from, to, segments = 5) {
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    for (let i = 1; i < segments; i++) {
      const t = i / segments;
      const dx = (to.x - from.x) * t + (Math.random() - 0.5) * 10;
      const dy = (to.y - from.y) * t + (Math.random() - 0.5) * 10;
      ctx.lineTo(from.x + dx, from.y + dy);
    }
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  }

  function animate(t) {
    if (!startTime) startTime = t;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);

    const now = performance.now();

    for (let link of links) {
      if (now < link.to.visibleAt) continue;
      ctx.strokeStyle = "rgba(97,168,218,0.25)";
      ctx.lineWidth = 1.5;
      ctx.shadowColor = "rgba(97,168,218,0.2)";
      ctx.shadowBlur = 2;
      drawSpline(ctx, link.from, link.to, 5);
      ctx.shadowBlur = 0;
    }

    for (let p of particles) {
      if (now < p.link.to.visibleAt) continue;
      p.t += p.speed;
      if (p.t > 1) p.t = 0;
      const { from, to } = p.link;
      const x = from.x * (1 - p.t) + to.x * p.t;
      const y = from.y * (1 - p.t) + to.y * p.t;
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    for (let node of nodes) {
      if (now < node.visibleAt) continue;
      const time = (t / 1000) * node.freq + node.phase;
      const dx = Math.cos(node.angle) * Math.sin(time) * node.amp;
      const dy = Math.sin(node.angle) * Math.sin(time) * node.amp;
      const size = node.size;
      ctx.beginPath();
      ctx.arc(node.x + dx, node.y + dy, size, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(97,168,218,0.85)";
      ctx.shadowColor = "rgba(97,168,218,0.4)";
      ctx.shadowBlur = 5;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    requestAnimationFrame(animate);
  }

  window.addEventListener("load", () => {
    resize();
    window.addEventListener("resize", resize);
    console.log("✅ Fond neuronal v3.1 (expansion large) chargé");
    requestAnimationFrame(animate);
  });
})();