import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
<<<<<<< HEAD
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Pencil, Trash2, Eye, Loader2 } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
=======
import { Plus, Pencil, Trash2, Eye, Loader2 } from "lucide-react";
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MediaPicker } from "./MediaPicker";
import { ExportButtons } from "./ExportButtons";
import { RichTextEditor } from "./RichTextEditor";
import { AIContentGenerator } from "./AIContentGenerator";
<<<<<<< HEAD
import { WordPressImporter } from "./WordPressImporter";
=======
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  status: string;
  featured_image: string | null;
  author_name: string;
  reading_time: number;
  view_count: number;
  is_featured: boolean;
  published_at: string | null;
  created_at: string;
}

export const BlogManager = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
<<<<<<< HEAD
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkCategory, setBulkCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
=======
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "General",
    status: "draft",
    featured_image: "",
    author_name: "Green Grass Team",
    reading_time: 5,
  });

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching posts:", error);
    } else {
      setPosts(data || []);
    }
    setLoading(false);
  };

<<<<<<< HEAD
  const fetchCategories = async (fallbackPosts?: BlogPost[]) => {
    try {
      const { data, error } = await supabase
        .from("blog_categories")
        .select("name")
        .order("name", { ascending: true });

      if (error) throw error;

      const names = (data || []).map((c: { name: string }) => c.name).filter(Boolean);
      setCategories(Array.from(new Set(names)));
    } catch (err) {
      // Fallback to categories derived from posts if dedicated table not available
      const source = fallbackPosts || posts;
      const derived = Array.from(new Set(source.map((p) => p.category).filter(Boolean))).sort();
      setCategories(derived);
    }
  };

  useEffect(() => {
    const load = async () => {
      await fetchPosts();
      await fetchCategories();
    };
    load();
=======
  useEffect(() => {
    fetchPosts();
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066

    // Real-time subscription for blog posts
    const channel = supabase
      .channel('admin-blog-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'blog_posts' },
        () => {
          fetchPosts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

<<<<<<< HEAD
  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter, posts.length, itemsPerPage]);

=======
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const postData = {
      ...formData,
      slug: formData.slug || generateSlug(formData.title),
      published_at: formData.status === "published" ? new Date().toISOString() : null,
    };

    if (editingPost) {
      const { error } = await supabase
        .from("blog_posts")
        .update(postData)
        .eq("id", editingPost.id);

      if (error) {
        toast.error("Failed to update post");
        console.error(error);
      } else {
        toast.success("Post updated successfully");
        setIsDialogOpen(false);
        fetchPosts();
      }
    } else {
      const { error } = await supabase
        .from("blog_posts")
        .insert([postData]);

      if (error) {
        toast.error("Failed to create post");
        console.error(error);
      } else {
        toast.success("Post created successfully");
        setIsDialogOpen(false);
        fetchPosts();
      }
    }

    resetForm();
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      status: post.status,
      featured_image: post.featured_image || "",
      author_name: post.author_name,
      reading_time: post.reading_time,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    const { error } = await supabase
      .from("blog_posts")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete post");
      console.error(error);
    } else {
      toast.success("Post deleted successfully");
      fetchPosts();
    }
  };

  const resetForm = () => {
    setEditingPost(null);
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      category: "General",
      status: "draft",
      featured_image: "",
      author_name: "Green Grass Team",
      reading_time: 5,
    });
  };

  const openNewPostDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

