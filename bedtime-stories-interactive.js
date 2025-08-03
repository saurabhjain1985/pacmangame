// 🌟 Enhanced Bedtime Stories with Interactive UI
let currentStory = '';
let isPlaying = false;
let currentSynthesis = null;
let currentStep = 1;
let storyData = {
    characters: [],
    theme: '',
    length: 'medium',
    mood: 'happy',
    customSettings: ''
};

// Curated high-quality voices for bedtime stories
const BEDTIME_VOICES = [
    { 
        name: 'Microsoft Zira', 
        lang: 'en-US', 
        avatar: '👩‍🏫',
        description: 'Warm & Gentle',
        rate: 0.85,
        pitch: 1.1
    },
    { 
        name: 'Microsoft David', 
        lang: 'en-US', 
        avatar: '👨‍🎨',
        description: 'Storyteller Voice',
        rate: 0.9,
        pitch: 1.0
    },
    { 
        name: 'Google US English', 
        lang: 'en-US', 
        avatar: '🌟',
        description: 'Clear & Soothing',
        rate: 0.8,
        pitch: 1.15
    },
    { 
        name: 'Microsoft Hazel', 
        lang: 'en-GB', 
        avatar: '🦋',
        description: 'British Charm',
        rate: 0.85,
        pitch: 1.05
    }
];

let selectedVoice = BEDTIME_VOICES[0];
let voiceRate = 0.85;
let voicePitch = 1.1;

// 🎯 Initialize the interactive story builder
function initializeStoryBuilder() {
    setupStepNavigation();
    setupCharacterSelection();
    setupThemeSelection();
    setupSettingsControls();
    setupVoiceSystem();
    setupMagicButtons();
    setupStoryActions();
    
    // Start with step 1
    showStep(1);
    
    console.log('🌟 Interactive Story Builder Initialized!');
}

// 📱 Step Navigation System
function setupStepNavigation() {
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        step.addEventListener('click', () => {
            if (index + 1 <= currentStep || index + 1 === currentStep + 1) {
                showStep(index + 1);
            }
        });
    });
}

function showStep(stepNumber) {
    // Update step indicators
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        step.classList.toggle('active', index + 1 === stepNumber);
        step.classList.toggle('completed', index + 1 < stepNumber);
    });
    
    // Show/hide step content
    const stepContents = document.querySelectorAll('.step-content');
    stepContents.forEach((content, index) => {
        content.style.display = index + 1 === stepNumber ? 'block' : 'none';
    });
    
    currentStep = stepNumber;
    
    // Update navigation buttons
    updateNavigationButtons();
}

function nextStep() {
    if (currentStep < 4) {
        if (validateCurrentStep()) {
            showStep(currentStep + 1);
        }
    } else {
        generateStory();
    }
}

function prevStep() {
    if (currentStep > 1) {
        showStep(currentStep - 1);
    }
}

function validateCurrentStep() {
    switch(currentStep) {
        case 1:
            return storyData.characters.length > 0;
        case 2:
            return storyData.theme !== '';
        case 3:
            return true; // Settings are optional
        case 4:
            return true; // Ready to generate
        default:
            return true;
    }
}

function updateNavigationButtons() {
    const prevBtn = document.querySelector('.btn-prev');
    const nextBtn = document.querySelector('.btn-next');
    
    if (prevBtn) {
        prevBtn.style.display = currentStep > 1 ? 'inline-flex' : 'none';
    }
    
    if (nextBtn) {
        const isValid = validateCurrentStep();
        nextBtn.disabled = !isValid;
        nextBtn.style.opacity = isValid ? '1' : '0.5';
        
        if (currentStep === 4) {
            nextBtn.textContent = '✨ Create Story';
        } else {
            nextBtn.textContent = `Next: ${getStepName(currentStep + 1)} →`;
        }
    }
}

function getStepName(step) {
    const names = ['', 'Characters', 'Theme', 'Settings', 'Magic'];
    return names[step] || 'Story';
}

