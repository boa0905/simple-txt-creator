import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Coins, 
  TrendingUp, 
  TrendingDown, 
  ShoppingCart, 
  Settings,
  AlertTriangle,
  DollarSign
} from "lucide-react";

const Economy = () => {
  const currencyStats = [
    { name: "Gold", total: "2.4M", circulation: "1.8M", inflation: 2.3, trend: "up" },
    { name: "Gems", total: "45K", circulation: "32K", inflation: -0.5, trend: "down" },
    { name: "Tokens", total: "890K", circulation: "650K", inflation: 1.8, trend: "up" }
  ];

  const marketItems = [
    { name: "Legendary Sword", price: 15000, demand: "high", stock: 12 },
    { name: "Health Potion", price: 50, demand: "normal", stock: 999 },
    { name: "Magic Scroll", price: 250, demand: "low", stock: 45 },
    { name: "Dragon Scale", price: 8500, demand: "very high", stock: 3 }
  ];

  const dropRates = [
    { category: "Common Items", rate: 85, recommended: 85 },
    { category: "Rare Items", rate: 12, recommended: 12 },
    { category: "Epic Items", rate: 2.5, recommended: 2.5 },
    { category: "Legendary Items", rate: 0.5, recommended: 0.5 }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Economy Control</h1>
        <p className="text-muted-foreground">Monitor and manage the game economy and market systems</p>
      </div>

      {/* Currency Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        {currencyStats.map((currency, index) => (
          <Card key={index} className="card-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium">{currency.name} Supply</CardTitle>
              <Coins className="h-5 w-5 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currency.total}</div>
              <div className="flex items-center gap-2 mt-2">
                {currency.trend === "up" ? (
                  <TrendingUp className="w-4 h-4 text-destructive" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-success" />
                )}
                <span className={currency.trend === "up" ? "text-destructive" : "text-success"}>
                  {currency.inflation > 0 ? "+" : ""}{currency.inflation}% inflation
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {currency.circulation} in circulation
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Market Management */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Item Shop Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {marketItems.map((item, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-4 rounded-lg border border-border"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Stock: {item.stock}</span>
                      <Badge 
                        variant={
                          item.demand === "very high" ? "destructive" :
                          item.demand === "high" ? "default" :
                          item.demand === "normal" ? "secondary" : "outline"
                        }
                      >
                        {item.demand} demand
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold flex items-center gap-1">
                      <Coins className="w-4 h-4 text-warning" />
                      {item.price.toLocaleString()}
                    </p>
                  </div>
                  <Input 
                    type="number" 
                    value={item.price} 
                    className="w-24 text-center"
                  />
                  <Button variant="outline" size="sm">
                    Update
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Drop Rate Management */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Drop Rate Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dropRates.map((drop, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-4 rounded-lg border border-border"
              >
                <div>
                  <p className="font-medium">{drop.category}</p>
                  <p className="text-sm text-muted-foreground">
                    Recommended: {drop.recommended}%
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  {drop.rate !== drop.recommended && (
                    <AlertTriangle className="w-4 h-4 text-warning" />
                  )}
                  <Input 
                    type="number" 
                    value={drop.rate} 
                    step="0.1"
                    className="w-20 text-center"
                  />
                  <span className="text-sm text-muted-foreground">%</span>
                  <Button variant="outline" size="sm">
                    Apply
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Economic Tools */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle>Economic Management Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-4">
            <button className="p-4 rounded-lg border border-border hover:bg-muted/50 smooth-transition text-left">
              <DollarSign className="w-6 h-6 text-success mb-2" />
              <p className="font-medium text-sm">Currency Injection</p>
              <p className="text-xs text-muted-foreground">Add currency to economy</p>
            </button>
            
            <button className="p-4 rounded-lg border border-border hover:bg-muted/50 smooth-transition text-left">
              <TrendingDown className="w-6 h-6 text-destructive mb-2" />
              <p className="font-medium text-sm">Currency Sink</p>
              <p className="text-xs text-muted-foreground">Remove excess currency</p>
            </button>
            
            <button className="p-4 rounded-lg border border-border hover:bg-muted/50 smooth-transition text-left">
              <ShoppingCart className="w-6 h-6 text-primary mb-2" />
              <p className="font-medium text-sm">Market Reset</p>
              <p className="text-xs text-muted-foreground">Reset market prices</p>
            </button>
            
            <button className="p-4 rounded-lg border border-border hover:bg-muted/50 smooth-transition text-left">
              <TrendingUp className="w-6 h-6 text-warning mb-2" />
              <p className="font-medium text-sm">Economy Report</p>
              <p className="text-xs text-muted-foreground">Generate detailed analysis</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Economy;