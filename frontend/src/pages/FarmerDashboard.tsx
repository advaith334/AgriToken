import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatCard } from "@/components/StatCard";
import { 
  MapPin, 
  Coins, 
  DollarSign, 
  Calendar,
  Plus,
  Zap,
  CloudRain,
  Sun
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const yieldData = [
  { season: '2023-1', yield: 42 },
  { season: '2023-2', yield: 48 },
  { season: '2024-1', yield: 45 },
  { season: '2024-2', yield: 52 },
  { season: '2024-3', yield: 47 },
  { season: '2024-4', yield: 50 },
];

export default function FarmerDashboard() {
  const { user, farms, distributions, addDistribution } = useAppStore();
  const { toast } = useToast();
  const [isSimulating, setIsSimulating] = useState(false);

  const userFarms = farms.filter(farm => farm.farmerId === user?.id);
  const totalAcres = userFarms.reduce((sum, farm) => sum + farm.acres, 0);
  const totalTokensSold = userFarms.reduce((sum, farm) => sum + farm.tokensSold, 0);
  const lastRevenue = userFarms.reduce((sum, farm) => sum + (farm.lastRevenuePerAcre * farm.acres), 0);
  const nextExpectedPayout = userFarms.reduce((sum, farm) => sum + (farm.expectedRevenuePerAcre * farm.acres * 0.8), 0); // 80% after fees

  const handleSimulateEvent = async (eventType: 'drought' | 'flood' | 'normal') => {
    setIsSimulating(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const eventResults = {
      drought: { multiplier: 0.3, message: "Drought simulation triggered insurance payout" },
      flood: { multiplier: 0.1, message: "Flood simulation - emergency insurance activated" },
      normal: { multiplier: 1.0, message: "Normal harvest simulation completed successfully" }
    };

    const result = eventResults[eventType];
    const grossRevenue = nextExpectedPayout * result.multiplier;
    const fees = grossRevenue * 0.05; // 5% fees
    const netDistribution = grossRevenue - fees;

    // Add new distribution
    addDistribution({
      farmId: userFarms[0]?.id || 'farm-1',
      type: eventType === 'normal' ? 'harvest' : 'insurance',
      date: new Date().toISOString().split('T')[0],
      gross: grossRevenue,
      fees,
      net: netDistribution,
      recipientsCount: Math.floor(totalTokensSold / 100), // Estimate token holders
      status: 'completed'
    });

    toast({
      title: result.message,
      description: `Net distribution: $${netDistribution.toLocaleString()}`,
      variant: eventType === 'normal' ? 'default' : 'destructive',
    });

    setIsSimulating(false);
  };

  if (!user) {
    return <div>Please log in to access the farmer dashboard.</div>;
  }

  return (
    <div className="container py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Farmer Dashboard</h1>
        <p className="text-muted-foreground">Manage your tokenized farms and harvest distributions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Acres Tokenized"
          value={totalAcres}
          icon={MapPin}
          subtitle="across all farms"
        />
        <StatCard
          title="Tokens Sold"
          value={totalTokensSold}
          icon={Coins}
          subtitle={`of ${userFarms.reduce((sum, farm) => sum + farm.tokenSupply, 0)} total`}
        />
        <StatCard
          title="Last Harvest Revenue"
          value={lastRevenue}
          icon={DollarSign}
          trend={{ value: 8.2, isPositive: true }}
        />
        <StatCard
          title="Next Expected Payout"
          value={nextExpectedPayout}
          icon={Calendar}
          subtitle="Est. Sept 15-30"
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="farms">My Farms</TabsTrigger>
          <TabsTrigger value="crops">Crops</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Yield per Acre (Last 6 Seasons)</CardTitle>
                <CardDescription>Bushels per acre across all farms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={yieldData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="season" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="yield" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Simulate Weather Events</CardTitle>
                <CardDescription>Test oracle triggers and insurance payouts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleSimulateEvent('drought')}
                    disabled={isSimulating}
                    className="gap-1"
                  >
                    <Sun className="h-3 w-3" />
                    Drought
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleSimulateEvent('flood')}
                    disabled={isSimulating}
                    className="gap-1"
                  >
                    <CloudRain className="h-3 w-3" />
                    Flood
                  </Button>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleSimulateEvent('normal')}
                    disabled={isSimulating}
                    className="gap-1"
                  >
                    <Zap className="h-3 w-3" />
                    Normal
                  </Button>
                </div>
                
                {isSimulating && (
                  <div className="text-center p-4 text-muted-foreground">
                    <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                    Processing oracle data...
                  </div>
                )}

                <div className="space-y-2 pt-4 border-t text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expected Gross:</span>
                    <span>${nextExpectedPayout.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Platform Fee (5%):</span>
                    <span>${(nextExpectedPayout * 0.05).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Net to Distribute:</span>
                    <span>${(nextExpectedPayout * 0.95).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Payouts</CardTitle>
              <CardDescription>Latest distributions to token holders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {distributions.slice(-3).reverse().map((dist) => (
                  <div key={dist.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{dist.type === 'harvest' ? '🌾 Harvest' : '🛡️ Insurance'}</div>
                      <div className="text-sm text-muted-foreground">{dist.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${dist.net.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">{dist.recipientsCount} recipients</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="farms" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">My Farms</h2>
            <Button variant="hero" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Farm
            </Button>
          </div>

          <div className="grid gap-6">
            {userFarms.map((farm) => (
              <Card key={farm.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{farm.name}</CardTitle>
                      <CardDescription>{farm.location} • {farm.acres} acres • {farm.crop}</CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">ASA ID</div>
                      <div className="font-mono text-sm">{farm.asaId}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Token Supply</div>
                      <div className="font-medium">{farm.tokenSupply.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Tokens Sold</div>
                      <div className="font-medium">{farm.tokensSold.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Price/Token</div>
                      <div className="font-medium">${farm.pricePerToken}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Status</div>
                      <div className="font-medium capitalize">{farm.status}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="crops">
          <Card>
            <CardHeader>
              <CardTitle>Crop Details</CardTitle>
              <CardDescription>Yield and revenue information by farm</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Farm</th>
                      <th className="text-left p-2">Crop Type</th>
                      <th className="text-right p-2">Last Yield/Acre</th>
                      <th className="text-right p-2">Expected Yield/Acre</th>
                      <th className="text-right p-2">Last Revenue/Acre</th>
                      <th className="text-right p-2">Expected Revenue/Acre</th>
                      <th className="text-left p-2">Harvest Window</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userFarms.map((farm) => (
                      <tr key={farm.id} className="border-b">
                        <td className="p-2 font-medium">{farm.name}</td>
                        <td className="p-2">{farm.crop}</td>
                        <td className="p-2 text-right">{farm.lastYieldPerAcre}</td>
                        <td className="p-2 text-right">{farm.expectedYieldPerAcre}</td>
                        <td className="p-2 text-right">${farm.lastRevenuePerAcre}</td>
                        <td className="p-2 text-right">${farm.expectedRevenuePerAcre}</td>
                        <td className="p-2">{farm.harvestWindow}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Payout History</CardTitle>
                  <CardDescription>All harvest and insurance distributions</CardDescription>
                </div>
                <Button variant="hero" className="gap-2">
                  <Zap className="h-4 w-4" />
                  Trigger Harvest Payout
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Date</th>
                      <th className="text-left p-2">Event</th>
                      <th className="text-right p-2">Gross Revenue</th>
                      <th className="text-right p-2">Fees</th>
                      <th className="text-right p-2">Net Distributed</th>
                      <th className="text-right p-2">Recipients</th>
                      <th className="text-left p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {distributions.map((dist) => (
                      <tr key={dist.id} className="border-b">
                        <td className="p-2">{dist.date}</td>
                        <td className="p-2 capitalize">{dist.type}</td>
                        <td className="p-2 text-right">${dist.gross.toLocaleString()}</td>
                        <td className="p-2 text-right">${dist.fees.toLocaleString()}</td>
                        <td className="p-2 text-right font-medium">${dist.net.toLocaleString()}</td>
                        <td className="p-2 text-right">{dist.recipientsCount}</td>
                        <td className="p-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            dist.status === 'completed' 
                              ? 'bg-success/10 text-success' 
                              : 'bg-warning/10 text-warning'
                          }`}>
                            {dist.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}