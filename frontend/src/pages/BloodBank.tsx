
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { StatCard } from "@/components/dashboard/StatCard";
import { 
  Droplets, 
  Plus, 
  Share2, 
  AlertTriangle,
  Users,
  Building2,
  ArrowRightLeft
} from "lucide-react";
import { cn } from "@/lib/utils";

const bloodTypes = [
  { type: "A+", units: 45, demand: 38, status: "normal" },
  { type: "A-", units: 12, demand: 15, status: "warning" },
  { type: "B+", units: 38, demand: 32, status: "normal" },
  { type: "B-", units: 8, demand: 12, status: "critical" },
  { type: "AB+", units: 22, demand: 18, status: "normal" },
  { type: "AB-", units: 5, demand: 6, status: "warning" },
  { type: "O+", units: 52, demand: 55, status: "warning" },
  { type: "O-", units: 15, demand: 25, status: "critical" },
];

const recentDonations = [
  { id: "D-001", donor: "Anil Mehta", bloodType: "O+", units: 1, date: "Today, 10:30 AM", status: "processed" },
  { id: "D-002", donor: "Priya Sharma", bloodType: "A+", units: 1, date: "Today, 09:15 AM", status: "testing" },
  { id: "D-003", donor: "Rahul Singh", bloodType: "B+", units: 1, date: "Yesterday", status: "processed" },
  { id: "D-004", donor: "Kavitha Nair", bloodType: "AB+", units: 1, date: "Yesterday", status: "processed" },
];

const nearbyHospitals = [
  { name: "City General Hospital", distance: "2.5 km", bloodTypes: ["O-", "B-"], units: 8, status: "available" },
  { name: "Metro Medical Center", distance: "4.2 km", bloodTypes: ["A-", "O-"], units: 12, status: "available" },
  { name: "Regional Health Hub", distance: "6.8 km", bloodTypes: ["B-", "AB-"], units: 5, status: "limited" },
];

const BloodBank = () => {
  const totalUnits = bloodTypes.reduce((acc, bt) => acc + bt.units, 0);
  const criticalTypes = bloodTypes.filter(bt => bt.status === "critical").length;

  return (
    
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold mb-2">Blood Bank Management</h1>
            <p className="text-muted-foreground">Inventory tracking and inter-hospital sharing</p>
          </div>
          <div className="flex items-center gap-3 mt-4 lg:mt-0">
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Request from Network
            </Button>
            <Button variant="hero" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Donation
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Units"
            value={totalUnits}
            icon={Droplets}
            variant="primary"
          />
          <StatCard
            title="Donations Today"
            value={12}
            icon={Users}
            variant="success"
            trend={{ value: 20, isPositive: true }}
          />
          <StatCard
            title="Critical Types"
            value={criticalTypes}
            subtitle="B-, O- running low"
            icon={AlertTriangle}
            variant="critical"
          />
          <StatCard
            title="Network Hospitals"
            value={15}
            subtitle="Connected for sharing"
            icon={Building2}
            variant="accent"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Blood Inventory */}
          <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-6">
            <h2 className="font-display text-lg font-semibold mb-6">Blood Inventory</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {bloodTypes.map((bt) => (
                <div
                  key={bt.type}
                  className={cn(
                    "p-4 rounded-xl border transition-all hover:shadow-medium",
                    bt.status === "critical" ? "bg-critical/5 border-critical/20" :
                    bt.status === "warning" ? "bg-warning/5 border-warning/20" :
                    "bg-card border-border"
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center font-display font-bold",
                      bt.status === "critical" ? "bg-critical/10 text-critical" :
                      bt.status === "warning" ? "bg-warning/10 text-warning" :
                      "bg-primary/10 text-primary"
                    )}>
                      {bt.type}
                    </div>
                    <StatusBadge 
                      status={bt.status as any} 
                      size="sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Available</span>
                      <span className="font-medium">{bt.units} units</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Weekly Demand</span>
                      <span className="font-medium">{bt.demand} units</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full",
                          bt.status === "critical" ? "bg-critical" :
                          bt.status === "warning" ? "bg-warning" : "bg-success"
                        )}
                        style={{ width: `${Math.min((bt.units / bt.demand) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Donations */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h2 className="font-display text-lg font-semibold mb-4">Recent Donations</h2>
            <div className="space-y-3">
              {recentDonations.map((donation) => (
                <div 
                  key={donation.id}
                  className="p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{donation.donor}</span>
                    <span className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold",
                      "bg-critical/10 text-critical"
                    )}>
                      {donation.bloodType}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{donation.date}</span>
                    <StatusBadge 
                      status={donation.status === "processed" ? "available" : "reserved"}
                      label={donation.status === "processed" ? "Processed" : "Testing"}
                      size="sm"
                    />
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4">
              View All Donations
            </Button>
          </div>
        </div>

        {/* Network Sharing */}
        <div className="mt-6 bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-lg font-semibold">Inter-Hospital Network</h2>
              <p className="text-sm text-muted-foreground">Available blood units from nearby hospitals</p>
            </div>
            <Button variant="outline" size="sm">
              <ArrowRightLeft className="w-4 h-4 mr-2" />
              View All Hospitals
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {nearbyHospitals.map((hospital) => (
              <div 
                key={hospital.name}
                className="p-4 rounded-xl border border-border hover:border-primary/30 hover:shadow-medium transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium">{hospital.name}</h4>
                    <p className="text-sm text-muted-foreground">{hospital.distance} away</p>
                  </div>
                  <StatusBadge 
                    status={hospital.status === "available" ? "available" : "warning"}
                    label={hospital.status === "available" ? "Available" : "Limited"}
                    size="sm"
                  />
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm text-muted-foreground">Types:</span>
                  {hospital.bloodTypes.map((bt) => (
                    <span 
                      key={bt}
                      className="px-2 py-0.5 rounded bg-critical/10 text-critical text-xs font-medium"
                    >
                      {bt}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">
                    <span className="font-medium">{hospital.units}</span>
                    <span className="text-muted-foreground"> units available</span>
                  </span>
                  <Button variant="outline" size="sm">Request</Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Alert */}
        <div className="mt-6 p-6 rounded-2xl bg-critical/5 border border-critical/20">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-critical/10 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6 text-critical" />
            </div>
            <div className="flex-1">
              <h3 className="font-display font-semibold text-critical mb-1">Critical Blood Shortage Alert</h3>
              <p className="text-sm text-muted-foreground mb-4">
                O- and B- blood types are critically low. Consider organizing an emergency blood donation drive 
                or requesting from the inter-hospital network.
              </p>
              <div className="flex gap-3">
                <Button variant="accent" size="sm">
                  Organize Blood Drive
                </Button>
                <Button variant="outline" size="sm">
                  Send Network Alert
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    
  );
};

export default BloodBank;
