import React, { useState, useMemo, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { StatCard } from "@/components/dashboard/StatCard";
import { mediSyncServices } from "@/lib/firebase-services";
import { toast } from "sonner";
import { 
  Bed, 
  Grid3X3, 
  PieChart, // Replaces List icon
  Building2,
  UserPlus,
  AlertTriangle,
  X,
  CheckCircle2,
  Wrench,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// --- Types & Initial Data ---
type BedStatus = "available" | "occupied" | "reserved" | "maintenance";

interface BedData {
  id: string;
  status: BedStatus;
  lastUpdated: string;
}

interface DeptData {
  id: string;
  name: string;
  floor: string;
  totalBeds: number;
  beds: BedData[];
}

const initialDepartments: DeptData[] = [
  { id: "emergency", name: "Emergency", floor: "Ground Floor", totalBeds: 10, beds: [] },
  { id: "icu", name: "ICU", floor: "1st Floor", totalBeds: 8, beds: [] },
  { id: "general", name: "General Ward", floor: "2nd Floor", totalBeds: 20, beds: [] },
];

const hydratedDepts = initialDepartments.map(dept => ({
  ...dept,
  beds: Array.from({ length: dept.totalBeds }, (_, i) => ({
    id: `${dept.id.toUpperCase().substring(0, 1)}-${String(i + 1).padStart(2, '0')}`,
    status: (Math.random() > 0.5 ? "occupied" : "available") as BedStatus,
    lastUpdated: "Today, 10:00 AM"
  }))
}));

const statusColors = {
  available: "bg-success border-success/20 text-white",
  occupied: "bg-critical border-critical/20 text-white",
  reserved: "bg-warning border-warning/20 text-white",
  maintenance: "bg-muted-foreground/30 border-muted-foreground/20 text-white",
};

// --- Helper Component for Circular Visualization ---
const OccupancyCircle = ({ percent, colorClass }: { percent: number; colorClass: string }) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-32 h-32">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="64"
          cy="64"
          r={radius}
          className="text-muted stroke-current"
          strokeWidth="8"
          fill="transparent"
        />
        <circle
          cx="64"
          cy="64"
          r={radius}
          className={cn("stroke-current transition-all duration-1000 ease-out", colorClass)}
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-bold">{percent}%</span>
        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">Filled</span>
      </div>
    </div>
  );
};

