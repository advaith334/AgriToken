// Farm service for handling farm data operations
// In a real application, this would make API calls to a backend

export interface FarmData {
  "Farm Name": string;
  "Farm Website": string;
  "Farm Email": string;
  "Farm Phone": string;
  "Farmer Name": string;
  "Wallet Address": string;
  "Farm Size (Acres)": number;
  "Crop Type": string;
  "Farm Location": string;
  "Number of Tokens": number;
  "Token Name": string;
  "Token Unit": string;
  "Price per Token (USD)": number;
  "Expected Yield /unit": number;
  "Harvest Date": string;
  "Payout Method": string;
  "Verification Method": string;
  "Farm Images": string[];
  "Historical Yield": number[];
  "Local Currency": string;
  // Blockchain fields (optional, added after tokenization)
  "Asset ID"?: number;
  "Contract Address"?: string;
  "Transaction ID"?: string;
}

// Save farm data to backend API (simulated for now)
export const saveFarmData = async (farmData: FarmData): Promise<boolean> => {
  try {
    // In a real application, this would be an API call to your backend
    // For demo purposes, we'll simulate the operation
    
    console.log('Saving farm data to farm_info.json:', farmData);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real implementation, you would:
    // 1. Make a POST request to your backend API
    // 2. The backend would read the existing farm_info.json file
    // 3. Append the new farm data to the array
    // 4. Write the updated data back to the file
    
    // For now, we'll just log the data that would be saved
    const existingFarms = await getExistingFarms();
    const updatedFarms = [...existingFarms, farmData];
    
    console.log('Updated farms list:', updatedFarms);
    
    return true;
  } catch (error) {
    console.error('Error saving farm data:', error);
    return false;
  }
};

// Get existing farms from the JSON file
export const getExistingFarms = async (): Promise<FarmData[]> => {
  try {
    // In a real application, this would fetch from your backend API
    // For demo purposes, we'll fetch from the public JSON file
    
    const response = await fetch('/farm_info.json');
    if (response.ok) {
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching existing farms:', error);
    return [];
  }
};

// Validate Pera wallet address format (basic validation)
export const validatePeraWalletAddress = (address: string): boolean => {
  // Basic Algorand address validation
  // Algorand addresses are 58 characters long and contain only alphanumeric characters
  const algorandAddressRegex = /^[A-Z2-7]{58}$/;
  return algorandAddressRegex.test(address);
};

// Validate email format
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate URL format
export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Generate a unique token unit based on farm name and crop type
export const generateTokenUnit = (farmName: string, cropType: string): string => {
  const farmAbbr = farmName
    .split(' ')
    .map(word => word.substring(0, 3).toUpperCase())
    .join('')
    .substring(0, 6);
  
  const cropAbbr = cropType.substring(0, 3).toUpperCase();
  
  return `${farmAbbr}${cropAbbr}`.substring(0, 10);
};

// Calculate total investment value
export const calculateTotalValue = (numberOfTokens: number, pricePerToken: number): number => {
  return numberOfTokens * pricePerToken;
};

// Format currency
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

// Format date for display
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
