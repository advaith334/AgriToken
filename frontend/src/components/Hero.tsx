import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Coins, Shield, Zap, Leaf } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
export function Hero() {
  const [simulationResult, setSimulationResult] = useState<string | null>(null);
  const {
    toast
  } = useToast();
  const handleSimulation = (type: 'success' | 'partial' | 'fail') => {
    const results = {
      success: {
        payout: 2187.50,
        message: "Full harvest success! 🌾"
      },
      partial: {
        payout: 1093.75,
        message: "Partial harvest due to weather 🌦️"
      },
      fail: {
        payout: 0,
        message: "Crop failure - insurance activated 🛡️"
      }
    };
    const result = results[type];
    setSimulationResult(`${result.message} Payout: $${result.payout.toLocaleString()}`);
    toast({
      title: "Harvest Simulated",
      description: result.message,
      variant: type === 'fail' ? 'destructive' : 'default'
    });

    // Reset after 5 seconds
    setTimeout(() => setSimulationResult(null), 5000);
  };
  return <div className="bg-gradient-subtle">
      <div className="container px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
                Turn small farms into{" "}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  investable
                </span>
                , yield-sharing assets
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                AgriToken uses Algorand to tokenize farm value, automate harvest dividends, 
                and protect farmers with smart-contract insurance.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="hero" size="xl">
                <Link to="/login?role=farmer">I'm a Farmer</Link>
              </Button>
              <Button asChild variant="accent" size="xl">
                <Link to="/login?role=investor">I'm an Investor</Link>
              </Button>
            </div>

            <Button asChild variant="outline" size="lg">
              <Link to="/explore">Explore Farms</Link>
            </Button>

            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="secondary" className="gap-1">
                <Leaf className="h-3 w-3" />
                Built on Algorand
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <Coins className="h-3 w-3" />
                ASAs (Tokenization)
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <Zap className="h-3 w-3" />
                Instant Finality
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <Shield className="h-3 w-3" />
                Low Fees
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <Leaf className="h-3 w-3" />
                Eco-Friendly
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>;
}