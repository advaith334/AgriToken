import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle p-4">
      <Card className="w-full max-w-md text-center shadow-large">
        <CardHeader>
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mb-4">
            <span className="text-2xl">🌾</span>
          </div>
          <CardTitle className="text-4xl font-bold mb-2">404</CardTitle>
          <p className="text-xl text-muted-foreground">Oops! Farm not found</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            The page you're looking for seems to have been harvested already.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button asChild variant="hero" className="flex-1">
              <a href="/" className="gap-2">
                <Home className="h-4 w-4" />
                Return Home
              </a>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
              className="flex-1 gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
