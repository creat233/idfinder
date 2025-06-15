import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { SupportSection } from "@/components/profile/SupportSection";
import { ProfileSkeleton } from "@/components/profile/ProfileSkeleton";
import { CountryInfo } from "@/components/profile/CountryInfo";
import { useProfile } from "@/hooks/useProfile";
import { useTranslation } from "@/hooks/useTranslation";
import { useUserCards } from "@/hooks/useUserCards";
import { PersonalStats } from "@/components/profile/PersonalStats";
import { PasswordChangeForm } from "@/components/profile/PasswordChangeForm";
import { Separator } from "@/components/ui/separator";

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
    country,
    isEditing,
    totalEarnings,
    setPhone,
    setIsEditing,
    getProfile,
    updateProfile
  } = useProfile();
  const { cards, loading: cardsLoading } = useUserCards();

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

  if (loading || profileLoading || cardsLoading) {
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
        <div className="max-w-2xl mx-auto bg-card rounded-lg shadow-lg p-6 space-y-8">
          <h1 className="text-2xl font-bold mb-2">{t("myProfile")}</h1>
          
          <PersonalStats cardCount={cards.length} totalEarnings={totalEarnings} />

          <Separator />
          
          {/* Informations du pays */}
          <CountryInfo countryCode={country} />
          
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
          
          <Separator />

          <PasswordChangeForm />

          <Separator />

          <SupportSection handleContactSupport={handleContactSupport} />
        </div>
      </main>
    </div>
  );
};

export default Profile;
