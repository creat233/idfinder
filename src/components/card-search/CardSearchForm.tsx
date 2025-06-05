
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, AlertCircle, Bell, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FoundCardResult } from "@/components/card-report/FoundCardResult";

export const CardSearchForm = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [foundCard, setFoundCard] = useState<any>(null);
  const [showNotFoundMessage, setShowNotFoundMessage] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Champ requis",
        description: "Veuillez entrer un numéro de pièce d'identité pour rechercher",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    setFoundCard(null);
    setShowNotFoundMessage(false);

    try {
      // Recherche dans la base de données
      const { data, error } = await supabase
        .from('reported_cards')
        .select('*')
        .eq('card_number', searchQuery.trim())
        .eq('status', 'pending')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setFoundCard(data);
        toast({
          title: "Carte trouvée !",
          description: "Votre document a été trouvé et signalé sur notre plateforme",
        });
      } else {
        setShowNotFoundMessage(true);
        toast({
          title: "Carte non trouvée",
          description: "Votre carte n'a pas encore été signalée. Nous vous notifierons dès qu'elle sera publiée.",
        });
      }
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la recherche",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Barre de recherche */}
      <Card className="border-2 border-primary/20 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl text-primary">
            Rechercher votre document
          </CardTitle>
          <p className="text-center text-gray-600">
            Entrez le numéro de votre pièce d'identité pour vérifier si elle a été trouvée
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Ex: 123456789"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10 py-6 text-lg border-2 border-gray-200 focus:border-primary"
              />
            </div>
            <Button 
              onClick={handleSearch}
              disabled={isSearching}
              className="px-8 py-6 text-lg font-semibold"
            >
              {isSearching ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Recherche...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-5 w-5" />
                  Rechercher
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Résultat de la recherche - Carte trouvée */}
      {foundCard && (
        <div className="space-y-4">
          <FoundCardResult cardData={foundCard} />
        </div>
      )}

      {/* Message pour carte non trouvée */}
      {showNotFoundMessage && (
        <Card className="border-2 border-orange-200 bg-orange-50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <CardTitle className="text-xl text-orange-800">Carte non trouvée</CardTitle>
                <p className="text-orange-700">Votre document n'a pas encore été signalé sur notre plateforme</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-orange-200">
              <h4 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Système de notification automatique
              </h4>
              <div className="space-y-3 text-sm text-orange-700">
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300">1</Badge>
                  <p>Votre recherche a été enregistrée dans notre système</p>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300">2</Badge>
                  <p>Dès qu'une carte avec ce numéro sera signalée, vous recevrez une notification immédiate</p>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300">3</Badge>
                  <p>Vous pourrez alors contacter directement la personne qui l'a trouvée</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                En attendant, que faire ?
              </h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Revenez vérifier régulièrement sur la plateforme</li>
                <li>• Téléchargez notre application mobile pour recevoir les notifications en temps réel</li>
                <li>• Partagez l'information avec vos proches - ils pourraient l'avoir trouvée !</li>
                <li>• Contactez les lieux que vous avez récemment visités</li>
              </ul>
            </div>

            <div className="text-center">
              <Button 
                variant="outline" 
                className="border-orange-300 text-orange-700 hover:bg-orange-100"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = '/FinderID (1).apk';
                  link.download = 'FinderID.apk';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  
                  toast({
                    title: "Téléchargement démarré",
                    description: "L'application mobile vous permettra de recevoir des notifications instantanées",
                  });
                }}
              >
                📱 Télécharger l'app mobile pour les notifications
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
