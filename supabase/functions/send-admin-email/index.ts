import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.47.16";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  type: 'single' | 'all';
  recipient?: string;
  subject: string;
  htmlContent: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Initialize Resend
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY is not configured");
    }
    const resend = new Resend(resendApiKey);

    // Get request data
    const { type, recipient, subject, htmlContent }: EmailRequest = await req.json();

    // Verify admin permissions
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      throw new Error("Authorization header required");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error("Authentication failed");
    }

    // Check if user is admin
    const { data: adminCheck, error: adminError } = await supabase
      .from('admin_permissions')
      .select('*')
      .eq('user_email', user.email)
      .eq('is_active', true)
      .single();

    if (adminError || !adminCheck) {
      throw new Error("Admin access required");
    }

    let recipients: string[] = [];

    if (type === 'single') {
      if (!recipient) {
        throw new Error("Recipient email is required for single send");
      }
      recipients = [recipient];
    } else {
      // Get all user emails
      const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
      
      if (usersError) {
        throw new Error("Failed to fetch users");
      }
      
      recipients = users.users
        .filter(u => u.email)
        .map(u => u.email!);
    }

    // Send emails
    const results = [];
    const fromEmail = Deno.env.get("RESEND_FROM_EMAIL") || "FinderID <noreply@finderid.info>";

    for (const email of recipients) {
      try {
        const emailResponse = await resend.emails.send({
          from: fromEmail,
          to: [email],
          subject: subject,
          html: htmlContent,
        });

        results.push({
          email,
          success: true,
          id: emailResponse.data?.id
        });

        console.log(`Email sent successfully to ${email}:`, emailResponse.data?.id);
      } catch (error) {
        console.error(`Failed to send email to ${email}:`, error);
        results.push({
          email,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error"
        });
      }
    }

    // Log the email sending activity
    await supabase
      .from('audit_logs')
      .insert({
        action: 'admin_email_sent',
        user_email: user.email,
        details: {
          type,
          recipient_count: recipients.length,
          subject,
          success_count: results.filter(r => r.success).length,
          failed_count: results.filter(r => !r.success).length
        }
      });

    const successCount = results.filter(r => r.success).length;
    const failedCount = results.filter(r => !r.success).length;

    return new Response(JSON.stringify({
      success: true,
      message: `Emails envoyés: ${successCount} réussis, ${failedCount} échoués`,
      details: results
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Error in send-admin-email function:", error);
    
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { 
        "Content-Type": "application/json", 
        ...corsHeaders 
      },
    });
  }
};

serve(handler);