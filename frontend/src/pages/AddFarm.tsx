import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, MapPin, DollarSign, Calendar, Coins } from "lucide-react";

interface FarmFormData {
  farmName: string;
  farmWebsite: string;
  farmEmail: string;
  farmPhone: string;
  farmSize: string;
  cropType: string;
  farmLocation: string;
  numberOfTokens: string;
  tokenName: string;
  tokenUnit: string;
  pricePerToken: string;
  expectedYield: string;
  harvestDate: string;
  payoutMethod: string;
  insuranceEnabled: boolean;
  insuranceType: string;
  verificationMethod: string;
  localCurrency: string;
}

export default function AddFarm() {
  const [formData, setFormData] = useState<FarmFormData>({
    farmName: "",
    farmWebsite: "",
    farmEmail: "",
    farmPhone: "",
    farmSize: "",
    cropType: "",
    farmLocation: "",
    numberOfTokens: "",
    tokenName: "",
    tokenUnit: "",
    pricePerToken: "",
    expectedYield: "",
    harvestDate: "",
    payoutMethod: "ALGO",
    insuranceEnabled: true,
    insuranceType: "Parametric Weather-Based",
    verificationMethod: "Self-Reported",
    localCurrency: "USD"
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { user } = useAppStore();
  const { toast } = useToast();

  const handleInputChange = (field: keyof FarmFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateFarmId = () => {
    return `farm_${Date.now()}`;
  };

  const generateASAId = () => {
    return Math.floor(Math.random() * 90000000) + 10000000; // 8-digit number
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.email) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to add a farm.',
        variant: 'destructive'
      });
      return;
    }

    // Validate required fields
    const requiredFields = ['farmName', 'farmSize', 'cropType', 'farmLocation', 'numberOfTokens', 'pricePerToken', 'harvestDate'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof FarmFormData]);
    
    if (missingFields.length > 0) {
      toast({
        title: 'Missing required fields',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);

    try {
      const currentDate = new Date().toISOString().split('T')[0];
      const farmId = generateFarmId();
      const asaId = generateASAId().toString();

      const newFarm = {
        "Farm ID": farmId,
        "Farm Name": formData.farmName,
        "Farm Website": formData.farmWebsite || `https://${formData.farmName.toLowerCase().replace(/\s+/g, '')}.com/`,
        "Farm Email": formData.farmEmail || user.email,
        "Farm Phone": formData.farmPhone,
        "Farmer Name": user.name,
        "Farmer Email": user.email,
        "Wallet Address": user.walletAddress || "WALLET_ADDRESS_PLACEHOLDER",
        "Farm Size (Acres)": parseInt(formData.farmSize),
        "Crop Type": formData.cropType,
        "Farm Location": formData.farmLocation,
        "Number of Tokens": parseInt(formData.numberOfTokens),
        "Tokens Sold": 0,
        "Tokens Available": parseInt(formData.numberOfTokens),
        "Token Name": formData.tokenName || formData.cropType.substring(0, 3).toUpperCase(),
        "Token Unit": formData.tokenUnit || formData.farmName.toUpperCase().replace(/\s+/g, ''),
        "Price per Token (USD)": parseFloat(formData.pricePerToken),
        "ASA ID": asaId,
        "Est. APY": 12.5, // Default APY
        "Expected Yield /unit": parseInt(formData.expectedYield),
        "Harvest Date": formData.harvestDate,
        "Payout Method": formData.payoutMethod,
        "Insurance Enabled": formData.insuranceEnabled,
        "Insurance Type": formData.insuranceType,
        "Verification Method": formData.verificationMethod,
        "Farm Images": [],
        "Historical Yield": [],
        "Local Currency": formData.localCurrency,
        "Farm Status": "Active",
        "Created At": currentDate,
        "Last Updated": currentDate
      };

      const response = await fetch('http://localhost:8000/api/farms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newFarm),
      });

      if (response.ok) {
        toast({
          title: 'Farm created successfully!',
          description: `${formData.farmName} has been added to your farms.`,
        });
        
        // Navigate back to farmer dashboard
        navigate('/farmer');
      } else {
        const error = await response.json();
        toast({
          title: 'Failed to create farm',
          description: error.detail || 'An error occurred while creating your farm.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Network error',
        description: 'Unable to connect to the server. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.farmName.length > 0 &&
      formData.farmSize.length > 0 &&
      formData.cropType.length > 0 &&
      formData.farmLocation.length > 0 &&
      formData.numberOfTokens.length > 0 &&
      formData.pricePerToken.length > 0 &&
      formData.harvestDate.length > 0
    );
  };

  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/farmer')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Add New Farm</h1>
          <p className="text-muted-foreground">Create a new tokenized farm for investment</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Farm Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Basic Farm Information
            </CardTitle>
            <CardDescription>
              Provide the basic details about your farm
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="farmName">Farm Name *</Label>
                <Input
                  id="farmName"
                  placeholder="e.g., Green Valley Maize"
                  value={formData.farmName}
                  onChange={(e) => handleInputChange('farmName', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cropType">Crop Type *</Label>
                <Select 
                  value={formData.cropType} 
                  onValueChange={(value) => handleInputChange('cropType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select crop type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Maize">Maize</SelectItem>
                    <SelectItem value="Coffee">Coffee</SelectItem>
                    <SelectItem value="Wheat">Wheat</SelectItem>
                    <SelectItem value="Rice">Rice</SelectItem>
                    <SelectItem value="Soybeans">Soybeans</SelectItem>
                    <SelectItem value="Cotton">Cotton</SelectItem>
                    <SelectItem value="Sugarcane">Sugarcane</SelectItem>
                    <SelectItem value="Potatoes">Potatoes</SelectItem>
                    <SelectItem value="Tomatoes">Tomatoes</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="farmLocation">Farm Location *</Label>
              <Input
                id="farmLocation"
                placeholder="e.g., Nakuru, Kenya"
                value={formData.farmLocation}
                onChange={(e) => handleInputChange('farmLocation', e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="farmSize">Farm Size (Acres) *</Label>
                <Input
                  id="farmSize"
                  type="number"
                  placeholder="e.g., 250"
                  value={formData.farmSize}
                  onChange={(e) => handleInputChange('farmSize', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="harvestDate">Expected Harvest Date *</Label>
                <Input
                  id="harvestDate"
                  type="date"
                  value={formData.harvestDate}
                  onChange={(e) => handleInputChange('harvestDate', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="farmEmail">Farm Email</Label>
                <Input
                  id="farmEmail"
                  type="email"
                  placeholder="farm@example.com"
                  value={formData.farmEmail}
                  onChange={(e) => handleInputChange('farmEmail', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="farmPhone">Farm Phone</Label>
                <Input
                  id="farmPhone"
                  placeholder="+1-555-0123"
                  value={formData.farmPhone}
                  onChange={(e) => handleInputChange('farmPhone', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="farmWebsite">Farm Website</Label>
              <Input
                id="farmWebsite"
                placeholder="https://yourfarm.com"
                value={formData.farmWebsite}
                onChange={(e) => handleInputChange('farmWebsite', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Tokenization Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5" />
              Tokenization Details
            </CardTitle>
            <CardDescription>
              Configure how your farm will be tokenized for investment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="numberOfTokens">Total Number of Tokens *</Label>
                <Input
                  id="numberOfTokens"
                  type="number"
                  placeholder="e.g., 10000"
                  value={formData.numberOfTokens}
                  onChange={(e) => handleInputChange('numberOfTokens', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pricePerToken">Price per Token (USD) *</Label>
                <Input
                  id="pricePerToken"
                  type="number"
                  step="0.01"
                  placeholder="e.g., 12.50"
                  value={formData.pricePerToken}
                  onChange={(e) => handleInputChange('pricePerToken', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tokenName">Token Name</Label>
                <Input
                  id="tokenName"
                  placeholder="e.g., GVM"
                  value={formData.tokenName}
                  onChange={(e) => handleInputChange('tokenName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tokenUnit">Token Unit</Label>
                <Input
                  id="tokenUnit"
                  placeholder="e.g., GREENVALLEY"
                  value={formData.tokenUnit}
                  onChange={(e) => handleInputChange('tokenUnit', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expectedYield">Expected Yield per Unit</Label>
              <Input
                id="expectedYield"
                type="number"
                placeholder="e.g., 5000"
                value={formData.expectedYield}
                onChange={(e) => handleInputChange('expectedYield', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Financial & Legal Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Financial & Legal Details
            </CardTitle>
            <CardDescription>
              Configure payout methods and insurance options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="payoutMethod">Payout Method</Label>
                <Select 
                  value={formData.payoutMethod} 
                  onValueChange={(value) => handleInputChange('payoutMethod', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALGO">ALGO</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="BTC">BTC</SelectItem>
                    <SelectItem value="ETH">ETH</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="localCurrency">Local Currency</Label>
                <Select 
                  value={formData.localCurrency} 
                  onValueChange={(value) => handleInputChange('localCurrency', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="KES">KES (Kenyan Shilling)</SelectItem>
                    <SelectItem value="COP">COP (Colombian Peso)</SelectItem>
                    <SelectItem value="INR">INR (Indian Rupee)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="insuranceType">Insurance Type</Label>
                <Select 
                  value={formData.insuranceType} 
                  onValueChange={(value) => handleInputChange('insuranceType', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Parametric Weather-Based">Parametric Weather-Based</SelectItem>
                    <SelectItem value="Yield-Based">Yield-Based</SelectItem>
                    <SelectItem value="Revenue-Based">Revenue-Based</SelectItem>
                    <SelectItem value="None">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="verificationMethod">Verification Method</Label>
                <Select 
                  value={formData.verificationMethod} 
                  onValueChange={(value) => handleInputChange('verificationMethod', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Self-Reported">Self-Reported</SelectItem>
                    <SelectItem value="Third-Party Audit">Third-Party Audit</SelectItem>
                    <SelectItem value="IoT Sensors">IoT Sensors</SelectItem>
                    <SelectItem value="Satellite Imagery">Satellite Imagery</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/farmer')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="hero"
            disabled={!isFormValid() || isLoading}
            className="gap-2"
          >
            {isLoading ? 'Creating Farm...' : 'Create Farm'}
          </Button>
        </div>
      </form>
    </div>
  );
}
