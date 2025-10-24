# 🚀 RENDER DEPLOYMENT GUIDE

## **Cost: $7/month for 2 services (Backend + Frontend)**

### **Step 1: Create Backend Service**

1. **Go to:** https://render.com
2. **Click:** "New +" → "Web Service"
3. **Connect GitHub:** Select your `drug_trials` repository
4. **Configure Backend:**
   - **Name:** `drug-trials-backend`
   - **Environment:** `Node`
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
   - **Plan:** `Starter ($7/month)`

5. **Environment Variables:**
   ```
   NODE_ENV=production
   PORT=3001
   DATABASE_URL=postgresql://neondb_owner:npg_Bl9kug4wxKzN@ep-weathered-paper-a1mbh5zv-pooler.ap-southeast-1.aws.neon.tech/drug_trials?sslmode=require&channel_binding=require
   JWT_SECRET=0ec77252c0b6a5415b4acd7cc615b6e50c7941be36293b883ff74aceff1d0b1a737fe925f1ac3e5627398cdaacb64cb261dc5a79f75511fd4006f172c35d6ea9
   ```

6. **Click:** "Create Web Service"

### **Step 2: Create Frontend Service**

1. **Click:** "New +" → "Static Site"
2. **Connect GitHub:** Select your `drug_trials` repository
3. **Configure Frontend:**
   - **Name:** `drug-trials-frontend`
   - **Build Command:** `cd backend/frontend-react && npm install && npm run build`
   - **Publish Directory:** `backend/frontend-react/build`
   - **Plan:** `Free`

4. **Environment Variables:**
   ```
   REACT_APP_API_URL=https://drug-trials-backend.onrender.com/api
   REACT_APP_OPENAI_API_KEY=your_openai_key
   ```

5. **Click:** "Create Static Site"

### **Step 3: Update Backend API URL**

1. **Edit:** `backend/frontend-react/src/App.js`
2. **Change:** `const API_URL = 'http://localhost:3001/api';`
3. **To:** `const API_URL = 'https://drug-trials-backend.onrender.com/api';`

### **Step 4: Deploy**

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Add Smart Search and mobile support"
   git push origin main
   ```

2. **Render will auto-deploy both services**

### **Step 5: Test Your Live App**

- **Frontend:** `https://drug-trials-frontend.onrender.com`
- **Backend:** `https://drug-trials-backend.onrender.com/api`

## **✅ Features Now Available:**

### **3 Search Options:**
1. **🤖 AI Search Engine** - Real-time search PubMed, ClinicalTrials.gov, OpenAI
2. **🔍 Smart Search** - Search your saved trials instantly
3. **📝 Manual Entry** - Add trials manually

### **Mobile-Friendly:**
- ✅ **Responsive design** for all screen sizes
- ✅ **Touch-friendly buttons** for mobile
- ✅ **iOS zoom prevention** on input fields
- ✅ **24/7 availability** on Render

### **Cost Breakdown:**
- **Backend:** $7/month (Starter plan)
- **Frontend:** Free (Static site)
- **Database:** Free (Neon PostgreSQL)
- **Total:** $7/month for full production app

## **🎯 Your App Will Be Live At:**
- **URL:** `https://drug-trials-frontend.onrender.com`
- **Status:** 24/7/365 uptime
- **Mobile:** Fully responsive
- **Features:** All 3 search methods working
