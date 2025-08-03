// Memory Match Game - Advanced JavaScript Implementation
class MemoryGame {
    constructor() {
        this.gameState = 'menu'; // menu, playing, paused, finished
        this.difficulty = null;
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.score = 0;
        this.timer = 0;
        this.timerInterval = null;
        this.gameStartTime = null;
        
        // Difficulty configurations
        this.difficulties = {
            easy: { rows: 3, cols: 4, pairs: 6, timeBonus: 10, scoreMultiplier: 1 },
            medium: { rows: 4, cols: 4, pairs: 8, timeBonus: 15, scoreMultiplier: 1.5 },
            hard: { rows: 4, cols: 6, pairs: 12, timeBonus: 20, scoreMultiplier: 2 }
        };
        
        // Card symbols - using emojis for visual appeal
        this.cardSymbols = [
            '🎮', '🕹️', '🎯', '🎲', '🎪', '🎨', '🎭', '🎪',
            '🌟', '⭐', '💎', '💫', '🔥', '⚡', '🌈', '🎊',
            '🎁', '🎈', '🎉', '🎀', '🏆', '🥇', '🎖️', '🏅'
        ];
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.showScreen('difficulty-screen');
        console.log('Memory game initialized');
    }

    bindEvents() {
        // Add keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            try {
                switch(e.key) {
                    case 'Escape':
                        if (this.gameState === 'playing') {
                            this.pauseGame();
                        } else if (this.gameState === 'paused') {
                            this.resumeGame();
                        }
                        break;
                    case 'r':
                    case 'R':
                        if (this.gameState === 'playing' || this.gameState === 'paused') {
                            this.restartGame();
                        }
                        break;
                    case 'n':
                    case 'N':
                        this.newGame();
                        break;
                }
            } catch (error) {
                console.error('Keyboard event error:', error);
            }
        });

        // Add click sound effect simulation
        document.addEventListener('click', (e) => {
            try {
                if (e.target.classList.contains('game-card') || 
                    e.target.classList.contains('start-btn') || 
                    e.target.classList.contains('action-btn')) {
                    this.playClickSound();
                }
            } catch (error) {
                console.error('Click sound error:', error);
            }
        });
    }

    playClickSound() {
        // Create audio feedback using Web Audio API
        if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
            const audioContext = new (AudioContext || webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        }
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }

    startGame(difficulty) {
        this.difficulty = difficulty;
        this.gameState = 'playing';
        this.resetGameState();
        this.createCards();
        this.shuffleCards();
        this.renderGameBoard();
        this.startTimer();
        this.showScreen('game-screen');
        
        // Add entrance animation
        setTimeout(() => {
            this.animateCardsEntrance();
        }, 100);
    }

    resetGameState() {
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.score = 0;
        this.timer = 0;
        this.gameStartTime = Date.now();
        this.updateDisplay();
    }

    createCards() {
        const config = this.difficulties[this.difficulty];
        const selectedSymbols = this.cardSymbols.slice(0, config.pairs);
        
        // Create pairs of cards
        const cardData = [];
        selectedSymbols.forEach((symbol, index) => {
            cardData.push({ id: index * 2, symbol, matched: false });
            cardData.push({ id: index * 2 + 1, symbol, matched: false });
        });
        
        this.cards = cardData;
    }

    shuffleCards() {
        // Fisher-Yates shuffle algorithm
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    renderGameBoard() {
        const gameBoard = document.getElementById('game-board');
        const config = this.difficulties[this.difficulty];
        
        // Set grid layout
        gameBoard.className = `difficulty-${this.difficulty}`;
        gameBoard.innerHTML = '';
        
        this.cards.forEach((card, index) => {
            const cardElement = this.createCardElement(card, index);
            gameBoard.appendChild(cardElement);
        });
    }

    createCardElement(card, index) {
        const cardElement = document.createElement('div');
        cardElement.classList.add('game-card');
        cardElement.dataset.cardId = card.id;
        cardElement.dataset.index = index;
        
        cardElement.innerHTML = `
            <div class="card-face card-back"></div>
            <div class="card-face card-front">${card.symbol}</div>
        `;
        
        cardElement.addEventListener('click', () => this.handleCardClick(index));
        
        return cardElement;
    }

    animateCardsEntrance() {
        const cards = document.querySelectorAll('.game-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.animation = 'fadeIn 0.5s ease-out';
                card.style.transform = 'scale(1)';
            }, index * 50);
        });
    }

    handleCardClick(index) {
        if (this.gameState !== 'playing') return;
        if (this.flippedCards.length >= 2) return;
        if (this.cards[index].matched) return;
        
        const cardElement = document.querySelector(`[data-index="${index}"]`);
        if (cardElement.classList.contains('flipped')) return;
        
        // Flip the card
        this.flipCard(cardElement, index);
        this.flippedCards.push({ element: cardElement, index: index });
        
        if (this.flippedCards.length === 2) {
            this.moves++;
            this.updateDisplay();
            setTimeout(() => this.checkMatch(), 800);
        }
    }

    flipCard(cardElement, index) {
        cardElement.classList.add('flipped');
        this.playFlipSound();
    }

    playFlipSound() {
        // Enhanced flip sound
        if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
            const audioContext = new (AudioContext || webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.15);
        }
    }

    checkMatch() {
        const [card1, card2] = this.flippedCards;
        const symbol1 = this.cards[card1.index].symbol;
        const symbol2 = this.cards[card2.index].symbol;
        
        if (symbol1 === symbol2) {
            // Match found!
            this.handleMatch(card1, card2);
        } else {
            // No match
            this.handleNoMatch(card1, card2);
        }
        
        this.flippedCards = [];
    }

    handleMatch(card1, card2) {
        // Mark cards as matched
        this.cards[card1.index].matched = true;
        this.cards[card2.index].matched = true;
        
        // Add match animation
        card1.element.classList.add('matched');
        card2.element.classList.add('matched');
        
        this.matchedPairs++;
        this.calculateScore(true);
        this.updateDisplay();
        this.playMatchSound();
        
        // Check if game is complete
        const config = this.difficulties[this.difficulty];
        if (this.matchedPairs === config.pairs) {
            setTimeout(() => this.gameComplete(), 1000);
        }
    }

    handleNoMatch(card1, card2) {
        // Flip cards back
        setTimeout(() => {
            card1.element.classList.remove('flipped');
            card2.element.classList.remove('flipped');
        }, 500);
        
        this.calculateScore(false);
        this.updateDisplay();
    }

    playMatchSound() {
        // Success sound
        if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
            const audioContext = new (AudioContext || webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(523, audioContext.currentTime); // C5
            oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1); // E5
            oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2); // G5
            
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.4);
        }
    }

    calculateScore(isMatch) {
        const config = this.difficulties[this.difficulty];
        const baseScore = 100;
        const timeBonus = Math.max(0, config.timeBonus - Math.floor(this.timer / 10));
        
        if (isMatch) {
            const matchScore = (baseScore + timeBonus) * config.scoreMultiplier;
            this.score += Math.round(matchScore);
        } else {
            // Small penalty for wrong moves
            this.score = Math.max(0, this.score - 10);
        }
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            if (this.gameState === 'playing') {
                this.timer++;
                this.updateDisplay();
            }
        }, 1000);
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
        }
    }

    restartGame() {
        this.stopTimer();
        this.startGame(this.difficulty);
    }

    newGame() {
        this.stopTimer();
        this.gameState = 'menu';
        this.showScreen('difficulty-screen');
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    gameComplete() {
        this.gameState = 'finished';
        this.stopTimer();
        this.calculateFinalStats();
        this.showGameOverScreen();
    }

    calculateFinalStats() {
        const accuracy = this.moves > 0 ? Math.round((this.matchedPairs * 2 / this.moves) * 100) : 100;
        const timeInSeconds = this.timer;
        
        // Performance message based on stats
        let performanceMessage = '';
        if (accuracy >= 90 && timeInSeconds <= 60) {
            performanceMessage = '🏆 Perfect! You have an amazing memory!';
        } else if (accuracy >= 75 && timeInSeconds <= 120) {
            performanceMessage = '⭐ Great job! Excellent memory skills!';
        } else if (accuracy >= 60) {
            performanceMessage = '👍 Good work! Keep practicing!';
        } else {
            performanceMessage = '💪 Nice try! Practice makes perfect!';
        }
        
        document.getElementById('performance-message').textContent = performanceMessage;
    }

    showGameOverScreen() {
        document.getElementById('final-score').textContent = this.score;
        document.getElementById('final-moves').textContent = this.moves;
        document.getElementById('final-time').textContent = this.formatTime(this.timer);
        
        const accuracy = this.moves > 0 ? Math.round((this.matchedPairs * 2 / this.moves) * 100) : 100;
        document.getElementById('accuracy').textContent = accuracy + '%';
        
        this.showScreen('game-over-screen');
        
        // Add celebration animation
        this.celebrateCompletion();
    }

    celebrateCompletion() {
        // Create confetti effect
        const colors = ['#667eea', '#764ba2', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24'];
        
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                this.createConfetti(colors[Math.floor(Math.random() * colors.length)]);
            }, i * 50);
        }
    }

    createConfetti(color) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${color};
            left: ${Math.random() * 100}vw;
            top: -10px;
            z-index: 10000;
            pointer-events: none;
            animation: confettiFall 3s linear forwards;
        `;
        
        // Add confetti animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes confettiFall {
                to {
                    transform: translateY(100vh) rotate(720deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            document.body.removeChild(confetti);
        }, 3000);
    }

    playAgain() {
        this.startGame(this.difficulty);
    }

    updateDisplay() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('moves').textContent = this.moves;
        document.getElementById('timer').textContent = this.formatTime(this.timer);
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
}

// Global functions for HTML onclick events
function startGame(difficulty) {
    memoryGame.startGame(difficulty);
}

function pauseGame() {
    memoryGame.pauseGame();
}

function resumeGame() {
    memoryGame.resumeGame();
}

function restartGame() {
    memoryGame.restartGame();
}

function newGame() {
    memoryGame.newGame();
}

function playAgain() {
    memoryGame.playAgain();
}

// Initialize the game when DOM is loaded
const memoryGame = new MemoryGame();

// Add performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`🧠 Memory game loaded in ${loadTime}ms`);
    });
}
