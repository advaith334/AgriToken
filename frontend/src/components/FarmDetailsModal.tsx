import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  Coins, 
  Shield, 
  CheckCircle,
  Globe,
  Phone,
  Mail,
  TrendingUp
} from "lucide-react";

interface Farm {
  "Farm ID": string;
  "Farm Name": string;
  "Farm Website": string;
  "Farm Email": string;
  "Farm Phone": string;
  "Farmer Name": string;
  "Farmer Email": string;
  "Wallet Address": string;
  "Farm Size (Acres)": number;
  "Crop Type": string;
  "Farm Location": string;
  "Number of Tokens": number;
  "Tokens Sold": number;
  "Tokens Available": number;
  "Token Name": string;
  "Token Unit": string;
  "Price per Token (USD)": number;
  "ASA ID": string;
  "Est. APY": number;
  "Expected Yield /unit": number;
  "Harvest Date": string;
  "Payout Method": string;
  "Insurance Enabled": boolean;
  "Insurance Type": string;
  "Verification Method": string;
  "Farm Images": string[];
  "Historical Yield": number[];
  "Local Currency": string;
  "Farm Status": string;
  "Created At": string;
  "Last Updated": string;
}

interface FarmDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  farm: Farm | null;
}

export default function FarmDetailsModal({ isOpen, onClose, farm }: FarmDetailsModalProps) {
  if (!farm) return null;

  const soldPercentage = (farm["Tokens Sold"] / farm["Number of Tokens"]) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {farm["Farm Name"]}
          </DialogTitle>
          <DialogDescription>
            Complete farm information and investment details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Farm Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Farm Overview</span>
                <Badge variant={farm["Farm Status"] === "Active" ? "default" : "secondary"}>
                  {farm["Farm Status"]}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Location</div>
                      <div className="font-medium">{farm["Farm Location"]}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Coins className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Crop Type</div>
                      <div className="font-medium">{farm["Crop Type"]}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Farm Size</div>
                      <div className="font-medium">{farm["Farm Size (Acres)"]} acres</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Expected Yield</div>
                      <div className="font-medium">{farm["Expected Yield /unit"]} units</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Harvest Date</div>
                      <div className="font-medium">{farm["Harvest Date"]}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Local Currency</div>
                      <div className="font-medium">{farm["Local Currency"]}</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tokenization Details */}
          <Card>
            <CardHeader>
              <CardTitle>Tokenization Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground">Total Tokens</div>
                    <div className="font-medium">{farm["Number of Tokens"].toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Tokens Sold</div>
                    <div className="font-medium">{farm["Tokens Sold"].toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Tokens Available</div>
                    <div className="font-medium">{farm["Tokens Available"].toLocaleString()}</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground">Price per Token</div>
                    <div className="font-medium">${farm["Price per Token (USD)"]}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Est. APY</div>
                    <div className="font-medium text-green-600">{farm["Est. APY"]}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">ASA ID</div>
                    <div className="font-mono text-sm">{farm["ASA ID"]}</div>
                  </div>
                </div>
              </div>
              
              {/* Token Sale Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Token Sale Progress</span>
                  <span>{soldPercentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${soldPercentage}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Farmer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Farmer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground">Farmer Name</div>
                    <div className="font-medium">{farm["Farmer Name"]}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Email</div>
                      <div className="font-medium">{farm["Farmer Email"]}</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  {farm["Farm Phone"] && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm text-muted-foreground">Phone</div>
                        <div className="font-medium">{farm["Farm Phone"]}</div>
                      </div>
                    </div>
                  )}
                  {farm["Farm Website"] && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm text-muted-foreground">Website</div>
                        <a 
                          href={farm["Farm Website"]} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="font-medium text-blue-600 hover:underline"
                        >
                          {farm["Farm Website"]}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Wallet Address</div>
                <div className="font-mono text-sm bg-gray-100 p-2 rounded">
                  {farm["Wallet Address"]}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial & Legal Details */}
          <Card>
            <CardHeader>
              <CardTitle>Financial & Legal Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground">Payout Method</div>
                    <div className="font-medium">{farm["Payout Method"]}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Insurance</div>
                      <div className="font-medium">
                        {farm["Insurance Enabled"] ? farm["Insurance Type"] : "Not Enabled"}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Verification</div>
                      <div className="font-medium">{farm["Verification Method"]}</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Token Name</div>
                    <div className="font-medium">{farm["Token Name"]} ({farm["Token Unit"]})</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Historical Data */}
          {farm["Historical Yield"] && farm["Historical Yield"].length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Historical Yield Data</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Previous Yields (units)</div>
                  <div className="flex gap-2 flex-wrap">
                    {farm["Historical Yield"].map((yieldValue, index) => (
                      <Badge key={index} variant="outline">
                        {yieldValue}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Farm Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Farm Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Created</span>
                <span className="font-medium">{farm["Created At"]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Last Updated</span>
                <span className="font-medium">{farm["Last Updated"]}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
