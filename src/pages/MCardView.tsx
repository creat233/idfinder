
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { MCard } from '@/types/mcard';
import { MCardShareDialog } from '@/components/mcards/MCardShareDialog';
import { MCardViewHeader } from '@/components/mcards/view/MCardViewHeader';
import { MCardViewQRSection } from '@/components/mcards/view/MCardViewQRSection';
import { MCardViewProfile } from '@/components/mcards/view/MCardViewProfile';

const MCardView = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mcard, setMCard] = useState<MCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);

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

  useEffect(() => {
    const fetchMCard = async () => {
      // Si pas de slug, utiliser la carte par défaut
      if (!slug) {
        setMCard(createDefaultCard());
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('mcards')
          .select('*')
          .eq('slug', slug)
          .eq('is_published', true)
          .single();

        if (error) {
          // Si la carte n'est pas trouvée, utiliser la carte par défaut
          console.log('Carte non trouvée, utilisation de la carte par défaut');
          setMCard(createDefaultCard());
        } else {
          setMCard(data);
          
          // Vérifier si l'utilisateur est le propriétaire
          const { data: { user } } = await supabase.auth.getUser();
          if (user && data.user_id === user.id) {
            setIsOwner(true);
          }
        }
      } catch (error: any) {
        console.error('Erreur lors de la récupération de la carte:', error);
        // En cas d'erreur, utiliser la carte par défaut
        setMCard(createDefaultCard());
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de la carte...</p>
        </div>
      </div>
    );
  }

  if (!mcard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Carte non trouvée</h1>
          <button onClick={() => navigate('/mcards')}>
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <MCardViewHeader
        isOwner={isOwner}
        showQRCode={showQRCode}
        onEdit={handleEdit}
        onToggleQRCode={() => setShowQRCode(!showQRCode)}
        onShare={() => setIsShareDialogOpen(true)}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* QR Code Section */}
          <MCardViewQRSection
            showQRCode={showQRCode}
            url={window.location.href}
            cardName={mcard.full_name}
            onClose={() => setShowQRCode(false)}
          />

          {/* Profile Card */}
          <MCardViewProfile
            mcard={mcard}
            onCopyLink={handleCopyLink}
            onShare={() => setIsShareDialogOpen(true)}
          />
        </div>
      </div>

      {/* Share Dialog */}
      <MCardShareDialog 
        isOpen={isShareDialogOpen}
        onOpenChange={setIsShareDialogOpen}
        mcard={mcard}
      />
    </div>
  );
};

export default MCardView;
