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
  Mail,
  ArrowLeft
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
    <div className="container mx-auto p-6 space-y-6">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour
      </Button>

      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Settings className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Panneau d'Administration</h1>
        </div>
        <p className="text-muted-foreground">Accédez aux différentes sections d'administration</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {adminSections.map((section) => {
          const Icon = section.icon;
          return (
            <Card key={section.path} className="relative hover:shadow-lg transition-shadow">
              {section.badge && (
                <Badge 
                  variant={section.badge.variant}
                  className="absolute -top-2 -right-2 z-10"
                >
                  {section.badge.text}
                </Badge>
              )}
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className={`${section.iconBg} p-3 rounded-lg`}>
                    <Icon className={`h-6 w-6 ${section.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-1">{section.title}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => navigate(section.path)}
                  className="w-full"
                  variant="outline"
                >
                  Accéder
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
