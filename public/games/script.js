// ✨ Soft Darker Pink Particles (Games Page)
const canvas = document.createElement("canvas");
canvas.id = "particles-canvas";
document.body.appendChild(canvas);

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
        speedX: (Math.random() - 0.5) * 0.7,
        speedY: (Math.random() - 0.5) * 0.7,
    });
}

function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(219, 112, 147, 0.7)"; /* Soft darker pink for particles */
    particles.forEach(p => {
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

// --- Dynamic Game Card Generation ---

document.addEventListener("DOMContentLoaded", () => {
    const gameCardContainer = document.getElementById("game-card-container");
    const loadingMessage = document.getElementById("loading-message");

    if (!gameCardContainer) {
        console.error("Game card container element not found. Please ensure an element with id 'game-card-container' exists in your HTML.");
        return;
    }

    // Check if gameData is available (from /public/assets/games.js)
    if (typeof gameData === 'undefined' || !Array.isArray(gameData) || gameData.length === 0) {
        loadingMessage.textContent = "No games found or game data not loaded. Please check /public/assets/games.js.";
        console.error("gameData array not found or is empty. Ensure /public/assets/games.js is loaded correctly and contains game data.");
        return;
    }

    // Hide loading message once gameData is confirmed
    loadingMessage.style.display = 'none';

    // Loop through the gameData array (from games.js) and create cards
    gameData.forEach(game => {
        const gameLink = document.createElement("a");
        // THIS IS THE CORRECTED PATH TO THE LOADER
        gameLink.href = `/public/loader/load.html?gameId=${game.id}`; 
        gameLink.classList.add("game-card");

        const gameImage = document.createElement("img");
        gameImage.src = game.image;
        gameImage.alt = `${game.name} game preview`;
        gameImage.loading = "lazy"; // Optimize image loading

        const gameTitle = document.createElement("h3");
        gameTitle.textContent = game.name;

        gameLink.appendChild(gameImage);
        gameLink.appendChild(gameTitle);

        gameCardContainer.appendChild(gameLink);
    });
});