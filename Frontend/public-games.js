document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('game-list-container');
    if (!container) return;

    async function loadPublicGames() {
        try {
            const response = await fetch('/api/games'); 
            if (!response.ok) {
                throw new Error('Failed to fetch games from the server.');
            }
            const games = await response.json();
            container.innerHTML = '';
            
            if (games.length === 0) {
                container.innerHTML = '<p style="font-size: 1.6rem; text-align: center; width: 100%;">There are currently no available games.</p>';
                return;
            }

            games.forEach(game => {
                if (game.status === 'Active') {
                    const box = document.createElement('div');
                    box.classList.add('box');
                    box.innerHTML = `
                        <div class="image">
                            <img src="${game.image_link || 'image/default-game.png'}" alt="${game.title}">
                        </div>
                        
                        <div class="content">
                            <h3>${game.title}</h3>
                            <p style="color: var(--main-color); font-size: 1.4rem; margin-top: 0.5rem;">${game.category}</p>
                        </div>
                        
                        <div class="icons">
                            <i class='bx bx-heart like-btn' data-id="${game.id}"></i>
                            <a href="${game.game_link || '#'}" class="play-btn">Play</a>
                        </div>
                    `;
                    container.appendChild(box);
                }
            });
            
            await attachLikeButtonEvents();
            await initFavoritesOnLoad();

        } catch (error) {
            console.error('Error occurred while loading games:', error);
            container.innerHTML = '<p style="font-size: 1.6rem; color: var(--error-color); text-align: center; width: 100%;">Sorry, an error occurred while loading the game room.</p>';
        }
    }

    async function attachLikeButtonEvents() {
        const likeButtons = document.querySelectorAll('.like-btn');
        
        likeButtons.forEach(button => {
            button.addEventListener('click', async function(e) {
                e.preventDefault();
                
                const user = JSON.parse(localStorage.getItem('user'));
                if (!user) {
                    if (typeof showToast === 'function') {
                        showToast('Only logged-in users can save games!', 'warning');
                    } else {
                        alert('Please log in to save games to your wishlist!');
                    }
                    return;
                }

                const gameId = this.getAttribute('data-id');
                const isAlreadyLiked = this.classList.contains('liked');

                try {
                    if (!isAlreadyLiked) {
                        const response = await fetch('/api/favorites', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ userId: user.id, gameId: gameId })
                        });
                        const data = await response.json();
                        
                        if (response.ok && data.success) {
                            this.classList.remove('bx-heart');
                            this.classList.add('bxs-heart', 'liked');
                            if (typeof showToast === 'function') showToast(data.message, 'success');
                        }
                    } else {
                        const response = await fetch('/api/favorites', {
                            method: 'DELETE',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ userId: user.id, gameId: gameId })
                        });
                        const data = await response.json();
                        
                        if (response.ok && data.success) {
                            this.classList.remove('bxs-heart', 'liked');
                            this.classList.add('bx-heart');
                            if (typeof showToast === 'function') showToast(data.message, 'success');
                        }
                    }
                } catch (error) {
                    console.error("An error occurred while saving to wishlist:", error);
                }
            });
        });
    }

    async function initFavoritesOnLoad() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) return; 

        try {
            const response = await fetch(`/api/favorites/${user.id}`);
            if (!response.ok) return;
            const favorites = await response.json();

            if (favorites && favorites.length > 0) {
                const favoriteGameIds = favorites.map(fav => fav.game_id.toString());

                document.querySelectorAll('.like-btn').forEach(btn => {
                    const gameId = btn.getAttribute('data-id');
                    if (favoriteGameIds.includes(gameId)) {
                        btn.classList.remove('bx-heart');
                        btn.classList.add('bxs-heart', 'liked');
                    }
                });
            }
        } catch (error) {
            console.error("Error loading previous favorites:", error);
        }
    }
    loadPublicGames();
});