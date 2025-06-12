
import { User } from "@supabase/supabase-js";
import { HeroContent } from "./hero/HeroContent";
import { SearchSection } from "./hero/SearchSection";
import { ActionButtons } from "./hero/ActionButtons";
import { WelcomeMessage } from "./hero/WelcomeMessage";
import { HeroStatusDisplay } from "./hero/HeroStatusDisplay";

interface PublicHeroProps {
  user?: User | null;
  isLoading?: boolean;
}

export const PublicHero = ({ user, isLoading }: PublicHeroProps) => {
  return (
    <section className="pt-24 pb-16 bg-gradient-to-br from-[#9b87f5] to-[#7E69AB] text-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <HeroContent>
            <SearchSection />
            <ActionButtons user={user} isLoading={isLoading} />
            <WelcomeMessage user={user} />
          </HeroContent>
          <HeroStatusDisplay />
        </div>
      </div>
    </section>
  );
};
