
import { motion } from "framer-motion";
import { User } from "@supabase/supabase-js";
import { useTranslation } from "@/providers/TranslationProvider";

interface WelcomeMessageProps {
  user?: User | null;
}

export const WelcomeMessage = ({ user }: WelcomeMessageProps) => {
  const { t } = useTranslation();
  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20"
    >
      <p className="text-purple-100 text-sm">
        {t("welcomeMessageLoggedIn")}
      </p>
    </motion.div>
  );
};
