
import { motion } from "framer-motion";

export const DocumentFooter = ({ itemVariants }: { itemVariants: any }) => {
  return (
    <motion.div 
      variants={itemVariants}
      className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200"
    >
      <p className="text-gray-600 text-sm">
        <strong>Remarques:</strong> Les procédures peuvent varier légèrement selon les communes et les spécificités de chaque dossier.
        Il est recommandé de contacter les services compétents pour obtenir des informations à jour et spécifiques à votre situation.
        Pour plus de détails, vous pouvez consulter les sites officiels tels que <a href="https://senegalservices.sn" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Sénégal Services</a> et le <a href="https://interieur.gouv.sn" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Ministère de l&apos;Intérieur</a>.
      </p>
    </motion.div>
  );
};
