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

class PayoutRequest(BaseModel):
    farm_id: str
    payout_amount: float
    payout_date: str
    description: str

class CreateFarmRequest(BaseModel):
    "Farm ID": str
    "Farm Name": str
    "Farm Website": str
    "Farm Email": str
    "Farm Phone": str
    "Farmer Name": str
    "Farmer Email": str
    "Wallet Address": str
    "Farm Size (Acres)": int
    "Crop Type": str
    "Farm Location": str
    "Number of Tokens": int
    "Tokens Sold": int
    "Tokens Available": int
    "Token Name": str
    "Token Unit": str
    "Price per Token (USD)": float
    "ASA ID": str
    "Est. APY": float
    "Expected Yield /unit": int
    "Harvest Date": str
    "Payout Method": str
    "Insurance Enabled": bool
    "Insurance Type": str
    "Verification Method": str
    "Farm Images": list
    "Historical Yield": list
    "Local Currency": str
    "Farm Status": str
    "Created At": str
    "Last Updated": str

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

@app.get("/api/farms")
async def get_farms():
    try:
        # Path to the farm data file
        farm_data_path = "../../../data/farm_info/langs_farm.json"
        
        if not os.path.exists(farm_data_path):
            raise HTTPException(
                status_code=404, 
                detail="Farm data not found."
            )
        
        with open(farm_data_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        return data
            
    except HTTPException:
        raise
    except Exception as e:
        print(f"Unexpected error getting farms: {e}")
        raise HTTPException(
            status_code=500, 
            detail="An unexpected error occurred. Please try again."
        )

@app.get("/api/farms/{farmer_email}")
async def get_farmer_farms(farmer_email: str):
    try:
        # Path to the farm data file
        farm_data_path = "../../../data/farm_info/langs_farm.json"
        
        if not os.path.exists(farm_data_path):
            raise HTTPException(
                status_code=404, 
                detail="Farm data not found."
            )
        
        with open(farm_data_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Filter farms by farmer email
        farmer_farms = [farm for farm in data["farms"] if farm.get("Farmer Email", "").lower() == farmer_email.lower()]
        
        return {"farms": farmer_farms}
            
    except HTTPException:
        raise
    except Exception as e:
        print(f"Unexpected error getting farmer farms: {e}")
        raise HTTPException(
            status_code=500, 
            detail="An unexpected error occurred. Please try again."
        )

@app.get("/api/investor-holdings/{investor_email}")
async def get_investor_holdings(investor_email: str):
    try:
        # Path to the investor holdings file
        holdings_path = "../../../data/investor_holdings.json"
        
        if not os.path.exists(holdings_path):
            raise HTTPException(
                status_code=404, 
                detail="Investor holdings data not found."
            )
        
        with open(holdings_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Filter holdings by investor email
        investor_holdings = [holding for holding in data["holdings"] if holding.get("Investor Email", "").lower() == investor_email.lower()]
        
        return {"holdings": investor_holdings}
            
    except HTTPException:
        raise
    except Exception as e:
        print(f"Unexpected error getting investor holdings: {e}")
        raise HTTPException(
            status_code=500, 
            detail="An unexpected error occurred. Please try again."
        )

@app.post("/api/simulate-payout")
async def simulate_payout(request: PayoutRequest):
    try:
        # Paths to data files
        farm_data_path = "../../../data/farm_info/langs_farm.json"
        holdings_path = "../../../data/investor_holdings.json"
        
        # Load farm data
        if not os.path.exists(farm_data_path):
            raise HTTPException(
                status_code=404, 
                detail="Farm data not found."
            )
        
        with open(farm_data_path, 'r', encoding='utf-8') as f:
            farm_data = json.load(f)
        
        # Find the farm
        farm = None
        for f in farm_data["farms"]:
            if f.get("Farm ID") == request.farm_id:
                farm = f
                break
        
        if not farm:
            raise HTTPException(
                status_code=404, 
                detail="Farm not found."
            )
        
        # Load investor holdings
        if not os.path.exists(holdings_path):
            raise HTTPException(
                status_code=404, 
                detail="Investor holdings data not found."
            )
        
        with open(holdings_path, 'r', encoding='utf-8') as f:
            holdings_data = json.load(f)
        
        # Get all investors for this farm
        farm_holdings = [holding for holding in holdings_data["holdings"] if holding.get("Farm ID") == request.farm_id]
        
        if not farm_holdings:
            raise HTTPException(
                status_code=404, 
                detail="No investors found for this farm."
            )
        
        # Calculate total tokens for this farm
        total_tokens = sum(holding.get("Tokens Owned", 0) for holding in farm_holdings)
        
        if total_tokens == 0:
            raise HTTPException(
                status_code=400, 
                detail="No tokens to distribute."
            )
        
        # Calculate payout per token
        payout_per_token = request.payout_amount / total_tokens
        
        # Calculate individual payouts
        payout_details = []
        for holding in farm_holdings:
            tokens_owned = holding.get("Tokens Owned", 0)
            individual_payout = tokens_owned * payout_per_token
            
            payout_details.append({
                "investor_email": holding.get("Investor Email"),
                "investor_name": holding.get("Investor Name"),
                "tokens_owned": tokens_owned,
                "payout_amount": round(individual_payout, 2),
                "payout_per_token": round(payout_per_token, 4)
            })
        
        return {
            "message": "Payout simulation completed",
            "farm_name": farm.get("Farm Name"),
            "total_payout": request.payout_amount,
            "total_tokens": total_tokens,
            "payout_per_token": round(payout_per_token, 4),
            "payout_date": request.payout_date,
            "description": request.description,
            "payout_details": payout_details
        }
            
    except HTTPException:
        raise
    except Exception as e:
        print(f"Unexpected error simulating payout: {e}")
        raise HTTPException(
            status_code=500, 
            detail="An unexpected error occurred. Please try again."
        )

@app.post("/api/farms")
async def create_farm(farm_data: dict):
    try:
        # Path to the farm data file
        farm_data_path = "../../../data/farm_info/langs_farm.json"
        
        # Load existing farm data
        if os.path.exists(farm_data_path):
            with open(farm_data_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
        else:
            os.makedirs(os.path.dirname(farm_data_path), exist_ok=True)
            data = {"farms": []}
        
        # Check if farm ID already exists
        existing_farm_ids = [farm.get("Farm ID", "") for farm in data["farms"]]
        if farm_data.get("Farm ID") in existing_farm_ids:
            raise HTTPException(
                status_code=400, 
                detail="Farm ID already exists. Please try again."
            )
        
        # Add new farm to the list
        data["farms"].append(farm_data)
        
        # Save updated data
        with open(farm_data_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        return {
            "message": "Farm created successfully",
            "farm": {
                "id": farm_data.get("Farm ID"),
                "name": farm_data.get("Farm Name"),
                "farmer": farm_data.get("Farmer Name"),
                "location": farm_data.get("Farm Location"),
                "crop": farm_data.get("Crop Type")
            }
        }
            
    except HTTPException:
        raise
    except Exception as e:
        print(f"Unexpected error creating farm: {e}")
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
