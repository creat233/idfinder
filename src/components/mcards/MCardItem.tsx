
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Copy, Eye, ExternalLink, RotateCcw, Loader2 } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MCard } from "@/types/mcard";
import { useNavigate } from "react-router-dom";
import { URL_CONFIG } from "@/utils/urlConfig";
import { OnlineStatusIndicator } from "./OnlineStatusIndicator";
import { useUserPresence } from "@/hooks/useUserPresence";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

interface MCardItemProps {
  mcard: MCard;
  onEdit: (mcard: MCard) => void;
  onDelete: (id: string) => void;
  onStartUpgradeFlow: (id: string) => void;
}

const getInitials = (name: string): string => {
    if (!name) return "NN";
    const names = name.split(' ');
    const initials = names.map(n => n[0]).join('');
    return (initials.length > 2 ? initials.substring(0, 2) : initials).toUpperCase();
};

export const MCardItem = ({ mcard, onEdit, onDelete, onStartUpgradeFlow }: MCardItemProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [requestingReactivation, setRequestingReactivation] = useState(false);
  
  // Activer la présence pour cette carte
  useUserPresence(mcard.user_id);

  const handleReactivationRequest = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setRequestingReactivation(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = await supabase.from('profiles').select('phone').eq('id', user?.id || '').single();

      const { error } = await supabase.functions.invoke('send-reactivation-request', {
        body: {
          mcardId: mcard.id,
          mcardName: mcard.full_name,
          plan: mcard.plan,
          userEmail: user?.email,
          userPhone: profile?.phone,
          expirationDate: mcard.subscription_expires_at,
        }
      });
      if (error) throw error;

      await supabase.from('mcard_renewal_requests').insert({
        mcard_id: mcard.id,
        current_plan: mcard.plan,
        requested_at: new Date().toISOString(),
        status: 'pending'
      });

      toast({
        title: "✅ Demande envoyée !",
        description: "Votre demande de réactivation a été envoyée. Vous serez contacté sous peu.",
      });
    } catch (error) {
      console.error('Reactivation error:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'envoyer la demande. Réessayez.",
      });
    } finally {
      setRequestingReactivation(false);
    }
  };

  const handleCopyLink = () => {
    if (mcard.subscription_status === 'pending_payment') {
      toast({ 
        title: "Lien non disponible", 
        description: "Votre carte doit être activée par un administrateur avant de pouvoir partager le lien.",
        variant: "destructive"
      });
      return;
    }
    const url = URL_CONFIG.getMCardUrl(mcard.slug);
    navigator.clipboard.writeText(url);
    toast({ title: t('linkCopied') });
  };

  const handleViewCard = () => {
    // Pour le propriétaire, on navigue dans le même onglet pour accéder aux fonctionnalités de gestion
    navigate(`/mcard/${mcard.slug}`);
  };

  const getStatusVariant = (status: string | null): "default" | "secondary" | "destructive" => {
    switch (status) {
      case 'active':
        return 'default';
      case 'expired':
        return 'destructive';
      case 'trial':
      case 'pending_payment':
      default:
        return 'secondary';
    }
  }

  const getStatusText = (status: string | null): string => {
    switch (status) {
        case 'active': return t('active');
        case 'trial': return t('trial');
        case 'pending_payment': return 'Paiement en attente';
        case 'expired': return t('expired');
        default: return status || 'N/A';
    }
  }

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]" onClick={handleViewCard}>
      <CardHeader className="pb-3 sm:pb-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4">
          {/* Profil section - Responsive */}
          <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
            <Avatar className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 flex-shrink-0">
              <AvatarImage src={mcard.profile_picture_url || undefined} alt={mcard.full_name || 'Profile picture'} />
              <AvatarFallback className="text-sm sm:text-base">{getInitials(mcard.full_name || '')}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-sm sm:text-base lg:text-lg truncate">{mcard.full_name}</CardTitle>
              <CardDescription className="text-xs sm:text-sm truncate">
                {mcard.job_title}{mcard.company ? ` at ${mcard.company}` : ''}
              </CardDescription>
              <div className="mt-1">
                <OnlineStatusIndicator userId={mcard.user_id} showText={false} />
              </div>
            </div>
          </div>
          
          {/* Actions section - Responsive */}
          <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
            {/* Status Badge - Always visible */}
            <Badge variant={mcard.is_published ? "default" : "secondary"} className="text-xs whitespace-nowrap">
              {mcard.is_published ? t('isPublished') : t('draft')}
            </Badge>
            
            {/* Primary Action Button - Responsive */}
            <Button 
              variant="outline" 
              size="sm"
              className="text-xs sm:text-sm px-2 sm:px-3"
              onClick={(e) => {
                e.stopPropagation();
                handleViewCard();
              }}
            >
              <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
              <span className="hidden sm:inline">Voir la carte</span>
            </Button>
            
            {/* Menu dropdown */}
            <AlertDialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onSelect={(e) => {
                    e.preventDefault();
                    onEdit(mcard);
                  }}>
                    <Edit className="mr-2 h-4 w-4" />
                    Modifier
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onSelect={(e) => {
                      e.preventDefault();
                      handleCopyLink();
                    }}
                    disabled={mcard.subscription_status === 'pending_payment'}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copier le lien
                    {mcard.subscription_status === 'pending_payment' && ' (Indisponible)'}
                  </DropdownMenuItem>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem className="text-red-500" onSelect={(e) => e.preventDefault()}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Supprimer
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                </DropdownMenuContent>
              </DropdownMenu>
              <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                <AlertDialogHeader>
                  <AlertDialogTitle>Supprimer cette carte ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action est irréversible. Votre carte "{mcard.full_name}" sera définitivement supprimée.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Annuler</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(mcard.id);
                    }} 
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Supprimer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 pb-3 sm:pb-4">
        {/* Description - Responsive */}
        {mcard.description && (
          <p className="text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2 text-gray-600">{mcard.description}</p>
        )}
        
        {/* URL - Responsive */}
        <p className="text-xs text-muted-foreground truncate mb-2 sm:mb-3">
          <span className="font-medium">URL:</span> {URL_CONFIG.getMCardUrl(mcard.slug)}
        </p>
        
        {/* Warning for pending payment - Responsive */}
        {mcard.subscription_status === 'pending_payment' && (
          <div className="p-2 sm:p-3 bg-orange-50 border border-orange-200 rounded-md">
            <p className="text-xs sm:text-sm text-orange-800 leading-relaxed">
              ⏳ Votre carte est en attente d'activation. Vous pouvez la modifier mais ne pouvez pas encore partager le lien ou le QR code.
            </p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 pt-0">
        {/* Status and info section - Responsive */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-medium">{t('status')}:</span>
              <Badge variant={getStatusVariant(mcard.subscription_status)} className="text-xs">
                {getStatusText(mcard.subscription_status)}
              </Badge>
            </div>
            
            <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
              <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>{mcard.view_count ?? 0} {t('views') || 'vues'}</span>
            </div>
          </div>
          
          {/* Expiry date - Responsive */}
          {mcard.subscription_expires_at && (
            <p className="text-xs sm:text-sm text-muted-foreground">
              {t('expiresOn')} {format(new Date(mcard.subscription_expires_at), 'dd/MM/yyyy')}
            </p>
          )}
        </div>
        
        {/* Reactivation button for expired cards */}
        {mcard.subscription_status === 'expired' && (
          <Button 
            size="sm" 
            className="w-full sm:w-auto text-xs sm:text-sm bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white"
            onClick={handleReactivationRequest}
            disabled={requestingReactivation}
          >
            {requestingReactivation ? (
              <Loader2 className="h-3 w-3 animate-spin mr-1" />
            ) : (
              <RotateCcw className="h-3 w-3 mr-1" />
            )}
            {requestingReactivation ? 'Envoi...' : 'Demander la réactivation'}
          </Button>
        )}
        
        {/* Upgrade button - Responsive */}
        {mcard.subscription_status === 'trial' && (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full sm:w-auto text-xs sm:text-sm"
            onClick={(e) => {
              e.stopPropagation();
              onStartUpgradeFlow(mcard.id);
            }}
          >
            {t('upgradeSubscription')}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
