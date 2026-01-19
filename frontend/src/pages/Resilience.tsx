
import { StatCard } from "@/components/dashboard/StatCard";
import { 
  Shield, 
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

const resilienceMetrics = [
  { name: "Bed Surge Capacity", score: 72, status: "moderate" },
  { name: "Staff Availability", score: 85, status: "good" },
  { name: "Supply Chain Resilience", score: 68, status: "moderate" },
  { name: "Emergency Response Time", score: 91, status: "excellent" },
  { name: "Inter-Hospital Coordination", score: 78, status: "good" },
  { name: "Data System Uptime", score: 99, status: "excellent" },
];

const Resilience = () => {
  const overallScore = Math.round(resilienceMetrics.reduce((acc, m) => acc + m.score, 0) / resilienceMetrics.length);

  return (
    
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold mb-2">City Resilience Index</h1>
            <p className="text-muted-foreground">Healthcare system resilience assessment</p>
          </div>
        </div>

        {/* Overall Score */}
        <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl border border-primary/20 p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg text-muted-foreground mb-2">Overall Resilience Score</h2>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-6xl font-bold text-primary">{overallScore}</span>
                <span className="text-2xl text-muted-foreground">/100</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Good - System is operating within acceptable parameters</p>
            </div>
            <div className="w-32 h-32 rounded-full border-8 border-primary/20 flex items-center justify-center">
              <Shield className="w-16 h-16 text-primary" />
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resilienceMetrics.map((metric) => (
            <div 
              key={metric.name}
              className="bg-card rounded-xl border border-border p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium">{metric.name}</span>
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-xs font-medium capitalize",
                  metric.status === "excellent" ? "bg-success/10 text-success" :
                  metric.status === "good" ? "bg-primary/10 text-primary" :
                  "bg-warning/10 text-warning"
                )}>
                  {metric.status}
                </span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold">{metric.score}</span>
                <span className="text-muted-foreground mb-1">/100</span>
              </div>
              <div className="h-2 bg-muted rounded-full mt-3 overflow-hidden">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all",
                    metric.score >= 90 ? "bg-success" :
                    metric.score >= 75 ? "bg-primary" :
                    "bg-warning"
                  )}
                  style={{ width: `${metric.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    
  );
};

export default Resilience;
