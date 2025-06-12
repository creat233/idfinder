
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Demo from "@/pages/Demo";
import NumeroUrgence from "@/pages/NumeroUrgence";
import Support from "@/pages/Support";
import Dashboard from "@/pages/Dashboard";
import SignalerCarte from "@/pages/SignalerCarte";
import MyCards from "@/pages/MyCards";
import Profile from "@/pages/Profile";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminRoute } from "@/components/AdminRoute";
import AdminPromoCodes from "@/pages/AdminPromoCodes";
import PromoCodes from "@/pages/PromoCodes";
import RechercheResultat from "@/pages/RechercheResultat";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Toaster />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/numeros-urgence" element={<NumeroUrgence />} />
          <Route path="/support" element={<Support />} />
          <Route path="/recherche-resultat" element={<RechercheResultat />} />
          
          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/signaler"
            element={
              <ProtectedRoute>
                <SignalerCarte />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mes-cartes"
            element={
              <ProtectedRoute>
                <MyCards />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/codes-promo"
            element={
              <ProtectedRoute>
                <PromoCodes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/promo-codes"
            element={
              <ProtectedRoute>
                <PromoCodes />
              </ProtectedRoute>
            }
          />
          
          {/* Admin routes */}
          <Route
            path="/admin/promo-codes"
            element={
              <AdminRoute>
                <AdminPromoCodes />
              </AdminRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
