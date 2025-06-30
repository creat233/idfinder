
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Eye, User, Mail, Phone, CreditCard } from "lucide-react";

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
    <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow bg-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <User className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-xl text-gray-900">{mcard.full_name}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
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
            <div className="text-sm text-blue-600 font-mono mt-2 bg-blue-50 px-2 py-1 rounded">
              /mcard/{mcard.slug}
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Plan {planInfo?.name || mcard.plan}
            </Badge>
            {planInfo && (
              <Badge variant="outline" className="text-green-600 border-green-600 bg-green-50">
                {planInfo.price.toLocaleString()} FCFA
              </Badge>
            )}
          </div>
          <p className="text-xs text-gray-500">
            Créée le {new Date(mcard.created_at).toLocaleDateString('fr-FR')}
          </p>
          <Badge variant="outline" className="text-orange-600 border-orange-600 bg-orange-50 mt-1">
            Paiement en attente
          </Badge>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
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
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          {loading === mcard.id ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Activation...
            </div>
          ) : (
            <>
              <CreditCard className="h-4 w-4 mr-2" />
              Confirmer paiement ({planInfo?.price.toLocaleString()} FCFA)
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
