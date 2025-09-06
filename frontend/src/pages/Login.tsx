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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
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
    
    if (!isLogin && password !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'Please ensure the two passwords are the same before continuing.',
      });
      return;
    }

    // Demo authentication / simple user creation
    const newUser = {
      id: role === 'farmer' ? 'farmer-demo' : 'investor-demo',
      name: isLogin ? (role === 'farmer' ? 'Demo Farmer' : 'Demo Investor') : `${firstName} ${lastName}`,
      email,
      role,
      connectedWallet: false,
      walletAddress: !isLogin ? walletAddress : undefined
    };

    setUser(newUser);
    
    toast({
      title: isLogin ? `Logged in as ${role}` : 'Account created',
      description: `Welcome to AgriToken, ${newUser.name}!`,
    });

    // Navigate to appropriate dashboard or options
    if (role === 'farmer') {
      navigate('/farmer/options');
    } else {
      navigate(`/${role}`);
    }
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

    if (demoRole === 'farmer') {
      navigate('/farmer/options');
    } else {
      navigate(`/${demoRole}`);
    }
  };

  const isLoginValid = email.length > 0 && password.length > 0;
  const isSignupValid = (
    email.length > 0 &&
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword &&
    firstName.length > 0 &&
    lastName.length > 0 &&
    walletAddress.length > 0
  );

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
            {!isLogin && (
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
            )}

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

            {!isLogin && (
              <>
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Enter your first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Enter your last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="wallet">Pera wallet public address</Label>
                <Input
                  id="wallet"
                  type="text"
                  placeholder="Enter your Pera wallet address"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Don't have a Pera Wallet Account?{" "}
                  <a 
                    href="https://perawallet.app/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 underline"
                  >
                    Click Here
                  </a>
                </p>
              </div>
              </>
            )}

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

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                {confirmPassword.length > 0 && password !== confirmPassword && (
                  <div className="text-red-500 text-sm">Passwords do not match</div>
                )}
              </div>
            )}

            <Button type="submit" className="w-full" variant="hero" disabled={isLogin ? !isLoginValid : !isSignupValid}>
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