// 🎭 Character Selection System
function setupCharacterSelection() {
    const characterChips = document.querySelectorAll('.character-chip');
    characterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const character = chip.dataset.character;
            toggleCharacter(character, chip);
        });
    });
}

function toggleCharacter(character, chipElement) {
    const index = storyData.characters.indexOf(character);
    
    if (index > -1) {
        // Remove character
        storyData.characters.splice(index, 1);
        chipElement.classList.remove('selected');
    } else {
        // Add character (max 3)
        if (storyData.characters.length < 3) {
            storyData.characters.push(character);
            chipElement.classList.add('selected');
        } else {
            showToast('Maximum 3 characters allowed!', 'warning');
        }
    }
    
    updateCharacterDisplay();
    updateNavigationButtons();
}

function updateCharacterDisplay() {
    const selectedCount = document.querySelector('.selected-count');
    if (selectedCount) {
        selectedCount.textContent = `${storyData.characters.length}/3 selected`;
    }
}

// 🎨 Theme Selection System
function setupThemeSelection() {
    const themeCards = document.querySelectorAll('.theme-card');
    themeCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove previous selection
            themeCards.forEach(c => c.classList.remove('selected'));
            
            // Select new theme
            card.classList.add('selected');
            storyData.theme = card.dataset.theme;
            
            updateNavigationButtons();
        });
    });
}

// ⚙️ Settings Controls
function setupSettingsControls() {
    // Length selection
    const lengthOptions = document.querySelectorAll('.length-option');
    lengthOptions.forEach(option => {
        option.addEventListener('click', () => {
            lengthOptions.forEach(o => o.classList.remove('active'));
            option.classList.add('active');
            storyData.length = option.dataset.length;
            updateNavigationButtons();
        });
    });
    
    // Mood selection
    const moodOptions = document.querySelectorAll('.mood-option');
    moodOptions.forEach(option => {
        option.addEventListener('click', () => {
            moodOptions.forEach(o => o.classList.remove('active'));
            option.classList.add('active');
            storyData.mood = option.dataset.mood;
            updateNavigationButtons();
        });
    });
    
    // Custom settings
    const customInput = document.querySelector('#customSettings');
    if (customInput) {
        customInput.addEventListener('input', (e) => {
            storyData.customSettings = e.target.value;
        });
    }
}

// 🎧 Enhanced Voice System
function setupVoiceSystem() {
    loadAvailableVoices();
    setupVoiceCards();
    setupVoiceControls();
}

function loadAvailableVoices() {
    return new Promise((resolve) => {
        const synth = window.speechSynthesis;
        let voices = synth.getVoices();
        
        if (voices.length === 0) {
            synth.addEventListener('voiceschanged', () => {
                voices = synth.getVoices();
                filterBedtimeVoices(voices);
                resolve(voices);
            });
        } else {
            filterBedtimeVoices(voices);
            resolve(voices);
        }
    });
}

function filterBedtimeVoices(systemVoices) {
    // Update available voices based on system
    BEDTIME_VOICES.forEach(bedtimeVoice => {
        const systemVoice = systemVoices.find(v => 
            v.name.includes(bedtimeVoice.name.split(' ')[1]) || 
            v.lang === bedtimeVoice.lang
        );
        if (systemVoice) {
            bedtimeVoice.systemVoice = systemVoice;
        }
    });
    
    renderVoiceCards();
}

function setupVoiceCards() {
    const voiceGrid = document.querySelector('.voice-grid');
    if (!voiceGrid) return;
    
    renderVoiceCards();
}

