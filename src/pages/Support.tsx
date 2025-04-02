
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquare, ArrowLeft, PhoneCall, AlertTriangle, HelpCircle, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  email: z.string().email({ message: "Veuillez entrer une adresse email valide" }),
  message: z.string().min(10, { message: "Le message doit contenir au moins 10 caractères" })
});

const Support = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const supportEmail = "mcard1100@gmail.com";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: ""
    }
  });

  const handleContactSupport = () => {
    window.location.href = `mailto:${supportEmail}`;
  };

  const handleEmergencyNumbers = () => {
    navigate('/numeros-urgence');
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("Form submitted:", values);
    
    // Envoyer l'email à mcard1100@gmail.com (simulé ici)
    window.location.href = `mailto:${supportEmail}?subject=Message de ${values.name}&body=${values.message}%0A%0AEmail de contact: ${values.email}`;
    
    toast({
      title: "Message envoyé",
      description: "Nous vous répondrons dans les plus brefs délais.",
    });
    
    form.reset();
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow bg-white">
        <div className="container mx-auto py-12 px-4">
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

          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold mb-4">Assistance et FAQ</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Besoin d'aide ? Nous sommes là pour vous assister avec toutes vos questions concernant FinderID.
            </p>
          </motion.div>
          
          <div className="max-w-3xl mx-auto">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.2
                  }
                }
              }}
              className="flex flex-col md:flex-row gap-6 mb-12"
            >
              <motion.div variants={fadeInUp} className="flex-1">
                <Card className="p-8 text-center h-full border-l-4 border-l-secondary">
                  <MessageSquare className="w-12 h-12 text-secondary mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-4">Besoin d'aide ?</h2>
                  <p className="text-gray-600 mb-6">
                    Notre équipe d'assistance est disponible pour répondre à toutes vos questions<br />
                    Email: {supportEmail}
                  </p>
                  <Button size="lg" onClick={handleContactSupport} className="w-full">Contacter le support</Button>
                </Card>
              </motion.div>
              
              <motion.div variants={fadeInUp} className="flex-1">
                <Card className="p-8 text-center h-full border-l-4 border-l-red-500 bg-gradient-to-br from-white to-red-50">
                  <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-4">Numéros d'Urgence</h2>
                  <p className="text-gray-600 mb-6">
                    Accédez rapidement aux numéros d'urgence<br />
                    disponibles au Sénégal
                  </p>
                  <Button size="lg" onClick={handleEmergencyNumbers} variant="destructive" className="w-full">
                    <PhoneCall className="mr-2 h-5 w-5" />
                    Voir les numéros d'urgence
                  </Button>
                </Card>
              </motion.div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Card className="p-8 mb-12 border-t-4 border-t-primary">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <HelpCircle className="mr-2 h-6 w-6 text-primary" />
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
                    
                    <Button type="submit" className="w-full sm:w-auto flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      Envoyer le message
                    </Button>
                  </form>
                </Form>
              </Card>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <h2 className="text-2xl font-bold mb-6">Questions fréquentes</h2>
              <Accordion type="single" collapsible className="mb-12">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Comment fonctionne la récompense ?</AccordionTrigger>
                  <AccordionContent>
                    Vous recevez 2000 Fr pour chaque carte d'identité restituée à son propriétaire légitime. La récompense est versée une fois que le propriétaire a payé les frais de récupération de 5000 Fr.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger>Comment signaler une carte trouvée ?</AccordionTrigger>
                  <AccordionContent>
                    Utilisez notre formulaire en ligne pour signaler une carte trouvée. Vous devrez fournir des informations sur le lieu et la date de découverte. Une photo de la carte peut être ajoutée pour accélérer le processus de vérification.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger>Comment sont protégées les données personnelles ?</AccordionTrigger>
                  <AccordionContent>
                    Nous utilisons des protocoles de sécurité avancés pour protéger toutes les données personnelles. Les informations sensibles sont cryptées et l'accès est strictement contrôlé.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger>Combien de temps faut-il pour retrouver le propriétaire ?</AccordionTrigger>
                  <AccordionContent>
                    Le temps de retrouver le propriétaire peut varier en fonction des informations disponibles sur la carte et de notre base de données. En général, nous parvenons à contacter les propriétaires dans un délai de 24 à 72 heures.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5">
                  <AccordionTrigger>Puis-je signaler plusieurs cartes à la fois ?</AccordionTrigger>
                  <AccordionContent>
                    Oui, vous pouvez signaler plusieurs cartes. Il est recommandé de créer un signalement séparé pour chaque carte afin de faciliter le traitement et d'optimiser vos chances de récompense.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Support;
