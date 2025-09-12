// Utilitaires SEO pour optimiser le contenu et les métadonnées

export const SEO_CONSTANTS = {
  SITE_NAME: "FinderID",
  SITE_URL: "https://www.finderid.info",
  DEFAULT_IMAGE: "https://www.finderid.info/og-image.png",
  TWITTER_HANDLE: "@finderid",
  ORGANIZATION: {
    name: "FinderID",
    url: "https://www.finderid.info",
    logo: "https://www.finderid.info/lovable-uploads/dd162e07-382f-4111-a227-a319a73cc433.png"
  }
};

// Générateur de titre optimisé pour le SEO
export const generateSEOTitle = (pageTitle: string, includeKeyword = true): string => {
  const keyword = includeKeyword ? "Cartes de Visite Digitales" : "";
  const maxLength = 60;
  
  let title = pageTitle.includes(SEO_CONSTANTS.SITE_NAME) 
    ? pageTitle 
    : `${pageTitle} | ${SEO_CONSTANTS.SITE_NAME}`;
  
  if (includeKeyword && !title.toLowerCase().includes("carte") && title.length < 40) {
    title = `${pageTitle} - ${keyword} | ${SEO_CONSTANTS.SITE_NAME}`;
  }
  
  return title.length > maxLength ? title.substring(0, maxLength - 3) + "..." : title;
};

// Générateur de description optimisée
export const generateSEODescription = (content: string, includeKeywords = true): string => {
  const maxLength = 160;
  const keywords = includeKeywords ? "carte de visite digitale, profil professionnel, FinderID" : "";
  
  let description = content;
  
  if (includeKeywords && !content.toLowerCase().includes("carte") && content.length < 120) {
    description = `${content} Créez votre ${keywords} avec FinderID.`;
  }
  
  return description.length > maxLength ? description.substring(0, maxLength - 3) + "..." : description;
};

// Générateur de mots-clés
export const generateKeywords = (baseKeywords: string[], additionalKeywords: string[] = []): string => {
  const defaultKeywords = [
    "carte de visite digitale",
    "FinderID",
    "profil professionnel",
    "vCard",
    "QR code",
    "networking",
    "contact professionnel"
  ];
  
  const allKeywords = [...defaultKeywords, ...baseKeywords, ...additionalKeywords]
    .filter(Boolean)
    .filter((keyword, index, arr) => arr.indexOf(keyword) === index); // Supprimer les doublons
  
  return allKeywords.join(", ");
};

// Générateur d'URL canonique
export const generateCanonicalUrl = (path: string): string => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SEO_CONSTANTS.SITE_URL}${cleanPath}`;
};

// Générateur de données structurées pour les organisations
export const generateOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": SEO_CONSTANTS.ORGANIZATION.name,
  "url": SEO_CONSTANTS.ORGANIZATION.url,
  "logo": SEO_CONSTANTS.ORGANIZATION.logo,
  "sameAs": [
    "https://www.facebook.com/finderid",
    "https://www.twitter.com/finderid",
    "https://www.linkedin.com/company/finderid"
  ]
});

// Générateur de données structurées pour les pages web
export const generateWebPageSchema = (title: string, description: string, url: string) => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": title,
  "description": description,
  "url": url,
  "inLanguage": "fr-FR",
  "isPartOf": {
    "@type": "WebSite",
    "name": SEO_CONSTANTS.SITE_NAME,
    "url": SEO_CONSTANTS.SITE_URL
  }
});

// Optimisation des images pour le SEO
export const optimizeImageForSEO = (
  src: string, 
  alt: string, 
  title?: string
): { src: string; alt: string; title?: string } => {
  // Générer un alt text descriptif si manquant
  const optimizedAlt = alt || title || "Image FinderID";
  
  // Ajouter le contexte FinderID si pertinent
  const contextualAlt = optimizedAlt.toLowerCase().includes("finderid") 
    ? optimizedAlt 
    : `${optimizedAlt} - FinderID`;
  
  return {
    src,
    alt: contextualAlt,
    title: title || optimizedAlt
  };
};

// Validation du contenu SEO
export const validateSEOContent = (title: string, description: string) => {
  const warnings: string[] = [];
  
  if (title.length < 30) {
    warnings.push("Le titre est trop court (minimum 30 caractères recommandé)");
  }
  
  if (title.length > 60) {
    warnings.push("Le titre est trop long (maximum 60 caractères recommandé)");
  }
  
  if (description.length < 120) {
    warnings.push("La description est trop courte (minimum 120 caractères recommandé)");
  }
  
  if (description.length > 160) {
    warnings.push("La description est trop longue (maximum 160 caractères recommandé)");
  }
  
  if (!title.toLowerCase().includes("finderid")) {
    warnings.push("Le titre devrait inclure 'FinderID' pour le branding");
  }
  
  return {
    isValid: warnings.length === 0,
    warnings
  };
};