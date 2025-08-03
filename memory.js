// Memory Match Game - Working Version
console.log('🧠 Loading Memory Game...');

class MemoryGame {
    constructor() {
        console.log('Creating MemoryGame instance');
        this.gameState = 'menu';
        this.difficulty = null;
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.score = 0;
        this.timer = 0;
        this.timerInterval = null;
        
        this.difficulties = {
            easy: { rows: 3, cols: 4, pairs: 6 },
            medium: { rows: 4, cols: 4, pairs: 8 },
            hard: { rows: 4, cols: 6, pairs: 12 }
        };
        
        this.symbols = [
            '🎮', '🕹️', '🎯', '🎲', '🎪', '🎨', '🎭', '🎺',
            '🌟', '⭐', '💎', '💫', '🔥', '⚡', '🌈', '🎊',
            '🎁', '🎈', '🎉', '🎀', '🏆', '🥇', '🎖️', '🏅'
        ];
        
        this.init();
    }
    
    init() {
        console.log('Initializing memory game');
        this.showScreen('difficulty-screen');
    }
    
    showScreen(screenId) {
        console.log('Showing screen:', screenId);
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
            console.log('Screen activated:', screenId);
        } else {
            console.error('Screen not found:', screenId);
        }
    }
    
    startGame(difficulty) {
        console.log('🎮 Starting game with difficulty:', difficulty);
        this.difficulty = difficulty;
        this.gameState = 'playing';
        this.resetGame();
        this.createCards();
        this.shuffleCards();
        this.renderBoard();
        this.startTimer();
        this.showScreen('game-screen');
    }
    
    resetGame() {
        console.log('Resetting game state');
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.score = 0;
        this.timer = 0;
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        this.updateDisplay();
    }
    
    createCards() {
        const config = this.difficulties[this.difficulty];
        const numPairs = config.pairs;
        const selectedSymbols = this.symbols.slice(0, numPairs);
        
        console.log('Creating', numPairs, 'pairs of cards with symbols:', selectedSymbols);
        
        this.cards = [];
        selectedSymbols.forEach((symbol, index) => {
            this.cards.push({
                id: `card-${index}-1`,
                symbol: symbol,
                matched: false,
                flipped: false
            });
            this.cards.push({
                id: `card-${index}-2`, 
                symbol: symbol,
                matched: false,
                flipped: false
            });
        });
        
        console.log('Created cards array with length:', this.cards.length);
    }
    
    shuffleCards() {
        console.log('Shuffling cards');
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }
    
    renderBoard() {
        console.log('Rendering game board');
        const gameBoard = document.getElementById('game-board');
        if (!gameBoard) {
            console.error('Game board element not found!');
            return;
        }
        
        gameBoard.innerHTML = '';
        gameBoard.className = `difficulty-${this.difficulty}`;
        
        this.cards.forEach((card, index) => {
            const cardElement = this.createCardElement(card, index);
            gameBoard.appendChild(cardElement);
        });
        
        console.log('Board rendered with', gameBoard.children.length, 'cards');
    }
    
    createCardElement(card, index) {
        const cardElement = document.createElement('div');
        cardElement.className = 'game-card';
        cardElement.dataset.cardId = card.id;
        cardElement.dataset.index = index;
        
        const cardBack = document.createElement('div');
        cardBack.className = 'card-face card-back';
        
        const cardFront = document.createElement('div');
        cardFront.className = 'card-face card-front';
        cardFront.textContent = card.symbol;
        cardFront.style.fontSize = '2rem';
        cardFront.style.lineHeight = '1';
        
        cardElement.appendChild(cardBack);
        cardElement.appendChild(cardFront);
        
        const clickHandler = (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('🖱️ Card clicked! Index:', index, 'Symbol:', card.symbol);
            this.handleCardClick(index);
        };
        
        cardElement.addEventListener('click', clickHandler);
        cardElement.addEventListener('touchend', clickHandler);
        
        cardElement.style.cursor = 'pointer';
        cardElement.style.userSelect = 'none';
        
        console.log('✅ Created card element', index, 'with symbol', card.symbol);
        
        return cardElement;
    }
    
    handleCardClick(index) {
        console.log('🎯 Handling card click for index:', index);
        
        if (this.gameState !== 'playing') {
            console.log('❌ Game not in playing state:', this.gameState);
            return;
        }
        
        if (this.flippedCards.length >= 2) {
            console.log('❌ Already have 2 flipped cards');
            return;
        }
        
        const card = this.cards[index];
        if (!card) {
            console.error('❌ Card not found at index:', index);
            return;
        }
        
        if (card.matched || card.flipped) {
            console.log('❌ Card already matched or flipped');
            return;
        }
        
        const cardElement = document.querySelector(`[data-index="${index}"]`);
        if (!cardElement) {
            console.error('❌ Card element not found');
            return;
        }
        
        if (cardElement.classList.contains('flipped')) {
            console.log('❌ Card already visually flipped');
            return;
        }
        
        console.log('✅ FLIPPING CARD:', index, card.symbol);
        this.flipCard(cardElement, index);
        
        card.flipped = true;
        this.flippedCards.push({ element: cardElement, index: index, card: card });
        
        console.log('📊 Total flipped cards:', this.flippedCards.length);
        
        if (this.flippedCards.length === 2) {
            this.moves++;
            this.updateDisplay();
            setTimeout(() => this.checkMatch(), 1000);
        }
    }
    
    flipCard(cardElement, index) {
        console.log('🔄 Visually flipping card:', index);
        cardElement.classList.add('flipped');
        cardElement.offsetHeight;
        this.playSound('flip');
    }
    
    checkMatch() {
        console.log('🔍 Checking for match...');
        
        if (this.flippedCards.length !== 2) {
            console.error('❌ Expected 2 flipped cards, got:', this.flippedCards.length);
            return;
        }
        
        const [first, second] = this.flippedCards;
        const isMatch = first.card.symbol === second.card.symbol;
        
        console.log('Match check:', first.card.symbol, 'vs', second.card.symbol, '=', isMatch);
        
        if (isMatch) {
            console.log('✅ MATCH FOUND!');
            first.card.matched = true;
            second.card.matched = true;
            first.element.classList.add('matched');
            second.element.classList.add('matched');
            
            this.matchedPairs++;
            this.score += 100;
            this.playSound('match');
            
            if (this.matchedPairs === this.difficulties[this.difficulty].pairs) {
                setTimeout(() => this.gameComplete(), 500);
            }
        } else {
            console.log('❌ No match - flipping back');
            first.element.classList.remove('flipped');
            second.element.classList.remove('flipped');
            first.card.flipped = false;
            second.card.flipped = false;
            this.playSound('noMatch');
        }
        
        this.flippedCards = [];
        this.updateDisplay();
    }
    
    gameComplete() {
        console.log('🎉 GAME COMPLETE!');
        this.gameState = 'finished';
        this.stopTimer();
        this.playSound('victory');
        
        const timeBonus = Math.max(0, 300 - this.timer);
        const movesPenalty = Math.max(0, this.moves - this.difficulties[this.difficulty].pairs) * 5;
        this.score = this.score + timeBonus - movesPenalty;
        
        this.updateDisplay();
        this.showScreen('victory-screen');
        
        const finalScore = document.getElementById('final-score');
        const finalTime = document.getElementById('final-time');
        const finalMoves = document.getElementById('final-moves');
        
        if (finalScore) finalScore.textContent = this.score;
        if (finalTime) finalTime.textContent = this.formatTime(this.timer);
        if (finalMoves) finalMoves.textContent = this.moves;
    }
    
    startTimer() {
        console.log('⏰ Starting timer');
        this.timerInterval = setInterval(() => {
            this.timer++;
            this.updateDisplay();
        }, 1000);
    }
    
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
    
    updateDisplay() {
        const scoreElement = document.getElementById('score');
        const movesElement = document.getElementById('moves');
        const timerElement = document.getElementById('timer');
        
        if (scoreElement) scoreElement.textContent = this.score;
        if (movesElement) movesElement.textContent = this.moves;
        if (timerElement) timerElement.textContent = this.formatTime(this.timer);
    }
    
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    playSound(type) {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            switch(type) {
                case 'flip':
                    oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
                    break;
                case 'match':
                    oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
                    break;
                case 'noMatch':
                    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
                    break;
                case 'victory':
                    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                    break;
            }
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
        } catch (error) {
            // Silent fail for audio
        }
    }
    
    pauseGame() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            this.stopTimer();
            this.showScreen('pause-screen');
        }
    }
    
    resumeGame() {
        if (this.gameState === 'paused') {
            this.gameState = 'playing';
            this.startTimer();
            this.showScreen('game-screen');
        }
    }
    
    restartGame() {
        console.log('🔄 Restarting game');
        this.startGame(this.difficulty);
    }
    
    newGame() {
        console.log('🆕 Starting new game');
        this.gameState = 'menu';
        this.stopTimer();
        this.showScreen('difficulty-screen');
    }
    
    playAgain() {
        this.restartGame();
    }
}

