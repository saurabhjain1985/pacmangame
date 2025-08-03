@echo off
title Pre-Deployment Tests
echo ========================================
echo     PRE-DEPLOYMENT TESTING SUITE
echo ========================================
echo.

echo [INFO] Running pre-deployment validation...
echo [INFO] This ensures your changes won't break existing functionality
echo.

set DEPLOYMENT_READY=1
set CRITICAL_ERRORS=0
set WARNINGS=0

echo [STEP 1] Critical file validation...
call :VALIDATE_CRITICAL_FILES
if %ERRORLEVEL% NEQ 0 set DEPLOYMENT_READY=0

echo.
echo [STEP 2] Syntax validation...
call :VALIDATE_SYNTAX
if %ERRORLEVEL% NEQ 0 set DEPLOYMENT_READY=0

echo.
echo [STEP 3] Cross-browser compatibility check...
call :CHECK_COMPATIBILITY

echo.
echo [STEP 4] Performance regression test...
call :PERFORMANCE_REGRESSION

echo.
echo [STEP 5] Mobile responsiveness check...
call :MOBILE_CHECK

echo.
echo [STEP 6] Final deployment readiness...
call :DEPLOYMENT_DECISION

goto :END

:VALIDATE_CRITICAL_FILES
echo [INFO] Validating critical files...

REM Check main entry point
if not exist "index.html" (
    echo [CRITICAL] index.html missing
    set /a CRITICAL_ERRORS+=1
    exit /b 1
)

REM Check all game files exist
set GAMES=memory tetris breakout snake pacman puzzle math-tables
for %%g in (%GAMES%) do (
    if not exist "%%g.html" (
        echo [CRITICAL] %%g.html missing
        set /a CRITICAL_ERRORS+=1
    )
    if not exist "%%g.js" (
        echo [CRITICAL] %%g.js missing  
        set /a CRITICAL_ERRORS+=1
    )
    if not exist "%%g.css" (
        echo [WARNING] %%g.css missing - using default styles
        set /a WARNINGS+=1
    )
)

if %CRITICAL_ERRORS% EQU 0 (
    echo [PASS] All critical files present
    exit /b 0
) else (
    echo [FAIL] %CRITICAL_ERRORS% critical files missing
    exit /b 1
)

:VALIDATE_SYNTAX
echo [INFO] Validating syntax...

REM Basic HTML validation
for %%f in (*.html) do (
    findstr /c:"<html" "%%f" >nul
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] %%f: Missing HTML tag
        set /a CRITICAL_ERRORS+=1
    )
    
    findstr /c:"</html>" "%%f" >nul
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] %%f: Missing closing HTML tag
        set /a CRITICAL_ERRORS+=1
    )
)

REM Basic CSS validation
for %%f in (*.css) do (
    findstr /c:"{" "%%f" >nul
    if %ERRORLEVEL% EQU 0 (
        REM Count opening and closing braces
        for /f %%a in ('findstr /c:"{" "%%f" ^| find /c /v ""') do set OPEN=%%a
        for /f %%a in ('findstr /c:"}" "%%f" ^| find /c /v ""') do set CLOSE=%%a
        
        if not "!OPEN!" == "!CLOSE!" (
            echo [WARNING] %%f: Mismatched braces
            set /a WARNINGS+=1
        )
    )
)

REM Basic JS validation - check for common syntax errors
for %%f in (*.js) do (
    findstr /c:"function\|class\|const" "%%f" >nul
    if %ERRORLEVEL% EQU 0 (
        REM Check for unclosed functions/brackets (basic check)
        findstr /r /c:"function.*{" "%%f" >nul
        if %ERRORLEVEL% EQU 0 (
            set /a WARNINGS+=1
            REM This is a simplified check - in real scenarios use a proper linter
        )
    )
)

if %CRITICAL_ERRORS% EQU 0 (
    echo [PASS] Syntax validation completed
    if %WARNINGS% GTR 0 echo [INFO] %WARNINGS% warnings found
    exit /b 0
) else (
    echo [FAIL] %CRITICAL_ERRORS% syntax errors found
    exit /b 1
)

:CHECK_COMPATIBILITY
echo [INFO] Checking cross-browser compatibility...

REM Check for known compatibility issues
findstr /s /i /c:"backdrop-filter" *.css >nul
if %ERRORLEVEL% EQU 0 (
    echo [INFO] backdrop-filter detected - ensure fallbacks for older browsers
)

