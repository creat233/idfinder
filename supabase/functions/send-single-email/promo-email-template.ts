
interface PromoEmailTemplateProps {
  subject:string;
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
          <p>&copy; ${new Date().getFullYear()} FinderID. Tous droits réservés.</p>
          <p>Vous recevez cet e-mail en tant qu'utilisateur enregistré sur FinderID.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
