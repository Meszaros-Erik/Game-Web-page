let canvas = document.getElementById('game'),
    ctx = canvas.getContext('2d'),
    ballRadius = 10,
    x, y, dx, dy,
    paddleHeight = 15,
    paddleWidth, paddleX,
    score = 0,
    level = 1,
    maxLevel = 5,
    bricksDestroyed = 0,
    isRunning = false;

const colors = ['#FF595E', '#FFCA3A', '#8AC926', '#1982C4', '#6A4C93'];

let rowCount, columnCount = 10, brickWidth = 66, brickHeight = 22, brickPadding = 10, topOffset = 60, leftOffset = 25;
let bricks = [];

// --- Server backup ---
async function saveGameResult(gameTitle, score, level, duration) {
    console.log("Starting save...");
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        console.log("Error: No logged-in user!");
        return;
    }
    
    const data = {
        user_id: user.id,
        username: user.username,
        game_title: gameTitle,
        score: score,
        level: "Level " + level,
        duration: duration
    };

    console.log("Sent data:", data);

    try {
        const response = await fetch('/api/scores', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        console.log("Server response:", result);
    } catch (err) { console.error("Error while saving:", err); }
}

function getFormattedTime() {
    let totalSeconds = Math.floor((Date.now() - startTime) / 1000);
    let mins = Math.floor(totalSeconds / 60);
    let secs = totalSeconds % 60;
    return (mins < 10 ? "0" : "") + mins + ":" + (secs < 10 ? "0" : "") + secs;
}

function applyLevelSettings() {
    rowCount = 2 + level;
    dx = 3 + level;
    dy = -(3 + level);
    paddleWidth = 120 - (level * 10);
    paddleX = (canvas.width - paddleWidth) / 2;
    bricksDestroyed = 0;
    x = canvas.width / 2;
    y = canvas.height - 50;

    for (let c = 0; c < columnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < rowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }
}

document.addEventListener("mousemove", (e) => {
    let rect = canvas.getBoundingClientRect();
    let scaleX = canvas.width / rect.width; 
    let relativeX = (e.clientX - rect.left) * scaleX;
    if (relativeX > 0 && relativeX < canvas.width) paddleX = relativeX - paddleWidth / 2;
});

canvas.addEventListener("touchmove", (e) => {
    let rect = canvas.getBoundingClientRect();
    let scaleX = canvas.width / rect.width;
    let touchX = (e.touches[0].clientX - rect.left) * scaleX;
    if (touchX > 0 && touchX < canvas.width) paddleX = touchX - paddleWidth / 2;
    e.preventDefault();
}, {passive: false});

function drawHUD() {
    ctx.fillStyle = "#333";
    ctx.font = "bold 20px Arial";
    ctx.textAlign = "left";
    ctx.fillText("Score: " + score, 25, 35);
    ctx.textAlign = "right";
    ctx.fillText("Level: " + level + " / " + maxLevel, canvas.width - 25, 35);
}

function drawBricks() {
    for (let c = 0; c < columnCount; c++) {
        for (let r = 0; r < rowCount; r++) {
            if (bricks[c][r].status === 1) {
                let brickX = (c * (brickWidth + brickPadding)) + leftOffset;
                let brickY = (r * (brickHeight + brickPadding)) + topOffset;
                bricks[c][r].x = brickX; bricks[c][r].y = brickY;
                
                ctx.beginPath();
                ctx.roundRect(brickX, brickY, brickWidth, brickHeight, 6);
                ctx.fillStyle = colors[r % colors.length];
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function update() {
    if (!isRunning) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawHUD();
    drawBricks();
    
    ctx.beginPath(); ctx.arc(x, y, ballRadius, 0, Math.PI * 2); ctx.fillStyle = '#333'; ctx.fill(); ctx.closePath();
    ctx.beginPath(); ctx.roundRect(paddleX, canvas.height - paddleHeight - 10, paddleWidth, paddleHeight, 8); ctx.fill(); ctx.closePath();
    
    for (let c = 0; c < columnCount; c++) {
        for (let r = 0; r < rowCount; r++) {
            let b = bricks[c][r];
            if (b.status === 1 && x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                dy = -dy; b.status = 0; score += (10 * level); bricksDestroyed++;
                if (bricksDestroyed === rowCount * columnCount) {
                    level++;
                    if (level > maxLevel) {
                        isRunning = false;
                        saveGameResult("Bounce Ball", score, maxLevel, getFormattedTime());
                        document.getElementById('overlay').style.display = 'flex';
                        document.getElementById('msg-title').innerText = "You Win!";
                        document.getElementById('msg-score').innerText = "Score: " + score;
                    } else { applyLevelSettings(); }
                }
            }
        }
    }
    
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) dx = -dx;
    if (y + dy < ballRadius) dy = -dy;
    else if (y + dy > canvas.height - ballRadius - 10) { 
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else if (y + dy > canvas.height - ballRadius) { 
            isRunning = false; 
            saveGameResult("Bounce Ball", score, level, getFormattedTime());
            document.getElementById('overlay').style.display = 'flex'; 
            document.getElementById('msg-title').innerText = "Game Over!";
            document.getElementById('msg-score').innerText = "Score: " + score;
        }
    }
    x += dx; y += dy;
    requestAnimationFrame(update);
}

function startGame() {
    score = 0; level = 1; startTime = Date.now();
    applyLevelSettings();
    isRunning = true;
    document.getElementById('overlay').style.display = 'none';
    update();
}

applyLevelSettings();