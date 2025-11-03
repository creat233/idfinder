
import { useState, useEffect, useRef } from "react";
import { PublicHeader } from "@/components/PublicHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { MCardTranslateButton } from "@/components/mcards/translate/MCardTranslateButton";
import { ProductImageCarousel } from "@/components/verified/ProductImageCarousel";
import { StatusCarousel } from "@/components/verified/StatusCarousel";
import { PinnedProductsCarousel } from "@/components/verified/PinnedProductsCarousel";
import { VerifiedMCardsGrid } from "@/components/verified/VerifiedMCardsGrid";
import { MCard, MCardProduct } from "@/types/mcard";
import { useToast } from "@/hooks/use-toast";
import { useOfflineSync } from "@/hooks/useOfflineSync";
import { offlineStorage } from "@/services/offlineStorage";

const VerifiedMCards = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentLanguage, setCurrentLanguage] = useState<'fr' | 'en'>('fr');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const { toast } = useToast();
  const { isOnline } = useOfflineSync();
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
          // Scroll vers le bas - masquer le header
          setIsHeaderVisible(false);
        } else {
          // Scroll vers le haut - afficher le header
          setIsHeaderVisible(true);
        }
      } else {
        // En haut de la page - toujours afficher
        setIsHeaderVisible(true);
      }

      lastScrollY.current = currentScrollY;

      // Debounce pour éviter trop d'updates
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      scrollTimeout.current = setTimeout(() => {
        // Réafficher après inactivité
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 overflow-hidden">
      {/* Header pour desktop uniquement */}
      {!isMobile && <PublicHeader />}
      
      {/* Hero Section avec recherche glassmorphism */}
      <div className="relative pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 animate-fade-in">
            Découvrez les Professionnels
          </h1>
          <p className="text-lg sm:text-xl text-white/80 mb-8 animate-fade-in">
            Explorez les produits et services des professionnels actifs
          </p>
          
          {/* Barre de recherche avec effet glassmorphism */}
          <div className="max-w-2xl mx-auto animate-scale-in">
            <div className="relative backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 shadow-2xl">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Rechercher par nom, entreprise, secteur d'activité..."
                  className="flex-1 px-6 py-4 rounded-xl bg-white/90 backdrop-blur-sm border-2 border-white/30 text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 text-base"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Container principal */}
      <div className="relative z-10 w-full">
        {/* Stories Section - Design professionnel */}
        <div className="mb-10 sm:mb-12">
          <StatusCarousel />
        </div>

        {/* Produits épinglés - Feed professionnel */}
        <div className="px-2 sm:px-4 lg:px-6 mb-12">
          <PinnedProductsCarousel onImageClick={handleImageClick} />
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

      {/* Grille des MCards */}
      <div className="px-4 sm:px-6 lg:px-8 pb-16">
        <VerifiedMCardsGrid 
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
        />
      </div>
      
      {/* Particules flottantes améliorées et subtiles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-purple-400/10 rounded-full animate-pulse blur-xl"></div>
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-pink-400/15 rounded-full animate-ping blur-lg"></div>
        <div className="absolute top-1/2 left-3/4 w-3 h-3 bg-blue-400/10 rounded-full animate-bounce blur-xl"></div>
        <div className="absolute top-1/3 right-1/3 w-5 h-5 bg-indigo-400/10 rounded-full animate-pulse blur-2xl"></div>
        <div className="absolute bottom-1/4 left-1/2 w-4 h-4 bg-violet-400/15 rounded-full animate-ping blur-lg"></div>
      </div>
    </div>
  );
};

export default VerifiedMCards;
