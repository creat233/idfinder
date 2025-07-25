/**
 * Utilitaire pour nettoyer l'état d'authentification et prévenir les problèmes de session
 */

export const cleanupAuthState = () => {
  try {
    // Nettoyer localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });

    // Nettoyer sessionStorage si disponible
    if (typeof sessionStorage !== 'undefined') {
      Object.keys(sessionStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          sessionStorage.removeItem(key);
        }
      });
    }

    console.log('🧹 État d\'authentification nettoyé');
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage de l\'état d\'authentification:', error);
  }
};

export const robustSignOut = async (supabase: any) => {
  try {
    // Nettoyer d'abord l'état local
    cleanupAuthState();
    
    // Tentative de déconnexion globale
    await supabase.auth.signOut({ scope: 'global' });
    
    console.log('✅ Déconnexion réussie');
    
    // Forcer le rechargement de la page pour un état propre
    setTimeout(() => {
      window.location.href = '/';
    }, 100);
    
  } catch (error) {
    console.error('❌ Erreur lors de la déconnexion:', error);
    // Forcer le rechargement même en cas d'erreur
    window.location.href = '/';
  }
};