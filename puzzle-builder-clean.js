// Clean Puzzle Builder Implementation
console.log('Loading clean puzzle builder...');

let puzzleBuilderState = {
    selectedImage: null,
    pieces: [],
    emptyIndex: 8, // 3x3 grid, bottom-right is empty
    moves: 0,
    timer: 0,
    timerInterval: null,
    isPlaying: false
};

// Make functions globally available
window.createPuzzle = createPuzzle;
window.shufflePuzzle = shufflePuzzle;
window.showHint = showHint;
window.resetPuzzleBuilder = resetPuzzleBuilder;

function initPuzzleBuilder() {
    console.log('Initializing clean puzzle builder...');
    
    // Set up preset image selection
    const presetImages = document.querySelectorAll('.preset-img');
    presetImages.forEach((img, index) => {
        img.addEventListener('click', () => selectPresetImage(img));
    });
    
    // Set up file upload
    const fileInput = document.getElementById('image-upload');
    if (fileInput) {
        fileInput.addEventListener('change', handleFileUpload);
    }
    
    console.log('Puzzle builder initialized successfully');
}

function selectPresetImage(imgElement) {
    console.log('Selecting preset image:', imgElement.src);
    
    // Clear previous selections
    document.querySelectorAll('.preset-img').forEach(img => {
        img.classList.remove('selected');
    });
    
    // Select this image
    imgElement.classList.add('selected');
    puzzleBuilderState.selectedImage = imgElement.src;
    
    // Enable create button
    const createBtn = document.querySelector('.create-puzzle-btn');
    if (createBtn) {
        createBtn.disabled = false;
        createBtn.textContent = '🎯 Create Puzzle';
    }
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        alert('Please select an image file!');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
        alert('Image too large! Please choose a file smaller than 5MB.');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        // Clear preset selections
        document.querySelectorAll('.preset-img').forEach(img => {
            img.classList.remove('selected');
        });
        
        puzzleBuilderState.selectedImage = e.target.result;
        
        // Enable create button
        const createBtn = document.querySelector('.create-puzzle-btn');
        if (createBtn) {
            createBtn.disabled = false;
            createBtn.textContent = '🎯 Create Custom Puzzle';
        }
    };
    
    reader.readAsDataURL(file);
}

function createPuzzle() {
    console.log('Creating puzzle...');
    
    if (!puzzleBuilderState.selectedImage) {
        alert('Please select an image first!');
        return;
    }
    
    // Hide selection screen, show game
    const selectionDiv = document.querySelector('.image-selection');
    const gameDiv = document.querySelector('.puzzle-game');
    
    if (selectionDiv) selectionDiv.style.display = 'none';
    if (gameDiv) gameDiv.style.display = 'block';
    
    // Set up preview
    const preview = document.getElementById('puzzle-preview');
    if (preview) {
        preview.innerHTML = `<img src="${puzzleBuilderState.selectedImage}" alt="Puzzle Preview" style="width: 150px; height: 150px; object-fit: cover; border-radius: 8px;">`;
    }
    
    // Create puzzle grid
    createPuzzleGrid();
    
    // Reset game state
    puzzleBuilderState.moves = 0;
    puzzleBuilderState.timer = 0;
    puzzleBuilderState.isPlaying = true;
    
    // Enable buttons
    const shuffleBtn = document.querySelector('.shuffle-btn');
    if (shuffleBtn) shuffleBtn.disabled = false;
    
    // Start timer
    startTimer();
}

