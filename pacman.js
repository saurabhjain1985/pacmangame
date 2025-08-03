// Pac-Man Collection - Multiple Game Modes
// Game constants
const CELL_SIZE = 20;
const MAZE_WIDTH = 28;
const MAZE_HEIGHT = 21;

// Game modes
let currentGameMode = 'classic';
let selectedAvatar = 'classic';

// Multi-level system
let currentLevel = 1;
const MAX_LEVELS = 3;

// Speed adjustment per level
const getSpeedForLevel = (level) => {
    const baseSpeed = {
        pacman: 12,
        pacmanPower: 8,
        ghost: 16,
        ghostVulnerable: 24,
        ghostFrightened: 20
    };
    
    const speedMultiplier = Math.max(0.7, 1 - (level - 1) * 0.15);
    return {
        pacman: Math.max(6, Math.floor(baseSpeed.pacman * speedMultiplier)),
        pacmanPower: Math.max(4, Math.floor(baseSpeed.pacmanPower * speedMultiplier)),
        ghost: Math.max(8, Math.floor(baseSpeed.ghost * speedMultiplier)),
        ghostVulnerable: Math.max(12, Math.floor(baseSpeed.ghostVulnerable * speedMultiplier)),
        ghostFrightened: Math.max(10, Math.floor(baseSpeed.ghostFrightened * speedMultiplier))
    };
};

// Dynamic speed based on level
let speeds = getSpeedForLevel(currentLevel);

