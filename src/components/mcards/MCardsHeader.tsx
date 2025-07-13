
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { Link } from "react-router-dom";

export const MCardsHeader = () => {
  const { t } = useTranslation();

  return (
    <div className="text-center mb-8 sm:mb-10 lg:mb-12 px-4">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 leading-tight">
        {t('digitalBusinessCards')}
      </h1>
      <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
        {t('createShareConnect')}
      </p>
      
      {/* Carte de démonstration - Responsive */}
      <Card className="max-w-xs sm:max-w-md mx-auto mb-6 sm:mb-8 border-2 border-blue-200 bg-blue-50">
        <CardContent className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold mb-2 text-blue-800">
            Exemple de mCard
          </h3>
          <p className="text-sm sm:text-base text-blue-700 mb-3 sm:mb-4 leading-relaxed">
            Découvrez à quoi ressemble une mCard professionnelle
          </p>
          <Link to="/mcard/demo">
            <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100 w-full sm:w-auto text-sm sm:text-base">
              <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              Voir la carte démo
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};
