
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { ProfileSkeleton } from "@/components/profile/ProfileSkeleton";
import { ProfileContent } from "./ProfileContent";
import { useProfile } from "@/hooks/useProfile";
import { useUserCards } from "@/hooks/useUserCards";
import { useUserBadges } from "@/hooks/useUserBadges";
import { useMCards } from "@/hooks/useMCards";

export const ProfileContainer = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
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
  const { mcards, loading: mcardsLoading, deleteMCard } = useMCards();

  useEffect(() => {
    const getSession = async () => {
      console.log('🔍 Récupération de la session...');
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Session obtenue:', session);
      
      setSession(session);
      if (session) {
        console.log('👤 Chargement du profil pour l\'utilisateur:', session.user.id);
        await getProfile(session);
        await fetchBadgeStatus(session.user);
      }
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('🔄 Changement d\'état d\'authentification:', _event, session?.user?.id);
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

  console.log('📊 État du profil:', {
    loading,
    profileLoading,
    firstName,
    lastName,
    phone,
    session: session?.user?.id
  });

  if (loading || profileLoading) {
    return (
      <>
        <Header />
        <ProfileSkeleton />
      </>
    );
  }

  return (
    <>
      <Header />
      <ProfileContent
        session={session}
        firstName={firstName}
        lastName={lastName}
        phone={phone}
        country={country}
        isEditing={isEditing}
        totalEarnings={totalEarnings}
        isOnVacation={isOnVacation}
        enableSecurityNotifications={enableSecurityNotifications}
        cards={cards}
        cardsLoading={cardsLoading}
        topReporterEarned={topReporterEarned}
        premiumMemberEarned={premiumMemberEarned}
        badgesLoading={badgesLoading}
        mcards={mcards}
        mcardsLoading={mcardsLoading}
        profileLoading={profileLoading}
        setPhone={setPhone}
        setIsEditing={setIsEditing}
        updateProfile={() => updateProfile(session)}
        updateNotificationSettings={updateNotificationSettings}
        deleteMCard={deleteMCard}
      />
    </>
  );
};
