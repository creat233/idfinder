import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Copy, Eye } from "lucide-react";
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

  const handleCopyLink = () => {
    // Note: This link won't work until routing for public mCards is set up.
    const url = `${window.location.origin}/m/${mcard.slug}`;
    navigator.clipboard.writeText(url);
    toast({ title: t('linkCopied') });
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
        case 'pending_payment': return t('pendingPayment');
        case 'expired': return t('expired');
        default: return status || 'N/A';
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div className="flex items-center gap-4 flex-1">
                <Avatar className="h-16 w-16">
                    <AvatarImage src={mcard.profile_picture_url || undefined} alt={mcard.full_name || 'Profile picture'} />
                    <AvatarFallback>{getInitials(mcard.full_name || '')}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <CardTitle>{mcard.full_name}</CardTitle>
                    <CardDescription>{mcard.job_title} at {mcard.company}</CardDescription>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Badge variant={mcard.is_published ? "default" : "secondary"}>
                    {mcard.is_published ? t('isPublished') : t('draft')}
                </Badge>
                <AlertDialog>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onSelect={() => onEdit(mcard)}>
                                <Edit className="mr-2 h-4 w-4" />
                                {t('edit')}
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={handleCopyLink}>
                                <Copy className="mr-2 h-4 w-4" />
                                {t('copyLink')}
                            </DropdownMenuItem>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem className="text-red-500">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    {t('delete')}
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>{t('deleteMCard')}</AlertDialogTitle>
                        <AlertDialogDescription>{t('deleteMCardConfirmation')}</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDelete(mcard.id)} className="bg-destructive hover:bg-destructive/90">{t('delete')}</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        {mcard.description && <p className="text-sm mb-2">{mcard.description}</p>}
        <p className="text-sm text-muted-foreground">URL: /m/{mcard.slug}</p>
      </CardContent>
      <CardFooter className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{t('status')}:</span>
                <Badge variant={getStatusVariant(mcard.subscription_status)}>
                {getStatusText(mcard.subscription_status)}
                </Badge>
            </div>
            {mcard.subscription_expires_at && (
                <p className="text-sm text-muted-foreground">
                    {t('expiresOn')} {format(new Date(mcard.subscription_expires_at), 'dd/MM/yyyy')}
                </p>
            )}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Eye className="h-4 w-4" />
              <span>{mcard.view_count ?? 0} {t('views') || 'vues'}</span>
            </div>
        </div>
        {(mcard.subscription_status === 'trial' || mcard.subscription_status === 'expired') && (
            <Button variant="outline" size="sm" onClick={() => onStartUpgradeFlow(mcard.id)}>{t('upgradeSubscription')}</Button>
        )}
      </CardFooter>
    </Card>
  );
};
