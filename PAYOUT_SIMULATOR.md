# Dividend Payout Simulator

## Overview
This system allows you to simulate dividend payouts to investors based on their token holdings in specific farms.

## Current Setup

### John Doe's Farm
- **Farm Name:** Green Valley Maize
- **Farm ID:** farm_001
- **Farmer:** John Doe (john.doe@example.com)
- **Total Tokens:** 10,000
- **Tokens Sold:** 6,250
- **Price per Token:** $12.5
- **Est. APY:** 12.5%

### Current Investors in Green Valley Maize

1. **Donald Duck** (donald@gmail.com)
   - Tokens Owned: 1,000
   - Cost Basis: $12,500
   - Percentage of Farm: 16%

2. **Sarah Chen** (sarah.chen@email.com)
   - Tokens Owned: 500
   - Cost Basis: $6,250
   - Percentage of Farm: 8%

**Total Invested Tokens:** 1,500 out of 6,250 sold

## How to Simulate a Payout

### Method 1: Using API Endpoint

**Endpoint:** `POST http://localhost:8000/api/simulate-payout`

**Request Body:**
```json
{
  "farm_id": "farm_001",
  "payout_amount": 1000,
  "payout_date": "2024-09-30",
  "description": "Q3 2024 Harvest Dividend"
}
```

**Example Response:**
```json
{
  "message": "Payout simulation completed",
  "farm_name": "Green Valley Maize",
  "total_payout": 1000,
  "total_tokens": 1500,
  "payout_per_token": 0.6667,
  "payout_date": "2024-09-30",
  "description": "Q3 2024 Harvest Dividend",
  "payout_details": [
    {
      "investor_email": "donald@gmail.com",
      "investor_name": "Donald Duck",
      "tokens_owned": 1000,
      "payout_amount": 666.67,
      "payout_per_token": 0.6667
    },
    {
      "investor_email": "sarah.chen@email.com",
      "investor_name": "Sarah Chen",
      "tokens_owned": 500,
      "payout_amount": 333.33,
      "payout_per_token": 0.6667
    }
  ]
}
```

### Method 2: Using cURL

```bash
curl -X POST "http://localhost:8000/api/simulate-payout" \
  -H "Content-Type: application/json" \
  -d '{
    "farm_id": "farm_001",
    "payout_amount": 1000,
    "payout_date": "2024-09-30",
    "description": "Q3 2024 Harvest Dividend"
  }'
```

## Payout Calculation Logic

1. **Total Payout Amount:** The amount you want to distribute (e.g., $1,000)
2. **Total Tokens:** Sum of all tokens owned by investors for that farm
3. **Payout per Token:** Total Payout ÷ Total Tokens
4. **Individual Payout:** Tokens Owned × Payout per Token

## Example Scenarios

### Scenario 1: $1,000 Payout
- Total Tokens: 1,500
- Payout per Token: $0.6667
- Donald Duck (1,000 tokens): $666.67
- Sarah Chen (500 tokens): $333.33

### Scenario 2: $2,500 Payout (12.5% APY on $20,000 invested)
- Total Tokens: 1,500
- Payout per Token: $1.6667
- Donald Duck (1,000 tokens): $1,666.67
- Sarah Chen (500 tokens): $833.33

## Testing Steps

1. **Start the backend server:**
   ```bash
   cd backend/projects/backend
   python simple_server.py
   ```

2. **Test the payout simulation:**
   Use the API endpoint or cURL command above

3. **Verify the results:**
   Check that the payout amounts are calculated correctly based on token ownership

## Available API Endpoints

- `GET /api/farms` - Get all farms
- `GET /api/farms/{farmer_email}` - Get farms owned by a specific farmer
- `GET /api/investor-holdings/{investor_email}` - Get holdings for a specific investor
- `POST /api/simulate-payout` - Simulate a dividend payout

## Next Steps

1. **Update Farmer Dashboard:** Show John Doe's owned farms
2. **Create Payout Interface:** Allow farmers to initiate payouts
3. **Update Investor Dashboard:** Show holdings and payout history
4. **Add Payout History:** Track all past payouts
