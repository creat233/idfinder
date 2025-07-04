import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Send, Users, UserCheck } from "lucide-react";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
}

const emailTemplates: EmailTemplate[] = [
  {
    id: "welcome",
    name: "Email de bienvenue",
    subject: "🎉 Bienvenue sur FinderID !",
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 32px; font-weight: bold;">FinderID</h1>
          <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 18px;">Bienvenue dans la communauté !</p>
        </div>
        <div style="padding: 40px 20px;">
          <h2 style="color: #2d3748; margin: 0 0 20px 0;">Bonjour et bienvenue !</h2>
          <p style="color: #4a5568; line-height: 1.6; margin: 0 0 20px 0;">
            Nous sommes ravis de vous compter parmi nous sur FinderID, la plateforme qui révolutionne la récupération de documents perdus.
          </p>
          <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #2d3748; margin: 0 0 15px 0;">Que pouvez-vous faire maintenant ?</h3>
            <ul style="color: #4a5568; margin: 0; padding-left: 20px;">
              <li style="margin: 8px 0;">✅ Ajouter vos documents à votre profil</li>
              <li style="margin: 8px 0;">📱 Créer votre carte de visite digitale mCard</li>
              <li style="margin: 8px 0;">🔍 Signaler des documents trouvés</li>
              <li style="margin: 8px 0;">🤝 Rejoindre notre réseau d'entraide</li>
            </ul>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://finderid.info" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 25px; font-weight: bold; display: inline-block;">
              Commencer maintenant
            </a>
          </div>
        </div>
        <div style="background: #edf2f7; padding: 20px; text-align: center; color: #718096; font-size: 14px;">
          <p style="margin: 0;">© 2024 FinderID. Tous droits réservés.</p>
        </div>
      </div>
    `
  },
  {
    id: "mcard_activation",
    name: "Activation mCard",
    subject: "🎉 Votre carte mCard est activée !",
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 32px; font-weight: bold;">🎉 Félicitations !</h1>
          <p style="color: #d1fae5; margin: 10px 0 0 0; font-size: 18px;">Votre carte mCard est maintenant active</p>
        </div>
        <div style="padding: 40px 20px;">
          <h2 style="color: #2d3748; margin: 0 0 20px 0;">Votre carte est prête !</h2>
          <p style="color: #4a5568; line-height: 1.6; margin: 0 0 20px 0;">
            Excellente nouvelle ! Votre carte de visite digitale mCard a été activée avec succès par notre équipe.
          </p>
          <div style="background: #f0fff4; border: 2px solid #10b981; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #059669; margin: 0 0 15px 0;">✨ Fonctionnalités disponibles :</h3>
            <ul style="color: #065f46; margin: 0; padding-left: 20px;">
              <li style="margin: 8px 0;">📱 Partage via QR code et lien</li>
              <li style="margin: 8px 0;">📊 Statistiques de consultation</li>
              <li style="margin: 8px 0;">🎨 Personnalisation avancée</li>
              <li style="margin: 8px 0;">🔄 Mises à jour en temps réel</li>
            </ul>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://finderid.info/mcards" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 25px; font-weight: bold; display: inline-block;">
              Voir ma carte
            </a>
          </div>
        </div>
        <div style="background: #edf2f7; padding: 20px; text-align: center; color: #718096; font-size: 14px;">
          <p style="margin: 0;">© 2024 FinderID. Tous droits réservés.</p>
        </div>
      </div>
    `
  },
  {
    id: "custom",
    name: "Email personnalisé",
    subject: "",
    htmlContent: ""
  }
];

export const AdminEmailSender = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [recipient, setRecipient] = useState("");
  const [recipientType, setRecipientType] = useState<"single" | "all">("single");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = emailTemplates.find(t => t.id === templateId);
    if (template) {
      setSubject(template.subject);
      setContent(template.htmlContent);
    }
  };

  const handleSendEmail = async () => {
    if (!subject.trim() || !content.trim()) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le sujet et le contenu sont requis"
      });
      return;
    }

    if (recipientType === "single" && !recipient.trim()) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "L'adresse email du destinataire est requise"
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-admin-email', {
        body: {
          type: recipientType,
          recipient: recipientType === "single" ? recipient : null,
          subject: subject,
          htmlContent: content
        }
      });

      if (error) throw error;

      toast({
        title: "Email envoyé !",
        description: recipientType === "single" 
          ? `Email envoyé à ${recipient}` 
          : "Email envoyé à tous les utilisateurs"
      });

      // Reset form
      setSelectedTemplate("");
      setSubject("");
      setContent("");
      setRecipient("");
    } catch (error: any) {
      console.error('Erreur envoi email:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Erreur lors de l'envoi de l'email"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Envoi d'emails HTML
          </CardTitle>
          <CardDescription>
            Envoyez des emails personnalisés aux utilisateurs de l'application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Type de destinataire */}
          <div className="space-y-2">
            <Label>Type d'envoi</Label>
            <div className="flex gap-4">
              <Button
                variant={recipientType === "single" ? "default" : "outline"}
                onClick={() => setRecipientType("single")}
                className="flex items-center gap-2"
              >
                <UserCheck className="h-4 w-4" />
                Utilisateur unique
              </Button>
              <Button
                variant={recipientType === "all" ? "default" : "outline"}
                onClick={() => setRecipientType("all")}
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                Tous les utilisateurs
              </Button>
            </div>
          </div>

          {/* Destinataire pour envoi unique */}
          {recipientType === "single" && (
            <div className="space-y-2">
              <Label htmlFor="recipient">Email du destinataire</Label>
              <Input
                id="recipient"
                type="email"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="utilisateur@exemple.com"
              />
            </div>
          )}

          {/* Modèles d'email */}
          <div className="space-y-2">
            <Label>Modèle d'email</Label>
            <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir un modèle..." />
              </SelectTrigger>
              <SelectContent>
                {emailTemplates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sujet */}
          <div className="space-y-2">
            <Label htmlFor="subject">Sujet de l'email</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Sujet de votre email..."
            />
          </div>

          {/* Contenu HTML */}
          <div className="space-y-2">
            <Label htmlFor="content">Contenu HTML</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Contenu HTML de votre email..."
              rows={15}
              className="font-mono text-sm"
            />
          </div>

          {/* Aperçu */}
          {content && (
            <div className="space-y-2">
              <Label>Aperçu de l'email</Label>
              <div className="border rounded-lg p-4 bg-gray-50 max-h-64 overflow-y-auto">
                <div dangerouslySetInnerHTML={{ __html: content }} />
              </div>
            </div>
          )}

          {/* Bouton d'envoi */}
          <Button 
            onClick={handleSendEmail} 
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Envoi en cours...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                {recipientType === "single" ? "Envoyer l'email" : "Envoyer à tous"}
              </div>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};