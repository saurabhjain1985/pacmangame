// Multiplication Master - JavaScript Game Logic

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
        
        // Learning mode variables
        this.learnPosition = 0;
        this.learnEquations = [];
        
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
        
        // Speech synthesis and recognition
        this.speechSynth = window.speechSynthesis;
        this.recognition = null;
        this.isListening = false;
        
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
                const result = event.results[0][0].transcript;
                this.handleVoiceResult(result);
            };
            
            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.stopListening();
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
                result: this.currentTable * i
            });
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
        document.getElementById('currentTable').textContent = table;
        
        // Update UI
        document.querySelectorAll('.table-card').forEach(card => {
            card.classList.remove('selected');
        });
        document.querySelector(`[data-table="${table}"]`).classList.add('selected');
        
        document.getElementById('startBtn').disabled = false;
        this.generateLearnEquations();
    }
    
    startLearning() {
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
    
    // Learn Mode
    startLearnMode() {
        document.getElementById('learnScreen').style.display = 'flex';
        document.getElementById('learnTableNumber').textContent = this.currentTable;
        this.learnPosition = 0;
        this.updateLearnDisplay();
    }
    
    updateLearnDisplay() {
        const equation = this.learnEquations[this.learnPosition];
        const equationText = `${equation.multiplicand} × ${equation.multiplier} = ${equation.result}`;
        
        document.getElementById('learnEquation').textContent = equationText;
        document.getElementById('learnProgress').textContent = `${this.learnPosition + 1} of 10`;
        
        // Update progress dots
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.classList.remove('active', 'completed');
            if (index < this.learnPosition) {
                dot.classList.add('completed');
            } else if (index === this.learnPosition) {
                dot.classList.add('active');
            }
        });
        
        // Show practice button if completed
        if (this.learnPosition === 9) {
            document.getElementById('practiceBtn').style.display = 'inline-block';
        }
    }
    
    playEquation() {
        const equation = this.learnEquations[this.learnPosition];
        const text = `${equation.multiplicand} times ${equation.multiplier} equals ${equation.result}`;
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.8;
        utterance.pitch = 1.0;
        
        this.speechSynth.speak(utterance);
    }
    
    startRecording() {
        if (!this.recognition) {
            alert('Speech recognition is not supported in your browser.');
            return;
        }
        
        if (this.isListening) {
            this.stopListening();
            return;
        }
        
        this.isListening = true;
        document.getElementById('recordBtn').textContent = '⏹️ Stop';
        document.getElementById('recordBtn').style.background = '#ef4444';
        
        try {
            this.recognition.start();
        } catch (error) {
            console.error('Failed to start recognition:', error);
            this.stopListening();
        }
    }
    
    stopListening() {
        this.isListening = false;
        document.getElementById('recordBtn').textContent = '🎤 Repeat';
        document.getElementById('recordBtn').style.background = '#6366f1';
        
        if (this.recognition) {
            this.recognition.stop();
        }
    }
    
    handleVoiceResult(result) {
        const equation = this.learnEquations[this.learnPosition];
        const expectedText = `${equation.multiplicand} times ${equation.multiplier} equals ${equation.result}`;
        
        // Simple check if the result contains the key numbers
        if (result.includes(equation.multiplicand.toString()) && 
            result.includes(equation.multiplier.toString()) && 
            result.includes(equation.result.toString())) {
            this.showFeedback('Great job! You said it correctly! 🎉', 'success');
        } else {
            this.showFeedback(`Try again! Say: "${expectedText}"`, 'info');
        }
    }
    
    nextEquation() {
        if (this.learnPosition < 9) {
            this.learnPosition++;
            this.updateLearnDisplay();
        }
    }
    
    previousEquation() {
        if (this.learnPosition > 0) {
            this.learnPosition--;
            this.updateLearnDisplay();
        }
    }
    
    startPractice() {
        this.currentMode = 'practice';
        this.startPracticeMode();
    }
    
    // Practice Mode
    startPracticeMode() {
        this.hideAllScreens();
        document.getElementById('practiceScreen').style.display = 'flex';
        
        this.generatePracticeQuestions();
        this.currentQuestion = 0;
        this.practiceAnswered = false;
        this.updatePracticeDisplay();
    }
    
    generatePracticeQuestions() {
        this.practiceQuestions = [];
        
        // Generate 10 random questions from the selected table
        for (let i = 0; i < 10; i++) {
            const multiplier = Math.floor(Math.random() * 10) + 1;
            this.practiceQuestions.push({
                multiplicand: this.currentTable,
                multiplier: multiplier,
                result: this.currentTable * multiplier,
                answered: false,
                correct: false
            });
        }
    }
    
    updatePracticeDisplay() {
        const question = this.practiceQuestions[this.currentQuestion];
        const questionText = `What is ${question.multiplicand} × ${question.multiplier}?`;
        
        document.getElementById('practiceQuestion').textContent = questionText;
        document.getElementById('questionNumber').textContent = this.currentQuestion + 1;
        document.getElementById('totalQuestions').textContent = this.practiceQuestions.length;
        
        // Clear previous feedback and inputs
        document.getElementById('feedbackArea').innerHTML = '';
        document.getElementById('answerInput').value = '';
        document.getElementById('voiceFeedback').textContent = '';
        document.getElementById('nextBtn').style.display = 'none';
        this.practiceAnswered = false;
    }
    
    playQuestion() {
        const question = this.practiceQuestions[this.currentQuestion];
        const text = `What is ${question.multiplicand} times ${question.multiplier}?`;
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.8;
        this.speechSynth.speak(utterance);
    }
    
    switchMethod(method) {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[onclick="switchMethod('${method}')"]`).classList.add('active');
        
        if (method === 'voice') {
            document.getElementById('voiceInput').style.display = 'block';
            document.getElementById('typeInput').style.display = 'none';
        } else {
            document.getElementById('voiceInput').style.display = 'none';
            document.getElementById('typeInput').style.display = 'block';
        }
    }
    
    startVoiceAnswer() {
        if (!this.recognition) {
            alert('Speech recognition is not supported in your browser.');
            return;
        }
        
        if (this.practiceAnswered) return;
        
        document.getElementById('voiceBtn').textContent = '🎤 Listening...';
        document.getElementById('voiceBtn').classList.add('recording');
        document.getElementById('voiceFeedback').textContent = 'Speak your answer now...';
        
        this.recognition.onresult = (event) => {
            const result = event.results[0][0].transcript;
            this.checkVoiceAnswer(result);
        };
        
        try {
            this.recognition.start();
        } catch (error) {
            console.error('Failed to start recognition:', error);
            this.resetVoiceButton();
        }
    }
    
    checkVoiceAnswer(voiceResult) {
        this.resetVoiceButton();
        
        const question = this.practiceQuestions[this.currentQuestion];
        
        // Extract numbers from voice result
        const numbers = voiceResult.match(/\d+/g);
        const spokenAnswer = numbers ? parseInt(numbers[numbers.length - 1]) : null;
        
        document.getElementById('voiceFeedback').textContent = `You said: "${voiceResult}"`;
        
        if (spokenAnswer === question.result) {
            this.handleCorrectAnswer();
        } else {
            this.handleWrongAnswer(spokenAnswer);
        }
    }
    
    resetVoiceButton() {
        document.getElementById('voiceBtn').textContent = '🎤 Speak Your Answer';
        document.getElementById('voiceBtn').classList.remove('recording');
    }
    
    submitAnswer() {
        if (this.practiceAnswered) return;
        
        const userAnswer = parseInt(document.getElementById('answerInput').value);
        const question = this.practiceQuestions[this.currentQuestion];
        
        if (isNaN(userAnswer)) {
            alert('Please enter a number');
            return;
        }
        
        if (userAnswer === question.result) {
            this.handleCorrectAnswer();
        } else {
            this.handleWrongAnswer(userAnswer);
        }
    }
    
    handleCorrectAnswer() {
        this.practiceAnswered = true;
        this.practiceQuestions[this.currentQuestion].answered = true;
        this.practiceQuestions[this.currentQuestion].correct = true;
        
        this.correctAnswers++;
        this.currentStreak++;
        this.totalScore += 10 + (this.currentStreak * 2);
        
        if (this.currentStreak > this.bestStreak) {
            this.bestStreak = this.currentStreak;
        }
        
        this.updateScoreDisplay();
        this.playCorrectSound();
        
        const feedback = `
            <div class="feedback correct">
                <div class="feedback-icon">🎉</div>
                <div class="feedback-text">Excellent! That's correct!</div>
                <div class="feedback-answer">+${10 + (this.currentStreak * 2)} points</div>
            </div>
        `;
        
        document.getElementById('feedbackArea').innerHTML = feedback;
        document.getElementById('nextBtn').style.display = 'inline-block';
    }
    
    handleWrongAnswer(userAnswer) {
        this.practiceAnswered = true;
        this.practiceQuestions[this.currentQuestion].answered = true;
        this.practiceQuestions[this.currentQuestion].correct = false;
        
        this.wrongAnswers++;
        this.currentStreak = 0;
        
        this.updateScoreDisplay();
        this.playWrongSound();
        
        const question = this.practiceQuestions[this.currentQuestion];
        const feedback = `
            <div class="feedback wrong">
                <div class="feedback-icon">💭</div>
                <div class="feedback-text">Not quite right!</div>
                <div class="feedback-answer">The correct answer is ${question.result}</div>
            </div>
        `;
        
        document.getElementById('feedbackArea').innerHTML = feedback;
        document.getElementById('nextBtn').style.display = 'inline-block';
    }
    
    nextQuestion() {
        if (this.currentQuestion < this.practiceQuestions.length - 1) {
            this.currentQuestion++;
            this.updatePracticeDisplay();
        } else {
            this.showResults();
        }
    }
    
    skipQuestion() {
        this.practiceQuestions[this.currentQuestion].answered = true;
        this.practiceQuestions[this.currentQuestion].correct = false;
        this.wrongAnswers++;
        this.currentStreak = 0;
        this.updateScoreDisplay();
        this.nextQuestion();
    }
    
    // Challenge Mode
    startChallengeMode() {
        this.hideAllScreens();
        document.getElementById('challengeScreen').style.display = 'flex';
        
        this.challengeLevel = 1;
        this.timeLeft = 30;
        this.livesLeft = 3;
        this.comboCount = 0;
        
        this.updateChallengeDisplay();
        this.generateChallengeQuestion();
        this.startChallengeTimer();
    }
    
    updateChallengeDisplay() {
        document.getElementById('timeLeft').textContent = this.timeLeft;
        document.getElementById('livesLeft').textContent = '❤️'.repeat(this.livesLeft);
        document.getElementById('comboCount').textContent = this.comboCount;
        document.getElementById('challengeLevel').textContent = this.challengeLevel;
        
        const progress = ((30 - this.timeLeft) / 30) * 100;
        document.getElementById('challengeProgress').style.width = `${progress}%`;
    }
    
    generateChallengeQuestion() {
        // Mix different tables based on level
        const tables = this.challengeLevel === 1 ? [2, 3, 4, 5] :
                      this.challengeLevel === 2 ? [2, 3, 4, 5, 6, 7] :
                      [2, 3, 4, 5, 6, 7, 8, 9, 12];
        
        const table = tables[Math.floor(Math.random() * tables.length)];
        const multiplier = Math.floor(Math.random() * 10) + 1;
        const correctAnswer = table * multiplier;
        
        // Generate wrong answers
        const wrongAnswers = [];
        while (wrongAnswers.length < 3) {
            const wrong = correctAnswer + Math.floor(Math.random() * 20) - 10;
            if (wrong > 0 && wrong !== correctAnswer && !wrongAnswers.includes(wrong)) {
                wrongAnswers.push(wrong);
            }
        }
        
        // Mix all options
        const allOptions = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);
        
        document.getElementById('challengeQuestion').textContent = `${table} × ${multiplier} = ?`;
        
        const optionsContainer = document.getElementById('answerOptions');
        optionsContainer.innerHTML = '';
        
        allOptions.forEach(option => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.textContent = option;
            button.onclick = () => this.selectOption(button, option, correctAnswer);
            optionsContainer.appendChild(button);
        });
        
        this.currentCorrectAnswer = correctAnswer;
    }
    
    selectOption(button, selectedAnswer, correctAnswer) {
        // Disable all buttons
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.disabled = true;
        });
        
        if (selectedAnswer === correctAnswer) {
            button.classList.add('correct');
            this.handleChallengeCorrect();
        } else {
            button.classList.add('wrong');
            // Show correct answer
            document.querySelectorAll('.option-btn').forEach(btn => {
                if (parseInt(btn.textContent) === correctAnswer) {
                    btn.classList.add('correct');
                }
            });
            this.handleChallengeWrong();
        }
        
        setTimeout(() => {
            if (this.livesLeft > 0 && this.timeLeft > 0) {
                this.generateChallengeQuestion();
            }
        }, 1500);
    }
    
    handleChallengeCorrect() {
        this.comboCount++;
        this.totalScore += 20 + (this.comboCount * 5);
        this.correctAnswers++;
        
        if (this.comboCount >= 5) {
            this.challengeLevel++;
            this.comboCount = 0;
            this.timeLeft += 10; // Bonus time
        }
        
        this.updateScoreDisplay();
        this.updateChallengeDisplay();
        this.playCorrectSound();
    }
    
    handleChallengeWrong() {
        this.livesLeft--;
        this.comboCount = 0;
        this.wrongAnswers++;
        
        this.updateChallengeDisplay();
        this.playWrongSound();
        
        if (this.livesLeft === 0) {
            this.endChallenge();
        }
    }
    
    startChallengeTimer() {
        this.challengeTimer = setInterval(() => {
            this.timeLeft--;
            this.updateChallengeDisplay();
            
            if (this.timeLeft === 0) {
                this.endChallenge();
            }
        }, 1000);
    }
    
    endChallenge() {
        if (this.challengeTimer) {
            clearInterval(this.challengeTimer);
        }
        this.showResults();
    }
    
    // Results and Scoring
    showResults() {
        this.hideAllScreens();
        document.getElementById('resultsScreen').style.display = 'flex';
        
        const accuracy = this.correctAnswers + this.wrongAnswers > 0 ? 
                        Math.round((this.correctAnswers / (this.correctAnswers + this.wrongAnswers)) * 100) : 0;
        
        document.getElementById('finalScore').textContent = this.totalScore;
        document.getElementById('correctAnswers').textContent = this.correctAnswers;
        document.getElementById('wrongAnswers').textContent = this.wrongAnswers;
        document.getElementById('accuracy').textContent = `${accuracy}%`;
        document.getElementById('bestStreak').textContent = this.bestStreak;
        
        this.showAchievements();
    }
    
    showAchievements() {
        const achievements = [];
        
        if (this.correctAnswers >= 10) achievements.push({icon: '🎯', text: 'Perfect Practice - 10 correct answers!'});
        if (this.bestStreak >= 5) achievements.push({icon: '🔥', text: 'Hot Streak - 5 in a row!'});
        if (this.totalScore >= 500) achievements.push({icon: '⭐', text: 'Star Player - 500+ points!'});
        if (this.correctAnswers > 0 && this.wrongAnswers === 0) achievements.push({icon: '💎', text: 'Flawless Victory!'});
        
        const achievementsContainer = document.getElementById('achievements');
        achievementsContainer.innerHTML = '';
        
        achievements.forEach(achievement => {
            const achievementDiv = document.createElement('div');
            achievementDiv.className = 'achievement';
            achievementDiv.innerHTML = `
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-text">${achievement.text}</div>
            `;
            achievementsContainer.appendChild(achievementDiv);
        });
    }
    
    updateScoreDisplay() {
        document.getElementById('totalScore').textContent = this.totalScore;
        document.getElementById('currentStreak').textContent = this.currentStreak;
        
        // Update progress bar (example based on score)
        const progress = Math.min((this.totalScore / 1000) * 100, 100);
        document.getElementById('progressFill').style.width = `${progress}%`;
    }
    
    // Audio feedback
    playCorrectSound() {
        const audio = document.getElementById('correctSound');
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(e => console.log('Audio play failed:', e));
        }
    }
    
    playWrongSound() {
        const audio = document.getElementById('wrongSound');
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(e => console.log('Audio play failed:', e));
        }
    }
    
    // Utility methods
    hideAllScreens() {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.style.display = 'none';
        });
    }
    
    showModeScreen() {
        this.hideAllScreens();
        document.getElementById('modeScreen').style.display = 'flex';
        this.resetGame();
    }
    
    playAgain() {
        this.resetStats();
        this.startLearning();
    }
    
    nextLevel() {
        this.currentLevel++;
        document.getElementById('currentLevel').textContent = this.currentLevel;
        this.resetStats();
        this.hideAllScreens();
        document.getElementById('tableScreen').style.display = 'flex';
    }
    
    resetGame() {
        this.resetStats();
        this.currentTable = 2;
        this.currentLevel = 1;
        document.getElementById('currentTable').textContent = this.currentTable;
        document.getElementById('currentLevel').textContent = this.currentLevel;
    }
    
    resetStats() {
        this.correctAnswers = 0;
        this.wrongAnswers = 0;
        this.currentStreak = 0;
        this.updateScoreDisplay();
    }
    
    showFeedback(message, type) {
        // Create a temporary feedback element
        const feedback = document.createElement('div');
        feedback.className = `feedback ${type}`;
        feedback.innerHTML = `<div class="feedback-text">${message}</div>`;
        feedback.style.position = 'fixed';
        feedback.style.top = '50%';
        feedback.style.left = '50%';
        feedback.style.transform = 'translate(-50%, -50%)';
        feedback.style.zIndex = '1000';
        
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            feedback.remove();
        }, 3000);
    }
}

// Global game instance
let game;

// Global functions for HTML onclick handlers
function startMode(mode) {
    game.startMode(mode);
}

function selectTable(table) {
    game.selectTable(table);
}

function startLearning() {
    game.startLearning();
}

function showModeScreen() {
    game.showModeScreen();
}

function playEquation() {
    game.playEquation();
}

function startRecording() {
    game.startRecording();
}

function nextEquation() {
    game.nextEquation();
}

function previousEquation() {
    game.previousEquation();
}

function startPractice() {
    game.startPractice();
}

function playQuestion() {
    game.playQuestion();
}

function switchMethod(method) {
    game.switchMethod(method);
}

function startVoiceAnswer() {
    game.startVoiceAnswer();
}

function submitAnswer() {
    game.submitAnswer();
}

function nextQuestion() {
    game.nextQuestion();
}

function skipQuestion() {
    game.skipQuestion();
}

function selectOption(button, selectedAnswer) {
    // The correct answer is stored in the game instance
    game.selectOption(button, selectedAnswer, game.currentCorrectAnswer);
}

function playAgain() {
    game.playAgain();
}

function nextLevel() {
    game.nextLevel();
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    game = new MultiplicationMaster();
    console.log('Multiplication Master initialized!');
    
    // Add Enter key support for typed answers
    document.getElementById('answerInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            submitAnswer();
        }
    });
});
