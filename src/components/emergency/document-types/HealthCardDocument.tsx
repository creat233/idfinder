
import { HeartPulse } from "lucide-react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { DocumentSection, DocumentSubSection } from "./DocumentSection";

export const HealthCardDocument = ({ itemVariants }: { itemVariants: any }) => {
  return (
    <motion.div variants={itemVariants}>
      <Card className="mb-4 overflow-hidden border-l-4 border-l-emerald-500">
        <AccordionItem value="health_card" className="border-none">
          <AccordionTrigger className="px-6 py-4">
            <div className="flex items-center gap-3">
              <HeartPulse className="h-5 w-5 text-emerald-500" />
              <h3 className="text-lg font-medium">Carte de santé</h3>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4">
            <div className="space-y-4">
              <DocumentSection title="Obtention :">
                <DocumentSubSection
                  title="Documents requis :"
                  items={[
                    "Certificat d’inscription à la mutuelle ou centre de santé",
                    "Pièce d’identité",
                    "Photo d’identité",
                  ]}
                />
                <DocumentSubSection
                  title="Procédure :"
                  items={[
                    "Remplir le dossier auprès de la mutuelle ou du centre de santé",
                    "Payer, si besoin, la cotisation",
                    "Retirer sa carte de santé lors de la notification de disponibilité"
                  ]}
                />
              </DocumentSection>
              <DocumentSection title="En cas de perte ou détérioration :">
                <DocumentSubSection
                  title="Procédure :"
                  items={[
                    "Demander le renouvellement auprès du centre ayant émis la carte",
                    "Fournir déclaration de perte/détérioration, pièce d’identité, photo récente"
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
