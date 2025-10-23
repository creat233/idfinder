import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SelectMCardDialog } from "@/components/mcards/SelectMCardDialog";
import { MCard } from "@/types/mcard";
import { Loader2, Star, CheckCircle2 } from "lucide-react";

export const AdminFeaturedMCard = () => {
  const [mcards, setMcards] = useState<MCard[]>([]);
  const [featuredMCard, setFeaturedMCard] = useState<MCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchMCards();
    fetchFeaturedMCard();
  }, []);

  const fetchMCards = async () => {
    try {
      const { data, error } = await supabase
        .from('mcards')
        .select('*')
        .eq('is_published', true)
        .eq('subscription_status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMcards(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des mCards:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les mCards",
        variant: "destructive",
      });
    }
  };

  const fetchFeaturedMCard = async () => {
    try {
      setLoading(true);
      const { data: featuredData, error: featuredError } = await supabase
        .from('featured_mcards')
        .select('mcard_id')
        .eq('is_active', true)
        .single();

      if (featuredError && featuredError.code !== 'PGRST116') throw featuredError;

      if (featuredData) {
        const { data: mcardData, error: mcardError } = await supabase
          .from('mcards')
          .select('*')
          .eq('id', featuredData.mcard_id)
          .single();

        if (mcardError) throw mcardError;
        setFeaturedMCard(mcardData);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la mCard sponsorisée:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMCard = async (mcardId: string) => {
    try {
      // Désactiver toutes les mCards sponsorisées actuelles
      await supabase
        .from('featured_mcards')
        .update({ is_active: false })
        .eq('is_active', true);

      // Insérer la nouvelle mCard sponsorisée
      const { error } = await supabase
        .from('featured_mcards')
        .insert({
          mcard_id: mcardId,
          is_active: true,
          created_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "La mCard sponsorisée a été mise à jour",
      });

      fetchFeaturedMCard();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la mCard sponsorisée",
        variant: "destructive",
      });
    }
  };

  const handleRemoveFeatured = async () => {
    try {
      const { error } = await supabase
        .from('featured_mcards')
        .update({ is_active: false })
        .eq('is_active', true);

      if (error) throw error;

      setFeaturedMCard(null);
      toast({
        title: "Succès",
        description: "La mCard sponsorisée a été retirée",
      });
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Impossible de retirer la mCard sponsorisée",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            mCard Sponsorisée
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            mCard Sponsorisée - Page Exemple
          </CardTitle>
          <CardDescription>
            Sélectionnez une mCard à afficher sur la page "Exemple de mCard"
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {featuredMCard ? (
            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-semibold">{featuredMCard.full_name}</p>
                  <p className="text-sm text-muted-foreground">{featuredMCard.job_title}</p>
                  <p className="text-xs text-muted-foreground">{featuredMCard.company}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setIsDialogOpen(true)}>
                  Changer
                </Button>
                <Button variant="outline" onClick={handleRemoveFeatured}>
                  Retirer
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Aucune mCard sponsorisée sélectionnée
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Star className="h-4 w-4 mr-2" />
                Sélectionner une mCard
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <SelectMCardDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        mcards={mcards}
        onSelect={handleSelectMCard}
      />
    </>
  );
};
