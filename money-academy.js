// Money Academy - Interactive Financial Education
let currentChapter = 1;
let completedChapters = [];
let chapterProgress = {};

const moneyChapters = {
    1: {
        title: "💳 What is Money?",
        content: `
            <div class="chapter-lesson">
                <h3>Understanding Money</h3>
                <div class="infographic">
                    <div class="money-timeline">
                        <div class="timeline-item">
                            <div class="timeline-icon">🥥</div>
                            <h4>Barter System</h4>
                            <p>People traded goods directly</p>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-icon">🪙</div>
                            <h4>Coins</h4>
                            <p>Metal money for easier trade</p>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-icon">💵</div>
                            <h4>Paper Money</h4>
                            <p>Lightweight and portable</p>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-icon">💳</div>
                            <h4>Digital Money</h4>
                            <p>Cards and online payments</p>
                        </div>
                    </div>
                </div>
                
                <div class="key-concepts">
                    <h4>💡 Key Concepts:</h4>
                    <ul>
                        <li><strong>Medium of Exchange:</strong> Money helps us trade without bartering</li>
                        <li><strong>Store of Value:</strong> Money keeps its worth over time</li>
                        <li><strong>Unit of Account:</strong> Money helps us compare prices</li>
                    </ul>
                </div>
                
                <button class="quiz-btn" onclick="startChapterQuiz(1)">Take Chapter 1 Quiz</button>
            </div>
        `,
        quiz: [
            {
                question: "What did people do before money existed?",
                options: ["Used credit cards", "Traded goods directly", "Used paper money", "Nothing"],
                correct: 1
            },
            {
                question: "Which is NOT a function of money?",
                options: ["Medium of exchange", "Store of value", "Unit of account", "Making people rich"],
                correct: 3
            }
        ]
    },
    
    2: {
        title: "🏦 Banking Basics",
        content: `
            <div class="chapter-lesson">
                <h3>Understanding Banks</h3>
                <div class="bank-infographic">
                    <div class="bank-services">
                        <div class="service-card">
                            <div class="service-icon">💰</div>
                            <h4>Savings Account</h4>
                            <p>Keep money safe and earn interest</p>
                            <div class="interest-demo">
                                $100 → 1 year → $102 💹
                            </div>
                        </div>
                        <div class="service-card">
                            <div class="service-icon">💳</div>
                            <h4>Checking Account</h4>
                            <p>For daily expenses and bill payments</p>
                        </div>
                        <div class="service-card">
                            <div class="service-icon">🏠</div>
                            <h4>Loans</h4>
                            <p>Borrow money for big purchases</p>
                        </div>
                    </div>
                </div>
                
                <div class="interest-calculator">
                    <h4>🧮 Interest Calculator</h4>
                    <div class="calculator-inputs">
                        <label>Amount: $<input type="number" id="principal" value="100" min="1"></label>
                        <label>Interest Rate: <input type="number" id="rate" value="2" min="0" step="0.1">%</label>
                        <label>Years: <input type="number" id="years" value="1" min="1"></label>
                        <button onclick="calculateInterest()">Calculate</button>
                    </div>
                    <div class="result" id="interest-result">You'll have $102.00 after 1 year!</div>
                </div>
                
                <button class="quiz-btn" onclick="startChapterQuiz(2)">Take Chapter 2 Quiz</button>
            </div>
        `,
        quiz: [
            {
                question: "What do you earn when you keep money in a savings account?",
                options: ["Fees", "Interest", "Nothing", "Gifts"],
                correct: 1
            },
            {
                question: "Which account is best for daily spending?",
                options: ["Savings", "Checking", "Investment", "Loan"],
                correct: 1
            }
        ]
    },
    
    3: {
        title: "📊 Budgeting",
        content: `
            <div class="chapter-lesson">
                <h3>Creating Your Budget</h3>
                <div class="budget-infographic">
                    <div class="budget-pie">
                        <h4>Sample Monthly Budget</h4>
                        <div class="pie-chart">
                            <div class="pie-slice needs" style="--percentage: 50">
                                <span>Needs 50%</span>
                            </div>
                            <div class="pie-slice wants" style="--percentage: 30">
                                <span>Wants 30%</span>
                            </div>
                            <div class="pie-slice savings" style="--percentage: 20">
                                <span>Savings 20%</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="budget-breakdown">
                        <div class="budget-category needs">
                            <h4>🏠 Needs (50%)</h4>
                            <ul>
                                <li>Food</li>
                                <li>Housing</li>
                                <li>Transportation</li>
                                <li>Healthcare</li>
                            </ul>
                        </div>
                        
                        <div class="budget-category wants">
                            <h4>🎮 Wants (30%)</h4>
                            <ul>
                                <li>Entertainment</li>
                                <li>Hobbies</li>
                                <li>Dining out</li>
                                <li>New clothes</li>
                            </ul>
                        </div>
                        
                        <div class="budget-category savings">
                            <h4>💰 Savings (20%)</h4>
                            <ul>
                                <li>Emergency fund</li>
                                <li>Future goals</li>
                                <li>Investments</li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div class="budget-calculator">
                    <h4>🧮 Budget Calculator</h4>
                    <label>Monthly Income: $<input type="number" id="monthly-income" value="100" min="1" onchange="calculateBudget()"></label>
                    <div class="budget-results" id="budget-results">
                        <p>Needs: $50</p>
                        <p>Wants: $30</p>
                        <p>Savings: $20</p>
                    </div>
                </div>
                
                <button class="quiz-btn" onclick="startChapterQuiz(3)">Take Chapter 3 Quiz</button>
            </div>
        `,
        quiz: [
            {
                question: "According to the 50/30/20 rule, what percentage should go to needs?",
                options: ["30%", "20%", "50%", "60%"],
                correct: 2
            },
            {
                question: "Which is a 'want' rather than a 'need'?",
                options: ["Food", "Housing", "Video games", "Healthcare"],
                correct: 2
            }
        ]
    },
    
    4: {
        title: "💡 Smart Spending",
        content: `
            <div class="chapter-lesson">
                <h3>Making Smart Money Choices</h3>
                <div class="smart-spending-infographic">
                    <div class="comparison-cards">
                        <div class="comparison-card needs">
                            <h4>🏠 NEEDS</h4>
                            <p>Things you must have to live</p>
                            <ul>
                                <li>✅ Food and water</li>
                                <li>✅ Safe housing</li>
                                <li>✅ Basic clothing</li>
                                <li>✅ Healthcare</li>
                                <li>✅ Transportation to work/school</li>
                            </ul>
                        </div>
                        
                        <div class="comparison-card wants">
                            <h4>🎮 WANTS</h4>
                            <p>Things that make life more enjoyable</p>
                            <ul>
                                <li>🎯 Latest video games</li>
                                <li>🎯 Designer clothes</li>
                                <li>🎯 Expensive restaurants</li>
                                <li>🎯 Premium subscriptions</li>
                                <li>🎯 Luxury items</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="shopping-tips">
                        <h4>🛒 Smart Shopping Tips</h4>
                        <div class="tip-cards">
                            <div class="tip-card">
                                <span class="tip-emoji">🔍</span>
                                <h5>Compare Prices</h5>
                                <p>Check different stores and websites before buying</p>
                            </div>
                            <div class="tip-card">
                                <span class="tip-emoji">📝</span>
                                <h5>Make a List</h5>
                                <p>Write what you need before shopping to avoid impulse buys</p>
                            </div>
                            <div class="tip-card">
                                <span class="tip-emoji">⏰</span>
                                <h5>Wait 24 Hours</h5>
                                <p>For big purchases, sleep on it before deciding</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <button class="quiz-btn" onclick="startChapterQuiz(4)">Take Chapter 4 Quiz</button>
            </div>
        `,
        quiz: [
            {
                question: "Which of these is a NEED, not a WANT?",
                options: ["Designer sneakers", "Basic food", "Video game console", "Premium phone"],
                correct: 1
            },
            {
                question: "What should you do before making a big purchase?",
                options: ["Buy it immediately", "Wait and think about it", "Ask friends to buy it too", "Use all your savings"],
                correct: 1
            }
        ]
    },
    
    5: {
        title: "🎯 Saving Goals",
        content: `
            <div class="chapter-lesson">
                <h3>Setting and Achieving Your Goals</h3>
                <div class="goals-infographic">
                    <div class="goal-timeline">
                        <div class="goal-item short-term">
                            <div class="goal-icon">🎮</div>
                            <h4>Short-term (1-6 months)</h4>
                            <p>New video game, toy, or small treat</p>
                            <div class="goal-example">Goal: $60 game → Save $10/month → 6 months!</div>
                        </div>
                        <div class="goal-item medium-term">
                            <div class="goal-icon">🚲</div>
                            <h4>Medium-term (6 months - 2 years)</h4>
                            <p>Bicycle, computer, or bigger purchase</p>
                            <div class="goal-example">Goal: $500 bike → Save $25/month → 20 months!</div>
                        </div>
                        <div class="goal-item long-term">
                            <div class="goal-icon">🎓</div>
                            <h4>Long-term (2+ years)</h4>
                            <p>College fund, car, or major life goals</p>
                            <div class="goal-example">Goal: $5000 college → Save $50/month → 8+ years!</div>
                        </div>
                    </div>
                    
                    <div class="goal-tracker">
                        <h4>🎯 Goal Setting Calculator</h4>
                        <div class="calculator-inputs">
                            <label>Goal Amount: $<input type="number" id="goal-amount" value="100" min="1" onchange="calculateGoal()"></label>
                            <label>Monthly Savings: $<input type="number" id="monthly-savings" value="10" min="1" onchange="calculateGoal()"></label>
                        </div>
                        <div class="result" id="goal-result">You'll reach your $100 goal in 10 months! 🎉</div>
                    </div>
                </div>
                
                <button class="quiz-btn" onclick="startChapterQuiz(5)">Take Chapter 5 Quiz</button>
            </div>
        `,
        quiz: [
            {
                question: "What's the best way to reach a savings goal?",
                options: ["Save whatever is left over", "Set aside money regularly", "Wait for birthday money", "Ask parents for money"],
                correct: 1
            },
            {
                question: "If you want to save $120 for a game and can save $15 per month, how long will it take?",
                options: ["6 months", "8 months", "10 months", "12 months"],
                correct: 1
            }
        ]
    },
    
    6: {
        title: "🌱 The Magic of Compounding",
        content: `
            <div class="chapter-lesson">
                <h3>How Money Can Grow By Itself!</h3>
                <div class="compounding-infographic">
                    <div class="magic-explanation">
                        <h4>✨ What is Compounding?</h4>
                        <p>Compounding is when your money earns money, and then that money earns even MORE money!</p>
                        
                        <div class="compound-example">
                            <div class="year-card">
                                <h5>Year 1</h5>
                                <p>Start: $100</p>
                                <p>Earn 10%: +$10</p>
                                <p><strong>End: $110</strong></p>
                            </div>
                            <div class="arrow">→</div>
                            <div class="year-card">
                                <h5>Year 2</h5>
                                <p>Start: $110</p>
                                <p>Earn 10%: +$11</p>
                                <p><strong>End: $121</strong></p>
                            </div>
                            <div class="arrow">→</div>
                            <div class="year-card">
                                <h5>Year 3</h5>
                                <p>Start: $121</p>
                                <p>Earn 10%: +$12.10</p>
                                <p><strong>End: $133.10</strong></p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="compound-calculator">
                        <h4>🧮 Compound Interest Calculator</h4>
                        <div class="calculator-inputs">
                            <label>Starting Amount: $<input type="number" id="compound-principal" value="100" min="1" onchange="calculateCompound()"></label>
                            <label>Years to Save: <input type="number" id="compound-years" value="5" min="1" max="20" onchange="calculateCompound()"></label>
                            <label>Interest Rate: <input type="number" id="compound-rate" value="5" min="1" max="15" step="0.5" onchange="calculateCompound()">%</label>
                        </div>
                        <div class="compound-result" id="compound-result">
                            After 5 years, your $100 will become <strong>$127.63</strong>!<br>
                            That's <strong>$27.63</strong> in free money! 💰
                        </div>
                    </div>
                    
                    <div class="compound-tips">
                        <h4>🚀 Power Tips</h4>
                        <ul>
                            <li><strong>Start Early:</strong> The sooner you start, the more time your money has to grow!</li>
                            <li><strong>Be Patient:</strong> Compounding works best over many years</li>
                            <li><strong>Don't Touch It:</strong> Let your money stay and grow</li>
                            <li><strong>Add More:</strong> Add money regularly to boost the effect</li>
                        </ul>
                    </div>
                </div>
                
                <button class="quiz-btn" onclick="startChapterQuiz(6)">Take Chapter 6 Quiz</button>
            </div>
        `,
        quiz: [
            {
                question: "What is compounding?",
                options: ["Spending money quickly", "Money earning money on itself", "Borrowing money", "Losing money over time"],
                correct: 1
            },
            {
                question: "When does compounding work best?",
                options: ["Over a short time", "Over many years", "Only with big amounts", "Only for adults"],
                correct: 1
            }
        ]
    },
    
    7: {
        title: "⏳ Delayed Gratification - The Marshmallow Test",
        content: `
            <div class="chapter-lesson">
                <h3>Learning to Wait for Better Rewards</h3>
                <div class="gratification-infographic">
                    <div class="marshmallow-test">
                        <h4>🍭 The Famous Marshmallow Test</h4>
                        <p>Scientists gave kids a choice: eat 1 marshmallow now, OR wait 15 minutes and get 2 marshmallows!</p>
                        
                        <div class="test-scenarios">
                            <div class="scenario immediate">
                                <div class="scenario-icon">🍭</div>
                                <h5>Option A: Right Now</h5>
                                <p>1 marshmallow immediately</p>
                                <div class="outcome">Quick satisfaction, but less reward</div>
                            </div>
                            
                            <div class="vs">VS</div>
                            
                            <div class="scenario delayed">
                                <div class="scenario-icon">🍭🍭</div>
                                <h5>Option B: Wait 15 Minutes</h5>
                                <p>2 marshmallows after waiting</p>
                                <div class="outcome">More patience = DOUBLE the reward!</div>
                            </div>
                        </div>
                        
                        <div class="test-results">
                            <h5>📊 Amazing Results:</h5>
                            <p>Kids who waited did better in school, made more money as adults, and were happier in life!</p>
                        </div>
                    </div>
                    
                    <div class="money-examples">
                        <h4>💰 Money Examples of Delayed Gratification</h4>
                        <div class="example-cards">
                            <div class="example-card">
                                <h5>🎮 Video Game Example</h5>
                                <p><strong>Now:</strong> Buy cheap game for $20</p>
                                <p><strong>Wait:</strong> Save for 2 months, buy awesome game for $60</p>
                                <div class="lesson">Patience = Better games!</div>
                            </div>
                            
                            <div class="example-card">
                                <h5>🚲 Bike Example</h5>
                                <p><strong>Now:</strong> Buy used bike for $50</p>
                                <p><strong>Wait:</strong> Save for 6 months, buy new bike for $200</p>
                                <div class="lesson">Waiting = Better, longer-lasting bike!</div>
                            </div>
                            
                            <div class="example-card">
                                <h5>📱 Phone Example</h5>
                                <p><strong>Now:</strong> Buy basic phone for $100</p>
                                <p><strong>Wait:</strong> Save for 1 year, buy great phone for $400</p>
                                <div class="lesson">Patience = Phone that lasts years!</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="waiting-strategies">
                        <h4>🎯 Strategies to Help You Wait</h4>
                        <ul>
                            <li><strong>🖼️ Visualize:</strong> Picture how happy you'll be with the better reward</li>
                            <li><strong>📊 Track Progress:</strong> Make a chart showing how close you are to your goal</li>
                            <li><strong>🎉 Celebrate Milestones:</strong> Reward yourself for reaching halfway points</li>
                            <li><strong>🤝 Get Support:</strong> Tell family about your goal so they can cheer you on</li>
                            <li><strong>🚫 Avoid Temptation:</strong> Don't go to stores when you're trying to save</li>
                        </ul>
                    </div>
                </div>
                
                <button class="quiz-btn" onclick="startChapterQuiz(7)">Take Chapter 7 Quiz</button>
            </div>
        `,
        quiz: [
            {
                question: "In the marshmallow test, what happened to kids who waited?",
                options: ["They got sick from too much sugar", "They did better in life later on", "They gave up easily", "Nothing special happened"],
                correct: 1
            },
            {
                question: "What's a good strategy to help you wait for a bigger reward?",
                options: ["Forget about your goal", "Picture how happy you'll be with the better reward", "Spend money on small things instead", "Ask others to buy it for you"],
                correct: 1
            }
        ]
    },
    
    8: {
        title: "🛡️ Financial Safety & Scam Protection",
        content: `
            <div class="chapter-lesson">
                <h3>Staying Safe with Your Money</h3>
                <div class="safety-infographic">
                    <div class="scam-awareness">
                        <h4>🚨 Common Scams to Watch Out For</h4>
                        <div class="scam-cards">
                            <div class="scam-card">
                                <div class="scam-icon">📧</div>
                                <h5>Email Scams</h5>
                                <p>"You've won $1 million! Just send us your bank details!"</p>
                                <div class="red-flag">🚩 Red Flag: Too good to be true</div>
                            </div>
                            
                            <div class="scam-card">
                                <div class="scam-icon">📞</div>
                                <h5>Phone Scams</h5>
                                <p>"This is your bank. We need your password right now!"</p>
                                <div class="red-flag">🚩 Red Flag: Asking for private info</div>
                            </div>
                            
                            <div class="scam-card">
                                <div class="scam-icon">🛒</div>
                                <h5>Online Shopping Scams</h5>
                                <p>"Amazing phone for only $50! Pay now!"</p>
                                <div class="red-flag">🚩 Red Flag: Price way too low</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="protection-rules">
                        <h4>🛡️ Golden Rules of Money Safety</h4>
                        <div class="rule-list">
                            <div class="rule">
                                <span class="rule-number">1</span>
                                <div class="rule-content">
                                    <h5>Never Share Private Info</h5>
                                    <p>Bank passwords, social security numbers, and addresses are secret!</p>
                                </div>
                            </div>
                            
                            <div class="rule">
                                <span class="rule-number">2</span>
                                <div class="rule-content">
                                    <h5>If It Sounds Too Good to Be True...</h5>
                                    <p>It probably is! No one gives away free money or super cheap expensive items.</p>
                                </div>
                            </div>
                            
                            <div class="rule">
                                <span class="rule-number">3</span>
                                <div class="rule-content">
                                    <h5>Always Ask a Trusted Adult</h5>
                                    <p>Before making any financial decisions, talk to parents or guardians.</p>
                                </div>
                            </div>
                            
                            <div class="rule">
                                <span class="rule-number">4</span>
                                <div class="rule-content">
                                    <h5>Research Before You Buy</h5>
                                    <p>Check reviews and compare prices before spending money online.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="emergency-tips">
                        <h4>🆘 What to Do If You Think You've Been Scammed</h4>
                        <ol>
                            <li><strong>Don't Panic:</strong> Stay calm and think clearly</li>
                            <li><strong>Tell an Adult:</strong> Immediately inform a parent or guardian</li>
                            <li><strong>Don't Send More Money:</strong> Never try to "fix" it by paying more</li>
                            <li><strong>Keep Records:</strong> Save emails, texts, or any evidence</li>
                            <li><strong>Report It:</strong> Help adults report it to authorities</li>
                        </ol>
                    </div>
                </div>
                
                <button class="quiz-btn" onclick="startChapterQuiz(8)">Take Chapter 8 Quiz</button>
            </div>
        `,
        quiz: [
            {
                question: "What should you do if someone asks for your bank password?",
                options: ["Give it to them immediately", "Never share it with anyone", "Share it only with friends", "Write it down for them"],
                correct: 1
            },
            {
                question: "If a deal sounds too good to be true, what should you think?",
                options: ["It's definitely real", "It's probably a scam", "I should hurry and buy it", "I should tell all my friends"],
                correct: 1
            }
        ]
    }
    // Additional chapters would continue here...
};

