// Memory Blitz Game Logic
let memoryLevel = 1;
let memoryScore = 0;
let memoryTimeLeft = 30;
let memoryTimer = null;
let currentPattern = [];
let playerPattern = [];
let gameState = 'idle';
let patternColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3', '#54A0FF', '#5F27CD'];
let patternNumbers = [];
let patternShapes = ['●', '■', '▲', '♦', '★', '♠', '♣', '♥'];

function initMemoryBlitz() {
    resetMemoryGame();
}

function resetMemoryGame() {
    memoryLevel = 1;
    memoryScore = 0;
    memoryTimeLeft = 30;
    gameState = 'idle';
    currentPattern = [];
    playerPattern = [];
    
    updateMemoryDisplay();
    createMemoryBoard();
    
    if (memoryTimer) {
        clearInterval(memoryTimer);
        memoryTimer = null;
    }
}

function updateMemoryDisplay() {
    document.getElementById('memory-level').textContent = memoryLevel;
    document.getElementById('memory-score').textContent = memoryScore;
    document.getElementById('memory-timer').textContent = memoryTimeLeft;
}

function createMemoryBoard() {
    const board = document.getElementById('memory-board');
    board.innerHTML = '';
    
    // Create 4x4 grid
    for (let i = 0; i < 16; i++) {
        const tile = document.createElement('div');
        tile.className = 'memory-tile';
        tile.dataset.index = i;
        tile.addEventListener('click', () => handleMemoryTileClick(i));
        board.appendChild(tile);
    }
}

function startMemoryBlitz() {
    if (gameState !== 'idle') return;
    
    gameState = 'playing';
    memoryTimeLeft = 30;
    
    const startBtn = document.querySelector('.start-memory-btn');
    startBtn.textContent = 'Playing...';
    startBtn.disabled = true;
    
    startMemoryTimer();
    showNewPattern();
}

function startMemoryTimer() {
    memoryTimer = setInterval(() => {
        memoryTimeLeft--;
        updateMemoryDisplay();
        
        if (memoryTimeLeft <= 0) {
            endMemoryGame();
        }
    }, 1000);
}

function showNewPattern() {
    playerPattern = [];
    generateMemoryPattern();
    displayPattern();
}

function generateMemoryPattern() {
    currentPattern = [];
    patternNumbers = [];
    
    // Generate pattern based on level
    const patternLength = Math.min(2 + memoryLevel, 8);
    const usedIndices = new Set();
    
    for (let i = 0; i < patternLength; i++) {
        let index;
        do {
            index = Math.floor(Math.random() * 16);
        } while (usedIndices.has(index));
        
        usedIndices.add(index);
        currentPattern.push({
            index: index,
            color: patternColors[i % patternColors.length],
            number: (i % 9) + 1,
            shape: patternShapes[i % patternShapes.length]
        });
        patternNumbers.push(index);
    }
}

function displayPattern() {
    const tiles = document.querySelectorAll('.memory-tile');
    
    // Clear all tiles
    tiles.forEach(tile => {
        tile.className = 'memory-tile';
        tile.textContent = '';
        tile.style.backgroundColor = '';
    });
    
    // Show pattern one by one
    let step = 0;
    const showNext = () => {
        if (step < currentPattern.length) {
            const pattern = currentPattern[step];
            const tile = tiles[pattern.index];
            
            // Show multiple elements based on difficulty
            if (memoryLevel >= 3) {
                // Advanced: Color + Shape + Number
                tile.style.backgroundColor = pattern.color;
                tile.textContent = `${pattern.shape} ${pattern.number}`;
                tile.style.color = 'white';
            } else if (memoryLevel >= 2) {
                // Medium: Color + Number
                tile.style.backgroundColor = pattern.color;
                tile.textContent = pattern.number;
                tile.style.color = 'white';
            } else {
                // Basic: Just color
                tile.style.backgroundColor = pattern.color;
            }
            
            tile.classList.add('active');
            
            setTimeout(() => {
                tile.classList.remove('active');
                step++;
                showNext();
            }, 800 - (memoryLevel * 50)); // Faster display as level increases
            
        } else {
            // Pattern shown, now wait for player input
            setTimeout(() => {
                clearPattern();
                gameState = 'input';
            }, 1000);
        }
    };
    
    gameState = 'showing';
    showNext();
}

function clearPattern() {
    const tiles = document.querySelectorAll('.memory-tile');
    tiles.forEach(tile => {
        tile.className = 'memory-tile';
        tile.textContent = '';
        tile.style.backgroundColor = '';
        tile.style.color = '';
    });
}

function handleMemoryTileClick(index) {
    if (gameState !== 'input') return;
    
    const tile = document.querySelectorAll('.memory-tile')[index];
    playerPattern.push(index);
    
    // Check if correct
    const expectedIndex = patternNumbers[playerPattern.length - 1];
    
    if (index === expectedIndex) {
        // Correct!
        tile.classList.add('correct');
        
        setTimeout(() => {
            tile.classList.remove('correct');
        }, 300);
        
        if (playerPattern.length === currentPattern.length) {
            // Pattern complete!
            memoryScore += memoryLevel * 10;
            memoryLevel++;
            
            updateMemoryDisplay();
            
            setTimeout(() => {
                if (gameState === 'input') { // Make sure game is still running
                    showNewPattern();
                }
            }, 1000);
        }
        
    } else {
        // Wrong!
        tile.classList.add('wrong');
        
        setTimeout(() => {
            tile.classList.remove('wrong');
        }, 300);
        
        // Show correct pattern briefly
        highlightCorrectPattern();
        
        // Reduce score and reset pattern
        memoryScore = Math.max(0, memoryScore - 5);
        updateMemoryDisplay();
        
        setTimeout(() => {
            if (gameState === 'input') { // Make sure game is still running
                showNewPattern();
            }
        }, 2000);
    }
}

function highlightCorrectPattern() {
    const tiles = document.querySelectorAll('.memory-tile');
    
    currentPattern.forEach((pattern, i) => {
        const tile = tiles[pattern.index];
        setTimeout(() => {
            if (memoryLevel >= 3) {
                tile.style.backgroundColor = pattern.color;
                tile.textContent = `${pattern.shape} ${pattern.number}`;
                tile.style.color = 'white';
            } else if (memoryLevel >= 2) {
                tile.style.backgroundColor = pattern.color;
                tile.textContent = pattern.number;
                tile.style.color = 'white';
            } else {
                tile.style.backgroundColor = pattern.color;
            }
            
            setTimeout(() => {
                tile.style.backgroundColor = '';
                tile.textContent = '';
                tile.style.color = '';
            }, 400);
        }, i * 200);
    });
}

function endMemoryGame() {
    gameState = 'ended';
    
    if (memoryTimer) {
        clearInterval(memoryTimer);
        memoryTimer = null;
    }
    
    const startBtn = document.querySelector('.start-memory-btn');
    startBtn.textContent = 'Start Challenge';
    startBtn.disabled = false;
    
    // Show final score
    setTimeout(() => {
        alert(`🧠 Memory Blitz Complete!\n\nFinal Score: ${memoryScore}\nLevel Reached: ${memoryLevel}\n\nGreat job! Your memory is getting stronger!`);
        resetMemoryGame();
    }, 500);
}
