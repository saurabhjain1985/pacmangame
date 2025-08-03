@echo off
echo ==========================================
echo    iOS Games Collection - Local Server
echo ==========================================
echo.
echo Starting local server...
echo Your games will be available at:
echo.
echo    http://localhost:8000
echo.
echo Instructions:
echo - Open your web browser
echo - Go to http://localhost:8000
echo - Choose your game and play!
echo.
echo Press Ctrl+C to stop the server
echo ==========================================
echo.
cd /d "%~dp0"
python -m http.server 8000
echo.
echo Server stopped. Press any key to exit...
pause >nul
