import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Edit2, Save, MessageSquare } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userInfo, setUserInfo] = useState({
    name: "",
    phone: ""
  });
  const mounted = useRef(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && mounted.current) {
          setUserEmail(session.user.email || "");
          
          // Fetch user profile data from profiles table
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', session.user.id)
            .single();
          
          if (error) throw error;
          
          if (profileData && mounted.current) {
            setUserInfo(prev => ({
              ...prev,
              name: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim(),
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        if (mounted.current) {
          toast({
            title: "Erreur",
            description: "Impossible de charger les informations du profil.",
            variant: "destructive",
          });
        }
      }
    };

    getUserData();
    return () => {
      mounted.current = false;
    };
  }, [toast]);

  const handleSave = async () => {
    try {
      if (!mounted.current) return;
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error("Utilisateur non connecté");

      const [firstName, ...lastNameParts] = userInfo.name.split(' ');
      const lastName = lastNameParts.join(' ');

      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName || null,
        })
        .eq('id', session.user.id);

      if (error) throw error;
      
      setIsEditing(false);
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été enregistrées avec succès.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      if (mounted.current) {
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la mise à jour du profil.",
          variant: "destructive",
        });
      }
    }
  };

  const handleContactSupport = () => {
    window.location.href = "mailto:mcard1100@gmail.com";
  };

  const handleInputChange = (field: keyof typeof userInfo, value: string) => {
    if (!mounted.current) return;
    
    setUserInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!mounted.current) return null;

  return (
    <div className="min-h-screen bg-accent">
      <Header />
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
                  Gérez vos informations personnelles
                </p>
              </div>
            </div>
            <Button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              variant={isEditing ? "default" : "outline"}
            >
              {isEditing ? (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Sauvegarder
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Modifier
                </>
              )}
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
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userEmail}
                    disabled={true}
                    className="bg-gray-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={userInfo.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!isEditing}
                    placeholder="+221 XX XXX XX XX"
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Support
              </h2>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Notre équipe de support est disponible pour répondre à toutes vos questions.
                </p>
                <Button 
                  className="w-full"
                  onClick={handleContactSupport}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contacter le support
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;