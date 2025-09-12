import { Helmet } from "react-helmet-async";

interface GlobalSEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  noIndex?: boolean;
  canonical?: string;
  schemaData?: object;
}

export const GlobalSEO = ({
  title = "FinderID - Cartes de Visite Digitales Professionnelles",
  description = "Créez votre carte de visite digitale professionnelle avec FinderID. Service sécurisé de récupération de cartes d'identité et plateforme de mise en relation professionnelle.",
  keywords = "carte de visite digitale, FinderID, profil professionnel, carte d'identité, récupération documents, networking, contact professionnel, vCard, QR code",
  image = "https://www.finderid.info/og-image.png",
  url = "https://www.finderid.info",
  type = "website",
  noIndex = false,
  canonical,
  schemaData
}: GlobalSEOProps) => {
  const fullTitle = title.includes("FinderID") ? title : `${title} | FinderID`;
  
  const structuredData = schemaData || {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "FinderID",
    "url": "https://www.finderid.info",
    "description": description,
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.finderid.info/recherche-resultat?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "sameAs": [
      "https://www.facebook.com/finderid",
      "https://www.twitter.com/finderid",
      "https://www.linkedin.com/company/finderid"
    ]
  };

  return (
    <Helmet>
      {/* Titre et description de base */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* URL canonique */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Robots */}
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"} />
      
      {/* Langue */}
      <meta httpEquiv="content-language" content="fr" />
      <meta name="language" content="French" />
      
      {/* Auteur et éditeur */}
      <meta name="author" content="FinderID" />
      <meta name="publisher" content="FinderID" />
      <meta name="copyright" content="© 2024 FinderID. Tous droits réservés." />
      
      {/* Open Graph pour réseaux sociaux */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="FinderID - Cartes de visite digitales" />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="FinderID" />
      <meta property="og:locale" content="fr_FR" />
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@finderid" />
      <meta name="twitter:creator" content="@finderid" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content="FinderID - Cartes de visite digitales" />
      
      {/* Apple Touch Icon et Favicons */}
      <link rel="apple-touch-icon" sizes="180x180" href="/lovable-uploads/dd162e07-382f-4111-a227-a319a73cc433.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/lovable-uploads/dd162e07-382f-4111-a227-a319a73cc433.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/lovable-uploads/dd162e07-382f-4111-a227-a319a73cc433.png" />
      
      {/* Mobile */}
      <meta name="theme-color" content="#9b87f5" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="FinderID" />
      
      {/* Performance et sécurité */}
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="format-detection" content="telephone=no" />
      
      {/* Données structurées JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData, null, 2)}
      </script>
      
      {/* Liens préconnectés pour performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* DNS Prefetch pour domaines externes */}
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
    </Helmet>
  );
};