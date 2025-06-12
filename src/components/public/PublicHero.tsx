
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { HeroContent } from "./hero/HeroContent";
import { SearchSection } from "./hero/SearchSection";
import { ActionButtons } from "./hero/ActionButtons";
import { WelcomeMessage } from "./hero/WelcomeMessage";
import { HeroStatusDisplay } from "./hero/HeroStatusDisplay";

export const PublicHero = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setIsLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <section className="pt-24 pb-16 bg-gradient-to-br from-[#9b87f5] to-[#7E69AB] text-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <HeroContent user={user}>
            <SearchSection user={user} />
            <ActionButtons user={user} isLoading={isLoading} />
            <WelcomeMessage user={user} />
          </HeroContent>
          <HeroStatusDisplay />
        </div>
      </div>
    </section>
  );
};
