// Tetris Game - iOS Style Implementation
console.log('🧩 Loading Tetris Game...');

class TetrisGame {
    constructor() {
        console.log('Creating Tetris Game instance');
        this.gameState = 'menu'; // menu, playing, paused, gameover
        this.difficulty = null;
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.dropTime = 0;
        this.lastTime = 0;
        
        // Game settings based on difficulty
        this.difficulties = {
            easy: { dropInterval: 1000, scoreMultiplier: 1 },
            medium: { dropInterval: 600, scoreMultiplier: 1.5 },
            hard: { dropInterval: 300, scoreMultiplier: 2 }
        };
        
        // Game board
        this.board = [];
        this.boardWidth = 10;
        this.boardHeight = 20;
        this.blockSize = 30;
        
        // Current and next pieces
        this.currentPiece = null;
        this.nextPiece = null;
        this.currentPosition = { x: 0, y: 0 };
        
        // Canvas contexts
        this.canvas = null;
        this.ctx = null;
        this.nextCanvas = null;
        this.nextCtx = null;
        
        // Tetris pieces (tetrominoes)
        this.pieces = {
            'I': {
                shape: [
                    [0, 0, 0, 0],
                    [1, 1, 1, 1],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                ],
                color: '#00f5ff'
            },
            'O': {
                shape: [
                    [1, 1],
                    [1, 1]
                ],
                color: '#ffed00'
            },
            'T': {
                shape: [
                    [0, 1, 0],
                    [1, 1, 1],
                    [0, 0, 0]
                ],
                color: '#a000f0'
            },
            'S': {
                shape: [
                    [0, 1, 1],
                    [1, 1, 0],
                    [0, 0, 0]
                ],
                color: '#00f000'
            },
            'Z': {
                shape: [
                    [1, 1, 0],
                    [0, 1, 1],
                    [0, 0, 0]
                ],
                color: '#f00000'
            },
            'J': {
                shape: [
                    [1, 0, 0],
                    [1, 1, 1],
                    [0, 0, 0]
                ],
                color: '#0000f0'
            },
            'L': {
                shape: [
                    [0, 0, 1],
                    [1, 1, 1],
                    [0, 0, 0]
                ],
                color: '#f0a000'
            }
        };
        
        this.pieceTypes = Object.keys(this.pieces);
        
        this.init();
    }
    
    init() {
        console.log('Initializing Tetris game');
        this.initializeBoard();
        this.setupCanvas();
        this.bindEvents();
        this.showScreen('start-screen');
    }
    
    initializeBoard() {
        this.board = [];
        for (let row = 0; row < this.boardHeight; row++) {
            this.board[row] = [];
            for (let col = 0; col < this.boardWidth; col++) {
                this.board[row][col] = 0;
            }
        }
    }
    
