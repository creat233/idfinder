
import { MCardShareDialog } from '@/components/mcards/MCardShareDialog';
import { MCardViewHeader } from '@/components/mcards/view/MCardViewHeader';
import { MCardViewQRSection } from '@/components/mcards/view/MCardViewQRSection';
import { MCardViewProfile } from '@/components/mcards/view/MCardViewProfile';
import { MCardViewProducts } from '@/components/mcards/view/MCardViewProducts';
import { MCardViewStatuses } from '@/components/mcards/view/MCardViewStatuses';
import { MCardViewReviews } from '@/components/mcards/view/MCardViewReviews';
import { MCardViewCustomization } from '@/components/mcards/view/MCardViewCustomization';
import { MCardViewLoading } from '@/components/mcards/view/MCardViewLoading';
import { MCardViewNotFound } from '@/components/mcards/view/MCardViewNotFound';
import { MCardPhysicalProducts } from '@/components/mcards/view/MCardPhysicalProducts';
import { MCardComplianceWarning } from '@/components/mcards/MCardComplianceWarning';
import { MCardCustomized } from '@/components/mcards/MCardCustomized';
import { useMCardView } from '@/hooks/useMCardView';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { URL_CONFIG } from '@/utils/urlConfig';

const MCardView = () => {
  const {
    mcard,
    statuses,
    products,
    reviews,
    loading,
    error,
    isShareDialogOpen,
    setIsShareDialogOpen,
    isOwner,
    showQRCode,
    setShowQRCode,
    viewCount,
    handleCopyLink,
    handleEdit,
    refreshData
  } = useMCardView();

  if (loading) {
    return <MCardViewLoading />;
  }

  if (!mcard) {
    return <MCardViewNotFound />;
  }

  const isPendingPayment = mcard.subscription_status === 'pending_payment';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <MCardViewHeader
        isOwner={isOwner}
        showQRCode={showQRCode}
        viewCount={viewCount}
        subscriptionStatus={mcard.subscription_status}
        onEdit={handleEdit}
        onToggleQRCode={() => setShowQRCode(!showQRCode)}
        onShare={() => !isPendingPayment && setIsShareDialogOpen(true)}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="shadow-lg">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Compliance Warning - Avertissement de conformité */}
          <MCardComplianceWarning isOwner={isOwner} />

          {/* QR Code Section - seulement si pas en attente de paiement */}
          {!isPendingPayment && (
            <MCardViewQRSection
              showQRCode={showQRCode}
              url={URL_CONFIG.getMCardUrl(mcard.slug)}
              cardName={mcard.full_name}
              onClose={() => setShowQRCode(false)}
            />
          )}

          {/* Profile Card avec personnalisation appliquée */}
          <MCardCustomized mcardId={mcard.id} className="rounded-2xl overflow-hidden">
            <MCardViewProfile
              mcard={mcard}
              onCopyLink={handleCopyLink}
              onShare={() => !isPendingPayment && setIsShareDialogOpen(true)}
              isOwner={isOwner}
            />
          </MCardCustomized>

          {/* Statuses Section */}
          <MCardViewStatuses
            statuses={statuses}
            phoneNumber={mcard.phone_number}
            isOwner={isOwner}
            mcardId={mcard.id}
            mcardPlan={mcard.plan}
            onStatusesChange={refreshData}
          />

          {/* Products Section */}
          <MCardViewProducts 
            products={products}
            phoneNumber={mcard.phone_number}
            isOwner={isOwner}
            mcardId={mcard.id}
            mcardPlan={mcard.plan}
            onProductsChange={refreshData}
          />

          {/* Physical Products Section */}
          <MCardPhysicalProducts 
            mcard={mcard}
            isOwner={isOwner}
          />

          {/* Customization Section */}
          <MCardViewCustomization
            mcard={mcard}
            isOwner={isOwner}
          />

          {/* Reviews Section */}
          <MCardViewReviews
            reviews={reviews}
            mcardId={mcard.id}
            isOwner={isOwner}
            onReviewsChange={refreshData}
          />
        </div>
      </div>

      {/* Share Dialog - seulement si pas en attente de paiement */}
      {!isPendingPayment && (
        <MCardShareDialog 
          isOpen={isShareDialogOpen}
          onOpenChange={setIsShareDialogOpen}
          mcard={mcard}
        />
      )}
    </div>
  );
};

export default MCardView;
