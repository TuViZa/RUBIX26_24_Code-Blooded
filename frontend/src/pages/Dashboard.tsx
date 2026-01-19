import { useState, useEffect } from "react";
import { 
  Activity, 
  Building2, 
  Bed, 
  Ambulance, 
  Droplets, 
  User, 
  Clock,
  AlertTriangle,
  TrendingUp,
  MapPin,
  Phone,
  Users,
  Heart,
  Shield,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";

interface Hospital {
  id: string;
  name: string;
  status: "normal" | "high" | "critical";
  beds: {
    total: number;
    available: number;
    icu: number;
    ventilators: number;
  };
  emergency: boolean;
  location: { x: number; y: number };
}

interface Ambulance {
  id: string;
  status: "active" | "dispatched" | "available";
  location: { x: number; y: number };
  destination?: { x: number; y: number };
  eta?: number;
}

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Mock data
  const hospitals: Hospital[] = [
    {
      id: "1",
      name: "City General Hospital",
      status: "normal",
      beds: { total: 500, available: 127, icu: 45, ventilators: 23 },
      emergency: false,
      location: { x: 30, y: 40 }
    },
    {
      id: "2",
      name: "St. Mary's Medical Center",
      status: "high",
      beds: { total: 350, available: 23, icu: 12, ventilators: 8 },
      emergency: true,
      location: { x: 60, y: 30 }
    },
    {
      id: "3",
      name: "Memorial Regional",
      status: "critical",
      beds: { total: 400, available: 5, icu: 3, ventilators: 2 },
      emergency: true,
      location: { x: 45, y: 70 }
    },
    {
      id: "4",
      name: "North County Medical",
      status: "normal",
      beds: { total: 280, available: 89, icu: 18, ventilators: 12 },
      emergency: false,
      location: { x: 20, y: 60 }
    }
  ];

  const ambulances: Ambulance[] = [
    { id: "A1", status: "active", location: { x: 25, y: 35 }, destination: { x: 60, y: 30 }, eta: 8 },
    { id: "A2", status: "dispatched", location: { x: 50, y: 50 }, destination: { x: 45, y: 70 }, eta: 5 },
    { id: "A3", status: "available", location: { x: 70, y: 45 } },
    { id: "A4", status: "active", location: { x: 35, y: 55 }, destination: { x: 20, y: 60 }, eta: 12 }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal": return "text-green-400";
      case "high": return "text-yellow-400";
      case "critical": return "text-red-400";
      default: return "text-gray-400";
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case "normal": return "bg-green-500/20 border-green-500/30";
      case "high": return "bg-yellow-500/20 border-yellow-500/30";
      case "critical": return "bg-red-500/20 border-red-500/30";
      default: return "bg-gray-500/20 border-gray-500/30";
    }
  };

  const metrics = [
    {
      title: "Active Hospitals",
      value: hospitals.length,
      icon: Building2,
      color: "from-blue-500 to-blue-600",
      glow: "shadow-blue-500/25"
    },
    {
      title: "Available Beds",
      value: hospitals.reduce((sum, h) => sum + h.beds.available, 0),
      icon: Bed,
      color: "from-green-500 to-green-600",
      glow: "shadow-green-500/25"
    },
    {
      title: "Ambulances Active",
      value: ambulances.filter(a => a.status === "active").length,
      icon: Ambulance,
      color: "from-orange-500 to-orange-600",
      glow: "shadow-orange-500/25"
    },
    {
      title: "Blood Units Available",
      value: 2847,
      icon: Droplets,
      color: "from-red-500 to-red-600",
      glow: "shadow-red-500/25"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-lg bg-slate-900/50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  City Health Sync
                </h1>
              </div>
              
              <nav className="hidden md:flex items-center gap-1">
                {["Dashboard", "Hospitals", "Ambulances", "Analytics"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab.toLowerCase())}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeTab === tab.toLowerCase()
                        ? "bg-white/10 text-white"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <Link to="/">
                <button className="px-3 py-2 rounded-lg text-sm font-medium bg-slate-700/50 border border-slate-600 text-white hover:bg-slate-700 transition-all">
                  🏠 Home
                </button>
              </Link>
              <Link to="/">
                <button className="px-3 py-2 rounded-lg text-sm font-medium bg-slate-700/50 border border-slate-600 text-white hover:bg-slate-700 transition-all">
                  ⭐ Features
                </button>
              </Link>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Clock className="w-4 h-4" />
                {currentTime.toLocaleTimeString()}
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className={`relative bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all shadow-lg ${metric.glow}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${metric.color} flex items-center justify-center`}>
                  <metric.icon className="w-6 h-6 text-white" />
                </div>
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              </div>
              <div className="text-3xl font-bold mb-1">{metric.value.toLocaleString()}</div>
              <div className="text-sm text-gray-400">{metric.title}</div>
            </div>
          ))}
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Hospital List */}
          <div className="lg:col-span-3">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Hospital Status
              </h3>
              <div className="space-y-3">
                {hospitals.map((hospital) => (
                  <div
                    key={hospital.id}
                    onClick={() => setSelectedHospital(hospital)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all hover:bg-white/5 ${
                      selectedHospital?.id === hospital.id ? "border-blue-500/50 bg-blue-500/10" : "border-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-sm">{hospital.name}</div>
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(hospital.status)}`} />
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full inline-block ${getStatusBg(hospital.status)} ${getStatusColor(hospital.status)}`}>
                      {hospital.status.toUpperCase()}
                    </div>
                    {hospital.emergency && (
                      <div className="flex items-center gap-1 mt-2 text-red-400">
                        <AlertTriangle className="w-3 h-3" />
                        <span className="text-xs">Emergency</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Map View */}
          <div className="lg:col-span-6">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 h-[600px] relative overflow-hidden">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                City Operations Map
              </h3>
              
              {/* Map Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 to-slate-800/50 rounded-xl">
                {/* Grid lines for map effect */}
                <div className="absolute inset-0 opacity-10">
                  {[...Array(10)].map((_, i) => (
                    <div key={`h-${i}`} className="absolute w-full border-t border-white/20" style={{ top: `${i * 10}%` }} />
                  ))}
                  {[...Array(10)].map((_, i) => (
                    <div key={`v-${i}`} className="absolute h-full border-l border-white/20" style={{ left: `${i * 10}%` }} />
                  ))}
                </div>
              </div>

              {/* Hospital Markers */}
              {hospitals.map((hospital) => (
                <div
                  key={hospital.id}
                  className="absolute w-4 h-4 rounded-full border-2 border-white cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                  style={{ 
                    left: `${hospital.location.x}%`, 
                    top: `${hospital.location.y}%`,
                    backgroundColor: hospital.status === 'normal' ? '#10b981' : hospital.status === 'high' ? '#f59e0b' : '#ef4444'
                  }}
                  onClick={() => setSelectedHospital(hospital)}
                >
                  {hospital.emergency && (
                    <div className="absolute -inset-2 rounded-full bg-red-500 animate-ping" />
                  )}
                </div>
              ))}

              {/* Ambulance Markers */}
              {ambulances.map((ambulance) => (
                <div
                  key={ambulance.id}
                  className="absolute w-3 h-3 rounded-full bg-orange-500 border border-white transform -translate-x-1/2 -translate-y-1/2"
                  style={{ 
                    left: `${ambulance.location.x}%`, 
                    top: `${ambulance.location.y}%`
                  }}
                >
                  {ambulance.status === 'active' && (
                    <div className="absolute -inset-1 rounded-full bg-orange-500 animate-pulse" />
                  )}
                </div>
              ))}

              {/* Emergency Popup */}
              <div className="absolute top-4 right-4 bg-red-500/20 border border-red-500/50 rounded-xl p-4 max-w-xs backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span className="font-semibold text-red-400">Emergency Response</span>
                </div>
                <div className="text-sm text-gray-300">
                  <div>Cardiac Emergency - St. Mary's</div>
                  <div className="text-xs text-gray-400 mt-1">ETA: 8 minutes</div>
                </div>
              </div>
            </div>
          </div>

          {/* Selected Hospital Details */}
          <div className="lg:col-span-3">
            {selectedHospital ? (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                <h3 className="text-lg font-semibold mb-4">{selectedHospital.name}</h3>
                
                <div className="space-y-4">
                  <div className={`p-3 rounded-xl ${getStatusBg(selectedHospital.status)}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <Shield className="w-4 h-4" />
                      <span className="font-medium">Emergency Status</span>
                    </div>
                    <div className={`text-sm ${getStatusColor(selectedHospital.status)}`}>
                      {selectedHospital.status.toUpperCase()}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Bed className="w-4 h-4" />
                      <span className="font-medium">Bed Availability</span>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Available</span>
                          <span>{selectedHospital.beds.available}/{selectedHospital.beds.total}</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all"
                            style={{ width: `${(selectedHospital.beds.available / selectedHospital.beds.total) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>ICU</span>
                          <span>{selectedHospital.beds.icu}</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-orange-500 h-2 rounded-full transition-all"
                            style={{ width: `${(selectedHospital.beds.icu / selectedHospital.beds.total) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Ventilators</span>
                          <span>{selectedHospital.beds.ventilators}</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-red-500 h-2 rounded-full transition-all"
                            style={{ width: `${(selectedHospital.beds.ventilators / selectedHospital.beds.total) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-xl text-sm font-medium transition-colors">
                      Contact
                    </button>
                    <button className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-xl text-sm font-medium transition-colors">
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                <div className="text-center text-gray-400 py-12">
                  <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select a hospital to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Resource Usage
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Bed Occupancy</span>
                <span className="text-sm font-medium">78%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{ width: '78%' }} />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">ICU Usage</span>
                <span className="text-sm font-medium">92%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full" style={{ width: '92%' }} />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Demand Forecast
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Next 6 Hours</span>
                <span className="text-sm font-medium text-yellow-400">+15%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Next 24 Hours</span>
                <span className="text-sm font-medium text-orange-400">+32%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Peak Load</span>
                <span className="text-sm font-medium text-red-400">3:00 PM</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Critical Alerts
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <Heart className="w-4 h-4 text-red-400" />
                  <span className="text-sm font-medium">Memorial Regional</span>
                </div>
                <div className="text-xs text-gray-400">ICU capacity at 95%</div>
                <button className="mt-2 text-xs text-red-400 hover:text-red-300">Take Action →</button>
              </div>
              <div className="p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-medium">St. Mary's</span>
                </div>
                <div className="text-xs text-gray-400">Blood supply low</div>
                <button className="mt-2 text-xs text-yellow-400 hover:text-yellow-300">Take Action →</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