// Game elements
const canvas = document.getElementById('game-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const levelElement = document.getElementById('level');
const messageElement = document.getElementById('message');

// Game state
let score = 0;
let lives = 3;
let gameRunning = true;
let animationFrame = 0;
let powerMode = false;
let powerModeTimer = 0;
let powerBlinkTimer = 0;
let ghostsEatenInPowerMode = 0;
let gameWon = false;
let dotsCollected = 0;

// Shifting maze specific variables
let shiftTimer = 0;
let shiftInterval = 20000; // 20 seconds
let lastShiftTime = 0;

// Ghost control mode variables
let selectedGhost = 0;
let aiPacmanTarget = { x: 0, y: 0 };

// Avatar definitions
const avatars = {
    classic: { emoji: '🟡', color: '#FFFF00', name: 'Classic Pac-Man' },
    trump: { emoji: '🍊', color: '#FFA500', name: 'Donald Trump' },
    shrek: { emoji: '🟢', color: '#228B22', name: 'Shrek' },
    bezos: { emoji: '📦', color: '#FF9900', name: 'Jeff Bezos' },
    musk: { emoji: '🚀', color: '#1DA1F2', name: 'Elon Musk' },
    mario: { emoji: '🔴', color: '#FF0000', name: 'Mario' }
};

// Original maze layout
const originalMaze = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,5,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,5,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,0,1,1,1,1,1,2,1,1,2,1,1,1,1,1,0,1,1,1,1,1,1],
    [1,1,1,1,1,1,0,1,1,2,2,2,2,2,2,2,2,2,2,1,1,0,1,1,1,1,1,1],
    [1,1,1,1,1,1,0,1,1,2,1,1,2,2,2,2,1,1,2,1,1,0,1,1,1,1,1,1],
    [2,2,2,2,2,2,0,2,2,2,1,4,2,2,2,2,1,2,2,2,2,0,2,2,2,2,2,2],
    [1,1,1,1,1,1,0,1,1,2,1,1,1,1,1,1,1,1,2,1,1,0,1,1,1,1,1,1],
    [1,1,1,1,1,1,0,1,1,2,2,2,2,2,2,2,2,2,2,1,1,0,1,1,1,1,1,1],
    [1,1,1,1,1,1,0,1,1,2,1,1,1,1,1,1,1,1,2,1,1,0,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
    [1,0,0,0,1,1,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,1,1,0,0,0,1],
    [1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1],
    [1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,1],
    [1,5,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,5,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// Current maze (can be modified for shifting mode)
let maze = JSON.parse(JSON.stringify(originalMaze));

// Game objects
const pacman = {
    x: 13,
    y: 15,
    direction: 0, // 0: right, 1: down, 2: left, 3: up
    nextDirection: 0,
    mouthOpen: true
};

// Create 3 ghosts with different behaviors
const ghosts = [
    {
        x: 11,
        y: 9,
        direction: 0,
        nextDirection: 0,
        color: '#FF6B6B',
        behavior: 'chase',
        vulnerable: false,
        fleeDirection: 0,
        visionRadius: 5
    },
    {
        x: 13,
        y: 9,
        direction: 1,
        nextDirection: 1,
        color: '#4ECDC4',
        behavior: 'patrol',
        vulnerable: false,
        fleeDirection: 0,
        visionRadius: 4
    },
    {
        x: 15,
        y: 9,
        direction: 2,
        nextDirection: 2,
        color: '#FFE066',
        behavior: 'random',
        vulnerable: false,
        fleeDirection: 0,
        visionRadius: 3
    }
];

// Screen Management Functions
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function showModeSelection() {
    showScreen('mode-selection');
    resetGame();
}

function selectMode(mode) {
    currentGameMode = mode;
    
    if (mode === 'avatar-mode') {
        showScreen('avatar-selection');
    } else {
        selectedAvatar = 'classic';
        startGame();
    }
    
    updateGameTitle();
}

function selectAvatar(avatar) {
    selectedAvatar = avatar;
    
    // Update UI
    document.querySelectorAll('.avatar-card').forEach(card => {
        card.classList.remove('active');
    });
    document.querySelector(`[data-avatar="${avatar}"]`).classList.add('active');
}

function startGameWithAvatar() {
    startGame();
}

function startGame() {
    showScreen('game-screen');
    resetGame();
    initializeGame();
    updateGameTitle();
    updateControls();
    
    if (canvas && ctx) {
        gameLoop();
    }
}

function updateGameTitle() {
    const titles = {
        'classic': 'Pac-Man Classic',
        'ghost-control': 'Ghost Hunter Mode',
        'shifting-maze': 'Shifting Maze Mode',
        'avatar-mode': `Avatar Mode - ${avatars[selectedAvatar].name}`
    };
    
    document.getElementById('game-title').textContent = titles[currentGameMode] || 'Pac-Man';
}

function updateControls() {
    const controlText = document.getElementById('control-text');
    const objectiveText = document.getElementById('objective-text');
    const modeInfo = document.getElementById('mode-info');
    
    switch (currentGameMode) {
        case 'classic':
        case 'avatar-mode':
        case 'shifting-maze':
            controlText.textContent = '🖥️ Desktop: Use arrow keys to move Pac-Man';
            objectiveText.textContent = '🎯 Eat all dots to win! Avoid the 3 ghosts!';
            if (currentGameMode === 'shifting-maze') {
                modeInfo.style.display = 'inline';
                modeInfo.textContent = 'Maze shifts every 20s!';
            } else {
                modeInfo.style.display = 'none';
            }
            break;
        case 'ghost-control':
            controlText.textContent = '🖥️ Desktop: Use arrow keys to control selected ghost (SPACE to switch)';
            objectiveText.textContent = '👻 Control ghosts to trap AI Pac-Man! Ghosts have limited vision.';
            modeInfo.style.display = 'inline';
            modeInfo.textContent = `Controlling Ghost ${selectedGhost + 1}`;
            break;
    }
}

// Game Initialization
function initializeGame() {
    // Reset maze to original state
    maze = JSON.parse(JSON.stringify(originalMaze));
    
    // Reset positions
    pacman.x = 13;
    pacman.y = 15;
    pacman.direction = 0;
    pacman.nextDirection = 0;
    
    ghosts[0].x = 11;
    ghosts[0].y = 9;
    ghosts[1].x = 13;
    ghosts[1].y = 9;
    ghosts[2].x = 15;
    ghosts[2].y = 9;
    
    // Reset game state
    powerMode = false;
    powerModeTimer = 0;
    gameRunning = true;
    gameWon = false;
    dotsCollected = 0;
    shiftTimer = 0;
    lastShiftTime = Date.now();
    
    // Count total dots
    let totalDots = 0;
    for (let row of maze) {
        for (let cell of row) {
            if (cell === 0 || cell === 5) totalDots++;
        }
    }
    
    messageElement.textContent = '';
}

// Maze Shifting Logic (for shifting-maze mode)
function shiftMaze() {
    if (currentGameMode !== 'shifting-maze') return;
    
    const currentTime = Date.now();
    if (currentTime - lastShiftTime < shiftInterval) return;
    
    lastShiftTime = currentTime;
    
    // Create a list of non-wall, non-special tiles that can be shifted
    const shiftableTiles = [];
    for (let y = 1; y < MAZE_HEIGHT - 1; y++) {
        for (let x = 1; x < MAZE_WIDTH - 1; x++) {
            if (maze[y][x] === 0 || maze[y][x] === 2) {
                // Don't shift tiles too close to pacman or ghosts
                const distToPacman = Math.abs(x - pacman.x) + Math.abs(y - pacman.y);
                const tooCloseToGhost = ghosts.some(ghost => 
                    Math.abs(x - ghost.x) + Math.abs(y - ghost.y) < 3
                );
                
                if (distToPacman > 3 && !tooCloseToGhost) {
                    shiftableTiles.push({ x, y });
                }
            }
        }
    }
    
    // Randomly swap some tiles
    const swapCount = Math.min(10, Math.floor(shiftableTiles.length / 4));
    for (let i = 0; i < swapCount; i++) {
        const tile1 = shiftableTiles[Math.floor(Math.random() * shiftableTiles.length)];
        const tile2 = shiftableTiles[Math.floor(Math.random() * shiftableTiles.length)];
        
        if (tile1 !== tile2) {
            const temp = maze[tile1.y][tile1.x];
            maze[tile1.y][tile1.x] = maze[tile2.y][tile2.x];
            maze[tile2.y][tile2.x] = temp;
        }
    }
    
    // Show message
    messageElement.textContent = '🌀 Maze shifted!';
    setTimeout(() => {
        if (messageElement.textContent === '🌀 Maze shifted!') {
            messageElement.textContent = '';
        }
    }, 2000);
}

// AI Pac-Man Logic (for ghost-control mode)
function updateAIPacman() {
    if (currentGameMode !== 'ghost-control') return;
    
    // Simple AI: move towards nearest dot while avoiding ghosts
    const nearestDot = findNearestDot();
    if (nearestDot) {
        aiPacmanTarget = nearestDot;
    }
    
    // Check if any ghost is too close
    const nearestGhost = findNearestVisibleGhost();
    
    if (nearestGhost && nearestGhost.distance < 4) {
        // Run away from ghost
        const escapeDirection = getEscapeDirection(nearestGhost);
        if (escapeDirection !== -1) {
            pacman.nextDirection = escapeDirection;
        }
    } else if (aiPacmanTarget) {
        // Move towards target
        const direction = getDirectionToTarget(aiPacmanTarget);
        if (direction !== -1) {
            pacman.nextDirection = direction;
        }
    }
}

function findNearestDot() {
    let nearest = null;
    let minDistance = Infinity;
    
    for (let y = 0; y < MAZE_HEIGHT; y++) {
        for (let x = 0; x < MAZE_WIDTH; x++) {
            if (maze[y][x] === 0 || maze[y][x] === 5) {
                const distance = Math.abs(x - pacman.x) + Math.abs(y - pacman.y);
                if (distance < minDistance) {
                    minDistance = distance;
                    nearest = { x, y };
                }
            }
        }
    }
    
    return nearest;
}

function findNearestVisibleGhost() {
    let nearest = null;
    let minDistance = Infinity;
    
    for (const ghost of ghosts) {
        const distance = Math.abs(ghost.x - pacman.x) + Math.abs(ghost.y - pacman.y);
        // Check if ghost can "see" pacman (within vision radius)
        if (distance <= ghost.visionRadius && distance < minDistance) {
            minDistance = distance;
            nearest = { ghost, distance };
        }
    }
    
    return nearest;
}

function getEscapeDirection(nearestGhost) {
    const directions = [
        { dir: 0, dx: 1, dy: 0 },   // right
        { dir: 1, dx: 0, dy: 1 },   // down
        { dir: 2, dx: -1, dy: 0 },  // left
        { dir: 3, dx: 0, dy: -1 }   // up
    ];
    
    let bestDirection = -1;
    let maxDistance = -1;
    
    for (const { dir, dx, dy } of directions) {
        const newX = pacman.x + dx;
        const newY = pacman.y + dy;
        
        if (isValidMove(newX, newY)) {
            const distanceFromGhost = Math.abs(newX - nearestGhost.ghost.x) + Math.abs(newY - nearestGhost.ghost.y);
            if (distanceFromGhost > maxDistance) {
                maxDistance = distanceFromGhost;
                bestDirection = dir;
            }
        }
    }
    
    return bestDirection;
}

function getDirectionToTarget(target) {
    const directions = [
        { dir: 0, dx: 1, dy: 0 },   // right
        { dir: 1, dx: 0, dy: 1 },   // down
        { dir: 2, dx: -1, dy: 0 },  // left
        { dir: 3, dx: 0, dy: -1 }   // up
    ];
    
    let bestDirection = -1;
    let minDistance = Infinity;
    
    for (const { dir, dx, dy } of directions) {
        const newX = pacman.x + dx;
        const newY = pacman.y + dy;
        
        if (isValidMove(newX, newY)) {
            const distance = Math.abs(newX - target.x) + Math.abs(newY - target.y);
            if (distance < minDistance) {
                minDistance = distance;
                bestDirection = dir;
            }
        }
    }
    
    return bestDirection;
}

// Ghost Control Logic
function handleGhostControl() {
    if (currentGameMode !== 'ghost-control') return;
    
    // Update selected ghost indicator
    document.getElementById('mode-info').textContent = `Controlling Ghost ${selectedGhost + 1}`;
}

function switchGhost() {
    if (currentGameMode === 'ghost-control') {
        selectedGhost = (selectedGhost + 1) % ghosts.length;
        handleGhostControl();
    }
}

// Continue with existing game logic...

// Utility Functions
function isValidMove(x, y) {
    if (x < 0 || x >= MAZE_WIDTH || y < 0 || y >= MAZE_HEIGHT) {
        return false;
    }
    return maze[y][x] !== 1;
}

// Initialize dots array
let dots = [];
let powerPellets = [];
function initializeDots() {
    dots = [];
    powerPellets = [];
    for (let y = 0; y < MAZE_HEIGHT; y++) {
        for (let x = 0; x < MAZE_WIDTH; x++) {
            if (maze[y][x] === 0) {
                dots.push({x: x, y: y});
            } else if (maze[y][x] === 5) {
                powerPellets.push({x: x, y: y});
            }
        }
    }
}

// Direction vectors
const directions = [
    {x: 1, y: 0},  // right
    {x: 0, y: 1},  // down
    {x: -1, y: 0}, // left
    {x: 0, y: -1}  // up
];

// Add roundRect polyfill for older browsers
if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius) {
        this.beginPath();
        this.moveTo(x + radius, y);
        this.lineTo(x + width - radius, y);
        this.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.lineTo(x + width, y + height - radius);
        this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.lineTo(x + radius, y + height);
        this.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.lineTo(x, y + radius);
        this.quadraticCurveTo(x, y, x + radius, y);
        this.closePath();
    };
}

