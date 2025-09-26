import { StatsCard } from "@/components/ui/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { apiService } from "@/services/api";
import { 
  Users, 
  Shield, 
  Server, 
  Activity,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  const { data: onlineData, isLoading: onlineLoading } = useQuery({
    queryKey: ['onlinePlayers'],
    queryFn: () => apiService.getOnlinePlayers(accessToken),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const { data: registeredData, isLoading: registeredLoading } = useQuery({
    queryKey: ['registeredPlayers'],
    queryFn: () => apiService.getRegisteredPlayers(accessToken),
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  const { data: serverStats } = useQuery({
    queryKey: ['serverStats'],
    queryFn: () => apiService.getServerStats(accessToken),
    refetchInterval: 3000, // Refetch every 3 seconds
  });

  const { data: uptimeData, isLoading: uptimeLoading } = useQuery({
    queryKey: ['serverUptime'],
    queryFn: () => apiService.getServerUptime(accessToken),
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  const quickActions = [
    {
      title: "Manage Players",
      description: "Search and moderate",
      icon: Users,
      route: "/players",
      color: "text-primary"
    },
    {
      title: "Guild Tools",
      description: "Manage guilds",
      icon: Shield,
      route: "/guilds",
      color: "text-primary"
    },
    {
      title: "Economy",
      description: "Monitor markets",
      icon: Activity,
      route: "/economy",
      color: "text-primary"
    },
    {
      title: "Events",
      description: "Schedule activities",
      icon: TrendingUp,
      route: "/events",
      color: "text-primary"
    }
  ];

  const handleQuickAction = (route: string) => {
    navigate(route);
  };

  const serverStatus = [
    { name: "Server 1 - Main", status: "online", players: onlineData?.onlinePlayers ?? 0, ping: serverStats?.ping ? `${serverStats.ping}ms` : "N/A" },
    { name: "Server 2 - PvP", status: "unavailable", players: 0, ping: "N/A" },
    { name: "Server 3 - RP", status: "unavailable", players: 0, ping: "N/A" },
    { name: "Server 4 - Test", status: "maintenance", players: 0, ping: "N/A" },
  ];

  const recentActions = [
    { action: "Player banned", user: "admin_john", target: "PlayerX123", time: "2 min ago" },
    { action: "Currency adjusted", user: "gm_sarah", target: "PlayerY456", time: "15 min ago" },
    { action: "Guild disbanded", user: "admin_mike", target: "ChaosGuild", time: "1 hour ago" },
    { action: "Event scheduled", user: "gm_lisa", target: "Double XP Weekend", time: "2 hours ago" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your MMORPG server status and activity</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {onlineLoading ? (
          <Card className="card-shadow smooth-transition">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-5 rounded" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ) : (
          <StatsCard
            title="Online Players"
            value={onlineData?.onlinePlayers?.toLocaleString() ?? "0"}
            description="Currently active"
            icon={Users}
          />
        )}
        
        {registeredLoading ? (
          <Card className="card-shadow smooth-transition">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-5 rounded" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ) : (
          <StatsCard
            title="Total Accounts"
            value={registeredData?.registeredPlayers?.toLocaleString() ?? "0"}
            description="All time registrations"
            icon={Shield}
          />
        )}
        
        {uptimeLoading ? (
          <Card className="card-shadow smooth-transition">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-5 rounded" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ) : (
          <StatsCard
            title="Server Uptime"
            value={uptimeData?.uptime?.current7dRatePercent ? `${uptimeData.uptime.current7dRatePercent.toFixed(1)}%` : "N/A"}
            description="Last 7 days"
            icon={Server}
            trend={(() => {
              const growth = uptimeData?.uptime?.growthRatePercent;
              if (growth === null || growth === undefined) {
                return { value: Infinity, isPositive: true };
              }
              return { value: growth, isPositive: growth >= 0 };
            })()}
          />
        )}
        <StatsCard
          title="Active Guilds"
          value="184"
          description="With recent activity"
          icon={Activity}
          trend={{ value: -2.1, isPositive: false }}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Server Status */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="w-5 h-5" />
              Server Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {serverStatus.map((server, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    {server.status === "online" ? (
                      <CheckCircle className="w-4 h-4 text-primary" />
                    ) : server.status === "maintenance" ? (
                      <AlertCircle className="w-4 h-4 text-warning" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-destructive" />
                    )}
                    <div>
                      <p className="font-medium text-sm">{server.name}</p>
                      <p className="text-xs text-muted-foreground">{server.ping}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={
                      server.status === "online" ? "default" : 
                      server.status === "unavailable" ? "destructive" : "secondary"
                    }>
                      {server.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{server.players} players</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Admin Actions */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Recent Admin Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActions.map((action, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium text-sm">{action.action}</p>
                    <p className="text-xs text-muted-foreground">
                      by {action.user} → {action.target}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {action.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-4">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action.route)}
                  className="p-4 rounded-lg border border-border hover:bg-muted/50 smooth-transition text-left group hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
                >
                  <IconComponent className={`w-6 h-6 ${action.color} mb-2 group-hover:scale-110 transition-transform`} />
                  <p className="font-medium text-sm group-hover:text-primary transition-colors">{action.title}</p>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;