#!/usr/bin/env python3
"""
Simple script to run the AgriToken backend server
"""
import uvicorn
from main import app

if __name__ == "__main__":
    print("Starting AgriToken Backend Server...")
    print("Server will be available at: http://localhost:8000")
    print("API documentation at: http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