function createPuzzleGrid() {
    const board = document.getElementById('puzzle-board');
    if (!board) return;
    
    board.innerHTML = '';
    board.style.display = 'grid';
    board.style.gridTemplateColumns = 'repeat(3, 120px)';
    board.style.gridTemplateRows = 'repeat(3, 120px)';
    board.style.gap = '4px';
    board.style.justifyContent = 'center';
    board.style.margin = '20px auto';
    
    puzzleBuilderState.pieces = [];
    
    // Create a temporary image to get dimensions
    const tempImg = new Image();
    tempImg.onload = function() {
        createPuzzlePieces();
    };
    tempImg.src = puzzleBuilderState.selectedImage;
    
    function createPuzzlePieces() {
        for (let i = 0; i < 9; i++) {
            const piece = document.createElement('div');
            piece.className = 'puzzle-piece';
            piece.style.width = '120px';
            piece.style.height = '120px';
            piece.style.border = '2px solid #ddd';
            piece.style.borderRadius = '6px';
            piece.style.cursor = 'pointer';
            piece.style.overflow = 'hidden';
            piece.style.position = 'relative';
            piece.style.backgroundColor = 'white';
            piece.dataset.index = i;
            
            if (i === 8) {
                // Empty space (bottom-right)
                piece.classList.add('empty');
                piece.style.background = 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)';
                piece.style.backgroundSize = '20px 20px';
                piece.style.backgroundPosition = '0 0, 0 10px, 10px -10px, -10px 0px';
                piece.style.border = '2px dashed #ccc';
                piece.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #999; font-size: 12px;">Empty</div>';
            } else {
                // Image piece - calculate which part of the image to show
                const row = Math.floor(i / 3);
                const col = i % 3;
                
                const pieceImg = document.createElement('div');
                pieceImg.style.width = '120px';
                pieceImg.style.height = '120px';
                pieceImg.style.backgroundImage = `url(${puzzleBuilderState.selectedImage})`;
                pieceImg.style.backgroundSize = '360px 360px'; // 3x3 grid, each piece 120px
                pieceImg.style.backgroundPosition = `${-col * 120}px ${-row * 120}px`;
                pieceImg.style.backgroundRepeat = 'no-repeat';
                
                // Add piece number for debugging
                const label = document.createElement('div');
                label.style.position = 'absolute';
                label.style.top = '2px';
                label.style.left = '2px';
                label.style.background = 'rgba(0,0,0,0.5)';
                label.style.color = 'white';
                label.style.fontSize = '10px';
                label.style.padding = '2px 4px';
                label.style.borderRadius = '3px';
                label.style.zIndex = '10';
                label.textContent = (i + 1).toString();
                
                piece.appendChild(pieceImg);
                piece.appendChild(label);
                piece.dataset.correctIndex = i;
            }
            
            piece.addEventListener('click', () => movePiece(i));
            board.appendChild(piece);
            puzzleBuilderState.pieces.push(piece);
        }
        
        console.log('Puzzle grid created with 8 pieces + 1 empty space');
        
        // Trigger shuffle after pieces are fully rendered
        setTimeout(() => {
            if (puzzleBuilderState.isPlaying) {
                shufflePuzzle();
            }
        }, 200);
    }
}

function movePiece(clickedIndex) {
    if (!puzzleBuilderState.isPlaying) return;
    
    const emptyIndex = puzzleBuilderState.emptyIndex;
    
    // Check if piece can move (adjacent to empty space)
    if (!canMove(clickedIndex, emptyIndex)) return;
    
    // Swap pieces
    const clickedPiece = puzzleBuilderState.pieces[clickedIndex];
    const emptyPiece = puzzleBuilderState.pieces[emptyIndex];
    
    // Swap content
    const tempContent = clickedPiece.innerHTML;
    const tempClass = clickedPiece.className;
    const tempDataset = {...clickedPiece.dataset};
    
    clickedPiece.innerHTML = emptyPiece.innerHTML;
    clickedPiece.className = emptyPiece.className;
    Object.keys(emptyPiece.dataset).forEach(key => {
        clickedPiece.dataset[key] = emptyPiece.dataset[key];
    });
    
    emptyPiece.innerHTML = tempContent;
    emptyPiece.className = tempClass;
    Object.keys(tempDataset).forEach(key => {
        emptyPiece.dataset[key] = tempDataset[key];
    });
    
    // Update empty index
    puzzleBuilderState.emptyIndex = clickedIndex;
    
    // Update moves
    puzzleBuilderState.moves++;
    updateStats();
    
    // Check if solved
    if (isPuzzleSolved()) {
        puzzleComplete();
    }
}

function canMove(pieceIndex, emptyIndex) {
    const pieceRow = Math.floor(pieceIndex / 3);
    const pieceCol = pieceIndex % 3;
    const emptyRow = Math.floor(emptyIndex / 3);
    const emptyCol = emptyIndex % 3;
    
    // Adjacent horizontally or vertically
    return (Math.abs(pieceRow - emptyRow) === 1 && pieceCol === emptyCol) ||
           (Math.abs(pieceCol - emptyCol) === 1 && pieceRow === emptyRow);
}

