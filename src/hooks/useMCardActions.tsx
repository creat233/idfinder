
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
      // Utiliser le domaine personnalisé finderid.info pour les liens
      const currentUrl = window.location.href;
      const url = new URL(currentUrl);
      
      // Si on est en production, utiliser le domaine personnalisé
      let finalUrl = currentUrl;
      if (url.hostname.includes('lovable.app') || url.hostname.includes('localhost')) {
        // En développement, garder l'URL actuelle
        finalUrl = currentUrl;
      } else {
        // En production, s'assurer qu'on utilise finderid.info
        finalUrl = currentUrl.replace(url.origin, 'https://www.finderid.info');
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

  const handleEdit = (mcardId?: string) => {
    if (mcardId) {
      // Naviguer vers la page des mCards avec l'ID à éditer
      navigate('/mcards', { state: { editMCardId: mcardId } });
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
