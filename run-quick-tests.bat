@echo off
title Quick Game Tests
echo ========================================
echo     QUICK GAME TESTING SUITE
echo ========================================
echo.

echo [INFO] Starting quick validation tests...
echo [INFO] This will test basic game loading and functionality
echo.

REM Check if Node.js is available for advanced testing
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [INFO] Node.js detected - Enhanced testing available
) else (
    echo [WARN] Node.js not found - Basic testing only
)

echo.
echo [STEP 1] Checking game files...
set MISSING_FILES=0

if not exist "memory.html" (
    echo [ERROR] memory.html missing
    set /a MISSING_FILES+=1
)
if not exist "tetris.html" (
    echo [ERROR] tetris.html missing  
    set /a MISSING_FILES+=1
)
if not exist "breakout.html" (
    echo [ERROR] breakout.html missing
    set /a MISSING_FILES+=1
)
if not exist "snake.html" (
    echo [ERROR] snake.html missing
    set /a MISSING_FILES+=1
)
if not exist "pacman.html" (
    echo [ERROR] pacman.html missing
    set /a MISSING_FILES+=1
)
if not exist "puzzle.html" (
    echo [ERROR] puzzle.html missing
    set /a MISSING_FILES+=1
)
if not exist "math-tables.html" (
    echo [ERROR] math-tables.html missing
    set /a MISSING_FILES+=1
)

if %MISSING_FILES% EQU 0 (
    echo [PASS] All game files present
) else (
    echo [FAIL] %MISSING_FILES% game files missing
    goto :END
)

echo.
echo [STEP 2] Checking CSS and JS files...
set MISSING_ASSETS=0

for %%f in (memory tetris breakout snake pacman puzzle math-tables) do (
    if not exist "%%f.css" (
        echo [ERROR] %%f.css missing
        set /a MISSING_ASSETS+=1
    )
    if not exist "%%f.js" (
        echo [ERROR] %%f.js missing
        set /a MISSING_ASSETS+=1
    )
)

if %MISSING_ASSETS% EQU 0 (
    echo [PASS] All asset files present
) else (
    echo [FAIL] %MISSING_ASSETS% asset files missing
)

echo.
echo [STEP 3] Starting local server for testing...
start /B python -m http.server 8080 >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [WARN] Python server failed, trying Node.js...
    where node >nul 2>nul
    if %ERRORLEVEL% EQU 0 (
        start /B npx http-server -p 8080 >nul 2>&1
    ) else (
        echo [ERROR] Cannot start test server
        goto :END
    )
)

echo [INFO] Test server starting on port 8080...
timeout /t 3 /nobreak >nul

echo.
echo [STEP 4] Opening test framework...
start "" "http://localhost:8080/test-framework.html"

echo.
echo [INFO] Test framework opened in browser
echo [INFO] Click 'Quick Test' to run automated tests
echo [INFO] Press any key to stop the test server...

pause >nul

echo.
echo [INFO] Stopping test server...
taskkill /f /im python.exe >nul 2>&1
taskkill /f /im node.exe >nul 2>&1

:END
echo.
echo [INFO] Quick test setup complete
echo ========================================
pause
