import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";

interface MCardVerifiedBadgeProps {
  isVerified: boolean;
  className?: string;
}

export const MCardVerifiedBadge = ({ isVerified, className = "" }: MCardVerifiedBadgeProps) => {
  if (!isVerified) return null;

  return (
    <Badge 
      variant="default" 
      className={`bg-blue-600 hover:bg-blue-700 text-white border-blue-600 ${className}`}
    >
      <CheckCircle className="w-3 h-3 mr-1" />
      Vérifié
    </Badge>
  );
};