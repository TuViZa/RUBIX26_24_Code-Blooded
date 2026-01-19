import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { 
  Map, 
  Layers,
  RefreshCw,
  AlertTriangle,
  Building2,
  Users,
  Bed,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";

const zones = [
  { id: 1, name: "North District", opdPressure: "high", bedShortage: "critical", emergencies: 5, status: "overloaded" },
  { id: 2, name: "South District", opdPressure: "normal", bedShortage: "none", emergencies: 1, status: "healthy" },
  { id: 3, name: "East District", opdPressure: "moderate", bedShortage: "moderate", emergencies: 3, status: "moderate" },
  { id: 4, name: "West District", opdPressure: "high", bedShortage: "none", emergencies: 2, status: "moderate" },
  { id: 5, name: "Central District", opdPressure: "critical", bedShortage: "high", emergencies: 8, status: "overloaded" },
  { id: 6, name: "Industrial Zone", opdPressure: "low", bedShortage: "none", emergencies: 0, status: "healthy" },
];

const statusColors = {
  healthy: "bg-success",
  moderate: "bg-warning",
  overloaded: "bg-critical",
};

const CityHeatmap = () => {
  const healthyZones = zones.filter(z => z.status === "healthy").length;
  const overloadedZones = zones.filter(z => z.status === "overloaded").length;
  const totalEmergencies = zones.reduce((acc, z) => acc + z.emergencies, 0);

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold mb-2">City Health Heatmap</h1>
            <p className="text-muted-foreground">Real-time city-wide healthcare load visualization</p>
          </div>
          <div className="flex items-center gap-3 mt-4 lg:mt-0">
            <Button variant="outline" size="sm">
              <Layers className="w-4 h-4 mr-2" />
              Toggle Layers
            </Button>
            <Button variant="hero" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Healthy Zones"
            value={healthyZones}
            subtitle={`of ${zones.length} total`}
            icon={Activity}
            variant="success"
          />
          <StatCard
            title="Overloaded Zones"
            value={overloadedZones}
            icon={AlertTriangle}
            variant="critical"
          />
          <StatCard
            title="Active Emergencies"
            value={totalEmergencies}
            icon={Building2}
            variant="warning"
          />
          <StatCard
            title="Hospitals Monitored"
            value={24}
            icon={Building2}
            variant="primary"
          />
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-6 mb-6 p-4 bg-card rounded-xl border border-border">
          <span className="text-sm font-medium">Zone Status:</span>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-success" />
            <span className="text-sm">Healthy</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-warning" />
            <span className="text-sm">Moderate Load</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-critical" />
            <span className="text-sm">Overloaded</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map Placeholder */}
          <div className="lg:col-span-2 bg-card rounded-2xl border border-border overflow-hidden">
            <div className="p-4 border-b border-border bg-muted/30">
              <h2 className="font-display font-semibold">City Overview Map</h2>
            </div>
            <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center relative">
              {/* Stylized map placeholder with zones */}
              <div className="absolute inset-8 grid grid-cols-3 grid-rows-2 gap-3">
                {zones.map((zone) => (
                  <div
                    key={zone.id}
                    className={cn(
                      "rounded-xl flex flex-col items-center justify-center p-4 transition-all hover:scale-105 cursor-pointer",
                      zone.status === "healthy" ? "bg-success/20 border-2 border-success/40" :
                      zone.status === "moderate" ? "bg-warning/20 border-2 border-warning/40" :
                      "bg-critical/20 border-2 border-critical/40 animate-pulse"
                    )}
                  >
                    <Map className={cn(
                      "w-6 h-6 mb-2",
                      zone.status === "healthy" ? "text-success" :
                      zone.status === "moderate" ? "text-warning" : "text-critical"
                    )} />
                    <span className="text-sm font-medium text-center">{zone.name}</span>
                    {zone.emergencies > 0 && (
                      <span className={cn(
                        "mt-1 px-2 py-0.5 rounded-full text-xs font-bold",
                        zone.status === "overloaded" ? "bg-critical text-white" : "bg-warning text-white"
                      )}>
                        {zone.emergencies} alerts
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Zone Details */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h2 className="font-display text-lg font-semibold mb-4">Zone Details</h2>
            <div className="space-y-3">
              {zones.map((zone) => (
                <div 
                  key={zone.id}
                  className="p-3 rounded-xl border border-border hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-3 h-3 rounded-full",
                        statusColors[zone.status as keyof typeof statusColors]
                      )} />
                      <span className="font-medium">{zone.name}</span>
                    </div>
                    <StatusBadge 
                      status={zone.status === "healthy" ? "normal" : zone.status === "moderate" ? "warning" : "critical"}
                      size="sm"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center p-1 rounded bg-muted/50">
                      <div className="font-medium capitalize">{zone.opdPressure}</div>
                      <div className="text-muted-foreground">OPD</div>
                    </div>
                    <div className="text-center p-1 rounded bg-muted/50">
                      <div className="font-medium capitalize">{zone.bedShortage === "none" ? "OK" : zone.bedShortage}</div>
                      <div className="text-muted-foreground">Beds</div>
                    </div>
                    <div className="text-center p-1 rounded bg-muted/50">
                      <div className={cn(
                        "font-medium",
                        zone.emergencies > 3 ? "text-critical" : ""
                      )}>{zone.emergencies}</div>
                      <div className="text-muted-foreground">Alerts</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default CityHeatmap;
