// Breakout Game - iOS Style Implementation
console.log('🏓 Loading Breakout Game...');

class BreakoutGame {
    constructor() {
        console.log('Creating Breakout Game instance');
        this.gameState = 'menu'; // menu, playing, paused, gameover, levelcomplete
        this.difficulty = null;
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.bricksDestroyed = 0;
        
        // Game settings based on difficulty
        this.difficulties = {
            easy: { ballSpeed: 3, paddleWidth: 100, scoreMultiplier: 1, brickRows: 6 },
            medium: { ballSpeed: 4, paddleWidth: 80, scoreMultiplier: 1.5, brickRows: 7 },
            hard: { ballSpeed: 5, paddleWidth: 60, scoreMultiplier: 2, brickRows: 8 }
        };
        
        // Game objects
        this.canvas = null;
        this.ctx = null;
        this.canvasWidth = 800;
        this.canvasHeight = 600;
        
        // Paddle
        this.paddle = {
            width: 80,
            height: 10,
            x: 0,
            y: 0,
            speed: 8,
            moving: false,
            direction: 0 // -1 for left, 1 for right, 0 for stop
        };
        
        // Ball
        this.ball = {
            x: 0,
            y: 0,
            radius: 8,
            dx: 0,
            dy: 0,
            speed: 4,
            launched: false
        };
        
        // Bricks
        this.bricks = [];
        this.brickRows = 8;
        this.brickCols = 10;
        this.brickWidth = 75;
        this.brickHeight = 20;
        this.brickPadding = 5;
        this.brickOffsetTop = 60;
        this.brickOffsetLeft = 35;
        
        // Special abilities for faster completion
        this.powerUps = [];
        this.multiball = false;
        this.extraBalls = [];
        this.fastBreak = false; // Enables one-hit brick destruction
        
        // Input handling
        this.keys = {};
        this.mouseX = 0;
        this.touchX = 0;
        
        this.init();
    }
    
    init() {
        console.log('Initializing Breakout game');
        this.setupCanvas();
        this.bindEvents();
        this.showScreen('start-screen');
    }
    
    setupCanvas() {
        this.canvas = document.getElementById('breakout-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas size
        this.canvas.width = this.canvasWidth;
        this.canvas.height = this.canvasHeight;
    }
    
    bindEvents() {
        console.log('Binding game events');
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            
            if (this.gameState === 'playing') {
                switch(e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.paddle.direction = -1;
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        this.paddle.direction = 1;
                        break;
                    case ' ':
                        e.preventDefault();
                        this.launchBall();
                        break;
                    case 'Escape':
                        this.pauseGame();
                        break;
                    // Cheat keys for faster completion
                    case 'f':
                        e.preventDefault();
                        this.fastBreak = !this.fastBreak;
                        console.log('Fast break mode:', this.fastBreak ? 'ON' : 'OFF');
                        break;
                    case 'm':
                        e.preventDefault();
                        this.createMultiballs();
                        console.log('Multiballs activated!');
                        break;
                    case 'n':
                        e.preventDefault();
                        this.nextLevel();
                        console.log('Skipped to next level!');
                        break;
                    case 'b':
                        e.preventDefault();
                        this.destroyRandomBricks(10);
                        console.log('Destroyed 10 random bricks!');
                        break;
                }
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
            
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                this.paddle.direction = 0;
            }
        });
        
        // Mouse controls
        let mouseActive = false;
        
        this.canvas.addEventListener('mousemove', (e) => {
            if (this.gameState === 'playing' && this.paddle.direction === 0) {
                const rect = this.canvas.getBoundingClientRect();
                this.mouseX = e.clientX - rect.left;
                mouseActive = true;
                // Reset mouse activity after a short delay
                setTimeout(() => { 
                    if (this.paddle.direction === 0) mouseActive = false; 
                }, 100);
            }
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            mouseActive = false;
            this.mouseX = 0;
        });
        
        this.canvas.addEventListener('click', (e) => {
            if (this.gameState === 'playing') {
                this.launchBall();
            }
        });
        
