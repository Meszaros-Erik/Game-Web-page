let board;
let score = 0;
let rows = 4;
let columns = 4;

let timer;
let seconds = 0;

// Játék indítása az oldal betöltésekor
window.onload = function() {
    setGame();
}

function setGame() {
    // Tábla alaphelyzetbe állítása
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ];

    // HTML tábla kiürítése (reset esetére)
    const boardElement = document.getElementById("board");
    boardElement.innerHTML = "";

    // Tábla felépítése tile-okból
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            let num = board[r][c];
            updateTile(tile, num);
            boardElement.append(tile);
        }
    }

    // Kezdő két darab "2"-es elhelyezése
    setTwo();
    setTwo();
    
    // Időmérő újraindítása
    startTimer();
}

function updateTile(tile, num) {
    tile.innerText = "";
    tile.classList.value = ""; // Osztályok törlése
    tile.classList.add("tile");
    if (num > 0) {
        tile.innerText = num.toString();
        if (num <= 4096) {
            tile.classList.add("x" + num.toString());
        } else {
            tile.classList.add("x8192");
        }
    }
}

// Időmérő logika
function startTimer() {
    clearInterval(timer);
    seconds = 0;
    document.getElementById("time-num").innerText = "00:00";
    timer = setInterval(() => {
        seconds++;
        let mins = Math.floor(seconds / 60);
        let secs = seconds % 60;
        document.getElementById("time-num").innerText = 
            (mins < 10 ? "0" : "") + mins + ":" + (secs < 10 ? "0" : "") + secs;
    }, 1000);
}

// Billentyűzet események
document.addEventListener("keyup", (e) => {
    let moved = false;
    if (e.key == "ArrowLeft") {
        slideLeft();
        moved = true;
    } else if (e.key == "ArrowRight") {
        slideRight();
        moved = true;
    } else if (e.key == "ArrowUp") {
        slideUp();
        moved = true;
    } else if (e.key == "ArrowDown") {
        slideDown();
        moved = true;
    }

    if (moved) {
        setTwo();
        document.getElementById("score-num").innerText = score;
    }
});

// Reset gomb eseménykezelő
document.getElementById("reset-btn").addEventListener("click", () => {
    score = 0;
    document.getElementById("score-num").innerText = score;
    setGame();
});

function filterZero(row) {
    return row.filter((num) => num != 0);
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
    while (row.length < columns) {
        row.push(0);
    }
    return row;
}

function slideLeft() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row = slide(row);
        board[r] = row;
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideRight() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row.reverse();
        row = slide(row);
        board[r] = row.reverse();
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideUp() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row = slide(row);
        for (let r = 0; r < rows; r++) {
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
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
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function setTwo() {
    if (!hasEmptyTile()) return;
    let found = false;
    while (!found) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        if (board[r][c] == 0) {
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            updateTile(tile, 2);
            found = true;
        }
    }
}

function hasEmptyTile() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0) return true;
        }
    }
    return false;
}