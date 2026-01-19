
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/StatCard";
import { 
  GitBranch, 
  ArrowRight,
  TrendingUp,
  Users,
  Building2,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";

const flowData = [
  { from: "North District", to: "Central Hospital", patients: 45, trend: "up" },
  { from: "South District", to: "Metro Medical", patients: 32, trend: "stable" },
  { from: "East District", to: "Regional Hub", patients: 28, trend: "down" },
  { from: "West District", to: "City General", patients: 38, trend: "up" },
  { from: "Central District", to: "Central Hospital", patients: 67, trend: "up" },
];

const PatientFlow = () => {
  const totalPatients = flowData.reduce((acc, f) => acc + f.patients, 0);

  return (
    
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold mb-2">City-wide Patient Flow</h1>
            <p className="text-muted-foreground">Real-time patient movement tracking across the city</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Active Transfers"
            value={totalPatients}
            icon={GitBranch}
            variant="primary"
          />
          <StatCard
            title="Peak Flow Zone"
            value="Central"
            icon={TrendingUp}
            variant="warning"
          />
          <StatCard
            title="Hospitals Active"
            value={12}
            icon={Building2}
            variant="success"
          />
          <StatCard
            title="Avg Transit Time"
            value="18 min"
            icon={Activity}
            variant="accent"
          />
        </div>

        {/* Flow Diagram */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h2 className="font-display text-lg font-semibold mb-6">Patient Flow Streams</h2>
          <div className="space-y-4">
            {flowData.map((flow, index) => (
              <div 
                key={index}
                className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{flow.from}</div>
                      <div className="text-sm text-muted-foreground">Source District</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "px-4 py-2 rounded-full font-bold",
                    flow.trend === "up" ? "bg-critical/10 text-critical" :
                    flow.trend === "down" ? "bg-success/10 text-success" :
                    "bg-muted text-muted-foreground"
                  )}>
                    {flow.patients}
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 justify-end">
                    <div className="text-right">
                      <div className="font-medium">{flow.to}</div>
                      <div className="text-sm text-muted-foreground">Destination</div>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-accent" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    
  );
};

export default PatientFlow;
