
interface PromoEmailTemplateProps {
  subject: string;
  userHtmlContent: string;
}

export const generatePromoEmailHtml = ({ subject, userHtmlContent }: PromoEmailTemplateProps): string => {
  const logoUrl = "https://finder-id-4182.lovable.app/lovable-uploads/4f1d2be2-319b-4f55-8aa0-54813e8045c5.png";

  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          background-color: #f3f4f6;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .header {
          background-color: #1f2937;
          padding: 20px;
          text-align: center;
        }
        .header img {
          max-width: 150px; /* Reduced size for better email compatibility */
          height: auto;
        }
        .content {
          padding: 30px;
          color: #374151;
          line-height: 1.6;
        }
        .content h1, .content h2, .content h3 {
          color: #111827;
        }
        .footer {
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #6b7280;
          background-color: #f9fafb;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${logoUrl}" alt="FinderID Logo">
        </div>
        <div class="content">
          ${userHtmlContent}
        </div>
        <div class="footer">
          <div style="margin-bottom: 16px;">
            <a href="https://www.facebook.com/profile.php?id=61573756376174" target="_blank" style="display: inline-block; margin: 0 10px;">
              <img src="https://cdn.tools.unlayer.com/social/icons/circle-color/facebook.png" alt="Facebook" width="32" height="32" style="text-decoration: none; border: 0;">
            </a>
            <a href="https://www.instagram.com/finderid.info?igsh=MXdrNjk4bjQwY3NudA%3D%3D&utm_source=qr" target="_blank" style="display: inline-block; margin: 0 10px;">
              <img src="https://cdn.tools.unlayer.com/social/icons/circle-color/instagram.png" alt="Instagram" width="32" height="32" style="text-decoration: none; border: 0;">
            </a>
            <a href="https://www.tiktok.com/@finderid.info?_t=ZM-8w964za6L5z&_r=1" target="_blank" style="display: inline-block; margin: 0 10px;">
              <img src="https://cdn.tools.unlayer.com/social/icons/circle-color/tiktok.png" alt="TikTok" width="32" height="32" style="text-decoration: none; border: 0;">
            </a>
          </div>
          <p>&copy; ${new Date().getFullYear()} FinderID. Tous droits réservés.</p>
          <p>Vous recevez cet e-mail en tant qu'utilisateur enregistré sur FinderID.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
