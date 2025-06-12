
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const RecoveryInstructions = () => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Prochaines étapes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-[#9b87f5] text-white rounded-full flex items-center justify-center text-sm font-semibold">1</div>
            <p className="text-gray-700">Confirmez votre identité en cliquant sur "Récupérer ma carte"</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-[#9b87f5] text-white rounded-full flex items-center justify-center text-sm font-semibold">2</div>
            <p className="text-gray-700">Utilisez un code promo si vous en avez un pour bénéficier d'une réduction</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-[#9b87f5] text-white rounded-full flex items-center justify-center text-sm font-semibold">3</div>
            <p className="text-gray-700">Nous organiserons la récupération de votre document</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
