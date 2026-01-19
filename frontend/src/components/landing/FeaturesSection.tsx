import { 
  Users, 
  Bed, 
  ClipboardList, 
  Building2, 
  Package, 
  LayoutDashboard,
  Droplets,
  ArrowRight,
  Lightbulb,
  GitBranch,
  AlertTriangle,
  Shield,
  Map,
  Trash2,
  Ambulance,
  Bug
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Users,
    title: "Dynamic OPD Queue Management",
    description: "Real-time patient check-in prioritization using historical averages to reduce wait times and congestion.",
    color: "primary",
    link: "/opd-queue"
  },
  {
    icon: Bed,
    title: "Live Bed Availability",
    description: "Current bed occupancy by department with admission/discharge updates for immediate visibility.",
    color: "accent",
    link: "/beds"
  },
  {
    icon: ClipboardList,
    title: "Rule-Based Admission Workflow",
    description: "Guided intake process matching patient requirements to available beds using predefined rules.",
    color: "success",
    link: "/admission"
  },
  {
    icon: Building2,
    title: "Inter-Hospital Capacity Sharing",
    description: "Anonymized bed availability and patient load data APIs for central city health dashboard integration.",
    color: "primary",
    link: "/network"
  },
  {
    icon: Package,
    title: "Inventory Usage Tracking",
    description: "Medicine and consumable monitoring with low-stock alerts and consumption trend analysis.",
    color: "warning",
    link: "/inventory"
  },
  {
    icon: Droplets,
    title: "Blood Bank Management",
    description: "Track blood inventory, manage donations, and share availability across the hospital network.",
    color: "critical",
    link: "/blood-bank"
  },
  {
    icon: Lightbulb,
    title: "Micro-Interventions",
    description: "AI-driven small-scale interventions to optimize patient flow and resource allocation in real-time.",
    color: "primary",
    link: "/interventions"
  },
  {
    icon: GitBranch,
    title: "City Patient Flow Analytics",
    description: "Track patient movement patterns across hospitals to identify bottlenecks and optimize referral networks.",
    color: "accent",
    link: "/patient-flow"
  },
  {
    icon: AlertTriangle,
    title: "Early Load Detection",
    description: "Predictive analytics to anticipate hospital capacity issues before they impact patient care.",
    color: "warning",
    link: "/load-detection"
  },
  {
    icon: Shield,
    title: "Resilience Index",
    description: "Comprehensive metrics to measure hospital system preparedness and response capabilities.",
    color: "success",
    link: "/resilience"
  },
  {
    icon: Map,
    title: "City Health Heatmap",
    description: "Geographic visualization of health metrics and resource distribution across the city.",
    color: "critical",
    link: "/heatmap"
  },
  {
    icon: Trash2,
    title: "Resource Decay & Waste Predictor",
    description: "Predicts unused or expiring resources by tracking usage velocity and flags medicines/equipment at risk of wastage.",
    color: "warning",
    link: "/resource-decay"
  },
  {
    icon: Ambulance,
    title: "Dynamic Ambulance Detection",
    description: "Real-time tracking and optimization of ambulance fleet deployment for emergency response efficiency.",
    color: "primary",
    link: "/ambulance-detection"
  },
  {
    icon: Bug,
    title: "Disease Outbreak Detection",
    description: "Annual and seasonal disease pattern analysis to predict and prepare for potential health outbreaks.",
    color: "critical",
    link: "/outbreak-detection"
  },
];

const colorMap = {
  primary: "bg-primary/10 text-primary",
  accent: "bg-accent/10 text-accent",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  critical: "bg-critical/10 text-critical",
};

export const FeaturesSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Comprehensive Hospital Management
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to optimize hospital operations and improve patient care
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Link
              key={feature.title}
              to={feature.link}
              className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-medium animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110",
                colorMap[feature.color as keyof typeof colorMap]
              )}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {feature.description}
              </p>
              <div className="flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Learn more <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
