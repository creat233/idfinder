// Fonction pour convertir une image en base64
const imageUrlToBase64 = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        // Extraire juste les données base64 sans le préfixe data:image/...;base64,
        const base64Data = base64.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Erreur lors de la conversion de l\'image:', error);
    return '';
  }
};

export const generateVCard = async (mcard: {
  full_name: string;
  job_title?: string;
  company?: string;
  phone_number?: string;
  email?: string;
  website_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  facebook_url?: string;
  instagram_url?: string;
  note?: string;
  profile_picture_url?: string;
}) => {
  let photoBase64 = '';
  
  // Convertir la photo de profil en base64 si elle existe
  if (mcard.profile_picture_url) {
    photoBase64 = await imageUrlToBase64(mcard.profile_picture_url);
  }

  const vcard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${mcard.full_name}`,
    mcard.job_title ? `TITLE:${mcard.job_title}` : '',
    mcard.company ? `ORG:${mcard.company}` : '',
    mcard.phone_number ? `TEL;TYPE=WORK,VOICE:${mcard.phone_number}` : '',
    mcard.email ? `EMAIL:${mcard.email}` : '',
    mcard.website_url ? `URL:${mcard.website_url}` : '',
    mcard.linkedin_url ? `X-SOCIALPROFILE;TYPE=linkedin:${mcard.linkedin_url}` : '',
    mcard.facebook_url ? `X-SOCIALPROFILE;TYPE=facebook:${mcard.facebook_url}` : '',
    mcard.instagram_url ? `X-SOCIALPROFILE;TYPE=instagram:${mcard.instagram_url}` : '',
    photoBase64 ? `PHOTO;ENCODING=b;TYPE=JPEG:${photoBase64}` : '',
    mcard.note ? `NOTE:${mcard.note}` : '',
    'END:VCARD'
  ].filter(line => line).join('\n');

  return vcard;
};

export const downloadVCard = (vcard: string, filename: string) => {
  const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.vcf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
