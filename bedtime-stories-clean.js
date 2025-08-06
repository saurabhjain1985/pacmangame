// Bedtime Story Generator - Clean Version
class BedtimeStoryGenerator {
    constructor() {
        this.storyTemplates = {
            adventure: {
                settings: ['enchanted forest', 'mysterious castle', 'hidden valley', 'magical mountain', 'secret cave'],
                openings: [
                    'Once upon a time, in a land far beyond the rainbow',
                    'In a magical realm where dreams come true',
                    'Long ago, when the world was young and full of wonder',
                    'In a time when magic flowed like rivers through the land'
                ],
                conflicts: [
                    'discovered a mysterious map that led to an ancient treasure',
                    'found a magical key that opened doors to other worlds',
                    'met a wise old wizard who needed their help',
                    'stumbled upon a sleeping dragon guarding a beautiful garden'
                ],
                resolutions: [
                    'learned that the greatest treasure was the friendship they made along the way',
                    'discovered that kindness and courage can overcome any challenge',
                    'found that helping others brings the most wonderful rewards',
                    'realized that every adventure is better when shared with friends'
                ]
            },
            friendship: {
                settings: ['cozy village', 'magical playground', 'rainbow meadow', 'friendly neighborhood', 'warm cottage'],
                openings: [
                    'In a place where kindness bloomed like flowers',
                    'Where laughter echoed through the valleys',
                    'In a community where everyone cared for each other',
                    'Once upon a time, in a land built on friendship'
                ],
                conflicts: [
                    'learned that their friend was feeling lonely and needed cheering up',
                    'discovered that helping someone in need creates the strongest bonds',
                    'found that sharing their favorite things made everything better',
                    'realized that listening with their heart was the greatest gift'
                ],
                resolutions: [
                    'celebrated their friendship with a joyful feast under the stars',
                    'created a special place where all friends could gather and play',
                    'learned that true friends are life\'s greatest blessing',
                    'discovered that kindness creates ripples of happiness everywhere'
                ]
            },
            magic: {
                settings: ['crystal palace', 'floating islands', 'starlight grove', 'rainbow bridge', 'moonbeam castle'],
                openings: [
                    'When the first star appeared in the twilight sky',
                    'In a realm where magic sparkled in every dewdrop',
                    'Where unicorns danced and fairies sang sweet lullabies',
                    'In a world painted with stardust and moonbeams'
                ],
                conflicts: [
                    'discovered a wand that could grant wishes, but only kind ones',
                    'found a magical book that came to life when read with love',
                    'met a phoenix who needed help reigniting its flame of hope',
                    'encountered a spell that had gone wrong and needed fixing with kindness'
                ],
                resolutions: [
                    'learned that the most powerful magic comes from a loving heart',
                    'discovered that sharing magic makes it grow stronger',
                    'found that true magic lies in making others happy',
                    'realized that every act of kindness creates a little magic in the world'
                ]
            },
            space: {
                settings: ['distant planet', 'space station among the stars', 'colorful nebula', 'friendly alien world', 'asteroid garden'],
                openings: [
                    'Among the twinkling stars in the vast universe',
                    'On a rocket ship that could travel faster than light',
                    'In a galaxy where every planet was a different color',
                    'When shooting stars were actually friendly space travelers'
                ],
                conflicts: [
                    'met alien friends who spoke in colors instead of words',
                    'discovered a planet where it rained rainbow sparkles',
                    'found a lost comet that needed help finding its way home',
                    'learned that the moon was actually a giant space library'
                ],
                resolutions: [
                    'learned that friendship knows no boundaries, not even space',
                    'discovered that the universe is full of wonder and kindness',
                    'found that exploring is more fun when you have friends to share it with',
                    'realized that home is wherever your loved ones are'
                ]
            },
            ocean: {
                settings: ['coral reef palace', 'underwater garden', 'mermaid lagoon', 'treasure cave', 'kelp forest'],
                openings: [
                    'Deep beneath the sparkling waves',
                    'In an underwater kingdom where sea creatures danced',
                    'Where mermaids sang the most beautiful songs',
                    'In the depths of the ocean where magic flows like currents'
                ],
                conflicts: [
                    'helped a family of dolphins find their way through a storm',
                    'discovered a pearl that could heal any sadness',
                    'met a wise old sea turtle who shared ancient secrets',
                    'found a message in a bottle from a friend across the ocean'
                ],
                resolutions: [
                    'learned that the ocean connects all living things',
                    'discovered that taking care of the sea means it will take care of us',
                    'found that the most beautiful treasures are the memories we make',
                    'realized that every drop in the ocean matters, just like every act of kindness'
                ]
            },
            dreams: {
                settings: ['cloud castle', 'rainbow bridge', 'sleepy meadow', 'starlight garden', 'moonbeam forest'],
                openings: [
                    'In the gentle land of dreams',
                    'Where sleepy thoughts become beautiful adventures',
                    'When the sandman sprinkled magic dream dust',
                    'In a world where every pillow was a portal to wonder'
                ],
                conflicts: [
                    'helped chase away a small nightmare with gentle kindness',
                    'found a dream that had gotten lost and needed to find its sleeping child',
                    'discovered that sharing dreams makes them more beautiful',
                    'learned that the best dreams are the ones that teach us about love'
                ],
                resolutions: [
                    'drifted off to the most peaceful sleep, filled with happy dreams',
                    'learned that dreams are where hopes grow into tomorrow\'s possibilities',
                    'discovered that love follows us even into our dreams',
                    'found that the most wonderful adventures happen when we close our eyes'
                ]
            }
        };

        this.loadingTips = [
            '✨ Gathering magical ingredients...',
            '🌟 Sprinkling fairy dust...',
            '📚 Opening the book of wonders...',
            '🌙 Consulting the dream council...',
            '🦄 Asking the unicorns for inspiration...',
            '🌈 Painting rainbows in the sky...',
            '⭐ Collecting wishes from shooting stars...',
            '🔮 Gazing into the crystal ball...'
        ];

        this.currentStory = null;
        this.savedStories = this.loadSavedStories();
        this.currentStep = 1;
    }