// Input handling
document.addEventListener('keydown', (e) => {
    if (!gameRunning) return;
    
    // Special keys for different modes
    if (e.key === ' ' || e.key === 'Spacebar') {
        if (currentGameMode === 'ghost-control') {
            switchGhost();
            e.preventDefault();
            return;
        }
    }
    
    // Arrow key handling depends on game mode
    switch(e.key) {
        case 'ArrowRight':
            if (currentGameMode === 'ghost-control') {
                ghosts[selectedGhost].nextDirection = 0;
            } else {
                pacman.nextDirection = 0;
            }
            break;
        case 'ArrowDown':
            if (currentGameMode === 'ghost-control') {
                ghosts[selectedGhost].nextDirection = 1;
            } else {
                pacman.nextDirection = 1;
            }
            break;
        case 'ArrowLeft':
            if (currentGameMode === 'ghost-control') {
                ghosts[selectedGhost].nextDirection = 2;
            } else {
                pacman.nextDirection = 2;
            }
            break;
        case 'ArrowUp':
            if (currentGameMode === 'ghost-control') {
                ghosts[selectedGhost].nextDirection = 3;
            } else {
                pacman.nextDirection = 3;
            }
            break;
    }
});

// Mobile touch controls
document.addEventListener('DOMContentLoaded', () => {
    const controlBtns = document.querySelectorAll('.control-btn');
    
    controlBtns.forEach(btn => {
        // Prevent scrolling and zooming
        btn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            if (!gameRunning) return;
            
            // Haptic feedback if available
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
            
            const direction = btn.getAttribute('data-direction');
            setDirection(direction);
        }, { passive: false });
        
        btn.addEventListener('touchend', (e) => {
            e.preventDefault();
            e.stopPropagation();
        }, { passive: false });
        
        btn.addEventListener('touchmove', (e) => {
            e.preventDefault();
            e.stopPropagation();
        }, { passive: false });
        
        // Also handle regular clicks for desktop testing
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            if (!gameRunning) return;
            
            const direction = btn.getAttribute('data-direction');
            setDirection(direction);
        });
    });
    
    // Helper function to set direction
    function setDirection(direction) {
        switch(direction) {
            case 'right':
                pacman.nextDirection = 0;
                break;
            case 'down':
                pacman.nextDirection = 1;
                break;
            case 'left':
                pacman.nextDirection = 2;
                break;
            case 'up':
                pacman.nextDirection = 3;
                break;
        }
    }
    
    // Prevent zooming on double tap
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function (event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
    
    // Prevent pinch zoom
    document.addEventListener('gesturestart', function (e) {
        e.preventDefault();
    });
    
    document.addEventListener('gesturechange', function (e) {
        e.preventDefault();
    });
    
    document.addEventListener('gestureend', function (e) {
        e.preventDefault();
    });
});

