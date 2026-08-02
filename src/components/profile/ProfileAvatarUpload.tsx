import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, Loader2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProfileAvatarUploadProps {
  userId?: string;
  firstName?: string;
  lastName?: string;
}

const getInitials = (first?: string, last?: string) => {
  const value = `${first?.[0] ?? ""}${last?.[0] ?? ""}`.trim();
  return value ? value.toUpperCase() : "?";
};

export const ProfileAvatarUpload = ({ userId, firstName, lastName }: ProfileAvatarUploadProps) => {
  const { toast } = useToast();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    supabase
      .from("profiles")
      .select("avatar_url")
      .eq("id", userId)
      .maybeSingle()
      .then(({ data }) => setAvatarUrl(data?.avatar_url ?? null));
  }, [userId]);

  const onDrop = useCallback(
    async (files: File[]) => {
      if (!files.length || !userId) return;
      const file = files[0];
      setUploading(true);
      try {
        const ext = file.name.split(".").pop() || "jpg";
        const path = `avatars/${userId}/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("mcard-profile-pictures")
          .upload(path, file, { upsert: true });
        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from("mcard-profile-pictures").getPublicUrl(path);
        const { error } = await supabase
          .from("profiles")
          .update({ avatar_url: data.publicUrl })
          .eq("id", userId);
        if (error) throw error;

        setAvatarUrl(data.publicUrl);
        toast({ title: "Photo de profil mise à jour" });
      } catch (e) {
        console.error(e);
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour la photo.",
          variant: "destructive",
        });
      } finally {
        setUploading(false);
      }
    },
    [userId, toast]
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp", ".gif"] },
    multiple: false,
    noClick: true,
  });

  const handleRemove = async () => {
    if (!userId) return;
    setUploading(true);
    try {
      const { error } = await supabase.from("profiles").update({ avatar_url: null }).eq("id", userId);
      if (error) throw error;
      setAvatarUrl(null);
      toast({ title: "Photo supprimée" });
    } catch (e) {
      console.error(e);
      toast({ title: "Erreur", description: "Suppression impossible.", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-4 mb-6" {...getRootProps()}>
      <input {...getInputProps()} />
      <div className="relative">
        <Avatar className={`h-20 w-20 border-2 ${isDragActive ? "border-primary" : "border-border"}`}>
          <AvatarImage src={avatarUrl || undefined} alt="Ma photo de profil" className="object-cover" />
          <AvatarFallback className="text-xl font-semibold">
            {getInitials(firstName, lastName)}
          </AvatarFallback>
        </Avatar>
        <button
          type="button"
          onClick={open}
          disabled={uploading}
          aria-label="Changer ma photo de profil"
          className="absolute -bottom-1 -right-1 rounded-full bg-primary text-primary-foreground p-2 shadow-md hover:opacity-90 disabled:opacity-60"
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
        </button>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Ma photo de profil</p>
        <p className="text-xs text-muted-foreground">JPG, PNG, WebP — glissez ou cliquez sur l'appareil photo</p>
        <div className="flex gap-2">
          <Button type="button" size="sm" variant="outline" onClick={open} disabled={uploading}>
            Changer
          </Button>
          {avatarUrl && (
            <Button type="button" size="sm" variant="ghost" onClick={handleRemove} disabled={uploading}>
              <X className="h-4 w-4 mr-1" />
              Retirer
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
