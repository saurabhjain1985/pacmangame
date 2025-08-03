// Game constants
const CELL_SIZE = 20;
const MAZE_WIDTH = 28;
const MAZE_HEIGHT = 21;

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

// Maze layout (1 = wall, 0 = dot, 2 = empty space, 3 = pacman start, 4 = ghost start)
const maze = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
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
    [1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1],
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
        behavior: 'chase' // Directly chases Pac-Man
    },
    {
        x: 13,
        y: 9,
        direction: 2,
        color: '#4ECDC4',
        behavior: 'ambush' // Tries to ambush Pac-Man
    },
    {
        x: 15,
        y: 9,
        direction: 1,
        color: '#FFD93D',
        behavior: 'random' // Random movement
    }
];

// Initialize dots array
let dots = [];
function initializeDots() {
    dots = [];
    for (let y = 0; y < MAZE_HEIGHT; y++) {
        for (let x = 0; x < MAZE_WIDTH; x++) {
            if (maze[y][x] === 0) {
                dots.push({x: x, y: y});
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
                
                // Check win condition
                if (dots.length === 0) {
                    gameRunning = false;
                    messageElement.textContent = "YOU WIN!";
                    messageElement.className = "winner";
                }
                break;
            }
        }
    }
}

// Simple AI for ghosts with different behaviors
function moveGhosts() {
    ghosts.forEach((ghost, index) => {
        let bestDirection = ghost.direction;
        let validDirections = [];
        
        // Find all valid directions
        for (let i = 0; i < 4; i++) {
            const dir = directions[i];
            const newX = ghost.x + dir.x;
            const newY = ghost.y + dir.y;
            
            if (isValidPosition(newX, newY)) {
                validDirections.push({direction: i, x: newX, y: newY});
            }
        }
        
        if (validDirections.length === 0) return;
        
        // Different behavior for each ghost
        if (ghost.behavior === 'chase') {
            // Red ghost: Direct chase
            let minDistance = Infinity;
            validDirections.forEach(option => {
                const distance = Math.abs(option.x - pacman.x) + Math.abs(option.y - pacman.y);
                if (distance < minDistance) {
                    minDistance = distance;
                    bestDirection = option.direction;
                }
            });
        } else if (ghost.behavior === 'ambush') {
            // Teal ghost: Try to get in front of Pac-Man
            const targetX = pacman.x + directions[pacman.direction].x * 4;
            const targetY = pacman.y + directions[pacman.direction].y * 4;
            
            let minDistance = Infinity;
            validDirections.forEach(option => {
                const distance = Math.abs(option.x - targetX) + Math.abs(option.y - targetY);
                if (distance < minDistance) {
                    minDistance = distance;
                    bestDirection = option.direction;
                }
            });
        } else if (ghost.behavior === 'random') {
            // Yellow ghost: Random movement with slight preference toward Pac-Man
            if (Math.random() < 0.3) {
                // 30% chance to move toward Pac-Man
                let minDistance = Infinity;
                validDirections.forEach(option => {
                    const distance = Math.abs(option.x - pacman.x) + Math.abs(option.y - pacman.y);
                    if (distance < minDistance) {
                        minDistance = distance;
                        bestDirection = option.direction;
                    }
                });
            } else {
                // 70% chance to move randomly
                const randomOption = validDirections[Math.floor(Math.random() * validDirections.length)];
                bestDirection = randomOption.direction;
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

// Check collision between Pac-Man and ghosts
function checkCollision() {
    for (let ghost of ghosts) {
        if (pacman.x === ghost.x && pacman.y === ghost.y) {
            lives--;
            livesElement.textContent = `Lives: ${lives}`;
            
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
            }
            break; // Only lose one life per collision
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
    // Create gradient for dots
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
        
        // Reset shadow
        ctx.shadowBlur = 0;
    }
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
    ghosts.forEach(ghost => {
        const centerX = ghost.x * CELL_SIZE + CELL_SIZE / 2;
        const centerY = ghost.y * CELL_SIZE + CELL_SIZE / 2;
        const radius = CELL_SIZE / 2 - 2;
        
        // Create gradient for ghost based on its color
        const ghostGradient = ctx.createRadialGradient(centerX - 3, centerY - 5, 0, centerX, centerY, radius);
        
        if (ghost.color === '#FF6B6B') {
            ghostGradient.addColorStop(0, '#FF6B6B');
            ghostGradient.addColorStop(1, '#E74C3C');
        } else if (ghost.color === '#4ECDC4') {
            ghostGradient.addColorStop(0, '#4ECDC4');
            ghostGradient.addColorStop(1, '#26D0CE');
        } else if (ghost.color === '#FFD93D') {
            ghostGradient.addColorStop(0, '#FFD93D');
            ghostGradient.addColorStop(1, '#F39C12');
        }
        
        // Add glow effect
        ctx.shadowColor = ghost.color;
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
        
        // Eye pupils
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
        // Move game objects every few frames for better control
        if (animationFrame % 8 === 0) {
            movePacman();
        }
        if (animationFrame % 12 === 0) {
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

// Start the game when page loads
window.addEventListener('load', initGame);
