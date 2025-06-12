
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff } from "lucide-react";

export const ConnectionStatus = () => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const checkConnection = () => {
      setIsConnected(navigator.onLine);
    };

    // Vérifier la connexion Supabase
    const testConnection = async () => {
      try {
        await supabase.from('profiles').select('count').limit(1);
        setIsConnected(true);
      } catch (error) {
        console.warn("Connexion Supabase instable:", error);
        setIsConnected(false);
      }
    };

    window.addEventListener('online', checkConnection);
    window.addEventListener('offline', checkConnection);
    
    // Test initial
    testConnection();
    
    // Test périodique
    const interval = setInterval(testConnection, 30000);

    return () => {
      window.removeEventListener('online', checkConnection);
      window.removeEventListener('offline', checkConnection);
      clearInterval(interval);
    };
  }, []);

  if (isConnected) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <Badge variant="destructive" className="flex items-center gap-2">
        <WifiOff className="h-3 w-3" />
        Connexion instable
      </Badge>
    </div>
  );
};
