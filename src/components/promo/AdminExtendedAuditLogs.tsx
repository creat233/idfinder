import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldCheck, Search, FileText, Users, CreditCard, Package } from "lucide-react";
import { useAuditLogs } from "@/hooks/useAuditLogs";

export const AdminExtendedAuditLogs = () => {
  const { logs, loading } = useAuditLogs();
  const [searchQuery, setSearchQuery] = useState("");

  // Filtrer les logs selon la recherche
  const filteredLogs = logs.filter(log => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      log.action?.toLowerCase().includes(query) ||
      log.user_email?.toLowerCase().includes(query) ||
      JSON.stringify(log.details)?.toLowerCase().includes(query)
    );
  });

  // Catégoriser les logs
  const categorizedLogs = {
    mcard: filteredLogs.filter(log => 
      log.action?.includes('mcard') || 
      log.action?.includes('card')
    ),
    verification: filteredLogs.filter(log => 
      log.action?.includes('verification') || 
      log.action?.includes('verify')
    ),
    promo: filteredLogs.filter(log => 
      log.action?.includes('promo') || 
      log.action?.includes('code')
    ),
    recovery: filteredLogs.filter(log => 
      log.action?.includes('recovery') || 
      log.action?.includes('récupération')
    ),
    all: filteredLogs
  };

  const getActionBadgeColor = (action: string) => {
    if (action?.includes('activation') || action?.includes('approved')) return 'bg-green-100 text-green-800';
    if (action?.includes('deactivation') || action?.includes('rejected')) return 'bg-red-100 text-red-800';
    if (action?.includes('verification')) return 'bg-blue-100 text-blue-800';
    if (action?.includes('promo')) return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
  };

  const LogTable = ({ logs: logData }: { logs: any[] }) => (
    <div className="space-y-4">
      {logData.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Aucun journal d'audit trouvé
        </div>
      ) : (
        logData.map((log) => (
          <Card key={log.id} className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Badge className={getActionBadgeColor(log.action)}>
                    {log.action}
                  </Badge>
                  <span className="text-sm text-gray-600">
                    {new Date(log.created_at).toLocaleString('fr-FR')}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {log.user_email || 'Système'}
                </span>
              </div>
              
              {log.details && (
                <div className="bg-gray-50 rounded-lg p-3 mt-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Détails :</h4>
                  <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                    {JSON.stringify(log.details, null, 2)}
                  </pre>
                </div>
              )}
              
              {log.ip_address && (
                <div className="mt-2 text-xs text-gray-500">
                  IP: {log.ip_address}
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <ShieldCheck className="h-5 w-5" />
            Journal d'Audit Étendu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <ShieldCheck className="h-5 w-5" />
          Journal d'Audit Étendu
        </CardTitle>
        <p className="text-sm text-gray-600">
          Suivi détaillé de toutes les activités administratives
        </p>
      </CardHeader>
      <CardContent>
        {/* Barre de recherche */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="🔍 Rechercher dans les logs (action, email, détails...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          {searchQuery && (
            <div className="mt-2 text-sm text-gray-600">
              {filteredLogs.length} résultat{filteredLogs.length > 1 ? 's' : ''} trouvé{filteredLogs.length > 1 ? 's' : ''}
            </div>
          )}
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{categorizedLogs.mcard.length}</div>
            <div className="text-sm text-blue-600">MCard</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <ShieldCheck className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{categorizedLogs.verification.length}</div>
            <div className="text-sm text-green-600">Vérifications</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <CreditCard className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">{categorizedLogs.promo.length}</div>
            <div className="text-sm text-purple-600">Codes Promo</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg text-center">
            <Package className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-600">{categorizedLogs.recovery.length}</div>
            <div className="text-sm text-orange-600">Récupérations</div>
          </div>
        </div>

        {/* Onglets par catégorie */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">Tous ({categorizedLogs.all.length})</TabsTrigger>
            <TabsTrigger value="mcard">MCard ({categorizedLogs.mcard.length})</TabsTrigger>
            <TabsTrigger value="verification">Vérifier ({categorizedLogs.verification.length})</TabsTrigger>
            <TabsTrigger value="promo">Codes ({categorizedLogs.promo.length})</TabsTrigger>
            <TabsTrigger value="recovery">Récupération ({categorizedLogs.recovery.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            <LogTable logs={categorizedLogs.all} />
          </TabsContent>
          
          <TabsContent value="mcard" className="mt-6">
            <LogTable logs={categorizedLogs.mcard} />
          </TabsContent>
          
          <TabsContent value="verification" className="mt-6">
            <LogTable logs={categorizedLogs.verification} />
          </TabsContent>
          
          <TabsContent value="promo" className="mt-6">
            <LogTable logs={categorizedLogs.promo} />
          </TabsContent>
          
          <TabsContent value="recovery" className="mt-6">
            <LogTable logs={categorizedLogs.recovery} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};