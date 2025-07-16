import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Mail, Users, Gift, Clock, CheckCircle, Target, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export const InfluencerEmailTemplate = () => {
  const [recipientEmail, setRecipientEmail] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const { toast } = useToast();

  const emailTemplate = `
Objet: 🎯 Partenariat Exclusif FinderID - Code Promo Influenceur

Bonjour,

Nous espérons que vous allez bien ! 

L'équipe FinderID a le plaisir de vous proposer un partenariat exclusif en tant qu'influenceur pour promouvoir notre service de récupération de documents perdus.

🎁 **VOTRE CODE PROMO EXCLUSIF**
• Code promo valide pendant 2 mois
• Vos gains : 1000 FCFA par utilisation de votre code
• Potentiel de revenus illimité selon votre portée

💰 **AVANTAGES POUR VOS ABONNÉS**
• Réduction de 1000 FCFA sur les frais de récupération
• Prix préférentiel : 4000 FCFA au lieu de 5000 FCFA
• Service professionnel et sécurisé
• Récupération rapide des documents

🚀 **POURQUOI FINDRID ?**
• Leader de la récupération de documents au Sénégal
• Plus de 5000 utilisateurs actifs
• Système de récompenses attractif
• Plateforme sécurisée et fiable

📊 **VOTRE POTENTIEL DE REVENUS**
• 10 utilisations = 10 000 FCFA
• 50 utilisations = 50 000 FCFA
• 100 utilisations = 100 000 FCFA
• Paiement garanti après confirmation

🎯 **COMMENT ÇA MARCHE**
1. Vous recevez votre code promo personnalisé
2. Vous partagez sur vos réseaux sociaux
3. Vos abonnés utilisent votre code
4. Vous recevez 1000 FCFA par utilisation
5. Paiement mensuel sécurisé

📱 **SUPPORT & ACCOMPAGNEMENT**
• Visuels professionnels fournis
• Scripts de publication optimisés
• Support technique dédié
• Suivi des performances en temps réel

💳 **AVANTAGES POUR LES UTILISATEURS**
• Économie de 1000 FCFA sur chaque récupération
• Service client prioritaire
• Garantie de récupération
• Processus simplifié et rapide

🔥 **OFFRE LIMITÉE**
Cette proposition est réservée aux influenceurs sélectionnés et valable pendant 2 mois seulement.

Intéressé(e) ? Répondez à cet email avec :
• Vos statistiques de followers
• Vos réseaux sociaux principaux
• Votre niche d'audience

Nous vous enverrons votre code promo personnalisé dans les 24h !

Cordialement,
L'équipe FinderID

---
💼 FinderID - Récupération de documents perdus
🌐 www.finderid.info
📧 contact@finderid.info
📱 +221 XX XXX XX XX
  `.trim();

  const handleCopyEmail = () => {
    const fullEmail = customMessage ? `${customMessage}\n\n${emailTemplate}` : emailTemplate;
    navigator.clipboard.writeText(fullEmail);
    toast({
      title: "Email copié !",
      description: "Le contenu de l'email a été copié dans le presse-papiers.",
    });
  };

  const handleSendEmail = () => {
    const subject = encodeURIComponent("🎯 Partenariat Exclusif FinderID - Code Promo Influenceur");
    const body = encodeURIComponent(customMessage ? `${customMessage}\n\n${emailTemplate}` : emailTemplate);
    const mailtoLink = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
    window.open(mailtoLink);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Template pour Influenceurs
          </CardTitle>
          <CardDescription>
            Modèle d'email pour proposer un partenariat avec code promo aux influenceurs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <div className="font-semibold">Audience Ciblée</div>
              <div className="text-sm text-gray-600">Influenceurs actifs</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Gift className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <div className="font-semibold">Récompense</div>
              <div className="text-sm text-gray-600">1000 FCFA / utilisation</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Clock className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <div className="font-semibold">Durée</div>
              <div className="text-sm text-gray-600">2 mois</div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="recipient">Email du destinataire</Label>
              <Input
                id="recipient"
                type="email"
                placeholder="influenceur@exemple.com"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="custom-message">Message personnalisé (optionnel)</Label>
              <Textarea
                id="custom-message"
                placeholder="Ajoutez un message personnalisé avant le template principal..."
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={handleCopyEmail} variant="outline" className="flex-1">
              <Copy className="h-4 w-4 mr-2" />
              Copier l'email
            </Button>
            <Button 
              onClick={handleSendEmail} 
              disabled={!recipientEmail}
              className="flex-1"
            >
              <Mail className="h-4 w-4 mr-2" />
              Envoyer l'email
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Aperçu du Template
          </CardTitle>
          <CardDescription>
            Voici le contenu de l'email qui sera envoyé aux influenceurs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                <CheckCircle className="h-3 w-3 mr-1" />
                Récompenses attractives
              </Badge>
              <Badge variant="secondary">
                <TrendingUp className="h-3 w-3 mr-1" />
                Potentiel de revenus
              </Badge>
              <Badge variant="secondary">
                <Gift className="h-3 w-3 mr-1" />
                Avantages utilisateurs
              </Badge>
              <Badge variant="secondary">
                <Clock className="h-3 w-3 mr-1" />
                Durée limitée
              </Badge>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                {customMessage && (
                  <div className="bg-blue-50 p-2 rounded mb-4 border-l-2 border-blue-400">
                    <strong>Message personnalisé:</strong><br />
                    {customMessage}
                  </div>
                )}
                {emailTemplate}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};