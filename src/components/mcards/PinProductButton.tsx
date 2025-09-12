import { useState } from "react";
import { Pin, PinOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PinProductButtonProps {
  productId: string;
  isPinned: boolean;
  onPinToggle?: (productId: string, isPinned: boolean) => void;
}

export const PinProductButton = ({ productId, isPinned, onPinToggle }: PinProductButtonProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleTogglePin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('mcard_products')
        .update({ is_pinned: !isPinned })
        .eq('id', productId);

      if (error) throw error;

      onPinToggle?.(productId, !isPinned);
      
      toast({
        title: isPinned ? "Produit désépinglé" : "Produit épinglé",
        description: isPinned 
          ? "Le produit a été retiré des épinglés" 
          : "Le produit a été ajouté aux épinglés",
      });
    } catch (error) {
      console.error('Erreur lors du changement d\'épinglage:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de modifier l'épinglage du produit",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={isPinned ? "default" : "outline"}
      size="sm"
      onClick={handleTogglePin}
      disabled={loading}
      className={`${isPinned ? 'bg-yellow-500 hover:bg-yellow-600' : ''}`}
    >
      {isPinned ? (
        <PinOff className="h-4 w-4 mr-2" />
      ) : (
        <Pin className="h-4 w-4 mr-2" />
      )}
      {isPinned ? "Désépingler" : "Épingler"}
    </Button>
  );
};