
import { AlertTriangle } from "lucide-react";

interface MapTokenInputProps {
  setMapboxToken: (token: string) => void;
  height: string;
}

export const MapTokenInput = ({ setMapboxToken, height }: MapTokenInputProps) => {
  return (
    <div className={`${height} bg-gray-100 rounded-lg border border-gray-200 flex flex-col items-center justify-center p-4`}>
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex items-center mb-4 text-amber-500">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <h3 className="font-bold">Configuration requise</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Pour afficher la carte des services d'urgence au Sénégal, veuillez entrer votre clé d'API Mapbox.
          Vous pouvez en obtenir une gratuitement sur <a href="https://www.mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">mapbox.com</a>
        </p>
        <input
          type="text"
          placeholder="Entrez votre clé d'API Mapbox"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          onChange={(e) => setMapboxToken(e.target.value)}
        />
        <button
          className="w-full bg-primary text-white p-2 rounded hover:bg-primary/90"
          onClick={() => {
            if (document.querySelector('input')?.value) {
              setMapboxToken(document.querySelector('input')?.value || '');
            }
          }}
        >
          Afficher la carte
        </button>
      </div>
    </div>
  );
};
