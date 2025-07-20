// ⏰ Clock
function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  const s = String(now.getSeconds()).padStart(2, "0");
  document.getElementById("clock-display").textContent = `${h}:${m}:${s}`;
}
setInterval(updateClock, 1000);
updateClock(); // Run once on load

// 🔋 Battery Status with Emoji Icon
if (navigator.getBattery) {
  navigator.getBattery().then(function (battery) {
    function updateBatteryInfo() {
      const level = Math.round(battery.level * 100);
      const emoji = battery.charging ? "⚡" : "🔋";
      document.getElementById("battery-status").textContent = `${emoji} Battery: ${level}%`;
    }

    updateBatteryInfo();
    battery.addEventListener("levelchange", updateBatteryInfo);
    battery.addEventListener("chargingchange", updateBatteryInfo);
  });
} else {
  document.getElementById("battery-status").textContent = "🔋 Battery: Not supported";
}

// ✨ Soft Pink Particles
const canvas = document.getElementById("particles-canvas");
const ctx = canvas.getContext("2d");

canvas.style.position = "fixed";
canvas.style.top = 0;
canvas.style.left = 0;
canvas.style.zIndex = "-1";
canvas.style.pointerEvents = "none";

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const particles = [];
for (let i = 0; i < 100; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 2 + 1,
    speedX: (Math.random() - 0.5) * 0.5,
    speedY: (Math.random() - 0.5) * 0.5,
  });
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(219, 112, 147, 0.7)";
  particles.forEach((p) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();

    p.x += p.speedX;
    p.y += p.speedY;

    if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
    if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
  });
  requestAnimationFrame(drawParticles);
}
drawParticles();
