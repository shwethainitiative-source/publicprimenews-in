import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Ad = Tables<"advertisements">;

const ManageAds = () => {
  const { user } = useAuth();
  const [ads, setAds] = useState<Ad[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Ad | null>(null);
  const [form, setForm] = useState({ redirect_link: "", position: "sidebar", is_enabled: true });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchAds = async () => {
    const { data } = await supabase.from("advertisements").select("*").order("created_at", { ascending: false });
    setAds(data ?? []);
  };

  useEffect(() => { fetchAds(); }, []);

  const openNew = () => { setEditing(null); setForm({ redirect_link: "", position: "sidebar", is_enabled: true }); setImageFile(null); setDialogOpen(true); };
  const openEdit = (a: Ad) => { setEditing(a); setForm({ redirect_link: a.redirect_link ?? "", position: a.position, is_enabled: a.is_enabled }); setImageFile(null); setDialogOpen(true); };

  const handleSave = async () => {
    setSaving(true);
    let image_url = editing?.image_url ?? "";

    if (imageFile) {
      const ext = imageFile.name.split(".").pop();
      const path = `${Date.now()}.${ext}`;
      const { error: uploadErr } = await supabase.storage.from("ad-images").upload(path, imageFile);
      if (uploadErr) { toast({ title: "Upload failed", description: uploadErr.message, variant: "destructive" }); setSaving(false); return; }
      const { data: urlData } = supabase.storage.from("ad-images").getPublicUrl(path);
      image_url = urlData.publicUrl;
    }

    if (!image_url) { toast({ title: "Image required", variant: "destructive" }); setSaving(false); return; }

    const payload = { image_url, redirect_link: form.redirect_link || null, position: form.position, is_enabled: form.is_enabled, created_by: user?.id ?? null };
    if (editing) {
      const { error } = await supabase.from("advertisements").update(payload).eq("id", editing.id);
      if (error) toast({ title: "Error", description: error.message, variant: "destructive" }); else toast({ title: "Ad updated" });
    } else {
      const { error } = await supabase.from("advertisements").insert(payload);
      if (error) toast({ title: "Error", description: error.message, variant: "destructive" }); else toast({ title: "Ad added" });
    }
    setSaving(false); setDialogOpen(false); fetchAds();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this ad?")) return;
    await supabase.from("advertisements").delete().eq("id", id);
    toast({ title: "Deleted" }); fetchAds();
  };

  const toggleEnabled = async (ad: Ad) => {
    await supabase.from("advertisements").update({ is_enabled: !ad.is_enabled }).eq("id", ad.id);
    fetchAds();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Manage Advertisements</h2>
        <Button onClick={openNew}><Plus className="h-4 w-4 mr-2" /> Add Ad</Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ads.map(a => (
          <Card key={a.id} className={!a.is_enabled ? "opacity-50" : ""}>
            <CardContent className="p-4 space-y-3">
              <img src={a.image_url} alt="Ad" className="w-full h-32 object-cover rounded" />
              <div className="flex items-center justify-between">
                <span className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground capitalize">{a.position}</span>
                <Switch checked={a.is_enabled} onCheckedChange={() => toggleEnabled(a)} />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="ghost" size="icon" onClick={() => openEdit(a)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(a.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {ads.length === 0 && <p className="text-muted-foreground text-center py-8 col-span-full">No ads yet.</p>}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? "Edit Ad" : "Add Ad"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Ad Image</Label><Input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] ?? null)} /></div>
            {editing?.image_url && !imageFile && <img src={editing.image_url} alt="" className="w-full h-32 object-cover rounded" />}
            <div><Label>Redirect Link (optional)</Label><Input value={form.redirect_link} onChange={e => setForm({ ...form, redirect_link: e.target.value })} /></div>
            <div><Label>Position</Label>
              <select className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background" value={form.position} onChange={e => setForm({ ...form, position: e.target.value })}>
                <option value="sidebar">Sidebar</option>
                <option value="top">Top Banner</option>
                <option value="inside">Inside Content</option>
                <option value="about">About Us Page</option>
                <option value="below_news">Below News</option>
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm"><Switch checked={form.is_enabled} onCheckedChange={v => setForm({ ...form, is_enabled: v })} /> Enabled</label>
            <Button className="w-full" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageAds;
