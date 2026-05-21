let board;
let score = 0;
let rows = 4;
let columns = 4;
let timer;
let seconds = 0;
let touchStartX = 0;
let touchStartY = 0;

window.onload = function() {
    setGame();
}

function setGame() {
    board = [ 
        [0, 0, 0, 0], 
        [0, 0, 0, 0], 
        [0, 0, 0, 0], 
        [0, 0, 0, 0] ];
    const boardElement = document.getElementById("board");
    boardElement.innerHTML = "";

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r + "-" + c;
            updateTile(tile, 0);
            boardElement.append(tile);
        }
    }
    setTwo(); setTwo();
    startTimer();
}

function updateTile(tile, num) {
    tile.innerText = "";
    tile.className = "tile";
    if (num > 0) {
        tile.innerText = num;
        tile.classList.add("x" + num);
    }
}

// --- Check game end ---
function isGameOver() {
    if (!board || board.length === 0) return false;

    for (let r = 0; r < rows; r++) {
        if (!board[r]) continue; 

        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0) return false;
            if (c < columns - 1 && board[r][c] == board[r][c + 1]) return false;
            if (r < rows - 1 && board[r + 1] && board[r][c] == board[r + 1][c]) return false;
        }
    }
    return true;
}

if (isGameOver()) {
    clearInterval(timer);
    const timeElement = document.getElementById("time-num");
    const timePlayed = (timeElement && timeElement.innerText) ? timeElement.innerText : "0:00"; 
    
    console.log("Time to save:", timePlayed);
    
    saveGameResult("2048 Game", score, '-', timePlayed, 0);
    alert("Game Over! Result saved.");
}

// --- Server backup ---
async function saveGameResult(gameTitle, score = 0, level = '-', duration = '0:00') {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    const data = {
        user_id: user.id,
        username: user.username,
        game_title: gameTitle,
        score: score,
        level: level,
        duration: duration
    };
    try {
        await fetch('/api/scores', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            console.log("Successful rescue!");
        } else {
            console.error("Server error:", await response.text());
        }
    } catch (err) { 
        console.error("Error saving game result:", err); 
    }
}

document.addEventListener("keyup", (e) => {
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
        handleMove(e.key);
    }
});

document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
}, false);

document.addEventListener('touchend', e => {
    let dx = e.changedTouches[0].screenX - touchStartX;
    let dy = e.changedTouches[0].screenY - touchStartY;
    
    if (Math.abs(dx) > 30 || Math.abs(dy) > 30) {
        if (Math.abs(dx) > Math.abs(dy)) {
            handleMove(dx > 0 ? "ArrowRight" : "ArrowLeft");
        } else {
            handleMove(dy > 0 ? "ArrowDown" : "ArrowUp");
        }
    }
}, false);

function handleMove(direction) {
    let originalBoard = JSON.stringify(board);
    
    if (direction == "ArrowLeft") slideLeft();
    else if (direction == "ArrowRight") slideRight();
    else if (direction == "ArrowUp") slideUp();
    else if (direction == "ArrowDown") slideDown();

    document.getElementById("score-num").innerText = score;

    if (originalBoard !== JSON.stringify(board)) {
        setTwo();
    }
}

function setTwo() {
    let empty = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) { 
            if (board[r][c] == 0) empty.push({r, c}); 
        }
    }
    
    if (empty.length > 0) {
        let spot = empty[Math.floor(Math.random() * empty.length)];
        board[spot.r][spot.c] = 2;
        updateTile(document.getElementById(spot.r + "-" + spot.c), 2);
    } 
    
    if (isGameOver()) {
        clearInterval(timer);
        const timePlayed = document.getElementById("time-num").innerText;
        
        saveGameResult("2048 Game", score, "Standard", timePlayed);
        alert("Game Over! Result saved.");
    }
}

function filterZero(row) {
    return row.filter(num => num != 0); 
}

function slide(row) {
    row = filterZero(row);
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] == row[i + 1]) {
            row[i] *= 2;
            row[i + 1] = 0;
            score += row[i]; 
        }
    }
    row = filterZero(row);
    while (row.length < columns) { row.push(0); }
    return row;
}

function slideLeft() {
    for (let r = 0; r < rows; r++) {
        board[r] = slide(board[r]);
        for (let c = 0; c < columns; c++) updateTile(document.getElementById(r + "-" + c), board[r][c]);
    }
}

function slideRight() {
    for (let r = 0; r < rows; r++) {
        board[r].reverse();
        board[r] = slide(board[r]);
        board[r].reverse();
        for (let c = 0; c < columns; c++) updateTile(document.getElementById(r + "-" + c), board[r][c]);
    }
}

function slideUp() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row = slide(row);
        for (let r = 0; r < rows; r++) {
            board[r][c] = row[r];
            updateTile(document.getElementById(r + "-" + c), board[r][c]);
        }
    }
}

function slideDown() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row.reverse();
        row = slide(row);
        row.reverse();
        for (let r = 0; r < rows; r++) {
            board[r][c] = row[r];
            updateTile(document.getElementById(r + "-" + c), board[r][c]);
        }
    }
}

function startTimer() {
    clearInterval(timer);
    seconds = 0;
    timer = setInterval(() => {
        seconds++;
        let mins = Math.floor(seconds / 60);
        let secs = seconds % 60;
        document.getElementById("time-num").innerText = 
            (mins < 10 ? "0" : "") + mins + ":" + (secs < 10 ? "0" : "") + secs;
    }, 1000);
}

document.getElementById("reset-btn").addEventListener("click", () => {
    if (score > 0) {
        saveGameResult("2048 Game", score, "Standard", document.getElementById("time-num").innerText);
    }
    
    score = 0;
    document.getElementById("score-num").innerText = 0;
    setGame();
});