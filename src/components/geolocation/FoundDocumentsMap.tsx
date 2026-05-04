import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, FileText, Calendar, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';

interface FoundDocument {
  id: string;
  card_number: string;
  location: string;
  document_type: string;
  found_date: string;
  latitude: number | null;
  longitude: number | null;
  status: string | null;
  created_at: string;
}

const docTypeLabels: Record<string, string> = {
  id: 'Carte d\'identité',
  passport: 'Passeport',
  driver_license: 'Permis de conduire',
  other: 'Autre document',
};

const docTypeColors: Record<string, string> = {
  id: 'bg-blue-100 text-blue-800',
  passport: 'bg-green-100 text-green-800',
  driver_license: 'bg-orange-100 text-orange-800',
  other: 'bg-gray-100 text-gray-800',
};

export const FoundDocumentsMap = () => {
  const [documents, setDocuments] = useState<FoundDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState<FoundDocument | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('reported_cards')
        .select('id, card_number, location, document_type, found_date, latitude, longitude, status, created_at')
        .order('created_at', { ascending: false })
        .limit(50);

      if (!error && data) {
        setDocuments(data as FoundDocument[]);
      }
    } catch (e) {
      console.error('Error fetching documents:', e);
    } finally {
      setLoading(false);
    }
  };

  const geoDocuments = documents.filter(d => d.latitude && d.longitude);
  const defaultCenter = geoDocuments.length > 0 
    ? { lat: geoDocuments[0].latitude!, lng: geoDocuments[0].longitude! }
    : { lat: 14.6928, lng: -17.4467 }; // Dakar

  const googleMapsUrl = `https://www.google.com/maps/@${defaultCenter.lat},${defaultCenter.lng},12z`;

  return (
    <div className="space-y-6">
      {/* Map */}
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5 text-red-500" />
            Carte des documents trouvés
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative h-80 bg-gradient-to-br from-blue-50 to-green-50">
            <iframe
              src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d200000!2d${defaultCenter.lng}!3d${defaultCenter.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sfr!2ssn`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Carte des documents trouvés"
            />
            {/* Overlay with stats */}
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-md">
              <p className="text-sm font-semibold text-gray-800">
                📍 {documents.length} document{documents.length > 1 ? 's' : ''} signalé{documents.length > 1 ? 's' : ''}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {geoDocuments.length} avec géolocalisation
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document list */}
      <div className="grid gap-3">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Documents récemment trouvés
        </h3>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Chargement...</div>
        ) : documents.length === 0 ? (
          <Card className="p-6 text-center text-muted-foreground">
            Aucun document signalé pour le moment
          </Card>
        ) : (
          documents.slice(0, 10).map((doc, i) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedDoc(selectedDoc?.id === doc.id ? null : doc)}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge className={docTypeColors[doc.document_type] || docTypeColors.other}>
                          {docTypeLabels[doc.document_type] || doc.document_type}
                        </Badge>
                        {doc.status === 'recovered' && (
                          <Badge className="bg-green-100 text-green-800">✅ Restitué</Badge>
                        )}
                      </div>
                      <p className="text-sm font-medium">N° {doc.card_number.slice(0, 4)}****</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {doc.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {new Date(doc.found_date).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                    {doc.latitude && doc.longitude && (
                      <a
                        href={`https://www.google.com/maps?q=${doc.latitude},${doc.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1"
                        onClick={e => e.stopPropagation()}
                      >
                        <Eye className="h-3 w-3" /> Voir
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
