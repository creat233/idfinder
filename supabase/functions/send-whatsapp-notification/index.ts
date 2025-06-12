
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.47.16'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WhatsAppRequest {
  phone: string;
  message: string;
  promoCode: string;
  userName: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { phone, message, promoCode, userName }: WhatsAppRequest = await req.json();

    console.log(`Envoi de notification WhatsApp pour le code ${promoCode} à ${phone}`);

    // Message personnalisé pour l'utilisateur
    const userMessage = `🎉 Félicitations ${userName}!\n\nVotre code promo ${promoCode} a été généré avec succès.\n\n📋 Statut: En attente de validation\n⏰ Notre équipe va examiner votre demande sous peu.\n\n✅ Une fois validé, vous recevrez une confirmation et pourrez commencer à utiliser votre code.\n\nMerci de votre confiance!\n- Équipe FinderID`;

    // Message pour l'administration
    const adminMessage = `🔔 Nouveau code promo généré!\n\n👤 Utilisateur: ${userName}\n📱 Téléphone: ${phone}\n🎫 Code: ${promoCode}\n📅 Date: ${new Date().toLocaleDateString('fr-FR')}\n\n⚠️ Action requise: Validation en attente sur l'interface d'administration.\n\n🔗 Accédez à l'admin pour valider: https://votre-app.com/admin/codes-promo`;

    // Simuler l'envoi WhatsApp (en production, vous utiliseriez l'API WhatsApp Business)
    console.log("Message utilisateur:", userMessage);
    console.log("Message admin:", adminMessage);

    // En production, vous utiliseriez une API comme Twilio WhatsApp ou WhatsApp Business API
    // Exemple avec Twilio (à décommenter et configurer):
    /*
    const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const twilioWhatsAppNumber = Deno.env.get('TWILIO_WHATSAPP_NUMBER');
    const adminWhatsAppNumber = Deno.env.get('ADMIN_WHATSAPP_NUMBER');

    if (twilioAccountSid && twilioAuthToken) {
      // Envoyer à l'utilisateur
      await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${twilioAccountSid}:${twilioAuthToken}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          From: `whatsapp:${twilioWhatsAppNumber}`,
          To: `whatsapp:${phone}`,
          Body: userMessage,
        }),
      });

      // Envoyer à l'admin
      if (adminWhatsAppNumber) {
        await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${btoa(`${twilioAccountSid}:${twilioAuthToken}`)}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            From: `whatsapp:${twilioWhatsAppNumber}`,
            To: `whatsapp:${adminWhatsAppNumber}`,
            Body: adminMessage,
          }),
        });
      }
    }
    */

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Notifications WhatsApp envoyées avec succès',
        userMessage,
        adminMessage 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Erreur lors de l\'envoi WhatsApp:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Erreur lors de l\'envoi des notifications WhatsApp',
        details: error.message 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
