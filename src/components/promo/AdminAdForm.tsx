
import React from 'react';
import { AdminAd } from '@/types/adminAds';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AdMediaUpload } from './AdMediaUpload';

interface AdminAdFormProps {
  form: Partial<AdminAd>;
  saving: boolean;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onMediaChange: (url: string | null) => void;
  onIsActiveChange: (checked: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const AdminAdForm: React.FC<AdminAdFormProps> = ({
  form,
  saving,
  onFormChange,
  onMediaChange,
  onIsActiveChange,
  onSubmit,
  onCancel,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Titre *</label>
        <Input name="title" value={form.title ?? ""} onChange={onFormChange} required />
      </div>
      <div>
        <label className="block text-sm font-medium">Message</label>
        <textarea name="message" value={form.message ?? ""} onChange={onFormChange} className="w-full border rounded px-2 py-1" />
      </div>
      <div>
        <label className="block text-sm font-medium">Lien cible (URL promotionnelle)</label>
        <Input name="target_url" value={form.target_url ?? ""} onChange={onFormChange} />
      </div>
      <div>
        <label className="block text-sm font-medium">Visuel (image ou vidéo)</label>
        <AdMediaUpload
          value={form.image_url}
          onChange={(url) => onMediaChange(url)}
          onRemove={() => onMediaChange(null)}
        />
      </div>
      <div className="flex gap-2">
        <div>
          <label className="block text-sm font-medium">Début (AAAA-MM-JJ)</label>
          <Input name="start_date" value={form.start_date ?? ""} onChange={onFormChange} type="date" />
        </div>
        <div>
          <label className="block text-sm font-medium">Fin</label>
          <Input name="end_date" value={form.end_date ?? ""} onChange={onFormChange} type="date" />
        </div>
      </div>
      <div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="is_active" checked={!!form.is_active} onChange={e => onIsActiveChange(e.target.checked)} />
          Activer cette publicité
        </label>
      </div>
      <div className="flex gap-2 items-center justify-end">
        <Button type="button" variant="secondary" onClick={onCancel}>Annuler</Button>
        <Button type="submit" disabled={saving}>{saving ? "Enregistrement..." : "Enregistrer"}</Button>
      </div>
    </form>
  );
};
