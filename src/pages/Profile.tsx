
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { SupportSection } from "@/components/profile/SupportSection";
import { ProfileSkeleton } from "@/components/profile/ProfileSkeleton";
import { useProfile } from "@/hooks/useProfile";
import { useTranslation } from "@/hooks/useTranslation";

const Profile = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const {
    loading: profileLoading,
    firstName,
    lastName,
    phone,
    isEditing,
    setPhone,
    setIsEditing,
    getProfile,
    updateProfile
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
    window.location.href = "mailto:idfinder06@gmail.com";
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
          {t("back")}
        </Button>

        <div className="max-w-2xl mx-auto bg-card rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6">{t("myProfile")}</h1>
          
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
        </div>
      </main>
    </div>
  );
};

export default Profile;
