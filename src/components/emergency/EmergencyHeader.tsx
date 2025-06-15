
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";

export const EmergencyHeader = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <>
      <div className="flex items-center mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('back')}
        </Button>
      </div>

      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4">{t('emergency_page_title')}</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {t('emergency_page_subtitle')}
        </p>
      </motion.div>
    </>
  );
};