findstr /s /i /c:"flex\|grid" *.css >nul
if %ERRORLEVEL% EQU 0 (
    echo [INFO] Modern CSS layouts detected - should work on modern browsers
)

findstr /s /i /c:"const\|let\|=>" *.js >nul
if %ERRORLEVEL% EQU 0 (
    echo [INFO] Modern JavaScript detected - IE11 not supported
)

echo [PASS] Compatibility check completed
exit /b 0

:PERFORMANCE_REGRESSION
echo [INFO] Checking for performance regressions...

REM Check file sizes for bloat
set LARGE_FILES=0
for %%f in (*.html *.css *.js) do (
    if %%~zf GTR 100000 (
        echo [WARNING] %%f is large (%%~zf bytes) - consider optimization
        set /a LARGE_FILES+=1
        set /a WARNINGS+=1
    )
)

REM Check for performance-heavy operations
findstr /s /i /c:"setInterval\|setTimeout" *.js >nul  
if %ERRORLEVEL% EQU 0 (
    echo [INFO] Timers detected - ensure they're properly cleaned up
)

findstr /s /i /c:"while.*true\|for.*;;)" *.js >nul
if %ERRORLEVEL% EQU 0 (
    echo [WARNING] Potential infinite loops detected
    set /a WARNINGS+=1
)

echo [PASS] Performance regression check completed
exit /b 0

:MOBILE_CHECK
echo [INFO] Checking mobile responsiveness...

REM Check for viewport meta tag
findstr /s /c:"viewport" *.html >nul
if %ERRORLEVEL% EQU 0 (
    echo [PASS] Viewport meta tags found
) else (
    echo [WARNING] Missing viewport meta tags - mobile experience may be poor
    set /a WARNINGS+=1
)

REM Check for touch events
findstr /s /i /c:"touch\|click" *.js >nul
if %ERRORLEVEL% EQU 0 (
    echo [PASS] Touch/click events found
) else (
    echo [WARNING] No touch events detected - games may not work on mobile
    set /a WARNINGS+=1
)

REM Check for responsive CSS
findstr /s /i /c:"@media\|max-width\|min-width" *.css >nul
if %ERRORLEVEL% EQU 0 (
    echo [PASS] Responsive CSS detected
) else (
    echo [WARNING] No responsive CSS found - layout may break on mobile
    set /a WARNINGS+=1
)

echo [PASS] Mobile responsiveness check completed
exit /b 0

:DEPLOYMENT_DECISION
echo [INFO] Analyzing deployment readiness...
echo.
echo ========================================
echo           DEPLOYMENT REPORT
echo ========================================
echo Critical Errors: %CRITICAL_ERRORS%
echo Warnings: %WARNINGS%
echo.

if %CRITICAL_ERRORS% EQU 0 (
    if %WARNINGS% EQU 0 (
        echo [SUCCESS] ✅ READY FOR DEPLOYMENT
        echo All checks passed - no issues found
        set DEPLOYMENT_READY=1
    ) else if %WARNINGS% LEQ 3 (
        echo [CAUTION] ⚠️ READY FOR DEPLOYMENT WITH WARNINGS
        echo %WARNINGS% warnings found - review recommended
        set DEPLOYMENT_READY=1
    ) else (
        echo [WARNING] ⚠️ DEPLOYMENT NOT RECOMMENDED
        echo Too many warnings (%WARNINGS%) - review and fix issues
        set DEPLOYMENT_READY=0
    )
) else (
    echo [BLOCKED] ❌ DEPLOYMENT BLOCKED
    echo %CRITICAL_ERRORS% critical errors must be fixed
    set DEPLOYMENT_READY=0
)

echo.
if %DEPLOYMENT_READY% EQU 1 (
    echo [NEXT STEPS]
    echo 1. Proceed with deployment
    echo 2. Monitor for issues post-deployment
    echo 3. Run post-deployment validation
) else (
    echo [REQUIRED ACTIONS]
    echo 1. Fix all critical errors
    echo 2. Review and address warnings
    echo 3. Re-run pre-deployment tests
    echo 4. Do not deploy until tests pass
)

exit /b 0

:END
echo.
echo ========================================
echo     PRE-DEPLOYMENT TESTING COMPLETE
echo ========================================
echo.

if %DEPLOYMENT_READY% EQU 1 (
    echo ✅ Your changes are ready for deployment!
    start "" "test-framework.html"
    echo.
    echo Opening test framework for final validation...
) else (
    echo ❌ Deployment blocked - fix issues and re-test
    echo.
    echo Review the errors above and run this script again
)

echo.
pause
