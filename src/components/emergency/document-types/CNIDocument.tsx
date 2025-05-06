
import { CreditCard } from "lucide-react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

export const CNIDocument = ({ itemVariants }: { itemVariants: any }) => {
  return (
    <motion.div variants={itemVariants}>
      <Card className="mb-4 overflow-hidden border-l-4 border-l-blue-500">
        <AccordionItem value="cni" className="border-none">
          <AccordionTrigger className="px-6 py-4">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-blue-500" />
              <h3 className="text-lg font-medium">Carte nationale d&apos;identité (CNI)</h3>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Obtention pour la première fois:</h4>
                <div className="space-y-2">
                  <p className="font-medium">Documents requis:</p>
                  <ul className="list-disc pl-5 text-gray-600 space-y-1">
                    <li>Acte de naissance de l&apos;intéressé</li>
                    <li>Carte nationale d&apos;identité de l&apos;un des parents (pour les mineurs)</li>
                    <li>Quittance de paiement des frais de timbre</li>
                  </ul>
                </div>
                
                <div className="mt-3 space-y-2">
                  <p className="font-medium">Procédure:</p>
                  <ul className="list-disc pl-5 text-gray-600 space-y-1">
                    <li>Se présenter à la mairie de votre lieu de résidence avec les documents requis</li>
                    <li>Remplir le formulaire de demande fourni par la mairie</li>
                    <li>Payer les frais de timbre et obtenir la quittance correspondante</li>
                    <li>Le délai de délivrance est généralement de 15 jours</li>
                  </ul>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">En cas de perte ou de vol:</h4>
                <div className="space-y-2">
                  <p className="font-medium">Procédure:</p>
                  <ul className="list-disc pl-5 text-gray-600 space-y-1">
                    <li>Déposer une plainte auprès du commissariat de police de votre localité</li>
                    <li>Présenter la plainte au service de l&apos;état civil de votre mairie</li>
                    <li>Fournir les documents requis pour une nouvelle demande de CNI</li>
                    <li>Suivre la procédure d&apos;obtention pour la première fois</li>
                  </ul>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Card>
    </motion.div>
  );
};