// Global functions for HTML onclick events
function startGame(difficulty) {
    console.log('🚀 Global startGame called with:', difficulty);
    
    if (window.memoryGameInstance && typeof window.memoryGameInstance.startGame === 'function') {
        window.memoryGameInstance.startGame(difficulty);
    } else {
        console.error('❌ Memory game not properly initialized');
        // Try to initialize and then start
        if (initializeMemoryGame()) {
            setTimeout(() => {
                if (window.memoryGameInstance) {
                    window.memoryGameInstance.startGame(difficulty);
                } else {
                    alert('Game failed to load. Please refresh the page.');
                }
            }, 100);
        }
    }
}

function pauseGame() {
    if (window.memoryGameInstance) {
        window.memoryGameInstance.pauseGame();
    }
}

function resumeGame() {
    if (window.memoryGameInstance) {
        window.memoryGameInstance.resumeGame();
    }
}

function restartGame() {
    if (window.memoryGameInstance) {
        window.memoryGameInstance.restartGame();
    }
}

function newGame() {
    if (window.memoryGameInstance) {
        window.memoryGameInstance.newGame();
    }
}

function playAgain() {
    if (window.memoryGameInstance) {
        window.memoryGameInstance.playAgain();
    }
}

function debugShowAll() {
    console.log('🐛 DEBUG: Showing all cards');
    document.querySelectorAll('.game-card').forEach(card => {
        card.classList.add('flipped');
    });
}

// Initialization function
function initializeMemoryGame() {
    console.log('🎮 Initializing Memory Game...');
    try {
        window.memoryGameInstance = new MemoryGame();
        console.log('✅ Memory Game initialized successfully!');
        return true;
    } catch (error) {
        console.error('❌ Failed to initialize Memory Game:', error);
        return false;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing memory game');
    initializeMemoryGame();
});

// Fallback initialization
if (document.readyState === 'loading') {
    console.log('Document still loading, waiting for DOMContentLoaded');
} else {
    console.log('Document already loaded, initializing immediately');
    initializeMemoryGame();
}

// Additional fallback with delay
setTimeout(() => {
    if (!window.memoryGameInstance) {
        console.log('🔄 Backup initialization after delay...');
        initializeMemoryGame();
    }
}, 500);

console.log('🧠 Memory Game script loaded successfully!');
