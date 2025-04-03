
import { motion } from "framer-motion";

const LoginHeader = () => {
  return (
    <div className="flex flex-col items-center">
      <motion.img
        src="/lovable-uploads/66a0985b-99e7-45ba-8ba3-0573e2b2ad29.png"
        alt="Logo"
        className="w-20 h-20 mb-4"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
      <motion.h2 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-2 text-center text-4xl font-extrabold text-gray-900 mb-2"
      >
        Sama Pièce
      </motion.h2>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center space-y-3 max-w-sm mb-6"
      >
        <p className="text-lg text-gray-600">
          Connectez-vous pour accéder à votre compte
        </p>
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-700 leading-relaxed">
            Bienvenue sur Sama Pièce, votre plateforme dédiée à la gestion simplifiée de vos pièces d'identité perdues. 
            Signalez, retrouvez et restituez facilement les documents égarés grâce à notre communauté solidaire.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginHeader;
