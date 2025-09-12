import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ReportButtonProps {
  mcardId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ReportButton = ({ mcardId, className = "", size = 'md' }: ReportButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const reportReasons = [
    { value: 'spam', label: 'Spam ou contenu indésirable' },
    { value: 'inappropriate', label: 'Contenu inapproprié' },
    { value: 'fake', label: 'Faux profil ou informations frauduleuses' },
    { value: 'copyright', label: 'Violation de droits d\'auteur' },
    { value: 'harassment', label: 'Harcèlement ou intimidation' },
    { value: 'other', label: 'Autre' }
  ];

  const handleSubmit = async () => {
    if (!reason) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez sélectionner une raison"
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('mcard_reports')
        .insert({
          mcard_id: mcardId,
          reporter_id: user?.id || null,
          reporter_email: user?.email || null,
          report_reason: reason,
          report_description: description || null
        });

      if (error) throw error;

      toast({
        title: "Signalement envoyé",
        description: "Merci pour votre signalement. Notre équipe va l'examiner rapidement."
      });

      setIsOpen(false);
      setReason('');
      setDescription('');
    } catch (error) {
      console.error('Erreur lors du signalement:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'envoyer le signalement"
      });
    } finally {
      setLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(true);
        }}
        className={`
          ${sizeClasses[size]}
          text-red-500 hover:text-red-600 hover:bg-red-50
          transition-all duration-300 hover:scale-105
          ${className}
        `}
        title="Signaler cette carte"
      >
        <AlertTriangle className={iconSizes[size]} />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Signaler cette carte
            </DialogTitle>
            <DialogDescription>
              Aidez-nous à maintenir une communauté sûre en signalant les contenus inappropriés.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Raison du signalement *</label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Sélectionnez une raison" />
                </SelectTrigger>
                <SelectContent>
                  {reportReasons.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Description (optionnel)</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Donnez plus de détails sur le problème..."
                className="mt-1"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading || !reason}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {loading ? "Envoi..." : "Signaler"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};