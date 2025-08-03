// Simple Feedback Widget - Fixed Version
let feedbackWidget = null;

class SimpleFeedbackWidget {
    constructor() {
        this.createWidget();
        this.setupEventListeners();
    }

    createWidget() {
        const widgetHTML = `
            <div class="feedback-widget">
                <button class="feedback-trigger" id="feedback-trigger-btn">
                    💬 Feedback
                </button>
            </div>

            <div class="feedback-modal" id="feedbackModal" style="display: none;">
                <div class="feedback-overlay">
                    <div class="feedback-content">
                        <h2>💬 Share Your Feedback</h2>
                        <p>Help us improve the games! Your feedback is valuable.</p>
                        
                        <div class="feedback-options">
                            <a href="https://form.typeform.com/to/pCJMxbd8" 
                               target="_blank" 
                               class="feedback-link">
                                🌟 Open Feedback Form
                            </a>
                            
                            <button class="feedback-close" id="feedback-close-btn">
                                Maybe Later
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', widgetHTML);
    }

    setupEventListeners() {
        // Open modal
        const triggerBtn = document.getElementById('feedback-trigger-btn');
        if (triggerBtn) {
            triggerBtn.addEventListener('click', () => {
                console.log('Feedback button clicked');
                this.openModal();
            });
        }

        // Close modal
        const closeBtn = document.getElementById('feedback-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeModal();
            });
        }

        // Close on backdrop
        const modal = document.getElementById('feedbackModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }

        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    openModal() {
        const modal = document.getElementById('feedbackModal');
        if (modal) {
            modal.style.display = 'flex';
            console.log('Feedback modal opened');
        }
    }

    closeModal() {
        const modal = document.getElementById('feedbackModal');
        if (modal) {
            modal.style.display = 'none';
            console.log('Feedback modal closed');
        }
    }
}

// Initialize function
function initializeFeedbackWidget() {
    if (!feedbackWidget) {
        feedbackWidget = new SimpleFeedbackWidget();
        console.log('✅ Simple Feedback Widget Initialized');
    }
    return feedbackWidget;
}

// Auto-initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeFeedbackWidget();
});

// Add basic styles
const feedbackStyles = document.createElement('style');
feedbackStyles.textContent = `
    .feedback-widget {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
    }

    .feedback-trigger {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        padding: 12px 16px;
        border-radius: 25px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
    }

    .feedback-trigger:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0,0,0,0.3);
    }

    .feedback-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 10000;
        align-items: center;
        justify-content: center;
    }

    .feedback-overlay {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
    }

    .feedback-content {
        background: white;
        border-radius: 20px;
        padding: 30px;
        max-width: 400px;
        width: 100%;
        text-align: center;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    }

    .feedback-content h2 {
        margin: 0 0 10px 0;
        color: #333;
    }

    .feedback-content p {
        margin: 0 0 25px 0;
        color: #666;
        line-height: 1.5;
    }

    .feedback-options {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .feedback-link {
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        text-decoration: none;
        padding: 15px 25px;
        border-radius: 15px;
        font-weight: 600;
        transition: all 0.3s ease;
    }

    .feedback-link:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
        text-decoration: none;
        color: white;
    }

    .feedback-close {
        background: #f3f4f6;
        color: #666;
        border: none;
        padding: 12px 25px;
        border-radius: 15px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .feedback-close:hover {
        background: #e5e7eb;
        color: #333;
    }

    @media (max-width: 480px) {
        .feedback-widget {
            right: 15px;
            bottom: 70px;
        }
        
        .feedback-trigger {
            padding: 10px 14px;
            font-size: 13px;
        }
        
        .feedback-content {
            margin: 10px;
            padding: 25px 20px;
        }
    }
`;
document.head.appendChild(feedbackStyles);
