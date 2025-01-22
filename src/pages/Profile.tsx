import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Edit2, Save, MessageSquare, ArrowLeft } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userInfo, setUserInfo] = useState({
    name: "",
    phone: ""
  });
  const mounted = useRef(true);

  useEffect(() => {
    const getUserData = async () => {
      if (!mounted.current) return;
      
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error('Session error:', sessionError);
          toast({
            title: "Erreur de session",
            description: "Impossible de récupérer vos informations. Veuillez vous reconnecter.",
            variant: "destructive",
          });
          return;
        }

        if (!session?.user) {
          toast({
            title: "Non connecté",
            description: "Veuillez vous connecter pour accéder à votre profil.",
            variant: "destructive",
          });
          return;
        }

        setUserEmail(session.user.email || "");

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('first_name, last_name, phone')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profileError) {
          console.error('Profile error:', profileError);
          toast({
            title: "Erreur",
            description: "Impossible de charger les informations du profil.",
            variant: "destructive",
          });
          return;
        }

        if (profileData && mounted.current) {
          const fullName = `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim();
          setUserInfo(prev => ({
            ...prev,
            name: fullName,
            phone: profileData.phone || ""
          }));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors du chargement du profil.",
          variant: "destructive",
        });
      }
    };

    getUserData();

    return () => {
      mounted.current = false;
    };
  }, [toast]);

  const handleSave = async () => {
    if (!mounted.current) return;

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        toast({
          title: "Erreur",
          description: "Session invalide. Veuillez vous reconnecter.",
          variant: "destructive",
        });
        return;
      }

      if (!session?.user) {
        toast({
          title: "Non connecté",
          description: "Vous devez être connecté pour modifier votre profil.",
          variant: "destructive",
        });
        return;
      }

      const [firstName, ...lastNameParts] = userInfo.name.split(' ');
      const lastName = lastNameParts.join(' ');

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          first_name: firstName || null,
          last_name: lastName || null,
          phone: userInfo.phone || null
        })
        .eq('id', session.user.id);

      if (updateError) {
        console.error('Update error:', updateError);
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour le profil.",
          variant: "destructive",
        });
        return;
      }

      setIsEditing(false);
      toast({
        title: "Succès",
        description: "Votre profil a été mis à jour avec succès.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du profil.",
        variant: "destructive",
      });
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

  return (
    <div className="min-h-screen bg-accent">
      <Header />
      <div className="container mx-auto py-12">
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
        </div>

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