import { Button } from "@/components/ui/button";

export const Header = () => {
  return (
    <header className="w-full bg-primary py-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-primary-foreground text-2xl font-bold">IDFinder</div>
        <nav className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="text-primary-foreground hover:text-secondary transition-colors">
            Comment ça marche
          </a>
          <a href="#stats" className="text-primary-foreground hover:text-secondary transition-colors">
            Statistiques
          </a>
          <Button variant="secondary">Signaler une carte</Button>
        </nav>
      </div>
    </header>
  );
};