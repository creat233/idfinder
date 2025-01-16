import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Award, Bell, CreditCard, User, Edit2, Save } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const Profile = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+41 XX XXX XX XX",
    iban: "CH XX XXXX XXXX XXXX XXXX X"
  });

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Profil mis à jour",
      description: "Vos informations ont été enregistrées avec succès.",
    });
  };

  const handleAddBankAccount = () => {
    toast({
      title: "Ajout de compte bancaire",
      description: "Cette fonctionnalité sera bientôt disponible.",
    });
  };

  return (
    <div className="min-h-screen bg-accent">
      <div className="container mx-auto py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Mon Profil</h1>
                <p className="text-muted-foreground">
                  Gérez vos informations et suivez vos activités
                </p>
              </div>
            </div>
            <Button
              variant={isEditing ? "default" : "outline"}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? (
                <Save className="w-4 h-4 mr-2" />
              ) : (
                <Edit2 className="w-4 h-4 mr-2" />
              )}
              {isEditing ? "Sauvegarder" : "Modifier"}
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Informations Personnelles
              </h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet</Label>
                  <Input
                    id="name"
                    value={userInfo.name}
                    onChange={(e) =>
                      setUserInfo({ ...userInfo, name: e.target.value })
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userInfo.email}
                    onChange={(e) =>
                      setUserInfo({ ...userInfo, email: e.target.value })
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={userInfo.phone}
                    onChange={(e) =>
                      setUserInfo({ ...userInfo, phone: e.target.value })
                    }
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                Récompenses
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Total des récompenses</span>
                  <span className="font-bold">2000 CHF</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Cartes restituées</span>
                  <span className="font-bold">2</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>En attente de paiement</span>
                  <span className="font-bold text-orange-500">1000 CHF</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Notifications
              </h2>
              <div className="space-y-4">
                <div className="border-l-4 border-orange-500 pl-4 py-2 bg-orange-50 rounded">
                  <p className="font-medium">Carte d'identité trouvée</p>
                  <p className="text-sm text-muted-foreground">
                    Une carte a été signalée à votre nom. Vérifiez les détails.
                  </p>
                </div>
                <div className="border-l-4 border-green-500 pl-4 py-2 bg-green-50 rounded">
                  <p className="font-medium">Récompense reçue</p>
                  <p className="text-sm text-muted-foreground">
                    Vous avez reçu 1000 CHF pour une carte restituée.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                Informations de paiement
              </h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="iban">IBAN</Label>
                  <Input
                    id="iban"
                    value={userInfo.iban}
                    onChange={(e) =>
                      setUserInfo({ ...userInfo, iban: e.target.value })
                    }
                    disabled={!isEditing}
                  />
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleAddBankAccount}
                >
                  Ajouter un compte bancaire
                </Button>
              </div>
            </Card>
          </div>

          {isEditing && (
            <div className="mt-6 flex justify-end">
              <Button onClick={handleSave}>Sauvegarder les modifications</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;