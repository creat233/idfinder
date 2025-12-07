import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.47.16';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. D'abord, mettre à jour les cartes expirées (subscription_expires_at passé)
    const { data: expiredData, error: expiredError } = await supabase.rpc('update_expired_mcards');
    
    if (expiredError) {
      console.error('❌ Erreur lors de la mise à jour des cartes expirées:', expiredError);
    } else {
      const expiredCount = expiredData?.[0]?.updated_count || 0;
      console.log(`✅ ${expiredCount} carte(s) expirée(s) mise(s) à jour`);
    }

    // 2. Ensuite, supprimer les cartes inactives depuis plus de 2 mois
    const { error: deleteError } = await supabase.rpc('delete_inactive_mcards');

    if (deleteError) {
      console.error('❌ Erreur lors de la suppression des cartes inactives:', deleteError);
      throw deleteError;
    }

    console.log('✅ Cartes inactives supprimées avec succès');

    // 3. Envoyer les notifications d'expiration du jour
    const { data: expiringData, error: expiringError } = await supabase.rpc('send_expiring_today_notifications');
    
    if (expiringError) {
      console.error('❌ Erreur lors de l\'envoi des notifications d\'expiration:', expiringError);
    } else {
      const notificationCount = expiringData?.[0]?.notifications_sent || 0;
      console.log(`✅ ${notificationCount} notification(s) d'expiration envoyée(s)`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Nettoyage des cartes terminé',
        expired_updated: expiredData?.[0]?.updated_count || 0
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Erreur:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
