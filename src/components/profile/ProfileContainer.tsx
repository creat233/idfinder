
import { useState, useEffect, useRef } from "react";
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
  const [initialLoading, setInitialLoading] = useState(true);
  const initializationRef = useRef(false);
  
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
    onVacationModeChange,
    onSecurityNotificationsChange
  } = useProfile();
  
  const { cards, loading: cardsLoading } = useUserCards();
  const { loading: badgesLoading, topReporterEarned, premiumMemberEarned, fetchBadgeStatus } = useUserBadges();
  const { mcards, loading: mcardsLoading, deleteMCard } = useMCards();

  useEffect(() => {
    const initializeAuth = async () => {
      if (initializationRef.current) return;
      
      console.log('🔍 Initialisation unique de l\'authentification...');
      initializationRef.current = true;
      
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Erreur lors de la récupération de la session:', error);
          return;
        }

        if (session) {
          setSession(session);
          console.log('👤 Chargement des données utilisateur...');
          
          await Promise.all([
            getProfile(session),
            fetchBadgeStatus(session.user)
          ]);
        }
      } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Changement d\'état d\'authentification:', event);
      
      if (event === 'SIGNED_OUT') {
        setSession(null);
        initializationRef.current = false;
      } else if (session && event === 'SIGNED_IN' && !initializationRef.current) {
        setSession(session);
        initializationRef.current = true;
        
        await Promise.all([
          getProfile(session),
          fetchBadgeStatus(session.user)
        ]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [getProfile, fetchBadgeStatus]);

  if (initialLoading) {
    return (
      <>
        <Header />
        <ProfileSkeleton />
      </>
    );
  }

  if (!session) {
    window.location.href = '/login';
    return null;
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
        onVacationModeChange={onVacationModeChange}
        onSecurityNotificationsChange={onSecurityNotificationsChange}
        deleteMCard={deleteMCard}
      />
    </>
  );
};
