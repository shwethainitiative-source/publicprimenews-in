import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Check, X, Trash2, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface Submission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  article_title: string;
  category_id: string | null;
  image_url: string | null;
  content: string;
  status: string;
  created_at: string;
  categories?: { name: string } | null;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const ManageSubmissions = () => {
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState<Submission | null>(null);

  const fetchSubmissions = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("article_submissions")
      .select("*, categories(name)")
      .order("created_at", { ascending: false });
    setSubmissions((data as Submission[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("article_submissions")
      .update({ status })
      .eq("id", id);
    if (error) {
      toast({ title: "Failed to update", variant: "destructive" });
    } else {
      toast({ title: `Submission ${status}` });
      fetchSubmissions();
    }
  };

  const deleteSubmission = async (id: string) => {
    if (!confirm("Delete this submission?")) return;
    const { error } = await supabase
      .from("article_submissions")
      .delete()
      .eq("id", id);
    if (error) {
      toast({ title: "Delete failed", variant: "destructive" });
    } else {
      toast({ title: "Submission deleted" });
      fetchSubmissions();
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Article Submissions</h1>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : submissions.length === 0 ? (
        <p className="text-muted-foreground">No submissions yet.</p>
      ) : (
        <div className="space-y-3">
          {submissions.map((sub) => (
            <div
              key={sub.id}
              className="bg-card border border-border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-3"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm truncate">{sub.article_title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {sub.name} · {sub.email}
                  {sub.categories?.name && ` · ${sub.categories.name}`}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(sub.created_at).toLocaleDateString()}
                </p>
              </div>

              <Badge className={statusColors[sub.status] || ""}>
                {sub.status}
              </Badge>

              <div className="flex items-center gap-1.5">
                <Button variant="ghost" size="icon" onClick={() => setViewing(sub)} title="View">
                  <Eye className="h-4 w-4" />
                </Button>
                {sub.status === "pending" && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-green-600"
                      onClick={() => updateStatus(sub.id, "approved")}
                      title="Approve"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600"
                      onClick={() => updateStatus(sub.id, "rejected")}
                      title="Reject"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive"
                  onClick={() => deleteSubmission(sub.id)}
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Dialog */}
      <Dialog open={!!viewing} onOpenChange={() => setViewing(null)}>
        <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{viewing?.article_title}</DialogTitle>
          </DialogHeader>
          {viewing && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div><span className="font-semibold">Name:</span> {viewing.name}</div>
                <div><span className="font-semibold">Email:</span> {viewing.email}</div>
                {viewing.phone && <div><span className="font-semibold">Phone:</span> {viewing.phone}</div>}
                {viewing.categories?.name && (
                  <div><span className="font-semibold">Category:</span> {viewing.categories.name}</div>
                )}
              </div>
              {viewing.image_url && (
                <img
                  src={viewing.image_url}
                  alt="Submission"
                  className="w-full max-h-60 object-cover rounded-md"
                />
              )}
              <div className="whitespace-pre-wrap text-muted-foreground leading-relaxed border-t border-border pt-3">
                {viewing.content}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageSubmissions;
