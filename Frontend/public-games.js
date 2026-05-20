document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('game-list-container');
    if (!container) return;

    // Function to fetch games from the backend
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

            // Iterate through the items received from the database
            games.forEach(game => {
                if (game.status === 'Active') {
                    const box = document.createElement('div');
                    box.classList.add('box');
                    box.innerHTML = `
                        <div class="image">
                            <img src="${game.image_link || 'image/default-game.png'}" alt="${game.title}">
                            <div class="icons">
                                <i class='bx bx-heart like-btn' data-id="${game.id}"></i>
                                <a href="${game.game_link || '#'}" class="play-btn">Play</a>
                            </div>
                        </div>
                        <div class="content">
                            <h3>${game.title}</h3>
                            <p style="color: var(--main-color); font-size: 1.4rem; margin-top: 0.5rem;">${game.category}</p>
                        </div>
                    `;
                    container.appendChild(box);
                }
            });
            attachLikeButtonEvents();
        } catch (error) {
            console.error('Error occurred while loading games:', error);
            container.innerHTML = '<p style="font-size: 1.6rem; color: var(--error-color); text-align: center; width: 100%;">Sorry, an error occurred while loading the game room.</p>';
        }
    }

    // Favorites (Like) btn handler function
    function attachLikeButtonEvents() {
        const likeButtons = document.querySelectorAll('.like-btn');
        
        likeButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                this.classList.toggle('bx-heart');
                this.classList.toggle('bxs-heart');
                this.classList.toggle('liked');
                const gameId = this.getAttribute('data-id');
                
                if (this.classList.contains('liked')) {
                    console.log(`Game added to favorites. ID: ${gameId}`);
                } else {
                    console.log(`Game removed from favorites. ID: ${gameId}`);
                }
            });
        });
    }
    loadPublicGames();
});