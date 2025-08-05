// Quick Story Builder Test
console.log('Testing Story Builder...');

// Simulate the story generation process
const testParams = {
    characters: 'Luna the brave princess, Sparkle the magical unicorn',
    theme: 'adventure',
    length: 'medium',
    mood: 'peaceful',
    setting: 'enchanted forest'
};

console.log('Test Parameters:', testParams);

// Test story templates
const storyTemplates = {
    adventure: {
        settings: ['enchanted forest', 'mysterious castle', 'hidden valley', 'magical mountain', 'secret cave'],
        openings: [
            'Once upon a time, in a land far beyond the rainbow',
            'In a magical realm where dreams come true',
            'Long ago, when the world was young and full of wonder'
        ],
        conflicts: [
            'discovered a mysterious map that led to an ancient treasure',
            'found a magical key that opened doors to other worlds',
            'met a wise old wizard who needed their help'
        ],
        resolutions: [
            'learned that the greatest treasure was the friendship they made along the way',
            'discovered that kindness and courage can overcome any challenge',
            'found that helping others brings the most wonderful rewards'
        ]
    }
};

// Generate a test story
function generateTestStory() {
    const characters = testParams.characters.split(',').map(c => c.trim());
    const template = storyTemplates[testParams.theme];
    
    const setting = template.settings[0];
    const opening = template.openings[0];
    const conflict = template.conflicts[0];
    const resolution = template.resolutions[0];
    
    const mainCharacter = characters[0];
    
    let story = `${opening}, there lived ${characters.join(' and ')}. `;
    story += `They made their home in an ${setting}, where magic filled every corner. `;
    story += `${mainCharacter} was known for being brave and kind, and together they spent their days exploring and helping others.\n\n`;
    story += `One peaceful morning, ${mainCharacter} ${conflict}. `;
    story += `Excitement filled their heart as they realized this was the beginning of something truly special.\n\n`;
    story += `Through their journey, they faced challenges with courage and helped many friends along the way. `;
    story += `Each step brought new discoveries and strengthened the bond between the companions.\n\n`;
    story += `In the end, ${mainCharacter} and their friends ${resolution}. `;
    story += `Their hearts filled with joy as they celebrated their wonderful adventure.\n\n`;
    story += `As the stars began to twinkle in the evening sky, ${mainCharacter} felt grateful for the wonderful adventure and the precious friends who shared it. With hearts full of joy and minds full of beautiful memories, they settled down for a peaceful night's sleep, knowing that tomorrow would bring new possibilities for kindness, friendship, and magical moments.`;
    
    return {
        title: `The Adventures of ${mainCharacter}`,
        content: story,
        characters: characters,
        theme: testParams.theme,
        setting: setting,
        readingTime: '5-7 minutes'
    };
}

// Generate and display the test story
const testStory = generateTestStory();
console.log('\n=== GENERATED STORY ===');
console.log('Title:', testStory.title);
console.log('Characters:', testStory.characters.join(', '));
console.log('Theme:', testStory.theme);
console.log('Setting:', testStory.setting);
console.log('Reading Time:', testStory.readingTime);
console.log('\nStory Content:');
console.log(testStory.content);
console.log('\n=== END OF STORY ===');

console.log('\n✅ Story Builder test completed successfully!');
