
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Eye, User, Mail, Phone } from "lucide-react";

interface PendingMCard {
  id: string;
  user_id: string;
  full_name: string;
  plan: string;
  created_at: string;
  user_email: string;
  user_phone: string;
  slug: string;
}

interface AdminPendingMCardsItemProps {
  mcard: PendingMCard;
  planInfo: { price: number; name: string } | undefined;
  loading: string | null;
  onApprove: (mcardId: string) => void;
  onPreview: (slug: string) => void;
}

export const AdminPendingMCardsItem = ({
  mcard,
  planInfo,
  loading,
  onApprove,
  onPreview
}: AdminPendingMCardsItemProps) => {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-full">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{mcard.full_name}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                {mcard.user_email}
              </div>
              {mcard.user_phone && (
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  {mcard.user_phone}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary">
              Plan {planInfo?.name || mcard.plan}
            </Badge>
            {planInfo && (
              <Badge variant="outline" className="text-green-600 border-green-600">
                {planInfo.price.toLocaleString()} FCFA
              </Badge>
            )}
          </div>
          <p className="text-xs text-gray-500">
            Créée le {new Date(mcard.created_at).toLocaleDateString('fr-FR')}
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => onPreview(mcard.slug)}
          className="text-blue-600 border-blue-600 hover:bg-blue-50"
        >
          <Eye className="h-4 w-4 mr-2" />
          Prévisualiser
        </Button>
        <Button
          onClick={() => onApprove(mcard.id)}
          disabled={loading === mcard.id}
          className="bg-green-600 hover:bg-green-700"
        >
          {loading === mcard.id ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Activation...
            </div>
          ) : (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Approuver ({planInfo?.price.toLocaleString()} FCFA)
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
