
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Briefcase } from "lucide-react";
import { MCard } from "@/types/mcard";
import { MCardSocialLinks } from "@/components/mcards/MCardSocialLinks";
import { MCardViewContactInfo } from "./MCardViewContactInfo";
import { MCardViewQuickActions } from "./MCardViewQuickActions";

interface MCardViewProfileProps {
  mcard: MCard;
  onCopyLink: () => void;
  onShare: () => void;
}

export const MCardViewProfile = ({ mcard, onCopyLink, onShare }: MCardViewProfileProps) => {
  return (
    <Card className="mb-6 overflow-hidden shadow-lg">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32"></div>
      <CardContent className="relative pt-0 pb-8">
        {/* Profile Picture */}
        <div className="flex justify-center -mt-16 mb-6">
          <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100">
            {mcard.profile_picture_url ? (
              <img 
                src={mcard.profile_picture_url} 
                alt={mcard.full_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="h-16 w-16 text-gray-400" />
              </div>
            )}
          </div>
        </div>

        {/* Basic Info */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{mcard.full_name}</h1>
          {mcard.job_title && (
            <p className="text-lg text-gray-600 mb-1">{mcard.job_title}</p>
          )}
          {mcard.company && (
            <p className="text-gray-500 flex items-center justify-center gap-1">
              <Briefcase className="h-4 w-4" />
              {mcard.company}
            </p>
          )}
          <Badge variant="secondary" className="mt-3">
            Plan {mcard.plan}
          </Badge>
        </div>

        {/* Description */}
        {mcard.description && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700 text-center">{mcard.description}</p>
          </div>
        )}

        {/* Contact Info */}
        <MCardViewContactInfo mcard={mcard} />

        {/* Social Links */}
        <MCardSocialLinks mcard={mcard} />

        {/* Quick Actions */}
        <MCardViewQuickActions onCopyLink={onCopyLink} onShare={onShare} />
      </CardContent>
    </Card>
  );
};
