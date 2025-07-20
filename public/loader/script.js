// --- Particle Effect for this page - RE-ADDED ---
const canvas = document.getElementById("particles-canvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const particles = [];
for (let i = 0; i < 80; i++) { // Slightly fewer particles than games page
    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5, // Smaller particles
        speedX: (Math.random() - 0.5) * 0.5, // Slower movement
        speedY: (Math.random() - 0.5) * 0.5,
    });
}

function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(255, 105, 180, 0.5)"; /* Vibrant pink for particles */
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


// --- Game Loading and Control Logic ---
document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('gameId');
    const gameFrame = document.getElementById('game-frame');
    const gameTitleDisplay = document.getElementById('game-title-display'); // This element is now inside game-frame-container
    const gamePreviewImage = document.getElementById('game-preview-image');
    const gameLoader = document.getElementById('game-loader');
    const initialLoadingText = document.getElementById('initial-loading-text');

    // Button elements - ensure these IDs match your HTML
    const fullscreenToggleButton = document.getElementById('fullscreen-toggle-btn');
    const aboutBlankBtn = document.getElementById('about-blank-btn');
    const backToGamesBtn = document.getElementById('back-to-games-btn');
    const favoriteBtn = document.getElementById('favorite-btn'); // New button

    // Initial state: hide iframe until loaded
    gameFrame.style.opacity = 0; // Starts hidden
    gameFrame.style.pointerEvents = 'none'; // Prevent interaction until loaded

    if (gameId) {
        // gameData is available globally because public/assets/games.js is loaded first in load.html
        const gameToLoad = gameData.find(game => game.id === gameId);

        if (gameToLoad) {
            gameTitleDisplay.textContent = gameToLoad.name; // Set title, though often hidden by iframe
            gameFrame.src = gameToLoad.url;
            gamePreviewImage.src = gameToLoad.image; // Set the preview image source
            gamePreviewImage.alt = `${gameToLoad.name} preview`; // Set alt text for accessibility

            initialLoadingText.style.display = 'block'; // Show initial "Loading game..."
            gameLoader.style.display = 'block'; // Show spinner

            gameFrame.onload = () => {
                gameLoader.style.display = 'none'; // Hide spinner
                initialLoadingText.style.display = 'none'; // Hide text
                gameFrame.style.opacity = 1; // Fade in game frame
                gameFrame.style.pointerEvents = 'auto'; // Allow interaction
                console.log(`Game '${gameToLoad.name}' loaded.`);
            };

            gameFrame.onerror = () => {
                gameTitleDisplay.textContent = "Error Loading Game!";
                initialLoadingText.textContent = "Could not load the game. Please check the file path or game compatibility.";
                initialLoadingText.style.display = 'block'; // Show error message
                gameTitleDisplay.style.display = 'block'; // Show title on error
                gameLoader.style.display = 'none'; // Hide spinner
                gameFrame.style.display = 'none'; // Hide broken iframe
                gameFrame.style.opacity = 0; // Ensure it's hidden
                gameFrame.style.pointerEvents = 'none'; // Keep interaction off
                console.error(`Failed to load game: ${gameToLoad.name} from ${gameToLoad.url}`);
            };

        } else {
            gameTitleDisplay.textContent = "Game Not Found!";
            gamePreviewImage.style.display = 'none'; // Hide preview if no game
            initialLoadingText.textContent = "The requested game could not be found in our list.";
            initialLoadingText.style.display = 'block';
            gameTitleDisplay.style.display = 'block'; // Show title on error
            gameLoader.style.display = 'none';
            gameFrame.style.display = 'none';
            gameFrame.style.opacity = 0;
            gameFrame.style.pointerEvents = 'none';
        }
    } else {
        gameTitleDisplay.textContent = "No Game Specified!";
        gamePreviewImage.style.display = 'none';
        initialLoadingText.textContent = "Please select a game from the games page.";
        initialLoadingText.style.display = 'block';
        gameTitleDisplay.style.display = 'block';
        gameLoader.style.display = 'none';
        gameFrame.style.display = 'none';
        gameFrame.style.opacity = 0;
        gameFrame.style.pointerEvents = 'none';
    }

    // --- Button Functionality ---

    // Toggle Fullscreen Button
    fullscreenToggleButton.addEventListener('click', () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            // Request fullscreen on the whole document for broadest compatibility
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
        }
    });

    // Launch in about:blank Button
    aboutBlankBtn.addEventListener('click', () => {
        const gameSrc = gameFrame.src;
        if (gameSrc && gameSrc !== 'about:blank' && gameSrc !== '') {
            const newWindow = window.open('about:blank', '_blank');
            if (newWindow) {
                newWindow.location.href = gameSrc;
            } else {
                const messageBox = document.createElement('div');
                messageBox.style.cssText = `
                    position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                    background-color: #ffc0cb; padding: 20px; border-radius: 10px;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.3); z-index: 1000;
                    color: #ff69b4; font-weight: bold; text-align: center;
                    font-family: sans-serif;
                `;
                messageBox.textContent = "Pop-up blocked! Please allow pop-ups for this site.";
                document.body.appendChild(messageBox);
                setTimeout(() => messageBox.remove(), 3000);
            }
        } else {
            const messageBox = document.createElement('div');
            messageBox.style.cssText = `
                position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                background-color: #ffc0cb; padding: 20px; border-radius: 10px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.3); z-index: 1000;
                color: #ff69b4; font-weight: bold; text-align: center;
                font-family: sans-serif;
            `;
            messageBox.textContent = "No game loaded or invalid game source to launch.";
            document.body.appendChild(messageBox);
            setTimeout(() => messageBox.remove(), 3000);
        }
    });

    // Back to Games Button
    backToGamesBtn.addEventListener('click', () => {
        window.location.href = "/public/games/index.html";
    });

    // Favorite Button (Placeholder - no actual functionality implemented)
    favoriteBtn.addEventListener('click', () => {
        // You can add logic here later, e.g., to save game ID to localStorage
        console.log(`Game '${gameId}' marked as favorite! (Functionality not implemented yet)`);
        const messageBox = document.createElement('div');
        messageBox.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background-color: #f0f0f0; padding: 15px 25px; border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3); z-index: 1000;
            color: #333; font-weight: bold; text-align: center;
            font-family: sans-serif;
        `;
        messageBox.textContent = "Favorite functionality coming soon!";
        document.body.appendChild(messageBox);
        setTimeout(() => messageBox.remove(), 2000);
    });
});