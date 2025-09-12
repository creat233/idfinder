import { useState, useEffect } from 'react';
import { Star, MessageCircle, Eye, Trash2, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Review {
  id: string;
  visitor_name: string;
  visitor_email?: string;
  comment: string;
  rating: number;
  is_approved: boolean;
  created_at: string;
  mcard_id: string;
}

interface MCardOwnerReviewsProps {
  isOpen: boolean;
  onClose: () => void;
  mcardId?: string;
  mcardName?: string;
}

export const MCardOwnerReviews = ({ isOpen, onClose, mcardId, mcardName }: MCardOwnerReviewsProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && mcardId) {
      loadOwnerReviews();
    }
  }, [isOpen, mcardId]);

  const loadOwnerReviews = async () => {
    if (!mcardId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('mcard_reviews')
        .select('*')
        .eq('mcard_id', mcardId)
        .order('created_at', { ascending: false });

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

  const handleApproveReview = async (reviewId: string) => {
    try {
      const { error } = await supabase
        .from('mcard_reviews')
        .update({ is_approved: true })
        .eq('id', reviewId);

      if (error) throw error;

      setReviews(prev => prev.map(review => 
        review.id === reviewId 
          ? { ...review, is_approved: true }
          : review
      ));

      toast({
        title: "✅ Avis approuvé",
        description: "L'avis est maintenant visible publiquement"
      });
    } catch (error) {
      console.error('Error approving review:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'approuver l'avis"
      });
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      const { error } = await supabase
        .from('mcard_reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;

      setReviews(prev => prev.filter(review => review.id !== reviewId));

      toast({
        title: "🗑️ Avis supprimé",
        description: "L'avis a été supprimé définitivement"
      });
    } catch (error) {
      console.error('Error deleting review:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer l'avis"
      });
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const pendingReviews = reviews.filter(r => !r.is_approved);
  const approvedReviews = reviews.filter(r => r.is_approved);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Avis reçus pour "{mcardName}"
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-full overflow-hidden">
          {isLoading ? (
            <div className="space-y-4 p-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-lg p-4 animate-pulse">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                      <div className="h-3 bg-gray-300 rounded w-1/3"></div>
                      <div className="h-16 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Aucun avis reçu</p>
              <p className="text-sm">Les avis apparaîtront ici</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto space-y-6 p-4">
              {/* Avis en attente */}
              {pendingReviews.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-orange-600 mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    En attente d'approbation ({pendingReviews.length})
                  </h3>
                  <div className="space-y-4">
                    {pendingReviews.map((review) => (
                      <Card key={review.id} className="border-orange-200 bg-orange-50">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-gradient-to-br from-orange-500 to-red-500 text-white">
                                {review.visitor_name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium">{review.visitor_name}</h4>
                                <span className="text-xs text-gray-500">
                                  {new Date(review.created_at).toLocaleDateString('fr-FR')}
                                </span>
                              </div>
                              <div className="mb-2">
                                {renderStars(review.rating)}
                              </div>
                              <p className="text-gray-700 text-sm mb-3 leading-relaxed">
                                {review.comment}
                              </p>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleApproveReview(review.id)}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Approuver
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDeleteReview(review.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Supprimer
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Avis approuvés */}
              {approvedReviews.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-green-600 mb-4 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Avis publiés ({approvedReviews.length})
                  </h3>
                  <div className="space-y-4">
                    {approvedReviews.map((review) => (
                      <Card key={review.id} className="border-green-200 bg-green-50">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                                {review.visitor_name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium">{review.visitor_name}</h4>
                                <span className="text-xs text-gray-500">
                                  {new Date(review.created_at).toLocaleDateString('fr-FR')}
                                </span>
                              </div>
                              <div className="mb-2">
                                {renderStars(review.rating)}
                              </div>
                              <p className="text-gray-700 text-sm mb-3 leading-relaxed">
                                {review.comment}
                              </p>
                              <div className="flex justify-end">
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDeleteReview(review.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Supprimer
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};