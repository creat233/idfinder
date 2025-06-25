
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Plus, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AdminAd {
  id: string;
  title: string;
  message: string;
  image_url?: string;
  target_url?: string;
  is_active: boolean;
  start_date?: string;
  end_date?: string;
  created_at: string;
}

export const AdminAdsSettings = () => {
  const [ads, setAds] = useState<AdminAd[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAds = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_ads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAds(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleAdStatus = async (adId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('admin_ads')
        .update({ is_active: !currentStatus })
        .eq('id', adId);

      if (error) throw error;

      setAds(prev => prev.map(ad => 
        ad.id === adId ? { ...ad, is_active: !currentStatus } : ad
      ));

      toast({
        title: "Succès",
        description: `Publicité ${!currentStatus ? 'activée' : 'désactivée'}`
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message
      });
    }
  };

  const deleteAd = async (adId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette publicité ?")) return;

    try {
      const { error } = await supabase
        .from('admin_ads')
        .delete()
        .eq('id', adId);

      if (error) throw error;

      setAds(prev => prev.filter(ad => ad.id !== adId));
      toast({
        title: "Succès",
        description: "Publicité supprimée"
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message
      });
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  if (loading) {
    return <div className="p-4">Chargement des publicités...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des Publicités</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Publicité
        </Button>
      </div>

      {ads.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">Aucune publicité créée pour le moment</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {ads.map((ad) => (
            <Card key={ad.id} className={`${!ad.is_active ? 'opacity-60' : ''}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{ad.title}</CardTitle>
                    <div className="flex gap-2 mt-2">
                      <Badge variant={ad.is_active ? "default" : "secondary"}>
                        {ad.is_active ? "Active" : "Inactive"}
                      </Badge>
                      {ad.start_date && (
                        <Badge variant="outline">
                          Du {new Date(ad.start_date).toLocaleDateString()}
                        </Badge>
                      )}
                      {ad.end_date && (
                        <Badge variant="outline">
                          Au {new Date(ad.end_date).toLocaleDateString()}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleAdStatus(ad.id, ad.is_active)}
                    >
                      {ad.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => deleteAd(ad.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{ad.message}</p>
                {ad.image_url && (
                  <div className="mb-4">
                    <img 
                      src={ad.image_url} 
                      alt={ad.title}
                      className="max-w-xs rounded-lg border"
                    />
                  </div>
                )}
                {ad.target_url && (
                  <p className="text-sm text-blue-600">
                    Lien: <a href={ad.target_url} target="_blank" rel="noopener noreferrer" className="underline">
                      {ad.target_url}
                    </a>
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Créée le {new Date(ad.created_at).toLocaleDateString()} à {new Date(ad.created_at).toLocaleTimeString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
