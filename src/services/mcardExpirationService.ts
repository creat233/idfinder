import { supabase } from "@/integrations/supabase/client";

/**
 * Service pour gérer l'expiration automatique des MCards
 */
export const mcardExpirationService = {
  /**
   * Vérifie et met à jour le statut des MCards expirées
   */
  async checkAndUpdateExpiredMCards(): Promise<void> {
    try {
      console.log('🔍 Vérification des MCards expirées...');
      
      // Mettre à jour les cartes dont la date d'expiration est passée
      // et qui ont encore le statut 'active' ou 'trial'
      const { error: updateError, data } = await supabase
        .from('mcards')
        .update({ subscription_status: 'expired' })
        .lt('subscription_expires_at', new Date().toISOString())
        .in('subscription_status', ['active', 'trial'])
        .select();
      
      if (updateError) {
        console.error('❌ Erreur lors de la mise à jour des MCards expirées:', updateError);
      } else {
        const count = data?.length || 0;
        if (count > 0) {
          console.log(`✅ ${count} MCard(s) expirée(s) mise(s) à jour avec succès`);
        } else {
          console.log('✅ Aucune MCard expirée à mettre à jour');
        }
      }
    } catch (error) {
      console.error('❌ Erreur inattendue lors de la vérification des expirations:', error);
    }
  },

  /**
   * Démarre la vérification périodique des MCards expirées
   * @param intervalMinutes - Intervalle en minutes entre chaque vérification (par défaut: 60 minutes)
   */
  startPeriodicCheck(intervalMinutes: number = 60): NodeJS.Timeout {
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
