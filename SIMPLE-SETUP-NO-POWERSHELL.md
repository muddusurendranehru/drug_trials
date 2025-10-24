# 🚀 SIMPLE SETUP - NO POWERSHELL NEEDED

## 🎯 **DIRECT APPROACH - USE VS CODE TERMINAL**

### **Step 1: Open VS Code Terminal**
1. **Open VS Code**
2. **Open your project folder**: `C:\Users\pc\drug_trials`
3. **Open Terminal**: `Ctrl + `` (backtick) or `View > Terminal`

### **Step 2: Create .env File in VS Code**
1. **Right-click in backend folder**
2. **New File** → Name it `.env`
3. **Add this content:**
```
DATABASE_URL=postgresql://neondb_owner:npg_Bl9kug4wxKzN@ep-weathered-paper-a1mbh5zv-pooler.ap-southeast-1.aws.neon.tech/drug_trials?sslmode=require&channel_binding=require
JWT_SECRET=clinical_drug_trials_integer_primary_keys_2024_secure_key
PORT=3039
NODE_ENV=development
```

### **Step 3: Install Dependencies in VS Code Terminal**
```bash
cd backend
npm install
```

### **Step 4: Start Server in VS Code Terminal**
```bash
npm start
```

---

## 🎯 **ALTERNATIVE: USE COMMAND PROMPT (NOT POWERSHELL)**

### **Step 1: Open Command Prompt**
1. **Press `Windows + R`**
2. **Type `cmd`**
3. **Press Enter**

### **Step 2: Navigate to Project**
```cmd
cd C:\Users\pc\drug_trials\backend
```

### **Step 3: Install Dependencies**
```cmd
npm install
```

### **Step 4: Start Server**
```cmd
npm start
```

---

## 🎯 **ALTERNATIVE: USE FILE EXPLORER**

### **Step 1: Open File Explorer**
1. **Navigate to**: `C:\Users\pc\drug_trials\backend`
2. **Right-click** in empty space
3. **Open in Terminal** (if available)

### **Step 2: Create .env File**
1. **Right-click** → **New** → **Text Document**
2. **Rename** to `.env` (remove .txt extension)
3. **Open with Notepad** and add the content above

---

## 🎯 **ALTERNATIVE: USE GIT BASH**

### **Step 1: Open Git Bash**
1. **Right-click** in project folder
2. **Git Bash Here** (if Git is installed)

### **Step 2: Run Commands**
```bash
cd backend
npm install
npm start
```

---

## 🎯 **ALTERNATIVE: USE NODE.JS DIRECTLY**

### **Step 1: Open File Explorer**
1. **Navigate to**: `C:\Users\pc\drug_trials\backend`
2. **Double-click** `server-integer.js`

### **Step 2: If Node.js is installed**
- File should open in Node.js
- Check if server starts

---

## 🎯 **ALTERNATIVE: USE BROWSER ONLY**

### **Step 1: Open Frontend Directly**
1. **Navigate to**: `C:\Users\pc\drug_trials\frontend`
2. **Double-click** `index.html`
3. **Open in browser**

### **Step 2: Test Frontend**
- Try to sign up
- See if you get connection errors
- This will tell us if backend is needed

---

## 🎯 **WHAT TO DO NEXT**

### **Option 1: Try VS Code Terminal**
- Open VS Code
- Open Terminal
- Run the commands

### **Option 2: Try Command Prompt**
- Open Command Prompt (not PowerShell)
- Navigate to backend folder
- Run npm commands

### **Option 3: Try File Explorer**
- Navigate to backend folder
- Double-click server-integer.js
- See what happens

### **Option 4: Try Frontend First**
- Open frontend/index.html in browser
- See if it works without backend

---

## 🎯 **TELL ME WHAT HAPPENS**

**Try one of these approaches and tell me:**
1. **Which method you tried**
2. **What happened** (success/error)
3. **Any error messages you see**

**I'll help you based on what actually happens!** 🚀
