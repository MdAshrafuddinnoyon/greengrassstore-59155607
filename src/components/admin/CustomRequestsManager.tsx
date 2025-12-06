import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Eye, Loader2, MessageSquare, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ExportButtons } from "./ExportButtons";
import { toast } from "sonner";

interface CustomRequest {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  title: string;
  description: string;
  requirement_type: string;
  budget: string | null;
  timeline: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
}

export const CustomRequestsManager = () => {
  const [requests, setRequests] = useState<CustomRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<CustomRequest | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const fetchRequests = async () => {
    let query = supabase
      .from("custom_requirements")
      .select("*")
      .order("created_at", { ascending: false });

    if (statusFilter !== "all") {
      query = query.eq("status", statusFilter);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching requests:", error);
    } else {
      setRequests(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, [statusFilter]);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("custom_requirements")
      .update({ status, admin_notes: adminNotes })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update status");
      console.error(error);
    } else {
      toast.success("Status updated successfully");
      fetchRequests();
      setSelectedRequest(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500";
      case "in_progress": return "bg-blue-500";
      case "completed": return "bg-green-500";
      case "rejected": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Custom Requests
            </CardTitle>
            <CardDescription>Manage customer custom requirements</CardDescription>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={() => fetchRequests()}>
              <RefreshCw className="w-4 h-4 mr-1" />
              Refresh
            </Button>
            <ExportButtons 
              data={requests} 
              filename={`custom-requests-${new Date().toISOString().split('T')[0]}`}
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : requests.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No custom requests yet</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(request.created_at)}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{request.name}</p>
                        <p className="text-sm text-muted-foreground">{request.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium max-w-[200px] truncate">
                      {request.title}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{request.requirement_type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              setSelectedRequest(request);
                              setAdminNotes(request.admin_notes || "");
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                          <DialogHeader>
                            <DialogTitle>Request Details</DialogTitle>
                          </DialogHeader>
                          {selectedRequest && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-muted-foreground">Customer</Label>
                                  <p className="font-medium">{selectedRequest.name}</p>
                                </div>
                                <div>
                                  <Label className="text-muted-foreground">Email</Label>
                                  <p className="font-medium">{selectedRequest.email}</p>
                                </div>
                                {selectedRequest.phone && (
                                  <div>
                                    <Label className="text-muted-foreground">Phone</Label>
                                    <p className="font-medium">{selectedRequest.phone}</p>
                                  </div>
                                )}
                                <div>
                                  <Label className="text-muted-foreground">Type</Label>
                                  <p className="font-medium">{selectedRequest.requirement_type}</p>
                                </div>
                                {selectedRequest.budget && (
                                  <div>
                                    <Label className="text-muted-foreground">Budget</Label>
                                    <p className="font-medium">{selectedRequest.budget}</p>
                                  </div>
                                )}
                                {selectedRequest.timeline && (
                                  <div>
                                    <Label className="text-muted-foreground">Timeline</Label>
                                    <p className="font-medium">{selectedRequest.timeline}</p>
                                  </div>
                                )}
                              </div>
                              
                              <div>
                                <Label className="text-muted-foreground">Title</Label>
                                <p className="font-medium">{selectedRequest.title}</p>
                              </div>

                              <div>
                                <Label className="text-muted-foreground">Description</Label>
                                <p className="text-sm whitespace-pre-wrap">{selectedRequest.description}</p>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="notes">Admin Notes</Label>
                                <Textarea
                                  id="notes"
                                  value={adminNotes}
                                  onChange={(e) => setAdminNotes(e.target.value)}
                                  placeholder="Add notes about this request..."
                                  rows={3}
                                />
                              </div>

                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateStatus(selectedRequest.id, "in_progress")}
                                >
                                  In Progress
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-green-500 hover:bg-green-600"
                                  onClick={() => updateStatus(selectedRequest.id, "completed")}
                                >
                                  Complete
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => updateStatus(selectedRequest.id, "rejected")}
                                >
                                  Reject
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
