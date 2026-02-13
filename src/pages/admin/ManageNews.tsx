import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Article = Tables<"articles">;
type Category = Tables<"categories">;

const ManageNews = () => {
  const { user } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Article | null>(null);
  const [form, setForm] = useState({
    title: "", title_en: "", description: "", description_en: "",
    category_id: "", tags: "",
    is_featured: false, is_popular: false, is_breaking: false,
  });
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    const [a, c] = await Promise.all([
      supabase.from("articles").select("*").order("created_at", { ascending: false }),
      supabase.from("categories").select("*").order("name"),
    ]);
    setArticles(a.data ?? []);
    setCategories(c.data ?? []);
  };

  useEffect(() => { fetchData(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ title: "", title_en: "", description: "", description_en: "", category_id: "", tags: "", is_featured: false, is_popular: false, is_breaking: false });
    setThumbnailFile(null);
    setDialogOpen(true);
  };

  const openEdit = (a: Article) => {
    setEditing(a);
    setForm({
      title: a.title, title_en: (a as any).title_en ?? "",
      description: a.description ?? "", description_en: (a as any).description_en ?? "",
      category_id: a.category_id ?? "",
      tags: (a.tags ?? []).join(", "), is_featured: a.is_featured, is_popular: a.is_popular, is_breaking: a.is_breaking,
    });
    setThumbnailFile(null);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) { toast({ title: "Title is required", variant: "destructive" }); return; }
    setSaving(true);
    let thumbnail_url = editing?.thumbnail_url ?? null;

    if (thumbnailFile) {
      const ext = thumbnailFile.name.split(".").pop();
      const path = `${Date.now()}.${ext}`;
      const { error: uploadErr } = await supabase.storage.from("thumbnails").upload(path, thumbnailFile);
      if (uploadErr) { toast({ title: "Upload failed", description: uploadErr.message, variant: "destructive" }); setSaving(false); return; }
      const { data: urlData } = supabase.storage.from("thumbnails").getPublicUrl(path);
      thumbnail_url = urlData.publicUrl;
    }

    const tags = form.tags.split(",").map(t => t.trim()).filter(Boolean);
    const payload: any = {
      title: form.title, title_en: form.title_en || null,
      description: form.description || null, description_en: form.description_en || null,
      category_id: form.category_id || null, tags, thumbnail_url,
      is_featured: form.is_featured, is_popular: form.is_popular, is_breaking: form.is_breaking,
      created_by: user?.id ?? null,
    };

    if (editing) {
      const { error } = await supabase.from("articles").update(payload).eq("id", editing.id);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); } else { toast({ title: "Article updated" }); }
    } else {
      const { error } = await supabase.from("articles").insert(payload);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); } else { toast({ title: "Article added" }); }
    }
    setSaving(false);
    setDialogOpen(false);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this article?")) return;
    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
    else { toast({ title: "Deleted" }); fetchData(); }
  };

  const getCategoryName = (id: string | null) => categories.find(c => c.id === id)?.name ?? "—";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Manage News</h2>
        <Button onClick={openNew}><Plus className="h-4 w-4 mr-2" /> Add News</Button>
      </div>

      <div className="grid gap-4">
        {articles.map(a => (
          <Card key={a.id}>
            <CardContent className="flex items-center gap-4 p-4">
              {a.thumbnail_url && <img src={a.thumbnail_url} alt="" className="w-20 h-14 object-cover rounded" />}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">{a.title}</h3>
                {(a as any).title_en && <p className="text-xs text-muted-foreground truncate">{(a as any).title_en}</p>}
                <p className="text-xs text-muted-foreground">{getCategoryName(a.category_id)} • {new Date(a.created_at).toLocaleDateString()}</p>
                <div className="flex gap-1 mt-1">
                  {a.is_featured && <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">Featured</span>}
                  {a.is_popular && <span className="text-[10px] bg-secondary/10 text-secondary-foreground px-1.5 py-0.5 rounded">Popular</span>}
                  {a.is_breaking && <span className="text-[10px] bg-destructive/10 text-destructive px-1.5 py-0.5 rounded">Breaking</span>}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => openEdit(a)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(a.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {articles.length === 0 && <p className="text-muted-foreground text-center py-8">No articles yet.</p>}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Article" : "Add New Article"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div><Label>Title - ಕನ್ನಡ (ಶೀರ್ಷಿಕೆ)</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
            <div><Label>Title - English</Label><Input value={form.title_en} onChange={e => setForm({ ...form, title_en: e.target.value })} placeholder="English title (optional)" /></div>
            <div><Label>Description - ಕನ್ನಡ (ವಿವರಣೆ)</Label><Textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
            <div><Label>Description - English</Label><Textarea rows={3} value={form.description_en} onChange={e => setForm({ ...form, description_en: e.target.value })} placeholder="English description (optional)" /></div>
            <div><Label>Category</Label>
              <select className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background" value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })}>
                <option value="">Select category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div><Label>Tags (comma separated)</Label><Input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} /></div>
            <div><Label>Thumbnail Image</Label><Input type="file" accept="image/*" onChange={e => setThumbnailFile(e.target.files?.[0] ?? null)} /></div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm"><Switch checked={form.is_featured} onCheckedChange={v => setForm({ ...form, is_featured: v })} /> Featured</label>
              <label className="flex items-center gap-2 text-sm"><Switch checked={form.is_popular} onCheckedChange={v => setForm({ ...form, is_popular: v })} /> Popular</label>
              <label className="flex items-center gap-2 text-sm"><Switch checked={form.is_breaking} onCheckedChange={v => setForm({ ...form, is_breaking: v })} /> Breaking</label>
            </div>
            <Button className="w-full" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageNews;
