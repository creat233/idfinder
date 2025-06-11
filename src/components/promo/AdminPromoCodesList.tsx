
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Users, Gift, TrendingUp, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/useToast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface PromoCodeData {
  id: string;
  code: string;
  is_active: boolean;
  is_paid: boolean;
  created_at: string;
  expires_at: string;
  total_earnings: number;
  usage_count: number;
  user_email?: string;
  user_name?: string;
}

export const AdminPromoCodesList = () => {
  const [promoCodes, setPromoCodes] = useState<PromoCodeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    totalCodes: 0,
    activeCodes: 0,
    totalUsage: 0,
    totalEarnings: 0
  });
  const { showError } = useToast();

  const fetchPromoCodesData = async () => {
    try {
      // Récupérer tous les codes promo avec les informations utilisateur
      const { data: codesData, error: codesError } = await supabase
        .from("promo_codes")
        .select(`
          *,
          profiles!promo_codes_user_id_fkey (
            first_name,
            last_name
          )
        `)
        .order("created_at", { ascending: false });

      if (codesError) throw codesError;

      // Récupérer les emails des utilisateurs
      const userIds = codesData?.map(code => code.user_id) || [];
      const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();

      if (usersError) throw usersError;

      // Combiner les données
      const enrichedCodes = codesData?.map(code => {
        const user = usersData.users.find(u => u.id === code.user_id);
        const profile = code.profiles;
        
        return {
          ...code,
          user_email: user?.email || 'Email non trouvé',
          user_name: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : 'Nom non renseigné'
        };
      }) || [];

      setPromoCodes(enrichedCodes);

      // Calculer les statistiques
      const totalCodes = enrichedCodes.length;
      const activeCodes = enrichedCodes.filter(code => code.is_active).length;
      const totalUsage = enrichedCodes.reduce((sum, code) => sum + code.usage_count, 0);
      const totalEarnings = enrichedCodes.reduce((sum, code) => sum + code.total_earnings, 0);

      setStats({
        totalCodes,
        activeCodes,
        totalUsage,
        totalEarnings
      });

    } catch (error) {
      console.error("Error fetching promo codes data:", error);
      showError("Erreur", "Impossible de récupérer les données des codes promo");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromoCodesData();
  }, []);

  const filteredCodes = promoCodes.filter(code =>
    code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    code.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    code.user_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Codes</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCodes}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Codes Actifs</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeCodes}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisations</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsage}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gains Totaux</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEarnings} FCFA</div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des codes promo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Tous les codes promo
          </CardTitle>
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <Input
              placeholder="Rechercher par code, email ou nom..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Utilisations</TableHead>
                <TableHead>Gains</TableHead>
                <TableHead>Créé le</TableHead>
                <TableHead>Expire le</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCodes.map((code) => (
                <TableRow key={code.id}>
                  <TableCell className="font-mono font-semibold">{code.code}</TableCell>
                  <TableCell>{code.user_name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{code.user_email}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Badge variant={code.is_active ? "default" : "secondary"}>
                        {code.is_active ? "Actif" : "Inactif"}
                      </Badge>
                      {code.is_paid && (
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          Payé
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{code.usage_count}</TableCell>
                  <TableCell>{code.total_earnings} FCFA</TableCell>
                  <TableCell>
                    {format(new Date(code.created_at), "dd/MM/yyyy", { locale: fr })}
                  </TableCell>
                  <TableCell>
                    {format(new Date(code.expires_at), "dd/MM/yyyy", { locale: fr })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredCodes.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? "Aucun code ne correspond à votre recherche" : "Aucun code promo trouvé"}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
