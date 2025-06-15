
import { useState } from "react";
import { motion } from "framer-motion";
import { PublicHeader } from "@/components/PublicHeader";
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
import { useTranslation } from "@/providers/TranslationProvider";

const NumeroUrgence = () => {
  const { 
    searchTerm, 
    setSearchTerm, 
    activeCategory, 
    setActiveCategory, 
    showMap, 
    setShowMap, 
    filteredNumbers 
  } = useEmergencyNumbers();
  
  const [showDocuments, setShowDocuments] = useState(false);
  const { t } = useTranslation();

  const handleDocumentsToggle = () => {
    setShowDocuments(!showDocuments);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />
      
      <main className="flex-grow bg-white">
        <div className="container mx-auto py-12 px-4">
          <EmergencyHeader />
          
          <div className="max-w-4xl mx-auto">
            <EmergencySearchFilter 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              showMap={showMap}
              setShowMap={setShowMap}
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
                    {t('hide_documents_info')}
                    <ChevronUp className="h-5 w-5" />
                  </>
                ) : (
                  <>
                    {t('show_documents_info')}
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