    // Story Generation
    generateStory() {
        try {
            console.log('🎯 Starting story generation...');
            
            // Get form values
            const characters = document.getElementById('characters')?.value?.trim() || '';
            const selectedTheme = document.querySelector('.theme-card.selected')?.dataset?.theme || 'adventure';
            const selectedLength = document.querySelector('.length-option.active')?.dataset?.length || 'medium';
            const selectedMood = document.querySelector('.mood-option.active')?.dataset?.mood || 'peaceful';
            const setting = document.getElementById('setting')?.value?.trim() || '';

            // Process characters
            let finalCharacters = characters;
            const selectedCharacterChips = document.querySelectorAll('.character-chip.selected');
            if (selectedCharacterChips.length > 0 && !characters) {
                finalCharacters = Array.from(selectedCharacterChips)
                    .map(chip => chip.dataset.character)
                    .join(', ');
            }

            if (!finalCharacters) {
                finalCharacters = 'Luna the brave princess, Sparkle the unicorn';
                const charactersElement = document.getElementById('characters');
                if (charactersElement) {
                    charactersElement.value = finalCharacters;
                }
            }

            console.log('Story parameters:', { characters: finalCharacters, selectedTheme, selectedLength, selectedMood, setting });
            
            // Show loading
            this.showLoading();
            
            // Generate story with slight delay for user experience
            setTimeout(() => {
                try {
                    const story = this.createPersonalizedStory(finalCharacters, selectedTheme, selectedLength, selectedMood, setting);
                    
                    if (story) {
                        this.displayStory(story);
                    } else {
                        throw new Error('Story creation returned null');
                    }
                    
                } catch (error) {
                    console.error('Error in story creation:', error);
                    this.hideLoading();
                    alert('Sorry, there was an error creating your story. Please try again!');
                }
            }, 2000);
            
        } catch (error) {
            console.error('Error in generateStory:', error);
            this.hideLoading();
            alert('There was an error generating your story. Please try again!');
        }
    }

