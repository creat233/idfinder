
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/hooks/useTranslation";
import { Award, Shield } from "lucide-react";

interface ProfileBadgesProps {
  topReporterEarned: boolean;
  premiumMemberEarned: boolean;
}

export const ProfileBadges = ({ topReporterEarned, premiumMemberEarned }: ProfileBadgesProps) => {
  const { t } = useTranslation();

  const badges = [
    {
      icon: <Shield className={`h-6 w-6 ${topReporterEarned ? 'text-green-500' : 'text-gray-400'}`} />,
      title: t('topReporter'),
      description: t('topReporterDescription'),
      earned: topReporterEarned,
    },
    {
      icon: <Award className={`h-6 w-6 ${premiumMemberEarned ? 'text-yellow-500' : 'text-gray-400'}`} />,
      title: t('premiumMember'),
      description: t('premiumMemberDescription'),
      earned: premiumMemberEarned,
    },
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">{t('myBadges')}</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {badges.map((badge, index) => (
          <Card key={index} className={!badge.earned ? 'opacity-50' : ''}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{badge.title}</CardTitle>
              {badge.icon}
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{badge.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
