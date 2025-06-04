
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AnimatePresence, motion } from "framer-motion";
import Index from "./pages/Index";
import Demo from "./pages/Demo";
import SignalerCarte from "./pages/SignalerCarte";
import Profile from "./pages/Profile";
import Support from "./pages/Support";
import NumeroUrgence from "./pages/NumeroUrgence";
import About from "./pages/About";
import Login from "./pages/Login";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const mounted = useRef(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (mounted.current) {
        setSession(session);
        setLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted.current) {
        setSession(session);
      }
    });

    return () => {
      mounted.current = false;
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return null;
  }

  if (!session) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const AuthenticatedRedirect = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const mounted = useRef(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (mounted.current) {
        setSession(session);
        setLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted.current) {
        setSession(session);
      }
    });

    return () => {
      mounted.current = false;
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return null;
  }

  // Only redirect to home if user is on login page and is authenticated
  if (session && window.location.pathname === '/login') {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-white flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center space-y-4"
              >
                <motion.img
                  src="/lovable-uploads/66a0985b-99e7-45ba-8ba3-0573e2b2ad29.png"
                  alt="Logo"
                  className="w-24 h-24"
                  initial={{ rotate: -180, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
                <motion.div
                  className="text-4xl font-bold text-primary"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  Sama Pièce
                </motion.div>
              </motion.div>
            </motion.div>
          ) : (
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<AuthenticatedRedirect><Login /></AuthenticatedRedirect>} />
                <Route path="/demo" element={<Demo />} />
                <Route path="/signaler" element={<ProtectedRoute><SignalerCarte /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/support" element={<ProtectedRoute><Support /></ProtectedRoute>} />
                <Route path="/numeros-urgence" element={<ProtectedRoute><NumeroUrgence /></ProtectedRoute>} />
                <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
              </Routes>
            </BrowserRouter>
          )}
        </AnimatePresence>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
