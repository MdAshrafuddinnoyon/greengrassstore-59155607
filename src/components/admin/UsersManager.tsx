import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Shield, User, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ExportButtons } from "./ExportButtons";
import { toast } from "sonner";

interface UserWithRole {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  city: string | null;
  created_at: string;
  role?: string;
}

export const UsersManager = () => {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch roles
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rolesError) throw rolesError;

      // Merge profiles with roles
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      // Check if role exists
      const { data: existingRole } = await supabase
        .from("user_roles")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();

      if (newRole === "user") {
        // Remove role entry if setting to user
        if (existingRole) {
          await supabase
            .from("user_roles")
            .delete()
            .eq("user_id", userId);
        }
      } else {
        const roleValue = newRole as "admin" | "moderator" | "user";
        if (existingRole) {
          // Update existing role
          await supabase
            .from("user_roles")
            .update({ role: roleValue })
            .eq("user_id", userId);
        } else {
          // Insert new role
          await supabase
            .from("user_roles")
            .insert([{ user_id: userId, role: roleValue }]);
        }
      }

      toast.success("Role updated successfully");
      fetchUsers();
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Failed to update role");
    }
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
      case "moderator": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Users & Roles
            </CardTitle>
            <CardDescription>Manage user accounts and permissions</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchUsers}>
              <RefreshCw className="w-4 h-4 mr-1" />
              Refresh
            </Button>
            <ExportButtons 
              data={users.map(u => ({ 
                name: u.full_name || 'Unknown', 
                phone: u.phone || '-', 
                city: u.city || '-', 
                role: u.role || 'user',
                joined: new Date(u.created_at).toLocaleDateString()
              }))} 
              filename={`users-${new Date().toISOString().split('T')[0]}`}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : users.length === 0 ? (
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
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          <User className="w-4 h-4" />
                        </div>
                        <span className="font-medium">
                          {user.full_name || "Unknown User"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.phone || "-"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.city || "-"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(user.created_at)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeColor(user.role || "user")}>
                        {user.role || "user"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Select
                        value={user.role || "user"}
                        onValueChange={(value) => updateUserRole(user.user_id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="moderator">Moderator</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
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