// Check if position is valid (not a wall)
function isValidPosition(x, y) {
    if (x < 0 || x >= MAZE_WIDTH || y < 0 || y >= MAZE_HEIGHT) {
        return false;
    }
    return maze[y][x] !== 1;
}

// Handle tunnel effect (left-right wrap around)
function handleTunnel(obj) {
    if (obj.x < 0) {
        obj.x = MAZE_WIDTH - 1;
    } else if (obj.x >= MAZE_WIDTH) {
        obj.x = 0;
    }
}

// Move Pac-Man
function movePacman() {
    // Try to change direction if requested
    const nextDir = directions[pacman.nextDirection];
    const nextX = pacman.x + nextDir.x;
    const nextY = pacman.y + nextDir.y;
    
    if (isValidPosition(nextX, nextY)) {
        pacman.direction = pacman.nextDirection;
    }
    
    // Move in current direction
    const dir = directions[pacman.direction];
    const newX = pacman.x + dir.x;
    const newY = pacman.y + dir.y;
    
    if (isValidPosition(newX, newY)) {
        pacman.x = newX;
        pacman.y = newY;
        handleTunnel(pacman);
        
        // Check for dot collection
        for (let i = dots.length - 1; i >= 0; i--) {
            if (dots[i].x === pacman.x && dots[i].y === pacman.y) {
                dots.splice(i, 1);
                score += 10;
                scoreElement.textContent = `Score: ${score}`;
                
                // Play dot collection sound
                if (gameAudio) gameAudio.pacmanSounds.eatDot();
                
                // Check win condition
                if (dots.length === 0 && powerPellets.length === 0) {
                    gameRunning = false;
                    gameWon = true;
                    
                    if (currentLevel < MAX_LEVELS) {
                        messageElement.innerHTML = `
                            <div class="level-complete">
                                🎉 LEVEL ${currentLevel} COMPLETE! 🎉<br>
                                <button id="nextLevelBtn" onclick="nextLevel()">➡️ Level ${currentLevel + 1}</button>
                                <button id="restartBtn" onclick="restartGame()">🔄 Restart Game</button>
                            </div>
                        `;
                        messageElement.className = "level-complete";
                    } else {
                        messageElement.innerHTML = `
                            <div class="game-complete">
                                🏆 GAME COMPLETE! ALL LEVELS BEATEN! 🏆<br>
                                <div class="final-score">Final Score: ${score}</div>
                                <button id="restartBtn" onclick="restartGame()">🔄 Play Again</button>
                            </div>
                        `;
                        messageElement.className = "game-complete";
                    }
                    
                    if (gameAudio) gameAudio.pacmanSounds.levelUp();
                }
                break;
            }
        }
        
        // Check for power pellet collection
        for (let i = powerPellets.length - 1; i >= 0; i--) {
            if (powerPellets[i].x === pacman.x && powerPellets[i].y === pacman.y) {
                powerPellets.splice(i, 1);
                score += 50; // Authentic power pellet points
                scoreElement.textContent = `Score: ${score}`;
                
                // Play power pellet sound
                if (gameAudio) gameAudio.pacmanSounds.eatPowerPellet();
                
                // Activate power mode with authentic effects
                powerMode = true;
                powerModeTimer = 480; // 8 seconds at 60fps (more authentic timing)
                powerBlinkTimer = 0;
                ghostsEatenInPowerMode = 0; // Reset ghost eating counter
                
                // Make ghosts vulnerable and slower
                ghosts.forEach(ghost => {
                    ghost.vulnerable = true;
                    // Reverse ghost direction when power pellet is eaten (authentic behavior)
                    ghost.direction = (ghost.direction + 2) % 4;
                    ghost.fleeDirection = Math.floor(Math.random() * 4);
                });
                
                // Visual feedback - brief screen flash
                setTimeout(() => {
                    canvas.style.filter = 'brightness(1.5)';
                    setTimeout(() => {
                        canvas.style.filter = '';
                    }, 100);
                }, 50);
                
                // Check win condition
                if (dots.length === 0 && powerPellets.length === 0) {
                    gameRunning = false;
                    messageElement.textContent = "YOU WIN!";
                    messageElement.className = "winner";
                }
                break;
            }
        }
    }
    
    // Update power mode with authentic timing and blinking
    if (powerMode) {
        powerModeTimer--;
        powerBlinkTimer++;
        
        // Start blinking when power mode is about to end (last 3 seconds)
        if (powerModeTimer <= 180) { // Last 3 seconds
            // Make ghosts blink between blue and normal color
            const blinkRate = powerModeTimer <= 60 ? 8 : 16; // Faster blinking near end
            const shouldBlink = Math.floor(powerBlinkTimer / blinkRate) % 2 === 0;
            
            ghosts.forEach(ghost => {
                ghost.blinking = shouldBlink;
            });
        }
        
        if (powerModeTimer <= 0) {
            powerMode = false;
            powerBlinkTimer = 0;
            ghosts.forEach(ghost => {
                ghost.vulnerable = false;
                ghost.blinking = false;
            });
        }
    }
}

