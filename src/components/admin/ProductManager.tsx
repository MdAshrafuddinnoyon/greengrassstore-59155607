import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus, Pencil, Trash2, Package, RefreshCw } from "lucide-react";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { MediaPicker } from "./MediaPicker";

interface Product {
  id: string;
  name: string;
  name_ar?: string;
  slug: string;
  description?: string;
  price: number;
  compare_at_price?: number;
  currency: string;
  category: string;
  subcategory?: string;
  featured_image?: string;
  is_featured: boolean;
  is_on_sale: boolean;
  is_new: boolean;
  is_active: boolean;
  stock_quantity: number;
}

export const ProductManager = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { megaMenuCategories } = useSiteSettings();

  const categories = megaMenuCategories.filter(c => c.isActive).map(c => ({
    value: c.name.toLowerCase(),
    label: c.name
  }));

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleSave = async () => {
    if (!editingProduct?.name) { toast.error('Name required'); return; }
    setSaving(true);
    try {
      const slug = editingProduct.slug || editingProduct.name.toLowerCase().replace(/\s+/g, '-');
      const category = editingProduct.category || 'General';
      
      if (editingProduct.id) {
        const { error } = await supabase.from('products').update({
          name: editingProduct.name,
          name_ar: editingProduct.name_ar,
          slug,
          description: editingProduct.description,
          price: editingProduct.price || 0,
          compare_at_price: editingProduct.compare_at_price,
          currency: editingProduct.currency || 'AED',
          category,
          subcategory: editingProduct.subcategory,
          featured_image: editingProduct.featured_image,
          is_featured: editingProduct.is_featured || false,
          is_on_sale: editingProduct.is_on_sale || false,
          is_new: editingProduct.is_new || false,
          is_active: editingProduct.is_active ?? true,
          stock_quantity: editingProduct.stock_quantity || 0,
        }).eq('id', editingProduct.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('products').insert({
          name: editingProduct.name,
          name_ar: editingProduct.name_ar,
          slug,
          description: editingProduct.description,
          price: editingProduct.price || 0,
          compare_at_price: editingProduct.compare_at_price,
          currency: editingProduct.currency || 'AED',
          category,
          subcategory: editingProduct.subcategory,
          featured_image: editingProduct.featured_image,
          is_featured: editingProduct.is_featured || false,
          is_on_sale: editingProduct.is_on_sale || false,
          is_new: editingProduct.is_new || false,
          is_active: editingProduct.is_active ?? true,
          stock_quantity: editingProduct.stock_quantity || 0,
        });
        if (error) throw error;
      }
      toast.success('Product saved');
      setIsDialogOpen(false);
      fetchProducts();
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    await supabase.from('products').delete().eq('id', id);
    toast.success('Deleted');
    fetchProducts();
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin" /></div>;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2"><Package className="w-5 h-5" />Products ({products.length})</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchProducts}><RefreshCw className="w-4 h-4" /></Button>
            <Button size="sm" onClick={() => { setEditingProduct({ is_active: true, currency: 'AED', category: 'plants', stock_quantity: 10, price: 0 }); setIsDialogOpen(true); }}><Plus className="w-4 h-4 mr-1" />Add</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="mb-4" />
        <Table>
          <TableHeader><TableRow><TableHead>Image</TableHead><TableHead>Name</TableHead><TableHead>Category</TableHead><TableHead>Price</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {filtered.map(p => (
              <TableRow key={p.id}>
                <TableCell>{p.featured_image ? <img src={p.featured_image} className="w-10 h-10 object-cover rounded" /> : <Package className="w-10 h-10 text-muted-foreground" />}</TableCell>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell><Badge variant="outline">{p.category}</Badge></TableCell>
                <TableCell>{p.currency} {p.price}</TableCell>
                <TableCell><div className="flex gap-1">{p.is_active && <Badge className="bg-green-100 text-green-800">Active</Badge>}{p.is_on_sale && <Badge className="bg-red-100 text-red-800">Sale</Badge>}</div></TableCell>
                <TableCell><Button variant="ghost" size="icon" onClick={() => { setEditingProduct(p); setIsDialogOpen(true); }}><Pencil className="w-4 h-4" /></Button><Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)} className="text-destructive"><Trash2 className="w-4 h-4" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-auto">
          <DialogHeader><DialogTitle>{editingProduct?.id ? 'Edit' : 'Add'} Product</DialogTitle></DialogHeader>
          {editingProduct && (
            <div className="space-y-4">
              <div><Label>Name</Label><Input value={editingProduct.name || ''} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} /></div>
              <div><Label>Category</Label><Select value={editingProduct.category} onValueChange={v => setEditingProduct({...editingProduct, category: v})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{categories.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent></Select></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Price</Label><Input type="number" value={editingProduct.price || 0} onChange={e => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})} /></div>
                <div><Label>Compare Price</Label><Input type="number" value={editingProduct.compare_at_price || ''} onChange={e => setEditingProduct({...editingProduct, compare_at_price: parseFloat(e.target.value) || undefined})} /></div>
              </div>
              <MediaPicker 
                label="Product Image" 
                value={editingProduct.featured_image || ''} 
                onChange={(url) => setEditingProduct({...editingProduct, featured_image: url})}
                placeholder="Select or upload image"
              />
              <div className="flex gap-4 flex-wrap">
                <div className="flex items-center gap-2"><Switch checked={editingProduct.is_active} onCheckedChange={c => setEditingProduct({...editingProduct, is_active: c})} /><Label>Active</Label></div>
                <div className="flex items-center gap-2"><Switch checked={editingProduct.is_on_sale} onCheckedChange={c => setEditingProduct({...editingProduct, is_on_sale: c})} /><Label>Sale</Label></div>
                <div className="flex items-center gap-2"><Switch checked={editingProduct.is_new} onCheckedChange={c => setEditingProduct({...editingProduct, is_new: c})} /><Label>New</Label></div>
              </div>
              <div className="flex justify-end gap-2 pt-4"><Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button><Button onClick={handleSave} disabled={saving}>{saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}Save</Button></div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};
