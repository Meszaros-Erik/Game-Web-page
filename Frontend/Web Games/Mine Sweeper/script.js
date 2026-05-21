const grid = document.getElementById("grid");
let lockGame = false;
let flagMode = false;

// Timer variables
let timerInterval = null;
let timeElapsed = 0;
let firstClick = true;

// --- Server backup ---
async function saveGameResult(gameTitle, score, level, duration) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;
    const data = {
        user_id: user.id,
        username: user.username,
        game_title: gameTitle,
        score: score,
        level: level,
        duration: duration,
        rank: 0
    };

    try {
        await fetch('/api/scores', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        console.log("Minesweeper result saved!");
    } catch (err) { console.error("Error while saving result:", err); }
}

// Time formatting function (MM:SS)
function formatTime(totalSeconds) {
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
}

// Timer functions
function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeElapsed++;
        document.getElementById('timer').innerText = `Time: ${formatTime(timeElapsed)}`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function resetTimer() {
    stopTimer();
    timeElapsed = 0;
    const timerElement = document.getElementById('timer');
    if (timerElement) {
        timerElement.innerText = `Time: 00:00`;
    }
}

// Set test mode to true if you want see mines location
const testMode = false;
generateGrid();

function toggleMode() {
    flagMode = !flagMode;
    const btn = document.getElementById("mode-btn");
    btn.innerHTML = flagMode ? "Mode: Flag" : "Mode: Reveal";
}

// Generate 10 * 10 Grid
function generateGrid() {
    lockGame = false;
    flagMode = false;

    firstClick = true;
    resetTimer();

    document.getElementById("mode-btn").innerHTML = "Mode: Reveal";
    grid.innerHTML = "";
    for (var i = 0; i < 10; i++) {
        var row = grid.insertRow(i);
        for (var j = 0; j < 10; j++) {
            var cell = row.insertCell(j);
            cell.onclick = function () { init(this); };
            var mine = document.createAttribute("mine");
            mine.value = "false";
            cell.setAttributeNode(mine);
        }
    }
    generateMines();
}

// Generate mines randomly
function generateMines() {
    // Add 20 mines to game
    for (var i = 0; i < 20; i++) {
        var row = Math.floor(Math.random() * 10);
        var col = Math.floor(Math.random() * 10);
        var cell = grid.rows[row].cells[col];
        cell.setAttribute("mine", "true");
        if (testMode) {
            cell.innerHTML = "X";
        }
    }
}

// Highlight all mines red
function revealMines() {
    stopTimer();
    saveGameResult("Mine Sweeper", 0, "Hard", formatTime(timeElapsed));
    
    let delay = 0;
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            var cell = grid.rows[i].cells[j];
            var hasMine = cell.getAttribute("mine") == "true";
            var hasFlag = cell.classList.contains("flag");

            if (hasMine) {
                setTimeout((c, flag) => {
                    if (flag) {
                        c.className = "correct-flag";
                        c.innerHTML = "X";
                    } else {
                        c.className = "mine";
                        c.innerHTML = "💣";
                    }
                }, delay, cell, hasFlag);
                delay += 50;
            } 
        }
    }
}

function checkGameComplete() {
    var gameComplete = true;
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            if ((grid.rows[i].cells[j].getAttribute("mine") == "false") && (grid.rows[i].cells[j].innerHTML == "")) {
                gameComplete = false;
            }
        }
    }
    if (gameComplete) {
        stopTimer();
        saveGameResult("Mine Sweeper", 100, "Hard", formatTime(timeElapsed));
        alert(`You Found All Mines in ${formatTime(timeElapsed)}!`);
        revealMines();
    }
}

function init(cell) {
    if (lockGame) return;
    if (firstClick) {
        startTimer();
        firstClick = false;
    }

    if (flagMode) {
        if (cell.classList.contains("active")) return;

        if (cell.classList.contains("flag")) {
            cell.classList.remove("flag");
            cell.innerHTML = "";
        } else {
            cell.classList.add("flag");
            cell.innerHTML = "🚩";
        }
        return;
    }

    if (cell.classList.contains("flag")) return;
    if (cell.getAttribute("mine") == "true") {
        revealMines();
        lockGame = true;
    } else {
        if (cell.innerHTML != "") return;

        cell.className = "active";
        var mineCount = 0;
        var cellRow = cell.parentNode.rowIndex;
        var cellCol = cell.cellIndex;
        
        for (var i = Math.max(cellRow - 1, 0); i <= Math.min(cellRow + 1, 9); i++) {
            for (var j = Math.max(cellCol - 1, 0); j <= Math.min(cellCol + 1, 9); j++) {
                if (grid.rows[i].cells[j].getAttribute("mine") == "true") {
                    mineCount++;
                }
            }
        }
        cell.innerHTML = mineCount;
        
        if (mineCount == 0) {
            for (var i = Math.max(cellRow - 1, 0); i <= Math.min(cellRow + 1, 9); i++) {
                for (var j = Math.max(cellCol - 1, 0); j <= Math.min(cellCol + 1, 9); j++) {
                    if (grid.rows[i].cells[j].innerHTML == "") {
                        init(grid.rows[i].cells[j]);
                    }
                }
            }
        }
        checkGameComplete();
    }
}