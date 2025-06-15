
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "@/providers/TranslationProvider";

export const SupportHeader = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <>
      <div className="flex items-center mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("back")}
        </Button>
      </div>

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4">{t("supportAndFaq")}</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {t("helpWithQuestions")}
        </p>
      </motion.div>
    </>
  );
};
