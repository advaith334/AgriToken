import { create } from 'zustand';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'farmer' | 'investor';
  connectedWallet: boolean;
  walletAddress?: string;
}

export interface Farm {
  id: string;
  name: string;
  location: string;
  acres: number;
  crop: string;
  asaId: string;
  tokenSupply: number;
  tokensSold: number;
  pricePerToken: number;
  lastYieldPerAcre: number;
  expectedYieldPerAcre: number;
  lastRevenuePerAcre: number;
  expectedRevenuePerAcre: number;
  plantingDate: string;
  harvestWindow: string;
  imageUrl: string;
  farmerId: string;
  status: 'active' | 'pending' | 'harvested';
}

export interface Holding {
  id: string;
  investorId: string;
  farmId: string;
  tokensHeld: number;
  costBasis: number;
  purchaseDate: string;
}

export interface Distribution {
  id: string;
  farmId: string;
  type: 'harvest' | 'insurance';
  date: string;
  gross: number;
  fees: number;
  net: number;
  recipientsCount: number;
  status: 'pending' | 'completed';
  txHash?: string;
}

interface AppStore {
  user: User | null;
  farms: Farm[];
  holdings: Holding[];
  distributions: Distribution[];
  
  // Actions
  setUser: (user: User | null) => void;
  toggleWallet: () => void;
  addFarm: (farm: Omit<Farm, 'id'>) => void;
  updateFarm: (id: string, updates: Partial<Farm>) => void;
  addHolding: (holding: Omit<Holding, 'id'>) => void;
  addDistribution: (distribution: Omit<Distribution, 'id'>) => void;
  
  // Calculations
  getPortfolioValue: (investorId: string) => number;
  getTotalInvested: (investorId: string) => number;
  getUnrealizedPL: (investorId: string) => { amount: number; percentage: number };
}

export const useAppStore = create<AppStore>((set, get) => ({
  user: null,
  farms: [
    {
      id: 'farm-1',
      name: 'Green Valley Maize',
      location: 'Nakuru, Kenya',
      acres: 250,
      crop: 'Maize',
      asaId: 'ASA_789123456',
      tokenSupply: 25000,
      tokensSold: 18750,
      pricePerToken: 12.5,
      lastYieldPerAcre: 45,
      expectedYieldPerAcre: 50,
      lastRevenuePerAcre: 562.5,
      expectedRevenuePerAcre: 625,
      plantingDate: '2024-03-15',
      harvestWindow: '2024-09-15 - 2024-10-15',
      imageUrl: '/api/placeholder/400/300',
      farmerId: 'farmer-demo',
      status: 'active'
    },
    {
      id: 'farm-2',
      name: 'Sunridge Coffee',
      location: 'Huila, Colombia',
      acres: 120,
      crop: 'Coffee',
      asaId: 'ASA_456789123',
      tokenSupply: 12000,
      tokensSold: 9600,
      pricePerToken: 25.0,
      lastYieldPerAcre: 15,
      expectedYieldPerAcre: 18,
      lastRevenuePerAcre: 375,
      expectedRevenuePerAcre: 450,
      plantingDate: '2024-01-10',
      harvestWindow: '2024-11-01 - 2024-12-31',
      imageUrl: '/api/placeholder/400/300',
      farmerId: 'farmer-demo',
      status: 'active'
    }
  ],
  holdings: [
    {
      id: 'holding-1',
      investorId: 'investor-demo',
      farmId: 'farm-1',
      tokensHeld: 1250,
      costBasis: 15625,
      purchaseDate: '2024-04-01'
    },
    {
      id: 'holding-2',
      investorId: 'investor-demo',
      farmId: 'farm-2',
      tokensHeld: 480,
      costBasis: 12000,
      purchaseDate: '2024-04-15'
    }
  ],
  distributions: [
    {
      id: 'dist-1',
      farmId: 'farm-1',
      type: 'harvest',
      date: '2024-08-15',
      gross: 140625,
      fees: 7031,
      net: 133594,
      recipientsCount: 75,
      status: 'completed',
      txHash: 'ALGO_TX_ABC123...'
    }
  ],

  setUser: (user) => set({ user }),
  
  toggleWallet: () => set((state) => ({
    user: state.user ? {
      ...state.user,
      connectedWallet: !state.user.connectedWallet,
      walletAddress: !state.user.connectedWallet ? 'E2SHORA4VGLYFF34ET7IPSU4BVOEVM4LM7EJQGNB2GNZY7PJNMQWKGRS4A' : undefined
    } : null
  })),

  addFarm: (farm) => set((state) => ({
    farms: [...state.farms, { ...farm, id: `farm-${Date.now()}` }]
  })),

  updateFarm: (id, updates) => set((state) => ({
    farms: state.farms.map(farm => farm.id === id ? { ...farm, ...updates } : farm)
  })),

  addHolding: (holding) => set((state) => ({
    holdings: [...state.holdings, { ...holding, id: `holding-${Date.now()}` }]
  })),

  addDistribution: (distribution) => set((state) => ({
    distributions: [...state.distributions, { ...distribution, id: `dist-${Date.now()}` }]
  })),

  getPortfolioValue: (investorId) => {
    const state = get();
    const holdings = state.holdings.filter(h => h.investorId === investorId);
    return holdings.reduce((total, holding) => {
      const farm = state.farms.find(f => f.id === holding.farmId);
      if (!farm) return total;
      const estimatedPrice = farm.pricePerToken * 1.05; // Simple 5% appreciation
      return total + (holding.tokensHeld * estimatedPrice);
    }, 0);
  },

  getTotalInvested: (investorId) => {
    const state = get();
    return state.holdings
      .filter(h => h.investorId === investorId)
      .reduce((total, holding) => total + holding.costBasis, 0);
  },

  getUnrealizedPL: (investorId) => {
    const state = get();
    const totalInvested = state.getTotalInvested(investorId);
    const portfolioValue = state.getPortfolioValue(investorId);
    const amount = portfolioValue - totalInvested;
    const percentage = totalInvested > 0 ? (amount / totalInvested) * 100 : 0;
    return { amount, percentage };
  }
}));