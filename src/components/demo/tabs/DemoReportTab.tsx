
import { useTranslation } from "@/hooks/useTranslation";
import { Camera, MapPin, Clock, Users } from "lucide-react";
import { DemoStepCard } from "./DemoStepCard";
import { motion } from "framer-motion";

export const DemoReportTab = () => {
  const { t } = useTranslation();

  const reportSteps = [
    {
      title: t("reportStep1Title"),
      description: t("reportStep1Desc"),
      image: "/lovable-uploads/66a0985b-99e7-45ba-8ba3-0573e2b2ad29.png",
      icon: <Camera className="w-8 h-8" />
    },
    {
      title: t("reportStep2Title"),
      description: t("reportStep2Desc"),
      image: "/lovable-uploads/66a0985b-99e7-45ba-8ba3-0573e2b2ad29.png",
      icon: <MapPin className="w-8 h-8" />
    },
    {
      title: t("reportStep3Title"),
      description: t("reportStep3Desc"),
      image: "/lovable-uploads/66a0985b-99e7-45ba-8ba3-0573e2b2ad29.png",
      icon: <Clock className="w-8 h-8" />
    },
    {
      title: t("reportStep4Title"),
      description: t("reportStep4Desc"),
      image: "/lovable-uploads/66a0985b-99e7-45ba-8ba3-0573e2b2ad29.png",
      icon: <Users className="w-8 h-8" />
    }
  ];

  return (
    <motion.div
      key="report"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
    >
      {reportSteps.map((step, index) => (
        <DemoStepCard key={index} step={step} index={index} isLast={index === reportSteps.length - 1} />
      ))}
    </motion.div>
  );
};
