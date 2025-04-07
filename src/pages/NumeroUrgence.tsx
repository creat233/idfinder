
import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useEmergencyNumbers } from "@/hooks/useEmergencyNumbers";
import { EmergencyHeader } from "@/components/emergency/EmergencyHeader";
import { EmergencySearchFilter } from "@/components/emergency/EmergencySearchFilter";
import { EmergencyNumbersList } from "@/components/emergency/EmergencyNumbersList";
import { EmergencyMapDisplay } from "@/components/emergency/EmergencyMapDisplay";
import { EmergencyTips } from "@/components/emergency/EmergencyTips";
import { SenegaleseDocuments } from "@/components/emergency/SenegaleseDocuments";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

const NumeroUrgence = () => {
  const { filteredNumbers, setSearchQuery, setFilter } = useEmergencyNumbers();
  const [showMap, setShowMap] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showDocuments, setShowDocuments] = useState(false);

  const handleMapToggle = () => {
    setShowMap(!showMap);
    if (!showMap) {
      // Reset active category when map is shown
      setActiveCategory(null);
    }
  };

  const handleCategoryClick = (category: string | null) => {
    setActiveCategory(category);
    setShowMap(true); // Show map when category is clicked
    setFilter(category);
  };

  const handleDocumentsToggle = () => {
    setShowDocuments(!showDocuments);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow bg-white">
        <div className="container mx-auto py-12 px-4">
          <EmergencyHeader />
          
          <div className="max-w-4xl mx-auto">
            <EmergencySearchFilter 
              onSearchChange={setSearchQuery} 
              onCategoryClick={handleCategoryClick}
              onMapToggle={handleMapToggle}
              showMap={showMap}
            />
            
            <EmergencyMapDisplay 
              showMap={showMap} 
              activeCategory={activeCategory} 
            />
            
            <div className="mb-12">
              <EmergencyNumbersList filteredNumbers={filteredNumbers} />
            </div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-6"
            >
              <Button
                onClick={handleDocumentsToggle}
                variant="outline"
                className="w-full flex items-center justify-center gap-2 py-6"
              >
                {showDocuments ? (
                  <>
                    Masquer les informations sur les documents
                    <ChevronUp className="h-5 w-5" />
                  </>
                ) : (
                  <>
                    Afficher les informations sur les documents d'identité
                    <ChevronDown className="h-5 w-5" />
                  </>
                )}
              </Button>
            </motion.div>
            
            {showDocuments && <SenegaleseDocuments />}
            
            <EmergencyTips />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NumeroUrgence;
