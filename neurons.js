document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById('neurons-bg');
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
    }

    let points = [];

    function generatePoints() {
        const width = canvas.width;
        const height = canvas.height;
        const numPoints = Math.floor((width + height) / 80);
        points = [];
        for (let i = 0; i < numPoints; i++) {
            points.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let p of points) {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(97, 168, 218, 0.5)';
            ctx.fill();
        }

        for (let i = 0; i < points.length; i++) {
            const p1 = points[i];
            for (let j = i + 1; j < points.length; j++) {
                const p2 = points[j];
                const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = 'rgba(97, 168, 218, 0.2)';
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(draw);
    }

    resizeCanvas();
    generatePoints();
    draw();

    window.addEventListener('resize', () => {
        resizeCanvas();
        generatePoints();
    });
});