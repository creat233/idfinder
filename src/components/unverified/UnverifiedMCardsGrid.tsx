import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MCard } from '@/types/mcard';
import { UnverifiedMCardItem } from './UnverifiedMCardItem';

interface UnverifiedMCardsGridProps {
  searchQuery: string;
  selectedCategory: string;
}

export const UnverifiedMCardsGrid = ({ searchQuery, selectedCategory }: UnverifiedMCardsGridProps) => {
  const [mcards, setMcards] = useState<MCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUnverifiedMCards();
  }, []);

  const loadUnverifiedMCards = async () => {
    try {
      setLoading(true);
      
      // Charger toutes les cartes actives NON vérifiées
      const { data, error } = await supabase
        .from('mcards')
        .select('*')
        .eq('is_published', true)
        .eq('subscription_status', 'active')
        .eq('is_verified', false) // Uniquement les cartes NON vérifiées
        .order('created_at', { ascending: false })
        .order('view_count', { ascending: false });

      if (error) throw error;

      setMcards(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des MCards non vérifiées:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les cartes selon la recherche et la catégorie
  const filteredMCards = mcards.filter(mcard => {
    const matchesSearch = !searchQuery || 
      mcard.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mcard.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mcard.job_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mcard.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || 
      mcard.job_title?.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      mcard.company?.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      mcard.description?.toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="px-4 py-8">
        <div className="text-center text-white/70">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-400 mx-auto mb-4"></div>
          Chargement des professionnels...
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-12 mt-16 mb-16 bg-slate-900/50 backdrop-blur-sm rounded-t-3xl">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            Professionnels Actifs
          </h2>
          <p className="text-white/60">
            {filteredMCards.length} professionnel{filteredMCards.length > 1 ? 's' : ''} disponible{filteredMCards.length > 1 ? 's' : ''}
          </p>
        </div>

        {filteredMCards.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-white/60 mb-4">
              {searchQuery || selectedCategory !== 'all' 
                ? "Aucun professionnel trouvé pour votre recherche"
                : "Aucun professionnel disponible pour le moment"
              }
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMCards.map((mcard) => (
              <UnverifiedMCardItem key={mcard.id} mcard={mcard} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
