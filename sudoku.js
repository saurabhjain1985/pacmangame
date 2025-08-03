// Sudoku Game Logic
let sudokuGrid = [];
let solutionGrid = [];
let selectedCell = null;
let sudokuTimer = 0;
let timerInterval = null;
let difficulty = 'easy';
let hintsUsed = 0;

function initSudoku() {
    setupDifficultyButtons();
    newSudokuGame();
}

function setupDifficultyButtons() {
    const buttons = document.querySelectorAll('.difficulty-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            difficulty = btn.dataset.level;
            newSudokuGame();
        });
    });
}

function newSudokuGame() {
    generateSudoku();
    createSudokuBoard();
    startSudokuTimer();
    hintsUsed = 0;
}

function generateSudoku() {
    // Create solution grid
    solutionGrid = Array(9).fill().map(() => Array(9).fill(0));
    fillSudokuGrid(solutionGrid);
    
    // Create puzzle grid by removing numbers
    sudokuGrid = solutionGrid.map(row => [...row]);
    const cellsToRemove = getDifficultyRemovalCount();
    
    for (let i = 0; i < cellsToRemove; i++) {
        let row, col;
        do {
            row = Math.floor(Math.random() * 9);
            col = Math.floor(Math.random() * 9);
        } while (sudokuGrid[row][col] === 0);
        
        sudokuGrid[row][col] = 0;
    }
}

function getDifficultyRemovalCount() {
    switch (difficulty) {
        case 'easy': return 35;
        case 'medium': return 45;
        case 'hard': return 55;
        default: return 35;
    }
}

function fillSudokuGrid(grid) {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (grid[row][col] === 0) {
                shuffleArray(numbers);
                
                for (let num of numbers) {
                    if (isValidSudokuMove(grid, row, col, num)) {
                        grid[row][col] = num;
                        
                        if (fillSudokuGrid(grid)) {
                            return true;
                        }
                        
                        grid[row][col] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

function isValidSudokuMove(grid, row, col, num) {
    // Check row
    for (let x = 0; x < 9; x++) {
        if (grid[row][x] === num) return false;
    }
    
    // Check column
    for (let x = 0; x < 9; x++) {
        if (grid[x][col] === num) return false;
    }
    
    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid[boxRow + i][boxCol + j] === num) return false;
        }
    }
    
    return true;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function createSudokuBoard() {
    const board = document.getElementById('sudoku-board');
    board.innerHTML = '';
    
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = document.createElement('div');
            cell.className = 'sudoku-cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            
            if (sudokuGrid[row][col] !== 0) {
                cell.textContent = sudokuGrid[row][col];
                cell.classList.add('given');
            }
            
            cell.addEventListener('click', () => selectSudokuCell(cell));
            board.appendChild(cell);
        }
    }
    
    setupNumberPad();
}

function selectSudokuCell(cell) {
    // Remove previous selection
    document.querySelectorAll('.sudoku-cell').forEach(c => {
        c.classList.remove('selected');
    });
    
    // Select new cell
    if (!cell.classList.contains('given')) {
        cell.classList.add('selected');
        selectedCell = cell;
    }
}

function setupNumberPad() {
    const numberButtons = document.querySelectorAll('.number-btn');
    numberButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (selectedCell) {
                const number = btn.dataset.number;
                placeSudokuNumber(selectedCell, parseInt(number));
            }
        });
    });
}

function placeSudokuNumber(cell, number) {
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    
    // Clear previous states
    cell.classList.remove('error', 'hint');
    
    if (number === 0) {
        // Erase
        cell.textContent = '';
        sudokuGrid[row][col] = 0;
    } else {
        // Place number
        cell.textContent = number;
        sudokuGrid[row][col] = number;
        
        // Check if move is valid
        if (!isValidSudokuMove(sudokuGrid, row, col, number)) {
            cell.classList.add('error');
        } else if (checkSudokuComplete()) {
            endSudokuGame(true);
        }
    }
}

function checkSudokuComplete() {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (sudokuGrid[row][col] === 0) return false;
            if (!isValidSudokuMove(sudokuGrid, row, col, sudokuGrid[row][col])) return false;
        }
    }
    return true;
}

function getHint() {
    if (hintsUsed >= 3) {
        alert('Maximum hints used for this puzzle!');
        return;
    }
    
    // Find empty cells
    const emptyCells = [];
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (sudokuGrid[row][col] === 0) {
                emptyCells.push({row, col});
            }
        }
    }
    
    if (emptyCells.length === 0) return;
    
    // Pick random empty cell and show solution
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const row = randomCell.row;
    const col = randomCell.col;
    const solution = solutionGrid[row][col];
    
    // Find the cell element and place hint
    const cellElement = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    cellElement.textContent = solution;
    cellElement.classList.add('hint');
    sudokuGrid[row][col] = solution;
    
    hintsUsed++;
    
    if (checkSudokuComplete()) {
        endSudokuGame(true);
    }
}

function startSudokuTimer() {
    sudokuTimer = 0;
    clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
        sudokuTimer++;
        const minutes = Math.floor(sudokuTimer / 60);
        const seconds = sudokuTimer % 60;
        document.getElementById('sudoku-timer').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

function endSudokuGame(won) {
    clearInterval(timerInterval);
    
    if (won) {
        const minutes = Math.floor(sudokuTimer / 60);
        const seconds = sudokuTimer % 60;
        const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        setTimeout(() => {
            alert(`🎉 Congratulations! You solved the ${difficulty} puzzle in ${timeStr}!${hintsUsed > 0 ? ` (${hintsUsed} hints used)` : ''}`);
        }, 500);
    }
}
