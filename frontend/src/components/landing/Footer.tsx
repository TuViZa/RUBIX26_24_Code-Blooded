import { Activity } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="py-12 bg-foreground text-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Activity className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-xl">MedSync</span>
            </Link>
            <p className="text-background/60 max-w-sm">
              Intelligent hospital operations platform for data-driven healthcare management at the city level.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2">
              <li><Link to="/dashboard" className="text-background/60 hover:text-background transition-colors">Dashboard</Link></li>
              <li><Link to="/opd-queue" className="text-background/60 hover:text-background transition-colors">OPD Queue</Link></li>
              <li><Link to="/beds" className="text-background/60 hover:text-background transition-colors">Bed Status</Link></li>
              <li><Link to="/blood-bank" className="text-background/60 hover:text-background transition-colors">Blood Bank</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-background/60 hover:text-background transition-colors">Documentation</a></li>
              <li><a href="#" className="text-background/60 hover:text-background transition-colors">API Reference</a></li>
              <li><a href="#" className="text-background/60 hover:text-background transition-colors">Support</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-background/10 text-center text-sm text-background/40">
          <p>© 2024 MedSync. Built for Healthier Cities.</p>
        </div>
      </div>
    </footer>
  );
};
