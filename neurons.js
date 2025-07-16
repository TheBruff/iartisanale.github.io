
const canvas = document.getElementById('neurons-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let points = [];

function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    generatePoints();
}

function generatePoints() {
    points = [];
    const numPoints = Math.floor((width * height) / 8000);
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
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < points.length; i++) {
        const p1 = points[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0 || p1.x > width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > height) p1.vy *= -1;

        ctx.beginPath();
        ctx.arc(p1.x, p1.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(97, 168, 218, 0.7)';
        ctx.fill();

        for (let j = i + 1; j < points.length; j++) {
            const p2 = points[j];
            const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
            if (dist < 100) {
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

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
draw();