function renderVoiceCards() {
    const voiceGrid = document.querySelector('.voice-grid');
    if (!voiceGrid) return;
    
    voiceGrid.innerHTML = BEDTIME_VOICES.map((voice, index) => `
        <div class="voice-card ${index === 0 ? 'active' : ''}" data-voice-index="${index}">
            <div class="voice-avatar">${voice.avatar}</div>
            <div class="voice-info">
                <strong>${voice.name}</strong>
                <span>${voice.description}</span>
            </div>
        </div>
    `).join('');
    
    // Add click handlers
    const voiceCards = document.querySelectorAll('.voice-card');
    voiceCards.forEach(card => {
        card.addEventListener('click', () => {
            voiceCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            
            const voiceIndex = parseInt(card.dataset.voiceIndex);
            selectedVoice = BEDTIME_VOICES[voiceIndex];
            
            // Update voice controls to match voice defaults
            voiceRate = selectedVoice.rate;
            voicePitch = selectedVoice.pitch;
            updateVoiceControlsDisplay();
        });
    });
}

function setupVoiceControls() {
    const rateSlider = document.querySelector('#voiceRate');
    const pitchSlider = document.querySelector('#voicePitch');
    const rateDisplay = document.querySelector('#rateValue');
    const pitchDisplay = document.querySelector('#pitchValue');
    
    if (rateSlider && rateDisplay) {
        rateSlider.value = voiceRate;
        rateDisplay.textContent = voiceRate.toFixed(2);
        
        rateSlider.addEventListener('input', (e) => {
            voiceRate = parseFloat(e.target.value);
            rateDisplay.textContent = voiceRate.toFixed(2);
        });
    }
    
    if (pitchSlider && pitchDisplay) {
        pitchSlider.value = voicePitch;
        pitchDisplay.textContent = voicePitch.toFixed(2);
        
        pitchSlider.addEventListener('input', (e) => {
            voicePitch = parseFloat(e.target.value);
            pitchDisplay.textContent = voicePitch.toFixed(2);
        });
    }
}

function updateVoiceControlsDisplay() {
    const rateSlider = document.querySelector('#voiceRate');
    const pitchSlider = document.querySelector('#voicePitch');
    const rateDisplay = document.querySelector('#rateValue');
    const pitchDisplay = document.querySelector('#pitchValue');
    
    if (rateSlider && rateDisplay) {
        rateSlider.value = voiceRate;
        rateDisplay.textContent = voiceRate.toFixed(2);
    }
    
    if (pitchSlider && pitchDisplay) {
        pitchSlider.value = voicePitch;
        pitchDisplay.textContent = voicePitch.toFixed(2);
    }
}

function testVoice() {
    const testText = "Hello! I'm ready to tell you wonderful bedtime stories. Sweet dreams await!";
    speakText(testText);
}

// ✨ Magic Story Generation
function setupMagicButtons() {
    const createBtn = document.querySelector('.btn-magic-create');
    const surpriseBtn = document.querySelector('.btn-magic-surprise');
    
    if (createBtn) {
        createBtn.addEventListener('click', generateStory);
    }
    
    if (surpriseBtn) {
        surpriseBtn.addEventListener('click', generateSurpriseStory);
    }
}

function generateStory() {
    if (!validateStoryData()) {
        showToast('Please complete all required steps!', 'error');
        return;
    }
    
    showLoadingExperience();
    
    setTimeout(() => {
        const story = createStoryFromData();
        displayStory(story);
        hideLoadingExperience();
        showStoryExperience();
    }, 3000);
}

function generateSurpriseStory() {
    // Generate random story data
    const randomCharacters = ['🦊', '🐰', '🦉', '🐻'].slice(0, Math.floor(Math.random() * 3) + 1);
    const randomThemes = ['magical-forest', 'space-adventure', 'underwater', 'fairytale-castle'];
    const randomTheme = randomThemes[Math.floor(Math.random() * randomThemes.length)];
    
    storyData.characters = randomCharacters;
    storyData.theme = randomTheme;
    storyData.length = ['short', 'medium', 'long'][Math.floor(Math.random() * 3)];
    storyData.mood = ['happy', 'adventurous', 'calm'][Math.floor(Math.random() * 3)];
    
    generateStory();
}

