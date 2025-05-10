
import { motion } from "framer-motion";
import { ExternalLink } from "@/components/ui/external-link";

export const DocumentFooter = ({ itemVariants }: { itemVariants: any }) => {
  return (
    <motion.div 
      variants={itemVariants}
      className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200"
    >
      <p className="text-gray-600 text-sm">
        <strong>Remarques:</strong> Les procédures peuvent varier légèrement selon les communes et les spécificités de chaque dossier.
        Il est recommandé de contacter les services compétents pour obtenir des informations à jour et spécifiques à votre situation.
        Pour plus de détails, vous pouvez consulter les sites officiels tels que <ExternalLink href="https://senegalservices.sn" className="text-blue-500 hover:underline">Sénégal Services</ExternalLink> et le <ExternalLink href="https://interieur.gouv.sn" className="text-blue-500 hover:underline">Ministère de l&apos;Intérieur</ExternalLink>.
      </p>
    </motion.div>
  );
};
