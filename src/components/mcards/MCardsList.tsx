import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { MCard } from "@/types/mcard";
import { MCardItem } from "./MCardItem";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface MCardsListProps {
  mcards: MCard[];
  loading: boolean;
  deleteMCard: (id: string) => Promise<void>;
  onStartUpgradeFlow: (cardId: string) => void;
  onEdit: (mcard: MCard) => void;
}

export const MCardsList = ({ mcards, loading, deleteMCard, onStartUpgradeFlow, onEdit }: MCardsListProps) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  // Filtrer les cartes selon la recherche
  const filteredMCards = mcards.filter(mcard => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      mcard.full_name?.toLowerCase().includes(query) ||
      mcard.company?.toLowerCase().includes(query) ||
      mcard.job_title?.toLowerCase().includes(query) ||
      mcard.plan?.toLowerCase().includes(query) ||
      mcard.subscription_status?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">
          {t('myMCards')} ({mcards.length}/3)
        </h2>
      </div>

      {/* Barre de recherche */}
      {mcards.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="🔍 Rechercher parmi vos cartes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          {searchQuery && (
            <div className="mt-2 text-sm text-gray-600">
              {filteredMCards.length} carte{filteredMCards.length > 1 ? 's' : ''} trouvée{filteredMCards.length > 1 ? 's' : ''}
            </div>
          )}
        </div>
      )}

      {mcards.length === 0 && !loading ? (
        <div className="text-center py-8 border-2 border-dashed rounded-lg">
          <p>{t('noMCards')}</p>
          <p className="text-sm text-gray-500 mt-2">
            Vous pouvez créer jusqu'à 3 cartes de visite
          </p>
        </div>
      ) : filteredMCards.length === 0 && searchQuery ? (
        <div className="text-center py-8 border-2 border-dashed rounded-lg">
          <p className="text-gray-500">Aucune carte ne correspond à votre recherche.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMCards.map(mcard => (
            <MCardItem 
              key={mcard.id} 
              mcard={mcard} 
              onEdit={() => onEdit(mcard)}
              onDelete={deleteMCard}
              onStartUpgradeFlow={onStartUpgradeFlow}
            />
          ))}
        </div>
      )}
    </div>
  );
};
