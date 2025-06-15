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
import { ProfileBadges } from "@/components/profile/ProfileBadges";
import { useUserBadges } from "@/hooks/useUserBadges";
import { NotificationSettings } from "@/components/profile/NotificationSettings";
import { useMCards } from "@/hooks/useMCards";
import { MCardsList } from "@/components/mcards/MCardsList";

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
    isOnVacation,
    enableSecurityNotifications,
    setPhone,
    setIsEditing,
    getProfile,
    updateProfile,
    updateNotificationSettings
  } = useProfile();
  const { cards, loading: cardsLoading } = useUserCards();
  const { loading: badgesLoading, topReporterEarned, premiumMemberEarned, fetchBadgeStatus } = useUserBadges();
  const { mcards, loading: mcardsLoading, createMCard, updateMCard, deleteMCard } = useMCards();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session) {
        await getProfile(session);
        await fetchBadgeStatus(session.user);
      }
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        getProfile(session);
        fetchBadgeStatus(session.user);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [getProfile, fetchBadgeStatus]);

  const handleUpdateProfile = () => {
    if (session) {
      updateProfile(session);
    }
  };
  
  const handleContactSupport = () => {
    window.location.href = "mailto:idfinder06@gmail.com";
  };
  
  const handleVacationModeChange = (checked: boolean) => {
    updateNotificationSettings({ isOnVacation: checked });
  };

  const handleSecurityNotificationsChange = (checked: boolean) => {
    updateNotificationSettings({ enableSecurityNotifications: checked });
  };


  if (loading || profileLoading || cardsLoading || badgesLoading || mcardsLoading) {
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

          <ProfileBadges 
            topReporterEarned={topReporterEarned}
            premiumMemberEarned={premiumMemberEarned}
          />
          
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

          <NotificationSettings
            isOnVacation={isOnVacation}
            onVacationModeChange={handleVacationModeChange}
            enableSecurityNotifications={enableSecurityNotifications}
            onSecurityNotificationsChange={handleSecurityNotificationsChange}
            loading={profileLoading}
          />

          <Separator />
          
          <MCardsList
            mcards={mcards}
            loading={mcardsLoading}
            createMCard={createMCard}
            updateMCard={updateMCard}
            deleteMCard={deleteMCard}
            onStartUpgradeFlow={() => {}}
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
