
import { CreditCard } from "lucide-react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { DocumentSection, DocumentSubSection } from "./DocumentSection";

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
              <DocumentSection title="Obtention pour la première fois:">
                <DocumentSubSection 
                  title="Documents requis:"
                  items={[
                    "Acte de naissance de l&apos;intéressé",
                    "Carte nationale d&apos;identité de l&apos;un des parents (pour les mineurs)",
                    "Quittance de paiement des frais de timbre"
                  ]}
                />
                
                <DocumentSubSection 
                  title="Procédure:"
                  items={[
                    "Se présenter à la mairie de votre lieu de résidence avec les documents requis",
                    "Remplir le formulaire de demande fourni par la mairie",
                    "Payer les frais de timbre et obtenir la quittance correspondante",
                    "Le délai de délivrance est généralement de 15 jours"
                  ]}
                />
              </DocumentSection>
              
              <DocumentSection title="En cas de perte ou de vol:">
                <DocumentSubSection 
                  title="Procédure:"
                  items={[
                    "Déposer une plainte auprès du commissariat de police de votre localité",
                    "Présenter la plainte au service de l&apos;état civil de votre mairie",
                    "Fournir les documents requis pour une nouvelle demande de CNI",
                    "Suivre la procédure d&apos;obtention pour la première fois"
                  ]}
                />
              </DocumentSection>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Card>
    </motion.div>
  );
};
