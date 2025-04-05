
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const EmergencyHeader = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex items-center mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Button>
      </div>

      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4">Numéros d'Urgence au Sénégal</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          En cas d'urgence, contactez immédiatement les services appropriés. Ces numéros sont disponibles 24h/24 et 7j/7.
        </p>
      </motion.div>
    </>
  );
};
