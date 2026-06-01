import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { SearchSection } from "./hero/SearchSection";
import { ActionButtons } from "./hero/ActionButtons";
import { WelcomeMessage } from "./hero/WelcomeMessage";
import { useTranslation } from "@/hooks/useTranslation";
import { Phone, MapPin, Truck, Smartphone } from "lucide-react";

export const PublicHero = () => {
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
    <section className="relative overflow-hidden pt-24 pb-20 bg-[hsl(var(--vapor-ink))] text-white font-body">
      {/* Animated iridescent mesh */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[55%] h-[55%] rounded-full blur-[120px] opacity-40 animate-vapor-blob"
             style={{ background: 'hsl(var(--vapor-indigo))' }} />
        <div className="absolute -bottom-40 -right-32 w-[60%] h-[60%] rounded-full blur-[150px] opacity-30 animate-vapor-blob"
             style={{ background: 'hsl(var(--vapor-cyan))', animationDelay: '4s' }} />
        <div className="absolute top-1/3 right-1/4 w-[35%] h-[40%] rounded-full blur-[110px] opacity-25 animate-vapor-blob"
             style={{ background: 'hsl(var(--vapor-lavender))', animationDelay: '8s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* LEFT */}
          <div className="lg:col-span-7 space-y-7 animate-vapor-rise">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping"
                      style={{ background: 'hsl(var(--vapor-cyan))' }} />
                <span className="relative inline-flex h-2 w-2 rounded-full"
                      style={{ background: 'hsl(var(--vapor-cyan))' }} />
              </span>
              <span className="text-[11px] font-medium tracking-wider uppercase text-white/80">
                Finder ID · Nouvelle expérience
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
              {t("heroTitle_part1")}{" "}
              <span className="vapor-gradient-text">{t("heroTitle_highlight")}</span>{" "}
              {t("heroTitle_part2")}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
              {t("heroSubtitle_base")}{" "}
              {user ? t("heroSubtitle_user") : t("heroSubtitle_guest")}
            </p>

            <div className="space-y-4">
              <SearchSection user={user} />
              <ActionButtons user={user} isLoading={isLoading} />
              <WelcomeMessage user={user} />
            </div>

            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10">
              <div>
                <div className="font-display text-2xl sm:text-3xl font-bold text-white">5000+</div>
                <div className="text-xs sm:text-sm text-slate-400">Professionnels</div>
              </div>
              <div>
                <div className="font-display text-2xl sm:text-3xl font-bold text-white">98%</div>
                <div className="text-xs sm:text-sm text-slate-400">Satisfaction</div>
              </div>
              <div>
                <div className="font-display text-2xl sm:text-3xl font-bold"
                     style={{ color: 'hsl(var(--vapor-cyan))' }}>+40%</div>
                <div className="text-xs sm:text-sm text-slate-400">Visibilité</div>
              </div>
            </div>
          </div>

          {/* RIGHT - Status Panel */}
          <div className="lg:col-span-5 relative animate-vapor-rise" style={{ animationDelay: '0.15s' }}>
            <div className="relative p-[1px] rounded-3xl shadow-2xl"
                 style={{ background: 'linear-gradient(135deg, hsl(var(--vapor-lavender) / 0.6), hsl(var(--white) / 0.05), hsl(var(--vapor-cyan) / 0.6))' }}>
              <div className="rounded-[22px] bg-[hsl(var(--vapor-ink))]/85 backdrop-blur-2xl p-6 lg:p-8 space-y-5 overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-slate-900"
                         style={{ background: 'linear-gradient(135deg, hsl(var(--vapor-mist)), hsl(var(--vapor-lavender)))' }}>
                      F
                    </div>
                    <div>
                      <h3 className="font-display text-white font-bold leading-none">Finder ID Hub</h3>
                      <p className="text-xs text-slate-400 mt-1">Service temps réel</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
                    Actif
                  </div>
                </div>

                <div className="space-y-3">
                  <StatusItem icon={Phone} color="var(--vapor-indigo)" label="Contact direct" desc="Mise en relation instantanée" active />
                  <StatusItem icon={MapPin} color="var(--vapor-cyan)" label="Géolocalisation" desc="Suivi de vos documents" active />
                  <StatusItem icon={Truck} color="var(--vapor-lavender)" label="Livraison à domicile" desc="Disponible partout" active />
                  <StatusItem icon={Smartphone} color="var(--vapor-mist)" label="App Android" desc="Notifications instantanées" active />
                </div>
              </div>
            </div>

            {/* Floating decorative card */}
            <div className="hidden lg:block absolute -bottom-6 -left-6 p-4 rounded-2xl backdrop-blur-md border border-white/10 transform -rotate-6"
                 style={{ background: 'hsl(var(--vapor-lavender) / 0.18)' }}>
              <div className="text-[10px] uppercase tracking-widest text-white/60 mb-1">Cartes retrouvées</div>
              <div className="font-display text-white font-bold text-lg">+500 ce mois</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const StatusItem = ({
  icon: Icon, color, label, desc, active,
}: { icon: any; color: string; label: string; desc: string; active?: boolean }) => (
  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/15 transition-all duration-300 hover:translate-x-1">
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg" style={{ background: `hsl(${color} / 0.2)`, color: `hsl(${color})` }}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-sm font-medium text-white leading-tight">{label}</p>
        <p className="text-[11px] text-slate-500 leading-tight mt-0.5">{desc}</p>
      </div>
    </div>
    <div className={`h-2 w-2 rounded-full ${active ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' : 'bg-slate-600'}`} />
  </div>
);
