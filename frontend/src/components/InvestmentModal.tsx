import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, Coins, TrendingUp } from "lucide-react";

interface Farm {
  "Farm ID": string;
  "Farm Name": string;
  "Crop Type": string;
  "Farm Location": string;
  "Price per Token (USD)": number;
  "Tokens Available": number;
  "Est. APY": number;
  "ASA ID": string;
}

interface InvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  farm: Farm | null;
  onInvest: (farmId: string, tokens: number, totalCost: number) => void;
  userEmail?: string;
}

export default function InvestmentModal({ isOpen, onClose, farm, onInvest, userEmail }: InvestmentModalProps) {
  const [tokensToBuy, setTokensToBuy] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  if (!farm) return null;

  const pricePerToken = farm["Price per Token (USD)"];
  const availableTokens = farm["Tokens Available"];
  const totalCost = parseFloat(tokensToBuy) * pricePerToken || 0;
  const estimatedAnnualReturn = totalCost * (farm["Est. APY"] / 100);

  const handleInvest = async () => {
    const tokens = parseInt(tokensToBuy);
    
    if (!tokens || tokens <= 0) {
      toast({
        title: 'Invalid amount',
        description: 'Please enter a valid number of tokens to purchase.',
        variant: 'destructive'
      });
      return;
    }

    if (tokens > availableTokens) {
      toast({
        title: 'Insufficient tokens available',
        description: `Only ${availableTokens.toLocaleString()} tokens are available for purchase.`,
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/invest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          farm_id: farm["Farm ID"],
          investor_email: userEmail || 'demo@investor.com',
          tokens_to_buy: tokens,
          total_cost: totalCost
        }),
      });

      if (response.ok) {
        const result = await response.json();
        
        onInvest(farm["Farm ID"], tokens, totalCost);
        
        toast({
          title: 'Investment successful!',
          description: `You have purchased ${tokens.toLocaleString()} tokens in ${farm["Farm Name"]}.`,
        });

        // Reset form and close modal
        setTokensToBuy("");
        onClose();
      } else {
        const error = await response.json();
        toast({
          title: 'Investment failed',
          description: error.detail || 'An error occurred while processing your investment.',
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

  const handleMaxTokens = () => {
    setTokensToBuy(availableTokens.toString());
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            Invest in {farm["Farm Name"]}
          </DialogTitle>
          <DialogDescription>
            Purchase tokens to invest in this agricultural project
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Farm Summary */}
          <Card>
            <CardContent className="pt-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Farm</span>
                  <span className="font-medium">{farm["Farm Name"]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Location</span>
                  <span className="font-medium">{farm["Farm Location"]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Crop</span>
                  <span className="font-medium">{farm["Crop Type"]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Price per Token</span>
                  <span className="font-medium">${pricePerToken}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Available Tokens</span>
                  <span className="font-medium">{availableTokens.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Est. APY</span>
                  <span className="font-medium text-green-600">{farm["Est. APY"]}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Investment Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tokens">Number of Tokens to Purchase</Label>
              <div className="flex gap-2">
                <Input
                  id="tokens"
                  type="number"
                  placeholder="Enter number of tokens"
                  value={tokensToBuy}
                  onChange={(e) => setTokensToBuy(e.target.value)}
                  min="1"
                  max={availableTokens}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleMaxTokens}
                  className="whitespace-nowrap"
                >
                  Max
                </Button>
              </div>
            </div>

            {/* Investment Summary */}
            {tokensToBuy && (
              <Card>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Tokens</span>
                      <span className="font-medium">{parseInt(tokensToBuy).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Price per Token</span>
                      <span className="font-medium">${pricePerToken}</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Total Investment</span>
                        <span className="font-bold text-lg">${totalCost.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Est. Annual Return</span>
                      <span className="font-medium text-green-600">${estimatedAnnualReturn.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleInvest}
              disabled={!tokensToBuy || isLoading}
              className="flex-1 gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Processing...
                </>
              ) : (
                <>
                  <DollarSign className="h-4 w-4" />
                  Invest ${totalCost.toLocaleString()}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
