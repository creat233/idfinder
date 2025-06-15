
import { motion } from "framer-motion";
import { User } from "@supabase/supabase-js";
import { useTranslation } from "@/hooks/useTranslation";

interface HeroContentProps {
  children: React.ReactNode;
  user?: User | null;
}

export const HeroContent = ({ children, user }: HeroContentProps) => {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
        {t("heroTitle_part1")} <span className="text-yellow-300">{t("heroTitle_highlight")}</span> {t("heroTitle_part2")}
      </h1>
      <p className="text-xl text-purple-100 mb-8 leading-relaxed">
        {t("heroSubtitle_base")}
        {user ? (
          ` ${t("heroSubtitle_user")}`
        ) : (
          ` ${t("heroSubtitle_guest")}`
        )}
      </p>
      {children}
    </motion.div>
  );
};
