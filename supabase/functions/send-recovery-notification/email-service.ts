
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

export const sendRecoveryEmail = async (
  subject: string,
  htmlContent: string
): Promise<{ id?: string }> => {
  const emailResponse = await resend.emails.send({
    from: "FinderID <notifications@resend.dev>",
    to: ["idfinder06@gmail.com"],
    subject,
    html: htmlContent,
  });

  console.log("Email sent successfully:", emailResponse);
  return emailResponse;
};
