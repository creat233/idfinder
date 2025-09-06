
import { useState, useEffect } from "react";
import { PublicHeader } from "@/components/PublicHeader";
import { MCardSearchBar } from "@/components/mcards/MCardSearchBar";
import { MCardTranslateButton } from "@/components/mcards/translate/MCardTranslateButton";
import { ProductCarousel } from "@/components/verified/ProductCarousel";
import { ProductImageCarousel } from "@/components/verified/ProductImageCarousel";
import { StatusCarousel } from "@/components/verified/StatusCarousel";
import { MCard, MCardProduct } from "@/types/mcard";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const VerifiedMCards = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentLanguage, setCurrentLanguage] = useState<'fr' | 'en'>('fr');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { toast } = useToast();

  const categories = [
    { id: "all", name: "Tout" },
    { id: "Service", name: "Service" },
    { id: "Produit", name: "Produit" },
    { id: "Article", name: "Article" },
    { id: "Menu restaurant", name: "Menu restaurant" },
    { id: "Consultation", name: "Consultation" },
    { id: "Formation", name: "Formation" },
    { id: "Événement", name: "Événement" },
    { id: "Autre", name: "Autre" }
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const [selectedProducts, setSelectedProducts] = useState<MCardProduct[]>([]);
  const [selectedMCards, setSelectedMCards] = useState<MCard[]>([]);
  const [selectedProductIndex, setSelectedProductIndex] = useState(0);

  const handleImageClick = (products: MCardProduct[], mcards: MCard[], productIndex: number) => {
    setSelectedProducts(products);
    setSelectedMCards(mcards);
    setSelectedProductIndex(productIndex);
    setIsModalOpen(true);
  };

  const getTranslatedText = (text: string) => {
    if (currentLanguage === 'fr') return text;
    
    const translations: Record<string, string> = {
      'MCards Vérifiées': 'Verified MCards',
      'Découvrez les produits et services': 'Discover products and services',
      'des professionnels vérifiés': 'from verified professionals',
      'Rechercher par nom, entreprise, secteur d\'activité, service...': 'Search by name, company, industry, service...',
    };

    return translations[text] || text;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 pb-24 md:pb-0">
      <PublicHeader />
      
      {/* Header simplifié */}
      <div className="text-center py-8 px-4">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Services & Produits
        </h1>
        
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-6 px-4">
          <div className="relative">
            <MCardSearchBar 
              onSearch={handleSearch}
              placeholder={`🔍 ${getTranslatedText('Rechercher par nom, entreprise, secteur d\'activité, service...')}`}
              className="shadow-xl bg-white/90 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl"
            />
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/5 via-blue-500/5 to-purple-500/5 -z-10"></div>
          </div>
        </div>
        
        <p className="text-lg text-gray-600 mb-6 max-w-xl mx-auto">
          {getTranslatedText('Découvrez les produits et services')} <span className="font-semibold text-blue-600">{getTranslatedText('des professionnels vérifiés')}</span>
        </p>

        {/* Filtres par catégorie */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex flex-wrap justify-center gap-2 px-4">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={`transition-all duration-200 ${
                  selectedCategory === category.id 
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                }`}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Carousel de statuts */}
      <StatusCarousel />

      {/* Carousel de produits */}
      <ProductCarousel onImageClick={handleImageClick} selectedCategory={selectedCategory} />

      {/* Carousel pour afficher les images avec navigation */}
      <ProductImageCarousel
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        products={selectedProducts}
        mcards={selectedMCards}
        initialProductIndex={selectedProductIndex}
      />
      
      {/* Bouton de traduction */}
      <div className="fixed bottom-20 right-4 z-[100]">
        <MCardTranslateButton
          currentLanguage={currentLanguage}
          onLanguageChange={setCurrentLanguage}
        />
      </div>
      
    </div>
  );
};

export default VerifiedMCards;
