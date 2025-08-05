// Simple Classic Pac-Man Game
console.log('Pac-Man: Simple version loaded');

// Game constants
const CELL_SIZE = 20;
const MAZE_WIDTH = 28;
const MAZE_HEIGHT = 21;

// Game elements
let canvas = null;
let ctx = null;
let scoreElement = null;
let livesElement = null;
let messageElement = null;

// Game state
let score = 0;
let lives = 3;
let gameRunning = false;
let animationFrame = 0;
let powerMode = false;
let powerModeTimer = 0;

// Simple maze layout
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
    [2,2,2,2,2,2,0,2,2,2,1,2,2,2,2,2,2,1,2,2,2,0,2,2,2,2,2,2],
    [1,1,1,1,1,1,0,1,1,2,1,1,1,1,1,1,1,1,2,1,1,0,1,1,1,1,1,1],
    [1,1,1,1,1,1,0,1,1,2,2,2,2,2,2,2,2,2,2,1,1,0,1,1,1,1,1,1],
    [1,1,1,1,1,1,0,1,1,2,1,1,1,1,1,1,1,1,2,1,1,0,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
    [1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,1],
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
    nextDirection: 0
};

// Simple ghosts
const ghosts = [
    { x: 11, y: 9, direction: 0, color: '#FF0000' }, // Red
    { x: 13, y: 9, direction: 1, color: '#FFB8FF' }, // Pink
    { x: 15, y: 9, direction: 2, color: '#00FFFF' }  // Cyan
];

// Game arrays
let dots = [];
let powerPellets = [];

// Direction vectors
const directions = [
    {x: 1, y: 0},  // right
    {x: 0, y: 1},  // down
    {x: -1, y: 0}, // left
    {x: 0, y: -1}  // up
];

// Initialize game
function initGame() {
    console.log('Initializing simple Pac-Man game...');
    
    // Get DOM elements
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');
    scoreElement = document.getElementById('score');
    livesElement = document.getElementById('lives');
    messageElement = document.getElementById('message');
    
    // Initialize dots and power pellets
    initializeDots();
    
    // Update UI
    scoreElement.textContent = `Score: ${score}`;
    livesElement.textContent = `Lives: ${lives}`;
    
    // Start game
    gameRunning = true;
    gameLoop();
}

// Initialize dots from maze
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
    
    console.log(`Initialized ${dots.length} dots and ${powerPellets.length} power pellets`);
}

// Check if position is valid
function isValidPosition(x, y) {
    if (x < 0 || x >= MAZE_WIDTH || y < 0 || y >= MAZE_HEIGHT) {
        return false;
    }
    return maze[y][x] !== 1;
}

// Handle tunnel effect
function handleTunnel(obj) {
    if (obj.x < 0) {
        obj.x = MAZE_WIDTH - 1;
    } else if (obj.x >= MAZE_WIDTH) {
        obj.x = 0;
    }
}

// Move Pac-Man
function movePacman() {
    // Try to change direction
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
                
                // Check win condition
                if (dots.length === 0 && powerPellets.length === 0) {
                    gameRunning = false;
                    messageElement.textContent = "🎉 YOU WIN! 🎉";
                    messageElement.style.color = "gold";
                    messageElement.style.fontSize = "24px";
                }
                break;
            }
        }
        
        // Check for power pellet collection
        for (let i = powerPellets.length - 1; i >= 0; i--) {
            if (powerPellets[i].x === pacman.x && powerPellets[i].y === pacman.y) {
                powerPellets.splice(i, 1);
                score += 50;
                scoreElement.textContent = `Score: ${score}`;
                
                // Activate power mode
                powerMode = true;
                powerModeTimer = 300; // 5 seconds at 60fps
                
                // Make ghosts vulnerable
                ghosts.forEach(ghost => {
                    ghost.vulnerable = true;
                    // Reverse direction
                    ghost.direction = (ghost.direction + 2) % 4;
                });
                
                // Check win condition
                if (dots.length === 0 && powerPellets.length === 0) {
                    gameRunning = false;
                    messageElement.textContent = "🎉 YOU WIN! 🎉";
                    messageElement.style.color = "gold";
                    messageElement.style.fontSize = "24px";
                }
                break;
            }
        }
    }
    
    // Update power mode
    if (powerMode) {
        powerModeTimer--;
        if (powerModeTimer <= 0) {
            powerMode = false;
            ghosts.forEach(ghost => {
                ghost.vulnerable = false;
            });
        }
    }
}

