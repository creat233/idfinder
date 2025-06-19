
import { useTranslation } from "@/hooks/useTranslation";
import { PersonalStats } from "./PersonalStats";
import { ProfileBadges } from "./ProfileBadges";

interface ProfileHeaderProps {
  title: string;
  cardCount: number;
  totalEarnings: number;
  topReporterEarned: boolean;
  premiumMemberEarned: boolean;
}

export const ProfileHeader = ({
  title,
  cardCount,
  totalEarnings,
  topReporterEarned,
  premiumMemberEarned
}: ProfileHeaderProps) => {
  return (
    <>
      <h1 className="text-2xl font-bold mb-2">{title}</h1>
      
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