    createPersonalizedStory(characters, theme = 'adventure', length = 'medium', mood = 'peaceful', customSetting = '') {
        try {
            const template = this.storyTemplates[theme] || this.storyTemplates.adventure;
            
            // Choose random elements
            const setting = customSetting || template.settings[Math.floor(Math.random() * template.settings.length)];
            const opening = template.openings[Math.floor(Math.random() * template.openings.length)];
            const conflict = template.conflicts[Math.floor(Math.random() * template.conflicts.length)];
            const resolution = template.resolutions[Math.floor(Math.random() * template.resolutions.length)];

            // Parse characters
            const characterList = characters.split(',').map(c => c.trim()).filter(c => c);
            const mainCharacter = characterList[0] || 'our brave hero';
            const characterNames = characterList.join(' and ');

            // Build story based on length
            let story = '';
            
            // Opening
            story += `${opening}, there lived ${characterNames}.\n\n`;
            story += `They made their home in ${setting}, where magic sparkled in every corner and every day brought new wonders.\n\n`;
            
            // Character development
            story += `${mainCharacter} was known for being brave and kind, `;
            if (characterList.length > 1) {
                story += `and together with ${characterList.slice(1).join(' and ')}, they spent their days exploring and helping all the creatures of the ${setting}.\n\n`;
            } else {
                story += `and spent their days exploring and helping all the creatures of the ${setting}.\n\n`;
            }

            // Conflict/Adventure
            story += `One beautiful morning, ${mainCharacter} ${conflict}. A sense of wonder filled their heart as they realized this was the beginning of something truly special.\n\n`;

            // Middle section (length dependent)
            if (length === 'medium' || length === 'long') {
                story += `They climbed the highest mountain and discovered a view more beautiful than any picture. Along the way, they helped a family of lost rabbits find their way home and shared their lunch with a hungry squirrel.\n\n`;
            }

            if (length === 'long') {
                story += `As they continued their journey, they met a wise old owl who taught them about the importance of courage, and a family of friendly foxes who showed them the secret paths through the forest.\n\n`;
                story += `When night began to fall, they built a cozy campfire and shared stories under the twinkling stars, making friends with every creature they met.\n\n`;
            }

            // Resolution
            story += `In the end, ${characterNames} ${resolution}.\n\n`;

            // Peaceful ending
            story += `As the stars began to twinkle in the evening sky, ${mainCharacter} felt grateful for the wonderful adventure and the precious friends who shared it. With hearts full of joy and minds full of beautiful memories, they settled down for a peaceful night's sleep, knowing that tomorrow would bring new possibilities for kindness, friendship, and magical moments.`;

            // Create story object
            const storyObj = {
                title: `🌟 ${mainCharacter}'s ${this.getThemeTitle(theme)} Adventure`,
                content: story,
                characters: characterList,
                theme: theme,
                length: length,
                mood: mood,
                setting: setting,
                readingTime: this.getReadingTime(length),
                createdAt: new Date().toISOString()
            };

            this.currentStory = storyObj;
            return storyObj;

        } catch (error) {
            console.error('Error creating story:', error);
            return null;
        }
    }

    getThemeTitle(theme) {
        const titles = {
            adventure: 'Great',
            friendship: 'Heartwarming',
            magic: 'Magical',
            space: 'Cosmic',
            ocean: 'Ocean',
            dreams: 'Dreamy'
        };
        return titles[theme] || 'Wonderful';
    }

    getReadingTime(length) {
        const times = {
            short: '2-3 minutes',
            medium: '5-7 minutes',
            long: '10-12 minutes'
        };
        return times[length] || '5-7 minutes';
    }

