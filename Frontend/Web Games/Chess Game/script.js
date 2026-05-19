document.addEventListener('DOMContentLoaded', () => {
    let board = null;
    let game = new Chess();
    const moveHistory = document.getElementById('move-history');
    let moveCount = 1;
    let currentDifficulty = 'easy';

    const pieceValues = { p: 10, n: 30, b: 30, r: 50, q: 90, k: 900 };

    function checkGameState() {
        if (game.game_over()) {
            let message = "Game Over";
            if (game.in_checkmate()) message = "Checkmate!";
            else if (game.in_draw()) message = "Draw!";
            Swal.fire('Info', message, 'info');
            return true;
        }
        return false;
    }

    const evaluateBoard = (gameObj) => {
        let totalEvaluation = 0;
        const boardState = gameObj.board();
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let piece = boardState[i][j];
                if (piece) {
                    let val = pieceValues[piece.type] || 0;
                    totalEvaluation += piece.color === 'w' ? val : -val;
                }
            }
        }
        return totalEvaluation;
    };

    const minimax = (gameObj, depth, alpha, beta, isMaximizingPlayer) => {
        if (depth === 0 || gameObj.game_over()) {
            return evaluateBoard(gameObj);
        }

        let moves = gameObj.moves();
        if (isMaximizingPlayer) {
            let bestVal = -Infinity;
            for (let i = 0; i < moves.length; i++) {
                gameObj.move(moves[i]);
                bestVal = Math.max(bestVal, minimax(gameObj, depth - 1, alpha, beta, !isMaximizingPlayer));
                gameObj.undo();
                alpha = Math.max(alpha, bestVal);
                if (beta <= alpha) break;
            }
            return bestVal;
        } else {
            let bestVal = Infinity;
            for (let i = 0; i < moves.length; i++) {
                gameObj.move(moves[i]);
                bestVal = Math.min(bestVal, minimax(gameObj, depth - 1, alpha, beta, !isMaximizingPlayer));
                gameObj.undo();
                beta = Math.min(beta, bestVal);
                if (beta <= alpha) break;
            }
            return bestVal;
        }
    };

    const getBestMove = (gameObj, depth) => {
        let bestMove = null;
        let possibleMoves = gameObj.moves();
        possibleMoves.sort(() => Math.random() - 0.5); 
        
        let bestValue = gameObj.turn() === 'w' ? -Infinity : Infinity;

        for (let i = 0; i < possibleMoves.length; i++) {
            let move = possibleMoves[i];
            gameObj.move(move);
            let boardValue = minimax(gameObj, depth - 1, -Infinity, Infinity, gameObj.turn() === 'w');
            gameObj.undo();
            
            if (gameObj.turn() === 'w') {
                if (boardValue > bestValue) {
                    bestValue = boardValue;
                    bestMove = move;
                }
            } else {
                if (boardValue < bestValue) {
                    bestValue = boardValue;
                    bestMove = move;
                }
            }
        }
        return bestMove || possibleMoves[0];
    };

    const makeComputerMove = () => {
        if (checkGameState()) return;

        let selectedMove;
        if (currentDifficulty === 'easy') {
            const moves = game.moves();
            selectedMove = moves[Math.floor(Math.random() * moves.length)];
        } else if (currentDifficulty === 'medium') {
            selectedMove = getBestMove(game, 2);
        } else {
            selectedMove = getBestMove(game, 3); 
        }

        const moveObj = game.move(selectedMove);
        board.position(game.fen());
        recordMove(moveObj.san, moveCount);
        moveCount++;
        checkGameState();
    };

    const recordMove = (move, count) => {
        const round = Math.ceil(count / 2);
        const entry = count % 2 === 1 ? `<strong>${round}.</strong> ${move}` : `${move} &nbsp;`;
        moveHistory.innerHTML += entry + ' ';
        moveHistory.scrollTop = moveHistory.scrollHeight;
    };

    const onDrop = (source, target) => {
        const move = game.move({ from: source, to: target, promotion: 'q' });
        if (move === null) return 'snapback';

        recordMove(move.san, moveCount);
        moveCount++;
        window.setTimeout(makeComputerMove, 250);
    };

    const boardConfig = {
        draggable: true,
        position: 'start',
        onDrop: onDrop,
        onSnapEnd: () => board.position(game.fen()),
        pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png'
    };

    board = Chessboard('board', boardConfig);
    document.querySelectorAll('.btn-diff').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.btn-diff').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentDifficulty = e.target.getAttribute('data-level');
        });
    });

    document.querySelector('.play-again').addEventListener('click', () => {
        game.reset();
        board.start();
        moveHistory.innerHTML = '';
        moveCount = 1;
    });

    document.querySelector('.flip-board').addEventListener('click', () => {
        board.flip();
    });

    document.querySelector('.set-pos').addEventListener('click', async () => {
        if (typeof Swal === 'undefined') {
            alert("Error: SweetAlert library missing. Check your HTML!");
            return;
        }

        const { value: formValues } = await Swal.fire({
            title: 'Load Position',
            html:
                '<div style="text-align:left; color:#64748b; font-size:14px;">FEN String:</div>' +
                '<input id="swal-fen" class="swal2-input" placeholder="Paste FEN here...">' +
                '<div style="text-align:left; color:#64748b; font-size:14px; margin-top:10px;">Move Number:</div>' +
                '<input id="swal-count" type="number" class="swal2-input" value="1">',
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Sync Board',
            confirmButtonColor: '#4f46e5',
            preConfirm: () => {
                return [
                    document.getElementById('swal-fen').value,
                    document.getElementById('swal-count').value
                ]
            }
        });

        if (formValues && formValues[0]) {
            const fen = formValues[0];
            const count = formValues[1];

            if (game.load(fen)) {
                board.position(fen);
                moveCount = parseInt(count) || 1;
                moveHistory.innerHTML = `<div style="color:#4f46e5; padding:5px; font-weight:bold;">Resumed from move ${moveCount}</div>`;
                
                Swal.fire({ icon: 'success', title: 'Position Loaded', timer: 1500, showConfirmButton: false });
            } else {
                Swal.fire('Invalid FEN', 'The code you entered is not a valid chess position.', 'error');
            }
        }
    });

    window.addEventListener('resize', board.resize);
});