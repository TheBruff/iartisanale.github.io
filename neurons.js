window.onload = function () {
  const canvas = document.getElementById("neurons-bg");
  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  const numPoints = 60;
  const points = [];

  for (let i = 0; i < numPoints; i++) {
    points.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dessin des lignes entre points proches
    for (let i = 0; i < numPoints; i++) {
      for (let j = i + 1; j < numPoints; j++) {
        const dx = points[i].x - points[j].x;
        const dy = points[i].y - points[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.strokeStyle = "rgba(97,168,218,0.2)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(points[i].x, points[i].y);
          ctx.lineTo(points[j].x, points[j].y);
          ctx.stroke();
        }
      }
    }

    // Dessin des points
    for (let i = 0; i < numPoints; i++) {
      ctx.fillStyle = "rgba(97,168,218,0.6)";
      ctx.beginPath();
      ctx.arc(points[i].x, points[i].y, 2, 0, 2 * Math.PI);
      ctx.fill();

      points[i].x += points[i].vx;
      points[i].y += points[i].vy;

      if (points[i].x < 0 || points[i].x > canvas.width) points[i].vx *= -1;
      if (points[i].y < 0 || points[i].y > canvas.height) points[i].vy *= -1;
    }

    requestAnimationFrame(draw);
  }

  draw();
};