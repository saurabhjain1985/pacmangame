// Snake iOS Game - Advanced JavaScript Implementation
class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Game settings
        this.gridSize = 20;
        this.gridWidth = this.canvas.width / this.gridSize;
        this.gridHeight = this.canvas.height / this.gridSize;
        
        // Game state
        this.gameState = 'menu'; // menu, playing, paused, over
        this.snake = [{ x: 10, y: 10 }];
        this.direction = { x: 0, y: 0 };
        this.nextDirection = { x: 0, y: 0 };
        this.food = { x: 15, y: 15 };
        this.score = 0;
        this.highScore = this.loadHighScore();
        this.gameSpeed = 150; // milliseconds
        this.gameLoop = null;
        this.lastTime = 0;
        
        // Speed settings
        this.speeds = {
            slow: 200,
            normal: 150,
            fast: 100
        };
        
        // Touch handling
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.minSwipeDistance = 50;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.showScreen('start-screen');
        this.updateDisplay();
        this.setSpeed('normal');
        console.log('Snake game initialized');
    }

    bindEvents() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            try {
                this.handleKeyPress(e);
            } catch (error) {
                console.error('Keyboard event error:', error);
            }
        });

        // Touch controls for mobile
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            this.touchStartX = touch.clientX;
            this.touchStartY = touch.clientY;
        });

        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
        });

        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            if (!e.changedTouches) return;
            
            const touch = e.changedTouches[0];
            const deltaX = touch.clientX - this.touchStartX;
            const deltaY = touch.clientY - this.touchStartY;
            
            this.handleSwipe(deltaX, deltaY);
        });

        // Prevent zoom on double tap
        document.addEventListener('touchend', (e) => {
            if (e.target.closest('#game-canvas')) {
                e.preventDefault();
            }
        });

        // Resize handling
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    handleKeyPress(e) {
        if (this.gameState !== 'playing') return;

        switch (e.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                e.preventDefault();
                this.changeDirection('up');
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                e.preventDefault();
                this.changeDirection('down');
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                e.preventDefault();
                this.changeDirection('left');
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                e.preventDefault();
                this.changeDirection('right');
                break;
            case ' ':
            case 'Escape':
                e.preventDefault();
                this.pauseGame();
                break;
        }
    }

    handleSwipe(deltaX, deltaY) {
        if (this.gameState !== 'playing') return;

        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);

        if (Math.max(absX, absY) < this.minSwipeDistance) return;

        if (absX > absY) {
            // Horizontal swipe
            if (deltaX > 0) {
                this.changeDirection('right');
            } else {
                this.changeDirection('left');
            }
        } else {
            // Vertical swipe
            if (deltaY > 0) {
                this.changeDirection('down');
            } else {
                this.changeDirection('up');
            }
        }
    }

    handleResize() {
        // Maintain aspect ratio on mobile
        const container = document.getElementById('game-container');
        const containerWidth = container.clientWidth;
        if (containerWidth < 600) {
            const size = Math.min(containerWidth * 0.9, 350);
            this.canvas.style.width = size + 'px';
            this.canvas.style.height = size + 'px';
        }
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }

    setSpeed(speed) {
        this.gameSpeed = this.speeds[speed];
        
        // Update UI
        document.querySelectorAll('.speed-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-speed="${speed}"]`).classList.add('active');
    }

    startGame() {
        this.gameState = 'playing';
        this.resetGame();
        this.generateFood();
        this.showScreen('game-screen');
        this.startGameLoop();
        this.handleResize();
    }

    resetGame() {
        this.snake = [{ x: 10, y: 10 }];
        this.direction = { x: 1, y: 0 }; // Start moving right
        this.nextDirection = { x: 1, y: 0 };
        this.score = 0;
        this.updateDisplay();
        this.clearCanvas();
    }

    startGameLoop() {
        this.gameLoop = setInterval(() => {
            if (this.gameState === 'playing') {
                this.update();
                this.draw();
            }
        }, this.gameSpeed);
    }

    stopGameLoop() {
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        }
    }

    update() {
        // Update direction
        this.direction = { ...this.nextDirection };
        
        // Calculate new head position
        const head = { ...this.snake[0] };
        head.x += this.direction.x;
        head.y += this.direction.y;
        
        // Check wall collision
        if (head.x < 0 || head.x >= this.gridWidth || 
            head.y < 0 || head.y >= this.gridHeight) {
            this.gameOver();
            return;
        }
        
        // Check self collision
        if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.gameOver();
            return;
        }
        
        // Add new head
        this.snake.unshift(head);
        
        // Check food collision
        if (head.x === this.food.x && head.y === this.food.y) {
            this.eatFood();
        } else {
            // Remove tail if no food eaten
            this.snake.pop();
        }
    }

    eatFood() {
        this.score += 10;
        this.generateFood();
        this.updateDisplay();
        // Play eat sound with haptic feedback
        if (window.gameAudio) {
            gameAudio.playSound('success', 800);
            gameAudio.hapticFeedback('light');
        } else {
            this.playEatSound();
        }
        
        // Increase speed slightly as snake grows
        if (this.snake.length % 5 === 0) {
            this.gameSpeed = Math.max(80, this.gameSpeed * 0.95);
            this.stopGameLoop();
            this.startGameLoop();
        }
    }

    generateFood() {
        let newFood;
        do {
            newFood = {
                x: Math.floor(Math.random() * this.gridWidth),
                y: Math.floor(Math.random() * this.gridHeight)
            };
        } while (this.snake.some(segment => 
            segment.x === newFood.x && segment.y === newFood.y));
        
        this.food = newFood;
    }

    changeDirection(direction) {
        const directions = {
            up: { x: 0, y: -1 },
            down: { x: 0, y: 1 },
            left: { x: -1, y: 0 },
            right: { x: 1, y: 0 }
        };
        
        const newDir = directions[direction];
        
        // Prevent reversing into itself
        if (newDir.x === -this.direction.x && newDir.y === -this.direction.y) {
            return;
        }
        
        this.nextDirection = newDir;
        this.addHapticFeedback();
    }

    addHapticFeedback() {
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    }

    draw() {
        this.clearCanvas();
        this.drawFood();
        this.drawSnake();
    }

    clearCanvas() {
        // Create gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        gradient.addColorStop(0, 'rgba(102, 126, 234, 0.1)');
        gradient.addColorStop(1, 'rgba(118, 75, 162, 0.1)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawSnake() {
        this.snake.forEach((segment, index) => {
            const x = segment.x * this.gridSize;
            const y = segment.y * this.gridSize;
            
            if (index === 0) {
                // Draw head
                this.ctx.fillStyle = '#00ff00';
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = '#00ff00';
            } else {
                // Draw body
                const alpha = 1 - (index * 0.05);
                this.ctx.fillStyle = `rgba(0, 255, 0, ${Math.max(alpha, 0.3)})`;
                this.ctx.shadowBlur = 5;
                this.ctx.shadowColor = '#00ff00';
            }
            
            this.ctx.fillRect(x + 1, y + 1, this.gridSize - 2, this.gridSize - 2);
            this.ctx.shadowBlur = 0;
        });
    }

    drawFood() {
        const x = this.food.x * this.gridSize;
        const y = this.food.y * this.gridSize;
        
        // Pulsing food effect
        const time = Date.now() / 200;
        const pulse = Math.sin(time) * 0.2 + 1;
        const size = (this.gridSize - 4) * pulse;
        const offset = (this.gridSize - size) / 2;
        
        this.ctx.fillStyle = '#ff0000';
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = '#ff0000';
        this.ctx.fillRect(x + offset, y + offset, size, size);
        this.ctx.shadowBlur = 0;
    }

    pauseGame() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            this.stopGameLoop();
            this.showScreen('pause-screen');
        }
    }

    resumeGame() {
        if (this.gameState === 'paused') {
            this.gameState = 'playing';
            this.startGameLoop();
            this.showScreen('game-screen');
        }
    }

    restartGame() {
        this.stopGameLoop();
        this.startGame();
    }

    goToMenu() {
        this.stopGameLoop();
        this.gameState = 'menu';
        this.showScreen('start-screen');
    }

    gameOver() {
        this.gameState = 'over';
        this.stopGameLoop();
        
        // Update high score
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.saveHighScore();
        }
        
        this.showGameOverScreen();
        // Play game over sound with haptic feedback
        if (window.gameAudio) {
            gameAudio.playSound('error');
            gameAudio.hapticFeedback('gameOver');
        } else {
            this.playGameOverSound();
        }
    }

    showGameOverScreen() {
        document.getElementById('final-score').textContent = this.score;
        document.getElementById('final-length').textContent = this.snake.length;
        document.getElementById('final-high-score').textContent = this.highScore;
        
        // Achievement message
        let message = '';
        if (this.score === this.highScore && this.score > 0) {
            message = '🏆 New High Score! Amazing!';
        } else if (this.snake.length >= 20) {
            message = '🐍 Super Snake! You\'re getting good!';
        } else if (this.snake.length >= 10) {
            message = '🎯 Nice job! Keep practicing!';
        } else {
            message = '💪 Good try! Practice makes perfect!';
        }
        
        document.getElementById('achievement-message').textContent = message;
        this.showScreen('game-over-screen');
    }

    playAgain() {
        this.startGame();
    }

    updateDisplay() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('high-score').textContent = this.highScore;
        document.getElementById('length').textContent = this.snake.length;
    }

    playEatSound() {
        try {
            const audioContext = new (AudioContext || webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (error) {
            // Silent fail for browsers without Web Audio API
        }
    }

    playGameOverSound() {
        try {
            const audioContext = new (AudioContext || webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.5);
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (error) {
            // Silent fail for browsers without Web Audio API
        }
    }

    saveHighScore() {
        try {
            localStorage.setItem('snakeHighScore', this.highScore.toString());
        } catch (error) {
            console.warn('Could not save high score:', error);
        }
    }

    loadHighScore() {
        try {
            return parseInt(localStorage.getItem('snakeHighScore')) || 0;
        } catch (error) {
            console.warn('Could not load high score:', error);
            return 0;
        }
    }
}

// Global functions for HTML onclick events
function setSpeed(speed) {
    snakeGame.setSpeed(speed);
}

function startGame() {
    snakeGame.startGame();
}

function pauseGame() {
    snakeGame.pauseGame();
}

function resumeGame() {
    snakeGame.resumeGame();
}

function restartGame() {
    snakeGame.restartGame();
}

function goToMenu() {
    snakeGame.goToMenu();
}

function playAgain() {
    snakeGame.playAgain();
}

function changeDirection(direction) {
    snakeGame.changeDirection(direction);
}

// Initialize the game when DOM is loaded
const snakeGame = new SnakeGame();

// Add performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`🐍 Snake game loaded in ${loadTime}ms`);
    });
}