function shufflePuzzle() {
    console.log('Starting puzzle shuffle...');
    
    if (!puzzleBuilderState.pieces || puzzleBuilderState.pieces.length !== 9) {
        console.log('Pieces not ready, retrying shuffle...');
        setTimeout(() => shufflePuzzle(), 500);
        return;
    }
    
    // Disable game play during shuffle
    const wasPlaying = puzzleBuilderState.isPlaying;
    puzzleBuilderState.isPlaying = false;
    
    // Perform more moves for better shuffling
    let shuffleCount = 0;
    const maxShuffles = 200;
    
    function performShuffleMove() {
        if (shuffleCount >= maxShuffles) {
            // Shuffling complete
            puzzleBuilderState.isPlaying = wasPlaying;
            puzzleBuilderState.moves = 0;
            updateStats();
            console.log('Puzzle shuffled successfully!');
            
            // Verify puzzle is actually shuffled
            if (isPuzzleSolved()) {
                console.log('Warning: Puzzle still solved after shuffle, shuffling more...');
                setTimeout(() => shufflePuzzle(), 100);
            }
            return;
        }
        
        // Find all possible moves
        const possibleMoves = [];
        for (let j = 0; j < 9; j++) {
            if (j !== puzzleBuilderState.emptyIndex && canMove(j, puzzleBuilderState.emptyIndex)) {
                possibleMoves.push(j);
            }
        }
        
        if (possibleMoves.length > 0) {
            const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
            
            // Perform the move without triggering game logic
            swapPieces(randomMove, puzzleBuilderState.emptyIndex);
            puzzleBuilderState.emptyIndex = randomMove;
        }
        
        shuffleCount++;
        
        // Continue shuffling with small delay for visual effect
        if (shuffleCount % 10 === 0) {
            setTimeout(performShuffleMove, 50);
        } else {
            performShuffleMove();
        }
    }
    
    performShuffleMove();
}

// Helper function to swap pieces without game logic
function swapPieces(index1, index2) {
    const piece1 = puzzleBuilderState.pieces[index1];
    const piece2 = puzzleBuilderState.pieces[index2];
    
    if (!piece1 || !piece2) return;
    
    // Swap innerHTML
    const tempHTML = piece1.innerHTML;
    piece1.innerHTML = piece2.innerHTML;
    piece2.innerHTML = tempHTML;
    
    // Swap classes
    const tempClass = piece1.className;
    piece1.className = piece2.className;
    piece2.className = tempClass;
    
    // Swap dataset
    const tempDataset = {...piece1.dataset};
    Object.keys(piece2.dataset).forEach(key => {
        piece1.dataset[key] = piece2.dataset[key];
    });
    Object.keys(tempDataset).forEach(key => {
        piece2.dataset[key] = tempDataset[key];
    });
}

function showHint() {
    console.log('Showing hint...');
    
    puzzleBuilderState.pieces.forEach((piece, index) => {
        if (piece.classList.contains('empty')) return;
        
        const correctIndex = parseInt(piece.dataset.correctIndex);
        if (index !== correctIndex) {
            piece.style.border = '3px solid #ff6b6b';
            piece.style.boxShadow = '0 0 10px rgba(255, 107, 107, 0.5)';
            
            setTimeout(() => {
                piece.style.border = '2px solid #ddd';
                piece.style.boxShadow = 'none';
            }, 2000);
        }
    });
}

function resetPuzzleBuilder() {
    console.log('Resetting puzzle builder...');
    
    // Stop timer
    if (puzzleBuilderState.timerInterval) {
        clearInterval(puzzleBuilderState.timerInterval);
    }
    
    // Reset state
    puzzleBuilderState.selectedImage = null;
    puzzleBuilderState.pieces = [];
    puzzleBuilderState.emptyIndex = 8;
    puzzleBuilderState.moves = 0;
    puzzleBuilderState.timer = 0;
    puzzleBuilderState.isPlaying = false;
    
    // Show selection screen
    const selectionDiv = document.querySelector('.image-selection');
    const gameDiv = document.querySelector('.puzzle-game');
    
    if (selectionDiv) selectionDiv.style.display = 'block';
    if (gameDiv) gameDiv.style.display = 'none';
    
    // Clear selections
    document.querySelectorAll('.preset-img').forEach(img => {
        img.classList.remove('selected');
    });
    
    // Reset file input
    const fileInput = document.getElementById('image-upload');
    if (fileInput) fileInput.value = '';
    
    // Disable create button
    const createBtn = document.querySelector('.create-puzzle-btn');
    if (createBtn) {
        createBtn.disabled = true;
        createBtn.textContent = '🎯 Create Puzzle';
    }
}

