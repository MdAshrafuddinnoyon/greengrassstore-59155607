import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus, Pencil, Trash2, Package, RefreshCw, X, Copy, Eye } from "lucide-react";
import { MediaPicker } from "./MediaPicker";
import { ExportButtons } from "./ExportButtons";

interface ProductVariant {
  id?: string;
  sku?: string;
  price: number;
  compare_at_price?: number;
  stock_quantity: number;
  is_active: boolean;
  option1_name?: string;
  option1_value?: string;
  option2_name?: string;
  option2_value?: string;
  option3_name?: string;
  option3_value?: string;
  image_url?: string;
}

interface Product {
  id: string;
  name: string;
  name_ar?: string;
  slug: string;
  description?: string;
  description_ar?: string;
  price: number;
  compare_at_price?: number;
  currency: string;
  category: string;
  subcategory?: string;
  featured_image?: string;
  images?: string[];
  is_featured: boolean;
  is_on_sale: boolean;
  is_new: boolean;
  is_active: boolean;
  stock_quantity: number;
  sku?: string;
  tags?: string[];
  product_type: 'simple' | 'variable';
  option1_name?: string;
  option1_values?: string[];
  option2_name?: string;
  option2_values?: string[];
  option3_name?: string;
  option3_values?: string[];
  variants?: ProductVariant[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id?: string;
}

export const ProductManager = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [newOptionValue, setNewOptionValue] = useState({ opt1: "", opt2: "", opt3: "" });

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*').eq('is_active', true).order('display_order');
    setCategories(data || []);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Fetch variants for variable products
      const productsWithVariants = await Promise.all((data || []).map(async (product) => {
        const typedProduct = {
          ...product,
          product_type: (product.product_type || 'simple') as 'simple' | 'variable',
        };
        
        if (typedProduct.product_type === 'variable') {
          const { data: variants } = await supabase
            .from('product_variants')
            .select('*')
            .eq('product_id', product.id);
          return { ...typedProduct, variants: variants || [] };
        }
        return typedProduct;
      }));
      
