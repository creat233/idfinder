import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FormField } from "@/components/card-report/FormField";
import { LocationField } from "@/components/card-report/LocationField";
import PhotoUpload from "@/components/card-report/PhotoUpload";
import { ArrowLeft } from "lucide-react";

const formSchema = z.object({
  cardNumber: z.string()
    .min(1, "Le numéro de la carte est requis")
    .regex(/^\d+$/, "Le numéro de la carte doit contenir uniquement des chiffres"),
  location: z.string()
    .min(1, "Le lieu de découverte est requis"),
  foundDate: z.string()
    .min(1, "La date de découverte est requise"),
  description: z.string()
    .optional(),
});

const SignalerCarte = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const mounted = useRef(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cardNumber: "",
      location: "",
      foundDate: "",
      description: "",
    },
  });

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (!mounted.current) return;
      setIsSubmitting(true);
      
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) {
        if (mounted.current) {
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Vous devez être connecté pour signaler une carte",
          });
        }
        return;
      }

      let photoUrl = null;
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('card_photos')
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('card_photos')
          .getPublicUrl(filePath);

        photoUrl = publicUrl;
      }

      const { error } = await supabase
        .from('reported_cards')
        .insert([
          {
            reporter_id: user.id,
            card_number: values.cardNumber,
            location: values.location,
            found_date: values.foundDate,
            description: values.description || null,
            photo_url: photoUrl,
          },
        ]);

      if (error) throw error;

      if (mounted.current) {
        toast({
          title: "Signalement envoyé",
          description: "Votre signalement a été enregistré avec succès",
        });
        navigate("/");
      }
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      if (mounted.current) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue lors de l'envoi du signalement",
        });
      }
    } finally {
      if (mounted.current) {
        setIsSubmitting(false);
      }
    }
  };

  const handleFileChange = (newFile: File | null) => {
    if (mounted.current) {
      setFile(newFile);
      setUploadError(null);
    }
  };

  return (
    <div className="container max-w-2xl py-10">
      <div className="flex items-center mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Button>
      </div>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Signaler une carte trouvée</h1>
          <p className="text-muted-foreground mt-2">
            Remplissez ce formulaire pour signaler une carte d'identité que vous avez trouvée
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="cardNumber"
              label="Numéro de la carte"
              placeholder="Entrez le numéro de la carte"
            />

            <LocationField
              control={form.control}
              name="location"
              label="Lieu de découverte"
              placeholder="Où avez-vous trouvé la carte ?"
            />

            <FormField
              control={form.control}
              name="foundDate"
              label="Date de découverte"
              type="date"
              placeholder="Quand avez-vous trouvé la carte ?"
            />

            <FormField
              control={form.control}
              name="description"
              label="Description (facultatif)"
              placeholder="Ajoutez des détails supplémentaires"
              textarea
            />

            <PhotoUpload
              onFileChange={handleFileChange}
              currentFile={file}
            />

            {uploadError && (
              <p className="text-sm text-red-500 mt-2">{uploadError}</p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Envoi en cours..." : "Envoyer le signalement"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SignalerCarte;
