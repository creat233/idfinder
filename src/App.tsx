
import { Toaster } from "@/components/ui/toaster";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import SignalerCarte from "./pages/SignalerCarte";
import Profile from "./pages/Profile";
import Support from "./pages/Support";
import About from "./pages/About";
import Login from "./pages/Login";
import NumeroUrgence from "./pages/NumeroUrgence";
import MyCards from "./pages/MyCards";
import PromoCodes from "./pages/PromoCodes";
import AdminPromoCodes from "./pages/AdminPromoCodes";
import Demo from "./pages/Demo";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminRoute } from "./components/AdminRoute";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/demo" element={<Demo />} />
            <Route 
              path="/dashboard" 
              element={
                <AdminRoute>
                  <Dashboard />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/codes-promo" 
              element={
                <ProtectedRoute>
                  <AdminPromoCodes />
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
              path="/codes-promo" 
              element={
                <ProtectedRoute>
                  <PromoCodes />
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
              path="/support" 
              element={
                <ProtectedRoute>
                  <Support />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/about" 
              element={
                <ProtectedRoute>
                  <About />
                </ProtectedRoute>
              } 
            />
            <Route path="/numeros-urgence" element={<NumeroUrgence />} />
          </Routes>
        </div>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
