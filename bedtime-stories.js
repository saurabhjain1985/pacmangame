// Bedtime Story Generator - AI-Powered Story Creation
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
            animals: {
                settings: ['sunny meadow', 'cozy forest clearing', 'babbling brook', 'flower-filled garden', 'peaceful farm'],
                openings: [
                    'In a meadow where all creatures lived in harmony',
                    'Where the animals could talk and share their wisdom',
                    'In a forest where every creature had a special gift',
                    'Once upon a time, when animals and children were the best of friends'
                ],
                conflicts: [
                    'helped a lost baby bird find its way home to its family',
                    'worked together to save their forest home from a terrible storm',
                    'discovered that the grumpy old bear was just lonely and needed friends',
                    'learned that the smallest mouse had the biggest heart of all'
                ],
                resolutions: [
                    'celebrated with a grand forest festival where everyone was welcome',
                    'learned that every creature, big or small, has something special to offer',
                    'discovered that taking care of nature means it will take care of us too',
                    'found that the animal kingdom taught them the most important lessons about life'
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
                    'encountered a space storm that could only be calmed with laughter'
                ],
                resolutions: [
                    'learned that friendship knows no boundaries, not even space',
                    'discovered that the universe is full of wonder and new friends',
                    'found that curiosity and kindness open doors to amazing adventures',
                    'realized that no matter how far they traveled, love would guide them home'
                ]
            },
            ocean: {
                settings: ['coral reef city', 'underwater castle', 'mermaid lagoon', 'treasure island', 'whale song valley'],
                openings: [
                    'Beneath the sparkling waves of the deep blue sea',
                    'Where mermaids sang and dolphins danced',
                    'In an underwater world full of colorful coral gardens',
                    'When the ocean whispered secrets to those who listened carefully'
                ],
                conflicts: [
                    'helped a baby whale find its pod during migration season',
                    'discovered an underwater city that needed protection from pollution',
                    'met a shy octopus who had amazing artistic talents to share',
                    'found a message in a bottle that led to an incredible underwater quest'
                ],
                resolutions: [
                    'celebrated with an underwater parade of sea life',
                    'learned that protecting the ocean means protecting all its beautiful creatures',
                    'discovered that the sea holds mysteries more wonderful than any treasure',
                    'found that courage and compassion can create waves of positive change'
                ]
            },
            forest: {
                settings: ['ancient oak grove', 'mushroom fairy ring', 'babbling creek', 'moss-covered clearing', 'treehouse village'],
                openings: [
                    'Deep in the heart of an ancient forest',
                    'Where the trees whispered secrets and flowers sang songs',
                    'In a woodland where every path led to a new adventure',
                    'When the forest spirits woke up to greet the morning sun'
                ],
                conflicts: [
                    'discovered that the forest animals needed help preparing for winter',
                    'found a magical seed that could grow into anything with enough love',
                    'met a wise old owl who shared the secrets of forest wisdom',
                    'learned that a grumpy troll was actually protecting something precious'
                ],
                resolutions: [
                    'created a beautiful forest sanctuary where all creatures felt safe',
                    'learned that nature teaches us the most important lessons about patience and growth',
                    'discovered that taking care of the forest means it will always be there for future adventures',
                    'found that the forest was not just a place, but a magical friend that would always welcome them home'
                ]
            },
            dreams: {
                settings: ['cloud castle', 'dreamland', 'imagination playground', 'sleepy village', 'pillow fort kingdom'],
                openings: [
                    'As the moon cast its gentle silver light',
                    'When sleep began to sprinkle magic dust in their eyes',
                    'In the peaceful moments before dreams begin',
                    'Where the boundary between reality and dreams becomes beautifully blurred'
                ],
                conflicts: [
                    'traveled through dreams to help other children sleep peacefully',
                    'discovered that nightmares were just scared dreams that needed comforting',
                    'found a magical dreamcatcher that collected beautiful dreams to share',
                    'learned that the power of imagination could solve any problem'
                ],
                resolutions: [
                    'drifted off to sleep knowing that wonderful dreams were waiting',
                    'learned that peaceful sleep brings energy for tomorrow\'s adventures',
                    'discovered that dreams are practice runs for making the world more beautiful',
                    'found that the sweetest dreams are filled with love, kindness, and all their favorite people'
                ]
            }
        };

        this.characterTraits = [
            'brave', 'kind', 'curious', 'gentle', 'wise', 'playful', 'caring', 'adventurous',
            'magical', 'cheerful', 'helpful', 'creative', 'loyal', 'patient', 'joyful'
        ];

        this.loadingTips = [
            '✨ Gathering magical ingredients...',
            '🌟 Consulting the story spirits...',
            '📚 Opening the book of endless tales...',
            '🎭 Casting characters for your story...',
            '🌙 Weaving moonbeams into words...',
            '🦄 Adding a sprinkle of unicorn dust...',
            '🌈 Painting rainbows across the pages...',
            '⭐ Collecting stardust for the perfect ending...'
        ];

        this.savedStories = JSON.parse(localStorage.getItem('bedtimeStories') || '[]');
        this.currentStory = null;
        
        this.init();
    }

    init() {
        this.displaySavedStories();
        this.setupSpeechSynthesis();
    }

    setupSpeechSynthesis() {
        this.speechSynth = window.speechSynthesis;
        this.isReading = false;
        this.selectedVoice = null;
        
        // Load voices and populate voice selector
        this.loadVoices();
        
        // Some browsers load voices asynchronously
        if (this.speechSynth.onvoiceschanged !== undefined) {
            this.speechSynth.onvoiceschanged = () => this.loadVoices();
        }
        
        // Set up voice controls event listeners
        this.setupVoiceControls();
    }
    
    loadVoices() {
        const voiceSelect = document.getElementById('voiceSelect');
        if (!voiceSelect) return; // Controls not ready yet
        
        const voices = this.speechSynth.getVoices();
        
        if (voices.length === 0) return;
        
        voiceSelect.innerHTML = '';
        
        // Group voices by language and type
        const voiceGroups = {
            'English (Recommended)': [],
            'Other Languages': []
        };
        
        voices.forEach((voice, index) => {
            // Prioritize English voices for bedtime stories
            if (voice.lang.startsWith('en')) {
                voiceGroups['English (Recommended)'].push({ voice, index });
            } else {
                voiceGroups['Other Languages'].push({ voice, index });
            }
        });
        
        // Add English voices first
        if (voiceGroups['English (Recommended)'].length > 0) {
            const englishGroup = document.createElement('optgroup');
            englishGroup.label = 'English (Recommended)';
            
            voiceGroups['English (Recommended)'].forEach(({voice, index}) => {
                const option = document.createElement('option');
                option.value = index;
                
                // Create descriptive names for better UX
                let displayName = voice.name;
                if (voice.name.includes('Female') || voice.name.includes('Woman')) {
                    displayName += ' 👩 (Gentle)';
                } else if (voice.name.includes('Male') || voice.name.includes('Man')) {
                    displayName += ' 👨 (Warm)';
                } else if (voice.name.includes('Samantha') || voice.name.includes('Victoria') || voice.name.includes('Karen')) {
                    displayName += ' 🌟 (Premium)';
                }
                
                option.textContent = displayName;
                englishGroup.appendChild(option);
            });
            
            voiceSelect.appendChild(englishGroup);
        }
        
        // Add other language voices
        if (voiceGroups['Other Languages'].length > 0) {
            const otherGroup = document.createElement('optgroup');
            otherGroup.label = 'Other Languages';
            
            voiceGroups['Other Languages'].forEach(({voice, index}) => {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = `${voice.name} (${voice.lang})`;
                otherGroup.appendChild(option);
            });
            
            voiceSelect.appendChild(otherGroup);
        }
        
        // Auto-select a good default voice
        this.selectBestDefaultVoice(voices);
    }
    
    selectBestDefaultVoice(voices) {
        const voiceSelect = document.getElementById('voiceSelect');
        if (!voiceSelect) return;
        
        // Try to find the best default voice for bedtime stories
        const preferredVoices = [
            'Samantha', 'Victoria', 'Karen', 'Susan',  // macOS voices
            'Microsoft Zira', 'Microsoft Hazel',       // Windows voices  
            'Google UK English Female', 'Google US English Female' // Chrome voices
        ];
        
        let bestVoice = null;
        let bestIndex = -1;
        
        for (const preferredName of preferredVoices) {
            const foundIndex = voices.findIndex(voice => 
                voice.name.includes(preferredName) && voice.lang.startsWith('en')
            );
            if (foundIndex !== -1) {
                bestVoice = voices[foundIndex];
                bestIndex = foundIndex;
                break;
            }
        }
        
        // Fallback: any English female voice
        if (!bestVoice) {
            const femaleVoiceIndex = voices.findIndex(voice => 
                voice.lang.startsWith('en') && 
                (voice.name.includes('Female') || voice.name.includes('Woman'))
            );
            if (femaleVoiceIndex !== -1) {
                bestVoice = voices[femaleVoiceIndex];
                bestIndex = femaleVoiceIndex;
            }
        }
        
        // Final fallback: first English voice
        if (!bestVoice) {
            const englishVoiceIndex = voices.findIndex(voice => voice.lang.startsWith('en'));
            if (englishVoiceIndex !== -1) {
                bestVoice = voices[englishVoiceIndex];
                bestIndex = englishVoiceIndex;
            }
        }
        
        if (bestVoice) {
            voiceSelect.value = bestIndex;
            this.selectedVoice = bestVoice;
        }
    }
    
    setupVoiceControls() {
        const voiceSelect = document.getElementById('voiceSelect');
        const voiceSpeed = document.getElementById('voiceSpeed');
        const voicePitch = document.getElementById('voicePitch');
        const speedValue = document.getElementById('speedValue');
        const pitchValue = document.getElementById('pitchValue');
        
        if (!voiceSelect) return; // Controls not ready yet
        
        // Voice selection
        voiceSelect.addEventListener('change', (e) => {
            const voices = this.speechSynth.getVoices();
            this.selectedVoice = voices[e.target.value] || null;
        });
        
        // Speed control
        if (voiceSpeed && speedValue) {
            voiceSpeed.addEventListener('input', (e) => {
                speedValue.textContent = e.target.value + 'x';
            });
        }
        
        // Pitch control
        if (voicePitch && pitchValue) {
            voicePitch.addEventListener('input', (e) => {
                pitchValue.textContent = e.target.value;
            });
        }
    }

    generateStory() {
        const characters = document.getElementById('characters').value.trim();
        const theme = document.getElementById('theme').value;
        const length = document.getElementById('storyLength').value;
        const mood = document.getElementById('mood').value;
        const setting = document.getElementById('setting').value.trim();

        if (!characters) {
            alert('Please enter at least one character for your story!');
            return;
        }

        this.showLoading();
        
        // Simulate AI processing time
        setTimeout(() => {
            const story = this.createPersonalizedStory(characters, theme, length, mood, setting);
            this.displayStory(story);
            this.hideLoading();
        }, 3000);
    }

    generateSurpriseStory() {
        const themes = Object.keys(this.storyTemplates);
        const randomTheme = themes[Math.floor(Math.random() * themes.length)];
        const lengths = ['short', 'medium', 'long'];
        const randomLength = lengths[Math.floor(Math.random() * lengths.length)];
        const moods = ['peaceful', 'exciting', 'heartwarming', 'mysterious'];
        const randomMood = moods[Math.floor(Math.random() * moods.length)];

        // Generate random characters
        const characterNames = [
            'Luna', 'Max', 'Sparkle', 'Ruby', 'Oliver', 'Daisy', 'Felix', 'Aria',
            'Jasper', 'Lily', 'Cosmic', 'Belle', 'River', 'Star', 'Sage', 'Echo'
        ];
        const characterTypes = [
            'the brave knight', 'the gentle fairy', 'the wise owl', 'the playful puppy',
            'the magical unicorn', 'the kind dragon', 'the curious cat', 'the helpful robot',
            'the singing bird', 'the dancing butterfly', 'the clever fox', 'the friendly bear'
        ];

        const randomCharacters = [];
        const numCharacters = Math.floor(Math.random() * 3) + 1; // 1-3 characters
        
        for (let i = 0; i < numCharacters; i++) {
            const name = characterNames[Math.floor(Math.random() * characterNames.length)];
            const type = characterTypes[Math.floor(Math.random() * characterTypes.length)];
            randomCharacters.push(`${name} ${type}`);
        }

        // Set form values
        document.getElementById('characters').value = randomCharacters.join(', ');
        document.getElementById('theme').value = randomTheme;
        document.getElementById('storyLength').value = randomLength;
        document.getElementById('mood').value = randomMood;
        document.getElementById('setting').value = '';

        this.generateStory();
    }

    createPersonalizedStory(charactersInput, theme, length, mood, customSetting) {
        const characters = charactersInput.split(',').map(c => c.trim()).filter(c => c.length > 0);
        const template = this.storyTemplates[theme];
        
        // Select random elements from template
        const setting = customSetting || template.settings[Math.floor(Math.random() * template.settings.length)];
        const opening = template.openings[Math.floor(Math.random() * template.openings.length)];
        const conflict = template.conflicts[Math.floor(Math.random() * template.conflicts.length)];
        const resolution = template.resolutions[Math.floor(Math.random() * template.resolutions.length)];

        // Generate story title
        const title = this.generateTitle(characters[0], theme);

        // Calculate reading time and paragraph count based on length
        let readingTime, paragraphCount;
        switch (length) {
            case 'short':
                readingTime = '2-3 minutes';
                paragraphCount = 4;
                break;
            case 'medium':
                readingTime = '5-7 minutes';
                paragraphCount = 6;
                break;
            case 'long':
                readingTime = '10-12 minutes';
                paragraphCount = 8;
                break;
        }

        // Create the story
        const story = this.buildNarrative(characters, setting, opening, conflict, resolution, paragraphCount, mood, theme);

        return {
            title,
            content: story,
            characters,
            theme,
            length,
            mood,
            setting,
            readingTime,
            createdAt: new Date().toISOString()
        };
    }

    generateTitle(mainCharacter, theme) {
        const titleTemplates = {
            adventure: [
                `${mainCharacter}'s Great Adventure`,
                `The Quest of ${mainCharacter}`,
                `${mainCharacter} and the Magical Journey`,
                `The Adventures of ${mainCharacter}`
            ],
            friendship: [
                `${mainCharacter} and the Power of Friendship`,
                `How ${mainCharacter} Made New Friends`,
                `${mainCharacter}'s Kindness Journey`,
                `The Day ${mainCharacter} Learned About Friendship`
            ],
            magic: [
                `${mainCharacter} and the Magic Within`,
                `The Magical World of ${mainCharacter}`,
                `${mainCharacter}'s Enchanted Dream`,
                `When ${mainCharacter} Discovered Magic`
            ],
            animals: [
                `${mainCharacter} and the Forest Friends`,
                `${mainCharacter}'s Animal Adventure`,
                `The Day ${mainCharacter} Spoke to Animals`,
                `${mainCharacter} and the Woodland Mystery`
            ],
            space: [
                `${mainCharacter}'s Space Adventure`,
                `${mainCharacter} and the Cosmic Journey`,
                `The Day ${mainCharacter} Visited the Stars`,
                `${mainCharacter}'s Galactic Friends`
            ],
            ocean: [
                `${mainCharacter} and the Ocean's Secret`,
                `${mainCharacter}'s Underwater Adventure`,
                `The Day ${mainCharacter} Met a Mermaid`,
                `${mainCharacter} and the Deep Blue Mystery`
            ],
            forest: [
                `${mainCharacter} and the Whispering Woods`,
                `${mainCharacter}'s Forest Discovery`,
                `The Day ${mainCharacter} Found the Magic Tree`,
                `${mainCharacter} and the Woodland Spirits`
            ],
            dreams: [
                `${mainCharacter}'s Dreamland Journey`,
                `The Night ${mainCharacter} Visited Dreamland`,
                `${mainCharacter} and the Sleepy Adventure`,
                `Sweet Dreams with ${mainCharacter}`
            ]
        };

        const templates = titleTemplates[theme];
        return templates[Math.floor(Math.random() * templates.length)];
    }

    buildNarrative(characters, setting, opening, conflict, resolution, paragraphCount, mood, theme) {
        const mainCharacter = characters[0];
        const otherCharacters = characters.slice(1);
        
        let story = `${opening}, there lived ${this.formatCharacterList(characters)}. `;
        
        // Setting paragraph
        story += `They made their home in ${setting}, where ${this.getSettingDescription(setting, theme)}. `;
        
        // Character introduction
        story += `${mainCharacter} was known for being ${this.getRandomTrait()}, and `;
        if (otherCharacters.length > 0) {
            story += `together with ${this.formatCharacterList(otherCharacters)}, they `;
        } else {
            story += `they `;
        }
        story += `spent their days ${this.getDailyActivity(theme)}.\n\n`;

        // Main story development
        story += `One ${this.getTimeOfDay(mood)}, ${mainCharacter} ${conflict}. `;
        story += `${this.getEmotionalResponse(mood)} filled their heart as they realized this was the beginning of something truly special.\n\n`;

        // Journey/challenge paragraphs
        for (let i = 0; i < paragraphCount - 3; i++) {
            story += this.generateJourneyParagraph(characters, theme, mood) + '\n\n';
        }

        // Resolution
        story += `In the end, ${mainCharacter} and their friends ${resolution}. `;
        story += `${this.getResolutionEnding(mood, theme)}\n\n`;

        // Peaceful ending for bedtime
        story += `As the stars began to twinkle in the evening sky, ${mainCharacter} felt grateful for the wonderful adventure and the precious friends who shared it. With hearts full of joy and minds full of beautiful memories, they settled down for a peaceful night's sleep, knowing that tomorrow would bring new possibilities for kindness, friendship, and magical moments.`;

        return story;
    }

    formatCharacterList(characters) {
        if (characters.length === 1) return characters[0];
        if (characters.length === 2) return `${characters[0]} and ${characters[1]}`;
        return characters.slice(0, -1).join(', ') + `, and ${characters[characters.length - 1]}`;
    }

    getRandomTrait() {
        return this.characterTraits[Math.floor(Math.random() * this.characterTraits.length)];
    }

    getSettingDescription(setting, theme) {
        const descriptions = {
            adventure: 'every path led to new discoveries and exciting challenges',
            friendship: 'kindness bloomed like flowers and laughter echoed through the air',
            magic: 'sparkles danced in the air and wishes had a way of coming true',
            animals: 'all creatures lived in harmony and shared their wisdom freely',
            space: 'stars sang lullabies and planets painted the sky in brilliant colors',
            ocean: 'waves whispered ancient secrets and sea creatures shared their songs',
            forest: 'trees shared their ancient wisdom and every leaf held a story',
            dreams: 'imagination flowed like gentle streams and peace filled every corner'
        };
        return descriptions[theme] || 'magic and wonder filled every corner';
    }

    getDailyActivity(theme) {
        const activities = {
            adventure: 'exploring new trails and discovering hidden treasures',
            friendship: 'helping their neighbors and spreading joy wherever they went',
            magic: 'practicing spells of kindness and creating beautiful enchantments',
            animals: 'caring for their animal friends and learning from nature',
            space: 'stargazing and dreaming of distant galaxies',
            ocean: 'swimming with dolphins and collecting beautiful shells',
            forest: 'listening to the wisdom of the trees and tending to forest gardens',
            dreams: 'sharing wonderful dreams and creating peaceful moments'
        };
        return activities[theme] || 'spreading happiness and making the world more beautiful';
    }

    getTimeOfDay(mood) {
        const times = {
            peaceful: 'quiet morning',
            exciting: 'bright sunny day',
            heartwarming: 'gentle afternoon',
            mysterious: 'misty evening'
        };
        return times[mood] || 'beautiful day';
    }

    getEmotionalResponse(mood) {
        const responses = {
            peaceful: 'A sense of calm wonder',
            exciting: 'Thrilling excitement',
            heartwarming: 'Warm happiness',
            mysterious: 'Curious anticipation'
        };
        return responses[mood] || 'Joy';
    }

    generateJourneyParagraph(characters, theme, mood) {
        const challenges = {
            adventure: [
                'They climbed the highest mountain and discovered a view more beautiful than any picture.',
                'They crossed a babbling brook by helping each other step on the smoothest stones.',
                'They found a cave filled with glowing crystals that sang gentle melodies.',
                'They met a wise old tree that shared the secrets of growing strong and tall.'
            ],
            friendship: [
                'They helped a lost little animal find its way home to its family.',
                'They shared their lunch with someone who had forgotten theirs.',
                'They created a beautiful garden where everyone in the community could gather.',
                'They organized a celebration that brought all their neighbors together.'
            ],
            magic: [
                'They discovered that their kindness created sparkles of light wherever they went.',
                'They learned that sharing their gifts made their magic grow stronger.',
                'They found a magical mirror that showed the beauty in everyone\'s heart.',
                'They created a spell that turned sadness into hope and fear into courage.'
            ],
            animals: [
                'They learned the language of the birds and discovered the songs they sang about love.',
                'They helped a family of rabbits prepare their burrow for the coming season.',
                'They discovered that even the smallest ant had important wisdom to share.',
                'They created a safe haven where all creatures could rest and play together.'
            ],
            space: [
                'They visited a planet where the trees grew rainbow fruit and shared it with everyone.',
                'They met friendly aliens who taught them games played with stardust.',
                'They helped a lost meteor find its way back to its constellation family.',
                'They discovered that kindness is the universal language spoken throughout the galaxy.'
            ],
            ocean: [
                'They swam alongside gentle whales who shared ancient songs of the sea.',
                'They helped clean up the ocean so all the sea creatures could live happily.',
                'They discovered an underwater garden where coral grew in every color imaginable.',
                'They learned that the rhythm of the waves matched the beating of a kind heart.'
            ],
            forest: [
                'They planted new trees and watched them grow with love and patience.',
                'They helped forest animals prepare for winter by gathering food together.',
                'They discovered that listening to the forest taught them how to be still and peaceful.',
                'They created a circle where all woodland creatures could share their stories.'
            ],
            dreams: [
                'They visited the cloud kingdom where dreams are woven from moonbeams and starlight.',
                'They helped chase away nightmares by filling them with gentle thoughts and warm hugs.',
                'They discovered that the most beautiful dreams are the ones we share with others.',
                'They learned that peaceful sleep comes from a heart filled with gratitude and love.'
            ]
        };

        const themeJourneys = challenges[theme] || challenges.adventure;
        return themeJourneys[Math.floor(Math.random() * themeJourneys.length)];
    }

    getResolutionEnding(mood, theme) {
        const endings = {
            peaceful: 'They felt a deep sense of peace and contentment, knowing they had made the world a little brighter.',
            exciting: 'Their hearts were full of joy and excitement for all the wonderful adventures still to come.',
            heartwarming: 'They felt surrounded by love and knew that kindness creates the most beautiful stories.',
            mysterious: 'They smiled with wonder, knowing that life is full of beautiful mysteries waiting to be discovered.'
        };
        return endings[mood] || 'They felt happy and grateful for their wonderful adventure.';
    }

    displayStory(story) {
        this.currentStory = story;
        
        document.getElementById('storyTitle').textContent = story.title;
        document.getElementById('readingTime').textContent = `📖 ${story.readingTime}`;
        document.getElementById('storyTheme').textContent = `${this.getThemeEmoji(story.theme)} ${story.theme.charAt(0).toUpperCase() + story.theme.slice(1)}`;
        
        // Format story content with paragraphs
        const formattedContent = story.content.split('\n\n').map(paragraph => 
            `<p class="story-paragraph">${paragraph}</p>`
        ).join('');
        
        document.getElementById('storyText').innerHTML = formattedContent;
        
        // Show story output and hide form
        document.querySelector('.story-form-container').style.display = 'none';
        document.getElementById('storyOutput').style.display = 'block';
        
        // Initialize voice controls now that they're visible
        setTimeout(() => {
            this.loadVoices();
            this.setupVoiceControls();
        }, 100);
        
        // Scroll to story
        document.getElementById('storyOutput').scrollIntoView({ behavior: 'smooth' });
    }

    getThemeEmoji(theme) {
        const emojis = {
            adventure: '🗺️',
            friendship: '👫',
            magic: '✨',
            animals: '🐾',
            space: '🚀',
            ocean: '🌊',
            forest: '🌲',
            dreams: '💭'
        };
        return emojis[theme] || '📚';
    }

    showStoryForm() {
        document.querySelector('.story-form-container').style.display = 'block';
        document.getElementById('storyOutput').style.display = 'none';
        document.querySelector('.story-form-container').scrollIntoView({ behavior: 'smooth' });
    }

    showLoading() {
        const overlay = document.getElementById('loadingOverlay');
        const tips = document.getElementById('loadingTips');
        
        overlay.style.display = 'flex';
        
        // Cycle through loading tips
        let tipIndex = 0;
        this.loadingInterval = setInterval(() => {
            tips.textContent = this.loadingTips[tipIndex];
            tipIndex = (tipIndex + 1) % this.loadingTips.length;
        }, 800);
    }

    hideLoading() {
        document.getElementById('loadingOverlay').style.display = 'none';
        if (this.loadingInterval) {
            clearInterval(this.loadingInterval);
        }
    }

    readStoryAloud() {
        if (!this.currentStory) return;

        const readBtn = document.querySelector('.btn-read');
        
        if (this.isReading) {
            this.speechSynth.cancel();
            this.isReading = false;
            readBtn.innerHTML = '🔊 Read Aloud';
            return;
        }

        const utterance = new SpeechSynthesisUtterance(this.currentStory.content);
        
        // Get user-selected settings
        const voiceSpeed = document.getElementById('voiceSpeed');
        const voicePitch = document.getElementById('voicePitch');
        
        // Apply custom settings or defaults
        utterance.rate = voiceSpeed ? parseFloat(voiceSpeed.value) : 0.8;
        utterance.pitch = voicePitch ? parseFloat(voicePitch.value) : 1.1;
        utterance.volume = 0.8;

        // Use selected voice or auto-select a good one
        if (this.selectedVoice) {
            utterance.voice = this.selectedVoice;
        } else {
            // Fallback to auto-selection
            const voices = this.speechSynth.getVoices();
            const gentleVoice = voices.find(voice => 
                voice.lang.startsWith('en') && (
                    voice.name.includes('Female') || 
                    voice.name.includes('Woman') ||
                    voice.name.includes('Samantha') ||
                    voice.name.includes('Victoria') ||
                    voice.name.includes('Karen')
                )
            );
            
            if (gentleVoice) {
                utterance.voice = gentleVoice;
                this.selectedVoice = gentleVoice;
            }
        }

        utterance.onstart = () => {
            this.isReading = true;
            readBtn.innerHTML = '⏸️ Stop Reading';
            readBtn.style.background = 'linear-gradient(135deg, #ff6b6b, #ee5a52)';
        };

        utterance.onend = () => {
            this.isReading = false;
            readBtn.innerHTML = '🔊 Read Aloud';
            readBtn.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
        };

        utterance.onerror = () => {
            this.isReading = false;
            readBtn.innerHTML = '🔊 Read Aloud';
            readBtn.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
            alert('Sorry, there was an error with the voice playback. Please try a different voice.');
        };

        this.speechSynth.speak(utterance);
    }

    saveStory() {
        if (!this.currentStory) return;

        const storyToSave = {
            ...this.currentStory,
            id: Date.now().toString(),
            savedAt: new Date().toISOString()
        };

        this.savedStories.unshift(storyToSave);
        
        // Keep only the last 20 stories
        if (this.savedStories.length > 20) {
            this.savedStories = this.savedStories.slice(0, 20);
        }

        localStorage.setItem('bedtimeStories', JSON.stringify(this.savedStories));
        this.displaySavedStories();

        // Show confirmation
        const saveBtn = document.querySelector('.btn-save');
        const originalText = saveBtn.innerHTML;
        saveBtn.innerHTML = '✅ Saved!';
        setTimeout(() => {
            saveBtn.innerHTML = originalText;
        }, 2000);
    }

    shareStory() {
        if (!this.currentStory) return;

        if (navigator.share) {
            navigator.share({
                title: this.currentStory.title,
                text: `Check out this bedtime story: "${this.currentStory.title}"\n\n${this.currentStory.content.substring(0, 200)}...`,
                url: window.location.href
            });
        } else {
            // Fallback to clipboard
            const shareText = `${this.currentStory.title}\n\n${this.currentStory.content}`;
            navigator.clipboard.writeText(shareText).then(() => {
                const shareBtn = document.querySelector('.btn-share');
                const originalText = shareBtn.innerHTML;
                shareBtn.innerHTML = '📋 Copied!';
                setTimeout(() => {
                    shareBtn.innerHTML = originalText;
                }, 2000);
            });
        }
    }

    displaySavedStories() {
        const container = document.getElementById('savedStoriesList');
        
        if (this.savedStories.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #666;">No saved stories yet. Create your first story above!</p>';
            return;
        }

        container.innerHTML = this.savedStories.map(story => `
            <div class="saved-story-item">
                <div class="saved-story-title">${story.title}</div>
                <div class="saved-story-preview">${story.content.substring(0, 100)}...</div>
                <div class="saved-story-meta">
                    <span>${story.readingTime} • ${new Date(story.savedAt).toLocaleDateString()}</span>
                    <div class="saved-story-actions">
                        <button onclick="storyGenerator.loadSavedStory('${story.id}')">Read</button>
                        <button onclick="storyGenerator.deleteSavedStory('${story.id}')">Delete</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    loadSavedStory(id) {
        const story = this.savedStories.find(s => s.id === id);
        if (story) {
            this.displayStory(story);
        }
    }

    deleteSavedStory(id) {
        if (confirm('Are you sure you want to delete this story?')) {
            this.savedStories = this.savedStories.filter(s => s.id !== id);
            localStorage.setItem('bedtimeStories', JSON.stringify(this.savedStories));
            this.displaySavedStories();
        }
    }
}

// Global functions for HTML buttons
let storyGenerator;

function generateStory() {
    storyGenerator.generateStory();
}

function generateSurpriseStory() {
    storyGenerator.generateSurpriseStory();
}

function showStoryForm() {
    storyGenerator.showStoryForm();
}

function readStoryAloud() {
    storyGenerator.readStoryAloud();
}

function saveStory() {
    storyGenerator.saveStory();
}

function shareStory() {
    storyGenerator.shareStory();
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    storyGenerator = new BedtimeStoryGenerator();
    
    // Load voices for speech synthesis
    if ('speechSynthesis' in window) {
        speechSynthesis.addEventListener('voiceschanged', () => {
            // Voices are now loaded
        });
    }
});
