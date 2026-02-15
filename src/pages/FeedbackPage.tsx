import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import HeaderBar from "@/components/HeaderBar";
import NavigationBar from "@/components/NavigationBar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Send, CheckCircle } from "lucide-react";

const FeedbackPage = () => {
  const { language } = useLanguage();
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) {
      toast({ title: language === "kn" ? "ಹೆಸರು ಮತ್ತು ಸಂದೇಶ ಅಗತ್ಯ" : "Name and message are required", variant: "destructive" });
      return;
    }
    if (form.name.length > 100 || form.message.length > 1000 || form.email.length > 255 || form.phone.length > 20) {
      toast({ title: language === "kn" ? "ಅಮಾನ್ಯ ಇನ್‌ಪುಟ್" : "Invalid input length", variant: "destructive" });
      return;
    }
    setSending(true);
    const { error } = await supabase.from("feedback").insert({
      name: form.name.trim(),
      phone: form.phone.trim() || null,
      email: form.email.trim() || null,
      message: form.message.trim(),
    });
    setSending(false);
    if (error) {
      toast({ title: language === "kn" ? "ದೋಷ" : "Error", description: error.message, variant: "destructive" });
    } else {
      setSent(true);
      setForm({ name: "", phone: "", email: "", message: "" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <HeaderBar />
      <NavigationBar />
      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-2xl font-extrabold whitespace-nowrap">
            {language === "kn" ? "ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆ" : "Feedback"}
          </h1>
          <div className="flex-1 h-0.5 bg-primary" />
        </div>

        <div className="max-w-lg mx-auto">
          {sent ? (
            <div className="bg-card rounded-lg border border-border p-8 text-center">
              <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-xl font-bold text-card-foreground mb-2">
                {language === "kn" ? "ಧನ್ಯವಾದಗಳು!" : "Thank You!"}
              </h2>
              <p className="text-muted-foreground">
                {language === "kn" ? "ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆ ಯಶಸ್ವಿಯಾಗಿ ಸಲ್ಲಿಸಲಾಗಿದೆ." : "Your feedback has been submitted successfully."}
              </p>
              <Button className="mt-4" onClick={() => setSent(false)}>
                {language === "kn" ? "ಮತ್ತೊಂದು ಸಲ್ಲಿಸಿ" : "Submit Another"}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-card rounded-lg border border-border p-6 space-y-4">
              <div>
                <Label>{language === "kn" ? "ಹೆಸರು *" : "Name *"}</Label>
                <Input maxLength={100} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <Label>{language === "kn" ? "ದೂರವಾಣಿ" : "Phone"}</Label>
                <Input maxLength={20} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div>
                <Label>{language === "kn" ? "ಇಮೇಲ್" : "Email"}</Label>
                <Input type="email" maxLength={255} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <Label>{language === "kn" ? "ಸಂದೇಶ *" : "Message *"}</Label>
                <Textarea rows={5} maxLength={1000} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required />
              </div>
              <Button type="submit" className="w-full" disabled={sending}>
                <Send className="w-4 h-4 mr-2" />
                {sending ? (language === "kn" ? "ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ..." : "Sending...") : (language === "kn" ? "ಸಲ್ಲಿಸಿ" : "Submit")}
              </Button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FeedbackPage;
