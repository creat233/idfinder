import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LanguageSelect } from "./LanguageSelect";
import { useForm } from "react-hook-form";
import { useTranslation } from "@/hooks/useTranslation";

interface ProfileFormProps {
  firstName: string;
  lastName: string;
  phone: string;
  isEditing: boolean;
  loading: boolean;
  setPhone: (phone: string) => void;
  setIsEditing: (isEditing: boolean) => void;
  updateProfile: () => void;
}

export const ProfileForm = ({
  firstName,
  lastName,
  phone,
  isEditing,
  loading,
  setPhone,
  setIsEditing,
  updateProfile
}: ProfileFormProps) => {
  const { t, currentLanguage, changeLanguage } = useTranslation();
  const form = useForm({
    defaultValues: {
      language: currentLanguage
    }
  });

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">{t('firstName')}</label>
        <Input
          type="text"
          value={firstName}
          disabled={true}
          className="bg-gray-100"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">{t('lastName')}</label>
        <Input
          type="text"
          value={lastName}
          disabled={true}
          className="bg-gray-100"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">{t('phone')}</label>
        <Input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={!isEditing}
        />
      </div>

      <LanguageSelect
        control={form.control}
        name="language"
        currentLanguage={currentLanguage}
        onLanguageChange={changeLanguage}
      />

      <div className="flex justify-end space-x-4 mt-6">
        {isEditing ? (
          <>
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
              disabled={loading}
            >
              {t('cancel')}
            </Button>
            <Button
              onClick={updateProfile}
              disabled={loading}
            >
              {t('save')}
            </Button>
          </>
        ) : (
          <Button
            onClick={() => setIsEditing(true)}
            disabled={loading}
          >
            {t('editPhone')}
          </Button>
        )}
      </div>
    </div>
  );
};
