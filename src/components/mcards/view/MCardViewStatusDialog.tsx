
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface MCardViewStatusDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  mcardId: string;
  onStatusAdded: () => void;
}

export const MCardViewStatusDialog = ({ isOpen, onOpenChange, mcardId, onStatusAdded }: MCardViewStatusDialogProps) => {
  const [statusText, setStatusText] = useState("");
  const [statusColor, setStatusColor] = useState("#3B82F6");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusText.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('mcard_statuses')
        .insert({
          mcard_id: mcardId,
          status_text: statusText.trim(),
          status_color: statusColor,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        });

      if (error) throw error;

      toast({
        title: "Statut ajouté !",
        description: "Votre statut a été ajouté avec succès."
      });

      setStatusText("");
      setStatusColor("#3B82F6");
      onStatusAdded();
      onOpenChange(false);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du statut:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter le statut. Vérifiez que vous avez un plan Premium."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un statut</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="status-text">Texte du statut</Label>
            <Input
              id="status-text"
              value={statusText}
              onChange={(e) => setStatusText(e.target.value)}
              placeholder="Ex: Disponible, En réunion, Absent..."
              maxLength={50}
              required
            />
          </div>
          <div>
            <Label htmlFor="status-color">Couleur</Label>
            <div className="flex items-center gap-2">
              <Input
                id="status-color"
                type="color"
                value={statusColor}
                onChange={(e) => setStatusColor(e.target.value)}
                className="w-16 h-10"
              />
              <Input
                value={statusColor}
                onChange={(e) => setStatusColor(e.target.value)}
                placeholder="#3B82F6"
                className="flex-1"
              />
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Le statut sera automatiquement supprimé après 24 heures.
          </p>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading || !statusText.trim()}>
              {loading ? "Ajout..." : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
