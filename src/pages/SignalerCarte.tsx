
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
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
  const [userPhone, setUserPhone] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
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

  // Récupérer le profil de l'utilisateur pour obtenir son numéro de téléphone
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast.destructive({
            title: "Non connecté",
            description: "Vous devez être connecté pour signaler une carte",
          });
          navigate("/login");
          return;
        }

        // Récupérer le profil avec le numéro de téléphone
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("phone")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Erreur lors de la récupération du profil:", error);
        } else if (profile) {
          setUserPhone(profile.phone);
        }
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Inclure le numéro de téléphone du profil dans le signalement
      const { error } = await supabase.from("reported_cards").insert({
        card_number: data.cardNumber,
        location: data.location,
        found_date: data.foundDate,
        description: data.description,
        document_type: data.documentType,
        photo_url: data.photoUrl,
        reporter_id: user.id,
        reporter_phone: userPhone, // Ajout du numéro de téléphone
      });

      if (error) {
        console.error("Error submitting form:", error);
        throw error;
      }

      toast.default({
        title: "Carte signalée avec succès",
        description: "Merci d'avoir signalé cette carte",
      });

      navigate("/");
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.destructive({
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

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
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

              {/* Affichage du numéro de téléphone qui sera utilisé */}
              {userPhone ? (
                <div className="bg-blue-50 border border-blue-200 rounded p-3">
                  <p className="text-sm text-blue-800">
                    Votre numéro de téléphone <span className="font-semibold">({userPhone})</span> sera associé à ce signalement pour permettre de vous contacter.
                  </p>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                  <p className="text-sm text-yellow-800">
                    Aucun numéro de téléphone n'est associé à votre profil. 
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-sm ml-1 text-blue-600"
                      onClick={() => navigate("/profile")}
                    >
                      Ajouter un numéro
                    </Button>
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
          )}
        </div>
      </main>
    </div>
  );
};

export default SignalerCarte;
