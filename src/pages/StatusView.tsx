import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, ArrowLeft, ChevronLeft, ChevronRight, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StatusWithMCard {
  id: string;
  status_text: string;
  status_image?: string;
  status_color?: string;
  created_at: string;
  mcard: {
    id: string;
    full_name: string;
    description?: string;
    profile_picture_url?: string;
    user_id: string;
  };
}

export const StatusView = () => {
  const { statusId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<StatusWithMCard | null>(null);
  const [allUserStatuses, setAllUserStatuses] = useState<StatusWithMCard[]>([]);
  const [allGlobalStatuses, setAllGlobalStatuses] = useState<StatusWithMCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [globalCurrentIndex, setGlobalCurrentIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (statusId) {
      loadStatus();
    }
  }, [statusId]);

  const loadStatus = async () => {
    try {
      // Charger tous les statuts globaux vérifiés d'abord
      const { data: globalStatuses, error: globalError } = await supabase
        .from('mcard_statuses')
        .select(`
          *,
          mcard:mcards!inner(
            id,
            full_name,
            description,
            profile_picture_url,
            user_id,
            is_verified
          )
        `)
        .eq('is_active', true)
        .eq('mcard.is_verified', true)
        .gte('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (globalError) throw globalError;
      setAllGlobalStatuses(globalStatuses || []);

      // Charger le statut spécifique
      const { data: statusData, error: statusError } = await supabase
        .from('mcard_statuses')
        .select(`
          *,
          mcard:mcards!inner(
            id,
            full_name,
            description,
            profile_picture_url,
            user_id
          )
        `)
        .eq('id', statusId)
        .single();

      if (statusError) throw statusError;

      setStatus(statusData);

      // Charger tous les statuts de cette carte
      const { data: allStatuses, error: allError } = await supabase
        .from('mcard_statuses')
        .select(`
          *,
          mcard:mcards!inner(
            id,
            full_name,
            description,
            profile_picture_url,
            user_id
          )
        `)
        .eq('mcard.id', statusData.mcard.id)
        .eq('is_active', true)
        .gte('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (allError) throw allError;

      setAllUserStatuses(allStatuses || []);
      
      // Trouver l'index du statut actuel dans sa carte
      const currentIdx = allStatuses?.findIndex(s => s.id === statusId) || 0;
      setCurrentIndex(currentIdx);

      // Trouver l'index global du statut actuel
      const globalIdx = globalStatuses?.findIndex(s => s.id === statusId) || 0;
      setGlobalCurrentIndex(globalIdx);

    } catch (error) {
      console.error('Erreur lors du chargement du statut:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger le statut",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      // Navigation dans la même carte
      const previousStatus = allUserStatuses[currentIndex - 1];
      navigate(`/status/${previousStatus.id}`);
    } else if (globalCurrentIndex > 0) {
      // Navigation vers le statut précédent global
      const previousGlobalStatus = allGlobalStatuses[globalCurrentIndex - 1];
      navigate(`/status/${previousGlobalStatus.id}`);
    }
  };

  const handleNext = () => {
    if (currentIndex < allUserStatuses.length - 1) {
      // Navigation dans la même carte
      const nextStatus = allUserStatuses[currentIndex + 1];
      navigate(`/status/${nextStatus.id}`);
    } else if (globalCurrentIndex < allGlobalStatuses.length - 1) {
      // Navigation vers le statut suivant global
      const nextGlobalStatus = allGlobalStatuses[globalCurrentIndex + 1];
      navigate(`/status/${nextGlobalStatus.id}`);
    }
  };

  const handleLike = async () => {
    // Toggle like logic here
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? "Like retiré" : "Statut aimé",
      description: isLiked ? "Vous n'aimez plus ce statut" : "Vous aimez ce statut",
    });
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !status) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Connexion requise",
          description: "Veuillez vous connecter pour envoyer un message",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('mcard_messages')
        .insert({
          sender_id: user.id,
          recipient_id: status.mcard.user_id,
          mcard_id: status.mcard.id,
          subject: `À propos de votre statut: ${status.status_text}`,
          message: message,
        });

      if (error) throw error;

      toast({
        title: "Message envoyé",
        description: "Votre message a été envoyé avec succès",
      });

      setMessage('');
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-80 h-96 bg-card rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Statut non trouvé</h2>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
        </div>
      </div>
    );
  }

  const currentStatus = allUserStatuses[currentIndex] || status;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate(-1)}
              className="hover:bg-primary/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            {/* Profile Info */}
            <div 
              className="flex items-center gap-3 cursor-pointer hover:bg-primary/5 rounded-lg p-2 -m-2 transition-colors"
              onClick={() => navigate(`/m/${status.mcard.id}`)}
            >
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20">
                {status.mcard.profile_picture_url ? (
                  <img
                    src={status.mcard.profile_picture_url}
                    alt={status.mcard.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
                    {status.mcard.full_name.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <h2 className="font-semibold text-foreground hover:text-primary transition-colors">{status.mcard.full_name}</h2>
                {status.mcard.description && (
                  <p className="text-sm text-muted-foreground truncate max-w-xs">
                    {status.mcard.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-md">
        <div className="bg-card rounded-3xl shadow-2xl overflow-hidden">
          {/* Status Image Container */}
          <div className="relative min-h-[500px] bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
            {currentStatus.status_image ? (
              <img
                src={currentStatus.status_image}
                alt={currentStatus.status_text}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            ) : (
              <div 
                className="w-full h-full flex items-center justify-center text-white text-6xl font-bold"
                style={{ backgroundColor: currentStatus.status_color || '#3B82F6' }}
              >
                {currentStatus.status_text.charAt(0).toUpperCase()}
              </div>
            )}

            {/* Navigation Arrows */}
            {allUserStatuses.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full w-10 h-10 p-0"
                  onClick={handlePrevious}
                  disabled={globalCurrentIndex === 0}
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full w-10 h-10 p-0"
                  onClick={handleNext}
                  disabled={globalCurrentIndex === allGlobalStatuses.length - 1}
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </>
            )}

            {/* Status indicators */}
            {allUserStatuses.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {allUserStatuses.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="p-6 space-y-4">
            {/* Status text */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {currentStatus.status_text}
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                {new Date(currentStatus.created_at).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
              <div className="text-xs text-muted-foreground">
                <span className="block">
                  {currentIndex + 1} sur {allUserStatuses.length} (cette carte)
                </span>
                <span className="block">
                  {globalCurrentIndex + 1} sur {allGlobalStatuses.length} (tous les statuts)
                </span>
              </div>
            </div>

            {/* Like button */}
            <Button
              variant={isLiked ? "default" : "outline"}
              className="w-full gap-2"
              onClick={handleLike}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              {isLiked ? 'Aimé' : 'Aimer ce statut'}
            </Button>

            {/* Message input */}
            <div className="flex gap-2">
              <Input
                placeholder="Envoie un message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button
                size="sm"
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="px-3"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};