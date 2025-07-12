import { Eye, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CustomizationActionsProps {
  isOwner: boolean;
  loading: boolean;
  onPreview: () => void;
  onSave: () => void;
}

export const CustomizationActions = ({ 
  isOwner, 
  loading, 
  onPreview, 
  onSave 
}: CustomizationActionsProps) => {
  if (!isOwner) return null;

  return (
    <div className="flex justify-end gap-2 pt-4 border-t">
      <Button variant="outline" onClick={onPreview}>
        <Eye className="h-4 w-4 mr-2" />
        Aperçu
      </Button>
      <Button 
        className="bg-gradient-to-r from-purple-500 to-blue-500 text-white"
        onClick={onSave}
        disabled={loading}
      >
        <Save className="h-4 w-4 mr-2" />
        Sauvegarder
      </Button>
    </div>
  );
};