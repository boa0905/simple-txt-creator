import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Trash2, Edit, Plus } from "lucide-react";
import { apiService, NewsArticle } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const News = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsArticle | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    img_url: ""
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: news = [], isLoading, error } = useQuery({
    queryKey: ["news"],
    queryFn: apiService.getNews,
    retry: false,
  });

  // Show error toast when error occurs
  useEffect(() => {
    if (error) {
      console.error("Failed to fetch news:", error);
      toast({
        title: "Failed to load news",
        description: "Please check your API configuration",
        variant: "destructive"
      });
    }
  }, [error, toast]);

  // Ensure news is always an array
  const newsArray = Array.isArray(news) ? news : [];

  const createMutation = useMutation({
    mutationFn: apiService.createNews,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
      setIsCreateDialogOpen(false);
      setFormData({ title: "", content: "", img_url: "" });
      toast({ title: "News article created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create news article", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Omit<NewsArticle, 'id' | 'created'> }) =>
      apiService.updateNews(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
      setIsEditDialogOpen(false);
      setEditingNews(null);
      setFormData({ title: "", content: "", img_url: "" });
      toast({ title: "News article updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update news article", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: apiService.deleteNews,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
      toast({ title: "News article deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete news article", variant: "destructive" });
    },
  });

  const handleCreate = () => {
    if (!formData.title || !formData.content) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    createMutation.mutate(formData);
  };

  const handleEdit = (newsItem: NewsArticle) => {
    setEditingNews(newsItem);
    setFormData({
      title: newsItem.title,
      content: newsItem.content,
      img_url: newsItem.img_url
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!editingNews || !formData.title || !formData.content) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    updateMutation.mutate({ id: editingNews.id, data: formData });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading news articles...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-destructive mb-4">Failed to load news articles</p>
            <p className="text-sm text-muted-foreground">
              Please check your API configuration. The API URL appears to be undefined.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">News</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add News Article
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create News Article</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter news title"
                />
              </div>
              <div>
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Enter news content"
                  rows={6}
                />
              </div>
              <div>
                <Label htmlFor="img_url">Image URL</Label>
                <Input
                  id="img_url"
                  value={formData.img_url}
                  onChange={(e) => setFormData({ ...formData, img_url: e.target.value })}
                  placeholder="Enter image URL (optional)"
                />
              </div>
              <Button onClick={handleCreate} disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creating..." : "Create Article"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {newsArray.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="pt-6 text-center text-muted-foreground">
              No news articles found. Create your first news article to get started.
            </CardContent>
          </Card>
        ) : (
          newsArray.map((article) => (
            <Card key={article.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{article.title}</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(article)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteMutation.mutate(article.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  {article.img_url && (
                    <div className="w-48 aspect-[3/2] flex-shrink-0 bg-muted rounded-md flex items-center justify-center">
                      <img
                        src={article.img_url}
                        alt={article.title}
                        className="w-full h-full object-contain rounded-md"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <div className="flex-1 space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Published: {formatDate(article.created)}
                    </p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {article.content}
                    </p>
                  </div>
                </div>
              </CardContent>


            </Card>
          ))
        )}
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit News Article</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Title *</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter news title"
              />
            </div>
            <div>
              <Label htmlFor="edit-content">Content *</Label>
              <Textarea
                id="edit-content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Enter news content"
                rows={6}
              />
            </div>
            <div>
              <Label htmlFor="edit-img_url">Image URL</Label>
              <Input
                id="edit-img_url"
                value={formData.img_url}
                onChange={(e) => setFormData({ ...formData, img_url: e.target.value })}
                placeholder="Enter image URL (optional)"
              />
            </div>
            <Button onClick={handleUpdate} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Updating..." : "Update Article"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default News;