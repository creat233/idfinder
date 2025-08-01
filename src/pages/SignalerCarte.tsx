
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
import { checkAndNotifyCardOwner } from "@/utils/notificationUtils";

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

      // Insérer la carte signalée
      const { error } = await supabase.from("reported_cards").insert({
        card_number: data.cardNumber,
        location: data.location,
        found_date: data.foundDate,
        description: data.description,
        document_type: data.documentType,
        photo_url: data.photoUrl,
        reporter_id: user.id,
        reporter_phone: userPhone,
        status: status,
      });

      if (error) throw error;

      console.log("✅ Carte signalée avec succès, vérification du propriétaire...");

      // NOUVELLE FONCTION : Vérifier automatiquement s'il faut notifier le propriétaire
      if (data.cardNumber) {
        try {
          const notificationResult = await checkAndNotifyCardOwner(data.cardNumber);
          if (notificationResult.success) {
            console.log("✅ Notification automatique envoyée au propriétaire");
          } else {
            console.log("ℹ️ Pas de notification automatique:", notificationResult.message);
          }
        } catch (notificationError) {
          console.error("⚠️ Erreur lors de la notification automatique:", notificationError);
          // On continue même si la notification échoue
        }
      }

      if (data.documentType === "student_card") {
        showSuccess(
          t("studentCardReported"),
          t("studentCardMessage")
        );
      } else if (data.documentType === "health_card") {
        showSuccess(
          t("healthCardReported"),
          t("healthCardMessage")
        );
      } else {
        showSuccess(
          t("cardReported"),
          t("thankYouMessage")
        );
      }

      navigate("/");
    } catch (error) {
      console.error("Error submitting form:", error);
      showError(
        t("error"),
        t("submitError")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFreeService = watchedDocumentType === "student_card" || watchedDocumentType === "health_card";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8" style={{ paddingTop: '120px' }}>
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">{t("signalCard")}</h1>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <DocumentTypeField form={form} />

            <FormField
              name="cardNumber"
              label={t("cardNumber")}
              placeholder={t("enterCardNumber")}
              control={form.control}
            />

            <LocationField 
              form={form}
              label={t("location")}
              placeholder={t("locationPlaceholder")}
            />

            <FormField
              name="foundDate"
              label={t("foundDate")}
              type="date"
              placeholder=""
              control={form.control}
            />

            <FormField
              name="description"
              label={t("description")}
              placeholder={t("descriptionPlaceholder")}
              control={form.control}
              textarea
            />

            <PhotoUpload form={form} />

            {isFreeService && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">
                  {watchedDocumentType === "student_card" 
                    ? t("freeServiceStudentCards")
                    : t("freeServiceHealthCards")
                  }
                </h3>
                <p className="text-sm text-blue-700">
                  {watchedDocumentType === "student_card" 
                    ? t("studentCardInfo")
                    : t("healthCardInfo")
                  }
                </p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? t("sending") : t("signalCard")}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default SignalerCarte;