      setProducts(productsWithVariants as Product[]);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchProducts(); 
    fetchCategories();
  }, []);

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleSave = async () => {
    if (!editingProduct?.name) { 
      toast.error('Product name is required'); 
      return; 
    }
    
    setSaving(true);
    try {
      const slug = editingProduct.slug || generateSlug(editingProduct.name);
      const category = editingProduct.category || 'general';
      
      const productData = {
        name: editingProduct.name,
        name_ar: editingProduct.name_ar || null,
        slug,
        description: editingProduct.description || null,
        description_ar: editingProduct.description_ar || null,
        price: editingProduct.price || 0,
        compare_at_price: editingProduct.compare_at_price || null,
        currency: editingProduct.currency || 'AED',
        category,
        subcategory: editingProduct.subcategory || null,
        featured_image: editingProduct.featured_image || null,
        images: editingProduct.images || [],
        is_featured: editingProduct.is_featured || false,
        is_on_sale: editingProduct.is_on_sale || false,
        is_new: editingProduct.is_new || false,
        is_active: editingProduct.is_active ?? true,
        stock_quantity: editingProduct.stock_quantity || 0,
        sku: editingProduct.sku || null,
        tags: editingProduct.tags || [],
        product_type: editingProduct.product_type || 'simple',
        option1_name: editingProduct.option1_name || null,
        option1_values: editingProduct.option1_values || [],
        option2_name: editingProduct.option2_name || null,
        option2_values: editingProduct.option2_values || [],
        option3_name: editingProduct.option3_name || null,
        option3_values: editingProduct.option3_values || [],
      };

      let productId = editingProduct.id;

      if (editingProduct.id) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('products')
          .insert(productData)
          .select()
          .single();
        if (error) throw error;
        productId = data.id;
      }

      // Handle variants for variable products
      if (editingProduct.product_type === 'variable' && productId) {
        // Delete existing variants
        await supabase.from('product_variants').delete().eq('product_id', productId);
        
        // Insert new variants
        if (editingProduct.variants && editingProduct.variants.length > 0) {
          const variantsToInsert = editingProduct.variants.map(v => ({
            product_id: productId,
            sku: v.sku,
            price: v.price,
            compare_at_price: v.compare_at_price,
            stock_quantity: v.stock_quantity,
            is_active: v.is_active,
            option1_name: v.option1_name,
            option1_value: v.option1_value,
            option2_name: v.option2_name,
            option2_value: v.option2_value,
            option3_name: v.option3_name,
            option3_value: v.option3_value,
            image_url: v.image_url,
          }));
          
          const { error: variantError } = await supabase
            .from('product_variants')
            .insert(variantsToInsert);
          
          if (variantError) throw variantError;
        }
      }

      toast.success('Product saved successfully');
      setIsDialogOpen(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      toast.success('Product deleted');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const handleDuplicate = (product: Product) => {
    const duplicated = {
      ...product,
      id: undefined,
      name: `${product.name} (Copy)`,
      slug: `${product.slug}-copy`,
      variants: product.variants?.map(v => ({ ...v, id: undefined })),
    };
    setEditingProduct(duplicated);
    setIsDialogOpen(true);
  };

  const openNewProduct = () => {
    setEditingProduct({
      is_active: true,
      currency: 'AED',
      category: categories[0]?.slug || 'general',
      stock_quantity: 10,
      price: 0,
      product_type: 'simple',
      images: [],
      tags: [],
      option1_values: [],
      option2_values: [],
      option3_values: [],
      variants: [],
    });
    setActiveTab("general");
    setIsDialogOpen(true);
  };

  const addOptionValue = (optionNum: 1 | 2 | 3) => {
    const key = `opt${optionNum}` as 'opt1' | 'opt2' | 'opt3';
    const value = newOptionValue[key].trim();
    if (!value) return;

    const valuesKey = `option${optionNum}_values` as keyof Product;
    const currentValues = (editingProduct?.[valuesKey] as string[]) || [];
    
    if (!currentValues.includes(value)) {
      setEditingProduct({
        ...editingProduct,
        [valuesKey]: [...currentValues, value],
      });
    }
    setNewOptionValue({ ...newOptionValue, [key]: "" });
  };

  const removeOptionValue = (optionNum: 1 | 2 | 3, value: string) => {
    const valuesKey = `option${optionNum}_values` as keyof Product;
    const currentValues = (editingProduct?.[valuesKey] as string[]) || [];
    setEditingProduct({
      ...editingProduct,
      [valuesKey]: currentValues.filter(v => v !== value),
    });
  };

  const generateVariants = () => {
    if (!editingProduct) return;
    
    const opt1Values = editingProduct.option1_values || [];
    const opt2Values = editingProduct.option2_values || [];
    const opt3Values = editingProduct.option3_values || [];
    
    const variants: ProductVariant[] = [];
    
    const addVariant = (o1?: string, o2?: string, o3?: string) => {
      variants.push({
        price: editingProduct.price || 0,
        stock_quantity: 10,
        is_active: true,
        option1_name: editingProduct.option1_name,
        option1_value: o1,
        option2_name: editingProduct.option2_name,
        option2_value: o2,
        option3_name: editingProduct.option3_name,
        option3_value: o3,
      });
    };

    if (opt1Values.length === 0) {
      addVariant();
    } else if (opt2Values.length === 0) {
      opt1Values.forEach(o1 => addVariant(o1));
    } else if (opt3Values.length === 0) {
      opt1Values.forEach(o1 => opt2Values.forEach(o2 => addVariant(o1, o2)));
    } else {
      opt1Values.forEach(o1 => opt2Values.forEach(o2 => opt3Values.forEach(o3 => addVariant(o1, o2, o3))));
    }

    setEditingProduct({ ...editingProduct, variants });
    toast.success(`Generated ${variants.length} variants`);
  };

  const updateVariant = (index: number, field: keyof ProductVariant, value: any) => {
    if (!editingProduct?.variants) return;
    const updated = [...editingProduct.variants];
    updated[index] = { ...updated[index], [field]: value };
    setEditingProduct({ ...editingProduct, variants: updated });
  };

  const removeVariant = (index: number) => {
    if (!editingProduct?.variants) return;
    setEditingProduct({
      ...editingProduct,
      variants: editingProduct.variants.filter((_, i) => i !== index),
    });
  };

  const addGalleryImage = (url: string) => {
    if (!url || !editingProduct) return;
    const images = editingProduct.images || [];
    if (!images.includes(url)) {
      setEditingProduct({ ...editingProduct, images: [...images, url] });
    }
  };

  const removeGalleryImage = (url: string) => {
    if (!editingProduct) return;
    setEditingProduct({
      ...editingProduct,
      images: (editingProduct.images || []).filter(img => img !== url),
    });
  };

  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Products ({products.length})
          </CardTitle>
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={fetchProducts}>
              <RefreshCw className="w-4 h-4" />
            </Button>
            <ExportButtons 
              data={products.map(p => ({
                name: p.name,
                slug: p.slug,
                category: p.category,
                subcategory: p.subcategory || '',
                price: `${p.currency} ${p.price}`,
                compare_at_price: p.compare_at_price ? `${p.currency} ${p.compare_at_price}` : '',
                stock: p.stock_quantity,
                sku: p.sku || '',
                type: p.product_type,
                is_featured: p.is_featured ? 'Yes' : 'No',
                is_on_sale: p.is_on_sale ? 'Yes' : 'No',
                is_new: p.is_new ? 'Yes' : 'No',
                is_active: p.is_active ? 'Yes' : 'No'
              }))} 
              filename={`products-${new Date().toISOString().split('T')[0]}`}
            />
            <Button size="sm" onClick={openNewProduct}>
              <Plus className="w-4 h-4 mr-1" />
              Add Product
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Input 
          placeholder="Search products..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          className="mb-4" 
        />
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(p => (
                <TableRow key={p.id}>
                  <TableCell>
                    {p.featured_image ? (
                      <img src={p.featured_image} alt={p.name} className="w-12 h-12 object-cover rounded" />
                    ) : (
                      <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                        <Package className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>
                    <Badge variant={p.product_type === 'variable' ? 'default' : 'outline'}>
                      {p.product_type === 'variable' ? `Variable (${p.variants?.length || 0})` : 'Simple'}
                    </Badge>
                  </TableCell>
                  <TableCell><Badge variant="outline">{p.category}</Badge></TableCell>
                  <TableCell>{p.currency} {p.price}</TableCell>
                  <TableCell>{p.stock_quantity}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {p.is_active && <Badge className="bg-green-100 text-green-800">Active</Badge>}
                      {p.is_on_sale && <Badge className="bg-red-100 text-red-800">Sale</Badge>}
                      {p.is_new && <Badge className="bg-blue-100 text-blue-800">New</Badge>}
                      {p.is_featured && <Badge className="bg-amber-100 text-amber-800">Featured</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => { setEditingProduct(p); setActiveTab("general"); setIsDialogOpen(true); }}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDuplicate(p)}>
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)} className="text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No products found. Add your first product!
          </div>
        )}
      </CardContent>

      {/* Product Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>{editingProduct?.id ? 'Edit' : 'Add'} Product</DialogTitle>
          </DialogHeader>
          
          {editingProduct && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="images">Images</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
                <TabsTrigger value="variants" disabled={editingProduct.product_type !== 'variable'}>
                  Variants
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto p-1">
                {/* General Tab */}
                <TabsContent value="general" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Product Name (EN) *</Label>
                      <Input 
                        value={editingProduct.name || ''} 
                        onChange={e => setEditingProduct({...editingProduct, name: e.target.value})}
                        placeholder="Enter product name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Product Name (AR)</Label>
                      <Input 
                        value={editingProduct.name_ar || ''} 
                        onChange={e => setEditingProduct({...editingProduct, name_ar: e.target.value})}
                        placeholder="أدخل اسم المنتج"
                        dir="rtl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select 
                        value={editingProduct.category} 
                        onValueChange={v => setEditingProduct({...editingProduct, category: v})}
                      >
                        <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                        <SelectContent>
                          {categories.map(c => (
                            <SelectItem key={c.id} value={c.slug}>{c.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Product Type</Label>
                      <Select 
                        value={editingProduct.product_type} 
                        onValueChange={v => setEditingProduct({...editingProduct, product_type: v as 'simple' | 'variable'})}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="simple">Simple Product</SelectItem>
                          <SelectItem value="variable">Variable Product</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Description (EN)</Label>
                    <Textarea 
                      value={editingProduct.description || ''} 
                      onChange={e => setEditingProduct({...editingProduct, description: e.target.value})}
                      rows={3}
                      placeholder="Product description..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description (AR)</Label>
                    <Textarea 
                      value={editingProduct.description_ar || ''} 
                      onChange={e => setEditingProduct({...editingProduct, description_ar: e.target.value})}
                      rows={3}
                      dir="rtl"
                      placeholder="وصف المنتج..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>SKU</Label>
                      <Input 
                        value={editingProduct.sku || ''} 
                        onChange={e => setEditingProduct({...editingProduct, sku: e.target.value})}
                        placeholder="SKU-001"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Stock Quantity</Label>
                      <Input 
                        type="number" 
                        value={editingProduct.stock_quantity || 0} 
                        onChange={e => setEditingProduct({...editingProduct, stock_quantity: parseInt(e.target.value)})}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-6 pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={editingProduct.is_active} 
                        onCheckedChange={c => setEditingProduct({...editingProduct, is_active: c})} 
                      />
                      <Label>Active</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={editingProduct.is_featured} 
                        onCheckedChange={c => setEditingProduct({...editingProduct, is_featured: c})} 
                      />
                      <Label>Featured</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={editingProduct.is_new} 
                        onCheckedChange={c => setEditingProduct({...editingProduct, is_new: c})} 
                      />
                      <Label>New</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={editingProduct.is_on_sale} 
                        onCheckedChange={c => setEditingProduct({...editingProduct, is_on_sale: c})} 
                      />
                      <Label>On Sale</Label>
                    </div>
                  </div>

                  {/* Options for Variable Products */}
                  {editingProduct.product_type === 'variable' && (
                    <div className="space-y-4 pt-4 border-t">
                      <h4 className="font-medium">Product Options (for variants)</h4>
                      
                      {/* Option 1 */}
                      <div className="p-4 bg-muted/30 rounded-lg space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Option 1 Name</Label>
                            <Input 
                              value={editingProduct.option1_name || ''} 
                              onChange={e => setEditingProduct({...editingProduct, option1_name: e.target.value})}
                              placeholder="e.g. Size"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Add Value</Label>
                            <div className="flex gap-2">
                              <Input 
                                value={newOptionValue.opt1}
                                onChange={e => setNewOptionValue({...newOptionValue, opt1: e.target.value})}
                                placeholder="e.g. Small"
                                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addOptionValue(1))}
                              />
                              <Button type="button" onClick={() => addOptionValue(1)}>Add</Button>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {(editingProduct.option1_values || []).map(v => (
                            <Badge key={v} variant="secondary" className="gap-1">
                              {v}
                              <button onClick={() => removeOptionValue(1, v)}><X className="w-3 h-3" /></button>
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Option 2 */}
                      <div className="p-4 bg-muted/30 rounded-lg space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Option 2 Name</Label>
                            <Input 
                              value={editingProduct.option2_name || ''} 
                              onChange={e => setEditingProduct({...editingProduct, option2_name: e.target.value})}
                              placeholder="e.g. Color"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Add Value</Label>
                            <div className="flex gap-2">
                              <Input 
                                value={newOptionValue.opt2}
                                onChange={e => setNewOptionValue({...newOptionValue, opt2: e.target.value})}
                                placeholder="e.g. Red"
                                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addOptionValue(2))}
                              />
                              <Button type="button" onClick={() => addOptionValue(2)}>Add</Button>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {(editingProduct.option2_values || []).map(v => (
                            <Badge key={v} variant="secondary" className="gap-1">
                              {v}
                              <button onClick={() => removeOptionValue(2, v)}><X className="w-3 h-3" /></button>
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Option 3 */}
                      <div className="p-4 bg-muted/30 rounded-lg space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Option 3 Name</Label>
                            <Input 
                              value={editingProduct.option3_name || ''} 
                              onChange={e => setEditingProduct({...editingProduct, option3_name: e.target.value})}
                              placeholder="e.g. Material"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Add Value</Label>
                            <div className="flex gap-2">
                              <Input 
                                value={newOptionValue.opt3}
                                onChange={e => setNewOptionValue({...newOptionValue, opt3: e.target.value})}
                                placeholder="e.g. Cotton"
                                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addOptionValue(3))}
                              />
                              <Button type="button" onClick={() => addOptionValue(3)}>Add</Button>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {(editingProduct.option3_values || []).map(v => (
                            <Badge key={v} variant="secondary" className="gap-1">
                              {v}
                              <button onClick={() => removeOptionValue(3, v)}><X className="w-3 h-3" /></button>
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Button type="button" onClick={generateVariants} className="w-full">
                        Generate Variants from Options
                      </Button>
                    </div>
                  )}
                </TabsContent>

                {/* Images Tab */}
                <TabsContent value="images" className="space-y-4 mt-4">
                  <MediaPicker 
                    label="Featured Image" 
                    value={editingProduct.featured_image || ''} 
                    onChange={(url) => setEditingProduct({...editingProduct, featured_image: url})}
                    placeholder="Select main product image"
                  />

                  <div className="space-y-2">
                    <Label>Gallery Images</Label>
                    <div className="grid grid-cols-4 gap-4">
                      {(editingProduct.images || []).map((img, idx) => (
                        <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border">
                          <img src={img} alt="" className="w-full h-full object-cover" />
                          <button 
                            onClick={() => removeGalleryImage(img)}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      <div className="aspect-square">
                        <MediaPicker 
                          label="" 
                          value="" 
                          onChange={addGalleryImage}
                          placeholder="Add gallery image"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Pricing Tab */}
                <TabsContent value="pricing" className="space-y-4 mt-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Price *</Label>
                      <Input 
                        type="number" 
                        value={editingProduct.price || 0} 
                        onChange={e => setEditingProduct({...editingProduct, price: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Compare at Price</Label>
                      <Input 
                        type="number" 
                        value={editingProduct.compare_at_price || ''} 
                        onChange={e => setEditingProduct({...editingProduct, compare_at_price: parseFloat(e.target.value) || undefined})}
                        placeholder="Original price"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Currency</Label>
                      <Select 
                        value={editingProduct.currency} 
                        onValueChange={v => setEditingProduct({...editingProduct, currency: v})}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AED">AED</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {editingProduct.compare_at_price && editingProduct.price && editingProduct.compare_at_price > editingProduct.price && (
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-green-800 font-medium">
                        Discount: {Math.round((1 - editingProduct.price / editingProduct.compare_at_price) * 100)}% off
                      </p>
                    </div>
                  )}
                </TabsContent>

                {/* Variants Tab */}
                <TabsContent value="variants" className="space-y-4 mt-4">
                  {editingProduct.variants && editingProduct.variants.length > 0 ? (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        {editingProduct.variants.length} variant(s)
                      </p>
                      
                      <div className="space-y-3">
                        {editingProduct.variants.map((variant, idx) => (
                          <div key={idx} className="p-4 border rounded-lg space-y-3">
                            <div className="flex justify-between items-start">
                              <div className="font-medium">
                                {[variant.option1_value, variant.option2_value, variant.option3_value]
                                  .filter(Boolean)
                                  .join(' / ') || `Variant ${idx + 1}`}
                              </div>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => removeVariant(idx)}
                                className="text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            
                            <div className="grid grid-cols-4 gap-3">
                              <div className="space-y-1">
                                <Label className="text-xs">Price</Label>
                                <Input 
                                  type="number"
                                  value={variant.price}
                                  onChange={e => updateVariant(idx, 'price', parseFloat(e.target.value) || 0)}
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">Compare Price</Label>
                                <Input 
                                  type="number"
                                  value={variant.compare_at_price || ''}
                                  onChange={e => updateVariant(idx, 'compare_at_price', parseFloat(e.target.value) || undefined)}
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">Stock</Label>
                                <Input 
                                  type="number"
                                  value={variant.stock_quantity}
                                  onChange={e => updateVariant(idx, 'stock_quantity', parseInt(e.target.value) || 0)}
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">SKU</Label>
                                <Input 
                                  value={variant.sku || ''}
                                  onChange={e => updateVariant(idx, 'sku', e.target.value)}
                                />
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Switch 
                                checked={variant.is_active}
                                onCheckedChange={c => updateVariant(idx, 'is_active', c)}
                              />
                              <Label className="text-sm">Active</Label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No variants yet.</p>
                      <p className="text-sm">Add options in the General tab and click "Generate Variants"</p>
                    </div>
                  )}
                </TabsContent>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Save Product
                </Button>
              </div>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};