# 🚀 BACKEND SETUP - PORT 3039

## ✅ **DATABASE READY**
- ✅ INTEGER primary keys working (1, 2, 3...)
- ✅ Sample data inserted
- ✅ Foreign key relationships established
- ✅ Ready for backend connection on port 3039

## 🔧 **BACKEND CONFIGURATION (PORT 3039)**

### **Step 1: Create Environment File**
Create `backend/.env` file with your database connection:

```env
DATABASE_URL=postgresql://neondb_owner:npg_Bl9kug4wxKzN@ep-weathered-paper-a1mbh5zv-pooler.ap-southeast-1.aws.neon.tech/drug_trials?sslmode=require&channel_binding=require
JWT_SECRET=clinical_drug_trials_integer_primary_keys_2024_secure_key
PORT=3039
NODE_ENV=development
```

### **Step 2: Install Dependencies**
```bash
cd backend
npm install
```

### **Step 3: Start Backend Server**
```bash
npm start
```

**Expected Output:**
```
✅ Connected to Neon PostgreSQL database
🚀 Server running on port 3039 with INTEGER primary keys
📊 Health check: http://localhost:3039/api/health
```

---

## 🧪 **TEST BACKEND CONNECTION (PORT 3039)**

### **Test 1: Health Check**
```bash
curl http://localhost:3039/api/health
```
**Expected Response:**
```json
{
  "status": "OK",
  "message": "Clinical Drug Trials API is running with INTEGER primary keys"
}
```

### **Test 2: Database Connection**
```bash
curl -X POST http://localhost:3039/api/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User","phone":"1234567890","password":"password123","confirmPassword":"password123"}'
```

**Expected Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "id": 3,
    "email": "test@example.com",
    "name": "Test User",
    "phone": "1234567890"
  }
}
```

### **Test 3: Login Test**
```bash
curl -X POST http://localhost:3039/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 3,
    "email": "test@example.com",
    "name": "Test User",
    "phone": "1234567890"
  }
}
```

---

## 🎯 **BACKEND SUCCESS CRITERIA (PORT 3039)**

### **✅ What You Should See:**
- Backend server starts on port 3039
- Database connection successful
- Health check working at `http://localhost:3039/api/health`
- Signup endpoint working (creates user with INTEGER ID)
- Login endpoint working (returns JWT token)
- All API endpoints responding correctly

### **✅ INTEGER Primary Keys Working:**
- New users get INTEGER IDs (3, 4, 5...)
- Foreign key relationships working
- No UUID confusion
- Simple INTEGER IDs throughout

---

## 🚀 **FRONTEND CONFIGURATION (PORT 3039)**

### **Frontend Files Updated:**
- ✅ `frontend/signup.html` - API_URL = `http://localhost:3039/api`
- ✅ `frontend/login.html` - API_URL = `http://localhost:3039/api`
- ✅ `frontend/dashboard.html` - API_URL = `http://localhost:3039/api`
- ✅ `frontend/app.js` - API_URL = `http://localhost:3039/api`

### **Test Frontend:**
1. **Start Backend**: `cd backend && npm start`
2. **Open Frontend**: Open `frontend/index.html` in browser
3. **Test Flow**: Sign up → Login → Dashboard → Add trial → View trials → Logout

---

## 📋 **PORT 3039 CHECKLIST**

- [ ] ✅ Environment file created (.env) with PORT=3039
- [ ] ✅ Dependencies installed (npm install)
- [ ] ✅ Backend server starts on port 3039
- [ ] ✅ Health check working at http://localhost:3039/api/health
- [ ] ✅ Database connection successful
- [ ] ✅ Signup endpoint working
- [ ] ✅ Login endpoint working
- [ ] ✅ INTEGER primary keys working
- [ ] ✅ All API endpoints responding
- [ ] ✅ Frontend updated for port 3039

**Only proceed to frontend after ALL backend tests pass on port 3039!**

---

## 🎯 **READY FOR PORT 3039 SETUP**

Your database is ready with INTEGER primary keys. Now let's set up the backend to run on port 3039 and test all the API endpoints.

**Next: Create the .env file and start the backend server on port 3039!** 🚀
