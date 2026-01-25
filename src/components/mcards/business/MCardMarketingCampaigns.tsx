import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Megaphone, 
  Plus, 
  Send, 
  Clock, 
  Users, 
  Eye, 
  MousePointer,
  Loader2,
  Trash2,
  Edit,
  Gift,
  Bell,
  Calendar,
  MessageSquare
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Campaign {
  id: string;
  title: string;
  message: string;
  campaign_type: string;
  status: string;
  scheduled_at: string | null;
  sent_at: string | null;
  recipients_count: number;
  opened_count: number;
  clicked_count: number;
  created_at: string;
}

interface MCardMarketingCampaignsProps {
  mcardId: string;
}

const campaignTypeIcons: Record<string, React.ReactNode> = {
  promotion: <Gift className="h-4 w-4" />,
  announcement: <Bell className="h-4 w-4" />,
  event: <Calendar className="h-4 w-4" />,
  reminder: <MessageSquare className="h-4 w-4" />
};

const campaignTypeLabels: Record<string, string> = {
  promotion: "Promotion",
  announcement: "Annonce",
  event: "Événement",
  reminder: "Rappel"
};

const statusColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  scheduled: "bg-blue-500/20 text-blue-600",
  sent: "bg-green-500/20 text-green-600",
  cancelled: "bg-red-500/20 text-red-600"
};

const statusLabels: Record<string, string> = {
  draft: "Brouillon",
  scheduled: "Programmée",
  sent: "Envoyée",
  cancelled: "Annulée"
};

export const MCardMarketingCampaigns = ({ mcardId }: MCardMarketingCampaignsProps) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    campaign_type: "promotion"
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchCampaigns();
    fetchFavoritesCount();
  }, [mcardId]);

  const fetchCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from("mcard_marketing_campaigns")
        .select("*")
        .eq("mcard_id", mcardId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error) {
      console.error("Erreur chargement campagnes:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavoritesCount = async () => {
    try {
      const { count, error } = await supabase
        .from("mcard_favorites")
        .select("*", { count: "exact", head: true })
        .eq("mcard_id", mcardId);

      if (error) throw error;
      setFavoritesCount(count || 0);
    } catch (error) {
      console.error("Erreur comptage favoris:", error);
    }
  };

  const createCampaign = async () => {
    if (!formData.title.trim() || !formData.message.trim()) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir le titre et le message",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("mcard_marketing_campaigns")
        .insert({
          mcard_id: mcardId,
          title: formData.title,
          message: formData.message,
          campaign_type: formData.campaign_type
        });

      if (error) throw error;

      toast({
        title: "Campagne créée",
        description: "Votre campagne a été créée avec succès"
      });

      setFormData({ title: "", message: "", campaign_type: "promotion" });
      setIsDialogOpen(false);
      fetchCampaigns();
    } catch (error) {
      console.error("Erreur création campagne:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la campagne",
        variant: "destructive"
      });
    }
  };

  const sendCampaign = async (campaign: Campaign) => {
    if (favoritesCount === 0) {
      toast({
        title: "Aucun destinataire",
        description: "Personne n'a encore favorisé votre MCard",
        variant: "destructive"
      });
      return;
    }

    setSending(campaign.id);
    try {
      const { data, error } = await supabase.functions.invoke("send-marketing-campaign", {
        body: {
          campaignId: campaign.id,
          mcardId: mcardId
        }
      });

      if (error) throw error;

      toast({
        title: "Campagne envoyée ! 🎉",
        description: `${data.recipientCount} emails envoyés avec succès`
      });

      fetchCampaigns();
    } catch (error) {
      console.error("Erreur envoi campagne:", error);
      toast({
        title: "Erreur d'envoi",
        description: "Impossible d'envoyer la campagne",
        variant: "destructive"
      });
    } finally {
      setSending(null);
    }
  };

  const deleteCampaign = async (campaignId: string) => {
    try {
      const { error } = await supabase
        .from("mcard_marketing_campaigns")
        .delete()
        .eq("id", campaignId);

      if (error) throw error;

      toast({
        title: "Campagne supprimée",
        description: "La campagne a été supprimée"
      });

      fetchCampaigns();
    } catch (error) {
      console.error("Erreur suppression:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la campagne",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Megaphone className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Campagnes Marketing</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {favoritesCount} favoris
          </Badge>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Nouvelle
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Créer une campagne</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium">Type de campagne</label>
                  <Select 
                    value={formData.campaign_type} 
                    onValueChange={(value) => setFormData({ ...formData, campaign_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="promotion">
                        <div className="flex items-center gap-2">
                          <Gift className="h-4 w-4" />
                          Promotion
                        </div>
                      </SelectItem>
                      <SelectItem value="announcement">
                        <div className="flex items-center gap-2">
                          <Bell className="h-4 w-4" />
                          Annonce
                        </div>
                      </SelectItem>
                      <SelectItem value="event">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Événement
                        </div>
                      </SelectItem>
                      <SelectItem value="reminder">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          Rappel
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Titre</label>
                  <Input
                    placeholder="Ex: -20% sur tous nos services !"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Message</label>
                  <Textarea
                    placeholder="Décrivez votre offre en détail..."
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={createCampaign}>
                    Créer la campagne
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {campaigns.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Megaphone className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Aucune campagne créée</p>
            <p className="text-sm">Créez votre première campagne pour toucher vos {favoritesCount} fans !</p>
          </div>
        ) : (
          <div className="space-y-3">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {campaignTypeIcons[campaign.campaign_type]}
                      <span className="font-medium truncate">{campaign.title}</span>
                      <Badge className={statusColors[campaign.status]}>
                        {statusLabels[campaign.status]}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {campaign.message}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {format(new Date(campaign.created_at), "dd MMM yyyy", { locale: fr })}
                      </span>
                      {campaign.status === "sent" && (
                        <>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {campaign.recipients_count} envoyés
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {campaign.opened_count} ouverts
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {campaign.status === "draft" && (
                      <>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => sendCampaign(campaign)}
                          disabled={sending === campaign.id || favoritesCount === 0}
                        >
                          {sending === campaign.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-1" />
                              Envoyer
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteCampaign(campaign.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