function initMoneyAcademy() {
    loadProgress();
    updateChapterSelector();
    loadChapter(currentChapter);
}

function loadProgress() {
    const saved = localStorage.getItem('moneyAcademyProgress');
    if (saved) {
        const progress = JSON.parse(saved);
        completedChapters = progress.completed || [];
        currentChapter = progress.current || 1;
        chapterProgress = progress.chapters || {};
    }
}

function saveProgress() {
    const progress = {
        completed: completedChapters,
        current: currentChapter,
        chapters: chapterProgress
    };
    localStorage.setItem('moneyAcademyProgress', JSON.stringify(progress));
}

function updateChapterSelector() {
    const cards = document.querySelectorAll('.chapter-card');
    
    cards.forEach((card, index) => {
        const chapterNum = index + 1;
        card.classList.remove('active', 'completed');
        
        if (completedChapters.includes(chapterNum)) {
            card.classList.add('completed');
        }
        
        if (chapterNum === currentChapter) {
            card.classList.add('active');
        }
        
        // Allow access to any chapter (remove sequential restriction)
        card.onclick = () => {
            loadChapter(chapterNum);
        };
        
        // Remove any disabled styling that might prevent clicks
        card.style.opacity = '1';
        card.style.pointerEvents = 'auto';
        card.style.cursor = 'pointer';
    });
    
    // Update progress bar
    const progressFill = document.getElementById('money-progress');
    const progressText = document.getElementById('money-progress-text');
    const progressPercent = (completedChapters.length / 8) * 100;
    
    if (progressFill) progressFill.style.width = `${progressPercent}%`;
    if (progressText) progressText.textContent = `Chapter ${currentChapter} of 8 (${completedChapters.length} completed)`;
}

