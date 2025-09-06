import { Leaf, Zap, DollarSign, Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">A</span>
            </div>
            <span className="font-semibold text-foreground">AgriToken</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Leaf className="h-4 w-4 text-primary" />
              <span>Built on Algorand</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="h-4 w-4 text-accent" />
              <span>Instant finality</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4 text-success" />
              <span>Low fees</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield className="h-4 w-4 text-primary" />
              <span>Carbon neutral</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}