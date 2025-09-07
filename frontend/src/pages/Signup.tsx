import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  walletAddress: string;
  role: 'Farmer' | 'Investor';
}

export default function Signup() {
  const [formData, setFormData] = useState<SignupData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    walletAddress: "",
    role: 'Farmer'
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (field: keyof SignupData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'Please ensure the two passwords are the same before continuing.',
        variant: 'destructive'
      });
      return;
    }

    if (!isFormValid()) {
      toast({
        title: 'Please fill in all fields',
        description: 'All fields are required to create an account.',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: 'Account created successfully!',
          description: `Welcome to AgriToken, ${formData.firstName} ${formData.lastName}!`,
        });
        
        // Navigate to login page
        navigate('/login');
      } else {
        const error = await response.json();
        toast({
          title: 'Signup failed',
          description: error.message || 'An error occurred while creating your account.',
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

  const isFormValid = () => {
    return (
      formData.firstName.length > 0 &&
      formData.lastName.length > 0 &&
      formData.email.length > 0 &&
      formData.password.length > 0 &&
      formData.walletAddress.length > 0 &&
      confirmPassword.length > 0 &&
      formData.password === confirmPassword
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle p-4">
      <Card className="w-full max-w-md shadow-large">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>
            Join AgriToken and start your journey
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">I am a</Label>
              <Select 
                value={formData.role} 
                onValueChange={(value: 'Farmer' | 'Investor') => handleInputChange('role', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Farmer">Farmer</SelectItem>
                  <SelectItem value="Investor">Investor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="wallet">Pera wallet public address</Label>
              <Input
                id="wallet"
                type="text"
                placeholder="Enter your Pera wallet address"
                value={formData.walletAddress}
                onChange={(e) => handleInputChange('walletAddress', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
              />
            </div>

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
              {confirmPassword.length > 0 && formData.password !== confirmPassword && (
                <div className="text-red-500 text-sm">Passwords do not match</div>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              variant="hero" 
              disabled={!isFormValid() || isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <Button
            variant="ghost"
            className="w-full"
            onClick={() => navigate('/login')}
          >
            Already have an account? Sign in
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
