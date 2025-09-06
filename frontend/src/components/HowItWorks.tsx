import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins, Users, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: Coins,
    title: "Tokenize",
    description: "Create farm 'shares' as Algorand Standard Assets (ASA).",
    details: "Farmers mint tokens representing fractional ownership of their crop yields. Each token is backed by real agricultural output."
  },
  {
    icon: Users,
    title: "Invest",
    description: "Locals and global investors buy fractional tokens.",
    details: "Anyone can invest in agriculture by purchasing tokens. Start with as little as $10 and support farmers worldwide."
  },
  {
    icon: TrendingUp,
    title: "Earn",
    description: "Smart contracts distribute harvest 'dividends' in stablecoins.",
    details: "When crops are harvested and sold, profits are automatically distributed to token holders proportionally."
  }
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-background">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Three simple steps to connect farmers with global investors through blockchain technology
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="relative group hover:shadow-medium transition-all duration-300">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mb-4 group-hover:shadow-glow transition-all duration-300">
                  <step.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl">{step.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-3">
                <p className="font-medium text-foreground">{step.description}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.details}
                </p>
              </CardContent>
              
              {/* Step connector */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-24 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary to-transparent" />
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}