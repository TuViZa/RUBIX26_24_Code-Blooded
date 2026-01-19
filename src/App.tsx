import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FirebaseAuthProvider } from "@/contexts/FirebaseAuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import { Login } from "./pages/Login";
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
import { PatientPortal } from "./pages/PatientPortal";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <FirebaseAuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/patient-portal" element={
              <ProtectedRoute requiredRole="patient">
                <PatientPortal />
              </ProtectedRoute>
            } />
            <Route path="/command-center" element={
              <ProtectedRoute requiredRole="admin">
                <CommandCenter />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/opd-queue" element={
              <ProtectedRoute requiredPermission="canManageOPD">
                <OPDQueue />
              </ProtectedRoute>
            } />
            <Route path="/beds" element={
              <ProtectedRoute requiredPermission="canManageBeds">
                <BedStatus />
              </ProtectedRoute>
            } />
            <Route path="/blood-bank" element={
              <ProtectedRoute requiredPermission="canManageBloodBank">
                <BloodBank />
              </ProtectedRoute>
            } />
            <Route path="/admission" element={
              <ProtectedRoute requiredPermission="canManagePatients">
                <Admission />
              </ProtectedRoute>
            } />
            <Route path="/network" element={
              <ProtectedRoute requiredPermission="canViewReports">
                <HospitalNetwork />
              </ProtectedRoute>
            } />
            <Route path="/inventory" element={
              <ProtectedRoute requiredPermission="canManageInventory">
                <Inventory />
              </ProtectedRoute>
            } />
            <Route path="/interventions" element={
              <ProtectedRoute requiredRole="admin">
                <Interventions />
              </ProtectedRoute>
            } />
            <Route path="/patient-flow" element={
              <ProtectedRoute requiredPermission="canViewReports">
                <PatientFlow />
              </ProtectedRoute>
            } />
            <Route path="/load-detection" element={
              <ProtectedRoute requiredRole="admin">
                <LoadDetection />
              </ProtectedRoute>
            } />
            <Route path="/resilience" element={
              <ProtectedRoute requiredRole="admin">
                <Resilience />
              </ProtectedRoute>
            } />
            <Route path="/heatmap" element={
              <ProtectedRoute requiredPermission="canViewAnalytics">
                <CityHeatmap />
              </ProtectedRoute>
            } />
            <Route path="/resource-decay" element={
              <ProtectedRoute requiredRole="admin">
                <ResourceDecay />
              </ProtectedRoute>
            } />
            <Route path="/ambulance-detection" element={
              <ProtectedRoute requiredPermission="canManageAmbulance">
                <AmbulanceDetection />
              </ProtectedRoute>
            } />
            <Route path="/outbreak-detection" element={
              <ProtectedRoute requiredRole="admin">
                <OutbreakDetection />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </FirebaseAuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
