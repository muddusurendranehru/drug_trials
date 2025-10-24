# Clinical Drug Trials Application Setup Guide

## Prerequisites
- Node.js (v16 or higher)
- Neon PostgreSQL account
- Git

## Step 1: Database Setup (Neon PostgreSQL)

1. Go to [neon.tech](https://neon.tech) and sign up
2. Create a new project named "heart"
3. Copy your connection string (looks like: `postgresql://user:password@host/database`)
4. Save it for the next step

## Step 2: Database Schema

1. Go to your Neon dashboard → SQL Editor
2. Run the SQL commands from `database_schema.sql`:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table 1: users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Table 2: drug_trials
CREATE TABLE drug_trials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    trial_acronym VARCHAR(100) NOT NULL,
    trial_full_name TEXT NOT NULL,
    drug_name VARCHAR(255) NOT NULL,
    result TEXT NOT NULL,
    brief_abstract TEXT,
    image_prompt TEXT,
    reference_article TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_drug_trials_user_id ON drug_trials(user_id);
CREATE INDEX idx_drug_trials_created_at ON drug_trials(created_at);
```

## Step 3: Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in the backend directory:
```env
DATABASE_URL=your_neon_connection_string_here
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
PORT=3000
NODE_ENV=development
```

4. Start the backend server:
```bash
npm start
```

The server should start on `http://localhost:3000`

## Step 4: Test Backend

Test the API endpoints:

```bash
# Health check
curl http://localhost:3000/api/health

# Test signup
curl -X POST http://localhost:3000/api/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User","phone":"1234567890","password":"password123","confirmPassword":"password123"}'
```

## Step 5: Frontend Setup

1. Open `frontend/index.html` in your browser
2. Or use a local server (Live Server extension in VS Code/Cursor)

## Step 6: Test Complete Application

1. **Sign Up**: Create a new account
2. **Login**: Sign in with your credentials
3. **Dashboard**: Add a drug trial with all 7 fields:
   - Trial Acronym
   - Full Trial Name
   - Drug Name
   - Result
   - Brief Abstract
   - Image Prompt
   - Reference Article URL
4. **View Trials**: See your trials listed
5. **Logout**: Test logout functionality

## Troubleshooting

### Database Connection Issues
- Verify your Neon connection string
- Check if your Neon project is active
- Ensure SSL is enabled

### Backend Issues
- Check if all dependencies are installed
- Verify `.env` file exists and has correct values
- Check console for error messages

### Frontend Issues
- Ensure backend is running on port 3000
- Check browser console for errors
- Verify API endpoints are accessible

## Project Structure
```
clinical-drugs-app/
├── backend/
│   ├── server.js          # Main server file
│   ├── db.js             # Database connection
│   ├── package.json      # Dependencies
│   └── .env              # Environment variables
├── frontend/
│   ├── index.html        # Home page
│   ├── signup.html       # Sign up page
│   ├── login.html        # Login page
│   ├── dashboard.html    # Main dashboard
│   ├── styles.css        # Styling
│   └── app.js           # JavaScript utilities
├── database_schema.sql   # Database setup
└── README.md            # This file
```

## Features Implemented

✅ **Database**: Neon PostgreSQL with UUID primary keys
✅ **Authentication**: JWT-based with signup/login
✅ **Backend**: Node.js/Express with all CRUD operations
✅ **Frontend**: HTML/CSS/JS with responsive design
✅ **Security**: Password hashing, token validation
✅ **User Experience**: Clean UI with error handling

## Next Steps

- Add email verification
- Implement trial editing
- Add search/filter functionality
- Integrate with image generation APIs
- Add data export features

