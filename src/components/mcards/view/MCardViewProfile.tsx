
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Briefcase, Phone, Mail, Globe, ExternalLink, Wifi } from "lucide-react";
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
    <div className="space-y-6">
      {/* NFC Style Card */}
      <Card className="overflow-hidden shadow-2xl bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white relative">
        {/* NFC Icon */}
        <div className="absolute top-4 right-4">
          <Wifi className="h-6 w-6 text-blue-300" />
        </div>
        
        <CardContent className="p-8">
          {/* Profile Picture */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full border-2 border-blue-300 shadow-lg overflow-hidden bg-gray-700">
              {mcard.profile_picture_url ? (
                <img 
                  src={mcard.profile_picture_url} 
                  alt={mcard.full_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="h-12 w-12 text-blue-300" />
                </div>
              )}
            </div>
          </div>

          {/* Basic Info */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">{mcard.full_name}</h1>
            {mcard.job_title && (
              <p className="text-blue-200 mb-1">{mcard.job_title}</p>
            )}
            {mcard.company && (
              <p className="text-blue-300 flex items-center justify-center gap-1 text-sm">
                <Briefcase className="h-4 w-4" />
                {mcard.company}
              </p>
            )}
          </div>

          {/* Quick Contact Info */}
          <div className="grid grid-cols-1 gap-3 mb-4">
            {mcard.phone_number && (
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-blue-300" />
                <span className="text-blue-100">{mcard.phone_number}</span>
              </div>
            )}
            {mcard.email && (
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-blue-300" />
                <span className="text-blue-100">{mcard.email}</span>
              </div>
            )}
            {mcard.website_url && (
              <div className="flex items-center gap-3 text-sm">
                <Globe className="h-4 w-4 text-blue-300" />
                <span className="text-blue-100">Site web</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Information Card */}
      <Card className="shadow-lg">
        <CardContent className="p-6">
          {/* Plan Badge */}
          <div className="flex justify-center mb-6">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Plan {mcard.plan}
            </Badge>
          </div>

          {/* Description */}
          {mcard.description && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700 text-center">{mcard.description}</p>
            </div>
          )}

          {/* Detailed Contact Info */}
          <MCardViewContactInfo mcard={mcard} />

          {/* Social Links */}
          <MCardSocialLinks mcard={mcard} />

          {/* Quick Actions */}
          <MCardViewQuickActions onCopyLink={onCopyLink} onShare={onShare} />
        </CardContent>
      </Card>
    </div>
  );
};
