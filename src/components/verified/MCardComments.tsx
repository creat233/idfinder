import { useState, useEffect } from 'react';
import { Star, MessageCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Review {
  id: string;
  visitor_name: string;
  comment: string;
  rating: number;
  created_at: string;
}

interface MCardCommentsProps {
  mcardId: string;
  mcardOwnerName: string;
  className?: string;
}

export const MCardComments = ({ mcardId, mcardOwnerName, className = "" }: MCardCommentsProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [visitorName, setVisitorName] = useState('');
  const [visitorEmail, setVisitorEmail] = useState('');
  const [rating, setRating] = useState(5);
  const { toast } = useToast();

  useEffect(() => {
    loadReviews();
  }, [mcardId]);

  const loadReviews = async () => {
    try {
      const { data, error } = await supabase.rpc('get_public_reviews', {
        p_mcard_id: mcardId
      });

      if (error) {
        console.error('Error loading reviews:', error);
        return;
      }

      setReviews(data || []);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !visitorName.trim()) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('mcard_reviews')
        .insert({
          mcard_id: mcardId,
          visitor_name: visitorName.trim(),
          visitor_email: visitorEmail.trim() || null,
          comment: newComment.trim(),
          rating: rating,
          is_approved: false // Les commentaires doivent être approuvés
        });

      if (error) {
        throw error;
      }

      toast({
        title: "✅ Commentaire envoyé !",
        description: "Votre commentaire a été envoyé au propriétaire de la carte."
      });

      // Créer une notification pour le propriétaire
      try {
        const { data: mcardData } = await supabase
          .from('mcards')
          .select('user_id, full_name')
          .eq('id', mcardId)
          .single();

        if (mcardData) {
          await supabase
            .from('notifications')
            .insert({
              user_id: mcardData.user_id,
              type: 'new_review',
              title: '💬 Nouveau commentaire reçu',
              message: `${visitorName} a laissé un commentaire sur votre carte "${mcardData.full_name}".`,
              is_read: false
            });
        }
      } catch (notificationError) {
        console.error('Error creating notification:', notificationError);
        // Ne pas faire échouer l'opération si la notification échoue
      }

      // Reset form
      setNewComment('');
      setVisitorName('');
      setVisitorEmail('');
      setRating(5);
      setShowCommentForm(false);

    } catch (error) {
      console.error('Error submitting comment:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'envoyer le commentaire. Veuillez réessayer."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={() => interactive && onRatingChange?.(star)}
          />
        ))}
      </div>
    );
  };

  return (
    <Card className={`${className} bg-white/10 backdrop-blur-xl border-white/20`}>
      <CardHeader className="pb-4">
        <CardTitle className="text-white flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Laisser un avis
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Button to show comment form */}
        {!showCommentForm && (
          <Button
            onClick={() => setShowCommentForm(true)}
            className="w-full bg-white/20 hover:bg-white/30 text-white border-white/20"
            variant="outline"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Laisser un avis à {mcardOwnerName}
          </Button>
        )}

        {/* Comment form */}
        {showCommentForm && (
          <div className="space-y-4 bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">
                Votre nom *
              </label>
              <Input
                value={visitorName}
                onChange={(e) => setVisitorName(e.target.value)}
                placeholder="Votre nom"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">
                Email (optionnel)
              </label>
              <Input
                type="email"
                value={visitorEmail}
                onChange={(e) => setVisitorEmail(e.target.value)}
                placeholder="votre@email.com"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">
                Note *
              </label>
              {renderStars(rating, true, setRating)}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">
                Votre commentaire *
              </label>
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={`Partagez votre expérience avec ${mcardOwnerName}...`}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-[100px]"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleSubmitComment}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                Publier l'avis
              </Button>
              <Button
                onClick={() => setShowCommentForm(false)}
                variant="outline"
                className="border-white/20 text-white/80 hover:bg-white/10"
              >
                Annuler
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};