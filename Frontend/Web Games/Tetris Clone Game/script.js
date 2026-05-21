const gridSpace = 30;

// Game state variables
let fallingPiece;
let gridPieces = [];
let currentScore = 0;
let currentLevel = 1;
let linesCleared = 0;
let ticks = 0;
let updateEvery = 15;
let updateEveryCurrent = 15;
let fallSpeed = gridSpace * 0.5;
let pauseGame = false;
let gameOver = false;

// UI Layout constants
const gameEdgeLeft = 150;
const gameEdgeRight = 450;
const resetBtnX = 25;
const resetBtnY = 460;
const resetBtnW = 100;
const resetBtnH = 45;

// Colors
const colors = ['#dca3ff', '#ff90a0', '#80ffb4', '#ff7666', '#70b3f5', '#b2e77d', '#ffd700'];
const colorUI = '#1e2a3a'; 
const colorUIInner = '#2c3e50'; 
const colorAccent = '#ff7666'; 
const colorText = '#ecf0f1'; 

// Input state for mobile
let touchStartX = 0;
let touchStartY = 0;
let threshold = 30;

// --- Server backup ---
async function saveGameResult(gameTitle, score, level) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    const data = {
        user_id: user.id,
        username: user.username,
        game_title: gameTitle,
        score: score,
        level: "Level " + level,
        duration: "00:00",
        rank: 0
    };

    try {
        await fetch('/api/scores', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        console.log("Tetris result saved!");
    } catch (err) { console.error("Error while saving result:", err); }
}

function setup() {
    let canvas = createCanvas(600, 540);
    canvas.mousePressed(() => false);
    fallingPiece = new PlayPiece();
    fallingPiece.resetPiece();
    textFont('Ubuntu');
}

function draw() {
    background('#141e29');

    noStroke();
    fill(colorUI);
    rect(0, 0, gameEdgeLeft, height);
    rect(gameEdgeRight, 0, 150, height);

    drawInfoCard(460, 60, "SCORE", currentScore, true);
    drawInfoCard(460, 210, "LEVEL", currentLevel);
    drawInfoCard(460, 280, "LINES", linesCleared);
    
    // Next Piece Box
    fill(colorUIInner);
    rect(460, 405, 130, 120, 12);
    fill(colorText);
    textAlign(CENTER);
    textSize(14);
    text("NEXT", 525, 425);

    drawControlIcon(25, 60, "↑", "ROTATE");
    drawControlIcon(25, 140, "← →", "MOVE");
    drawControlIcon(25, 220, "↓", "FAST FALL");
    
    stroke(colorUIInner);
    strokeWeight(2);
    line(20, 310, 130, 310);
    noStroke();
    drawResetButton();

    stroke(colorUIInner);
    line(gameEdgeLeft, 0, gameEdgeLeft, height);
    line(gameEdgeRight, 0, gameEdgeRight, height);
    noStroke();
    if (!pauseGame) {
        ticks++;
        if (ticks >= (keyIsDown(DOWN_ARROW) ? 2 : updateEvery)) {
            ticks = 0;
            fallingPiece.fall(fallSpeed);
        }
    }

    fallingPiece.show();
    for (let p of gridPieces) p.show();

    if (gameOver) drawGameOver();
}

function drawInfoCard(x, y, label, value, isLarge = false) {
    fill(colorUIInner);
    rect(x, y, 130, isLarge ? 95 : 60, 12);
    fill(colorText);
    textAlign(CENTER);
    textSize(14);
    text(label, x + 65, y + 25);
    textSize(22);
    textStyle(BOLD);
    text(value, x + 65, y + (isLarge ? 70 : 50));
    textStyle(NORMAL);
}

function drawControlIcon(x, y, symbol, desc) {
    fill(colorUIInner);
    ellipse(x + 50, y + 20, 45, 45);
    
    // Symbol
    fill(colorAccent);
    textAlign(CENTER, CENTER);
    textSize(22);
    textStyle(BOLD);
    text(symbol, x + 50, y + 20);
    
    // Description
    fill(colorText);
    textSize(11);
    textStyle(NORMAL);
    text(desc, x + 50, y + 55);
}

function drawResetButton() {
    let isHover = mouseX > resetBtnX && mouseX < resetBtnX + resetBtnW && mouseY > resetBtnY && mouseY < resetBtnY + resetBtnH;
    push();
    translate(resetBtnX, resetBtnY);
    
    // Shadow
    fill(0, 50);
    rect(2, 2, resetBtnW, resetBtnH, 12);
    
    // Button body
    fill(isHover ? '#ff8a7a' : colorAccent);
    rect(0, 0, resetBtnW, resetBtnH, 12);
    
    // Text
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(16);
    textStyle(BOLD);
    text("NEW GAME", resetBtnW/2, resetBtnH/2);
    pop();
}

function drawGameOver() {
    fill(0, 200);
    rect(gameEdgeLeft, 0, gameEdgeRight - gameEdgeLeft, height);
    fill(colorAccent);
    textAlign(CENTER);
    textSize(40);
    textStyle(BOLD);
    text("GAME OVER", 300, 250);
    fill(255);
    textSize(20);
    text("Score: " + currentScore, 300, 300);
}

// --- INPUT & LOGIC ---
function mousePressed() {
    if (mouseX > resetBtnX && mouseX < resetBtnX + resetBtnW && mouseY > resetBtnY && mouseY < resetBtnY + resetBtnH) {
        resetGame();
    }
    return false;
}

function keyPressed() {
    if (!pauseGame) {
        if (keyCode === LEFT_ARROW) fallingPiece.input(LEFT_ARROW);
        else if (keyCode === RIGHT_ARROW) fallingPiece.input(RIGHT_ARROW);
        else if (keyCode === UP_ARROW) fallingPiece.input(UP_ARROW);
    }
}

