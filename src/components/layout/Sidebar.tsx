import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Truck, 
  Users, 
  Route, 
  Fuel, 
  Wrench, 
  FileText, 
  ChevronLeft,
  ChevronRight,
  LogOut,
  Settings,
  Building2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Trucks', href: '/trucks', icon: Truck },
  { name: 'Drivers', href: '/drivers', icon: Users },
  { name: 'Trips', href: '/trips', icon: Route },
  { name: 'Fuel Records', href: '/fuel', icon: Fuel },
  { name: 'Maintenance', href: '/maintenance', icon: Wrench },
  { name: 'Reports', href: '/reports', icon: FileText },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar transition-all duration-300 ease-in-out",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className={cn(
          "flex h-16 items-center border-b border-sidebar-border px-4",
          collapsed ? "justify-center" : "justify-between"
        )}>
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary">
                <Truck className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-display text-lg font-bold text-sidebar-foreground">FleetPro</h1>
                <p className="text-xs text-sidebar-foreground/60">Management System</p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary">
              <Truck className="h-6 w-6 text-primary-foreground" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-sidebar-accent text-sidebar-primary shadow-sm" 
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                  collapsed && "justify-center px-2"
                )}
              >
                <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-sidebar-primary")} />
                {!collapsed && <span>{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Business System Link */}
        <div className="border-t border-sidebar-border px-3 py-3">
          <NavLink
            to="/business"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
              location.pathname === '/business'
                ? "bg-accent/20 text-accent" 
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
              collapsed && "justify-center px-2"
            )}
          >
            <Building2 className="h-5 w-5 shrink-0" />
            {!collapsed && <span>Business System</span>}
          </NavLink>
        </div>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-3">
          <div className={cn(
            "mb-3 flex items-center gap-3 rounded-lg bg-sidebar-accent/30 p-3",
            collapsed && "justify-center"
          )}>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-primary text-xs font-bold text-primary-foreground">
              AD
            </div>
            {!collapsed && (
              <div className="flex-1">
                <p className="text-sm font-medium text-sidebar-foreground">Admin User</p>
                <p className="text-xs text-sidebar-foreground/60">Administrator</p>
              </div>
            )}
          </div>
          
          <div className={cn("flex gap-2", collapsed ? "flex-col" : "")}>
            <Button 
              variant="ghost" 
              size={collapsed ? "icon" : "sm"}
              className="flex-1 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            >
              <Settings className="h-4 w-4" />
              {!collapsed && <span className="ml-2">Settings</span>}
            </Button>
            <Button 
              variant="ghost" 
              size={collapsed ? "icon" : "sm"}
              className="flex-1 text-sidebar-foreground/70 hover:bg-destructive/20 hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              {!collapsed && <span className="ml-2">Logout</span>}
            </Button>
          </div>
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-sidebar-border bg-sidebar text-sidebar-foreground shadow-md transition-colors hover:bg-sidebar-accent"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>
    </aside>
  );
}
