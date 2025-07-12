
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Star, MessageSquare, User, Plus, Check, X, LogIn } from "lucide-react";
import { MCardReview } from "@/types/mcard";
import { useToast } from "@/hooks/use-toast";
import { createMCardReview, approveReview } from "@/services/mcardReviewService";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

interface MCardViewReviewsProps {
  reviews: MCardReview[];
  mcardId: string;
  isOwner: boolean;
  onReviewsChange: () => void;
}

export const MCardViewReviews = ({ 
  reviews, 
  mcardId, 
  isOwner,
  onReviewsChange 
}: MCardViewReviewsProps) => {
  const [showAddReview, setShowAddReview] = useState(false);
  const [newReview, setNewReview] = useState({
    visitor_name: '',
    visitor_email: '',
    rating: 5,
    comment: ''
  });
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const { toast } = useToast();

  // Récupérer les informations de l'utilisateur connecté
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        if (user) {
          // Récupérer le profil de l'utilisateur
          const { data: profile } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', user.id)
            .single();

          setUserProfile(profile);

          // Pré-remplir les champs
          if (profile) {
            const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
            setNewReview(prev => ({
              ...prev,
              visitor_name: fullName || user.email?.split('@')[0] || '',
              visitor_email: user.email || ''
            }));
          }
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleSubmitReview = async () => {
    if (!newReview.visitor_name.trim()) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le nom est requis pour laisser un avis."
      });
      return;
    }

    setLoading(true);
    try {
      await createMCardReview({
        mcard_id: mcardId,
        visitor_name: newReview.visitor_name.trim(),
        visitor_email: newReview.visitor_email.trim() || undefined,
        rating: newReview.rating,
        comment: newReview.comment.trim() || undefined
      });

      toast({
        title: "Avis envoyé !",
        description: "Votre avis a été envoyé et sera visible après approbation du propriétaire."
      });

      // Réinitialiser seulement les champs modifiables
      setNewReview(prev => ({
        ...prev,
        rating: 5,
        comment: ''
      }));
      setShowAddReview(false);
      onReviewsChange();
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'avis:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'envoyer l'avis. Veuillez réessayer."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproveReview = async (reviewId: string) => {
    try {
      await approveReview(reviewId);
      toast({
        title: "Avis approuvé",
        description: "L'avis est maintenant visible publiquement."
      });
      onReviewsChange();
    } catch (error) {
      console.error('Erreur lors de l\'approbation:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'approuver l'avis."
      });
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating 
            ? 'text-yellow-400 fill-yellow-400' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const approvedReviews = reviews.filter(review => review.is_approved);
  const pendingReviews = reviews.filter(review => !review.is_approved);

  return (
    <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-t-lg">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl text-gray-800">
            <MessageSquare className="h-5 w-5 text-yellow-600" />
            Avis & Témoignages
            {approvedReviews.length > 0 && (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                {approvedReviews.length}
              </Badge>
            )}
          </CardTitle>
          {!isOwner && user && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowAddReview(!showAddReview)}
              className="bg-white/50 hover:bg-white/80 backdrop-blur-sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Laisser un avis
            </Button>
          )}
          {!isOwner && !user && (
            <Link to="/auth">
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Se connecter pour laisser un avis
              </Button>
            </Link>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {/* Formulaire d'ajout d'avis */}
        {showAddReview && !isOwner && (
          <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border">
            <h4 className="font-semibold mb-4 text-gray-800">Laisser votre avis</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom * <span className="text-xs text-green-600">(récupéré de votre profil)</span>
                  </label>
                  <Input
                    value={newReview.visitor_name}
                    disabled
                    className="bg-gray-50 text-gray-700"
                    placeholder="Votre nom"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-xs text-green-600">(récupéré de votre compte)</span>
                  </label>
                  <Input
                    type="email"
                    value={newReview.visitor_email}
                    disabled
                    className="bg-gray-50 text-gray-700"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Note
                </label>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star
                      key={index}
                      className={`h-6 w-6 cursor-pointer transition-colors ${
                        index < newReview.rating 
                          ? 'text-yellow-400 fill-yellow-400 hover:text-yellow-500' 
                          : 'text-gray-300 hover:text-yellow-300'
                      }`}
                      onClick={() => setNewReview(prev => ({ ...prev, rating: index + 1 }))}
                    />
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Commentaire (optionnel)
                </label>
                <Textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Partagez votre expérience..."
                  rows={3}
                />
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={handleSubmitReview}
                  disabled={loading}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
                >
                  {loading ? 'Envoi...' : 'Envoyer l\'avis'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAddReview(false)}
                >
                  Annuler
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Avis en attente (visibles uniquement par le propriétaire) */}
        {isOwner && pendingReviews.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold mb-3 text-gray-800 flex items-center gap-2">
              <Badge variant="outline" className="bg-orange-50 text-orange-700">
                {pendingReviews.length}
              </Badge>
              Avis en attente d'approbation
            </h4>
            <div className="space-y-3">
              {pendingReviews.map((review) => (
                <div key={review.id} className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <User className="h-4 w-4 text-gray-600" />
                        <span className="font-medium text-gray-800">{review.visitor_name}</span>
                        <div className="flex gap-1">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      {review.visitor_email && (
                        <p className="text-sm text-gray-600">{review.visitor_email}</p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleApproveReview(review.id)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Approuver
                    </Button>
                  </div>
                  {review.comment && (
                    <p className="text-gray-700 text-sm bg-white p-2 rounded border">{review.comment}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(review.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Avis approuvés */}
        {approvedReviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-8 w-8 text-gray-400" />
            </div>
            <p>Aucun avis pour le moment</p>
            {!isOwner && (
              <p className="text-sm mt-2">Soyez le premier à laisser un avis !</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {approvedReviews.map((review) => (
              <div key={review.id} className="p-4 bg-gradient-to-r from-white to-gray-50 rounded-lg border shadow-sm">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-600" />
                    <span className="font-medium text-gray-800">{review.visitor_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
                {review.comment && (
                  <p className="text-gray-700 text-sm mt-2 italic">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
