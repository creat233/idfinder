
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquare, PhoneCall, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";

interface SupportCardsProps {
  supportEmail: string;
  handleContactSupport: () => void;
}

export const SupportCards = ({ supportEmail, handleContactSupport }: SupportCardsProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const handleEmergencyNumbers = () => {
    navigate('/numeros-urgence');
  };
  
  const handleCallSupport = () => {
    window.location.href = "tel:+221710117579";
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.2
          }
        }
      }}
      className="flex flex-col md:flex-row gap-6 mb-12"
    >
      <motion.div variants={fadeInUp} className="flex-1">
        <Card className="p-8 text-center h-full border-l-4 border-l-secondary">
          <MessageSquare className="w-12 h-12 text-secondary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">{t("needHelp")}</h2>
          <p className="text-gray-600 mb-6">
            {t("supportTeam")}<br />
            {t("email")}: {supportEmail}
          </p>
          <div className="space-y-4">
            <Button size="lg" onClick={handleContactSupport} className="w-full">
              {t("contactByEmail")}
            </Button>
            <Button size="lg" variant="outline" onClick={handleCallSupport} className="w-full">
              <PhoneCall className="mr-2 h-5 w-5" />
              {t("call")}: +221710117579
            </Button>
          </div>
        </Card>
      </motion.div>
      
      <motion.div variants={fadeInUp} className="flex-1">
        <Card className="p-8 text-center h-full border-l-4 border-l-red-500 bg-gradient-to-br from-white to-red-50">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">{t("emergencyNumbers")}</h2>
          <p className="text-gray-600 mb-6">
            {t("accessEmergencyNumbers")}
          </p>
          <Button size="lg" onClick={handleEmergencyNumbers} variant="destructive" className="w-full">
            <PhoneCall className="mr-2 h-5 w-5" />
            {t("seeEmergencyNumbers")}
          </Button>
        </Card>
      </motion.div>
    </motion.div>
  );
};
