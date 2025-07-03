
import { Zap, Crown, Star } from "lucide-react";

export const pricingPlans = [
  {
    id: 'essential',
    name: 'Essentiel',
    price: 15000,
    monthlyPrice: 15000,
    description: 'Pour les professionnels actifs',
    features: [
      'Carte de visite digitale complète',
      'Réseaux sociaux professionnels',
      'Statistiques de consultation détaillées',
      'Mise à jour en temps réel',
      'Support par email prioritaire',
      'Partage illimité via QR code et lien'
    ],
    isPopular: true,
    icon: <Zap className="h-5 w-5 sm:h-6 sm:w-6" />,
    gradient: 'from-blue-100 to-blue-200',
    buttonColor: 'bg-blue-600 hover:bg-blue-700',
    period: 'an',
    badge: 'POPULAIRE',
    paymentInfo: 'Activation sous 24h après paiement'
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 25000,
    monthlyPrice: 25000,
    description: 'Solution complète pour entrepreneurs',
    features: [
      'Tout du plan Essentiel',
      'Statuts personnalisés en temps réel',
      'Catalogue produits/services intégré',
      'Analytics avancées et exports',
      'Support prioritaire 24/7',
      'Personnalisation avancée (couleurs, thèmes)',
      'Intégrations CRM et outils pro'
    ],
    isPopular: false,
    icon: <Crown className="h-5 w-5 sm:h-6 sm:w-6" />,
    gradient: 'from-purple-100 to-purple-200',
    buttonColor: 'bg-purple-600 hover:bg-purple-700',
    period: 'an',
    badge: 'COMPLET',
    paymentInfo: 'Support prioritaire et fonctionnalités avancées'
  },
];
