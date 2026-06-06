
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const PublicPricing = () => {
  const navigate = useNavigate();

  const tiers = [
    {
      name: "Trouveur", price: "2 000 Fr", note: "Récompense pour avoir signalé",
      features: ["Signalement gratuit", "Récompense garantie", "Paiement Mobile Money"],
      featured: false,
    },
    {
      name: "Propriétaire", price: "7 000 Fr", note: "Frais de récupération",
      features: ["Notification immédiate", "Contact direct avec trouveur", "Support 24/7", "Livraison possible"],
      featured: true,
    },
    {
      name: "Cartes spéciales", price: "Gratuit", note: "Cartes étudiantes & santé",
      features: ["Cartes étudiantes", "Cartes de santé", "Contact direct gratuit"],
      featured: false,
    },
  ];

  return (
    <section id="tarifs" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }} viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
            Tarifs transparents
          </h2>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto">
            Des prix justes pour un service efficace. Payez seulement quand vous récupérez votre document.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }} viewport={{ once: true }}
              className={`vapor-card p-7 ${tier.featured ? 'ring-2' : ''}`}
              style={tier.featured ? {
                background: 'linear-gradient(135deg, hsl(var(--vapor-lavender) / 0.18), hsl(var(--vapor-cyan) / 0.12))',
                boxShadow: '0 20px 60px -20px hsl(var(--vapor-lavender) / 0.4)',
              } : {}}
            >
              <div className="text-center">
                <h3 className="font-display text-xl text-white mb-2">{tier.name}</h3>
                <div className="font-display text-4xl font-bold mb-2 vapor-gradient-text">{tier.price}</div>
                <p className="text-sm text-slate-400 mb-6">{tier.note}</p>
              </div>
              <ul className="space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-slate-200 text-sm">
                    <Check className="w-4 h-4 flex-shrink-0" style={{ color: 'hsl(var(--vapor-cyan))' }} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }} viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button size="lg" onClick={() => navigate("/login")}
            className="text-slate-900 font-semibold px-8 py-6 text-base rounded-full shadow-xl"
            style={{ background: 'linear-gradient(135deg, hsl(var(--vapor-mist)), hsl(var(--vapor-lavender)))' }}>
            Commencer maintenant
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
