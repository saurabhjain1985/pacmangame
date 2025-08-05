// Universal Back Button - Always Visible on All Game Pages
function createUniversalBackButton() {
    // Check if we're on the main index page - don't add back button there
    if (window.location.pathname.endsWith('index.html') || 
        window.location.pathname.endsWith('/') ||
        window.location.pathname === '/') {
        return;
    }
    
    // Check if universal back button already exists
    if (document.querySelector('.universal-back-button')) {
        return;
    }
    
    // Create the back button
    const backButton = document.createElement('a');
    backButton.className = 'universal-back-button';
    backButton.href = 'index.html';
    backButton.innerHTML = '<span class="back-arrow">←</span> Back to Games';
    
    // Add click handler for better UX
    backButton.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Smooth transition back
        document.body.style.transition = 'opacity 0.3s ease';
        document.body.style.opacity = '0.7';
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 150);
    });
    
    // Add to page
    document.body.appendChild(backButton);
    document.body.classList.add('has-universal-back');
    
    console.log('Universal back button added');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createUniversalBackButton);
} else {
    createUniversalBackButton();
}

// Also run when page is fully loaded (backup)
window.addEventListener('load', createUniversalBackButton);
