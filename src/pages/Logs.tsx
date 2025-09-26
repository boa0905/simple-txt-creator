import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  ScrollText, 
  Search, 
  Filter, 
  Download,
  Clock,
  User,
  Shield,
  AlertTriangle
} from "lucide-react";

const Logs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const auditLogs = [
    {
      id: "001",
      timestamp: "2024-03-15T14:30:25Z",
      admin: "admin_john",
      action: "PLAYER_BANNED",
      target: "ToxicPlayer123",
      details: "Reason: Inappropriate behavior, Duration: 7 days",
      severity: "high"
    },
    {
      id: "002",
      timestamp: "2024-03-15T14:25:10Z", 
      admin: "gm_sarah",
      action: "CURRENCY_ADJUSTED",
      target: "PlayerY456",
      details: "Gold: -5000 (refund for duplicate purchase)",
      severity: "medium"
    },
    {
      id: "003",
      timestamp: "2024-03-15T14:20:45Z",
      admin: "admin_mike", 
      action: "GUILD_DISBANDED",
      target: "ChaosGuild",
      details: "Guild disbanded due to inactivity",
      severity: "medium"
    },
    {
      id: "004",
      timestamp: "2024-03-15T14:15:30Z",
      admin: "gm_lisa",
      action: "EVENT_SCHEDULED",
      target: "Double XP Weekend",
      details: "Start: 2024-03-16T18:00Z, End: 2024-03-17T23:59Z",
      severity: "low"
    },
    {
      id: "005",
      timestamp: "2024-03-15T14:10:15Z",
      admin: "admin_john",
      action: "ITEM_MODIFIED",
      target: "Legendary Sword #1847",
      details: "Stats adjusted: Attack +50 → +45",
      severity: "medium"
    },
    {
      id: "006",
      timestamp: "2024-03-15T14:05:20Z",
      admin: "support_alex",
      action: "PLAYER_UNBANNED",
      target: "ReformedPlayer", 
      details: "Appeal approved, ban lifted early",
      severity: "medium"
    }
  ];

  const systemLogs = [
    {
      id: "s001",
      timestamp: "2024-03-15T14:35:00Z",
      level: "ERROR",
      service: "AuthService",
      message: "Failed login attempt from IP 192.168.1.100 (user: hackertry)",
      details: "Multiple failed attempts detected"
    },
    {
      id: "s002", 
      timestamp: "2024-03-15T14:30:15Z",
      level: "WARNING",
      service: "EconomyService",
      message: "High gold inflation detected: 3.2%",
      details: "Exceeds normal threshold of 2.5%"
    },
    {
      id: "s003",
      timestamp: "2024-03-15T14:25:30Z",
      level: "INFO",
      service: "EventService", 
      message: "Event 'Double XP Weekend' scheduled successfully",
      details: "Participants will be notified 1 hour before start"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "outline";
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "ERROR": return "destructive";
      case "WARNING": return "secondary";
      case "INFO": return "outline";
      default: return "outline";
    }
  };

  const filters = [
    { value: "all", label: "All Logs" },
    { value: "bans", label: "Bans & Suspensions" },
    { value: "economy", label: "Economy Changes" },
    { value: "guild", label: "Guild Actions" },
    { value: "events", label: "Event Management" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Audit Logs</h1>
        <p className="text-muted-foreground">Complete history of admin actions and system events</p>
      </div>

      {/* Search and Filter Controls */}
      <Card className="card-shadow">
        <CardContent className="p-6">
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search logs by admin, action, or target..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>

          <div className="flex gap-2">
            {filters.map((filter) => (
              <Button
                key={filter.value}
                variant={selectedFilter === filter.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter(filter.value)}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Admin Action Logs */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Admin Action Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {auditLogs.map((log) => (
              <div 
                key={log.id}
                className="flex items-start justify-between p-4 rounded-lg border border-border hover:bg-muted/50 smooth-transition"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                    {log.admin.charAt(0).toUpperCase()}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{log.action}</span>
                      <Badge variant={getSeverityColor(log.severity)}>
                        {log.severity}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-muted-foreground mb-2">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {log.admin} → {log.target}
                      </span>
                    </div>
                    
                    <p className="text-sm">{log.details}</p>
                  </div>
                </div>
                
                <div className="text-right text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(log.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Logs */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ScrollText className="w-5 h-5" />
            System Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {systemLogs.map((log) => (
              <div 
                key={log.id}
                className="flex items-start justify-between p-4 rounded-lg border border-border"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                    {log.level === "ERROR" ? (
                      <AlertTriangle className="w-4 h-4 text-destructive" />
                    ) : log.level === "WARNING" ? (
                      <AlertTriangle className="w-4 h-4 text-warning" />
                    ) : (
                      <ScrollText className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={getLevelColor(log.level)}>
                        {log.level}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{log.service}</span>
                    </div>
                    
                    <p className="text-sm font-medium mb-1">{log.message}</p>
                    <p className="text-xs text-muted-foreground">{log.details}</p>
                  </div>
                </div>
                
                <div className="text-right text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(log.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Log Statistics */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle>Log Statistics (Last 24 Hours)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="p-4 rounded-lg border border-border text-center">
              <p className="text-2xl font-bold text-destructive">12</p>
              <p className="text-sm text-muted-foreground">High Severity Actions</p>
            </div>
            
            <div className="p-4 rounded-lg border border-border text-center">
              <p className="text-2xl font-bold text-warning">34</p>
              <p className="text-sm text-muted-foreground">Medium Severity Actions</p>
            </div>
            
            <div className="p-4 rounded-lg border border-border text-center">
              <p className="text-2xl font-bold text-success">156</p>
              <p className="text-sm text-muted-foreground">Low Severity Actions</p>
            </div>
            
            <div className="p-4 rounded-lg border border-border text-center">
              <p className="text-2xl font-bold">8</p>
              <p className="text-sm text-muted-foreground">System Errors</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Logs;