function touchStarted() {
    touchStartX = mouseX;
    touchStartY = mouseY;
    if (mouseX > resetBtnX && mouseX < resetBtnX + resetBtnW && mouseY > resetBtnY && mouseY < resetBtnY + resetBtnH) {
        resetGame();
    }
    return false;
}

function touchMoved() {
    if (pauseGame || gameOver) return false;
    let dx = mouseX - touchStartX;
    let dy = mouseY - touchStartY;
    if (abs(dx) > threshold) {
        fallingPiece.input(dx > 0 ? RIGHT_ARROW : LEFT_ARROW);
        touchStartX = mouseX;
    }
    if (dy > threshold) updateEvery = 2;
    return false;
}

function touchEnded() {
    let dx = mouseX - touchStartX;
    let dy = mouseY - touchStartY;
    if (abs(dx) < 10 && abs(dy) < 10 && mouseX > gameEdgeLeft && mouseX < gameEdgeRight) {
        if (!pauseGame) fallingPiece.input(UP_ARROW);
    }
    updateEvery = updateEveryCurrent;
    return false;
}

// --- CLASSES ---
class PlayPiece {
    constructor() {
        this.pos = createVector(0, 0);
        this.rotation = 0;
        this.nextPieceType = Math.floor(Math.random() * 7);
        this.nextPieces = [];
        this.pieceType = 0;
        this.pieces = [];
        this.fallen = false;
    }

    nextPiece() {
        this.nextPieceType = pseudoRandom(this.pieceType);
        this.nextPieces = [];
        const points = orientPoints(this.nextPieceType, 0);
        for (let i = 0; i < 4; i++) {
            this.nextPieces.push(new Square(525 + points[i][0] * 24, 470 + points[i][1] * 24, this.nextPieceType, true));
        }
    }

    resetPiece() {
        this.rotation = 0;
        this.fallen = false;
        this.pos.set(300, -30);
        this.pieceType = this.nextPieceType;
        this.nextPiece();
        this.newPoints();
    }

    newPoints() {
        const points = orientPoints(this.pieceType, this.rotation);
        this.pieces = points.map(p => new Square(this.pos.x + p[0] * gridSpace, this.pos.y + p[1] * gridSpace, this.pieceType));
    }

    fall(amount) {
        if (!this.futureCollision(0, amount, this.rotation)) {
            this.pos.y += amount;
            for (let p of this.pieces) p.pos.y += amount;
            this.fallen = true;
        } else {
            if (!this.fallen) { 
                gameOver = true; 
                pauseGame = true;
                saveGameResult("Tetris", currentScore, currentLevel);
            }
            else this.commitShape();
        }
    }

    futureCollision(x, y, rotation) {
        const points = orientPoints(this.pieceType, rotation);
        for (let p of points) {
            let nx = this.pos.x + p[0] * gridSpace + x;
            let ny = this.pos.y + p[1] * gridSpace + y;
            if (nx < gameEdgeLeft || nx + gridSpace > gameEdgeRight || ny + gridSpace > height) return true;
            for (let gp of gridPieces) {
                if (nx === gp.pos.x && ny + gridSpace > gp.pos.y && ny < gp.pos.y + gridSpace) return true;
            }
        }
        return false;
    }

    input(key) {
        if (key === LEFT_ARROW && !this.futureCollision(-gridSpace, 0, this.rotation)) this.addPos(-gridSpace, 0);
        else if (key === RIGHT_ARROW && !this.futureCollision(gridSpace, 0, this.rotation)) this.addPos(gridSpace, 0);
        else if (key === UP_ARROW) {
            let newRot = (this.rotation + 1) % 4;
            if (!this.futureCollision(0, 0, newRot)) {
                this.rotation = newRot;
                this.newPoints();
            }
        }
    }

    addPos(x, y) {
        this.pos.x += x; this.pos.y += y;
        for (let p of this.pieces) { p.pos.x += x; p.pos.y += y; }
    }

    show() {
        for (let p of this.pieces) p.show();
        for (let p of this.nextPieces) p.show();
    }

    commitShape() {
        gridPieces.push(...this.pieces);
        this.resetPiece();
        analyzeGrid();
    }
}

class Square {
    constructor(x, y, type, isSmall = false) {
        this.pos = createVector(x, y);
        this.type = type;
        this.s = isSmall ? 24 : gridSpace;
    }
    show() {
        fill(colors[this.type]);
        stroke(20);
        strokeWeight(1);
        rect(this.pos.x, this.pos.y, this.s - 1, this.s - 1, 6);
        noStroke();
        fill(255, 40);
        rect(this.pos.x + 3, this.pos.y + 3, this.s/2, 2);
    }
}

function pseudoRandom(prev) {
    let r = floor(random(7));
    return r === prev ? floor(random(7)) : r;
}

function analyzeGrid() {
    let cleared = 0;
    for (let y = 0; y < height; y += gridSpace) {
        if (gridPieces.filter(p => p.pos.y === y).length >= 10) {
            gridPieces = gridPieces.filter(p => p.pos.y !== y);
            gridPieces.forEach(p => { if (p.pos.y < y) p.pos.y += gridSpace; });
            cleared++;
        }
    }
    if (cleared > 0) {
        linesCleared += cleared;
        currentScore += cleared * 100 * cleared;
        if (linesCleared % 10 === 0) {
            currentLevel++;
            updateEveryCurrent = max(2, updateEveryCurrent - 2);
        }
    }
}

function resetGame() {
    gridPieces = [];
    currentScore = 0;
    currentLevel = 1;
    linesCleared = 0;
    updateEveryCurrent = 15;
    updateEvery = 15;
    gameOver = false;
    pauseGame = false;
    fallingPiece.resetPiece();
}