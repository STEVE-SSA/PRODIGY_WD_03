document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('[data-cell]');
    const board = document.getElementById('game-board');
    const winnerMessage = document.getElementById('winnerMessage');
    const xTurn = document.getElementById('xTurn');
    const oTurn = document.getElementById('oTurn');
    const restartButton = document.getElementById('restartButton');
    const toggleModeButton = document.getElementById('toggleModeButton');
    const gameContainer = document.getElementById('gameContainer');
    const resultContainer = document.getElementById('resultContainer');
    const resultMessage = document.getElementById('resultMessage');
    const newGameButton = document.getElementById('newGameButton');
    let isCircleTurn = false;
    let winningCombination = [];
    let isPlayerVsAI = false;

    const WINNING_COMBINATIONS = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    const startGame = () => {
        isCircleTurn = false;
        winningCombination = [];
        cells.forEach(cell => {
            cell.classList.remove('x');
            cell.classList.remove('o');
            cell.classList.remove('winning');
            cell.textContent = '';
            cell.removeEventListener('click', handleClick);
            cell.addEventListener('click', handleClick, { once: true });
        });
        setBoardHoverClass();
        updateTurnMessage();
        winnerMessage.textContent = '';
        gameContainer.style.display = 'block';
        resultContainer.style.display = 'none';
    };

    const handleClick = (e) => {
        const cell = e.target;
        const currentClass = isCircleTurn ? 'o' : 'x';
        placeMark(cell, currentClass);

        if (checkWin(currentClass)) {
            endGame(false);
        } else if (isDraw()) {
            endGame(true);
        } else {
            swapTurns();
            setBoardHoverClass();
            updateTurnMessage();
            if (isPlayerVsAI && isCircleTurn) {
                setTimeout(makeAIMove, 500); // Delay AI move for better UX
            }
        }
    };

    const placeMark = (cell, currentClass) => {
        cell.classList.add(currentClass);
        cell.textContent = currentClass.toUpperCase();
    };

    const swapTurns = () => {
        isCircleTurn = !isCircleTurn;
    };

    const setBoardHoverClass = () => {
        board.classList.remove('x');
        board.classList.remove('o');
        if (isCircleTurn) {
            board.classList.add('o');
            oTurn.classList.add('highlight');
            xTurn.classList.remove('highlight');
        } else {
            board.classList.add('x');
            xTurn.classList.add('highlight');
            oTurn.classList.remove('highlight');
        }
    };

    const checkWin = (currentClass) => {
        return WINNING_COMBINATIONS.some(combination => {
            if (combination.every(index => cells[index].classList.contains(currentClass))) {
                winningCombination = combination;
                return true;
            }
            return false;
        });
    };

    const endGame = (draw) => {
        if (draw) {
            winnerMessage.textContent = 'Draw!';
        } else {
            winnerMessage.textContent = `${isCircleTurn ? "O's" : "X's"} Wins!`;
            highlightWinningCells(winningCombination);
            displayResultPage(`${isCircleTurn ? "O" : "X"} Wins!`);
        }
        xTurn.classList.remove('highlight');
        oTurn.classList.remove('highlight');
    };

    const isDraw = () => {
        return [...cells].every(cell => {
            return cell.classList.contains('x') || cell.classList.contains('o');
        });
    };

    const highlightWinningCells = (combination) => {
        combination.forEach(index => {
            cells[index].classList.add('winning');
        });
    };

    const makeAIMove = () => {
        const availableCells = [...cells].filter(cell => !cell.classList.contains('x') && !cell.classList.contains('o'));
        const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
        if (randomCell) {
            placeMark(randomCell, 'o');
            if (checkWin('o')) {
                endGame(false);
            } else if (isDraw()) {
                endGame(true);
            } else {
                swapTurns();
                setBoardHoverClass();
                updateTurnMessage();
            }
        }
    };

    const toggleMode = () => {
        isPlayerVsAI = !isPlayerVsAI;
        toggleModeButton.textContent = isPlayerVsAI ? "Player vs Player" : "Player vs AI";
        startGame();
    };

    const updateTurnMessage = () => {
        if (isCircleTurn) {
            oTurn.classList.add('highlight');
            xTurn.classList.remove('highlight');
        } else {
            xTurn.classList.add('highlight');
            oTurn.classList.remove('highlight');
        }
    };

    const displayResultPage = (result) => {
        gameContainer.style.display = 'none';
        resultContainer.style.display = 'flex';
        resultMessage.textContent = result;
    };

    restartButton.addEventListener('click', startGame);
    newGameButton.addEventListener('click', startGame);
    toggleModeButton.addEventListener('click', toggleMode);

    startGame();
});