// Enhanced ghost AI with authentic Pacman behaviors
function moveGhosts() {
    ghosts.forEach((ghost, index) => {
        // In ghost-control mode, handle player input for selected ghost
        if (currentGameMode === 'ghost-control' && index === selectedGhost) {
            // Check if player wants to change direction
            if (ghost.nextDirection !== undefined && ghost.nextDirection !== ghost.direction) {
                const nextDir = directions[ghost.nextDirection];
                const nextX = ghost.x + nextDir.x;
                const nextY = ghost.y + nextDir.y;
                
                if (isValidPosition(nextX, nextY)) {
                    ghost.direction = ghost.nextDirection;
                }
            }
            
            // Move in current direction
            const dir = directions[ghost.direction];
            const newX = ghost.x + dir.x;
            const newY = ghost.y + dir.y;
            
            if (isValidPosition(newX, newY)) {
                ghost.x = newX;
                ghost.y = newY;
            } else {
                // Hit a wall, stop moving
                ghost.direction = (ghost.direction + 1) % 4; // Turn when hitting wall
            }
            
            return; // Skip AI behavior for player-controlled ghost
        }
        
        // Original AI behavior for non-controlled ghosts
        let bestDirection = ghost.direction;
        let validDirections = [];
        
        // Find all valid directions (avoid going backwards unless cornered)
        for (let i = 0; i < 4; i++) {
            const dir = directions[i];
            const newX = ghost.x + dir.x;
            const newY = ghost.y + dir.y;
            
            if (isValidPosition(newX, newY)) {
                // Prefer not to reverse direction unless it's the only option
                const isReverse = (ghost.direction + 2) % 4 === i;
                validDirections.push({
                    direction: i, 
                    x: newX, 
                    y: newY, 
                    isReverse: isReverse
                });
            }
        }
        
        if (validDirections.length === 0) return;
        
        // Filter out reverse direction if there are other options
        const nonReverseDirections = validDirections.filter(d => !d.isReverse);
        const directionsToConsider = nonReverseDirections.length > 0 ? nonReverseDirections : validDirections;
        
        // In ghost-control mode, limit vision for AI ghosts
        if (currentGameMode === 'ghost-control') {
            const distanceToPacman = Math.abs(ghost.x - pacman.x) + Math.abs(ghost.y - pacman.y);
            if (distanceToPacman > ghost.visionRadius) {
                // Can't see Pacman, move randomly
                const randomChoice = directionsToConsider[Math.floor(Math.random() * directionsToConsider.length)];
                bestDirection = randomChoice.direction;
                ghost.x = randomChoice.x;
                ghost.y = randomChoice.y;
                ghost.direction = bestDirection;
                return;
            }
        }
        
        // If ghost is vulnerable (power mode), flee from Pac-Man intelligently
        if (ghost.vulnerable && powerMode) {
            let maxDistance = -1;
            let bestOptions = [];
            
            directionsToConsider.forEach(option => {
                const distance = Math.abs(option.x - pacman.x) + Math.abs(option.y - pacman.y);
                if (distance > maxDistance) {
                    maxDistance = distance;
                    bestOptions = [option];
                } else if (distance === maxDistance) {
                    bestOptions.push(option);
                }
            });
            
            // Choose randomly among equally good fleeing options
            const chosen = bestOptions[Math.floor(Math.random() * bestOptions.length)];
            bestDirection = chosen.direction;
            
        } else {
            // Enhanced AI behavior when not vulnerable
            if (ghost.behavior === 'chase') {
                // Red ghost: Aggressive direct chase with pathfinding
                bestDirection = findBestPath(ghost, pacman.x, pacman.y, directionsToConsider);
                
            } else if (ghost.behavior === 'ambush') {
                // Teal ghost: Ambush by targeting ahead of Pac-Man
                let targetX = pacman.x + directions[pacman.direction].x * 4;
                let targetY = pacman.y + directions[pacman.direction].y * 4;
                
                // Ensure target is within bounds
                targetX = Math.max(0, Math.min(MAZE_WIDTH - 1, targetX));
                targetY = Math.max(0, Math.min(MAZE_HEIGHT - 1, targetY));
                
                bestDirection = findBestPath(ghost, targetX, targetY, directionsToConsider);
                
            } else if (ghost.behavior === 'random') {
                // Yellow ghost: Smart random - mix of hunting and unpredictability
                const distanceToPacman = Math.abs(ghost.x - pacman.x) + Math.abs(ghost.y - pacman.y);
                
                if (distanceToPacman < 8 && Math.random() < 0.7) {
                    // When close, 70% chance to hunt Pac-Man
                    bestDirection = findBestPath(ghost, pacman.x, pacman.y, directionsToConsider);
                } else if (Math.random() < 0.3) {
                    // 30% chance for truly random movement
                    const randomOption = directionsToConsider[Math.floor(Math.random() * directionsToConsider.length)];
                    bestDirection = randomOption.direction;
                } else {
                    // Otherwise, patrol corners or move toward general area
                    const patrolTargets = [
                        {x: 2, y: 2}, {x: MAZE_WIDTH-3, y: 2}, 
                        {x: 2, y: MAZE_HEIGHT-3}, {x: MAZE_WIDTH-3, y: MAZE_HEIGHT-3}
                    ];
                    const target = patrolTargets[Math.floor(Date.now() / 5000) % patrolTargets.length];
                    bestDirection = findBestPath(ghost, target.x, target.y, directionsToConsider);
                }
            }
        }
        
        // Move ghost with collision detection
        const dir = directions[bestDirection];
        const newX = ghost.x + dir.x;
        const newY = ghost.y + dir.y;
        
        if (isValidPosition(newX, newY)) {
            ghost.x = newX;
            ghost.y = newY;
            ghost.direction = bestDirection;
            handleTunnel(ghost);
        }
    });
}