function validateStoryData() {
    return storyData.characters.length > 0 && storyData.theme !== '';
}

function createStoryFromData() {
    const characters = storyData.characters.join(', ');
    const themeDescriptions = {
        'magical-forest': '🌲 enchanted woodland filled with sparkling trees and friendly creatures',
        'space-adventure': '🚀 colorful galaxy with twinkling stars and friendly aliens',
        'underwater': '🌊 beautiful ocean kingdom with coral castles and sea friends',
        'fairytale-castle': '🏰 magnificent castle with towers reaching the clouds',
        'cozy-village': '🏘️ peaceful village where everyone is kind and helpful'
    };
    
    const lengthMultipliers = {
        'short': 1,
        'medium': 2,
        'long': 3
    };
    
    const moodAdjectives = {
        'peaceful': '😌 calm and gentle',
        'exciting': '🎉 fun and adventurous',
        'heartwarming': '❤️ warm and loving',
        'mysterious': '🔍 curious and intriguing'
    };
    
    const theme = themeDescriptions[storyData.theme] || '✨ magical place';
    const mood = moodAdjectives[storyData.mood] || '🌟 wonderful';
    const length = lengthMultipliers[storyData.length] || 2;
    
    let story = `🌟 Once upon a time, in a ${theme}, there lived ${characters}.\n\n`;
    
    // Build story based on selections with emojis and kid-friendly language
    if (storyData.theme === 'magical-forest') {
        story += `🌳 The forest was ${mood}, with trees that whispered sweet secrets 🗣️ and flowers that glowed like tiny stars in the moonlight ✨.\n\n`;
    } else if (storyData.theme === 'space-adventure') {
        story += `🌌 Among the twinkling stars, everything was ${mood}, with planets made of rainbow candy 🍭 and moons that sang gentle lullabies 🎵.\n\n`;
    } else if (storyData.theme === 'underwater') {
        story += `🐠 Deep beneath the sparkling waves, the kingdom was ${mood}, with seahorse friends 🦄 and playful dolphins that loved to dance 💃.\n\n`;
    } else if (storyData.theme === 'fairytale-castle') {
        story += `👑 In the magnificent castle, everything was ${mood}, with towers that touched the fluffy clouds ☁️ and gardens full of singing flowers 🌺.\n\n`;
    } else if (storyData.theme === 'cozy-village') {
        story += `🏡 In the cozy village, life was ${mood}, with friendly neighbors who always helped each other and shared warm hugs 🤗.\n\n`;
    }
    
    // Add length-appropriate content with emojis
    for (let i = 0; i < length; i++) {
        const adventures = [
            `🎈 Our friends went on a ${mood} adventure, discovering a hidden treasure chest filled with golden smiles 😊`,
            `🌈 They met a wise old owl 🦉 who taught them that sharing makes everything more fun`,
            `⭐ Together they learned that kindness is the most powerful magic of all`,
            `🦋 They found a secret garden where butterflies painted pictures in the sky`,
            `🌙 The moon gave them special dreams that sparkled with hope and joy`
        ];
        
        const randomAdventure = adventures[Math.floor(Math.random() * adventures.length)];
        story += randomAdventure + `. `;
        
        if (i < length - 1) story += `\n\n`;
    }
    
    story += `\n\n💤 And they all lived happily ever after, with hearts full of love ❤️, sweet dreams 😴, and wonderful memories that would last forever ✨.\n\n🌟 The End 🌟`;
    
    // Add custom settings if provided
    if (storyData.customSettings) {
        story += `\n\n✨ Special note: ${storyData.customSettings}`;
    }
    
    return story;
}

