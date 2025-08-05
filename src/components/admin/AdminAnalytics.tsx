import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminNavigation } from "./AdminNavigation";
import { useAdminUserSignups } from "@/hooks/useAdminUserSignups";
import { useAuditLogs } from "@/hooks/useAuditLogs";
import { Loader2, BarChart3, Users, Activity, TrendingUp, Eye, Calendar } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export const AdminAnalytics = () => {
  const { data: signupData, loading: signupLoading, refetch: refetchSignups } = useAdminUserSignups();
  const { logs, loading: logsLoading, refetch: refetchLogs } = useAuditLogs();

  if (signupLoading || logsLoading) {
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSignups}</div>
            <p className="text-xs text-muted-foreground">
              Depuis le lancement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nouveaux cette semaine</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentSignups}</div>
            <p className="text-xs text-muted-foreground">
              7 derniers jours
            </p>
          </CardContent>
        </Card>

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