
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileSections } from "./ProfileSections";
import { MCard } from "@/types/mcard";

interface ProfileContentProps {
  session: any;
  firstName: string;
  lastName: string;
  phone: string;
  country: string;
  isEditing: boolean;
  totalEarnings: number;
  isOnVacation: boolean;
  enableSecurityNotifications: boolean;
  cards: any[];
  cardsLoading: boolean;
  topReporterEarned: boolean;
  premiumMemberEarned: boolean;
  badgesLoading: boolean;
  mcards: MCard[];
  mcardsLoading: boolean;
  profileLoading: boolean;
  setPhone: (phone: string) => void;
  setIsEditing: (isEditing: boolean) => void;
  updateProfile: () => void;
  onVacationModeChange: (checked: boolean) => void;
  onSecurityNotificationsChange: (checked: boolean) => void;
  deleteMCard: (id: string) => Promise<void>;
}

export const ProfileContent = ({
  session,
  firstName,
  lastName,
  phone,
  country,
  isEditing,
  totalEarnings,
  isOnVacation,
  enableSecurityNotifications,
  cards,
  cardsLoading,
  topReporterEarned,
  premiumMemberEarned,
  badgesLoading,
  mcards,
  mcardsLoading,
  profileLoading,
  setPhone,
  setIsEditing,
  updateProfile,
  onVacationModeChange,
  onSecurityNotificationsChange,
  deleteMCard
}: ProfileContentProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleEditMCard = (mcard: MCard) => {
    navigate('/mcards', { state: { editMCardId: mcard.id } });
  };

  const handleUpgradeFromProfile = () => {
    navigate('/mcards');
  };

  const handleContactSupport = () => {
    window.location.href = "mailto:idfinder06@gmail.com";
  };

  console.log('📊 Rendu ProfileContent avec:', {
    firstName,
    lastName,
    phone,
    country,
    isEditing,
    profileLoading
  });

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-card rounded-lg shadow-lg p-6 space-y-8">
          <ProfileHeader
            title={t("myProfile")}
            cardCount={cardsLoading ? 0 : cards.length}
            totalEarnings={totalEarnings}
            topReporterEarned={badgesLoading ? false : topReporterEarned}
            premiumMemberEarned={badgesLoading ? false : premiumMemberEarned}
          />
          
          <ProfileSections
            firstName={firstName}
            lastName={lastName}
            phone={phone}
            country={country}
            isEditing={isEditing}
            isOnVacation={isOnVacation}
            enableSecurityNotifications={enableSecurityNotifications}
            mcards={mcardsLoading ? [] : mcards}
            mcardsLoading={mcardsLoading}
            profileLoading={profileLoading}
            setPhone={setPhone}
            setIsEditing={setIsEditing}
            updateProfile={updateProfile}
            onVacationModeChange={onVacationModeChange}
            onSecurityNotificationsChange={onSecurityNotificationsChange}
            deleteMCard={deleteMCard}
            onStartUpgradeFlow={handleUpgradeFromProfile}
            onEditMCard={handleEditMCard}
            handleContactSupport={handleContactSupport}
          />
        </div>
      </main>
    </div>
  );
};
