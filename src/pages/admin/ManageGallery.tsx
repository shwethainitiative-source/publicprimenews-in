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
import MultiImageUploader, { type ImageItem } from "@/components/admin/MultiImageUploader";

interface GalleryPost {
  id: string;
  title: string | null;
  title_en: string | null;
  sort_order: number | null;
  created_at: string;
  gallery_post_images: { id: string; image_url: string; caption: string | null; caption_en: string | null; sort_order: number }[];
}

const ManageGallery = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<GalleryPost[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<GalleryPost | null>(null);
  const [form, setForm] = useState({ title: "", title_en: "", sort_order: "0" });
  const [postImages, setPostImages] = useState<ImageItem[]>([]);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    const { data } = await supabase
      .from("gallery_posts")
      .select("*, gallery_post_images(*)")
      .order("sort_order")
      .order("created_at", { ascending: false });
    setPosts((data as GalleryPost[]) ?? []);
  };

  useEffect(() => { fetchData(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ title: "", title_en: "", sort_order: "0" });
    setPostImages([]);
    setDialogOpen(true);
  };

  const openEdit = (p: GalleryPost) => {
    setEditing(p);
    setForm({ title: p.title ?? "", title_en: p.title_en ?? "", sort_order: String(p.sort_order ?? 0) });
    setPostImages(
      (p.gallery_post_images ?? [])
        .sort((a, b) => a.sort_order - b.sort_order)
        .map(img => ({
          id: img.id,
          image_url: img.image_url,
          caption: img.caption ?? "",
          caption_en: img.caption_en ?? "",
          sort_order: img.sort_order,
        }))
    );
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (postImages.length === 0) { toast({ title: "At least 1 image required", variant: "destructive" }); return; }
    setSaving(true);

    const postPayload: any = {
      title: form.title || null,
      title_en: form.title_en || null,
      sort_order: parseInt(form.sort_order) || 0,
      created_by: user?.id ?? null,
    };

    let postId = editing?.id;

    if (editing) {
      const { error } = await supabase.from("gallery_posts").update(postPayload).eq("id", editing.id);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); setSaving(false); return; }
    } else {
      const { data, error } = await supabase.from("gallery_posts").insert(postPayload).select("id").single();
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); setSaving(false); return; }
      postId = data.id;
    }

    if (postId) {
      await supabase.from("gallery_post_images").delete().eq("post_id", postId);
      if (postImages.length > 0) {
        const imgPayload = postImages.map((img, i) => ({
          post_id: postId!,
          image_url: img.image_url,
          caption: img.caption || null,
          caption_en: img.caption_en || null,
          sort_order: i,
        }));
        await supabase.from("gallery_post_images").insert(imgPayload);
      }
    }

    toast({ title: editing ? "Post updated" : "Post added" });
    setSaving(false);
    setDialogOpen(false);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this gallery post?")) return;
    await supabase.from("gallery_posts").delete().eq("id", id);
    toast({ title: "Deleted" });
    fetchData();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Manage Gallery</h2>
        <Button onClick={openNew}><Plus className="h-4 w-4 mr-2" /> Add Post</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {posts.map(p => (
          <Card key={p.id} className="overflow-hidden">
            <div className="flex gap-1 p-1">
              {(p.gallery_post_images ?? []).sort((a, b) => a.sort_order - b.sort_order).slice(0, 3).map(img => (
                <img key={img.id} src={img.image_url} alt="" className="w-20 h-16 object-cover rounded" />
              ))}
              {(p.gallery_post_images?.length ?? 0) > 3 && (
                <div className="w-20 h-16 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                  +{(p.gallery_post_images?.length ?? 0) - 3}
                </div>
              )}
            </div>
            <CardContent className="p-3">
              <p className="text-sm font-medium text-foreground truncate">{p.title || "Untitled"}</p>
              <p className="text-xs text-muted-foreground">{p.gallery_post_images?.length ?? 0} images • {new Date(p.created_at).toLocaleDateString()}</p>
              <div className="flex gap-1 mt-2">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(p)}><Pencil className="h-3 w-3" /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDelete(p.id)}><Trash2 className="h-3 w-3 text-destructive" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {posts.length === 0 && <p className="col-span-full text-muted-foreground text-center py-8">No gallery posts yet.</p>}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Edit Gallery Post" : "Add Gallery Post"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Title (ಕನ್ನಡ)</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
            <div><Label>Title (English)</Label><Input value={form.title_en} onChange={e => setForm({ ...form, title_en: e.target.value })} /></div>
            <div><Label>Sort Order</Label><Input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: e.target.value })} /></div>

            <MultiImageUploader
              images={postImages}
              onChange={setPostImages}
              maxImages={5}
              bucket="thumbnails"
              folderPrefix="gallery/"
            />

            <Button className="w-full" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageGallery;
