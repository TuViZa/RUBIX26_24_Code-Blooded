import { Button } from "@/components/ui/button";
import { ArrowRight, Activity, Building2, Users, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { Ambulance3D } from "./Ambulance3D";
import { EmergencyAlertPanel } from "./EmergencyAlertPanel";
import { useEmergencyAlert } from "@/hooks/useEmergencyAlert";
import { useState } from "react";
import { toast } from "sonner";

export const HeroSection = () => {
  const [showAlertPanel, setShowAlertPanel] = useState(false);
  const { alertNearbyServices } = useEmergencyAlert();

  const handleAmbulanceClick = () => {
    alertNearbyServices();
    setShowAlertPanel(true);
  };

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* City Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1519494026892-80bbd2d6b4fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
        }}
      />
      
      {/* Dark Overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />

      <div className="container relative mx-auto px-4 pt-32 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-8 animate-fade-in">
            <Activity className="w-4 h-4" />
            <span className="text-sm font-medium">Intelligent Hospital Operations</span>
          </div>

          {/* Heading */}
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-slide-up">
            Syncing Hospital Operations for a{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Healthier City
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Real-time patient flow management, resource optimization, and city-wide healthcare coordination powered by intelligent data analytics.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link to="/dashboard">
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 px-8 py-4 text-lg"
                onClick={() => toast.success('Navigating to Dashboard...', {
                  description: 'Loading real-time hospital operations data'
                })}
              >
                View Dashboard
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/opd-queue">
              <Button 
                className="border-2 border-white/30 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 px-8 py-4 text-lg"
                onClick={() => toast.info('Exploring Features...', {
                  description: 'Discover all City Health Sync capabilities'
                })}
              >
                Explore Features
              </Button>
            </Link>
          </div>

          {/* Emergency Alert Section */}
          <div className="mt-16 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="bg-red-600/20 backdrop-blur-md border border-red-500/30 rounded-2xl p-6 max-w-2xl mx-auto">
              <div className="flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-400 mr-2" />
                <h3 className="text-xl font-semibold text-white">Emergency Alert System</h3>
              </div>
              <p className="text-white/80 text-center mb-6">
                Click the 3D ambulance below to instantly alert nearby hospitals and available ambulances in case of emergency
              </p>
              <Ambulance3D onAlert={handleAmbulanceClick} />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-3xl font-display font-bold text-white mb-1">45%</div>
              <div className="text-sm text-white/60">Reduced Wait Times</div>
            </div>
            <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <Activity className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-3xl font-display font-bold text-white mb-1">Real-time</div>
              <div className="text-sm text-white/60">Bed Availability</div>
            </div>
            <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-3xl font-display font-bold text-white mb-1">12+</div>
              <div className="text-sm text-white/60">Hospitals Connected</div>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Alert Panel */}
      {showAlertPanel && (
        <EmergencyAlertPanel onClose={() => setShowAlertPanel(false)} />
      )}

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 rounded-full bg-white/50 animate-pulse-soft" />
        </div>
      </div>
    </section>
  );
};
