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
        description: "Votre commentaire sera visible après validation par le propriétaire de la carte."
      });

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

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <Card className={`${className} bg-white/10 backdrop-blur-xl border-white/20`}>
      <CardHeader className="pb-4">
        <CardTitle className="text-white flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Avis et commentaires
          {reviews.length > 0 && (
            <Badge className="bg-white/20 text-white">
              {reviews.length} avis
            </Badge>
          )}
        </CardTitle>
        
        {reviews.length > 0 && (
          <div className="flex items-center gap-2 text-white/80">
            {renderStars(Math.round(Number(averageRating)))}
            <span className="font-medium">{averageRating}/5</span>
            <span className="text-sm">({reviews.length} avis)</span>
          </div>
        )}
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
            Laisser un avis
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

        {/* Reviews list */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white/5 rounded-lg p-4 border border-white/10 animate-pulse">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-white/20 rounded w-1/4"></div>
                    <div className="h-3 bg-white/20 rounded w-1/3"></div>
                    <div className="h-16 bg-white/20 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8 text-white/60">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucun avis pour le moment</p>
            <p className="text-sm">Soyez le premier à laisser un commentaire !</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-500 text-white">
                      {review.visitor_name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-white">{review.visitor_name}</h4>
                      <span className="text-xs text-white/60">
                        {new Date(review.created_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <div className="mb-2">
                      {renderStars(review.rating)}
                    </div>
                    <p className="text-white/80 text-sm leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};