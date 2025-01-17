import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality when backend is ready
    console.log("Searching for:", searchQuery);
  };

  return (
    <motion.section 
      className="py-20 bg-gradient-to-b from-white to-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center max-w-3xl mx-auto"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-5xl font-bold text-primary mb-6">
            Retrouvez vos papiers d'identité perdus
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Une solution simple et sécurisée pour récupérer vos documents d'identité égarés
          </p>
          
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
            <div className="flex gap-4">
              <Input
                type="search"
                placeholder="Entrez le numéro de votre pièce d'identité..."
                className="flex-grow"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit">
                <Search className="h-4 w-4 mr-2" />
                Rechercher
              </Button>
            </div>
          </form>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate("/signaler")}
              className="bg-secondary hover:bg-secondary/90"
            >
              Signaler une carte trouvée
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate("/support")}
            >
              Comment ça marche ?
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};