
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquare, PhoneCall, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface SupportCardsProps {
  supportEmail: string;
  handleContactSupport: () => void;
}

export const SupportCards = ({ supportEmail, handleContactSupport }: SupportCardsProps) => {
  const navigate = useNavigate();
  
  const handleEmergencyNumbers = () => {
    navigate('/numeros-urgence');
  };
  
  const handleCallSupport = () => {
    window.location.href = "tel:77 123 45 67";
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
          <h2 className="text-2xl font-bold mb-4">Besoin d'aide ?</h2>
          <p className="text-gray-600 mb-6">
            Notre équipe d'assistance est disponible pour répondre à toutes vos questions<br />
            Email: {supportEmail}
          </p>
          <div className="space-y-4">
            <Button size="lg" onClick={handleContactSupport} className="w-full">
              Contacter par email
            </Button>
            <Button size="lg" variant="outline" onClick={handleCallSupport} className="w-full">
              <PhoneCall className="mr-2 h-5 w-5" />
              Appeler: 77 123 45 67
            </Button>
          </div>
        </Card>
      </motion.div>
      
      <motion.div variants={fadeInUp} className="flex-1">
        <Card className="p-8 text-center h-full border-l-4 border-l-red-500 bg-gradient-to-br from-white to-red-50">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Numéros d'Urgence</h2>
          <p className="text-gray-600 mb-6">
            Accédez rapidement aux numéros d'urgence<br />
            disponibles au Sénégal
          </p>
          <Button size="lg" onClick={handleEmergencyNumbers} variant="destructive" className="w-full">
            <PhoneCall className="mr-2 h-5 w-5" />
            Voir les numéros d'urgence
          </Button>
        </Card>
      </motion.div>
    </motion.div>
  );
};
