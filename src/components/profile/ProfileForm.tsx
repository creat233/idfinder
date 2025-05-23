
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Prénom</label>
        <Input
          type="text"
          value={firstName}
          disabled={true}
          className="bg-gray-100"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Nom</label>
        <Input
          type="text"
          value={lastName}
          disabled={true}
          className="bg-gray-100"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Téléphone</label>
        <Input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={!isEditing}
        />
      </div>

      <div className="flex justify-end space-x-4 mt-6">
        {isEditing ? (
          <>
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button
              onClick={updateProfile}
              disabled={loading}
            >
              Enregistrer
            </Button>
          </>
        ) : (
          <Button
            onClick={() => setIsEditing(true)}
            disabled={loading}
          >
            Modifier le téléphone
          </Button>
        )}
      </div>
    </div>
  );
};
