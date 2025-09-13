
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

const VerifiedMCards = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentLanguage, setCurrentLanguage] = useState<'fr' | 'en'>('fr');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const { toast } = useToast();
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
      
      {/* Header style Instagram/TikTok - Responsive */}
      <div className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
        isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
        {/* Background avec glassmorphisme */}
        <div className="bg-black/40 backdrop-blur-xl border-b border-white/10">
          <div className="px-4 sm:px-6 lg:px-8">
            {/* Mobile/Tablet Design */}
            <div className="lg:hidden">
              <div className="py-4 text-center">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                    MCards Vérifiées
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-white/70 mt-1">
                  Professionnels certifiés
                </p>
              </div>
            </div>
            
            {/* Desktop Design */}
            <div className="hidden lg:block">
              <div className="py-6 text-center">
                <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                  <span className="bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent">
                    MCards Vérifiées
                  </span>
                </h1>
                <p className="text-purple-200/80 text-base font-light tracking-wide">
                  Découvrez les professionnels certifiés
                </p>
                <div className="mt-4 mx-auto w-24 h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Container principal - Responsive padding */}
      <div className={`relative z-10 w-full transition-all duration-300 ${
        isHeaderVisible 
          ? 'pt-20 sm:pt-24 lg:pt-32' 
          : 'pt-2 sm:pt-4 lg:pt-6'
      }`}>
        
        {/* Stories Section - Style Instagram */}
        <div className="mb-4 sm:mb-6">
          <StatusCarousel />
        </div>

        {/* Produits épinglés - Style TikTok Feed */}
        <div className="px-2 sm:px-4 lg:px-6">
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
      
      {/* Bouton de traduction style TikTok - Responsive */}
      <div className="fixed bottom-6 right-4 sm:bottom-8 sm:right-6 lg:bottom-12 lg:right-8 z-[100]">
        <div className="bg-black/40 backdrop-blur-xl rounded-full p-2 lg:p-3 border border-white/20 shadow-lg">
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
