# Login Test Credentials

Based on the current `signup_info.json` file, here are the test credentials you can use:

## Available Test Users:

### User 1: John Doe (Farmer)
- **Email:** john.doe@example.com
- **Password:** password
- **Role:** Farmer
- **Wallet Address:** PKAQUSHTREQMA7OVUYA5YU2LLEEE54OQMF2AQXPJAFKEPQUEXE7YNI26MQ

### User 2: Donald Duck (Farmer)
- **Email:** donald@gmail.com
- **Password:** donaldduck
- **Role:** Farmer
- **Wallet Address:** PKAQUSHTREQMA7OVUYA5YU2LLEEE54OQMF2AQXPJAFKEPQUEXE7YNI26MQ

## How to Test:

1. **Start the backend server:**
   ```bash
   cd backend/projects/backend
   python simple_server.py
   ```

2. **Start the frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Navigate to login page:**
   Go to `http://localhost:5173/login`

4. **Test with valid credentials:**
   - Use any of the email/password combinations above
   - You should be redirected to the farmer dashboard

5. **Test with invalid credentials:**
   - Try wrong email or password
   - You should see an error message

## Expected Behavior:

- ✅ **Valid credentials:** Login successful, redirect to appropriate dashboard
- ❌ **Invalid email:** "Invalid email or password" error
- ❌ **Invalid password:** "Invalid email or password" error
- ❌ **Empty fields:** "Please fill in all fields" error
- ❌ **Server not running:** "Network error" message

## Dashboard Routing:

- **Farmer users** → `/farmer` dashboard
- **Investor users** → `/investor` dashboard

## Demo Login Buttons:

The demo login buttons still work for testing purposes and will bypass the authentication system.
