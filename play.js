// CDN URLs for game files
const CDN_URLS = [
    "https://assets.zyph3r.com/",
    "https://assets.onyxdev.me/",
    "https://assets.onyxdev.pw/"
];

// Utility to get game from localStorage
function getGameData() {
    const game = localStorage.getItem("game");
    return game ? JSON.parse(game) : null;
}

// Set iframe src with fallback
function setIframeSrc(iframe, url, fallbackUrl) {
    iframe.src = url;
    iframe.style.display = "block";
    iframe.onerror = () => {
        if (fallbackUrl && iframe.src !== fallbackUrl) {
            iframe.src = fallbackUrl;
        }
    };
}

// Load a game from selected CDN
function loadGame(cdnIndex) {
    const game = getGameData();
    if (!game) {
        console.error("No game found.");
        return;
    }

    const mainCdn = CDN_URLS[cdnIndex] || CDN_URLS[0];
    const altCdn = CDN_URLS.find(url => url !== mainCdn);
    const gameUrl = `${mainCdn}${game.root}/${game.file}`;
    const fallbackUrl = `${altCdn}${game.root}/${game.file}`;

    const iframe = document.getElementById("game");
    setIframeSrc(iframe, gameUrl, fallbackUrl);
}

// Show game CDN popup (only once per session)
function showGameCdnPopup() {
    if (sessionStorage.getItem("gameCdnPicked")) {
        loadGame(0); // load default if already picked
        return;
    }

    const cdnPopup = document.createElement("div");
    cdnPopup.className = "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50";
    cdnPopup.innerHTML = `
        <div class="bg-gray-900 p-6 rounded-lg shadow-lg text-center space-y-4">
            <p class="text-lg font-semibold text-white">Select a CDN to load the game:</p>
            <button id="primaryCdnBtn" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Primary CDN</button>
            <button id="fallbackCdnBtn" class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Secondary CDN</button>
            <button id="thirdCdnBtn" class="px-4 py-2 bg-black text-white rounded hover:bg-gray-700">3rd CDN</button>
            <p class="text-gray-400">Choose which CDN you want to use! If one is blocked, simply use the other one!</p>
        </div>
    `;
    document.body.appendChild(cdnPopup);

    function hidePopup() {
        cdnPopup.style.display = "none";
        sessionStorage.setItem("gameCdnPicked", "true");
    }

    document.getElementById("primaryCdnBtn").onclick = () => { loadGame(0); hidePopup(); };
    document.getElementById("fallbackCdnBtn").onclick = () => { loadGame(1); hidePopup(); };
    document.getElementById("thirdCdnBtn").onclick = () => { loadGame(2); hidePopup(); };
}

// Fullscreen handling
const fullscreenBtn = document.getElementById("fullscreenBtn");
const iframe = document.getElementById("game");

fullscreenBtn.onclick = () => {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        iframe.requestFullscreen();
    }
};

document.addEventListener("fullscreenchange", () => {
    fullscreenBtn.textContent = document.fullscreenElement ? "Exit Fullscreen" : "Fullscreen";
    fullscreenBtn.classList.remove("hidden");
});

fullscreenBtn.classList.remove("hidden");

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    showGameCdnPopup();
});
