import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, DollarSign, User } from "lucide-react";

const features = [
  {
    icon: DollarSign,
    title: "Trustless Payouts",
    description: "Harvest revenue auto-splits pro-rata.",
    details: "Smart contracts ensure transparent, automatic distribution of harvest profits to all token holders based on their ownership percentage."
  },
  {
    icon: Shield,
    title: "Oracle-Backed Insurance",
    description: "Weather triggers payout to farmers.",
    details: "Integrated weather oracles automatically trigger insurance payouts during crop failures, protecting both farmers and investors."
  },
  {
    icon: User,
    title: "User-Owned Identity",
    description: "Portable reputation and transparent histories.",
    details: "Build a verifiable track record of farming success and investment returns that follows you across the platform."
  }
];

export function Features() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Feature Highlights</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Built-in protections and transparent systems ensure trust between farmers and investors
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-medium transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm"
            >
              <CardHeader className="text-center pb-2">
                <div className="mx-auto w-14 h-14 rounded-lg bg-gradient-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-7 w-7 text-accent-foreground" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-3">
                <p className="font-medium text-foreground">{feature.description}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.details}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}