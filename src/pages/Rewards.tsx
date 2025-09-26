import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService, RewardRule } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Edit, Trash2, Gift, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const rewardRuleSchema = z.object({
  skill_name: z.string().min(1, "Skill name is required"),
  min_level: z.number().min(1, "Min level must be at least 1"),
  max_level: z.number().min(1, "Max level must be at least 1"),
  reward_amount: z.number().min(0, "Reward amount must be positive"),
  active: z.boolean(),
});

type RewardRuleFormData = z.infer<typeof rewardRuleSchema>;

const Rewards = () => {
  const [editingRule, setEditingRule] = useState<RewardRule | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: rewardRules, isLoading } = useQuery({
    queryKey: ["rewardRules"],
    queryFn: apiService.getRewardRules,
  });

  const form = useForm<RewardRuleFormData>({
    resolver: zodResolver(rewardRuleSchema),
    defaultValues: {
      skill_name: "",
      min_level: 1,
      max_level: 1,
      reward_amount: 0,
      active: true,
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ 0: ruleId, 1: data }: [number, any]) => apiService.updateRewardRule(ruleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rewardRules"] });
      setIsDialogOpen(false);
      setEditingRule(null);
      toast({
        title: "Success",
        description: "Reward rule updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update reward rule",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: apiService.deleteRewardRule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rewardRules"] });
      toast({
        title: "Success",
        description: "Reward rule deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete reward rule",
        variant: "destructive",
      });
    },
  });

  const createMutation = useMutation({
    mutationFn: apiService.createRewardRule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rewardRules"] });
      setIsDialogOpen(false);
      setEditingRule(null);
      form.reset();
      toast({
        title: "Success",
        description: "Reward rule created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create reward rule",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (rule: RewardRule) => {
    setEditingRule(rule);
    form.reset({
      skill_name: rule.skill_name,
      min_level: rule.min_level,
      max_level: rule.max_level,
      reward_amount: rule.reward_amount,
      active: rule.active === 1,
    });
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingRule(null);
    form.reset({
      skill_name: "",
      min_level: 1,
      max_level: 1,
      reward_amount: 0,
      active: true,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (ruleId: number) => {
    deleteMutation.mutate(ruleId);
  };

  const onSubmit = (data: RewardRuleFormData) => {
    const ruleData = {
      skill_name: data.skill_name,
      min_level: data.min_level,
      max_level: data.max_level,
      reward_amount: data.reward_amount,
      active: data.active ? 1 : 0,
    };
    
    if (editingRule) {
      updateMutation.mutate([editingRule.rule_id, ruleData]);
    } else {
      createMutation.mutate(ruleData);
    }
  };

  // Filter rules based on search term
  const filteredRules = Array.isArray(rewardRules) 
    ? rewardRules.filter(rule => 
        rule.skill_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading reward rules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reward Management</h1>
          <p className="text-muted-foreground">Manage skill-based reward rules and configurations</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">
              {Array.isArray(rewardRules) ? rewardRules.filter(rule => rule.active === 1).length : 0} Active Rules
            </span>
          </div>
          <Button onClick={handleCreate}>
            Create New Rule
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>
            Find specific reward rules by skill name
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by skill name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reward Rules</CardTitle>
          <CardDescription>
            Configure reward amounts and level requirements for different skills
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Skill Name</TableHead>
                <TableHead>Level Range</TableHead>
                <TableHead>Reward Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRules.map((rule) => (
                <TableRow key={rule.rule_id}>
                  <TableCell className="font-medium">{rule.skill_name}</TableCell>
                  <TableCell>
                    {rule.min_level} - {rule.max_level}
                  </TableCell>
                  <TableCell className="font-mono">{rule.reward_amount.toLocaleString()}¢</TableCell>
                  <TableCell>
                    <Badge variant={rule.active === 1 ? "default" : "secondary"}>
                      {rule.active === 1 ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>{rule.created}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(rule)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>
                              {editingRule ? "Edit Reward Rule" : "Create New Reward Rule"}
                            </DialogTitle>
                            <DialogDescription>
                              {editingRule 
                                ? `Modify the reward rule configuration for ${editingRule.skill_name}`
                                : "Create a new reward rule configuration"
                              }
                            </DialogDescription>
                          </DialogHeader>
                          <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                              <FormField
                                control={form.control}
                                name="skill_name"
                                render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Skill Name</FormLabel>
                                      <FormControl>
                                        <Input {...field} disabled={!!editingRule} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                )}
                              />
                              <div className="grid grid-cols-2 gap-4">
                                <FormField
                                  control={form.control}
                                  name="min_level"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Min Level</FormLabel>
                                      <FormControl>
                                        <Input
                                          type="number"
                                          {...field}
                                          disabled
                                          // onChange={(e) => field.onChange(parseInt(e.target.value))}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name="max_level"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Max Level</FormLabel>
                                      <FormControl>
                                        <Input
                                          type="number"
                                          {...field}
                                          disabled
                                          // onChange={(e) => field.onChange(parseInt(e.target.value))}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              <FormField
                                control={form.control}
                                name="reward_amount"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Reward Amount(¢)</FormLabel>
                                    <FormControl>
                                      <Input
                                        type="number"
                                        {...field}
                                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="active"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                    <div className="space-y-0.5">
                                      <FormLabel>Active Status</FormLabel>
                                      <div className="text-sm text-muted-foreground">
                                        Enable or disable this reward rule
                                      </div>
                                    </div>
                                    <FormControl>
                                      <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                              <div className="flex justify-end gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => setIsDialogOpen(false)}
                                >
                                  Cancel
                                </Button>
                                <Button type="submit" disabled={updateMutation.isPending || createMutation.isPending}>
                                  {editingRule 
                                    ? (updateMutation.isPending ? "Updating..." : "Update Rule")
                                    : (createMutation.isPending ? "Creating..." : "Create Rule")
                                  }
                                </Button>
                              </div>
                            </form>
                          </Form>
                        </DialogContent>
                      </Dialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Reward Rule</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete the reward rule for "{rule.skill_name}"? 
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(rule.rule_id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                 </TableRow>
               ))}
               {filteredRules.length === 0 && !isLoading && (
                 <TableRow>
                   <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                     {searchTerm ? `No reward rules found for "${searchTerm}"` : "No reward rules available"}
                   </TableCell>
                 </TableRow>
               )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Rewards;