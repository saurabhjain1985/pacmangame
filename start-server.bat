@echo off
echo Starting Pac-Man iOS Game Server...
echo.
echo Open your browser and go to: http://localhost:8000
echo Press Ctrl+C to stop the server
echo.
python -m http.server 8000
pause
