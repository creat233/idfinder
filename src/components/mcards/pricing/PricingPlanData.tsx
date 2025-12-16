
import { Zap, Crown, Sparkles, Gift } from "lucide-react";

export const pricingPlans = [
  {
    id: 'free',
    name: 'Gratuit',
    price: 0,
    monthlyPrice: 0,
    description: '1 carte gratuite par compte',
    features: [
      'Carte de visite digitale basique',
      'Informations de contact',
      'Réseaux sociaux',
      'Partage via QR code et lien',
      '3 produits/services maximum',
      '2 statuts maximum',
      'Aucune facture'
    ],
    isPopular: false,
    icon: <Gift className="h-5 w-5 sm:h-6 sm:w-6" />,
    gradient: 'from-green-100 to-emerald-200',
    buttonColor: 'bg-green-600 hover:bg-green-700',
    period: 'gratuit',
    badge: 'GRATUIT',
    paymentInfo: 'Activation instantanée'
  },
  {
    id: 'essential',
    name: 'Essentiel',
    price: 3000,
    monthlyPrice: 3000,
    description: 'Pour les professionnels actifs',
    features: [
      'Carte de visite digitale complète',
      'Réseaux sociaux professionnels',
      'Statistiques de consultation détaillées',
      'Mise à jour en temps réel',
      'Support par email prioritaire',
      'Partage illimité via QR code et lien',
      '20 produits/services maximum',
      '15 statuts maximum'
    ],
    isPopular: true,
    icon: <Zap className="h-5 w-5 sm:h-6 sm:w-6" />,
    gradient: 'from-blue-100 to-blue-200',
    buttonColor: 'bg-blue-600 hover:bg-blue-700',
    period: 'mois',
    badge: 'POPULAIRE',
    paymentInfo: 'Activation sous 24h après paiement'
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 6000,
    monthlyPrice: 6000,
    description: 'Solution complète pour entrepreneurs',
    features: [
      'Tout du plan Essentiel',
      'Statuts personnalisés en temps réel',
      'Catalogue produits/services intégré',
      'Analytics avancées et exports',
      'Support prioritaire 24/7',
      'Personnalisation avancée (couleurs, thèmes)',
      'Intégrations CRM et outils pro',
      '50 produits/services maximum',
      '30 statuts maximum'
    ],
    isPopular: false,
    icon: <Crown className="h-5 w-5 sm:h-6 sm:w-6" />,
    gradient: 'from-purple-100 to-purple-200',
    buttonColor: 'bg-purple-600 hover:bg-purple-700',
    period: 'mois',
    badge: 'COMPLET',
    paymentInfo: 'Support prioritaire et fonctionnalités avancées'
  },
  {
    id: 'ultimate',
    name: 'Ultimate',
    price: 9900,
    monthlyPrice: 9900,
    description: 'Pour les grandes entreprises',
    features: [
      'Tout du plan Premium',
      'API personnalisée',
      'Intégrations avancées',
      'Support dédié 24/7',
      'Formation personnalisée',
      'Rapports personnalisés',
      'Gestionnaire de compte dédié',
      'Sauvegardes automatiques',
      '100 produits/services maximum',
      '50 statuts maximum'
    ],
    isPopular: false,
    icon: <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />,
    gradient: 'from-amber-100 to-orange-200',
    buttonColor: 'bg-amber-600 hover:bg-amber-700',
    period: 'mois',
    badge: 'ULTIMATE',
    paymentInfo: 'Support dédié et fonctionnalités exclusives'
  },
];
