import { useState, useCallback } from "react";
import Cropper, { Area } from "react-easy-crop";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Crop, RotateCw, ZoomIn } from "lucide-react";

export interface CropResult {
  file: File;
  previewUrl: string;
}

interface ImageCropDialogProps {
  open: boolean;
  imageSrc: string;
  fileName: string;
  onClose: () => void;
  onCropDone: (result: CropResult) => void;
}

const ASPECT_PRESETS = [
  { label: "Free", value: 0 },
  { label: "16:9", value: 16 / 9 },
  { label: "4:3", value: 4 / 3 },
  { label: "1:1", value: 1 },
  { label: "3:4", value: 3 / 4 },
] as const;

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  rotation: number
): Promise<Blob> {
  const image = new Image();
  image.crossOrigin = "anonymous";
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = reject;
    image.src = imageSrc;
  });

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  const radians = (rotation * Math.PI) / 180;
  const sin = Math.abs(Math.sin(radians));
  const cos = Math.abs(Math.cos(radians));
  const bBoxWidth = image.width * cos + image.height * sin;
  const bBoxHeight = image.width * sin + image.height * cos;

  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(radians);
  ctx.translate(-image.width / 2, -image.height / 2);
  ctx.drawImage(image, 0, 0);

  const croppedCanvas = document.createElement("canvas");
  const croppedCtx = croppedCanvas.getContext("2d")!;
  croppedCanvas.width = pixelCrop.width;
  croppedCanvas.height = pixelCrop.height;

  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) => {
    croppedCanvas.toBlob((blob) => resolve(blob!), "image/jpeg", 0.92);
  });
}

const ImageCropDialog = ({
  open,
  imageSrc,
  fileName,
  onClose,
  onCropDone,
}: ImageCropDialogProps) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [aspect, setAspect] = useState(16 / 9);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [processing, setProcessing] = useState(false);

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleDone = async () => {
    if (!croppedAreaPixels) return;
    setProcessing(true);
    try {
      const blob = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
      const ext = fileName.split(".").pop() || "jpg";
      const croppedFile = new File([blob], `cropped-${Date.now()}.${ext}`, { type: "image/jpeg" });
      const previewUrl = URL.createObjectURL(blob);
      onCropDone({ file: croppedFile, previewUrl });
    } catch {
      // fallback: use original
    }
    setProcessing(false);
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg max-h-[95vh] overflow-y-auto p-4">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-sm">
            <Crop className="w-4 h-4" /> Crop & Resize Image
          </DialogTitle>
        </DialogHeader>

        <div className="relative w-full h-64 bg-muted rounded-lg overflow-hidden">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspect || undefined}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        {/* Aspect Ratio Presets */}
        <div className="space-y-1">
          <Label className="text-xs">Aspect Ratio</Label>
          <div className="flex gap-1.5 flex-wrap">
            {ASPECT_PRESETS.map((p) => (
              <Button
                key={p.label}
                type="button"
                size="sm"
                variant={aspect === p.value ? "default" : "outline"}
                className="h-7 text-xs px-2.5"
                onClick={() => setAspect(p.value)}
              >
                {p.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Zoom */}
        <div className="space-y-1">
          <Label className="text-xs flex items-center gap-1">
            <ZoomIn className="w-3 h-3" /> Zoom
          </Label>
          <Slider
            value={[zoom]}
            min={1}
            max={3}
            step={0.05}
            onValueChange={([v]) => setZoom(v)}
          />
        </div>

        {/* Rotation */}
        <div className="space-y-1">
          <Label className="text-xs flex items-center gap-1">
            <RotateCw className="w-3 h-3" /> Rotation ({rotation}°)
          </Label>
          <Slider
            value={[rotation]}
            min={0}
            max={360}
            step={1}
            onValueChange={([v]) => setRotation(v)}
          />
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={handleSkip}>
            Skip (Use Original)
          </Button>
          <Button className="flex-1" onClick={handleDone} disabled={processing}>
            {processing ? "Processing..." : "Apply Crop"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageCropDialog;
