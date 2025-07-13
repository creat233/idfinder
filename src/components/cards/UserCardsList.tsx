
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Shield, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface UserCard {
  id: string;
  card_number: string;
  document_type: string;
  card_holder_name?: string;
  is_active: boolean;
  created_at: string;
}

interface UserCardsListProps {
  cards: UserCard[];
  onRefresh: () => void;
}

export const UserCardsList = ({ cards, onRefresh }: UserCardsListProps) => {
  const { toast } = useToast();
  const [deletingCardId, setDeletingCardId] = useState<string | null>(null);

  const getDocumentTypeDisplay = (type: string) => {
    const types: { [key: string]: string } = {
      'id': 'Carte d\'identité',
      'passport': 'Passeport',
      'driver_license': 'Permis de conduire',
      'student_card': 'Carte étudiante',
      'health_card': 'Carte de santé',
      'residence_permit': 'Carte de séjour',
      'vehicle_registration': 'Carte grise',
      'motorcycle_registration': 'Carte grise moto'
    };
    return types[type] || type;
  };

  const handleDeleteCard = async (cardId: string) => {
    try {
      setDeletingCardId(cardId);
      
      const { error } = await supabase
        .from('user_cards')
        .delete()
        .eq('id', cardId);

      if (error) {
        throw error;
      }

      toast({
        title: "Carte supprimée",
        description: "La carte a été supprimée de votre liste de surveillance."
      });

      onRefresh();
    } catch (error: any) {
      console.error('Error deleting card:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Impossible de supprimer la carte"
      });
    } finally {
      setDeletingCardId(null);
    }
  };

  const handleToggleVisibility = async (cardId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('user_cards')
        .update({ is_active: !currentStatus })
        .eq('id', cardId);

      if (error) {
        throw error;
      }

      toast({
        title: currentStatus ? "Carte masquée" : "Carte visible",
        description: currentStatus 
          ? "La carte ne recevra plus de notifications de récupération"
          : "La carte recevra de nouveau des notifications de récupération"
      });

      onRefresh();
    } catch (error: any) {
      console.error('Error toggling card visibility:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Impossible de modifier la visibilité de la carte"
      });
    }
  };

  if (cards.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Shield className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">Aucune carte ajoutée</p>
          <p className="text-sm text-gray-400 mt-2">
            Ajoutez vos cartes pour être notifié si elles sont retrouvées
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {cards.map((card) => (
        <Card key={card.id} className={`transition-all ${!card.is_active ? 'opacity-60 border-gray-300' : ''}`}>
          <CardHeader className="pb-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <CardTitle className="text-base sm:text-lg">
                {getDocumentTypeDisplay(card.document_type)}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant={card.is_active ? "default" : "secondary"}>
                  {card.is_active ? "Active" : "Masquée"}
                </Badge>
                {!card.is_active && (
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            <div className="space-y-2">
              <div className="text-sm text-gray-600">
                <strong>Numéro:</strong> 
                <span className="font-mono ml-1 break-all">{card.card_number}</span>
              </div>
              {card.card_holder_name && (
                <div className="text-sm text-gray-600">
                  <strong>Nom:</strong> 
                  <span className="ml-1">{card.card_holder_name}</span>
                </div>
              )}
              <p className="text-sm text-gray-500">
                Ajoutée le {new Date(card.created_at).toLocaleDateString('fr-FR')}
              </p>
              {!card.is_active && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 mt-2">
                  <p className="text-xs text-yellow-700">
                    Cette carte est masquée. Vous ne recevrez pas de notifications si elle est retrouvée.
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleToggleVisibility(card.id, card.is_active)}
                className="flex-1 sm:flex-none"
              >
                {card.is_active ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Masquer</span>
                    <span className="sm:hidden">Masquer</span>
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Activer</span>
                    <span className="sm:hidden">Activer</span>
                  </>
                )}
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={deletingCardId === card.id}
                    className="sm:w-auto"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Supprimer</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Supprimer la carte ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Êtes-vous sûr de vouloir supprimer cette carte ({card.card_number}) de votre liste de surveillance ? 
                      Cette action est irréversible et vous ne recevrez plus de notifications si cette carte est retrouvée.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDeleteCard(card.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Supprimer définitivement
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
