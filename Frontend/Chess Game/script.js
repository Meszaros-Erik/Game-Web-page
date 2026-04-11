document.addEventListener('DOMContentLoaded', () => {
    let board = null;
    let game = new Chess();
    const moveHistory = document.getElementById('move-history');
    let moveCount = 1;

    function checkGameState() {
        if (game.game_over()) {
            let message = "Game Over";
            if (game.in_checkmate()) message = "Checkmate!";
            else if (game.in_draw()) message = "Draw!";
            Swal.fire('Info', message, 'info');
        }
    }

    const makeRandomMove = () => {
        const moves = game.moves();
        if (game.game_over()) return checkGameState();

        const move = moves[Math.floor(Math.random() * moves.length)];
        game.move(move);
        board.position(game.fen());
        recordMove(move, moveCount);
        moveCount++;
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
        window.setTimeout(makeRandomMove, 250);
    };

    const boardConfig = {
        draggable: true,
        position: 'start',
        onDrop: onDrop,
        onSnapEnd: () => board.position(game.fen()),
        pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png'
    };

    board = Chessboard('board', boardConfig);

    // Btn: Reset Game
    document.querySelector('.play-again').addEventListener('click', () => {
        game.reset();
        board.start();
        moveHistory.innerHTML = '';
        moveCount = 1;
    });

    // Btn: Flip View
    document.querySelector('.flip-board').addEventListener('click', () => {
        board.flip();
    });

    // Btn: Set Position & Move Count
    document.querySelector('.set-pos').addEventListener('click', async () => {
    if (typeof Swal === 'undefined') {
        console.error("SweetAlert2 is not loaded!");
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
            
            Swal.fire({
                icon: 'success',
                title: 'Position Loaded',
                timer: 1500,
                showConfirmButton: false
            });
        } else {
            Swal.fire('Invalid FEN', 'The code you entered is not a valid chess position.', 'error');
        }
    }
});

    window.addEventListener('resize', board.resize);
});