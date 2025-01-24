import { useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PhotoUpload } from "@/components/card-report/PhotoUpload";
import { LocationField } from "@/components/card-report/LocationField";

const formSchema = z.object({
  cardNumber: z.string().min(1, "Le numéro de la carte est requis"),
  location: z.string().min(1, "La localisation est requise"),
  foundDate: z.string().min(1, "La date de découverte est requise"),
  description: z.string().optional(),
  documentType: z.string().min(1, "Le type de document est requis"),
  photoUrl: z.string().optional(),
});

export default function SignalerCarte() {
  const mounted = useRef(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cardNumber: "",
      location: "",
      foundDate: "",
      description: "",
      documentType: "id",
      photoUrl: "",
    },
  });

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
      if (form) {
        form.reset();
      }
    };
  }, [form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Vous devez être connecté pour signaler une carte",
        });
        navigate("/login");
        return;
      }

      const { error } = await supabase.from("reported_cards").insert({
        card_number: values.cardNumber,
        location: values.location,
        found_date: values.foundDate,
        description: values.description,
        document_type: values.documentType,
        photo_url: values.photoUrl,
        reporter_id: session.user.id,
      });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "La carte a été signalée avec succès",
      });

      if (mounted.current) {
        form.reset();
        navigate("/");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la soumission du formulaire",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-6 px-4 space-y-6">
        <h1 className="text-2xl font-bold">Signaler une carte trouvée</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="cardNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Numéro de la carte</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <LocationField form={form} />

            <FormField
              control={form.control}
              name="foundDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date de découverte</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <Label htmlFor="documentType">Type de document</Label>
              <Select
                name="documentType"
                defaultValue={form.getValues("documentType")}
                onValueChange={(value) => {
                  if (mounted.current) {
                    form.setValue("documentType", value, {
                      shouldValidate: true,
                    });
                  }
                }}
              >
                <SelectTrigger id="documentType">
                  <SelectValue placeholder="Sélectionnez le type de document" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="id">Carte d'identité</SelectItem>
                  <SelectItem value="driver_license">Permis de conduire</SelectItem>
                  <SelectItem value="passport">Passeport</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optionnel)</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <PhotoUpload form={form} />

            <Button type="submit" className="w-full">
              Signaler la carte
            </Button>
          </form>
        </Form>
      </main>
    </div>
  );
}