    displayStory(story) {
        try {
            console.log('📺 Displaying story...');
            
            // Hide loading and builder
            this.hideLoading();
            const builderElement = document.getElementById('storyBuilder');
            if (builderElement) {
                builderElement.style.display = 'none';
            }

            // Show story output
            const outputElement = document.getElementById('storyOutput');
            if (outputElement) {
                outputElement.style.display = 'block';
            }

            // Update story content
            const titleElement = document.getElementById('storyTitle');
            const textElement = document.getElementById('storyText');
            const readingTimeElement = document.getElementById('readingTime');
            const themeElement = document.getElementById('storyTheme');

            if (titleElement) titleElement.textContent = story.title;
            if (readingTimeElement) readingTimeElement.textContent = `📖 ${story.readingTime}`;
            if (themeElement) themeElement.textContent = `✨ ${story.theme.charAt(0).toUpperCase() + story.theme.slice(1)}`;

            if (textElement) {
                const formattedContent = story.content.split('\n\n').map(paragraph => 
                    `<p class="story-paragraph">${paragraph}</p>`
                ).join('');
                textElement.innerHTML = formattedContent;
            }

            // Scroll to story
            if (outputElement) {
                outputElement.scrollIntoView({ behavior: 'smooth' });
            }

            console.log('✅ Story displayed successfully');

        } catch (error) {
            console.error('Error displaying story:', error);
            this.hideLoading();
        }
    }

    showLoading() {
        console.log('🔄 Showing loading overlay...');
        
        const overlay = document.getElementById('loadingOverlay');
        const tips = document.getElementById('loadingTips');
        
        if (overlay) {
            overlay.style.display = 'flex';
            
            // Auto-hide after 4 seconds as safety
            setTimeout(() => {
                this.hideLoading();
            }, 4000);
        }
        
        // Cycle through loading tips
        if (tips) {
            let tipIndex = 0;
            this.loadingInterval = setInterval(() => {
                tips.textContent = this.loadingTips[tipIndex];
                tipIndex = (tipIndex + 1) % this.loadingTips.length;
            }, 800);
        }
    }

    hideLoading() {
        console.log('🔄 Hiding loading overlay...');
        
        // Clear loading interval
        if (this.loadingInterval) {
            clearInterval(this.loadingInterval);
            this.loadingInterval = null;
        }
        
        // Hide overlay
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }

    generateSurpriseStory() {
        // Generate random parameters
        const themes = Object.keys(this.storyTemplates);
        const randomTheme = themes[Math.floor(Math.random() * themes.length)];
        
        const characters = [
            'Luna the brave princess',
            'Max the friendly dragon',
            'Sparkle the unicorn',
            'Willow the wise owl',
            'Ruby the magical cat',
            'Oliver the kind robot'
        ];
        const randomCharacter = characters[Math.floor(Math.random() * characters.length)];
        
        const lengths = ['short', 'medium', 'long'];
        const randomLength = lengths[Math.floor(Math.random() * lengths.length)];
        
        const moods = ['peaceful', 'exciting', 'heartwarming', 'mysterious'];
        const randomMood = moods[Math.floor(Math.random() * moods.length)];

        // Update UI to reflect random choices
        document.getElementById('characters').value = randomCharacter;
        
        // Clear previous selections
        document.querySelectorAll('.theme-card.selected').forEach(card => card.classList.remove('selected'));
        document.querySelectorAll('.length-option.active').forEach(option => option.classList.remove('active'));
        document.querySelectorAll('.mood-option.active').forEach(option => option.classList.remove('active'));
        
        // Select random options
        const themeCard = document.querySelector(`[data-theme="${randomTheme}"]`);
        if (themeCard) themeCard.classList.add('selected');
        
        const lengthOption = document.querySelector(`[data-length="${randomLength}"]`);
        if (lengthOption) lengthOption.classList.add('active');
        
        const moodOption = document.querySelector(`[data-mood="${randomMood}"]`);
        if (moodOption) moodOption.classList.add('active');

        // Generate the story
        this.generateStory();
    }

