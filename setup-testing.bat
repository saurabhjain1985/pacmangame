@echo off
title Setup Testing Framework
echo ========================================
echo    GAME TESTING FRAMEWORK SETUP
echo ========================================
echo.

echo [INFO] Setting up automated testing framework...
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is required but not installed
    echo [INFO] Please install Node.js from https://nodejs.org/
    echo [INFO] After installation, run this script again
    goto :END
)

echo [PASS] Node.js found
node --version

echo.
echo [STEP 1] Installing testing dependencies...

REM Check if package.json exists
if not exist "package.json" (
    echo [ERROR] package.json not found
    goto :END
)

REM Install dependencies
echo [INFO] Installing Puppeteer, Chalk, and Commander...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install dependencies
    goto :END
)

echo [PASS] Dependencies installed successfully

echo.
echo [STEP 2] Setting up test framework files...

REM Verify test files exist
set MISSING_FILES=0

if not exist "test-framework.html" (
    echo [ERROR] test-framework.html missing
    set /a MISSING_FILES+=1
)
if not exist "test-framework.js" (
    echo [ERROR] test-framework.js missing
    set /a MISSING_FILES+=1
)
if not exist "test-runner.js" (
    echo [ERROR] test-runner.js missing
    set /a MISSING_FILES+=1
)

if %MISSING_FILES% GTR 0 (
    echo [ERROR] %MISSING_FILES% test framework files missing
    goto :END
)

echo [PASS] All test framework files present

echo.
echo [STEP 3] Testing framework installation...

REM Quick test to verify everything works
echo [INFO] Running installation verification test...
node -e "console.log('Node.js working'); const pkg = require('./package.json'); console.log('Package loaded:', pkg.name);"
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Installation verification failed
    goto :END
)

echo [PASS] Installation verification successful

echo.
echo [STEP 4] Setting up shortcut scripts...

REM Make batch scripts executable (Windows doesn't need chmod, but verify they exist)
if not exist "run-quick-tests.bat" (
    echo [WARN] run-quick-tests.bat missing
)
if not exist "run-all-tests.bat" (
    echo [WARN] run-all-tests.bat missing  
)
if not exist "pre-deploy-test.bat" (
    echo [WARN] pre-deploy-test.bat missing
)

echo [PASS] Setup complete

echo.
echo ========================================
echo      TESTING FRAMEWORK READY!
echo ========================================
echo.
echo Available testing options:
echo.
echo 1. Manual Testing (Web Interface):
echo    • Open test-framework.html in browser
echo    • Click buttons to run different test suites
echo.
echo 2. Automated Testing (Command Line):
echo    • npm run test           (Full test suite)
echo    • npm run test:quick     (Quick smoke test)
echo    • npm run test:game      (Specific game test)
echo    • npm run test:performance (Performance only)
echo.
echo 3. Batch Scripts (Windows):
echo    • run-quick-tests.bat    (Quick validation)
echo    • run-all-tests.bat      (Comprehensive testing)
echo    • pre-deploy-test.bat    (Pre-deployment checks)
echo.
echo 4. Integration Testing:
echo    • Always run tests before making changes
echo    • Use pre-deploy-test.bat before deployment
echo    • Monitor test results and fix failures
echo.

echo [NEXT STEPS]
echo 1. Run a quick test: npm run test:quick
echo 2. Open manual tester: start test-framework.html
echo 3. Review TESTING.md for detailed documentation
echo.

choice /c YN /m "Do you want to run a quick test now"
if %ERRORLEVEL% EQU 1 (
    echo.
    echo [INFO] Running quick test...
    call npm run test:quick
) else (
    echo [INFO] You can run tests later using the commands above
)

:END
echo.
echo Setup complete! Happy testing! 🎮
pause
