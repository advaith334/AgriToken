import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tractor, BarChart3, PlusCircle, Eye } from "lucide-react";

export default function FarmerOptions() {
  const navigate = useNavigate();

  const handleAddListing = () => {
    navigate('/farmer/add-listing');
  };

  const handleMonitorFarms = () => {
    navigate('/farmer');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome, Farmer! 🌾
          </h1>
          <p className="text-xl text-muted-foreground">
            Choose how you'd like to get started with AgriToken
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Add a Listing Card */}
          <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer" onClick={handleAddListing}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <PlusCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-800">Add a Listing</CardTitle>
              <CardDescription className="text-base">
                Create a new farm listing to tokenize your agricultural assets
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-3 text-sm text-muted-foreground mb-6">
                <div className="flex items-center justify-center gap-2">
                  <Tractor className="h-4 w-4" />
                  <span>List your farm details</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>Set tokenization parameters</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  <span>Create investment opportunities</span>
                </div>
              </div>
              <Button className="w-full bg-green-600 hover:bg-green-700" size="lg">
                Start Adding Your Farm
              </Button>
            </CardContent>
          </Card>

          {/* Monitor Existing Farms Card */}
          <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer" onClick={handleMonitorFarms}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Eye className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl text-blue-800">Monitor Existing Farms</CardTitle>
              <CardDescription className="text-base">
                View and manage your existing farm listings and investments
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-3 text-sm text-muted-foreground mb-6">
                <div className="flex items-center justify-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>Track farm performance</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>Monitor investments</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Tractor className="h-4 w-4" />
                  <span>Manage existing listings</span>
                </div>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Need help getting started? Check out our{" "}
            <a href="/#how-it-works" className="text-green-600 hover:text-green-700 underline">
              How It Works
            </a>{" "}
            guide.
          </p>
        </div>
      </div>
    </div>
  );
}