    // Story Management
    saveStory() {
        if (!this.currentStory) {
            alert('No story to save!');
            return;
        }

        this.savedStories.push(this.currentStory);
        localStorage.setItem('bedtimeStories', JSON.stringify(this.savedStories));
        alert('Story saved to your magical library! ✨');
        this.displaySavedStories();
    }

    loadSavedStories() {
        try {
            const saved = localStorage.getItem('bedtimeStories');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error loading saved stories:', error);
            return [];
        }
    }

    displaySavedStories() {
        const container = document.getElementById('savedStoriesList');
        if (!container) return;

        if (this.savedStories.length === 0) {
            container.innerHTML = '<p class="no-stories">No saved stories yet. Create your first magical tale!</p>';
            return;
        }

        container.innerHTML = this.savedStories.map((story, index) => `
            <div class="saved-story-card" onclick="storyGenerator.loadSavedStory(${index})">
                <div class="story-card-header">
                    <h4>${story.title}</h4>
                    <span class="story-theme">${story.theme}</span>
                </div>
                <p class="story-preview">${story.content.substring(0, 100)}...</p>
                <div class="story-meta">
                    <span>📖 ${story.readingTime}</span>
                    <span>📅 ${new Date(story.createdAt).toLocaleDateString()}</span>
                </div>
            </div>
        `).join('');
    }

    loadSavedStory(index) {
        const story = this.savedStories[index];
        if (story) {
            this.currentStory = story;
            this.displayStory(story);
        }
    }

