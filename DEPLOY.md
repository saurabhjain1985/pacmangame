# Pac-Man iOS Game Files

## File Structure
```
DemoPacman/
├── index.html      # Main HTML file
├── style.css       # Apple-inspired styling
├── game.js         # Game logic and AI
└── README.md       # Documentation
```

## Quick Deploy Instructions

### Option 1: Netlify Drop (Fastest)
1. Go to https://netlify.com/drop
2. Drag the entire DemoPacman folder
3. Share the generated URL

### Option 2: GitHub Pages
1. Create GitHub account
2. Create new repository named "pacman-ios"
3. Upload all files
4. Enable GitHub Pages in Settings
5. Share: https://yourusername.github.io/pacman-ios/

### Option 3: Vercel
1. Go to https://vercel.com
2. Import project from folder
3. Deploy automatically

### Option 4: Local Network Sharing
Run a local server and share your IP address:
```bash
# Python 3
python -m http.server 8000

# Node.js (if you have it)
npx serve .
```
Then share: http://your-ip-address:8000
