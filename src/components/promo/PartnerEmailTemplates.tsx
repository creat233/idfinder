
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Send, Users, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const PartnerEmailTemplates = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('clinic');
  const [emailContent, setEmailContent] = useState('');
  const [subject, setSubject] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const { toast } = useToast();

  const templates = [
    {
      id: 'clinic',
      name: 'Email Partenariat Clinique',
      icon: <Building className="h-5 w-5" />,
      subject: 'Partenariat FinderID - Opportunité de collaboration pour votre clinique',
      content: `Bonjour,

J'espère que ce message vous trouve en bonne santé.

Je me permets de vous contacter au nom de FinderID (www.finderid.info), une plateforme innovante qui révolutionne la récupération de documents perdus au Sénégal.

**Notre solution :**
• Système de récupération de documents perdus (CNI, permis, cartes vitales...)
• Plateforme sécurisée avec notifications automatiques
• Service déjà utilisé par plus de 500 utilisateurs
• Taux de récupération de 95%

**Opportunité de partenariat :**
Nous souhaitons établir un partenariat privilégié avec votre clinique pour :
- Faciliter la récupération des cartes vitales de vos patients
- Proposer un service VIP de récupération rapide
- Bénéficier d'une commission sur chaque récupération

**Avantages pour votre clinique :**
✓ Service gratuit pour vos patients
✓ Commission de 20% sur chaque récupération
✓ Support technique dédié
✓ Promotion de votre clinique sur notre plateforme

Seriez-vous disponible pour un rendez-vous cette semaine afin de discuter de cette opportunité ?

Cordialement,
L'équipe FinderID
📧 contact@finderid.info
📱 +221 XX XXX XX XX`
    },
    {
      id: 'business',
      name: 'Email Standard Entreprise',
      icon: <Users className="h-5 w-5" />,
      subject: 'Partenariat FinderID - Solution innovante de récupération de documents',
      content: `Bonjour,

Je vous contacte concernant une opportunité de partenariat avec FinderID.

**À propos de FinderID :**
FinderID est la première plateforme sénégalaise de récupération de documents perdus. Notre solution permet aux citoyens de récupérer rapidement leurs documents importants (CNI, permis de conduire, cartes professionnelles, etc.).

**Proposition de partenariat :**
Nous proposons à votre entreprise de devenir partenaire officiel pour :
- Offrir ce service à vos employés
- Bénéficier d'une commission sur les récupérations
- Promouvoir votre image d'entreprise responsable

**Bénéfices mutuels :**
• Revenus additionnels pour votre entreprise
• Service gratuit pour vos employés
• Renforcement de votre image RSE
• Support marketing inclus

Je serais ravi de vous présenter notre solution plus en détail.

Meilleures salutations,
L'équipe FinderID`
    }
  ];

  const currentTemplate = templates.find(t => t.id === selectedTemplate);

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setSubject(template.subject);
      setEmailContent(template.content);
    }
  };

  const handleSendEmail = () => {
    if (!recipientEmail || !subject || !emailContent) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez remplir tous les champs"
      });
      return;
    }

    // Simulate email sending
    toast({
      title: "Email envoyé !",
      description: `L'email a été envoyé à ${recipientEmail}`
    });

    // Reset form
    setRecipientEmail('');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Groupé & Partenariats
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Template Selection */}
          <div>
            <Label className="text-base font-medium mb-3 block">Choisir un modèle d'email</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((template) => (
                <Card 
                  key={template.id}
                  className={`cursor-pointer transition-all ${
                    selectedTemplate === template.id 
                      ? 'ring-2 ring-blue-500 bg-blue-50' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        {template.icon}
                      </div>
                      <div>
                        <h3 className="font-medium">{template.name}</h3>
                        <p className="text-sm text-gray-600">
                          {template.id === 'clinic' ? 'Pour les cliniques et centres de santé' : 'Pour les entreprises et organisations'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Email Form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="recipient">Email du destinataire</Label>
              <Input
                id="recipient"
                type="email"
                placeholder="partenaire@example.com"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="subject">Sujet</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="content">Contenu de l'email</Label>
              <Textarea
                id="content"
                rows={15}
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                className="font-mono text-sm"
              />
            </div>

            <Button 
              onClick={handleSendEmail}
              className="w-full"
              size="lg"
            >
              <Send className="h-4 w-4 mr-2" />
              Envoyer l'email
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
