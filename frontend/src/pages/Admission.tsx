import React, { useState, useMemo, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { mediSyncServices } from "@/lib/firebase-services";
import { toast } from "sonner";
import { useSearchParams, useNavigate } from "react-router-dom";
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
  Zap,
  MapPin,
  Activity,
  AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const patientIdFromQuery = searchParams.get('patientId');
  const tokenIdFromQuery = searchParams.get('tokenId');
  
  // 1. Core State
  const [currentStep, setCurrentStep] = useState(1);
  const [activePatient, setActivePatient] = useState<Patient | null>(null);
  const [assignedBed, setAssignedBed] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [bedSuggestions, setBedSuggestions] = useState<any[]>([]);
  const [checkingBeds, setCheckingBeds] = useState(false);
  
  // 2. Queue Management
  const [pendingPatients, setPendingPatients] = useState<Patient[]>([]);

  // Check bed availability from backend
  const checkBedAvailability = async (department: string, bedType: 'general' | 'icu' | 'emergency' = 'general') => {
    try {
      setCheckingBeds(true);
      const response = await fetch(`${API_BASE_URL}/api/city/heatmap-data`);
      const data = await response.json();
      
      // Get hospitals with available beds
      const hospitalsWithBeds = await Promise.all(
        data.hospitals?.map(async (hospital: any) => {
          try {
            const occupancyResponse = await fetch(`${API_BASE_URL}/api/hospital/${hospital._id}/occupancy`);
            const occupancyData = await occupancyResponse.json();
            
            return {
              id: hospital._id,
              name: hospital.name,
              availableBeds: occupancyData.availableBeds || 0,
              totalBeds: occupancyData.totalBeds || 0,
              occupancyRate: occupancyData.occupancyRate || 0,
              location: hospital.location
            };
          } catch (error) {
            return null;
          }
        }) || []
      );

      // Filter and sort by best match
      const availableHospitals = hospitalsWithBeds
        .filter((h: any) => h && h.availableBeds > 0)
        .map((hospital: any) => ({
          id: `HOSP-${hospital.id}`,
          hospitalName: hospital.name,
          department: department,
          floor: "Multiple Floors",
          bedType: bedType,
          availableBeds: hospital.availableBeds,
          totalBeds: hospital.totalBeds,
          occupancyRate: hospital.occupancyRate,
          score: calculateBedMatch(hospital, department, bedType)
        }))
        .sort((a: any, b: any) => b.score - a.score)
        .slice(0, 5); // Top 5 best matches
      
      setBedSuggestions(availableHospitals);
      return availableHospitals;
      
    } catch (error) {
      console.error('Error checking bed availability:', error);
      
      // Fallback to Firebase
      try {
        const firebaseBeds = await mediSyncServices.beds.getAllBeds();
        setBedSuggestions(firebaseBeds);
        return firebaseBeds;
      } catch (firebaseError) {
        console.error('Firebase fallback also failed:', firebaseError);
        setBedSuggestions([]);
        return [];
      }
    }
  };

  const calculateBedMatch = (hospital: any, department: string, bedType: string) => {
    let score = 50; // Base score
    
    // Availability score (more available = higher score)
    const availabilityScore = Math.min((hospital.availableBeds / hospital.totalBeds) * 30, 30);
    score += availabilityScore;
    
    // Occupancy score (lower occupancy = higher score)
    const occupancyScore = (1 - hospital.occupancyRate / 100) * 20;
    score += occupancyScore;
    
    return Math.min(Math.round(score), 100);
  };

  // Load data from Firebase on mount
  useEffect(() => {
    const loadAdmissionData = async () => {
      try {
        setLoading(true);
        
        // Check if patientId is in query params (from OPD workflow)
        if (patientIdFromQuery) {
          const admissionsData = await mediSyncServices.admissions.getAll();
          const admissionData = admissionsData && typeof admissionsData === 'object' 
            ? Object.values(admissionsData).find((adm: any) => adm.id === patientIdFromQuery)
            : null;
          
          if (admissionData) {
            const patient: Patient = {
              id: admissionData.id,
              name: admissionData.patientName || 'Unknown Patient',
              age: admissionData.age || 0,
              department: admissionData.department || 'General',
              priority: admissionData.priority || 'normal',
              waitTime: '0 min'
            };
            
            setActivePatient(patient);
            setCurrentStep(3); // Jump to bed assignment
            
            // Automatically check bed availability
            await checkBedAvailability(patient.department);
            
            // Update admission status
            await mediSyncServices.admissions.update(patientIdFromQuery, {
              status: 'processing',
              processingStartedAt: new Date().toISOString()
            });
          }
        }
        
        const admissionsData = await mediSyncServices.admissions.getAll();
        
        if (admissionsData) {
          const dataArray = typeof admissionsData === 'object' && !Array.isArray(admissionsData)
            ? Object.values(admissionsData)
            : Array.isArray(admissionsData) ? admissionsData : [];
            
          // Filter for pending admissions
          const pending = dataArray
            .filter((adm: any) => adm.status === 'pending')
            .map((adm: any) => ({
              id: adm.id,
              name: adm.patientName || 'Unknown Patient',
              age: adm.age || 0,
              department: adm.department || 'General',
              priority: adm.priority || 'normal',
              waitTime: adm.waitTime || '30 min'
            }));
          
          setPendingPatients(pending);
        } else {
          // Initialize with default data
          const defaultPatients: Patient[] = [
            { id: "ADM-001", name: "Suresh Verma", age: 56, department: "Cardiology", priority: "high", waitTime: "45 min" },
            { id: "ADM-002", name: "Lakshmi Devi", age: 72, department: "General Medicine", priority: "urgent", waitTime: "20 min" },
            { id: "ADM-003", name: "Kiran Kumar", age: 34, department: "Orthopedics", priority: "normal", waitTime: "1h 30min" },
          ];
          
          // Add to Firebase
          for (const patient of defaultPatients) {
            await mediSyncServices.admissions.create({
              ...patient,
              status: 'pending',
              createdAt: new Date().toISOString()
            });
          }
          
          setPendingPatients(defaultPatients);
        }
      } catch (error) {
        console.error('Error loading admission data:', error);
        toast.error('Failed to load admission data');
      } finally {
        setLoading(false);
      }
    };

    loadAdmissionData();
    
    // Listen for real-time updates
    const unsubscribe = mediSyncServices.admissions.listen((admissionsData) => {
      if (admissionsData) {
        const dataArray = typeof admissionsData === 'object' && !Array.isArray(admissionsData)
          ? Object.values(admissionsData)
          : Array.isArray(admissionsData) ? admissionsData : [];
          
        const pending = dataArray
          .filter((adm: any) => adm.status === 'pending')
          .map((adm: any) => ({
            id: adm.id,
            name: adm.patientName || 'Unknown Patient',
            age: adm.age || 0,
            department: adm.department || 'General',
            priority: adm.priority || 'normal',
            waitTime: adm.waitTime || '30 min'
          }));
        
        setPendingPatients(pending);
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [patientIdFromQuery]);


  const admissionSteps = [
    { id: 1, title: "Registration", icon: User },
    { id: 2, title: "Assessment", icon: ShieldCheck },
    { id: 3, title: "Bed Assignment", icon: Bed },
    { id: 4, title: "Documentation", icon: FileText },
    { id: 5, title: "Confirmation", icon: CheckCircle2 },
  ];

  // --- Functional Handlers ---

  // Standard Admission Path
  const handleProcessPatient = async (patient: Patient) => {
    try {
      setActivePatient(patient);
      setAssignedBed(null);
      setCurrentStep(3); // Jump to Bed Assignment for queue patients
      
      // Update admission status in Firebase
      await mediSyncServices.admissions.update(patient.id, {
        status: 'processing',
        processingStartedAt: new Date().toISOString()
      });
      
      // Check bed availability automatically
      await checkBedAvailability(patient.department);
      
      toast.success(`Processing admission for ${patient.name}`);
    } catch (error) {
      console.error('Error processing patient:', error);
      toast.error('Failed to process patient admission');
    }
  };

  // Direct Admission Path (Emergency/New Case)
  const handleDirectAdmission = async () => {
    try {
      const directPatient: Patient = {
        id: `DIR-${Math.floor(100 + Math.random() * 900)}`,
        name: "Emergency Entry",
        age: 0,
        department: "Emergency",
        priority: "urgent",
        waitTime: "0 min"
      };
      
      // Create admission record in Firebase
      await mediSyncServices.admissions.create({
        ...directPatient,
        status: 'processing',
        createdAt: new Date().toISOString()
      });
      
      setActivePatient(directPatient);
      setAssignedBed(null);
      setCurrentStep(3); // Move immediately to Bed Assignment
      
      toast.success('Emergency admission initiated');
    } catch (error) {
      console.error('Error creating direct admission:', error);
      toast.error('Failed to create emergency admission');
    }
  };

  const handleAssignBed = async (bed: any) => {
    try {
      setAssignedBed(bed.id);
      setCurrentStep(4); // Advance to Documentation
      
      // Update bed status in Firebase
      await mediSyncServices.beds.updateStatus(bed.id, "occupied");
      
      // Update admission record
      if (activePatient) {
        await mediSyncServices.admissions.update(activePatient.id, {
          assignedBed: bed.id,
          assignedHospital: bed.hospitalName,
          bedAssignedAt: new Date().toISOString(),
          status: 'bed-assigned'
        });
      }
      
      // If coming from OPD, update token status
      if (tokenIdFromQuery && activePatient) {
        await mediSyncServices.smartOPD.updateToken(tokenIdFromQuery, {
          status: 'completed',
          admissionId: activePatient.id,
          completedAt: new Date().toISOString()
        });
      }
      
      toast.success(`Bed assigned at ${bed.hospitalName}`, {
        description: `Patient will be admitted to ${bed.department}`,
        duration: 3000
      });
    } catch (error) {
      console.error('Error assigning bed:', error);
      toast.error('Failed to assign bed');
    }
  };

  const resetWorkflow = () => {
    setActivePatient(null);
    setAssignedBed(null);
    setCurrentStep(1);
  };

  return (
    
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
                    {checkingBeds ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                          <Activity className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                          <p className="text-sm text-muted-foreground">Checking bed availability...</p>
                        </div>
                      </div>
                    ) : bedSuggestions.length > 0 ? (
                      <>
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center gap-2 text-blue-800">
                            <AlertTriangle className="w-4 h-4" />
                            <span className="text-sm font-semibold">Found {bedSuggestions.length} available bed options</span>
                          </div>
                        </div>
                        {bedSuggestions.map((bed) => (
                          <div key={bed.id} className="p-4 rounded-xl border border-border hover:border-primary/50 transition-all hover:shadow-md">
                            <div className="flex justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                  <Bed className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                  <p className="font-bold text-sm">{bed.hospitalName}</p>
                                  <p className="text-[10px] text-muted-foreground uppercase">{bed.department} • {bed.floor}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="text-xs font-bold text-success block">{bed.match}% Match</span>
                                <span className="text-xs text-muted-foreground">{bed.availableBeds} beds available</span>
                              </div>
                            </div>
                            <div className="mb-3 flex flex-wrap gap-2">
                              {bed.features.map((feature: string, idx: number) => (
                                <span key={idx} className="text-xs px-2 py-1 bg-muted rounded">{feature}</span>
                              ))}
                            </div>
                            <Button variant="default" size="sm" className="w-full" onClick={() => handleAssignBed(bed)}>
                              Assign This Bed <ArrowRight className="w-3 h-3 ml-2" />
                            </Button>
                          </div>
                        ))}
                      </>
                    ) : (
                      <div className="text-center py-12">
                        <Bed className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                        <p className="font-semibold mb-2">No beds available</p>
                        <p className="text-sm text-muted-foreground mb-4">
                          All beds are currently occupied. Please check alternative hospitals.
                        </p>
                        <Button variant="outline" onClick={() => checkBedAvailability(activePatient?.department || 'General')}>
                          Refresh Availability
                        </Button>
                      </div>
                    )}
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
    
  );
};

export default Admission;