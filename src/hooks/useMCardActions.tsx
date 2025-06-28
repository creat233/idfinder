
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const useMCardActions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast({
      title: "Lien copié !",
      description: "Le lien de votre mCard a été copié dans le presse-papiers"
    });
  };

  const handleEdit = (mcardId?: string) => {
    navigate('/mcards', { state: { editMCardId: mcardId } });
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
