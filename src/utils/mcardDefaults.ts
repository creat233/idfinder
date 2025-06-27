
import { MCard, MCardStatus, MCardProduct } from '@/types/mcard';

export const createDefaultCard = (): MCard => ({
  id: 'demo-card-123',
  user_id: 'demo-user-456',
  slug: 'demo',
  full_name: 'Marie Diallo',
  job_title: 'Consultante Marketing Digital',
  company: 'Digital Solutions SARL',
  phone_number: '+221 77 123 45 67',
  email: 'marie.diallo@example.com',
  website_url: 'https://mariediallo.com',
  profile_picture_url: null,
  description: 'Experte en marketing digital avec plus de 5 ans d\'expérience. Je vous accompagne dans votre transformation digitale.',
  social_links: {
    linkedin: 'https://linkedin.com/in/mariediallo',
    twitter: 'https://twitter.com/mariediallo',
    facebook: 'https://facebook.com/mariediallo'
  },
  is_published: true,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  subscription_expires_at: '2025-01-01T00:00:00Z',
  subscription_status: 'active',
  plan: 'premium',
  view_count: 127,
  linkedin_url: 'https://linkedin.com/in/mariediallo',
  twitter_url: 'https://twitter.com/mariediallo',
  facebook_url: 'https://facebook.com/mariediallo',
  instagram_url: 'https://instagram.com/mariediallo',
  youtube_url: null,
  tiktok_url: null,
  snapchat_url: null,
  telegram_url: null,
  google_business_url: null
});

export const createDefaultStatuses = (): MCardStatus[] => [
  {
    id: 'status-1',
    mcard_id: 'demo-card-123',
    status_text: '🟢 Disponible pour nouveaux projets',
    status_color: '#22C55E',
    status_image: null,
    is_active: true,
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'status-2',
    mcard_id: 'demo-card-123',
    status_text: '💼 En réunion client',
    status_color: '#F59E0B',
    status_image: null,
    is_active: true,
    expires_at: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

export const createDefaultProducts = (): MCardProduct[] => [
  {
    id: 'product-1',
    mcard_id: 'demo-card-123',
    name: 'Audit Marketing Digital',
    description: 'Analyse complète de votre présence digitale avec recommandations personnalisées',
    price: 75000,
    currency: 'FCFA',
    category: 'Consultation',
    image_url: '/lovable-uploads/8f3481ca-fab7-44c7-af85-2491f0990db7.png',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'product-2',
    mcard_id: 'demo-card-123',
    name: 'Stratégie Réseaux Sociaux',
    description: 'Développement d\'une stratégie complète pour vos réseaux sociaux avec planning de contenu',
    price: 150000,
    currency: 'FCFA',
    category: 'Stratégie',
    image_url: '/lovable-uploads/73f8ab5a-99fe-43bd-b052-89e74cb7f3b0.png',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'product-3',
    mcard_id: 'demo-card-123',
    name: 'Formation Marketing Digital',
    description: 'Formation personnalisée pour votre équipe sur les outils et techniques du marketing digital',
    price: 200000,
    currency: 'FCFA',
    category: 'Formation',
    image_url: '/lovable-uploads/97b184f7-279f-465b-8abd-60d4499bb242.png',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'product-4',
    mcard_id: 'demo-card-123',
    name: 'Gestion Publicité Facebook/Instagram',
    description: 'Création et gestion de vos campagnes publicitaires sur Facebook et Instagram pendant 1 mois',
    price: 125000,
    currency: 'FCFA',
    category: 'Publicité',
    image_url: '/lovable-uploads/a3fb0001-eef8-494f-bf56-206c25f7c391.png',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];
