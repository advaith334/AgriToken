import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<'farmer' | 'investor'>('investor');
  const [isLogin, setIsLogin] = useState(true);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser } = useAppStore();
  const { toast } = useToast();

  useEffect(() => {
    const roleParam = searchParams.get('role') as 'farmer' | 'investor';
    if (roleParam) {
      setRole(roleParam);
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Demo authentication - just create a user
    const newUser = {
      id: role === 'farmer' ? 'farmer-demo' : 'investor-demo',
      name: role === 'farmer' ? 'Demo Farmer' : 'Demo Investor',
      email,
      role,
      connectedWallet: false
    };

    setUser(newUser);
    
    toast({
      title: `Logged in as ${role}`,
      description: `Welcome to AgriToken, ${newUser.name}!`,
    });

    // Navigate to appropriate dashboard
    navigate(`/${role}`);
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle p-4">
      <Card className="w-full max-w-md shadow-large">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome to AgriToken</CardTitle>
          <CardDescription>
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">I am a</Label>
              <Select value={role} onValueChange={(value: 'farmer' | 'investor') => setRole(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="farmer">Farmer</SelectItem>
                  <SelectItem value="investor">Investor</SelectItem>
                </SelectContent>
              </Select>
            </div>

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

            <Button type="submit" className="w-full" variant="hero">
              {isLogin ? 'Sign In' : 'Sign Up'}
            </Button>
          </form>

          <Button
            variant="ghost"
            className="w-full"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}