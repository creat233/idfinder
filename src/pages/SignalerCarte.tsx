import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Upload, Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";

const SignalerCarte = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    address: "",
    date: new Date().toISOString().split('T')[0],
    description: "",
    cardNumber: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [uploadError, setUploadError] = useState<string | null>(null);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = "Le numéro de carte est requis";
    } else if (!/^\d{10,14}$/.test(formData.cardNumber.trim())) {
      newErrors.cardNumber = "Le numéro de carte doit contenir entre 10 et 14 chiffres";
    }

    if (!formData.address.trim()) {
      newErrors.address = "L'adresse est requise";
    }

    if (!formData.date) {
      newErrors.date = "La date est requise";
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      if (selectedDate > today) {
        newErrors.date = "La date ne peut pas être dans le futur";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError(null);
    
    if (!validateForm()) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez corriger les erreurs dans le formulaire",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) {
        toast({
          title: "Non autorisé",
          description: "Vous devez être connecté pour signaler une carte",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      let photoUrl = null;
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const { error: uploadError, data } = await supabase.storage
          .from('card_photos')
          .upload(fileName, file);

        if (uploadError) {
          setUploadError("Erreur lors du téléchargement de la photo. Veuillez réessayer.");
          throw new Error("Erreur lors du téléchargement de la photo");
        }
        
        if (data) {
          const { data: { publicUrl } } = supabase.storage
            .from('card_photos')
            .getPublicUrl(fileName);
          photoUrl = publicUrl;
        }
      }

      const { error } = await supabase.from('reported_cards').insert({
        reporter_id: user.id,
        card_number: formData.cardNumber.trim(),
        location: formData.address.trim(),
        found_date: formData.date,
        description: formData.description.trim(),
        photo_url: photoUrl,
        status: 'pending'
      });

      if (error) throw error;

      toast({
        title: "Signalement envoyé",
        description: "Nous examinerons votre signalement dans les plus brefs délais.",
      });
      navigate("/");
    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'envoi du signalement",
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
      
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(selectedFile.type)) {
        toast({
          title: "Type de fichier non supporté",
          description: "Veuillez sélectionner une image au format JPG ou PNG",
          variant: "destructive",
        });
        return;
      }
      
      setFile(selectedFile);
      setUploadError(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Signaler une carte trouvée</h1>
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
          {uploadError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{uploadError}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Numéro de la carte</label>
              <Input
                required
                placeholder="Numéro de la carte d'identité"
                value={formData.cardNumber}
                onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
                className={errors.cardNumber ? "border-red-500" : ""}
              />
              {errors.cardNumber && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.cardNumber}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Lieu où la carte a été trouvée</label>
              <div className="flex gap-2">
                <Input 
                  required
                  placeholder="Adresse" 
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className={errors.address ? "border-red-500" : ""}
                />
                <Button variant="outline" size="icon" type="button">
                  <MapPin className="h-4 w-4" />
                </Button>
              </div>
              {errors.address && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.address}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Date de découverte</label>
              <Input 
                required
                type="date" 
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className={errors.date ? "border-red-500" : ""}
                max={new Date().toISOString().split('T')[0]}
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.date}
                </p>
              )}
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
                <label htmlFor="photo-upload" className="cursor-pointer">
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