// Move ghosts with simple AI
function moveGhosts() {
    ghosts.forEach(ghost => {
        // Simple AI: try to move toward Pac-Man, but with some randomness
        let validDirections = [];
        
        // Find valid directions
        for (let i = 0; i < 4; i++) {
            const dir = directions[i];
            const newX = ghost.x + dir.x;
            const newY = ghost.y + dir.y;
            
            if (isValidPosition(newX, newY)) {
                // Don't reverse direction unless necessary
                if ((ghost.direction + 2) % 4 !== i) {
                    validDirections.push(i);
                }
            }
        }
        
        // If no valid directions (cornered), allow reverse
        if (validDirections.length === 0) {
            for (let i = 0; i < 4; i++) {
                const dir = directions[i];
                const newX = ghost.x + dir.x;
                const newY = ghost.y + dir.y;
                
                if (isValidPosition(newX, newY)) {
                    validDirections.push(i);
                }
            }
        }
        
        if (validDirections.length === 0) return;
        
        let bestDirection;
        
        if (ghost.vulnerable && powerMode) {
            // Run away from Pac-Man
            let maxDistance = -1;
            validDirections.forEach(dir => {
                const testDir = directions[dir];
                const testX = ghost.x + testDir.x;
                const testY = ghost.y + testDir.y;
                const distance = Math.abs(testX - pacman.x) + Math.abs(testY - pacman.y);
                
                if (distance > maxDistance) {
                    maxDistance = distance;
                    bestDirection = dir;
                }
            });
        } else {
            // Chase Pac-Man (with some randomness)
            if (Math.random() < 0.8) {
                let minDistance = Infinity;
                validDirections.forEach(dir => {
                    const testDir = directions[dir];
                    const testX = ghost.x + testDir.x;
                    const testY = ghost.y + testDir.y;
                    const distance = Math.abs(testX - pacman.x) + Math.abs(testY - pacman.y);
                    
                    if (distance < minDistance) {
                        minDistance = distance;
                        bestDirection = dir;
                    }
                });
            } else {
                // Random movement 20% of the time
                bestDirection = validDirections[Math.floor(Math.random() * validDirections.length)];
            }
        }
        
        // Move ghost
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

// Check collisions
function checkCollision() {
    ghosts.forEach((ghost, index) => {
        if (pacman.x === ghost.x && pacman.y === ghost.y) {
            if (ghost.vulnerable && powerMode) {
                // Eat ghost
                score += 200;
                scoreElement.textContent = `Score: ${score}`;
                
                // Reset ghost position
                if (index === 0) { ghost.x = 11; ghost.y = 9; }
                else if (index === 1) { ghost.x = 13; ghost.y = 9; }
                else if (index === 2) { ghost.x = 15; ghost.y = 9; }
                
                ghost.vulnerable = false;
            } else {
                // Ghost catches Pac-Man
                lives--;
                livesElement.textContent = `Lives: ${lives}`;
                
                if (lives <= 0) {
                    gameRunning = false;
                    messageElement.textContent = "💀 GAME OVER! 💀";
                    messageElement.style.color = "red";
                    messageElement.style.fontSize = "24px";
                } else {
                    // Reset positions
                    pacman.x = 13;
                    pacman.y = 15;
                    ghosts[0].x = 11; ghosts[0].y = 9;
                    ghosts[1].x = 13; ghosts[1].y = 9;
                    ghosts[2].x = 15; ghosts[2].y = 9;
                    
                    // Reset power mode
                    powerMode = false;
                    powerModeTimer = 0;
                    ghosts.forEach(g => g.vulnerable = false);
                }
            }
        }
    });
}

// Drawing functions
function drawMaze() {
    ctx.fillStyle = '#0000FF'; // Blue walls
    ctx.strokeStyle = '#FFFFFF'; // White borders
    ctx.lineWidth = 1;
    
    for (let y = 0; y < MAZE_HEIGHT; y++) {
        for (let x = 0; x < MAZE_WIDTH; x++) {
            if (maze[y][x] === 1) {
                ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                ctx.strokeRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            }
        }
    }
}

function drawDots() {
    ctx.fillStyle = '#FFFF00'; // Yellow dots
    
    // Draw regular dots
    dots.forEach(dot => {
        const centerX = dot.x * CELL_SIZE + CELL_SIZE / 2;
        const centerY = dot.y * CELL_SIZE + CELL_SIZE / 2;
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // Draw power pellets
    powerPellets.forEach(pellet => {
        const centerX = pellet.x * CELL_SIZE + CELL_SIZE / 2;
        const centerY = pellet.y * CELL_SIZE + CELL_SIZE / 2;
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
        ctx.fill();
    });
}

function drawPacman() {
    const centerX = pacman.x * CELL_SIZE + CELL_SIZE / 2;
    const centerY = pacman.y * CELL_SIZE + CELL_SIZE / 2;
    const radius = CELL_SIZE / 2 - 2;
    
    ctx.fillStyle = '#FFFF00'; // Yellow
    ctx.beginPath();
    
    // Draw Pac-Man with mouth
    const mouthAngle = Math.PI / 3;
    const startAngle = (pacman.direction * Math.PI / 2) - mouthAngle / 2;
    const endAngle = (pacman.direction * Math.PI / 2) + mouthAngle / 2;
    
    ctx.arc(centerX, centerY, radius, endAngle, startAngle);
    ctx.lineTo(centerX, centerY);
    ctx.fill();
}

function drawGhosts() {
    ghosts.forEach(ghost => {
        const centerX = ghost.x * CELL_SIZE + CELL_SIZE / 2;
        const centerY = ghost.y * CELL_SIZE + CELL_SIZE / 2;
        const radius = CELL_SIZE / 2 - 2;
        
        // Ghost color (blue if vulnerable)
        if (ghost.vulnerable && powerMode) {
            ctx.fillStyle = '#0000FF';
        } else {
            ctx.fillStyle = ghost.color;
        }
        
        // Draw ghost body
        ctx.beginPath();
        ctx.arc(centerX, centerY - radius / 2, radius, Math.PI, 0);
        ctx.lineTo(centerX + radius, centerY + radius);
        ctx.lineTo(centerX + radius * 0.5, centerY + radius * 0.7);
        ctx.lineTo(centerX, centerY + radius);
        ctx.lineTo(centerX - radius * 0.5, centerY + radius * 0.7);
        ctx.lineTo(centerX - radius, centerY + radius);
        ctx.closePath();
        ctx.fill();
        
        // Draw eyes
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(centerX - radius * 0.3, centerY - radius * 0.3, radius * 0.2, 0, Math.PI * 2);
        ctx.arc(centerX + radius * 0.3, centerY - radius * 0.3, radius * 0.2, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw pupils
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(centerX - radius * 0.3, centerY - radius * 0.3, radius * 0.1, 0, Math.PI * 2);
        ctx.arc(centerX + radius * 0.3, centerY - radius * 0.3, radius * 0.1, 0, Math.PI * 2);
        ctx.fill();
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

// Game loop
function gameLoop() {
    if (gameRunning) {
        // Move Pac-Man every 8 frames
        if (animationFrame % 8 === 0) {
            movePacman();
        }
        
        // Move ghosts every 12 frames (slower)
        if (animationFrame % 12 === 0) {
            moveGhosts();
        }
        
        checkCollision();
    }
    
    draw();
    animationFrame++;
    requestAnimationFrame(gameLoop);
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

// Restart function
function restartGame() {
    score = 0;
    lives = 3;
    powerMode = false;
    powerModeTimer = 0;
    animationFrame = 0;
    
    // Reset positions
    pacman.x = 13;
    pacman.y = 15;
    pacman.direction = 0;
    pacman.nextDirection = 0;
    
    ghosts[0].x = 11; ghosts[0].y = 9; ghosts[0].vulnerable = false;
    ghosts[1].x = 13; ghosts[1].y = 9; ghosts[1].vulnerable = false;
    ghosts[2].x = 15; ghosts[2].y = 9; ghosts[2].vulnerable = false;
    
    // Reinitialize dots
    initializeDots();
    
    // Update UI
    scoreElement.textContent = `Score: ${score}`;
    livesElement.textContent = `Lives: ${lives}`;
    messageElement.textContent = '';
    messageElement.style.color = '';
    messageElement.style.fontSize = '';
    
    gameRunning = true;
}

// Start game when page loads
window.addEventListener('load', () => {
    console.log('Simple Pac-Man: Page loaded, starting game...');
    initGame();
});
