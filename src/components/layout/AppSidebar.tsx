import { useLocation } from "react-router-dom";
import {
  Activity,
  Users,
  Bed,
  UserCheck,
  Building2,
  Package,
  BarChart3,
  Lightbulb,
  GitBranch,
  AlertTriangle,
  Shield,
  Droplets,
  Map,
  Trash2,
  Ambulance,
  Bug
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const features = [
  { title: "Command Center", url: "/command-center", icon: BarChart3 },
  { title: "City Operations", url: "/dashboard", icon: Activity },
  { title: "OPD Queue", url: "/opd-queue", icon: Users },
  { title: "Bed Availability", url: "/beds", icon: Bed },
  { title: "Admission Workflow", url: "/admission", icon: UserCheck },
  { title: "Hospital Network", url: "/network", icon: Building2 },
  { title: "Inventory Tracking", url: "/inventory", icon: Package },
  { title: "Micro-Interventions", url: "/interventions", icon: Lightbulb },
  { title: "City Patient Flow", url: "/patient-flow", icon: GitBranch },
  { title: "Early Load Detection", url: "/load-detection", icon: AlertTriangle },
  { title: "Resilience Index", url: "/resilience", icon: Shield },
  { title: "Blood Bank", url: "/blood-bank", icon: Droplets },
  { title: "City Health Heatmap", url: "/heatmap", icon: Map },
  { title: "Resource Decay Predictor", url: "/resource-decay", icon: Trash2 },
  { title: "Ambulance Detection", url: "/ambulance-detection", icon: Ambulance },
  { title: "Disease Outbreak Detection", url: "/outbreak-detection", icon: Bug },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="p-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-medium shrink-0">
            <Activity className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="font-display font-bold text-xl">MedSync</span>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {/* Home Link */}
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <NavLink
                  to="/"
                  end
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                    isActive("/")
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                  activeClassName="bg-primary/10 text-primary"
                >
                  <Activity className="w-5 h-5 shrink-0" />
                  {!collapsed && <span>Home</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Features */}
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-3 mb-2">
              Features
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {features.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                        isActive(item.url)
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                      activeClassName="bg-primary/10 text-primary font-medium"
                    >
                      <item.icon className="w-5 h-5 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        {!collapsed && (
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs font-medium">System Online</span>
            </div>
            <p className="text-xs text-muted-foreground">
              All services operational
            </p>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