        // Touch controls
        let touchActive = false;
        
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (this.gameState === 'playing' && this.paddle.direction === 0) {
                const rect = this.canvas.getBoundingClientRect();
                this.touchX = e.touches[0].clientX - rect.left;
                touchActive = true;
            }
        });
        
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (this.gameState === 'playing') {
                this.launchBall();
            }
        });
        
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            touchActive = false;
            this.touchX = 0;
        });
        
        // Mobile control buttons
        let leftPressed = false;
        let rightPressed = false;
        
        document.getElementById('left-btn').addEventListener('mousedown', () => {
            leftPressed = true;
            this.paddle.direction = -1;
        });
        
        document.getElementById('left-btn').addEventListener('mouseup', () => {
            leftPressed = false;
            if (!rightPressed) this.paddle.direction = 0;
        });
        
        document.getElementById('left-btn').addEventListener('touchstart', (e) => {
            e.preventDefault();
            leftPressed = true;
            this.paddle.direction = -1;
        });
        
        document.getElementById('left-btn').addEventListener('touchend', (e) => {
            e.preventDefault();
            leftPressed = false;
            if (!rightPressed) this.paddle.direction = 0;
        });
        
        document.getElementById('right-btn').addEventListener('mousedown', () => {
            rightPressed = true;
            this.paddle.direction = 1;
        });
        
        document.getElementById('right-btn').addEventListener('mouseup', () => {
            rightPressed = false;
            if (!leftPressed) this.paddle.direction = 0;
        });
        
        document.getElementById('right-btn').addEventListener('touchstart', (e) => {
            e.preventDefault();
            rightPressed = true;
            this.paddle.direction = 1;
        });
        
        document.getElementById('right-btn').addEventListener('touchend', (e) => {
            e.preventDefault();
            rightPressed = false;
            if (!leftPressed) this.paddle.direction = 0;
        });
        
        document.getElementById('launch-btn').addEventListener('click', () => {
            this.launchBall();
        });
        
        document.getElementById('launch-btn').addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.launchBall();
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
        console.log('🎮 Starting Breakout with difficulty:', difficulty);
        this.difficulty = difficulty;
        this.gameState = 'playing';
        this.resetGame();
        this.setupLevel();
        this.showScreen('game-screen');
        this.gameLoop();
    }
    
    resetGame() {
        console.log('Resetting game state');
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.bricksDestroyed = 0;
        this.updateDisplay();
    }
    
    setupLevel() {
        const config = this.difficulties[this.difficulty];
        
        // Setup paddle (gets smaller with each level)
        this.paddle.width = Math.max(50, config.paddleWidth - (this.level - 1) * 5);
        this.paddle.x = (this.canvasWidth - this.paddle.width) / 2;
        this.paddle.y = this.canvasHeight - 30;
        
        // Setup ball (gets faster with each level)
        this.ball.speed = config.ballSpeed + (this.level - 1) * 0.3;
        this.ball.x = this.canvasWidth / 2;
        this.ball.y = this.paddle.y - this.ball.radius;
        this.ball.dx = 0;
        this.ball.dy = 0;
        this.ball.launched = false;
        
        // Adjust brick rows based on difficulty and level
        this.brickRows = Math.min(config.brickRows + Math.floor((this.level - 1) / 2), 10);
        
        // Reset power-ups for new level
        this.multiball = false;
        this.extraBalls = [];
        this.fastBreak = false;
        this.powerUps = [];
        
        // Create bricks
        this.createBricks();
    }
    
    createBricks() {
        this.bricks = [];
        
        for (let r = 0; r < this.brickRows; r++) {
            for (let c = 0; c < this.brickCols; c++) {
                const brick = {
                    x: c * (this.brickWidth + this.brickPadding) + this.brickOffsetLeft,
                    y: r * (this.brickHeight + this.brickPadding) + this.brickOffsetTop,
                    width: this.brickWidth,
                    height: this.brickHeight,
                    status: 1, // 1 = visible, 0 = destroyed
                    color: this.getBrickColor(r),
                    points: (this.brickRows - r) * 10, // Higher rows worth more points
                    powerUp: Math.random() < 0.15 ? this.getRandomPowerUp() : null // 15% chance for power-up
                };
                this.bricks.push(brick);
            }
        }
        
        console.log('Created', this.bricks.length, 'bricks with power-ups');
    }
    
    getRandomPowerUp() {
        const powerUps = ['multiball', 'fastbreak', 'bigpaddle', 'slowball', 'fireball'];
        return powerUps[Math.floor(Math.random() * powerUps.length)];
    }
    
    getBrickColor(row) {
        const colors = [
            '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4',
            '#ffeaa7', '#dda0dd', '#98d8c8', '#f7dc6f'
        ];
        return colors[row % colors.length];
    }
    
    launchBall() {
        if (!this.ball.launched && this.gameState === 'playing') {
            this.ball.launched = true;
            this.ball.dx = this.ball.speed * (Math.random() > 0.5 ? 1 : -1);
            this.ball.dy = -this.ball.speed;
            this.playSound('launch');
            console.log('Ball launched!');
        }
    }
    
    gameLoop() {
        if (this.gameState !== 'playing') return;
        
        this.update();
        this.draw();
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    update() {
        // Update paddle position with keyboard (highest priority)
        if (this.paddle.direction !== 0) {
            this.paddle.x += this.paddle.direction * this.paddle.speed;
        }
        // Mouse/touch paddle control (only if no keyboard input)
        else if (this.mouseX > 0) {
            this.paddle.x = this.mouseX - this.paddle.width / 2;
        } else if (this.touchX > 0) {
            this.paddle.x = this.touchX - this.paddle.width / 2;
        }
        
        // Keep paddle in bounds
        if (this.paddle.x < 0) this.paddle.x = 0;
        if (this.paddle.x + this.paddle.width > this.canvasWidth) {
            this.paddle.x = this.canvasWidth - this.paddle.width;
        }
        
        // Update ball position if launched
        if (this.ball.launched) {
            this.ball.x += this.ball.dx;
            this.ball.y += this.ball.dy;
            
            // Ball collision with walls
            if (this.ball.x + this.ball.radius > this.canvasWidth || this.ball.x - this.ball.radius < 0) {
                this.ball.dx = -this.ball.dx;
                this.playSound('wall');
            }
            
            if (this.ball.y - this.ball.radius < 0) {
                this.ball.dy = -this.ball.dy;
                this.playSound('wall');
            }
            
            // Ball collision with paddle
            if (this.ball.y + this.ball.radius > this.paddle.y &&
                this.ball.x > this.paddle.x &&
                this.ball.x < this.paddle.x + this.paddle.width) {
                
                // Calculate bounce angle based on where ball hits paddle
                const hitPos = (this.ball.x - this.paddle.x) / this.paddle.width;
                const angle = (hitPos - 0.5) * Math.PI / 3; // Max 60 degrees
                
                this.ball.dx = this.ball.speed * Math.sin(angle);
                this.ball.dy = -Math.abs(this.ball.speed * Math.cos(angle));
                this.playSound('paddle');
            }
            
            // Ball falls below paddle
            if (this.ball.y > this.canvasHeight) {
                this.loseLife();
            }
            
            // Ball collision with bricks
            this.checkBrickCollisions();
        } else {
            // Ball follows paddle when not launched
            this.ball.x = this.paddle.x + this.paddle.width / 2;
        }
        
        // Update power-ups
        this.updatePowerUps();
    }
    
    updatePowerUps() {
        for (let i = this.powerUps.length - 1; i >= 0; i--) {
            const powerUp = this.powerUps[i];
            
            if (!powerUp.active) continue;
            
            powerUp.y += powerUp.dy;
            
            // Check collision with paddle
            if (powerUp.y + powerUp.height > this.paddle.y &&
                powerUp.x + powerUp.width > this.paddle.x &&
                powerUp.x < this.paddle.x + this.paddle.width) {
                
                this.activatePowerUp(powerUp.type);
                this.powerUps.splice(i, 1);
                this.playSound('powerup');
                continue;
            }
            
            // Remove if off screen
            if (powerUp.y > this.canvasHeight) {
                this.powerUps.splice(i, 1);
            }
        }
    }
    
    activatePowerUp(type) {
        console.log('🎁 Power-up activated:', type);
        
        switch(type) {
            case 'multiball':
                this.createMultiballs();
                break;
            case 'fastbreak':
                this.fastBreak = true;
                setTimeout(() => this.fastBreak = false, 8000);
                break;
            case 'bigpaddle':
                this.paddle.width = Math.min(150, this.paddle.width * 1.5);
                setTimeout(() => this.paddle.width = this.difficulties[this.difficulty].paddleWidth, 10000);
                break;
            case 'slowball':
                this.ball.speed *= 0.7;
                setTimeout(() => this.ball.speed = this.difficulties[this.difficulty].ballSpeed + (this.level - 1) * 0.3, 8000);
                break;
            case 'fireball':
                // Destroy multiple bricks in a line
                this.destroyRandomBricks(5);
                break;
        }
    }
    
    createMultiballs() {
        // Add 2 extra balls
        for (let i = 0; i < 2; i++) {
            this.extraBalls.push({
                x: this.ball.x,
                y: this.ball.y,
                radius: this.ball.radius,
                dx: this.ball.speed * (Math.random() > 0.5 ? 1 : -1),
                dy: -this.ball.speed,
                speed: this.ball.speed
            });
        }
    }
    
    destroyRandomBricks(count) {
        const activeBricks = this.bricks.filter(b => b.status === 1);
        const toDestroy = Math.min(count, activeBricks.length);
        
        for (let i = 0; i < toDestroy; i++) {
            const randomIndex = Math.floor(Math.random() * activeBricks.length);
            const brick = activeBricks[randomIndex];
            brick.status = 0;
            this.score += brick.points * this.difficulties[this.difficulty].scoreMultiplier;
            this.bricksDestroyed++;
            activeBricks.splice(randomIndex, 1);
        }
        
        this.updateDisplay();
        if (this.bricks.every(b => b.status === 0)) {
            this.levelComplete();
        }
    }
    
    checkBrickCollisions() {
        for (let brick of this.bricks) {
            if (brick.status === 1) {
                if (this.ball.x > brick.x &&
                    this.ball.x < brick.x + brick.width &&
                    this.ball.y > brick.y &&
                    this.ball.y < brick.y + brick.height) {
                    
                    this.ball.dy = -this.ball.dy;
                    brick.status = 0; // Destroy brick
                    
                    // Handle power-up drop
                    if (brick.powerUp) {
                        this.dropPowerUp(brick.x + brick.width/2, brick.y + brick.height, brick.powerUp);
                    }
                    
                    this.score += brick.points * this.difficulties[this.difficulty].scoreMultiplier;
                    this.bricksDestroyed++;
                    this.updateDisplay();
                    this.playSound('brick');
                    
                    // Fast break mode destroys adjacent bricks
                    if (this.fastBreak) {
                        this.destroyAdjacentBricks(brick);
                    }
                    
                    // Check if all bricks destroyed
                    if (this.bricks.every(b => b.status === 0)) {
                        this.levelComplete();
                    }
                    
                    break;
                }
            }
        }
    }
    
    dropPowerUp(x, y, type) {
        this.powerUps.push({
            x: x - 15,
            y: y,
            width: 30,
            height: 15,
            type: type,
            dy: 2,
            active: true
        });
    }
    
    destroyAdjacentBricks(centerBrick) {
        for (let brick of this.bricks) {
            if (brick.status === 1 && brick !== centerBrick) {
                const distance = Math.sqrt(
                    Math.pow(brick.x - centerBrick.x, 2) + 
                    Math.pow(brick.y - centerBrick.y, 2)
                );
                if (distance < 100) { // Within range
                    brick.status = 0;
                    this.score += brick.points * this.difficulties[this.difficulty].scoreMultiplier * 0.5;
                    this.bricksDestroyed++;
                }
            }
        }
        this.updateDisplay();
    }
    
    loseLife() {
        this.lives--;
        this.playSound('loseLife');
        
        if (this.lives <= 0) {
            this.gameOver();
        } else {
            // Reset ball
            this.ball.x = this.canvasWidth / 2;
            this.ball.y = this.paddle.y - this.ball.radius;
            this.ball.dx = 0;
            this.ball.dy = 0;
            this.ball.launched = false;
        }
        
        this.updateDisplay();
    }
    
    levelComplete() {
        console.log('🎉 Level Complete!');
        this.gameState = 'levelcomplete';
        
        // Calculate bonus
        const levelScore = this.score;
        const bonusPoints = this.lives * 100 + (this.level * 50);
        this.score += bonusPoints;
        
        // Update level complete screen
        document.getElementById('level-score').textContent = levelScore;
        document.getElementById('bonus-points').textContent = bonusPoints;
        document.getElementById('total-score').textContent = this.score;
        
        this.updateDisplay();
        this.playSound('levelComplete');
        this.showScreen('level-complete-screen');
    }
    
    nextLevel() {
        this.level++;
        console.log(`🎮 Advancing to Level ${this.level}`);
        
        // Progressive difficulty increases
        this.ball.speed += 0.3; // Faster ball
        this.paddle.speed += 0.5; // Faster paddle to compensate
        
        // Every 3rd level, enable fast break mode for 10 seconds
        if (this.level % 3 === 0) {
            this.fastBreak = true;
            setTimeout(() => {
                this.fastBreak = false;
            }, 10000);
        }
        
        this.setupLevel();
        this.gameState = 'playing';
        this.showScreen('game-screen');
        this.gameLoop();
    }
    
    gameOver() {
        console.log('💥 Game Over');
        this.gameState = 'gameover';
        this.playSound('gameOver');
        
        // Update final stats
        document.getElementById('final-score').textContent = this.score;
        document.getElementById('levels-completed').textContent = this.level - 1;
        document.getElementById('bricks-destroyed').textContent = this.bricksDestroyed;
        
        this.showScreen('game-over-screen');
    }
    
    draw() {
        // Clear canvas with gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvasHeight);
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(1, '#16213e');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        
        // Draw bricks
        for (let brick of this.bricks) {
            if (brick.status === 1) {
                this.ctx.fillStyle = brick.color;
                this.ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
                
                // Add brick border
                this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
            }
        }
        
        // Draw paddle
        this.ctx.fillStyle = '#4ecdc4';
        this.ctx.fillRect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height);
        
        // Add paddle glow
        this.ctx.shadowColor = '#4ecdc4';
        this.ctx.shadowBlur = 10;
        this.ctx.fillRect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height);
        this.ctx.shadowBlur = 0;
        
        // Draw ball
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = '#ff6b6b';
        this.ctx.fill();
        this.ctx.shadowColor = '#ff6b6b';
        this.ctx.shadowBlur = 15;
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
        this.ctx.closePath();
    }
    
    updateDisplay() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('lives').textContent = this.lives;
        document.getElementById('level').textContent = this.level;
    }
    
    playSound(type) {
        // Use the comprehensive game audio system with haptic feedback
        if (window.gameAudio) {
            switch(type) {
                case 'paddle':
                    gameAudio.playSound('blip', 220); // Low frequency for paddle hit
                    gameAudio.hapticFeedback('light');
                    break;
                case 'wall':
                    gameAudio.playSound('blip', 330); // Medium frequency for wall bounce
                    gameAudio.hapticFeedback('light');
                    break;
                case 'brick':
                    gameAudio.playSound('success', 440); // Success sound for brick break
                    gameAudio.hapticFeedback('medium');
                    break;
                case 'launch':
                    gameAudio.playSound('levelUp'); // Launch ball sound
                    gameAudio.hapticFeedback('light');
                    break;
                case 'loseLife':
                    gameAudio.playSound('error'); // Error sound for losing life
                    gameAudio.hapticFeedback('error');
                    break;
                case 'levelComplete':
                    gameAudio.playSound('levelUp'); // Level complete celebration
                    gameAudio.hapticFeedback('success');
                    break;
                case 'gameOver':
                    gameAudio.playSound('error', 150, 1.0); // Game over sound
                    gameAudio.hapticFeedback('gameOver');
                    break;
            }
        } else {
            // Fallback to basic audio if game audio system not available
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
                case 'paddle':
                    oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
                    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                    break;
                case 'wall':
                    oscillator.frequency.setValueAtTime(330, audioContext.currentTime);
                    gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
                    break;
                case 'brick':
                    oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
                    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                    break;
                case 'launch':
                    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
                    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                    break;
                case 'loseLife':
                    oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.5);
                    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                    break;
                case 'levelComplete':
                    oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(659, audioContext.currentTime + 0.3);
                    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                    break;
                case 'gameOver':
                    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 1);
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
            this.showScreen('game-screen');
            this.gameLoop();
        }
    }
    
    restartGame() {
        console.log('🔄 Restarting Breakout');
        this.startGame(this.difficulty);
    }
    
    newGame() {
        console.log('🆕 Starting new Breakout game');
        this.gameState = 'menu';
        this.showScreen('start-screen');
    }
    
    playAgain() {
        this.restartGame();
    }
}

