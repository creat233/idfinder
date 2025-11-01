import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Search, Clock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MCardStatus } from '@/types/mcard';
import { StatusImageModal } from '@/components/mcards/view/StatusImageModal';

const AllMCardStatuses = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { statuses = [], mcardId = '', ownerName = '', isOwner = false } = location.state || {};
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStatuses, setFilteredStatuses] = useState<MCardStatus[]>(statuses);

  // Filtrer les statuts
  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const filtered = statuses.filter((s: MCardStatus) =>
        s.status_text.toLowerCase().includes(query)
      );
      setFilteredStatuses(filtered);
    } else {
      setFilteredStatuses(statuses);
    }
  }, [searchQuery, statuses]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-500/5 to-background pb-24 md:pb-8">
      {/* Header avec gradient */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-primary via-purple-600 to-pink-600 shadow-xl">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Tous les Statuts
              </h1>
              {ownerName && (
                <p className="text-white/90 text-sm sm:text-base mt-1">
                  De {ownerName}
                </p>
              )}
            </div>
          </div>

          {/* Barre de recherche */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 h-5 w-5" />
            <Input
              placeholder="Rechercher un statut..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 h-12 bg-white/20 border-white/30 text-white placeholder:text-white/70 focus-visible:ring-white/50 backdrop-blur-sm"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 gap-4 max-w-md">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="p-4 text-center">
              <Sparkles className="h-5 w-5 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{statuses.length}</p>
              <p className="text-xs text-muted-foreground">Total statuts</p>
            </CardContent>
          </Card>
          <Card className="border-primary/20 bg-gradient-to-br from-purple-500/5 to-transparent">
            <CardContent className="p-4 text-center">
              <Search className="h-5 w-5 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{filteredStatuses.length}</p>
              <p className="text-xs text-muted-foreground">Affichés</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Grille de statuts */}
      <div className="container mx-auto px-4">
        {filteredStatuses.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-muted rounded-full mb-4">
              <Sparkles className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">
              Aucun statut trouvé
            </h3>
            <p className="text-muted-foreground">
              {searchQuery
                ? "Essayez avec d'autres mots-clés"
                : 'Aucun statut disponible'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredStatuses.map((status) => {
              const timeRemaining = status.expires_at
                ? Math.max(0, Math.floor((new Date(status.expires_at).getTime() - new Date().getTime()) / (1000 * 60 * 60)))
                : null;

              return (
                <Card
                  key={status.id}
                  className="group hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 overflow-hidden border-border bg-card"
                >
                  <CardContent className="p-0">
                    {/* Image ou couleur de fond */}
                    <div className="relative h-64 overflow-hidden">
                      {status.status_image ? (
                        <StatusImageModal
                          imageUrl={status.status_image}
                          statusText={status.status_text}
                          allStatuses={filteredStatuses}
                          currentStatusId={status.id}
                        >
                          <div className="relative h-full cursor-pointer">
                            <img
                              src={status.status_image}
                              alt={status.status_text}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                          </div>
                        </StatusImageModal>
                      ) : (
                        <div
                          className="relative h-full flex items-center justify-center"
                          style={{
                            background: `linear-gradient(135deg, ${status.status_color}ee, ${status.status_color}cc, ${status.status_color}aa)`,
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10" />
                          <Sparkles className="w-16 h-16 text-white/90 animate-pulse drop-shadow-2xl" />
                        </div>
                      )}

                      {/* Badge de temps restant */}
                      {timeRemaining !== null && (
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-black/60 backdrop-blur-md text-white border-0 px-3 py-1.5 rounded-full shadow-xl font-medium">
                            <Clock className="h-3.5 w-3.5 mr-1.5" />
                            {timeRemaining > 0 ? `${timeRemaining}h` : 'Expiré'}
                          </Badge>
                        </div>
                      )}

                      {/* Texte du statut */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <Badge
                          className="text-white font-bold text-base px-5 py-2.5 rounded-2xl shadow-2xl border-2 border-white/20 backdrop-blur-sm w-full justify-center"
                          style={{
                            backgroundColor: `${status.status_color}ee`,
                            background: `linear-gradient(135deg, ${status.status_color}ee, ${status.status_color}cc)`,
                          }}
                        >
                          <Sparkles className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="truncate">{status.status_text}</span>
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllMCardStatuses;
