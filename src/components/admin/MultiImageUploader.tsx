import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2, GripVertical, Image as ImageIcon } from "lucide-react";

export interface ImageItem {
  id?: string;
  image_url: string;
  caption: string;
  caption_en: string;
  sort_order: number;
  is_cover?: boolean;
  file?: File;
}

interface MultiImageUploaderProps {
  images: ImageItem[];
  onChange: (images: ImageItem[]) => void;
  maxImages: number;
  showCoverBadge?: boolean;
  bucket?: string;
  folderPrefix?: string;
}

const MultiImageUploader = ({
  images,
  onChange,
  maxImages,
  showCoverBadge = false,
  bucket = "thumbnails",
  folderPrefix = "",
}: MultiImageUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const remaining = maxImages - images.length;
    if (remaining <= 0) {
      toast({ title: `Maximum ${maxImages} images allowed`, variant: "destructive" });
      return;
    }
    const toUpload = files.slice(0, remaining);

    setUploading(true);
    const newImages: ImageItem[] = [];

    for (const file of toUpload) {
      const ext = file.name.split(".").pop();
      const path = `${folderPrefix}${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from(bucket).upload(path, file);
      if (error) {
        toast({ title: "Upload failed", description: error.message, variant: "destructive" });
        continue;
      }
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
      newImages.push({
        image_url: urlData.publicUrl,
        caption: "",
        caption_en: "",
        sort_order: images.length + newImages.length,
        is_cover: images.length === 0 && newImages.length === 0,
      });
    }

    onChange([...images, ...newImages]);
    setUploading(false);
    e.target.value = "";
  };

  const removeImage = (idx: number) => {
    const updated = images.filter((_, i) => i !== idx).map((img, i) => ({
      ...img,
      sort_order: i,
      is_cover: showCoverBadge ? i === 0 : img.is_cover,
    }));
    onChange(updated);
  };

  const updateCaption = (idx: number, field: "caption" | "caption_en", value: string) => {
    const updated = [...images];
    updated[idx] = { ...updated[idx], [field]: value };
    onChange(updated);
  };

  const handleDragStart = (idx: number) => setDragIdx(idx);
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    const updated = [...images];
    const [moved] = updated.splice(dragIdx, 1);
    updated.splice(idx, 0, moved);
    const reordered = updated.map((img, i) => ({
      ...img,
      sort_order: i,
      is_cover: showCoverBadge ? i === 0 : img.is_cover,
    }));
    onChange(reordered);
    setDragIdx(idx);
  };
  const handleDragEnd = () => setDragIdx(null);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-1.5">
          <ImageIcon className="w-4 h-4" /> Images ({images.length}/{maxImages})
        </Label>
        {images.length < maxImages && (
          <Label className="cursor-pointer">
            <Input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileSelect}
              disabled={uploading}
            />
            <Button type="button" size="sm" variant="outline" disabled={uploading} asChild>
              <span><Plus className="w-3 h-3 mr-1" /> {uploading ? "Uploading..." : "Add"}</span>
            </Button>
          </Label>
        )}
      </div>

      {images.length === 0 && (
        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center text-muted-foreground">
          <Label className="cursor-pointer">
            <Input type="file" accept="image/*" multiple className="hidden" onChange={handleFileSelect} disabled={uploading} />
            <span className="text-sm">Click to upload images (max {maxImages})</span>
          </Label>
        </div>
      )}

      <div className="space-y-2">
        {images.map((img, idx) => (
          <div
            key={idx}
            draggable
            onDragStart={() => handleDragStart(idx)}
            onDragOver={(e) => handleDragOver(e, idx)}
            onDragEnd={handleDragEnd}
            className={`flex gap-2 items-start p-2 border border-border rounded-lg bg-card ${dragIdx === idx ? "opacity-50" : ""}`}
          >
            <div className="cursor-grab text-muted-foreground mt-3">
              <GripVertical className="w-4 h-4" />
            </div>
            <div className="relative w-16 h-16 flex-shrink-0">
              <img src={img.image_url} alt="" className="w-full h-full object-cover rounded" />
              {showCoverBadge && idx === 0 && (
                <span className="absolute -top-1 -left-1 bg-primary text-primary-foreground text-[9px] px-1 rounded">Cover</span>
              )}
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <Input
                placeholder="Caption (ಕನ್ನಡ)"
                value={img.caption}
                onChange={(e) => updateCaption(idx, "caption", e.target.value)}
                className="h-7 text-xs"
              />
              <Input
                placeholder="Caption (English)"
                value={img.caption_en}
                onChange={(e) => updateCaption(idx, "caption_en", e.target.value)}
                className="h-7 text-xs"
              />
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0" onClick={() => removeImage(idx)}>
              <Trash2 className="w-3 h-3 text-destructive" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultiImageUploader;
