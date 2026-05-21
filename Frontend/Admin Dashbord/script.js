document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem('user'));
    
    // Auth protection
    if (!user || user.role !== 1) {
        window.location.href = '/index.html';
        return;
    }
    
    async function loadUsers() {
        const tbody = document.getElementById("usersTableBody");
        if (!tbody) return;
        try {
            const res = await fetch('/api/users');
            const users = await res.json();
            tbody.innerHTML = users.length ? users.map(u => `
                <tr>
                    <td><input type="radio" name="selected_user" value="${u.id}"></td>
                    <td>${u.id}</td>
                    <td>${u.username}</td>
                    <td>${u.email}</td>
                    <td>${u.role === 1 ? 'Admin' : 'User'}</td>
                </tr>
            `).join('') : `<tr><td colspan="5" style="text-align:center;">There are no users.</td></tr>`;
        } catch (e) { console.error("Error loading users:", e); }
    }

    async function loadGames() {
        const tbody = document.getElementById("gamesTableBody");
        if (!tbody) return;
        try {
            const res = await fetch('/api/games');
            const games = await res.json();
            tbody.innerHTML = games.length ? games.map(g => `
                <tr>
                    <td><input type="radio" name="selected_game" value="${g.id}"></td>
                    <td>${g.id}</td>
                    <td>${g.title}</td>
                    <td>${g.category}</td>
                    <td>${g.min_players}</td>
                    <td>${g.status}</td>
                    <td>${g.clicks}</td>
                    <td>${g.developer || '-'}</td>
                    <td>${g.image_link || '-'}</td>
                    <td>${g.game_link || '-'}</td>
                    <td>${g.description || '-'}</td>
                    <td>${new Date(g.created_at).toLocaleDateString('en-EN')}</td>
                </tr>
            `).join('') : `<tr><td colspan="12" style="text-align:center;">There are no games registered.</td></tr>`;
        } catch (e) { console.error("Error loading games:", e); }
    }

    async function loadScores() {
        const tbody = document.getElementById("scoresTableBody");
        if (!tbody) return;
        try {
            const res = await fetch('/api/scores');
            const scores = await res.json();
            tbody.innerHTML = scores.length ? scores.map(s => {
                return `
                    <tr>
                        <td><input type="radio" name="selected_score" value="${s.id}"></td>
                        <td>${s.id}</td>
                        <td>${s.user_id}</td>
                        <td>${s.username}</td>
                        <td>${s.game_title}</td>
                        <td>${s.level || '-'}</td>
                        <td>${s.score}</td>
                        <td>${s.duration || '-'}</td>
                        <td>${s.achieved_at ? new Date(s.achieved_at).toLocaleDateString('en-EN') : '-'}</td>
                    </tr>`;
            }).join('') : `<tr><td colspan="7" style="text-align:center;">There are no scores!</td></tr>`;
        } catch (e) { console.error("Error loading scores:", e); }
    }

    async function loadContactMessages() {
        const tbody = document.getElementById("contactTableBody");
        if (!tbody) return;
        try {
            const res = await fetch('/api/contact');
            const msgs = await res.json();
            tbody.innerHTML = msgs.length ? msgs.map(m => `
                <tr>
                    <td><input type="radio" name="selected_contact" value="${m.id}"></td>
                    <td>${m.id}</td>
                    <td>${m.name}</td>
                    <td>${m.email}</td>
                    <td>${m.phone || '-'}</td>
                    <td>${m.subject || '-'}</td>
                    <td>${m.message}</td>
                    <td>${new Date(m.created_at).toLocaleDateString('en-EN')}</td>
                </tr>
            `).join('') : `<tr><td colspan="8" style="text-align:center;">There are no messages.</td></tr>`;
        } catch (e) { console.error("Error loading contact messages:", e); }
    }

    loadUsers();
    loadGames();
    loadScores();
    loadContactMessages();

    // Modal Management
    const roleModal = document.getElementById("roleModal");
    const gameModal = document.getElementById("gameModal");
    const closeRoleModal = document.getElementById("closeRoleModal");
    const closeGameModal = document.getElementById("closeGameModal");

    if (closeRoleModal) closeRoleModal.addEventListener("click", () => roleModal.style.display = "none");
    if (closeGameModal) closeGameModal.addEventListener("click", () => gameModal.style.display = "none");
    
    window.addEventListener("click", (event) => {
        if (event.target === roleModal) roleModal.style.display = "none";
        if (event.target === gameModal) gameModal.style.display = "none";
    });

    // Delete  
    document.getElementById("deleteUserBtn")?.addEventListener("click", async () => {
        const selected = document.querySelector('input[name="selected_user"]:checked');
        if (!selected) return showToast("Please select a user to delete!", "warning");
        
        try {
            const res = await fetch(`/api/users/${selected.value}`, { method: 'DELETE' });
            if (res.ok) {
                showToast("User deleted successfully!", "success");
                loadUsers();
            } else showToast("Error deleting user.", "error");
        } catch (e) { console.error(e); }
    });

    document.getElementById("deleteGameBtn")?.addEventListener("click", async () => {
        const selected = document.querySelector('input[name="selected_game"]:checked');
        if (!selected) return showToast("Please select a game to delete!", "warning");
        
        try {
            const res = await fetch(`/api/games/${selected.value}`, { method: 'DELETE' });
            if (res.ok) {
                showToast("Game deleted successfully!", "success");
                loadGames();
            } else showToast("Error deleting game.", "error");
        } catch (e) { console.error(e); }
    });

    document.getElementById("deleteScoreBtn")?.addEventListener("click", async () => {
        const selected = document.querySelector('input[name="selected_score"]:checked');
        if (!selected) return showToast("Please select a score to delete!", "warning");
        
        try {
            const res = await fetch(`/api/scores/${selected.value}`, { method: 'DELETE' });
            if (res.ok) {
                showToast("Score deleted successfully!", "success");
                loadScores();
            } else showToast("Error deleting score.", "error");
        } catch (e) { console.error(e); }
    });

    document.getElementById("deleteContactBtn")?.addEventListener("click", async () => {
        const selected = document.querySelector('input[name="selected_contact"]:checked');
        if (!selected) return showToast("Please select a message to delete!", "warning");
        
        try {
            const res = await fetch(`/api/contact/${selected.value}`, { method: 'DELETE' });
            if (res.ok) {
                showToast("Message deleted successfully!", "success");
                loadContactMessages();
            } else showToast("Error deleting message.", "error");
        } catch (e) { console.error(e); }
    });

    // Modify & Add
    // --- User Role ---
    document.getElementById("modifyUserBtn")?.addEventListener("click", () => {
        const selected = document.querySelector('input[name="selected_user"]:checked');
        if (selected) {
            document.getElementById("modalUserId").value = selected.value;
            roleModal.style.display = "flex"; 
        } else {
            showToast("Please select a user from the table!", "warning");
        }
    });

    document.getElementById("modifyRoleForm")?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const userId = document.getElementById("modalUserId").value;
        const newRoleValue = document.getElementById("modalUserRole").value;

        try {
            const res = await fetch(`/api/users/${userId}/role`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: newRoleValue })
            });

            if (res.ok) {
                roleModal.style.display = "none";
                showToast("User role updated successfully!", "success");
                loadUsers();
            } else showToast("Error updating role.", "error");
        } catch (e) { console.error(e); }
    });

    // --- Game Modal Opening ---
    document.getElementById("addGameBtn")?.addEventListener("click", () => {
        document.getElementById("gameForm").reset();
        document.getElementById("gameId").value = ""; 
        document.getElementById("gameModalTitle").innerText = "Add New Game";
        gameModal.style.display = "flex"; 
    });

    document.getElementById("modifyGameBtn")?.addEventListener("click", () => {
    const selected = document.querySelector('input[name="selected_game"]:checked');
        if (selected) {
            const row = selected.closest('tr');
            document.getElementById("gameId").value = selected.value.trim();
            document.getElementById("gameModalTitle").innerText = "Modify Game (ID: " + selected.value.trim() + ")";
            
            // Safe value assignment helper
            const setVal = (id, val) => {
                const el = document.getElementById(id);
                if (el) {
                    el.value = val;
                } else {
                    console.error("ERROR: Cannot find the field with this ID: " + id);
                }
            };

            // Use the exact IDs from your index.html here!
            setVal("title", row.cells[2].innerText.trim());
            setVal("category", row.cells[3].innerText.trim());
            setVal("min_players", row.cells[4].innerText.trim());
            
            const statusText = row.cells[5].innerText.trim();
            setVal("status", statusText === "Active" ? "Active" : "Inactive");
            
            setVal("developer", row.cells[6].innerText.trim() === "-" ? "" : row.cells[6].innerText.trim());
            setVal("image_link", row.cells[8].innerText.trim() === "-" ? "" : row.cells[8].innerText.trim());
            setVal("game_link", row.cells[9].innerText.trim() === "-" ? "" : row.cells[9].innerText.trim());
            setVal("description", row.cells[10].innerText.trim() === "-" ? "" : row.cells[10].innerText.trim());
            
            gameModal.style.display = "flex"; 
        } else {
            showToast("Please select a game from the table!", "warning");
        }
    });

    // --- Game Save ---
    document.getElementById("gameForm")?.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const gameId = document.getElementById("gameId").value.trim();
        const method = gameId ? 'PUT' : 'POST';
        const url = gameId ? `/api/games/${gameId}` : '/api/games';

        const gameData = {
            // Az eredeti ID-kat olvassuk ki:
            title: document.getElementById("title").value.trim(),
            category: document.getElementById("category").value.trim(),
            min_players: Number(document.getElementById("min_players").value),
            developer: document.getElementById("developer").value.trim(),
            status: document.getElementById("status").value,
            image_link: document.getElementById("image_link").value.trim(),
            game_link: document.getElementById("game_link").value.trim(),
            description: document.getElementById("description").value.trim()
        };

        try {
            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(gameData)
            });

            if (res.ok) {
                gameModal.style.display = "none";
                showToast(gameId ? "Game updated successfully!" : "New game added successfully!", "success");
                loadGames();
            } else {
                const errorData = await res.json().catch(() => ({}));
                const errorMessage = errorData.message || "Error saving game!";
                showToast(errorMessage, "error");
            }
        } catch (e) { 
            console.error("Network error:", e); 
            showToast("Network error occurred!", "error");
        }
    });

    // --- Score Save ---
    document.getElementById("scoreForm")?.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const scoreId = document.getElementById("scoreId").value.trim();
        if (!scoreId) return;

        const scoreData = {
            user_id: document.getElementById("scoreUserId").value.trim(),
            username: document.getElementById("scoreUsername").value.trim(),
            game_title: document.getElementById("scoreGameTitle").value.trim(),
            score: Number(document.getElementById("scoreValue").value),
            level: Number(document.getElementById("scoreLevel").value),
            duration: Number(document.getElementById("scoreDuration").value),
            rank: Number(document.getElementById("scoreRank").value)
        };

        try {
            const res = await fetch(`/api/scores/${scoreId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(scoreData)
            });

            if (res.ok) {
                const scoreModal = document.getElementById("scoreModal");
                if(scoreModal) scoreModal.style.display = "none";
                showToast("Score updated successfully!", "success");
                loadScores();
            } else {
                const errorData = await res.json().catch(() => ({}));
                showToast(errorData.message || "Error updating score.", "error");
            }
        } catch (e) { 
            console.error("Network error:", e); 
            showToast("Network error occurred!", "error");
        }
    });

    const scoreModal = document.getElementById("scoreModal");
    const closeScoreModal = document.getElementById("closeScoreModal");
    if (closeScoreModal) {
        closeScoreModal.addEventListener("click", () => scoreModal.style.display = "none");
    }
});

// File Browser logika
document.getElementById('filePickerIcon')?.addEventListener('click', () => {
    document.getElementById('imageFileInput').click();
});

document.getElementById('imageFileInput')?.addEventListener('change', function(event) {
    if (event.target.files.length > 0) {
        document.getElementById('image_link').value = 'image/' + event.target.files[0].name;
    }
});