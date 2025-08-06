// Multiplication Master - Enhanced Voice Learning System

class MultiplicationMaster {
    constructor() {
        this.currentMode = null;
        this.currentTable = 2;
        this.currentLevel = 1;
        this.totalScore = 0;
        this.currentStreak = 0;
        this.bestStreak = 0;
        this.correctAnswers = 0;
        this.wrongAnswers = 0;
        
        // Enhanced Learning mode variables
        this.learnPosition = 0;
        this.learnEquations = [];
        this.isLearningPhase = true; // true = computer speaks, false = user repeats
        this.currentLearningStep = 0;
        
        // Practice mode variables
        this.practiceQuestions = [];
        this.currentQuestion = 0;
        this.practiceAnswered = false;
        
        // Challenge mode variables
        this.challengeLevel = 1;
        this.timeLeft = 30;
        this.livesLeft = 3;
        this.comboCount = 0;
        this.challengeTimer = null;
        
        // Enhanced Speech synthesis and recognition
        this.speechSynth = window.speechSynthesis;
        this.recognition = null;
        this.isListening = false;
        this.voiceSettings = {
            rate: 0.8,
            pitch: 1.0,
            volume: 1.0
        };
        
        this.initializeSpeech();
        this.generateLearnEquations();
    }
    
    initializeSpeech() {
        // Initialize speech recognition if available
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';
            
            this.recognition.onresult = (event) => {
                const result = event.results[0][0].transcript.toLowerCase();
                this.handleVoiceResult(result);
            };
            
            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.stopListening();
                this.showMessage('Voice recognition error. Please try again.', 'error');
            };
            
