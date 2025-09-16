import { Eye, Save, Receipt, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface CustomizationActionsProps {
  isOwner: boolean;
  loading: boolean;
  onPreview: () => void;
  onSave: () => void;
  mcardSlug?: string;
  mcardPlan?: string;
}

export const CustomizationActions = ({ 
  isOwner, 
  loading, 
  onPreview, 
  onSave,
  mcardSlug,
  mcardPlan
}: CustomizationActionsProps) => {
  if (!isOwner) return null;

  return (
    <div className="space-y-4">
      {/* Liens d'actions rapides */}
      {isOwner && mcardSlug && (
        <div className="flex gap-2 pt-4 border-t">
          <Button asChild variant="outline" size="sm">
            <Link to={`/mcard/${mcardSlug}/customize`}>
              <Settings className="h-4 w-4 mr-2" />
              Personnaliser
            </Link>
          </Button>
          
          {(mcardPlan === 'essential' || mcardPlan === 'premium') && (
            <Button asChild variant="outline" size="sm">
              <Link to={`/mcard/${mcardSlug}/invoices`}>
                <Receipt className="h-4 w-4 mr-2" />
                Factures
              </Link>
            </Button>
          )}
        </div>
      )}

      {/* Actions de personnalisation */}
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
    </div>
  );
};