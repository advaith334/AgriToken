# 🌾 AgriToken - Agricultural Investment Platform

> **EasyA x Algorand Harvard Hackathon Project**

AgriToken is a revolutionary blockchain-based platform that democratizes agricultural investment by tokenizing farmland and enabling fractional ownership through Algorand's secure and efficient blockchain technology.

## 🎯 Problem Statement

Traditional agricultural investment is plagued by:
- **High barriers to entry** - Large minimum investments required
- **Lack of liquidity** - Farmland is illiquid and hard to sell
- **Geographic limitations** - Investors limited to local opportunities
- **No transparency** - Limited visibility into farm performance
- **Risk concentration** - All eggs in one basket approach

## 💡 Solution

AgriToken transforms farmland into tradeable digital assets (ASAs) on Algorand, enabling:
- **Fractional ownership** of premium farmland
- **Global accessibility** for investors worldwide
- **Real-time transparency** through blockchain
- **Automated payouts** from harvest revenues
- **Insurance protection** against crop failures
- **Liquidity** through token trading

## 🚀 Key Features

### For Farmers
- **Farm Tokenization**: Convert farmland into tradeable Algorand Standard Assets (ASAs)
- **Capital Access**: Raise funds by selling farm tokens to global investors
- **Performance Tracking**: Monitor and report farm metrics transparently
- **Automated Payouts**: Distribute harvest revenues to token holders automatically

### For Investors
- **Fractional Investment**: Own a piece of premium farmland with as little as $10
- **Diversified Portfolio**: Invest across multiple farms and crop types
- **Real-time Tracking**: Monitor investment performance and farm metrics
- **Insurance Options**: Protect investments with 15% insurance premium
- **Automated Returns**: Receive harvest payouts directly to your wallet

### Platform Features
- **Smart Contracts**: Automated token distribution and revenue sharing
- **Insurance Integration**: Optional protection against crop failures and natural disasters
- **Real-time Analytics**: Comprehensive dashboards for farmers and investors
- **Mobile-First Design**: Responsive web application accessible on all devices

## 🏗️ Technical Architecture

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **UI Library**: Radix UI + Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router v6
- **Build Tool**: Vite

### Backend (Python + Flask)
- **API Framework**: Flask with CORS support
- **Blockchain Integration**: Algorand SDK + AlgoKit
- **Data Storage**: JSON-based file system
- **Smart Contracts**: Puya (Python for Algorand)

### Blockchain (Algorand)
- **Network**: Algorand Testnet
- **Assets**: Algorand Standard Assets (ASAs)
- **Smart Contracts**: Puya-based contracts for farm tokenization
- **Transactions**: Direct asset transfers between parties

## 📁 Project Structure

```
AgriToken/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── lib/            # Utility functions and services
│   │   └── types/          # TypeScript type definitions
│   └── package.json
├── backend/                 # Python backend API
│   ├── app.py              # Main Flask application
│   └── projects/
│       └── smart_contracts/ # Algorand smart contracts
├── data/                   # Application data storage
│   ├── farm_info/          # Farm data files
│   ├── investor_holdings.json
│   └── user_info/          # User registration data
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/agritoken.git
cd agritoken
```

### 2. Backend Setup
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the backend server
cd backend
python app.py
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup
```bash
# Install dependencies
cd frontend
npm install

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:8080`

## 🎮 Usage Guide

### For Farmers
1. **Sign Up**: Create a farmer account with your details
2. **Add Farm**: Register your farmland with location, size, and crop details
3. **Tokenize**: Convert your farm into tradeable tokens
4. **Monitor**: Track investment and farm performance
5. **Distribute**: Automatically share harvest revenues with investors

### For Investors
1. **Sign Up**: Create an investor account
2. **Connect Wallet**: Link your Algorand wallet
3. **Explore Farms**: Browse available investment opportunities
4. **Invest**: Purchase farm tokens with optional insurance
5. **Track Portfolio**: Monitor your investments and returns
6. **Receive Payouts**: Get automated harvest distributions

## 🔧 API Endpoints

### Farm Management
- `GET /farms` - Retrieve all available farms
- `POST /farms` - Add a new farm
- `GET /farms/{farm_id}` - Get specific farm details

### Investment Operations
- `POST /investor-holdings` - Record new investment
- `GET /investor-holdings` - Get investor portfolio
- `POST /transfer_assets` - Execute token transfer

### User Management
- `POST /signup` - User registration
- `POST /login` - User authentication
- `POST /set_mnemonic` - Wallet connection

## 🔐 Security Features

- **Wallet Integration**: Secure Algorand wallet connection
- **Mnemonic Protection**: Encrypted mnemonic storage
- **Transaction Verification**: Blockchain-verified transactions
- **Data Validation**: Input sanitization and validation
- **CORS Protection**: Cross-origin request security

## 📊 Smart Contracts

### Farm Tokenization Contract
- **Asset Creation**: Mint farm tokens as ASAs
- **Ownership Tracking**: Maintain token holder registry
- **Revenue Distribution**: Automated payout mechanisms
- **Insurance Claims**: Handle insurance payouts

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach
- **Dark/Light Mode**: Theme switching capability
- **Real-time Updates**: Live data synchronization
- **Interactive Charts**: Performance visualization
- **Toast Notifications**: User feedback system
- **Loading States**: Smooth user experience

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm run lint
npm run build
```

### Backend Testing
```bash
cd backend
python test_server.py
```

## 🚀 Deployment

### Frontend Deployment
```bash
cd frontend
npm run build
# Deploy the dist/ folder to your hosting service
```

### Backend Deployment
```bash
cd backend
# Deploy to your preferred cloud platform (AWS, GCP, etc.)
```

## 🙏 Acknowledgments

- **Algorand Foundation** for blockchain infrastructure
- **EasyA** for hackathon organization
- **Harvard University** for hosting the event
- **Open Source Community** for amazing tools and libraries

## 🔮 Future Roadmap

- [ ] **Mobile App**: Native iOS and Android applications
- [ ] **Advanced Analytics**: AI-powered farm performance predictions
- [ ] **Secondary Market**: Token trading platform
- [ ] **Insurance Integration**: Automated insurance claim processing
- [ ] **Sustainability Metrics**: Carbon footprint tracking
- [ ] **Global Expansion**: Multi-country farm listings
- [ ] **Yield Optimization**: IoT integration for farm monitoring

---

**Built with ❤️ for the EasyA x Algorand Harvard Hackathon**

*Transforming agriculture through blockchain technology*