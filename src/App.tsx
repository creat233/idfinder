
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TranslationProvider } from "./providers/TranslationProvider";
import { CartProvider } from "./contexts/CartContext";
import { HelmetProvider } from "react-helmet-async";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { useAutoRefresh } from "./hooks/useAutoRefresh";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MyCards from "./pages/MyCards";
import Profile from "./pages/Profile";
import Support from "./pages/Support";
import SignalerCarte from "./pages/SignalerCarte";
import RechercheResultat from "./pages/RechercheResultat";
import NumeroUrgence from "./pages/NumeroUrgence";
import PromoCodes from "./pages/PromoCodes";
import Demo from "./pages/Demo";
import About from "./pages/About";
import MCards from "./pages/MCards";
import MCardView from "./pages/MCardView";
import AdminPromoCodes from "./pages/AdminPromoCodes";
import AdminExpiredCards from "./pages/AdminExpiredCards";
import AdminLegal from "./pages/AdminLegal";
import AdminMessages from "./pages/AdminMessages";
import VerifiedMCards from "./pages/VerifiedMCards";
import MyFavorites from "./pages/MyFavorites";
import Messages from "./pages/Messages";
import Cart from "./pages/Cart";
import { StatusView } from "./pages/StatusView";
import VerificationRequest from "./pages/VerificationRequest";
import Notifications from "./pages/Notifications";
import { MobileBottomNav } from "./components/MobileBottomNav";

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
  const [isInConversation, setIsInConversation] = useState(false);
  
  useEffect(() => {
    // Écouter les changements de state des conversations
    const handleConversationChange = (event: CustomEvent) => {
      setIsInConversation(event.detail.hasSelectedConversation);
    };
    
    window.addEventListener('conversationStateChange', handleConversationChange as EventListener);
    return () => window.removeEventListener('conversationStateChange', handleConversationChange as EventListener);
  }, []);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
      <TranslationProvider>
        <CartProvider>
          <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AutoRefreshWrapper />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/my-cards" element={<MyCards />} />
              <Route path="/mes-cartes" element={<MyCards />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/support" element={<Support />} />
              <Route path="/signaler-carte" element={<SignalerCarte />} />
              <Route path="/signaler" element={<SignalerCarte />} />
              <Route path="/recherche-resultat" element={<RechercheResultat />} />
              <Route path="/recherche/:cardNumber" element={<RechercheResultat />} />
              <Route path="/numero-urgence" element={<NumeroUrgence />} />
              <Route path="/numeros-urgence" element={<NumeroUrgence />} />
              <Route path="/urgence" element={<NumeroUrgence />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/codes-promo" element={<PromoCodes />} />
              <Route path="/demo" element={<Demo />} />
              <Route path="/about" element={<About />} />
              <Route path="/mcards" element={<MCards />} />
              <Route path="/mcard/:slug" element={<MCardView />} />
              <Route path="/m/:slug" element={<MCardView />} />
              <Route path="/admin/codes-promo" element={<AdminPromoCodes />} />
              <Route path="/admin/cartes-expirees" element={<AdminExpiredCards />} />
              <Route path="/admin/juridique" element={<AdminLegal />} />
              <Route path="/admin/messages" element={<AdminMessages />} />
              <Route path="/mcards-verifiees" element={<VerifiedMCards />} />
              <Route path="/mes-favoris" element={<MyFavorites />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/panier" element={<Cart />} />
              <Route path="/status/:statusId" element={<StatusView />} />
              <Route path="/verification-request" element={<VerificationRequest />} />
            </Routes>
            {!isInConversation && <MobileBottomNav />}
          </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </TranslationProvider>
    </QueryClientProvider>
    </HelmetProvider>
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
