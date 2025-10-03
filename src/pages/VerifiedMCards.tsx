
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
      
      {/* Container principal - Sans padding du header */}
      <div className="relative z-10 w-full">{/* Header retiré complètement */}
        
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

      {/* Grille des MCards vérifiées et actives */}
      <VerifiedMCardsGrid 
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
      />
      
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
