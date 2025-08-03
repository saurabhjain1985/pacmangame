// Game constants
const CELL_SIZE = 20;
const MAZE_WIDTH = 28;
const MAZE_HEIGHT = 21;

// Original Pacman speed mechanics
const PACMAN_NORMAL_SPEED = 12; // Frames between moves (slower = higher number)
const PACMAN_POWER_SPEED = 8;   // Faster when powered up
const GHOST_NORMAL_SPEED = 16;  // Normal ghost speed
const GHOST_VULNERABLE_SPEED = 24; // Much slower when vulnerable
const GHOST_FRIGHTENED_SPEED = 20; // Slightly slower when fleeing

// Game elements
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const messageElement = document.getElementById('message');

// Game state
let score = 0;
let lives = 3;
let gameRunning = true;
let animationFrame = 0;
let powerMode = false;
let powerModeTimer = 0;
let powerBlinkTimer = 0; // For blinking effect when power mode is ending
let ghostsEatenInPowerMode = 0; // Track consecutive ghost eating for authentic scoring

// Maze layout (1 = wall, 0 = dot, 2 = empty space, 3 = pacman start, 4 = ghost start, 5 = power pellet)
const maze = [
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
        color: '#FF6B6B',
        behavior: 'chase',
        vulnerable: false,
        fleeDirection: 0
    },
    {
        x: 13,
        y: 9,
        direction: 2,
        color: '#4ECDC4',
        behavior: 'ambush',
        vulnerable: false,
        fleeDirection: 0
    },
    {
        x: 15,
        y: 9,
        direction: 1,
        color: '#FFD93D',
        behavior: 'random',
        vulnerable: false,
        fleeDirection: 0
    }
];

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
    
    switch(e.key) {
        case 'ArrowRight':
            pacman.nextDirection = 0;
            break;
        case 'ArrowDown':
            pacman.nextDirection = 1;
            break;
        case 'ArrowLeft':
            pacman.nextDirection = 2;
            break;
        case 'ArrowUp':
            pacman.nextDirection = 3;
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
                    messageElement.textContent = "YOU WIN!";
                    messageElement.className = "winner";
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
                
                // Play ghost eaten sound
                if (window.gameAudio) {
                    gameAudio.pacmanSounds.ghostEaten();
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
                    messageElement.textContent = "GAME OVER!";
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
    
    // Create gradient for Pac-Man
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
    
    // Reset shadow
    ctx.shadowBlur = 0;
    
    // Animate mouth
    pacman.mouthOpen = !pacman.mouthOpen;
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
        // Dynamic speed based on power mode - authentic Pacman mechanics
        const pacmanSpeed = powerMode ? PACMAN_POWER_SPEED : PACMAN_NORMAL_SPEED;
        const ghostSpeed = powerMode ? GHOST_VULNERABLE_SPEED : GHOST_NORMAL_SPEED;
        
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
window.addEventListener('load', initGame);
