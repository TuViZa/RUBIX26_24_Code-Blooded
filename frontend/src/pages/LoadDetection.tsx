import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { 
  AlertTriangle, 
  TrendingUp,
  Clock,
  Activity,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";

const predictions = [
  { time: "Next 1 hour", opdLoad: "High", bedPressure: "Moderate", confidence: 92 },
  { time: "Next 2 hours", opdLoad: "Critical", bedPressure: "High", confidence: 85 },
  { time: "Next 4 hours", opdLoad: "Moderate", bedPressure: "High", confidence: 78 },
  { time: "Next 8 hours", opdLoad: "Normal", bedPressure: "Moderate", confidence: 65 },
];

const LoadDetection = () => {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold mb-2">Early Load Detection</h1>
            <p className="text-muted-foreground">Predictive analytics for operational load forecasting</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Current Load"
            value="78%"
            icon={Activity}
            variant="warning"
          />
          <StatCard
            title="Predicted Peak"
            value="2 hrs"
            subtitle="Expected surge"
            icon={TrendingUp}
            variant="critical"
          />
          <StatCard
            title="Confidence Score"
            value="92%"
            icon={BarChart3}
            variant="primary"
          />
          <StatCard
            title="Last Updated"
            value="Just now"
            icon={Clock}
            variant="default"
          />
        </div>

        {/* Predictions */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h2 className="font-display text-lg font-semibold mb-6">Load Predictions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {predictions.map((pred, index) => (
              <div 
                key={index}
                className={cn(
                  "p-4 rounded-xl border",
                  index === 1 ? "border-critical/30 bg-critical/5" : "border-border"
                )}
              >
                <div className="text-sm text-muted-foreground mb-2">{pred.time}</div>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-muted-foreground">OPD Load</div>
                    <div className={cn(
                      "font-bold",
                      pred.opdLoad === "Critical" ? "text-critical" :
                      pred.opdLoad === "High" ? "text-warning" :
                      "text-success"
                    )}>
                      {pred.opdLoad}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Bed Pressure</div>
                    <div className={cn(
                      "font-bold",
                      pred.bedPressure === "High" ? "text-critical" :
                      pred.bedPressure === "Moderate" ? "text-warning" :
                      "text-success"
                    )}>
                      {pred.bedPressure}
                    </div>
                  </div>
                  <div className="pt-2 border-t border-border">
                    <div className="text-xs text-muted-foreground">Confidence</div>
                    <div className="font-bold text-primary">{pred.confidence}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default LoadDetection;
