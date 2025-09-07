import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatCard } from "@/components/StatCard";
import InvestmentModal from "@/components/InvestmentModal";
import FarmDetailsModal from "@/components/FarmDetailsModal";
import { 
  DollarSign, 
  TrendingUp, 
  Wallet,
  Calendar,
  Eye,
  ShoppingCart
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";

interface Farm {
  "Farm ID": string;
  "Farm Name": string;
  "Farm Website": string;
  "Farm Email": string;
  "Farm Phone": string;
  "Farmer Name": string;
  "Farmer Email": string;
  "Wallet Address": string;
  "Farm Size (Acres)": number;
  "Crop Type": string;
  "Farm Location": string;
  "Number of Tokens": number;
  "Tokens Sold": number;
  "Tokens Available": number;
  "Token Name": string;
  "Token Unit": string;
  "Price per Token (USD)": number;
  "ASA ID": string;
  "Est. APY": number;
  "Expected Yield /unit": number;
  "Harvest Date": string;
  "Payout Method": string;
  "Insurance Enabled": boolean;
  "Insurance Type": string;
  "Verification Method": string;
  "Farm Images": string[];
  "Historical Yield": number[];
  "Local Currency": string;
  "Farm Status": string;
  "Created At": string;
  "Last Updated": string;
}

interface InvestorHolding {
  "Investor Email": string;
  "Investor Name": string;
  "Farm ID": string;
  "Farm Name": string;
  "Tokens Owned": number;
  "Cost Basis": number;
  "Purchase Date": string;
  "ASA ID": string;
  "Token Price": number;
  "Est. Value": number;
  "P&L": number;
  "P&L Percentage": number;
  "Last Payout": string | null;
  "Total Payouts Received": number;
}

export default function InvestorDashboard() {
  const { user } = useAppStore();
  const { toast } = useToast();
  const [farms, setFarms] = useState<Farm[]>([]);
  const [investorHoldings, setInvestorHoldings] = useState<InvestorHolding[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [isInvestmentModalOpen, setIsInvestmentModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Fetch investor holdings from API
  const fetchInvestorHoldings = async () => {
    if (!user?.email) return;
    
    try {
      const response = await fetch(`http://localhost:5000/investor-holdings`);
      if (response.ok) {
        const data = await response.json();
        // Filter holdings by current user's email
        const userHoldings = (data || []).filter((holding: any) => 
          holding["Investor Email"] === user?.email
        );
        setInvestorHoldings(userHoldings);
      } else {
        console.log('No holdings found for user');
        setInvestorHoldings([]);
      }
    } catch (error) {
      console.error('Error fetching investor holdings:', error);
      setInvestorHoldings([]);
    }
  };

  // Fetch all farms and investor holdings from API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch farms
        const farmsResponse = await fetch('http://localhost:5000/farms');
        if (farmsResponse.ok) {
          const farmsData = await farmsResponse.json();
          setFarms(farmsData || []);
        } else {
          toast({
            title: 'Error loading farms',
            description: 'Could not load farm data.',
            variant: 'destructive'
          });
        }

        // Fetch investor holdings
        await fetchInvestorHoldings();
      } catch (error) {
        toast({
          title: 'Network error',
          description: 'Unable to connect to the server.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.email, toast]);

  if (!user) {
    return <div>Please log in to access the investor dashboard.</div>;
  }

  // Calculate statistics from real holdings data
  const totalInvested = investorHoldings.reduce((sum, holding) => sum + holding["Cost Basis"], 0);
  const portfolioValue = investorHoldings.reduce((sum, holding) => sum + holding["Est. Value"], 0);
  const totalPL = investorHoldings.reduce((sum, holding) => sum + holding["P&L"], 0);
  const plPercentage = totalInvested > 0 ? (totalPL / totalInvested) * 100 : 0;
  
  const lastPayout = investorHoldings
    .filter(h => h["Last Payout"])
    .sort((a, b) => new Date(b["Last Payout"] || "").getTime() - new Date(a["Last Payout"] || "").getTime())[0];

  const handleBuyTokens = (farmId: string) => {
    const farm = farms.find(f => f["Farm ID"] === farmId);
    if (farm) {
      setSelectedFarm(farm);
      setIsInvestmentModalOpen(true);
    }
  };

  const handleViewFarm = (farmId: string) => {
    const farm = farms.find(f => f["Farm ID"] === farmId);
    if (farm) {
      setSelectedFarm(farm);
      setIsDetailsModalOpen(true);
    }
  };

  const handleInvest = async (farm: Farm, tokens: number, totalCost: number) => {
    // Refresh holdings after successful investment
    await fetchInvestorHoldings();
    toast({
      title: 'Investment successful',
      description: `Successfully purchased ${tokens} tokens for $${totalCost.toLocaleString()}`,
    });
  };

  return (
    <div className="container py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Investor Dashboard</h1>
        <p className="text-muted-foreground">Track your agricultural investments and returns</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Invested"
          value={`$${totalInvested.toLocaleString()}`}
          icon={DollarSign}
          subtitle="across all farms"
        />
        <StatCard
          title="Portfolio Value (Est.)"
          value={`$${portfolioValue.toLocaleString()}`}
          icon={Wallet}
          trend={{ value: plPercentage, isPositive: totalPL >= 0 }}
        />
        <StatCard
          title="Unrealized P&L"
          value={`$${totalPL.toLocaleString()}`}
          icon={TrendingUp}
          subtitle={`${plPercentage.toFixed(1)}%`}
        />
        <StatCard
          title="Last Harvest Payout"
          value={lastPayout ? `$${lastPayout["Total Payouts Received"].toLocaleString()}` : "$0"}
          icon={Calendar}
          subtitle={lastPayout ? lastPayout["Last Payout"] : "No payouts yet"}
        />
      </div>

      <Tabs defaultValue="portfolio" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
        </TabsList>

        <TabsContent value="portfolio" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Holdings</CardTitle>
              <CardDescription>Current token positions and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Farm</th>
                      <th className="text-left p-2">Crop</th>
                      <th className="text-right p-2">Tokens Held</th>
                      <th className="text-right p-2">Cost Basis</th>
                      <th className="text-right p-2">Est. Value</th>
                      <th className="text-right p-2">P&L ($)</th>
                      <th className="text-right p-2">P&L (%)</th>
                      <th className="text-right p-2">Last Payout</th>
                      <th className="text-center p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {investorHoldings.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="p-8 text-center text-muted-foreground">
                          No holdings found. Start investing in farms to see your portfolio here.
                        </td>
                      </tr>
                    ) : (
                      investorHoldings.map((holding) => {
                        const farm = farms.find(f => f["Farm ID"] === holding["Farm ID"]);
                        if (!farm) return null;

                        return (
                          <tr key={`${holding["Farm ID"]}-${holding["Investor Email"]}`} className="border-b">
                            <td className="p-2 font-medium">{holding["Farm Name"]}</td>
                            <td className="p-2">{farm["Crop Type"]}</td>
                            <td className="p-2 text-right">{holding["Tokens Owned"].toLocaleString()}</td>
                            <td className="p-2 text-right">${holding["Cost Basis"].toLocaleString()}</td>
                            <td className="p-2 text-right">${holding["Est. Value"].toLocaleString()}</td>
                            <td className={`p-2 text-right ${holding["P&L"] >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              ${holding["P&L"].toLocaleString()}
                            </td>
                            <td className={`p-2 text-right ${holding["P&L Percentage"] >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {holding["P&L Percentage"].toFixed(1)}%
                            </td>
                            <td className="p-2 text-right">
                              {holding["Last Payout"] ? `$${holding["Total Payouts Received"].toLocaleString()}` : "$0"}
                            </td>
                            <td className="p-2">
                              <div className="flex gap-1 justify-center">
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => handleViewFarm(holding["Farm ID"])}
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => handleBuyTokens(holding["Farm ID"])}
                                >
                                  <ShoppingCart className="h-3 w-3" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payout History</CardTitle>
              <CardDescription>Your harvest and insurance distributions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {investorHoldings
                  .filter(h => h["Total Payouts Received"] > 0)
                  .sort((a, b) => new Date(b["Last Payout"] || "").getTime() - new Date(a["Last Payout"] || "").getTime())
                  .map((holding) => {
                    const farm = farms.find(f => f["Farm ID"] === holding["Farm ID"]);
                    if (!farm) return null;
                    
                    return (
                      <div key={`${holding["Farm ID"]}-${holding["Investor Email"]}`} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <div className="font-medium">
                            🌾 {holding["Farm Name"]}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {holding["Last Payout"]} • harvest • TX: ALGO_TX_{Math.random().toString(36).substring(2, 8)}...
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-green-600">+${holding["Total Payouts Received"].toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">
                            {holding["Tokens Owned"].toLocaleString()} tokens
                          </div>
                        </div>
                      </div>
                    );
                  })}
                {investorHoldings.filter(h => h["Total Payouts Received"] > 0).length === 0 && (
                  <div className="text-center p-8 text-muted-foreground">
                    No payouts received yet. Payouts will appear here after harvest distributions.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="explore" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Available Farms</h2>
            <Button asChild variant="hero">
              <a href="/explore">View All Farms</a>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="col-span-full text-center p-8">
                <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading farms...</p>
              </div>
            ) : farms.length === 0 ? (
              <div className="col-span-full text-center p-8">
                <p className="text-muted-foreground">No farms available for investment.</p>
              </div>
            ) : (
              farms.map((farm) => (
                <Card key={farm["Farm ID"]} className="hover:shadow-medium transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-start">
                      <span>{farm["Farm Name"]}</span>
                      <span className="text-sm font-normal text-muted-foreground">{farm["Crop Type"]}</span>
                    </CardTitle>
                    <CardDescription>{farm["Farm Location"]} • {farm["Farm Size (Acres)"]} acres</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Price/Token</div>
                        <div className="font-medium">${farm["Price per Token (USD)"]}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Est. APY</div>
                        <div className="font-medium text-success">{farm["Est. APY"]}%</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Available</div>
                        <div className="font-medium">{farm["Tokens Available"].toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">ASA ID</div>
                        <div className="font-mono text-xs">{farm["ASA ID"].slice(-8)}</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        variant="hero" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleBuyTokens(farm["Farm ID"])}
                        disabled={farm["Tokens Available"] === 0}
                      >
                        Invest
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewFarm(farm["Farm ID"])}
                      >
                        Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <InvestmentModal
        isOpen={isInvestmentModalOpen}
        onClose={() => setIsInvestmentModalOpen(false)}
        farm={selectedFarm}
        onInvest={handleInvest}
        userWalletAddress={user?.walletAddress}
        userEmail={user?.email}
      />

      <FarmDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        farm={selectedFarm}
      />
    </div>
  );
}