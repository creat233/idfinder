import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useState } from "react";

const SignalerCarte = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    address: "",
    date: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Formulaire envoyé",
      description: "Nous examinerons votre signalement dans les plus brefs délais.",
    });
  };

  const handlePhotoUpload = () => {
    toast({
      title: "Upload de photo",
      description: "Cette fonctionnalité sera bientôt disponible.",
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto py-12">
        <h1 className="text-4xl font-bold text-center mb-8">Signaler une carte trouvée</h1>
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Lieu où la carte a été trouvée</label>
              <div className="flex gap-2">
                <Input 
                  placeholder="Adresse" 
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
                <Button variant="outline" size="icon" type="button">
                  <MapPin className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Date de découverte</label>
              <Input 
                type="date" 
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Description des circonstances</label>
              <Textarea 
                placeholder="Décrivez où et comment vous avez trouvé la carte..." 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Photo de la carte (optionnel)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Button 
                  variant="outline" 
                  className="w-full"
                  type="button"
                  onClick={handlePhotoUpload}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Ajouter une photo
                </Button>
                <p className="mt-2 text-sm text-gray-500">PNG, JPG jusqu'à 5MB</p>
              </div>
            </div>
            
            <Button type="submit" className="w-full">
              Soumettre le signalement
            </Button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignalerCarte;