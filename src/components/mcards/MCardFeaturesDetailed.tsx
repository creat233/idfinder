
import { useTranslation } from "@/hooks/useTranslation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Star, Zap, Crown, Gift } from "lucide-react";

export const MCardFeaturesDetailed = () => {
  const { t } = useTranslation();

  const features = [
    {
      name: "Création de carte",
      free: true,
      essential: true,
      premium: true,
      description: "Créez votre carte de visite digitale personnalisée"
    },
    {
      name: "Partage illimité",
      free: true,
      essential: true,
      premium: true,
      description: "Partagez votre carte via QR code, lien ou NFC"
    },
    {
      name: "Photo de profil",
      free: true,
      essential: true,
      premium: true,
      description: "Ajoutez votre photo professionnelle"
    },
    {
      name: "Informations de contact",
      free: true,
      essential: true,
      premium: true,
      description: "Téléphone, email, site web, adresse"
    },
    {
      name: "Réseaux sociaux",
      free: false,
      essential: true,
      premium: true,
      description: "Liens vers vos profils sociaux professionnels"
    },
    {
      name: "Statistiques de vues",
      free: false,
      essential: true,
      premium: true,
      description: "Suivez qui consulte votre carte"
    },
    {
      name: "Mise à jour en temps réel",
      free: false,
      essential: true,
      premium: true,
      description: "Vos contacts voient toujours vos infos à jour"
    },
    {
      name: "Statuts personnalisés",
      free: false,
      essential: false,
      premium: true,
      description: "Affichez votre disponibilité en temps réel"
    },
    {
      name: "Catalogue produits/services",
      free: false,
      essential: false,
      premium: true,
      description: "Présentez vos offres directement sur votre carte"
    },
    {
      name: "Analytics avancées",
      free: false,
      essential: false,
      premium: true,
      description: "Analyses détaillées des interactions"
    },
    {
      name: "Support prioritaire",
      free: false,
      essential: false,
      premium: true,
      description: "Assistance technique prioritaire"
    },
    {
      name: "Personnalisation avancée",
      free: false,
      essential: false,
      premium: true,
      description: "Thèmes et couleurs personnalisés"
    }
  ];

  const plans = [
    {
      id: 'free',
      name: 'Gratuit',
      icon: <Gift className="h-5 w-5" />,
      color: 'bg-gray-100 text-gray-800'
    },
    {
      id: 'essential',
      name: 'Essentiel',
      icon: <Zap className="h-5 w-5" />,
      color: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'premium',
      name: 'Premium',
      icon: <Crown className="h-5 w-5" />,
      color: 'bg-purple-100 text-purple-800'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Fonctionnalités Complètes
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
                      
                      {/* Gratuit */}
                      <div className="text-center">
                        {feature.free ? (
                          <Check className="h-6 w-6 text-green-500 mx-auto" />
                        ) : (
                          <X className="h-6 w-6 text-gray-300 mx-auto" />
                        )}
                      </div>
                      
                      {/* Essentiel */}
                      <div className="text-center">
                        {feature.essential ? (
                          <Check className="h-6 w-6 text-blue-500 mx-auto" />
                        ) : (
                          <X className="h-6 w-6 text-gray-300 mx-auto" />
                        )}
                      </div>
                      
                      {/* Premium */}
                      <div className="text-center">
                        {feature.premium ? (
                          <div className="flex items-center justify-center">
                            <Check className="h-6 w-6 text-purple-500" />
                            {!feature.essential && !feature.free && (
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
