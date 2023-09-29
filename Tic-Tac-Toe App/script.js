const cells = document.querySelectorAll('[data-cell]');
const resultScreen = document.querySelector('.result-screen');
const message = document.querySelector('[data-message]');
const resetButton = document.querySelector('.reset-button');
const restartButton = document.querySelector('.restart-button');
const playerNames = document.querySelectorAll('.player-name');

let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let gameEnded = false; // New variable to track if the game has ended

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

const playerNamesMap = {
    X: 'Player',
    O: 'Computer',
};

const checkWin = (board, player) => {
    for (const combo of winningCombinations) {
        const [a, b, c] = combo;
        if (board[a] === player && board[b] === player && board[c] === player) {
            return true;
        }
    }
    return false;
};

const isBoardFull = (board) => {
    return board.every((cell) => cell !== '');
};

const minimax = (board, depth, isMaximizing) => {
    const scores = {
        X: -1,
        O: 1,
        tie: 0,
    };

    if (checkWin(board, 'O')) {
        return scores.O;
    } else if (checkWin(board, 'X')) {
        return scores.X;
    } else if (isBoardFull(board)) {
        return scores.tie;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                const score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                const score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
};

const computerMove = () => {
    let bestMove;
    let bestScore = -Infinity;
    for (let i = 0; i < gameBoard.length; i++) {
        if (gameBoard[i] === '') {
            gameBoard[i] = 'O';
            const score = minimax(gameBoard, 0, false);
            gameBoard[i] = '';
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    return bestMove;
};

const togglePlayerNames = () => {
    playerNames.forEach((name) => {
        name.style.display = 'none';
    });
    const currentPlayerName = document.querySelector(`[data-player=${currentPlayer}]`);
    currentPlayerName.style.display = 'block';
};

const showResetButton = () => {
    resetButton.style.display = 'block';
};

const hideResetButton = () => {
    resetButton.style.display = 'none';
};

const showRestartButton = () => {
    restartButton.style.display = 'block';
};

const hideRestartButton = () => {
    restartButton.style.display = 'none';
};

const handleClick = (cell, index) => {
    if (!gameActive || gameBoard[index] !== '') return;

    gameBoard[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer);

    if (checkWin(gameBoard, currentPlayer)) {
        showResult(`${playerNamesMap[currentPlayer]} wins!`);
        gameActive = false;
        gameEnded = true; // Update gameEnded variable
        showRestartButton(); // Show restart button when the game ends
        hideResetButton(); // Hide reset button when the game ends
    } else if (isBoardFull(gameBoard)) {
        showResult("It's a tie!");
        gameActive = false;
        gameEnded = true; // Update gameEnded variable
        showRestartButton(); // Show restart button when the game ends
        hideResetButton(); // Hide reset button when the game ends
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        togglePlayerNames();
        if (currentPlayer === 'O' && gameActive) {
            setTimeout(() => {
                const computerChoice = computerMove();
                const computerCell = cells[computerChoice];
                handleClick(computerCell, computerChoice);
            }, 1000);
        }
    }
};

const handleCellClick = (e) => {
    const cell = e.target;
    const index = [...cells].indexOf(cell);
    handleClick(cell, index);
};

const showResult = (result) => {
    message.textContent = result;
    resultScreen.style.display = 'block';
};

const resetGame = () => {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    gameEnded = false; // Reset gameEnded variable
    message.textContent = '';
    cells.forEach((cell) => {
        cell.textContent = '';
        cell.classList.remove('X', 'O');
    });
    resultScreen.style.display = 'none';
    hideRestartButton(); // Hide restart button when the game is reset
    showResetButton(); // Show reset button when the game is reset
};

const restartGame = () => {
    resetGame();
    resultScreen.style.display = 'none';
};

togglePlayerNames();
cells.forEach((cell) => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);
restartButton.addEventListener('click', restartGame);
hideRestartButton(); // Hide restart button initially
showResetButton(); // Show reset button initially
