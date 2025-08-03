// Puzzle Games - Complete Implementation
class PuzzleGameManager {
    constructor() {
        this.currentGame = null;
        this.currentScreen = 'selection';
        this.gameStats = {
            moves: 0,
            time: 0,
            score: 0,
            difficulty: 'medium'
        };
        this.timer = null;
        this.init();
    }

    init() {
        console.log('Puzzle Games initialized');
        this.setupEventListeners();
        this.showScreen('selection');
        this.updateStats();
    }

    setupEventListeners() {
        // Back button
        const backBtn = document.getElementById('back-button');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                window.location.href = 'index.html';
            });
        }

        // Puzzle card clicks
        const puzzleCards = document.querySelectorAll('.puzzle-card');
        puzzleCards.forEach(card => {
            card.addEventListener('click', () => {
                const gameType = card.dataset.game;
                this.startGame(gameType);
            });
        });

        // Difficulty buttons
        const difficultyBtns = document.querySelectorAll('.difficulty-btn');
        difficultyBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                difficultyBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.gameStats.difficulty = btn.dataset.difficulty;
            });
        });

        // Action buttons
        this.setupActionButtons();
    }

    setupActionButtons() {
        // New Game buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('new-game-btn')) {
                this.newGame();
            }
            if (e.target.classList.contains('back-to-menu-btn')) {
                this.showScreen('selection');
                this.resetStats();
            }
        });
    }

    showScreen(screenName) {
        const screens = document.querySelectorAll('.screen');
        screens.forEach(screen => screen.classList.remove('active'));
        
        const targetScreen = document.getElementById(`${screenName}-screen`);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screenName;
        }
    }

    startGame(gameType) {
        this.currentGame = gameType;
        this.resetStats();
        this.showScreen(gameType);
        this.startTimer();

        switch (gameType) {
            case 'sliding':
                this.initSlidingPuzzle();
                break;
            case 'wordsearch':
                this.initWordSearch();
                break;
            case 'number':
                this.initNumberPuzzle();
                break;
            case 'pattern':
                this.initPatternMatch();
                break;
        }
    }

    newGame() {
        if (this.currentGame) {
            this.startGame(this.currentGame);
        }
    }

    resetStats() {
        this.gameStats.moves = 0;
        this.gameStats.time = 0;
        this.gameStats.score = 0;
        this.updateStats();
        if (this.timer) {
            clearInterval(this.timer);
        }
    }

    startTimer() {
        if (this.timer) clearInterval(this.timer);
        this.timer = setInterval(() => {
            this.gameStats.time++;
            this.updateStats();
        }, 1000);
    }

    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    updateStats() {
        const elements = {
            moves: document.getElementById('moves'),
            time: document.getElementById('time'), 
            score: document.getElementById('score')
        };

        if (elements.moves) elements.moves.textContent = this.gameStats.moves;
        if (elements.time) elements.time.textContent = this.formatTime(this.gameStats.time);
        if (elements.score) elements.score.textContent = this.gameStats.score;
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    showVictory() {
        this.stopTimer();
        this.updateVictoryStats();
        this.showScreen('victory');
    }

    updateVictoryStats() {
        document.getElementById('final-moves').textContent = this.gameStats.moves;
        document.getElementById('final-time').textContent = this.formatTime(this.gameStats.time);
        document.getElementById('final-score').textContent = this.gameStats.score;
    }

    // SLIDING PUZZLE
    initSlidingPuzzle() {
        const difficulty = this.gameStats.difficulty;
        const sizes = { easy: 3, medium: 4, hard: 5 };
        this.slidingSize = sizes[difficulty] || 4;
        
        this.slidingBoard = this.createSlidingBoard();
        this.renderSlidingPuzzle();
        this.shuffleSlidingPuzzle();
    }

    createSlidingBoard() {
        const size = this.slidingSize;
        const board = [];
        
        // Create solved board
        for (let i = 0; i < size * size - 1; i++) {
            board[i] = i + 1;
        }
        board[size * size - 1] = 0; // Empty space
        
        return board;
    }

    renderSlidingPuzzle() {
        const boardElement = document.getElementById('sliding-board');
        const size = this.slidingSize;
        
        boardElement.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
        boardElement.innerHTML = '';
        
        // Calculate tile size based on screen size
        const maxSize = Math.min(400, window.innerWidth - 40);
        const tileSize = Math.floor(maxSize / size);
        
        this.slidingBoard.forEach((value, index) => {
            const tile = document.createElement('button');
            tile.className = 'sliding-tile';
            tile.style.width = `${tileSize}px`;
            tile.style.height = `${tileSize}px`;
            
            if (value === 0) {
                tile.classList.add('empty');
                tile.textContent = '';
            } else {
                tile.textContent = value;
                tile.addEventListener('click', () => this.moveSlidingTile(index));
            }
            
            boardElement.appendChild(tile);
        });
    }

    moveSlidingTile(index) {
        const size = this.slidingSize;
        const emptyIndex = this.slidingBoard.indexOf(0);
        
        // Check if move is valid (adjacent to empty space)
        const validMoves = [
            emptyIndex - size, // Above
            emptyIndex + size, // Below
            emptyIndex - 1,    // Left
            emptyIndex + 1     // Right
        ];
        
        // Prevent wrapping for left/right moves
        if (emptyIndex % size === 0) validMoves.splice(2, 1); // Remove left
        if (emptyIndex % size === size - 1) validMoves.splice(-1, 1); // Remove right
        
        if (validMoves.includes(index)) {
            // Swap tiles
            [this.slidingBoard[index], this.slidingBoard[emptyIndex]] = 
            [this.slidingBoard[emptyIndex], this.slidingBoard[index]];
            
            this.gameStats.moves++;
            this.updateStats();
            this.renderSlidingPuzzle();
            
            if (this.isSlidingPuzzleSolved()) {
                this.gameStats.score = Math.max(1000 - this.gameStats.moves * 10 - this.gameStats.time, 100);
                setTimeout(() => this.showVictory(), 500);
            }
        }
    }

    shuffleSlidingPuzzle() {
        // Perform random valid moves to shuffle
        for (let i = 0; i < 1000; i++) {
            const emptyIndex = this.slidingBoard.indexOf(0);
            const size = this.slidingSize;
            const validMoves = [];
            
            if (emptyIndex >= size) validMoves.push(emptyIndex - size);
            if (emptyIndex < size * (size - 1)) validMoves.push(emptyIndex + size);
            if (emptyIndex % size !== 0) validMoves.push(emptyIndex - 1);
            if (emptyIndex % size !== size - 1) validMoves.push(emptyIndex + 1);
            
            const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
            [this.slidingBoard[emptyIndex], this.slidingBoard[randomMove]] = 
            [this.slidingBoard[randomMove], this.slidingBoard[emptyIndex]];
        }
        this.renderSlidingPuzzle();
    }

    isSlidingPuzzleSolved() {
        for (let i = 0; i < this.slidingBoard.length - 1; i++) {
            if (this.slidingBoard[i] !== i + 1) return false;
        }
        return this.slidingBoard[this.slidingBoard.length - 1] === 0;
    }

    // WORD SEARCH
    initWordSearch() {
        const difficulty = this.gameStats.difficulty;
        const configs = {
            easy: { size: 8, words: 4 },
            medium: { size: 10, words: 6 },
            hard: { size: 12, words: 8 }
        };
        
        this.wordSearchConfig = configs[difficulty] || configs.medium;
        this.wordSearchWords = this.generateWordList();
        this.wordSearchGrid = this.createWordSearchGrid();
        this.foundWords = new Set();
        this.selectedCells = [];
        
        this.renderWordSearch();
    }

    generateWordList() {
        const allWords = [
            'PUZZLE', 'GAME', 'BRAIN', 'LOGIC', 'SOLVE', 'THINK',
            'SMART', 'MIND', 'WORD', 'FIND', 'SEARCH', 'HIDDEN',
            'CHALLENGE', 'FUN', 'PLAY', 'WIN', 'SCORE', 'TIME'
        ];
        
        const words = [];
        for (let i = 0; i < this.wordSearchConfig.words; i++) {
            const word = allWords[Math.floor(Math.random() * allWords.length)];
            if (!words.includes(word)) {
                words.push(word);
            } else {
                i--; // Try again
            }
        }
        return words;
    }

    createWordSearchGrid() {
        const size = this.wordSearchConfig.size;
        const grid = Array(size).fill().map(() => Array(size).fill(''));
        
        // Place words
        this.wordSearchWords.forEach(word => {
            this.placeWordInGrid(grid, word);
        });
        
        // Fill empty cells with random letters
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                if (grid[row][col] === '') {
                    grid[row][col] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
                }
            }
        }
        
        return grid;
    }

    placeWordInGrid(grid, word) {
        const size = grid.length;
        const directions = [
            [0, 1],   // Right
            [1, 0],   // Down
            [1, 1],   // Diagonal down-right
            [-1, 1],  // Diagonal up-right
        ];
        
        let placed = false;
        let attempts = 0;
        
        while (!placed && attempts < 100) {
            const direction = directions[Math.floor(Math.random() * directions.length)];
            const startRow = Math.floor(Math.random() * size);
            const startCol = Math.floor(Math.random() * size);
            
            if (this.canPlaceWord(grid, word, startRow, startCol, direction)) {
                this.placeWord(grid, word, startRow, startCol, direction);
                placed = true;
            }
            attempts++;
        }
    }

    canPlaceWord(grid, word, startRow, startCol, direction) {
        const [dRow, dCol] = direction;
        
        for (let i = 0; i < word.length; i++) {
            const row = startRow + i * dRow;
            const col = startCol + i * dCol;
            
            if (row < 0 || row >= grid.length || col < 0 || col >= grid[0].length) {
                return false;
            }
            
            if (grid[row][col] !== '' && grid[row][col] !== word[i]) {
                return false;
            }
        }
        return true;
    }

    placeWord(grid, word, startRow, startCol, direction) {
        const [dRow, dCol] = direction;
        
        for (let i = 0; i < word.length; i++) {
            const row = startRow + i * dRow;
            const col = startCol + i * dCol;
            grid[row][col] = word[i];
        }
    }

    renderWordSearch() {
        // Render word list
        const wordsContainer = document.getElementById('words-to-find');
        wordsContainer.innerHTML = '';
        
        this.wordSearchWords.forEach(word => {
            const wordElement = document.createElement('span');
            wordElement.className = 'word-item';
            wordElement.textContent = word;
            wordElement.dataset.word = word;
            wordsContainer.appendChild(wordElement);
        });
        
        // Render grid
        const gridElement = document.getElementById('word-grid');
        const size = this.wordSearchConfig.size;
        
        gridElement.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
        gridElement.innerHTML = '';
        
        const cellSize = Math.min(30, (window.innerWidth - 100) / size);
        
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                const cell = document.createElement('div');
                cell.className = 'word-cell';
                cell.textContent = this.wordSearchGrid[row][col];
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.style.width = `${cellSize}px`;
                cell.style.height = `${cellSize}px`;
                
                cell.addEventListener('click', () => this.selectWordCell(row, col));
                gridElement.appendChild(cell);
            }
        }
    }

    selectWordCell(row, col) {
        const cellKey = `${row}-${col}`;
        const cellElement = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        
        if (this.selectedCells.length === 0) {
            // Start new selection
            this.selectedCells = [{ row, col }];
            cellElement.classList.add('selected');
        } else {
            // Check if this completes a valid word selection
            const word = this.getSelectedWord(row, col);
            if (word && this.wordSearchWords.includes(word) && !this.foundWords.has(word)) {
                this.foundWords.add(word);
                this.markWordFound(word);
                this.gameStats.score += word.length * 10;
                this.updateStats();
                
                if (this.foundWords.size === this.wordSearchWords.length) {
                    this.gameStats.score += Math.max(500 - this.gameStats.time, 100);
                    setTimeout(() => this.showVictory(), 500);
                }
            }
            
            // Clear selection
            document.querySelectorAll('.word-cell.selected').forEach(cell => {
                cell.classList.remove('selected');
            });
            this.selectedCells = [];
        }
    }

    getSelectedWord(endRow, endCol) {
        if (this.selectedCells.length === 0) return null;
        
        const start = this.selectedCells[0];
        const dRow = endRow - start.row;
        const dCol = endCol - start.col;
        
        // Check if it's a valid direction (straight line)
        if (dRow !== 0 && dCol !== 0 && Math.abs(dRow) !== Math.abs(dCol)) {
            return null;
        }
        
        const length = Math.max(Math.abs(dRow), Math.abs(dCol)) + 1;
        const stepRow = dRow === 0 ? 0 : dRow / Math.abs(dRow);
        const stepCol = dCol === 0 ? 0 : dCol / Math.abs(dCol);
        
        let word = '';
        for (let i = 0; i < length; i++) {
            const row = start.row + i * stepRow;
            const col = start.col + i * stepCol;
            
            if (row < 0 || row >= this.wordSearchGrid.length || 
                col < 0 || col >= this.wordSearchGrid[0].length) {
                return null;
            }
            
            word += this.wordSearchGrid[row][col];
        }
        
        return word;
    }

    markWordFound(word) {
        const wordElement = document.querySelector(`[data-word="${word}"]`);
        if (wordElement) {
            wordElement.classList.add('found');
        }
    }

    // NUMBER PUZZLE
    initNumberPuzzle() {
        this.numberPuzzleScore = 0;
        this.numberQuestionCount = 0;
        this.generateNumberQuestion();
    }

    generateNumberQuestion() {
        const difficulty = this.gameStats.difficulty;
        const configs = {
            easy: { range: 20, operations: ['+', '-'] },
            medium: { range: 50, operations: ['+', '-', '*'] },
            hard: { range: 100, operations: ['+', '-', '*', '/'] }
        };
        
        const config = configs[difficulty] || configs.medium;
        const operation = config.operations[Math.floor(Math.random() * config.operations.length)];
        
        let a, b, answer;
        
        switch (operation) {
            case '+':
                a = Math.floor(Math.random() * config.range);
                b = Math.floor(Math.random() * config.range);
                answer = a + b;
                this.currentQuestion = `${a} + ${b} = ?`;
                break;
            case '-':
                a = Math.floor(Math.random() * config.range);
                b = Math.floor(Math.random() * a + 1);
                answer = a - b;
                this.currentQuestion = `${a} - ${b} = ?`;
                break;
            case '*':
                a = Math.floor(Math.random() * 12) + 1;
                b = Math.floor(Math.random() * 12) + 1;
                answer = a * b;
                this.currentQuestion = `${a} × ${b} = ?`;
                break;
            case '/':
                answer = Math.floor(Math.random() * 12) + 1;
                b = Math.floor(Math.random() * 12) + 1;
                a = answer * b;
                this.currentQuestion = `${a} ÷ ${b} = ?`;
                break;
        }
        
        this.currentAnswer = answer;
        this.renderNumberQuestion();
    }

    renderNumberQuestion() {
        document.getElementById('number-question').textContent = this.currentQuestion;
        
        const options = [this.currentAnswer];
        
        // Generate wrong answers
        while (options.length < 4) {
            const offset = Math.floor(Math.random() * 20) - 10;
            const wrongAnswer = this.currentAnswer + offset;
            if (wrongAnswer !== this.currentAnswer && !options.includes(wrongAnswer) && wrongAnswer >= 0) {
                options.push(wrongAnswer);
            }
        }
        
        // Shuffle options
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }
        
        const optionsContainer = document.getElementById('number-options');
        optionsContainer.innerHTML = '';
        
        options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'number-option';
            button.textContent = option;
            button.addEventListener('click', () => this.checkNumberAnswer(option, button));
            optionsContainer.appendChild(button);
        });
    }

    checkNumberAnswer(selectedAnswer, buttonElement) {
        const isCorrect = selectedAnswer === this.currentAnswer;
        
        if (isCorrect) {
            buttonElement.classList.add('correct');
            this.gameStats.score += 10;
            this.numberQuestionCount++;
            
            setTimeout(() => {
                if (this.numberQuestionCount >= 10) {
                    this.gameStats.score += Math.max(200 - this.gameStats.time, 50);
                    this.showVictory();
                } else {
                    this.generateNumberQuestion();
                }
            }, 1000);
        } else {
            buttonElement.classList.add('incorrect');
            // Highlight correct answer
            const correctButton = Array.from(document.querySelectorAll('.number-option'))
                .find(btn => parseInt(btn.textContent) === this.currentAnswer);
            if (correctButton) {
                correctButton.classList.add('correct');
            }
            
            setTimeout(() => {
                this.generateNumberQuestion();
            }, 1500);
        }
        
        this.updateStats();
    }

    // PATTERN MATCH
    initPatternMatch() {
        this.patternScore = 0;
        this.patternLevel = 1;
        this.generatePattern();
    }

    generatePattern() {
        const symbols = ['🔴', '🔵', '🟢', '🟡', '🟠', '🟣', '🔶', '🔷'];
        const difficulty = this.gameStats.difficulty;
        const lengths = { easy: 4, medium: 6, hard: 8 };
        const length = lengths[difficulty] || 6;
        
        // Generate different types of logical patterns
        const patternTypes = [
            'alternating',      // A, B, A, B, A, ?
            'repeating',        // A, B, C, A, B, ?
            'sequence',         // Follows color order
            'skip_pattern',     // A, _, B, _, C, ?
            'mirror'           // A, B, C, C, B, ?
        ];
        
        const patternType = patternTypes[Math.floor(Math.random() * patternTypes.length)];
        this.currentPattern = [];
        
        switch(patternType) {
            case 'alternating':
                // Simple A, B, A, B pattern
                const alt1 = symbols[Math.floor(Math.random() * symbols.length)];
                const alt2 = symbols.filter(s => s !== alt1)[Math.floor(Math.random() * (symbols.length - 1))];
                for (let i = 0; i < length; i++) {
                    this.currentPattern.push(i % 2 === 0 ? alt1 : alt2);
                }
                break;
                
            case 'repeating':
                // A, B, C, A, B, C pattern
                const repeatLength = Math.min(3, Math.floor(length / 2));
                const repeatBase = [];
                for (let i = 0; i < repeatLength; i++) {
                    let symbol;
                    do {
                        symbol = symbols[Math.floor(Math.random() * symbols.length)];
                    } while (repeatBase.includes(symbol));
                    repeatBase.push(symbol);
                }
                for (let i = 0; i < length; i++) {
                    this.currentPattern.push(repeatBase[i % repeatLength]);
                }
                break;
                
            case 'sequence':
                // Follow color order in symbols array
                const startIndex = Math.floor(Math.random() * (symbols.length - length));
                for (let i = 0; i < length; i++) {
                    this.currentPattern.push(symbols[startIndex + i]);
                }
                break;
                
            case 'skip_pattern':
                // A, _, B, _, C, _ pattern (every other position)
                const skipBase = symbols[Math.floor(Math.random() * symbols.length)];
                const skipFill = symbols.filter(s => s !== skipBase)[Math.floor(Math.random() * (symbols.length - 1))];
                for (let i = 0; i < length; i++) {
                    this.currentPattern.push(i % 2 === 0 ? skipBase : skipFill);
                }
                break;
                
            case 'mirror':
                // A, B, C, C, B, A pattern
                const half = Math.floor(length / 2);
                const mirrorBase = [];
                for (let i = 0; i < half; i++) {
                    let symbol;
                    do {
                        symbol = symbols[Math.floor(Math.random() * symbols.length)];
                    } while (mirrorBase.includes(symbol));
                    mirrorBase.push(symbol);
                }
                // Build mirror pattern
                this.currentPattern = [...mirrorBase];
                for (let i = mirrorBase.length - 1; i >= 0 && this.currentPattern.length < length; i--) {
                    this.currentPattern.push(mirrorBase[i]);
                }
                // If odd length, add middle element
                if (length % 2 === 1 && this.currentPattern.length < length) {
                    this.currentPattern.splice(half, 0, mirrorBase[half - 1]);
                }
                break;
        }
        
        // Ensure pattern is exactly the right length
        this.currentPattern = this.currentPattern.slice(0, length);
        
        // Store pattern type for instruction display
        this.currentPatternType = patternType;
        
        // Remove one element to create the missing piece (avoid first and last for clarity)
        const validIndices = [];
        for (let i = 1; i < length - 1; i++) {
            validIndices.push(i);
        }
        this.missingIndex = validIndices[Math.floor(Math.random() * validIndices.length)] || Math.floor(length / 2);
        this.correctAnswer = this.currentPattern[this.missingIndex];
        
        this.renderPattern();
    }

    renderPattern() {
        const sequenceElement = document.getElementById('pattern-sequence');
        sequenceElement.innerHTML = '';
        
        // Add pattern hint based on type
        const hintElement = document.createElement('div');
        hintElement.className = 'pattern-hint';
        hintElement.style.cssText = `
            font-size: 14px; 
            color: #666; 
            margin-bottom: 15px; 
            padding: 8px 12px; 
            background: rgba(255,255,255,0.1); 
            border-radius: 20px; 
            text-align: center;
        `;
        
        const hints = {
            'alternating': '🔄 Alternating Pattern: Two colors take turns',
            'repeating': '🔁 Repeating Sequence: Same order repeats',
            'sequence': '📊 Color Sequence: Colors follow their natural order',
            'skip_pattern': '⏭️ Skip Pattern: Every other position follows a rule',
            'mirror': '🪞 Mirror Pattern: Pattern reflects like a mirror'
        };
        
        hintElement.textContent = hints[this.currentPatternType] || '🎯 Find the missing piece that completes the pattern';
        sequenceElement.appendChild(hintElement);
        
        // Create pattern display container
        const patternContainer = document.createElement('div');
        patternContainer.style.cssText = `
            display: flex; 
            gap: 10px; 
            justify-content: center; 
            flex-wrap: wrap; 
            margin: 20px 0;
        `;
        
        this.currentPattern.forEach((symbol, index) => {
            const item = document.createElement('div');
            item.className = 'pattern-item';
            
            if (index === this.missingIndex) {
                item.classList.add('missing');
                item.textContent = '?';
                item.style.cssText += `
                    background: linear-gradient(135deg, #444, #666) !important;
                    border: 3px dashed #fff;
                    font-size: 24px;
                    color: #fff;
                    animation: pulse 2s infinite;
                `;
            } else {
                item.textContent = symbol;
                item.style.background = this.getSymbolColor(symbol);
            }
            
            patternContainer.appendChild(item);
        });
        
        sequenceElement.appendChild(patternContainer);
        
        // Add pulsing animation for missing item
        if (!document.getElementById('pulse-animation')) {
            const style = document.createElement('style');
            style.id = 'pulse-animation';
            style.textContent = `
                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 0.8; }
                    50% { transform: scale(1.1); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Generate options
        const options = [this.correctAnswer];
        const allSymbols = ['🔴', '🔵', '🟢', '🟡', '🟠', '🟣', '🔶', '🔷'];
        
        while (options.length < 4) {
            const symbol = allSymbols[Math.floor(Math.random() * allSymbols.length)];
            if (!options.includes(symbol)) {
                options.push(symbol);
            }
        }
        
        // Shuffle options
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }
        
        const optionsContainer = document.getElementById('pattern-options');
        optionsContainer.innerHTML = '';
        
        options.forEach(option => {
            const button = document.createElement('div');
            button.className = 'pattern-option';
            button.textContent = option;
            button.style.background = this.getSymbolColor(option);
            button.addEventListener('click', () => this.checkPatternAnswer(option, button));
            optionsContainer.appendChild(button);
        });
    }

    getSymbolColor(symbol) {
        const colors = {
            '🔴': 'linear-gradient(135deg, #ff6b6b, #ee5a52)',
            '🔵': 'linear-gradient(135deg, #4ecdc4, #44a08d)',
            '🟢': 'linear-gradient(135deg, #55a3ff, #4481eb)',
            '🟡': 'linear-gradient(135deg, #feca57, #ff9ff3)',
            '🟠': 'linear-gradient(135deg, #ff9ff3, #f368e0)',
            '🟣': 'linear-gradient(135deg, #a29bfe, #6c5ce7)',
            '🔶': 'linear-gradient(135deg, #fd79a8, #e84393)',
            '🔷': 'linear-gradient(135deg, #00cec9, #00b894)'
        };
        return colors[symbol] || 'linear-gradient(135deg, #ddd, #bbb)';
    }

    checkPatternAnswer(selectedSymbol, buttonElement) {
        const isCorrect = selectedSymbol === this.correctAnswer;
        
        if (isCorrect) {
            buttonElement.classList.add('correct');
            this.gameStats.score += 15;
            this.patternLevel++;
            
            // Play success sound and haptic feedback
            if (window.gameAudio) {
                gameAudio.playSound('success');
                gameAudio.hapticFeedback('light');
            }
            
            setTimeout(() => {
                if (this.patternLevel > 8) {
                    this.gameStats.score += Math.max(300 - this.gameStats.time, 100);
                    
                    // Play victory sound
                    if (window.gameAudio) {
                        gameAudio.playSound('levelUp');
                        gameAudio.hapticFeedback('success');
                    }
                    
                    this.showVictory();
                } else {
                    this.generatePattern();
                }
            }, 1000);
        } else {
            // Play error sound and haptic feedback
            if (window.gameAudio) {
                gameAudio.playSound('error');
                gameAudio.hapticFeedback('error');
            }
            
            // Show correct answer
            const correctButton = Array.from(document.querySelectorAll('.pattern-option'))
                .find(btn => btn.textContent === this.correctAnswer);
            if (correctButton) {
                correctButton.classList.add('correct');
            }
            
            setTimeout(() => {
                this.generatePattern();
            }, 1500);
        }
        
        this.updateStats();
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    new PuzzleGameManager();
});