function displayStory(story) {
    currentStory = story;
    
    // Update story display
    const storyTitle = document.querySelector('.story-title');
    const storyText = document.querySelector('.story-text');
    const coverStars = document.querySelector('.cover-stars');
    const coverIllustration = document.querySelector('.cover-illustration');
    const metaBadges = document.querySelector('.story-meta-badges');
    
    if (storyTitle) {
        const titleMap = {
            'magical-forest': 'The Enchanted Forest Tale',
            'space-adventure': 'Starlight Adventures',
            'underwater': 'Ocean Kingdom Stories',
            'fairytale-castle': 'Castle in the Clouds',
            'cozy-village': 'Village of Friendship'
        };
        storyTitle.textContent = titleMap[storyData.theme] || 'A Magical Story';
    }
    
    if (storyText) {
        storyText.textContent = story;
    }
    
    if (coverStars) {
        coverStars.textContent = '⭐✨🌟';
    }
    
    if (coverIllustration) {
        const illustrationMap = {
            'magical-forest': '🌲🦋',
            'space-adventure': '🚀🌟',
            'underwater': '🐠🏰',
            'fairytale-castle': '🏰👑',
            'cozy-village': '🏘️💕'
        };
        coverIllustration.textContent = illustrationMap[storyData.theme] || '📖✨';
    }
    
    if (metaBadges) {
        metaBadges.innerHTML = `
            <div class="meta-badge">📏 ${storyData.length}</div>
            <div class="meta-badge">😊 ${storyData.mood}</div>
            <div class="meta-badge">👥 ${storyData.characters.length} characters</div>
        `;
    }
}

// 🎮 Story Actions & Controls
function setupStoryActions() {
    const playBtn = document.querySelector('.btn-play-main');
    const saveBtn = document.querySelector('.save-btn');
    const shareBtn = document.querySelector('.share-btn');
    const newBtn = document.querySelector('.new-btn');
    
    if (playBtn) {
        playBtn.addEventListener('click', playStory);
    }
    
    if (saveBtn) {
        saveBtn.addEventListener('click', saveStory);
    }
    
    if (shareBtn) {
        shareBtn.addEventListener('click', shareStory);
    }
    
    if (newBtn) {
        newBtn.addEventListener('click', createNewStory);
    }
}

async function playStory() {
    if (!currentStory) {
        showToast('Please create a story first!', 'warning');
        return;
    }
    
    if (isPlaying) {
        stopStory();
        return;
    }
    
    try {
        await speakText(currentStory);
        updatePlayButton(true);
        showToast('🎧 Story is playing!', 'success');
    } catch (error) {
        console.error('Story playback error:', error);
        showToast('Unable to play story. Please try again.', 'error');
    }
}

function stopStory() {
    if (currentSynthesis) {
        window.speechSynthesis.cancel();
        currentSynthesis = null;
    }
    isPlaying = false;
    updatePlayButton(false);
    showToast('Story stopped', 'info');
}

function updatePlayButton(playing) {
    const playBtn = document.querySelector('.btn-play-main');
    const playIcon = document.querySelector('.play-icon');
    const playText = document.querySelector('.play-text');
    
    if (playBtn && playIcon && playText) {
        if (playing) {
            playIcon.textContent = '⏸️';
            playText.textContent = 'Pause Story';
            playBtn.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
        } else {
            playIcon.textContent = '▶️';
            playText.textContent = 'Play Story';
            playBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        }
    }
}

function speakText(text) {
    return new Promise((resolve, reject) => {
        if (!('speechSynthesis' in window)) {
            reject(new Error('Speech synthesis not supported'));
            return;
        }
        
        // Stop any current speech
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Set voice if available
        if (selectedVoice && selectedVoice.systemVoice) {
            utterance.voice = selectedVoice.systemVoice;
        }
        
        utterance.rate = voiceRate;
        utterance.pitch = voicePitch;
        utterance.volume = 0.9;
        
        utterance.onstart = () => {
            isPlaying = true;
            currentSynthesis = utterance;
        };
        
        utterance.onend = () => {
            isPlaying = false;
            currentSynthesis = null;
            updatePlayButton(false);
            resolve();
        };
        
        utterance.onerror = (event) => {
            isPlaying = false;
            currentSynthesis = null;
            updatePlayButton(false);
            reject(new Error(`Speech synthesis error: ${event.error}`));
        };
        
        window.speechSynthesis.speak(utterance);
    });
}

