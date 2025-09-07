import { useState, useEffect } from "react";
import { FarmCard } from "@/components/FarmCard";
import InvestmentModal from "@/components/InvestmentModal";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, MapPin, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FarmData } from "@/types/farm";

export default function ExploreFarms() {
  const [farms, setFarms] = useState<FarmData[]>([]);
  const [filteredFarms, setFilteredFarms] = useState<FarmData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [cropFilter, setCropFilter] = useState<string>("all");
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [insuranceFilter, setInsuranceFilter] = useState<string>("all");
  const [selectedFarm, setSelectedFarm] = useState<FarmData | null>(null);
  const [isInvestmentModalOpen, setIsInvestmentModalOpen] = useState(false);
  const { toast } = useToast();

  // Load farm data
  useEffect(() => {
    const loadFarms = async () => {
      try {
        console.log('Fetching farms from http://localhost:5000/farms');
        const response = await fetch('http://localhost:5000/farms');
        console.log('Response status:', response.status);
        if (!response.ok) {
          throw new Error(`Failed to load farm data: ${response.status}`);
        }
        const farmData = await response.json();
        console.log('Farm data received:', farmData);
        setFarms(farmData);
        setFilteredFarms(farmData);
      } catch (error) {
        console.error('Error loading farms:', error);
        toast({
          title: "Error",
          description: "Failed to load farm data. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadFarms();
  }, [toast]);

  // Filter farms based on search and filter criteria
  useEffect(() => {
    let filtered = farms;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(farm => 
        farm["Farm Name"].toLowerCase().includes(searchTerm.toLowerCase()) ||
        farm["Farmer Name"].toLowerCase().includes(searchTerm.toLowerCase()) ||
        farm["Crop Type"].toLowerCase().includes(searchTerm.toLowerCase()) ||
        farm["Farm Location"].toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Crop type filter
    if (cropFilter !== "all") {
      filtered = filtered.filter(farm => farm["Crop Type"] === cropFilter);
    }

    // Price filter
    if (priceFilter !== "all") {
      const priceRanges = {
        "under-50": (price: number) => price < 50,
        "50-75": (price: number) => price >= 50 && price <= 75,
        "over-75": (price: number) => price > 75
      };
      filtered = filtered.filter(farm => priceRanges[priceFilter as keyof typeof priceRanges](farm["Price per Token (USD)"]));
    }

    // Insurance filter
    if (insuranceFilter !== "all") {
      filtered = filtered.filter(farm => {
        const hasInsurance = farm["Insurance Enabled"] === true;
        return insuranceFilter === "insured" ? hasInsurance : !hasInsurance;
      });
    }

    setFilteredFarms(filtered);
  }, [farms, searchTerm, cropFilter, priceFilter, insuranceFilter]);

  const handleInvest = (farm: FarmData) => {
    setSelectedFarm(farm);
    setIsInvestmentModalOpen(true);
  };

  const handleInvestmentComplete = (farm: FarmData, tokens: number, totalCost: number) => {
    toast({
      title: "Investment Successful!",
      description: `You have successfully invested $${totalCost.toLocaleString()} in ${farm["Farm Name"]} for ${tokens} tokens.`,
    });
    
    // Refresh farm data to update available tokens
    const loadFarms = async () => {
      try {
        const response = await fetch('http://localhost:5000/farms');
        if (response.ok) {
          const farmData = await response.json();
          setFarms(farmData);
          setFilteredFarms(farmData);
        }
      } catch (error) {
        console.error('Error refreshing farm data:', error);
      }
    };
    loadFarms();
  };

  const handleCloseInvestmentModal = () => {
    setIsInvestmentModalOpen(false);
    setSelectedFarm(null);
  };

  const getUniqueCropTypes = () => {
    return Array.from(new Set(farms.map(farm => farm["Crop Type"])));
  };

  const getTotalValue = () => {
    return farms.reduce((sum, farm) => sum + (farm["Number of Tokens"] * farm["Price per Token (USD)"]), 0);
  };

  const getTotalTokens = () => {
    return farms.reduce((sum, farm) => sum + farm["Number of Tokens"], 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading farms...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Explore Investment Opportunities
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover farms ready for tokenization and invest in sustainable agriculture
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <MapPin className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{farms.length}</p>
                <p className="text-sm text-muted-foreground">Active Farms</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{getTotalTokens().toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Tokens</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">💰</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">${getTotalValue().toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Value</p>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-muted-foreground">
            Showing {filteredFarms.length} of {farms.length} farms
          </p>
          <p className="text-sm text-gray-500">
            Debug: Loading: {loading.toString()}, Farms: {farms.length}, Filtered: {filteredFarms.length}
          </p>
        </div>

        {/* Farm Cards */}
        {filteredFarms.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No farms found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or filters
            </p>
            <button 
              onClick={() => {
                setSearchTerm("");
                setCropFilter("all");
                setPriceFilter("all");
                setInsuranceFilter("all");
              }}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFarms.map((farm, index) => {
              console.log('Rendering farm:', farm["Farm Name"], farm);
              return (
                <FarmCard 
                  key={`${farm["Farm Name"]}-${index}`} 
                  farm={farm} 
                  onInvest={handleInvest}
                />
              );
            })}
          </div>
        )}

        {/* Investment Modal */}
        <InvestmentModal
          isOpen={isInvestmentModalOpen}
          onClose={handleCloseInvestmentModal}
          farm={selectedFarm}
          onInvest={handleInvestmentComplete}
          userWalletAddress="DEMO_INVESTOR_WALLET_ADDRESS" // This should come from user authentication
        />
      </div>
    </div>
  );
}
