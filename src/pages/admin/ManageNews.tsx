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
import MultiImageUploader, { type ImageItem } from "@/components/admin/MultiImageUploader";
import type { Tables } from "@/integrations/supabase/types";

type Article = Tables<"articles">;
type Category = Tables<"categories">;

const ManageNews = () => {
  const { user } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<(Category & { slug?: string | null })[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Article | null>(null);
  const [form, setForm] = useState({
    title: "", title_en: "", description: "", description_en: "",
    category_id: "", tags: "", youtube_url: "",
    home_position: "none", article_type: "normal", is_breaking: false,
  });
  const [articleImages, setArticleImages] = useState<ImageItem[]>([]);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    const [a, c] = await Promise.all([
      supabase.from("articles").select("*").order("created_at", { ascending: false }),
      supabase.from("categories").select("*").order("name"),
    ]);
    setArticles(a.data ?? []);
    setCategories((c.data as any[]) ?? []);
  };

  useEffect(() => { fetchData(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ title: "", title_en: "", description: "", description_en: "", category_id: "", tags: "", youtube_url: "", home_position: "none", article_type: "normal", is_breaking: false });
    setArticleImages([]);
    setDialogOpen(true);
  };

  const openEdit = async (a: Article) => {
    setEditing(a);
    setForm({
      title: a.title, title_en: a.title_en ?? "",
      description: a.description ?? "", description_en: a.description_en ?? "",
      category_id: a.category_id ?? "",
      tags: (a.tags ?? []).join(", "), youtube_url: a.youtube_url ?? "",
      home_position: a.home_position ?? "none", article_type: a.article_type ?? "normal",
      is_breaking: a.is_breaking ?? false,
    });
    // Load existing images
    const { data: imgs } = await supabase
      .from("article_images")
      .select("*")
      .eq("article_id", a.id)
      .order("sort_order");
    setArticleImages(
      (imgs ?? []).map((img: any) => ({
        id: img.id,
        image_url: img.image_url,
        caption: img.caption ?? "",
        caption_en: img.caption_en ?? "",
        sort_order: img.sort_order,
        is_cover: img.is_cover,
      }))
    );
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) { toast({ title: "Title is required", variant: "destructive" }); return; }
    setSaving(true);

    const coverImage = articleImages.length > 0 ? articleImages[0].image_url : null;
    const tags = form.tags.split(",").map(t => t.trim()).filter(Boolean);
    const payload: any = {
      title: form.title, title_en: form.title_en || null,
      description: form.description || null, description_en: form.description_en || null,
      category_id: form.category_id || null, tags, thumbnail_url: coverImage,
      youtube_url: form.youtube_url || null,
      home_position: form.home_position, article_type: form.article_type,
      is_breaking: form.is_breaking,
      is_featured: form.home_position === "featured",
      is_main: form.home_position === "main",
      created_by: user?.id ?? null,
    };

    let articleId = editing?.id;

    if (editing) {
      const { error } = await supabase.from("articles").update(payload).eq("id", editing.id);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); setSaving(false); return; }
    } else {
      const { data, error } = await supabase.from("articles").insert(payload).select("id").single();
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); setSaving(false); return; }
      articleId = data.id;
    }

    // Sync article images
    if (articleId) {
      // Delete old images
      await supabase.from("article_images").delete().eq("article_id", articleId);
      // Insert new images
      if (articleImages.length > 0) {
        const imgPayload = articleImages.map((img, i) => ({
          article_id: articleId!,
          image_url: img.image_url,
          caption: img.caption || null,
          caption_en: img.caption_en || null,
          sort_order: i,
          is_cover: i === 0,
        }));
        await supabase.from("article_images").insert(imgPayload);
      }
    }

    toast({ title: editing ? "Article updated" : "Article added" });
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
                {a.title_en && <p className="text-xs text-muted-foreground truncate">{a.title_en}</p>}
                <p className="text-xs text-muted-foreground">{getCategoryName(a.category_id)} • {new Date(a.created_at).toLocaleDateString()}</p>
                <div className="flex gap-1 mt-1">
                  {a.home_position === "big_card" && <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">Big Card</span>}
                  {a.home_position === "latest_news" && <span className="text-[10px] bg-secondary/30 text-secondary-foreground px-1.5 py-0.5 rounded">Latest News</span>}
                  {a.home_position === "featured" && <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">Featured</span>}
                  {a.home_position === "main" && <span className="text-[10px] bg-accent/30 text-accent-foreground px-1.5 py-0.5 rounded">Main</span>}
                  {a.is_breaking && <span className="text-[10px] bg-red-500/20 text-red-700 px-1.5 py-0.5 rounded">Breaking</span>}
                  {a.article_type === "live" && <span className="text-[10px] bg-green-500/20 text-green-700 px-1.5 py-0.5 rounded">Live</span>}
                  {a.article_type === "podcast" && <span className="text-[10px] bg-blue-500/20 text-blue-700 px-1.5 py-0.5 rounded">Podcast</span>}
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

            <MultiImageUploader
              images={articleImages}
              onChange={setArticleImages}
              maxImages={3}
              showCoverBadge
              folderPrefix="articles/"
            />

            <div><Label>YouTube Video URL (optional)</Label><Input value={form.youtube_url} onChange={e => setForm({ ...form, youtube_url: e.target.value })} placeholder="https://youtube.com/watch?v=..." /></div>
            <div><Label>Article Type</Label>
              <select className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background" value={form.article_type} onChange={e => setForm({ ...form, article_type: e.target.value })}>
                <option value="normal">Normal</option>
                <option value="live">Live</option>
                <option value="podcast">Podcast</option>
              </select>
            </div>
            <div><Label>Home Page Position</Label>
              <select className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background" value={form.home_position} onChange={e => setForm({ ...form, home_position: e.target.value })}>
                <option value="none">None</option>
                <option value="big_card">Big Card (1 Large Featured)</option>
                <option value="latest_news">Latest News (5 Items List)</option>
                <option value="featured">Featured (Right 6 Cards)</option>
                <option value="main">Main (Our Districts)</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="is_breaking">Breaking News</Label>
              <Switch id="is_breaking" checked={form.is_breaking} onCheckedChange={v => setForm({ ...form, is_breaking: v })} />
            </div>
            <Button className="w-full" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageNews;
