import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Wallet, User, LogOut } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
export function Navbar() {
  const location = useLocation();
  const {
    user,
    setUser,
    toggleWallet
  } = useAppStore();
  const {
    toast
  } = useToast();
  const handleRoleSwitch = (newRole: 'farmer' | 'investor') => {
    if (user) {
      setUser({
        ...user,
        role: newRole
      });
      // Navigate to appropriate dashboard if logged in
      if (location.pathname.includes('/farmer') || location.pathname.includes('/investor')) {
        window.location.href = `/${newRole}`;
      }
      toast({
        title: "Role switched",
        description: `Now viewing as ${newRole}`
      });
    } else {
      // Redirect to login with role pre-selected
      window.location.href = `/login?role=${newRole}`;
    }
  };
  const handleWalletToggle = () => {
    toggleWallet();
    toast({
      title: user?.connectedWallet ? "Wallet disconnected" : "Wallet connected",
      description: user?.connectedWallet ? "Pera Wallet disconnected" : "Connected to Pera Wallet: ALGO_TEST_...1234"
    });
  };
  const handleLogout = () => {
    setUser(null);
    window.location.href = "/";
    toast({
      title: "Logged out",
      description: "See you next time!"
    });
  };
  return <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">A</span>
            </div>
            <span className="font-bold text-xl text-foreground">AgriToken</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <Link to="/#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              How it Works
            </Link>
            <Link to="/explore" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Explore Farms
            </Link>
            {!user}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* User Menu */}
          {user ? <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div> : <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild variant="default" size="sm">
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>}
        </div>
      </div>
    </nav>;
}