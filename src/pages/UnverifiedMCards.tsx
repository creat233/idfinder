import { useState, useEffect, useRef } from "react";
import { PublicHeader } from "@/components/PublicHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { ProductImageCarousel } from "@/components/verified/ProductImageCarousel";
import { ProductCarousel } from "@/components/verified/ProductCarousel";
import { UnverifiedMCardsGrid } from "@/components/verified/UnverifiedMCardsGrid";
import { MCard, MCardProduct } from "@/types/mcard";

const UnverifiedMCards = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const isMobile = useIsMobile();
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

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

  // Gestion du scroll pour masquer/afficher le header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollThreshold = 100;

      if (currentScrollY > scrollThreshold) {
        if (currentScrollY > lastScrollY.current) {
          setIsHeaderVisible(false);
        } else {
          setIsHeaderVisible(true);
        }
      } else {
        setIsHeaderVisible(true);
      }

      lastScrollY.current = currentScrollY;

      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      scrollTimeout.current = setTimeout(() => {
        setIsHeaderVisible(true);
      }, 3000);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 overflow-hidden">
      {!isMobile && <PublicHeader />}
      
      <div className="relative z-10 w-full pt-4">
        <div className="text-center mb-6 px-4">
          <h1 className="text-3xl font-bold text-white mb-2">Produits & Services</h1>
          <p className="text-gray-300">Découvrez les produits et services proposés</p>
        </div>

        {/* Produits non vérifiés - Style TikTok Feed */}
        <div className="mb-8">
          <ProductCarousel 
            onImageClick={handleImageClick}
            selectedCategory={selectedCategory === "all" ? undefined : selectedCategory}
            showVerified={false}
          />
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

      {/* Grille des MCards non vérifiées - Cachée pour le moment */}
      {searchQuery && (
        <UnverifiedMCardsGrid 
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
        />
      )}
      
      {/* Particules flottantes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-pink-400/30 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400/40 rounded-full animate-ping"></div>
        <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-blue-400/20 rounded-full animate-bounce"></div>
      </div>
    </div>
  );
};

export default UnverifiedMCards;
