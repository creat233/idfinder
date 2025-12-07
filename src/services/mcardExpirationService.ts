import { supabase } from "@/integrations/supabase/client";

/**
 * Service pour gérer l'expiration automatique des MCards
 */
export const mcardExpirationService = {
  /**
   * Vérifie et met à jour le statut des MCards expirées via la fonction RPC
   */
  async checkAndUpdateExpiredMCards(): Promise<number> {
    try {
      console.log('🔍 Vérification des MCards expirées...');
      
      // Utiliser la fonction RPC pour mettre à jour les cartes expirées
      const { data, error } = await supabase.rpc('update_expired_mcards');
      
      if (error) {
        console.error('❌ Erreur lors de la mise à jour des MCards expirées:', error);
        return 0;
      }
      
      const count = data?.[0]?.updated_count || 0;
      if (count > 0) {
        console.log(`✅ ${count} MCard(s) expirée(s) mise(s) à jour avec succès`);
      } else {
        console.log('✅ Aucune MCard expirée à mettre à jour');
      }
      
      return count;
    } catch (error) {
      console.error('❌ Erreur inattendue lors de la vérification des expirations:', error);
      return 0;
    }
  },

  /**
   * Démarre la vérification périodique des MCards expirées
   * @param intervalMinutes - Intervalle en minutes entre chaque vérification (par défaut: 30 minutes)
   */
  startPeriodicCheck(intervalMinutes: number = 30): NodeJS.Timeout {
    console.log(`🕐 Démarrage de la vérification périodique (toutes les ${intervalMinutes} minutes)`);
    
    // Vérification immédiate
    this.checkAndUpdateExpiredMCards();
    
    // Vérification périodique
    return setInterval(() => {
      this.checkAndUpdateExpiredMCards();
    }, intervalMinutes * 60 * 1000);
  },

  /**
   * Vérifie si une MCard est expirée
   */
  isMCardExpired(expiresAt: string | null): boolean {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  }
};
