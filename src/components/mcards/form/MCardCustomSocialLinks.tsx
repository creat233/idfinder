import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X, Link } from "lucide-react";

interface CustomSocialLink {
  name: string;
  url: string;
}

interface MCardCustomSocialLinksProps {
  value: CustomSocialLink[];
  onChange: (links: CustomSocialLink[]) => void;
}

export const MCardCustomSocialLinks = ({ value = [], onChange }: MCardCustomSocialLinksProps) => {
  const [newLinkName, setNewLinkName] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  const handleAddLink = () => {
    if (newLinkName.trim() && newLinkUrl.trim()) {
      onChange([...value, { name: newLinkName.trim(), url: newLinkUrl.trim() }]);
      setNewLinkName('');
      setNewLinkUrl('');
    }
  };

  const handleRemoveLink = (index: number) => {
    const updated = value.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-4 mt-4 pt-4 border-t border-gray-200">
      <div className="flex items-center gap-2">
        <Link className="h-4 w-4 text-purple-600" />
        <Label className="text-sm font-medium text-gray-700">
          Autres réseaux sociaux
        </Label>
      </div>

      {/* Liste des liens personnalisés existants */}
      {value.length > 0 && (
        <div className="space-y-2">
          {value.map((link, index) => (
            <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{link.name}</p>
                <p className="text-xs text-gray-500 truncate">{link.url}</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveLink(index)}
                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Formulaire pour ajouter un nouveau lien */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <Input
          placeholder="Nom du réseau (ex: WhatsApp)"
          value={newLinkName}
          onChange={(e) => setNewLinkName(e.target.value)}
          className="text-sm"
        />
        <Input
          placeholder="URL (ex: https://wa.me/...)"
          value={newLinkUrl}
          onChange={(e) => setNewLinkUrl(e.target.value)}
          className="text-sm"
        />
      </div>
      
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleAddLink}
        disabled={!newLinkName.trim() || !newLinkUrl.trim()}
        className="w-full text-purple-600 border-purple-200 hover:bg-purple-50"
      >
        <Plus className="h-4 w-4 mr-2" />
        Ajouter ce réseau
      </Button>
    </div>
  );
};
