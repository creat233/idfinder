
import { useState, useEffect } from "react";
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
import { useTranslation } from "@/hooks/useTranslation";

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
  const [userPhone, setUserPhone] = useState("");
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const { t } = useTranslation();

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

  // Récupérer le numéro de téléphone du profil utilisateur
  useEffect(() => {
    const getUserPhone = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('phone')
            .eq('id', user.id)
            .single();
          
          if (profile?.phone) {
            setUserPhone(profile.phone);
          }
        }
      } catch (error) {
        console.error('Error fetching user phone:', error);
      }
    };

    getUserPhone();
  }, []);

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Pour les cartes étudiantes et cartes de santé, on définit un statut spécial
      const status = (data.documentType === "student_card" || data.documentType === "health_card") ? "public_contact" : "pending";

      const { error } = await supabase.from("reported_cards").insert({
        card_number: data.cardNumber,
        location: data.location,
        found_date: data.foundDate,
        description: data.description,
        document_type: data.documentType,
        photo_url: data.photoUrl,
        reporter_id: user.id,
        reporter_phone: userPhone, // Utiliser le numéro de téléphone du profil
        status: status,
      });

      if (error) throw error;

      if (data.documentType === "student_card") {
        showSuccess(
          t("studentCardReported") || "Carte étudiante signalée avec succès",
          t("studentCardMessage") || "Votre numéro sera affiché directement pour que l'étudiant puisse vous contacter"
        );
      } else if (data.documentType === "health_card") {
        showSuccess(
          "Carte de santé signalée avec succès",
          "Votre numéro sera affiché directement pour que le propriétaire puisse vous contacter"
        );
      } else {
        showSuccess(
          t("cardReported") || "Carte signalée avec succès",
          t("thankYouMessage") || "Merci d'avoir signalé cette carte"
        );
      }

      navigate("/");
    } catch (error) {
      console.error("Error submitting form:", error);
      showError(
        t("error") || "Erreur",
        t("submitError") || "Une erreur est survenue lors de la soumission du formulaire"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFreeService = watchedDocumentType === "student_card" || watchedDocumentType === "health_card";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">{t("signalCard")}</h1>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <DocumentTypeField form={form} />

            <FormField
              name="cardNumber"
              label={t("cardNumber") || "Numéro de la carte"}
              placeholder={t("enterCardNumber") || "Entrez le numéro de la carte"}
              control={form.control}
            />

            <LocationField form={form} />

            <FormField
              name="foundDate"
              label={t("foundDate") || "Date de découverte"}
              type="date"
              placeholder=""
              control={form.control}
            />

            <FormField
              name="description"
              label={t("description") || "Description"}
              placeholder={t("descriptionPlaceholder") || "Ajoutez des détails sur l'endroit où vous avez trouvé la carte"}
              control={form.control}
              textarea
            />

            <PhotoUpload form={form} />

            {isFreeService && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">
                  {watchedDocumentType === "student_card" 
                    ? (t("freeServiceStudentCards") || "Service gratuit pour cartes étudiantes")
                    : "Service gratuit pour cartes de santé"
                  }
                </h3>
                <p className="text-sm text-blue-700">
                  {watchedDocumentType === "student_card" 
                    ? (t("studentCardInfo") || "En signalant une carte étudiante, votre numéro de téléphone sera visible directement pour que l'étudiant puisse vous contacter immédiatement. C'est un service gratuit pour faciliter la récupération des cartes étudiantes.")
                    : "En signalant une carte de santé, votre numéro de téléphone sera visible directement pour que le propriétaire puisse vous contacter immédiatement. C'est un service gratuit pour faciliter la récupération des cartes de santé."
                  }
                </p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (t("sending") || "Envoi en cours...") : (t("signalCard") || "Signaler la carte")}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default SignalerCarte;
