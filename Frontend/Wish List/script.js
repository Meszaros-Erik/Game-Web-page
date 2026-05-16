document.addEventListener('DOMContentLoaded', () => {
    renderWishlist();
});

function renderWishlist() {
    const wishlistGrid = document.getElementById('wishlist-grid');
    const emptyMessage = document.getElementById('empty-wishlist-message');
    
    let wishlist = JSON.parse(localStorage.getItem('gameWishlist')) || [];

    if (wishlist.length === 0) {
        emptyMessage.style.display = 'block';
        wishlistGrid.style.display = 'none';
    } else {
        emptyMessage.style.display = 'none';
        wishlistGrid.style.display = 'grid';
        
        wishlistGrid.innerHTML = '';

        wishlist.forEach(game => {
            const card = document.createElement('div');
            card.classList.add('wishlist-card');
            
            card.innerHTML = `
                <i class='bx bxs-heart remove-heart' title="Remove from Wishlist" data-id="${game.id}"></i>
                <img src="${game.image}" alt="${game.title}">
                <h4>${game.title}</h4>
                <a href="#" class="btn">Play Now</a>
            `;
            
            wishlistGrid.appendChild(card);
        });

        document.querySelectorAll('.remove-heart').forEach(button => {
            button.addEventListener('click', (e) => {
                const gameId = e.target.getAttribute('data-id');
                removeFromWishlist(gameId);
            });
        });
    }
}

// Delete game from list
function removeFromWishlist(gameId) {
    let wishlist = JSON.parse(localStorage.getItem('gameWishlist')) || [];
    wishlist = wishlist.filter(game => game.id !== gameId);
    localStorage.setItem('gameWishlist', JSON.stringify(wishlist));
    
    renderWishlist();
}