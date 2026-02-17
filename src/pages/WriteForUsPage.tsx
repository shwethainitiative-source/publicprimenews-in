import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import HeaderBar from "@/components/HeaderBar";
import NavigationBar from "@/components/NavigationBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Upload, Send } from "lucide-react";
import SponsoredCard from "@/components/SponsoredCard";

interface Category {
  id: string;
  name: string;
}

const WriteForUsPage = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    article_title: "",
    category_id: "",
    content: "",
  });

  useEffect(() => {
    supabase
      .from("categories")
      .select("id, name")
      .order("name")
      .then(({ data }) => setCategories(data ?? []));
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.article_title.trim() || !form.content.trim()) {
      toast({
        title: language === "kn" ? "ದಯವಿಟ್ಟು ಎಲ್ಲಾ ಅಗತ್ಯ ಕ್ಷೇತ್ರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ" : "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    let imageUrl: string | null = null;

    // Upload image if provided
    if (imageFile) {
      const ext = imageFile.name.split(".").pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("submission-images")
        .upload(path, imageFile);

      if (uploadError) {
        toast({
          title: language === "kn" ? "ಚಿತ್ರ ಅಪ್‌ಲೋಡ್ ವಿಫಲವಾಗಿದೆ" : "Image upload failed",
          variant: "destructive",
        });
        setSubmitting(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("submission-images")
        .getPublicUrl(path);
      imageUrl = urlData.publicUrl;
    }

    const { error } = await supabase.from("article_submissions").insert({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      article_title: form.article_title.trim(),
      category_id: form.category_id || null,
      image_url: imageUrl,
      content: form.content.trim(),
    });

    setSubmitting(false);

    if (error) {
      toast({
        title: language === "kn" ? "ಸಲ್ಲಿಕೆ ವಿಫಲವಾಗಿದೆ" : "Submission failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: language === "kn"
        ? "ನಿಮ್ಮ ಲೇಖನ ಯಶಸ್ವಿಯಾಗಿ ಸಲ್ಲಿಸಲಾಗಿದೆ!"
        : "Your article has been submitted successfully!",
      description: language === "kn"
        ? "ಅಡ್ಮಿನ್ ಅನುಮೋದನೆಯ ನಂತರ ಪ್ರಕಟವಾಗುತ್ತದೆ."
        : "It will be published after admin approval.",
    });

    setForm({ name: "", email: "", phone: "", article_title: "", category_id: "", content: "" });
    setImageFile(null);
    setImagePreview(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <HeaderBar />
      <NavigationBar />
      <main className="container mx-auto px-4 py-6">
        {/* Title */}
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-2xl font-extrabold whitespace-nowrap">
            {language === "kn" ? "ಬರಹಗಾರರಾಗಿ, ನೀವು ಬರೆಯಿರಿ ..?" : "Write for Us"}
          </h1>
          <div className="flex-1 h-0.5 bg-primary" />
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex-1 min-w-0">
            {/* Intro */}
            <div className="bg-card rounded-lg shadow-sm p-5 mb-6">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {language === "kn"
                  ? "ನಿಮ್ಮ ಲೇಖನಗಳನ್ನು ನಮಗೆ ಕಳುಹಿಸಿ. ಅಡ್ಮಿನ್ ಅನುಮೋದನೆಯ ನಂತರ ನಿಮ್ಮ ಬರಹ ನಮ್ಮ ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿ ಪ್ರಕಟವಾಗುತ್ತದೆ. ಎಲ್ಲಾ ಅಗತ್ಯ ಕ್ಷೇತ್ರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ."
                  : "Submit your articles to us. After admin approval, your writing will be published on our website. Please fill in all required fields."}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-card rounded-lg shadow-sm p-5 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">{language === "kn" ? "ಹೆಸರು *" : "Name *"}</Label>
                  <Input id="name" value={form.name} onChange={(e) => handleChange("name", e.target.value)} placeholder={language === "kn" ? "ನಿಮ್ಮ ಹೆಸರು" : "Your name"} maxLength={100} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">{language === "kn" ? "ಇಮೇಲ್ *" : "Email *"}</Label>
                  <Input id="email" type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} placeholder={language === "kn" ? "ನಿಮ್ಮ ಇಮೇಲ್" : "Your email"} maxLength={255} required />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="phone">{language === "kn" ? "ಫೋನ್" : "Phone"}</Label>
                  <Input id="phone" value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} placeholder={language === "kn" ? "ಫೋನ್ ನಂಬರ್" : "Phone number"} maxLength={20} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="category">{language === "kn" ? "ವರ್ಗ" : "Category"}</Label>
                  <Select value={form.category_id} onValueChange={(v) => handleChange("category_id", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder={language === "kn" ? "ವರ್ಗ ಆಯ್ಕೆಮಾಡಿ" : "Select category"} />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="article_title">{language === "kn" ? "ಲೇಖನ ಶೀರ್ಷಿಕೆ *" : "Article Title *"}</Label>
                <Input id="article_title" value={form.article_title} onChange={(e) => handleChange("article_title", e.target.value)} placeholder={language === "kn" ? "ನಿಮ್ಮ ಲೇಖನದ ಶೀರ್ಷಿಕೆ" : "Title of your article"} maxLength={200} required />
              </div>

              {/* Image Upload */}
              <div className="space-y-1.5">
                <Label>{language === "kn" ? "ಚಿತ್ರ ಅಪ್‌ಲೋಡ್" : "Upload Image"}</Label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-4 py-2.5 rounded-md border border-border bg-muted text-sm cursor-pointer hover:bg-muted/80 transition-colors">
                    <Upload className="w-4 h-4" />
                    {language === "kn" ? "ಚಿತ್ರ ಆಯ್ಕೆಮಾಡಿ" : "Choose Image"}
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  </label>
                  {imageFile && <span className="text-xs text-muted-foreground truncate max-w-[200px]">{imageFile.name}</span>}
                </div>
                {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 w-40 h-28 rounded-md object-cover border border-border" />}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="content">{language === "kn" ? "ಲೇಖನದ ವಿಷಯ *" : "Article Content *"}</Label>
                <Textarea id="content" value={form.content} onChange={(e) => handleChange("content", e.target.value)} placeholder={language === "kn" ? "ನಿಮ್ಮ ಲೇಖನವನ್ನು ಇಲ್ಲಿ ಬರೆಯಿರಿ..." : "Write your article here..."} rows={8} maxLength={10000} required />
              </div>

              <Button type="submit" disabled={submitting} className="gap-2">
                <Send className="w-4 h-4" />
                {submitting ? (language === "kn" ? "ಸಲ್ಲಿಸಲಾಗುತ್ತಿದೆ..." : "Submitting...") : (language === "kn" ? "ಲೇಖನ ಸಲ್ಲಿಸಿ" : "Submit Article")}
              </Button>
            </form>
          </div>

          {/* Right: Ad Slider */}
          <div className="w-full lg:w-72 xl:w-80 flex-shrink-0">
            <SponsoredCard position="sidebar" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WriteForUsPage;
