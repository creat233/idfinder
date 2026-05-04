import { Header } from '@/components/Header';
import { FoundDocumentsMap } from '@/components/geolocation/FoundDocumentsMap';

const DocumentsMap = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-0">
      <Header />
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">📍 Documents trouvés</h1>
        <FoundDocumentsMap />
      </div>
    </div>
  );
};

export default DocumentsMap;
