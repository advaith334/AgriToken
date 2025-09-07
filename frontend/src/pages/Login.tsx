import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const navigate = useNavigate();
  const { setUser } = useAppStore();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Demo authentication - in a real app, this would validate against the backend
    const newUser = {
      id: 'demo-user',
      name: 'Demo User',
      email,
      role: 'investor' as const,
      connectedWallet: false,
    };

    setUser(newUser);
    
    toast({
      title: 'Logged in successfully',
      description: `Welcome to AgriToken, ${newUser.name}!`,
    });

    // Navigate to appropriate dashboard
    navigate('/investor');
  };

  const handleDemoLogin = (demoRole: 'farmer' | 'investor') => {
    const users = {
      farmer: {
        id: 'farmer-demo',
        name: 'John Kimani',
        email: 'john@greenvalley.farm',
        role: 'farmer' as const,
        connectedWallet: true,
        walletAddress: 'ALGO_FARM_...8901'
      },
      investor: {
        id: 'investor-demo',
        name: 'Sarah Chen',
        email: 'sarah@email.com',
        role: 'investor' as const,
        connectedWallet: true,
        walletAddress: 'ALGO_INV_...2345'
      }
    };

    setUser(users[demoRole]);
    
    toast({
      title: `Demo login successful`,
      description: `Logged in as ${users[demoRole].name}`,
    });

    navigate(`/${demoRole}`);
  };

  const isLoginValid = email.length > 0 && password.length > 0;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle p-4">
      <Card className="w-full max-w-md shadow-large">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome to AgriToken</CardTitle>
          <CardDescription>
            Sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" variant="hero" disabled={!isLoginValid}>
              Sign In
            </Button>
          </form>

          <div className="space-y-2">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or try demo accounts
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDemoLogin('farmer')}
                className="text-xs"
              >
                Demo Farmer
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDemoLogin('investor')}
                className="text-xs"
              >
                Demo Investor
              </Button>
            </div>
          </div>

          <Button
            variant="ghost"
            className="w-full"
            onClick={() => navigate('/signup')}
          >
            Don't have an account? Sign up
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}