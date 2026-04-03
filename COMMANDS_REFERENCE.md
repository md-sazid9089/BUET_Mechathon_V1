# 🖥️ COMMAND REFERENCE

Quick reference for all common commands.

## 🚀 GETTING STARTED

### Initial Setup
```bash
cd BUET_Mechathon_V1
npm install          # Install all dependencies (run once)
npm run dev          # Start development server
```

After `npm run dev`:
- Browser opens to http://localhost:3000
- Hot reload enabled (changes update live)
- Press `Ctrl+C` to stop server

---

## 📝 DEVELOPMENT COMMANDS

### Start Development Server
```bash
npm run dev
```
- Runs on http://localhost:3000
- Hot module replacement (HMR) enabled
- Opens browser automatically

### Build for Production
```bash
npm run build
```
- Creates optimized `dist/` folder
- Ready to deploy to hosting
- ~500KB gzipped

### Preview Production Build
```bash
npm run preview
```
- Shows what production build looks like
- Runs on http://localhost:4173

### Run Linter
```bash
npm run lint
```
- Checks code for errors
- Reports style issues
- Use `npm run lint -- --fix` to auto-fix

---

## 📦 DEPENDENCY COMMANDS

### List Installed Packages
```bash
npm list
npm list --depth=0    # Top-level only
```

### Install Specific Package
```bash
npm install package-name
npm install package-name@1.2.3    # Specific version
npm install package-name@latest   # Latest version
```

### Install Dev Dependency Only
```bash
npm install --save-dev package-name
```

### Update All Packages
```bash
npm update
```

### Update Specific Package
```bash
npm update package-name
```

### Remove Package
```bash
npm uninstall package-name
```

### Clean Install (Clear Cache)
```bash
# Remove node_modules and reinstall
rm -rf node_modules package-lock.json    # Mac/Linux
rmdir /s node_modules                    # Windows

npm install
```

---

## 🔍 INSPECTION COMMANDS

### Check Package Versions
```bash
npm list package-name
npm view package-name versions    # All available versions
npm outdated                      # Shows outdated packages
```

### Check for Security Issues
```bash
npm audit
npm audit fix    # Auto-fix security problems
```

### Clear NPM Cache
```bash
npm cache clean --force
```

---

## 🗂️ PROJECT COMMANDS

### Create New Component File
```bash
# Create a component
echo. > src/components/NewComponent.jsx

# Then add:
# import React from 'react'
# 
# export function NewComponent() {
#   return <div>Your component</div>
# }
```

### Create New Page
```bash
echo. > src/pages/NewPage.jsx

# Then add:
# import React from 'react'
# 
# export default function NewPage() {
#   return <div>New Page</div>
# }
```

### Create New Utility
```bash
echo. > src/utils/newUtil.js

# Then add your functions and export them
```

---

## 🎨 TAILWIND COMMANDS

### Rebuild Tailwind CSS
```bash
# Usually automatic, but trigger manually if needed:
npm run build
```

### Check Tailwind Config
```bash
# View effective Tailwind config:
npx tailwind config --list
```

---

## 🐛 DEBUGGING & TROUBLESHOOTING

### Common Issues & Fixes

#### Server won't start
```bash
# Port might be in use
npm run dev -- --port 3001

# Or kill process on port 3000
# Mac/Linux: lsof -ti:3000 | xargs kill -9
# Windows: netstat -ano | findstr :3000
```

#### Changes not showing up
```bash
# Try hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
# Or clear browser cache and reload
```

#### Node modules broken
```bash
# Reinstall from scratch
rm -rf node_modules package-lock.json
npm install
```

#### Getting "Module not found" errors
```bash
# Check your import path is correct (case-sensitive)
# Check file exists at that path
# Try hard refresh in browser
```

### Check Node/NPM Versions
```bash
node --version    # Should be v18+
npm --version     # Should be v9+
```

---

## 📂 FILE SYSTEM COMMANDS

### List Directory Structure
```bash
# Show file tree
tree src/    # All subdirectories

# Or use ls/dir
ls -R src/   # Mac/Linux
dir /s src   # Windows
```

