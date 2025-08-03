// iOS Games Collection - Main Menu JavaScript
class GameMenu {
    constructor() {
        this.init();
    }

    init() {
        this.addEventListeners();
        this.addHoverEffects();
        this.preloadGameAssets();
    }

    addEventListeners() {
        // Add click events to game cards
        document.querySelectorAll('.game-card:not(.coming-soon)').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.classList.contains('play-btn')) {
                    const gameType = card.dataset.game;
                    this.playGame(gameType);
                }
            });
        });

        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                const focusedCard = document.activeElement.closest('.game-card');
                if (focusedCard && !focusedCard.classList.contains('coming-soon')) {
                    const gameType = focusedCard.dataset.game;
                    this.playGame(gameType);
                }
            }
        });
    }

    addHoverEffects() {
        // Add subtle parallax effect to game cards
        document.querySelectorAll('.game-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    preloadGameAssets() {
        // Preload game files for faster navigation
        const gameFiles = [
            'pacman.html',
            'pacman.css',
            'pacman.js',
            'memory.html',
            'memory.css',
            'memory.js',
            'snake.html',
            'snake.css',
            'snake.js'
        ];

        gameFiles.forEach(file => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = file;
            document.head.appendChild(link);
        });
    }

    playGame(gameType) {
        // Add loading animation
        this.showLoadingAnimation(gameType);

        // Navigate to the selected game (faster navigation)
        setTimeout(() => {
            switch (gameType) {
                case 'pacman':
                    window.location.href = 'pacman.html';
                    break;
                case 'memory':
                    window.location.href = 'memory.html';
                    break;
                case 'snake':
                    window.location.href = 'snake.html';
                    break;
                case 'tetris':
                    window.location.href = 'tetris.html';
                    break;
                case 'breakout':
                    window.location.href = 'breakout.html';
                    break;
                case 'puzzle':
                    window.location.href = 'puzzle.html';
                    break;
                case 'adult-games':
                    window.location.href = 'adult-games.html';
                    break;
                case 'math-tables':
                    window.location.href = 'math-tables-simple.html';
                    break;
                case 'bedtime-stories':
                    window.location.href = 'bedtime-stories.html';
                    break;
                default:
                    console.log(`Game ${gameType} not implemented yet`);
                    alert('This game is coming soon!');
            }
        }, 200); // Reduced from 800ms to 200ms for much faster navigation
    }

    showLoadingAnimation(gameType) {
        const card = document.querySelector(`[data-game="${gameType}"]`);
        const playBtn = card.querySelector('.play-btn');
        
        // Store original text
        const originalText = playBtn.textContent;
        
        // Add loading state
        playBtn.innerHTML = '🎮 Loading...';
        playBtn.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
        card.style.transform = 'scale(0.95)';
        
        // Add pulse animation
        const pulseAnimation = setInterval(() => {
            card.style.opacity = card.style.opacity === '0.7' ? '1' : '0.7';
        }, 200);
        
        // Clean up after navigation
        setTimeout(() => {
            clearInterval(pulseAnimation);
            playBtn.textContent = originalText;
            card.style.opacity = '1';
            card.style.transform = '';
        }, 800);
    }
}

// Global function for onclick events
function playGame(gameType) {
    gameMenu.playGame(gameType);
}

// Initialize the game menu when DOM is loaded
const gameMenu = new GameMenu();

// Add some fun easter eggs
document.addEventListener('keydown', (e) => {
    // Konami Code: ↑↑↓↓←→←→BA
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    if (!window.konamiSequence) window.konamiSequence = [];
    
    window.konamiSequence.push(e.code);
    if (window.konamiSequence.length > konamiCode.length) {
        window.konamiSequence = window.konamiSequence.slice(-konamiCode.length);
    }
    
    if (window.konamiSequence.join(',') === konamiCode.join(',')) {
        // Easter egg: Add rainbow effect
        document.body.style.background = 'linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3)';
        document.body.style.backgroundSize = '400% 400%';
        document.body.style.animation = 'rainbow 2s ease infinite';
        
        // Add CSS animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rainbow {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
        `;
        document.head.appendChild(style);
        
        setTimeout(() => {
            location.reload();
        }, 5000);
        
        window.konamiSequence = [];
    }
});

// Add performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`🚀 Games menu loaded in ${loadTime}ms`);
    });
}