function saveStory() {
    if (!currentStory) {
        showToast('No story to save!', 'warning');
        return;
    }
    
    const storyToSave = {
        id: Date.now(),
        title: document.querySelector('.story-title')?.textContent || 'Untitled Story',
        content: currentStory,
        data: { ...storyData },
        createdAt: new Date().toISOString(),
        voice: selectedVoice.name,
        settings: { rate: voiceRate, pitch: voicePitch }
    };
    
    const savedStories = JSON.parse(localStorage.getItem('bedtimeStories') || '[]');
    savedStories.unshift(storyToSave);
    
    // Keep only last 10 stories
    if (savedStories.length > 10) {
        savedStories.splice(10);
    }
    
    localStorage.setItem('bedtimeStories', JSON.stringify(savedStories));
    
    showToast('📚 Story saved to your library!', 'success');
    loadStoryLibrary();
}

function shareStory() {
    if (!currentStory) {
        showToast('No story to share!', 'warning');
        return;
    }
    
    const storyTitle = document.querySelector('.story-title')?.textContent || 'My Bedtime Story';
    
    if (navigator.share) {
        navigator.share({
            title: storyTitle,
            text: currentStory.substring(0, 200) + '...',
            url: window.location.href
        }).then(() => {
            showToast('Story shared successfully!', 'success');
        }).catch((error) => {
            console.error('Share failed:', error);
            fallbackShare(storyTitle);
        });
    } else {
        fallbackShare(storyTitle);
    }
}

function fallbackShare(title) {
    const shareText = `${title}\n\n${currentStory}\n\nCreated with Bedtime Stories Generator`;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(shareText).then(() => {
            showToast('Story copied to clipboard!', 'success');
        }).catch(() => {
            showToast('Unable to copy story', 'error');
        });
    } else {
        showToast('Sharing not supported on this device', 'warning');
    }
}

