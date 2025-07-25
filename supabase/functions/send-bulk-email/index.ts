import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";
import { generatePromoEmailHtml } from "./promo-email-template.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing Authorization header");
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );
    
    const { data: { user } } = await supabaseClient.auth.getUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    const { data: isAdmin, error: isAdminError } = await supabaseClient.rpc('is_admin');
    if (isAdminError || !isAdmin) {
      return new Response(JSON.stringify({ error: "Permission denied. Admin access required." }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { subject, htmlContent } = await req.json();
    if (!subject || !htmlContent) {
      return new Response(JSON.stringify({ error: "Subject and htmlContent are required." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { autoRefreshToken: false, persistSession: false } }
    );
    
    const allUsers = [];
    let page = 1;
    const perPage = 1000; // Max users per page, as per Supabase limit

    while (true) {
      const { data: { users }, error: usersError } = await supabaseAdmin.auth.admin.listUsers({
        page,
        perPage,
      });

      if (usersError) {
        throw usersError;
      }

      if (users.length > 0) {
        allUsers.push(...users);
        page++;
      } else {
        // No more users to fetch
        break;
      }
    }

    const recipientEmails = allUsers.map(u => u.email).filter(Boolean) as string[];

    if (recipientEmails.length === 0) {
      return new Response(JSON.stringify({ message: "No users to send email to." }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Preparing to send email to ${recipientEmails.length} users in chunks.`);

    const finalHtml = generatePromoEmailHtml({ subject, userHtmlContent: htmlContent });
    const chunkSize = 49; // Resend limit is 50, using 49 to be safe
    const fromEmail = Deno.env.get("RESEND_FROM_EMAIL") ?? "FinderID <notifications@resend.dev>";
    const errors: string[] = [];

    for (let i = 0; i < recipientEmails.length; i += chunkSize) {
      const chunk = recipientEmails.slice(i, i + chunkSize);
      console.log(`Sending chunk ${Math.floor(i / chunkSize) + 1} of ${Math.ceil(recipientEmails.length / chunkSize)}: ${chunk.length} recipients.`);

      try {
        const { error: sendError } = await resend.emails.send({
          from: fromEmail,
          to: "notifications@resend.dev", // Dummy 'to' field
          bcc: chunk,
          subject: subject,
          html: finalHtml,
        });
    
        if (sendError) {
          console.error(`Resend error for chunk ${Math.floor(i / chunkSize) + 1}:`, sendError);
          errors.push(sendError.message);
        }
      } catch (e) {
        console.error(`Caught exception for chunk ${Math.floor(i / chunkSize) + 1}:`, e);
        errors.push(e.message);
      }
    }

    if (errors.length > 0) {
      throw new Error(`Échec de l'envoi d'e-mails à certains utilisateurs. ${errors.length} lots ont échoué. Première erreur : ${errors[0]}`);
    }

    try {
      const { error: notificationError } = await supabaseAdmin.from('notifications').insert({
        user_id: user.id,
        type: 'admin_bulk_email_sent',
        title: "Envoi d'e-mails en masse terminé",
        message: `L'envoi de l'e-mail "${subject}" à ${recipientEmails.length} utilisateurs est maintenant terminé.`
      });
    
      if (notificationError) {
        console.error("Error creating completion notification:", notificationError);
      }
    } catch(e) {
      console.error("Exception while creating completion notification:", e);
    }

    return new Response(JSON.stringify({ success: true, message: `L'e-mail a été envoyé avec succès à ${recipientEmails.length} utilisateurs.` }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in send-bulk-email function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
