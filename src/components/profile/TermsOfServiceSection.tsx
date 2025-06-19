
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "@/components/ui/external-link";
import { FileText, Shield, AlertCircle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export const TermsOfServiceSection = () => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Conditions d'utilisation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
            <Shield className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Politique de confidentialité</h3>
              <p className="text-sm text-blue-700 mb-2">
                Découvrez comment nous protégeons et utilisons vos données personnelles.
              </p>
              <ExternalLink 
                href="https://finderid.info/privacy" 
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                showIcon={true}
              >
                Lire la politique de confidentialité
              </ExternalLink>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-amber-900 mb-1">Conditions générales</h3>
              <p className="text-sm text-amber-700 mb-2">
                Consultez les règles d'utilisation de la plateforme FinderID.
              </p>
              <ExternalLink 
                href="https://finderid.info/terms" 
                className="text-amber-600 hover:text-amber-800 text-sm font-medium"
                showIcon={true}
              >
                Consulter les conditions générales
              </ExternalLink>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
            <FileText className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-green-900 mb-1">Code de conduite</h3>
              <p className="text-sm text-green-700 mb-2">
                Les règles de bonne conduite pour une communauté respectueuse.
              </p>
              <ExternalLink 
                href="https://finderid.info/code-of-conduct" 
                className="text-green-600 hover:text-green-800 text-sm font-medium"
                showIcon={true}
              >
                Voir le code de conduite
              </ExternalLink>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 leading-relaxed">
            <strong>Note importante :</strong> En utilisant FinderID, vous acceptez nos conditions d'utilisation 
            et notre politique de confidentialité. Ces documents sont régulièrement mis à jour pour 
            refléter les évolutions de notre service.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
