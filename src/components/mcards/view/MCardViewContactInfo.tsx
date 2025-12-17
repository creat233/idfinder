
import { Phone, Mail, Globe, ExternalLink, MapPin } from "lucide-react";
import { MCard } from "@/types/mcard";

interface MCardViewContactInfoProps {
  mcard: MCard;
}

export const MCardViewContactInfo = ({ mcard }: MCardViewContactInfoProps) => {
  const contactItems = [
    {
      condition: mcard.phone_number,
      href: `tel:${mcard.phone_number}`,
      icon: Phone,
      label: mcard.phone_number,
      external: false
    },
    {
      condition: mcard.email,
      href: `mailto:${mcard.email}`,
      icon: Mail,
      label: mcard.email,
      external: false
    },
    {
      condition: mcard.website_url,
      href: mcard.website_url,
      icon: Globe,
      label: "Site web",
      external: true
    },
    {
      condition: mcard.maps_location_url,
      href: mcard.maps_location_url,
      icon: MapPin,
      label: "Voir l'adresse",
      external: true
    }
  ];

  const activeContacts = contactItems.filter(item => item.condition);

  if (activeContacts.length === 0) return null;

  return (
    <div className="space-y-3 mb-6">
      {activeContacts.map((contact, index) => {
        const IconComponent = contact.icon;
        
        return (
          <a 
            key={index}
            href={contact.href}
            target={contact.external ? "_blank" : undefined}
            rel={contact.external ? "noopener noreferrer" : undefined}
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
          >
            <IconComponent className="h-5 w-5 text-blue-600" />
            <span className="text-gray-900 font-medium">{contact.label}</span>
            {contact.external && (
              <ExternalLink className="h-4 w-4 ml-auto text-gray-400 group-hover:text-gray-600" />
            )}
          </a>
        );
      })}
    </div>
  );
};
