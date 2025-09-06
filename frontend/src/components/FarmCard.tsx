import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Globe, Calendar, DollarSign, Shield, CheckCircle } from "lucide-react";

interface FarmData {
  "Farm Name": string;
  "Farm Website": string;
  "Farm Email": string;
  "Farm Phone": string;
  "Farmer Name": string;
  "Wallet Address": string;
  "Farm Size (Acres)": number;
  "Crop Type": string;
  "Farm Location": string;
  "Number of Tokens": number;
  "Token Name": string;
  "Token Unit": string;
  "Price per Token (USD)": number;
  "Expected Yield /unit": number;
  "Harvest Date": string;
  "Payout Method": string;
  "Verification Method": string;
  "Farm Images": string[];
  "Historical Yield": number[];
  "Local Currency": string;
}

interface FarmCardProps {
  farm: FarmData;
  onInvest?: (farm: FarmData) => void;
}

export function FarmCard({ farm, onInvest }: FarmCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateAverageYield = (yields: number[]) => {
    return Math.round(yields.reduce((sum, yield_) => sum + yield_, 0) / yields.length);
  };

  return (
    <Card className="w-full max-w-md mx-auto hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-green-800 mb-1">
              {farm["Farm Name"]}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              by {farm["Farmer Name"]}
            </p>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            {farm["Crop Type"]}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Farm Image */}
        <div className="aspect-video bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
          {farm["Farm Images"] && farm["Farm Images"].length > 0 ? (
            <img 
              src={farm["Farm Images"][0]} 
              alt={farm["Farm Name"]}
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`text-center text-green-600 ${farm["Farm Images"] && farm["Farm Images"].length > 0 ? 'hidden' : ''}`}>
            <div className="text-4xl mb-2">🌾</div>
            <p className="text-sm font-medium">Farm Image</p>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{farm["Farm Location"]}</span>
        </div>

        {/* Farm Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Farm Size:</span>
            <p className="text-muted-foreground">{farm["Farm Size (Acres)"]} acres</p>
          </div>
          <div>
            <span className="font-medium">Tokens Available:</span>
            <p className="text-muted-foreground">{farm["Number of Tokens"]}</p>
          </div>
        </div>

        {/* Token Information */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-sm">Token: {farm["Token Name"]}</span>
            <Badge variant="outline" className="text-xs">
              {farm["Token Unit"]}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="font-semibold text-green-600">
              ${farm["Price per Token (USD)"]} per token
            </span>
          </div>
        </div>

        {/* Expected Yield */}
        <div className="text-sm">
          <span className="font-medium">Expected Yield:</span>
          <p className="text-muted-foreground">
            {farm["Expected Yield /unit"].toLocaleString()} units
          </p>
        </div>

        {/* Historical Performance */}
        <div className="text-sm">
          <span className="font-medium">Avg Historical Yield:</span>
          <p className="text-muted-foreground">
            {calculateAverageYield(farm["Historical Yield"]).toLocaleString()} units
          </p>
        </div>

        {/* Harvest Date */}
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-orange-600" />
          <span className="font-medium">Harvest:</span>
          <span className="text-muted-foreground">{formatDate(farm["Harvest Date"])}</span>
        </div>

        {/* Contact Information */}
        <div className="space-y-1 text-sm">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{farm["Farm Phone"]}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{farm["Farm Email"]}</span>
          </div>
          {farm["Farm Website"] && (
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <a 
                href={farm["Farm Website"]} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                Visit Website
              </a>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-4">
        <Button 
          className="w-full bg-green-600 hover:bg-green-700" 
          onClick={() => onInvest?.(farm)}
        >
          Invest in Farm
        </Button>
      </CardFooter>
    </Card>
  );
}
