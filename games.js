// Utility: Get selected image CDN or default
function getSelectedImageCdn() {
    return sessionStorage.getItem('selectedImageCdn') || 'https://assets.zyph3r.com/';
}

// Fetch and render games
async function fetchGames() {
    try {
        const response = await fetch('games.json');
        const games = await response.json();
        games.sort((a, b) => a.name.localeCompare(b.name));
        localStorage.setItem('games', JSON.stringify(games));
        renderGames(games);
    } catch (error) {
        console.error('Error fetching games:', error);
    }
}

// Create a game card/link
function createGameLink(game, imageCdn) {
    const link = document.createElement('a');
    link.className = 'block bg-card p-5 rounded-xl shadow-md hover:shadow-accent/20 transform hover:scale-[1.02] transition duration-200';
    link.href = 'play.html';
    link.addEventListener('click', () => {
        localStorage.setItem('game', JSON.stringify(game));
    });

    const img = document.createElement('img');
    img.src = `${imageCdn}${game.root}/${game.img}`;
    img.alt = game.name;
    img.className = 'w-full h-48 object-cover rounded-lg mb-4 border border-gray-800';

    const h3 = document.createElement('h3');
    h3.textContent = game.name;
    h3.className = 'text-white text-lg font-semibold text-center tracking-tight';

    link.append(img, h3);
    return link;
}

// Render all games
function renderGames(games = null) {
    const container = document.querySelector('.games-container');
    if (!container) return;
    container.innerHTML = '';
    const imageCdn = getSelectedImageCdn();
    if (!games) {
        games = JSON.parse(localStorage.getItem('games')) || [];
    }
    games.forEach(game => {
        container.appendChild(createGameLink(game, imageCdn));
    });
}

// Show image CDN popup (once per page load)
function showCdnPopup() {
    if (window._cdnPopupShown) return; // only block multiple popups per page load
    window._cdnPopupShown = true;

    const cdns = [
        { url: 'https://assets.zyph3r.com/', label: 'Image CDN 1', btnClass: 'bg-accent hover:bg-accentDark' },
        { url: 'https://assets.onyxdev.me/', label: 'Image CDN 2', btnClass: 'bg-green-600 hover:bg-green-700' },
        { url: 'https://assets.onyxdev.pw/', label: 'Image CDN 3', btnClass: 'bg-blue-600 hover:bg-blue-700' }
    ];

    const popup = document.createElement('div');
    popup.className = 'fixed inset-0 bg-black/60 flex items-center justify-center z-50';
    popup.innerHTML = `
        <div class="bg-card p-8 rounded-2xl shadow-xl text-center space-y-6 max-w-sm w-full">
            <p class="text-lg font-semibold text-white">Select an image CDN</p>
            <div class="flex flex-col gap-3" id="cdn-btns"></div>
            <p class="text-sm text-gray-400">If one is blocked, images won’t show. Pick another CDN.</p>
        </div>
    `;
    document.body.appendChild(popup);

    const btnsContainer = popup.querySelector('#cdn-btns');
    cdns.forEach(cdn => {
        const btn = document.createElement('button');
        btn.textContent = cdn.label;
        btn.className = `px-4 py-2 ${cdn.btnClass} text-white rounded-lg transition`;
        btn.addEventListener('click', () => {
            sessionStorage.setItem('selectedImageCdn', cdn.url); // store selection for rendering
            popup.remove();
            renderGames();
        });
        btnsContainer.appendChild(btn);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Only show image CDN popup on games.html
    if (window.location.pathname.endsWith('games.html')) {
        showCdnPopup();
    }
    fetchGames();
});


