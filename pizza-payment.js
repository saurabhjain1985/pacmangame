// Pizza Payment Widget JavaScript
class PizzaPaymentWidget {
    constructor() {
        this.selectedAmount = 299;
        this.upiId = '8861798719@ybl';
        this.init();
    }

    init() {
        this.createWidget();
        this.setupEventListeners();
    }

    createWidget() {
        // Create widget button
        const widget = document.createElement('div');
        widget.className = 'pizza-payment-widget';
        widget.innerHTML = `
            <div class="pizza-icon">🍕</div>
            <span>Buy me a pizza!</span>
        `;
        document.body.appendChild(widget);

        // Create modal
        const modal = document.createElement('div');
        modal.className = 'pizza-payment-modal';
        modal.innerHTML = `
            <div class="pizza-payment-content">
                <div class="pizza-payment-header">
                    🍕 Buy Me a Pizza! 🍕
                </div>
                <div class="pizza-payment-text">
                    Love the games? Help keep them running and support new features by buying me a pizza! 
                    Every contribution helps improve the gaming experience for everyone! 🎮✨
                </div>
                <div class="pizza-amount-selector">
                    <button class="pizza-amount-btn selected" data-amount="299">
                        🍕 1 Pizza<br>₹299
                    </button>
                    <button class="pizza-amount-btn" data-amount="598">
                        🍕🍕 2 Pizzas<br>₹598
                    </button>
                    <button class="pizza-amount-btn" data-amount="897">
                        🍕🍕🍕 3 Pizzas<br>₹897
                    </button>
                    <button class="pizza-amount-btn" data-amount="1196">
                        🍕🍕🍕🍕 Pizza Party!<br>₹1196
                    </button>
                </div>
                <div class="pizza-upi-info">
                    <div>💳 UPI Payment Details:</div>
                    <div class="pizza-upi-id">${this.upiId}</div>
                    <div style="font-size: 0.9rem; opacity: 0.9;">
                        Use any UPI app to send payment
                    </div>
                </div>
                <div class="pizza-payment-buttons">
                    <button class="pizza-pay-btn" id="pizza-pay-now">
                        💸 Pay ₹<span id="selected-amount">299</span>
                    </button>
                    <button class="pizza-close-btn" id="pizza-close" type="button">
                        ✖️ Close
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        this.widget = widget;
        this.modal = modal;
    }

    setupEventListeners() {
        // Open modal
        this.widget.addEventListener('click', () => {
            console.log('Pizza widget clicked');
            this.openModal();
        });

        // Debug: Log modal and close button existence
        console.log('Modal element:', this.modal);
        const closeBtn = this.modal.querySelector('#pizza-close');
        const closeBtnByClass = this.modal.querySelector('.pizza-close-btn');
        console.log('Close button by ID:', closeBtn);
        console.log('Close button by class:', closeBtnByClass);

        // Close modal - Method 1: Direct click on close button
        if (closeBtn) {
            closeBtn.onclick = (e) => {
                console.log('Close button clicked via onclick');
                e.preventDefault();
                e.stopPropagation();
                this.closeModal();
                return false;
            };
            
            closeBtn.addEventListener('click', (e) => {
                console.log('Close button clicked via addEventListener');
                e.preventDefault();
                e.stopPropagation();
                this.closeModal();
            });
        } else {
            console.error('Close button not found by ID!');
        }

        // Method 2: Event delegation on entire modal
        this.modal.addEventListener('click', (e) => {
            console.log('Modal clicked, target:', e.target);
            console.log('Target ID:', e.target.id);
            console.log('Target classes:', e.target.className);
            
            if (e.target.id === 'pizza-close' || e.target.classList.contains('pizza-close-btn')) {
                console.log('Close button detected via delegation');
                e.preventDefault();
                e.stopPropagation();
                this.closeModal();
                return false;
            }
            
            if (e.target === this.modal) {
                console.log('Backdrop clicked');
                this.closeModal();
            }
        });

        // Amount selection
        const amountButtons = this.modal.querySelectorAll('.pizza-amount-btn');
        amountButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                amountButtons.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.selectedAmount = parseInt(btn.dataset.amount);
                const amountDisplay = this.modal.querySelector('#selected-amount');
                if (amountDisplay) {
                    amountDisplay.textContent = this.selectedAmount;
                }
            });
        });

        // Pay now button
        const payBtn = this.modal.querySelector('#pizza-pay-now');
        if (payBtn) {
            payBtn.addEventListener('click', () => {
                this.initatePayment();
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.style.display === 'flex') {
                this.closeModal();
            }
        });
    }

    openModal() {
        this.modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Add entrance animation
        const content = this.modal.querySelector('.pizza-payment-content');
        content.style.transform = 'scale(0.8) translateY(50px)';
        content.style.opacity = '0';
        
        setTimeout(() => {
            content.style.transform = 'scale(1) translateY(0)';
            content.style.opacity = '1';
            content.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
        }, 50);
    }

    closeModal() {
        console.log('closeModal() called');
        console.log('Modal display before:', this.modal.style.display);
        
        const content = this.modal.querySelector('.pizza-payment-content');
        if (content) {
            content.style.transform = 'scale(0.8) translateY(50px)';
            content.style.opacity = '0';
        }
        
        setTimeout(() => {
            this.modal.style.display = 'none';
            document.body.style.overflow = '';
            console.log('Modal should be hidden now');
        }, 300);
    }

    initatePayment() {
        // Create UPI payment URL
        const upiUrl = `upi://pay?pa=${this.upiId}&pn=Game%20Developer&mc=5411&tid=${Date.now()}&am=${this.selectedAmount}&cu=INR&tn=Pizza%20Donation%20for%20Game%20Development`;
        
        // Try to open UPI app
        const tempLink = document.createElement('a');
        tempLink.href = upiUrl;
        tempLink.click();
        
        // Show thank you message
        setTimeout(() => {
            alert(`🍕 Thank you for your support! 🎮\n\nIf the UPI app didn't open automatically, please use this UPI ID manually:\n${this.upiId}\n\nAmount: ₹${this.selectedAmount}`);
            this.closeModal();
        }, 1000);
        
        // Track payment attempt (for analytics)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'pizza_payment_attempt', {
                'value': this.selectedAmount,
                'currency': 'INR'
            });
        }
    }

    // Optional: Add floating animation periodically
    startFloatingAnimation() {
        setInterval(() => {
            this.widget.style.animation = 'none';
            setTimeout(() => {
                this.widget.style.animation = 'pizzaBounce 4s ease-in-out infinite';
            }, 100);
        }, 30000); // Every 30 seconds
    }
}

// Initialize Pizza Payment Widget
function initializePizzaPayment() {
    if (document.querySelector('.pizza-payment-widget')) return; // Already initialized
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new PizzaPaymentWidget();
        });
    } else {
        new PizzaPaymentWidget();
    }
}

// Don't auto-initialize - let the main page control it
// initializePizzaPayment();
