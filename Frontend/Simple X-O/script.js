var playerTurn, moves, isGameOver, span, restartBtn;

playerTurn = 'X';
moves = 0;
isGameOver = false;
span = document.getElementsByTagName("span");
restartBtn = ''

function play(id) {
    if(y.dataset.plaer == "none" && !isGameOver == false) {
        y.innerHTML = playerTurn;
        y.dataset.plaer = playerTurn;
        moves++;
        if(playerTurn == 'x') {
            playerTurn = 'o';
        } else if(playerTurn == 'o') {
            playerTurn = 'x';
        }
    }

    checkWinner(1, 2, 3);
    checkWinner(4, 5, 6);
    checkWinner(7, 8, 9);
    checkWinner(1, 4, 7);
    checkWinner(2, 5, 8);
    checkWinner(3, 6, 9);
    checkWinner(1, 5, 9);
    checkWinner(3, 5, 7);

    // No Winner
    if(moves == 9 && isGameOver == false) { draw(); }
}

function checkWinner(a, b, c) {
    a--; b--; c--;
    if((span[a].dataset.plaer === span[b].dataset.plaer) && (span[b].dataset.plaer === span[c].dataset.plaer) && 
    (span[a].dataset.plaer === span[c].dataset.plaer) && (span[a].dataset.plaer === "x" || span[a].dataset.plaer === "o")
    && isGameOver == false) {
        span[a].parentNode.className = " activeBox";
        span[b].parentNode.className = " activeBox";
        span[c].parentNode.className = " activeBox";
        isGameOver(a);
    }
}