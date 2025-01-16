export const Stats = () => {
  return (
    <section id="stats" className="py-16 bg-accent">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">150+</div>
            <div className="text-lg text-primary/80">Cartes retrouvées</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">150,000 CHF</div>
            <div className="text-lg text-primary/80">Récompenses distribuées</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">98%</div>
            <div className="text-lg text-primary/80">Taux de satisfaction</div>
          </div>
        </div>
      </div>
    </section>
  );
};