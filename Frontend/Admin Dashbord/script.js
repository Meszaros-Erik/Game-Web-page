document.addEventListener("DOMContentLoaded", () => {
    
    // --- Users List ---
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
        } catch (e) { 
            console.error("Error loading users:", e); 
        }
    }

    // --- Games List ---
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
                </tr>
            `).join('') : `<tr><td colspan="7" style="text-align:center;">There are no games registered.</td></tr>`;
        } catch (e) { console.error("Error loading games:", e); }
    }

    // --- Scores List ---
    async function loadScores() {
        const tbody = document.getElementById("scoresTableBody");
        if (!tbody) return;
        try {
            const res = await fetch('/api/scores');
            const scores = await res.json();
            tbody.innerHTML = scores.length ? scores.map(s => {
                const date = new Date(s.achieved_at).toLocaleDateString('hu-HU');
                return `
                    <tr>
                        <td><input type="radio" name="selected_score" value="${s.id}"></td>
                        <td>${s.id}</td>
                        <td>${s.user_id}</td>
                        <td><strong>${s.username}</strong></td>
                        <td>${s.game_title}</td>
                        <td><strong style="color: #1a36d8;">${s.score}</strong></td>
                        <td>${date}</td>
                    </tr>`;
            }).join('') : `<tr><td colspan="7" style="text-align:center;">There are no scores.</td></tr>`;
        } catch (e) { console.error("Error loading scores:", e); }
    }

    // --- Contact Messages List ---
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
                    <td>${new Date(m.created_at).toLocaleDateString('hu-HU')}</td>
                </tr>
            `).join('') : `<tr><td colspan="8" style="text-align:center;">There are no messages.</td></tr>`;
        } catch (e) { console.error("Error loading contact messages:", e); }
    }

    loadUsers();
    loadGames();
    loadScores();
    loadContactMessages();
  
    // --- Modal parts ---
    const roleModal = document.getElementById("roleModal");
    const gameModal = document.getElementById("gameModal");
    
    const closeRoleModal = document.getElementById("closeRoleModal");
    const closeGameModal = document.getElementById("closeGameModal");

    const modifyUserBtn = document.getElementById("modifyUserBtn");
    const addGameBtn = document.getElementById("addGameBtn");
    const modifyGameBtn = document.getElementById("modifyGameBtn");

    // --- User Role ---
    if (modifyUserBtn) {
        modifyUserBtn.addEventListener("click", () => {
            const selectedUser = document.querySelector('input[name="selected_user"]:checked');
            if (selectedUser) {
                document.getElementById("modalUserId").value = selectedUser.value;
                roleModal.style.display = "flex"; 
            } else {
                showToast("Please select a user from the table!", "warning");
            }
        });
    }

    // --- Game ---
    if (addGameBtn) {
        addGameBtn.addEventListener("click", () => {
            const gameForm = document.getElementById("gameForm");
            if (gameForm) gameForm.reset();
            document.getElementById("gameId").value = "";
            document.getElementById("gameModalTitle").innerText = "Add New Game";
            gameModal.style.display = "flex"; 
        });
    }

    if (modifyGameBtn) {
        modifyGameBtn.addEventListener("click", () => {
            const selectedGame = document.querySelector('input[name="selected_game"]:checked');
            if (selectedGame) {
                document.getElementById("gameId").value = selectedGame.value;
                document.getElementById("gameModalTitle").innerText = "Modify Game (ID: " + selectedGame.value + ")";
                gameModal.style.display = "flex"; 
            } else {
                showToast("Please select a game from the table!", "warning");
            }
        });
    }

    if (closeRoleModal) closeRoleModal.addEventListener("click", () => roleModal.style.display = "none");
    if (closeGameModal) closeGameModal.addEventListener("click", () => gameModal.style.display = "none");
    
    window.addEventListener("click", (event) => {
        if (event.target === roleModal) roleModal.style.display = "none";
        if (event.target === gameModal) gameModal.style.display = "none";
    });
});