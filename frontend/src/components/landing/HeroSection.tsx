import { Button } from "@/components/ui/button";
import { ArrowRight, Activity, Building2, Users } from "lucide-react";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen bg-gradient-hero overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary) / 0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="container relative mx-auto px-4 pt-32 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-8 animate-fade-in">
            <Activity className="w-4 h-4" />
            <span className="text-sm font-medium">Intelligent Hospital Operations</span>
          </div>

          {/* Heading */}
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight animate-slide-up">
            Syncing Hospital Operations for a{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Healthier City
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-primary-foreground/70 max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Real-time patient flow management, resource optimization, and city-wide healthcare coordination powered by intelligent data analytics.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link to="/dashboard">
              <Button variant="hero" size="xl">
                View Dashboard
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/opd-queue">
              <Button variant="heroOutline" size="xl">
                Explore Features
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="p-6 rounded-2xl bg-card/5 backdrop-blur-sm border border-primary-foreground/10">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div className="text-3xl font-display font-bold text-primary-foreground mb-1">45%</div>
              <div className="text-sm text-primary-foreground/60">Reduced Wait Times</div>
            </div>
            <div className="p-6 rounded-2xl bg-card/5 backdrop-blur-sm border border-primary-foreground/10">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mx-auto mb-4">
                <Activity className="w-6 h-6 text-accent" />
              </div>
              <div className="text-3xl font-display font-bold text-primary-foreground mb-1">Real-time</div>
              <div className="text-sm text-primary-foreground/60">Bed Availability</div>
            </div>
            <div className="p-6 rounded-2xl bg-card/5 backdrop-blur-sm border border-primary-foreground/10">
              <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-6 h-6 text-success" />
              </div>
              <div className="text-3xl font-display font-bold text-primary-foreground mb-1">12+</div>
              <div className="text-sm text-primary-foreground/60">Hospitals Connected</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 rounded-full bg-primary-foreground/50 animate-pulse-soft" />
        </div>
      </div>
    </section>
  );
};
