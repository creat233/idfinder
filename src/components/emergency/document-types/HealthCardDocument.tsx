
import { HeartPulse } from "lucide-react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { DocumentSection, DocumentSubSection } from "./DocumentSection";
import { useTranslation } from "@/hooks/useTranslation";

export const HealthCardDocument = ({ itemVariants }: { itemVariants: any }) => {
  const { t } = useTranslation();
  return (
    <motion.div variants={itemVariants}>
      <Card className="mb-4 overflow-hidden border-l-4 border-l-emerald-500">
        <AccordionItem value="health_card" className="border-none">
          <AccordionTrigger className="px-6 py-4">
            <div className="flex items-center gap-3">
              <HeartPulse className="h-5 w-5 text-emerald-500" />
              <h3 className="text-lg font-medium">{t('health_card_title')}</h3>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4">
            <div className="space-y-4">
              <DocumentSection title={t('doc_section_obtention')}>
                <DocumentSubSection
                  title={t('doc_subsection_docs_required')}
                  items={[
                    t('health_card_obtention_doc_1'),
                    t('health_card_obtention_doc_2'),
                    t('health_card_obtention_doc_3'),
                  ]}
                />
                <DocumentSubSection
                  title={t('doc_subsection_procedure')}
                  items={[
                    t('health_card_obtention_procedure_1'),
                    t('health_card_obtention_procedure_2'),
                    t('health_card_obtention_procedure_3'),
                  ]}
                />
              </DocumentSection>
              <DocumentSection title={t('doc_section_loss_deterioration')}>
                <DocumentSubSection
                  title={t('doc_subsection_procedure')}
                  items={[
                    t('health_card_loss_procedure_1'),
                    t('health_card_loss_procedure_2'),
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
