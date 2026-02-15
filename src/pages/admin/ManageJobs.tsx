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

interface Job {
  id: string; title: string; title_en: string | null; company_name: string; company_name_en: string | null;
  location: string | null; location_en: string | null; qualification: string | null; qualification_en: string | null;
  job_type: string | null; salary: string | null; salary_en: string | null; last_date: string | null;
  apply_link: string | null; description: string | null; description_en: string | null; created_at: string;
}

const ManageJobs = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Job | null>(null);
  const [form, setForm] = useState({
    title: "", title_en: "", company_name: "", company_name_en: "",
    location: "", location_en: "", qualification: "", qualification_en: "",
    job_type: "full-time", salary: "", salary_en: "", last_date: "",
    apply_link: "", description: "", description_en: "",
  });
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    const { data } = await supabase.from("jobs").select("*").order("created_at", { ascending: false });
    setJobs((data as Job[]) ?? []);
  };
  useEffect(() => { fetchData(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ title: "", title_en: "", company_name: "", company_name_en: "", location: "", location_en: "", qualification: "", qualification_en: "", job_type: "full-time", salary: "", salary_en: "", last_date: "", apply_link: "", description: "", description_en: "" });
    setDialogOpen(true);
  };

  const openEdit = (j: Job) => {
    setEditing(j);
    setForm({
      title: j.title, title_en: j.title_en ?? "", company_name: j.company_name, company_name_en: j.company_name_en ?? "",
      location: j.location ?? "", location_en: j.location_en ?? "", qualification: j.qualification ?? "", qualification_en: j.qualification_en ?? "",
      job_type: j.job_type ?? "full-time", salary: j.salary ?? "", salary_en: j.salary_en ?? "",
      last_date: j.last_date ?? "", apply_link: j.apply_link ?? "", description: j.description ?? "", description_en: j.description_en ?? "",
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) { toast({ title: "Title is required", variant: "destructive" }); return; }
    setSaving(true);
    const payload: any = {
      title: form.title, title_en: form.title_en || null, company_name: form.company_name, company_name_en: form.company_name_en || null,
      location: form.location || null, location_en: form.location_en || null, qualification: form.qualification || null, qualification_en: form.qualification_en || null,
      job_type: form.job_type || "full-time", salary: form.salary || null, salary_en: form.salary_en || null,
      last_date: form.last_date || null, apply_link: form.apply_link || null, description: form.description || null, description_en: form.description_en || null,
      created_by: user?.id ?? null,
    };
    const { error } = editing
      ? await supabase.from("jobs").update(payload).eq("id", editing.id)
      : await supabase.from("jobs").insert(payload);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else toast({ title: editing ? "Job updated" : "Job added" });
    setSaving(false); setDialogOpen(false); fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this job?")) return;
    await supabase.from("jobs").delete().eq("id", id);
    toast({ title: "Deleted" }); fetchData();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Manage Jobs</h2>
        <Button onClick={openNew}><Plus className="h-4 w-4 mr-2" /> Add Job</Button>
      </div>
      <div className="grid gap-4">
        {jobs.map(j => (
          <Card key={j.id}>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">{j.title}</h3>
                <p className="text-xs text-muted-foreground">{j.company_name} • {j.location} • {j.job_type}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => openEdit(j)}><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(j.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {jobs.length === 0 && <p className="text-muted-foreground text-center py-8">No jobs yet.</p>}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Edit Job" : "Add New Job"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Title (ಕನ್ನಡ)</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
            <div><Label>Title (English)</Label><Input value={form.title_en} onChange={e => setForm({ ...form, title_en: e.target.value })} /></div>
            <div><Label>Company (ಕನ್ನಡ)</Label><Input value={form.company_name} onChange={e => setForm({ ...form, company_name: e.target.value })} /></div>
            <div><Label>Company (English)</Label><Input value={form.company_name_en} onChange={e => setForm({ ...form, company_name_en: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Location (ಕನ್ನಡ)</Label><Input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} /></div>
              <div><Label>Location (English)</Label><Input value={form.location_en} onChange={e => setForm({ ...form, location_en: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Qualification (ಕನ್ನಡ)</Label><Input value={form.qualification} onChange={e => setForm({ ...form, qualification: e.target.value })} /></div>
              <div><Label>Qualification (English)</Label><Input value={form.qualification_en} onChange={e => setForm({ ...form, qualification_en: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Salary (ಕನ್ನಡ)</Label><Input value={form.salary} onChange={e => setForm({ ...form, salary: e.target.value })} /></div>
              <div><Label>Salary (English)</Label><Input value={form.salary_en} onChange={e => setForm({ ...form, salary_en: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Job Type</Label>
                <select className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background" value={form.job_type} onChange={e => setForm({ ...form, job_type: e.target.value })}>
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="contract">Contract</option>
                </select>
              </div>
              <div><Label>Last Date</Label><Input type="date" value={form.last_date} onChange={e => setForm({ ...form, last_date: e.target.value })} /></div>
            </div>
            <div><Label>Apply Link</Label><Input value={form.apply_link} onChange={e => setForm({ ...form, apply_link: e.target.value })} /></div>
            <div><Label>Description (ಕನ್ನಡ)</Label><Textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
            <div><Label>Description (English)</Label><Textarea rows={3} value={form.description_en} onChange={e => setForm({ ...form, description_en: e.target.value })} /></div>
            <Button className="w-full" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageJobs;
