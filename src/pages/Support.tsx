import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

const Support = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto py-12">
        <h1 className="text-4xl font-bold text-center mb-12">Support & FAQ</h1>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="mb-12">
            <AccordionItem value="item-1">
              <AccordionTrigger>Comment fonctionne la récompense ?</AccordionTrigger>
              <AccordionContent>
                Vous recevez 2000 CHF pour chaque carte d'identité restituée à son propriétaire légitime. La récompense est versée une fois que le propriétaire a payé les frais de récupération de 5000 CHF.
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
          </Accordion>
          
          <Card className="p-8 text-center">
            <MessageSquare className="w-12 h-12 text-secondary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Besoin d'aide supplémentaire ?</h2>
            <p className="text-gray-600 mb-6">
              Notre équipe de support est disponible pour répondre à toutes vos questions
            </p>
            <Button size="lg">Contacter le support</Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Support;