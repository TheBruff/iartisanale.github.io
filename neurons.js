// neurons.js – Fond neuronal organique V2 complet
(function () {
  const canvas = document.getElementById("neurons-bg");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width, height, centerX, centerY;
  let nodes = [], links = [], particles = [];
  let startTime = null;

  const config = {
    duration: 90000,
    spawnDelay: 10,
    maxBranches: 3,
    maxDepth: 5,
    nodeBaseSize: 2,
    colors: ['#61a8da', '#83e0f2', '#c080f7', '#ff80cc'],
    maxParticlesPerLink: 3
  };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    centerX = width / 2;
    centerY = height / 2;
  }

  function createNode(x, y, depth) {
    const node = {
      x, y, depth,
      size: config.nodeBaseSize + (1 - depth / config.maxDepth) * 4,
      links: [],
      angle: Math.random() * Math.PI * 2,
      freq: 0.5 + Math.random(),
      amp: 1 + Math.random(),
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
      const length = 40 + Math.random() * 60;
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
      for (let i = 0; i < config.maxParticlesPerLink; i++) {
        particles.push({
          link,
          t: Math.random(),
          speed: 0.002 + Math.random() * 0.002
        });
      }
    }
  }

  function animate(t) {
    if (!startTime) startTime = t;
    const elapsed = t - startTime;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);

    for (let link of links) {
      const { from, to } = link;
      ctx.strokeStyle = "rgba(97,168,218,0.12)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      const cx = (from.x + to.x) / 2 + (Math.random() - 0.5) * 6;
      const cy = (from.y + to.y) / 2 + (Math.random() - 0.5) * 6;
      ctx.moveTo(from.x, from.y);
      ctx.quadraticCurveTo(cx, cy, to.x, to.y);
      ctx.stroke();
    }

    for (let p of particles) {
      p.t += p.speed;
      if (p.t > 1) p.t = 0;
      const { from, to } = p.link;
      const x = from.x * (1 - p.t) + to.x * p.t;
      const y = from.y * (1 - p.t) + to.y * p.t;
      const color = config.colors[Math.floor(Math.random() * config.colors.length)];
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    for (let node of nodes) {
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
    const root = createNode(centerX, centerY, 0);
    growNetwork(root);
    createParticles();
    console.log("✅ Fond neuronal organique chargé");
    requestAnimationFrame(animate);
  });
})();