document.addEventListener('DOMContentLoaded', () => {
    renderWishlist();
});

async function renderWishlist() {
    const wishlistGrid = document.getElementById('wishlist-grid');
    const emptyMessage = document.getElementById('empty-wishlist-message');
    const heading = document.getElementById('wishlist-heading');

    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user) {
        if (emptyMessage) emptyMessage.style.display = 'block';
        if (wishlistGrid) wishlistGrid.style.display = 'none';
        if (heading) heading.style.display = 'none';
        return;
    }

    try {
        const response = await fetch(`/api/favorites/${user.id}`);
        const wishlist = await response.json();

        if (!wishlist || wishlist.length === 0) {
            if (emptyMessage) emptyMessage.style.display = 'block';
            if (wishlistGrid) wishlistGrid.style.display = 'none';
            if (heading) heading.style.display = 'none';
        } else {
            if (emptyMessage) emptyMessage.style.display = 'none';
            if (heading) heading.style.display = 'block';
            if (wishlistGrid) {
                wishlistGrid.style.display = 'grid';
                wishlistGrid.innerHTML = '';
                
                wishlist.forEach(game => {
                    const card = document.createElement('div');
                    card.classList.add('box');
                    
                    let imagePath = game.image_link;
                    if (imagePath && !imagePath.startsWith('http') && !imagePath.startsWith('../')) {
                        imagePath = imagePath.startsWith('image/') ? `../${imagePath}` : `../image/${imagePath}`;
                    }

                    let gameLink = game.game_link;
                    if (gameLink && !gameLink.startsWith('http') && !gameLink.startsWith('../')) {
                         gameLink = `../${gameLink}`;
                    }

                    card.innerHTML = `
                        <div class="image">
                            <img src="${imagePath || '../image/default-game.png'}" alt="${game.title}">
                        </div>
                        <div class="content">
                            <h3>${game.title}</h3>
                        </div>
                        <div class="icons">
                            <i class='bx bxs-heart remove-heart liked' title="Remove from Wishlist" data-id="${game.game_id}"></i>
                            <a href="${gameLink || '#'}" target="_blank">Play</a>
                        </div>
                    `;
                    wishlistGrid.appendChild(card);
                });
            }

            document.querySelectorAll('.remove-heart').forEach(button => {
                button.addEventListener('click', (e) => {
                    const gameId = e.target.getAttribute('data-id');
                    removeFromWishlist(user.id, gameId);
                });
            });
        }
    } catch (error) {
        console.error("An error occurred while loading the wishlist:", error);
    }
}

async function removeFromWishlist(userId, gameId) {
    try {
        const response = await fetch('/api/favorites', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: userId, gameId: gameId })
        });
        
        const data = await response.json();
        if (response.ok && data.success) {
            if (typeof showToast === 'function') {
                showToast(data.message, 'success');
            }
            renderWishlist();
        }
    } catch (error) {
        console.error("An error occurred while removing from wishlist:", error);
    }
}