
import { motion } from "framer-motion";
import { EmergencyMap } from "@/components/map/EmergencyMap";

interface EmergencyMapDisplayProps {
  showMap: boolean;
  activeCategory: string | null;
}

export const EmergencyMapDisplay = ({ showMap, activeCategory }: EmergencyMapDisplayProps) => {
  if (!showMap) return null;
  
  return (
    <motion.div 
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mb-8 rounded-lg overflow-hidden"
    >
      <EmergencyMap selectedCategory={activeCategory} height="h-96" />
    </motion.div>
  );
};
