import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { apiService, RewardRule, RewardTransaction } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Edit, Trash2, Gift, Search, CreditCard, Copy, Send, ArrowUpDown, ArrowUp, ArrowDown, X, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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
  const [transactionSearchTerm, setTransactionSearchTerm] = useState("");
  const [sortField, setSortField] = useState<'account' | 'paymail' | 'legacy_adr' | 'created' | 'note' | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [noteFilters, setNoteFilters] = useState<string[]>([]);
  const { toast } = useToast();

  const noteCategories = [
    "Battle",
    "WoodCutting",
    "Mining",
    "Gathering",
    "Hunting",
    "Carpentry",
    "Blacksmith",
    "Tailor",
    "Animal Work",
    "Potion"
  ];

  // Send reward dialog state
  const [sendRewardDialog, setSendRewardDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<RewardTransaction | null>(null);
  const [sendNote, setSendNote] = useState("");
  const [sendAmount, setSendAmount] = useState(0);
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [sendPassword, setSendPassword] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  const { data: rewardRules, isLoading } = useQuery({
    queryKey: ["rewardRules"],
    queryFn: () => apiService.getRewardRules(accessToken),
  });

  const { data: rewardTransactions, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ["rewardTransactions"],
    queryFn: () => apiService.getRewardTransactions(accessToken),
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
    mutationFn: ({ 0: ruleId, 1: data }: [number, any]) => apiService.updateRewardRule(ruleId, data, accessToken),
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
    mutationFn: (ruleId: number) => apiService.deleteRewardRule(ruleId, accessToken),
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
    mutationFn: (ruleData: Omit<RewardRule, 'rule_id' | 'created'>) => apiService.createRewardRule(ruleData, accessToken),
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

  const handleOpenSendReward = (transaction: RewardTransaction) => {
    setSelectedTransaction(transaction);
    // Extract level number from note if it exists (e.g., "lvl 5 WoodCutting bonus" -> 6)
    const levelMatch = transaction.note.match(/lvl (\d+)/);
    const nextLevel = levelMatch ? parseInt(levelMatch[1]) + 1 : 1;
    const notePrefix = transaction.note.replace(/lvl \d+/, `lvl ${nextLevel}`);
    setSendNote(notePrefix);
    setSendAmount(transaction.amount);
    setShowPasswordField(false);
    setSendPassword("");
    setSendRewardDialog(true);
  };

  const handleConfirmSendReward = () => {
    setShowPasswordField(true);
  };

  const handleSendReward = async () => {
    if (!selectedTransaction || !sendPassword) {
      toast({
        title: "Error",
        description: "Please enter password",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
      const response = await apiService.sendRewardByAdmin({
        key: selectedTransaction.account,
        walletAddress: selectedTransaction.legacy_adr,
        paymail: selectedTransaction.paymail,
        amount: sendAmount,
        note: sendNote,
        password: sendPassword,
      }, accessToken);

      toast({
        title: "Success",
        description: JSON.stringify(response),
      });

      // Refresh transactions
      queryClient.invalidateQueries({ queryKey: ["rewardTransactions"] });

      // Close dialog
      setSendRewardDialog(false);
      setSelectedTransaction(null);
      setShowPasswordField(false);
      setSendPassword("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to send reward",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleCancelSendReward = () => {
    setSendRewardDialog(false);
    setSelectedTransaction(null);
    setShowPasswordField(false);
    setSendPassword("");
  };

  // Filter rules based on search term
  const filteredRules = Array.isArray(rewardRules)
    ? rewardRules.filter(rule =>
      rule.skill_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : [];

  const toggleNoteFilter = (category: string) => {
    setNoteFilters(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const clearNoteFilters = () => {
    setNoteFilters([]);
  };

  // Filter and sort transactions
  const filteredAndSortedTransactions = Array.isArray(rewardTransactions)
    ? rewardTransactions
      .filter(transaction => {
        // Search term filter
        const matchesSearch = !transactionSearchTerm ||
          transaction.account.toLowerCase().includes(transactionSearchTerm.toLowerCase()) ||
          transaction.paymail.toLowerCase().includes(transactionSearchTerm.toLowerCase()) ||
          transaction.note.toLowerCase().includes(transactionSearchTerm.toLowerCase()) ||
          transaction.tx_hash.toLowerCase().includes(transactionSearchTerm.toLowerCase());

        // Note category filter
        const matchesNoteFilter = noteFilters.length === 0 ||
          noteFilters.some(filter => transaction.note.includes(filter));

        return matchesSearch && matchesNoteFilter;
      })
      .sort((a, b) => {
        if (!sortField) return 0;

        let aValue: string;
        let bValue: string;

        if (sortField === 'created') {
          // Sort by date
          aValue = a[sortField];
          bValue = b[sortField];
          const dateA = new Date(aValue).getTime();
          const dateB = new Date(bValue).getTime();
          return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        } else {
          // Sort by string fields
          aValue = (a[sortField] || '').toLowerCase();
          bValue = (b[sortField] || '').toLowerCase();

          if (sortOrder === 'asc') {
            return aValue.localeCompare(bValue);
          } else {
            return bValue.localeCompare(aValue);
          }
        }
      })
    : [];

  const handleSort = (field: 'account' | 'paymail' | 'legacy_adr' | 'created' | 'note') => {
    if (sortField === field) {
      // Toggle sort order
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to ascending
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field: 'account' | 'paymail' | 'legacy_adr' | 'created' | 'note') => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 ml-1" />;
    }
    return sortOrder === 'asc'
      ? <ArrowUp className="h-4 w-4 ml-1" />
      : <ArrowDown className="h-4 w-4 ml-1" />;
  };

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
          <p className="text-muted-foreground">Manage skill-based reward rules and transaction history</p>
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

      <Tabs defaultValue="rules" className="space-y-4">
        <TabsList>
          <TabsTrigger value="rules" className="flex items-center gap-2">
            <Gift className="h-4 w-4" />
            Reward Rules
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Transactions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-4">
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
                                              onChange={(e) => field.onChange(parseInt(e.target.value))}
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
                                              max={25}
                                              {...field}
                                              onChange={(e) => {
                                                let value = parseInt(e.target.value) || 0;
                                                field.onChange(Math.min(value, 25));
                                              }}
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
                                            onChange={(e) => {
                                              let value = parseInt(e.target.value) || 0;
                                              field.onChange(Math.min(value, 50));
                                            }}
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
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Search & Filter</CardTitle>
              <CardDescription>
                Find specific transactions by account, paymail, note, or transaction hash
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by account, paymail, note, or transaction hash..."
                  value={transactionSearchTerm}
                  onChange={(e) => setTransactionSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Reward Transactions
              </CardTitle>
              <CardDescription>
                View all reward payments and transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingTransactions ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-sm text-muted-foreground">Loading transactions...</p>
                  </div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <button
                          onClick={() => handleSort('account')}
                          className="flex items-center hover:text-primary transition-colors"
                        >
                          Account
                          {getSortIcon('account')}
                        </button>
                      </TableHead>
                      <TableHead>
                        <button
                          onClick={() => handleSort('paymail')}
                          className="flex items-center hover:text-primary transition-colors"
                        >
                          Paymail
                          {getSortIcon('paymail')}
                        </button>
                      </TableHead>
                      <TableHead>
                        <button
                          onClick={() => handleSort('legacy_adr')}
                          className="flex items-center hover:text-primary transition-colors"
                        >
                          Legacy Address
                          {getSortIcon('legacy_adr')}
                        </button>
                      </TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleSort('note')}
                            className="flex items-center hover:text-primary transition-colors"
                          >
                            Note
                            {getSortIcon('note')}
                          </button>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 relative"
                              >
                                <Filter className="h-4 w-4" />
                                {noteFilters.length > 0 && (
                                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                                    {noteFilters.length}
                                  </span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-64 p-0 bg-background z-50" align="start">
                              <div className="p-4 space-y-2">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium">Filter by Category</span>
                                  {noteFilters.length > 0 && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={clearNoteFilters}
                                      className="h-7 text-xs"
                                    >
                                      Clear
                                    </Button>
                                  )}
                                </div>
                                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                                  {noteCategories.map((category) => (
                                    <div key={category} className="flex items-center space-x-2">
                                      <Checkbox
                                        id={`category-${category}`}
                                        checked={noteFilters.includes(category)}
                                        onCheckedChange={() => toggleNoteFilter(category)}
                                      />
                                      <label
                                        htmlFor={`category-${category}`}
                                        className="text-sm cursor-pointer flex-1"
                                      >
                                        {category}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </TableHead>
                      <TableHead>Transaction Hash</TableHead>
                      <TableHead>
                        <button
                          onClick={() => handleSort('created')}
                          className="flex items-center hover:text-primary transition-colors"
                        >
                          Date
                          {getSortIcon('created')}
                        </button>
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.isArray(filteredAndSortedTransactions) && filteredAndSortedTransactions.length > 0 ? (
                      filteredAndSortedTransactions.map((transaction, index) => (
                        <TableRow key={`${transaction.tx_hash}-${index}`}>
                          <TableCell
                            className="font-mono text-sm cursor-pointer hover:text-primary transition-colors"
                            onClick={() => {
                              navigator.clipboard.writeText(transaction.account);
                              toast({
                                title: "Copied!",
                                description: "Account copied to clipboard",
                              });
                            }}
                            title="Click to copy account"
                          >
                            <div className="flex items-center gap-2">
                              {transaction.account}
                              <Copy className="h-3 w-3" />
                            </div>
                          </TableCell>
                          <TableCell
                            className="font-mono text-sm cursor-pointer hover:text-primary transition-colors"
                            onClick={() => {
                              navigator.clipboard.writeText(transaction.paymail);
                              toast({
                                title: "Copied!",
                                description: "Paymail copied to clipboard",
                              });
                            }}
                            title="Click to copy paymail"
                          >
                            <div className="flex items-center gap-2">
                              {transaction.paymail}
                              <Copy className="h-3 w-3" />
                            </div>
                          </TableCell>
                          <TableCell
                            className="font-mono text-xs text-muted-foreground cursor-pointer hover:text-primary transition-colors max-w-[150px]"
                            onClick={() => {
                              navigator.clipboard.writeText(transaction.legacy_adr);
                              toast({
                                title: "Copied!",
                                description: "Legacy address copied to clipboard",
                              });
                            }}
                            title="Click to copy full address"
                          >
                            <div className="flex items-center gap-2">
                              {transaction.legacy_adr.slice(0, 8)}...{transaction.legacy_adr.slice(-6)}
                              <Copy className="h-3 w-3" />
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold text-green-600">
                            +{transaction.amount.toLocaleString()}¢
                          </TableCell>
                          <TableCell>{transaction.note}</TableCell>
                          <TableCell
                            className="font-mono text-xs text-muted-foreground cursor-pointer hover:text-primary transition-colors"
                            onClick={() => {
                              navigator.clipboard.writeText(transaction.tx_hash);
                              toast({
                                title: "Copied!",
                                description: "Transaction hash copied to clipboard",
                              });
                            }}
                            title="Click to copy full hash"
                          >
                            <div className="flex items-center gap-2">
                              {transaction.tx_hash.slice(0, 8)}...{transaction.tx_hash.slice(-8)}
                              <Copy className="h-3 w-3" />
                            </div>
                          </TableCell>
                          <TableCell>{transaction.created}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenSendReward(transaction)}
                              title="Send reward manually"
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                          {transactionSearchTerm ? `No transactions found for "${transactionSearchTerm}"` : "No reward transactions found"}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Send Reward Dialog */}
      <Dialog open={sendRewardDialog} onOpenChange={setSendRewardDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Send Reward Manually</DialogTitle>
            <DialogDescription>
              Send a reward to the selected account
            </DialogDescription>
          </DialogHeader>

          {selectedTransaction && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Account</Label>
                <div className="text-sm font-mono bg-muted p-2 rounded">
                  {selectedTransaction.account}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Paymail</Label>
                <div className="text-sm font-mono bg-muted p-2 rounded">
                  {selectedTransaction.paymail}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Legacy Address</Label>
                <div className="text-sm font-mono bg-muted p-2 rounded break-all">
                  {selectedTransaction.legacy_adr}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="send-note">Note</Label>
                <Input
                  id="send-note"
                  value={sendNote}
                  onChange={(e) => setSendNote(e.target.value)}
                  placeholder="Enter note"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="send-amount">Amount to Send (cents)</Label>
                <Input
                  id="send-amount"
                  type="number"
                  value={sendAmount}
                  onChange={(e) => setSendAmount(parseInt(e.target.value) || 0)}
                  placeholder="Enter amount"
                />
              </div>

              {showPasswordField && (
                <div className="space-y-2">
                  <Label htmlFor="send-password">Password</Label>
                  <Input
                    id="send-password"
                    type="password"
                    value={sendPassword}
                    onChange={(e) => setSendPassword(e.target.value)}
                    placeholder="Enter password"
                  />
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            {!showPasswordField ? (
              <>
                <Button variant="outline" onClick={handleCancelSendReward}>
                  Cancel
                </Button>
                <Button onClick={handleConfirmSendReward}>
                  Confirm
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => setShowPasswordField(false)}
                  disabled={isSending}
                >
                  Back
                </Button>
                <Button
                  onClick={handleSendReward}
                  disabled={isSending || !sendPassword}
                >
                  {isSending ? "Sending..." : "Send"}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Rewards;