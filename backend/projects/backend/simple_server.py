from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import os
from datetime import datetime

app = FastAPI(title="AgriToken Backend API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

class SignupRequest(BaseModel):
    firstName: str
    lastName: str
    email: str
    password: str
    walletAddress: str
    role: str

class LoginRequest(BaseModel):
    email: str
    password: str

@app.get("/")
async def root():
    return {"message": "AgriToken Backend API is running"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "message": "API is running"}

@app.post("/api/signup")
async def signup(request: SignupRequest):
    try:
        # Path to the signup_info.json file
        signup_data_path = "../../../data/user_info/signup_info.json"
        
        # Load existing data
        if os.path.exists(signup_data_path):
            with open(signup_data_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
        else:
            os.makedirs(os.path.dirname(signup_data_path), exist_ok=True)
            data = {"users": []}
        
        # Check if email already exists
        existing_emails = [user.get("User Email", "") for user in data["users"]]
        if request.email in existing_emails:
            raise HTTPException(
                status_code=400, 
                detail="Email already exists. Please use a different email address."
            )
        
        # Create new user object
        current_time = datetime.now().strftime("%Y-%m-%d")
        new_user = {
            "User First Name": request.firstName,
            "User Last Name": request.lastName,
            "Wallet Address": request.walletAddress,
            "User Email": request.email,
            "User Password": request.password,
            "User Role": request.role,
            "User Status": "Active",
            "User Created At": current_time,
            "User Updated At": current_time
        }
        
        # Add new user to the list
        data["users"].append(new_user)
        
        # Save updated data
        with open(signup_data_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        return {
            "message": "User created successfully",
            "user": {
                "name": f"{request.firstName} {request.lastName}",
                "email": request.email,
                "role": request.role
            }
        }
            
    except HTTPException:
        raise
    except Exception as e:
        print(f"Unexpected error during signup: {e}")
        raise HTTPException(
            status_code=500, 
            detail="An unexpected error occurred. Please try again."
        )

@app.post("/api/login")
async def login(request: LoginRequest):
    try:
        # Path to the signup_info.json file
        signup_data_path = "../../../data/user_info/signup_info.json"
        
        # Load user data
        if not os.path.exists(signup_data_path):
            raise HTTPException(
                status_code=404, 
                detail="User database not found. Please contact support."
            )
        
        with open(signup_data_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Find user by email
        user = None
        for u in data["users"]:
            if u.get("User Email", "").lower() == request.email.lower():
                user = u
                break
        
        if not user:
            raise HTTPException(
                status_code=401, 
                detail="Invalid email or password."
            )
        
        # Check password
        if user.get("User Password", "") != request.password:
            raise HTTPException(
                status_code=401, 
                detail="Invalid email or password."
            )
        
        # Check if user is active
        if user.get("User Status", "") != "Active":
            raise HTTPException(
                status_code=403, 
                detail="Account is inactive. Please contact support."
            )
        
        # Return user data (without password)
        return {
            "message": "Login successful",
            "user": {
                "id": f"user_{user.get('User Email', '').replace('@', '_').replace('.', '_')}",
                "name": f"{user.get('User First Name', '')} {user.get('User Last Name', '')}",
                "email": user.get("User Email", ""),
                "role": user.get("User Role", "").lower(),
                "walletAddress": user.get("Wallet Address", ""),
                "connectedWallet": True,
                "status": user.get("User Status", ""),
                "createdAt": user.get("User Created At", ""),
                "updatedAt": user.get("User Updated At", "")
            }
        }
            
    except HTTPException:
        raise
    except Exception as e:
        print(f"Unexpected error during login: {e}")
        raise HTTPException(
            status_code=500, 
            detail="An unexpected error occurred. Please try again."
        )

if __name__ == "__main__":
    import uvicorn
    print("Starting AgriToken Backend Server...")
    print("Server will be available at: http://localhost:8000")
    print("API documentation at: http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000)
