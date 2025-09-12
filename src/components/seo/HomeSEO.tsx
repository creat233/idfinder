import { GlobalSEO } from "./GlobalSEO";

export const HomeSEO = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://www.finderid.info/#website",
        "url": "https://www.finderid.info/",
        "name": "FinderID",
        "description": "Plateforme de cartes de visite digitales et service de récupération de cartes d'identité",
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://www.finderid.info/recherche-resultat?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        ],
        "inLanguage": "fr-FR"
      },
      {
        "@type": "Organization",
        "@id": "https://www.finderid.info/#organization",
        "name": "FinderID",
        "url": "https://www.finderid.info/",
        "logo": {
          "@type": "ImageObject",
          "inLanguage": "fr-FR",
          "@id": "https://www.finderid.info/#/schema/logo/image/",
          "url": "https://www.finderid.info/lovable-uploads/dd162e07-382f-4111-a227-a319a73cc433.png",
          "contentUrl": "https://www.finderid.info/lovable-uploads/dd162e07-382f-4111-a227-a319a73cc433.png",
          "width": 512,
          "height": 512,
          "caption": "FinderID"
        },
        "image": {
          "@id": "https://www.finderid.info/#/schema/logo/image/"
        },
        "description": "Service professionnel de cartes de visite digitales et récupération de documents d'identité",
        "sameAs": [
          "https://www.facebook.com/finderid",
          "https://www.twitter.com/finderid",
          "https://www.linkedin.com/company/finderid"
        ]
      },
      {
        "@type": "WebPage",
        "@id": "https://www.finderid.info/#webpage",
        "url": "https://www.finderid.info/",
        "name": "FinderID - Cartes de Visite Digitales et Récupération de Cartes d'Identité",
        "isPartOf": {
          "@id": "https://www.finderid.info/#website"
        },
        "about": {
          "@id": "https://www.finderid.info/#organization"
        },
        "description": "Créez votre carte de visite digitale professionnelle et récupérez vos cartes d'identité perdues avec FinderID. Service sécurisé et professionnel.",
        "breadcrumb": {
          "@id": "https://www.finderid.info/#breadcrumb"
        },
        "inLanguage": "fr-FR",
        "potentialAction": [
          {
            "@type": "ReadAction",
            "target": [
              "https://www.finderid.info/"
            ]
          }
        ]
      },
      {
        "@type": "Service",
        "name": "Cartes de Visite Digitales",
        "description": "Création et gestion de cartes de visite digitales professionnelles",
        "provider": {
          "@id": "https://www.finderid.info/#organization"
        },
        "areaServed": {
          "@type": "Country",
          "name": "Sénégal"
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Services FinderID",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Carte de Visite Digitale"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Récupération Carte d'Identité"
              }
            }
          ]
        }
      }
    ]
  };

  return (
    <GlobalSEO
      title="FinderID - Cartes de Visite Digitales et Récupération de Cartes d'Identité"
      description="Créez votre carte de visite digitale professionnelle avec FinderID. Service sécurisé de récupération de cartes d'identité perdues au Sénégal. Récompense de 2000 Fr garantie."
      keywords="carte de visite digitale, récupération carte identité, FinderID, Sénégal, profil professionnel, vCard, QR code, networking, contact professionnel, service sécurisé"
      url="https://www.finderid.info"
      canonical="https://www.finderid.info"
      schemaData={structuredData}
    />
  );
};