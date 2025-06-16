
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Share2, 
  Copy, 
  Download, 
  Edit,
  ExternalLink,
  Phone,
  Mail,
  Globe,
  MapPin,
  Briefcase,
  User
} from 'lucide-react';
import { MCard } from '@/types/mcard';
import { MCardSocialLinks } from '@/components/mcards/MCardSocialLinks';
import { MCardShareDialog } from '@/components/mcards/MCardShareDialog';

const MCardView = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mcard, setMCard] = useState<MCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const fetchMCard = async () => {
      if (!slug) return;

      try {
        const { data, error } = await supabase
          .from('mcards')
          .select('*')
          .eq('slug', slug)
          .eq('is_published', true)
          .single();

        if (error) throw error;

        setMCard(data);

        // Vérifier si l'utilisateur est le propriétaire
        const { data: { user } } = await supabase.auth.getUser();
        if (user && data.user_id === user.id) {
          setIsOwner(true);
        }
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Carte non trouvée ou non publiée"
        });
        navigate('/mcards');
      } finally {
        setLoading(false);
      }
    };

    fetchMCard();
  }, [slug, navigate, toast]);

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
          <Button onClick={() => navigate('/mcards')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate('/mcards')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div className="flex items-center gap-2">
              {isOwner && (
                <Button variant="outline" onClick={handleEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
              )}
              <Button onClick={() => setIsShareDialogOpen(true)}>
                <Share2 className="h-4 w-4 mr-2" />
                Partager
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Profile Card */}
          <Card className="mb-6 overflow-hidden shadow-lg">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32"></div>
            <CardContent className="relative pt-0 pb-8">
              {/* Profile Picture */}
              <div className="flex justify-center -mt-16 mb-6">
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100">
                  {mcard.profile_picture_url ? (
                    <img 
                      src={mcard.profile_picture_url} 
                      alt={mcard.full_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>

              {/* Basic Info */}
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{mcard.full_name}</h1>
                {mcard.job_title && (
                  <p className="text-lg text-gray-600 mb-1">{mcard.job_title}</p>
                )}
                {mcard.company && (
                  <p className="text-gray-500 flex items-center justify-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    {mcard.company}
                  </p>
                )}
                <Badge variant="secondary" className="mt-3">
                  Plan {mcard.plan}
                </Badge>
              </div>

              {/* Description */}
              {mcard.description && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700 text-center">{mcard.description}</p>
                </div>
              )}

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                {mcard.phone_number && (
                  <a 
                    href={`tel:${mcard.phone_number}`}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Phone className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-900">{mcard.phone_number}</span>
                  </a>
                )}
                {mcard.email && (
                  <a 
                    href={`mailto:${mcard.email}`}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Mail className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-900">{mcard.email}</span>
                  </a>
                )}
                {mcard.website_url && (
                  <a 
                    href={mcard.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Globe className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-900">Site web</span>
                    <ExternalLink className="h-4 w-4 ml-auto text-gray-400" />
                  </a>
                )}
              </div>

              {/* Social Links */}
              <MCardSocialLinks mcard={mcard} />

              {/* Quick Actions */}
              <div className="flex gap-2 mt-6">
                <Button variant="outline" className="flex-1" onClick={handleCopyLink}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copier le lien
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setIsShareDialogOpen(true)}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Partager
                </Button>
              </div>
            </CardContent>
          </Card>
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
