import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { mcardId, mcardName, plan, userEmail, userPhone, expirationDate } = await req.json();

    if (!mcardId || !mcardName) {
      return new Response(JSON.stringify({ error: "Données manquantes" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const planLabel = plan === 'premium' ? 'Premium (5 000 FCFA/mois)' : 'Essentiel (2 000 FCFA/mois)';
    const formattedDate = expirationDate 
      ? new Date(expirationDate).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
      : 'Non définie';

    const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:20px;">
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#1e40af,#7c3aed);border-radius:16px 16px 0 0;padding:32px;text-align:center;">
      <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:700;">🔄 Demande de Réactivation</h1>
      <p style="color:#e0e7ff;margin:8px 0 0;font-size:14px;">FinderID - MCard Platform</p>
    </div>

    <!-- Content -->
    <div style="background:#ffffff;padding:32px;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
      <div style="background:#fef3c7;border:1px solid #fbbf24;border-radius:12px;padding:16px;margin-bottom:24px;">
        <p style="margin:0;color:#92400e;font-weight:600;font-size:15px;">⚠️ Un utilisateur souhaite réactiver sa MCard expirée</p>
      </div>

      <h2 style="color:#1e293b;font-size:18px;margin:0 0 20px;border-bottom:2px solid #e2e8f0;padding-bottom:12px;">📋 Informations de la demande</h2>
      
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        <tr>
          <td style="padding:12px 16px;background:#f8fafc;border:1px solid #e2e8f0;font-weight:600;color:#475569;width:40%;">Nom de la carte</td>
          <td style="padding:12px 16px;border:1px solid #e2e8f0;color:#1e293b;font-weight:700;">${mcardName}</td>
        </tr>
        <tr>
          <td style="padding:12px 16px;background:#f8fafc;border:1px solid #e2e8f0;font-weight:600;color:#475569;">Plan</td>
          <td style="padding:12px 16px;border:1px solid #e2e8f0;color:#1e293b;">${planLabel}</td>
        </tr>
        <tr>
          <td style="padding:12px 16px;background:#f8fafc;border:1px solid #e2e8f0;font-weight:600;color:#475569;">Email</td>
          <td style="padding:12px 16px;border:1px solid #e2e8f0;color:#1e293b;">${userEmail || 'Non renseigné'}</td>
        </tr>
        <tr>
          <td style="padding:12px 16px;background:#f8fafc;border:1px solid #e2e8f0;font-weight:600;color:#475569;">Téléphone</td>
          <td style="padding:12px 16px;border:1px solid #e2e8f0;color:#1e293b;">${userPhone || 'Non renseigné'}</td>
        </tr>
        <tr>
          <td style="padding:12px 16px;background:#f8fafc;border:1px solid #e2e8f0;font-weight:600;color:#475569;">Date d'expiration</td>
          <td style="padding:12px 16px;border:1px solid #e2e8f0;color:#ef4444;font-weight:600;">${formattedDate}</td>
        </tr>
        <tr>
          <td style="padding:12px 16px;background:#f8fafc;border:1px solid #e2e8f0;font-weight:600;color:#475569;">Date de demande</td>
          <td style="padding:12px 16px;border:1px solid #e2e8f0;color:#1e293b;">${new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
        </tr>
      </table>

      <div style="background:linear-gradient(135deg,#eff6ff,#f5f3ff);border-radius:12px;padding:20px;text-align:center;">
        <p style="margin:0;color:#1e40af;font-weight:600;font-size:15px;">💡 Action requise</p>
        <p style="margin:8px 0 0;color:#475569;font-size:13px;">Connectez-vous au panneau d'administration pour traiter cette demande de réactivation.</p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#1e293b;border-radius:0 0 16px 16px;padding:24px;text-align:center;">
      <p style="color:#94a3b8;margin:0;font-size:12px;">© ${new Date().getFullYear()} FinderID - Plateforme MCard</p>
      <p style="color:#64748b;margin:8px 0 0;font-size:11px;">Email automatique - Ne pas répondre</p>
    </div>
  </div>
</body>
</html>`;

    const emailResponse = await resend.emails.send({
      from: "FinderID <notifications@resend.dev>",
      to: ["mouhamed110000@gmail.com"],
      subject: `🔄 Demande de réactivation MCard - ${mcardName}`,
      html: htmlContent,
    });

    console.log("✅ Reactivation email sent:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailId: emailResponse.id }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("❌ Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
