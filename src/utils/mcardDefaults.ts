
import { MCard, MCardStatus } from '@/types/mcard';

export const createDefaultCard = (): MCard => ({
  id: 'demo',
  user_id: 'demo',
  slug: 'demo',
  full_name: 'Jean Dupont',
  job_title: 'Développeur Full Stack',
  company: 'TechCorp Solutions',
  phone_number: '+221 77 123 45 67',
  email: 'jean.dupont@example.com',
  website_url: 'https://jeandupont.dev',
  profile_picture_url: null,
  description: 'Passionné de technologie avec 5 ans d\'expérience dans le développement web. Spécialisé en React, Node.js et bases de données.',
  is_published: true,
  plan: 'premium',
  subscription_status: 'active',
  subscription_expires_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  view_count: 1247,
  social_links: {
    linkedin: 'https://linkedin.com/in/jeandupont',
    twitter: 'https://twitter.com/jeandupont',
    github: 'https://github.com/jeandupont'
  },
  linkedin_url: 'https://linkedin.com/in/jeandupont',
  twitter_url: 'https://twitter.com/jeandupont',
  facebook_url: null,
  instagram_url: null,
  youtube_url: null,
  tiktok_url: null,
  snapchat_url: null,
  telegram_url: null,
  google_business_url: null
});

export const createDefaultStatuses = (): MCardStatus[] => [
  {
    id: '1',
    mcard_id: 'demo',
    status_text: 'Disponible pour projets',
    status_color: '#10B981',
    status_image: '/lovable-uploads/8f0a3646-98f9-4f52-9495-ca5134a34d85.png',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24h from now
  },
  {
    id: '2',
    mcard_id: 'demo',
    status_text: 'Service d\'impression',
    status_color: '#3B82F6',
    status_image: '/lovable-uploads/73f8ab5a-99fe-43bd-b052-89e74cb7f3b0.png',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    mcard_id: 'demo',
    status_text: 'Design graphique',
    status_color: '#8B5CF6',
    status_image: '/lovable-uploads/dc5b2de0-4f1d-4cba-a0e6-5fc341218843.png',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  }
];
