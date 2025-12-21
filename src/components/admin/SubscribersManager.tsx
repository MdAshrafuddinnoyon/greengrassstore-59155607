import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ExportButtons } from "./ExportButtons";
import { Loader2, Mail, Search, Download, Trash2, RefreshCw, Users } from "lucide-react";

interface Subscriber {
  id: string;
  email: string;
  subscribed_at: string;
  is_active: boolean;
  source: string;
}

export const SubscribersManager = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('subscribed_at', { ascending: false });

      if (error) throw error;
      setSubscribers(data || []);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      toast.error('Failed to load subscribers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();

    // Real-time subscription for newsletter subscribers
    const channel = supabase
      .channel('admin-subscribers-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'newsletter_subscribers' },
        () => {
          fetchSubscribers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      
      setSubscribers(prev => 
        prev.map(sub => sub.id === id ? { ...sub, is_active: !currentStatus } : sub)
      );
      toast.success('Subscriber status updated');
    } catch (error) {
      console.error('Error updating subscriber:', error);
      toast.error('Failed to update subscriber');
    }
  };

  const deleteSubscriber = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subscriber?')) return;
    
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setSubscribers(prev => prev.filter(sub => sub.id !== id));
      toast.success('Subscriber deleted');
    } catch (error) {
      console.error('Error deleting subscriber:', error);
      toast.error('Failed to delete subscriber');
    }
  };

  const exportCSV = () => {
    const activeSubscribers = subscribers.filter(s => s.is_active);
    const csv = [
      ['Email', 'Subscribed At', 'Source'],
      ...activeSubscribers.map(s => [s.email, s.subscribed_at, s.source])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Subscribers exported');
  };

  const filteredSubscribers = subscribers.filter(sub =>
    sub.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCount = subscribers.filter(s => s.is_active).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Subscribers</p>
                <p className="text-2xl font-bold text-blue-700">{subscribers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-green-700">{activeCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500 rounded-lg">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Inactive</p>
                <p className="text-2xl font-bold text-amber-700">{subscribers.length - activeCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                Newsletter Subscribers
              </CardTitle>
              <CardDescription>
                Manage newsletter subscriber emails
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={fetchSubscribers}>
                <RefreshCw className="w-4 h-4 mr-1" />
                Refresh
              </Button>
              <ExportButtons 
                data={subscribers} 
                filename={`subscribers-${new Date().toISOString().split('T')[0]}`}
                label="Export"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Table */}
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Email</TableHead>
                  <TableHead>Subscribed</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubscribers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No subscribers found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSubscribers.map((subscriber) => (
                    <TableRow key={subscriber.id}>
                      <TableCell className="font-medium">{subscriber.email}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(subscriber.subscribed_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {subscriber.source}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={subscriber.is_active}
                            onCheckedChange={() => toggleActive(subscriber.id, subscriber.is_active)}
                          />
                          <Badge variant={subscriber.is_active ? "default" : "secondary"}>
                            {subscriber.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteSubscriber(subscriber.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
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