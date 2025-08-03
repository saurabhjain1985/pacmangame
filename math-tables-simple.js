// Math Tables Master - Simple Version
class MathTablesMaster {
    constructor() {
        this.selectedTables = [];
        this.currentQuestions = [];
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.correctAnswers = 0;
        this.totalQuestions = 10;
        this.isMultipleChoice = false;
        this.timeStarted = null;
        
        this.init();
    }
    
    init() {
        console.log('🔢 Initializing Math Tables Master...');
        this.bindEvents();
        this.showScreen('table-selection-screen');
    }
    
    bindEvents() {
        // Table selection
        document.querySelectorAll('.table-card').forEach(card => {
            card.addEventListener('click', () => {
                const table = parseInt(card.dataset.table);
                this.toggleTableSelection(table, card);
            });
        });
        
        // Control buttons
        document.getElementById('select-all-btn').addEventListener('click', () => this.selectAllTables());
        document.getElementById('clear-all-btn').addEventListener('click', () => this.clearAllTables());
        document.getElementById('start-quiz-btn').addEventListener('click', () => this.startQuiz());
        
        // Quiz controls
        document.getElementById('submit-answer').addEventListener('click', () => this.submitAnswer());
        document.getElementById('answer-field').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.submitAnswer();
        });
        document.getElementById('toggle-mode-btn').addEventListener('click', () => this.toggleQuizMode());
        document.getElementById('skip-btn').addEventListener('click', () => this.skipQuestion());
        document.getElementById('quit-quiz-btn').addEventListener('click', () => this.quitQuiz());
        
        // Multiple choice buttons
        document.querySelectorAll('.choice-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (this.isMultipleChoice) {
                    this.selectMultipleChoice(parseInt(btn.dataset.choice));
                }
            });
        });
        
        // Result buttons
        document.getElementById('play-again-btn').addEventListener('click', () => this.playAgain());
        document.getElementById('choose-tables-btn').addEventListener('click', () => this.chooseNewTables());
    }
    
    toggleTableSelection(table, card) {
        const index = this.selectedTables.indexOf(table);
        if (index === -1) {
            this.selectedTables.push(table);
            card.classList.add('selected');
        } else {
            this.selectedTables.splice(index, 1);
            card.classList.remove('selected');
        }
        
        this.updateSelectedDisplay();
    }
    
    selectAllTables() {
        this.selectedTables = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        document.querySelectorAll('.table-card').forEach(card => {
            card.classList.add('selected');
        });
        this.updateSelectedDisplay();
    }
    
    clearAllTables() {
        this.selectedTables = [];
        document.querySelectorAll('.table-card').forEach(card => {
            card.classList.remove('selected');
        });
        this.updateSelectedDisplay();
    }
    
    updateSelectedDisplay() {
        const countElement = document.getElementById('selected-count');
        const listElement = document.getElementById('selected-list');
        const startButton = document.getElementById('start-quiz-btn');
        
        countElement.textContent = this.selectedTables.length;
        
        listElement.innerHTML = '';
        this.selectedTables.sort((a, b) => a - b).forEach(table => {
            const tag = document.createElement('span');
            tag.className = 'selected-tag';
            tag.textContent = `${table}x`;
            listElement.appendChild(tag);
        });
        
        startButton.disabled = this.selectedTables.length === 0;
    }
    
    startQuiz() {
        if (this.selectedTables.length === 0) {
            alert('Please select at least one table to practice!');
            return;
        }
        
        this.generateQuestions();
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.correctAnswers = 0;
        this.timeStarted = Date.now();
        
        this.updateStats();
        this.showScreen('quiz-screen');
        this.showCurrentQuestion();
    }
    
    generateQuestions() {
        this.currentQuestions = [];
        
        // Generate questions from selected tables
        for (let i = 0; i < this.totalQuestions; i++) {
            const table = this.selectedTables[Math.floor(Math.random() * this.selectedTables.length)];
            const multiplier = Math.floor(Math.random() * 12) + 1; // 1-12
            
            this.currentQuestions.push({
                table: table,
                multiplier: multiplier,
                answer: table * multiplier,
                userAnswer: null,
                correct: false
            });
        }
        
        console.log('Generated questions:', this.currentQuestions);
    }
    
    showCurrentQuestion() {
        if (this.currentQuestionIndex >= this.currentQuestions.length) {
            this.showResults();
            return;
        }
        
        const question = this.currentQuestions[this.currentQuestionIndex];
        
        // Update question display
        document.getElementById('question-number1').textContent = question.table;
        document.getElementById('question-number2').textContent = question.multiplier;
        
        // Update progress
        document.getElementById('current-question').textContent = this.currentQuestionIndex + 1;
        document.getElementById('total-questions').textContent = this.currentQuestions.length;
        document.getElementById('progress-fill').style.width = 
            `${((this.currentQuestionIndex + 1) / this.currentQuestions.length) * 100}%`;
        
        // Reset input/choices
        document.getElementById('answer-field').value = '';
        document.getElementById('answer-field').focus();
        
        if (this.isMultipleChoice) {
            this.setupMultipleChoice(question);
        }
        
        // Update mode display
        document.getElementById('answer-input').style.display = this.isMultipleChoice ? 'none' : 'flex';
        document.getElementById('multiple-choice').style.display = this.isMultipleChoice ? 'grid' : 'none';
    }
    
    setupMultipleChoice(question) {
        const correctAnswer = question.answer;
        const choices = [correctAnswer];
        
        // Generate 3 incorrect choices
        while (choices.length < 4) {
            let wrongAnswer;
            if (Math.random() < 0.5) {
                // Close wrong answer (±1 to ±3)
                wrongAnswer = correctAnswer + (Math.floor(Math.random() * 6) - 3);
            } else {
                // Random wrong answer from the same table range
                wrongAnswer = question.table * (Math.floor(Math.random() * 12) + 1);
            }
            
            if (wrongAnswer > 0 && !choices.includes(wrongAnswer)) {
                choices.push(wrongAnswer);
            }
        }
        
        // Shuffle choices
        for (let i = choices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [choices[i], choices[j]] = [choices[j], choices[i]];
        }
        
        // Update choice buttons
        const choiceButtons = document.querySelectorAll('.choice-btn');
        choiceButtons.forEach((btn, index) => {
            btn.textContent = choices[index];
            btn.dataset.choice = choices[index];
            btn.className = 'choice-btn'; // Reset classes
        });
    }
    
    submitAnswer() {
        const answerField = document.getElementById('answer-field');
        const userAnswer = parseInt(answerField.value);
        
        if (isNaN(userAnswer)) {
            answerField.focus();
            return;
        }
        
        this.processAnswer(userAnswer);
    }
    
    selectMultipleChoice(answer) {
        this.processAnswer(answer);
    }
    
    processAnswer(userAnswer) {
        const question = this.currentQuestions[this.currentQuestionIndex];
        question.userAnswer = userAnswer;
        question.correct = userAnswer === question.answer;
        
        if (question.correct) {
            this.correctAnswers++;
            this.score += 10;
            this.showFeedback(true);
            this.playSound('correct');
        } else {
            this.showFeedback(false, question.answer);
            this.playSound('incorrect');
        }
        
        this.updateStats();
        
        // Show feedback for 1 second, then move to next question
        setTimeout(() => {
            this.currentQuestionIndex++;
            this.showCurrentQuestion();
        }, 1500);
    }
    
    showFeedback(correct, correctAnswer = null) {
        const quizContent = document.querySelector('.quiz-content');
        
        if (correct) {
            quizContent.classList.add('correct-animation');
            document.querySelector('.answer-placeholder').textContent = '✓';
            document.querySelector('.answer-placeholder').style.color = '#4ECDC4';
        } else {
            quizContent.classList.add('incorrect-animation');
            document.querySelector('.answer-placeholder').textContent = correctAnswer;
            document.querySelector('.answer-placeholder').style.color = '#FF6B6B';
        }
        
        // Reset animation classes after animation completes
        setTimeout(() => {
            quizContent.classList.remove('correct-animation', 'incorrect-animation');
            document.querySelector('.answer-placeholder').textContent = '?';
            document.querySelector('.answer-placeholder').style.color = '#FF6B6B';
        }, 1000);
    }
    
    skipQuestion() {
        const question = this.currentQuestions[this.currentQuestionIndex];
        question.userAnswer = null;
        question.correct = false;
        
        this.currentQuestionIndex++;
        this.showCurrentQuestion();
    }
    
    toggleQuizMode() {
        this.isMultipleChoice = !this.isMultipleChoice;
        const toggleBtn = document.getElementById('toggle-mode-btn');
        toggleBtn.textContent = this.isMultipleChoice ? 'Switch to Input Mode' : 'Switch to Multiple Choice';
        
        this.showCurrentQuestion();
    }
    
    quitQuiz() {
        if (confirm('Are you sure you want to quit the quiz?')) {
            this.showScreen('table-selection-screen');
        }
    }
    
    showResults() {
        const percentage = Math.round((this.correctAnswers / this.currentQuestions.length) * 100);
        const timeElapsed = Math.round((Date.now() - this.timeStarted) / 1000);
        
        // Update result displays
        document.getElementById('final-score').textContent = this.score;
        document.getElementById('final-correct').textContent = `${this.correctAnswers}/${this.currentQuestions.length}`;
        document.getElementById('final-percentage').textContent = `${percentage}%`;
        
        // Show performance message
        this.showPerformanceMessage(percentage);
        
        // Play completion sound
        this.playSound('complete');
        
        this.showScreen('results-screen');
        
        console.log('Quiz completed:', {
            score: this.score,
            correct: this.correctAnswers,
            total: this.currentQuestions.length,
            percentage: percentage,
            timeElapsed: timeElapsed
        });
    }
    
    showPerformanceMessage(percentage) {
        const emojiElement = document.getElementById('performance-emoji');
        const textElement = document.getElementById('performance-text');
        
        if (percentage >= 90) {
            emojiElement.textContent = '🏆';
            textElement.textContent = 'Excellent! You\'re a math champion!';
        } else if (percentage >= 80) {
            emojiElement.textContent = '🎉';
            textElement.textContent = 'Great job! Keep up the good work!';
        } else if (percentage >= 70) {
            emojiElement.textContent = '👍';
            textElement.textContent = 'Good effort! Practice makes perfect!';
        } else if (percentage >= 60) {
            emojiElement.textContent = '💪';
            textElement.textContent = 'Keep practicing! You\'re improving!';
        } else {
            emojiElement.textContent = '📚';
            textElement.textContent = 'Don\'t give up! More practice will help!';
        }
    }
    
    playAgain() {
        this.startQuiz();
    }
    
    chooseNewTables() {
        this.showScreen('table-selection-screen');
    }
    
    updateStats() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('correct').textContent = this.correctAnswers;
        document.getElementById('total').textContent = this.currentQuestionIndex;
    }
    
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }
    
    playSound(type) {
        // Use game audio if available
        if (window.gameAudio) {
            switch(type) {
                case 'correct':
                    gameAudio.playSound('success');
                    gameAudio.hapticFeedback('success');
                    break;
                case 'incorrect':
                    gameAudio.playSound('error');
                    gameAudio.hapticFeedback('error');
                    break;
                case 'complete':
                    gameAudio.playSound('levelComplete');
                    gameAudio.hapticFeedback('success');
                    break;
            }
        }
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔢 Math Tables Master loading...');
    
    // Initialize game audio if available
    if (typeof GameAudioManager !== 'undefined') {
        window.gameAudio = new GameAudioManager();
        console.log('🔊 Game audio initialized');
    }
    
    // Initialize the math tables game
    window.mathGame = new MathTablesMaster();
    console.log('✅ Math Tables Master initialized');
});

// Handle page visibility changes to pause/resume
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        console.log('📱 Page hidden - game paused');
    } else {
        console.log('📱 Page visible - game resumed');
    }
});
