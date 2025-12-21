import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Loader2, Shield, User, RefreshCw, Pencil, Trash2, Ban, Plus, ShieldX, Key } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ExportButtons } from "./ExportButtons";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface UserWithRole {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  city: string | null;
  email?: string;
  address?: string | null;
  created_at: string;
  role?: string;
  is_blocked?: boolean;
}

interface BlockedIP {
  id: string;
  ip_address: string;
  reason: string;
  blocked_at: string;
  is_active: boolean;
}

export const UsersManager = () => {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("users");
  const [editingUser, setEditingUser] = useState<UserWithRole | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Blocked IPs state (stored in site_settings)
  const [blockedIPs, setBlockedIPs] = useState<BlockedIP[]>([]);
  const [newIP, setNewIP] = useState({ ip: "", reason: "" });

  const fetchUsers = async () => {
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rolesError) throw rolesError;

      const usersWithRoles = (profiles || []).map((profile) => {
        const userRole = roles?.find((r) => r.user_id === profile.user_id);
        return {
          ...profile,
          role: userRole?.role || "user",
        };
      });

      setUsers(usersWithRoles);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const fetchBlockedIPs = async () => {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("setting_value")
        .eq("setting_key", "blocked_ips")
        .single();

      if (data?.setting_value) {
        setBlockedIPs(data.setting_value as unknown as BlockedIP[]);
      }
    } catch (error) {
      console.error("Error fetching blocked IPs:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchBlockedIPs();

    // Real-time subscription for users and roles
    const channel = supabase
      .channel('admin-users-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        () => {
          fetchUsers();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_roles' },
        () => {
          fetchUsers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { data: existingRole } = await supabase
        .from("user_roles")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();

      if (newRole === "user") {
        if (existingRole) {
          await supabase.from("user_roles").delete().eq("user_id", userId);
        }
      } else {
        const roleValue = newRole as "admin" | "moderator" | "user";
        if (existingRole) {
          await supabase.from("user_roles").update({ role: roleValue }).eq("user_id", userId);
        } else {
          await supabase.from("user_roles").insert([{ user_id: userId, role: roleValue }]);
        }
      }

      toast.success("Role updated successfully");
      fetchUsers();
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Failed to update role");
    }
  };

  const updateUserProfile = async () => {
    if (!editingUser) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: editingUser.full_name,
          phone: editingUser.phone,
          city: editingUser.city,
          address: editingUser.address,
        })
        .eq("id", editingUser.id);

      if (error) throw error;

      toast.success("User updated successfully");
      setIsDialogOpen(false);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This will also delete their profile.")) return;

    try {
      // Delete from profiles first (this will cascade or fail if there are dependencies)
      const { error } = await supabase.from("profiles").delete().eq("user_id", userId);
      if (error) throw error;

      // Also delete role if exists
      await supabase.from("user_roles").delete().eq("user_id", userId);

      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user. The user may have related data.");
    }
  };

  const saveBlockedIPs = async (ips: BlockedIP[]) => {
    try {
      const { data: existing } = await supabase
        .from("site_settings")
        .select("id")
        .eq("setting_key", "blocked_ips")
        .single();

      if (existing) {
        await supabase
          .from("site_settings")
          .update({ setting_value: JSON.parse(JSON.stringify(ips)) })
          .eq("setting_key", "blocked_ips");
      } else {
        await supabase
          .from("site_settings")
          .insert({ setting_key: "blocked_ips", setting_value: JSON.parse(JSON.stringify(ips)) });
      }

      setBlockedIPs(ips);
      toast.success("Blocked IPs updated");
    } catch (error) {
      console.error("Error saving blocked IPs:", error);
      toast.error("Failed to update blocked IPs");
    }
  };

  const addBlockedIP = () => {
    if (!newIP.ip) {
      toast.error("Please enter an IP address");
      return;
    }

    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$|^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    if (!ipRegex.test(newIP.ip)) {
      toast.error("Please enter a valid IP address");
      return;
    }

    const newEntry: BlockedIP = {
      id: Date.now().toString(),
      ip_address: newIP.ip,
      reason: newIP.reason || "Manually blocked",
      blocked_at: new Date().toISOString(),
      is_active: true,
    };

    saveBlockedIPs([...blockedIPs, newEntry]);
    setNewIP({ ip: "", reason: "" });
  };

  const removeBlockedIP = (id: string) => {
    saveBlockedIPs(blockedIPs.filter((ip) => ip.id !== id));
  };

  const toggleBlockedIP = (id: string) => {
    saveBlockedIPs(
      blockedIPs.map((ip) => (ip.id === id ? { ...ip, is_active: !ip.is_active } : ip))
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-red-500";
      case "store_manager": return "bg-purple-500";
      case "moderator": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone?.includes(searchTerm) ||
      u.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // State for adding new admin/moderator/store manager
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserFullName, setNewUserFullName] = useState("");
  const [newUserRole, setNewUserRole] = useState<"admin" | "moderator" | "store_manager">("moderator");
  const [addingUser, setAddingUser] = useState(false);

  // Password management state
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [userForPasswordChange, setUserForPasswordChange] = useState<UserWithRole | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Status update state
  const [statusUpdateDialogOpen, setStatusUpdateDialogOpen] = useState(false);
  const [userForStatusUpdate, setUserForStatusUpdate] = useState<UserWithRole | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");
  const [statusUpdating, setStatusUpdating] = useState(false);

  const handleAddUserWithRole = async () => {
    if (!newUserEmail.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    if (!newUserPassword.trim() || newUserPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (!newUserFullName.trim()) {
      toast.error("Please enter full name");
      return;
    }

    setAddingUser(true);
    try {
      // Create new user account via Supabase Auth Admin API
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUserEmail,
        password: newUserPassword,
        options: {
          data: {
            full_name: newUserFullName,
          },
          emailRedirectTo: `${window.location.origin}/auth`,
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Failed to create user");

      // Create profile
      const { error: profileError } = await supabase.from("profiles").insert({
        user_id: authData.user.id,
        full_name: newUserFullName,
        email: newUserEmail,
      });

      if (profileError) {
        console.error("Profile creation error:", profileError);
        throw profileError;
      }

      // Assign role
      const { error: roleError } = await supabase.from("user_roles").insert({
        user_id: authData.user.id,
        role: newUserRole,
      });

      if (roleError) {
        console.error("Role creation error:", roleError);
        throw roleError;
      }

      toast.success(`${newUserRole.replace('_', ' ')} account created successfully!`, {
        description: `Email: ${newUserEmail}`,
        duration: 4000
      });
      
      // Reset form and close dialog
      setShowAddUser(false);
      setNewUserEmail("");
      setNewUserPassword("");
      setNewUserFullName("");
      setNewUserRole("moderator");
      
      // Refresh user list
      await new Promise(resolve => setTimeout(resolve, 500));
      fetchUsers();
    } catch (error: any) {
      console.error("Error creating user:", error);
      if (error.message?.includes("already registered")) {
        toast.error("This email is already registered");
      } else {
        toast.error("Failed to create user: " + (error.message || "Unknown error"));
      }
    } finally {
      setAddingUser(false);
    }
  };

  const handleChangePassword = async () => {
    if (!userForPasswordChange) return;
    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setPasswordLoading(true);
    try {
      const { error } = await supabase.auth.admin.updateUserById(
        userForPasswordChange.user_id,
        { password: newPassword }
      );

      if (error) throw error;

      toast.success(`Password updated successfully for ${userForPasswordChange.full_name}`);
      setPasswordDialogOpen(false);
      setUserForPasswordChange(null);
      setNewPassword("");
      fetchUsers();
    } catch (error: any) {
      console.error("Error updating password:", error);
      toast.error(`Failed to update password: ${error.message || "Unknown error"}`);
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!userForStatusUpdate) return;

    setStatusUpdating(true);
    try {
      // Update role in user_roles table
      const { data: existingRole } = await supabase
        .from("user_roles")
        .select("id")
        .eq("user_id", userForStatusUpdate.user_id)
        .maybeSingle();

      if (newStatus === "user") {
        if (existingRole) {
          const { error } = await supabase
            .from("user_roles")
            .delete()
            .eq("user_id", userForStatusUpdate.user_id);
          if (error) throw error;
        }
      } else {
        const roleValue = newStatus as "admin" | "moderator" | "store_manager" | "user";
        if (existingRole) {
          const { error } = await supabase
            .from("user_roles")
            .update({ role: roleValue })
            .eq("user_id", userForStatusUpdate.user_id);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from("user_roles")
            .insert({
              user_id: userForStatusUpdate.user_id,
              role: roleValue,
            });
          if (error) throw error;
        }
      }

      toast.success(`User status updated to ${newStatus}`);
      setStatusUpdateDialogOpen(false);
      setUserForStatusUpdate(null);
      setNewStatus("");
      fetchUsers();
    } catch (error: any) {
      console.error("Error updating status:", error);
      toast.error(`Failed to update status: ${error.message || "Unknown error"}`);
    } finally {
      setStatusUpdating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Users & Security
            </CardTitle>
            <CardDescription>Manage user accounts, roles, and security settings</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setShowAddUser(true)} className="gap-1">
              <Plus className="w-4 h-4" />
              Add Admin/Moderator
            </Button>
            <Button variant="outline" size="sm" onClick={() => { fetchUsers(); fetchBlockedIPs(); }}>
              <RefreshCw className="w-4 h-4 mr-1" />
              Refresh
            </Button>
            <ExportButtons
              data={users.map((u) => ({
                name: u.full_name || "Unknown",
                phone: u.phone || "-",
                city: u.city || "-",
                address: u.address || "-",
                role: u.role || "user",
                joined: new Date(u.created_at).toLocaleDateString(),
              }))}
              filename={`users-${new Date().toISOString().split("T")[0]}`}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Add User Dialog */}
        <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Staff Account</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={newUserFullName}
                  onChange={(e) => setNewUserFullName(e.target.value)}
                  placeholder="Enter full name"
                  disabled={addingUser}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="staff@greengrassstore.com"
                  disabled={addingUser}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  disabled={addingUser}
                />
                <p className="text-xs text-muted-foreground">User can change this later from their account</p>
              </div>
              <div className="space-y-2">
                <Label>Select Role *</Label>
                <Select value={newUserRole} onValueChange={(v) => setNewUserRole(v as "admin" | "moderator" | "store_manager")} disabled={addingUser}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin (Full Access)</SelectItem>
                    <SelectItem value="store_manager">Store Manager (Product & Order Management)</SelectItem>
                    <SelectItem value="moderator">Moderator (Limited Access)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Role Permissions</Label>
                <div className="p-3 bg-muted rounded-lg text-xs space-y-1">
                  {newUserRole === "admin" ? (
                    <ul className="space-y-0.5 text-muted-foreground">
                      <li>✓ Full access to all admin features</li>
                      <li>✓ Manage products, orders, users</li>
                      <li>✓ Site settings and configuration</li>
                      <li>✓ Create/remove staff accounts</li>
                    </ul>
                  ) : newUserRole === "store_manager" ? (
                    <ul className="space-y-0.5 text-muted-foreground">
                      <li>✓ Manage products and inventory</li>
                      <li>✓ Process and manage orders</li>
                      <li>✓ View customer information</li>
                      <li>✓ Manage blog and content</li>
                      <li>✗ Cannot change site settings</li>
                      <li>✗ Cannot manage users</li>
                    </ul>
                  ) : (
                    <ul className="space-y-0.5 text-muted-foreground">
                      <li>✓ View and update orders</li>
                      <li>✓ Manage blog posts</li>
                      <li>✓ View customer information</li>
                      <li>✗ Cannot manage products</li>
                      <li>✗ Cannot change settings</li>
                      <li>✗ Cannot manage users</li>
                    </ul>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddUser(false)} disabled={addingUser}>
                Cancel
              </Button>
              <Button onClick={handleAddUserWithRole} disabled={addingUser}>
                {addingUser ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Account
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="users" className="gap-1">
              <User className="w-4 h-4" />
              Users & Roles
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-1">
              <ShieldX className="w-4 h-4" />
              IP Blocking
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Input
              placeholder="Search users by name, phone, or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-4"
            />

            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : filteredUsers.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No users found</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                              <User className="w-4 h-4" />
                            </div>
                            <span className="font-medium">{user.full_name || "Unknown User"}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{user.phone || "-"}</TableCell>
                        <TableCell className="text-muted-foreground">{user.city || "-"}</TableCell>
                        <TableCell className="text-muted-foreground">{formatDate(user.created_at)}</TableCell>
                        <TableCell>
                          <Badge className={getRoleBadgeColor(user.role || "user")}>{user.role || "user"}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Change Password"
                              onClick={() => {
                                setUserForPasswordChange(user);
                                setPasswordDialogOpen(true);
                              }}
                            >
                              <Key className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Update Status"
                              onClick={() => {
                                setUserForStatusUpdate(user);
                                setNewStatus(user.role || "user");
                                setStatusUpdateDialogOpen(true);
                              }}
                            >
                              <Shield className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setEditingUser(user);
                                setIsDialogOpen(true);
                              }}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              onClick={() => deleteUser(user.user_id)}
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
          </TabsContent>

          <TabsContent value="security">
            <div className="space-y-6">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <h4 className="font-medium text-amber-900 flex items-center gap-2">
                  <Ban className="w-4 h-4" />
                  IP Blocking
                </h4>
                <p className="text-sm text-amber-700 mt-1">
                  Block specific IP addresses from accessing your store. Use with caution.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>IP Address</Label>
                  <Input
                    value={newIP.ip}
                    onChange={(e) => setNewIP({ ...newIP, ip: e.target.value })}
                    placeholder="192.168.1.1"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Reason (Optional)</Label>
                  <Input
                    value={newIP.reason}
                    onChange={(e) => setNewIP({ ...newIP, reason: e.target.value })}
                    placeholder="Suspicious activity"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={addBlockedIP} className="w-full">
                    <Plus className="w-4 h-4 mr-1" />
                    Block IP
                  </Button>
                </div>
              </div>

              {blockedIPs.length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Blocked At</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {blockedIPs.map((ip) => (
                      <TableRow key={ip.id}>
                        <TableCell className="font-mono">{ip.ip_address}</TableCell>
                        <TableCell>{ip.reason}</TableCell>
                        <TableCell>{formatDate(ip.blocked_at)}</TableCell>
                        <TableCell>
                          <Badge variant={ip.is_active ? "destructive" : "secondary"}>
                            {ip.is_active ? "Blocked" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Switch
                              checked={ip.is_active}
                              onCheckedChange={() => toggleBlockedIP(ip.id)}
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              onClick={() => removeBlockedIP(ip.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              {blockedIPs.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No IPs blocked yet</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      {/* Edit User Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {editingUser && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  value={editingUser.full_name || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, full_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={editingUser.phone || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>City</Label>
                <Input
                  value={editingUser.city || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, city: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input
                  value={editingUser.address || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, address: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={updateUserProfile} disabled={saving}>
                  {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          {userForPasswordChange && (
            <div className="space-y-4 py-4">
              <p className="text-sm text-muted-foreground">
                Update password for <strong>{userForPasswordChange.full_name}</strong>
              </p>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password *</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  disabled={passwordLoading}
                />
                <p className="text-xs text-muted-foreground">User will be able to login with this new password</p>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setPasswordDialogOpen(false)} disabled={passwordLoading}>
                  Cancel
                </Button>
                <Button onClick={handleChangePassword} disabled={passwordLoading || !newPassword.trim()}>
                  {passwordLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Update Password
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={statusUpdateDialogOpen} onOpenChange={setStatusUpdateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update User Status</DialogTitle>
          </DialogHeader>
          {userForStatusUpdate && (
            <div className="space-y-4 py-4">
              <p className="text-sm text-muted-foreground">
                Change role for <strong>{userForStatusUpdate.full_name}</strong>
              </p>
              <div className="space-y-2">
                <Label>Select New Status *</Label>
                <Select value={newStatus} onValueChange={setNewStatus} disabled={statusUpdating}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User (No Admin Access)</SelectItem>
                    <SelectItem value="moderator">Moderator (Limited Access)</SelectItem>
                    <SelectItem value="store_manager">Store Manager (Product & Order Management)</SelectItem>
                    <SelectItem value="admin">Admin (Full Access)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="p-3 bg-muted rounded-lg text-xs space-y-1">
                <p className="font-medium">Role Permissions:</p>
                {newStatus === "admin" ? (
                  <ul className="space-y-0.5 text-muted-foreground">
                    <li>✓ Full access to all admin features</li>
                    <li>✓ Manage products, orders, users</li>
                    <li>✓ Site settings and configuration</li>
                  </ul>
                ) : newStatus === "store_manager" ? (
                  <ul className="space-y-0.5 text-muted-foreground">
                    <li>✓ Manage products and inventory</li>
                    <li>✓ Process and manage orders</li>
                    <li>✓ View customer information</li>
                  </ul>
                ) : newStatus === "moderator" ? (
                  <ul className="space-y-0.5 text-muted-foreground">
                    <li>✓ View and update orders</li>
                    <li>✓ Manage blog posts</li>
                    <li>✓ Limited dashboard access</li>
                  </ul>
                ) : (
                  <ul className="space-y-0.5 text-muted-foreground">
                    <li>✗ No admin access</li>
                  </ul>
                )}
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setStatusUpdateDialogOpen(false)} disabled={statusUpdating}>
                  Cancel
                </Button>
                <Button onClick={handleStatusUpdate} disabled={statusUpdating || newStatus === userForStatusUpdate.role}>
                  {statusUpdating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Update Status
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};
