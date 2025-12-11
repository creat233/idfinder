import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MCard } from '@/types/mcard';
import { PaidMCardWithProducts } from './PaidMCardWithProducts';

interface VerifiedMCardsGridProps {
  searchQuery: string;
  selectedCategory: string;
}

export const VerifiedMCardsGrid = ({ searchQuery, selectedCategory }: VerifiedMCardsGridProps) => {
  const [mcards, setMcards] = useState<MCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVerifiedMCards();
  }, []);

  const loadVerifiedMCards = async () => {
    try {
      setLoading(true);
      
      // Charger toutes les cartes actives (avec subscription_status = 'active')
      const { data, error } = await supabase
        .from('mcards')
        .select('*')
        .eq('is_published', true)
        .eq('subscription_status', 'active')
        .order('is_verified', { ascending: false })
        .order('view_count', { ascending: false });

      if (error) throw error;

      setMcards(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des MCards vérifiées:', error);
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
      mcard.description?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="px-4 py-8">
        <div className="text-center text-white/70">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-4"></div>
          Chargement des cartes vérifiées...
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-12 mt-16 mb-16 bg-slate-900/50 backdrop-blur-sm rounded-t-3xl">
      <div className="max-w-7xl mx-auto">

        {filteredMCards.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-white/60 mb-4">
              {searchQuery || selectedCategory !== 'all' 
                ? "Aucune carte vérifiée trouvée pour votre recherche"
                : "Aucune carte vérifiée disponible pour le moment"
              }
            </div>
          </div>
        ) : (
          <div className="max-w-lg mx-auto space-y-6">
            {filteredMCards.map((mcard) => (
              <PaidMCardWithProducts key={mcard.id} mcard={mcard} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};