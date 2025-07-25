
import { useTranslation } from "@/hooks/useTranslation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Star, Zap, Crown, Sparkles } from "lucide-react";

export const MCardFeaturesDetailed = () => {
  const { t } = useTranslation();

  const features = [
    {
      name: "Création de carte",
      essential: true,
      premium: true,
      ultimate: true,
      description: "Créez votre carte de visite digitale personnalisée"
    },
    {
      name: "Partage illimité",
      essential: true,
      premium: true,
      ultimate: true,
      description: "Partagez votre carte via QR code, lien ou NFC"
    },
    {
      name: "Photo de profil",
      essential: true,
      premium: true,
      ultimate: true,
      description: "Ajoutez votre photo professionnelle"
    },
    {
      name: "Informations de contact",
      essential: true,
      premium: true,
      ultimate: true,
      description: "Téléphone, email, site web, adresse"
    },
    {
      name: "Réseaux sociaux",
      essential: true,
      premium: true,
      ultimate: true,
      description: "Liens vers vos profils sociaux professionnels"
    },
    {
      name: "Statistiques de vues",
      essential: true,
      premium: true,
      ultimate: true,
      description: "Suivez qui consulte votre carte"
    },
    {
      name: "Mise à jour en temps réel",
      essential: true,
      premium: true,
      ultimate: true,
      description: "Vos contacts voient toujours vos infos à jour"
    },
    {
      name: "Produits/Services",
      essential: "20 max",
      premium: "50 max",
      ultimate: "100 max",
      description: "Présentez vos offres directement sur votre carte"
    },
    {
      name: "Statuts personnalisés",
      essential: "15 max",
      premium: "30 max",
      ultimate: "50 max",
      description: "Affichez votre disponibilité en temps réel"
    },
    {
      name: "Analytics avancées",
      essential: false,
      premium: true,
      ultimate: true,
      description: "Analyses détaillées des interactions"
    },
    {
      name: "Support prioritaire",
      essential: "Email",
      premium: "24/7",
      ultimate: "Dédié",
      description: "Assistance technique selon votre plan"
    },
    {
      name: "Personnalisation avancée",
      essential: false,
      premium: true,
      ultimate: true,
      description: "Thèmes et couleurs personnalisés"
    },
    {
      name: "API personnalisée",
      essential: false,
      premium: false,
      ultimate: true,
      description: "Intégrations sur mesure"
    },
    {
      name: "Formation personnalisée",
      essential: false,
      premium: false,
      ultimate: true,
      description: "Sessions de formation dédiées"
    },
    {
      name: "Gestionnaire de compte",
      essential: false,
      premium: false,
      ultimate: true,
      description: "Accompagnement personnalisé"
    }
  ];

  const plans = [
    {
      id: 'essential',
      name: 'Essentiel',
      icon: <Zap className="h-5 w-5" />,
      color: 'bg-blue-100 text-blue-800',
      price: '3000 FCFA/mois'
    },
    {
      id: 'premium',
      name: 'Premium',
      icon: <Crown className="h-5 w-5" />,
      color: 'bg-purple-100 text-purple-800',
      price: '6000 FCFA/mois'
    },
    {
      id: 'ultimate',
      name: 'Ultimate',
      icon: <Sparkles className="h-5 w-5" />,
      color: 'bg-amber-100 text-amber-800',
      price: '9900 FCFA/mois'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Comparaison des Plans
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez toutes les possibilités offertes par nos cartes de visite digitales
          </p>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* En-têtes des plans */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="p-4">
                <h3 className="font-semibold text-lg">Fonctionnalités</h3>
              </div>
              {plans.map((plan) => (
                <div key={plan.id} className="text-center">
                  <Badge className={`${plan.color} text-lg px-4 py-2 mb-2`}>
                    {plan.icon}
                    <span className="ml-2">{plan.name}</span>
                  </Badge>
                  <p className="text-sm text-gray-600 font-medium">{plan.price}</p>
                </div>
              ))}
            </div>

            {/* Liste des fonctionnalités */}
            <div className="space-y-2">
              {features.map((feature, index) => (
                <Card key={index} className="transition-all hover:shadow-md">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-4 gap-4 items-center">
                      <div>
                        <h4 className="font-medium text-gray-900">{feature.name}</h4>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                      
                      {/* Essentiel */}
                      <div className="text-center">
                        {typeof feature.essential === 'string' ? (
                          <span className="text-sm font-medium text-blue-600">{feature.essential}</span>
                        ) : feature.essential ? (
                          <Check className="h-6 w-6 text-blue-500 mx-auto" />
                        ) : (
                          <X className="h-6 w-6 text-gray-300 mx-auto" />
                        )}
                      </div>
                      
                      {/* Premium */}
                      <div className="text-center">
                        {typeof feature.premium === 'string' ? (
                          <span className="text-sm font-medium text-purple-600">{feature.premium}</span>
                        ) : feature.premium ? (
                          <div className="flex items-center justify-center">
                            <Check className="h-6 w-6 text-purple-500" />
                            {!feature.essential && (
                              <Star className="h-4 w-4 text-yellow-500 ml-1" />
                            )}
                          </div>
                        ) : (
                          <X className="h-6 w-6 text-gray-300 mx-auto" />
                        )}
                      </div>

                      {/* Ultimate */}
                      <div className="text-center">
                        {typeof feature.ultimate === 'string' ? (
                          <span className="text-sm font-medium text-amber-600">{feature.ultimate}</span>
                        ) : feature.ultimate ? (
                          <div className="flex items-center justify-center">
                            <Check className="h-6 w-6 text-amber-500" />
                            {!feature.premium && !feature.essential && (
                              <Star className="h-4 w-4 text-yellow-500 ml-1" />
                            )}
                          </div>
                        ) : (
                          <X className="h-6 w-6 text-gray-300 mx-auto" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 text-lg">
            ✨ Toutes les cartes incluent l'hébergement gratuit et les mises à jour automatiques
          </p>
        </div>
      </div>
    </section>
  );
};
