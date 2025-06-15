
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, RefreshCcw } from "lucide-react";
import { AdminAd } from "@/types/adminAds";
import { AdminAdList } from "./AdminAdList";
import { AdminAdForm } from "./AdminAdForm";

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
  
  const handleMediaChange = (url: string | null) => {
    setForm(f => ({ ...f, image_url: url }));
  };
  
  const handleIsActiveChange = (checked: boolean) => {
    setForm(f => ({ ...f, is_active: checked }));
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

    if (!form.title || form.title.trim() === "") {
      alert("Le titre est obligatoire.");
      setSaving(false);
      return;
    }
    let error;
    if (!form.id) {
      const insertPayload = {
        title: form.title,
        message: form.message || null,
        image_url: form.image_url || null,
        target_url: form.target_url || null,
        is_active: !!form.is_active,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
      };
      ({ error } = await supabase.from("admin_ads").insert(insertPayload));
    } else {
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
    
    // Also delete from storage if there is an image_url
    if (ad.image_url) {
        const path = ad.image_url.split('/').pop();
        if(path) {
            await supabase.storage.from('admin_ads_media').remove([`public/${path}`]);
        }
    }

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
        <AdminAdList
            ads={ads}
            loading={loading}
            onEdit={handleOpenDialog}
            onDelete={handleDelete}
        />

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{form.id ? "Modifier" : "Créer"} une publicité</DialogTitle></DialogHeader>
            <AdminAdForm
              form={form}
              saving={saving}
              onSubmit={handleSave}
              onFormChange={handleInputChange}
              onMediaChange={handleMediaChange}
              onIsActiveChange={handleIsActiveChange}
              onCancel={() => setShowDialog(false)}
            />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
