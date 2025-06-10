
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface FoundCard {
  id: string;
  card_number: string;
  location: string;
  found_date: string;
  description: string;
  document_type: string;
  photo_url: string;
  reporter_phone: string;
  created_at: string;
}

export const DashboardSearch = () => {
  const [searchNumber, setSearchNumber] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [foundCard, setFoundCard] = useState<FoundCard | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchNumber.trim()) {
      toast.error({
        title: "Erreur",
        description: "Veuillez saisir un numéro de carte",
      });
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    setFoundCard(null);

    try {
      // Rechercher la carte dans la base de données
      const { data, error } = await supabase
        .from("reported_cards")
        .select("*")
        .eq("card_number", searchNumber.trim())
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (data) {
        setFoundCard(data);
        toast.success({
          title: "Carte trouvée !",
          description: "Nous avons trouvé votre carte. Consultez les détails ci-dessous.",
        });

        // Enregistrer la recherche pour les statistiques
        await supabase.from("card_searches").insert({
          card_number: searchNumber.trim(),
        });
      } else {
        toast.default({
          title: "Carte non trouvée",
          description: "Aucune carte avec ce numéro n'a été signalée pour le moment.",
        });

        // Enregistrer la recherche même si aucune carte n'est trouvée
        await supabase.from("card_searches").insert({
          card_number: searchNumber.trim(),
        });
      }
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
      toast.error({
        title: "Erreur",
        description: "Une erreur est survenue lors de la recherche",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      id: "Carte d'identité nationale",
      driver_license: "Permis de conduire",
      passport: "Passeport",
      vehicle_registration: "Carte grise véhicule",
      motorcycle_registration: "Carte grise moto",
      residence_permit: "Carte de séjour",
      student_card: "Carte étudiante",
    };
    return types[type] || type;
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Rechercher votre carte</h2>
          <p className="text-gray-600 mb-8">
            Entrez le numéro de votre carte perdue pour voir si elle a été trouvée
          </p>

          <div className="flex gap-4 mb-8">
            <Input
              placeholder="Numéro de la carte (ex: 123456789)"
              value={searchNumber}
              onChange={(e) => setSearchNumber(e.target.value)}
              className="flex-1"
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button 
              onClick={handleSearch} 
              disabled={isSearching}
              className="px-6"
            >
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              {isSearching ? "Recherche..." : "Rechercher"}
            </Button>
          </div>

          {/* Résultats de la recherche */}
          {hasSearched && foundCard && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-left">
              <h3 className="text-xl font-semibold text-green-800 mb-4">
                🎉 Votre carte a été trouvée !
              </h3>
              
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium">Type de document :</span>{" "}
                  <span>{getDocumentTypeLabel(foundCard.document_type)}</span>
                </div>
                
                <div>
                  <span className="font-medium">Lieu de découverte :</span>{" "}
                  <span>{foundCard.location}</span>
                </div>
                
                <div>
                  <span className="font-medium">Date de découverte :</span>{" "}
                  <span>{new Date(foundCard.found_date).toLocaleDateString("fr-FR")}</span>
                </div>
                
                {foundCard.description && (
                  <div>
                    <span className="font-medium">Description :</span>{" "}
                    <span>{foundCard.description}</span>
                  </div>
                )}

                {foundCard.photo_url && (
                  <div>
                    <span className="font-medium">Photo :</span>
                    <img 
                      src={foundCard.photo_url} 
                      alt="Photo de la carte trouvée" 
                      className="mt-2 max-w-xs rounded-lg"
                    />
                  </div>
                )}
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">
                  Pour récupérer votre carte :
                </h4>
                {foundCard.document_type === "student_card" ? (
                  <div className="text-sm text-blue-700">
                    <p>📞 Contactez directement la personne qui a trouvé votre carte :</p>
                    <p className="font-mono text-lg mt-1">{foundCard.reporter_phone}</p>
                    <p className="text-xs mt-2 text-green-600">
                      ✨ Service gratuit pour les cartes étudiantes
                    </p>
                  </div>
                ) : (
                  <div className="text-sm text-blue-700">
                    <p className="mb-2">
                      💰 <strong>Frais de récupération :</strong> 7'000 FCFA
                    </p>
                    <p className="mb-2">
                      🎁 <strong>Récompense pour le découvreur :</strong> 2'000 FCFA
                    </p>
                    <p className="mb-2">
                      📞 <strong>Contact :</strong> {foundCard.reporter_phone}
                    </p>
                    <p className="text-xs text-gray-600">
                      Les frais couvrent les services administratifs et la récompense du découvreur
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {hasSearched && !foundCard && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-left">
              <h3 className="text-xl font-semibold text-yellow-800 mb-4">
                😔 Carte non trouvée
              </h3>
              <p className="text-yellow-700 mb-4">
                Votre carte n'a pas encore été signalée. Ne vous inquiétez pas, voici ce que vous pouvez faire :
              </p>
              
              <div className="space-y-3 text-sm text-yellow-700">
                <div>• Vérifiez que le numéro est correct</div>
                <div>• Revenez vérifier régulièrement</div>
                <div>• Contactez-nous si vous avez des questions</div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-blue-700">
                  💡 <strong>Astuce :</strong> Nous vous notifierons automatiquement si votre carte est trouvée !
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
