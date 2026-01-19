import React, { useState, useEffect, useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { 
  TrendingUp,
  Clock,
  Activity,
  BarChart3,
  Hospital
} from "lucide-react";
import { cn } from "@/lib/utils";
import Papa from "papaparse";

interface HospitalData {
  timestamp: string;
  hospital: string;
  avg_wait_time: number;
  bed_occupancy: number;
  [key: string]: any; // Allow additional properties
}

const LoadDetection = () => {
  const [data, setData] = useState<HospitalData[]>([]);
  const [timestamps, setTimestamps] = useState<string[]>([]);
  const [currentTimeIdx, setCurrentTimeIdx] = useState(0);
  const [selectedHospital, setSelectedHospital] = useState("");

  // 1. Load Real-time Dataset
  useEffect(() => {
    fetch('hospital_system_dataset.csv')
      .then(res => res.text())
      .then(csv => {
        Papa.parse(csv, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => {
            const clean = (results.data as HospitalData[]).filter(r => r.timestamp && r.hospital);
            setData(clean);
            const ts = [...new Set(clean.map(r => r.timestamp))].sort();
            setTimestamps(ts);
            if (clean.length > 0) setSelectedHospital(clean[0].hospital);
          }
        });
      });
  }, []);

  // 2. Simulation Loop (Updates every 4 seconds)
  useEffect(() => {
    if (timestamps.length === 0) return;
    const timer = setInterval(() => {
      setCurrentTimeIdx(prev => (prev + 1) % timestamps.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [timestamps]);

  const currentTime = timestamps[currentTimeIdx];
  const hospitalsNow = useMemo(() => 
    data.filter(d => d.timestamp === currentTime), 
  [data, currentTime]);

  const activeData = useMemo(() => 
    hospitalsNow.find(h => h.hospital === selectedHospital) || hospitalsNow[0], 
  [hospitalsNow, selectedHospital]);

  // Status Color Logic
  const getStatus = (val, type) => {
    if (type === 'OPD') {
      if (val > 60) return "Critical";
      if (val > 40) return "High";
      return "Normal";
    }
    if (val > 90) return "Critical";
    if (val > 80) return "High";
    return "Normal";
  };

  // Prediction mapping
  const predictions = useMemo(() => {
    if (!activeData) return [];
    return [
      { time: "Current Status", opdLoad: getStatus(activeData.avg_wait_time, 'OPD'), bedPressure: getStatus(activeData.bed_occupancy, 'Bed'), confidence: 99 },
      { time: "Next 2 Hours", opdLoad: activeData.avg_wait_time > 50 ? "Critical" : "High", bedPressure: "High", confidence: 88 },
      { time: "Next 4 Hours", opdLoad: "Moderate", bedPressure: "High", confidence: 76 },
      { time: "Next 8 Hours", opdLoad: "Normal", bedPressure: "Moderate", confidence: 62 },
    ];
  }, [activeData]);

  if (!activeData) return null;

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-10 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-primary rounded-lg text-white">
                <Hospital className="w-6 h-6" />
              </div>
              <h1 className="font-display text-4xl font-black tracking-tighter uppercase italic">
                Early <span className="text-primary">Load</span> Detection
              </h1>
            </div>
            <p className="text-muted-foreground flex items-center gap-2 font-medium">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              Simulation Active: <span className="font-mono text-foreground font-bold">{currentTime}</span>
            </p>
          </div>

          {/* Hospital Selection Toggles */}
          <div className="flex flex-wrap gap-2 lg:justify-end">
            {hospitalsNow.map((h, i) => (
              <button 
                key={i}
                onClick={() => setSelectedHospital(h.hospital)}
                className={cn(
                  "px-4 py-2 rounded-xl text-[11px] font-black uppercase border transition-all duration-200",
                  selectedHospital === h.hospital 
                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                    : "bg-white border-slate-200 text-slate-500 hover:border-primary"
                )}
              >
                {h.hospital}
              </button>
            ))}
          </div>
        </div>

        {/* Global Performance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard 
            title="OPD Wait Time" 
            value={`${Math.round(activeData.avg_wait_time)}m`} 
            icon={Clock} 
            variant={activeData.avg_wait_time > 50 ? "critical" : "primary"} 
          />
          <StatCard 
            title="Bed Occupancy" 
            value={`${Math.round(activeData.bed_occupancy)}%`} 
            icon={Activity} 
            variant={activeData.bed_occupancy > 85 ? "warning" : "success"} 
          />
          <StatCard 
            title="AI Confidence" 
            value="94%" 
            icon={BarChart3} 
            variant="primary" 
          />
          <StatCard 
            title="Update Cycle" 
            value="Real-time" 
            icon={TrendingUp} 
            variant="default" 
          />
        </div>

        {/* Expanded Prediction Cards Area */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl font-black italic uppercase tracking-tight flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-primary" /> Operational Forecast
              </h2>
              <p className="text-sm text-muted-foreground font-medium mt-1">Predictive analysis for {activeData.hospital}</p>
            </div>
            <div className="px-4 py-2 bg-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500">
              4h Refresh Rate
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {predictions.map((pred, index) => (
              <div 
                key={index} 
                className={cn(
                  "p-8 rounded-[2rem] border-2 transition-all duration-300 flex flex-col justify-between min-h-[320px]",
                  index === 0 
                    ? "border-primary bg-primary/5 shadow-xl scale-[1.02] z-10" 
                    : "border-slate-100 bg-slate-50/50 hover:bg-slate-50"
                )}
              >
                <div>
                  <div className="text-xs font-black text-slate-400 uppercase mb-6 tracking-[0.2em]">{pred.time}</div>
                  
                  <div className="space-y-8">
                    <div>
                      <div className="text-[11px] text-muted-foreground font-bold uppercase mb-2">OPD Load Level</div>
                      <div className={cn(
                        "text-3xl font-black italic tracking-tighter uppercase",
                        pred.opdLoad === "Critical" ? "text-critical" : pred.opdLoad === "High" ? "text-warning" : "text-emerald-500"
                      )}>
                        {pred.opdLoad}
                      </div>
                    </div>

                    <div>
                      <div className="text-[11px] text-muted-foreground font-bold uppercase mb-2">Bed Capacity Pressure</div>
                      <div className={cn(
                        "text-3xl font-black italic tracking-tighter uppercase",
                        pred.bedPressure === "High" || pred.bedPressure === "Critical" ? "text-critical" : "text-warning"
                      )}>
                        {pred.bedPressure}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-200/60 mt-8">
                  <div className="flex justify-between items-center">
                    <div className="text-[10px] text-muted-foreground font-black uppercase">Model Confidence</div>
                    <div className="font-black text-primary text-lg">{pred.confidence}%</div>
                  </div>
                  {/* Visual Progress Bar */}
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div 
                      className="bg-primary h-full transition-all duration-1000" 
                      style={{ width: `${pred.confidence}%` }}
                    />
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