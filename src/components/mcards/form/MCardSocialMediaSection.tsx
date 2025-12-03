
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { MCardFormData } from "./mcardFormSchema";
import { MCardCustomSocialLinks } from "./MCardCustomSocialLinks";

interface MCardSocialMediaSectionProps {
  register: UseFormRegister<MCardFormData>;
  errors: FieldErrors<MCardFormData>;
  watch?: UseFormWatch<MCardFormData>;
  setValue?: UseFormSetValue<MCardFormData>;
  customSocialLinks?: { name: string; url: string }[];
  onCustomSocialLinksChange?: (links: { name: string; url: string }[]) => void;
}

export const MCardSocialMediaSection = ({ 
  register, 
  errors,
  customSocialLinks = [],
  onCustomSocialLinksChange
}: MCardSocialMediaSectionProps) => {
  return (
    <>
      <Separator />
      <h3 className="text-lg font-semibold">Réseaux sociaux & Business</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="linkedin_url">LinkedIn</Label>
          <Input id="linkedin_url" {...register("linkedin_url")} placeholder="https://linkedin.com/in/votreprofil" />
          {errors.linkedin_url && <p className="text-sm text-red-500">{errors.linkedin_url.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="twitter_url">Twitter / X</Label>
          <Input id="twitter_url" {...register("twitter_url")} placeholder="https://twitter.com/votrecompte" />
          {errors.twitter_url && <p className="text-sm text-red-500">{errors.twitter_url.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="facebook_url">Facebook</Label>
          <Input id="facebook_url" {...register("facebook_url")} placeholder="https://facebook.com/votreprofil" />
          {errors.facebook_url && <p className="text-sm text-red-500">{errors.facebook_url.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="instagram_url">Instagram</Label>
          <Input id="instagram_url" {...register("instagram_url")} placeholder="https://instagram.com/votrecompte" />
          {errors.instagram_url && <p className="text-sm text-red-500">{errors.instagram_url.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="youtube_url">YouTube</Label>
          <Input id="youtube_url" {...register("youtube_url")} placeholder="https://youtube.com/@votreschaine" />
          {errors.youtube_url && <p className="text-sm text-red-500">{errors.youtube_url.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="tiktok_url">TikTok</Label>
          <Input id="tiktok_url" {...register("tiktok_url")} placeholder="https://tiktok.com/@votrecompte" />
          {errors.tiktok_url && <p className="text-sm text-red-500">{errors.tiktok_url.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="snapchat_url">Snapchat</Label>
          <Input id="snapchat_url" {...register("snapchat_url")} placeholder="https://snapchat.com/add/votrecompte" />
          {errors.snapchat_url && <p className="text-sm text-red-500">{errors.snapchat_url.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="telegram_url">Telegram</Label>
          <Input id="telegram_url" {...register("telegram_url")} placeholder="https://t.me/votrecompte" />
          {errors.telegram_url && <p className="text-sm text-red-500">{errors.telegram_url.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="google_business_url">Google Business (Lien pour les avis)</Label>
          <Input id="google_business_url" {...register("google_business_url")} placeholder="https://g.page/votreentreprise/review" />
          {errors.google_business_url && <p className="text-sm text-red-500">{errors.google_business_url.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="maps_location_url">📍 Emplacement sur Maps</Label>
          <Input id="maps_location_url" {...register("maps_location_url")} placeholder="https://maps.google.com/..." />
          {errors.maps_location_url && <p className="text-sm text-red-500">{errors.maps_location_url.message}</p>}
        </div>
      </div>

      {/* Section pour ajouter des réseaux sociaux personnalisés */}
      {onCustomSocialLinksChange && (
        <MCardCustomSocialLinks
          value={customSocialLinks}
          onChange={onCustomSocialLinksChange}
        />
      )}
    </>
  );
};
