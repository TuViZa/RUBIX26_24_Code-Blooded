
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { 
  Building2, 
  Share2, 
  Wifi,
  ArrowRightLeft,
  TrendingUp,
  Users,
  Bed,
  MapPin
} from "lucide-react";
import { cn } from "@/lib/utils";

const connectedHospitals = [
  { 
    name: "City General Hospital", 
    distance: "2.5 km",
    status: "online",
    beds: { available: 12, total: 150 },
    queue: 45,
    lastSync: "2 min ago"
  },
  { 
    name: "Metro Medical Center", 
    distance: "4.2 km",
    status: "online",
    beds: { available: 28, total: 200 },
    queue: 32,
    lastSync: "1 min ago"
  },
  { 
    name: "Regional Health Hub", 
    distance: "6.8 km",
    status: "online",
    beds: { available: 5, total: 80 },
    queue: 67,
    lastSync: "5 min ago"
  },
  { 
    name: "Central District Hospital", 
    distance: "8.1 km",
    status: "offline",
    beds: { available: 0, total: 120 },
    queue: 0,
    lastSync: "15 min ago"
  },
];

const recentTransfers = [
  { id: "TRF-001", patient: "Anonymous", from: "Metro Medical", to: "Our Hospital", type: "ICU", status: "in-transit" },
  { id: "TRF-002", patient: "Anonymous", from: "Our Hospital", to: "City General", type: "General", status: "completed" },
  { id: "TRF-003", patient: "Anonymous", from: "Regional Hub", to: "Our Hospital", type: "Emergency", status: "pending" },
];

const HospitalNetwork = () => {
  const totalConnected = connectedHospitals.filter(h => h.status === "online").length;
  const totalBeds = connectedHospitals.reduce((acc, h) => acc + h.beds.available, 0);

  return (
    
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold mb-2">Inter-Hospital Network</h1>
            <p className="text-muted-foreground">City-wide capacity sharing and patient coordination</p>
          </div>
          <div className="flex items-center gap-3 mt-4 lg:mt-0">
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Broadcast Capacity
            </Button>
            <Button variant="hero" size="sm">
              <ArrowRightLeft className="w-4 h-4 mr-2" />
              Request Transfer
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Connected Hospitals"
            value={totalConnected}
            subtitle={`${connectedHospitals.length} in network`}
            icon={Building2}
            variant="primary"
          />
          <StatCard
            title="Network Beds Available"
            value={totalBeds}
            icon={Bed}
            variant="success"
          />
          <StatCard
            title="Active Transfers"
            value={2}
            icon={ArrowRightLeft}
            variant="accent"
          />
          <StatCard
            title="Data Sync Status"
            value="Live"
            subtitle="Real-time updates"
            icon={Wifi}
            variant="default"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Connected Hospitals */}
          <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-lg font-semibold">Network Hospitals</h2>
              <Button variant="ghost" size="sm">View Map</Button>
            </div>
            
            <div className="space-y-4">
              {connectedHospitals.map((hospital) => (
                <div 
                  key={hospital.name}
                  className={cn(
                    "p-4 rounded-xl border transition-all",
                    hospital.status === "online" 
                      ? "border-border hover:border-primary/30" 
                      : "border-border/50 opacity-60"
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center",
                        hospital.status === "online" ? "bg-primary/10" : "bg-muted"
                      )}>
                        <Building2 className={cn(
                          "w-5 h-5",
                          hospital.status === "online" ? "text-primary" : "text-muted-foreground"
                        )} />
                      </div>
                      <div>
                        <h3 className="font-medium">{hospital.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          <span>{hospital.distance}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        hospital.status === "online" ? "bg-success animate-pulse" : "bg-muted-foreground"
                      )} />
                      <span className="text-xs text-muted-foreground capitalize">{hospital.status}</span>
                    </div>
                  </div>
                  
                  {hospital.status === "online" && (
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-2 rounded-lg bg-muted/50">
                        <div className="text-lg font-bold text-success">{hospital.beds.available}</div>
                        <div className="text-xs text-muted-foreground">Beds Free</div>
                      </div>
                      <div className="p-2 rounded-lg bg-muted/50">
                        <div className="text-lg font-bold">{hospital.queue}</div>
                        <div className="text-xs text-muted-foreground">OPD Queue</div>
                      </div>
                      <div className="p-2 rounded-lg bg-muted/50">
                        <div className="text-lg font-bold text-muted-foreground">{hospital.lastSync}</div>
                        <div className="text-xs text-muted-foreground">Last Sync</div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Transfers */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h2 className="font-display text-lg font-semibold mb-4">Recent Transfers</h2>
            <div className="space-y-3">
              {recentTransfers.map((transfer) => (
                <div 
                  key={transfer.id}
                  className="p-3 rounded-xl bg-muted/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-sm">{transfer.id}</span>
                    <StatusBadge 
                      status={
                        transfer.status === "completed" ? "available" :
                        transfer.status === "in-transit" ? "warning" : "reserved"
                      }
                      label={transfer.status.replace("-", " ")}
                      size="sm"
                    />
                  </div>
                  <div className="text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span>{transfer.from}</span>
                      <ArrowRightLeft className="w-3 h-3" />
                      <span>{transfer.to}</span>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary mt-1 inline-block">
                      {transfer.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4">
              View All Transfers
            </Button>
          </div>
        </div>
      </div>
    
  );
};

export default HospitalNetwork;
