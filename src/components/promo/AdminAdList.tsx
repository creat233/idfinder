
import React from 'react';
import { AdminAd } from '@/types/adminAds';
import { AdminAdListItem } from './AdminAdListItem';

interface AdminAdListProps {
  ads: AdminAd[];
  loading: boolean;
  onEdit: (ad: AdminAd) => void;
  onDelete: (ad: AdminAd) => void;
}

export const AdminAdList: React.FC<AdminAdListProps> = ({ ads, loading, onEdit, onDelete }) => {
  if (loading) {
    return <div className="text-center py-6">Chargement...</div>;
  }
  
  if (ads.length === 0) {
    return <div className="text-center text-gray-500 py-6">Aucune publicité créée.</div>;
  }
  
  return (
    <div className="space-y-3">
      {ads.map(ad => (
        <AdminAdListItem key={ad.id} ad={ad} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};
