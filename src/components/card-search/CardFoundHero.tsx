
import { CheckCircle } from "lucide-react";

export const CardFoundHero = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex justify-center mb-6">
        <img 
          src="/lovable-uploads/dd162e07-382f-4111-a227-a319a73cc433.png" 
          alt="FinderID Logo" 
          className="w-16 h-16"
        />
      </div>
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
