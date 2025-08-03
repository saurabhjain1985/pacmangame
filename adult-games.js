// Main Adult Games JavaScript
let currentGame = '';

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
            case 'puzzle':
                initPuzzleBuilder();
                break;
        }
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    showMenu();
});
