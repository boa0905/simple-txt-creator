import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  Plus, 
  Play, 
  Pause, 
  Trash2,
  Megaphone,
  Gift
} from "lucide-react";

const Events = () => {
  const activeEvents = [
    {
      id: "001",
      name: "Double XP Weekend",
      type: "XP Boost",
      status: "active",
      startTime: "2024-03-15T18:00:00Z",
      endTime: "2024-03-17T23:59:59Z",
      participants: 1247
    },
    {
      id: "002", 
      name: "Boss Raid Event",
      type: "World Boss",
      status: "scheduled",
      startTime: "2024-03-20T20:00:00Z",
      endTime: "2024-03-20T22:00:00Z",
      participants: 0
    }
  ];

  const eventHistory = [
    {
      id: "h001",
      name: "Valentine's Day Special",
      type: "Holiday",
      status: "completed",
      participants: 2341,
      success: true
    },
    {
      id: "h002",
      name: "Server Maintenance Compensation",
      type: "Compensation",
      status: "completed", 
      participants: 3456,
      success: true
    }
  ];

  const announcements = [
    {
      id: "a001",
      message: "Server maintenance scheduled for tonight at 2 AM UTC",
      type: "maintenance",
      sent: "2 hours ago"
    },
    {
      id: "a002",
      message: "New legendary weapon available in the item shop!",
      type: "update",
      sent: "1 day ago"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Event Management</h1>
        <p className="text-muted-foreground">Schedule events, manage announcements, and distribute rewards</p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="card-shadow">
          <CardContent className="p-4">
            <Button className="w-full primary-gradient gaming-shadow">
              <Plus className="w-4 h-4 mr-2" />
              Schedule Event
            </Button>
          </CardContent>
        </Card>
        
        <Card className="card-shadow">
          <CardContent className="p-4">
            <Button className="w-full" variant="outline">
              <Megaphone className="w-4 h-4 mr-2" />
              Send Announcement
            </Button>
          </CardContent>
        </Card>
        
        <Card className="card-shadow">
          <CardContent className="p-4">
            <Button className="w-full" variant="outline">
              <Gift className="w-4 h-4 mr-2" />
              Distribute Rewards
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Active Events */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Active & Scheduled Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeEvents.map((event) => (
              <div 
                key={event.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg primary-gradient flex items-center justify-center text-primary-foreground">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{event.name}</h3>
                      <Badge variant={event.status === "active" ? "default" : "secondary"}>
                        {event.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{event.type}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(event.startTime).toLocaleString()}
                      </span>
                      <span>→ {new Date(event.endTime).toLocaleString()}</span>
                      <span>{event.participants} participants</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {event.status === "active" ? (
                    <Button variant="outline" size="sm" className="text-warning">
                      <Pause className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" className="text-success">
                      <Play className="w-4 h-4" />
                    </Button>
                  )}
                  
                  <Button variant="outline" size="sm" className="text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Event History */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Event History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {eventHistory.map((event) => (
                <div 
                  key={event.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div>
                    <p className="font-medium text-sm">{event.name}</p>
                    <p className="text-xs text-muted-foreground">{event.type}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={event.success ? "default" : "destructive"}>
                      {event.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {event.participants} participants
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Announcements */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="w-5 h-5" />
              Recent Announcements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {announcements.map((announcement) => (
                <div 
                  key={announcement.id}
                  className="p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="outline">
                      {announcement.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {announcement.sent}
                    </span>
                  </div>
                  <p className="text-sm">{announcement.message}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Event Templates */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle>Event Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-4">
            <button className="p-4 rounded-lg border border-border hover:bg-muted/50 smooth-transition text-left">
              <Calendar className="w-6 h-6 text-primary mb-2" />
              <p className="font-medium text-sm">XP Boost Event</p>
              <p className="text-xs text-muted-foreground">Double/Triple XP weekend</p>
            </button>
            
            <button className="p-4 rounded-lg border border-border hover:bg-muted/50 smooth-transition text-left">
              <Gift className="w-6 h-6 text-success mb-2" />
              <p className="font-medium text-sm">Login Rewards</p>
              <p className="text-xs text-muted-foreground">Daily login bonuses</p>
            </button>
            
            <button className="p-4 rounded-lg border border-border hover:bg-muted/50 smooth-transition text-left">
              <Megaphone className="w-6 h-6 text-warning mb-2" />
              <p className="font-medium text-sm">World Boss</p>
              <p className="text-xs text-muted-foreground">Server-wide boss event</p>
            </button>
            
            <button className="p-4 rounded-lg border border-border hover:bg-muted/50 smooth-transition text-left">
              <Clock className="w-6 h-6 text-destructive mb-2" />
              <p className="font-medium text-sm">Maintenance</p>
              <p className="text-xs text-muted-foreground">Compensation rewards</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Events;