// 🧩 Fixed Puzzle Builder - Working Version
let selectedImage = null;
let puzzlePieces = [];
let puzzleOrder = [];
let correctOrder = [];
let puzzleTimer = 0;
let puzzleInterval = null;
let moveCount = 0;
let gameActive = false;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🧩 Puzzle Builder Loading...');
    initPuzzleBuilder();
});

function initPuzzleBuilder() {
    console.log('Initializing Puzzle Builder...');
    setupImageSelection();
    setupButtons();
    resetPuzzleTimer();
    
    // Initialize image upload handler
    const fileInput = document.getElementById('image-upload');
    if (fileInput) {
        fileInput.addEventListener('change', function() {
            loadCustomImage(this);
        });
    }
    
    console.log('✅ Puzzle Builder Initialized!');
}

function setupImageSelection() {
    console.log('Setting up image selection...');
    const presetImages = document.querySelectorAll('.preset-img');
    console.log('Found preset images:', presetImages.length);
    
    presetImages.forEach((img, index) => {
        console.log(`Setting up image ${index}:`, img.src);
        img.addEventListener('click', () => {
            console.log('Preset image clicked:', img.src);
            selectPresetImage(img);
        });
    });
}

function setupButtons() {
    // Create Puzzle Button
    const createBtn = document.querySelector('.create-puzzle-btn');
    if (createBtn) {
        createBtn.addEventListener('click', createPuzzle);
        createBtn.disabled = true;
    }
    
    // Control Buttons
    const shuffleBtn = document.querySelector('.shuffle-btn');
    if (shuffleBtn) {
        shuffleBtn.addEventListener('click', shufflePuzzle);
    }
    
    const hintBtn = document.querySelector('.hint-btn');
    if (hintBtn) {
        hintBtn.addEventListener('click', showHint);
    }
    
    const newImageBtn = document.querySelector('.new-image-btn');
    if (newImageBtn) {
        newImageBtn.addEventListener('click', selectNewImage);
    }
    
    const backBtn = document.querySelector('.back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', goBack);
    }
}

function selectPresetImage(imgElement) {
    console.log('Selecting preset image:', imgElement.src);
    
    // Remove previous selection
    document.querySelectorAll('.preset-img').forEach(img => {
        img.classList.remove('selected');
    });
    
    // Select new image
    imgElement.classList.add('selected');
    selectedImage = imgElement.src;
    console.log('Selected image set to:', selectedImage);
    
    // Enable create button
    const createBtn = document.querySelector('.create-puzzle-btn');
    if (createBtn) {
        createBtn.disabled = false;
        createBtn.textContent = '✨ Create Puzzle';
        createBtn.style.background = 'linear-gradient(135deg, #4A90E2, #357ABD)';
        console.log('Create button enabled');
    }
}

