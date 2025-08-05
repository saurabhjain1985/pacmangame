// Puzzle Builder Game Logic
let selectedImage = null;
let puzzlePieces = [];
let puzzleOrder = [];
let correctOrder = [];
let puzzleTimer = 0;
let puzzleInterval = null;
let isDragging = false;
let dragElement = null;

// Make functions available globally
window.selectedImage = null;
window.createPuzzle = createPuzzle;
window.shufflePuzzle = shufflePuzzle;
window.showHint = showHint;
window.resetPuzzleBuilder = resetPuzzleBuilder;

function initPuzzleBuilder() {
    console.log('Initializing Puzzle Builder...');
    setupImageSelection();
    resetPuzzleTimer();
    
    // Initialize image upload handler
    const fileInput = document.getElementById('image-upload');
    if (fileInput) {
        fileInput.addEventListener('change', function() {
            loadCustomImage(this);
        });
    }
    
    // Enable create puzzle button when image is selected
    window.addEventListener('imageSelected', () => {
        const createBtn = document.querySelector('.create-puzzle-btn');
        if (createBtn) {
            createBtn.disabled = false;
        }
    });
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

function selectPresetImage(imgElement) {
    console.log('Selecting preset image:', imgElement.src);
    
    // Remove previous selection
    document.querySelectorAll('.preset-img').forEach(img => {
        img.classList.remove('selected');
    });
    
    // Select new image
    imgElement.classList.add('selected');
    selectedImage = imgElement.src;
    window.selectedImage = selectedImage;
    console.log('Selected image set to:', selectedImage);
    
    // Enable create button
    const createBtn = document.querySelector('.create-puzzle-btn');
    if (createBtn) {
        createBtn.disabled = false;
    }
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('imageSelected'));
}
    
    // Enable create button
    const createBtn = document.querySelector('.create-puzzle-btn');
    if (createBtn) {
        createBtn.disabled = false;
        console.log('Create button enabled');
    } else {
        console.error('Create button not found!');
    }
}

function loadCustomImage(input) {
    const file = input.files[0];
    if (!file) return;
    
    // Check if it's an image
    if (!file.type.startsWith('image/')) {
        alert('Please select an image file!');
        return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('Image is too large! Please choose an image smaller than 5MB.');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        // Remove preset selection
        document.querySelectorAll('.preset-img').forEach(img => {
            img.classList.remove('selected');
        });
        
        selectedImage = e.target.result;
        
        // Show preview
        const preview = document.createElement('img');
        preview.src = selectedImage;
        preview.className = 'custom-preview';
        preview.style.width = '80px';
        preview.style.height = '80px';
        preview.style.border = '3px solid #4A90E2';
        preview.style.borderRadius = '8px';
        preview.style.objectFit = 'cover';
        
        // Replace upload button temporarily with preview
        const uploadBtn = document.querySelector('.upload-btn');
        const parent = uploadBtn.parentNode;
        parent.appendChild(preview);
        
        // Enable create button
        document.querySelector('.create-puzzle-btn').disabled = false;
    };
    
    reader.readAsDataURL(file);
}

function createPuzzle() {
    console.log('Creating puzzle with image:', selectedImage);
    
    if (!selectedImage) {
        alert('Please select an image first!');
        return;
    }
    
    // Show puzzle board and hide selection
    document.querySelector('.image-selection').style.display = 'none';
    document.querySelector('.puzzle-game').style.display = 'block';
    
    // Reset puzzle state
    puzzlePieces = [];
    puzzleOrder = [];
    correctOrder = [0, 1, 2, 3, 4, 5, 6, 7]; // 8 pieces (3x3 grid with center missing)
    
    // Show preview
    const preview = document.getElementById('puzzle-preview');
    preview.innerHTML = `<img src="${selectedImage}" alt="Puzzle Preview">`;
    
    // Create puzzle pieces
    createPuzzlePieces();
    
    // Enable shuffle button
    document.querySelector('.shuffle-btn').disabled = false;
    
    // Start timer
    startPuzzleTimer();
    
    // Shuffle automatically
    setTimeout(() => shufflePuzzle(), 500);
}

