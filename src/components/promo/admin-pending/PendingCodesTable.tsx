
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Gift, Mail, User, Phone, MessageCircle, PhoneCall } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { PromoCodeData } from "@/types/promo";

interface PendingCodesTableProps {
  codes: PromoCodeData[];
  activating: string | null;
  onActivateCode: (code: string) => void;
}

export const PendingCodesTable = ({ codes, activating, onActivateCode }: PendingCodesTableProps) => {
  const handleWhatsAppClick = (phone: string, userName: string, promoCode: string) => {
    if (phone === "Non renseigné" || !phone) {
      return;
    }
    
    // Nettoyer le numéro de téléphone (enlever espaces, tirets, etc.)
    const cleanPhone = phone.replace(/[\s-]/g, '');
    
    // Message personnalisé pour informer de l'activation du code
    const message = `🎉 Félicitations ${userName}!\n\nVotre code promo ${promoCode} a été ACTIVÉ avec succès !\n\n💰 Vous pouvez maintenant gagner 1000 FCFA à chaque fois que quelqu'un utilise votre code promo pendant 2 mois.\n\n🎁 Les utilisateurs auront une réduction de 1000 FCFA (6000 FCFA au lieu de 7000 FCFA) grâce à votre code.\n\n📱 PARTAGEZ VOTRE CODE MAINTENANT :\n• Sur Facebook, Instagram, TikTok\n• Dans vos groupes WhatsApp\n• Avec vos amis et famille\n• Sur vos réseaux sociaux\n\nPlus vous partagez, plus vous gagnez !\n\n- Équipe FinderID`;
    
    // Encoder le message pour l'URL
    const encodedMessage = encodeURIComponent(message);
    
    // Créer le lien WhatsApp
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
    
    // Ouvrir WhatsApp
    window.open(whatsappUrl, '_blank');
  };

  const handleDirectCall = (phone: string) => {
    if (phone === "Non renseigné" || !phone) {
      return;
    }
    
    // Nettoyer le numéro de téléphone
    const cleanPhone = phone.replace(/[\s-]/g, '');
    
    // Créer le lien tel: pour appeler directement
    window.location.href = `tel:${cleanPhone}`;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Code Promo</TableHead>
          <TableHead>Utilisateur</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Téléphone</TableHead>
          <TableHead>Date de Création</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {codes.map((code) => (
          <TableRow key={code.id}>
            <TableCell>
              <div className="flex items-center gap-2">
                <Gift className="h-4 w-4 text-orange-600" />
                <span className="font-mono font-semibold text-lg">{code.code}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span className="font-medium">{code.user_name}</span>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-sm">
                  <Mail className="h-3 w-3" />
                  <a 
                    href={`mailto:${code.user_email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {code.user_email}
                  </a>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1 text-sm">
                <Phone className="h-3 w-3" />
                {code.user_phone === "Non renseigné" || !code.user_phone ? (
                  <span className="text-muted-foreground italic">
                    {code.user_phone || "Non renseigné"}
                  </span>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleWhatsAppClick(code.user_phone!, code.user_name!, code.code)}
                      className="flex items-center gap-1 text-green-600 hover:text-green-800 hover:underline cursor-pointer transition-colors"
                      title="Envoyer un message WhatsApp"
                    >
                      <MessageCircle className="h-3 w-3" />
                      <span>{code.user_phone}</span>
                    </button>
                    <button
                      onClick={() => handleDirectCall(code.user_phone!)}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline cursor-pointer transition-colors ml-2"
                      title="Appeler directement"
                    >
                      <PhoneCall className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            </TableCell>
            <TableCell>
              {format(new Date(code.created_at), "dd/MM/yyyy à HH:mm", { locale: fr })}
            </TableCell>
            <TableCell>
              <div className="flex flex-col gap-1">
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                  En attente
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Généré automatiquement
                </span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  onClick={() => onActivateCode(code.code)}
                  disabled={activating === code.code}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {activating === code.code ? "Activation..." : "Valider"}
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
