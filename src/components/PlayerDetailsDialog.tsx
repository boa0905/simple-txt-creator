import { useState, useEffect } from "react";
import { Character, apiService } from "@/services/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  User,
  Settings,
  Coins,
  Shield,
  Sword,
  Brain,
  Heart,
  Zap
} from "lucide-react";

interface PlayerDetailsDialogProps {
  player: Character | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PlayerDetailsDialog = ({ player, open, onOpenChange }: PlayerDetailsDialogProps) => {
  const [formData, setFormData] = useState<Character | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (player) {
      setFormData({ ...player });
    }
  }, [player]);

  if (!player || !formData) return null;

  const handleInputChange = (field: keyof Character, value: string | number) => {
    setFormData(prev => prev ? { ...prev, [field]: value } : null);
  };

  const hasChanges = () => {
    if (!formData || !player) return false;
    return JSON.stringify(formData) !== JSON.stringify(player);
  };

  const handleSave = async () => {
    if (!formData || !player || !hasChanges()) return;

    setIsLoading(true);
    try {
      // Create updates object with only changed fields
      const updates: Partial<Character> = {};
      Object.keys(formData).forEach(key => {
        const field = key as keyof Character;
        if (formData[field] !== player[field]) {
          updates[field] = formData[field];
        }
      });

      await apiService.updateCharacter(player.name, updates);

      toast({
        title: "Success",
        description: "Player information updated successfully",
      });

      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update player information",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Player Details - {formData.name}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="items">Items</TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 min-h-[500px]">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Character Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="account">Account ID</Label>
                    <Input id="account" value={formData.account} disabled />
                  </div>
                  <div>
                    <Label htmlFor="classname">Class</Label>
                    <Input
                      id="classname"
                      value={formData.classname}
                      disabled
                    />
                  </div>
                  <div>
                    <Label htmlFor="orb">Orb</Label>
                    <Input
                      id="orb"
                      type="number"
                      value={formData.orb || 0}
                      onChange={(e) => handleInputChange('orb', parseInt(e.target.value) || 0)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Status & Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Label>Online Status:</Label>
                    <Badge variant={formData.online ? "default" : "secondary"}>
                      {formData.online ? "Online" : "Offline"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label>Admin Status:</Label>
                    <Badge variant={formData.gamemaster ? "destructive" : "outline"}>
                      {formData.gamemaster ? "Admin" : "Player"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label>In Castle:</Label>
                    <Badge variant={formData.is_in_castle ? "default" : "secondary"}>
                      {formData.is_in_castle ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div>
                    <Label htmlFor="donation_point">Donation Points</Label>
                    <Input
                      id="donation_point"
                      type="number"
                      min={0}
                      max={20}
                      value={formData.donation_point || 0}
                      onChange={(e) => {
                        const rawValue = parseInt(e.target.value, 10);
                        const clampedValue = Math.min(Math.max(rawValue, 0), 20);
                        handleInputChange('donation_point', clampedValue);
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="duelWin">Duel Wins</Label>
                    <Input
                      id="duelWin"
                      type="number"
                      min={0}
                      value={formData.duelWin || 0}
                      onChange={(e) => {
                        const rawValue = parseInt(e.target.value, 10);
                        const safeValue = isNaN(rawValue) ? 0 : Math.max(rawValue, 0);
                        handleInputChange('duelWin', safeValue);
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="stats" className="space-y-4 min-h-[500px]">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sword className="w-4 h-4" />
                    Combat Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="level">Level</Label>
                    <Input
                      id="level"
                      type="number"
                      value={formData.level}
                      onChange={(e) => handleInputChange('level', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="health">Health</Label>
                      <Input
                        id="health"
                        type="number"
                        value={formData.health}
                        onChange={(e) => handleInputChange('health', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="mana">Mana</Label>
                      <Input
                        id="mana"
                        type="number"
                        value={formData.mana}
                        onChange={(e) => handleInputChange('mana', parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="experience">Experience</Label>
                      <Input
                        id="experience"
                        type="number"
                        value={formData.experience}
                        onChange={(e) => handleInputChange('experience', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="skillExperience">Skill Experience</Label>
                      <Input
                        id="skillExperience"
                        type="number"
                        value={formData.skillExperience || 0}
                        onChange={(e) => handleInputChange('skillExperience', parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Coins className="w-4 h-4" />
                    Currency & Position
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="gold">Gold</Label>
                      <Input
                        id="gold"
                        type="number"
                        value={formData.gold}
                        onChange={(e) => handleInputChange('gold', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="coins">Coins</Label>
                      <Input
                        id="coins"
                        type="number"
                        value={formData.coins || 0}
                        onChange={(e) => handleInputChange('coins', parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label htmlFor="x">X Position</Label>
                      <Input
                        id="x"
                        type="number"
                        step="0.1"
                        value={formData.x}
                        onChange={(e) => handleInputChange('x', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="y">Y Position</Label>
                      <Input
                        id="y"
                        type="number"
                        step="0.1"
                        value={formData.y}
                        onChange={(e) => handleInputChange('y', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="z">Z Position</Label>
                      <Input
                        id="z"
                        type="number"
                        step="0.1"
                        value={formData.z}
                        onChange={(e) => handleInputChange('z', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="skills" className="space-y-4 min-h-[500px]">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    Gathering Skills
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="gatherMiningLvl">Mining Level</Label>
                      <Input
                        id="gatherMiningLvl"
                        type="number"
                        value={formData.gatherMiningLvl || 1}
                        onChange={(e) => handleInputChange('gatherMiningLvl', parseInt(e.target.value) || 1)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="gatherMiningXP">Mining XP</Label>
                      <Input
                        id="gatherMiningXP"
                        type="number"
                        value={formData.gatherMiningXP || 0}
                        onChange={(e) => handleInputChange('gatherMiningXP', parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="gatherWoodcuttingLvl">Woodcutting Level</Label>
                      <Input
                        id="gatherWoodcuttingLvl"
                        type="number"
                        value={formData.gatherWoodcuttingLvl || 1}
                        onChange={(e) => handleInputChange('gatherWoodcuttingLvl', parseInt(e.target.value) || 1)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="gatherWoodcuttingXP">Woodcutting XP</Label>
                      <Input
                        id="gatherWoodcuttingXP"
                        type="number"
                        value={formData.gatherWoodcuttingXP || 0}
                        onChange={(e) => handleInputChange('gatherWoodcuttingXP', parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="gatherGatheringLvl">Gathering Level</Label>
                      <Input
                        id="gatherGatheringLvl"
                        type="number"
                        value={formData.gatherGatheringLvl || 1}
                        onChange={(e) => handleInputChange('gatherGatheringLvl', parseInt(e.target.value) || 1)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="gatherGatheringXP">Gathering XP</Label>
                      <Input
                        id="gatherGatheringXP"
                        type="number"
                        value={formData.gatherGatheringXP || 0}
                        onChange={(e) => handleInputChange('gatherGatheringXP', parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="gatherHuntingLvl">Hunting Level</Label>
                      <Input
                        id="gatherHuntingLvl"
                        type="number"
                        value={formData.gatherHuntingLvl || 1}
                        onChange={(e) => handleInputChange('gatherHuntingLvl', parseInt(e.target.value) || 1)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="gatherHuntingXP">Hunting XP</Label>
                      <Input
                        id="gatherHuntingXP"
                        type="number"
                        value={formData.gatherHuntingXP || 0}
                        onChange={(e) => handleInputChange('gatherHuntingXP', parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Crafting Skills
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="craftBlacksmithLvl">Blacksmith Level</Label>
                      <Input
                        id="craftBlacksmithLvl"
                        type="number"
                        value={formData.craftBlacksmithLvl || 1}
                        onChange={(e) => handleInputChange('craftBlacksmithLvl', parseInt(e.target.value) || 1)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="craftBlacksmithXP">Blacksmith XP</Label>
                      <Input
                        id="craftBlacksmithXP"
                        type="number"
                        value={formData.craftBlacksmithXP || 0}
                        onChange={(e) => handleInputChange('craftBlacksmithXP', parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="craftPotionLvl">Potion Level</Label>
                      <Input
                        id="craftPotionLvl"
                        type="number"
                        value={formData.craftPotionLvl || 1}
                        onChange={(e) => handleInputChange('craftPotionLvl', parseInt(e.target.value) || 1)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="craftPotionXP">Potion XP</Label>
                      <Input
                        id="craftPotionXP"
                        type="number"
                        value={formData.craftPotionXP || 0}
                        onChange={(e) => handleInputChange('craftPotionXP', parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="craftCarpentryLvl">Carpentry Level</Label>
                      <Input
                        id="craftCarpentryLvl"
                        type="number"
                        value={formData.craftCarpentryLvl || 1}
                        onChange={(e) => handleInputChange('craftCarpentryLvl', parseInt(e.target.value) || 1)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="craftCarpentryXP">Carpentry XP</Label>
                      <Input
                        id="craftCarpentryXP"
                        type="number"
                        value={formData.craftCarpentryXP || 0}
                        onChange={(e) => handleInputChange('craftCarpentryXP', parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="craftTailorLvl">Tailor Level</Label>
                      <Input
                        id="craftTailorLvl"
                        type="number"
                        value={formData.craftTailorLvl || 1}
                        onChange={(e) => handleInputChange('craftTailorLvl', parseInt(e.target.value) || 1)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="craftTailorXP">Tailor XP</Label>
                      <Input
                        id="craftTailorXP"
                        type="number"
                        value={formData.craftTailorXP || 0}
                        onChange={(e) => handleInputChange('craftTailorXP', parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="craftAnimalLvl">Animal Level</Label>
                      <Input
                        id="craftAnimalLvl"
                        type="number"
                        value={formData.craftAnimalLvl || 1}
                        onChange={(e) => handleInputChange('craftAnimalLvl', parseInt(e.target.value) || 1)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="craftAnimalXP">Animal XP</Label>
                      <Input
                        id="craftAnimalXP"
                        type="number"
                        value={formData.craftAnimalXP || 0}
                        onChange={(e) => handleInputChange('craftAnimalXP', parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-4 min-h-[500px]">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Raw Materials</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="cotton">Cotton</Label>
                      <Input
                        id="cotton"
                        type="number"
                        value={formData.cotton || 0}
                        onChange={(e) => handleInputChange('cotton', parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="log_A">Log A</Label>
                      <Input
                        id="log_A"
                        type="number"
                        value={formData.log_A || 0}
                        onChange={(e) => handleInputChange('log_A', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="log_B">Log B</Label>
                      <Input
                        id="log_B"
                        type="number"
                        value={formData.log_B || 0}
                        onChange={(e) => handleInputChange('log_B', parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label htmlFor="ore_A">Ore A</Label>
                      <Input
                        id="ore_A"
                        type="number"
                        value={formData.ore_A || 0}
                        onChange={(e) => handleInputChange('ore_A', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="ore_B">Ore B</Label>
                      <Input
                        id="ore_B"
                        type="number"
                        value={formData.ore_B || 0}
                        onChange={(e) => handleInputChange('ore_B', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="ore_C">Ore C</Label>
                      <Input
                        id="ore_C"
                        type="number"
                        value={formData.ore_C || 0}
                        onChange={(e) => handleInputChange('ore_C', parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label htmlFor="peltSmall">Small Pelt</Label>
                      <Input
                        id="peltSmall"
                        type="number"
                        value={formData.peltSmall || 0}
                        onChange={(e) => handleInputChange('peltSmall', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="wool">Wool</Label>
                      <Input
                        id="wool"
                        type="number"
                        value={formData.wool || 0}
                        onChange={(e) => handleInputChange('wool', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="peltMedium">Medium Pelt</Label>
                      <Input
                        id="peltMedium"
                        type="number"
                        value={formData.peltMedium || 0}
                        onChange={(e) => handleInputChange('peltMedium', parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label htmlFor="mosquitoWings">Mosquito Wings</Label>
                      <Input
                        id="mosquitoWings"
                        type="number"
                        value={formData.mosquitoWings || 0}
                        onChange={(e) => handleInputChange('mosquitoWings', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="spiderWeb">Spider Web</Label>
                      <Input
                        id="spiderWeb"
                        type="number"
                        value={formData.spiderWeb || 0}
                        onChange={(e) => handleInputChange('spiderWeb', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="frogSkin">Frog Skin</Label>
                      <Input
                        id="frogSkin"
                        type="number"
                        value={formData.frogSkin || 0}
                        onChange={(e) => handleInputChange('frogSkin', parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Precious Resources</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="golemPlate">Golem Plate</Label>
                      <Input
                        id="golemPlate"
                        type="number"
                        value={formData.golemPlate || 0}
                        onChange={(e) => handleInputChange('golemPlate', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="pearl">Pearl</Label>
                      <Input
                        id="pearl"
                        type="number"
                        value={formData.pearl || 0}
                        onChange={(e) => handleInputChange('pearl', parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="airSoul">Air Soul</Label>
                      <Input
                        id="airSoul"
                        type="number"
                        value={formData.airSoul || 0}
                        onChange={(e) => handleInputChange('airSoul', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="earthSoul">Earth Soul</Label>
                      <Input
                        id="earthSoul"
                        type="number"
                        value={formData.earthSoul || 0}
                        onChange={(e) => handleInputChange('earthSoul', parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="energyRod">Energy Rod</Label>
                      <Input
                        id="energyRod"
                        type="number"
                        value={formData.energyRod || 0}
                        onChange={(e) => handleInputChange('energyRod', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="fireGlue">Fire Glue</Label>
                      <Input
                        id="fireGlue"
                        type="number"
                        value={formData.fireGlue || 0}
                        onChange={(e) => handleInputChange('fireGlue', parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="diamond">Diamond</Label>
                      <Input
                        id="diamond"
                        type="number"
                        value={formData.diamond || 0}
                        onChange={(e) => handleInputChange('diamond', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="silphium">Silphium</Label>
                      <Input
                        id="silphium"
                        type="number"
                        value={formData.silphium || 0}
                        onChange={(e) => handleInputChange('silphium', parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="items" className="space-y-4 min-h-[500px]">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Crafted Materials</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="fabricCotton">Fabric Cotton</Label>
                      <Input
                        id="fabricCotton"
                        type="number"
                        value={formData.fabricCotton || 0}
                        onChange={(e) => handleInputChange('fabricCotton', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="fabricWool">Fabric Wool</Label>
                      <Input
                        id="fabricWool"
                        type="number"
                        value={formData.fabricWool || 0}
                        onChange={(e) => handleInputChange('fabricWool', parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="threadA">Thread A</Label>
                      <Input
                        id="threadA"
                        type="number"
                        value={formData.threadA || 0}
                        onChange={(e) => handleInputChange('threadA', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="threadB">Thread B</Label>
                      <Input
                        id="threadB"
                        type="number"
                        value={formData.threadB || 0}
                        onChange={(e) => handleInputChange('threadB', parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="plank_A">Plank A</Label>
                      <Input
                        id="plank_A"
                        type="number"
                        value={formData.plank_A || 0}
                        onChange={(e) => handleInputChange('plank_A', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="plank_B">Plank B</Label>
                      <Input
                        id="plank_B"
                        type="number"
                        value={formData.plank_B || 0}
                        onChange={(e) => handleInputChange('plank_B', parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="metalBar_A">Metal Bar A</Label>
                      <Input
                        id="metalBar_A"
                        type="number"
                        value={formData.metalBar_A || 0}
                        onChange={(e) => handleInputChange('metalBar_A', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="metalBar_B">Metal Bar B</Label>
                      <Input
                        id="metalBar_B"
                        type="number"
                        value={formData.metalBar_B || 0}
                        onChange={(e) => handleInputChange('metalBar_B', parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="softLeather">Soft Leather</Label>
                      <Input
                        id="softLeather"
                        type="number"
                        value={formData.softLeather || 0}
                        onChange={(e) => handleInputChange('softLeather', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="thickLeather">Thick Leather</Label>
                      <Input
                        id="thickLeather"
                        type="number"
                        value={formData.thickLeather || 0}
                        onChange={(e) => handleInputChange('thickLeather', parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>

                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Potions & Fragments</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="health_potion">Health Potion</Label>
                      <Input
                        id="health_potion"
                        type="number"
                        value={formData.health_potion || 0}
                        onChange={(e) => handleInputChange('health_potion', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="mana_potion">Mana Potion</Label>
                      <Input
                        id="mana_potion"
                        type="number"
                        value={formData.mana_potion || 0}
                        onChange={(e) => handleInputChange('mana_potion', parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="horse_fragment">Horse Fragment</Label>
                      <Input
                        id="horse_fragment"
                        type="number"
                        value={formData.horse_fragment || 0}
                        onChange={(e) => handleInputChange('horse_fragment', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lion_fragment">Lion Fragment</Label>
                      <Input
                        id="lion_fragment"
                        type="number"
                        value={formData.lion_fragment || 0}
                        onChange={(e) => handleInputChange('lion_fragment', parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="tiger_fragment">Tiger Fragment</Label>
                      <Input
                        id="tiger_fragment"
                        type="number"
                        value={formData.tiger_fragment || 0}
                        onChange={(e) => handleInputChange('tiger_fragment', parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="admin" className="space-y-4 min-h-[500px]">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Administrative Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="destructive" className="w-full">
                    <Shield className="w-4 h-4 mr-2" />
                    Ban Player
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Shield className="w-4 h-4 mr-2" />
                    Remove Ban
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Zap className="w-4 h-4 mr-2" />
                    Kick Player
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Settings className="w-4 h-4 mr-2" />
                    Reset Progress
                  </Button>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Player Information</h4>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>Last Saved: {new Date(formData.lastsaved / 10000 - 621355968000000000).toLocaleString()}</p>
                    <p>Donation Counter: {formData.donation_counter}</p>
                    <p>Donation Lock Time: {formData.donation_lock_time}</p>
                    <p>Storage Capacity: {formData.storage_capacity}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>

          {hasChanges() && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Changes</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to update {formData.name}'s information? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleSave}>
                    Confirm Update
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
