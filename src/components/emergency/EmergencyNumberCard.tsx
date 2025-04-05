
import { PhoneCall, PhoneForwarded } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export interface EmergencyNumberType {
  service: string;
  number: string;
  description: string;
  category: "police" | "medical" | "fire" | "other";
}

interface EmergencyNumberCardProps {
  item: EmergencyNumberType;
  index: number;
}

export const EmergencyNumberCard = ({ item, index }: EmergencyNumberCardProps) => {
  const handleCall = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        delay: index * 0.1
      }
    }
  };

  return (
    <motion.div variants={itemVariants}>
      <Card className={`overflow-hidden border-l-4 hover:shadow-lg transition-shadow ${
        item.category === 'police' ? 'border-l-blue-500' :
        item.category === 'medical' ? 'border-l-red-500' :
        item.category === 'fire' ? 'border-l-orange-500' :
        'border-l-purple-500'
      }`}>
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-xl mb-2">{item.service}</h3>
              <p className="text-gray-600 text-sm mb-4">{item.description}</p>
            </div>
            <PhoneCall className={`h-6 w-6 flex-shrink-0 ${
              item.category === 'police' ? 'text-blue-500' :
              item.category === 'medical' ? 'text-red-500' :
              item.category === 'fire' ? 'text-orange-500' :
              'text-purple-500'
            }`} />
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <span className="text-2xl font-bold text-primary">{item.number}</span>
            <Button 
              onClick={() => handleCall(item.number)}
              className="flex items-center gap-2"
              variant={
                item.category === 'police' ? 'default' :
                item.category === 'medical' ? 'destructive' :
                item.category === 'fire' ? 'secondary' :
                'outline'
              }
            >
              <PhoneForwarded size={16} />
              Appeler
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
