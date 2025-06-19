
import { Separator } from "@/components/ui/separator";
import { CountryInfo } from "./CountryInfo";
import { ProfileForm } from "./ProfileForm";
import { NotificationSettings } from "./NotificationSettings";
import { MCardsList } from "@/components/mcards/MCardsList";
import { PasswordChangeForm } from "./PasswordChangeForm";
import { SupportSection } from "./SupportSection";
import { TermsOfServiceSection } from "./TermsOfServiceSection";
import { MCard } from "@/types/mcard";

interface ProfileSectionsProps {
  firstName: string;
  lastName: string;
  phone: string;
  country: string;
  isEditing: boolean;
  isOnVacation: boolean;
  enableSecurityNotifications: boolean;
  mcards: MCard[];
  mcardsLoading: boolean;
  profileLoading: boolean;
  setPhone: (phone: string) => void;
  setIsEditing: (isEditing: boolean) => void;
  updateProfile: () => void;
  onVacationModeChange: (checked: boolean) => void;
  onSecurityNotificationsChange: (checked: boolean) => void;
  deleteMCard: (id: string) => Promise<void>;
  onStartUpgradeFlow: () => void;
  onEditMCard: (mcard: MCard) => void;
  handleContactSupport: () => void;
}

export const ProfileSections = ({
  firstName,
  lastName,
  phone,
  country,
  isEditing,
  isOnVacation,
  enableSecurityNotifications,
  mcards,
  mcardsLoading,
  profileLoading,
  setPhone,
  setIsEditing,
  updateProfile,
  onVacationModeChange,
  onSecurityNotificationsChange,
  deleteMCard,
  onStartUpgradeFlow,
  onEditMCard,
  handleContactSupport
}: ProfileSectionsProps) => {
  return (
    <>
      <Separator />
      
      <CountryInfo countryCode={country} />
      
      <ProfileForm
        firstName={firstName}
        lastName={lastName}
        phone={phone}
        isEditing={isEditing}
        loading={profileLoading}
        setPhone={setPhone}
        setIsEditing={setIsEditing}
        updateProfile={updateProfile}
      />
      
      <Separator />

      <NotificationSettings
        isOnVacation={isOnVacation}
        onVacationModeChange={onVacationModeChange}
        enableSecurityNotifications={enableSecurityNotifications}
        onSecurityNotificationsChange={onSecurityNotificationsChange}
        loading={profileLoading}
      />

      <Separator />
      
      <MCardsList
        mcards={mcards}
        loading={mcardsLoading}
        deleteMCard={deleteMCard}
        onStartUpgradeFlow={onStartUpgradeFlow}
        onEdit={onEditMCard}
      />

      <Separator />

      <PasswordChangeForm />

      <Separator />

      <TermsOfServiceSection />

      <Separator />

      <SupportSection handleContactSupport={handleContactSupport} />
    </>
  );
};
