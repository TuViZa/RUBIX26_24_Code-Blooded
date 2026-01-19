
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/StatCard";
import { 
  Lightbulb, 
  Play,
  CheckCircle,
  Clock,
  TrendingUp,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

const interventions = [
  { 
    id: 1, 
    title: "Redirect OPD overflow to General Ward 2",
    type: "Queue Management",
    impact: "high",
    effort: "low",
    status: "suggested",
    description: "Current OPD queue exceeds capacity. Redirect low-priority cases to reduce wait time by ~20 min."
  },
  { 
    id: 2, 
    title: "Activate standby beds in Emergency",
    type: "Bed Management",
    impact: "critical",
    effort: "medium",
    status: "pending",
    description: "Emergency bed occupancy at 95%. Activating 4 standby beds will provide buffer for incoming cases."
  },
  { 
    id: 3, 
    title: "Request blood from City General",
    type: "Resource Sharing",
    impact: "medium",
    effort: "low",
    status: "completed",
    description: "O- blood type critically low. Request fulfilled from network hospital."
  },
  { 
    id: 4, 
    title: "Delay non-urgent admissions by 2 hours",
    type: "Admission Control",
    impact: "medium",
    effort: "low",
    status: "suggested",
    description: "Peak admission hours detected. Delaying non-urgent cases will optimize bed turnover."
  },
];

const Interventions = () => {
  const suggested = interventions.filter(i => i.status === "suggested").length;
  const completed = interventions.filter(i => i.status === "completed").length;

  return (
    
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold mb-2">Micro-Intervention Recommendations</h1>
            <p className="text-muted-foreground">AI-powered suggestions for operational optimization</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Active Suggestions"
            value={suggested}
            icon={Lightbulb}
            variant="primary"
          />
          <StatCard
            title="Pending Action"
            value={1}
            icon={Clock}
            variant="warning"
          />
          <StatCard
            title="Completed Today"
            value={completed}
            icon={CheckCircle}
            variant="success"
          />
          <StatCard
            title="Impact Score"
            value="+15%"
            subtitle="Efficiency gain"
            icon={TrendingUp}
            variant="accent"
          />
        </div>

        {/* Interventions List */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h2 className="font-display text-lg font-semibold mb-6">Recommended Actions</h2>
          <div className="space-y-4">
            {interventions.map((intervention) => (
              <div 
                key={intervention.id}
                className={cn(
                  "p-4 rounded-xl border transition-all",
                  intervention.status === "completed" ? "border-success/30 bg-success/5" :
                  intervention.status === "pending" ? "border-warning/30 bg-warning/5" :
                  "border-border hover:border-primary/30"
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                      intervention.impact === "critical" ? "bg-critical/10" :
                      intervention.impact === "high" ? "bg-warning/10" :
                      "bg-primary/10"
                    )}>
                      <Lightbulb className={cn(
                        "w-5 h-5",
                        intervention.impact === "critical" ? "text-critical" :
                        intervention.impact === "high" ? "text-warning" :
                        "text-primary"
                      )} />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">{intervention.title}</h3>
                      <p className="text-sm text-muted-foreground">{intervention.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded-full bg-muted text-xs">
                      {intervention.type}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-4 text-xs">
                    <span className={cn(
                      "px-2 py-1 rounded",
                      intervention.impact === "critical" ? "bg-critical/10 text-critical" :
                      intervention.impact === "high" ? "bg-warning/10 text-warning" :
                      "bg-primary/10 text-primary"
                    )}>
                      {intervention.impact.toUpperCase()} Impact
                    </span>
                    <span className="text-muted-foreground">
                      {intervention.effort.charAt(0).toUpperCase() + intervention.effort.slice(1)} Effort
                    </span>
                  </div>
                  {intervention.status === "suggested" ? (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Dismiss</Button>
                      <Button variant="hero" size="sm">
                        <Play className="w-4 h-4 mr-1" />
                        Apply
                      </Button>
                    </div>
                  ) : intervention.status === "pending" ? (
                    <Button variant="warning" size="sm">
                      <Clock className="w-4 h-4 mr-1" />
                      In Progress
                    </Button>
                  ) : (
                    <Button variant="success" size="sm" disabled>
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Completed
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    
  );
};

export default Interventions;
