import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  FileText, 
  Tag, 
  Clock, 
  Scale, 
  AlertTriangle, 
  Users, 
  BarChart3, 
  Settings,
  ArrowLeft,
  Download,
  Smartphone
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const AdminDashboard = () => {
  const navigate = useNavigate();

  // Récupérer le nombre de messages admin non lus
  const { data: unreadMessagesCount } = useQuery({
    queryKey: ['admin-unread-messages'],
    queryFn: async () => {
      const { count } = await supabase
        .from('admin_messages')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false);
      return count || 0;
    },
  });

  // Compteur de téléchargements (basé sur les visites avec user_agent mobile + premier accès)
  const { data: downloadStats } = useQuery({
    queryKey: ['admin-app-downloads'],
    queryFn: async () => {
      // Compter les visiteurs uniques sur mobile (proxy pour les téléchargements)
      const { count: mobileVisitors } = await supabase
        .from('app_visits')
        .select('visitor_id', { count: 'exact', head: true });
      
      // Compter les utilisateurs total inscrits
      const { data: totalUsers } = await supabase.rpc('admin_get_all_users');
      
      return {
        totalVisitors: mobileVisitors || 0,
        totalUsers: totalUsers?.length || 0,
      };
    },
  });

  const adminSections = [
    {
      title: "Messages Admin",
      description: "Demandes de récupération et messages",
      icon: FileText,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      badge: unreadMessagesCount && unreadMessagesCount > 0 ? { text: "Urgent", variant: "destructive" as const } : null,
      path: "/admin/messages",
    },
    {
      title: "Codes Promo",
      description: "Gérer les codes promotionnels",
      icon: Tag,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      path: "/admin/codes-promo",
    },
    {
      title: "Cartes Expirées",
      description: "Cartes expirées depuis plus de 30 jours",
      icon: Clock,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      badge: { text: "Nouveau", variant: "secondary" as const },
      path: "/admin/cartes-expirees",
    },
    {
      title: "Gestion Juridique",
      description: "Compliance et aspects légaux",
      icon: Scale,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      badge: { text: "Important", variant: "destructive" as const },
      path: "/admin/legal",
    },
    {
      title: "Signalements",
      description: "Gérer les signalements de cartes",
      icon: AlertTriangle,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      badge: { text: "Nouveau", variant: "secondary" as const },
      path: "/signaler",
    },
    {
      title: "Utilisateurs",
      description: "Gestion des comptes utilisateurs",
      icon: Users,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      path: "/admin/users",
    },
    {
      title: "Analytics",
      description: "Statistiques et analyses",
      icon: BarChart3,
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
      path: "/admin/analytics",
    },
    {
      title: "Paramètres",
      description: "Configuration système",
      icon: Settings,
      iconBg: "bg-gray-100",
      iconColor: "text-gray-600",
      path: "/admin/settings",
    },
  ];

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-6">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour
      </Button>

      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Settings className="h-8 w-8" />
          <h1 className="text-2xl sm:text-3xl font-bold">Panneau d'Administration</h1>
        </div>
        <p className="text-muted-foreground">Accédez aux différentes sections d'administration</p>
      </div>

      {/* Statistiques d'utilisation de l'app */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardContent className="p-4 sm:p-6 flex items-center gap-3">
            <div className="bg-emerald-500 p-2.5 rounded-xl">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-emerald-700 font-medium">Utilisateurs inscrits</p>
              <p className="text-xl sm:text-2xl font-bold text-emerald-900">{downloadStats?.totalUsers ?? '...'}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4 sm:p-6 flex items-center gap-3">
            <div className="bg-blue-500 p-2.5 rounded-xl">
              <Smartphone className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-blue-700 font-medium">Visites totales</p>
              <p className="text-xl sm:text-2xl font-bold text-blue-900">{downloadStats?.totalVisitors ?? '...'}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {adminSections.map((section) => {
          const Icon = section.icon;
          return (
            <Card key={section.path} className="relative hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(section.path)}>
              {section.badge && (
                <Badge 
                  variant={section.badge.variant}
                  className="absolute -top-2 -right-2 z-10"
                >
                  {section.badge.text}
                </Badge>
              )}
              <CardHeader className="p-4 sm:p-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className={`${section.iconBg} p-2.5 sm:p-3 rounded-lg`}>
                    <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${section.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base sm:text-xl mb-1 truncate">{section.title}</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">{section.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
