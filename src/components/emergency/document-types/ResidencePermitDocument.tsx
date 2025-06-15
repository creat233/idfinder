
import { BadgeInfo } from "lucide-react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { DocumentSection, DocumentSubSection } from "./DocumentSection";
import { useTranslation } from "@/hooks/useTranslation";

export const ResidencePermitDocument = ({ itemVariants }: { itemVariants: any }) => {
  const { t } = useTranslation();
  return (
    <motion.div variants={itemVariants}>
      <Card className="mb-4 overflow-hidden border-l-4 border-l-sky-500">
        <AccordionItem value="residence_permit" className="border-none">
          <AccordionTrigger className="px-6 py-4">
            <div className="flex items-center gap-3">
              <BadgeInfo className="h-5 w-5 text-sky-500" />
              <h3 className="text-lg font-medium">{t('residence_permit_title')}</h3>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4">
            <div className="space-y-4">
              <DocumentSection title={t('doc_section_obtention')}>
                <DocumentSubSection
                  title={t('doc_subsection_docs_required')}
                  items={[
                    t('residence_permit_obtention_doc_1'),
                    t('residence_permit_obtention_doc_2'),
                    t('residence_permit_obtention_doc_3'),
                    t('residence_permit_obtention_doc_4'),
                  ]}
                />
                <DocumentSubSection
                  title={t('doc_subsection_procedure')}
                  items={[
                    t('residence_permit_obtention_procedure_1'),
                    t('residence_permit_obtention_procedure_2'),
                    t('residence_permit_obtention_procedure_3'),
                  ]}
                />
              </DocumentSection>
              <DocumentSection title={t('doc_section_renewal_loss')}>
                <DocumentSubSection
                  title={t('doc_subsection_procedure')}
                  items={[
                    t('residence_permit_loss_procedure_1'),
                    t('residence_permit_loss_procedure_2'),
                    t('residence_permit_loss_procedure_3'),
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
