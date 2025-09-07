import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Upload } from "lucide-react";
import { validateEmail, generateTokenUnit, FarmData } from "@/lib/farmService";

// Using FarmData interface from farmService

export default function AddFarmListing() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<FarmData>>({
    "Farm Name": "",
    "Farm Website": "",
    "Farm Email": "",
    "Farm Phone": "",
    "Farmer Name": "",
    "Wallet Address": "E2SHORA4VGLYFF34ET7IPSU4BVOEVM4LM7EJQGNB2GNZY7PJNMQWKGRS4A", // Default testnet address
    "Farm Size (Acres)": 0,
    "Crop Type": "",
    "Farm Location": "",
    "Number of Tokens": 0,
    "Token Name": "",
    "Token Unit": "",
    "Price per Token (USD)": 0,
    "Expected Yield /unit": 0,
    "Harvest Date": "",
    "Payout Method": "ALGO",
    "Verification Method": "Self-Reported",
    "Historical Yield": [],
    "Local Currency": "USD"
  });

  const [historicalYieldInput, setHistoricalYieldInput] = useState("");
  const [farmImagesInput, setFarmImagesInput] = useState("");

  const handleInputChange = (field: keyof FarmData, value: string | number | boolean) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value
      };

      // Auto-generate token unit when farm name and crop type are both filled
      if (field === "Farm Name" || field === "Crop Type") {
        const farmName = field === "Farm Name" ? value as string : prev["Farm Name"];
        const cropType = field === "Crop Type" ? value as string : prev["Crop Type"];
        
        if (farmName && cropType) {
          newData["Token Unit"] = generateTokenUnit(farmName, cropType);
        }
      }

      return newData;
    });
  };

  const handleHistoricalYieldChange = (value: string) => {
    setHistoricalYieldInput(value);
    const yields = value.split(',').map(y => parseFloat(y.trim())).filter(y => !isNaN(y));
    setFormData(prev => ({
      ...prev,
      "Historical Yield": yields
    }));
  };


  const validateForm = (): string | null => {
    const requiredFields: (keyof FarmData)[] = [
      "Farm Name", "Farm Email", "Farm Phone", "Farmer Name", "Wallet Address",
      "Farm Size (Acres)", "Crop Type", "Farm Location", "Number of Tokens",
      "Token Name", "Token Unit", "Price per Token (USD)", "Expected Yield /unit",
      "Harvest Date"
    ];

    for (const field of requiredFields) {
      if (!formData[field] || (typeof formData[field] === 'string' && formData[field] === '')) {
        return `${field} is required`;
      }
    }

    if (formData["Farm Size (Acres)"] <= 0) {
      return "Farm size must be greater than 0";
    }

    if (formData["Number of Tokens"] <= 0) {
      return "Number of tokens must be greater than 0";
    }

    if (formData["Price per Token (USD)"] <= 0) {
      return "Price per token must be greater than 0";
    }

    if (formData["Expected Yield /unit"] <= 0) {
      return "Expected yield must be greater than 0";
    }

    // Validate email format
    if (!validateEmail(formData["Farm Email"] || "")) {
      return "Please enter a valid email address";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLoading) return;

    const validationError = validateForm();
    if (validationError) {
      toast({
        title: "Validation Error",
        description: validationError,
        variant: "destructive"
      });
      return;
    }


    setIsLoading(true);

    try {
      // Step 1: Send farm data to backend for tokenization
      toast({
        title: "Starting Tokenization",
        description: "Creating farm tokens on Algorand blockchain...",
      });

      const response = await fetch('http://localhost:5000/tokenize_farm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Tokenization failed');
      }

      // Step 2: Show success message with blockchain information
      toast({
        title: "Farm Successfully Tokenized!",
        description: `Your farm has been tokenized on Algorand! Asset ID: ${result.asset_id}`,
      });

      // Navigate back to farmer options
      navigate('/farmer/options');
      
    } catch (error) {
      console.error('Error in farm tokenization:', error);
      const errorMessage = error instanceof Error ? error.message : 'There was an issue tokenizing your farm. Please try again.';
      toast({
        title: "Tokenization Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/farmer/options')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Options
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Add Farm Listing</h1>
          <p className="text-muted-foreground mt-2">
            Create a new farm listing to tokenize your agricultural assets
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Farm Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Basic Farm Information
              </CardTitle>
              <CardDescription>
                Provide the essential details about your farm
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="farmName">Farm Name *</Label>
                  <Input
                    id="farmName"
                    value={formData["Farm Name"]}
                    onChange={(e) => handleInputChange("Farm Name", e.target.value)}
                    placeholder="e.g., Green Acres Farm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="farmerName">Farmer Name *</Label>
                  <Input
                    id="farmerName"
                    value={formData["Farmer Name"]}
                    onChange={(e) => handleInputChange("Farmer Name", e.target.value)}
                    placeholder="Your full name"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="farmLocation">Farm Location *</Label>
                <Input
                  id="farmLocation"
                  value={formData["Farm Location"]}
                  onChange={(e) => handleInputChange("Farm Location", e.target.value)}
                  placeholder="Full address of your farm"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="farmSize">Farm Size (Acres) *</Label>
                  <Input
                    id="farmSize"
                    type="number"
                    value={formData["Farm Size (Acres)"]}
                    onChange={(e) => handleInputChange("Farm Size (Acres)", parseInt(e.target.value) || 0)}
                    placeholder="e.g., 100"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cropType">Crop Type *</Label>
                  <Select value={formData["Crop Type"]} onValueChange={(value) => handleInputChange("Crop Type", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select crop type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Soybeans">Soybeans</SelectItem>
                      <SelectItem value="Corn">Corn</SelectItem>
                      <SelectItem value="Wheat">Wheat</SelectItem>
                      <SelectItem value="Rice">Rice</SelectItem>
                      <SelectItem value="Apples">Apples</SelectItem>
                      <SelectItem value="Blueberries">Blueberries</SelectItem>
                      <SelectItem value="Strawberries">Strawberries</SelectItem>
                      <SelectItem value="Tomatoes">Tomatoes</SelectItem>
                      <SelectItem value="Lettuce">Lettuce</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                How investors can reach you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="farmEmail">Farm Email *</Label>
                  <Input
                    id="farmEmail"
                    type="email"
                    value={formData["Farm Email"]}
                    onChange={(e) => handleInputChange("Farm Email", e.target.value)}
                    placeholder="contact@yourfarm.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="farmPhone">Farm Phone *</Label>
                  <Input
                    id="farmPhone"
                    value={formData["Farm Phone"]}
                    onChange={(e) => handleInputChange("Farm Phone", e.target.value)}
                    placeholder="+1-555-123-4567"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="farmWebsite">Farm Website</Label>
                <Input
                  id="farmWebsite"
                  value={formData["Farm Website"]}
                  onChange={(e) => handleInputChange("Farm Website", e.target.value)}
                  placeholder="https://yourfarm.com"
                />
              </div>
            </CardContent>
          </Card>

          {/* Tokenization Details */}
          <Card>
            <CardHeader>
              <CardTitle>Tokenization Details</CardTitle>
              <CardDescription>
                Define how your farm will be tokenized
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tokenName">Token Name *</Label>
                  <Input
                    id="tokenName"
                    value={formData["Token Name"]}
                    onChange={(e) => handleInputChange("Token Name", e.target.value)}
                    placeholder="e.g., SOYBEANS"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tokenUnit">Token Unit *</Label>
                  <Input
                    id="tokenUnit"
                    value={formData["Token Unit"]}
                    onChange={(e) => handleInputChange("Token Unit", e.target.value)}
                    placeholder="e.g., LANFARWH"
                    maxLength={8}
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Maximum 8 characters (Algorand limit)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="numberOfTokens">Number of Tokens *</Label>
                  <Input
                    id="numberOfTokens"
                    type="number"
                    value={formData["Number of Tokens"]}
                    onChange={(e) => handleInputChange("Number of Tokens", parseInt(e.target.value) || 0)}
                    placeholder="1000"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pricePerToken">Price per Token (USD) *</Label>
                  <Input
                    id="pricePerToken"
                    type="number"
                    value={formData["Price per Token (USD)"]}
                    onChange={(e) => handleInputChange("Price per Token (USD)", parseFloat(e.target.value) || 0)}
                    placeholder="50.00"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expectedYield">Expected Yield/unit *</Label>
                  <Input
                    id="expectedYield"
                    type="number"
                    value={formData["Expected Yield /unit"]}
                    onChange={(e) => handleInputChange("Expected Yield /unit", parseInt(e.target.value) || 0)}
                    placeholder="4500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="harvestDate">Harvest Date *</Label>
                  <Input
                    id="harvestDate"
                    type="date"
                    value={formData["Harvest Date"]}
                    onChange={(e) => handleInputChange("Harvest Date", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payoutMethod">Payout Method</Label>
                  <Select value={formData["Payout Method"]} onValueChange={(value) => handleInputChange("Payout Method", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALGO">ALGO</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Wallet and Verification */}
          <Card>
            <CardHeader>
              <CardTitle>Wallet & Verification</CardTitle>
              <CardDescription>
                Your wallet address and verification details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="walletAddress">Wallet Address *</Label>
                <Input
                  id="walletAddress"
                  value={formData["Wallet Address"]}
                  onChange={(e) => handleInputChange("Wallet Address", e.target.value)}
                  placeholder="Enter your Algorand wallet address (e.g., E2SHORA4VGLYFF34ET7IPSU4BVOEVM4LM7EJQGNB2GNZY7PJNMQWKGRS4A)"
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Enter your Algorand wallet address where you want to receive the farm tokens
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="verificationMethod">Verification Method</Label>
                <Select value={formData["Verification Method"]} onValueChange={(value) => handleInputChange("Verification Method", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Self-Reported">Self-Reported</SelectItem>
                    <SelectItem value="Third-Party Audited">Third-Party Audited</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/farmer/options')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Tokenizing Farm...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Tokenize Farm on Algorand
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
