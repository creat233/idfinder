import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminNavigation } from "./AdminNavigation";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { Loader2, Search, User, Mail, Phone, Globe, Calendar } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export const AdminUsers = () => {
  const { users, loading, refetch } = useAdminUsers();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phone?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminNavigation />
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Gestion des Utilisateurs
            <Badge variant="secondary">{users.length} utilisateurs</Badge>
          </CardTitle>
          <Button onClick={refetch} variant="outline">
            Actualiser
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher par nom, email ou téléphone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchQuery ? "Aucun utilisateur trouvé pour cette recherche" : "Aucun utilisateur"}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <Card key={user.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">
                            {user.first_name && user.last_name 
                              ? `${user.first_name} ${user.last_name}`
                              : "Nom non renseigné"
                            }
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{user.email}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            {user.phone || "Non renseigné"}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            {user.country || "Non renseigné"}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            Inscrit le {format(new Date(user.created_at), 'dd MMMM yyyy', { locale: fr })}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button variant="outline" size="sm">
                          Voir le profil
                        </Button>
                        <Button variant="outline" size="sm">
                          Envoyer un message
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};