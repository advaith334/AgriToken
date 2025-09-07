import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatCard } from "@/components/StatCard";
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

export default function InvestorDashboard() {
  const { user, farms, holdings, distributions, getPortfolioValue, getTotalInvested, getUnrealizedPL } = useAppStore();
  const { toast } = useToast();

  if (!user) {
    return <div>Please log in to access the investor dashboard.</div>;
  }

  const userHoldings = holdings.filter(h => h.investorId === user.id);
  const totalInvested = getTotalInvested(user.id);
  const portfolioValue = getPortfolioValue(user.id);
  const pl = getUnrealizedPL(user.id);
  
  const lastPayout = distributions
    .filter(d => userHoldings.some(h => h.farmId === d.farmId))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  const handleBuyTokens = (farmId: string) => {
    toast({
      title: "Investment simulated",
      description: "Token purchase would be processed here",
    });
  };

  const handleViewFarm = (farmId: string) => {
    const farm = farms.find(f => f.id === farmId);
    toast({
      title: "Farm details",
      description: `Viewing details for ${farm?.name}`,
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
          value={totalInvested}
          icon={DollarSign}
          subtitle="across all farms"
        />
        <StatCard
          title="Portfolio Value (Est.)"
          value={portfolioValue}
          icon={Wallet}
          trend={{ value: pl.percentage, isPositive: pl.amount >= 0 }}
        />
        <StatCard
          title="Unrealized P&L"
          value={pl.amount}
          icon={TrendingUp}
          subtitle={`${pl.percentage.toFixed(1)}%`}
        />
        <StatCard
          title="Last Harvest Payout"
          value={lastPayout ? (lastPayout.net * 0.1) : 0} // Assuming 10% of total goes to this investor
          icon={Calendar}
          subtitle={lastPayout ? lastPayout.date : "No payouts yet"}
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
                    {userHoldings.map((holding) => {
                      const farm = farms.find(f => f.id === holding.farmId);
                      if (!farm) return null;
                      
                      const estimatedPrice = farm.pricePerToken * 1.05; // Simple 5% appreciation
                      const estValue = holding.tokensHeld * estimatedPrice;
                      const plAmount = estValue - holding.costBasis;
                      const plPercent = (plAmount / holding.costBasis) * 100;
                      
                      const lastDist = distributions
                        .filter(d => d.farmId === farm.id)
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
                      
                      const lastPayout = lastDist ? (lastDist.net * holding.tokensHeld / farm.tokenSupply) : 0;

                      return (
                        <tr key={holding.id} className="border-b">
                          <td className="p-2 font-medium">{farm.name}</td>
                          <td className="p-2">{farm.crop}</td>
                          <td className="p-2 text-right">{holding.tokensHeld.toLocaleString()}</td>
                          <td className="p-2 text-right">${holding.costBasis.toLocaleString()}</td>
                          <td className="p-2 text-right">${estValue.toLocaleString()}</td>
                          <td className={`p-2 text-right ${plAmount >= 0 ? 'text-success' : 'text-destructive'}`}>
                            ${plAmount.toLocaleString()}
                          </td>
                          <td className={`p-2 text-right ${plPercent >= 0 ? 'text-success' : 'text-destructive'}`}>
                            {plPercent.toFixed(1)}%
                          </td>
                          <td className="p-2 text-right">${lastPayout.toLocaleString()}</td>
                          <td className="p-2">
                            <div className="flex gap-1 justify-center">
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => handleViewFarm(farm.id)}
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => handleBuyTokens(farm.id)}
                              >
                                <ShoppingCart className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
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
                {distributions
                  .filter(d => userHoldings.some(h => h.farmId === d.farmId))
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((dist) => {
                    const farm = farms.find(f => f.id === dist.farmId);
                    const holding = userHoldings.find(h => h.farmId === dist.farmId);
                    if (!farm || !holding) return null;
                    
                    const myPayout = (dist.net * holding.tokensHeld) / farm.tokenSupply;
                    
                    return (
                      <div key={dist.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <div className="font-medium">
                            {dist.type === 'harvest' ? '🌾' : '🛡️'} {farm.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {dist.date} • {dist.type} • TX: ALGO_TX_{Math.random().toString(36).substring(2, 8)}...
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-success">+${myPayout.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">
                            {holding.tokensHeld.toLocaleString()} tokens
                          </div>
                        </div>
                      </div>
                    );
                  })}
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
            {farms.map((farm) => (
              <Card key={farm.id} className="hover:shadow-medium transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex justify-between items-start">
                    <span>{farm.name}</span>
                    <span className="text-sm font-normal text-muted-foreground">{farm.crop}</span>
                  </CardTitle>
                  <CardDescription>{farm.location} • {farm.acres} acres</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Price/Token</div>
                      <div className="font-medium">${farm.pricePerToken}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Est. APY</div>
                      <div className="font-medium text-success">12.5%</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Available</div>
                      <div className="font-medium">{(farm.tokenSupply - farm.tokensSold).toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">ASA ID</div>
                      <div className="font-mono text-xs">{farm.asaId.slice(-8)}</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="hero" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleBuyTokens(farm.id)}
                    >
                      Invest
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewFarm(farm.id)}
                    >
                      Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}