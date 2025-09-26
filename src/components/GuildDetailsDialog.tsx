import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Guild, apiService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Crown, Shield, Users, Coins, Hammer, Pickaxe, Swords } from "lucide-react";

interface GuildDetailsDialogProps {
  guild: Guild | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GuildDetailsDialog = ({ guild, open, onOpenChange }: GuildDetailsDialogProps) => {
  const [editData, setEditData] = useState<Guild | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (guild) {
      setEditData({ ...guild });
    }
  }, [guild]);

  if (!guild || !editData) return null;

  const hasChanges = () => {
    if (!editData || !guild) return false;
    return JSON.stringify(editData) !== JSON.stringify(guild);
  };

  const handleSave = async () => {
    if (!editData || !guild || !hasChanges()) return;

    setIsLoading(true);
    try {
      // Create updates object with only changed fields
      const updates: Partial<Guild> = {};
      Object.keys(editData).forEach(key => {
        const field = key as keyof Guild;
        if (editData[field] !== guild[field]) {
          (updates as any)[field] = editData[field];
        }
      });

      await apiService.updateGuild(guild.name, updates);
      toast({
        title: "Success",
        description: "Guild information updated successfully",
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update guild information",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof Guild, value: string | number) => {
    setEditData(prev => prev ? { ...prev, [field]: value } as Guild : null);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Guild Details: {guild.name}
            </DialogTitle>
          </DialogHeader>

          <div className="min-h-[500px]">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="items">Items</TabsTrigger>
                <TabsTrigger value="admin">Admin</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-4 min-h-[500px]">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Basic Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="name">Guild Name</Label>
                        <Input
                          id="name"
                          value={editData.name || ""}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="leader">Leader</Label>
                        <Input
                          id="leader"
                          value={editData.leader || ""}
                          readOnly
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="membersCnt">Member Count</Label>
                          <Input
                            id="membersCnt"
                            type="number"
                            value={editData.membersCnt || 0}
                            disabled
                          />
                        </div>
                        <div>
                          <Label htmlFor="score">Score</Label>
                          <Input
                            id="score"
                            type="number"
                            value={editData.score || 0}
                            onChange={(e) => handleInputChange("score", parseInt(e.target.value))}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="notice">Guild Notice</Label>
                        <Textarea
                          id="notice"
                          value={editData.notice || ""}
                          onChange={(e) => handleInputChange("notice", e.target.value)}
                          rows={3}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Right: Stats & Levels */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Currency & Skills</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="gold">Gold</Label>
                          <Input
                            id="gold"
                            type="number"
                            value={editData.gold || 0}
                            onChange={(e) => handleInputChange("gold", parseInt(e.target.value))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="coins">Coins</Label>
                          <Input
                            id="coins"
                            type="number"
                            value={editData.coins || 0}
                            onChange={(e) => handleInputChange("coins", parseInt(e.target.value))}
                          />
                        </div>
                      </div>
                      <Separator />
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="battleLvl_gen">Battle Level</Label>
                          <Input
                            id="battleLvl_gen"
                            type="number"
                            value={editData.battleLvl || 0}
                            onChange={(e) => handleInputChange("battleLvl", parseInt(e.target.value))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="gatherLvl_gen">Gather Level</Label>
                          <Input
                            id="gatherLvl_gen"
                            type="number"
                            value={editData.gatherLvl || 0}
                            onChange={(e) => handleInputChange("gatherLvl", parseInt(e.target.value))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="craftLvl_gen">Craft Level</Label>
                          <Input
                            id="craftLvl_gen"
                            type="number"
                            value={editData.craftLvl || 0}
                            onChange={(e) => handleInputChange("craftLvl", parseInt(e.target.value))}
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
                      <CardTitle className="flex items-center gap-2">
                        Raw Materials
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="cotton">Cotton</Label>
                          <Input
                            id="cotton"
                            type="number"
                            value={editData.cotton || 0}
                            onChange={(e) => handleInputChange("cotton", parseInt(e.target.value))}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="log_A">Log A</Label>
                          <Input
                            id="log_A"
                            type="number"
                            value={editData.log_A || 0}
                            onChange={(e) => handleInputChange("log_A", parseInt(e.target.value))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="log_B">Log B</Label>
                          <Input
                            id="log_B"
                            type="number"
                            value={editData.log_B || 0}
                            onChange={(e) => handleInputChange("log_B", parseInt(e.target.value))}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <Label htmlFor="ore_A">Ore A</Label>
                          <Input
                            id="ore_A"
                            type="number"
                            value={editData.ore_A || 0}
                            onChange={(e) => handleInputChange("ore_A", parseInt(e.target.value))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="ore_B">Ore B</Label>
                          <Input
                            id="ore_B"
                            type="number"
                            value={editData.ore_B || 0}
                            onChange={(e) => handleInputChange("ore_B", parseInt(e.target.value))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="ore_C">Ore C</Label>
                          <Input
                            id="ore_C"
                            type="number"
                            value={editData.ore_C || 0}
                            onChange={(e) => handleInputChange("ore_C", parseInt(e.target.value))}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <Label htmlFor="peltSmall">Small Pelt</Label>
                          <Input
                            id="peltSmall"
                            type="number"
                            value={editData.peltSmall || 0}
                            onChange={(e) => handleInputChange("peltSmall", parseInt(e.target.value))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="wool">Wool</Label>
                          <Input
                            id="wool"
                            type="number"
                            value={editData.wool || 0}
                            onChange={(e) => handleInputChange("wool", parseInt(e.target.value))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="peltMedium">Medium Pelt</Label>
                          <Input
                            id="peltMedium"
                            type="number"
                            value={editData.peltMedium || 0}
                            onChange={(e) => handleInputChange("peltMedium", parseInt(e.target.value))}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <Label htmlFor="mosquitoWings">Mosquito Wings</Label>
                          <Input
                            id="mosquitoWings"
                            type="number"
                            value={editData.mosquitoWings || 0}
                            onChange={(e) => handleInputChange('mosquitoWings', parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="spiderWeb">Spider Web</Label>
                          <Input
                            id="spiderWeb"
                            type="number"
                            value={editData.spiderWeb || 0}
                            onChange={(e) => handleInputChange('spiderWeb', parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="frogSkin">Frog Skin</Label>
                          <Input
                            id="frogSkin"
                            type="number"
                            value={editData.frogSkin || 0}
                            onChange={(e) => handleInputChange('frogSkin', parseInt(e.target.value) || 0)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        Precious Resources
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="golemPlate">Golem Plate</Label>
                          <Input
                            id="golemPlate"
                            type="number"
                            value={editData.golemPlate || 0}
                            onChange={(e) => handleInputChange('golemPlate', parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="pearl">Pearl</Label>
                          <Input
                            id="pearl"
                            type="number"
                            value={editData.pearl || 0}
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
                            value={editData.airSoul || 0}
                            onChange={(e) => handleInputChange('airSoul', parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="earthSoul">Earth Soul</Label>
                          <Input
                            id="earthSoul"
                            type="number"
                            value={editData.earthSoul || 0}
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
                            value={editData.energyRod || 0}
                            onChange={(e) => handleInputChange('energyRod', parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="fireGlue">Fire Glue</Label>
                          <Input
                            id="fireGlue"
                            type="number"
                            value={editData.fireGlue || 0}
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
                            value={editData.diamond || 0}
                            onChange={(e) => handleInputChange('diamond', parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="silphium">Silphium</Label>
                          <Input
                            id="silphium"
                            type="number"
                            value={editData.silphium || 0}
                            onChange={(e) => handleInputChange('silphium', parseInt(e.target.value) || 0)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="items" className="space-y-4 min-h-[500px]">
                <div className="grid grid-cols-1 gap-4">
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
                            value={editData.fabricCotton || 0}
                            onChange={(e) => handleInputChange('fabricCotton', parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="fabricWool">Fabric Wool</Label>
                          <Input
                            id="fabricWool"
                            type="number"
                            value={editData.fabricWool || 0}
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
                            value={editData.threadA || 0}
                            onChange={(e) => handleInputChange('threadA', parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="threadB">Thread B</Label>
                          <Input
                            id="threadB"
                            type="number"
                            value={editData.threadB || 0}
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
                            value={editData.plank_A || 0}
                            onChange={(e) => handleInputChange('plank_A', parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="plank_B">Plank B</Label>
                          <Input
                            id="plank_B"
                            type="number"
                            value={editData.plank_B || 0}
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
                            value={editData.metalBar_A || 0}
                            onChange={(e) => handleInputChange('metalBar_A', parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="metalBar_B">Metal Bar B</Label>
                          <Input
                            id="metalBar_B"
                            type="number"
                            value={editData.metalBar_B || 0}
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
                            value={editData.softLeather || 0}
                            onChange={(e) => handleInputChange('softLeather', parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="thickLeather">Thick Leather</Label>
                          <Input
                            id="thickLeather"
                            type="number"
                            value={editData.thickLeather || 0}
                            onChange={(e) => handleInputChange('thickLeather', parseInt(e.target.value) || 0)}
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
                    <CardTitle>Administrative Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="foundedAt">Founded Date</Label>
                        <Input
                          id="foundedAt"
                          value={editData.foundedAt ? new Date(editData.foundedAt / 10000 - 62135596800000).toLocaleDateString() : ""}
                          disabled
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastsaved">Last Saved</Label>
                        <Input
                          id="lastsaved"
                          value={editData.lastsaved ? new Date(editData.lastsaved / 10000 - 62135596800000).toLocaleDateString() : ""}
                          disabled
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

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
                      Are you sure you want to update {editData.name}'s information? This action cannot be undone.
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
    </>
  );
};