function startTimer() {
    if (puzzleBuilderState.timerInterval) {
        clearInterval(puzzleBuilderState.timerInterval);
    }
    
    puzzleBuilderState.timerInterval = setInterval(() => {
        puzzleBuilderState.timer++;
        updateStats();
    }, 1000);
}

function updateStats() {
    const timeElement = document.getElementById('puzzle-time');
    const movesElement = document.querySelector('.puzzle-stats .stat:nth-child(2) span:nth-child(2)');
    
    if (timeElement) {
        const minutes = Math.floor(puzzleBuilderState.timer / 60);
        const seconds = puzzleBuilderState.timer % 60;
        timeElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    if (movesElement) {
        movesElement.textContent = puzzleBuilderState.moves;
    }
}

function isPuzzleSolved() {
    for (let i = 0; i < 8; i++) {
        const piece = puzzleBuilderState.pieces[i];
        if (piece.classList.contains('empty')) continue;
        
        const correctIndex = parseInt(piece.dataset.correctIndex);
        if (i !== correctIndex) return false;
    }
    return true;
}

function puzzleComplete() {
    puzzleBuilderState.isPlaying = false;
    
    if (puzzleBuilderState.timerInterval) {
        clearInterval(puzzleBuilderState.timerInterval);
    }
    
    // Fill the empty space with the final piece (bottom-right corner)
    const emptyPiece = puzzleBuilderState.pieces[8];
    emptyPiece.classList.remove('empty');
    emptyPiece.innerHTML = '';
    emptyPiece.style.background = 'white';
    emptyPiece.style.border = '2px solid #4CAF50';
    
    // Create the final piece showing bottom-right corner of image
    const finalPieceImg = document.createElement('div');
    finalPieceImg.style.width = '120px';
    finalPieceImg.style.height = '120px';
    finalPieceImg.style.backgroundImage = `url(${puzzleBuilderState.selectedImage})`;
    finalPieceImg.style.backgroundSize = '360px 360px';
    finalPieceImg.style.backgroundPosition = '-240px -240px'; // Bottom-right corner (col=2, row=2)
    finalPieceImg.style.backgroundRepeat = 'no-repeat';
    
    // Add completion label
    const completionLabel = document.createElement('div');
    completionLabel.style.position = 'absolute';
    completionLabel.style.top = '2px';
    completionLabel.style.left = '2px';
    completionLabel.style.background = 'rgba(76, 175, 80, 0.8)';
    completionLabel.style.color = 'white';
    completionLabel.style.fontSize = '10px';
    completionLabel.style.padding = '2px 4px';
    completionLabel.style.borderRadius = '3px';
    completionLabel.style.zIndex = '10';
    completionLabel.textContent = '✓';
    
    emptyPiece.appendChild(finalPieceImg);
    emptyPiece.appendChild(completionLabel);
    
    // Add completion animation
    emptyPiece.style.animation = 'pulse 0.5s ease-in-out';
    
    setTimeout(() => {
        const minutes = Math.floor(puzzleBuilderState.timer / 60);
        const seconds = puzzleBuilderState.timer % 60;
        const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        alert(`🎉 Puzzle Complete!\n\nTime: ${timeStr}\nMoves: ${puzzleBuilderState.moves}\n\nWell done! 🧩`);
        
        // Remove piece numbers after completion
        document.querySelectorAll('.puzzle-piece div:last-child').forEach(label => {
            if (label.textContent.match(/^\d+$/)) {
                label.style.display = 'none';
            }
        });
    }, 500);
}

// Export for initialization
window.initPuzzleBuilder = initPuzzleBuilder;
