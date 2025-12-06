import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, FolderTree, Plus, Pencil, Trash2, Save, RefreshCw } from "lucide-react";
import { MediaPicker } from "./MediaPicker";
import { ExportButtons } from "./ExportButtons";

interface Category {
  id: string;
  name: string;
  name_ar: string | null;
  slug: string;
  description: string | null;
  description_ar: string | null;
  image: string | null;
  parent_id: string | null;
  is_active: boolean;
  display_order: number;
}

export const LocalCategoryManager = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSave = async () => {
    if (!editingCategory?.name) {
      toast.error('Category name is required');
      return;
    }

    setSaving(true);
    try {
      const slug = editingCategory.slug || editingCategory.name.toLowerCase().replace(/\s+/g, '-');
      
      if (editingCategory.id) {
        // Update
        const { error } = await supabase
          .from('categories')
          .update({
            name: editingCategory.name,
            name_ar: editingCategory.name_ar,
            slug,
            description: editingCategory.description,
            description_ar: editingCategory.description_ar,
            image: editingCategory.image,
            is_active: editingCategory.is_active ?? true,
            display_order: editingCategory.display_order || 0
          })
          .eq('id', editingCategory.id);
        
        if (error) throw error;
        toast.success('Category updated');
      } else {
        // Insert
        const { error } = await supabase
          .from('categories')
          .insert({
            name: editingCategory.name,
            name_ar: editingCategory.name_ar,
            slug,
            description: editingCategory.description,
            description_ar: editingCategory.description_ar,
            image: editingCategory.image,
            is_active: editingCategory.is_active ?? true,
            display_order: editingCategory.display_order || categories.length + 1
          });
        
        if (error) throw error;
        toast.success('Category created');
      }

      setIsDialogOpen(false);
      setEditingCategory(null);
      fetchCategories();
    } catch (error: any) {
      console.error('Error saving category:', error);
      toast.error(error.message || 'Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Category deleted');
      fetchCategories();
    } catch (error: any) {
      console.error('Error deleting category:', error);
      toast.error(error.message || 'Failed to delete category');
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingCategory({
      name: '',
      name_ar: '',
      slug: '',
      description: '',
      image: '',
      is_active: true,
      display_order: categories.length + 1
    });
    setIsDialogOpen(true);
  };

  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-primary" />
                Category Management
              </CardTitle>
              <CardDescription>
                {categories.length} categories
              </CardDescription>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" size="sm" onClick={fetchCategories}>
                <RefreshCw className="w-4 h-4 mr-1" />
                Refresh
              </Button>
              <ExportButtons 
                data={categories} 
                filename={`categories-${new Date().toISOString().split('T')[0]}`}
              />
              <Button onClick={handleAdd}>
                <Plus className="w-4 h-4 mr-1" />
                Add Category
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="mb-4">
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Table */}
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Order</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <FolderTree className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No categories found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>{category.display_order}</TableCell>
                      <TableCell>
                        {category.image ? (
                          <img 
                            src={category.image} 
                            alt={category.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                            <FolderTree className="w-5 h-5 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{category.name}</div>
                        {category.name_ar && (
                          <div className="text-sm text-muted-foreground" dir="rtl">{category.name_ar}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-xs">
                          {category.slug}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={category.is_active ? "default" : "secondary"}>
                          {category.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(category)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(category.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingCategory?.id ? 'Edit Category' : 'Add Category'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <MediaPicker
              label="Category Image"
              value={editingCategory?.image || ''}
              onChange={(url) => setEditingCategory(prev => ({ ...prev, image: url }))}
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name (EN) *</Label>
                <Input
                  value={editingCategory?.name || ''}
                  onChange={(e) => setEditingCategory(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Category name"
                />
              </div>
              <div className="space-y-2">
                <Label>Name (AR)</Label>
                <Input
                  value={editingCategory?.name_ar || ''}
                  onChange={(e) => setEditingCategory(prev => ({ ...prev, name_ar: e.target.value }))}
                  placeholder="اسم الفئة"
                  dir="rtl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Slug</Label>
              <Input
                value={editingCategory?.slug || ''}
                onChange={(e) => setEditingCategory(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="category-slug (auto-generated if empty)"
              />
            </div>

            <div className="space-y-2">
              <Label>Display Order</Label>
              <Input
                type="number"
                value={editingCategory?.display_order || 0}
                onChange={(e) => setEditingCategory(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <Label>Active</Label>
              <Switch
                checked={editingCategory?.is_active ?? true}
                onCheckedChange={(checked) => setEditingCategory(prev => ({ ...prev, is_active: checked }))}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
