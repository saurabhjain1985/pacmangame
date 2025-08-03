// Feedback Widget - User Feedback Collection System
class FeedbackWidget {
    constructor() {
        this.isSubmitting = false;
        this.init();
    }

    init() {
        this.createWidget();
        this.attachEventListeners();
    }

    createWidget() {
        // Create feedback widget HTML
        const widgetHTML = `
            <div class="feedback-widget">
                <button class="feedback-trigger" id="feedback-trigger-btn">
                    💬 Feedback
                </button>
            </div>

            <div class="feedback-modal" id="feedbackModal">
                <div class="feedback-form" id="feedbackForm">
                    <h2>💬 Share Your Feedback</h2>
                    <p>Help us make our games better! Your feedback is valuable to us.</p>
                    
                    <div class="typeform-integration">
                        <div class="typeform-intro">
                            <p>🚀 We've created a quick feedback form that includes:</p>
                            <ul style="text-align: left; margin: 15px 0; padding-left: 20px;">
                                <li>✨ Easy-to-use interface</li>
                                <li>📧 Optional email contact</li>
                                <li>📱 Optional mobile contact</li>
                                <li>🎮 Game-specific feedback options</li>
                            </ul>
                        </div>
                        
                        <div class="typeform-actions">
                            <a href="https://form.typeform.com/to/pCJMxbd8" 
                               target="_blank" 
                               rel="noopener noreferrer"
                               class="btn-typeform"
                               onclick="feedbackWidget.trackClick()">
                                <span class="btn-icon">🌟</span>
                                <span class="btn-text">Open Feedback Form</span>
                                <span class="btn-subtitle">Opens in new tab • Takes 2 minutes</span>
                            </a>
                            
                            <button type="button" class="btn-cancel" id="feedback-close-btn">
                                Maybe Later
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add to body
        document.body.insertAdjacentHTML('beforeend', widgetHTML);
    }
                            </button>
                        </div>
                        
                        <div class="typeform-footer">
                            <p style="font-size: 13px; color: #666; text-align: center; margin-top: 15px;">
                                💡 Your feedback helps us improve the gaming experience for everyone!
                            </p>
                        </div>
                    </div>
                        <div class="form-group">
                            <label for="feedbackType">What would you like to share?</label>
                            <select id="feedbackType" required>
                                <option value="">Select feedback type</option>
                                <option value="bug">🐛 Bug Report</option>
                                <option value="feature">✨ Feature Request</option>
                                <option value="improvement">🔧 Improvement Suggestion</option>
                                <option value="compliment">👍 Compliment</option>
                                <option value="question">❓ Question</option>
                                <option value="other">💭 Other</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="feedbackGame">Which game is this about?</label>
                            <select id="feedbackGame">
                                <option value="">General feedback</option>
                                <option value="memory">🧠 Memory Game</option>
                                <option value="tetris">🧩 Tetris</option>
                                <option value="breakout">🏓 Breakout</option>
                                <option value="snake">🐍 Snake</option>
                                <option value="pacman">👻 Pacman</option>
                                <option value="puzzle">🎲 Puzzle Games</option>
                                <option value="math">🔢 Math Tables</option>
                                <option value="stories">🌙 Bedtime Stories</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="feedbackMessage">Your feedback</label>
                            <textarea 
                                id="feedbackMessage" 
                                placeholder="Tell us what you think! Be as detailed as you'd like..."
                                required
                                maxlength="1000"
                            ></textarea>
                            <small style="color: #999; font-size: 12px;">
                                <span id="charCount">0</span>/1000 characters
                            </small>
                        </div>

                        <div class="form-group optional">
                            <label for="feedbackEmail">Email</label>
                            <input 
                                type="email" 
                                id="feedbackEmail" 
                                placeholder="your.email@example.com"
                                title="We'll only use this to follow up on your feedback"
                            >
                        </div>

                        <div class="form-group optional">
                            <label for="feedbackPhone">Phone</label>
                            <input 
                                type="tel" 
                                id="feedbackPhone" 
                                placeholder="+1 (555) 123-4567"
                                title="Optional - for urgent issues only"
                            >
                        </div>

                        <div class="feedback-actions">
                            <button type="button" class="btn-cancel" onclick="feedbackWidget.closeModal()">
                                Cancel
                            </button>
                            <button type="submit" class="btn-submit" id="submitBtn">
                                Send Feedback
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        // Add to body
        document.body.insertAdjacentHTML('beforeend', widgetHTML);
    }

    attachEventListeners() {
        // Add click listener to feedback trigger button
        const triggerBtn = document.getElementById('feedback-trigger-btn');
        if (triggerBtn) {
            triggerBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Feedback button clicked');
                this.openModal();
            });
        }

        // Add click listener to close button
        const closeBtn = document.getElementById('feedback-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeModal();
            });
        }

        // Close modal on outside click
        const modal = document.getElementById('feedbackModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target.id === 'feedbackModal') {
                    this.closeModal();
                }
            });
        }

        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    openModal() {
        const modal = document.getElementById('feedbackModal');
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            console.log('Feedback modal opened');
        }
    }

    closeModal() {
        const modal = document.getElementById('feedbackModal');
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
            console.log('Feedback modal closed');
        }
    }

    trackClick() {
        console.log('Feedback form link clicked');
        // Track the click for analytics if needed
        setTimeout(() => {
            this.closeModal();
        }, 1000);
    }

    resetForm() {
        document.getElementById('feedbackFormElement').reset();
        document.getElementById('charCount').textContent = '0';
        document.getElementById('charCount').style.color = '#999';
    }

    async submitFeedback() {
        if (this.isSubmitting) return;
        
        this.isSubmitting = true;
        const submitBtn = document.getElementById('submitBtn');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        try {
            // Collect form data
            const formData = {
                type: document.getElementById('feedbackType').value,
                game: document.getElementById('feedbackGame').value,
                message: document.getElementById('feedbackMessage').value,
                email: document.getElementById('feedbackEmail').value,
                phone: document.getElementById('feedbackPhone').value,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                url: window.location.href
            };

            // Validate required fields
            if (!formData.type || !formData.message.trim()) {
                throw new Error('Please fill in all required fields');
            }

            // For now, we'll simulate sending to a service
            // In production, you would send this to your backend API
            await this.sendToService(formData);
            
            this.showSuccessMessage();
            
            // Auto-close after success
            setTimeout(() => {
                this.closeModal();
            }, 3000);

        } catch (error) {
            alert(`Error sending feedback: ${error.message}\n\nPlease try again or contact support directly.`);
        } finally {
            this.isSubmitting = false;
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    async sendToService(formData) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Store locally for now (in production, send to your server)
        const feedbacks = JSON.parse(localStorage.getItem('userFeedbacks') || '[]');
        feedbacks.unshift({
            id: Date.now().toString(),
            ...formData
        });
        
        // Keep only last 100 feedbacks locally
        if (feedbacks.length > 100) {
            feedbacks.splice(100);
        }
        
        localStorage.setItem('userFeedbacks', JSON.stringify(feedbacks));
        
        // In production, replace this with:
        /*
        const response = await fetch('/api/feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            throw new Error('Failed to send feedback');
        }
        */
        
        console.log('Feedback submitted:', formData);
    }

    showSuccessMessage() {
        const form = document.getElementById('feedbackForm');
        form.innerHTML = `
            <div class="feedback-success">
                <div class="success-icon">✅</div>
                <h3>Thank You!</h3>
                <p>Your feedback has been sent successfully. We appreciate you taking the time to help us improve!</p>
                <button class="btn-submit" onclick="feedbackWidget.closeModal()">
                    Close
                </button>
            </div>
        `;
    }

    // Method to get all feedback (for admin purposes)
    getAllFeedback() {
        return JSON.parse(localStorage.getItem('userFeedbacks') || '[]');
    }

    // Method to clear all feedback (for admin purposes)
    clearAllFeedback() {
        localStorage.removeItem('userFeedbacks');
        console.log('All feedback cleared');
    }
}

// Initialize feedback widget when DOM is loaded
let feedbackWidget;

document.addEventListener('DOMContentLoaded', () => {
    // Add CSS if not already included
    if (!document.querySelector('link[href*="feedback-widget.css"]')) {
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = 'feedback-widget.css';
        document.head.appendChild(cssLink);
    }
    
    // Initialize widget
    feedbackWidget = new FeedbackWidget();
});

// Global initialization function
function initializeFeedbackWidget() {
    if (typeof feedbackWidget === 'undefined' || !feedbackWidget) {
        feedbackWidget = new FeedbackWidget();
        console.log('✅ Feedback Widget Initialized');
    }
    return feedbackWidget;
}

// Export for use in other modules if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FeedbackWidget;
}
