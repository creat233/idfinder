
import { CheckCircle } from "lucide-react";

export const CardFoundHero = () => {
  return (
    <div className="text-center space-y-4 sm:space-y-6">
      {/* Logo - responsive sizing */}
      <div className="flex justify-center">
        <img 
          src="/lovable-uploads/bc867b36-0b80-4eaf-b5de-c4299829a42e.png" 
          alt="FinderID Logo" 
          className="w-12 h-12 sm:w-16 sm:h-16"
        />
      </div>
      
      {/* Success icon - responsive sizing */}
      <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full">
        <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
      </div>
      
      {/* Title - responsive typography */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
          Carte trouvée !
        </h1>
        <p className="text-base sm:text-lg text-gray-600 px-4">
          Votre document a été signalé sur FinderID
        </p>
      </div>

      {/* Progress indicator for mobile */}
      <div className="sm:hidden flex justify-center space-x-2 mt-4">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
      </div>
    </div>
  );
};
