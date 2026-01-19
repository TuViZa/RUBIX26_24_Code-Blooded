import { useState, useEffect } from "react";
import { 
  Users, 
  Bed, 
  UserPlus, 
  Package, 
  AlertTriangle, 
  Activity,
  Clock,
  Droplets,
  Building2,
  Ambulance,
  Heart,
  Shield,
  Zap,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const recentAdmissions = [
  { id: "P-2024-001", name: "Rahul Sharma", department: "Cardiology", time: "10:30 AM", status: "admitted" },
  { id: "P-2024-002", name: "Priya Patel", department: "Orthopedics", time: "10:15 AM", status: "pending" },
  { id: "P-2024-003", name: "Amit Kumar", department: "General Medicine", time: "09:45 AM", status: "admitted" },
  { id: "P-2024-004", name: "Sneha Reddy", department: "Pediatrics", time: "09:30 AM", status: "admitted" },
];

const alerts = [
  { type: "warning", message: "Low stock: Paracetamol 500mg", time: "5 min ago" },
  { type: "critical", message: "ICU Bed 12 - Critical patient alert", time: "12 min ago" },
  { type: "warning", message: "Blood Bank: O- units running low", time: "30 min ago" },
];

const StatCard = ({ title, value, icon: Icon, variant, trend, subtitle }: any) => {
  const getVariantStyles = (variant: string) => {
    switch (variant) {
      case "primary": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "accent": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "success": return "bg-green-500/10 text-green-400 border-green-500/20";
      case "warning": return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      default: return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${getVariantStyles(variant)} flex items-center justify-center border`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {trend.isPositive ? '↑' : '↓'} {trend.value}%
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-gray-400">{title}</div>
      {subtitle && <div className="text-xs text-gray-500 mt-1">{subtitle}</div>}
    </div>
  );
};

const StatusBadge = ({ status, label, size }: any) => {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "normal": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "warning": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "critical": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "available": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "reserved": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusStyles(status)} ${size === 'sm' ? 'text-xs' : ''}`}>
      {label}
    </span>
  );
};

const CommandCenter = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-lg bg-slate-900/50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Command Center
              </h1>
              <p className="text-gray-400">Real-time hospital operations overview</p>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="outline" size="sm" className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-700">
                  🏠 Home
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" size="sm" className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-700">
                  ⭐ Features
                </Button>
              </Link>
              <StatusBadge status="normal" label="All Systems Operational" />
              <div className="text-right">
                <div className="text-sm text-gray-400">System Time</div>
                <div className="text-lg font-semibold">{currentTime.toLocaleTimeString()}</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="OPD Patients Today"
            value={127}
            icon={Users}
            variant="primary"
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Bed Occupancy"
            value="84%"
            subtitle="168 of 200 beds occupied"
            icon={Bed}
            variant="accent"
          />
          <StatCard
            title="Admissions Today"
            value={23}
            icon={UserPlus}
            variant="success"
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            title="Low Stock Alerts"
            value={3}
            icon={Package}
            variant="warning"
          />
        </div>

        {/* Main Features Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold">Hospital Network</h3>
            </div>
            <p className="text-sm text-gray-400 mb-4">Monitor and manage interconnected hospital facilities across the city.</p>
            <Link to="/network">
              <Button variant="outline" className="w-full bg-slate-700/50 border-slate-600 text-white hover:bg-slate-700">Manage Network</Button>
            </Link>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Ambulance className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold">Ambulance Fleet</h3>
            </div>
            <p className="text-sm text-gray-400 mb-4">Real-time tracking and optimization of emergency medical services.</p>
            <Link to="/ambulance-detection">
              <Button variant="outline" className="w-full bg-slate-700/50 border-slate-600 text-white hover:bg-slate-700">Track Fleet</Button>
            </Link>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                <Droplets className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold">Blood Bank</h3>
            </div>
            <p className="text-sm text-gray-400 mb-4">Manage blood inventory and donation campaigns across hospitals.</p>
            <Link to="/blood-bank">
              <Button variant="outline" className="w-full bg-slate-700/50 border-slate-600 text-white hover:bg-slate-700">View Inventory</Button>
            </Link>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <Package className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold">Inventory</h3>
            </div>
            <p className="text-sm text-gray-400 mb-4">Track medical supplies, equipment, and pharmaceutical resources.</p>
            <Link to="/inventory">
              <Button variant="outline" className="w-full bg-slate-700/50 border-slate-600 text-white hover:bg-slate-700">Manage Supplies</Button>
            </Link>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                <Heart className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-lg font-semibold">Patient Flow</h3>
            </div>
            <p className="text-sm text-gray-400 mb-4">Analyze patient movement patterns and optimize care pathways.</p>
            <Link to="/patient-flow">
              <Button variant="outline" className="w-full bg-slate-700/50 border-slate-600 text-white hover:bg-slate-700">View Analytics</Button>
            </Link>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold">Resilience</h3>
            </div>
            <p className="text-sm text-gray-400 mb-4">Monitor system preparedness and emergency response capabilities.</p>
            <Link to="/resilience">
              <Button variant="outline" className="w-full bg-slate-700/50 border-slate-600 text-white hover:bg-slate-700">View Metrics</Button>
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Department Overview */}
          <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Department Status</h2>
              <Link to="/beds">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">View All</Button>
              </Link>
            </div>
            
            <div className="space-y-4">
              {[
                { name: "Emergency", beds: 20, occupied: 18, queue: 12, status: "critical" as const },
                { name: "ICU", beds: 15, occupied: 14, queue: 3, status: "warning" as const },
                { name: "General Ward", beds: 80, occupied: 62, queue: 8, status: "normal" as const },
                { name: "Pediatrics", beds: 30, occupied: 22, queue: 5, status: "normal" as const },
                { name: "Cardiology", beds: 25, occupied: 20, queue: 7, status: "warning" as const },
              ].map((dept) => (
                <div key={dept.name} className="flex items-center justify-between p-4 rounded-xl bg-slate-700/50 hover:bg-slate-700 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Activity className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="font-medium">{dept.name}</div>
                      <div className="text-sm text-gray-400">
                        {dept.occupied}/{dept.beds} beds • {dept.queue} in queue
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-32 h-2 bg-slate-600 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          dept.status === "critical" ? "bg-red-500" :
                          dept.status === "warning" ? "bg-orange-500" : "bg-green-500"
                        }`}
                        style={{ width: `${(dept.occupied / dept.beds) * 100}%` }}
                      />
                    </div>
                    <StatusBadge status={dept.status} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts & Recent Activity */}
          <div className="space-y-6">
            {/* Alerts */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Active Alerts</h2>
                <AlertTriangle className="w-5 h-5 text-orange-400" />
              </div>
              <div className="space-y-3">
                {alerts.map((alert, i) => (
                  <div key={i} className={`p-3 rounded-xl ${
                    alert.type === "critical" ? "bg-red-500/10 border border-red-500/20" :
                    "bg-orange-500/10 border border-orange-500/20"
                  }`}>
                    <div className={`text-sm font-medium ${
                      alert.type === "critical" ? "text-red-400" : "text-orange-400"
                    }`}>
                      {alert.message}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{alert.time}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                <Link to="/opd-queue">
                  <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2 bg-slate-700/50 border-slate-600 text-white hover:bg-slate-700">
                    <Clock className="w-5 h-5" />
                    <span className="text-xs">OPD Queue</span>
                  </Button>
                </Link>
                <Link to="/beds">
                  <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2 bg-slate-700/50 border-slate-600 text-white hover:bg-slate-700">
                    <Bed className="w-5 h-5" />
                    <span className="text-xs">Bed Status</span>
                  </Button>
                </Link>
                <Link to="/blood-bank">
                  <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2 bg-slate-700/50 border-slate-600 text-white hover:bg-slate-700">
                    <Droplets className="w-5 h-5" />
                    <span className="text-xs">Blood Bank</span>
                  </Button>
                </Link>
                <Link to="/admission">
                  <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2 bg-slate-700/50 border-slate-600 text-white hover:bg-slate-700">
                    <UserPlus className="w-5 h-5" />
                    <span className="text-xs">New Admission</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Admissions */}
        <div className="mt-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Recent Admissions</h2>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">View All</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Patient ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Department</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Time</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentAdmissions.map((admission) => (
                  <tr key={admission.id} className="border-b border-white/5 hover:bg-slate-700/50 transition-colors">
                    <td className="py-3 px-4 text-sm font-mono">{admission.id}</td>
                    <td className="py-3 px-4 text-sm font-medium">{admission.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-400">{admission.department}</td>
                    <td className="py-3 px-4 text-sm text-gray-400">{admission.time}</td>
                    <td className="py-3 px-4">
                      <StatusBadge 
                        status={admission.status === "admitted" ? "available" : "reserved"} 
                        label={admission.status === "admitted" ? "Admitted" : "Pending"} 
                        size="sm" 
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandCenter;
