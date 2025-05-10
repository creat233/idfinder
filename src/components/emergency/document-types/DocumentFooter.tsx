
import { motion } from "framer-motion";
import { ExternalLink } from "@/components/ui/external-link";

export const DocumentFooter = ({ itemVariants }: { itemVariants: any }) => {
  return (
    <motion.div 
      variants={itemVariants}
      className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200"
    >
      <h4 className="text-lg font-medium mb-3">Informations complémentaires</h4>
      <p className="text-gray-600 text-sm mb-3">
        <strong>Remarques :</strong> Les procédures peuvent varier légèrement selon les communes et les spécificités de chaque dossier.
        Il est recommandé de contacter les services compétents pour obtenir des informations à jour et spécifiques à votre situation.
      </p>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-gray-600 text-sm">
          <strong>Sites officiels :</strong> Pour plus de détails, consultez:
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          <ExternalLink 
            href="https://senegalservices.sn" 
            className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-200 rounded-md text-sm text-blue-600 hover:bg-blue-50 transition-colors"
            useInAppBrowser={true}
          >
            Sénégal Services
          </ExternalLink>
          <ExternalLink 
            href="https://interieur.gouv.sn" 
            className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-200 rounded-md text-sm text-blue-600 hover:bg-blue-50 transition-colors"
            useInAppBrowser={true}
          >
            Ministère de l&apos;Intérieur
          </ExternalLink>
          <ExternalLink 
            href="https://servicepublic.gouv.sn" 
            className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-200 rounded-md text-sm text-blue-600 hover:bg-blue-50 transition-colors"
            useInAppBrowser={true}
          >
            Service Public
          </ExternalLink>
        </div>
      </div>
    </motion.div>
  );
};

