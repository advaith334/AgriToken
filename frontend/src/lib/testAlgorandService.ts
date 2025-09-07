// Test file for Algorand service functionality
import { AlgorandService } from './algorandService';
import { FarmData } from './farmService';

// Test data
const testFarmData: FarmData = {
  "Farm Name": "Test Farm",
  "Farm Website": "https://testfarm.com",
  "Farm Email": "test@testfarm.com",
  "Farm Phone": "+1-555-123-4567",
  "Farmer Name": "John Doe",
  "Wallet Address": "",
  "Farm Size (Acres)": 100,
  "Crop Type": "Corn",
  "Farm Location": "123 Test St, Test City, TC 12345",
  "Number of Tokens": 1000,
  "Token Name": "CORN",
  "Token Unit": "TESTCORN",
  "Price per Token (USD)": 50,
  "Expected Yield /unit": 5000,
  "Harvest Date": "2025-09-30",
  "Payout Method": "ALGO",
  "Verification Method": "Self-Reported",
  "Farm Images": ["https://testfarm.com/image1.jpg"],
  "Historical Yield": [4800, 5000, 5100],
  "Local Currency": "USD"
};

// Test functions
export const testAlgorandService = async () => {
  console.log('Testing Algorand Service...');
  
  try {
    // Test 1: Generate account
    console.log('Test 1: Generating test account...');
    const testAccount = AlgorandService.generateAccount();
    console.log('Generated account:', {
      address: testAccount.address,
      privateKeyLength: testAccount.privateKey.length
    });

    // Test 2: Validate address
    console.log('Test 2: Validating address...');
    const isValid = AlgorandService.validateAddress(testAccount.address);
    console.log('Address validation result:', isValid);

    // Test 3: Create service instance
    console.log('Test 3: Creating service instance...');
    const service = new AlgorandService();
    console.log('Service created successfully');

    // Test 4: Test tokenization (this will fail in test environment but shows the flow)
    console.log('Test 4: Testing tokenization flow...');
    testFarmData["Wallet Address"] = testAccount.address;
    
    const result = await service.tokenizeFarm(
      testFarmData,
      testAccount.address,
      testAccount.privateKey
    );
    
    console.log('Tokenization result:', result);
    
    return {
      success: true,
      message: 'All tests completed successfully',
      testAccount: testAccount.address
    };
  } catch (error) {
    console.error('Test failed:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
      error
    };
  }
};

// Export for use in browser console or testing
if (typeof window !== 'undefined') {
  (window as any).testAlgorandService = testAlgorandService;
}
