import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { 
  Building2, 
  Share2, 
  Wifi,
  ArrowRightLeft,
  Bed,
  MapPin,
  X,
  Send,
  Loader2,
  List,
  Map as MapIcon,
  Navigation
} from "lucide-react";
import { cn } from "@/lib/utils";

// 1. Initial Data Models - Added X/Y for Map Positioning
const INITIAL_HOSPITALS = [
  { name: "City General Hospital", distance: "2.5 km", status: "online", beds: { available: 12, total: 150 }, queue: 45, lastSync: "2 min ago", x: 25, y: 35 },
  { name: "Metro Medical Center", distance: "4.2 km", status: "online", beds: { available: 28, total: 200 }, queue: 32, lastSync: "1 min ago", x: 75, y: 25 },
  { name: "Regional Health Hub", distance: "6.8 km", status: "online", beds: { available: 5, total: 80 }, queue: 67, lastSync: "5 min ago", x: 45, y: 75 },
  { name: "Central District Hospital", distance: "8.1 km", status: "offline", beds: { available: 0, total: 120 }, queue: 0, lastSync: "15 min ago", x: 85, y: 85 },
];

const INITIAL_TRANSFERS = [
  { id: "TRF-001", patient: "Anonymous", from: "Metro Medical", to: "Our Hospital", type: "ICU", status: "in-transit" },
  { id: "TRF-002", patient: "Anonymous", from: "Our Hospital", to: "City General", type: "General", status: "completed" },
  { id: "TRF-003", patient: "Anonymous", from: "Regional Hub", to: "Our Hospital", type: "Emergency", status: "pending" },
];

