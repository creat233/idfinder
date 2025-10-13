export const generateVCard = (mcard: {
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
  const vcard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${mcard.full_name}`,
    mcard.job_title ? `TITLE:${mcard.job_title}` : '',
    mcard.company ? `ORG:${mcard.company}` : '',
    mcard.phone_number ? `TEL;TYPE=WORK,VOICE:${mcard.phone_number}` : '',
    mcard.email ? `EMAIL;TYPE=INTERNET:${mcard.email}` : '',
    mcard.website_url ? `URL:${mcard.website_url}` : '',
    mcard.profile_picture_url ? `PHOTO;VALUE=URL;TYPE=JPEG:${mcard.profile_picture_url}` : '',
    mcard.linkedin_url ? `X-SOCIALPROFILE;TYPE=linkedin:${mcard.linkedin_url}` : '',
    mcard.twitter_url ? `X-SOCIALPROFILE;TYPE=twitter:${mcard.twitter_url}` : '',
    mcard.facebook_url ? `X-SOCIALPROFILE;TYPE=facebook:${mcard.facebook_url}` : '',
    mcard.instagram_url ? `X-SOCIALPROFILE;TYPE=instagram:${mcard.instagram_url}` : '',
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
