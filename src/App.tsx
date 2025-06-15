
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminRoute } from "@/components/AdminRoute";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import Login from "./pages/Login";
import SignalerCarte from "./pages/SignalerCarte";
import RechercheResultat from "./pages/RechercheResultat";
import Profile from "./pages/Profile";
import MyCards from "./pages/MyCards";
import PromoCodes from "./pages/PromoCodes";
import AdminPromoCodes from "./pages/AdminPromoCodes";
import NumeroUrgence from "./pages/NumeroUrgence";
import Support from "./pages/Support";
import Demo from "./pages/Demo";
import About from "./pages/About";
import Notifications from "./pages/Notifications";
import { TranslationProvider } from "@/providers/TranslationProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import ScrollToTop from "@/components/ScrollToTop";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TranslationProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/demo" element={<Demo />} />
                <Route path="/about" element={<About />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/login" element={<Login />} />
                <Route path="/urgence" element={<NumeroUrgence />} />
                <Route path="/numeros-urgence" element={<NumeroUrgence />} />
                <Route path="/support" element={<Support />} />
                <Route path="/recherche/:cardNumber" element={<RechercheResultat />} />
                
                {/* Routes protégées pour utilisateurs normaux */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/signaler" element={
                  <ProtectedRoute>
                    <SignalerCarte />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/mes-cartes" element={
                  <ProtectedRoute>
                    <MyCards />
                  </ProtectedRoute>
                } />
                <Route path="/codes-promo" element={
                  <ProtectedRoute>
                    <PromoCodes />
                  </ProtectedRoute>
                } />
                
                {/* Routes d'administration */}
                <Route path="/admin/codes-promo" element={
                  <AdminRoute>
                    <AdminPromoCodes />
                  </AdminRoute>
                } />
                <Route path="/notifications" element={
                  <ProtectedRoute>
                    <Notifications />
                  </ProtectedRoute>
                } />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </TranslationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
