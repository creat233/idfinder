
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { SupportSection } from "@/components/profile/SupportSection";
import { ProfileSkeleton } from "@/components/profile/ProfileSkeleton";
import { DeleteAccountDialog } from "@/components/profile/DeleteAccountDialog";
import { useProfile } from "@/hooks/useProfile";

const Profile = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const {
    loading: profileLoading,
    firstName,
    lastName,
    phone,
    isEditing,
    isDeletingAccount,
    setPhone,
    setIsEditing,
    getProfile,
    updateProfile,
    deleteAccount
  } = useProfile();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session) {
        await getProfile(session);
      }
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        getProfile(session);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleUpdateProfile = () => {
    if (session) {
      updateProfile(session);
    }
  };

  const handleContactSupport = () => {
    window.location.href = "mailto:mcard1100@gmail.com";
  };

  if (loading || profileLoading) {
    return (
      <>
        <Header />
        <ProfileSkeleton />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>

        <div className="max-w-2xl mx-auto bg-card rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6">Mon Profil</h1>
          
          <ProfileForm
            firstName={firstName}
            lastName={lastName}
            phone={phone}
            isEditing={isEditing}
            loading={profileLoading}
            setPhone={setPhone}
            setIsEditing={setIsEditing}
            updateProfile={handleUpdateProfile}
          />
          
          <SupportSection handleContactSupport={handleContactSupport} />
          
          <div className="mt-8 border-t pt-8">
            <h2 className="text-xl font-semibold mb-4 text-destructive">Zone de danger</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Attention, la suppression de votre compte est irréversible. Toutes vos données seront définitivement supprimées.
            </p>
            <DeleteAccountDialog 
              isDeleting={isDeletingAccount}
              onDeleteAccount={deleteAccount}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