function createNewStory() {
    // Reset story data
    storyData = {
        characters: [],
        theme: '',
        length: 'medium',
        mood: 'happy',
        customSettings: ''
    };
    
    currentStory = '';
    currentStep = 1;
    
    // Reset UI
    showStep(1);
    document.querySelectorAll('.character-chip').forEach(chip => {
        chip.classList.remove('selected');
    });
    document.querySelectorAll('.theme-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Hide story experience and show builder
    hideStoryExperience();
    
    showToast('Ready to create a new story!', 'info');
}

// 📚 Story Library Management
function loadStoryLibrary() {
    const savedStories = JSON.parse(localStorage.getItem('bedtimeStories') || '[]');
    const libraryGrid = document.querySelector('.saved-stories-grid');
    
    if (!libraryGrid) return;
    
    if (savedStories.length === 0) {
        libraryGrid.innerHTML = `
            <div class="empty-library">
                <div style="font-size: 4rem; margin-bottom: 20px;">📚</div>
                <h4>No saved stories yet</h4>
                <p>Create your first magical bedtime story!</p>
            </div>
        `;
        return;
    }
    
    libraryGrid.innerHTML = savedStories.map(story => `
        <div class="saved-story-card" data-story-id="${story.id}">
            <div class="story-card-header">
                <h4>${story.title}</h4>
                <span class="story-date">${new Date(story.createdAt).toLocaleDateString()}</span>
            </div>
            <div class="story-preview">${story.content.substring(0, 100)}...</div>
            <div class="story-card-actions">
                <button onclick="loadSavedStory(${story.id})" class="btn-load">📖 Read</button>
                <button onclick="deleteSavedStory(${story.id})" class="btn-delete">🗑️</button>
            </div>
        </div>
    `).join('');
}

function loadSavedStory(storyId) {
    const savedStories = JSON.parse(localStorage.getItem('bedtimeStories') || '[]');
    const story = savedStories.find(s => s.id === storyId);
    
    if (!story) {
        showToast('Story not found!', 'error');
        return;
    }
    
    // Load story data
    currentStory = story.content;
    storyData = story.data;
    
    // Load voice settings
    const voiceIndex = BEDTIME_VOICES.findIndex(v => v.name === story.voice);
    if (voiceIndex !== -1) {
        selectedVoice = BEDTIME_VOICES[voiceIndex];
    }
    
    if (story.settings) {
        voiceRate = story.settings.rate;
        voicePitch = story.settings.pitch;
    }
    
    // Display the story
    displayStory(story.content);
    showStoryExperience();
    
    showToast('📖 Story loaded!', 'success');
}

function deleteSavedStory(storyId) {
    if (!confirm('Are you sure you want to delete this story?')) {
        return;
    }
    
    const savedStories = JSON.parse(localStorage.getItem('bedtimeStories') || '[]');
    const filteredStories = savedStories.filter(s => s.id !== storyId);
    
    localStorage.setItem('bedtimeStories', JSON.stringify(filteredStories));
    loadStoryLibrary();
    
    showToast('Story deleted', 'info');
}

// 🌟 Loading Experience & UI Transitions
function showLoadingExperience() {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading-universe';
    loadingDiv.innerHTML = `
        <div class="loading-stars"></div>
        <div class="loading-content">
            <div class="magic-cauldron">
                <div class="cauldron">🔮</div>
                <div class="magic-bubbles">
                    <span class="bubble">✨</span>
                    <span class="bubble">⭐</span>
                    <span class="bubble">🌟</span>
                    <span class="bubble">💫</span>
                </div>
            </div>
            <h2 class="loading-title">Creating Your Magical Story...</h2>
            <p class="loading-tips">Mixing characters and themes with a sprinkle of magic!</p>
            <div class="loading-progress">
                <div class="progress-bar">
                    <div class="progress-fill"></div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(loadingDiv);
}

function hideLoadingExperience() {
    const loadingDiv = document.querySelector('.loading-universe');
    if (loadingDiv) {
        loadingDiv.remove();
    }
}

function showStoryExperience() {
    const storyBuilder = document.querySelector('.story-builder');
    const storyExperience = document.querySelector('.story-experience');
    
    if (storyBuilder && storyExperience) {
        storyBuilder.style.display = 'none';
        storyExperience.style.display = 'block';
        
        // Scroll to story
        storyExperience.scrollIntoView({ behavior: 'smooth' });
    }
}

function hideStoryExperience() {
    const storyBuilder = document.querySelector('.story-builder');
    const storyExperience = document.querySelector('.story-experience');
    
    if (storyBuilder && storyExperience) {
        storyBuilder.style.display = 'block';
        storyExperience.style.display = 'none';
        
        // Scroll to builder
        storyBuilder.scrollIntoView({ behavior: 'smooth' });
    }
}

// 🔔 Toast Notification System
function showToast(message, type = 'info') {
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    
    const icons = {
        success: '✅',
        error: '❌', 
        warning: '⚠️',
        info: 'ℹ️'
    };
    
    toast.innerHTML = `
        <span class="toast-icon">${icons[type]}</span>
        <span class="toast-message">${message}</span>
    `;
    
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        color: #374151;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 12px;
        font-weight: 600;
        border-left: 4px solid ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
        animation: slideIn 0.3s ease, slideOut 0.3s ease 2.7s forwards;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 3000);
}

// 🚀 Initialize Everything
document.addEventListener('DOMContentLoaded', () => {
    initializeStoryBuilder();
    loadStoryLibrary();
    
    console.log('🌟 Bedtime Stories Enhanced UI Loaded Successfully!');
});

// Add CSS for toast animations
const toastStyles = document.createElement('style');
toastStyles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(toastStyles);
