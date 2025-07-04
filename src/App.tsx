
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TranslationProvider } from "./providers/TranslationProvider";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { useAutoRefresh } from "./hooks/useAutoRefresh";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MyCards from "./pages/MyCards";
import Profile from "./pages/Profile";
import Support from "./pages/Support";
import SignalerCarte from "./pages/SignalerCarte";
import RechercheResultat from "./pages/RechercheResultat";
import NumeroUrgence from "./pages/NumeroUrgence";
import Notifications from "./pages/Notifications";
import PromoCodes from "./pages/PromoCodes";
import Demo from "./pages/Demo";
import About from "./pages/About";
import MCards from "./pages/MCards";
import MCardView from "./pages/MCardView";
import AdminPromoCodes from "./pages/AdminPromoCodes";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function AutoRefreshWrapper() {
  // Auto-refresh toutes les 2 minutes pour maintenir l'app à jour
  useAutoRefresh(120000);
  return null;
}

function AppContent() {
  return (
    <QueryClientProvider client={queryClient}>
      <TranslationProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AutoRefreshWrapper />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/my-cards" element={<MyCards />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/support" element={<Support />} />
              <Route path="/signaler-carte" element={<SignalerCarte />} />
              <Route path="/recherche-resultat" element={<RechercheResultat />} />
              <Route path="/numero-urgence" element={<NumeroUrgence />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/codes-promo" element={<PromoCodes />} />
              <Route path="/demo" element={<Demo />} />
              <Route path="/about" element={<About />} />
              <Route path="/mcards" element={<MCards />} />
              <Route path="/mcard/:slug" element={<MCardView />} />
              <Route path="/m/:slug" element={<MCardView />} />
              <Route path="/admin/codes-promo" element={<AdminPromoCodes />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </TranslationProvider>
    </QueryClientProvider>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}

export default App;
