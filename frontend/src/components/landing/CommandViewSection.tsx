import { LayoutDashboard, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const CommandViewSection = () => {
  return (
    <section className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <LayoutDashboard className="w-4 h-4" />
              Operational Command View
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
              Real-Time Insights at Your Fingertips
            </h2>
            <p className="text-muted-foreground mb-8">
              A comprehensive dashboard summarizing key metrics including OPD load, bed occupancy, 
              admissions, and inventory status for rapid administrative decision-making.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-4 h-4 text-success" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Live Status Updates</h4>
                  <p className="text-sm text-muted-foreground">Real-time synchronization across all departments</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4 text-warning" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Smart Alerts</h4>
                  <p className="text-sm text-muted-foreground">Automated notifications for critical thresholds</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Trend Analysis</h4>
                  <p className="text-sm text-muted-foreground">Historical data patterns for predictive insights</p>
                </div>
              </div>
            </div>

            <Link to="/dashboard">
              <Button variant="hero" size="lg">
                View Command Dashboard
              </Button>
            </Link>
          </div>

          {/* Dashboard Preview */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-3xl opacity-30" />
            <div className="relative bg-card rounded-2xl border border-border shadow-large overflow-hidden">
              {/* Mock Dashboard Header */}
              <div className="p-4 border-b border-border bg-muted/30">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-critical" />
                  <div className="w-3 h-3 rounded-full bg-warning" />
                  <div className="w-3 h-3 rounded-full bg-success" />
                  <span className="ml-4 text-sm font-medium">Command Center</span>
                </div>
              </div>
              {/* Mock Dashboard Content */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-muted/50">
                    <div className="text-2xl font-bold text-primary">127</div>
                    <div className="text-xs text-muted-foreground">OPD Patients</div>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/50">
                    <div className="text-2xl font-bold text-accent">84%</div>
                    <div className="text-xs text-muted-foreground">Bed Occupancy</div>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/50">
                    <div className="text-2xl font-bold text-success">23</div>
                    <div className="text-xs text-muted-foreground">Admissions Today</div>
                  </div>
                </div>
                <div className="h-32 rounded-xl bg-muted/50 flex items-end justify-between p-4 gap-2">
                  {[40, 65, 45, 80, 55, 70, 60, 75, 50, 85, 65, 45].map((height, i) => (
                    <div 
                      key={i} 
                      className="w-full bg-primary/60 rounded-t"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 p-3 rounded-xl bg-success/10 border border-success/20">
                    <div className="text-xs font-medium text-success">Normal Operations</div>
                  </div>
                  <div className="flex-1 p-3 rounded-xl bg-warning/10 border border-warning/20">
                    <div className="text-xs font-medium text-warning">3 Low Stock Alerts</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
