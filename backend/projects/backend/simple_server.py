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

if __name__ == "__main__":
    import uvicorn
    print("Starting AgriToken Backend Server...")
    print("Server will be available at: http://localhost:8000")
    print("API documentation at: http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000)
