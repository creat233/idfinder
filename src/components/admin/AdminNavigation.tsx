import { Link, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  CreditCard, 
  AlertTriangle, 
  Scale, 
  BarChart3, 
  Settings,
  FileText,
  Clock
} from "lucide-react";

export const AdminNavigation = () => {
  const location = useLocation();

  const adminSections = [
    {
      title: "Messages Admin",
      description: "Demandes de récupération et messages",
      icon: FileText,
      path: "/admin/messages",
      color: "bg-red-100 text-red-800",
      count: "Urgent",
      urgent: true
    },
    {
      title: "Codes Promo",
      description: "Gérer les codes promotionnels",
      icon: FileText,
      path: "/admin/codes-promo",
      color: "bg-blue-100 text-blue-800",
      count: null
    },
    {
      title: "Cartes Expirées",
      description: "Cartes expirées depuis plus de 30 jours",
      icon: Clock,
      path: "/admin/cartes-expirees",
      color: "bg-orange-100 text-orange-800",
      count: "Nouveau",
      urgent: true
    },
    {
      title: "Gestion Juridique",
      description: "Compliance et aspects légaux",
      icon: Scale,
      path: "/admin/juridique",
      color: "bg-purple-100 text-purple-800",
      count: "Important",
      urgent: true
    },
    {
      title: "Signalements",
      description: "Gérer les signalements de cartes",
      icon: AlertTriangle,
      path: "/admin/signalements",
      color: "bg-red-100 text-red-800",
      count: "Nouveau",
      urgent: true
    },
    {
      title: "Utilisateurs",
      description: "Gestion des comptes utilisateurs",
      icon: Users,
      path: "/admin/utilisateurs",
      color: "bg-green-100 text-green-800",
      count: null
    },
    {
      title: "Analytics",
      description: "Statistiques et analyses",
      icon: BarChart3,
      path: "/admin/analytics",
      color: "bg-indigo-100 text-indigo-800",
      count: null
    },
    {
      title: "Paramètres",
      description: "Configuration système",
      icon: Settings,
      path: "/admin/parametres",
      color: "bg-gray-100 text-gray-800",
      count: null
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Panneau d'Administration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {adminSections.map((section, index) => (
              <div key={index} className="relative">
                <Link to={section.path}>
                  <div className={`border rounded-lg p-4 hover:shadow-md transition-all duration-200 ${
                    location.pathname === section.path ? 'ring-2 ring-primary bg-primary/5' : ''
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-2 rounded-lg ${section.color}`}>
                        <section.icon className="h-5 w-5" />
                      </div>
                      {section.count && (
                        <Badge 
                          variant={section.urgent ? "destructive" : "secondary"}
                          className={section.urgent ? "animate-pulse" : ""}
                        >
                          {section.count}
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-semibold mb-1">{section.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{section.description}</p>
                    <Button variant="outline" className="w-full">
                      Accéder
                    </Button>
                  </div>
                </Link>
                
                {section.urgent && (
                  <div className="absolute -top-2 -right-2">
                    <div className="bg-red-500 rounded-full p-1">
                      <AlertTriangle className="h-3 w-3 text-white" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Statistiques rapides */}
      <Card>
        <CardHeader>
          <CardTitle>Aperçu Rapide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <CreditCard className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-blue-600">-</div>
              <div className="text-sm text-gray-600">Cartes Actives</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-orange-600" />
              <div className="text-2xl font-bold text-orange-600">-</div>
              <div className="text-sm text-gray-600">Cartes Expirées</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Users className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold text-green-600">-</div>
              <div className="text-sm text-gray-600">Utilisateurs</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Scale className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold text-purple-600">-</div>
              <div className="text-sm text-gray-600">Tâches Légales</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};