# AgriToken Signup System

This document explains how to set up and run the signup functionality for AgriToken.

## Overview

The signup system consists of:
- **Frontend**: React signup form at `http://localhost:8080/signup`
- **Backend**: FastAPI server that saves user data to `signup_info.json`
- **Data Storage**: User information is stored in `data/user_info/signup_info.json`

## Setup Instructions

### 1. Backend Setup

Navigate to the backend directory:
```bash
cd backend/projects/backend
```

Install dependencies (if not already installed):

**Option 1: Using Poetry (recommended)**
```bash
poetry install
```

**Option 2: Using pip (if Poetry is not available)**
```bash
pip install fastapi uvicorn
```

Run the backend server:
```bash
python run_server.py
```

The server will start on `http://localhost:8080`

### 2. Frontend Setup

Navigate to the frontend directory:
```bash
cd frontend
```

Install dependencies (if not already installed):
```bash
npm install
```

Run the frontend development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:5173` (or another port if 5173 is busy)

## Usage

1. Open your browser and go to `http://localhost:8080/signup`
2. Fill out the signup form with:
   - First Name
   - Last Name
   - Email
   - Pera Wallet Address
   - Password
   - Confirm Password
   - Role (Farmer or Investor)
3. Click "Create Account"
4. The user data will be saved to `data/user_info/signup_info.json`

## API Endpoints

- `POST /api/signup` - Create a new user account
- `GET /api/users` - Get all registered users
- `GET /api/health` - Health check endpoint

## Data Format

User data is stored in the following format in `signup_info.json`:

```json
{
  "users": [
    {
      "User First Name": "John",
      "User Last Name": "Doe",
      "Wallet Address": "PKAQUSHTREQMA7OVUYA5YU2LLEEE54OQMF2AQXPJAFKEPQUEXE7YNI26MQ",
      "User Email": "john.doe@example.com",
      "User Password": "password",
      "User Role": "Farmer",
      "User Status": "Active",
      "User Created At": "2024-01-01",
      "User Updated At": "2024-01-01"
    }
  ]
}
```

## Features

- ✅ Form validation (required fields, password confirmation)
- ✅ Email uniqueness check
- ✅ Real-time password matching validation
- ✅ Role selection (Farmer/Investor)
- ✅ Error handling and user feedback
- ✅ Data persistence to JSON file
- ✅ CORS enabled for frontend-backend communication

## Troubleshooting

1. **Backend not starting**: Make sure port 8080 is not in use
2. **Frontend not connecting**: Check that the backend is running on port 8080
3. **Data not saving**: Check file permissions for the `data/user_info/` directory
4. **CORS errors**: Ensure the backend is running and accessible from the frontend URL
