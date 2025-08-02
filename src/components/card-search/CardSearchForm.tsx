
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, AlertCircle, Bell, Clock, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FoundCardResult } from "@/components/card-report/FoundCardResult";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";

export const CardSearchForm = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [foundCard, setFoundCard] = useState<any>(null);
  const [showNotFoundMessage, setShowNotFoundMessage] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: t("toast_field_required_title"),
        description: t("toast_field_required_desc"),
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
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setFoundCard(data);
        toast({
          title: t("toast_card_found_title"),
          description: t("toast_card_found_desc_platform"),
        });
      } else {
        setShowNotFoundMessage(true);
        toast({
          title: t("toast_card_not_found_title"),
          description: t("toast_card_not_found_desc"),
        });
      }
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      toast({
        title: t("toast_search_error_title"),
        description: t("toast_search_error_desc"),
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
            {t("card_search_form_title")}
          </CardTitle>
          <p className="text-center text-gray-600">
            {t("card_search_form_subtitle")}
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder={t("card_search_form_placeholder")}
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
                  {t("searching")}
                </>
              ) : (
                <>
                  <Search className="mr-2 h-5 w-5" />
                  {t("search")}
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
                <CardTitle className="text-xl text-orange-800">{t("toast_card_not_found_title")}</CardTitle>
                <p className="text-orange-700">{t("card_search_not_found_subtitle")}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-orange-200">
              <h4 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
                <Bell className="h-5 w-5" />
                {t("card_search_notification_system_title")}
              </h4>
              <div className="space-y-3 text-sm text-orange-700">
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300">1</Badge>
                  <p>{t("card_search_notification_step1")}</p>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300">2</Badge>
                  <p>{t("card_search_notification_step2")}</p>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300">3</Badge>
                  <p>{t("card_search_notification_step3")}</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                {t("card_search_what_to_do_title")}
              </h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>{t("card_search_what_to_do_item1")}</li>
                <li>{t("card_search_what_to_do_item2")}</li>
                <li>{t("card_search_what_to_do_item3")}</li>
                <li>{t("card_search_what_to_do_item4")}</li>
              </ul>
            </div>

            {/* Ajout d'un appel à l'action pour sauvegarder la carte sur "Mes cartes" */}
            <div className="bg-violet-50 p-4 rounded-lg border border-violet-200 flex flex-col items-center gap-2 mt-4">
              <div className="text-violet-700 font-medium flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                {t("search_not_found_notification_prompt")}
              </div>
              <p className="text-violet-600 text-sm mb-2 text-center">
                {t("search_not_found_add_to_my_cards_prompt")}
              </p>
              <Button
                variant="default"
                className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6"
                onClick={() => navigate(`/mes-cartes?ajouter=${encodeURIComponent(searchQuery.trim())}`)}
              >
                {t("search_not_found_add_to_my_cards_button")}
              </Button>
              <p className="text-xs text-violet-500 mt-1">{t("search_not_found_my_cards_info")}</p>
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
                    title: t("card_search_download_started_title"),
                    description: t("card_search_download_started_desc"),
                  });
                }}
              >
                {t("card_search_download_app_button")}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
