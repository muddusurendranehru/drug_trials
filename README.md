# Clinical Drug Trials Application

A full-stack application for managing clinical drug trial data with Neon PostgreSQL database.

## Project Structure
```
clinical-drugs-app/
├── backend/
│   ├── server.js
│   ├── db.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── index.html
│   ├── signup.html
│   ├── login.html
│   ├── dashboard.html
│   ├── styles.css
│   └── app.js
└── README.md
```

## Database Schema
- **users**: User authentication and profile data
- **drug_trials**: Clinical trial records with 7 required fields

## Features
- User authentication (signup/login)
- Protected dashboard
- CRUD operations for drug trials
- UUID-based primary keys
- JWT token authentication

## Setup Instructions
1. Create Neon PostgreSQL database
2. Set up environment variables
3. Install backend dependencies
4. Start backend server
5. Open frontend in browser

