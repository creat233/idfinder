import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="bg-gradient-to-b from-primary to-primary/90 py-20 text-primary-foreground">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Retrouvez votre pièce d'identité
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
          Une solution sécurisée pour récupérer les pièces d'identité perdues.
          Recevez une récompense de 1000 CHF pour chaque carte restituée.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link to="/signaler">
            <Button size="lg" variant="secondary">
              Signaler une carte trouvée
            </Button>
          </Link>
          <Link to="/about">
            <Button size="lg" variant="outline">
              En savoir plus
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};