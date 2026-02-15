import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Photo {
  id: string; image_url: string; caption: string | null; caption_en: string | null;
  album: string | null; sort_order: number; created_at: string;
}

const ManageGallery = () => {
  const { user } = useAuth();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Photo | null>(null);
  const [form, setForm] = useState({ caption: "", caption_en: "", album: "general", sort_order: "0" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    const { data } = await supabase.from("gallery_photos").select("*").order("sort_order").order("created_at", { ascending: false });
    setPhotos((data as Photo[]) ?? []);
  };
  useEffect(() => { fetchData(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ caption: "", caption_en: "", album: "general", sort_order: "0" });
    setImageFile(null);
    setDialogOpen(true);
  };

  const openEdit = (p: Photo) => {
    setEditing(p);
    setForm({ caption: p.caption ?? "", caption_en: p.caption_en ?? "", album: p.album ?? "general", sort_order: String(p.sort_order) });
    setImageFile(null);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editing && !imageFile) { toast({ title: "Image is required", variant: "destructive" }); return; }
    setSaving(true);
    let image_url = editing?.image_url ?? "";

    if (imageFile) {
      const ext = imageFile.name.split(".").pop();
      const path = `gallery/${Date.now()}.${ext}`;
      const { error: uploadErr } = await supabase.storage.from("thumbnails").upload(path, imageFile);
      if (uploadErr) { toast({ title: "Upload failed", description: uploadErr.message, variant: "destructive" }); setSaving(false); return; }
      image_url = supabase.storage.from("thumbnails").getPublicUrl(path).data.publicUrl;
    }

    const payload: any = {
      image_url, caption: form.caption || null, caption_en: form.caption_en || null,
      album: form.album || "general", sort_order: parseInt(form.sort_order) || 0,
      created_by: user?.id ?? null,
    };

    const { error } = editing
      ? await supabase.from("gallery_photos").update(payload).eq("id", editing.id)
      : await supabase.from("gallery_photos").insert(payload);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else toast({ title: editing ? "Photo updated" : "Photo added" });
    setSaving(false); setDialogOpen(false); fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this photo?")) return;
    await supabase.from("gallery_photos").delete().eq("id", id);
    toast({ title: "Deleted" }); fetchData();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Manage Gallery</h2>
        <Button onClick={openNew}><Plus className="h-4 w-4 mr-2" /> Add Photo</Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {photos.map(p => (
          <Card key={p.id} className="overflow-hidden">
            <img src={p.image_url} alt="" className="w-full h-32 object-cover" />
            <CardContent className="p-2">
              <p className="text-xs text-foreground truncate">{p.caption || "No caption"}</p>
              <div className="flex gap-1 mt-1">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(p)}><Pencil className="h-3 w-3" /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDelete(p.id)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {photos.length === 0 && <p className="col-span-full text-muted-foreground text-center py-8">No photos yet.</p>}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editing ? "Edit Photo" : "Add Photo"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Image</Label><Input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] ?? null)} /></div>
            <div><Label>Caption (ಕನ್ನಡ)</Label><Input value={form.caption} onChange={e => setForm({ ...form, caption: e.target.value })} /></div>
            <div><Label>Caption (English)</Label><Input value={form.caption_en} onChange={e => setForm({ ...form, caption_en: e.target.value })} /></div>
            <div><Label>Album</Label><Input value={form.album} onChange={e => setForm({ ...form, album: e.target.value })} /></div>
            <div><Label>Sort Order</Label><Input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: e.target.value })} /></div>
            <Button className="w-full" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageGallery;