function createPuzzlePieces() {
    const board = document.getElementById('puzzle-board');
    board.innerHTML = '';
    
    // Create 3x3 grid with 8 pieces (center is empty)
    for (let i = 0; i < 9; i++) {
        const piece = document.createElement('div');
        piece.className = 'puzzle-piece';
        piece.dataset.position = i;
        
        if (i === 4) {
            // Center piece - empty space
            piece.classList.add('empty');
            piece.innerHTML = '';
        } else {
            // Regular piece with part of image
            const img = document.createElement('img');
            img.src = selectedImage;
            
            // Calculate position in image
            const row = Math.floor(i > 4 ? (i - 1) / 3 : i / 3);
            const col = i > 4 ? (i - 1) % 3 : i % 3;
            
            // Set image position to show correct part
            img.style.objectPosition = `${-col * 33.33}% ${-row * 50}%`;
            img.style.transform = `scale(3) translate(${col * 33.33}%, ${row * 50}%)`;
            
            piece.appendChild(img);
            piece.dataset.correctPosition = i;
            
            // Add click/touch handlers
            piece.addEventListener('click', () => movePiece(piece));
            piece.addEventListener('touchstart', handleTouchStart, {passive: false});
            piece.addEventListener('touchmove', handleTouchMove, {passive: false});
            piece.addEventListener('touchend', handleTouchEnd, {passive: false});
        }
        
        board.appendChild(piece);
        puzzlePieces.push(piece);
    }
}

function shufflePuzzle() {
    // Perform many random moves to shuffle
    for (let i = 0; i < 100; i++) {
        const movablePieces = getMovablePieces();
        if (movablePieces.length > 0) {
            const randomPiece = movablePieces[Math.floor(Math.random() * movablePieces.length)];
            movePiece(randomPiece, true); // Silent move
        }
    }
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
    if (piece.classList.contains('empty')) return;
    
    const piecePos = Array.from(puzzlePieces).indexOf(piece);
    const emptyPos = findEmptyPosition();
    
    if (canMovePiece(piecePos, emptyPos)) {
        // Swap piece with empty space
        const emptyPiece = puzzlePieces[emptyPos];
        
        // Swap in DOM
        const tempNextSibling = piece.nextSibling;
        piece.parentNode.insertBefore(piece, emptyPiece);
        piece.parentNode.insertBefore(emptyPiece, tempNextSibling);
        
        // Swap in array
        [puzzlePieces[piecePos], puzzlePieces[emptyPos]] = [puzzlePieces[emptyPos], puzzlePieces[piecePos]];
        
        // Update dataset positions
        piece.dataset.position = emptyPos;
        emptyPiece.dataset.position = piecePos;
        
        // Play move sound
        if (!silent) {
            playMoveSound();
        }
        
        // Check if puzzle is solved
        if (checkPuzzleSolved()) {
            setTimeout(() => {
                endPuzzleGame(true);
            }, 300);
        }
    }
}

function checkPuzzleSolved() {
    // Check if all pieces are in correct positions
    for (let i = 0; i < puzzlePieces.length; i++) {
        const piece = puzzlePieces[i];
        
        if (piece.classList.contains('empty')) {
            // Empty piece should be in center (position 4)
            if (i !== 4) return false;
        } else {
            // Regular piece should match its correct position
            const correctPos = parseInt(piece.dataset.correctPosition);
            if (i !== correctPos) return false;
        }
    }
    
    return true;
}