function loadChapter(chapterNum) {
    currentChapter = chapterNum;
    const chapter = moneyChapters[chapterNum];
    
    if (!chapter) {
        document.getElementById('chapter-content').innerHTML = `
            <div class="coming-soon">
                <h3>🚧 Coming Soon!</h3>
                <p>This chapter is still being developed. Check back soon!</p>
            </div>
        `;
        return;
    }
    
    document.getElementById('chapter-content').innerHTML = chapter.content;
    updateChapterSelector();
    
    // Initialize chapter-specific features
    if (chapterNum === 2) {
        calculateInterest();
    } else if (chapterNum === 3) {
        calculateBudget();
    } else if (chapterNum === 5) {
        calculateGoal();
    } else if (chapterNum === 6) {
        calculateCompound();
    }
}

function calculateInterest() {
    const principal = parseFloat(document.getElementById('principal')?.value || 100);
    const rate = parseFloat(document.getElementById('rate')?.value || 2);
    const years = parseFloat(document.getElementById('years')?.value || 1);
    
    const amount = principal * (1 + rate/100) ** years;
    const interest = amount - principal;
    
    const resultElement = document.getElementById('interest-result');
    if (resultElement) {
        resultElement.innerHTML = `
            You'll have <strong>$${amount.toFixed(2)}</strong> after ${years} year${years !== 1 ? 's' : ''}!<br>
            That's <strong>$${interest.toFixed(2)}</strong> in interest earned! 💰
        `;
    }
}

