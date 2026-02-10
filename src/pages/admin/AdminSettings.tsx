import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";

type SiteSettings = Tables<"site_settings">;

const AdminSettings = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [form, setForm] = useState({
    website_logo_url: "", contact_number: "", email: "",
    youtube_link: "", facebook_link: "", instagram_link: "",
    whatsapp_group_link: "", show_login_button: false,
  });
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("site_settings").select("*").limit(1).single();
      if (data) {
        setSettings(data);
        setForm({
          website_logo_url: data.website_logo_url ?? "",
          contact_number: data.contact_number ?? "",
          email: data.email ?? "",
          youtube_link: data.youtube_link ?? "",
          facebook_link: data.facebook_link ?? "",
          instagram_link: data.instagram_link ?? "",
          whatsapp_group_link: data.whatsapp_group_link ?? "",
          show_login_button: data.show_login_button,
        });
      }
    };
    fetch();
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);

    let website_logo_url = form.website_logo_url;
    if (logoFile) {
      const ext = logoFile.name.split(".").pop();
      const path = `logo-${Date.now()}.${ext}`;
      const { error: uploadErr } = await supabase.storage.from("site-assets").upload(path, logoFile);
      if (uploadErr) { toast({ title: "Upload failed", description: uploadErr.message, variant: "destructive" }); setSaving(false); return; }
      const { data: urlData } = supabase.storage.from("site-assets").getPublicUrl(path);
      website_logo_url = urlData.publicUrl;
    }

    const { error } = await supabase.from("site_settings").update({
      ...form, website_logo_url,
    }).eq("id", settings.id);

    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else toast({ title: "Settings saved!" });
    setSaving(false);
  };

  if (!settings) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-2xl font-bold text-foreground">General Settings</h2>

      <Card>
        <CardHeader><CardTitle className="text-lg">Website Logo</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {form.website_logo_url && <img src={form.website_logo_url} alt="Logo" className="h-16 object-contain" />}
          <Input type="file" accept="image/*" onChange={e => setLogoFile(e.target.files?.[0] ?? null)} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-lg">Contact Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label>Contact Number</Label><Input value={form.contact_number} onChange={e => setForm({ ...form, contact_number: e.target.value })} /></div>
          <div><Label>Email</Label><Input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-lg">Social Media Links</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label>YouTube</Label><Input value={form.youtube_link} onChange={e => setForm({ ...form, youtube_link: e.target.value })} /></div>
          <div><Label>Facebook</Label><Input value={form.facebook_link} onChange={e => setForm({ ...form, facebook_link: e.target.value })} /></div>
          <div><Label>Instagram</Label><Input value={form.instagram_link} onChange={e => setForm({ ...form, instagram_link: e.target.value })} /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-lg">WhatsApp Group</CardTitle></CardHeader>
        <CardContent>
          <div><Label>WhatsApp Group Link</Label><Input value={form.whatsapp_group_link} onChange={e => setForm({ ...form, whatsapp_group_link: e.target.value })} /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-lg">Frontend Options</CardTitle></CardHeader>
        <CardContent>
          <label className="flex items-center gap-3"><Switch checked={form.show_login_button} onCheckedChange={v => setForm({ ...form, show_login_button: v })} /> Show Login Button on Website</label>
        </CardContent>
      </Card>

      <Button className="w-full" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Settings"}</Button>
    </div>
  );
};

export default AdminSettings;
