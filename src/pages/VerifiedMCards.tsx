
import { useState, useEffect } from "react";
import { PublicHeader } from "@/components/PublicHeader";

import { MCardSearchBar } from "@/components/mcards/MCardSearchBar";
import { MCardTranslateButton } from "@/components/mcards/translate/MCardTranslateButton";
import { ProductCarousel } from "@/components/verified/ProductCarousel";
import { ProductImageModal } from "@/components/verified/ProductImageModal";
import { CheckCircle } from "lucide-react";
import { MCard, MCardProduct } from "@/types/mcard";
import { useToast } from "@/hooks/use-toast";

const VerifiedMCards = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentLanguage, setCurrentLanguage] = useState<'fr' | 'en'>('fr');
  const [selectedProduct, setSelectedProduct] = useState<MCardProduct | null>(null);
  const [selectedMCard, setSelectedMCard] = useState<MCard | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleImageClick = (product: MCardProduct, mcard: MCard) => {
    setSelectedProduct(product);
    setSelectedMCard(mcard);
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
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mb-4 shadow-lg">
          <CheckCircle className="h-8 w-8 text-white" />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          {getTranslatedText('MCards Vérifiées')}
        </h1>
        
        <p className="text-lg text-gray-600 mb-6 max-w-xl mx-auto">
          {getTranslatedText('Découvrez les produits et services')} <span className="font-semibold text-blue-600">{getTranslatedText('des professionnels vérifiés')}</span>
        </p>
        
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8 px-4">
          <div className="relative">
            <MCardSearchBar 
              onSearch={handleSearch}
              placeholder={`🔍 ${getTranslatedText('Rechercher par nom, entreprise, secteur d\'activité, service...')}`}
              className="shadow-xl bg-white/90 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl"
            />
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/5 via-blue-500/5 to-purple-500/5 -z-10"></div>
          </div>
        </div>
      </div>

      {/* Carousel de produits */}
      <ProductCarousel onImageClick={handleImageClick} />

      {/* Modal pour afficher l'image et le profil */}
      <ProductImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        mcard={selectedMCard}
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
