
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  email: z.string().email({ message: "Veuillez entrer une adresse email valide" }),
  message: z.string().min(10, { message: "Le message doit contenir au moins 10 caractères" })
});

interface ContactFormProps {
  supportEmail: string;
}

export const ContactForm = ({ supportEmail }: ContactFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: ""
    }
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      console.log("Form submitted:", values);
      
      // Format subject and body properly for mailto
      const subject = encodeURIComponent(`Message de ${values.name}`);
      const body = encodeURIComponent(`${values.message}\n\nEmail de contact: ${values.email}`);
      
      // Open mail client in a new window
      window.open(`mailto:${supportEmail}?subject=${subject}&body=${body}`, "_blank");
      
      toast({
        title: "Message envoyé",
        description: "Votre message a été préparé dans votre application de messagerie.",
      });
      
      form.reset();
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Erreur",
        description: "Un problème est survenu lors de l'envoi du message. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
    >
      <Card className="p-8 mb-12 border-t-4 border-t-primary">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Send className="mr-2 h-6 w-6 text-primary" />
          Contactez-nous
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input placeholder="Votre nom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-MAIL</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="votre-email@exemple.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Comment pouvons-nous vous aider ?" 
                      rows={5} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full sm:w-auto flex items-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></span>
              ) : (
                <Send className="h-4 w-4" />
              )}
              Envoyer le message
            </Button>
            
            <p className="text-xs text-gray-500 mt-2">
              En cliquant sur "Envoyer le message", votre application de messagerie s'ouvrira 
              avec les détails pré-remplis. Veuillez envoyer l'email pour compléter votre demande.
            </p>
          </form>
        </Form>
      </Card>
    </motion.div>
  );
};
