import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Loader2, FolderTree, RefreshCw, ExternalLink, Package } from "lucide-react";

// Shopify config
const SHOPIFY_STOREFRONT_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN || '';
const SHOPIFY_STORE_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || '';

interface ShopifyCollection {
  id: string;
  title: string;
  handle: string;
  description: string;
  productsCount: number;
  image?: {
    url: string;
  };
}

export const CategoryManager = () => {
  const [loading, setLoading] = useState(true);
  const [collections, setCollections] = useState<ShopifyCollection[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCollections = async () => {
    setLoading(true);
    try {
      const STOREFRONT_URL = `https://${SHOPIFY_STORE_DOMAIN}/api/2025-07/graphql.json`;
      
      const response = await fetch(STOREFRONT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN
        },
        body: JSON.stringify({
          query: `
            query GetCollections {
              collections(first: 50) {
                edges {
                  node {
                    id
                    title
                    handle
                    description
                    image {
                      url
                    }
                    products(first: 1) {
                      edges {
                        node {
                          id
                        }
                      }
                    }
                  }
                }
              }
            }
          `
        })
      });

      if (!response.ok) throw new Error('Failed to fetch collections');

      const data = await response.json();
      
      if (data.errors) {
        throw new Error(data.errors[0]?.message || 'GraphQL error');
      }

      const fetchedCollections = data.data?.collections?.edges?.map((edge: any) => ({
        id: edge.node.id,
        title: edge.node.title,
        handle: edge.node.handle,
        description: edge.node.description || '',
        productsCount: edge.node.products?.edges?.length || 0,
        image: edge.node.image
      })) || [];

      setCollections(fetchedCollections);
    } catch (error) {
      console.error('Error fetching collections:', error);
      toast.error('Failed to load categories. Check Shopify connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (SHOPIFY_STOREFRONT_TOKEN && SHOPIFY_STORE_DOMAIN) {
      fetchCollections();
    } else {
      setLoading(false);
    }
  }, []);

  const filteredCollections = collections.filter(c =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.handle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openShopifyAdmin = () => {
    window.open(`https://${SHOPIFY_STORE_DOMAIN}/admin/collections`, '_blank');
  };

  if (!SHOPIFY_STOREFRONT_TOKEN || !SHOPIFY_STORE_DOMAIN) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <FolderTree className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold mb-2">Shopify Not Connected</h3>
          <p className="text-muted-foreground text-sm">
            Categories are managed through Shopify Collections. 
            Please connect your Shopify store first.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <FolderTree className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="font-medium text-blue-900">Categories = Shopify Collections</p>
            <p className="text-sm text-blue-700 mt-1">
              Categories are managed as Collections in Shopify. Create, edit or delete categories 
              in your Shopify Admin panel for full control.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={openShopifyAdmin}
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Open Shopify Admin
            </Button>
          </div>
        </div>
      </div>

      {/* Collections Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-primary" />
                Categories (Shopify Collections)
              </CardTitle>
              <CardDescription>
                {collections.length} categories found in your store
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={fetchCollections}>
              <RefreshCw className="w-4 h-4 mr-1" />
              Refresh
            </Button>
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
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Handle</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCollections.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <Package className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No categories found</p>
                      <Button 
                        variant="link" 
                        size="sm" 
                        onClick={openShopifyAdmin}
                        className="mt-2"
                      >
                        Create in Shopify
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCollections.map((collection) => (
                    <TableRow key={collection.id}>
                      <TableCell>
                        {collection.image ? (
                          <img 
                            src={collection.image.url} 
                            alt={collection.title}
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                            <FolderTree className="w-5 h-5 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{collection.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-xs">
                          {collection.handle}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                        {collection.description || '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(`https://${SHOPIFY_STORE_DOMAIN}/admin/collections/${collection.id.split('/').pop()}`, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};