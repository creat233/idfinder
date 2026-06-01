import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { SearchSection } from "./hero/SearchSection";
import { ActionButtons } from "./hero/ActionButtons";
import { WelcomeMessage } from "./hero/WelcomeMessage";
import { useTranslation } from "@/hooks/useTranslation";
import { ShieldCheck, Zap, Globe } from "lucide-react";

/**
 * Sober variant — clean, light, minimal. Used in A/B test against PublicHero (Vapor Chrome).
 */
export const PublicHeroSober = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setIsLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setUser(s?.user ?? null);
      setIsLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <section className="relative pt-24 pb-20 bg-white text-slate-900 border-b border-slate-100">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 bg-slate-50 text-xs font-medium text-slate-600 uppercase tracking-wider">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Finder ID
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-slate-900">
            {t("heroTitle_part1")}{" "}
            <span className="text-indigo-600">{t("heroTitle_highlight")}</span>{" "}
            {t("heroTitle_part2")}
          </h1>

          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {t("heroSubtitle_base")}{" "}
            {user ? t("heroSubtitle_user") : t("heroSubtitle_guest")}
          </p>

          <div className="pt-2 space-y-4">
            <SearchSection user={user} />
            <div className="flex justify-center">
              <ActionButtons user={user} isLoading={isLoading} />
            </div>
            <WelcomeMessage user={user} />
          </div>

          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto pt-10 border-t border-slate-100">
            <Stat icon={ShieldCheck} value="5000+" label="Professionnels" />
            <Stat icon={Zap} value="98%" label="Satisfaction" />
            <Stat icon={Globe} value="+40%" label="Visibilité" />
          </div>
        </div>
      </div>
    </section>
  );
};

const Stat = ({ icon: Icon, value, label }: { icon: any; value: string; label: string }) => (
  <div className="flex flex-col items-center gap-1">
    <Icon className="w-5 h-5 text-indigo-600 mb-1" />
    <div className="text-2xl font-bold text-slate-900">{value}</div>
    <div className="text-xs text-slate-500">{label}</div>
  </div>
);
