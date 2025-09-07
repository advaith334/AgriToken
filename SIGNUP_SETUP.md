# AgriToken Signup Setup Guide

## Overview
The AgriToken application now includes a complete signup system that stores user information in the `data/user_info/signup_info.json` file.

## Features
- **User Registration Form**: Complete signup form with all required fields
- **Data Validation**: Email format validation, password length requirements, and password confirmation
- **Backend Integration**: Uses FastAPI backend to save data to JSON file
- **Error Handling**: Comprehensive error messages and user feedback
- **Responsive Design**: Works on desktop and mobile devices

## Form Fields
The signup form includes the following fields:
- **Role Selection**: Choose between "Farmer" or "Investor"
- **First Name**: User's first name
- **Last Name**: User's last name
- **Email**: Valid email address (with format validation)
- **Pera Wallet Address**: Algorand wallet public address
- **Password**: Minimum 6 characters
- **Confirm Password**: Must match the password

## Data Storage
User data is stored in `data/user_info/signup_info.json` with the following structure:
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
      "User Created At": "2021-01-01",
      "User Updated At": "2021-01-01"
    }
  ]
}
```

## Setup Instructions

### 1. Start the Backend Server
```bash
cd backend/projects/backend
python simple_server.py
```
The server will start on `http://localhost:8000`

### 2. Start the Frontend
```bash
cd frontend
npm run dev
```
The frontend will start on `http://localhost:5173`

### 3. Access the Signup Page
Navigate to `http://localhost:5173/signup` to access the signup form.

## How It Works

1. **User fills out the signup form** with all required information
2. **Frontend validates** the form data (email format, password length, etc.)
3. **Form submission** sends data to the backend API at `http://localhost:8000/api/signup`
4. **Backend processes** the request and saves data to `signup_info.json`
5. **Success response** redirects user to the login page
6. **Error handling** displays appropriate error messages if something goes wrong

## API Endpoints

### POST /api/signup
Creates a new user account and saves data to the JSON file.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "walletAddress": "PKAQUSHTREQMA7OVUYA5YU2LLEEE54OQMF2AQXPJAFKEPQUEXE7YNI26MQ",
  "role": "Farmer"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "Farmer"
  }
}
```

## Error Handling
- **Email already exists**: Prevents duplicate email addresses
- **Invalid email format**: Real-time validation with visual feedback
- **Password mismatch**: Confirms password matches
- **Network errors**: Handles backend connection issues
- **Server errors**: Displays appropriate error messages

## Security Notes
- Passwords are currently stored in plain text (for demo purposes)
- In production, implement proper password hashing
- Add rate limiting for signup attempts
- Implement email verification

## Testing
1. Start both frontend and backend servers
2. Navigate to the signup page
3. Fill out the form with test data
4. Submit the form
5. Check the `signup_info.json` file to verify data was saved
6. Try signing up with the same email to test duplicate prevention
