class FeedbackWidget {
    constructor() {
        this.isVisible = false;
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        
        this.createWidget();
        this.attachEventListeners();
        this.initialized = true;
    }

    createWidget() {
        const widgetHTML = `
            <div class="feedback-widget-fab" id="feedbackFab" onclick="feedbackWidget.showModal()">
                💬
                <span class="fab-tooltip">Feedback</span>
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
                            
                            <button type="button" class="btn-cancel" onclick="feedbackWidget.closeModal()">
                                Maybe Later
                            </button>
                        </div>
                        
                        <div class="typeform-footer">
                            <p style="font-size: 13px; color: #666; text-align: center; margin-top: 15px;">
                                💡 Your feedback helps us improve the gaming experience for everyone!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add to body
        document.body.insertAdjacentHTML('beforeend', widgetHTML);
    }

    attachEventListeners() {
        // Close modal when clicking outside
        document.getElementById('feedbackModal').addEventListener('click', (e) => {
            if (e.target.id === 'feedbackModal') {
                this.closeModal();
            }
        });

        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isVisible) {
                this.closeModal();
            }
        });
    }

    showModal() {
        const modal = document.getElementById('feedbackModal');
        modal.style.display = 'flex';
        modal.style.opacity = '0';
        modal.style.transform = 'scale(0.9)';
        
        // Animate in
        requestAnimationFrame(() => {
            modal.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            modal.style.opacity = '1';
            modal.style.transform = 'scale(1)';
        });

        this.isVisible = true;
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        const modal = document.getElementById('feedbackModal');
        modal.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        modal.style.opacity = '0';
        modal.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);

        this.isVisible = false;
    }

    trackClick() {
        // Track that user clicked to open TypeForm
        console.log('Feedback form opened:', new Date().toISOString());
        
        // Optional: Add analytics tracking here
        if (typeof gtag !== 'undefined') {
            gtag('event', 'feedback_form_opened', {
                'event_category': 'engagement',
                'event_label': 'typeform_click'
            });
        }
        
        // Auto-close the modal after a short delay
        setTimeout(() => {
            this.closeModal();
        }, 1000);
    }

    // Method to show the feedback button with animation
    show() {
        const fab = document.getElementById('feedbackFab');
        if (fab) {
            fab.style.display = 'flex';
            fab.style.opacity = '0';
            fab.style.transform = 'scale(0) translateY(20px)';
            
            requestAnimationFrame(() => {
                fab.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                fab.style.opacity = '1';
                fab.style.transform = 'scale(1) translateY(0)';
            });
        }
    }

    // Method to hide the feedback button
    hide() {
        const fab = document.getElementById('feedbackFab');
        if (fab) {
            fab.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            fab.style.opacity = '0';
            fab.style.transform = 'scale(0) translateY(20px)';
            
            setTimeout(() => {
                fab.style.display = 'none';
            }, 300);
        }
    }
}

// Initialize feedback widget
const feedbackWidget = new FeedbackWidget();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        feedbackWidget.init();
        setTimeout(() => feedbackWidget.show(), 1000); // Show after 1 second
    });
} else {
    feedbackWidget.init();
    setTimeout(() => feedbackWidget.show(), 1000);
}
