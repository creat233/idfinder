import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

/**
 * Hook centralisé pour gérer l'état d'authentification de manière cohérente
 */
export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const updateAuthState = useCallback((newSession: Session | null) => {
    setSession(newSession);
    setUser(newSession?.user ?? null);
    
    console.log('🔄 État d\'authentification mis à jour:', {
      hasSession: !!newSession,
      hasUser: !!newSession?.user,
      userEmail: newSession?.user?.email
    });
  }, []);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Configurer le listener d'abord
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            if (!mounted) return;
            
            console.log('🔄 Changement d\'état d\'authentification:', event);
            
            // Mettre à jour l'état de manière synchrone
            updateAuthState(session);
            
            // Pas d'appels Supabase supplémentaires ici pour éviter les deadlocks
            if (event === 'SIGNED_OUT') {
              setLoading(false);
            }
          }
        );

        // Ensuite vérifier la session existante
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Erreur lors de la récupération de la session:', error);
        }
        
        if (mounted) {
          updateAuthState(session);
          setLoading(false);
          setInitialized(true);
        }

        return subscription;
      } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation de l\'authentification:', error);
        if (mounted) {
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    const subscription = initializeAuth();

    return () => {
      mounted = false;
      subscription.then(sub => sub?.unsubscribe());
    };
  }, [updateAuthState]);

  return {
    user,
    session,
    loading,
    initialized,
    isAuthenticated: !!user && !!session
  };
};