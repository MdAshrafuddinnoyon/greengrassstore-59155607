import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Upload, FileText, Download, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface WordPressBlog {
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  date: string;
  author: string;
  categories: string[];
  tags: string[];
  status: string;
  featuredImage?: string;
}

interface ImportResult {
  total: number;
  success: number;
  failed: number;
  errors: string[];
}

export const BlogImporter = () => {
  const [importing, setImporting] = useState(false);
  const [blogs, setBlogs] = useState<WordPressBlog[]>([]);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseWordPressXML = (xmlText: string): WordPressBlog[] => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, 'text/xml');
    const items = doc.querySelectorAll('item');
    const blogs: WordPressBlog[] = [];

    items.forEach((item) => {
      const postType = item.querySelector('wp\\:post_type, post_type')?.textContent;
      if (postType !== 'post') return;

      const title = item.querySelector('title')?.textContent || '';
      const contentEncoded = item.querySelector('content\\:encoded, encoded')?.textContent || '';
      const excerptEncoded = item.querySelector('excerpt\\:encoded')?.textContent || '';
      const slug = item.querySelector('wp\\:post_name, post_name')?.textContent || '';
      const date = item.querySelector('wp\\:post_date, post_date')?.textContent || '';
      const author = item.querySelector('dc\\:creator, creator')?.textContent || '';
      const status = item.querySelector('wp\\:status, status')?.textContent || 'draft';

      const categories: string[] = [];
      const tags: string[] = [];
      
      item.querySelectorAll('category').forEach((cat) => {
        const domain = cat.getAttribute('domain');
        const value = cat.textContent || '';
        if (domain === 'category') {
          categories.push(value);
        } else if (domain === 'post_tag') {
          tags.push(value);
        }
      });

      if (title) {
        blogs.push({
          title,
          content: contentEncoded,
          excerpt: excerptEncoded || contentEncoded.substring(0, 200),
          slug: slug || title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
          date,
          author,
          categories,
          tags,
          status: status === 'publish' ? 'published' : 'draft'
        });
      }
    });

    return blogs;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const parsedBlogs = parseWordPressXML(text);
      setBlogs(parsedBlogs);
      setImportResult(null);
      
      if (parsedBlogs.length === 0) {
        toast.error('No valid blog posts found in XML');
      } else {
        toast.success(`Found ${parsedBlogs.length} blog posts ready to import`);
      }
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (blogs.length === 0) {
      toast.error('No blogs to import');
      return;
    }

    setImporting(true);
    const result: ImportResult = { total: blogs.length, success: 0, failed: 0, errors: [] };

    for (const blog of blogs) {
      try {
        // Calculate reading time (approx 200 words per minute)
        const wordCount = blog.content.split(/\s+/).length;
        const readingTime = Math.max(1, Math.ceil(wordCount / 200));

        const { error } = await supabase
          .from('blog_posts')
          .insert({
            title: blog.title,
            content: blog.content,
            excerpt: blog.excerpt.substring(0, 300),
            slug: blog.slug,
            author_name: blog.author || 'Green Grass Team',
            category: blog.categories[0] || 'General',
            tags: blog.tags,
            status: blog.status,
            reading_time: readingTime,
            published_at: blog.status === 'published' ? new Date(blog.date).toISOString() : null
          });

        if (error) {
          if (error.code === '23505') { // Duplicate slug
            result.failed++;
            result.errors.push(`Duplicate: ${blog.title} (slug exists)`);
          } else {
            throw error;
          }
        } else {
          result.success++;
        }
      } catch (error) {
        result.failed++;
        result.errors.push(`Failed: ${blog.title}`);
        console.error('Import error:', error);
      }
    }

    setImportResult(result);
    setImporting(false);
    
    if (result.success > 0) {
      toast.success(`Imported ${result.success} blog posts successfully`);
    }
  };

  const downloadTemplate = () => {
    const template = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:excerpt="http://wordpress.org/export/1.2/excerpt/"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:wp="http://wordpress.org/export/1.2/"
>
<channel>
  <item>
    <title>Sample Blog Post</title>
    <dc:creator><![CDATA[Author Name]]></dc:creator>
    <content:encoded><![CDATA[<p>Your blog content goes here with HTML formatting.</p>]]></content:encoded>
    <excerpt:encoded><![CDATA[Brief excerpt of the blog post.]]></excerpt:encoded>
    <wp:post_name><![CDATA[sample-blog-post]]></wp:post_name>
    <wp:post_date><![CDATA[2024-01-15 10:00:00]]></wp:post_date>
    <wp:status><![CDATA[publish]]></wp:status>
    <wp:post_type><![CDATA[post]]></wp:post_type>
    <category domain="category"><![CDATA[Plant Care]]></category>
    <category domain="post_tag"><![CDATA[tips]]></category>
    <category domain="post_tag"><![CDATA[indoor plants]]></category>
  </item>
</channel>
</rss>`;

    const blob = new Blob([template], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wordpress_export_template.xml';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Blog Importer</h2>
          <p className="text-sm text-muted-foreground">Import blog posts from WordPress XML export</p>
        </div>
        
        <Button variant="outline" onClick={downloadTemplate}>
          <Download className="w-4 h-4 mr-2" />
          Download Template
        </Button>
      </div>

      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Upload WordPress Export</CardTitle>
          <CardDescription>
            Upload your WordPress XML export file (WXR format)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div 
            className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="font-medium">Click to upload XML file</p>
            <p className="text-sm text-muted-foreground mt-1">WordPress export format (WXR)</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xml"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      {blogs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              {blogs.length} Blog Posts Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-64 overflow-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted sticky top-0">
                  <tr>
                    <th className="text-left p-2">Title</th>
                    <th className="text-left p-2">Author</th>
                    <th className="text-left p-2">Category</th>
                    <th className="text-left p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.slice(0, 10).map((blog, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2">{blog.title}</td>
                      <td className="p-2">{blog.author}</td>
                      <td className="p-2">{blog.categories[0] || '-'}</td>
                      <td className="p-2">
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          blog.status === 'published' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {blog.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {blogs.length > 10 && (
                <p className="text-sm text-muted-foreground text-center py-2">
                  +{blogs.length - 10} more posts
                </p>
              )}
            </div>
            
            <div className="flex gap-2 mt-4">
              <Button onClick={handleImport} disabled={importing}>
                {importing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Import All Posts
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={() => setBlogs([])}>
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
            <p>{importResult.success} posts imported successfully, {importResult.failed} failed.</p>
            {importResult.errors.length > 0 && (
              <ul className="mt-2 text-sm list-disc list-inside">
                {importResult.errors.slice(0, 5).map((error, i) => (
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
        <AlertTitle>How to Export from WordPress</AlertTitle>
        <AlertDescription className="space-y-2">
          <ol className="list-decimal list-inside text-sm space-y-1">
            <li>Go to WordPress Admin → Tools → Export</li>
            <li>Select "Posts" and click "Download Export File"</li>
            <li>Upload the downloaded XML file here</li>
          </ol>
        </AlertDescription>
      </Alert>
    </div>
  );
};
