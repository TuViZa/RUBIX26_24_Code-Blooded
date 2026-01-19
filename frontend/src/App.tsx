import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CommandCenter from "./pages/CommandCenter";
import Dashboard from "./pages/Dashboard";
import OPDQueue from "./pages/OPDQueue";
import BedStatus from "./pages/BedStatus";
import BloodBank from "./pages/BloodBank";
import Admission from "./pages/Admission";
import HospitalNetwork from "./pages/HospitalNetwork";
import Inventory from "./pages/Inventory";
import Interventions from "./pages/Interventions";
import PatientFlow from "./pages/PatientFlow";
import LoadDetection from "./pages/LoadDetection";
import Resilience from "./pages/Resilience";
import CityHeatmap from "./pages/CityHeatmap";
import ResourceDecay from "./pages/ResourceDecay";
import AmbulanceDetection from "./pages/AmbulanceDetection";
import OutbreakDetection from "./pages/OutbreakDetection";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/command-center" element={<CommandCenter />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/opd-queue" element={<OPDQueue />} />
          <Route path="/beds" element={<BedStatus />} />
          <Route path="/blood-bank" element={<BloodBank />} />
          <Route path="/admission" element={<Admission />} />
          <Route path="/network" element={<HospitalNetwork />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/interventions" element={<Interventions />} />
          <Route path="/patient-flow" element={<PatientFlow />} />
          <Route path="/load-detection" element={<LoadDetection />} />
          <Route path="/resilience" element={<Resilience />} />
          <Route path="/heatmap" element={<CityHeatmap />} />
          <Route path="/resource-decay" element={<ResourceDecay />} />
          <Route path="/ambulance-detection" element={<AmbulanceDetection />} />
          <Route path="/outbreak-detection" element={<OutbreakDetection />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
