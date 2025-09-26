import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GuildDetailsDialog } from "@/components/GuildDetailsDialog";
import { apiService, Guild } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  Shield,
  Users,
  Crown,
  Trash2,
  RefreshCw,
  TrendingUp,
  Search,
  Filter,
  Eye,
  Loader2
} from "lucide-react";

const Guilds = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGuild, setSelectedGuild] = useState<Guild | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const { accessToken } = useAuth();

  useEffect(() => {
    const fetchGuilds = async () => {
      try {
        const data = await apiService.getGuilds(accessToken);
        // Ensure data is an array
        if (Array.isArray(data)) {
          setGuilds(data);
        } else {
          console.error('API returned non-array data:', data);
          setGuilds([]);
        }
      } catch (error) {
        console.error('Failed to fetch guilds:', error);
        toast({
          title: "Error",
          description: "Failed to fetch guild data",
          variant: "destructive",
        });
        setGuilds([]); // Ensure guilds is always an array
      } finally {
        setLoading(false);
      }
    };

    fetchGuilds();
  }, [toast]);

  // Ensure guilds is always an array before filtering
  const filteredGuilds = Array.isArray(guilds) ? guilds.filter(guild =>
    guild.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guild.leader.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  // Determine if a guild is active based on lastsaved (Windows FileTime)
  const isGuildActive = (g: Guild): boolean => {
    const lastSavedMs = g.lastsaved / 10000 - 62135596800000;
    const daysSinceLastSave = (Date.now() - lastSavedMs) / (1000 * 60 * 60 * 24);
    return daysSinceLastSave <= 7; // Active if saved within last 30 days
  };

  const handleGuildClick = (guild: Guild) => {
    setSelectedGuild(guild);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Guild Management</h1>
        <p className="text-muted-foreground">Oversee guild activities and manage guild operations</p>
      </div>

      {/* Guild Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="card-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{guilds.length}</p>
                <p className="text-sm text-muted-foreground">Total Guilds</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-success" />
              <div>
                <p className="text-2xl font-bold">{guilds.reduce((sum, g) => sum + g.membersCnt, 0)}</p>
                <p className="text-sm text-muted-foreground">Guild Members</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-warning" />
              <div>
                <p className="text-2xl font-bold">{guilds.filter(g => isGuildActive(g)).length}</p>
                <p className="text-sm text-muted-foreground">Active Guilds</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="card-shadow">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by guild name or leader..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Guilds List */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Guild Directory ({filteredGuilds.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              Loading guilds...
            </div>
          ) : (
            <div className="space-y-4">
              {filteredGuilds.map((guild) => (
                <div
                  key={guild.name}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 smooth-transition cursor-pointer"
                  onClick={() => handleGuildClick(guild)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg primary-gradient flex items-center justify-center text-primary-foreground font-bold">
                      {guild.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{guild.name}</h3>
                        <Badge variant={isGuildActive(guild) ? "default" : "secondary"}>
                          {isGuildActive(guild) ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Crown className="w-4 h-4" />
                        <span>Leader: {guild.leader}</span>
                      </div>
                      <div className="flex items-center gap-6 mt-2 text-sm">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          {guild.membersCnt} members
                        </span>
                        <span>Battle Lv. {guild.battleLvl}</span>
                        <span>Score: {guild.score}</span>
                        <span>Founded: {new Date(guild.foundedAt / 10000 - 62135596800000).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold">{guild.gold.toLocaleString()} gold</p>
                      <p className="text-sm text-muted-foreground">Treasury</p>
                    </div>

                    <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handleGuildClick(guild); }}>
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {filteredGuilds.length === 0 && !loading && (
                <div className="text-center py-8 text-muted-foreground">
                  No guilds found matching your search.
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Guild Actions */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle>Guild Management Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <button className="p-4 rounded-lg border border-border hover:bg-muted/50 smooth-transition text-left">
              <RefreshCw className="w-6 h-6 text-primary mb-2" />
              <p className="font-medium text-sm">Mass Leadership Transfer</p>
              <p className="text-xs text-muted-foreground">Transfer inactive guild leaders</p>
            </button>

            <button className="p-4 rounded-lg border border-border hover:bg-muted/50 smooth-transition text-left">
              <Trash2 className="w-6 h-6 text-destructive mb-2" />
              <p className="font-medium text-sm">Cleanup Inactive</p>
              <p className="text-xs text-muted-foreground">Remove inactive guilds</p>
            </button>

            <button className="p-4 rounded-lg border border-border hover:bg-muted/50 smooth-transition text-left">
              <TrendingUp className="w-6 h-6 text-success mb-2" />
              <p className="font-medium text-sm">Guild Analytics</p>
              <p className="text-xs text-muted-foreground">View detailed statistics</p>
            </button>
          </div>
        </CardContent>
      </Card>

      <GuildDetailsDialog
        guild={selectedGuild}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
};

export default Guilds;