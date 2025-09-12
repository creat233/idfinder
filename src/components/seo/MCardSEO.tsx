import { Helmet } from "react-helmet-async";

interface MCardSEOProps {
  mcard: {
    id: string;
    full_name: string;
    job_title?: string;
    company?: string;
    description?: string;
    profile_picture_url?: string;
    website_url?: string;
    email?: string;
    phone_number?: string;
    slug: string;
  };
  products?: Array<{
    name: string;
    category: string;
    description?: string;
  }>;
  statuses?: Array<{
    status_text: string;
  }>;
}

export const MCardSEO = ({ mcard, products = [], statuses = [] }: MCardSEOProps) => {
  const title = `${mcard.full_name}${mcard.job_title ? ` - ${mcard.job_title}` : ''}${mcard.company ? ` chez ${mcard.company}` : ''} | FinderID`;
  const description = mcard.description || 
    `Découvrez le profil professionnel de ${mcard.full_name}${mcard.job_title ? `, ${mcard.job_title}` : ''}${mcard.company ? ` chez ${mcard.company}` : ''}. Contactez-les directement via FinderID - Carte de visite digitale professionnelle.`;
  
  const cardUrl = `https://www.finderid.info/mcard/${mcard.slug}`;
  const imageUrl = mcard.profile_picture_url || 'https://www.finderid.info/og-image.png';

  // Construire les mots-clés dynamiquement
  const baseKeywords = [mcard.full_name, 'carte de visite digitale', 'FinderID', 'profil professionnel', 'contact'];
  
  if (mcard.job_title) baseKeywords.push(mcard.job_title);
  if (mcard.company) baseKeywords.push(mcard.company);
  
  // Ajouter les produits/services comme mots-clés
  const productKeywords = products?.map(p => p.name) || [];
  const categoryKeywords = products?.map(p => p.category) || [];
  
  // Ajouter les statuts comme mots-clés
  const statusKeywords = statuses?.map(s => s.status_text) || [];
  
  const allKeywords = [...baseKeywords, ...productKeywords, ...categoryKeywords, ...statusKeywords]
    .filter(Boolean)
    .join(', ');

  // Données structurées JSON-LD enrichies pour le SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${cardUrl}#person`,
        "name": mcard.full_name,
        "jobTitle": mcard.job_title,
        "worksFor": mcard.company ? {
          "@type": "Organization",
          "name": mcard.company
        } : undefined,
        "description": description,
        "image": {
          "@type": "ImageObject",
          "url": imageUrl,
          "caption": `Photo de profil de ${mcard.full_name}`
        },
        "url": cardUrl,
        "email": mcard.email,
        "telephone": mcard.phone_number,
        "sameAs": mcard.website_url ? [mcard.website_url] : undefined,
        "knowsAbout": products?.map(p => p.name) || [],
        "makesOffer": products?.map(product => ({
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": product.name,
            "description": product.description,
            "category": product.category
          }
        })) || []
      },
      {
        "@type": "ProfilePage",
        "@id": cardUrl,
        "url": cardUrl,
        "name": title,
        "description": description,
        "about": {
          "@id": `${cardUrl}#person`
        },
        "mainEntity": {
          "@id": `${cardUrl}#person`
        },
        "inLanguage": "fr-FR",
        "isPartOf": {
          "@type": "WebSite",
          "name": "FinderID",
          "url": "https://www.finderid.info"
        }
      }
    ]
  };

  return (
    <Helmet>
      {/* Titre et description */}
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Mots-clés */}
      <meta name="keywords" content={allKeywords} />
      
      {/* URL canonique */}
      <link rel="canonical" href={cardUrl} />
      
      {/* Open Graph pour Facebook */}
      <meta property="og:type" content="profile" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={cardUrl} />
      <meta property="og:site_name" content="FinderID" />
      <meta property="profile:first_name" content={mcard.full_name.split(' ')[0]} />
      <meta property="profile:last_name" content={mcard.full_name.split(' ').slice(1).join(' ')} />
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      
      {/* Données structurées JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData, null, 2)}
      </script>
      
      {/* Meta tags additionnels pour l'indexation */}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
      <meta name="author" content={mcard.full_name} />
      <meta name="language" content="French" />
      <meta httpEquiv="content-language" content="fr" />
      
      {/* Performance et mobile */}
      <meta name="theme-color" content="#9b87f5" />
      <meta name="mobile-web-app-capable" content="yes" />
      
      {/* Preload critique */}
      <link rel="preload" href={imageUrl} as="image" />
      
      {/* Dublin Core Metadata */}
      <meta name="DC.title" content={title} />
      <meta name="DC.description" content={description} />
      <meta name="DC.creator" content={mcard.full_name} />
      <meta name="DC.subject" content={allKeywords} />
      <meta name="DC.language" content="fr" />
      
      {/* vCard microformat dans les métadonnées */}
      <meta property="contact:name" content={mcard.full_name} />
      {mcard.job_title && <meta property="contact:job_title" content={mcard.job_title} />}
      {mcard.company && <meta property="contact:company" content={mcard.company} />}
      {mcard.email && <meta property="contact:email" content={mcard.email} />}
      {mcard.phone_number && <meta property="contact:phone" content={mcard.phone_number} />}
      
      {/* Liens vers les réseaux sociaux si disponibles */}
      {mcard.website_url && <link rel="me" href={mcard.website_url} />}
    </Helmet>
  );
};