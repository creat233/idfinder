
import { FileText } from "lucide-react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { DocumentSection, DocumentSubSection } from "./DocumentSection";

export const PassportDocument = ({ itemVariants }: { itemVariants: any }) => {
  return (
    <motion.div variants={itemVariants}>
      <Card className="mb-4 overflow-hidden border-l-4 border-l-green-500">
        <AccordionItem value="passport" className="border-none">
          <AccordionTrigger className="px-6 py-4">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-green-500" />
              <h3 className="text-lg font-medium">Passeport ordinaire</h3>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4">
            <div className="space-y-4">
              <DocumentSection title="Obtention pour la première fois:">
                <DocumentSubSection 
                  title="Documents requis:"
                  items={[
                    "Carte nationale d&apos;identité (originale et copie certifiée conforme)",
                    "Trois photos d&apos;identité en couleur",
                    "Quittance de paiement des frais de timbre (20 000 FCFA) auprès de la Direction de l&apos;Enregistrement, des Domaines et du Timbre"
                  ]}
                />
                
                <DocumentSubSection 
                  title="Procédure:"
                  items={[
                    "Payer les frais de timbre à la Direction de l&apos;Enregistrement, des Domaines et du Timbre et obtenir la quittance",
                    "Prendre rendez-vous en appelant le serveur vocal Africatel AVS au 88 628 19 01 (appel surtaxé)",
                    "Le jour du rendez-vous, se présenter au commissariat de police de votre localité avec tous les documents requis",
                    "Le délai de délivrance est généralement de 1 à 2 semaines"
                  ]}
                />
              </DocumentSection>
              
              <DocumentSection title="En cas de perte ou de vol:">
                <DocumentSubSection 
                  title="Procédure:"
                  items={[
                    "Déposer une déclaration de perte auprès du commissariat de police de votre domicile",
                    "Effectuer une nouvelle demande de passeport en suivant la procédure standard, car un duplicata n&apos;est pas délivré"
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
