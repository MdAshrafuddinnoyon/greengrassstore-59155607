import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Users, Search, Eye, Mail, Phone, MapPin, Calendar, ShoppingBag } from "lucide-react";

interface Customer {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  created_at: string;
  orders_count?: number;
  total_spent?: number;
}

export const CustomerManager = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerOrders, setCustomerOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      // Fetch profiles (customers)
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch orders to calculate stats
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('user_id, total');

      if (ordersError) throw ordersError;

      // Calculate stats per customer
      const statsMap = new Map<string, { count: number; total: number }>();
      orders?.forEach(order => {
        if (order.user_id) {
          const existing = statsMap.get(order.user_id) || { count: 0, total: 0 };
          statsMap.set(order.user_id, {
            count: existing.count + 1,
            total: existing.total + Number(order.total || 0)
          });
        }
      });

      // Merge profiles with stats
      const customersWithStats = profiles?.map(profile => ({
        ...profile,
        email: '', // Will need to fetch from auth if needed
        orders_count: statsMap.get(profile.user_id)?.count || 0,
        total_spent: statsMap.get(profile.user_id)?.total || 0
      })) || [];

      setCustomers(customersWithStats);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerOrders = async (userId: string) => {
    setOrdersLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomerOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(c =>
    (c.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (c.phone || '').includes(searchTerm) ||
    (c.city?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    fetchCustomerOrders(customer.user_id);
  };

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
                <Users className="w-5 h-5 text-primary" />
                Customer Management
              </CardTitle>
              <CardDescription>
                {customers.length} registered customers
              </CardDescription>
            </div>
            <Button variant="outline" onClick={fetchCustomers}>
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, phone, or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Table */}
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <Users className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No customers found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div className="font-medium">{customer.full_name || 'No name'}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Phone className="w-3 h-3" />
                          {customer.phone || '-'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="w-3 h-3" />
                          {customer.city || customer.country || '-'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{customer.orders_count || 0}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-green-600">
                          AED {(customer.total_spent || 0).toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(customer.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewCustomer(customer)}
                        >
                          <Eye className="w-4 h-4" />
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

      {/* Customer Detail Dialog */}
      <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Customer Details
            </DialogTitle>
          </DialogHeader>
          
          {selectedCustomer && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Full Name</Label>
                  <p className="font-medium">{selectedCustomer.full_name || 'Not provided'}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Phone</Label>
                  <p className="font-medium flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {selectedCustomer.phone || 'Not provided'}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Address</Label>
                  <p className="font-medium flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {selectedCustomer.address || 'Not provided'}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">City / Country</Label>
                  <p className="font-medium">
                    {[selectedCustomer.city, selectedCustomer.country].filter(Boolean).join(', ') || 'Not provided'}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Member Since</Label>
                  <p className="font-medium flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(selectedCustomer.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Total Spent</Label>
                  <p className="font-medium text-green-600">
                    AED {(selectedCustomer.total_spent || 0).toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Order History */}
              <div>
                <h3 className="font-semibold flex items-center gap-2 mb-3">
                  <ShoppingBag className="w-4 h-4" />
                  Order History ({customerOrders.length})
                </h3>
                
                {ordersLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                ) : customerOrders.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No orders yet</p>
                ) : (
                  <div className="space-y-2">
                    {customerOrders.map((order) => (
                      <div key={order.id} className="p-3 bg-muted/50 rounded-lg flex items-center justify-between">
                        <div>
                          <p className="font-medium">{order.order_number}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">AED {Number(order.total).toFixed(2)}</p>
                          <Badge variant={
                            order.status === 'completed' ? 'default' :
                            order.status === 'pending' ? 'secondary' : 'outline'
                          }>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
