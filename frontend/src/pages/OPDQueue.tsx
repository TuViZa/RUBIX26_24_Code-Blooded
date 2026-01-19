import React, { useState, useMemo } from "react";
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
  TrendingDown,
  UserCheck,
  Stethoscope
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Types & Initial Data ---
type Priority = "urgent" | "high" | "normal";
type Status = "waiting" | "in-consultation" | "checked-in" | "completed";

interface Patient {
  token: string;
  name: string;
  age: number;
  department: string;
  checkInTime: string;
  waitTime: number;
  priority: Priority;
  status: Status;
}

const initialQueue: Patient[] = [
  { token: "A-001", name: "Rajesh Kumar", age: 45, department: "Cardiology", checkInTime: "08:30 AM", waitTime: 45, priority: "high", status: "waiting" },
  { token: "A-002", name: "Sunita Devi", age: 62, department: "General Medicine", checkInTime: "08:35 AM", waitTime: 40, priority: "high", status: "waiting" },
  { token: "A-004", name: "Meera Patel", age: 28, department: "General Medicine", checkInTime: "08:48 AM", waitTime: 27, priority: "normal", status: "in-consultation" },
  { token: "A-005", name: "Arjun Reddy", age: 55, department: "Cardiology", checkInTime: "08:55 AM", waitTime: 20, priority: "urgent", status: "waiting" },
  { token: "A-008", name: "Anjali Gupta", age: 8, department: "Pediatrics", checkInTime: "09:15 AM", waitTime: 0, priority: "normal", status: "checked-in" },
];

const priorityConfig = {
  urgent: { label: "Urgent", color: "bg-critical/10 text-critical border-critical/20" },
  high: { label: "High", color: "bg-warning/10 text-warning border-warning/20" },
  normal: { label: "Normal", color: "bg-muted text-muted-foreground border-border" },
};

const OPDQueue = () => {
  const [queue, setQueue] = useState<Patient[]>(initialQueue);
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [searchQuery, setSearchQuery] = useState("");

  // --- Handlers ---

  const handleStatusChange = (token: string, newStatus: Status) => {
    setQueue(prev => prev.map(p => 
      p.token === token ? { ...p, status: newStatus } : p
    ));
  };

  const handleAddPatient = () => {
    const names = ["Suresh Rai", "Vikas Khanna", "Aditi Rao", "Pooja Shinde"];
    const depts = ["Cardiology", "General Medicine", "Pediatrics", "Neurology"];
    const priorities: Priority[] = ["normal", "high", "urgent"];
    
    const newPatient: Patient = {
      token: `A-0${queue.length + 10}`,
      name: names[Math.floor(Math.random() * names.length)],
      age: Math.floor(Math.random() * 50) + 10,
      department: depts[Math.floor(Math.random() * depts.length)],
      checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      waitTime: 0,
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      status: "checked-in"
    };
    
    setQueue([newPatient, ...queue]);
  };

  // --- Calculations ---

  const stats = useMemo(() => {
    const active = queue.filter(p => p.status !== "completed");
    return {
      total: active.length,
      priority: active.filter(p => p.priority === "urgent" || p.priority === "high").length,
      seenToday: queue.filter(p => p.status === "completed").length + 89, // Initial mock offset
      avgWait: Math.floor(active.reduce((acc, p) => acc + p.waitTime, 0) / (active.length || 1))
    };
  }, [queue]);

  const filteredQueue = useMemo(() => {
    return queue
      .filter(p => p.status !== "completed")
      .filter(p => {
        const matchesDept = selectedDept === "All Departments" || p.department === selectedDept;
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              p.token.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesDept && matchesSearch;
      })
      .sort((a, b) => {
        // Priority sorting logic
        const weight = { urgent: 0, high: 1, normal: 2 };
        return weight[a.priority] - weight[b.priority];
      });
  }, [queue, selectedDept, searchQuery]);

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold mb-2">OPD Queue Management</h1>
            <p className="text-muted-foreground font-medium">Real-time patient flow and prioritization</p>
          </div>
          <div className="flex items-center gap-3 mt-4 lg:mt-0">
            <Button variant="outline" size="sm" onClick={() => setQueue(initialQueue)}>
              <RotateCcw className="w-4 h-4 mr-2" /> Reset View
            </Button>
            <Button variant="hero" size="sm" onClick={handleAddPatient}>
              <Plus className="w-4 h-4 mr-2" /> Add Patient
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"><Users className="w-6 h-6 text-primary" /></div>
              <div><div className="text-2xl font-bold">{stats.total}</div><div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">In Queue</div></div>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center"><Clock className="w-6 h-6 text-warning" /></div>
              <div><div className="text-2xl font-bold">{stats.avgWait} min</div><div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Avg Wait</div></div>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-critical/10 flex items-center justify-center"><AlertCircle className="w-6 h-6 text-critical" /></div>
              <div><div className="text-2xl font-bold">{stats.priority}</div><div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Priority Cases</div></div>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center"><CheckCircle className="w-6 h-6 text-success" /></div>
              <div><div className="text-2xl font-bold">{stats.seenToday}</div><div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Seen Today</div></div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filters */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl border border-border p-4 space-y-2">
              <h3 className="font-bold text-sm uppercase text-muted-foreground mb-4 px-2">Departments</h3>
              {["All Departments", "General Medicine", "Cardiology", "Orthopedics", "Neurology", "Pediatrics"].map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={cn(
                    "w-full flex items-center justify-between p-3 rounded-xl text-sm font-medium transition-all",
                    selectedDept === dept ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" : "hover:bg-muted text-foreground"
                  )}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          {/* Queue List */}
          <div className="lg:col-span-3">
            <div className="flex gap-3 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by name or token..."
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-card text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3">
              {filteredQueue.map((patient) => (
                <div key={patient.token} className={cn(
                  "bg-card rounded-2xl border p-4 transition-all hover:shadow-md",
                  patient.status === "in-consultation" ? "border-primary/40 bg-primary/5 ring-1 ring-primary/10" : "border-border"
                )}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center font-display font-bold text-primary text-lg">
                        {patient.token}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg">{patient.name}</span>
                          <span className="text-sm text-muted-foreground">({patient.age}y)</span>
                        </div>
                        <div className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                          <Stethoscope className="w-3 h-3" /> {patient.department}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="text-right hidden md:block">
                        <div className="text-[10px] font-bold text-muted-foreground uppercase">Wait Time</div>
                        <div className={cn("font-bold", patient.waitTime > 30 ? "text-critical" : "text-success")}>
                          {patient.waitTime} min
                        </div>
                      </div>
                      
                      <div className={cn("px-3 py-1.5 rounded-full text-xs font-bold border", priorityConfig[patient.priority].color)}>
                        {priorityConfig[patient.priority].label}
                      </div>

                      <div className="flex items-center gap-2">
                        {patient.status === "in-consultation" ? (
                          <Button size="sm" className="bg-success hover:bg-success/90 text-white" onClick={() => handleStatusChange(patient.token, "completed")}>
                            <UserCheck className="w-4 h-4 mr-2" /> Complete
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" onClick={() => handleStatusChange(patient.token, "in-consultation")}>
                            Call Next
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {filteredQueue.length === 0 && (
                <div className="text-center py-20 bg-muted/20 rounded-3xl border border-dashed border-border">
                  <p className="text-muted-foreground font-medium">No active patients found in this department.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default OPDQueue;