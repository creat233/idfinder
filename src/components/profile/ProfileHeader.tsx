
import { useTranslation } from "@/hooks/useTranslation";
import { PersonalStats } from "./PersonalStats";
import { ProfileBadges } from "./ProfileBadges";
import { ProfileAvatarUpload } from "./ProfileAvatarUpload";

interface ProfileHeaderProps {
  title: string;
  cardCount: number;
  totalEarnings: number;
  topReporterEarned: boolean;
  premiumMemberEarned: boolean;
  userId?: string;
  firstName?: string;
  lastName?: string;
}

export const ProfileHeader = ({
  title,
  cardCount,
  totalEarnings,
  topReporterEarned,
  premiumMemberEarned,
  userId,
  firstName,
  lastName
}: ProfileHeaderProps) => {
  return (
    <>
      <h1 className="text-2xl font-bold mb-4">{title}</h1>

      <ProfileAvatarUpload userId={userId} firstName={firstName} lastName={lastName} />

      <PersonalStats 
        cardCount={cardCount} 
        totalEarnings={totalEarnings} 
      />

      <ProfileBadges 
        topReporterEarned={topReporterEarned}
        premiumMemberEarned={premiumMemberEarned}
      />
    </>
  );
};

