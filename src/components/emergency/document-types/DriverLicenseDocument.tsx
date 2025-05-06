
import { Car } from "lucide-react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { DocumentSection, DocumentSubSection } from "./DocumentSection";

export const DriverLicenseDocument = ({ itemVariants }: { itemVariants: any }) => {
  return (
    <motion.div variants={itemVariants}>
      <Card className="mb-4 overflow-hidden border-l-4 border-l-orange-500">
        <AccordionItem value="driver_license" className="border-none">
          <AccordionTrigger className="px-6 py-4">
            <div className="flex items-center gap-3">
              <Car className="h-5 w-5 text-orange-500" />
              <h3 className="text-lg font-medium">Permis de conduire</h3>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4">
            <div className="space-y-4">
              <DocumentSection title="Obtention:">
                <DocumentSubSection 
                  title="Documents requis:"
                  items={[
                    "Carte nationale d'identité en cours de validité (original et copie)",
                    "Certificat médical d'aptitude physique à la conduite de moins de 3 mois",
                    "Trois photos d'identité récentes",
                    "Quittance de paiement des droits d'examen (variable selon la catégorie)",
                    "Attestation de formation d'une auto-école agréée"
                  ]}
                />
                
                <DocumentSubSection 
                  title="Procédure:"
                  items={[
                    "S'inscrire dans une auto-école reconnue pour suivre la formation théorique et pratique",
                    "Passer l'examen du code de la route",
                    "Après réussite au code, passer l'examen pratique de conduite",
                    "Une fois les deux examens réussis, le permis de conduire est délivré dans un délai d'environ 2 à 4 semaines"
                  ]}
                />
              </DocumentSection>
              
              <DocumentSection title="En cas de perte ou de vol:">
                <DocumentSubSection 
                  title="Procédure:"
                  items={[
                    "Déposer une déclaration de perte auprès du commissariat de police",
                    "Se rendre au centre de délivrance des permis avec la déclaration de perte",
                    "Fournir une copie de la carte nationale d'identité, deux photos d'identité et payer les frais de duplicata",
                    "Le duplicata est généralement délivré sous 7 à 14 jours"
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
