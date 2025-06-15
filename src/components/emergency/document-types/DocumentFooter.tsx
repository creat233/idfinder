
import { motion } from "framer-motion";
import { ExternalLink } from "@/components/ui/external-link";
import { useTranslation } from "@/hooks/useTranslation";

export const DocumentFooter = ({ itemVariants }: { itemVariants: any }) => {
  const { t } = useTranslation();
  return (
    <motion.div 
      variants={itemVariants}
      className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200"
    >
      <h4 className="text-lg font-medium mb-3">{t('doc_footer_title')}</h4>
      <p className="text-gray-600 text-sm mb-3">
        <strong>{t('doc_footer_notes_title')}</strong> {t('doc_footer_notes_content')}
      </p>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-gray-600 text-sm">
          <strong>{t('doc_footer_official_sites_title')}</strong> {t('doc_footer_official_sites_content')}
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          <ExternalLink 
            href="https://senegalservices.sn" 
            className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-200 rounded-md text-sm text-blue-600 hover:bg-blue-50 transition-colors"
            useInAppBrowser={true}
          >
            {t('doc_footer_site_senegal_services')}
          </ExternalLink>
          <ExternalLink 
            href="https://interieur.gouv.sn" 
            className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-200 rounded-md text-sm text-blue-600 hover:bg-blue-50 transition-colors"
            useInAppBrowser={true}
          >
            {t('doc_footer_site_interior_ministry')}
          </ExternalLink>
          <ExternalLink 
            href="https://servicepublic.gouv.sn" 
            className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-200 rounded-md text-sm text-blue-600 hover:bg-blue-50 transition-colors"
            useInAppBrowser={true}
          >
            {t('doc_footer_site_public_service')}
          </ExternalLink>
        </div>
      </div>
    </motion.div>
  );
};
