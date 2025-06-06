
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/useToast";
import { Header } from "@/components/Header";
import { LocationField } from "@/components/card-report/LocationField";
import { PhotoUpload } from "@/components/card-report/PhotoUpload";
import { DocumentTypeField } from "@/components/card-report/DocumentTypeField";
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
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

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

  const watchedDocumentType = form.watch("documentType");

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Pour les cartes étudiantes, on définit un statut spécial
      const status = data.documentType === "student_card" ? "public_contact" : "pending";

      const { error } = await supabase.from("reported_cards").insert({
        card_number: data.cardNumber,
        location: data.location,
        found_date: data.foundDate,
        description: data.description,
        document_type: data.documentType,
        photo_url: data.photoUrl,
        reporter_id: user.id,
        status: status,
      });

      if (error) throw error;

      if (data.documentType === "student_card") {
        showSuccess(
          "Carte étudiante signalée avec succès",
          "Votre numéro sera affiché directement pour que l'étudiant puisse vous contacter"
        );
      } else {
        showSuccess(
          "Carte signalée avec succès",
          "Merci d'avoir signalé cette carte"
        );
      }

      navigate("/");
    } catch (error) {
      console.error("Error submitting form:", error);
      showError(
        "Erreur",
        "Une erreur est survenue lors de la soumission du formulaire"
      );
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
            <DocumentTypeField form={form} />

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

            {watchedDocumentType === "student_card" && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Service gratuit pour cartes étudiantes</h3>
                <p className="text-sm text-blue-700">
                  En signalant une carte étudiante, votre numéro de téléphone sera visible directement 
                  pour que l'étudiant puisse vous contacter immédiatement. C'est un service gratuit 
                  pour faciliter la récupération des cartes étudiantes.
                </p>
              </div>
            )}

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
