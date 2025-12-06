import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Loader2, Search, Package, ExternalLink, RefreshCw, ShoppingBag } from "lucide-react";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";

export const ProductManager = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchProducts(50);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = products.filter(product =>
    product.node.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.node.handle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatPrice = (price: string, currency: string) => {
    return `${currency} ${parseFloat(price).toFixed(2)}`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Product Manager
            </CardTitle>
            <CardDescription>View your Shopify products</CardDescription>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadProducts}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button asChild>
              <a href="https://admin.shopify.com" target="_blank" rel="noopener noreferrer">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Shopify Admin
              </a>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No products found</p>
            <p className="text-sm mt-1">Add products from Shopify Admin or use the CSV importer</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Image</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Variants</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => {
                  const firstImage = product.node.images.edges[0]?.node.url;
                  const firstVariant = product.node.variants.edges[0]?.node;
                  
                  return (
                    <TableRow key={product.node.id}>
                      <TableCell>
                        {firstImage ? (
                          <img 
                            src={firstImage} 
                            alt={product.node.title}
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                            <Package className="w-6 h-6 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium line-clamp-1">{product.node.title}</p>
                          <p className="text-xs text-muted-foreground">/{product.node.handle}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatPrice(
                          product.node.priceRange.minVariantPrice.amount,
                          product.node.priceRange.minVariantPrice.currencyCode
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {product.node.variants.edges.length} variant(s)
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={firstVariant?.availableForSale ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                          {firstVariant?.availableForSale ? 'In Stock' : 'Out of Stock'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                          title="View on Store"
                        >
                          <a href={`/product/${product.node.handle}`} target="_blank">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="mt-4 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> For full product management (add, edit, delete, images, inventory), use the{" "}
            <a 
              href="https://admin.shopify.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Shopify Admin
            </a>
            {" "}or the CSV importer tab.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
