function createElement(tag, className, innerHTML) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (innerHTML) el.innerHTML = innerHTML;
    return el;
}

const cdnPopup = createElement(
    "div",
    "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",
    `
    <div class="bg-gray-900 p-6 rounded-lg shadow-lg text-center space-y-4">
        <p class="text-lg font-semibold text-white">Select a CDN to load the game:</p>
        <button id="primaryCdnBtn" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Primary CDN</button>
        <button id="fallbackCdnBtn" class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Secondary CDN</button>
        <button id="gallbackCdnBtn" class="px-4 py-2 bg-green-500 text-white rounded hover:bg-black-600">3rd CDN</button>
        <p class="text-gray-400">Choose which CDN you want to use! If one is blocked, simply use the other one!</p>
    </div>
    `
);
document.body.appendChild(cdnPopup);

const CDN_URLS = [
    "https://assets.zyph3r.com/",
    "https://assets.onyxdev.me/",
    "https://assets.onyxdev.pw/"

];

function hidePopup() {
    cdnPopup.style.display = "none";
}

function getGameData() {
    const game = localStorage.getItem("game");
    return game ? JSON.parse(game) : null;
}

function setIframeSrc(iframe, url, fallbackUrl) {
    iframe.src = url;
    iframe.style.display = "block";
    iframe.onerror = () => {
        if (fallbackUrl && iframe.src !== fallbackUrl) {
            iframe.src = fallbackUrl;
        }
    };
}

function loadGame(cdnIndex) {
    const game = getGameData();
    if (!game) {
        console.error("No game found.");
        return;
    }
    const [primary, fallback] = CDN_URLS;
    const mainCdn = CDN_URLS[cdnIndex];
    const altCdn = CDN_URLS[1 - cdnIndex];
    const gameUrl = `${mainCdn}${game.root}/${game.file}`;
    const fallbackUrl = `${altCdn}${game.root}/${game.file}`;
    const iframe = document.getElementById("game");
    setIframeSrc(iframe, gameUrl, fallbackUrl);
}

document.getElementById("primaryCdnBtn").onclick = () => {
    loadGame(0);
    hidePopup();
};
document.getElementById("fallbackCdnBtn").onclick = () => {
    loadGame(1);
    hidePopup();
};
document.getElementById("gallbackCdnBtn").onclick = () => {
    loadGame(2);
    hidePopup();
};

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
