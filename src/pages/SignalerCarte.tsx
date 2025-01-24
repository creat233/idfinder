import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/Header";
import { LocationField } from "@/components/card-report/LocationField";
import { PhotoUpload } from "@/components/card-report/PhotoUpload";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { FormField } from "@/components/card-report/FormField";

interface FormValues {
  cardNumber?: string;
  location?: string;
  foundDate?: string;
  description?: string;
  documentType?: string;
  photoUrl?: string;
}

const SignalerCarte = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    defaultValues: {
      cardNumber: "",
      location: "",
      foundDate: "",
      description: "",
      documentType: "id",
      photoUrl: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase.from("reported_cards").insert({
        card_number: data.cardNumber,
        location: data.location,
        found_date: data.foundDate,
        description: data.description,
        document_type: data.documentType,
        photo_url: data.photoUrl,
        reporter_id: user.id,
      });

      if (error) throw error;

      toast({
        title: "Carte signalée avec succès",
        description: "Merci d'avoir signalé cette carte",
      });

      navigate("/");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la soumission du formulaire",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Signaler une carte trouvée</h1>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Type de document</label>
              <Select
                name="documentType"
                defaultValue={form.getValues("documentType")}
                onValueChange={(value) => form.setValue("documentType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez le type de document" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="id">Carte d'identité</SelectItem>
                  <SelectItem value="driver_license">Permis de conduire</SelectItem>
                  <SelectItem value="passport">Passeport</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <FormField
              name="cardNumber"
              label="Numéro de la carte"
              placeholder="Entrez le numéro de la carte"
              control={form.control}
            />

            <LocationField form={form} />

            <FormField
              name="foundDate"
              label="Date de découverte"
              type="date"
              placeholder=""
              control={form.control}
            />

            <FormField
              name="description"
              label="Description"
              placeholder="Ajoutez des détails sur l'endroit où vous avez trouvé la carte"
              control={form.control}
              textarea
            />

            <PhotoUpload form={form} />

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Envoi en cours..." : "Signaler la carte"}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default SignalerCarte;