const BedStatusDashboard = () => {
  const [departments, setDepartments] = useState<DeptData[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "viz">("grid");
  const [loading, setLoading] = useState(true);

  // Load data from Firebase on mount
  useEffect(() => {
    const loadBedData = async () => {
      try {
        setLoading(true);
        const bedData = await mediSyncServices.beds.getAll();
        
        if (bedData && Object.keys(bedData).length > 0) {
          // Convert Firebase data to department structure
          const bedsArray = Object.entries(bedData).map(([id, bed]: [string, any]) => ({
            id,
            ...bed
          }));
          
          // Organize beds by departments
          const emergencyBeds = bedsArray.filter(b => b.id.startsWith('E-'));
          const icuBeds = bedsArray.filter(b => b.id.startsWith('I-'));
          const generalBeds = bedsArray.filter(b => b.id.startsWith('G-'));
          
          const deptData: DeptData[] = [
            { 
              id: "emergency", 
              name: "Emergency", 
              floor: "Ground Floor", 
              totalBeds: 10, 
              beds: emergencyBeds.length > 0 ? emergencyBeds : Array.from({ length: 10 }, (_, i) => ({
                id: `E-${String(i + 1).padStart(2, '0')}`,
                status: (Math.random() > 0.5 ? "occupied" : "available") as BedStatus,
                lastUpdated: "Today, 10:00 AM"
              }))
            },
            { 
              id: "icu", 
              name: "ICU", 
              floor: "1st Floor", 
              totalBeds: 8, 
              beds: icuBeds.length > 0 ? icuBeds : Array.from({ length: 8 }, (_, i) => ({
                id: `I-${String(i + 1).padStart(2, '0')}`,
                status: (Math.random() > 0.3 ? "occupied" : "available") as BedStatus,
                lastUpdated: "Today, 10:00 AM"
              }))
            },
            { 
              id: "general", 
              name: "General Ward", 
              floor: "2nd Floor", 
              totalBeds: 20, 
              beds: generalBeds.length > 0 ? generalBeds : Array.from({ length: 20 }, (_, i) => ({
                id: `G-${String(i + 1).padStart(2, '0')}`,
                status: (Math.random() > 0.6 ? "occupied" : "available") as BedStatus,
                lastUpdated: "Today, 10:00 AM"
              }))
            }
          ];
          
          setDepartments(deptData);
        } else {
          // Initialize with default data
          const defaultDepts = [
            { id: "emergency", name: "Emergency", floor: "Ground Floor", totalBeds: 10, beds: [] },
            { id: "icu", name: "ICU", floor: "1st Floor", totalBeds: 8, beds: [] },
            { id: "general", name: "General Ward", floor: "2nd Floor", totalBeds: 20, beds: [] },
          ];
          
          const hydratedDepts = defaultDepts.map(dept => ({
            ...dept,
            beds: Array.from({ length: dept.totalBeds }, (_, i) => ({
              id: `${dept.id.toUpperCase().substring(0, 1)}-${String(i + 1).padStart(2, '0')}`,
              status: (Math.random() > 0.5 ? "occupied" : "available") as BedStatus,
              lastUpdated: "Today, 10:00 AM"
            }))
          }));
          
          // Add to Firebase
          for (const dept of hydratedDepts) {
            for (const bed of dept.beds) {
              await mediSyncServices.beds.updateStatus(bed.id, bed.status);
            }
          }
          
          setDepartments(hydratedDepts);
        }
      } catch (error) {
        console.error('Error loading bed data:', error);
        toast.error('Failed to load bed data');
      } finally {
        setLoading(false);
      }
    };

    loadBedData();
    
    // Listen for real-time updates
    const unsubscribe = mediSyncServices.beds.listen((bedData) => {
      if (bedData && Object.keys(bedData).length > 0) {
        const bedsArray = Object.entries(bedData).map(([id, bed]: [string, any]) => ({
          id,
          ...bed
        }));
        
        // Reorganize into departments
        const emergencyBeds = bedsArray.filter(b => b.id.startsWith('E-'));
        const icuBeds = bedsArray.filter(b => b.id.startsWith('I-'));
        const generalBeds = bedsArray.filter(b => b.id.startsWith('G-'));
        
        const deptData: DeptData[] = [
          { 
            id: "emergency", 
            name: "Emergency", 
            floor: "Ground Floor", 
            totalBeds: 10, 
            beds: emergencyBeds.length > 0 ? emergencyBeds : Array.from({ length: 10 }, (_, i) => ({
              id: `E-${String(i + 1).padStart(2, '0')}`,
              status: "available" as BedStatus,
              lastUpdated: "Today, 10:00 AM"
            }))
          },
          { 
            id: "icu", 
            name: "ICU", 
            floor: "1st Floor", 
            totalBeds: 8, 
            beds: icuBeds.length > 0 ? icuBeds : Array.from({ length: 8 }, (_, i) => ({
              id: `I-${String(i + 1).padStart(2, '0')}`,
              status: "available" as BedStatus,
              lastUpdated: "Today, 10:00 AM"
            }))
          },
          { 
            id: "general", 
            name: "General Ward", 
            floor: "2nd Floor", 
            totalBeds: 20, 
            beds: generalBeds.length > 0 ? generalBeds : Array.from({ length: 20 }, (_, i) => ({
              id: `G-${String(i + 1).padStart(2, '0')}`,
              status: "available" as BedStatus,
              lastUpdated: "Today, 10:00 AM"
            }))
          }
        ];
        
        setDepartments(deptData);
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // --- Handlers ---
  const updateBedStatus = async (deptId: string, bedId: string, newStatus: BedStatus) => {
    try {
      await mediSyncServices.beds.updateStatus(bedId, newStatus);
      toast.success(`Bed ${bedId} status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating bed status:', error);
      toast.error('Failed to update bed status');
    }
  };

  const handleNewAdmission = async (deptId: string) => {
    try {
      const dept = departments.find(d => d.id === deptId);
      if (!dept) return;
      
      const availableBed = dept.beds.find(b => b.status === "available");
      if (!availableBed) {
        toast.error('No available beds in this department');
        return;
      }
      
      await mediSyncServices.beds.updateStatus(availableBed.id, "occupied");
      toast.success(`Patient admitted to bed ${availableBed.id}`);
    } catch (error) {
      console.error('Error admitting patient:', error);
      toast.error('Failed to admit patient');
    }
  };

  // --- Calculations ---
  const stats = useMemo(() => {
    let total = 0;
    let occupied = 0;
    let available = 0;
    departments.forEach(d => {
      total += d.totalBeds;
      occupied += d.beds.filter(b => b.status === "occupied").length;
      available += d.beds.filter(b => b.status === "available").length;
    });
    return { total, occupied, available };
  }, [departments]);

  return (
    
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold mb-2">Ward Command Center</h1>
            <p className="text-muted-foreground">Real-time facility management and patient occupancy</p>
          </div>
          <div className="flex items-center gap-3 mt-4 lg:mt-0">
            <div className="flex bg-muted rounded-lg p-1 border border-border">
              <button 
                onClick={() => setViewMode("grid")} 
                className={cn("p-2 rounded-md transition-all", viewMode === "grid" ? "bg-card shadow-sm text-primary" : "text-muted-foreground hover:bg-card/50")}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode("viz")} 
                className={cn("p-2 rounded-md transition-all", viewMode === "viz" ? "bg-card shadow-sm text-primary" : "text-muted-foreground hover:bg-card/50")}
              >
                <PieChart className="w-4 h-4" />
              </button>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="hero" size="sm" className="shadow-lg shadow-primary/20">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Admit Patient
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="text-[10px] uppercase font-bold text-muted-foreground">Select Ward</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {departments.map(d => (
                  <DropdownMenuItem key={d.id} onClick={() => handleNewAdmission(d.id)} className="cursor-pointer">
                    {d.name} ({d.beds.filter(b => b.status === "available").length} Free)
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Capacity" value={stats.total} icon={Bed} variant="default" />
          <StatCard title="Active Patients" value={stats.occupied} subtitle={`${Math.round((stats.occupied / stats.total) * 100)}% capacity`} icon={Bed} variant="critical" />
          <StatCard title="Available Beds" value={stats.available} icon={CheckCircle2} variant="success" />
          <StatCard title="In Maintenance" value={stats.total - stats.occupied - stats.available} icon={Wrench} variant="warning" />
        </div>

        {/* Ward Sections */}
        <div className={cn(
          "grid gap-6",
          viewMode === "viz" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
        )}>
          {departments.map((dept) => {
            const occupiedCount = dept.beds.filter(b => b.status === "occupied").length;
            const availableCount = dept.beds.filter(b => b.status === "available").length;
            const occupancyRate = Math.round((occupiedCount / dept.totalBeds) * 100);

            return viewMode === "viz" ? (
              /* --- Circular Visualization Mode --- */
              <div key={dept.id} className="bg-card rounded-2xl border border-border p-8 flex flex-col items-center shadow-sm hover:shadow-md transition-all">
                <h3 className="font-bold text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", occupancyRate > 85 ? "bg-critical animate-pulse" : "bg-success")} />
                  {dept.name} Ward
                </h3>
                
                <OccupancyCircle 
                  percent={occupancyRate} 
                  colorClass={occupancyRate > 85 ? "text-critical" : occupancyRate > 60 ? "text-warning" : "text-success"} 
                />

                <div className="mt-8 w-full space-y-4">
                  <div className="flex justify-between items-center border-b border-border/50 pb-2">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase">Occupied</span>
                    <span className="text-sm font-bold text-critical">{occupiedCount} Beds</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-border/50 pb-2">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase">Available</span>
                    <span className="text-sm font-bold text-success">{availableCount} Beds</span>
                  </div>
                  <div className="flex justify-between items-center pt-1 text-muted-foreground">
                    <span className="text-[10px] font-medium uppercase tracking-wider italic">{dept.floor}</span>
                    <span className="text-[10px] font-bold uppercase">{dept.totalBeds} Total</span>
                  </div>
                </div>
              </div>
            ) : (
              /* --- Detailed Bed Grid Mode --- */
              <div key={dept.id} className="bg-card rounded-2xl border border-border overflow-hidden">
                <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center font-bold", occupancyRate > 85 ? "bg-critical/10 text-critical" : "bg-primary/10 text-primary")}>
                      {dept.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold">{dept.name} Ward</h3>
                      <p className="text-xs text-muted-foreground">{dept.floor} • {dept.totalBeds} Total Beds</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-center">
                    <div className="text-right">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">Occupancy</p>
                      <p className={cn("font-bold", occupancyRate > 85 ? "text-critical" : "text-foreground")}>{occupancyRate}%</p>
                    </div>
                    <StatusBadge status={occupancyRate > 85 ? "critical" : "normal"} size="sm" />
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-4">
                    {dept.beds.map((bed) => (
                      <DropdownMenu key={bed.id}>
                        <DropdownMenuTrigger asChild>
                          <button className={cn(
                            "group relative h-20 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-1 shadow-sm",
                            bed.status === "available" ? "border-success/20 bg-success/5 text-success hover:bg-success/10" :
                            bed.status === "occupied" ? "border-critical/20 bg-critical/5 text-critical hover:bg-critical/10" :
                            bed.status === "maintenance" ? "border-muted-foreground/20 bg-muted/10 text-muted-foreground" : 
                            "border-warning/20 bg-warning/5 text-warning"
                          )}>
                            <div className="absolute top-1 left-2 text-[9px] font-mono font-bold opacity-60">
                              {bed.id}
                            </div>
                            <Bed className={cn(
                              "w-7 h-7 transition-transform group-hover:scale-110",
                              bed.status === "available" ? "opacity-30" : "opacity-100"
                            )} />
                            <span className="text-[8px] font-bold uppercase tracking-tighter">
                              {bed.status}
                            </span>
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Bed Actions: {bed.id}</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {bed.status === "available" && (
                            <DropdownMenuItem onClick={() => updateBedStatus(dept.id, bed.id, "occupied")} className="cursor-pointer">
                              <UserPlus className="w-4 h-4 mr-2" /> Admit Patient
                            </DropdownMenuItem>
                          )}
                          {bed.status === "occupied" && (
                            <DropdownMenuItem onClick={() => updateBedStatus(dept.id, bed.id, "maintenance")} className="cursor-pointer text-critical">
                              <X className="w-4 h-4 mr-2" /> Discharge & Clean
                            </DropdownMenuItem>
                          )}
                          {bed.status === "maintenance" && (
                            <DropdownMenuItem onClick={() => updateBedStatus(dept.id, bed.id, "available")} className="cursor-pointer text-success">
                              <CheckCircle2 className="w-4 h-4 mr-2" /> Mark as Ready
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => updateBedStatus(dept.id, bed.id, "reserved")} className="cursor-pointer">
                            <AlertTriangle className="w-4 h-4 mr-2" /> Reserve Bed
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    
  );
};

export default BedStatusDashboard;