    shareStory() {
        if (!this.currentStory) {
            alert('No story to share!');
            return;
        }

        if (navigator.share) {
            navigator.share({
                title: this.currentStory.title,
                text: this.currentStory.content,
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(this.currentStory.content).then(() => {
                alert('Story copied to clipboard! Share it with friends! 📋✨');
            });
        }
    }

    showStoryForm() {
        const builderElement = document.getElementById('storyBuilder');
        const outputElement = document.getElementById('storyOutput');
        
        if (builderElement) builderElement.style.display = 'block';
        if (outputElement) outputElement.style.display = 'none';
        
        if (builderElement) {
            builderElement.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

// Voice Reading Functionality
function readStoryAloud() {
    const storyText = document.getElementById('storyText')?.textContent;
    if (!storyText) {
        alert('No story to read!');
        return;
    }

    // Stop any current speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(storyText);
    
    // Get voice settings
    const voiceSpeed = document.getElementById('voiceSpeed')?.value || 0.8;
    const voicePitch = document.getElementById('voicePitch')?.value || 1.1;
    
    utterance.rate = parseFloat(voiceSpeed);
    utterance.pitch = parseFloat(voicePitch);
    utterance.volume = 1;

    // Try to use a gentle voice
    const voices = speechSynthesis.getVoices();
    const femaleVoice = voices.find(voice => 
        voice.name.includes('female') || 
        voice.name.includes('Female') ||
        voice.name.includes('woman') ||
        voice.name.includes('Woman')
    );
    
    if (femaleVoice) {
        utterance.voice = femaleVoice;
    }

    speechSynthesis.speak(utterance);
    
    // Update button text
    const playButton = document.querySelector('.btn-play-main .play-text');
    if (playButton) {
        playButton.textContent = 'Reading...';
        utterance.onend = () => {
            playButton.textContent = 'Read My Story';
        };
    }
}

// Navigation Functions
function nextStep() {
    const currentStepElement = document.querySelector('.step-content.active');
    const currentStep = parseInt(currentStepElement?.dataset.step || '1');
    
    if (currentStep < 4) {
        showStep(currentStep + 1);
    }
}

function previousStep() {
    const currentStepElement = document.querySelector('.step-content.active');
    const currentStep = parseInt(currentStepElement?.dataset.step || '1');
    
    if (currentStep > 1) {
        showStep(currentStep - 1);
    }
}

function showStep(stepNumber) {
    // Update step indicator
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
        if (parseInt(step.dataset.step) === stepNumber) {
            step.classList.add('active');
        }
    });

    // Update step content
    document.querySelectorAll('.step-content').forEach(content => {
        content.classList.remove('active');
        if (parseInt(content.dataset.step) === stepNumber) {
            content.classList.add('active');
        }
    });

    // Update navigation buttons
    const prevButton = document.querySelector('.btn-prev');
    const nextButton = document.querySelector('.btn-next');
    
    if (prevButton) {
        prevButton.style.display = stepNumber > 1 ? 'block' : 'none';
    }
    
    if (nextButton) {
        nextButton.style.display = stepNumber < 4 ? 'block' : 'none';
    }
}

// Initialize everything when page loads
let storyGenerator;

document.addEventListener('DOMContentLoaded', function() {
    console.log('🌙 Bedtime Stories loading...');
    
    // Initialize story generator
    storyGenerator = new BedtimeStoryGenerator();
    window.storyGenerator = storyGenerator; // Make it globally accessible
    
    // Set up character selection
    setupCharacterSelection();
    setupThemeSelection();
    setupSettingsSelection();
    
    // Display saved stories
    storyGenerator.displaySavedStories();
    
    // Update voice controls
    updateVoiceControls();
    
    console.log('✅ Bedtime Stories initialized successfully');
});

function setupCharacterSelection() {
    // Character chips
    document.querySelectorAll('.character-chip').forEach(chip => {
        chip.addEventListener('click', function() {
            this.classList.toggle('selected');
            updateCharacterInput();
        });
    });

    // Character input
    const characterInput = document.getElementById('characters');
    if (characterInput) {
        characterInput.addEventListener('input', updateCharacterCount);
    }
}

function updateCharacterInput() {
    const selectedChips = document.querySelectorAll('.character-chip.selected');
    const characterInput = document.getElementById('characters');
    
    if (selectedChips.length > 0 && characterInput && !characterInput.value.trim()) {
        const characters = Array.from(selectedChips).map(chip => chip.dataset.character).join(', ');
        characterInput.value = characters;
        updateCharacterCount();
    }
}

function updateCharacterCount() {
    const characterInput = document.getElementById('characters');
    const countElement = document.getElementById('characterCount');
    
    if (characterInput && countElement) {
        const characters = characterInput.value.split(',').filter(c => c.trim()).length;
        countElement.textContent = characters;
    }
}

function setupThemeSelection() {
    document.querySelectorAll('.theme-card').forEach(card => {
        card.addEventListener('click', function() {
            document.querySelectorAll('.theme-card').forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
}

function setupSettingsSelection() {
    // Length options
    document.querySelectorAll('.length-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.length-option').forEach(o => o.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Mood options
    document.querySelectorAll('.mood-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.mood-option').forEach(o => o.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function updateVoiceControls() {
    const speedSlider = document.getElementById('voiceSpeed');
    const pitchSlider = document.getElementById('voicePitch');
    const speedValue = document.getElementById('speedValue');
    const pitchValue = document.getElementById('pitchValue');

    if (speedSlider && speedValue) {
        speedSlider.addEventListener('input', function() {
            speedValue.textContent = this.value + 'x';
        });
    }

    if (pitchSlider && pitchValue) {
        pitchSlider.addEventListener('input', function() {
            pitchValue.textContent = this.value;
        });
    }
}

// Global functions for button clicks
function generateStory() {
    if (storyGenerator) {
        storyGenerator.generateStory();
    }
}

function generateSurpriseStory() {
    if (storyGenerator) {
        storyGenerator.generateSurpriseStory();
    }
}

function saveStory() {
    if (storyGenerator) {
        storyGenerator.saveStory();
    }
}

function shareStory() {
    if (storyGenerator) {
        storyGenerator.shareStory();
    }
}

function showStoryForm() {
    if (storyGenerator) {
        storyGenerator.showStoryForm();
    }
}
