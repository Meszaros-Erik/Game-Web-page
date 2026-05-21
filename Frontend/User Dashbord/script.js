document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem('user'));
    
    // Auth protection
    if (!user) {
        alert("Please log in!");
        window.location.href = '../Login & Registration/index.html';
        return;
    }
    
    // Loading and displaying scores
    async function loadUserScores() {
        const user = JSON.parse(localStorage.getItem('user'));
        const tableBody = document.getElementById("userScoresBody");
        
        if (!tableBody) return;

        try {
            const res = await fetch('/api/scores');
            const allScores = await res.json();
            const userScores = allScores.filter(s => s.user_id === user.id);

            tableBody.innerHTML = "";

            if (userScores.length === 0) {
                tableBody.innerHTML = "<tr><td colspan='7' style='text-align:center;'>You don't have any saved scores yet!</td></tr>";
                return;
            }

            userScores.forEach(score => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><input type="radio" class="score-checkbox" value="${score.id}"></td>
                    <td>${score.game_title}</td>
                    <td>${score.level || '-'}</td>
                    <td>${score.score}</td>
                    <td>${score.duration || '-'}</td>
                    <td>${score.achieved_at ? new Date(score.achieved_at).toLocaleDateString('en-EN') : '-'}</td>
                `;
                tableBody.appendChild(row);
            });
        } catch (err) {
            console.error("Error loading:", err);
        }
    }

    // Delete functionality
    async function deleteSelectedScores() {
        const checkboxes = document.querySelectorAll('.score-checkbox:checked');
        if (checkboxes.length === 0) return alert("Please select at least one!");
        if (!confirm("Are you sure you want to delete the selected results?")) return;

        for (const cb of checkboxes) {
        await fetch(`/api/scores/${cb.value}`, { method: 'DELETE' });
        }
        loadUserScores();
    }

    function showCustomConfirm(message) {
        return new Promise((resolve) => {
            const modal = document.getElementById("customConfirmModal");
            const msg = document.getElementById("modalMessage");
            const btnOk = document.getElementById("btnConfirm");
            const btnCancel = document.getElementById("btnCancel");

            msg.innerText = message;
            modal.style.display = "flex";

            btnOk.onclick = () => { modal.style.display = "none"; resolve(true); };
            btnCancel.onclick = () => { modal.style.display = "none"; resolve(false); };
        });
    }

    // Delete btn functionality
    window.handleDeleteAction = async function() {
        const selectedCheckboxes = document.querySelectorAll('.score-checkbox:checked');
        if (selectedCheckboxes.length === 0) {
            showToast("Please select at least one score to delete!", "error");
            return;
        }
        const isConfirmed = await showCustomConfirm(`Are you sure you want to delete these ${selectedCheckboxes.length} score(s)?`);
        
        if (isConfirmed) {
            try {
                for (const cb of selectedCheckboxes) {
                    await fetch(`/api/scores/${cb.value}`, { method: 'DELETE' });
                }
                
                showToast("Selected scores deleted successfully!", "success");
                loadUserScores();
            } catch (err) {
                console.error("Error deleting scores:", err);
                showToast("Server error!", "error");
            }
        }
    };
    loadUserScores();

    window.toggleAll = function(source) {
        const checkboxes = document.querySelectorAll('.score-checkbox');
        checkboxes.forEach(cb => cb.checked = source.checked);
    };

    // Loading profile data
    const editUsername = document.getElementById("editUsername");
    if (editUsername) editUsername.value = user.username;
    
    // Show profile picture from the path sent by the server
    const userProfileImg = document.getElementById("userProfileImg");
    if (userProfileImg && user.profile_picture) {
        userProfileImg.src = user.profile_picture + '?t=' + new Date().getTime();
    }

    // Profil picture upload
    document.getElementById('picFile').addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('profilePic', file);

        const res = await fetch('/api/upload-profile-pic', { method: 'POST', body: formData });
        const data = await res.json();
        
        if (data.fileName) { 
            const finalPath = '/image/' + data.fileName;
            
            document.getElementById('userProfileImg').src = finalPath + '?t=' + new Date().getTime();
            
            const currentUser = JSON.parse(localStorage.getItem('user'));
            currentUser.profile_picture = finalPath;
            localStorage.setItem('user', JSON.stringify(currentUser));
        }
    });

    // Profil changes save
    window.saveProfileChanges = async function() {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        
        const username = document.getElementById('editUsername').value;
        const oldPass = document.getElementById('oldPassword').value;
        const newPass = document.getElementById('newPassword').value;

        const data = {
            username: username,
            oldPassword: oldPass,
            newPassword: newPass,
            profile_picture: currentUser.profile_picture
        };

        try {
            const res = await fetch(`/api/users/profile/${currentUser.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await res.json();
            
            if (result.success) {
                showToast("Changes saved!", "success");
                currentUser.username = username;
                localStorage.setItem('user', JSON.stringify(currentUser));
                
                setTimeout(() => location.reload(), 1500);
            } else {
                showToast("Error: " + result.message, "error");
            }
        } catch (err) {
            showToast("Server error!", "error");
        }
    };

    // Password toggle logic
    function setupPasswordToggle(inputId, iconId) {
        const input = document.getElementById(inputId);
        const icon = document.getElementById(iconId);
        
        if (!input || !icon) {
            console.error(`Error: Can't find ${inputId} or ${iconId}!`);
            return;
        }

        icon.addEventListener("click", () => {
            if (input.type === "password") {
                input.type = "text";
                icon.classList.remove("bx-hide");
                icon.classList.add("bx-show");
            } else {
                input.type = "password";
                icon.classList.remove("bx-show");
                icon.classList.add("bx-hide");
            }
        });
    }

    setupPasswordToggle("oldPassword", "toggleOld");
    setupPasswordToggle("newPassword", "toggleNew");
});