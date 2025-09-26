import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Shield,
  Coins,
  Calendar,
  BarChart3,
  ScrollText,
  Gift,
  Newspaper,
  Settings,
  LogOut,
  UserCog,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const navigationItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Players", url: "/players", icon: Users },
  { title: "Guilds", url: "/guilds", icon: Shield },
  { title: "Rewards", url: "/rewards", icon: Gift },
  { title: "News", url: "/news", icon: Newspaper },
  { title: "Economy", url: "/economy", icon: Coins },
  { title: "Events", url: "/events", icon: Calendar },
  { title: "Monitoring", url: "/monitoring", icon: BarChart3 },
  { title: "Audit Logs", url: "/logs", icon: ScrollText },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const { user } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-sidebar-accent text-sidebar-primary font-semibold gaming-shadow"
      : "hover:bg-sidebar-accent/50 smooth-transition";

  return (
    <Sidebar className={collapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
            <img
              src="/logo.png"   // put your image in the public/ folder
              alt="AgelessRepublic"
              className="w-10 h-10 object-contain"
            />
          {!collapsed && (
            <div>
              <h2 className="font-bold text-lg text-sidebar-foreground">MMORPG</h2>
              <p className="text-xs text-muted-foreground">Admin Panel</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="w-5 h-5" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {user?.role === 'admin' && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <NavLink to="/user-management" className={getNavCls}>
                      <UserCog className="w-5 h-5" />
                      {!collapsed && <span>User Management</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="space-y-2">
          <SidebarMenuButton asChild>
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <Settings className="w-4 h-4" />
              {!collapsed && <span>Settings</span>}
            </Button>
          </SidebarMenuButton>
          <SidebarMenuButton asChild>
            <Button variant="ghost" size="sm" className="w-full justify-start text-destructive hover:text-destructive">
              <LogOut className="w-4 h-4" />
              {!collapsed && <span>Logout</span>}
            </Button>
          </SidebarMenuButton>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}