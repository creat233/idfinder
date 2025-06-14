
import { BadgeInfo } from "lucide-react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { DocumentSection, DocumentSubSection } from "./DocumentSection";

export const ResidencePermitDocument = ({ itemVariants }: { itemVariants: any }) => {
  return (
    <motion.div variants={itemVariants}>
      <Card className="mb-4 overflow-hidden border-l-4 border-l-sky-500">
        <AccordionItem value="residence_permit" className="border-none">
          <AccordionTrigger className="px-6 py-4">
            <div className="flex items-center gap-3">
              <BadgeInfo className="h-5 w-5 text-sky-500" />
              <h3 className="text-lg font-medium">Carte de séjour</h3>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4">
            <div className="space-y-4">
              <DocumentSection title="Obtention :">
                <DocumentSubSection
                  title="Documents requis :"
                  items={[
                    "Passeport en cours de validité",
                    "Visa ou justificatif d'entrée régulière",
                    "Attestation d’hébergement ou contrat de location",
                    "Deux photos d'identité",
                  ]}
                />
                <DocumentSubSection
                  title="Procédure :"
                  items={[
                    "Se rendre au service de l’émigration ou de la préfecture",
                    "Remplir le dossier, présenter les pièces et payer les frais",
                    "Le délai d’obtention varie selon la préfecture (en général 2 à 4 semaines)",
                  ]}
                />
              </DocumentSection>
              <DocumentSection title="Renouvellement ou perte :">
                <DocumentSubSection
                  title="Procédure :"
                  items={[
                    "En cas de perte, déposer une déclaration au commissariat",
                    "Demander un duplicata auprès de la préfecture, fournir déclaration, pièces d'identité, justificatif de domicile",
                    "Pour le renouvellement, présenter l’ancienne carte, justificatifs de séjour, et payer les frais"
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
