// Math Tables Master - Complete Learning Game
class MathTablesGame {
    constructor() {
        this.currentGrade = null;
        this.currentTable = null;
        this.currentScreen = 'grade-selection';
        this.gameStats = {
            score: 0,
            streak: 0,
            level: 1,
            questionsAnswered: 0,
            correctAnswers: 0,
            currentQuestionIndex: 0
        };
        this.gradeConfigs = {
            2: { tables: [2, 3, 4], maxNumber: 5, questionsPerLevel: 8 },
            3: { tables: [2, 3, 4, 5], maxNumber: 8, questionsPerLevel: 10 },
            4: { tables: [2, 3, 4, 5, 6, 7, 8], maxNumber: 10, questionsPerLevel: 12 },
            5: { tables: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], maxNumber: 12, questionsPerLevel: 15 },
            6: { tables: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], maxNumber: 15, questionsPerLevel: 20 }
        };
        this.currentQuestions = [];
        this.userProgress = this.loadProgress();
        this.achievements = [];
        this.soundEnabled = true;
        this.init();
    }

    init() {
        console.log('Math Tables Master initialized');
        try {
            this.setupEventListeners();
            this.showScreen('grade-selection');
            this.updateStats();
            this.loadUserProgress();
            
            // Initialize with safe defaults
            this.currentTable = null;
            this.currentGrade = null;
            this.currentQuestions = [];
            
            console.log('Math Tables Master initialization complete');
        } catch (error) {
            console.error('Error during initialization:', error);
            // Fallback initialization
            this.currentTable = null;
            this.currentGrade = null;
            this.currentQuestions = [];
            this.showScreen('grade-selection');
        }
    }

    setupEventListeners() {
        // Back button
        const backBtn = document.getElementById('back-button');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                window.location.href = 'index.html';
            });
        }

        // Grade selection
        const gradeCards = document.querySelectorAll('.grade-card');
        gradeCards.forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.classList.contains('start-btn') || e.target.closest('.start-btn')) {
                    const grade = card.dataset.grade;
                    if (grade === 'practice') {
                        this.showPracticeMode();
                    } else {
                        this.selectGrade(parseInt(grade));
                    }
                }
            });
        });

        // Table selection for practice mode (handle both single and mixed practice)
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('table-btn')) {
                if (e.target.dataset.table) {
                    // Single table practice
                    const table = parseInt(e.target.dataset.table);
                    this.startPracticeMode(table);
                } else if (e.target.dataset.tables) {
                    // Mixed practice
                    const tables = e.target.dataset.tables;
                    this.startPracticeMode(tables);
                }
            }
        });

        // Learning controls
        document.addEventListener('click', (e) => {
            if (e.target.id === 'show-table-btn') {
                this.showFullTable();
            }
            if (e.target.id === 'start-quiz-btn') {
                this.startQuiz();
            }
            if (e.target.classList.contains('back-to-grades-btn')) {
                this.showScreen('grade-selection');
                this.resetGame();
            }
            if (e.target.classList.contains('back-to-learning-btn')) {
                this.showLearningScreen();
            }
            if (e.target.id === 'hint-btn') {
                this.showHint();
            }
            if (e.target.id === 'skip-btn') {
                this.skipQuestion();
            }
            if (e.target.id === 'next-level-btn') {
                this.nextLevel();
            }
            if (e.target.id === 'retry-level-btn') {
                this.retryLevel();
            }
        });

        // Answer option clicks
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('answer-option')) {
                this.selectAnswer(e.target);
            }
        });
    }

    showScreen(screenName) {
        const screens = document.querySelectorAll('.screen');
        screens.forEach(screen => screen.classList.remove('active'));
        
        const targetScreen = document.getElementById(`${screenName}-screen`);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screenName;
        }
    }

    selectGrade(grade) {
        console.log('Selecting grade:', grade);
        this.currentGrade = grade;
        this.gameStats.level = 1;
        this.resetGameStats(); // Reset only stats, keep grade/table info
        this.startLearningMode();
    }

    showPracticeMode() {
        // Update practice mode to show only relevant tables for the selected grade
        this.updatePracticeSelection();
        this.showScreen('practice-selection');
    }

    updatePracticeSelection() {
        const tableGrid = document.querySelector('.table-grid');
        if (!tableGrid) return;

        tableGrid.innerHTML = '';

        // Show all available tables but group them by difficulty
        const allTables = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
        const easyTables = [2, 3, 4, 5, 10];
        const mediumTables = [6, 7, 8, 9];
        const hardTables = [11, 12, 13, 14, 15];

        // Create sections
        this.createTableSection(tableGrid, 'Easy Tables (Great for beginners)', easyTables, 'easy');
        this.createTableSection(tableGrid, 'Medium Tables (Building confidence)', mediumTables, 'medium');
        this.createTableSection(tableGrid, 'Hard Tables (Challenge mode)', hardTables, 'hard');

        // Add mixed practice options
        const mixedSection = document.createElement('div');
        mixedSection.className = 'mixed-practice-section';
        mixedSection.innerHTML = `
            <h4>🎲 Mixed Practice</h4>
            <button class="table-btn mixed-btn" data-tables="2,3,4,5">Easy Mix (2-5 tables)</button>
            <button class="table-btn mixed-btn" data-tables="6,7,8,9">Medium Mix (6-9 tables)</button>
            <button class="table-btn mixed-btn" data-tables="2,3,4,5,6,7,8,9,10">All Common Tables</button>
            <button class="table-btn mixed-btn" data-tables="2,3,4,5,6,7,8,9,10,11,12">Complete Set</button>
        `;
        tableGrid.appendChild(mixedSection);
    }

    createTableSection(container, title, tables, difficulty) {
        const section = document.createElement('div');
        section.className = `table-section ${difficulty}`;
        
        const header = document.createElement('h4');
        header.textContent = title;
        header.className = 'section-header';
        section.appendChild(header);

        tables.forEach(table => {
            const button = document.createElement('button');
            button.className = `table-btn ${difficulty}`;
            button.dataset.table = table;
            button.textContent = `${table} Times Table`;
            section.appendChild(button);
        });

        container.appendChild(section);
    }

    startPracticeMode(tableOrTables) {
        console.log('Starting practice mode for:', tableOrTables);
        
        if (typeof tableOrTables === 'string' && tableOrTables.includes(',')) {
            // Mixed practice mode
            this.currentTables = tableOrTables.split(',').map(t => parseInt(t));
            this.currentTable = null;
            this.currentGrade = 'mixed-practice';
            console.log('Mixed practice mode with tables:', this.currentTables);
        } else {
            // Single table practice
            this.currentTable = parseInt(tableOrTables);
            this.currentTables = null;
            this.currentGrade = 'practice';
            console.log('Single table practice mode:', this.currentTable);
        }
        
        this.resetGameStats();
        this.showLearningScreen();
    }

    startLearningMode() {
        const config = this.gradeConfigs[this.currentGrade];
        if (!config) {
            console.error('Invalid grade configuration:', this.currentGrade);
            this.showScreen('grade-selection');
            return;
        }
        
        const tableIndex = this.gameStats.level - 1;
        if (tableIndex < 0 || tableIndex >= config.tables.length) {
            console.error('Invalid level for grade:', this.gameStats.level, this.currentGrade);
            this.gameStats.level = 1;
            this.currentTable = config.tables[0];
        } else {
            this.currentTable = config.tables[tableIndex];
        }
        
        console.log(`Starting learning mode: Grade ${this.currentGrade}, Level ${this.gameStats.level}, Table ${this.currentTable}`);
        this.showLearningScreen();
    }

    showLearningScreen() {
        this.showScreen('learning');
        this.displayTableChart();
        this.updateLearningUI();
    }

    updateLearningUI() {
        const title = document.getElementById('table-title');
        const subtitle = document.getElementById('learning-subtitle');
        
        if (title && this.currentTable) {
            title.textContent = `Learning ${this.currentTable} Times Table`;
        }
        if (subtitle && this.currentTable) {
            subtitle.textContent = `Let's learn the ${this.currentTable} times table step by step!`;
        }
    }

    displayTableChart() {
        const chartContainer = document.getElementById('table-chart');
        if (!chartContainer) return;

        if (!this.currentTable) {
            console.error('Cannot display table chart: No table selected');
            chartContainer.innerHTML = '<p>Please select a table first!</p>';
            return;
        }

        chartContainer.innerHTML = '';
        
        const maxNumber = this.currentGrade === 'practice' ? 15 : 
                         this.gradeConfigs[this.currentGrade].maxNumber;

        for (let i = 1; i <= maxNumber; i++) {
            const row = document.createElement('div');
            row.className = 'table-row';
            
            const result = this.currentTable * i;
            row.innerHTML = `
                <span>${this.currentTable}</span>
                <span class="operator">×</span>
                <span>${i}</span>
                <span class="equals">=</span>
                <span class="result">${result}</span>
            `;
            
            chartContainer.appendChild(row);
            
            // Simple animation without nested timeouts
            row.style.opacity = '0';
            row.style.transform = 'translateX(-50px)';
            row.style.transition = 'all 0.5s ease';
            
            // Use requestAnimationFrame for better performance
            requestAnimationFrame(() => {
                setTimeout(() => {
                    row.style.opacity = '1';
                    row.style.transform = 'translateX(0)';
                }, i * 50); // Reduced delay
            });
        }
    }

    showFullTable() {
        // Already shown in learning screen, maybe add some animation
        const rows = document.querySelectorAll('.table-row');
        rows.forEach((row, index) => {
            row.style.animation = 'none';
            setTimeout(() => {
                row.style.animation = 'pulse 0.5s ease-in-out';
            }, index * 50);
        });
    }

    async startQuiz() {
        // Validate that we have a current table set
        if (!this.currentTable) {
            console.error('No table selected for quiz');
            this.showFeedback('Please select a table first!', 'error');
            return;
        }

        this.showScreen('quiz');
        
        // Generate questions asynchronously to prevent blocking
        await this.generateQuestions();
        
        this.gameStats.questionsAnswered = 0;
        this.gameStats.correctAnswers = 0;
        this.gameStats.currentQuestionIndex = 0;
        this.showNextQuestion();
        this.updateQuizUI();
    }

    updateQuizUI() {
        const title = document.getElementById('quiz-title');
        const subtitle = document.getElementById('quiz-subtitle');
        
        if (title && this.currentTable) {
            title.textContent = `${this.currentTable} Times Table Quiz`;
        }
        if (subtitle && this.currentQuestions.length > 0) {
            const remaining = this.currentQuestions.length - this.gameStats.currentQuestionIndex;
            subtitle.textContent = `${remaining} questions remaining`;
        }
    }

    generateQuestions() {
        return new Promise((resolve) => {
            this.currentQuestions = [];
            
            // Handle mixed practice mode
            if (this.currentGrade === 'mixed-practice' && this.currentTables) {
                this.generateMixedQuestions();
                resolve();
                return;
            }
            
            // Validate current table for single table mode
            if (!this.currentTable) {
                console.error('Cannot generate questions: No table selected');
                resolve();
                return;
            }

            const maxNumber = this.currentGrade === 'practice' ? 15 : 
                             this.gradeConfigs[this.currentGrade] ? this.gradeConfigs[this.currentGrade].maxNumber : 12;
            const questionCount = this.currentGrade === 'practice' ? 15 : 
                                 this.gradeConfigs[this.currentGrade] ? this.gradeConfigs[this.currentGrade].questionsPerLevel : 12;

            // Generate unique questions for single table
            const usedQuestions = new Set();
            let attempts = 0;
            const maxAttempts = questionCount * 3; // Safety limit
            
            while (this.currentQuestions.length < questionCount && attempts < maxAttempts) {
                attempts++;
                const multiplier = Math.floor(Math.random() * maxNumber) + 1;
                const questionKey = `${this.currentTable}x${multiplier}`;
                
                if (!usedQuestions.has(questionKey)) {
                    usedQuestions.add(questionKey);
                    this.currentQuestions.push({
                        table: this.currentTable,
                        multiplier: multiplier,
                        answer: this.currentTable * multiplier
                    });
                }
            }

            // If we couldn't generate enough unique questions, fill with any remaining
            if (this.currentQuestions.length < questionCount) {
                for (let i = 1; i <= maxNumber && this.currentQuestions.length < questionCount; i++) {
                    const questionKey = `${this.currentTable}x${i}`;
                    if (!usedQuestions.has(questionKey)) {
                        this.currentQuestions.push({
                            table: this.currentTable,
                            multiplier: i,
                            answer: this.currentTable * i
                        });
                    }
                }
            }

            // Shuffle questions
            this.shuffleArray(this.currentQuestions);
            resolve();
        });
    }

    generateMixedQuestions() {
        const questionCount = 20; // More questions for mixed practice
        const maxNumber = 12;
        const usedQuestions = new Set();
        let attempts = 0;
        const maxAttempts = questionCount * 5;

        while (this.currentQuestions.length < questionCount && attempts < maxAttempts) {
            attempts++;
            
            // Randomly select a table from the current tables
            const randomTable = this.currentTables[Math.floor(Math.random() * this.currentTables.length)];
            const multiplier = Math.floor(Math.random() * maxNumber) + 1;
            const questionKey = `${randomTable}x${multiplier}`;
            
            if (!usedQuestions.has(questionKey)) {
                usedQuestions.add(questionKey);
                this.currentQuestions.push({
                    table: randomTable,
                    multiplier: multiplier,
                    answer: randomTable * multiplier
                });
            }
        }

        // Shuffle questions
        this.shuffleArray(this.currentQuestions);
    }

            // Shuffle questions
            this.currentQuestions = this.shuffleArray(this.currentQuestions);
            console.log(`Generated ${this.currentQuestions.length} questions for table ${this.currentTable}`);
            resolve();
        });
    }

    showNextQuestion() {
        if (this.gameStats.currentQuestionIndex >= this.currentQuestions.length) {
            this.completeLevel();
            return;
        }

        const question = this.currentQuestions[this.gameStats.currentQuestionIndex];
        if (!question) {
            console.error('No question available at index', this.gameStats.currentQuestionIndex);
            this.completeLevel();
            return;
        }

        this.displayQuestion(question);
        this.generateAnswerOptions(question.answer);
        this.clearFeedback();
        this.updateQuizUI();
    }

    displayQuestion(question) {
        const firstNumber = document.getElementById('first-number');
        const secondNumber = document.getElementById('second-number');
        
        if (firstNumber) firstNumber.textContent = question.table;
        if (secondNumber) secondNumber.textContent = question.multiplier;
    }

    generateAnswerOptions(correctAnswer) {
        const optionsContainer = document.getElementById('answer-options');
        if (!optionsContainer) return;

        optionsContainer.innerHTML = '';
        
        const options = [correctAnswer];
        
        // Generate wrong answers
        let attempts = 0;
        const maxAttempts = 20; // Safety limit to prevent infinite loop
        
        while (options.length < 4 && attempts < maxAttempts) {
            attempts++;
            let wrongAnswer;
            const randomType = Math.random();
            
            if (randomType < 0.3) {
                // Close wrong answer (±1-3)
                wrongAnswer = correctAnswer + (Math.floor(Math.random() * 6) - 3);
            } else if (randomType < 0.6) {
                // Common mistake: adjacent table
                const adjacentTable = this.currentTable + (Math.random() < 0.5 ? -1 : 1);
                const multiplier = this.currentQuestions[this.gameStats.currentQuestionIndex].multiplier;
                wrongAnswer = Math.max(1, adjacentTable) * multiplier;
            } else {
                // Random wrong answer in reasonable range
                wrongAnswer = Math.floor(Math.random() * (correctAnswer + 20)) + 1;
            }
            
            if (wrongAnswer > 0 && !options.includes(wrongAnswer)) {
                options.push(wrongAnswer);
            }
        }

        // If we still don't have enough options, add simple variations
        while (options.length < 4) {
            const variation = correctAnswer + options.length;
            if (!options.includes(variation)) {
                options.push(variation);
            } else {
                options.push(correctAnswer + options.length + 10);
            }
        }

        // Shuffle options
        const shuffledOptions = this.shuffleArray(options);
        
        shuffledOptions.forEach(option => {
            const button = document.createElement('button');
            button.className = 'answer-option';
            button.textContent = option;
            button.dataset.answer = option;
            optionsContainer.appendChild(button);
        });
    }

    selectAnswer(buttonElement) {
        const selectedAnswer = parseInt(buttonElement.dataset.answer);
        const correctAnswer = this.currentQuestions[this.gameStats.currentQuestionIndex].answer;
        const isCorrect = selectedAnswer === correctAnswer;

        // Disable all options
        const allOptions = document.querySelectorAll('.answer-option');
        allOptions.forEach(option => {
            option.style.pointerEvents = 'none';
        });

        if (isCorrect) {
            buttonElement.classList.add('correct');
            this.gameStats.correctAnswers++;
            this.gameStats.streak++;
            this.gameStats.score += 10 + (this.gameStats.streak * 2);
            this.showFeedback('Excellent! Well done! 🌟', 'success');
            this.createCelebration();
        } else {
            buttonElement.classList.add('incorrect');
            this.gameStats.streak = 0;
            
            // Highlight correct answer
            allOptions.forEach(option => {
                if (parseInt(option.dataset.answer) === correctAnswer) {
                    option.classList.add('correct');
                }
            });
            
            this.showFeedback(`Not quite! The answer is ${correctAnswer}. Try to remember this one! 💪`, 'error');
        }

        this.gameStats.questionsAnswered++;
        this.updateStats();

        // Move to next question after delay
        setTimeout(() => {
            this.gameStats.currentQuestionIndex++;
            this.showNextQuestion();
        }, 2500);
    }

    showFeedback(message, type) {
        const feedbackArea = document.getElementById('feedback-area');
        if (!feedbackArea) {
            console.error('Feedback area not found');
            return;
        }

        feedbackArea.innerHTML = '';
        const feedbackElement = document.createElement('div');
        feedbackElement.className = `feedback-message ${type}`;
        feedbackElement.textContent = message;
        feedbackArea.appendChild(feedbackElement);
    }

    clearFeedback() {
        const feedbackArea = document.getElementById('feedback-area');
        if (feedbackArea) {
            feedbackArea.innerHTML = '';
        }

        // Re-enable all options
        const allOptions = document.querySelectorAll('.answer-option');
        allOptions.forEach(option => {
            option.style.pointerEvents = 'auto';
            option.classList.remove('correct', 'incorrect');
        });
    }

    showHint() {
        const question = this.currentQuestions[this.gameStats.currentQuestionIndex];
        if (!question) return;

        const hintMessages = [
            `Think: ${question.table} groups of ${question.multiplier}`,
            `You can count: ${question.table} + ${question.table} + ... (${question.multiplier} times)`,
            `Or use a pattern you might know in the ${question.table} times table!`
        ];
        
        const randomHint = hintMessages[Math.floor(Math.random() * hintMessages.length)];
        this.showFeedback(randomHint, 'info');
    }

    skipQuestion() {
        const question = this.currentQuestions[this.gameStats.currentQuestionIndex];
        this.showFeedback(`Skipped! ${question.table} × ${question.multiplier} = ${question.answer}`, 'info');
        
        this.gameStats.questionsAnswered++;
        this.gameStats.streak = 0;
        
        setTimeout(() => {
            this.gameStats.currentQuestionIndex++;
            this.showNextQuestion();
        }, 2000);
    }

    completeLevel() {
        this.calculateLevelResults();
        this.showScreen('level-complete');
        this.updateLevelCompleteUI();
        this.saveProgress();
        this.checkAchievements();
    }

    calculateLevelResults() {
        const accuracy = this.gameStats.questionsAnswered > 0 ? 
                        Math.round((this.gameStats.correctAnswers / this.gameStats.questionsAnswered) * 100) : 0;
        
        let stars = 1;
        if (accuracy >= 80) stars = 2;
        if (accuracy >= 95) stars = 3;
        
        this.currentLevelResults = {
            accuracy,
            stars,
            questionsAnswered: this.gameStats.questionsAnswered,
            correctAnswers: this.gameStats.correctAnswers
        };
    }

    updateLevelCompleteUI() {
        const results = this.currentLevelResults;
        
        document.getElementById('questions-answered').textContent = results.questionsAnswered;
        document.getElementById('correct-answers').textContent = results.correctAnswers;
        document.getElementById('accuracy').textContent = `${results.accuracy}%`;
        
        const starsElement = document.getElementById('stars-earned');
        const starsText = '⭐'.repeat(results.stars) + '☆'.repeat(3 - results.stars);
        starsElement.textContent = starsText;

        // Update achievement display
        const achievementIcon = document.getElementById('achievement-icon');
        const achievementTitle = document.getElementById('achievement-title');
        const achievementDesc = document.getElementById('achievement-description');

        if (results.accuracy >= 95) {
            achievementIcon.textContent = '🏆';
            achievementTitle.textContent = 'Perfect Score!';
            achievementDesc.textContent = `Amazing! You got ${results.accuracy}% correct!`;
        } else if (results.accuracy >= 80) {
            achievementIcon.textContent = '⭐';
            achievementTitle.textContent = 'Great Job!';
            achievementDesc.textContent = `Well done! You got ${results.accuracy}% correct!`;
        } else {
            achievementIcon.textContent = '💪';
            achievementTitle.textContent = 'Keep Practicing!';
            achievementDesc.textContent = `You got ${results.accuracy}% correct. Practice makes perfect!`;
        }

        // Update progress bar
        this.updateProgressBar();
    }

    nextLevel() {
        if (this.currentGrade === 'practice') {
            this.showScreen('practice-selection');
            return;
        }

        const config = this.gradeConfigs[this.currentGrade];
        if (this.gameStats.level < config.tables.length) {
            this.gameStats.level++;
            this.currentTable = config.tables[this.gameStats.level - 1];
            this.showLearningScreen();
        } else {
            // Grade completed
            this.showGradeComplete();
        }
    }

    retryLevel() {
        if (this.currentGrade === 'practice') {
            this.showLearningScreen();
        } else {
            this.startLearningMode();
        }
    }

    showGradeComplete() {
        // Could add a special grade completion screen
        this.showFeedback(`Congratulations! You've completed Grade ${this.currentGrade}! 🎉`, 'success');
        setTimeout(() => {
            this.showScreen('grade-selection');
            this.resetGame();
        }, 3000);
    }

    updateProgressBar() {
        if (this.currentGrade === 'practice') return;
        
        const config = this.gradeConfigs[this.currentGrade];
        const progress = (this.gameStats.level / config.tables.length) * 100;
        
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        
        if (progressFill) progressFill.style.width = `${progress}%`;
        if (progressText) progressText.textContent = `Level ${this.gameStats.level}`;
    }

    updateStats() {
        const elements = {
            score: document.getElementById('score'),
            streak: document.getElementById('streak'),
            'current-level': document.getElementById('current-level')
        };

        if (elements.score) elements.score.textContent = this.gameStats.score;
        if (elements.streak) elements.streak.textContent = this.gameStats.streak;
        if (elements['current-level']) elements['current-level'].textContent = this.gameStats.level;
    }

    createCelebration() {
        // Create confetti effect for correct answers
        const celebration = document.createElement('div');
        celebration.className = 'celebration';
        document.body.appendChild(celebration);

        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = this.getRandomColor();
            confetti.style.animationDelay = Math.random() * 2 + 's';
            celebration.appendChild(confetti);
        }

        setTimeout(() => {
            document.body.removeChild(celebration);
        }, 3000);
    }

    getRandomColor() {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    checkAchievements() {
        // Add achievement system
        const accuracy = this.currentLevelResults.accuracy;
        
        if (accuracy >= 100 && !this.achievements.includes('perfect_score')) {
            this.achievements.push('perfect_score');
            this.showAchievement('Perfect Score!', 'You got 100% correct! 🏆');
        }
        
        if (this.gameStats.streak >= 10 && !this.achievements.includes('streak_master')) {
            this.achievements.push('streak_master');
            this.showAchievement('Streak Master!', '10 correct answers in a row! 🔥');
        }
    }

    showAchievement(title, description) {
        // Could implement achievement popup
        console.log(`Achievement unlocked: ${title} - ${description}`);
    }

    saveProgress() {
        const progress = {
            grade: this.currentGrade,
            level: this.gameStats.level,
            score: this.gameStats.score,
            achievements: this.achievements,
            tableProgress: this.userProgress
        };
        
        try {
            localStorage.setItem('mathTablesProgress', JSON.stringify(progress));
        } catch (e) {
            console.log('Could not save progress:', e);
        }
    }

    loadProgress() {
        try {
            const saved = localStorage.getItem('mathTablesProgress');
            return saved ? JSON.parse(saved) : {};
        } catch (e) {
            console.log('Could not load progress:', e);
            return {};
        }
    }

    loadUserProgress() {
        const saved = this.loadProgress();
        if (saved.achievements) {
            this.achievements = saved.achievements;
        }
        if (saved.tableProgress) {
            this.userProgress = saved.tableProgress;
        }
    }

    resetGameStats() {
        this.gameStats = {
            score: 0,
            streak: 0,
            level: this.gameStats.level, // Keep current level
            questionsAnswered: 0,
            correctAnswers: 0,
            currentQuestionIndex: 0
        };
        this.currentQuestions = [];
        this.updateStats();
    }

    resetGame() {
        this.gameStats = {
            score: 0,
            streak: 0,
            level: 1,
            questionsAnswered: 0,
            correctAnswers: 0,
            currentQuestionIndex: 0
        };
        this.currentQuestions = [];
        this.currentTable = null;
        this.currentGrade = null;
        this.updateStats();
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new MathTablesGame();
});
