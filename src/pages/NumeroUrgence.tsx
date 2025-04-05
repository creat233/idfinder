
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useIsMobile } from "@/hooks/use-mobile";
import { EmergencyHeader } from "@/components/emergency/EmergencyHeader";
import { EmergencySearchFilter } from "@/components/emergency/EmergencySearchFilter";
import { EmergencyMapDisplay } from "@/components/emergency/EmergencyMapDisplay";
import { EmergencyNumbersList } from "@/components/emergency/EmergencyNumbersList";
import { EmergencyTips } from "@/components/emergency/EmergencyTips";
import { useEmergencyNumbers } from "@/hooks/useEmergencyNumbers";

const NumeroUrgence = () => {
  const isMobile = useIsMobile();
  const { 
    searchTerm, 
    setSearchTerm, 
    activeCategory, 
    setActiveCategory, 
    showMap, 
    setShowMap, 
    filteredNumbers 
  } = useEmergencyNumbers();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow bg-white">
        <div className="container mx-auto py-12 px-4">
          <EmergencyHeader />

          <EmergencySearchFilter
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            showMap={showMap}
            setShowMap={setShowMap}
          />

          {showMap && !isMobile && (
            <EmergencyMapDisplay showMap={showMap} activeCategory={activeCategory} />
          )}

          <EmergencyNumbersList filteredNumbers={filteredNumbers} />
          
          <EmergencyTips />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NumeroUrgence;
