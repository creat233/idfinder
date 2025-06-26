
import { MCardShareDialog } from '@/components/mcards/MCardShareDialog';
import { MCardViewHeader } from '@/components/mcards/view/MCardViewHeader';
import { MCardViewQRSection } from '@/components/mcards/view/MCardViewQRSection';
import { MCardViewProfile } from '@/components/mcards/view/MCardViewProfile';
import { MCardViewProducts } from '@/components/mcards/view/MCardViewProducts';
import { MCardViewStatuses } from '@/components/mcards/view/MCardViewStatuses';
import { MCardViewLoading } from '@/components/mcards/view/MCardViewLoading';
import { MCardViewNotFound } from '@/components/mcards/view/MCardViewNotFound';
import { useMCardView } from '@/hooks/useMCardView';

const MCardView = () => {
  const {
    mcard,
    statuses,
    products,
    loading,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <MCardViewHeader
        isOwner={isOwner}
        showQRCode={showQRCode}
        viewCount={viewCount}
        onEdit={handleEdit}
        onToggleQRCode={() => setShowQRCode(!showQRCode)}
        onShare={() => setIsShareDialogOpen(true)}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* QR Code Section */}
          <MCardViewQRSection
            showQRCode={showQRCode}
            url={window.location.href}
            cardName={mcard.full_name}
            onClose={() => setShowQRCode(false)}
          />

          {/* Profile Card */}
          <MCardViewProfile
            mcard={mcard}
            onCopyLink={handleCopyLink}
            onShare={() => setIsShareDialogOpen(true)}
            isOwner={isOwner}
          />

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
        </div>
      </div>

      {/* Share Dialog */}
      <MCardShareDialog 
        isOpen={isShareDialogOpen}
        onOpenChange={setIsShareDialogOpen}
        mcard={mcard}
      />
    </div>
  );
};

export default MCardView;