const HospitalNetwork = () => {
  // 2. State Management
  const [hospitals, setHospitals] = useState(INITIAL_HOSPITALS);
  const [transfers, setTransfers] = useState(INITIAL_TRANSFERS);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [selectedNode, setSelectedNode] = useState<any>(null);
  
  // Form State for new transfers
  const [newTransfer, setNewTransfer] = useState({
    to: "",
    type: "General",
    patientName: "Anonymous"
  });

  // 3. Computed Stats
  const totalConnected = hospitals.filter(h => h.status === "online").length;
  const totalBedsAvailable = hospitals.reduce((acc, h) => acc + h.beds.available, 0);
  const activeTransfers = transfers.filter(t => t.status !== "completed").length;

  // 4. Functional Logic
  const handleBroadcast = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      alert("Local capacity data has been broadcasted to the regional network.");
    }, 1500);
  };

  const handleCreateTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTransfer.to) return;

    const transferEntry = {
      id: `TRF-00${transfers.length + 1}`,
      patient: newTransfer.patientName,
      from: "Our Hospital",
      to: newTransfer.to,
      type: newTransfer.type,
      status: "pending"
    };

    setTransfers([transferEntry, ...transfers]);
    setShowTransferModal(false);
    setSelectedNode(null);
    setNewTransfer({ to: "", type: "General", patientName: "Anonymous" });
  };

  return (
    
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-black uppercase italic tracking-tighter">
              Inter-Hospital <span className="text-primary">Network</span>
            </h1>
            <p className="text-muted-foreground font-medium">City-wide capacity sharing and patient coordination</p>
          </div>
          
          <div className="flex items-center gap-3 mt-4 lg:mt-0">
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 mr-2">
              <button 
                onClick={() => setViewMode("list")}
                className={cn("p-2 rounded-lg transition-all", viewMode === "list" ? "bg-white text-primary shadow-sm" : "text-slate-400")}
              >
                <List className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode("map")}
                className={cn("p-2 rounded-lg transition-all", viewMode === "map" ? "bg-white text-primary shadow-sm" : "text-slate-400")}
              >
                <MapIcon className="w-4 h-4" />
              </button>
            </div>

            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleBroadcast}
              disabled={isSyncing}
              className="rounded-xl border-slate-200 font-bold"
            >
              {isSyncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Share2 className="w-4 h-4 mr-2" />}
              Broadcast Capacity
            </Button>
            <Button 
              variant="hero" 
              size="sm" 
              onClick={() => setShowTransferModal(true)}
              className="rounded-xl font-bold"
            >
              <ArrowRightLeft className="w-4 h-4 mr-2" />
              Request Transfer
            </Button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Connected Hospitals" value={totalConnected} subtitle={`${hospitals.length} in network`} icon={Building2} variant="primary" />
          <StatCard title="Network Beds Available" value={totalBedsAvailable} icon={Bed} variant="success" />
          <StatCard title="Active Transfers" value={activeTransfers} icon={ArrowRightLeft} variant="accent" />
          <StatCard 
            title="Data Sync Status" 
            value={isSyncing ? "Syncing..." : "Live"} 
            subtitle="Real-time updates" 
            icon={Wifi} 
            variant={isSyncing ? "warning" : "default"} 
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-lg font-black uppercase tracking-tight">
                    {viewMode === "list" ? "Network Hospitals" : "Strategic Map View"}
                </h2>
                {/* Switch Back Logic Added Here */}
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setViewMode(viewMode === "list" ? "map" : "list")} 
                    className="text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5"
                >
                    {viewMode === "list" ? "Switch to Map" : "Switch to List"}
                </Button>
              </div>

              {viewMode === "list" ? (
                <div className="space-y-4">
                  {hospitals.map((hospital) => (
                    <div key={hospital.name} className={cn(
                        "p-5 rounded-2xl border transition-all duration-300",
                        hospital.status === "online" ? "border-slate-100 bg-slate-50/30 hover:shadow-md" : "border-slate-50 opacity-50 bg-slate-50/10"
                    )}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", hospital.status === "online" ? "bg-primary/10 text-primary" : "bg-slate-200 text-slate-400")}>
                            <Building2 className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-black text-slate-800 uppercase text-sm tracking-tight">{hospital.name}</h3>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              <MapPin className="w-3 h-3" />
                              <span>{hospital.distance} away</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-100">
                          <div className={cn("w-2 h-2 rounded-full", hospital.status === "online" ? "bg-emerald-500 animate-pulse" : "bg-slate-300")} />
                          <span className="text-[10px] font-black uppercase tracking-tighter text-slate-500">{hospital.status}</span>
                        </div>
                      </div>
                      {hospital.status === "online" && (
                        <div className="grid grid-cols-3 gap-4">
                          <div className="p-3 rounded-xl bg-white border border-slate-100">
                            <div className="text-xl font-black text-emerald-600 italic tracking-tighter">{hospital.beds.available}</div>
                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Beds Free</div>
                          </div>
                          <div className="p-3 rounded-xl bg-white border border-slate-100">
                            <div className="text-xl font-black text-slate-800 italic tracking-tighter">{hospital.queue}</div>
                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Queue</div>
                          </div>
                          <div className="p-3 rounded-xl bg-white border border-slate-100">
                            <div className="text-[11px] font-black text-slate-400 py-1.5">{hospital.lastSync}</div>
                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Last Sync</div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="relative bg-slate-900 rounded-[1.5rem] w-full h-[600px] overflow-hidden border-4 border-slate-100">
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center border-4 border-slate-900 shadow-2xl">
                      <Navigation className="w-7 h-7 text-white" />
                    </div>
                    <div className="absolute inset-0 bg-primary/20 animate-ping rounded-full scale-150 -z-10" />
                  </div>
                  {hospitals.map((h) => (
                    <button key={h.name} onClick={() => setSelectedNode(h)} style={{ left: `${h.x}%`, top: `${h.y}%` }} className="absolute group -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110 active:scale-95 z-20">
                      <div className={cn("w-10 h-10 rounded-full border-2 flex items-center justify-center shadow-lg transition-all", h.status === "online" ? "bg-emerald-500 border-white" : "bg-slate-700 border-slate-500")}>
                        <Building2 className="w-5 h-5 text-white" />
                      </div>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-white px-3 py-1.5 rounded-xl shadow-xl border border-slate-100 pointer-events-none">
                        <p className="text-[10px] font-black uppercase text-slate-800">{h.name}</p>
                        {h.status === "online" && <p className="text-[8px] font-bold text-emerald-500 uppercase">{h.beds.available} BEDS FREE</p>}
                      </div>
                    </button>
                  ))}
                  {selectedNode && (
                    <div className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-md p-6 rounded-[2rem] border border-white shadow-2xl flex items-center justify-between animate-in slide-in-from-bottom-6 z-30">
                      <div>
                        <h3 className="text-sm font-black uppercase italic tracking-tighter text-slate-800">{selectedNode.name}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">{selectedNode.distance} AWAY</span>
                          <span className={cn("text-[10px] font-black uppercase", selectedNode.status === "online" ? "text-emerald-500" : "text-slate-400")}>
                            {selectedNode.status === "online" ? `${selectedNode.beds.available} BEDS AVAILABLE` : "OFFLINE"}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="rounded-xl h-10 px-4 font-black uppercase text-[10px]" onClick={() => setSelectedNode(null)}>Dismiss</Button>
                        {selectedNode.status === "online" && (
                          <Button size="sm" className="rounded-xl h-10 px-4 font-black uppercase text-[10px]" onClick={() => { setNewTransfer({...newTransfer, to: selectedNode.name}); setShowTransferModal(true); }}>Request Transfer</Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Transfers Sidebar */}
          <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm h-fit">
            <h2 className="font-display text-lg font-black uppercase tracking-tight mb-4 text-primary">Live Transfers</h2>
            <div className="space-y-3">
              {transfers.map((transfer) => (
                <div key={transfer.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-primary/20 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-black text-[10px] text-slate-400 tracking-widest uppercase">{transfer.id}</span>
                    <StatusBadge status={transfer.status === "completed" ? "normal" : transfer.status === "in-transit" ? "warning" : "critical"} label={transfer.status} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                      <span className="truncate">{transfer.from}</span>
                      <ArrowRightLeft className="w-3 h-3 text-primary flex-shrink-0" />
                      <span className="truncate">{transfer.to}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Transfer Modal - Same Logic as Provided */}
        {showTransferModal && (
          <div className="fixed inset-0 z-[6000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 relative shadow-2xl animate-in zoom-in-95 duration-200">
              <button onClick={() => setShowTransferModal(false)} className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full">
                <X className="w-5 h-5 text-slate-400" />
              </button>
              <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-6">Patient <span className="text-primary">Transfer</span></h2>
              <form onSubmit={handleCreateTransfer} className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">Destination Hospital</label>
                  <select 
                    required
                    className="w-full bg-slate-50 border border-slate-200 h-12 px-4 rounded-xl outline-none font-bold"
                    value={newTransfer.to}
                    onChange={e => setNewTransfer({...newTransfer, to: e.target.value})}
                  >
                    <option value="">Select Destination...</option>
                    {hospitals.filter(h => h.status === "online").map(h => (
                      <option key={h.name} value={h.name}>{h.name} ({h.beds.available} beds free)</option>
                    ))}
                  </select>
                </div>
                <Button type="submit" className="w-full py-7 rounded-2xl font-black uppercase tracking-widest mt-4">
                  <Send className="w-4 h-4 mr-2" /> Dispatch Request
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>
    
  );
};

export default HospitalNetwork;