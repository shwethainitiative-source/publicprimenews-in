import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Video = Tables<"youtube_videos">;

const ManageVideos = () => {
  const { user } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Video | null>(null);
  const [form, setForm] = useState({ title: "", description: "", youtube_url: "", video_type: "normal", thumbnail_url: "" });
  const [saving, setSaving] = useState(false);

  const fetchVideos = async () => {
    const { data } = await supabase.from("youtube_videos").select("*").order("created_at", { ascending: false });
    setVideos(data ?? []);
  };

  useEffect(() => { fetchVideos(); }, []);

  const openNew = () => { setEditing(null); setForm({ title: "", description: "", youtube_url: "", video_type: "normal", thumbnail_url: "" }); setDialogOpen(true); };
  const openEdit = (v: Video) => { setEditing(v); setForm({ title: v.title, description: v.description ?? "", youtube_url: v.youtube_url, video_type: v.video_type, thumbnail_url: v.thumbnail_url ?? "" }); setDialogOpen(true); };

  const handleSave = async () => {
    if (!form.title.trim() || !form.youtube_url.trim()) { toast({ title: "Title and URL required", variant: "destructive" }); return; }
    setSaving(true);
    const payload = { ...form, description: form.description || null, thumbnail_url: form.thumbnail_url || null, created_by: user?.id ?? null };
    if (editing) {
      const { error } = await supabase.from("youtube_videos").update(payload).eq("id", editing.id);
      if (error) toast({ title: "Error", description: error.message, variant: "destructive" }); else toast({ title: "Video updated" });
    } else {
      const { error } = await supabase.from("youtube_videos").insert(payload);
      if (error) toast({ title: "Error", description: error.message, variant: "destructive" }); else toast({ title: "Video added" });
    }
    setSaving(false); setDialogOpen(false); fetchVideos();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this video?")) return;
    await supabase.from("youtube_videos").delete().eq("id", id);
    toast({ title: "Deleted" }); fetchVideos();
  };

  const typeLabel = (t: string) => t === "live" ? "🔴 LIVE" : t === "podcast" ? "🎙️ Podcast" : "📹 Normal";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Manage Videos</h2>
        <Button onClick={openNew}><Plus className="h-4 w-4 mr-2" /> Add Video</Button>
      </div>
      <div className="grid gap-4">
        {videos.map(v => (
          <Card key={v.id}>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">{v.title}</h3>
                <p className="text-xs text-muted-foreground">{typeLabel(v.video_type)} • {new Date(v.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => openEdit(v)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(v.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {videos.length === 0 && <p className="text-muted-foreground text-center py-8">No videos yet.</p>}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? "Edit Video" : "Add Video"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Title</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
            <div><Label>YouTube URL</Label><Input value={form.youtube_url} onChange={e => setForm({ ...form, youtube_url: e.target.value })} /></div>
            <div><Label>Description</Label><Textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
            <div><Label>Thumbnail URL (optional)</Label><Input value={form.thumbnail_url} onChange={e => setForm({ ...form, thumbnail_url: e.target.value })} /></div>
            <div><Label>Video Type</Label>
              <select className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background" value={form.video_type} onChange={e => setForm({ ...form, video_type: e.target.value })}>
                <option value="normal">Normal Video</option>
                <option value="live">LIVE Show</option>
                <option value="podcast">Podcast</option>
              </select>
            </div>
            <Button className="w-full" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageVideos;
