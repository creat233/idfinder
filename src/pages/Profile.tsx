import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Award, Bell, CreditCard, User } from "lucide-react";

const Profile = () => {
  return (
    <div className="min-h-screen bg-accent">
      <div className="container mx-auto py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Mon Profil</h1>
              <p className="text-gray-600">Gérez vos informations et suivez vos activités</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-secondary" />
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
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-secondary" />
                Notifications
              </h2>
              <div className="space-y-4">
                <p className="text-gray-600">Aucune notification pour le moment</p>
              </div>
            </Card>

            <Card className="p-6 md:col-span-2">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-secondary" />
                Informations de paiement
              </h2>
              <div className="space-y-4">
                <p className="text-gray-600">Ajoutez vos informations bancaires pour recevoir vos récompenses</p>
                <Button variant="outline">Ajouter un compte bancaire</Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;