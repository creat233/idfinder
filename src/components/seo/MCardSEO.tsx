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
}

export const MCardSEO = ({ mcard }: MCardSEOProps) => {
  const title = `${mcard.full_name}${mcard.job_title ? ` - ${mcard.job_title}` : ''}${mcard.company ? ` chez ${mcard.company}` : ''} | FinderID`;
  const description = mcard.description || 
    `Découvrez le profil professionnel de ${mcard.full_name}${mcard.job_title ? `, ${mcard.job_title}` : ''}${mcard.company ? ` chez ${mcard.company}` : ''}. Contactez-les directement via FinderID.`;
  
  const cardUrl = `https://www.finderid.info/mcard/${mcard.slug}`;
  const imageUrl = mcard.profile_picture_url || 'https://www.finderid.info/og-image.png';

  // Données structurées JSON-LD pour le SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": mcard.full_name,
    "jobTitle": mcard.job_title,
    "worksFor": mcard.company ? {
      "@type": "Organization",
      "name": mcard.company
    } : undefined,
    "description": description,
    "image": imageUrl,
    "url": cardUrl,
    "email": mcard.email,
    "telephone": mcard.phone_number,
    "sameAs": mcard.website_url ? [mcard.website_url] : undefined
  };

  return (
    <Helmet>
      {/* Titre et description */}
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Mots-clés */}
      <meta name="keywords" content={`${mcard.full_name}, ${mcard.job_title || ''}, ${mcard.company || ''}, carte de visite digitale, FinderID, profil professionnel, contact`} />
      
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
      <meta name="robots" content="index, follow" />
      <meta name="author" content={mcard.full_name} />
      <meta name="google-site-verification" content="" />
      
      {/* Liens vers les réseaux sociaux si disponibles */}
      {mcard.website_url && <link rel="me" href={mcard.website_url} />}
    </Helmet>
  );
};