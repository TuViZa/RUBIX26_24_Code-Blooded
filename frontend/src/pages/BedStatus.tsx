
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { StatCard } from "@/components/dashboard/StatCard";
import { 
  Bed, 
  Grid3X3, 
  List,
  Building2,
  UserPlus,
  AlertTriangle
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const departments = [
  { 
    id: "emergency", 
    name: "Emergency", 
    floor: "Ground Floor",
    totalBeds: 20, 
    beds: Array.from({ length: 20 }, (_, i) => ({
      id: `E-${String(i + 1).padStart(2, '0')}`,
      status: i < 18 ? (Math.random() > 0.3 ? "occupied" : "reserved") : "available"
    }))
  },
  { 
    id: "icu", 
    name: "ICU", 
    floor: "1st Floor",
    totalBeds: 15, 
    beds: Array.from({ length: 15 }, (_, i) => ({
      id: `ICU-${String(i + 1).padStart(2, '0')}`,
      status: i < 14 ? "occupied" : "available"
    }))
  },
  { 
    id: "general", 
    name: "General Ward", 
    floor: "2nd Floor",
    totalBeds: 80, 
    beds: Array.from({ length: 80 }, (_, i) => ({
      id: `GW-${String(i + 1).padStart(2, '0')}`,
      status: i < 62 ? (Math.random() > 0.2 ? "occupied" : "maintenance") : "available"
    }))
  },
  { 
    id: "pediatrics", 
    name: "Pediatrics", 
    floor: "3rd Floor",
    totalBeds: 30, 
    beds: Array.from({ length: 30 }, (_, i) => ({
      id: `PED-${String(i + 1).padStart(2, '0')}`,
      status: i < 22 ? "occupied" : (Math.random() > 0.5 ? "available" : "reserved")
    }))
  },
  { 
    id: "cardiology", 
    name: "Cardiology", 
    floor: "4th Floor",
    totalBeds: 25, 
    beds: Array.from({ length: 25 }, (_, i) => ({
      id: `CAR-${String(i + 1).padStart(2, '0')}`,
      status: i < 20 ? "occupied" : "available"
    }))
  },
];

const statusColors = {
  available: "bg-success hover:bg-success/80",
  occupied: "bg-critical/80 hover:bg-critical",
  reserved: "bg-warning hover:bg-warning/80",
  maintenance: "bg-muted-foreground/30 hover:bg-muted-foreground/40",
};

const BedStatus = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const totalBeds = departments.reduce((acc, dept) => acc + dept.totalBeds, 0);
  const occupiedBeds = departments.reduce((acc, dept) => 
    acc + dept.beds.filter(b => b.status === "occupied").length, 0);
  const availableBeds = departments.reduce((acc, dept) => 
    acc + dept.beds.filter(b => b.status === "available").length, 0);

  return (
    
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold mb-2">Bed Availability Dashboard</h1>
            <p className="text-muted-foreground">Real-time bed occupancy across all departments</p>
          </div>
          <div className="flex items-center gap-3 mt-4 lg:mt-0">
            <div className="flex bg-muted rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-2 rounded-md transition-colors",
                  viewMode === "grid" ? "bg-card shadow-sm" : "hover:bg-card/50"
                )}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-2 rounded-md transition-colors",
                  viewMode === "list" ? "bg-card shadow-sm" : "hover:bg-card/50"
                )}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            <Button variant="hero" size="sm">
              <UserPlus className="w-4 h-4 mr-2" />
              New Admission
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Beds"
            value={totalBeds}
            icon={Bed}
            variant="default"
          />
          <StatCard
            title="Occupied"
            value={occupiedBeds}
            subtitle={`${Math.round((occupiedBeds / totalBeds) * 100)}% occupancy`}
            icon={Bed}
            variant="critical"
          />
          <StatCard
            title="Available"
            value={availableBeds}
            icon={Bed}
            variant="success"
          />
          <StatCard
            title="Critical Depts"
            value={2}
            subtitle="Emergency, ICU"
            icon={AlertTriangle}
            variant="warning"
          />
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-6 mb-6 p-4 bg-card rounded-xl border border-border">
          <span className="text-sm font-medium">Status Legend:</span>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-success" />
            <span className="text-sm">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-critical/80" />
            <span className="text-sm">Occupied</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-warning" />
            <span className="text-sm">Reserved</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-muted-foreground/30" />
            <span className="text-sm">Maintenance</span>
          </div>
        </div>

        {/* Department Sections */}
        <div className="space-y-6">
          {departments.map((dept) => {
            const occupied = dept.beds.filter(b => b.status === "occupied").length;
            const available = dept.beds.filter(b => b.status === "available").length;
            const occupancyRate = Math.round((occupied / dept.totalBeds) * 100);

            return (
              <div 
                key={dept.id} 
                className="bg-card rounded-2xl border border-border overflow-hidden animate-slide-up"
              >
                {/* Department Header */}
                <div className="p-4 border-b border-border bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center",
                        occupancyRate > 90 ? "bg-critical/10" :
                        occupancyRate > 70 ? "bg-warning/10" : "bg-success/10"
                      )}>
                        <Building2 className={cn(
                          "w-5 h-5",
                          occupancyRate > 90 ? "text-critical" :
                          occupancyRate > 70 ? "text-warning" : "text-success"
                        )} />
                      </div>
                      <div>
                        <h3 className="font-display font-semibold">{dept.name}</h3>
                        <p className="text-sm text-muted-foreground">{dept.floor}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Occupancy</div>
                        <div className={cn(
                          "font-display font-bold",
                          occupancyRate > 90 ? "text-critical" :
                          occupancyRate > 70 ? "text-warning" : "text-success"
                        )}>
                          {occupancyRate}%
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Available</div>
                        <div className="font-display font-bold text-success">{available}</div>
                      </div>
                      <StatusBadge 
                        status={occupancyRate > 90 ? "critical" : occupancyRate > 70 ? "warning" : "normal"} 
                        size="sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Beds Grid */}
                <div className="p-4">
                  <div className={cn(
                    "grid gap-2",
                    viewMode === "grid" 
                      ? "grid-cols-10 md:grid-cols-15 lg:grid-cols-20" 
                      : "grid-cols-1"
                  )}>
                    {dept.beds.map((bed) => (
                      viewMode === "grid" ? (
                        <button
                          key={bed.id}
                          className={cn(
                            "aspect-square rounded-lg transition-all text-xs font-medium text-white flex items-center justify-center hover:scale-110",
                            statusColors[bed.status as keyof typeof statusColors]
                          )}
                          title={`${bed.id} - ${bed.status}`}
                        >
                          {bed.id.split('-')[1]}
                        </button>
                      ) : (
                        <div
                          key={bed.id}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center",
                              statusColors[bed.status as keyof typeof statusColors]
                            )}>
                              <Bed className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-mono font-medium">{bed.id}</span>
                          </div>
                          <StatusBadge 
                            status={bed.status as any} 
                            size="sm"
                          />
                        </div>
                      )
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

export default BedStatus;