// Enhanced pathfinding for ghosts
function findBestPath(ghost, targetX, targetY, validDirections) {
    let bestDirection = ghost.direction;
    let minDistance = Infinity;
    let bestOptions = [];
    
    validDirections.forEach(option => {
        // Calculate Manhattan distance to target
        const distance = Math.abs(option.x - targetX) + Math.abs(option.y - targetY);
        
        // Add small penalty for changing direction to reduce jittery movement
        const directionChangePenalty = (option.direction !== ghost.direction) ? 0.1 : 0;
        const totalScore = distance + directionChangePenalty;
        
        if (totalScore < minDistance) {
            minDistance = totalScore;
            bestOptions = [option];
        } else if (Math.abs(totalScore - minDistance) < 0.2) {
            // Include options that are very close in score
            bestOptions.push(option);
        }
    });
    
    // If multiple equally good options, choose one that doesn't reverse direction
    if (bestOptions.length > 1) {
        const nonReverseOptions = bestOptions.filter(opt => !opt.isReverse);
        if (nonReverseOptions.length > 0) {
            bestOptions = nonReverseOptions;
        }
    }
    
    // Choose randomly among best options to add unpredictability
    const chosen = bestOptions[Math.floor(Math.random() * bestOptions.length)];
    return chosen ? chosen.direction : ghost.direction;
}

// Check collision between Pac-Man and ghosts
function checkCollision() {
    for (let i = 0; i < ghosts.length; i++) {
        let ghost = ghosts[i];
        if (pacman.x === ghost.x && pacman.y === ghost.y) {
            if (ghost.vulnerable && powerMode) {
                // Pac-Man eats the ghost - authentic scoring: 200, 400, 800, 1600
                const ghostPoints = 200 * Math.pow(2, ghostsEatenInPowerMode);
                score += ghostPoints;
                scoreElement.textContent = `Score: ${score}`;
                ghostsEatenInPowerMode++;
                
                // Show points floating animation (authentic Pacman feature)
                showFloatingPoints(ghost.x * CELL_SIZE, ghost.y * CELL_SIZE, ghostPoints);
                
                // Play ghost eaten sound with enhanced feedback
                if (window.gameAudio) {
                    gameAudio.pacmanSounds.ghostEaten();
                    // Add extra celebration sound for multiple ghosts
                    if (ghostsEatenInPowerMode > 1) {
                        setTimeout(() => gameAudio.pacmanSounds.bonus(), 100);
                    }
                }
                
                // Reset ghost to starting position
                if (i === 0) { ghost.x = 11; ghost.y = 9; }
                else if (i === 1) { ghost.x = 13; ghost.y = 9; }
                else if (i === 2) { ghost.x = 15; ghost.y = 9; }
                
                ghost.vulnerable = false;
            } else {
                // Ghost catches Pac-Man
                lives--;
                livesElement.textContent = `Lives: ${lives}`;
                
                // Play death sound
                if (window.gameAudio) {
                    gameAudio.pacmanSounds.death();
                }
                
                if (lives <= 0) {
                    gameRunning = false;
                    messageElement.innerHTML = `
                        <div class="game-over">
                            💀 GAME OVER! 💀<br>
                            <div class="final-score">Score: ${score} | Level: ${currentLevel}</div>
                            <button id="restartBtn" onclick="restartGame()">🔄 Try Again</button>
                            <button id="backBtn" onclick="goBack()">← Back to Games</button>
                        </div>
                    `;
                    messageElement.className = "game-over";
                } else {
                    // Reset positions
                    pacman.x = 13;
                    pacman.y = 15;
                    // Reset ghost positions
                    ghosts[0].x = 11; ghosts[0].y = 9;
                    ghosts[1].x = 13; ghosts[1].y = 9;
                    ghosts[2].x = 15; ghosts[2].y = 9;
                    
                    // Reset power mode
                    powerMode = false;
                    powerModeTimer = 0;
                    ghosts.forEach(g => g.vulnerable = false);
                }
                break; // Only lose one life per collision
            }
        }
    }
}

// Drawing functions
function drawMaze() {
    // Create gradient for walls
    const wallGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    wallGradient.addColorStop(0, '#667eea');
    wallGradient.addColorStop(1, '#764ba2');
    
    ctx.fillStyle = wallGradient;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    
    for (let y = 0; y < MAZE_HEIGHT; y++) {
        for (let x = 0; x < MAZE_WIDTH; x++) {
            if (maze[y][x] === 1) {
                // Draw rounded rectangle for walls
                const cornerRadius = 3;
                ctx.beginPath();
                ctx.roundRect(x * CELL_SIZE + 1, y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2, cornerRadius);
                ctx.fill();
                ctx.stroke();
            }
        }
    }
}

