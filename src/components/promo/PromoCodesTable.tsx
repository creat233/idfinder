
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Eye, Phone, MessageCircle, PhoneCall } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { PromoCodeData } from "@/types/promo";

interface PromoCodesTableProps {
  promoCodes: PromoCodeData[];
}

export const PromoCodesTable = ({ promoCodes }: PromoCodesTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCodes = promoCodes.filter(code =>
    code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    code.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    code.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    code.user_phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleWhatsAppClick = (phone: string, userName: string, promoCode: string, isActive: boolean) => {
    if (phone === "Non renseigné" || !phone) {
      return;
    }
    
    // Nettoyer le numéro de téléphone (enlever espaces, tirets, etc.)
    const cleanPhone = phone.replace(/[\s-]/g, '');
    
    // Message différent selon le statut du code
    let message = '';
    if (isActive) {
      message = `🎉 Bonjour ${userName}!\n\nVotre code promo ${promoCode} est ACTIF !\n\n💰 Vous gagnez 1000 FCFA à chaque fois que quelqu'un utilise votre code promo pendant 2 mois.\n\n🎁 Les utilisateurs ont une réduction de 1000 FCFA (6000 FCFA au lieu de 7000 FCFA) grâce à votre code.\n\n📱 PARTAGEZ VOTRE CODE MAINTENANT :\n• Postez sur Facebook, Instagram, TikTok\n• Envoyez dans vos groupes WhatsApp\n• Partagez avec vos amis et votre famille\n• Publiez sur tous vos réseaux sociaux\n\n🚀 Plus vous partagez, plus vous gagnez !\n\nContinuez à partager votre code !\n\n- Équipe FinderID`;
    } else {
      message = `📋 Bonjour ${userName}!\n\nVotre code promo ${promoCode} est en cours de traitement.\n\n⏰ Notre équipe examine votre demande. Une fois validé, vous pourrez gagner 1000 FCFA à chaque utilisation pendant 2 mois.\n\n📱 Dès l'activation, vous pourrez partager votre code :\n• Sur Facebook, Instagram, TikTok\n• Dans vos groupes WhatsApp\n• Avec vos proches et amis\n• Sur tous vos réseaux sociaux\n\nNous vous tiendrons informé !\n\n- Équipe FinderID`;
    }
    
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Tous les codes promo
        </CardTitle>
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          <Input
            placeholder="Rechercher par code, email, nom ou téléphone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Utilisateur</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Utilisations</TableHead>
              <TableHead>Gains</TableHead>
              <TableHead>Créé le</TableHead>
              <TableHead>Expire le</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCodes.map((code) => (
              <TableRow key={code.id}>
                <TableCell className="font-mono font-semibold">{code.code}</TableCell>
                <TableCell>{code.user_name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{code.user_email}</TableCell>
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
                          onClick={() => handleWhatsAppClick(code.user_phone!, code.user_name!, code.code, code.is_active)}
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
                  <div className="flex gap-1">
                    <Badge variant={code.is_active ? "default" : "secondary"}>
                      {code.is_active ? "Actif" : "Inactif"}
                    </Badge>
                    {code.is_paid && (
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Payé
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>{code.usage_count}</TableCell>
                <TableCell>{code.total_earnings} FCFA</TableCell>
                <TableCell>
                  {format(new Date(code.created_at), "dd/MM/yyyy", { locale: fr })}
                </TableCell>
                <TableCell>
                  {format(new Date(code.expires_at), "dd/MM/yyyy", { locale: fr })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {filteredCodes.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm ? "Aucun code ne correspond à votre recherche" : "Aucun code promo trouvé"}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
