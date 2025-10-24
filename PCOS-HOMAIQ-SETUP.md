# 🚀 PCOS HOMAIQ SCORE DATABASE SETUP

## ✅ **YOUR DATABASE CONFIGURATION**

### **Database Details:**
- **Database Name**: `pcos_homaiq_score`
- **Connection String**: `postgresql://neondb_owner:npg_Bl9kug4wxKzN@ep-weathered-paper-a1mbh5zv-pooler.ap-southeast-1.aws.neon.tech/pcos_homaiq_score?sslmode=require&channel_binding=require`
- **Port**: 3039
- **JWT Secret**: `clinical_drug_trials_pcos_homaiq_score_2024_secure_jwt_secret_key_xyz789abc`

## 🔧 **BACKEND SETUP STEPS**

### **Step 1: Create .env File**
Create `backend/.env` file with this content:

```env
DATABASE_URL=postgresql://neondb_owner:npg_Bl9kug4wxKzN@ep-weathered-paper-a1mbh5zv-pooler.ap-southeast-1.aws.neon.tech/pcos_homaiq_score?sslmode=require&channel_binding=require
JWT_SECRET=clinical_drug_trials_pcos_homaiq_score_2024_secure_jwt_secret_key_xyz789abc
PORT=3039
NODE_ENV=development
FRONTEND_URL=http://localhost:3039
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

## 🧪 **TEST BACKEND CONNECTION**

### **Test 1: Health Check**
```bash
curl http://localhost:3039/api/health
```

### **Test 2: Database Connection**
```bash
curl -X POST http://localhost:3039/api/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User","phone":"1234567890","password":"password123","confirmPassword":"password123"}'
```

---

## 🎯 **DATABASE SETUP FOR PCOS HOMAIQ SCORE**

### **Step 1: Go to Neon Console**
- **URL**: [https://console.neon.tech/app/projects/autumn-darkness-64907462/branches/br-sweet-scene-a1jwwdse/tables?database=pcos_homaiq_score](https://console.neon.tech/app/projects/autumn-darkness-64907462/branches/br-sweet-scene-a1jwwdse/tables?database=pcos_homaiq_score)

### **Step 2: Run Database Setup**
Copy and paste the content from `database-reset-integer.sql` in your Neon SQL Editor to create the tables.

### **Step 3: Verify Tables**
You should see:
- ✅ **users** table with INTEGER primary keys
- ✅ **drug_trials** table with INTEGER primary keys
- ✅ Sample data inserted

---

## 🚀 **FRONTEND SETUP**

### **Frontend Files Updated:**
- ✅ `frontend/signup.html` - API_URL = `http://localhost:3039/api`
- ✅ `frontend/login.html` - API_URL = `http://localhost:3039/api`
- ✅ `frontend/dashboard.html` - API_URL = `http://localhost:3039/api`
- ✅ `frontend/app.js` - API_URL = `http://localhost:3039/api`

### **Test Complete Application:**
1. **Start Backend**: `cd backend && npm start`
2. **Open Frontend**: Open `frontend/index.html` in browser
3. **Test Flow**: Sign up → Login → Dashboard → Add trial → View trials → Logout

---

## 📋 **PCOS HOMAIQ SCORE CHECKLIST**

- [ ] ✅ Environment file created (.env) with your database URL
- [ ] ✅ JWT secret configured
- [ ] ✅ Dependencies installed (npm install)
- [ ] ✅ Backend server starts on port 3039
- [ ] ✅ Health check working at http://localhost:3039/api/health
- [ ] ✅ Database connection successful
- [ ] ✅ Signup endpoint working
- [ ] ✅ Login endpoint working
- [ ] ✅ INTEGER primary keys working
- [ ] ✅ All API endpoints responding
- [ ] ✅ Frontend updated for port 3039

**Ready to start with your PCOS HOMAIQ SCORE database!** 🚀
