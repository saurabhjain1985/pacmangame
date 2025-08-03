@echo off
cd /d "c:\DemoPacman"
echo Starting Python HTTP server on port 8000...
echo Open http://localhost:8000/memory.html in your browser
python -m http.server 8000
pause
