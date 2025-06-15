
import { useTranslation } from "@/providers/TranslationProvider";
import { MapPin, Phone, CheckCircle, Search } from "lucide-react";
import { DemoNotificationCard } from "./DemoNotificationCard";
import { DemoStepCard } from "./DemoStepCard";
import { motion } from "framer-motion";

export const DemoSearchTab = () => {
  const { t } = useTranslation();

  const searchSteps = [
    {
      title: t("searchStep1Title"),
      description: t("searchStep1Desc"),
      image: "/lovable-uploads/66a0985b-99e7-45ba-8ba3-0573e2b2ad29.png",
      icon: <Search className="w-8 h-8" />
    },
    {
      title: t("searchStep2Title"),
      description: t("searchStep2Desc"),
      image: "/lovable-uploads/66a0985b-99e7-45ba-8ba3-0573e2b2ad29.png",
      icon: <MapPin className="w-8 h-8" />
    },
    {
      title: t("searchStep3Title"),
      description: t("searchStep3Desc"),
      image: "/lovable-uploads/66a0985b-99e7-45ba-8ba3-0573e2b2ad29.png",
      icon: <Phone className="w-8 h-8" />
    },
    {
      title: t("searchStep4Title"),
      description: t("searchStep4Desc"),
      image: "/lovable-uploads/66a0985b-99e7-45ba-8ba3-0573e2b2ad29.png",
      icon: <CheckCircle className="w-8 h-8" />
    }
  ];

  return (
    <>
      <DemoNotificationCard />
      <motion.div
        key="search"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
      >
        {searchSteps.map((step, index) => (
          <DemoStepCard key={index} step={step} index={index} isLast={index === searchSteps.length - 1} />
        ))}
      </motion.div>
    </>
  );
};