<<<<<<< HEAD
  const handleAddCategory = async () => {
    const name = newCategory.trim();
    if (!name) return;
    try {
      const exists = categories.includes(name);
      if (exists) {
        toast.info("Category already exists");
        return;
      }

      // Try to persist to blog_categories; if table missing, ignore error but keep local
      const { error } = await supabase
        .from('blog_categories')
        .insert({ name });

      if (error) {
        console.warn('blog_categories insert failed (table may not exist)', error);
      }

      setCategories((prev) => [...prev, name].sort());
      setNewCategory("");
      toast.success("Category added");
    } catch (err) {
      console.error('Category add error:', err);
      toast.error('Failed to add category');
    }
  };

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(displayedPosts.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleRow = (id: string, checked: boolean) => {
    setSelectedIds((prev) => checked ? Array.from(new Set([...prev, id])) : prev.filter((x) => x !== id));
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Delete ${selectedIds.length} selected posts?`)) return;
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .in('id', selectedIds);

    if (error) {
      toast.error('Bulk delete failed');
      console.error(error);
    } else {
      toast.success('Selected posts deleted');
      setSelectedIds([]);
      fetchPosts();
      fetchCategories();
    }
  };

  const handleSelectByCategory = () => {
    if (bulkCategory === 'all') {
      setSelectedIds(filteredPosts.map((p) => p.id));
    } else {
      setSelectedIds(filteredPosts.filter((p) => p.category === bulkCategory).map((p) => p.id));
    }
  };

  const categoryOptions = categories;
  const filteredPosts = categoryFilter === "all"
    ? posts
    : posts.filter((p) => p.category === categoryFilter);
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / itemsPerPage));
  const pageStart = (currentPage - 1) * itemsPerPage;
  const displayedPosts = filteredPosts.slice(pageStart, pageStart + itemsPerPage);

=======
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Blog Posts</CardTitle>
            <CardDescription>Manage your blog content</CardDescription>
          </div>
<<<<<<< HEAD
          <div className="flex gap-2 flex-wrap justify-end">
            <WordPressImporter />
            <ExportButtons data={posts} filename="blog_posts" />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categoryOptions.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
=======
          <div className="flex gap-2">
            <ExportButtons data={posts} filename="blog_posts" />
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openNewPostDialog}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingPost ? "Edit Post" : "Create New Post"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="title">Title</Label>
                      <AIContentGenerator 
                        type="blog" 
                        onGenerate={(c) => c.title && setFormData({ ...formData, title: c.title })} 
                      />
                    </div>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="Auto-generated from title"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Input
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    required
                    placeholder="Short description for the blog post"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Content</Label>
                  <RichTextEditor
                    content={formData.content}
                    onChange={(content) => setFormData({ ...formData, content })}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
<<<<<<< HEAD
                    <Input
                      list="blog-category-options"
                      placeholder="e.g. Plant Care"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value || "General" })}
                    />
                    <datalist id="blog-category-options">
                      {categoryOptions.map((cat) => (
                        <option key={cat} value={cat} />
                      ))}
                    </datalist>
=======
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="General">General</SelectItem>
                        <SelectItem value="Plant Care">Plant Care</SelectItem>
                        <SelectItem value="Tips & Tricks">Tips & Tricks</SelectItem>
                        <SelectItem value="Inspiration">Inspiration</SelectItem>
                        <SelectItem value="News">News</SelectItem>
                      </SelectContent>
                    </Select>
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reading_time">Reading Time (min)</Label>
                    <Input
                      id="reading_time"
                      type="number"
                      value={formData.reading_time}
                      onChange={(e) => setFormData({ ...formData, reading_time: parseInt(e.target.value) || 5 })}
                    />
                  </div>
                </div>

                <MediaPicker
                  label="Featured Image"
                  value={formData.featured_image}
                  onChange={(url) => setFormData({ ...formData, featured_image: url })}
                  placeholder="Select or enter image URL"
                  folder="blog"
                />

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingPost ? "Update Post" : "Create Post"}
                  </Button>
                </div>
              </form>
            </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
<<<<<<< HEAD
        ) : filteredPosts.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No blog posts yet</p>
        ) : (
          <div className="overflow-x-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={displayedPosts.length > 0 && displayedPosts.every((p) => selectedIds.includes(p.id))}
                  onCheckedChange={(c) => toggleSelectAll(Boolean(c))}
                  aria-label="Select all"
                />
                <span className="text-sm text-muted-foreground">Select all in view</span>
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <Select value={bulkCategory} onValueChange={setBulkCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categoryOptions.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={handleSelectByCategory}>
                  Select by Category
                </Button>
                <Button variant="destructive" size="sm" onClick={handleBulkDelete} disabled={selectedIds.length === 0}>
                  Delete Selected ({selectedIds.length})
                </Button>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="New category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-36"
                  />
                  <Button type="button" variant="outline" size="sm" onClick={handleAddCategory}>
                    Add
                  </Button>
                </div>
                <Select value={itemsPerPage.toString()} onValueChange={(v) => { setItemsPerPage(Number(v)); setCurrentPage(1); }}>
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="Per page" />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 10, 20, 50].map((n) => (
                      <SelectItem key={n} value={n.toString()}>{n} / page</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox
                      checked={displayedPosts.length > 0 && displayedPosts.every((p) => selectedIds.includes(p.id))}
                      onCheckedChange={(c) => toggleSelectAll(Boolean(c))}
                      aria-label="Select all"
                    />
                  </TableHead>
=======
        ) : posts.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No blog posts yet</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
<<<<<<< HEAD
                {displayedPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(post.id)}
                        onCheckedChange={(c) => toggleRow(post.id, Boolean(c))}
                        aria-label="Select row"
                      />
                    </TableCell>
=======
                {posts.map((post) => (
                  <TableRow key={post.id}>
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>{post.category}</TableCell>
                    <TableCell>
                      <Badge variant={post.status === "published" ? "default" : "secondary"}>
                        {post.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{post.view_count}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="icon" variant="ghost" asChild>
                          <a href={`/blog/${post.slug}`} target="_blank">
                            <Eye className="w-4 h-4" />
                          </a>
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => handleEdit(post)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => handleDelete(post.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
<<<<<<< HEAD
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {displayedPosts.length} of {filteredPosts.length} posts
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage((p) => Math.max(1, p - 1));
                      }}
                      aria-disabled={currentPage === 1}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }).slice(0, 5).map((_, idx) => {
                    const pageNumber = idx + 1;
                    if (pageNumber > totalPages) return null;
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          href="#"
                          isActive={pageNumber === currentPage}
                          onClick={(e) => { e.preventDefault(); setCurrentPage(pageNumber); }}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage((p) => Math.min(totalPages, p + 1));
                      }}
                      aria-disabled={currentPage === totalPages}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
=======
>>>>>>> dfcf12d2b1fa1c8d28b54c9344caef07b69c8066
          </div>
        )}
      </CardContent>
    </Card>
  );
};
