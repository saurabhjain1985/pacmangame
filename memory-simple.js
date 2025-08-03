// Simplified Memory Game for Testing
console.log('Loading simplified memory game...');

class SimpleMemoryGame {
    constructor() {
        console.log('SimpleMemoryGame constructor called');
        this.cards = [];
        this.flippedCards = [];
        this.gameState = 'menu';
        this.init();
    }

    init() {
        console.log('Initializing simple memory game');
        this.showDifficultyScreen();
    }

    showDifficultyScreen() {
        console.log('Showing difficulty screen');
        const difficultyScreen = document.getElementById('difficulty-screen');
        const gameScreen = document.getElementById('game-screen');
        
        if (difficultyScreen) {
            difficultyScreen.classList.add('active');
            console.log('Difficulty screen activated');
        }
        if (gameScreen) {
            gameScreen.classList.remove('active');
        }
    }

    startGame(difficulty) {
        console.log('Starting game with difficulty:', difficulty);
        this.difficulty = difficulty;
        this.gameState = 'playing';
        this.createCards();
        this.renderBoard();
        this.showGameScreen();
    }

    createCards() {
        const symbols = ['🎮', '🎯', '🎪', '🎨'];
        this.cards = [];
        
        // Create pairs
        symbols.forEach((symbol, index) => {
            this.cards.push({ id: index * 2, symbol, matched: false });
            this.cards.push({ id: index * 2 + 1, symbol, matched: false });
        });
        
        // Shuffle cards
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
        
        console.log('Created cards:', this.cards);
    }

    renderBoard() {
        console.log('Rendering game board');
        const gameBoard = document.getElementById('game-board');
        if (!gameBoard) {
            console.error('Game board element not found!');
            return;
        }

        gameBoard.innerHTML = '';
        gameBoard.className = 'difficulty-medium';

        this.cards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'game-card';
            cardElement.dataset.cardId = card.id;
            cardElement.dataset.index = index;

            // Create card faces
            const cardBack = document.createElement('div');
            cardBack.className = 'card-face card-back';

            const cardFront = document.createElement('div');
            cardFront.className = 'card-face card-front';
            cardFront.textContent = card.symbol;
            cardFront.style.fontSize = '2rem';

            cardElement.appendChild(cardBack);
            cardElement.appendChild(cardFront);

            // Add click handler
            cardElement.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Card clicked! Index:', index, 'Symbol:', card.symbol);
                this.handleCardClick(index);
            });

            gameBoard.appendChild(cardElement);
            console.log('Added card to board:', index, card.symbol);
        });

        console.log('Board rendered with', gameBoard.children.length, 'cards');
    }

    handleCardClick(index) {
        console.log('Handling card click for index:', index);
        
        if (this.gameState !== 'playing') {
            console.log('Game not playing, ignoring click');
            return;
        }

        const card = this.cards[index];
        if (!card) {
            console.error('Card not found at index:', index);
            return;
        }

        if (card.matched) {
            console.log('Card already matched');
            return;
        }

        const cardElement = document.querySelector(`[data-index="${index}"]`);
        if (!cardElement) {
            console.error('Card element not found for index:', index);
            return;
        }

        if (cardElement.classList.contains('flipped')) {
            console.log('Card already flipped');
            return;
        }

        // Flip the card
        console.log('Flipping card:', index, card.symbol);
        cardElement.classList.add('flipped');
        
        this.flippedCards.push({ element: cardElement, index: index });
        console.log('Total flipped cards:', this.flippedCards.length);

        if (this.flippedCards.length === 2) {
            setTimeout(() => this.checkMatch(), 1000);
        }
    }

    checkMatch() {
        console.log('Checking match...');
        const [first, second] = this.flippedCards;
        const firstCard = this.cards[first.index];
        const secondCard = this.cards[second.index];

        if (firstCard.symbol === secondCard.symbol) {
            console.log('Match found!');
            firstCard.matched = true;
            secondCard.matched = true;
            first.element.classList.add('matched');
            second.element.classList.add('matched');
        } else {
            console.log('No match, flipping back');
            first.element.classList.remove('flipped');
            second.element.classList.remove('flipped');
        }

        this.flippedCards = [];
    }

    showGameScreen() {
        console.log('Showing game screen');
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        const gameScreen = document.getElementById('game-screen');
        if (gameScreen) {
            gameScreen.classList.add('active');
            console.log('Game screen activated');
        }
    }
}

// Global functions for buttons
function startGame(difficulty) {
    console.log('Global startGame called with:', difficulty);
    if (window.simpleMemoryGame) {
        window.simpleMemoryGame.startGame(difficulty);
    } else {
        console.error('simpleMemoryGame not found!');
    }
}

function goBack() {
    console.log('Going back to main menu');
    window.location.href = 'index.html';
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, creating simple memory game');
    window.simpleMemoryGame = new SimpleMemoryGame();
});

console.log('Simple memory game script loaded');
