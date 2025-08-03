// Main Adult Games JavaScript
let currentGame = '';

function goBackToMainGames() {
    // Navigate back to the main games menu (index.html)
    window.location.href = 'index.html';
}

function showMenu() {
    // Hide all games
    document.querySelectorAll('.game-container').forEach(container => {
        container.classList.add('hidden');
    });
    
    // Show menu
    document.querySelector('.game-menu').style.display = 'grid';
    currentGame = '';
}

function showGame(gameType) {
    // Handle puzzle builder differently - redirect to dedicated puzzle page
    if (gameType === 'puzzle') {
        window.location.href = 'puzzle.html';
        return;
    }
    
    // Hide menu
    document.querySelector('.game-menu').style.display = 'none';
    
    // Hide all games
    document.querySelectorAll('.game-container').forEach(container => {
        container.classList.add('hidden');
    });
    
    // Show selected game
    const gameContainer = document.getElementById(`${gameType}-game`);
    if (gameContainer) {
        gameContainer.classList.remove('hidden');
        currentGame = gameType;
        
        // Initialize game-specific functionality
        switch(gameType) {
            case 'sudoku':
                initSudoku();
                break;
            case 'reaction':
                initReactionTrainer();
                break;
            case 'memory':
                initMemoryBlitz();
                break;
            case 'money':
                initMoneyAcademy();
                break;
                break;
        }
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    showMenu();
});
