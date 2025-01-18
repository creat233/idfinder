import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const SignalerCarte = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    address: "",
    date: "",
    description: "",
    cardNumber: "",
  });
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("User not authenticated");

      let photoUrl = null;
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError, data } = await supabase.storage
          .from('card_photos')
          .upload(fileName, file);

        if (uploadError) throw uploadError;
        if (data) photoUrl = data.path;
      }

      const { error } = await supabase.from('reported_cards').insert({
        reporter_id: user.id,
        card_number: formData.cardNumber,
        location: formData.address,
        found_date: formData.date,
        description: formData.description,
        photo_url: photoUrl,
      });

      if (error) throw error;

      toast({
        title: "Signalement envoyé",
        description: "Nous examinerons votre signalement dans les plus brefs délais.",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast({
          title: "Fichier trop volumineux",
          description: "La taille du fichier ne doit pas dépasser 5MB",
          variant: "destructive",
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto py-12">
        <h1 className="text-4xl font-bold text-center mb-8">Signaler une carte trouvée</h1>
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Numéro de la carte</label>
              <Input
                required
                placeholder="Numéro de la carte d'identité"
                value={formData.cardNumber}
                onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Lieu où la carte a été trouvée</label>
              <div className="flex gap-2">
                <Input 
                  required
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
                required
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
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="photo-upload"
                />
                <label htmlFor="photo-upload">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    type="button"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {file ? file.name : "Ajouter une photo"}
                  </Button>
                </label>
                <p className="mt-2 text-sm text-gray-500">PNG, JPG jusqu'à 5MB</p>
              </div>
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                "Soumettre le signalement"
              )}
            </Button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignalerCarte;