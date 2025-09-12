import { GlobalSEO } from "./GlobalSEO";

export const MCardsSEO = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://www.finderid.info/mcards#webpage",
        "url": "https://www.finderid.info/mcards",
        "name": "Cartes de Visite Digitales - FinderID",
        "description": "Découvrez et créez des cartes de visite digitales professionnelles avec FinderID",
        "inLanguage": "fr-FR",
        "isPartOf": {
          "@type": "WebSite",
          "name": "FinderID",
          "url": "https://www.finderid.info"
        }
      },
      {
        "@type": "CollectionPage",
        "name": "Cartes de Visite Digitales",
        "description": "Collection de cartes de visite digitales professionnelles",
        "url": "https://www.finderid.info/mcards",
        "mainEntity": {
          "@type": "ItemList",
          "name": "MCards FinderID",
          "description": "Liste des cartes de visite digitales disponibles sur FinderID"
        }
      },
      {
        "@type": "Service",
        "name": "Création de Cartes de Visite Digitales",
        "description": "Service de création et gestion de cartes de visite digitales professionnelles",
        "provider": {
          "@type": "Organization",
          "name": "FinderID",
          "url": "https://www.finderid.info"
        },
        "serviceType": "Carte de visite digitale",
        "areaServed": {
          "@type": "Country",
          "name": "Sénégal"
        },
        "offers": {
          "@type": "Offer",
          "name": "Carte de Visite Digitale Gratuite",
          "description": "Créez votre première carte de visite digitale gratuitement"
        }
      }
    ]
  };

  return (
    <GlobalSEO
      title="Cartes de Visite Digitales Professionnelles - FinderID"
      description="Découvrez et créez des cartes de visite digitales professionnelles avec FinderID. Partagez vos coordonnées facilement avec un QR code ou un lien. Service gratuit et sécurisé."
      keywords="cartes de visite digitales, mCard, vCard, profil professionnel, QR code, contact digital, networking, FinderID, carte visite électronique"
      url="https://www.finderid.info/mcards"
      canonical="https://www.finderid.info/mcards"
      schemaData={structuredData}
    />
  );
};