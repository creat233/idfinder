import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface NewMCardRequest {
  mcardId: string;
  fullName: string;
  plan: string;
  slug: string;
  jobTitle?: string;
  company?: string;
  phoneNumber?: string;
  email?: string;
  description?: string;
  userId: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const adminEmail = Deno.env.get("ADMIN_NOTIFICATION_EMAIL") || "mouhamed110000@gmail.com";
    
    const mcardData: NewMCardRequest = await req.json();

    // Get user email from Supabase
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: userData } = await supabase.auth.admin.getUserById(mcardData.userId);
    const userEmail = userData?.user?.email || "Non disponible";

    // Format the date
    const now = new Date();
    const formattedDate = now.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Plan labels
    const planLabels: Record<string, string> = {
      free: "Gratuit",
      essential: "Essentiel (2000 FCFA/mois)",
      premium: "Premium (5000 FCFA/mois)",
      ultimate: "Ultimate"
    };

    const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif; background-color: #f4f4f9; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(102, 126, 234, 0.3);">
    
    <!-- Header -->
    <div style="padding: 30px; text-align: center; color: white;">
      <h1 style="margin: 0; font-size: 28px; font-weight: bold;">🎉 Nouvelle MCard créée !</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 14px;">${formattedDate}</p>
    </div>
    
    <!-- Content Card -->
    <div style="background: white; margin: 0 20px 20px 20px; border-radius: 12px; padding: 25px;">
      
      <!-- Profile Section -->
      <div style="text-align: center; margin-bottom: 25px; padding-bottom: 25px; border-bottom: 2px solid #f0f0f5;">
        <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center;">
          <span style="font-size: 32px; color: white; line-height: 80px;">${mcardData.fullName.charAt(0).toUpperCase()}</span>
        </div>
        <h2 style="margin: 0; color: #1a1a2e; font-size: 24px;">${mcardData.fullName}</h2>
        ${mcardData.jobTitle ? `<p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">${mcardData.jobTitle}</p>` : ''}
        ${mcardData.company ? `<p style="margin: 5px 0 0 0; color: #888; font-size: 13px;">${mcardData.company}</p>` : ''}
      </div>
      
      <!-- Info Grid -->
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f5;">
            <span style="color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">📋 Plan</span><br>
            <span style="color: #1a1a2e; font-size: 15px; font-weight: 600;">${planLabels[mcardData.plan] || mcardData.plan}</span>
          </td>
          <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f5; text-align: right;">
            <span style="color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">🔗 Slug</span><br>
            <span style="color: #667eea; font-size: 15px; font-weight: 600;">${mcardData.slug}</span>
          </td>
        </tr>
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f5;">
            <span style="color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">📧 Email utilisateur</span><br>
            <span style="color: #1a1a2e; font-size: 15px;">${userEmail}</span>
          </td>
          <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f5; text-align: right;">
            <span style="color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">📱 Téléphone carte</span><br>
            <span style="color: #1a1a2e; font-size: 15px;">${mcardData.phoneNumber || 'Non renseigné'}</span>
          </td>
        </tr>
        <tr>
          <td colspan="2" style="padding: 12px 0; border-bottom: 1px solid #f0f0f5;">
            <span style="color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">📩 Email carte</span><br>
            <span style="color: #1a1a2e; font-size: 15px;">${mcardData.email || 'Non renseigné'}</span>
          </td>
        </tr>
        ${mcardData.description ? `
        <tr>
          <td colspan="2" style="padding: 12px 0;">
            <span style="color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">📝 Description</span><br>
            <span style="color: #1a1a2e; font-size: 14px; line-height: 1.5;">${mcardData.description.substring(0, 200)}${mcardData.description.length > 200 ? '...' : ''}</span>
          </td>
        </tr>
        ` : ''}
      </table>
      
      <!-- CTA Button -->
      <div style="text-align: center; margin-top: 25px;">
        <a href="https://idfinder.lovable.app/mcard/${mcardData.slug}" 
           style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 14px 30px; border-radius: 25px; font-weight: 600; font-size: 14px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
          Voir la MCard →
        </a>
      </div>
      
      <!-- IDs -->
      <div style="margin-top: 25px; padding: 15px; background: #f8f8fc; border-radius: 8px;">
        <p style="margin: 0; color: #888; font-size: 11px;">
          <strong>MCard ID:</strong> ${mcardData.mcardId}<br>
          <strong>User ID:</strong> ${mcardData.userId}
        </p>
      </div>
    </div>
    
    <!-- Footer -->
    <div style="padding: 20px; text-align: center;">
      <p style="margin: 0; color: rgba(255,255,255,0.8); font-size: 12px;">
        FinderID MCard System • Notification automatique
      </p>
    </div>
  </div>
</body>
</html>
    `;

    const emailResponse = await resend.emails.send({
      from: "FinderID <noreply@resend.dev>",
      to: [adminEmail],
      subject: `🆕 Nouvelle MCard: ${mcardData.fullName} (${planLabels[mcardData.plan] || mcardData.plan})`,
      html: htmlContent,
    });

    console.log("New MCard notification email sent:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in notify-new-mcard function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
