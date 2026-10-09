@echo off
cd /d "%~dp0"
rem Get latest changes from GitHub first, so push will not be rejected
git pull --no-rebase origin main
if errorlevel 1 (
  echo.
  echo [ERROR] git pull failed - probably a merge conflict. Nothing was pushed.
  pause
  exit /b 1
)
powershell -ExecutionPolicy Bypass -File "%~dp0generate_index.ps1"
git add .
git commit -m "update %date% %time%"
git push -u origin main
pause
