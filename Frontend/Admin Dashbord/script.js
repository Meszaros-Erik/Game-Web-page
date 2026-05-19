document.addEventListener("DOMContentLoaded", () => {
    
    // --- Modal parts ---
    const roleModal = document.getElementById("roleModal");
    const gameModal = document.getElementById("gameModal");
    
    const closeRoleModal = document.getElementById("closeRoleModal");
    const closeGameModal = document.getElementById("closeGameModal");

    const modifyUserBtn = document.getElementById("modifyUserBtn");
    const addGameBtn = document.getElementById("addGameBtn");
    const modifyGameBtn = document.getElementById("modifyGameBtn");

    // --- USER ROLE ---
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

    // --- GAME (ADD & MODIFY) ---
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