### Count Lines of Code
```bash
# Count all JavaScript files
find src -name "*.jsx" -o -name "*.js" | xargs wc -l

# Or simpler:
find src -type f \( -name "*.jsx" -o -name "*.js" \) -exec wc -l {} +
```

### Search in Files
```bash
# Find text in all files
grep -r "searchTerm" src/
grep -r "Component" src/components/

# Case-insensitive:
grep -ri "component" src/
```

---

## 🔄 GIT COMMANDS (If Using Git)

### Initialize Repository
```bash
git init
```

### Check Status
```bash
git status
```

### Add Files
```bash
git add .           # Add all changes
git add filename    # Add specific file
```

### Commit Changes
```bash
git commit -m "Your message"
```

### Push to Remote
```bash
git push origin main
```

### View History
```bash
git log
git log --oneline   # Compact view
```

---

## 🚢 DEPLOYMENT COMMANDS

### Build for Production
```bash
npm run build
```

### Deploy to Vercel (if using Vercel)
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify (if using Netlify)
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Test Production Build Locally
```bash
npm run build
npm run preview
# Visit http://localhost:4173
```

---

## 📊 PERFORMANCE COMMANDS

### Check Build Size
```bash
npm run build
# Check dist/ folder size

# Or get detailed breakdown:
npm install -g webpack-bundle-analyzer
# (Then configure in vite.config.js)
```

### Check Network Performance
```bash
# Open DevTools in browser (F12)
# Go to Network tab
# Reload page
# See load times for all assets
```

---

## 🔐 SECURITY COMMANDS

### Check for Vulnerabilities
```bash
npm audit
```

### Fix Security Issues
```bash
npm audit fix
npm audit fix --force    # Force updates, may break things
```

### Update All Dependencies
```bash
npm update
```

---

## 📱 TESTING COMMANDS (When Added)

### Run Unit Tests
```bash
npm test
```

### Watch Mode for Tests
```bash
npm test -- --watch
```

### Generate Coverage Report
```bash
npm test -- --coverage
```

---

## 💾 BACKUP COMMANDS

### Backup Project
```bash
# Create backup zip
zip -r project-backup.zip .

# Or use your OS tools
# Windows: Select folder → Send to → Compressed folder
# Mac: Right-click → Compress
```

### Restore from Backup
```bash
unzip project-backup.zip
cd project-folder
npm install
```

---

## 🎓 LEARNING COMMANDS

### Check Documentation
```bash
# View React docs
npm docs react

# View Vite docs  
npm docs vite

# View Zustand docs
npm docs zustand
```

---

## ⚡ QUICK SHORTCUTS

### Start Development (Fastest)
```bash
npm i && npm run dev
```

### Build and Deploy
```bash
npm run build && npm run preview
```

### Clean and Reinstall
```bash
rm -rf node_modules package-lock.json && npm i
```

---

## 💡 USEFUL ALIASES

Create aliases for faster commands:

### On Mac/Linux (add to ~/.bashrc or ~/.zshrc)
```bash
alias npmstart="npm run dev"
alias npmbuild="npm run build"
alias npmclean="rm -rf node_modules package-lock.json && npm i"
```

Then use:
```bash
npmstart    # Instead of npm run dev
npmbuild    # Instead of npm run build
npmclean    # Instead of full reinstall
```

### On Windows (PowerShell)
```powershell
Set-Alias npmstart "npm run dev"
Set-Alias npmbuild "npm run build"
```

---

## 🔗 USEFUL LINKS

- **NPM Docs**: https://docs.npmjs.com
- **Node Docs**: https://nodejs.org/docs
- **React Docs**: https://react.dev
- **Vite Docs**: https://vitejs.dev
- **Zustand Docs**: https://github.com/pmndrs/zustand

---

## 📋 CHEATSHEET

```
BASICS:
  npm install         Install dependencies
  npm run dev         Start dev server
  npm run build       Build for production

PACKAGES:
  npm list            Show all packages
  npm outdated        Show outdated packages
  npm update          Update all packages
  npm install pkg     Add new package

FILES:
  npm audit           Check security
  npm cache clean     Clear cache

DEPLOYMENT:
  npm run build       Create dist folder
  npm run preview     Preview production
```

---

**Last Updated**: April 2026  
**Version**: 1.0.0
