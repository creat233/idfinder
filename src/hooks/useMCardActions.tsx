
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const useMCardActions = () => {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCopyLink = async () => {
    try {
      // Toujours utiliser le domaine finderid.info pour les liens copiés
      const currentUrl = window.location.href;
      let finalUrl = currentUrl;
      
      // Si on est sur un lien /mcard/, le convertir en finderid.info
      if (currentUrl.includes('/mcard/')) {
        const slugMatch = currentUrl.match(/\/mcard\/([^?&#]+)/);
        if (slugMatch && slugMatch[1]) {
          finalUrl = `https://www.finderid.info/mcard/${slugMatch[1]}`;
        }
      }
      
      await navigator.clipboard.writeText(finalUrl);
      toast({
        title: "✅ Lien copié",
        description: "Le lien de votre MCard a été copié dans le presse-papiers"
      });
    } catch (error) {
      console.error('Erreur lors de la copie:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de copier le lien"
      });
    }
  };

  const handleEdit = (mcardId?: string, onSuccess?: () => void) => {
    if (mcardId) {
      // Naviguer vers la page des mCards avec l'ID à éditer
      // Passer le callback onSuccess pour rafraîchir après mise à jour
      navigate('/mcards', { state: { editMCardId: mcardId, onUpdateSuccess: onSuccess } });
    } else {
      console.error('ID de la mCard manquant pour l\'édition');
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'éditer cette carte"
      });
    }
  };

  return {
    isShareDialogOpen,
    setIsShareDialogOpen,
    showQRCode,
    setShowQRCode,
    handleCopyLink,
    handleEdit
  };
};
