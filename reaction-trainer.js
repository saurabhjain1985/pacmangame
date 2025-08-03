// Reaction Trainer Game Logic
let reactionState = 'idle';
let reactionStartTime = 0;
let reactionTimes = [];
let reactionTimeout = null;

function initReactionTrainer() {
    console.log('Initializing Reaction Trainer...');
    resetReactionTrainer();
    updateReactionStats();
    
    // Ensure display element exists
    const display = document.getElementById('reaction-display');
    if (!display) {
        console.error('Reaction display element not found!');
        return;
    }
    
    console.log('Reaction Trainer initialized successfully');
}

function resetReactionTrainer() {
    reactionState = 'idle';
    const display = document.getElementById('reaction-display');
    
    if (!display) {
        console.error('Reaction display not found during reset');
        return;
    }
    
    // Clear any existing event listeners
    display.removeEventListener('click', handleReactionClick);
    display.removeEventListener('touchstart', handleReactionClick);
    
    display.className = 'reaction-display';
    display.innerHTML = `
        <h3>⚡ Reaction Speed Test</h3>
        <p>Test your lightning-fast reflexes! Tap the screen as quickly as possible when you see "GO!"</p>
        <button class="start-reaction-btn" onclick="startReaction()" style="
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            padding: 15px 30px;
            font-size: 18px;
            border-radius: 25px;
            cursor: pointer;
            margin: 20px 0;
            transition: transform 0.2s;
        ">🚀 Start Test</button>
        <p style="font-size: 0.9em; color: #666;">Click anywhere on this area when "GO!" appears</p>
    `;
    
    if (reactionTimeout) {
        clearTimeout(reactionTimeout);
        reactionTimeout = null;
    }
}

function startReaction() {
    if (reactionState !== 'idle') return;
    
    reactionState = 'waiting';
    const display = document.getElementById('reaction-display');
    display.className = 'reaction-display waiting';
    display.innerHTML = `
        <h3>Wait for it...</h3>
        <p>Get ready to tap as soon as you see "GO!"</p>
        <p style="font-size: 0.9em; color: #666;">Don't tap too early!</p>
    `;
    
    // Add click listener for the entire display with proper event handling
    display.addEventListener('click', handleReactionClick, { once: false });
    display.addEventListener('touchstart', handleReactionClick, { once: false });
    
    // Random delay between 2-6 seconds
    const delay = 2000 + Math.random() * 4000;
    
    reactionTimeout = setTimeout(() => {
        if (reactionState === 'waiting') {
            showGoSignal();
        }
    }, delay);
}

function showGoSignal() {
    console.log('Showing GO signal - changing state from waiting to go');
    reactionState = 'go';
    reactionStartTime = performance.now();
    
    const display = document.getElementById('reaction-display');
    if (!display) {
        console.error('Display not found in showGoSignal!');
        return;
    }
    
    display.className = 'reaction-display go';
    display.innerHTML = `
        <h3 style="font-size: 4em; color: #28a745; text-shadow: 0 0 20px rgba(40, 167, 69, 0.5);">GO!</h3>
        <p style="font-size: 1.5em; font-weight: bold;">TAP NOW!</p>
        <p style="font-size: 1em; opacity: 0.8;">Tap anywhere in this area</p>
    `;
    
    // Ensure event listeners are still active
    console.log('GO signal displayed, waiting for user click...');
    
    // Add visual and audio cues
    if (navigator.vibrate) {
        navigator.vibrate(100);
    }
    
    // Optional: Play sound
    playReactionSound();
}

function handleReactionClick(event) {
    // Prevent event propagation
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    if (reactionState === 'waiting') {
        // Too early!
        reactionState = 'too-early';
        clearTimeout(reactionTimeout);
        
        const display = document.getElementById('reaction-display');
        display.className = 'reaction-display too-early';
        display.innerHTML = `
            <h3>Too Early!</h3>
            <p>Wait for the "GO!" signal before tapping.</p>
            <button class="start-reaction-btn" onclick="startReaction()">Try Again</button>
        `;
        // Remove event listeners properly
        display.removeEventListener('click', handleReactionClick);
        display.removeEventListener('touchstart', handleReactionClick);
        
    } else if (reactionState === 'go') {
        // Good reaction!
        const reactionTime = performance.now() - reactionStartTime;
        recordReactionTime(reactionTime);
        
        reactionState = 'result';
        const display = document.getElementById('reaction-display');
        display.className = 'reaction-display';
        display.innerHTML = `
            <h3>Your Reaction Time</h3>
            <p style="font-size: 3em; color: #4A90E2; font-weight: bold;">${reactionTime.toFixed(0)}ms</p>
            <p>${getReactionRating(reactionTime)}</p>
            <button class="start-reaction-btn" onclick="startReaction()">Test Again</button>
        `;
        // Remove event listeners properly
        display.removeEventListener('click', handleReactionClick);
        display.removeEventListener('touchstart', handleReactionClick);
        
        updateReactionStats();
    }
}

function recordReactionTime(time) {
    reactionTimes.push(time);
    
    // Keep only last 10 results
    if (reactionTimes.length > 10) {
        reactionTimes.shift();
    }
    
    // Store in localStorage
    localStorage.setItem('reactionTimes', JSON.stringify(reactionTimes));
}

function updateReactionStats() {
    // Load from localStorage
    const stored = localStorage.getItem('reactionTimes');
    if (stored) {
        reactionTimes = JSON.parse(stored);
    }
    
    const bestElement = document.getElementById('best-reaction');
    const avgElement = document.getElementById('avg-reaction');
    const countElement = document.getElementById('reaction-count');
    
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
    if (time < 180) return '🚀 Lightning Fast!';
    if (time < 220) return '⚡ Excellent!';
    if (time < 280) return '👍 Good!';
    if (time < 350) return '👌 Average';
    if (time < 450) return '🐌 Could be better';
    return '🐌 Keep practicing!';
}

function playReactionSound() {
    // Create a simple beep sound
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
    } catch (e) {
        // Fallback: no sound
        console.log('Audio not supported');
    }
}
