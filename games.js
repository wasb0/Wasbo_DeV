async function fetchGames() {
    try {
        const response = await fetch("games.json");
        const games = await response.json();
        games.sort((a, b) => a.name.localeCompare(b.name));
        localStorage.setItem("games", JSON.stringify(games));
        renderGames(games, document.querySelector(".games-container"));
    } catch (error) {
        console.error("Error:", error);
    }
}

function createGameLink(game, cdn, imageCdn) {
    const link = document.createElement("a");
    link.className =
        "block bg-card p-5 rounded-xl shadow-md hover:shadow-accent/20 transform hover:scale-[1.02] transition duration-200";
    link.href = "play.html";
    link.addEventListener("click", () => {
        localStorage.setItem("game", JSON.stringify(game));
    });

    const img = document.createElement("img");
    img.src = `${imageCdn}${game.root}/${game.img}`;
    img.alt = game.name;
    img.className =
        "w-full h-48 object-cover rounded-lg mb-4 border border-gray-800";

    const h3 = document.createElement("h3");
    h3.textContent = game.name;
    h3.className =
        "text-white text-lg font-semibold text-center tracking-tight";

    link.appendChild(img);
    link.appendChild(h3);
    return link;
}

function renderGames(games, container) {
    container.innerHTML = "";
    const selectedCdn =
        sessionStorage.getItem("selectedCdn") || "https://assets.zyph3r.com/";
    const selectedImageCdn =
        sessionStorage.getItem("selectedImageCdn") ||
        "https://images.zyph3r.com/";
    games.forEach((game) => {
        const gameLink = createGameLink(game, selectedCdn, selectedImageCdn);
        container.appendChild(gameLink);
    });
}

function renderAllGames() {
    const games = JSON.parse(localStorage.getItem("games")) || [];
    renderGames(games, document.querySelector(".games-container"));
}

document.addEventListener("DOMContentLoaded", () => {
    showCdnPopup();
    fetchGames();
});

if (window.location.pathname.endsWith("games.html")) {
    const imageCdnPopup = document.createElement("div");
    imageCdnPopup.className =
        "fixed inset-0 bg-black/60 flex items-center justify-center z-50";
    imageCdnPopup.innerHTML = `
        <div class="bg-card p-8 rounded-2xl shadow-xl text-center space-y-6 max-w-sm w-full">
            <p class="text-lg font-semibold text-white">Select an image CDN</p>
            <div class="flex flex-col gap-3">
                <button id="image-cdn1-btn" class="px-4 py-2 bg-accent hover:bg-accentDark text-white rounded-lg transition">
                    Image CDN 1
                </button>
                <button id="image-cdn2-btn" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition">
                    Image CDN 2
                </button>
                <button id="image-cdn3-btn" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
                    Image CDN 3
                </button>
            </div>
            <p class="text-sm text-gray-400">If one is blocked, images won’t show. Pick another CDN.</p>
        </div>
    `;

    document.body.appendChild(imageCdnPopup);

    document.getElementById("image-cdn1-btn").addEventListener("click", () => {
        sessionStorage.setItem("selectedImageCdn", "https://assets.zyph3r.com/");
        imageCdnPopup.remove();
        renderAllGames();
    });

    document.getElementById("image-cdn2-btn").addEventListener("click", () => {
        sessionStorage.setItem("selectedImageCdn", "https://assets.onyxdev.me/");
        imageCdnPopup.remove();
        renderAllGames();
    });

    document.getElementById("image-cdn3-btn").addEventListener("click", () => {
        sessionStorage.setItem("selectedImageCdn", "https://assets.onyxdev.pw/");
        imageCdnPopup.remove();
        renderAllGames();
    });
}