function loadCustomImage(input) {
    const file = input.files[0];
    if (!file) return;
    
    // Check if it's an image
    if (!file.type.startsWith('image/')) {
        showMessage('Please select an image file!', 'error');
        return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showMessage('Image is too large! Please choose an image smaller than 5MB.', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        // Remove preset selection
        document.querySelectorAll('.preset-img').forEach(img => {
            img.classList.remove('selected');
        });
        
        selectedImage = e.target.result;
        
        // Enable create button
        const createBtn = document.querySelector('.create-puzzle-btn');
        if (createBtn) {
            createBtn.disabled = false;
            createBtn.textContent = '✨ Create Custom Puzzle';
        }
        
        showMessage('Custom image loaded! Click "Create Puzzle" to start.', 'success');
    };
    
    reader.readAsDataURL(file);
}

function createPuzzle() {
    console.log('Creating puzzle with image:', selectedImage);
    
    if (!selectedImage) {
        showMessage('Please select an image first!', 'error');
        return;
    }
    
    // Hide selection screen and show game
    const selectionScreen = document.querySelector('.image-selection');
    const gameScreen = document.querySelector('.puzzle-game');
    
    if (selectionScreen) selectionScreen.style.display = 'none';
    if (gameScreen) gameScreen.style.display = 'block';
    
    // Reset game state
    resetGameState();
    
    // Show preview
    const preview = document.getElementById('puzzle-preview');
    if (preview) {
        preview.innerHTML = `<img src="${selectedImage}" alt="Puzzle Preview" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">`;
    }
    
    // Create puzzle pieces
    createPuzzlePieces();
    
    // Start game
    gameActive = true;
    startPuzzleTimer();
    
    // Auto-shuffle after a moment
    setTimeout(() => {
        shufflePuzzle();
        showMessage('Puzzle created! Arrange the pieces to match the preview.', 'info');
    }, 500);
}

function resetGameState() {
    puzzlePieces = [];
    puzzleOrder = [];
    correctOrder = [1, 2, 3, 4, 5, 6, 7, 8, 0]; // 0 represents empty space at position 8
    moveCount = 0;
    gameActive = false;
    
    // Update move counter
    const moveCounter = document.getElementById('puzzle-moves');
    if (moveCounter) moveCounter.textContent = '0';
    
    resetPuzzleTimer();
}

function createPuzzlePieces() {
    const board = document.getElementById('puzzle-board');
    if (!board) {
        console.error('Puzzle board not found!');
        return;
    }
    
    board.innerHTML = '';
    board.className = 'puzzle-grid';
    
    // Create 3x3 grid (9 pieces total, 8 image pieces + 1 empty)
    for (let i = 0; i < 9; i++) {
        const piece = document.createElement('div');
        piece.className = 'puzzle-piece';
        piece.dataset.position = i;
        
        if (i === 8) {
            // Empty piece (bottom right)
            piece.classList.add('empty');
            piece.dataset.correctPosition = 8;
        } else {
            // Image piece
            piece.dataset.correctPosition = i;
            piece.style.backgroundImage = `url(${selectedImage})`;
            piece.style.backgroundSize = '300% 300%';
            
            // Calculate background position for 3x3 grid
            const row = Math.floor(i / 3);
            const col = i % 3;
            piece.style.backgroundPosition = `${-col * 100}% ${-row * 100}%`;
            
            // Add number for easier solving
            piece.innerHTML = `<span class="piece-number">${i + 1}</span>`;
            
            // Add click handler
            piece.addEventListener('click', () => {
                if (gameActive) movePiece(piece);
            });
        }
        
        board.appendChild(piece);
        puzzlePieces.push(piece);
    }
    
    console.log('✅ Puzzle pieces created:', puzzlePieces.length);
}

function shufflePuzzle() {
    if (!gameActive && puzzlePieces.length === 0) {
        showMessage('Create a puzzle first!', 'warning');
        return;
    }
    
    console.log('Shuffling puzzle...');
    
    // Reset move count
    moveCount = 0;
    updateMoveCounter();
    
    // Perform random valid moves to shuffle
    const shuffleMoves = 100;
    for (let i = 0; i < shuffleMoves; i++) {
        const movablePieces = getMovablePieces();
        if (movablePieces.length > 0) {
            const randomPiece = movablePieces[Math.floor(Math.random() * movablePieces.length)];
            movePiece(randomPiece, true); // Silent move for shuffling
        }
    }
    
    // Reset move counter after shuffling
    moveCount = 0;
    updateMoveCounter();
    
    gameActive = true;
    showMessage('Puzzle shuffled! Start solving!', 'success');
}

function getMovablePieces() {
    const emptyPos = findEmptyPosition();
    const movable = [];
    
    puzzlePieces.forEach((piece, index) => {
        if (!piece.classList.contains('empty') && canMovePiece(index, emptyPos)) {
            movable.push(piece);
        }
    });
    
    return movable;
}

function findEmptyPosition() {
    return puzzlePieces.findIndex(piece => piece.classList.contains('empty'));
}

function canMovePiece(piecePos, emptyPos) {
    const pieceRow = Math.floor(piecePos / 3);
    const pieceCol = piecePos % 3;
    const emptyRow = Math.floor(emptyPos / 3);
    const emptyCol = emptyPos % 3;
    
    // Check if adjacent (horizontally or vertically)
    return (Math.abs(pieceRow - emptyRow) === 1 && pieceCol === emptyCol) ||
           (Math.abs(pieceCol - emptyCol) === 1 && pieceRow === emptyRow);
}

function movePiece(piece, silent = false) {
    if (!piece || piece.classList.contains('empty')) return;
    
    const piecePos = Array.from(puzzlePieces).indexOf(piece);
    const emptyPos = findEmptyPosition();
    
    if (canMovePiece(piecePos, emptyPos)) {
        const emptyPiece = puzzlePieces[emptyPos];
        
        // Swap elements in DOM
        const board = document.getElementById('puzzle-board');
        const pieces = Array.from(board.children);
        
        // Swap in array
        [puzzlePieces[piecePos], puzzlePieces[emptyPos]] = [puzzlePieces[emptyPos], puzzlePieces[piecePos]];
        
        // Update positions in DOM
        board.innerHTML = '';
        puzzlePieces.forEach(p => board.appendChild(p));
        
        if (!silent) {
            moveCount++;
            updateMoveCounter();
            
            // Check if solved
            if (checkPuzzleSolved()) {
                setTimeout(() => {
                    endPuzzleGame(true);
                }, 300);
            }
        }
    }
}

function checkPuzzleSolved() {
    if (!gameActive) return false;
    
    // Check if all pieces are in correct positions
    for (let i = 0; i < puzzlePieces.length; i++) {
        const piece = puzzlePieces[i];
        const correctPos = parseInt(piece.dataset.correctPosition);
        
        if (i !== correctPos) {
            return false;
        }
    }
    
    return true;
}

function updateMoveCounter() {
    const moveCounter = document.getElementById('puzzle-moves');
    if (moveCounter) {
        moveCounter.textContent = moveCount.toString();
    }
}

function startPuzzleTimer() {
    resetPuzzleTimer();
    
    puzzleInterval = setInterval(() => {
        puzzleTimer++;
        updateTimerDisplay();
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(puzzleTimer / 60);
    const seconds = puzzleTimer % 60;
    const timerDisplay = document.getElementById('puzzle-timer');
    
    if (timerDisplay) {
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

function resetPuzzleTimer() {
    puzzleTimer = 0;
    updateTimerDisplay();
    
    if (puzzleInterval) {
        clearInterval(puzzleInterval);
        puzzleInterval = null;
    }
}

function endPuzzleGame(won) {
    gameActive = false;
    
    if (puzzleInterval) {
        clearInterval(puzzleInterval);
        puzzleInterval = null;
    }
    
    if (won) {
        // Add winning animation
        puzzlePieces.forEach(piece => {
            if (!piece.classList.contains('empty')) {
                piece.style.animation = 'celebration 0.6s ease-in-out';
            }
        });
        
        setTimeout(() => {
            const timeStr = document.getElementById('puzzle-timer').textContent;
            showMessage(`🎉 Puzzle Complete! Time: ${timeStr}, Moves: ${moveCount}`, 'success');
        }, 100);
    }
}

function showHint() {
    if (!gameActive) {
        showMessage('Start a puzzle first!', 'warning');
        return;
    }
    
    // Highlight movable pieces
    const movablePieces = getMovablePieces();
    
    movablePieces.forEach(piece => {
        piece.style.animation = 'hint-pulse 1s ease-in-out 2';
    });
    
    showMessage(`You can move ${movablePieces.length} piece(s)`, 'info');
}

function selectNewImage() {
    // Reset everything
    selectedImage = null;
    resetGameState();
    
    // Show selection screen
    const selectionScreen = document.querySelector('.image-selection');
    const gameScreen = document.querySelector('.puzzle-game');
    
    if (selectionScreen) selectionScreen.style.display = 'block';
    if (gameScreen) gameScreen.style.display = 'none';
    
    // Reset selections
    document.querySelectorAll('.preset-img').forEach(img => {
        img.classList.remove('selected');
    });
    
    const createBtn = document.querySelector('.create-puzzle-btn');
    if (createBtn) {
        createBtn.disabled = true;
        createBtn.textContent = 'Select Image First';
    }
    
    showMessage('Select a new image to create another puzzle!', 'info');
}

function goBack() {
    // Navigate back to main games menu
    window.location.href = 'index.html';
}

// Utility function to show messages
function showMessage(message, type = 'info') {
    // Remove existing message
    const existingMsg = document.querySelector('.puzzle-message');
    if (existingMsg) existingMsg.remove();
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `puzzle-message puzzle-message-${type}`;
    messageDiv.textContent = message;
    
    // Style the message
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideDown 0.3s ease-out, slideUp 0.3s ease-in 2.7s forwards;
    `;
    
    document.body.appendChild(messageDiv);
    
    // Remove after 3 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
        to { transform: translateX(-50%) translateY(0); opacity: 1; }
    }
    
    @keyframes slideUp {
        from { transform: translateX(-50%) translateY(0); opacity: 1; }
        to { transform: translateX(-50%) translateY(-100%); opacity: 0; }
    }
    
    @keyframes celebration {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }
    
    @keyframes hint-pulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(74, 144, 226, 0.7); }
        50% { box-shadow: 0 0 0 10px rgba(74, 144, 226, 0); }
    }
    
    .puzzle-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-gap: 4px;
        width: 300px;
        height: 300px;
        margin: 0 auto;
        background: #f0f0f0;
        border-radius: 12px;
        padding: 8px;
    }
    
    .puzzle-piece {
        background-color: #ddd;
        border-radius: 8px;
        cursor: pointer;
        position: relative;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .puzzle-piece:not(.empty):hover {
        transform: scale(1.05);
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }
    
    .puzzle-piece.empty {
        background: transparent;
        cursor: default;
    }
    
    .piece-number {
        position: absolute;
        top: 4px;
        right: 4px;
        background: rgba(255,255,255,0.8);
        color: #333;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        font-size: 10px;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
    }
`;
document.head.appendChild(style);

console.log('🧩 Puzzle Builder Script Loaded!');