function drawDots() {
    // Create gradient for regular dots
    const dotGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 4);
    dotGradient.addColorStop(0, '#FFD700');
    dotGradient.addColorStop(1, '#FFA500');
    
    for (let dot of dots) {
        const centerX = dot.x * CELL_SIZE + CELL_SIZE / 2;
        const centerY = dot.y * CELL_SIZE + CELL_SIZE / 2;
        
        // Add glow effect
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 8;
        
        ctx.fillStyle = dotGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Draw power pellets with authentic Pacman blinking
    for (let pellet of powerPellets) {
        // Authentic blinking effect - blink every 15 frames like original Pacman
        if (Math.floor(animationFrame / 15) % 2 === 0) {
            const centerX = pellet.x * CELL_SIZE + CELL_SIZE / 2;
            const centerY = pellet.y * CELL_SIZE + CELL_SIZE / 2;
            
            // Create authentic power pellet gradient
            const powerGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 8);
            powerGradient.addColorStop(0, '#FFFFFF');
            powerGradient.addColorStop(0.5, '#FFD700');
            powerGradient.addColorStop(1, '#FFA500');
            
            // Add glow effect like original game
            ctx.shadowColor = '#FFFF00';
            ctx.shadowBlur = 10;
            
            ctx.fillStyle = powerGradient;
            ctx.beginPath();
            ctx.arc(centerX, centerY, 7, 0, Math.PI * 2);
            ctx.fill();
            
            // Reset shadow
            ctx.shadowBlur = 0;
        }
    }
    
    // Reset shadow
    ctx.shadowBlur = 0;
}

