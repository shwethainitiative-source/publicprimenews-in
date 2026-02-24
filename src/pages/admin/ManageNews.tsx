import { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Save } from "lucide-react";
import MultiImageUploader, { type ImageItem } from "@/components/admin/MultiImageUploader";
import type { Tables } from "@/integrations/supabase/types";

type Article = Tables<"articles">;
type Category = Tables<"categories">;

const emptyForm = {
  title: "", title_en: "", description: "", description_en: "",
  category_id: "", tags: "", youtube_url: "",
  home_position: "none", article_type: "normal", is_breaking: false,
  status: "published" as string,
};

const ManageNews = () => {
  const { user } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<(Category & { slug?: string | null })[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Article | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [articleImages, setArticleImages] = useState<ImageItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("published");

  const formRef = useRef(form);
  const imagesRef = useRef(articleImages);
  const editingRef = useRef(editing);
  const dialogOpenRef = useRef(dialogOpen);
  const autoSaveTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasUnsavedChanges = useRef(false);

  // Keep refs in sync
  useEffect(() => { formRef.current = form; }, [form]);
  useEffect(() => { imagesRef.current = articleImages; }, [articleImages]);
  useEffect(() => { editingRef.current = editing; }, [editing]);
  useEffect(() => { dialogOpenRef.current = dialogOpen; }, [dialogOpen]);

  const fetchData = async () => {
    const [a, c] = await Promise.all([
      supabase.from("articles").select("*").order("created_at", { ascending: false }),
      supabase.from("categories").select("*").order("name"),
    ]);
    setArticles(a.data ?? []);
    setCategories((c.data as any[]) ?? []);
  };

  useEffect(() => { fetchData(); }, []);

  const publishedArticles = articles.filter(a => a.status === "published");
  const draftArticles = articles.filter(a => a.status === "draft");

  const buildPayload = useCallback((f: typeof form, status: string) => {
    const coverImage = imagesRef.current.length > 0 ? imagesRef.current[0].image_url : null;
    const tags = f.tags.split(",").map(t => t.trim()).filter(Boolean);
    return {
      title: f.title || "Untitled Draft",
      title_en: f.title_en || null,
      description: f.description || null,
      description_en: f.description_en || null,
      category_id: f.category_id || null,
      tags,
      thumbnail_url: coverImage,
      youtube_url: f.youtube_url || null,
      home_position: f.home_position,
      article_type: f.article_type,
      is_breaking: f.is_breaking,
      is_featured: f.home_position === "featured",
      is_main: f.home_position === "main",
      created_by: user?.id ?? null,
      status,
    };
  }, [user]);

  const saveImages = useCallback(async (articleId: string) => {
    await supabase.from("article_images").delete().eq("article_id", articleId);
    if (imagesRef.current.length > 0) {
      const imgPayload = imagesRef.current.map((img, i) => ({
        article_id: articleId,
        image_url: img.image_url,
        caption: img.caption || null,
        caption_en: img.caption_en || null,
        sort_order: i,
        is_cover: i === 0,
      }));
      await supabase.from("article_images").insert(imgPayload);
    }
  }, []);

  const saveDraft = useCallback(async (silent = true) => {
    if (!dialogOpenRef.current || !hasUnsavedChanges.current) return;
    const f = formRef.current;
    if (!f.title.trim() && !f.description.trim()) return; // nothing to save

    const payload: any = buildPayload(f, "draft");
    let articleId = editingRef.current?.id;

    try {
      if (editingRef.current) {
        // Only auto-save as draft if it's already a draft
        if (editingRef.current.status === "draft") {
          await supabase.from("articles").update(payload).eq("id", editingRef.current.id);
        } else {
          // For published articles, don't auto-change status
          return;
        }
      } else {
        const { data, error } = await supabase.from("articles").insert(payload).select("id").single();
        if (error) return;
        articleId = data.id;
        // Update editing ref so subsequent saves are updates
        editingRef.current = { ...payload, id: articleId, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), is_popular: false } as Article;
        setEditing(editingRef.current);
      }

      if (articleId) await saveImages(articleId);
      hasUnsavedChanges.current = false;
      if (!silent) toast({ title: "Draft saved" });
      fetchData();
    } catch {
      // silent fail for auto-save
    }
  }, [buildPayload, saveImages]);

  // Auto-save every 30 seconds
  useEffect(() => {
    if (dialogOpen) {
      autoSaveTimerRef.current = setInterval(() => saveDraft(true), 30000);
    }
    return () => {
      if (autoSaveTimerRef.current) clearInterval(autoSaveTimerRef.current);
    };
  }, [dialogOpen, saveDraft]);

  // Save on page visibility change (tab switch, minimize)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) saveDraft(true);
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [saveDraft]);

  // Save on beforeunload (refresh, close)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (dialogOpenRef.current && hasUnsavedChanges.current) {
        saveDraft(true);
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [saveDraft]);

  // Save draft when dialog closes
  const handleDialogChange = (open: boolean) => {
    if (!open && hasUnsavedChanges.current) {
      saveDraft(true);
    }
    setDialogOpen(open);
  };

  // Mark changes
  const updateForm = (updates: Partial<typeof form>) => {
    setForm(prev => ({ ...prev, ...updates }));
    hasUnsavedChanges.current = true;
  };

  const updateImages = (images: ImageItem[]) => {
    setArticleImages(images);
    hasUnsavedChanges.current = true;
  };

  const openNew = () => {
    setEditing(null);
    setForm({ ...emptyForm });
    setArticleImages([]);
    hasUnsavedChanges.current = false;
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
      status: a.status ?? "published",
    });
    const { data: imgs } = await supabase
      .from("article_images").select("*").eq("article_id", a.id).order("sort_order");
    setArticleImages(
      (imgs ?? []).map((img: any) => ({
        id: img.id, image_url: img.image_url,
        caption: img.caption ?? "", caption_en: img.caption_en ?? "",
        sort_order: img.sort_order, is_cover: img.is_cover,
      }))
    );
    hasUnsavedChanges.current = false;
    setDialogOpen(true);
  };

  const handleSave = async (saveStatus: string) => {
    if (saveStatus === "published" && !form.title.trim()) {
      toast({ title: "Title is required", variant: "destructive" }); return;
    }
    if (saveStatus === "draft" && !form.title.trim() && !form.description.trim()) {
      toast({ title: "Enter at least a title or description", variant: "destructive" }); return;
    }
    setSaving(true);

    const payload: any = buildPayload(form, saveStatus);
    let articleId = editing?.id;

    if (editing) {
      const { error } = await supabase.from("articles").update(payload).eq("id", editing.id);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); setSaving(false); return; }
    } else {
      const { data, error } = await supabase.from("articles").insert(payload).select("id").single();
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); setSaving(false); return; }
      articleId = data.id;
    }

    if (articleId) await saveImages(articleId);

    hasUnsavedChanges.current = false;
    toast({ title: saveStatus === "draft" ? "Saved as draft" : (editing ? "Article updated" : "Article published") });
    setSaving(false);
    setDialogOpen(false);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this article?")) return;
    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Deleted" }); fetchData(); }
  };

  const getCategoryName = (id: string | null) => categories.find(c => c.id === id)?.name ?? "—";

  const ArticleCard = ({ a }: { a: Article }) => (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        {a.thumbnail_url && <img src={a.thumbnail_url} alt="" className="w-20 h-14 object-cover rounded" />}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">{a.title}</h3>
          {a.title_en && <p className="text-xs text-muted-foreground truncate">{a.title_en}</p>}
          <p className="text-xs text-muted-foreground">{getCategoryName(a.category_id)} • {new Date(a.created_at).toLocaleDateString()}</p>
          <div className="flex gap-1 mt-1 flex-wrap">
            {a.status === "draft" && <span className="text-[10px] bg-yellow-500/20 text-yellow-700 px-1.5 py-0.5 rounded">Draft</span>}
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
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Manage News</h2>
        <Button onClick={openNew}><Plus className="h-4 w-4 mr-2" /> Add News</Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="published">Published ({publishedArticles.length})</TabsTrigger>
          <TabsTrigger value="drafts">Drafts ({draftArticles.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="published">
          <div className="grid gap-4">
            {publishedArticles.map(a => <ArticleCard key={a.id} a={a} />)}
            {publishedArticles.length === 0 && <p className="text-muted-foreground text-center py-8">No published articles.</p>}
          </div>
        </TabsContent>
        <TabsContent value="drafts">
          <div className="grid gap-4">
            {draftArticles.map(a => <ArticleCard key={a.id} a={a} />)}
            {draftArticles.length === 0 && <p className="text-muted-foreground text-center py-8">No drafts.</p>}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Article" : "Add New Article"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div><Label>Title - ಕನ್ನಡ (ಶೀರ್ಷಿಕೆ)</Label><Input value={form.title} onChange={e => updateForm({ title: e.target.value })} /></div>
            <div><Label>Title - English</Label><Input value={form.title_en} onChange={e => updateForm({ title_en: e.target.value })} placeholder="English title (optional)" /></div>
            <div><Label>Description - ಕನ್ನಡ (ವಿವರಣೆ)</Label><Textarea rows={3} value={form.description} onChange={e => updateForm({ description: e.target.value })} /></div>
            <div><Label>Description - English</Label><Textarea rows={3} value={form.description_en} onChange={e => updateForm({ description_en: e.target.value })} placeholder="English description (optional)" /></div>
            <div><Label>Category</Label>
              <select className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background" value={form.category_id} onChange={e => updateForm({ category_id: e.target.value })}>
                <option value="">Select category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div><Label>Tags (comma separated)</Label><Input value={form.tags} onChange={e => updateForm({ tags: e.target.value })} /></div>

            <MultiImageUploader images={articleImages} onChange={updateImages} maxImages={3} showCoverBadge folderPrefix="articles/" />

            <div><Label>YouTube Video URL (optional)</Label><Input value={form.youtube_url} onChange={e => updateForm({ youtube_url: e.target.value })} placeholder="https://youtube.com/watch?v=..." /></div>
            <div><Label>Article Type</Label>
              <select className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background" value={form.article_type} onChange={e => updateForm({ article_type: e.target.value })}>
                <option value="normal">Normal</option>
                <option value="live">Live</option>
                <option value="podcast">Podcast</option>
              </select>
            </div>
            <div><Label>Home Page Position</Label>
              <select className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background" value={form.home_position} onChange={e => updateForm({ home_position: e.target.value })}>
                <option value="none">None</option>
                <option value="big_card">Big Card (1 Large Featured)</option>
                <option value="latest_news">Latest News (5 Items List)</option>
                <option value="featured">Featured (Right 6 Cards)</option>
                <option value="main">Main (Our Districts)</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="is_breaking">Breaking News</Label>
              <Switch id="is_breaking" checked={form.is_breaking} onCheckedChange={v => updateForm({ is_breaking: v })} />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => handleSave("draft")} disabled={saving}>
                <Save className="h-4 w-4 mr-2" /> Save as Draft
              </Button>
              <Button className="flex-1" onClick={() => handleSave("published")} disabled={saving}>
                {saving ? "Saving..." : "Publish"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageNews;
