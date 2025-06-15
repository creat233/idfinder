
import { Switch } from "@/components/ui/switch";
import { useTranslation } from "@/hooks/useTranslation";
import { Label } from "@/components/ui/label";

interface NotificationSettingsProps {
  isOnVacation: boolean;
  onVacationModeChange: (checked: boolean) => void;
  enableSecurityNotifications: boolean;
  onSecurityNotificationsChange: (checked: boolean) => void;
  loading: boolean;
}

export const NotificationSettings = ({
  isOnVacation,
  onVacationModeChange,
  enableSecurityNotifications,
  onSecurityNotificationsChange,
  loading,
}: NotificationSettingsProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
       <h2 className="text-xl font-semibold">{t('notificationSettings')}</h2>
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div>
          <Label htmlFor="vacation-mode" className="font-semibold">{t('vacationMode')}</Label>
          <p className="text-sm text-muted-foreground">{t('vacationModeDescription')}</p>
        </div>
        <Switch
          id="vacation-mode"
          checked={isOnVacation}
          onCheckedChange={onVacationModeChange}
          disabled={loading}
        />
      </div>
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div>
          <Label htmlFor="security-notifications" className="font-semibold">{t('securityNotifications')}</Label>
          <p className="text-sm text-muted-foreground">{t('securityNotificationsDescription')}</p>
        </div>
        <Switch
          id="security-notifications"
          checked={enableSecurityNotifications}
          onCheckedChange={onSecurityNotificationsChange}
          disabled={loading}
        />
      </div>
    </div>
  );
};
