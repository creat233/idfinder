
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

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
    
    const { data: { users }, error: usersError } = await supabaseAdmin.auth.admin.listUsers();

    if (usersError) {
      throw usersError;
    }

    const recipientEmails = users.map(u => u.email).filter(Boolean) as string[];

    if (recipientEmails.length === 0) {
      return new Response(JSON.stringify({ message: "No users to send email to." }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Sending email to ${recipientEmails.length} users.`);

    const { data, error: sendError } = await resend.emails.send({
      from: "FinderID <notifications@resend.dev>",
      to: "notifications@resend.dev", // Champ 'to' requis, mais les vrais destinataires sont en Cci.
      bcc: recipientEmails,
      subject: subject,
      html: htmlContent,
    });

    if (sendError) {
      console.error("Resend error:", sendError);
      throw sendError;
    }

    return new Response(JSON.stringify({ success: true, message: `Email sent to ${recipientEmails.length} users.`, resendResponseId: data?.id }), {
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
