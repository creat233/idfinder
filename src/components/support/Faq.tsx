
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";

export const Faq = () => {
  return (
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
            Vous recevez 2000 Fr pour chaque carte d'identité restituée à son propriétaire légitime. La récompense est versée une fois que le propriétaire a payé les frais de récupération de 7000 Fr.
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
  );
};
