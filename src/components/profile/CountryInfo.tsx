
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/useTranslation";
import { getCountryInfo } from "@/utils/countryDetection";
import { Phone, Clock, CreditCard } from "lucide-react";

interface CountryInfoProps {
  countryCode: string;
}

export const CountryInfo = ({ countryCode }: CountryInfoProps) => {
  const { t, currentLanguage } = useTranslation();
  const countryData = getCountryInfo(countryCode, currentLanguage as 'fr' | 'en');

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">{countryData.flag}</span>
          {t("countryInfo")} - {countryData.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{t("currency")}:</span>
            <span className="text-sm">{countryData.currency}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{t("timezone")}:</span>
            <span className="text-sm">{countryData.timezone}</span>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <Phone className="h-4 w-4" />
            {t("emergencyNumbers")}
          </h4>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">
              {t("police")}: {countryData.emergencyNumbers.police}
            </Badge>
            <Badge variant="outline">
              {t("fire")}: {countryData.emergencyNumbers.fire}
            </Badge>
            <Badge variant="outline">
              {t("medical")}: {countryData.emergencyNumbers.medical}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
