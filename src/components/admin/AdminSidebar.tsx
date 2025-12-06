import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  ShoppingBag,
  FolderTree,
  Receipt,
  FileText,
  UserCheck,
  MessageSquare,
  Image,
  Megaphone,
  LayoutTemplate,
  Menu,
  BookOpen,
  Palette,
  Bell,
  Ticket,
  Settings,
  ChevronRight,
  PanelLeftClose,
  PanelLeft
} from "lucide-react";

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

const mainNavItems: NavItem[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "products", label: "Products", icon: ShoppingBag },
  { id: "categories", label: "Categories", icon: FolderTree },
  { id: "orders", label: "Orders", icon: Receipt },
  { id: "customers", label: "Customers", icon: UserCheck },
  { id: "blog", label: "Blog", icon: FileText },
  { id: "subscribers", label: "Subscribers", icon: MessageSquare },
  { id: "requests", label: "Requests", icon: MessageSquare },
];

const contentNavItems: NavItem[] = [
  { id: "media", label: "Media Library", icon: Image },
  { id: "announcements", label: "Top Bar", icon: Megaphone },
  { id: "homepage", label: "Homepage", icon: LayoutTemplate },
  { id: "megamenu", label: "Mega Menu", icon: Menu },
  { id: "pages", label: "Pages", icon: BookOpen },
  { id: "content", label: "Branding", icon: Palette },
  { id: "footer", label: "Footer", icon: Menu },
  { id: "popups", label: "Popups", icon: Bell },
  { id: "coupons", label: "Coupons", icon: Ticket },
];

const settingsNavItems: NavItem[] = [
  { id: "settings", label: "Settings", icon: Settings },
];

export const AdminSidebar = ({ activeTab, onTabChange }: AdminSidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavSection = ({ title, items }: { title: string; items: NavItem[] }) => (
    <div className="mb-6">
      {!isCollapsed && (
        <h3 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {title}
        </h3>
      )}
      <div className="space-y-1">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              onTabChange(item.id);
              setMobileOpen(false);
            }}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
              "hover:bg-primary/10 hover:text-primary",
              activeTab === item.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground",
              isCollapsed && "justify-center px-2"
            )}
            title={isCollapsed ? item.label : undefined}
          >
            <item.icon className={cn("w-5 h-5 flex-shrink-0", isCollapsed && "w-6 h-6")} />
            {!isCollapsed && (
              <>
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <Badge variant="secondary" className="text-xs">
                    {item.badge}
                  </Badge>
                )}
              </>
            )}
          </button>
        ))}
      </div>
    </div>
  );

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className={cn(
        "flex items-center gap-3 p-4 border-b border-border/50",
        isCollapsed && "justify-center"
      )}>
        {!isCollapsed && (
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <LayoutDashboard className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-bold text-foreground">Admin Panel</h2>
              <p className="text-xs text-muted-foreground">Green Grass Store</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex hover:bg-primary/10"
        >
          {isCollapsed ? <PanelLeft className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <NavSection title="Main" items={mainNavItems} />
        <NavSection title="Content" items={contentNavItems} />
        <NavSection title="System" items={settingsNavItems} />
      </ScrollArea>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-border/50">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-2">Need help?</p>
            <p className="text-sm font-medium text-foreground">Contact Support</p>
            <p className="text-xs text-muted-foreground">support@websearchbd.com</p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Trigger */}
      <div className="lg:hidden fixed top-20 left-4 z-40">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button 
              size="icon" 
              variant="outline"
              className="bg-background shadow-lg"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden lg:flex flex-col bg-card border-r border-border/50 transition-all duration-300",
        isCollapsed ? "w-20" : "w-72"
      )}>
        <SidebarContent />
      </aside>
    </>
  );
};
