import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PlayerDetailsDialog } from "@/components/PlayerDetailsDialog";
import { apiService, Character, Account } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Search, 
  Filter, 
  Ban, 
  UserCheck, 
  Coins, 
  Users,
  Eye,
  AlertTriangle,
  Loader2
} from "lucide-react";

interface PlayerWithAccount extends Character {
  accountInfo?: Account;
}

const Players = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [players, setPlayers] = useState<PlayerWithAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerWithAccount | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const { accessToken } = useAuth();

  useEffect(() => {
    const fetchPlayers = async () => {
      if (!accessToken) return;
      
      try {
        setLoading(true);
        const [charactersData, accountsData] = await Promise.all([
          apiService.getCharacters(accessToken),
          apiService.getAccounts(accessToken)
        ]);
        
        // Merge character and account data
        const playersWithAccounts = charactersData.map(character => ({
          ...character,
          accountInfo: accountsData.find(account => account.name === character.account)
        }));
        
        setPlayers(playersWithAccounts);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch players data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, [accessToken, toast]);

  const filteredPlayers = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return players;
    return players.filter((player) => {
      const haystack = [
        player.name,
        player.account,
        player.classname,
        player.level?.toString(),
        player.accountInfo?.name,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [players, searchTerm]);

  const handlePlayerClick = (player: PlayerWithAccount) => {
    setSelectedPlayer(player);
    setDialogOpen(true);
  };

  const handleBanAction = async (accountName: string, action: 'ban' | 'unban' | 'rewardban' | 'rewardunban') => {
    try {
      switch (action) {
        case 'ban':
          await apiService.setBan(accountName, accessToken);
          break;
        case 'unban':
          await apiService.clearBan(accountName, accessToken);
          break;
        case 'rewardban':
          await apiService.setRewardBan(accountName, accessToken);
          break;
        case 'rewardunban':
          await apiService.clearRewardBan(accountName, accessToken);
          break;
      }
      
      // Refresh players data
      const [charactersData, accountsData] = await Promise.all([
        apiService.getCharacters(accessToken),
        apiService.getAccounts(accessToken)
      ]);
      
      const playersWithAccounts = charactersData.map(character => ({
        ...character,
        accountInfo: accountsData.find(account => account.name === character.account)
      }));
      
      setPlayers(playersWithAccounts);
      
      toast({
        title: "Success",
        description: `Player ${action === 'ban' || action === 'rewardban' ? 'banned' : 'unbanned'} successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${action} player`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Player Management</h1>
        <p className="text-muted-foreground">Search, view, and moderate player accounts</p>
      </div>

      {/* Search and Filters */}
      <Card className="card-shadow">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by character name, or account ID..."
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

      {/* Players Table */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Players ({filteredPlayers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              Loading players...
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPlayers.map((player) => (
                <div 
                  key={`${player.account}-${player.name}`}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 smooth-transition cursor-pointer"
                  onClick={() => handlePlayerClick(player)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full primary-gradient flex items-center justify-center text-primary-foreground font-bold">
                      {player.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{player.name}</p>
                        <Badge variant={player.online ? "default" : "secondary"}>
                          {player.online ? "Online" : "Offline"}
                        </Badge>
                        {player.gamemaster === 1 && (
                          <Badge variant="destructive">
                            <Users className="w-3 h-3 mr-1" />
                            Admin
                          </Badge>
                        )}
                        {player.deleted === 1 && (
                          <Badge variant="destructive">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Deleted
                          </Badge>
                        )}
                        {player.accountInfo?.banned === 1 && (
                          <Badge variant="destructive">
                            <Ban className="w-3 h-3 mr-1" />
                            Banned
                          </Badge>
                        )}
                        {player.accountInfo?.reward_baned === 1 && (
                          <Badge variant="destructive">
                            <Ban className="w-3 h-3 mr-1" />
                            Reward Banned
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{player.account}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Level {player.level}</span>
                        <span>Class: {player.classname}</span>
                        <span>Health: {player.health}</span>
                        <span>Mana: {player.mana}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-right mr-4">
                      <p className="text-sm font-medium flex items-center gap-1">
                        <Coins className="w-4 h-4 text-warning" />
                        {player.gold.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Donation: {player.donation_point}
                      </p>
                    </div>
                    
                    <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handlePlayerClick(player); }}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    
                    {/* Ban Controls */}
                    {player.accountInfo?.banned === 1 ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-success" 
                        onClick={(e) => { e.stopPropagation(); handleBanAction(player.account, 'unban'); }}
                      >
                        <UserCheck className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-destructive" 
                        onClick={(e) => { e.stopPropagation(); handleBanAction(player.account, 'ban'); }}
                      >
                        <Ban className="w-4 h-4" />
                      </Button>
                    )}
                    
                    {/* Reward Ban Controls */}
                    {player.accountInfo?.reward_baned === 1 ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-success" 
                        onClick={(e) => { e.stopPropagation(); handleBanAction(player.account, 'rewardunban'); }}
                        title="Remove Reward Ban"
                      >
                        <Coins className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-destructive" 
                        onClick={(e) => { e.stopPropagation(); handleBanAction(player.account, 'rewardban'); }}
                        title="Set Reward Ban"
                      >
                        <Coins className="w-4 h-4 opacity-50" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              
              {filteredPlayers.length === 0 && !loading && (
                <div className="text-center py-8 text-muted-foreground">
                  No players found matching your search.
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <PlayerDetailsDialog 
        player={selectedPlayer}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
};

export default Players;