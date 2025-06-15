
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

    const { recipientEmail, subject, htmlContent } = await req.json();
    if (!recipientEmail || !subject || !htmlContent) {
      return new Response(JSON.stringify({ error: "recipientEmail, subject and htmlContent are required." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Sending email to ${recipientEmail}.`);

    const finalHtml = generatePromoEmailHtml({ subject, userHtmlContent: htmlContent });

    const { data, error: sendError } = await resend.emails.send({
      from: "FinderID <notifications@resend.dev>",
      to: recipientEmail,
      subject: subject,
      html: finalHtml,
    });

    if (sendError) {
      console.error("Resend error:", sendError);
      throw sendError;
    }

    return new Response(JSON.stringify({ success: true, message: `Email sent to ${recipientEmail}.`, resendResponseId: data?.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in send-single-email function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
