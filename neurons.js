
document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("neurons-bg");
    const ctx = canvas.getContext("2d");

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    new ResizeObserver(() => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }).observe(document.body);

    const numPoints = 60;
    const points = [];

    for (let i = 0; i < numPoints; i++) {
        points.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5
        });
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < numPoints; i++) {
            const p = points[i];
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = "#61a8da";
            ctx.fill();
        }

        for (let i = 0; i < numPoints; i++) {
            for (let j = i + 1; j < numPoints; j++) {
                const dx = points[i].x - points[j].x;
                const dy = points[i].y - points[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(points[i].x, points[i].y);
                    ctx.lineTo(points[j].x, points[j].y);
                    ctx.strokeStyle = "rgba(97, 168, 218, " + (1 - dist / 120) + ")";
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(draw);
    }

    draw();
});
