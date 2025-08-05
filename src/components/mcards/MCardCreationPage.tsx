
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Crown, CreditCard, Users, TrendingUp, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { MCardFormDialog } from "./MCardFormDialog";
import { useMCards } from "@/hooks/useMCards";
import { useMCardsFormHandler } from "@/hooks/useMCardsFormHandler";

export const MCardCreationPage = () => {
  const [selectedPlan, setSelectedPlan] = useState<'essential' | 'premium' | 'ultimate'>('essential');
  const { mcards, createMCard, updateMCard, loading } = useMCards();

  const {
    isFormOpen,
    editingMCard,
    planForNewCard,
    isCreating,
    formLoading,
    handleOpenEdit,
    handleStartCreationFlow,
    handleFormSubmit,
    handleFormOpenChange,
  } = useMCardsFormHandler({ mcards, createMCard, updateMCard, loading });

  const plans = [
    {
      id: 'essential',
      name: 'Essentiel',
      price: 2000,
      period: 'mois',
      description: 'Parfait pour les professionnels',
      features: [
        'Carte de visite digitale complète',
        'Informations de contact complètes',
        'Réseaux sociaux professionnels',
        'Statistiques de consultation',
        'Mise à jour en temps réel',
        'Support par email',
        'Partage illimité via QR code'
      ],
      icon: <Zap className="h-6 w-6" />,
      gradient: 'from-blue-500 to-blue-700',
      borderColor: 'border-blue-200',
      bgColor: 'bg-blue-50',
      isPopular: true
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 5000,
      period: 'mois',
      description: 'Solution complète pour entrepreneurs',
      features: [
        'Tout du plan Essentiel',
        'Statuts personnalisés en temps réel',
        'Catalogue produits/services intégré',
        'Analytics avancées et exports',
        'Support prioritaire 24/7',
        'Personnalisation avancée',
        'Intégrations CRM et outils pro',
        'Thèmes et couleurs personnalisés'
      ],
      icon: <Crown className="h-6 w-6" />,
      gradient: 'from-purple-500 to-purple-700',
      borderColor: 'border-purple-200',
      bgColor: 'bg-purple-50',
      isPopular: false
    },
    {
      id: 'ultimate',
      name: 'Ultimate',
      price: 9900,
      period: 'mois',
      description: 'Pour les grandes entreprises',
      features: [
        'Tout du plan Premium',
        'API personnalisée',
        'Intégrations avancées',
        'Support dédié 24/7',
        'Formation personnalisée',
        'Rapports personnalisés',
        'Gestionnaire de compte dédié',
        'Sauvegardes automatiques'
      ],
      icon: <Star className="h-6 w-6" />,
      gradient: 'from-amber-500 to-orange-600',
      borderColor: 'border-amber-200',
      bgColor: 'bg-amber-50',
      isPopular: false
    }
  ];

  const currentPlan = plans.find(plan => plan.id === selectedPlan)!;

  const handleCreateCard = () => {
    handleStartCreationFlow(selectedPlan);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Créez Votre Carte de Visite Digitale
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            Révolutionnez votre networking avec une carte professionnelle moderne
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Plan Selection */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Choisissez Votre Plan</h2>
          <p className="text-gray-600 text-lg">Sélectionnez le plan qui correspond à vos besoins</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className={cn(
                "relative cursor-pointer transition-all duration-300 hover:scale-105",
                selectedPlan === plan.id ? `ring-2 ring-offset-2 ${plan.borderColor.replace('border-', 'ring-')} shadow-xl` : "hover:shadow-lg",
                plan.isPopular && "border-2 border-yellow-400"
              )}
              onClick={() => setSelectedPlan(plan.id as 'essential' | 'premium' | 'ultimate')}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-yellow-500 text-white px-4 py-1">
                    <Star className="h-4 w-4 mr-1" />
                    POPULAIRE
                  </Badge>
                </div>
              )}

              <CardHeader className={cn("text-center", plan.bgColor)}>
                <div className="flex justify-center mb-4">
                  <div className={cn("p-3 rounded-full bg-gradient-to-r text-white", plan.gradient)}>
                    {plan.icon}
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <p className="text-gray-600">{plan.description}</p>
                <div className="text-4xl font-bold text-gray-900 mt-4">
                  {new Intl.NumberFormat().format(plan.price)} FCFA
                  <span className="text-lg font-normal text-gray-600">/{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>


        {/* Create Button */}
        <div className="text-center mt-12">
          <Button 
            size="lg" 
            className={cn("text-white font-semibold px-8 py-4 text-lg bg-gradient-to-r", currentPlan.gradient)}
            onClick={handleCreateCard}
            disabled={loading || isCreating}
          >
            {isCreating ? 'Création en cours...' : `Créer Ma Carte ${currentPlan.name} - ${new Intl.NumberFormat().format(currentPlan.price)} FCFA`}
          </Button>
          <p className="text-sm text-gray-500 mt-3">
            ✓ Paiement sécurisé • ✓ Activation sous 24h • ✓ Support inclus
          </p>
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold">500+</h3>
            <p className="text-gray-600">Cartes créées</p>
          </div>
          <div className="space-y-2">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold">95%</h3>
            <p className="text-gray-600">Satisfaction client</p>
          </div>
          <div className="space-y-2">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <Star className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold">24h</h3>
            <p className="text-gray-600">Activation moyenne</p>
          </div>
        </div>
      </div>

      <MCardFormDialog
        isOpen={isFormOpen}
        onOpenChange={handleFormOpenChange}
        onSubmit={handleFormSubmit}
        loading={formLoading}
        mcard={editingMCard}
      />
    </div>
  );
};
