import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Trash2, Pencil, RefreshCcw } from "lucide-react";

interface AdminAd {
  id: string;
  title: string;
  message: string | null;
  image_url: string | null;
  target_url: string | null;
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

export const AdminAdsManager: React.FC = () => {
  const [ads, setAds] = useState<AdminAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [form, setForm] = useState<Partial<AdminAd>>({ is_active: true });
  const [saving, setSaving] = useState(false);

  const fetchAds = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("admin_ads")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error(error);
      setAds([]);
    } else {
      setAds(data ?? []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchAds(); }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {
    setForm({ is_active: true });
  };

  const handleOpenDialog = (ad?: AdminAd) => {
    if (ad) setForm(ad);
    else resetForm();
    setShowDialog(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // Validation minimum
    if (!form.title || form.title.trim() === "") {
      alert("Le titre est obligatoire.");
      setSaving(false);
      return;
    }
    let error;
    if (!form.id) {
      // Insert
      const insertPayload = {
        title: form.title, // Now TS knows this is a string
        message: form.message || null,
        image_url: form.image_url || null,
        target_url: form.target_url || null,
        is_active: !!form.is_active,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
      };
      ({ error } = await supabase.from("admin_ads").insert(insertPayload));
    } else {
      // Update
      const { id } = form;
      const updatePayload = {
        title: form.title,
        message: form.message || null,
        image_url: form.image_url || null,
        target_url: form.target_url || null,
        is_active: !!form.is_active,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
      };
      ({ error } = await supabase.from("admin_ads").update(updatePayload).eq("id", id!));
    }

    if (error) {
      alert("Erreur lors de l'enregistrement");
      console.error(error);
    } else {
      setShowDialog(false);
      fetchAds();
    }
    setSaving(false);
  };

  const handleDelete = async (ad: AdminAd) => {
    if (!window.confirm(`Supprimer la publicité "${ad.title}" ?`)) return;
    await supabase.from("admin_ads").delete().eq("id", ad.id);
    fetchAds();
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAds();
    setRefreshing(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2">Publicités admin <RefreshCcw className={`ml-2 h-5 w-5 ${refreshing ? "animate-spin" : ""}`} onClick={handleRefresh} /></CardTitle>
        <Button size="sm" onClick={() => handleOpenDialog()}><Plus className="h-4 w-4 mr-1" /> Nouvelle publicité</Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-6">Chargement...</div>
        ) : ads.length === 0 ? (
          <div className="text-center text-gray-500 py-6">Aucune publicité créée.</div>
        ) : (
          <div className="space-y-3">
            {ads.map(ad => (
              <div key={ad.id} className="border rounded p-3 flex flex-col md:flex-row md:items-center justify-between gap-2 bg-gray-50">
                <div>
                  <div className="text-sm font-bold">{ad.title} {!ad.is_active && <span className="ml-2 text-xs bg-gray-300 rounded px-2 py-0.5">Inactif</span>}</div>
                  {ad.message && <div className="text-xs text-gray-700">{ad.message}</div>}
                  {ad.image_url && (
                    <img src={ad.image_url} alt="Visuel" className="h-10 mt-1 rounded" />
                  )}
                  {ad.target_url && <a href={ad.target_url} target="_blank" rel="noopener" className="text-xs underline text-blue-600">{ad.target_url}</a>}
                  {ad.start_date && ad.end_date && (
                    <div className="text-xs text-gray-500">Du {ad.start_date} au {ad.end_date}</div>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="outline" onClick={() => handleOpenDialog(ad)}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="outline" onClick={() => handleDelete(ad)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Dialog Ajout/Edition */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent>
            <DialogHeader><DialogTitle>{form.id ? "Modifier" : "Créer"} une publicité</DialogTitle></DialogHeader>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Titre *</label>
                <Input name="title" value={form.title ?? ""} onChange={handleInputChange} required />
              </div>
              <div>
                <label className="block text-sm font-medium">Message</label>
                <textarea name="message" value={form.message ?? ""} onChange={handleInputChange} className="w-full border rounded px-2 py-1" />
              </div>
              <div>
                <label className="block text-sm font-medium">Lien cible (URL promotionnelle)</label>
                <Input name="target_url" value={form.target_url ?? ""} onChange={handleInputChange} />
              </div>
              <div>
                <label className="block text-sm font-medium">Visuel (url image)</label>
                <Input name="image_url" value={form.image_url ?? ""} onChange={handleInputChange} />
              </div>
              <div className="flex gap-2">
                <div>
                  <label className="block text-sm font-medium">Début (AAAA-MM-JJ)</label>
                  <Input name="start_date" value={form.start_date ?? ""} onChange={handleInputChange} type="date" />
                </div>
                <div>
                  <label className="block text-sm font-medium">Fin</label>
                  <Input name="end_date" value={form.end_date ?? ""} onChange={handleInputChange} type="date" />
                </div>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="is_active" checked={!!form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} />
                  Activer cette publicité
                </label>
              </div>
              <div className="flex gap-2 items-center justify-between">
                <Button type="submit" disabled={saving}>{saving ? "Enregistrement..." : "Enregistrer"}</Button>
                <Button type="button" variant="secondary" onClick={() => setShowDialog(false)}>Annuler</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
