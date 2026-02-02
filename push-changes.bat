@echo off
cd /d "c:\1111\1\deploy"
git add frontend/vite.config.ts
git commit -m "Fix: Update base path for GitHub Pages subdirectory deployment"
git push
pause
