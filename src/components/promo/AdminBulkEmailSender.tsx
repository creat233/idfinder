
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { EmailTemplateSelector } from "./EmailTemplateSelector";
import { templateList } from "./email-templates/template-list";
import { Send, Users, Building2 } from "lucide-react";

export const AdminBulkEmailSender = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const { toast } = useToast();

  const handleTemplateSelect = (templateId: string) => {
    const template = templateList.find(t => t.id === templateId);
    if (template) {
      setSubject(template.template.subject);
      setMessage(template.template.message);
      setSelectedTemplate(templateId);
    }
  };

  const sendBulkEmail = async () => {
    if (!subject.trim() || !message.trim()) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires"
      });
      return;
    }

    try {
      setLoading(true);
      
      const { error } = await supabase.functions.invoke('send-bulk-email', {
        body: {
          subject,
          message,
          template_type: selectedTemplate || 'custom'
        }
      });

      if (error) throw error;

      toast({
        title: "Emails envoyés !",
        description: "L'email groupé a été envoyé à tous les utilisateurs"
      });

      // Reset form
      setSubject("");
      setMessage("");
      setSelectedTemplate("");
    } catch (error: any) {
      console.error('Error sending bulk email:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Impossible d'envoyer l'email groupé"
      });
    } finally {
      setLoading(false);
    }
  };

  // Modèles d'emails pour les partenariats publicitaires
  const advertisingTemplates = [
    {
      id: "clinic_partnership",
      name: "Partenariat Clinique",
      subject: "Partenariat publicitaire avec FinderID - Clinique Medic'kane",
      content: `Bonjour,

Nous espérons que vous allez bien. FinderID est une plateforme innovante qui aide les gens à retrouver leurs documents perdus, avec plus de 10 000 utilisateurs actifs au Sénégal.

🏥 OPPORTUNITÉ DE PARTENARIAT PUBLICITAIRE

Nous proposons à votre clinique Medic'kane de devenir notre partenaire publicitaire officiel. Voici notre offre :

📊 FORMULES PUBLICITAIRES :

🥉 FORMULE BRONZE (50 000 FCFA/mois)
- Affichage sur page d'accueil (zone secondaire)
- 30 000 impressions garanties
- Logo + message court (50 caractères)
- Durée : 1 mois

🥈 FORMULE ARGENT (100 000 FCFA/mois)  
- Affichage prioritaire page d'accueil
- 60 000 impressions garanties
- Logo + description complète (150 caractères)
- Lien vers votre site web
- Durée : 1 mois

🥇 FORMULE OR (180 000 FCFA/3 mois)
- Affichage premium toutes les pages
- 200 000 impressions garanties
- Logo + description détaillée + images
- Lien site web + numéro de contact
- Durée : 3 mois
- Promotion sur nos réseaux sociaux

📍 ZONES D'AFFICHAGE :
- Page d'accueil (trafic principal)
- Page de recherche de cartes
- Page des notifications utilisateurs
- Application mobile (bientôt disponible)

💼 AVANTAGES POUR VOTRE CLINIQUE :
✅ Visibilité auprès de 10 000+ utilisateurs actifs
✅ Ciblage géographique (Sénégal)
✅ Audience intéressée par les services de santé
✅ Tarifs très compétitifs
✅ Rapport mensuel de performance

Pour voir exactement où votre publicité apparaîtra, visitez : https://finderid.info

📞 NEXT STEPS :
Si cette opportunité vous intéresse, répondez à cet email ou contactez-nous :
- Email : contact@finderid.info
- Tél : +221 XX XXX XX XX

Nous serions ravis de discuter des détails et de personnaliser l'offre selon vos besoins.

Cordialement,
L'équipe FinderID`
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Email Groupé & Partenariats
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Button 
            variant="outline" 
            className="h-20 flex flex-col items-center gap-2"
            onClick={() => handleTemplateSelect("clinic_partnership")}
          >
            <Building2 className="h-6 w-6" />
            <span className="text-sm">Email Partenariat Clinique</span>
          </Button>
          <div className="flex flex-col items-center justify-center p-4 border rounded-lg bg-gray-50">
            <Users className="h-6 w-6 text-gray-500 mb-2" />
            <span className="text-sm text-gray-600">Email Standard</span>
          </div>
        </div>

        <EmailTemplateSelector onTemplateSelect={handleTemplateSelect} />
        
        <div className="space-y-2">
          <Label htmlFor="subject">Sujet de l'email *</Label>
          <Input
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Objet de votre email..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Message *</Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Contenu de votre email..."
            rows={12}
            className="min-h-[300px]"
          />
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">💡 Conseils pour les partenariats :</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Définissez clairement les prix et la durée</li>
            <li>• Montrez les emplacements d'affichage (captures d'écran)</li>
            <li>• Proposez plusieurs formules (Bronze, Argent, Or)</li>
            <li>• Incluez les statistiques de trafic</li>
            <li>• Ajoutez vos contacts pour faciliter la réponse</li>
          </ul>
        </div>

        <Button 
          onClick={sendBulkEmail} 
          disabled={loading || !subject.trim() || !message.trim()}
          className="w-full"
        >
          <Send className="h-4 w-4 mr-2" />
          {loading ? "Envoi en cours..." : "Envoyer à tous les utilisateurs"}
        </Button>
      </CardContent>
    </Card>
  );
};
