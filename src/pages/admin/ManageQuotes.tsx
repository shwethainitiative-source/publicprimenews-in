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

type QuoteRow = Tables<"quotes">;

const ManageQuotes = () => {
  const { user } = useAuth();
  const [quotes, setQuotes] = useState<QuoteRow[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<QuoteRow | null>(null);
  const [form, setForm] = useState({ quote_text: "", author: "" });
  const [saving, setSaving] = useState(false);

  const fetchQuotes = async () => {
    const { data } = await supabase.from("quotes").select("*").order("created_at", { ascending: false });
    setQuotes(data ?? []);
  };

  useEffect(() => { fetchQuotes(); }, []);

  const openNew = () => { setEditing(null); setForm({ quote_text: "", author: "" }); setDialogOpen(true); };
  const openEdit = (q: QuoteRow) => { setEditing(q); setForm({ quote_text: q.quote_text, author: q.author }); setDialogOpen(true); };

  const handleSave = async () => {
    if (!form.quote_text.trim()) { toast({ title: "Quote text required", variant: "destructive" }); return; }
    setSaving(true);
    const payload = { ...form, created_by: user?.id ?? null };
    if (editing) {
      const { error } = await supabase.from("quotes").update(payload).eq("id", editing.id);
      if (error) toast({ title: "Error", description: error.message, variant: "destructive" }); else toast({ title: "Quote updated" });
    } else {
      const { error } = await supabase.from("quotes").insert(payload);
      if (error) toast({ title: "Error", description: error.message, variant: "destructive" }); else toast({ title: "Quote added" });
    }
    setSaving(false); setDialogOpen(false); fetchQuotes();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this quote?")) return;
    await supabase.from("quotes").delete().eq("id", id);
    toast({ title: "Deleted" }); fetchQuotes();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Manage Quotes (ಸುಭಾಷಿತ)</h2>
        <Button onClick={openNew}><Plus className="h-4 w-4 mr-2" /> Add Quote</Button>
      </div>
      <div className="grid gap-4">
        {quotes.map(q => (
          <Card key={q.id}>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex-1 min-w-0">
                <p className="text-foreground italic">"{q.quote_text}"</p>
                <p className="text-xs text-muted-foreground mt-1">— {q.author || "Unknown"}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => openEdit(q)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(q.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {quotes.length === 0 && <p className="text-muted-foreground text-center py-8">No quotes yet.</p>}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? "Edit Quote" : "Add Quote"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Quote (ಸುಭಾಷಿತ)</Label><Textarea rows={3} value={form.quote_text} onChange={e => setForm({ ...form, quote_text: e.target.value })} /></div>
            <div><Label>Author (ಲೇಖಕ)</Label><Input value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} /></div>
            <Button className="w-full" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageQuotes;
