import { Header } from '@/components/Header';
import { ReferralSystem } from '@/components/referral/ReferralSystem';

const Referral = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-0">
      <Header />
      <div className="container mx-auto px-4 py-6 max-w-lg">
        <h1 className="text-2xl font-bold mb-6">🎁 Parrainage</h1>
        <ReferralSystem />
      </div>
    </div>
  );
};

export default Referral;
