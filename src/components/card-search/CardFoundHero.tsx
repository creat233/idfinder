
import { CheckCircle } from "lucide-react";

export const CardFoundHero = () => {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Carte trouvée !
      </h1>
      <p className="text-lg text-gray-600">
        Votre document a été signalé sur FinderID
      </p>
    </div>
  );
};
