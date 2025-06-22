
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { Link } from "react-router-dom";

export const MCardsHeader = () => {
  const { t } = useTranslation();

  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold mb-4">
        {t('digitalBusinessCards')}
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        {t('createShareConnect')}
      </p>
      
      {/* Carte de démonstration */}
      <Card className="max-w-md mx-auto mb-8 border-2 border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-2 text-blue-800">
            Exemple de mCard
          </h3>
          <p className="text-blue-700 mb-4">
            Découvrez à quoi ressemble une mCard professionnelle
          </p>
          <Link to="/mcard/demo">
            <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
              <ExternalLink className="h-4 w-4 mr-2" />
              Voir la carte démo
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};
