import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Loader2, Megaphone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const AdminUpdateBroadcast = () => {
  const { toast } = useToast();
  const [version, setVersion] = useState("");
  const [apkUrl, setApkUrl] = useState(
    "https://github.com/finderid-app/finderid/raw/main/mise-a-jour/finderid-latest.apk"
  );
  const [loading, setLoading] = useState(false);

  const broadcast = async () => {
    if (!confirm("Envoyer une notification de mise à jour à TOUS les utilisateurs ?")) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("broadcast-app-update", {
        body: { version: version || undefined, apk_url: apkUrl || undefined },
      });
      if (error) throw error;
      toast({
        title: "✅ Notifications envoyées",
        description: `${(data as any)?.notified ?? 0} utilisateurs notifiés.`,
      });
    } catch (e: any) {
      toast({
        title: "❌ Erreur",
        description: e?.message ?? "Impossible d'envoyer les notifications.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Megaphone className="h-5 w-5 text-purple-600" />
          Notifier une mise à jour APK
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="apk-version">Version (facultatif)</Label>
          <Input
            id="apk-version"
            placeholder="ex: 2.4.0"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="apk-url">Lien APK (dossier GitHub /mise-a-jour/)</Label>
          <Input
            id="apk-url"
            value={apkUrl}
            onChange={(e) => setApkUrl(e.target.value)}
          />
        </div>
        <Button
          onClick={broadcast}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          Envoyer la notification à tous les utilisateurs
        </Button>
        <p className="text-xs text-muted-foreground">
          Chaque utilisateur recevra une notification cliquable qui télécharge directement l'APK.
        </p>
      </CardContent>
    </Card>
  );
};
