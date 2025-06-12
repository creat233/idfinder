
import { motion } from "framer-motion";

interface HeroContentProps {
  children: React.ReactNode;
}

export const HeroContent = ({ children }: HeroContentProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
        Retrouvez vos <span className="text-yellow-300">documents perdus</span> en un clic
      </h1>
      <p className="text-xl text-purple-100 mb-8 leading-relaxed">
        FinderID révolutionne la récupération de documents perdus au Sénégal. 
        Signalez, trouvez et récupérez vos pièces d'identité rapidement et en toute sécurité.
      </p>
      {children}
    </motion.div>
  );
};
