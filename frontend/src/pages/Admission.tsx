import React, { useState, useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { 
  UserCheck, 
  Bed,
  ArrowRight,
  Search,
  CheckCircle2,
  Clock,
  User,
  ShieldCheck,
  FileText,
  X,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Types ---
interface Patient {
  id: string;
  name: string;
  age: number;
  department: string;
  priority: "urgent" | "high" | "normal";
  waitTime: string;
}

const Admission = () => {
  // 1. Core State
  const [currentStep, setCurrentStep] = useState(1);
  const [activePatient, setActivePatient] = useState<Patient | null>(null);
  const [assignedBed, setAssignedBed] = useState<string | null>(null);
  
  // 2. Queue Management
  const [pendingPatients] = useState<Patient[]>([
    { id: "ADM-001", name: "Suresh Verma", age: 56, department: "Cardiology", priority: "high", waitTime: "45 min" },
    { id: "ADM-002", name: "Lakshmi Devi", age: 72, department: "General Medicine", priority: "urgent", waitTime: "20 min" },
    { id: "ADM-003", name: "Kiran Kumar", age: 34, department: "Orthopedics", priority: "normal", waitTime: "1h 30min" },
  ]);

  const bedSuggestions = [
    { id: "GW-15", department: "General Ward", floor: "2nd Floor", features: ["Oxygen", "Monitor"], match: 95 },
    { id: "CAR-05", department: "Cardiology", floor: "4th Floor", features: ["Oxygen", "Monitor", "ICU Access"], match: 82 },
  ];

  const admissionSteps = [
    { id: 1, title: "Registration", icon: User },
    { id: 2, title: "Assessment", icon: ShieldCheck },
    { id: 3, title: "Bed Assignment", icon: Bed },
    { id: 4, title: "Documentation", icon: FileText },
    { id: 5, title: "Confirmation", icon: CheckCircle2 },
  ];

  // --- Functional Handlers ---

  // Standard Admission Path
  const handleProcessPatient = (patient: Patient) => {
    setActivePatient(patient);
    setAssignedBed(null);
    setCurrentStep(3); // Jump to Bed Assignment for queue patients
  };

  // Direct Admission Path (Emergency/New Case)
  const handleDirectAdmission = () => {
    const directPatient: Patient = {
      id: `DIR-${Math.floor(100 + Math.random() * 900)}`,
      name: "Emergency Entry",
      age: 0,
      department: "Emergency",
      priority: "urgent",
      waitTime: "0 min"
    };
    setActivePatient(directPatient);
    setAssignedBed(null);
    setCurrentStep(3); // Move immediately to Bed Assignment
  };

  const handleAssignBed = (bedId: string) => {
    setAssignedBed(bedId);
    setCurrentStep(4); // Advance to Documentation
  };

  const resetWorkflow = () => {
    setActivePatient(null);
    setAssignedBed(null);
    setCurrentStep(1);
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header with Direct Admission Trigger */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold mb-2 text-foreground">Admission Operations</h1>
            <p className="text-muted-foreground">Manage hospital intake and real-time bed allocation</p>
          </div>
          <div className="flex items-center gap-3 mt-4 lg:mt-0">
            <Button variant="outline" size="sm" onClick={resetWorkflow}>
              <X className="w-4 h-4 mr-2" /> Cancel
            </Button>
            <Button variant="hero" size="sm" onClick={handleDirectAdmission}>
              <Zap className="w-4 h-4 mr-2 text-yellow-400" />
              Direct Admission
            </Button>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="bg-card rounded-2xl border border-border p-6 mb-8 shadow-sm">
          <div className="flex items-center justify-between overflow-x-auto pb-2">
            {admissionSteps.map((step, index) => {
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;
              const StepIcon = step.icon;

              return (
                <div key={step.id} className="flex items-center shrink-0">
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center transition-all border-2",
                      isCompleted ? "bg-success border-success text-white" :
                      isCurrent ? "bg-primary border-primary text-white shadow-lg" :
                      "bg-muted border-transparent text-muted-foreground"
                    )}>
                      {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <StepIcon className="w-5 h-5" />}
                    </div>
                    <span className={cn("text-[10px] font-bold mt-2 uppercase tracking-tighter", isCurrent ? "text-primary" : "text-muted-foreground")}>
                      {step.title}
                    </span>
                  </div>
                  {index < admissionSteps.length - 1 && (
                    <div className={cn("w-12 lg:w-24 h-0.5 mx-4", isCompleted ? "bg-success" : "bg-muted")} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Side: Pending Queue */}
          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
            <h2 className="font-display text-lg font-semibold mb-6 flex items-center justify-between">
              Admission Queue
              <StatusBadge status="warning" label={`${pendingPatients.length} Active`} size="sm" />
            </h2>
            <div className="space-y-3">
              {pendingPatients.map((patient) => (
                <div 
                  key={patient.id}
                  className={cn(
                    "p-4 rounded-xl border transition-all cursor-pointer",
                    activePatient?.id === patient.id ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-border hover:border-primary/30"
                  )}
                  onClick={() => handleProcessPatient(patient)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold">{patient.name}</span>
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                      patient.priority === "urgent" ? "bg-critical text-white" : "bg-muted text-muted-foreground"
                    )}>
                      {patient.priority}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{patient.department} • {patient.id}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {patient.waitTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Step Actions */}
          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
            <h2 className="font-display text-lg font-semibold mb-6">
              {currentStep === 3 ? "Select Bed Allocation" : "Workflow Action"}
            </h2>

            {activePatient ? (
              <div className="space-y-6">
                <div className="p-4 bg-muted/20 rounded-xl border border-border flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"><User className="w-5 h-5 text-primary" /></div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase leading-none mb-1">Processing Patient</p>
                    <p className="text-sm font-bold">{activePatient.name} ({activePatient.department})</p>
                  </div>
                </div>

                {currentStep === 3 ? (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                    {bedSuggestions.map((bed) => (
                      <div key={bed.id} className="p-4 rounded-xl border border-border hover:border-primary/50 transition-all">
                        <div className="flex justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><Bed className="w-5 h-5 text-primary" /></div>
                            <div><p className="font-bold text-sm">{bed.id}</p><p className="text-[10px] text-muted-foreground uppercase">{bed.floor}</p></div>
                          </div>
                          <span className="text-xs font-bold text-success">{bed.match}% Match</span>
                        </div>
                        <Button variant="success" size="sm" className="w-full" onClick={() => handleAssignBed(bed.id)}>
                          Assign This Bed <ArrowRight className="w-3 h-3 ml-2" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    {currentStep === 5 ? (
                      <div className="animate-bounce mb-4"><CheckCircle2 className="w-12 h-12 text-success mx-auto" /></div>
                    ) : <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />}
                    <p className="font-bold mb-4">
                      {currentStep === 5 ? "Admission Confirmed!" : `Ready for ${admissionSteps.find(s => s.id === currentStep)?.title}`}
                    </p>
                    <Button onClick={() => setCurrentStep(prev => Math.min(prev + 1, 5))}>
                      {currentStep === 5 ? "Finish & Close" : "Proceed to Next Step"}
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center opacity-40 border-2 border-dashed border-muted rounded-xl">
                <UserCheck className="w-12 h-12 mb-2" />
                <p className="text-sm">Select a patient from the queue or click<br/><strong>Direct Admission</strong> to begin.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Admission;