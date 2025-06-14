
import { Bike } from "lucide-react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { DocumentSection, DocumentSubSection } from "./DocumentSection";

export const MotorcycleRegistrationDocument = ({ itemVariants }: { itemVariants: any }) => {
  return (
    <motion.div variants={itemVariants}>
      <Card className="mb-4 overflow-hidden border-l-4 border-l-rose-500">
        <AccordionItem value="motorcycle_registration" className="border-none">
          <AccordionTrigger className="px-6 py-4">
            <div className="flex items-center gap-3">
              <Bike className="h-5 w-5 text-rose-500" />
              <h3 className="text-lg font-medium">Carte grise moto</h3>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4">
            <div className="space-y-4">
              <DocumentSection title="Obtention pour la première fois :">
                <DocumentSubSection
                  title="Documents requis :"
                  items={[
                    "Facture d'achat ou certificat de cession",
                    "Pièce d'identité du propriétaire",
                    "Justificatif de domicile",
                  ]}
                />
                <DocumentSubSection
                  title="Procédure :"
                  items={[
                    "Se rendre au service des transports avec les documents",
                    "Remplir la demande et payer les frais d’immatriculation",
                    "La carte grise est disponible en moyenne sous 1 à 2 semaines"
                  ]}
                />
              </DocumentSection>
              <DocumentSection title="En cas de perte ou de vol :">
                <DocumentSubSection
                  title="Procédure :"
                  items={[
                    "Déclarer la perte ou le vol au commissariat",
                    "Fournir déclaration de perte/vol, pièce d'identité et justificatif de propriété au service des transports",
                    "Payer les frais de duplicata (généralement délivré sous 7 à 14 jours)"
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
