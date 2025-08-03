# 🎮 iOS Games Collection - Local Server Setup

## 🚀 Quick Start

### Method 1: Double-Click (Easiest)
1. Double-click `start-games-server.bat`
2. Wait for "Serving HTTP on 0.0.0.0 port 8000" message
3. Open your browser and go to: **http://localhost:8000**
4. Choose your game and play!

### Method 2: Command Line
1. Open Command Prompt or PowerShell
2. Navigate to the games folder: `cd c:\DemoPacman`
3. Run: `python -m http.server 8000`
4. Open browser: **http://localhost:8000**

### Method 3: VS Code Live Server (If you have it)
1. Install "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

## 🎯 Game URLs

Once the server is running, access games directly:

- **Main Menu**: http://localhost:8000
- **Pac-Man**: http://localhost:8000/pacman.html
- **Memory Match**: http://localhost:8000/memory.html
- **Snake**: http://localhost:8000/snake.html

## 🎮 Available Games

### 🟡 Pac-Man iOS
- Classic arcade action with Apple design
- 3 smart ghost AI types
- Mobile-friendly controls
- Power-up system

### 🧠 Memory Match
- Test your memory skills
- 3 difficulty levels (Easy/Medium/Hard)
- Timer and scoring system
- Beautiful card animations

### 🐍 Snake iOS
- Classic snake game modernized
- 3 speed levels
- Touch and keyboard controls
- High score tracking

## 📱 Mobile Support

All games are fully optimized for mobile devices:
- Touch controls
- Responsive design
- Haptic feedback
- Swipe gestures

## 🛠️ Troubleshooting

### Server Won't Start
- Make sure Python is installed: `python --version`
- Check if port 8000 is available
- Try a different port: `python -m http.server 3000`

### Games Not Loading
- Make sure you're using `http://localhost:8000` (not file://)
- Clear browser cache
- Check browser console for errors

### Mobile Issues
- Use Chrome or Safari on mobile
- Enable JavaScript
- Allow notifications for haptic feedback

## 🎯 Performance Tips

- Use Chrome or Edge for best performance
- Close other browser tabs for smoother gameplay
- Enable hardware acceleration in browser settings

## 🔧 Development

To add more games:
1. Create new HTML/CSS/JS files
2. Add game card to `index.html`
3. Update `main-menu.js` navigation
4. Test on both desktop and mobile

## 📊 Browser Compatibility

✅ **Recommended Browsers:**
- Chrome 90+
- Edge 90+
- Firefox 88+
- Safari 14+

✅ **Mobile Browsers:**
- Chrome Mobile
- Safari Mobile
- Samsung Internet
- Firefox Mobile

---

🎮 **Enjoy your games!** Built with HTML5, CSS3, and JavaScript.
