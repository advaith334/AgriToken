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
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { setUser } = useAppStore();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: 'Please fill in all fields',
        description: 'Email and password are required.',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const result = await response.json();
        const userData = result.user;
        
        setUser(userData);
        
        toast({
          title: 'Logged in successfully',
          description: `Welcome to AgriToken, ${userData.name}!`,
        });

        // Navigate to appropriate dashboard based on user role
        if (userData.role === 'farmer') {
          navigate('/farmer');
        } else {
          navigate('/investor');
        }
      } else {
        const error = await response.json();
        toast({
          title: 'Login failed',
          description: error.detail || 'Invalid email or password.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Network error',
        description: 'Unable to connect to the server. Please make sure the backend server is running.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
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

            <Button type="submit" className="w-full" variant="hero" disabled={!isLoginValid || isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>


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