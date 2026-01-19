import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { 
  Users, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  RotateCcw,
  Search,
  Filter,
  Plus,
  TrendingDown
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const departments = [
  { id: "all", name: "All Departments", count: 127 },
  { id: "general", name: "General Medicine", count: 45 },
  { id: "cardio", name: "Cardiology", count: 23 },
  { id: "ortho", name: "Orthopedics", count: 18 },
  { id: "neuro", name: "Neurology", count: 15 },
  { id: "pedia", name: "Pediatrics", count: 26 },
];

const queueData = [
  { token: "A-001", name: "Rajesh Kumar", age: 45, department: "Cardiology", checkInTime: "08:30 AM", waitTime: 45, priority: "high", status: "waiting" },
  { token: "A-002", name: "Sunita Devi", age: 62, department: "General Medicine", checkInTime: "08:35 AM", waitTime: 40, priority: "high", status: "waiting" },
  { token: "A-003", name: "Vikram Singh", age: 34, department: "Orthopedics", checkInTime: "08:42 AM", waitTime: 33, priority: "normal", status: "waiting" },
  { token: "A-004", name: "Meera Patel", age: 28, department: "General Medicine", checkInTime: "08:48 AM", waitTime: 27, priority: "normal", status: "in-consultation" },
  { token: "A-005", name: "Arjun Reddy", age: 55, department: "Cardiology", checkInTime: "08:55 AM", waitTime: 20, priority: "urgent", status: "waiting" },
  { token: "A-006", name: "Kavitha Nair", age: 41, department: "Neurology", checkInTime: "09:02 AM", waitTime: 13, priority: "normal", status: "waiting" },
  { token: "A-007", name: "Deepak Sharma", age: 67, department: "General Medicine", checkInTime: "09:10 AM", waitTime: 5, priority: "high", status: "waiting" },
  { token: "A-008", name: "Anjali Gupta", age: 8, department: "Pediatrics", checkInTime: "09:15 AM", waitTime: 0, priority: "normal", status: "checked-in" },
];

const priorityConfig = {
  urgent: { label: "Urgent", color: "bg-critical/10 text-critical border-critical/20" },
  high: { label: "High", color: "bg-warning/10 text-warning border-warning/20" },
  normal: { label: "Normal", color: "bg-muted text-muted-foreground border-border" },
};

const OPDQueue = () => {
  const [selectedDept, setSelectedDept] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredQueue = queueData.filter(patient => {
    const matchesDept = selectedDept === "all" || patient.department.toLowerCase().includes(selectedDept);
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          patient.token.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold mb-2">OPD Queue Management</h1>
            <p className="text-muted-foreground">Real-time patient queue prioritization and tracking</p>
          </div>
          <div className="flex items-center gap-3 mt-4 lg:mt-0">
            <Button variant="outline" size="sm">
              <RotateCcw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="hero" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Patient
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">127</div>
                <div className="text-xs text-muted-foreground">Total in Queue</div>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-warning" />
              </div>
              <div>
                <div className="text-2xl font-bold">24 min</div>
                <div className="text-xs text-muted-foreground">Avg. Wait Time</div>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-critical/10 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-critical" />
              </div>
              <div>
                <div className="text-2xl font-bold">8</div>
                <div className="text-xs text-muted-foreground">Priority Cases</div>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-success" />
              </div>
              <div>
                <div className="text-2xl font-bold">89</div>
                <div className="text-xs text-muted-foreground">Seen Today</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Department Filter */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl border border-border p-4 sticky top-24">
              <h3 className="font-semibold mb-4">Departments</h3>
              <div className="space-y-2">
                {departments.map((dept) => (
                  <button
                    key={dept.id}
                    onClick={() => setSelectedDept(dept.id)}
                    className={cn(
                      "w-full flex items-center justify-between p-3 rounded-xl text-sm transition-colors",
                      selectedDept === dept.id 
                        ? "bg-primary/10 text-primary border border-primary/20" 
                        : "hover:bg-muted"
                    )}
                  >
                    <span>{dept.name}</span>
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-medium",
                      selectedDept === dept.id ? "bg-primary text-primary-foreground" : "bg-muted"
                    )}>
                      {dept.count}
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-xl bg-success/5 border border-success/20">
                <div className="flex items-center gap-2 text-success mb-2">
                  <TrendingDown className="w-4 h-4" />
                  <span className="text-sm font-medium">Wait Time Reduced</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Average wait time has decreased by 15% compared to last week.
                </p>
              </div>
            </div>
          </div>

          {/* Queue List */}
          <div className="lg:col-span-3">
            {/* Search and Filter */}
            <div className="flex gap-3 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by name or token..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>

            {/* Queue Cards */}
            <div className="space-y-3">
              {filteredQueue.map((patient, index) => (
                <div 
                  key={patient.token}
                  className={cn(
                    "bg-card rounded-xl border p-4 transition-all hover:shadow-medium animate-slide-up",
                    patient.status === "in-consultation" ? "border-primary/30 bg-primary/5" : "border-border"
                  )}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                          <span className="font-display font-bold text-primary">{patient.token}</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{patient.name}</span>
                          <span className="text-sm text-muted-foreground">({patient.age} yrs)</span>
                        </div>
                        <div className="text-sm text-muted-foreground">{patient.department}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right hidden md:block">
                        <div className="text-sm text-muted-foreground">Check-in</div>
                        <div className="font-medium">{patient.checkInTime}</div>
                      </div>
                      <div className="text-right hidden md:block">
                        <div className="text-sm text-muted-foreground">Wait Time</div>
                        <div className={cn(
                          "font-medium",
                          patient.waitTime > 30 ? "text-critical" : 
                          patient.waitTime > 15 ? "text-warning" : "text-success"
                        )}>
                          {patient.waitTime} min
                        </div>
                      </div>
                      <div className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-medium border",
                        priorityConfig[patient.priority as keyof typeof priorityConfig].color
                      )}>
                        {priorityConfig[patient.priority as keyof typeof priorityConfig].label}
                      </div>
                      {patient.status === "in-consultation" ? (
                        <StatusBadge status="warning" label="In Consultation" size="sm" />
                      ) : patient.status === "checked-in" ? (
                        <StatusBadge status="available" label="Just Arrived" size="sm" />
                      ) : (
                        <Button variant="outline" size="sm">Call Next</Button>
                      )}
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

export default OPDQueue;