            this.recognition.onend = () => {
                this.stopListening();
            };
        }
    }
    
    generateLearnEquations() {
        this.learnEquations = [];
        for (let i = 1; i <= 10; i++) {
            this.learnEquations.push({
                multiplicand: this.currentTable,
                multiplier: i,
                result: this.currentTable * i,
                spoken: false
            });
        }
    }
    
    // Enhanced voice synthesis with better settings
    speak(text, callback = null) {
        // Cancel any ongoing speech
        this.speechSynth.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = this.voiceSettings.rate;
        utterance.pitch = this.voiceSettings.pitch;
        utterance.volume = this.voiceSettings.volume;
        
        // Try to use a female voice for better learning experience
        const voices = this.speechSynth.getVoices();
        const preferredVoice = voices.find(voice => 
            voice.name.toLowerCase().includes('female') || 
            voice.name.toLowerCase().includes('woman') ||
            voice.name.toLowerCase().includes('samantha') ||
            voice.lang.startsWith('en')
        );
        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }
        
        if (callback) {
            utterance.onend = callback;
        }
        
        this.speechSynth.speak(utterance);
    }
    
    // Enhanced learning flow - computer speaks full table, then tests user
    startLearnMode() {
        this.hideAllScreens();
        document.getElementById('learnScreen').style.display = 'flex';
        
        this.isLearningPhase = true;
        this.currentLearningStep = 0;
        this.showMessage('🎧 Listen carefully! I will recite the entire multiplication table first.', 'info');
        
        // Update UI
        this.updateLearnDisplay();
        
        // Start the learning sequence after a brief pause
        setTimeout(() => {
            this.speakFullTable();
        }, 2000);
    }
    
    speakFullTable() {
        this.showMessage('🔊 Learning Phase: Listen to the full table', 'info');
        this.speakNextEquation();
    }
    
    speakNextEquation() {
        if (this.currentLearningStep >= this.learnEquations.length) {
            // Finished speaking all equations, now start testing phase
            this.startTestingPhase();
            return;
        }
        
        const equation = this.learnEquations[this.currentLearningStep];
        const text = `${equation.multiplicand} times ${equation.multiplier} equals ${equation.result}`;
        
        // Update display
        this.updateLearnDisplay();
        this.highlightCurrentEquation();
        
        // Speak the equation
        this.speak(text, () => {
            // Mark as spoken and move to next
            equation.spoken = true;
            this.currentLearningStep++;
            
            // Wait a bit before next equation
            setTimeout(() => {
                this.speakNextEquation();
            }, 1500);
        });
    }
    
    startTestingPhase() {
        this.isLearningPhase = false;
        this.currentLearningStep = 0;
        
        this.showMessage('🎯 Testing Phase: Now repeat after me!', 'success');
        
        setTimeout(() => {
            this.testNextEquation();
        }, 2000);
    }
    
    testNextEquation() {
        if (this.currentLearningStep >= this.learnEquations.length) {
            // Completed all tests
            this.completeLearningSession();
            return;
        }
        
        const equation = this.learnEquations[this.currentLearningStep];
        const promptText = `${equation.multiplicand} times ${equation.multiplier} equals`;
        
        // Update display
        this.updateLearnDisplay();
        this.highlightCurrentEquation();
        
        // Show what user needs to say
        this.showMessage(`🎤 Say the answer when you hear: "${promptText}"`, 'info');
        
        // Speak the prompt
        this.speak(promptText, () => {
            // Start listening for user response
            this.startListening();
            this.showMessage('🔴 Listening... Say the answer now!', 'warning');
        });
    }
    
    handleVoiceResult(result) {
        const equation = this.learnEquations[this.currentLearningStep];
        const expectedAnswer = equation.result.toString();
        
        // Extract numbers from the speech result
        const numbers = result.match(/\d+/g);
        const userAnswer = numbers ? numbers[0] : null;
        
        console.log('Voice result:', result, 'Expected:', expectedAnswer, 'User said:', userAnswer);
        
        if (userAnswer === expectedAnswer) {
            // Correct answer
            this.showMessage(`✅ Correct! ${equation.multiplicand} × ${equation.multiplier} = ${equation.result}`, 'success');
            this.totalScore += 10;
            this.currentStreak++;
            this.correctAnswers++;
            
            // Move to next equation after feedback
            setTimeout(() => {
                this.currentLearningStep++;
                this.testNextEquation();
            }, 2000);
            
        } else {
            // Incorrect or unclear answer
            this.showMessage(`❌ Not quite. The answer is ${equation.result}. Let's try again.`, 'error');
            this.currentStreak = 0;
            this.wrongAnswers++;
            
            // Repeat the same equation
            setTimeout(() => {
                this.testNextEquation();
            }, 3000);
        }
        
        this.updateStats();
    }
    
    startListening() {
        if (this.recognition && !this.isListening) {
            this.isListening = true;
            this.recognition.start();
            
            // Auto-stop listening after 10 seconds
            setTimeout(() => {
                if (this.isListening) {
                    this.stopListening();
                    this.showMessage('⏰ Time up! Let me repeat the question.', 'warning');
                    setTimeout(() => {
                        this.testNextEquation();
                    }, 2000);
                }
            }, 10000);
        }
    }
    
    stopListening() {
        if (this.recognition && this.isListening) {
            this.isListening = false;
            this.recognition.stop();
        }
    }
    
    completeLearningSession() {
        this.showMessage(`🎉 Excellent! You completed the ${this.currentTable} times table!`, 'success');
        
        // Show final stats
        const accuracy = Math.round((this.correctAnswers / (this.correctAnswers + this.wrongAnswers)) * 100) || 0;
        
        setTimeout(() => {
            this.showMessage(`📊 Final Score: ${this.totalScore} | Accuracy: ${accuracy}% | Best Streak: ${this.currentStreak}`, 'info');
        }, 2000);
        
        // Offer to try another table
        setTimeout(() => {
            if (confirm('Would you like to try another multiplication table?')) {
                this.hideAllScreens();
                document.getElementById('tableScreen').style.display = 'flex';
            } else {
                this.hideAllScreens();
                document.getElementById('modeScreen').style.display = 'flex';
            }
        }, 4000);
    }
    
    updateLearnDisplay() {
        const container = document.getElementById('learnContent');
        if (!container) return;
        
        let html = '<div class="learn-equations">';
        
        this.learnEquations.forEach((eq, index) => {
            const isActive = index === this.currentLearningStep;
            const isCompleted = this.isLearningPhase ? eq.spoken : index < this.currentLearningStep;
            
            let statusClass = '';
            if (isCompleted) statusClass = 'completed';
            else if (isActive) statusClass = 'active';
            
            html += `
                <div class="equation-item ${statusClass}">
                    <span class="equation-text">
                        ${eq.multiplicand} × ${eq.multiplier} = ${eq.result}
                    </span>
                    <span class="equation-status">
                        ${isCompleted ? '✅' : isActive ? (this.isLearningPhase ? '🔊' : '🎤') : '⏳'}
                    </span>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
    }
    
    highlightCurrentEquation() {
        const equations = document.querySelectorAll('.equation-item');
        equations.forEach((eq, index) => {
            eq.classList.remove('active');
            if (index === this.currentLearningStep) {
                eq.classList.add('active');
                eq.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }
    
    showMessage(text, type = 'info') {
        const messageElement = document.getElementById('learnMessage');
        if (messageElement) {
            messageElement.textContent = text;
            messageElement.className = `learn-message ${type}`;
            
            // Auto-hide after 5 seconds unless it's an error or important info
            if (type !== 'error' && type !== 'warning') {
                setTimeout(() => {
                    if (messageElement.textContent === text) {
                        messageElement.textContent = '';
                        messageElement.className = 'learn-message';
                    }
                }, 5000);
            }
        }
    }
    
    updateStats() {
        const totalScore = document.getElementById('totalScore');
        const currentStreak = document.getElementById('currentStreak');
        
        if (totalScore) totalScore.textContent = this.totalScore;
        if (currentStreak) currentStreak.textContent = this.currentStreak;
        
        if (this.currentStreak > this.bestStreak) {
            this.bestStreak = this.currentStreak;
        }
    }
    
    // Mode Management
    startMode(mode) {
        this.currentMode = mode;
        this.hideAllScreens();
        document.getElementById('tableScreen').style.display = 'flex';
    }
    
    selectTable(table) {
        this.currentTable = table;
        const currentTableEl = document.getElementById('currentTable');
        if (currentTableEl) currentTableEl.textContent = table;
        
        // Update UI
        document.querySelectorAll('.table-card').forEach(card => {
            card.classList.remove('selected');
        });
        const selectedCard = document.querySelector(`[data-table="${table}"]`);
        if (selectedCard) selectedCard.classList.add('selected');
        
        const startBtn = document.getElementById('startBtn');
        if (startBtn) startBtn.disabled = false;
        
        this.generateLearnEquations();
    }
    
    startLearning() {
        // Reset stats for new session
        this.totalScore = 0;
        this.currentStreak = 0;
        this.correctAnswers = 0;
        this.wrongAnswers = 0;
        this.updateStats();
        
        this.hideAllScreens();
        
        switch (this.currentMode) {
            case 'learn':
                this.startLearnMode();
                break;
            case 'practice':
                this.startPracticeMode();
                break;
            case 'challenge':
                this.startChallengeMode();
                break;
        }
    }
    
    // Placeholder methods for other modes
    startPracticeMode() {
        alert('Practice mode coming soon!');
        this.goToModeSelection();
    }
    
    startChallengeMode() {
        alert('Challenge mode coming soon!');
        this.goToModeSelection();
    }
    
    // Utility methods
    hideAllScreens() {
        const screens = ['modeScreen', 'tableScreen', 'learnScreen', 'practiceScreen', 'challengeScreen'];
        screens.forEach(screenId => {
            const screen = document.getElementById(screenId);
            if (screen) screen.style.display = 'none';
        });
    }
    
    goToModeSelection() {
        this.hideAllScreens();
        document.getElementById('modeScreen').style.display = 'flex';
        
        // Stop any ongoing speech or recognition
        this.speechSynth.cancel();
        this.stopListening();
    }
    
    goToTableSelection() {
        this.hideAllScreens();
        document.getElementById('tableScreen').style.display = 'flex';
    }
}

// Initialize the game
let game;

document.addEventListener('DOMContentLoaded', function() {
    console.log('🧮 Multiplication Master loading...');
    game = new MultiplicationMaster();
    
    // Wait for voices to load
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => {
            console.log('✅ Speech synthesis voices loaded');
        };
    }
    
    console.log('✅ Multiplication Master initialized');
});

// Global functions for HTML onclick handlers
function startMode(mode) {
    if (game) game.startMode(mode);
}

function selectTable(table) {
    if (game) game.selectTable(table);
}

function startLearning() {
    if (game) game.startLearning();
}

function goToModeSelection() {
    if (game) game.goToModeSelection();
}

function goToTableSelection() {
    if (game) game.goToTableSelection();
}
