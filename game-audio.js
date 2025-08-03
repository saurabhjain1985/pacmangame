// Sound and Haptic Feedback System
class GameAudioManager {
    constructor() {
        this.sounds = {};
        this.isEnabled = localStorage.getItem('gameAudioEnabled') !== 'false';
        this.volume = parseFloat(localStorage.getItem('gameAudioVolume') || '0.3');
        this.hapticEnabled = localStorage.getItem('gameHapticEnabled') !== 'false';
        
        this.init();
    }

    init() {
        this.createSounds();
        this.addAudioControls();
    }

    createSounds() {
        // Create audio using Web Audio API for better control
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Sound definitions with frequencies and patterns
        this.soundPatterns = {
            collect: { frequency: 800, duration: 0.1, type: 'sine' }, // Dot collection
            powerUp: { frequency: 400, duration: 0.3, type: 'sawtooth' }, // Power pellet
            gameOver: { frequency: 200, duration: 0.8, type: 'triangle' }, // Game over
            levelComplete: { frequency: 600, duration: 0.5, type: 'square' }, // Level complete
            ghost: { frequency: 150, duration: 0.2, type: 'sawtooth' }, // Ghost eaten
            achievement: { frequency: 1000, duration: 0.4, type: 'sine' }, // Achievement/high score
            button: { frequency: 500, duration: 0.05, type: 'sine' }, // Button click
            error: { frequency: 300, duration: 0.15, type: 'triangle' }, // Error/invalid move
            success: { frequency: 700, duration: 0.2, type: 'sine' }, // Success/correct answer
            notification: { frequency: 450, duration: 0.15, type: 'sine' } // General notification
        };
    }

