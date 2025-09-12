
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
    { id: "Offre d'emploi", name: "Offre d'emploi" },
    { id: "Santé et beauté", name: "Santé et beauté" },
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 pb-24 md:pb-0 overflow-hidden">
      <PublicHeader />
      
      {/* Header Style TikTok */}
      <div className="relative text-center py-6 px-4 bg-gradient-to-b from-black/20 to-transparent">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22white%22%20fill-opacity%3D%220.02%22%3E%3Cpath%20d%3D%22M20%2020c0-11.046-8.954-20-20-20v40c11.046%200%2020-8.954%2020-20z%22/%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        
        <h1 className="text-2xl md:text-3xl font-black text-white mb-3 tracking-tight">
          🔥 <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">Discover</span>
        </h1>
        
        {/* Search Bar Style TikTok */}
        <div className="max-w-md mx-auto mb-4 px-4">
          <div className="relative">
            <MCardSearchBar 
              onSearch={handleSearch}
              placeholder="🔍 Rechercher..."
              className="bg-black/20 border-white/20 text-white placeholder:text-white/70 backdrop-blur-xl rounded-full h-12 shadow-2xl"
            />
          </div>
        </div>

        {/* Filtres Style TikTok */}
        <div className="max-w-full mx-auto mb-6 overflow-hidden">
          <div className="flex gap-2 px-4 overflow-x-auto scrollbar-hide pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 flex-shrink-0 ${
                  selectedCategory === category.id 
                    ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg scale-105" 
                    : "bg-white/10 text-white/80 border border-white/20 hover:bg-white/20"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Container principal style TikTok */}
      <div className="relative z-10">
        {/* Stories en premier (statuts) */}
        <div className="mb-6">
          <StatusCarousel />
        </div>

        {/* Feed principal */}
        <div className="relative">
          <ProductCarousel onImageClick={handleImageClick} selectedCategory={selectedCategory} />
        </div>
      </div>

      {/* Modal d'images */}
      <ProductImageCarousel
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        products={selectedProducts}
        mcards={selectedMCards}
        initialProductIndex={selectedProductIndex}
      />
      
      {/* Bouton de traduction style TikTok */}
      <div className="fixed bottom-20 right-4 z-[100]">
        <div className="bg-black/40 backdrop-blur-xl rounded-full p-2 border border-white/20">
          <MCardTranslateButton
            currentLanguage={currentLanguage}
            onLanguageChange={setCurrentLanguage}
          />
        </div>
      </div>
      
      {/* Particules flottantes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-pink-400/30 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400/40 rounded-full animate-ping"></div>
        <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-blue-400/20 rounded-full animate-bounce"></div>
      </div>
    </div>
  );
};

export default VerifiedMCards;
