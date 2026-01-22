import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminNavigation } from "./AdminNavigation";
import { useAdminUserSignups } from "@/hooks/useAdminUserSignups";
import { useAdminAppVisits } from "@/hooks/useAdminAppVisits";
import { useAuditLogs } from "@/hooks/useAuditLogs";
import { Loader2, BarChart3, Users, Activity, TrendingUp, Eye, Globe } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export const AdminAnalytics = () => {
  const { data: signupData, loading: signupLoading, refetch: refetchSignups } = useAdminUserSignups();
  const { 
    data: visitsData, 
    loading: visitsLoading, 
    refetch: refetchVisits,
    totalVisits,
    totalUniqueVisitors,
    recentVisits,
    recentUniqueVisitors
  } = useAdminAppVisits(30);
  const { logs, loading: logsLoading, refetch: refetchLogs } = useAuditLogs();

  if (signupLoading || logsLoading || visitsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const totalSignups = signupData?.reduce((sum, day) => sum + day.count, 0) || 0;
  const recentSignups = signupData?.slice(-7).reduce((sum, day) => sum + day.count, 0) || 0;

  return (
    <div className="space-y-6">
      <AdminNavigation />
      
      {/* Section Visiteurs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visiteurs Total</CardTitle>
            <Globe className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVisits}</div>
            <p className="text-xs text-muted-foreground">
              {totalUniqueVisitors} visiteurs uniques
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visites cette semaine</CardTitle>
            <Eye className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentVisits}</div>
            <p className="text-xs text-muted-foreground">
              {recentUniqueVisitors} uniques (7 jours)
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSignups}</div>
            <p className="text-xs text-muted-foreground">
              Comptes créés
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nouveaux inscrits</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentSignups}</div>
            <p className="text-xs text-muted-foreground">
              7 derniers jours
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Graphique des visites */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-500" />
            Évolution des Visites (30 jours)
            <Badge variant="secondary">Visiteurs non-inscrits inclus</Badge>
          </CardTitle>
          <Button onClick={refetchVisits} variant="outline" size="sm">
            Actualiser
          </Button>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[...visitsData].reverse()}>
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorUnique" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="visit_date" 
                  tickFormatter={(value) => format(new Date(value), 'dd MMM', { locale: fr })}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => format(new Date(value), 'dd MMMM yyyy', { locale: fr })}
                  formatter={(value: number, name: string) => [
                    value, 
                    name === 'total_visits' ? 'Visites totales' : 'Visiteurs uniques'
                  ]}
                />
                <Area 
                  type="monotone" 
                  dataKey="total_visits" 
                  stroke="hsl(var(--primary))" 
                  fillOpacity={1}
                  fill="url(#colorVisits)"
                  strokeWidth={2}
                  name="total_visits"
                />
                <Area 
                  type="monotone" 
                  dataKey="unique_visitors" 
                  stroke="#10b981" 
                  fillOpacity={1}
                  fill="url(#colorUnique)"
                  strokeWidth={2}
                  name="unique_visitors"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Section Utilisateurs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actions Admin</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{logs.length}</div>
            <p className="text-xs text-muted-foreground">
              Actions récentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Moyenne Quotidienne</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {signupData && signupData.length > 0 
                ? Math.round(totalSignups / signupData.length)
                : 0
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Inscriptions par jour
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Évolution des Inscriptions
          </CardTitle>
          <Button onClick={refetchSignups} variant="outline">
            Actualiser
          </Button>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={signupData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="signup_date" 
                  tickFormatter={(value) => format(new Date(value), 'dd MMM', { locale: fr })}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => format(new Date(value), 'dd MMMM yyyy', { locale: fr })}
                  formatter={(value) => [value, 'Inscriptions']}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Journal d'Audit Récent
            <Badge variant="secondary">{logs.length} entrées</Badge>
          </CardTitle>
          <Button onClick={refetchLogs} variant="outline">
            Actualiser
          </Button>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucune activité récente
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {logs.slice(0, 10).map((log) => (
                <div key={log.id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{log.action}</Badge>
                    <span className="text-sm text-gray-500">
                      {format(new Date(log.created_at), 'dd/MM/yyyy HH:mm', { locale: fr })}
                    </span>
                  </div>
                  <div className="text-sm">
                    <strong>Utilisateur :</strong> {log.user_email || 'Système'}
                  </div>
                  {log.details && (
                    <div className="text-xs text-gray-600 mt-1">
                      <pre className="whitespace-pre-wrap">{JSON.stringify(log.details, null, 2)}</pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};