    playSound(soundName, customFreq = null, customDuration = null) {
        if (!this.isEnabled || !this.audioContext) return;

        try {
            const pattern = this.soundPatterns[soundName];
            if (!pattern) return;

            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(
                customFreq || pattern.frequency, 
                this.audioContext.currentTime
            );
            oscillator.type = pattern.type;
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.volume, this.audioContext.currentTime + 0.01);
            gainNode.gain.linearRampToValueAtTime(
                0, 
                this.audioContext.currentTime + (customDuration || pattern.duration)
            );
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + (customDuration || pattern.duration));
            
        } catch (error) {
            console.warn('Audio playback failed:', error);
        }
    }

    playMelody(notes, tempo = 200) {
        if (!this.isEnabled) return;

        let delay = 0;
        notes.forEach((note, index) => {
            setTimeout(() => {
                this.playSound('achievement', note.frequency, note.duration);
            }, delay);
            delay += tempo;
        });
    }

    // Haptic feedback for mobile devices
    vibrate(pattern = [50]) {
        if (!this.hapticEnabled) return;
        
        if ('vibrate' in navigator) {
            navigator.vibrate(pattern);
        }
    }

    // Different vibration patterns for different events
    hapticFeedback(type) {
        if (!this.hapticEnabled) return;

        const patterns = {
            light: [30],           // Light tap for button press
            success: [50, 30, 50], // Double tap for success
            error: [100],          // Long vibration for error
            collect: [20],         // Very light for collecting items
            powerUp: [100, 50, 100, 50, 100], // Pattern for power-up
            gameOver: [200, 100, 200] // Strong pattern for game over
        };

        this.vibrate(patterns[type] || patterns.light);
    }

    addAudioControls() {
        // Add audio control panel to games
        const controlsHTML = `
            <div class="audio-controls" id="audioControls">
                <button class="audio-toggle" id="audioToggle" title="Toggle Sound">
                    ${this.isEnabled ? '🔊' : '🔇'}
                </button>
                <input type="range" class="volume-slider" id="volumeSlider" 
                       min="0" max="1" step="0.1" value="${this.volume}" 
                       title="Volume">
                <button class="haptic-toggle" id="hapticToggle" title="Toggle Haptic Feedback">
                    ${this.hapticEnabled ? '📳' : '📴'}
                </button>
            </div>
        `;

        // Add controls to page if not already present
        if (!document.getElementById('audioControls')) {
            document.body.insertAdjacentHTML('beforeend', controlsHTML);
            
            // Add CSS for controls
            this.addControlStyles();
            
            // Add event listeners
            this.setupControlListeners();
        }
    }

    addControlStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .audio-controls {
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(0, 0, 0, 0.8);
                border-radius: 25px;
                padding: 10px 15px;
                display: flex;
                align-items: center;
                gap: 10px;
                z-index: 1000;
                backdrop-filter: blur(10px);
            }

            .audio-toggle,
            .haptic-toggle {
                background: none;
                border: none;
                font-size: 18px;
                cursor: pointer;
                padding: 5px;
                border-radius: 50%;
                transition: background 0.3s ease;
            }

            .audio-toggle:hover,
            .haptic-toggle:hover {
                background: rgba(255, 255, 255, 0.2);
            }

            .volume-slider {
                width: 60px;
                height: 4px;
                border-radius: 2px;
                background: rgba(255, 255, 255, 0.3);
                outline: none;
                cursor: pointer;
            }

            .volume-slider::-webkit-slider-thumb {
                appearance: none;
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background: white;
                cursor: pointer;
            }

            .volume-slider::-moz-range-thumb {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background: white;
                cursor: pointer;
                border: none;
            }

            @media (max-width: 768px) {
                .audio-controls {
                    top: 15px;
                    right: 15px;
                    padding: 8px 12px;
                }
                
                .audio-toggle,
                .haptic-toggle {
                    font-size: 16px;
                }
                
                .volume-slider {
                    width: 50px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    setupControlListeners() {
        const audioToggle = document.getElementById('audioToggle');
        const volumeSlider = document.getElementById('volumeSlider');
        const hapticToggle = document.getElementById('hapticToggle');

        audioToggle.addEventListener('click', () => {
            this.toggleAudio();
        });

        volumeSlider.addEventListener('input', (e) => {
            this.setVolume(parseFloat(e.target.value));
        });

        hapticToggle.addEventListener('click', () => {
            this.toggleHaptic();
        });
    }

    toggleAudio() {
        this.isEnabled = !this.isEnabled;
        localStorage.setItem('gameAudioEnabled', this.isEnabled.toString());
        
        const toggle = document.getElementById('audioToggle');
        if (toggle) {
            toggle.textContent = this.isEnabled ? '🔊' : '🔇';
        }

        // Play test sound when enabling
        if (this.isEnabled) {
            this.playSound('button');
        }
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        localStorage.setItem('gameAudioVolume', this.volume.toString());
        
        // Play test sound at new volume
        if (this.isEnabled) {
            this.playSound('button');
        }
    }

    toggleHaptic() {
        this.hapticEnabled = !this.hapticEnabled;
        localStorage.setItem('gameHapticEnabled', this.hapticEnabled.toString());
        
        const toggle = document.getElementById('hapticToggle');
        if (toggle) {
            toggle.textContent = this.hapticEnabled ? '📳' : '📴';
        }

        // Test haptic when enabling
        if (this.hapticEnabled) {
            this.hapticFeedback('light');
        }
    }

    // Context-specific sound methods for different games
    pacmanSounds = {
        eatDot: () => { this.playSound('collect'); this.hapticFeedback('collect'); },
        eatPowerPellet: () => { this.playSound('powerUp'); this.hapticFeedback('powerUp'); },
        eatGhost: () => { this.playSound('ghost'); this.hapticFeedback('success'); },
        death: () => { this.playSound('gameOver'); this.hapticFeedback('gameOver'); },
        levelUp: () => { this.playSound('levelComplete'); this.hapticFeedback('success'); }
    }

    memoryGameSounds = {
        cardFlip: () => { this.playSound('button'); this.hapticFeedback('light'); },
        match: () => { this.playSound('success'); this.hapticFeedback('success'); },
        noMatch: () => { this.playSound('error'); this.hapticFeedback('error'); },
        gameWin: () => { 
            this.playMelody([
                {frequency: 500, duration: 0.2},
                {frequency: 600, duration: 0.2},
                {frequency: 700, duration: 0.3}
            ]); 
            this.hapticFeedback('success');
        }
    }

    tetrisSounds = {
        move: () => { this.playSound('button', 400, 0.03); this.hapticFeedback('light'); },
        rotate: () => { this.playSound('button', 600, 0.05); this.hapticFeedback('light'); },
        drop: () => { this.playSound('collect', 300, 0.1); this.hapticFeedback('light'); },
        lineClear: () => { this.playSound('success'); this.hapticFeedback('success'); },
        gameOver: () => { this.playSound('gameOver'); this.hapticFeedback('gameOver'); }
    }

    mathGameSounds = {
        correct: () => { this.playSound('success'); this.hapticFeedback('success'); },
        incorrect: () => { this.playSound('error'); this.hapticFeedback('error'); },
        levelUp: () => { this.playSound('achievement'); this.hapticFeedback('success'); },
        buttonClick: () => { this.playSound('button'); this.hapticFeedback('light'); }
    }

    generalSounds = {
        buttonClick: () => { this.playSound('button'); this.hapticFeedback('light'); },
        success: () => { this.playSound('success'); this.hapticFeedback('success'); },
        error: () => { this.playSound('error'); this.hapticFeedback('error'); },
        notification: () => { this.playSound('notification'); this.hapticFeedback('light'); }
    }
}

// Global audio manager instance
let gameAudio;

// Initialize audio when page loads
document.addEventListener('DOMContentLoaded', () => {
    gameAudio = new GameAudioManager();
});

// Resume audio context on user interaction (required by browsers)
document.addEventListener('click', () => {
    if (gameAudio && gameAudio.audioContext && gameAudio.audioContext.state === 'suspended') {
        gameAudio.audioContext.resume();
    }
}, { once: true });

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameAudioManager;
}
