import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { 
  Upload, Image, File, Trash2, Copy, Search, 
  FolderPlus, Grid3X3, List, Loader2, X, Download
} from "lucide-react";

interface MediaFile {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  alt_text: string | null;
  caption: string | null;
  folder: string;
  created_at: string;
  publicUrl?: string;
}

export const MediaLibrary = () => {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [folders, setFolders] = useState<string[]>([]);

  const fetchFiles = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('media_files')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get public URLs for each file
      const filesWithUrls = (data || []).map((file: MediaFile) => {
        const { data: urlData } = supabase.storage
          .from('media')
          .getPublicUrl(file.file_path);
        return { ...file, publicUrl: urlData.publicUrl };
      });

      setFiles(filesWithUrls);

      // Extract unique folders
      const uniqueFolders = [...new Set((data || []).map((f: MediaFile) => f.folder))];
      setFolders(uniqueFolders);
    } catch (error) {
      console.error('Error fetching files:', error);
      toast.error('Failed to fetch media files');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadFiles = e.target.files;
    if (!uploadFiles || uploadFiles.length === 0) return;

    setUploading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('Please login to upload files');
      setUploading(false);
      return;
    }

    try {
      for (const file of Array.from(uploadFiles)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Save metadata
        const { error: dbError } = await supabase
          .from('media_files')
          .insert({
            user_id: user.id,
            file_name: file.name,
            file_path: filePath,
            file_type: file.type,
            file_size: file.size,
            folder: 'uploads'
          });

        if (dbError) throw dbError;
      }

      toast.success(`${uploadFiles.length} file(s) uploaded successfully`);
      fetchFiles();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload file(s)');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (file: MediaFile) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('media')
        .remove([file.file_path]);

      if (storageError) throw storageError;

      // Delete metadata
      const { error: dbError } = await supabase
        .from('media_files')
        .delete()
        .eq('id', file.id);

      if (dbError) throw dbError;

      toast.success('File deleted successfully');
      fetchFiles();
      setSelectedFile(null);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete file');
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.file_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder = selectedFolder === 'all' || file.folder === selectedFolder;
    return matchesSearch && matchesFolder;
  });

  const isImage = (fileType: string) => fileType.startsWith('image/');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Media Library</h2>
          <p className="text-sm text-muted-foreground">{files.length} files</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
            {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
          </Button>
          
          <label>
            <Button size="sm" disabled={uploading} asChild>
              <span className="cursor-pointer">
                {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                Upload
              </span>
            </Button>
            <input
              type="file"
              className="hidden"
              multiple
              accept="image/*,application/pdf,.csv,.xml"
              onChange={handleFileUpload}
            />
          </label>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <select
          value={selectedFolder}
          onChange={(e) => setSelectedFolder(e.target.value)}
          className="px-3 py-2 border rounded-lg bg-background text-sm"
        >
          <option value="all">All Folders</option>
          {folders.map(folder => (
            <option key={folder} value={folder}>{folder}</option>
          ))}
        </select>
      </div>

      {/* Files Grid/List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredFiles.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Image className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No media files found</p>
            <p className="text-sm text-muted-foreground mt-1">Upload your first file to get started</p>
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredFiles.map(file => (
            <Card 
              key={file.id} 
              className="cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
              onClick={() => setSelectedFile(file)}
            >
              <CardContent className="p-2">
                <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-2 flex items-center justify-center">
                  {isImage(file.file_type) ? (
                    <img 
                      src={file.publicUrl} 
                      alt={file.alt_text || file.file_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <File className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>
                <p className="text-xs font-medium truncate">{file.file_name}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(file.file_size)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredFiles.map(file => (
            <Card 
              key={file.id} 
              className="cursor-pointer hover:bg-muted/50 transition-all"
              onClick={() => setSelectedFile(file)}
            >
              <CardContent className="p-3 flex items-center gap-4">
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                  {isImage(file.file_type) ? (
                    <img 
                      src={file.publicUrl} 
                      alt={file.alt_text || file.file_name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <File className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{file.file_name}</p>
                  <p className="text-sm text-muted-foreground">{formatFileSize(file.file_size)} • {file.folder}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    copyUrl(file.publicUrl || '');
                  }}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* File Details Dialog */}
      <Dialog open={!!selectedFile} onOpenChange={() => setSelectedFile(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>File Details</DialogTitle>
          </DialogHeader>
          
          {selectedFile && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="aspect-square bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                {isImage(selectedFile.file_type) ? (
                  <img 
                    src={selectedFile.publicUrl} 
                    alt={selectedFile.alt_text || selectedFile.file_name}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <File className="w-16 h-16 text-muted-foreground" />
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label>File Name</Label>
                  <p className="text-sm break-all">{selectedFile.file_name}</p>
                </div>
                
                <div>
                  <Label>File Size</Label>
                  <p className="text-sm">{formatFileSize(selectedFile.file_size)}</p>
                </div>
                
                <div>
                  <Label>File Type</Label>
                  <p className="text-sm">{selectedFile.file_type}</p>
                </div>
                
                <div>
                  <Label>URL</Label>
                  <div className="flex gap-2 mt-1">
                    <Input value={selectedFile.publicUrl} readOnly className="text-xs" />
                    <Button size="icon" variant="outline" onClick={() => copyUrl(selectedFile.publicUrl || '')}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => window.open(selectedFile.publicUrl, '_blank')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={() => handleDelete(selectedFile)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
