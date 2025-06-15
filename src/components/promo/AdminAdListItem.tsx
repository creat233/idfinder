
import React from 'react';
import { AdminAd } from '@/types/adminAds';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';

interface AdminAdListItemProps {
  ad: AdminAd;
  onEdit: (ad: AdminAd) => void;
  onDelete: (ad: AdminAd) => void;
}

export const AdminAdListItem: React.FC<AdminAdListItemProps> = ({ ad, onEdit, onDelete }) => {
  return (
    <div className="border rounded p-3 flex flex-col md:flex-row justify-between items-start gap-4 bg-gray-50">
      <div className="flex-grow">
        <div className="text-sm font-bold">{ad.title} {!ad.is_active && <span className="ml-2 text-xs bg-gray-300 rounded px-2 py-0.5">Inactif</span>}</div>
        {ad.message && <div className="text-xs text-gray-700 mt-1">{ad.message}</div>}
        {ad.target_url && <a href={ad.target_url} target="_blank" rel="noopener noreferrer" className="text-xs underline text-blue-600 block mt-1">{ad.target_url}</a>}
        {ad.start_date && ad.end_date && (
          <div className="text-xs text-gray-500 mt-1">Du {ad.start_date} au {ad.end_date}</div>
        )}
      </div>
      {ad.image_url && (
        <div className="flex-shrink-0">
          {ad.image_url.match(/\.(mp4|webm)$/i) ? (
            <video src={ad.image_url} className="h-20 w-auto rounded" controls muted loop playsInline />
          ) : (
            <a href={ad.image_url} target="_blank" rel="noopener noreferrer">
              <img src={ad.image_url} alt="Visuel" className="h-20 w-auto rounded object-cover" />
            </a>
          )}
        </div>
      )}
      <div className="flex-shrink-0 flex gap-1 self-start md:self-center">
        <Button size="icon" variant="outline" onClick={() => onEdit(ad)}><Pencil className="h-4 w-4" /></Button>
        <Button size="icon" variant="outline" onClick={() => onDelete(ad)}><Trash2 className="h-4 w-4" /></Button>
      </div>
    </div>
  );
};
