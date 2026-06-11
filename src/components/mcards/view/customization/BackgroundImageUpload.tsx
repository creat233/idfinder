import { useState } from 'react';
import { ImageIcon, Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BackgroundImageUploadProps {
  mcardId: string;
  currentUrl?: string | null;
  onChange: (url: string | null) => void;
}

const PRESET_BACKGROUNDS = [
  'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1200&q=80',
  'https://images.unsplash.com/photo-1620207418302-439b387441b0?w=1200&q=80',
  'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&q=80',
  'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&q=80',
  'https://images.unsplash.com/photo-1604079628040-94301bb21b91?w=1200&q=80',
  'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=1200&q=80',
];

export const BackgroundImageUpload = ({ mcardId, currentUrl, onChange }: BackgroundImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const updateCoverOnCard = async (url: string | null) => {
    const { error } = await supabase
      .from('mcards')
      .update({ cover_image_url: url })
      .eq('id', mcardId);
    if (error) throw error;
  };

  const applyUrl = async (url: string | null) => {
    try {
      await updateCoverOnCard(url);
      onChange(url);
      toast({
        title: url ? 'Photo de couverture appliquée' : 'Photo de couverture retirée',
        description: url ? 'Votre couverture est visible sur la carte.' : '',
      });
    } catch (err: any) {
      toast({ title: 'Erreur', description: err.message, variant: 'destructive' });
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'Image trop lourde', description: 'Max 5 MB.', variant: 'destructive' });
      return;
    }

    try {
      setUploading(true);
      const ext = file.name.split('.').pop();
      const path = `${mcardId}/cover-${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from('mcard-assets').upload(path, file, {
        cacheControl: '3600',
        upsert: true,
      });
      if (error) throw error;
      const { data } = supabase.storage.from('mcard-assets').getPublicUrl(path);
      await applyUrl(data.publicUrl);
    } catch (err: any) {
      toast({ title: 'Erreur upload', description: err.message, variant: 'destructive' });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
        <ImageIcon className="h-5 w-5 text-purple-600" />
        Photo de couverture
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        Cette image s'affiche en haut de votre carte publique.
      </p>

      {currentUrl && (
        <div className="relative mb-4 rounded-lg overflow-hidden border">
          <img src={currentUrl} alt="Couverture actuelle" className="w-full h-32 object-cover" />
          <Button
            size="sm"
            variant="destructive"
            className="absolute top-2 right-2"
            onClick={() => applyUrl(null)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <label className="block">
        <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
        <div className="border-2 border-dashed border-purple-300 rounded-lg p-6 text-center cursor-pointer hover:bg-purple-50 transition">
          {uploading ? (
            <Loader2 className="h-6 w-6 mx-auto animate-spin text-purple-600" />
          ) : (
            <>
              <Upload className="h-6 w-6 mx-auto text-purple-600 mb-2" />
              <p className="text-sm font-medium">Télécharger une image</p>
              <p className="text-xs text-gray-500 mt-1">JPG, PNG · Max 5 MB</p>
            </>
          )}
        </div>
      </label>

      <p className="text-xs text-gray-500 mt-4 mb-2">Ou choisissez une couverture prédéfinie :</p>
      <div className="grid grid-cols-3 gap-2">
        {PRESET_BACKGROUNDS.map((url) => (
          <button
            key={url}
            type="button"
            onClick={() => applyUrl(url)}
            className={`relative rounded-lg overflow-hidden border-2 transition ${
              currentUrl === url ? 'border-purple-500 ring-2 ring-purple-300' : 'border-transparent hover:border-purple-300'
            }`}
          >
            <img src={url} alt="" className="w-full h-16 object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};
