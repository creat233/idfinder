import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShoppingBag, BarChart3, Users, CreditCard, ArrowRight, Store, Package, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const PublicBusinessCTA = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Store,
      title: "Boutique en ligne",
      description: "Créez votre vitrine digitale et vendez vos produits 24h/24",
    },
    {
      icon: Package,
      title: "Gestion des stocks",
      description: "Suivez vos stocks en temps réel avec alertes automatiques",
    },
    {
      icon: BarChart3,
      title: "Analytics & KPIs",
      description: "Tableau de bord complet pour piloter votre activité",
    },
    {
      icon: Users,
      title: "Mini-CRM intégré",
      description: "Gérez vos clients, factures et relances facilement",
    },
  ];

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900" />
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M20 20h20v20H20zM0 0h20v20H0z'/%3E%3C/g%3E%3C/svg%3E")`
      }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-400/30 rounded-full mb-6">
              <ShoppingBag className="h-4 w-4 text-purple-300" />
              <span className="text-sm font-medium text-purple-200">Nouveau sur FinderID</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Créez votre <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">boutique en ligne</span> avec MCard
            </h2>

            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              Plus qu'une carte de visite digitale, MCard est votre outil tout-en-un pour gérer votre business. 
              Catalogue produits, gestion des stocks, facturation, CRM — tout est inclus dans votre abonnement.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button
                size="lg"
                onClick={() => navigate('/mcards')}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-gray-900 font-bold px-8 py-4 rounded-full shadow-xl shadow-yellow-500/25 transition-all duration-300 hover:scale-105"
              >
                <CreditCard className="mr-2 h-5 w-5" />
                Créer ma MCard Business
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/mcards-verifiees')}
                className="border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-full bg-transparent"
              >
                Voir des exemples
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-8">
              <div>
                <div className="text-2xl font-bold text-white">5000+</div>
                <div className="text-sm text-gray-400">Professionnels</div>
              </div>
              <div className="w-px bg-gray-700" />
              <div>
                <div className="text-2xl font-bold text-white">À partir de</div>
                <div className="text-sm text-gray-400">3 000 FCFA/mois</div>
              </div>
              <div className="w-px bg-gray-700" />
              <div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                  <span className="text-2xl font-bold text-white">+40%</span>
                </div>
                <div className="text-sm text-gray-400">Visibilité</div>
              </div>
            </div>
          </motion.div>

          {/* Right: Feature cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
