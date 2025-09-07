export interface FarmData {
  "Farm Name": string;
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
  "Payout Method"?: string;
  "Insurance Enabled"?: boolean;
  "Insurance Type"?: string;
  "Verification Method"?: string;
  "Farm Images"?: string[];
  "Local Currency"?: string;
}
