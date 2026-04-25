const grid = document.getElementById("grid");
let lockGame = false;
let flagMode = false;

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
    document.getElementById("mode-btn").innerHTML = "Mode: Reveal";
    grid.innerHTML = "";
    for (var i = 0; i < 10; i++) {
        row = grid.insertRow(i);
        for (var j = 0; j < 10; j++) {
            cell = row.insertCell(j);
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
        alert("You Found All Mines!");
        revealMines();
    }
}

function init(cell) {
    if (lockGame) return;

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