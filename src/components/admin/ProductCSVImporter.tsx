import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Upload, FileSpreadsheet, Download, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

interface CSVProduct {
  name: string;
  name_ar?: string;
  slug?: string;
  description?: string;
  description_ar?: string;
  category: string;
  subcategory?: string;
  price: string;
  compare_at_price?: string;
  sku?: string;
  stock_quantity?: string;
  featured_image?: string;
  images?: string;
  tags?: string;
  is_featured?: string;
  is_on_sale?: string;
  is_new?: string;
  discount_percentage?: string;
}

interface ImportResult {
  total: number;
  success: number;
  failed: number;
  errors: string[];
}

interface ProductCSVImporterProps {
  onImportComplete?: () => void;
}

export const ProductCSVImporter = ({ onImportComplete }: ProductCSVImporterProps) => {
  const [importing, setImporting] = useState(false);
  const [csvData, setCsvData] = useState<CSVProduct[]>([]);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const parseCSV = (text: string): CSVProduct[] => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/\s+/g, '_'));
    const products: CSVProduct[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      const product: CSVProduct = { name: '', category: 'general', price: '0' };

      headers.forEach((header, index) => {
        const value = values[index]?.trim() || '';
        switch (header) {
          case 'name':
          case 'title':
          case 'product_name':
            product.name = value;
            break;
          case 'name_ar':
          case 'arabic_name':
            product.name_ar = value;
            break;
          case 'slug':
          case 'handle':
            product.slug = value;
            break;
          case 'description':
          case 'body':
          case 'body_html':
            product.description = value;
            break;
          case 'description_ar':
          case 'arabic_description':
            product.description_ar = value;
            break;
          case 'category':
          case 'product_type':
          case 'type':
            product.category = value || 'general';
            break;
          case 'subcategory':
            product.subcategory = value;
            break;
          case 'price':
          case 'variant_price':
            product.price = value || '0';
            break;
          case 'compare_at_price':
          case 'compare_price':
          case 'original_price':
            product.compare_at_price = value;
            break;
          case 'sku':
          case 'variant_sku':
            product.sku = value;
            break;
          case 'stock':
          case 'stock_quantity':
          case 'inventory_quantity':
            product.stock_quantity = value;
            break;
          case 'featured_image':
          case 'image_src':
          case 'image':
          case 'image_url':
            product.featured_image = value;
            break;
          case 'images':
          case 'gallery':
          case 'additional_images':
            product.images = value;
            break;
          case 'tags':
            product.tags = value;
            break;
          case 'is_featured':
          case 'featured':
            product.is_featured = value;
            break;
          case 'is_on_sale':
          case 'on_sale':
          case 'sale':
            product.is_on_sale = value;
            break;
          case 'is_new':
          case 'new':
            product.is_new = value;
            break;
          case 'discount_percentage':
          case 'discount':
          case 'discount_percent':
            product.discount_percentage = value;
            break;
        }
      });

      if (product.name) {
        products.push(product);
      }
    }

    return products;
  };

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.replace(/^"|"$/g, ''));
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.replace(/^"|"$/g, ''));

    return result;
  };

  const toBool = (value?: string): boolean => {
    if (!value) return false;
    return ['true', 'yes', '1', 'on'].includes(value.toLowerCase());
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const products = parseCSV(text);
      setCsvData(products);
      setImportResult(null);
      setProgress(0);
      
      if (products.length === 0) {
        toast.error('No valid products found in CSV');
      } else {
        toast.success(`Found ${products.length} products ready to import`);
      }
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (csvData.length === 0) {
      toast.error('No products to import');
      return;
    }

    setImporting(true);
    const result: ImportResult = { total: csvData.length, success: 0, failed: 0, errors: [] };

    for (let i = 0; i < csvData.length; i++) {
      const product = csvData[i];
      setProgress(Math.round(((i + 1) / csvData.length) * 100));

      try {
        const price = parseFloat(product.price) || 0;
        const comparePrice = product.compare_at_price ? parseFloat(product.compare_at_price) : null;
        
        // Calculate compare_at_price from discount percentage if provided
        let finalComparePrice = comparePrice;
        if (product.discount_percentage && !comparePrice) {
          const discount = parseFloat(product.discount_percentage);
          if (discount > 0 && discount < 100) {
            finalComparePrice = price / (1 - discount / 100);
          }
        }

        const imagesArray = product.images 
          ? product.images.split('|').map(img => img.trim()).filter(Boolean)
          : [];

        const tagsArray = product.tags 
          ? product.tags.split(',').map(tag => tag.trim()).filter(Boolean)
          : [];

        const productData = {
          name: product.name,
          name_ar: product.name_ar || null,
          slug: product.slug || generateSlug(product.name),
          description: product.description || null,
          description_ar: product.description_ar || null,
          category: product.category || 'general',
          subcategory: product.subcategory || null,
          price,
          compare_at_price: finalComparePrice,
          currency: 'AED',
          sku: product.sku || null,
          stock_quantity: parseInt(product.stock_quantity || '10'),
          featured_image: product.featured_image || null,
          images: imagesArray,
          tags: tagsArray,
          is_featured: toBool(product.is_featured),
          is_on_sale: toBool(product.is_on_sale) || (finalComparePrice && finalComparePrice > price),
          is_new: toBool(product.is_new),
          is_active: true,
          product_type: 'simple' as const,
        };

        const { error } = await supabase.from('products').insert(productData);
        
        if (error) throw error;
        result.success++;
      } catch (error: any) {
        result.failed++;
        result.errors.push(`${product.name}: ${error.message || 'Unknown error'}`);
      }
    }

    setImportResult(result);
    setImporting(false);
    
    if (result.success > 0) {
      toast.success(`Imported ${result.success} products successfully`);
      onImportComplete?.();
    }
    if (result.failed > 0) {
      toast.error(`Failed to import ${result.failed} products`);
    }
  };

  const downloadTemplate = () => {
    const template = `name,name_ar,category,subcategory,price,compare_at_price,discount_percentage,sku,stock_quantity,featured_image,images,tags,is_featured,is_on_sale,is_new,description,description_ar
"Example Plant","نبتة مثال","Plants","Mixed Plant",29.99,39.99,,PLANT-001,50,https://example.com/image.jpg,https://example.com/img2.jpg|https://example.com/img3.jpg,"indoor,green",true,true,false,"Beautiful indoor plant","نبتة داخلية جميلة"
"Ceramic Pot","وعاء سيراميك","Pots","Ceramic Pot",19.99,,10,POT-001,100,https://example.com/pot.jpg,,"ceramic,home",false,true,true,"Elegant ceramic pot","وعاء سيراميك أنيق"`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product_import_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">CSV Import</h3>
          <p className="text-sm text-muted-foreground">Import products from CSV file</p>
        </div>
        
        <Button variant="outline" onClick={downloadTemplate}>
          <Download className="w-4 h-4 mr-2" />
          Download Template
        </Button>
      </div>

      {/* Upload Area */}
      <Card>
        <CardContent className="pt-6">
          <div 
            className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <FileSpreadsheet className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="font-medium">Click to upload CSV file</p>
            <p className="text-sm text-muted-foreground mt-1">
              Supports: name, price, compare_at_price, discount_percentage, category, images, etc.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      {csvData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              {csvData.length} Products Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-64 overflow-auto mb-4">
              <table className="w-full text-sm">
                <thead className="bg-muted sticky top-0">
                  <tr>
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Category</th>
                    <th className="text-left p-2">Price</th>
                    <th className="text-left p-2">Discount</th>
                    <th className="text-left p-2">SKU</th>
                  </tr>
                </thead>
                <tbody>
                  {csvData.slice(0, 10).map((product, index) => {
                    const discount = product.compare_at_price && parseFloat(product.price) > 0
                      ? Math.round((1 - parseFloat(product.price) / parseFloat(product.compare_at_price)) * 100)
                      : product.discount_percentage 
                        ? parseFloat(product.discount_percentage)
                        : 0;
                    
                    return (
                      <tr key={index} className="border-b">
                        <td className="p-2">{product.name}</td>
                        <td className="p-2">{product.category}</td>
                        <td className="p-2">AED {product.price}</td>
                        <td className="p-2">
                          {discount > 0 ? (
                            <span className="text-red-600 font-medium">{discount}% OFF</span>
                          ) : '-'}
                        </td>
                        <td className="p-2">{product.sku || '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {csvData.length > 10 && (
                <p className="text-sm text-muted-foreground text-center py-2">
                  +{csvData.length - 10} more products
                </p>
              )}
            </div>

            {importing && (
              <div className="mb-4">
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-muted-foreground text-center mt-2">
                  Importing... {progress}%
                </p>
              </div>
            )}
            
            <div className="flex gap-2">
              <Button onClick={handleImport} disabled={importing}>
                {importing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Import to Database
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={() => { setCsvData([]); setImportResult(null); }}>
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Import Result */}
      {importResult && (
        <Alert variant={importResult.failed > 0 ? "destructive" : "default"}>
          {importResult.failed > 0 ? (
            <AlertCircle className="h-4 w-4" />
          ) : (
            <CheckCircle2 className="h-4 w-4" />
          )}
          <AlertTitle>Import Complete</AlertTitle>
          <AlertDescription>
            <p>{importResult.success} products imported successfully, {importResult.failed} failed.</p>
            {importResult.errors.length > 0 && (
              <ul className="mt-2 text-sm list-disc list-inside max-h-32 overflow-auto">
                {importResult.errors.map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
              </ul>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Info */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>CSV Format Tips</AlertTitle>
        <AlertDescription className="space-y-2">
          <ul className="list-disc list-inside text-sm space-y-1">
            <li><strong>discount_percentage:</strong> Set discount % (e.g., 10 for 10% off) - auto-calculates compare price</li>
            <li><strong>compare_at_price:</strong> Original price before discount</li>
            <li><strong>images:</strong> Multiple images separated by | (pipe)</li>
            <li><strong>tags:</strong> Multiple tags separated by comma</li>
            <li><strong>is_featured/is_on_sale/is_new:</strong> Use true/false or yes/no</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
};