    setupCanvas() {
        this.canvas = document.getElementById('tetris-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.nextCanvas = document.getElementById('next-canvas');
        this.nextCtx = this.nextCanvas.getContext('2d');
        
        // Set canvas size
        this.canvas.width = this.boardWidth * this.blockSize;
        this.canvas.height = this.boardHeight * this.blockSize;
    }
    
    bindEvents() {
        console.log('Binding game events');
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (this.gameState !== 'playing') return;
            
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.moveLeft();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.moveRight();
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.moveDown();
                    break;
                case 'ArrowUp':
                case ' ':
                    e.preventDefault();
                    this.rotatePiece();
                    break;
                case 'Escape':
                    this.pauseGame();
                    break;
            }
        });
        
        // Mobile controls
        document.getElementById('left-btn').addEventListener('click', () => this.moveLeft());
        document.getElementById('right-btn').addEventListener('click', () => this.moveRight());
        document.getElementById('rotate-btn').addEventListener('click', () => this.rotatePiece());
        document.getElementById('drop-btn').addEventListener('click', () => this.hardDrop());
        
        // Touch events for mobile
        let touchStartX = 0;
        let touchStartY = 0;
        
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });
        
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                // Horizontal swipe
                if (deltaX > 30) {
                    this.moveRight();
                } else if (deltaX < -30) {
                    this.moveLeft();
                }
            } else {
                // Vertical swipe
                if (deltaY > 30) {
                    this.moveDown();
                } else if (deltaY < -30) {
                    this.rotatePiece();
                }
            }
        });
    }
    
    showScreen(screenId) {
        console.log('Showing screen:', screenId);
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }
    
    startGame(difficulty) {
        console.log('🎮 Starting Tetris with difficulty:', difficulty);
        this.difficulty = difficulty;
        this.gameState = 'playing';
        this.resetGame();
        this.generateNextPiece();
        this.spawnNewPiece();
        this.showScreen('game-screen');
        this.gameLoop();
    }
    
    resetGame() {
        console.log('Resetting game state');
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.dropTime = 0;
        this.initializeBoard();
        this.updateDisplay();
    }
    
    generateNextPiece() {
        const randomType = this.pieceTypes[Math.floor(Math.random() * this.pieceTypes.length)];
        this.nextPiece = {
            type: randomType,
            shape: this.pieces[randomType].shape,
            color: this.pieces[randomType].color
        };
        this.drawNextPiece();
    }
    
    spawnNewPiece() {
        this.currentPiece = this.nextPiece;
        this.currentPosition = {
            x: Math.floor((this.boardWidth - this.currentPiece.shape[0].length) / 2),
            y: 0
        };
        
        this.generateNextPiece();
        
        // Check for game over
        if (this.isColliding(this.currentPiece.shape, this.currentPosition)) {
            this.gameOver();
        }
    }
    
    moveLeft() {
        if (this.gameState !== 'playing') return;
        const newPos = { x: this.currentPosition.x - 1, y: this.currentPosition.y };
        if (!this.isColliding(this.currentPiece.shape, newPos)) {
            this.currentPosition = newPos;
            this.playSound('move');
        }
    }
    
    moveRight() {
        if (this.gameState !== 'playing') return;
        const newPos = { x: this.currentPosition.x + 1, y: this.currentPosition.y };
        if (!this.isColliding(this.currentPiece.shape, newPos)) {
            this.currentPosition = newPos;
            this.playSound('move');
        }
    }
    
    moveDown() {
        if (this.gameState !== 'playing') return;
        const newPos = { x: this.currentPosition.x, y: this.currentPosition.y + 1 };
        if (!this.isColliding(this.currentPiece.shape, newPos)) {
            this.currentPosition = newPos;
            this.score += 1;
            this.updateDisplay();
            return true;
        } else {
            this.placePiece();
            return false;
        }
    }
    
    hardDrop() {
        if (this.gameState !== 'playing') return;
        let dropDistance = 0;
        while (this.moveDown()) {
            dropDistance++;
        }
        this.score += dropDistance * 2;
        this.updateDisplay();
        this.playSound('drop');
    }
    
    rotatePiece() {
        if (this.gameState !== 'playing') return;
        const rotated = this.rotateMatrix(this.currentPiece.shape);
        if (!this.isColliding(rotated, this.currentPosition)) {
            this.currentPiece.shape = rotated;
            this.playSound('rotate');
        }
    }
    
    rotateMatrix(matrix) {
        const rows = matrix.length;
        const cols = matrix[0].length;
        const rotated = [];
        
        for (let i = 0; i < cols; i++) {
            rotated[i] = [];
            for (let j = 0; j < rows; j++) {
                rotated[i][j] = matrix[rows - 1 - j][i];
            }
        }
        
        return rotated;
    }
    
    isColliding(shape, position) {
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const newX = position.x + col;
                    const newY = position.y + row;
                    
                    // Check boundaries
                    if (newX < 0 || newX >= this.boardWidth || newY >= this.boardHeight) {
                        return true;
                    }
                    
                    // Check collision with placed pieces
                    if (newY >= 0 && this.board[newY][newX]) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    
    placePiece() {
        // Place the current piece on the board
        for (let row = 0; row < this.currentPiece.shape.length; row++) {
            for (let col = 0; col < this.currentPiece.shape[row].length; col++) {
                if (this.currentPiece.shape[row][col]) {
                    const boardX = this.currentPosition.x + col;
                    const boardY = this.currentPosition.y + row;
                    if (boardY >= 0) {
                        this.board[boardY][boardX] = this.currentPiece.color;
                    }
                }
            }
        }
        
        this.checkForCompleteLines();
        this.spawnNewPiece();
        this.playSound('place');
    }
    
    checkForCompleteLines() {
        let linesCleared = 0;
        
        for (let row = this.boardHeight - 1; row >= 0; row--) {
            if (this.board[row].every(cell => cell !== 0)) {
                // Remove the complete line
                this.board.splice(row, 1);
                // Add a new empty line at the top
                this.board.unshift(new Array(this.boardWidth).fill(0));
                row++; // Check the same row again
                linesCleared++;
            }
        }
        
        if (linesCleared > 0) {
            this.lines += linesCleared;
            this.level = Math.floor(this.lines / 10) + 1;
            
            // Score calculation
            const lineScores = [0, 100, 300, 500, 800];
            this.score += lineScores[linesCleared] * this.level * this.difficulties[this.difficulty].scoreMultiplier;
            
            this.updateDisplay();
            this.playSound('line');
        }
    }
    
    gameLoop() {
        if (this.gameState !== 'playing') return;
        
        const currentTime = Date.now();
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        this.dropTime += deltaTime;
        
        // Calculate drop interval based on level
        const baseInterval = this.difficulties[this.difficulty].dropInterval;
        const dropInterval = Math.max(50, baseInterval - (this.level - 1) * 50);
        
        if (this.dropTime > dropInterval) {
            this.moveDown();
            this.dropTime = 0;
        }
        
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#1a1a2e';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw placed pieces
        for (let row = 0; row < this.boardHeight; row++) {
            for (let col = 0; col < this.boardWidth; col++) {
                if (this.board[row][col]) {
                    this.drawBlock(col * this.blockSize, row * this.blockSize, this.board[row][col]);
                }
            }
        }
        
        // Draw current piece
        if (this.currentPiece) {
            for (let row = 0; row < this.currentPiece.shape.length; row++) {
                for (let col = 0; col < this.currentPiece.shape[row].length; col++) {
                    if (this.currentPiece.shape[row][col]) {
                        const x = (this.currentPosition.x + col) * this.blockSize;
                        const y = (this.currentPosition.y + row) * this.blockSize;
                        this.drawBlock(x, y, this.currentPiece.color);
                    }
                }
            }
        }
        
        // Draw grid
        this.drawGrid();
    }
    
    drawBlock(x, y, color) {
        // Draw the main block
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, this.blockSize, this.blockSize);
        
        // Draw border for 3D effect
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x, y, this.blockSize, this.blockSize);
        
        // Add highlight
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.fillRect(x + 1, y + 1, this.blockSize - 2, 2);
        this.ctx.fillRect(x + 1, y + 1, 2, this.blockSize - 2);
    }
    
    drawGrid() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;
        
        // Vertical lines
        for (let col = 0; col <= this.boardWidth; col++) {
            this.ctx.beginPath();
            this.ctx.moveTo(col * this.blockSize, 0);
            this.ctx.lineTo(col * this.blockSize, this.canvas.height);
            this.ctx.stroke();
        }
        
        // Horizontal lines
        for (let row = 0; row <= this.boardHeight; row++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, row * this.blockSize);
            this.ctx.lineTo(this.canvas.width, row * this.blockSize);
            this.ctx.stroke();
        }
    }
    
    drawNextPiece() {
        if (!this.nextPiece) return;
        
        // Clear next canvas
        this.nextCtx.fillStyle = '#1a1a2e';
        this.nextCtx.fillRect(0, 0, this.nextCanvas.width, this.nextCanvas.height);
        
        const blockSize = 15;
        const shape = this.nextPiece.shape;
        const offsetX = (this.nextCanvas.width - shape[0].length * blockSize) / 2;
        const offsetY = (this.nextCanvas.height - shape.length * blockSize) / 2;
        
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const x = offsetX + col * blockSize;
                    const y = offsetY + row * blockSize;
                    
                    this.nextCtx.fillStyle = this.nextPiece.color;
                    this.nextCtx.fillRect(x, y, blockSize, blockSize);
                    
                    this.nextCtx.strokeStyle = '#ffffff';
                    this.nextCtx.lineWidth = 1;
                    this.nextCtx.strokeRect(x, y, blockSize, blockSize);
                }
            }
        }
    }
    
    updateDisplay() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('level').textContent = this.level;
        document.getElementById('lines').textContent = this.lines;
    }
    
    playSound(type) {
        // Use the comprehensive game audio system with haptic feedback
        if (window.gameAudio) {
            switch(type) {
                case 'move':
                    gameAudio.playSound('blip', 200, 0.1); // Soft blip for movement
                    gameAudio.hapticFeedback('light');
                    break;
                case 'rotate':
                    gameAudio.playSound('blip', 300, 0.1); // Higher pitched for rotation
                    gameAudio.hapticFeedback('light');
                    break;
                case 'drop':
                    gameAudio.playSound('blip', 150, 0.2); // Lower pitched for drop
                    gameAudio.hapticFeedback('medium');
                    break;
                case 'place':
                    gameAudio.playSound('success', 400); // Success sound for piece placement
                    gameAudio.hapticFeedback('medium');
                    break;
                case 'line':
                    gameAudio.playSound('levelUp'); // Celebration sound for line clear
                    gameAudio.hapticFeedback('success');
                    break;
                case 'gameOver':
                    gameAudio.playSound('error'); // Game over sound
                    gameAudio.hapticFeedback('gameOver');
                    break;
            }
        } else {
            // Fallback to basic audio
            this.playBasicSound(type);
        }
    }
    
    playBasicSound(type) {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            switch(type) {
                case 'move':
                    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
                    gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
                    break;
                case 'rotate':
                    oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
                    gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
                    break;
                case 'drop':
                    oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
                    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                    break;
                case 'place':
                    oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
                    gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
                    break;
                case 'line':
                    oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.2);
                    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                    break;
                case 'gameOver':
                    oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.5);
                    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                    break;
            }
            
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (error) {
            // Silent fail for audio
        }
    }
    
    pauseGame() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            this.showScreen('pause-screen');
        }
    }
    
    resumeGame() {
        if (this.gameState === 'paused') {
            this.gameState = 'playing';
            this.lastTime = Date.now();
            this.showScreen('game-screen');
            this.gameLoop();
        }
    }
    
    restartGame() {
        console.log('🔄 Restarting Tetris');
        this.startGame(this.difficulty);
    }
    
    newGame() {
        console.log('🆕 Starting new Tetris game');
        this.gameState = 'menu';
        this.showScreen('start-screen');
    }
    
    gameOver() {
        console.log('💀 Game Over');
        this.gameState = 'gameover';
        this.playSound('gameOver');
        
        // Update final stats
        document.getElementById('final-score').textContent = this.score;
        document.getElementById('final-level').textContent = this.level;
        document.getElementById('final-lines').textContent = this.lines;
        
        this.showScreen('game-over-screen');
    }
    
    playAgain() {
        this.restartGame();
    }
}

// Global functions for HTML onclick events
function startGame(difficulty) {
    console.log('🚀 Global startGame called with:', difficulty);
    if (window.tetrisGameInstance) {
        window.tetrisGameInstance.startGame(difficulty);
    }
}

function pauseGame() {
    if (window.tetrisGameInstance) {
        window.tetrisGameInstance.pauseGame();
    }
}

function resumeGame() {
    if (window.tetrisGameInstance) {
        window.tetrisGameInstance.resumeGame();
    }
}

function restartGame() {
    if (window.tetrisGameInstance) {
        window.tetrisGameInstance.restartGame();
    }
}

function newGame() {
    if (window.tetrisGameInstance) {
        window.tetrisGameInstance.newGame();
    }
}

function playAgain() {
    if (window.tetrisGameInstance) {
        window.tetrisGameInstance.playAgain();
    }
}

// Initialize Tetris when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing Tetris');
    window.tetrisGameInstance = new TetrisGame();
});

// Fallback initialization
if (document.readyState === 'loading') {
    console.log('Document still loading, waiting for DOMContentLoaded');
} else {
    console.log('Document already loaded, initializing Tetris immediately');
    window.tetrisGameInstance = new TetrisGame();
}

console.log('🧩 Tetris Game script loaded successfully!');
