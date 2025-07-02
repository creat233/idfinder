
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Send, Settings, Users } from "lucide-react";

export const AdminEmailSettings = () => {
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [testEmail, setTestEmail] = useState("");
  const [testSubject, setTestSubject] = useState("Test Email FinderID");
  const [testMessage, setTestMessage] = useState("Ceci est un email de test depuis l'administration FinderID.");
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleSendTestEmail = async () => {
    if (!testEmail.trim()) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez saisir une adresse email de test"
      });
      return;
    }

    setIsSending(true);
    try {
      const { error } = await supabase.functions.invoke('send-single-email', {
        body: {
          to: testEmail,
          subject: testSubject,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #3B82F6;">Test Email - FinderID</h2>
              <p>${testMessage}</p>
              <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e5e5;">
              <p style="color: #666; font-size: 12px;">
                Cet email a été envoyé depuis l'administration FinderID<br>
                Date: ${new Date().toLocaleString('fr-FR')}
              </p>
            </div>
          `
        }
      });

      if (error) throw error;

      toast({
        title: "Email envoyé !",
        description: `Email de test envoyé avec succès à ${testEmail}`
      });

      setTestEmail("");
    } catch (error: any) {
      console.error('Erreur envoi email:', error);
      toast({
        variant: "destructive",
        title: "Erreur d'envoi",
        description: error.message || "Impossible d'envoyer l'email de test"
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuration Email
          </CardTitle>
          <CardDescription>
            Gérez les paramètres d'envoi d'emails de l'application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="email-enabled"
              checked={emailEnabled}
              onCheckedChange={setEmailEnabled}
            />
            <Label htmlFor="email-enabled">
              Activer l'envoi d'emails automatiques
            </Label>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Statut du service email</Label>
              <div className={`px-3 py-2 rounded-lg text-sm font-medium ${
                emailEnabled 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {emailEnabled ? '✅ Activé' : '❌ Désactivé'}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Provider Email</Label>
              <div className="px-3 py-2 rounded-lg text-sm bg-blue-100 text-blue-800">
                📧 Resend.com
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Test d'envoi d'email
          </CardTitle>
          <CardDescription>
            Envoyez un email de test pour vérifier la configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="test-email">Email de destination</Label>
            <Input
              id="test-email"
              type="email"
              placeholder="test@example.com"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="test-subject">Sujet</Label>
            <Input
              id="test-subject"
              value={testSubject}
              onChange={(e) => setTestSubject(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="test-message">Message</Label>
            <Textarea
              id="test-message"
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              rows={3}
            />
          </div>
          
          <Button 
            onClick={handleSendTestEmail}
            disabled={isSending || !emailEnabled}
            className="w-full"
          >
            {isSending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Envoi en cours...
              </>
            ) : (
              <>
                <Mail className="h-4 w-4 mr-2" />
                Envoyer l'email de test
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Notifications automatiques
          </CardTitle>
          <CardDescription>
            Configuration des emails automatiques envoyés aux utilisateurs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium">Bienvenue nouveaux utilisateurs</h4>
                <p className="text-sm text-gray-600">Email envoyé lors de l'inscription</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium">Cartes trouvées</h4>
                <p className="text-sm text-gray-600">Notification quand une carte est signalée</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium">Codes promo activés</h4>
                <p className="text-sm text-gray-600">Confirmation d'activation des codes promo</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium">Renouvellement mCards</h4>
                <p className="text-sm text-gray-600">Rappels et confirmations d'abonnement</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
