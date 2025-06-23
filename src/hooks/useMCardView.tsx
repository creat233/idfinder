
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { MCard, MCardStatus, MCardProduct } from '@/types/mcard';

export const useMCardView = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mcard, setMCard] = useState<MCard | null>(null);
  const [statuses, setStatuses] = useState<MCardStatus[]>([]);
  const [products, setProducts] = useState<MCardProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [viewCount, setViewCount] = useState(0);

  // Créer une carte par défaut pour les tests
  const createDefaultCard = (): MCard => ({
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

  const createDefaultStatuses = (): MCardStatus[] => [
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

  useEffect(() => {
    const fetchMCard = async () => {
      try {
        if (!slug || slug === 'demo') {
          const defaultCard = createDefaultCard();
          setMCard(defaultCard);
          setStatuses(createDefaultStatuses());
          setViewCount(defaultCard.view_count || 0);
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('mcards')
          .select('*')
          .eq('slug', slug)
          .eq('is_published', true)
          .single();

        if (error) {
          console.log('Carte non trouvée, utilisation de la carte par défaut');
          const defaultCard = createDefaultCard();
          setMCard(defaultCard);
          setStatuses(createDefaultStatuses());
          setViewCount(defaultCard.view_count || 0);
        } else {
          setMCard(data);
          setViewCount(data.view_count || 0);
          
          // Charger les statuts
          const { data: statusesData } = await supabase
            .from('mcard_statuses')
            .select('*')
            .eq('mcard_id', data.id)
            .eq('is_active', true)
            .order('created_at', { ascending: false });
          
          if (statusesData) {
            setStatuses(statusesData);
          }

          // Charger les produits
          const { data: productsData } = await supabase
            .from('mcard_products')
            .select('*')
            .eq('mcard_id', data.id)
            .eq('is_active', true)
            .order('created_at', { ascending: false });
          
          if (productsData) {
            setProducts(productsData);
          }
          
          // Incrémenter le compteur de vues pour les vraies cartes
          try {
            // On utilisera une simple requête UPDATE pour éviter l'erreur RPC
            const { error: updateError } = await supabase
              .from('mcards')
              .update({ view_count: (data.view_count || 0) + 1 })
              .eq('slug', slug)
              .eq('is_published', true);
            
            if (!updateError) {
              setViewCount(prev => prev + 1);
            }
          } catch (error) {
            console.error('Erreur lors de l\'incrémentation du compteur de vues:', error);
          }
          
          // Vérifier si l'utilisateur est le propriétaire
          const { data: { user } } = await supabase.auth.getUser();
          if (user && data.user_id === user.id) {
            setIsOwner(true);
          }
        }
      } catch (error: any) {
        console.error('Erreur lors de la récupération de la carte:', error);
        const defaultCard = createDefaultCard();
        setMCard(defaultCard);
        setStatuses(createDefaultStatuses());
        setViewCount(defaultCard.view_count || 0);
      } finally {
        setLoading(false);
      }
    };

    fetchMCard();
  }, [slug]);

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast({
      title: "Lien copié !",
      description: "Le lien de votre mCard a été copié dans le presse-papiers"
    });
  };

  const handleEdit = () => {
    navigate('/mcards', { state: { editMCardId: mcard?.id } });
  };

  return {
    mcard,
    statuses,
    products,
    loading,
    isShareDialogOpen,
    setIsShareDialogOpen,
    isOwner,
    showQRCode,
    setShowQRCode,
    viewCount,
    handleCopyLink,
    handleEdit
  };
};
