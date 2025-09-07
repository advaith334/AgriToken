import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, Coins, TrendingUp } from "lucide-react";
import { FarmData } from "@/types/farm";
import MnemonicModal from "./MnemonicModal";

interface InvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  farm: FarmData | null;
  onInvest: (farm: FarmData, tokens: number, totalCost: number) => void;
  userWalletAddress?: string;
  userEmail?: string;
}

export default function InvestmentModal({ isOpen, onClose, farm, onInvest, userWalletAddress, userEmail }: InvestmentModalProps) {
  const [tokensToBuy, setTokensToBuy] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMnemonicModalOpen, setIsMnemonicModalOpen] = useState(false);
  const [mnemonicSet, setMnemonicSet] = useState(false);
  const { toast } = useToast();

  if (!farm) return null;

  const pricePerToken = farm["Price per Token (USD)"];
  const availableTokens = farm["Number of Tokens"];
  const totalCost = parseFloat(tokensToBuy) * pricePerToken || 0;
  const estimatedAnnualReturn = totalCost * 0.1; // Assuming 10% APY for now

  const handleMnemonicSubmit = async (mnemonic: string): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:5000/set_mnemonic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mnemonic }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setMnemonicSet(true);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error setting mnemonic:', error);
      return false;
    }
  };

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

    if (!userWalletAddress) {
      toast({
        title: 'Wallet address required',
        description: 'Please connect your wallet to make an investment.',
        variant: 'destructive'
      });
      return;
    }

    if (!farm["Asset ID"]) {
      toast({
        title: 'Asset not found',
        description: 'This farm has not been tokenized yet.',
        variant: 'destructive'
      });
      return;
    }

    // Check if mnemonic is set, if not, prompt for it
    if (!mnemonicSet) {
      setIsMnemonicModalOpen(true);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/transfer_assets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          asset_id: farm["Asset ID"],
          sender_address: farm["Wallet Address"], // Farmer's wallet
          receiver_address: userWalletAddress, // Investor's wallet
          amount: tokens
        }),
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result.success) {
          // Save investor holding
          try {
            const holdingResponse = await fetch('http://localhost:5000/investor-holdings', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                investor_email: userEmail || userWalletAddress, // Use email if available, fallback to wallet address
                farm_id: farm["Farm ID"],
                asset_id: farm["Asset ID"],
                tokens_owned: tokens,
                cost_basis: totalCost
              }),
            });

            if (holdingResponse.ok) {
              console.log('Investor holding saved successfully');
            } else {
              console.error('Failed to save investor holding');
            }
          } catch (error) {
            console.error('Error saving investor holding:', error);
          }

          onInvest(farm, tokens, totalCost);
          
          toast({
            title: 'Investment successful!',
            description: `You have purchased ${tokens.toLocaleString()} tokens in ${farm["Farm Name"]}. Transaction ID: ${result.transaction_id}`,
          });

          // Reset form and close modal
          setTokensToBuy("");
          onClose();
        } else {
          toast({
            title: 'Investment failed',
            description: result.error || 'An error occurred while processing your investment.',
            variant: 'destructive'
          });
        }
      } else {
        const error = await response.json();
        toast({
          title: 'Investment failed',
          description: error.error || 'An error occurred while processing your investment.',
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
                  <span className="font-medium text-green-600">10%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Asset ID</span>
                  <span className="font-medium text-xs">{farm["Asset ID"] || "Not tokenized"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Wallet Status</span>
                  <span className={`font-medium text-xs ${mnemonicSet ? 'text-green-600' : 'text-orange-600'}`}>
                    {mnemonicSet ? 'Connected' : 'Not Connected'}
                  </span>
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
                  {mnemonicSet ? `Invest $${totalCost.toLocaleString()}` : 'Connect Wallet & Invest'}
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Mnemonic Modal */}
        <MnemonicModal
          isOpen={isMnemonicModalOpen}
          onClose={() => setIsMnemonicModalOpen(false)}
          onMnemonicSubmit={handleMnemonicSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