function startPuzzleTimer() {
    puzzleTimer = 0;
    if (puzzleInterval) clearInterval(puzzleInterval);
    
    puzzleInterval = setInterval(() => {
        puzzleTimer++;
        const minutes = Math.floor(puzzleTimer / 60);
        const seconds = puzzleTimer % 60;
        document.getElementById('puzzle-timer').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

function resetPuzzleTimer() {
    puzzleTimer = 0;
    document.getElementById('puzzle-timer').textContent = '00:00';
    if (puzzleInterval) {
        clearInterval(puzzleInterval);
        puzzleInterval = null;
    }
}

function endPuzzleGame(won) {
    if (puzzleInterval) {
        clearInterval(puzzleInterval);
        puzzleInterval = null;
    }
    
    if (won) {
        // Mark all pieces as correct
        puzzlePieces.forEach(piece => {
            if (!piece.classList.contains('empty')) {
                piece.classList.add('correct');
            }
        });
        
        const minutes = Math.floor(puzzleTimer / 60);
        const seconds = puzzleTimer % 60;
        const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        setTimeout(() => {
            alert(`🧩 Puzzle Complete!\n\nYou solved it in ${timeStr}!\n\nGreat job! 🎉`);
        }, 800);
    }
}

// Touch handlers for mobile
let touchStartX = 0;
let touchStartY = 0;

function handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
}

function handleTouchMove(e) {
    e.preventDefault();
}

function handleTouchEnd(e) {
    e.preventDefault();
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;
    
    // Require minimum swipe distance
    if (Math.abs(deltaX) < 30 && Math.abs(deltaY) < 30) {
        // Treat as tap
        movePiece(e.target.closest('.puzzle-piece'));
        return;
    }
    
    // Handle as swipe (same as tap for now)
    movePiece(e.target.closest('.puzzle-piece'));
}

function playMoveSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 400;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
        // Fallback: no sound
    }
}

// Puzzle Timer Functions
function startPuzzleTimer() {
    puzzleTimer = 0;
    puzzleInterval = setInterval(() => {
        puzzleTimer++;
        updatePuzzleTimer();
    }, 1000);
}

function updatePuzzleTimer() {
    const minutes = Math.floor(puzzleTimer / 60);
    const seconds = puzzleTimer % 60;
    const timerElement = document.getElementById('puzzle-time');
    if (timerElement) {
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

function resetPuzzleTimer() {
    if (puzzleInterval) {
        clearInterval(puzzleInterval);
        puzzleInterval = null;
    }
    puzzleTimer = 0;
    updatePuzzleTimer();
}

// Reset Puzzle Builder
function resetPuzzleBuilder() {
    // Reset all states
    selectedImage = null;
    puzzlePieces = [];
    puzzleOrder = [];
    correctOrder = [];
    resetPuzzleTimer();
    
    // Hide puzzle game and show image selection
    document.querySelector('.puzzle-game').style.display = 'none';
    document.querySelector('.image-selection').style.display = 'block';
    
    // Clear selections
    document.querySelectorAll('.preset-img').forEach(img => {
        img.classList.remove('selected');
    });
    
    // Reset file input
    const fileInput = document.getElementById('image-upload');
    if (fileInput) {
        fileInput.value = '';
    }
    
    // Remove custom preview
    const customPreview = document.querySelector('.custom-preview');
    if (customPreview) {
        customPreview.remove();
    }
    
    // Disable create button
    const createBtn = document.querySelector('.create-puzzle-btn');
    if (createBtn) {
        createBtn.disabled = true;
    }
    
    console.log('Puzzle Builder reset');
}

// Show Hint Function
function showHint() {
    // Highlight pieces that are in wrong positions
    puzzlePieces.forEach((piece, index) => {
        if (piece.classList.contains('empty')) return;
        
        const currentPos = parseInt(piece.dataset.position);
        const correctPos = parseInt(piece.dataset.correctPosition);
        
        if (currentPos !== correctPos) {
            piece.style.border = '3px solid #ff6b6b';
            setTimeout(() => {
                piece.style.border = '';
            }, 2000);
        }
    });
}
