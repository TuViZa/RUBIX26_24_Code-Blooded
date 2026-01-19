import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { 
  UserCheck, 
  ClipboardList,
  Bed,
  ArrowRight,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

const admissionSteps = [
  { id: 1, title: "Patient Registration", status: "completed" },
  { id: 2, title: "Medical Assessment", status: "current" },
  { id: 3, title: "Bed Assignment", status: "pending" },
  { id: 4, title: "Documentation", status: "pending" },
  { id: 5, title: "Admission Confirmation", status: "pending" },
];

const pendingAdmissions = [
  { id: "ADM-001", name: "Suresh Verma", age: 56, department: "Cardiology", priority: "high", waitTime: "45 min" },
  { id: "ADM-002", name: "Lakshmi Devi", age: 72, department: "General Medicine", priority: "urgent", waitTime: "20 min" },
  { id: "ADM-003", name: "Kiran Kumar", age: 34, department: "Orthopedics", priority: "normal", waitTime: "1h 30min" },
];

const bedSuggestions = [
  { id: "GW-15", department: "General Ward", floor: "2nd Floor", features: ["Oxygen", "Monitor"], match: 95 },
  { id: "GW-22", department: "General Ward", floor: "2nd Floor", features: ["Oxygen"], match: 88 },
  { id: "CAR-05", department: "Cardiology", floor: "4th Floor", features: ["Oxygen", "Monitor", "ICU Access"], match: 82 },
];

const Admission = () => {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold mb-2">Admission Workflow</h1>
            <p className="text-muted-foreground">Rule-based patient intake and bed assignment</p>
          </div>
          <div className="flex items-center gap-3 mt-4 lg:mt-0">
            <Button variant="hero" size="sm">
              <UserCheck className="w-4 h-4 mr-2" />
              Start New Admission
            </Button>
          </div>
        </div>

        {/* Workflow Progress */}
        <div className="bg-card rounded-2xl border border-border p-6 mb-8">
          <h2 className="font-display text-lg font-semibold mb-6">Active Admission Progress</h2>
          <div className="flex items-center justify-between">
            {admissionSteps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium",
                    step.status === "completed" ? "bg-success text-white" :
                    step.status === "current" ? "bg-primary text-white" :
                    "bg-muted text-muted-foreground"
                  )}>
                    {step.status === "completed" ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <span className={cn(
                    "text-xs mt-2 text-center max-w-[100px]",
                    step.status === "current" ? "text-primary font-medium" : "text-muted-foreground"
                  )}>
                    {step.title}
                  </span>
                </div>
                {index < admissionSteps.length - 1 && (
                  <div className={cn(
                    "w-16 h-0.5 mx-2",
                    step.status === "completed" ? "bg-success" : "bg-muted"
                  )} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Pending Admissions */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-lg font-semibold">Pending Admissions</h2>
              <StatusBadge status="warning" label={`${pendingAdmissions.length} Waiting`} size="sm" />
            </div>
            <div className="space-y-3">
              {pendingAdmissions.map((admission) => (
                <div 
                  key={admission.id}
                  className="p-4 rounded-xl border border-border hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-medium">{admission.name}</span>
                      <span className="text-sm text-muted-foreground ml-2">({admission.age} yrs)</span>
                    </div>
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-medium",
                      admission.priority === "urgent" ? "bg-critical/10 text-critical" :
                      admission.priority === "high" ? "bg-warning/10 text-warning" :
                      "bg-muted text-muted-foreground"
                    )}>
                      {admission.priority.charAt(0).toUpperCase() + admission.priority.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{admission.department}</span>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{admission.waitTime}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-3">
                    Process Admission
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Bed Suggestions */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-lg font-semibold">Recommended Beds</h2>
              <Button variant="ghost" size="sm">
                <Search className="w-4 h-4 mr-2" />
                Search All
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Based on patient requirements and current availability
            </p>
            <div className="space-y-3">
              {bedSuggestions.map((bed, index) => (
                <div 
                  key={bed.id}
                  className={cn(
                    "p-4 rounded-xl border transition-all",
                    index === 0 ? "border-success/30 bg-success/5" : "border-border"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Bed className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <span className="font-mono font-medium">{bed.id}</span>
                        <p className="text-xs text-muted-foreground">{bed.department} • {bed.floor}</p>
                      </div>
                    </div>
                    <div className={cn(
                      "px-2 py-1 rounded-lg text-xs font-bold",
                      bed.match >= 90 ? "bg-success/10 text-success" :
                      bed.match >= 80 ? "bg-primary/10 text-primary" :
                      "bg-muted text-muted-foreground"
                    )}>
                      {bed.match}% Match
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {bed.features.map((feature) => (
                      <span 
                        key={feature}
                        className="px-2 py-0.5 bg-muted rounded text-xs"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  <Button 
                    variant={index === 0 ? "success" : "outline"} 
                    size="sm" 
                    className="w-full mt-3"
                  >
                    {index === 0 ? "Assign This Bed" : "Select Bed"}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Admission;
