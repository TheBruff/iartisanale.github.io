
// neurons.js - Version 1 : Réseau neuronal statique (fond noir + connexions)
window.addEventListener("load", () => {
  const canvas = document.createElement("canvas");
  canvas.id = "neurons-bg";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  const width = canvas.width;
  const height = canvas.height;
  const centerX = width / 2;
  const centerY = height / 2;

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

  // Dessin des connexions
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

  // Dessin des nœuds
  for (let point of points) {
    ctx.beginPath();
    ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(97, 168, 218, 0.9)";
    ctx.shadowColor = "rgba(97, 168, 218, 0.5)";
    ctx.shadowBlur = 4;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
});
