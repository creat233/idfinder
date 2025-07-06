import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { ScanSearch, Plus, Search, Gift, CreditCard, Star, CheckCircle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface ActionButtonsProps {
  user?: User | null;
  isLoading?: boolean;
}

export const ActionButtons = ({ user, isLoading }: ActionButtonsProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handlePrimaryAction = () => {
    if (user) {
      // User is logged in, go to signaler page
      navigate("/signaler");
    } else {
      // User is not logged in, go to login page
      navigate("/login");
    }
  };

  const handleSecondaryAction = () => {
    if (user) {
      // User is logged in, go to mes-cartes page
      navigate("/mes-cartes");
    } else {
      // User is not logged in, show demo
      navigate("/demo");
    }
  };

  const handlePromoCodesAction = () => {
    if (user) {
      // User is logged in, go to promo codes page
      navigate("/codes-promo");
    } else {
      // User is not logged in, go to login page
      navigate("/login");
    }
  };

  if (isLoading) return null;

  return (
    <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
      <Button 
        size="lg"
        onClick={handlePrimaryAction}
        className="bg-white text-[#9b87f5] hover:bg-gray-100 font-semibold px-8 py-4 text-lg"
      >
        {user ? (
          <>
            <Plus className="mr-2 h-5 w-5" />
            {t("reportCard")}
          </>
        ) : (
          t("getStartedNow")
        )}
      </Button>
      <Button 
        variant="outline"
        size="lg"
        onClick={handleSecondaryAction}
        className="border-2 border-white text-white hover:bg-white hover:text-[#9b87f5] font-semibold px-8 py-4 text-lg bg-transparent"
      >
        {user ? (
          <>
            <ScanSearch className="mr-2 h-5 w-5" />
            {t("myCards")}
          </>
        ) : (
          <>
            <Search className="mr-2 h-5 w-5" />
            {t("seeDemo")}
          </>
        )}
      </Button>
      {user && (
        <Button 
          variant="outline"
          size="lg"
          onClick={handlePromoCodesAction}
          className="border-2 border-white text-white hover:bg-white hover:text-[#9b87f5] font-semibold px-8 py-4 text-lg bg-transparent"
        >
          <Gift className="mr-2 h-5 w-5" />
          {t("promoCodes")}
        </Button>
      )}
      {user && (
        <Button 
          variant="outline"
          size="lg"
          onClick={() => navigate('/mcards')}
          className="border-2 border-white text-white hover:bg-white hover:text-[#9b87f5] font-semibold px-8 py-4 text-lg bg-transparent"
        >
          <CreditCard className="mr-2 h-5 w-5" />
          {t("myMCards")}
        </Button>
      )}
      {user && (
        <Button 
          variant="outline"
          size="lg"
          onClick={() => navigate('/mcards-verifiees')}
          className="border-2 border-white text-white hover:bg-white hover:text-[#9b87f5] font-semibold px-8 py-4 text-lg bg-transparent"
        >
          <CheckCircle className="mr-2 h-5 w-5" />
          MCards Vérifiées
        </Button>
      )}
      {user && (
        <Button 
          variant="outline"
          size="lg"
          onClick={() => navigate('/mes-favoris')}
          className="border-2 border-white text-white hover:bg-white hover:text-[#9b87f5] font-semibold px-8 py-4 text-lg bg-transparent"
        >
          <Star className="mr-2 h-5 w-5" />
          Mes Favoris
        </Button>
      )}
    </div>
  );
};
