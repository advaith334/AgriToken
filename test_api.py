import requests
import json

# Test the API endpoints
try:
    # Test 1: Check if server is running
    print("Testing server health...")
    response = requests.get('http://localhost:8000/api/health')
    print(f"Health check: {response.status_code} - {response.json()}")
    
    # Test 2: Get all farms
    print("\nTesting get all farms...")
    response = requests.get('http://localhost:8000/api/farms')
    print(f"All farms: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"Number of farms: {len(data.get('farms', []))}")
        for farm in data.get('farms', []):
            print(f"  - {farm.get('Farm Name')} (Owner: {farm.get('Farmer Email')})")
    
    # Test 3: Get John Doe's farms
    print("\nTesting get John Doe's farms...")
    response = requests.get('http://localhost:8000/api/farms/john.doe@example.com')
    print(f"John Doe's farms: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"John Doe's farms: {json.dumps(data, indent=2)}")
    else:
        print(f"Error: {response.text}")
        
except requests.exceptions.ConnectionError:
    print("ERROR: Cannot connect to server. Make sure the backend server is running on http://localhost:8000")
except Exception as e:
    print(f"ERROR: {e}")