function drawPacman() {
    const centerX = pacman.x * CELL_SIZE + CELL_SIZE / 2;
    const centerY = pacman.y * CELL_SIZE + CELL_SIZE / 2;
    const radius = CELL_SIZE / 2 - 2;
    
    // Check if using avatar mode or selected avatar
    const currentAvatar = avatars[selectedAvatar];
    
    if (selectedAvatar === 'classic') {
        // Original Pac-Man drawing
        const pacmanGradient = ctx.createRadialGradient(centerX - 3, centerY - 3, 0, centerX, centerY, radius);
        pacmanGradient.addColorStop(0, '#FFE135');
        pacmanGradient.addColorStop(1, '#F39C12');
        
        // Add glow effect
        ctx.shadowColor = '#FFE135';
        ctx.shadowBlur = 15;
        
        ctx.fillStyle = pacmanGradient;
        ctx.beginPath();
        
        if (pacman.mouthOpen) {
            // Draw Pac-Man with mouth open
            const mouthAngle = Math.PI / 3;
            const startAngle = (pacman.direction * Math.PI / 2) - mouthAngle / 2;
            const endAngle = (pacman.direction * Math.PI / 2) + mouthAngle / 2;
            
            ctx.arc(centerX, centerY, radius, endAngle, startAngle);
            ctx.lineTo(centerX, centerY);
        } else {
            // Draw full circle
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        }
        
        ctx.fill();
        ctx.shadowBlur = 0;
    } else {
        // Draw avatar-based character
        const avatarGradient = ctx.createRadialGradient(centerX - 3, centerY - 3, 0, centerX, centerY, radius);
        avatarGradient.addColorStop(0, currentAvatar.color);
        avatarGradient.addColorStop(1, currentAvatar.color + '80');
        
        // Add glow effect with avatar color
        ctx.shadowColor = currentAvatar.color;
        ctx.shadowBlur = 12;
        
        ctx.fillStyle = avatarGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // Draw emoji/character on top
        ctx.font = `${CELL_SIZE - 4}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.strokeText(currentAvatar.emoji, centerX, centerY);
        ctx.fillText(currentAvatar.emoji, centerX, centerY);
    }
    
    // Animate mouth for classic mode
    if (selectedAvatar === 'classic') {
        pacman.mouthOpen = !pacman.mouthOpen;
    }
}

function drawGhosts() {
    ghosts.forEach((ghost, index) => {
        const centerX = ghost.x * CELL_SIZE + CELL_SIZE / 2;
        const centerY = ghost.y * CELL_SIZE + CELL_SIZE / 2;
        const radius = CELL_SIZE / 2 - 2;
        
        // Authentic Pacman ghost colors
        const ghostColors = [
            { primary: '#FF0000', secondary: '#CC0000', name: 'Blinky' },  // Red
            { primary: '#FFB8FF', secondary: '#FF69B4', name: 'Pinky' },  // Pink
            { primary: '#00FFFF', secondary: '#00CCCC', name: 'Inky' },   // Cyan
            { primary: '#FFB852', secondary: '#FF8C00', name: 'Sue' }     // Orange
        ];
        
        const ghostColor = ghostColors[index] || ghostColors[0];
        
        // Create gradient for ghost based on its color and vulnerability
        const ghostGradient = ctx.createRadialGradient(centerX - 3, centerY - 5, 0, centerX, centerY, radius);
        
        if (ghost.vulnerable && powerMode) {
            // Vulnerable ghost - blue color with authentic blinking when power mode ending
            if (ghost.blinking) {
                // Blink between blue and white/normal color
                const blinkPhase = Math.floor(animationFrame / 8) % 2;
                if (blinkPhase === 0) {
                    // Blue vulnerable state
                    ghostGradient.addColorStop(0, '#4169E1');
                    ghostGradient.addColorStop(1, '#0000FF');
                    ctx.shadowColor = '#0000FF';
                } else {
                    // White blinking state (authentic Pacman behavior)
                    ghostGradient.addColorStop(0, '#FFFFFF');
                    ghostGradient.addColorStop(1, '#E0E0E0');
                    ctx.shadowColor = '#FFFFFF';
                }
            } else {
                // Solid blue vulnerable state
                ghostGradient.addColorStop(0, '#4169E1');
                ghostGradient.addColorStop(1, '#0000FF');
                ctx.shadowColor = '#0000FF';
            }
        } else {
            // Authentic ghost colors with enhanced gradients
            ghostGradient.addColorStop(0, ghostColor.primary);
            ghostGradient.addColorStop(1, ghostColor.secondary);
            ctx.shadowColor = ghostColor.primary;
        }
        
        // Add glow effect
        ctx.shadowBlur = 10;
        
        // Draw ghost body
        ctx.fillStyle = ghostGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY - radius / 2, radius, Math.PI, 0);
        ctx.lineTo(centerX + radius, centerY + radius);
        ctx.lineTo(centerX + radius * 0.5, centerY + radius * 0.7);
        ctx.lineTo(centerX, centerY + radius);
        ctx.lineTo(centerX - radius * 0.5, centerY + radius * 0.7);
        ctx.lineTo(centerX - radius, centerY + radius);
        ctx.closePath();
        ctx.fill();
        
        // Reset shadow
        ctx.shadowBlur = 0;
        
        // Draw eyes with modern style
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(centerX - radius * 0.3, centerY - radius * 0.3, radius * 0.25, 0, Math.PI * 2);
        ctx.arc(centerX + radius * 0.3, centerY - radius * 0.3, radius * 0.25, 0, Math.PI * 2);
        ctx.fill();
        
        // Eye pupils - different for vulnerable ghosts
        if (ghost.vulnerable && powerMode) {
            // Scared eyes - looking down
            ctx.fillStyle = '#FF0000';
            ctx.beginPath();
            ctx.arc(centerX - radius * 0.3, centerY - radius * 0.2, radius * 0.12, 0, Math.PI * 2);
            ctx.arc(centerX + radius * 0.3, centerY - radius * 0.2, radius * 0.12, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Normal pupils
            ctx.fillStyle = '#2C3E50';
            ctx.beginPath();
            ctx.arc(centerX - radius * 0.3, centerY - radius * 0.3, radius * 0.12, 0, Math.PI * 2);
            ctx.arc(centerX + radius * 0.3, centerY - radius * 0.3, radius * 0.12, 0, Math.PI * 2);
            ctx.fill();
            
            // Eye highlights
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(centerX - radius * 0.25, centerY - radius * 0.35, radius * 0.06, 0, Math.PI * 2);
            ctx.arc(centerX + radius * 0.35, centerY - radius * 0.35, radius * 0.06, 0, Math.PI * 2);
            ctx.fill();
        }
    });
}

function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw game elements
    drawMaze();
    drawDots();
    drawPacman();
    drawGhosts();
}

function gameLoop() {
    if (gameRunning) {
        // Dynamic speed based on power mode and level
        const pacmanSpeed = powerMode ? speeds.pacmanPower : speeds.pacman;
        const ghostSpeed = powerMode ? speeds.ghostVulnerable : speeds.ghost;
        
        // Update game mode specific mechanics
        if (currentGameMode === 'shifting-maze') {
            shiftMaze();
        } else if (currentGameMode === 'ghost-control') {
            updateAIPacman();
            handleGhostControl();
        }
        
        // Move Pacman at variable speed
        if (animationFrame % pacmanSpeed === 0) {
            movePacman();
        }
        
        // Move ghosts at variable speed (slower when vulnerable)
        if (animationFrame % ghostSpeed === 0) {
            moveGhosts();
        }
        
        checkCollision();
    }
    
    draw();
    animationFrame++;
    requestAnimationFrame(gameLoop);
}

// Level system functions
function nextLevel() {
    currentLevel++;
    speeds = getSpeedForLevel(currentLevel);
    resetGameState();
    gameRunning = true;
    levelElement.textContent = `Level: ${currentLevel}`;
    messageElement.textContent = `Level ${currentLevel}`;
    messageElement.className = "level-indicator";
    
    // Clear level indicator after 2 seconds
    setTimeout(() => {
        if (gameRunning) {
            messageElement.textContent = "";
            messageElement.className = "";
        }
    }, 2000);
    
    gameLoop();
}

function restartGame() {
    currentLevel = 1;
    speeds = getSpeedForLevel(currentLevel);
    score = 0;
    lives = 3;
    scoreElement.textContent = `Score: ${score}`;
    livesElement.textContent = `Lives: ${lives}`;
    levelElement.textContent = `Level: ${currentLevel}`;
    resetGameState();
    gameRunning = true;
    messageElement.textContent = "";
    messageElement.className = "";
    gameLoop();
}

function resetGameState() {
    // Reset pacman position
    pacman.x = 13;
    pacman.y = 15;
    pacman.direction = 0;
    pacman.nextDirection = 0;
    
    // Reset ghost positions
    ghosts[0].x = 11; ghosts[0].y = 9; ghosts[0].vulnerable = false;
    ghosts[1].x = 13; ghosts[1].y = 9; ghosts[1].vulnerable = false;
    ghosts[2].x = 15; ghosts[2].y = 9; ghosts[2].vulnerable = false;
    
    // Reset power mode
    powerMode = false;
    powerModeTimer = 0;
    powerBlinkTimer = 0;
    ghostsEatenInPowerMode = 0;
    gameWon = false;
    dotsCollected = 0;
    
    // Reinitialize dots and pellets
    initializeDots();
}

// Initialize and start game
function initGame() {
    initializeDots();
    scoreElement.textContent = `Score: ${score}`;
    livesElement.textContent = `Lives: ${lives}`;
    gameLoop();
}

// Show floating points animation (authentic Pacman feature)
function showFloatingPoints(x, y, points) {
    const pointsElement = document.createElement('div');
    pointsElement.textContent = points.toString();
    pointsElement.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        color: #FFD700;
        font-weight: bold;
        font-size: 14px;
        pointer-events: none;
        z-index: 1000;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
        animation: floatUp 2s ease-out forwards;
    `;
    
    // Add CSS animation if not already added
    if (!document.getElementById('floatUpAnimation')) {
        const style = document.createElement('style');
        style.id = 'floatUpAnimation';
        style.textContent = `
            @keyframes floatUp {
                0% { transform: translateY(0); opacity: 1; }
                100% { transform: translateY(-30px); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(pointsElement);
    
    // Remove element after animation
    setTimeout(() => {
        if (pointsElement.parentNode) {
            pointsElement.parentNode.removeChild(pointsElement);
        }
    }, 2000);
}

// Start the game when page loads
window.addEventListener('load', () => {
    // Show mode selection screen initially
    showModeSelection();
});
