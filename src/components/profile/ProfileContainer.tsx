
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ProfileSkeleton } from "@/components/profile/ProfileSkeleton";
import { ProfileContent } from "./ProfileContent";
import { useProfile } from "@/hooks/useProfile";
import { useUserCards } from "@/hooks/useUserCards";
import { useUserBadges } from "@/hooks/useUserBadges";
import { useMCards } from "@/hooks/useMCards";
import { useOfflineSync } from "@/hooks/useOfflineSync";
import { offlineStorage } from "@/services/offlineStorage";
import { mcardExpirationService } from "@/services/mcardExpirationService";
import { ArrowLeft } from "lucide-react";

export const ProfileContainer = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const initializationRef = useRef(false);
  const { isOnline } = useOfflineSync();
  
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
            fetchBadgeStatus(session.user),
            mcardExpirationService.checkAndUpdateExpiredMCards()
          ]);
        }
      } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    initializeAuth();
    
    // Démarrer la vérification périodique des expirations (toutes les 30 minutes)
    const expirationCheckInterval = mcardExpirationService.startPeriodicCheck(30);

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
      clearInterval(expirationCheckInterval);
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

  // En mode hors ligne, afficher les données locales
  if (!session && !isOnline) {
    const offlineMCards = offlineStorage.getAllMCards();
    
    // Si on a des MCards en cache, les afficher
    if (offlineMCards.length > 0) {
      return (
        <>
          <Header />
          <ProfileContent
            session={null}
            firstName=""
            lastName=""
            phone=""
            country=""
            isEditing={false}
            totalEarnings={0}
            isOnVacation={false}
            enableSecurityNotifications={false}
            cards={[]}
            cardsLoading={false}
            topReporterEarned={false}
            premiumMemberEarned={false}
            badgesLoading={false}
            mcards={offlineMCards}
            mcardsLoading={false}
            profileLoading={false}
            setPhone={() => {}}
            setIsEditing={() => {}}
            updateProfile={() => Promise.resolve()}
            onVacationModeChange={() => {}}
            onSecurityNotificationsChange={() => {}}
            deleteMCard={() => Promise.resolve()}
          />
        </>
      );
    }
  }
  
  // Si pas de session et en ligne, rediriger vers login
  if (!session) {
    window.location.href = '/login';
    return null;
  }

  return (
    <>
      <Header />
      {/* Bouton Retour */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="flex items-center gap-2 mb-4 sm:mb-6 hover:bg-accent transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm sm:text-base">Retour</span>
        </Button>
      </div>
      
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