// Global functions for HTML onclick events
function startGame(difficulty) {
    console.log('🚀 Global startGame called with:', difficulty);
    if (window.breakoutGameInstance) {
        window.breakoutGameInstance.startGame(difficulty);
    }
}

function pauseGame() {
    if (window.breakoutGameInstance) {
        window.breakoutGameInstance.pauseGame();
    }
}

function resumeGame() {
    if (window.breakoutGameInstance) {
        window.breakoutGameInstance.resumeGame();
    }
}

function restartGame() {
    if (window.breakoutGameInstance) {
        window.breakoutGameInstance.restartGame();
    }
}

function newGame() {
    if (window.breakoutGameInstance) {
        window.breakoutGameInstance.newGame();
    }
}

function nextLevel() {
    if (window.breakoutGameInstance) {
        window.breakoutGameInstance.nextLevel();
    }
}

function playAgain() {
    if (window.breakoutGameInstance) {
        window.breakoutGameInstance.playAgain();
    }
}

// Initialize Breakout when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing Breakout');
    window.breakoutGameInstance = new BreakoutGame();
});

// Fallback initialization
if (document.readyState === 'loading') {
    console.log('Document still loading, waiting for DOMContentLoaded');
} else {
    console.log('Document already loaded, initializing Breakout immediately');
    window.breakoutGameInstance = new BreakoutGame();
}

console.log('🏓 Breakout Game script loaded successfully!');
