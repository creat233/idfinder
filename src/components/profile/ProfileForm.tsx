
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

  console.log('📋 ProfileForm rendu avec:', { firstName, lastName, phone, isEditing, loading });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">{t('firstName')}</label>
          <Input
            type="text"
            value={firstName || ""}
            disabled={true}
            className="bg-gray-50 text-gray-900"
            placeholder={!firstName ? "Prénom non renseigné" : ""}
          />
          <p className="text-xs text-gray-500 mt-1">
            Le prénom ne peut pas être modifié ici
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">{t('lastName')}</label>
          <Input
            type="text"
            value={lastName || ""}
            disabled={true}
            className="bg-gray-50 text-gray-900"
            placeholder={!lastName ? "Nom non renseigné" : ""}
          />
          <p className="text-xs text-gray-500 mt-1">
            Le nom ne peut pas être modifié ici
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">{t('phone')}</label>
          <Input
            type="tel"
            value={phone || ""}
            onChange={(e) => setPhone(e.target.value)}
            disabled={!isEditing}
            placeholder={!phone ? "Téléphone non renseigné" : ""}
            className={isEditing ? "border-blue-300 focus:border-blue-500" : "bg-gray-50 text-gray-900"}
          />
          {isEditing && (
            <p className="text-xs text-gray-500 mt-1">
              Le pays sera automatiquement détecté à partir du numéro
            </p>
          )}
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
                className="px-6"
              >
                {t('cancel')}
              </Button>
              <Button
                onClick={updateProfile}
                disabled={loading}
                className="px-6"
              >
                {loading ? "Sauvegarde..." : t('save')}
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              disabled={loading}
              className="px-6"
            >
              {t('editPhone')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
