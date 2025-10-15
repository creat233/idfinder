import { useState } from "react";
import { PublicHeader } from "@/components/PublicHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { ProductImageCarousel } from "@/components/verified/ProductImageCarousel";
import { UnverifiedStatusCarousel } from "@/components/unverified/UnverifiedStatusCarousel";
import { UnverifiedProductsCarousel } from "@/components/unverified/UnverifiedProductsCarousel";
import { UnverifiedMCardsGrid } from "@/components/unverified/UnverifiedMCardsGrid";
import { MCard, MCardProduct } from "@/types/mcard";

const UnverifiedMCards = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const isMobile = useIsMobile();

  const [selectedProducts, setSelectedProducts] = useState<MCardProduct[]>([]);
  const [selectedMCards, setSelectedMCards] = useState<MCard[]>([]);
  const [selectedProductIndex, setSelectedProductIndex] = useState(0);

  const handleImageClick = (products: MCardProduct[], mcards: MCard[], productIndex: number) => {
    setSelectedProducts(products);
    setSelectedMCards(mcards);
    setSelectedProductIndex(productIndex);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 overflow-hidden">
      {/* Header pour desktop uniquement */}
      {!isMobile && <PublicHeader />}
      
      {/* Container principal */}
      <div className="relative z-10 w-full">
        {/* En-tête de la page */}
        <div className="text-center py-8 px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            🌟 Découvrez les Nouveaux Talents
          </h1>
          <p className="text-white/70 text-lg">
            Professionnels actifs sur mCard
          </p>
        </div>
        
        {/* Stories Section - Style Instagram */}
        <div className="mb-4 sm:mb-6">
          <UnverifiedStatusCarousel />
        </div>

        {/* Produits épinglés - Style TikTok Feed */}
        <div className="px-2 sm:px-4 lg:px-6">
          <UnverifiedProductsCarousel onImageClick={handleImageClick} />
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

      {/* Grille des MCards non vérifiées et actives */}
      <UnverifiedMCardsGrid 
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
      />
      
      {/* Particules flottantes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-indigo-400/30 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400/40 rounded-full animate-ping"></div>
        <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-blue-400/20 rounded-full animate-bounce"></div>
      </div>
    </div>
  );
};

export default UnverifiedMCards;
