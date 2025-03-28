
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MedicationProvider } from "@/context/MedicationContext";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "next-themes";

// Pages
import Index from "./pages/Index";
import Medications from "./pages/Medications";
import Chat from "./pages/Chat";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import PharmacyLocator from "./pages/PharmacyLocator";
import HealthMetrics from "./pages/HealthMetrics";
import Appointments from "./pages/Appointments";

// Add Framer Motion
import { MotionConfig } from 'framer-motion';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <MotionConfig reducedMotion="user">
          <BrowserRouter>
            <AuthProvider>
              <MedicationProvider>
                <Toaster />
                <Sonner position="top-center" expand={true} closeButton={true} richColors={true} />
                <AnimatePresence mode="wait">
                  <Routes>
                    <Route path="/auth" element={<Auth />} />
                    <Route 
                      path="/" 
                      element={
                        <ProtectedRoute>
                          <Index />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/medications" 
                      element={
                        <ProtectedRoute>
                          <Medications />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/chat" 
                      element={
                        <ProtectedRoute>
                          <Chat />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/settings" 
                      element={
                        <ProtectedRoute>
                          <Settings />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/pharmacy-locator" 
                      element={
                        <ProtectedRoute>
                          <PharmacyLocator />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/health-metrics" 
                      element={
                        <ProtectedRoute>
                          <HealthMetrics />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/appointments" 
                      element={
                        <ProtectedRoute>
                          <Appointments />
                        </ProtectedRoute>
                      } 
                    />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </AnimatePresence>
              </MedicationProvider>
            </AuthProvider>
          </BrowserRouter>
        </MotionConfig>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
