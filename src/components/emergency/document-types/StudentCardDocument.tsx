
import { GraduationCap } from "lucide-react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { DocumentSection, DocumentSubSection } from "./DocumentSection";

export const StudentCardDocument = ({ itemVariants }: { itemVariants: any }) => {
  return (
    <motion.div variants={itemVariants}>
      <Card className="mb-4 overflow-hidden border-l-4 border-l-teal-500">
        <AccordionItem value="student_card" className="border-none">
          <AccordionTrigger className="px-6 py-4">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-5 w-5 text-teal-500" />
              <h3 className="text-lg font-medium">Carte étudiante</h3>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4">
            <div className="space-y-4">
              <DocumentSection title="Obtention :">
                <DocumentSubSection
                  title="Documents requis :"
                  items={[
                    "Certificat d'inscription de l’établissement",
                    "Pièce d'identité ou quittance d'inscription",
                    "Photo d'identité récente",
                  ]}
                />
                <DocumentSubSection
                  title="Procédure :"
                  items={[
                    "Déposer le dossier au secrétariat de l’établissement",
                    "La carte étudiante est souvent délivrée gratuitement ou rapidement",
                  ]}
                />
              </DocumentSection>
              <DocumentSection title="Perte ou renouvellement :">
                <DocumentSubSection
                  title="Procédure :"
                  items={[
                    "Demander un duplicata auprès de l’établissement",
                    "Fournir déclaration sur l’honneur ou rapport de perte le cas échéant",
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
