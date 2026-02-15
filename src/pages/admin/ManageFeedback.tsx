import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Trash2, Mail, Phone } from "lucide-react";

interface Feedback {
  id: string; name: string; phone: string | null; email: string | null; message: string; created_at: string;
}

const ManageFeedback = () => {
  const [items, setItems] = useState<Feedback[]>([]);

  const fetchData = async () => {
    const { data } = await supabase.from("feedback").select("*").order("created_at", { ascending: false });
    setItems((data as Feedback[]) ?? []);
  };
  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this feedback?")) return;
    await supabase.from("feedback").delete().eq("id", id);
    toast({ title: "Deleted" }); fetchData();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Feedback ({items.length})</h2>
      <div className="grid gap-4">
        {items.map(f => (
          <Card key={f.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground">{f.name}</h3>
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-1">
                    {f.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {f.email}</span>}
                    {f.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {f.phone}</span>}
                    <span>{new Date(f.created_at).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-foreground mt-2">{f.message}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(f.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {items.length === 0 && <p className="text-muted-foreground text-center py-8">No feedback yet.</p>}
      </div>
    </div>
  );
};

export default ManageFeedback;