function calculateBudget() {
    const income = parseFloat(document.getElementById('monthly-income')?.value || 100);
    
    const needs = income * 0.5;
    const wants = income * 0.3;
    const savings = income * 0.2;
    
    const resultElement = document.getElementById('budget-results');
    if (resultElement) {
        resultElement.innerHTML = `
            <p><strong>Needs:</strong> $${needs.toFixed(2)} (50%)</p>
            <p><strong>Wants:</strong> $${wants.toFixed(2)} (30%)</p>
            <p><strong>Savings:</strong> $${savings.toFixed(2)} (20%)</p>
        `;
    }
}

function calculateGoal() {
    const goalAmount = parseFloat(document.getElementById('goal-amount')?.value || 100);
    const monthlySavings = parseFloat(document.getElementById('monthly-savings')?.value || 10);
    
    const months = Math.ceil(goalAmount / monthlySavings);
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    let timeString = "";
    if (years > 0) {
        timeString = `${years} year${years > 1 ? 's' : ''}`;
        if (remainingMonths > 0) {
            timeString += ` and ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
        }
    } else {
        timeString = `${months} month${months > 1 ? 's' : ''}`;
    }
    
    const resultElement = document.getElementById('goal-result');
    if (resultElement) {
        resultElement.innerHTML = `You'll reach your $${goalAmount} goal in ${timeString}! 🎉`;
    }
}

function calculateCompound() {
    const principal = parseFloat(document.getElementById('compound-principal')?.value || 100);
    const years = parseFloat(document.getElementById('compound-years')?.value || 5);
    const rate = parseFloat(document.getElementById('compound-rate')?.value || 5) / 100;
    
    const amount = principal * Math.pow((1 + rate), years);
    const interest = amount - principal;
    
    const resultElement = document.getElementById('compound-result');
    if (resultElement) {
        resultElement.innerHTML = `
            After ${years} year${years !== 1 ? 's' : ''}, your $${principal} will become <strong>$${amount.toFixed(2)}</strong>!<br>
            That's <strong>$${interest.toFixed(2)}</strong> in free money! 💰
        `;
    }
}

function startChapterQuiz(chapterNum) {
    const chapter = moneyChapters[chapterNum];
    if (!chapter || !chapter.quiz) return;
    
    let currentQuestion = 0;
    let score = 0;
    
    function showQuestion() {
        if (currentQuestion >= chapter.quiz.length) {
            // Quiz complete
            const percentage = (score / chapter.quiz.length) * 100;
            const passed = percentage >= 70;
            
            alert(`📊 Quiz Complete!\n\nScore: ${score}/${chapter.quiz.length} (${percentage.toFixed(0)}%)\n\n${passed ? '🎉 Congratulations! You passed!' : '📚 Keep studying and try again!'}`);
            
            if (passed && !completedChapters.includes(chapterNum)) {
                completedChapters.push(chapterNum);
                if (chapterNum === currentChapter && currentChapter < 8) {
                    currentChapter++;
                }
                saveProgress();
                updateChapterSelector();
            }
            return;
        }
        
        const question = chapter.quiz[currentQuestion];
        const optionsHtml = question.options.map((option, index) => 
            `<button class="quiz-option" onclick="answerQuestion(${index})">${option}</button>`
        ).join('');
        
        document.getElementById('chapter-content').innerHTML = `
            <div class="quiz-container">
                <h3>📝 Chapter ${chapterNum} Quiz</h3>
                <div class="quiz-progress">Question ${currentQuestion + 1} of ${chapter.quiz.length}</div>
                <div class="quiz-question">
                    <h4>${question.question}</h4>
                    <div class="quiz-options">
                        ${optionsHtml}
                    </div>
                </div>
                <div class="quiz-score">Score: ${score}/${currentQuestion}</div>
            </div>
        `;
    }
    
    window.answerQuestion = function(selectedIndex) {
        const question = chapter.quiz[currentQuestion];
        const correct = selectedIndex === question.correct;
        
        if (correct) {
            score++;
            alert('✅ Correct!');
        } else {
            alert(`❌ Incorrect. The right answer is: ${question.options[question.correct]}`);
        }
        
        currentQuestion++;
        setTimeout(showQuestion, 1000);
    };
    
    showQuestion();
}
