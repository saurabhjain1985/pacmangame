// Reaction Trainer Game Logic - Complete Rewrite
let reactionState = 'ready';
let reactionStartTime = 0;
let reactionTimes = [];
let reactionTimeout = null;
let reactionInterval = null;

function initReactionTrainer() {
    console.log('Initializing Reaction Trainer...');
    resetReactionGame();
    loadReactionHistory();
    updateReactionStats();
    console.log('Reaction Trainer initialized successfully');
}

function resetReactionGame() {
    reactionState = 'ready';
    clearAllTimeouts();
    
    const display = document.getElementById('reaction-display');
    if (!display) {
        console.error('Reaction display element not found!');
        return;
    }
    
    // Remove all existing event listeners
    display.removeEventListener('click', handleReactionClick);
    display.removeEventListener('touchstart', handleReactionClick);
    
    display.className = 'reaction-display ready';
    display.innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <h3 style="color: #333; margin-bottom: 20px;">⚡ Reaction Speed Test</h3>
            <p style="color: #666; margin-bottom: 30px; line-height: 1.6;">
                Test your reflexes! Click "Start" then tap the screen as quickly as possible when it turns green.
            </p>
            <button onclick="startReactionTest()" style="
                background: linear-gradient(135deg, #4CAF50, #45a049);
                color: white;
                border: none;
                padding: 15px 30px;
                font-size: 18px;
                font-weight: bold;
                border-radius: 25px;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
            " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                🚀 Start Test
            </button>
            <p style="color: #888; font-size: 0.9em; margin-top: 20px;">
                Average human reaction time: 200-300ms
            </p>
        </div>
    `;
}

function startReactionTest() {
    if (reactionState !== 'ready') return;
    
    reactionState = 'waiting';
    const display = document.getElementById('reaction-display');
    
    display.className = 'reaction-display waiting';
    display.innerHTML = `
        <div style="text-align: center; padding: 60px; background: #ffd54f; border-radius: 15px;">
            <h3 style="color: #333; font-size: 2em; margin-bottom: 20px;">⏱️ Get Ready...</h3>
            <p style="color: #666; font-size: 1.2em; margin-bottom: 20px;">
                Wait for the screen to turn GREEN, then click as fast as you can!
            </p>
            <p style="color: #888; font-size: 1em;">
                Don't click too early or you'll have to restart!
            </p>
            <div style="margin-top: 30px;">
                <div style="width: 50px; height: 50px; border: 4px solid #666; border-top: 4px solid #333; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
            </div>
        </div>
    `;
    
    // Add event listener for early clicks
    display.addEventListener('click', handleEarlyClick);
    display.addEventListener('touchstart', handleEarlyClick);
    
    // Random delay between 2-5 seconds
    const delay = 2000 + Math.random() * 3000;
    
    reactionTimeout = setTimeout(() => {
        if (reactionState === 'waiting') {
            showGoSignal();
        }
    }, delay);
}

function showGoSignal() {
    reactionState = 'go';
    reactionStartTime = performance.now();
    
    const display = document.getElementById('reaction-display');
    
    // Remove early click listeners
    display.removeEventListener('click', handleEarlyClick);
    display.removeEventListener('touchstart', handleEarlyClick);
    
    display.className = 'reaction-display go';
    display.innerHTML = `
        <div style="text-align: center; padding: 80px; background: #4CAF50; border-radius: 15px; cursor: pointer;" onclick="handleReactionClick()" ontouchstart="handleReactionClick()">
            <h3 style="color: white; font-size: 4em; margin-bottom: 20px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">GO!</h3>
            <p style="color: white; font-size: 1.5em; font-weight: bold;">
                TAP NOW!
            </p>
            <p style="color: rgba(255,255,255,0.8); font-size: 1.2em; margin-top: 10px;">
                Click anywhere in this area
            </p>
        </div>
    `;
    
    // Add click listeners for the reaction
    display.addEventListener('click', handleReactionClick);
    display.addEventListener('touchstart', handleReactionClick);
    
    // Add vibration if supported
    if (navigator.vibrate) {
        navigator.vibrate(100);
    }
    
    console.log('GO signal shown, waiting for user reaction...');
}

function handleEarlyClick(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    if (reactionState !== 'waiting') return;
    
    reactionState = 'too-early';
    clearAllTimeouts();
    
    const display = document.getElementById('reaction-display');
    display.removeEventListener('click', handleEarlyClick);
    display.removeEventListener('touchstart', handleEarlyClick);
    
    display.className = 'reaction-display too-early';
    display.innerHTML = `
        <div style="text-align: center; padding: 60px; background: #f44336; border-radius: 15px;">
            <h3 style="color: white; font-size: 2.5em; margin-bottom: 20px;">⚠️ Too Early!</h3>
            <p style="color: white; font-size: 1.3em; margin-bottom: 30px;">
                Wait for the GREEN signal before clicking!
            </p>
            <button onclick="startReactionTest()" style="
                background: white;
                color: #f44336;
                border: none;
                padding: 12px 25px;
                font-size: 16px;
                font-weight: bold;
                border-radius: 20px;
                cursor: pointer;
                transition: all 0.3s ease;
            " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                Try Again
            </button>
        </div>
    `;
}

function handleReactionClick(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    if (reactionState !== 'go') return;
    
    const reactionTime = performance.now() - reactionStartTime;
    reactionState = 'result';
    
    // Remove event listeners
    const display = document.getElementById('reaction-display');
    display.removeEventListener('click', handleReactionClick);
    display.removeEventListener('touchstart', handleReactionClick);
    
    // Record the time
    recordReactionTime(reactionTime);
    
    // Show result
    const rating = getReactionRating(reactionTime);
    const color = getReactionColor(reactionTime);
    
    display.className = 'reaction-display result';
    display.innerHTML = `
        <div style="text-align: center; padding: 50px; background: white; border-radius: 15px; border: 3px solid ${color};">
            <h3 style="color: #333; margin-bottom: 20px;">Your Reaction Time</h3>
            <div style="font-size: 4em; color: ${color}; font-weight: bold; margin: 20px 0;">${reactionTime.toFixed(0)}ms</div>
            <p style="color: #666; font-size: 1.3em; margin-bottom: 30px;">${rating}</p>
            <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                <button onclick="startReactionTest()" style="
                    background: linear-gradient(135deg, #4CAF50, #45a049);
                    color: white;
                    border: none;
                    padding: 12px 25px;
                    font-size: 16px;
                    font-weight: bold;
                    border-radius: 20px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                ">Test Again</button>
                <button onclick="resetReactionGame()" style="
                    background: linear-gradient(135deg, #2196F3, #1976D2);
                    color: white;
                    border: none;
                    padding: 12px 25px;
                    font-size: 16px;
                    font-weight: bold;
                    border-radius: 20px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                ">New Session</button>
            </div>
        </div>
    `;
    
    updateReactionStats();
}

function recordReactionTime(time) {
    reactionTimes.push(time);
    
    // Keep only last 20 results
    if (reactionTimes.length > 20) {
        reactionTimes.shift();
    }
    
    // Store in localStorage
    localStorage.setItem('reactionTimes', JSON.stringify(reactionTimes));
}

function loadReactionHistory() {
    const stored = localStorage.getItem('reactionTimes');
    if (stored) {
        try {
            reactionTimes = JSON.parse(stored) || [];
        } catch (e) {
            reactionTimes = [];
        }
    }
}

function updateReactionStats() {
    const bestElement = document.getElementById('best-reaction');
    const avgElement = document.getElementById('avg-reaction');
    const countElement = document.getElementById('reaction-count');
    
    if (!bestElement || !avgElement || !countElement) {
        console.log('Stats elements not found');
        return;
    }
    
    if (reactionTimes.length === 0) {
        bestElement.textContent = '---';
        avgElement.textContent = '---';
        countElement.textContent = '0';
        return;
    }
    
    const best = Math.min(...reactionTimes);
    const average = reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length;
    
    bestElement.textContent = `${best.toFixed(0)}ms`;
    avgElement.textContent = `${average.toFixed(0)}ms`;
    countElement.textContent = reactionTimes.length.toString();
}

function getReactionRating(time) {
    if (time < 180) return '🚀 Lightning Fast! Superhuman reflexes!';
    if (time < 220) return '⚡ Excellent! Above average reflexes!';
    if (time < 280) return '👍 Good! Solid reaction time!';
    if (time < 350) return '👌 Average - Keep practicing!';
    if (time < 450) return '🐌 Below average - Try to focus more!';
    return '🐌 Slow - Practice makes perfect!';
}

function getReactionColor(time) {
    if (time < 180) return '#4CAF50';
    if (time < 220) return '#8BC34A';
    if (time < 280) return '#FFC107';
    if (time < 350) return '#FF9800';
    if (time < 450) return '#FF5722';
    return '#F44336';
}

function clearAllTimeouts() {
    if (reactionTimeout) {
        clearTimeout(reactionTimeout);
        reactionTimeout = null;
    }
    if (reactionInterval) {
        clearInterval(reactionInterval);
        reactionInterval = null;
    }
}

// Add CSS for spinning animation
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);
