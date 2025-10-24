# 🔧 POWERSHELL STEP-BY-STEP FIX

## ❌ **COMMON POWERSHELL ERRORS & SOLUTIONS**

### **Error 1: Execution Policy**
```
Execution of scripts is disabled on this system
```

**Solution:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### **Error 2: Node/NPM Not Found**
```
'node' is not recognized as an internal or external command
```

**Solution:**
```powershell
# Check if Node.js is installed
node --version
npm --version

# If not installed, download from https://nodejs.org
```

### **Error 3: Path Issues**
```
Cannot find module
```

**Solution:**
```powershell
# Navigate to correct directory
cd C:\Users\pc\drug_trials\backend

# Check if you're in the right directory
dir
```

---

## 🚀 **STEP-BY-STEP SOLUTION**

### **Step 1: Fix PowerShell Execution Policy**
```powershell
# Open PowerShell as Administrator
# Run this command:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Type 'Y' when prompted
```

### **Step 2: Check Node.js Installation**
```powershell
# Check if Node.js is installed
node --version
npm --version

# If not installed:
# 1. Go to https://nodejs.org
# 2. Download and install Node.js
# 3. Restart PowerShell
```

### **Step 3: Navigate to Backend Directory**
```powershell
# Navigate to your project
cd C:\Users\pc\drug_trials\backend

# Verify you're in the right directory
dir

# You should see: package.json, server-integer.js, etc.
```

### **Step 4: Create .env File**
```powershell
# Create .env file
New-Item -Path ".env" -ItemType File

# Edit the file (use Notepad)
notepad .env
```

**Add this content to .env:**
```env
DATABASE_URL=postgresql://neondb_owner:npg_Bl9kug4wxKzN@ep-weathered-paper-a1mbh5zv-pooler.ap-southeast-1.aws.neon.tech/drug_trials?sslmode=require&channel_binding=require
JWT_SECRET=clinical_drug_trials_integer_primary_keys_2024_secure_key
PORT=3039
NODE_ENV=development
```

### **Step 5: Install Dependencies**
```powershell
# Install npm packages
npm install

# If you get errors, try:
npm install --force
```

### **Step 6: Start Backend Server**
```powershell
# Start the server
npm start

# Alternative if npm start doesn't work:
node server-integer.js
```

---

## 🧪 **TEST BACKEND**

### **Step 7: Test Health Check**
```powershell
# Open new PowerShell window
# Test health endpoint
curl http://localhost:3039/api/health

# Expected response:
# {"status":"OK","message":"Clinical Drug Trials API is running"}
```

### **Step 8: Test Signup**
```powershell
# Test signup endpoint
curl -X POST http://localhost:3039/api/signup -H "Content-Type: application/json" -d '{"email":"test@example.com","name":"Test User","phone":"1234567890","password":"password123","confirmPassword":"password123"}'
```

---

## 🎯 **FRONTEND TESTING**

### **Step 9: Open Frontend**
```powershell
# Navigate to frontend directory
cd C:\Users\pc\drug_trials\frontend

# Open index.html in browser
start index.html

# Or manually open: C:\Users\pc\drug_trials\frontend\index.html
```

### **Step 10: Test Complete Flow**
1. **Sign Up**: Create new account
2. **Login**: Sign in with credentials
3. **Dashboard**: Add drug trial
4. **View Trials**: See your trials
5. **Logout**: Test logout

---

## 🔧 **TROUBLESHOOTING**

### **If Backend Won't Start:**
```powershell
# Check if port 3039 is available
netstat -an | findstr 3039

# If port is busy, kill the process
taskkill /f /im node.exe
```

### **If Dependencies Won't Install:**
```powershell
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# Reinstall
npm install
```

### **If Frontend Won't Connect:**
```powershell
# Check if backend is running
curl http://localhost:3039/api/health

# If not running, start backend first
cd C:\Users\pc\drug_trials\backend
npm start
```

---

## 📋 **COMPLETE CHECKLIST**

- [ ] ✅ PowerShell execution policy fixed
- [ ] ✅ Node.js installed and working
- [ ] ✅ Backend directory navigated
- [ ] ✅ .env file created with correct database URL
- [ ] ✅ Dependencies installed (npm install)
- [ ] ✅ Backend server started (npm start)
- [ ] ✅ Health check working (curl test)
- [ ] ✅ Frontend opened in browser
- [ ] ✅ Complete flow tested (signup → login → dashboard)

**Follow these steps exactly to fix all PowerShell errors!** 🚀
