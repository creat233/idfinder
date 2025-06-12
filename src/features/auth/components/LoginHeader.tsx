
import { motion } from "framer-motion";

const LoginHeader = () => {
  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative mb-6"
      >
        <div className="w-20 h-20 bg-white rounded-2xl shadow-2xl flex items-center justify-center">
          <img
            src="/lovable-uploads/66a0985b-99e7-45ba-8ba3-0573e2b2ad29.png"
            alt="Logo"
            className="w-16 h-16"
          />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center"
        >
          <span className="text-xs">🇸🇳</span>
        </motion.div>
      </motion.div>
      
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-4xl font-extrabold text-white mb-3 text-center"
      >
        Sama Pièce
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="text-purple-100 text-center text-lg mb-2"
      >
        Votre plateforme de récupération de documents
      </motion.p>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="bg-white/10 backdrop-blur-sm rounded-xl p-4 max-w-sm text-center border border-white/20"
      >
        <p className="text-purple-100 text-sm leading-relaxed">
          ✨ Signalez, retrouvez et restituez facilement les documents égarés grâce à notre communauté solidaire
        </p>
      </motion.div>
    </div>
  );
};

export default LoginHeader;
