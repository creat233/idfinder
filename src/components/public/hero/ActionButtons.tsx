
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { ScanSearch, Plus, Search, Gift } from "lucide-react";

interface ActionButtonsProps {
  user?: User | null;
  isLoading?: boolean;
}

export const ActionButtons = ({ user, isLoading }: ActionButtonsProps) => {
  const navigate = useNavigate();

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
    <div className="flex flex-col sm:flex-row gap-4">
      <Button 
        size="lg"
        onClick={handlePrimaryAction}
        className="bg-white text-[#9b87f5] hover:bg-gray-100 font-semibold px-8 py-4 text-lg"
      >
        {user ? (
          <>
            <Plus className="mr-2 h-5 w-5" />
            Signaler une carte
          </>
        ) : (
          "Commencer maintenant"
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
            Mes cartes
          </>
        ) : (
          <>
            <Search className="mr-2 h-5 w-5" />
            Voir la démo
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
          Codes promo
        </Button>
      )}
    </div>
  );
};
