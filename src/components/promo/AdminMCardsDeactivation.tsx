import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2, AlertTriangle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface MCardDeactivationProps {
  mcard: {
    id: string;
    full_name: string;
    plan: string;
    subscription_status: string;
    user_email: string;
    slug: string;
  };
  onDeactivationSuccess: () => void;
}

export const MCardDeactivationButton = ({ mcard, onDeactivationSuccess }: MCardDeactivationProps) => {
  const [isDeactivating, setIsDeactivating] = useState(false);
  const { toast } = useToast();

  const handleDeactivateMCard = async () => {
    setIsDeactivating(true);
    
    try {
      const { data, error } = await supabase.rpc('admin_deactivate_mcard', {
        p_mcard_id: mcard.id
      });

      if (error) {
        console.error('Erreur lors de la désactivation:', error);
        throw error;
      }

      if (data && data[0]?.success) {
        toast({
          title: "Carte désactivée !",
          description: data[0].message,
        });
        onDeactivationSuccess();
      } else {
        throw new Error(data?.[0]?.message || "Erreur inconnue lors de la désactivation");
      }
    } catch (error: any) {
      console.error('Erreur complète:', error);
      toast({
        variant: "destructive",
        title: "Erreur de désactivation",
        description: error.message || "Impossible de désactiver la carte. Vérifiez les logs pour plus de détails.",
      });
    } finally {
      setIsDeactivating(false);
    }
  };

  const isActive = mcard.subscription_status === 'active';

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={isActive ? "destructive" : "outline"}
          size="sm"
          disabled={isDeactivating}
          className={isActive ? "hover:bg-red-600" : "cursor-not-allowed opacity-50"}
        >
          {isDeactivating ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          ) : (
            <Trash2 className="h-4 w-4 mr-2" />
          )}
          {isActive ? "Désactiver" : "Déjà inactive"}
        </Button>
      </AlertDialogTrigger>
      
      {isActive && (
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Confirmer la désactivation
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>
                Êtes-vous sûr de vouloir désactiver la carte <strong>"{mcard.full_name}"</strong> ?
              </p>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <h4 className="font-medium text-yellow-800 mb-2">⚠️ Conséquences de la désactivation :</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• La carte ne sera plus visible publiquement</li>
                  <li>• Le statut passera à "expiré"</li>
                  <li>• L'utilisateur sera notifié par email</li>
                  <li>• Cette action sera enregistrée dans les logs d'audit</li>
                </ul>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <h4 className="font-medium text-gray-800 mb-1">Informations de la carte :</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Propriétaire :</strong> {mcard.user_email}</p>
                  <p><strong>Plan :</strong> {mcard.plan}</p>
                  <p><strong>Slug :</strong> {mcard.slug}</p>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeactivateMCard}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeactivating}
            >
              {isDeactivating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Désactivation...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Confirmer la désactivation
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      )}
    </AlertDialog>
  );
};