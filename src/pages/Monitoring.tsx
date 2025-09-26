import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { apiService, PlayerAnalyticsResponse } from "@/services/api";
import {
  Activity,
  Users,
  Server,
  TrendingUp,
  TrendingDown,
  Cpu,
  HardDrive,
  Wifi,
  AlertTriangle,
  Loader2
} from "lucide-react";

const enum SERVERSTATUS{
  healthy = "healthy",
  warning = "warning",
  critical = "critical",
  unavailable = "unavailable",
}

const Monitoring = () => {
  const { accessToken } = useAuth();
  
  const { data: serverStats, isLoading: statsLoading } = useQuery({
    queryKey: ['serverStats'],
    queryFn: () => apiService.getServerStats(accessToken),
    refetchInterval: 3000, // Refetch every 3 seconds
  });

  const { data: playerAnalytics, isLoading: analyticsLoading, error: analyticsError } = useQuery({
    queryKey: ['playerAnalytics'],
    queryFn: () => apiService.getPlayerAnalytics(accessToken),
    refetchInterval: 60000, // Refetch every minute
  });

  const serverMetrics = [
    { name: "Server 1", cpu: serverStats?.cpu ?? "N/A", memory: serverStats?.memory ?? "N/A", disk: serverStats?.diskActive ?? "N/A", ping: serverStats?.ping ?? "N/A", status: SERVERSTATUS.healthy },
    { name: "Server 2", cpu: "N/A", memory: "N/A", disk: "N/A", ping: "N/A", status: SERVERSTATUS.unavailable },
    { name: "Server 3", cpu: "N/A", memory: "N/A", disk: "N/A", ping: "N/A", status: SERVERSTATUS.unavailable },
    { name: "Server 4", cpu: "N/A", memory: "N/A", disk: "N/A", ping: "N/A", status: SERVERSTATUS.unavailable }
  ];

  // Utility functions for formatting
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatWeek = (year: number, weekNum: number): string => {
    return `Week ${weekNum}, ${year}`;
  };

  const formatMonth = (year: number, monthNum: number): string => {
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return `${monthNames[monthNum - 1]} ${year}`;
  };

  // Generate player metrics from API data
  const playerMetrics = playerAnalytics ? [
    {
      metric: "Daily Active Users",
      value: formatNumber(playerAnalytics.daily?.today?.count ?? 0),
      change: playerAnalytics.daily?.growthRatePercent,
      period: `vs yesterday`,
      subtitle: formatDate(playerAnalytics.daily?.today?.date ?? new Date().toISOString())
    },
    {
      metric: "Weekly Active Users", 
      value: formatNumber(playerAnalytics.weekly?.thisWeek?.count ?? 0),
      change: playerAnalytics.weekly?.growthRatePercent,
      period: `vs last week`,
      subtitle: formatWeek(playerAnalytics.weekly?.thisWeek?.year ?? 2025, playerAnalytics.weekly?.thisWeek?.weekNum ?? 1)
    },
    {
      metric: "Monthly Active Users",
      value: formatNumber(playerAnalytics.monthly?.thisMonth?.count ?? 0),
      change: playerAnalytics.monthly?.growthRatePercent,
      period: `vs last month`,
      subtitle: formatMonth(playerAnalytics.monthly?.thisMonth?.year ?? 2025, playerAnalytics.monthly?.thisMonth?.monthNum ?? 1)
    },
    {
      metric: "Player Retention (7d)",
      value: `${(playerAnalytics.retention?.sevenDay?.retentionRatePercent ?? 0).toFixed(1)}%`,
      change: 0, // No comparison data provided
      period: ``,
      subtitle: `${formatNumber(playerAnalytics.retention?.sevenDay?.retainedUsers ?? 0)} of ${formatNumber(playerAnalytics.retention?.sevenDay?.cohortSize ?? 0)} users`
    }
  ] : [];

  const economyMetrics = [
    { metric: "Gold Generation", value: "45.2K/hr", change: -5.2, status: "warning" },
    { metric: "Gold Destruction", value: "38.1K/hr", change: -8.1, status: "critical" },
    { metric: "Market Volume", value: "892K", change: 15.3, status: "healthy" },
    { metric: "Inflation Rate", value: "2.3%", change: 0.8, status: "warning" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy": return "text-success";
      case "warning": return "text-warning";
      case "critical": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "healthy": return "default";
      case "warning": return "secondary";
      case "critical": return "destructive";
      default: return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">System Monitoring</h1>
        <p className="text-muted-foreground">Real-time server performance and player analytics</p>
      </div>

      {/* Server Performance */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="w-5 h-5" />
            Server Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {serverMetrics.map((server, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border border-border"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{server.name}</h3>
                  <Badge variant={getStatusBadge(server.status)}>
                    {server.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-muted-foreground" />
                    <span>CPU: {server.cpu !== "N/A" ? `${server.cpu}%` : server.cpu}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-muted-foreground" />
                    <span>Memory: {server.memory !== "N/A" ? `${server.memory}%` : server.memory}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-muted-foreground" />
                    <span>Disk: {server.disk !== "N/A" ? `${server.disk}%` : server.disk}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-muted-foreground" />
                    <span>Ping: {server.ping != "N/A" ? `${server.ping}ms`: server.ping}</span>
                  </div>
                </div>

                {server.status === "critical" && (
                  <div className="mt-3 p-2 bg-destructive/10 rounded flex items-center gap-2 text-destructive text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    High resource usage detected
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Player Analytics */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Player Analytics
            {analyticsLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {analyticsError ? (
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-destructive" />
                <span className="font-medium text-destructive">Failed to load player analytics</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {analyticsError instanceof Error ? analyticsError.message : 'An error occurred while fetching data'}
              </p>
            </div>
          ) : analyticsLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="p-4 rounded-lg border border-border">
                  <div className="animate-pulse">
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-8 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {playerMetrics.map((metric, index) => (
                <div key={index} className="p-4 rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground mb-1">{metric.metric}</p>
                  {metric.subtitle && (
                    <p className="text-xs text-muted-foreground mb-2">{metric.subtitle}</p>
                  )}
                  <p className="text-2xl font-bold mb-2">{metric.value}</p>
                  <div className="flex items-center gap-2">
                    {metric.change !== 0 && metric.change !== undefined && (
                      <>
                        {metric.change === null ? (
                          <span className="text-muted-foreground">∞</span>
                        ) : (
                          <>
                            {metric.change > 0 ? (
                              <TrendingUp className="w-4 h-4 text-success" />
                            ) : (
                              <TrendingDown className="w-4 h-4 text-destructive" />
                            )}
                            <span className={metric.change > 0 ? "text-success" : "text-destructive"}>
                              {metric.change > 0 ? "+" : ""}{metric.change.toFixed(1)}%
                            </span>
                          </>
                        )}
                      </>
                    )}
                    <span className="text-xs text-muted-foreground">{metric.period}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Economy Health */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Economy Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {economyMetrics.map((metric, index) => (
              <div key={index} className="p-4 rounded-lg border border-border">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">{metric.metric}</p>
                  <Badge variant={getStatusBadge(metric.status)}>
                    {metric.status}
                  </Badge>
                </div>
                <p className="text-xl font-bold mb-2">{metric.value}</p>
                <div className="flex items-center gap-2">
                  {metric.change > 0 ? (
                    <TrendingUp className="w-4 h-4 text-success" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-destructive" />
                  )}
                  <span className={metric.change > 0 ? "text-success" : "text-destructive"}>
                    {metric.change > 0 ? "+" : ""}{metric.change}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Alerts */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            System Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-destructive" />
                <span className="font-medium text-destructive">Critical: Server 4 High Load</span>
              </div>
              <p className="text-sm text-muted-foreground">CPU and memory usage above 90% for 15 minutes</p>
            </div>

            <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-warning" />
                <span className="font-medium text-warning">Warning: Economy Imbalance</span>
              </div>
              <p className="text-sm text-muted-foreground">Gold generation exceeding destruction by 15%</p>
            </div>

            <div className="p-3 rounded-lg bg-muted/50 border border-border">
              <div className="flex items-center gap-2 mb-1">
                <Activity className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">Info: Scheduled Maintenance</span>
              </div>
              <p className="text-sm text-muted-foreground">Server maintenance planned for tonight at 2 AM UTC</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Monitoring;