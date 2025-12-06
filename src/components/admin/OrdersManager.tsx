import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus, Eye, FileText, Search, Download, Printer, Trash2, RefreshCw } from "lucide-react";
import { ExportButtons } from "./ExportButtons";
import { format } from "date-fns";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  customer_address: string | null;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: string;
  payment_method: string | null;
  notes: string | null;
  created_at: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export const OrdersManager = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  const [newOrder, setNewOrder] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    customer_address: "",
    items: [{ name: "", quantity: 1, price: 0 }] as OrderItem[],
    shipping: 0,
    tax: 0,
    payment_method: "cash",
    notes: "",
  });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const ordersData = (data || []).map(order => ({
        ...order,
        items: (order.items as unknown as OrderItem[]) || []
      }));
      
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const generateOrderNumber = () => {
    const prefix = "GG";
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  };

  const calculateSubtotal = (items: OrderItem[]) => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const createOrder = async () => {
    try {
      const subtotal = calculateSubtotal(newOrder.items);
      const total = subtotal + newOrder.tax + newOrder.shipping;

      const { error } = await supabase
        .from('orders')
        .insert([{
          order_number: generateOrderNumber(),
          customer_name: newOrder.customer_name,
          customer_email: newOrder.customer_email,
          customer_phone: newOrder.customer_phone || null,
          customer_address: newOrder.customer_address || null,
          items: JSON.parse(JSON.stringify(newOrder.items)),
          subtotal,
          tax: newOrder.tax,
          shipping: newOrder.shipping,
          total,
          payment_method: newOrder.payment_method,
          notes: newOrder.notes || null,
          status: 'pending',
        }]);

      if (error) throw error;

      toast.success('Order created successfully');
      setShowCreateDialog(false);
      setNewOrder({
        customer_name: "",
        customer_email: "",
        customer_phone: "",
        customer_address: "",
        items: [{ name: "", quantity: 1, price: 0 }],
        shipping: 0,
        tax: 0,
        payment_method: "cash",
        notes: "",
      });
      fetchOrders();
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to create order');
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order?')) return;
    
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);

      if (error) throw error;
      toast.success('Order deleted');
      fetchOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('Failed to delete order');
    }
  };

  const printInvoice = (order: Order) => {
    const invoiceWindow = window.open('', '_blank');
    if (!invoiceWindow) return;

    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${order.order_number}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #2d5a3d; padding-bottom: 20px; }
          .header h1 { color: #2d5a3d; margin: 0; }
          .header p { color: #666; margin: 5px 0; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
          .info-box { background: #f9f9f9; padding: 15px; border-radius: 8px; }
          .info-box h3 { margin: 0 0 10px 0; color: #2d5a3d; font-size: 14px; }
          .info-box p { margin: 3px 0; font-size: 13px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background: #2d5a3d; color: white; }
          .totals { text-align: right; }
          .totals p { margin: 5px 0; }
          .total-row { font-size: 18px; font-weight: bold; color: #2d5a3d; }
          .footer { text-align: center; margin-top: 40px; color: #666; font-size: 12px; border-top: 1px solid #ddd; padding-top: 20px; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>GREEN GRASS STORE</h1>
          <p>www.greengrassstore.com</p>
          <p>Dubai, UAE | +971 54 775 1901</p>
        </div>
        
        <div class="info-grid">
          <div class="info-box">
            <h3>INVOICE TO:</h3>
            <p><strong>${order.customer_name}</strong></p>
            <p>${order.customer_email}</p>
            ${order.customer_phone ? `<p>${order.customer_phone}</p>` : ''}
            ${order.customer_address ? `<p>${order.customer_address}</p>` : ''}
          </div>
          <div class="info-box">
            <h3>INVOICE DETAILS:</h3>
            <p><strong>Invoice #:</strong> ${order.order_number}</p>
            <p><strong>Date:</strong> ${format(new Date(order.created_at), 'MMM dd, yyyy')}</p>
            <p><strong>Status:</strong> ${order.status.toUpperCase()}</p>
            <p><strong>Payment:</strong> ${order.payment_method || 'N/A'}</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>AED ${item.price.toFixed(2)}</td>
                <td>AED ${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="totals">
          <p>Subtotal: AED ${order.subtotal.toFixed(2)}</p>
          <p>Tax: AED ${order.tax.toFixed(2)}</p>
          <p>Shipping: AED ${order.shipping.toFixed(2)}</p>
          <p class="total-row">Total: AED ${order.total.toFixed(2)}</p>
        </div>

        ${order.notes ? `<p><strong>Notes:</strong> ${order.notes}</p>` : ''}

        <div class="footer">
          <p>Thank you for shopping with Green Grass Store!</p>
          <p>For any queries, contact us at info@greengrassstore.com</p>
        </div>
      </body>
      </html>
    `;

    invoiceWindow.document.write(invoiceHTML);
    invoiceWindow.document.close();
    invoiceWindow.print();
  };

  const filteredOrders = orders.filter(order =>
    order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Orders & Invoices
            </CardTitle>
            <CardDescription>Manage orders and generate invoices</CardDescription>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={fetchOrders}>
              <RefreshCw className="w-4 h-4 mr-1" />
              Refresh
            </Button>
            <ExportButtons 
              data={orders.map(o => ({
                order_number: o.order_number,
                customer_name: o.customer_name,
                customer_email: o.customer_email,
                customer_phone: o.customer_phone || '',
                total: `AED ${o.total.toFixed(2)}`,
                status: o.status,
                payment_method: o.payment_method || '',
                date: new Date(o.created_at).toLocaleDateString()
              }))} 
              filename={`orders-${new Date().toISOString().split('T')[0]}`}
            />
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Order
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Order</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Customer Name *</Label>
                    <Input
                      value={newOrder.customer_name}
                      onChange={(e) => setNewOrder(prev => ({ ...prev, customer_name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Customer Email *</Label>
                    <Input
                      type="email"
                      value={newOrder.customer_email}
                      onChange={(e) => setNewOrder(prev => ({ ...prev, customer_email: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      value={newOrder.customer_phone}
                      onChange={(e) => setNewOrder(prev => ({ ...prev, customer_phone: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Input
                      value={newOrder.customer_address}
                      onChange={(e) => setNewOrder(prev => ({ ...prev, customer_address: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Order Items</Label>
                  {newOrder.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-4 gap-2">
                      <Input
                        placeholder="Product name"
                        className="col-span-2"
                        value={item.name}
                        onChange={(e) => {
                          const items = [...newOrder.items];
                          items[index].name = e.target.value;
                          setNewOrder(prev => ({ ...prev, items }));
                        }}
                      />
                      <Input
                        type="number"
                        placeholder="Qty"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => {
                          const items = [...newOrder.items];
                          items[index].quantity = parseInt(e.target.value) || 1;
                          setNewOrder(prev => ({ ...prev, items }));
                        }}
                      />
                      <Input
                        type="number"
                        placeholder="Price"
                        min="0"
                        step="0.01"
                        value={item.price}
                        onChange={(e) => {
                          const items = [...newOrder.items];
                          items[index].price = parseFloat(e.target.value) || 0;
                          setNewOrder(prev => ({ ...prev, items }));
                        }}
                      />
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setNewOrder(prev => ({
                      ...prev,
                      items: [...prev.items, { name: "", quantity: 1, price: 0 }]
                    }))}
                  >
                    Add Item
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Tax (AED)</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={newOrder.tax}
                      onChange={(e) => setNewOrder(prev => ({ ...prev, tax: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Shipping (AED)</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={newOrder.shipping}
                      onChange={(e) => setNewOrder(prev => ({ ...prev, shipping: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Payment Method</Label>
                    <Select
                      value={newOrder.payment_method}
                      onValueChange={(value) => setNewOrder(prev => ({ ...prev, payment_method: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="card">Card</SelectItem>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="whatsapp">WhatsApp Order</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    value={newOrder.notes}
                    onChange={(e) => setNewOrder(prev => ({ ...prev, notes: e.target.value }))}
                    rows={2}
                  />
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm">
                    <strong>Subtotal:</strong> AED {calculateSubtotal(newOrder.items).toFixed(2)}
                  </p>
                  <p className="text-sm">
                    <strong>Tax:</strong> AED {newOrder.tax.toFixed(2)}
                  </p>
                  <p className="text-sm">
                    <strong>Shipping:</strong> AED {newOrder.shipping.toFixed(2)}
                  </p>
                  <p className="text-lg font-bold text-primary">
                    Total: AED {(calculateSubtotal(newOrder.items) + newOrder.tax + newOrder.shipping).toFixed(2)}
                  </p>
                </div>

                <Button 
                  onClick={createOrder} 
                  className="w-full"
                  disabled={!newOrder.customer_name || !newOrder.customer_email || newOrder.items.every(i => !i.name)}
                >
                  Create Order & Generate Invoice
                </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
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
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-sm">{order.order_number}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.customer_name}</p>
                        <p className="text-xs text-muted-foreground">{order.customer_email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">AED {order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Select
                        value={order.status}
                        onValueChange={(value) => updateOrderStatus(order.id, value)}
                      >
                        <SelectTrigger className="w-28">
                          <Badge className={statusColors[order.status] || "bg-gray-100"}>
                            {order.status}
                          </Badge>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-sm">
                      {format(new Date(order.created_at), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedOrder(order)}
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => printInvoice(order)}
                          title="Print Invoice"
                        >
                          <Printer className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteOrder(order.id)}
                          title="Delete Order"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Order Details Dialog */}
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Order Details - {selectedOrder?.order_number}</DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Customer</p>
                    <p className="font-medium">{selectedOrder.customer_name}</p>
                    <p className="text-sm">{selectedOrder.customer_email}</p>
                    {selectedOrder.customer_phone && <p className="text-sm">{selectedOrder.customer_phone}</p>}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge className={statusColors[selectedOrder.status]}>{selectedOrder.status}</Badge>
                    <p className="text-sm mt-1">{format(new Date(selectedOrder.created_at), 'PPpp')}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Items</p>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.name} × {item.quantity}</span>
                        <span>AED {(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-2 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>AED {selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>AED {selectedOrder.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>AED {selectedOrder.shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>AED {selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>

                {selectedOrder.notes && (
                  <div>
                    <p className="text-sm text-muted-foreground">Notes</p>
                    <p className="text-sm">{selectedOrder.notes}</p>
                  </div>
                )}

                <Button onClick={() => printInvoice(selectedOrder)} className="w-full">
                  <Printer className="w-4 h-4 mr-2" />
                  Print Invoice
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
