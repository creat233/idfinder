
import { motion } from "framer-motion";

type DocumentHeaderProps = {
  itemVariants: any;
};

export const DocumentHeader = ({ itemVariants }: DocumentHeaderProps) => {
  return (
    <>
      <motion.h2 
        variants={itemVariants}
        className="text-2xl font-semibold mb-6"
      >
        Documents d&apos;identité et administratifs au Sénégal
      </motion.h2>

      <motion.p 
        variants={itemVariants}
        className="text-gray-600 mb-8"
      >
        Pour obtenir ou renouveler vos documents d&apos;identité tels que la carte nationale d&apos;identité, 
        le passeport ordinaire et le permis de conduire au Sénégal, voici les procédures à suivre, 
        ainsi que les démarches en cas de perte de ces documents.
      </motion.p>
    </>
  );
};
