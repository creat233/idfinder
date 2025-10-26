import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Shield, AlertCircle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { LegalDocumentDialog } from "@/components/legal/LegalDocumentDialog";

export const TermsOfServiceSection = () => {
  const { t } = useTranslation();
  const [openDocument, setOpenDocument] = useState<"privacy" | "terms" | "conduct" | null>(null);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Conditions d'utilisation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
              <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Politique de confidentialité</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                  Découvrez comment nous protégeons et utilisons vos données personnelles.
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setOpenDocument("privacy")}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 hover:bg-blue-100 dark:hover:bg-blue-900/40 font-medium px-0"
                >
                  Lire la politique de confidentialité →
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-900">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-1">Conditions générales</h3>
                <p className="text-sm text-amber-700 dark:text-amber-300 mb-2">
                  Consultez les règles d'utilisation de la plateforme FinderID.
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setOpenDocument("terms")}
                  className="text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/40 font-medium px-0"
                >
                  Consulter les conditions générales →
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900">
              <FileText className="h-5 w-5 text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-green-900 dark:text-green-100 mb-1">Code de conduite</h3>
                <p className="text-sm text-green-700 dark:text-green-300 mb-2">
                  Les règles de bonne conduite pour une communauté respectueuse.
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setOpenDocument("conduct")}
                  className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200 hover:bg-green-100 dark:hover:bg-green-900/40 font-medium px-0"
                >
                  Voir le code de conduite →
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted rounded-lg border">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong>Note importante :</strong> En utilisant FinderID, vous acceptez nos conditions d'utilisation 
              et notre politique de confidentialité. Ces documents sont régulièrement mis à jour pour 
              refléter les évolutions de notre service.
            </p>
          </div>
        </CardContent>
      </Card>

      <LegalDocumentDialog
        isOpen={openDocument !== null}
        onClose={() => setOpenDocument(null)}
        documentType={openDocument || "privacy"}
      />
    </>
  );
};
