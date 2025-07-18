
// neurons.js - Version corrigée avec redimensionnement dynamique + log de debug
window.addEventListener("load", () => {
  const canvas = document.getElementById("neurons-bg");
  if (!canvas) {
    console.error("🛑 Canvas #neurons-bg non trouvé.");
    return;
  }

  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawNeurons(); // Redessiner à chaque resize
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas(); // Initialisation

  function drawNeurons() {
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.clearRect(0, 0, width, height);

    const numPoints = 100;
    const radius = Math.min(width, height) * 0.45;

    const points = [];

    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2;
      const r = radius * (0.4 + 0.6 * Math.random());
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);
      points.push({ x, y });
    }

    // Fond noir
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);

    // Connexions
    ctx.strokeStyle = "rgba(97, 168, 218, 0.15)";
    ctx.lineWidth = 1.2;

    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dx = points[i].x - points[j].x;
        const dy = points[i].y - points[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < radius * 0.25) {
          ctx.beginPath();
          const cpX = (points[i].x + points[j].x) / 2 + (Math.random() - 0.5) * 20;
          const cpY = (points[i].y + points[j].y) / 2 + (Math.random() - 0.5) * 20;
          ctx.moveTo(points[i].x, points[i].y);
          ctx.quadraticCurveTo(cpX, cpY, points[j].x, points[j].y);
          ctx.stroke();
        }
      }
    }

    // Points
    for (let point of points) {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(97, 168, 218, 0.9)";
      ctx.shadowColor = "rgba(97, 168, 218, 0.5)";
      ctx.shadowBlur = 4;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  console.log("✅ neurons.js chargé et exécuté.");
});
