
import { Truck } from "lucide-react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { DocumentSection, DocumentSubSection } from "./DocumentSection";

export const VehicleRegistrationDocument = ({ itemVariants }: { itemVariants: any }) => {
  return (
    <motion.div variants={itemVariants}>
      <Card className="mb-4 overflow-hidden border-l-4 border-l-purple-500">
        <AccordionItem value="vehicle_registration" className="border-none">
          <AccordionTrigger className="px-6 py-4">
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-purple-500" />
              <h3 className="text-lg font-medium">Carte grise véhicule</h3>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4">
            <div className="space-y-4">
              <DocumentSection title="Obtention pour la première fois :">
                <DocumentSubSection
                  title="Documents requis :"
                  items={[
                    "Facture d'achat du véhicule (ou certificat de cession)",
                    "Ancienne carte grise si véhicule d'occasion",
                    "Pièce d'identité du propriétaire",
                    "Justificatif de domicile",
                  ]}
                />
                <DocumentSubSection
                  title="Procédure :"
                  items={[
                    "Se rendre au service des transports terrestres",
                    "Présenter tous les documents requis",
                    "Payer les frais d'immatriculation",
                    "La carte grise est généralement délivrée sous 1 à 2 semaines",
                  ]}
                />
              </DocumentSection>
              <DocumentSection title="En cas de perte ou de vol :">
                <DocumentSubSection
                  title="Procédure :"
                  items={[
                    "Déclarer la perte ou le vol au commissariat",
                    "Se rendre au service des transports pour demander un duplicata",
                    "Fournir la déclaration de perte/vol, pièce d'identité, justificatif de propriété",
                    "Payer les frais de duplicata ; le duplicata est habituellement délivré sous 7 à 14 jours",
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
