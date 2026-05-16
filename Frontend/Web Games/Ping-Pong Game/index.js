const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Game Settings
let gameRunning = false;
let gameTimer = 0;
let timerInterval;
const winningScore = 10;

const config = {
    paddleWidth: 12,
    paddleHeight: 110,
    ballRadius: 9,
    initialBallSpeed: 6,
    maxBallSpeed: 18,
    aiDifficulty: 0.1,  // AI tracking smoothness
    aiMistakeFactor: 0.5, // 50% beatable AI
    colors: {
        // Deep midnight blue and slate grey gradient base
        bgGradientStart: "#0c141f", 
        bgGradientEnd: "#1a2533",

        // Cyano-white for objects and UI
        accent: "#f0f6ff", 
        net: "rgba(240, 246, 255, 0.1)", 
        ui: "rgba(240, 246, 255, 0.4)",

        // Translucent popup settings
        popupBg: "rgba(230, 235, 240, 0.1)",
        popupText: "#e0e6ed"
    }
};

// State Objects
const user = { x: 0, y: 0, w: config.paddleWidth, h: config.paddleHeight, score: 0 };
const com = { x: 0, y: 0, w: config.paddleWidth, h: config.paddleHeight, score: 0 };
const ball = { x: 0, y: 0, r: config.ballRadius, vX: 5, vY: 5, speed: config.initialBallSpeed };

// High-DPI Scaling Setup (Sharpness for Mobile)
function setupCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    canvas.logicalWidth = rect.width;
    canvas.logicalHeight = rect.height;

    user.x = 20;
    com.x = canvas.logicalWidth - config.paddleWidth - 20;
    
    if (!gameRunning) {
        user.y = canvas.logicalHeight / 2 - config.paddleHeight / 2;
        com.y = canvas.logicalHeight / 2 - config.paddleHeight / 2;
        resetBall();
    }
}

function resetBall() {
    ball.x = canvas.logicalWidth / 2;
    ball.y = canvas.logicalHeight / 2;
    ball.speed = config.initialBallSpeed;
    ball.vX = (Math.random() > 0.5 ? 1 : -1) * ball.speed;
    ball.vY = (Math.random() - 0.5) * ball.speed * 0.8;
}

// Core Game Logic
function update() {
    if (!gameRunning) return;

    ball.x += ball.vX;
    ball.y += ball.vY;

    if (Math.random() > config.aiMistakeFactor) {
        const target = ball.y - (com.h / 2);
        com.y += (target - com.y) * config.aiDifficulty;
    }

    // Bounce off top/bottom
    if (ball.y - ball.r < 0) {
        ball.y = ball.r;
        ball.vY = -ball.vY;
    } else if (ball.y + ball.r > canvas.logicalHeight) {
        ball.y = canvas.logicalHeight - ball.r;
        ball.vY = -ball.vY;
    }

    // Paddle Collisions
    let player = (ball.x < canvas.logicalWidth / 2) ? user : com;
    if (checkCollision(ball, player)) {
        let collidePoint = (ball.y - (player.y + player.h / 2)) / (player.h / 2);
        let angle = (Math.PI / 4) * collidePoint;
        let dir = (ball.x < canvas.logicalWidth / 2) ? 1 : -1;

        ball.vX = dir * ball.speed * Math.cos(angle);
        ball.vY = ball.speed * Math.sin(angle);
        if (ball.speed < config.maxBallSpeed) ball.speed += 0.4;
    }

    // Scoring
    if (ball.x < 0) { com.score++; scoreScored(); }
    else if (ball.x > canvas.logicalWidth) { user.score++; scoreScored(); }
}

function checkCollision(b, p) {

    // Basic rectangle-point collision safety checks
    return b.x + b.r > p.x && 
           b.x - b.r < p.x + p.w && 
           b.y + b.r > p.y && 
           b.y - b.r < p.y + p.h;
}

function scoreScored() {
    resetBall();
    if (user.score >= winningScore || com.score >= winningScore) {
        endGame();
    }
}

// Visual Rendering Loop
function render() {
    const w = canvas.logicalWidth;
    const h = canvas.logicalHeight;

    const gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, config.colors.bgGradientStart);
    gradient.addColorStop(1, config.colors.bgGradientEnd);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = config.colors.net;
    ctx.lineWidth = 2;
    ctx.setLineDash([12, 12]);
    ctx.beginPath();
    ctx.moveTo(w / 2, 0);
    ctx.lineTo(w / 2, h);
    ctx.stroke();

    ctx.fillStyle = config.colors.ui;
    ctx.setLineDash([]);
    ctx.font = "600 13px 'Segoe UI', sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`Goal: ${winningScore}`, 20, 30);
    ctx.textAlign = "right";
    ctx.fillText(`Time: ${gameTimer}s`, w - 20, 30);

    ctx.font = "bold 90px 'Segoe UI', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(user.score, w / 4, h / 2 + 35);
    ctx.fillText(com.score, (w / 4) * 3, h / 2 + 35);

    ctx.fillStyle = config.colors.accent;
    ctx.fillRect(user.x, user.y, user.w, user.h);
    ctx.fillRect(com.x, com.y, com.w, com.h);
    
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
    ctx.fill();
}

function loop() {
    update();
    render();
    requestAnimationFrame(loop);
}

// Input Handling
function handleMove(e) {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    user.y = clientY - rect.top - config.paddleHeight / 2;
    
    if (user.y < 5) user.y = 5;
    if (user.y > canvas.logicalHeight - user.h - 5) user.y = canvas.logicalHeight - user.h - 5;
}

window.addEventListener('mousemove', handleMove);
window.addEventListener('touchmove', handleMove, { passive: false });
window.addEventListener('resize', setupCanvas);

// Unified Translucent Popup Handler
function showPopup(opts) {
    return Swal.fire({
        ...opts,
        background: 'transparent',
        color: config.colors.popupText,
        confirmButtonColor: 'rgba(255, 255, 255, 0.2)',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showClass: { popup: 'animate__animated animate__fadeInDown' },
        hideClass: { popup: 'animate__animated animate__fadeOutUp' }
    });
}

// UI Game Flow
function startGame() {
    showPopup({
        title: 'Neo-Pong',
        html: `Goal: ${winningScore} points.<br>Control: Mouse or Touch.<br>The AI is in "Friendly Match" mode.`,
        confirmButtonText: 'Can Go?',
        icon: 'info'
    }).then(() => {
        gameRunning = true;
        timerInterval = setInterval(() => {
            if (gameRunning) gameTimer++;
        }, 1000);
    });
}

function endGame() {
    gameRunning = false;
    clearInterval(timerInterval);
    const win = user.score >= winningScore;
    
    showPopup({
        icon: win ? 'success' : 'error',
        title: win ? 'VICTORY!' : 'YOU LOSE!',
        text: `Time: ${gameTimer} seconds.`,
        confirmButtonText: 'PLAY AGAIN'
    }).then(() => location.reload());
}

// Initialize
setupCanvas();
startGame();
loop();