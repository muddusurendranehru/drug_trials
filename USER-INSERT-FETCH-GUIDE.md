# 📊 USER INSERT & FETCH GUIDE

## ✅ **YES! Users Can INSERT and FETCH Data**

### **Following Your Rules:**
- ✅ **Dashboard customer/staff anyone must insert fetch**
- ✅ **Tables are the important**
- ✅ **Tables names, headings, content, schema must be seen**

## 🎯 **WHAT USERS CAN DO**

### **INSERT Data:**
1. **Sign Up** → Creates new user in `users` table
2. **Add Drug Trial** → Creates new trial in `drug_trials` table
3. **All data gets INTEGER IDs** (1, 2, 3, 4, 5...)

### **FETCH Data:**
1. **Login** → Fetches user data from `users` table
2. **View Trials** → Fetches all trials from `drug_trials` table
3. **Dashboard** → Shows all user's trials with INTEGER IDs

## 🗄️ **INSERT OPERATIONS**

### **1. User Sign Up (INSERT into users table)**
```sql
INSERT INTO users (email, name, phone, password_hash) 
VALUES ('newuser@example.com', 'New User', '1234567890', 'hashed_password')
-- Gets INTEGER ID: 3, 4, 5, 6...
```

### **2. Add Drug Trial (INSERT into drug_trials table)**
```sql
INSERT INTO drug_trials (user_id, trial_acronym, trial_full_name, drug_name, result, brief_abstract, image_prompt, reference_article)
VALUES (3, 'NEW_TRIAL', 'New Clinical Trial', 'New Drug', 'Positive results', 'Trial summary', 'Image prompt', 'https://example.com')
-- Gets INTEGER ID: 3, 4, 5, 6...
```

## 📋 **FETCH OPERATIONS**

### **1. User Login (FETCH from users table)**
```sql
SELECT id, email, name, phone FROM users WHERE email = 'user@example.com'
-- Returns: INTEGER ID, email, name, phone
```

### **2. View All Trials (FETCH from drug_trials table)**
```sql
SELECT * FROM drug_trials WHERE user_id = 3 ORDER BY created_at DESC
-- Returns: All trials for user with INTEGER IDs
```

### **3. View Single Trial (FETCH specific trial)**
```sql
SELECT * FROM drug_trials WHERE id = 5 AND user_id = 3
-- Returns: Specific trial with INTEGER ID
```

## 🎯 **FRONTEND INSERT & FETCH**

### **INSERT Operations:**
1. **Sign Up Form** → Inserts new user
2. **Add Trial Form** → Inserts new drug trial
3. **All forms** → Create data with INTEGER IDs

### **FETCH Operations:**
1. **Login** → Fetches user profile
2. **Dashboard** → Fetches all user's trials
3. **Trial Details** → Fetches specific trial
4. **All displays** → Show INTEGER IDs (1, 2, 3...)

## 🚀 **TEST INSERT & FETCH**

### **Step 1: Test INSERT**
1. **Open Frontend**: `frontend/index.html`
2. **Sign Up**: Create new account
3. **Add Trial**: Add new drug trial
4. **Check**: Data inserted with INTEGER IDs

### **Step 2: Test FETCH**
1. **Login**: Sign in with credentials
2. **Dashboard**: View all your trials
3. **Check**: Data fetched and displayed with INTEGER IDs

## 📊 **WHAT USERS SEE**

### **INSERT Success:**
- ✅ **User created** with INTEGER ID (3, 4, 5...)
- ✅ **Trial added** with INTEGER ID (3, 4, 5...)
- ✅ **Success messages** displayed

### **FETCH Success:**
- ✅ **User profile** displayed with INTEGER ID
- ✅ **All trials** listed with INTEGER IDs
- ✅ **Trial details** shown with INTEGER IDs

## 🎯 **INTEGER IDs EVERYWHERE**

### **Users Table:**
```
ID | Email | Name | Phone
1  | lakshmi@galla.com | Lakshmi Galla | +91-9961234567
2  | test@example.com | Test User | 1234567890
3  | newuser@example.com | New User | 1234567890  ← NEW USER
```

### **Drug Trials Table:**
```
ID | User ID | Trial Acronym | Drug Name | Result
1  | 1 | RECOVERY | Dexamethasone | Reduced mortality by 35%
2  | 2 | TEST | Test Drug | Positive results
3  | 3 | NEW_TRIAL | New Drug | Positive results  ← NEW TRIAL
```

## 🎉 **PERFECT!**

Your application supports:
- ✅ **INSERT**: Users can add new data
- ✅ **FETCH**: Users can view all data
- ✅ **INTEGER IDs**: Simple 1, 2, 3, 4, 5...
- ✅ **No UUID confusion**: Easy to understand
- ✅ **Universal support**: All naming conventions work

**Users can INSERT and FETCH data with INTEGER IDs!** 🚀
