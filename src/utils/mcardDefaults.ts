
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
  snapchat_url: null
});

export const createDefaultStatuses = (): MCardStatus[] => [
  {
    id: '1',
    mcard_id: 'demo',
    status_text: 'Disponible pour projets',
    status_color: '#10B981',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    mcard_id: 'demo',
    status_text: 'Formation React',
    status_color: '#3B82F6',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    mcard_id: 'demo',
    status_text: 'Consultation technique',
    status_color: '#8B5CF6',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];
